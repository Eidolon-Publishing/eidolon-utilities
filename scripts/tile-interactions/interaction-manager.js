/**
 * Tile Interaction Manager (singleton)
 *
 * Watches tiles flagged with hover effects and/or click animations.
 * - Hover: persistent TileAnimator per tile, starts in "idle" state on canvasReady,
 *   transitions to "hover" on pointer enter, back to "idle" on leave.
 *   If only idle is configured → behaviours play by default, stop on hover.
 *   If only enter is configured → nothing by default, behaviours on hover.
 *   If both → idle behaviours default, enter behaviours on hover.
 * - Click bounce: plays forward + reverse tween, both commit:false.
 * - Click toggle: plays forward or reverse tween, commit:true, persists toggle state.
 *
 * Listeners are bubble-phase on #board so cinematic capture-phase listeners
 * take priority.
 */

import { pointWithinTile } from "../common/geometry/point-within-tile.js";
import { TileAnimator } from "../cinematic/tile-animator.js";
import { getTweenType } from "../tween/core/registry.js";

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "tile-interactions";

// ── State ──────────────────────────────────────────────────────────────

/** @type {Map<string, { doc: TileDocument, placeable: PlaceableObject, hoverConfig: object|null, clickConfig: Array|null }>} */
const watchedTiles = new Map();

/** @type {Map<string, TileAnimator>} */
const activeHoverAnimators = new Map();

/** @type {WeakMap<TileDocument, boolean>} */
const toggleStates = new WeakMap();

/** @type {Set<string>} */
const clickingTiles = new Set();

/** Track which tile the pointer is currently hovering over. */
let hoveredTileId = null;

/** Saved cursor style for restoration on hover leave. */
let savedCursor = null;

/** Bound listener references for cleanup. */
let boundPointerMove = null;
let boundPointerDown = null;

// ── Helpers ────────────────────────────────────────────────────────────

/**
 * Parse the hover flag into a normalized { idle, enter } shape.
 * Supports:
 *   - { idle: [...], enter: [...] }  → two-state config
 *   - [...] (legacy flat array)      → treated as enter-only
 *   - null/undefined                 → null
 */
function parseHoverConfig(raw) {
	if (!raw) return null;

	// New object format: { idle: [...], enter: [...] }
	if (!Array.isArray(raw) && typeof raw === "object") {
		const idle = Array.isArray(raw.idle) && raw.idle.length ? raw.idle : null;
		const enter = Array.isArray(raw.enter) && raw.enter.length ? raw.enter : null;
		if (!idle && !enter) return null;
		return { idle, enter };
	}

	// Legacy flat array → enter-only
	if (Array.isArray(raw) && raw.length) {
		return { idle: null, enter: raw };
	}

	return null;
}

function getInteractionFlag(doc) {
	return doc?.getFlag?.(MODULE_ID, FLAG_KEY) ?? null;
}

function canvasToLocal(event) {
	const layer = canvas.activeLayer;
	if (!layer) return null;
	const pt = layer.toLocal(event);
	if (!pt || Number.isNaN(pt.x) || Number.isNaN(pt.y)) return null;
	return pt;
}

/**
 * Hit-test all watched tiles against a canvas-space point.
 * Returns the topmost hit (highest sort) or null.
 */
function hitTest(pt) {
	let best = null;
	let bestSort = -Infinity;
	for (const [id, entry] of watchedTiles) {
		if (pointWithinTile(entry.doc, pt)) {
			const sort = entry.doc.sort ?? 0;
			if (sort > bestSort) {
				best = entry;
				bestSort = sort;
			}
		}
	}
	return best;
}

// ── Hover lifecycle ────────────────────────────────────────────────────

/**
 * Build a TileAnimator config from the parsed hover config.
 * Maps { idle, enter } → TileAnimator's { idle, hover } states.
 */
function buildAnimatorConfig(hoverConfig) {
	return {
		idle: hoverConfig.idle ?? ["none"],
		hover: hoverConfig.enter ?? ["none"],
	};
}

/**
 * Start a persistent hover animator for a tile.
 * Begins in "idle" state.
 */
function startHoverAnimator(tileId, placeable, hoverConfig) {
	stopHoverAnimator(tileId);

	const animConfig = buildAnimatorConfig(hoverConfig);
	const animator = new TileAnimator(placeable, animConfig);
	animator.start("idle");
	activeHoverAnimators.set(tileId, animator);
}

/**
 * Fully detach and remove a hover animator.
 */
function stopHoverAnimator(tileId) {
	const animator = activeHoverAnimators.get(tileId);
	if (!animator) return;
	animator.detach();
	activeHoverAnimators.delete(tileId);
}

// ── Click lifecycle ────────────────────────────────────────────────────

/**
 * Build tween execute params for a click animation config.
 */
function buildClickParams(uuid, config, forward, refGeometry) {
	if (config.type === "tile-tint") {
		return { uuid, toColor: forward ? config.toColor : config.fromColor, mode: config.mode };
	}
	if (config.type === "tile-scale") {
		return {
			uuid,
			toScale: forward ? config.toScale : config.fromScale,
			...refGeometry,
		};
	}
	// tile-prop
	return { uuid, attribute: config.attribute, value: forward ? config.to : config.from };
}

/**
 * Capture reference geometry from the tile source for scale tweens.
 */
function captureRefGeometry(doc) {
	const origW = doc._source.width;
	const origH = doc._source.height;
	const origX = doc._source.x;
	const origY = doc._source.y;
	return {
		baseWidth: origW,
		baseHeight: origH,
		centerX: origX + origW / 2,
		centerY: origY + origH / 2,
	};
}

/**
 * Play a single click animation (bounce or toggle).
 */
async function playClickAnimation(doc, config) {
	const uuid = doc.uuid;
	const type = config.type ?? "tile-prop";
	const tweenDef = getTweenType(type);
	if (!tweenDef) {
		console.warn(`[${MODULE_ID}] tile-interactions: unknown tween type "${type}"`);
		return;
	}

	const period = config.period ?? 300;
	const easing = config.easing ?? "easeOutCubic";
	const mode = config.mode ?? "bounce";

	const refGeometry = type === "tile-scale" ? captureRefGeometry(doc) : null;

	if (mode === "toggle") {
		const isToggled = toggleStates.get(doc) ?? false;
		const forward = !isToggled;

		await tweenDef.execute(
			buildClickParams(uuid, config, forward, refGeometry),
			{ durationMS: period, easing, commit: true }
		);

		toggleStates.set(doc, forward);
	} else {
		// Bounce: forward then reverse, both commit:false
		const halfPeriod = period / 2;

		await tweenDef.execute(
			buildClickParams(uuid, config, true, refGeometry),
			{ durationMS: halfPeriod, easing, commit: false }
		);

		await tweenDef.execute(
			buildClickParams(uuid, config, false, refGeometry),
			{ durationMS: halfPeriod, easing, commit: false }
		);
	}
}

/**
 * Handle a click on a watched tile: pause hover animator, play click tweens, resume.
 */
async function handleClick(entry) {
	const tileId = entry.doc.id;
	if (clickingTiles.has(tileId)) return; // debounce
	clickingTiles.add(tileId);

	try {
		// Stop hover animator temporarily so click tween has clean state
		stopHoverAnimator(tileId);

		// Play all click animations in parallel
		const promises = entry.clickConfig.map((config) => playClickAnimation(entry.doc, config));
		await Promise.all(promises);
	} finally {
		clickingTiles.delete(tileId);

		// Restart hover animator if tile still has hover config
		if (entry.hoverConfig) {
			startHoverAnimator(tileId, entry.placeable, entry.hoverConfig);

			// If pointer is still over the tile, switch to hover state
			if (hoveredTileId === tileId) {
				activeHoverAnimators.get(tileId)?.setState("hover");
			}
		}
	}
}

// ── Event handlers ─────────────────────────────────────────────────────

function onPointerMove(event) {
	const pt = canvasToLocal(event);
	if (!pt) return;

	const hit = hitTest(pt);
	const hitId = hit?.doc.id ?? null;

	// No change
	if (hitId === hoveredTileId) return;

	// Leave previous → switch back to idle
	if (hoveredTileId) {
		const prevAnimator = activeHoverAnimators.get(hoveredTileId);
		if (prevAnimator) prevAnimator.setState("idle");
	}

	// Enter new → switch to hover
	if (hitId) {
		const animator = activeHoverAnimators.get(hitId);
		if (animator) animator.setState("hover");
	}

	hoveredTileId = hitId;

	// Cursor management
	if (hitId && (hit.hoverConfig || hit.clickConfig?.length)) {
		if (savedCursor === null) {
			savedCursor = document.body.style.cursor;
		}
		document.body.style.cursor = "pointer";
	} else if (savedCursor !== null) {
		document.body.style.cursor = savedCursor;
		savedCursor = null;
	}
}

function onPointerDown(event) {
	if (event.button !== 0) return;

	const pt = canvasToLocal(event);
	if (!pt) return;

	const hit = hitTest(pt);
	if (!hit || !hit.clickConfig?.length) return;

	// Don't consume the event — let it propagate (bubble phase, not capture)
	handleClick(hit);
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Rebuild the watched tiles map from the current scene.
 * Called on canvasReady.
 */
export function rebuild() {
	// Cleanup existing state
	for (const tileId of activeHoverAnimators.keys()) {
		stopHoverAnimator(tileId);
	}
	watchedTiles.clear();
	clickingTiles.clear();
	hoveredTileId = null;
	if (savedCursor !== null) {
		document.body.style.cursor = savedCursor;
		savedCursor = null;
	}

	// Remove old listeners
	const board = document.getElementById("board");
	if (boundPointerMove) {
		board?.removeEventListener("pointermove", boundPointerMove);
		boundPointerMove = null;
	}
	if (boundPointerDown) {
		board?.removeEventListener("pointerdown", boundPointerDown);
		boundPointerDown = null;
	}

	// Scan tiles
	const tiles = canvas.tiles?.placeables;
	if (!Array.isArray(tiles)) return;

	for (const tile of tiles) {
		const doc = tile.document;
		const flag = getInteractionFlag(doc);
		if (!flag) continue;

		const hoverConfig = parseHoverConfig(flag.hover);
		const clickConfig = Array.isArray(flag.click) && flag.click.length ? flag.click : null;

		if (!hoverConfig && !clickConfig) continue;

		watchedTiles.set(doc.id, { doc, placeable: tile, hoverConfig, clickConfig });

		// Start persistent hover animator in idle state
		if (hoverConfig) {
			startHoverAnimator(doc.id, tile, hoverConfig);
		}
	}

	// Install listeners only if there are watched tiles
	if (watchedTiles.size === 0) return;

	boundPointerMove = onPointerMove;
	boundPointerDown = onPointerDown;
	board?.addEventListener("pointermove", boundPointerMove);
	board?.addEventListener("pointerdown", boundPointerDown);
}

/**
 * Re-read a tile's flag and update/remove from watched set.
 * Called on updateTile.
 */
export function updateTile(doc) {
	const tileId = doc.id;
	const flag = getInteractionFlag(doc);

	const hoverConfig = flag ? parseHoverConfig(flag.hover) : null;
	const clickConfig = flag && Array.isArray(flag.click) && flag.click.length ? flag.click : null;

	if (!hoverConfig && !clickConfig) {
		removeTile(doc);
		return;
	}

	// Stop existing animator
	stopHoverAnimator(tileId);

	const placeable = doc.object;
	if (!placeable) {
		watchedTiles.delete(tileId);
		return;
	}

	watchedTiles.set(tileId, { doc, placeable, hoverConfig, clickConfig });

	// Restart hover animator with new config
	if (hoverConfig) {
		startHoverAnimator(tileId, placeable, hoverConfig);
	}

	// Re-install listeners if this is the first watched tile
	ensureListeners();
}

/**
 * Remove a tile from watched set and clean up.
 * Called on deleteTile.
 */
export function removeTile(doc) {
	const tileId = doc.id;
	stopHoverAnimator(tileId);
	watchedTiles.delete(tileId);
	clickingTiles.delete(tileId);

	if (hoveredTileId === tileId) {
		hoveredTileId = null;
		if (savedCursor !== null) {
			document.body.style.cursor = savedCursor;
			savedCursor = null;
		}
	}

	// Remove listeners if no more watched tiles
	if (watchedTiles.size === 0) {
		const board = document.getElementById("board");
		if (boundPointerMove) {
			board?.removeEventListener("pointermove", boundPointerMove);
			boundPointerMove = null;
		}
		if (boundPointerDown) {
			board?.removeEventListener("pointerdown", boundPointerDown);
			boundPointerDown = null;
		}
	}
}

/**
 * Ensure listeners are attached if there are watched tiles.
 */
function ensureListeners() {
	if (watchedTiles.size === 0) return;
	if (boundPointerMove) return; // already attached

	const board = document.getElementById("board");
	if (!board) return;

	boundPointerMove = onPointerMove;
	boundPointerDown = onPointerDown;
	board.addEventListener("pointermove", boundPointerMove);
	board.addEventListener("pointerdown", boundPointerDown);
}

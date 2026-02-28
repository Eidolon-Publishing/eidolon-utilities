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
const NEW_FLAG_KEY = "tile-animations";
const OLD_IDLE_FLAG = "idle-animation";

// ── Migration: unified config reader ───────────────────────────────────

/**
 * Convert an old idle-animation tween config into a behaviour entry.
 * { type: "tile-prop", attribute: "alpha", from: 0.85, to: 1, period: 1500, easing: "easeInOutCosine" }
 * → { name: "tween-prop", attribute: "alpha", from: 0.85, to: 1, period: 1500, easing: "easeInOutCosine" }
 */
function migrateIdleTweenToAlways(config) {
	const type = config.type ?? "tile-prop";
	if (type === "tile-tint") {
		return { name: "tween-tint", fromColor: config.fromColor, toColor: config.toColor, mode: config.mode, period: config.period, easing: config.easing };
	}
	if (type === "tile-scale") {
		return { name: "tween-scale", fromScale: config.fromScale, toScale: config.toScale, period: config.period, easing: config.easing };
	}
	// tile-prop
	return { name: "tween-prop", attribute: config.attribute, from: config.from, to: config.to, period: config.period, easing: config.easing };
}

/**
 * Read the unified tile-animations config from a tile document,
 * with migration fallback for old idle-animation and tile-interactions flags.
 *
 * Returns: { always: [], idle: [], hover: [], click: [] } or null if no config.
 */
export function readUnifiedConfig(doc) {
	// Prefer new unified flag
	const unified = doc?.getFlag?.(MODULE_ID, NEW_FLAG_KEY);
	if (unified) return unified;

	// Migration: read old flags
	const oldIdleRaw = doc?.getFlag?.(MODULE_ID, OLD_IDLE_FLAG);
	const oldInteractions = doc?.getFlag?.(MODULE_ID, FLAG_KEY);

	let always = [];
	let idle = [];
	let hover = [];
	let click = [];

	// Migrate old idle-animation → always
	if (oldIdleRaw) {
		let entries;
		if (Array.isArray(oldIdleRaw)) {
			entries = oldIdleRaw;
		} else if (typeof oldIdleRaw === "object" && "0" in oldIdleRaw) {
			entries = Object.values(oldIdleRaw);
		} else if (typeof oldIdleRaw === "object" && (oldIdleRaw.type || oldIdleRaw.attribute)) {
			entries = [oldIdleRaw];
		} else {
			entries = [];
		}
		always = entries.filter(c => c && typeof c === "object").map(migrateIdleTweenToAlways);
	}

	// Migrate old tile-interactions → idle/hover/click
	if (oldInteractions) {
		if (oldInteractions.hover) {
			if (Array.isArray(oldInteractions.hover)) {
				// Legacy flat array → hover-only
				hover = oldInteractions.hover;
			} else if (typeof oldInteractions.hover === "object") {
				idle = Array.isArray(oldInteractions.hover.idle) ? oldInteractions.hover.idle : [];
				hover = Array.isArray(oldInteractions.hover.enter) ? oldInteractions.hover.enter : [];
			}
		}
		if (Array.isArray(oldInteractions.click) && oldInteractions.click.length) {
			click = oldInteractions.click;
		}
	}

	const hasData = always.length > 0 || idle.length > 0 || hover.length > 0 || click.length > 0;
	if (!hasData) return null;

	return { always, idle, hover, click };
}

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
 * Build a TileAnimator config from the unified config.
 * Maps { always, idle, hover } → TileAnimator's config shape.
 */
function buildAnimatorConfig(unifiedConfig) {
	return {
		always: unifiedConfig.always ?? [],
		idle: unifiedConfig.idle?.length ? unifiedConfig.idle : ["none"],
		hover: unifiedConfig.hover?.length ? unifiedConfig.hover : ["none"],
	};
}

/**
 * Start a persistent animator for a tile.
 * Begins in "idle" state.
 */
function startHoverAnimator(tileId, placeable, unifiedConfig) {
	stopHoverAnimator(tileId);

	const animConfig = buildAnimatorConfig(unifiedConfig);
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

		// Restart animator if tile still has animation config
		const hasAnimations = entry.animConfig && ((entry.animConfig.always?.length > 0) || (entry.animConfig.idle?.length > 0) || (entry.animConfig.hover?.length > 0));
		if (hasAnimations) {
			startHoverAnimator(tileId, entry.placeable, entry.animConfig);

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
	if (hitId && (hit.animConfig || hit.clickConfig?.length)) {
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
		const config = readUnifiedConfig(doc);
		if (!config) continue;

		const hasAnimations = (config.always?.length > 0) || (config.idle?.length > 0) || (config.hover?.length > 0);
		const clickConfig = Array.isArray(config.click) && config.click.length ? config.click : null;

		if (!hasAnimations && !clickConfig) continue;

		watchedTiles.set(doc.id, { doc, placeable: tile, animConfig: config, clickConfig });

		// Start persistent animator (always + idle/hover states)
		if (hasAnimations) {
			startHoverAnimator(doc.id, tile, config);
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
	const config = readUnifiedConfig(doc);

	const hasAnimations = config && ((config.always?.length > 0) || (config.idle?.length > 0) || (config.hover?.length > 0));
	const clickConfig = config && Array.isArray(config.click) && config.click.length ? config.click : null;

	if (!hasAnimations && !clickConfig) {
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

	watchedTiles.set(tileId, { doc, placeable, animConfig: config, clickConfig });

	// Restart animator with new config
	if (hasAnimations) {
		startHoverAnimator(tileId, placeable, config);
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

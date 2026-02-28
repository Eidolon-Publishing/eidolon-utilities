/**
 * Placeable Interaction Manager (singleton)
 *
 * Watches tiles AND drawings flagged with hover effects, click animations,
 * and/or click-to-macro.
 * - Hover: persistent TileAnimator per placeable, starts in "idle" state on
 *   canvasReady, transitions to "hover" on pointer enter, back to "idle" on leave.
 * - Click bounce: plays forward + reverse tween, both commit:false.
 * - Click toggle: plays forward or reverse tween, commit:true, persists toggle state.
 * - Click macro: executes a Foundry macro UUID after click animations finish.
 *
 * Listeners are bubble-phase on #board so cinematic capture-phase listeners
 * take priority.
 */

import { pointWithinTile } from "../common/geometry/point-within-tile.js";
import { pointWithinDrawing } from "../common/geometry/point-within-drawing.js";
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
 * Read the unified tile-animations config from a tile or drawing document,
 * with migration fallback for old idle-animation and tile-interactions flags.
 *
 * Returns: { always: [], idle: [], hover: [], click: [], macro?: string } or null if no config.
 */
export function readUnifiedConfig(doc) {
	// Prefer new unified flag
	const unified = doc?.getFlag?.(MODULE_ID, NEW_FLAG_KEY);
	if (unified) return unified;

	// Migration: read old flags (tiles only — drawings never had old flags)
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

/**
 * @typedef {object} WatchedEntry
 * @property {Document} doc  Tile or Drawing document
 * @property {PlaceableObject} placeable  The PIXI placeable
 * @property {object|null} animConfig  Unified animation config
 * @property {Array|null} clickConfig  Click tween configs
 * @property {string|null} macroUuid  Click-to-macro UUID
 * @property {"tile"|"drawing"} placeableType
 */

/** @type {Map<string, WatchedEntry>} */
const watchedPlaceables = new Map();

/** @type {Map<string, TileAnimator>} */
const activeHoverAnimators = new Map();

/** @type {WeakMap<Document, boolean>} */
const toggleStates = new WeakMap();

/** @type {Set<string>} */
const clickingPlaceables = new Set();

/** Track which placeable the pointer is currently hovering over. */
let hoveredPlaceableId = null;

/** Saved cursor style for restoration on hover leave. */
let savedCursor = null;

/** Bound listener references for cleanup. */
let boundPointerMove = null;
let boundPointerDown = null;
let boundPointerLeave = null;

// ── Helpers ────────────────────────────────────────────────────────────

function canvasToLocal(event) {
	const layer = canvas.activeLayer;
	if (!layer) return null;
	const pt = layer.toLocal(event);
	if (!pt || Number.isNaN(pt.x) || Number.isNaN(pt.y)) return null;
	return pt;
}

/**
 * Hit-test all watched placeables against a canvas-space point.
 * Returns the topmost hit or null.
 * Drawings render above tiles, so they get a layer bonus in z-ordering.
 */
function hitTest(pt) {
	let best = null;
	let bestScore = -Infinity;
	for (const [id, entry] of watchedPlaceables) {
		const isHit = entry.placeableType === "drawing"
			? pointWithinDrawing(entry.doc, pt)
			: pointWithinTile(entry.doc, pt);
		if (!isHit) continue;

		// Drawings layer renders above tiles — give them a z-bonus
		const sort = (entry.doc.sort ?? 0) + (entry.placeableType === "drawing" ? 1e9 : 0);
		if (sort > bestScore) {
			best = entry;
			bestScore = sort;
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
 * Start a persistent animator for a placeable.
 * Begins in "idle" state.
 */
function startHoverAnimator(placeableId, placeable, unifiedConfig) {
	stopHoverAnimator(placeableId);

	const animConfig = buildAnimatorConfig(unifiedConfig);
	const animator = new TileAnimator(placeable, animConfig);
	animator.start("idle");
	activeHoverAnimators.set(placeableId, animator);
}

/**
 * Fully detach and remove a hover animator.
 */
function stopHoverAnimator(placeableId) {
	const animator = activeHoverAnimators.get(placeableId);
	if (!animator) return;
	animator.detach();
	activeHoverAnimators.delete(placeableId);
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
 * Handle a click on a watched placeable: pause hover animator, play click tweens,
 * execute macro, resume.
 */
async function handleClick(entry) {
	const placeableId = entry.doc.id;
	if (clickingPlaceables.has(placeableId)) return; // debounce
	clickingPlaceables.add(placeableId);

	try {
		// Stop hover animator temporarily so click tween has clean state
		stopHoverAnimator(placeableId);

		// Play all click animations in parallel
		if (entry.clickConfig?.length) {
			const promises = entry.clickConfig.map((config) => playClickAnimation(entry.doc, config));
			await Promise.all(promises);
		}

		// Execute macro if configured
		if (entry.macroUuid) {
			const macro = await fromUuid(entry.macroUuid);
			if (macro) {
				macro.execute({ placeable: entry.placeable });
			} else {
				console.warn(`[${MODULE_ID}] tile-interactions: macro not found: ${entry.macroUuid}`);
			}
		}
	} finally {
		clickingPlaceables.delete(placeableId);

		// Restart animator if placeable still has animation config
		const hasAnimations = entry.animConfig && ((entry.animConfig.always?.length > 0) || (entry.animConfig.idle?.length > 0) || (entry.animConfig.hover?.length > 0));
		if (hasAnimations) {
			startHoverAnimator(placeableId, entry.placeable, entry.animConfig);

			// If pointer is still over the placeable, switch to hover state
			if (hoveredPlaceableId === placeableId) {
				activeHoverAnimators.get(placeableId)?.setState("hover");
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
	if (hitId === hoveredPlaceableId) return;

	// Leave previous → switch back to idle
	if (hoveredPlaceableId) {
		const prevAnimator = activeHoverAnimators.get(hoveredPlaceableId);
		if (prevAnimator) prevAnimator.setState("idle");
	}

	// Enter new → switch to hover
	if (hitId) {
		const animator = activeHoverAnimators.get(hitId);
		if (animator) animator.setState("hover");
	}

	hoveredPlaceableId = hitId;

	// Cursor + click only on the token layer — other layers need normal select/edit
	const onTokenLayer = canvas.tokens?.active;

	// Cursor management: show pointer if explicitly opted in, or if has click/macro (backward compat)
	const cursorFlag = hit?.animConfig?.cursor;
	const showCursor = onTokenLayer && hitId && (cursorFlag === true || (cursorFlag !== false && (hit.clickConfig?.length || hit.macroUuid)));
	const board = document.getElementById("board");
	if (showCursor) {
		if (savedCursor === null) {
			savedCursor = board?.style.cursor ?? "";
		}
		if (board) board.style.cursor = "pointer";
	} else if (savedCursor !== null) {
		if (board) board.style.cursor = savedCursor;
		savedCursor = null;
	}
}

function onPointerDown(event) {
	if (event.button !== 0) return;

	// Only fire click-to-macro on the token layer — other layers need normal select/edit
	if (!canvas.tokens?.active) return;

	const pt = canvasToLocal(event);
	if (!pt) return;

	const hit = hitTest(pt);
	if (!hit) return;
	if (!hit.clickConfig?.length && !hit.macroUuid) return;

	// Don't consume the event — let it propagate (bubble phase, not capture)
	handleClick(hit);
}

/**
 * Reset hover state when the pointer leaves the board element.
 * This handles cases where another window (e.g. MATT journal) opens on top
 * and pointermove events stop reaching #board, leaving a placeable stuck in hover.
 */
function onPointerLeave() {
	if (hoveredPlaceableId) {
		const prevAnimator = activeHoverAnimators.get(hoveredPlaceableId);
		if (prevAnimator) prevAnimator.setState("idle");
		hoveredPlaceableId = null;
	}
	if (savedCursor !== null) {
		const board = document.getElementById("board");
		if (board) board.style.cursor = savedCursor;
		savedCursor = null;
	}
}

// ── Internal: register a placeable into the watched set ────────────────

/**
 * Parse a document's config and add to watched set if it has interactions.
 * @param {Document} doc
 * @param {PlaceableObject} placeable
 * @param {"tile"|"drawing"} placeableType
 */
function registerPlaceable(doc, placeable, placeableType) {
	const config = readUnifiedConfig(doc);
	if (!config) return;

	const hasAnimations = (config.always?.length > 0) || (config.idle?.length > 0) || (config.hover?.length > 0);
	const clickConfig = Array.isArray(config.click) && config.click.length ? config.click : null;
	const macroUuid = config.macro || null;

	if (!hasAnimations && !clickConfig && !macroUuid) return;

	watchedPlaceables.set(doc.id, { doc, placeable, animConfig: config, clickConfig, macroUuid, placeableType });

	// Start persistent animator (always + idle/hover states)
	if (hasAnimations) {
		startHoverAnimator(doc.id, placeable, config);
	}
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Rebuild the watched placeables map from the current scene.
 * Called on canvasReady.
 */
export function rebuild() {
	// Cleanup existing state
	for (const placeableId of activeHoverAnimators.keys()) {
		stopHoverAnimator(placeableId);
	}
	watchedPlaceables.clear();
	clickingPlaceables.clear();
	hoveredPlaceableId = null;
	if (savedCursor !== null) {
		const boardEl = document.getElementById("board");
		if (boardEl) boardEl.style.cursor = savedCursor;
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
	if (boundPointerLeave) {
		board?.removeEventListener("pointerleave", boundPointerLeave);
		boundPointerLeave = null;
	}

	// Scan tiles
	const tiles = canvas.tiles?.placeables;
	if (Array.isArray(tiles)) {
		for (const tile of tiles) {
			registerPlaceable(tile.document, tile, "tile");
		}
	}

	// Scan drawings
	const drawings = canvas.drawings?.placeables;
	if (Array.isArray(drawings)) {
		for (const drawing of drawings) {
			registerPlaceable(drawing.document, drawing, "drawing");
		}
	}

	// Install listeners only if there are watched placeables
	if (watchedPlaceables.size === 0) return;

	boundPointerMove = onPointerMove;
	boundPointerDown = onPointerDown;
	boundPointerLeave = onPointerLeave;
	board?.addEventListener("pointermove", boundPointerMove);
	board?.addEventListener("pointerdown", boundPointerDown);
	board?.addEventListener("pointerleave", boundPointerLeave);
}

/**
 * Re-read a tile's flag and update/remove from watched set.
 * Called on updateTile.
 */
export function updateTile(doc) {
	updatePlaceable(doc, "tile");
}

/**
 * Remove a tile from watched set and clean up.
 * Called on deleteTile.
 */
export function removeTile(doc) {
	removePlaceable(doc);
}

/**
 * Re-read a drawing's flag and update/remove from watched set.
 * Called on updateDrawing.
 */
export function updateDrawing(doc) {
	updatePlaceable(doc, "drawing");
}

/**
 * Remove a drawing from watched set and clean up.
 * Called on deleteDrawing.
 */
export function removeDrawing(doc) {
	removePlaceable(doc);
}

// ── Internal update/remove ─────────────────────────────────────────────

function updatePlaceable(doc, placeableType) {
	const placeableId = doc.id;
	const config = readUnifiedConfig(doc);

	const hasAnimations = config && ((config.always?.length > 0) || (config.idle?.length > 0) || (config.hover?.length > 0));
	const clickConfig = config && Array.isArray(config.click) && config.click.length ? config.click : null;
	const macroUuid = config?.macro || null;

	if (!hasAnimations && !clickConfig && !macroUuid) {
		removePlaceable(doc);
		return;
	}

	// Stop existing animator
	stopHoverAnimator(placeableId);

	const placeable = doc.object;
	if (!placeable) {
		watchedPlaceables.delete(placeableId);
		return;
	}

	watchedPlaceables.set(placeableId, { doc, placeable, animConfig: config, clickConfig, macroUuid, placeableType });

	// Restart animator with new config
	if (hasAnimations) {
		startHoverAnimator(placeableId, placeable, config);
	}

	// Re-install listeners if this is the first watched placeable
	ensureListeners();
}

function removePlaceable(doc) {
	const placeableId = doc.id;
	stopHoverAnimator(placeableId);
	watchedPlaceables.delete(placeableId);
	clickingPlaceables.delete(placeableId);

	if (hoveredPlaceableId === placeableId) {
		hoveredPlaceableId = null;
		if (savedCursor !== null) {
			const board = document.getElementById("board");
			if (board) board.style.cursor = savedCursor;
			savedCursor = null;
		}
	}

	// Remove listeners if no more watched placeables
	if (watchedPlaceables.size === 0) {
		const board = document.getElementById("board");
		if (boundPointerMove) {
			board?.removeEventListener("pointermove", boundPointerMove);
			boundPointerMove = null;
		}
		if (boundPointerDown) {
			board?.removeEventListener("pointerdown", boundPointerDown);
			boundPointerDown = null;
		}
		if (boundPointerLeave) {
			board?.removeEventListener("pointerleave", boundPointerLeave);
			boundPointerLeave = null;
		}
	}
}

/**
 * Ensure listeners are attached if there are watched placeables.
 */
function ensureListeners() {
	if (watchedPlaceables.size === 0) return;
	if (boundPointerMove) return; // already attached

	const board = document.getElementById("board");
	if (!board) return;

	boundPointerMove = onPointerMove;
	boundPointerDown = onPointerDown;
	boundPointerLeave = onPointerLeave;
	board.addEventListener("pointermove", boundPointerMove);
	board.addEventListener("pointerdown", boundPointerDown);
	board.addEventListener("pointerleave", boundPointerLeave);
}

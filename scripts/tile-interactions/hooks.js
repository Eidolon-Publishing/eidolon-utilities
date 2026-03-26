import {
	rebuild,
	refreshInteractions,
	updateTile,
	removeTile,
	updateDrawing,
	removeDrawing,
} from "./interaction-manager.js";
import { renderAnimationSection } from "./ui/tile-interaction-section.js";
import { stopAllLoops, stopLoopsForTile } from "../idle-animations/loop-runner.js";

const MODULE_ID = "eidolon-utilities";

// All three flag keys we watch for changes
const FLAG_KEYS = ["tile-animations", "tile-interactions", "idle-animation"];

function onCanvasTearDown() {
	// Stop all animations BEFORE Foundry destroys PIXI objects.
	// Without this, the ticker fires during scene teardown and
	// accesses mesh.scale on a destroyed DisplayObject (transform = null).
	stopAllLoops();
	rebuild(); // rebuild with no scene clears all state + removes ticker
}

function onCanvasReady() {
	// Stop any lingering legacy idle-animation loops
	stopAllLoops();

	rebuild();
}

function onUpdateTile(doc, changes) {
	const flagChange = changes?.flags?.[MODULE_ID];
	if (!flagChange) return;

	// Check if any of the three flag keys changed
	const relevant = FLAG_KEYS.some(key => key in flagChange || `-=${key}` in flagChange);
	if (!relevant) return;

	// Stop legacy loops for this tile (migration: old idle-animation may have been running)
	stopLoopsForTile(doc.id);

	updateTile(doc);
}

function onCreateTile(doc) {
	updateTile(doc);
}

function onDeleteTile(doc) {
	stopLoopsForTile(doc.id);
	removeTile(doc);
}

function onRenderTileConfig(app, html) {
	renderAnimationSection(app, html);
}

// ── Drawing hooks ──────────────────────────────────────────────────────

function onUpdateDrawing(doc, changes) {
	const flagChange = changes?.flags?.[MODULE_ID];
	if (!flagChange) return;

	const relevant = FLAG_KEYS.some(key => key in flagChange || `-=${key}` in flagChange);
	if (!relevant) return;

	updateDrawing(doc);
}

function onCreateDrawing(doc) {
	updateDrawing(doc);
}

function onDeleteDrawing(doc) {
	removeDrawing(doc);
}

function onRenderDrawingConfig(app, html) {
	renderAnimationSection(app, html);
}

// ── Registration ───────────────────────────────────────────────────────

export function registerTileInteractionHooks() {
	Hooks.on("canvasTearDown", onCanvasTearDown);
	Hooks.on("canvasReady", onCanvasReady);
	Hooks.on("createTile", onCreateTile);
	Hooks.on("updateTile", onUpdateTile);
	Hooks.on("deleteTile", onDeleteTile);
	Hooks.on("renderTileConfig", onRenderTileConfig);
	Hooks.on("createDrawing", onCreateDrawing);
	Hooks.on("updateDrawing", onUpdateDrawing);
	Hooks.on("deleteDrawing", onDeleteDrawing);
	Hooks.on("renderDrawingConfig", onRenderDrawingConfig);

	Hooks.once("ready", () => {
		const mod = game.modules.get(MODULE_ID);
		if (!mod) return;
		if (!mod.api) mod.api = {};

		mod.api.tileInteractions = {
			rebuild,
			refresh: refreshInteractions,
		};

		console.log(`[${MODULE_ID}] Tile Interactions API registered.`);
	});
}

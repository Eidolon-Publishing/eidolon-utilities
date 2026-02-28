import { rebuild, updateTile, removeTile } from "./interaction-manager.js";
import { renderAnimationSection } from "./ui/tile-interaction-section.js";
import { stopAllLoops, stopLoopsForTile } from "../idle-animations/loop-runner.js";

const MODULE_ID = "eidolon-utilities";

// All three flag keys we watch for changes
const FLAG_KEYS = ["tile-animations", "tile-interactions", "idle-animation"];

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

function onDeleteTile(doc) {
	stopLoopsForTile(doc.id);
	removeTile(doc);
}

function onRenderTileConfig(app, html) {
	renderAnimationSection(app, html);
}

export function registerTileInteractionHooks() {
	Hooks.on("canvasReady", onCanvasReady);
	Hooks.on("updateTile", onUpdateTile);
	Hooks.on("deleteTile", onDeleteTile);
	Hooks.on("renderTileConfig", onRenderTileConfig);
}

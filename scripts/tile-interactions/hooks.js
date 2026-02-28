import { rebuild, updateTile, removeTile } from "./interaction-manager.js";
import { renderInteractionSection } from "./ui/tile-interaction-section.js";

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "tile-interactions";

function onCanvasReady() {
	rebuild();
}

function onUpdateTile(doc, changes) {
	const flagChange = changes?.flags?.[MODULE_ID];
	if (!flagChange || !(FLAG_KEY in flagChange || `-=${FLAG_KEY}` in flagChange)) return;

	updateTile(doc);
}

function onDeleteTile(doc) {
	removeTile(doc);
}

function onRenderTileConfig(app, html) {
	renderInteractionSection(app, html);
}

export function registerTileInteractionHooks() {
	Hooks.on("canvasReady", onCanvasReady);
	Hooks.on("updateTile", onUpdateTile);
	Hooks.on("deleteTile", onDeleteTile);
	Hooks.on("renderTileConfig", onRenderTileConfig);
}

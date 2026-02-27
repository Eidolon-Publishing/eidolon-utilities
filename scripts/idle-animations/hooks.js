import { startAllLoops, stopLoopsForTile, stopAllLoops, getIdleAnimationConfigs } from "./loop-runner.js";
import { renderAnimationTab } from "./ui/tile-animation-tab.js";

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "idle-animation";

function onCanvasReady() {
	stopAllLoops();

	const tiles = canvas.tiles?.placeables;
	if (!Array.isArray(tiles)) return;

	for (const tile of tiles) {
		const configs = getIdleAnimationConfigs(tile.document);
		if (configs.length > 0) {
			startAllLoops(tile, configs);
		}
	}
}

function onUpdateTile(doc, changes) {
	const flagChange = changes?.flags?.[MODULE_ID];
	if (!flagChange || !(FLAG_KEY in flagChange || `-=${FLAG_KEY}` in flagChange)) return;

	const configs = getIdleAnimationConfigs(doc);
	if (configs.length > 0 && doc.object) {
		startAllLoops(doc.object, configs);
	} else {
		stopLoopsForTile(doc.id);
	}
}

function onDeleteTile(doc) {
	stopLoopsForTile(doc.id);
}

function onRenderTileConfig(app, html) {
	renderAnimationTab(app, html);
}

export function registerIdleAnimationHooks() {
	Hooks.on("canvasReady", onCanvasReady);
	Hooks.on("updateTile", onUpdateTile);
	Hooks.on("deleteTile", onDeleteTile);
	Hooks.on("renderTileConfig", onRenderTileConfig);
}

/**
 * Hook registration for the canvas popup feature.
 */

import { MODULE_ID } from "./core/constants.js";
import { CanvasPopup } from "./core/canvas-popup.js";
import { createOptionList } from "./ui/option-list.js";

export function registerCanvasPopupHooks() {
	Hooks.once("ready", () => {
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.canvasPopup = {
			CanvasPopup,
			content: { createOptionList },
		};

		console.log(`[${MODULE_ID}] Canvas Popup API registered.`);
	});

	// Clean up all popups on scene teardown
	Hooks.on("canvasTearDown", () => CanvasPopup.destroyAll());
}

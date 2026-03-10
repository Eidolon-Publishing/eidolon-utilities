/**
 * Hook registration for the soft-vision feature.
 *
 * Hooks:
 *   - init:  Register settings
 *   - setup: Register vision mode (built-in modes exist by now, needed for class resolution)
 *   - ready: Fallback registration + public API
 */

import { MODULE_ID, VISION_MODE_ID } from "./core/constants.js";
import { registerSettings } from "./core/settings.js";
import { refreshVisionMode } from "./core/vision-mode.js";

export function registerSoftVisionHooks() {
	Hooks.once("init", () => {
		registerSettings(refreshVisionMode);
	});

	// In v12, VisionMode and ColorAdjustmentsSamplerShader are script-scope
	// globals invisible to ES modules. We resolve them from built-in vision
	// mode instances, which requires those to exist first.
	Hooks.once("setup", () => {
		refreshVisionMode();
	});

	Hooks.once("ready", () => {
		// Ensure vision mode is registered (fallback if setup was too early)
		if (!CONFIG.Canvas.visionModes[VISION_MODE_ID]) {
			refreshVisionMode();
		}

		// Register the public API
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.softVision = {
			VISION_MODE_ID,

			/** Apply the Soft Fade vision mode to all currently controlled tokens. */
			async applyToControlled() {
				const controlled = canvas.tokens.controlled;
				if (!controlled.length) {
					ui.notifications.warn("Select at least one token.");
					return;
				}
				for (const token of controlled) {
					await token.document.updateVisionMode(VISION_MODE_ID, true);
				}
			},
		};

		console.log(`[${MODULE_ID}] Soft Vision API registered.`);
	});
}

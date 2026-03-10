/**
 * Soft Fade vision mode — a custom VisionMode with a
 * ColorAdjustmentsSamplerShader that renders radial falloff
 * (bright center, darkening toward the vision edge).
 */

import {
	VISION_MODE_ID,
	MODULE_ID,
	SETTING_ATTENUATION,
	SETTING_BRIGHTNESS,
	SETTING_CONTRAST,
	SETTING_SATURATION,
} from "./constants.js";
import { getNumberSetting } from "./settings.js";

/**
 * Resolve the VisionMode class across Foundry versions.
 *
 * - v13+: foundry.canvas.perception.VisionMode
 * - v12:  script-scope global, invisible to ES modules.
 *         Grab it from an existing built-in instance's constructor.
 */
function getVisionModeClass() {
	return (
		foundry?.canvas?.perception?.VisionMode ??
		CONFIG.Canvas.visionModes.basic?.constructor
	);
}

/**
 * Resolve the ColorAdjustmentsSamplerShader class.
 *
 * Same problem as VisionMode — script-scope global in v12.
 * Darkvision's canvas shader is the same class, so grab it from there.
 */
function getColorAdjustmentsShader() {
	return (
		foundry?.canvas?.rendering?.ColorAdjustmentsSamplerShader ??
		CONFIG.Canvas.visionModes.darkvision?.canvas?.shader
	);
}

/**
 * Build a fresh VisionMode instance from the current settings.
 * Returns null if required classes aren't available yet.
 */
function buildSoftVisionMode() {
	const VMClass = getVisionModeClass();
	const ShaderClass = getColorAdjustmentsShader();
	if (!VMClass || !ShaderClass) return null;

	return new VMClass({
		id: VISION_MODE_ID,
		label: "Soft Fade",
		tokenConfig: true,
		canvas: {
			shader: ShaderClass,
			uniforms: { contrast: 0, saturation: 0, brightness: 0 },
		},
		vision: {
			defaults: {
				attenuation: getNumberSetting(SETTING_ATTENUATION),
				brightness: getNumberSetting(SETTING_BRIGHTNESS),
				contrast: getNumberSetting(SETTING_CONTRAST),
				saturation: getNumberSetting(SETTING_SATURATION),
			},
		},
	});
}

/**
 * Register (or re-register) the Soft Fade vision mode in the global config.
 * After replacing the mode, kicks the perception system so tokens
 * already using it pick up the new defaults immediately.
 */
export function refreshVisionMode() {
	const mode = buildSoftVisionMode();
	if (!mode) {
		console.warn(`[${MODULE_ID}] Soft Vision: required classes not available yet, deferring.`);
		return false;
	}

	CONFIG.Canvas.visionModes[VISION_MODE_ID] = mode;

	if (canvas?.ready) {
		canvas.perception?.update({ refreshVision: true, refreshLighting: true });
	}
	return true;
}

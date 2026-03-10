/**
 * Settings registration for the soft-vision feature.
 *
 * All settings are client-scoped — each player controls their own softness.
 */

import {
	MODULE_ID,
	SETTING_ATTENUATION,
	SETTING_BRIGHTNESS,
	SETTING_CONTRAST,
	SETTING_SATURATION,
	DEFAULTS,
} from "./constants.js";

/**
 * Read a numeric setting with a safe fallback.
 */
export function getNumberSetting(key) {
	try {
		const n = Number(game.settings.get(MODULE_ID, key));
		return Number.isFinite(n) ? n : DEFAULTS[settingToDefaultKey(key)];
	} catch {
		return DEFAULTS[settingToDefaultKey(key)] ?? 0;
	}
}

/** Map setting key → DEFAULTS key. */
function settingToDefaultKey(key) {
	const map = {
		[SETTING_ATTENUATION]: "attenuation",
		[SETTING_BRIGHTNESS]: "brightness",
		[SETTING_CONTRAST]: "contrast",
		[SETTING_SATURATION]: "saturation",
	};
	return map[key];
}

/**
 * Register all soft-vision settings.
 *
 * @param {() => void} onVisionModeChange  Called when any vision parameter changes.
 */
export function registerSettings(onVisionModeChange) {
	game.settings.register(MODULE_ID, SETTING_ATTENUATION, {
		name: "Soft Fade: Attenuation",
		hint: "How strongly the vision darkens toward the perimeter (0 = uniform, 1 = full falloff).",
		scope: "client",
		config: true,
		type: Number,
		default: DEFAULTS.attenuation,
		range: { min: 0, max: 1, step: 0.05 },
		onChange: onVisionModeChange,
	});

	game.settings.register(MODULE_ID, SETTING_BRIGHTNESS, {
		name: "Soft Fade: Brightness",
		hint: "Negative values darken the outer ring of vision.",
		scope: "client",
		config: true,
		type: Number,
		default: DEFAULTS.brightness,
		range: { min: -1, max: 1, step: 0.05 },
		onChange: onVisionModeChange,
	});

	game.settings.register(MODULE_ID, SETTING_CONTRAST, {
		name: "Soft Fade: Contrast",
		hint: "Negative values soften the scene near the vision edge.",
		scope: "client",
		config: true,
		type: Number,
		default: DEFAULTS.contrast,
		range: { min: -1, max: 1, step: 0.05 },
		onChange: onVisionModeChange,
	});

	game.settings.register(MODULE_ID, SETTING_SATURATION, {
		name: "Soft Fade: Saturation",
		hint: "Negative values desaturate toward the vision edge.",
		scope: "client",
		config: true,
		type: Number,
		default: DEFAULTS.saturation,
		range: { min: -1, max: 1, step: 0.05 },
		onChange: onVisionModeChange,
	});
}

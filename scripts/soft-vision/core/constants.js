import { MODULE_ID as BASE_MODULE_ID } from "../../time-triggers/core/constants.js";

export const MODULE_ID = BASE_MODULE_ID;

export const SETTING_ATTENUATION = "softVisionAttenuation";
export const SETTING_BRIGHTNESS = "softVisionBrightness";
export const SETTING_CONTRAST = "softVisionContrast";
export const SETTING_SATURATION = "softVisionSaturation";

export const VISION_MODE_ID = "softFade";

export const DEFAULTS = Object.freeze({
	attenuation: 0.9,
	brightness: -0.1,
	contrast: -0.2,
	saturation: -0.1,
});

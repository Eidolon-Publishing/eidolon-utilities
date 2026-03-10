import { MODULE_ID as BASE_MODULE_ID } from "../../time-triggers/core/constants.js";

export const MODULE_ID = BASE_MODULE_ID;
export const FLAG_SOFT_LIGHT_FADE = "softLightFade";

export const DEFAULTS = Object.freeze({
	enabled: false,
	threshold: 0.3,
	saturation: -0.8,
	brightness: -0.15,
});

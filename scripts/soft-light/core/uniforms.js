/**
 * Monkey-patch _updateCommonUniforms on BaseLightSource to inject
 * per-light soft fade uniforms from document flags.
 *
 * After the original method sets standard uniforms, we read the light's
 * `eidolon-utilities.softLightFade` flag and push values to the shader.
 */

import { MODULE_ID, FLAG_SOFT_LIGHT_FADE, DEFAULTS } from "./constants.js";

/**
 * Find the BaseLightSource prototype that owns _updateCommonUniforms.
 * Walk up from PointLightSource.
 */
function getBaseLightSourceProto() {
	const PLS = foundry?.canvas?.sources?.PointLightSource;
	if (!PLS) return null;

	let proto = PLS.prototype;
	while (proto) {
		if (proto.hasOwnProperty("_updateCommonUniforms")) return proto;
		proto = Object.getPrototypeOf(proto);
	}
	return null;
}

/**
 * Install the monkey-patch. Call during `setup` hook.
 * @returns {boolean} true if successfully installed
 */
export function patchUniformUpdater() {
	const proto = getBaseLightSourceProto();
	if (!proto) {
		console.warn(`[${MODULE_ID}] Soft Light: could not find _updateCommonUniforms on BaseLightSource`);
		return false;
	}

	const original = proto._updateCommonUniforms;

	proto._updateCommonUniforms = function patchedUpdateCommonUniforms(shader) {
		// Call the original first
		original.call(this, shader);

		// Only apply to lights with our uniforms available
		const u = shader?.uniforms;
		if (!u || !("softFadeEnabled" in u)) return;

		// Read flags from the light document
		// this.object is the AmbientLight placeable (or Token); .document is the document
		const doc = this.object?.document;
		if (!doc) {
			u.softFadeEnabled = false;
			return;
		}

		const flags = doc.getFlag?.(MODULE_ID, FLAG_SOFT_LIGHT_FADE);
		if (!flags?.enabled) {
			u.softFadeEnabled = false;
			return;
		}

		u.softFadeEnabled = true;
		u.softFadeThreshold = flags.threshold ?? DEFAULTS.threshold;
		u.softFadeSaturation = flags.saturation ?? DEFAULTS.saturation;
		u.softFadeBrightness = flags.brightness ?? DEFAULTS.brightness;
	};

	return true;
}

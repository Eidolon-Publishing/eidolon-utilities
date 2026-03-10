/**
 * Patch all illumination shader classes to support per-light soft fade.
 *
 * At `init` time, CONFIG.Canvas.lightAnimations is populated but no shader
 * instances exist yet. We collect every illumination shader class (base +
 * animation subclasses), inject GLSL uniform declarations and distance-based
 * color grading logic into each class's static `fragmentShader` string, and
 * extend `defaultUniforms` with our soft fade parameters.
 *
 * Lights without the flag keep `softFadeEnabled = false` — the GPU skips the
 * block entirely. Zero visual or performance impact.
 */

import { DEFAULTS } from "./constants.js";

// ----- GLSL snippets -----

const UNIFORM_DECLARATIONS = `
  uniform bool softFadeEnabled;
  uniform float softFadeThreshold;
  uniform float softFadeSaturation;
  uniform float softFadeBrightness;`;

const SOFT_FADE_LOGIC = `
    // Soft Light Fade — per-light radial desaturation/darkening
    if ( softFadeEnabled ) {
      float sfFade = smoothstep(softFadeThreshold, 1.0, dist);
      if ( sfFade > 0.0 ) {
        vec3 sfGrey = vec3(perceivedBrightness(finalColor));
        finalColor = mix(finalColor, sfGrey, sfFade * (-softFadeSaturation));
        finalColor *= 1.0 + (sfFade * softFadeBrightness);
      }
    }
`;

// ----- Injection targets (resolved text from Foundry's template literals) -----

// Inject uniforms after the last existing uniform line in FRAGMENT_UNIFORMS.
// `uniform float saturation;` is reliably present in all illumination shaders.
const UNIFORM_ANCHOR = "uniform float saturation;";

// Inject soft fade logic before the FALLOFF line.
const FALLOFF_ANCHOR = "if ( attenuation != 0.0 ) depth *= smoothstep(";

/**
 * Collect all unique illumination shader classes from CONFIG.Canvas.lightAnimations
 * plus the base AdaptiveIlluminationShader itself.
 */
function collectIlluminationShaders() {
	const classes = new Set();

	// Grab every animation-specific illumination shader
	for (const entry of Object.values(CONFIG.Canvas.lightAnimations)) {
		if (entry.illuminationShader) {
			classes.add(entry.illuminationShader);
		}
	}

	// Walk prototype chain from any subclass to find AdaptiveIlluminationShader
	if (classes.size > 0) {
		const sample = classes.values().next().value;
		let proto = Object.getPrototypeOf(sample);
		while (proto && proto !== Function.prototype) {
			// AdaptiveIlluminationShader has SHADER_HEADER and extends AdaptiveLightingShader
			if (proto.hasOwnProperty("SHADER_HEADER") && typeof proto.fragmentShader === "string") {
				classes.add(proto);
				break;
			}
			proto = Object.getPrototypeOf(proto);
		}
	}

	return classes;
}

/**
 * Patch a single shader class: inject uniforms + soft fade logic into
 * fragmentShader, extend defaultUniforms.
 * @returns {boolean} true if patched successfully
 */
function patchShaderClass(ShaderClass) {
	const src = ShaderClass.fragmentShader;
	if (typeof src !== "string") return false;

	// Already patched?
	if (src.includes("softFadeEnabled")) return false;

	// 1. Inject uniform declarations
	const uniformIdx = src.indexOf(UNIFORM_ANCHOR);
	if (uniformIdx === -1) {
		console.warn("[eidolon-utilities] Soft Light: could not find uniform anchor in", ShaderClass.name);
		return false;
	}
	const afterUniforms =
		src.slice(0, uniformIdx + UNIFORM_ANCHOR.length) +
		UNIFORM_DECLARATIONS +
		src.slice(uniformIdx + UNIFORM_ANCHOR.length);

	// 2. Inject soft fade logic before FALLOFF
	const falloffIdx = afterUniforms.indexOf(FALLOFF_ANCHOR);
	if (falloffIdx === -1) {
		console.warn("[eidolon-utilities] Soft Light: could not find FALLOFF anchor in", ShaderClass.name);
		return false;
	}
	const patched =
		afterUniforms.slice(0, falloffIdx) +
		SOFT_FADE_LOGIC +
		afterUniforms.slice(falloffIdx);

	// Write patched source back
	ShaderClass.fragmentShader = patched;

	// 3. Extend defaultUniforms (if not already present)
	if (!ShaderClass.defaultUniforms.hasOwnProperty("softFadeEnabled")) {
		ShaderClass.defaultUniforms = {
			...ShaderClass.defaultUniforms,
			softFadeEnabled: DEFAULTS.enabled,
			softFadeThreshold: DEFAULTS.threshold,
			softFadeSaturation: DEFAULTS.saturation,
			softFadeBrightness: DEFAULTS.brightness,
		};
	}

	return true;
}

/**
 * Main entry point — call during `init` hook.
 * @returns {number} Number of shader classes patched
 */
export function patchIlluminationShaders() {
	const classes = collectIlluminationShaders();
	let count = 0;

	for (const cls of classes) {
		if (patchShaderClass(cls)) count++;
	}

	return count;
}

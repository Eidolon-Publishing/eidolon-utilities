/**
 * Hook registration for the soft-light feature.
 *
 * Hooks:
 *   - init:  Patch illumination shader fragment sources + defaultUniforms
 *   - setup: Wire _updateCommonUniforms monkey-patch for per-light flag reading
 *   - renderAmbientLightConfig: Inject UI controls
 */

import { MODULE_ID } from "./core/constants.js";
import { patchIlluminationShaders } from "./core/shader-patch.js";
import { patchUniformUpdater } from "./core/uniforms.js";
import { registerLightConfigUI } from "./ui/light-config.js";

export function registerSoftLightHooks() {
	Hooks.once("init", () => {
		const count = patchIlluminationShaders();
		console.log(`[${MODULE_ID}] Soft Light: patched ${count} illumination shaders`);
	});

	Hooks.once("setup", () => {
		const ok = patchUniformUpdater();
		if (ok) {
			console.log(`[${MODULE_ID}] Soft Light: uniform updater installed`);
		}
	});

	registerLightConfigUI();
}

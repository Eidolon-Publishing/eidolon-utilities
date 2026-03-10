/**
 * Inject Soft Fade controls into the AmbientLightConfig animation tab.
 *
 * Uses Foundry's built-in `flags.*` name convention so the form submission
 * automatically persists the values without custom updateObject handling.
 */

import { MODULE_ID, FLAG_SOFT_LIGHT_FADE, DEFAULTS } from "../core/constants.js";
import { asHTMLElement } from "../../common/ui/foundry-compat.js";

export function registerLightConfigUI() {
	Hooks.on("renderAmbientLightConfig", handleRender);
}

function handleRender(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	// Don't duplicate if already injected
	if (root.querySelector(".eidolon-soft-light-fade")) return;

	const animTab = root.querySelector('.tab[data-tab="animation"]');
	if (!animTab) return;

	const doc = app.document ?? app.object?.document ?? app.object;
	if (!doc) return;

	const flags = doc.getFlag?.(MODULE_ID, FLAG_SOFT_LIGHT_FADE) ?? {};
	const enabled = flags.enabled ?? DEFAULTS.enabled;
	const threshold = flags.threshold ?? DEFAULTS.threshold;
	const saturation = flags.saturation ?? DEFAULTS.saturation;
	const brightness = flags.brightness ?? DEFAULTS.brightness;

	const flagPrefix = `flags.${MODULE_ID}.${FLAG_SOFT_LIGHT_FADE}`;

	const fieldset = document.createElement("fieldset");
	fieldset.className = "eidolon-soft-light-fade";
	fieldset.innerHTML = `
		<legend>Soft Fade</legend>
		<div class="form-group">
			<label>Enable Soft Fade</label>
			<input type="checkbox" name="${flagPrefix}.enabled" ${enabled ? "checked" : ""}>
		</div>
		<div class="form-group eidolon-soft-light-threshold-group" ${!enabled ? 'style="opacity: 0.5"' : ""}>
			<label>Fade Threshold</label>
			<div class="form-fields">
				<input type="range" name="${flagPrefix}.threshold"
					min="0" max="0.95" step="0.05"
					value="${threshold}">
				<span class="range-value">${threshold}</span>
			</div>
			<p class="hint">How far from center the fade begins (0 = edge only, 0.95 = almost center).</p>
		</div>
		<div class="form-group eidolon-soft-light-saturation-group" ${!enabled ? 'style="opacity: 0.5"' : ""}>
			<label>Edge Saturation</label>
			<div class="form-fields">
				<input type="range" name="${flagPrefix}.saturation"
					min="-1" max="0" step="0.05"
					value="${saturation}">
				<span class="range-value">${saturation}</span>
			</div>
			<p class="hint">Desaturation strength at the edge (-1 = full greyscale, 0 = no change).</p>
		</div>
		<div class="form-group eidolon-soft-light-brightness-group" ${!enabled ? 'style="opacity: 0.5"' : ""}>
			<label>Edge Brightness</label>
			<div class="form-fields">
				<input type="range" name="${flagPrefix}.brightness"
					min="-0.5" max="0" step="0.05"
					value="${brightness}">
				<span class="range-value">${brightness}</span>
			</div>
			<p class="hint">Darkening at the edge (-0.5 = strong, 0 = no change).</p>
		</div>
	`;

	animTab.appendChild(fieldset);

	// Wire up range display and enable/disable toggling
	const checkbox = fieldset.querySelector('input[type="checkbox"]');
	const thresholdGroup = fieldset.querySelector(".eidolon-soft-light-threshold-group");
	const saturationGroup = fieldset.querySelector(".eidolon-soft-light-saturation-group");
	const brightnessGroup = fieldset.querySelector(".eidolon-soft-light-brightness-group");
	const paramGroups = [thresholdGroup, saturationGroup, brightnessGroup];

	checkbox?.addEventListener("change", () => {
		const on = checkbox.checked;
		for (const group of paramGroups) {
			if (group) group.style.opacity = on ? "" : "0.5";
		}
	});

	// Live-update range value labels
	for (const range of fieldset.querySelectorAll('input[type="range"]')) {
		const label = range.parentElement?.querySelector(".range-value");
		if (label) {
			range.addEventListener("input", () => {
				label.textContent = range.value;
			});
		}
	}

	// Resize the application window to accommodate the new fields
	app.setPosition?.({ height: "auto" });
}

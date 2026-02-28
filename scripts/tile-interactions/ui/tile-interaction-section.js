/**
 * UI section for tile interaction config (hover effects + click animations).
 * Renders into the same Animations tab panel as idle animations.
 */

import { asHTMLElement } from "../../common/ui/foundry-compat.js";
import { buildSelectGroup, buildNumberGroup, buildColorGroup } from "../../common/ui/form-builders.js";
import { makeDraggable, makeDropContainer } from "../../common/ui/drag-reorder.js";
import { ensureTileConfigTab } from "../../common/ui/tile-config-tab.js";
import { listEasingNames } from "../../tween/core/easing.js";
import { listInterpolationModes } from "../../tween/core/color-interpolation.js";

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "tile-interactions";
const TAB_ID = "eidolon-idle-animation"; // Same tab as idle animations
const TAB_ICON = "fa-solid fa-wave-pulse";

// ── Behaviour definitions (match TileAnimator registry) ────────────────

const HOVER_BEHAVIOURS = [
	{ value: "float", label: "Float" },
	{ value: "pulse", label: "Pulse" },
	{ value: "scale", label: "Scale" },
	{ value: "glow", label: "Glow" },
	{ value: "wobble", label: "Wobble" },
	{ value: "colorCycle", label: "Color Cycle" },
	{ value: "spin", label: "Spin" },
	{ value: "bounce", label: "Bounce" },
	{ value: "borderTrace", label: "Border Trace" },
	{ value: "shimmer", label: "Shimmer" },
	{ value: "breathe", label: "Breathe" },
	{ value: "tiltFollow", label: "Tilt Follow" },
	{ value: "slideReveal", label: "Slide Reveal" },
	{ value: "embers", label: "Embers" },
	{ value: "runeGlow", label: "Rune Glow" },
	{ value: "ripple", label: "Ripple" },
	{ value: "frostEdge", label: "Frost Edge" },
	{ value: "shadowLift", label: "Shadow Lift" },
];

const HOVER_PARAM_DEFS = {
	float: [
		{ key: "speed", label: "Speed", type: "number", default: 0.04, attrs: { step: "0.01", min: "0.001" } },
		{ key: "amplitude", label: "Amplitude (px)", type: "number", default: 3, attrs: { step: "1", min: "1" } },
	],
	pulse: [
		{ key: "minAlpha", label: "Min Alpha", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "maxAlpha", label: "Max Alpha", type: "number", default: 1.0, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "speed", label: "Speed", type: "number", default: 0.05, attrs: { step: "0.01", min: "0.001" } },
	],
	scale: [
		{ key: "factor", label: "Factor", type: "number", default: 1.12, attrs: { step: "0.01", min: "0.5", max: "3" } },
		{ key: "durationFrames", label: "Duration (frames)", type: "number", default: 15, attrs: { step: "1", min: "1" } },
		{ key: "easing", label: "Easing", type: "select", default: "easeOutCubic" },
	],
	glow: [
		{ key: "color", label: "Color", type: "color", default: "#44DDFF" },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.5, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "blur", label: "Blur", type: "number", default: 8, attrs: { step: "1", min: "1", max: "32" } },
		{ key: "pulseSpeed", label: "Pulse Speed", type: "number", default: 0.03, attrs: { step: "0.01", min: "0" } },
	],
	wobble: [
		{ key: "speed", label: "Speed", type: "number", default: 0.15, attrs: { step: "0.01", min: "0.001" } },
		{ key: "angle", label: "Angle (°)", type: "number", default: 2.5, attrs: { step: "0.5", min: "0.1", max: "45" } },
	],
	colorCycle: [
		{ key: "speed", label: "Speed", type: "number", default: 0.005, attrs: { step: "0.001", min: "0.001" } },
		{ key: "saturation", label: "Saturation", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "lightness", label: "Lightness", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
	],
	spin: [
		{ key: "speed", label: "Speed (°/frame)", type: "number", default: 0.5, attrs: { step: "0.1", min: "-10", max: "10" } },
	],
	bounce: [
		{ key: "speed", label: "Speed", type: "number", default: 0.02, attrs: { step: "0.005", min: "0.001" } },
		{ key: "amplitude", label: "Amplitude (px)", type: "number", default: 6, attrs: { step: "1", min: "1" } },
	],
	borderTrace: [
		{ key: "speed", label: "Speed (px/frame)", type: "number", default: 1.5, attrs: { step: "0.1", min: "0.1" } },
		{ key: "length", label: "Trail Length (px)", type: "number", default: 60, attrs: { step: "5", min: "5" } },
		{ key: "color", label: "Color", type: "color", default: "#44DDFF" },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.8, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "lineWidth", label: "Line Width", type: "number", default: 2, attrs: { step: "1", min: "1", max: "10" } },
	],
	shimmer: [
		{ key: "speed", label: "Speed", type: "number", default: 1.0, attrs: { step: "0.1", min: "0.1" } },
		{ key: "bandWidth", label: "Band Width (px)", type: "number", default: 40, attrs: { step: "5", min: "5" } },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.15, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "pause", label: "Pause (frames)", type: "number", default: 120, attrs: { step: "10", min: "0" } },
	],
	breathe: [
		{ key: "factor", label: "Factor", type: "number", default: 1.03, attrs: { step: "0.01", min: "1.001", max: "1.2" } },
		{ key: "speed", label: "Speed", type: "number", default: 0.02, attrs: { step: "0.005", min: "0.001" } },
	],
	tiltFollow: [
		{ key: "maxAngle", label: "Max Angle (\u00B0)", type: "number", default: 3, attrs: { step: "0.5", min: "0.5", max: "15" } },
		{ key: "smoothing", label: "Smoothing", type: "number", default: 0.15, attrs: { step: "0.05", min: "0.01", max: "1" } },
	],
	slideReveal: [
		{ key: "offsetX", label: "Offset X (px)", type: "number", default: 0, attrs: { step: "5" } },
		{ key: "offsetY", label: "Offset Y (px)", type: "number", default: 20, attrs: { step: "5" } },
		{ key: "durationFrames", label: "Duration (frames)", type: "number", default: 20, attrs: { step: "1", min: "1" } },
		{ key: "easing", label: "Easing", type: "select", default: "easeOutCubic" },
		{ key: "delay", label: "Delay (frames)", type: "number", default: 0, attrs: { step: "1", min: "0" } },
	],
	embers: [
		{ key: "count", label: "Count", type: "number", default: 12, attrs: { step: "1", min: "1", max: "50" } },
		{ key: "speed", label: "Speed", type: "number", default: 0.5, attrs: { step: "0.1", min: "0.1" } },
		{ key: "color", label: "Color", type: "color", default: "#FF6600" },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.6, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "size", label: "Size (px)", type: "number", default: 2, attrs: { step: "0.5", min: "0.5", max: "10" } },
	],
	runeGlow: [
		{ key: "dots", label: "Dots", type: "number", default: 3, attrs: { step: "1", min: "1", max: "12" } },
		{ key: "speed", label: "Speed", type: "number", default: 1.2, attrs: { step: "0.1", min: "0.1" } },
		{ key: "color", label: "Color 1", type: "color", default: "#44DDFF" },
		{ key: "color2", label: "Color 2", type: "color", default: "#8844FF" },
		{ key: "radius", label: "Dot Radius (px)", type: "number", default: 3, attrs: { step: "0.5", min: "0.5", max: "10" } },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.7, attrs: { step: "0.05", min: "0", max: "1" } },
	],
	ripple: [
		{ key: "rings", label: "Max Rings", type: "number", default: 3, attrs: { step: "1", min: "1", max: "10" } },
		{ key: "interval", label: "Spawn Interval (frames)", type: "number", default: 30, attrs: { step: "5", min: "5" } },
		{ key: "speed", label: "Speed", type: "number", default: 1.5, attrs: { step: "0.1", min: "0.1" } },
		{ key: "color", label: "Color", type: "color", default: "#44DDFF" },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.4, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "lineWidth", label: "Line Width", type: "number", default: 1.5, attrs: { step: "0.5", min: "0.5", max: "5" } },
	],
	frostEdge: [
		{ key: "segments", label: "Segments", type: "number", default: 20, attrs: { step: "1", min: "5", max: "60" } },
		{ key: "maxLength", label: "Max Length (px)", type: "number", default: 15, attrs: { step: "1", min: "3", max: "50" } },
		{ key: "color", label: "Color", type: "color", default: "#AADDFF" },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.5, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "growSpeed", label: "Grow Speed", type: "number", default: 0.02, attrs: { step: "0.005", min: "0.001" } },
	],
	shadowLift: [
		{ key: "offsetY", label: "Offset Y (px)", type: "number", default: 6, attrs: { step: "1", min: "1", max: "20" } },
		{ key: "blur", label: "Blur", type: "number", default: 6, attrs: { step: "1", min: "1", max: "20" } },
		{ key: "alpha", label: "Alpha", type: "number", default: 0.35, attrs: { step: "0.05", min: "0", max: "1" } },
		{ key: "color", label: "Color", type: "color", default: "#000000" },
		{ key: "durationFrames", label: "Duration (frames)", type: "number", default: 12, attrs: { step: "1", min: "1" } },
		{ key: "easing", label: "Easing", type: "select", default: "easeOutCubic" },
	],
};

// ── Click animation defaults ───────────────────────────────────────────

const CLICK_TILE_PROP_DEFAULTS = {
	type: "tile-prop",
	attribute: "alpha",
	from: 1.0,
	to: 0.5,
	period: 300,
	easing: "easeOutCubic",
	mode: "bounce",
};

const CLICK_TILE_TINT_DEFAULTS = {
	type: "tile-tint",
	fromColor: "#ffffff",
	toColor: "#ffaa00",
	period: 500,
	easing: "easeInOutCosine",
	mode: "bounce",
};

const CLICK_TILE_SCALE_DEFAULTS = {
	type: "tile-scale",
	fromScale: 1.0,
	toScale: 1.2,
	period: 300,
	easing: "easeOutCubic",
	mode: "bounce",
};

const CLICK_ATTRIBUTES = [
	{ value: "alpha", label: "Alpha (Opacity)" },
	{ value: "rotation", label: "Rotation" },
	{ value: "texture.rotation", label: "Texture Rotation" },
];

// ── Helpers ────────────────────────────────────────────────────────────

function getTileDocument(app) {
	return app?.document ?? app?.object?.document ?? app?.object ?? null;
}

function getInteractionConfigs(doc) {
	const flag = doc?.getFlag?.(MODULE_ID, FLAG_KEY);
	if (!flag) return { hoverIdle: [], hoverEnter: [], click: [] };

	let hoverIdle = [];
	let hoverEnter = [];

	if (flag.hover) {
		if (Array.isArray(flag.hover)) {
			// Legacy flat array → enter-only
			hoverEnter = flag.hover;
		} else if (typeof flag.hover === "object") {
			hoverIdle = Array.isArray(flag.hover.idle) ? flag.hover.idle : [];
			hoverEnter = Array.isArray(flag.hover.enter) ? flag.hover.enter : [];
		}
	}

	return {
		hoverIdle,
		hoverEnter,
		click: Array.isArray(flag.click) ? flag.click : [],
	};
}

// ── Hover slot builder ─────────────────────────────────────────────────

function summarizeHoverConfig(config) {
	if (!config) return "";
	const name = config.name ?? "float";
	const def = HOVER_BEHAVIOURS.find((b) => b.value === name);
	return def?.label ?? name;
}

function buildHoverSlot(config, index, slotClass, titlePrefix) {
	const name = config.name ?? "float";
	const easingNames = listEasingNames();

	const card = document.createElement("div");
	card.classList.add("idle-anim__slot", "is-collapsed", slotClass);
	card.dataset.index = String(index);

	// Header
	const header = document.createElement("div");
	header.classList.add("idle-anim__slot-header");
	const chevron = document.createElement("i");
	chevron.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
	const title = document.createElement("span");
	title.classList.add("idle-anim__slot-title");
	title.textContent = `${titlePrefix} ${index + 1}`;
	const summary = document.createElement("span");
	summary.classList.add("idle-anim__slot-summary");
	summary.textContent = summarizeHoverConfig(config);
	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.classList.add("idle-anim__slot-remove");
	removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	removeBtn.title = "Remove effect";
	header.append(chevron, title, summary, removeBtn);
	card.appendChild(header);

	// Body
	const body = document.createElement("div");
	body.classList.add("idle-anim__slot-body");

	// Behaviour dropdown
	const behaviourGroup = buildSelectGroup("Behaviour", "ti-hover__behaviour",
		HOVER_BEHAVIOURS.map((b) => ({ value: b.value, label: b.label, selected: b.value === name }))
	);
	body.appendChild(behaviourGroup);

	// Params container
	const paramsContainer = document.createElement("div");
	paramsContainer.classList.add("idle-anim__type-fields");
	body.appendChild(paramsContainer);

	function renderParams(behaviourName, currentConfig) {
		paramsContainer.innerHTML = "";
		const paramDefs = HOVER_PARAM_DEFS[behaviourName];
		if (!paramDefs) return;

		for (const def of paramDefs) {
			const value = currentConfig[def.key] ?? def.default;

			if (def.type === "color") {
				paramsContainer.appendChild(buildColorGroup(def.label, `ti-hover__${def.key}`, value));
			} else if (def.type === "select" && def.key === "easing") {
				paramsContainer.appendChild(buildSelectGroup(def.label, `ti-hover__${def.key}`,
					easingNames.map((n) => ({ value: n, label: n, selected: n === value }))
				));
			} else {
				paramsContainer.appendChild(buildNumberGroup(def.label, `ti-hover__${def.key}`, value, def.attrs ?? {}));
			}
		}
	}

	renderParams(name, config);

	card.appendChild(body);

	// Wire behaviour change
	const behaviourSelect = card.querySelector(".ti-hover__behaviour");
	behaviourSelect?.addEventListener("change", () => {
		renderParams(behaviourSelect.value, {});
	});

	// Wire collapse toggle
	header.addEventListener("click", (e) => {
		if (e.target.closest(".idle-anim__slot-remove")) return;
		card.classList.toggle("is-collapsed");
		if (card.classList.contains("is-collapsed")) {
			const cfg = readHoverSlot(card);
			if (cfg) summary.textContent = summarizeHoverConfig(cfg);
		}
	});

	// Wire remove
	removeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const container = card.parentElement;
		card.remove();
		if (container) renumberSlots(container, slotClass, titlePrefix);
	});

	// Drag & drop — idle and hover share "hover" group for cross-category drag
	makeDraggable(card, { dropGroup: "hover" });

	return card;
}

function readHoverSlot(slot) {
	const name = slot.querySelector(".ti-hover__behaviour")?.value ?? "float";
	const paramDefs = HOVER_PARAM_DEFS[name];
	const config = { name };

	if (paramDefs) {
		for (const def of paramDefs) {
			const el = slot.querySelector(`.ti-hover__${def.key}`);
			if (!el) continue;

			if (def.type === "color") {
				config[def.key] = el.value;
			} else if (def.type === "select") {
				config[def.key] = el.value;
			} else {
				const num = Number.parseFloat(el.value);
				if (!Number.isNaN(num)) config[def.key] = num;
			}
		}
	}

	return config;
}

// ── Click slot builder ─────────────────────────────────────────────────

function summarizeClickConfig(config) {
	if (!config) return "";
	const type = config.type ?? "tile-prop";
	const mode = config.mode ?? "bounce";
	const modeLabel = mode.charAt(0).toUpperCase() + mode.slice(1);

	if (type === "tile-tint") {
		return `${modeLabel} Tint ${config.fromColor ?? "?"} \u2192 ${config.toColor ?? "?"} (${config.period ?? "?"}ms)`;
	}
	if (type === "tile-scale") {
		const from = config.fromScale != null ? `${Math.round(config.fromScale * 100)}%` : "?";
		const to = config.toScale != null ? `${Math.round(config.toScale * 100)}%` : "?";
		return `${modeLabel} Scale ${from} \u2192 ${to} (${config.period ?? "?"}ms)`;
	}
	const attrDef = CLICK_ATTRIBUTES.find((a) => a.value === config.attribute);
	const label = attrDef?.label ?? config.attribute ?? "?";
	return `${modeLabel} ${label} ${config.from ?? "?"} \u2192 ${config.to ?? "?"} (${config.period ?? "?"}ms)`;
}

function buildClickSlot(config, index) {
	const type = config.type ?? "tile-prop";
	const mode = config.mode ?? "bounce";
	const easingNames = listEasingNames();

	const card = document.createElement("div");
	card.classList.add("idle-anim__slot", "is-collapsed", "ti-click-slot");
	card.dataset.index = String(index);

	// Header
	const header = document.createElement("div");
	header.classList.add("idle-anim__slot-header");
	const chevron = document.createElement("i");
	chevron.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
	const title = document.createElement("span");
	title.classList.add("idle-anim__slot-title");
	title.textContent = `Animation ${index + 1}`;
	const summary = document.createElement("span");
	summary.classList.add("idle-anim__slot-summary");
	summary.textContent = summarizeClickConfig(config);
	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.classList.add("idle-anim__slot-remove");
	removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	removeBtn.title = "Remove animation";
	header.append(chevron, title, summary, removeBtn);
	card.appendChild(header);

	// Body
	const body = document.createElement("div");
	body.classList.add("idle-anim__slot-body");

	// Mode + Type row
	const modeTypeRow = document.createElement("div");
	modeTypeRow.classList.add("idle-anim__range-row");
	modeTypeRow.appendChild(buildSelectGroup("Mode", "ti-click__mode", [
		{ value: "bounce", label: "Bounce", selected: mode === "bounce" },
		{ value: "toggle", label: "Toggle", selected: mode === "toggle" },
	]));
	modeTypeRow.appendChild(buildSelectGroup("Type", "ti-click__type", [
		{ value: "tile-prop", label: "Numeric", selected: type === "tile-prop" },
		{ value: "tile-tint", label: "Tint", selected: type === "tile-tint" },
		{ value: "tile-scale", label: "Scale", selected: type === "tile-scale" },
	]));
	body.appendChild(modeTypeRow);

	// Type-specific fields
	const fieldsContainer = document.createElement("div");
	fieldsContainer.classList.add("idle-anim__type-fields");
	body.appendChild(fieldsContainer);

	function renderTypeFields(currentType, currentConfig) {
		fieldsContainer.innerHTML = "";

		if (currentType === "tile-tint") {
			const modes = listInterpolationModes();
			const fromColor = currentConfig.fromColor ?? CLICK_TILE_TINT_DEFAULTS.fromColor;
			const toColor = currentConfig.toColor ?? CLICK_TILE_TINT_DEFAULTS.toColor;
			const colorMode = currentConfig.mode ?? "oklch";

			const colorRow = document.createElement("div");
			colorRow.classList.add("idle-anim__range-row");
			colorRow.appendChild(buildColorGroup("From", "ti-click__from-color", fromColor));
			colorRow.appendChild(buildColorGroup("To", "ti-click__to-color", toColor));
			fieldsContainer.appendChild(colorRow);

			fieldsContainer.appendChild(buildSelectGroup("Interpolation", "ti-click__color-mode",
				modes.map((m) => ({ value: m, label: m, selected: m === colorMode }))
			));
		} else if (currentType === "tile-scale") {
			const fromScale = currentConfig.fromScale ?? CLICK_TILE_SCALE_DEFAULTS.fromScale;
			const toScale = currentConfig.toScale ?? CLICK_TILE_SCALE_DEFAULTS.toScale;

			const scaleRow = document.createElement("div");
			scaleRow.classList.add("idle-anim__range-row");
			scaleRow.appendChild(buildNumberGroup("From", "ti-click__from-scale", fromScale, { step: "0.01", min: "0.01" }));
			scaleRow.appendChild(buildNumberGroup("To", "ti-click__to-scale", toScale, { step: "0.01", min: "0.01" }));
			fieldsContainer.appendChild(scaleRow);

			const hint = document.createElement("p");
			hint.classList.add("idle-anim__hint");
			hint.textContent = "1.0 = original size. Scales from center.";
			fieldsContainer.appendChild(hint);
		} else {
			// tile-prop
			const attribute = currentConfig.attribute ?? CLICK_TILE_PROP_DEFAULTS.attribute;
			const from = currentConfig.from ?? CLICK_TILE_PROP_DEFAULTS.from;
			const to = currentConfig.to ?? CLICK_TILE_PROP_DEFAULTS.to;

			fieldsContainer.appendChild(buildSelectGroup("Attribute", "ti-click__attribute",
				CLICK_ATTRIBUTES.map((a) => ({ value: a.value, label: a.label, selected: a.value === attribute }))
			));

			const rangeRow = document.createElement("div");
			rangeRow.classList.add("idle-anim__range-row");
			rangeRow.appendChild(buildNumberGroup("From", "ti-click__from", from, { step: "0.01" }));
			rangeRow.appendChild(buildNumberGroup("To", "ti-click__to", to, { step: "0.01" }));
			fieldsContainer.appendChild(rangeRow);
		}
	}

	renderTypeFields(type, config);

	// Common fields: period + easing
	const period = config.period ?? (type === "tile-tint" ? CLICK_TILE_TINT_DEFAULTS.period : CLICK_TILE_PROP_DEFAULTS.period);
	const easing = config.easing ?? "easeOutCubic";

	body.appendChild(buildNumberGroup("Period (ms)", "ti-click__period", period, { min: "50", step: "50" }));
	body.appendChild(buildSelectGroup("Easing", "ti-click__easing",
		easingNames.map((n) => ({ value: n, label: n, selected: n === easing }))
	));

	card.appendChild(body);

	// Wire type change
	const typeSelect = card.querySelector(".ti-click__type");
	typeSelect?.addEventListener("change", () => {
		const newType = typeSelect.value;
		const defaults = newType === "tile-tint" ? CLICK_TILE_TINT_DEFAULTS
			: newType === "tile-scale" ? CLICK_TILE_SCALE_DEFAULTS
			: CLICK_TILE_PROP_DEFAULTS;
		renderTypeFields(newType, defaults);
	});

	// Wire collapse toggle
	header.addEventListener("click", (e) => {
		if (e.target.closest(".idle-anim__slot-remove")) return;
		card.classList.toggle("is-collapsed");
		if (card.classList.contains("is-collapsed")) {
			const cfg = readClickSlot(card);
			if (cfg) summary.textContent = summarizeClickConfig(cfg);
		}
	});

	// Wire remove
	removeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const container = card.parentElement;
		card.remove();
		if (container) renumberSlots(container, "ti-click-slot", "Animation");
	});

	// Drag & drop — click slots are isolated (different data model)
	makeDraggable(card, { dropGroup: "click" });

	return card;
}

function readClickSlot(slot) {
	const type = slot.querySelector(".ti-click__type")?.value ?? "tile-prop";
	const mode = slot.querySelector(".ti-click__mode")?.value ?? "bounce";
	const period = Number.parseInt(slot.querySelector(".ti-click__period")?.value, 10);
	const easing = slot.querySelector(".ti-click__easing")?.value ?? "easeOutCubic";

	if (!period || period <= 0) return null;

	const base = { mode, period, easing };

	if (type === "tile-tint") {
		const fromColor = slot.querySelector(".ti-click__from-color")?.value
			?? slot.querySelector(".ti-click__from-color-text")?.value
			?? CLICK_TILE_TINT_DEFAULTS.fromColor;
		const toColor = slot.querySelector(".ti-click__to-color")?.value
			?? slot.querySelector(".ti-click__to-color-text")?.value
			?? CLICK_TILE_TINT_DEFAULTS.toColor;
		const colorMode = slot.querySelector(".ti-click__color-mode")?.value ?? "oklch";
		return { type: "tile-tint", fromColor, toColor, mode: colorMode, ...base };
	}

	if (type === "tile-scale") {
		const fromScale = Number.parseFloat(slot.querySelector(".ti-click__from-scale")?.value);
		const toScale = Number.parseFloat(slot.querySelector(".ti-click__to-scale")?.value);
		if (Number.isNaN(fromScale) || Number.isNaN(toScale) || fromScale <= 0 || toScale <= 0) return null;
		return { type: "tile-scale", fromScale, toScale, ...base };
	}

	// tile-prop
	const attribute = slot.querySelector(".ti-click__attribute")?.value ?? CLICK_TILE_PROP_DEFAULTS.attribute;
	const from = Number.parseFloat(slot.querySelector(".ti-click__from")?.value);
	const to = Number.parseFloat(slot.querySelector(".ti-click__to")?.value);
	if (Number.isNaN(from) || Number.isNaN(to)) return null;
	return { type: "tile-prop", attribute, from, to, ...base };
}

// ── Shared helpers ─────────────────────────────────────────────────────

function renumberSlots(container, slotClass, prefix) {
	const slots = container.querySelectorAll(`.${slotClass}`);
	slots.forEach((slot, i) => {
		slot.dataset.index = String(i);
		const title = slot.querySelector(".idle-anim__slot-title");
		if (title) title.textContent = `${prefix} ${i + 1}`;
	});
}

// ── Section builder ────────────────────────────────────────────────────

function buildSectionContent(doc) {
	const { hoverIdle, hoverEnter, click: clickConfigs } = getInteractionConfigs(doc);

	const section = document.createElement("section");
	section.classList.add("eidolon-tile-interactions");

	// ── Hover: Idle (default state) ────────────────────────────────
	const idleHeading = document.createElement("h3");
	idleHeading.classList.add("ti-section-heading");
	idleHeading.textContent = "Idle";
	section.appendChild(idleHeading);

	const idleHint = document.createElement("p");
	idleHint.classList.add("idle-anim__hint");
	idleHint.textContent = "Plays continuously. Stops when pointer enters the tile.";
	section.appendChild(idleHint);

	const idleSlots = document.createElement("div");
	idleSlots.classList.add("idle-anim__slots", "ti-hover-idle-slots");
	for (let i = 0; i < hoverIdle.length; i++) {
		idleSlots.appendChild(buildHoverSlot(hoverIdle[i], i, "ti-hover-idle-slot", "Effect"));
	}
	section.appendChild(idleSlots);

	// Drop container — accepts cards from both idle and hover (same "hover" group)
	makeDropContainer(idleSlots, {
		dropGroup: "hover",
		onDrop(card) {
			// If the card landed here, swap its category class
			if (card.parentElement === idleSlots && card.classList.contains("ti-hover-enter-slot")) {
				card.classList.replace("ti-hover-enter-slot", "ti-hover-idle-slot");
			}
			renumberSlots(idleSlots, "ti-hover-idle-slot", "Effect");
		},
	});

	const addIdleBtn = document.createElement("button");
	addIdleBtn.type = "button";
	addIdleBtn.classList.add("idle-anim__add");
	addIdleBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Idle Effect';
	addIdleBtn.addEventListener("click", () => {
		const count = idleSlots.querySelectorAll(".ti-hover-idle-slot").length;
		const slot = buildHoverSlot({ name: "float" }, count, "ti-hover-idle-slot", "Effect");
		slot.classList.remove("is-collapsed");
		idleSlots.appendChild(slot);
	});
	section.appendChild(addIdleBtn);

	// ── Hover: Enter (on-hover state) ──────────────────────────────
	const enterHeading = document.createElement("h3");
	enterHeading.classList.add("ti-section-heading");
	enterHeading.textContent = "Hover";
	section.appendChild(enterHeading);

	const enterHint = document.createElement("p");
	enterHint.classList.add("idle-anim__hint");
	enterHint.textContent = "Plays while pointer is over the tile. Stops when pointer leaves.";
	section.appendChild(enterHint);

	const enterSlots = document.createElement("div");
	enterSlots.classList.add("idle-anim__slots", "ti-hover-enter-slots");
	for (let i = 0; i < hoverEnter.length; i++) {
		enterSlots.appendChild(buildHoverSlot(hoverEnter[i], i, "ti-hover-enter-slot", "Effect"));
	}
	section.appendChild(enterSlots);

	// Drop container — accepts cards from both hover and idle (same "hover" group)
	makeDropContainer(enterSlots, {
		dropGroup: "hover",
		onDrop(card) {
			// If the card landed here, swap its category class
			if (card.parentElement === enterSlots && card.classList.contains("ti-hover-idle-slot")) {
				card.classList.replace("ti-hover-idle-slot", "ti-hover-enter-slot");
			}
			renumberSlots(enterSlots, "ti-hover-enter-slot", "Effect");
		},
	});

	const addEnterBtn = document.createElement("button");
	addEnterBtn.type = "button";
	addEnterBtn.classList.add("idle-anim__add");
	addEnterBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Hover Effect';
	addEnterBtn.addEventListener("click", () => {
		const count = enterSlots.querySelectorAll(".ti-hover-enter-slot").length;
		const slot = buildHoverSlot({ name: "scale" }, count, "ti-hover-enter-slot", "Effect");
		slot.classList.remove("is-collapsed");
		enterSlots.appendChild(slot);
	});
	section.appendChild(addEnterBtn);

	// ── Click Animations ───────────────────────────────────────────
	const clickHeading = document.createElement("h3");
	clickHeading.classList.add("ti-section-heading");
	clickHeading.textContent = "Click";
	section.appendChild(clickHeading);

	const clickSlots = document.createElement("div");
	clickSlots.classList.add("idle-anim__slots", "ti-click-slots");
	for (let i = 0; i < clickConfigs.length; i++) {
		clickSlots.appendChild(buildClickSlot(clickConfigs[i], i));
	}
	section.appendChild(clickSlots);

	// Drop container — click slots isolated
	makeDropContainer(clickSlots, {
		dropGroup: "click",
		onDrop() {
			renumberSlots(clickSlots, "ti-click-slot", "Animation");
		},
	});

	const addClickBtn = document.createElement("button");
	addClickBtn.type = "button";
	addClickBtn.classList.add("idle-anim__add");
	addClickBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation';
	addClickBtn.addEventListener("click", () => {
		const count = clickSlots.querySelectorAll(".ti-click-slot").length;
		const slot = buildClickSlot(CLICK_TILE_SCALE_DEFAULTS, count);
		slot.classList.remove("is-collapsed");
		clickSlots.appendChild(slot);
	});
	section.appendChild(addClickBtn);


	return section;
}

function readAllHoverSlots(section, slotClass) {
	const configs = [];
	for (const slot of section.querySelectorAll(`.${slotClass}`)) {
		const config = readHoverSlot(slot);
		if (config) configs.push(config);
	}
	return configs;
}

function readAllClickConfigs(section) {
	const configs = [];
	for (const slot of section.querySelectorAll(".ti-click-slot")) {
		const config = readClickSlot(slot);
		if (config) configs.push(config);
	}
	return configs;
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Render the interaction section into the Animations tab of a TileConfig dialog.
 */
export function renderInteractionSection(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	const doc = getTileDocument(app);
	if (!doc) return;

	const tabPanel = ensureTileConfigTab(app, root, TAB_ID, "Animations", TAB_ICON);
	if (!tabPanel) return;

	// Don't rebuild if already present
	if (tabPanel.querySelector(".eidolon-tile-interactions")) return;

	// Prevent "An invalid form control is not focusable" errors:
	// Our number inputs have min/max constraints and may be hidden inside
	// collapsed slots or inactive tabs when the native form submits.
	const parentForm = tabPanel.closest("form");
	if (parentForm) parentForm.noValidate = true;

	// Add a divider before our section
	const divider = document.createElement("hr");
	divider.classList.add("ti-divider");
	tabPanel.appendChild(divider);

	const section = buildSectionContent(doc);
	tabPanel.appendChild(section);

	app.setPosition?.({ height: "auto" });

	// Save interaction data when the native form submits ("Update Tile")
	if (parentForm) {
		parentForm.addEventListener("submit", () => {
			const hoverIdle = readAllHoverSlots(section, "ti-hover-idle-slot");
			const hoverEnter = readAllHoverSlots(section, "ti-hover-enter-slot");
			const click = readAllClickConfigs(section);

			const hasHover = hoverIdle.length > 0 || hoverEnter.length > 0;
			const hasData = hasHover || click.length > 0;

			// Clear existing flag, then set new data
			doc.update({ [`flags.${MODULE_ID}.-=${FLAG_KEY}`]: null }).then(() => {
				if (hasData) {
					const flagData = {};
					if (hasHover) {
						flagData.hover = {};
						if (hoverIdle.length > 0) flagData.hover.idle = hoverIdle;
						if (hoverEnter.length > 0) flagData.hover.enter = hoverEnter;
					}
					if (click.length > 0) flagData.click = click;
					return doc.update({ [`flags.${MODULE_ID}.${FLAG_KEY}`]: flagData });
				}
			});
		});
	}
}

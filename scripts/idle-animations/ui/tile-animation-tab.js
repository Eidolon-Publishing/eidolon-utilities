import { asHTMLElement } from "../../common/ui/foundry-compat.js";
import { buildSelectGroup, buildNumberGroup, buildColorGroup } from "../../common/ui/form-builders.js";
import { makeDraggable, makeDropContainer } from "../../common/ui/drag-reorder.js";
import { ensureTileConfigTab } from "../../common/ui/tile-config-tab.js";
import { listEasingNames } from "../../tween/core/easing.js";
import { listInterpolationModes } from "../../tween/core/color-interpolation.js";
import { startAllLoops, stopLoopsForTile, isLooping, getIdleAnimationConfigs } from "../loop-runner.js";

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "idle-animation";
const TAB_ID = "eidolon-idle-animation";
const TAB_ICON = "fa-solid fa-wave-pulse";

const ATTRIBUTES = [
	{ value: "alpha", label: "Alpha (Opacity)", from: 0.85, to: 1.0, step: "0.01" },
	{ value: "rotation", label: "Rotation", from: -5, to: 5, step: "1" },
	{ value: "texture.rotation", label: "Texture Rotation", from: -5, to: 5, step: "1" },
];

const TILE_PROP_DEFAULTS = {
	type: "tile-prop",
	attribute: "alpha",
	from: 0.85,
	to: 1.0,
	period: 1500,
	easing: "easeInOutCosine",
};

const TILE_TINT_DEFAULTS = {
	type: "tile-tint",
	fromColor: "#ffffff",
	toColor: "#ffcc88",
	mode: "oklch",
	period: 3000,
	easing: "easeInOutCosine",
};

const TILE_SCALE_DEFAULTS = {
	type: "tile-scale",
	fromScale: 0.95,
	toScale: 1.05,
	period: 2000,
	easing: "easeInOutCosine",
};

/**
 * Get sensible from/to defaults for a tile-prop attribute.
 */
function getAttributeDefaults(attribute, doc) {
	const attrDef = ATTRIBUTES.find((a) => a.value === attribute);
	if (attrDef && attrDef.from !== null) return { from: attrDef.from, to: attrDef.to, step: attrDef.step };

	const current = foundry.utils.getProperty(doc?._source ?? {}, attribute);
	if (typeof current === "number" && current > 0) {
		return { from: Math.round(current * 0.95), to: Math.round(current * 1.05), step: "1" };
	}
	return { from: 0, to: 100, step: "1" };
}

function getTileDocument(app) {
	return app?.document ?? app?.object?.document ?? app?.object ?? null;
}

// ── Helpers ───────────────────────────────────────────────────────────

/**
 * Build a short summary string for a collapsed slot.
 */
function summarizeConfig(config) {
	if (!config) return "";
	const type = config.type ?? "tile-prop";
	if (type === "tile-tint") {
		return `Tint ${config.fromColor ?? "?"} \u2192 ${config.toColor ?? "?"} (${config.period ?? "?"}ms)`;
	}
	if (type === "tile-scale") {
		const from = config.fromScale != null ? `${Math.round(config.fromScale * 100)}%` : "?";
		const to = config.toScale != null ? `${Math.round(config.toScale * 100)}%` : "?";
		return `Scale ${from} \u2192 ${to} (${config.period ?? "?"}ms)`;
	}
	const attrDef = ATTRIBUTES.find((a) => a.value === config.attribute);
	const label = attrDef?.label ?? config.attribute ?? "?";
	return `${label} ${config.from ?? "?"} \u2192 ${config.to ?? "?"} (${config.period ?? "?"}ms)`;
}

// ── Slot builder ──────────────────────────────────────────────────────

/**
 * Build one animation slot card.
 */
function buildSlot(doc, config, index) {
	const type = config.type ?? "tile-prop";
	const easingNames = listEasingNames();

	const card = document.createElement("div");
	card.classList.add("idle-anim__slot", "is-collapsed");
	card.dataset.index = String(index);

	// Header row with chevron, title, summary, remove button
	const header = document.createElement("div");
	header.classList.add("idle-anim__slot-header");
	const chevron = document.createElement("i");
	chevron.classList.add("fa-solid", "fa-chevron-right", "idle-anim__slot-chevron");
	const title = document.createElement("span");
	title.classList.add("idle-anim__slot-title");
	title.textContent = `Animation ${index + 1}`;
	const summary = document.createElement("span");
	summary.classList.add("idle-anim__slot-summary");
	summary.textContent = summarizeConfig(config);
	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.classList.add("idle-anim__slot-remove");
	removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	removeBtn.title = "Remove animation";
	header.append(chevron, title, summary, removeBtn);
	card.appendChild(header);

	// Collapsible body
	const body = document.createElement("div");
	body.classList.add("idle-anim__slot-body");

	// Type selector
	const typeGroup = buildSelectGroup("Type", "idle-anim__type", [
		{ value: "tile-prop", label: "Numeric", selected: type === "tile-prop" || (type !== "tile-tint" && type !== "tile-scale") },
		{ value: "tile-tint", label: "Tint", selected: type === "tile-tint" },
		{ value: "tile-scale", label: "Scale", selected: type === "tile-scale" },
	]);
	body.appendChild(typeGroup);

	// Type-specific fields container
	const fieldsContainer = document.createElement("div");
	fieldsContainer.classList.add("idle-anim__type-fields");
	body.appendChild(fieldsContainer);

	function renderTypeFields(currentType, currentConfig) {
		fieldsContainer.innerHTML = "";

		if (currentType === "tile-tint") {
			const modes = listInterpolationModes();
			const fromColor = currentConfig.fromColor ?? TILE_TINT_DEFAULTS.fromColor;
			const toColor = currentConfig.toColor ?? TILE_TINT_DEFAULTS.toColor;
			const mode = currentConfig.mode ?? TILE_TINT_DEFAULTS.mode;

			const colorRow = document.createElement("div");
			colorRow.classList.add("idle-anim__range-row");
			colorRow.appendChild(buildColorGroup("From", "idle-anim__from-color", fromColor));
			colorRow.appendChild(buildColorGroup("To", "idle-anim__to-color", toColor));
			fieldsContainer.appendChild(colorRow);

			fieldsContainer.appendChild(buildSelectGroup("Mode", "idle-anim__mode",
				modes.map((m) => ({ value: m, label: m, selected: m === mode }))
			));
		} else if (currentType === "tile-scale") {
			const fromScale = currentConfig.fromScale ?? TILE_SCALE_DEFAULTS.fromScale;
			const toScale = currentConfig.toScale ?? TILE_SCALE_DEFAULTS.toScale;

			const scaleRow = document.createElement("div");
			scaleRow.classList.add("idle-anim__range-row");
			scaleRow.appendChild(buildNumberGroup("From", "idle-anim__from-scale", fromScale, { step: "0.01", min: "0.01" }));
			scaleRow.appendChild(buildNumberGroup("To", "idle-anim__to-scale", toScale, { step: "0.01", min: "0.01" }));
			fieldsContainer.appendChild(scaleRow);

			const hint = document.createElement("p");
			hint.classList.add("idle-anim__hint");
			hint.textContent = "1.0 = original size. Scales from center.";
			fieldsContainer.appendChild(hint);
		} else {
			// tile-prop
			const attribute = currentConfig.attribute ?? TILE_PROP_DEFAULTS.attribute;
			const attrDefaults = getAttributeDefaults(attribute, doc);
			const from = currentConfig.from ?? attrDefaults.from;
			const to = currentConfig.to ?? attrDefaults.to;
			const step = attrDefaults.step;

			fieldsContainer.appendChild(buildSelectGroup("Attribute", "idle-anim__attribute",
				ATTRIBUTES.map((a) => ({ value: a.value, label: a.label, selected: a.value === attribute }))
			));

			const rangeRow = document.createElement("div");
			rangeRow.classList.add("idle-anim__range-row");
			rangeRow.appendChild(buildNumberGroup("From", "idle-anim__from", from, { step }));
			rangeRow.appendChild(buildNumberGroup("To", "idle-anim__to", to, { step }));
			fieldsContainer.appendChild(rangeRow);

			// Wire attribute change → update from/to defaults
			const attrSelect = fieldsContainer.querySelector(".idle-anim__attribute");
			attrSelect?.addEventListener("change", () => {
				const defs = getAttributeDefaults(attrSelect.value, doc);
				const fromInput = fieldsContainer.querySelector(".idle-anim__from");
				const toInput = fieldsContainer.querySelector(".idle-anim__to");
				if (fromInput) { fromInput.value = String(defs.from); fromInput.step = defs.step; }
				if (toInput) { toInput.value = String(defs.to); toInput.step = defs.step; }
			});
		}
	}

	renderTypeFields(type, config);

	// Common fields: period + easing
	const period = config.period ?? (type === "tile-tint" ? TILE_TINT_DEFAULTS.period : TILE_PROP_DEFAULTS.period);
	const easing = config.easing ?? "easeInOutCosine";

	body.appendChild(buildNumberGroup("Period (ms)", "idle-anim__period", period, { min: "100", step: "100" }));
	body.appendChild(buildSelectGroup("Easing", "idle-anim__easing",
		easingNames.map((name) => ({ value: name, label: name, selected: name === easing }))
	));

	card.appendChild(body);

	// Wire type dropdown change (must be after body is appended to card)
	const typeSelect = card.querySelector(".idle-anim__type");
	typeSelect?.addEventListener("change", () => {
		const newType = typeSelect.value;
		const defaults = newType === "tile-tint" ? TILE_TINT_DEFAULTS
			: newType === "tile-scale" ? TILE_SCALE_DEFAULTS
			: TILE_PROP_DEFAULTS;
		renderTypeFields(newType, defaults);
	});

	// Wire collapse toggle (click header, but not the remove button)
	header.addEventListener("click", (e) => {
		if (e.target.closest(".idle-anim__slot-remove")) return;
		card.classList.toggle("is-collapsed");
		// Update summary when collapsing
		if (card.classList.contains("is-collapsed")) {
			const cfg = readSlotConfig(card);
			if (cfg) summary.textContent = summarizeConfig(cfg);
		}
	});

	// Wire remove button
	removeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const container = card.parentElement;
		card.remove();
		if (container) renumberSlots(container);
	});

	// Drag & drop reorder
	makeDraggable(card, { dropGroup: "idle-anim" });

	return card;
}

/**
 * Renumber slot titles after add/remove.
 */
function renumberSlots(container) {
	const slots = container.querySelectorAll(".idle-anim__slot");
	slots.forEach((slot, i) => {
		slot.dataset.index = String(i);
		const title = slot.querySelector(".idle-anim__slot-title");
		if (title) title.textContent = `Animation ${i + 1}`;
	});
}

// ── Tab content ──────────────────────────────────────────────────────

function buildTabContent(doc) {
	const configs = getIdleAnimationConfigs(doc);

	const section = document.createElement("section");
	section.classList.add("eidolon-idle-animation");

	// Slot list container
	const slotsContainer = document.createElement("div");
	slotsContainer.classList.add("idle-anim__slots");

	for (let i = 0; i < configs.length; i++) {
		slotsContainer.appendChild(buildSlot(doc, configs[i], i));
	}

	section.appendChild(slotsContainer);

	// Drop container for reorder
	makeDropContainer(slotsContainer, {
		dropGroup: "idle-anim",
		onDrop() {
			renumberSlots(slotsContainer);
		},
	});

	// Add Animation button
	const addBtn = document.createElement("button");
	addBtn.type = "button";
	addBtn.classList.add("idle-anim__add");
	addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Animation';
	addBtn.addEventListener("click", () => {
		const count = slotsContainer.querySelectorAll(".idle-anim__slot").length;
		const slot = buildSlot(doc, TILE_PROP_DEFAULTS, count);
		slot.classList.remove("is-collapsed"); // new slots start expanded
		slotsContainer.appendChild(slot);
	});
	section.appendChild(addBtn);

	// Actions row
	const actions = document.createElement("div");
	actions.classList.add("idle-anim__actions");

	const previewBtn = document.createElement("button");
	previewBtn.type = "button";
	previewBtn.classList.add("idle-anim__preview");
	previewBtn.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';

	actions.append(previewBtn);
	section.appendChild(actions);

	return section;
}

// ── Form reading ──────────────────────────────────────────────────────

/**
 * Read a single slot's config from its DOM card.
 */
function readSlotConfig(slot) {
	const typeEl = slot.querySelector(".idle-anim__type");
	const type = typeEl?.value ?? "tile-prop";
	const period = Number.parseInt(slot.querySelector(".idle-anim__period")?.value, 10);
	const easing = slot.querySelector(".idle-anim__easing")?.value ?? "easeInOutCosine";

	if (!period || period <= 0) return null;

	if (type === "tile-tint") {
		const fromColor = slot.querySelector(".idle-anim__from-color")?.value
			?? slot.querySelector(".idle-anim__from-color-text")?.value
			?? TILE_TINT_DEFAULTS.fromColor;
		const toColor = slot.querySelector(".idle-anim__to-color")?.value
			?? slot.querySelector(".idle-anim__to-color-text")?.value
			?? TILE_TINT_DEFAULTS.toColor;
		const mode = slot.querySelector(".idle-anim__mode")?.value ?? "oklch";
		return { type: "tile-tint", fromColor, toColor, mode, period, easing };
	}

	if (type === "tile-scale") {
		const fromScale = Number.parseFloat(slot.querySelector(".idle-anim__from-scale")?.value);
		const toScale = Number.parseFloat(slot.querySelector(".idle-anim__to-scale")?.value);
		if (Number.isNaN(fromScale) || Number.isNaN(toScale) || fromScale <= 0 || toScale <= 0) return null;
		return { type: "tile-scale", fromScale, toScale, period, easing };
	}

	// tile-prop
	const attribute = slot.querySelector(".idle-anim__attribute")?.value ?? TILE_PROP_DEFAULTS.attribute;
	const from = Number.parseFloat(slot.querySelector(".idle-anim__from")?.value);
	const to = Number.parseFloat(slot.querySelector(".idle-anim__to")?.value);
	if (Number.isNaN(from) || Number.isNaN(to)) return null;
	return { type: "tile-prop", attribute, from, to, period, easing };
}

/**
 * Read all slot configs from the panel.
 */
function readAllFormValues(panel) {
	const slots = panel.querySelectorAll(".idle-anim__slot");
	const configs = [];
	for (const slot of slots) {
		const config = readSlotConfig(slot);
		if (config) configs.push(config);
	}
	return configs;
}

// ── Public API ────────────────────────────────────────────────────────

/**
 * Render the Animations tab into a TileConfig dialog.
 */
export function renderAnimationTab(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	const doc = getTileDocument(app);
	if (!doc) return;

	const tabPanel = ensureTileConfigTab(app, root, TAB_ID, "Animations", TAB_ICON);
	if (!tabPanel) return;

	// Only build the tab content once — don't destroy unsaved user edits on re-render
	if (tabPanel.querySelector(".eidolon-idle-animation")) return;

	// Prevent "An invalid form control is not focusable" errors:
	// Our number inputs have min/max constraints and may be hidden inside
	// collapsed slots or inactive tabs when the native form submits.
	const parentForm = tabPanel.closest("form");
	if (parentForm) parentForm.noValidate = true;

	tabPanel.appendChild(buildTabContent(doc));
	app.setPosition?.({ height: "auto" });

	// Wire preview button
	const previewBtn = tabPanel.querySelector(".idle-anim__preview");
	previewBtn?.addEventListener("click", () => {
		const tile = doc.object;
		if (!tile) return;

		if (isLooping(doc.id)) {
			stopLoopsForTile(doc.id);
			previewBtn.classList.remove("is-active");
			previewBtn.innerHTML = '<i class="fa-solid fa-play"></i> Preview All';
			return;
		}

		const configs = readAllFormValues(tabPanel);
		if (configs.length === 0) return;

		startAllLoops(tile, configs);
		previewBtn.classList.add("is-active");
		previewBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
	});

	// Save idle animation data when the native form submits ("Update Tile")
	if (parentForm) {
		parentForm.addEventListener("submit", () => {
			if (isLooping(doc.id)) {
				stopLoopsForTile(doc.id);
			}

			const configs = readAllFormValues(tabPanel);
			// Clear existing flag, then set new data
			doc.update({ [`flags.${MODULE_ID}.-=${FLAG_KEY}`]: null }).then(() => {
				if (configs.length > 0) {
					return doc.update({ [`flags.${MODULE_ID}.${FLAG_KEY}`]: configs });
				}
			});
		});
	}
}

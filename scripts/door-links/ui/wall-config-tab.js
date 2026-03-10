/**
 * WallConfig "Door Links" section — injected into the WallConfig dialog for doors.
 *
 * Displays linked walls grouped by behavior type, with controls to
 * add/remove/highlight walls and re-capture default states.
 *
 * Supports both AppV1 (v12, tabbed) and AppV2 (v13, flat fieldset) layouts:
 *   - V12: Injects a tab via ensureTileConfigTab
 *   - V13: Injects a <fieldset> into the scrollable body
 */

import { asHTMLElement } from "../../common/ui/foundry-compat.js";
import { ensureTileConfigTab } from "../../common/ui/tile-config-tab.js";
import { getAllBehaviors } from "../core/behavior-registry.js";
import { getDoorLinks, setDoorLinks, ensureDefaultState, captureDefaultState, getDefaultState } from "../core/flag-utils.js";
import { highlightWall, removeWallHighlight, clearWallHighlights } from "./wall-highlight.js";
import { enterWallPickMode, cancelWallPickMode } from "./wall-picker.js";

const MODULE_ID = "eidolon-utilities";
const TAB_ID = "eidolon-door-links";
const TAB_LABEL = "Links";
const TAB_ICON = "fa-solid fa-link";
const CONTAINER_CLASS = "eidolon-door-links";

/**
 * Format wall coordinates for display.
 * @param {object} wallDoc
 * @returns {string}
 */
function formatWallCoords(wallDoc) {
	const [x1, y1, x2, y2] = wallDoc.c ?? [0, 0, 0, 0];
	return `(${x1},${y1}) → (${x2},${y2})`;
}

/**
 * Get the short display ID for a wall.
 * @param {string} wallId
 * @returns {string}
 */
function shortId(wallId) {
	return wallId.length > 8 ? wallId.slice(0, 8) + "…" : wallId;
}

/**
 * Collect all wall IDs currently in the links object.
 * @param {Record<string, string[]>} links
 * @returns {Set<string>}
 */
function allLinkedIds(links) {
	const ids = new Set();
	for (const wallIds of Object.values(links)) {
		for (const id of wallIds) ids.add(id);
	}
	return ids;
}

/**
 * Classify a wall by its restriction properties.
 * @param {object} wallDoc
 * @returns {{ label: string, cssClass: string }}
 */
function classifyWall(wallDoc) {
	// Mirrors Foundry's _getWallColor() classification order (sight-first)
	const s = wallDoc.sight ?? 20;
	const m = wallDoc.move ?? 20;

	if (s === 0) return { label: "Invisible Wall", cssClass: "dl-pill--invisible" };
	if (s === 10) return { label: "Terrain Wall", cssClass: "dl-pill--terrain" };
	if ([30, 40].includes(s)) return { label: "Window", cssClass: "dl-pill--window" };
	if (m === 0 && wallDoc.door === 0) return { label: "Ethereal Wall", cssClass: "dl-pill--ethereal" };

	if (wallDoc.door === 1) {
		const ds = wallDoc.ds ?? 0;
		if (ds === 2) return { label: "Locked Door", cssClass: "dl-pill--door-locked" };
		if (ds === 1) return { label: "Open Door", cssClass: "dl-pill--door-open" };
		return { label: "Door", cssClass: "dl-pill--door" };
	}
	if (wallDoc.door === 2) {
		const ds = wallDoc.ds ?? 0;
		if (ds === 2) return { label: "Locked Secret Door", cssClass: "dl-pill--door-locked" };
		if (ds === 1) return { label: "Open Secret Door", cssClass: "dl-pill--secret-open" };
		return { label: "Secret Door", cssClass: "dl-pill--secret" };
	}

	return { label: "Basic Wall", cssClass: "dl-pill--wall" };
}

/**
 * Build a single wall entry row.
 * @param {object} wallDoc
 * @param {string} behaviorName
 * @param {object} doorDoc
 * @param {Function} onRemove  Callback after removal
 * @returns {HTMLDivElement}
 */
function buildWallEntry(wallDoc, behaviorName, doorDoc, onRemove) {
	const row = document.createElement("div");
	row.classList.add("dl-wall-entry");
	row.dataset.wallId = wallDoc.id;
	row.style.cursor = "pointer";
	row.title = "Click to select on canvas";
	row.addEventListener("click", () => {
		const placeable = wallDoc.object;
		if (!placeable) return;
		canvas.walls?.activate();
		if (placeable.controlled) {
			placeable.release();
		} else {
			placeable.control({ releaseOthers: !globalThis.keyboard?.isModifierActive(KeyboardManager.MODIFIER_KEYS.SHIFT) });
		}
	});

	const { label: wallType, cssClass: pillClass } = classifyWall(wallDoc);
	row.classList.add(pillClass);
	row.title = wallType;

	const info = document.createElement("div");
	info.classList.add("dl-wall-entry__info");

	const coords = document.createElement("span");
	coords.classList.add("dl-wall-entry__coords");
	coords.textContent = `#${shortId(wallDoc.id)}  ${formatWallCoords(wallDoc)}`;
	info.appendChild(coords);

	const defaultState = getDefaultState(wallDoc);
	if (defaultState) {
		const badge = document.createElement("span");
		badge.classList.add("dl-wall-entry__defaults");
		badge.textContent = `L:${defaultState.light} M:${defaultState.move} S:${defaultState.sight} Snd:${defaultState.sound}`;
		info.appendChild(badge);
	}

	const actions = document.createElement("span");
	actions.classList.add("dl-wall-entry__actions");

	const highlightBtn = document.createElement("button");
	highlightBtn.type = "button";
	highlightBtn.classList.add("dl-wall-entry__btn");
	highlightBtn.innerHTML = '<i class="fa-solid fa-eye"></i>';
	highlightBtn.title = "Highlight on canvas";
	highlightBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const placeable = wallDoc.object;
		if (!placeable) return;
		highlightWall(placeable, { color: getAllBehaviors().get(behaviorName)?.highlightColor ?? 0xFF6B2B });
	});

	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.classList.add("dl-wall-entry__btn", "dl-wall-entry__btn--remove");
	removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
	removeBtn.title = "Remove link";
	removeBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		row.remove();
		onRemove(wallDoc.id, behaviorName);
	});

	actions.append(highlightBtn, removeBtn);
	row.append(info, actions);
	return row;
}

/**
 * Build a behavior section (e.g., "Reflect" or "Pass-thru").
 */
function buildBehaviorSection(behaviorName, behaviorDef, wallIds, doorDoc, scene, onLinksChanged) {
	const section = document.createElement("div");
	section.classList.add("dl-behavior-section");
	section.dataset.behavior = behaviorName;

	// Header
	const header = document.createElement("div");
	header.classList.add("dl-behavior-section__header");
	const icon = document.createElement("i");
	icon.className = behaviorDef.icon;
	const title = document.createElement("span");
	title.classList.add("dl-behavior-section__title");
	title.textContent = behaviorDef.label;
	const count = document.createElement("span");
	count.classList.add("dl-behavior-section__count");
	count.textContent = `(${wallIds.length})`;

	// Header action buttons (small icons)
	const headerActions = document.createElement("span");
	headerActions.classList.add("dl-behavior-section__header-actions");

	const pickBtn = document.createElement("button");
	pickBtn.type = "button";
	pickBtn.classList.add("dl-header-btn");
	pickBtn.innerHTML = '<i class="fa-solid fa-crosshairs"></i>';
	pickBtn.title = "Pick from canvas";

	const addSelBtn = document.createElement("button");
	addSelBtn.type = "button";
	addSelBtn.classList.add("dl-header-btn");
	addSelBtn.innerHTML = '<i class="fa-solid fa-object-group"></i>';
	addSelBtn.title = "Add selected walls";

	const selectAllBtn = document.createElement("button");
	selectAllBtn.type = "button";
	selectAllBtn.classList.add("dl-header-btn");
	selectAllBtn.innerHTML = '<i class="fa-solid fa-arrows-to-dot"></i>';
	selectAllBtn.title = "Select all linked walls on canvas";

	headerActions.append(selectAllBtn, addSelBtn, pickBtn);
	header.append(icon, title, count, headerActions);
	section.appendChild(header);

	// Description
	const desc = document.createElement("p");
	desc.classList.add("dl-behavior-section__desc");
	desc.textContent = behaviorDef.description;
	section.appendChild(desc);

	// Wall list
	const wallList = document.createElement("div");
	wallList.classList.add("dl-behavior-section__walls");

	function updateCount() {
		const rows = wallList.querySelectorAll(".dl-wall-entry");
		count.textContent = `(${rows.length})`;
	}

	function handleRemove(wallId, behavior) {
		updateCount();
		onLinksChanged();
	}

	for (const wallId of wallIds) {
		const wallDoc = scene.walls.get(wallId);
		if (!wallDoc) continue;
		wallList.appendChild(buildWallEntry(wallDoc, behaviorName, doorDoc, handleRemove));
	}

	section.appendChild(wallList);

	// ── Button event handlers ──

	pickBtn.addEventListener("click", (e) => {
		e.stopPropagation();

		enterWallPickMode({
			sourceDoorId: doorDoc.id,
			getExcludeIds: () => allLinkedIds(readLinksFromDOM(section.closest(`.${CONTAINER_CLASS}`))),
			onPick: async (wallDoc) => {
				await ensureDefaultState(wallDoc);
				wallList.appendChild(buildWallEntry(wallDoc, behaviorName, doorDoc, handleRemove));
				updateCount();
				onLinksChanged();
			},
			onUnpick: (wallDoc) => {
				const container = section.closest(`.${CONTAINER_CLASS}`);
				const entry = container?.querySelector(`.dl-wall-entry[data-wall-id="${wallDoc.id}"]`);
				if (entry) {
					entry.remove();
					for (const sec of container.querySelectorAll(".dl-behavior-section")) {
						const rows = sec.querySelectorAll(".dl-wall-entry");
						sec.querySelector(".dl-behavior-section__count").textContent = `(${rows.length})`;
					}
					onLinksChanged();
				}
			},
		});
	});

	addSelBtn.addEventListener("click", async (e) => {
		e.stopPropagation();
		const controlled = canvas.walls?.controlled ?? [];
		if (controlled.length === 0) {
			ui.notifications?.warn("No walls selected. Select walls on the canvas first.");
			return;
		}

		const currentLinks = readLinksFromDOM(section.closest(`.${CONTAINER_CLASS}`));
		const excludeIds = allLinkedIds(currentLinks);
		let added = 0;

		for (const wallPlaceable of controlled) {
			const doc = wallPlaceable.document;
			if (!doc || doc.id === doorDoc.id) continue;
			if (excludeIds.has(doc.id)) continue;

			await ensureDefaultState(doc);
			wallList.appendChild(buildWallEntry(doc, behaviorName, doorDoc, handleRemove));
			excludeIds.add(doc.id);
			added++;
		}

		if (added > 0) {
			updateCount();
			onLinksChanged();
			ui.notifications?.info(`Added ${added} wall(s) to ${behaviorDef.label}.`);
		} else {
			ui.notifications?.warn("No eligible walls in selection (doors and already-linked walls are excluded).");
		}
	});

	selectAllBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		const ids = [...wallList.querySelectorAll(".dl-wall-entry")].map((el) => el.dataset.wallId);
		if (ids.length === 0) {
			ui.notifications?.info("No walls to select.");
			return;
		}
		canvas.walls?.activate();

		// Check if all walls in this section are already selected — if so, deselect them
		const placeables = ids.map((id) => scene.walls.get(id)?.object).filter(Boolean);
		const allSelected = placeables.length > 0 && placeables.every((p) => p.controlled);

		if (allSelected) {
			for (const p of placeables) p.release();
			return;
		}

		canvas.walls?.releaseAll();
		let selected = 0;
		for (const p of placeables) {
			p.control({ releaseOthers: false });
			selected++;
		}
		ui.notifications?.info(`Selected ${selected} wall(s).`);
	});

	return section;
}

/**
 * Read the current link state from the DOM.
 * @param {HTMLElement} container  The .eidolon-door-links root
 * @returns {Record<string, string[]>}
 */
function readLinksFromDOM(container) {
	if (!container) return {};
	const links = {};
	for (const section of container.querySelectorAll(".dl-behavior-section")) {
		const behavior = section.dataset.behavior;
		const ids = [];
		for (const entry of section.querySelectorAll(".dl-wall-entry")) {
			if (entry.dataset.wallId) ids.push(entry.dataset.wallId);
		}
		if (ids.length > 0) links[behavior] = ids;
	}
	return links;
}

/**
 * Build the full door-links content container.
 */
function buildDoorLinksContent(doc, scene, refreshFn) {
	const container = document.createElement("div");
	container.classList.add(CONTAINER_CLASS);

	// Prune stale IDs (walls that no longer exist in this scene)
	const rawLinks = getDoorLinks(doc);
	let pruned = false;
	const links = {};
	for (const [behavior, ids] of Object.entries(rawLinks)) {
		const valid = ids.filter((id) => scene.walls.has(id));
		if (valid.length !== ids.length) pruned = true;
		if (valid.length > 0) links[behavior] = valid;
	}
	if (pruned) setDoorLinks(doc, links);

	const behaviors = getAllBehaviors();

	const onLinksChanged = () => {
		const currentLinks = readLinksFromDOM(container);
		setDoorLinks(doc, currentLinks);
	};

	for (const [name, def] of behaviors) {
		const wallIds = links[name] ?? [];
		container.appendChild(buildBehaviorSection(name, def, wallIds, doc, scene, onLinksChanged));
	}

	// Re-capture defaults button
	const recaptureBtn = document.createElement("button");
	recaptureBtn.type = "button";
	recaptureBtn.classList.add("dl-btn", "dl-btn--recapture");
	recaptureBtn.innerHTML = '<i class="fa-solid fa-camera-rotate"></i> Re-capture defaults';
	recaptureBtn.title = "Snapshot current wall properties as the closed-door default for all linked walls";
	recaptureBtn.addEventListener("click", async (e) => {
		e.stopPropagation();
		const currentLinks = readLinksFromDOM(container);
		let count = 0;
		for (const wallIds of Object.values(currentLinks)) {
			for (const wallId of wallIds) {
				const wallDoc = scene.walls.get(wallId);
				if (wallDoc) {
					await captureDefaultState(wallDoc);
					count++;
				}
			}
		}
		ui.notifications?.info(`Re-captured defaults for ${count} linked wall(s).`);
		refreshFn();
	});
	container.appendChild(recaptureBtn);

	// Highlight all linked walls
	highlightLinkedWalls(links, scene);

	// Sync wall selection state to card borders
	const syncSelection = (wallPlaceable, controlled) => {
		const id = wallPlaceable.document?.id ?? wallPlaceable.id;
		const entry = container.querySelector(`.dl-wall-entry[data-wall-id="${id}"]`);
		if (entry) entry.classList.toggle("dl-wall-entry--selected", controlled);
	};
	const selectionHookId = Hooks.on("controlWall", syncSelection);
	container._dlSelectionHookId = selectionHookId;

	// Set initial state for walls already controlled
	for (const entry of container.querySelectorAll(".dl-wall-entry")) {
		const wallDoc = scene.walls.get(entry.dataset.wallId);
		if (wallDoc?.object?.controlled) entry.classList.add("dl-wall-entry--selected");
	}

	return container;
}

// ── Injection strategies ──────────────────────────────────────────────────

/**
 * Find the mount point for V13 AppV2 WallConfig (flat fieldset layout).
 * Returns the scrollable body div if present, null otherwise.
 * @param {HTMLElement} root
 * @returns {HTMLElement|null}
 */
function findV2Body(root) {
	return root.querySelector(".standard-form [data-application-part='body']")
		?? root.querySelector(".standard-form.scrollable")
		?? null;
}

/**
 * Inject as a <fieldset> inside the V13 AppV2 scrollable body.
 * Inserted before the Tagger fieldset or the footer.
 */
function injectAsFieldset(app, root, doc, scene) {
	const body = findV2Body(root);
	if (!body) return false;

	// Don't rebuild
	if (body.querySelector(`.${CONTAINER_CLASS}`)) return true;

	const fieldset = document.createElement("fieldset");
	fieldset.classList.add("dl-fieldset");

	const legend = document.createElement("legend");
	legend.textContent = "Door Links";
	fieldset.appendChild(legend);

	const refresh = () => {
		fieldset.querySelector(`.${CONTAINER_CLASS}`)?.remove();
		fieldset.appendChild(buildDoorLinksContent(doc, scene, refresh));
	};

	fieldset.appendChild(buildDoorLinksContent(doc, scene, refresh));

	// Append at the end of the scrollable body so it scrolls with everything else
	body.appendChild(fieldset);

	return true;
}

/**
 * Inject as a tab in V12 AppV1 WallConfig (tabbed layout).
 */
function injectAsTab(app, root, doc, scene) {
	const tabPanel = ensureTileConfigTab(app, root, TAB_ID, TAB_LABEL, TAB_ICON);
	if (!tabPanel) return false;

	// Don't rebuild
	if (tabPanel.querySelector(`.${CONTAINER_CLASS}`)) return true;

	const parentForm = tabPanel.closest("form");
	if (parentForm) parentForm.noValidate = true;

	const refresh = () => {
		tabPanel.querySelector(`.${CONTAINER_CLASS}`)?.remove();
		tabPanel.appendChild(buildDoorLinksContent(doc, scene, refresh));
	};

	tabPanel.appendChild(buildDoorLinksContent(doc, scene, refresh));

	app.setPosition?.({ height: "auto" });
	return true;
}

/**
 * Fallback injection for V12 when no tab navigation exists (e.g. MATT not active).
 * Appends a <fieldset> to the form, similar to the V13 fieldset strategy.
 */
function injectAsFormSection(app, root, doc, scene) {
	const form = root.querySelector("form");
	if (!form) return false;

	// Don't rebuild
	if (form.querySelector(`.${CONTAINER_CLASS}`)) return true;

	const fieldset = document.createElement("fieldset");
	fieldset.classList.add("dl-fieldset");

	const legend = document.createElement("legend");
	legend.textContent = "Door Links";
	fieldset.appendChild(legend);

	const refresh = () => {
		fieldset.querySelector(`.${CONTAINER_CLASS}`)?.remove();
		fieldset.appendChild(buildDoorLinksContent(doc, scene, refresh));
	};

	fieldset.appendChild(buildDoorLinksContent(doc, scene, refresh));

	const footer = form.querySelector(":scope > footer") ?? form.querySelector(".form-footer");
	form.insertBefore(fieldset, footer ?? null);

	form.noValidate = true;
	app.setPosition?.({ height: "auto" });
	return true;
}

/**
 * Render the door-links section into a WallConfig dialog.
 * Tries V13 flat layout → V12 tabbed layout → V12 form fieldset fallback.
 *
 * @param {object} app  Foundry Application instance (WallConfig)
 * @param {HTMLElement|object} html
 */
export function renderDoorLinksTab(app, html) {
	const root = asHTMLElement(html);
	if (!root) return;

	const doc = app.document ?? app.object?.document ?? app.object;
	if (!doc || doc.door === 0) return;

	const scene = doc.parent;
	if (!scene) return;

	const injected = injectAsFieldset(app, root, doc, scene)
		|| injectAsTab(app, root, doc, scene)
		|| injectAsFormSection(app, root, doc, scene);
	if (!injected) return;

	// Clean up highlights when the config dialog closes
	const closeHook = `close${app.constructor.name}`;
	const closeHookId = Hooks.on(closeHook, (closedApp) => {
		if (closedApp === app) {
			clearWallHighlights();
			cancelWallPickMode();
			// Clean up selection sync hook
			const container = root.querySelector(`.${CONTAINER_CLASS}`);
			if (container?._dlSelectionHookId != null) {
				Hooks.off("controlWall", container._dlSelectionHookId);
			}
			Hooks.off(closeHook, closeHookId);
		}
	});
}

/**
 * Highlight all linked walls on the canvas, color-coded by behavior.
 */
function highlightLinkedWalls(links, scene) {
	const behaviors = getAllBehaviors();
	for (const [name, wallIds] of Object.entries(links)) {
		const color = behaviors.get(name)?.highlightColor ?? 0xFF6B2B;
		for (const wallId of wallIds) {
			const wallDoc = scene.walls.get(wallId);
			const placeable = wallDoc?.object;
			if (placeable) {
				highlightWall(placeable, { color });
			}
		}
	}
}

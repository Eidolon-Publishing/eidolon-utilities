import { setActiveTab } from "./foundry-compat.js";
import { findFooterElement } from "./scene-config-tab-factory.js";

function elementDepth(element, stopAt = null) {
	let depth = 0;
	let current = element;
	while (current instanceof HTMLElement && current !== stopAt) {
		depth += 1;
		current = current.parentElement;
	}
	return depth;
}

function getAppTabGroups(app) {
	if (!Array.isArray(app?._tabs)) return new Set();
	return new Set(app._tabs.map((tab) => tab?._group).filter((group) => typeof group === "string" && group));
}

function getElementTabGroup(element) {
	if (!(element instanceof HTMLElement)) return null;
	return element.dataset.group ?? element.querySelector("[data-group]")?.dataset?.group ?? null;
}

function countPanelsForGroup(root, group) {
	if (!(root instanceof HTMLElement)) return 0;
	const tabs = Array.from(root.querySelectorAll(".tab[data-tab]"));
	if (!group) return tabs.length;
	return tabs.filter((tab) => tab instanceof HTMLElement && tab.dataset.group === group).length;
}

function collectParentTabContainers(root, group = null) {
	if (!(root instanceof HTMLElement)) return [];
	const containers = new Map();
	for (const tab of root.querySelectorAll(".tab[data-tab]")) {
		if (!(tab instanceof HTMLElement)) continue;
		if (group && tab.dataset.group !== group) continue;
		const parent = tab.parentElement;
		if (!(parent instanceof HTMLElement)) continue;
		containers.set(parent, (containers.get(parent) ?? 0) + 1);
	}
	return Array.from(containers.entries()).map(([element, tabCount]) => ({ element, tabCount }));
}

/**
 * Find the tab navigation bar inside a TileConfig root element.
 * @param {HTMLElement} root
 * @returns {HTMLElement|null}
 */
export function findTabNav(root, app = null) {
	if (!(root instanceof HTMLElement)) return null;

	const selectors = [
		"nav.sheet-tabs[data-group]",
		"nav.tabs[data-group]",
		"nav.sheet-tabs",
		"nav.tabs"
	];

	const candidates = [];
	for (const selector of selectors) {
		for (const nav of root.querySelectorAll(selector)) {
			if (!(nav instanceof HTMLElement) || candidates.includes(nav)) continue;
			candidates.push(nav);
		}
	}

	if (!candidates.length) return null;

	const appGroups = getAppTabGroups(app);
	const ranked = candidates.map((nav) => {
		const group = getElementTabGroup(nav);
		const panelCount = countPanelsForGroup(root, group);
		const depth = elementDepth(nav, root);
		const groupBonus = group && appGroups.has(group) ? 100 : 0;
		return {
			nav,
			group,
			panelCount,
			depth,
			score: groupBonus + panelCount * 10 - depth
		};
	});

	ranked.sort((left, right) => right.score - left.score || left.depth - right.depth);
	return ranked[0]?.nav ?? null;
}

/**
 * Find the tab body container that holds tab panels.
 * @param {HTMLElement} root
 * @param {HTMLElement|null} nav
 * @returns {HTMLElement|null}
 */
export function findTabBody(root, nav) {
	if (!(root instanceof HTMLElement)) return null;
	const group = getElementTabGroup(nav);

	const scopedCandidates = [];
	if (nav?.parentElement instanceof HTMLElement) {
		const parent = nav.parentElement;
		scopedCandidates.push(parent.querySelector(":scope > .sheet-body"));
		scopedCandidates.push(parent.querySelector(":scope > .window-content"));
	}

	const groupedContainers = collectParentTabContainers(root, group)
		.sort((left, right) => right.tabCount - left.tabCount || elementDepth(left.element, root) - elementDepth(right.element, root))
		.map((entry) => entry.element);

	const candidates = [
		nav?.parentElement?.querySelector?.(":scope > .sheet-body"),
		...scopedCandidates,
		...groupedContainers,
		root.querySelector(".sheet-body"),
		root.querySelector(".tab[data-tab]")?.parentElement,
		nav?.parentElement
	];

	return candidates.find((candidate) => candidate instanceof HTMLElement) ?? null;
}

/**
 * Determine the tab group name from DOM attributes.
 * @param {HTMLElement|null} nav
 * @param {HTMLElement|null} body
 * @returns {string|null}
 */
export function getTabGroup(nav, body) {
	return (
		nav?.dataset?.group
		?? nav?.querySelector?.("[data-group]")?.dataset?.group
		?? body?.querySelector?.(".tab[data-group]")?.dataset?.group
		?? null
	);
}

/**
 * Set the content of a tab button (icon + label).
 * @param {HTMLElement} button
 * @param {string} label
 * @param {string} iconClass  CSS class for the icon (e.g. "fa-solid fa-sliders")
 */
export function setTabButtonContent(button, label, iconClass) {
	if (!(button instanceof HTMLElement)) return;

	button.textContent = "";

	const icon = document.createElement("i");
	icon.className = iconClass;
	icon.setAttribute("inert", "");
	button.append(icon, " ");

	const text = document.createElement("span");
	text.textContent = label;
	button.append(text);
}

/**
 * Create a tab button element that matches existing button styles.
 * @param {HTMLElement} nav
 * @param {string} group
 * @param {string} tabId
 * @returns {HTMLElement}
 */
export function createTabButton(nav, group, tabId) {
	const reference = nav.querySelector("[data-tab]");
	const tagName = reference?.tagName || "A";
	const button = document.createElement(tagName);

	if (reference instanceof HTMLElement) {
		button.className = reference.className;
	}

	button.classList.remove("active");

	if (tagName === "BUTTON") {
		button.type = "button";
	}

	button.dataset.action = "tab";
	button.dataset.tab = tabId;
	if (group) button.dataset.group = group;
	button.setAttribute("aria-selected", "false");
	button.setAttribute("aria-pressed", "false");

	return button;
}

/**
 * Create a tab panel element.
 * @param {HTMLElement} body
 * @param {string} group
 * @param {string} tabId
 * @returns {HTMLElement}
 */
export function createTabPanel(body, group, tabId) {
	const panel = document.createElement("div");
	panel.classList.add("tab");
	panel.dataset.tab = tabId;
	if (group) panel.dataset.group = group;
	panel.dataset.applicationPart = tabId;
	panel.setAttribute("hidden", "true");

	const footer = findFooterElement(body);
	body.insertBefore(panel, footer ?? null);
	return panel;
}

/**
 * Synchronize tab button and panel visibility based on active state.
 * @param {object} app  Foundry Application instance
 * @param {string} group
 * @param {string} tabId
 * @param {HTMLElement} button
 * @param {HTMLElement} panel
 */
export function syncTabVisibility(app, group, tabId, button, panel) {
	if (!(button instanceof HTMLElement) || !(panel instanceof HTMLElement)) return;

	const activeTab = app?.tabGroups?.[group];
	const isActive = typeof activeTab === "string"
		? activeTab === tabId
		: button.classList.contains("active") || panel.classList.contains("active");

	if (isActive) {
		button.classList.add("active");
		button.setAttribute("aria-selected", "true");
		button.setAttribute("aria-pressed", "true");
		panel.classList.add("active");
		panel.removeAttribute("hidden");
		panel.removeAttribute("aria-hidden");
		return;
	}

	button.classList.remove("active");
	button.setAttribute("aria-selected", "false");
	button.setAttribute("aria-pressed", "false");
	panel.classList.remove("active");
	panel.setAttribute("hidden", "true");
}

/**
 * Ensure a custom tab exists in a TileConfig dialog.
 * Creates the tab button and panel if they don't already exist, wires click
 * handling, and syncs visibility.
 *
 * @param {object} app  Foundry Application instance
 * @param {HTMLElement} root  The dialog root element
 * @param {string} tabId  Unique tab identifier
 * @param {string} label  Display label for the tab button
 * @param {string} iconClass  CSS class for the tab icon
 * @returns {HTMLElement|null}  The tab panel element, or null if injection failed
 */
export function ensureTileConfigTab(app, root, tabId, label, iconClass) {
	const nav = findTabNav(root, app);
	const body = findTabBody(root, nav);
	if (!(nav instanceof HTMLElement) || !(body instanceof HTMLElement)) return null;

	const group = getTabGroup(nav, body);

	let tabButton = nav.querySelector(`[data-tab="${tabId}"]`);
	if (!(tabButton instanceof HTMLElement)) {
		tabButton = createTabButton(nav, group, tabId);
		nav.appendChild(tabButton);
	}

	setTabButtonContent(tabButton, label, iconClass);

	let tabPanel = body.querySelector(`.tab[data-tab="${tabId}"]`);
	if (!(tabPanel instanceof HTMLElement)) {
		tabPanel = createTabPanel(body, group, tabId);
	}

	const boundAttr = `data-eidolon-bound-${tabId}`;
	if (!tabButton.hasAttribute(boundAttr)) {
		tabButton.addEventListener("click", () => {
			setActiveTab(app, tabId, group);
			requestAnimationFrame(() => {
				syncTabVisibility(app, group, tabId, tabButton, tabPanel);
			});
		});
		tabButton.setAttribute(boundAttr, "true");
	}

	syncTabVisibility(app, group, tabId, tabButton, tabPanel);
	requestAnimationFrame(() => {
		syncTabVisibility(app, group, tabId, tabButton, tabPanel);
	});

	// If the nav overflows after adding our tab, widen the window to fit
	fitNavWidth(app, nav);

	return tabPanel;
}

/**
 * If the tab nav bar overflows (tabs clipped), widen the application window
 * so all tabs are visible.
 * @param {object} app
 * @param {HTMLElement} nav
 */
function fitNavWidth(app, nav) {
	if (!app?.setPosition || !(nav instanceof HTMLElement)) return;

	requestAnimationFrame(() => {
		if (nav.scrollWidth <= nav.clientWidth) return;

		const overflow = nav.scrollWidth - nav.clientWidth;
		const appEl = app.element instanceof HTMLElement
			? app.element
			: app.element?.[0];
		if (!appEl) return;

		const currentWidth = appEl.offsetWidth || 480;
		app.setPosition({ width: currentWidth + overflow + 16 });
	});
}

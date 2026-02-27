import { setActiveTab } from "./foundry-compat.js";
import { findFooterElement } from "./scene-config-tab-factory.js";

/**
 * Find the tab navigation bar inside a TileConfig root element.
 * @param {HTMLElement} root
 * @returns {HTMLElement|null}
 */
export function findTabNav(root) {
	if (!(root instanceof HTMLElement)) return null;

	const selectors = [
		"nav.sheet-tabs[data-group]",
		"nav.tabs[data-group]",
		"nav.sheet-tabs",
		"nav.tabs"
	];

	for (const selector of selectors) {
		const nav = root.querySelector(selector);
		if (nav instanceof HTMLElement) return nav;
	}

	return null;
}

/**
 * Find the tab body container that holds tab panels.
 * @param {HTMLElement} root
 * @param {HTMLElement|null} nav
 * @returns {HTMLElement|null}
 */
export function findTabBody(root, nav) {
	if (!(root instanceof HTMLElement)) return null;

	const candidates = [
		root.querySelector(".tab[data-tab]")?.parentElement,
		root.querySelector(".sheet-body"),
		nav?.parentElement?.querySelector?.(":scope > .sheet-body"),
		nav?.parentElement
	];

	return candidates.find((candidate) => candidate instanceof HTMLElement) ?? null;
}

/**
 * Determine the tab group name from DOM attributes.
 * @param {HTMLElement|null} nav
 * @param {HTMLElement|null} body
 * @returns {string}
 */
export function getTabGroup(nav, body) {
	return (
		nav?.dataset?.group
		?? nav?.querySelector?.("[data-group]")?.dataset?.group
		?? body?.querySelector?.(".tab[data-group]")?.dataset?.group
		?? "main"
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
	button.dataset.group = group;
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
	panel.dataset.group = group;
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
	const nav = findTabNav(root);
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


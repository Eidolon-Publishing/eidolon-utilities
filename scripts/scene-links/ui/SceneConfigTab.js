/**
 * SceneConfig tab for viewing and editing scene links.
 *
 * Uses createSceneConfigTabFactory for DOM injection and tab lifecycle.
 */

import { createSceneConfigTabFactory } from "../../common/ui/scene-config-tab-factory.js";
import { createApplicationFactory } from "../../common/ui/application-factories.js";
import { getSceneFromApplication, hasSceneDocument, localize } from "../../time-triggers/core/utils.js";
import { getSceneLinks, updateLinkLabel, removeSceneLink, getSyncLinkedCriteria, setSyncLinkedCriteria } from "../core/flag-utils.js";
import { navigateToLink, resolveScene } from "../core/navigation.js";
import { removeBidirectionalLink } from "../core/sync.js";
import AddLinkApplication from "./AddLinkApplication.js";
import EditLinkApplication from "./EditLinkApplication.js";
import RemoveLinkApplication from "./RemoveLinkApplication.js";

const MODULE_ID = "eidolon-utilities";
const TEMPLATE = `modules/${MODULE_ID}/templates/scene-links-tab.html`;

const logger = {
	log: (...args) => console.debug?.(`${MODULE_ID} | SceneLinks`, ...args),
	group: (...args) => console.groupCollapsed?.(`${MODULE_ID} | SceneLinks`, ...args),
	groupEnd: () => console.groupEnd?.(),
};

const addLinkFactory = createApplicationFactory(AddLinkApplication);
const editLinkFactory = createApplicationFactory(EditLinkApplication);
const removeLinkFactory = createApplicationFactory(RemoveLinkApplication);

const sceneLinksConfigFactory = createSceneConfigTabFactory({
	tabId: "scene-links",
	tabLabel: () => localize("EIDOLON.SceneLinks.TabLabel", "Scene Links"),
	tabIcon: "fa-solid fa-link",
	getScene: getSceneFromApplication,
	isApplicable: () => true,
	renderContent: ({ app, tab, scene }) => renderLinksTab(app, tab, scene),
	logger,
});

export function registerSceneLinksConfigTab() {
	return sceneLinksConfigFactory.register();
}

export function unregisterSceneLinksConfigTab() {
	return sceneLinksConfigFactory.unregister();
}

// ── Rendering ────────────────────────────────────────────────────────────

function renderLinksTab(app, tabElement, scene) {
	if (!(tabElement instanceof HTMLElement)) return;
	const activeScene = hasSceneDocument(scene) ? scene : getSceneFromApplication(app);
	void renderLinksTabContent(app, tabElement, activeScene);
}

async function renderLinksTabContent(app, tabElement, sceneOverride) {
	const scene = sceneOverride ?? getSceneFromApplication(app);

	if (!hasSceneDocument(scene)) {
		tabElement.innerHTML = `<p class="notes">${localize("EIDOLON.SceneLinks.NoLinks", "No linked scenes.")}</p>`;
		return;
	}

	const links = getSceneLinks(scene);
	const enrichedLinks = links.map((link) => {
		const targetScene = resolveScene(link.target);
		return {
			label: link.label,
			target: link.target,
			sceneName: targetScene?.name ?? `[Missing: ${link.target}]`,
			isMissing: !targetScene,
		};
	});

	const templateRenderer =
		foundry?.applications?.handlebars?.renderTemplate ??
		(typeof renderTemplate === "function" ? renderTemplate : globalThis?.renderTemplate);

	if (typeof templateRenderer !== "function") {
		tabElement.innerHTML = `<p class="notes">${localize("EIDOLON.SceneLinks.NoLinks", "No linked scenes.")}</p>`;
		return;
	}

	const renderedTemplate = await templateRenderer(TEMPLATE, {
		description: localize("EIDOLON.SceneLinks.Description", "Link this scene to related scenes for quick navigation."),
		links: enrichedLinks,
		hasLinks: enrichedLinks.length > 0,
		syncCriteria: getSyncLinkedCriteria(scene),
		labels: {
			noLinks: localize("EIDOLON.SceneLinks.NoLinks", "No linked scenes."),
			addLink: localize("EIDOLON.SceneLinks.AddLink", "Add Link"),
			navigate: localize("EIDOLON.SceneLinks.Navigate", "Navigate"),
			edit: localize("EIDOLON.SceneLinks.Edit", "Edit"),
			remove: localize("EIDOLON.SceneLinks.Remove", "Remove"),
			syncCriteria: localize("EIDOLON.SceneLinks.SyncCriteria", "Sync live criteria to linked scenes"),
			syncCriteriaHint: localize("EIDOLON.SceneLinks.SyncCriteriaHint", "When criteria change on this scene, apply matching values to all linked scenes."),
		},
	});

	tabElement.innerHTML = renderedTemplate;
	bindTabEvents(app, tabElement, scene);

	// Resize the SceneConfig window AFTER async content is in the DOM.
	// Without this, Foundry's height:"auto" sizes to the empty/small tab before content loads.
	app.setPosition?.({ height: "auto" });
}

// ── Event binding ────────────────────────────────────────────────────────

function bindTabEvents(app, tabElement, sceneOverride) {
	const scene = sceneOverride ?? getSceneFromApplication(app);
	if (!hasSceneDocument(scene)) return;

	// Navigate
	tabElement.querySelectorAll('[data-action="navigate"]').forEach((el) => {
		el.addEventListener("click", (e) => {
			e.preventDefault();
			const target = el.dataset.target;
			if (target) navigateToLink(target);
		});
	});

	// Edit label
	tabElement.querySelectorAll('[data-action="edit"]').forEach((el) => {
		el.addEventListener("click", async (e) => {
			e.preventDefault();
			const target = el.dataset.target;
			if (!target) return;
			const link = getSceneLinks(scene).find((l) => l.target === target);
			if (!link) return;
			await openEditDialog(app, tabElement, scene, link);
		});
	});

	// Remove
	tabElement.querySelectorAll('[data-action="remove"]').forEach((el) => {
		el.addEventListener("click", async (e) => {
			e.preventDefault();
			const target = el.dataset.target;
			if (!target) return;
			await openRemoveDialog(app, tabElement, scene, target);
		});
	});

	// Add
	const addButton = tabElement.querySelector('[data-action="add"]');
	if (addButton) {
		addButton.addEventListener("click", async (e) => {
			e.preventDefault();
			await openAddDialog(app, tabElement, scene);
		});
	}

	// Sync criteria toggle
	const syncCheckbox = tabElement.querySelector('[data-action="toggle-sync-criteria"]');
	if (syncCheckbox) {
		syncCheckbox.addEventListener("change", () => {
			app._eidolonActiveTab = "scene-links";
			setSyncLinkedCriteria(scene, syncCheckbox.checked);
		});
	}
}

// ── Dialog launchers ─────────────────────────────────────────────────────

function openAddDialog(app, tabElement, scene) {
	app._eidolonActiveTab = "scene-links";
	const addApp = addLinkFactory({
		scene,
		onComplete: () => {
			app._eidolonActiveTab = "scene-links";
			renderLinksTabContent(app, tabElement, scene);
		},
	});
	addApp.render({ force: true });
}

function openRemoveDialog(app, tabElement, scene, target) {
	app._eidolonActiveTab = "scene-links";
	const removeApp = removeLinkFactory({
		scene,
		target,
		onComplete: () => {
			app._eidolonActiveTab = "scene-links";
			renderLinksTabContent(app, tabElement, scene);
		},
	});
	removeApp.render({ force: true });
}

function openEditDialog(app, tabElement, scene, link) {
	app._eidolonActiveTab = "scene-links";
	const editApp = editLinkFactory({
		scene,
		link,
		onComplete: () => {
			app._eidolonActiveTab = "scene-links";
			renderLinksTabContent(app, tabElement, scene);
		},
	});
	editApp.render({ force: true });
}

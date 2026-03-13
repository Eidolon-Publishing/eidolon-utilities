/**
 * Hook registration for the scene-links feature.
 *
 * Hooks:
 *   - ready:        Expose public API on game.modules.get("eidolon-utilities").api.sceneLinks
 *   - deleteScene:  Clean up dangling links on all scenes that pointed to the deleted scene
 *
 * Also registers the SceneConfig tab via the scene-config-tab factory.
 */

import { getSceneLinks, setSceneLinks, addSceneLink, removeSceneLink, findLinkByLabel, getSyncLinkedCriteria, setSyncLinkedCriteria } from "./core/flag-utils.js";
import { navigateToLink } from "./core/navigation.js";
import { isSyncing, cleanupDanglingLinks } from "./core/sync.js";
import { onCriteriaStateApplied } from "./core/criteria-sync.js";
import { registerSceneLinksConfigTab } from "./ui/SceneConfigTab.js";

const MODULE_ID = "eidolon-utilities";

// ── Hook handlers ────────────────────────────────────────────────────────

/**
 * When a scene is deleted, clean up all links on other scenes that referenced it.
 */
function onDeleteScene(scene) {
	if (isSyncing()) return;
	cleanupDanglingLinks(scene.id);
}

// ── Registration ─────────────────────────────────────────────────────────

export function registerSceneLinksHooks() {
	// Register the SceneConfig tab
	registerSceneLinksConfigTab();

	// Hook: clean up dangling links when a scene is deleted
	Hooks.on("deleteScene", onDeleteScene);

	// Hook: sync criteria state to linked scenes
	Hooks.on("eidolon-utilities.criteriaStateApplied", onCriteriaStateApplied);

	// Register the public API
	Hooks.once("ready", () => {
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.sceneLinks = {
			getSceneLinks,
			setSceneLinks,
			addSceneLink,
			removeSceneLink,
			findLinkByLabel,
			navigateToLink,
			getSyncLinkedCriteria,
			setSyncLinkedCriteria,
		};

		console.log(`[${MODULE_ID}] Scene Links API registered.`);
	});
}

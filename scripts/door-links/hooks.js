/**
 * Hook registration for the door-links feature.
 *
 * Hooks:
 *   - updateWall:       Detect door state changes → trigger controller
 *   - deleteWall:       Clean deleted walls from door link arrays
 *   - renderWallConfig: Inject the "Links" tab for door walls
 *   - canvasReady:      Clear stale highlight state
 *
 * Also registers the public API on game.modules.get("eidolon-utilities").api.doorLinks.
 */

import { registerBehavior, getBehavior, getAllBehaviors } from "./core/behavior-registry.js";
import { getDoorLinks, setDoorLinks, removeWallFromAllLinks } from "./core/flag-utils.js";
import { onDoorStateChange } from "./core/door-controller.js";
import { renderDoorLinksTab } from "./ui/wall-config-tab.js";
import { clearWallHighlights } from "./ui/wall-highlight.js";

const MODULE_ID = "eidolon-utilities";

// ── Hook handlers ────────────────────────────────────────────────────────

/**
 * Detect door state changes and trigger linked wall updates.
 */
function onUpdateWall(wallDoc, changes) {
	// Only care about door state changes
	if (changes.ds === undefined) return;
	if (wallDoc.door === 0) return;

	onDoorStateChange(wallDoc, changes.ds);
}

/**
 * When a wall is deleted, clean it from any door's link arrays.
 * We scan doors on the scene (there are few doors, so this is cheap).
 */
function onDeleteWall(wallDoc) {
	const scene = wallDoc.parent;
	if (!scene) return;

	const deletedId = wallDoc.id;

	for (const wall of scene.walls) {
		if (wall.door === 0) continue;
		removeWallFromAllLinks(wall, deletedId);
	}
}

/**
 * Inject the "Links" tab into WallConfig for door walls.
 */
function onRenderWallConfig(app, html) {
	renderDoorLinksTab(app, html);
}

/**
 * Clear stale highlights when a new scene loads.
 */
function onCanvasReady() {
	clearWallHighlights();
}

// ── Registration ─────────────────────────────────────────────────────────

export function registerDoorLinksHooks() {
	Hooks.on("updateWall", onUpdateWall);
	Hooks.on("deleteWall", onDeleteWall);
	Hooks.on("renderWallConfig", onRenderWallConfig);
	Hooks.on("canvasReady", onCanvasReady);

	// Register the public API
	Hooks.once("ready", () => {
		const mod = game.modules.get(MODULE_ID);
		if (!mod.api) mod.api = {};

		mod.api.doorLinks = {
			registerBehavior,
			getBehavior,
			getAllBehaviors,
			getDoorLinks,
			setDoorLinks,
			triggerDoor: onDoorStateChange,
		};

		console.log(`[${MODULE_ID}] Door Links API registered.`);
	});
}

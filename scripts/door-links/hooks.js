/**
 * Hook registration for the door-links feature.
 *
 * Hooks:
 *   - updateWall:       Detect door state changes → trigger controller
 *   - deleteWall:       Clean deleted walls from door link arrays
 *   - renderWallConfig: Inject the "Links" tab for door walls
 *   - createScene:      Remap stale wall IDs after scene duplication
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
 *
 * When MATT is active it injects tab navigation into WallConfig during the
 * same hook cycle.  Because eidolon's hook can fire before MATT's, we wait
 * for the <nav> to appear (MutationObserver) before injecting our tab.
 * Without MATT we run immediately and use the fieldset fallback.
 */
function onRenderWallConfig(app, html) {
	const root = html instanceof HTMLElement ? html : html?.[0];
	if (!root) return;

	if (!game.modules.get("monks-active-tiles")?.active) {
		renderDoorLinksTab(app, html);
		return;
	}

	// MATT is active — if nav already exists, inject immediately
	if (root.querySelector("nav.sheet-tabs, nav.tabs")) {
		renderDoorLinksTab(app, html);
		return;
	}

	// Otherwise observe for MATT's nav injection
	const observer = new MutationObserver(() => {
		if (root.querySelector("nav.sheet-tabs, nav.tabs")) {
			observer.disconnect();
			renderDoorLinksTab(app, html);
		}
	});
	observer.observe(root, { childList: true, subtree: true });

	// Safety: disconnect if the dialog closes before MATT injects
	const closeHook = `close${app.constructor.name}`;
	const closeId = Hooks.once(closeHook, (closedApp) => {
		if (closedApp === app) observer.disconnect();
	});
}

/**
 * After a scene is duplicated, remap stale wall IDs in door-link flags.
 *
 * When Foundry duplicates a scene it assigns new IDs to all embedded walls,
 * but flag payloads still reference the original IDs.  We detect stale refs,
 * locate the source scene, and rebuild the mapping via coordinate matching.
 */
async function onCreateScene(scene) {
	const doorsWithLinks = scene.walls.filter((w) => {
		if (w.door === 0) return false;
		const links = getDoorLinks(w);
		return Object.values(links).some((ids) => ids.length > 0);
	});
	if (doorsWithLinks.length === 0) return;

	// Collect stale IDs (referenced but not present in this scene)
	const sceneWallIds = new Set(scene.walls.map((w) => w.id));
	const staleIds = new Set();
	for (const door of doorsWithLinks) {
		for (const ids of Object.values(getDoorLinks(door))) {
			for (const id of ids) {
				if (!sceneWallIds.has(id)) staleIds.add(id);
			}
		}
	}
	if (staleIds.size === 0) return;

	// Find the source scene that owns the stale IDs
	const sampleStaleId = [...staleIds][0];
	let sourceScene = null;
	for (const s of game.scenes) {
		if (s.id === scene.id) continue;
		if (s.walls.get(sampleStaleId)) {
			sourceScene = s;
			break;
		}
	}
	if (!sourceScene) return; // Source gone — lazy cleanup will handle it

	// Build old→new mapping via coordinate matching
	const coordKey = (c) => c.join(",");
	const newWallByCoords = new Map();
	for (const w of scene.walls) {
		newWallByCoords.set(coordKey(w.c), w.id);
	}

	const idMapping = new Map();
	for (const oldId of staleIds) {
		const oldWall = sourceScene.walls.get(oldId);
		if (!oldWall) continue;
		const newId = newWallByCoords.get(coordKey(oldWall.c));
		if (newId) idMapping.set(oldId, newId);
	}

	// Rewrite flags on each door
	for (const door of doorsWithLinks) {
		const links = getDoorLinks(door);
		const newLinks = {};
		let changed = false;
		for (const [behavior, ids] of Object.entries(links)) {
			newLinks[behavior] = ids.map((id) => {
				const newId = idMapping.get(id);
				if (newId) {
					changed = true;
					return newId;
				}
				return id;
			});
		}
		if (changed) await setDoorLinks(door, newLinks);
	}
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
	Hooks.on("createScene", onCreateScene);
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

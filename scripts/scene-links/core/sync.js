/**
 * Bidirectional link synchronization for scene-links.
 *
 * When the DM adds/removes a link on one scene, the corresponding
 * reverse link on the target scene is added/removed automatically.
 * An echo guard prevents infinite recursion through the updateScene hook.
 */

import { getSceneLinks, addSceneLink, removeSceneLink } from "./flag-utils.js";

/** Module-level echo guard to prevent re-entrant sync. */
let _syncing = false;

/**
 * Check whether a sync operation is currently in progress.
 * Used by the updateScene hook to skip echo updates.
 * @returns {boolean}
 */
export function isSyncing() {
	return _syncing;
}

/**
 * Add a bidirectional link between two scenes.
 * @param {object} sourceScene
 * @param {object} targetScene
 * @param {string} sourceLabel  Label shown on sourceScene for the link to targetScene
 * @param {string} targetLabel  Label shown on targetScene for the reverse link to sourceScene
 * @returns {Promise}
 */
export async function addBidirectionalLink(sourceScene, targetScene, sourceLabel, targetLabel) {
	_syncing = true;
	try {
		await addSceneLink(sourceScene, { label: sourceLabel, target: targetScene.id });
		await addSceneLink(targetScene, { label: targetLabel, target: sourceScene.id });
	} finally {
		_syncing = false;
	}
}

/**
 * Remove the link between two scenes in both directions.
 * @param {object} sourceScene
 * @param {object} targetScene
 * @returns {Promise}
 */
export async function removeBidirectionalLink(sourceScene, targetScene) {
	_syncing = true;
	try {
		await removeSceneLink(sourceScene, targetScene.id);
		await removeSceneLink(targetScene, sourceScene.id);
	} finally {
		_syncing = false;
	}
}

/**
 * Remove dangling links on all scenes that point to a deleted scene.
 * @param {string} deletedSceneId  ID of the scene that was deleted
 * @returns {Promise}
 */
export async function cleanupDanglingLinks(deletedSceneId) {
	_syncing = true;
	try {
		for (const scene of game.scenes) {
			const links = getSceneLinks(scene);
			if (links.some((l) => l.target === deletedSceneId)) {
				await removeSceneLink(scene, deletedSceneId);
			}
		}
	} finally {
		_syncing = false;
	}
}

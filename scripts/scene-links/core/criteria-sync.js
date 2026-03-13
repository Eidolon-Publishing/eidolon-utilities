/**
 * Criteria sync for scene-links.
 *
 * When criteria state changes on a scene with syncLinkedCriteria enabled,
 * propagate compatible criteria values to all linked scenes.
 *
 * For each criterion key in the new state:
 *   - Target has the key AND the value → apply
 *   - Target has the key but NOT the value → skip, collect warning
 *   - Target doesn't have the key → skip silently
 */

import { getSceneLinks, getSyncLinkedCriteria } from "./flag-utils.js";
import { getSceneCriteria, getSceneCriteriaState } from "../../scene-criteria/core/storage.js";
import { applyState } from "../../criteria-engine/core/state.js";

const MODULE_ID = "eidolon-utilities";

/** Echo guard — prevents bouncing when a linked scene's state change fires back. */
let _syncingCriteria = false;

/**
 * Check whether a criteria sync is currently in progress.
 * @returns {boolean}
 */
export function isSyncingCriteria() {
	return _syncingCriteria;
}

/**
 * Handle the criteriaStateApplied hook.
 * If the source scene has syncLinkedCriteria enabled, propagate to linked scenes.
 *
 * @param {Scene} scene     The scene whose criteria just changed
 * @param {object} newState The new criteria state (e.g. {mood: "Dark", effect: "Fog"})
 */
export async function onCriteriaStateApplied(scene, newState) {
	// Skip if this is an echo from a previous sync
	if (_syncingCriteria) return;

	// Skip if sync not enabled on this scene
	if (!getSyncLinkedCriteria(scene)) return;

	const links = getSceneLinks(scene);
	if (!links.length) return;

	_syncingCriteria = true;
	const skipped = [];

	try {
		for (const link of links) {
			const targetScene = game.scenes.get(link.target);
			if (!targetScene) continue;

			// Don't sync to scenes that don't have sync enabled
			// (one-way: source pushes, target doesn't need the flag)
			// Actually — the source decides. Target receives regardless.

			const targetCriteria = getSceneCriteria(targetScene);
			if (!targetCriteria.length) continue;

			// Build a partial state with only the keys/values that are valid on the target
			const partialState = {};
			const targetState = getSceneCriteriaState(targetScene, targetCriteria);

			for (const [key, value] of Object.entries(newState)) {
				const criterion = targetCriteria.find((c) => c.key === key);
				if (!criterion) continue; // Target doesn't have this dimension — skip silently

				if (criterion.values.includes(value)) {
					// Only include if different from current target state
					if (targetState[key] !== value) {
						partialState[key] = value;
					}
				} else {
					// Target has the key but not this value — skip with warning
					skipped.push({
						scene: targetScene.name,
						label: link.label,
						key: criterion.label || key,
						value,
					});
				}
			}

			// Apply if there's anything to sync
			if (Object.keys(partialState).length > 0) {
				await applyState(partialState, targetScene);
			}
		}
	} finally {
		_syncingCriteria = false;
	}

	// Show a single toast for any skipped values
	if (skipped.length > 0) {
		const lines = skipped.map((s) => `${s.label}: "${s.value}" not available for ${s.key}`);
		const unique = [...new Set(lines)];
		ui.notifications.warn(`Criteria sync skipped:\n${unique.join("\n")}`, { permanent: false });
	}
}

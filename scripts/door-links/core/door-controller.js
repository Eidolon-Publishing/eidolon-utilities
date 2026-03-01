/**
 * Door controller — orchestrates wall updates when a door opens or closes.
 *
 * When a door state changes, this reads the door's linked walls, applies or
 * reverts the appropriate behavior, and batch-updates all affected walls.
 *
 * Multi-door support: if the same wall is linked to multiple doors, the wall
 * stays in its "applied" state as long as ANY linking door is open.
 */

import { getBehavior } from "./behavior-registry.js";
import { getDoorLinks, getDefaultState } from "./flag-utils.js";

/**
 * Handle a door state change.
 * Called from the updateWall hook when `changes.ds` is set on a door.
 *
 * @param {object} doorDoc   The door's WallDocument
 * @param {number} newDs     The new door state (0=closed, 1=open, 2=locked)
 */
export async function onDoorStateChange(doorDoc, newDs) {
	const scene = doorDoc.parent;
	if (!scene) return;

	const links = getDoorLinks(doorDoc);
	const behaviorNames = Object.keys(links);
	if (behaviorNames.length === 0) return;

	const isOpening = newDs === 1;
	const updates = [];

	// Build reverse index lazily: wallId → [doorDocs that link to it]
	// Only needed when closing, to check if another door keeps it open.
	let reverseIndex = null;

	for (const behaviorName of behaviorNames) {
		const behavior = getBehavior(behaviorName);
		if (!behavior) {
			console.warn(`[eidolon-utilities] Unknown door-link behavior: "${behaviorName}"`);
			continue;
		}

		const wallIds = links[behaviorName];
		if (!wallIds?.length) continue;

		for (const wallId of wallIds) {
			const wallDoc = scene.walls.get(wallId);
			if (!wallDoc) continue;

			const defaultState = getDefaultState(wallDoc);
			if (!defaultState) continue;

			if (isOpening) {
				const props = behavior.apply(wallDoc, defaultState);
				updates.push({ _id: wallId, ...props });
			} else {
				// Closing — check if any OTHER open door also links to this wall
				if (!reverseIndex) reverseIndex = buildReverseIndex(scene, doorDoc.id);

				const otherDoors = reverseIndex.get(wallId);
				if (otherDoors?.length > 0) {
					// Another open door links to this wall — skip revert
					continue;
				}

				const props = behavior.revert(wallDoc, defaultState);
				updates.push({ _id: wallId, ...props });
			}
		}
	}

	if (updates.length > 0) {
		await scene.updateEmbeddedDocuments("Wall", updates);
	}
}

/**
 * Build a reverse index of wallId → open doors that link to it,
 * EXCLUDING the door that triggered the event.
 *
 * @param {object} scene
 * @param {string} excludeDoorId  The door that is currently changing state
 * @returns {Map<string, object[]>}
 */
function buildReverseIndex(scene, excludeDoorId) {
	const index = new Map();

	for (const wall of scene.walls) {
		// Only look at other open doors
		if (wall.id === excludeDoorId) continue;
		if (wall.door === 0) continue;
		if (wall.ds !== 1) continue; // not open

		const links = getDoorLinks(wall);
		for (const wallIds of Object.values(links)) {
			for (const wallId of wallIds) {
				if (!index.has(wallId)) index.set(wallId, []);
				index.get(wallId).push(wall);
			}
		}
	}

	return index;
}

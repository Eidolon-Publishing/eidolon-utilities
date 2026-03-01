/**
 * Flag read/write utilities for door-links.
 *
 * Two flag paths:
 *   - `flags.eidolon-utilities.door-links` on a door wall: { behaviorName: [wallId, ...], ... }
 *   - `flags.eidolon-utilities.door-link-default` on a linked wall: { light, move, sight, sound }
 */

const MODULE_ID = "eidolon-utilities";
const FLAG_DOOR_LINKS = "door-links";
const FLAG_DOOR_LINK_DEFAULT = "door-link-default";

// ── Door-links (on the door wall) ───────────────────────────────────────

/**
 * Read the door-links flag from a door wall document.
 * @param {object} doorDoc  Wall document with door > 0
 * @returns {Record<string, string[]>}  behavior name → array of wall IDs
 */
export function getDoorLinks(doorDoc) {
	return doorDoc?.flags?.[MODULE_ID]?.[FLAG_DOOR_LINKS] ?? {};
}

/**
 * Set the door-links flag on a door wall document.
 * @param {object} doorDoc  Wall document
 * @param {Record<string, string[]>} links  behavior name → array of wall IDs
 * @returns {Promise}
 */
export function setDoorLinks(doorDoc, links) {
	const updateData = { [`flags.${MODULE_ID}.${FLAG_DOOR_LINKS}`]: links };

	// Foundry deep-merges updates, so omitted behavior keys persist.
	// Explicitly delete any behavior keys that were removed.
	const existing = getDoorLinks(doorDoc);
	for (const key of Object.keys(existing)) {
		if (!(key in links)) {
			updateData[`flags.${MODULE_ID}.${FLAG_DOOR_LINKS}.-=${key}`] = null;
		}
	}

	return doorDoc.update(updateData, { render: false });
}

/**
 * Add a wall ID to a specific behavior on a door.
 * @param {object} doorDoc
 * @param {string} behaviorName
 * @param {string} wallId
 * @returns {Promise}
 */
export function addWallToLink(doorDoc, behaviorName, wallId) {
	const links = getDoorLinks(doorDoc);
	const list = links[behaviorName] ? [...links[behaviorName]] : [];
	if (list.includes(wallId)) return Promise.resolve();
	list.push(wallId);
	return setDoorLinks(doorDoc, { ...links, [behaviorName]: list });
}

/**
 * Remove a wall ID from a specific behavior on a door.
 * @param {object} doorDoc
 * @param {string} behaviorName
 * @param {string} wallId
 * @returns {Promise}
 */
export function removeWallFromLink(doorDoc, behaviorName, wallId) {
	const links = getDoorLinks(doorDoc);
	const list = links[behaviorName];
	if (!list) return Promise.resolve();
	const filtered = list.filter((id) => id !== wallId);
	const updated = { ...links };
	if (filtered.length > 0) {
		updated[behaviorName] = filtered;
	} else {
		delete updated[behaviorName];
	}
	return setDoorLinks(doorDoc, updated);
}

/**
 * Remove a wall ID from ALL behaviors on a door.
 * Used when a linked wall is deleted.
 * @param {object} doorDoc
 * @param {string} wallId
 * @returns {Promise|null}  null if no changes needed
 */
export function removeWallFromAllLinks(doorDoc, wallId) {
	const links = getDoorLinks(doorDoc);
	let changed = false;
	const updated = {};
	for (const [behavior, ids] of Object.entries(links)) {
		const filtered = ids.filter((id) => id !== wallId);
		if (filtered.length !== ids.length) changed = true;
		if (filtered.length > 0) updated[behavior] = filtered;
	}
	if (!changed) return null;
	return setDoorLinks(doorDoc, updated);
}

// ── Door-link-default (on linked walls) ──────────────────────────────────

/**
 * Read the door-link-default flag from a wall document.
 * @param {object} wallDoc
 * @returns {{ light: number, move: number, sight: number, sound: number }|null}
 */
export function getDefaultState(wallDoc) {
	return wallDoc?.flags?.[MODULE_ID]?.[FLAG_DOOR_LINK_DEFAULT] ?? null;
}

/**
 * Capture the current wall restriction properties as the default state.
 * @param {object} wallDoc
 * @returns {Promise}
 */
export function captureDefaultState(wallDoc) {
	const state = {
		light: wallDoc.light ?? 20,
		move: wallDoc.move ?? 20,
		sight: wallDoc.sight ?? 20,
		sound: wallDoc.sound ?? 20,
	};
	return wallDoc.update({ [`flags.${MODULE_ID}.${FLAG_DOOR_LINK_DEFAULT}`]: state });
}

/**
 * Capture default state only if not already set.
 * @param {object} wallDoc
 * @returns {Promise}
 */
export function ensureDefaultState(wallDoc) {
	if (getDefaultState(wallDoc)) return Promise.resolve();
	return captureDefaultState(wallDoc);
}

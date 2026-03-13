/**
 * Flag read/write utilities for scene-links.
 *
 * Flag path: flags.eidolon-utilities.sceneLinks
 * Data shape: Array<{ label: string, target: string }>
 */

const MODULE_ID = "eidolon-utilities";
const FLAG_KEY = "sceneLinks";

/**
 * Read the scene links array from a scene document.
 * @param {object} scene  Scene document
 * @returns {Array<{label: string, target: string}>}
 */
export function getSceneLinks(scene) {
	return scene?.flags?.[MODULE_ID]?.[FLAG_KEY] ?? [];
}

/**
 * Set the scene links array on a scene document.
 * @param {object} scene  Scene document
 * @param {Array<{label: string, target: string}>} links
 * @param {object} [options]  Extra options passed to scene.update()
 * @returns {Promise}
 */
export function setSceneLinks(scene, links, options = {}) {
	return scene.update({ [`flags.${MODULE_ID}.${FLAG_KEY}`]: links }, options);
}

/**
 * Append a link to a scene's links array.
 * Skips duplicates (same target already linked).
 * @param {object} scene
 * @param {{label: string, target: string}} link
 * @param {object} [options]
 * @returns {Promise}
 */
export function addSceneLink(scene, { label, target }, options = {}) {
	const existing = getSceneLinks(scene);
	if (existing.some((l) => l.target === target)) return Promise.resolve();
	return setSceneLinks(scene, [...existing, { label, target }], options);
}

/**
 * Remove a link by target ID from a scene's links array.
 * @param {object} scene
 * @param {string} target  Scene ID or UUID of the target to remove
 * @param {object} [options]
 * @returns {Promise}
 */
export function removeSceneLink(scene, target, options = {}) {
	const existing = getSceneLinks(scene);
	const filtered = existing.filter((l) => l.target !== target);
	if (filtered.length === existing.length) return Promise.resolve();
	return setSceneLinks(scene, filtered, options);
}

/**
 * Find a link by label (case-insensitive).
 * @param {object} scene
 * @param {string} label
 * @returns {{label: string, target: string}|null}
 */
export function findLinkByLabel(scene, label) {
	const needle = label.toLowerCase();
	return getSceneLinks(scene).find((l) => l.label.toLowerCase() === needle) ?? null;
}

/**
 * Update the label of an existing link by target.
 * @param {object} scene
 * @param {string} target
 * @param {string} newLabel
 * @param {object} [options]
 * @returns {Promise}
 */
export function updateLinkLabel(scene, target, newLabel, options = {}) {
	const existing = getSceneLinks(scene);
	const updated = existing.map((l) => (l.target === target ? { ...l, label: newLabel } : l));
	return setSceneLinks(scene, updated, options);
}

// ── Sync linked criteria flag ────────────────────────────────────────────

const FLAG_SYNC_CRITERIA = "syncLinkedCriteria";

/**
 * Read whether criteria sync is enabled for a scene.
 * @param {object} scene
 * @returns {boolean}
 */
export function getSyncLinkedCriteria(scene) {
	return scene?.flags?.[MODULE_ID]?.[FLAG_SYNC_CRITERIA] === true;
}

/**
 * Set whether criteria sync is enabled for a scene.
 * @param {object} scene
 * @param {boolean} enabled
 * @param {object} [options]
 * @returns {Promise}
 */
export function setSyncLinkedCriteria(scene, enabled, options = {}) {
	return scene.update({ [`flags.${MODULE_ID}.${FLAG_SYNC_CRITERIA}`]: !!enabled }, options);
}

export { MODULE_ID, FLAG_KEY };

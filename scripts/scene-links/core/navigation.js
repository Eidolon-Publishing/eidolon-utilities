/**
 * Scene navigation helpers for scene-links.
 */

/**
 * Resolve a scene from a target string.
 * Handles both plain IDs and Scene.xxx UUIDs.
 * @param {string} target  Scene ID or UUID
 * @returns {object|null}  Scene document or null
 */
export function resolveScene(target) {
	if (!target || typeof target !== "string") return null;

	// Strip "Scene." prefix if present
	const id = target.startsWith("Scene.") ? target.slice(6) : target;
	return game.scenes.get(id) ?? null;
}

/**
 * Navigate the current user's view to a linked scene.
 * @param {string} target  Scene ID or UUID
 * @returns {Promise}
 */
export async function navigateToLink(target) {
	const scene = resolveScene(target);
	if (!scene) {
		ui.notifications.warn(`Scene not found: ${target}`);
		return;
	}
	return scene.view();
}

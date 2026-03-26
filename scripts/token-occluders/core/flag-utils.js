import { DEFAULT_TOKEN_OCCLUDER_CONFIG, FLAG_TOKEN_OCCLUDER, MODULE_ID } from "./constants.js";

/**
 * Read linked door wall IDs from map-ui-presets metadata on a wall.
 *
 * @param {object} wallDoc
 * @returns {string[]}
 */
export function getLinkedDoorIds(wallDoc) {
	const raw = wallDoc?.flags?.["map-ui-presets"]?.links?.doors;
	if (Array.isArray(raw)) return raw.filter((id) => typeof id === "string" && id.length > 0);
	if (typeof raw === "string" && raw.length > 0) return [raw];
	return [];
}

/**
 * Read and normalize token-occluder wall flags.
 *
 * Walls with linked door references default to door-gated activation unless
 * the user explicitly overrides that flag.
 *
 * @param {object} wallDoc
 * @returns {{ enabled: boolean, gateByLinkedDoors: boolean }}
 */
export function getTokenOccluderConfig(wallDoc) {
	const linkedDoorIds = getLinkedDoorIds(wallDoc);
	const raw = wallDoc?.getFlag?.(MODULE_ID, FLAG_TOKEN_OCCLUDER)
		?? wallDoc?.flags?.[MODULE_ID]?.[FLAG_TOKEN_OCCLUDER]
		?? {};

	return {
		enabled: raw.enabled ?? DEFAULT_TOKEN_OCCLUDER_CONFIG.enabled,
		gateByLinkedDoors: raw.gateByLinkedDoors ?? (linkedDoorIds.length > 0 ? true : DEFAULT_TOKEN_OCCLUDER_CONFIG.gateByLinkedDoors),
	};
}

/**
 * Determine whether a token-occluder wall is currently active.
 *
 * If the wall is configured to follow linked doors, it remains active while
 * any linked door is not open.
 *
 * @param {object} wallDoc
 * @param {object} [scene]
 * @returns {boolean}
 */
export function isTokenOccluderActive(wallDoc, scene = wallDoc?.parent) {
	const config = getTokenOccluderConfig(wallDoc);
	if (!config.enabled) return false;

	const linkedDoorIds = getLinkedDoorIds(wallDoc);
	if (!config.gateByLinkedDoors || linkedDoorIds.length === 0) return true;
	if (!scene?.walls) return false;

	for (const doorId of linkedDoorIds) {
		const doorDoc = scene.walls.get(doorId);
		if (!doorDoc) continue;
		if (doorDoc.door === 0) continue;
		if (doorDoc.ds !== 1) return true;
	}

	return false;
}

/**
 * Check whether a wall update may affect token-only occlusion.
 *
 * @param {object} changes
 * @returns {boolean}
 */
export function touchesTokenOccluderState(changes) {
	if (!changes || typeof changes !== "object") return false;
	if (changes.c !== undefined) return true;
	if (changes.dir !== undefined) return true;
	if (changes.ds !== undefined) return true;

	if (foundry?.utils?.hasProperty?.(changes, `flags.${MODULE_ID}.${FLAG_TOKEN_OCCLUDER}`)) return true;
	if (foundry?.utils?.hasProperty?.(changes, "flags.map-ui-presets.links.doors")) return true;

	return false;
}

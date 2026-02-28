/**
 * Shared selector resolution — resolves selector strings to placeable document(s).
 *
 * Generalizes resolveTarget() from cinematic/runtime.js so it can be
 * reused by the picker, cinematic engine, and any future consumer.
 */

import { MODULE_ID } from "../../time-triggers/core/constants.js";
import { parseSelector } from "./selectors.js";

/**
 * Normalize a Tagger/UUID result into a { placeable, doc } pair.
 * Tagger v13 returns TileDocument objects; older versions return Tile placeables.
 *
 * @param {object} result  A placeable or document object
 * @returns {{ placeable: object, doc: object } | null}
 */
function normalizePlaceable(result) {
	if (!result) return null;

	// Document object (has documentName or _source)
	if (result.documentName || result._source !== undefined) {
		const placeable = result.object;
		if (!placeable) return null;
		return { placeable, doc: result };
	}

	// Placeable object (has document property)
	if (result.document) {
		return { placeable: result, doc: result.document };
	}

	return null;
}

/**
 * Get the Tagger API reference.
 * @returns {object | null}
 */
function getTaggerAPI() {
	return window.Tagger ?? game.modules.get("tagger")?.api ?? null;
}

/**
 * Resolve a selector string to placeable document(s).
 *
 * @param {string} selector  Selector string (tag:X, id:X, tags-any:A,B, etc.)
 * @param {Scene} [scene]    Defaults to canvas.scene
 * @returns {{ kind: string, documents: object[], placeables: Array<{ placeable: object, doc: object }> } | null}
 */
export function resolveSelector(selector, scene) {
	if (!selector) return null;

	const sc = scene ?? canvas.scene;
	if (!sc) return null;

	const parsed = parseSelector(selector);

	switch (parsed.type) {
		case "special":
			return resolveSpecial(parsed.value);

		case "tag":
			return resolveTag(parsed.value, sc, false);

		case "tag-all":
			return resolveTag(parsed.value, sc, true);

		case "id":
			return resolveById(parsed.value, sc);

		case "tags-any":
			return resolveMultiTag(parsed.value, sc, true);

		case "tags-all":
			return resolveMultiTag(parsed.value, sc, false);

		case "uuid":
			return resolveUUID(parsed.value);

		default:
			return null;
	}
}

/**
 * Resolve special selectors ($particles, etc.).
 */
function resolveSpecial(value) {
	if (value === "$particles") {
		if (!game.modules.get("fxmaster")?.active) {
			console.warn(`[${MODULE_ID}] Picker: FXMaster not active, cannot resolve "$particles".`);
			return null;
		}
		const target = canvas.particleeffects;
		return target ? { kind: "particles", documents: [], placeables: [], target } : null;
	}
	return null;
}

/**
 * Resolve a single tag selector.
 */
function resolveTag(tagName, scene, all) {
	const Tagger = getTaggerAPI();
	if (!Tagger) {
		console.warn(`[${MODULE_ID}] Picker: Tagger not available, cannot resolve tag "${tagName}".`);
		return null;
	}

	const matches = Tagger.getByTag(tagName, { sceneId: scene.id });
	if (!matches?.length) return null;

	const placeables = [];

	for (const result of matches) {
		const normalized = normalizePlaceable(result);
		if (normalized) placeables.push(normalized);
	}

	if (placeables.length === 0) return null;

	return {
		kind: placeables.length === 1 ? "placeable" : "multi-placeable",
		documents: placeables.map((p) => p.doc),
		placeables,
	};
}

/**
 * Resolve by document ID within the current scene's tile collection.
 */
function resolveById(docId, scene) {
	// Try each embedded collection (tiles first, then others)
	const collections = [
		scene.tiles,
		scene.lights,
		scene.tokens,
		scene.drawings,
		scene.sounds,
	];

	for (const coll of collections) {
		const doc = coll?.get(docId);
		if (doc) {
			const normalized = normalizePlaceable(doc);
			if (normalized) {
				return {
					kind: "placeable",
					documents: [normalized.doc],
					placeables: [normalized],
				};
			}
		}
	}

	return null;
}

/**
 * Resolve multi-tag selectors (tags-any, tags-all).
 */
function resolveMultiTag(tags, scene, matchAny) {
	const Tagger = getTaggerAPI();
	if (!Tagger) {
		console.warn(`[${MODULE_ID}] Picker: Tagger not available, cannot resolve multi-tag.`);
		return null;
	}

	const matches = Tagger.getByTag(tags, {
		sceneId: scene.id,
		matchAny,
	});

	if (!matches?.length) return null;

	const placeables = [];
	for (const result of matches) {
		const normalized = normalizePlaceable(result);
		if (normalized) placeables.push(normalized);
	}

	if (placeables.length === 0) return null;

	return {
		kind: placeables.length === 1 ? "placeable" : "multi-placeable",
		documents: placeables.map((p) => p.doc),
		placeables,
	};
}

/**
 * Resolve a UUID selector.
 */
function resolveUUID(uuid) {
	const doc = fromUuidSync(uuid);
	if (!doc) return null;

	const normalized = normalizePlaceable(doc);
	if (!normalized) return null;

	return {
		kind: "placeable",
		documents: [normalized.doc],
		placeables: [normalized],
	};
}

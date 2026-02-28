/**
 * Generic dependency index factory.
 *
 * Tracks which documents are affected by which criteria keys,
 * enabling efficient partial updates when only specific keys change.
 */
import { uniqueStringKeys } from "./utils.js";

export function createDependencyIndexManager({ extractKeys, label = "doc" }) {
	let cache = new WeakMap();

	function build(scene, collection) {
		const keyToDocIds = new Map();
		const allDocIds = new Set();

		for (const doc of collection) {
			const keys = extractKeys(doc);
			if (!keys) continue;

			allDocIds.add(doc.id);

			for (const key of keys) {
				if (!keyToDocIds.has(key)) keyToDocIds.set(key, new Set());
				keyToDocIds.get(key).add(doc.id);
			}
		}

		return { collection, keyToDocIds, allDocIds };
	}

	function get(scene, collection) {
		const cached = cache.get(scene);
		if (cached?.collection === collection) return cached;

		const rebuilt = build(scene, collection);
		cache.set(scene, rebuilt);
		return rebuilt;
	}

	function getAffectedDocs(scene, collection, changedKeys) {
		const normalizedChangedKeys = uniqueStringKeys(changedKeys);

		const index = get(scene, collection);

		if (!normalizedChangedKeys.length) {
			if (typeof collection?.get === "function") {
				return Array.from(index.allDocIds).map((id) => collection.get(id)).filter(Boolean);
			}
			return Array.from(collection ?? []).filter((doc) => index.allDocIds.has(doc.id));
		}

		const affectedIds = new Set();
		for (const key of normalizedChangedKeys) {
			const ids = index.keyToDocIds.get(key);
			if (!ids) continue;
			for (const id of ids) affectedIds.add(id);
		}

		if (!affectedIds.size) return [];

		if (typeof collection?.get === "function") {
			return Array.from(affectedIds).map((id) => collection.get(id)).filter(Boolean);
		}

		return Array.from(collection ?? []).filter((doc) => affectedIds.has(doc.id));
	}

	function invalidate(scene = null) {
		if (scene) {
			cache.delete(scene);
		} else {
			cache = new WeakMap();
		}
	}

	return { getAffectedDocs, invalidate };
}

/**
 * Compiled tile criteria matching with per-tile caching.
 */
import { resolveTileTargetIndex } from "./tile-targets.js";
import { normalizeTileCriteria, sanitizeCriteria } from "./tile-criteria.js";

let tileMatcherCache = new WeakMap();

function compileTileMatcher(tileCriteria, files) {
	const normalized = normalizeTileCriteria(tileCriteria, { files });
	if (!normalized) return null;

	const variants = normalized.variants
		.map((variant) => {
			const criteria = sanitizeCriteria(variant.criteria);
			const targetIndex = resolveTileTargetIndex(variant.target, files);
			if (!Number.isInteger(targetIndex) || targetIndex < 0) return null;

			return {
				criteria,
				keys: Object.keys(criteria),
				targetIndex
			};
		})
		.filter(Boolean);

	const defaultIndex = resolveTileTargetIndex(normalized.defaultTarget, files);
	if (!variants.length && (!Number.isInteger(defaultIndex) || defaultIndex < 0)) {
		return null;
	}

	return {
		variants,
		defaultIndex
	};
}

export function getCompiledTileMatcher(tile, tileCriteria, files) {
	const cached = tileMatcherCache.get(tile);
	if (cached && cached.tileCriteria === tileCriteria && cached.files === files) {
		return cached.compiled;
	}

	const compiled = compileTileMatcher(tileCriteria, files);
	tileMatcherCache.set(tile, {
		tileCriteria,
		files,
		compiled
	});
	return compiled;
}

export function selectTileFileIndexFromCompiled(compiled, state) {
	if (!compiled) return -1;

	let bestIndex = -1;
	let bestSpecificity = -1;

	for (const variant of compiled.variants) {
		const keys = variant.keys;

		let matches = true;
		for (const key of keys) {
			if (variant.criteria[key] !== state?.[key]) {
				matches = false;
				break;
			}
		}

		if (matches && keys.length > bestSpecificity) {
			bestSpecificity = keys.length;
			bestIndex = variant.targetIndex;
		}
	}

	if (bestIndex >= 0) return bestIndex;
	return compiled.defaultIndex;
}

/**
 * Select one file index for a tile based on criteria specificity.
 */
export function selectTileFileIndex(tileCriteria, state, files) {
	const compiled = compileTileMatcher(tileCriteria, files);
	return selectTileFileIndexFromCompiled(compiled, state);
}

export function invalidateTileMatcherCache(tile = null) {
	if (tile) {
		tileMatcherCache.delete(tile);
	} else {
		tileMatcherCache = new WeakMap();
	}
}

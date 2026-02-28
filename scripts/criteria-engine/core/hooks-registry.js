/**
 * Extension point registry for the criteria engine.
 *
 * Provides two registries:
 * 1. Hidden light providers — callbacks that return light IDs to force-hide
 * 2. Tile conventions — declarative config for tile type indexing (Step 5)
 */

// ── Hidden light providers ─────────────────────────────────────────────────

const hiddenLightProviders = [];

/**
 * Register a callback that returns an array of light document IDs
 * that should be forced hidden during criteria resolution.
 */
export function registerHiddenLightProvider(provider) {
	if (typeof provider !== "function") return;
	if (hiddenLightProviders.includes(provider)) return;
	hiddenLightProviders.push(provider);
}

export function unregisterHiddenLightProvider(provider) {
	const index = hiddenLightProviders.indexOf(provider);
	if (index >= 0) hiddenLightProviders.splice(index, 1);
}

/**
 * Collect hidden light IDs from all registered providers.
 */
export function getHiddenLightIds() {
	const ids = new Set();
	for (const provider of hiddenLightProviders) {
		try {
			const result = provider();
			if (Array.isArray(result)) {
				for (const id of result) {
					if (id) ids.add(id);
				}
			}
		} catch (error) {
			console.warn("eidolon-utilities | Hidden light provider error:", error);
		}
	}
	return ids;
}

// ── Tile conventions ───────────────────────────────────────────────────────

const tileConventions = new Map();
const indexingHooks = [];

/**
 * Register a tile type convention for the indexer.
 *
 * @param {object} convention
 * @param {string} convention.tag - Tagger tag name (e.g. "Map", "Weather")
 * @param {Record<number,string>} convention.positionMap - bracket position → criteria key
 * @param {Record<number,string>} [convention.positionMap4] - 4-tag variant position map
 * @param {boolean} [convention.required] - indexScene() fails if no tile has this tag
 * @param {number} [convention.maxCount] - maximum allowed tiles with this tag
 * @param {"inherit"} [convention.positionMap] - inherit from the first registered convention
 */
export function registerTileConvention(convention) {
	if (!convention?.tag) return;
	tileConventions.set(convention.tag, { ...convention });
}

export function unregisterTileConvention(tag) {
	tileConventions.delete(tag);
}

export function getTileConventions() {
	return tileConventions;
}

/**
 * Register an indexing hook for tiles that don't match any convention.
 * Called per-tile. Return { positionMap } to index, or null to skip.
 */
export function registerIndexingHook(hook) {
	if (typeof hook !== "function") return;
	if (indexingHooks.includes(hook)) return;
	indexingHooks.push(hook);
}

export function unregisterIndexingHook(hook) {
	const index = indexingHooks.indexOf(hook);
	if (index >= 0) indexingHooks.splice(index, 1);
}

export function getIndexingHooks() {
	return indexingHooks;
}

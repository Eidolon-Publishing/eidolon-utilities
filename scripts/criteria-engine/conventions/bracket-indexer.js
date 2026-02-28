/**
 * Bracket-tag indexer for MATT tiles.
 *
 * Parses `[Tag1, Tag2, Tag3]` filenames, builds fileIndex arrays and
 * criteria definitions. Reads tile type conventions from the hooks registry.
 */
import { createSceneCriterion, setSceneCriteria } from "../../scene-criteria/core/storage.js";
import {
	CURRENT_SCHEMA_VERSION,
	FLAG_TILE_CRITERIA,
	FLAG_TILE_FILE_INDEX,
	MODULE_ID,
	getSceneEngineVersion
} from "../core/constants.js";
import { markCurrentVersion } from "../core/state.js";
import { buildTileCriteriaFromFileIndex } from "../core/tile-criteria.js";
import { getTileConventions, getIndexingHooks, registerTileConvention } from "../core/hooks-registry.js";

const DEFAULT_VALUE = "Standard";

const log = (...args) => console.log(`${MODULE_ID} | criteria indexer:`, ...args);

// ── Default convention registration ────────────────────────────────────────

export function registerDefaultConventions() {
	registerTileConvention({
		tag: "Map",
		positionMap: { 0: "mood", 1: "variant", 2: "effect" },
		positionMap4: { 0: "mood", 1: "stage", 2: "variant", 3: "effect" },
		required: true,
		maxCount: 1
	});
	registerTileConvention({ tag: "Floor", positionMap: "inherit" });
	registerTileConvention({ tag: "Roof", positionMap: "inherit" });
	registerTileConvention({
		tag: "Weather",
		positionMap: { 1: "effect" }
	});
}

// ── Tag parsing ────────────────────────────────────────────────────────────

export function parseFileTags(filename) {
	if (typeof filename !== "string") return null;

	let decoded = filename;
	try {
		decoded = decodeURIComponent(filename);
	} catch (_error) {
		// Keep the original string if it's not URI-encoded.
	}

	const match = decoded.match(/\[([^\]]+)\]/);
	if (!match) return null;

	const tags = match[1]
		.split(",")
		.map((entry) => entry.trim())
		.filter(Boolean);

	return tags.length ? tags : null;
}

export function buildFileIndex(files, positionMap, defaultValue = DEFAULT_VALUE) {
	if (!files?.length) return [];

	return files.map((file) => {
		const tags = parseFileTags(file?.name);
		if (!tags) return {};

		const criteria = {};
		for (const [pos, key] of Object.entries(positionMap)) {
			const value = tags[Number(pos)];
			if (value != null && value !== defaultValue) {
				criteria[key] = value;
			}
		}
		return criteria;
	});
}

// ── Criteria definitions ───────────────────────────────────────────────────

function buildCriteriaDefinitions(criterionOrder, valuesByKey) {
	return criterionOrder.map((key, index) => {
		const values = [...(valuesByKey[key] ?? new Set())].sort();
		const hasStandard = values.includes(DEFAULT_VALUE);
		const fallbackDefault = hasStandard ? DEFAULT_VALUE : values[0] ?? DEFAULT_VALUE;

		const criterion = createSceneCriterion(key);
		criterion.key = key;
		criterion.label = key.charAt(0).toUpperCase() + key.slice(1);
		criterion.values = values.length ? values : [DEFAULT_VALUE];
		criterion.default = criterion.values.includes(fallbackDefault)
			? fallbackDefault
			: criterion.values[0];
		criterion.order = index;
		return criterion;
	});
}

// ── Per-tile indexing ──────────────────────────────────────────────────────

async function indexTile(tile, positionMap, valuesByKey, { dryRun = false } = {}) {
	const files = tile.getFlag("monks-active-tiles", "files");
	if (!files?.length) return null;

	const fileIndex = buildFileIndex(files, positionMap);
	const tileCriteria = buildTileCriteriaFromFileIndex(fileIndex, { files });

	for (const file of files) {
		const tags = parseFileTags(file?.name);
		if (!tags) continue;
		for (const [pos, key] of Object.entries(positionMap)) {
			const value = tags[Number(pos)];
			if (value != null && valuesByKey[key]) {
				valuesByKey[key].add(value);
			}
		}
	}

	if (!dryRun) {
		await tile.setFlag(MODULE_ID, FLAG_TILE_CRITERIA, tileCriteria);
		if (typeof tile.unsetFlag === "function") {
			await tile.unsetFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
		}
	}

	return { files: files.length };
}

// ── Position map resolution ────────────────────────────────────────────────

function resolvePositionMap(convention, tagCount, primaryMap) {
	if (convention.positionMap === "inherit") {
		return primaryMap;
	}
	if (tagCount >= 4 && convention.positionMap4) {
		return convention.positionMap4;
	}
	return convention.positionMap;
}

function resolvePrimaryPositionMap(convention, tagCount) {
	if (tagCount >= 4 && convention.positionMap4) {
		return convention.positionMap4;
	}
	return convention.positionMap;
}

// ── Convention resolution ───────────────────────────────────────────────────

/**
 * Build a conventions Map from either an inline array or the global registry.
 *
 * - `undefined` / `null` → use global registry (getTileConventions())
 * - `[{ tag, positionMap, ... }, ...]` → build a one-off Map from the array
 */
function resolveConventions(inline) {
	if (!Array.isArray(inline)) return getTileConventions();

	const map = new Map();
	for (const convention of inline) {
		if (!convention?.tag) continue;
		map.set(convention.tag, { ...convention });
	}
	return map;
}

// ── Scene indexer ──────────────────────────────────────────────────────────

/**
 * Index bracket-tagged MATT tiles into per-tile `tileCriteria` selectors.
 *
 * Reads tile type conventions from the hooks registry by default.
 * Pass `options.conventions` (array) to override with one-off conventions
 * without touching the global registry.
 *
 * Falls back to indexing hooks for tiles that don't match any convention.
 */
export async function indexScene(scene, options = {}) {
	const {
		dryRun = false,
		force = false
	} = options;

	scene = scene ?? game.scenes?.viewed;
	if (!scene) throw new Error("No scene provided to indexScene.");
	if (!globalThis.Tagger) throw new Error("Tagger is required to index scene criteria.");

	if (!force && getSceneEngineVersion(scene) >= CURRENT_SCHEMA_VERSION) {
		throw new Error(
			`Scene "${scene.name}" is already criteria-indexed. Use force: true to re-index.`
		);
	}

	// Use inline conventions if provided, otherwise read from the registry
	const conventions = resolveConventions(options.conventions);
	const taggerOpts = { sceneId: scene.id };

	// Find the primary convention (required + maxCount=1) to determine tag count
	let primaryConvention = null;
	let primaryTile = null;
	let tagCount = 3;

	for (const [tag, convention] of conventions) {
		if (!convention.required) continue;

		const tiles = Tagger.getByTag(tag, taggerOpts) ?? [];
		if (!tiles.length) throw new Error(`No ${tag} tile found.`);
		if (convention.maxCount && tiles.length > convention.maxCount) {
			throw new Error(`Expected ${convention.maxCount} ${tag} tile(s), found ${tiles.length}.`);
		}

		primaryConvention = convention;
		primaryTile = tiles[0];

		const files = primaryTile.getFlag("monks-active-tiles", "files");
		if (!files?.length) throw new Error(`${tag} tile has no MATT files.`);

		const sampleTags = parseFileTags(files[0]?.name);
		if (!sampleTags?.length) {
			throw new Error(`Cannot parse bracket tags from: ${files[0]?.name ?? "<unknown>"}`);
		}
		if (sampleTags.length < 3) {
			throw new Error(`Expected 3+ bracket tags, found ${sampleTags.length}.`);
		}
		tagCount = sampleTags.length;
		break;
	}

	if (!primaryConvention) {
		throw new Error("No required tile convention registered. Register conventions before indexing.");
	}

	const primaryMap = resolvePrimaryPositionMap(primaryConvention, tagCount);

	// Build criterion order from the primary position map
	const criterionOrder = [];
	const sortedPositions = Object.keys(primaryMap).map(Number).sort((a, b) => a - b);
	for (const pos of sortedPositions) {
		const key = primaryMap[pos];
		if (!criterionOrder.includes(key)) criterionOrder.push(key);
	}

	const valuesByKey = {};
	for (const key of criterionOrder) {
		valuesByKey[key] = new Set();
	}

	// Ensure weather effect key is tracked even if not in primary map
	for (const [, convention] of conventions) {
		if (convention.positionMap === "inherit") continue;
		const posMap = resolvePositionMap(convention, tagCount, primaryMap);
		for (const key of Object.values(posMap)) {
			if (!valuesByKey[key]) {
				valuesByKey[key] = new Set();
				if (!criterionOrder.includes(key)) criterionOrder.push(key);
			}
		}
	}

	const tileSummary = {};
	const indexingHooks = getIndexingHooks();

	for (const [tag, convention] of conventions) {
		const tiles = Tagger.getByTag(tag, taggerOpts) ?? [];
		const posMap = resolvePositionMap(convention, tagCount, primaryMap);
		const summaryKey = tag.toLowerCase();
		const results = [];

		for (const tile of tiles) {
			const result = await indexTile(tile, posMap, valuesByKey, { dryRun });
			if (result) results.push(result);
		}

		tileSummary[summaryKey] = convention.maxCount === 1 ? (results[0] ?? null) : results;
	}

	// Run indexing hooks for any tiles not covered by conventions
	if (indexingHooks.length > 0) {
		const allTiles = scene.getEmbeddedCollection("Tile") ?? [];
		const conventionTags = new Set(conventions.keys());

		for (const tile of allTiles) {
			const tileTags = globalThis.Tagger?.getTags?.(tile) ?? [];
			const matchesConvention = tileTags.some((t) => conventionTags.has(t));
			if (matchesConvention) continue;

			const files = tile.getFlag("monks-active-tiles", "files");
			if (!files?.length) continue;

			for (const hook of indexingHooks) {
				try {
					const hookResult = hook(scene, tile, files);
					if (hookResult?.positionMap) {
						await indexTile(tile, hookResult.positionMap, valuesByKey, { dryRun });
						break;
					}
				} catch (error) {
					console.warn(`${MODULE_ID} | Indexing hook error:`, error);
				}
			}
		}
	}

	const criteria = buildCriteriaDefinitions(criterionOrder, valuesByKey);

	if (!dryRun) {
		await setSceneCriteria(scene, criteria);
		await markCurrentVersion(scene);
	}

	const primarySummaryKey = primaryConvention.tag.toLowerCase();
	log(
		dryRun ? "Dry run complete" : "Indexing complete",
		`- ${criteria.length} criteria,`,
		`${tileSummary[primarySummaryKey]?.files ?? 0} ${primaryConvention.tag.toLowerCase()} files`
	);

	// Detect overlay mode: any convention tag beyond the primary that has tiles
	const hasOverlayTiles = Array.from(conventions.keys())
		.filter((tag) => tag !== primaryConvention.tag)
		.some((tag) => {
			const summary = tileSummary[tag.toLowerCase()];
			return Array.isArray(summary) ? summary.length > 0 : Boolean(summary);
		});

	return {
		criteria,
		state: criteria.reduce((acc, criterion) => {
			acc[criterion.key] = criterion.default;
			return acc;
		}, {}),
		tiles: tileSummary,
		overlayMode: hasOverlayTiles
	};
}

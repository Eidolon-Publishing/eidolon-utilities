import { createSceneCriterion, setSceneCriteria } from "../../scene-criteria/core/storage.js";
import {
  CURRENT_SCHEMA_VERSION,
  FLAG_TILE_CRITERIA,
  FLAG_TILE_FILE_INDEX,
  MODULE_ID,
  getSceneEngineVersion
} from "./constants.js";
import { markCurrentVersion } from "./state.js";
import { buildTileCriteriaFromFileIndex } from "./tiles.js";

const DEFAULT_VALUE = "Standard";

const log = (...args) => console.log(`${MODULE_ID} | criteria indexer:`, ...args);

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

/**
 * Index bracket-tagged MATT tiles into per-tile `tileCriteria` selectors.
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

  const taggerOpts = { sceneId: scene.id };
  const mapTiles = Tagger.getByTag("Map", taggerOpts) ?? [];
  if (!mapTiles.length) throw new Error("No Map tile found.");
  if (mapTiles.length > 1) throw new Error(`Expected 1 Map tile, found ${mapTiles.length}.`);

  const mapTile = mapTiles[0];
  const mapFiles = mapTile.getFlag("monks-active-tiles", "files");
  if (!mapFiles?.length) throw new Error("Map tile has no MATT files.");

  const sampleTags = parseFileTags(mapFiles[0]?.name);
  if (!sampleTags?.length) {
    throw new Error(`Cannot parse bracket tags from: ${mapFiles[0]?.name ?? "<unknown>"}`);
  }
  if (sampleTags.length < 3) {
    throw new Error(`Expected 3+ bracket tags, found ${sampleTags.length}.`);
  }

  const floorTiles = Tagger.getByTag("Floor", taggerOpts) ?? [];
  const roofTiles = Tagger.getByTag("Roof", taggerOpts) ?? [];
  const weatherTiles = Tagger.getByTag("Weather", taggerOpts) ?? [];

  let mapPositionMap;
  const criterionOrder = [];

  if (sampleTags.length >= 4) {
    mapPositionMap = { 0: "mood", 1: "stage", 2: "variant", 3: "effect" };
    criterionOrder.push("mood", "stage", "variant", "effect");
  } else {
    mapPositionMap = { 0: "mood", 1: "variant", 2: "effect" };
    criterionOrder.push("mood", "variant", "effect");
  }

  const weatherPositionMap = { 1: "effect" };

  const valuesByKey = {};
  for (const key of criterionOrder) {
    valuesByKey[key] = new Set();
  }

  const tileSummary = {
    map: null,
    floor: [],
    roof: [],
    weather: []
  };

  tileSummary.map = await indexTile(mapTile, mapPositionMap, valuesByKey, { dryRun });
  for (const tile of floorTiles) {
    const result = await indexTile(tile, mapPositionMap, valuesByKey, { dryRun });
    if (result) tileSummary.floor.push(result);
  }
  for (const tile of roofTiles) {
    const result = await indexTile(tile, mapPositionMap, valuesByKey, { dryRun });
    if (result) tileSummary.roof.push(result);
  }
  for (const tile of weatherTiles) {
    const result = await indexTile(tile, weatherPositionMap, valuesByKey, { dryRun });
    if (result) tileSummary.weather.push(result);
  }

  const criteria = buildCriteriaDefinitions(criterionOrder, valuesByKey);

  if (!dryRun) {
    await setSceneCriteria(scene, criteria);
    await markCurrentVersion(scene);
  }

  log(
    dryRun ? "Dry run complete" : "Indexing complete",
    `- ${criteria.length} criteria,`,
    `${tileSummary.map?.files ?? 0} map files`
  );

  return {
    criteria,
    state: criteria.reduce((acc, criterion) => {
      acc[criterion.key] = criterion.default;
      return acc;
    }, {}),
    tiles: tileSummary,
    overlayMode: weatherTiles.length > 0
  };
}

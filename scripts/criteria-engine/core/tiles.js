import { FLAG_TILE_CRITERIA, FLAG_TILE_FILE_INDEX, MODULE_ID } from "./constants.js";

const log = (...args) => console.log(`${MODULE_ID} | criteria tiles:`, ...args);
let tileMatcherCache = new WeakMap();
let tileDependencyCache = new WeakMap();
const DEFAULT_UPDATE_CHUNK_SIZE = 200;

function getCollectionSize(collection) {
  if (!collection) return 0;
  if (Number.isInteger(collection.size)) return collection.size;
  if (Array.isArray(collection)) return collection.length;
  if (typeof collection.length === "number") return collection.length;
  return Array.from(collection).length;
}

function nowMs() {
  if (typeof performance?.now === "function") return performance.now();
  return Date.now();
}

function uniqueStringKeys(keys) {
  if (!Array.isArray(keys)) return [];

  const unique = new Set();
  for (const key of keys) {
    if (typeof key !== "string") continue;
    const normalized = key.trim();
    if (!normalized) continue;
    unique.add(normalized);
  }

  return Array.from(unique);
}

function chunkArray(values, chunkSize = DEFAULT_UPDATE_CHUNK_SIZE) {
  if (!Array.isArray(values) || values.length === 0) return [];
  const size = Number.isInteger(chunkSize) && chunkSize > 0 ? chunkSize : DEFAULT_UPDATE_CHUNK_SIZE;

  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

async function updateTilesInChunks(scene, updates, chunkSize) {
  const chunks = chunkArray(updates, chunkSize);
  for (const chunk of chunks) {
    await scene.updateEmbeddedDocuments("Tile", chunk);
    if (chunks.length > 1) {
      await Promise.resolve();
    }
  }

  return chunks.length;
}

function getTileCriteriaDependencyKeys(tileCriteria) {
  const normalized = normalizeTileCriteria(tileCriteria, { files: null });
  if (!normalized?.variants?.length) return [];

  const keys = new Set();
  for (const variant of normalized.variants) {
    for (const key of Object.keys(variant.criteria ?? {})) {
      if (key) keys.add(key);
    }
  }

  return Array.from(keys);
}

function buildTileDependencyIndex(scene, collection) {
  const keyToTileIds = new Map();
  const allTileIds = new Set();

  for (const tile of collection) {
    const tileCriteria = tile.getFlag(MODULE_ID, FLAG_TILE_CRITERIA)
      ?? tile.getFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
    if (!tileCriteria) continue;

    allTileIds.add(tile.id);

    for (const key of getTileCriteriaDependencyKeys(tileCriteria)) {
      if (!keyToTileIds.has(key)) keyToTileIds.set(key, new Set());
      keyToTileIds.get(key).add(tile.id);
    }
  }

  return {
    collection,
    keyToTileIds,
    allTileIds
  };
}

function getTileDependencyIndex(scene, collection) {
  const cached = tileDependencyCache.get(scene);
  if (cached?.collection === collection) return cached;

  const rebuilt = buildTileDependencyIndex(scene, collection);
  tileDependencyCache.set(scene, rebuilt);
  return rebuilt;
}

function getTilesForChangedKeys(scene, collection, changedKeys) {
  const normalizedChangedKeys = uniqueStringKeys(changedKeys);
  if (!normalizedChangedKeys.length) {
    return Array.from(collection ?? []);
  }

  const index = getTileDependencyIndex(scene, collection);
  const affectedIds = new Set();
  for (const key of normalizedChangedKeys) {
    const matches = index.keyToTileIds.get(key);
    if (!matches) continue;
    for (const tileId of matches) {
      affectedIds.add(tileId);
    }
  }

  if (!affectedIds.size) return [];

  if (typeof collection?.get === "function") {
    return Array.from(affectedIds)
      .map((tileId) => collection.get(tileId))
      .filter(Boolean);
  }

  return Array.from(collection ?? []).filter((tile) => affectedIds.has(tile.id));
}

function getFilePath(file) {
  if (typeof file?.name === "string") return file.name;
  if (typeof file?.src === "string") return file.src;
  return "";
}

export function normalizeFilePath(path) {
  if (typeof path !== "string") return "";

  const trimmed = path.trim();
  if (!trimmed) return "";

  const slashNormalized = trimmed.replace(/\\/g, "/");
  try {
    return decodeURIComponent(slashNormalized);
  } catch (_error) {
    return slashNormalized;
  }
}

export function buildTileFileEntries(files) {
  if (!Array.isArray(files)) return [];

  const counts = new Map();
  return files.map((file, index) => {
    const path = normalizeFilePath(getFilePath(file));
    const key = path || `__index:${index}`;
    const occurrence = counts.get(key) ?? 0;
    counts.set(key, occurrence + 1);

    const target = {
      indexHint: index
    };

    if (path) {
      target.path = path;
      target.occurrence = occurrence;
    }

    return {
      index,
      path,
      occurrence,
      target,
      label: path.split("/").pop() || `File ${index + 1}`
    };
  });
}

export function createTileTargetFromIndex(files, index) {
  if (!Number.isInteger(index) || index < 0) return null;

  const entries = buildTileFileEntries(files);
  const entry = entries.find((candidate) => candidate.index === index);
  if (!entry) return { indexHint: index };
  return { ...entry.target };
}

export function normalizeTileTarget(target) {
  if (!target || typeof target !== "object") return null;

  const normalizedPath = normalizeFilePath(target.path);
  const normalizedIndex = Number(target.indexHint ?? target.fileIndex);
  const normalizedOccurrence = Number(target.occurrence);

  const normalized = {};

  if (normalizedPath) {
    normalized.path = normalizedPath;
    normalized.occurrence = Number.isInteger(normalizedOccurrence) && normalizedOccurrence >= 0
      ? normalizedOccurrence
      : 0;
  }

  if (Number.isInteger(normalizedIndex) && normalizedIndex >= 0) {
    normalized.indexHint = normalizedIndex;
  }

  if (!normalized.path && !Number.isInteger(normalized.indexHint)) return null;
  return normalized;
}

export function resolveTileTargetIndex(target, files) {
  const normalizedTarget = normalizeTileTarget(target);
  if (!normalizedTarget) return -1;

  const entries = buildTileFileEntries(files);
  if (!entries.length) return -1;

  if (normalizedTarget.path) {
    const matches = entries.filter((entry) => entry.path === normalizedTarget.path);
    if (matches.length > 0) {
      const occurrence = Number.isInteger(normalizedTarget.occurrence)
        ? normalizedTarget.occurrence
        : 0;

      if (matches[occurrence]) return matches[occurrence].index;

      if (Number.isInteger(normalizedTarget.indexHint)) {
        const hinted = matches.find((entry) => entry.index === normalizedTarget.indexHint);
        if (hinted) return hinted.index;
      }

      return matches[0].index;
    }
  }

  if (Number.isInteger(normalizedTarget.indexHint) && normalizedTarget.indexHint < entries.length) {
    return normalizedTarget.indexHint;
  }

  return -1;
}

function sanitizeCriteria(criteria) {
  if (!criteria || typeof criteria !== "object" || Array.isArray(criteria)) return {};

  const result = {};
  for (const [key, value] of Object.entries(criteria)) {
    if (typeof key !== "string" || !key) continue;
    if (typeof value !== "string" || !value.trim()) continue;
    result[key] = value.trim();
  }
  return result;
}

function serializeCriteria(criteria) {
  const entries = Object.entries(sanitizeCriteria(criteria)).sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey));
  return entries.map(([key, value]) => `${key}=${value}`).join("\u001f");
}

function getCriteriaSpecificity(criteria) {
  return Object.keys(sanitizeCriteria(criteria)).length;
}

function areCriteriaCompatible(leftCriteria, rightCriteria) {
  const left = sanitizeCriteria(leftCriteria);
  const right = sanitizeCriteria(rightCriteria);

  for (const [key, leftValue] of Object.entries(left)) {
    if (!(key in right)) continue;
    if (right[key] !== leftValue) return false;
  }

  return true;
}

function getTargetIdentity(target, files) {
  const resolvedIndex = resolveTileTargetIndex(target, files);
  if (Number.isInteger(resolvedIndex) && resolvedIndex >= 0) {
    return `index:${resolvedIndex}`;
  }

  const normalized = normalizeTileTarget(target);
  if (!normalized) return "";

  if (normalized.path) {
    const occurrence = Number.isInteger(normalized.occurrence) ? normalized.occurrence : 0;
    return `path:${normalized.path}#${occurrence}`;
  }

  if (Number.isInteger(normalized.indexHint)) {
    return `hint:${normalized.indexHint}`;
  }

  return "";
}

export function detectTileCriteriaConflicts(tileCriteria, options = {}) {
  const files = Array.isArray(options.files) ? options.files : [];
  const normalized = normalizeTileCriteria(tileCriteria, { files });
  if (!normalized?.variants?.length) {
    return {
      errors: [],
      warnings: []
    };
  }

  const prepared = normalized.variants.map((variant, index) => ({
    index,
    criteria: sanitizeCriteria(variant.criteria),
    specificity: getCriteriaSpecificity(variant.criteria),
    criteriaSignature: serializeCriteria(variant.criteria),
    targetIdentity: getTargetIdentity(variant.target, files)
  }));

  const errors = [];
  const warnings = [];

  for (let leftIndex = 0; leftIndex < prepared.length; leftIndex += 1) {
    const left = prepared[leftIndex];

    for (let rightIndex = leftIndex + 1; rightIndex < prepared.length; rightIndex += 1) {
      const right = prepared[rightIndex];
      if (left.specificity !== right.specificity) continue;
      if (!areCriteriaCompatible(left.criteria, right.criteria)) continue;

      const sameTarget = Boolean(left.targetIdentity) && left.targetIdentity === right.targetIdentity;
      if (!sameTarget) {
        errors.push({
          leftIndex: left.index,
          rightIndex: right.index,
          type: left.criteriaSignature === right.criteriaSignature ? "equivalent" : "overlap",
          specificity: left.specificity
        });
        continue;
      }

      if (left.criteriaSignature === right.criteriaSignature) {
        warnings.push({
          leftIndex: left.index,
          rightIndex: right.index,
          type: "duplicate"
        });
      }
    }
  }

  return {
    errors,
    warnings
  };
}

function normalizeTileVariant(entry, files) {
  if (!entry || typeof entry !== "object") return null;

  let target = normalizeTileTarget(entry.target);
  if (!target) {
    const fileIndex = Number(entry.fileIndex);
    if (Number.isInteger(fileIndex) && fileIndex >= 0) {
      target = createTileTargetFromIndex(files, fileIndex);
    }
  }

  if (!target) return null;

  return {
    criteria: sanitizeCriteria(entry.criteria),
    target
  };
}

/**
 * Convert a legacy `fileIndex` array into select-one tile criteria.
 */
export function buildTileCriteriaFromFileIndex(fileIndex, options = {}) {
  if (!Array.isArray(fileIndex) || fileIndex.length === 0) return null;

  const files = Array.isArray(options.files) ? options.files : null;

  const variants = fileIndex
    .map((criteria, index) => ({
      criteria: sanitizeCriteria(criteria),
      target: createTileTargetFromIndex(files, index)
    }))
    .filter((entry) => entry.target);

  if (!variants.length) return null;

  const universal = variants.find((entry) => Object.keys(entry.criteria).length === 0);
  const fallbackDefault = universal?.target ?? variants[0].target;

  let defaultTarget = null;
  const defaultFileIndex = Number(options.defaultFileIndex);
  if (Number.isInteger(defaultFileIndex) && defaultFileIndex >= 0) {
    defaultTarget = createTileTargetFromIndex(files, defaultFileIndex);
  }

  if (!defaultTarget) defaultTarget = fallbackDefault;

  return {
    strategy: "select-one",
    variants,
    defaultTarget
  };
}

/**
 * Normalize tile criteria definitions.
 *
 * Supports:
 * - New schema: `{ strategy, variants[{criteria,target}], defaultTarget }`
 * - Legacy schema: `fileIndex` criteria array and `defaultFileIndex`
 */
export function normalizeTileCriteria(tileCriteria, options = {}) {
  const files = Array.isArray(options.files) ? options.files : null;

  if (Array.isArray(tileCriteria)) {
    return buildTileCriteriaFromFileIndex(tileCriteria, { files });
  }

  if (!tileCriteria || typeof tileCriteria !== "object") return null;

  const variants = Array.isArray(tileCriteria.variants)
    ? tileCriteria.variants.map((entry) => normalizeTileVariant(entry, files)).filter(Boolean)
    : [];

  if (!variants.length) return null;

  let defaultTarget = normalizeTileTarget(tileCriteria.defaultTarget);

  if (!defaultTarget) {
    const defaultFileIndex = Number(tileCriteria.defaultFileIndex);
    if (Number.isInteger(defaultFileIndex) && defaultFileIndex >= 0) {
      defaultTarget = createTileTargetFromIndex(files, defaultFileIndex);
    }
  }

  if (!defaultTarget) {
    const universal = variants.find((entry) => Object.keys(entry.criteria).length === 0);
    defaultTarget = universal?.target ?? variants[0].target;
  }

  return {
    strategy: "select-one",
    variants,
    defaultTarget
  };
}

/**
 * Select one file index for a tile based on criteria specificity.
 */
export function selectTileFileIndex(tileCriteria, state, files) {
  const compiled = compileTileMatcher(tileCriteria, files);
  return selectTileFileIndexFromCompiled(compiled, state);
}

function selectTileFileIndexFromCompiled(compiled, state) {
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

function getCompiledTileMatcher(tile, tileCriteria, files) {
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

export function invalidateTileCriteriaCaches(scene = null, tile = null) {
  if (scene) {
    tileDependencyCache.delete(scene);
  } else {
    tileDependencyCache = new WeakMap();
  }

  if (tile) {
    tileMatcherCache.delete(tile);
  } else if (!scene) {
    tileMatcherCache = new WeakMap();
  }
}

/**
 * Apply criteria-driven file selection to all tiles carrying tile criteria flags.
 */
export async function updateTiles(state, scene, options = {}) {
  const start = nowMs();
  const metrics = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    skipped: {
      unaffected: 0,
      noCriteria: 0,
      noFiles: 0,
      noMatch: 0,
      unchanged: 0
    },
    durationMs: 0
  };

  scene = scene ?? game.scenes?.viewed;
  if (!scene) {
    metrics.durationMs = nowMs() - start;
    return metrics;
  }

  const collection = scene.getEmbeddedCollection("Tile") ?? [];
  metrics.total = getCollectionSize(collection);

  const tiles = getTilesForChangedKeys(scene, collection, options.changedKeys);
  metrics.scanned = tiles.length;
  if (!tiles.length) {
    metrics.skipped.unaffected = metrics.total;
    metrics.durationMs = nowMs() - start;
    return metrics;
  }

  const tileUpdates = [];

  for (const tile of tiles) {
    const tileCriteria = tile.getFlag(MODULE_ID, FLAG_TILE_CRITERIA)
      ?? tile.getFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
    if (!tileCriteria) {
      metrics.skipped.noCriteria += 1;
      continue;
    }

    const files = tile.getFlag("monks-active-tiles", "files");
    if (!files?.length) {
      metrics.skipped.noFiles += 1;
      continue;
    }

    const compiled = getCompiledTileMatcher(tile, tileCriteria, files);
    const matchIndex = selectTileFileIndexFromCompiled(compiled, state);
    if (!Number.isInteger(matchIndex) || matchIndex < 0 || matchIndex >= files.length) {
      console.warn(`${MODULE_ID} | Tile ${tile.id} has no valid file match for state`, state);
      metrics.skipped.noMatch += 1;
      continue;
    }

    const nextFileIndex = matchIndex + 1;
    const currentFileIndex = Number(tile.getFlag("monks-active-tiles", "fileindex"));
    const shouldUpdateFileIndex = currentFileIndex !== nextFileIndex;

    const shouldUpdateSelection = files.some((file, index) => Boolean(file?.selected) !== (index === matchIndex));

    const currentTextureSrc = normalizeFilePath(tile.texture?.src ?? tile._source?.texture?.src ?? "");
    const nextTextureSrcRaw = getFilePath(files[matchIndex]);
    const nextTextureSrc = normalizeFilePath(nextTextureSrcRaw);
    const shouldUpdateTexture = Boolean(nextTextureSrc) && nextTextureSrc !== currentTextureSrc;

    if (!shouldUpdateSelection && !shouldUpdateFileIndex && !shouldUpdateTexture) {
      metrics.skipped.unchanged += 1;
      continue;
    }

    const update = {
      _id: tile._id
    };

    if (shouldUpdateSelection) {
      update["flags.monks-active-tiles.files"] = files.map((file, index) => ({
        ...file,
        selected: index === matchIndex
      }));
    }

    if (shouldUpdateFileIndex) {
      update["flags.monks-active-tiles.fileindex"] = nextFileIndex;
    }

    if (shouldUpdateTexture) {
      update.texture = { src: nextTextureSrcRaw };
    }

    tileUpdates.push(update);

    log(`Tile ${tile.id} -> ${nextTextureSrcRaw}`);
  }

  if (tileUpdates.length > 0) {
    metrics.chunks = await updateTilesInChunks(scene, tileUpdates, options.chunkSize);
    metrics.updated = tileUpdates.length;
  }

  metrics.durationMs = nowMs() - start;
  return metrics;
}

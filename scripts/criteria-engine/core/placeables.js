import { MODULE_ID } from "./constants.js";
import { resolveRules } from "./resolver.js";
import { buildLightControlsMap } from "./light-controls.js";
import { convertLightCriteriaStateToPresets } from "../../light-criteria/core/storage.js";

const PLACEABLE_TYPES = ["AmbientLight", "Wall", "AmbientSound"];
let presetCache = new WeakMap();
let dependencyCache = new WeakMap();
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

async function updatePlaceablesInChunks(scene, type, updates, chunkSize) {
  const chunks = chunkArray(updates, chunkSize);
  for (const chunk of chunks) {
    await scene.updateEmbeddedDocuments(type, chunk);
    if (chunks.length > 1) {
      await Promise.resolve();
    }
  }

  return chunks.length;
}

function getPresetDependencyKeys(presets) {
  const keys = new Set();
  for (const rule of presets?.rules ?? []) {
    for (const key of Object.keys(rule?.criteria ?? {})) {
      if (key) keys.add(key);
    }
  }
  return Array.from(keys);
}

function buildPlaceableDependencyIndex(scene, collectionsByType) {
  const byType = new Map();

  for (const type of PLACEABLE_TYPES) {
    const collection = collectionsByType.get(type) ?? [];
    const allDocIds = new Set();
    const keyToDocIds = new Map();

    for (const doc of collection) {
      const presets = getPresetsForDocument(doc, type);
      if (!presets?.base) continue;

      allDocIds.add(doc.id);

      for (const key of getPresetDependencyKeys(presets)) {
        if (!keyToDocIds.has(key)) keyToDocIds.set(key, new Set());
        keyToDocIds.get(key).add(doc.id);
      }
    }

    byType.set(type, {
      allDocIds,
      keyToDocIds
    });
  }

  return {
    collectionsByType,
    byType
  };
}

function getPlaceableDependencyIndex(scene, collectionsByType) {
  const cached = dependencyCache.get(scene);
  if (cached && PLACEABLE_TYPES.every((type) => cached.collectionsByType.get(type) === collectionsByType.get(type))) {
    return cached;
  }

  const rebuilt = buildPlaceableDependencyIndex(scene, collectionsByType);
  dependencyCache.set(scene, rebuilt);
  return rebuilt;
}

function getDocsForChangedKeys(collection, indexEntry, changedKeys) {
  if (!indexEntry || !collection) return [];

  const normalizedChangedKeys = uniqueStringKeys(changedKeys);
  if (!normalizedChangedKeys.length) {
    if (typeof collection.get === "function") {
      return Array.from(indexEntry.allDocIds).map((id) => collection.get(id)).filter(Boolean);
    }
    return Array.from(collection).filter((doc) => indexEntry.allDocIds.has(doc.id));
  }

  const affectedIds = new Set();
  for (const key of normalizedChangedKeys) {
    const ids = indexEntry.keyToDocIds.get(key);
    if (!ids) continue;
    for (const id of ids) affectedIds.add(id);
  }

  if (!affectedIds.size) return [];

  if (typeof collection.get === "function") {
    return Array.from(affectedIds).map((id) => collection.get(id)).filter(Boolean);
  }

  return Array.from(collection).filter((doc) => affectedIds.has(doc.id));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function areValuesEqual(left, right) {
  if (Object.is(left, right)) return true;

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    for (let index = 0; index < left.length; index += 1) {
      if (!areValuesEqual(left[index], right[index])) return false;
    }
    return true;
  }

  if (isPlainObject(left) || isPlainObject(right)) {
    if (!isPlainObject(left) || !isPlainObject(right)) return false;

    const rightKeys = Object.keys(right);

    for (const key of rightKeys) {
      if (!areValuesEqual(left[key], right[key])) return false;
    }
    return true;
  }

  return false;
}

function buildChangedPayload(currentSource, resolved) {
  const update = { _id: resolved._id };

  for (const [key, value] of Object.entries(resolved)) {
    if (key === "_id") continue;

    const currentValue = currentSource?.[key];
    if (isPlainObject(value) && isPlainObject(currentValue)) {
      const nested = buildChangedPayload(currentValue, { _id: resolved._id, ...value });
      if (!nested) continue;

      const nestedKeys = Object.keys(nested).filter((nestedKey) => nestedKey !== "_id");
      if (nestedKeys.length > 0) {
        update[key] = {};
        for (const nestedKey of nestedKeys) {
          update[key][nestedKey] = nested[nestedKey];
        }
      }
      continue;
    }

    if (!areValuesEqual(currentValue, value)) {
      update[key] = value;
    }
  }

  const changedKeys = Object.keys(update).filter((key) => key !== "_id");
  return changedKeys.length > 0 ? update : null;
}

function getPresetsForDocument(doc, type) {
  const flags = doc?.flags?.[MODULE_ID] ?? {};
  const rawPresets = flags?.presets ?? null;
  const rawLightCriteria = type === "AmbientLight" ? (flags?.lightCriteria ?? null) : null;

  const cached = presetCache.get(doc);
  if (cached && cached.type === type && cached.rawPresets === rawPresets && cached.rawLightCriteria === rawLightCriteria) {
    return cached.presets;
  }

  let presets = null;

  if (flags?.presets) {
    const base = flags.presets.base ?? null;
    const rules = Array.isArray(flags.presets.rules) ? flags.presets.rules : [];
    const hasBase = base && Object.keys(base).length > 0;
    if (hasBase || rules.length > 0) {
      presets = {
        base: base ?? {},
        rules
      };
    }
  }

  if (!presets && type === "AmbientLight" && flags?.lightCriteria) {
    const converted = convertLightCriteriaStateToPresets(flags.lightCriteria);
    const hasBase = converted.base && Object.keys(converted.base).length > 0;
    if (hasBase || converted.rules.length > 0) {
      // Reuse the transformed payload while light criteria references remain unchanged.
      // This avoids re-converting the same mapping set on every criteria switch.
      presets = {
        base: converted.base,
        rules: converted.rules
      };
    }
  }

  presetCache.set(doc, {
    type,
    rawPresets,
    rawLightCriteria,
    presets
  });

  return presets;
}

export function invalidatePlaceableCriteriaCaches(scene = null, doc = null) {
  if (scene) {
    dependencyCache.delete(scene);
  } else {
    dependencyCache = new WeakMap();
  }

  if (doc) {
    presetCache.delete(doc);
  } else if (!scene) {
    presetCache = new WeakMap();
  }
}

/**
 * Resolve presets for criteria-enabled placeables.
 */
export async function updatePlaceables(state, scene, options = {}) {
  const start = nowMs();
  const metrics = {
    total: 0,
    scanned: 0,
    updated: 0,
    chunks: 0,
    byType: {},
    durationMs: 0
  };

  scene = scene ?? game.scenes?.viewed;
  if (!scene) {
    metrics.durationMs = nowMs() - start;
    return metrics;
  }

  const hiddenIds = new Set(buildLightControlsMap());
  const collectionsByType = new Map(
    PLACEABLE_TYPES.map((type) => [type, scene.getEmbeddedCollection(type) ?? []])
  );
  const dependencyIndex = getPlaceableDependencyIndex(scene, collectionsByType);

  for (const type of PLACEABLE_TYPES) {
    const collection = collectionsByType.get(type) ?? [];
    const typeMetrics = {
      total: getCollectionSize(collection),
      scanned: 0,
      updated: 0,
      chunks: 0
    };

    const indexEntry = dependencyIndex.byType.get(type) ?? null;
    const docs = getDocsForChangedKeys(collection, indexEntry, options.changedKeys);
    typeMetrics.scanned = docs.length;

    metrics.total += typeMetrics.total;
    metrics.scanned += typeMetrics.scanned;
    metrics.byType[type] = typeMetrics;

    if (!docs.length) continue;

    const updates = [];

    for (const doc of docs) {
      const presets = getPresetsForDocument(doc, type);
      if (!presets?.base) continue;

      const resolved = resolveRules(presets.base, presets.rules ?? [], state);
      resolved._id = doc._id;

      if (type === "AmbientLight" && hiddenIds.has(doc._id)) {
        resolved.hidden = true;
      }

      const source = doc?._source ?? doc?.toObject?.() ?? {};
      const changed = buildChangedPayload(source, resolved);
      if (!changed) continue;

      updates.push(changed);
    }

    if (updates.length > 0) {
      typeMetrics.chunks = await updatePlaceablesInChunks(scene, type, updates, options.chunkSize);
      typeMetrics.updated = updates.length;
      metrics.updated += updates.length;
      metrics.chunks += typeMetrics.chunks;
      console.log(`${MODULE_ID} | Updated ${updates.length} ${type}(s)`);
    }
  }

  metrics.durationMs = nowMs() - start;
  return metrics;
}

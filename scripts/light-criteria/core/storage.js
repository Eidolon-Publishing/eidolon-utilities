import { MODULE_ID, FLAG_LIGHT_CRITERIA } from "./constants.js";
import { duplicateData } from "../../time-triggers/core/utils.js";

const EMPTY_STATE = Object.freeze({
  base: null,
  mappings: [],
  current: null
});

/**
 * Read the full criteria-mapping state from a light's module flags, sanitized.
 * @param {AmbientLightDocument} light
 * @returns {{ base: object|null, mappings: object[], current: object|null }}
 */
export function getLightCriteriaState(light) {
  const raw =
    light?.getFlag?.(MODULE_ID, FLAG_LIGHT_CRITERIA) ??
    EMPTY_STATE;
  return sanitizeLightCriteriaState(raw);
}

/**
 * Replace the entire criteria-mapping state on a light's module flags.
 * Clears the flag entirely when state is empty.
 * @param {AmbientLightDocument} light
 * @param {object} state
 * @returns {Promise<object>} The sanitized state that was persisted.
 */
export async function setLightCriteriaState(light, state) {
  const sanitized = sanitizeLightCriteriaState(state);
  if (!light?.setFlag) {
    return sanitized;
  }

  const hasBase = sanitized.base !== null;
  const hasMappings = sanitized.mappings.length > 0;
  const hasCurrent = sanitized.current !== null;

  if (!hasBase && !hasMappings && !hasCurrent) {
    if (typeof light.unsetFlag === "function") {
      await light.unsetFlag(MODULE_ID, FLAG_LIGHT_CRITERIA);
    } else {
      await light.setFlag(MODULE_ID, FLAG_LIGHT_CRITERIA, null);
    }
    return EMPTY_STATE;
  }

  await light.setFlag(MODULE_ID, FLAG_LIGHT_CRITERIA, sanitized);
  return sanitized;
}

/**
 * Read-modify-write helper. Calls `updater(currentState)` and persists the result.
 * @param {AmbientLightDocument} light
 * @param {(state: object) => object|Promise<object>} updater
 * @returns {Promise<object>}
 */
export async function updateLightCriteriaState(light, updater) {
  if (typeof updater !== "function") {
    throw new TypeError("updateLightCriteriaState requires an updater function.");
  }

  const current = duplicateData(getLightCriteriaState(light));
  const updated = await updater(current);
  return setLightCriteriaState(light, updated);
}

/**
 * Save a light config as the base lighting state.
 * @param {AmbientLightDocument} light
 * @param {object} config  Light config payload (color, alpha, etc.)
 */
export async function storeBaseLighting(light, config) {
  const sanitizedConfig = sanitizeLightConfigPayload(config);
  if (!sanitizedConfig) {
    throw new Error("Invalid light configuration payload.");
  }

  return updateLightCriteriaState(light, (state) => ({
    ...state,
    base: sanitizedConfig
  }));
}

/**
 * Insert or update a criteria mapping for the given category combination.
 * Matching is by computed key (sorted category pairs), so order doesn't matter.
 * @param {AmbientLightDocument} light
 * @param {object|Array} categories  Category selections (e.g. `{ mood: "Night" }`)
 * @param {object} config            Light config payload
 * @param {object} [options]
 * @param {string} [options.label]   Optional display label
 */
export async function upsertLightCriteriaMapping(light, categories, config, { label } = {}) {
  const sanitizedCategories = sanitizeCriteriaCategories(categories);
  if (!sanitizedCategories) {
    throw new Error("Cannot create a mapping without at least one category selection.");
  }
  const sanitizedConfig = sanitizeLightConfigPayload(config);
  if (!sanitizedConfig) {
    throw new Error("Invalid light configuration payload.");
  }

  return updateLightCriteriaState(light, (state) => {
    const key = computeCriteriaMappingKey(sanitizedCategories);
    const mappings = Array.isArray(state?.mappings) ? [...state.mappings] : [];
    const existingIndex = mappings.findIndex((mapping) => mapping?.key === key);

    const existing = existingIndex >= 0 ? mappings[existingIndex] : null;
    const id =
      typeof existing?.id === "string" && existing.id.trim()
        ? existing.id.trim()
        : generateLightMappingId();

    const nextEntry = sanitizeCriteriaMappingEntry({
      id,
      key,
      categories: sanitizedCategories,
      config: sanitizedConfig,
      label: typeof label === "string" ? label : existing?.label ?? null,
      updatedAt: Date.now()
    });

    if (!nextEntry) {
      throw new Error("Failed to sanitize criteria mapping entry.");
    }

    if (existingIndex >= 0) {
      mappings[existingIndex] = nextEntry;
    } else {
      mappings.push(nextEntry);
    }

    return {
      ...state,
      mappings
    };
  });
}

/**
 * Retarget an existing mapping to a new criteria selection.
 * Optionally replaces any conflicting mapping already using the target key.
 * @param {AmbientLightDocument} light
 * @param {string} mappingId
 * @param {object|Array} categories
 * @param {object} config
 * @param {object} [options]
 * @param {boolean} [options.replaceExisting=false]
 */
export async function retargetLightCriteriaMapping(
  light,
  mappingId,
  categories,
  config,
  { replaceExisting = false } = {}
) {
  const sanitizedMappingId = typeof mappingId === "string" ? mappingId.trim() : "";
  if (!sanitizedMappingId) {
    throw new Error("A mapping id is required to retarget criteria.");
  }

  const sanitizedCategories = sanitizeCriteriaCategories(categories);
  if (!sanitizedCategories) {
    throw new Error("Cannot retarget mapping without at least one category selection.");
  }

  const sanitizedConfig = sanitizeLightConfigPayload(config);
  if (!sanitizedConfig) {
    throw new Error("Invalid light configuration payload.");
  }

  return updateLightCriteriaState(light, (state) => {
    const mappings = Array.isArray(state?.mappings) ? [...state.mappings] : [];
    const index = mappings.findIndex((mapping) => mapping?.id === sanitizedMappingId);
    if (index < 0) {
      throw new Error("The selected mapping no longer exists.");
    }

    const nextKey = computeCriteriaMappingKey(sanitizedCategories);
    const conflictIndex = mappings.findIndex(
      (mapping, idx) => idx !== index && mapping?.key === nextKey
    );

    if (conflictIndex >= 0 && !replaceExisting) {
      throw new Error("A mapping already exists for the selected criteria.");
    }

    const current = mappings[index];
    const next = sanitizeCriteriaMappingEntry({
      ...current,
      id: sanitizedMappingId,
      key: nextKey,
      categories: sanitizedCategories,
      config: sanitizedConfig,
      updatedAt: Date.now()
    });
    if (!next) {
      throw new Error("Failed to sanitize updated mapping.");
    }

    mappings[index] = next;

    let removedConflictId = null;
    if (conflictIndex >= 0) {
      const [removed] = mappings.splice(conflictIndex, 1);
      removedConflictId = removed?.id ?? null;
    }

    let currentSelection = state?.current ?? null;
    if (currentSelection && typeof currentSelection === "object") {
      if (currentSelection.mappingId === sanitizedMappingId) {
        currentSelection = {
          ...currentSelection,
          mappingId: sanitizedMappingId,
          categories: sanitizedCategories,
          updatedAt: Date.now()
        };
      } else if (removedConflictId && currentSelection.mappingId === removedConflictId) {
        currentSelection = {
          ...currentSelection,
          mappingId: sanitizedMappingId,
          categories: sanitizedCategories,
          updatedAt: Date.now()
        };
      }
    }

    return {
      ...state,
      mappings,
      current: currentSelection
    };
  });
}

/**
 * Remove a mapping by id.
 * @param {AmbientLightDocument} light
 * @param {string} mappingId
 */
export async function removeLightCriteriaMapping(light, mappingId) {
  const sanitizedMappingId = typeof mappingId === "string" ? mappingId.trim() : "";
  if (!sanitizedMappingId) {
    throw new Error("A mapping id is required to remove a mapping.");
  }

  return updateLightCriteriaState(light, (state) => {
    const mappings = Array.isArray(state?.mappings) ? [...state.mappings] : [];
    const index = mappings.findIndex((mapping) => mapping?.id === sanitizedMappingId);
    if (index < 0) return state;

    mappings.splice(index, 1);

    let current = state?.current ?? null;
    if (current?.mappingId === sanitizedMappingId) {
      current = null;
    }

    return {
      ...state,
      mappings,
      current
    };
  });
}

/**
 * Persist which mapping (by ID) and categories are currently active on a light.
 * @param {AmbientLightDocument} light
 * @param {object} selection  `{ mappingId, categories, updatedAt }`
 */
export async function storeCurrentCriteriaSelection(light, selection) {
  const sanitizedSelection = sanitizeCurrentSelection(selection);
  return updateLightCriteriaState(light, (state) => ({
    ...state,
    current: sanitizedSelection
  }));
}

/**
 * Deep-clone and normalize a raw criteria state object.
 * Deduplicates mappings by key and repairs stale `current.mappingId` references.
 * @param {object} state
 * @returns {{ base: object|null, mappings: object[], current: object|null }}
 */
export function sanitizeLightCriteriaState(state) {
  const duplicated = duplicateData(state);
  if (!duplicated || typeof duplicated !== "object") {
    return duplicateData(EMPTY_STATE);
  }

  const baseLighting = sanitizeLightConfigPayload(duplicated.base);

  const mappingEntries = Array.isArray(duplicated.mappings) ? duplicated.mappings : [];
  const deduped = new Map();
  for (const entry of mappingEntries) {
    const sanitized = sanitizeCriteriaMappingEntry(entry);
    if (!sanitized) continue;
    deduped.set(sanitized.key, sanitized);
  }

  const mappings = Array.from(deduped.values());
  const mappingById = new Map(mappings.map((mapping) => [mapping.id, mapping]));

  let current = sanitizeCurrentSelection(duplicated.current);
  if (current) {
    const hasCategories = current.categories && Object.keys(current.categories).length > 0;
    if (current.mappingId && !mappingById.has(current.mappingId)) {
      const matchedId = hasCategories
        ? mappings.find((mapping) => mapping.key === computeCriteriaMappingKey(current.categories))?.id ?? null
        : null;
      if (matchedId) {
        current = {
          ...current,
          mappingId: matchedId
        };
      } else if (!hasCategories) {
        // keep mappingId (could be base sentinel)
      } else {
        current = {
          mappingId: null,
          categories: current.categories,
          updatedAt: current.updatedAt
        };
      }
    }
  }

  return {
    base: baseLighting ?? null,
    mappings,
    current
  };
}

/**
 * Deep-clone a light config and strip internal fields (`_id`, `id`, own module flags).
 * @param {object} payload
 * @returns {object|null} Sanitized config, or null if invalid.
 */
export function sanitizeLightConfigPayload(payload) {
  const duplicated = duplicateData(payload);
  if (!duplicated || typeof duplicated !== "object") return null;

  if ("_id" in duplicated) delete duplicated._id;
  if ("id" in duplicated) delete duplicated.id;

  const flags = duplicated.flags;
  if (flags && typeof flags === "object") {
    const moduleFlags = flags[MODULE_ID];
    if (moduleFlags && typeof moduleFlags === "object") {
      delete moduleFlags[FLAG_LIGHT_CRITERIA];
      if (Object.keys(moduleFlags).length === 0) {
        delete flags[MODULE_ID];
      }
    }
    if (Object.keys(flags).length === 0) {
      delete duplicated.flags;
    }
  }

  return duplicated;
}

/**
 * Validate and normalize a single criteria mapping entry (categories + config + metadata).
 * @param {object} entry
 * @returns {object|null} Sanitized entry with `id`, `key`, `categories`, `config`, `updatedAt`, or null.
 */
export function sanitizeCriteriaMappingEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const categories = sanitizeCriteriaCategories(entry.categories);
  if (!categories) return null;

  const config = sanitizeLightConfigPayload(entry.config);
  if (!config) return null;

  const id =
    typeof entry.id === "string" && entry.id.trim()
      ? entry.id.trim()
      : generateLightMappingId();
  const key = computeCriteriaMappingKey(categories);

  const result = {
    id,
    key,
    categories,
    config,
    updatedAt: Number.isFinite(entry.updatedAt) ? Number(entry.updatedAt) : Date.now()
  };

  if (typeof entry.label === "string" && entry.label.trim()) {
    result.label = entry.label.trim();
  }

  return result;
}

function sanitizeCurrentSelection(selection) {
  if (!selection || typeof selection !== "object") return null;

  const mappingId =
    typeof selection.mappingId === "string" && selection.mappingId.trim()
      ? selection.mappingId.trim()
      : null;
  const categories = sanitizeCriteriaCategories(selection.categories);

  if (!mappingId && !categories) return null;

  return {
    mappingId,
    categories,
    updatedAt: Number.isFinite(selection.updatedAt) ? Number(selection.updatedAt) : Date.now()
  };
}

/**
 * Normalize categories from either array or object form into `{ categoryId: value }`.
 * @param {object|Array} categories
 * @returns {object|null} Normalized map, or null if no valid entries.
 */
export function sanitizeCriteriaCategories(categories) {
  const sanitized = {};
  if (Array.isArray(categories)) {
    for (const entry of categories) {
      const categoryId = normalizeCategoryId(entry?.id ?? entry?.categoryId ?? entry?.category);
      const value = normalizeCategoryValue(entry?.value ?? entry?.selection ?? entry?.label);
      if (!categoryId || !value) continue;
      sanitized[categoryId] = value;
    }
  } else if (categories && typeof categories === "object") {
    for (const [categoryIdRaw, valueRaw] of Object.entries(categories)) {
      const categoryId = normalizeCategoryId(categoryIdRaw);
      const value = normalizeCategoryValue(valueRaw);
      if (!categoryId || !value) continue;
      sanitized[categoryId] = value;
    }
  }

  return Object.keys(sanitized).length > 0 ? sanitized : null;
}

/**
 * Derive a stable lookup key from category selections (sorted, pipe-delimited).
 * @param {object} categories  `{ categoryId: value }`
 * @returns {string} e.g. `"mood:Night|weather:Fog"`
 */
export function computeCriteriaMappingKey(categories) {
  if (!categories || typeof categories !== "object") return "";
  const pieces = Object.entries(categories)
    .filter(([, value]) => typeof value === "string" && value)
    .map(([categoryId, value]) => `${categoryId}:${value}`);
  pieces.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return pieces.join("|");
}

/** Generate a random ID, preferring Foundry's `randomID` when available. */
export function generateLightMappingId() {
  if (foundry?.utils?.randomID) {
    return foundry.utils.randomID();
  }
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 10);
}

function normalizeCategoryId(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function normalizeCategoryValue(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

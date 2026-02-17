import { MODULE_ID, FLAG_LIGHT_PRESETS } from "./constants.js";
import { duplicateData } from "../../time-triggers/core/utils.js";

const EMPTY_STATE = Object.freeze({
  default: null,
  presets: [],
  current: null
});

/**
 * Read the full preset state from a light's module flags, sanitized.
 * @param {AmbientLightDocument} light
 * @returns {{ default: object|null, presets: object[], current: object|null }}
 */
export function getLightPresetState(light) {
  const raw =
    light?.getFlag?.(MODULE_ID, FLAG_LIGHT_PRESETS) ??
    EMPTY_STATE;
  return sanitizeLightPresetState(raw);
}

/**
 * Replace the entire preset state on a light's module flags.
 * Clears the flag entirely when state is empty.
 * @param {AmbientLightDocument} light
 * @param {object} state
 * @returns {Promise<object>} The sanitized state that was persisted.
 */
export async function setLightPresetState(light, state) {
  const sanitized = sanitizeLightPresetState(state);
  if (!light?.setFlag) {
    return sanitized;
  }

  const hasDefault = sanitized.default !== null;
  const hasPresets = sanitized.presets.length > 0;
  const hasCurrent = sanitized.current !== null;

  if (!hasDefault && !hasPresets && !hasCurrent) {
    if (typeof light.unsetFlag === "function") {
      await light.unsetFlag(MODULE_ID, FLAG_LIGHT_PRESETS);
    } else {
      await light.setFlag(MODULE_ID, FLAG_LIGHT_PRESETS, null);
    }
    return EMPTY_STATE;
  }

  await light.setFlag(MODULE_ID, FLAG_LIGHT_PRESETS, sanitized);
  return sanitized;
}

/**
 * Read-modify-write helper. Calls `updater(currentState)` and persists the result.
 * @param {AmbientLightDocument} light
 * @param {(state: object) => object|Promise<object>} updater
 * @returns {Promise<object>}
 */
export async function updateLightPresetState(light, updater) {
  if (typeof updater !== "function") {
    throw new TypeError("updateLightPresetState requires an updater function.");
  }

  const current = duplicateData(getLightPresetState(light));
  const updated = await updater(current);
  return setLightPresetState(light, updated);
}

/**
 * Save a light config as the default (baseline) preset.
 * @param {AmbientLightDocument} light
 * @param {object} config  Light config payload (color, alpha, etc.)
 */
export async function storeDefaultPreset(light, config) {
  const sanitizedConfig = sanitizeLightConfigPayload(config);
  if (!sanitizedConfig) {
    throw new Error("Invalid light configuration payload.");
  }

  return updateLightPresetState(light, (state) => ({
    ...state,
    default: sanitizedConfig
  }));
}

/**
 * Insert or update a preset for the given category combination.
 * Matching is by computed key (sorted category pairs), so order doesn't matter.
 * @param {AmbientLightDocument} light
 * @param {object|Array} categories  Category selections (e.g. `{ mood: "Night" }`)
 * @param {object} config            Light config payload
 * @param {object} [options]
 * @param {string} [options.label]   Optional display label
 */
export async function upsertLightPreset(light, categories, config, { label } = {}) {
  const sanitizedCategories = sanitizePresetCategories(categories);
  if (!sanitizedCategories) {
    throw new Error("Cannot create preset without at least one category selection.");
  }
  const sanitizedConfig = sanitizeLightConfigPayload(config);
  if (!sanitizedConfig) {
    throw new Error("Invalid light configuration payload.");
  }

  return updateLightPresetState(light, (state) => {
    const key = computePresetKey(sanitizedCategories);
    const presets = Array.isArray(state?.presets) ? [...state.presets] : [];
    const existingIndex = presets.findIndex((preset) => preset?.key === key);

    const existing = existingIndex >= 0 ? presets[existingIndex] : null;
    const id =
      typeof existing?.id === "string" && existing.id.trim()
        ? existing.id.trim()
        : generateLightPresetId();

    const nextEntry = sanitizePresetEntry({
      id,
      key,
      categories: sanitizedCategories,
      config: sanitizedConfig,
      label: typeof label === "string" ? label : existing?.label ?? null,
      updatedAt: Date.now()
    });

    if (!nextEntry) {
      throw new Error("Failed to sanitize preset entry.");
    }

    if (existingIndex >= 0) {
      presets[existingIndex] = nextEntry;
    } else {
      presets.push(nextEntry);
    }

    return {
      ...state,
      presets
    };
  });
}

/**
 * Persist which preset (by ID) and categories are currently active on a light.
 * @param {AmbientLightDocument} light
 * @param {object} selection  `{ presetId, categories, updatedAt }`
 */
export async function storeCurrentPresetSelection(light, selection) {
  const sanitizedSelection = sanitizeCurrentSelection(selection);
  return updateLightPresetState(light, (state) => ({
    ...state,
    current: sanitizedSelection
  }));
}

/**
 * Deep-clone and normalize a raw preset state object.
 * Deduplicates presets by key and repairs stale `current.presetId` references.
 * @param {object} state
 * @returns {{ default: object|null, presets: object[], current: object|null }}
 */
export function sanitizeLightPresetState(state) {
  const duplicated = duplicateData(state);
  if (!duplicated || typeof duplicated !== "object") {
    return duplicateData(EMPTY_STATE);
  }

  const defaultPreset = sanitizeLightConfigPayload(duplicated.default ?? duplicated.defaultPreset);

  const presetEntries = Array.isArray(duplicated.presets) ? duplicated.presets : [];
  const deduped = new Map();
  for (const entry of presetEntries) {
    const sanitized = sanitizePresetEntry(entry);
    if (!sanitized) continue;
    deduped.set(sanitized.key, sanitized);
  }

  const presets = Array.from(deduped.values());
  const presetById = new Map(presets.map((preset) => [preset.id, preset]));

  let current = sanitizeCurrentSelection(duplicated.current);
  if (current) {
    const hasCategories = current.categories && Object.keys(current.categories).length > 0;
    if (current.presetId && !presetById.has(current.presetId)) {
      const matchedId = hasCategories
        ? presets.find((preset) => preset.key === computePresetKey(current.categories))?.id ?? null
        : null;
      if (matchedId) {
        current = {
          ...current,
          presetId: matchedId
        };
      } else if (!hasCategories) {
        // keep presetId (could be default sentinel)
      } else {
        current = {
          presetId: null,
          categories: current.categories,
          updatedAt: current.updatedAt
        };
      }
    }
  }

  return {
    default: defaultPreset ?? null,
    presets,
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
      delete moduleFlags[FLAG_LIGHT_PRESETS];
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
 * Validate and normalize a single preset entry (categories + config + metadata).
 * @param {object} entry
 * @returns {object|null} Sanitized entry with `id`, `key`, `categories`, `config`, `updatedAt`, or null.
 */
export function sanitizePresetEntry(entry) {
  if (!entry || typeof entry !== "object") return null;

  const categories = sanitizePresetCategories(entry.categories);
  if (!categories) return null;

  const config = sanitizeLightConfigPayload(entry.config);
  if (!config) return null;

  const id =
    typeof entry.id === "string" && entry.id.trim()
      ? entry.id.trim()
      : generateLightPresetId();
  const key = computePresetKey(categories);

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

  const presetId =
    typeof selection.presetId === "string" && selection.presetId.trim()
      ? selection.presetId.trim()
      : null;
  const categories = sanitizePresetCategories(selection.categories);

  if (!presetId && !categories) return null;

  return {
    presetId,
    categories,
    updatedAt: Number.isFinite(selection.updatedAt) ? Number(selection.updatedAt) : Date.now()
  };
}

/**
 * Normalize categories from either array or object form into `{ categoryId: value }`.
 * @param {object|Array} categories
 * @returns {object|null} Normalized map, or null if no valid entries.
 */
export function sanitizePresetCategories(categories) {
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
 * @returns {string} e.g. `"mood:Night|variant:No Fog Wall"`
 */
export function computePresetKey(categories) {
  if (!categories || typeof categories !== "object") return "";
  const pieces = Object.entries(categories)
    .filter(([, value]) => typeof value === "string" && value)
    .map(([categoryId, value]) => `${categoryId}:${value}`);
  pieces.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  return pieces.join("|");
}

/** Generate a random ID, preferring Foundry's `randomID` when available. */
export function generateLightPresetId() {
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

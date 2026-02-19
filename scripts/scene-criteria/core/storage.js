import {
  CURRENT_SCENE_CRITERIA_VERSION,
  FLAG_SCENE_CRITERIA,
  FLAG_SCENE_CRITERIA_VERSION,
  FLAG_SCENE_STATE,
  MODULE_ID
} from "./constants.js";
import { duplicateData, localize } from "../../time-triggers/core/utils.js";

const DEFAULT_CRITERION_VALUE = "Standard";

export function getSceneCriteria(scene) {
  const stored = scene?.getFlag?.(MODULE_ID, FLAG_SCENE_CRITERIA);
  if (!stored) return [];
  return sanitizeCriteria(stored);
}

export async function setSceneCriteria(scene, criteria) {
  if (!scene?.setFlag) return;
  const sanitized = sanitizeCriteria(criteria);
  await scene.setFlag(MODULE_ID, FLAG_SCENE_CRITERIA, sanitized);
  await scene.setFlag(MODULE_ID, FLAG_SCENE_CRITERIA_VERSION, CURRENT_SCENE_CRITERIA_VERSION);

  const currentState = getSceneCriteriaState(scene, sanitized);
  await scene.setFlag(MODULE_ID, FLAG_SCENE_STATE, currentState);
}

export function getSceneCriteriaState(scene, criteriaOverride = null) {
  const criteria = Array.isArray(criteriaOverride) ? criteriaOverride : getSceneCriteria(scene);
  const rawState = duplicateData(scene?.getFlag?.(MODULE_ID, FLAG_SCENE_STATE) ?? {});
  return sanitizeSceneCriteriaState(rawState, criteria);
}

export async function setSceneCriteriaState(scene, state, criteriaOverride = null) {
  if (!scene?.setFlag) return;
  const criteria = Array.isArray(criteriaOverride) ? criteriaOverride : getSceneCriteria(scene);
  const sanitized = sanitizeSceneCriteriaState(state, criteria);
  await scene.setFlag(MODULE_ID, FLAG_SCENE_STATE, sanitized);
}

export function createSceneCriterion(label = "") {
  const text = typeof label === "string" ? label.trim() : "";
  const key = ensureUniqueCriterionKey(slugifyCriterionKey(text || "criterion"), new Set());

  return {
    id: generateCriterionId(),
    key,
    label: text,
    values: [DEFAULT_CRITERION_VALUE],
    default: DEFAULT_CRITERION_VALUE,
    order: 0
  };
}

export function sanitizeCriteria(input) {
  const source = Array.isArray(input) ? duplicateData(input) : [];
  const criteria = [];
  const keySet = new Set();

  source.forEach((entry, index) => {
    const criterion = sanitizeCriterion(entry, index, keySet);
    if (criterion) {
      criteria.push(criterion);
      keySet.add(criterion.key);
    }
  });

  return criteria;
}

export function sanitizeCriterion(entry, index = 0, usedKeys = new Set()) {
  if (!entry || typeof entry !== "object") return null;

  const id =
    typeof entry.id === "string" && entry.id.trim()
      ? entry.id.trim()
      : generateCriterionId();

  const rawLabel =
    typeof entry.label === "string"
      ? entry.label
      : typeof entry.name === "string"
      ? entry.name
      : "";
  const label = rawLabel.trim();

  const candidateKey =
    typeof entry.key === "string" && entry.key.trim()
      ? slugifyCriterionKey(entry.key)
      : slugifyCriterionKey(label || `criterion-${Number(index) + 1}`);
  const key = ensureUniqueCriterionKey(candidateKey, usedKeys);

  const values = sanitizeCriterionValues(entry.values);
  let defaultValue = typeof entry.default === "string" ? entry.default.trim() : "";
  if (!defaultValue) {
    defaultValue = values[0] ?? DEFAULT_CRITERION_VALUE;
  }
  if (!values.includes(defaultValue)) {
    values.unshift(defaultValue);
  }

  const order = Number.isFinite(entry.order) ? Number(entry.order) : Number(index);

  return {
    id,
    key,
    label,
    values,
    default: defaultValue,
    order
  };
}

export function sanitizeSceneCriteriaState(input, criteria = []) {
  const source = input && typeof input === "object" ? duplicateData(input) : {};
  const state = {};

  for (const criterion of criteria) {
    const value = source?.[criterion.key];
    const normalized = typeof value === "string" ? value.trim() : "";
    if (normalized && criterion.values.includes(normalized)) {
      state[criterion.key] = normalized;
    } else {
      state[criterion.key] = criterion.default;
    }
  }

  return state;
}

export function getSceneCriteriaCategories(scene) {
  const criteria = getSceneCriteria(scene);
  return criteria.map((criterion) => ({
    id: criterion.id,
    name: criterion.label,
    values: [...criterion.values]
  }));
}

function sanitizeCriterionValues(rawValues) {
  const source = Array.isArray(rawValues) ? rawValues : [];
  const values = [];
  for (const value of source) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed || values.includes(trimmed)) continue;
    values.push(trimmed);
  }

  if (!values.length) {
    values.push(DEFAULT_CRITERION_VALUE);
  }
  return values;
}

function slugifyCriterionKey(value) {
  const slug = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "criterion";
}

function ensureUniqueCriterionKey(candidate, usedKeys) {
  if (!usedKeys.has(candidate)) return candidate;
  let counter = 2;
  while (usedKeys.has(`${candidate}-${counter}`)) {
    counter += 1;
  }
  return `${candidate}-${counter}`;
}

export function generateCriterionId() {
  if (foundry?.utils?.randomID) {
    return foundry.utils.randomID();
  }
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

export function notifyPersistError(error) {
  console.error(`${MODULE_ID} | Failed to persist scene criteria`, error);
  ui.notifications?.error?.(
    localize(
      "EIDOLON.SceneCriteria.PersistError",
      "Failed to persist the scene criteria."
    )
  );
}

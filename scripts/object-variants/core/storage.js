import { FLAG_OBJECT_VARIANTS, MODULE_ID } from "./constants.js";
import { duplicateData, localize } from "../../time-triggers/core/utils.js";

export function getObjectVariantCategories(scene) {
  const stored = scene?.getFlag?.(MODULE_ID, FLAG_OBJECT_VARIANTS);
  if (!stored) return [];

  const duplicated = duplicateData(stored);
  if (!Array.isArray(duplicated)) return [];

  return duplicated
    .map((entry) => sanitizeCategory(entry))
    .filter((category) => category !== null);
}

export async function setObjectVariantCategories(scene, categories) {
  if (!scene?.setFlag) return;
  const sanitized = Array.isArray(categories)
    ? categories.map((entry) => sanitizeCategory(entry)).filter((entry) => entry !== null)
    : [];

  await scene.setFlag(MODULE_ID, FLAG_OBJECT_VARIANTS, sanitized);
}

export function createObjectVariantCategory(name = "") {
  return {
    id: generateVariantId(),
    name: typeof name === "string" ? name : "",
    values: []
  };
}

export function sanitizeCategory(entry) {
  if (!entry || typeof entry !== "object") return null;

  const id =
    typeof entry.id === "string" && entry.id.trim()
      ? entry.id.trim()
      : generateVariantId();
  const name = typeof entry.name === "string" ? entry.name : "";

  const valuesRaw = Array.isArray(entry.values) ? entry.values : [];
  const values = [];
  for (const value of valuesRaw) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    if (!values.includes(trimmed)) {
      values.push(trimmed);
    }
  }

  return { id, name, values };
}

export function generateVariantId() {
  if (foundry?.utils?.randomID) {
    return foundry.utils.randomID();
  }
  if (typeof crypto?.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2, 11);
}

export function notifyPersistError(error) {
  console.error(`${MODULE_ID} | Failed to persist object variants`, error);
  ui.notifications?.error?.(
    localize(
      "EIDOLON.ObjectVariants.PersistError",
      "Failed to persist the scene's object variants."
    )
  );
}

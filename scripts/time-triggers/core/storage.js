import {
  FLAG_TIME_TRIGGER_HISTORY,
  FLAG_TIME_TRIGGERS,
  MODULE_ID
} from "./constants.js";
import { debugLog } from "./debug.js";
import { duplicateData, localize } from "./utils.js";

export function getTimeTriggers(scene) {
  const stored = scene?.getFlag?.(MODULE_ID, FLAG_TIME_TRIGGERS);
  if (!stored) return [];
  const duplicated = duplicateData(stored);
  const triggers = Array.isArray(duplicated) ? duplicated : [];
  debugLog("Loaded time triggers", {
    sceneId: scene?.id ?? null,
    count: triggers.length
  });
  return triggers;
}

export async function setTimeTriggers(scene, triggers) {
  if (!scene?.setFlag) return;
  debugLog("Persisting time triggers", {
    sceneId: scene.id,
    count: Array.isArray(triggers) ? triggers.length : 0
  });
  await scene.setFlag(MODULE_ID, FLAG_TIME_TRIGGERS, triggers);
}

export function getTimeTriggerHistory(scene) {
  const stored = scene?.getFlag?.(MODULE_ID, FLAG_TIME_TRIGGER_HISTORY);
  if (!stored) return {};
  const duplicated = duplicateData(stored);
  if (!duplicated || typeof duplicated !== "object") return {};

  const result = {};
  for (const [key, value] of Object.entries(duplicated)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      result[key] = value;
    }
  }
  debugLog("Loaded time trigger history", {
    sceneId: scene?.id ?? null,
    keys: Object.keys(result)
  });
  return result;
}

export async function updateTimeTriggerHistory(scene, history) {
  if (!scene) return;

  const sanitized = {};
  if (history && typeof history === "object") {
    for (const [key, value] of Object.entries(history)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        sanitized[key] = value;
      }
    }
  }

  const existingRaw = scene.getFlag?.(MODULE_ID, FLAG_TIME_TRIGGER_HISTORY) ?? {};
  const existing = {};
  if (existingRaw && typeof existingRaw === "object") {
    for (const [key, value] of Object.entries(existingRaw)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        existing[key] = value;
      }
    }
  }

  const sanitizedKeys = Object.keys(sanitized);
  const existingKeys = Object.keys(existing);

  const statesMatch =
    typeof foundry?.utils?.deepEqual === "function"
      ? foundry.utils.deepEqual(existing, sanitized)
      : JSON.stringify(existing) === JSON.stringify(sanitized);
  if (statesMatch) {
    debugLog("Skip history update because state is unchanged", {
      sceneId: scene?.id ?? null
    });
    return;
  }

  debugLog("Updating time trigger history", {
    sceneId: scene?.id ?? null,
    keys: sanitizedKeys,
    removedKeys: existingKeys.filter((key) => !sanitizedKeys.includes(key))
  });

  try {
    if (existingKeys.length && typeof scene.unsetFlag === "function") {
      await scene.unsetFlag(MODULE_ID, FLAG_TIME_TRIGGER_HISTORY);
    }
    if (sanitizedKeys.length) {
      await scene.setFlag(MODULE_ID, FLAG_TIME_TRIGGER_HISTORY, sanitized);
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to persist time trigger history`, error);
    ui.notifications?.error?.(
      localize(
        "EIDOLON.TimeTrigger.HistoryPersistError",
        "Failed to persist the scene's time trigger history."
      )
    );
  }
}

import {
  getSceneCriteria,
  getSceneCriteriaState,
  sanitizeSceneCriteriaState,
  setSceneCriteriaState
} from "../../scene-criteria/core/storage.js";
import {
  CURRENT_SCHEMA_VERSION,
  FLAG_SCENE_ENGINE_VERSION,
  MODULE_ID,
  getSceneEngineVersion
} from "./constants.js";
import { debugLog } from "../../time-triggers/core/debug.js";
import { requireCriteriaAccess } from "./permissions.js";
import { updateTiles } from "./tiles.js";
import { updatePlaceables } from "./placeables.js";

function nowMs() {
  if (typeof performance?.now === "function") return performance.now();
  return Date.now();
}

const applyQueuesBySceneId = new Map();

export function getState(scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return null;
  return getSceneCriteriaState(scene);
}

async function applyStateInternal(newState, scene, queuedMs = 0) {
  const startedAt = nowMs();
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return null;

  requireCriteriaAccess(scene);

  const criteria = getSceneCriteria(scene);
  if (!criteria.length) {
    console.warn(`${MODULE_ID} | applyState skipped: scene has no criteria.`);
    return null;
  }

  const current = getSceneCriteriaState(scene, criteria);
  const merged = sanitizeSceneCriteriaState({ ...current, ...(newState ?? {}) }, criteria);

  const changedKeys = criteria
    .filter((criterion) => current?.[criterion.key] !== merged?.[criterion.key])
    .map((criterion) => criterion.key);
  const didChange = changedKeys.length > 0;

  if (didChange) {
    await setSceneCriteriaState(scene, merged, criteria);
  }

  const nextState = didChange ? merged : current;
  const [tileMetrics, placeableMetrics] = await Promise.all([
    updateTiles(nextState, scene, { changedKeys }),
    updatePlaceables(nextState, scene, { changedKeys })
  ]);

  const durationMs = nowMs() - startedAt;

  debugLog("Criteria apply telemetry", {
    sceneId: scene.id,
    changedKeys,
    didChange,
    queuedMs,
    durationMs,
    tiles: tileMetrics,
    placeables: placeableMetrics
  });

  Hooks.callAll("eidolon-utilities.criteriaStateApplied", scene, nextState);
  return nextState;
}

export async function applyState(newState, scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return null;

  const sceneId = scene.id ?? "__viewed__";
  const queuedAt = nowMs();
  const previous = applyQueuesBySceneId.get(sceneId) ?? Promise.resolve();

  let currentTask = null;
  const run = previous
    .catch(() => null)
    .then(async () => {
      const queuedMs = nowMs() - queuedAt;
      return applyStateInternal(newState, scene, queuedMs);
    });
  currentTask = run;

  const tracked = run.finally(() => {
    if (applyQueuesBySceneId.get(sceneId) === tracked) {
      applyQueuesBySceneId.delete(sceneId);
    }
  });

  // Keep only the latest queued task for this scene id.
  applyQueuesBySceneId.set(sceneId, tracked);
  return currentTask;
}

export function getVersion(scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return null;
  return getSceneEngineVersion(scene);
}

export async function setVersion(version, scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene?.setFlag) return;
  await scene.setFlag(MODULE_ID, FLAG_SCENE_ENGINE_VERSION, Number(version));
}

export async function markCurrentVersion(scene) {
  return setVersion(CURRENT_SCHEMA_VERSION, scene);
}

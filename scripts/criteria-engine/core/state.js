import {
  getSceneCriteria,
  getSceneCriteriaState,
  setSceneCriteriaState
} from "../../scene-criteria/core/storage.js";
import {
  CURRENT_SCHEMA_VERSION,
  FLAG_SCENE_ENGINE_VERSION,
  MODULE_ID,
  getSceneEngineVersion
} from "./constants.js";
import { requireCriteriaAccess } from "./permissions.js";
import { updateTiles } from "./tiles.js";
import { updatePlaceables } from "./placeables.js";

export function getState(scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return null;
  return getSceneCriteriaState(scene);
}

export async function applyState(newState, scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return null;

  requireCriteriaAccess(scene);

  const criteria = getSceneCriteria(scene);
  if (!criteria.length) {
    console.warn(`${MODULE_ID} | applyState skipped: scene has no criteria.`);
    return null;
  }

  const current = getSceneCriteriaState(scene, criteria);
  const merged = { ...current, ...(newState ?? {}) };

  await setSceneCriteriaState(scene, merged, criteria);

  const persisted = getSceneCriteriaState(scene, criteria);
  await Promise.all([updateTiles(persisted, scene), updatePlaceables(persisted, scene)]);

  Hooks.callAll("eidolon-utilities.criteriaStateApplied", scene, persisted);
  return persisted;
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

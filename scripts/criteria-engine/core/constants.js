import { MODULE_ID as BASE_MODULE_ID } from "../../time-triggers/core/constants.js";

export const MODULE_ID = BASE_MODULE_ID;

export const FLAG_SCENE_ENGINE_VERSION = "criteriaEngineVersion";
export const FLAG_TILE_FILE_INDEX = "fileIndex";
export const FLAG_TILE_CRITERIA = "tileCriteria";

export const SCHEMA_VERSION = {
  LEGACY: 1,
  CRITERIA: 2
};

export const CURRENT_SCHEMA_VERSION = SCHEMA_VERSION.CRITERIA;

export function getSceneEngineVersion(scene) {
  return scene?.getFlag?.(MODULE_ID, FLAG_SCENE_ENGINE_VERSION) ?? SCHEMA_VERSION.LEGACY;
}

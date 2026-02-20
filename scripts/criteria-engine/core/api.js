import { findBestMatch, findFileIndex } from "./matcher.js";
import { resolveRules } from "./resolver.js";
import { applyState, getState, getVersion, setVersion } from "./state.js";
import { updateTiles } from "./tiles.js";
import { updatePlaceables } from "./placeables.js";
import { indexScene } from "./indexer.js";
import { getSceneCriteria, setSceneCriteria } from "../../scene-criteria/core/storage.js";
import { SCHEMA_VERSION } from "./constants.js";
import {
  closeCriteriaSwitcher,
  openCriteriaSwitcher,
  toggleCriteriaSwitcher
} from "../ui/switcher-service.js";

export const api = {
  SCHEMA_VERSION,

  applyState,
  getState,
  getVersion,
  setVersion,

  getCriteria(scene) {
    return getSceneCriteria(scene ?? game.scenes?.viewed);
  },

  setCriteria(criteria, scene) {
    return setSceneCriteria(scene ?? game.scenes?.viewed, criteria);
  },

  updateTiles,
  updatePlaceables,
  indexScene,

  openCriteriaSwitcher,
  closeCriteriaSwitcher,
  toggleCriteriaSwitcher,

  findBestMatch,
  findFileIndex,
  resolveRules
};

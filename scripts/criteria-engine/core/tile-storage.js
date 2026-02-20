import { FLAG_TILE_CRITERIA, FLAG_TILE_FILE_INDEX, MODULE_ID } from "./constants.js";
import {
  createTileTargetFromIndex,
  detectTileCriteriaConflicts,
  normalizeTileCriteria
} from "./tiles.js";

function getTileFiles(tile) {
  return tile?.getFlag?.("monks-active-tiles", "files") ?? [];
}

export function createDefaultTileCriteria(files = []) {
  return {
    strategy: "select-one",
    defaultTarget: createTileTargetFromIndex(files, 0) ?? { indexHint: 0 },
    variants: [
      {
        criteria: {},
        target: createTileTargetFromIndex(files, 0) ?? { indexHint: 0 }
      }
    ]
  };
}

export function getTileCriteria(tile, options = {}) {
  const { allowLegacy = true } = options;
  const files = getTileFiles(tile);

  const raw = tile?.getFlag?.(MODULE_ID, FLAG_TILE_CRITERIA);
  if (raw) return normalizeTileCriteria(raw, { files });

  if (!allowLegacy) return null;

  const legacy = tile?.getFlag?.(MODULE_ID, FLAG_TILE_FILE_INDEX);
  if (!legacy) return null;
  return normalizeTileCriteria(legacy, { files });
}

export function parseTileCriteriaJson(jsonText, files = []) {
  if (typeof jsonText !== "string") return null;
  const parsed = JSON.parse(jsonText);
  return normalizeTileCriteria(parsed, { files });
}

export function stringifyTileCriteria(criteria, files = []) {
  const normalized = normalizeTileCriteria(criteria, { files });
  return JSON.stringify(normalized ?? createDefaultTileCriteria(files), null, 2);
}

export async function setTileCriteria(tile, criteria, options = {}) {
  if (!tile?.setFlag) return null;

  const {
    strictValidation = true
  } = options;

  const files = getTileFiles(tile);

  const normalized = normalizeTileCriteria(criteria, { files });
  if (!normalized) {
    if (typeof tile.unsetFlag === "function") {
      await tile.unsetFlag(MODULE_ID, FLAG_TILE_CRITERIA);
      await tile.unsetFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
    } else {
      await tile.setFlag(MODULE_ID, FLAG_TILE_CRITERIA, null);
      await tile.setFlag(MODULE_ID, FLAG_TILE_FILE_INDEX, null);
    }
    return null;
  }

  if (strictValidation) {
    const conflictReport = detectTileCriteriaConflicts(normalized, { files });
    if (conflictReport.errors.length > 0) {
      throw new Error(
        `Tile criteria contains ${conflictReport.errors.length} conflicting rule pair(s). Resolve clashes before saving.`
      );
    }
  }

  await tile.setFlag(MODULE_ID, FLAG_TILE_CRITERIA, normalized);
  if (typeof tile.unsetFlag === "function") {
    await tile.unsetFlag(MODULE_ID, FLAG_TILE_FILE_INDEX);
  }
  return normalized;
}

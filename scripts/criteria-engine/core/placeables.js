import { MODULE_ID } from "./constants.js";
import { resolveRules } from "./resolver.js";
import { buildLightControlsMap } from "./light-controls.js";
import { convertLightCriteriaStateToPresets } from "../../light-criteria/core/storage.js";

const PLACEABLE_TYPES = ["AmbientLight", "Wall", "AmbientSound"];

function getPresetsForDocument(doc, type) {
  const flags = doc?.flags?.[MODULE_ID] ?? {};
  if (flags?.presets) {
    const base = flags.presets.base ?? null;
    const rules = Array.isArray(flags.presets.rules) ? flags.presets.rules : [];
    const hasBase = base && Object.keys(base).length > 0;
    if (hasBase || rules.length > 0) {
      return {
        base: base ?? {},
        rules
      };
    }
  }

  if (type !== "AmbientLight") return null;

  if (flags?.lightCriteria) {
    const presets = convertLightCriteriaStateToPresets(flags.lightCriteria);
    const hasBase = presets.base && Object.keys(presets.base).length > 0;
    if (hasBase || presets.rules.length > 0) return presets;
  }

  return null;
}

/**
 * Resolve presets for criteria-enabled placeables.
 */
export async function updatePlaceables(state, scene) {
  scene = scene ?? game.scenes?.viewed;
  if (!scene) return;

  const hiddenIds = buildLightControlsMap();

  for (const type of PLACEABLE_TYPES) {
    const collection = scene.getEmbeddedCollection(type);
    const updates = [];

    for (const doc of collection) {
      const presets = getPresetsForDocument(doc, type);
      if (!presets?.base) continue;

      const resolved = resolveRules(presets.base, presets.rules ?? [], state);
      resolved._id = doc._id;

      if (type === "AmbientLight" && hiddenIds.includes(doc._id)) {
        resolved.hidden = true;
      }

      updates.push(resolved);
    }

    if (updates.length > 0) {
      await scene.updateEmbeddedDocuments(type, updates);
      console.log(`${MODULE_ID} | Updated ${updates.length} ${type}(s)`);
    }
  }
}

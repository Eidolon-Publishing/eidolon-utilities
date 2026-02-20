import { MODULE_ID } from "./core/constants.js";
import { api as criteriaApi } from "./core/api.js";
import { canManageCriteria } from "./core/permissions.js";
import { invalidateTileCriteriaCaches } from "./core/tiles.js";
import { invalidatePlaceableCriteriaCaches } from "./core/placeables.js";
import { getCriteriaSurfacesEnabled } from "../scene-criteria/core/settings.js";
import { getCriteriaSwitcher, toggleCriteriaSwitcher } from "./ui/switcher-service.js";
import { registerTileCriteriaConfigControls } from "./ui/TileCriteriaConfigControls.js";

function toList(value) {
  if (Array.isArray(value)) return value;
  if (value instanceof Map) return Array.from(value.values());
  if (value && typeof value === "object") {
    if (typeof value.values === "function") {
      try {
        const mapped = Array.from(value.values());
        if (mapped.length > 0) return mapped;
      } catch (_error) {
        // Fall through to object values.
      }
    }
    return Object.values(value);
  }
  return [];
}

function hasTool(target, name) {
  const tools = target?.tools;
  if (Array.isArray(tools)) return tools.some((tool) => tool?.name === name);
  if (tools instanceof Map) return tools.has(name);
  if (tools && typeof tools === "object") {
    if (name in tools) return true;
    return Object.values(tools).some((tool) => tool?.name === name);
  }
  return false;
}

function addTool(target, tool) {
  if (Array.isArray(target.tools)) {
    target.tools.push(tool);
    return;
  }
  if (target.tools instanceof Map) {
    target.tools.set(tool.name, tool);
    return;
  }
  if (target.tools && typeof target.tools === "object") {
    target.tools[tool.name] = tool;
    return;
  }
  target.tools = [tool];
}

function registerSceneControlButton() {
  Hooks.on("getSceneControlButtons", (controls) => {
    const controlList = toList(controls);
    if (!controlList.length) return;

    const target =
      controlList.find((control) => control?.name === "tiles")
      ?? controlList.find((control) => control?.name === "tokens" || control?.name === "token")
      ?? controlList[0];

    if (!target) return;
    if (hasTool(target, "eidolonCriteriaSwitcher")) return;

    addTool(target, {
      name: "eidolonCriteriaSwitcher",
      title: "Criteria Switcher",
      icon: "fa-solid fa-sliders",
      button: true,
      toggle: false,
      visible: getCriteriaSurfacesEnabled() && canManageCriteria(game.scenes?.viewed ?? null),
      onClick: () => {
        if (!getCriteriaSurfacesEnabled()) {
          ui.notifications?.warn?.("Criteria UI surfaces are disabled in module settings.");
          return;
        }
        toggleCriteriaSwitcher();
      }
    });
  });
}

function hasOwnPath(source, path) {
  if (!source || typeof source !== "object") return false;

  const segments = String(path).split(".");
  let current = source;
  for (const segment of segments) {
    if (!current || typeof current !== "object") return false;
    if (!Object.prototype.hasOwnProperty.call(current, segment)) return false;
    current = current[segment];
  }

  return true;
}

function registerCriteriaCacheInvalidationHooks() {
  const invalidateTileScene = (scene, tile = null) => {
    if (!scene) return;
    invalidateTileCriteriaCaches(scene, tile);
  };

  const invalidatePlaceableScene = (scene, doc = null) => {
    if (!scene) return;
    invalidatePlaceableCriteriaCaches(scene, doc);
  };

  Hooks.on("createTile", (doc) => {
    invalidateTileScene(doc?.parent ?? null, doc ?? null);
  });

  Hooks.on("deleteTile", (doc) => {
    invalidateTileScene(doc?.parent ?? null, doc ?? null);
  });

  Hooks.on("updateTile", (doc, change) => {
    const touchesTileCriteria = hasOwnPath(change, `flags.${MODULE_ID}.${"tileCriteria"}`)
      || hasOwnPath(change, `flags.${MODULE_ID}.${"fileIndex"}`);
    if (!touchesTileCriteria) return;

    invalidateTileScene(doc?.parent ?? null, doc ?? null);
  });

  const registerPlaceableHooks = (documentName) => {
    Hooks.on(`create${documentName}`, (doc) => {
      invalidatePlaceableScene(doc?.parent ?? null, doc ?? null);
    });

    Hooks.on(`delete${documentName}`, (doc) => {
      invalidatePlaceableScene(doc?.parent ?? null, doc ?? null);
    });

    Hooks.on(`update${documentName}`, (doc, change) => {
      const touchesPresets = hasOwnPath(change, `flags.${MODULE_ID}.${"presets"}`);
      const touchesLightCriteria = documentName === "AmbientLight"
        && hasOwnPath(change, `flags.${MODULE_ID}.${"lightCriteria"}`);

      if (!touchesPresets && !touchesLightCriteria) return;

      invalidatePlaceableScene(doc?.parent ?? null, doc ?? null);
    });
  };

  registerPlaceableHooks("AmbientLight");
  registerPlaceableHooks("Wall");
  registerPlaceableHooks("AmbientSound");

  Hooks.on("canvasReady", (canvas) => {
    const scene = canvas?.scene ?? null;
    if (!scene) return;

    invalidateTileScene(scene);
    invalidatePlaceableScene(scene);
  });
}

export function registerCriteriaEngineHooks() {
  registerSceneControlButton();
  registerTileCriteriaConfigControls();
  registerCriteriaCacheInvalidationHooks();

  Hooks.once("init", () => {
    game.keybindings?.register?.(MODULE_ID, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: () => {
        if (!getCriteriaSurfacesEnabled()) {
          ui.notifications?.warn?.("Criteria UI surfaces are disabled in module settings.");
          return true;
        }

        if (!canManageCriteria(game.scenes?.viewed ?? null)) {
          ui.notifications?.warn?.("You do not have permission to manage scene criteria.");
          return true;
        }

        toggleCriteriaSwitcher();
        return true;
      },
      restricted: true,
      precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL
    });
  });

  Hooks.on("canvasReady", (canvas) => {
    const switcher = getCriteriaSwitcher();
    if (!switcher) return;

    switcher.setScene(canvas?.scene ?? game.scenes?.viewed ?? null);
    switcher.render({ force: true });
  });

  Hooks.once("ready", () => {
    const mod = game.modules?.get?.(MODULE_ID);
    if (!mod) return;

    if (!mod.api) mod.api = {};
    mod.api.criteria = criteriaApi;

    console.log(`${MODULE_ID} | Criteria engine API registered`);
  });
}

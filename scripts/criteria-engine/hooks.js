import { MODULE_ID } from "./core/constants.js";
import { api as criteriaApi } from "./core/api.js";
import { canManageCriteria } from "./core/permissions.js";
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
      visible: canManageCriteria(game.scenes?.viewed ?? null),
      onClick: () => {
        toggleCriteriaSwitcher();
      }
    });
  });
}

export function registerCriteriaEngineHooks() {
  registerSceneControlButton();
  registerTileCriteriaConfigControls();

  Hooks.once("init", () => {
    game.keybindings?.register?.(MODULE_ID, "toggleCriteriaSwitcher", {
      name: "Toggle Criteria Switcher",
      hint: "Open or close the criteria switcher window for live scene state updates.",
      editable: [{ key: "KeyM", modifiers: ["Alt"] }],
      onDown: () => {
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

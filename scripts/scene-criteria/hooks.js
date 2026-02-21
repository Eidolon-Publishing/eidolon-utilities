import { registerSceneCriteriaConfigHook } from "./ui/SceneConfigTab.js";
import { registerSceneCriteriaSettings } from "./core/settings.js";
import { getCriteriaSurfacesEnabled } from "./core/settings.js";

let criteriaTabRegistered = false;

export function registerSceneCriteriaHooks() {
  Hooks.once("init", () => {
    registerSceneCriteriaSettings();
  });

  Hooks.once("ready", () => {
    if (!getCriteriaSurfacesEnabled()) return;
    if (criteriaTabRegistered) return;
    registerSceneCriteriaConfigHook();
    criteriaTabRegistered = true;
  });
}

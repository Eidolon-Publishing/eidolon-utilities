import { TimeTriggerManager } from "./core/evaluator.js";
import { initializeDebug, debugLog, syncDebugState } from "./core/debug.js";
import { registerTimeTriggerSettings } from "./core/settings.js";
import { GameTimeAutomation } from "./core/time-automation.js";
import { registerSceneConfigHook } from "./ui/SceneConfigTab.js";

const manager = new TimeTriggerManager();
const timeAutomation = new GameTimeAutomation();

export function registerTimeTriggerHooks() {
  debugLog("Registering time trigger hooks");

  Hooks.once("init", () => {
    registerTimeTriggerSettings();
    initializeDebug();
    debugLog("Time trigger settings registered during init");
  });

  registerSceneConfigHook();
  debugLog("Scene config hook registered");
  timeAutomation.registerHooks();
  debugLog("Time automation hooks registered");

  Hooks.once("ready", () => {
    syncDebugState();
    debugLog("Ready hook fired");
    manager.onReady();
    timeAutomation.initialize();
  });
  Hooks.on("canvasReady", (canvas) => {
    debugLog("canvasReady hook received", { scene: canvas?.scene?.id ?? null });
    manager.onCanvasReady(canvas);
  });
  Hooks.on("updateScene", (scene) => {
    debugLog("updateScene hook received", { scene: scene?.id ?? null });
    manager.onUpdateScene(scene);
  });
  Hooks.on("updateWorldTime", (worldTime, diff) => {
    debugLog("updateWorldTime hook received", { worldTime, diff });
    manager.onUpdateWorldTime(worldTime, diff);
  });
}

export function getTimeTriggerManager() {
  return manager;
}

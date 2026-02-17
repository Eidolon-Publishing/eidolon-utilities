import {
  FLAG_TIME_TRIGGER_ACTIVE,
  FLAG_TIME_TRIGGER_HIDE_WINDOW,
  FLAG_TIME_TRIGGER_SHOW_PLAYER_WINDOW,
  MODULE_ID,
  SECONDS_PER_DAY
} from "./constants.js";
import { debugGroup, debugGroupEnd, debugLog } from "./debug.js";
import {
  getActiveScene,
  localize,
  parseTriggerTimeToSeconds
} from "./utils.js";
import {
  getTimeTriggerHistory,
  getTimeTriggers,
  updateTimeTriggerHistory
} from "./storage.js";
import { executeTriggerAction } from "./actions.js";
import TimeTriggerWindow from "../ui/TimeTriggerWindow.js";
import { createApplicationFactory } from "../../common/ui/application-factories.js";

const invalidTriggerWarnings = new Set();

export class TimeTriggerManager {
  #timeTriggerWindow = null;
  #lastEvaluatedWorldTime = null;
  #windowFactory;

  constructor({ windowFactory } = {}) {
    const baseFactory = createApplicationFactory(TimeTriggerWindow);
    const fallbackFactory = (scene, options = {}) =>
      baseFactory({ scene, ...(options ?? {}) });

    if (typeof windowFactory === "function") {
      if (windowFactory.__eidolonFactorySignature === "options") {
        this.#windowFactory = (scene, options = {}) =>
          windowFactory({ scene, ...(options ?? {}) });
      } else {
        this.#windowFactory = windowFactory;
      }
    } else {
      this.#windowFactory = fallbackFactory;
    }
  }

  onReady() {
    const worldTime =
      typeof game.time?.worldTime === "number" && Number.isFinite(game.time.worldTime)
        ? game.time.worldTime
        : null;
    debugLog("TimeTriggerManager#onReady", { worldTime });
    if (worldTime !== null) {
      this.#lastEvaluatedWorldTime = worldTime;
    }
  }

  onCanvasReady(canvas) {
    const scene = canvas?.scene ?? getActiveScene();
    debugLog("TimeTriggerManager#onCanvasReady", { sceneId: scene?.id ?? null });
    this.refreshTimeTriggerWindow(scene);
    void this.handleTimeTriggerEvaluation(scene);
  }

  onUpdateScene(scene) {
    const activeScene = getActiveScene();
    debugLog("TimeTriggerManager#onUpdateScene", {
      sceneId: scene?.id ?? null,
      activeSceneId: activeScene?.id ?? null
    });
    if (!activeScene || scene.id !== activeScene.id) return;
    this.refreshTimeTriggerWindow(scene);
    void this.handleTimeTriggerEvaluation(scene);
  }

  onUpdateWorldTime(worldTime, diff) {
    debugLog("TimeTriggerManager#onUpdateWorldTime", {
      worldTime,
      diff,
      hasWindow: Boolean(this.#timeTriggerWindow)
    });
    if (this.#timeTriggerWindow) {
      this.#timeTriggerWindow.render();
    }

    const activeScene = getActiveScene();
    const previous = this.#resolvePreviousWorldTime(worldTime, diff);
    void this.handleTimeTriggerEvaluation(activeScene, worldTime, previous);
  }

  refreshTimeTriggerWindow(scene) {
    if (!scene) return;
    const isGM = Boolean(game.user?.isGM);
    const isActive = Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_ACTIVE));
    const hideWindow = Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_HIDE_WINDOW));
    const showPlayerWindow = Boolean(
      scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_SHOW_PLAYER_WINDOW)
    );
    debugLog("TimeTriggerManager#refreshTimeTriggerWindow", {
      sceneId: scene.id,
      isGM,
      isActive,
      hideWindow,
      showPlayerWindow
    });

    const shouldDisplayWindow = isActive && !hideWindow && (isGM || showPlayerWindow);

    if (!shouldDisplayWindow) {
      if (this.#timeTriggerWindow) {
        debugLog("Closing time trigger window", { reason: "not-visible" });
        this.#timeTriggerWindow.close({ force: true });
        this.#timeTriggerWindow = null;
      }
      return;
    }

    const showControls = Boolean(isGM);

    if (this.#timeTriggerWindow && this.#timeTriggerWindow.scene?.id === scene.id) {
      debugLog("Refreshing existing time trigger window", { sceneId: scene.id });
      this.#timeTriggerWindow.showControls = showControls;
      this.#timeTriggerWindow.render();
      return;
    }

    if (this.#timeTriggerWindow) {
      debugLog("Closing existing window before creating new instance", {
        previousSceneId: this.#timeTriggerWindow.scene?.id ?? null
      });
      this.#timeTriggerWindow.close({ force: true });
    }

    this.#timeTriggerWindow = this.#windowFactory(scene, { showControls });
    debugLog("Rendering new time trigger window", { sceneId: scene.id });
    this.#timeTriggerWindow.render({ force: true });
  }

  async handleTimeTriggerEvaluation(scene, currentWorldTime, previousWorldTimeOverride) {
    const activeScene = scene ?? getActiveScene();
    if (!activeScene) {
      debugLog("handleTimeTriggerEvaluation skipped", {
        reason: "no-active-scene",
        providedSceneId: scene?.id ?? null,
        currentWorldTime
      });
      if (typeof currentWorldTime === "number" && Number.isFinite(currentWorldTime)) {
        this.#lastEvaluatedWorldTime = currentWorldTime;
      }
      return;
    }

    const current =
      typeof currentWorldTime === "number" && Number.isFinite(currentWorldTime)
        ? currentWorldTime
        : typeof game.time?.worldTime === "number"
        ? game.time.worldTime
        : null;

    if (current === null) return;

    const previousOverride =
      typeof previousWorldTimeOverride === "number" && Number.isFinite(previousWorldTimeOverride)
        ? previousWorldTimeOverride
        : null;

    const previous =
      previousOverride !== null
        ? previousOverride
        : typeof this.#lastEvaluatedWorldTime === "number" && Number.isFinite(this.#lastEvaluatedWorldTime)
        ? this.#lastEvaluatedWorldTime
        : current;

    debugGroup("handleTimeTriggerEvaluation", {
      sceneId: activeScene.id,
      previousWorldTime: previous,
      currentWorldTime: current,
      overrideProvided: previousOverride !== null
    });
    try {
      await this.#evaluateSceneTimeTriggers(activeScene, previous, current);
    } catch (error) {
      console.error(`${MODULE_ID} | Unexpected error while evaluating time triggers`, error);
      debugLog("handleTimeTriggerEvaluation error", { message: error?.message ?? String(error) });
    } finally {
      this.#lastEvaluatedWorldTime = current;
      debugGroupEnd();
    }
  }

  #resolvePreviousWorldTime(worldTime, diff) {
    if (typeof this.#lastEvaluatedWorldTime === "number" && Number.isFinite(this.#lastEvaluatedWorldTime)) {
      debugLog("Resolved previous world time from cache", {
        previousWorldTime: this.#lastEvaluatedWorldTime
      });
      return this.#lastEvaluatedWorldTime;
    }

    if (
      typeof worldTime === "number" &&
      Number.isFinite(worldTime) &&
      typeof diff === "number" &&
      Number.isFinite(diff)
    ) {
      debugLog("Resolved previous world time using diff", {
        worldTime,
        diff,
        resolved: worldTime - diff
      });
      return worldTime - diff;
    }

    return typeof worldTime === "number" && Number.isFinite(worldTime) ? worldTime : null;
  }

  async #evaluateSceneTimeTriggers(scene, previousWorldTime, currentWorldTime) {
    if (!game.user?.isGM) {
      debugLog("Skipping trigger evaluation because user is not a GM");
      return;
    }
    if (!scene?.id) {
      debugLog("Skipping trigger evaluation because the scene is missing an id");
      return;
    }

    const isActive = Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_ACTIVE));
    if (!isActive) {
      debugLog("Skipping trigger evaluation because scene is inactive", { sceneId: scene.id });
      return;
    }

    if (typeof currentWorldTime !== "number" || !Number.isFinite(currentWorldTime)) return;
    if (typeof previousWorldTime !== "number" || !Number.isFinite(previousWorldTime)) {
      previousWorldTime = currentWorldTime;
    }

    const triggers = getTimeTriggers(scene);
    if (!triggers.length) {
      debugLog("No time triggers configured for scene", { sceneId: scene.id });
      return;
    }

    const history = getTimeTriggerHistory(scene);
    const validTriggerIds = new Set();
    for (const trigger of triggers) {
      if (trigger?.id) {
        validTriggerIds.add(trigger.id);
      }
    }

    let historyChanged = false;
    for (const key of Object.keys(history)) {
      if (!validTriggerIds.has(key)) {
        delete history[key];
        historyChanged = true;
      }
    }

    debugGroup("Evaluating scene time triggers", {
      sceneId: scene.id,
      previousWorldTime,
      currentWorldTime,
      triggerCount: triggers.length
    });

    if (currentWorldTime <= previousWorldTime) {
      debugLog("Detected world time rewind", {
        previousWorldTime,
        currentWorldTime
      });
      for (const trigger of triggers) {
        if (!trigger?.id) continue;
        if (!trigger.allowReplayOnRewind) continue;

        const lastFired = history[trigger.id];
        if (typeof lastFired === "number") {
          if (currentWorldTime < lastFired) {
            debugLog("Clearing trigger history due to rewind", {
              triggerId: trigger.id,
              lastFired,
              currentWorldTime
            });
            delete history[trigger.id];
            historyChanged = true;
          } else {
            debugLog("Preserving trigger history after rewind", {
              triggerId: trigger.id,
              lastFired,
              currentWorldTime
            });
          }
        } else {
          debugLog("No history stored for rewind-enabled trigger", {
            triggerId: trigger.id
          });
        }
      }

      if (historyChanged) {
        debugLog("Persisting history cleanup after rewind", {
          sceneId: scene.id
        });
        await updateTimeTriggerHistory(scene, history);
      }
      debugGroupEnd();
      return;
    }

    const start = previousWorldTime;
    const end = currentWorldTime;

    const triggersToFire = [];
    const startDay = Math.floor(start / SECONDS_PER_DAY);
    const endDay = Math.floor(end / SECONDS_PER_DAY);

    for (const trigger of triggers) {
      if (!trigger?.id) continue;
      const triggerSeconds = parseTriggerTimeToSeconds(trigger.time);
      if (triggerSeconds === null) {
        warnInvalidTriggerTime(scene, trigger);
        debugLog("Skipping trigger with invalid time", {
          triggerId: trigger.id,
          time: trigger.time
        });
        continue;
      }

      for (let day = startDay; day <= endDay; day++) {
        const absoluteTime = day * SECONDS_PER_DAY + triggerSeconds;
        const outsideEvaluationWindow = absoluteTime < start || absoluteTime > end;
        if (outsideEvaluationWindow) continue;

        const lastFired = history[trigger.id];
        if (typeof lastFired === "number" && lastFired >= absoluteTime) {
          debugLog("Skipping trigger because it already fired within window", {
            triggerId: trigger.id,
            lastFired,
            absoluteTime
          });
          continue;
        }

        triggersToFire.push({ trigger, absoluteTime });
      }
    }

    if (!triggersToFire.length) {
      if (historyChanged) {
        await updateTimeTriggerHistory(scene, history);
      }
      debugLog("No triggers scheduled to fire within evaluation window", {
        sceneId: scene.id
      });
      debugGroupEnd();
      return;
    }

    triggersToFire.sort((a, b) => a.absoluteTime - b.absoluteTime);
    debugLog("Queued triggers for execution", {
      entries: triggersToFire.map((entry) => ({
        triggerId: entry.trigger.id,
        absoluteTime: entry.absoluteTime
      }))
    });

    for (const entry of triggersToFire) {
      try {
        debugLog("Executing time trigger action", {
          triggerId: entry.trigger.id,
          absoluteTime: entry.absoluteTime
        });
        await executeTriggerAction(scene, entry.trigger);
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to execute time trigger action`, error);
        ui.notifications?.error?.(
          localize(
            "EIDOLON.TimeTrigger.TriggerActionError",
            "Failed to execute a scene time trigger action. Check the console for details."
          )
        );
        debugLog("Trigger execution failed", {
          triggerId: entry.trigger.id,
          message: error?.message ?? String(error)
        });
      } finally {
        history[entry.trigger.id] = entry.absoluteTime;
        historyChanged = true;
        debugLog("Recorded trigger execution", {
          triggerId: entry.trigger.id,
          absoluteTime: entry.absoluteTime
        });
      }
    }

    if (historyChanged) {
      debugLog("Persisting trigger history updates", { sceneId: scene.id });
      await updateTimeTriggerHistory(scene, history);
    }
    debugGroupEnd();
  }
}

function warnInvalidTriggerTime(scene, trigger) {
  const key = `${scene?.id ?? "unknown"}:${trigger?.id ?? trigger?.time ?? "unknown"}`;
  if (invalidTriggerWarnings.has(key)) return;
  invalidTriggerWarnings.add(key);

  const message = localize(
    "EIDOLON.TimeTrigger.InvalidTimeWarning",
    "A scene time trigger has an invalid time value and was skipped."
  );
  ui.notifications?.warn?.(message);
  console.warn(`${MODULE_ID} | Invalid time for trigger`, { scene: scene?.id, trigger });
}

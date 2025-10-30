import {
  DEFAULT_SECONDS_PER_ROUND,
  FLAG_TIME_TRIGGER_ALLOW_REAL_TIME,
  MODULE_ID
} from "./constants.js";
import { debugLog } from "./debug.js";
import {
  onManageTimeSettingChange,
  onSecondsPerRoundSettingChange
} from "./settings.js";
import { getActiveScene, hasSceneDocument } from "./utils.js";

export class GameTimeAutomation {
  #enabled = false;
  #secondsPerRound = DEFAULT_SECONDS_PER_ROUND;
  #processedRounds = new Map();
  #tickerId = null;
  #lastTickTimestamp = null;
  #queuedDelta = 0;
  #advancePromise = null;
  #manageTimeUnsubscribe = null;
  #secondsPerRoundUnsubscribe = null;
  #hooksRegistered = false;
  #initialized = false;
  #lastTickIdle = false;
  #sceneAllowsRealTime = false;

  constructor() {}

  registerHooks() {
    if (this.#hooksRegistered) return;
    this.#hooksRegistered = true;

    Hooks.on("pauseGame", this.#handlePause);
    Hooks.on("combatStart", this.#handleCombatStart);
    Hooks.on("combatRound", this.#handleCombatRound);
    Hooks.on("combatEnd", this.#handleCombatEnd);
    Hooks.on("deleteCombat", this.#handleCombatDelete);
    Hooks.on("updateCombat", this.#handleCombatUpdate);
    Hooks.on("canvasReady", this.#handleCanvasReady);
    Hooks.on("updateScene", this.#handleSceneUpdate);
  }

  initialize() {
    if (this.#initialized) return;
    this.#initialized = true;

    this.#manageTimeUnsubscribe = onManageTimeSettingChange((value) => {
      const enabled = Boolean(value);
      const changed = enabled !== this.#enabled;
      this.#enabled = enabled;
      debugLog("GameTimeAutomation | Manage time toggled", { enabled });
      if (changed && enabled) {
        this.#hydrateRoundTracking();
      }
      this.#syncRunningState();
    });

    this.#secondsPerRoundUnsubscribe = onSecondsPerRoundSettingChange((value) => {
      this.#secondsPerRound = value;
      debugLog("GameTimeAutomation | Seconds per round updated", { value });
    });

    this.#hydrateRoundTracking();
    this.#refreshSceneAutomationState();
    this.#syncRunningState();
  }

  #currentTimestamp() {
    try {
      if (typeof globalThis.performance?.now === "function") {
        return globalThis.performance.now();
      }
    } catch (error) {
      debugLog("GameTimeAutomation | Failed to read high-resolution timestamp", {
        message: error?.message ?? String(error)
      });
    }
    return Date.now();
  }

  #canControlTime() {
    return Boolean(game?.user?.isGM && game.user.active !== false);
  }

  #isCombatDocumentActive(combat) {
    if (!combat) return false;
    if (combat.active === true) return true;
    if (combat.active === false) return false;

    const active = game?.combats?.active;
    if (active?.id === combat.id) return true;

    if (game?.combat?.id === combat.id) {
      return game.combat.active ?? true;
    }

    return false;
  }

  #hasCombatStarted(combat) {
    if (!combat) return false;
    if (typeof combat.started === "boolean") return combat.started;
    return (combat.round ?? 0) > 0;
  }

  #isCombatRunning() {
    const combats = Array.isArray(game?.combats?.contents) ? game.combats.contents : [];
    for (const combat of combats) {
      if (this.#isCombatDocumentActive(combat) && this.#hasCombatStarted(combat)) {
        return true;
      }
    }

    const fallback = game?.combat;
    if (fallback && this.#isCombatDocumentActive(fallback) && this.#hasCombatStarted(fallback)) {
      return true;
    }

    return false;
  }

  #hydrateRoundTracking() {
    this.#processedRounds.clear();
    const combats = Array.isArray(game?.combats?.contents) ? game.combats.contents : [];
    for (const combat of combats) {
      if (combat?.id) {
        this.#processedRounds.set(combat.id, Math.max(combat.round ?? 0, 1));
      }
    }
  }

  #syncRunningState({ pausedOverride } = {}) {
    const paused = typeof pausedOverride === "boolean" ? pausedOverride : Boolean(game?.paused);
    const manageTimeEnabled = this.#enabled;
    const sceneAllows = this.#sceneAllowsRealTime;
    const effectiveEnabled = manageTimeEnabled && sceneAllows;
    const state = {
      manageTimeEnabled,
      sceneAllowsRealTime: sceneAllows,
      effectiveEnabled,
      paused,
      canControl: this.#canControlTime(),
      combatRunning: this.#isCombatRunning(),
      overrideApplied: typeof pausedOverride === "boolean"
    };
    debugLog("GameTimeAutomation | Sync running state", state);
    if (!effectiveEnabled || !this.#canControlTime()) {
      this.#stopRealTimeTicker();
      return;
    }
    this.#startRealTimeTicker();
  }

  #startRealTimeTicker() {
    if (this.#tickerId !== null) return;
    this.#lastTickTimestamp = this.#currentTimestamp();
    this.#tickerId = globalThis.setInterval(() => this.#tickRealTime(), 1000);
    debugLog("GameTimeAutomation | Started real-time ticker");
  }

  #stopRealTimeTicker() {
    if (this.#tickerId !== null) {
      globalThis.clearInterval(this.#tickerId);
      this.#tickerId = null;
      debugLog("GameTimeAutomation | Stopped real-time ticker");
    }
    this.#lastTickTimestamp = null;
    this.#queuedDelta = 0;
    this.#lastTickIdle = false;
  }

  #tickRealTime() {
    if (!this.#enabled || !this.#sceneAllowsRealTime || !this.#canControlTime()) {
      this.#stopRealTimeTicker();
      return;
    }

    const now = this.#currentTimestamp();
    if (typeof now !== "number" || !Number.isFinite(now)) return;

    const last = this.#lastTickTimestamp ?? now;
    const deltaSeconds = (now - last) / 1000;
    this.#lastTickTimestamp = now;

    if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) return;

    const paused = Boolean(game?.paused);
    const combatRunning = this.#isCombatRunning();
    if (paused || combatRunning) {
      if (!this.#lastTickIdle) {
        debugLog("GameTimeAutomation | Tick skipped", { paused, combatRunning });
      }
      this.#lastTickIdle = true;
      this.#queuedDelta = 0;
      return;
    }

    this.#lastTickIdle = false;
    debugLog("GameTimeAutomation | Real-time tick", { deltaSeconds });
    this.#queueAdvance(deltaSeconds);
  }

  #queueAdvance(deltaSeconds) {
    if (!this.#enabled || !this.#sceneAllowsRealTime) return;
    const numericDelta = Number(deltaSeconds);
    if (!Number.isFinite(numericDelta) || numericDelta <= 0) return;

    this.#queuedDelta += numericDelta;
    if (this.#advancePromise) return;

    this.#advancePromise = this.#flushAdvanceQueue();
  }

  async #flushAdvanceQueue() {
    while (this.#queuedDelta > 0) {
      if (
        !this.#enabled ||
        !this.#sceneAllowsRealTime ||
        game?.paused ||
        !this.#canControlTime() ||
        this.#isCombatRunning()
      ) {
        this.#queuedDelta = 0;
        break;
      }

      const delta = this.#queuedDelta;
      this.#queuedDelta = 0;

      try {
        if (typeof game?.time?.advance === "function") {
          debugLog("GameTimeAutomation | Advancing world time", { delta });
          await game.time.advance(delta);
          debugLog("GameTimeAutomation | World time advanced", {
            worldTime: game.time?.worldTime ?? null
          });
        } else {
          console.warn(`${MODULE_ID} | game.time.advance is unavailable; cannot manage world time.`);
          break;
        }
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to advance world time`, error);
        break;
      }
    }

    this.#advancePromise = null;
  }

  #handlePause = (paused, options = {}) => {
    debugLog("GameTimeAutomation | Pause state changed", {
      paused,
      userId: options?.userId ?? null,
      broadcast: options?.broadcast ?? null
    });
    this.#syncRunningState({ pausedOverride: paused });
  };

  #handleCombatStart = (combat) => {
    if (!combat?.id) return;
    this.#processedRounds.set(combat.id, Math.max(combat.round ?? 0, 1));
    debugLog("GameTimeAutomation | Combat started", { combatId: combat.id, round: combat.round ?? 0 });
    this.#syncRunningState();
  };

  #handleCombatRound = (combat, round) => {
    if (!combat?.id) return;

    const roundValue =
      typeof round === "number" && Number.isFinite(round)
        ? round
        : typeof combat.round === "number" && Number.isFinite(combat.round)
        ? combat.round
        : 0;

    const effectiveRound = roundValue > 0 ? roundValue : 1;
    const previous = this.#processedRounds.get(combat.id);
    const baseline = previous ? Math.max(previous, 1) : 1;
    const completedRounds = effectiveRound > 1 ? Math.max(effectiveRound - baseline, 0) : 0;

    debugLog("GameTimeAutomation | Combat round change detected", {
      combatId: combat.id,
      effectiveRound,
      completedRounds,
      enabled: this.#enabled,
      paused: game?.paused ?? null
    });

    if (
      completedRounds > 0 &&
      this.#enabled &&
      this.#sceneAllowsRealTime &&
      !game?.paused &&
      this.#canControlTime() &&
      this.#isCombatDocumentActive(combat)
    ) {
      const delta = completedRounds * this.#secondsPerRound;
      if (delta > 0) {
        debugLog("GameTimeAutomation | Advancing time for completed combat rounds", {
          combatId: combat.id,
          completedRounds,
          delta
        });
        this.#queueAdvance(delta);
      }
    }

    this.#processedRounds.set(combat.id, Math.max(effectiveRound, 1));
  };

  #handleCombatEnd = (combat) => {
    if (!combat?.id) return;
    this.#processedRounds.delete(combat.id);
    debugLog("GameTimeAutomation | Combat ended", { combatId: combat.id });
    this.#syncRunningState();
  };

  #handleCombatDelete = (combat) => {
    if (!combat?.id) return;
    this.#processedRounds.delete(combat.id);
    debugLog("GameTimeAutomation | Combat deleted", { combatId: combat.id });
    this.#syncRunningState();
  };

  #handleCombatUpdate = (combat, updateData) => {
    if (!combat?.id) return;

    if (typeof updateData?.round === "number" && Number.isFinite(updateData.round)) {
      const normalized = Math.max(updateData.round, 1);
      this.#processedRounds.set(combat.id, normalized);
      debugLog("GameTimeAutomation | Combat round manually updated", {
        combatId: combat.id,
        round: normalized
      });
    }

    if (Object.prototype.hasOwnProperty.call(updateData ?? {}, "active") || updateData?.round !== undefined) {
      this.#syncRunningState();
    }
  };

  #getActiveSceneDocument() {
    const scene = getActiveScene();
    return hasSceneDocument(scene) ? scene : null;
  }

  #isSceneRealTimeAllowed(scene) {
    if (!hasSceneDocument(scene)) return false;
    try {
      return Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_ALLOW_REAL_TIME));
    } catch (error) {
      debugLog("GameTimeAutomation | Failed to read scene real-time flag", {
        sceneId: scene?.id ?? null,
        message: error?.message ?? String(error)
      });
      return false;
    }
  }

  #refreshSceneAutomationState(scene) {
    const targetScene = hasSceneDocument(scene) ? scene : this.#getActiveSceneDocument();
    const allows = this.#isSceneRealTimeAllowed(targetScene);
    const previous = this.#sceneAllowsRealTime;
    this.#sceneAllowsRealTime = allows;
    if (previous !== allows) {
      debugLog("GameTimeAutomation | Scene real-time allowance changed", {
        sceneId: targetScene?.id ?? null,
        allows
      });
      return true;
    }
    return false;
  }

  #handleCanvasReady = (canvas) => {
    this.#refreshSceneAutomationState(canvas?.scene);
    this.#syncRunningState();
  };

  #handleSceneUpdate = (scene) => {
    if (!hasSceneDocument(scene)) return;
    const activeScene = this.#getActiveSceneDocument();
    if (!activeScene || activeScene.id !== scene.id) return;
    const changed = this.#refreshSceneAutomationState(scene);
    if (changed) {
      this.#syncRunningState();
    }
  };
}

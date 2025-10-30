import { ApplicationV2, HandlebarsApplicationMixin } from "../core/applications.js";
import {
  FLAG_TIME_TRIGGER_ALLOW_REAL_TIME,
  MODULE_ID,
  SECONDS_PER_DAY,
  TIME_DELTAS_MINUTES,
  TIME_FORMAT_24_HOUR
} from "../core/constants.js";
import { debugLog } from "../core/debug.js";
import { localize, parseTriggerTimeToSeconds } from "../core/utils.js";
import {
  formatCanonicalTime,
  formatTimeComponentsForDisplay,
  formatTimeParts,
  getConfiguredTimeFormat,
  parseCanonicalTimeString
} from "../core/time-format.js";
import { onManageTimeSettingChange, onTimeFormatSettingChange } from "../core/settings.js";

export default class TimeTriggerWindow extends HandlebarsApplicationMixin(ApplicationV2) {
  #timeFormatCleanup = null;
  #manageTimeCleanup = null;

  constructor(options = {}) {
    const { scene, showControls, ...appOptions } = options ?? {};
    super(appOptions);
    this.scene = scene ?? null;
    this.showControls =
      typeof showControls === "boolean" ? showControls : Boolean(game.user?.isGM);
    this.isEditingTime = false;
    this.editValue = "";
    this._commitTimeInProgress = false;
    this._suppressBlurCommit = false;
    this.manageTimeEnabled = false;
    this.sceneAllowsRealTime = this.#readSceneRealTimeFlag();
    this.#timeFormatCleanup = onTimeFormatSettingChange(this.#handleTimeFormatChange);
    this.#manageTimeCleanup = onManageTimeSettingChange(this.#handleManageTimeChange);
  }

  static DEFAULT_OPTIONS = foundry.utils.mergeObject(
    super.DEFAULT_OPTIONS,
    {
      id: `${MODULE_ID}-time-trigger`,
      window: {
        title: localize("EIDOLON.TimeTrigger.Title", "Time Trigger"),
        resizable: false
      },
      position: {
        width: "auto",
        height: "auto"
      }
    },
    { inplace: false }
  );

  static PARTS = {
    content: {
      template: `modules/${MODULE_ID}/templates/time-trigger.html`
    }
  };

  async _prepareContext() {
    const components = game.time?.components ?? {};
    const hasComponentSeconds =
      components?.second !== undefined && components?.second !== null;
    const formattedTime =
      (hasComponentSeconds
        ? formatTimeComponentsForDisplay(components)
        : null) ?? this.#formatFallbackTime();
    const timeFormat = getConfiguredTimeFormat();
    const is24Hour = timeFormat === TIME_FORMAT_24_HOUR;
    const editPlaceholder = is24Hour
      ? localize("EIDOLON.TimeTrigger.EditTimePlaceholder24", "HH:MM")
      : localize("EIDOLON.TimeTrigger.EditTimePlaceholder12", "HH:MM AM/PM");
    const editHint = this.showControls
      ? localize(
          "EIDOLON.TimeTrigger.EditTimeHint",
          "Double-click to set a specific time."
        )
      : "";
    const editLabel = this.showControls
      ? localize(
          "EIDOLON.TimeTrigger.EditTimeLabel",
          "New time (HH:MM or HH:MM AM/PM)"
        )
      : "";

    const deltas = TIME_DELTAS_MINUTES.map((minutes) => ({
      minutes,
      label: minutes > 0 ? `+${minutes}` : `${minutes}`
    }));

    const manageTimeEnabled = Boolean(this.manageTimeEnabled);
    const sceneAllowsRealTime = this.#readSceneRealTimeFlag();
    this.sceneAllowsRealTime = sceneAllowsRealTime;
    const realTimeEnableLabel = localize(
      "EIDOLON.TimeTrigger.SceneRealTimeEnable",
      "Enable automatic real-time flow for this scene."
    );
    const realTimeDisableLabel = localize(
      "EIDOLON.TimeTrigger.SceneRealTimeDisable",
      "Disable automatic real-time flow for this scene."
    );
    const realTimeManageDisabledLabel = localize(
      "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
      "Enable Manage Time in module settings to allow automatic real-time flow."
    );
    const realTimeButtonLabel = manageTimeEnabled
      ? sceneAllowsRealTime
        ? realTimeDisableLabel
        : realTimeEnableLabel
      : realTimeManageDisabledLabel;

    return {
      formattedTime,
      deltas,
      manageTimeEnabled,
      sceneAllowsRealTime,
      realTimeButtonLabel,
      isGM: game.user?.isGM ?? false,
      showControls: Boolean(this.showControls),
      editHint,
      editLabel,
      editPlaceholder,
      timeFormat,
      is24Hour,
      isEditingTime: Boolean(this.isEditingTime),
      editValue: this.isEditingTime ? this.editValue ?? "" : ""
    };
  }

  async close(options = {}) {
    if (!options.force) {
      const isRendered = this.rendered ?? this.isRendered ?? false;
      if (!isRendered) {
        debugLog("TimeTriggerWindow close request rerendering", {
          sceneId: this.scene?.id ?? null
        });
        this.render({ force: true });
      }
      return this;
    }

    debugLog("Closing time trigger window", { sceneId: this.scene?.id ?? null, force: true });
    const result = await super.close(options);
    this.#disposeTimeFormatSubscription();
    this.#disposeManageTimeSubscription();
    return result;
  }

  async _advanceTime(minutes) {
    const seconds = minutes * 60;
    debugLog("Advancing world time", { sceneId: this.scene?.id ?? null, minutes, seconds });
    if (!game.user?.isGM) {
      ui.notifications?.warn?.(localize("EIDOLON.TimeTrigger.GMOnly", "Only the GM can adjust time."));
      return;
    }

    try {
      await game.time.advance(seconds);
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to advance time`, error);
      ui.notifications?.error?.(
        localize("EIDOLON.TimeTrigger.Error", "Failed to update the world time.")
      );
      debugLog("Failed to advance time from window", {
        sceneId: this.scene?.id ?? null,
        minutes,
        message: error?.message ?? String(error)
      });
    }
  }

  #formatFallbackTime() {
    const worldTime = game.time?.worldTime;
    if (typeof worldTime !== "number" || !Number.isFinite(worldTime)) return "";

    const secondsPerDay = 24 * 60 * 60;
    const normalizedSeconds =
      ((Math.floor(worldTime) % secondsPerDay) + secondsPerDay) % secondsPerDay;
    const hours = Math.floor(normalizedSeconds / 3600);
    const minutes = Math.floor((normalizedSeconds % 3600) / 60);
    const seconds = normalizedSeconds % 60;

    return formatTimeParts({ hours, minutes, seconds }, getConfiguredTimeFormat());
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const element = this.element;
    if (!element) return;
    if (this.showControls) {
      debugLog("Binding time trigger interactions", {
        sceneId: this.scene?.id ?? null,
        buttonCount: element.querySelectorAll("[data-delta]").length
      });
      element.querySelectorAll("[data-delta]").forEach((button) => {
        button.addEventListener("click", this.#onDeltaClick);
      });

      const timeValue = element.querySelector(".time-trigger-window__time-value[data-editable=\"true\"]");
      if (timeValue) {
        timeValue.addEventListener("dblclick", this.#onTimeDoubleClick, { once: false });
      }

      const timeInput = element.querySelector(".time-trigger-window__time-input");
      if (timeInput) {
        timeInput.addEventListener("keydown", this.#onTimeInputKeydown);
        timeInput.addEventListener("blur", this.#onTimeInputBlur);
        if (typeof timeInput.focus === "function") {
          timeInput.focus();
          if (typeof timeInput.select === "function") {
            timeInput.select();
          }
        }
      }

      const realTimeToggle = element.querySelector('[data-action="toggle-real-time"]');
      if (realTimeToggle) {
        realTimeToggle.addEventListener("click", this.#onRealTimeToggleClick);
      }
    }
    this._suppressBlurCommit = false;
  }

  #onDeltaClick = (event) => {
    event.preventDefault();
    const delta = Number(event.currentTarget?.dataset?.delta);
    if (!Number.isFinite(delta)) return;
    debugLog("Time delta button clicked", { delta });
    this._advanceTime(delta);
  };

  #onTimeDoubleClick = (event) => {
    event.preventDefault();
    if (!this.showControls || !game.user?.isGM) return;
    debugLog("Time value double clicked", { sceneId: this.scene?.id ?? null });
    this.#enterTimeEditMode();
  };

  #enterTimeEditMode() {
    if (!game.user?.isGM) return;
    this.isEditingTime = true;
    this._suppressBlurCommit = false;
    this.editValue = this.#getInitialEditValue();
    this.render({ force: true });
  }

  #cancelTimeEdit() {
    this.isEditingTime = false;
    this.editValue = "";
    this._suppressBlurCommit = false;
    this.render({ force: true });
  }

  async #commitTimeInput(rawValue) {
    if (!game.user?.isGM) return;
    if (!this.isEditingTime) return;
    if (this._commitTimeInProgress) return;
    this._commitTimeInProgress = true;
    const value = typeof rawValue === "string" ? rawValue.trim() : "";
    if (!value) {
      this.#cancelTimeEdit();
      this._commitTimeInProgress = false;
      return;
    }

    const parsed = this.#parseInputTime(value);
    if (parsed.error) {
      ui.notifications?.error?.(parsed.error);
      this._suppressBlurCommit = true;
      this.editValue = value;
      this.render({ force: true });
      this._commitTimeInProgress = false;
      return;
    }
    try {
      const success = await this.#applyTargetSeconds(parsed.seconds, parsed.includeSeconds);
      if (success) {
        this.isEditingTime = false;
        this.editValue = "";
        this.render({ force: true });
      } else {
        this.editValue = value;
        this.render({ force: true });
      }
    } finally {
      this._commitTimeInProgress = false;
    }
  }

  #onTimeInputKeydown = (event) => {
    if (!this.isEditingTime) return;
    if (this._commitTimeInProgress) return;
    if (event.key === "Enter") {
      event.preventDefault();
      const input = event.currentTarget;
      const value = typeof input?.value === "string" ? input.value : "";
      void this.#commitTimeInput(value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      this.#cancelTimeEdit();
    }
  };

  #onTimeInputBlur = (event) => {
    if (!this.isEditingTime) return;
    if (this._commitTimeInProgress) return;
    if (this._suppressBlurCommit) return;
    const input = event.currentTarget;
    const value = typeof input?.value === "string" ? input.value : "";
    void this.#commitTimeInput(value);
  };

  #getCurrentCanonicalTime() {
    const worldTime = game.time?.worldTime;
    if (typeof worldTime !== "number" || !Number.isFinite(worldTime)) {
      return "";
    }

    const currentComponents = game.time?.components ?? {};
    const currentHours = Number(currentComponents.hour);
    const currentMinutes = Number(currentComponents.minute);
    const currentSeconds =
      currentComponents.second !== undefined ? Number(currentComponents.second) : null;
    const includeSeconds = Number.isInteger(currentSeconds);

    const currentCanonical =
      Number.isFinite(currentHours) && Number.isFinite(currentMinutes)
        ? formatCanonicalTime({
            hours: Math.max(0, Math.min(23, Number(currentHours))),
            minutes: Math.max(0, Math.min(59, Number(currentMinutes))),
            seconds:
              includeSeconds && Number.isFinite(currentSeconds)
                ? Math.max(0, Math.min(59, Number(currentSeconds)))
                : undefined
          }) ?? ""
        : "";

    return currentCanonical ?? "";
  }

  async #applyTargetSeconds(targetSeconds, includeSeconds) {
    const worldTime = game.time?.worldTime;
    if (typeof worldTime !== "number" || !Number.isFinite(worldTime)) {
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.EditTimeUnavailable",
          "The world time is unavailable, so it can't be updated."
        )
      );
      return false;
    }

    if (!Number.isInteger(targetSeconds) || targetSeconds < 0 || targetSeconds >= SECONDS_PER_DAY) {
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.EditTimeInvalidRange",
          "Enter a time within the current day."
        )
      );
      return false;
    }

    const currentDay = Math.floor(worldTime / SECONDS_PER_DAY);
    const targetWorldTime = currentDay * SECONDS_PER_DAY + targetSeconds;
    const diff = targetWorldTime - worldTime;

    if (!Number.isFinite(diff) || diff === 0) {
      return true;
    }

    const hours = Math.floor(targetSeconds / 3600);
    const minutes = Math.floor((targetSeconds % 3600) / 60);
    const seconds = targetSeconds % 60;
    const canonical = formatCanonicalTime({
      hours,
      minutes,
      seconds: includeSeconds ? seconds : undefined
    });

    try {
      debugLog("Updating world time directly", {
        sceneId: this.scene?.id ?? null,
        targetCanonical: canonical ?? null,
        diff
      });
      await game.time.advance(diff);
      const formatted = formatTimeParts(
        {
          hours,
          minutes,
          seconds: includeSeconds ? seconds : null
        },
        getConfiguredTimeFormat()
      );
      ui.notifications?.info?.(
        localize(
          "EIDOLON.TimeTrigger.EditTimeSuccess",
          "World time updated."
        ) + (formatted ? ` ${formatted}` : "")
      );
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to set world time`, error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.EditTimeError",
          "Failed to update the world time."
        )
      );
      return false;
    }
    return true;
  }

  #parseInputTime(value) {
    const fallbackError = localize(
      "EIDOLON.TimeTrigger.EditTimeInvalid",
      "Enter a valid time like 14:30 or 2:30 PM."
    );
    if (typeof value !== "string") {
      return { error: fallbackError };
    }

    const trimmed = value.trim();
    if (!trimmed) {
      return { error: fallbackError };
    }

    const canonicalMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
    if (canonicalMatch) {
      const hours = Number(canonicalMatch[1]);
      const minutes = Number(canonicalMatch[2]);
      const seconds = canonicalMatch[3] !== undefined ? Number(canonicalMatch[3]) : undefined;

      if (
        Number.isInteger(hours) &&
        hours >= 0 &&
        hours <= 23 &&
        Number.isInteger(minutes) &&
        minutes >= 0 &&
        minutes <= 59 &&
        (seconds === undefined || (Number.isInteger(seconds) && seconds >= 0 && seconds <= 59))
      ) {
        const totalSeconds = hours * 3600 + minutes * 60 + (seconds ?? 0);
        return {
          canonical: formatCanonicalTime({ hours, minutes, seconds }),
          seconds: totalSeconds,
          includeSeconds: seconds !== undefined,
          error: null
        };
      }
      return { error: fallbackError };
    }

    const { amLower, pmLower, periodPattern } = this.#getPeriodMatchData();
    const periodMatch = trimmed.match(
      new RegExp(
        `^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\\s*(${periodPattern})$`,
        "i"
      )
    );
    if (periodMatch) {
      let hours = Number(periodMatch[1]);
      const minutes = Number(periodMatch[2]);
      const seconds = periodMatch[3] !== undefined ? Number(periodMatch[3]) : undefined;
      const periodRaw = periodMatch[4] ?? "";
      const periodLower =
        typeof periodRaw === "string"
          ? periodRaw.toLocaleLowerCase?.() ?? periodRaw.toLowerCase()
          : "";

      if (
        Number.isInteger(hours) &&
        hours >= 1 &&
        hours <= 12 &&
        Number.isInteger(minutes) &&
        minutes >= 0 &&
        minutes <= 59 &&
        (seconds === undefined || (Number.isInteger(seconds) && seconds >= 0 && seconds <= 59)) &&
        (periodLower === amLower ||
          periodLower === pmLower ||
          periodLower === "am" ||
          periodLower === "pm")
      ) {
        hours = hours % 12;
        const isPM = periodLower === pmLower || periodLower === "pm";
        if (isPM) hours += 12;
        const totalSeconds = hours * 3600 + minutes * 60 + (seconds ?? 0);
        return {
          canonical: formatCanonicalTime({ hours, minutes, seconds }),
          seconds: totalSeconds,
          includeSeconds: seconds !== undefined,
          error: null
        };
      }
      return { error: fallbackError };
    }

    const canonicalSeconds = parseTriggerTimeToSeconds(trimmed);
    if (canonicalSeconds !== null) {
      const hours = Math.floor(canonicalSeconds / 3600);
      const minutes = Math.floor((canonicalSeconds % 3600) / 60);
      const seconds = canonicalSeconds % 60;
      const includeSeconds = seconds !== 0;
      return {
        canonical: formatCanonicalTime({
          hours,
          minutes,
          seconds: includeSeconds ? seconds : undefined
        }),
        seconds: canonicalSeconds,
        includeSeconds,
        error: null
      };
    }

    return { error: fallbackError };
  }

  #getInitialEditValue() {
    const canonical = this.#getCurrentCanonicalTime();
    if (!canonical) return "";
    const format = getConfiguredTimeFormat();
    if (format === TIME_FORMAT_24_HOUR) {
      return canonical;
    }
    const components = parseCanonicalTimeString(canonical);
    if (!components) return canonical;
    const hours = Number(components.hours);
    const minutes = Number(components.minutes);
    const seconds =
      components.seconds !== null && components.seconds !== undefined
        ? Number(components.seconds)
        : undefined;
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return canonical;
    const includeSeconds = Number.isFinite(seconds);
    const hour12 = hours % 12 === 0 ? 12 : hours % 12;
    const minuteText = String(minutes).padStart(2, "0");
    const secondsText = includeSeconds ? `:${String(seconds).padStart(2, "0")}` : "";
    const { amLabel, pmLabel } = this.#getPeriodMatchData();
    const period = hours >= 12 ? pmLabel : amLabel;
    return `${hour12}:${minuteText}${secondsText} ${period}`.trim();
  }

  #getPeriodMatchData() {
    const am = localize("EIDOLON.TimeTrigger.TimePeriodAM", "AM");
    const pm = localize("EIDOLON.TimeTrigger.TimePeriodPM", "PM");
    const amLower = am.toLocaleLowerCase?.() ?? am.toLowerCase();
    const pmLower = pm.toLocaleLowerCase?.() ?? pm.toLowerCase();
    const escapedAm = this.#escapeForRegex(am);
    const escapedPm = this.#escapeForRegex(pm);
    const periodPattern = `${escapedAm}|${escapedPm}|AM|PM`;
    return {
      amLabel: am,
      pmLabel: pm,
      amLower,
      pmLower,
      periodPattern
    };
  }

  #escapeForRegex(value) {
    if (typeof value !== "string") return "";
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  #handleManageTimeChange = (value) => {
    const normalized = Boolean(value);
    if (this.manageTimeEnabled === normalized) return;
    this.manageTimeEnabled = normalized;
    const isRendered = this.rendered ?? this.isRendered ?? false;
    if (isRendered) {
      this.render({ force: true });
    }
  };

  #onRealTimeToggleClick = async (event) => {
    event.preventDefault();
    if (!this.showControls || !game.user?.isGM) return;

    if (!this.manageTimeEnabled) {
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.SceneRealTimeManageDisabled",
          "Enable Manage Time in module settings to allow automatic real-time flow."
        )
      );
      return;
    }

    const scene = this.scene;
    if (!scene || typeof scene.setFlag !== "function") {
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.SceneUnavailable",
          "The active scene is unavailable. Try again after reloading the world."
        )
      );
      return;
    }

    const target = !this.sceneAllowsRealTime;
    try {
      await scene.setFlag(MODULE_ID, FLAG_TIME_TRIGGER_ALLOW_REAL_TIME, target);
      this.sceneAllowsRealTime = target;
      const message = target
        ? localize(
            "EIDOLON.TimeTrigger.SceneRealTimeEnabled",
            "Automatic real-time flow enabled for this scene."
          )
        : localize(
            "EIDOLON.TimeTrigger.SceneRealTimeDisabled",
            "Automatic real-time flow disabled for this scene."
          );
      ui.notifications?.info?.(message);
    } catch (error) {
      console.error(`${MODULE_ID} | Failed to toggle scene real-time flow`, error);
      ui.notifications?.error?.(
        localize(
          "EIDOLON.TimeTrigger.SceneRealTimeToggleError",
          "Failed to update the scene's real-time flow setting."
        )
      );
    } finally {
      this.render({ force: true });
    }
  };

  #readSceneRealTimeFlag() {
    const scene = this.scene;
    if (!scene || typeof scene.getFlag !== "function") return false;
    try {
      return Boolean(scene.getFlag(MODULE_ID, FLAG_TIME_TRIGGER_ALLOW_REAL_TIME));
    } catch (error) {
      debugLog("TimeTriggerWindow | Failed to read scene real-time flag", {
        sceneId: scene?.id ?? null,
        message: error?.message ?? String(error)
      });
    }
    return false;
  }

  #handleTimeFormatChange = () => {
    const isRendered = this.rendered ?? this.isRendered ?? false;
    if (!isRendered) return;
    if (this.isEditingTime) {
      this.editValue = this.#getInitialEditValue();
    }
    this.render({ force: true });
  };

  #disposeTimeFormatSubscription() {
    if (typeof this.#timeFormatCleanup === "function") {
      try {
        this.#timeFormatCleanup();
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to dispose time format subscription`, error);
      }
    }
    this.#timeFormatCleanup = null;
  }

  #disposeManageTimeSubscription() {
    if (typeof this.#manageTimeCleanup === "function") {
      try {
        this.#manageTimeCleanup();
      } catch (error) {
        console.error(`${MODULE_ID} | Failed to dispose manage time subscription`, error);
      }
    }
    this.#manageTimeCleanup = null;
  }
}

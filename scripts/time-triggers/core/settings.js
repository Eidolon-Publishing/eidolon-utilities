import {
  DEFAULT_SECONDS_PER_ROUND,
  MODULE_ID,
  SETTING_DEBUG,
  SETTING_MANAGE_TIME,
  SETTING_SECONDS_PER_ROUND,
  SETTING_TIME_FORMAT,
  TIME_FORMAT_12_HOUR,
  TIME_FORMAT_24_HOUR
} from "./constants.js";
import { localize } from "./utils.js";

const debugChangeHandlers = new Set();
const manageTimeChangeHandlers = new Set();
const secondsPerRoundChangeHandlers = new Set();
const timeFormatChangeHandlers = new Set();
let cachedDebugValue = false;
let cachedManageTimeValue = false;
let cachedSecondsPerRoundValue = DEFAULT_SECONDS_PER_ROUND;
let cachedTimeFormatValue = TIME_FORMAT_12_HOUR;
let settingsRegistered = false;

function notifyDebugChange(value) {
  cachedDebugValue = Boolean(value);
  for (const handler of debugChangeHandlers) {
    try {
      handler(cachedDebugValue);
    } catch (error) {
      console.error(`${MODULE_ID} | Debug change handler failed`, error);
    }
  }
}

function notifyManageTimeChange(value) {
  cachedManageTimeValue = Boolean(value);
  for (const handler of manageTimeChangeHandlers) {
    try {
      handler(cachedManageTimeValue);
    } catch (error) {
      console.error(`${MODULE_ID} | Manage time change handler failed`, error);
    }
  }
}

function normalizeTimeFormatValue(value) {
  return value === TIME_FORMAT_24_HOUR ? TIME_FORMAT_24_HOUR : TIME_FORMAT_12_HOUR;
}

function normalizeSecondsPerRoundValue(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return DEFAULT_SECONDS_PER_ROUND;
  }
  return numeric;
}

function notifySecondsPerRoundChange(value) {
  const normalized = normalizeSecondsPerRoundValue(value);
  cachedSecondsPerRoundValue = normalized;
  for (const handler of secondsPerRoundChangeHandlers) {
    try {
      handler(normalized);
    } catch (error) {
      console.error(`${MODULE_ID} | Seconds-per-round change handler failed`, error);
    }
  }
}

function notifyTimeFormatChange(value) {
  const normalized = normalizeTimeFormatValue(value);
  cachedTimeFormatValue = normalized;
  for (const handler of timeFormatChangeHandlers) {
    try {
      handler(normalized);
    } catch (error) {
      console.error(`${MODULE_ID} | Time format change handler failed`, error);
    }
  }
}

export function registerTimeTriggerSettings() {
  if (settingsRegistered) return;
  settingsRegistered = true;

  if (!game?.settings?.register) {
    console.warn(
      `${MODULE_ID} | game.settings.register is unavailable. Module settings could not be registered.`
    );
    return;
  }

  const supportsRegisterChange = typeof game.settings.registerChange === "function";

  game.settings.register(MODULE_ID, SETTING_DEBUG, {
    name: localize("EIDOLON.TimeTrigger.DebugSettingName", "Enable debug logging"),
    hint: localize(
      "EIDOLON.TimeTrigger.DebugSettingHint",
      "Write detailed time-trigger diagnostics to the browser console."
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: supportsRegisterChange ? undefined : notifyDebugChange
  });

  if (supportsRegisterChange) {
    game.settings.registerChange(MODULE_ID, SETTING_DEBUG, notifyDebugChange);
  }

  cachedDebugValue = getDebugSetting();
  notifyDebugChange(cachedDebugValue);

  game.settings.register(MODULE_ID, SETTING_MANAGE_TIME, {
    name: localize("EIDOLON.TimeTrigger.ManageTimeSettingName", "Manage Game Time"),
    hint: localize(
      "EIDOLON.TimeTrigger.ManageTimeSettingHint",
      "Allow Eidolon Utilities to advance world time automatically while the game is unpaused. Warning: This may conflict with other time-management modules."
    ),
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: supportsRegisterChange ? undefined : notifyManageTimeChange
  });

  if (supportsRegisterChange) {
    game.settings.registerChange(MODULE_ID, SETTING_MANAGE_TIME, notifyManageTimeChange);
  }

  cachedManageTimeValue = getManageTimeSetting();
  notifyManageTimeChange(cachedManageTimeValue);

  game.settings.register(MODULE_ID, SETTING_SECONDS_PER_ROUND, {
    name: localize(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingName",
      "Seconds Per Combat Round"
    ),
    hint: localize(
      "EIDOLON.TimeTrigger.SecondsPerRoundSettingHint",
      "Amount of world seconds to add whenever a combat round ends while time management is active."
    ),
    scope: "world",
    config: true,
    type: Number,
    default: DEFAULT_SECONDS_PER_ROUND,
    range: { min: 1, max: 3600, step: 1 },
    onChange: supportsRegisterChange ? undefined : notifySecondsPerRoundChange
  });

  if (supportsRegisterChange) {
    game.settings.registerChange(
      MODULE_ID,
      SETTING_SECONDS_PER_ROUND,
      notifySecondsPerRoundChange
    );
  }

  cachedSecondsPerRoundValue = normalizeSecondsPerRoundValue(getSecondsPerRoundSetting());
  notifySecondsPerRoundChange(cachedSecondsPerRoundValue);

  game.settings.register(MODULE_ID, SETTING_TIME_FORMAT, {
    name: localize("EIDOLON.TimeTrigger.TimeFormatSettingName", "Trigger Time Format"),
    hint: localize(
      "EIDOLON.TimeTrigger.TimeFormatSettingHint",
      "Control whether trigger times use a 12-hour or 24-hour clock."
    ),
    scope: "world",
    config: true,
    type: String,
    choices: {
      [TIME_FORMAT_12_HOUR]: localize(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice12Hour",
        "12-hour (e.g. 2:30 PM)"
      ),
      [TIME_FORMAT_24_HOUR]: localize(
        "EIDOLON.TimeTrigger.TimeFormatSettingChoice24Hour",
        "24-hour (e.g. 14:30)"
      )
    },
    default: TIME_FORMAT_12_HOUR,
    onChange: supportsRegisterChange ? undefined : notifyTimeFormatChange
  });

  if (supportsRegisterChange) {
    game.settings.registerChange(MODULE_ID, SETTING_TIME_FORMAT, notifyTimeFormatChange);
  }

  cachedTimeFormatValue = normalizeTimeFormatValue(getTimeFormatSetting());
  notifyTimeFormatChange(cachedTimeFormatValue);
}

export function getDebugSetting() {
  try {
    if (game?.settings?.get) {
      return Boolean(game.settings.get(MODULE_ID, SETTING_DEBUG));
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to read debug setting`, error);
  }
  return false;
}

export function refreshDebugSettingCache() {
  cachedDebugValue = getDebugSetting();
  return cachedDebugValue;
}

export function getManageTimeSetting() {
  try {
    if (game?.settings?.get) {
      return Boolean(game.settings.get(MODULE_ID, SETTING_MANAGE_TIME));
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to read manage time setting`, error);
  }
  return false;
}

export function getTimeFormatSetting() {
  try {
    if (game?.settings?.get) {
      const value = game.settings.get(MODULE_ID, SETTING_TIME_FORMAT);
      return value === TIME_FORMAT_24_HOUR ? TIME_FORMAT_24_HOUR : TIME_FORMAT_12_HOUR;
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to read time format setting`, error);
  }
  return TIME_FORMAT_12_HOUR;
}

export function getSecondsPerRoundSetting() {
  try {
    if (game?.settings?.get) {
      const value = game.settings.get(MODULE_ID, SETTING_SECONDS_PER_ROUND);
      return normalizeSecondsPerRoundValue(value);
    }
  } catch (error) {
    console.error(`${MODULE_ID} | Failed to read seconds-per-round setting`, error);
  }
  return DEFAULT_SECONDS_PER_ROUND;
}

export function onDebugSettingChange(handler) {
  if (typeof handler !== "function") {
    return () => {};
  }

  debugChangeHandlers.add(handler);
  try {
    handler(cachedDebugValue);
  } catch (error) {
    console.error(`${MODULE_ID} | Debug change handler failed`, error);
  }

  return () => {
    debugChangeHandlers.delete(handler);
  };
}

export function onManageTimeSettingChange(handler) {
  if (typeof handler !== "function") {
    return () => {};
  }

  manageTimeChangeHandlers.add(handler);
  try {
    handler(cachedManageTimeValue);
  } catch (error) {
    console.error(`${MODULE_ID} | Manage time change handler failed`, error);
  }

  return () => {
    manageTimeChangeHandlers.delete(handler);
  };
}

export function onTimeFormatSettingChange(handler) {
  if (typeof handler !== "function") {
    return () => {};
  }

  timeFormatChangeHandlers.add(handler);
  try {
    handler(cachedTimeFormatValue);
  } catch (error) {
    console.error(`${MODULE_ID} | Time format change handler failed`, error);
  }

  return () => {
    timeFormatChangeHandlers.delete(handler);
  };
}

export function onSecondsPerRoundSettingChange(handler) {
  if (typeof handler !== "function") {
    return () => {};
  }

  secondsPerRoundChangeHandlers.add(handler);
  try {
    handler(cachedSecondsPerRoundValue);
  } catch (error) {
    console.error(`${MODULE_ID} | Seconds-per-round change handler failed`, error);
  }

  return () => {
    secondsPerRoundChangeHandlers.delete(handler);
  };
}

import { MODULE_ID } from "./constants.js";
import { getDebugSetting, onDebugSettingChange, refreshDebugSettingCache } from "./settings.js";

let debugEnabled = false;
let initialized = false;
let unsubscribe = null;

function updateDebugState(value) {
  debugEnabled = Boolean(value);
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  updateDebugState(getDebugSetting());
  unsubscribe = onDebugSettingChange((value) => {
    updateDebugState(value);
    console.info(`${MODULE_ID} | Debug ${debugEnabled ? "enabled" : "disabled"}`);
  });
}

function shouldLog() {
  if (!initialized) {
    ensureInitialized();
  }
  return debugEnabled;
}

function formatArgs(args) {
  if (!args.length) {
    return [`${MODULE_ID} |`];
  }

  const [first, ...rest] = args;
  if (typeof first === "string") {
    return [`${MODULE_ID} | ${first}`, ...rest];
  }
  return [`${MODULE_ID} |`, first, ...rest];
}

export function initializeDebug() {
  ensureInitialized();
}

export function disposeDebug() {
  if (typeof unsubscribe === "function") {
    unsubscribe();
  }
  unsubscribe = null;
  initialized = false;
  debugEnabled = false;
}

export function syncDebugState() {
  updateDebugState(refreshDebugSettingCache());
  return debugEnabled;
}

export function debugLog(...args) {
  if (!shouldLog()) return;
  console.debug(...formatArgs(args));
}

export function debugGroup(...args) {
  if (!shouldLog()) return;
  console.group(...formatArgs(args));
}

export function debugGroupEnd() {
  if (!shouldLog()) return;
  console.groupEnd();
}

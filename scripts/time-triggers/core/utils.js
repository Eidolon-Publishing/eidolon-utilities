export function localize(key, fallback) {
  if (game.i18n?.has?.(key)) {
    return game.i18n.localize(key);
  }
  return fallback;
}

export function escapeHtml(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function duplicateData(data) {
  if (data === undefined || data === null) return data;
  if (foundry?.utils?.duplicate) {
    return foundry.utils.duplicate(data);
  }
  return JSON.parse(JSON.stringify(data));
}

export function generateTriggerId() {
  if (foundry?.utils?.randomID) return foundry.utils.randomID();
  if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
}

export function parseTriggerTimeToSeconds(timeText) {
  if (typeof timeText !== "string") return null;
  const trimmed = timeText.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] !== undefined ? Number(match[3]) : 0;

  if (!Number.isInteger(hours) || !Number.isInteger(minutes) || !Number.isInteger(seconds)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;
  if (seconds < 0 || seconds > 59) return null;

  return hours * 3600 + minutes * 60 + seconds;
}

export function formatTimeComponents(components) {
  if (!components || typeof components !== "object") return null;

  const hours = Number(components.hour);
  const minutes = Number(components.minute);
  const seconds = Number(components.second);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  const parts = [String(hours).padStart(2, "0"), String(minutes).padStart(2, "0")];
  if (Number.isFinite(seconds)) {
    parts.push(String(seconds).padStart(2, "0"));
  }

  return parts.join(":");
}

export function formatFallbackTime() {
  const worldTime = game.time?.worldTime;
  if (typeof worldTime !== "number") return "";

  const date = new Date(worldTime * 1000);
  return date.toISOString().slice(11, 19);
}

export function getActiveScene() {
  return game.scenes?.current ?? game.scenes?.active ?? null;
}

export function getSceneFromApplication(app) {
  return app?.object ?? app?.document ?? null;
}

export function hasSceneDocument(scene) {
  return scene && typeof scene.getFlag === "function" && typeof scene.setFlag === "function";
}

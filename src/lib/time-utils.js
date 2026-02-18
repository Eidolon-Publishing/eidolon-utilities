// Pure utility functions (no Foundry globals)

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {*} value - Value to escape
 * @returns {string} Escaped string, or empty string for non-strings
 */
export function escapeHtml(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Parses a time string (HH:MM or HH:MM:SS) to seconds since midnight.
 * @param {string} timeText - Time string in HH:MM or HH:MM:SS format
 * @returns {number|null} Seconds since midnight (0-86399), or null if invalid
 */
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

/**
 * Parses a canonical time string to its component parts.
 * @param {string} timeText - Time string in HH:MM or HH:MM:SS format
 * @returns {{hours: number, minutes: number, seconds: number|null}|null} Parsed parts, or null if invalid
 */
export function parseCanonicalTimeString(timeText) {
  if (typeof timeText !== "string") return null;
  const trimmed = timeText.trim();
  if (!trimmed) return null;

  const match = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = match[3] !== undefined ? Number(match[3]) : null;

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;

  if (seconds !== null) {
    if (!Number.isInteger(seconds)) return null;
    if (seconds < 0 || seconds > 59) return null;
  }

  return { hours, minutes, seconds };
}

/**
 * Formats time parts to a canonical time string.
 * @param {{hours: number, minutes: number, seconds?: number}} parts - Time components
 * @returns {string|null} Formatted time string (HH:MM or HH:MM:SS), or null if invalid
 */
export function formatCanonicalTime({ hours, minutes, seconds }) {
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (hours < 0 || hours > 23) return null;
  if (minutes < 0 || minutes > 59) return null;

  const hourText = String(hours).padStart(2, "0");
  const minuteText = String(minutes).padStart(2, "0");

  if (Number.isInteger(seconds)) {
    if (seconds < 0 || seconds > 59) return null;
    const secondText = String(seconds).padStart(2, "0");
    return `${hourText}:${minuteText}:${secondText}`;
  }

  return `${hourText}:${minuteText}`;
}

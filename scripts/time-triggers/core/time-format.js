import {
  TIME_FORMAT_12_HOUR,
  TIME_FORMAT_24_HOUR
} from "./constants.js";
import { getTimeFormatSetting } from "./settings.js";
import { localize } from "./utils.js";

const AM_VALUE = "AM";
const PM_VALUE = "PM";

export function getConfiguredTimeFormat() {
  return getTimeFormatSetting();
}

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

  return {
    hours,
    minutes,
    seconds
  };
}

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

export function formatTimeComponentsForDisplay(components, { format } = {}) {
  if (!components || typeof components !== "object") return null;

  const hours = Number(components.hour);
  const minutes = Number(components.minute);
  const hasSeconds = components.second !== undefined && components.second !== null;
  const seconds = hasSeconds ? Number(components.second) : null;
  const normalizedSeconds =
    hasSeconds && Number.isFinite(seconds) ? Math.floor(Math.max(0, Math.min(59, seconds))) : null;

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  const resolvedFormat = format ?? getConfiguredTimeFormat();
  return formatTimeParts(
    {
      hours,
      minutes,
      seconds: normalizedSeconds
    },
    resolvedFormat
  );
}

export function formatTriggerTimeForDisplay(timeText, { format } = {}) {
  const parts = parseCanonicalTimeString(timeText);
  if (!parts) return "";

  const resolvedFormat = format ?? getConfiguredTimeFormat();
  return formatTimeParts(parts, resolvedFormat);
}

export function formatTimeParts(parts, format = TIME_FORMAT_12_HOUR) {
  if (!parts) return "";
  const { hours, minutes, seconds = null } = parts;
  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return "";

  const includeSeconds = Number.isInteger(seconds);
  if (format === TIME_FORMAT_24_HOUR) {
    const base = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    if (includeSeconds) {
      return `${base}:${String(seconds).padStart(2, "0")}`;
    }
    return base;
  }

  const period = hours >= 12 ? PM_VALUE : AM_VALUE;
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const baseHour = String(hour12);
  const baseMinute = String(minutes).padStart(2, "0");
  const base = `${baseHour}:${baseMinute}`;
  const label = period === AM_VALUE
    ? localize("EIDOLON.TimeTrigger.TimePeriodAM", AM_VALUE)
    : localize("EIDOLON.TimeTrigger.TimePeriodPM", PM_VALUE);

  if (includeSeconds) {
    const secondsText = String(seconds).padStart(2, "0");
    return `${base}:${secondsText} ${label}`;
  }
  return `${base} ${label}`;
}

export function getTimeFormValues(timeText, format = getConfiguredTimeFormat()) {
  const canonical = parseCanonicalTimeString(timeText);
  if (format === TIME_FORMAT_24_HOUR) {
    return {
      format,
      canonical: canonical ? formatCanonicalTime(canonical) ?? "" : "",
      hour: canonical ? String(canonical.hours).padStart(2, "0") : "",
      minute: canonical ? String(canonical.minutes).padStart(2, "0") : ""
    };
  }

  if (!canonical) {
    return {
      format,
      canonical: "",
      hour: "",
      minute: "",
      period: AM_VALUE
    };
  }

  const period = canonical.hours >= 12 ? PM_VALUE : AM_VALUE;
  const hour12 = canonical.hours % 12 === 0 ? 12 : canonical.hours % 12;

  return {
    format,
    canonical: formatCanonicalTime(canonical) ?? "",
    hour: String(hour12),
    minute: String(canonical.minutes).padStart(2, "0"),
    period
  };
}

export function normalizeFormTimeInput(
  { hour, minute, period, time },
  format = getConfiguredTimeFormat()
) {
  if (format === TIME_FORMAT_24_HOUR) {
    const resolvedHour = typeof hour === "string" ? hour.trim() : "";
    const resolvedMinute = typeof minute === "string" ? minute.trim() : "";
    const fallbackValue = typeof time === "string" ? time.trim() : "";

    if (!resolvedHour && !resolvedMinute && fallbackValue) {
      const parts = parseCanonicalTimeString(fallbackValue);
      if (!parts) {
        return {
          canonical: "",
          error: localize(
            "EIDOLON.TimeTrigger.TimeFormatInvalid24",
            "Enter a valid time in HH:MM format."
          )
        };
      }
      return { canonical: formatCanonicalTime(parts) ?? "", error: null };
    }

    if (!resolvedHour || !resolvedMinute) {
      return {
        canonical: "",
        error: localize("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.")
      };
    }

    const numericHour = Number(resolvedHour);
    const numericMinute = Number(resolvedMinute);

    if (!Number.isInteger(numericHour) || numericHour < 0 || numericHour > 23) {
      return {
        canonical: "",
        error: localize(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }

    if (!Number.isInteger(numericMinute) || numericMinute < 0 || numericMinute > 59) {
      return {
        canonical: "",
        error: localize(
          "EIDOLON.TimeTrigger.TimeFormatInvalid24",
          "Enter a valid time in HH:MM format."
        )
      };
    }

    const canonicalParts = {
      hours: numericHour,
      minutes: numericMinute
    };

    return { canonical: formatCanonicalTime(canonicalParts) ?? "", error: null };
  }

  const resolvedHour = typeof hour === "string" ? hour.trim() : "";
  const resolvedMinute = typeof minute === "string" ? minute.trim() : "";
  const resolvedPeriod = typeof period === "string" ? period.trim().toUpperCase() : "";

  if (!resolvedHour || !resolvedMinute || !resolvedPeriod) {
    return { canonical: "", error: localize("EIDOLON.TimeTrigger.TimeFormatMissing", "Enter a complete time.") };
  }

  if (resolvedPeriod !== AM_VALUE && resolvedPeriod !== PM_VALUE) {
    return { canonical: "", error: localize("EIDOLON.TimeTrigger.TimeFormatInvalidPeriod", "Select AM or PM.") };
  }

  const numericHour = Number(resolvedHour);
  const numericMinute = Number(resolvedMinute);

  if (!Number.isInteger(numericHour) || numericHour < 1 || numericHour > 12) {
    return {
      canonical: "",
      error: localize("EIDOLON.TimeTrigger.TimeFormatInvalidHour", "Hours must be between 1 and 12.")
    };
  }

  if (!Number.isInteger(numericMinute) || numericMinute < 0 || numericMinute > 59) {
    return {
      canonical: "",
      error: localize("EIDOLON.TimeTrigger.TimeFormatInvalidMinute", "Minutes must be between 00 and 59.")
    };
  }

  const baseHour = numericHour % 12;
  const hour24 = resolvedPeriod === PM_VALUE ? baseHour + 12 : baseHour;
  const canonicalParts = {
    hours: hour24,
    minutes: numericMinute
  };

  return {
    canonical: formatCanonicalTime(canonicalParts) ?? "",
    error: null
  };
}

export function getPeriodOptions() {
  return [
    {
      value: AM_VALUE,
      label: localize("EIDOLON.TimeTrigger.TimePeriodAM", AM_VALUE)
    },
    {
      value: PM_VALUE,
      label: localize("EIDOLON.TimeTrigger.TimePeriodPM", PM_VALUE)
    }
  ];
}

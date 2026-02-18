import { describe, it, expect } from "vitest";
import {
  escapeHtml,
  parseTriggerTimeToSeconds,
  parseCanonicalTimeString,
  formatCanonicalTime
} from "../lib/time-utils.js";

describe("escapeHtml", () => {
  it("escapes HTML entities", () => {
    expect(escapeHtml("<script>alert('xss')</script>"))
      .toBe("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;");
  });

  it("escapes ampersands", () => {
    expect(escapeHtml("foo & bar")).toBe("foo &amp; bar");
  });

  it("escapes quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;");
  });

  it("returns empty string for non-string", () => {
    expect(escapeHtml(null)).toBe("");
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml(123)).toBe("");
    expect(escapeHtml({})).toBe("");
  });

  it("handles empty string", () => {
    expect(escapeHtml("")).toBe("");
  });
});

describe("parseTriggerTimeToSeconds", () => {
  it("parses HH:MM format", () => {
    expect(parseTriggerTimeToSeconds("00:00")).toBe(0);
    expect(parseTriggerTimeToSeconds("01:00")).toBe(3600);
    expect(parseTriggerTimeToSeconds("12:30")).toBe(45000);
    expect(parseTriggerTimeToSeconds("23:59")).toBe(86340);
  });

  it("parses HH:MM:SS format", () => {
    expect(parseTriggerTimeToSeconds("00:00:00")).toBe(0);
    expect(parseTriggerTimeToSeconds("00:00:30")).toBe(30);
    expect(parseTriggerTimeToSeconds("12:30:45")).toBe(45045);
    expect(parseTriggerTimeToSeconds("23:59:59")).toBe(86399);
  });

  it("handles single-digit hours", () => {
    expect(parseTriggerTimeToSeconds("8:30")).toBe(30600);
    expect(parseTriggerTimeToSeconds("9:05:30")).toBe(32730);
  });

  it("trims whitespace", () => {
    expect(parseTriggerTimeToSeconds("  12:30  ")).toBe(45000);
  });

  it("returns null for invalid input", () => {
    expect(parseTriggerTimeToSeconds("invalid")).toBe(null);
    expect(parseTriggerTimeToSeconds("25:00")).toBe(null);
    expect(parseTriggerTimeToSeconds("12:60")).toBe(null);
    expect(parseTriggerTimeToSeconds("12:30:60")).toBe(null);
    expect(parseTriggerTimeToSeconds("-1:00")).toBe(null);
    expect(parseTriggerTimeToSeconds("")).toBe(null);
    expect(parseTriggerTimeToSeconds(null)).toBe(null);
    expect(parseTriggerTimeToSeconds(undefined)).toBe(null);
    expect(parseTriggerTimeToSeconds(12345)).toBe(null);
  });
});

describe("parseCanonicalTimeString", () => {
  it("parses time strings to parts without seconds", () => {
    expect(parseCanonicalTimeString("12:30")).toEqual({ hours: 12, minutes: 30, seconds: null });
    expect(parseCanonicalTimeString("00:00")).toEqual({ hours: 0, minutes: 0, seconds: null });
    expect(parseCanonicalTimeString("23:59")).toEqual({ hours: 23, minutes: 59, seconds: null });
  });

  it("parses time strings to parts with seconds", () => {
    expect(parseCanonicalTimeString("08:05:30")).toEqual({ hours: 8, minutes: 5, seconds: 30 });
    expect(parseCanonicalTimeString("00:00:00")).toEqual({ hours: 0, minutes: 0, seconds: 0 });
    expect(parseCanonicalTimeString("23:59:59")).toEqual({ hours: 23, minutes: 59, seconds: 59 });
  });

  it("returns null for invalid input", () => {
    expect(parseCanonicalTimeString("invalid")).toBe(null);
    expect(parseCanonicalTimeString("25:00")).toBe(null);
    expect(parseCanonicalTimeString("")).toBe(null);
    expect(parseCanonicalTimeString(null)).toBe(null);
  });
});

describe("formatCanonicalTime", () => {
  it("formats time parts to string without seconds", () => {
    expect(formatCanonicalTime({ hours: 8, minutes: 5 })).toBe("08:05");
    expect(formatCanonicalTime({ hours: 0, minutes: 0 })).toBe("00:00");
    expect(formatCanonicalTime({ hours: 23, minutes: 59 })).toBe("23:59");
  });

  it("formats time parts to string with seconds", () => {
    expect(formatCanonicalTime({ hours: 12, minutes: 30, seconds: 45 })).toBe("12:30:45");
    expect(formatCanonicalTime({ hours: 0, minutes: 0, seconds: 0 })).toBe("00:00:00");
  });

  it("pads single digits", () => {
    expect(formatCanonicalTime({ hours: 1, minutes: 2, seconds: 3 })).toBe("01:02:03");
  });

  it("returns null for invalid input", () => {
    expect(formatCanonicalTime({ hours: 25, minutes: 0 })).toBe(null);
    expect(formatCanonicalTime({ hours: 12, minutes: 60 })).toBe(null);
    expect(formatCanonicalTime({ hours: -1, minutes: 0 })).toBe(null);
    expect(formatCanonicalTime({ hours: 12, minutes: 30, seconds: 60 })).toBe(null);
    expect(formatCanonicalTime({ hours: "12", minutes: 30 })).toBe(null);
  });
});

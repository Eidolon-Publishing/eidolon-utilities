import { beforeEach, describe, expect, it } from "vitest";
import {
  sanitizeCriteria,
  sanitizeCriterion,
  sanitizeSceneCriteriaState
} from "../../scripts/scene-criteria/core/storage.js";

beforeEach(() => {
  globalThis.foundry = {
    utils: {
      duplicate: (data) => JSON.parse(JSON.stringify(data))
    }
  };
});

describe("sanitizeCriterion", () => {
  it("normalizes keys, values, and defaults", () => {
    const criterion = sanitizeCriterion(
      {
        id: "abc",
        key: " Scene Mood ",
        label: " Scene Mood ",
        values: ["Night", "Night", "  Fog  ", ""],
        default: "Day"
      },
      0,
      new Set()
    );

    expect(criterion.id).toBe("abc");
    expect(criterion.key).toBe("scene-mood");
    expect(criterion.label).toBe("Scene Mood");
    expect(criterion.values).toEqual(["Day", "Night", "Fog"]);
    expect(criterion.default).toBe("Day");
  });

  it("creates unique keys when duplicates exist", () => {
    const used = new Set(["mood"]);
    const criterion = sanitizeCriterion(
      { key: "Mood", label: "Mood", values: ["Standard"] },
      1,
      used
    );

    expect(criterion.key).toBe("mood-2");
  });
});

describe("sanitizeCriteria", () => {
  it("enforces stable order and default fallback", () => {
    const criteria = sanitizeCriteria([
      { key: "mood", label: "Mood", values: ["Night"], default: "" },
      { key: "weather", label: "Weather", values: [] }
    ]);

    expect(criteria.map((entry) => entry.key)).toEqual(["mood", "weather"]);
    expect(criteria[0].default).toBe("Night");
    expect(criteria[1].values).toEqual(["Standard"]);
    expect(criteria[1].default).toBe("Standard");
  });
});

describe("sanitizeSceneCriteriaState", () => {
  it("fills missing and invalid values from defaults", () => {
    const criteria = [
      { key: "mood", values: ["Day", "Night"], default: "Day" },
      { key: "weather", values: ["Clear", "Fog"], default: "Clear" }
    ];

    const state = sanitizeSceneCriteriaState(
      {
        mood: "Night",
        weather: "Rain"
      },
      criteria
    );

    expect(state).toEqual({ mood: "Night", weather: "Clear" });
  });
});

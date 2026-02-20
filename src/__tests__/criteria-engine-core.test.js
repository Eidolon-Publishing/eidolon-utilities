import { beforeEach, describe, expect, it } from "vitest";
import { findFileIndex } from "../../scripts/criteria-engine/core/matcher.js";
import { resolveRules } from "../../scripts/criteria-engine/core/resolver.js";
import {
  buildTileCriteriaFromFileIndex,
  detectTileCriteriaConflicts,
  resolveTileTargetIndex,
  selectTileFileIndex
} from "../../scripts/criteria-engine/core/tiles.js";
import {
  convertLightCriteriaStateToPresets,
  migrateLightCriteriaCategoriesToKeys
} from "../../scripts/light-criteria/core/storage.js";
import { setTileCriteria } from "../../scripts/criteria-engine/core/tile-storage.js";

beforeEach(() => {
  globalThis.foundry = {
    utils: {
      duplicate: (data) => JSON.parse(JSON.stringify(data))
    }
  };
});

describe("criteria engine matcher", () => {
  it("prefers the most specific file index match", () => {
    const fileIndex = [
      {},
      { mood: "Night" },
      { mood: "Night", effect: "Fog" }
    ];

    const state = { mood: "Night", effect: "Fog", variant: "Standard" };
    expect(findFileIndex(fileIndex, state)).toBe(2);
  });

  it("falls back to universal empty criteria", () => {
    const fileIndex = [{}, { mood: "Sunny Day" }];
    expect(findFileIndex(fileIndex, { mood: "Night" })).toBe(0);
  });
});

describe("criteria engine resolver", () => {
  it("layers matching rules by specificity", () => {
    const base = { config: { dim: 10, bright: 5 } };
    const rules = [
      { criteria: { mood: "Night" }, delta: { config: { dim: 30 } } },
      { criteria: { mood: "Night", effect: "Fog" }, delta: { config: { dim: 15 } } }
    ];

    const resolved = resolveRules(base, rules, { mood: "Night", effect: "Fog" });
    expect(resolved).toEqual({ config: { dim: 15, bright: 5 } });
  });

  it("supports delete operations through fallback merge", () => {
    const base = { config: { dim: 10, color: "#fff" } };
    const rules = [{ criteria: { mood: "Night" }, delta: { "-=config.color": true } }];

    const resolved = resolveRules(base, rules, { mood: "Night" });
    expect(resolved).toEqual({ config: { dim: 10 } });
  });
});

describe("tile select-one strategy", () => {
  it("builds tile criteria variants from fileIndex", () => {
    const tileCriteria = buildTileCriteriaFromFileIndex([
      {},
      { mood: "Night" },
      { mood: "Night", variant: "No Lights" }
    ]);

    expect(tileCriteria).toEqual({
      strategy: "select-one",
      variants: [
        { criteria: {}, target: { indexHint: 0 } },
        { criteria: { mood: "Night" }, target: { indexHint: 1 } },
        { criteria: { mood: "Night", variant: "No Lights" }, target: { indexHint: 2 } }
      ],
      defaultTarget: { indexHint: 0 }
    });
  });

  it("supports wildcard criteria via omitted keys", () => {
    const tileCriteria = {
      strategy: "select-one",
      variants: [
        { criteria: { mood: "Night" }, target: { indexHint: 1 } },
        { criteria: { mood: "Night", variant: "No Lights" }, target: { indexHint: 2 } },
        { criteria: {}, target: { indexHint: 0 } }
      ],
      defaultTarget: { indexHint: 0 }
    };

    const state = { mood: "Night", variant: "Standard", effect: "Fog" };
    expect(selectTileFileIndex(tileCriteria, state, [{}, {}, {}])).toBe(1);
  });

  it("returns the most specific match and falls back to default", () => {
    const tileCriteria = {
      strategy: "select-one",
      variants: [
        { criteria: { mood: "Night" }, target: { indexHint: 1 } },
        { criteria: { mood: "Night", variant: "No Lights" }, target: { indexHint: 2 } }
      ],
      defaultTarget: { indexHint: 0 }
    };

    expect(selectTileFileIndex(tileCriteria, { mood: "Night", variant: "No Lights" }, [{}, {}, {}])).toBe(2);
    expect(selectTileFileIndex(tileCriteria, { mood: "Day", variant: "No Lights" }, [{}, {}, {}])).toBe(0);
  });

  it("resolves path-keyed targets after MATT reordering", () => {
    const originalFiles = [
      { name: "maps/day.webp" },
      { name: "maps/night.webp" },
      { name: "maps/fog.webp" }
    ];

    const tileCriteria = buildTileCriteriaFromFileIndex(
      [
        {},
        { mood: "Night" },
        { mood: "Night", effect: "Fog" }
      ],
      { files: originalFiles }
    );

    const reorderedFiles = [
      { name: "maps/night.webp" },
      { name: "maps/fog.webp" },
      { name: "maps/day.webp" }
    ];

    expect(selectTileFileIndex(tileCriteria, { mood: "Night" }, reorderedFiles)).toBe(0);
    expect(selectTileFileIndex(tileCriteria, { mood: "Night", effect: "Fog" }, reorderedFiles)).toBe(1);
  });

  it("uses path occurrence for duplicate file names", () => {
    const target = { path: "maps/overlay.webp", occurrence: 1, indexHint: 1 };
    const files = [
      { name: "maps/overlay.webp" },
      { name: "maps/base.webp" },
      { name: "maps/overlay.webp" }
    ];

    expect(resolveTileTargetIndex(target, files)).toBe(2);
  });

  it("detects equivalent criteria targeting different files as conflicts", () => {
    const report = detectTileCriteriaConflicts(
      {
        strategy: "select-one",
        defaultTarget: { indexHint: 0 },
        variants: [
          { criteria: { mood: "Night" }, target: { indexHint: 0 } },
          { criteria: { mood: "Night" }, target: { indexHint: 1 } }
        ]
      },
      { files: [{}, {}] }
    );

    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].type).toBe("equivalent");
    expect(report.warnings).toHaveLength(0);
  });

  it("detects overlapping same-specificity criteria targeting different files", () => {
    const report = detectTileCriteriaConflicts(
      {
        strategy: "select-one",
        defaultTarget: { indexHint: 0 },
        variants: [
          { criteria: { mood: "Night", weather: "Rain" }, target: { indexHint: 0 } },
          { criteria: { mood: "Night", effect: "Fog" }, target: { indexHint: 1 } }
        ]
      },
      { files: [{}, {}] }
    );

    expect(report.errors).toHaveLength(1);
    expect(report.errors[0].type).toBe("overlap");
  });

  it("flags duplicate equivalent rules on the same file as warnings", () => {
    const report = detectTileCriteriaConflicts(
      {
        strategy: "select-one",
        defaultTarget: { indexHint: 0 },
        variants: [
          { criteria: { mood: "Night" }, target: { indexHint: 0 } },
          { criteria: { mood: "Night" }, target: { indexHint: 0 } }
        ]
      },
      { files: [{}] }
    );

    expect(report.errors).toHaveLength(0);
    expect(report.warnings).toHaveLength(1);
    expect(report.warnings[0].type).toBe("duplicate");
  });

  it("does not flag overlapping rules with different specificity", () => {
    const report = detectTileCriteriaConflicts(
      {
        strategy: "select-one",
        defaultTarget: { indexHint: 0 },
        variants: [
          { criteria: { mood: "Night" }, target: { indexHint: 0 } },
          { criteria: { mood: "Night", effect: "Fog" }, target: { indexHint: 1 } }
        ]
      },
      { files: [{}, {}] }
    );

    expect(report.errors).toHaveLength(0);
    expect(report.warnings).toHaveLength(0);
  });

  it("blocks saving conflicting tile criteria by default", async () => {
    const calls = [];
    const tile = {
      getFlag: (scope, key) => {
        if (scope === "monks-active-tiles" && key === "files") {
          return [{ name: "a.webp" }, { name: "b.webp" }];
        }
        return null;
      },
      setFlag: async (...args) => {
        calls.push(args);
      },
      unsetFlag: async () => {}
    };

    await expect(
      setTileCriteria(tile, {
        strategy: "select-one",
        defaultTarget: { indexHint: 0 },
        variants: [
          { criteria: { mood: "Night" }, target: { indexHint: 0 } },
          { criteria: { mood: "Night" }, target: { indexHint: 1 } }
        ]
      })
    ).rejects.toThrow(/conflicting rule pair/i);

    expect(calls).toHaveLength(0);
  });

  it("can bypass strict conflict validation for migration scripts", async () => {
    const calls = [];
    const tile = {
      getFlag: (scope, key) => {
        if (scope === "monks-active-tiles" && key === "files") {
          return [{ name: "a.webp" }, { name: "b.webp" }];
        }
        return null;
      },
      setFlag: async (...args) => {
        calls.push(args);
      },
      unsetFlag: async () => {}
    };

    await expect(
      setTileCriteria(
        tile,
        {
          strategy: "select-one",
          defaultTarget: { indexHint: 0 },
          variants: [
            { criteria: { mood: "Night" }, target: { indexHint: 0 } },
            { criteria: { mood: "Night" }, target: { indexHint: 1 } }
          ]
        },
        { strictValidation: false }
      )
    ).resolves.toBeTruthy();

    expect(calls.length).toBeGreaterThan(0);
  });
});

describe("light criteria conversion", () => {
  it("converts base+mappings into base+rules with deltas", () => {
    const state = {
      base: { config: { dim: 10, bright: 5 }, hidden: false },
      mappings: [
        {
          id: "map-1",
          categories: { mood: "Night", effect: "Fog" },
          config: { config: { dim: 15, bright: 5 }, hidden: false }
        }
      ]
    };

    const presets = convertLightCriteriaStateToPresets(state);
    expect(presets.base).toEqual({ config: { dim: 10, bright: 5 }, hidden: false });
    expect(presets.rules).toEqual([
      {
        criteria: { mood: "Night", effect: "Fog" },
        delta: { config: { dim: 15 } }
      }
    ]);
  });

  it("migrates id-based categories to key-based categories", () => {
    const state = {
      base: { config: { dim: 10 } },
      mappings: [
        {
          id: "map-1",
          categories: { critMood: "Night", effect: "Fog" },
          config: { config: { dim: 15 } }
        }
      ],
      current: {
        mappingId: "map-1",
        categories: { critMood: "Night", effect: "Fog" }
      }
    };

    const sceneCriteria = [
      { id: "critMood", key: "mood" },
      { id: "effect", key: "effect" }
    ];

    const migrated = migrateLightCriteriaCategoriesToKeys(state, sceneCriteria);
    expect(migrated.mappings).toHaveLength(1);
    expect(migrated.mappings[0].categories).toEqual({ mood: "Night", effect: "Fog" });
    expect(migrated.current.categories).toEqual({ mood: "Night", effect: "Fog" });
  });
});

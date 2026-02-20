import { beforeEach, describe, expect, it, vi } from "vitest";
import { findFileIndex } from "../../scripts/criteria-engine/core/matcher.js";
import { resolveRules } from "../../scripts/criteria-engine/core/resolver.js";
import {
  buildTileCriteriaFromFileIndex,
  detectTileCriteriaConflicts,
  resolveTileTargetIndex,
  selectTileFileIndex,
  updateTiles
} from "../../scripts/criteria-engine/core/tiles.js";
import {
  convertLightCriteriaStateToPresets,
  migrateLightCriteriaCategoriesToKeys
} from "../../scripts/light-criteria/core/storage.js";
import { setTileCriteria } from "../../scripts/criteria-engine/core/tile-storage.js";
import { applyState } from "../../scripts/criteria-engine/core/state.js";

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

describe("criteria engine performance guards", () => {
  it("skips tile updates when resolved file is already active", async () => {
    const tile = {
      id: "tile-1",
      _id: "tile-1",
      texture: { src: "maps/day.webp" },
      _source: { texture: { src: "maps/day.webp" } },
      getFlag: (scope, key) => {
        if (scope === "eidolon-utilities" && key === "tileCriteria") {
          return {
            strategy: "select-one",
            variants: [
              { criteria: {}, target: { indexHint: 0 } },
              { criteria: { mood: "Night" }, target: { indexHint: 1 } }
            ],
            defaultTarget: { indexHint: 0 }
          };
        }

        if (scope === "monks-active-tiles" && key === "files") {
          return [
            { name: "maps/day.webp", selected: true },
            { name: "maps/night.webp", selected: false }
          ];
        }

        if (scope === "monks-active-tiles" && key === "fileindex") {
          return 1;
        }

        return null;
      }
    };

    const updateEmbeddedDocuments = vi.fn(async () => null);
    const scene = {
      getEmbeddedCollection: (type) => (type === "Tile" ? [tile] : []),
      updateEmbeddedDocuments
    };

    await updateTiles({ mood: "Day" }, scene);

    expect(updateEmbeddedDocuments).not.toHaveBeenCalled();
  });

  it("batches tile flag + texture changes into a single scene update", async () => {
    const tile = {
      id: "tile-1",
      _id: "tile-1",
      texture: { src: "maps/day.webp" },
      _source: { texture: { src: "maps/day.webp" } },
      getFlag: (scope, key) => {
        if (scope === "eidolon-utilities" && key === "tileCriteria") {
          return {
            strategy: "select-one",
            variants: [
              { criteria: {}, target: { indexHint: 0 } },
              { criteria: { mood: "Night" }, target: { indexHint: 1 } }
            ],
            defaultTarget: { indexHint: 0 }
          };
        }

        if (scope === "monks-active-tiles" && key === "files") {
          return [
            { name: "maps/day.webp", selected: true },
            { name: "maps/night.webp", selected: false }
          ];
        }

        if (scope === "monks-active-tiles" && key === "fileindex") {
          return 1;
        }

        return null;
      }
    };

    const updateEmbeddedDocuments = vi.fn(async () => null);
    const scene = {
      getEmbeddedCollection: (type) => (type === "Tile" ? [tile] : []),
      updateEmbeddedDocuments
    };

    await updateTiles({ mood: "Night" }, scene);

    expect(updateEmbeddedDocuments).toHaveBeenCalledTimes(1);
    expect(updateEmbeddedDocuments).toHaveBeenCalledWith("Tile", [
      {
        _id: "tile-1",
        "flags.monks-active-tiles.files": [
          { name: "maps/day.webp", selected: false },
          { name: "maps/night.webp", selected: true }
        ],
        "flags.monks-active-tiles.fileindex": 2,
        texture: { src: "maps/night.webp" }
      }
    ]);
  });

  it("returns early when applyState does not change scene criteria state", async () => {
    const criteria = [
      {
        id: "criterion-1",
        key: "mood",
        label: "Mood",
        values: ["Day", "Night"],
        default: "Day",
        order: 0
      }
    ];

    const flagStore = {
      "eidolon-utilities.criteria": criteria,
      "eidolon-utilities.state": { mood: "Day" }
    };

    const scene = {
      isOwner: true,
      getFlag: (scope, key) => flagStore[`${scope}.${key}`],
      setFlag: vi.fn(async (scope, key, value) => {
        flagStore[`${scope}.${key}`] = JSON.parse(JSON.stringify(value));
      }),
      getEmbeddedCollection: () => [],
      updateEmbeddedDocuments: vi.fn(async () => null)
    };

    globalThis.game = {
      user: { isGM: true },
      scenes: { viewed: scene }
    };
    globalThis.Hooks = { callAll: vi.fn() };

    const result = await applyState({ mood: "Day" }, scene);

    expect(result).toEqual({ mood: "Day" });
    expect(scene.setFlag).not.toHaveBeenCalled();
    expect(Hooks.callAll).toHaveBeenCalledTimes(1);
    expect(Hooks.callAll).toHaveBeenCalledWith(
      "eidolon-utilities.criteriaStateApplied",
      scene,
      { mood: "Day" }
    );
  });

  it("skips tile processing when changed keys do not affect tile criteria", async () => {
    const tile = {
      id: "tile-1",
      _id: "tile-1",
      texture: { src: "maps/day.webp" },
      _source: { texture: { src: "maps/day.webp" } },
      getFlag: (scope, key) => {
        if (scope === "eidolon-utilities" && key === "tileCriteria") {
          return {
            strategy: "select-one",
            variants: [
              { criteria: {}, target: { indexHint: 0 } },
              { criteria: { mood: "Night" }, target: { indexHint: 1 } }
            ],
            defaultTarget: { indexHint: 0 }
          };
        }

        if (scope === "monks-active-tiles" && key === "files") {
          return [
            { name: "maps/day.webp", selected: true },
            { name: "maps/night.webp", selected: false }
          ];
        }

        if (scope === "monks-active-tiles" && key === "fileindex") {
          return 1;
        }

        return null;
      }
    };

    const updateEmbeddedDocuments = vi.fn(async () => null);
    const scene = {
      getEmbeddedCollection: (type) => (type === "Tile" ? [tile] : []),
      updateEmbeddedDocuments
    };

    await updateTiles({ mood: "Night" }, scene, { changedKeys: ["weather"] });

    expect(updateEmbeddedDocuments).not.toHaveBeenCalled();
  });
});

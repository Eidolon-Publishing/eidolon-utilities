import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("Tile conflicts report errors/warnings and resolve deterministically by variant order", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const result = await page.evaluate(async () => {
    const moduleId = "eidolon-utilities";
    const api = game.modules?.get(moduleId)?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const scene = game.scenes?.viewed ?? game.scenes?.active ?? null;
    if (!scene) return { status: "no-scene" };

    const { detectTileCriteriaConflicts } = await import(
      "/modules/eidolon-utilities/scripts/criteria-engine/core/tiles.js"
    );

    const criteria = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
    const usableCriteria = criteria
      .filter((entry) => typeof entry?.key === "string" && entry.key.trim() && Array.isArray(entry.values) && entry.values.length > 0)
      .slice(0, 2);

    if (usableCriteria.length < 2) {
      return { status: "insufficient-criteria" };
    }

    const [leftCriterion, rightCriterion] = usableCriteria;
    const leftKey = leftCriterion.key.trim();
    const rightKey = rightCriterion.key.trim();
    const leftValue = String(leftCriterion.values[0]);
    const rightValue = String(rightCriterion.values[0]);

    const tiles = Array.from(scene.getEmbeddedCollection("Tile") ?? []);
    const tile = tiles.find((entry) => {
      const files = entry.getFlag("monks-active-tiles", "files");
      return Array.isArray(files) && files.length >= 2;
    }) ?? null;

    if (!tile) return { status: "no-eligible-tile" };

    const files = tile.getFlag("monks-active-tiles", "files") ?? [];
    const originalTileCriteria = tile.getFlag(moduleId, "tileCriteria");
    const originalState = api.getState?.(scene) ?? {};

    const overlapCriteriaState = {
      ...originalState,
      [leftKey]: leftValue,
      [rightKey]: rightValue
    };

    const overlapRuleA = { [leftKey]: leftValue };
    const overlapRuleB = { [rightKey]: rightValue };

    const conflictingAFirst = {
      strategy: "select-one",
      defaultTarget: { indexHint: 0 },
      variants: [
        { criteria: overlapRuleA, target: { indexHint: 0 } },
        { criteria: overlapRuleB, target: { indexHint: 1 } }
      ]
    };

    const conflictingBFirst = {
      ...conflictingAFirst,
      variants: [...conflictingAFirst.variants].reverse()
    };

    const duplicateWarningPayload = {
      strategy: "select-one",
      defaultTarget: { indexHint: 0 },
      variants: [
        { criteria: overlapRuleA, target: { indexHint: 0 } },
        { criteria: { ...overlapRuleA }, target: { indexHint: 0 } }
      ]
    };

    const selectedIndexFromFiles = (entries) => {
      if (!Array.isArray(entries)) return -1;
      return entries.findIndex((entry) => entry?.selected === true);
    };

    const output = {
      status: "error",
      tileId: tile.id
    };

    try {
      const conflictReport = detectTileCriteriaConflicts(conflictingAFirst, { files });
      const warningReport = detectTileCriteriaConflicts(duplicateWarningPayload, { files });

      await tile.setFlag(moduleId, "tileCriteria", conflictingAFirst);
      await api.applyState?.(overlapCriteriaState, scene);
      const firstSelection = selectedIndexFromFiles(tile.getFlag("monks-active-tiles", "files"));

      await tile.setFlag(moduleId, "tileCriteria", conflictingBFirst);
      await api.applyState?.(overlapCriteriaState, scene);
      const secondSelection = selectedIndexFromFiles(tile.getFlag("monks-active-tiles", "files"));

      output.status = "ok";
      output.conflicts = conflictReport;
      output.warnings = warningReport;
      output.firstSelection = firstSelection;
      output.secondSelection = secondSelection;
    } catch (error) {
      output.status = "error";
      output.message = String(error?.message ?? error);
    } finally {
      try {
        if (originalTileCriteria === undefined) {
          await tile.unsetFlag?.(moduleId, "tileCriteria");
        } else {
          await tile.setFlag(moduleId, "tileCriteria", originalTileCriteria);
        }
        await api.applyState?.(originalState, scene);
        output.restored = true;
      } catch (restoreError) {
        output.restoreError = String(restoreError?.message ?? restoreError);
      }
    }

    return output;
  });

  expect(result.status).not.toBe("missing-api");
  test.skip(result.status === "no-scene", "No active scene is available for tile conflict checks.");
  test.skip(result.status === "insufficient-criteria", "Need at least two criteria with values to validate overlap behavior.");
  test.skip(result.status === "no-eligible-tile", "Need a tile with at least two MATT files.");

  expect(result.status).toBe("ok");
  expect(result.restoreError ?? "").toBe("");

  expect(result.conflicts?.errors?.length ?? 0).toBeGreaterThan(0);
  expect(result.conflicts?.errors?.[0]?.type).toBe("overlap");

  expect(result.warnings?.errors?.length ?? 0).toBe(0);
  expect(result.warnings?.warnings?.length ?? 0).toBeGreaterThan(0);
  expect(result.warnings?.warnings?.[0]?.type).toBe("duplicate");

  expect(result.firstSelection).toBe(0);
  expect(result.secondSelection).toBe(1);
});

test("Light criteria resolution is deterministic by mapping order for same-specificity overlaps", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const result = await page.evaluate(async () => {
    const { convertLightCriteriaStateToPresets } = await import(
      "/modules/eidolon-utilities/scripts/light-criteria/core/storage.js"
    );
    const { resolveRules } = await import(
      "/modules/eidolon-utilities/scripts/criteria-engine/core/resolver.js"
    );

    const base = {
      config: {
        alpha: 0.5
      }
    };

    const state = {
      left: "A",
      right: "B"
    };

    const mappingA = {
      id: "e2e-overlap-a",
      categories: { left: "A" },
      config: {
        config: {
          alpha: 0.1
        }
      },
      updatedAt: Date.now()
    };

    const mappingB = {
      id: "e2e-overlap-b",
      categories: { right: "B" },
      config: {
        config: {
          alpha: 0.9
        }
      },
      updatedAt: Date.now() + 1
    };

    const firstState = {
      base,
      mappings: [mappingA, mappingB],
      current: null
    };

    const secondState = {
      base,
      mappings: [mappingB, mappingA],
      current: null
    };

    const firstPresets = convertLightCriteriaStateToPresets(firstState);
    const secondPresets = convertLightCriteriaStateToPresets(secondState);

    const firstResolved = resolveRules(firstPresets.base, firstPresets.rules, state);
    const secondResolved = resolveRules(secondPresets.base, secondPresets.rules, state);

    return {
      status: "ok",
      firstAlpha: firstResolved?.config?.alpha,
      secondAlpha: secondResolved?.config?.alpha,
      firstRuleCount: firstPresets.rules.length,
      secondRuleCount: secondPresets.rules.length
    };
  });

  expect(result.status).toBe("ok");
  expect(result.firstRuleCount).toBe(2);
  expect(result.secondRuleCount).toBe(2);
  expect(result.firstAlpha).toBe(0.9);
  expect(result.secondAlpha).toBe(0.1);
});

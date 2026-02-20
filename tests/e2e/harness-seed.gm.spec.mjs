import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";
import { seedCriteriaHarness } from "./helpers/seed-harness.mjs";

test("E2E harness seed is present and consistent", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });
  await seedCriteriaHarness(page);

  const result = await page.evaluate(() => {
    const moduleId = "eidolon-utilities";
    const api = game.modules?.get(moduleId)?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const scene = game.scenes?.find((entry) => entry.getFlag(moduleId, "e2eHarnessScene") === true) ?? null;
    if (!scene) return { status: "missing-scene" };

    const criteria = api.getCriteria?.(scene) ?? [];
    const state = api.getState?.(scene) ?? {};

    const light = scene
      .getEmbeddedCollection("AmbientLight")
      ?.find((entry) => entry.getFlag(moduleId, "e2eHarness") === "main-light") ?? null;
    const tile = scene
      .getEmbeddedCollection("Tile")
      ?.find((entry) => entry.getFlag(moduleId, "e2eHarness") === "main-tile") ?? null;

    const lightCriteria = light?.getFlag?.(moduleId, "lightCriteria") ?? null;
    const tileCriteria = tile?.getFlag?.(moduleId, "tileCriteria") ?? null;
    const tileFiles = tile?.getFlag?.("monks-active-tiles", "files") ?? [];

    return {
      status: "ok",
      sceneId: scene.id,
      sceneName: scene.name,
      criteriaKeys: criteria.map((entry) => entry.key),
      state,
      hasLight: Boolean(light),
      hasTile: Boolean(tile),
      lightMappingCount: Array.isArray(lightCriteria?.mappings) ? lightCriteria.mappings.length : 0,
      lightCategoryKeys: Array.isArray(lightCriteria?.mappings)
        ? lightCriteria.mappings.flatMap((entry) => Object.keys(entry?.categories ?? {}))
        : [],
      tileVariantCount: Array.isArray(tileCriteria?.variants) ? tileCriteria.variants.length : 0,
      tileFileCount: Array.isArray(tileFiles) ? tileFiles.length : 0
    };
  });

  expect(result.status).toBe("ok");
  expect(result.criteriaKeys).toEqual(["e2e-weather", "e2e-phase", "e2e-mode"]);
  expect(result.state).toEqual({
    "e2e-weather": "Clear",
    "e2e-phase": "Day",
    "e2e-mode": "Public"
  });

  expect(result.hasLight).toBe(true);
  expect(result.hasTile).toBe(true);
  expect(result.lightMappingCount).toBe(3);
  expect(new Set(result.lightCategoryKeys)).toEqual(new Set(["e2e-weather", "e2e-phase", "e2e-mode"]));
  expect(result.tileVariantCount).toBeGreaterThanOrEqual(2);
  expect(result.tileFileCount).toBeGreaterThanOrEqual(3);
});

import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("GM criteria apply resolves ambient light mapping and raw flags consistently", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const result = await page.evaluate(async () => {
    const moduleId = "eidolon-utilities";
    const api = game.modules?.get(moduleId)?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const scene = game.scenes?.viewed ?? game.scenes?.active ?? null;
    if (!scene) return { status: "no-scene" };

    const criteria = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
    if (!criteria.length) return { status: "no-criteria" };

    const allowedValuesByKey = new Map(
      criteria.map((criterion) => [criterion.key, new Set(criterion.values ?? [])])
    );

    const originalState = api.getState?.(scene) ?? {};
    const lights = Array.from(scene.getEmbeddedCollection("AmbientLight") ?? []);

    const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);

    const getByPath = (source, path) => {
      return String(path)
        .split(".")
        .reduce((accumulator, segment) => {
          if (accumulator === null || accumulator === undefined) return undefined;
          if (/^\d+$/.test(segment)) {
            const index = Number(segment);
            return Array.isArray(accumulator) ? accumulator[index] : undefined;
          }
          return accumulator[segment];
        }, source);
    };

    const collectScalarDiffs = (base, target, prefix = "") => {
      const diffs = [];
      const keys = Object.keys(isObject(target) ? target : {});

      for (const key of keys) {
        const left = isObject(base) ? base[key] : undefined;
        const right = isObject(target) ? target[key] : undefined;
        const path = prefix ? `${prefix}.${key}` : key;

        // Resolver merges deltas into base and does not treat missing keys as deletions.
        if (typeof right === "undefined") continue;

        if (isObject(left) || isObject(right)) {
          diffs.push(...collectScalarDiffs(left, right, path));
          continue;
        }

        if (Array.isArray(left) || Array.isArray(right)) {
          if (JSON.stringify(left ?? null) !== JSON.stringify(right ?? null)) {
            diffs.push({ path, expected: right ?? null, type: "array" });
          }
          continue;
        }

        if (left !== right) {
          const type = right === null ? "null" : typeof right;
          diffs.push({ path, expected: right, type });
        }
      }

      return diffs;
    };

    const isApplicableCriteria = (mapping) => {
      for (const [key, value] of Object.entries(mapping ?? {})) {
        const allowed = allowedValuesByKey.get(key);
        if (!allowed || !allowed.has(value)) return false;
      }
      return true;
    };

    let chosen = null;

    for (const light of lights) {
      const lightCriteria = light.getFlag(moduleId, "lightCriteria");
      const mappings = Array.isArray(lightCriteria?.mappings) ? [...lightCriteria.mappings] : [];
      if (!mappings.length) continue;

      const baseConfig = isObject(lightCriteria?.base) ? lightCriteria.base : {};

      const sortedMappings = mappings.sort((left, right) => {
        return Object.keys(right?.categories ?? {}).length - Object.keys(left?.categories ?? {}).length;
      });

      for (const mapping of sortedMappings) {
        const categories = mapping?.categories ?? {};
        if (!Object.keys(categories).length || !isApplicableCriteria(categories)) continue;

        const diffs = collectScalarDiffs(baseConfig, mapping?.config ?? {});
        const scalarDiffs = diffs.filter((entry) => entry.type === "number" || entry.type === "boolean");
        const selectedDiffs = (scalarDiffs.length > 0 ? scalarDiffs : diffs).slice(0, 4);
        if (!selectedDiffs.length) continue;

        chosen = {
          lightId: light.id,
          categories,
          expectations: selectedDiffs
        };
        break;
      }

      if (chosen) break;
    }

    if (!chosen) {
      return { status: "no-eligible-light" };
    }

    const output = {
      status: "error",
      lightId: chosen.lightId
    };

    try {
      const persistedState = await api.applyState?.(chosen.categories, scene);
      const updatedLight = scene.getEmbeddedCollection("AmbientLight")?.get(chosen.lightId) ?? null;
      const serializedLight = typeof updatedLight?.toObject === "function" ? updatedLight.toObject() : updatedLight;
      const rawLightCriteria = updatedLight?.getFlag?.(moduleId, "lightCriteria");

      const actualValues = chosen.expectations.map((entry) => ({
        path: entry.path,
        expected: entry.expected,
        actual: getByPath(serializedLight, entry.path)
      }));

      output.status = "ok";
      output.persistedState = persistedState;
      output.targetCriteria = chosen.categories;
      output.values = actualValues;
      output.raw = {
        hasLightCriteria: Boolean(rawLightCriteria),
        mappingCount: Array.isArray(rawLightCriteria?.mappings) ? rawLightCriteria.mappings.length : 0,
        hasBase: Boolean(rawLightCriteria?.base)
      };
    } catch (error) {
      output.status = "error";
      output.message = String(error?.message ?? error);
    } finally {
      try {
        await api.applyState?.(originalState, scene);
        output.restored = true;
      } catch (restoreError) {
        output.restoreError = String(restoreError?.message ?? restoreError);
      }
    }

    return output;
  });

  expect(result.status).not.toBe("missing-api");
  test.skip(result.status === "no-scene", "No active scene is available for light resolution checks.");
  test.skip(result.status === "no-criteria", "Scene has no criteria configured.");
  test.skip(result.status === "no-eligible-light", "No light with usable criteria mappings was found.");

  expect(result.status).toBe("ok");
  expect(result.restoreError ?? "").toBe("");

  for (const valueCheck of result.values ?? []) {
    expect(valueCheck.actual).toEqual(valueCheck.expected);
  }

  for (const [key, value] of Object.entries(result.targetCriteria ?? {})) {
    expect(result.persistedState?.[key]).toBe(value);
  }

  expect(result.raw?.hasLightCriteria).toBe(true);
  expect(result.raw?.mappingCount).toBeGreaterThan(0);
  expect(result.raw?.hasBase).toBe(true);
});

import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("Scene criteria switches apply stacked light mutations (including hidden) and revert cleanly", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const result = await page.evaluate(async () => {
    const moduleId = "eidolon-utilities";
    const api = game.modules?.get(moduleId)?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const {
      sanitizeLightConfigPayload,
      setLightCriteriaState
    } = await import("/modules/eidolon-utilities/scripts/light-criteria/core/storage.js");

    const scene = game.scenes?.viewed ?? game.scenes?.active ?? null;
    if (!scene) return { status: "no-scene" };

    const lights = Array.from(scene.getEmbeddedCollection("AmbientLight") ?? []);
    const light = lights[0] ?? null;
    if (!light) return { status: "no-light" };

    const deepClone = (value) => {
      if (typeof structuredClone === "function") return structuredClone(value);
      return JSON.parse(JSON.stringify(value));
    };

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

    const setByPath = (source, path, value) => {
      const segments = String(path).split(".");
      let current = source;
      for (let index = 0; index < segments.length - 1; index += 1) {
        const key = segments[index];
        if (!current[key] || typeof current[key] !== "object") {
          current[key] = {};
        }
        current = current[key];
      }
      current[segments[segments.length - 1]] = value;
    };

    const mutateNumeric = (path, value, seed = 1) => {
      const numeric = Number.isFinite(value) ? Number(value) : 0;

      if (path.includes("alpha") || path.includes("attenuation") || path.includes("intensity")) {
        const next = Math.min(1, Math.max(0, numeric + 0.2 * seed));
        return Number(next.toFixed(3));
      }

      if (path.includes("angle") || path.includes("rotation")) {
        const next = (numeric + 45 * seed) % 360;
        return Number(next.toFixed(3));
      }

      const next = numeric + seed;
      return Number(next.toFixed(3));
    };

    const originalCriteria = deepClone(api.getCriteria?.(scene) ?? []);
    const originalState = deepClone(api.getState?.(scene) ?? {});
    const originalLightCriteria = deepClone(light.getFlag(moduleId, "lightCriteria"));

    const baseLight = sanitizeLightConfigPayload(light.toObject());
    if (!baseLight) return { status: "invalid-base-light" };

    const numericField = ["config.dim", "config.bright", "config.alpha", "rotation"]
      .find((path) => Number.isFinite(getByPath(baseLight, path))) ?? null;
    const deepNumericField = ["config.animation.speed", "config.animation.intensity", "config.angle"]
      .find((path) => Number.isFinite(getByPath(baseLight, path))) ?? null;

    if (!numericField || !deepNumericField) {
      return {
        status: "missing-light-fields",
        numericField,
        deepNumericField
      };
    }

    const criteria = [
      {
        id: "e2e-weather-id",
        key: "e2e-weather",
        label: "E2E Weather",
        values: ["Clear", "Rain"],
        default: "Clear",
        order: 0
      },
      {
        id: "e2e-phase-id",
        key: "e2e-phase",
        label: "E2E Phase",
        values: ["Day", "Night"],
        default: "Day",
        order: 1
      },
      {
        id: "e2e-mode-id",
        key: "e2e-mode",
        label: "E2E Mode",
        values: ["Public", "Stealth"],
        default: "Public",
        order: 2
      }
    ];

    const defaults = {
      "e2e-weather": "Clear",
      "e2e-phase": "Day",
      "e2e-mode": "Public"
    };
    const active = {
      "e2e-weather": "Rain",
      "e2e-phase": "Night",
      "e2e-mode": "Stealth"
    };

    const baseline = deepClone(baseLight);
    baseline.hidden = false;

    const weatherConfig = deepClone(baseline);
    const phaseConfig = deepClone(baseline);
    const stealthConfig = deepClone(baseline);

    const weatherValue = mutateNumeric(numericField, getByPath(baseline, numericField), 2);
    const phaseValue = mutateNumeric(deepNumericField, getByPath(baseline, deepNumericField), 3);

    setByPath(weatherConfig, numericField, weatherValue);
    setByPath(phaseConfig, deepNumericField, phaseValue);
    setByPath(stealthConfig, "hidden", true);

    const lightCriteriaPayload = {
      base: baseline,
      mappings: [
        {
          id: "e2e-weather-map",
          categories: { "e2e-weather": "Rain" },
          config: weatherConfig,
          updatedAt: Date.now()
        },
        {
          id: "e2e-phase-map",
          categories: { "e2e-phase": "Night" },
          config: phaseConfig,
          updatedAt: Date.now() + 1
        },
        {
          id: "e2e-mode-map",
          categories: { "e2e-mode": "Stealth" },
          config: stealthConfig,
          updatedAt: Date.now() + 2
        }
      ],
      current: null
    };

    const readLight = (lightId) => {
      const current = scene.getEmbeddedCollection("AmbientLight")?.get(lightId) ?? null;
      return typeof current?.toObject === "function" ? current.toObject() : current;
    };

    const output = {
      status: "error",
      lightId: light.id,
      numericField,
      deepNumericField,
      weatherValue,
      phaseValue
    };

    try {
      await api.setCriteria?.(criteria, scene);
      await setLightCriteriaState(light, lightCriteriaPayload);

      const persistedActive = await api.applyState?.(active, scene);
      const activeLight = readLight(light.id);

      const activeNumeric = getByPath(activeLight, numericField);
      const activeDeepNumeric = getByPath(activeLight, deepNumericField);
      const activeHidden = getByPath(activeLight, "hidden");

      const persistedDefaults = await api.applyState?.(defaults, scene);
      const defaultLight = readLight(light.id);

      const defaultNumeric = getByPath(defaultLight, numericField);
      const defaultDeepNumeric = getByPath(defaultLight, deepNumericField);
      const defaultHidden = getByPath(defaultLight, "hidden");

      const rawLightCriteria = light.getFlag(moduleId, "lightCriteria");

      output.status = "ok";
      output.persistedActive = persistedActive;
      output.persistedDefaults = persistedDefaults;
      output.activeValues = {
        numeric: activeNumeric,
        deepNumeric: activeDeepNumeric,
        hidden: activeHidden
      };
      output.defaultValues = {
        numeric: defaultNumeric,
        deepNumeric: defaultDeepNumeric,
        hidden: defaultHidden
      };
      output.baseValues = {
        numeric: getByPath(baseline, numericField),
        deepNumeric: getByPath(baseline, deepNumericField),
        hidden: getByPath(baseline, "hidden")
      };
      output.raw = {
        hasLightCriteria: Boolean(rawLightCriteria),
        mappingCount: Array.isArray(rawLightCriteria?.mappings) ? rawLightCriteria.mappings.length : 0,
        categories: rawLightCriteria?.mappings?.map((entry) => Object.keys(entry?.categories ?? {})).flat() ?? []
      };
    } catch (error) {
      output.status = "error";
      output.message = String(error?.message ?? error);
    } finally {
      try {
        if (originalLightCriteria === undefined) {
          await light.unsetFlag?.(moduleId, "lightCriteria");
        } else {
          await setLightCriteriaState(light, originalLightCriteria);
        }

        await api.setCriteria?.(originalCriteria, scene);
        await api.applyState?.(originalState, scene);
        output.restored = true;
      } catch (restoreError) {
        output.restoreError = String(restoreError?.message ?? restoreError);
      }
    }

    return output;
  });

  expect(result.status).not.toBe("missing-api");
  test.skip(result.status === "no-scene", "No active scene is available for stacked light mutation checks.");
  test.skip(result.status === "no-light", "Need at least one ambient light in the active scene.");
  test.skip(result.status === "invalid-base-light", "Unable to sanitize base ambient light payload.");
  test.skip(result.status === "missing-light-fields", "Light does not expose required numeric/deep fields for this deterministic check.");

  expect(result.status, result.message ?? JSON.stringify(result)).toBe("ok");
  expect(result.restoreError ?? "").toBe("");

  expect(result.activeValues?.numeric).toBe(result.weatherValue);
  expect(result.activeValues?.deepNumeric).toBe(result.phaseValue);
  expect(result.activeValues?.hidden).toBe(true);

  expect(result.defaultValues?.numeric).toBe(result.baseValues?.numeric);
  expect(result.defaultValues?.deepNumeric).toBe(result.baseValues?.deepNumeric);
  expect(result.defaultValues?.hidden).toBe(false);

  expect(result.persistedActive?.["e2e-weather"]).toBe("Rain");
  expect(result.persistedActive?.["e2e-phase"]).toBe("Night");
  expect(result.persistedActive?.["e2e-mode"]).toBe("Stealth");

  expect(result.persistedDefaults?.["e2e-weather"]).toBe("Clear");
  expect(result.persistedDefaults?.["e2e-phase"]).toBe("Day");
  expect(result.persistedDefaults?.["e2e-mode"]).toBe("Public");

  expect(result.raw?.hasLightCriteria).toBe(true);
  expect(result.raw?.mappingCount).toBe(3);
  expect(new Set(result.raw?.categories ?? [])).toEqual(new Set(["e2e-weather", "e2e-phase", "e2e-mode"]));
});

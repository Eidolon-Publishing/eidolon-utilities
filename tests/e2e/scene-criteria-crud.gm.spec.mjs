import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("GM can round-trip scene criteria create/update via API", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const marker = `E2E Scene Criterion ${Date.now()}`;

  const result = await page.evaluate(async ({ marker: labelMarker }) => {
    const api = game.modules?.get("eidolon-utilities")?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const scene = game.scenes?.viewed ?? game.scenes?.active ?? null;
    if (!scene) return { status: "no-scene" };

    const original = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
    const originalCount = original.length;

    let outcome = { status: "error", message: "uninitialized" };

    try {
      const nextCriteria = [
        ...original,
        {
          id: `e2e-${Date.now()}`,
          key: "",
          label: labelMarker,
          values: ["One", "Two"],
          default: "Two",
          order: original.length
        }
      ];

      await api.setCriteria?.(nextCriteria, scene);

      const persisted = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
      const inserted = persisted.find((criterion) => criterion?.label === labelMarker) ?? null;
      const state = api.getState?.(scene) ?? {};
      const rawCriteria = scene.getFlag("eidolon-utilities", "criteria");
      const rawState = scene.getFlag("eidolon-utilities", "state");
      const rawVersion = scene.getFlag("eidolon-utilities", "criteriaVersion");
      const rawInserted = Array.isArray(rawCriteria)
        ? rawCriteria.find((criterion) => criterion?.label === labelMarker) ?? null
        : null;

      outcome = {
        status: "ok",
        originalCount,
        persistedCount: persisted.length,
        inserted,
        stateValue: inserted?.key ? state?.[inserted.key] ?? null : null,
        raw: {
          criteriaCount: Array.isArray(rawCriteria) ? rawCriteria.length : null,
          inserted: rawInserted,
          stateValue: rawInserted?.key ? rawState?.[rawInserted.key] ?? null : null,
          version: rawVersion
        }
      };
    } catch (error) {
      outcome = {
        status: "error",
        message: String(error?.message ?? error)
      };
    } finally {
      try {
        await api.setCriteria?.(original, scene);
        const restored = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
        outcome.restoredCount = restored.length;
      } catch (restoreError) {
        outcome.restoreError = String(restoreError?.message ?? restoreError);
      }
    }

    return outcome;
  }, { marker });

  expect(result.status).not.toBe("missing-api");
  test.skip(result.status === "no-scene", "No active scene is available for scene criteria CRUD checks.");

  expect(result.status).toBe("ok");
  expect(result.restoreError ?? "").toBe("");
  expect(result.persistedCount).toBe(result.originalCount + 1);
  expect(result.restoredCount).toBe(result.originalCount);

  expect(result.inserted).toBeTruthy();
  expect(typeof result.inserted.key).toBe("string");
  expect(result.inserted.key.length).toBeGreaterThan(0);
  expect(Array.isArray(result.inserted.values)).toBe(true);
  expect(result.inserted.values).toContain("One");
  expect(result.inserted.values).toContain("Two");
  expect(result.inserted.default).toBe("Two");
  expect(result.stateValue).toBe("Two");

  expect(result.raw).toBeTruthy();
  expect(result.raw.criteriaCount).toBe(result.originalCount + 1);
  expect(result.raw.inserted).toBeTruthy();
  expect(result.raw.inserted.default).toBe("Two");
  expect(result.raw.stateValue).toBe("Two");
  expect(result.raw.version).toBe(1);
});

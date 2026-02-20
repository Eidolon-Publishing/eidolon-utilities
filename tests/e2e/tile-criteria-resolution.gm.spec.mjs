import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("GM criteria apply resolves tile variant and raw flags consistently", async ({ page }) => {
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
    const tiles = Array.from(scene.getEmbeddedCollection("Tile") ?? []);

    const normalizeFilePath = (value) => {
      if (typeof value !== "string") return "";
      const trimmed = value.trim().replace(/\\/g, "/");
      if (!trimmed) return "";
      try {
        return decodeURIComponent(trimmed);
      } catch (_error) {
        return trimmed;
      }
    };

    const getFilePath = (file) => {
      if (typeof file?.name === "string") return normalizeFilePath(file.name);
      if (typeof file?.src === "string") return normalizeFilePath(file.src);
      return "";
    };

    const resolveTargetIndex = (target, files) => {
      if (!target || typeof target !== "object") return -1;

      const path = normalizeFilePath(target.path);
      const indexHint = Number(target.indexHint ?? target.fileIndex);
      const occurrence = Number(target.occurrence);

      if (path) {
        const matches = files
          .map((file, index) => ({ index, path: getFilePath(file) }))
          .filter((entry) => entry.path === path);

        if (matches.length > 0) {
          const requestedOccurrence = Number.isInteger(occurrence) && occurrence >= 0 ? occurrence : 0;
          if (matches[requestedOccurrence]) return matches[requestedOccurrence].index;

          if (Number.isInteger(indexHint) && indexHint >= 0) {
            const hinted = matches.find((entry) => entry.index === indexHint);
            if (hinted) return hinted.index;
          }

          return matches[0].index;
        }
      }

      if (Number.isInteger(indexHint) && indexHint >= 0 && indexHint < files.length) {
        return indexHint;
      }

      return -1;
    };

    const isApplicableCriteria = (mapping) => {
      for (const [key, value] of Object.entries(mapping ?? {})) {
        const allowed = allowedValuesByKey.get(key);
        if (!allowed || !allowed.has(value)) return false;
      }
      return true;
    };

    let chosen = null;

    for (const tile of tiles) {
      const files = tile.getFlag("monks-active-tiles", "files") ?? [];
      const tileCriteria = tile.getFlag(moduleId, "tileCriteria");
      if (!files.length || !Array.isArray(tileCriteria?.variants)) continue;

      const variants = [...tileCriteria.variants].sort((left, right) => {
        return Object.keys(right?.criteria ?? {}).length - Object.keys(left?.criteria ?? {}).length;
      });

      const variant = variants.find((entry) => {
        const criteriaMap = entry?.criteria ?? {};
        return Object.keys(criteriaMap).length > 0 && isApplicableCriteria(criteriaMap);
      });

      if (!variant) continue;

      const expectedIndex = resolveTargetIndex(variant.target, files);
      if (expectedIndex < 0 || expectedIndex >= files.length) continue;

      chosen = {
        tile,
        tileId: tile.id,
        files,
        variant,
        expectedIndex
      };
      break;
    }

    if (!chosen) {
      return { status: "no-eligible-tile" };
    }

    const expectedSrc = chosen.files[chosen.expectedIndex]?.name ?? null;
    const targetCriteria = { ...(chosen.variant.criteria ?? {}) };
    const expectedFileIndexFlag = chosen.expectedIndex + 1;

    const output = {
      status: "error",
      tileId: chosen.tileId
    };

    try {
      const persistedState = await api.applyState?.(targetCriteria, scene);

      const filesAfter = chosen.tile.getFlag("monks-active-tiles", "files") ?? [];
      const selectedIndices = filesAfter
        .map((file, index) => (file?.selected ? index : -1))
        .filter((index) => index >= 0);

      const fileIndexFlag = chosen.tile.getFlag("monks-active-tiles", "fileindex");
      const textureSrc = chosen.tile.texture?.src ?? chosen.tile._source?.texture?.src ?? null;

      const rawTileCriteria = chosen.tile.getFlag(moduleId, "tileCriteria");

      output.status = "ok";
      output.expectedIndex = chosen.expectedIndex;
      output.expectedSrc = expectedSrc;
      output.expectedFileIndexFlag = expectedFileIndexFlag;
      output.selectedIndex = selectedIndices[0] ?? null;
      output.selectedCount = selectedIndices.length;
      output.fileIndexFlag = fileIndexFlag;
      output.textureSrc = textureSrc;
      output.persistedState = persistedState;
      output.targetCriteria = targetCriteria;
      output.raw = {
        hasTileCriteria: Boolean(rawTileCriteria),
        variantCount: Array.isArray(rawTileCriteria?.variants) ? rawTileCriteria.variants.length : 0
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
  test.skip(result.status === "no-scene", "No active scene is available for tile resolution checks.");
  test.skip(result.status === "no-criteria", "Scene has no criteria configured.");
  test.skip(result.status === "no-eligible-tile", "No tile with usable criteria variants was found in the active scene.");

  expect(result.status).toBe("ok");
  expect(result.restoreError ?? "").toBe("");

  expect(result.selectedCount).toBe(1);
  expect(result.selectedIndex).toBe(result.expectedIndex);
  expect(result.fileIndexFlag).toBe(result.expectedFileIndexFlag);
  expect(result.textureSrc).toContain(result.expectedSrc);

  for (const [key, value] of Object.entries(result.targetCriteria ?? {})) {
    expect(result.persistedState?.[key]).toBe(value);
  }

  expect(result.raw?.hasTileCriteria).toBe(true);
  expect(result.raw?.variantCount).toBeGreaterThan(0);
});


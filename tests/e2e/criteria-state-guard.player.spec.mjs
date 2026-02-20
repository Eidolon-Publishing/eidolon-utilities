import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("Player cannot apply criteria state via API", async ({ page }) => {
  await assertFoundrySession(page, { role: "player", isGM: false });

  const result = await page.evaluate(async () => {
    const api = game.modules?.get("eidolon-utilities")?.api?.criteria;
    if (!api) return { status: "missing-api" };

    const scene = game.scenes?.viewed ?? game.scenes?.active ?? null;
    if (!scene) return { status: "no-scene" };

    const criteria = Array.isArray(api.getCriteria?.(scene)) ? api.getCriteria(scene) : [];
    const key = criteria[0]?.key ?? "mood";
    const value = criteria[0]?.values?.[0] ?? "Standard";

    try {
      await api.applyState?.({ [key]: value }, scene);
      return { status: "applied" };
    } catch (error) {
      return {
        status: "blocked",
        message: String(error?.message ?? "")
      };
    }
  });

  expect(result.status).not.toBe("missing-api");
  test.skip(result.status === "no-scene", "No active scene is available for permission checks.");
  expect(result.status).toBe("blocked");
  expect(result.message.toLowerCase()).toContain("permission");
});


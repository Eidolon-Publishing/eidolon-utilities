import { expect, test } from "@playwright/test";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("GM can open criteria switcher via module API", async ({ page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const result = await page.evaluate(() => {
    const api = game.modules?.get("eidolon-utilities")?.api?.criteria;
    if (!api) return { status: "missing-api" };
    if (!game.scenes?.viewed) return { status: "no-scene" };

    const opened = api.openCriteriaSwitcher?.();
    const isOpen = Boolean(opened);
    api.closeCriteriaSwitcher?.();

    return {
      status: isOpen ? "opened" : "blocked",
      isGM: Boolean(game.user?.isGM)
    };
  });

  expect(result.status).not.toBe("missing-api");
  test.skip(result.status === "no-scene", "No active viewed scene is available in this world.");
  expect(result.isGM).toBe(true);
  expect(result.status).toBe("opened");
});

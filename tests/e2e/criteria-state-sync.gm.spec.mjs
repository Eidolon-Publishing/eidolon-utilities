import { expect, test } from "@playwright/test";
import { getStoragePath } from "./helpers/foundry-auth.mjs";
import { applyAnyCriteriaChange, readCriteriaValue } from "./helpers/criteria-engine.mjs";
import { assertFoundrySession } from "./helpers/session-assertions.mjs";

test("GM-applied criteria state is visible to player", async ({ browser, page }) => {
  await assertFoundrySession(page, { role: "gm", isGM: true });

  const applied = await applyAnyCriteriaChange(page);
  expect(applied.status).not.toBe("missing-api");
  test.skip(applied.status === "no-scene", "No active scene is available for criteria synchronization checks.");
  test.skip(applied.status === "no-criteria", "Scene has no criteria configured.");
  test.skip(applied.status === "no-usable-value", "No alternate criteria value is available to apply.");
  expect(applied.status).toBe("applied");

  const playerContext = await browser.newContext({ storageState: getStoragePath("player") });
  const playerPage = await playerContext.newPage();

  try {
    await assertFoundrySession(playerPage, { role: "player", isGM: false });

    await expect
      .poll(
        async () => {
          const observed = await readCriteriaValue(playerPage, applied.sceneId, applied.key);
          return observed.status === "ok" ? observed.value : null;
        },
        {
          timeout: 15_000,
          message: "Player session did not observe the criteria value applied by the GM."
        }
      )
      .toBe(applied.value);
  } finally {
    await playerContext.close();
  }
});

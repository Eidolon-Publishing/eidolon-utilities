import { expect } from "@playwright/test";
import {
  getFoundryUrl,
  getRoleCredentials,
  loginToFoundry,
  waitForFoundryReady
} from "./foundry-auth.mjs";

export async function assertFoundrySession(page, options = {}) {
  const { isGM, role } = options;

  await page.goto(getFoundryUrl(), { waitUntil: "domcontentloaded" });

  if (!await page.evaluate(() => Boolean(globalThis.game?.ready))) {
    if (role === "gm" || role === "player") {
      await loginToFoundry(page, getRoleCredentials(role));
    } else {
      await waitForFoundryReady(page);
    }
  }

  const snapshot = await page.evaluate(() => ({
    ready: Boolean(globalThis.game?.ready),
    userId: game?.user?.id ?? null,
    isGM: Boolean(game?.user?.isGM),
    sceneId: game?.scenes?.viewed?.id ?? game?.scenes?.active?.id ?? null
  }));

  expect(snapshot.ready).toBe(true);
  expect(snapshot.userId).toBeTruthy();
  if (typeof isGM === "boolean") {
    expect(snapshot.isGM).toBe(isGM);
  }

  return snapshot;
}

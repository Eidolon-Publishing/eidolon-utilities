import { test as setup } from "@playwright/test";
import {
  ensureAuthDir,
  getRoleCredentials,
  getStoragePath,
  loginToFoundry
} from "./helpers/foundry-auth.mjs";
import { seedCriteriaHarness } from "./helpers/seed-harness.mjs";

setup("authenticate GM session", async ({ page }) => {
  await ensureAuthDir();
  await loginToFoundry(page, getRoleCredentials("gm"));
  await seedCriteriaHarness(page);
  await page.context().storageState({ path: getStoragePath("gm") });
});

setup("authenticate player session", async ({ page }) => {
  await ensureAuthDir();
  await loginToFoundry(page, getRoleCredentials("player"));
  await page.context().storageState({ path: getStoragePath("player") });
});

import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: process.env.PLAYWRIGHT_ENV_FILE ?? ".env" });

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"], ["html", { open: "never" }]],
  timeout: 90_000,
  expect: {
    timeout: 10_000
  },
  use: {
    baseURL: process.env.FOUNDRY_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.mjs/
    },
    {
      name: "gm",
      testMatch: /.*\.gm\.spec\.mjs/,
      dependencies: ["setup"],
      use: {
        storageState: "tests/e2e/.auth/gm.json"
      }
    },
    {
      name: "player",
      testMatch: /.*\.player\.spec\.mjs/,
      dependencies: ["setup"],
      use: {
        storageState: "tests/e2e/.auth/player.json"
      }
    }
  ]
});


import fs from "node:fs/promises";
import path from "node:path";

const AUTH_DIR = "tests/e2e/.auth";

function requireEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getFoundryUrl() {
  return requireEnv("FOUNDRY_URL");
}

export function getRoleCredentials(role) {
  if (role === "gm") {
    return {
      username: requireEnv("GM_USERNAME"),
      password: requireEnv("GM_PASSWORD")
    };
  }

  if (role === "player") {
    return {
      username: requireEnv("PLAYER_USERNAME"),
      password: requireEnv("PLAYER_PASSWORD")
    };
  }

  throw new Error(`Unknown auth role: ${role}`);
}

export async function ensureAuthDir() {
  await fs.mkdir(AUTH_DIR, { recursive: true });
}

export function getStoragePath(role) {
  return path.join(AUTH_DIR, `${role}.json`);
}

async function selectUser(page, username) {
  const select = page.locator('select[name="userid"], select[name="user"]');
  if (await select.count()) {
    const node = select.first();
    try {
      await node.selectOption({ label: username });
      return;
    } catch (_error) {
      // Try exact value fallback.
    }

    const options = await node.locator("option").all();
    for (const option of options) {
      const label = (await option.textContent())?.trim();
      if (label?.toLowerCase() === username.toLowerCase()) {
        const value = await option.getAttribute("value");
        if (value) {
          await node.selectOption(value);
          return;
        }
      }
    }

    throw new Error(`Could not select Foundry user '${username}' from join dropdown.`);
  }

  const input = page.locator('input[name="userid"], input[name="username"], input[type="text"]');
  if (await input.count()) {
    await input.first().fill(username);
    return;
  }

  const title = await page.title();
  throw new Error(
    `Could not find a user selector/input on the Foundry join page (url=${page.url()}, title=${title}).`
  );
}

async function fillPassword(page, password) {
  const passwordInput = page.locator('input[name="password"], input[type="password"]');
  if (await passwordInput.count()) {
    await passwordInput.first().fill(password);
  }
}

async function submitJoin(page) {
  const submitButton = page.locator(
    'button[type="submit"], button:has-text("Join"), button:has-text("Enter"), button:has-text("Log")'
  );

  if (await submitButton.count()) {
    await submitButton.first().click();
    return;
  }

  const passwordInput = page.locator('input[name="password"], input[type="password"]');
  if (await passwordInput.count()) {
    await passwordInput.first().press("Enter");
    return;
  }

  throw new Error("Could not find a join submit action on the Foundry page.");
}

export async function waitForFoundryReady(page) {
  await page.waitForFunction(() => Boolean(globalThis.game?.ready), null, { timeout: 120_000 });
}

async function hasJoinControls(page) {
  return page.evaluate(() => {
    const selectors = [
      'select[name="userid"]',
      'select[name="user"]',
      'input[name="userid"]',
      'input[name="username"]',
      'input[type="password"]'
    ];

    return selectors.some((selector) => document.querySelector(selector));
  });
}

async function waitForJoinControls(page, timeoutMs = 30_000) {
  await page.waitForFunction(
    () => {
      const selectors = [
        'select[name="userid"]',
        'select[name="user"]',
        'input[name="userid"]',
        'input[name="username"]',
        'input[type="password"]'
      ];

      return selectors.some((selector) => document.querySelector(selector));
    },
    null,
    { timeout: timeoutMs }
  );
}

async function maybeUpgradeToHttps(page, joinUrl) {
  if (!joinUrl.startsWith("http://")) return joinUrl;

  const title = await page.title();
  const bodyText = (await page.textContent("body"))?.trim() ?? "";
  const looksLikeNginxWelcome = title.includes("Welcome to nginx") || bodyText.includes("Welcome to nginx");
  if (!looksLikeNginxWelcome) return joinUrl;

  const httpsUrl = `https://${joinUrl.slice("http://".length)}`;
  await page.goto(httpsUrl, { waitUntil: "domcontentloaded" });
  return httpsUrl;
}

export async function loginToFoundry(page, credentials) {
  let joinUrl = getFoundryUrl();
  await page.goto(joinUrl, { waitUntil: "domcontentloaded" });
  joinUrl = await maybeUpgradeToHttps(page, joinUrl);

  if (await page.evaluate(() => Boolean(globalThis.game?.ready))) {
    return;
  }

  if (!await hasJoinControls(page)) {
    await waitForJoinControls(page);
  }

  await selectUser(page, credentials.username);
  await fillPassword(page, credentials.password);

  await Promise.all([
    waitForFoundryReady(page),
    submitJoin(page)
  ]);
}

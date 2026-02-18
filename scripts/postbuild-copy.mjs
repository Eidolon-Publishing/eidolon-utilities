import { copyFile, cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DIST = "dist";

async function copyToDist(src, dest = src) {
  const destPath = path.join(DIST, dest);
  await mkdir(path.dirname(destPath), { recursive: true });

  if (existsSync(src)) {
    await cp(src, destPath, { recursive: true });
    console.log(`Copied: ${src} -> ${destPath}`);
  } else {
    console.warn(`Warning: ${src} not found, skipping`);
  }
}

async function main() {
  // --- Into dist/ (for zip packaging) ---
  await copyFile("module.json", path.join(DIST, "module.json"));
  console.log("Copied: module.json -> dist/module.json");

  await copyToDist("templates");

  // --- Back to repo root (so Foundry loads the fresh bundle) ---
  const JS = "eidolon-utilities.js";
  const CSS = "eidolon-utilities.css";

  await copyFile(path.join(DIST, JS), JS);
  console.log(`Copied: dist/${JS} -> ${JS}`);

  if (existsSync(path.join(DIST, CSS))) {
    await copyFile(path.join(DIST, CSS), CSS);
    console.log(`Copied: dist/${CSS} -> ${CSS}`);
  }

  console.log("\nBuild complete! dist/ ready for release, root updated for Foundry.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

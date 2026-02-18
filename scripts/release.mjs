#!/usr/bin/env node
/**
 * Bumps version in package.json + module.json, builds, and produces a
 * release/ directory containing module.json + eidolon-utilities.zip
 * ready for `gh release create`.
 *
 * Usage:
 *   node scripts/release.mjs patch   # 1.1.2 → 1.1.3
 *   node scripts/release.mjs minor   # 1.1.2 → 1.2.0
 *   node scripts/release.mjs major   # 1.1.2 → 2.0.0
 *   node scripts/release.mjs 1.2.0   # explicit version
 */
import { readFile, writeFile, copyFile, mkdir, rm } from "node:fs/promises";
import { execSync } from "node:child_process";
import path from "node:path";

const REPO = "Eidolon-Publishing/eidolon-utilities";
const RELEASE_DIR = "release";

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split(".").map(Number);
  switch (type) {
    case "major": return `${major + 1}.0.0`;
    case "minor": return `${major}.${minor + 1}.0`;
    case "patch": return `${major}.${minor}.${patch + 1}`;
    default: {
      // Treat as explicit version if it looks like semver
      if (/^\d+\.\d+\.\d+$/.test(type)) return type;
      console.error(`Invalid bump type: ${type}. Use patch, minor, major, or an explicit version.`);
      process.exit(1);
    }
  }
}

async function main() {
  const type = process.argv[2];
  if (!type) {
    console.error("Usage: node scripts/release.mjs <patch|minor|major|x.y.z>");
    process.exit(1);
  }

  // Read current version from package.json
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const newVersion = bumpVersion(pkg.version, type);
  const tag = `v${newVersion}`;

  console.log(`Bumping ${pkg.version} → ${newVersion}\n`);

  // Update package.json
  pkg.version = newVersion;
  await writeFile("package.json", JSON.stringify(pkg, null, 2) + "\n");
  console.log("Updated: package.json");

  // Update module.json
  const mod = JSON.parse(await readFile("module.json", "utf-8"));
  mod.version = newVersion;
  mod.download = `https://github.com/${REPO}/releases/download/${tag}/eidolon-utilities.zip`;
  await writeFile("module.json", JSON.stringify(mod, null, 2) + "\n");
  console.log("Updated: module.json");

  // Build + package
  console.log("\nBuilding...");
  execSync("npm run package", { stdio: "inherit" });

  // Prepare release/ directory
  await rm(RELEASE_DIR, { recursive: true, force: true });
  await mkdir(RELEASE_DIR, { recursive: true });
  await copyFile("module.json", path.join(RELEASE_DIR, "module.json"));
  await copyFile("eidolon-utilities.zip", path.join(RELEASE_DIR, "eidolon-utilities.zip"));

  console.log(`\n--- Release ${tag} ready ---`);
  console.log(`  release/module.json`);
  console.log(`  release/eidolon-utilities.zip`);
  console.log(`\nTo publish:`);
  console.log(`  gh release create ${tag} release/module.json release/eidolon-utilities.zip --title "${tag}" --repo ${REPO}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

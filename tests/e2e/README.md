# Playwright E2E Scaffolding

This folder contains a baseline Playwright setup for Foundry credentialed tests.

## 1) Configure credentials

Copy `.env.example` to `.env` and fill in:

- `FOUNDRY_URL`
- `GM_USERNAME` / `GM_PASSWORD`
- `PLAYER_USERNAME` / `PLAYER_PASSWORD`

Use a full world join URL (for example `https://foundry.example.com/join`).

## 2) Install browser runtime

```bash
npm run e2e:install
```

## 3) Run tests

```bash
npm run e2e
```

Fast PR-oriented subset:

```bash
npm run e2e:fast
```

The suite creates role-specific auth storage states under `tests/e2e/.auth/`.

## Deterministic seeding

During the setup project (`auth.setup.mjs`), the GM session seeds/upserts a deterministic harness scene:

- Scene name: `E2E Criteria Harness` (override with `E2E_SCENE_NAME`)
- Scene criteria: 3 test criteria keys (`e2e-weather`, `e2e-phase`, `e2e-mode`)
- Ambient light: 1 tagged harness light + stacked light criteria mappings
- Tile: 1 tagged harness tile + MATT file entries + tile criteria mappings

This makes E2E runs less dependent on ad-hoc world content and reduces flaky skips.

## CI tiers

- PR/Main CI (`.github/workflows/ci.yml`):
  - `unit` job always runs.
  - `e2e_fast` job runs when Foundry credentials are configured as repository secrets.
- Nightly/Manual (`.github/workflows/e2e-nightly.yml`):
  - runs the full E2E suite.

Required secrets for CI E2E jobs:

- `E2E_FOUNDRY_URL`
- `E2E_GM_USERNAME`
- `E2E_GM_PASSWORD`
- `E2E_PLAYER_USERNAME`
- `E2E_PLAYER_PASSWORD`

See `CONTRIBUTING.md` for a concise contributor checklist and CI tier overview.

## Included baseline tests

- `criteria-switcher.gm.spec.mjs`: GM can open criteria switcher via module API.
- `criteria-switcher.player.spec.mjs`: player cannot open criteria switcher via module API.
- `criteria-state-sync.gm.spec.mjs`: GM applies criteria state and player session observes the same persisted value.
- `criteria-state-guard.player.spec.mjs`: player API attempts to apply state are blocked by permission checks.
- `harness-seed.gm.spec.mjs`: validates deterministic harness scene/documents/criteria baseline seeded during setup.
- `scene-criteria-crud.gm.spec.mjs`: GM scene-criteria create/update round-trip via API with automatic restore.
- `tile-criteria-resolution.gm.spec.mjs`: GM applies scene criteria and a tile variant update is verified via both API state and raw MATT/module flags.
- `light-criteria-resolution.gm.spec.mjs`: GM applies scene criteria and ambient light mapping resolution is verified via both API state and raw module flags.
- `light-criteria-stacked-mutations.gm.spec.mjs`: applies a scene criteria switch with three additive light mappings (two numeric fields + `hidden`), then verifies full revert to base values.
- `conflict-resolution-order.gm.spec.mjs`: intentionally injects overlapping tile/light mappings, validates tile conflict diagnostics (error + warning paths), and verifies deterministic tie resolution by rule order.

## Helpers

- `helpers/foundry-auth.mjs`: login + role storage-state bootstrap utilities.
- `helpers/session-assertions.mjs`: session sanity assertions (ready + role checks).
- `helpers/criteria-engine.mjs`: module API helpers for applying/reading criteria state.

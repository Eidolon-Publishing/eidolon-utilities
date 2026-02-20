# Contributing

## Local validation

Run unit tests:

```bash
npm run test:run
```

Run fast E2E subset:

```bash
npm run e2e:fast
```

Run full E2E suite:

```bash
npm run e2e
```

## GitHub Actions E2E secrets

The CI workflows run E2E only when these repository secrets are configured:

- `E2E_FOUNDRY_URL`
- `E2E_GM_USERNAME`
- `E2E_GM_PASSWORD`
- `E2E_PLAYER_USERNAME`
- `E2E_PLAYER_PASSWORD`

Optional local env override for deterministic harness scene naming:

- `E2E_SCENE_NAME` (default: `E2E Criteria Harness`)

## Workflow tiers

- `.github/workflows/ci.yml`
  - `unit` always runs.
  - `e2e_fast` runs when E2E secrets exist.
- `.github/workflows/e2e-nightly.yml`
  - full E2E run on schedule and manual dispatch.


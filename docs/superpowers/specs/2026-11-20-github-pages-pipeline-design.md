# GitHub pipeline: run tests on push, host on main

Date: 2026-11-20

## Intent

Run the test suite on every push (feature branches and main). When pushing to main, additionally build and host the site on GitHub Pages, so the 2 latest deploys are around in case of a rollback.

## Goals

- Tests execute on every push to any branch (covers feature branches and main).
- On every push to main: tests pass first, then the built site is deployed to GitHub Pages (`actions/deploy-pages`).
- Each main deploy is a real Pages deployment — the 2 latest are visible in the Pages deployment history.
- Each main deploy also uploads the built `dist/` as a GitHub Actions artifact named `site-v{run_number}` (30-day retention), so the recent deploys' builds are downloadable snapshots for rollback.

## Non-goals

- No Pages-source change in settings (user's call; see constraints).
- No automatic rollback workflow or branch cleanup.
- No changes to the site source.

## Constraints (calls made)

- Test command per README: `node --test src/bracketData.test.js`. Build: `npm run install` → `npm run build`. Runner: `ubuntu-latest`, Node 20.
- Repo needs `permissions: pages: write` and `id-token: write` for deploy-pages; `contents: read` for checkout.

## Design

One workflow file: `.github/workflows/ci.yml`

- Job `test` — runs on every push (main and feature branches):
  - `actions/checkout@v4`
  - `actions/setup-node@v4` with `node-version: '20'`
  - `npm ci`
  - `node --test src/bracketData.test.js`
- Job `deploy` — `if: github.ref == 'refs/heads/main'`, `needs: test`:
  - `actions/checkout@v4`
  - `actions/setup-node@v4` with `node-version: '20'`
  - `npm ci`
  - `npm run build`
  - `actions/upload-artifact@v4`: name `site-v${{ github.run_number }}`, path `dist/`, retention-days 30
  - `actions/deploy-pages@v4`

Rollback: download the artifact of an older main deploy and redeploy it; the 2 latest Pages deployments are also in the Pages settings history.

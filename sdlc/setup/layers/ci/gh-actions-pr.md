# CI layer: gh-actions-pr

GitHub Actions CI that runs on every PR to main. Lint, type-check, unit tests, integration tests. e2e is optional and gated behind a label or manual trigger to keep PR checks fast.

## Identity

```json
{
  "layer": "ci",
  "id": "gh-actions-pr",
  "label": "GitHub Actions — PR checks (lint + unit + integration)"
}
```

## Workflow file to generate

### `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint, type-check, test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type-check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Unit tests
        run: npm run test:unit

      - name: Integration tests
        run: npm run test:integration
        env:
          # Add any env vars your integration tests need
          NODE_ENV: test
```

### `.github/workflows/e2e.yml` (separate, manual or label-triggered)

```yaml
name: E2E tests

on:
  workflow_dispatch:
  pull_request:
    types: [labeled]

jobs:
  e2e:
    if: github.event_name == 'workflow_dispatch' || contains(github.event.pull_request.labels.*.name, 'run-e2e')
    name: Playwright e2e
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build
        run: npm run build

      - name: Run e2e tests
        run: npm run test:e2e

      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

## Notes

- e2e is intentionally separate — Playwright installs are slow (~500MB) and e2e tests are slower
- Add the `run-e2e` label to a PR to trigger e2e in CI
- Branch protection: require the `ci` job to pass before merge
- Add env secrets via GitHub repo Settings → Secrets and variables → Actions

# Testing layer: vitest-playwright

Vitest for unit and integration tests (separate configs), Playwright for e2e. The full testing stack from the chatbot-platform reference project.

## Identity

```json
{
  "layer": "testing",
  "id": "vitest-playwright",
  "label": "Vitest (unit + integration) + Playwright (e2e)"
}
```

## Dependencies

```json
{
  "devDependencies": {
    "vitest": "^4.x",
    "@vitest/ui": "^4.x",
    "@vitest/coverage-v8": "^4.x",
    "happy-dom": "^20.x",
    "@playwright/test": "^1.x"
  }
}
```

## Scripts

```json
{
  "test": "npm run test:unit && npm run test:integration",
  "test:all": "npm run test:unit && npm run test:integration && npm run test:e2e",
  "test:unit": "vitest run --exclude 'tests/integration/**'",
  "test:unit:watch": "vitest",
  "test:unit:coverage": "vitest run --coverage --exclude 'tests/integration/**'",
  "test:ui": "vitest --ui --api.port 60001",
  "test:integration": "vitest run --config vitest.integration.config.ts",
  "test:integration:coverage": "vitest run --config vitest.integration.config.ts --coverage",
  "test:coverage": "npm run test:unit:coverage && npm run test:integration:coverage",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

## Config files to generate

### `vitest.config.ts` (unit)

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    exclude: ['tests/integration/**', 'tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

### `vitest.integration.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/integration/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Directory structure to create

```
tests/
├── unit/           # co-located with src is also fine
├── integration/
└── e2e/
```

## Notes

- Unit tests use `happy-dom` — fast, no real browser
- Integration tests use `node` environment — real DB/API calls, needs env vars
- e2e uses Playwright against a running dev server
- Run `npx playwright install` after `npm install` to get browser binaries
- Add `playwright-report/` and `test-results/` to `.gitignore`

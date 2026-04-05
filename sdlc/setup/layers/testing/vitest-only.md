# Testing layer: vitest-only

Vitest for unit tests only. No integration test split, no e2e. Good for libraries, APIs, and early-stage projects.

## Identity

```json
{
  "layer": "testing",
  "id": "vitest-only",
  "label": "Vitest (unit only)"
}
```

## Dependencies

```json
{
  "devDependencies": {
    "vitest": "^4.x",
    "@vitest/coverage-v8": "^4.x",
    "happy-dom": "^20.x"
  }
}
```

## Scripts

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Config files to generate

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
});
```

## Notes

- Upgrade path: add `vitest.integration.config.ts` and Playwright later without restructuring
- For Node.js APIs, swap `happy-dom` for `node` environment

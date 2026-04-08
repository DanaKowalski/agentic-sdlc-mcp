# Testing Strategy

This document defines testing expectations for the agentic-sdlc-mcp codebase. The review agent checks implementation against these expectations. The implementation agent follows these conventions when writing tests.

For the broader role of testing in the SDLC — separate from implementation-time test writing — see `sdlc/testing/README.md`.

---

## Test Types and When Each Is Required

### Unit tests — required

Write unit tests for:
- All pure functions (data transformation, validation, formatting logic)
- All functions that apply business rules or conditional logic
- Any utility that is called from more than one place

Do not write unit tests for:
- Config files (`config/`)
- Type definitions (`.d.ts`, standalone `interface` or `type` declarations)
- Template files (`sdlc/`, `docs/`)
- The MCP server entry point (`src/index.ts`) — covered by integration tests

### Integration tests — required

Write integration tests for:
- All MCP tool handlers — invoke the tool through the MCP server context, not by calling the handler function directly
- Any handler that reads from or writes to the filesystem or an external API

Integration tests that require live external services (GitHub API, etc.) must be skippable when the relevant environment variables are absent. See "Running tests" below.

### Contract tests — optional

Write contract tests when:
- This server integrates with an external MCP server whose tool schema may change independently
- A third-party API response shape is critical and the provider does not publish a stable schema

Contract tests are not required for standard implementation tasks. Add them only when the orchestrator or design document explicitly calls for them.

---

## Test Structure Conventions

### File location

Tests live alongside the source file they cover.

```
src/tools/generate-prd.ts
src/tools/generate-prd.test.ts
```

### Test file anatomy

```typescript
// [test runner imports — e.g. describe, it, expect, beforeEach, afterEach]
import { functionUnderTest } from "./module-under-test.js";

describe("functionUnderTest", () => {
  // Setup that applies to all tests in this block
  beforeEach(() => { /* ... */ });
  afterEach(() => { /* ... */ });

  it("returns X when given valid input Y", () => {
    // arrange
    // act
    // assert
  });

  it("throws McpToolError when the API returns 500", () => {
    // ...
  });
});
```

Naming rules:
- `describe` block: the name of the function, class, or module under test
- `it` string: `"<verb> <what> when <condition>"` — reads as a sentence
- No `test()` aliases — use `it()` consistently

### Setup and teardown

- Use `beforeEach` / `afterEach` for state that must be reset between tests
- Use `beforeAll` / `afterAll` only for expensive setup that is truly safe to share (e.g. starting a test server once)
- Do not rely on test execution order — each test must be independent

### Mocking MCP context and tool arguments

To test a tool handler in isolation, pass a minimal mock context:

```typescript
const mockContext = {
  log: { info: [mock function from your test runner], error: [mock function from your test runner] },
};

const args = { query: "open bugs", labels: ["bug"] };

const result = await searchIssues(args, mockContext);
```

For integration tests, start a local MCP server instance and invoke the tool through the MCP client. Do not mock the MCP transport layer in integration tests — that defeats the purpose.

### Testing error paths

Every error case that is handled in source code must have a corresponding test. This includes:
- External API failures (mock the API client to throw or return an error response)
- Invalid or missing arguments (pass malformed input and assert on the error type and message)
- Filesystem errors (mock `fs` to reject where the code handles it)

Do not test only the happy path and call it done. The review agent will check for error path coverage.

---

## Coverage Expectations

| Expectation | Rule |
|---|---|
| Minimum | Every exported function has at least one test |
| Required | Every acceptance criterion in the implementation agent prompt maps to at least one test |
| Required | Every error case handled in code has a corresponding test |
| Not required | 100% line or branch coverage — coverage metrics are a guide, not a gate |

Coverage tools are not configured to enforce a percentage threshold. The review agent reads the tests and verifies criterion mapping manually.

---

## Running Tests

### Before writing the completion report

The implementation agent must run tests before writing its output file. Do not self-report `Tests passing: yes` without running them.

Run the project's unit test command — typically `npm run test:unit` but defined in the project's `package.json`:

```bash
[test command]
```

### What "passing" means

Zero failures. If any test fails, the implementation report must say so. Do not hide failures in the completion report — the review agent will run tests independently.

Zero tests is not passing. If `[test command]` reports no tests found for a module that requires them, that is a failure.

### Tests that require environment variables

Integration tests that call external services must check for required environment variables at the start of the test file and skip gracefully if they are absent:

```typescript
// skip this suite when required env var is absent — use your test runner's conditional skip API
```

Required environment variables for local testing are documented in `.env.example`. See `environment-setup.md` for setup instructions.

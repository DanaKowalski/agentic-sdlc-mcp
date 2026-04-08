# Testing Strategy

This document defines testing expectations for any project using this SDLC framework.
The review agent checks implementation against these expectations. The implementation
agent follows these conventions when writing tests.

For the broader role of testing in the SDLC — separate from implementation-time test
writing — see `sdlc/testing/README.md`.

---

## Test Types and When Each Is Required

### Unit tests — required

Write unit tests for:
- All pure functions (data transformation, validation, formatting logic)
- All functions that apply business rules or conditional logic
- Any utility that is called from more than one place

Do not write unit tests for:
- Config files
- Type definitions (`.d.ts`, standalone `interface` or `type` declarations)
- Template files (`sdlc/`, `docs/`)
- The server entry point — covered by integration tests

### Integration tests — required

Write integration tests for:
- All MCP tool handlers — invoke the tool through the MCP server context, not by
  calling the handler function directly
- Any handler that reads from or writes to the filesystem or an external API

Integration tests that require live external services must be skippable when the
relevant environment variables are absent. See "Running tests" below.

### End-to-end tests — testing phase only

End-to-end tests — verifying a full tool invocation through a real MCP client
against a running server — are a testing phase concern, not an implementation phase
concern. Do not write E2E tests during implementation. See `sdlc/testing/README.md`
for when and how E2E testing applies.

### Contract tests — optional

Write contract tests when:
- This project integrates with an external MCP server whose tool schema may change
  independently
- A third-party API response shape is critical and the provider does not publish a
  stable schema

Contract tests are not required for standard implementation tasks. Add them only when
the orchestrator or design document explicitly calls for them.

---

## Test Structure Conventions

### File location

Tests live alongside the source file they cover:
```
[src]/[module]/feature-name.ts
[src]/[module]/feature-name.test.ts
```

Do not create a separate `tests/` directory tree. Co-location makes it obvious when
a source file has no corresponding test.

### Test file anatomy

```typescript
// [test runner imports — e.g. describe, it, expect, beforeEach, afterEach]
import { functionUnderTest } from "./module-under-test.js";

describe("functionUnderTest", () => {
  beforeEach(() => { /* reset state before each test */ });
  afterEach(() => { /* clean up after each test */ });

  it("returns expected output when given valid input", () => {
    // arrange
    // act
    // assert
  });

  it("throws a typed error when the external service returns 500", () => {
    // arrange
    // act
    // assert
  });
});
```

Naming rules:
- `describe` block: the name of the function, class, or module under test
- `it` string: `"<verb> <what> when <condition>"` — reads as a complete sentence
- No `test()` aliases — use `it()` consistently
- One behavior per test — not one function per test

### Setup and teardown

- Use `beforeEach` / `afterEach` for state that must be reset between tests
- Use `beforeAll` / `afterAll` only for expensive setup that is genuinely safe to
  share (e.g. starting a test server once for a suite)
- Do not rely on test execution order — each test must be fully independent

### Mocking

To test a handler in isolation, pass a minimal mock context using your test runner's
spy or mock function:

```typescript
const mockContext = {
  log: {
    info: [spy from your test runner],
    error: [spy from your test runner],
  },
};

const args = { query: "example input" };
const result = await handlerUnderTest(args, mockContext);
```

Replace `[spy from your test runner]` with the appropriate mock function for your
configured test runner (e.g. `vi.fn()` for Vitest, `jest.fn()` for Jest).

For integration tests, start a local server instance and invoke the tool through the
MCP client. Do not mock the MCP transport layer in integration tests — that defeats
the purpose.

### Testing error paths

Every error case that is explicitly handled in source code must have a corresponding
test. This includes:

- External service failures — mock the client to throw or return an error response
- Invalid or missing arguments — pass malformed input and assert on the error type
  and message
- Filesystem errors — mock `fs` to reject where the code handles it

Do not test only the happy path. The review agent will specifically check for error
path coverage.

---

## Coverage Expectations

| Expectation | Rule |
|---|---|
| Minimum | Every exported function has at least one test |
| Required | Every acceptance criterion in the implementation agent prompt maps to at least one test |
| Required | Every error case handled in code has a corresponding test |
| Not required | 100% line or branch coverage — coverage metrics are a guide, not a gate |

Coverage tools are not configured to enforce a percentage threshold. The review agent
reads the tests and verifies criterion mapping manually, not by coverage report.

---

## Running Tests

### Before writing the completion report

The implementation agent must run tests before writing its output file. Do not
self-report `Tests passing: yes` without running them.

Run the project's unit test command — defined in the project's `package.json`,
typically as `test:unit`:

```bash
[test command]
```

### What "passing" means

Zero failures. If any test fails, the implementation report must say so explicitly.
Do not hide failures — the review agent runs tests independently and will catch them.

Zero tests found is not passing. If `[test command]` reports no tests found for a
module that requires them, that is a failure. Report it as such.

### Tests that require environment variables

Integration tests that call external services must check for required environment
variables at the start of the test file and skip the suite gracefully if they are
absent — use your test runner's conditional skip API:

```typescript
// Example pattern — syntax varies by test runner:
// skipIf(!process.env.REQUIRED_VAR)("suite name", () => { ... })
```

Required environment variables for local testing must be documented in `.env.example`.
See `environment-setup.md` for setup instructions.

---

## Review Agent Hook

The review agent must run tests independently and must not accept the implementation
agent's self-reported test results as ground truth. See `sdlc/agents/review-agent.md`
for the full review checklist.

If the review agent finds that tests pass per the implementation report but fail when
run independently, the verdict is `blocked` regardless of other results.
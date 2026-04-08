# Coding standards

Language: TypeScript. Runtime: Node 18+. Modules: ESM (`"type": "module"`).

---

## File and directory naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Source files | kebab-case | `generate-prd.ts` |
| Test files | kebab-case + `.test` | `generate-prd.test.ts` |
| Directories | kebab-case | `mcp-server/tools/` |
| Index files | avoid in `tools/` — import directly | — |

One primary export per file. Keep files under ~200 lines — split if larger. Co-locate types with the code that uses them unless they are shared across modules.

---

## Import conventions

- Use `node:` prefix for all Node built-ins: `import fs from "node:fs"`
- No bare built-in imports (`import fs from "fs"` is not acceptable)
- Import order (enforced by linter where configured):
  1. Node built-ins (`node:*`)
  2. External packages
  3. Internal modules (relative paths)
- No barrel `index.ts` re-exports inside `tools/` — import the file directly

---

## TypeScript type rules

- Strict mode on (`"strict": true` in tsconfig)
- No `any` — use `unknown` and narrow, or define a proper type
- Prefer `interface` for object shapes, `type` for unions and aliases
- **All exported functions must have explicit return types** — do not rely on inference
- Export types explicitly — do not rely on type inference leaking through re-exports
- `async`/`await` over raw Promises
- Handle errors explicitly — no silent catches
- All exported functions must have explicit return types

| Thing | Convention | Example |
|-------|-----------|---------|
| Variables / functions | camelCase | `generatePrd` |
| Types / interfaces | PascalCase | `PrdTemplate` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Enums | PascalCase members | `Phase.Planning` |

---

## Function design

- Single responsibility: each function does one thing and does it completely
- Functions longer than ~40 lines are a signal to split, not a hard rule — use judgment
- Prefer pure functions; isolate side effects at the boundary
- Do not pass more than 3–4 positional arguments — use an options object instead
- Avoid boolean parameters that alter behavior (`doThing(true)` — unclear at callsite); use named options

---

## Error handling

- Never swallow errors silently
- Throw typed errors where possible (`class McpToolError extends Error {}`)
- Log errors with enough context to debug without a debugger (include relevant IDs, paths, inputs)
- Do not re-throw a generic `Error` if a typed one exists — preserve error type through the call stack
- `catch (e: unknown)` — narrow before accessing properties

---

## Logging

- **No `console.log` in production code** — it is a review-blocking violation
- Use a named logger instance: `const logger = createLogger("tool-name")`
- Log at the appropriate level: `logger.info`, `logger.warn`, `logger.error`
- Structured log fields are preferred over interpolated strings for machine-readable output
- `console.log` is acceptable only inside one-off scripts in `scripts/` that are never imported

---

## Environment variable handling

- All environment variables are accessed through a single config module — never call `process.env.X` directly in business logic
- Required variables must be validated at startup; missing required vars should throw at boot, not at runtime
- Document every variable used by the project in `.env.example` with a comment describing its purpose
- Never hardcode secrets, tokens, or credentials — not even in comments
- Default values for optional variables should be declared in the config module, not scattered across callers

---

## Code comment expectations

- Comments explain *why*, not *what*
- If you need a comment to explain what the code does, simplify the code first
- JSDoc on all exported functions — include `@param`, `@returns`, and `@throws` where applicable
- TODO comments must include a ticket reference or a date: `// TODO(2026-05-01): remove after migration`
- Do not leave commented-out code in committed files

---

## Logging
- No `console.log` in production code — use a named logger
- `console.log` is acceptable only in one-off scripts never imported by other modules

## Testing

- Tests live alongside the code they test: `generate-prd.test.ts`
- Unit test pure functions; integration test MCP tool handlers
- Test file naming: `*.test.ts`
- Run `npm run test:unit` before writing the completion report

# Coding standards

Language: TypeScript. Runtime: Node 18+. Modules: ESM (`"type": "module"`).

---

## TypeScript

- Strict mode on (`"strict": true` in tsconfig)
- No `any` — use `unknown` and narrow, or define a proper type
- Prefer `interface` for object shapes, `type` for unions and aliases
- Export types explicitly — do not rely on inference leaking through
- `async`/`await` over raw Promises
- Handle errors explicitly — no silent catches
- All exported functions must have explicit return types

## Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Files | kebab-case | `generate-prd.ts` |
| Variables / functions | camelCase | `generatePrd` |
| Types / interfaces | PascalCase | `PrdTemplate` |
| Constants | SCREAMING_SNAKE | `MAX_RETRIES` |
| Enums | PascalCase members | `Phase.Planning` |

## File structure

- One primary export per file
- Keep files under ~200 lines — split if larger
- Co-locate types with the code that uses them unless shared

## Imports

- Use `node:` prefix for built-ins (`import fs from "node:fs"`)
- No barrel `index.ts` re-exports inside `tools/` — import directly
- Order: node built-ins → external packages → internal modules

## Error handling

- Never swallow errors silently
- Throw typed errors where possible (`class McpToolError extends Error {}`)
- Log errors with enough context to debug without a debugger

## Comments

- Comments explain *why*, not *what*
- If you need a comment to explain what the code does, simplify the code first
- JSDoc on all exported functions

## Logging
- No `console.log` in production code — use a named logger
- `console.log` is acceptable only in one-off scripts never imported by other modules

## Testing

- Tests live alongside the code they test: `generate-prd.test.ts`
- Unit test pure functions; integration test MCP tool handlers
- Test file naming: `*.test.ts`

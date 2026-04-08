# Task Breakdown

**Feature slug:** {{FEATURE_SLUG}}  
**PRD reference:** {{PRD_PATH}}  
**Technical design reference:** {{TECHNICAL_DESIGN_PATH}}  
**Date:** {{DATE}}  
**Total task count:** {{N}}

---

## How to use this template

The orchestrator fills out one task block per implementation unit before spawning any agents. A task must be statable in one sentence. If it cannot be, break it down further.

Rules:
- Tasks with conflicting file lists must run sequentially, not in parallel
- Every task flagged `research: yes` must have its research agent output committed before the implementation agent is spawned
- Acceptance criteria are copied verbatim into the implementation agent prompt and the review agent prompt

---

## Task 1 — {{TASK_TITLE}}

**Task (one sentence):** {{SINGLE_SENTENCE_DESCRIPTION}}

**Source design artifact:** {{TECHNICAL_DESIGN_SECTION_OR_ADR}}

**Research required:** yes | no  
**Research reason:** {{REASON_OR_N/A}}

**Parallel-safe:** yes | no  
**Conflicts with:** Task {{N}} (shares `{{SHARED_FILE}}`) | none

### File allowlist

Files this agent may write or edit:

- `{{FILE_PATH_1}}`
- `{{FILE_PATH_2}}`

### File blocklist

Files this agent must not touch:

- `sdlc/`
- `.github/`
- `config/`
- `docs/` (except its own output at `docs/agents/`)
- `{{ANY_OTHER_RESTRICTED_FILE}}`

### Acceptance criteria

1. {{CRITERION_1}}
2. {{CRITERION_2}}
3. {{CRITERION_3}}

---

## Task 2 — {{TASK_TITLE}}

**Task (one sentence):** {{SINGLE_SENTENCE_DESCRIPTION}}

**Source design artifact:** {{TECHNICAL_DESIGN_SECTION_OR_ADR}}

**Research required:** yes | no  
**Research reason:** {{REASON_OR_N/A}}

**Parallel-safe:** yes | no  
**Conflicts with:** Task {{N}} (shares `{{SHARED_FILE}}`) | none

### File allowlist

- `{{FILE_PATH_1}}`

<!-- Adjust the blocklist below to match your project's protected directories -->
### File blocklist

- `sdlc/`
- `.github/`
- `config/`
- `docs/` (except its own output at `docs/agents/`)

### Acceptance criteria

1. {{CRITERION_1}}
2. {{CRITERION_2}}
3. {{CRITERION_3}}

---

<!-- Add additional task blocks as needed. Copy the block above. -->

---

## Worked Example — Add `search_issues` MCP Tool

> **Note:** The paths, type names, and script names below are illustrative.
> Replace them with the actual values for your project.

The following is a complete, filled-out example. Use it as a pattern when completing tasks above.

---

**Feature slug:** `search-issues`  
**PRD reference:** `docs/planning/PRD-search-issues.md`  
**Technical design reference:** `docs/design/2026-04-07-search-issues-technical-design.md`  
**Date:** 2026-04-07  
**Total task count:** 3

---

### Example Task 1 — Implement `search_issues` tool handler

**Task (one sentence):** Implement the `search_issues` MCP tool handler in `[src]/[module]/search-issues.ts` that accepts a `query` string and optional `labels` array and returns a paginated list of matching GitHub issues.

**Source design artifact:** Technical Design §4 (API / Interface Design), ADR-{{NUMBER}}

**Research required:** yes  
**Research reason:** The existing MCP tool registration pattern must be read before adding a new tool to confirm the registration approach and argument schema conventions used in this codebase.

**Parallel-safe:** no  
**Conflicts with:** Example Task 2 (both write to `[src]/[module]/search-issues.ts`)

#### File allowlist

- `[src]/[module]/search-issues.ts`
- `[src]/[module]/search-issues.test.ts`

#### File blocklist

- `sdlc/`
- `.github/`
- `config/`
- `docs/` (except `docs/agents/`)
- `[src]/index.[ext]` (registration is handled in Example Task 3)
- Any other file not listed above

#### Acceptance criteria

1. The tool handler accepts `{ query: string; labels?: string[] }` and returns `{ issues: Issue[]; nextPage: number | null }` where `Issue` matches the type defined in Technical Design §3.
2. If the GitHub API returns an error, the handler throws a typed `[ProjectError]` with the HTTP status code included in the message — it does not swallow the error or return an empty array silently.
3. Unit tests in `search-issues.test.ts` cover: the happy path with results, the happy path with zero results, and the error path (GitHub API returns 500).
4. `npm run test:unit` passes with zero failures after implementation.

---

### Example Task 2 — Write integration tests for `search_issues`

**Task (one sentence):** Write integration tests for the `search_issues` MCP tool handler that invoke the handler through the MCP server context and assert on the returned structure.

**Source design artifact:** Technical Design §5 (Component Design — Testing Notes), `sdlc/implementation/testing-strategy.md`

**Research required:** no  
**Research reason:** N/A — research agent output from Example Task 1 covers the handler interface.

**Parallel-safe:** no  
**Conflicts with:** Example Task 1 (both write to `[src]/[module]/search-issues.test.ts`)

#### File allowlist

- `[src]/[module]/search-issues.test.ts`

#### File blocklist

- `sdlc/`
- `.github/`
- `config/`
- `docs/` (except `docs/agents/`)
- `[src]/[module]/search-issues.ts` (must not edit source — only the test file)

#### Acceptance criteria

1. Integration tests invoke `search_issues` through a real MCP server context (not a direct function call) and assert the response shape matches the contract in Technical Design §4.
2. At least one test covers an invalid argument (missing `query`) and asserts the server returns an MCP error response rather than throwing unhandled.
3. Tests do not hardcode GitHub API responses — they use a local mock that can be swapped via environment variable per `sdlc/implementation/testing-strategy.md`.
4. `npm run test:unit` passes with zero failures after implementation.

---

### Example Task 3 — Register `search_issues` in the MCP server

**Task (one sentence):** Register the `search_issues` tool handler in `[src]/index.[ext]` following the existing tool registration pattern so the tool is available to MCP clients.

**Source design artifact:** Technical Design §5 (Component Design — Server Registration)

**Research required:** no  
**Research reason:** N/A — registration pattern confirmed during Example Task 1 research.

**Parallel-safe:** yes  
**Conflicts with:** none (this task writes only to `[src]/index.[ext]`; no other task in this breakdown touches that file)

#### File allowlist

- `[src]/index.[ext]`

#### File blocklist

- `sdlc/`
- `.github/`
- `config/`
- `docs/` (except `docs/agents/`)
- `[src]/[module]/search-issues.ts`
- `[src]/[module]/search-issues.test.ts`

#### Acceptance criteria

1. `search_issues` appears in the tool list returned by the MCP server's tool discovery endpoint after registration.
2. The registration follows the identical pattern used by at least one existing tool in `[src]/index.[ext]` — no new registration mechanism is introduced.
3. `npm run build` succeeds with zero TypeScript errors after registration.

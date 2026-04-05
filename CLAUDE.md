# CLAUDE.md — sdlc-mcp context

Loaded automatically by Claude Code at session start.

## What this repo is

Foundational SDLC repository. Gives AI tools structured knowledge of the development lifecycle and exposes active commands for creating deliverables.

---

## Always use Context7 for library docs

Before referencing any npm package, framework, or library API — call Context7 to fetch current documentation. Do not rely on training data for package specifics. Training data goes stale; Context7 does not.

---

## Tools (always on — call autonomously)

| Tool | When to use it |
|------|---------------|
| `context7` | Any time a library, framework, or npm package is mentioned — fetch current docs before answering |
| `sdlc-gitmcp` | Session start orientation, reading templates and past outputs |
| `filesystem` | Reading/writing local project files |
| `sdlc` MCP | Exposes the commands below |

---

## Cross-session and cross-tool continuity

This repo is the persistent memory layer across all AI tools. Any session — whether in Claude Code, Cursor, Roo, or any other tool — must begin by reading current state before doing new work.

### Standard session opening pattern

```
1. Read `sdlc/memory/quick-ref.md`       — commands, triggers, agent roles (one page)
2. Read `docs/memory/project-state.md`   — current phase, open work, last session summary
3. If project-state.md does not exist    — this is a new project, create it before proceeding
4. Tell the user what you found and ask: "We are in the [phase] phase. Open work: [list]. Last session: [summary]. Where would you like to pick up?"
```

Do not skip step 2. A session that starts without reading project state will duplicate work or contradict past decisions.

For deeper context on any phase, commands, or agent rules — read the relevant `sdlc/` doc. The quick-ref is orientation, not a replacement for the full docs.

### Standard session closing pattern

Before ending any session:

```
1. Update `docs/memory/project-state.md` with current phase, what was completed, what is open, any decisions not yet in an ADR
2. Commit and push:
   git add docs/memory/
   git commit -m "docs(memory): update project state — <one word describing session>"
   git push
```

Use conventional commit format for all other commits:
- `docs(planning): update PRD for auth feature`
- `feat(mcp): add release-notes command`
- `chore: sync configs after context7 update`

If you do not push before closing, the next session in any other tool will start blind.

Full memory rules: `sdlc/agents/memory-protocol.md`

---

## Commands (user-invoked)

| Command | What it produces |
|---------|-----------------|
| `/generate_prd` | PRD doc in `docs/planning/` |
| `/project_setup` | Project scaffold plan + files |
| `/plan_sprint` | Sprint plan in `docs/sprints/` |
| `/create_adr` | ADR in `docs/adr/` |
| `/gen_test_plan` | Test plan in `docs/testing/` |
| `/release_notes` | Release notes in `docs/releases/` |

---

## Knowledge base: sdlc/ folder

Check `sdlc/` before answering questions about:

- Code style → `sdlc/implementation/coding-standards.md`
- Git workflow → `sdlc/implementation/git-workflow.md`
- Architecture → `sdlc/design/`
- Testing → `sdlc/testing/`
- Deployment → `sdlc/deployment/`
- Agent rules → `sdlc/agents/orchestrator.md`

---

## Subagent system

Read `sdlc/agents/orchestrator.md` before starting any non-trivial task.

### Mandatory spawn triggers

| Trigger | Condition | Agent to spawn |
|---------|-----------|---------------|
| 1 | Codebase not read this session + task needs code knowledge | Research |
| 2 | Task touches >3 unread files | Research |
| 3 | Task has 2+ independent work units | Parallel implementation agents |
| 4 | Task is destructive or high-risk (delete, refactor, auth, payments) | Isolated implementation |
| 5 | Implementation complete | Review |

### Output protocol

Every subagent MUST write output to `docs/agents/<date>-<role>-<slug>.md`. Commit immediately after. Never accept verbal-only output from a subagent.

### Tool invocation

- **Claude Code**: `Task` tool — native, full context isolation
- **Roo/Cline**: `new_task` boomerang mode
- **Cursor**: new Composer window (background agents in beta)
- **Windsurf**: simulate sequentially — research → implementation → review
- **Any tool**: new chat session with the agent prompt, copy output file back

Full rules: `sdlc/agents/orchestrator.md`
Agent templates: `sdlc/agents/research-agent.md`, `sdlc/agents/implementation-agent.md`, `sdlc/agents/review-agent.md`

---

## Stack

TypeScript, ESM, Node 18+. Full-stack web (JS/TS).

---

## Commit conventions

Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
Never commit directly to `main`.

---

## Config management

Edit only `config/config-sources.json` for MCP changes. Run `npm run sync:configs` after. The other `config/*.json` files are generated — do not edit them directly. Run `npm run check:configs` to verify freshness.

---

## What not to do

- Do not invent library APIs — use Context7
- Do not create files outside the established folder structure without asking
- Do not commit directly to `main`
- Do not edit generated config files directly (anything with `_generated` key)
- Do not store state in chat — write to `docs/memory/`
- Do not mark a task complete without a review agent verdict

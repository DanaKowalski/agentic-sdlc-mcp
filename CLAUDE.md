# CLAUDE.md — sdlc-mcp context

This file is automatically loaded by Claude Code at session start. It defines the available tools, commands, and skills for this repository.

---

## Project identity

This is a foundational SDLC repository. Its purpose is to give AI assistants structured knowledge of the software development lifecycle and expose active commands for creating SDLC deliverables.

---

## Available tools (always on — call autonomously)

| Tool | When to use it |
|------|---------------|
| `context7` | Any time a library, framework, or npm package is mentioned — fetch current docs before answering |
| `sdlc-gitmcp` | Read live repo state: current ADRs, sprint docs, PRDs, templates. Use to orient at session start or pick up where a previous session left off |
| `filesystem` | Reading/writing project files |
| `sdlc` MCP | Exposes the commands below |

**Always use Context7 before referencing library APIs.** Do not rely on training data for package documentation — versions change.

**At the start of every session:** call `sdlc-gitmcp` to read `sdlc/overview.md` and any recent docs in `docs/` to understand current project state before taking action. This is how work is resumed across tools and sessions.

## Cross-session and cross-tool continuity

This repo is the persistent memory layer across all AI tools. Any session — whether in Claude Code, Cursor, Roo, or any other tool — should begin by reading repo state via `sdlc-gitmcp` before doing new work.

Standard session opening pattern:
1. Read `sdlc/overview.md` — understand the phases and rules
2. Read `docs/` — find any in-progress PRDs, sprint plans, or ADRs
3. Read `CLAUDE.md` (this file) — understand available tools and commands
4. Ask the user: "I can see [current state]. Where would you like to pick up?"

Standard session closing pattern:
- Commit any new or updated documents to the repo so the next session can find them
- Use conventional commit format: `docs(planning): update PRD for auth feature`

---

## Available commands (user-invoked)

| Command | What it produces |
|---------|-----------------|
| `/project_setup` | Scaffold a new project from a preset or custom layer selection — generates a plan first, applies on confirmation |
| `/generate_prd` | Fills `sdlc/planning/PRD-template.md` for a new feature |
| `/plan_sprint` | Creates a sprint plan document |
| `/create_adr` | New Architecture Decision Record in `sdlc/design/` |
| `/gen_test_plan` | Test plan scaffold for a feature |
| `/release_notes` | Draft release notes from recent git log |

---

## Skills (background knowledge — already loaded)

The `sdlc/` folder is your knowledge base. Key files:

- `sdlc/overview.md` — SDLC phases, rules, how this repo works
- `sdlc/implementation/coding-standards.md` — TypeScript conventions for this project
- `sdlc/implementation/git-workflow.md` — branching strategy, commit conventions
- `sdlc/design/architecture-decision-record-template.md` — ADR format

When answering questions about code style, architecture decisions, or process — consult the relevant `sdlc/` file first.

---

## Repo conventions

- **Language**: TypeScript (ESM, Node 18+)
- **Stack**: Full-stack web (JS/TS)
- **Branching**: `main` is protected. Feature branches named `feat/`, `fix/`, `chore/`
- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`)
- **PRs**: Require passing CI before merge

---

## Config maintenance

Four tool config files must stay in sync. The canonical source is `config/config-sources.json`.

- Never edit `config/claude-mcp-config.json`, `config/roo-mcp.json`, etc. directly
- Run `npm run sync:configs` after any change to `config-sources.json`
- Run `npm run check:configs` to verify freshness
- If drift is detected, follow `sdlc/maintenance/config-maintenance-checklist.md`

---


## Subagent system

This repo uses a prescriptive subagent architecture. Read `sdlc/agents/orchestrator.md` before starting any non-trivial task.

### Mandatory spawn triggers (do not skip these)

| Trigger | Condition | Agent to spawn |
|---------|-----------|---------------|
| 1 | Codebase not read this session + task needs structure knowledge | Research |
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

## What NOT to do

- Do not invent library APIs — use Context7
- Do not create files outside the established folder structure without asking
- Do not commit directly to `main`
- Do not edit generated config files directly (anything with `_generated` key)

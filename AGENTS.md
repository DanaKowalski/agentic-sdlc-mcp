# AGENTS.md — Core Agent Rules & Conventions

This is the central, model-agnostic rule set for all agents in this SDLC foundation.  
It applies across Claude Code, Roo/Cline (OpenRouter), Cursor, Windsurf, Hugging Face models, and any other tool.

---

## What this repo is

This is a foundational SDLC repository. It provides structured knowledge of the software development lifecycle and exposes active commands for creating deliverables.

---

## Always use Context7 for library docs

Before referencing any npm package, framework, or library API, call **Context7** to fetch current documentation.  
Do not rely on training data for package specifics — it goes stale.

---

## Cross-session and cross-tool continuity

This repo serves as the persistent memory layer across all AI tools and models.  
Every session must begin by reading current project state before doing new work.

### Standard Session Opening Pattern

1. Read `sdlc/memory/quick-ref.md` — commands, triggers, and agent roles
2. Read `docs/memory/project-state.md` — current phase, open work, last session summary
3. If `project-state.md` does not exist, this is a new project — create it before proceeding
4. Tell the user what you found and ask:  
   "We are in the [phase] phase. Open work: [list]. Last session: [summary]. Where would you like to pick up?"

Do not skip reading `project-state.md`.

### Standard Session Closing Pattern

Before ending any session:

1. Update `docs/memory/project-state.md` with current phase, completed work, open work, and any decisions not yet in an ADR.
2. Commit the change with message: "docs(memory): update project state - <one word describing session>"
3. Push the commit.

Full memory rules: `sdlc/agents/memory-protocol.md`

---

## Commands

| Command                    | What it produces                              |
|----------------------------|-----------------------------------------------|
| `/generate_prd`            | PRD document                                  |
| `/project_setup`           | Project scaffold plan + files                 |
| `/plan_sprint`             | Sprint plan                                   |
| `/create_adr`              | Architecture Decision Record                  |
| `/create_technical_design` | Full design phase (technical design + ADRs + checklist) |
| `/gen_test_plan`           | Test plan                                     |
| `/release_notes`           | Release notes from git log                    |

---

## Knowledge Base: sdlc/ folder

Always consult the `sdlc/` folder for phase-specific guidance:

- Planning → `sdlc/planning/`
- Design → `sdlc/design/`
- Implementation → `sdlc/implementation/`
- Testing → `sdlc/testing/`
- Deployment → `sdlc/deployment/`
- Agent rules → `sdlc/agents/orchestrator.md` and individual agent files

---

## Core Conventions

- Language: TypeScript, ESM, Node 18+
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`)
- Branch naming: `feat/`, `fix/`, `chore/`, `docs/`
- Never commit directly to `main`
- Config management: Edit only `config/config-sources.json`, then run `npm run sync:configs`

---

## Subagent System

Read `sdlc/agents/orchestrator.md` before any non-trivial task.

The system uses these agents:
- Research Agent
- Design Agent
- Implementation Agent
- Review Agent

All agent outputs must be written to `docs/agents/<date>-<role>-<slug>.md` and committed immediately.

---

## Tool-Specific Behavior

For tool-specific instructions (subagent invocation, simulation methods, etc.), refer to:
- `.clinerules` — Roo/Cline
- `.cursorrules` — Cursor
- `.windsurfrules` — Windsurf

This `AGENTS.md` file contains the shared foundation that applies to all models and tools.
# AGENTS.md — Core Agent Rules & Conventions

This is the central, model-agnostic rule set for all agents using this SDLC framework.
It applies across Claude Code, Roo/Cline, Cursor, Windsurf, and any other tool.

---

## What this framework is

This is a foundational SDLC repository served via GitMCP. It provides structured
knowledge of the software development lifecycle and templates for creating deliverables.

It is read-only from your project's perspective. All project files, memory, and agent
outputs live in your local project directory — never in this framework repo.

---

## Always use Context7 for library docs

Before referencing any npm package, framework, or library API, call Context7 to fetch
current documentation. Do not rely on training data for package specifics — it goes stale.

---

## Cross-session and cross-tool continuity

### Standard Session Opening Pattern

1. Fetch `sdlc/memory/quick-ref.md` from sdlc-gitmcp
2. Check for `docs/memory/project-state.md` in your local project directory.
   If it does not exist — STOP. Create it locally before saying anything to the user.
   Do not greet, do not ask questions, do not proceed until the file exists on disk.
3. Read the file and tell the user what you found and ask where to pick up

Do not skip step 2. Do not look for project-state.md on the remote framework server —
it does not exist there. It lives in your project.

Before doing any design work, fetch and read sdlc/agents/design-agent.md.
The design phase is not complete until all three artifacts exist:
technical design document, at least one ADR evaluation, and completed design checklist.

### Standard Session Closing Pattern

Before ending any session:

1. Update `docs/memory/project-state.md` in your local project directory
2. Commit: `docs(memory): update project state - <one word describing session>`
3. Push

Full memory rules: fetch `sdlc/agents/memory-protocol.md` from sdlc-gitmcp

---

## Commands

Commands are available in two modes depending on how you are connected:

**Running sdlc MCP server locally** — invoke commands directly:

| Command | What it produces |
|---------|-----------------|
| `/generate_prd` | PRD document |
| `/project_setup` | Project scaffold plan + files |
| `/plan_sprint` | Sprint plan |
| `/create_adr` | Architecture Decision Record |
| `/create_technical_design` | Full design phase suite |
| `/gen_test_plan` | Test plan |
| `/release_notes` | Release notes from git log |

**Connected via sdlc-gitmcp (remote)** — commands are not available.
Use the templates directly instead:

| Instead of | Fetch and follow |
|-----------|-----------------|
| `/generate_prd` | `sdlc/planning/PRD-template.md` |
| `/create_technical_design` | `sdlc/design/technical-design-template.md` |
| `/create_adr` | `sdlc/design/architecture-decision-record-template.md` |
| `/gen_test_plan` | `sdlc/testing/README.md` |
| `/release_notes` | Draft from git log manually |

---

## Knowledge base — fetch as needed

Fetch these from sdlc-gitmcp when entering each phase:

- Planning → `sdlc/planning/README.md`
- Design → `sdlc/design/README.md`
- Implementation → `sdlc/implementation/README.md`
- Testing → `sdlc/testing/README.md`
- Agent rules → `sdlc/agents/orchestrator.md` and individual agent files

---

## Subagent system

Fetch and read `sdlc/agents/orchestrator.md` before any non-trivial task.

The system uses these agents:
- Research Agent — fetch `sdlc/agents/research-agent.md`
- Design Agent — fetch `sdlc/agents/design-agent.md`
- Implementation Agent — fetch `sdlc/agents/implementation-agent.md`
- Review Agent — fetch `sdlc/agents/review-agent.md`

All agent outputs must be written to `docs/agents/<date>-<role>-<slug>.md`
in your local project directory and committed immediately.

## Subagents must be spawned, not simulated

Use your tool's native mechanism — Claude Code: Task tool, Roo: new_task, 
Cursor: new Composer window, Windsurf: separate Cascade session.

Writing a docs/agents/ file directly from orchestrator context is not spawning 
a subagent. If you find yourself writing an agent output file directly, stop and 
spawn the agent instead.

The review agent is not optional. It runs after every implementation task.
Do not mark implementation complete without a review agent verdict of 
approved or approved-with-notes.

---

## Tool-specific behavior

For tool-specific subagent invocation instructions, fetch from sdlc-gitmcp:
- Roo/Cline → `.clinerules`
- Cursor → `.cursorrules`
- Windsurf → `.windsurfrules`
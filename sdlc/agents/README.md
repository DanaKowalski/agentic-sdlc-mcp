# Agent system

This directory defines the subagent architecture for this repo. The system is prescriptive — agents follow fixed rules, not guidelines.

## The four agents

| Agent | Role | Reads | Writes |
|-------|------|-------|--------|
| Design | Produce design package from approved PRD | PRD, sdlc/ docs | `docs/design/`, `docs/adr/`, `docs/agents/*-design-*.md` |
| Research | Explore and report | Source files, docs, sdlc-gitmcp | `docs/agents/*-research-*.md` |
| Implementation | Build bounded tasks | Source files, research output | Source files + `docs/agents/*-implementation-*.md` |
| Review | Verify against standards | Source files, implementation output, sdlc/ docs | `docs/agents/*-review-*.md` |

## The flow

```
orchestrator
  → (Trigger 0) spawns design agent if architectural decisions exist
  → reads design output from docs/agents/ + docs/design/
  → (Trigger 1/2) spawns research agent if codebase is unknown
  → reads research output from docs/agents/
  → spawns implementation agent(s) (parallel if independent)
  → reads implementation output from docs/agents/
  → spawns review agent
  → reads review verdict from docs/agents/
  → if blocked: re-spawns implementation agent with review as context
  → if approved: commits, updates PRD/sprint doc, closes task
```

## Tool support

| Tool | Native subagents | Mechanism | Isolation |
|------|-----------------|-----------|-----------|
| Claude Code | Yes | `Task` tool | Full — own context window |
| Roo / Cline | Yes | `new_task` (boomerang) | Partial — scoped context |
| Cursor | Partial | Background agents (beta) | Limited |
| Windsurf | No | Sequential cascade | None — simulate manually |
| Any tool | Fallback | New chat session per agent | Manual |

## Output path convention

All agent outputs go to `docs/agents/` using this naming pattern:

```
docs/agents/<YYYY-MM-DD>-<role>-<slug>.md

Examples:
  docs/agents/2026-04-05-orchestrator-plan.md
  docs/agents/2026-04-05-research-auth-flow.md
  docs/agents/2026-04-05-implementation-user-api.md
  docs/agents/2026-04-05-review-user-api.md
  docs/agents/2026-04-05-orchestrator-summary.md
```

All outputs are committed to git immediately after completion so any subsequent tool session can read them via `sdlc-gitmcp`.

## Key rules

1. Every subagent gets a bounded task in one sentence
2. Every subagent writes a file — verbal output does not count
3. Commit every output before starting the next agent
4. Review agent runs before any task is marked complete
5. A `blocked` verdict must be resolved — never bypassed

## Adding a new agent type

1. Create `sdlc/agents/<type>-agent.md` following the structure of existing agent files
2. Define: role, allowed actions, forbidden actions, output path convention
3. Write a prompt template with all required sections
4. Write an output file template
5. Add the agent type to the flow in this README and to `orchestrator.md`'s trigger rules

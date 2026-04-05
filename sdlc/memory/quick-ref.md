# SDLC quick reference

Read this at session start. One page. Everything you need to orient before doing any work.

---

## Session sequence

```
OPEN:  1. Read this file
       2. Read docs/memory/project-state.md
       3. Tell user current state, ask where to pick up

CLOSE: 1. Update docs/memory/project-state.md
       2. git add docs/memory/ && git commit && git push
```

---

## SDLC phases

| Phase | Entry condition | Key output | Command |
|-------|----------------|------------|---------|
| Planning | New feature or project | PRD | `/generate_prd` |
| Design | PRD approved | ADR (if arch decision needed) | `/create_adr` |
| Implementation | Design complete | Feature branch + tests | — |
| Testing | Code complete | Test plan + results | `/gen_test_plan` |
| Deployment | Tests pass | Release notes | `/release_notes` |
| Operations | Deployed | Runbooks | — |

A phase does not start until the previous phase's output exists and is approved.

---

## Available commands

| Command | What it produces | Required inputs |
|---------|-----------------|-----------------|
| `/generate_prd` | PRD doc in `docs/planning/` | featureName, problemStatement |
| `/project_setup` | Project scaffold plan + files | projectName, preset or layers |
| `/plan_sprint` | Sprint plan in `docs/sprints/` | sprintNumber, goal, items |
| `/create_adr` | ADR in `docs/adr/` | title, context |
| `/gen_test_plan` | Test plan in `docs/testing/` | featureName, acceptanceCriteria |
| `/release_notes` | Release notes in `docs/releases/` | version, fromRef |

---

## Agent spawn triggers

Spawn a subagent when any of these conditions are true. Do not skip.

| Trigger | Condition | Agent to spawn |
|---------|-----------|----------------|
| 1 | Codebase not read this session + task needs code knowledge | Research |
| 2 | Task touches more than 3 unread files | Research |
| 3 | Task has 2+ independent work units | Parallel implementation agents |
| 4 | Task is destructive or high-risk (delete, refactor, auth, payments) | Isolated implementation |
| 5 | Implementation complete | Review |

---

## Agent roles

| Agent | Reads | Writes | Must not |
|-------|-------|--------|----------|
| Research | Source files, docs, GitMCP | `docs/agents/*-research-*.md` | Write source files |
| Implementation | Source files, research output | Source files + `docs/agents/*-implementation-*.md` | Expand scope, skip tests |
| Review | Source files, implementation output | `docs/agents/*-review-*.md` | Fix anything |

Every agent output goes to `docs/agents/<YYYY-MM-DD>-<role>-<slug>.md`. Commit after each.

---

## Agent output path convention

```
docs/agents/
  <date>-orchestrator-plan.md
  <date>-research-<slug>.md
  <date>-implementation-<slug>.md
  <date>-review-<slug>.md
  <date>-orchestrator-summary.md
```

---

## Review verdicts

| Verdict | Meaning | Next action |
|---------|---------|-------------|
| `approved` | All criteria met | Commit, update PRD/sprint, close task |
| `approved-with-notes` | Criteria met, minor issues | Proceed, fix notes before next PR |
| `blocked` | Criteria not met | Re-spawn implementation with review as context |

A `blocked` verdict is never bypassed.

---

## Tools always available

| Tool | When to use |
|------|------------|
| `sdlc-gitmcp` | Session start orientation, reading templates and past outputs |
| `context7` | Any time a library or framework is referenced — fetch docs before answering |
| `filesystem` | Reading and writing local project files |

---

## Key file locations

| File | Purpose |
|------|---------|
| `sdlc/overview.md` | Full phase definitions and rules |
| `sdlc/agents/orchestrator.md` | Full spawn trigger rules |
| `sdlc/agents/memory-protocol.md` | How to read and write memory |
| `sdlc/implementation/coding-standards.md` | TypeScript conventions |
| `sdlc/implementation/git-workflow.md` | Branch and commit rules |
| `docs/memory/project-state.md` | Current project state (live) |
| `docs/agents/` | All agent outputs (live) |
| `config/config-sources.json` | MCP config source of truth |

---

## What not to do

- Do not invent library APIs — use Context7
- Do not store state in chat — write to `docs/memory/`
- Do not skip the review agent to save time
- Do not commit directly to `main`
- Do not edit generated config files directly
- Do not mark a task complete without a review agent verdict

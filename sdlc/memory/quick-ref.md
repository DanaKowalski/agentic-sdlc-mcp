# SDLC quick reference

Read this at session start. One page. Everything you need to orient before doing any work.

---

## Session sequence

**OPEN:**
1. Read this file
2. Read `docs/memory/project-state.md` (create it if it does not exist)
3. Tell user current state and ask where to pick up

**CLOSE:**
1. Update `docs/memory/project-state.md`
2. git add docs/memory/
3. git commit -m "docs(memory): update project state - <one word describing session>"
4. git push

Memory is mandatory. Never start real work without it.

---

## SDLC phases

| Phase        | Entry condition                  | Key outputs                          | Main command / Agent          |
|--------------|----------------------------------|--------------------------------------|-------------------------------|
| Planning     | New feature or project           | PRD + checklist                      | `/generate_prd`               |
| Design       | Approved PRD                     | Technical Design + ADRs + checklist  | `/create_technical_design` or Design Agent |
| Implementation | Design complete                | Feature branch + tests               | Implementation Agent          |
| Testing      | Code complete                    | Test plan + results                  | `/gen_test_plan`              |
| Deployment   | Tests pass                       | Release notes                        | `/release_notes`              |

---

## Available commands

| Command                    | What it produces                     |
|----------------------------|--------------------------------------|
| `/generate_prd`            | PRD document                         |
| `/create_technical_design` | Full design phase suite              |
| `/create_adr`              | Single Architecture Decision Record  |
| `/plan_sprint`             | Sprint plan                          |
| `/gen_test_plan`           | Test plan                            |
| `/release_notes`           | Release notes                        |

---

## Agent spawn triggers (default behavior)

- **Trigger 0 — Design Phase**: Approved PRD + architectural decisions needed → spawn Design Agent
- **Trigger 1**: Unknown codebase + task needs code knowledge → Research Agent
- **Trigger 2**: Task touches >3 unread files → Research Agent
- **Trigger 3**: Task has 2+ independent units → Parallel Implementation Agents
- **Trigger 4**: Destructive or high-risk work → Isolated Implementation Agent
- **Trigger 5**: Implementation complete → Review Agent

---

## Agent roles

| Agent          | Primary job                        | Must not do                  |
|----------------|------------------------------------|------------------------------|
| Research       | Explore and report                 | Write source code            |
| Design         | Create technical design + ADRs     | Write source code            |
| Implementation | Execute bounded coding tasks       | Expand scope, skip tests     |
| Review         | Verify work and give verdict       | Fix code                     |

All agent outputs go to `docs/agents/<date>-<role>-<slug>.md` and must be committed immediately.

---

## Review Verdicts

| Verdict              | Meaning                              | Next action |
|----------------------|--------------------------------------|-------------|
| `approved`           | All criteria met                     | Proceed and commit |
| `approved-with-notes`| Criteria met, minor issues           | Proceed, fix notes before next PR |
| `blocked`            | Criteria not met or serious issue    | Re-spawn implementation agent with review as context. Do not bypass. |

---

## Key file locations

| File                            | Purpose |
|---------------------------------|---------|
| `AGENTS.md`                     | Core agent rules |
| `sdlc/overview.md`              | Full SDLC phases and rules |
| `sdlc/agents/orchestrator.md`   | Orchestrator + spawn triggers |
| `docs/memory/project-state.md`  | Live project state |
| `docs/agents/`                  | All agent outputs |

---

## What not to do

- Do not invent library APIs — always use Context7
- Do not store state in chat — always write to `docs/memory/`
- Do not skip the review agent
- Do not commit directly to `main`
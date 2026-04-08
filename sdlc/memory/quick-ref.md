# SDLC quick reference

Read this at session start. Scannable in under 60 seconds.

---

## Session open

1. Fetch `sdlc/memory/quick-ref.md` from sdlc-gitmcp (this file)
2. Check for `docs/memory/project-state.md` in your **local project directory**
   If it does not exist — STOP. Create it locally before saying anything to the user.
   Do not greet, do not ask questions, do not proceed until the file exists on disk.
3. Read the file and tell the user what you found and ask where to pick up

Do not look for `project-state.md` on the remote framework server — it does not exist there.
It lives in your local project directory only.

## Session close

1. Update `docs/memory/project-state.md` — set `session_status` to `closed`
2. `git add docs/ && git commit -m "docs(memory): update project state - <slug>"`
3. `git push`

---

## Available commands

| Command | What it produces |
|---------|-----------------|
| `/generate_prd` | PRD document |
| `/create_technical_design` | Full design suite (TDD + ADRs + checklist) |
| `/create_adr` | Single Architecture Decision Record |
| `/plan_sprint` | Sprint plan |
| `/gen_test_plan` | Test plan scaffold |
| `/release_notes` | Release notes draft from git log |
| `/project_setup` | Initial project scaffolding |

If connected via sdlc-gitmcp (remote), commands are not available — fetch templates directly instead. See `AGENTS.md` for the template equivalents.

---

## Agent spawn triggers

- **Trigger 0**: Approved PRD + architectural decisions exist → Design Agent
- **Trigger 1**: Codebase not read this session → Research Agent
- **Trigger 2**: Task touches >3 unread files → Research Agent
- **Trigger 3**: 2+ independent work units → Parallel Implementation Agents
- **Trigger 4**: Destructive or high-risk change → Isolated Implementation Agent
- **Trigger 5**: Implementation done → Review Agent

Priority order if multiple triggers active: 0 → 4 → 1 → 2 → 3 → 5

---

## Agent roles

| Agent | One-line job |
|-------|-------------|
| Research | Explore codebase and report findings — does not write code |
| Design | Turn approved PRD into TDD + ADRs + checklist — does not write source code |
| Implementation | Execute a bounded coding task within a defined file allowlist |
| Review | Verify implementation against standards and acceptance criteria — does not fix code |

---

## Memory file locations

| File | Purpose |
|------|---------|
| `sdlc/memory/quick-ref.md` | This file — fetch from sdlc-gitmcp at session start |
| `docs/memory/project-state.md` | Live project state — local project directory only |
| `docs/agents/<date>-<role>-<slug>.md` | All agent outputs — local project directory only |

---

## Hard rules

- Create `docs/memory/project-state.md` locally before saying anything to the user
- All agent output goes to `docs/agents/` as a written file — verbal output does not count
- Subagents must be spawned via the tool's native mechanism — not simulated inline
- Commit every agent output before spawning the next agent
- Never bypass a `blocked` verdict — surface to user and wait for instruction
- Never start implementation before design phase is `status: complete` (if Trigger 0 applied)
- Only orchestrators commit — subagents write files, orchestrator commits them
- The review agent is never optional — it runs after every implementation task

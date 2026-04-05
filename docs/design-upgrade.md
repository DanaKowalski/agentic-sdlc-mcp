# Plan: Expand Design Phase for Remote MCP Workflow

## Context

When a user connects via `sdlc-gitmcp` and asks it to run the design phase, they only get a single ADR. The remote MCP serves `llms.txt` as its knowledge base and reads `sdlc/` docs — that's the entire surface being fixed here.

Root causes:
1. `llms.txt` only mentions `/create_adr` for design — no design agent, no technical design doc, no checklist
2. No `sdlc/agents/design-agent.md` exists — the agent system has research/implementation/review but no design agent
3. `orchestrator.md` has no trigger for design — it jumps from PRD straight to implementation triggers
4. `sdlc/overview.md` lists only `/create_adr` for design, no guidance on what else to produce

The fix is entirely within `llms.txt` and `sdlc/` — no MCP server code changes.

---

## Files to Change (4 total)

### 1. `sdlc/agents/design-agent.md` — CREATE

New agent template. Same structure as existing agent files.

Content:
- **Role**: Produces the full design suite from an approved PRD. Cannot write source code.
- **Spawn condition**: Feature has an approved PRD AND involves any of: new data model, external integration, new API surface, auth changes, cross-service communication
- **Mandatory outputs** (all three before agent is done):
  1. `docs/design/<date>-<slug>-technical-design.md` — filled from `sdlc/design/technical-design-template.md`
  2. `docs/adr/<NNN>-<slug>.md` — one ADR per significant architectural decision, using `sdlc/design/architecture-decision-record-template.md`
  3. `docs/design/<date>-<slug>-design-checklist.md` — completed checklist from `sdlc/design/design-checklist.md`
- **Handoff input**: PRD path, feature slug, list of architectural decisions to make
- **Templates to use**: all three files in `sdlc/design/`

### 2. `sdlc/agents/orchestrator.md` — MODIFY

Add **Trigger 0 — Design Phase** as the first trigger in "When to Spawn Subagents":

```
### Trigger 0 — Design Phase
Spawn a design agent before any implementation work when ALL are true:
- An approved PRD exists for the feature
- The feature involves a new data model, external integration, new API surface, or auth/security change
- No design doc already exists in docs/design/ for this feature

Skip for: bug fixes, copy/UI-only changes, or features with an existing approved design doc.
```

Also update the session flow step 3 to add design before implementation:
```
3. Execute (per task)
   If Trigger 0 active → spawn design agent first, await and commit output
   If other trigger active → spawn appropriate subagent
   ...
```

### 3. `llms.txt` — MODIFY

Three additions:
1. Add `/create_technical_design` to Available commands (describes the full design suite command)
2. Expand the design section in Key files to include:
   - `sdlc/agents/design-agent.md`
   - `sdlc/design/technical-design-template.md`
   - `sdlc/design/design-checklist.md`
3. Add a **Design phase** note under the subagent system section: "Design phase runs before implementation. The design agent produces three artifacts: technical design doc, ADR(s), and completed checklist. See `sdlc/agents/design-agent.md`."

### 4. `sdlc/overview.md` — MODIFY

In the Design phase section, update the command line:
```
Command: `/create_adr`
```
→
```
Commands: `/create_technical_design` (full design suite), `/create_adr` (individual decisions)
Agent: spawn design agent (see `sdlc/agents/design-agent.md`) for new features with architectural decisions
```

---

## Output Path Convention (establish via design-agent.md)

| Artifact | Path |
|----------|------|
| Technical design doc | `docs/design/<date>-<slug>-technical-design.md` |
| ADR(s) | `docs/adr/<NNN>-<slug>.md` |
| Completed checklist | `docs/design/<date>-<slug>-design-checklist.md` |
| Design agent log | `docs/agents/<date>-design-<slug>.md` |

---

## Verification

1. Connect a fresh session via `sdlc-gitmcp` only (no local MCP)
2. Ask it to run the design phase for a feature with a PRD
3. Confirm it produces all three artifacts (technical design + ADR + checklist), not just an ADR
4. Confirm orchestrator Trigger 0 fires correctly when moving from PRD to implementation

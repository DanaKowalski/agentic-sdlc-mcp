# SDLC overview

This document defines the software development lifecycle phases, rules, and conventions for projects using this repository as their AI development foundation.

---

## Phases

### 1. Planning

Entry point for all new features and projects.

**Deliverables:** PRD (including deployment decision), user stories with acceptance criteria
**Templates:** `sdlc/planning/`
**Command:** `/generate_prd`

A feature does not move to design until it has:
- An approved PRD with clear problem statement and success metrics
- User stories broken into estimable units with acceptance criteria
- A completed deployment decision in PRD Section 6 (Yes / No / Not yet decided)
- Completed planning checklist

### 2. Design

Technical decisions and structure defined before implementation begins.

**Deliverables:** Technical Design Document, ADRs (for significant decisions), completed design checklist
**Templates:** `sdlc/design/`
**Commands:** `/create_technical_design` (full design suite), `/create_adr` (individual decisions)
**Agent:** Design Agent (`sdlc/agents/design-agent.md`)

Any feature involving new data models, external integrations, API surfaces, auth, or security should go through the Design Agent.

### 3. Implementation

Writing code against the approved design.

**Deliverables:** Feature branch, passing tests, PR
**Standards:** `sdlc/implementation/coding-standards.md`
**Workflow:** `sdlc/implementation/git-workflow.md`

Code does not go to review without tests. PRs should reference the originating PRD and design artifacts.

### 4. Testing

Verification that the implementation meets acceptance criteria end-to-end before deployment.

**Deliverables:** Completed test plan, QA checklist, test results
**Templates:** `sdlc/testing/` — `test-plan-template.md`, `qa-checklist.md`, `regression-testing-guide.md`
**Command:** `/gen_test_plan`

Testing begins when implementation is merged to `main` and all review agent verdicts are `approved` or `approved-with-notes`. Testing happens before deployment — no release goes out without a completed test plan and QA checklist.

### 5. Deployment

Shipping a release to its target environment.

**Deliverables:** Release notes, completed deployment checklist, rollback procedure reviewed
**Templates:** `sdlc/deployment/`
**Command:** `/release_notes`

**Before starting this phase, read PRD Section 6 (Deployment Decision):**
- If the decision is **No** — this project does not deploy. Skip this phase, document the skip in `docs/memory/project-state.md`, and move to operations or maintenance.
- If the decision is **Not yet decided** — stop. Resolve the deployment decision before proceeding.
- If the decision is **Yes** — proceed using `sdlc/deployment/README.md`.

The deployment checklist has two tiers: lightweight for informal/continuous deployment, and full for structured releases with CI, staging, and approval gates. The PRD release model field determines which applies.

### 6. Operations

Post-deployment health and incident response.

**Deliverables:** Runbooks, incident reports, on-call guides
**Templates:** `sdlc/operations/`

### 7. Maintenance

Keeping the project healthy over time on a recurring cadence.

**Deliverables:** Completed maintenance checklist, updated ADRs, dependency review log
**Templates:** `sdlc/maintenance/`

Maintenance is not a one-time phase. It runs alongside all other development work on a recurring schedule — monthly dependency review, quarterly process and template review, and reactive work when MCP connections drift or architectural decisions change. See `sdlc/maintenance/README.md` for the full cadence and available guides.

---

## Rules

These apply across all phases:

1. **Templates are starting points, not ceilings.** Add or remove sections as needed.
2. **AI tools read this folder.** Write documentation as if the AI will use it to make decisions.
3. **Decisions with trade-offs go in ADRs.** Small implementation details belong in the technical design document.
4. **Always use Context7** for current library/framework documentation.
5. **Memory is mandatory.** Every session reads `docs/memory/project-state.md` before doing any work and updates it before closing.

---

## How AI tools use this repo

- At session start, agents fetch `sdlc/memory/quick-ref.md` and `AGENTS.md` via sdlc-gitmcp, then read `docs/memory/project-state.md` locally
- Commands (`/generate_prd`, `/create_technical_design`, etc.) trigger the appropriate phase when running the local MCP server
- When connected via sdlc-gitmcp (remote), fetch templates directly using the raw GitHub URL pattern in `llms.txt`
- Subagents follow rules in `sdlc/agents/orchestrator.md` and individual agent files
- All outputs are written to `docs/` locally and committed so they are visible across tools via GitMCP

---

## Maintenance cadence

| What | When | Guide |
|------|------|-------|
| Dependency review | Monthly | `sdlc/maintenance/dependency-review.md` |
| MCP connection check | As tools release updates | `sdlc/maintenance/mcp-connection-review.md` |
| Template and process review | Quarterly | `sdlc/maintenance/process-review.md` |
| Glossary update | As needed | `sdlc/glossary.md` |
| Full health check | Quarterly | `sdlc/maintenance/maintenance-checklist.md` |

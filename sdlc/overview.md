# SDLC overview

This document defines the software development lifecycle phases, rules, and conventions for projects using this repository as their AI development foundation.

---

## Phases

### 1. Planning

Entry point for all new features and projects.

**Deliverables:** PRD, user stories with acceptance criteria  
**Templates:** `sdlc/planning/`  
**Command:** `/generate_prd`

A feature does not move to design until it has:
- An approved PRD with clear problem statement and success metrics
- User stories broken into estimable units with acceptance criteria
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

Verification that the implementation meets acceptance criteria.

**Deliverables:** Test plan, test cases, results  
**Templates:** `sdlc/testing/`  
**Command:** `/gen_test_plan`

Testing happens before deployment.

### 5. Deployment

Shipping to production safely.

**Deliverables:** Release notes, CI/CD checklist, rollback procedure  
**Templates:** `sdlc/deployment/`  
**Command:** `/release_notes`

No direct pushes to production. All releases go through CI.

### 6. Operations

Post-deployment health and incident response.

**Deliverables:** Runbooks, incident reports, on-call guides  
**Templates:** `sdlc/operations/`

---

## Rules

These apply across all phases:

1. **Templates are starting points, not ceilings.** Add or remove sections as needed.
2. **AI tools read this folder.** Write documentation as if the AI will use it to make decisions.
3. **Decisions with trade-offs go in ADRs.** Small implementation details belong in the technical design document.
4. **Configs have one source of truth.** Edit only `config/config-sources.json`, then run `npm run sync:configs`.
5. **Always use Context7** for current library/framework documentation.

---

## How AI tools use this repo

- At session start, agents read `AGENTS.md`, `sdlc/overview.md`, and `docs/memory/project-state.md`
- Commands (`/generate_prd`, `/create_technical_design`, etc.) trigger the appropriate phase
- Subagents follow rules in `sdlc/agents/orchestrator.md` and individual agent files
- All outputs are written to `docs/` and committed so they are visible across tools via GitMCP

---

## Maintenance cadence

| What                  | When          | How |
|-----------------------|---------------|-----|
| Config drift check    | On every commit | Husky pre-commit hook |
| Dependency review     | Monthly       | `npm outdated` |
| Template review       | Per quarter   | Review if templates still match how you work |
| Glossary update       | As needed     | Keep `sdlc/glossary.md` current |

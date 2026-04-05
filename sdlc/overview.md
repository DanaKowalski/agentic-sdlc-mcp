# SDLC overview

This document defines the software development lifecycle phases, rules, and conventions for projects using this repository as their AI development foundation.

---

## Phases

### 1. Planning

Entry point for all new features and projects.

Deliverables: PRD, user stories, requirements checklist
Templates: `sdlc/planning/`
Command: `/generate_prd`

A feature does not move to design until it has:
- An approved PRD with clear problem statement and success metrics
- User stories broken into estimable units
- Acceptance criteria defined

### 2. Design

Technical decisions made before implementation begins.

Deliverables: ADR (for significant decisions), technical design doc, diagrams
Templates: `sdlc/design/`
Command: `/create_adr`

Any decision that affects system architecture, data models, or external integrations requires an ADR. Small implementation choices do not.

### 3. Implementation

Writing code against the design.

Deliverables: Feature branch, passing tests, PR
Standards: `sdlc/implementation/coding-standards.md`
Workflow: `sdlc/implementation/git-workflow.md`

Code does not go to review without tests. PRs reference the originating PRD or ADR.

### 4. Testing

Verification that the implementation meets acceptance criteria.

Deliverables: Test plan, test cases, results
Templates: `sdlc/testing/`
Command: `/gen_test_plan`

Testing happens before deployment, not after. QA sign-off is required for features touching payments, auth, or data integrity.

### 5. Deployment

Shipping to production safely.

Deliverables: Release notes, CI/CD checklist, rollback procedure
Templates: `sdlc/deployment/`
Command: `/release_notes`

No direct pushes to production. All releases go through CI. Feature flags are preferred for high-risk changes.

### 6. Operations

Post-deployment health and incident response.

Deliverables: Runbooks, incident reports, on-call guides
Templates: `sdlc/operations/`

Runbooks are written at deploy time, not after an incident.

---

## Rules

These apply across all phases:

1. **Templates are starting points, not ceilings.** Add sections when the project needs them. Remove boilerplate that adds no value.

2. **AI tools read this folder.** Write documentation as if the AI assistant will use it to make decisions — because it will. Be explicit about constraints, not just ideals.

3. **Decisions are documented in ADRs.** If you're explaining a past decision in a PR or a conversation, it should be in an ADR instead.

4. **Configs have one source of truth.** `config/config-sources.json` only. Sync with `npm run sync:configs`.

5. **Context7 before library docs.** When working with any npm package or framework, use the Context7 MCP tool to fetch current documentation. Training data goes stale.

---

## How AI tools use this repo

```
Session start
  └── Tool loads context file (CLAUDE.md / .clinerules / .cursorrules)
        └── Context file references sdlc/ for standards and templates
              └── AI knows: available tools, commands, conventions

User types /generate_prd
  └── MCP server receives command
        └── Reads sdlc/planning/PRD-template.md
              └── Fills template using conversation context
                    └── Writes output to docs/ in current project

User asks "how should I structure this API?"
  └── AI consults sdlc/implementation/coding-standards.md
        └── AI calls Context7 for framework-specific docs
              └── AI responds with project-specific guidance
```

---

## Maintenance cadence

| What | When | How |
|------|------|-----|
| Config drift check | Weekly (automated) | GitHub Actions → `npm run check:configs` |
| Dependency review | Monthly | `npm outdated` + review MCP server versions |
| Template review | Per quarter | Do templates still reflect how you work? |
| Glossary update | As terms are added | Keep `sdlc/glossary.md` current |

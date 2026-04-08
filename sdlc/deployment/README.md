# Deployment Phase

This folder contains checklists and guides for shipping a release safely.

---

## Before anything else — check the PRD

The first action in this phase is to read **Section 6 (Deployment Decision)** of the project's PRD.

**If Section 6 is marked "No"** — this project does not deploy. The deployment phase does not apply. Update `docs/memory/project-state.md` to note that deployment was skipped intentionally, and move to the operations or maintenance phase.

**If Section 6 is marked "Not yet decided"** — stop. The deployment target must be decided before this phase can proceed. Surface this to the user and resolve it before continuing.

**If Section 6 is marked "Yes"** — proceed through this phase using the guides below.

---

## When This Phase Begins

All of the following must be true before deployment begins:

- The PRD Section 6 deployment decision is "Yes" with a defined target
- The testing phase is complete — QA checklist signed off, test plan verdict is Pass or Conditional pass
- No critical or high severity defects are open
- Release notes are drafted
- The deployment target environment is accessible and configured

Do not begin deployment if any of these conditions are unmet.

---

## Roles in This Phase

| Role | Responsibility |
|------|---------------|
| **Orchestrator / human** | Runs the deployment checklist, executes deployment steps, verifies post-deployment |
| **Human approver** (if defined in PRD) | Reviews and approves the release before deployment proceeds |

Deployment is not delegated to an implementation or review agent. It is performed by the orchestrator or human directly. If a deployment step fails, do not attempt to auto-recover — stop and follow the rollback procedure.

---

## Release Model Determines the Path

The PRD Section 6 "Release model" field determines which deployment checklist tier applies.

**Lightweight path** — for informal deployments (solo dev, startup, no formal release process, continuous deployment on merge):
Use the lightweight section of `deployment-checklist.md`. Fewer gates, faster process.

**Full path** — for structured deployments (CI required, staging environment, manual approval, scheduled releases):
Use the full section of `deployment-checklist.md`. All gates apply.

When in doubt, use the full path.

---

## Available Guides

- **deployment-checklist.md** — per-release checklist with lightweight and full tiers
- **rollback-procedure.md** — when and how to roll back a bad release
- **release-notes-guide.md** — how to produce and publish release notes

---

## Definition of Done

The deployment phase is complete when:

- The release is live at the production URL or target environment
- Post-deployment verification passes (the app works in production, not just locally)
- Release notes are published or stored at `docs/releases/`
- `docs/memory/project-state.md` is updated to reflect the deployment complete and the version shipped
- If anything went wrong during deployment: an incident note is committed to `docs/releases/`

---

## Related

- `sdlc/testing/qa-checklist.md` — must be completed before this phase begins
- `sdlc/setup/layers/deployment/` — deployment target setup (Vercel, Docker, etc.)
- `sdlc/setup/layers/ci/` — CI configuration
- `sdlc/operations/` — post-deployment health and incident response

# Implementation Phase Templates

This folder contains templates and standards used during the **implementation** phase.

## When This Phase Begins

Implementation begins when the design phase is complete. The gate condition is met when ALL of the following are true:

- A design agent log exists at `docs/agents/<date>-design-<slug>.md` with `status: complete`
- All three design artifacts exist: technical design document, ADRs, and completed design checklist
- No items in the "Blocked On" section of the design log remain unresolved

Do not begin implementation if any of these conditions are unmet. Return to the design phase.

## Roles in This Phase

| Role | Responsibility |
|---|---|
| **Orchestrator** | Reads the technical design, runs `task-breakdown-template.md`, spawns and sequences subagents, validates all outputs |
| **Implementation agent** | Executes one bounded task — writes code, writes tests, runs tests, writes the completion report |
| **Review agent** | Reads the implementation report and source files, runs tests independently, produces a verdict — does not fix anything |

The orchestrator coordinates. The implementation agent builds. The review agent verifies. These roles do not overlap.

## Sequence

1. **Task breakdown** — Orchestrator fills out `task-breakdown-template.md` to translate the technical design into bounded tasks
2. **Research (if triggered)** — Orchestrator spawns a research agent for any task flagged as requiring one before proceeding
3. **Implementation** — Orchestrator spawns one implementation agent per task; parallel agents are allowed only when tasks have no shared files or dependencies
4. **Review** — After each implementation agent completes, the orchestrator spawns a review agent; implementation does not proceed to the next task until the verdict is `approved` or `approved-with-notes`
5. **Merge** — When all tasks are complete and all verdicts are non-blocking, the PR is opened, CI passes, and the branch is squash-merged to `main`

## Available Templates

- **task-breakdown-template.md** — Used by the orchestrator to translate a technical design into a set of bounded implementation tasks before spawning any agents
- **implementation-checklist.md** — Tracks completion of all pre-implementation, per-task, and phase-level requirements
- **testing-strategy.md** — Defines what tests are required, how they are structured, and what passing means for this codebase
- **environment-setup.md** — Steps an agent follows to verify the local environment is ready before writing code

## Standards

- [coding-standards.md](coding-standards.md) — TypeScript conventions, naming, file structure, error handling, and comment rules
- [git-workflow.md](git-workflow.md) — Branch naming, commit conventions, PR flow, and squash merge rules

## Definition of Done

A task is complete when ALL of the following are true:

- The implementation agent output file exists at `docs/agents/<date>-implementation-<slug>.md` with `status: complete`
- Tests are written and `npm run test:unit` passes with zero failures
- The review agent verdict is `approved` or `approved-with-notes` (never `blocked`)
- The review output is committed to `docs/agents/` before the next task begins

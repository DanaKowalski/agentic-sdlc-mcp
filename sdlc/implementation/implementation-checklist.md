# Implementation Phase Checklist

Use this checklist to track readiness and completion across the full implementation phase.

## Pre-implementation

- [ ] Task breakdown complete (`task-breakdown-template.md` filled out with all tasks for this feature)
- [ ] All research agent outputs exist for tasks that required research (check each task's "Research required" field)
- [ ] Design artifacts exist at `docs/design/` and the design agent log shows `status: complete`
- [ ] Implementation branch created from `main` following `git-workflow.md` (branch name: `feat/<slug>`)

## Per-task Completion

Repeat this block for each task in the breakdown. Copy and label with the task title.

**Task: {{TASK_TITLE}}**

- [ ] Implementation agent output file exists at `docs/agents/<date>-implementation-<slug>.md`
- [ ] Status in output file is: `complete` (not `partial`, not `blocked`)
- [ ] Tests written and passing — `[test command]` confirms zero failures
- [ ] No `console.log`, no commented-out code, no implicit `any` (per `coding-standards.md`)
- [ ] Review agent spawned and verdict is `approved` or `approved-with-notes`
- [ ] Review output committed to `docs/agents/` before this task is marked done

## Phase Completion

- [ ] All tasks in the breakdown are marked complete
- [ ] All review verdicts are `approved` or `approved-with-notes` — no `blocked` verdicts open
- [ ] All `approved-with-notes` items logged and scheduled for follow-up (not silently dropped)
- [ ] PR opened with references to PRD, technical design document, and review report paths in the description
- [ ] CI passes: all required checks defined in the project's CI workflow are green.
- [ ] Squash merged to `main` per `git-workflow.md`
- [ ] `docs/memory/project-state.md` updated and pushed

**Date Completed:**  
**Approved by:**

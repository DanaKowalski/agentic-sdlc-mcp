# Testing Phase

This folder contains templates and guides used during the **testing** phase.

---

## When This Phase Begins

The testing phase begins when ALL of the following are true:

- Implementation is merged to `main`
- All review agent verdicts for this feature are `approved` or `approved-with-notes`
- No `blocked` verdicts remain open in `docs/agents/`

Do not begin testing if any of these conditions are unmet. Return to the implementation phase.

---

## The Role of the Testing Phase

The testing phase is distinct from writing tests during implementation. Implementation agents write unit and integration tests as part of coding a feature. The testing phase is a separate SDLC gate that verifies the completed feature meets its acceptance criteria end-to-end before deployment.

The testing phase happens after implementation is merged to `main` and before deployment begins.

---

## Test Types

The following test types apply in this phase. For implementation-time conventions (where files live, how to mock, how to run), see `sdlc/implementation/testing-strategy.md`.

| Type | When required | Owner |
|---|---|---|
| **Unit** | All pure functions and data transformation logic | Implementation agent during implementation |
| **Integration** | All tool handlers invoked through server context | Implementation agent during implementation |
| **Contract** | External integrations where schema may drift independently | Optional — when called for by the design document |
| **End-to-end / Acceptance** | Full user-facing flows that exercise multiple components together | Testing phase — not implementation phase |
| **Regression** | Before any deployment after a defect fix, or when shared code changes | Testing phase |

---

## Available Templates

### Test Plan Template

**`test-plan-template.md`** — filled out by the orchestrator before testing begins. Defines what scenarios must be verified, maps each to a PRD acceptance criterion, records entry and exit conditions, and captures any defects found. Every release that goes through the testing phase needs a completed test plan.

Use it by copying it to `docs/testing/<date>-<slug>-test-plan.md` and filling in all sections before running any scenarios.

### QA Checklist

**`qa-checklist.md`** — completed after test scenarios are run and before deployment is approved. Verifies the feature is ready to ship across functional, non-functional, regression, and deployment readiness dimensions.

The test plan asks what to test. The QA checklist asks whether the feature is ready. Both must be completed before deployment.

### Regression Testing Guide

**`regression-testing-guide.md`** — explains when regression testing applies, how to identify what to test, how to run both automated and manual regression, and what to do when a regression is found. Read this before running any TEST-R scenarios.

---

## Recommended Workflow

1. Confirm entry conditions are met
2. Copy `test-plan-template.md` to `docs/testing/<date>-<slug>-test-plan.md`
3. Fill in scope, map acceptance criteria to TEST-* scenarios
4. If release touches shared code or includes a defect fix: add TEST-R regression scenarios following `regression-testing-guide.md`
5. Run all scenarios and record Pass / Fail in the test plan
6. Record any defects found in the test plan defects table
7. Complete `qa-checklist.md`
8. Complete test plan sign-off section
9. Update `docs/memory/project-state.md` to reflect testing complete

---

## Definition of Done

The testing phase is complete when:

- All TEST-* scenarios in the test plan have a Pass result
- The QA checklist is fully completed with no open critical or high severity defects
- The test plan sign-off section is completed with a Pass or Conditional pass verdict
- `docs/memory/project-state.md` is updated to reflect testing complete
- Any deferred defects are documented in the test plan with severity and justification

---

## Related Documents

- `sdlc/implementation/testing-strategy.md` — implementation-time test conventions (file locations, naming, mocking, coverage expectations)
- `sdlc/overview.md` — full SDLC phase sequence and phase gate conditions

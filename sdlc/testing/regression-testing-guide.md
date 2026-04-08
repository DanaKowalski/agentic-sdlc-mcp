# Regression Testing Guide

This guide defines how regression testing works in this framework. Read it before running regression tests for any release.

---

## What Regression Testing Is

Regression testing verifies that code changes did not break existing functionality. It is distinct from acceptance testing, which verifies new functionality works. Both happen in the testing phase.

Regression testing applies when:
- A defect fix is being released — the fix must not break anything that was working
- A release touches shared code (utilities, data layers, shared components) used by other features
- A refactor or dependency update is included in the release
- As part of the quarterly maintenance review

Regression testing does not apply to net-new features with no existing surface area and no shared code changes.

---

## How to Identify What to Regression Test

Start from the implementation task breakdown (`docs/agents/<date>-task-breakdown-<slug>.md`). For each file modified:

1. Identify what other features or flows depend on that file
2. Those dependent features are regression candidates
3. Document each as a scenario in the test plan using the TEST-R prefix: TEST-R001, TEST-R002, etc.

The R prefix distinguishes regression scenarios from feature acceptance scenarios and makes it easy to see regression coverage at a glance in the test plan.

If the task breakdown is not available, use the git diff to identify changed files and trace their dependents.

---

## How to Run Regression Tests

Regression testing has two layers:

**Automated regression** — the project's test suite covers unit and integration regression automatically. Run the project's test command and confirm zero failures before proceeding to manual regression. A failing automated test is a regression — do not proceed past it.

**Manual regression** — covers user-facing flows that automated tests do not reach. Work through each TEST-R scenario in the test plan manually, or via an E2E test run if the project has one configured. Record Pass or Fail for each scenario in the test plan.

Both layers must complete before the testing phase is considered done for a release that includes regression scenarios.

---

## What to Do When a Regression Is Found

Record it in the test plan defects table immediately with the severity:

**Critical or high severity:** Stop. Do not proceed to deployment. Surface to the orchestrator or human maintainer. The regression must be fixed and the TEST-R scenario must pass before deployment is approved. Return to the implementation phase.

**Medium or low severity:** Document the defect with a deferral justification in the test plan. A conditional pass verdict may be issued. Deployment may proceed with explicit approval from the project owner.

Never silently skip a regression. Even low severity regressions must be recorded — they compound over time.

---

## How Often to Run a Full Regression

Before every deployment. A full regression does not mean re-running every test scenario ever written — it means running every scenario that covers code changed in this release, plus any shared surfaces those changes could affect.

For small, isolated releases touching no shared code, regression may be limited to automated tests only. Document this decision in the test plan scope section.

---

## Regression Test Record

This table lives in the test plan for each release, not in this guide. Copy this template into the test plan when regression scenarios apply.

| Date | Release / Feature slug | Scenarios run | Pass | Fail | Deferred |
|------|----------------------|---------------|------|------|----------|
| | | | | | |

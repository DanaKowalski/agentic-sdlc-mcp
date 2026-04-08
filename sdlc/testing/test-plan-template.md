# Test Plan — {{FEATURE_SLUG}}

**Feature slug:** {{FEATURE_SLUG}}
**PRD reference:** {{PRD_PATH}}
**Implementation branch:** {{BRANCH_NAME}}
**Date:** {{DATE}}
**Tester:** {{HUMAN_OR_AGENT}}

---

## 1. Scope

### In scope

What is being verified in this test run. Reference the PRD acceptance criteria directly — every Must Have acceptance criterion should map to at least one test scenario below.

- {{ACCEPTANCE_CRITERION_1}} → TEST-001
- {{ACCEPTANCE_CRITERION_2}} → TEST-002
- [continue for each criterion]

### Out of scope

What is explicitly not being tested in this run, and why.

- {{OUT_OF_SCOPE_ITEM}} — [reason: deferred / covered by another plan / not applicable]

---

## 2. Test Scenarios

One row per scenario. Scenario IDs follow the pattern TEST-001, TEST-002, etc.
Regression scenarios use TEST-R001, TEST-R002, etc.

| ID | Description | Type | Steps | Expected Result | Pass / Fail |
|----|-------------|------|-------|-----------------|-------------|
| TEST-001 | [What is being tested] | E2E / Acceptance / Regression | 1. [Step] 2. [Step] | [What should happen] | |
| TEST-002 | | | | | |

**Type definitions:**
- **Acceptance** — verifies a PRD acceptance criterion end-to-end
- **E2E** — verifies a full user flow through the running application
- **Regression** — verifies existing functionality not in scope for this release still works

Fill in Pass or Fail after running each scenario. Leave blank until tested.

---

## 3. Entry Conditions

All of the following must be true before testing begins. Do not start testing if any item is unchecked.

- [ ] Implementation is merged to `main` (or the target branch for this release)
- [ ] All review agent verdicts for this feature are `approved` or `approved-with-notes`
- [ ] No `blocked` verdicts remain open in `docs/agents/`
- [ ] The application environment is configured and running
- [ ] Any required test data, fixtures, or API credentials are in place
- [ ] The test plan scope has been reviewed against the PRD acceptance criteria

---

## 4. Exit Conditions

The testing phase is complete and deployment is approved when ALL of the following are true:

- [ ] All TEST-* scenarios have a recorded **Pass** result
- [ ] No critical or high severity defects are open in the defects table below
- [ ] If this is a defect fix: all TEST-R* regression scenarios pass
- [ ] QA checklist (`sdlc/testing/qa-checklist.md`) is fully completed
- [ ] Sign-off section below is completed

If any exit condition is not met, testing is not complete. Do not proceed to deployment.

---

## 5. Defects Found

Record every defect discovered during testing. Do not skip medium or low severity items.

| Defect ID | Scenario | Severity | Description | Status |
|-----------|----------|----------|-------------|--------|
| DEF-001 | TEST-00N | critical / high / medium / low | [What is broken and how to reproduce] | open / fixed / deferred |

**Severity definitions:**
- **Critical** — blocks core functionality, no workaround. Blocks deployment.
- **High** — major feature broken or data integrity at risk. Blocks deployment.
- **Medium** — feature partially broken, workaround exists. May be deferred with justification.
- **Low** — cosmetic or minor UX issue. May be deferred with justification.

**Deferral justification** (required for any deferred defect):

| Defect ID | Justification | Deferred to |
|-----------|--------------|-------------|
| DEF-00N | [Why this can be deferred and when it will be addressed] | [Sprint or date] |

---

## 6. Sign-off

**Overall verdict:** Pass / Fail / Conditional pass

A **conditional pass** means all exit conditions are met except for deferred medium or low severity defects, each with documented justification above.

**Date completed:**
**Approved by:**
**Notes:**

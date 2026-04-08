# QA Checklist

Use this checklist to verify a feature is ready to ship. Complete it after the test plan scenarios have been run and before deployment begins.

This checklist asks whether the feature is ready. The test plan asks what to test. They are complementary — both must be completed.

---

## Functional Verification

- [ ] All PRD acceptance criteria have been verified against the running application
- [ ] All TEST-* scenarios in the test plan have a recorded Pass result
- [ ] Edge cases identified in the PRD risks section have been tested
- [ ] Error states render correctly with user-facing messages (no raw error objects, stack traces, or blank screens)
- [ ] No unhandled exceptions or console errors occur during normal use flows

## Non-Functional Verification

- [ ] Performance meets the targets defined in the PRD non-functional requirements
- [ ] The application is usable on all target platforms or screen sizes stated in the PRD
- [ ] Security requirements stated in the PRD have been verified
- [ ] Accessibility requirements stated in the PRD have been verified (if applicable — mark N/A with reason if not)

## Regression Verification

- [ ] Existing features not in scope for this release continue to work correctly
- [ ] No regressions introduced in shared components, utilities, or data layers
- [ ] If this is a defect fix: the original defect no longer reproduces

## Documentation and State

- [ ] `docs/memory/project-state.md` reflects testing phase in progress or complete
- [ ] Any defects found and deferred are recorded in the test plan defects table with severity and justification
- [ ] Test plan sign-off section is completed with a Pass, Fail, or Conditional pass verdict

## Deployment Readiness

- [ ] No critical or high severity defects are open
- [ ] All deferred defects have documented justification and are medium or low severity
- [ ] Release notes drafted — via `/release_notes` command or manually from git log
- [ ] Deployment checklist reviewed if `sdlc/deployment/` exists for this project

---

**Date Completed:**
**Approved by:**
**Overall verdict (pass / fail / conditional pass):**

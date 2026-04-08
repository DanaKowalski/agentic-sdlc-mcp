# Planning Phase Checklist

Use this checklist to verify the full planning phase is complete before moving to design or implementation.

---

## Requirements Analysis

- [ ] Feature complexity assessed and mode selected (collaborative or autonomous)
- [ ] Mode selection recorded in the requirements document
- [ ] Requirements document exists at `docs/planning/<date>-<slug>-requirements.md`
- [ ] All questions in the elicitation session are answered or explicitly deferred
- [ ] All `[agent-inferred, flagged]` items have been reviewed by the user
- [ ] Flagged items resolved: confirmed, corrected, or accepted with documented reasoning
- [ ] No open questions remain unresolved (or deferred items documented with justification)
- [ ] Requirements document status set to: Approved

## PRD

- [ ] PRD exists at `docs/planning/<date>-<slug>-prd.md`
- [ ] PRD header references the requirements document
- [ ] All PRD sections filled or explicitly marked N/A with a reason
- [ ] Success metrics are defined and measurable
- [ ] Features are prioritized (MoSCoW)
- [ ] Out of scope items are clearly listed
- [ ] Section 4 acceptance criteria reference REQ-IDs from the requirements document
- [ ] Deployment decision completed in Section 6 (Yes / No / Not yet decided)
- [ ] PRD status set to: Approved

## Review & Approval

- [ ] All critical open questions resolved before approval
- [ ] Stakeholders reviewed (if applicable)
- [ ] PRD approved by: [name]

## Readiness Check

- [ ] User stories have clear acceptance criteria tied to REQ-IDs
- [ ] Non-functional requirements defined
- [ ] Risks, assumptions, and dependencies identified
- [ ] Deployment decision is explicit — not left blank

## Phase Routing

- [ ] If feature involves a new data model → design phase required
- [ ] If feature introduces an external integration → design phase required
- [ ] If feature changes an API surface → design phase required
- [ ] If feature touches auth or security → design phase required
- [ ] If none of the above → document reasoning for skipping design phase here: ___

---

**Date Completed:**
**Approved by:**

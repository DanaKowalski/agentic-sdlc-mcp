# Requirements Analysis — {{FEATURE_SLUG}}

**Feature slug:** {{FEATURE_SLUG}}
**Date:** {{DATE}}
**Mode:** Collaborative | Autonomous
**Mode selected by:** User | Agent recommendation accepted
**Total requirements:** {{N}}
**Flagged for review:** {{N_FLAGGED}}
**Related PRD:** docs/planning/{{DATE}}-{{FEATURE_SLUG}}-prd.md

---

## Mode record

**Mode used:** [Collaborative / Autonomous]
**Reason:** [One sentence — why this mode was recommended and whether the user confirmed or changed it]

---

## Requirements

| REQ-ID | Category | Requirement | Source | Confidence |
|--------|----------|-------------|--------|------------|
| REQ-001 | [category] | [requirement statement] | [user-provided / agent-inferred / agent-inferred, flagged] | [high / medium / low] |
| REQ-002 | | | | |

**Category values:** Functional scope, User and persona, Edge cases and error states, Non-functional, Constraints, Integration, Deployment

**Source tag definitions:**
- `[user-provided]` — explicitly stated by the user during elicitation or in the feature description
- `[agent-inferred]` — derived from context with reasonable confidence; review recommended
- `[agent-inferred, flagged]` — inferred with low confidence or two reasonable interpretations exist; review required before PRD approval

---

## Flagged items — review required

List all `[agent-inferred, flagged]` requirements here for easy scanning. The user must explicitly confirm, correct, or accept each one before the PRD is approved.

| REQ-ID | Requirement | Why flagged | User resolution |
|--------|-------------|-------------|-----------------|
| REQ-00N | [requirement] | [what is ambiguous or uncertain] | [confirmed / corrected to: / deferred] |

If no items are flagged: write "None."

---

## Open questions log

Requirements that could not be resolved during elicitation — either because the user skipped them or because the agent could not make a reasonable inference. These must be resolved before the PRD is approved or explicitly accepted as out of scope.

| # | Question | Status | Resolution |
|---|----------|--------|------------|
| 1 | [Question that was skipped or unresolved] | open / resolved / deferred | [Answer or reason for deferral] |

If no open questions remain: write "None."

---

## Elicitation session log (collaborative mode only)

A record of the question and answer session. Skip this section for autonomous mode.

**Total questions asked:** {{N}}
**Answered by user:** {{N_USER}}
**Inferred by agent:** {{N_INFERRED}}
**Flagged:** {{N_FLAGGED}}

| # | Question | Answer | Source |
|---|----------|--------|--------|
| 1 | [Question text] | [Answer] | [user-provided / agent-inferred / agent-inferred, flagged] |

---

## Traceability note

REQ-IDs from this document are referenced in:
- PRD Section 4 acceptance criteria: `[REQ-001]`
- Design ADRs (where a requirement drove an architectural decision)
- Implementation task breakdown acceptance criteria

When a downstream decision contradicts or changes a requirement, update this document and note the change in the PRD changelog.

---

**Date completed:**
**Reviewed by:**
**Approval status:** Draft | Approved | Approved with flagged items accepted

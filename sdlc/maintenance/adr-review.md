# ADR Review

Use this guide when an architectural decision recorded in an ADR needs to be revisited, updated, or reversed. ADRs are not immutable — they are a record of what was decided and why. When circumstances change, the ADR record should change with them.

---

## When to Run This Review

- A technical decision that was made is no longer working as intended
- A dependency or external service referenced in an ADR has changed significantly
- The project's scale, team size, or requirements have shifted enough to invalidate a past decision
- During quarterly process review, an ADR is identified as stale
- A new implementation task conflicts with an existing ADR

---

## ADR Statuses

Every ADR has a status. Use these consistently:

| Status | Meaning |
|--------|---------|
| `Proposed` | Decision is under discussion, not yet adopted |
| `Accepted` | Decision is in effect |
| `Deprecated` | Decision is no longer recommended but still in place |
| `Superseded` | Decision has been replaced by a newer ADR |

Do not delete ADRs. Change their status and link to the replacement.

---

## Step 1 — Identify the ADR to review

Find the relevant ADR in `docs/adr/`. Read it fully before making any changes. Understand:
- What decision was made
- What alternatives were considered
- What the stated rationale was
- What consequences were anticipated

---

## Step 2 — Determine the type of change needed

**The decision is still correct but the documentation is outdated:**
Update the ADR in place. Add a note at the bottom: "Updated [date] — [what changed and why]." Keep the original content intact above it.

**The decision needs to be partially revised:**
Update the ADR in place. Change the relevant sections and add a changelog entry at the bottom explaining what changed and why. Status remains `Accepted`.

**The decision needs to be fully replaced:**
1. Mark the existing ADR status as `Superseded`
2. Add a line at the bottom: "Superseded by: `docs/adr/<NNN>-<slug>.md`"
3. Create a new ADR with the new decision, referencing the old one in its Context section: "This supersedes `docs/adr/<old-NNN>-<slug>.md`"
4. The new ADR gets the next sequential number

**The decision was wrong and is being reversed with no replacement:**
Mark the existing ADR status as `Deprecated`. Add a note explaining why the decision is being abandoned and what approach is being used instead (even if informally).

---

## Step 3 — Update affected documents

An ADR change rarely stands alone. Check and update:

- **Technical Design Document** — if the TDD references this ADR, update the reference and any sections that depended on the decision
- **Implementation files** — if code was written based on the ADR decision, the code may need to change. If so, this is now an implementation task — follow the implementation phase process
- **`docs/memory/project-state.md`** — add the ADR change to "Decisions not yet in an ADR" if it was made verbally before the ADR was updated, or note it in "Completed this session"
- **Other ADRs** — if other ADRs reference this one, check whether they need updating too

---

## Step 4 — Commit the change

```
git add docs/adr/
git commit -m "docs(adr): [supersede|update|deprecate] ADR-NNN — [one line reason]"
```

If a new ADR was created:
```
git add docs/adr/
git commit -m "docs(adr): add ADR-NNN — [decision title]"
```

---

## What makes a good ADR update

- The original decision and rationale are preserved — do not rewrite history
- The reason for the change is documented clearly
- Anyone reading the ADR history can understand what changed and why
- The changelog entry at the bottom is dated

## What to avoid

- Deleting ADRs — the record of past decisions has value even when wrong
- Silently updating an ADR without a changelog entry
- Changing a decision in code without updating the ADR
- Creating a new ADR that contradicts an existing `Accepted` one without superseding it

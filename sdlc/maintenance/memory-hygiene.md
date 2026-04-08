# Memory Hygiene

Use this guide when project state feels stale, inconsistent, or out of sync across tools and sessions. Good memory hygiene keeps the framework useful — stale memory is worse than no memory because it causes agents to act on outdated state.

---

## When to Run This Review

- A new session starts and the agent's orientation feels wrong or incomplete
- `docs/memory/project-state.md` hasn't been updated in more than a week of active work
- You switch tools and the new tool's session doesn't reflect what was done in the last session
- The project-state.md file is approaching or exceeding 300 words
- A session ended without a proper close (power cut, crash, context limit hit)
- `session_status` is `open` at the start of a new session

---

## Step 1 — Audit the current state file

Read `docs/memory/project-state.md` and check:

- **Field names** — do they match the required schema exactly? (`**Last updated**:`, `**Current phase**:`, `**Active branch**:`, `**Session status**:`)
- **Current phase** — does it reflect where the project actually is right now?
- **Open work** — are all items still open, or have some been completed without being moved?
- **Decisions not yet in an ADR** — have any of these been formally recorded as ADRs and not removed from this section?
- **Last session summary** — is it accurate and recent enough to be useful?
- **Blockers** — are listed blockers still real, or have they been resolved?
- **Session status** — is it `closed`? If `open`, the last session did not close cleanly

---

## Step 2 — Audit recent agent outputs

If the state file is uncertain, the ground truth is `docs/agents/`. Read the most recent agent output files and check:

- What was the last completed task?
- What was the last review verdict?
- Are there any `status: partial` or `status: blocked` outputs that were never resolved?

The agent outputs are immutable records. The state file should be consistent with them.

---

## Step 3 — Correct the state file

Rewrite `docs/memory/project-state.md` to reflect actual current state. Use the exact required schema:

```markdown
# Project state

**Last updated**: YYYY-MM-DD
**Current phase**: [Planning | Design | Implementation | Testing | Deployment | Operations]
**Active branch**: [branch name or "none"]
**Session status**: closed

---

## Open work

- [ ] [Only genuinely open items]

## Completed this session

- [What was corrected or cleaned up in this hygiene session]

## Decisions not yet in an ADR

- [Only decisions not yet formally recorded]

## Last session summary

[One sentence describing current state and what to do next.]

## Blockers

[Only active blockers. Empty if none.]
```

Keep the file under 300 words. If completed items have accumulated, move them to `docs/memory/archive.md` before rewriting.

---

## Step 4 — Archive completed items

If the state file has grown beyond 300 words, or contains a long history of completed work:

1. Create `docs/memory/archive.md` if it does not exist
2. Move all completed items from the state file into the archive with a date header:
   ```markdown
   ## Archived [YYYY-MM-DD]
   - [completed item]
   - [completed item]
   ```
3. Keep only current state in `docs/memory/project-state.md`

The archive is a permanent record. Do not delete it.

---

## Step 5 — Commit the corrected state

```bash
git add docs/memory/
git commit -m "docs(memory): hygiene pass — [one word describing what was corrected]"
git push
```

Push immediately. An unpushed state correction is invisible to other tools and future sessions.

---

## Preventing future hygiene issues

| Habit | Why it helps |
|-------|-------------|
| Always close sessions with a state update | Prevents `session_status: open` at next start |
| Keep state file under 300 words | Prevents buried current state |
| Move completed items promptly | Prevents open work list from becoming a history log |
| Commit and push before closing | Prevents cross-tool inconsistency |
| One session update per session | Prevents mid-session state inconsistency |

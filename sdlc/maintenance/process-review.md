# Process Review

Use this guide for the quarterly review of whether the SDLC process itself still fits how the project and team work. The framework is a starting point, not a fixed rule. If parts of it are creating friction without adding value, they should be changed.

---

## When to Run This Review

- Quarterly, on a fixed schedule
- When the team repeatedly skips or shortcuts a phase without discussing why
- When the overhead of following the process feels disproportionate to the value it produces
- When the project has shifted significantly in scope, team size, or technical complexity

---

## Step 1 — Review phase usage

For each SDLC phase, ask honestly:

**Planning**
- Are PRDs being used and approved, or are features being built without them?
- Are user stories with acceptance criteria being written, or are they placeholders?
- If planning is being skipped: is the project too mature and stable to need it, or is it being skipped out of habit?

**Design**
- Are technical design documents being created for features that need them?
- Are ADRs being written for significant decisions, or are decisions being made informally?
- Is the Design Agent being spawned when it should be, or is design work being done inline?

**Implementation**
- Is the task breakdown template being used before spawning implementation agents?
- Is the review agent running after every implementation task?
- Are `approved-with-notes` items being resolved, or accumulating?

**Testing**
- Is the testing phase happening before deployment?
- Are acceptance criteria being verified end-to-end?

**Maintenance**
- Is memory being updated at session end consistently?
- Are monthly dependency reviews happening?

For each phase where the honest answer is "no, we're skipping this" — decide whether to fix the habit or simplify the process.

---

## Step 2 — Review the templates

For each template in `sdlc/`:

- Does it still reflect how you actually work?
- Are there sections that are always left blank or marked N/A?
- Are there things you always do that aren't in the template?

If a section is never used: remove it or make it explicitly optional.
If something is always done but not in the template: add it.

Fetch the relevant template via sdlc-gitmcp and compare it against your recent artifacts in `docs/`. If your actual outputs consistently differ from the template, the template needs updating — or your process does.

---

## Step 3 — Review the agent system

- Are subagents being spawned via the tool's native mechanism (Task tool, new_task, etc.) or being simulated inline?
- Is the review agent producing useful verdicts, or rubber-stamping?
- Are agent output files in `docs/agents/` being read at session start, or accumulating unread?
- Is the memory protocol being followed, or are sessions starting cold without orientation?

If agents are consistently being simulated rather than spawned: either the task sizes are too small to justify spawning, or the spawn mechanism needs to be better documented for the tool being used.

---

## Step 4 — Review the glossary

Read `sdlc/glossary.md`. For each term:
- Is it still accurate?
- Are there new terms that have emerged in the project that should be added?
- Are there terms that are no longer used?

Update the glossary as needed.

---

## Step 5 — Make changes and document them

For any process change decided during this review:

- Update the relevant `sdlc/` phase README or template
- If the change is significant — for example, removing a required phase or changing when agents are spawned — create an ADR documenting the decision and rationale
- Update `sdlc/overview.md` if phase definitions or rules changed

Commit all changes:

```bash
git add sdlc/
git commit -m "docs(sdlc): quarterly process review — [one line summary of changes]"
git push
```

If no changes were needed, commit a note:

```bash
git commit --allow-empty -m "docs(sdlc): quarterly process review — no changes needed"
```

The empty commit creates a record that the review happened.

---

## Signs the process needs simplifying

- Agents consistently skip steps even when prompted to follow them
- The overhead of documentation exceeds the time spent implementing
- Templates produce artifacts that no one reads before starting the next phase
- The team discusses "working around" the framework rather than with it

If these signs appear, the right response is to simplify the process — not to abandon it. Remove steps that don't produce value. Shorten templates. Reduce required artifacts. A lighter process that is followed is better than a thorough one that is not.

# Planning Phase

This folder contains templates and guides used during the **planning** phase.

---

## Workflow

Planning now runs in two steps. The requirements analysis step is new — do not skip it. A PRD written without requirements analysis is a PRD built on hidden assumptions.

### Step 1 — Requirements analysis

Before generating the PRD, run requirements analysis for the feature.

1. Read `requirements-elicitation-guide.md`
2. Assess feature complexity and ask the user which mode they want: **collaborative** or **autonomous**
3. Work through the question taxonomy and produce a requirements document at `docs/planning/<date>-<slug>-requirements.md`
4. Ensure all `[agent-inferred, flagged]` items are reviewed by the user before proceeding
5. Get user confirmation that the requirements document is approved

**Collaborative mode** — questions are asked one at a time showing progress ("Question 3 of 9"). User can say "show me all" at any point to see remaining questions at once.

**Autonomous mode** — agent answers all questions itself, tags every inferred answer, flags anything uncertain. User reviews the output rather than participating in the process.

### Step 2 — PRD generation

With the requirements document approved:

1. Use `PRD-template.md` to generate the PRD
2. Reference the requirements document in the PRD header
3. In Section 4, each acceptance criterion references the REQ-ID it satisfies
4. Complete the deployment decision in Section 6
5. Complete `planning-checklist.md`
6. Get PRD approval before moving to design

---

## Available Templates

- **requirements-elicitation-guide.md**
  The agent's operating manual for requirements analysis. Covers complexity assessment, mode selection, the question taxonomy, the interview protocol, and source tagging rules.

- **requirements-analysis-template.md**
  The document produced by requirements analysis. Contains REQ-IDs, source tags, flagged items, and the traceability note connecting requirements to downstream artifacts.

- **PRD-template.md**
  Product Requirements Document. Generated after requirements analysis is complete. Section 4 acceptance criteria reference REQ-IDs from the requirements document.

- **SRS-template.md** (Agile)
  Lightweight Agile SRS for additional technical specification when deeper detail is needed beyond the PRD.

- **planning-checklist.md**
  Checklist to verify the full planning phase is complete — requirements analysis and PRD — before moving to design.

- **user-story-guidelines.md**
  Guidelines for writing effective user stories and acceptance criteria.

---

## When to use collaborative vs autonomous mode

| Signal | Recommended mode |
|--------|-----------------|
| Simple, well-understood feature | Autonomous |
| Feature similar to existing patterns in the codebase | Autonomous |
| Complex business process with explicit rules | Collaborative |
| Vague or high-level feature description | Collaborative |
| Multiple user roles with different permissions | Collaborative |
| Compliance, security, or financial logic | Collaborative |
| Feature touching multiple systems | Collaborative |

The agent recommends a mode based on this assessment but the user always has final say.

---

## Output locations

| Artifact | Path |
|----------|------|
| Requirements document | `docs/planning/<date>-<slug>-requirements.md` |
| PRD | `docs/planning/<date>-<slug>-prd.md` |
| Planning index (if using `/generate_prd` locally) | `docs/planning/index.md` |

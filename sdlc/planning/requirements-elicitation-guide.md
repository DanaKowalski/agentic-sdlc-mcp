# Requirements Elicitation Guide

This guide defines how the agent conducts requirements analysis before generating a PRD. Follow it exactly. Requirements elicitation produces the `requirements-analysis-template.md` output — the PRD is generated from that output, not from the raw feature description.

---

## Step 1 — Assess complexity and recommend a mode

Read the feature description and assess complexity using these signals:

**Recommend autonomous mode when:**
- The feature is well-understood and similar to common patterns (CRUD, search, display)
- The feature description is specific and leaves little ambiguous
- The feature is small in scope (one or two user flows)
- The project already has established patterns this feature follows

**Recommend collaborative mode when:**
- The feature involves a business process with rules that must be explicitly defined
- The feature description is vague or high-level
- The feature touches multiple systems or user roles
- The feature has significant edge cases that could be interpreted multiple ways
- The feature involves compliance, security, or financial logic

State your recommendation and the reason in one sentence, then ask:

> "This feature looks [simple / complex]. I recommend [autonomous / collaborative] mode for requirements analysis.
>
> - **Autonomous** — I'll generate requirements from the feature description, flag everything I've inferred, and you review the output.
> - **Collaborative** — I'll ask you questions one at a time (showing progress like 'Question 2 of 8') and build the requirements from your answers. You can say 'show me all' at any point to see all remaining questions at once.
>
> Which mode would you like?"

Wait for the user's answer before proceeding. Record the mode chosen in the requirements document.

---

## Step 2 — Generate the question set

Whether autonomous or collaborative, always generate the full question set first before answering or asking any of them.

Work through the question taxonomy below. For each category, generate questions that are specific to this feature — do not use generic placeholder questions. Then filter out any question already answered by the feature description. What remains is the question set.

### Question taxonomy

#### Functional scope
- What are the exact inputs the user or system provides?
- What are the exact outputs or results produced?
- What are the primary user flows from start to finish?
- Are there secondary or alternative flows?
- What triggers the feature — user action, system event, schedule?

#### User and persona
- Who are all the user roles that interact with this feature?
- What is the technical level and context of each role?
- Are there permission or access differences between roles?
- What is the user's goal before and after using this feature?

#### Edge cases and error states
- What happens when required input is missing or invalid?
- What happens when an external dependency (API, database, service) fails?
- What happens when the user takes an unexpected action mid-flow?
- Are there concurrency or race condition scenarios?
- What are the boundary conditions for numeric inputs, list sizes, or date ranges?

#### Non-functional requirements
- What are the performance expectations (response time, throughput)?
- What platforms, browsers, or screen sizes must be supported?
- Are there accessibility requirements?
- Are there security requirements (auth, data handling, encryption)?
- Are there data retention or privacy requirements?

#### Constraints
- Are there technical constraints (language, framework, existing architecture)?
- Are there time or budget constraints that affect scope?
- Are there dependencies on other features or teams?
- Are there regulatory or compliance constraints?

#### Integration
- What external systems, APIs, or services does this feature connect to?
- What existing internal systems does it read from or write to?
- What does this feature expose to other parts of the system?
- Are there versioning or backward compatibility requirements?

#### Deployment
- Will this feature be deployed to users? If so, where?
- Does it require environment-specific configuration?
- Does it require a database migration or data backfill?
- Is a phased rollout or feature flag required?

---

## Step 3A — Autonomous mode

Answer every question in the question set yourself. For each answer, assign a source tag:

- `[user-provided]` — the feature description or prior conversation explicitly stated this
- `[agent-inferred]` — you derived this from context; reasonable but not explicitly stated
- `[agent-inferred, flagged]` — you inferred this but have low confidence, or two reasonable interpretations exist

Flag liberally. It is better to flag something that turns out to be obvious than to silently make an assumption that turns out to be wrong.

After completing all answers, present the requirements document to the user and say:

> "I've generated requirements in autonomous mode. Items tagged `[agent-inferred, flagged]` are assumptions I'm not confident about — please review these specifically before approving."

List all flagged items prominently so the user can scan them quickly.

---

## Step 3B — Collaborative mode

Present questions one at a time in this format:

> **Question [N] of [TOTAL]:** [Question text]
>
> *(Say 'show me all' to see all remaining questions at once. Say 'skip' to move on and I'll infer an answer.)*

After each answer:
- Record it as `[user-provided]`
- Confirm receipt in one sentence if the answer needs interpretation: "Got it — I'll record this as [your interpretation]. Moving on."
- Move to the next question

**If the user says "show me all":**
List all remaining questions as a numbered continuation of the current count:

> Here are the remaining questions ([N] to [TOTAL]):
>
> [N]. [Question]
> [N+1]. [Question]
> ...
>
> Answer as many as you like. I'll infer answers for any you skip and flag them for review.

Process whatever answers are given. For any skipped question, apply the same autonomous tagging rules from Step 3A.

**If the user says "skip":**
Record the question as `[agent-inferred, flagged]` and move to the next question.

**If the user gives a partial answer:**
Take what was given as `[user-provided]`, infer the remainder as `[agent-inferred]`, and note what was inferred.

---

## Step 4 — Assign REQ-IDs and produce the document

After all questions are answered (by user or agent), convert answers into formal requirements:

- Each distinct requirement gets a unique ID: REQ-001, REQ-002, etc.
- IDs are sequential within the document — do not reuse or skip numbers
- One requirement per ID — do not bundle multiple requirements under one ID
- Requirements are stated as capabilities or constraints, not as implementation details

Write the requirements to `docs/planning/<date>-<slug>-requirements.md` using the `requirements-analysis-template.md` structure.

---

## Step 5 — Handoff to PRD

After the requirements document is written and the user has reviewed any flagged items:

- Reference the requirements document in the PRD header
- In PRD Section 4 (Features & Functional Requirements), each acceptance criterion references the REQ-ID it satisfies
- Any requirement not reflected in the PRD acceptance criteria is a gap — surface it before PRD approval

---

## Source tag reference

| Tag | Meaning | User action required? |
|-----|---------|----------------------|
| `[user-provided]` | Explicitly stated by the user | No |
| `[agent-inferred]` | Derived from context with reasonable confidence | Review recommended |
| `[agent-inferred, flagged]` | Inferred with low confidence or ambiguous | Review required before PRD approval |

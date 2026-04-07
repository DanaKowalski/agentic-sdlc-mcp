# Orchestrator rules

This document defines the operating rules for the orchestrator agent — the coordinating agent responsible for owning the overall session plan and delegating bounded tasks to specialized subagents.

These rules are written to be followed by any LLM. Avoid relying on judgment where an explicit rule can be given. When deviation is necessary, document the reason in the session plan before proceeding.

---

## What the orchestrator is

The orchestrator is the main coordinating agent in a session. It maintains the high-level plan, delegates bounded tasks to specialized subagents, and synthesizes their outputs.

It does not perform deep research or heavy implementation work itself. Those tasks are delegated to the appropriate subagents.

---

## Writing subagent prompts (multi-LLM requirement)

Subagents in this system may be powered by different LLMs (e.g. GPT-4o, Gemini, Claude, Mistral). Prompts must be written to work reliably across models. Follow these rules when composing any subagent prompt:

1. Use explicit conditionals, not soft preferences. Write "If X is true, do Y. Otherwise do Z." not "You may want to consider Y."
2. State the output format exactly. Specify required fields, their names, and their types. Do not rely on the model inferring a format from examples alone.
3. Avoid model-specific idioms. Do not use phrases that assume a particular model's behavior (e.g. chain-of-thought prompting conventions that differ between models).
4. State what the agent must NOT do before stating what it must do. Constraints are more portable than capability descriptions.
5. Include a failure instruction. Every prompt must say: "If you cannot complete this task, write a blocked log with the reason and stop. Do not partially complete the task and present it as done."
6. Keep prompts self-contained. Do not assume the subagent has memory of prior turns. Include all context it needs directly in the prompt.

---

## When to spawn subagents

These triggers are applied in order. Evaluate each trigger explicitly — do not skip evaluation steps.

### Trigger 0 — Design phase

Spawn the Design Agent when ALL of the following are true:
- An approved PRD exists for the feature
- The feature involves architectural decisions (new data model, external integration, new API surface, auth/security changes, etc.)
- No design artifacts already exist for this feature in `docs/design/`

Skip for simple bug fixes or pure UI changes with no architectural impact.

Before spawning: check whether `docs/design/` already contains artifacts for this feature slug. If artifacts exist with `status: complete`, do not re-spawn — proceed to the next phase.

### Trigger 1 — Unknown codebase

Spawn a research agent before writing or modifying code if the relevant files have not been read in the current session.

### Trigger 2 — Large scope

Spawn a research agent when the task involves understanding or modifying more than 3 files whose full contents are not already present in the current context window.

"In context" means the file content has been explicitly read and is available — not that the filename is known.

### Trigger 3 — Independent work units

Spawn parallel subagents when a task breaks into two or more units that have no shared state and can be completed independently (e.g. implementation and test writing).

Do not spawn parallel agents for tasks that share mutable state or that depend on each other's output.

### Trigger 4 — High-risk changes

Spawn an isolated implementation agent for any of the following:
- Destructive operations (deletes, migrations, schema changes)
- Large refactors touching more than 5 files
- Any change to authentication, authorization, or security logic
- Any change to a public API surface

### Trigger 5 — Before finalizing work

Spawn a review agent before marking any implementation work complete if it meets one or more of the following:
- The change touches more than 2 files
- The change affects auth, security, or data model logic
- The change modifies a public API surface
- The implementation was done by a subagent (not directly by the orchestrator)

Do not skip the review agent to save time. Skipping creates hidden debt.

### When triggers conflict

If multiple triggers are active simultaneously, apply them in this priority order: 0 → 4 → 1 → 2 → 3 → 5. Higher-priority triggers are resolved first. Document the active triggers and resolution order in the session plan.

---

## Handoff protocol

When spawning a subagent, the prompt must include all of the following. Do not spawn without every item present:

- The agent's role (research / design / implementation / review)
- A single, clearly bounded task stated as one sentence
- Explicit scope: which files and directories the agent may read and write
- Key constraints: what the agent must not do
- The required output file path in `docs/agents/`
- The required output format (see Output contract below)
- The failure instruction: "If you cannot complete this task, write a blocked log and stop."
- Paths to any `sdlc/` documents the agent must read before starting

If you cannot write a single-sentence bounded task, break the work down further before spawning.

### Output contract

Every subagent must write its result to a file. Verbal or in-context output is not acceptable — it is not durable and is lost at session end.

Output file path convention:

```
docs/agents/<date>-<agent-role>-<slug>.md
```

Every output file must begin with this frontmatter block. The orchestrator validates these fields before proceeding:

```
---
status: complete | blocked | partial
date: <YYYY-MM-DD>
agent: <role>
feature: <slug>
---
```

A file without valid frontmatter is treated as incomplete. The orchestrator must not proceed past an incomplete output.

### Output validation (required after every subagent)

After reading a subagent's output file, the orchestrator must check all of the following before continuing:

1. The file exists at the expected path.
2. The frontmatter is present and `status` is set.
3. If `status: complete` — all declared artifacts exist at their stated paths.
4. If `status: blocked` — follow the Blocked status recovery path below.
5. If `status: partial` — treat as blocked. Do not proceed on partial output.

If any check fails, halt and follow the Blocked status recovery path.

### Blocked status recovery path

When a subagent returns `status: blocked` or `status: partial`, or when output validation fails:

1. Stop. Do not spawn the next agent in the sequence.
2. Read the "Blocked On" section of the subagent's log to identify the specific gap.
3. Write the block to the session plan with the reason.
4. Surface the block to the user or human-in-the-loop before proceeding. Do not resolve the block autonomously unless the resolution is unambiguous and low-risk.
5. Wait for explicit instruction before continuing.

Do not attempt to work around a block by skipping the blocked agent's outputs.

### Commit after every subagent output

After validating a subagent's output, commit it immediately:

```
git add docs/agents/
git commit -m "docs(agents): <agent-role> - <slug>"
```

This ensures the output is readable by subsequent agents and tool sessions via GitMCP. Do not batch commits across multiple subagents.

---

## What the orchestrator must not do

- Must not write implementation code directly if a spawn trigger is active
- Must not read more than 5 files in a row without checking whether a research agent should be doing this instead
- Must not mark a task complete without spawning a review agent if Trigger 5 criteria are met
- Must not spawn a subagent without a written output path defined in the prompt
- Must not use a subagent's in-context response as the result — only the written output file counts
- Must not proceed past a `status: blocked` or `status: partial` output without explicit user instruction
- Must not re-spawn a subagent for a feature if a `status: complete` output already exists for that agent and slug
- Must not spawn a subagent with a vague task ("help me with X") — the task must be bounded and stateable in one sentence

---

## Orchestrator session flow

Every session follows this sequence in order. Do not skip steps.

### 1. Orient

Read the following before doing anything else:
- `sdlc/overview.md`
- `docs/memory/project-state.md` (if it exists)
- Any open agent logs in `docs/agents/` with `status: blocked` or `status: partial`

Identify: current project state, open tasks, and any unresolved blocks from prior sessions.

### 2. Plan

Write the session plan to `docs/agents/<date>-orchestrator-plan.md` before taking any action.

The plan must list:
- Each task for this session
- Which spawn trigger applies (or "none — handled directly" with a reason)
- The expected output path for each subagent
- Any known blocks or dependencies between tasks

Commit the plan before executing.

### 3. Execute (per task)

For each task in the plan:

- Evaluate all triggers in priority order (0 → 4 → 1 → 2 → 3 → 5)
- If a trigger is active → spawn the appropriate subagent with a complete prompt
- If no trigger is active → handle directly, but document this decision in the plan
- After each subagent completes → validate output before moving to the next task

If Trigger 0 (Design Phase) is active, it must be resolved before any implementation triggers are evaluated.

### 4. Collect

After each subagent:
- Read the output file
- Run output validation (all 5 checks)
- If blocked → follow the Blocked status recovery path
- If valid → commit to repo

### 5. Synthesise

Update any affected PRDs, ADRs, or design documents with results from this session. Commit all changes.

### 6. Close

Write a session summary to `docs/agents/<date>-orchestrator-summary.md`.

The summary must include:
- Tasks completed this session
- Tasks blocked, with reason
- Artifacts produced (with paths)
- Any assumptions made
- Recommended next session starting point

Commit and push.

---

## Tool-specific invocation

The following describes how to spawn subagents in each supported orchestration platform. These are platform differences only — the prompt content, output contract, and validation rules above apply regardless of platform.

### Claude Code
Spawn subagents via the Task tool. Each Task invocation creates a fresh context window with no memory of the parent session. Pass all required context explicitly in the task prompt.

### Roo / Cline (boomerang mode)
Use the `new_task` tool to spawn a child agent in a scoped mode. The child agent has no access to the parent's context — include all needed files and instructions in the task definition.

### Cursor
Use a new Composer window per subagent. Paste the full subagent prompt. Cursor agents share the workspace filesystem, so output file paths work as expected.

### Windsurf
Simulate sequentially: Research → Design → Implementation → Review. Run each as a separate Cascade session. Pass output file paths between sessions rather than relying on in-context handoffs.

### Any tool (fallback)
Write the full subagent prompt to `docs/agents/<date>-<role>-prompt.md`, then execute it in a new chat session. The subagent reads its prompt from that file and writes output to the specified path.

---

## Anti-patterns — never do these

| Anti-pattern | Why it fails |
|---|---|
| Spawning a subagent with "help me with X" | No bounded output — the agent cannot know when it is done |
| Reading subagent output from chat history | Not durable — lost on session end, not accessible via GitMCP |
| Skipping the review agent to save time | Creates hidden debt that surfaces later |
| Spawning a subagent for a 5-minute task | Overhead exceeds benefit — handle directly and document why |
| Not committing subagent output immediately | Next session or agent cannot find it |
| Proceeding past a blocked output | Downstream agents build on a missing foundation |
| Re-spawning an agent whose output already exists | Wastes tokens and may overwrite a valid result |
| Using soft language in subagent prompts ("you may want to…") | Inconsistently followed across LLMs — use explicit conditionals |
| Assuming subagent output matches the template without checking | Different models format output differently — always validate frontmatter |

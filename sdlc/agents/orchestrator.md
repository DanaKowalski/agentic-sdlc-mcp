# Orchestrator rules

This document defines the preferred operating principles for the orchestrator agent — the main session agent responsible for owning the overall plan and coordinating subagents.

These rules should be followed as strong defaults. Use judgment when a situation clearly warrants deviation, and always document any deviation with reasoning.

---

## What the orchestrator is

The orchestrator is the main coordinating agent in a session. It maintains the high-level plan, delegates bounded tasks to specialized subagents, and synthesizes their results. 

It avoids performing deep research or heavy implementation work itself, preferring to delegate those to the appropriate subagents.

---

## When to Spawn Subagents

Follow these triggers as the default behavior. Only skip spawning a subagent if you have a strong, explicit reason — and document that reason in your plan.

### Trigger 1 — Unknown Codebase
Spawn a research agent before writing or modifying code if you have not yet explored the relevant files in the current session.

### Trigger 2 — Large Scope
Spawn a research agent when the task involves understanding or modifying more than 3 files whose contents are not already in context.

### Trigger 3 — Independent Work Units
Spawn parallel subagents when a task naturally breaks into independent units (e.g. implementation + tests).

### Trigger 4 — High-Risk Changes
Spawn an isolated implementation agent for destructive changes, large refactors, or security-sensitive work.

### Trigger 5 — Before Finalizing Work
Always spawn a review agent before marking significant implementation work as complete.

---

## Handoff Protocol (Default Approach)

When spawning a subagent, include in its context:

- Its role (research / implementation / review)
- A single, clearly bounded task
- Explicit scope (files/directories it may touch)
- Key constraints
- Required output file path in `docs/agents/`
- Relevant `sdlc/` documents it must consult

Prefer writing clear, specific tasks. If you cannot define a bounded objective, break the task down further before delegating.

### Output contract

Every subagent MUST write its result to a file. Verbal output from a subagent is not acceptable. The output path follows this convention:

```
docs/agents/<date>-<agent-role>-<slug>.md

Examples:
  docs/agents/2026-04-05-research-auth-flow.md
  docs/agents/2026-04-05-implementation-user-api.md
  docs/agents/2026-04-05-review-payment-module.md
```

After the subagent completes, the orchestrator reads its output via `sdlc-gitmcp` or the filesystem, then continues the plan.

### Commit after every subagent output

After reading a subagent's output, commit it to the repo immediately:

```
git add docs/agents/
git commit -m "docs(agents): <agent-role> — <slug>"
```

This ensures the output is readable by any subsequent agent or tool session via GitMCP.

---

## What the orchestrator must NOT do

- Must NOT write implementation code directly if a spawn trigger is active
- Must NOT read more than 5 files in a row without checking if a research agent should be doing this instead
- Must NOT mark a task complete without spawning a review agent first
- Must NOT spawn a subagent without a written output path
- Must NOT use a subagent's verbal response as the result — only file output counts

---

## Orchestrator session flow

Every session follows this sequence:

```
1. Orient
   Read sdlc/overview.md and docs/ via sdlc-gitmcp
   Understand current project state and open tasks

2. Plan
   Write the session plan as docs/agents/<date>-orchestrator-plan.md
   List each task, its spawn trigger (if any), and the expected output path

3. Execute (per task)
   If spawn trigger active → spawn appropriate subagent
   If no trigger → handle directly in this context

4. Collect
   Read each subagent's output file
   Commit outputs to repo

5. Synthesise
   Update the relevant PRD, ADR, or sprint doc with results
   Commit

6. Close
   Write session summary to docs/agents/<date>-orchestrator-summary.md
   Commit and push
```

---

## Tool-specific invocation

### Claude Code

Native subagents via the `Task` tool. The Task tool spawns a fresh Claude instance with its own context window.

```
Task(
  description="Research the auth flow in src/lib/supabase/",
  prompt="<full prompt per handoff protocol above>"
)
```

Multiple Task calls can run in parallel. Spawn all parallel agents before awaiting any result.

### Roo / Cline (boomerang mode)

Use the `new_task` tool to spawn a child agent in a scoped mode. The child returns control to the parent when complete.

```
<new_task>
<mode>code</mode>
<message>
[full prompt per handoff protocol]
</message>
</new_task>
```

Set the child's mode to match the agent role: `code` for implementation, `ask` for research, `architect` for review.

### Cursor

Cursor does not have native subagent isolation. Simulate the pattern:
1. Open a new Composer window (separate context)
2. Paste the subagent prompt from the handoff protocol
3. Run it to completion
4. Copy the output file path back to the main Composer

Note: Cursor background agents are in beta — check current docs before relying on them.

### Windsurf

Windsurf uses sequential cascade flows. Simulate parallel agents as sequential steps:
1. Complete the research phase fully before implementation
2. Complete implementation before review
3. Document each phase output before starting the next

### Any tool (fallback)

If the tool does not support subagent spawning:
1. Write the subagent prompt to `docs/agents/<date>-<role>-prompt.md`
2. Start a new chat session with that prompt as the opening message
3. Copy the output back to the repo manually
4. Continue the orchestrator session

---

## Anti-patterns — never do these

| Anti-pattern | Why it fails |
|---|---|
| Spawning a subagent with "help me with X" | Too vague — no bounded output, no clear scope |
| Reading subagent output from chat history | Not durable — lost on session end |
| Skipping the review agent to save time | Creates hidden debt — always review |
| Spawning a subagent for a 5-minute task | Overhead exceeds benefit — use the trigger rules |
| Not committing subagent output immediately | Next session cannot find it via GitMCP |

# Orchestrator rules

This document defines mandatory rules for the orchestrator agent — the main session agent that holds the overall plan and coordinates subagents. These rules are prescriptive. Follow them exactly; do not use judgment to override them.

---

## What the orchestrator is

The orchestrator is the main AI agent in a session. It owns the plan, delegates bounded tasks to subagents, and synthesises results. It does not do deep research or isolated implementation itself — it delegates those to subagents and reads their outputs.

---

## Mandatory spawn triggers

You MUST spawn a subagent in the following situations. These are not suggestions.

### Trigger 1 — Unknown codebase

Spawn a **research agent** before writing any code, config, or plan if:
- You have not read the project's source files in this session, AND
- The task requires understanding existing code structure, patterns, or dependencies

Do not guess at structure. Do not proceed from memory. Spawn first.

### Trigger 2 — Task touches more than 3 files you have not read

Spawn a **research agent** scoped to those files before making changes.

Threshold: if implementing the task will require editing or understanding more than 3 files whose contents you have not seen in the current context window, delegate exploration first.

### Trigger 3 — Task has two or more independent work units

Spawn **parallel implementation agents** if the task can be broken into units with no shared state:
- Writing tests and writing implementation are independent — spawn both
- Writing docs and writing code are independent — spawn both
- Two separate features in one PR — spawn one agent per feature

Do not do parallel work serially in one context. Delegate.

### Trigger 4 — Task is destructive or high-risk

Spawn an **isolated implementation agent** for any task that involves:
- Deleting files or directories
- Refactoring across more than 2 files
- Modifying database migrations
- Changing auth logic, payment logic, or any security-sensitive code

The isolated agent works in its own context. If it goes wrong, the main context is unaffected.

### Trigger 5 — Code is ready for review

Spawn a **review agent** before marking any implementation task complete. The review agent checks against coding standards, test coverage, and relevant SDLC docs.

Do not self-review. Delegate.

---

## Mandatory handoff protocol

Every subagent invocation MUST follow this protocol exactly.

### What to give every subagent

Include all of the following in the subagent's initial context:

```
1. Role: one of [research | implementation | review]
2. Task: one specific, bounded objective (not a vague goal)
3. Scope: explicit list of files or directories it may read/write
4. Constraints: explicit list of what it must NOT do
5. Output: the exact file path it must write its result to
6. Standards: which sdlc/ docs it must consult (always include sdlc/overview.md)
```

Never spawn a subagent with a vague task. If you cannot write a single-sentence task description, the task is not ready to delegate.

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

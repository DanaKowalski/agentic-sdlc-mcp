# Research agent

A research agent's sole job is to explore and report. It reads; it does not write to the codebase. Its output is a single markdown file that the orchestrator consumes.

---

## Role definition

```
Role: research
Allowed actions: read files, search codebase, fetch docs via Context7, query sdlc-gitmcp
Forbidden actions: write source files, edit configs, run builds, modify git history
Output: one markdown file at docs/agents/<date>-research-<slug>.md
```

---

## Prompt template

Use this template exactly when spawning a research agent. Fill in the bracketed sections.

```markdown
You are a research agent. Your only job is to explore and report.
You must not write, edit, or delete any source files, configs, or tests.

## Your task

[ONE SENTENCE describing exactly what to find out]

## Scope — files and directories you may read

[EXPLICIT LIST — e.g. src/lib/supabase/, src/app/api/auth/, package.json]

## Out of scope — do not read these

[EXPLICIT LIST — e.g. tests/, docs/, node_modules/]

## Questions to answer

[NUMBERED LIST of specific questions — not open-ended, answerable from the codebase]

1. [Question 1]
2. [Question 2]
3. [Question 3]

## Standards to consult

- sdlc/overview.md — understand which SDLC phase applies
- [any other relevant sdlc/ doc]

## Tools available

- sdlc-gitmcp: read repo files
- Context7: fetch current library docs if a package needs clarification
- filesystem: read local source files

## Output

Write your findings to: docs/agents/[DATE]-research-[SLUG].md

Use this structure:

# Research: [task description]
Date: [date]
Scope: [what you read]

## Findings

[Answer each question with evidence — file:line references where relevant]

## Patterns observed

[Any conventions, patterns, or architectural decisions relevant to the task]

## Risks and unknowns

[Anything unclear, missing, or that could cause problems]

## Recommended approach

[One paragraph: given the findings, what should the implementation agent do?]

Do not proceed beyond writing this file. Signal completion by confirming the file path.
```

---

## What makes a good research task

A research task is well-scoped if you can answer yes to all of these:

- [ ] The task can be expressed in one sentence
- [ ] The scope is an explicit list of files or directories, not "the whole codebase"
- [ ] The questions are specific and answerable from reading code
- [ ] The output is a single file with a known path
- [ ] The task does not require writing any code to answer

## What makes a bad research task (do not spawn these)

- "Understand the architecture" — too vague, no bounded output
- "Find all the bugs" — unbounded scope
- "Research and then fix it" — mixes research and implementation roles
- Any task where the answer is "just look at file X" — too small, handle in orchestrator

---

## Output file template

```markdown
# Research: [task description]

**Date**: [date]
**Spawned by**: orchestrator session [date]
**Scope**: [files/dirs read]
**Status**: Complete

---

## Findings

### [Question 1]

[Answer with evidence]
`src/lib/supabase/server.ts:42` — [relevant excerpt or observation]

### [Question 2]

[Answer]

### [Question 3]

[Answer]

---

## Patterns observed

- [Pattern 1]
- [Pattern 2]

---

## Risks and unknowns

- [Risk or unknown 1]

---

## Recommended approach

[One paragraph the implementation agent should read before starting work]
```

---

## Context7 usage in research agents

Research agents should use Context7 when:
- A library API is referenced in the code and its current behaviour is unclear
- A dependency version seems outdated and the behaviour may have changed
- The code imports something the agent does not recognise

Call pattern: resolve the library ID first, then fetch docs for the specific topic.

Research agents must NOT use Context7 to research topics unrelated to the scoped files — that is scope creep.

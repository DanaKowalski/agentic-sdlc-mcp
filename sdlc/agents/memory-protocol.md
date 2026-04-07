# Memory protocol

This document defines how agents read, write, and maintain memory across sessions and tools. Follow these rules exactly. Memory is what allows any agent — in any tool, using any model — to pick up where the last session left off without asking the user to re-explain context.

---

## What memory is

Memory is structured state written to files. It is not chat history, not in-context summaries, and not verbal output. If it is not written to a file and committed, it does not exist for the next session.

There are two kinds: 

| Kind | What it is | Where it lives | Updated when |
|------|-----------|----------------|--------------|
| **Project state** | Current phase, open work, last session summary | `docs/memory/project-state.md` | End of every session |
| **Agent output** | Research findings, implementation reports, review verdicts | `docs/agents/<date>-<role>-<slug>.md` | After each agent completes |

Agent output memory is already covered in `orchestrator.md`. This document covers project state memory.

---

## Session start — what to read

Every session opens with these two reads, in this order. No exceptions.

```
1. sdlc/memory/quick-ref.md        — how we work (commands, triggers, roles)
2. docs/memory/project-state.md    — where we are (phase, open work, last session)
```

If `docs/memory/project-state.md` does not exist, the project is new. Create it before doing any other work.

After reading both files, tell the user what you found:

> "We are in the [phase] phase. Open work: [list]. Last session: [one sentence]. Where would you like to pick up?"

Do not proceed without this orientation step. A session that skips it will duplicate work, miss context, or contradict previous decisions.

---

## Session end — what to write

Before ending any session, update `docs/memory/project-state.md` with:

- Current phase
- What was completed this session
- What is still open
- Any decisions made that are not yet in an ADR
- One sentence summary for the next session to read

Then commit:

```bash
git add docs/memory/
git commit -m "docs(memory): update project state — <one word describing session>"
git push
```

If you do not push, the next session in a different tool cannot see the update via GitMCP.

---

## Project state file format

`docs/memory/project-state.md` must follow this exact structure. Keep each section short — this file is read at session start and must load fast.

```markdown
# Project state

**Last updated**: YYYY-MM-DD
**Current phase**: [Planning | Design | Implementation | Testing | Deployment | Operations]
**Active branch**: [branch name or "none"]

---

## Open work

- [ ] [Task or deliverable — one line each]
- [ ] [Link to relevant PRD or ADR if one exists]

## Completed this session

- [What was finished — one line each]

## Decisions not yet in an ADR

- [Any architectural or significant decision made verbally or in chat that needs to be recorded]

## Last session summary

[One sentence. What happened. What to do next.]

## Blockers

[Anything preventing progress. Empty if none.]
```

**Length limit**: this file must stay under 300 words. If it grows beyond that, move completed items to `docs/memory/archive.md` and keep only current state here.

---

## What to persist vs what to skip

Not everything is worth writing down. Use this to decide:

**Always persist:**
- Phase transitions
- PRD approvals and status changes
- ADR decisions
- Sprint goals and outcomes
- Blockers and how they were resolved
- Agent outputs (already covered by output protocol)

**No need to persist:**
- Code snippets — those live in the code
- Library API details — use Context7 at session start
- Conversation back-and-forth — only outcomes matter
- Anything that can be re-derived by reading the codebase

**Persist if significant:**
- Tool or model changes mid-project
- Scope changes
- Decisions made outside the normal ADR process

---

## Memory across tools and models

This protocol is designed to work regardless of which tool or model is running. A junior model in Roo and a senior model in Claude Code should both read the same state and produce compatible outputs because they are reading from the same files.

**What this means in practice:**

- Never store state in tool-specific memory (Cursor memory, Roo context, etc.) — it is not portable
- Never rely on a model remembering a previous conversation — it cannot
- Always assume the next session is a cold start with no prior context
- Write memory as if the next reader has never seen this project before

**Model capability and memory:**
- A junior/smaller model should read `docs/memory/project-state.md` and execute the current task only
- A senior/larger model should read both memory files and can handle multi-step orchestration
- Neither model should need to ask the user for context that is already in memory

---

## Memory hygiene

Memory that is stale is worse than no memory — it causes agents to act on outdated state.

| Rule | Why |
|------|-----|
| Update project state at every session end | Stale state causes wrong phase assumptions |
| Commit and push before closing a session | Unpushed state is invisible to other tools |
| Archive completed items when file exceeds 300 words | Long memory files waste tokens on irrelevant history |
| If state is uncertain, re-read `docs/agents/` recent outputs | Agent outputs are the ground truth for what was done |
| Never edit memory to hide failures or blockers | Accurate state prevents repeated mistakes |

---

## Quick-ref file

`sdlc/memory/quick-ref.md` is a static file maintained in this repo. It is not project-specific. It contains:

- All available commands and what they produce
- Agent spawn triggers (summary of `orchestrator.md`)
- Agent roles in one line each
- Session open and close sequence

It does not change unless the SDLC itself changes. Models read it to orient to the system, not to the project.

---

## Failure modes to avoid

| Anti-pattern | What goes wrong |
|---|---|
| Skipping session start reads | Agent duplicates completed work or contradicts past decisions |
| Not committing memory at session end | Next session starts blind |
| Writing memory in chat only | Lost on session end, invisible to other tools |
| Storing state in tool-specific memory | Not portable — breaks when switching tools or models |
| Letting project-state.md grow unbounded | Wastes tokens, buries current state in history |
| Updating memory mid-session | Creates inconsistent state — write once at session end |

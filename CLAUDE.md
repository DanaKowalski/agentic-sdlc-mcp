# CLAUDE.md — Claude Code in this repository

This repo has two modes. Read this before doing anything.

---

## Mode A — Maintaining this framework (most sessions)

You are editing the SDLC framework itself: fixing bugs in mcp-server/, updating sdlc/ docs,
adding templates, running scripts.

Rules for Mode A:
- Follow coding-standards.md and git-workflow.md for any TypeScript changes
- Edit sdlc/ files directly — no agent protocol, no docs/agents/ outputs, no subagent spawning
- Do not read docs/memory/project-state.md or treat it as relevant context
- Commit with conventional commits. That's it.

You are in Mode A if the task is: editing mcp-server/, scripts/, config/, sdlc/, or root files.

---

## Mode B — Using this framework as an orchestrator (rare in this repo)

You are running the full SDLC agent protocol to build a feature in this repo itself.

You are in Mode B only if the user explicitly asks to run a slash command like /generate_prd
or says "use the agent protocol for this."

If in Mode B: read AGENTS.md and follow it fully.

---

When in doubt, ask: "Is this a framework maintenance task or a product feature task?"
Core agent rules, conventions, and SDLC process are defined in **`AGENTS.md`**.

---

## Claude Code Specifics

- Use the native `Task` tool for spawning subagents when possible (best isolation).
- You can run multiple `Task` calls in parallel.
- For complex orchestration, prefer using the `Task` tool over manual simulation.
- Claude Code has excellent support for reading `sdlc-gitmcp` and Context7.

See `AGENTS.md` for:
- Session opening/closing protocol
- Subagent system and triggers
- All commands and conventions
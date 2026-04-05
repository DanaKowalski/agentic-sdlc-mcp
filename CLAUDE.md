# CLAUDE.md — Claude Code Specific Notes

This file contains settings and notes specific to Claude Code.

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
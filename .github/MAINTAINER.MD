# Maintainer Guide

This file is for humans and AI agents working on this repository itself —
fixing bugs, adding templates, extending the MCP server, or updating sdlc/ docs.

It does not apply to projects using this framework via GitMCP. Those projects
follow AGENTS.md and the sdlc/ conventions normally.

---

## The core distinction

This repo serves two audiences:

**Downstream projects** connect via GitMCP and read AGENTS.md, llms.txt, and sdlc/
to run the agent protocol on their own codebase. They are always in "use" mode.

**Maintainers** work inside this repo directly to improve the framework itself.
That is what this file covers.

---

## When you are maintaining this repo

If your task involves any of these, you are doing maintenance work:

- `mcp-server/` — fixing or extending MCP tool handlers
- `scripts/` — check-configs, sync-configs, pre-commit
- `config/` — MCP config sources and tool configs
- `sdlc/` — adding or editing templates, checklists, agent docs
- `AGENTS.md`, `CLAUDE.md`, `llms.txt` — updating framework-level guidance
- `.github/` — CI workflows, issue templates

**Rules for maintenance work:**

- Edit files directly. No agent protocol. No docs/agents/ outputs. No subagent spawning.
- Do not read docs/memory/project-state.md — it is not relevant to framework maintenance.
- Do not treat sdlc/ files as instructions to yourself — you are editing them, not following them.
- Follow coding-standards.md and git-workflow.md for any TypeScript changes to mcp-server/ or scripts/.
- Commit with conventional commits. That is the full process.

**The boundary that keeps causing problems:**

When writing or editing files in sdlc/, do not read package.json, mcp-server/, src/,
or any application source to inform the content. Those files describe this specific repo.
The sdlc/ documents must describe conventions for any project adopting this framework.
Write at the level of abstraction in sdlc/design/README.md — framework guidance, not
workspace configuration.

---

## Repo structure and what each part is for

| Path | What it is |
|------|------------|
| `mcp-server/` | The MCP server that exposes slash commands to downstream projects |
| `scripts/` | Maintenance utilities — config drift detection, sync, pre-commit hook |
| `config/` | MCP config files for each supported tool (Claude Code, Cursor, Roo, Windsurf) |
| `sdlc/` | Framework knowledge base — templates, checklists, agent rules, phase guides |
| `docs/agents/` | Agent output log — only written to when running the agent protocol on this repo itself (rare) |
| `docs/memory/` | Project state for sessions working on this repo itself (rarely needed) |
| `llms.txt` | Downstream-facing orientation file read by agents connecting via GitMCP |
| `AGENTS.md` | Downstream-facing agent protocol — do not add maintainer instructions here |
| `CLAUDE.md` | Downstream-facing Claude Code context — do not add maintainer instructions here |

---

## Config management

Never edit individual tool config files directly. The single source of truth is
`config/config-sources.json`. After editing it, run:

```bash
npm run sync:configs
```

This propagates changes to all tool-specific config files. The pre-commit hook
validates parity — if it fails, run sync:configs and recommit.

---

## Adding a new MCP tool

1. Create `mcp-server/tools/<tool-name>.ts` following the pattern of existing tools
2. Register it in `mcp-server/index.ts`
3. Add it to `config/config-sources.json` if it requires config
4. Run `npm run sync:configs`
5. Add the command to `llms.txt` available commands section
6. Add it to the commands table in `AGENTS.md`
7. Build and verify: `npm run build`

## Adding a new sdlc/ phase or template

1. Create the directory and files under `sdlc/`
2. Add a README.md in the new directory following the structure of `sdlc/design/README.md`
3. Update `sdlc/overview.md` to reference the new phase
4. Update `llms.txt` key files section if the new content should be surfaced to downstream agents
5. Do not reference this repo's specific paths or scripts in the new templates —
   they must work for any project adopting the framework

---

## Running the project locally

```bash
npm install
npm run build
npm run mcp:start
```

Verify configs are consistent:

```bash
npm run check:configs
```

If check:configs fails on a fresh clone, run `npm run sync:configs` once to generate
the baseline, then re-run.

---

## What not to do

- Do not add maintenance instructions to CLAUDE.md, AGENTS.md, or llms.txt —
  those files are read by downstream projects and must stay clean
- Do not follow the subagent protocol when editing sdlc/ docs —
  that protocol is for product implementation, not framework maintenance
- Do not use docs/agents/ for routine maintenance commits —
  that directory is for agent outputs when running the protocol on a real feature
- Do not infer sdlc/ template content from this repo's source files —
  templates must be generic
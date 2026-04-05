---
name: Config drift
about: Track a detected MCP config drift issue
title: "chore: config drift — [TOOL NAME]"
labels: maintenance, config
assignees: ""
---

## What drifted

<!-- Paste the relevant section from config-drift-report.md -->

## Tool affected

- [ ] Claude Code (`config/claude-mcp-config.json`)
- [ ] Roo/Cline (`config/roo-mcp.json`)
- [ ] Cursor (`config/cursor-mcp.json`)
- [ ] Windsurf (`config/windsurf-mcp.json`)
- [ ] Context7 version
- [ ] MCP SDK version

## Fix

Follow `sdlc/maintenance/config-maintenance-checklist.md`

## Checklist

- [ ] Read relevant changelog / docs
- [ ] Updated `config/config-sources.json`
- [ ] Ran `npm run sync:configs`
- [ ] Ran `npm run check:configs` — clean
- [ ] Tested in affected tool
- [ ] Committed and pushed

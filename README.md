# sdlc-mcp

A foundational MCP (Model Context Protocol) repository for AI-assisted software development. Works across Claude Code, Roo/Cline, Cursor, Windsurf, and any future agentic tools.

## What this is

Three layers working together:

| Layer | What it is | Where it lives |
|-------|-----------|----------------|
| **Tools** | External MCP servers (Context7, etc.) always available to the AI | `config-sources.json` |
| **Commands** | Slash commands you invoke explicitly (`/generate_prd`, `/plan_sprint`) | `mcp-server/` |
| **Skills** | Markdown knowledge the AI reads as context | `sdlc/` |

## Quick start

### 1. Clone and install

```bash
git clone https://github.com/danakowalski/agentic-sdlc-mcp.git
cd sdlc-mcp
npm install
```

### 2. Register MCP servers with your tools

**Claude Code**
```bash
cp config/claude-mcp-config.json ~/.claude/claude_mcp_config.json
```

**Roo / Cline (VS Code)**
```bash
cp config/roo-mcp.json .roo/mcp.json
```

**Cursor**
```bash
cp config/cursor-mcp.json .cursor/mcp.json
```

### 3. Build the MCP server

```bash
npm run build
npm run mcp:start
```

### 4. Verify configs are fresh

```bash
npm run check:configs
```

## Available commands

| Command | What it does |
|---------|-------------|
| `/generate_prd` | Scaffold a new Product Requirements Document |
| `/plan_sprint` | Create a sprint plan from backlog items |
| `/create_adr` | New Architecture Decision Record |
| `/gen_test_plan` | Test plan scaffold for a feature |
| `/release_notes` | Draft release notes from git log |

## Available tools (always on)

| Tool | Purpose |
|------|---------|
| `context7` | Fetches current library/framework docs — called automatically when you reference a package |
| `filesystem` | Read/write project files |

## Repo structure

```
sdlc-mcp/
├── .github/
│   ├── workflows/
│   │   ├── config-check.yml       # weekly drift detection
│   │   └── ci.yml                 # lint + build on PR
│   └── ISSUE_TEMPLATE/
│       └── config-drift.md
├── .husky/
│   └── pre-commit                 # validates configs on commit
├── config/
│   ├── config-sources.json        # single source of truth for all MCP configs
│   ├── claude-mcp-config.json
│   ├── roo-mcp.json
│   ├── cursor-mcp.json
│   └── windsurf-mcp.json
├── mcp-server/
│   ├── index.ts
│   ├── tools/
│   │   ├── generate-prd.ts
│   │   ├── plan-sprint.ts
│   │   ├── create-adr.ts
│   │   ├── gen-test-plan.ts
│   │   └── release-notes.ts
│   └── package.json
├── scripts/
│   ├── check-configs.ts           # drift detection script
│   ├── sync-configs.ts            # propagates config-sources → all tool configs
│   └── last-checked.json          # stamped after clean runs
├── sdlc/
│   ├── overview.md                # SDLC phases, rules, how to use this repo
│   ├── glossary.md
│   ├── planning/
│   ├── design/
│   ├── implementation/
│   ├── testing/
│   ├── deployment/
│   ├── operations/
│   └── maintenance/
│       ├── config-maintenance-checklist.md
│       └── config-drift-report.md
├── CLAUDE.md                      # Claude Code context file
├── .clinerules                    # Roo/Cline context file
├── .cursorrules                   # Cursor context file
├── .windsurfrules                 # Windsurf context file
├── .gitignore
└── package.json
```


## Platform notes

This repo is designed to work on Linux, macOS, and Windows. Most things are identical across platforms. The differences are documented here.

### Scripts

All scripts in `scripts/` are pure Node.js — no shell syntax, no Unix-only commands. They use `process.platform` to detect Windows where needed (e.g. `npm.cmd` vs `npm`). Run them the same way on all platforms:

```bash
npm run check:configs
npm run sync:configs
```

### Pre-commit hook

The hook logic lives in `scripts/pre-commit.ts` (Node.js, cross-platform). The platform-specific entry points are thin shims:

| Platform | File | How it runs |
|----------|------|-------------|
| Linux / macOS | `.husky/pre-commit` | `#!/bin/sh` shim → calls `npx tsx scripts/pre-commit.ts` |
| Windows | `.husky/pre-commit.ps1` | PowerShell shim → calls `npx tsx scripts/pre-commit.ts` |

Husky v9 on Windows uses `.ps1` hooks automatically when Git for Windows is configured with PowerShell. If your pre-commit hook is not running on Windows, verify:

```powershell
git config core.hooksPath
# should output: .husky
```

If it is empty, run `npm run prepare` once to reinitialise Husky.

### MCP server config installation paths

Tool config files live in different places per OS:

**Claude Code**

| OS | Path |
|----|------|
| macOS / Linux | `~/.claude/claude_mcp_config.json` |
| Windows | `%APPDATA%\Claude\claude_mcp_config.json` |

```bash
# macOS / Linux
cp config/claude-mcp-config.json ~/.claude/claude_mcp_config.json

# Windows PowerShell
Copy-Item config\claude-mcp-config.json "$env:APPDATA\Claude\claude_mcp_config.json"
```

**Cursor** — per-project, same on all platforms:
```bash
cp config/cursor-mcp.json .cursor/mcp.json        # macOS / Linux
Copy-Item config\cursor-mcp.json .cursor\mcp.json  # Windows PowerShell
```

**Roo/Cline** — per-project, same on all platforms:
```bash
cp config/roo-mcp.json .roo/mcp.json        # macOS / Linux
Copy-Item config\roo-mcp.json .roo\mcp.json  # Windows PowerShell
```

**Windsurf**

| OS | Path |
|----|------|
| macOS / Linux | `~/.windsurf/mcp.json` |
| Windows | `%APPDATA%\Windsurf\mcp.json` |

```bash
# macOS / Linux
cp config/windsurf-mcp.json ~/.windsurf/mcp.json

# Windows PowerShell
Copy-Item config\windsurf-mcp.json "$env:APPDATA\Windsurf\mcp.json"
```

### Line endings

The repo ships with a `.gitattributes` that enforces LF for all text files. This prevents Windows Git from converting line endings in scripts and breaking the Unix shims on clone.

## Maintenance

Configs drift as tools evolve. This repo detects and guides fixes:

- **Automated**: GitHub Actions runs `check:configs` weekly
- **On commit**: Husky pre-commit hook validates config parity
- **Manual**: `npm run check:configs` anytime
- **Fix guide**: `sdlc/maintenance/config-maintenance-checklist.md`

## Contributing

This is a personal foundational repo. If you fork it, update `config-sources.json` with your own MCP server path before running sync.

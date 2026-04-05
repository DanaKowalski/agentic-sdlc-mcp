# Config maintenance checklist

Use this when `npm run check:configs` reports drift, or when you see a new release from a tool you use. Work through each section that applies.

---

## Trigger: config drift detected by script

Start here after seeing a drift report in `sdlc/maintenance/config-drift-report.md` or a GitHub Actions failure.

### Step 1 — Read the drift report

```bash
cat sdlc/maintenance/config-drift-report.md
```

Identify whether the issue is:
- **Parity drift**: one of the generated config files is out of sync with `config-sources.json`
- **Version drift**: an MCP package is outdated
- **Missing file**: a context rule file or config file was deleted

### Step 2 — Fix parity drift

If a generated config file drifted from `config-sources.json`:

```bash
# Regenerate all tool configs from the single source
npm run sync:configs

# Verify
npm run check:configs
```

Do not hand-edit the generated files. If the generated content is wrong, fix `config/config-sources.json` first.

### Step 3 — Fix version drift

If an MCP package is outdated:

1. Check the package changelog:
   - Context7: https://github.com/upstash/context7/releases
   - MCP SDK: https://github.com/modelcontextprotocol/typescript-sdk/releases
   - Anthropic SDK: https://github.com/anthropic-ai/sdk-python/releases (check JS SDK)

2. Review breaking changes. Look for:
   - Renamed config keys
   - Deprecated fields
   - New required fields
   - Changed `args` format

3. Update `config/config-sources.json` if args or structure changed:
   ```json
   "context7": {
     "args": ["-y", "@upstash/context7-mcp@latest"]
   }
   ```

4. Update `package.json` if SDK version needs pinning:
   ```bash
   npm install @modelcontextprotocol/sdk@latest
   ```

5. Sync and verify:
   ```bash
   npm run sync:configs
   npm run check:configs
   ```

### Step 4 — Fix a missing context file

If `CLAUDE.md`, `.clinerules`, `.cursorrules`, or `.windsurfrules` is missing, restore from git:

```bash
git checkout HEAD -- CLAUDE.md
git checkout HEAD -- .clinerules
git checkout HEAD -- .cursorrules
git checkout HEAD -- .windsurfrules
```

Or recreate from the other files — they share the same content in different formats.

---

## Trigger: tool released a new version

Use when Cursor, Roo, Claude Code, or Windsurf ships an update that may affect MCP config format.

### Step 1 — Read the release notes

| Tool | Release notes / changelog |
|------|--------------------------|
| Claude Code | https://docs.claude.ai/changelog |
| Roo/Cline | https://github.com/RooVetGit/Roo-Code/releases |
| Cursor | https://cursor.com/changelog |
| Windsurf | https://windsurf.com/changelog |

Look specifically for:
- Changes to MCP config format or location
- New supported config keys
- Deprecated config keys
- Changes to how context files are loaded (new filename, new format)

### Step 2 — Check if config schema changed

Compare your current config against the tool's current documentation. Things to check:

- Is `type: "stdio"` still the correct transport?
- Are there new top-level keys supported?
- Has the config file location changed (e.g. global vs per-project)?
- Are there new options for the `mcpServers` block?

### Step 3 — Update config-sources.json

If the schema changed, update `config/config-sources.json`:

```bash
# Edit the source file
code config/config-sources.json

# Sync to all generated files
npm run sync:configs

# Verify
npm run check:configs
```

Also update `lastKnownSchemaVersion` in the `toolTargets` entry:

```json
"cursor": {
  "outputPath": "config/cursor-mcp.json",
  "schemaRef": "https://docs.cursor.com/mcp",
  "lastKnownSchemaVersion": "2025-04"
}
```

### Step 4 — Update context rule files if format changed

If the tool changed how it reads context files (new filename, new format, new sections):

1. Update the relevant context file (`CLAUDE.md`, `.clinerules`, `.cursorrules`, `.windsurfrules`)
2. Keep content consistent across all four — same tools, same commands, same conventions, different format

### Step 5 — Test in the tool

Before committing:
1. Open the tool
2. Start a new session in this repo
3. Verify the AI picks up the correct context (ask it "what commands are available?")
4. Run a command (e.g. `/generate_prd`) and confirm it works
5. Confirm Context7 is available (ask about an npm package)

---

## After any fix

```bash
# Final verification
npm run check:configs

# Commit
git add config/ CLAUDE.md .clinerules .cursorrules .windsurfrules scripts/last-checked.json
git commit -m "chore: update configs — [what changed]"
git push
```

Close any related GitHub issue.

---

## Quarterly review

Run this every quarter regardless of drift alerts.

- [ ] Run `npm run check:configs` — resolve any issues first
- [ ] Check each tool's changelog since last review
- [ ] Review `sdlc/` templates — do they still reflect how you work?
- [ ] Review `sdlc/glossary.md` — any new terms to add?
- [ ] Check if any new agentic tools support MCP and should be added
- [ ] Update `config/config-sources.json` → `_meta.schema_version` if structure changed
- [ ] Commit a `chore: quarterly config review` commit with the date

## Platform differences during manual steps

Most fix steps are identical across Linux, macOS, and Windows because they go through `npm run` scripts (which are cross-platform). The only differences arise when copying config files manually.

| Action | macOS / Linux | Windows PowerShell |
|--------|--------------|-------------------|
| Copy Claude config | `cp config/claude-mcp-config.json ~/.claude/claude_mcp_config.json` | `Copy-Item config\claude-mcp-config.json "$env:APPDATA\Claude\claude_mcp_config.json"` |
| Copy Windsurf config | `cp config/windsurf-mcp.json ~/.windsurf/mcp.json` | `Copy-Item config\windsurf-mcp.json "$env:APPDATA\Windsurf\mcp.json"` |
| Copy Cursor/Roo config | `cp config/roo-mcp.json .roo/mcp.json` | `Copy-Item config\roo-mcp.json .roo\mcp.json` |

The scripts themselves (`npm run check:configs`, `npm run sync:configs`) handle platform detection internally — no changes needed to run them anywhere.

---

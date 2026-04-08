# MCP Connection Review

Use this guide when an MCP tool releases a new version, or when a connection that was working stops behaving as expected. The goal is to keep your MCP server connections current without breaking sessions in progress.

---

## When to Run This Review

- A tool you use (Claude Code, Cursor, Roo/Cline, Windsurf) releases a version update
- An MCP server you depend on publishes a new version
- A connection that worked previously returns unexpected errors or stops surfacing tools
- You add a new tool to your workflow and need to connect it to the SDLC framework

---

## Step 1 — Identify what changed

Before touching any config, understand what changed.

**For tool updates (Claude Code, Cursor, Roo, Windsurf):**
Check the tool's changelog for any of the following:
- Changes to MCP config format or file location
- New supported config keys or deprecated keys
- Changes to how context files are loaded (new filename, new format, new load order)
- Changes to transport support (stdio, SSE, HTTP)

**For MCP server updates (context7, sdlc-gitmcp, custom servers):**
Check the server's release notes for:
- Breaking changes to tool names or argument schemas
- New required configuration fields
- Deprecation of existing tools or parameters
- Changes to authentication or transport

---

## Step 2 — Check your current connection config

Your MCP connections are defined in your tool's config file. Common locations:

| Tool | Config location |
|------|----------------|
| Claude Code | `~/.claude/claude_mcp_config.json` (macOS/Linux) or `%APPDATA%\Claude\claude_mcp_config.json` (Windows) |
| Cursor | `.cursor/mcp.json` in the project directory |
| Roo/Cline | `.roo/mcp.json` in the project directory |
| Windsurf | `~/.windsurf/mcp.json` (macOS/Linux) or `%APPDATA%\Windsurf\mcp.json` (Windows) |

Read your current config and compare it against the tool's current documentation. Look for:
- Schema mismatches (field names, nesting, required fields)
- Outdated transport types
- Outdated server versions in `args`

---

## Step 3 — Update the config

Edit the config file directly. Make the minimum change needed to align with the new schema or version.

If a server version needs updating, change only the version reference in `args`. Example pattern:
```
"args": ["-y", "server-package@latest"]
```

If the config schema changed, align the structure to match the tool's current documentation before adding or changing any server entries.

---

## Step 4 — Verify the connection

After updating:

1. Restart the tool completely — MCP connections are loaded at startup
2. Open a new session in your project directory
3. Ask the agent to list available tools or confirm the connection is active
4. Run a simple test: ask the agent to fetch a known file via the connection
5. If using sdlc-gitmcp, ask it to fetch `sdlc/memory/quick-ref.md` and confirm it returns content

If the connection fails:
- Check the tool's MCP error log (location varies by tool — check its documentation)
- Confirm the server is reachable (for SSE/HTTP servers, test the URL directly in a browser)
- Confirm `args` format matches exactly what the tool expects — extra spaces, wrong quotes, or wrong casing can cause silent failures

---

## Step 5 — Update project documentation if needed

If you changed how a tool connects or which tools are available:

- Update `docs/memory/project-state.md` with a note under "Decisions not yet in an ADR" if the change affects how the project is developed
- If the change is significant enough — for example, switching from a local MCP server to a remote one — create an ADR documenting the decision

---

## Common failure patterns

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| Tool doesn't show MCP servers | Config file not in the right location | Check per-tool config path above |
| Tools show but fail to execute | Server not running or unreachable | For local servers: confirm the server process is running. For remote: test the URL |
| Tools worked yesterday, fail today | Server version changed breaking the schema | Check the server's changelog and update args |
| New tool version, context file not loading | Tool changed how it reads context files | Check the tool's docs for updated filename or format |
| Agent ignores framework files | sdlc-gitmcp connection dropped | Verify connection is active; restart tool |

# Glossary

Shared vocabulary for this repo and the projects that use it.

---

**ADR** (Architecture Decision Record)
A short document capturing a significant architectural decision: the context, the options considered, the decision made, and the consequences. Lives in `sdlc/design/`.

**Command**
A slash-prefixed action you invoke explicitly (e.g. `/generate_prd`). Exposed by the MCP server. Distinct from a tool, which the AI calls autonomously.

**Config drift**
When one or more of the generated tool config files (`claude-mcp-config.json`, `roo-mcp.json`, etc.) has diverged from the canonical source at `config/config-sources.json`, or when a tool's expected config schema has changed since the files were last updated.

**Context file**
A markdown file loaded automatically by an AI tool at session start. Provides passive background knowledge. Examples: `CLAUDE.md`, `.clinerules`, `.cursorrules`.

**Context7**
An MCP server that fetches current documentation for npm packages and frameworks. Called autonomously by the AI when library names are mentioned. Prevents hallucinated or outdated API usage.

**MCP** (Model Context Protocol)
An open standard for connecting AI models to external tools and data sources. Enables both passive context injection and active tool execution.

**MCP server**
A process that exposes tools over the MCP protocol. This repo runs two: Context7 (external) and the sdlc server (local, in `mcp-server/`).

**PRD** (Product Requirements Document)
A document defining what is being built, why, for whom, and how success is measured. Created at the start of the planning phase.

**Skill**
Prompt-level knowledge encoded as markdown. The AI reads it as context — it does not execute. Everything in `sdlc/` is a skill.

**Sync**
The act of propagating `config/config-sources.json` out to all four generated tool config files. Done via `npm run sync:configs`.

**Tool**
An external capability available to the AI at all times without explicit invocation. The AI decides when to call it. Context7 and filesystem access are tools.

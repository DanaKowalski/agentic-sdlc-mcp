# Glossary

Shared vocabulary for this repo and the projects that use it.

---

**ADR** (Architecture Decision Record)
A short document capturing a significant architectural decision: the context, the options considered, the decision made, and the consequences. Lives in `docs/adr/` within a project. Templates in `sdlc/design/`.

**Command**
A slash-prefixed action you invoke explicitly (e.g. `/generate_prd`). Exposed by the MCP server. Distinct from a tool, which the AI calls autonomously.

**Config drift**
When one or more of the generated tool config files (`claude-mcp-config.json`, `roo-mcp.json`, etc.) has diverged from the canonical source at `config/config-sources.json`, or when a tool's expected config schema has changed since the files were last updated.

**Context file**
A markdown file loaded automatically by an AI tool at session start. Provides passive background knowledge. Examples: `CLAUDE.md`, `.clinerules`, `.cursorrules`.

**Context7**
An MCP server that fetches current documentation for npm packages and frameworks. Called autonomously by the AI when library names are mentioned. Prevents hallucinated or outdated API usage.

**Deployment decision**
A required field in PRD Section 6 that explicitly states whether a project will be deployed (Yes / No / Not yet decided), and if yes, defines the deployment target, release model, environments, and approver. The deployment phase reads this field to determine whether and how to proceed. A PRD without a completed deployment decision is not approved.

**Deployment target**
The environment or platform where a project is shipped. Examples: Vercel, Docker + Fly.io, AWS, self-hosted VPS. Defined in PRD Section 6. The corresponding setup layer in `sdlc/setup/layers/deployment/` provides the technical scaffolding.

**MCP** (Model Context Protocol)
An open standard for connecting AI models to external tools and data sources. Enables both passive context injection and active tool execution.

**MCP server**
A process that exposes tools over the MCP protocol. This repo runs two: Context7 (external) and the sdlc server (local, in `mcp-server/`).

**PRD** (Product Requirements Document)
A document defining what is being built, why, for whom, and how success is measured. Created at the start of the planning phase. Must include a completed deployment decision before it can be approved.

**QA checklist**
A structured checklist completed after test scenarios are run and before deployment is approved. Verifies the feature is ready to ship across functional, non-functional, regression, and deployment readiness dimensions. Distinct from the test plan — the test plan defines what to test, the QA checklist confirms the feature is ready. Lives in `sdlc/testing/qa-checklist.md`.

**Release model**
How a project ships releases. Defined in PRD Section 6. Examples: continuous deployment on merge to main, manual release with approval gate, scheduled release. Determines which tier of the deployment checklist applies — lightweight or full.

**Rollback**
The act of reverting a deployment to the previous stable version after a bad release. Decision criteria, target-specific steps, and incident documentation are covered in `sdlc/deployment/rollback-procedure.md`.

**Skill**
Prompt-level knowledge encoded as markdown. The AI reads it as context — it does not execute. Everything in `sdlc/` is a skill.

**Sync**
The act of propagating `config/config-sources.json` out to all four generated tool config files. Done via `npm run sync:configs`.

**Test plan**
A document filled out before testing begins that defines what scenarios must be verified, maps each to a PRD acceptance criterion, records entry and exit conditions, and captures any defects found. Template at `sdlc/testing/test-plan-template.md`. Stored per release at `docs/testing/<date>-<slug>-test-plan.md`.

**Tool**
An external capability available to the AI at all times without explicit invocation. The AI decides when to call it. Context7 and filesystem access are tools.

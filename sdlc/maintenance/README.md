# Maintenance Phase

This folder contains guides for keeping a project healthy after implementation is complete. Maintenance is not a one-time phase — it runs on a recurring cadence alongside all other development work.

---

## What This Phase Covers

Maintenance has two modes:

**Reactive** — something broke, drifted, or changed and needs to be addressed now. A tool updated its MCP config format. An ADR decision turned out to be wrong. Project state is stale or inconsistent.

**Proactive** — scheduled reviews run on a cadence regardless of problems. Catching drift early costs less than fixing it later.

---

## When This Phase Applies

| Trigger | Frequency | Guide |
|---------|-----------|-------|
| An MCP tool releases a new version | As released | `mcp-connection-review.md` |
| An architectural decision is revisited or reversed | As needed | `adr-review.md` |
| Project state feels stale or inconsistent | As needed | `memory-hygiene.md` |
| Dependency or technical debt accumulates | Monthly | `dependency-review.md` |
| Team questions whether the process still fits | Quarterly | `process-review.md` |
| Scheduled health check | Quarterly | `maintenance-checklist.md` |

---

## Roles in This Phase

Maintenance work is done directly by the orchestrator or the human maintainer. It does not follow the full subagent protocol — no implementation agent, no review agent, no docs/agents/ outputs — unless the maintenance work involves code changes large enough to trigger the normal spawn triggers.

If a maintenance task requires changing more than 3 source files, or touches auth, security, or a public API surface, treat it as implementation work and follow the implementation phase process.

---

## Available Guides

- **mcp-connection-review.md** — keeping MCP tool connections current as tools evolve
- **adr-review.md** — reviewing, updating, and superseding ADRs when decisions change
- **memory-hygiene.md** — keeping `docs/memory/` accurate and useful over time
- **dependency-review.md** — managing dependencies and technical debt on a monthly cadence
- **process-review.md** — quarterly review of whether the SDLC process still fits the project
- **maintenance-checklist.md** — consolidated quarterly health check covering all areas

---

## Definition of Done

A maintenance task is complete when:

- The specific issue that triggered it is resolved and documented
- Any affected ADRs, design documents, or memory files are updated
- Changes are committed with a `chore:` or `docs:` conventional commit
- If process changes were made: `sdlc/overview.md` and relevant phase READMEs reflect them

---

## Related

- `sdlc/agents/memory-protocol.md` — memory rules that maintenance hygiene supports
- `sdlc/overview.md` — full SDLC phase definitions
- `docs/memory/project-state.md` — live project state maintained by this phase

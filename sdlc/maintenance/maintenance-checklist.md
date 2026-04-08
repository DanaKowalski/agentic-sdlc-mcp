# Maintenance Checklist

Use this checklist for the quarterly health check. Work through all sections. Each item links to a dedicated guide for detailed steps.

**Date of review:**
**Reviewed by:**

---

## MCP Connections

- [ ] All MCP connections load correctly in the tools you use
- [ ] No tools show MCP errors at session start
- [ ] sdlc-gitmcp can fetch files from the framework repo (test: fetch `sdlc/memory/quick-ref.md`)
- [ ] Any local MCP servers are running the expected version
- [ ] Tool config files are in the correct locations for each tool you use

If any item fails: follow `mcp-connection-review.md`

---

## ADR Health

- [ ] All ADRs in `docs/adr/` have an explicit status (`Accepted`, `Deprecated`, or `Superseded`)
- [ ] No `Proposed` ADRs have been sitting unresolved for more than one sprint
- [ ] ADRs that were superseded link to their replacement
- [ ] No architectural decisions were made in the last quarter that don't have a corresponding ADR
- [ ] ADR numbering is sequential with no gaps

If any item fails: follow `adr-review.md`

---

## Memory and Project State

- [ ] `docs/memory/project-state.md` exists and uses the correct field names
- [ ] `session_status` is `closed`
- [ ] Current phase field reflects where the project actually is
- [ ] Open work list contains only genuinely open items
- [ ] File is under 300 words — if not, archive completed items
- [ ] `docs/memory/project-state.md` was committed and pushed after the last session

If any item fails: follow `memory-hygiene.md`

---

## Dependencies

- [ ] `npm outdated` has been run and results reviewed
- [ ] No `high` or `critical` security advisories from `npm audit`
- [ ] All `approved-with-notes` review verdicts from `docs/agents/` have been addressed or scheduled
- [ ] No TODO comments in source code with dates that have passed
- [ ] `package.json` dependency versions reflect intentional choices, not just whatever was installed

If any item fails: follow `dependency-review.md`

---

## Process and Templates

- [ ] All SDLC phases are being used as intended — or a conscious decision has been made to skip one
- [ ] Templates in `sdlc/` reflect how the project actually works
- [ ] `sdlc/glossary.md` is current
- [ ] `sdlc/overview.md` accurately describes the current process
- [ ] The subagent system is being used (agents spawned via native tool mechanism, not simulated inline)
- [ ] Review agent is running after implementation tasks — not being skipped

If any item fails: follow `process-review.md`

---

## Agent Outputs

- [ ] All files in `docs/agents/` have valid frontmatter with a `status` field
- [ ] No `status: partial` or `status: blocked` outputs are unresolved
- [ ] Agent output files are being committed immediately after completion
- [ ] The naming convention `<date>-<role>-<slug>.md` is being followed consistently

---

## After Completing the Checklist

Commit a record of the review:

```bash
git add docs/
git commit -m "chore: quarterly maintenance review — [YYYY-MM]"
git push
```

If process changes were made, update `docs/memory/project-state.md` to reflect them.

**Date completed:**
**Changes made:**

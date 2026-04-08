# Release Notes Guide

Release notes communicate what changed in a release to the people who use or maintain the project. This guide covers when to write them, what goes in them, and where they go.

---

## When to write release notes

Release notes are required for every deployment that reaches users. They are not required for:
- Internal refactors with no user-facing changes
- Infrastructure or config changes with no functional impact
- Hotfixes that are immediately superseded by another release

If you are unsure, write them. They take less time to write than to explain after the fact.

---

## How to generate release notes

**Using the `/release_notes` command (local MCP server):**

The `/release_notes` command reads your git log between two refs, categorises commits by conventional commit type, and produces a structured draft at `docs/releases/<date>-<version>-release-notes.md`.

Required inputs:
- `version` — the version being released (e.g. `v1.2.0`)
- `fromRef` — the last release tag or commit (e.g. `v1.1.0`)
- `toRef` — the current release (e.g. `HEAD` or the release commit hash)

The command produces a draft. You must review it and fill in:
- **Upgrade notes** — any breaking changes, migration steps, or env var changes
- **Known issues** — anything shipping with this release that is not yet fixed

**Without the local MCP server:**

Run `git log <last-tag>..<HEAD> --pretty=format:"%s" --no-merges` and organise the output by commit type manually. Use the release notes template below.

---

## What goes in release notes

**Always include:**
- New features (feat: commits)
- Bug fixes (fix: commits)
- Breaking changes — these must be prominent, not buried
- Required migration steps (env var changes, config changes, database migrations)
- Known issues shipping with this release

**Include if relevant:**
- Performance improvements
- Dependency updates that affect runtime behaviour
- Security fixes (describe the impact, not the vulnerability details)

**Do not include:**
- Internal refactors with no user impact
- Test additions or changes
- Documentation-only changes
- Chore commits

---

## Audience

Write for the person who will read the release notes to decide whether to update. This is usually:

- A developer on the project reviewing what changed before deploying to their environment
- A user or stakeholder asking "what's new in this version"
- Your future self debugging a production issue and trying to understand what changed

Use plain language. "Fixed a crash when searching for cities with special characters" is better than "fix(transform): handle non-ASCII input in city name normalizer."

---

## Release notes template

If writing manually or editing the generated draft:

```markdown
# Release notes — {{VERSION}}

**Date:** {{DATE}}
**Range:** `{{FROM_REF}}` → `{{TO_REF}}`

---

## What's new

- [Feature or improvement — user-facing description]

## Bug fixes

- [Bug that was fixed — describe the user-visible symptom, not the code change]

## Upgrade notes

[Required actions before or after updating. If none: "No action required."]

- Breaking change: [what changed and what users need to do]
- New environment variable: `VAR_NAME` — [what it does, whether required]
- Migration: [steps if a data or config migration is needed]

## Known issues

[Issues shipping with this release. If none: "None."]

- [Issue description and any available workaround]
```

---

## Where release notes go

Store completed release notes at:
```
docs/releases/<date>-<version>-release-notes.md
```

Example: `docs/releases/2026-04-08-v1-2-0-release-notes.md`

If the project publishes release notes externally (GitHub Releases, a changelog file, a blog post), copy the content there after storing locally. The local copy in `docs/releases/` is the source of truth.

If the project uses a `CHANGELOG.md` at the repo root, append the release notes to the top of that file following the [Keep a Changelog](https://keepachangelog.com) format.

---

## Version numbering

Follow semantic versioning: `vMAJOR.MINOR.PATCH`

| Change type | Version bump |
|-------------|-------------|
| Breaking change | MAJOR (v1.x.x → v2.0.0) |
| New feature, backward compatible | MINOR (v1.1.x → v1.2.0) |
| Bug fix | PATCH (v1.1.0 → v1.1.1) |

For projects without a formal version history, start at `v1.0.0` on the first production release. Use `v0.x.x` for pre-release or in-development versions if the project is not yet stable.

Tag every release in git:
```bash
git tag -a v1.2.0 -m "release: v1.2.0"
git push origin v1.2.0
```

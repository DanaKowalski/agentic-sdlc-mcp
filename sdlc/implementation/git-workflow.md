# Git workflow

## Branch naming

`main` is the protected production branch. All work happens on feature branches.

| Branch prefix | Use for |
|---------------|---------|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, dependency updates, config changes |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring without behavior change |
| `test/` | Adding or fixing tests |

Branch names: `feature/short-description-slug` (kebab-case, lowercase, no spaces).

Examples:
```
feature/weather-search-api
fix/prd-validation-halt
chore/update-context7
docs/agents-readme-design-flow
```

---

## Commit message format

This repo uses [Conventional Commits](https://www.conventionalcommits.org/).

```
<type>(<optional scope>): <description>

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`

Examples:
```
feat(mcp): add /release_notes command
fix(check-configs): handle missing last-checked.json gracefully
chore: update context7 to latest
docs(agents): design-agent - weather-search
docs(sdlc): add operations phase runbook template
```

Breaking changes: append `!` after type and add `BREAKING CHANGE:` in footer.

---

## When to commit

- Commit after each **bounded, completed task** — not mid-task and not mid-file
- A subagent output file written and validated → commit it immediately before spawning the next agent
- After completing a logical unit of implementation (a function, a module, a passing test suite)
- After every design artifact is finalized
- Do not batch commits across multiple subagents or multiple unrelated changes

---

## What never goes in a commit

The following are grounds to reject a commit at review:

- **Secrets or credentials** — API keys, tokens, passwords, even in comments
- **`console.log` statements** — use the named logger; see coding-standards.md
- **Commented-out code** — delete it; git history preserves it if needed
- **`sdlc/` file edits from implementation agents** — implementation agents are forbidden from editing `sdlc/` files; if such edits appear in a diff, they must be reverted before committing
- **Unresolved merge conflict markers** (`<<<<<<<`, `=======`, `>>>>>>>`)
- **`.env` files** — only `.env.example` (with no real values) belongs in version control

---

## PR and merge guidance

### For solo or small-team agentic workflows

1. Branch from `main`
2. Commit with conventional commits after each bounded task
3. Open a PR — title follows commit convention; body references the originating PRD and design artifacts
4. CI must pass (type-check, build, config drift check)
5. Self-review: read the diff as if you are the review agent
6. If a review agent was spawned: include the review report path in the PR description
7. Squash merge to `main` (keeps history clean and linear)
8. Delete branch after merge

### Protecting main

- Require status checks to pass before merging (CI workflow)
- Require branches to be up to date before merging
- Do not allow force-pushes to `main`

---

## Tags and releases

Tag releases on `main` using semantic versioning: `v1.0.0`

```bash
git tag -a v1.0.0 -m "release: v1.0.0"
git push origin v1.0.0
```

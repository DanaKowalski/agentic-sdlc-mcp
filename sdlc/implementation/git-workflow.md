# Git workflow

## Branch strategy

`main` is the protected production branch. All work happens on feature branches.

| Branch prefix | Use for |
|---------------|---------|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Maintenance, dependency updates, config changes |
| `docs/` | Documentation only |
| `refactor/` | Code restructuring without behavior change |
| `test/` | Adding or fixing tests |

Branch names: `feat/short-description` (kebab-case, lowercase, no spaces).

## Commit conventions

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
docs(sdlc): add operations phase runbook template
```

Breaking changes: append `!` after type and add `BREAKING CHANGE:` in footer.

## Pull request flow

1. Branch from `main`
2. Commit with conventional commits
3. Open PR — title follows commit convention
4. CI must pass (type-check, build, config check)
5. Self-review: read the diff as if you're someone else
6. Squash merge to `main` (keeps history clean)
7. Delete branch after merge

## Protecting main

Set these on GitHub under Settings → Branches → Branch protection rules:

- Require status checks to pass (CI workflow)
- Require branches to be up to date before merging
- Do not allow bypassing the above settings

## Tags and releases

Tag releases on `main` using semantic versioning: `v1.0.0`

```bash
git tag -a v1.0.0 -m "release: v1.0.0"
git push origin v1.0.0
```

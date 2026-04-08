# Dependency Review

Use this guide for the monthly review of project dependencies and accumulated technical debt. The goal is to catch outdated packages, security issues, and growing debt before they become blocking problems.

---

## When to Run This Review

- Monthly, on a fixed date — set a recurring reminder
- After a significant security advisory affects packages your project uses
- When a build or test starts failing in a way that suggests a dependency changed

---

## Step 1 — Check for outdated packages

Run your package manager's outdated check:

```bash
npm outdated
```

This shows packages with newer versions available. For each outdated package:

1. Read the changelog between your current version and the latest
2. Identify whether there are breaking changes
3. Classify the update:

| Classification | Criteria | Action |
|---------------|----------|--------|
| Patch | Bug fixes only, no API changes | Update immediately |
| Minor (non-breaking) | New features, backward compatible | Update this session |
| Minor (behavior change) | New features that change defaults | Review and test before updating |
| Major | Breaking API changes | Plan as an implementation task |

---

## Step 2 — Check for security advisories

```bash
npm audit
```

Address any `high` or `critical` severity advisories immediately regardless of other priorities. `moderate` advisories should be resolved within the current sprint. `low` severity can be batched into the next monthly review.

If `npm audit fix` is available and safe for the affected package, run it. If it requires a major version bump, treat it as an implementation task and follow the implementation phase process.

---

## Step 3 — Review technical debt

Technical debt that accumulated during implementation should be reviewed monthly. Check:

- `approved-with-notes` review verdicts that haven't been addressed — find these in `docs/agents/` review output files
- TODO comments in source code with dates that have passed
- Known shortcuts or workarounds documented in implementation agent reports
- ADRs with status `Proposed` that were never formally accepted or rejected

For each item:
- If it can be resolved in under an hour: do it now and commit
- If it requires more than an hour: create a task in `docs/memory/project-state.md` open work
- If it requires design work: follow the design phase process before implementing

---

## Step 4 — Update dependencies safely

For packages you decide to update:

1. Update one package at a time for major or behavior-changing updates
2. Run your test suite after each update: `npm run test:unit`
3. If tests fail after an update, read the changelog more carefully before proceeding
4. If the update requires code changes, treat it as an implementation task

For patch and minor non-breaking updates, batching is fine:

```bash
npm update
npm run test:unit
```

---

## Step 5 — Document and commit

After completing the review:

Update `docs/memory/project-state.md` with any newly created open tasks.

Commit dependency changes separately from code changes:

```bash
git add package.json package-lock.json
git commit -m "chore: update dependencies — [month] review"
```

If security fixes were applied:
```bash
git commit -m "chore: fix security advisories — [package names]"
```

---

## What to skip

- Do not update dependencies immediately before a deployment — do it after a release, not before
- Do not update a major version dependency without a corresponding implementation task and test coverage
- Do not run `npm audit fix --force` without reading what it will change — it can introduce breaking changes silently

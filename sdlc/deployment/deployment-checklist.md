# Deployment Checklist

Use this checklist for every release. Choose the tier that matches the release model defined in the PRD Section 6.

**Feature slug:** {{FEATURE_SLUG}}
**Version:** {{VERSION}}
**Deployment target:** {{TARGET}}
**Date:** {{DATE}}
**Deployed by:** {{NAME}}

---

## Which tier applies?

Read the PRD Section 6 "Release model" field:

- **Continuous deployment / informal / no formal process** → use the Lightweight tier below
- **Manual approval / staging / scheduled release / CI required** → use the Full tier below
- **Not sure** → use the Full tier

---

## Lightweight Tier

For informal deployments: solo projects, startups, continuous deployment on merge, no staging environment.

### Pre-deployment

- [ ] Testing phase complete — QA checklist signed off
- [ ] No critical or high severity defects open
- [ ] Release notes drafted (see `release-notes-guide.md`)
- [ ] Any new environment variables are set in the deployment target

### Deploy

- [ ] Deploy to production using the project's deployment method
  - Vercel: merge PR to `main` (auto-deploys) or run `npm run deploy:prod`
  - Docker: build image, push to registry, update running container
  - Other: [follow the method defined in PRD Section 6]

### Post-deployment

- [ ] Production URL loads without errors
- [ ] Core user flow works end-to-end in production (not just locally)
- [ ] No error spikes in logs immediately after deployment
- [ ] `docs/memory/project-state.md` updated — phase: deployment complete, version shipped

**Date completed:**
**Deployed by:**

---

## Full Tier

For structured deployments: CI required, staging environment, manual approval gates, or scheduled releases.

### Pre-deployment verification

- [ ] Testing phase complete — QA checklist signed off with Pass or Conditional pass verdict
- [ ] No critical or high severity defects open
- [ ] All deferred defects documented in the test plan with severity and justification
- [ ] Release notes drafted and reviewed (see `release-notes-guide.md`)
- [ ] Git tag created for this release following semantic versioning (`vX.Y.Z`)
- [ ] CI passes on the release commit — all checks green
- [ ] All new or changed environment variables are documented in `.env.example`
- [ ] All new environment variables are set in each target environment (staging, production)
- [ ] Database migrations (if any) are prepared and tested against a copy of production data
- [ ] Rollback procedure reviewed — confirm you know how to execute it (`rollback-procedure.md`)

### Staging deployment (if staging environment exists)

- [ ] Deployed to staging environment
- [ ] Smoke test passes on staging — core user flows work
- [ ] Any environment-specific behaviour verified on staging
- [ ] Staging sign-off obtained from: [name / role defined in PRD Section 6]

### Release approval

- [ ] Release approved by: [approver defined in PRD Section 6]
- [ ] Approval recorded: [date / method — comment in PR, written confirmation, etc.]

### Production deployment

- [ ] Deployment window confirmed (avoid peak traffic times if applicable)
- [ ] Deploy to production using the project's deployment method
  - Vercel: merge to `main` (auto-deploys) or run `npm run deploy:prod`
  - Docker: build image, tag with version, push to registry, update production service
  - Other: [follow the method defined in PRD Section 6]
- [ ] Deployment completed without errors

### Post-deployment verification

- [ ] Production URL loads without errors
- [ ] Core user flows work end-to-end in production
- [ ] No error spikes in application logs in the first 10 minutes post-deploy
- [ ] No unexpected latency increase
- [ ] Any monitoring or alerting systems show healthy state
- [ ] If database migration ran: data integrity spot-check passes

### Release documentation

- [ ] Release notes published or stored at `docs/releases/<date>-<version>-release-notes.md`
- [ ] Git tag pushed to remote: `git push origin vX.Y.Z`
- [ ] `docs/memory/project-state.md` updated — phase: deployment complete, version shipped
- [ ] Any known issues documented in the release notes

**Date completed:**
**Deployed by:**
**Approver:**
**Production URL:**

---

## If anything goes wrong

Stop immediately. Do not attempt to fix forward unless the issue is trivial and you are certain of the cause and fix.

Assess:
- Is production broken for users right now? → Execute rollback immediately (`rollback-procedure.md`)
- Is production degraded but functional? → Decide within 15 minutes whether to roll back or hotfix
- Is the issue minor and isolated? → Document it, monitor, and fix in the next release

Document what happened regardless of which path you take. See `rollback-procedure.md` for full guidance.

# Rollback Procedure

Use this guide when a deployment needs to be reversed. Speed and clarity matter more than process when production is broken — read the decision criteria first, then act.

---

## Decision criteria

**Roll back immediately (do not deliberate) when:**
- The application is completely unavailable to users
- Data is being corrupted or lost
- A security vulnerability was introduced
- A critical feature is broken with no workaround

**Roll back within 15 minutes (assess quickly) when:**
- A core user flow is broken but the app is partially functional
- Error rates have spiked significantly above baseline
- Performance has degraded to the point of being unusable

**Do not roll back — monitor and hotfix when:**
- The issue affects a small percentage of users
- A workaround exists
- The issue is cosmetic or low severity
- Rolling back would cause a worse problem (e.g. reversing a database migration)

When in doubt, roll back. It is easier to re-deploy a fix than to explain a prolonged outage.

---

## Before rolling back

1. Note the current version (the broken one) and the previous stable version
2. Check whether a database migration was included in this release — if yes, read the database migration note at the bottom of this guide before proceeding
3. Notify any affected users or stakeholders if appropriate
4. Document the issue in `docs/releases/<date>-<version>-incident.md` — even a brief note helps

---

## Rollback steps by deployment target

### Vercel

**Automatic rollback via Vercel dashboard (fastest):**
1. Open the Vercel project dashboard
2. Go to Deployments
3. Find the last successful production deployment
4. Click the three-dot menu → Promote to Production
5. Verify the production URL is serving the previous version

**Manual rollback via git:**
1. Identify the last stable commit: `git log --oneline`
2. Create a revert commit: `git revert <bad-commit-hash>`
3. Push to main: `git push origin main`
4. Vercel will auto-deploy the revert commit
5. Verify the production URL

---

### Docker

**Rollback to previous image tag:**
1. Identify the previous stable image tag — check your container registry or the last deployment record
2. Update the running container to use the previous tag:
   ```
   docker pull <registry>/<image>:<previous-tag>
   docker stop <container-name>
   docker run -d --name <container-name> --env-file .env <registry>/<image>:<previous-tag>
   ```
3. If using Docker Compose, update the image tag in `docker-compose.yml` and run:
   ```
   docker compose up -d
   ```
4. Verify the application is serving correctly

**If using a managed container platform (Fly.io, Railway, Render, AWS ECS):**
Follow the platform's rollback or redeploy-previous-version mechanism. Most platforms maintain a deployment history and allow one-click rollback from their dashboard.

---

### Other targets

Follow the deployment target's native rollback mechanism. If no native rollback exists, redeploy the previous release using the same deployment method used for the original release. The previous release should always be tagged and recoverable from git.

---

## Database migration note

If the release included a database migration, rolling back the application code does not automatically reverse the migration. Before rolling back:

- Determine whether the migration is reversible (most are not safely reversible once data has been written)
- If reversible: run the down migration before rolling back the application code
- If not reversible: rolling back the application code may cause the app to fail against the migrated schema — in this case, a hotfix forward is usually safer than a rollback

This is a judgment call that depends on the specific migration. If in doubt, consult the technical design document for the migration and seek explicit approval before proceeding.

---

## After rolling back

1. Verify production is stable and the previous version is serving correctly
2. Update `docs/releases/<date>-<version>-incident.md` with:
   - What was rolled back and when
   - The cause of the rollback (as best understood at the time)
   - What the next steps are (hotfix, investigation, etc.)
3. Update `docs/memory/project-state.md` — note that the release was rolled back
4. Do not attempt to re-deploy the same broken release — fix it first, then redeploy following the full deployment checklist

---

## Incident note template

Copy this to `docs/releases/<date>-<version>-incident.md`:

```markdown
# Incident — {{VERSION}} — {{DATE}}

**Status:** Rolled back / Hotfixed / Monitoring
**Detected:** [time]
**Resolved:** [time]
**Affected:** [what was broken]

## What happened

[Brief description of the issue]

## Impact

[Who was affected and for how long]

## Root cause

[What caused the issue — fill in after investigation]

## Resolution

[What was done to resolve it]

## Next steps

[What will be done to prevent recurrence]
```

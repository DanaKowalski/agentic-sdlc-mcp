# Deployment layer: vercel

Vercel — zero-config deployment for Next.js. Automatic preview deployments on PR, production on main. Best pairing for the `next-ts` framework layer.

## Identity

```json
{
  "layer": "deployment",
  "id": "vercel",
  "label": "Vercel"
}
```

## Dependencies

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.x",
    "@vercel/speed-insights": "^1.x"
  },
  "devDependencies": {
    "vercel": "^latest"
  }
}
```

## Scripts

```json
{
  "deploy:preview": "vercel",
  "deploy:prod": "vercel --prod"
}
```

## Config files to generate

- `vercel.json` — project config (regions, headers, rewrites)
- `.vercelignore` — files to exclude from deployment

### `vercel.json`

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
```

### `.vercelignore`

```
.env*.local
.husky
tests/
playwright-report/
coverage/
```

## Environment variables

```
# Set these in Vercel dashboard → Project → Settings → Environment Variables
# Mirror your .env.local values for Preview and Production environments

VERCEL_ENV=               # auto-set by Vercel (development | preview | production)
NEXT_PUBLIC_APP_URL=      # your production domain, e.g. https://myapp.vercel.app
```

## Post-setup steps

- `npx vercel link` — link local project to Vercel project
- `npx vercel env pull .env.local` — pull env vars from Vercel to local
- Set all env vars in Vercel dashboard for Preview and Production environments
- Enable branch protection in GitHub so Vercel preview deployments run before merge

## Deployment architecture

```
git push (feature branch)
  → Vercel preview deployment → unique preview URL → share for review

PR merged to main
  → Vercel production deployment → production domain
```

## Supabase connection pooling on Vercel

If using the Supabase database layer, Vercel's serverless functions need connection pooling. Use the Supabase connection pooler URL (port 6543) for the `DATABASE_URL`, not the direct connection (port 5432).

```
DATABASE_URL=postgresql://postgres:[password]@[host]:6543/postgres?pgbouncer=true
```

## Notes

- Vercel automatically detects Next.js — no build command config needed
- Use `VERCEL_ENV` to gate preview-only features
- Analytics and Speed Insights are optional but recommended — add to `src/app/layout.tsx`
- Do not commit `.vercel/` directory — add to `.gitignore`
- Edge runtime is available but opt-in per route — do not use by default

## Extending this layer

To add a new deployment layer (e.g. Railway, Fly.io, Render, AWS):
1. Copy this file to `layers/deployment/<id>.md`
2. Update the `## Identity` block with the new id and label
3. Fill in all sections — pay special attention to `## Config files to generate` (most deployment targets need a specific config file or Dockerfile) and `## Environment variables`
4. Note any framework-layer compatibility requirements (e.g. Docker works with any framework; Vercel is optimised for Next.js)
5. Add the new id to any relevant presets in `sdlc/setup/presets/`
6. Reference it in `sdlc/setup/README.md`

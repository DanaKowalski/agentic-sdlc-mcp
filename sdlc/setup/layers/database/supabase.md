# Database layer: supabase

Supabase — hosted Postgres with auth, storage, realtime, and edge functions. Managed via the Supabase CLI for local dev and migrations.

## Identity

```json
{
  "layer": "database",
  "id": "supabase",
  "label": "Supabase (Postgres + auth + storage)"
}
```

## Dependencies

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.9.x"
  },
  "devDependencies": {
    "supabase": "^2.x"
  }
}
```

## Scripts

```json
{
  "db:start": "supabase start",
  "db:stop": "supabase stop",
  "db:reset": "supabase db reset",
  "db:migrate": "supabase db push",
  "db:types": "supabase gen types typescript --local > src/types/database.types.ts",
  "db:studio": "supabase studio"
}
```

## Config files to generate

- `supabase/config.toml` — project config (via `supabase init`)
- `src/lib/supabase/client.ts` — browser client singleton
- `src/lib/supabase/server.ts` — server client (SSR-safe, uses `@supabase/ssr`)
- `src/lib/supabase/middleware.ts` — session refresh middleware
- `src/middleware.ts` — Next.js middleware entry point
- `src/types/database.types.ts` — generated types (empty until first migration)

## Environment variables

```
# Public (safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Private (server only)
SUPABASE_SERVICE_ROLE_KEY=
```

## Post-setup steps

- `npx supabase init` — initialise local Supabase project
- `npx supabase start` — start local Postgres + Auth + Studio
- `npx supabase db reset` — apply migrations to local DB
- `npm run db:types` — regenerate TypeScript types after schema changes

## Local dev architecture

```
Local dev:
  supabase start → Postgres on :54322, Studio on :54323, Auth on :54321

Production:
  Supabase cloud project → connect via NEXT_PUBLIC_SUPABASE_URL
```

## Notes

- Never import `@supabase/supabase-js` directly in server components — always use the SSR client from `src/lib/supabase/server.ts`
- The browser client uses `createBrowserClient` from `@supabase/ssr`
- The server client uses `createServerClient` with cookie handling
- Run `npm run db:types` every time you modify the schema — keeps TypeScript in sync
- Row Level Security (RLS) should be enabled on all tables from day one
- Store migrations in `supabase/migrations/` — commit them to git

## Extending this layer

To add a new database layer (e.g. Planetscale, Prisma+Postgres, MongoDB):
1. Copy this file to `layers/database/<id>.md`
2. Update the `## Identity` block with the new id and label
3. Fill in `## Dependencies`, `## Scripts`, `## Config files to generate`, `## Environment variables`, `## Post-setup steps`
4. Add the new id to any relevant presets in `sdlc/setup/presets/`
5. Reference it in `sdlc/setup/README.md`

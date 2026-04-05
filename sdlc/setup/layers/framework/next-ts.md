# Framework layer: next-ts

Next.js with TypeScript, Tailwind CSS v4, and Shadcn/ui. The standard full-stack web app foundation.

## Identity

```json
{
  "layer": "framework",
  "id": "next-ts",
  "label": "Next.js + TypeScript"
}
```

## Core dependencies

```json
{
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "@types/react": "^19.x",
    "@types/react-dom": "^19.x",
    "tailwindcss": "^4.x",
    "@tailwindcss/postcss": "^4.x",
    "eslint": "^9.x",
    "eslint-config-next": "latest"
  }
}
```

## Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

## Config files to generate

- `tsconfig.json` — strict mode, path aliases (`@/*`)
- `next.config.ts` — baseline, no experimental flags unless needed
- `postcss.config.mjs` — Tailwind v4 via `@tailwindcss/postcss`
- `.eslintrc.json` — extends `next/core-web-vitals`
- `src/app/layout.tsx` — root layout with Tailwind globals
- `src/app/page.tsx` — empty home page

## Optional add-ons (ask before adding)

- Shadcn/ui — `shadcn init` after scaffold
- Supabase — `@supabase/supabase-js`, `@supabase/ssr`
- OpenRouter / AI SDK — `ai`, `@openrouter/ai-sdk-provider`
- Upstash rate limiting — `@upstash/ratelimit`, `@upstash/redis`

## Notes

- Use `src/` directory layout
- App Router only (no Pages Router)
- ESM throughout (`"type": "module"` is handled by Next automatically)
- Do not add `@types/react-dom` version above what matches the react version

# Framework layer: node-ts

Standalone Node.js API or service. TypeScript, ESM, no frontend framework.

## Identity

```json
{
  "layer": "framework",
  "id": "node-ts",
  "label": "Node.js + TypeScript (API / service)"
}
```

## Core dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.x",
    "@types/node": "^20.x",
    "tsx": "^4.x"
  }
}
```

## Scripts

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js"
}
```

## Config files to generate

- `tsconfig.json` — target ES2022, NodeNext modules, strict mode
- `src/index.ts` — entry point stub

## Optional add-ons (ask before adding)

- Express — `express`, `@types/express`
- Fastify — `fastify`
- Zod — `zod` (validation)
- Pino — `pino`, `pino-pretty` (logging)

## Notes

- `"type": "module"` in package.json
- Use `node:` prefix for built-in imports
- No shell scripts — everything through npm scripts

# Deployment layer: docker

Docker — containerised deployment. Framework-agnostic. Works with any host that accepts a container: Fly.io, Railway, Render, AWS ECS, GCP Cloud Run, self-hosted VPS.

## Identity

```json
{
  "layer": "deployment",
  "id": "docker",
  "label": "Docker (container — host agnostic)"
}
```

## Dependencies

```json
{
  "devDependencies": {}
}
```

No npm dependencies. Docker is a build-time and runtime concern, not a package dependency.

## Scripts

```json
{
  "docker:build": "docker build -t app .",
  "docker:run": "docker run -p 3000:3000 --env-file .env.local app",
  "docker:compose": "docker compose up",
  "docker:compose:down": "docker compose down"
}
```

## Config files to generate

- `Dockerfile` — multi-stage production image
- `.dockerignore` — files to exclude from build context
- `docker-compose.yml` — local dev with app + any services (e.g. Postgres)

### `Dockerfile` (Next.js standalone output)

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

### `.dockerignore`

```
.git
.husky
node_modules
.next
.env*.local
coverage
playwright-report
test-results
tests/e2e
```

### `docker-compose.yml`

```yaml
services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Environment variables

```
# Required at runtime — pass via host's env var config or docker run --env-file
NODE_ENV=production
PORT=3000
```

## Post-setup steps

- Add `output: 'standalone'` to `next.config.ts` — required for the standalone Dockerfile
- Add `.dockerignore` and `.docker/` to `.gitignore` if using local override files
- `docker build -t app .` — test the build locally before pushing to a host
- Choose a container host and follow their deploy guide:
  - Fly.io: `fly launch` (auto-detects Dockerfile)
  - Railway: connect GitHub repo, Railway detects Dockerfile
  - Render: connect GitHub repo, set build command to `docker build`
  - AWS ECS / GCP Cloud Run: push image to ECR/Artifact Registry, deploy service

## Notes

- The Dockerfile above uses Next.js standalone output — smallest possible image size
- The `docker-compose.yml` includes a local Postgres service as a placeholder — replace or remove if using Supabase or another managed DB
- Multi-stage build: `deps` → `builder` → `runner` — keeps the final image free of dev dependencies and build tools
- The `nextjs` user runs the app as non-root — required by some hosts, good practice everywhere
- For Node.js API services (not Next.js), simplify the Dockerfile to a single stage with `CMD ["node", "dist/index.js"]`

## Extending this layer

See `layers/deployment/vercel.md` for the pattern to follow when adding a new deployment layer.

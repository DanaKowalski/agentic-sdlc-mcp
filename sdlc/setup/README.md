# Project setup system

The `/project_setup` command uses a composable layer system. Instead of one monolithic template per stack, three independent layers combine to cover any project type.

## Layers

Each layer is a markdown file in `sdlc/setup/layers/<category>/`. The file describes what to install, what scripts to add, and what config files to generate. The MCP command reads these files and merges them.

### Framework layer — `layers/framework/`

Defines the core runtime, dependencies, and base config files.

| ID | Stack |
|----|-------|
| `next-ts` | Next.js + TypeScript + Tailwind v4 |
| `node-ts` | Node.js + TypeScript (API / service) |
| `react-lib` | React + Vite (library or SPA) |

### Testing layer — `layers/testing/`

Defines test tooling, scripts, and config files. Completely independent of the framework.

| ID | Stack |
|----|-------|
| `vitest-playwright` | Vitest (unit + integration, separate configs) + Playwright (e2e) |
| `vitest-only` | Vitest unit tests only |
| `none` | No test tooling |

### CI layer — `layers/ci/`

Defines GitHub Actions workflow files.

| ID | Stack |
|----|-------|
| `gh-actions-pr` | CI on PR (lint + type-check + unit + integration) + separate e2e workflow |
| `none` | No CI |

### Database layer — `layers/database/`

Defines database client dependencies, local dev scripts, helper file scaffolds, and required env vars. Completely independent of the framework and deployment layers.

| ID | Stack |
|----|-------|
| `supabase` | Supabase — hosted Postgres with auth, storage, realtime |
| `none` | No database |

### Deployment layer — `layers/deployment/`

Defines the deployment target: config files, build output settings, host-specific env vars, and post-setup steps. Pairs with the framework layer but is independently selectable.

| ID | Stack |
|----|-------|
| `vercel` | Vercel — zero-config Next.js deployment, preview URLs on PR |
| `docker` | Docker — multi-stage image, host-agnostic (Fly.io, Railway, ECS, VPS) |
| `none` | No deployment target configured |

---

## Presets

Presets in `sdlc/setup/presets/` are JSON files that encode a fixed layer combination plus optional add-ons and env vars. Use them to avoid re-selecting layers for common project types.

| Preset | Framework | Testing | Database | Deployment | CI |
|--------|-----------|---------|----------|------------|-----|
| `next-full` | next-ts | vitest-playwright | none | vercel | gh-actions-pr |
| `api-only` | node-ts | vitest-only | none | docker | gh-actions-pr |
| `chatbot-platform` | next-ts | vitest-playwright | supabase | vercel | gh-actions-pr |

---

## Adding a new layer or preset

**New framework layer**: Create `layers/framework/<id>.md`. Follow the structure of an existing file — include `## Identity`, `## Core dependencies` (JSON block), `## Scripts` (JSON block), `## Config files to generate`, and `## Notes`.

**New testing layer**: Create `layers/testing/<id>.md`. Same structure. Include the actual config file content in fenced code blocks so the command can extract and write them.

**New CI layer**: Create `layers/ci/<id>.md`. Include workflow YAML in fenced blocks with `### \`path/to/file.yml\`` headers so the command knows the output filename.

**New preset**: Create `presets/<id>.json`. Copy an existing preset and adjust `layers`, `addons`, `extra_dependencies`, `env_vars_required`, and `post_setup_steps`.

---

## How /project_setup works

```
/project_setup preset=chatbot-platform projectName="my-app"
  └── loads presets/chatbot-platform.json
        └── reads layers/framework/next-ts.md
        └── reads layers/testing/vitest-playwright.md
        └── reads layers/database/supabase.md
        └── reads layers/deployment/vercel.md
        └── reads layers/ci/gh-actions-pr.md
              └── merges dependencies, scripts, config file lists
                    └── writes docs/planning/<date>-my-app-project-setup.md
                          └── waits for "Apply the project setup"
                                └── writes package.json, .env.example, workflow files
```

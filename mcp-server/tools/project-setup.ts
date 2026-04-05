/**
 * project-setup.ts
 *
 * /project-setup command — composable project scaffolding.
 *
 * Flow (option C):
 *   1. Read preset or collect layer selections interactively
 *   2. Load each layer markdown file from sdlc/setup/layers/
 *   3. Generate docs/project-setup.md — the setup plan document
 *   4. Ask the user to confirm before applying any files
 *   5. On confirmation: write package.json, config files, workflow files
 *
 * Platform: cross-platform (no shell syntax, path.join throughout)
 */

import fs from "node:fs";
import path from "node:path";

const SDLC_ROOT = path.resolve("sdlc/setup");
const LAYERS_ROOT = path.join(SDLC_ROOT, "layers");
const PRESETS_ROOT = path.join(SDLC_ROOT, "presets");

type Layer = {
  framework: string;
  testing: string;
  ci: string;
  database: string;
  deployment: string;
};

type Preset = {
  _meta: {
    id: string;
    label: string;
    description: string;
  };
  layers: Layer;
  addons: string[];
  extra_dependencies: {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  env_vars_required: string[];
  post_setup_steps: string[];
};

type ProjectSetupInput = {
  preset?: string;
  framework?: string;
  testing?: string;
  ci?: string;
  database?: string;
  deployment?: string;
  projectName: string;
  outputDir?: string;
  apply?: boolean;
};

function readLayer(category: string, id: string): string {
  const layerPath = path.join(LAYERS_ROOT, category, `${id}.md`);
  if (!fs.existsSync(layerPath)) {
    return `_Layer file not found: ${category}/${id}.md — check sdlc/setup/layers/${category}/_`;
  }
  return fs.readFileSync(layerPath, "utf8");
}

function listPresets(): string[] {
  if (!fs.existsSync(PRESETS_ROOT)) return [];
  return fs
    .readdirSync(PRESETS_ROOT)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""));
}

function loadPreset(id: string): Preset | null {
  const presetPath = path.join(PRESETS_ROOT, `${id}.json`);
  if (!fs.existsSync(presetPath)) return null;
  return JSON.parse(fs.readFileSync(presetPath, "utf8")) as Preset;
}

function extractScriptsFromLayer(layerContent: string): Record<string, string> {
  const match = layerContent.match(/## Scripts\s*```json\s*([\s\S]*?)```/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

function extractDepsFromLayer(
  layerContent: string
): { dependencies?: Record<string, string>; devDependencies?: Record<string, string> } {
  const match = layerContent.match(/## (?:Core )?[Dd]ependencies\s*```json\s*([\s\S]*?)```/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

function extractConfigFilesFromLayer(layerContent: string): string[] {
  const match = layerContent.match(/## Config files to generate\s*([\s\S]*?)(?=##|$)/);
  if (!match) return [];
  return match[1]
    .split("\n")
    .filter((l) => l.trim().startsWith("-"))
    .map((l) => l.replace(/^-\s*/, "").split("—")[0].trim());
}

function generateSetupDoc({
  projectName,
  preset,
  layers,
  frameworkContent,
  testingContent,
  ciContent,
  databaseContent,
  deploymentContent,
  extraDeps,
  envVars,
  postSteps,
}: {
  projectName: string;
  preset: Preset | null;
  layers: Layer;
  frameworkContent: string;
  testingContent: string;
  ciContent: string;
  databaseContent: string;
  deploymentContent: string;
  extraDeps: Preset["extra_dependencies"];
  envVars: string[];
  postSteps: string[];
}): string {
  const date = new Date().toISOString().split("T")[0];

  // Merge all scripts
  const scripts = {
    ...extractScriptsFromLayer(frameworkContent),
    ...extractScriptsFromLayer(testingContent),
  };

  // Merge all dependencies
  const frameworkDeps = extractDepsFromLayer(frameworkContent);
  const testingDeps = extractDepsFromLayer(testingContent);
  const databaseDeps = extractDepsFromLayer(databaseContent);
  const deploymentDeps = extractDepsFromLayer(deploymentContent);

  const allDeps = {
    dependencies: {
      ...frameworkDeps.dependencies,
      ...testingDeps.dependencies,
      ...databaseDeps.dependencies,
      ...deploymentDeps.dependencies,
      ...extraDeps.dependencies,
    },
    devDependencies: {
      ...frameworkDeps.devDependencies,
      ...testingDeps.devDependencies,
      ...databaseDeps.devDependencies,
      ...deploymentDeps.devDependencies,
      ...extraDeps.devDependencies,
    },
  };

  // Collect config files
  const frameworkConfigs = extractConfigFilesFromLayer(frameworkContent);
  const testingConfigs = extractConfigFilesFromLayer(testingContent);
  const databaseConfigs = extractConfigFilesFromLayer(databaseContent);
  const deploymentConfigs = extractConfigFilesFromLayer(deploymentContent);
  const allConfigs = [...frameworkConfigs, ...testingConfigs, ...databaseConfigs, ...deploymentConfigs];

  // Build package.json preview
  const packageJson = {
    name: projectName.toLowerCase().replace(/\s+/g, "-"),
    version: "0.1.0",
    private: true,
    scripts,
    dependencies: Object.keys(allDeps.dependencies ?? {}).length
      ? allDeps.dependencies
      : undefined,
    devDependencies: Object.keys(allDeps.devDependencies ?? {}).length
      ? allDeps.devDependencies
      : undefined,
  };

  const presetLabel = preset ? `${preset._meta.label} (\`${preset._meta.id}\`)` : "custom";

  return `# Project setup: ${projectName}

**Date**: ${date}
**Preset**: ${presetLabel}
**Status**: Pending confirmation

---

## Stack selection

| Layer | Selection |
|-------|-----------|
| Framework | \`${layers.framework}\` |
| Testing | \`${layers.testing}\` |
| Database | \`${layers.database}\` |
| Deployment | \`${layers.deployment}\` |
| CI | \`${layers.ci}\` |
${preset && preset.addons.length ? `| Add-ons | ${preset.addons.join(", ")} |` : ""}

${preset ? `> ${preset._meta.description}` : ""}

---

## Generated package.json

\`\`\`json
${JSON.stringify(packageJson, null, 2)}
\`\`\`

---

## Config files to generate

${allConfigs.map((f) => `- [ ] \`${f}\``).join("\n")}

---

## GitHub Actions workflows

${
  layers.ci !== "none"
    ? `- [ ] \`.github/workflows/ci.yml\` — lint, type-check, unit, integration on PR\n- [ ] \`.github/workflows/e2e.yml\` — Playwright, manual trigger or \`run-e2e\` label`
    : "_No CI configured._"
}

---

## Environment variables required

${
  envVars.length
    ? envVars.map((v) => `- \`${v}\``).join("\n")
    : "_None for the base stack. Add-ons may require additional vars._"
}

${
  envVars.length
    ? `\nCopy \`.env.example\` to \`.env.local\` and fill in values before running \`npm run dev\`.\n`
    : ""
}

---

## Post-setup steps

${postSteps.length ? postSteps.map((s) => `- [ ] ${s}`).join("\n") : "_None._"}

---

## How to apply

This document is the plan. To apply it, confirm with:

> **"Apply the project setup"**

The AI will then:
1. Write \`package.json\` to the current directory
2. Generate all config files listed above
3. Create the \`.github/workflows/\` files
4. Create \`.env.example\` with the required variable names
5. Report what was written and what to do next

Or to adjust any selection first, say which layer you want to change.

---

## Layer details

### Framework: ${layers.framework}

${frameworkContent}

---

### Testing: ${layers.testing}

${testingContent}

---

### CI: ${layers.ci}

${ciContent}
`;
}

export async function projectSetup(input: ProjectSetupInput) {
  const {
    preset: presetId,
    projectName,
    outputDir = "docs/planning",
    apply = false,
  } = input;

  let layers: Layer;
  let preset: Preset | null = null;
  let extraDeps: Preset["extra_dependencies"] = {};
  let envVars: string[] = [];
  let postSteps: string[] = [];

  // ── Resolve layers ─────────────────────────────────────────────────────────

  if (presetId) {
    preset = loadPreset(presetId);
    if (!preset) {
      const available = listPresets().join(", ");
      return {
        content: [
          {
            type: "text" as const,
            text: `Preset "${presetId}" not found.\n\nAvailable presets: ${available}\n\nOr pass framework, testing, and ci parameters directly for a custom selection.`,
          },
        ],
      };
    }
    layers = preset.layers;
    extraDeps = preset.extra_dependencies;
    envVars = preset.env_vars_required;
    postSteps = preset.post_setup_steps;
  } else {
    // Custom selection — use provided layer params or fall back to defaults
    layers = {
      framework: input.framework ?? "next-ts",
      testing: input.testing ?? "vitest-playwright",
      ci: input.ci ?? "gh-actions-pr",
      database: input.database ?? "none",
      deployment: input.deployment ?? "none",
    };
  }

  // ── Load layer content ─────────────────────────────────────────────────────

  const frameworkContent = readLayer("framework", layers.framework);
  const testingContent = readLayer("testing", layers.testing);
  const ciContent = readLayer("ci", layers.ci);
  const databaseContent = readLayer("database", layers.database);
  const deploymentContent = readLayer("deployment", layers.deployment);

  // ── Generate setup doc ─────────────────────────────────────────────────────

  const setupDoc = generateSetupDoc({
    projectName,
    preset,
    layers,
    frameworkContent,
    testingContent,
    ciContent,
    databaseContent,
    deploymentContent,
    extraDeps,
    envVars,
    postSteps,
  });

  const date = new Date().toISOString().split("T")[0];
  const slug = projectName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const docFilename = `${date}-${slug}-project-setup.md`;

  fs.mkdirSync(outputDir, { recursive: true });
  const docPath = path.join(outputDir, docFilename);
  fs.writeFileSync(docPath, setupDoc);

  // ── Apply mode ─────────────────────────────────────────────────────────────

  if (apply) {
    const applied: string[] = [];

    // Rebuild merged package.json for writing
    const frameworkDeps = extractDepsFromLayer(frameworkContent);
    const testingDeps = extractDepsFromLayer(testingContent);
    const databaseDeps2 = extractDepsFromLayer(databaseContent);
    const deploymentDeps2 = extractDepsFromLayer(deploymentContent);
    const scripts = {
      ...extractScriptsFromLayer(frameworkContent),
      ...extractScriptsFromLayer(testingContent),
      ...extractScriptsFromLayer(databaseContent),
      ...extractScriptsFromLayer(deploymentContent),
    };

    const packageJson = {
      name: projectName.toLowerCase().replace(/\s+/g, "-"),
      version: "0.1.0",
      private: true,
      scripts,
      dependencies: {
        ...frameworkDeps.dependencies,
        ...testingDeps.dependencies,
        ...databaseDeps2.dependencies,
        ...deploymentDeps2.dependencies,
        ...extraDeps.dependencies,
      },
      devDependencies: {
        ...frameworkDeps.devDependencies,
        ...testingDeps.devDependencies,
        ...databaseDeps2.devDependencies,
        ...deploymentDeps2.devDependencies,
        ...extraDeps.devDependencies,
      },
    };

    fs.writeFileSync("package.json", JSON.stringify(packageJson, null, 2) + "\n");
    applied.push("package.json");

    // Write .env.example if env vars are required
    if (envVars.length) {
      const envExample = envVars.map((v) => `${v}=`).join("\n") + "\n";
      fs.writeFileSync(".env.example", envExample);
      applied.push(".env.example");
    }

    // Write CI workflow stubs if ci layer is not none
    if (layers.ci !== "none") {
      fs.mkdirSync(".github/workflows", { recursive: true });
      // Extract yaml blocks from ci layer content
      const yamlBlocks = ciContent.match(/```yaml\s*([\s\S]*?)```/g) ?? [];
      const filenames = ciContent.match(/### `(.+?)`/g) ?? [];

      yamlBlocks.forEach((block, i) => {
        const yaml = block.replace(/```yaml\s*/, "").replace(/```$/, "").trim();
        const filename = filenames[i]
          ? filenames[i].replace(/### `(.+?)`/, "$1").trim()
          : `.github/workflows/ci-${i + 1}.yml`;
        fs.writeFileSync(filename, yaml + "\n");
        applied.push(filename);
      });
    }

    return {
      content: [
        {
          type: "text" as const,
          text: `Project setup applied for "${projectName}".\n\nFiles written:\n${applied.map((f) => `  ✓ ${f}`).join("\n")}\n\nSetup plan saved to: ${docPath}\n\nNext steps:\n1. Run \`npm install\`\n${postSteps.map((s) => `2. ${s}`).join("\n")}\n\nConfig files (tsconfig, vitest.config.ts, playwright.config.ts, etc.) need to be generated — ask the AI to scaffold each one, or run \`/generate_prd\` to start the planning phase.`,
        },
      ],
    };
  }

  // ── Doc-only mode (default) ────────────────────────────────────────────────

  const availablePresets = listPresets().join(", ");

  return {
    content: [
      {
        type: "text" as const,
        text: `Project setup plan created: ${docPath}\n\nStack selected:\n  Framework: ${layers.framework}\n  Testing:   ${layers.testing}\n  CI:        ${layers.ci}\n\nReview the plan, then say "Apply the project setup" to write the files.\n\nAvailable presets for future projects: ${availablePresets}`,
      },
    ],
  };
}

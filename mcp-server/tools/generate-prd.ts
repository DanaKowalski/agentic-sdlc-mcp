import fs from "node:fs";
import path from "node:path";

const TEMPLATE_PATH = path.resolve("sdlc/planning/PRD-template.md");

export async function generatePrd({
  featureName,
  description,
  outputDir,
}: {
  featureName: string;
  description: string;
  outputDir: string;
}) {
  const template = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, "utf8")
    : defaultPrdTemplate();

  const slug = featureName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const date = new Date().toISOString().split("T")[0];
  const filename = `${date}-${slug}-prd.md`;

  const filled = template
    .replace(/\{\{FEATURE_NAME\}\}/g, featureName)
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{DESCRIPTION\}\}/g, description);

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, filled);

  return {
    content: [
      {
        type: "text" as const,
        text: `PRD created: ${outputPath}\n\nFill in the remaining sections, then move the feature to design when the PRD is approved.`,
      },
    ],
  };
}

function defaultPrdTemplate(): string {
  return `# PRD: {{FEATURE_NAME}}

**Date**: {{DATE}}
**Status**: Draft

---

## Problem statement

{{DESCRIPTION}}

## Goals

- [ ] Goal 1
- [ ] Goal 2

## Non-goals

- Out of scope item 1

## User stories

As a [user type], I want to [action] so that [benefit].

## Acceptance criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Success metrics

| Metric | Baseline | Target |
|--------|----------|--------|
|        |          |        |

## Open questions

- Question 1
`;
}

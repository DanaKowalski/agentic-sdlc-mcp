import fs from "node:fs";
import path from "node:path";

const TEMPLATE_PATH = path.resolve("sdlc/design/architecture-decision-record-template.md");

export async function createAdr({
  title,
  context,
  outputDir,
}: {
  title: string;
  context: string;
  outputDir: string;
}) {
  // Auto-number by counting existing ADRs
  fs.mkdirSync(outputDir, { recursive: true });
  const existing = fs.readdirSync(outputDir).filter((f) => f.match(/^\d{4}-/));
  const nextNum = String(existing.length + 1).padStart(4, "0");

  const template = fs.existsSync(TEMPLATE_PATH)
    ? fs.readFileSync(TEMPLATE_PATH, "utf8")
    : defaultAdrTemplate();

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const date = new Date().toISOString().split("T")[0];
  const filename = `${nextNum}-${slug}.md`;

  const filled = template
    .replace(/\{\{NUMBER\}\}/g, nextNum)
    .replace(/\{\{TITLE\}\}/g, title)
    .replace(/\{\{DATE\}\}/g, date)
    .replace(/\{\{CONTEXT\}\}/g, context);

  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, filled);

  return {
    content: [
      {
        type: "text" as const,
        text: `ADR created: ${outputPath}\n\nFill in the options considered, the decision, and the consequences.`,
      },
    ],
  };
}

function defaultAdrTemplate(): string {
  return `# ADR {{NUMBER}}: {{TITLE}}

**Date**: {{DATE}}
**Status**: Proposed

---

## Context

{{CONTEXT}}

## Options considered

### Option A

**Pros**: 
**Cons**: 

### Option B

**Pros**: 
**Cons**: 

## Decision

We chose **Option A** because...

## Consequences

**Positive**:
- 

**Negative / trade-offs**:
- 

## References

- 
`;
}

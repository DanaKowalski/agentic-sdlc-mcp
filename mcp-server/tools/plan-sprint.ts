import fs from "node:fs";
import path from "node:path";

export async function planSprint({
  sprintNumber,
  goal,
  items,
  outputDir,
}: {
  sprintNumber: number;
  goal: string;
  items: string[];
  outputDir: string;
}) {
  const date = new Date().toISOString().split("T")[0];
  const filename = `sprint-${String(sprintNumber).padStart(2, "0")}.md`;

  const itemList = items.map((item) => `- [ ] ${item}`).join("\n");

  const content = `# Sprint ${sprintNumber}

**Date**: ${date}
**Goal**: ${goal}

---

## Items

${itemList}

## Notes

_Add notes during the sprint here._

## Retrospective

_Fill in after the sprint closes._

### What went well

- 

### What to improve

- 

### Actions

- 
`;

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, content);

  return {
    content: [
      {
        type: "text" as const,
        text: `Sprint plan created: ${outputPath}`,
      },
    ],
  };
}

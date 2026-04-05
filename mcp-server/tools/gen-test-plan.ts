import fs from "node:fs";
import path from "node:path";

export async function genTestPlan({
  featureName,
  acceptanceCriteria,
  outputDir,
}: {
  featureName: string;
  acceptanceCriteria: string[];
  outputDir: string;
}) {
  const date = new Date().toISOString().split("T")[0];
  const slug = featureName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const filename = `${date}-${slug}-test-plan.md`;

  const criteriaSection = acceptanceCriteria
    .map(
      (criterion, i) => `### AC${i + 1}: ${criterion}

| Test case | Steps | Expected | Actual | Pass? |
|-----------|-------|----------|--------|-------|
|           |       |          |        |       |
`
    )
    .join("\n");

  const content = `# Test plan: ${featureName}

**Date**: ${date}
**Status**: Draft

---

## Scope

What is being tested and what is explicitly out of scope for this plan.

## Test environment

- Environment: 
- Test data requirements: 
- Dependencies: 

## Acceptance criteria coverage

${criteriaSection}

## Edge cases

- [ ] 
- [ ] 

## Sign-off

| Role | Name | Date | Approved |
|------|------|------|----------|
| QA   |      |      |          |
| Dev  |      |      |          |
`;

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, content);

  return {
    content: [
      {
        type: "text" as const,
        text: `Test plan created: ${outputPath}`,
      },
    ],
  };
}

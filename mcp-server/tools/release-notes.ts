import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export async function releaseNotes({
  version,
  fromRef,
  toRef,
  outputDir,
}: {
  version: string;
  fromRef: string;
  toRef: string;
  outputDir: string;
}) {
  let gitLog = "";
  try {
    gitLog = execSync(`git log ${fromRef}..${toRef} --pretty=format:"%s" --no-merges`, {
      encoding: "utf8",
    }).trim();
  } catch {
    gitLog = "_Could not read git log — run this from inside a git repository._";
  }

  // Categorise by conventional commit prefix
  const lines = gitLog.split("\n").filter(Boolean);
  const categories: Record<string, string[]> = {
    feat: [],
    fix: [],
    perf: [],
    refactor: [],
    docs: [],
    chore: [],
    other: [],
  };

  for (const line of lines) {
    const match = line.match(/^(feat|fix|perf|refactor|docs|chore|test)(\(.+?\))?!?:\s*(.+)$/i);
    if (match) {
      const type = match[1].toLowerCase();
      const scope = match[2] ? match[2].slice(1, -1) : null;
      const description = match[3];
      const entry = scope ? `**${scope}**: ${description}` : description;
      (categories[type] ?? categories.other).push(`- ${entry}`);
    } else {
      categories.other.push(`- ${line}`);
    }
  }

  const date = new Date().toISOString().split("T")[0];

  const section = (title: string, items: string[]) =>
    items.length ? `### ${title}\n\n${items.join("\n")}\n` : "";

  const content = `# Release notes — ${version}

**Date**: ${date}
**Range**: \`${fromRef}\` → \`${toRef}\`

---

${section("New features", categories.feat)}
${section("Bug fixes", categories.fix)}
${section("Performance", categories.perf)}
${section("Refactors", categories.refactor)}
${section("Documentation", categories.docs)}
${section("Other", [...categories.chore, ...categories.other])}

---

## Upgrade notes

_Add any breaking changes, migration steps, or required env var changes here._

## Known issues

_List any known issues shipping with this release._
`;

  const slug = version.replace(/\./g, "-").replace(/[^a-z0-9-]/gi, "");
  const filename = `${date}-${slug}-release-notes.md`;
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, content);

  return {
    content: [
      {
        type: "text" as const,
        text: `Release notes created: ${outputPath}\n\nReview and fill in upgrade notes and known issues before publishing.`,
      },
    ],
  };
}

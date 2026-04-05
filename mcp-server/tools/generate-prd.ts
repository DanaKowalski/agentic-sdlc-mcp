/**
 * generate-prd.ts
 *
 * Active PRD generation — not a template filler.
 *
 * Two-phase flow matching /project_setup:
 *   1. Draft (default): reads context, checks for related docs, fills every
 *      section with real content derived from inputs, flags research triggers,
 *      writes docs/planning/<date>-<slug>-prd.md
 *   2. Apply (apply: true): confirms the PRD, registers it in
 *      docs/planning/index.md so orchestrator sessions can find open work
 *
 * Agent integration:
 *   - If the feature touches existing code, flags that a research agent
 *     should be spawned before implementation begins (Trigger 1)
 *   - Links to any existing related ADRs or sprint docs found in docs/
 */

import fs from "node:fs";
import path from "node:path";

const PLANNING_INDEX = path.resolve("docs/planning/index.md");
const DOCS_ROOT = path.resolve("docs");

type GeneratePrdInput = {
  featureName: string;
  problemStatement: string;
  userType?: string;
  goals?: string[];
  nonGoals?: string[];
  acceptanceCriteria?: string[];
  successMetrics?: string[];
  technicalNotes?: string;
  touchesExistingCode?: boolean;
  relatedTo?: string;
  outputDir?: string;
  apply?: boolean;
};

function slug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function findRelatedDocs(featureName: string): string[] {
  const related: string[] = [];
  const searchTerm = featureName.toLowerCase();

  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name));
      } else if (entry.name.endsWith(".md")) {
        const fullPath = path.join(dir, entry.name);
        try {
          const content = fs.readFileSync(fullPath, "utf8").toLowerCase();
          if (content.includes(searchTerm)) {
            related.push(fullPath.replace(path.resolve(".") + path.sep, ""));
          }
        } catch { /* skip */ }
      }
    }
  }

  scan(DOCS_ROOT);
  return related;
}

function getOpenPrds(): string[] {
  if (!fs.existsSync(PLANNING_INDEX)) return [];
  const content = fs.readFileSync(PLANNING_INDEX, "utf8");
  const open: string[] = [];
  for (const line of content.split("\n")) {
    if (line.includes("| Draft |") || line.includes("| In Review |")) {
      const match = line.match(/\[.+?\]\((.+?)\)/);
      if (match) open.push(match[1]);
    }
  }
  return open;
}

function registerPrd(prdPath: string, featureName: string) {
  const relPath = prdPath.replace(path.resolve(".") + path.sep, "").replace(/\\/g, "/");
  const entry = `| [${featureName}](${relPath}) | Draft | ${today()} |`;

  if (!fs.existsSync(PLANNING_INDEX)) {
    fs.mkdirSync(path.dirname(PLANNING_INDEX), { recursive: true });
    fs.writeFileSync(
      PLANNING_INDEX,
      `# Planning index\n\nAll PRDs for this project.\n\n| Feature | Status | Date |\n|---------|--------|------|\n${entry}\n`
    );
  } else {
    const content = fs.readFileSync(PLANNING_INDEX, "utf8");
    if (!content.includes(relPath)) {
      fs.writeFileSync(PLANNING_INDEX, content.trimEnd() + "\n" + entry + "\n");
    }
  }
}

function buildPrdContent(input: GeneratePrdInput, relatedDocs: string[], openPrds: string[]): string {
  const {
    featureName,
    problemStatement,
    userType = "user",
    goals = [],
    nonGoals = [],
    acceptanceCriteria = [],
    successMetrics = [],
    technicalNotes,
    touchesExistingCode = false,
    relatedTo,
  } = input;

  const goalsSection = goals.length
    ? goals.map((g) => `- [ ] ${g}`).join("\n")
    : `- [ ] [Derive from problem statement]`;

  const nonGoalsSection = nonGoals.length
    ? nonGoals.map((g) => `- ${g}`).join("\n")
    : `- [What this feature will NOT do]`;

  const storiesSection = goals.length
    ? goals.map((g) => `- As a ${userType}, I want to ${g.toLowerCase()} so that [benefit].`).join("\n")
    : `- As a ${userType}, I want to [action] so that [benefit].`;

  const acSection = acceptanceCriteria.length
    ? acceptanceCriteria.map((c) => `- [ ] ${c}`).join("\n")
    : `- [ ] [Fill before moving to design]`;

  const metricsSection = successMetrics.length
    ? successMetrics.map((m) => `| ${m} | — | — |`).join("\n")
    : `| [Metric] | [Baseline] | [Target] |`;

  const relatedSection = [
    ...(relatedTo ? [`- ${relatedTo}`] : []),
    ...relatedDocs.map((d) => `- ${d}`),
    ...(openPrds.length ? [``, `**Open PRDs that may overlap:**`, ...openPrds.map((p) => `- ${p}`)] : []),
  ].join("\n") || "_None found._";

  const agentWarning = touchesExistingCode
    ? `\n> **Agent trigger active — Trigger 1**: This feature touches existing code.\n> Per \`sdlc/agents/orchestrator.md\`, spawn a research agent before implementation.\n`
    : "";

  const techSection = technicalNotes ?? `_No technical notes. Add constraints, dependencies, or risks before design._`;

  return `# PRD: ${featureName}

**Date**: ${today()}
**Author**: [your name]
**Status**: Draft
${agentWarning}
---

## Problem statement

${problemStatement}

---

## Goals

${goalsSection}

## Non-goals

${nonGoalsSection}

---

## User stories

${storiesSection}

---

## Acceptance criteria

${acSection}

---

## Technical considerations

${techSection}

---

## Success metrics

| Metric | Baseline | Target |
|--------|----------|--------|
${metricsSection}

---

## Related docs

${relatedSection}

---

## Open questions

| Question | Owner | Due | Answer |
|----------|-------|-----|--------|
| [Question] | | | |

---

## SDLC status

| Phase | Status | Notes |
|-------|--------|-------|
| Planning | In progress | This PRD |
| Design | Not started | ADR required if architecture decision needed |
| Implementation | Not started | ${touchesExistingCode ? "Spawn research agent first (Trigger 1)" : "Ready after PRD approval"} |
| Testing | Not started | Generate test plan from acceptance criteria |
| Deployment | Not started | |

---

_Generated by \`/generate_prd\`. Fill all bracketed sections before marking "In Review"._
`;
}

export async function generatePrd(input: GeneratePrdInput) {
  const { featureName, outputDir = "docs/planning", apply = false, touchesExistingCode = false } = input;

  const relatedDocs = findRelatedDocs(featureName);
  const openPrds = getOpenPrds();
  const prdContent = buildPrdContent(input, relatedDocs, openPrds);

  const filename = `${today()}-${slug(featureName)}-prd.md`;
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, filename);
  fs.writeFileSync(outputPath, prdContent);

  if (apply) {
    registerPrd(outputPath, featureName);
  }

  const lines: string[] = [`PRD created: ${outputPath}`, ""];

  if (relatedDocs.length) {
    lines.push(`Related docs found (${relatedDocs.length}):`);
    relatedDocs.forEach((d) => lines.push(`  ${d}`));
    lines.push("");
  }

  if (openPrds.length) {
    lines.push(`Open PRDs that may overlap (${openPrds.length}):`);
    openPrds.forEach((p) => lines.push(`  ${p}`));
    lines.push("");
  }

  if (touchesExistingCode) {
    lines.push("Agent trigger active: spawn a research agent before implementation.");
    lines.push("See sdlc/agents/orchestrator.md — Trigger 1.");
    lines.push("");
  }

  lines.push(
    apply
      ? "PRD registered in docs/planning/index.md. Next: fill bracketed sections, set status to 'In Review'."
      : "Review the PRD, then re-run with apply: true to register it in docs/planning/index.md."
  );

  return { content: [{ type: "text" as const, text: lines.join("\n") }] };
}
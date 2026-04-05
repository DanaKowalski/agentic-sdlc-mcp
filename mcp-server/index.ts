/**
 * sdlc MCP server
 *
 * Exposes SDLC slash commands as MCP tools:
 *   /generate_prd, /plan_sprint, /create_adr, /gen_test_plan, /release_notes
 *
 * Registered alongside Context7 in config/config-sources.json.
 * AI tools see both servers' tools at the same time.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generatePrd } from "./tools/generate-prd.js";
import { planSprint } from "./tools/plan-sprint.js";
import { createAdr } from "./tools/create-adr.js";
import { genTestPlan } from "./tools/gen-test-plan.js";
import { releaseNotes } from "./tools/release-notes.js";

const server = new McpServer({
  name: "sdlc",
  version: "0.1.0",
});

// ── /generate_prd ────────────────────────────────────────────────────────────
server.tool(
  "generate_prd",
  "Scaffold a Product Requirements Document for a new feature. Reads sdlc/planning/PRD-template.md and fills it using the provided feature description.",
  {
    featureName: z.string().describe("Short name for the feature (used as filename)"),
    description: z.string().describe("What the feature does and why it is needed"),
    outputDir: z.string().optional().default("docs/planning").describe("Directory to write the PRD into"),
  },
  async ({ featureName, description, outputDir }) => generatePrd({ featureName, description, outputDir })
);

// ── /plan_sprint ─────────────────────────────────────────────────────────────
server.tool(
  "plan_sprint",
  "Create a sprint planning document from a list of backlog items.",
  {
    sprintNumber: z.number().describe("Sprint number"),
    goal: z.string().describe("One-sentence sprint goal"),
    items: z.array(z.string()).describe("List of backlog items or user story IDs to include"),
    outputDir: z.string().optional().default("docs/sprints").describe("Directory to write the sprint plan into"),
  },
  async ({ sprintNumber, goal, items, outputDir }) => planSprint({ sprintNumber, goal, items, outputDir })
);

// ── /create_adr ──────────────────────────────────────────────────────────────
server.tool(
  "create_adr",
  "Create a new Architecture Decision Record (ADR) in sdlc/design/ or the specified output directory.",
  {
    title: z.string().describe("Short title for the decision (e.g. 'Use PostgreSQL for primary datastore')"),
    context: z.string().describe("What problem or situation prompted this decision"),
    outputDir: z.string().optional().default("docs/adr").describe("Directory to write the ADR into"),
  },
  async ({ title, context, outputDir }) => createAdr({ title, context, outputDir })
);

// ── /gen_test_plan ───────────────────────────────────────────────────────────
server.tool(
  "gen_test_plan",
  "Generate a test plan scaffold for a feature, referencing its acceptance criteria.",
  {
    featureName: z.string().describe("Feature name (should match an existing PRD)"),
    acceptanceCriteria: z.array(z.string()).describe("List of acceptance criteria to cover"),
    outputDir: z.string().optional().default("docs/testing").describe("Directory to write the test plan into"),
  },
  async ({ featureName, acceptanceCriteria, outputDir }) => genTestPlan({ featureName, acceptanceCriteria, outputDir })
);

// ── /release_notes ───────────────────────────────────────────────────────────
server.tool(
  "release_notes",
  "Draft release notes from the git log between two refs.",
  {
    version: z.string().describe("Release version (e.g. v1.2.0)"),
    fromRef: z.string().describe("Starting git ref (tag or commit SHA)"),
    toRef: z.string().optional().default("HEAD").describe("Ending git ref (defaults to HEAD)"),
    outputDir: z.string().optional().default("docs/releases").describe("Directory to write release notes into"),
  },
  async ({ version, fromRef, toRef, outputDir }) => releaseNotes({ version, fromRef, toRef, outputDir })
);

// ── Start server ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("sdlc MCP server running on stdio");

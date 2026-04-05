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
import { projectSetup } from "./tools/project-setup.js";

const server = new McpServer({
  name: "sdlc",
  version: "0.1.0",
});

// ── /generate_prd ────────────────────────────────────────────────────────────
server.tool(
  "generate_prd",
  "Scaffold a Product Requirements Document for a new feature. Fills every section with real content derived from inputs. Use apply: true to register the PRD in docs/planning/index.md after review.",
  {
    featureName: z.string().describe("Short name for the feature (used as filename)"),
    problemStatement: z.string().describe("What problem this feature solves and why it matters"),
    userType: z.string().optional().describe("Who this feature is for (e.g. 'admin user', 'developer'). Defaults to 'user'."),
    goals: z.array(z.string()).optional().describe("List of specific goals this feature achieves"),
    nonGoals: z.array(z.string()).optional().describe("Explicit list of what this feature will NOT do"),
    acceptanceCriteria: z.array(z.string()).optional().describe("Conditions that must be true for the feature to be considered done"),
    successMetrics: z.array(z.string()).optional().describe("Measurable outcomes that indicate success"),
    technicalNotes: z.string().optional().describe("Constraints, dependencies, risks, or architectural notes"),
    touchesExistingCode: z.boolean().optional().describe("Set true if this feature modifies existing code — triggers research agent warning (Trigger 1)"),
    relatedTo: z.string().optional().describe("Path or name of a related PRD, ADR, or doc"),
    outputDir: z.string().optional().default("docs/planning").describe("Directory to write the PRD into"),
    apply: z.boolean().optional().default(false).describe("Set true to register the PRD in docs/planning/index.md. Default false = draft only."),
  },
  async (input) => generatePrd(input)
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


// ── /project_setup ───────────────────────────────────────────────────────────
server.tool(
  "project_setup",
  "Scaffold a new project from a preset or custom layer selection. Generates a setup plan doc first, then applies files on confirmation. Available presets: next-full, api-only, chatbot-platform.",
  {
    projectName: z.string().describe("Name of the project being set up"),
    preset: z.string().optional().describe("Preset id to use (next-full | api-only | chatbot-platform). Omit for custom layer selection."),
    framework: z.string().optional().describe("Framework layer id (next-ts | node-ts | react-lib). Used when no preset is specified."),
    testing: z.string().optional().describe("Testing layer id (vitest-playwright | vitest-only | none). Used when no preset is specified."),
    database: z.string().optional().describe("Database layer id (supabase | none). Used when no preset is specified."),
    deployment: z.string().optional().describe("Deployment layer id (vercel | docker | none). Used when no preset is specified."),
    ci: z.string().optional().describe("CI layer id (gh-actions-pr | none). Used when no preset is specified."),
    outputDir: z.string().optional().default("docs/planning").describe("Where to write the setup plan doc"),
    apply: z.boolean().optional().default(false).describe("Set true to apply files after plan is confirmed. Default false = plan only."),
  },
  async (input) => projectSetup(input)
);

// ── Start server ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("sdlc MCP server running on stdio");
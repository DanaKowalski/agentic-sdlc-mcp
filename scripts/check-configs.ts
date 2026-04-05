/**
 * check-configs.ts
 *
 * Detects drift between config-sources.json and all generated tool config files.
 * Also checks for outdated MCP server versions via npm outdated.
 *
 * Run: npm run check:configs
 * Exit 0 = clean. Exit 1 = drift detected (report written to sdlc/maintenance/config-drift-report.md)
 */

// child_process imported dynamically in the version check section (cross-platform)
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCES_PATH = path.join(ROOT, "config/config-sources.json");
const LAST_CHECKED_PATH = path.join(ROOT, "scripts/last-checked.json");
const REPORT_PATH = path.join(ROOT, "sdlc/maintenance/config-drift-report.md");

type McpServerConfig = {
  command: string;
  args: string[];
  type: string;
  [key: string]: unknown;
};

type Sources = {
  _meta: { schema_version: string };
  mcpServers: Record<string, McpServerConfig & { _docs?: string; _purpose?: string; _pinned_version?: string }>;
  toolTargets: Record<string, { outputPath: string; schemaRef: string; lastKnownSchemaVersion: string }>;
};

const issues: string[] = [];
const warnings: string[] = [];

function log(msg: string) { console.log(msg); }
function warn(msg: string) { warnings.push(msg); console.warn(`  ⚠  ${msg}`); }
function fail(msg: string) { issues.push(msg); console.error(`  ✗  ${msg}`); }
function pass(msg: string) { console.log(`  ✓  ${msg}`); }

// ── 1. Load sources ──────────────────────────────────────────────────────────

log("\n── Loading config-sources.json");
if (!fs.existsSync(SOURCES_PATH)) {
  fail("config/config-sources.json not found");
  process.exit(1);
}
const sources: Sources = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));
pass(`Schema version: ${sources._meta.schema_version}`);

// ── 2. Check parity: each toolTarget config matches sources ──────────────────

log("\n── Checking config parity across tool targets");

for (const [toolName, target] of Object.entries(sources.toolTargets)) {
  const configPath = path.join(ROOT, target.outputPath);

  if (!fs.existsSync(configPath)) {
    fail(`[${toolName}] Config file missing: ${target.outputPath} — run npm run sync:configs`);
    continue;
  }

  const generated = JSON.parse(fs.readFileSync(configPath, "utf8"));

  // Check each MCP server is present and args match
  for (const [serverName, serverConfig] of Object.entries(sources.mcpServers)) {
    const genServer = generated?.mcpServers?.[serverName];

    if (!genServer) {
      fail(`[${toolName}] Missing server "${serverName}" — run npm run sync:configs`);
      continue;
    }

    const expectedArgs = JSON.stringify(serverConfig.args);
    const actualArgs = JSON.stringify(genServer.args);

    if (expectedArgs !== actualArgs) {
      fail(`[${toolName}] Server "${serverName}" args drift:\n    expected: ${expectedArgs}\n    actual:   ${actualArgs}`);
    } else {
      pass(`[${toolName}] "${serverName}" in sync`);
    }
  }

  // Check for extra servers in generated file not in sources (stale entries)
  for (const serverName of Object.keys(generated?.mcpServers ?? {})) {
    if (serverName.startsWith("_")) continue;
    if (!sources.mcpServers[serverName]) {
      warn(`[${toolName}] Extra server "${serverName}" in generated config not in config-sources.json — stale entry?`);
    }
  }
}

// ── 3. Check MCP server versions ────────────────────────────────────────────

log("\n── Checking MCP server versions");

try {
  // spawnSync avoids shell-specific syntax (2>/dev/null, || true) that differs
  // between Unix sh/bash and Windows cmd/PowerShell.
  // On Windows, npm is a .cmd file and must be invoked as "npm.cmd" when not
  // going through a shell. On Unix (Linux/macOS) plain "npm" is correct.
  // npm outdated exits with code 1 when packages ARE outdated — not an error.
  const { spawnSync } = await import("child_process");
  const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

  const result = spawnSync(npmCmd, ["outdated", "--json"], {
    cwd: ROOT,
    encoding: "utf8",
  });

  // stdout has JSON regardless of exit code (0 = all current, 1 = some outdated)
  const raw = (result.stdout ?? "").trim();
  const outdatedJson: Record<string, { current: string; latest: string }> =
    raw ? JSON.parse(raw) : {};

  const mcpSdk = outdatedJson["@modelcontextprotocol/sdk"];
  if (mcpSdk) {
    warn(`@modelcontextprotocol/sdk outdated: ${mcpSdk.current} → ${mcpSdk.latest}`);
  } else {
    pass("@modelcontextprotocol/sdk is current");
  }

  const anthropic = outdatedJson["@anthropic-ai/sdk"];
  if (anthropic) {
    warn(`@anthropic-ai/sdk outdated: ${anthropic.current} → ${anthropic.latest}`);
  } else {
    pass("@anthropic-ai/sdk is current");
  }
} catch {
  warn("Could not run npm outdated — skipping version check");
}

// ── 4. Check context rules files exist ──────────────────────────────────────

log("\n── Checking context rule files");

const ruleFiles = ["CLAUDE.md", ".clinerules", ".cursorrules", ".windsurfrules"];
for (const f of ruleFiles) {
  if (fs.existsSync(path.join(ROOT, f))) {
    pass(`${f} present`);
  } else {
    fail(`${f} missing`);
  }
}

// ── 5. Report ────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

if (issues.length === 0 && warnings.length === 0) {
  log("\n✅ All configs are in sync.\n");

  fs.writeFileSync(LAST_CHECKED_PATH, JSON.stringify({ last_checked: now, status: "clean" }, null, 2));
  process.exit(0);
}

// Write drift report
const report = `# Config drift report

Generated: ${now}

## Failures (${issues.length})

${issues.length ? issues.map(i => `- ${i}`).join("\n") : "_None_"}

## Warnings (${warnings.length})

${warnings.length ? warnings.map(w => `- ${w}`).join("\n") : "_None_"}

---

**Next step**: Follow \`sdlc/maintenance/config-maintenance-checklist.md\`
`;

fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
fs.writeFileSync(REPORT_PATH, report);
fs.writeFileSync(LAST_CHECKED_PATH, JSON.stringify({ last_checked: now, status: "drift", issues: issues.length, warnings: warnings.length }, null, 2));

log(`\n❌ Drift detected. Report written to sdlc/maintenance/config-drift-report.md\n`);
log("   Run: npm run sync:configs   to fix parity issues");
log("   Then: follow sdlc/maintenance/config-maintenance-checklist.md\n");

process.exit(1);

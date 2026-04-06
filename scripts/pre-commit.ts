/**
 * pre-commit.ts
 *
 * Simple pre-commit hook that runs the config parity check.
 */

import { spawnSync } from "child_process";

const CONFIG_PATTERNS = [
  /^config\//,
  /^\.clinerules$/,
  /^\.cursorrules$/,
  /^\.windsurfrules$/,
  /^AGENTS\.md$/,
  /^CLAUDE\.md$/,
  /^llms\.txt$/,
];

const IGNORE_PATTERNS = [
  /^scripts\/last-checked\.json$/,
  /^sdlc\/maintenance\/config-drift-report\.md$/,
  /^\.husky\//,
];

const gitResult = spawnSync("git", ["diff", "--cached", "--name-only"], {
  encoding: "utf8",
  shell: false,
});

if (gitResult.error) {
  console.error("pre-commit: could not run git diff — skipping");
  process.exit(0);
}

const staged = gitResult.stdout.trim().split("\n").filter(Boolean);

const relevantStaged = staged.filter((file) => 
  CONFIG_PATTERNS.some((pattern) => pattern.test(file)) &&
  !IGNORE_PATTERNS.some((pattern) => pattern.test(file))
);

if (relevantStaged.length === 0) {
  process.exit(0);
}

console.log("⚙️  Config/rule files staged — running parity check...");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";

const checkResult = spawnSync(npmCmd, ["run", "check:configs"], {
  stdio: "inherit",
  shell: false,
});

if (checkResult.status !== 0) {
  console.error("\n❌ Config drift / parity issues detected.");
  console.error("   Run: npm run sync:configs");
  console.error("   Then stage the updated files and try committing again.");
  process.exit(1);
}

console.log("✅ All configs are in sync.");
process.exit(0);
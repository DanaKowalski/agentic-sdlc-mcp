/**
 * pre-commit.ts
 *
 * checks for document drift before commit
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

// Files that should NEVER trigger the drift check (even if they change)
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
  console.error("pre-commit: could not run git diff — skipping config check");
  process.exit(0);
}

const staged = gitResult.stdout.trim().split("\n").filter(Boolean);

const relevantStaged = staged.filter((file) => 
  CONFIG_PATTERNS.some((pattern) => pattern.test(file)) &&
  !IGNORE_PATTERNS.some((pattern) => pattern.test(file))
);

if (relevantStaged.length === 0) {
  process.exit(0); // nothing relevant staged → allow commit
}

console.log("⚙️  Config or rule files staged — running drift check...");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const checkResult = spawnSync(npmCmd, ["run", "check:configs"], {
  stdio: "inherit",
  shell: false,
});

if (checkResult.status !== 0) {
  console.error("\n❌ Config drift detected.");
  console.error("   Run: npm run sync:configs");
  console.error("   Then stage the changes and try committing again.");
  process.exit(1);
}

console.log("✅ Drift check passed.");

// Re-stage relevant files (this fixes the "passed then failed again" loop caused by sync rewriting files)
spawnSync("git", ["add", ...relevantStaged], { stdio: "inherit" });

process.exit(0);
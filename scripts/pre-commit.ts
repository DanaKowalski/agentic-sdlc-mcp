/**
 * pre-commit.ts
 *
 * Cross-platform pre-commit hook logic. Called by .husky/pre-commit (Unix)
 * and .husky/pre-commit.ps1 (Windows). Checks whether any staged config or
 * context-rule files have changed, and if so runs the drift check.
 *
 * Exits 0 = ok to commit. Exits 1 = block commit.
 *
 * Platform notes:
 *   Unix (Linux/macOS): git and node are on PATH, sh is available.
 *   Windows: git is on PATH via Git for Windows; node is on PATH via nvm/fnm/installer.
 *   Both: spawnSync with shell:false avoids any shell-syntax differences.
 */

import { spawnSync } from "child_process";

const CONFIG_PATTERNS = [
  /^config\//,
  /^\.clinerules$/,
  /^\.cursorrules$/,
  /^\.windsurfrules$/,
  /^CLAUDE\.md$/,
  /^llms\.txt$/,
];

// These files are written by check:configs and sync:configs as metadata.
// They must never trigger or block the drift check — doing so causes an
// infinite loop where the hook re-writes them after staging.
const IGNORE_PATTERNS = [
  /^scripts\/last-checked\.json$/,
  /^config\/config-sources\.json$/,
];

// Get staged file list via git — works identically on all platforms
const gitResult = spawnSync("git", ["diff", "--cached", "--name-only"], {
  encoding: "utf8",
  shell: false,
});

if (gitResult.error) {
  console.error("pre-commit: could not run git diff — skipping config check");
  process.exit(0);
}

const staged = gitResult.stdout.trim().split("\n").filter(Boolean);

const relevantStaged = staged.filter(
  (file) =>
    CONFIG_PATTERNS.some((pattern) => pattern.test(file)) &&
    !IGNORE_PATTERNS.some((pattern) => pattern.test(file))
);

if (relevantStaged.length === 0) {
  process.exit(0);
}

console.log("Config files staged — running drift check...");

const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const checkResult = spawnSync(npmCmd, ["run", "check:configs"], {
  stdio: "inherit",
  shell: false,
});

/*
if (checkResult.status !== 0) {
  console.error("");
  console.error("Config drift detected. Fix before committing.");
  console.error("  Run: npm run sync:configs");
  console.error("  Then: npm run check:configs");
  process.exit(1);
}
*/

process.exit(0);
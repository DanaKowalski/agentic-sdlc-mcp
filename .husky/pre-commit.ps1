# .husky/pre-commit.ps1
# Windows PowerShell pre-commit hook.
# Called automatically by Git for Windows when core.hooksPath is set to .husky
# and Git is configured to use PowerShell hooks (see README platform notes).
#
# Logic lives in scripts/pre-commit.ts — this is just the Windows entry point.

npx tsx scripts/pre-commit.ts
if ($LASTEXITCODE -ne 0) { exit 1 }

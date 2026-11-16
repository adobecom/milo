#!/usr/bin/env node
// Block-structure gate for the fiesta `command` template.
//
// Every CHANGED block under libs/blocks/<name>/ must contain both <name>.js and
// <name>.css. This mirrors the check the harness used to hardcode for Milo,
// re-declared in Milo's own repo so the harness stays generic.
//
// Usage (the harness substitutes the changed-file list for {changed_files}):
//   node .pinata/scripts/check-block-structure.mjs <path> <path> ...
// With no changed block files, it passes (nothing to check).
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const BLOCK_RE = /^libs\/blocks\/([^/]+)\//;

const changed = process.argv.slice(2).filter(Boolean);
const blocks = [...new Set(
  changed
    .map((f) => BLOCK_RE.exec(f.replaceAll('\\', '/')))
    .filter(Boolean)
    .map((m) => m[1]),
)];

if (blocks.length === 0) {
  console.log('No changed blocks; block-structure check passed.');
  process.exit(0);
}

const missing = [];
for (const name of blocks) {
  for (const ext of ['js', 'css']) {
    const file = join('libs/blocks', name, `${name}.${ext}`);
    if (!existsSync(file)) missing.push(file);
  }
}

if (missing.length > 0) {
  console.error('Block-structure check failed — missing required files:');
  for (const file of missing) console.error(`  - ${file}`);
  process.exit(1);
}

console.log(`Block-structure check passed (${blocks.length} block(s) checked).`);

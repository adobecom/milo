/**
 * `clean` stage. Recursively deletes the local output directory so a
 * subsequent `extract` starts from an empty tree.
 */

import fs from 'node:fs/promises';

/**
 * Remove the entire output directory (idempotent).
 * @param {{ outputDir: string }} options
 * @returns {Promise<void>}
 */
export async function runClean({ outputDir }) {
  await fs.rm(outputDir, { recursive: true, force: true });
  console.log(`[clean] Removed ${outputDir}`);
}

import fs from 'node:fs/promises';

/**
 * @param {{ outputDir: string }} options
 * @returns {Promise<void>}
 */
export async function runClean({ outputDir }) {
  await fs.rm(outputDir, { recursive: true, force: true });
  console.log(`[clean] Removed ${outputDir}`);
}

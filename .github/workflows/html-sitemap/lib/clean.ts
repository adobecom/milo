import fs from 'node:fs/promises';

export async function runClean({ outputDir }: { outputDir: string }) {
  await fs.rm(outputDir, { recursive: true, force: true });
  console.log(`[clean] Removed ${outputDir}`);
}

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runClean } from '../lib/clean.ts';

test('runClean removes the output directory recursively', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-clean-'));
  const outputDir = path.join(root, 'html-sitemap');
  await fs.mkdir(path.join(outputDir, 'business', 'raw'), { recursive: true });
  await fs.writeFile(path.join(outputDir, 'business', 'raw', 'test.txt'), 'ok', 'utf8');

  await runClean({ outputDir });

  await assert.rejects(() => fs.stat(outputDir));
});

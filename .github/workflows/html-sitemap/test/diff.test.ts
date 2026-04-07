import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runDiff } from '../lib/delivery/diff.ts';

function makeConfigJson(geos: Array<{ baseGeo: string; deploy: string }>): string {
  return JSON.stringify({
    config: { data: [{ subdomain: 'business', domain: 'business.adobe.com', site: 'da-bacom', extendedSitemap: 'all' }] },
    'query-index-map': { data: [{ subdomain: 'business', site: 'da-bacom', queryIndexPath: '/query-index.json', enabled: 'true' }] },
    'geo-map': { data: geos.map((g) => ({ subdomain: 'business', ...g, language: 'en', extendedGeos: '' })) },
    'page-copy': { data: geos.map((g) => ({ subdomain: 'business', baseGeo: g.baseGeo, pageTitle: 'Sitemap', pageDescription: '', otherSitemapsHeading: '', extendedPagesHeading: '' })) },
  }, null, 2);
}

test('runDiff reports changed when local and remote differ', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-diff-'));
  await fs.mkdir(path.join(tmpDir, 'business'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'business', 'sitemap.html'), '<body>local</body>\n', 'utf8');
  await fs.writeFile(path.join(tmpDir, 'html-sitemap.json'), makeConfigJson([{ baseGeo: '', deploy: 'true' }]), 'utf8');

  const originalToken = process.env.DA_SOURCE_TOKEN;
  process.env.DA_SOURCE_TOKEN = 'test-token';

  try {
    const result = await runDiff({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      daRoot: '/test',
      fetchImpl: async () => new Response('<body>remote</body>\n', { status: 200 }),
    });

    assert.equal(result.hadFailures, false);
    const summary = result.units.find((u) => u.summary)?.summary;
    assert.equal(summary?.status, 'changed');
  } finally {
    if (originalToken === undefined) delete process.env.DA_SOURCE_TOKEN;
    else process.env.DA_SOURCE_TOKEN = originalToken;
  }
});

test('runDiff reports unchanged when hashes match', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-diff-'));
  const html = '<body>same content</body>\n';
  await fs.mkdir(path.join(tmpDir, 'business'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'business', 'sitemap.html'), html, 'utf8');
  await fs.writeFile(path.join(tmpDir, 'html-sitemap.json'), makeConfigJson([{ baseGeo: '', deploy: 'true' }]), 'utf8');

  const originalToken = process.env.DA_SOURCE_TOKEN;
  process.env.DA_SOURCE_TOKEN = 'test-token';

  try {
    const result = await runDiff({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      daRoot: '/test',
      fetchImpl: async () => new Response(html, { status: 200 }),
    });

    assert.equal(result.hadFailures, false);
    const summary = result.units.find((u) => u.summary)?.summary;
    assert.equal(summary?.status, 'unchanged');
  } finally {
    if (originalToken === undefined) delete process.env.DA_SOURCE_TOKEN;
    else process.env.DA_SOURCE_TOKEN = originalToken;
  }
});

test('runDiff reports new when remote returns 404', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-diff-'));
  await fs.mkdir(path.join(tmpDir, 'business'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'business', 'sitemap.html'), '<body>new page</body>\n', 'utf8');
  await fs.writeFile(path.join(tmpDir, 'html-sitemap.json'), makeConfigJson([{ baseGeo: '', deploy: 'true' }]), 'utf8');

  const originalToken = process.env.DA_SOURCE_TOKEN;
  process.env.DA_SOURCE_TOKEN = 'test-token';

  try {
    const result = await runDiff({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      daRoot: '/test',
      fetchImpl: async () => new Response('not found', { status: 404 }),
    });

    assert.equal(result.hadFailures, false);
    const summary = result.units.find((u) => u.summary)?.summary;
    assert.equal(summary?.status, 'new');
  } finally {
    if (originalToken === undefined) delete process.env.DA_SOURCE_TOKEN;
    else process.env.DA_SOURCE_TOKEN = originalToken;
  }
});

test('runDiff skips geos not marked deploy', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-diff-'));
  await fs.mkdir(path.join(tmpDir, 'business'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'business', 'sitemap.html'), '<body>local</body>\n', 'utf8');
  await fs.writeFile(path.join(tmpDir, 'html-sitemap.json'), makeConfigJson([{ baseGeo: '', deploy: '' }]), 'utf8');

  const originalToken = process.env.DA_SOURCE_TOKEN;
  process.env.DA_SOURCE_TOKEN = 'test-token';
  let fetchCalled = false;

  try {
    const result = await runDiff({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      daRoot: '/test',
      fetchImpl: async () => { fetchCalled = true; return new Response('', { status: 200 }); },
    });

    assert.equal(result.hadFailures, false);
    assert.equal(fetchCalled, false);
    assert.ok(!result.units[0].summary);
  } finally {
    if (originalToken === undefined) delete process.env.DA_SOURCE_TOKEN;
    else process.env.DA_SOURCE_TOKEN = originalToken;
  }
});

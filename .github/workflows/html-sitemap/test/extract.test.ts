import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runExtract } from '../lib/extract/extract.ts';

const fixture = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'fixtures/config.json');

function makeResponse(status: number, body: string, contentType = 'application/json'): Response {
  return new Response(body, {
    status,
    headers: {
      'content-type': contentType,
    },
  });
}

function createFetchStub(): { routes: Map<string, Response>; fetch: typeof fetch } {
  const routes = new Map<string, Response>([
    ['https://main--federal--adobecom.aem.live/federal/assets/data/html-sitemap.json', makeResponse(200, JSON.stringify({}))],
  ]);

  return {
    routes,
    fetch: async (url) => {
      const key = String(url);
      const value = routes.get(key);
      if (!value) {
        return makeResponse(404, 'not found', 'text/plain');
      }
      return value;
    },
  };
}

test('runExtract writes GNAV, manifest, placeholders, base and extended query indices', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-extract-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--da-bacom--adobecom.aem.live/gnav.plain.html', makeResponse(200, `
    <html><body>
      <a href="/fragments/gnav/products">Products</a>
      <a href="/fragments/gnav/ai">AI</a>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/gnav/products.plain.html', makeResponse(200, '<html><body><h5>Featured</h5></body></html>', 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/gnav/ai.plain.html', makeResponse(200, '<html><body><p>AI</p></body></html>', 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/regions', makeResponse(200, '<html><body><div class="region-nav"><a href="/fr/">France</a></div></body></html>', 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json', makeResponse(200, JSON.stringify({ data: [{ Key: 'premiere', Text: 'Premiere' }] })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({ data: [{ path: '/products' }] })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/br/query-index.json', makeResponse(200, JSON.stringify({ data: [{ path: '/br/products' }] })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/be_fr/query-index.json', makeResponse(200, JSON.stringify({ data: [{ path: '/be_fr/products' }] })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/ca/query-index.json', makeResponse(404, 'missing', 'text/plain'));

  const result = await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });

  assert.equal(result.hadFailures, false);

  const manifest = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', '_extract', 'gnav', 'manifest.json'), 'utf8')) as { baseGeo: string; files: { file: string }[] };
  assert.equal(manifest.baseGeo, '');
  assert.equal(manifest.files.length, 3);
  assert.deepEqual(manifest.files.map((file) => file.file), ['gnav.html', 'products.html', 'ai.html']);

  const placeholders = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', '_extract', 'placeholders.json'), 'utf8')) as { data: { Text: string }[] };
  assert.equal(placeholders.data[0].Text, 'Premiere');

  const regionsHtml = await fs.readFile(path.join(tmpDir, 'business', '_extract', 'regions.html'), 'utf8');
  assert.match(regionsHtml, /href="\/fr\/"/);

  const baseIndex = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', '_extract', 'da-bacom', 'query-index.json'), 'utf8')) as { data: { path: string }[] };
  assert.equal(baseIndex.data[0].path, '/products');

  const brIndex = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', '_extract', 'extended', 'br', 'da-bacom', 'query-index.json'), 'utf8')) as { data: { path: string }[] };
  assert.equal(brIndex.data[0].path, '/br/products');

  const beFrIndex = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', '_extract', 'extended', 'be_fr', 'da-bacom', 'query-index.json'), 'utf8')) as { data: { path: string }[] };
  assert.equal(beFrIndex.data[0].path, '/be_fr/products');

  await assert.rejects(() => fs.readFile(path.join(tmpDir, 'business', '_extract', 'extended', 'ca', 'da-bacom', 'query-index.json'), 'utf8'));
});

test('runExtract warns and continues when GNAV cannot be resolved', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-extract-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--federal--adobecom.aem.live/fr/federal/globalnav/placeholders.json', makeResponse(404, 'missing', 'text/plain'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/regions', makeResponse(200, '<html><body><div class="region-nav"><a href="/fr/">France</a></div></body></html>', 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fr/query-index.json', makeResponse(200, JSON.stringify({ data: [{ path: '/fr/products' }] })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/be_fr/query-index.json', makeResponse(404, 'missing', 'text/plain'));

  const warnings: string[] = [];
  const originalWarn = console.warn;
  console.warn = (message?: unknown) => warnings.push(String(message));

  try {
    const result = await runExtract({
      configRef: fixture,
      outputDir: tmpDir,
      subdomainFilter: 'business',
      geoFilter: 'fr',
      fetchImpl: stub.fetch,
      now: new Date('2026-04-03T12:00:00.000Z'),
    });
    assert.equal(result.hadFailures, false);
  } finally {
    console.warn = originalWarn;
  }

  assert.ok(warnings.some((message) => message.includes('Skipping GNAV')));
  const baseIndex = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', 'fr', '_extract', 'da-bacom', 'query-index.json'), 'utf8')) as { data: { path: string }[] };
  assert.equal(baseIndex.data[0].path, '/fr/products');
  await assert.rejects(() => fs.readFile(path.join(tmpDir, 'business', 'fr', '_extract', 'gnav', 'manifest.json'), 'utf8'));
});

test('runExtract leaves no base-geo folder when the base geo is not sitemap-eligible', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-extract-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fr/query-index.json', makeResponse(404, 'missing', 'text/plain'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/be_fr/query-index.json', makeResponse(200, JSON.stringify({ data: [{ path: '/be-fr/page' }] })));

  const warnings: string[] = [];
  const logs: string[] = [];
  const originalWarn = console.warn;
  const originalLog = console.log;
  console.warn = (message?: unknown) => warnings.push(String(message));
  console.log = (message?: unknown) => logs.push(String(message));

  try {
    const result = await runExtract({
      configRef: fixture,
      outputDir: tmpDir,
      subdomainFilter: 'business',
      geoFilter: 'fr',
      fetchImpl: stub.fetch,
      now: new Date('2026-04-03T12:00:00.000Z'),
    });
    assert.equal(result.hadFailures, false);
  } finally {
    console.warn = originalWarn;
    console.log = originalLog;
  }

  assert.ok(warnings.some((message) => message.includes('Skipping query index for business/fr da-bacom')));
  assert.ok(logs.some((message) => message.includes('Base geos without sitemap output: fr')));
  await assert.rejects(() => fs.stat(path.join(tmpDir, 'business', 'fr')));
});

test('runExtract requires at least one indexable base-geo row before emitting output', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-extract-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--da-bacom--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({
    data: [
      { path: '/products/hidden', title: 'Hidden', robots: 'noindex' },
    ],
  })));

  const result = await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });

  assert.equal(result.hadFailures, false);
  await assert.rejects(() => fs.stat(path.join(tmpDir, 'business')));
});

test('runExtract paginates query-index responses before writing output', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-extract-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--da-bacom--adobecom.aem.live/gnav.plain.html', makeResponse(200, `
    <html><body>
      <a href="/fragments/gnav/products">Products</a>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/gnav/products.plain.html', makeResponse(200, '<html><body><h5>Featured</h5></body></html>', 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/regions', makeResponse(200, '<html><body><div class="region-nav"><a href="/fr/">France</a></div></body></html>', 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json', makeResponse(200, JSON.stringify({ data: [] })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({
    total: 3,
    offset: 0,
    limit: 2,
    data: [
      { path: '/products/one', title: 'One' },
      { path: '/products/two', title: 'Two' },
    ],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/query-index.json?offset=2', makeResponse(200, JSON.stringify({
    total: 3,
    offset: 2,
    limit: 2,
    data: [
      { path: '/products/three', title: 'Three' },
    ],
  })));

  const result = await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });

  assert.equal(result.hadFailures, false);

  const baseIndex = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', '_extract', 'da-bacom', 'query-index.json'), 'utf8')) as {
    total: number;
    offset: number;
    limit: number;
    data: { path: string }[];
  };
  assert.equal(baseIndex.total, 3);
  assert.equal(baseIndex.data.length, 3);
  assert.deepEqual(baseIndex.data.map((row) => row.path), [
    '/products/one',
    '/products/two',
    '/products/three',
  ]);
});

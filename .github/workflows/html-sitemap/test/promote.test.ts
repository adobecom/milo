import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runPromote } from '../lib/delivery/promote.ts';

async function createFixture(tmpDir: string): Promise<void> {
  const businessDir = path.join(tmpDir, 'business');
  const frDir = path.join(tmpDir, 'business', 'fr');
  await fs.mkdir(businessDir, { recursive: true });
  await fs.mkdir(frDir, { recursive: true });
  await fs.writeFile(path.join(businessDir, 'sitemap.html'), '<body><main><h1>Sitemap</h1></main></body>\n', 'utf8');
  await fs.writeFile(path.join(frDir, 'sitemap.html'), '<body><main><h1>Plan du site</h1></main></body>\n', 'utf8');
  await fs.writeFile(path.join(tmpDir, 'html-sitemap.json'), JSON.stringify({
    config: {
      data: [
        { subdomain: 'business', domain: 'business.adobe.com', site: 'da-bacom', extendedSitemap: 'all' },
      ],
    },
    'query-index-map': {
      data: [
        { subdomain: 'business', site: 'da-bacom', queryIndexPath: '/query-index.json', enabled: 'true' },
      ],
    },
    'geo-map': {
      data: [
        { subdomain: 'business', baseGeo: '', language: 'en', extendedGeos: '', deploy: 'true' },
        { subdomain: 'business', baseGeo: 'fr', language: 'fr', extendedGeos: '', deploy: 'true' },
      ],
    },
    'page-copy': {
      data: [
        { subdomain: 'business', baseGeo: '', pageTitle: 'Sitemap', pageDescription: 'Browse pages across this site by section, locale, and region.', otherSitemapsHeading: 'Other Regions', extendedPagesHeading: 'Additional Localized Pages' },
        { subdomain: 'business', baseGeo: 'fr', pageTitle: 'Plan du site', pageDescription: 'Parcourez les pages de ce site par section, langue et région.', otherSitemapsHeading: 'Autres régions', extendedPagesHeading: 'Pages localisées supplémentaires' },
      ],
    },
  }, null, 2), 'utf8');
}

test('runPromote previews sitemap documents under da-root and polls job status', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-preview-'));
  await createFixture(tmpDir);

  const requests: { method: string; url: string; body?: unknown }[] = [];
  const logged: string[] = [];
  const originalToken = process.env.AEM_ADMIN_TOKEN;
  const originalLog = console.log;
  process.env.AEM_ADMIN_TOKEN = 'test-aem-token';
  console.log = (...args: unknown[]) => {
    logged.push(args.map((arg) => String(arg)).join(' '));
  };

  try {
    const result = await runPromote({
      action: 'preview',
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      subdomainFilter: 'business',
      daRoot: '/drafts/hgpa/html-sitemap',
      pollIntervalMs: 0,
      maxPollAttempts: 1,
      fetchImpl: async (url, init) => {
        const body = typeof init?.body === 'string' ? JSON.parse(init.body) : undefined;
        requests.push({
          method: init?.method || 'GET',
          url: String(url),
          body,
        });

        if (String(url).includes('/details')) {
          return new Response(JSON.stringify({
            topic: 'preview',
            state: 'stopped',
            stopTime: '2026-04-04T10:00:00.000Z',
            data: {
              resources: [
                { status: 200, path: '/drafts/hgpa/html-sitemap/sitemap' },
                { status: 200, path: '/drafts/hgpa/html-sitemap/fr/sitemap' },
              ],
            },
            progress: { failed: 0 },
          }), { status: 200, headers: { 'content-type': 'application/json' } });
        }

        return new Response(JSON.stringify({
          links: {
            self: 'https://admin.hlx.page/job/adobecom/da-bacom/main/preview/job-123',
          },
        }), { status: 200, headers: { 'content-type': 'application/json' } });
      },
    });

    assert.equal(result.hadFailures, false);
    assert.deepEqual(requests.map((request) => request.url), [
      'https://admin.hlx.page/preview/adobecom/da-bacom/main/*',
      'https://admin.hlx.page/job/adobecom/da-bacom/main/preview/job-123/details',
    ]);
    assert.deepEqual(requests[0].body, {
      paths: [
        '/drafts/hgpa/html-sitemap/sitemap',
        '/drafts/hgpa/html-sitemap/fr/sitemap',
      ],
      forceUpdate: true,
    });
    assert.match(
      logged.join('\n'),
      /https:\/\/main--da-bacom--adobecom\.aem\.page\/drafts\/hgpa\/html-sitemap\/sitemap/,
    );
    assert.match(
      logged.join('\n'),
      /https:\/\/main--da-bacom--adobecom\.aem\.page\/drafts\/hgpa\/html-sitemap\/fr\/sitemap/,
    );
  } finally {
    console.log = originalLog;
    if (originalToken === undefined) {
      delete process.env.AEM_ADMIN_TOKEN;
    } else {
      process.env.AEM_ADMIN_TOKEN = originalToken;
    }
  }
});

test('runPromote supports publish and skips missing local html files', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-publish-'));
  await createFixture(tmpDir);
  await fs.rm(path.join(tmpDir, 'business', 'fr', 'sitemap.html'));

  const originalToken = process.env.AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM;
  const logged: string[] = [];
  const originalLog = console.log;
  process.env.AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM = 'repo-token';
  console.log = (...args: unknown[]) => {
    logged.push(args.map((arg) => String(arg)).join(' '));
  };

  try {
    const result = await runPromote({
      action: 'publish',
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      subdomainFilter: 'business',
      daRoot: '/drafts/hgpa/html-sitemap',
      pollIntervalMs: 0,
      maxPollAttempts: 1,
      fetchImpl: async (url) => {
        if (String(url).includes('/details')) {
          return new Response(JSON.stringify({
            topic: 'publish',
            state: 'stopped',
            stopTime: '2026-04-04T10:00:00.000Z',
            data: {
              resources: [
                { status: 200, path: '/drafts/hgpa/html-sitemap/sitemap' },
              ],
            },
          }), { status: 200, headers: { 'content-type': 'application/json' } });
        }

        return new Response(JSON.stringify({
          links: {
            self: 'https://admin.hlx.page/job/adobecom/da-bacom/main/publish/job-123',
          },
        }), { status: 200, headers: { 'content-type': 'application/json' } });
      },
    });

    assert.equal(result.hadFailures, false);
    assert.equal(result.units.length, 2);
    const fr = result.units.find((entry) => entry.unit.baseGeo === 'fr');
    assert.ok(fr);
    assert.ok(fr.summary);
    assert.equal(fr.summary.promoted, false);
    assert.equal(fr.ok, true);
    assert.match(
      logged.join('\n'),
      /https:\/\/main--da-bacom--adobecom\.aem\.live\/drafts\/hgpa\/html-sitemap\/sitemap/,
    );
  } finally {
    console.log = originalLog;
    if (originalToken === undefined) {
      delete process.env.AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM;
    } else {
      process.env.AEM_ADMIN_TOKEN_ADOBECOM_DA_BACOM = originalToken;
    }
  }
});

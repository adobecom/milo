import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runPush } from '../../lib/stages/push.js';

test('runPush creates remote folders and uploads sitemap.html under da-root', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-push-'));
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
        { subdomain: 'business', baseGeo: '', language: 'en', extendedGeos: '', stage: 'publish' },
        { subdomain: 'business', baseGeo: 'fr', language: 'fr', extendedGeos: '', stage: 'publish' },
      ],
    },
    'page-copy': {
      data: [
        { subdomain: 'business', geo: '', pageTitle: 'Sitemap' },
        { subdomain: 'business', geo: 'fr', pageTitle: 'Plan du site' },
      ],
    },
  }, null, 2), 'utf8');

  const requests = [];
  const logged = [];
  const originalToken = process.env.DA_SOURCE_TOKEN;
  const originalLog = console.log;
  process.env.DA_SOURCE_TOKEN = 'test-token';
  console.log = (...args) => {
    logged.push(args.map((arg) => String(arg)).join(' '));
  };

  try {
    const result = await runPush({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      subdomainFilter: 'business',
      daRoot: '/drafts/hgpa/html-sitemap',
      force: true,
      fetchImpl: async (url, init) => {
        requests.push({
          method: init?.method || 'GET',
          url: String(url),
          bodyType: init?.body instanceof FormData ? 'form-data' : typeof init?.body,
        });
        return new Response('{}', { status: 201, headers: { 'content-type': 'application/json' } });
      },
    });

    assert.equal(result.hadFailures, false);
    assert.deepEqual(
      requests.filter((request) => request.bodyType === 'form-data').map((request) => request.url).sort(),
      [
        'https://admin.da.live/source/adobecom/da-bacom/drafts/hgpa/html-sitemap/fr/sitemap.html',
        'https://admin.da.live/source/adobecom/da-bacom/drafts/hgpa/html-sitemap/sitemap.html',
      ].sort(),
    );
    assert.match(
      logged.join('\n'),
      /https:\/\/da\.live\/edit#\/adobecom\/da-bacom\/drafts\/hgpa\/html-sitemap\/sitemap\.html/,
    );
    assert.match(
      logged.join('\n'),
      /https:\/\/da\.live\/edit#\/adobecom\/da-bacom\/drafts\/hgpa\/html-sitemap\/fr\/sitemap\.html/,
    );
  } finally {
    console.log = originalLog;
    if (originalToken === undefined) {
      delete process.env.DA_SOURCE_TOKEN;
    } else {
      process.env.DA_SOURCE_TOKEN = originalToken;
    }
  }
});

test('runPush can exchange rolling-import IMS credentials for a DA bearer token', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-push-'));
  const businessDir = path.join(tmpDir, 'business');
  await fs.mkdir(businessDir, { recursive: true });
  await fs.writeFile(path.join(businessDir, 'sitemap.html'), '<body><main><h1>Sitemap</h1></main></body>\n', 'utf8');
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
        { subdomain: 'business', baseGeo: '', language: 'en', extendedGeos: '', stage: 'publish' },
      ],
    },
    'page-copy': {
      data: [
        { subdomain: 'business', geo: '', pageTitle: 'Sitemap' },
      ],
    },
  }, null, 2), 'utf8');

  const originalEnv = {
    DA_SOURCE_TOKEN: process.env.DA_SOURCE_TOKEN,
    DA_TOKEN: process.env.DA_TOKEN,
    ROLLING_IMPORT_IMS_URL: process.env.ROLLING_IMPORT_IMS_URL,
    ROLLING_IMPORT_CLIENT_ID: process.env.ROLLING_IMPORT_CLIENT_ID,
    ROLLING_IMPORT_CLIENT_SECRET: process.env.ROLLING_IMPORT_CLIENT_SECRET,
    ROLLING_IMPORT_CODE: process.env.ROLLING_IMPORT_CODE,
    ROLLING_IMPORT_GRANT_TYPE: process.env.ROLLING_IMPORT_GRANT_TYPE,
  };

  delete process.env.DA_SOURCE_TOKEN;
  delete process.env.DA_TOKEN;
  process.env.ROLLING_IMPORT_IMS_URL = 'https://ims.example/token';
  process.env.ROLLING_IMPORT_CLIENT_ID = 'client-id';
  process.env.ROLLING_IMPORT_CLIENT_SECRET = 'client-secret';
  process.env.ROLLING_IMPORT_CODE = 'auth-code';
  process.env.ROLLING_IMPORT_GRANT_TYPE = 'authorization_code';

  const authHeaders = [];
  const logged = [];
  const originalLog = console.log;
  console.log = (...args) => {
    logged.push(args.map((arg) => String(arg)).join(' '));
  };

  try {
    const result = await runPush({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      subdomainFilter: 'business',
      daRoot: '/drafts/hgpa/html-sitemap',
      force: true,
      fetchImpl: async (url, init) => {
        if (String(url) === 'https://ims.example/token') {
          return new Response(JSON.stringify({ access_token: 'ims-token' }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          });
        }

        authHeaders.push(String(init?.headers?.Authorization || ''));
        return new Response('{}', { status: 201, headers: { 'content-type': 'application/json' } });
      },
    });

    assert.equal(result.hadFailures, false);
    assert.ok(authHeaders.every((value) => value === 'Bearer ims-token'));
    assert.match(
      logged.join('\n'),
      /https:\/\/da\.live\/edit#\/adobecom\/da-bacom\/drafts\/hgpa\/html-sitemap\/sitemap\.html/,
    );
  } finally {
    console.log = originalLog;
    Object.entries(originalEnv).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }
});

test('runPush skips unchanged pages when force is false', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-push-'));
  const businessDir = path.join(tmpDir, 'business');
  await fs.mkdir(businessDir, { recursive: true });
  const html = '<body><main><h1>Sitemap</h1></main></body>\n';
  await fs.writeFile(path.join(businessDir, 'sitemap.html'), html, 'utf8');
  await fs.writeFile(path.join(tmpDir, 'html-sitemap.json'), JSON.stringify({
    config: { data: [{ subdomain: 'business', domain: 'business.adobe.com', site: 'da-bacom', extendedSitemap: 'all' }] },
    'query-index-map': { data: [{ subdomain: 'business', site: 'da-bacom', queryIndexPath: '/query-index.json', enabled: 'true' }] },
    'geo-map': { data: [{ subdomain: 'business', baseGeo: '', language: 'en', extendedGeos: '', stage: 'publish' }] },
    'page-copy': { data: [{ subdomain: 'business', geo: '', pageTitle: 'Sitemap' }] },
  }, null, 2), 'utf8');

  const originalToken = process.env.DA_SOURCE_TOKEN;
  process.env.DA_SOURCE_TOKEN = 'test-token';
  const uploads = [];

  try {
    const result = await runPush({
      configRef: path.join(tmpDir, 'html-sitemap.json'),
      outputDir: tmpDir,
      subdomainFilter: 'business',
      daRoot: '/drafts/test',
      force: false,
      fetchImpl: async (url, init) => {
        if (init?.body instanceof FormData) {
          uploads.push(String(url));
        }
        // Return the same HTML as local so hashes match
        return new Response(html, { status: 200 });
      },
    });

    assert.equal(result.hadFailures, false);
    assert.equal(uploads.length, 0);
    assert.equal(result.units[0].summary?.pushed, false);
  } finally {
    if (originalToken === undefined) delete process.env.DA_SOURCE_TOKEN;
    else process.env.DA_SOURCE_TOKEN = originalToken;
  }
});

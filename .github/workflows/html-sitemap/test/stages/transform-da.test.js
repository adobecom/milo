import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runExtract } from '../../lib/stages/extract.js';
import { runTransformData } from '../../lib/stages/transform-data.js';
import { runTransformDa } from '../../lib/stages/transform-da.js';

const fixture = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/config.json');
const expectedBusinessDefaultHtml = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/da-sitemap.business.default.html',
);
const expectedBusinessFrHtml = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/da-sitemap.business.fr.html',
);
const expectedWwwDefaultHtml = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/da-sitemap.www.default.html',
);

function makeResponse(status, body, contentType = 'application/json') {
  return new Response(body, {
    status,
    headers: { 'content-type': contentType },
  });
}

function createFetchStub() {
  const routes = new Map();
  return {
    routes,
    fetch: async (url) => routes.get(String(url))?.clone() || makeResponse(404, 'missing', 'text/plain'),
  };
}

function normalizeSnapshotFixture(html) {
  return html.endsWith('\n\n') ? html : `${html}\n`;
}

test('runTransformDa writes sitemap.html from sitemap.json', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-transform-da-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--da-bacom--adobecom.aem.live/gnav.plain.html', makeResponse(200, `
    <html><body>
      <a href="/fragments/gnav/products">Products</a>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/gnav/products.plain.html', makeResponse(200, `
    <html><body>
      <h5>Featured</h5>
      <p><a href="/products/commerce">Adobe Commerce</a></p>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json', makeResponse(200, JSON.stringify({
    data: [
      { Key: 'premiere', Text: 'premiere-pro' },
      { Key: 'region-label', Text: 'region' },
      { Key: 'regions-label', Text: 'Regions' },
      { Key: 'region-fr', Text: 'région' },
    ],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/products/commerce', title: 'Adobe Commerce' }],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fr/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/fr/produits/commerce', title: 'Adobe Commerce FR' }],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/br/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/br/products/firefly', title: 'Adobe Firefly BR' }],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/ca/query-index.json', makeResponse(404, 'missing', 'text/plain'));

  await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });
  await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: 'fr',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });

  await runTransformData({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
  });

  const result = await runTransformDa({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
  });

  assert.equal(result.hadFailures, false);

  const html = await fs.readFile(path.join(tmpDir, 'business', 'sitemap.html'), 'utf8');
  const expectedHtml = await fs.readFile(expectedBusinessDefaultHtml, 'utf8');
  assert.equal(html, normalizeSnapshotFixture(expectedHtml));
  assert.match(html, /<body>/);
  assert.match(html, /<main>/);
  assert.match(html, /class="text max-width-8-desktop center xxl-spacing xl-button l-title xxl-heading l-body"/);
  assert.match(html, /<h1>Sitemap<\/h1>/);
  assert.match(html, /Browse pages across this site by section, locale, and region\./);
  assert.match(html, /class="grid align-headings contained static-links"/);
  assert.match(html, /<h3>Products<\/h3>/);
  assert.match(html, /<a href="https:\/\/business\.adobe\.com\/products\/commerce" data-link-index="0">Adobe Commerce<\/a>/);
  assert.match(html, /class="text static-links contained center xxl-spacing max-width-8-desktop"/);
  assert.match(html, /Other Regions/);
  assert.match(html, /<a href="https:\/\/business\.adobe\.com\/fr\/sitemap\.html" data-geo-index="0">France<\/a>/);
  assert.match(html, /Additional Localized Pages/);
  assert.match(html, /class="accordion"/);
  assert.match(html, /<div>Brazil<\/div>/);
  assert.match(html, /class="metadata"/);
  assert.match(html, /<div>\s*<div>title<\/div>\s*<div>Sitemap<\/div>\s*<\/div>/);
  assert.match(html, /<div>\s*<div>description<\/div>\s*<div>Browse pages across this site by section, locale, and region\.<\/div>\s*<\/div>/);
  assert.match(html, /\n  <footer><\/footer>\n<\/body>\n\n$/);

  const manifest = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', 'manifest.json'), 'utf8'));
  assert.equal(manifest.subdomain, 'business');
  assert.equal(manifest.pageCount, 1);
  assert.equal(manifest.pages[0].baseGeo, '');
  assert.ok(manifest.pages[0].sha256);
  assert.equal(manifest.pages[0].totalLinkCount, manifest.pages[0].baseGeoLinkCount + manifest.pages[0].otherSitemapLinkCount + manifest.pages[0].extendedGeoLinkCount);

  const csv = await fs.readFile(path.join(tmpDir, 'business', 'manifest.csv'), 'utf8');
  assert.match(csv, /^baseGeo,domain,deploy,sha256,/);
});

test('runTransformDa writes localized html and omits empty base-geo navigation sections', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-transform-da-fr-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--da-bacom--adobecom.aem.live/gnav.plain.html', makeResponse(200, `
    <html><body>
      <a href="/fragments/gnav/products">Products</a>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fragments/gnav/products.plain.html', makeResponse(200, `
    <html><body>
      <h5>Featured</h5>
      <p><a href="/products/commerce">Adobe Commerce</a></p>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json', makeResponse(200, JSON.stringify({
    data: [
      { Key: 'premiere', Text: 'premiere-pro' },
      { Key: 'region-label', Text: 'region' },
      { Key: 'regions-label', Text: 'Regions' },
      { Key: 'region-fr', Text: 'région' },
    ],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/products/commerce', title: 'Adobe Commerce' }],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/fr/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/fr/produits/commerce', title: 'Adobe Commerce FR' }],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/br/query-index.json', makeResponse(200, JSON.stringify({
    data: [{ path: '/br/products/firefly', title: 'Adobe Firefly BR' }],
  })));
  stub.routes.set('https://main--da-bacom--adobecom.aem.live/ca/query-index.json', makeResponse(404, 'missing', 'text/plain'));

  await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });
  await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: 'fr',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });

  await runTransformData({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: 'fr',
  });

  const result = await runTransformDa({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: 'fr',
  });

  assert.equal(result.hadFailures, false);

  const html = await fs.readFile(path.join(tmpDir, 'business', 'fr', 'sitemap.html'), 'utf8');
  const expectedHtml = await fs.readFile(expectedBusinessFrHtml, 'utf8');
  assert.equal(html, normalizeSnapshotFixture(expectedHtml));
  assert.match(html, /<h1>Plan du site<\/h1>/);
  assert.match(html, /<h2>Autres régions<\/h2>/);
  assert.match(html, /<a href="https:\/\/business\.adobe\.com\/sitemap\.html" data-geo-index="0">Global<\/a>/);
  assert.match(html, /class="text static-links contained center xxl-spacing max-width-8-desktop"/);
  assert.doesNotMatch(html, /class="grid align-headings contained static-links"/);
});

test('runTransformDa writes www html from the federal GNAV-backed document shape', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-transform-da-www-'));
  const stub = createFetchStub();

  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/acom/acom-gnav.plain.html', makeResponse(200, `
    <html><body>
      <h2><a href="/federal/globalnav/acom/sections/section-menu-cc">Creativity &amp; Design</a></h2>
      <h2><a href="/federal/globalnav/acom/sections/section-menu-dx">Marketing &amp; Commerce</a></h2>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-cc.plain.html', makeResponse(200, `
    <html><body>
      <h5>Featured</h5>
      <p><a href="https://main--edu--adobecom.aem.live/creative-cloud/education">Adobe Express for Education | Adobe</a></p>
      <p><a href="/products/photoshop">Photoshop</a></p>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json', makeResponse(200, JSON.stringify({
    data: [],
  })));
  stub.routes.set('https://main--da-cc--adobecom.aem.live/cc-shared/assets/query-index.json', makeResponse(404, 'missing', 'text/plain'));
  stub.routes.set('https://main--edu--adobecom.aem.live/edu-shared/assets/query-index.json', makeResponse(200, JSON.stringify({
    data: [
      { path: '/creative-cloud/education', title: 'Adobe Express for Education | Adobe' },
    ],
  })));
  stub.routes.set('https://main--da-cc--adobecom.aem.live/ae_en/cc-shared/assets/query-index.json', makeResponse(404, 'missing', 'text/plain'));
  stub.routes.set('https://main--edu--adobecom.aem.live/ae_en/edu-shared/assets/query-index.json', makeResponse(404, 'missing', 'text/plain'));

  await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'www',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });

  await runTransformData({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'www',
    geoFilter: '',
  });

  const result = await runTransformDa({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'www',
    geoFilter: '',
  });

  assert.equal(result.hadFailures, false);

  const html = await fs.readFile(path.join(tmpDir, 'www', 'sitemap.html'), 'utf8');
  const expectedHtml = await fs.readFile(expectedWwwDefaultHtml, 'utf8');
  assert.equal(html, normalizeSnapshotFixture(expectedHtml));
  assert.match(html, /<h3>Creativity &amp; Design<\/h3>/);
  assert.match(html, /<a href="https:\/\/www\.adobe\.com\/creative-cloud\/education" data-link-index="0">Adobe Express for Education<\/a>/);
  assert.match(html, /<a href="https:\/\/www\.adobe\.com\/products\/photoshop" data-link-index="1">Photoshop<\/a>/);
  assert.doesNotMatch(html, /class="text contained"/);
  assert.doesNotMatch(html, /class="accordion"/);
});

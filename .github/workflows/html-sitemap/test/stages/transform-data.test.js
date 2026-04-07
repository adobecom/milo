import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runExtract } from '../../lib/stages/extract.js';
import { runTransformData } from '../../lib/stages/transform-data.js';

const fixture = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/config.json');

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

test('runTransformData writes sitemap.json from extracted inputs', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-transform-'));
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
      <p><a href="/products/{{premiere}}">Video</a></p>
    </body></html>
  `, 'text/html'));
  stub.routes.set('https://main--federal--adobecom.aem.live/federal/globalnav/placeholders.json', makeResponse(200, JSON.stringify({
    data: [{ Key: 'premiere', Text: 'premiere-pro' }],
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

  const result = await runTransformData({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'business',
    geoFilter: '',
  });

  assert.equal(result.hadFailures, false);

  const document = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', 'sitemap.json'), 'utf8'));

  assert.equal(document.sections.baseGeoLinks[0].heading, 'Products');
  assert.equal(document.sections.baseGeoLinks[0].groups[0].subheading, 'Featured');
  assert.equal(document.sections.baseGeoLinks[0].groups[0].links[0].url, 'https://business.adobe.com/products/commerce');
  assert.equal(document.sections.baseGeoLinks[0].groups[0].links[1].url, 'https://business.adobe.com/products/premiere-pro');
  assert.equal(document.sections.otherSitemapLinks[0].geo, 'fr');
  assert.equal(document.sections.extendedGeoLinks[0].geo, 'br');
  assert.equal(document.sections.extendedGeoLinks[0].links[0].path, '/br/products/firefly');
});

test('runTransformData supports www federal GNAV fallback and non-host multi-site eligibility', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-transform-www-'));
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
      <p><a href="https://main--edu--adobecom.aem.live/creative-cloud/education">Education</a></p>
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

  const result = await runExtract({
    configRef: fixture,
    outputDir: tmpDir,
    subdomainFilter: 'www',
    geoFilter: '',
    fetchImpl: stub.fetch,
    now: new Date('2026-04-03T12:00:00.000Z'),
  });
  assert.equal(result.hadFailures, false);

  const transform = await runTransformData({
    configRef: path.join(tmpDir, 'html-sitemap.json'),
    outputDir: tmpDir,
    subdomainFilter: 'www',
    geoFilter: '',
  });
  assert.equal(transform.hadFailures, false);

  const document = JSON.parse(await fs.readFile(path.join(tmpDir, 'www', 'sitemap.json'), 'utf8'));

  assert.equal(document.sections.baseGeoLinks[0].heading, 'Creativity & Design');
  assert.deepEqual(
    document.sections.baseGeoLinks[0].groups[0].links.map((link) => link.url),
    [
      'https://www.adobe.com/creative-cloud/education',
      'https://www.adobe.com/products/photoshop',
    ],
  );
});

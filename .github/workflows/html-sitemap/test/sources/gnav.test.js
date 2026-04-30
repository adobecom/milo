import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { extractGnavArtifacts, parseInlineFragmentPaths, parseTopLevelSections } from '../../lib/sources/gnav.js';
import { buildBaseGeoLinks } from '../../lib/data/gnav-sections.js';

test('parseTopLevelSections reads federal heading links and excludes dx', () => {
  const html = `
    <html><body>
      <h2><a href="/federal/globalnav/acom/sections/section-menu-cc">Creativity &amp; Design</a></h2>
      <h2><a href="/federal/globalnav/acom/sections/section-menu-dx">Marketing &amp; Commerce</a></h2>
      <h2><a href="/federal/globalnav/acom/sections/section-menu-help">Learn &amp; Support</a></h2>
    </body></html>
  `;
  const sections = parseTopLevelSections(html, 'https://main--federal--adobecom.aem.live');
  assert.deepEqual(sections, [
    {
      heading: 'Creativity & Design',
      sectionPath: '/federal/globalnav/acom/sections/section-menu-cc',
    },
    {
      heading: 'Learn & Support',
      sectionPath: '/federal/globalnav/acom/sections/section-menu-help',
    },
  ]);
});

test('parseTopLevelSections falls back to flat fragment links', () => {
  const html = `
    <html><body>
      <a href="/fragments/gnav/products">Products</a>
      <a href="/fragments/gnav/ai">AI</a>
    </body></html>
  `;
  const sections = parseTopLevelSections(html, 'https://main--da-bacom--adobecom.aem.live');
  assert.deepEqual(sections, [
    { heading: 'Products', sectionPath: '/fragments/gnav/products' },
    { heading: 'AI', sectionPath: '/fragments/gnav/ai' },
  ]);
});

test('parseInlineFragmentPaths keeps #_inline links and skips promos', () => {
  const html = `
    <html><body>
      <a href="/federal/globalnav/acom/fragments/cc/cc-column-1#_inline">Column 1</a>
      <a href="/federal/globalnav/acom/fragments/cc/promo-card#_inline">Promo</a>
    </body></html>
  `;
  const inlinePaths = parseInlineFragmentPaths(html, 'https://main--federal--adobecom.aem.live');
  assert.deepEqual(inlinePaths, ['/federal/globalnav/acom/fragments/cc/cc-column-1']);
});

test('extractGnavArtifacts prefixes localized section paths for non-root geos', async () => {
  const requested = [];
  const routes = new Map([
    ['https://main--da-bacom--adobecom.aem.live/es/gnav.plain.html', new Response(`
      <html><body><a href="/fragments/gnav/products">Productos</a></body></html>
    `, { status: 200 })],
    ['https://main--da-bacom--adobecom.aem.live/es/fragments/gnav/products.plain.html', new Response(`
      <html><body><p><a href="/es/products/commerce">Adobe Commerce</a></p></body></html>
    `, { status: 200 })],
  ]);

  const result = await extractGnavArtifacts({
    hostSite: 'da-bacom',
    baseGeo: 'es',
    fetchImpl: async (input) => {
      const url = String(input);
      requested.push(url);
      return routes.get(url) || new Response('missing', { status: 404 });
    },
  });

  assert.equal(result.ok, true);
  assert.ok(requested.includes('https://main--da-bacom--adobecom.aem.live/es/fragments/gnav/products.plain.html'));
  if (result.ok) {
    assert.equal(result.artifacts[1].sourcePath, '/es/fragments/gnav/products');
  }
});

test('buildBaseGeoLinks ignores decorative asset links inside federal nav cards', async () => {
  const gnavDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-gnav-'));

  await fs.writeFile(path.join(gnavDir, 'manifest.json'), JSON.stringify({
    files: [
      {
        file: 'section-menu-cc.html',
        kind: 'section',
        sourceUrl: 'https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-cc.plain.html',
        sourcePath: '/federal/globalnav/acom/sections/section-menu-cc',
        parentFile: 'gnav.html',
        heading: 'Creativity & Design',
      },
    ],
  }), 'utf8');

  await fs.writeFile(path.join(gnavDir, 'section-menu-cc.html'), `
    <div>
      <h5>Shop for</h5>
      <div class="link-group">
        <div>
          <div><a href="/federal/assets/svgs/creative-cloud-40.svg">https://main--federal--adobecom.hlx.page/federal/assets/svgs/creative-cloud-40.svg | Adobe Creative Cloud</a></div>
          <div>
            <p><a href="https://www.adobe.com/creativecloud.html">What is Creative Cloud?</a></p>
          </div>
        </div>
      </div>
    </div>
  `, 'utf8');

  const sections = await buildBaseGeoLinks(gnavDir, {}, 'www.adobe.com');

  assert.deepEqual(sections, [
    {
      heading: 'Creativity & Design',
      groups: [
        {
          subheading: 'Shop for',
          links: [
            {
              title: 'What is Creative Cloud?',
              url: 'https://www.adobe.com/creativecloud.html',
              path: '/creativecloud.html',
              originUrl: 'https://main--federal--adobecom.aem.live/federal/globalnav/acom/sections/section-menu-cc.plain.html',
            },
          ],
        },
      ],
    },
  ]);
});

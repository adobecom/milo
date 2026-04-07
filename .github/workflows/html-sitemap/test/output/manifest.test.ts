import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { writeSubdomainManifests, type SubdomainManifest } from '../../lib/output/manifest.ts';

function sha256(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

async function writeFixture(dir: string, subdomain: string, baseGeo: string, html: string, sitemapJson: unknown): Promise<void> {
  const geoDir = baseGeo ? path.join(dir, subdomain, baseGeo) : path.join(dir, subdomain);
  await fs.mkdir(geoDir, { recursive: true });
  await fs.writeFile(path.join(geoDir, 'sitemap.html'), html, 'utf8');
  await fs.writeFile(path.join(geoDir, 'sitemap.json'), JSON.stringify(sitemapJson), 'utf8');
}

const SITEMAP_DOC = {
  subdomain: 'business',
  baseGeo: '',
  domain: 'business.adobe.com',
  sections: {
    baseGeoLinks: [
      {
        heading: 'Products',
        groups: [
          { subheading: null, links: [{ title: 'A', url: 'https://a.com', path: '/a' }, { title: 'B', url: 'https://b.com', path: '/b' }] },
          { subheading: 'More', links: [{ title: 'C', url: 'https://c.com', path: '/c' }] },
        ],
      },
    ],
    otherSitemapLinks: [
      { geo: 'fr', title: 'France', url: 'https://business.adobe.com/fr/sitemap.html' },
    ],
    extendedGeoLinks: [
      { geo: 'br', title: 'Brazil', links: [{ title: 'X', url: 'https://x.com', path: '/x' }] },
      { geo: 'ca', title: 'Canada', links: [{ title: 'Y', url: 'https://y.com', path: '/y' }, { title: 'Z', url: 'https://z.com', path: '/z' }] },
    ],
  },
};

const HTML_CONTENT = '<body><main>test</main></body>\n';

test('writeSubdomainManifests writes manifest.json and manifest.csv with correct hash and counts', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-manifest-'));

  await writeFixture(tmpDir, 'business', '', HTML_CONTENT, SITEMAP_DOC);

  await writeSubdomainManifests(tmpDir, [
    { subdomain: 'business', baseGeo: '', domain: 'business.adobe.com', deploy: true },
  ]);

  const manifest = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', 'manifest.json'), 'utf8')) as SubdomainManifest;
  assert.equal(manifest.subdomain, 'business');
  assert.equal(manifest.pageCount, 1);
  assert.equal(manifest.pages.length, 1);

  const page = manifest.pages[0];
  assert.equal(page.baseGeo, '');
  assert.equal(page.domain, 'business.adobe.com');
  assert.equal(page.deploy, true);
  assert.equal(page.sha256, sha256(HTML_CONTENT));
  assert.equal(page.baseGeoSectionCount, 1);
  assert.equal(page.baseGeoLinkCount, 3);
  assert.equal(page.otherSitemapLinkCount, 1);
  assert.equal(page.extendedGeoGroupCount, 2);
  assert.equal(page.extendedGeoLinkCount, 3);
  assert.equal(page.totalLinkCount, 7);

  const csv = await fs.readFile(path.join(tmpDir, 'business', 'manifest.csv'), 'utf8');
  const lines = csv.trim().split('\n');
  assert.equal(lines.length, 2);
  assert.match(lines[0], /^baseGeo,domain,deploy,sha256,/);
  assert.ok(lines[1].startsWith(',business.adobe.com,'));
  assert.ok(lines[1].includes(sha256(HTML_CONTENT)));
});

test('writeSubdomainManifests sorts pages by baseGeo', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-manifest-sort-'));

  const frDoc = { ...SITEMAP_DOC, baseGeo: 'fr' };
  await writeFixture(tmpDir, 'business', '', HTML_CONTENT, SITEMAP_DOC);
  await writeFixture(tmpDir, 'business', 'fr', HTML_CONTENT, frDoc);

  await writeSubdomainManifests(tmpDir, [
    { subdomain: 'business', baseGeo: 'fr', domain: 'business.adobe.com', deploy: true },
    { subdomain: 'business', baseGeo: '', domain: 'business.adobe.com', deploy: true },
  ]);

  const manifest = JSON.parse(await fs.readFile(path.join(tmpDir, 'business', 'manifest.json'), 'utf8')) as SubdomainManifest;
  assert.equal(manifest.pageCount, 2);
  assert.equal(manifest.pages[0].baseGeo, '');
  assert.equal(manifest.pages[1].baseGeo, 'fr');

  const csv = await fs.readFile(path.join(tmpDir, 'business', 'manifest.csv'), 'utf8');
  const dataLines = csv.trim().split('\n').slice(1);
  assert.equal(dataLines.length, 2);
  assert.ok(dataLines[0].startsWith(',business'));
  assert.ok(dataLines[1].startsWith('fr,business'));
});

test('writeSubdomainManifests is idempotent for same inputs', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-manifest-idem-'));
  await writeFixture(tmpDir, 'business', '', HTML_CONTENT, SITEMAP_DOC);
  const entries = [{ subdomain: 'business', baseGeo: '', domain: 'business.adobe.com', deploy: true }];

  await writeSubdomainManifests(tmpDir, entries);
  const first = await fs.readFile(path.join(tmpDir, 'business', 'manifest.json'), 'utf8');

  await writeSubdomainManifests(tmpDir, entries);
  const second = await fs.readFile(path.join(tmpDir, 'business', 'manifest.json'), 'utf8');

  assert.equal(first, second);
});

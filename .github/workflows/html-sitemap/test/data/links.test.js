import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { buildExtendedGeoLinks } from '../../lib/data/links.js';

test('buildExtendedGeoLinks dedupes using canonical paths with geo prefixes removed', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-dedupe-'));
  const unit = {
    subdomain: 'www',
    domain: 'www.adobe.com',
    hostSite: 'da-cc',
    extendedSitemap: 'language',
    template: 'da-sitemap.html',
    baseGeo: 'fr',
    language: 'fr',
    extendedGeos: ['be_fr'],
    stage: 'publish',
    queryIndexRows: [],
  };
  const config = {
    raw: {},
    domains: [],
    queryIndexMap: [],
    pageCopy: [],
    siteDomains: {
      'da-cc': 'www.adobe.com',
    },
    geoMap: [
      { subdomain: 'www', baseGeo: 'fr', language: 'fr', extendedGeos: ['be_fr'], stage: 'publish' },
    ],
  };

  await fs.mkdir(path.join(tmpDir, 'www', 'fr', '_extract', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', 'fr', '_extract', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [
      { path: '/fr/products/premiere.html', title: 'Premiere' },
    ],
  }), 'utf8');

  await fs.mkdir(path.join(tmpDir, 'www', 'fr', '_extract', 'extended', 'be_fr', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', 'fr', '_extract', 'extended', 'be_fr', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [
      { path: '/be_fr/products/premiere.html', title: 'Premiere Belgium' },
      { path: '/be_fr/products/firefly.html', title: 'Firefly Belgium' },
    ],
  }), 'utf8');

  const groups = await buildExtendedGeoLinks(tmpDir, config, unit, {});
  assert.equal(groups.length, 1);
  assert.deepEqual(groups[0].links.map((link) => link.path), ['/be_fr/products/firefly.html']);
});

test('buildExtendedGeoLinks uses inventory-aware geo labels', async () => {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'html-sitemap-geo-labels-'));
  const unit = {
    subdomain: 'www',
    domain: 'www.adobe.com',
    hostSite: 'da-cc',
    extendedSitemap: 'language',
    template: 'da-sitemap.html',
    baseGeo: 'fr',
    language: 'fr',
    extendedGeos: ['ca_fr', 'be_fr'],
    stage: 'publish',
    queryIndexRows: [],
  };
  const config = {
    raw: {},
    domains: [],
    queryIndexMap: [],
    pageCopy: [],
    siteDomains: {
      'da-cc': 'www.adobe.com',
    },
    geoMap: [
      { subdomain: 'www', baseGeo: '', language: 'en', extendedGeos: ['ca'], stage: 'publish' },
      { subdomain: 'www', baseGeo: 'fr', language: 'fr', extendedGeos: ['ca_fr', 'be_fr'], stage: 'publish' },
      { subdomain: 'www', baseGeo: 'be_en', language: 'en', extendedGeos: [], stage: 'publish' },
    ],
  };

  await fs.mkdir(path.join(tmpDir, 'www', 'fr', '_extract', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', 'fr', '_extract', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [],
  }), 'utf8');

  await fs.mkdir(path.join(tmpDir, 'www', 'fr', '_extract', 'extended', 'ca_fr', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', 'fr', '_extract', 'extended', 'ca_fr', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [{ path: '/ca_fr/products/firefly.html', title: 'Adobe Firefly FR' }],
  }), 'utf8');

  await fs.mkdir(path.join(tmpDir, 'www', 'fr', '_extract', 'extended', 'be_fr', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', 'fr', '_extract', 'extended', 'be_fr', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [{ path: '/be_fr/products/firefly.html', title: 'Adobe Firefly BE FR' }],
  }), 'utf8');

  const regionLabels = {
    '': 'United States',
    be_en: 'Belgium - English',
    ca_fr: 'Canada - Fran\u00e7ais',
    be_fr: 'Belgique - Fran\u00e7ais',
    vn_vi: 'Vi\u1ec7t Nam - Ti\u1ebfng Vi\u1ec7t',
  };

  const extendedGroups = await buildExtendedGeoLinks(tmpDir, config, unit, regionLabels);
  assert.deepEqual(
    extendedGroups.map((group) => ({ geo: group.geo, title: group.title })),
    [
      { geo: 'ca_fr', title: 'Canada' },
      { geo: 'be_fr', title: 'Belgique' },
    ],
  );

  const singleVariantUnit = {
    ...unit,
    baseGeo: '',
    language: 'en',
    extendedGeos: ['vn_vi'],
  };
  const singleVariantConfig = {
    ...config,
    geoMap: [
      { subdomain: 'www', baseGeo: '', language: 'en', extendedGeos: ['vn_vi'], stage: 'publish' },
    ],
  };

  await fs.mkdir(path.join(tmpDir, 'www', '_extract', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', '_extract', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [],
  }), 'utf8');

  await fs.mkdir(path.join(tmpDir, 'www', '_extract', 'extended', 'vn_vi', 'da-cc'), { recursive: true });
  await fs.writeFile(path.join(tmpDir, 'www', '_extract', 'extended', 'vn_vi', 'da-cc', 'query-index.json'), JSON.stringify({
    data: [{ path: '/vn_vi/products/firefly.html', title: 'Adobe Firefly VN' }],
  }), 'utf8');

  const singleVariantGroups = await buildExtendedGeoLinks(tmpDir, singleVariantConfig, singleVariantUnit, regionLabels);
  assert.deepEqual(
    singleVariantGroups.map((group) => ({ geo: group.geo, title: group.title })),
    [{ geo: 'vn_vi', title: 'Vi\u1ec7t Nam' }],
  );
});

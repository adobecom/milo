import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_DA_TEMPLATE, loadConfig } from '../../lib/config/config.ts';
import { planExtractUnits } from '../../lib/config/scope.ts';

const fixture = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../fixtures/config.json');

test('loadConfig parses required sheets', async () => {
  const config = await loadConfig(fixture);
  assert.equal(config.domains.length, 2);
  assert.equal(config.queryIndexMap.length, 2);
  assert.equal(config.geoMap.length, 4);
  assert.equal(config.pageCopy.length, 4);
  assert.equal(config.siteDomains['da-bacom'], 'business.adobe.com');
  assert.equal(config.siteDomains.edu, 'www.adobe.com');
  assert.equal(config.siteDomains['da-cc'], 'www.adobe.com');
  assert.equal(config.queryIndexMap.some((row) => row.site === 'da-cc'), false);
  assert.equal(config.domains.find((row) => row.subdomain === 'business')?.template, DEFAULT_DA_TEMPLATE);
  assert.equal(config.domains.find((row) => row.subdomain === 'www')?.template, 'da-sitemap.html');
  assert.deepEqual(config.geoMap.find((row) => row.subdomain === 'www' && row.baseGeo === 'fr')?.extendedGeos, ['be_fr', 'ca_fr']);
  assert.equal(
    config.pageCopy.find((row) => row.subdomain === 'business' && row.baseGeo === '')?.otherSitemapsHeading,
    'Other {{regions-label}}',
  );
});

test('loadConfig rejects config sheet missing required fields', async () => {
  const bad = (sheets: Record<string, { data: Record<string, string>[] }>) =>
    loadConfig('https://example.com/config.json', {
      fetchImpl: async () => new Response(JSON.stringify(sheets), { status: 200, headers: { 'content-type': 'application/json' } }),
    });

  await assert.rejects(
    () => bad({
      'config': { data: [{ subdomain: 'www', domain: 'www.adobe.com' }] },
      'query-index-map': { data: [] },
      'geo-map': { data: [] },
      'page-copy': { data: [] },
    }),
    /missing required field "site"/,
  );

  await assert.rejects(
    () => bad({
      'config': { data: [{ subdomain: 'www', domain: 'www.adobe.com', site: 'cc', extendedSitemap: 'all' }] },
      'query-index-map': { data: [{ queryIndexPath: '/q.json' }] },
      'geo-map': { data: [] },
      'page-copy': { data: [] },
    }),
    /missing required field "subdomain" or "domain"/,
  );
});

test('planExtractUnits filters by domain and geo', async () => {
  const config = await loadConfig(fixture);
  const units = planExtractUnits(config, { subdomainFilter: 'www', geoFilter: 'fr' });
  assert.equal(units.length, 1);
  assert.equal(units[0].subdomain, 'www');
  assert.equal(units[0].baseGeo, 'fr');
  assert.equal(units[0].template, 'da-sitemap.html');
  assert.equal(units[0].queryIndexRows.length, 1);
  assert.deepEqual(units[0].queryIndexRows.map((row) => row.site), ['edu']);
});

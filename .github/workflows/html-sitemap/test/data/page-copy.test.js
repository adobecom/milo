import test from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { getPageCopy } from '../../lib/data/page-copy.js';

const baseConfig = {
  raw: {},
  domains: [],
  queryIndexMap: [],
  geoMap: [],
  siteDomains: {},
  regionLabels: {},
  pageCopy: [
    { subdomain: 'www', geo: '', pageTitle: 'Sitemap' },
  ],
};

test('getPageCopy returns defaults and warns when page-copy row is missing', () => {
  const warns = [];
  mock.method(console, 'warn', (msg) => warns.push(msg));

  const copy = getPageCopy(baseConfig, { subdomain: 'www', baseGeo: 'fr', language: 'fr' });

  assert.equal(copy.pageTitle, 'Sitemap');
  assert.ok(warns.some((msg) => msg.includes('No page-copy row') && msg.includes('www/fr')));
  mock.restoreAll();
});

test('getPageCopy resolves placeholders in matched row', () => {
  const config = {
    ...baseConfig,
    pageCopy: [
      { subdomain: 'www', geo: '', pageTitle: '{{title-key}}' },
    ],
  };
  const copy = getPageCopy(config, { subdomain: 'www', baseGeo: '', language: 'en' }, { 'title-key': 'Sitemap' });

  assert.equal(copy.pageTitle, 'Sitemap');
});

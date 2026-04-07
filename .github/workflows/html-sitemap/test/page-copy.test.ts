import test from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { getPageCopy } from '../lib/transform/page-copy.ts';
import type { HtmlSitemapConfig } from '../lib/planning/config.ts';

const baseConfig: HtmlSitemapConfig = {
  raw: {},
  domains: [],
  queryIndexMap: [],
  geoMap: [],
  siteDomains: {},
  pageCopy: [
    { subdomain: 'www', baseGeo: '', pageTitle: 'Sitemap', pageDescription: 'All pages', otherSitemapsHeading: 'Other', extendedPagesHeading: 'More' },
  ],
};

test('getPageCopy returns defaults and warns when page-copy row is missing', () => {
  const warns: string[] = [];
  mock.method(console, 'warn', (msg: string) => warns.push(msg));

  const copy = getPageCopy(baseConfig, { subdomain: 'www', baseGeo: 'fr', language: 'fr' });

  assert.equal(copy.pageTitle, 'Sitemap');
  assert.equal(copy.pageDescription, '');
  assert.equal(copy.otherSitemapsHeading, '');
  assert.equal(copy.extendedPagesHeading, '');
  assert.ok(warns.some((msg) => msg.includes('No page-copy row') && msg.includes('www/fr')));
  mock.restoreAll();
});

test('getPageCopy resolves placeholders in matched row', () => {
  const copy = getPageCopy(baseConfig, { subdomain: 'www', baseGeo: '', language: 'en' }, { region: 'locale' });

  assert.equal(copy.pageTitle, 'Sitemap');
  assert.equal(copy.pageDescription, 'All pages');
});

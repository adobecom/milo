import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanTitle,
  formatGeoLabel,
  formatGeoLabelFromInventory,
  normalizeQueryIndexData,
  toProductionUrl,
} from '../lib/transform/query-index-normalize.ts';

test('normalizeQueryIndexData filters non-indexable rows and falls back title from slug', () => {
  const links = normalizeQueryIndexData({
    data: [
      { path: '/products/adobe-express.html', title: '' },
      { path: '/products/nope', title: 'Hidden', robots: 'noindex, nofollow' },
    ],
  }, 'business.adobe.com');

  assert.deepEqual(links, [{
    title: 'Adobe Express',
    url: 'https://business.adobe.com/products/adobe-express.html',
    path: '/products/adobe-express.html',
  }]);
});

test('normalizeQueryIndexData strips trailing Adobe branding from titles', () => {
  const links = normalizeQueryIndexData({
    data: [
      { path: '/products/premiere.html', title: 'Premiere Pro - Adobe' },
      { path: '/products/firefly.html', title: 'Adobe Firefly | Adobe' },
    ],
  }, 'www.adobe.com');

  assert.deepEqual(links, [
    {
      title: 'Premiere Pro',
      url: 'https://www.adobe.com/products/premiere.html',
      path: '/products/premiere.html',
    },
    {
      title: 'Adobe Firefly',
      url: 'https://www.adobe.com/products/firefly.html',
      path: '/products/firefly.html',
    },
  ]);
});

test('cleanTitle strips trailing Adobe branding from shared title sources', () => {
  assert.equal(cleanTitle('Adobe Express for Education | Adobe'), 'Adobe Express for Education');
  assert.equal(cleanTitle('Premiere Pro - Adobe'), 'Premiere Pro');
});

test('toProductionUrl remaps adobecom AEM hosts to production domains', () => {
  assert.equal(
    toProductionUrl('https://main--da-bacom--adobecom.aem.live/fr/page', 'www.adobe.com', {
      'da-bacom': 'business.adobe.com',
      'da-cc': 'www.adobe.com',
    }),
    'https://business.adobe.com/fr/page',
  );
});

test('formatGeoLabel formats default and compound geos', () => {
  assert.equal(formatGeoLabel(''), 'Global');
  assert.equal(formatGeoLabel('be_fr'), 'Belgium (french)');
});

test('formatGeoLabel returns Global for empty geo', () => {
  assert.equal(formatGeoLabel(''), 'Global');
});

test('formatGeoLabelFromInventory returns Global for empty geo', () => {
  assert.equal(formatGeoLabelFromInventory('', [{ geo: '', language: 'en' }]), 'Global');
});

test('formatGeoLabelFromInventory adds language only when the region has multiple variants', () => {
  const inventory = [
    { geo: '', language: 'en' },
    { geo: 'fr', language: 'fr' },
    { geo: 'ca', language: 'en' },
    { geo: 'ca_fr', language: 'fr' },
    { geo: 'be_en', language: 'en' },
    { geo: 'be_fr', language: 'fr' },
    { geo: 'vn_vi', language: 'vi' },
  ];

  assert.equal(formatGeoLabelFromInventory('fr', inventory), 'France');
  assert.equal(formatGeoLabelFromInventory('ca', inventory), 'Canada (english)');
  assert.equal(formatGeoLabelFromInventory('ca_fr', inventory), 'Canada (french)');
  assert.equal(formatGeoLabelFromInventory('be_en', inventory), 'Belgium (english)');
  assert.equal(formatGeoLabelFromInventory('be_fr', inventory), 'Belgium (french)');
  assert.equal(formatGeoLabelFromInventory('vn_vi', inventory), 'Vietnam');
});

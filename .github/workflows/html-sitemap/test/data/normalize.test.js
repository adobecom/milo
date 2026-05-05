import test from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanTitle,
  normalizeQueryIndexData,
  toProductionUrl,
} from '../../lib/data/normalize.js';
import {
  formatGeoLabel,
  formatGeoLabelFromInventory,
} from '../../lib/data/geo-labels.js';

test('normalizeQueryIndexData filters non-indexable rows and falls back title from slug', () => {
  const links = normalizeQueryIndexData({
    data: [
      { path: '/products/adobe-express.html', title: '' },
      { path: '/products/nope', title: 'Hidden', robots: 'noindex, nofollow' },
    ],
  }, 'business.adobe.com');

  assert.deepEqual(links, [{
    title: 'Adobe Express',
    originalTitle: 'Adobe Express',
    url: 'https://business.adobe.com/products/adobe-express.html',
    path: '/products/adobe-express.html',
  }]);
});

test('normalizeQueryIndexData strips trailing Adobe branding from titles and preserves original', () => {
  const links = normalizeQueryIndexData({
    data: [
      { path: '/products/premiere.html', title: 'Premiere Pro - Adobe' },
      { path: '/products/firefly.html', title: 'Adobe Firefly | Adobe' },
    ],
  }, 'www.adobe.com');

  assert.deepEqual(links, [
    {
      title: 'Premiere Pro',
      originalTitle: 'Premiere Pro - Adobe',
      url: 'https://www.adobe.com/products/premiere.html',
      path: '/products/premiere.html',
    },
    {
      title: 'Adobe Firefly',
      originalTitle: 'Adobe Firefly | Adobe',
      url: 'https://www.adobe.com/products/firefly.html',
      path: '/products/firefly.html',
    },
  ]);
});

test('cleanTitle strips trailing Adobe branding when adobe appears after final delimiter', () => {
  // basic cases - simple Adobe / | Adobe suffix
  assert.equal(cleanTitle('Adobe Express for Education | Adobe'), 'Adobe Express for Education');
  assert.equal(cleanTitle('Premiere Pro - Adobe'), 'Premiere Pro');

  // adobe.com or branded extensions in trailing segment
  assert.equal(cleanTitle('My Page | adobe.com'), 'My Page');
  assert.equal(cleanTitle('Acrobat Pro | Adobe Acrobat'), 'Acrobat Pro');
  assert.equal(cleanTitle('Photoshop - Adobe Creative Cloud'), 'Photoshop');

  // en-dash and em-dash delimiters
  assert.equal(cleanTitle('Solution de vectorisation – Adobe Illustrator'), 'Solution de vectorisation');
  assert.equal(cleanTitle('Innovations IA – Adobe.'), 'Innovations IA');
  assert.equal(cleanTitle('My Page — Adobe Substance 3D'), 'My Page');

  // legitimate subtitles that contain `-` or `|` are preserved when the
  // trailing segment has no `adobe`
  assert.equal(cleanTitle('Acrobat Pro - DC | Adobe'), 'Acrobat Pro - DC');
  assert.equal(cleanTitle('Tutorials - Pro Tips'), 'Tutorials - Pro Tips');

  // hyphens inside words are not treated as delimiters
  assert.equal(cleanTitle('co-creation studio'), 'co-creation studio');
  assert.equal(cleanTitle('JPEG vs PNG : qu’est-ce qui les différencie ?'), 'JPEG vs PNG : qu’est-ce qui les différencie ?');

  // titles without any delimiter are unchanged
  assert.equal(cleanTitle('Adobe Photoshop'), 'Adobe Photoshop');
  assert.equal(cleanTitle('  Photoshop  '), 'Photoshop');

  // localized Adobe-branding suffix
  assert.equal(cleanTitle('Mon site | Adobe France'), 'Mon site');
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

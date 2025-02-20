import { expect } from '@esm-bundle/chai';
import { modifyNonFragmentSelector } from '../../../libs/features/personalization/personalization.js';

const attributeValue = [
  {
    c: 'href',
    b: 'marquee primary-cta href',
    a: '.marquee strong a',
  },
  {
    c: 'href_osi',
    b: 'marquee primary-cta href_osi',
    a: '.marquee strong a',
  },
];

const values = [
  {
    b: 'body > main > div',
    a: 'body > main > div',
  },
  {
    b: 'main header',
    a: 'main header',
  },
  {
    b: 'main footer',
    a: 'main footer',
  },
  {
    b: 'any-marquee action-area',
    a: '[class*="marquee"] *:has(> em a, > strong a)',
  },
  {
    b: 'main section1 marquee action-area',
    a: 'main > div:nth-child(1) .marquee *:has(> em a, > strong a)',
  },
  {
    b: 'main > section1 .marquee h2',
    a: 'main > div:nth-child(1) .marquee h2',
  },
  {
    b: '#some-random-id, section1 marquee row2 col1 p:nth-of-type(2)',
    a: '#some-random-id , main > div:nth-child(1) .marquee > div:nth-child(2) > div:nth-child(1) p:nth-of-type(2)',
  },
  {
    b: 'marquee.light:nth-child(2) h2',
    a: '.marquee.light:nth-child(2) h2',
  },
  {
    b: 'marquee.light:nth-child(2) any-header',
    a: '.marquee.light:nth-child(2) :is(h1, h2, h3, h4, h5, h6)',
  },
  {
    b: 'any-marquee.light:nth-child(2) h2',
    a: '[class*="marquee"].light:nth-child(2) h2',
  },
  {
    b: 'any-marquee:nth-child(2) h2',
    a: '[class*="marquee"]:nth-child(2) h2',
  },
  {
    b: 'section2 text3',
    a: 'main > div:nth-child(2) .text:nth-child(3 of .text)',
  },
  {
    b: 'section2 .text.light strong',
    a: 'main > div:nth-child(2) .text.light strong',
  },
  {
    b: 'section3 table row2 col2 primary-cta',
    a: 'main > div:nth-child(3) .table > div:nth-child(2) > div:nth-child(2) strong a',
  },
  {
    b: 'marquee primary-cta #_href',
    a: '.marquee strong a',
    m: ['href'],
  },
  {
    b: 'marquee primary-cta #_HREF',
    a: '.marquee strong a',
    m: ['href'],
  },
  {
    b: 'marquee primary-cta#_href',
    a: '.marquee strong a#_href',
  },
  {
    b: 'marquee primary-cta #_href_all',
    a: '.marquee strong a',
    m: ['href', 'all'],
  },
  {
    b: 'marquee primary-cta #_href#_all',
    a: '.marquee strong a',
    m: ['href', 'all'],
  },
  {
    b: 'marquee primary-cta #_href #_all',
    a: '.marquee strong a',
    m: ['href', 'all'],
  },
  {
    b: 'section3 table row5 col2',
    a: 'main > div:nth-child(3) .table > div:nth-child(5) > div:nth-child(2)',
  },
  {
    b: 'section3 table row2 col4 secondary-cta',
    a: 'main > div:nth-child(3) .table > div:nth-child(2) > div:nth-child(4) em a',
  },
  {
    b: 'section4 merch-card',
    a: 'main > div:nth-child(4) .merch-card',
  },
  {
    b: 'section5 tabs col2 row2',
    a: 'main > div:nth-child(5) .tabs > div:nth-child(2) > div:nth-child(2)',
  },
  {
    b: 'section8 table row4 col2',
    a: 'main > div:nth-child(8) .table > div:nth-child(4) > div:nth-child(2)',
  },
  {
    b: 'section5',
    a: 'main > div:nth-child(5)',
  },
  {
    b: '.text:has(#im-a-unique-text-block) secondary-cta',
    a: '.text:has(#im-a-unique-text-block) em a',
  },
  {
    b: 'section1 .random-block2',
    a: 'main > div:nth-child(1) .random-block2',
  },
  {
    b: 'main > section30',
    a: 'main > div:nth-child(30)',
  },
  {
    b: 'main>section30',
    a: 'main > div:nth-child(30)',
  },
  {
    b: 'main>div:nth-child(30)',
    a: 'main > div:nth-child(30)',
  },
  {
    b: 'custom-block3',
    a: '.custom-block:nth-child(3 of .custom-block)',
  },
  {
    b: 'any-marquee ol li:nth-child(2)',
    a: '[class*="marquee"] ol li:nth-child(2)',
  },
  {
    b: 'any-marquee ul li:nth-child(2)',
    a: '[class*="marquee"] ul li:nth-child(2)',
  },
  {
    b: 'any-marquee-section',
    a: 'main > div:has([class*="marquee"])',
  },
  {
    b: '.aside03',
    a: '.aside03',
  },
];
describe('test different values', () => {
  values.forEach((value) => {
    it(`should return the expected value for ${value.b}`, () => {
      const { modifiedSelector, modifiers } = modifyNonFragmentSelector(value.b);
      expect(modifiedSelector).to.equal(value.a);
      expect(modifiers).to.deep.equal(value.m || []);
    });
  });
  attributeValue.forEach((value) => {
    it(`should return the expected value for ${value.b} and ${value.c}`, () => {
      const { modifiedSelector, modifiers, attribute } = modifyNonFragmentSelector(value.b, 'updateattribute');
      expect(modifiedSelector).to.equal(value.a);
      expect(modifiers).to.deep.equal(value.m || []);
      expect(attribute).to.equal(value.c);
    });
  });
});

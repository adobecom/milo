import { expect } from '@esm-bundle/chai';
import { injectJsonLd } from '../../../libs/blocks/merch/json-ld.js';

const PAGE_URL = 'https://www.adobe.com/photoshop';
const PAGE_URL_WITH_QUERY = 'https://www.adobe.com/photoshop?foo=bar';

const FIELDS = {
  cardTitle: 'Adobe Photoshop',
  description: { value: '<p>Edit photos effortlessly.</p>' },
  mnemonicIcon: ['https://www.adobe.com/content/dam/cc/icons/photoshop.svg'],
};

// ABM: YEAR commitment, MONTHLY term → P1M billing
const OFFER = {
  priceDetails: { price: 22.99, formatString: "'US$'#,##0.00" },
  commitment: 'YEAR',
  term: 'MONTHLY',
};

const COUNTRY = 'us';

function cleanupScripts() {
  document.head.querySelectorAll('script[type="application/ld+json"]').forEach((s) => s.remove());
}

describe('json-ld', () => {
  afterEach(cleanupScripts);

  describe('injectJsonLd', () => {
    it('injects a <script> tag into document.head', () => {
      const script = injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      expect(script).to.exist;
      expect(script.type).to.equal('application/ld+json');
      expect(document.head.contains(script)).to.be.true;
    });

    it('produces correct JSON-LD structure', () => {
      injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const parsed = JSON.parse(script.textContent);
      expect(parsed['@context']).to.equal('https://schema.org/');
      expect(parsed['@type']).to.equal('Product');
      expect(parsed['@id']).to.equal(`${PAGE_URL}#product`);
      expect(parsed.name).to.equal('Adobe Photoshop');
      expect(parsed.description).to.equal('Edit photos effortlessly.');
      expect(parsed.brand).to.deep.equal({ '@type': 'Brand', name: 'Adobe' });
    });

    it('strips query params from pageUrl', () => {
      injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL_WITH_QUERY);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const parsed = JSON.parse(script.textContent);
      expect(parsed['@id']).to.equal(`${PAGE_URL}#product`);
      expect(parsed.offers[0].url).to.equal(PAGE_URL);
    });

    it('builds the offer correctly (currency from country, billingDuration from commitment+term)', () => {
      injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { offers } = JSON.parse(script.textContent);
      expect(offers).to.have.length(1);
      const offer = offers[0];
      expect(offer['@type']).to.equal('Offer');
      expect(offer['@id']).to.equal(`${PAGE_URL}#offer-us`);
      expect(offer.priceCurrency).to.equal('USD');
      expect(offer.price).to.equal('22.99');
      expect(offer.eligibleRegion).to.equal('US');
      expect(offer.availability).to.equal('https://schema.org/InStock');
      expect(offer.category).to.equal('Subscription');
      expect(offer.seller).to.deep.equal({ '@id': 'https://www.adobe.com/#org' });
      expect(offer.itemOffered).to.deep.equal({ '@id': `${PAGE_URL}#product` });
    });

    it('builds priceSpecification with P1M for YEAR+MONTHLY (ABM)', () => {
      injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { offers } = JSON.parse(script.textContent);
      const { priceSpecification } = offers[0];
      expect(priceSpecification['@type']).to.equal('UnitPriceSpecification');
      expect(priceSpecification.price).to.equal('22.99');
      expect(priceSpecification.priceCurrency).to.equal('USD');
      expect(priceSpecification.billingDuration).to.equal('P1M');
      expect(priceSpecification.billingIncrement).to.equal(1);
    });

    it('uses P1Y for YEAR+ANNUAL (PUF)', () => {
      const offer = {
        priceDetails: { price: 239.99, formatString: "'US$'#,##0.00" },
        commitment: 'YEAR',
        term: 'ANNUAL',
      };
      injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { priceSpecification } = JSON.parse(script.textContent).offers[0];
      expect(priceSpecification.billingDuration).to.equal('P1Y');
    });

    it('uses P1M for MONTH+MONTHLY (M2M)', () => {
      const offer = {
        priceDetails: { price: 29.99, formatString: "'US$'#,##0.00" },
        commitment: 'MONTH',
        term: 'MONTHLY',
      };
      injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { priceSpecification } = JSON.parse(script.textContent).offers[0];
      expect(priceSpecification.billingDuration).to.equal('P1M');
    });

    it('uses P1Y for PERPETUAL', () => {
      const offer = {
        priceDetails: { price: 99.99, formatString: "'US$'#,##0.00" },
        commitment: 'PERPETUAL',
        term: undefined,
      };
      injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { priceSpecification } = JSON.parse(script.textContent).offers[0];
      expect(priceSpecification.billingDuration).to.equal('P1Y');
    });

    it('adds priceWithoutDiscount when regularOffer has a different price', () => {
      const promoOffer = { priceDetails: { price: 19.99 }, commitment: 'YEAR', term: 'MONTHLY' };
      const regularOffer = { priceDetails: { price: 69.99 }, commitment: 'YEAR', term: 'MONTHLY' };
      injectJsonLd(FIELDS, promoOffer, regularOffer, COUNTRY, PAGE_URL);
      const { priceSpecification } = JSON.parse(
        document.head.querySelector('script[type="application/ld+json"]').textContent,
      ).offers[0];
      expect(priceSpecification.price).to.equal('19.99');
      expect(priceSpecification.priceWithoutDiscount).to.equal('69.99');
    });

    it('omits priceWithoutDiscount when regularOffer price equals offer price', () => {
      const regularOffer = { priceDetails: { price: 22.99 }, commitment: 'YEAR', term: 'MONTHLY' };
      injectJsonLd(FIELDS, OFFER, regularOffer, COUNTRY, PAGE_URL);
      const { priceSpecification } = JSON.parse(
        document.head.querySelector('script[type="application/ld+json"]').textContent,
      ).offers[0];
      expect(priceSpecification.priceWithoutDiscount).to.be.undefined;
    });

    it('uses priceWithoutDiscount from offer when regularOffer has same price (same OSI)', () => {
      const offer = { priceDetails: { price: 662.9, priceWithoutDiscount: 779.88 }, commitment: 'YEAR', term: 'ANNUAL' };
      const regularOffer = { priceDetails: { price: 662.9 }, commitment: 'YEAR', term: 'ANNUAL' };
      injectJsonLd(FIELDS, offer, regularOffer, COUNTRY, PAGE_URL);
      const { priceSpecification } = JSON.parse(
        document.head.querySelector('script[type="application/ld+json"]').textContent,
      ).offers[0];
      expect(priceSpecification.price).to.equal('662.9');
      expect(priceSpecification.priceWithoutDiscount).to.equal('779.88');
    });

    it('uses priceWithoutDiscount from offer when no regularOffer (data-display-old-price pattern)', () => {
      const offer = { priceDetails: { price: 34.99, priceWithoutDiscount: 69.99 }, commitment: 'YEAR', term: 'MONTHLY' };
      injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      const { priceSpecification } = JSON.parse(
        document.head.querySelector('script[type="application/ld+json"]').textContent,
      ).offers[0];
      expect(priceSpecification.price).to.equal('34.99');
      expect(priceSpecification.priceWithoutDiscount).to.equal('69.99');
    });

    it('omits priceWithoutDiscount when offer.priceDetails.priceWithoutDiscount equals price', () => {
      const offer = { priceDetails: { price: 22.99, priceWithoutDiscount: 22.99 }, commitment: 'YEAR', term: 'MONTHLY' };
      injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      const { priceSpecification } = JSON.parse(
        document.head.querySelector('script[type="application/ld+json"]').textContent,
      ).offers[0];
      expect(priceSpecification.priceWithoutDiscount).to.be.undefined;
    });

    it('appends png query params to SVG image URL (single icon → string)', () => {
      injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { image } = JSON.parse(script.textContent);
      expect(image).to.equal('https://www.adobe.com/content/dam/cc/icons/photoshop.svg?format=png&width=800&height=800');
    });

    it('returns array for multiple mnemonicIcons', () => {
      const fields = {
        ...FIELDS,
        mnemonicIcon: [
          'https://www.adobe.com/content/dam/cc/icons/photoshop.svg',
          'https://www.adobe.com/content/dam/cc/icons/illustrator.svg',
        ],
      };
      injectJsonLd(fields, OFFER, null, COUNTRY, PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { image } = JSON.parse(script.textContent);
      expect(image).to.be.an('array').with.length(2);
    });

    it('includes price 0 (free tier)', () => {
      const offer = {
        priceDetails: { price: 0, formatString: "'US$'#,##0.00" },
        commitment: 'MONTH',
        term: 'MONTHLY',
      };
      const script = injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      expect(script).to.exist;
      const parsed = JSON.parse(script.textContent);
      expect(parsed.offers[0].price).to.equal('0');
    });

    it('skips offers where price is null', () => {
      const offer = {
        priceDetails: { price: null, formatString: "'US$'#,##0.00" },
        commitment: 'YEAR',
        term: 'MONTHLY',
      };
      const script = injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      expect(script).to.be.null;
    });

    it('skips offers where price is undefined', () => {
      const offer = {
        priceDetails: { formatString: "'US$'#,##0.00" },
        commitment: 'YEAR',
        term: 'MONTHLY',
      };
      const script = injectJsonLd(FIELDS, offer, null, COUNTRY, PAGE_URL);
      expect(script).to.be.null;
    });

    it('returns null for unknown country (no currency mapping)', () => {
      const script = injectJsonLd(FIELDS, OFFER, null, 'xx', PAGE_URL);
      expect(script).to.be.null;
    });

    it('returns null when fields is missing', () => {
      expect(injectJsonLd(null, OFFER, null, COUNTRY, PAGE_URL)).to.be.null;
      expect(injectJsonLd(undefined, OFFER, null, COUNTRY, PAGE_URL)).to.be.null;
    });

    it('returns null when cardTitle is missing', () => {
      const fields = { description: { value: 'text' } };
      expect(injectJsonLd(fields, OFFER, null, COUNTRY, PAGE_URL)).to.be.null;
    });

    it('returns null when offer is missing', () => {
      expect(injectJsonLd(FIELDS, null, null, COUNTRY, PAGE_URL)).to.be.null;
      expect(injectJsonLd(FIELDS, undefined, null, COUNTRY, PAGE_URL)).to.be.null;
    });

    it('returns null when country is missing', () => {
      expect(injectJsonLd(FIELDS, OFFER, null, null, PAGE_URL)).to.be.null;
      expect(injectJsonLd(FIELDS, OFFER, null, undefined, PAGE_URL)).to.be.null;
    });

    it('deduplicates: does not inject twice for the same URL', () => {
      injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      const secondResult = injectJsonLd(FIELDS, OFFER, null, COUNTRY, PAGE_URL);
      expect(secondResult).to.be.null;
      const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).to.equal(1);
    });

    it('normalises country to uppercase in eligibleRegion', () => {
      injectJsonLd(FIELDS, OFFER, null, 'gb', PAGE_URL);
      const script = document.head.querySelector('script[type="application/ld+json"]');
      const { offers } = JSON.parse(script.textContent);
      expect(offers[0].eligibleRegion).to.equal('GB');
      expect(offers[0].priceCurrency).to.equal('GBP');
    });
  });
});

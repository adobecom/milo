import { selectOffers } from '../src/utilities.js';

import { expect } from './utilities.js';

describe('function "selectWcsOffers"', () => {

    it('uses offer prices without taxes if "forceTaxExclusive" is set', () => {
        const offers = selectOffers(
            [
                {
                    priceDetails: {
                        price: 2,
                        priceWithoutTax: 1,
                        priceWithoutDiscount: 3,
                        priceWithoutDiscountAndTax: 4,
                        taxDisplay: 'TAX_INCLUSIVE_DETAILS',
                    },
                },
            ],
            { forceTaxExclusive: true },
        );
        expect(offers[0].priceDetails.price).to.equal(1);
        expect(offers[0].priceDetails.priceWithoutDiscount).to.equal(4);
    });

    it('selects MULT language offer over EN when country is not GB', () => {
        const offers = selectOffers(
            [{ language: 'EN', price: 100 }, { language: 'MULT', price: 100 }],
            { country: 'US' }
        );
        expect(offers[0].language).to.equal('MULT');
    });

    it('selects EN language offer when country is GB', () => {
        const offers = selectOffers(
            [{ language: 'MULT', price: 100 }, { language: 'EN', price: 100 }],
            { country: 'GB' }
        );
        expect(offers[0].language).to.equal('EN');
    });

    it('selects offer without term over offer with term', () => {
        const offers = selectOffers(
            [{ language: 'MULT', price: 100, term: '12' }, { language: 'MULT', price: 100 }],
            { country: 'US' }
        );
        expect(offers[0].term).to.be.undefined;
    });

    it('selects MULT language offer even if it has term when other offer is EN with term', () => {
        const offers = selectOffers(
            [{ language: 'EN', price: 100, term: '12' }, { language: 'MULT', price: 100, term: '12' }],
            { country: 'US' }
        );
        expect(offers[0].language).to.equal('MULT');
        expect(offers[0].term).to.equal('12');
    });

    it('selects offers without term first, then for GB selects EN offers if present', () => {
      const offers = selectOffers(
          [
            { offerId: '1', language: 'MULT', term: '12' }, 
            { offerId: '2', language: 'EN', term: '12' },
            { offerId: '3', language: 'MULT' },
            { offerId: '4', language: 'EN'}],
          { country: 'GB' }
      );
      expect(offers[0].offerId).to.equal('4'); // best match - EN, without term
  });

  it('selects offers without term first, then for GB selects MULT offers if EN offer is not present', () => {
    const offers = selectOffers(
        [
          { offerId: '1', language: 'MULT', term: '12' }, 
          { offerId: '2', language: 'EN', term: '12' },
          { offerId: '3', language: 'MULT' }],
        { country: 'GB' }
    );
    expect(offers[0].offerId).to.equal('3'); // second best match - MULT, without term
});
});

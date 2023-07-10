import Log from '../src/log.js';
import { TAX_INCLUSIVE_DETAILS, Wcs, WcsErrorMessage, selectOffers } from '../src/wcs.js';
import { mockFetch, unmockFetch } from './mocks/fetch.js';

import { expect } from './utils.js';

describe('resolveOfferSelectors', () => {
  after(() => {
    unmockFetch();
  });

  before(async () => {
    await mockFetch();
    // eslint-disable-next-line import/no-named-as-default-member
    Log.use(Log.quietFilter);
  });

  it('falls into fetch-by-one strategy if Wcs responds with 404 to multi-osi request', async () => {
    // @ts-ignore
    const client = Wcs({
      country: 'US',
      language: 'en',
      locale: 'en_US',
    });
    const results = await Promise.allSettled(
      client.resolveOfferSelectors({
        offerSelectorIds: [
          'abm', 'no-offer', 'stock-abm', 'void',
        ],
      }),
    );
    expect(results[0].status).to.equal('fulfilled');
    expect(results[1].status).to.equal('rejected');
    // @ts-ignore
    expect(results[1].reason.message).to.equal(WcsErrorMessage.notFound);
    expect(results[2].status).to.equal('fulfilled');
    expect(results[3].status).to.equal('rejected');
    // @ts-ignore
    expect(results[3].reason.message).to.equal(WcsErrorMessage.notFound);
  });
});

describe('selectOffers', () => {
  it('returns second offer for perpetual if first is MULT', () => {
    const offers = selectOffers(
      // @ts-ignore
      [{ language: 'MULT' }, { language: 'DE' }],
      { perpetual: true },
    );
    expect(offers[0].language).to.equal('DE');
  });

  it('uses without taxes prices for offer if taxExclusive', () => {
    const offers = selectOffers(
      [{
        // @ts-ignore
        priceDetails: {
          price: 2,
          priceWithoutTax: 1,
          priceWithoutDiscount: 3,
          priceWithoutDiscountAndTax: 4,
          taxDisplay: TAX_INCLUSIVE_DETAILS,
        },
      }],
      { taxExclusive: true },
    );
    expect(offers[0].priceDetails.price).to.equal(1);
    expect(offers[0].priceDetails.priceWithoutDiscount).to.equal(4);
  });
});

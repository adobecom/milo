import { ERROR_MESSAGE_OFFER_NOT_FOUND } from '../src/constants.js';
import { Wcs } from '../src/wcs.js';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import { expect } from './utilities.js';

describe('resolveOfferSelectors', () => {
    it('falls into fetch-by-one strategy if Wcs responds with 404 to a multi-osi request', async () => {
        await mockFetch(withWcs);
        // @ts-ignore
        const client = Wcs({
            // @ts-ignore
            settings: {
                country: 'US',
                language: 'en',
                locale: 'en_US',
            },
        });
        const results = await Promise.allSettled(
            client.resolveOfferSelectors({
                wcsOsi: ['abm', 'no-offer', 'stock-abm', 'void'],
            }),
        );
        expect(results[0].status).to.equal('fulfilled');
        expect(results[1].status).to.equal('rejected');
        // @ts-ignore
        expect(results[1].reason.message).to.equal(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
        expect(results[2].status).to.equal('fulfilled');
        expect(results[3].status).to.equal('rejected');
        // @ts-ignore
        expect(results[3].reason.message).to.equal(
            ERROR_MESSAGE_OFFER_NOT_FOUND,
        );
    });

    it('groups WCS requests by promotion code', async () => {
        let fetch = await mockFetch(withWcs);
        const client = Wcs({
            // @ts-ignore
            settings: {
                country: 'US',
                language: 'en',
                locale: 'en_US',
                wcsBufferLimit: 2,
            },
        });
        await Promise.allSettled([
            ...client.resolveOfferSelectors({
                wcsOsi: ['abm', 'm2m'],
            }),
            ...client.resolveOfferSelectors({
                wcsOsi: ['abm', 'm2m'],
            }),
        ]);
        expect(fetch.callCount).to.equal(1);
        await Promise.allSettled([
            ...client.resolveOfferSelectors({
                wcsOsi: ['abm-promo', 'm2m-promo'],
                promotionCode: 'promo1',
            }),
            ...client.resolveOfferSelectors({
                wcsOsi: ['abm-promo', 'm2m-promo'],
                promotionCode: 'promo2',
            }),
        ]);
        expect(fetch.callCount).to.equal(3);
    });
});

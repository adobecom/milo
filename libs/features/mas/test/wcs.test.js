import { Defaults } from '../src/defaults.js';
import { Wcs } from '../src/wcs.js';

import { mockFetch } from './mocks/fetch.js';
import { withWcs } from './mocks/wcs.js';
import { expect } from './utilities.js';

describe('resolveOfferSelectors', () => {
    it('ignores multiple OSIs and loads them one by one', async () => {
        await mockFetch(withWcs);
        const client = Wcs({
            settings: {
                ...Defaults,
                locale: 'en_US',
                wcsBufferLimit: 4,
            },
        });
        const results = await Promise.allSettled(
            client.resolveOfferSelectors({
                wcsOsi: ['abm', 'no-offer', 'stock-abm', 'void'],
            }),
        );
        expect(results[0].status).to.equal('fulfilled');
        expect(results[1].status).to.equal('rejected');
        expect(results[1].reason.message).to.equal('Commerce offer not found');
        const context1 = results[1].reason.context;
        expect(context1).to.have.property('startTime');
        expect(typeof context1.startTime).to.equal('number');
        expect(typeof context1.duration).to.equal('number');
        expect(context1).to.include({
            status: 200,
            statusText: undefined,
            url: 'https://www.adobe.com//web_commerce_artifact?offer_selector_ids=no-offer&country=undefined&locale=undefined_undefined&landscape=PUBLISHED&api_key=wcms-commerce-ims-ro-user-milo&language=MULT',
        });
        expect(results[2].status).to.equal('fulfilled');
        expect(results[3].status).to.equal('rejected');
        expect(results[3].reason.message).to.equal('Bad WCS request');
        const context3 = results[3].reason.context;
        expect(context3).to.have.property('startTime');
        expect(typeof context3.startTime).to.equal('number');
        expect(typeof context3.duration).to.equal('number');
        expect(context3).to.include({
            status: 404,
            url: 'https://www.adobe.com//web_commerce_artifact?offer_selector_ids=void&country=undefined&locale=undefined_undefined&landscape=PUBLISHED&api_key=wcms-commerce-ims-ro-user-milo&language=MULT',
        });
    });

    it('flushes WCS cache', async () => {
        await mockFetch(withWcs);
        const client = Wcs({
            settings: {
                ...Defaults,
                locale: 'en_US',
            },
        });
        await client.resolveOfferSelectors({ wcsOsi: ['abm'] });
        await client.resolveOfferSelectors({ wcsOsi: ['abm'] });
        expect(fetch.callCount).to.equal(1);
        await client.flushWcsCacheInternal();
        await client.resolveOfferSelectors({ wcsOsi: ['abm'] });
        expect(fetch.callCount).to.equal(2);
    });
});

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
        expect(context1).to.have.property('measure');
        expect(typeof context1.measure).to.equal('string');
        expect(/startTime:.+duration:/.test(context1.measure)).to.be.true;
        expect(context1).to.include({
            status: 200,
            statusText: undefined,
            url: 'https://www.adobe.com//web_commerce_artifact?offer_selector_ids=no-offer&country=undefined&locale=undefined_undefined&landscape=PUBLISHED&api_key=wcms-commerce-ims-ro-user-milo&language=MULT',
            serverTiming: 'cdn-cache|desc=MISS|edge|dur=12|origin|dur=427|sis|desc=0|ak_p|desc="1748272635433_390603879_647362112_45054_10750_42_0_219"|dur=1',
        });
        expect(results[2].status).to.equal('fulfilled');
        expect(results[3].status).to.equal('rejected');
        expect(results[3].reason.message).to.equal('Bad WCS request');
        const context3 = results[3].reason.context;
        expect(context3).to.have.property('measure');
        expect(/startTime:.+duration:/.test(context3.measure)).to.be.true;
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

describe('prefillWcsCache', () => {
    it('fills WCS cache with artifacts', async () => {
        await mockFetch(withWcs);
        const client = Wcs({
            settings: {
                ...Defaults,
                locale: 'en_US',
            },
        });
        client.prefillWcsCache({
            prod: {
                "Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ-us-mult":[
                    { "foo": "bar" }
                ],
                "FWEdmk_LYpoGnCR0gQMaS5Rbq9a5vFbVFoNaRT0m7NU-us-mult-nicopromo":[
                    { "baz": "qux" }
                ]
            }
        });

        const [[ offer1 ]] = await Promise.all(await client.resolveOfferSelectors( { country: 'US', language: 'en', wcsOsi: ['Mutn1LYoGojkrcMdCLO7LQlx1FyTHw27ETsfLv0h8DQ'] } ));
        expect(fetch.callCount).to.equal(0);
        expect(offer1).to.deep.equal({ foo: 'bar' , planType: 'Value is not an offer' });
        const [[ offer2 ]] = await Promise.all(client.resolveOfferSelectors( { country: 'US', language: 'en', promotionCode: 'nicopromo', wcsOsi: ['FWEdmk_LYpoGnCR0gQMaS5Rbq9a5vFbVFoNaRT0m7NU'] } ));
        expect(fetch.callCount).to.equal(0);
        expect(offer2).to.deep.equal({ baz: 'qux', planType: 'Value is not an offer' });
    });
});


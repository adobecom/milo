import { Defaults } from '../src/index.js';
import { fetchPriceLiterals } from '../src/literals.js';

import { mockFetch } from './mocks/fetch.js';
import { priceLiteralsURL, withLiterals } from './mocks/literals.js';
import { expect } from './utilities.js';

describe('function "fetchPriceLiterals"', () => {
    beforeEach(async () => {
        await mockFetch(withLiterals);
    });

    it('throws if settings argument does not have `priceLiteralsURL` nor `priceLiteralsPromise` property', async () => {
        // @ts-ignore
        expect(fetchPriceLiterals({})).eventually.be.rejected;
    });

    it('returns literals from promise', async () => {
        const priceLiteralsPromise = new Promise((resolve) =>
            resolve([
                {
                    lang: 'en',
                    recurrenceLabel:
                        '{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}',
                },
            ]),
        );
        // @ts-ignore
        const literals = await fetchPriceLiterals({
            language: 'en',
            priceLiteralsPromise,
        });
        expect(literals.lang).to.equal(Defaults.language);
    });

    it('returns literals for default language if requested does not exist', async () => {
        // @ts-ignore
        const literals = await fetchPriceLiterals({
            language: 'test',
            priceLiteralsURL,
        });
        expect(literals.lang).to.equal(Defaults.language);
    });
});

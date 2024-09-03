import { Defaults } from '../src/index.js';
import { fetchPriceLiterals } from '../src/literals.js';
import { expect } from './utilities.js';

describe('function "fetchPriceLiterals"', () => {
    it('returns literals', async () => {
        // @ts-ignore
        const literals = fetchPriceLiterals({
            language: 'en',
        });
        expect(literals.lang).to.equal(Defaults.language);
    });

    it('returns literals for default language if requested does not exist', async () => {
        // @ts-ignore
        const literals = fetchPriceLiterals({
            language: 'test',
        });
        expect(literals.lang).to.equal(Defaults.language);
    });
});

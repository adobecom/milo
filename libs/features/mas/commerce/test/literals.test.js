import { Defaults } from '../src/index.js';
import { getPriceLiterals } from '../src/literals.js';
import { expect } from './utilities.js';
import { readFile } from '@web/test-runner-commands';

describe('function "getPriceLiterals"', () => {
    it('returns literals', async () => {
        const priceLiterals = await (readFile({ path: '../price-literals.json' }));
        // @ts-ignore
        const literals = await getPriceLiterals({
            language: 'en',
        }, JSON.parse(priceLiterals));
        expect(literals.lang).to.equal(Defaults.language);
    });

    it('returns literals for default language if requested does not exist', async () => {
      const priceLiterals = await (readFile({ path: '../price-literals.json' }));
        // @ts-ignore
        const literals = await getPriceLiterals({
            language: 'test',
        }, JSON.parse(priceLiterals));
        expect(literals.lang).to.equal(Defaults.language);
    });
});

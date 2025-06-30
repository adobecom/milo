import { Defaults } from '../src/defaults.js';
import { expect } from './utilities.js';
import { getPriceLiterals } from '../src/literals.js';

describe('function "getPriceLiterals"', () => {
    it('returns literals', async () => {
        const literals = await getPriceLiterals({
            language: 'en',
        });
        expect(literals.lang).to.equal(Defaults.language);
    });

    it('returns literals for default language if requested does not exist', async () => {
        const literals = await getPriceLiterals({
            language: 'test',
        });
        expect(literals.lang).to.equal(Defaults.language);
    });

    it('returns "price literals" object', async () => {
        const literals = await getPriceLiterals({
            language: 'en',
        });
        [
            'alternativePriceAriaLabel',
            'freeAriaLabel',
            'freeLabel',
            'perUnitAriaLabel',
            'perUnitLabel',
            'recurrenceAriaLabel',
            'recurrenceLabel',
            'strikethroughAriaLabel',
            'taxExclusiveLabel',
            'taxInclusiveLabel',
        ].forEach((key) => {
            const literal = literals[key];
            expect(literal).to.be.string;
            expect(literal).to.not.be.empty;
        });
    });
});

import { Defaults } from './defaults.js';
import { equalsCaseInsensitive } from './external.js';
import priceLiterals from './price-literals.js';

/**
 * @param {Commerce.Price.Settings} settings
 * @returns {Record<string, string>}
 */
export function fetchPriceLiterals(settings) {
    //we are expecting an array of objects with lang and literals
    const { data } = priceLiterals;
    if (Array.isArray(data)) {
        const find = (language) =>
            data.find((candidate) =>
                equalsCaseInsensitive(candidate.lang, language),
            );
        const literals = find(settings.language) ?? find(Defaults.language);
        if (literals) return Object.freeze(literals);
    }
    return {};
}

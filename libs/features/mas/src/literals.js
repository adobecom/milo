import { Defaults } from './defaults.js';
import { equalsCaseInsensitive } from '@dexter/tacocat-core';

const priceLiterals = window.masPriceLiterals;

/**
 * Method resolves price literals for the given language from the group of price literals.
 * That group is either imported from json file or it is received as a parameter (in case of unit tests).
 *
 * @param settings
 * @param priceLiterals
 */
export function getPriceLiterals(settings) {
    //we are expecting an array of objects with lang and literals
    if (Array.isArray(priceLiterals)) {
        const find = (language) =>
            priceLiterals.find((candidate) =>
                equalsCaseInsensitive(candidate.lang, language),
            );
        const literals = find(settings.language) ?? find(Defaults.language);
        if (literals) return Object.freeze(literals);
    }
    return {};
}

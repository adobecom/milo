import { Defaults } from './defaults.js';
import { equalsCaseInsensitive } from './external.js';

/**
 * Method resolves price literals for the given language from the group of price literals.
 * That group is either imported from json file or it is received as a parameter (in case of unit tests).
 *
 * @param {Commerce.Price.Settings} settings
 * @param priceLiterals
 * @returns {Promise<Record<string, string>>}
 */
export async function getPriceLiterals(settings, priceLiterals) {
    return {};
}

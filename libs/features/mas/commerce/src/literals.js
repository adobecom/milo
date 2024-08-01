import { ERROR_MESSAGE_MISSING_LITERALS_URL } from './constants.js';
import { Defaults } from './defaults.js';
import { equalsCaseInsensitive } from './external.js';

function generateLiteralsPromise(settings) {
    if (!settings.priceLiteralsURL) {
        throw new Error(ERROR_MESSAGE_MISSING_LITERALS_URL);
    }
    return new Promise((resolve) => {
        window.fetch(settings.priceLiteralsURL).then((response) => {
            response.json().then(({ data }) => {
                resolve(data);
            });
        });
    });
}

/**
 * @param {Commerce.Price.Settings} settings
 * @returns {Promise<Record<string, string>>}
 */
export async function fetchPriceLiterals(settings) {
    const priceLiteralsPromise =
        settings.priceLiteralsPromise || generateLiteralsPromise(settings);
    //we are expecting an array of objects with lang and literals
    const data = await priceLiteralsPromise;
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

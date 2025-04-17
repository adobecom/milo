import {
    forceTaxExclusivePrice,
    isNotEmptyString,
    isPositiveFiniteNumber,
    toPositiveFiniteInteger,
} from '@dexter/tacocat-core';

const MAS_COMMERCE_SERVICE = 'mas-commerce-service';

/**
 * @param {Offer[]} offers
 * @param {Commerce.Options} options
 * @returns {Offer[]}
 */
export function selectOffers(
    offers,
    { country, forceTaxExclusive, perpetual },
) {
    let selected;
    if (offers.length < 2) selected = offers;
    else {
        const language = country === 'GB' || perpetual ? 'EN' : 'MULT';
        const [first, second] = offers;
        selected = [first.language === language ? first : second];
    }
    if (forceTaxExclusive) {
        selected = selected.map(forceTaxExclusivePrice);
    }
    return selected;
}

export const setImmediate = (getConfig) => window.setTimeout(getConfig);

/**
 * @param {any} value
 * @param {number} defaultValue
 * @returns {number[]}
 */
export function toQuantity(value, defaultValue = 1) {
    if (value == null) return [defaultValue];
    let quantity = (Array.isArray(value) ? value : String(value).split(','))
        .map(toPositiveFiniteInteger)
        .filter(isPositiveFiniteNumber);
    if (!quantity.length) quantity = [defaultValue];
    return quantity;
}

/**
 * @param {any} value
 * @returns {string[]}
 */
export function toOfferSelectorIds(value) {
    if (value == null) return [];
    const ids = Array.isArray(value) ? value : String(value).split(',');
    return ids.filter(isNotEmptyString);
}

/**
 * For internal use only.
 * This function expects an active instance of commerce service
 * to exist in the current DOM.
 * If commerce service has not been yet activated or was resetted, `null`.
 * @returns 
 */
export function getService() {
    return document.getElementsByTagName(MAS_COMMERCE_SERVICE)?.[0];
}

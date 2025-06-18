import {
    forceTaxExclusivePrice,
    isNotEmptyString,
    isPositiveFiniteNumber,
    toPositiveFiniteInteger,
} from '@dexter/tacocat-core';
import { HEADER_X_REQUEST_ID } from './constants';

const MAS_COMMERCE_SERVICE = 'mas-commerce-service';

export const FETCH_INFO_HEADERS = {
    requestId: HEADER_X_REQUEST_ID,
    etag: 'Etag',
    lastModified: 'Last-Modified',
    serverTiming: 'server-timing',
};

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
        const language = country === 'GB' ? 'EN' : 'MULT';
        // sort offers by language, so that preferred language is selected first
        offers.sort((a, b) => a.language === language ? -1 : b.language === language ? 1 : 0);
        // sort offers, first should be offers that don't have 'term' field
        offers.sort((a, b) => a.term ? 1 : b.term ? -1 : 0);
        selected = [offers[0]];
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

/**
 * Returns headers to be logged
 * @param {Response} response - fetch response
 * @returns {Object}
 */
export function getLogHeaders(response) {
    const logHeaders = {};
    if (!response?.headers) return logHeaders;
    const headers = response.headers;
    for (const [key, value] of Object.entries(FETCH_INFO_HEADERS)) {
        let headerValue = headers.get(value);
        if (headerValue) {
            headerValue = headerValue.replace(/[,;]/g, '|');
            headerValue = headerValue.replace(/[| ]+/g, '|');
            logHeaders[key] = headerValue;
        }
    }
    return logHeaders;
}

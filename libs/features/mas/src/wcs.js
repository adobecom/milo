import {
    ERROR_MESSAGE_BAD_REQUEST,
    ERROR_MESSAGE_OFFER_NOT_FOUND,
    MARK_DURATION_SUFFIX,
    MARK_START_SUFFIX,
    Env,
    Commitment,
    Term,
} from './constants.js';

import { PlanType, applyPlanType } from '@dexter/tacocat-core';
import { Log } from './log.js';
import { MasError } from './mas-error.js';
import { masFetch } from './utils/mas-fetch.js';
import { getService } from './utilities.js';
import { printMeasure } from './utils.js';

const NAMESPACE = 'wcs';

/**
 * @typedef {Object} Offer
 * @property {string} offerType - The type of offer (e.g. 'BASE')
 * @property {string} offerId - Unique identifier for the offer
 * @property {string} productArrangementCode - Code identifying the product arrangement
 * @property {string} pricePoint - The price point identifier
 * @property {string} customerSegment - The customer segment this offer targets
 * @property {string} commitment - The commitment period (e.g. 'YEAR')
 * @property {string} term - The billing term (e.g. 'MONTHLY')
 * @property {string[]} offerSelectorIds - Array of offer selector IDs
 * @property {Object} priceDetails - Details about the price
 * @property {number} priceDetails.price - The price value
 * @property {string} priceDetails.formatString - Format string for price display
 * @property {string} [language] - The language code for the offer
 * @property {PlanType} [planType] - The plan type for the offer (applied by applyPlanType)
 */

/**
 * @typedef {Object} Settings
 * @property {string} env - The environment (e.g. 'STAGE', 'PROD')
 * @property {string} wcsApiKey - The WCS API key
 * @property {string} wcsURL - The WCS API URL
 * @property {string} landscape - The landscape setting
 */

/**
 * @typedef {Object} Client
 * @property {Commitment} Commitment - Commitment constants
 * @property {PlanType} PlanType - Plan type constants
 * @property {Term} Term - Term constants
 * @property {Function} resolveOfferSelectors - Function to resolve offer selectors
 * @property {Function} flushWcsCacheInternal - Function to flush WCS cache
 */

/**
 * @typedef {Map<string, {
 *  resolve: (offers: Offer[]) => void,
 *  reject: (reason: Error) => void
 * }>} WcsPromises
 */

/**
 * @typedef {Object} Options
 * @property {string} country - The country code
 * @property {string} language - The language code
 * @property {string} [locale] - The locale code (e.g. 'en_US')
 * @property {string[]} [offerSelectorIds] - Array of offer selector IDs
 * @property {string[]} [wcsOsi=[]] - Array of offer selector IDs (alias for offerSelectorIds)
 * @property {boolean} [perpetual=false] - Whether to use perpetual offers
 * @property {string} [promotionCode=''] - The promotion code
 * @property {string} [currency] - The currency code
 */

/**
 * Creates a new WCS client instance
 * @param {Object} params - The parameters for creating the WCS client
 * @param {Settings} params.settings - The settings for the WCS client
 * @returns {Client} A new WCS client instance
 */
export function Wcs({ settings }) {
    const log = Log.module(NAMESPACE);
    const { env, wcsApiKey: apiKey } = settings;
    /**
     * Cache of promises resolving to arrays of Wcs offers grouped by osi-based keys.
     * @type {Map<string, Promise<Offer[]>>}
     */
    const cache = new Map();
    /**
     * Queue of pending requests to Wcs grouped by locale and promo.
     * @type {Map<string, { options: Options, promises: WcsPromises }>}
     */
    const queue = new Map();
    let timer;
    /**
     * Stale cache to keep items in for fallback
     * @type {Map<string, Promise<Offer[]>>}
     */
    let staleCache = new Map();

    /**
     * Accepts list of OSIs having same locale and map of pending promises, grouped by OSI.
     * Sends one or more requests to WCS endpoint to provide required offers.
     * Resolves each pending promise with array of provided offers.
     * @param {Options} options - The options for resolving offers
     * @param {WcsPromises} promises - Map of promises to resolve
     * @param {boolean} [reject=true] - Whether to reject promises for missing offers
     * @returns {Promise<void>}
     * @throws {MasError} When WCS does not provide an offer for a particular OSI (if reject=true)
     * @throws {MasError} In case of any WCS/Network error (if reject=true)
     */
    async function resolveWcsOffers(options, promises, reject = true) {
        const service = getService();
        let message = ERROR_MESSAGE_OFFER_NOT_FOUND;
        log.debug('Fetching:', options);
        let url = '';
        let response;
        if (options.offerSelectorIds.length > 1)
            throw new Error('Multiple OSIs are not supported anymore');

        // Create a map of unresolved promises to track which ones need fallback
        const unresolvedPromises = new Map(promises);

        const [osi] = options.offerSelectorIds;
        const uniqueId =
            Date.now() + Math.random().toString(36).substring(2, 7);
        const startMark = `${NAMESPACE}:${osi}:${uniqueId}${MARK_START_SUFFIX}`;
        const measureName = `${NAMESPACE}:${osi}:${uniqueId}${MARK_DURATION_SUFFIX}`;
        let measure;
        try {
            performance.mark(startMark);
            url = new URL(settings.wcsURL);
            url.searchParams.set('offer_selector_ids', osi);
            url.searchParams.set('country', options.country);
            url.searchParams.set('locale', options.locale);
            url.searchParams.set(
                'landscape',
                env === Env.STAGE ? 'ALL' : settings.landscape,
            );
            url.searchParams.set('api_key', apiKey);
            // language can be undefined if its a UK offer
            if (options.language) {
                url.searchParams.set('language', options.language);
            }
            if (options.promotionCode) {
                url.searchParams.set('promotion_code', options.promotionCode);
            }
            /* c8 ignore next 3 */
            if (options.currency) {
                url.searchParams.set('currency', options.currency);
            }
            response = await masFetch(url.toString(), {
                credentials: 'omit',
            });
            if (response.ok) {
                let offers = [];
                try {
                    const data = await response.json();
                    log.debug('Fetched:', options, data);
                    offers = data.resolvedOffers ?? [];
                } catch (e) {
                    log.error(`Error parsing JSON: ${e.message}`, {
                        ...e.context,
                        ...service?.duration,
                    });
                }
                offers = offers.map(applyPlanType);
                // resolve all promises that have offers
                promises.forEach(({ resolve }, offerSelectorId) => {
                    // select offers with current OSI
                    const resolved = offers
                        .filter(({ offerSelectorIds }) =>
                            offerSelectorIds.includes(offerSelectorId),
                        )
                        .flat();
                    // resolve current promise if at least 1 offer is present
                    if (resolved.length) {
                        unresolvedPromises.delete(offerSelectorId);
                        promises.delete(offerSelectorId);
                        resolve(resolved);
                    }
                });
            } else {
                message = ERROR_MESSAGE_BAD_REQUEST;
            }
        } catch (e) {
            /* c8 ignore next 2 */
            message = `Network error: ${e.message}`;
        } finally {
            (measure = performance.measure(
                measureName,
                startMark,
            ));
            // Clean up marks
            performance.clearMarks(startMark);
            performance.clearMeasures(measureName);
        }

        if (reject && promises.size) {
            // reject pending promises, their offers weren't provided by WCS
            log.debug('Missing:', { offerSelectorIds: [...promises.keys()] });

            const headers = {
                requestId: response.headers.get('X-Request-Id'),
                etag: response.headers.get('Etag'),
                lastModified: response.headers.get('Last-Modified'),
                serverTiming: response.headers.get('server-timing'),
            };

            promises.forEach((promise) => {
                promise.reject(
                    new MasError(message, {
                        ...options,
                        // ...headers, TODO enable this once access-control-expose-headers is fixed
                        response,
                        measure: printMeasure(measure),
                        ...service?.duration,
                    }),
                );
            });
        }
    }

    /**
     * Trigger resolution of all accumulated promises by requesting their associated OSIs.
     * Clears the timer and processes all pending requests in the queue.
     * @returns {void}
     */
    function flushQueue() {
        clearTimeout(timer);
        const pending = [...queue.values()];
        queue.clear();
        pending.forEach(({ options, promises }) =>
            resolveWcsOffers(options, promises),
        );
    }

    /**
     * Flushes cache but keeps items in stale cache for fallback
     * Used for cache invalidation while maintaining fallback capability
     * @returns {void}
     */
    function flushWcsCacheInternal() {
        const size = cache.size;
        // Store current cache as stale cache instead of clearing it
        staleCache = new Map(cache);
        cache.clear();
        log.debug(`Moved ${size} cache entries to stale cache`);
    }

    /**
     * Resolves requested list of "Offer Selector Ids" (`osis`) from WCS or local cache.
     * Returns one promise per OSI, the promise resolves to array of product offers
     * associated with this OSI.
     *
     * @param {Options} params - The parameters for resolving offer selectors
     * @param {string} params.country - The country code
     * @param {string} params.language - The language code
     * @param {boolean} [params.perpetual=false] - Whether to use perpetual offers
     * @param {string} [params.promotionCode=''] - The promotion code
     * @param {string[]} [params.wcsOsi=[]] - Array of offer selector IDs
     * @returns {Promise<Offer[]>[]} Array of promises resolving to arrays of offers
     * @throws {MasError} When WCS does not provide an offer for a particular OSI
     * @throws {MasError} In case of any WCS/Network error
     */
    function resolveOfferSelectors({
        country,
        language,
        perpetual = false,
        promotionCode = '',
        wcsOsi = [],
    }) {
        const locale = `${language}_${country}`;
        if (country !== 'GB') language = perpetual ? 'EN' : 'MULT';
        const groupKey = [country, language, promotionCode]
            .filter((val) => val)
            .join('-')
            .toLowerCase();

        return wcsOsi.map((osi) => {
            const cacheKey = `${osi}-${groupKey}`;
            if (cache.has(cacheKey)) {
                return cache.get(cacheKey);
            }
            const promiseWithFallback = new Promise((resolve, reject) => {
                let group = queue.get(groupKey);
                if (!group) {
                    const options = {
                        country,
                        locale,
                        offerSelectorIds: [],
                    };
                    if (country !== 'GB') options.language = language;
                    const promises = new Map();
                    group = { options, promises };
                    queue.set(groupKey, group);
                }
                if (promotionCode) {
                    group.options.promotionCode = promotionCode;
                }
                group.options.offerSelectorIds.push(osi);
                group.promises.set(osi, {
                    resolve,
                    reject,
                });
                flushQueue();
            }).catch((error) => {
                if (staleCache.has(cacheKey)) {
                    return staleCache.get(cacheKey);
                }
                throw error;
            });

            cache.set(cacheKey, promiseWithFallback);
            return promiseWithFallback;
        });
    }

    return {
        Commitment,
        PlanType,
        Term,
        applyPlanType,
        resolveOfferSelectors,
        flushWcsCacheInternal,
    };
}

export { applyPlanType };

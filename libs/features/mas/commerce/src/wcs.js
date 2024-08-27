import {
    ERROR_MESSAGE_BAD_REQUEST,
    ERROR_MESSAGE_OFFER_NOT_FOUND,
} from './constants.js';
import {
    Env,
    WcsCommitment,
    WcsPlanType,
    WcsTerm,
    applyPlanType,
    webCommerceArtifact,
} from './external.js';
import { Log } from './log.js';

/** @typedef {import('@pandora/data-source-wcs').GetWebCommerceArtifactOptions} WcsOptions */
/** @typedef {import('@pandora/data-source-wcs').getWebCommerceArtifactPromise} getWcsOffers */
/**
 * @typedef {Map<string, {
 *  resolve: (offers: Commerce.Wcs.Offer[]) => void,
 *  reject: (reason: Error) => void
 * }>} WcsPromises
 */
const ACOM = '_acom';
const WcsBaseUrl = {
    [Env.PRODUCTION]: 'https://www.adobe.com',
    [Env.STAGE]: 'https://www.stage.adobe.com',
    [Env.PRODUCTION + ACOM]: 'https://www.adobe.com',
    [Env.STAGE + ACOM]: 'https://www.stage.adobe.com',
};

/**
 * @param {{ settings: Commerce.Wcs.Settings }} params
 * @returns {Commerce.Wcs.Client}
 */
export function Wcs({ settings }) {
    const log = Log.module('wcs');
    const { env, domainSwitch, wcsApiKey: apiKey } = settings;
    const baseUrl = domainSwitch ? WcsBaseUrl[env + ACOM] : WcsBaseUrl[env];
    // Create @pandora Wcs client.
    const fetchOptions = {
        apiKey,
        baseUrl,
        fetch: window.fetch.bind(window),
    };
    const getWcsOffers = webCommerceArtifact(fetchOptions);

    /**
     * Cache of promises resolving to arrays of Wcs offers grouped by osi-based keys.
     * @type {Map<string, Promise<Commerce.Wcs.Offer[]>>}
     */
    const cache = new Map();
    /**
     * Queue of pending requests to Wcs grouped by locale and promo.
     * @type {Map<string, { options: WcsOptions, promises: WcsPromises }>}
     */
    const queue = new Map();
    let timer;

    /**
     * Accepts list of OSIs having same locale and map of pending promises, grouped by OSI.
     * Sends one or more requests to WCS endpoint to provide required offers.
     * Resolves each pending promise with array of provided offers.
     * If WCS does not provide an offer for particular osi,
     * its pending promise will be rejected with "not found".
     * In case of any other Wcs/Network error, promises are rejected with "bad request".
     * @param {WcsOptions} options
     * @param {WcsPromises} promises
     * @param reject - used for recursion, prevents rejection of promises with missing offers
     */
    async function resolveWcsOffers(options, promises, reject = true) {
        let message = ERROR_MESSAGE_OFFER_NOT_FOUND;
        try {
            log.debug('Fetching:', options);
            options.offerSelectorIds = options.offerSelectorIds.sort();
            const { data } = await getWcsOffers(
                options,
                {
                    apiKey,
                    environment: settings.wcsEnv,
                    // @ts-ignore
                    landscape: env === Env.STAGE ? 'ALL' : settings.landscape,
                },
                ({ resolvedOffers }) => ({
                    offers: resolvedOffers.map(applyPlanType),
                }),
            );
            log.debug('Fetched:', options, data);
            const { offers } = data ?? {};
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
                    promises.delete(offerSelectorId);
                    resolve(resolved);
                }
            });
        } catch (error) {
            // in case of 404 WCS error caused by a request with multiple osis,
            // fallback to `fetch-by-one` strategy
            if (error.status === 404 && options.offerSelectorIds.length > 1) {
                log.debug('Multi-osi 404, fallback to fetch-by-one strategy');
                await Promise.allSettled(
                    options.offerSelectorIds.map((offerSelectorId) =>
                        resolveWcsOffers(
                            { ...options, offerSelectorIds: [offerSelectorId] },
                            promises,
                            false, // do not reject promises for missing offers, this will be done below
                        ),
                    ),
                );
            } else {
                log.error('Failed:', options, error);
                message = ERROR_MESSAGE_BAD_REQUEST;
            }
        }

        if (reject && promises.size) {
            // reject pending promises, their offers weren't provided by WCS
            log.debug('Missing:', { offerSelectorIds: [...promises.keys()] });
            promises.forEach((promise) => {
                promise.reject(new Error(message));
            });
        }
    }

    /**
     * Trigger resolution of all accumulated promises by requesting their associated OSIs.
     */
    function flushQueue() {
        clearTimeout(timer);
        const pending = [...queue.values()];
        queue.clear();
        pending.forEach(({ options, promises }) =>
            resolveWcsOffers(options, promises),
        );
    }

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
            if (!cache.has(cacheKey)) {
                const promise = new Promise((resolve, reject) => {
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
                    if (
                        group.options.offerSelectorIds.length >=
                        settings.wcsBufferLimit
                    ) {
                        flushQueue();
                    } else {
                        log.debug('Queued:', group.options);
                        if (!timer) {
                            timer = setTimeout(
                                flushQueue,
                                settings.wcsBufferDelay,
                            );
                        }
                    }
                });
                cache.set(cacheKey, promise);
            }
            return cache.get(cacheKey);
        });
    }

    return {
        WcsCommitment,
        WcsPlanType,
        WcsTerm,
        resolveOfferSelectors,
    };
}

import { Term, Commitment } from '@pandora/data-models-odm';
import { webCommerceArtifact } from '@pandora/data-source-wcs';

import { Env } from './deps.js';
import Log from './log.js';

/** @typedef {import('@pandora/data-source-wcs').GetWebCommerceArtifactOptions} WcsOptions */
/** @typedef {import('@pandora/data-source-wcs').getWebCommerceArtifactPromise} getWcsOffers */
/**
 * @typedef {Map<string, {
 *  resolve: (offers: Commerce.Wcs.Offer[]) => void,
 *  reject: (reason: Error) => void
 * }>} WcsPromises
 */

export const COUNTRY_GB = 'GB';
export const LANGUAGE_EN = 'EN';
export const LANGUAGE_MULT = 'MULT';
export const TAX_INCLUSIVE_DETAILS = 'TAX_INCLUSIVE_DETAILS';
export const TAX_EXCLUSIVE = 'TAX_EXCLUSIVE';

const BaseUrl = {
  [Env.PRODUCTION]: 'https://wcs.adobe.com',
  [Env.STAGE]: 'https://wcs.stage.adobe.com',
};

const ErrorMessage = {
  badRequest: 'Bad Wcs request',
  notFound: 'Wcs offer not found',
};

/** @type {Record<Commerce.Wcs.PlanType, Commerce.Wcs.PlanType>} */
const PlanType = {
  ABM: 'ABM',
  PUF: 'PUF',
  M2M: 'M2M',
  PERPETUAL: 'PERPETUAL',
};

/** @type {[Commerce.Wcs.PlanType, Commitment, Term?][]} */
const planTypesMap = [
  [PlanType.ABM, Commitment.YEAR, Term.MONTHLY],
  [PlanType.PUF, Commitment.YEAR, Term.ANNUAL],
  [PlanType.M2M, Commitment.MONTH, Term.MONTHLY],
  [PlanType.PERPETUAL, Commitment.PERPETUAL],
];

/**
 * @param {Omit<Commerce.Wcs.Offer, 'planType'>} offer
 * @returns {Commerce.Wcs.Offer}
 */
const applyPlanType = (offer) => ({
  planType: planTypesMap.find(([, commitment, term]) => (
    commitment === offer.commitment && (!term || term === offer.term)
  ))[0],
  ...offer,
});

/**
 * @param {Commerce.Wcs.Offer[]} offers
 * @param {{
 *  country: string;
 *  multiple: boolean;
 *  perpetual: boolean;
 *  taxExclusive: boolean;
 * }} conditions
 * @returns {Commerce.Wcs.Offer[]}
 */
function selectOffers(offers, {
  country,
  perpetual,
  multiple,
  taxExclusive,
}) {
  let selected;

  if (multiple || offers.length === 1) selected = offers;
  else {
    const [first, second] = offers;
    const { language } = first;
    selected = [
      // eslint-disable-next-line no-nested-ternary
      country === COUNTRY_GB || perpetual
        ? (language === LANGUAGE_EN) ? first : second
        : (language === LANGUAGE_MULT) ? first : second,
    ];
  }

  if (taxExclusive) {
    selected = selected.map((offer) => {
      const { priceDetails } = offer;
      if (priceDetails.taxDisplay !== TAX_INCLUSIVE_DETAILS) return offer;
      const {
        price, priceWithoutDiscount,
        // TODO: update @pandora typings to include these two
        // @ts-ignore
        priceWithoutTax, priceWithoutDiscountAndTax,
      } = priceDetails;
      return {
        ...offer,
        priceDetails: {
          ...offer.priceDetails,
          price: priceWithoutTax ?? price,
          priceWithoutDiscount: priceWithoutDiscountAndTax ?? priceWithoutDiscount,
          taxDisplay: TAX_EXCLUSIVE,
        },
      };
    });
  }

  return selected;
}

/**
 * @param {Commerce.Wcs.Settings} settings
 * @returns {Commerce.Wcs.Client}
 */
function Wcs(settings) {
  const log = Log.commerce.module('wcs');
  const { env, wcsApiKey: apiKey } = settings;

  // Create @pandora Wcs client.
  const fetchOptions = {
    apiKey,
    baseUrl: BaseUrl[env],
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
   * Performs one request to Wcs and settles all pending promises if `settle` is true.
   * Pending promises are grouped by osi.
   * If Wcs does not provide an offer having particular osi,
   * its pending promise will be rejected with "not found".
   * In case of any other Wcs/Network error, promises are rejected with "bad request".
   * @param {WcsOptions} options
   * @param {WcsPromises} promises
   */
  async function resolveWcsOffers(options, promises, settle = true) {
    let message = ErrorMessage.notFound;
    try {
      log.debug('Fetching:', options);
      options.offerSelectorIds = options.offerSelectorIds.sort();
      const { wcsEnv, wcsLandscape } = settings;
      const { data } = await getWcsOffers(
        options,
        { apiKey, environment: wcsEnv, landscape: wcsLandscape },
        ({ resolvedOffers }) => ({ offers: resolvedOffers.map(applyPlanType) }),
      );

      log.debug('Fetched:', options, data);
      const { offers } = data ?? {};
      // resolve all promises which obtained offers
      promises.forEach(({ resolve }, offerSelectorId) => {
        const resolved = offers
          .filter(({ offerSelectorIds }) => offerSelectorIds.includes(offerSelectorId))
          .flat();
        if (resolved.length) {
          promises.delete(offerSelectorId);
          resolve(resolved);
        }
      });
    } catch (error) {
      // in case of 404 Wcs error and for a request with multiple osis,
      // fallback to `fetch-by-one` strategy
      if (error.status === 404 && options.offerSelectorIds.length > 1) {
        log.debug('Multi-osi 404, fallback to fetch-by-one strategy');
        await Promise.allSettled(
          options.offerSelectorIds.map(
            (offerSelectorId) => resolveWcsOffers(
              { ...options, offerSelectorIds: [offerSelectorId] },
              promises,
              false, // do not missied promises, it will be done below
            ),
          ),
        );
      } else {
        log.error('Failed:', options, error);
        message = ErrorMessage.badRequest;
      }
    }

    if (settle && promises.size) {
      // reject pending promises, their offers weren't provided by Wcs
      log.debug('Missing:', { offerSelectorIds: [...promises.keys()] });
      promises.forEach(({ reject }) => { reject(new Error(message)); });
    }
  }

  /**
   * Process Wcs requests queue.
   * Wach Wcs request can contain array of osis having same locale and promo.
   */
  function flushQueue() {
    clearTimeout(timer);
    const pending = [...queue.values()];
    queue.clear();
    pending.forEach(({ options, promises }) => resolveWcsOffers(options, promises));
  }

  return {
    resolveOfferSelectors({
      perpetual = false,
      multiple = false,
      offerSelectorIds = [],
      promotionCode,
      taxExclusive = settings.wcsForceTaxExclusive,
    }) {
      const { country, locale } = settings;
      // eslint-disable-next-line no-nested-ternary
      const language = country === 'GB'
        ? undefined
        : (perpetual ? 'EN' : 'MULT');

      const groupKey = [country, language, promotionCode]
        .filter((val) => val)
        .join('-')
        .toLowerCase();

      return offerSelectorIds.map((offerSelectorId) => {
        const cacheKey = `${offerSelectorId}-${groupKey}`;

        if (!cache.has(cacheKey)) {
          cache.set(cacheKey, new Promise((resolve, reject) => {
            let group = queue.get(groupKey);
            if (!group) {
              group = {
                options: {
                  country,
                  language,
                  locale,
                  offerSelectorIds: [],
                },
                promises: new Map(),
              };
              queue.set(groupKey, group);
            }
            if (promotionCode) group.options.promotionCode = promotionCode;
            group.options.offerSelectorIds.push(offerSelectorId);
            group.promises.set(offerSelectorId, { resolve, reject });
            if (group.options.offerSelectorIds.length >= settings.wcsBufferLimit) {
              flushQueue();
            } else {
              log.debug('Queued:', group.options);
              if (!timer) timer = setTimeout(flushQueue, settings.wcsBufferDelay);
            }
          }));
        }

        const promise = cache.get(cacheKey).then((offers) => selectOffers(offers, {
          country,
          perpetual,
          multiple,
          taxExclusive,
        }));

        return promise;
      });
    },
  };
}

export default Wcs;
export {
  BaseUrl as WcsBaseUrl,
  ErrorMessage as WcsErrorMessage,
  PlanType as WcsPlanType,
  Commitment as WcsCommitment,
  Term as WcsTerm,
  Wcs,
  selectOffers,
};

import { ProviderEnvironment } from '@pandora/data-source-utils';
import { webCommerceArtifact } from '@pandora/data-source-wcs';

import Log from './log.js';

const TAX_INCLUSIVE_DETAILS = 'TAX_INCLUSIVE_DETAILS';
const TAX_EXCLUSIVE = 'TAX_EXCLUSIVE';

/**
 * Updates the offer price and priceWithoutDiscount from tax exclusive prices.
 * @param {*} offer
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export
export function forceTaxExclusivePrice(offer) {
  const { priceDetails } = offer;
  const { price, priceWithoutTax, priceWithoutDiscountAndTax, taxDisplay } = priceDetails;

  if (taxDisplay !== TAX_INCLUSIVE_DETAILS) {
    return;
  }

  priceDetails.price = priceWithoutTax ?? price;
  priceDetails.priceWithoutDiscount = priceWithoutDiscountAndTax
    ?? priceDetails.priceWithoutDiscount;
  priceDetails.taxDisplay = TAX_EXCLUSIVE;
}

/**
 *  Find a single offer among a pair of offers at max, based on the following rules.
 *  - whether the country is GB
 *  - whether the OSI corresponds to a perpetual offer
 * @param {*} offers, array of resolved offers.
 * Usually the response of WCS for an OSI with or without language parameter.
 * @param {*} country
 * @param {*} isPerpetual whether the OSI corresponds to a perpetual offer
 * @returns a single offer
 */
export function getSingleOffer(offers, country, isPerpetual) {
  if (!Array.isArray(offers)) return undefined;
  const [first, second] = offers;
  if (!second) return first;
  if (country === 'GB' || isPerpetual) {
    return first.language === 'EN' ? first : second;
  }
  return first.language === 'MULT' ? first : second;
}

function debounceAndBuffer(fn, delay, bufferSize) {
  let timeoutId;
  let buffer = [];

  function flushBuffer() {
    const currentBuffer = buffer.slice();
    buffer = [];
    fn(currentBuffer);
  }

  return function (...args) {
    buffer.push(args);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (buffer.length >= bufferSize) {
      flushBuffer();
    } else if (args.length > 0) {
      timeoutId = setTimeout(flushBuffer, delay);
    }
  };
}

function partitionArray(arr, callback) {
  const partitions = {};

  for (let i = 0; i < arr.length; i++) {
    const keys = callback(arr[i]);

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];

      if (!partitions[key]) {
        partitions[key] = [];
      }

      partitions[key].push(arr[i]);
    }
  }

  return partitions;
}

/**
 * @param {Commerce.Wcs.Settings} settings
 * @returns {Commerce.Wcs.Client}
 */
export default function Wcs(settings) {
  const log = Log.commerce.module('wcs');

  const {
    env,
    wcsApiKey: apiKey,
    wcsEnv: environment,
    wcsLandscape: landscape,
  } = settings;
  const fetchOptions = {
    apiKey,
    baseUrl: env === ProviderEnvironment.PRODUCTION
      ? 'https://wcs.adobe.com'
      : 'https://wcs.stage.adobe.com',
    env,
    fetch: window.fetch.bind(window),
  };
  const queryOptions = { apiKey, environment, landscape };

  const offerCache = new Map();
  const pendingCache = new Map();
  const getWebCommerceArtifact = webCommerceArtifact(fetchOptions);
  const loadPendings = debounceAndBuffer(
    (pendings) => {
      const calls = [...pendings].reduce((acc, [current]) => {
        let item = acc.get(current.cacheBase);
        if (!item) {
          item = acc.set(current.cacheBase, current.params);
        } else {
          item.offerSelectorIds.push(
            current.params.offerSelectorIds[0],
          );
        }
        return acc;
      }, new Map());
      calls.forEach((callParams, cacheBase) => {
        const { taxExclusive } = callParams;
        delete callParams.taxExclusive;
        callParams.offerSelectorIds = callParams.offerSelectorIds.sort();
        log.debug('Fetching:', callParams);
        const promise = getWebCommerceArtifact(callParams, queryOptions)
          .then(({ data }) => {
            log.debug('Fetched:', data);
            if (data?.resolvedOffers.length === 0) {
              throw new Error('Offer not found');
            }
            if (taxExclusive) {
              data.resolvedOffers.forEach((offer) => {
                forceTaxExclusivePrice(offer);
              });
            }
            const resolvedOffers = partitionArray(
              data.resolvedOffers,
              ({ offerSelectorIds }) => offerSelectorIds,
            );
            callParams.offerSelectorIds.forEach((osi) => {
              const cacheKey = `${osi}-${cacheBase}`;
              if (pendingCache.has(cacheKey)) {
                const { reject, resolve } = pendingCache.get(cacheKey);
                pendingCache.delete(cacheKey);
                const offers = resolvedOffers[osi];
                if (offers) {
                  resolve(callParams.singleOffer
                    ? [getSingleOffer(offers, callParams.country, callParams.isPerpetual)]
                    : offers);
                } else {
                  reject(new Error('Offer not found'));
                }
              }
            });
          })
          .catch((e) => {
            log.error('Failed:', e);
            callParams.offerSelectorIds.forEach((osi) => {
              const cacheKey = `${osi}-${cacheBase}`;
              if (cacheKey) {
                const { osi, reject } = pendingCache.get(cacheKey);
                if (osi) {
                  pendingCache.delete(cacheKey);
                  reject(e);
                }
              }
            });
          });
        return promise;
      });
    },
    settings.wcsDebounceDelay,
    settings.wcsOfferSelectorLimit,
  );

  const resolveOfferSelector = ({
    osi,
    promotionCode,
    isPerpetual,
    singleOffer = true,
    taxExclusive = settings.wcsForceTaxExclusive,
  }) => {
    const { country, locale } = settings;
    const language = country === 'GB' ? undefined : isPerpetual ? 'EN' : 'MULT';

    const cacheBase = `
      ${country}-${language}${promotionCode ? `-${promotionCode}` : ''}${taxExclusive ? '' : '-tax'}
    `.trim();

    const cacheKey = `${osi}-${cacheBase}`;

    if (offerCache.has(cacheKey)) {
      return offerCache.get(cacheKey);
    }

    const params = {
      country,
      isPerpetual,
      locale,
      offerSelectorIds: [osi],
      singleOffer,
      taxExclusive,
    };

    if (language) {
      params.language = language;
    }
    if (promotionCode) {
      params.promotionCode = promotionCode;
    }

    const resolvePromise = new Promise((resolve, reject) => {
      pendingCache.set(cacheKey, { osi, resolve, reject });
      loadPendings({ params, cacheBase });
    });

    offerCache.set(cacheKey, resolvePromise);
    return resolvePromise;
  };

  log.debug('Initialised');
  return { resolveOfferSelector };
}

import { ProviderEnvironment } from '@pandora/data-source-utils';
import { webCommerceArtifact } from '@pandora/data-source-wcs';

import Log from './log.js';
import { forceTaxExclusivePrice } from './utils.js';

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

/** @type {Commerce.Wcs.getClient} */
export default function getWcsClient(settings) {
  const log = Log.commerce.module('wcs');

  const {
    env,
    wcsApiKey: apiKey,
    wcsEnvironment: environment,
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
            if (data?.resolvedOffers.length === 0) { throw new Error('Offer not found'); }
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
              if (cacheKey) {
                const { osi, resolve } = pendingCache.get(cacheKey);
                if (osi) {
                  pendingCache.delete(cacheKey);
                  resolve(resolvedOffers[osi]);
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
      offerSelectorIds: [osi],
      country,
      locale,
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

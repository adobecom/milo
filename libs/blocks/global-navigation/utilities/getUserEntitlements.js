/* eslint-disable camelcase */
import { getConfig } from '../../../utils/utils.js';

const API_WAIT_TIMEOUT = 10000;
const entitlements = {};

const getAcceptLanguage = (locale) => {
  let languages = [];
  if (!locale || Object.keys(locale).length === 0) {
    return languages;
  }

  languages = [
    `${locale.language}-${locale.country.toUpperCase()}`,
    `${locale.language};q=0.9`,
    'en;q=0.8',
  ];
  return languages;
};

const getQueryParameters = (params) => {
  let result = '';
  const query = [];
  if (Array.isArray(params) && params.length) {
    params.forEach((parameter = {}) => {
      const { name, value } = parameter;
      if (typeof name === 'string' && name.length) {
        query.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
      }
    });

    if (query.length) {
      result = `?${query.join('&')}`;
    }
  }

  return result;
};

const emptyEntitlements = {
  clouds: {},
  arrangment_codes: {},
  fulfilled_codes: {},
  offer_families: {},
  list: { fulfilled_codes: [] },
};
const CREATIVE_CLOUD = 'creative_cloud';
const DOCUMENT_CLOUD = 'document_cloud';
const EXPERIENCE_CLOUD = 'experience_cloud';

/**
 * Breaks JIL offers(subscriptions) into easily addressable flat data structure.
 * @param {*} offers
 */
const mapSubscriptionCodes = (offers) => {
  if (!Array.isArray(offers)) {
    return emptyEntitlements;
  }

  const {
    clouds,
    arrangment_codes,
    fulfilled_codes,
    offer_families,
    list,
  } = emptyEntitlements;

  offers.forEach(({ fulfilled_items, offer = {} }) => {
    const cloud = offer.product_arrangement?.cloud;
    clouds[CREATIVE_CLOUD] = clouds[CREATIVE_CLOUD] || cloud === 'CREATIVE';
    clouds[DOCUMENT_CLOUD] = clouds[DOCUMENT_CLOUD] || cloud === 'DOCUMENT';
    clouds[EXPERIENCE_CLOUD] = clouds[EXPERIENCE_CLOUD] || cloud === 'EXPERIENCE';

    const family = offer.product_arrangement?.family;
    if (family) {
      offer_families[family.toLowerCase()] = true;
    }

    if (offer.product_arrangement_code) {
      arrangment_codes[offer.product_arrangement_code] = true;
    }

    if (Array.isArray(fulfilled_items)) {
      fulfilled_items.forEach(({ code }) => {
        if (code) {
          fulfilled_codes[code] = true;
          // Avoid duplicates
          if (list.fulfilled_codes.indexOf(code) === -1) {
            list.fulfilled_codes.push(code);
          }
        }
      });
    }
  });

  return {
    clouds,
    arrangment_codes,
    fulfilled_codes,
    offer_families,
    list,
  };
};

const getSubscriptions = async ({ queryParams, locale }) => {
  const profile = await window.adobeIMS.getProfile();
  const apiUrl = getConfig().env.name === 'prod'
    ? `https://www.adobe.com/aos-api/users/${profile.userId}/subscriptions`
    : `https://www.stage.adobe.com/aos-api/users/${profile.userId}/subscriptions`;
  const res = await window
    .fetch(`${apiUrl}${queryParams}`, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'same-origin',
      signal: AbortSignal.timeout(API_WAIT_TIMEOUT),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.adobeIMS.getAccessToken().token}`,
        'X-Api-Key': window.adobeIMS.adobeIdData.client_id,
        Accept: 'application/json',
        'Accept-Language': getAcceptLanguage(locale).join(','),
      },
    })
    .then((response) => (response.status === 200 ? response.json() : emptyEntitlements));
  return res;
};

/**
 * @description Return the JIL User Entitlements
 * @param {object} object required params
 * @param {array} object.params array of name value query parameters [{name: 'Q', value: 'PARAM'}]
 * @param {object} object.locale {country: 'CH', language: 'de'}
 * @param {string} object.format format function, raw or default
 * @returns {object} JIL Entitlements
 */
const getUserEntitlements = async ({ params, locale, format } = {}) => {
  if (!window.adobeIMS?.isSignedInUser()) return Promise.resolve(emptyEntitlements);

  const queryParams = getQueryParameters(params);
  if (entitlements[queryParams]) {
    return format === 'raw'
      ? entitlements[queryParams]
      : entitlements[queryParams]
        .then((res) => mapSubscriptionCodes(res))
        .catch(() => emptyEntitlements);
  }

  entitlements[queryParams] = entitlements[queryParams]
   || new Promise((resolve) => {
     // TODO we might need to format data for analytics
     getSubscriptions({ queryParams, locale })
       .then((data) => resolve(data))
       .catch(() => resolve(emptyEntitlements));
   });

  return format === 'raw'
    ? entitlements[queryParams]
    : entitlements[queryParams]
      .then((res) => mapSubscriptionCodes(res))
      .catch(() => emptyEntitlements);
};

export default getUserEntitlements;

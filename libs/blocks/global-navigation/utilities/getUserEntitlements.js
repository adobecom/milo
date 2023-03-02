import { getConfig } from '../../../utils/utils.js';

const API_WAIT_TIMEOUT = '10000';
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
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.adobeIMS.getAccessToken().token}`,
        'X-Api-Key': window.adobeIMS.adobeIdData.client_id,
        Accept: 'application/json',
        'Accept-Language': getAcceptLanguage(locale).join(','),
      },
    })
    .then((response) => (response.status === 200 ? response.json() : null));
  return res;
};

/**
 * @description Return the JIL User Entitlements
 * @param {object} object required params
 * @param {array} object.params array of name value query parameters [{name: 'Q', value: 'PARAM'}]
 * @param {object} object.locale {country: 'CH', language: 'de'}
 * @returns {object} JIL Entitlements
 */
const getUserEntitlements = async ({ params, locale } = {}) => {
  if (!window.adobeIMS?.isSignedInUser()) {
    return new Promise((resolve, reject) => {
      reject(new Error('User not signed in'));
    });
  }
  const queryParams = getQueryParameters(params);
  if (entitlements[queryParams]) return entitlements[queryParams];

  let resolve;
  let reject;
  entitlements[queryParams] = entitlements[queryParams]
    || new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
  setTimeout(() => reject('Subscriptions API Call timeout'), API_WAIT_TIMEOUT);
  // TODO we might need to format data for analytics
  const data = await getSubscriptions({ queryParams, locale });
  if (data) resolve(data);
  reject('No response from the aos-api');
  return entitlements[queryParams];
};

export default getUserEntitlements;

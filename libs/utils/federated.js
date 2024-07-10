import { getConfig } from './utils.js';

let federatedContentRoot;
/* eslint-disable import/prefer-default-export */
export const getFederatedContentRoot = () => {
  const cdnWhitelistedOrigins = [
    'https://www.adobe.com',
    'https://business.adobe.com',
    'https://blog.adobe.com',
    'https://milo.adobe.com',
    'https://news.adobe.com',
  ];
  const { allowedOrigins = [] } = getConfig();
  if (federatedContentRoot) return federatedContentRoot;

  const { origin } = window.location;

  federatedContentRoot = [...allowedOrigins, ...cdnWhitelistedOrigins].some((o) => origin.replace('.stage', '') === o)
    ? origin
    : 'https://www.adobe.com';

  if (origin.includes('localhost') || origin.includes('.hlx.')) {
    // Akamai as proxy to avoid 401s, given AEM-EDS MS auth cross project limitations
    federatedContentRoot = origin.includes('.hlx.live')
      ? 'https://main--federal--adobecom.hlx.live'
      : 'https://www.stage.adobe.com';
  }

  return federatedContentRoot;
};

import { getConfig } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from './personalization.js';

const getFederatedContentRoot = (config, origin) => {
  const allowedOrigins = [
    'https://www.adobe.com',
    'https://business.adobe.com',
    'https://blog.adobe.com',
    'https://milo.adobe.com',
    'https://news.adobe.com',
  ];
  let federatedContentRoot = allowedOrigins.some((o) => origin.replace('.stage', '') === o)
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

export const getEntitlementDataUrl = (config, origin) => {
  const { env, mep } = config;
  if (mep?.entitlementDataUrl) return mep.entitlementDataUrl;
  const sheet = env.name === 'prod' ? 'prod' : 'stage';
  const federatedContentRoot = getFederatedContentRoot(origin);

  return `${federatedContentRoot}/federal/assets/data/mep-entitlement-tags.json?sheet=${sheet}`;
};

export const getEntitlementMap = async () => {
  const config = getConfig();
  if (config.mep?.entitlementMap) return config.mep.entitlementMap;
  const entitlementUrl = getEntitlementDataUrl(config, window.location.origin);
  const fetchedData = await fetchData(entitlementUrl, DATA_TYPE.JSON);
  if (!fetchedData) return config.consumerEntitlements || {};
  const entitlements = {};
  fetchedData?.data?.forEach((ent) => {
    const { id, tagname } = ent;
    entitlements[id] = tagname;
  });
  config.mep ??= {};
  config.mep.entitlementMap = { ...config.consumerEntitlements, ...entitlements };
  return config.mep.entitlementMap;
};

export default async function init(data) {
  const entitlementMap = await getEntitlementMap();

  return data.flatMap((destination) => {
    const ents = destination.segments?.flatMap((segment) => {
      const entMatch = entitlementMap[segment.id];
      return entMatch ? [entMatch] : [];
    });

    return ents || [];
  });
}

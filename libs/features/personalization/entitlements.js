import { getConfig } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from './personalization.js';

export const getFederatedContentRoot = () => {
  const allowedOrigins = [
    'https://www.adobe.com',
    'https://business.adobe.com',
    'https://blog.adobe.com',
    'https://milo.adobe.com',
    'https://news.adobe.com',
  ];
  const { origin } = window.location;
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

export const getEntitlementUrl = () => {
  const { env } = getConfig();
  const sheet = env.name === 'prod' ? 'prod' : 'stage';
  // eslint-disable-next-line max-len
  return `${getFederatedContentRoot()}/federal/assets/data/mep-entitlement-tags.json?sheet=${sheet}`;
};

export const getEntitlementMap = async () => {
  const { consumerEntitlements } = getConfig();
  const fetchedData = await fetchData(getEntitlementUrl(), DATA_TYPE.JSON);
  if (!fetchedData) return consumerEntitlements || {};
  const entitlements = {};
  fetchedData?.data?.forEach((ent) => {
    const { id, tagname } = ent;
    entitlements[id] = tagname;
  });
  return { ...consumerEntitlements, ...entitlements };
};

const getEntitlements = async (data) => {
  const entitlementMap = await getEntitlementMap();

  return data.flatMap((destination) => {
    const ents = destination.segments?.flatMap((segment) => {
      const entMatch = entitlementMap[segment.id];
      return entMatch ? [entMatch] : [];
    });

    return ents || [];
  });
};

export default function init(data) {
  return getEntitlements(data);
}

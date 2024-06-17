import { getConfig } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from './personalization.js';

export const getEntitlementUrl = () => {
  const { env } = getConfig();
  const sheet = env.name === 'prod' ? 'prod' : 'stage';
  const origin = env.name === 'prod' ? '' : 'stage.';
  // eslint-disable-next-line max-len
  return `https://www.${origin}adobe.com/federal/assets/data/mep-entitlement-tags.json?sheet=${sheet}`;
};

export const getEntitlementMap = async () => {
  const { consumerEntitlements } = getConfig();
  const fetchedData = await fetchData(getEntitlementUrl(), DATA_TYPE.JSON);
  if (!fetchedData) return consumerEntitlements;
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

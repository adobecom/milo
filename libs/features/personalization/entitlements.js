import { getConfig } from '../../utils/utils.js';
import { fetchData, DATA_TYPE } from './personalization.js';

export const getEntitlementMap = async () => {
  const { env, consumerEntitlements, base } = getConfig();
  const dataFile = `${base.replace('libs', 'docs')}/library/entitlement-tags.json?sheet=tags`;
  const fetchedData = await fetchData(dataFile, DATA_TYPE.JSON);
  if (!fetchedData) return consumerEntitlements;
  const entitlements = {};
  const { data } = fetchedData;
  data.forEach((ent) => {
    const { id, stageid, tagname } = ent;
    entitlements[env?.name === 'prod' ? id : stageid] = tagname;
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

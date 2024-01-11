import { getConfig } from '../../utils/utils.js';

export const ENTITLEMENT_MAP = {
  '8ba78b22-90fb-4b97-a1c4-f8c03a45cbc2': 'indesign',
  '51b1f617-2e43-4e91-a98a-3b7716ecba8f': 'photoshop',
  'fd30e9c7-9ae9-44db-8e70-5c652a5bb1d2': 'cc-all-apps',
  '8d3c8ac2-2937-486b-b6ff-37f02271b09b': 'illustrator',
};

const getEntitlements = (data) => {
  const { entitlements = {} } = getConfig();
  const entitlementMap = { ...entitlements, ...ENTITLEMENT_MAP };

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

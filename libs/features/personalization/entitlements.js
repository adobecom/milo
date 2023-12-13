import { getConfig } from '../../utils/utils.js';

export const ENTITLEMENT_MAP = {
  '9565ef55-faad-430b-b661-596ba7a036c4': 'all-apps',
  'c8d50cc2-491e-48df-a1b0-1509f0ca7323': 'photoshop',
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

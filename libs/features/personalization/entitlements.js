import { getConfig } from '../../utils/utils.js';

export const ENTITLEMENT_MAP = {
  '9565ef55-faad-430b-b661-596ba7a036c4': 'all-apps',
  'c8d50cc2-491e-48df-a1b0-1509f0ca7323': 'photoshop',
  'fd30e9c7-9ae9-44db-8e70-5c652a5bb1d2': 'cc-all-apps',
};

let entitlementsResolve;

const entitlementsPromise = new Promise((resolve) => {
  entitlementsResolve = resolve;
});

const parseEntitlements = (data) => {
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

export function getEntitlementsPromise() {
  return entitlementsPromise;
}

export function setEntitlements(data) {
  const entitlements = parseEntitlements(data);
  entitlementsResolve(entitlements);
}

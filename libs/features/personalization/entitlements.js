export const ENTITLEMENT_MAP = {
  '9565ef55-faad-430b-b661-596ba7a036c4': 'all-apps',
  'c8d50cc2-491e-48df-a1b0-1509f0ca7323': 'photoshop',
};

const getEntitlements = (data) => data.flatMap((destination) => {
  const entitlements = destination.segments?.flatMap((segment) => {
    const entMatch = ENTITLEMENT_MAP[segment.id];
    return entMatch ? [entMatch] : [];
  });

  return entitlements || [];
});

export default function init(data) {
  return getEntitlements(data);
}

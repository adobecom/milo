export const ENTITLEMENT_MAP = {
  '9565ef55-faad-430b-b661-596ba7a036c4': 'all apps',
  'c8d50cc2-491e-48df-a1b0-1509f0ca7323': 'photoshop',
};

const getEntitlements = (data) => data.reduce((acc, destination) => {
  const { segments } = destination;
  const entitlements = segments.map((segment) => ENTITLEMENT_MAP[segment.id]);
  return [...acc, ...entitlements];
}, []);

export default function init(data) {
  return getEntitlements(data);
}

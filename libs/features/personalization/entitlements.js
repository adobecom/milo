import { getConfig } from '../../utils/utils.js';

const ENTITLEMENT_MAP = {
  '51b1f617-2e43-4e91-a98a-3b7716ecba8f': 'photoshop-any',
  '8ba78b22-90fb-4b97-a1c4-f8c03a45cbc2': 'indesign-any',
  '8d3c8ac2-2937-486b-b6ff-37f02271b09b': 'illustrator-any',
  'fd30e9c7-9ae9-44db-8e70-5c652a5bb1d2': 'cc-all-apps-any',
  '4e2f2a6e-48c4-49eb-9dd5-c44070abb3f0': 'after-effects-any',
  'e7650448-268b-4a0d-9795-05f604d7e42f': 'lightroom-any',
  '619130fc-c7b5-4b39-a687-b32061326869': 'premiere-pro-any',
  'cec4d899-4b41-469e-9f2d-4658689abf29': 'phsp-ltr-bundle',
  '8da44606-9841-43d0-af72-86d5a9d3bba0': 'cc-photo',
  'ab713720-91a2-4e8e-b6d7-6f613e049566': 'any-cc-product-no-stock',
  'b0f65e1c-7737-4788-b3ae-0011c80bcbe1': 'any-cc-product-with-stock',
  '934fdc1d-7ba6-4644-908b-53e01e550086': 'any-dc-product',
  '6dfcb769-324f-42e0-9e12-1fc4dc0ee85b': 'always-on-promo',
  '015c52cb-30b0-4ac9-b02e-f8716b39bfb6': 'not-q-always-on-promo',
  '42e06851-64cd-4684-a54a-13777403487a': '3d-substance-collection',
  'eda8c774-420b-44c2-9006-f9a8d0fb5168': '3d-substance-texturing',
  '76e408f6-ab08-49f0-adb6-f9b4efcc205d': 'cc-free',
  '08216aa4-4a0f-4136-8b27-182212764a7c': 'dc-free',
  // PEP segments
  '6cb0d58c-3a65-47e2-b459-c52bb158d5b6': 'lightroom-web-usage',
  'caa3de84-6336-4fa8-8db2-240fc88106cc': 'photoshop-signup-source',
  'ef82408e-1bab-4518-b655-a88981515d6b': 'photoshop-web-usage',
  '5c6a4bb8-a2f3-4202-8cca-f5e918b969dc': 'firefly-signup-source',
  '20106303-e88c-4b15-93e5-f6a1c3215a12': 'firefly-web-usage',
  '3df0b0b0-d06e-4fcc-986e-cc97f54d04d8': 'acrobat-web-usage',
};

export const getEntitlementMap = async () => {
  const { env, consumerEntitlements } = getConfig();
  if (env?.name === 'prod') return { ...consumerEntitlements, ...ENTITLEMENT_MAP };
  const { default: STAGE_ENTITLEMENTS } = await import('./stage-entitlements.js');
  return { ...consumerEntitlements, ...STAGE_ENTITLEMENTS };
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

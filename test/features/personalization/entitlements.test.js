import { expect } from '@esm-bundle/chai';
import { getConfig } from '../../../libs/utils/utils.js';
import getEntitlements from '../../../libs/features/personalization/entitlements.js';

describe('entitlements', () => {
  it('Should return any entitlements that match the id', async () => {
    const config = getConfig();
    config.env = { name: 'prod' };

    const destinations = [
      {
        segments: [
          {
            id: '11111111-aaaa-bbbb-6666-cccccccccccc',
            namespace: 'ups',
          },
          {
            id: 'e7650448-268b-4a0d-9795-05f604d7e42f',
            namespace: 'ups',
          },
          {
            id: '8da44606-9841-43d0-af72-86d5a9d3bba0',
            namespace: 'ups',
          },
        ],
      },
    ];

    const expectedEntitlements = ['lightroom-any', 'cc-photo'];
    const entitlements = await getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should return any stage entitlements that match the id', async () => {
    const config = getConfig();
    config.env = { name: 'stage' };

    const destinations = [
      {
        segments: [
          {
            id: '09bc4ba3-ebed-4d05-812d-a1fb1a7e82ae',
            namespace: 'ups',
          },
          {
            id: '11111111-aaaa-bbbb-6666-cccccccccccc',
            namespace: 'ups',
          },
          {
            id: '73c3406b-32a2-4465-abf3-2d415b9b1f4f',
            namespace: 'ups',
          },
        ],
      },
    ];

    const expectedEntitlements = ['indesign-any', 'after-effects-any'];
    const entitlements = await getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should not return any entitlements if there is no match', async () => {
    const config = getConfig();
    config.env = { name: 'prod' };

    const destinations = [
      {
        segments: [
          {
            id: 'x1111111-aaaa-bbbb-6666-cccccccccccc',
            namespace: 'ups',
          },
          {
            id: 'y2222222-xxxx-bbbb-7777-cccccccccccc',
            namespace: 'ups',
          },
        ],
      },
    ];

    const expectedEntitlements = [];
    const entitlements = await getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should be able to use consumer defined entitlements in the config', async () => {
    const config = getConfig();
    config.consumerEntitlements = { 'consumer-defined-entitlement': 'consumer-defined' };
    config.env = { name: 'prod' };

    const destinations = [
      {
        segments: [
          {
            id: 'e7650448-268b-4a0d-9795-05f604d7e42f',
            namespace: 'ups',
          },
          {
            id: '11111111-aaaa-bbbb-6666-cccccccccccc',
            namespace: 'ups',
          },
          {
            id: 'consumer-defined-entitlement',
            namespace: 'ups',
          },
        ],
      },
    ];

    const expectedEntitlements = ['lightroom-any', 'consumer-defined'];
    const entitlements = await getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });
});

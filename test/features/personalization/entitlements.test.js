import { expect } from '@esm-bundle/chai';
import { getConfig } from '../../../libs/utils/utils.js';
import getEntitlements, { ENTITLEMENT_MAP } from '../../../libs/features/personalization/entitlements.js';

// Modify the entitlement map with custom keys so the test doesn't rely on real data
ENTITLEMENT_MAP['11111111-aaaa-bbbb-6666-cccccccccccc'] = 'my-special-app';
ENTITLEMENT_MAP['22222222-xxxx-bbbb-7777-cccccccccccc'] = 'fireflies';

describe('entitlements', () => {
  it('Should return any entitlements that match the id', () => {
    const destinations = [
      {
        segments: [
          {
            id: '11111111-aaaa-bbbb-6666-cccccccccccc',
            namespace: 'ups',
          },
          {
            id: '22222222-xxxx-bbbb-7777-cccccccccccc',
            namespace: 'ups',
          },
          {
            id: '33333333-xxxx-bbbb-7777-cccccccccccc',
            namespace: 'ups',
          },
        ],
      },
    ];

    const expectedEntitlements = ['my-special-app', 'fireflies'];
    const entitlements = getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should not return any entitlements if there is no match', () => {
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
    const entitlements = getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should be able to use consumer defined entitlements in the config', () => {
    const config = getConfig();
    config.entitlements = { 'consumer-defined-entitlement': 'consumer-defined' };

    const destinations = [
      {
        segments: [
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

    const expectedEntitlements = ['my-special-app', 'consumer-defined'];
    const entitlements = getEntitlements(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });
});

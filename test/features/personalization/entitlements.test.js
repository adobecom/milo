import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import init, { getEntitlementDataUrl } from '../../../libs/features/personalization/entitlements.js';
import { getConfig } from '../../../libs/utils/utils.js';

const config = getConfig();
config.env = { name: 'prod' };

// Add custom keys so tests doesn't rely on real data
const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

let manifestJson = await readFile({ path: './mocks/entitlements.json' });
manifestJson = JSON.parse(manifestJson);
setFetchResponse(manifestJson);
const expectedEntitlementMap = {
  '8da44606-9841-43d0-af72-86d5a9d3bba0': 'cc-photo',
  'e7650448-268b-4a0d-9795-05f604d7e42f': 'lightroom-any',
  '6cb0d58c-3a65-47e2-b459-c52bb158d5b6': 'lightroom-web-usage',
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('entitlements', () => {
  beforeEach(() => {
    config.mep = {};
  });

  it('Should return any entitlements that match the id', async () => {
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
    const entitlements = await init(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
    expect(config.mep.entitlementMap).to.deep.equal(expectedEntitlementMap);
  });

  it('Should not return any entitlements if there is no match', async () => {
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
    const entitlements = await init(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should be able to use consumer defined entitlements in the config', async () => {
    config.consumerEntitlements = { 'consumer-defined-entitlement': 'consumer-defined' };
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
    const entitlements = await init(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should return a different entitlementDataUrl based on environment and origin', async () => {
    let url = getEntitlementDataUrl('prod', 'https://business.adobe.com');
    expect(url).to.equal('https://business.adobe.com/federal/assets/data/mep-entitlement-tags.json?sheet=prod');

    url = getEntitlementDataUrl('stage', 'https://www.stage.adobe.com');
    expect(url).to.equal('https://www.stage.adobe.com/federal/assets/data/mep-entitlement-tags.json?sheet=stage');
  });
});

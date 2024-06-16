import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import { stub } from 'sinon';
import init, { getEntitlementUrl } from '../../../libs/features/personalization/entitlements.js';
import { getConfig } from '../../../libs/utils/utils.js';

// Add custom keys so tests doesn't rely on real data
const config = getConfig();
config.env = { name: 'prod' };

const getFetchPromise = (data, type = 'json') => new Promise((resolve) => {
  resolve({
    ok: true,
    [type]: () => data,
  });
});

const setFetchResponse = (data, type = 'json') => {
  window.fetch = stub().returns(getFetchPromise(data, type));
};

// Note that the manifestPath doesn't matter as we stub the fetch
describe('entitlements', () => {
  it('Should return any entitlements that match the id', async () => {
    config.env = { name: 'prod' };
    let manifestJson = await readFile({ path: './mocks/entitlements.json' });
    manifestJson = JSON.parse(manifestJson);
    setFetchResponse(manifestJson);

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
  });

  it('Should not return any entitlements if there is no match', async () => {
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
    const entitlements = await init(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should be able to use consumer defined entitlements in the config', async () => {
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
    const entitlements = await init(destinations);
    expect(entitlements).to.deep.equal(expectedEntitlements);
  });

  it('Should return a different location based on environment', async () => {
    config.env = { name: 'prod' };
    let url = getEntitlementUrl();
    expect(url).to.equal('https://www.adobe.com/federal/assets/data/mep-entitlement-tags.json?sheet=prod');
    config.env = { name: 'stage' };
    url = getEntitlementUrl();
    expect(url).to.equal('https://www.stage.adobe.com/federal/assets/data/mep-entitlement-tags.json?sheet=stage');
  });
});

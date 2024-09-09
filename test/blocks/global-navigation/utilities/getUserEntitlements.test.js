import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import getUserEntitlements from '../../../../libs/blocks/global-navigation/utilities/getUserEntitlements.js';
import { mockRes } from '../test-utilities.js';
import { setConfig } from '../../../../libs/utils/utils.js';
import { res, formatted } from '../mocks/subscriptionsAll.js';

const emptyEntitlements = () => ({
  clouds: {},
  arrangement_codes: {},
  fulfilled_codes: {},
  offer_families: {},
  offers: {},
  list: { fulfilled_codes: [] },
});

describe('getUserEntitlements', () => {
  const ogFetch = window.fetch;
  beforeEach(() => {
    window.adobeIMS = {
      isSignedInUser: () => true,
      getProfile: () => ({}),
      getAccessToken: () => ({ token: 'mock' }),
      adobeIdData: { client_id: 'mock' },
    };
    setConfig({ env: { name: 'stage' } });
    window.fetch = stub().callsFake(() => mockRes({ payload: res }));
  });
  afterEach(() => {
    window.fetch = ogFetch;
    delete window.adobeIMS;
  });

  it('should return empty entitlements if a user is not signed in', async () => {
    window.adobeIMS = { isSignedInUser: () => false };
    const entitlements = await getUserEntitlements();
    expect(entitlements).to.deep.equal(emptyEntitlements());
  });

  it('should return a response with the formatted subscriptions', async () => {
    const entitlements = await getUserEntitlements();
    expect(entitlements).to.deep.equal(formatted);
  });

  it('should cache the response by query params', async () => {
    await getUserEntitlements({ params: [{ name: 'SOMETHING', value: 'VALUE' }] });
    expect(window.fetch.callCount).to.equal(1);
    await getUserEntitlements({ params: [{ name: 'SOMETHING', value: 'VALUE' }] });
    expect(window.fetch.callCount).to.equal(1);
    const entitlements = await getUserEntitlements({ params: [{ name: 'Q', value: 'PARAM' }] });
    expect(window.fetch.callCount).to.equal(2);
    expect(entitlements).to.deep.equal(formatted);

    const entitlementsRaw = await getUserEntitlements({ params: [{ name: 'Q', value: 'PARAM' }], format: 'raw' });
    expect(window.fetch.callCount).to.equal(2);
    expect(entitlementsRaw).to.deep.equal(res);

    // empty entitlements should not have been modified
    window.adobeIMS = { isSignedInUser: () => false };
    const entitlements2 = await getUserEntitlements();
    expect(entitlements2).to.deep.equal(emptyEntitlements());
  });

  it('should return the raw response if format is raw', async () => {
    const entitlements = await getUserEntitlements({ format: 'raw' });
    expect(entitlements).to.deep.equal(res);
  });

  it('should return empty entitlements if response is not an array', async () => {
    window.fetch = stub().callsFake(() => mockRes({ payload: '' }));
    const entitlements = await getUserEntitlements({ params: [{ name: 'NOTARRAY', value: 'TRUE' }] });
    expect(entitlements).to.deep.equal(emptyEntitlements());
  });
});

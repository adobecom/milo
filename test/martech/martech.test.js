/* eslint-disable no-underscore-dangle */
import { expect } from 'chai';
import sinon from 'sinon';
import { getConfig, setConfig } from '../../libs/utils/utils.js';

const { default: init, setupEntitlementCallback } = await import('../../libs/martech/martech.js');

const SEGMENT_ID = 'segment-1';
const ENTITLEMENT = 'cc-all-apps';

const createResolver = () => {
  let resolveFn;
  const promise = new Promise((resolve) => { resolveFn = resolve; });
  return (val) => {
    if (val !== undefined) resolveFn(val);
    return promise;
  };
};

const sendEntitlementEvent = () => window.dispatchEvent(new CustomEvent('alloy_sendEvent', { detail: { result: { destinations: [{ segments: [{ id: SEGMENT_ID }] }] } } }));

describe('setupEntitlementCallback', () => {
  beforeEach(() => {
    setConfig({ locales: { '': { ietf: 'en-US' } }, miloLibs: '/libs' });
    const config = getConfig();
    config.mep = { entitlementMap: { [SEGMENT_ID]: ENTITLEMENT } };
    config.entitlements = createResolver();
  });

  afterEach(() => sinon.restore());

  it('resolves entitlements from the alloy event when signed in', async () => {
    setupEntitlementCallback();
    sendEntitlementEvent();
    expect(await getConfig().entitlements()).to.deep.equal([ENTITLEMENT]);
  });

  it('captures an alloy event that fires before IMS confirms sign-in', async () => {
    let confirmSignIn;
    setupEntitlementCallback(new Promise((resolve) => { confirmSignIn = resolve; }));
    sendEntitlementEvent();
    confirmSignIn(true);
    expect(await getConfig().entitlements()).to.deep.equal([ENTITLEMENT]);
  });

  it('resolves empty entitlements when IMS reports signed out', async () => {
    setupEntitlementCallback(Promise.resolve(false));
    expect(await getConfig().entitlements()).to.deep.equal([]);
  });

  it('resolves empty entitlements when the IMS check fails', async () => {
    setupEntitlementCallback(Promise.reject(new Error('IMS timeout')));
    expect(await getConfig().entitlements()).to.deep.equal([]);
  });

  it('lets an earlier IMS signed-out resolve win over a pending alloy event', async () => {
    const clock = sinon.useFakeTimers();
    setupEntitlementCallback();
    await clock.tickAsync(0);
    getConfig().entitlements([]);
    let settled = false;
    getConfig().entitlements().then(() => { settled = true; });
    await clock.tickAsync(10);
    expect(settled).to.be.true;
    expect(await getConfig().entitlements()).to.deep.equal([]);
  });

  it('resolves empty entitlements when no alloy event arrives', async () => {
    const clock = sinon.useFakeTimers();
    setupEntitlementCallback();
    await clock.tickAsync(3000);
    expect(await getConfig().entitlements()).to.deep.equal([]);
  });
});

describe('martech init without Server-Timing sign-in hint', () => {
  const blockedScripts = [
    '/libs/deps/imslib.min.js',
    'https://www.adobe.com/marketingtech/main.standard.qa.min.js',
  ];

  before(() => {
    setConfig({ locales: { '': { ietf: 'en-US' } }, miloLibs: '/libs', imsClientId: 'test-client-id' });
    const config = getConfig();
    config.mep = { entitlementMap: { [SEGMENT_ID]: ENTITLEMENT } };
    config.entitlements = createResolver();
    blockedScripts.forEach((src) => {
      document.head.insertAdjacentHTML('beforeend', `<script src="${src}" type="javascript/blocked" data-loaded="true"></script>`);
    });
    window.adobeIMS = { isSignedInUser: () => true };
    window._satellite = { track: sinon.stub() };
  });

  after(() => {
    blockedScripts.forEach((src) => document.head.querySelector(`script[src="${src}"]`)?.remove());
    delete window.adobeid;
    delete window.adobeIMS;
    delete window._satellite;
    delete window.marketingtech;
  });

  it('resolves entitlements via IMS for a signed-in user', async () => {
    await init();
    window.adobeid.onReady();
    sendEntitlementEvent();
    expect(await getConfig().entitlements()).to.deep.equal([ENTITLEMENT]);
  });
});

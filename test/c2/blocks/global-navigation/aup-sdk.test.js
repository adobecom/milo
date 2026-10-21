import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import { AUP_SDK_READY_EVENT } from '../../../../libs/blocks/merch/merch.js';
import { initAupSdk } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { delay, waitFor } from '../../../helpers/waitfor.js';

const SDK_URL = 'https://shared-components.stage.adobe.com/aup-sdk/stable/main.js';
// Long enough for the cached SDK host module and stubbed SDK to settle.
const settle = () => delay(50);

describe('C2 global-navigation AUP SDK', () => {
  let script;
  let previous;
  let instance;
  let preloadSDK;
  let meta;
  let ready;

  const setSelect = (value) => {
    meta = document.createElement('meta');
    meta.name = 'aup-select';
    meta.content = value;
    document.head.append(meta);
  };
  const signIn = (signedIn) => {
    window.adobeIMS = { isSignedInUser: () => signedIn };
  };
  // Blocked tags never execute; a loaded mark lets loadScript resolve without network.
  const addSdkScript = (loaded = true) => {
    const tag = document.createElement('script');
    tag.type = 'javascript/blocked';
    tag.src = SDK_URL;
    if (loaded) tag.dataset.loaded = 'true';
    document.head.append(tag);
    return tag;
  };

  before(async () => {
    // Warm the lazily imported SDK host so timing does not depend on module fetches.
    await import('../../../../libs/blocks/global-navigation/utilities/aup-sdk.js');
    script = addSdkScript();
  });

  after(() => script.remove());

  beforeEach(() => {
    previous = {
      aupsdk: window.aupsdk,
      AUPSDK: window.AUPSDK,
      adobeIMS: window.adobeIMS,
    };
    setConfig({ codeRoot: '/libs', imsClientId: 'milo', locales: { '': { ietf: 'en-US' } } });
    signIn(false);
    instance = {
      updateConfig: sinon.stub().resolves(),
      getOrchestratorContext: sinon.stub().resolves(),
    };
    preloadSDK = sinon.stub().resolves(instance);
    window.aupsdk = undefined;
    window.AUPSDK = { preloadSDK };
    ready = sinon.spy();
    window.addEventListener(AUP_SDK_READY_EVENT, ready);
    sinon.stub(window.lana, 'log');
  });

  afterEach(() => {
    window.removeEventListener(AUP_SDK_READY_EVENT, ready);
    meta?.remove();
    meta = undefined;
    window.aupsdk = previous.aupsdk;
    window.AUPSDK = previous.AUPSDK;
    window.adobeIMS = previous.adobeIMS;
    sinon.restore();
  });

  [
    { name: 'aup-select=on', select: 'on', expected: true },
    { name: 'aup-select=enabled', select: 'enabled', expected: true },
    { name: 'aup-select=off', select: 'off', expected: false },
    { name: 'signed-in universal nav user', signedIn: true, unav: true, expected: true },
    { name: 'signed-in user without universal nav', signedIn: true, unav: false, expected: false },
    { name: 'signed-out universal nav user', signedIn: false, unav: true, expected: false },
  ].forEach(({ name, select, signedIn = false, unav = false, expected }) => {
    it(`${expected ? 'eagerly loads' : 'does not load'} the SDK for ${name}`, async () => {
      if (select) setSelect(select);
      signIn(signedIn);
      initAupSdk({ imsReady: Promise.resolve(), unavEnabled: unav });
      if (expected) await waitFor(() => ready.called);
      await settle();

      expect(preloadSDK.callCount).to.equal(expected ? 1 : 0);
      expect(window.aupsdk === (expected ? instance : undefined)).to.be.true;
      expect(ready.callCount).to.equal(expected ? 1 : 0);
    });
  });

  it('configures the shared Milo SDK host and publishes readiness', async () => {
    setSelect('on');
    const fetchAUPSDKInstance = initAupSdk({ imsReady: Promise.resolve(), unavEnabled: false });

    expect(await fetchAUPSDKInstance()).to.equal(instance);
    expect(preloadSDK.calledOnce).to.be.true;
    const [channel, options] = preloadSDK.firstCall.args;
    expect(channel).to.equal('adobe-com-stable');
    expect(options).to.include({
      appId: 'adobe_com',
      apiKey: 'milo',
      environment: 'stage',
      cdnEnvironment: 'stage',
      locale: 'en-US',
    });
    expect(options.showDialog).to.be.a('function');
    expect(instance.updateConfig.firstCall.args[0]).to.deep.equal({ miniAppContext: { features: ['useToasts', 'tmp_aupsdk_ucv3_in_iframe'] } });
    expect(ready.calledOnce).to.be.true;
  });

  it('shares a single SDK instance between the eager preload and fetchAUPSDKInstance', async () => {
    setSelect('enabled');
    const fetchAUPSDKInstance = initAupSdk({ imsReady: Promise.resolve(), unavEnabled: false });
    await Promise.resolve();
    const [first, second] = await Promise.all([fetchAUPSDKInstance(), fetchAUPSDKInstance()]);

    expect(first).to.equal(instance);
    expect(second).to.equal(instance);
    expect(preloadSDK.calledOnce).to.be.true;
  });

  it('lazily loads the SDK through fetchAUPSDKInstance when not eagerly enabled', async () => {
    const fetchAUPSDKInstance = initAupSdk({ imsReady: Promise.resolve(), unavEnabled: false });
    await settle();
    expect(preloadSDK.called).to.be.false;

    expect(await fetchAUPSDKInstance()).to.equal(instance);
    expect(preloadSDK.calledOnce).to.be.true;
  });

  it('logs an eager preload failure and retries on the next fetchAUPSDKInstance call', async () => {
    setSelect('on');
    preloadSDK.onFirstCall().rejects(new Error('SDK unavailable'));
    const fetchAUPSDKInstance = initAupSdk({ imsReady: Promise.resolve(), unavEnabled: false });
    await waitFor(() => window.lana.log.called);

    expect(window.aupsdk).to.equal(undefined);
    expect(ready.called).to.be.false;
    const [message, options] = window.lana.log.lastCall.args;
    expect(message).to.include('GNAV: eager AUP SDK preload failed; falling back to lazy init');
    expect(message).to.include('SDK unavailable');
    expect(options).to.include({ tags: 'universalnav', errorType: 'i', severity: 'info' });

    expect(await fetchAUPSDKInstance()).to.equal(instance);
    expect(preloadSDK.calledTwice).to.be.true;
    expect(ready.calledOnce).to.be.true;
  });

  it('downloads the SDK again after a script load failure', async () => {
    script.remove();
    const failed = addSdkScript(false);
    const listen = sinon.spy(failed, 'addEventListener');
    const fetchAUPSDKInstance = initAupSdk({ imsReady: Promise.resolve(), unavEnabled: false });
    const attempt = fetchAUPSDKInstance();
    await waitFor(() => listen.calledWith('error'));
    failed.dispatchEvent(new Event('error'));

    expect((await attempt.catch((error) => error)).message).to.include('error loading script');
    expect(failed.isConnected).to.be.false;
    expect(preloadSDK.called).to.be.false;

    script = addSdkScript();
    expect(await fetchAUPSDKInstance()).to.equal(instance);
    expect(preloadSDK.calledOnce).to.be.true;
  });

  it('waits for a late IMS instance after an IMS timeout', async () => {
    setSelect('on');
    initAupSdk({ imsReady: Promise.reject(new Error('IMS timeout')), unavEnabled: false });
    await settle();
    expect(preloadSDK.called).to.be.false;

    window.dispatchEvent(new Event('onImsLibInstance'));
    await waitFor(() => ready.called);
    expect(preloadSDK.calledOnce).to.be.true;
    expect(window.aupsdk).to.equal(instance);

    window.dispatchEvent(new Event('onImsLibInstance'));
    await settle();
    expect(preloadSDK.calledOnce).to.be.true;
  });

  it('does not eagerly load the SDK after a non-timeout IMS failure', async () => {
    setSelect('on');
    initAupSdk({ imsReady: Promise.reject(new Error('IMS failed')), unavEnabled: false });
    await settle();
    window.dispatchEvent(new Event('onImsLibInstance'));
    await settle();

    expect(preloadSDK.called).to.be.false;
  });
});

import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import loadDelayed, {
  loadPrivacy,
  loadJarvisChat,
  loadGoogleLogin,
  addRUMCampaignTrackingParameters,
  loadPreflightResults,
  shouldAutoHighlight,
} from '../../libs/scripts/delayed.js';
import { getMetadata, getConfig, setConfig, loadIms } from '../../libs/utils/utils.js';

describe('Delayed', () => {
  const loadScript = sinon.stub().returns(() => new Promise((resolve) => { resolve(); }));
  const loadStyle = sinon.stub().returns(() => new Promise((resolve) => { resolve(); }));

  it('should load privacy feature', async () => {
    expect(loadPrivacy).to.exist;
    setConfig({ privacyId: '7a5eb705-95ed-4cc4-a11d-0cc5760e93db' });
    document.body.innerHTML = '<footer><a href="https://www.adobe.com/#openPrivacy" id="privacy-link">Cookie preferences</a></footer>';
    await loadPrivacy(getConfig, loadScript);
    window.adobePrivacy = { showPreferenceCenter: sinon.stub() };
    document.getElementById('privacy-link')?.click();
    expect(window.adobePrivacy.showPreferenceCenter.called).to.be.true;
  });

  it('should load jarvis feature', async () => {
    setConfig({ jarvis: { id: 'test', version: '1.0' } });
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'jarvis-chat');
    tag.setAttribute('content', 'on');
    document.head.appendChild(tag);
    expect(loadJarvisChat).to.exist;
    window.AdobeMessagingExperienceClient = { initialize: sinon.stub() };
    window.adobePrivacy = { activeCookieGroups: sinon.stub() };
    loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
    document.head.removeChild(tag);
  });

  it('should load google login feature', async () => {
    const tag = document.createElement('meta');
    tag.setAttribute('name', 'google-login');
    tag.setAttribute('content', 'on');
    document.head.appendChild(tag);
    expect(loadGoogleLogin).to.exist;
    await loadGoogleLogin(getMetadata, loadIms, loadScript);
  });

  it('should load interlinks logic', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
    document.querySelector('head')?.insertAdjacentHTML('beforeend', '<meta name="interlinks" content="on">');
    loadDelayed([getConfig, getMetadata, loadScript, loadStyle, loadIms])
      .then((module) => {
        expect(typeof module === 'object').to.equal(true);
      });
    await clock.runAllAsync();
    clock.restore();
  });

  it('should skip load interlinks logic when metadata is off', async () => {
    const clock = sinon.useFakeTimers({ toFake: ['setTimeout'] });
    document.head.querySelector('meta[name="interlinks"]')?.remove();
    loadDelayed([getConfig, getMetadata, loadScript, loadStyle, loadIms])
      .then((module) => {
        expect(module == null).to.equal(true);
      });
    await clock.runAllAsync();
    clock.restore();
  });
});

describe('addRUMCampaignTrackingParameters', () => {
  const originalURLSearchParams = window.URLSearchParams;
  const setURLSearchParamsStub = (params) => {
    window.URLSearchParams = sinon.stub().returns({ get: (key) => params[key] });
  };

  afterEach(() => {
    window.URLSearchParams = originalURLSearchParams;
  });

  it('should call sampleRUM for valid sdid, mv, and mv2', () => {
    setURLSearchParamsStub({
      sdid: '12345678',
      mv: 'foo',
      mv2: 'bar',
    });
    const sampleRUM = sinon.stub();
    addRUMCampaignTrackingParameters({ sampleRUM });
    expect(sampleRUM.calledThrice).to.be.true;
    expect(sampleRUM.getCall(0).args).to.deep.equal(['utm', { source: 'utm_campaign', target: '12345678' }]);
    expect(sampleRUM.getCall(1).args).to.deep.equal(['utm', { source: 'utm_source', target: 'foo' }]);
    expect(sampleRUM.getCall(2).args).to.deep.equal(['utm', { source: 'utm_medium', target: 'bar' }]);
  });

  it('should NOT call sampleRUM for sdid if too long', () => {
    setURLSearchParamsStub({
      sdid: '123456789012345',
      mv: 'foo',
    });
    const sampleRUM = sinon.stub();
    addRUMCampaignTrackingParameters({ sampleRUM });
    expect(sampleRUM.calledOnce).to.be.true;
    expect(sampleRUM.getCall(0).args).to.deep.equal(['utm', { source: 'utm_source', target: 'foo' }]);
  });

  it('should skip missing params', () => {
    setURLSearchParamsStub({ irrelevant: 'x' });
    const sampleRUM = sinon.stub();
    addRUMCampaignTrackingParameters({ sampleRUM });
    expect(sampleRUM.notCalled).to.be.true;
  });
});

describe('loadPreflightResults', () => {
  let fetchStub;
  let originalUrl;
  const setParam = (name, value) => {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.replaceState(null, '', url);
  };

  beforeEach(() => {
    originalUrl = window.location.href;
    fetchStub = sinon.stub(window, 'fetch').resolves({
      ok: true,
      status: 200,
      json: async () => ({}),
      text: async () => '',
    });
  });

  afterEach(() => {
    fetchStub.restore();
    window.history.replaceState(null, '', originalUrl);
    document.querySelector('main')?.remove();
    document.querySelector('.milo-preflight-overlay')?.remove();
    document.querySelector('.preflight-diff-highlight-control')?.remove();
  });

  it('does not fetch content or render highlights on localhost by default', async () => {
    document.body.insertAdjacentHTML('beforeend', '<main></main>');
    await loadPreflightResults();
    expect(fetchStub.called).to.equal(false);
    expect(document.querySelector('.preflight-diff-highlight-control')).to.be.null;
  });

  it('does not render the publish notification on local hosts', async () => {
    // web-test-runner serves on localhost, so the isLocal branch is exercised
    // and the sidekick quality-check notification must be skipped.
    document.body.insertAdjacentHTML('beforeend', '<main></main>');
    await loadPreflightResults();
    expect(document.querySelector('.milo-preflight-overlay')).to.be.null;
  });

  it('waits for auto-highlight to finish before resolving', async () => {
    setParam('autoHighlight', 'on');
    let resolveFetch;
    let fetchStarted;
    const pendingFetch = new Promise((resolve) => { resolveFetch = resolve; });
    const started = new Promise((resolve) => { fetchStarted = resolve; });
    fetchStub.resetBehavior();
    fetchStub.callsFake(() => { fetchStarted(); return pendingFetch; });
    document.body.insertAdjacentHTML('beforeend', '<main></main>');

    let settled = false;
    const loading = loadPreflightResults().then(() => { settled = true; });
    await started;
    await Promise.resolve();
    const settledBeforeFetch = settled;
    resolveFetch({ ok: false, status: 500 });
    await loading;
    expect(settledBeforeFetch).to.equal(false);
    expect(settled).to.equal(true);
    expect(fetchStub.calledWithMatch('.plain.html')).to.equal(true);
  });
});

describe('shouldAutoHighlight', () => {
  const hosts = {
    preview: { isPreview: true, isLocal: false },
    localhost: { isPreview: false, isLocal: true },
    live: { isPreview: false, isLocal: false },
  };

  [
    ['preview', '', true],
    ['preview', 'autoHighlight=on', true],
    ['preview', 'autoHighlight=off', false],
    ['localhost', '', false],
    ['localhost', 'autoHighlight=on', true],
    ['localhost', 'autoHighlight=off', false],
    ['localhost', 'autoHighlight=true', false],
    ['live', 'autoHighlight=on', false],
    ['preview', 'dapreview=on', false],
    ['localhost', 'dapreview=local&autoHighlight=on', false],
    ['preview', 'quick-edit=on&autoHighlight=on', false],
  ].forEach(([host, query, expected]) => {
    it(`${expected ? 'highlights' : 'skips'} ${host} ${query ? `with ${query}` : 'without parameters'}`, () => {
      const params = new URLSearchParams(query);
      expect(shouldAutoHighlight({ ...hosts[host], params })).to.equal(expected);
    });
  });
});

describe('loadJarvisChat Assistant routing', () => {
  let originalConfig;
  let originalClient;
  let listenerSpy;
  let loadScript;
  let loadStyle;
  let metadata;

  beforeEach(() => {
    originalConfig = getConfig();
    originalClient = window.AdobeMessagingExperienceClient;
    window.AdobeMessagingExperienceClient = { initialize: sinon.spy() };
    setConfig({ env: { name: 'stage' }, locale: { ietf: 'en-US' }, jarvis: { id: 'jarvis-app', version: '2.0', onDemand: false } });
    listenerSpy = sinon.spy(document, 'addEventListener');
    loadScript = sinon.stub().resolves();
    loadStyle = sinon.stub().resolves();
    metadata = { 'jarvis-chat': 'on', 'acom-assistant': 'on' };
    document.body.innerHTML = '';
  });

  afterEach(() => {
    listenerSpy.getCalls().forEach(({ args }) => document.removeEventListener(...args));
    listenerSpy.restore();
    window.AdobeMessagingExperienceClient = originalClient;
    setConfig(originalConfig);
    document.body.innerHTML = '';
    document.head.querySelector('meta[name="acom-assistant"]')?.remove();
  });

  const run = () => {
    document.head.append(Object.assign(document.createElement('meta'), { name: 'acom-assistant', content: metadata['acom-assistant'] }));
    return loadJarvisChat(getConfig, (name) => metadata[name], loadScript, loadStyle);
  };

  it('keeps existing Jarvis startup when Assistant is on but no BC placement exists', async () => {
    await run();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(loadScript.calledOnce).to.be.true;
    expect(loadScript.firstCall.args[0]).to.include('stage-client.messaging.adobe.com');
  });

  it('uses Assistant chat links when the GNav BC placement is enabled', async () => {
    metadata['gnav-brand-concierge'] = 'on';
    await run();
    expect(loadScript.called).to.be.false;
    expect(listenerSpy.withArgs('click').calledOnce).to.be.true;
  });

  it('uses Assistant chat links when a standalone BC block exists', async () => {
    document.body.innerHTML = '<div class="brand-concierge"></div>';
    await run();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(loadScript.called).to.be.false;
    expect(window.AdobeMessagingExperienceClient.initialize.called).to.be.false;
  });

  it('keeps existing Jarvis startup when Assistant metadata is off', async () => {
    metadata['acom-assistant'] = 'off';
    document.body.innerHTML = '<div class="brand-concierge"></div>';
    await run();
    await new Promise((resolve) => { setTimeout(resolve, 0); });
    expect(loadScript.calledOnce).to.be.true;
  });
});

import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import loadDelayed, { loadPrivacy, loadJarvisChat, loadGoogleLogin, addRUMCampaignTrackingParameters } from '../../libs/scripts/delayed.js';
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

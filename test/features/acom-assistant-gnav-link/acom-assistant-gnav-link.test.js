import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { getConfig, setConfig } from '../../../libs/utils/utils.js';
import { waitFor } from '../../helpers/waitfor.js';

describe('Chat link startup selection', () => {
  let client;
  let initializedConfig;
  let originalClient;
  let originalLana;
  let originalSearch;
  let clientScript;
  let initChatLinks;
  let listenerSpy;
  let loadScript;
  let loadStyle;
  let getMetadata;
  let openContexts;

  before(() => {
    originalClient = window.AdobeMessagingExperienceClient;
    originalLana = window.lana;
    originalSearch = window.location.search;
    client = {
      initialize: sinon.spy((config) => {
        initializedConfig = config;
        config.callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
        config.callbacks.onReadyCallback();
      }),
      reinitialize: sinon.spy(() => {
        initializedConfig.callbacks.initCallback({ releaseControl: { showAdobeMessaging: true } });
        initializedConfig.callbacks.onReadyCallback();
        return { status: 'success', type: 'init_started' };
      }),
      openMessagingWindow: sinon.stub().resolves(),
      isAdobeMessagingClientInitialized: () => true,
      getMessagingExperienceState: () => ({ windowState: 'hidden' }),
    };
    window.AdobeMessagingExperienceClient = client;
    clientScript = document.createElement('script');
    clientScript.type = 'javascript/blocked';
    clientScript.src = 'https://dev-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    clientScript.dataset.loaded = 'true';
    document.head.append(clientScript);
  });

  beforeEach(async () => {
    ({ default: initChatLinks } = await import(`../../../libs/features/acom-assistant-gnav-link.js?test=${crypto.randomUUID()}`));
    setConfig({
      env: { name: 'stage' },
      locale: { ietf: 'en-US' },
      jarvis: { id: 'homepage_loggedout_default', version: '2.0', onDemand: false },
    });
    window.history.replaceState(null, '', window.location.pathname);
    window.lana = { log: sinon.spy() };
    client.initialize.resetHistory();
    client.reinitialize.resetHistory();
    client.openMessagingWindow.reset();
    openContexts = [];
    client.openMessagingWindow.callsFake(() => {
      openContexts.push(initializedConfig.callbacks.getContextCallback());
      return Promise.resolve();
    });
    listenerSpy = sinon.spy(document, 'addEventListener');
    loadScript = sinon.stub().resolves();
    loadStyle = sinon.stub().resolves();
    getMetadata = sinon.stub().returns(undefined);
    document.body.innerHTML = `<div class="global-footer">
      <a href="#open-jarvis-chat" data-jarvis-config='{"jarvis-surface-id":"footer-jarvis","jarvis-surface-version":"9.0"}'>Contact us</a>
    </div>`;
  });

  afterEach(() => {
    listenerSpy.getCalls().forEach(({ args }) => document.removeEventListener(...args));
    listenerSpy.restore();
    document.body.innerHTML = '';
  });

  after(() => {
    clientScript.remove();
    window.AdobeMessagingExperienceClient = originalClient;
    window.lana = originalLana;
    window.history.replaceState(null, '', window.location.pathname + originalSearch);
  });

  it('uses original Jarvis when the Assistant flag is absent', async () => {
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    expect(client.initialize.calledOnce).to.be.true;
    expect(initializedConfig.appid).to.equal('homepage_loggedout_default');
    expect(initializedConfig.appver).to.equal('2.0');
    expect(initializedConfig.componentid).to.be.undefined;
  });

  it('lets query off override metadata on and preserves Jarvis on-demand startup', async () => {
    window.history.replaceState(null, '', `${window.location.pathname}?acom-assistant=off`);
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('jarvis-on-demand').returns('on');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    expect(client.initialize.called).to.be.false;
    expect(loadScript.called).to.be.false;
  });

  it('lets query on override metadata off without starting a second client', async () => {
    window.history.replaceState(null, '', `${window.location.pathname}?acom-assistant=on`);
    getMetadata.withArgs('acom-assistant').returns('off');
    getMetadata.withArgs('foundation').returns('c2');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    expect(client.initialize.called).to.be.false;
    expect(client.reinitialize.called).to.be.false;
    expect(loadScript.called).to.be.false;
    expect(listenerSpy.withArgs('click').calledOnce).to.be.true;

    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(client.initialize.calledOnce).to.be.true;
    expect(initializedConfig.appid).to.equal('bc-adobedotcom2');
    expect(initializedConfig.appver).to.equal('1.0');
    expect(initializedConfig.componentid).to.equal('brand-concierge');
    expect(client.openMessagingWindow.calledOnceWith({ sourceType: 'a', sourceText: 'Contact us' })).to.be.true;
    expect(openContexts).to.deep.equal([{ appid: 'footer-jarvis', appver: '9.0' }]);
    expect(initializedConfig.callbacks.getContextCallback().appid).to.equal('bc-adobedotcom2');
  });

  it('supplies footer Jarvis context without replacing the initialized C2 BC identity', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('foundation').returns('c2');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(client.initialize.called).to.be.false;
    expect(client.reinitialize.called).to.be.false;
    expect(openContexts).to.deep.equal([{ appid: 'footer-jarvis', appver: '9.0' }]);
    expect(initializedConfig.callbacks.getContextCallback().appid).to.equal('bc-adobedotcom2');
    expect(document.querySelector('a').getAttribute('href')).to.equal('#open-jarvis-chat');
  });

  it('uses the C1 BC bootstrap on C1 pages', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(initializedConfig.callbacks.getContextCallback().appid).to.equal('bc-adobedotcom2');
    expect(client.openMessagingWindow.calledOnce).to.be.true;
    expect(openContexts).to.deep.equal([{ appid: 'footer-jarvis', appver: '9.0' }]);
  });

  it('uses page Jarvis metadata when the link has no footer configuration', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('foundation').returns('c2');
    getMetadata.withArgs('jarvis-surface-id').returns('page-jarvis');
    getMetadata.withArgs('jarvis-surface-version').returns('3.0');
    document.querySelector('a').removeAttribute('data-jarvis-config');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(openContexts).to.deep.equal([{ appid: 'page-jarvis', appver: '3.0' }]);
    expect(client.reinitialize.called).to.be.false;
  });

  it('does not reuse footer configuration for a subsequent GNav link', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('foundation').returns('c2');
    document.body.insertAdjacentHTML('beforeend', '<nav><a href="#open-jarvis-chat">Message us</a></nav>');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('.global-footer a').click();
    await waitFor(() => client.openMessagingWindow.calledOnce);
    document.querySelector('nav a').click();
    await waitFor(() => client.openMessagingWindow.calledTwice);
    expect(openContexts).to.deep.equal([
      { appid: 'footer-jarvis', appver: '9.0' },
      { appid: 'homepage_loggedout_default', appver: '2.0' },
    ]);
    expect(initializedConfig.callbacks.getContextCallback().appid).to.equal('bc-adobedotcom2');
    expect(client.reinitialize.called).to.be.false;
  });

  it('uses BC context again on a subsequent BC open', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('foundation').returns('c2');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    const { openAcomAssistantChat } = await import('../../../libs/features/acom-assistant.js');
    await openAcomAssistantChat({ sourceType: 'button', sourceText: 'Ask' });
    expect(openContexts).to.deep.equal([
      { appid: 'footer-jarvis', appver: '9.0' },
      { appid: 'bc-adobedotcom2', appver: '1.0' },
    ]);
    expect(client.initialize.called).to.be.false;
    expect(client.reinitialize.called).to.be.false;
  });

  it('logs invalid footer configuration instead of opening BC', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    document.querySelector('a').setAttribute('data-jarvis-config', 'invalid JSON');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => window.lana.log.called);
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('logs a missing Jarvis identity instead of opening BC', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    document.querySelector('a').removeAttribute('data-jarvis-config');
    await initChatLinks({}, loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => window.lana.log.called);
    expect(window.lana.log.firstCall.args[0]).to.include('requires a surface ID and version');
    expect(client.openMessagingWindow.called).to.be.false;
  });

  it('logs Assistant link failures without falling back to another client', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    client.openMessagingWindow.rejects(new Error('open failed'));
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => window.lana.log.called);
    expect(window.lana.log.firstCall.args[0]).to.include('open failed');
    expect(loadScript.called).to.be.false;
    expect(initializedConfig.callbacks.getContextCallback().appid).to.equal('bc-adobedotcom2');
  });
});

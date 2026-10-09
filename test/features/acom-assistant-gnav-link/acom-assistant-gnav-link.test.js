import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { getConfig, setConfig } from '../../../libs/utils/utils.js';
import { waitFor } from '../../helpers/waitfor.js';

describe('Chat link startup selection', () => {
  let client;
  let initializedConfig;
  let originalClient;
  let originalLana;
  let clientScript;
  let assistantIdMetadata;
  let assistantVersionMetadata;
  let initChatLinks;
  let listenerSpy;
  let loadScript;
  let loadStyle;
  let getMetadata;
  let openContexts;
  const BC_IDENTITY = { appid: 'homepage_loggedout_default', appver: '2.0' };

  before(() => {
    originalClient = window.AdobeMessagingExperienceClient;
    originalLana = window.lana;
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
    clientScript.src = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    clientScript.dataset.loaded = 'true';
    document.head.append(clientScript);
    assistantIdMetadata = document.createElement('meta');
    assistantIdMetadata.name = 'acom-assistant-id';
    assistantIdMetadata.content = 'unused-assistant-id';
    document.head.append(assistantIdMetadata);
    assistantVersionMetadata = document.createElement('meta');
    assistantVersionMetadata.name = 'acom-assistant-version';
    assistantVersionMetadata.content = 'unused-assistant-version';
    document.head.append(assistantVersionMetadata);
  });

  beforeEach(async () => {
    ({ default: initChatLinks } = await import(`../../../libs/features/acom-assistant-gnav-link.js?test=${crypto.randomUUID()}`));
    setConfig({
      env: { name: 'stage' },
      locale: { ietf: 'en-US' },
      jarvis: { id: 'homepage_loggedout_default', version: '2.0', onDemand: false },
    });
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
    assistantIdMetadata.remove();
    assistantVersionMetadata.remove();
    window.AdobeMessagingExperienceClient = originalClient;
    window.lana = originalLana;
  });

  it('uses original Jarvis when Assistant metadata is absent', async () => {
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    expect(client.initialize.calledOnce).to.be.true;
    expect(initializedConfig.appid).to.equal('homepage_loggedout_default');
    expect(initializedConfig.appver).to.equal('2.0');
    expect(initializedConfig.componentid).to.be.undefined;
  });

  it('registers Assistant links when metadata is on', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('jarvis-on-demand').returns('on');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    expect(client.initialize.called).to.be.false;
    expect(loadScript.called).to.be.false;
    expect(listenerSpy.withArgs('click').calledOnce).to.be.true;
  });

  it('preserves Jarvis on-demand startup when Assistant metadata is off', async () => {
    getMetadata.withArgs('acom-assistant').returns('off');
    getMetadata.withArgs('jarvis-on-demand').returns('on');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    expect(client.initialize.called).to.be.false;
    expect(loadScript.called).to.be.false;
    expect(getMetadata.calledWith('jarvis-on-demand')).to.be.true;
    expect(listenerSpy.withArgs('click').calledOnce).to.be.true;
  });

  it('uses Assistant metadata without starting a second client', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
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
    expect(initializedConfig.appid).to.equal(getConfig().jarvis.id);
    expect(initializedConfig.appver).to.equal(getConfig().jarvis.version);
    expect(initializedConfig.componentid).to.equal('brand-concierge');
    expect(client.openMessagingWindow.calledOnceWith({ sourceType: 'a', sourceText: 'Contact us' })).to.be.true;
    expect(openContexts).to.deep.equal([BC_IDENTITY]);
  });

  it('opens BC from a footer Jarvis link, ignoring its Jarvis surface config', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('foundation').returns('c2');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(client.initialize.called).to.be.false;
    expect(client.reinitialize.called).to.be.false;
    expect(openContexts).to.deep.equal([BC_IDENTITY]);
    expect(document.querySelector('a').getAttribute('href')).to.equal('#open-jarvis-chat');
  });

  it('uses the C1 BC bootstrap on C1 pages', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(client.openMessagingWindow.calledOnce).to.be.true;
    expect(openContexts).to.deep.equal([BC_IDENTITY]);
  });

  it('opens BC from links without any Jarvis configuration', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    getMetadata.withArgs('foundation').returns('c2');
    document.body.insertAdjacentHTML('beforeend', '<nav><a href="#open-jarvis-chat">Message us</a></nav>');
    await initChatLinks({}, loadScript, loadStyle, getMetadata);
    document.querySelector('nav a').click();
    await waitFor(() => client.openMessagingWindow.called);
    expect(client.openMessagingWindow.calledOnceWith({ sourceType: 'a', sourceText: 'Message us' })).to.be.true;
    expect(openContexts).to.deep.equal([BC_IDENTITY]);
    expect(window.lana.log.called).to.be.false;
  });

  it('logs Assistant link failures without falling back to another client', async () => {
    getMetadata.withArgs('acom-assistant').returns('on');
    client.openMessagingWindow.rejects(new Error('open failed'));
    await initChatLinks(getConfig(), loadScript, loadStyle, getMetadata);
    document.querySelector('a').click();
    await waitFor(() => window.lana.log.called);
    expect(window.lana.log.firstCall.args[0]).to.include('open failed');
    expect(loadScript.called).to.be.false;
    expect(initializedConfig.callbacks.getContextCallback().appid).to.equal(getConfig().jarvis.id);
  });

  it('shares one initialization between C1 and C2 BC bootstraps', async () => {
    const [c1, c2] = await Promise.all([
      import('../../../libs/blocks/brand-concierge/acom-assistant-bootstrap.js'),
      import('../../../libs/c2/blocks/brand-concierge/acom-assistant-bootstrap.js'),
    ]);
    await c2.ensureAcomAssistant();
    await c1.ensureAcomAssistant();
    expect(client.reinitialize.called).to.be.false;
  });
});

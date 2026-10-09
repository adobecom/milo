import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import loadDelayed, { loadAcomAssistant, loadJarvisChat } from '../../../libs/scripts/delayed.js';
import { decorateNavWithAssistant } from '../../../libs/features/acom-assistant-gnav.js';
import { getConfig, getMetadata, setConfig } from '../../../libs/utils/utils.js';
import { waitFor } from '../../helpers/waitfor.js';

describe('Delayed Assistant navigation startup', () => {
  let originalConfig;
  let originalClient;
  let originalPrivacy;
  let client;
  let metadata;
  let clientScript;
  let clientStyle;
  let clock;
  let listenerSpy;
  let loadScript;
  let loadStyle;

  before(() => {
    originalConfig = getConfig();
    originalClient = window.AdobeMessagingExperienceClient;
    originalPrivacy = window.adobePrivacy;
    setConfig({ env: { name: 'stage' }, jarvis: { id: 'delayed-assistant', version: '2.0' } });
    client = {
      initialize: sinon.spy((config) => {
        config.callbacks.onReadyCallback();
        return { status: 'success' };
      }),
    };
    window.AdobeMessagingExperienceClient = client;
    window.adobePrivacy = { activeCookieGroups: () => [] };
    metadata = document.createElement('meta');
    metadata.name = 'acom-assistant';
    document.head.append(metadata);
  });

  beforeEach(() => {
    metadata.content = 'on';
    listenerSpy = sinon.spy(document, 'addEventListener');
    loadScript = sinon.stub().resolves();
    loadStyle = sinon.stub().resolves();
    document.body.innerHTML = '';
  });

  afterEach(() => {
    clock?.restore();
    clock = undefined;
    listenerSpy.getCalls().forEach(({ args }) => document.removeEventListener(...args));
    listenerSpy.restore();
    document.body.innerHTML = '';
    delete window.milo;
  });

  after(() => {
    metadata.remove();
    clientScript?.remove();
    clientStyle?.remove();
    window.AdobeMessagingExperienceClient = originalClient;
    window.adobePrivacy = originalPrivacy;
    setConfig(originalConfig);
  });

  it('does not load Assistant when its metadata is off', async () => {
    metadata.content = 'off';
    await loadAcomAssistant(getMetadata);
    expect(client.initialize.called).to.be.false;
    expect(loadScript.called).to.be.false;
    expect(loadStyle.called).to.be.false;
    expect(listenerSpy.withArgs('click').called).to.be.false;
  });

  it('keeps Assistant chat links on demand when the Jarvis delayed hook runs', async () => {
    const jarvisMetadata = document.createElement('meta');
    jarvisMetadata.name = 'jarvis-chat';
    jarvisMetadata.content = 'on';
    document.head.append(jarvisMetadata);
    try {
      await loadJarvisChat(getConfig, getMetadata, loadScript, loadStyle);
      expect(client.initialize.called).to.be.false;
      expect(loadScript.called).to.be.false;
      expect(loadStyle.called).to.be.false;
      expect(listenerSpy.withArgs('click').calledOnce).to.be.true;
    } finally {
      jarvisMetadata.remove();
    }
  });

  it('keeps SDK assets out of startup and initializes once after the default 3000 ms delay', async () => {
    document.body.innerHTML = `
      <nav><div class="feds-bc-wrapper"></div></nav>
      <div class="authored-cards"><div>Help me choose an app</div></div>
    `;
    const cards = document.querySelector('.authored-cards');
    decorateNavWithAssistant(cards, document.querySelector('nav'));
    cards.remove();
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.exist;
    expect(client.initialize.called).to.be.false;

    clock = sinon.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const delayed = loadDelayed([
      getConfig, getMetadata, loadScript, loadStyle, sinon.stub().resolves(),
    ]);
    await clock.tickAsync(2999);
    expect(client.initialize.called).to.be.false;
    expect(document.querySelector('script[src*="AdobeMessagingClient"]')).to.be.null;
    expect(document.querySelector('link[href*="AdobeMessagingClient"]')).to.be.null;

    clientScript = document.createElement('script');
    clientScript.type = 'javascript/blocked';
    clientScript.src = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    clientScript.dataset.loaded = 'true';
    clientStyle = document.createElement('link');
    clientStyle.rel = 'stylesheet';
    clientStyle.href = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.css';
    document.head.append(clientScript, clientStyle);
    await clock.tickAsync(1);
    clock.restore();
    clock = undefined;
    await delayed;
    await waitFor(() => client.initialize.called);

    expect(client.initialize.calledOnce).to.be.true;
    const config = client.initialize.firstCall.args[0];
    expect(config.appid).to.equal('delayed-assistant');
    expect(config.appver).to.equal('2.0');
    expect(config.context.prompts).to.deep.equal([{ label: 'Help me choose an app' }]);
    await loadAcomAssistant(getMetadata);
    expect(client.initialize.calledOnce).to.be.true;
  });
});

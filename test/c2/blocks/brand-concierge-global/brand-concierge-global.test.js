import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import init from '../../../../libs/c2/blocks/brand-concierge-global/brand-concierge-global.js';
import {
  decorateAcomAssistantGnav,
  loadBrandConcierge,
} from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { loadAcomAssistantGnav } from '../../../../libs/features/acom-assistant-gnav.js';
import { getConfig, setConfig } from '../../../../libs/utils/utils.js';
import { waitFor } from '../../../helpers/waitfor.js';

describe('C2 Brand Concierge navigation renderer selection', () => {
  let originalConfig;
  let originalClient;
  let originalPrivacy;
  let originalOverlay;
  let metadata;
  let block;
  let initialize;
  let ready;
  let listenerSpy;

  before(() => {
    originalConfig = getConfig();
    originalClient = window.AdobeMessagingExperienceClient;
    originalPrivacy = window.adobePrivacy;
    originalOverlay = localStorage.getItem('bc-side-overlay');
    metadata = document.createElement('meta');
    metadata.name = 'acom-assistant';
  });

  beforeEach(() => {
    setConfig({
      codeRoot: '/libs',
      env: { name: 'stage' },
      jarvis: { id: 'c2-assistant', version: '2.0' },
    });
    metadata.content = 'on';
    document.head.append(metadata);
    document.body.innerHTML = `
      <header class="global-navigation">
        <nav><div class="feds-bc-wrapper"></div></nav>
      </header>
      <div class="brand-concierge-global">
        <div><div>Prompt one</div><div>Prompt two</div></div>
        <div><div>Ask Adobe anything</div></div>
      </div>
    `;
    block = document.querySelector('.brand-concierge-global');
    initialize = sinon.spy((config) => {
      config.callbacks.onReadyCallback();
      return { status: 'success' };
    });
    window.AdobeMessagingExperienceClient = { initialize };
    window.adobePrivacy = { activeCookieGroups: () => ['C0002'] };
    localStorage.setItem('bc-side-overlay', 'closed');
    listenerSpy = sinon.spy(window, 'addEventListener');
    ready = sinon.spy();
    window.addEventListener('bc:ready', ready);
  });

  afterEach(() => {
    listenerSpy.getCalls().forEach(({ args }) => window.removeEventListener(...args));
    listenerSpy.restore();
    metadata.remove();
    document.head.querySelectorAll('link[href$="/c2/blocks/brand-concierge-global/brand-concierge-global.css"]')
      .forEach((style) => style.remove());
    document.body.innerHTML = '';
    delete window.milo;
  });

  after(() => {
    window.AdobeMessagingExperienceClient = originalClient;
    window.adobePrivacy = originalPrivacy;
    if (originalOverlay === null) localStorage.removeItem('bc-side-overlay');
    else localStorage.setItem('bc-side-overlay', originalOverlay);
    setConfig(originalConfig);
  });

  it('skips the legacy renderer and styles when Federal loads an Assistant-enabled block', async () => {
    await loadBrandConcierge(block);
    decorateAcomAssistantGnav(document.querySelector('header'));

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(document.querySelector('.bc-gnav')).to.be.null;
    expect(document.querySelector('link[href$="/c2/blocks/brand-concierge-global/brand-concierge-global.css"]')).to.be.null;
    expect(block.children).to.have.lengthOf(0);
    expect(ready.called).to.be.false;
    expect(initialize.called).to.be.false;
  });

  it('also bypasses legacy listeners and restored overlays when the block loads directly', () => {
    localStorage.setItem('bc-side-overlay', 'open');
    init(block);

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(document.querySelector('.bc-gnav')).to.be.null;
    expect(document.querySelector('#brand-concierge-side')).to.be.null;
    expect(listenerSpy.withArgs('feds:signOut').called).to.be.false;
    expect(ready.called).to.be.false;
    expect(initialize.called).to.be.false;
  });

  it('keeps the legacy Federal renderer when Assistant metadata is off', async () => {
    metadata.content = 'off';
    await loadBrandConcierge(block);
    await waitFor(() => document.querySelector('.bc-gnav'));

    expect(document.querySelectorAll('.bc-gnav')).to.have.lengthOf(1);
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(listenerSpy.withArgs('feds:signOut').calledOnce).to.be.true;
    expect(ready.calledOnce).to.be.true;
  });

  it('keeps the legacy direct-block renderer when Assistant metadata is absent', async () => {
    metadata.remove();
    init(block);
    await waitFor(() => document.querySelector('.bc-gnav'));

    expect(document.querySelectorAll('.bc-gnav')).to.have.lengthOf(1);
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(ready.calledOnce).to.be.true;
  });

  it('retains authored prompts supplied before navigation mounts for delayed initialization', async () => {
    const header = document.querySelector('header');
    header.remove();
    await loadBrandConcierge(block);
    expect(initialize.called).to.be.false;
    document.body.prepend(header);
    decorateAcomAssistantGnav(header);
    await waitFor(() => window.milo?.brandConcierge?.brandConciergeGlobal);

    const foundation = document.createElement('meta');
    foundation.name = 'foundation';
    foundation.content = 'c2';
    const script = document.createElement('script');
    script.type = 'javascript/blocked';
    script.src = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    script.dataset.loaded = 'true';
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.css';
    document.head.append(foundation, script, style);

    try {
      await loadAcomAssistantGnav();
      expect(initialize.calledOnce).to.be.true;
      expect(initialize.firstCall.args[0].context.prompts)
        .to.deep.equal(['Prompt one', 'Prompt two'].map((label) => ({
          label,
          action: { click_analytics: `BC-suggested_prompt_clicked|gnav|${label}` },
        })));
      expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
      expect(document.querySelector('.bc-gnav')).to.be.null;
    } finally {
      foundation.remove();
      script.remove();
      style.remove();
    }
  });
});

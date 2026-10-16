import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setViewport } from '@web/test-runner-commands';
import init from '../../../../libs/c2/blocks/brand-concierge-global/brand-concierge-global.js';
import { loadBrandConcierge } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { decorateAcomAssistantGnav, loadAcomAssistantGnav } from '../../../../libs/features/acom-assistant-gnav.js';
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

  beforeEach(async () => {
    await setViewport({ width: 1200, height: 900 });
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

  it('skips the mobile mount through Federal and its post-render decoration with no-gnav-mobile', async () => {
    await setViewport({ width: 899, height: 900 });
    block.classList.add('no-gnav-mobile');
    await loadBrandConcierge(block);
    expect(decorateAcomAssistantGnav(document.querySelector('header'))).to.be.null;
    await loadAcomAssistantGnav();

    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(document.querySelector('.bc-gnav')).to.be.null;
    expect(block.children).to.have.lengthOf(0);
    expect(window.milo?.brandConcierge?.brandConciergeGlobal).not.to.be.true;
    expect(initialize.called).to.be.false;
  });

  it('also skips the mobile mount when a no-gnav-mobile block loads directly', async () => {
    await setViewport({ width: 899, height: 900 });
    block.classList.add('no-gnav-mobile');
    await init(block);
    await loadAcomAssistantGnav();

    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(block.children).to.have.lengthOf(0);
    expect(initialize.called).to.be.false;
  });

  it('mounts no-gnav-mobile authoring at exactly 900px', async () => {
    await setViewport({ width: 900, height: 900 });
    block.classList.add('no-gnav-mobile');
    await loadBrandConcierge(block);

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(window.milo.brandConcierge.brandConciergeGlobal).to.be.true;
  });

  it('skips the legacy renderer and styles when Federal loads an Assistant-enabled block', async () => {
    await setViewport({ width: 899, height: 900 });
    await loadBrandConcierge(block);
    decorateAcomAssistantGnav(document.querySelector('header'));

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(document.querySelector('.bc-gnav')).to.be.null;
    expect(document.querySelector('link[href$="/c2/blocks/brand-concierge-global/brand-concierge-global.css"]')).to.be.null;
    expect(block.children).to.have.lengthOf(0);
    expect(ready.called).to.be.false;
    expect(initialize.called).to.be.false;
  });

  it('also bypasses legacy listeners and restored overlays when the block loads directly', async () => {
    localStorage.setItem('bc-side-overlay', 'open');
    await init(block);

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
});

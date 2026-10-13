import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadBrandConcierge } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { decorateAcomAssistantGnav, loadAcomAssistantGnav } from '../../../../libs/features/acom-assistant-gnav.js';
import { getConfig, setConfig } from '../../../../libs/utils/utils.js';
import { waitFor } from '../../../helpers/waitfor.js';

// Separate test page isolates the page-wide Assistant singleton.
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

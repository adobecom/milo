import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { loadBrandConcierge } from '../../../../libs/c2/blocks/global-navigation/global-navigation.js';
import { decorateAcomAssistantGnav, loadAcomAssistantGnav } from '../../../../libs/features/acom-assistant-gnav.js';
import { getConfig, setConfig } from '../../../../libs/utils/utils.js';
import { waitFor } from '../../../helpers/waitfor.js';

// A separate test page keeps the once-per-page Assistant state free of earlier mounts.
describe('C2 Brand Concierge delayed Assistant initialization', () => {
  let originalConfig;
  let originalClient;
  let originalPrivacy;
  let metadata;
  let foundation;
  let script;
  let style;
  let initialize;

  before(() => {
    originalConfig = getConfig();
    originalClient = window.AdobeMessagingExperienceClient;
    originalPrivacy = window.adobePrivacy;
    setConfig({
      codeRoot: '/libs',
      env: { name: 'stage' },
      jarvis: { id: 'c2-assistant', version: '2.0' },
    });
    initialize = sinon.spy((config) => {
      config.callbacks.onReadyCallback();
      return { status: 'success' };
    });
    window.AdobeMessagingExperienceClient = { initialize };
    window.adobePrivacy = { activeCookieGroups: () => ['C0002'] };
    metadata = document.createElement('meta');
    metadata.name = 'acom-assistant';
    metadata.content = 'on';
    foundation = document.createElement('meta');
    foundation.name = 'foundation';
    foundation.content = 'c2';
    script = document.createElement('script');
    script.type = 'javascript/blocked';
    script.src = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    script.dataset.loaded = 'true';
    style = document.createElement('link');
    style.rel = 'stylesheet';
    style.type = 'text/plain';
    style.href = 'https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.css';
    document.head.append(metadata, foundation, script, style);
    document.body.innerHTML = `
      <header class="global-navigation">
        <nav><div class="feds-bc-wrapper"></div></nav>
      </header>
      <div class="brand-concierge-global">
        <div><div>Prompt one</div><div>Prompt two</div></div>
        <div><div>Ask Adobe anything</div></div>
      </div>
    `;
  });

  after(() => {
    metadata.remove();
    foundation.remove();
    script.remove();
    style.remove();
    document.body.innerHTML = '';
    delete window.milo;
    window.AdobeMessagingExperienceClient = originalClient;
    window.adobePrivacy = originalPrivacy;
    setConfig(originalConfig);
  });

  it('retains authored prompts supplied before navigation mounts for delayed initialization', async () => {
    const header = document.querySelector('header');
    header.remove();
    await loadBrandConcierge(document.querySelector('.brand-concierge-global'));
    expect(initialize.called).to.be.false;
    document.body.prepend(header);
    decorateAcomAssistantGnav(header);
    await waitFor(() => window.milo?.brandConcierge?.brandConciergeGlobal);

    await loadAcomAssistantGnav();
    expect(initialize.calledOnce).to.be.true;
    expect(initialize.firstCall.args[0].context.prompts)
      .to.deep.equal(['Prompt one', 'Prompt two'].map((label) => ({
        label,
        action: { click_analytics: `BC-suggested_prompt_clicked|gnav|${label}` },
      })));
    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(document.querySelector('.bc-gnav')).to.be.null;
  });
});

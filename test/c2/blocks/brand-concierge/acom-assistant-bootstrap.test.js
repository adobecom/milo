import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../../libs/utils/utils.js';
import { ensureAcomAssistant } from '../../../../libs/c2/blocks/brand-concierge/acom-assistant-bootstrap.js';

describe('C2 Brand Concierge Assistant page metadata', () => {
  let originalClient;
  let script;
  let metadata;

  before(() => {
    setConfig({ codeRoot: '/libs', env: { name: 'stage' } });
    originalClient = window.AdobeMessagingExperienceClient;
    const initialize = sinon.spy((config) => config.callbacks.onReadyCallback());
    window.AdobeMessagingExperienceClient = { initialize };
    script = document.createElement('script');
    script.type = 'javascript/blocked';
    script.src = 'https://dev-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    script.dataset.loaded = 'true';
    metadata = document.createElement('div');
    metadata.innerHTML = `
      <meta property="og:title" content="Adobe Creative Cloud">
      <meta property="og:description" content="Create something amazing.">
    `;
    metadata = [...metadata.children];
    document.head.append(script, ...metadata);
  });

  after(() => {
    script.remove();
    metadata.forEach((meta) => meta.remove());
    window.AdobeMessagingExperienceClient = originalClient;
  });

  it('passes Open Graph title and description as top-level initialization fields', async () => {
    await ensureAcomAssistant();

    const { initialize } = window.AdobeMessagingExperienceClient;
    expect(initialize.calledOnce).to.be.true;
    expect(initialize.firstCall.args[0]).to.include({
      pageTitle: 'Adobe Creative Cloud',
      pageDescription: 'Create something amazing.',
      componentid: 'brand-concierge',
    });
  });
});

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { setConfig } from '../../../../libs/utils/utils.js';
import { ensureAcomAssistant } from '../../../../libs/c2/blocks/brand-concierge/acom-assistant-bootstrap.js';
import init from '../../../../libs/c2/blocks/brand-concierge/brand-concierge.js';
import { waitFor } from '../../../helpers/waitfor.js';

describe('C2 Brand Concierge Assistant initialization', () => {
  let originalClient;
  let script;
  let metadata;

  before(() => {
    setConfig({ codeRoot: '/libs', env: { name: 'stage' } });
    originalClient = window.AdobeMessagingExperienceClient;
    const initialize = sinon.spy((config) => config.callbacks.onReadyCallback());
    window.AdobeMessagingExperienceClient = {
      initialize,
      openMessagingWindow: sinon.spy(),
      sendUserMessage: sinon.spy(),
    };
    script = document.createElement('script');
    script.type = 'javascript/blocked';
    script.src = 'https://stage-client.messaging.adobe.com/latest/AdobeMessagingClient.js';
    script.dataset.loaded = 'true';
    metadata = document.createElement('div');
    metadata.innerHTML = `
      <meta property="og:title" content="Adobe Creative Cloud">
      <meta property="og:description" content="Create something amazing.">
      <meta name="gnav-brand-concierge" content="off">
      <meta name="acom-assistant" content="on">
      <meta name="jarvis-surface-id" content="adobedotcom-jcbc">
    `;
    metadata = [...metadata.children];
    document.head.append(script, ...metadata);
  });

  after(() => {
    script.remove();
    metadata.forEach((meta) => meta.remove());
    window.AdobeMessagingExperienceClient = originalClient;
    document.body.innerHTML = '';
  });

  it('preloads a floating footer without GNav before interaction and reuses the client for inline blocks', async () => {
    const markup = await readFile({ path: '../../../blocks/brand-concierge/mocks/default.html' });
    document.body.innerHTML = markup;
    const footer = document.querySelector('.brand-concierge');
    footer.classList.add('floating-input-only');
    await init(footer);

    const client = window.AdobeMessagingExperienceClient;
    await waitFor(() => client.initialize.called);
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.initialize.firstCall.args[0].appid).to.equal('adobedotcom-jcbc');
    expect(client.openMessagingWindow.called).to.be.false;
    expect(client.sendUserMessage.called).to.be.false;
    expect(document.getElementById('acomAssistant-gnav-mount')).to.not.exist;

    footer.querySelector('.prompt-card-button').click();
    await waitFor(() => client.sendUserMessage.called);
    expect(client.sendUserMessage.firstCall.args[0].label).to.equal('Prompt one');
    expect(client.openMessagingWindow.calledOnce).to.be.true;

    for (const variant of ['', 'floating-button-only']) {
      const container = document.createElement('div');
      container.innerHTML = markup;
      const block = container.querySelector('.brand-concierge');
      if (variant) block.classList.add(variant);
      document.body.append(container);
      await init(block);
    }
    await ensureAcomAssistant();
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.openMessagingWindow.calledOnce).to.be.true;
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
    expect(initialize.firstCall.args[0]).to.not.have.property('gnavFabState');
  });
});

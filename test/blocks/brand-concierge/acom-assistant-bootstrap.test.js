import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { readFile } from '@web/test-runner-commands';
import { setConfig } from '../../../libs/utils/utils.js';
import { ensureAcomAssistant } from '../../../libs/blocks/brand-concierge/acom-assistant-bootstrap.js';
import init from '../../../libs/blocks/brand-concierge/brand-concierge.js';
import { waitFor } from '../../helpers/waitfor.js';

describe('C1 Brand Concierge Assistant initialization', () => {
  let originalClient;
  let nodes;

  before(() => {
    setConfig({ codeRoot: '/libs', env: { name: 'stage' } });
    originalClient = window.AdobeMessagingExperienceClient;
    const initialize = sinon.spy((config) => config.callbacks.onReadyCallback());
    window.AdobeMessagingExperienceClient = {
      initialize,
      openMessagingWindow: sinon.spy(),
      sendUserMessage: sinon.spy(),
    };
    const holder = document.createElement('div');
    holder.innerHTML = `
      <script type="javascript/blocked" data-loaded="true"
        src="https://stage-client.messaging.adobe.com/latest/AdobeMessagingClient.js"></script>
      <meta name="gnav-brand-concierge-state" content="hidden">
      <meta name="gnav-brand-concierge" content="off">
      <meta name="acom-assistant" content="on">
      <meta name="jarvis-surface-id" content="adobedotcom-jcbc">
    `;
    nodes = [...holder.children];
    document.head.append(...nodes);
  });

  after(() => {
    for (const node of nodes) node.remove();
    window.AdobeMessagingExperienceClient = originalClient;
    document.body.innerHTML = '';
  });

  it('preloads without GNav before an inline prompt is clicked and reuses the client for floating blocks', async () => {
    const markup = await readFile({ path: './mocks/default.html' });
    document.body.innerHTML = markup;
    await init(document.querySelector('.brand-concierge'));

    const client = window.AdobeMessagingExperienceClient;
    await waitFor(() => client.initialize.called);
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.initialize.firstCall.args[0].appid).to.equal('adobedotcom-jcbc');
    expect(client.openMessagingWindow.called).to.be.false;
    expect(client.sendUserMessage.called).to.be.false;
    expect(document.getElementById('acomAssistant-gnav-mount')).to.not.exist;

    document.querySelector('.prompt-card-button').click();
    await waitFor(() => client.sendUserMessage.called);
    expect(client.sendUserMessage.firstCall.args[0].label).to.equal('Prompt one');
    expect(client.openMessagingWindow.calledOnce).to.be.true;

    for (const variant of ['floating-input-only', 'floating-button-only']) {
      const container = document.createElement('div');
      container.innerHTML = markup;
      const block = container.querySelector('.brand-concierge');
      block.classList.add(variant);
      document.body.append(container);
      await init(block);
    }
    await ensureAcomAssistant();
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.openMessagingWindow.calledOnce).to.be.true;
  });

  it('passes gnavFabState from gnav-brand-concierge-state metadata', async () => {
    await ensureAcomAssistant();

    const { initialize } = window.AdobeMessagingExperienceClient;
    expect(initialize.calledOnce).to.be.true;
    expect(initialize.firstCall.args[0].gnavFabState).to.equal('hidden');
  });
});

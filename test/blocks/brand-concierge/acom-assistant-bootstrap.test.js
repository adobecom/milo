import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import { ensureAcomAssistant } from '../../../libs/blocks/brand-concierge/acom-assistant-bootstrap.js';

describe('C1 Brand Concierge Assistant GNav state', () => {
  let originalClient;
  let nodes;

  before(() => {
    setConfig({ codeRoot: '/libs', env: { name: 'stage' } });
    originalClient = window.AdobeMessagingExperienceClient;
    const initialize = sinon.spy((config) => config.callbacks.onReadyCallback());
    window.AdobeMessagingExperienceClient = { initialize };
    const holder = document.createElement('div');
    holder.innerHTML = `
      <script type="javascript/blocked" data-loaded="true"
        src="https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.js"></script>
      <meta name="gnav-brand-concierge-state" content="hidden">
    `;
    nodes = [...holder.children];
    document.head.append(...nodes);
  });

  after(() => {
    for (const node of nodes) node.remove();
    window.AdobeMessagingExperienceClient = originalClient;
  });

  it('passes gnavFabState from gnav-brand-concierge-state metadata', async () => {
    await ensureAcomAssistant();

    const { initialize } = window.AdobeMessagingExperienceClient;
    expect(initialize.calledOnce).to.be.true;
    expect(initialize.firstCall.args[0].gnavFabState).to.equal('hidden');
  });
});

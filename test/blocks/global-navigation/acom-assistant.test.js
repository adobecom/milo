import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createFullGlobalNavigation } from './test-utilities.js';
import globalNavigationMock from './mocks/global-navigation.plain.js';
import { loadAcomAssistantGnav } from '../../../libs/features/acom-assistant-gnav.js';

describe('C1 global navigation authored Assistant entry point', () => {
  let originalClient;
  let client;

  before(() => {
    originalClient = window.AdobeMessagingExperienceClient;
    client = {
      initialize: sinon.spy((config) => {
        config.callbacks.onReadyCallback();
        return { status: 'success' };
      }),
    };
    window.AdobeMessagingExperienceClient = client;
    document.head.insertAdjacentHTML('beforeend', `
      <script src="https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.js"
        type="javascript/blocked" data-loaded="true"></script>
      <link rel="stylesheet"
        href="https://integration-client.messaging.adobe.com/latest/AdobeMessagingClient.css">
      <script src="https://auth.services.adobe.com/imslib/imslib.min.js"
        type="javascript/blocked" data-loaded="true"></script>
    `);
  });

  beforeEach(() => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="acom-assistant" content="on">');
  });

  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('meta[name="acom-assistant"], meta[name="gnav-brand-concierge"]')
      .forEach((meta) => meta.remove());
    document.body.innerHTML = '';
    delete window.milo;
  });

  after(() => {
    window.AdobeMessagingExperienceClient = originalClient;
  });

  const authoredNav = `${globalNavigationMock}
    <div class="brand-concierge-global">
      <div><div>Help me choose an app</div></div>
      <div><div>Ask Adobe anything</div></div>
    </div>`;

  it('does not add an entry point with only the Assistant flag enabled', async () => {
    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper')).to.be.null;
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(document.querySelector('meta[name="acom-assistant"][content="on"]')).to.exist;
    expect(client.initialize.called).to.be.false;
  });

  it('does not mount Assistant when the authored wrapper is disabled', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="off">');
    await createFullGlobalNavigation({ globalNavigation: authoredNav, imsInitialized: true });

    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(client.initialize.called).to.be.false;
  });

  it('uses Assistant for an authored entry point and retains authored prompts', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({ globalNavigation: authoredNav, imsInitialized: true });
    expect(client.initialize.called).to.be.false;
    await loadAcomAssistantGnav();

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.initialize.firstCall.args[0].context.prompts)
      .to.deep.equal([{
        label: 'Help me choose an app',
        action: { click_analytics: 'BC-suggested_prompt_clicked|gnav|Help me choose an app' },
      }]);
    expect(document.querySelector('.bc-gnav')).to.be.null;
  });

  it('mounts Assistant in the authored wrapper without requiring a BC block', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({ imsInitialized: true });
    await loadAcomAssistantGnav();

    expect(document.querySelector('.feds-bc-wrapper #acomAssistant-gnav-mount')).to.exist;
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('does not mount Assistant when metadata is off without removing the authored wrapper', async () => {
    document.querySelector('meta[name="acom-assistant"]').content = 'off';
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper')).to.exist;
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(client.initialize.called).to.be.false;
  });
});

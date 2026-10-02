import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createFullGlobalNavigation } from './test-utilities.js';
import globalNavigationMock from './mocks/global-navigation.plain.js';
import localNavigationMock from './mocks/gnav-with-localnav.plain.js';
import { ensureAcomAssistant } from '../../../libs/blocks/brand-concierge/acom-assistant-bootstrap.js';
import { decorateNavWithAssistant } from '../../../libs/blocks/brand-concierge-global/brand-concierge-global.js';

describe('C1 global navigation Assistant opt-in', () => {
  let originalUrl;
  let originalClient;
  let client;

  before(() => {
    originalUrl = window.location.href;
    originalClient = window.AdobeMessagingExperienceClient;
    client = {
      initialize: sinon.spy((config) => {
        config.callbacks.onReadyCallback();
        return { status: 'success' };
      }),
    };
    window.AdobeMessagingExperienceClient = client;
    document.head.insertAdjacentHTML('beforeend', `
      <script src="https://dev-client.messaging.adobe.com/latest/AdobeMessagingClient.js"
        type="javascript/blocked" data-loaded="true"></script>
      <link rel="stylesheet" href="https://dev-client.messaging.adobe.com/latest/AdobeMessagingClient.css">
      <script src="https://auth.services.adobe.com/imslib/imslib.min.js"
        type="javascript/blocked" data-loaded="true"></script>
    `);
  });

  beforeEach(() => {
    window.history.replaceState(null, '', `${window.location.pathname}?acom-assistant=on`);
  });

  afterEach(() => {
    sinon.restore();
    document.querySelectorAll('meta[name="acom-assistant"], meta[name="gnav-brand-concierge"]')
      .forEach((meta) => meta.remove());
    window.history.replaceState(null, '', originalUrl);
    document.body.innerHTML = '';
    delete window.milo;
  });

  after(() => {
    window.AdobeMessagingExperienceClient = originalClient;
  });

  it('keeps authored prompts while ignoring disabled Brand Concierge metadata', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="off">');
    const authoredNav = `${globalNavigationMock}
      <div class="brand-concierge-global">
        <div><div>Help me choose an app</div></div>
        <div><div>Ask Adobe anything</div></div>
      </div>`;

    await createFullGlobalNavigation({ globalNavigation: authoredNav, imsInitialized: true });
    await ensureAcomAssistant();

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.initialize.firstCall.args[0].context.prompts)
      .to.deep.equal([{ label: 'Help me choose an app' }]);
    expect(document.querySelector('.bc-gnav')).to.be.null;
  });

  it('shows Assistant without an authored block or Brand Concierge metadata', async () => {
    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper #acomAssistant-gnav-mount')).to.exist;
    expect(window.milo.brandConcierge.brandConciergeGlobal).to.be.true;
  });

  it('shows Assistant in local navigation on mobile', async () => {
    await createFullGlobalNavigation({
      viewport: 'mobile',
      globalNavigation: localNavigationMock,
      imsInitialized: true,
    });

    expect(document.querySelector('header.local-nav #acomAssistant-gnav-mount')).to.exist;
  });

  it('enables Assistant through metadata alone', async () => {
    window.history.replaceState(null, '', window.location.pathname);
    document.head.insertAdjacentHTML('beforeend', '<meta name="acom-assistant" content="on">');

    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('#acomAssistant-gnav-mount')).to.exist;
  });

  it('lets the off URL parameter override on metadata', async () => {
    window.history.replaceState(null, '', `${window.location.pathname}?acom-assistant=off`);
    document.head.insertAdjacentHTML('beforeend', '<meta name="acom-assistant" content="on">');

    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper')).to.be.null;
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
  });

  it('does not opt in when the flag is absent', async () => {
    window.history.replaceState(null, '', window.location.pathname);

    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper')).to.be.null;
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
  });

  it('does not duplicate the mount when the authored decorator also runs', async () => {
    await createFullGlobalNavigation({ imsInitialized: true });
    const topNav = document.querySelector('nav.feds-topnav');

    decorateNavWithAssistant(null, topNav);
    decorateNavWithAssistant(null, topNav);

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(client.initialize.calledOnce).to.be.true;
  });
});

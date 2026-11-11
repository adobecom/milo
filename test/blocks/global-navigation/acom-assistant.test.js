import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { createFullGlobalNavigation, loadStyles } from './test-utilities.js';
import globalNavigationMock from './mocks/global-navigation.plain.js';
import { ensureAcomAssistant } from '../../../libs/blocks/brand-concierge/acom-assistant-bootstrap.js';
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
      <script src="https://stage-client.messaging.adobe.com/latest/AdobeMessagingClient.js"
        type="javascript/blocked" data-loaded="true"></script>
      <link rel="stylesheet"
        href="https://stage-client.messaging.adobe.com/latest/AdobeMessagingClient.css">
      <script src="https://auth.services.adobe.com/imslib/imslib.min.js"
        type="javascript/blocked" data-loaded="true"></script>
    `);
  });

  beforeEach(() => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="acom-assistant" content="on">');
  });

  afterEach(() => {
    sinon.restore();
    const metas = document.querySelectorAll([
      'meta[name="acom-assistant"]',
      'meta[name="gnav-brand-concierge"]',
      'meta[name="gnav-brand-concierge-state"]',
    ].join(', '));
    for (const meta of metas) meta.remove();
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
    expect(client.initialize.called).to.be.false;
  });

  it('does not mount Assistant when the authored wrapper is disabled', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="off">');
    await createFullGlobalNavigation({ globalNavigation: authoredNav, imsInitialized: true });

    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(client.initialize.called).to.be.false;
  });

  it('does not mount or initialize Assistant below 900px with no-gnav-mobile authoring', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({
      globalNavigation: authoredNav.replace('class="brand-concierge-global"', 'class="brand-concierge-global no-gnav-mobile"'),
      viewport: 'mobile',
      imsInitialized: true,
    });
    await loadAcomAssistantGnav();

    expect(document.querySelector('.feds-bc-wrapper')).to.exist;
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
    expect(document.querySelector('.bc-gnav')).to.be.null;
    expect(client.initialize.called).to.be.false;
    expect(window.milo?.brandConcierge?.brandConciergeGlobal).not.to.be.true;
  });

  it('uses Assistant for an authored entry point and retains authored prompts', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({
      globalNavigation: authoredNav.replace('class="brand-concierge-global"', 'class="brand-concierge-global no-gnav-mobile"'),
      imsInitialized: true,
    });
    await ensureAcomAssistant();

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(client.initialize.calledOnce).to.be.true;
    expect(client.initialize.firstCall.args[0].context.prompts)
      .to.deep.equal([{
        label: 'Help me choose an app',
        action: { click_analytics: 'BC-suggested_prompt_clicked|gnav|Help me choose an app' },
      }]);
    expect(document.querySelector('.bc-gnav')).to.be.null;
  });

  it('keeps the authored Assistant entry point below 900px without no-gnav-mobile', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({
      globalNavigation: authoredNav,
      viewport: 'mobile',
      imsInitialized: true,
    });

    expect(document.querySelectorAll('#acomAssistant-gnav-mount')).to.have.lengthOf(1);
    expect(window.milo.brandConcierge.brandConciergeGlobal).to.be.true;
  });

  it('mounts Assistant in the authored wrapper without requiring a BC block', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({ viewport: 'mobile', imsInitialized: true });
    await ensureAcomAssistant();

    expect(document.querySelector('.feds-bc-wrapper #acomAssistant-gnav-mount')).to.exist;
    expect(client.initialize.calledOnce).to.be.true;
  });

  it('does not set the wrapper data-fab-state by default', async () => {
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper').hasAttribute('data-fab-state')).to.be.false;
  });

  describe('with GNav styles', () => {
    before(() => loadStyles('/libs/blocks/global-navigation/global-navigation.css'));

    const renderState = async (state) => {
      document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
      document.head.insertAdjacentHTML('beforeend', `<meta name="gnav-brand-concierge-state" content="${state}">`);
      await createFullGlobalNavigation({ imsInitialized: true });
      const wrapper = document.querySelector('.feds-bc-wrapper');
      expect(wrapper.dataset.fabState).to.equal(state);
      return wrapper;
    };

    it('caps the collapsed mount at the 40px icon width', async () => {
      const wrapper = await renderState('collapsed');
      const mount = wrapper.querySelector('#acomAssistant-gnav-mount');
      expect(getComputedStyle(mount).maxWidth).to.equal('40px');
    });

    it('renders the hidden wrapper as an invisible zero-width spacer', async () => {
      const wrapper = await renderState('hidden');
      const style = getComputedStyle(wrapper);
      expect(wrapper.querySelector('#acomAssistant-gnav-mount')).to.exist;
      expect(wrapper.getBoundingClientRect().width).to.equal(0);
      expect(style.paddingInlineStart).to.equal('0px');
      expect(style.paddingInlineEnd).to.equal('0px');
      expect(style.visibility).to.equal('hidden');
    });
  });

  it('does not mount Assistant when metadata is off without removing the authored wrapper', async () => {
    document.querySelector('meta[name="acom-assistant"]').content = 'off';
    document.head.insertAdjacentHTML('beforeend', '<meta name="gnav-brand-concierge" content="on">');
    await createFullGlobalNavigation({ imsInitialized: true });

    expect(document.querySelector('.feds-bc-wrapper')).to.exist;
    expect(document.querySelector('#acomAssistant-gnav-mount')).to.be.null;
  });
});

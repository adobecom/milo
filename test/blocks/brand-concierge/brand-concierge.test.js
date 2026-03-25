import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA' });

const { default: init, updateReplicatedValue, getUpdatedChatUIConfig, createSusiComponentForModal } = await import('../../../libs/blocks/brand-concierge/brand-concierge.js');

describe('Brand Concierge', () => {
  it('decorates default variant with header, cards, input and legal, and sets background', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.brand-concierge');
    await init(block);

    // background variable set
    expect(block.style.getPropertyValue('--brand-concierge-bg').trim()).to.equal('#fff');

    // header
    const header = block.querySelector('.bc-header');
    expect(header).to.exist;
    expect(header.querySelector('.bc-header-title').textContent.trim()).to.equal('AI Assistant');
    expect(header.querySelector('.bc-header-subtitle').textContent.trim()).to.equal('How can we help?');

    // cards
    const cards = block.querySelector('.bc-prompt-cards');
    expect(cards).to.exist;
    const buttons = cards.querySelectorAll('.prompt-card-button');
    expect(buttons.length).to.equal(2);
    // second card has picture and class assigned to picture
    const secondPicture = buttons[1].querySelector('picture');
    expect(secondPicture).to.exist;
    expect(secondPicture.classList.contains('prompt-card-image')).to.be.true;

    // input field
    const inputField = block.querySelector('.bc-input-field');
    expect(inputField).to.exist;
    const input = inputField.querySelector('#bc-input-field');
    expect(input).to.exist;
    expect(input.getAttribute('placeholder')).to.equal("Tell us what you'd like to do or create");
    const tooltip = inputField.querySelector('#bc-label-tooltip');
    const label = inputField.querySelector('.bc-input-field-label');
    expect(tooltip).to.exist;
    expect(label.getAttribute('aria-describedby')).to.equal('bc-label-tooltip');

    // legal
    const legal = block.querySelector('.bc-legal');
    expect(legal).to.exist;
    expect(legal.textContent).to.contain('Terms');
  });

  it('renders input before cards when input-first is set', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/input-first.html' });
    const block = document.querySelector('.brand-concierge.input-first');
    await init(block);

    const children = [...block.children];
    expect(children[0].classList.contains('bc-header')).to.be.true;
    expect(children[1].classList.contains('bc-input-field')).to.be.true;
    expect(children[2].classList.contains('bc-prompt-cards')).to.be.true;
    expect(children[3].classList.contains('bc-legal')).to.be.true;
  });

  it('enables send button on input and opens modal on Enter', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.brand-concierge');

    await init(block);

    const input = block.querySelector('#bc-input-field');
    const button = block.querySelector('button.input-field-button');
    expect(button.disabled).to.equal(true);

    input.value = 'Hello world';
    input.dispatchEvent(new Event('input'));
    expect(button.disabled).to.equal(false);

    // trigger submit via Enter
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const modal = await waitForElement('#brand-concierge-modal');
    expect(modal).to.exist;
    expect(modal.querySelector('#brand-concierge-mount')).to.exist;
    expect(modal.querySelector('#brand-concierge-mount').dataset.initialMessage).to.equal('Hello world');

    // analytics labels on modal controls
    const close = modal.querySelector('.dialog-close');
    const curtain = document.querySelector('.modal-curtain');
    expect(close.getAttribute('daa-ll')).to.equal('Filters|testAA|bc#modal-close');
    expect(curtain.getAttribute('daa-ll')).to.equal('Filters|testAA|bc#modal-close');

    // input cleared after opening
    expect(block.querySelector('#bc-input-field').value).to.equal('');
  });

  it('clicking a prompt card fills input and opens modal with card text', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.brand-concierge');
    await init(block);

    const buttons = block.querySelectorAll('.prompt-card-button');
    buttons[1].click();

    const modal = await waitForElement('#brand-concierge-modal');
    const mount = modal.querySelector('#brand-concierge-mount');
    expect(mount).to.exist;
    expect(mount.dataset.initialMessage).to.contain('Prompt two');
  });

  describe('Privacy Consent Handling', () => {
    let block;
    let originalAdobePrivacy;
    let originalLana;

    beforeEach(async () => {
      document.body.innerHTML = await readFile({ path: './mocks/default.html' });
      block = document.querySelector('.brand-concierge');
      originalAdobePrivacy = window.adobePrivacy;
      originalLana = window.lana;
    });

    afterEach(() => {
      window.adobePrivacy = originalAdobePrivacy;
      window.lana = originalLana;
      sinon.restore();
    });

    it('shows the block if privacy hasnt loaded yet', async () => {
      window.adobePrivacy = undefined;
      await init(block);
      expect(block.classList.contains('hide-block')).to.be.false;
    });

    it('hides the block if the user rejects all cookies', async () => {
      window.adobePrivacy = undefined;
      await init(block);
      expect(block.classList.contains('hide-block')).to.be.false;
      window.adobePrivacy = { activeCookieGroups: sinon.stub().returns(['C0001']) };
      window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyReject'));
      expect(block.classList.contains('hide-block')).to.be.true;
    });

    it('hides the block if the user rejects performance cookies', async () => {
      window.adobePrivacy = undefined;
      await init(block);
      expect(block.classList.contains('hide-block')).to.be.false;
      window.adobePrivacy = { activeCookieGroups: sinon.stub().returns(['C0001', 'C0003']) };
      window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyReject'));
      expect(block.classList.contains('hide-block')).to.be.true;
    });
  });

  describe('updateReplicatedValue', () => {
    let textareaWrapper;
    let textarea;

    beforeEach(() => {
      textareaWrapper = document.createElement('div');
      textarea = document.createElement('textarea');
    });

    it('sets replicatedValue to textarea placeholder when value is empty', () => {
      textarea.value = '';
      textarea.placeholder = 'Enter your message here';
      updateReplicatedValue(textareaWrapper, textarea);
      expect(textareaWrapper.dataset.replicatedValue).to.equal('Enter your message here');
    });

    it('prioritizes value over placeholder when both exist', () => {
      textarea.value = 'Actual input';
      textarea.placeholder = 'Placeholder text';
      updateReplicatedValue(textareaWrapper, textarea);
      expect(textareaWrapper.dataset.replicatedValue).to.equal('Actual input');
    });
  });

  it('getUpdatedChatUIConfig returns config with authored content', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.brand-concierge');
    await init(block);

    const config = getUpdatedChatUIConfig();
    expect(config).to.exist;
    expect(config.text['welcome.heading']).to.equal('AI Assistant');
    expect(config.text['welcome.subheading']).to.equal('How can we help?');
    expect(config.text['input.placeholder']).to.equal("Tell us what you'd like to do or create");
    expect(config.arrays['welcome.examples']).to.be.an('array');
    expect(config.arrays['welcome.examples'].length).to.equal(2);
    expect(config.arrays['welcome.examples'][0].text).to.equal('Prompt one');
    expect(config.arrays['welcome.examples'][1].text).to.equal('Prompt two');
  });

  it('removes query parameters from background image URL', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/background-image.html' });
    const block = document.querySelector('.brand-concierge');
    await init(block);

    expect(block.classList.contains('has-bg-image')).to.be.true;
    const bgValue = block.style.getPropertyValue('--brand-concierge-bg');
    expect(bgValue).to.contain('url(');
    expect(bgValue).to.contain('https://example.com/image.jpg');
    expect(bgValue).to.not.contain('?width=200');
    expect(bgValue).to.not.contain('&height=300');
  });

  it('decorates floating button with correct structure and opens modal on click', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/floating-button.html' });
    const block = document.querySelector('.brand-concierge.floating-button');
    await init(block);

    const floatingButton = block.querySelector('.bc-floating-button');
    expect(floatingButton).to.exist;
    expect(floatingButton.querySelector('.bc-floating-icon')).to.exist;
    expect(floatingButton.querySelector('.bc-floating-input')).to.exist;
    expect(floatingButton.querySelector('.bc-floating-input').textContent.trim()).to.equal('Tell us what you\'d like to do or create');
    expect(floatingButton.querySelector('.bc-floating-submit')).to.exist;

    floatingButton.click();

    const modal = await waitForElement('#brand-concierge-modal');
    expect(modal).to.exist;
    const mount = modal.querySelector('#brand-concierge-mount');
    expect(mount).to.exist;
    expect(mount.dataset.initialMessage).to.be.undefined;
  });

  it('sets up bootstrap API parameters, onBeforeEventSend callback, and event handlers correctly', async () => {
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    const block = document.querySelector('.brand-concierge');

    // Mock window.adobe.concierge.bootstrap to be available immediately
    const bootstrapSpy = sinon.spy();
    window.adobe = { concierge: { bootstrap: bootstrapSpy } };

    await init(block);

    const input = block.querySelector('#bc-input-field');
    input.value = 'Test message';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const modal = await waitForElement('#brand-concierge-modal');
    expect(modal).to.exist;

    // Wait for bootstrap to be called (waitForCondition checks for API availability)
    await new Promise((resolve) => {
      const checkBootstrap = () => {
        if (bootstrapSpy.called) {
          resolve();
        } else {
          setTimeout(checkBootstrap, 50);
        }
      };
      setTimeout(() => resolve(), 2000);
      checkBootstrap();
    });

    const bootstrapArgs = bootstrapSpy.firstCall.args[0];
    expect(bootstrapArgs.instanceName).to.equal('alloy');
    expect(bootstrapArgs.selector).to.equal('#brand-concierge-mount');
    expect(bootstrapArgs.stylingConfigurations).to.exist;
    expect(bootstrapArgs.onBeforeEventSend).to.be.a('function');

    // Verify onBeforeEventSend callback sets up XDM data correctly
    const content = {};
    bootstrapArgs.onBeforeEventSend(content);
    expect(content.xdm).to.exist;
    expect(content.xdm.web.webPageDetails.URL).to.equal(window.location.href);
    expect(content.xdm.environment.browserDetails.userAgent).to.equal(window.navigator.userAgent);
    // eslint-disable-next-line no-underscore-dangle
    expect(content.xdm.environment._dc.language).to.equal(window.navigator.language);

    // Verify event listener for sign-in is set up on mount element
    const mount = modal.querySelector('#brand-concierge-mount');
    expect(mount).to.exist;
    // Event listener is attached (mount element can receive events)
    const signInEvent = new CustomEvent('bc:cta-action', {
      detail: { action: 'sign-in' },
      bubbles: true,
    });
    mount.dispatchEvent(signInEvent);

    // Clean up
    delete window.adobe;
  });

  it('createSusiComponentForModal creates SUSI component with correct properties and event listeners', () => {
    const onCloseRedirect = sinon.spy();
    const onSuccessfulToken = sinon.spy();
    const originalLana = window.lana;
    window.lana = { log: sinon.spy() };

    const authParams = {
      dt: false,
      locale: 'en-us',
      response_type: 'token',
      client_id: 'test-client-id',
    };
    const config = { consentProfile: 'free', fullWidth: true };
    const variant = 'standard';
    const redirectUrl = 'https://example.com/redirect';
    const isStage = true;
    const popup = true;

    const susi = createSusiComponentForModal({
      authParams,
      config,
      variant,
      redirectUrl,
      isStage,
      popup,
      onCloseRedirect,
      onSuccessfulToken,
    });

    // Verify element is created
    expect(susi.tagName.toLowerCase()).to.equal('susi-sentry-light');

    // Verify properties are set correctly
    expect(susi.authParams).to.deep.include({ ...authParams, redirect_uri: redirectUrl });
    expect(susi.config).to.equal(config);
    expect(susi.variant).to.equal(variant);
    expect(susi.popup).to.be.true;
    expect(susi.stage).to.equal('true');

    // Test redirect event with popup
    const redirectEvent = new CustomEvent('redirect', { detail: 'https://example.com/auth' });
    susi.dispatchEvent(redirectEvent);
    expect(onCloseRedirect.calledOnce).to.be.true;

    // Test error event
    const errorEvent = new CustomEvent('on-error', { detail: { error: 'test error' } });
    susi.dispatchEvent(errorEvent);
    expect(window.lana.log.calledWith('SUSI Light error:', errorEvent)).to.be.true;

    // Test analytics event
    const analyticsEvent = new CustomEvent('on-analytics');
    susi.dispatchEvent(analyticsEvent);
    // Analytics handler is a no-op, just verify it doesn't throw

    // Test successful token event
    const tokenEvent = new CustomEvent('on-token', { detail: 'test-token' });
    susi.dispatchEvent(tokenEvent);
    expect(onSuccessfulToken.calledOnce).to.be.true;
    expect(onSuccessfulToken.firstCall.args[0].detail).to.equal('test-token');

    // Test auth failed event
    const authFailedEvent = new CustomEvent('on-auth-failed');
    susi.dispatchEvent(authFailedEvent);
    // Auth failed handler is a no-op, just verify it doesn't throw

    // Test without onSuccessfulToken
    const susiNoToken = createSusiComponentForModal({
      authParams,
      config,
      variant,
      redirectUrl,
      isStage: false,
      popup: true,
      onCloseRedirect,
    });
    const tokenEventNoHandler = new CustomEvent('on-token', { detail: 'test-token' });
    susiNoToken.dispatchEvent(tokenEventNoHandler);
    // Should not throw even without onSuccessfulToken handler

    // Clean up
    window.lana = originalLana;
  });
});

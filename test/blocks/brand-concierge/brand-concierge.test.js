/* eslint-disable no-underscore-dangle */
import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA' });

const { default: init, getUpdatedChatUIConfig, updateReplicatedValue } = await import('../../../libs/blocks/brand-concierge/brand-concierge.js');
const { default: chatUIConfig } = await import('../../../libs/blocks/brand-concierge/chat-ui-config.js');

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

    // Mock window._satellite.track before init
    const oldSatellite = window._satellite;
    const trackStub = sinon.stub();
    window._satellite = { track: trackStub };

    await init(block);

    const input = block.querySelector('#bc-input-field');
    const button = block.querySelector('button.input-field-button');
    expect(button.disabled).to.equal(true);

    input.value = 'Hello world';
    input.dispatchEvent(new Event('input'));
    expect(button.disabled).to.equal(false);

    // trigger submit via Enter
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', bubbles: true }));

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

    // Verify bootstrapConversationalExperience was called
    expect(trackStub.calledOnce).to.be.true;
    expect(trackStub.firstCall.args[0]).to.equal('bootstrapConversationalExperience');
    expect(trackStub.firstCall.args[1]).to.deep.include({
      selector: '#brand-concierge-mount',
      src: 'https://cdn.experience.adobe.net/solutions/experience-platform-brand-concierge-web-agent/static-assets/main.js',
      stylingConfigurations: chatUIConfig,
    });

    // Clean up
    window._satellite = oldSatellite;
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

  describe('getUpdatedChatUIConfig', () => {
    const originalChatUIConfig = JSON.parse(JSON.stringify(chatUIConfig));
    it('returns original chatUIConfig when no placeholder is provided', () => {
      const result = getUpdatedChatUIConfig();
      expect(result).to.deep.equal(originalChatUIConfig);
      expect(result.text['input.placeholder']).to.equal('Tell us what you\'d like to do or create');
    });

    it('updates the input placeholder', () => {
      const customPlaceholder = 'Custom placeholder text';
      const result = getUpdatedChatUIConfig(customPlaceholder);

      expect(result.text['input.placeholder']).to.equal(customPlaceholder);
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
});

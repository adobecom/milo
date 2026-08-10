import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitForElement, waitFor, delay } from '../../helpers/waitfor.js';
import { setConfig } from '../../../libs/utils/utils.js';

setConfig({ codeRoot: '/libs', brandConciergeAA: 'testAA' });

const { default: init } = await import('../../../libs/blocks/brand-concierge-global/brand-concierge-global.js');

describe('Brand Concierge Global', () => {
  let block;
  let originalAdobePrivacy;
  let originalLana;

  beforeEach(async () => {
    localStorage.removeItem('bc-side-overlay');
    document.body.classList.remove('bc-side-open', 'disable-scroll');
    document.body.innerHTML = await readFile({ path: './mocks/default.html' });
    block = document.querySelector('.brand-concierge-global');
    originalAdobePrivacy = window.adobePrivacy;
    originalLana = window.lana;
  });

  afterEach(() => {
    sinon.restore();
    window.adobePrivacy = originalAdobePrivacy;
    window.lana = originalLana;
    delete window.adobe;
    delete window.milo;
    localStorage.removeItem('bc-side-overlay');
    document.body.classList.remove('bc-side-open', 'disable-scroll');
    document.querySelectorAll('.dialog-modal, .modal-curtain').forEach((n) => n.remove());
  });

  it('decorates the gnav with a button, input and cards, sets the global flag and cleans up', async () => {
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');

    // injected into the gnav wrapper, not the authored block
    expect(document.querySelector('.feds-bc-wrapper .bc-gnav')).to.equal(bcGnav);

    // gnav button with the AI icon
    const button = bcGnav.querySelector('.bc-gnav-button .gnav-button');
    expect(button).to.exist;
    expect(button.querySelector('svg.gnav-button-icon')).to.exist;

    // input with authored placeholder
    const inputField = bcGnav.querySelector('.bc-input-field');
    expect(inputField).to.exist;
    const textarea = inputField.querySelector('textarea');
    expect(textarea.getAttribute('placeholder')).to.equal('Ask Adobe anything');

    // cards rendered without icons (hasIcon = false for the gnav variant)
    const cards = bcGnav.querySelector('.bc-prompt-cards');
    expect(cards).to.exist;
    expect(cards.querySelectorAll('.prompt-card-button').length).to.equal(3);
    expect(cards.querySelector('.card-icon')).to.be.null;

    // global flag exposed on window.milo
    expect(window.milo.brandConcierge.brandConciergeGlobal).to.be.true;

    // main-top CSS variable is set
    expect(document.documentElement.style.getPropertyValue('--bc-gnav-height')).to.match(/px$/);

    // authored rows are removed from the block
    expect(block.children.length).to.equal(0);
  });

  it('adds the no-gnav-mobile modifier to the button section', async () => {
    block.classList.add('no-gnav-mobile');
    init(block);
    await waitForElement('.bc-gnav');

    const buttonSection = document.querySelector('.feds-bc-wrapper .bc-gnav-button');
    expect(buttonSection.classList.contains('no-gnav-mobile')).to.be.true;
  });

  it('activates the input and cards on focus and deactivates on blur', async () => {
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');
    const inputField = bcGnav.querySelector('.bc-input-field');
    const cards = bcGnav.querySelector('.bc-prompt-cards');
    const textarea = bcGnav.querySelector('textarea');

    textarea.dispatchEvent(new Event('focus'));
    expect(inputField.classList.contains('active')).to.be.true;
    expect(cards.classList.contains('active')).to.be.true;

    textarea.dispatchEvent(new Event('focusout'));
    await delay(300);
    expect(inputField.classList.contains('active')).to.be.false;
    expect(cards.classList.contains('active')).to.be.false;
  });

  it('opens the side modal when the gnav button is clicked', async () => {
    window.adobe = { concierge: { bootstrap: sinon.spy() } };
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');

    bcGnav.querySelector('.gnav-button').click();

    const modal = await waitForElement('#brand-concierge-side');
    expect(modal).to.exist;
    expect(modal.querySelector('#brand-concierge-mount')).to.exist;
    expect(modal.querySelector('.dialog-close').getAttribute('daa-ll')).to.equal('Filters|testAA|bc#modal-close');

    // side overlay state is tracked on the body and in localStorage
    expect(document.body.classList.contains('bc-side-open')).to.be.true;
    expect(localStorage.getItem('bc-side-overlay')).to.equal('open');
  });

  it('hides the block when the user rejects cookies', async () => {
    window.adobePrivacy = undefined;
    init(block);
    await waitForElement('.bc-gnav');
    expect(block.classList.contains('hide-block')).to.be.false;

    window.adobePrivacy = { activeCookieGroups: sinon.stub().returns(['C0001']) };
    window.dispatchEvent(new CustomEvent('adobePrivacy:PrivacyReject'));
    expect(block.classList.contains('hide-block')).to.be.true;
  });

  it('submits typed input and opens the side modal with the message', async () => {
    window.adobe = { concierge: { bootstrap: sinon.spy() } };
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');
    const textarea = bcGnav.querySelector('textarea');
    const submit = bcGnav.querySelector('.input-field-button');

    textarea.value = 'Design a logo';
    textarea.dispatchEvent(new Event('input'));
    expect(submit.disabled).to.be.false;

    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const modal = await waitForElement('#brand-concierge-side');
    const mount = modal.querySelector('#brand-concierge-mount');
    await waitFor(() => mount.dataset.initialMessage === 'Design a logo');
    expect(mount.dataset.initialMessage).to.equal('Design a logo');

    // the input is cleared and the send button disabled again after submit
    expect(textarea.value).to.equal('');
    expect(submit.disabled).to.be.true;
  });

  it('opens the side modal with the prompt text when a card is clicked', async () => {
    window.adobe = { concierge: { bootstrap: sinon.spy() } };
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');

    bcGnav.querySelectorAll('.prompt-card-button')[1].click();

    const modal = await waitForElement('#brand-concierge-side');
    const mount = modal.querySelector('#brand-concierge-mount');
    await waitFor(() => mount.dataset.initialMessage === 'Prompt two');
    expect(mount.dataset.initialMessage).to.equal('Prompt two');
  });

  it('keeps the panel active while a prompt card is pressed during blur', async () => {
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');
    const cards = bcGnav.querySelector('.bc-prompt-cards');
    const textarea = bcGnav.querySelector('textarea');
    const cardButton = cards.querySelector('.prompt-card-button');

    textarea.dispatchEvent(new Event('focus'));
    expect(cards.classList.contains('active')).to.be.true;

    // pressing a card flags the panel to stay active through the blur
    cardButton.dispatchEvent(new Event('mousedown'));
    textarea.dispatchEvent(new Event('focusout'));
    await delay(300);
    expect(cards.classList.contains('active')).to.be.true;

    // releasing the card clears the flag so a later blur can deactivate
    cardButton.dispatchEvent(new Event('mouseup'));
    textarea.dispatchEvent(new Event('focus'));
    textarea.dispatchEvent(new Event('focusout'));
    await delay(300);
    expect(cards.classList.contains('active')).to.be.false;
  });

  it('closes the side modal when the gnav button is clicked while open', async () => {
    window.adobe = { concierge: { bootstrap: sinon.spy() } };
    init(block);
    const bcGnav = await waitForElement('.bc-gnav');
    const button = bcGnav.querySelector('.gnav-button');

    button.click();
    await waitFor(() => document.body.classList.contains('bc-side-open'));

    button.click();
    await waitFor(() => !document.body.classList.contains('bc-side-open'));
    expect(localStorage.getItem('bc-side-overlay')).to.equal('closed');
  });

  it('clears chat history on feds:signOut', async () => {
    const clearHistory = sinon.spy();
    window.adobe = { concierge: { clearHistory } };
    init(block);
    await waitForElement('.bc-gnav');

    window.dispatchEvent(new CustomEvent('feds:signOut'));
    expect(clearHistory.called).to.be.true;
  });
});

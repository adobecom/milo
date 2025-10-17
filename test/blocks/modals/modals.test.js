/* eslint-disable no-underscore-dangle */
import { readFile, sendKeys, setViewport } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { delay, waitForElement, waitForRemoval } from '../../helpers/waitfor.js';
import { mockFetch } from '../../helpers/generalHelpers.js';
import { getConfig, createTag } from '../../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/body.html' });

const {
  default: init,
  getModal,
  getHashParams,
  delayedModal,
  sendAnalytics,
} = await import('../../../libs/blocks/modal/modal.js');
const satellite = { track: sinon.spy() };

const ogFetch = window.fetch;

describe('Modals', () => {
  beforeEach(() => {
    window._satellite = satellite;
    window._satellite.track.called = false;
  });

  afterEach(() => {
    sinon.restore();
    window.fetch = ogFetch;
  });

  it('Doesnt load modals on page load with no hash', async () => {
    window.location.hash = '';
    const modal = document.querySelector('.dialog-modal');
    expect(modal).to.be.null;
  });

  it('Loads a modal on load with hash and closes when removed from hash', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).to.be.null;
  });

  it('Closes a modal on button click', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    const close = document.querySelector('.dialog-close');
    expect(close.getAttribute('daa-ll')).to.equal('milo:modalClose:buttonClose');
    close.click();
    await waitForRemoval('#milo');
    expect(window.location.hash).to.be.empty;
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Closes a modal on click outside modal', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    const close = document.querySelector('.modal-curtain');
    close.click();
    await waitForRemoval('#milo');
    expect(window.location.hash).to.be.empty;
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Closes a modal on pressing Esc', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    await sendKeys({ press: 'Escape' });
    await waitForRemoval('#milo');
    expect(window.location.hash).to.be.empty;
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Opens an inherited modal', async () => {
    const meta = document.createElement('meta');
    meta.name = '-otis';
    meta.content = 'http://localhost:2000/test/blocks/modals/mocks/otis';
    document.head.append(meta);
    window.location.hash = '#otis';
    await waitForElement('#otis');
    expect(document.getElementById('otis')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#otis');
    expect(document.getElementById('otis')).not.to.exist;
  });

  it('Doesnt open a modal', async () => {
    window.location.hash = '#notthere';
    await delay(50);
    expect(document.querySelector('.dialog-modal')).to.be.null;
    window.location.hash = '';
  });

  it('Keeps the same modal if already open', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    getModal(document.getElementById('milo-modal-link'));
    expect(document.getElementById('milo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Gets the modal when explicitly init-ed', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    init(document.getElementById('milo-modal-link'));
    const modal = document.getElementById('milo');
    expect(modal).to.exist;
    expect(modal.getAttribute('daa-lh')).to.equal('milo-modal');
    const buttons = modal.querySelectorAll('button[id]');
    expect(buttons[0].getAttribute('daa-ll')).to.equal('Milo Button 1-1--Milo');
    expect(buttons[1].getAttribute('daa-ll')).to.equal('Milo Button 2-2--Milo');
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
    await delay(5);
  });

  it('Locks focus when tabbing forward through tabbable elements', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    expect(document.getElementById('milo')).to.exist;
    await delay(100);
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-1');
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-2');
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement.classList.contains('dialog-close')).to.be.true;
    await sendKeys({ press: 'Tab' });
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-1');
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
    await delay(5);
  });

  it('Locks focus when tabbing backward through tabbable elements', async () => {
    window.location.hash = '#milo';
    await waitForElement('#milo');
    await delay(200);
    expect(document.getElementById('milo')).to.exist;
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-1');
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
    await delay(100);
    expect(document.activeElement.classList.contains('dialog-close')).to.be.true;
    await sendKeys({ down: 'Shift' });
    await sendKeys({ press: 'Tab' });
    await sendKeys({ up: 'Shift' });
    expect(document.activeElement.getAttribute('id')).to.equal('milo-button-2');
    window.location.hash = '';
    await waitForRemoval('#milo');
    expect(document.getElementById('milo')).not.to.exist;
  });

  it('Focuses on close when there are no other focusables', async () => {
    const meta = document.createElement('meta');
    meta.name = '-paragraph';
    meta.content = 'http://localhost:2000/test/blocks/modals/mocks/paragraph';
    document.head.append(meta);
    window.location.hash = '#paragraph';
    await waitForElement('#paragraph');
    await delay(200);
    expect(document.getElementById('paragraph')).to.exist;
    expect(document.activeElement.classList.contains('dialog-close')).to.be.true;
    window.location.hash = '';
    await waitForRemoval('#paragraph');
  });

  it('Focuses on a header when there are no other focusables', async () => {
    const meta = document.createElement('meta');
    meta.name = '-title';
    meta.content = 'http://localhost:2000/test/blocks/modals/mocks/title';
    document.head.append(meta);
    window.location.hash = '#title';
    await delay(200);
    await waitForElement('#title');
    expect(document.getElementById('title')).to.exist;
    expect(document.activeElement.getAttribute('id')).to.equal('test-title');
    window.location.hash = '';
    await waitForRemoval('#title');
  });

  it('does not error for a modal with a non-querySelector compliant hash', async () => {
    window.location.hash = '#milo=&';

    const hashChangeTriggered = new Promise((resolve) => {
      window.addEventListener('hashchange', function onHashChange() {
        window.removeEventListener('hashchange', onHashChange);
        resolve();
      });
    });

    window.location.hash = '';

    // Test passing, means there was no error thrown
    await hashChangeTriggered;
  });

  it('validates and returns proper hash parameters', () => {
    expect(getHashParams()).to.deep.equal({});
    expect(getHashParams('#delayed-modal:delay=0')).to.deep.equal({
      delay: 0,
      hash: '#delayed-modal',
    });
    expect(getHashParams('#delayed-modal:delay=1')).to.deep.equal({
      delay: 1000,
      hash: '#delayed-modal',
    });
  });

  it('shows the modal with a delay, and remembers it was shown on this page', async () => {
    await setViewport({ width: 1200, height: 800 });
    window.sessionStorage.removeItem('shown:#delayed-modal');
    const anchor = document.createElement('a');
    anchor.setAttribute('data-modal-path', '/fragments/promos/fragments/cc-all-apps-promo-full-bleed-image');
    anchor.setAttribute('data-modal-hash', '#delayed-modal:delay=1');
    document.body.appendChild(anchor);
    expect(delayedModal(anchor)).to.be.true;
    await delay(1000);
    const modal = await waitForElement('#delayed-modal');
    expect(modal).to.be.not.null;
    expect(document.querySelector('#delayed-modal').classList.contains('delayed-modal'));
    expect(window.sessionStorage.getItem('shown:#delayed-modal').includes(window.location.pathname)).to.be.true;
    expect(window._satellite.track.called).to.be.true;
    window.sessionStorage.removeItem('shown:#delayed-modal');
    modal.remove();
    anchor.remove();
  });

  it('does not show the modal if it was shown on this page', async () => {
    await setViewport({ width: 1200, height: 800 });
    const el = document.createElement('a');
    el.setAttribute('data-modal-hash', '#dm:delay=1');
    window.sessionStorage.setItem('shown:#dm', window.location.pathname);
    expect(delayedModal(el)).to.be.true;
    await delay(1000);
    expect(window._satellite.track.called).to.be.false;
    const modal = document.querySelector('#dm');
    expect(modal).to.not.exist;
    window.sessionStorage.removeItem('shown:#dm');
    el.remove();
  });

  it('does not show the modal if the viewport width is less than 1200px', async () => {
    await setViewport({ width: 1199, height: 800 });
    const el = document.createElement('a');
    el.setAttribute('data-modal-hash', '#dm:delay=1');
    expect(delayedModal(el)).to.be.false;
    el.remove();
  });

  it('restores the hash when the modal gets closed', async () => {
    window.location.hash = '#category=pdf-esignatures&search=acro&types=desktop%2Cmobile';
    window.location.hash = '#milo';
    await waitForElement('#milo');
    init(document.getElementById('milo-modal-link'));
    const modal = document.getElementById('milo');
    expect(modal).to.exist;
    expect(window.location.hash).to.equal('#milo');
    const close = document.querySelector('.dialog-close');
    close.click();
    expect(window.location.hash).to.equal('#category=pdf-esignatures&search=acro&types=desktop%2Cmobile');
    window.location.hash = '';
  });

  it('doesn\'t restore the hash when hash is from IMS and the modal gets closed', async () => {
    window.location.hash = '#old_hash=ims-hash-modal&from_ims=true';
    window.location.hash = '#ims-hash-modal';
    await waitForElement('#ims-hash-modal');
    const modal = document.getElementById('ims-hash-modal');
    expect(modal).to.exist;
    expect(window.location.hash).to.equal('#ims-hash-modal');
    const close = modal.querySelector('.dialog-close');
    close.click();
    expect(window.location.hash).to.equal('');
    window.location.hash = '';
  });

  it('never create modal when removed by MEP', async () => {
    const config = getConfig();
    config.mep = { fragments: { '/milo': { action: 'remove' } } };
    const modal = init(document.getElementById('milo-modal-link'));
    expect(modal).to.be.null;
  });

  it('sets modal and iframe title/aria-label from CTA aria-label', async () => {
    document.body.appendChild(createTag('a', {
      id: 'cta-with-aria-label',
      href: '#test-modal',
      'data-modal-hash': '#test-modal',
      'aria-label': 'Test Modal Description',
    }, 'Open Modal'));

    const customContent = createTag('div');
    const iframe = createTag('iframe', { src: 'about:blank' });
    customContent.appendChild(iframe);

    const custom = {
      id: 'test-modal',
      content: customContent,
      title: 'Modal: Test Modal Description',
    };

    const modal = await getModal(null, custom);
    expect(modal).to.exist;

    expect(modal.getAttribute('aria-label')).to.equal('Modal: Test Modal Description');

    const modalIframe = modal.querySelector('iframe');
    expect(modalIframe).to.exist;
    expect(modalIframe.getAttribute('title')).to.equal('Modal: Test Modal Description');
  });

  it('custom modal gets title from findDetails when no title provided', async () => {
    const ctaWithAriaLabel = createTag('a', {
      id: 'cta-for-custom-modal',
      href: '#custom-no-title',
      'data-modal-hash': '#custom-no-title',
      'aria-label': 'Auto Title from CTA',
    }, 'Open Modal');
    document.body.appendChild(ctaWithAriaLabel);
    window.location.hash = '#custom-no-title';
    const iframe = createTag('iframe', { src: 'about:blank' });

    const customContent = createTag('div');
    customContent.appendChild(iframe);

    const custom = {
      id: 'custom-no-title',
      content: customContent,
    };
    const modal = await getModal(null, custom);
    expect(modal).to.exist;
    expect(modal.getAttribute('aria-label')).to.equal('Modal: Auto Title from CTA');

    const modalIframe = modal.querySelector('iframe');
    expect(modalIframe).to.exist;
    expect(modalIframe.getAttribute('title')).to.equal('Modal: Auto Title from CTA');
  });

  it('executes closeCallback for custom modal', async () => {
    const closeCallbackSpy = sinon.spy();
    const customContent = createTag('div', {}, 'Test Modal Content');

    const custom = {
      id: 'closeCallback-test',
      content: customContent,
      closeCallback: closeCallbackSpy,
    };

    const modal = await getModal(null, custom);
    expect(modal).to.exist;
    expect(closeCallbackSpy.called).to.be.false;

    const closeButton = modal.querySelector('.dialog-close');
    closeButton.click();

    await waitForRemoval('#closeCallback-test');
    expect(closeCallbackSpy.calledOnce).to.be.true;
    expect(closeCallbackSpy.calledWith(modal)).to.be.true;
  });
});

describe('sendAnalytics', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('satellite event not set, so must use event listener', async () => {
    window._satellite = false;
    sendAnalytics({});
    window._satellite = satellite;
    window._satellite.track.called = false;
    const martechEvent = new Event('alloy_sendEvent');
    dispatchEvent(martechEvent);
    expect(window._satellite.track.called).to.be.true;
  });

  it('satellite event set, so can fire load event immediately', async () => {
    window._satellite = satellite;
    window._satellite.track.called = false;
    sendAnalytics({});
    expect(window._satellite.track.called).to.be.true;
  });

  it('Loads a federated modal on load with hash and closes when removed from hash', async () => {
    window.fetch = mockFetch({ payload: { data: '' } });
    window.location.hash = '#geo';
    await waitForElement('#geo');
    expect(document.getElementById('geo')).to.exist;
    window.location.hash = '';
    await waitForRemoval('#geo');
    expect(document.getElementById('geo')).to.be.null;
  });
});

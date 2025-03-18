import { expect } from '@esm-bundle/chai';
import { readFile } from '@web/test-runner-commands';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';
import openThreeInOneModal, { handle3in1IFrameEvents, MSG_SUBTYPE, reloadIframe } from '../../../libs/blocks/merch/three-in-one.js';

document.body.innerHTML = await readFile({ path: './mocks/threeInOne.html' });

const config = {
  codeRoot: '/libs',
  env: { name: 'prod' },
};
setConfig(config);

describe('Three-in-one modal', () => {
  const originalOpen = window.open;
  const twpLink = document.querySelector('#twp-link');
  const crmLink = document.querySelector('#crm-link');
  const d2pLink = document.querySelector('#d2p-link');
  let clock;

  beforeEach(async () => {
    window.open = sinon.stub(window, 'open');
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    window.open = originalOpen;
    clock.restore();
  });

  it('should return undefined if no href or modal type', async () => {
    const checkoutLinkWithoutHref = document.querySelector('#no-href');
    const checkoutLinkWithoutModalType = document.querySelector('#no-modal-type');
    expect(await openThreeInOneModal(checkoutLinkWithoutHref)).to.be.undefined;
    expect(await openThreeInOneModal(checkoutLinkWithoutModalType)).to.be.undefined;
  });

  it('should open a modal with an iframe and a loader', async () => {
    const modal = await openThreeInOneModal(twpLink);
    expect(modal).to.exist;
    expect(modal.getAttribute('id')).to.equal('three-in-one');
    expect(modal.classList.contains('three-in-one')).to.be.true;
    const iframe = modal.querySelector('iframe');
    expect(iframe).to.exist;
    expect(iframe.src).to.equal('https://commerce.adobe.com/store/segmentation?ms=COM&ot=TRIAL&pa=phsp_direct_individual&cli=adobe_com&ctx=if&co=US&lang=en');
    expect(iframe.classList.contains('loading')).to.be.true;
    expect(iframe.getAttribute('frameborder')).to.equal('0');
    expect(iframe.getAttribute('marginwidth')).to.equal('0');
    expect(iframe.getAttribute('marginheight')).to.equal('0');
    expect(iframe.getAttribute('allowfullscreen')).to.equal('true');
    expect(iframe.getAttribute('loading')).to.equal('lazy');
    const spTheme = modal.querySelector('sp-theme');
    expect(spTheme).to.exist;
    const loader = spTheme.querySelector('sp-progress-circle');
    expect(loader).to.exist;
    modal.remove();
  });

  it('sets proper iframe title for each modal type', async () => {
    [twpLink, crmLink, d2pLink].forEach(async (link) => {
      const modal = await openThreeInOneModal(link);
      const modalType = link.getAttribute('data-modal-type');
      const title = modalType === 'crm' ? 'Single App' : modalType;
      expect(modal.querySelector('iframe').title).to.equal(title);
      modal.remove();
    });
  });

  it('should hide loader when commerce page finished loading', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const iframe = modal.querySelector('iframe');
    const spTheme = modal.querySelector('sp-theme');
    const spProgressCircle = spTheme.querySelector('sp-progress-circle');
    expect(iframe).to.exist;
    expect(spTheme).to.exist;
    expect(spProgressCircle).to.exist;
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.AppLoaded}"}` });
    expect(iframe.classList.contains('loading')).to.be.false;
    modal.remove();
  });

  it('should open external link in a new tab', async () => {
    const modal = await openThreeInOneModal(twpLink);
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.EXTERNAL}", "data":{"externalUrl":"https://www.google.com/maps","target":"_blank"}}` });
    expect(window.open.calledOnceWith('https://www.google.com/maps', '_blank')).to.be.true;
    modal.remove();
  });

  it('should open link in a new tab when message subtype is "switch"', async () => {
    const modal = await openThreeInOneModal(twpLink);
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.SWITCH}", "data":{"externalUrl":"https://www.google.com/maps","target":"_blank"}}` });
    expect(window.open.calledOnceWith('https://www.google.com/maps', '_blank')).to.be.true;
    modal.remove();
  });

  it('should open link in a new tab when message subtype is "return_back"', async () => {
    const modal = await openThreeInOneModal(twpLink);
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.RETURN_BACK}", "data":{"externalUrl":"https://www.google.com/maps","target":"_blank"}}` });
    expect(window.open.calledOnceWith('https://www.google.com/maps', '_blank')).to.be.true;
    modal.remove();
  });

  it('should close modal when message subtype is "close"', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const spy = sinon.spy(modal, 'dispatchEvent');
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.Close}"}` });
    expect(spy.calledOnce).to.be.true;
    expect(spy.calledWithMatch(sinon.match.instanceOf(Event))).to.be.true;
    expect(spy.calledWithMatch(sinon.match.has('type', 'closeModal'))).to.be.true;
    modal.dispatchEvent.restore();
    modal.remove();
  });

  it('should do nothing if message subtype is not recognized or message data is invalid', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const iframe = modal.querySelector('iframe');
    handle3in1IFrameEvents('unrelevant message');
    handle3in1IFrameEvents({ data: '{"subType": "unknown"}' });
    handle3in1IFrameEvents({ data: '{"app":"ucv3","subType": "unknown"}' });
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.EXTERNAL}"}` });
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.SWITCH}"}` });
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.RETURN_BACK}"}` });
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.EXTERNAL}", "data":{}}` });
    expect(iframe.classList.contains('loading')).to.be.true;
    expect(window.open.notCalled).to.be.true;
    modal.remove();
  });

  it('should show error message after 15 seconds if page not loaded', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const iframe = modal.querySelector('iframe');
    const spTheme = modal.querySelector('sp-theme');
    expect(iframe.classList.contains('loading')).to.be.true;
    expect(spTheme).to.exist;
    clock.tick(15000);
    const errorWrapper = modal.querySelector('.error-wrapper');
    expect(errorWrapper).to.exist;
    expect(errorWrapper.querySelector('.error-msg')).to.exist;
    expect(errorWrapper.querySelector('.try-again-btn')).to.exist;
    expect(iframe.style.display).to.equal('none');
    expect(spTheme.style.display).to.equal('none');
    modal.remove();
  });

  it('should not show error message if page loaded before timeout', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const iframe = modal.querySelector('iframe');
    clock.tick(5000);
    handle3in1IFrameEvents({ data: `{"app":"ucv3","subType": "${MSG_SUBTYPE.AppLoaded}"}` });
    clock.tick(10000);
    const errorWrapper = modal.querySelector('.error-wrapper');
    expect(errorWrapper).to.not.exist;
    expect(iframe.classList.contains('loading')).to.be.false;
    modal.remove();
  });

  it('should reload iframe when try again button is clicked', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const iframe = modal.querySelector('iframe');
    const spTheme = modal.querySelector('sp-theme');

    // Trigger error state
    clock.tick(15000);

    const errorWrapper = modal.querySelector('.error-wrapper');
    const tryAgainBtn = errorWrapper.querySelector('.try-again-btn');

    // Store original src to compare
    const originalSrc = iframe.src;

    // Click try again button
    tryAgainBtn.click();

    // Verify iframe was reloaded
    expect(iframe.getAttribute('data-wasreloaded')).to.equal('true');
    expect(iframe.style.display).to.equal('block');
    expect(iframe.src).to.equal(originalSrc);
    expect(iframe.classList.contains('loading')).to.be.true;
    expect(spTheme.style.display).to.equal('block');
    expect(modal.querySelector('.error-wrapper')).to.not.exist;

    modal.remove();
  });

  it('should do nothing if required parameters are missing in reloadIframe', async () => {
    const modal = await openThreeInOneModal(twpLink);
    const iframe = modal.querySelector('iframe');
    const spTheme = modal.querySelector('sp-theme');

    // Trigger error state
    clock.tick(15000);

    const errorWrapper = modal.querySelector('.error-wrapper');

    // Test with missing parameters
    reloadIframe({});
    reloadIframe({ iframe: null, theme: spTheme, msgWrapper: errorWrapper, handleTimeoutError: () => {} });
    reloadIframe({ iframe, theme: null, msgWrapper: errorWrapper, handleTimeoutError: () => {} });
    reloadIframe({ iframe, theme: spTheme, msgWrapper: null, handleTimeoutError: () => {} });
    reloadIframe({ iframe, theme: spTheme, msgWrapper: errorWrapper, handleTimeoutError: null });

    // Verify nothing changed
    expect(errorWrapper).to.exist;
    expect(iframe.style.display).to.equal('none');
    expect(spTheme.style.display).to.equal('none');

    modal.remove();
  });
});

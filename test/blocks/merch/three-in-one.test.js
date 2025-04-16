import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../../libs/utils/utils.js';

document.body.innerHTML = await readFile({ path: './mocks/threeInOne.html' });

const {
  MSG_SUBTYPE,
  reloadIframe,
  showErrorMsg,
  handle3in1IFrameEvents,
  handleTimeoutError,
  createContent,
  default: openThreeInOneModal,
} = await import('../../../libs/blocks/merch/three-in-one.js');

setConfig({ locale: { contentRoot: '/test/blocks/merch/mocks' } });

describe('Three-in-One Modal', () => {
  let clock;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  describe('reloadIframe', () => {
    it('should reload iframe and set appropriate attributes', () => {
      const iframe = document.querySelector('iframe');
      const theme = document.querySelector('sp-theme');
      const msgWrapper = document.querySelector('.error-wrapper');
      const handleTimeoutErrorSpy = sinon.spy();
      reloadIframe({ iframe, theme, msgWrapper, handleTimeoutError: handleTimeoutErrorSpy });
      expect(msgWrapper).to.not.exist;
      expect(iframe.getAttribute('data-wasreloaded')).to.equal('true');
      expect(iframe.style.display).to.equal('block');
      expect(iframe.classList.contains('loading')).to.be.true;
      expect(theme.style.display).to.equal('block');
      clock.tick(15000);
      expect(handleTimeoutErrorSpy.calledOnce).to.be.true;
    });
  });

  describe('showErrorMsg', () => {
    it('should create error message with retry button', async () => {
      const iframe = document.querySelector('iframe');
      const theme = document.querySelector('sp-theme');
      const miloIframe = document.querySelector('.milo-iframe');
      const handleTimeoutErrorSpy = sinon.spy();
      await showErrorMsg({
        iframe,
        miloIframe,
        showBtn: true,
        theme,
        handleTimeoutError: handleTimeoutErrorSpy,
      });
      expect(theme.style.display).to.equal('none');
      expect(iframe.style.display).to.equal('none');
      const errorWrapper = miloIframe.querySelector('.error-wrapper');
      expect(errorWrapper).to.exist;
      expect(errorWrapper.querySelector('.icon-and-text')).to.exist;
      expect(errorWrapper.querySelector('.error-msg')).to.exist;
      const tryAgainBtn = errorWrapper.querySelector('.try-again-btn');
      expect(tryAgainBtn).to.exist;
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      tryAgainBtn.dispatchEvent(clickEvent);
      expect(handleTimeoutErrorSpy.calledOnce).to.be.true;
    });
  });

  describe('handle3in1IFrameEvents', () => {
    it('should handle AppLoaded message', () => {
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.AppLoaded,
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      const iframe = document.querySelector('iframe');
      const theme = document.querySelector('sp-theme');
      const closeBtn = document.querySelector('.dialog-close');
      expect(theme).to.not.exist;
      expect(iframe.getAttribute('data-pageloaded')).to.equal('true');
      expect(iframe.classList.contains('loading')).to.be.false;
      expect(closeBtn.getAttribute('aria-hidden')).to.equal('true');
      expect(closeBtn.style.opacity).to.equal('0');
    });

    it('should handle Close message', () => {
      const closeEvent = sinon.spy();
      const modal = document.querySelector('.three-in-one');
      modal.addEventListener('closeModal', closeEvent);
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.Close,
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      expect(closeEvent.calledOnce).to.be.true;
    });
  });

  describe('handleTimeoutError', () => {
    it.only('should show error message on timeout', () => {
      const miloIframe = document.querySelector('.milo-iframe');
      const iframe = document.querySelector('iframe');
      const theme = document.querySelector('sp-theme');
      handleTimeoutError();
      expect(theme.style.display).to.equal('none');
      expect(iframe.style.display).to.equal('none');
      const errorWrapper = miloIframe.querySelector('.error-wrapper');
      expect(errorWrapper).to.exist;
      expect(errorWrapper.querySelector('.icon-and-text')).to.exist;
      expect(errorWrapper.querySelector('.error-msg')).to.exist;
      const tryAgainBtn = errorWrapper.querySelector('.try-again-btn');
      expect(tryAgainBtn).to.exist;
    });
  });

  describe('createContent', () => {
    it('should create iframe content with correct URL', async () => {
      const testUrl = 'https://test.com/';
      const content = createContent(testUrl);
      expect(content.classList.contains('milo-iframe')).to.be.true;
      expect(content.querySelector('sp-theme')).to.exist;
      expect(content.querySelector('sp-progress-circle')).to.exist;
      expect(content.querySelector('iframe')).to.exist;
      expect(content.querySelector('iframe').src).to.equal(testUrl);
      expect(content.querySelector('iframe').classList.contains('loading')).to.be.true;
    });
  });

  describe('openThreeInOneModal', () => {
    it('should open modal with correct content', async () => {
      const link = document.querySelector('a');
      const modal = await openThreeInOneModal(link);
      expect(modal).to.exist;
      expect(modal.querySelector('iframe')).to.exist;
      expect(modal.classList.contains('three-in-one')).to.be.true;
      expect(modal.id).to.equal('mini-plans-web-cta-illustrator-card');
      expect(modal.querySelector('iframe').src).to.equal('https://commerce-stg.adobe.com/store/segmentation?ms=COM&ot=TRIAL&pa=ilst_direct_individual&cli=mini_plans&ctx=if&co=US&lang=en&rtc=t&lo=sl&af=uc_new_user_iframe%2Cuc_new_system_close');
    });

    it('should return undefined for invalid input', async () => {
      const result = await openThreeInOneModal();
      expect(result).to.be.undefined;
    });
  });
});

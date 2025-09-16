import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig, createTag } from '../../../libs/utils/utils.js';
import { mockFetch, unmockFetch } from './mocks/fetch.js';
import { mockIms, unmockIms } from './mocks/ims.js';

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

const { default: initMerch } = await import('../../../libs/blocks/merch/merch.js');

setConfig({ codeRoot: '/libs', locale: { contentRoot: '/test/blocks/merch/mocks' } });

describe('Three-in-One Modal', () => {
  describe('error handling', () => {
    const originalModal = document.querySelector('.three-in-one');
    let modal;
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers();
      modal = originalModal.cloneNode(true);
      document.body.replaceChild(modal, originalModal);
    });

    afterEach(() => {
      sinon.restore();
      clock.restore();
      document.body.replaceChild(originalModal, modal);
    });

    it('reloads the iframe', () => {
      const iframe = document.querySelector('iframe');
      const theme = document.querySelector('sp-theme');
      const msgWrapper = document.querySelector('.error-wrapper');
      const handleTimeoutErrorSpy = sinon.spy();
      expect(modal).to.exist;

      reloadIframe({ iframe, theme, msgWrapper, handleTimeoutError: handleTimeoutErrorSpy });

      expect(document.querySelector('.error-wrapper')).to.not.exist;
      expect(iframe.getAttribute('data-wasreloaded')).to.equal('true');
      expect(iframe.style.display).to.equal('block');
      expect(iframe.classList.contains('loading')).to.be.true;
      expect(theme.style.display).to.equal('block');
      clock.tick(15000);
      expect(handleTimeoutErrorSpy.calledOnce).to.be.true;
    });

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
    });

    it('should show error message on timeout', () => {
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

  describe('handle3in1IFrameEvents', () => {
    afterEach(() => {
      sinon.restore();
    });

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

    it('should handle EXTERNAL message and open window with external URL', () => {
      const windowOpenSpy = sinon.spy(window, 'open');
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.EXTERNAL,
        data: {
          externalUrl: 'https://example.com',
          target: '_blank',
        },
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      expect(windowOpenSpy.calledWith('https://example.com', '_blank')).to.be.true;
    });

    it('should handle SWITCH message and open window with external URL', () => {
      const windowOpenSpy = sinon.spy(window, 'open');
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.SWITCH,
        data: {
          externalUrl: 'https://example.com',
          target: '_blank',
        },
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      expect(windowOpenSpy.calledWith('https://example.com', '_blank')).to.be.true;
    });

    it('should handle RETURN_BACK message and open window with external URL', () => {
      const windowOpenSpy = sinon.spy(window, 'open');
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.RETURN_BACK,
        data: {
          externalUrl: 'https://example.com',
          target: '_blank',
        },
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      expect(windowOpenSpy.calledWith('https://example.com', '_blank')).to.be.true;
    });

    it('should handle Close message with action URL', () => {
      const windowOpenSpy = sinon.spy(window, 'open');
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.Close,
        data: {
          actionRequired: true,
          actionUrl: 'https://example.com/action',
        },
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      expect(windowOpenSpy.calledWith('https://example.com/action')).to.be.true;
    });

    it('should dispatch merch-modal:addon-and-quantity-update event on Close message with cart items', () => {
      const modal = document.querySelector('.three-in-one');
      modal.id = 'test-modal-id';
      const link = createTag('a', { 'data-modal-id': 'test-modal-id' });
      const merchCard = createTag('merch-card');
      merchCard.appendChild(link);
      document.body.appendChild(merchCard);

      const eventSpy = sinon.spy();
      merchCard.addEventListener('merch-modal:addon-and-quantity-update', eventSpy);

      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.Close,
        data: { state: { cart: { items: ['item1', 'item2'] } } },
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });

      expect(eventSpy.calledOnce).to.be.true;
      expect(eventSpy.firstCall.args[0].detail).to.deep.equal({
        id: 'test-modal-id',
        items: ['item1', 'item2'],
      });
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

  describe('handle3in1Params', () => {
    before(async () => {
      await mockFetch();
      await mockIms('CH');
    });

    after(() => {
      unmockFetch();
      unmockIms();
    });

    it('should override market segment param', async () => {
      const link = document.querySelector('#ms-override');
      await initMerch(link);
      const checkoutLink = document.querySelector('[data-wcs-osi="1ZyMOJpSngx9IU5AjEDyp7oRBz843zNlbbtPKbIb1gM"]');
      await checkoutLink.render();
      expect(checkoutLink).to.exist;
      expect(checkoutLink.href).to.include('ms=myoverride');
    });

    it('should override customer segment param', async () => {
      const link = document.querySelector('#cs-override');
      await initMerch(link);
      const checkoutLink = document.querySelector('[data-wcs-osi="VbDsK1jsr3uGWMCxyps3lJH_voQxJHKsRR5tz9lZoDo"]');
      await checkoutLink.render();
      expect(checkoutLink).to.exist;
      expect(checkoutLink.href).to.include('cs=myoverride');
    });

    it('should unhide tabs on the CRM modal', async () => {
      const link = document.querySelector('#unhide-tabs-crm');
      await initMerch(link);
      const checkoutLink = document.querySelector('[data-wcs-osi="cNKNAZtQxpD-jCOXiERTprpDatlhaoWsbZo1Onvrh_M"]');
      await checkoutLink.render();
      expect(checkoutLink).to.exist;
      expect(checkoutLink.href).to.include('rf=uc_segmentation_hide_tabs_cr');
    });
  });
});

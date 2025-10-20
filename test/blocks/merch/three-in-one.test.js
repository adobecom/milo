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
  decodeUrl,
  normalizeUrl,
  isHttpsAdobeDomain,
  sanitizeUrl,
  sanitizeTarget,
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

    it('should log to window.lana when available', () => {
      const mockLana = { log: sinon.spy() };
      window.lana = mockLana;
      const message = {
        app: 'ucv3',
        subType: MSG_SUBTYPE.AppLoaded,
      };
      handle3in1IFrameEvents({ data: JSON.stringify(message) });
      expect(mockLana.log.calledWith('3-in-1 modal: AppLoaded')).to.be.true;
      delete window.lana;
    });

    it('should handle unknown message subTypes gracefully (default case)', () => {
      const message = {
        app: 'ucv3',
        subType: 'UNKNOWN_SUBTYPE',
      };
      expect(() => handle3in1IFrameEvents({ data: JSON.stringify(message) })).to.not.throw();
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

    it('should detect Mobile Safari and omit loading="lazy" attribute', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      });
      const testUrl = 'https://test.com/';
      const content = createContent(testUrl);
      const iframe = content.querySelector('iframe');
      expect(iframe.hasAttribute('loading')).to.be.false;
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: originalUserAgent,
      });
    });

    it('should add loading="lazy" attribute for non-Mobile Safari browsers', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      });
      const testUrl = 'https://test.com/';
      const content = createContent(testUrl);
      const iframe = content.querySelector('iframe');
      expect(iframe.getAttribute('loading')).to.equal('lazy');
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: originalUserAgent,
      });
    });

    it('should handle iPad user agent (Mobile Safari)', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
      });
      const testUrl = 'https://test.com/';
      const content = createContent(testUrl);
      const iframe = content.querySelector('iframe');
      expect(iframe.hasAttribute('loading')).to.be.false;
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: originalUserAgent,
      });
    });

    it('should handle Chrome on iOS (not Mobile Safari)', () => {
      const originalUserAgent = navigator.userAgent;
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1',
      });
      const testUrl = 'https://test.com/';
      const content = createContent(testUrl);
      const iframe = content.querySelector('iframe');
      expect(iframe.getAttribute('loading')).to.equal('lazy');
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: originalUserAgent,
      });
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

describe('Three-in-One XSS Sanitization', () => {
  describe('decodeUrl', () => {
    it('should return URL unchanged when no decoding needed', () => {
      expect(decodeUrl('https://example.com/path?query=value')).to.equal('https://example.com/path?query=value');
      expect(decodeUrl('/relative/path')).to.equal('/relative/path');
    });

    it('should decode URL encoded once', () => {
      expect(decodeUrl('https%3A//example.com')).to.equal('https://example.com');
      expect(decodeUrl('https://example.com/path%3Fquery%3Dvalue')).to.equal('https://example.com/path?query=value');
      expect(decodeUrl('hello%20world')).to.equal('hello world');
    });

    it('should decode URL encoded multiple times', () => {
      expect(decodeUrl('https%253A//example.com')).to.equal('https://example.com');
      expect(decodeUrl('hello%2520world')).to.equal('hello world');
      expect(decodeUrl('https%25253A//example.com')).to.equal('https://example.com');
      expect(decodeUrl('hello%252520world')).to.equal('hello world');
      expect(decodeUrl('https%2525253A//example.com')).to.equal('https://example.com');
      expect(decodeUrl('https%252525253A//example.com')).to.equal('https://example.com');
    });

    it('should stop at maximum iterations (5)', () => {
      const sixTimesEncoded = 'https%25252525253A//example.com';
      const expectedAfter5Decodes = 'https%253A//example.com';
      expect(decodeUrl(sixTimesEncoded)).to.equal(expectedAfter5Decodes);
      const sevenTimesEncoded = 'https%2525252525253A//example.com';
      const expectedAfter5DecodesFrom7 = 'https%25253A//example.com';
      expect(decodeUrl(sevenTimesEncoded)).to.equal(expectedAfter5DecodesFrom7);
    });

    it('should handle malformed percent encoding gracefully', () => {
      expect(decodeUrl('https://example.com%')).to.equal('https://example.com%');
      expect(decodeUrl('https://example.com%2')).to.equal('https://example.com%2');
      expect(decodeUrl('https://example.com%GG')).to.equal('https://example.com%GG');
    });

    it('should handle edge cases', () => {
      expect(decodeUrl('')).to.equal('');
      expect(decodeUrl(null)).to.equal(null);
      expect(decodeUrl(undefined)).to.equal(undefined);
    });

    it('should handle mixed valid and invalid encoding', () => {
      expect(decodeUrl('hello%20world%ZZ')).to.equal('hello world%ZZ');
      expect(decodeUrl('hello%2520world%GG')).to.equal('hello world%GG');
    });

    it('should handle potential XSS payloads in encoded form', () => {
      // eslint-disable-next-line no-script-url
      expect(decodeUrl('javascript%253Aalert%25281%2529'))
        // eslint-disable-next-line no-script-url
        .to.equal('javascript:alert(1)');
      expect(decodeUrl('data%253Atext%252Fhtml%252C%253Cscript%253Ealert%25281%2529%253C%252Fscript%253E'))
        .to.equal('data:text/html,<script>alert(1)</script>');
    });
  });

  describe('normalizeUrl', () => {
    it('should return normal URLs unchanged', () => {
      expect(normalizeUrl('https://example.com/path?query=value')).to.equal('https://example.com/path?query=value');
      expect(normalizeUrl('/relative/path')).to.equal('/relative/path');
    });

    it('should trim whitespace from URLs', () => {
      expect(normalizeUrl('  https://example.com  ')).to.equal('https://example.com');
      expect(normalizeUrl('\t\nhttps://example.com\r\n')).to.equal('https://example.com');
    });

    it('should remove ASCII control characters', () => {
      expect(normalizeUrl('https://example.com\x00')).to.equal('https://example.com');
      expect(normalizeUrl('https://\x01example.com')).to.equal('https://example.com');
    });

    it('should remove Unicode control characters', () => {
      expect(normalizeUrl('https://example.com\u0000')).to.equal('https://example.com');
      expect(normalizeUrl('https://\u001fexample.com')).to.equal('https://example.com');
      expect(normalizeUrl('https://example.com\u007f')).to.equal('https://example.com');
      expect(normalizeUrl('https://example\u009f.com')).to.equal('https://example.com');
      expect(normalizeUrl('https://example\u2000.com')).to.equal('https://example.com');
      expect(normalizeUrl('https://example\u200d.com')).to.equal('https://example.com');
      expect(normalizeUrl('https://example.com\ufeff')).to.equal('https://example.com');
    });

    it('should return null for dangerous protocols', () => {
      // eslint-disable-next-line no-script-url
      expect(normalizeUrl('javascript:alert(1)')).to.be.null;
      expect(normalizeUrl('data:text/html,<script>alert(1)</script>')).to.be.null;
      expect(normalizeUrl('vbscript:alert(1)')).to.be.null;
      expect(normalizeUrl('file:///etc/passwd')).to.be.null;
      expect(normalizeUrl('about:blank')).to.be.null;
      expect(normalizeUrl('chrome://settings')).to.be.null;
      expect(normalizeUrl('chrome-extension://abc123/popup.html')).to.be.null;
      expect(normalizeUrl('filesystem:https://example.com/file')).to.be.null;
      expect(normalizeUrl('blob:https://example.com/abc123')).to.be.null;
      expect(normalizeUrl('mailto:user@example.com')).to.be.null;
      expect(normalizeUrl('tel:+1234567890')).to.be.null;
      expect(normalizeUrl('sms:+1234567890')).to.be.null;
    });

    it('should handle case-insensitive dangerous protocols', () => {
      // eslint-disable-next-line no-script-url
      expect(normalizeUrl('JAVASCRIPT:alert(1)')).to.be.null;
      // eslint-disable-next-line no-script-url
      expect(normalizeUrl('JavaScript:alert(1)')).to.be.null;
      expect(normalizeUrl('DATA:text/html,<script>alert(1)</script>')).to.be.null;
      expect(normalizeUrl('VbScript:alert(1)')).to.be.null;
      expect(normalizeUrl('FILE:///etc/passwd')).to.be.null;
      expect(normalizeUrl('CHROME://settings')).to.be.null;
      expect(normalizeUrl('MAILTO:user@example.com')).to.be.null;
    });

    it('should handle URLs that become empty after normalization', () => {
      expect(normalizeUrl('')).to.equal('');
      expect(normalizeUrl('   ')).to.equal('');
      expect(normalizeUrl('\x00\x01\x1f\x7f')).to.equal('');
      expect(normalizeUrl('\u0000\u001f\u007f\u009f')).to.equal('');
      expect(normalizeUrl('   \t\n\r   ')).to.equal('');
    });

    it('should handle mixed control characters and valid content', () => {
      expect(normalizeUrl('https://\x00example\x01.com\x1f')).to.equal('https://example.com');
      expect(normalizeUrl('  https://\u0000example\u001f.com\u200d  ')).to.equal('https://example.com');
      expect(normalizeUrl('/path\x0a/to\x0d/resource')).to.equal('/path/to/resource');
    });

    it('should handle protocol-like strings that are not dangerous', () => {
      expect(normalizeUrl('custom-protocol://example.com')).to.equal('custom-protocol://example.com');
      expect(normalizeUrl('myapp://action?param=value')).to.equal('myapp://action?param=value');
      expect(normalizeUrl('ws://example.com')).to.equal('ws://example.com');
      expect(normalizeUrl('wss://example.com')).to.equal('wss://example.com');
    });

    it('should handle complex malicious payloads', () => {
      // eslint-disable-next-line no-script-url
      expect(normalizeUrl('java\x00script:alert(1)')).to.be.null;
      // eslint-disable-next-line no-script-url
      expect(normalizeUrl('java\u0000script:alert(1)')).to.be.null;
      expect(normalizeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).to.be.null;
      // eslint-disable-next-line no-script-url
      expect(normalizeUrl('Java\x01Script:alert(1)')).to.be.null;
    });
  });

  describe('isHttpsAdobeDomain', () => {
    it('should return valid HTTPS Adobe.com URLs', () => {
      expect(isHttpsAdobeDomain('https://adobe.com')).to.equal('https://adobe.com/');
      expect(isHttpsAdobeDomain('https://adobe.com/path?query=value')).to.equal('https://adobe.com/path?query=value');
      expect(isHttpsAdobeDomain('https://adobe.com/path#fragment')).to.equal('https://adobe.com/path#fragment');
    });

    it('should return valid HTTPS Adobe subdomain URLs', () => {
      expect(isHttpsAdobeDomain('https://commerce.adobe.com')).to.equal('https://commerce.adobe.com/');
      expect(isHttpsAdobeDomain('https://commerce-stg.adobe.com')).to.equal('https://commerce-stg.adobe.com/');
      expect(isHttpsAdobeDomain('https://deeply.nested.subdomain.adobe.com')).to.equal('https://deeply.nested.subdomain.adobe.com/');
    });

    it('should return null for HTTP (non-HTTPS) Adobe URLs', () => {
      expect(isHttpsAdobeDomain('http://commerce.adobe.com')).to.be.null;
    });

    it('should return null for non-Adobe domains', () => {
      expect(isHttpsAdobeDomain('https://example.com')).to.be.null;
      expect(isHttpsAdobeDomain('https://adobeexample.com')).to.be.null;
    });

    it('should return null for domains that contain adobe.com but are not subdomains', () => {
      expect(isHttpsAdobeDomain('https://notadobe.com')).to.be.null;
      expect(isHttpsAdobeDomain('https://adobe.commerce.com')).to.be.null;
    });

    it('should return relative URLs unchanged', () => {
      expect(isHttpsAdobeDomain('/api/endpoint?param=value')).to.equal('/api/endpoint?param=value');
      expect(isHttpsAdobeDomain('/path/with/fragment#section')).to.equal('/path/with/fragment#section');
    });

    it('should return null for URLs that do not start with protocol or /', () => {
      expect(isHttpsAdobeDomain('adobe.com')).to.be.null;
      expect(isHttpsAdobeDomain('www.adobe.com')).to.be.null;
      expect(isHttpsAdobeDomain('ftp://adobe.com')).to.be.null;
      expect(isHttpsAdobeDomain('mailto:user@adobe.com')).to.be.null;
      // eslint-disable-next-line no-script-url
      expect(isHttpsAdobeDomain('javascript:alert(1)')).to.be.null;
      expect(isHttpsAdobeDomain('data:text/html,test')).to.be.null;
    });

    it('should handle edge cases', () => {
      expect(isHttpsAdobeDomain('')).to.be.null;
      expect(isHttpsAdobeDomain(null)).to.be.null;
      expect(isHttpsAdobeDomain(undefined)).to.be.null;
    });

    it('should handle URLs with special characters', () => {
      expect(isHttpsAdobeDomain('https://adobe.com/path%20with%20spaces')).to.equal('https://adobe.com/path%20with%20spaces');
      expect(isHttpsAdobeDomain('https://commerce.adobe.com/api?q=test%20query')).to.equal('https://commerce.adobe.com/api?q=test%20query');
    });

    it('should validate exact domain matching', () => {
      expect(isHttpsAdobeDomain('https://adobe.com')).to.equal('https://adobe.com/');
      expect(isHttpsAdobeDomain('https://sub.adobe.com')).to.equal('https://sub.adobe.com/');
      expect(isHttpsAdobeDomain('https://adobe.co')).to.be.null;
    });
  });

  describe('sanitizeUrl', () => {
    it('should return null for invalid inputs', () => {
      expect(sanitizeUrl(null)).to.be.null;
      expect(sanitizeUrl(undefined)).to.be.null;
      expect(sanitizeUrl('')).to.be.null;
      expect(sanitizeUrl(false)).to.be.null;
      expect(sanitizeUrl(0)).to.be.null;
      expect(sanitizeUrl(123)).to.be.null;
      expect(sanitizeUrl({})).to.be.null;
      expect(sanitizeUrl([])).to.be.null;
    });

    it('should successfully process valid Adobe HTTPS URLs through the entire pipeline', () => {
      expect(sanitizeUrl('https://adobe.com')).to.equal('https://adobe.com/');
      expect(sanitizeUrl('https://commerce.adobe.com/path')).to.equal('https://commerce.adobe.com/path');
      expect(sanitizeUrl('/relative/path')).to.equal('/relative/path');
    });

    it('should handle URLs requiring decoding + normalization + domain validation', () => {
      expect(sanitizeUrl('https%3A//adobe.com')).to.equal('https://adobe.com/');
      expect(sanitizeUrl('https%3A//commerce.adobe.com%2Fpath')).to.equal('https://commerce.adobe.com/path');
      expect(sanitizeUrl('https://adobe.com\x00/path')).to.equal('https://adobe.com/path');
      expect(sanitizeUrl('  https://commerce.adobe.com  ')).to.equal('https://commerce.adobe.com/');
    });

    it('should reject URLs that fail at the normalization step (dangerous protocols)', () => {
      // eslint-disable-next-line no-script-url
      expect(sanitizeUrl('javascript:alert(1)')).to.be.null;
      expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).to.be.null;
      // eslint-disable-next-line no-script-url
      expect(sanitizeUrl('javascript%3Aalert%281%29')).to.be.null;
      expect(sanitizeUrl('data%3Atext%2Fhtml%2Ctest')).to.be.null;
    });

    it('should reject URLs that fail at the domain validation step', () => {
      expect(sanitizeUrl('https://example.com')).to.be.null;
      expect(sanitizeUrl('https://adobe-fake.com')).to.be.null;
      expect(sanitizeUrl('http://commerce.adobe.com')).to.be.null;
    });

    it('should handle complex scenarios with multiple encoding levels + normalization', () => {
      expect(sanitizeUrl('https%253A//adobe.com\x00')).to.equal('https://adobe.com/');
      expect(sanitizeUrl('  https%25253A//commerce.adobe.com  ')).to.equal('https://commerce.adobe.com/');
      expect(sanitizeUrl('https%3A//adobe.com%2Fpath%3Fparam%3Dvalue')).to.equal('https://adobe.com/path?param=value');
    });

    it('should handle malformed URLs that cause URL constructor errors', () => {
      expect(sanitizeUrl('https://')).to.be.null;
      expect(sanitizeUrl('https://adobe.com:99999999')).to.be.null;
      expect(sanitizeUrl('https://[invalid-ipv6]')).to.be.null;
    });

    it('should handle URLs that become invalid after decoding', () => {
      // eslint-disable-next-line no-script-url
      expect(sanitizeUrl('javascript%253Aalert%25281%2529')).to.be.null;
      expect(sanitizeUrl('https%3A//example.com')).to.be.null;
      expect(sanitizeUrl('https%3A//')).to.be.null;
    });

    it('should handle edge cases in the pipeline', () => {
      expect(sanitizeUrl('%20%20%20')).to.be.null;
      expect(sanitizeUrl('\x00\x01\x1f')).to.be.null;
      expect(sanitizeUrl('\u0000\u001f\u007f')).to.be.null;
    });
  });

  describe('sanitizeTarget', () => {
    it('should return _blank for falsy values', () => {
      expect(sanitizeTarget(null)).to.equal('_blank');
      expect(sanitizeTarget(undefined)).to.equal('_blank');
      expect(sanitizeTarget('')).to.equal('_blank');
      expect(sanitizeTarget(false)).to.equal('_blank');
      expect(sanitizeTarget(0)).to.equal('_blank');
    });

    it('should return valid standard target values', () => {
      expect(sanitizeTarget('_blank')).to.equal('_blank');
      expect(sanitizeTarget('_self')).to.equal('_self');
      expect(sanitizeTarget('_parent')).to.equal('_parent');
      expect(sanitizeTarget('_top')).to.equal('_top');
    });

    it('should return _blank for targets with invalid characters', () => {
      // eslint-disable-next-line no-script-url
      expect(sanitizeTarget('javascript:alert(1)')).to.equal('_blank');
      expect(sanitizeTarget('_blank onclick="alert(1)"')).to.equal('_blank');
      expect(sanitizeTarget('my window')).to.equal('_blank');
      expect(sanitizeTarget('window.open')).to.equal('_blank');
      expect(sanitizeTarget('window[0]')).to.equal('_blank');
      expect(sanitizeTarget('window+1')).to.equal('_blank');
      expect(sanitizeTarget('<script>alert(1)</script>')).to.equal('_blank');
    });

    it('should return _blank for targets with special unicode characters', () => {
      expect(sanitizeTarget('window\u2028name')).to.equal('_blank');
      expect(sanitizeTarget('window\u2029name')).to.equal('_blank');
      expect(sanitizeTarget('window\uFEFFname')).to.equal('_blank');
    });

    it('should handle complex malicious payloads', () => {
      expect(sanitizeTarget('"><script>alert(1)</script>')).to.equal('_blank');
      expect(sanitizeTarget("' onload='alert(1)")).to.equal('_blank');
      // eslint-disable-next-line no-script-url
      expect(sanitizeTarget('javascript://example.com/%0Aalert(1)')).to.equal('_blank');
      expect(sanitizeTarget('data:text/html,<script>alert(1)</script>')).to.equal('_blank');
    });
  });
});

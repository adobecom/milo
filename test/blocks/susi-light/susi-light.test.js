import { expect } from '@esm-bundle/chai';
import { readFile, setViewport } from '@web/test-runner-commands';
import initSUSI from '../../../libs/blocks/susi-light/susi-light.js';
import { setConfig } from '../../../libs/utils/utils.js';

async function init() {
  try {
    const block = document.body.querySelector('.susi-light');
    await initSUSI(block);
  } catch (e) {
    // should throw error
  }
}

describe('susi light', () => {
  let susiElement;
  let susiHtml;
  let config = {
    env: { name: 'stage' },
    imsClientId: 'milo-test',
    imsScope: 'AdobeID,openid,gnav',
    locales: { '': { ietf: 'en-US', prefix: '/' } },
  };
  describe('sentry element and desktop', () => {
    before(async () => {
      setConfig(config);
      window.adobeIMS = { isSignedInUser: () => false };
      susiHtml = await readFile({ path: './mocks/susi-light.html' });
      document.head.innerHTML = `<link rel="icon" href="/libs/img/favicons/favicon.ico" size="any">
      <script src="https://auth.services.adobe.com/imslib/imslib.min.js" type="javascript/blocked" data-loaded="true"></script>
      <script src="https://auth-light.identity-stage.adobe.com/sentry/wrapper.js" type="javascript/blocked" data-loaded="true"></script>
      `;
      document.body.innerHTML = susiHtml;
      await setViewport({ width: 1200, height: 800 });
      await init();
      susiElement = document.querySelector('susi-sentry-light');
    });
    it('should create SUSI Light Sentry element', async () => {
      expect(susiElement).to.exist;
    });
    it('should have the correct env', async () => {
      expect(susiElement.stage).to.be.true;
    });
    it('should have the correct auth params', async () => {
      expect(susiElement.authParams.client_id).equals(config.imsClientId);
      expect(susiElement.authParams.scope).equals(config.imsScope);
    });
    it('should display login title', async () => {
      const loginTitle = document.querySelector('.login-title');
      expect(loginTitle).to.exist;
      expect(loginTitle.textContent.trim()).equals('Log in or create an account');
    });
    it('should display product info', async () => {
      const susiPrdInfo = document.querySelector('.susi-product-info');
      expect(susiPrdInfo).to.exist;
    });
    it('should add gradient background for desktop', async () => {
      const gradient = 'linear-gradient(165deg, rgb(251, 63, 255) 0%, rgb(230, 255, 41) 35%, rgb(255, 22, 22) 100%)';
      expect(document.querySelector('.susi-light').style.backgroundImage).equals(gradient);
    });
  });
  describe('susi on mobile and locale', () => {
    before(async () => {
      config = { ...config, locales: { fr: { ietf: 'fr-FR', prefix: 'fr' } }, pathname: '/fr/' };
      document.body.innerHTML = susiHtml;
      setConfig(config);
      await setViewport({ width: 600, height: 800 });
      await init();
    });
    it('should have the correct locale', async () => {
      susiElement = document.querySelector('susi-sentry-light');
      expect(susiElement.authParams.locale).equals(config.locales.fr.ietf);
    });
    it('should not add background for mobile', async () => {
      expect(document.querySelector('.susi-light').style.backgroundImage).equals('');
    });
  });
});

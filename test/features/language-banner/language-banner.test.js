/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { setConfig, setTargetMarket } from '../../../libs/utils/utils.js';

const { default: init, sendAnalytics } = await import('../../../libs/features/language-banner/language-banner.js');

const mockMarkets = {
  de: { prefix: 'de', lang: 'de', languageName: 'Deutsch', text: 'Diese Seite ist auch auf', continueText: 'Weiter' },
  fr: { prefix: 'fr', lang: 'fr', languageName: 'Français', text: 'Cette page est également disponible en', continueText: 'Continuer' },
  it: { prefix: 'it', lang: 'it', languageName: 'Italiano', text: 'Visualizza questa pagina in', continueText: 'Continuare' },
};

describe('Language Banner', () => {
  const sandbox = sinon.createSandbox();

  const setConfigForTest = (pathname = '/') => {
    const config = {
      imsClientId: 'milo',
      codeRoot: '/libs',
      contentRoot: window.location.origin,
      locales: {
        '': { ietf: 'en-US', prefix: '' },
        de: { ietf: 'de-DE', prefix: '/de' },
        fr: { ietf: 'fr-FR', prefix: '/fr' },
        it: { ietf: 'it-IT', prefix: '/it' },
        jp: { ietf: 'ja-JP', prefix: '/jp' },
      },
      pathname,
    };
    setConfig(config);
  };

  beforeEach(() => {
    sandbox.stub(console, 'warn');
    window._satellite = { track: sandbox.stub() };
    document.head.innerHTML = '';
    document.body.innerHTML = '<div class="language-banner"></div>';
  });

  afterEach(() => {
    sandbox.restore();
    document.cookie = 'international=; expires= Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    sessionStorage.clear();
    delete window._satellite;
    setTargetMarket(null);
  });

  it('does not show banner if no target markets are provided', async () => {
    setConfigForTest('/');
    await init();
    expect(document.querySelector('.language-banner').childElementCount).to.equal(0);
  });

  it('does not show banner if no target market is set', async () => {
    setConfigForTest('/');
    setTargetMarket(null);
    await init();
    expect(document.querySelector('.language-banner').childElementCount).to.equal(0);
  });

  it('shows banner when target market is set', async () => {
    setConfigForTest('/');
    setTargetMarket(mockMarkets.de);
    await init();
    expect(document.querySelector('.language-banner').childElementCount).to.be.greaterThan(0);
  });

  it('does not build banner if the placeholder element is missing', async () => {
    document.body.innerHTML = ''; // remove the banner placeholder
    setConfigForTest('/');
    setTargetMarket(mockMarkets.de);
    await init();
    expect(document.querySelector('.language-banner')).to.be.null;
  });

  it('shows banner with correct market information', async () => {
    setConfigForTest('/');
    setTargetMarket(mockMarkets.de);

    await init();

    const banner = document.querySelector('.language-banner');
    expect(banner.childElementCount).to.be.greaterThan(0);
    expect(banner.querySelector('.language-banner-text').textContent).to.contain('Deutsch');
    expect(banner.querySelector('.language-banner-link').href).to.include('/de/');
  });

  it('shows banner for French market', async () => {
    setConfigForTest('/');
    setTargetMarket(mockMarkets.fr);

    await init();

    const banner = document.querySelector('.language-banner');
    expect(banner.childElementCount).to.be.greaterThan(0);
    expect(banner.querySelector('.language-banner-text').textContent).to.contain('Français');
  });

  describe('sendAnalytics', () => {
    it('should fire analytics event if satellite is available', () => {
      sendAnalytics(new Event('test-event'));
      expect(window._satellite.track.calledOnce).to.be.true;
    });

    it('should include digitalData if event.data is present', () => {
      const event = new Event('test-event-with-data');
      event.data = { some: 'data' };
      sendAnalytics(event);
      expect(window._satellite.track.calledOnce).to.be.true;
      const [, payload] = window._satellite.track.firstCall.args;
      expect(payload.data._adobe_corpnew.digitalData).to.deep.equal({ some: 'data' });
    });

    it('should wait for alloy_sendEvent if satellite is not available', (done) => {
      delete window._satellite;
      sendAnalytics(new Event('test-event-delayed'));

      window._satellite = { track: sinon.stub() };
      window.dispatchEvent(new CustomEvent('alloy_sendEvent'));

      setTimeout(() => {
        expect(window._satellite.track.calledOnce).to.be.true;
        const [, payload] = window._satellite.track.firstCall.args;
        expect(payload.data.web.webInteraction.name).to.equal('test-event-delayed');
        done();
      }, 0);
    });
  });

  describe('Banner Interaction and Analytics', () => {
    let openStub;

    beforeEach(async () => {
      openStub = sandbox.stub(window, 'open');
      setConfigForTest('/');
      setTargetMarket(mockMarkets.de);
      await init();
    });

    it('fires an analytics event when the banner is shown', () => {
      expect(window._satellite.track.calledOnce).to.be.true;
      const [, payload] = window._satellite.track.firstCall.args;
      expect(payload.data.web.webInteraction.name).to.equal('de-us|language-banner');
    });

    it('sets international cookie and navigates on continue click', async () => {
      const continueLink = document.querySelector('.language-banner-link');
      expect(continueLink).to.exist;

      continueLink.click();

      await new Promise((resolve) => { setTimeout(resolve, 10); });
      expect(document.cookie).to.include('international=de');
      expect(openStub.calledOnceWith(continueLink.href, '_self')).to.be.true;
    });

    it('removes banner and sets cookie on close click', async () => {
      const closeButton = document.querySelector('.language-banner-close');
      expect(closeButton).to.exist;
      closeButton.click();
      expect(document.querySelector('.language-banner')).to.be.null;
      expect(document.cookie).to.include('international=us');
    });
  });
});

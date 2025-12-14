/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import { setConfig } from '../../../libs/utils/utils.js';

const { default: init } = await import('../../../libs/features/language-banner/language-banner.js');

const mockMarkets = {
  data: [
    {
      prefix: '', lang: 'en', languageName: 'English', text: 'This page is also available in', continueText: 'Continue', supportedRegions: 'us, gb',
    },
    {
      prefix: 'de', lang: 'de', languageName: 'Deutsch', text: 'Diese Seite ist auch auf', continueText: 'Weiter', supportedRegions: 'de, at, ch, us', regionPriorities: 'ch:1, lu:2',
    },
    {
      prefix: 'fr', lang: 'fr', languageName: 'Français', text: 'Cette page est également disponible en', continueText: 'Continuer', supportedRegions: 'fr, ch', regionPriorities: 'ch:2, lu:1',
    },
    {
      prefix: 'it', lang: 'it', languageName: 'Italiano', text: 'Visualizza questa pagina in', continueText: 'Continuare', supportedRegions: 'it, ch', regionPriorities: 'ch:3',
    },
    {
      prefix: 'jp', lang: 'ja', languageName: '日本語', text: 'このページは次の言語でもご覧いただけます', continueText: '続行', supportedRegions: 'jp',
    },
  ],
};

describe('Language Banner', () => {
  let fetchStub;
  const sandbox = sinon.createSandbox();

  const setConfigForTest = (pathname = '/') => {
    const config = {
      imsClientId: 'milo',
      codeRoot: '/libs',
      contentRoot: window.location.origin,
      locales: {
        '': { ietf: 'en-US' },
        de: { ietf: 'de-DE' },
        fr: { ietf: 'fr-FR' },
        it: { ietf: 'it-IT' },
        jp: { ietf: 'ja-JP' },
      },
      pathname,
    };
    setConfig(config);
  };

  beforeEach(() => {
    fetchStub = sandbox.stub(window, 'fetch');
    sandbox.stub(console, 'warn');
    window._satellite = { track: sandbox.stub() };
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  afterEach(() => {
    sandbox.restore();
    document.cookie = 'international=; expires= Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    sessionStorage.clear();
    delete window._satellite;
    if (navigator.language) delete navigator.language;
  });

  // Helper to mock geo2.adobe.com fetch call
  const mockGeo = (country = 'us') => {
    fetchStub.withArgs('https://geo2.adobe.com/json/', sinon.match.any).resolves({
      ok: true,
      json: () => Promise.resolve({ country }),
    });
  };

  const getFreshMarkets = () => JSON.parse(JSON.stringify(mockMarkets));

  describe('Banner Suppression Logic', () => {
    it('does not show banner if international cookie is already set to the page locale', async () => {
      document.cookie = 'international=de; path=/';
      setConfigForTest('/de/page');
      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });

    it('does not show banner if preferred language is the same as page language', async () => {
      setConfigForTest('/de/page');
      mockGeo('de');
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });

    it('does not show banner if geo location cannot be determined', async () => {
      setConfigForTest('/');
      fetchStub.withArgs('https://geo2.adobe.com/json/', sinon.match.any).resolves({ ok: false, statusText: 'Not Found' });
      try {
        await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
        expect.fail('The init promise should have been rejected');
      } catch (e) {
        expect(e.message).to.include('Something went wrong getting the akamai Code');
      }
    });

    it('does not show banner if markets config is not available', async () => {
      setConfigForTest('/');
      mockGeo('de');
      await init(Promise.resolve({ ok: false }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });

    it('does not show banner if translated page does not exist', async () => {
      setConfigForTest('/');
      document.cookie = 'international=de; path=/';
      mockGeo('us');
      fetchStub.withArgs(sinon.match.any, { method: 'HEAD' }).resolves({ ok: false });
      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });

    it('does not show banner if markets config fetch fails', async () => {
      setConfigForTest('/');
      document.cookie = 'international=de; path=/';
      mockGeo('us');
      await init(Promise.resolve({ ok: true, json: () => Promise.reject(new Error('Fetch failed')) }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });

    it('does not show banner for supported market if no preferred market is available', async () => {
      setConfigForTest('/');
      // Geo is US, browser lang is French, but there is no French market for US
      mockGeo('us');
      Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
      fetchStub.withArgs(sinon.match.any, { method: 'HEAD' }).resolves({ ok: true });
      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });

    it('does not show banner for unsupported market if no preferred market is available', async () => {
      setConfigForTest('/jp/page');
      // Geo is JP, browser lang is French, but there is no French market for JP
      mockGeo('jp');
      Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
      fetchStub.withArgs(sinon.match.any, { method: 'HEAD' }).resolves({ ok: true });
      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
      expect(document.querySelector('.language-banner')).to.be.null;
    });
  });

  describe('Banner Display Logic', () => {
    const originalSearch = window.location.search;

    afterEach(() => {
      window.history.replaceState({}, '', `/${originalSearch}`);
    });

    it('shows banner using akamaiLocale param over geo', async () => {
      setConfigForTest('/');
      window.history.replaceState({}, '', '?akamaiLocale=de');
      mockGeo('us'); // This should be ignored
      fetchStub.withArgs(sinon.match('/de/'), { method: 'HEAD' }).resolves({ ok: true });

      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));

      const banner = document.querySelector('.language-banner');
      expect(banner).to.exist;
      expect(banner.querySelector('.language-banner-text').textContent).to.contain('Deutsch');
    });

    it('shows banner for supported market with different preferred language from cookie', async () => {
      setConfigForTest('/');
      document.cookie = 'international=de; path=/';
      mockGeo('us');
      fetchStub.withArgs(sinon.match('/de/'), { method: 'HEAD' }).resolves({ ok: true });

      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));

      const banner = document.querySelector('.language-banner');
      expect(banner).to.exist;
      expect(banner.querySelector('.language-banner-text').textContent).to.contain('Deutsch');
      expect(banner.querySelector('.language-banner-link').href).to.include('/de/');
    });

    it('shows banner for supported market with different preferred language from browser', async () => {
      setConfigForTest('/');
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
      mockGeo('us');
      fetchStub.withArgs(sinon.match('/de/'), { method: 'HEAD' }).resolves({ ok: true });

      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));

      const banner = document.querySelector('.language-banner');
      expect(banner).to.exist;
      expect(banner.querySelector('.language-banner-text').textContent).to.contain('Deutsch');
    });

    it('shows banner for unsupported market with a preferred language', async () => {
      setConfigForTest('/jp/page');
      document.cookie = 'international=de; path=/';
      mockGeo('de');
      fetchStub.withArgs(sinon.match('/de/'), { method: 'HEAD' }).resolves({ ok: true });

      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));

      const banner = document.querySelector('.language-banner');
      expect(banner).to.exist;
      expect(banner.querySelector('.language-banner-text').textContent).to.contain('Deutsch');
    });

    it('shows banner for unsupported market based on region priority', async () => {
      setConfigForTest('/');
      mockGeo('ch');
      fetchStub.withArgs(sinon.match('/de/'), { method: 'HEAD' }).resolves({ ok: true });
      fetchStub.withArgs(sinon.match('/fr/'), { method: 'HEAD' }).resolves({ ok: true });
      fetchStub.withArgs(sinon.match('/it/'), { method: 'HEAD' }).resolves({ ok: true });

      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));

      const banner = document.querySelector('.language-banner');
      expect(banner).to.exist;
      // de has higher priority (1) than fr (2) for ch
      expect(banner.querySelector('.language-banner-text').textContent).to.contain('Deutsch');
    });

    it('falls back to the next priority if the first one has no translated page', async () => {
      setConfigForTest('/');
      mockGeo('ch');
      // German page (priority 1) does not exist, French one (priority 2) does,
      // Italian one (priority 3) also exists
      fetchStub.withArgs(sinon.match('/de/'), { method: 'HEAD' }).resolves({ ok: false });
      fetchStub.withArgs(sinon.match('/fr/'), { method: 'HEAD' }).resolves({ ok: true });
      fetchStub.withArgs(sinon.match('/it/'), { method: 'HEAD' }).resolves({ ok: true });

      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));

      const banner = document.querySelector('.language-banner');
      expect(banner).to.exist;
      expect(banner.querySelector('.language-banner-text').textContent).to.contain('Français');
    });
  });

  describe('Banner Interaction and Analytics', () => {
    let openStub;

    beforeEach(async () => {
      openStub = sandbox.stub(window, 'open');
      fetchStub.withArgs(sinon.match.any, { method: 'HEAD' }).resolves({ ok: true });
      setConfigForTest('/');
      document.cookie = 'international=de; path=/';
      mockGeo('us');
      await init(Promise.resolve({ ok: true, json: () => Promise.resolve(getFreshMarkets()) }));
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

      // allow async import of setInternational to resolve
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

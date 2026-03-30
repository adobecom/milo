/* eslint-disable no-underscore-dangle */
import sinon from 'sinon';
import { expect } from '@esm-bundle/chai';
import {
  setConfig,
  setLangRoutingConfig,
  decorateLanguageBanner,
  getLangRoutingConfig,
} from '../../../libs/utils/utils.js';

const { default: init, sendAnalytics } = await import('../../../libs/features/language-banner/language-banner.js');

const mockMarkets = {
  de: { prefix: 'de', lang: 'de', text: 'Diese Seite ist auch auf Deutsch.', continueText: 'Weiter' },
  fr: { prefix: 'fr', lang: 'fr', text: 'Cette page est également disponible en Français.', continueText: 'Continuer' },
  it: { prefix: 'it', lang: 'it', text: 'Visualizza questa pagina in Italiano.', continueText: 'Continuare' },
};

describe('Language Banner', () => {
  const sandbox = sinon.createSandbox();

  const setConfigForTest = (locale, pathname = '/') => {
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
    if (locale) config.locale = locale;
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
    setLangRoutingConfig(null);
    document.dir = 'ltr';
    document.documentElement.removeAttribute('dir');
  });

  it('does not show banner if no target markets are provided', async () => {
    setConfigForTest();
    await init();
    expect(document.querySelector('.language-banner').childElementCount).to.equal(0);
  });

  it('does not show banner if no target market is set', async () => {
    setConfigForTest();
    setLangRoutingConfig(null);
    await init();
    expect(document.querySelector('.language-banner').childElementCount).to.equal(0);
  });

  it('shows banner when target market is set', async () => {
    setConfigForTest();
    setLangRoutingConfig({ showBanner: true, markets: [mockMarkets.de] });
    await init();
    expect(document.querySelector('.language-banner').childElementCount).to.be.greaterThan(0);
  });

  it('does not build banner if the placeholder element is missing', async () => {
    document.body.innerHTML = ''; // remove the banner placeholder
    setConfigForTest();
    setLangRoutingConfig({ showBanner: true, markets: [mockMarkets.de] });
    await init();
    expect(document.querySelector('.language-banner')).to.be.null;
  });

  it('shows banner with correct market information', async () => {
    setConfigForTest();
    setLangRoutingConfig({ showBanner: true, markets: [mockMarkets.de] });

    await init();

    const banner = document.querySelector('.language-banner');
    expect(banner.childElementCount).to.be.greaterThan(0);
    expect(banner.querySelector('.language-banner-text').textContent).to.equal('Diese Seite ist auch auf Deutsch.');
    expect(banner.querySelector('.language-banner-link').href).to.include('/de/');
  });

  it('shows banner with custom sentence if provided', async () => {
    setConfigForTest();
    const customMarket = {
      prefix: 'jp',
      lang: 'ja',
      text: 'このページを日本語で表示する',
      continueText: '続く',
    };
    setLangRoutingConfig({ showBanner: true, markets: [customMarket] });

    await init();

    const banner = document.querySelector('.language-banner');
    expect(banner.querySelector('.language-banner-text').textContent).to.equal('このページを日本語で表示する');
    expect(banner.querySelector('.language-banner-link').textContent).to.equal('続く');
  });

  it('handles RTL correctly', async () => {
    const customMarket = {
      prefix: 'ae_ar',
      lang: 'ar',
      text: 'عرض هذه الصفحة باللغة العربية',
      continueText: 'متابعة',
      dir: 'rtl',
    };
    setLangRoutingConfig({ showBanner: true, markets: [customMarket] });

    await init();

    const banner = document.querySelector('.language-banner');
    expect(banner.getAttribute('dir')).to.equal('rtl');
    const content = document.querySelector('.language-banner-content');
    expect(content.firstElementChild.classList.contains('language-banner-text')).to.be.true;
  });

  it('shows banner for French market', async () => {
    setConfigForTest();
    setLangRoutingConfig({ showBanner: true, markets: [mockMarkets.fr] });

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
      setConfigForTest();
      setLangRoutingConfig({ showBanner: true, markets: [mockMarkets.de] });
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

  describe('decorateLanguageBanner', () => {
    const routingLocales = {
      '': { ietf: 'en-US', prefix: '' },
      de: { ietf: 'de-DE', prefix: '/de' },
      fr: { ietf: 'fr-FR', prefix: '/fr' },
      it: { ietf: 'it-IT', prefix: '/it' },
      jp: { ietf: 'ja-JP', prefix: '/jp' },
    };

    const mockMarketsData = {
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
          prefix: 'jp', lang: 'jp', languageName: '日本語', text: 'このページは次の言語でもご覧いただけます', continueText: '続行', supportedRegions: 'jp',
        },
      ],
    };

    const marketsWithFrSupportedInDe = {
      data: [
        {
          prefix: '', lang: 'en', languageName: 'English', text: 'EN', continueText: 'Go', supportedRegions: 'us',
        },
        {
          prefix: 'de', lang: 'de', languageName: 'Deutsch', text: 'DE', continueText: 'Weiter', supportedRegions: 'de',
        },
        {
          prefix: 'fr', lang: 'fr', languageName: 'Français', text: 'FR', continueText: 'Continuer', supportedRegions: 'de,fr',
        },
      ],
    };

    const parseTestFetchUrl = (req) => {
      const href = typeof req === 'string' ? req : (req?.url ?? '');
      try {
        const parsed = new URL(String(href), window.location.origin);
        return { hostname: parsed.hostname, pathname: parsed.pathname };
      } catch {
        return { hostname: '', pathname: '' };
      }
    };

    const defaultFetchForLanguageBanner = (marketPayload, headOk = true) => (url, opts) => {
      const { hostname, pathname } = parseTestFetchUrl(url);
      const method = opts?.method ?? (url instanceof Request ? url.method : 'GET') ?? 'GET';
      if (pathname.includes('supported-markets')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(JSON.parse(JSON.stringify(marketPayload))),
        });
      }
      if (method === 'HEAD') {
        return Promise.resolve({ ok: headOk, status: headOk ? 200 : 404 });
      }
      if (pathname.includes('lingo-site-mapping')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
      }
      if (hostname === 'geo2.adobe.com') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ country: 'DE' }),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    };

    const setPathConfig = (pathname = '/') => {
      setConfig({
        imsClientId: 'milo',
        codeRoot: '/libs',
        contentRoot: window.location.origin,
        locales: routingLocales,
        pathname,
      });
    };

    let fetchStub;

    beforeEach(() => {
      setLangRoutingConfig(null);
      document.head.innerHTML = '<meta name="languagebanner" content="on">';
      document.body.innerHTML = '';
      sessionStorage.setItem('akamai', 'de');
      fetchStub = sandbox.stub(window, 'fetch').callsFake(defaultFetchForLanguageBanner(mockMarketsData, true));
    });

    it('returns without setting lang routing when language banner is not enabled', async () => {
      document.head.innerHTML = '';
      setPathConfig('/');
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('returns when international cookie already matches page locale', async () => {
      document.cookie = 'international=de; path=/';
      setPathConfig('/de/page');
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('returns when geo country cannot be resolved', async () => {
      sessionStorage.removeItem('akamai');
      fetchStub.callsFake((url, opts) => {
        const { hostname } = parseTestFetchUrl(url);
        if (hostname === 'geo2.adobe.com') {
          return Promise.resolve({ ok: false, statusText: 'err' });
        }
        return defaultFetchForLanguageBanner(mockMarketsData, true)(url, opts);
      });
      setPathConfig('/de/page');
      Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('returns when markets config fetch fails', async () => {
      fetchStub.callsFake((url, opts) => {
        const { pathname } = parseTestFetchUrl(url);
        if (pathname.includes('supported-markets')) return Promise.resolve({ ok: false });
        return defaultFetchForLanguageBanner(mockMarketsData, true)(url, opts);
      });
      setPathConfig('/de/page');
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('returns when markets data is empty', async () => {
      fetchStub.callsFake((url, opts) => {
        const { pathname } = parseTestFetchUrl(url);
        if (pathname.includes('supported-markets')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
        }
        return defaultFetchForLanguageBanner(mockMarketsData, true)(url, opts);
      });
      setPathConfig('/de/page');
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('returns on supported market when preferred language matches page language', async () => {
      setPathConfig('/de/page');
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('sets banner routing when supported market and browser prefers another language available for geo', async () => {
      fetchStub.callsFake(defaultFetchForLanguageBanner(marketsWithFrSupportedInDe, true));
      setPathConfig('/de/page');
      Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
      await decorateLanguageBanner();
      const cfg = getLangRoutingConfig();
      expect(cfg?.showBanner).to.equal(true);
      expect(cfg?.showModal).to.equal(false);
      expect(cfg?.markets?.some((m) => m.prefix === 'fr')).to.equal(true);
    });

    it('onlybanner flow sets single-market banner when a candidate page exists', async () => {
      document.head.innerHTML = `
        <meta name="languagebanner" content="on">
        <meta name="onlybanner" content="on">
      `;
      sessionStorage.setItem('akamai', 'ch');
      setPathConfig('/');
      Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
      await decorateLanguageBanner();
      const cfg = getLangRoutingConfig();
      expect(cfg?.showBanner).to.equal(true);
      expect(cfg?.showModal).to.equal(false);
      expect(cfg?.markets?.length).to.equal(1);
    });

    it('does not set routing when onlybanner HEAD checks all fail', async () => {
      document.head.innerHTML = `
        <meta name="languagebanner" content="on">
        <meta name="onlybanner" content="on">
      `;
      sessionStorage.setItem('akamai', 'ch');
      fetchStub.callsFake((url, opts) => {
        const { pathname } = parseTestFetchUrl(url);
        const method = opts?.method ?? (url instanceof Request ? url.method : 'GET') ?? 'GET';
        if (pathname.includes('supported-markets')) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(JSON.parse(JSON.stringify(mockMarketsData))),
          });
        }
        if (pathname.includes('lingo-site-mapping')) {
          return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
        }
        if (method === 'HEAD') {
          return Promise.resolve({ ok: false, status: 404 });
        }
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      });
      setPathConfig('/');
      Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()).to.be.null;
    });
  });
});

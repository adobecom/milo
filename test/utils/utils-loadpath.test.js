import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { waitFor, delay } from '../helpers/waitfor.js';
import {
  setConfig,
  loadArea,
  pageExist,
  decorateLanguageBanner,
  getLangRoutingConfig,
  setLangRoutingConfig,
  registerBlockDeps,
} from '../../libs/utils/utils.js';

const BASE_HEAD = '<link rel="icon" href="data:,"><meta name="martech" content="off">';

const baseLocales = {
  '': { ietf: 'en-US', tk: 'hah7vzn.css' },
  de: { ietf: 'de-DE', tk: 'hah7vzn.css' },
  fr: { ietf: 'fr-FR', tk: 'hah7vzn.css' },
};

const baseConfig = () => ({
  imsClientId: 'milo',
  codeRoot: '/libs',
  contentRoot: window.location.origin,
  locales: baseLocales,
  marketsSource: 'loadpath',
  pathname: '/',
});

const mockMarkets = {
  data: [
    {
      prefix: '', lang: 'en', languageName: 'English', text: 'This page is also available in', continueText: 'Continue', supportedRegions: 'us, gb',
    },
    {
      prefix: 'de', lang: 'de', languageName: 'Deutsch', text: 'Diese Seite ist auch auf', continueText: 'Weiter', supportedRegions: 'de, at, ch, us', regionPriorities: 'ch:1',
    },
    {
      prefix: 'fr', lang: 'fr', languageName: 'Français', text: 'Cette page est également disponible en', continueText: 'Continuer', supportedRegions: 'fr, ch', regionPriorities: 'ch:2',
    },
  ],
};

const stubNetwork = (sandbox, { headOk = true, geoCountry = 'DE' } = {}) => {
  const fetchStub = sandbox.stub(window, 'fetch');
  fetchStub.callsFake((resource, opts) => {
    const href = typeof resource === 'string' ? resource : (resource?.url ?? '');
    const method = opts?.method ?? 'GET';
    if (href.includes('supported-markets')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(JSON.parse(JSON.stringify(mockMarkets))),
      });
    }
    if (href.includes('lingo-site-mapping')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: [] }) });
    }
    if (href.includes('languages-config')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          'locale-to-language-map': { data: [] },
          'site-languages': { data: [] },
          'langmap-native-to-en': { data: [] },
        }),
      });
    }
    if (href.includes('geo2.adobe.com')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ country: geoCountry }),
      });
    }
    if (method === 'HEAD') {
      return Promise.resolve({ ok: headOk, status: headOk ? 200 : 404 });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}), text: () => Promise.resolve('') });
  });
  return fetchStub;
};

describe('Load path optimizations', () => {
  const sandbox = sinon.createSandbox();

  beforeEach(() => {
    document.head.innerHTML = BASE_HEAD;
    document.body.innerHTML = '';
    sessionStorage.clear();
    setLangRoutingConfig(null);
  });

  afterEach(() => {
    sandbox.restore();
    sessionStorage.clear();
    setLangRoutingConfig(null);
    document.cookie = 'international=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    if (navigator.language) delete navigator.language;
  });

  describe('speculative LCP resource hints', () => {
    it('preloads first-section block assets and fragment content before page mods', async () => {
      registerBlockDeps('marquee', '/libs/utils/logWebVitals.js');
      document.body.innerHTML = `<main>
        <div>
          <div class="marquee">
            <div>
              <div><picture><img alt="mobile"></picture></div>
              <div><picture><img alt="tablet"></picture></div>
              <div><picture><img alt="desktop"></picture></div>
            </div>
            <div><div><h1>Heading</h1></div></div>
          </div>
          <div class="hide-block"></div>
          <p><a href="/fragments/loadpath-frag">Fragment</a></p>
          <p><a href="/fragments/loadpath-modal#open-modal">Modal fragment</a></p>
          <p><a href="https://www.external-example.com/fragments/ext">External fragment</a></p>
          <p><a href="/fragments/loadpath-dnt#_dnt">DNT fragment</a></p>
        </div>
      </main>`;
      setConfig(baseConfig());
      await loadArea();
      expect(document.head.querySelector('link[rel="preload"][as="script"][href*="/libs/blocks/marquee/marquee.js"]')).to.exist;
      expect(document.head.querySelector('link[rel="preload"][as="style"][href*="/libs/blocks/marquee/marquee.css"]')).to.exist;
      expect(document.head.querySelector('link[rel="preload"][href*="/libs/utils/decorate.js"]')).to.exist;
      expect(document.head.querySelector('link[rel="preload"][href*="/libs/utils/logWebVitals.js"]')).to.exist;
      expect(document.head.querySelector('link[rel="preload"][as="fetch"][href*="/fragments/loadpath-frag.plain.html"]')).to.exist;
      expect(document.head.querySelector('link[href*="/fragments/loadpath-dnt.plain.html"]')).to.exist;
      expect(document.head.querySelector('link[href*="loadpath-modal"]')).to.be.null;
      expect(document.head.querySelector('link[href*="external-example.com"]')).to.be.null;
      registerBlockDeps('marquee');
    });

    it('starts the language config fetch before page mods', async () => {
      const fetchStub = stubNetwork(sandbox);
      document.body.innerHTML = `<main>
        <div><p><a href="https://news.adobe.com/loadpath">News link</a></p></div>
      </main>`;
      setConfig(baseConfig());
      await loadArea();
      expect(fetchStub.getCalls().some((call) => String(call.args[0]).includes('languages-config'))).to.be.true;
    });

    it('warms the imslib fetch while the lingo region resolves', async () => {
      document.head.innerHTML = `${BASE_HEAD}<meta name="langfirst" content="on">`;
      setConfig(baseConfig());
      const { loadIms } = await import('../../libs/utils/utils.js');
      loadIms().catch(() => {});
      await delay(50);
      expect(document.head.querySelector('link[rel="preload"][as="script"][href*="imslib.min.js"]')).to.exist;
    });

    it('skips fragment content preloads when lingo is active', async () => {
      document.head.innerHTML = `${BASE_HEAD}<meta name="langfirst" content="on">`;
      sessionStorage.setItem('akamai', 'us');
      document.body.innerHTML = `<main>
        <div><p><a href="/fragments/lingo-frag">Fragment</a></p></div>
      </main>`;
      setConfig(baseConfig());
      await loadArea();
      expect(document.head.querySelector('link[href*="lingo-frag.plain.html"]')).to.be.null;
    });
  });

  describe('geo service preconnect', () => {
    it('preconnects to geo2 when the language banner is on and no geo is cached', async () => {
      stubNetwork(sandbox);
      document.head.innerHTML = `${BASE_HEAD}<meta name="languagebanner" content="on">`;
      setConfig(baseConfig());
      await loadArea();
      expect(document.head.querySelector('link[rel="preconnect"][href="https://geo2.adobe.com"]')).to.exist;
      await delay(20);
    });

    it('skips the geo2 preconnect when the country is already cached', async () => {
      stubNetwork(sandbox);
      sessionStorage.setItem('akamai', 'us');
      document.head.innerHTML = `${BASE_HEAD}<meta name="languagebanner" content="on">`;
      setConfig(baseConfig());
      await loadArea();
      expect(document.head.querySelector('link[rel="preconnect"][href="https://geo2.adobe.com"]')).to.be.null;
      await delay(20);
    });
  });

  describe('pageExist session cache', () => {
    it('caches positive results in sessionStorage', async () => {
      const fetchStub = stubNetwork(sandbox);
      const url = `${window.location.origin}/loadpath-exists`;
      expect(await pageExist(url)).to.be.true;
      expect(await pageExist(url)).to.be.true;
      expect(fetchStub.callCount).to.equal(1);
      expect(sessionStorage.getItem(`pageExist:${url}`)).to.equal('true');
    });

    it('caches negative results in sessionStorage', async () => {
      const fetchStub = stubNetwork(sandbox, { headOk: false });
      const url = `${window.location.origin}/loadpath-missing`;
      expect(await pageExist(url)).to.be.false;
      expect(await pageExist(url)).to.be.false;
      expect(fetchStub.callCount).to.equal(1);
      expect(sessionStorage.getItem(`pageExist:${url}`)).to.equal('false');
    });

    it('returns false on 401 responses for non-aem hosts', async () => {
      sandbox.stub(window, 'fetch').resolves({ ok: false, status: 401 });
      expect(await pageExist(`${window.location.origin}/loadpath-401`)).to.be.false;
    });

    it('falls back to GET for aem hosts on 401', async () => {
      const fetchStub = sandbox.stub(window, 'fetch');
      fetchStub.onFirstCall().resolves({ ok: false, status: 401 });
      fetchStub.onSecondCall().resolves({ ok: true, status: 200 });
      expect(await pageExist('https://main--milo--adobecom.aem.page/loadpath')).to.be.true;
      expect(fetchStub.callCount).to.equal(2);
    });
  });

  describe('language banner reveal decoupling', () => {
    it('reserves then removes the banner space when no banner shows', async () => {
      stubNetwork(sandbox);
      sessionStorage.setItem('akamai', 'de');
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
      document.head.innerHTML = `${BASE_HEAD}<meta name="languagebanner" content="on">`;
      setConfig({ ...baseConfig(), pathname: '/de/page' });
      await decorateLanguageBanner();
      expect(document.body.querySelector(':scope > .language-banner')).to.be.null;
      expect(getLangRoutingConfig()).to.be.null;
    });

    it('keeps the reserved space and clears the gnav promo when the banner shows', async () => {
      stubNetwork(sandbox);
      sessionStorage.setItem('akamai', 'ch');
      Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
      document.head.innerHTML = `${BASE_HEAD}
        <meta name="languagebanner" content="on">
        <meta name="onlybanner" content="on">
      `;
      document.body.innerHTML = `
        <header class="global-navigation has-promo"></header>
        <div class="feds-promo-aside-wrapper"></div>
      `;
      setConfig(baseConfig());
      await decorateLanguageBanner();
      expect(getLangRoutingConfig()?.showBanner).to.be.true;
      expect(document.body.querySelector(':scope > .language-banner')).to.exist;
      expect(document.querySelector('.feds-promo-aside-wrapper')).to.be.null;
      expect(document.querySelector('header').classList.contains('has-promo')).to.be.false;
    });

    it('does not duplicate an already reserved banner space', async () => {
      stubNetwork(sandbox);
      sessionStorage.setItem('akamai', 'ch');
      Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
      document.head.innerHTML = `${BASE_HEAD}
        <meta name="languagebanner" content="on">
        <meta name="onlybanner" content="on">
      `;
      document.body.innerHTML = '<div class="language-banner"></div>';
      setConfig(baseConfig());
      await decorateLanguageBanner();
      expect(document.body.querySelectorAll(':scope > .language-banner').length).to.equal(1);
    });
  });

  describe('loadPostLCP ordering', () => {
    it('starts fonts early and resolves the banner decision without gating reveal', async () => {
      stubNetwork(sandbox);
      sessionStorage.setItem('akamai', 'de');
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
      document.head.innerHTML = `${BASE_HEAD}<meta name="languagebanner" content="on">`;
      document.body.innerHTML = '<main><div><p>Content</p></div></main>';
      setConfig({ ...baseConfig(), pathname: '/de/page' });
      await loadArea();
      expect(document.head.querySelector('link[href*="use.typekit.net"]')).to.exist;
      expect(document.body.querySelector(':scope > .language-banner')).to.be.null;
    });
  });

  describe('c2 lenis loading', () => {
    afterEach(() => {
      window.lenis?.destroy?.();
      delete window.lenis;
    });

    it('initializes lenis without blocking section processing', async () => {
      document.head.innerHTML = `${BASE_HEAD}<meta name="foundation" content="c2">`;
      document.body.innerHTML = `<main>
        <div>
          <div class="columns"><div><div>Invalid on c2</div></div></div>
          <p>Content</p>
        </div>
      </main><div class="modal-curtain is-open"></div>`;
      setConfig(baseConfig());
      await loadArea();
      await waitFor(() => window.lenis, 3000, 50);
      expect(window.lenis).to.exist;
      window.dispatchEvent(new WheelEvent('wheel', { deltaY: 200 }));
      expect(window.lenis.options.lerp).to.equal(0.11);
      await delay(800);
      expect(window.lenis.options.lerp).to.equal(0.06);
    }).timeout(5000);

    it('continues without lenis when its assets fail to load', async () => {
      document.head.innerHTML = `${BASE_HEAD}<meta name="foundation" content="c2">`;
      document.body.innerHTML = '<main><div><p>Content</p></div></main>';
      setConfig({ ...baseConfig(), codeRoot: '/loadpath-missing' });
      await loadArea();
      await delay(200);
      expect(window.lenis).to.be.undefined;
    });
  });
});

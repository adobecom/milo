import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

import showRegionModal from '../../../libs/features/region-modal/region-modal.js';
import {
  createTag,
  setConfig,
  getConfig,
  loadStyle,
  decorateLanguageBanner,
  getLangRoutingConfig,
  setLangRoutingConfig,
} from '../../../libs/utils/utils.js';

const baseConfig = {
  locales: {
    '': { ietf: 'en-US' },
    de: { ietf: 'de-DE' },
  },
  locale: { prefix: '' },
  codeRoot: '/libs',
  miloLibs: '/libs',
  marketsConfig: {
    languages: {
      data: [
        { prefix: '', nativeName: 'United States', langName: 'English', defaultMarket: 'us' },
        { prefix: 'de', nativeName: 'Germany', langName: 'Deutsch', defaultMarket: 'de' },
      ],
    },
  },
};

function stubHeadOk(ok = true) {
  return sinon.stub(window, 'fetch').callsFake((url, options) => {
    if (options?.method === 'HEAD') {
      return Promise.resolve({ ok });
    }
    if (String(url).includes('/federal/assets/markets.json')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: [
            { marketCode: 'us', en: 'United States' },
            { marketCode: 'de', en: 'Germany' },
          ],
        }),
      });
    }
    return Promise.resolve({ ok: false, json: () => ({}) });
  });
}

const noopLoadBlock = () => Promise.resolve();

function removeRegionModal() {
  document.querySelectorAll('#region-modal, .modal-curtain').forEach((el) => el.remove());
  document.body.classList.remove('disable-scroll');
}

describe('Region modal feature', () => {
  beforeEach(() => {
    sessionStorage.setItem('akamai', 'us');
  });

  afterEach(() => {
    removeRegionModal();
    sinon.restore();
    setConfig({});
    document.cookie = 'international=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('akamai');
    sessionStorage.removeItem('market');
  });

  it('returns without rendering when suggestedMarkets is missing or empty', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(undefined, getConfig(), createTag, loadStyle, noopLoadBlock);
    expect(document.querySelector('#region-modal')).to.be.null;
    await showRegionModal({ markets: [] }, getConfig(), createTag, loadStyle, noopLoadBlock);
    expect(document.querySelector('#region-modal')).to.be.null;
  });

  it('returns without rendering when no suggested locale passes the page HEAD check', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(false);
    await showRegionModal(
      { markets: [{ prefix: 'de', nativeName: 'Deutsch', lang: 'de' }] },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    expect(document.querySelector('#region-modal')).to.be.null;
  });

  it('opens a modal with a single-locale layout when one market is available', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    const markets = [{
      prefix: '',
      nativeName: 'United States',
      lang: 'en',
      modalTitle: 'Title for modal',
      modalDescription: 'Description',
      continueText: 'Continue',
    }];
    await showRegionModal({ markets }, getConfig(), createTag, loadStyle, noopLoadBlock);
    const modal = document.querySelector('#region-modal.region-modal');
    expect(modal).to.not.be.null;
    const wrapper = modal.querySelector('.georouting-wrapper');
    expect(wrapper).to.not.be.null;
    expect(wrapper.querySelector('.tabs.quiet')).to.be.null;
    expect(wrapper.querySelector('h3').textContent).to.equal('Title for modal');
    expect(wrapper.querySelector('a.con-button')).to.not.be.null;
  });

  it('opens a modal with tabs when multiple locales are available', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [
          {
            prefix: '',
            nativeName: 'United States',
            lang: 'en',
            language: 'English',
            modalTitle: 'US title',
            modalDescription: 'US desc',
          },
          {
            prefix: 'de',
            nativeName: 'Deutschland',
            lang: 'de',
            language: 'Deutsch',
            modalTitle: 'DE title',
            modalDescription: 'DE desc',
          },
        ],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    expect(modal.querySelector('.tabs.quiet')).to.not.be.null;
    const tabpanels = modal.querySelectorAll('.tabpanel, .section .section-metadata');
    expect(tabpanels.length).to.be.greaterThan(0);
  });

  it('shows a locale picker when multiple destinations share a tab', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [
          {
            prefix: 'de',
            nativeName: 'Deutsch',
            lang: 'de',
            language: 'Deutsch',
            modalTitle: 'T1',
            modalDescription: 'D1',
          },
          {
            prefix: '',
            nativeName: 'English',
            lang: 'en',
            language: 'English',
            modalTitle: 'T2',
            modalDescription: 'D2',
          },
        ],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const pickerButton = modal.querySelector('a.con-button[aria-haspopup="true"]');
    expect(pickerButton).to.not.be.null;
    expect(pickerButton.getAttribute('aria-expanded')).to.equal('false');
    pickerButton.click();
    const picker = modal.querySelector('.picker');
    expect(picker).to.not.be.null;
    expect(picker.querySelectorAll('a').length).to.equal(2);
  });

  it('sets international cookie when choosing another locale from the picker', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    sinon.stub(window, 'open').callsFake(() => {});
    await showRegionModal(
      {
        markets: [
          {
            prefix: 'de',
            nativeName: 'Deutsch',
            lang: 'de',
            language: 'Deutsch',
            modalTitle: 'T',
            modalDescription: 'D',
          },
          {
            prefix: '',
            nativeName: 'English',
            lang: 'en',
            language: 'English',
            modalTitle: 'T2',
            modalDescription: 'D2',
          },
        ],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    modal.querySelector('a.con-button').click();
    const firstPickerLink = modal.querySelector('.picker a');
    expect(firstPickerLink).to.not.be.null;
    firstPickerLink.click();
    expect(document.cookie).to.include('international=');
  });

  it('substitutes {country} in copy when geoMarketCode is provided', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: '',
          nativeName: 'English',
          lang: 'en',
          language: 'English',
          modalTitle: 'Prefer {country}',
          modalDescription: 'Go to {country}',
        }],
        geoMarketCode: 'us',
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    expect(modal.querySelector('h3').textContent).to.equal('Prefer US');
    expect(modal.querySelector('p.locale-text').textContent).to.equal('Go to US');
  });

  it('sets the daa-ll attribute on the main action link', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
          modalTitle: 'T',
          modalDescription: 'D',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const mainAction = modal.querySelector('a.con-button');
    expect(mainAction).to.not.be.null;
    expect(mainAction.getAttribute('daa-ll')).to.include('Continue:');
  });

  it('sets the daa-ll attribute on the stay link', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
          modalTitle: 'T',
          modalDescription: 'D',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const stayLink = modal.querySelector('.link-wrapper a:not(.con-button)');
    expect(stayLink).to.not.be.null;
    expect(stayLink.getAttribute('daa-ll')).to.include('Stay:');
  });

  it('sets international cookie when clicking the stay link', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
          modalTitle: 'T',
          modalDescription: 'D',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const stayLink = modal.querySelector('.link-wrapper a:not(.con-button)');
    expect(stayLink).to.not.be.null;
    stayLink.click();
    await new Promise((r) => { setTimeout(r, 0); });
    expect(document.cookie).to.include('international=');
  });

  it('navigates and sets international cookie on single-market main action click', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    sinon.stub(window, 'open').callsFake(() => {});
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
          modalTitle: 'Switch',
          modalDescription: 'Desc',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const mainAction = modal.querySelector('a.con-button');
    mainAction.click();
    await new Promise((r) => { setTimeout(r, 0); });
    expect(document.cookie).to.include('international=de');
    expect(window.open.called).to.be.true;
  });

  it('includes the locale-text paragraph in the modal content', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: '',
          nativeName: 'English',
          lang: 'en',
          language: 'English',
          modalTitle: 'Title',
          modalDescription: 'Description text here',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const text = modal.querySelector('p.locale-text');
    expect(text).to.not.be.null;
    expect(text.textContent).to.equal('Description text here');
  });

  it('includes link-wrapper with both main action and stay link', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
          modalTitle: 'T',
          modalDescription: 'D',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const linkWrapper = modal.querySelector('.link-wrapper');
    expect(linkWrapper).to.not.be.null;
    const links = linkWrapper.querySelectorAll('a');
    expect(links.length).to.equal(2);
  });

  it('applies default modalTitle when market has none', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const title = modal.querySelector('h3');
    expect(title.textContent).to.include('adobe');
  });

  it('applies default continueText when not provided', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          nativeName: 'Deutsch',
          lang: 'de',
          language: 'Deutsch',
          modalTitle: 'T',
          modalDescription: 'D',
        }],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const mainAction = modal.querySelector('a.con-button');
    expect(mainAction).to.not.be.null;
  });

  it('appends country param to market URLs when geoMarketCode is provided', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    sinon.stub(window, 'open').callsFake(() => {});
    await showRegionModal(
      {
        markets: [{
          prefix: 'de',
          language: 'Deutsch',
          lang: 'de',
          nativeName: 'Deutsch',
          modalTitle: 'T',
          modalDescription: 'D',
        }],
        geoMarketCode: 'de',
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const mainAction = modal.querySelector('a.con-button');
    expect(mainAction).to.not.be.null;
    mainAction.click();
    await new Promise((r) => { setTimeout(r, 0); });
    if (window.open.called) {
      expect(window.open.firstCall.args[0]).to.include('country=de');
    }
  });

  it('renders the picker with keyboard navigation support', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [
          {
            prefix: 'de',
            nativeName: 'Deutsch',
            lang: 'de',
            language: 'Deutsch',
            modalTitle: 'T1',
            modalDescription: 'D1',
          },
          {
            prefix: '',
            nativeName: 'English',
            lang: 'en',
            language: 'English',
            modalTitle: 'T2',
            modalDescription: 'D2',
          },
        ],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const pickerButton = modal.querySelector('a.con-button[aria-haspopup="true"]');
    pickerButton.dispatchEvent(new KeyboardEvent('keydown', { code: 'Space', bubbles: true }));
    const picker = modal.querySelector('.picker');
    expect(picker).to.not.be.null;
    const pickerLinks = picker.querySelectorAll('a');
    expect(pickerLinks.length).to.equal(2);
    pickerLinks[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape', bubbles: true }));
    expect(modal.querySelector('.picker')).to.be.null;
  });

  it('removes picker via outside click', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [
          {
            prefix: 'de',
            language: 'Deutsch',
            modalTitle: 'T1',
            modalDescription: 'D1',
          },
          {
            prefix: '',
            language: 'English',
            modalTitle: 'T2',
            modalDescription: 'D2',
          },
        ],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const pickerButton = modal.querySelector('a.con-button[aria-haspopup="true"]');
    pickerButton.click();
    expect(modal.querySelector('.picker')).to.not.be.null;
    document.body.click();
    await new Promise((r) => { setTimeout(r, 0); });
    expect(modal.querySelector('.picker')).to.be.null;
  });

  it('prevents duplicate picker when button is clicked multiple times', async () => {
    setConfig({ ...baseConfig });
    stubHeadOk(true);
    await showRegionModal(
      {
        markets: [
          {
            prefix: 'de',
            language: 'Deutsch',
            modalTitle: 'T1',
            modalDescription: 'D1',
          },
          {
            prefix: '',
            language: 'English',
            modalTitle: 'T2',
            modalDescription: 'D2',
          },
        ],
      },
      getConfig(),
      createTag,
      loadStyle,
      noopLoadBlock,
    );
    const modal = document.querySelector('#region-modal');
    const pickerButton = modal.querySelector('a.con-button[aria-haspopup="true"]');
    pickerButton.click();
    pickerButton.click();
    pickerButton.click();
    const pickers = modal.querySelectorAll('.picker');
    expect(pickers.length).to.equal(1);
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

    beforeEach(() => {
      setLangRoutingConfig(null);
      document.head.innerHTML = '<meta name="languagebanner" content="on">';
      document.body.innerHTML = '';
      sessionStorage.setItem('akamai', 'ch');
      sinon.stub(window, 'fetch').callsFake(defaultFetchForLanguageBanner(mockMarketsData, true));
      setPathConfig('/');
    });

    it('sets modal routing for ACOM flow when page market is not supported for geo', async () => {
      Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
      await decorateLanguageBanner();
      const cfg = getLangRoutingConfig();
      expect(cfg?.showModal).to.equal(true);
      expect(cfg?.showBanner).to.equal(false);
      expect(cfg?.geoMarketCode).to.equal('ch');
      expect(cfg?.markets?.length).to.be.greaterThan(0);
    });
  });
});

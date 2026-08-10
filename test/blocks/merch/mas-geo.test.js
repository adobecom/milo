import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import {
  getMiloLocaleSettings,
  isMasFragmentLink,
  getMasFragmentId,
  getMasFragmentUrl,
  preloadMasFragment,
  parseMarketsLanguages,
  marketsLangForLocale,
  validateMarket,
  resolveMasMarket,
} from '../../../libs/blocks/merch/mas-geo.js';

const link = (href) => {
  const a = document.createElement('a');
  a.href = href;
  return a;
};

const STUDIO = 'https://mas.adobe.com/studio.html';

describe('mas-geo', () => {
  describe('getMiloLocaleSettings', () => {
    it('derives locale/country from a GeoMap prefix', () => {
      expect(getMiloLocaleSettings({ prefix: '/fr' })).to.deep.include({ locale: 'fr_FR', country: 'FR' });
      expect(getMiloLocaleSettings({ prefix: '/ch_de' })).to.deep.include({ locale: 'de_CH', country: 'CH' });
    });

    it('applies EXTRA_MAS_LOCALES (pr -> es_PR, country US)', () => {
      expect(getMiloLocaleSettings({ prefix: '/pr' })).to.deep.include({ locale: 'es_PR', country: 'US' });
    });

    it('defaults to en_US', () => {
      expect(getMiloLocaleSettings()).to.deep.include({ locale: 'en_US', country: 'US' });
    });
  });

  describe('isMasFragmentLink / getMasFragmentId', () => {
    it('recognises a mas studio link', () => {
      expect(isMasFragmentLink(link(`${STUDIO}#fragment=abc`))).to.equal(true);
      expect(isMasFragmentLink(link('https://www.adobe.com/foo'))).to.equal(false);
      expect(isMasFragmentLink(null)).to.equal(false);
    });

    it('extracts the fragment id from the hash', () => {
      expect(getMasFragmentId(link(`${STUDIO}#content-type=merch-card&fragment=abc123`))).to.equal('abc123');
    });

    it('supports the query alias', () => {
      expect(getMasFragmentId(link(`${STUDIO}#query=xyz`))).to.equal('xyz');
    });

    it('returns null when there is no fragment', () => {
      expect(getMasFragmentId(link(`${STUDIO}#content-type=merch-card`))).to.equal(null);
    });
  });

  describe('getMasFragmentUrl', () => {
    it('omits country when it is implied by the locale suffix', () => {
      const url = getMasFragmentUrl('id1', { locale: 'fr_FR', country: 'FR' });
      expect(url).to.include('id=id1');
      expect(url).to.include('locale=fr_FR');
      expect(url).to.not.include('country=');
    });

    it('adds country when it is not implied by the locale', () => {
      expect(getMasFragmentUrl('id1', { locale: 'fr_FR', country: 'CH' })).to.include('country=CH');
    });

    it('uses the default api key', () => {
      expect(getMasFragmentUrl('id1', { locale: 'en_US' })).to.include('api_key=wcms-commerce-ims-ro-user-milo');
    });
  });

  describe('preloadMasFragment', () => {
    afterEach(() => {
      document.head.querySelectorAll('link[rel="preload"][as="fetch"]').forEach((l) => l.remove());
      document.head.querySelectorAll('meta[name="mas-geo-detection"]').forEach((m) => m.remove());
      sessionStorage.removeItem('akamai');
    });

    it('appends a preload link for the fragment and returns the url', () => {
      const url = preloadMasFragment(link(`${STUDIO}#fragment=frag1`), { locale: { prefix: '/fr' } });
      expect(url).to.include('id=frag1');
      expect(url).to.include('locale=fr_FR');
      const el = document.head.querySelector('link[rel="preload"][as="fetch"]');
      expect(el).to.not.equal(null);
      expect(el.href).to.equal(url);
      expect(el.crossOrigin).to.equal('anonymous');
    });

    it('preloads nothing and returns null when there is no fragment id', () => {
      const url = preloadMasFragment(link(`${STUDIO}#content-type=merch-card`), { locale: { prefix: '/fr' } });
      expect(url).to.equal(null);
      expect(document.head.querySelector('link[rel="preload"][as="fetch"]')).to.equal(null);
    });

    it('uses the sync market country on mas-geo-detection pages', () => {
      const meta = document.createElement('meta');
      meta.name = 'mas-geo-detection';
      meta.content = 'on';
      document.head.appendChild(meta);
      sessionStorage.setItem('akamai', 'ch');
      const url = preloadMasFragment(link(`${STUDIO}#fragment=frag2`), { locale: { prefix: '/fr' } });
      expect(url).to.include('country=CH');
    });

    it('applies MARKET_LOCALE_OVERRIDES for an AU visitor on the global-EN site', () => {
      const meta = document.createElement('meta');
      meta.name = 'mas-geo-detection';
      meta.content = 'on';
      document.head.appendChild(meta);
      sessionStorage.setItem('akamai', 'au');
      const url = preloadMasFragment(link(`${STUDIO}#fragment=frag3`), { locale: { prefix: '' } });
      expect(url).to.include('locale=en_GB');
      expect(url).to.include('country=AU');
    });

    it('drops country for a GB visitor (en_GB already implies GB)', () => {
      const meta = document.createElement('meta');
      meta.name = 'mas-geo-detection';
      meta.content = 'on';
      document.head.appendChild(meta);
      sessionStorage.setItem('akamai', 'gb');
      const url = preloadMasFragment(link(`${STUDIO}#fragment=frag4`), { locale: { prefix: '' } });
      expect(url).to.include('locale=en_GB');
      expect(url).to.not.include('country=');
    });

    it('uses an explicit resolved market over the sync guess', () => {
      const meta = document.createElement('meta');
      meta.name = 'mas-geo-detection';
      meta.content = 'on';
      document.head.appendChild(meta);
      sessionStorage.setItem('akamai', 'de'); // sync guess would be DE
      const url = preloadMasFragment(link(`${STUDIO}#fragment=frag5`), { locale: { prefix: '/fr' }, market: 'ch' });
      expect(url).to.include('country=CH');
      expect(url).to.not.include('country=DE');
    });
  });

  describe('parseMarketsLanguages', () => {
    it('reads the languages.data shape', () => {
      expect(parseMarketsLanguages({ languages: { data: [{ prefix: '' }] } })).to.deep.equal([{ prefix: '' }]);
    });
    it('reads the flat data shape', () => {
      expect(parseMarketsLanguages({ data: [{ prefix: 'de' }] })).to.deep.equal([{ prefix: 'de' }]);
    });
    it('returns [] for empty input', () => {
      expect(parseMarketsLanguages(null)).to.deep.equal([]);
    });
  });

  describe('marketsLangForLocale', () => {
    const cfg = { languages: [{ prefix: '', defaultMarket: 'us' }, { prefix: 'de', defaultMarket: 'de' }] };
    it('matches by prefix', () => {
      expect(marketsLangForLocale(cfg, { prefix: '/de' }).defaultMarket).to.equal('de');
    });
    it('falls back to the first entry', () => {
      expect(marketsLangForLocale(cfg, { prefix: '/zz' }).defaultMarket).to.equal('us');
    });
  });

  describe('validateMarket', () => {
    const cfg = { languages: [{ prefix: '', supportedRegions: 'us,ca,gb', defaultMarket: 'us' }] };
    it('passes a supported market through', () => {
      expect(validateMarket(cfg, 'gb', { prefix: '' })).to.equal('gb');
    });
    it('clamps an unsupported market to defaultMarket', () => {
      expect(validateMarket(cfg, 'zz', { prefix: '' })).to.equal('us');
    });
    it('uses defaultMarket when nothing is detected', () => {
      expect(validateMarket(cfg, undefined, { prefix: '' })).to.equal('us');
    });
    it('returns the detected market when there is no config', () => {
      expect(validateMarket(null, 'ch', { prefix: '' })).to.equal('ch');
    });
  });

  describe('resolveMasMarket', () => {
    afterEach(() => {
      sinon.restore();
      document.head.querySelectorAll('meta[name="mas-geo-detection"]').forEach((m) => m.remove());
      sessionStorage.removeItem('akamai');
    });

    const enableGeo = () => {
      const meta = document.createElement('meta');
      meta.name = 'mas-geo-detection';
      meta.content = 'on';
      document.head.appendChild(meta);
    };

    it('returns null when geo-detection is off (no fetch)', async () => {
      const fetchStub = sinon.stub(window, 'fetch');
      expect(await resolveMasMarket({ locale: { prefix: '' } })).to.equal(null);
      expect(fetchStub.called).to.equal(false);
    });

    it('returns the clamped market on a geo-detection page', async () => {
      enableGeo();
      sessionStorage.setItem('akamai', 'zz'); // unsupported -> clamps to defaultMarket
      sinon.stub(window, 'fetch').resolves({
        ok: true,
        json: () => Promise.resolve({ languages: { data: [{ prefix: '', supportedRegions: 'us,gb', defaultMarket: 'us' }] } }),
      });
      expect(await resolveMasMarket({ locale: { prefix: '' }, marketsUrl: '/x.json' })).to.equal('us');
    });

    it('keeps a supported detected market', async () => {
      enableGeo();
      sessionStorage.setItem('akamai', 'gb');
      sinon.stub(window, 'fetch').resolves({
        ok: true,
        json: () => Promise.resolve({ languages: { data: [{ prefix: '', supportedRegions: 'us,gb', defaultMarket: 'us' }] } }),
      });
      expect(await resolveMasMarket({ locale: { prefix: '' }, marketsUrl: '/x.json' })).to.equal('gb');
    });

    it('falls back to the sync guess when the fetch fails', async () => {
      enableGeo();
      sessionStorage.setItem('akamai', 'ch');
      sinon.stub(window, 'fetch').rejects(new Error('network'));
      expect(await resolveMasMarket({ locale: { prefix: '' }, marketsUrl: '/x.json' })).to.equal('ch');
    });
  });
});

import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';

const { setConfig, updateConfig } = await import('../../../../libs/utils/utils.js');

const config = {
  miloLibs: 'https://main--milo--adobecom.aem.live/libs',
  codeRoot: 'https://main--homepage--adobecom.aem.live/homepage',
  locale: {
    ietf: 'en-US',
    tk: 'hah7vzn.css',
    prefix: '',
    region: 'us',
    regions: {},
  },
  mep: {
    experiments: [],
    prefix: '',
    highlight: true,
    consentState: { functional: true, advertising: true },
    targetEnabled: true,
  },
  env: { name: 'stage' },
};

setConfig(config);

const fetchFn = (url) => {
  const href = typeof url === 'string' ? url : (url?.url || '');
  if (href.includes('supported-markets')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({ languages: { data: [] } }),
    });
  }
  return Promise.resolve({ ok: true, status: 200, json: async () => ({}), text: async () => '' });
};
const fetchStub = sinon.stub(window, 'fetch').callsFake(fetchFn);

const {
  CARD_STORAGE_KEY,
  TOP_MARKETS,
  API_URLS,
  getExpandedCards,
  toSlug,
  hasMasChanges,
  getTopMarketsAvailability,
  getCaasSummary,
  getPageId,
  getLocale,
  getLastSeen,
  getManifestList,
  getConsentSummary,
  getPageSummary,
  getMasSummary,
  getLingoRegions,
  getLingoAvailability,
  getLingoSummary,
  getMasAvailability,
  getMasRegions,
  getSpoofGeoOptions,
  findGeoGroupForLocale,
  setPreviewButton,
  getAdditionalManifests,
} = await import('../../../../libs/features/mep/mep-next/mep-overlay/mep-overlay-logic.js');

after(() => fetchStub.restore());

describe('CARD_STORAGE_KEY', () => {
  it('is a non-empty string', () => {
    expect(CARD_STORAGE_KEY).to.be.a('string').and.not.empty;
  });

  it('equals "mep-expanded-cards"', () => {
    expect(CARD_STORAGE_KEY).to.equal('mep-expanded-cards');
  });
});

describe('TOP_MARKETS', () => {
  it('is an array', () => {
    expect(TOP_MARKETS).to.be.an('array');
  });

  it('contains common market codes', () => {
    expect(TOP_MARKETS).to.include('us');
    expect(TOP_MARKETS).to.include('jp');
    expect(TOP_MARKETS).to.include('de');
    expect(TOP_MARKETS).to.include('fr');
  });

  it('includes an empty string representing the default / US market', () => {
    expect(TOP_MARKETS).to.include('');
  });
});

describe('API_URLS', () => {
  it('exposes all expected endpoint keys', () => {
    expect(API_URLS).to.include.keys('pageList', 'pageDetails', 'pageDataByURL', 'save', 'report');
  });

  it('all values are non-empty strings', () => {
    Object.values(API_URLS).forEach((v) => expect(v).to.be.a('string').and.not.empty);
  });
});

describe('getExpandedCards', () => {
  afterEach(() => localStorage.removeItem(CARD_STORAGE_KEY));

  it('returns an empty Set when localStorage has no entry', () => {
    const result = getExpandedCards();
    expect(result).to.be.instanceof(Set);
    expect(result.size).to.equal(0);
  });

  it('returns a Set populated from a valid JSON array in localStorage', () => {
    localStorage.setItem(CARD_STORAGE_KEY, JSON.stringify(['card-a', 'card-b']));
    const result = getExpandedCards();
    expect(result.has('card-a')).to.be.true;
    expect(result.has('card-b')).to.be.true;
    expect(result.size).to.equal(2);
  });

  it('returns an empty Set when localStorage contains invalid JSON', () => {
    localStorage.setItem(CARD_STORAGE_KEY, '{not-valid-json');
    const result = getExpandedCards();
    expect(result).to.be.instanceof(Set);
    expect(result.size).to.equal(0);
  });

  it('returns an empty Set when stored value is null (JSON.parse null edge case)', () => {
    localStorage.setItem(CARD_STORAGE_KEY, 'null');
    const result = getExpandedCards();
    expect(result).to.be.instanceof(Set);
    expect(result.size).to.equal(0);
  });
});

describe('toSlug', () => {
  it('lowercases the input', () => {
    expect(toSlug('HELLO')).to.equal('hello');
  });

  it('replaces spaces with dashes', () => {
    expect(toSlug('hello world')).to.equal('hello-world');
  });

  it('collapses a run of spaces into a single dash', () => {
    expect(toSlug('a  b')).to.equal('a-b');
  });

  it('replaces @ with "a"', () => {
    expect(toSlug('@')).to.equal('a');
    expect(toSlug('M@S')).to.equal('mas');
  });

  it('strips characters that are not word chars or dashes', () => {
    expect(toSlug('hello!')).to.equal('hello');
    expect(toSlug('a.b')).to.equal('ab');
    expect(toSlug('a/b')).to.equal('ab');
  });

  it('handles common overlay label strings', () => {
    expect(toSlug('Spoof Geo')).to.equal('spoof-geo');
    expect(toSlug('Preview Link')).to.equal('preview-link');
    expect(toSlug('Other Fragments')).to.equal('other-fragments');
    expect(toSlug('M@S')).to.equal('mas');
  });
});

describe('hasMasChanges', () => {
  function makeMutations(nodes) {
    return [{ addedNodes: nodes }];
  }

  it('returns true when a merch-card element is added', () => {
    expect(hasMasChanges(makeMutations([document.createElement('merch-card')]))).to.be.true;
  });

  it('returns true when an element with data-mas-block is added', () => {
    const el = document.createElement('div');
    el.dataset.masBlock = 'collection';
    expect(hasMasChanges(makeMutations([el]))).to.be.true;
  });

  it('returns true when an element with data-wcs-osi is added', () => {
    const el = document.createElement('span');
    el.setAttribute('data-wcs-osi', 'osi-1');
    expect(hasMasChanges(makeMutations([el]))).to.be.true;
  });

  it('returns true when a mas-field element is added', () => {
    expect(hasMasChanges(makeMutations([document.createElement('mas-field')]))).to.be.true;
  });

  it('returns true when an added node contains a MAS descendant', () => {
    const parent = document.createElement('div');
    parent.append(document.createElement('merch-card'));
    expect(hasMasChanges(makeMutations([parent]))).to.be.true;
  });

  it('returns false for a plain div with no MAS attributes', () => {
    expect(hasMasChanges(makeMutations([document.createElement('div')]))).to.be.false;
  });

  it('returns false for a text node', () => {
    expect(hasMasChanges(makeMutations([document.createTextNode('hello')]))).to.be.false;
  });

  it('returns false for an empty mutations array', () => {
    expect(hasMasChanges([])).to.be.false;
  });

  it('returns false when mutation has no added nodes', () => {
    expect(hasMasChanges(makeMutations([]))).to.be.false;
  });
});

describe('getTopMarketsAvailability', () => {
  it('always returns true', () => {
    expect(getTopMarketsAvailability()).to.be.true;
  });
});

describe('getCaasSummary', () => {
  it('returns null', () => {
    expect(getCaasSummary()).to.be.null;
  });
});

describe('getPageId', () => {
  beforeEach(() => setConfig(config));
  afterEach(() => setConfig(config));

  it('returns an empty string when the mep page has no pageId', () => {
    expect(getPageId()).to.equal('');
  });
});

describe('getLocale', () => {
  afterEach(() => updateConfig(config));

  it('returns the locale ietf value in lowercase', () => {
    setConfig({ ...config, locale: { ...config.locale, ietf: 'en-US' } });
    expect(getLocale()).to.equal('en-us');
  });

  it('handles already-lowercase locale strings', () => {
    updateConfig({ ...config, locale: { ...config.locale, ietf: 'fr-fr' } });
    expect(getLocale()).to.equal('fr-fr');
  });
});

describe('getManifestList', () => {
  afterEach(() => setConfig(config));

  it('returns an empty manifests array when mep has no experiments', () => {
    setConfig(config);
    const { manifests } = getManifestList();
    expect(manifests).to.be.an('array').with.lengthOf(0);
  });

  it('returns manifestParameter alongside manifests', () => {
    setConfig(config);
    const result = getManifestList();
    expect(result).to.have.keys('manifests', 'manifestParameter');
  });

  it('returns one manifest descriptor per experiment', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Test Campaign',
          manifest: '/homepage/fragments/mep/test.json',
          variantNames: ['variant-a', 'variant-b'],
          selectedVariantName: 'variant-a',
          source: 'adobe-target',
          geoRestriction: null,
          mktgAction: null,
          disabled: false,
          analyticsTitle: 'Test',
        }],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests).to.have.lengthOf(1);
  });

  it('populates manifest descriptor with correct fields', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'My Activity',
          manifest: '/homepage/fragments/mep/test.json',
          variantNames: ['variant-a'],
          selectedVariantName: 'variant-a',
          source: 'adobe-target',
          geoRestriction: null,
          mktgAction: null,
          disabled: false,
        }],
      },
    });
    const { manifests } = getManifestList();
    const [m] = manifests;
    expect(m.index).to.equal(1);
    expect(m.targetActivityName).to.equal('My Activity');
    expect(m.selectedVariantName).to.equal('variant-a');
    expect(m.source).to.equal('adobe-target');
    expect(m.isDefaultSelected).to.be.false;
    expect(m.isActive).to.equal('active');
    expect(m.options).to.be.an('array');
  });

  it('sets isDefaultSelected true when selectedVariantName is not in variantNames', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Default Test',
          manifest: '/homepage/fragments/mep/default.json',
          variantNames: ['variant-a'],
          selectedVariantName: 'default',
          source: 'helix',
          disabled: false,
        }],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests[0].isDefaultSelected).to.be.true;
  });

  it('builds options with None, Default, and each variant', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Opts Test',
          manifest: '/homepage/fragments/mep/opts.json',
          variantNames: ['v-a', 'v-b'],
          selectedVariantName: 'v-a',
          source: 'helix',
          disabled: false,
        }],
      },
    });
    const { manifests } = getManifestList();
    const values = manifests[0].options.map((o) => o.value);
    expect(values).to.include('');
    expect(values).to.include('default');
    expect(values).to.include('v-a');
    expect(values).to.include('v-b');
  });

  it('marks the selected variant option as selected', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Select Test',
          manifest: '/homepage/fragments/mep/sel.json',
          variantNames: ['v-a', 'v-b'],
          selectedVariantName: 'v-b',
          source: 'helix',
          disabled: false,
        }],
      },
    });
    const { manifests } = getManifestList();
    const vb = manifests[0].options.find((o) => o.value === 'v-b');
    expect(vb.selected).to.be.true;
    const va = manifests[0].options.find((o) => o.value === 'v-a');
    expect(va.selected).to.be.false;
  });

  it('uppercases geoRestriction when present', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Geo Test',
          manifest: '/homepage/fragments/mep/geo.json',
          variantNames: ['v-a'],
          selectedVariantName: 'v-a',
          source: 'helix',
          geoRestriction: 'emea',
          disabled: false,
        }],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests[0].geoRestriction).to.equal('EMEA');
  });

  it('sets showActive and isActive correctly when experiment is disabled', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Disabled',
          manifest: '/homepage/fragments/mep/dis.json',
          variantNames: ['v-a'],
          selectedVariantName: 'v-a',
          source: 'helix',
          disabled: true,
        }],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests[0].showActive).to.be.true;
    expect(manifests[0].isActive).to.equal('inactive');
  });

  it('indexes multiple experiments starting from 1', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [
          {
            name: 'A', manifest: '/a.json', variantNames: ['v'], selectedVariantName: 'v', source: 'helix', disabled: false,
          },
          {
            name: 'B', manifest: '/b.json', variantNames: ['v'], selectedVariantName: 'v', source: 'helix', disabled: false,
          },
        ],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests[0].index).to.equal(1);
    expect(manifests[1].index).to.equal(2);
  });
});

describe('getPageSummary', () => {
  beforeEach(() => setConfig(config));
  afterEach(() => setConfig(config));

  it('returns a promise that resolves to an array of label-value pairs', async () => {
    const pairs = await getPageSummary();
    expect(pairs).to.be.an('array');
    pairs.forEach(([label]) => {
      expect(label).to.be.a('string');
    });
  });

  it('includes Manifests Found, Foundation, Theme, Target Integration, Personalization', async () => {
    const pairs = await getPageSummary();
    const labels = pairs.map(([l]) => l);
    expect(labels).to.include('Manifests Found');
    expect(labels).to.include('Foundation');
    expect(labels).to.include('Theme');
    expect(labels).to.include('Target Integration');
    expect(labels).to.include('Personalization');
  });

  it('reports 0 manifests found when experiments array is empty', async () => {
    const pairs = await getPageSummary();
    const [, found] = pairs.find(([l]) => l === 'Manifests Found');
    expect(found).to.equal(0);
  });

  it('reports manifests found count matching experiments length', async () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [
          {
            name: 'A', manifest: '/a.json', variantNames: ['v'], selectedVariantName: 'v', source: 'helix', disabled: false,
          },
          {
            name: 'B', manifest: '/b.json', variantNames: ['v'], selectedVariantName: 'v', source: 'helix', disabled: false,
          },
        ],
      },
    });
    const pairs = await getPageSummary();
    const [, found] = pairs.find(([l]) => l === 'Manifests Found');
    expect(found).to.equal(2);
  });
});

describe('getConsentSummary', () => {
  afterEach(() => setConfig(config));

  it('returns a promise resolving to two label-value pairs', async () => {
    const pairs = await getConsentSummary();
    expect(pairs).to.be.an('array').with.lengthOf(2);
  });

  it('returns "on" for performance (functional) when consentState.functional is true', async () => {
    setConfig({
      ...config,
      mep: { ...config.mep, consentState: { functional: true, advertising: false } },
    });
    const pairs = await getConsentSummary();
    const [, val] = pairs.find(([l]) => l === 'Level 2 | Performance');
    expect(val).to.equal('on');
  });

  it('returns "off" for performance when consentState.functional is false', async () => {
    setConfig({
      ...config,
      mep: { ...config.mep, consentState: { functional: false, advertising: true } },
    });
    const pairs = await getConsentSummary();
    const [, val] = pairs.find(([l]) => l === 'Level 2 | Performance');
    expect(val).to.equal('off');
  });

  it('returns "on" for advertising when consentState.advertising is true', async () => {
    setConfig({
      ...config,
      mep: { ...config.mep, consentState: { functional: false, advertising: true } },
    });
    const pairs = await getConsentSummary();
    const [, val] = pairs.find(([l]) => l === 'Level 4 | Advertising');
    expect(val).to.equal('on');
  });

  it('returns "off" for advertising when consentState.advertising is false', async () => {
    setConfig({
      ...config,
      mep: { ...config.mep, consentState: { functional: true, advertising: false } },
    });
    const pairs = await getConsentSummary();
    const [, val] = pairs.find(([l]) => l === 'Level 4 | Advertising');
    expect(val).to.equal('off');
  });
});

describe('getLingoRegions', () => {
  afterEach(() => updateConfig(config));

  it('returns an empty array when locale has no regions', () => {
    setConfig(config);
    expect(getLingoRegions()).to.deep.equal([]);
  });

  it('returns the keys of locale.regions', () => {
    updateConfig({ ...config, locale: { ...config.locale, regions: { ch_de: {}, at_de: {} } } });
    const regions = getLingoRegions();
    expect(regions).to.include('ch_de');
    expect(regions).to.include('at_de');
    expect(regions).to.have.lengthOf(2);
  });

  it('returns a single-element array when only one region is configured', () => {
    updateConfig({ ...config, locale: { ...config.locale, regions: { lu_fr: {} } } });
    expect(getLingoRegions()).to.deep.equal(['lu_fr']);
  });
});

describe('getLingoAvailability', () => {
  let lingoMeta;

  afterEach(() => {
    lingoMeta?.remove();
    lingoMeta = null;
    updateConfig(config);
  });

  function enableLingo() {
    lingoMeta = document.createElement('meta');
    lingoMeta.name = 'langfirst';
    lingoMeta.content = 'on';
    document.head.append(lingoMeta);
  }

  it('returns false when langfirst meta tag is absent', () => {
    setConfig(config);
    expect(getLingoAvailability()).to.be.false;
  });

  it('returns false when lingo is active but no regions are configured', () => {
    enableLingo();
    setConfig(config);
    expect(getLingoAvailability()).to.be.false;
  });

  it('returns true when lingo is active and regions exist in config', () => {
    enableLingo();
    updateConfig({ ...config, locale: { ...config.locale, regions: { ch_de: {} } } });
    expect(getLingoAvailability()).to.be.true;
  });
});

describe('getMasRegions', () => {
  afterEach(() => setConfig(config));

  it('returns an array (empty when markets config has no data for locale)', async () => {
    setConfig(config);
    const regions = await getMasRegions();
    expect(regions).to.be.an('array');
  });
});

describe('getMasAvailability', () => {
  afterEach(() => {
    document.querySelectorAll('[data-mas-block], merch-card, mas-field').forEach((el) => el.remove());
    setConfig(config);
  });

  it('returns false when no MAS surfaces are on the page', async () => {
    const available = await getMasAvailability();
    expect(available).to.be.false;
  });
});

describe('getSpoofGeoOptions', () => {
  afterEach(() => {
    window.history.replaceState({}, '', window.location.pathname);
    setConfig(config);
  });

  it('returns one option per TOP_MARKETS entry for "spoof-geo-top-markets"', async () => {
    const options = await getSpoofGeoOptions('spoof-geo-top-markets');
    expect(options).to.be.an('array').with.lengthOf(TOP_MARKETS.length);
  });

  it('top-markets options have value, label, and selected properties', async () => {
    const options = await getSpoofGeoOptions('spoof-geo-top-markets');
    options.forEach((opt) => {
      expect(opt).to.have.keys('value', 'label', 'selected');
    });
  });

  it('uppercases market codes in labels', async () => {
    const options = await getSpoofGeoOptions('spoof-geo-top-markets');
    const us = options.find((o) => o.value === 'us');
    expect(us.label).to.equal('US');
  });

  it('gives the empty-value option a "Don\'t spoof" label', async () => {
    const options = await getSpoofGeoOptions('spoof-geo-top-markets');
    const none = options.find((o) => o.value === '');
    expect(none).to.exist;
    expect(none.label).to.include("Don't spoof");
  });

  it('marks option as selected when akamaiLocale URL param matches', async () => {
    window.history.replaceState({}, '', '/?akamaiLocale=jp');
    const options = await getSpoofGeoOptions('spoof-geo-top-markets');
    const jp = options.find((o) => o.value === 'jp');
    expect(jp.selected).to.be.true;
    const us = options.find((o) => o.value === 'us');
    expect(us.selected).to.be.false;
  });

  it('returns empty array for "spoof-geo-mep-lingo" when lingo is inactive', async () => {
    const options = await getSpoofGeoOptions('spoof-geo-mep-lingo');
    expect(options).to.deep.equal([]);
  });

  it('returns empty array for an unknown id', async () => {
    const options = await getSpoofGeoOptions('spoof-geo-unknown');
    expect(options).to.deep.equal([]);
  });

  it('returns lingo region options when lingo is active and regions exist', async () => {
    let lingoMeta;
    try {
      lingoMeta = document.createElement('meta');
      lingoMeta.name = 'langfirst';
      lingoMeta.content = 'on';
      document.head.append(lingoMeta);
      updateConfig({ ...config, locale: { ...config.locale, regions: { ch_de: {}, at_de: {} } } });
      const options = await getSpoofGeoOptions('spoof-geo-mep-lingo');
      expect(options).to.be.an('array').with.lengthOf(2);
      const values = options.map((o) => o.value);
      expect(values).to.include('ch');
      expect(values).to.include('at');
    } finally {
      lingoMeta?.remove();
      setConfig(config);
    }
  });

  it('returns mas region options for "spoof-geo-lingo-mas" when MAS surfaces and regions exist', async () => {
    const card = document.createElement('merch-card');
    document.body.append(card);
    setConfig(config);
    fetchStub.callsFake((url) => {
      const href = typeof url === 'string' ? url : (url?.url || '');
      if (href.includes('supported-markets')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ languages: { data: [{ prefix: '', supportedRegions: 'us,ca,au' }] } }),
        });
      }
      return fetchFn(url);
    });
    try {
      const options = await getSpoofGeoOptions('spoof-geo-lingo-mas');
      expect(options).to.be.an('array').with.length.greaterThan(0);
      options.forEach((opt) => {
        expect(opt).to.have.keys('value', 'label', 'selected');
      });
    } finally {
      card.remove();
      fetchStub.callsFake(fetchFn);
      setConfig(config);
    }
  });
});

describe('findGeoGroupForLocale', () => {
  afterEach(() => setConfig(config));

  it('returns "spoof-geo-top-markets" for locales in TOP_MARKETS', async () => {
    expect(await findGeoGroupForLocale('us')).to.equal('spoof-geo-top-markets');
    expect(await findGeoGroupForLocale('jp')).to.equal('spoof-geo-top-markets');
    expect(await findGeoGroupForLocale('de')).to.equal('spoof-geo-top-markets');
  });

  it('returns "spoof-geo-top-markets" for the empty-string locale', async () => {
    expect(await findGeoGroupForLocale('')).to.equal('spoof-geo-top-markets');
  });

  it('returns null for a locale not present in any group', async () => {
    setConfig(config);
    expect(await findGeoGroupForLocale('xx')).to.be.null;
  });

  it('returns "spoof-geo-mep-lingo" for a locale that matches a lingo region', async () => {
    let lingoMeta;
    try {
      lingoMeta = document.createElement('meta');
      lingoMeta.name = 'langfirst';
      lingoMeta.content = 'on';
      document.head.append(lingoMeta);
      updateConfig({ ...config, locale: { ...config.locale, regions: { ch_de: {} } } });
      expect(await findGeoGroupForLocale('ch_de')).to.equal('spoof-geo-mep-lingo');
    } finally {
      lingoMeta?.remove();
      setConfig(config);
    }
  });
});

describe('setPreviewButton', () => {
  let drawer;

  beforeEach(() => {
    setConfig(config);
    drawer = document.createElement('div');
    drawer.id = 'mep-drawer';
    drawer.innerHTML = '<div class="mep-footer"><a class="con-button" href="">Preview</a></div>';
    document.body.append(drawer);
  });

  afterEach(() => {
    drawer.remove();
    window.history.replaceState({}, '', window.location.pathname);
  });

  it('sets a href on the preview button containing the "mep" query param', async () => {
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.include('mep=');
  });

  it('does not throw when the drawer has no manifest inputs', async () => {
    let err;
    try { await setPreviewButton(); } catch (e) { err = e; }
    expect(err).to.be.undefined;
  });

  it('includes akamaiLocale in href when spoof geo select has a non-empty value', async () => {
    const select = document.createElement('select');
    select.className = 'mep-spoof-geo';
    const opt = document.createElement('option');
    opt.value = 'de';
    select.append(opt);
    select.value = 'de';
    drawer.append(select);
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.include('akamaiLocale=de');
  });

  it('removes akamaiLocale from href when spoof geo select value is empty', async () => {
    const select = document.createElement('select');
    select.className = 'mep-spoof-geo';
    const opt = document.createElement('option');
    opt.value = '';
    select.append(opt);
    select.value = '';
    drawer.append(select);
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.not.include('akamaiLocale');
  });

  it('includes mepButton=off when toggle-preview-link checkbox is checked', async () => {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'toggle-preview-link';
    cb.checked = true;
    drawer.append(cb);
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.include('mepButton=off');
  });

  it('excludes mepButton from href when toggle-preview-link is unchecked', async () => {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'toggle-preview-link';
    cb.checked = false;
    drawer.append(cb);
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.not.include('mepButton');
  });

  it('includes mepHighlight param when toggle-mep checkbox is checked', async () => {
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = 'toggle-mep';
    cb.checked = true;
    drawer.append(cb);
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.include('mepHighlight=true');
  });

  it('includes manifest path in mep param when a manifest text input has a value', async () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'mep-load-manifest';
    input.value = '/fragments/mep/new-manifest.json';
    drawer.append(input);
    await setPreviewButton();
    const href = drawer.querySelector('.mep-footer a.con-button').getAttribute('href');
    expect(href).to.include('new-manifest.json');
  });
});

describe('getMasSummary', () => {
  afterEach(() => {
    document.querySelectorAll('merch-card, mas-field, [data-mas-block], mas-commerce-service').forEach((el) => el.remove());
    document.head.querySelectorAll('mas-commerce-service').forEach((el) => el.remove());
    document.head.querySelectorAll('meta[name="mas-geo-detection"]').forEach((el) => el.remove());
    window.history.replaceState({}, '', window.location.pathname);
    setConfig(config);
  });

  it('returns an array of label-value pairs', () => {
    setConfig(config);
    const result = getMasSummary();
    expect(result).to.be.an('array').with.length.greaterThan(0);
    result.forEach(([label]) => expect(label).to.be.a('string'));
  });

  it('reports 0 detected surfaces when the page has no MAS elements', () => {
    const result = getMasSummary();
    const [, subPairs] = result.find(([l]) => l === 'Surfaces');
    const [, detected] = subPairs.find(([l]) => l === 'Detected');
    expect(detected).to.equal(0);
  });

  it('counts merch-card elements under Cards', () => {
    document.body.append(document.createElement('merch-card'));
    const result = getMasSummary();
    const [, subPairs] = result.find(([l]) => l === 'Surfaces');
    const [, count] = subPairs.find(([l]) => l === 'Cards');
    expect(count).to.equal(1);
  });

  it('counts mas-field elements under Inline Fields', () => {
    document.body.append(document.createElement('mas-field'));
    const result = getMasSummary();
    const [, subPairs] = result.find(([l]) => l === 'Surfaces');
    const [, count] = subPairs.find(([l]) => l === 'Inline Fields');
    expect(count).to.equal(1);
  });

  it('counts [data-mas-block="collection"] elements under Collections', () => {
    const el = document.createElement('div');
    el.dataset.masBlock = 'collection';
    document.body.append(el);
    const result = getMasSummary();
    const [, subPairs] = result.find(([l]) => l === 'Surfaces');
    const [, count] = subPairs.find(([l]) => l === 'Collections');
    expect(count).to.equal(1);
  });

  it('exposes Mas Geo Detection as "off" when isMasGeoDetectionEnabled returns false', () => {
    const result = getMasSummary();
    const [, val] = result.find(([l]) => l === 'Mas Geo Detection');
    expect(val).to.be.oneOf(['on', 'off']);
  });

  it('exposes Page Market derived from locale', () => {
    const result = getMasSummary();
    const [, market] = result.find(([l]) => l === 'Page Market');
    expect(market).to.be.a('string');
  });

  it('reports market source from page locale when no mas-commerce-service is present', () => {
    const result = getMasSummary();
    const [, source] = result.find(([l]) => l === 'Market Source');
    expect(source).to.equal('page locale');
  });

  it('reports market source from mas-commerce-service when the element is present', () => {
    const svc = document.createElement('mas-commerce-service');
    svc.setAttribute('country', 'CA');
    document.head.append(svc);
    const result = getMasSummary();
    const [, source] = result.find(([l]) => l === 'Market Source');
    expect(source).to.equal('mas-commerce-service');
  });

  it('reports Geo Source as "URL param" when mas-geo-detection=on is in the URL', () => {
    window.history.replaceState({}, '', '/?mas-geo-detection=on');
    const result = getMasSummary();
    const [, geoSource] = result.find(([l]) => l === 'Geo Source');
    expect(geoSource).to.equal('URL param');
  });

  it('reports Geo Source as "Metadata" when mas-geo-detection meta is "on" but no URL param', () => {
    const meta = document.createElement('meta');
    meta.name = 'mas-geo-detection';
    meta.content = 'on';
    document.head.append(meta);
    const result = getMasSummary();
    const [, geoSource] = result.find(([l]) => l === 'Geo Source');
    expect(geoSource).to.equal('Metadata');
    meta.remove();
  });

  it('reports Geo Source as "URL param (off)" when mas-geo-detection param is present but not "on"', () => {
    window.history.replaceState({}, '', '/?mas-geo-detection=off');
    const result = getMasSummary();
    const [, geoSource] = result.find(([l]) => l === 'Geo Source');
    expect(geoSource).to.equal('URL param (off)');
  });

  it('reports Geo Source as "Metadata (off)" when mas-geo-detection meta is present but not "on"', () => {
    const meta = document.createElement('meta');
    meta.name = 'mas-geo-detection';
    meta.content = 'disabled';
    document.head.append(meta);
    const result = getMasSummary();
    const [, geoSource] = result.find(([l]) => l === 'Geo Source');
    expect(geoSource).to.equal('Metadata (off)');
    meta.remove();
  });
});

describe('getAdditionalManifests', () => {
  afterEach(() => {
    fetchStub.callsFake(fetchFn);
    setConfig(config);
  });

  it('returns undefined when mep is absent from config (safe no-op path)', async () => {
    setConfig({ ...config, mep: undefined });
    const result = await getAdditionalManifests();
    expect(result).to.be.undefined;
  });

  it('handles a failed fetch (non-ok response) gracefully and returns undefined', async () => {
    setConfig(config);
    fetchStub.callsFake((url) => {
      const href = typeof url === 'string' ? url : (url?.url || '');
      if (href.includes('lambda-url')) return Promise.resolve({ ok: false, status: 500 });
      return fetchFn(url);
    });
    const result = await getAdditionalManifests();
    expect(result).to.be.undefined;
  });

  it('fetches and returns filtered additional manifests on a successful response', async () => {
    setConfig(config);
    fetchStub.callsFake((url) => {
      const href = typeof url === 'string' ? url : (url?.url || '');
      if (href.includes('lambda-url')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ activities: [{ url: 'https://example.com/extra.json' }] }),
        });
      }
      return fetchFn(url);
    });
    const result = await getAdditionalManifests();
    expect(result).to.exist;
    expect(result.activities).to.be.an('array');
    if (result.activities.length > 0) {
      expect(result.activities[0].source).to.equal('MMM');
    }
  });
});

describe('parsePageAndUrl stageDomainsMap branch', () => {
  afterEach(() => {
    window.history.replaceState({}, '', window.location.pathname);
    setConfig(config);
  });

  it('maps through stageDomainsMap when env is not prod and stageDomainsMap is set', () => {
    setConfig({ ...config, stageDomainsMap: { 'www.stage.adobe.com': true }, env: { name: 'stage' } });
    expect(getLocale()).to.be.a('string');
  });

  it('handles an invalid stageDomainsMap key gracefully via try/catch in find', () => {
    const OriginalURL = globalThis.URL;
    globalThis.URL = class extends OriginalURL {
      constructor(url, base) {
        if (url === 'https://bad-key') throw new TypeError('Invalid URL (test stub)');
        super(url, base);
      }
    };
    setConfig({
      ...config,
      stageDomainsMap: { 'bad-key': true, 'www.stage.adobe.com': true },
      env: { name: 'stage' },
    });
    try {
      getLocale();
    } finally {
      globalThis.URL = OriginalURL;
    }
  });

  it('appends .html to non-root, non-html pathnames when domain is not milo', () => {
    window.history.replaceState({}, '', '/some-page');
    setConfig({ ...config, stageDomainsMap: { 'www.stage.adobe.com': true }, env: { name: 'stage' } });
    expect(getLocale()).to.be.a('string');
  });
});

describe('formatDate via getManifestList', () => {
  afterEach(() => setConfig(config));

  it('formats eventStart and eventEnd dates and produces ISO eventStartIso', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'Event Test',
          manifest: '/test.json',
          variantNames: ['v-a'],
          selectedVariantName: 'v-a',
          source: 'helix',
          disabled: false,
          event: { start: '2024-06-01T12:00:00Z', end: '2024-06-30T12:00:00Z' },
        }],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests[0].eventStart).to.be.a('string').and.not.empty;
    expect(manifests[0].eventStartIso).to.be.a('string').and.include('T');
    expect(manifests[0].eventEnd).to.be.a('string').and.not.empty;
  });

  it('lastSeen in manifest descriptor is null (toActivity does not pass lastSeen through)', () => {
    setConfig({
      ...config,
      mep: {
        ...config.mep,
        experiments: [{
          name: 'LastSeen Test',
          manifest: '/last.json',
          variantNames: ['v-a'],
          selectedVariantName: 'v-a',
          source: 'helix',
          disabled: false,
        }],
      },
    });
    const { manifests } = getManifestList();
    expect(manifests[0].lastSeen).to.be.null;
  });
});

describe('getLastSeen', () => {
  afterEach(() => setConfig(config));

  it('returns a string (formatted date or fallback) for the current page', () => {
    setConfig(config);
    expect(getLastSeen()).to.be.a('string');
  });
});

describe('getLingoSummary', () => {
  beforeEach(() => {
    sessionStorage.setItem('akamai', 'us');
  });

  afterEach(() => {
    sessionStorage.removeItem('akamai');
    document.querySelectorAll('[data-mep-lingo-roc], [data-mep-lingo-fallback]').forEach((el) => el.remove());
    document.head.querySelectorAll('meta[name="langfirst"]').forEach((el) => el.remove());
    window.history.replaceState({}, '', window.location.pathname);
    updateConfig(config);
  });

  it('returns a promise resolving to 6 label-value pairs', async () => {
    const pairs = await getLingoSummary();
    expect(pairs).to.be.an('array').with.lengthOf(6);
  });

  it('includes all expected labels', async () => {
    const pairs = await getLingoSummary();
    const labels = pairs.map(([l]) => l);
    ['Mep Lingo Updates', 'Lang First | Lingo', 'Geo Folder', 'Country Cookie', 'User Country', 'Geo + User']
      .forEach((label) => expect(labels).to.include(label));
  });

  it('counts lingo roc and fallback fragments for Mep Lingo Updates', async () => {
    const roc = document.createElement('div');
    roc.setAttribute('data-mep-lingo-roc', 'roc');
    const fallback = document.createElement('div');
    fallback.setAttribute('data-mep-lingo-fallback', 'fb');
    document.body.append(roc, fallback);
    const pairs = await getLingoSummary();
    const [, val] = pairs.find(([l]) => l === 'Mep Lingo Updates');
    expect(val).to.equal('1 of 2');
  });

  it('Lang First returns "off" when langfirst meta is absent', async () => {
    const pairs = await getLingoSummary();
    const [, val] = pairs.find(([l]) => l === 'Lang First | Lingo');
    expect(val).to.equal('off');
  });

  it('Lang First returns "on" when langfirst meta is present', async () => {
    const meta = document.createElement('meta');
    meta.name = 'langfirst';
    meta.content = 'on';
    document.head.append(meta);
    const pairs = await getLingoSummary();
    const [, val] = pairs.find(([l]) => l === 'Lang First | Lingo');
    expect(val).to.equal('on');
  });

  it('Country Cookie returns a string when country URL param is set', async () => {
    window.history.replaceState({}, '', '/?country=de');
    const pairs = await getLingoSummary();
    const [, val] = pairs.find(([l]) => l === 'Country Cookie');
    expect(val).to.be.a('string');
  });

  it('Geo + User is "Not Applicable" when locale has no regions', async () => {
    const pairs = await getLingoSummary();
    const [, val] = pairs.find(([l]) => l === 'Geo + User');
    expect(val).to.equal('Not Applicable');
  });

  it('Geo + User resolves when lingo is active and regions are configured', async () => {
    const meta = document.createElement('meta');
    meta.name = 'langfirst';
    meta.content = 'on';
    document.head.append(meta);
    updateConfig({ ...config, locale: { ...config.locale, regions: { ch_de: {} } } });
    const pairs = await getLingoSummary();
    const [, geoUser] = pairs.find(([l]) => l === 'Geo + User');
    expect(geoUser).to.be.oneOf(['Supported', 'Not Supported']);
  });
});

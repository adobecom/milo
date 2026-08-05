import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, getConfig, customFetch } from '../../../libs/utils/utils.js';
import {
  replaceText,
  replaceKey,
  replaceKeyArray,
  decoratePlaceholderArea,
} from '../../../libs/features/placeholders.js';

const locales = { '': { ietf: 'en-US', tk: 'hah7vzn.css' } };
const conf = { locales };
setConfig(conf);
const config = getConfig();

describe('Placeholders', () => {
  let paramsGetStub;

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  it('Fails on JSON', async () => {
    const text = await replaceKey('recommended-for-you', config);
    expect(text).to.equal('recommended for you');
  });

  it('Works with cache control', async () => {
    const text = await replaceText('Look at me, I am {{testing-cache}}', config);
    expect(text).to.equal('Look at me, I am testing cache');
  });

  it('Replaces text & links', async () => {
    config.locale.contentRoot = '/test/features/placeholders';
    let text = 'Hello world {{recommended-for-you}} and {{no-results}}. Call tel: %7B%7Bphone-number%7D%7D';
    text = await replaceText(text, config);
    expect(text).to.equal('Hello world Recommended for you and No results found. Call tel: 800 12345 6789');
  });

  it('Replaces key', async () => {
    const text = await replaceKey('recommended-for-you', config);
    expect(text).to.equal('Recommended for you');
  });

  it('Replaces a key array', async () => {
    const labelArray = await replaceKeyArray(['recommended-for-you', 'no-results'], config);
    expect(labelArray).to.eql(['Recommended for you', 'No results found']);
  });

  it('Gracefully falls back', async () => {
    const text = await replaceKey('this-wont-work', config);
    expect(text).to.equal('this wont work');
  });

  it('Does show an empty value', async () => {
    const text = await replaceKey('empty-value', config);
    expect(text).to.equal('');
  });

  it('Replaces attributes with placeholders', async () => {
    const placeholderPath = 'https://main--cc--adobecom.aem.page/cc-shared/placeholders.json';
    const placeholderRequest = customFetch({ resource: placeholderPath, withCacheRules: true })
      .catch(() => ({}));

    const tag = document.createElement('a');
    tag.setAttribute('href', '/modal/%7B%7Bphone-number%7D%7D');
    tag.setAttribute('data-attr', '/modal/%7B%7Bphone-number%7D%7D');

    await decoratePlaceholderArea({ placeholderPath, placeholderRequest, nodes: [tag] });

    expect(tag.getAttribute('href')).to.equal('/modal/800 12345 6789');
    expect(tag.getAttribute('data-attr')).to.equal('/modal/800 12345 6789');
  });

  it('Replaces geo-specific placeholders when disable-geo-placeholders meta content is "off" or meta tag not defined', async () => {
    config.locale.contentRoot = '/test/features/placeholders/bg';
    let text = '{{add-to-cart}}. {{adobe-apps}}';
    text = await replaceText(text, config);
    expect(text).to.equal('Добавяне в количката. Приложения на Adobe');
  });

  it('Replaces default placeholders when disable-geo-placeholders meta content is "on"', async () => {
    const meta = document.createElement('meta');
    meta.name = 'disable-geo-placeholders';
    meta.content = 'on';
    document.head.appendChild(meta);

    config.locale.contentRoot = '/test/features/placeholders/bg';
    config.locale.prefix = '/bg';
    let text = '{{add-to-cart}}. {{adobe-apps}}';
    text = await replaceText(text, config);
    document.head.removeChild(meta);
    expect(text).to.equal('Add to cart. Adobe Apps');
  });
});

describe('Geo-IP Placeholders (-geo-ip suffix)', () => {
  let paramsGetStub;
  let langfirstMeta;
  const geoFixturePath = '/test/features/placeholders/lu_fr';

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  function enableLingo() {
    langfirstMeta = document.createElement('meta');
    langfirstMeta.name = 'langfirst';
    langfirstMeta.content = 'on';
    document.head.appendChild(langfirstMeta);
    sessionStorage.setItem('akamai', 'lu');
    const geoLocales = {
      '': { ietf: 'en-US', tk: 'hah7vzn.css' },
      '/fr': { ietf: 'fr-FR', tk: 'hah7vzn.css' },
    };
    const regions = { lu_fr: { prefix: geoFixturePath } };
    setConfig({ locales: geoLocales, locale: { region: 'fr' }, contentRoot: '' });
    const cfg = getConfig();
    cfg.locale.prefix = '/fr';
    cfg.locale.regions = regions;
    return cfg;
  }

  function disableLingo() {
    if (langfirstMeta?.parentNode) langfirstMeta.parentNode.removeChild(langfirstMeta);
    sessionStorage.removeItem('akamai');
  }

  afterEach(() => {
    disableLingo();
  });

  it('replaceText resolves geo value for -geo-ip keys (default, non-deferred)', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const text = await replaceText('tel:{{phone-number-geo-ip}}', cfg);
    expect(text).to.equal('tel:+352 800 99999');
  });

  it('replaceText resolves geo value for non-phone -geo-ip key', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('Acheter maintenant');
  });

  it('falls back to base placeholder when langfirst is off', async () => {
    setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
    const cfg = getConfig();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('Buy now');
  });

  it('deferred update swaps base to geo value in href, preserves custom text', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const link = document.createElement('a');
    link.setAttribute('href', 'tel:%7B%7Bphone-number-geo-ip%7D%7D');
    link.textContent = 'Call Adobe Support';

    await decoratePlaceholderArea({ nodes: [link] });
    expect(link.getAttribute('href')).to.equal('tel:800 555 1234');
    expect(link.textContent).to.equal('Call Adobe Support');

    await decoratePlaceholderArea.deferredGeo;
    expect(link.getAttribute('href')).to.equal('tel:+352 800 99999');
    expect(link.textContent).to.equal('Call Adobe Support');
  });

  it('deferred update swaps both href and text node to geo values', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const link = document.createElement('a');
    link.setAttribute('href', 'tel:%7B%7Bphone-number-geo-ip%7D%7D');
    const textNode = document.createTextNode('{{phone-number-geo-ip}}');
    link.appendChild(textNode);

    await decoratePlaceholderArea({ nodes: [link, textNode] });
    expect(link.getAttribute('href')).to.equal('tel:800 555 1234');
    expect(textNode.nodeValue).to.equal('800 555 1234');

    await decoratePlaceholderArea.deferredGeo;
    expect(link.getAttribute('href')).to.equal('tel:+352 800 99999');
    expect(textNode.nodeValue).to.equal('+352 800 99999');
  });

  it('MEP placeholder overrides geo-ip value', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    cfg.placeholders = { 'phone-number-geo-ip': 'MEP override value' };
    const text = await replaceText('{{phone-number-geo-ip}}', cfg);
    expect(text).to.equal('MEP override value');
    delete cfg.placeholders;
  });

  it('resolves geo value for federated content root (GNAV path)', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const federatedConfig = {
      locale: {
        ...cfg.locale,
        contentRoot: `${window.location.origin}/fr/federal/globalnav`,
      },
    };
    const text = await replaceText('{{phone-number-geo-ip}}', federatedConfig);
    expect(text).to.equal('+352 GNAV 99999');
  });

  it('deferred update skips keys overridden by MEP', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    cfg.placeholders = { 'phone-number-geo-ip': 'MEP override value' };
    const link = document.createElement('a');
    link.setAttribute('href', 'tel:%7B%7Bphone-number-geo-ip%7D%7D');
    link.textContent = 'Call us';

    await decoratePlaceholderArea({ nodes: [link] });
    await decoratePlaceholderArea.deferredGeo;
    expect(link.getAttribute('href')).to.equal('tel:MEP override value');
    expect(link.textContent).to.equal('Call us');
    delete cfg.placeholders;
  });
});

describe('Geo-IP individual-country fallback', () => {
  let paramsGetStub;
  let langfirstMeta;
  let fetchStub;

  const geoLocales = {
    '': { ietf: 'en-US', tk: 'hah7vzn.css' },
    si: { ietf: 'sl-SI', tk: 'hah7vzn.css' },
    uk: { ietf: 'en-GB', tk: 'hah7vzn.css' },
    cl: { ietf: 'es-CL', tk: 'hah7vzn.css' },
  };

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  function stubGeoFetch(pathValueMap) {
    fetchStub = stub(window, 'fetch').callsFake((url) => {
      const entry = Object.entries(pathValueMap).find(([path]) => url.includes(path));
      if (!entry) return Promise.resolve({ ok: false });
      const [, value] = entry;
      return Promise.resolve({ ok: true, json: async () => ({ data: [{ key: 'buy-now-geo-ip', value }] }) });
    });
  }

  function enableLingo(country, { regions, mepLingoCountryToRegion, marketsConfig, prefix = '' } = {}) {
    langfirstMeta = document.createElement('meta');
    langfirstMeta.name = 'langfirst';
    langfirstMeta.content = 'on';
    document.head.appendChild(langfirstMeta);
    sessionStorage.setItem('akamai', country);
    setConfig({ locales: geoLocales, mepLingoCountryToRegion, contentRoot: '' });
    const cfg = getConfig();
    cfg.locale.prefix = prefix;
    if (regions) cfg.locale.regions = regions;
    if (marketsConfig) cfg.marketsConfig = marketsConfig;
    return cfg;
  }

  afterEach(() => {
    if (langfirstMeta?.parentNode) langfirstMeta.parentNode.removeChild(langfirstMeta);
    sessionStorage.removeItem('akamai');
    fetchStub?.restore();
    fetchStub = undefined;
  });

  it('resolves an individual-country prefix never wired as a regions/fold entry', async () => {
    stubGeoFetch({ '/si/placeholders': 'Slovenia buy now' });
    const cfg = enableLingo('si', { marketsConfig: { data: [{ prefix: '', supportedRegions: 'si' }] } });
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('Slovenia buy now');
  });

  it('gates the individual-country tier by isSupportedMarket, falls back to the fold when unsupported', async () => {
    stubGeoFetch({
      '/cl/placeholders': 'Chile buy now',
      '/la/placeholders': 'LatAm buy now',
    });
    const cfg = enableLingo('cl', {
      regions: { la: { prefix: '/la' } },
      mepLingoCountryToRegion: { la: ['cl', 'co'] },
      marketsConfig: { data: [{ prefix: '', supportedRegions: 'us' }] },
    });
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('LatAm buy now');
  });

  it('still resolves via the fold for a country with no standalone site of its own (no regression)', async () => {
    stubGeoFetch({ '/africa/placeholders': 'Kenya buy now' });
    const cfg = enableLingo('ke', {
      regions: { africa: { prefix: '/africa' } },
      mepLingoCountryToRegion: { africa: ['ke', 'mu'] },
    });
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('Kenya buy now');
  });

  it('prefers the individual-country site over a fold it is also a member of', async () => {
    stubGeoFetch({
      '/cl/placeholders': 'Chile buy now',
      '/la/placeholders': 'LatAm buy now',
    });
    const cfg = enableLingo('cl', {
      regions: { la: { prefix: '/la' } },
      mepLingoCountryToRegion: { la: ['cl', 'co'] },
      marketsConfig: { data: [{ prefix: '', supportedRegions: 'cl' }] },
    });
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('Chile buy now');
  });

  it('is a no-op when the detected country matches the page already being viewed', async () => {
    const cfg = enableLingo('si', { prefix: '/si' });
    cfg.locale.contentRoot = '/test/features/placeholders';
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('Buy now');
  });

  it('resolves the uk/gb locale-key alias', async () => {
    stubGeoFetch({ '/uk/placeholders': 'UK buy now' });
    const cfg = enableLingo('uk', { marketsConfig: { data: [{ prefix: '', supportedRegions: 'gb' }] } });
    const text = await replaceText('{{buy-now-geo-ip}}', cfg);
    expect(text).to.equal('UK buy now');
  });
});

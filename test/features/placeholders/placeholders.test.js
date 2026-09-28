import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, getConfig, customFetch, geoIpSiteKey } from '../../../libs/utils/utils.js';
import {
  replaceText,
  replaceKey,
  replaceKeyArray,
  decoratePlaceholderArea,
  getGeoIpPlaceholders,
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

describe('Geo-IP Placeholders (column-per-market sheet)', () => {
  let paramsGetStub;
  let langfirstMeta;
  const contentRoot = '/test/features/placeholders';
  const gnavSheet = '/test/features/placeholders/placeholders-geo-ip-gnav.json';

  before(() => {
    paramsGetStub = stub(URLSearchParams.prototype, 'get');
    paramsGetStub.withArgs('cache').returns('off');
  });

  after(() => {
    paramsGetStub.restore();
  });

  // Geo-IP is gated on lingoActive() (langfirst meta); the country comes from sessionStorage
  // 'akamai'. UK is the non-ISO alias for gb; the test server ignores the ?sheet= query.
  function enableGeo(country) {
    langfirstMeta = document.createElement('meta');
    langfirstMeta.name = 'langfirst';
    langfirstMeta.content = 'on';
    document.head.appendChild(langfirstMeta);
    if (country) sessionStorage.setItem('akamai', country);
    setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
    const cfg = getConfig();
    cfg.locale.contentRoot = contentRoot;
    return cfg;
  }

  function disableGeo() {
    setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
    const cfg = getConfig();
    cfg.locale.contentRoot = contentRoot;
    return cfg;
  }

  afterEach(() => {
    if (langfirstMeta?.parentNode) langfirstMeta.parentNode.removeChild(langfirstMeta);
    langfirstMeta = undefined;
    sessionStorage.removeItem('akamai');
  });

  it('resolves the visitor country column for a -geo-ip key', async () => {
    const cfg = enableGeo('us');
    expect(await replaceText('{{hello-geo-ip}}', cfg)).to.equal('hello US');
  });

  it('resolves a different country column', async () => {
    const cfg = enableGeo('ar');
    expect(await replaceText('tel:{{phone-number-geo-ip}}', cfg)).to.equal('tel:+54 800 222 2222');
  });

  it('maps a gb visitor to the non-ISO UK column', async () => {
    const cfg = enableGeo('gb');
    expect(await replaceText('{{hello-geo-ip}}', cfg)).to.equal('hello UK');
  });

  it('maps a uk visitor (normalised to gb) to the UK column', async () => {
    const cfg = enableGeo('uk');
    expect(await replaceText('{{hello-geo-ip}}', cfg)).to.equal('hello UK');
  });

  it('falls back to the first value column when the visitor country has no column', async () => {
    // Positional default: an unlisted market resolves to the first value column (US), not the base.
    const cfg = enableGeo('jp');
    expect(await replaceText('{{hello-geo-ip}}', cfg)).to.equal('hello US');
  });

  it('keeps the authored base value for a -geo-ip key absent from the sheet', async () => {
    const cfg = enableGeo('us');
    expect(await replaceText('{{unlisted-thing-geo-ip}}', cfg)).to.equal('unlisted thing geo ip');
  });

  it('renders --none-- as empty, not the humanized key', async () => {
    const cfg = enableGeo('us');
    expect(await replaceText('{{cleared-geo-ip}}', cfg)).to.equal('');
  });

  it('falls back to the base placeholder when langfirst is off', async () => {
    const cfg = disableGeo();
    expect(await replaceText('{{hello-geo-ip}}', cfg)).to.equal('hello geo ip');
  });

  it('lets a MEP placeholder override the geo-ip value', async () => {
    const cfg = enableGeo('us');
    cfg.placeholders = { 'hello-geo-ip': 'MEP override value' };
    expect(await replaceText('{{hello-geo-ip}}', cfg)).to.equal('MEP override value');
    delete cfg.placeholders;
  });

  it('getGeoIpPlaceholders returns a Map of -geo-ip overrides (for the C2 gnav merge)', async () => {
    const cfg = enableGeo('us');
    const overrides = await getGeoIpPlaceholders(cfg);
    expect(overrides).to.be.instanceOf(Map);
    expect(overrides.get('hello-geo-ip')).to.equal('hello US');
    expect(overrides.get('phone-number-geo-ip')).to.equal('+1 800 111 1111');
    // only -geo-ip keys are included — base keys must not leak into the merge
    [...overrides.keys()].forEach((key) => expect(key.endsWith('-geo-ip')).to.be.true);
  });

  it('getGeoIpPlaceholders returns null when langfirst is off', async () => {
    const cfg = disableGeo();
    expect(await getGeoIpPlaceholders(cfg)).to.equal(null);
  });

  it('resolves from an explicit source sheet, ignoring contentRoot (C2 gnav federal path)', async () => {
    const cfg = enableGeo('us');
    cfg.locale.contentRoot = '/nonexistent';
    const overrides = await getGeoIpPlaceholders(cfg, gnavSheet);
    expect(overrides.get('hello-geo-ip')).to.equal('hello US GNAV');
  });

  describe('named `default` column and --none-- clearing', () => {
    const defaultSheet = '/test/features/placeholders/placeholders-geo-ip-default.json';

    it('uses the market column over the default column', async () => {
      const cfg = enableGeo('us');
      const overrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(overrides.get('hello-geo-ip')).to.equal('hello US');
    });

    it('falls back to the named default column when the market has no cell', async () => {
      // phone-number has no US column → inherits the default column
      const cfg = enableGeo('us');
      const overrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(overrides.get('phone-number-geo-ip')).to.equal('+1 000 000 0000');
    });

    it('uses the default column for a market with no column of its own', async () => {
      const cfg = enableGeo('jp');
      const overrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(overrides.get('hello-geo-ip')).to.equal('hello DEFAULT');
    });

    it('clears a market with --none-- so the token renders empty (not the default)', async () => {
      // hello-geo-ip AR cell is --none-- → explicit empty, not inherited from the default column
      const cfg = enableGeo('ar');
      const overrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(overrides.get('hello-geo-ip')).to.equal('');
    });

    it('a --none-- default means only explicit market cells resolve; others render empty', async () => {
      // explicit-only-geo-ip default is --none--: AR gets its cell, other markets clear to empty
      const cfg = enableGeo('ar');
      const arOverrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(arOverrides.get('explicit-only-geo-ip')).to.equal('only AR');
      sessionStorage.setItem('akamai', 'us');
      const usOverrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(usOverrides.get('explicit-only-geo-ip')).to.equal('');
    });

    it('omits a key whose default column is empty', async () => {
      const cfg = enableGeo('jp');
      const overrides = await getGeoIpPlaceholders(cfg, defaultSheet);
      expect(overrides.has('unlisted-thing-geo-ip')).to.be.false;
    });
  });
});

describe('geoIpSiteKey', () => {
  it('returns base when set', () => {
    expect(geoIpSiteKey({ base: 'fr_FR' })).to.equal('fr_FR');
  });

  it('strips the leading slash from prefix', () => {
    expect(geoIpSiteKey({ prefix: '/fr' })).to.equal('fr');
  });

  it('prefers base over prefix', () => {
    expect(geoIpSiteKey({ base: 'fr_CH', prefix: '/fr' })).to.equal('fr_CH');
  });

  it('defaults to en when locale is empty', () => {
    expect(geoIpSiteKey({})).to.equal('en');
  });

  it('defaults to en when called with no argument', () => {
    expect(geoIpSiteKey()).to.equal('en');
  });
});

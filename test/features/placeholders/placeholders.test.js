import { expect } from '@esm-bundle/chai';
import { stub } from 'sinon';
import { setConfig, getConfig, customFetch } from '../../../libs/utils/utils.js';
import {
  replaceText,
  replaceKey,
  replaceKeyArray,
  decoratePlaceholderArea,
  resetGeoPlaceholderCache,
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

describe('Geo Placeholders (-geo suffix)', () => {
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
    resetGeoPlaceholderCache();
  }

  afterEach(() => {
    disableLingo();
  });

  it('resolves -geo key from geo-specific placeholder file on langfirst pages', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const text = await replaceText('tel:%7B%7Bphone-number-geo%7D%7D', cfg);
    expect(text).to.equal('tel:+352 800 24642');
  });

  it('does not geo-resolve -geo keys outside tel: context', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const text = await replaceText('{{phone-number-geo}}', cfg);
    expect(text).to.equal('800 12345 6789');
  });

  it('falls back to base key value when langfirst is off', async () => {
    setConfig({ locales: { '': { ietf: 'en-US', tk: 'hah7vzn.css' } } });
    const cfg = getConfig();
    cfg.locale.contentRoot = '/test/features/placeholders';
    resetGeoPlaceholderCache();
    const text = await replaceText('tel:{{phone-number-geo}}', cfg);
    expect(text).to.equal('tel:800 12345 6789');
  });

  it('updates link display text when tel: href contains a -geo placeholder', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const link = document.createElement('a');
    link.setAttribute('href', 'tel:%7B%7Bphone-number-geo%7D%7D');
    link.textContent = '800 12345 6789';

    await decoratePlaceholderArea({ nodes: [link] });

    expect(link.getAttribute('href')).to.equal('tel:+352 800 24642');
    expect(link.textContent).to.equal('+352 800 24642');
  });

  it('does not update display text when href has no -geo key', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const link = document.createElement('a');
    link.setAttribute('href', 'tel:%7B%7Bphone-number%7D%7D');
    link.textContent = 'Call us';

    await decoratePlaceholderArea({ nodes: [link] });

    expect(link.getAttribute('href')).to.equal('tel:800 12345 6789');
    expect(link.textContent).to.equal('Call us');
  });

  it('geo-resolves -geo in tel: href within an HTML string (GNAV path)', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const html = '<a href="tel:%7B%7Bphone-number-geo%7D%7D">Call us</a>';
    const result = await replaceText(html, cfg);
    expect(result).to.equal('<a href="tel:+352 800 24642">Call us</a>');
  });

  it('does not geo-resolve -geo in non-tel link href', async () => {
    const cfg = enableLingo();
    cfg.locale.contentRoot = '/test/features/placeholders';
    const link = document.createElement('a');
    link.setAttribute('href', '/page/%7B%7Bphone-number-geo%7D%7D');
    link.textContent = 'Some link';

    await decoratePlaceholderArea({ nodes: [link] });

    expect(link.getAttribute('href')).to.equal('/page/800 12345 6789');
    expect(link.textContent).to.equal('Some link');
  });
});

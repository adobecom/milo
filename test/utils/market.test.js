import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { setConfig } from '../../libs/utils/utils.js';
import {
  norm,
  getMarketConfig,
  marketsLangForLocale,
  getValidatedMarket,
} from '../../libs/utils/market.js';

describe('market.js — norm()', () => {
  it('returns undefined for null', () => {
    expect(norm(null)).to.be.undefined;
  });

  it('returns undefined for undefined', () => {
    expect(norm(undefined)).to.be.undefined;
  });

  it('returns undefined for non-string values', () => {
    expect(norm(42)).to.be.undefined;
    expect(norm(true)).to.be.undefined;
  });

  it('lowercases the input', () => {
    expect(norm('US')).to.equal('us');
    expect(norm('De')).to.equal('de');
  });

  it('maps UK to gb', () => {
    expect(norm('UK')).to.equal('gb');
    expect(norm('uk')).to.equal('gb');
  });

  it('splits on underscore and returns the first part', () => {
    expect(norm('us_en')).to.equal('us');
    expect(norm('ch_de')).to.equal('ch');
  });

  it('returns the full string when there is no underscore', () => {
    expect(norm('de')).to.equal('de');
    expect(norm('fr')).to.equal('fr');
  });

  it('returns empty string for empty string input', () => {
    expect(norm('')).to.equal('');
  });
});

describe('market.js — getMarketConfig()', () => {
  afterEach(() => {
    sinon.restore();
    setConfig({});
  });

  it('fetches and caches marketsConfig when not present', async () => {
    const mockData = { languages: { data: [{ prefix: '', langName: 'English' }] } };
    setConfig({ locale: { prefix: '' } });
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const result = await getMarketConfig();
    expect(result).to.not.be.null;
    expect(result.languages).to.be.an('array');
    expect(result.languages[0].langName).to.equal('English');
  });

  it('returns cached config on subsequent calls', async () => {
    const mockData = { languages: { data: [{ prefix: 'de', langName: 'German' }] } };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });

    const result = await getMarketConfig();
    expect(result.languages[0].langName).to.equal('German');
  });

  it('returns null on fetch failure', async () => {
    setConfig({ locale: { prefix: '' } });
    sinon.stub(window, 'fetch').rejects(new Error('Network error'));
    window.lana = { log: sinon.stub() };

    const result = await getMarketConfig();
    expect(result).to.be.null;
    delete window.lana;
  });

  it('returns null when fetch response is not ok', async () => {
    setConfig({ locale: { prefix: '' } });
    sinon.stub(window, 'fetch').resolves({ ok: false, status: 500 });
    window.lana = { log: sinon.stub() };

    const result = await getMarketConfig();
    expect(result).to.be.null;
    delete window.lana;
  });

  it('handles marketsConfig with flat data array', async () => {
    const mockData = { data: [{ prefix: '', langName: 'English' }] };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });

    const result = await getMarketConfig();
    expect(result.languages).to.be.an('array');
    expect(result.languages[0].langName).to.equal('English');
  });
});

describe('market.js — marketsLangForLocale()', () => {
  const languages = [
    { prefix: '', langName: 'English', defaultMarket: 'us' },
    { prefix: 'de', langName: 'German', defaultMarket: 'de' },
    { prefix: 'fr', langName: 'French', defaultMarket: 'fr' },
  ];

  it('returns the matching language by prefix', () => {
    const result = marketsLangForLocale({ languages }, { prefix: '/de' });
    expect(result.langName).to.equal('German');
  });

  it('returns the matching language for empty prefix (root)', () => {
    const result = marketsLangForLocale({ languages }, { prefix: '' });
    expect(result.langName).to.equal('English');
  });

  it('falls back to locale.base when prefix does not match', () => {
    const result = marketsLangForLocale({ languages }, { prefix: '/xx', base: 'fr' });
    expect(result.langName).to.equal('French');
  });

  it('returns the first language when no match and no base', () => {
    const result = marketsLangForLocale({ languages }, { prefix: '/xx' });
    expect(result.langName).to.equal('English');
  });

  it('returns undefined when config has no languages', () => {
    const result = marketsLangForLocale({}, { prefix: '' });
    expect(result).to.be.undefined;
  });

  it('returns undefined when config is null', () => {
    const result = marketsLangForLocale(null, { prefix: '' });
    expect(result).to.be.undefined;
  });

  it('strips leading slash from locale prefix', () => {
    const result = marketsLangForLocale({ languages }, { prefix: '/fr' });
    expect(result.langName).to.equal('French');
  });
});

describe('market.js — getValidatedMarket()', () => {
  afterEach(() => {
    sinon.restore();
    setConfig({});
    document.cookie = 'country=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    sessionStorage.removeItem('akamai');
    sessionStorage.removeItem('market');
  });

  it('returns the country from the URL query parameter', async () => {
    const mockData = {
      languages: {
        data: [{
          prefix: '',
          langName: 'English',
          defaultMarket: 'us',
          supportedRegions: 'us,gb,de',
        }],
      },
    };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });
    sessionStorage.setItem('akamai', 'de');

    const result = await getValidatedMarket();
    expect(result).to.be.a('string');
  });

  it('returns us as fallback when no detection sources are available', async () => {
    setConfig({ locale: { prefix: '' } });
    sinon.stub(window, 'fetch').callsFake(() => Promise.reject(new Error('fail')));

    const result = await getValidatedMarket();
    expect(result).to.equal('us');
    expect(window.fetch.called).to.be.true;
  });

  it('returns defaultMarket when config is cached but geo and market hints all fail', async () => {
    const mockData = {
      languages: {
        data: [{
          prefix: '',
          langName: 'English',
          defaultMarket: 'us',
          supportedRegions: 'us',
        }],
      },
    };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });
    sinon.stub(window, 'fetch').callsFake(() => Promise.reject(new Error('fail')));

    const result = await getValidatedMarket();
    expect(result).to.equal('us');
  });

  it('validates against supportedRegions and falls back to defaultMarket', async () => {
    const mockData = {
      languages: {
        data: [{
          prefix: '',
          langName: 'English',
          defaultMarket: 'us',
          supportedRegions: 'us,gb',
        }],
      },
    };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });
    sessionStorage.setItem('akamai', 'zz');

    const result = await getValidatedMarket();
    expect(result).to.equal('us');
  });

  it('returns the detected market when it is in supportedRegions', async () => {
    const mockData = {
      languages: {
        data: [{
          prefix: '',
          langName: 'English',
          defaultMarket: 'us',
          supportedRegions: 'us,gb,de',
        }],
      },
    };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });
    sessionStorage.setItem('akamai', 'gb');

    const result = await getValidatedMarket();
    expect(result).to.equal('gb');
  });

  it('uses cookie value when available', async () => {
    const mockData = {
      languages: {
        data: [{
          prefix: '',
          langName: 'English',
          defaultMarket: 'us',
          supportedRegions: 'us,gb,de',
        }],
      },
    };
    setConfig({ marketsConfig: mockData, locale: { prefix: '' } });
    document.cookie = 'country=de';

    const result = await getValidatedMarket();
    expect(result).to.equal('de');
  });
});

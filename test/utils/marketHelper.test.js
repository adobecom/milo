import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { appendCountryParam, getMarketLabel } from '../../libs/utils/marketHelper.js';

describe('marketHelper.js — appendCountryParam()', () => {
  it('appends country param to a valid URL', () => {
    const result = appendCountryParam('https://example.com/page', 'de');
    expect(result).to.include('country=de');
  });

  it('returns the original URL when countryCode is empty', () => {
    const result = appendCountryParam('https://example.com/page', '');
    expect(result).to.equal('https://example.com/page');
  });

  it('returns the original URL when countryCode is null', () => {
    const result = appendCountryParam('https://example.com/page', null);
    expect(result).to.equal('https://example.com/page');
  });

  it('returns the url string when urlString is empty', () => {
    const result = appendCountryParam('', 'de');
    expect(result).to.equal('');
  });

  it('returns the original string for an invalid URL', () => {
    const result = appendCountryParam('not-a-url', 'de');
    expect(result).to.equal('not-a-url');
  });

  it('overwrites an existing country param', () => {
    const result = appendCountryParam('https://example.com/page?country=us', 'gb');
    expect(result).to.include('country=gb');
    expect(result).to.not.include('country=us');
  });

  it('preserves existing query params', () => {
    const result = appendCountryParam('https://example.com/page?foo=bar', 'de');
    expect(result).to.include('foo=bar');
    expect(result).to.include('country=de');
  });

  it('preserves hash fragment', () => {
    const result = appendCountryParam('https://example.com/page#section', 'de');
    expect(result).to.include('#section');
    expect(result).to.include('country=de');
  });
});

describe('marketHelper.js — getMarketLabel()', () => {
  it('returns empty string when market is null', () => {
    expect(getMarketLabel(null, 'en', '')).to.equal('');
  });

  it('returns empty string when market is undefined', () => {
    expect(getMarketLabel(undefined, 'en', '')).to.equal('');
  });

  it('returns the language-specific label when available', () => {
    const market = { en: 'United States', de: 'Vereinigte Staaten', marketName: 'US' };
    expect(getMarketLabel(market, 'de', '')).to.equal('Vereinigte Staaten');
  });

  it('falls back to en label when langKey label is missing', () => {
    const market = { en: 'United States', marketName: 'US' };
    expect(getMarketLabel(market, 'fr', '')).to.equal('United States');
  });

  it('falls back to marketName when no language labels exist', () => {
    const market = { marketName: 'US' };
    expect(getMarketLabel(market, 'fr', '')).to.equal('US');
  });

  it('returns empty string when market has no labels at all', () => {
    const market = {};
    expect(getMarketLabel(market, 'fr', '')).to.equal('');
  });

  it('handles langKey with prefix combination', () => {
    const market = { 'de-at': 'Österreich', en: 'Austria' };
    expect(getMarketLabel(market, 'de', 'at')).to.equal('Österreich');
  });

  it('trims whitespace from labels', () => {
    const market = { en: '  United States  ', marketName: 'US' };
    expect(getMarketLabel(market, 'en', '')).to.equal('United States');
  });

  it('handles empty langKey gracefully', () => {
    const market = { en: 'United States', marketName: 'US' };
    expect(getMarketLabel(market, '', '')).to.equal('United States');
  });

  it('handles numeric or non-string langKey', () => {
    const market = { en: 'United States', marketName: 'US' };
    expect(getMarketLabel(market, null, '')).to.equal('United States');
  });

  it('normalizes prefix by stripping leading slash', () => {
    const market = { 'de-at': 'Österreich', en: 'Austria' };
    expect(getMarketLabel(market, 'de', '/at')).to.equal('Österreich');
  });
});

describe('marketHelper.js — loadMarketsData()', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('fetches markets data from the federated content root', async () => {
    const mockData = {
      data: [
        { marketCode: 'us', en: 'United States' },
        { marketCode: 'de', en: 'Germany' },
      ],
    };
    sinon.stub(window, 'fetch').resolves({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { default: loadMarketsData } = await import('../../libs/utils/marketHelper.js');
    const result = await loadMarketsData();
    expect(result).to.be.an('array');
  });
});

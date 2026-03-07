import { getConfig, getMetadata, getCookie, getCountry, getFederatedContentRoot } from './utils.js';

let marketConfig;
const norm = (c) => (c?.toLowerCase() === 'uk' ? 'gb' : c?.toLowerCase()?.split('_')[0]);

export async function getMarketConfig() {
  if (marketConfig) return marketConfig;
  const { contentRoot, marketSelector } = getConfig();
  const sourceFromUrl = new URLSearchParams(window.location.search).get('marketSelector');
  const marketSelectorKey = sourceFromUrl || getMetadata('marketselector') || marketSelector;
  const marketsUrl = marketSelectorKey
    ? `${contentRoot ?? ''}/assets/market-selector/market-selector-${marketSelectorKey}.json`
    : `${getFederatedContentRoot()}/federal/market-selector/market-selector.json`;
  try {
    const resp = await fetch(marketsUrl);
    if (!resp.ok) throw new Error('Failed to load market config');
    const json = await resp.json();
    marketConfig = {
      languages: json.languages?.data || [],
      markets: json.markets?.data || [],
    };
    return marketConfig;
  } catch (e) {
    window.lana?.log(`Market Utils Error: ${e.message}`);
    return null;
  }
}

export async function getValidatedMarket() {
  const config = await getMarketConfig();
  const params = new URLSearchParams(window.location.search);
  const countryParam = norm(params.get('country'));
  const akamaiParam = norm(params.get('akamaiLocale'));
  const cookieMarket = getCookie('country');
  let detectedMarket = countryParam || akamaiParam || cookieMarket || norm(getCountry());
  if (!detectedMarket) {
    const { default: getAkamaiCode } = await import('./geo.js');
    detectedMarket = norm(await getAkamaiCode());
  }
  if (!config) return detectedMarket || 'us';
  const { locale } = getConfig();
  const prefix = locale.prefix?.replace('/', '') || '';
  const currLang = config.languages.find((l) => (l.prefix || '') === prefix) || config.languages[0];
  const market = detectedMarket || currLang.defaultMarket || 'us';
  const supported = currLang.markets?.split(',').map((m) => m.trim()) || [];
  const validated = supported.includes(market) ? market : currLang.defaultMarket;
  return config.markets.some((marketItem) => marketItem.marketCode === validated)
    ? validated
    : (currLang.defaultMarket || 'us');
}

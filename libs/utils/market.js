import { getConfig, getCookie, getCountry, getMarketsUrl } from './utils.js';

const norm = (c) => (c?.toLowerCase() === 'uk' ? 'gb' : c?.toLowerCase()?.split('_')[0]);

export async function getMarketConfig() {
  try {
    const config = getConfig();
    if (!config.marketsConfig) {
      const resp = await fetch(getMarketsUrl());
      if (!resp.ok) throw new Error('Failed to load market config');
      config.marketsConfig = await resp.json();
    }
    const languages = config.marketsConfig.languages?.data ?? config.marketsConfig.data ?? [];
    return { languages };
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
  const supported = currLang.supportedRegions?.split(',').map((m) => m.trim().toLowerCase()) || [];
  const validated = supported.includes(market.toLowerCase()) ? market : currLang.defaultMarket;
  return validated || 'us';
}

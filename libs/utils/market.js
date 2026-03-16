import { getConfig, getCookie, getCountry, getMarketsUrl } from './utils.js';

export const norm = (c) => {
  if (c == null || typeof c !== 'string') return undefined;
  const lower = c.toLowerCase();
  return lower === 'uk' ? 'gb' : lower.split('_')[0];
};

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
  const countryFromGeo = await getCountry();
  let detectedMarket = countryParam || akamaiParam || cookieMarket || norm(countryFromGeo);
  if (!detectedMarket) {
    try {
      const { default: getAkamaiCode } = await import('./geo.js');
      detectedMarket = norm(await getAkamaiCode());
    } catch {
      // e.g. fetch disallowed in unit tests or geo service unavailable
    }
  }
  if (!config?.languages?.length) return detectedMarket || 'us';
  const { locale } = getConfig();
  const prefix = locale?.prefix?.replace('/', '') || '';
  const currLang = config.languages.find((l) => (l.prefix || '').replace('/', '') === prefix) || config.languages[0];
  if (!currLang) return detectedMarket || 'us';
  const market = detectedMarket || currLang.defaultMarket || 'us';
  const supported = (currLang.supportedRegions?.split(',').map((m) => m.trim().toLowerCase()) || [])
    .filter(Boolean);
  const validated = supported.length && supported.includes(market.toLowerCase()) ? market : (currLang.defaultMarket || 'us');
  return validated || 'us';
}

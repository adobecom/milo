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

// use base for regional paths
export function marketsLangForLocale(languages, locale) {
  if (!Array.isArray(languages) || !locale) return null;
  const pagePrefix = locale.prefix?.replace(/^\//, '') || '';
  const byPrefix = languages.find((lang) => (lang.prefix || '') === pagePrefix);
  if (byPrefix) return byPrefix;
  if (locale.base !== undefined) {
    const byBase = languages.find((lang) => (lang.prefix || '') === locale.base);
    if (byBase) return byBase;
  }
  return null;
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
    const { default: getAkamaiCode } = await import('./geo.js');
    detectedMarket = norm(await getAkamaiCode());
  }
  if (!config) return detectedMarket || 'us';
  const { locale } = getConfig();
  const pagePrefix = locale.prefix?.replace(/^\//, '') || '';
  const currLang = marketsLangForLocale(config.languages, locale)
    || config.languages[0];
  const pathImpliedMarket = (pagePrefix && (currLang.prefix || '') !== pagePrefix && locale.region)
    ? norm(String(locale.region))
    : undefined;
  if (!countryParam && !akamaiParam && pathImpliedMarket) {
    detectedMarket = pathImpliedMarket;
  }
  const market = detectedMarket || currLang.defaultMarket || 'us';
  const supported = currLang.supportedRegions?.split(',').map((m) => m.trim().toLowerCase()) || [];
  const validated = supported.includes(market.toLowerCase()) ? market : currLang.defaultMarket;
  return validated || 'us';
}

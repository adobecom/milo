import { getConfig, getMarketsUrl, isBot, normCountryCode, resolveDetectedMarketCountry } from './utils.js';

export const norm = normCountryCode;

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

export function marketsLangForLocale(marketsConfig, locale) {
  if (!marketsConfig?.languages?.length) return undefined;
  const { languages } = marketsConfig;
  const pagePrefix = locale?.prefix?.replace(/^\//, '') || '';
  let languageEntry = languages.find((lang) => (lang.prefix || '') === pagePrefix);
  if (!languageEntry && locale?.base) {
    languageEntry = languages.find((lang) => (lang.prefix || '') === locale.base);
  }
  return languageEntry || languages[0];
}

export async function getValidatedMarket() {
  if (isBot()) return null;
  const config = await getMarketConfig();
  const detectedMarket = await resolveDetectedMarketCountry();
  if (!config) return detectedMarket || 'us';
  const { locale } = getConfig();
  const currLang = marketsLangForLocale(config, locale);
  if (!currLang) return detectedMarket || 'us';
  const market = detectedMarket || currLang.defaultMarket || 'us';
  const supported = currLang.supportedRegions?.split(',').map((m) => m.trim().toLowerCase()) || [];
  const validated = supported.includes(market.toLowerCase()) ? market : currLang.defaultMarket;
  return validated || 'us';
}

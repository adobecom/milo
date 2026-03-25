import { getFederatedContentRoot } from './utils.js';

let marketsPromise;

export function appendCountryParam(urlString, countryCode) {
  if (!countryCode || !urlString) return urlString;
  try {
    const u = new URL(urlString);
    u.searchParams.set('country', countryCode);
    return u.toString();
  } catch {
    return urlString;
  }
}

export function getMarketLabel(market, langKey) {
  if (!market) return '';
  const prefLangLabel = market[langKey];
  if (typeof prefLangLabel === 'string' && prefLangLabel.trim()) return prefLangLabel.trim();
  const enLabel = market.en;
  if (typeof enLabel === 'string' && enLabel.trim()) return enLabel.trim();
  return market.marketName || '';
}

export default async function loadMarketsData() {
  if (!marketsPromise) {
    const url = `${getFederatedContentRoot()}/federal/assets/markets.json`;
    marketsPromise = fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => (Array.isArray(json?.data) ? json.data : []))
      .catch((e) => {
        window.lana?.log(`marketHelper: failed to load markets data: ${e?.message}`);
        return [];
      });
  }
  return marketsPromise;
}

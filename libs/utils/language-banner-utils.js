import { getConfig, getMetadata, createTag, getFederatedContentRoot } from './utils.js';

const targetMarkets = [];
let langBannerPromise;

export const getTargetMarkets = () => targetMarkets;

export const getLangBannerPromise = () => langBannerPromise;

const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

function getPreferredLanguage(locales) {
  const cookie = getCookie('international');
  if (cookie && cookie !== 'us') {
    const locale = locales[cookie];
    const langFromCookie = locale?.ietf
      ? locale.ietf.split('-')[0]
      : cookie.split('_')[0];
    return langFromCookie;
  }
  const browserLang = navigator.language?.split('-')[0];
  return browserLang || null;
}

async function decorateLanguageBanner() {
  const config = getConfig();
  const languageBannerEnabled = getMetadata('language-banner') || config.languageBanner;
  if (languageBannerEnabled !== 'on') return;
  const internationalCookie = getCookie('international');
  let showBanner = false;
  const pagePrefix = config.locale.prefix?.replace('/', '') || 'us';
  if (internationalCookie === pagePrefix) return;
  const pageLang = config.locale.ietf.split('-')[0];
  const prefLang = getPreferredLanguage(config.locales);

  const supportedMarketsPath = new URLSearchParams(window.location.search).get('supportedMarketsPath');
  const jsonPromise = fetch(
    supportedMarketsPath
      || `${getFederatedContentRoot()}/federal/supported-markets/supported-markets${config.marketsSource ? `-${config.marketsSource}` : ''}.json`,
  );

  const marketsConfigPromise = jsonPromise
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  const { default: getAkamaiCode } = await import('./geo.js');

  const [geoIpCode, marketsConfig] = await Promise.all([
    getAkamaiCode(),
    marketsConfigPromise,
  ]);

  if (!geoIpCode || !marketsConfig) return;
  const geoIp = geoIpCode.toLowerCase();
  marketsConfig.data.forEach((market) => {
    market.supportedRegions = market.supportedRegions.split(',').map((r) => r.trim().toLowerCase());
  });

  const pageMarket = marketsConfig.data.find((m) => m.prefix === (config.locale.prefix?.replace('/', '') || ''));
  const isSupportedMarket = pageMarket?.supportedRegions.includes(geoIp);

  if (isSupportedMarket) {
    if (!prefLang || pageLang === prefLang) return;
    const prefMarket = marketsConfig.data.find((market) => (
      market.lang === prefLang
      && market.supportedRegions.includes(geoIp)
    ));
    if (prefMarket) {
      showBanner = true;
      targetMarkets.push(prefMarket);
    }
    return;
  }

  // Unsupported Market Path
  const marketsForGeo = marketsConfig.data.filter((market) => (
    market.supportedRegions.includes(geoIp)));
  if (!marketsForGeo.length) return;

  if (prefLang) {
    const prefMarketForGeo = marketsForGeo.find((market) => market.lang === prefLang);
    if (prefMarketForGeo) {
      showBanner = true;
      targetMarkets.push(prefMarketForGeo);
    }
  }

  const marketsWithPriority = [];
  marketsForGeo.forEach((market) => {
    if (market.regionPriorities) {
      const priorityMap = new Map(
        market.regionPriorities.split(',').map((p) => {
          const [region, priority] = p.trim().split(':');
          return [region.toLowerCase(), parseInt(priority, 10)];
        }),
      );
      const priority = priorityMap.get(geoIp);
      if (priority) {
        marketsWithPriority.push({ market, priority });
      }
    }
  });

  if (marketsWithPriority.length) {
    marketsWithPriority.sort((a, b) => a.priority - b.priority);
    showBanner = true;
    targetMarkets.push(...marketsWithPriority.map((item) => item.market));
  } else if (marketsForGeo.length) {
    showBanner = true;
    targetMarkets.push(marketsForGeo[0]);
  }

  if (!showBanner) return;
  document.body.prepend(createTag('div', { class: 'language-banner' }));
  const existingWrapper = document.querySelector('.feds-promo-aside-wrapper');
  if (existingWrapper) {
    existingWrapper.remove();
    document.querySelector('.global-navigation').classList.remove('has-promo');
  }
}

export function initLanguageBanner() {
  if (!langBannerPromise) {
    langBannerPromise = decorateLanguageBanner();
  }
}

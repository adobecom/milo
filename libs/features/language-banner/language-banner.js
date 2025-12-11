import { getConfig, createTag, loadStyle } from '../../utils/utils.js';
import getAkamaiCode from '../../utils/geo.js';

const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

/**
 * Gets the user's preferred language, falling back from cookie to browser language.
 * @param {object} locales - The locales object from the Milo config.
 * @returns {string|null} The two-letter language code.
 */
function getPreferredLanguage(locales) {
  const cookie = getCookie('international');
  console.log('language-banner cookie:', cookie);
  if (cookie && cookie !== 'us') {
    const locale = locales[cookie];
    const langFromCookie = locale?.ietf
      ? locale.ietf.split('-')[0]
      : cookie.split('_')[0];
    return langFromCookie;
  }
  const browserLang = navigator.language?.split('-')[0];
  console.log('language-banner browserLang:', browserLang);
  return browserLang || null;
}

/**
 * Verifies if the translated version of the current page exists.
 * @param {string} marketPrefix
 * @param {object} config
 * @returns {Promise<string|null>}
 */
async function getTranslatedPage(marketPrefix, config) {
  const { pathname } = window.location;
  const currentPrefix = config.locale.prefix;

  const pagePath = currentPrefix ? pathname.replace(currentPrefix, '') : pathname;
  const translatedUrl = marketPrefix
    ? `${window.location.origin}/${marketPrefix}${pagePath}`
    : `${window.location.origin}${pagePath}`;

  try {
    const response = await fetch(translatedUrl, { method: 'HEAD' });
    if (response.ok) {
      return translatedUrl;
    }
  } catch (e) {
    console.warn(`Failed to check translated page: ${translatedUrl}`, e);
  }
  return null;
}

function buildBanner(market, translatedUrl) {
  const banner = createTag('div', { class: 'language-banner', 'daa-lh': 'language-banner' });
  const messageContainer = createTag('div', { class: 'language-banner-content' });
  const messageText = createTag('span', { class: 'language-banner-text' }, `${market.text} ${market.languageName}.`);
  const link = createTag('a', { class: 'language-banner-link', href: translatedUrl, 'daa-ll': `${market.prefix || 'us'}|Continue` }, market.continueText || 'Continue');
  const closeButton = createTag('button', { class: 'language-banner-close', 'aria-label': 'Close', 'daa-ll': 'Close' });
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 0.5C15.2467 0.5 19.5 4.75329 19.5 10C19.5 15.2467 15.2467 19.5 10 19.5C4.75329 19.5 0.5 15.2467 0.5 10C0.5 4.75329 4.75329 0.5 10 0.5Z" stroke="white"/>
      <path d="M6 14.0002L14 6.00024" stroke="white" stroke-width="2"/>
      <path d="M14 14.0002L6 6.00024" stroke="white" stroke-width="2"/>
    </svg>
  `;

  messageContainer.append(messageText, link);
  banner.append(messageContainer, closeButton);
  return banner;
}

function fireAnalyticsEvent(event) {
  const data = {
    xdm: {},
    data: { web: { webInteraction: { name: event?.type } } },
  };
  if (event?.data) data.data._adobe_corpnew = { digitalData: event.data };
  window._satellite?.track('event', data);
}

export function sendAnalytics(event) {
  if (window._satellite?.track) {
    fireAnalyticsEvent(event);
  } else {
    window.addEventListener('alloy_sendEvent', () => {
      fireAnalyticsEvent(event);
    }, { once: true });
  }
}

async function showBanner(market, config, translatedUrl) {
  console.log('language-banner: showing banner for market:', market);
  const banner = buildBanner(market, translatedUrl);
  document.body.prepend(banner);
  const { codeRoot, miloLibs } = config;
  loadStyle(`${miloLibs || codeRoot}/features/language-banner/language-banner.css`);

  banner.querySelector('.language-banner-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const { setInternational } = await import('../../utils/utils.js');
    setInternational(market.prefix);
    // window.location.href = translatedUrl;
  });

  banner.querySelector('.language-banner-close').addEventListener('click', () => {
    // const pageLangPrefix = config.locale.prefix?.replace('/', '') || 'us';
    // const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
    // document.cookie = `international=${pageLangPrefix};path=/;${domain}`;
    // banner.remove();
  });
  const pagePrefix = config.locale.prefix?.replace('/', '') || 'us';
  sendAnalytics(new Event(`${market.prefix || 'us'}-${pagePrefix}|language-banner`),);
}

/**
 * Initializes the language banner feature.
 * @returns {Promise<boolean>} Returns true if the logic was handled, false if it should delegate.
 */
export default async function init(jsonPromise) {
  const config = getConfig();
  const internationalCookie = getCookie('international');
  const pagePrefix = config.locale.prefix?.replace('/', '') || 'us';
  if (internationalCookie === pagePrefix) return;
  const pageLang = config.locale.ietf.split('-')[0];
  const prefLang = getPreferredLanguage(config.locales);
  console.log('language-banner preferredLanguage:', prefLang);

  const marketsConfigPromise = jsonPromise
    .then((res) => (res.ok ? res.json() : null))
    .catch(() => null);

  let [geoIp, marketsConfig] = await Promise.all([
    getAkamaiCode(),
    marketsConfigPromise,
  ]);

  if (!geoIp || !marketsConfig) return;
  geoIp = geoIp.toLowerCase();
  console.log('language-banner geoIp:', geoIp);
  marketsConfig.data.forEach((market) => {
    market.supportedRegions = market.supportedRegions.split(',').map((r) => r.trim().toLowerCase());
  });

  const pageMarket = marketsConfig.data.find((m) => m.prefix === (config.locale.prefix?.replace('/', '') || ''));
  const isSupportedMarket = pageMarket?.supportedRegions.includes(geoIp);

  if (isSupportedMarket) {
    if (!prefLang || pageLang === prefLang) return;
    const prefMarket = marketsConfig.data.find((m) => m.lang === prefLang && m.supportedRegions.includes(geoIp));
    if (prefMarket) {
      const translatedUrl = await getTranslatedPage(prefMarket.prefix, config);
      if (translatedUrl) await showBanner(prefMarket, config, translatedUrl);
    }
    return;
  }

  // Unsupported Market Path
  const marketsForGeo = marketsConfig.data.filter((m) => m.supportedRegions.includes(geoIp));
  if (!marketsForGeo.length) return;

  if (prefLang) {
    const prefMarketForGeo = marketsForGeo.find((m) => m.lang === prefLang);
    if (prefMarketForGeo) {
      const translatedUrl = await getTranslatedPage(prefMarketForGeo.prefix, config);
      if (translatedUrl) {
        await showBanner(prefMarketForGeo, config, translatedUrl);
        return;
      }
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

  let marketsToCheck = [];
  if (marketsWithPriority.length) {
    marketsWithPriority.sort((a, b) => a.priority - b.priority);
    marketsToCheck = marketsWithPriority.map((item) => item.market);
  } else if (marketsForGeo.length) {
    marketsToCheck.push(marketsForGeo[0]);
  }

  for (const market of marketsToCheck) {
    const translatedUrl = await getTranslatedPage(market.prefix, config);
    if (translatedUrl) {
      await showBanner(market, config, translatedUrl);
      return; // Stop after finding the first valid page
    }
  }
}
/* eslint-disable no-underscore-dangle */
import { getConfig, createTag, loadStyle } from '../../utils/utils.js';
import { getTargetMarkets } from '../../utils/language-banner-utils.js';

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
  const banner = document.body.querySelector('.language-banner');
  if (!banner) return banner;
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

async function showBanner(markets, config) {
  let translatedUrl = null;
  let targetMarket = null;
  for (const market of markets) {
    translatedUrl = await getTranslatedPage(market.prefix, config);
    if (translatedUrl) {
      targetMarket = market;
      break;
    }
  }

  if (!targetMarket) return;

  const banner = buildBanner(targetMarket, translatedUrl);
  if (!banner) return;
  const { codeRoot, miloLibs } = config;
  loadStyle(`${miloLibs || codeRoot}/features/language-banner/language-banner.css`);

  banner.querySelector('.language-banner-link').addEventListener('click', async (e) => {
    e.preventDefault();
    const { setInternational } = await import('../../utils/utils.js');
    setInternational(targetMarket.prefix || 'us');
    window.open(translatedUrl, '_self');
  });

  banner.querySelector('.language-banner-close').addEventListener('click', () => {
    const pageLangPrefix = config.locale.prefix?.replace('/', '') || 'us';
    const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
    document.cookie = `international=${pageLangPrefix};path=/;${domain}`;
    banner.remove();
  });
  const pagePrefix = config.locale.prefix?.replace('/', '') || 'us';
  sendAnalytics(new Event(`${targetMarket.prefix || 'us'}-${pagePrefix}|language-banner`),);
}

export default async function init() {
  const targetMarkets = getTargetMarkets();
  if (targetMarkets.length) {
    await showBanner(targetMarkets, getConfig());
  }
}

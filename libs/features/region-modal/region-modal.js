import { getCountry, setMarket, pageExist } from '../../utils/utils.js';
import loadMarketsData, { appendCountryParam, getMarketLabel } from '../../utils/marketHelper.js';
import { marketsLangForLocale, norm } from '../../utils/market.js';

let config;
let createTag;
let loadStyleFn;
let loadBlockFn;
let sendAnalyticsFunc;

const COUNTRY_PLACEHOLDER = /\{country\}/g;

/** Normalizes market entries to the shape expected by the modal UI. */
function mapLangRoutingMarketsForModal(markets) {
  return markets.map((market) => ({
    prefix: market.prefix ?? '',
    language: market.nativeName || market.langName || market.languageName || market.lang || '',
    lang: market.lang || '',
    marketLangKey: market.marketLangKey,
    dir: market.dir || 'ltr',
    modalTitle: market.modalTitle || 'This adobe site does not match your location',
    modalDescription: market.modalDescription || 'Based on your location, you may prefer another site',
    continueText: market.continueText || 'Continue',
  }));
}

const createTabsContainer = (tabNames) => {
  const ol = createTag('ol');
  tabNames.forEach((name) => {
    const li = createTag('li', null, name);
    ol.appendChild(li);
  });
  const olDiv = createTag('div', null, ol);
  const outerDiv = createTag('div', null, olDiv);
  const divTabs = createTag('div', { class: 'tabs quiet' }, outerDiv);
  return createTag('div', { class: 'section tabs-background-transparent' }, divTabs);
};

const createTab = (content, tabName) => {
  const divTab = createTag('div', null, 'tab');
  const divTagName = createTag('div', null, tabName);
  const tab = createTag('div');
  tab.appendChild(divTab);
  tab.appendChild(divTagName);
  const sectionMeta = createTag('div', { class: 'section-metadata' }, tab);
  const topDiv = createTag('div', { class: 'section' });
  topDiv.append(content);
  topDiv.append(sectionMeta);
  return topDiv;
};

const [handleOverflow, removeOverflow] = (() => {
  let modalEl = null;
  let resizeObserver = null;

  const calcOverflow = () => {
    if (!modalEl) return;
    const isOverflowing = modalEl.scrollHeight > modalEl.clientHeight;
    modalEl.style.overflow = isOverflowing ? 'auto' : 'visible';
  };

  return [
    (container) => {
      if (!container) return;
      modalEl = container;
      requestAnimationFrame(calcOverflow);
      resizeObserver = new ResizeObserver(calcOverflow);
      resizeObserver.observe(modalEl);
      window.addEventListener('milo:modal:closed', removeOverflow);
    },
    () => {
      if (!modalEl) return;
      modalEl.removeAttribute('style');
      if (resizeObserver) resizeObserver.disconnect();
      modalEl = null;
      window.removeEventListener('milo:modal:closed', removeOverflow);
    },
  ];
})();

const [pickerKeydownHandler, removePicker, addOutsideClick] = (() => {
  let pickerList = null;
  let pickerButton = null;
  let pickerLinks = null;
  let pickerEvent = null;

  const handleOutsideClick = (evt) => {
    if (pickerEvent === evt) return;
    let { target } = evt;
    while (target) {
      if (target === pickerList) return;
      target = target.parentNode;
    }
    removePicker();
    document.removeEventListener('click', handleOutsideClick);
  };

  const keydownHandler = (e) => {
    const index = Array.from(pickerLinks).indexOf(e.target);
    if (index === -1) return;
    switch (e.code) {
      case 'ArrowDown':
        e.preventDefault();
        pickerLinks[index + 1]?.focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        pickerLinks[index - 1]?.focus();
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          const prev = pickerLinks[index - 1] || pickerLinks[pickerLinks.length - 1];
          prev.focus();
        } else {
          const next = pickerLinks[index + 1] || pickerLinks[0];
          next.focus();
        }
        break;
      case 'Escape':
        e.stopPropagation();
        document.removeEventListener('click', handleOutsideClick);
        removePicker();
        break;
      default:
        break;
    }
  };

  return [
    (list, button) => {
      pickerList = list;
      pickerButton = button;
      pickerLinks = list.querySelectorAll('a');
      if (pickerLinks.length > 0) {
        pickerLinks[0].focus();
        pickerList.addEventListener('keydown', keydownHandler);
      }
    },
    () => {
      pickerList?.removeEventListener('keydown', keydownHandler);
      pickerList?.remove();
      pickerButton?.focus();
      pickerButton?.setAttribute('aria-expanded', 'false');
    },
    (event) => {
      pickerEvent = event;
      document.addEventListener('click', handleOutsideClick);
    },
  ];
})();

function getPagePath() {
  let path = window.location.href.replace(window.location.origin, '');
  const { prefix } = config.locale;
  if (path.startsWith(prefix)) path = path.replace(prefix, '');
  return path;
}

/** HEAD with GET fallback – returns markets where the page exists. No fallback. */
async function getAvailableMarkets(suggestedMarkets) {
  const pagePath = getPagePath();
  const results = await Promise.all(
    suggestedMarkets.map(async (market, index) => {
      const locPath = market.prefix ? `/${market.prefix}${pagePath}` : pagePath;
      const fullUrl = `${window.location.origin}${locPath}`;
      const ok = await pageExist(fullUrl);
      if (ok) return { index, market: { ...market, url: fullUrl } };
      return { index, market: null };
    }),
  );
  return results
    .filter((r) => r.market != null)
    .sort((a, b) => a.index - b.index)
    .map((r) => r.market);
}

function getMarketsLangEntry() {
  const languages = config.marketsConfig?.languages?.data ?? config.marketsConfig?.data ?? [];
  return marketsLangForLocale({ languages }, config.locale);
}

function setIntlCookie(localePrefix) {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
  document.cookie = `international=${localePrefix || 'us'};path=/;${domain}`;
}

function getLangKeyForModalMarket(market) {
  const raw = market.marketLangKey || market.lang;
  if (typeof raw === 'string' && raw.trim()) return raw.trim().toLowerCase();
  return 'en';
}

function getGeoCountryDisplayName(markets, geoMarketCode, langKey, pagePrefix) {
  let marketLabel = '';
  if (markets?.length && geoMarketCode) {
    const lower = geoMarketCode.toLowerCase();
    const matchingMarket = markets.find((market) => (market.marketCode?.toLowerCase() || '') === lower);
    marketLabel = getMarketLabel(matchingMarket, langKey, pagePrefix);
  }
  const trimmed = typeof marketLabel === 'string' ? marketLabel.trim() : '';
  if (trimmed) {
    const idx = trimmed.indexOf('-');
    if (idx !== -1) {
      const countryName = trimmed.slice(0, idx).trim();
      if (countryName) return countryName;
    }
  }
  return (geoMarketCode || '').toUpperCase();
}

function applyCountryPlaceholder(text, countryName) {
  if (typeof text !== 'string' || !text) return text;
  return text.replace(COUNTRY_PLACEHOLDER, countryName);
}

function appendGeoFlagIcon(mainAction, geoMarketCode) {
  const base = config.miloLibs || config.codeRoot;
  const iconSpan = createTag('span', { class: 'icon margin-inline-end' });
  const code = String(geoMarketCode).toLowerCase().replace(/_/g, '-');
  const flagCode = code === 'gb' ? 'uk' : code;
  const flagImg = createTag('img', {
    class: 'icon-milo',
    width: 15,
    height: 15,
    alt: '',
    role: 'presentation',
  });
  flagImg.addEventListener(
    'error',
    () => {
      flagImg.remove();
      if (iconSpan.childNodes.length === 0) {
        iconSpan.remove();
      }
    },
    { once: true },
  );
  flagImg.src = `${base}/img/georouting/flag-${flagCode}.svg`;
  iconSpan.appendChild(flagImg);
  mainAction.appendChild(iconSpan);
}

function decoratePickerLink(link, market, currentPagePrefix, geoMarketCode) {
  const eventName = `Switch:${market.prefix || 'us'}-${currentPagePrefix}|region-modal`;
  link.setAttribute('daa-ll', eventName);
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    if (geoMarketCode) setMarket(geoMarketCode);
    setIntlCookie(market.prefix || 'us');
    link.closest('.dialog-modal')?.dispatchEvent(new Event('closeModal'));
    removeOverflow();
    window.open(market.url, '_self');
  });
}

function openPicker(
  button,
  markets,
  event,
  currentPagePrefix,
  dir,
  geoMarketCode,
  pickerCountryLabel,
) {
  if (document.querySelector('.region-modal .picker')) {
    return;
  }
  const list = createTag('ul', { class: 'picker', dir: dir || 'ltr' });
  markets.forEach((m) => {
    const lang = config.locales?.[m.prefix || '']?.ietf ?? m.lang ?? '';
    const linkLabel = pickerCountryLabel ? `${pickerCountryLabel} - ${m.language}` : m.language;
    const a = createTag('a', { lang, href: m.url || '#' }, linkLabel);
    if (a.hash && !window.location.hash) {
      a.hash = '';
      a.setAttribute('href', a.href);
    }
    decoratePickerLink(a, m, currentPagePrefix, geoMarketCode);
    const li = createTag('li', {}, a);
    list.appendChild(li);
  });
  button.parentNode.insertBefore(list, button.nextSibling);
  const buttonRect = button.getBoundingClientRect();
  const spaceBelow = window.innerHeight - buttonRect.bottom;
  if (spaceBelow <= list.offsetHeight) {
    list.classList.add('top');
  }
  pickerKeydownHandler(list, button);
  button.setAttribute('aria-expanded', 'true');
  addOutsideClick(event);
}

function getCurrentSiteLabel() {
  const prefix = config.locale.prefix?.replace('/', '') || 'us';
  const entry = getMarketsLangEntry();
  return entry?.nativeName ?? entry?.langName ?? entry?.language ?? prefix;
}

function decorateCurrentSiteLink(link, currentPagePrefix, regionCode) {
  const eventName = `Stay:${currentPagePrefix}|region-modal`;
  link.setAttribute('daa-ll', eventName);
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    if (regionCode) {
      setMarket(regionCode);
      try {
        window.history.replaceState(null, '', appendCountryParam(window.location.href, regionCode));
      } catch {
        /* ignore invalid URL */
      }
    }
    setIntlCookie(currentPagePrefix);
    link.closest('.dialog-modal')?.dispatchEvent(new Event('closeModal'));
    removeOverflow();
  });
}

function buildContent(
  currentMarket,
  availableMarkets,
  currentPagePrefix,
  geoMarketCode,
  markets,
) {
  const fragment = new DocumentFragment();
  const lang = config.locales?.[currentMarket.prefix || '']?.ietf ?? currentMarket.lang ?? '';
  const dir = currentMarket.dir || 'ltr';
  const useGeo = Boolean(geoMarketCode);
  const langKey = getLangKeyForModalMarket(currentMarket);
  const countryDisplayName = useGeo
    ? getGeoCountryDisplayName(markets, geoMarketCode, langKey, currentMarket.prefix)
    : '';

  const titleText = useGeo
    ? applyCountryPlaceholder(currentMarket.modalTitle, countryDisplayName)
    : currentMarket.modalTitle;
  const descText = useGeo
    ? applyCountryPlaceholder(currentMarket.modalDescription, countryDisplayName)
    : currentMarket.modalDescription;

  const title = createTag('h3', { lang, dir });
  title.textContent = titleText;
  const text = createTag('p', { class: 'locale-text', lang, dir });
  text.textContent = descText;
  const mainAction = createTag('a', {
    class: 'con-button blue button-l',
    lang,
    role: 'button',
    'aria-haspopup': !!availableMarkets.length,
    'aria-expanded': 'false',
    href: '#',
  });
  const labelText = useGeo ? countryDisplayName : currentMarket.language;
  const hasPicker = availableMarkets.length > 1;
  const base = config.miloLibs || config.codeRoot;

  if (useGeo) {
    appendGeoFlagIcon(mainAction, geoMarketCode);
  }
  mainAction.append(labelText);
  if (hasPicker) {
    mainAction.appendChild(createTag('img', {
      class: 'icon-milo down-arrow',
      src: `${base}/ui/img/chevron.svg`,
      role: 'presentation',
      width: 15,
      height: 15,
    }));
  }

  if (availableMarkets.length > 1) {
    const openPickerHandler = (e) => {
      e.preventDefault();
      openPicker(
        mainAction,
        availableMarkets,
        e,
        currentPagePrefix,
        dir,
        geoMarketCode,
        useGeo ? countryDisplayName : '',
      );
    };
    mainAction.addEventListener('keydown', (e) => {
      if (e.code === 'Space') openPickerHandler(e);
    });
    mainAction.addEventListener('click', openPickerHandler);
  } else {
    mainAction.href = availableMarkets[0]?.url || '#';
    mainAction.removeAttribute('role');
    mainAction.removeAttribute('aria-haspopup');
    mainAction.removeAttribute('aria-expanded');
    mainAction.setAttribute('daa-ll', `Continue:${availableMarkets[0]?.prefix || 'us'}-${currentPagePrefix}|region-modal`);
    mainAction.addEventListener('click', async (e) => {
      e.preventDefault();
      const m = availableMarkets[0];
      if (geoMarketCode) setMarket(geoMarketCode);
      setIntlCookie(m.prefix || 'us');
      mainAction.closest('.dialog-modal')?.dispatchEvent(new Event('closeModal'));
      removeOverflow();
      window.open(m.url, '_self');
    });
  }

  const currentEntry = getMarketsLangEntry();
  const siteCountry = norm(currentPagePrefix) || 'us';
  const regionCode = useGeo ? siteCountry : '';
  const stayLangKey = getLangKeyForModalMarket(currentEntry || {});
  const stayLabel = useGeo && regionCode && markets?.length
    ? getGeoCountryDisplayName(
      markets,
      regionCode,
      stayLangKey,
      siteCountry,
    )
    : getCurrentSiteLabel();
  const currentPageUrl = window.location.hash ? document.location.href : '#';
  const currentSiteLink = createTag('a', { lang, href: currentPageUrl }, stayLabel);
  decorateCurrentSiteLink(currentSiteLink, currentPagePrefix, regionCode);
  const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
  linkWrapper.appendChild(currentSiteLink);
  fragment.append(title, text, linkWrapper);
  return fragment;
}

function getDetails(availableMarkets, currentPagePrefix, geoMarketCode, markets) {
  const wrapper = createTag('div', { class: 'georouting-wrapper fragment' });

  if (availableMarkets.length === 1) {
    const content = buildContent(
      availableMarkets[0],
      availableMarkets,
      currentPagePrefix,
      geoMarketCode,
      markets,
    );
    wrapper.appendChild(content);
    return wrapper;
  }

  const sortedMarkets = [...availableMarkets];
  const tabsContainer = createTabsContainer(sortedMarkets.map((m) => m.language));
  wrapper.appendChild(tabsContainer);

  sortedMarkets.forEach((market) => {
    const content = buildContent(
      market,
      sortedMarkets,
      currentPagePrefix,
      geoMarketCode,
      markets,
    );
    const tab = createTab(content, market.language);
    wrapper.appendChild(tab);
  });
  return wrapper;
}

async function showModal(details) {
  const { miloLibs, codeRoot } = config;
  const hasTabs = details.querySelector('.tabs');

  const sectionMetaPath = `${miloLibs || codeRoot}/blocks/section-metadata/section-metadata.css`;
  const regionModalPath = `${miloLibs || codeRoot}/features/region-modal/region-modal.css`;
  const modalPath = `${miloLibs || codeRoot}/blocks/modal/modal.css`;

  const promises = [
    hasTabs ? loadBlockFn(details.querySelector('.tabs')) : null,
    hasTabs ? new Promise((resolve) => { loadStyleFn(sectionMetaPath, resolve); }) : null,
    new Promise((resolve) => { loadStyleFn(regionModalPath, resolve); }),
    new Promise((resolve) => { loadStyleFn(modalPath, resolve); }),
    import('../../blocks/modal/modal.js'),
  ];
  const result = await Promise.all(promises);
  const { getModal, sendAnalytics } = result[4];
  sendAnalyticsFunc = sendAnalytics;
  return getModal(null, {
    class: 'region-modal',
    id: 'region-modal',
    content: details,
    closeEvent: 'closeModal',
  });
}

export default async function showRegionModal(
  routingConfig,
  conf,
  createTagFunc,
  loadStyleFunc,
  loadBlockFunc,
) {
  const { markets: suggestedMarkets, geoMarketCode } = routingConfig || {};
  if (!suggestedMarkets?.length) return;

  config = conf;
  createTag = createTagFunc;
  loadStyleFn = loadStyleFunc;
  loadBlockFn = loadBlockFunc ?? (() => Promise.resolve());

  const marketsForModal = mapLangRoutingMarketsForModal(suggestedMarkets);
  let availableMarkets = await getAvailableMarkets(marketsForModal);
  if (availableMarkets.length === 0) return;

  let markets = [];
  if (geoMarketCode) {
    markets = await loadMarketsData();
    availableMarkets = availableMarkets.map((market) => ({
      ...market,
      url: appendCountryParam(market.url, geoMarketCode),
    }));
  }

  const currentPagePrefix = config.locale.prefix?.replace('/', '') || 'us';
  const details = getDetails(availableMarkets, currentPagePrefix, geoMarketCode, markets);
  const modal = await showModal(details);
  handleOverflow(modal);

  const akamaiCode = await getCountry();
  const topMarket = availableMarkets[0];
  const eventString = `Load:${topMarket.prefix || 'us'}-${currentPagePrefix}|region-modal|locale:${currentPagePrefix}|country:${akamaiCode}`;
  if (sendAnalyticsFunc) sendAnalyticsFunc(new Event(eventString));
}

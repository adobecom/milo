import { getCountry } from '../../utils/utils.js';

let config;
let createTag;
let loadStyleFn;
let loadBlockFn;
let sendAnalyticsFunc;

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
  const { pathname } = window.location;
  const { prefix } = config.locale;
  return prefix ? pathname.replace(prefix, '') : pathname;
}

/** HEAD check only – returns markets where the page exists. No fallback. */
async function getAvailableMarkets(suggestedMarkets) {
  const pagePath = getPagePath();
  const results = await Promise.all(
    suggestedMarkets.map(async (market, index) => {
      const locPath = market.prefix ? `/${market.prefix}${pagePath}` : pagePath;
      const fullUrl = `${window.location.origin}${locPath}`;
      try {
        const resp = await fetch(fullUrl, { method: 'HEAD' });
        if (resp.ok) {
          const withUrl = { ...market, url: fullUrl };
          return { index, market: withUrl };
        }
      } catch (_) { /* ignore */ }
      return { index, market: null };
    }),
  );
  return results
    .filter((r) => r.market != null)
    .sort((a, b) => a.index - b.index)
    .map((r) => r.market);
}

function decoratePickerLink(link, market, currentPagePrefix) {
  const eventName = `Switch:${market.prefix || 'us'}-${currentPagePrefix}|language-modal`;
  link.setAttribute('daa-ll', eventName);
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
    document.cookie = `international=${market.prefix || 'us'};path=/;${domain}`;
    link.closest('.dialog-modal')?.dispatchEvent(new Event('closeModal'));
    removeOverflow();
    window.open(market.url, '_self');
  });
}

function openPicker(button, markets, event, currentPagePrefix, dir) {
  if (document.querySelector('.language-modal .picker')) {
    return;
  }
  const list = createTag('ul', { class: 'picker', dir: dir || 'ltr' });
  markets.forEach((m) => {
    const lang = config.locales?.[m.prefix || '']?.ietf ?? m.lang ?? '';
    const a = createTag('a', { lang, href: m.url || '#' }, m.language);
    decoratePickerLink(a, m, currentPagePrefix);
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

function getCurrentLanguageLabel() {
  const prefix = config.locale.prefix?.replace('/', '') || 'us';
  const normalized = prefix || 'us';
  const rawEntries = config.marketsConfig?.languages?.data ?? config.marketsConfig?.data;
  const entry = rawEntries?.find((e) => (e.prefix || 'us') === normalized);
  return entry?.language ?? normalized;
}

function decorateCurrentSiteLink(link, currentPagePrefix) {
  const eventName = `Stay:${currentPagePrefix}|language-modal`;
  link.setAttribute('daa-ll', eventName);
  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
    document.cookie = `international=${currentPagePrefix};path=/;${domain}`;
    link.closest('.dialog-modal')?.dispatchEvent(new Event('closeModal'));
    removeOverflow();
  });
}

function buildContent(currentMarket, availableMarkets, currentPagePrefix) {
  const fragment = new DocumentFragment();
  const lang = config.locales?.[currentMarket.prefix || '']?.ietf ?? currentMarket.lang ?? '';
  const dir = currentMarket.dir || 'ltr';
  const title = createTag('h3', { lang, dir }, currentMarket.modalHeading);
  const text = createTag('p', { class: 'locale-text', lang, dir }, currentMarket.modalDescription);

  const mainAction = createTag('a', {
    class: 'con-button blue button-l',
    lang,
    role: 'button',
    'aria-haspopup': !!availableMarkets.length,
    'aria-expanded': 'false',
    href: '#',
  });
  mainAction.append(currentMarket.language);

  if (availableMarkets.length > 1) {
    const downArrow = createTag('img', {
      class: 'icon-milo down-arrow',
      src: `${config.miloLibs || config.codeRoot}/ui/img/chevron.svg`,
      role: 'presentation',
      width: 15,
      height: 15,
    });
    mainAction.appendChild(downArrow);
    const openPickerHandler = (e) => {
      e.preventDefault();
      openPicker(mainAction, availableMarkets, e, currentPagePrefix, dir);
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
    mainAction.setAttribute('daa-ll', `Continue:${availableMarkets[0]?.prefix || 'us'}-${currentPagePrefix}|language-modal`);
    mainAction.addEventListener('click', async (e) => {
      e.preventDefault();
      const m = availableMarkets[0];
      const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com;' : '';
      document.cookie = `international=${m.prefix || 'us'};path=/;${domain}`;
      mainAction.closest('.dialog-modal')?.dispatchEvent(new Event('closeModal'));
      removeOverflow();
      window.open(m.url, '_self');
    });
  }

  const currentSiteLink = createTag('a', { lang, href: '#' }, getCurrentLanguageLabel());
  decorateCurrentSiteLink(currentSiteLink, currentPagePrefix);
  const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
  linkWrapper.appendChild(currentSiteLink);
  fragment.append(title, text, linkWrapper);
  return fragment;
}

function getDetails(availableMarkets, currentPagePrefix) {
  const wrapper = createTag('div', { class: 'georouting-wrapper fragment' });

  if (availableMarkets.length === 1) {
    const content = buildContent(availableMarkets[0], availableMarkets, currentPagePrefix);
    wrapper.appendChild(content);
    return wrapper;
  }

  const sortedMarkets = [...availableMarkets];
  const tabsContainer = createTabsContainer(sortedMarkets.map((m) => m.language));
  wrapper.appendChild(tabsContainer);

  sortedMarkets.forEach((market) => {
    const content = buildContent(market, sortedMarkets, currentPagePrefix);
    const tab = createTab(content, market.language);
    wrapper.appendChild(tab);
  });
  return wrapper;
}

async function showModal(details) {
  const { miloLibs, codeRoot } = config;
  const hasTabs = details.querySelector('.tabs');

  const sectionMetaPath = `${miloLibs || codeRoot}/blocks/section-metadata/section-metadata.css`;
  const georoutingPath = `${miloLibs || codeRoot}/features/georoutingv2/georoutingv2.css`;
  const languageModalPath = `${miloLibs || codeRoot}/features/language-modal/language-modal.css`;
  const modalPath = `${miloLibs || codeRoot}/blocks/modal/modal.css`;

  const promises = [
    hasTabs ? loadBlockFn(details.querySelector('.tabs')) : null,
    hasTabs ? new Promise((resolve) => { loadStyleFn(sectionMetaPath, resolve); }) : null,
    new Promise((resolve) => { loadStyleFn(georoutingPath, resolve); }),
    new Promise((resolve) => { loadStyleFn(languageModalPath, resolve); }),
    new Promise((resolve) => { loadStyleFn(modalPath, resolve); }),
    import('../../blocks/modal/modal.js'),
  ];
  const result = await Promise.all(promises);
  const { getModal, sendAnalytics } = result[5];
  sendAnalyticsFunc = sendAnalytics;
  return getModal(null, {
    class: 'language-modal',
    id: 'language-modal',
    content: details,
    closeEvent: 'closeModal',
  });
}

export default async function showLanguageModal(
  suggestedMarkets,
  conf,
  createTagFunc,
  loadStyleFunc,
  loadBlockFunc,
) {
  if (!suggestedMarkets?.length) return;

  config = conf;
  createTag = createTagFunc;
  loadStyleFn = loadStyleFunc;
  loadBlockFn = loadBlockFunc ?? (() => Promise.resolve());

  const availableMarkets = await getAvailableMarkets(suggestedMarkets);
  if (availableMarkets.length === 0) return;

  const currentPagePrefix = config.locale.prefix?.replace('/', '') || 'us';
  const details = getDetails(availableMarkets, currentPagePrefix);
  const modal = await showModal(details);
  handleOverflow(modal);

  const akamaiCode = await getCountry();
  const topMarket = availableMarkets[0];
  const eventString = `Load:${topMarket.prefix || 'us'}-${currentPagePrefix}|language-modal|locale:${currentPagePrefix}|country:${akamaiCode}`;
  if (sendAnalyticsFunc) sendAnalyticsFunc(new Event(eventString));
}

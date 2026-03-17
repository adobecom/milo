/* eslint-disable no-underscore-dangle */
import { debounce } from '../../utils/action.js';
import {
  createTag,
  getConfig,
  getCookie,
  getFederatedContentRoot,
  getMetadata,
  setInternational,
  setMarket,
} from '../../utils/utils.js';
import { getMarketConfig, getValidatedMarket, norm } from '../../utils/market.js';

async function loadMarketsData() {
  try {
    const resp = await fetch(`${getFederatedContentRoot()}/federal/assets/markets.json`);
    if (!resp.ok) return [];
    const json = await resp.json();
    return json?.data || [];
  } catch (e) {
    window.lana?.log(`Market selector: failed to load markets data: ${e?.message}`);
    return [];
  }
}

const CHECKMARK_SVG = '<svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#274DEA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const GLOBE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="market-selector-globe"><path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1C12.25 3.5 13.5 6.5 13.5 10C13.5 13.5 12.25 16.5 10 19C7.75 16.5 6.5 13.5 6.5 10C6.5 6.5 7.75 3.5 10 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SEARCH_ICON_INNER = '<path d="M14.8243 13.9758L10.7577 9.90923C11.5332 8.94809 12 7.72807 12 6.40005C12 3.31254 9.48755 0.800049 6.40005 0.800049C3.31254 0.800049 0.800049 3.31254 0.800049 6.40004C0.800049 9.48755 3.31254 12 6.40005 12C7.72807 12 8.9481 11.5331 9.90922 10.7577L13.9758 14.8243C14.093 14.9414 14.2461 15 14.4 15C14.5539 15 14.7071 14.9414 14.8243 14.8243C15.0586 14.5899 15.0586 14.2102 14.8243 13.9758ZM6.40005 10.8C3.97426 10.8 2.00005 8.82582 2.00005 6.40004C2.00005 3.97426 3.97426 2.00004 6.40005 2.00004C8.82583 2.00004 10.8 3.97426 10.8 6.40004C10.8 8.82582 8.82583 10.8 6.40005 10.8Z" fill="#666"/>';

function sendAnalyticsEvent(eventName, type = 'click') {
  if (window._satellite?.track) {
    window._satellite.track('event', {
      xdm: {},
      data: {
        eventType: 'web.webinteraction.linkClicks',
        web: {
          webInteraction: {
            name: eventName,
            linkClicks: { value: 1 },
            type,
          },
        },
      },
    });
  }
}

let miloLangIsKeyboard = false;
document.addEventListener('keydown', (e) => {
  if (
    e.key === 'Tab'
    || e.key === 'ArrowLeft'
    || e.key === 'ArrowRight'
    || e.key === 'ArrowUp'
    || e.key === 'ArrowDown'
  ) {
    miloLangIsKeyboard = true;
  }
});
document.addEventListener('mousedown', () => {
  miloLangIsKeyboard = false;
});

function getTargetUrl(targetPrefix, currentPath) {
  const { locale } = getConfig();
  const currentPrefix = locale?.prefix || '';
  const pathWithoutPrefix = currentPrefix && currentPath.startsWith(currentPrefix)
    ? currentPath.substring(currentPrefix.length)
    : currentPath;

  const newPath = targetPrefix ? `/${targetPrefix}${pathWithoutPrefix}` : pathWithoutPrefix;
  const url = `${window.location.origin}${newPath.replace(/\/+$/, '') || '/'}`;
  return `${url}${window.location.search}${window.location.hash}`;
}

const queriedPages = [];

// handles the event for the market selector
function handleEvent({ prefix, link, callback, fallbackUrl } = {}) {
  if (typeof callback !== 'function') return;
  const { baseSitePath } = getConfig();
  const defaultFallback = `${window.location.origin}${prefix ? `/${prefix}` : ''}${getMetadata('base-site-path') || baseSitePath || ''}/`;
  const resolvedFallback = fallbackUrl || defaultFallback;
  const urlForCheck = link.href;
  const existingPage = queriedPages.find((page) => page.href === urlForCheck);
  if (existingPage) {
    callback(existingPage.ok ? link.href : resolvedFallback);
    return;
  }
  fetch(urlForCheck, { method: 'HEAD' }).then((resp) => {
    queriedPages.push({ href: urlForCheck, ok: resp.ok });
    if (!resp.ok) throw new Error('request failed');
    callback(link.href);
  }).catch(() => {
    queriedPages.push({ href: urlForCheck, ok: false });
    callback(resolvedFallback);
  });
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function isNameMatch(name, searchNormalized) {
  return name && normalizeText(name).includes(searchNormalized);
}

function isIetfMatchForPrefix(prefix, searchTerm, locales) {
  if (!locales || !prefix) return false;
  const localeKey = prefix.replace(/^\//, '');
  const fullIetf = locales[localeKey]?.ietf?.toLowerCase();
  const ietfLang = fullIetf?.split('-')[0];
  return ietfLang && fullIetf?.includes(searchTerm);
}

function filterMarket(item, searchTerm) {
  return isNameMatch(item.label, searchTerm);
}

function filterLang(item, searchTerm, locales) {
  const labelMatch = isNameMatch(item.label, searchTerm);
  const englishMatch = isNameMatch(item.englishName, searchTerm);
  const ietfMatch = isIetfMatchForPrefix(item.value, searchTerm, locales);
  return labelMatch || englishMatch || ietfMatch;
}

function getLangKeyForMarket(currentLang) {
  if (!currentLang) return 'en';
  const langKey = currentLang.marketLangKey || currentLang.lang;
  return (typeof langKey === 'string' && langKey.trim()) ? langKey.trim().toLowerCase() : 'en';
}

function getMarketLabel(market, langKey) {
  const prefLangLabel = market[langKey];
  if (typeof prefLangLabel === 'string' && prefLangLabel.trim()) return prefLangLabel.trim();
  const enLabel = market.en;
  if (typeof enLabel === 'string' && enLabel.trim()) return enLabel.trim();
  return market.marketName || '';
}

function getCurrentMarket(markets, currentMarketCode, currentLang) {
  return markets.find((market) => market.marketCode === currentMarketCode)
    || markets.find((market) => market.marketCode === currentLang.defaultMarket)
    || markets[0];
}

function getLanguageOptions(languages, currentLang) {
  const languageOptions = [];
  const addedKeys = new Set();
  languages.forEach((lang) => {
    const groupKey = lang.group || lang.prefix || 'us';
    if (addedKeys.has(groupKey)) return;
    addedKeys.add(groupKey);

    const isCurrentGroup = currentLang.group
      ? lang.group === currentLang.group
      : lang.prefix === currentLang.prefix;
    const targetPrefix = isCurrentGroup ? (currentLang.prefix || '') : (lang.prefix || '');

    languageOptions.push({
      label: lang.group || lang.nativeName,
      englishName: lang.group || lang.langName,
      value: targetPrefix,
      url: getTargetUrl(targetPrefix, window.location.pathname),
    });
  });
  return languageOptions;
}

function handleLanguageSelect(langOption, config, currentMarketCode, opts = {}) {
  const { openInNewTab = false } = opts;
  const selectedLang = config.languages.find((lang) => (lang.prefix || '') === (langOption.value || ''));
  if (!selectedLang?.supportedRegions) return;

  setInternational(selectedLang.prefix || 'us');

  const finalUrl = new URL(langOption.url);

  // When existing country cookie conflicts with selected language, override to language's default
  const supported = selectedLang.supportedRegions?.split(',').map((r) => r.trim().toLowerCase()) || [];
  const defaultMarket = selectedLang.defaultMarket || 'us';
  if (getCookie('country') && !supported.includes(norm(currentMarketCode))) {
    setMarket(defaultMarket);
    finalUrl.searchParams.set('country', defaultMarket);
  }

  handleEvent({
    prefix: selectedLang.prefix,
    link: { href: finalUrl.toString() },
    callback: (url) => { window.open(url, openInNewTab ? '_blank' : '_self'); },
  });
}

function handleMarketSelect(marketItem, config, currentLang, currentPrefix, opts = {}) {
  const { openInNewTab = false } = opts;
  const { locales } = getConfig();
  const currentLangPrefix = currentLang.prefix || 'en';
  const regionalPrefix = `${marketItem.value}_${currentLangPrefix.replace('/', '')}`;

  let marketPrefix;

  if (currentLang.group) {
    const sameGroupLang = config.languages.find((lang) => (
      lang.group === currentLang.group && lang.defaultMarket === marketItem.value
    ));
    if (sameGroupLang) marketPrefix = sameGroupLang.prefix;
  }

  if (marketPrefix === undefined && locales?.[regionalPrefix]) {
    marketPrefix = regionalPrefix;
  }

  setMarket(marketItem.value);
  const commerceService = document.head.querySelector('mas-commerce-service');
  commerceService?.setAttribute('country', marketItem.value.toUpperCase());

  let targetPrefix = currentPrefix;
  if (marketPrefix !== undefined) {
    targetPrefix = marketPrefix ? `/${marketPrefix}` : '';
  }
  const isRedirect = targetPrefix !== currentPrefix;
  const targetUrl = isRedirect
    ? getTargetUrl(marketPrefix, window.location.pathname)
    : window.location.href;

  const finalUrl = new URL(targetUrl);
  finalUrl.searchParams.set('country', marketItem.value);

  if (isRedirect) {
    const currentUrlWithParam = new URL(window.location.href);
    currentUrlWithParam.searchParams.set('country', marketItem.value);

    handleEvent({
      prefix: marketPrefix,
      link: { href: finalUrl.toString() },
      callback: (url) => { window.open(url, openInNewTab ? '_blank' : '_self'); },
      fallbackUrl: currentUrlWithParam.toString(),
    });
  } else {
    window.open(finalUrl.toString(), openInNewTab ? '_blank' : '_self');
  }
}

function getMarketOptions(markets, currentLang) {
  const supportedRegions = currentLang.supportedRegions?.split(',').map((r) => r.trim().toLowerCase()) || [];
  const langKey = getLangKeyForMarket(currentLang);
  return markets
    .filter((market) => supportedRegions.includes(market.marketCode?.toLowerCase()))
    .map((market) => ({
      label: getMarketLabel(market, langKey),
      value: market.marketCode,
      marketCode: market.marketCode,
      prefix: market.prefix,
      url: '#',
    }));
}

function createDropdown(
  label,
  placeholder,
  items,
  onSelect,
  noResultLabel,
  isSelected,
  filterOptions,
  showGlobe,
  analyticsLabel,
  getAnalyticsSelectEventName,
) {
  const container = createTag('div', { class: 'market-selector-dropdown' });
  const button = createTag('button', {
    class: 'market-selector-button',
    'aria-haspopup': 'listbox',
    'aria-expanded': 'false',
    type: 'button',
    tabindex: '0',
  });
  button.innerHTML = `${showGlobe ? GLOBE_SVG : ''}<span>${label}</span>`;

  const popover = createTag('div', { class: 'market-selector-popover' });
  const dragHandle = createTag('div', { class: 'market-selector-drag-handle' });
  const dragHandleBar = createTag('div', { class: 'market-selector-drag-handle-bar' });
  dragHandle.append(dragHandleBar);
  const searchContainer = createTag('div', { class: 'market-selector-search' });
  const searchInputWrapper = createTag('div', { class: 'search-input-wrapper' });

  const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  Object.entries({
    class: 'search-icon',
    width: '16',
    height: '16',
    viewBox: '0 0 16 16',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
  }).forEach(([k, v]) => searchIcon.setAttribute(k, v));
  searchIcon.innerHTML = SEARCH_ICON_INNER;

  const list = createTag('ul', {
    class: 'market-selector-list',
    role: 'listbox',
    id: 'market-selector-listbox',
    tabindex: '0',
  });
  const searchInput = createTag('input', {
    type: 'text',
    placeholder,
    class: 'search-input',
    'aria-autocomplete': 'list',
    'aria-controls': 'market-selector-listbox',
    autocomplete: 'off',
  });

  searchInputWrapper.append(searchIcon, searchInput);
  searchContainer.append(searchInputWrapper);

  popover.append(dragHandle, searchContainer, list);
  container.append(button, popover);

  const closePopoverElement = (popoverEl) => {
    popoverEl.style.display = 'none';
    delete popoverEl.dataset.open;
    popoverEl.classList.remove('fixed-height');
    popoverEl.style.removeProperty('--dropdown-initial-height');
    popoverEl.style.removeProperty('transform');
    popoverEl.style.removeProperty('transition');
    const containerEl = popoverEl.parentElement;
    const btn = containerEl?.querySelector('.market-selector-button');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    const listEl = popoverEl.querySelector('.market-selector-list');
    if (listEl) listEl.removeAttribute('aria-activedescendant');
    if (analyticsLabel) sendAnalyticsEvent(`${analyticsLabel}:dismissed`, 'dismissal');
  };

  const renderItems = (filteredItems) => {
    list.innerHTML = '';
    if (filteredItems.length === 0) {
      const noResult = createTag('li', { class: 'market-selector-item no-search-result-text' }, noResultLabel);
      list.append(noResult);
      return;
    }
    filteredItems.forEach((item, idx) => {
      const selected = isSelected(item);
      const li = createTag('li', {
        class: `market-selector-item${selected ? ' selected' : ''}`,
        role: 'none',
        id: `market-option-${idx}`,
      });
      const a = createTag('a', {
        class: 'market-selector-link',
        role: 'option',
        'aria-selected': selected ? 'true' : 'false',
        href: item.url || '#',
        'data-market': item.marketCode || '',
        tabindex: '-1',
      });

      a.innerHTML = `<span class="market-selector-item-text">${item.label}</span>${selected ? CHECKMARK_SVG : ''}`;

      a.addEventListener('mouseenter', () => {
        if (item.url && item.url !== '#' && item.value) {
          handleEvent({
            prefix: item.value,
            link: { href: item.url },
            callback: (url) => {
              if (a.href !== url) a.href = url;
            },
          });
        }
      });

      a.addEventListener('click', (e) => {
        e.preventDefault();
        const openInNewTab = e.ctrlKey || e.metaKey;
        if (getAnalyticsSelectEventName) {
          const eventName = getAnalyticsSelectEventName(item);
          if (eventName) sendAnalyticsEvent(eventName);
        }
        onSelect(item, { openInNewTab });
        if (!openInNewTab) {
          button.querySelector('span').textContent = item.label;
          closePopoverElement(popover);
        }
      });

      li.append(a);
      list.append(li);
    });
  };

  renderItems(items);

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = popover.dataset.open === 'true';
    if (isOpen) {
      closePopoverElement(popover);
    } else {
      if (analyticsLabel) sendAnalyticsEvent(`${analyticsLabel}:opened`);
      document.querySelectorAll('.market-selector-popover[data-open="true"]').forEach(closePopoverElement);
      popover.style.display = 'block';
      popover.style.transform = '';
      popover.style.transition = '';
      popover.dataset.open = 'true';
      button.setAttribute('aria-expanded', 'true');
      searchInput.value = '';
      renderItems(items);
      requestAnimationFrame(() => {
        const popoverHeight = popover.offsetHeight;
        popover.style.setProperty('--dropdown-initial-height', `${popoverHeight}px`);
        popover.classList.add('fixed-height');
        popover.setAttribute('tabindex', '-1');
        const selectedLi = list.querySelector('.market-selector-item.selected');
        const firstLi = list.querySelector('.market-selector-item');
        const activeLi = selectedLi || firstLi;
        const activeLink = activeLi?.querySelector('.market-selector-link');
        list.setAttribute('aria-activedescendant', activeLi?.id || '');
        if (activeLink) activeLink.focus();
      });
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === ' ') e.stopPropagation();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const selected = list.querySelector('.market-selector-item.selected .market-selector-link');
      const first = list.querySelector('.market-selector-link');
      const toFocus = selected || first;
      if (toFocus) {
        toFocus.focus();
        list.setAttribute('aria-activedescendant', toFocus.parentElement.id);
      }
    }
  });

  searchInput.addEventListener('focus', () => {
    if (miloLangIsKeyboard) {
      searchInputWrapper?.classList.add('focus-visible');
    } else {
      searchInputWrapper?.classList.remove('focus-visible');
    }
  });
  searchInput.addEventListener('blur', () => {
    searchInputWrapper?.classList.remove('focus-visible');
  });

  searchInput.addEventListener('input', debounce((e) => {
    const searchTerm = normalizeText(e.target.value.trim());
    const filtered = items.filter((item) => filterOptions(item, searchTerm));
    renderItems(filtered);
  }, 200));

  list.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if (!focused.classList.contains('market-selector-link')) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = focused.parentElement.nextElementSibling?.querySelector('.market-selector-link');
      if (next) {
        next.focus();
        list.setAttribute('aria-activedescendant', next.parentElement.id);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = focused.parentElement.previousElementSibling?.querySelector('.market-selector-link');
      if (prev) {
        prev.focus();
        list.setAttribute('aria-activedescendant', prev.parentElement.id);
      } else {
        searchInput.focus();
        list.setAttribute('aria-activedescendant', '');
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.market-selector-dropdown')) {
      document.querySelectorAll('.market-selector-popover[data-open="true"]').forEach(closePopoverElement);
    }
  });

  popover.addEventListener('focusout', (e) => {
    const nextFocused = e.relatedTarget;
    if (!popover.contains(nextFocused) && nextFocused !== button) {
      closePopoverElement(popover);
    }
  });

  popover.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePopoverElement(popover);
      button.focus();
    }
  });
  // Mobile: drag handle or list-at-top swipe down to close; popover follows finger, then animates
  const MIN_DRAG_PX = 5;
  const SWIPE_DOWN_THRESHOLD = 100;
  const CLOSE_ANIMATION_MS = 300;
  let dragStartY = 0;
  let dragTouchId = null;
  let isDraggingHandle = false;
  let hasDraggedHandle = false;
  let listDragStartY = 0;
  let listTouchId = null;
  let listDragActive = false;
  let hasDraggedList = false;
  const dragListeners = {};

  function removeDragListeners() {
    document.removeEventListener('touchmove', dragListeners.move);
    document.removeEventListener('touchend', dragListeners.end);
    document.removeEventListener('touchcancel', dragListeners.end);
  }

  function onTouchMove(e) {
    if (!isDraggingHandle || dragTouchId == null) return;
    const touch = Array.from(e.touches).find((t) => t.identifier === dragTouchId);
    if (!touch) return;
    const deltaY = Math.max(0, touch.clientY - dragStartY);
    if (deltaY > MIN_DRAG_PX) hasDraggedHandle = true;
    popover.style.transition = 'none';
    popover.style.transform = `translateY(${deltaY}px)`;
  }

  function finishDragGesture(clientY, startY, fromHandle) {
    const deltaY = Math.max(0, clientY - startY);
    const hasDragged = fromHandle ? hasDraggedHandle : hasDraggedList;
    isDraggingHandle = false;
    dragTouchId = null;
    listDragActive = false;
    hasDraggedHandle = false;
    hasDraggedList = false;
    if (fromHandle) removeDragListeners();

    popover.style.transition = `transform ${CLOSE_ANIMATION_MS}ms ease`;

    if (hasDragged && deltaY >= SWIPE_DOWN_THRESHOLD) {
      popover.style.transform = 'translateY(100%)';
      popover.addEventListener('transitionend', function onClosed() {
        popover.removeEventListener('transitionend', onClosed);
        closePopoverElement(popover);
        button.focus();
      }, { once: true });
    } else {
      popover.style.transform = 'translateY(0)';
    }
  }

  function onDragEnd(clientY) {
    if (!isDraggingHandle) return;
    finishDragGesture(clientY, dragStartY, true);
  }

  function onTouchEnd(e) {
    if (!e.changedTouches?.length || e.changedTouches[0].identifier !== dragTouchId) return;
    if (popover.dataset.open !== 'true') {
      isDraggingHandle = false;
      dragTouchId = null;
      removeDragListeners();
      return;
    }
    onDragEnd(e.changedTouches[0].clientY);
  }

  dragListeners.move = onTouchMove;
  dragListeners.end = onTouchEnd;

  dragHandle.addEventListener('touchstart', (e) => {
    if (e.touches.length === 0) return;
    isDraggingHandle = true;
    hasDraggedHandle = false;
    dragStartY = e.touches[0].clientY;
    dragTouchId = e.touches[0].identifier;
    document.addEventListener('touchmove', dragListeners.move, { passive: true });
    document.addEventListener('touchend', dragListeners.end, { passive: true });
    document.addEventListener('touchcancel', dragListeners.end, { passive: true });
  }, { passive: true });

  dragHandle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDraggingHandle = true;
    hasDraggedHandle = false;
    dragStartY = e.clientY;

    const onMouseMove = (moveEvent) => {
      if (!isDraggingHandle) return;
      const deltaY = Math.max(0, moveEvent.clientY - dragStartY);
      if (deltaY > MIN_DRAG_PX) hasDraggedHandle = true;
      popover.style.transition = 'none';
      popover.style.transform = `translateY(${deltaY}px)`;
    };

    const onMouseUp = (upEvent) => {
      finishDragGesture(upEvent.clientY, dragStartY, true);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  });

  // List: when scrolled to top, swipe down to close (same animation as handle)
  function onListTouchMove(e) {
    if (listTouchId == null) return;
    const touch = Array.from(e.touches).find((t) => t.identifier === listTouchId);
    if (!touch) return;
    const deltaY = touch.clientY - listDragStartY;
    if (listDragActive) {
      if (deltaY > MIN_DRAG_PX) hasDraggedList = true;
      e.preventDefault();
      popover.style.transition = 'none';
      popover.style.transform = `translateY(${Math.max(0, deltaY)}px)`;
    } else if (list.scrollTop === 0 && deltaY > 0) {
      listDragActive = true;
      if (deltaY > MIN_DRAG_PX) hasDraggedList = true;
      e.preventDefault();
      popover.style.transition = 'none';
      popover.style.transform = `translateY(${deltaY}px)`;
    }
  }

  // List: when scrolled to top, swipe down to close
  function onListTouchEnd(e) {
    if (!e.changedTouches?.length || e.changedTouches[0].identifier !== listTouchId) return;
    const { clientY } = e.changedTouches[0];
    listTouchId = null;
    if (popover.dataset.open !== 'true') return;
    if (!listDragActive) return;
    finishDragGesture(clientY, listDragStartY, false);
  }

  list.addEventListener('touchstart', (e) => {
    if (e.touches.length === 0) return;
    listDragStartY = e.touches[0].clientY;
    listTouchId = e.touches[0].identifier;
    listDragActive = false;
    hasDraggedList = false;
  }, { passive: true });

  list.addEventListener('touchmove', onListTouchMove, { passive: false });

  list.addEventListener('touchend', onListTouchEnd, { passive: true });
  list.addEventListener('touchcancel', onListTouchEnd, { passive: true });

  return { container, updateItems: renderItems, button };
}

export default async function init(block) {
  const config = await getMarketConfig();
  if (!config || !config.languages?.length) return;

  const markets = await loadMarketsData();
  if (!markets?.length) return;

  const placeholders = block.querySelectorAll('p');
  const labels = {
    searchLanguage: placeholders[0]?.textContent.trim() || 'Search Language',
    searchMarket: placeholders[1]?.textContent.trim() || 'Search Market',
    noResultLanguage: placeholders[2]?.textContent.trim() || 'No results for language',
    noResultMarket: placeholders[3]?.textContent.trim() || 'No results for market',
  };

  const { locale, locales } = getConfig();
  const currentPrefix = locale?.prefix || '';
  const currentLang = config.languages.find((lang) => (
    (lang.prefix ? `/${lang.prefix}` : '') === currentPrefix
  )) || config.languages[0];

  const currentMarketCode = await getValidatedMarket();
  const commerceService = document.head.querySelector('mas-commerce-service');
  commerceService?.setAttribute('country', currentMarketCode.toUpperCase());

  const currentMarket = getCurrentMarket(markets, currentMarketCode, currentLang);

  const onLanguageSelect = (langOption, opts) => (
    handleLanguageSelect(langOption, config, currentMarketCode, opts)
  );
  const onMarketSelect = (marketItem, opts) => (
    handleMarketSelect(marketItem, config, currentLang, currentPrefix, opts)
  );

  const languageOptions = getLanguageOptions(config.languages, currentLang);
  const marketOptions = getMarketOptions(markets, currentLang);
  const marketLangKey = getLangKeyForMarket(currentLang);
  const currentMarketLabel = getMarketLabel(currentMarket, marketLangKey);

  const languageFilter = (item, searchTerm) => filterLang(item, searchTerm, locales);

  const langDropdown = createDropdown(
    currentLang.group || currentLang.nativeName || currentLang.langName,
    labels.searchLanguage,
    languageOptions,
    onLanguageSelect,
    labels.noResultLanguage,
    (item) => (item.value ? `/${item.value}` : '') === currentPrefix,
    languageFilter,
    true,
    'language-selector',
    (item) => `language-switch:${item.value || 'us'}`,
  );

  const marketDropdown = createDropdown(
    currentMarketLabel,
    labels.searchMarket,
    marketOptions,
    onMarketSelect,
    labels.noResultMarket,
    (item) => item.value === currentMarketCode,
    filterMarket,
    false,
    'market-selector',
    (item) => `market-switch:${item.value}`,
  );

  const wrapper = createTag('div', { class: 'market-selector-wrapper' });
  wrapper.append(langDropdown.container, marketDropdown.container);
  block.innerHTML = '';
  block.classList.add('feds-regionPicker-wrapper');
  block.append(wrapper);
}

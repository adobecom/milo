import {
  createTag,
  getConfig,
  getMetadata,
  setInternational,
  setMarket,
} from '../../utils/utils.js';
import { getMarketConfig, getValidatedMarket } from '../../utils/market.js';
import { replaceKeyArray } from '../../features/placeholders.js';

const CHECKMARK_SVG = '<svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#274DEA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const GLOBE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="market-selector-globe"><path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1C12.25 3.5 13.5 6.5 13.5 10C13.5 13.5 12.25 16.5 10 19C7.75 16.5 6.5 13.5 6.5 10C6.5 6.5 7.75 3.5 10 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SEARCH_ICON_INNER = '<path d="M14.8243 13.9758L10.7577 9.90923C11.5332 8.94809 12 7.72807 12 6.40005C12 3.31254 9.48755 0.800049 6.40005 0.800049C3.31254 0.800049 0.800049 3.31254 0.800049 6.40004C0.800049 9.48755 3.31254 12 6.40005 12C7.72807 12 8.9481 11.5331 9.90922 10.7577L13.9758 14.8243C14.093 14.9414 14.2461 15 14.4 15C14.5539 15 14.7071 14.9414 14.8243 14.8243C15.0586 14.5899 15.0586 14.2102 14.8243 13.9758ZM6.40005 10.8C3.97426 10.8 2.00005 8.82582 2.00005 6.40004C2.00005 3.97426 3.97426 2.00004 6.40005 2.00004C8.82583 2.00004 10.8 3.97426 10.8 6.40004C10.8 8.82582 8.82583 10.8 6.40005 10.8Z" fill="#666"/>';

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
  const currentPrefix = locale.prefix || '';
  const pathWithoutPrefix = currentPrefix && currentPath.startsWith(currentPrefix)
    ? currentPath.substring(currentPrefix.length)
    : currentPath;

  const newPath = targetPrefix ? `/${targetPrefix}${pathWithoutPrefix}` : pathWithoutPrefix;
  const url = `${window.location.origin}${newPath.replace(/\/+$/, '') || '/'}`;
  return `${url}${window.location.search}${window.location.hash}`;
}

const queriedPages = [];

function handleEvent({ prefix, link, callback, fallbackUrl } = {}) {
  if (typeof callback !== 'function') return;
  const config = getConfig();
  const { baseSitePath } = config;
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

function isIetfMatchForPrefix(prefix, searchNormalized) {
  const { locales } = getConfig();
  if (!locales || !prefix) return false;
  const localeKey = prefix.replace(/^\//, '');
  const fullIetf = locales[localeKey]?.ietf?.toLowerCase();
  const ietfLang = fullIetf?.split('-')[0];
  return ietfLang && fullIetf?.includes(searchNormalized);
}

function filterMarket(item, term) {
  return isNameMatch(item.label, term);
}

function filterLang(item, term) {
  const labelMatch = isNameMatch(item.label, term);
  const englishMatch = isNameMatch(item.englishName, term);
  const ietfMatch = isIetfMatchForPrefix(item.value, term);
  return labelMatch || englishMatch || ietfMatch;
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
      englishName: lang.group || lang.languageName,
      value: targetPrefix,
      url: getTargetUrl(targetPrefix, window.location.pathname),
    });
  });
  return languageOptions;
}

function handleLanguageSelect(langOption, config, currentMarketCode) {
  const selectedLang = config.languages.find((lang) => lang.prefix === langOption.value);
  const supportedMarkets = selectedLang.markets.split(',').map((market) => market.trim());
  const targetMarketCode = supportedMarkets.includes(currentMarketCode)
    ? currentMarketCode
    : selectedLang.defaultMarket;

  setMarket(targetMarketCode);
  setInternational(selectedLang.prefix || 'us');

  const finalUrl = new URL(langOption.url);
  finalUrl.searchParams.set('country', targetMarketCode);

  handleEvent({
    prefix: selectedLang.prefix,
    link: { href: finalUrl.toString() },
    callback: (url) => { window.location.href = url; },
  });
}

function handleMarketSelect(marketItem, config, currentLang, currentPrefix) {
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

  if (marketPrefix === undefined && locales[regionalPrefix]) {
    marketPrefix = regionalPrefix;
  }

  setMarket(marketItem.value);

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
      callback: (url) => { window.location.href = url; },
      fallbackUrl: currentUrlWithParam.toString(),
    });
  } else {
    window.location.href = finalUrl.toString();
  }
}

function getMarketOptions(markets, currentLang) {
  const supportedMarkets = currentLang.markets.split(',').map((market) => market.trim());
  return markets
    .filter((market) => supportedMarkets.includes(market.marketCode))
    .map((market) => ({
      label: market.marketName,
      value: market.marketCode,
      marketCode: market.marketCode,
      prefix: market.prefix,
      url: '#',
      dir: market.dir,
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
) {
  const container = createTag('div', { class: 'market-selector-dropdown' });
  const button = createTag('button', {
    class: 'market-selector-button',
    'aria-haspopup': 'listbox',
    'aria-expanded': 'false',
    type: 'button',
    tabindex: '0',
  });
  button.innerHTML = showGlobe
    ? `${GLOBE_SVG}<span>${label}</span><span class="market-selector-arrow"></span>`
    : `<span>${label}</span><span class="market-selector-arrow"></span>`;

  const popover = createTag('div', { class: 'market-selector-popover' });
  const dragHandle = createTag('div', { class: 'market-selector-drag-handle' });
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
    const containerEl = popoverEl.parentElement;
    const btn = containerEl?.querySelector('.market-selector-button');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    const listEl = popoverEl.querySelector('.market-selector-list');
    if (listEl) listEl.removeAttribute('aria-activedescendant');
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
        ...(item.dir && { dir: item.dir }),
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
        if (e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        onSelect(item);
        button.querySelector('span').textContent = item.label;
        closePopoverElement(popover);
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
      document.querySelectorAll('.market-selector-popover[data-open="true"]').forEach(closePopoverElement);
      popover.style.display = 'block';
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

  searchInput.addEventListener('input', (e) => {
    const term = normalizeText(e.target.value.trim());
    const filtered = items.filter((item) => filterOptions(item, term));
    renderItems(filtered);
  });

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

  return { container, updateItems: renderItems, button };
}

export default async function init(block) {
  const config = await getMarketConfig();
  if (!config) return;

  const miloConfig = getConfig();
  const [
    searchLanguage,
    searchMarket,
    noResultLanguage,
    noResultMarket,
  ] = await replaceKeyArray([
    'search-language',
    'search-market',
    'no-results-language',
    'no-results-market',
  ], miloConfig);

  const labels = {
    searchLanguage,
    searchMarket,
    noResultLanguage,
    noResultMarket,
  };

  const { locale } = miloConfig;
  const currentPrefix = locale.prefix || '';
  const currentLang = config.languages.find((lang) => (
    (lang.prefix ? `/${lang.prefix}` : '') === currentPrefix
  )) || config.languages[0];

  const currentMarketCode = await getValidatedMarket();
  const currentMarket = getCurrentMarket(config.markets, currentMarketCode, currentLang);

  const onLanguageSelect = (langOption) => (
    handleLanguageSelect(langOption, config, currentMarketCode)
  );
  const onMarketSelect = (marketItem) => (
    handleMarketSelect(marketItem, config, currentLang, currentPrefix)
  );

  const languageOptions = getLanguageOptions(config.languages, currentLang);
  const marketOptions = getMarketOptions(config.markets, currentLang);

  const langDropdown = createDropdown(
    currentLang.group || currentLang.nativeName || currentLang.languageName,
    labels.searchLanguage,
    languageOptions,
    onLanguageSelect,
    labels.noResultLanguage,
    (item) => (item.value ? `/${item.value}` : '') === currentPrefix,
    filterLang,
    true,
  );

  const marketDropdown = createDropdown(
    currentMarket.marketName,
    labels.searchMarket,
    marketOptions,
    onMarketSelect,
    labels.noResultMarket,
    (item) => item.value === currentMarketCode,
    filterMarket,
    false,
  );

  const wrapper = createTag('div', { class: 'market-selector-wrapper' });
  wrapper.append(langDropdown.container, marketDropdown.container);
  block.innerHTML = '';
  block.classList.add('feds-regionPicker-wrapper');
  block.append(wrapper);
}

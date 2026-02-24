import {
  createTag,
  getConfig,
  getMetadata,
  getCountry,
  getFederatedContentRoot,
  setInternational,
} from '../../utils/utils.js';

const MARKET_COOKIE = 'market';
const PAGE_URL = new URL(window.location.href);
const CHECKMARK_SVG = '<svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#274DEA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const GLOBE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="market-selector-globe"><path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 1C12.25 3.5 13.5 6.5 13.5 10C13.5 13.5 12.25 16.5 10 19C7.75 16.5 6.5 13.5 6.5 10C6.5 6.5 7.75 3.5 10 1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const SEARCH_ICON_INNER = '<path d="M14.8243 13.9758L10.7577 9.90923C11.5332 8.94809 12 7.72807 12 6.40005C12 3.31254 9.48755 0.800049 6.40005 0.800049C3.31254 0.800049 0.800049 3.31254 0.800049 6.40004C0.800049 9.48755 3.31254 12 6.40005 12C7.72807 12 8.9481 11.5331 9.90922 10.7577L13.9758 14.8243C14.093 14.9414 14.2461 15 14.4 15C14.5539 15 14.7071 14.9414 14.8243 14.8243C15.0586 14.5899 15.0586 14.2102 14.8243 13.9758ZM6.40005 10.8C3.97426 10.8 2.00005 8.82582 2.00005 6.40004C2.00005 3.97426 3.97426 2.00004 6.40005 2.00004C8.82583 2.00004 10.8 3.97426 10.8 6.40004C10.8 8.82582 8.82583 10.8 6.40005 10.8Z" fill="#666"/>';

function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];
}

function setCookie(name, value, days = 365) {
  const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};max-age=${maxAge};path=/;${domain}`;
}

function getMarketsUrl() {
  const config = getConfig();
  const { contentRoot } = config;
  const sourceFromUrl = PAGE_URL.searchParams.get('marketSelector');
  const marketSelectorKey = sourceFromUrl
      || getMetadata('marketselector')
      || config.marketSelector
      || config.marketselector;

  if (marketSelectorKey) {
    return `${contentRoot ?? ''}/market-selector/market-selector-${marketSelectorKey}.json`;
  }
  return `${getFederatedContentRoot()}/federal/market-selector/market-selector.json`;
}

async function loadMarketConfig() {
  const marketsUrl = getMarketsUrl();
  try {
    const resp = await fetch(marketsUrl);
    if (!resp.ok) throw new Error('Failed to load market config');
    const json = await resp.json();
    return {
      languages: json.languages?.data || [],
      markets: json.markets?.data || [],
    };
  } catch (e) {
    console.error('Market Selector: Error loading config', e);
    return { languages: [], markets: [] };
  }
}

function getPrefix(pathname) {
  const firstSegment = pathname.split('/')[1];
  if (!firstSegment || firstSegment.length > 3 || firstSegment.includes('.')) return '';
  return firstSegment;
}

function getTargetUrl(targetPrefix, currentPath) {
  const currentPrefix = getPrefix(currentPath);
  const pathWithoutPrefix = currentPrefix
    ? currentPath.replace(new RegExp(`^/${currentPrefix}(/|$)`), '/')
    : currentPath;

  const sanitizedPath = pathWithoutPrefix.startsWith('/') ? pathWithoutPrefix : `/${pathWithoutPrefix}`;
  const newPath = targetPrefix ? `/${targetPrefix}${sanitizedPath}` : sanitizedPath;
  const url = `${window.location.origin}${newPath.replace(/\/+$/, '') || '/'}`;
  return `${url}${window.location.search}${window.location.hash}`;
}

const queriedPages = [];

function handleEvent({ prefix, link, callback } = {}) {
  if (typeof callback !== 'function') return;
  const config = getConfig();
  const { baseSitePath } = config;
  const fallbackUrl = `${window.location.origin}${prefix ? `/${prefix}` : ''}${getMetadata('base-site-path') || baseSitePath || ''}/`;
  const urlForCheck = link.href;
  const existingPage = queriedPages.find((page) => page.href === urlForCheck);
  if (existingPage) {
    callback(existingPage.ok ? link.href : fallbackUrl);
    return;
  }
  fetch(urlForCheck, { method: 'HEAD' }).then((resp) => {
    queriedPages.push({ href: urlForCheck, ok: resp.ok });
    if (!resp.ok) throw new Error('request failed');
    callback(link.href);
  }).catch(() => {
    queriedPages.push({ href: urlForCheck, ok: false });
    callback(fallbackUrl);
  });
}

function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function createDropdown(label, placeholder, items, onSelect, noResultLabel, isSelected) {
  const container = createTag('div', { class: 'market-selector-dropdown' });
  const button = createTag('button', {
    class: 'market-selector-button',
    'aria-haspopup': 'listbox',
    'aria-expanded': 'false',
    type: 'button',
  });
  button.innerHTML = `${GLOBE_SVG}<span>${label}</span><span class="market-selector-arrow"></span>`;

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

  const searchInput = createTag('input', {
    type: 'text',
    placeholder,
    class: 'search-input',
    'aria-autocomplete': 'list',
    autocomplete: 'off',
  });

  searchInputWrapper.append(searchIcon, searchInput);
  searchContainer.append(searchInputWrapper);

  const list = createTag('ul', { class: 'market-selector-list', role: 'listbox' });

  popover.append(dragHandle, searchContainer, list);
  container.append(button, popover);

  const renderItems = (filteredItems) => {
    list.innerHTML = '';
    if (filteredItems.length === 0) {
      const noResult = createTag('li', { class: 'market-selector-no-result' }, noResultLabel);
      list.append(noResult);
      return;
    }
    filteredItems.forEach((item, idx) => {
      const selected = isSelected(item);
      const li = createTag('li', { class: 'market-selector-item-wrapper', role: 'none', id: `market-option-${idx}` });
      const a = createTag('a', {
        class: `market-selector-item${selected ? ' is-selected' : ''}`, 
        role: 'option',
        'aria-selected': selected ? 'true' : 'false',
        href: item.url || '#',
        'data-market': item.marketCode || '',
      });

      a.innerHTML = `<span class="market-selector-item-text">${item.label}</span>${selected ? CHECKMARK_SVG : ''}`;

      a.addEventListener('mouseover', () => {
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
        popover.classList.remove('is-open');
        button.setAttribute('aria-expanded', 'false');
      });

      li.append(a);
      list.append(li);
    });
  };

  renderItems(items);

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = popover.classList.toggle('is-open');
    button.setAttribute('aria-expanded', isOpen);
    if (isOpen) {
      // Close other open drop-ups
      document.querySelectorAll('.market-selector-popover.is-open').forEach((openPopover) => {
        if (openPopover !== popover) {
          openPopover.classList.remove('is-open');
          openPopover.parentElement.querySelector('.market-selector-button').setAttribute('aria-expanded', 'false');
        }
      });

      searchInput.value = '';
      renderItems(items);
      requestAnimationFrame(() => {
        const height = popover.offsetHeight;
        popover.style.setProperty('--dropdown-initial-height', `${height}px`);
        popover.classList.add('fixed-height');
        popover.setAttribute('tabindex', '-1');
        popover.focus();
        searchInput.focus();
      });
    } else {
      popover.classList.remove('fixed-height');
      popover.style.removeProperty('--dropdown-initial-height');
    }
  });

  searchInput.addEventListener('click', (e) => e.stopPropagation());
  searchInput.addEventListener('mousedown', (e) => e.stopPropagation());
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === ' ') e.stopPropagation();
  });
  searchInput.addEventListener('input', (e) => {
    const term = normalizeText(e.target.value.trim());
    const filtered = items.filter((item) => {
      const labelMatch = normalizeText(item.label).includes(term);
      const valueMatch = item.value && normalizeText(item.value).includes(term);
      const codeMatch = item.marketCode && normalizeText(item.marketCode).includes(term);
      return labelMatch || valueMatch || codeMatch;
    });
    renderItems(filtered);
  });

  document.addEventListener('click', (e) => {
    if (!container.contains(e.target)) {
      popover.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  popover.addEventListener('focusout', (e) => {
    const nextFocused = e.relatedTarget;
    if (!popover.contains(nextFocused) && nextFocused !== button) {
      popover.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  popover.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      popover.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });

  return { container, updateItems: renderItems, button };
}

export default async function init(block) {
  const config = await loadMarketConfig();
  if (!config.languages.length || !config.markets.length) return;

  const placeholders = block.querySelectorAll('p');
  const labels = {
    searchLanguage: placeholders[0]?.textContent.trim() || 'Search Language',
    searchMarket: placeholders[1]?.textContent.trim() || 'Search Market',
    noResultLanguage: placeholders[2]?.textContent.trim() || 'No results for language',
    noResultMarket: placeholders[3]?.textContent.trim() || 'No results for market',
  };

  let currentMarketCode = getCookie(MARKET_COOKIE);
  if (!currentMarketCode) {
    currentMarketCode = getCountry()?.toLowerCase() || 'us';
    setCookie(MARKET_COOKIE, currentMarketCode);
  }

  const currentPrefix = getPrefix(window.location.pathname);
  const currentLang = config.languages.find((l) => l.prefix === currentPrefix) || config.languages[0];
  const currentMarket = config.markets.find((m) => m.marketCode === currentMarketCode)
    || config.markets.find((m) => m.marketCode === currentLang.defaultMarket)
    || config.markets[0];

  const onLanguageSelect = (langItem) => {
    const selectedLang = config.languages.find((l) => l.prefix === langItem.value);
    const supportedMarkets = selectedLang.markets.split(',').map((m) => m.trim());
    const targetMarketCode = supportedMarkets.includes(currentMarketCode)
      ? currentMarketCode
      : selectedLang.defaultMarket;

    setCookie(MARKET_COOKIE, targetMarketCode);
    setInternational(selectedLang.prefix || 'us');
    handleEvent({
      prefix: selectedLang.prefix,
      link: { href: langItem.url },
      callback: (url) => {
        window.location.href = url;
      },
    });
  };

  const onMarketSelect = (marketItem) => {
    setCookie(MARKET_COOKIE, marketItem.value);
    window.location.reload();
  };

  const langItems = config.languages.map((l) => ({
    label: l.languageName,
    value: l.prefix,
    url: getTargetUrl(l.prefix, window.location.pathname),
  }));

  const supportedMarkets = currentLang.markets.split(',').map((m) => m.trim());
  const marketItems = config.markets
    .filter((m) => supportedMarkets.includes(m.marketCode))
    .map((m) => ({
      label: `${m.marketName} - ${m.currencyName} ${m.currencySymbol || ''}`.trim(),
      value: m.marketCode,
      marketCode: m.marketCode,
      url: '#',
    }));

  const langDropdown = createDropdown(
    currentLang.languageName,
    labels.searchLanguage,
    langItems,
    onLanguageSelect,
    labels.noResultLanguage,
    (item) => item.value === currentPrefix,
  );

  const marketDropdown = createDropdown(
    `${currentMarket.marketName} - ${currentMarket.currencyName} ${currentMarket.currencySymbol || ''}`.trim(),
    labels.searchMarket,
    marketItems,
    onMarketSelect,
    labels.noResultMarket,
    (item) => item.value === currentMarketCode,
  );

  const wrapper = createTag('div', { class: 'market-selector-wrapper' });
  wrapper.append(langDropdown.container, marketDropdown.container);
  block.innerHTML = '';
  block.append(wrapper);
}

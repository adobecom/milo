import { createTag, getConfig, getLanguage, getFederatedContentRoot } from '../../utils/utils.js';

const queriedPages = [];
const CHECKMARK_SVG = '<svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#274DEA" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

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

const langMapToEnglishPromise = ((async () => {
  try {
    const response = await fetch(`${getFederatedContentRoot()}/federal/assets/data/languages-mapping.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const configJson = await response.json();
    return configJson.data || [];
  } catch (e) {
    window.lana?.log('Failed to load language-mapping.json:', e);
    return [];
  }
}))();

let langMapToEnglish = [];

function stripQueryAndHash(url) {
  try {
    const u = new URL(url);
    u.search = '';
    u.hash = '';
    return u.toString();
  } catch {
    return url.split('?')[0].split('#')[0];
  }
}

function handleEvent({ prefix, link, callback } = {}) {
  if (typeof callback !== 'function') return;
  const urlForCheck = stripQueryAndHash(link.href);
  const existingPage = queriedPages.find((page) => page.href === urlForCheck);
  if (existingPage) {
    callback(existingPage.ok
      ? link.href
      : `${prefix ? `/${prefix}` : ''}/`);
    return;
  }
  fetch(urlForCheck, { method: 'HEAD' }).then((resp) => {
    queriedPages.push({ href: urlForCheck, ok: resp.ok });
    if (!resp.ok) throw new Error('request failed');
    callback(link.href);
  }).catch(() => {
    callback(`${prefix ? `/${prefix}` : ''}/`);
  });
}

const getLanguages = (links, languages, locales) => Array.from(links).map((link) => {
  let pathname = link.getAttribute('href');
  if (pathname.startsWith('http')) {
    try { pathname = new URL(pathname).pathname; } catch (e) { /* ignore */ }
  }
  const langObj = getLanguage(languages, locales, pathname);
  return {
    name: link.innerText,
    url: link.href,
    prefix: langObj.prefix.replace('/', ''),
    langObj,
  };
});

const getCurrentLanguage = (languagesList, path) => {
  const currentPath = path || window.location.pathname;
  const found = languagesList.find((lang) => {
    if (!lang.prefix) {
      return !languagesList.some((l) => l.prefix && currentPath.startsWith(`/${l.prefix}/`));
    }
    return new RegExp(`^/${lang.prefix}(/|$)`).test(currentPath);
  });
  return found || languagesList[0];
};

const scrollSelectedIntoView = (selectedLangItem, languageList) => {
  if (selectedLangItem) {
    setTimeout(() => {
      const scrollTop = selectedLangItem.offsetTop
        - (languageList.clientHeight / 2)
        + (selectedLangItem.clientHeight / 2);
      languageList.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth',
      });
    }, 0);
  }
};

function createDropdownElements(placeholderText) {
  const dropdown = createTag('div', { class: 'language-dropdown', style: 'display: none;' });
  const dragHandle = createTag('div', { class: 'drag-handle' });
  dropdown.appendChild(dragHandle);
  const searchContainer = createTag('div', { class: 'search-container' });
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
  searchIcon.innerHTML = `
    <path d="M14.8243 13.9758L10.7577 9.90923C11.5332 8.94809 12 7.72807 12 6.40005C12 3.31254 9.48755 0.800049 6.40005 0.800049C3.31254 0.800049 0.800049 3.31254 0.800049 6.40004C0.800049 9.48755 3.31254 12 6.40005 12C7.72807 12 8.9481 11.5331 9.90922 10.7577L13.9758 14.8243C14.093 14.9414 14.2461 15 14.4 15C14.5539 15 14.7071 14.9414 14.8243 14.8243C15.0586 14.5899 15.0586 14.2102 14.8243 13.9758ZM6.40005 10.8C3.97426 10.8 2.00005 8.82582 2.00005 6.40004C2.00005 3.97426 3.97426 2.00004 6.40005 2.00004C8.82583 2.00004 10.8 3.97426 10.8 6.40004C10.8 8.82582 8.82583 10.8 6.40005 10.8Z" fill="#666"/>
  `;
  const searchInput = createTag('input', {
    type: 'text',
    placeholder: placeholderText,
    class: 'search-input',
    id: 'language-selector-search',
    'aria-autocomplete': 'list',
    'aria-controls': 'language-selector-listbox',
    autocomplete: 'off',
  });
  searchInputWrapper.appendChild(searchIcon);
  searchInputWrapper.appendChild(searchInput);
  searchContainer.appendChild(searchInputWrapper);
  const languageList = createTag('ul', {
    class: 'language-list',
    id: 'language-selector-listbox',
    role: 'listbox',
    tabindex: '0',
    'aria-label': placeholderText,
  });

  return { dropdown, searchContainer, languageList };
}

const normalizeText = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const normalizedCache = new Map();
const getNormalizedText = (text) => {
  if (!normalizedCache.has(text)) {
    normalizedCache.set(text, normalizeText(text));
  }
  return normalizedCache.get(text);
};

const isIsoCodeMatch = (langObj, searchLower) => {
  const isoCode = langObj?.language?.toLowerCase();
  return isoCode && (isoCode === searchLower || isoCode.includes(searchLower));
};

const isNativeNameMatch = (name, searchLower, searchNormalized) => {
  const nativeName = name.toLowerCase();
  const nativeNameNormalized = getNormalizedText(name);
  return nativeName.includes(searchLower) || nativeNameNormalized.includes(searchNormalized);
};

const isIetfMatch = (langObj, searchLower) => {
  const ietfLang = langObj?.ietf?.split('-')[0]?.toLowerCase();
  const fullIetf = langObj?.ietf?.toLowerCase();
  return ietfLang && (searchLower === ietfLang || ietfLang.includes(searchLower)
    || (fullIetf && fullIetf.includes(searchLower)));
};

const isEnglishMappingMatch = (name, searchLower, searchNormalized, mappingData) => {
  if (mappingData.length === 0) return false;

  const nativeName = name.toLowerCase();
  const nativeNameNormalized = getNormalizedText(name);

  const englishMapping = mappingData.find((mapping) => {
    const mappingEnglish = mapping.English.toLowerCase();
    const mappingEnglishNormalized = getNormalizedText(mapping.English);
    return mappingEnglish.includes(searchLower)
      || mappingEnglishNormalized.includes(searchNormalized);
  });

  return englishMapping && (englishMapping.Native.toLowerCase() === nativeName
    || getNormalizedText(englishMapping.Native) === nativeNameNormalized);
};

function renderLanguages({
  languageList,
  languagesList,
  currentLang,
  selectedLangItemRef,
  activeIndexRef,
}) {
  return (searchTerm = '') => {
    if (!languagesList.length) return [];
    languageList.innerHTML = '';

    const searchLower = searchTerm.trim().toLowerCase();
    const searchNormalized = getNormalizedText(searchTerm.trim());

    // eslint-disable-next-line max-len
    const filteredLanguages = languagesList.filter((lang) => isNativeNameMatch(lang.name, searchLower, searchNormalized)
      || isIsoCodeMatch(lang.langObj, searchLower)
      || isIetfMatch(lang.langObj, searchLower)
      || isEnglishMappingMatch(lang.name, searchLower, searchNormalized, langMapToEnglish));
    const fragment = document.createDocumentFragment();
    filteredLanguages.forEach((lang, idx) => {
      const langItem = createTag('li', {
        class: 'language-item',
        id: `language-option-${idx}`,
        role: 'none',
      });
      if (lang.name === currentLang.name) {
        langItem.classList.add('selected');
        selectedLangItemRef.current = langItem;
        if (activeIndexRef.current === -1) activeIndexRef.current = idx;
      }
      const langLink = createTag('a', {
        href: `${window.location.origin}${lang.prefix ? `/${lang.prefix}${window.location.pathname.replace(/^\/[a-zA-Z-]+/, '')}` : window.location.pathname.replace(/^\/[a-zA-Z-]+/, '')}`,
        class: 'language-link',
        role: 'option',
        'aria-selected': lang.name === currentLang.name ? 'true' : 'false',
        tabindex: '-1',
      });
      langLink.innerHTML = `
        <span class="language-name">${lang.name}</span>
        ${lang.name === currentLang.name ? CHECKMARK_SVG : ''}
      `;
      langLink.addEventListener('click', (e) => {
        e.preventDefault();
        const { pathname, href } = window.location;
        const currentLangForPath = getCurrentLanguage(filteredLanguages);
        const currentPrefix = currentLangForPath && currentLangForPath.prefix ? `/${currentLangForPath.prefix}` : '';
        const hasPrefix = currentPrefix && pathname.startsWith(`${currentPrefix}/`);
        const path = href.replace(window.location.origin + (hasPrefix ? currentPrefix : ''), '').replace('#langnav', '');
        const newPath = lang.prefix ? `/${lang.prefix}${path}` : path;
        const fullUrl = `${window.location.origin}${newPath}`;
        handleEvent({
          prefix: lang.prefix,
          link: { href: fullUrl },
          callback: (url) => {
            window.open(url, e.ctrlKey || e.metaKey ? '_blank' : '_self');
          },
        });
      });
      langItem.appendChild(langLink);
      fragment.appendChild(langItem);
    });
    languageList.appendChild(fragment);
    if (activeIndexRef.current >= 0 && filteredLanguages[activeIndexRef.current]) {
      languageList.setAttribute('aria-activedescendant', `language-option-${activeIndexRef.current}`);
    } else {
      languageList.removeAttribute('aria-activedescendant');
    }
    if (selectedLangItemRef.current) {
      scrollSelectedIntoView(selectedLangItemRef.current, languageList);
    }
    return filteredLanguages;
  };
}

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function setupDropdownEvents({
  selectedLangButton,
  dropdown,
  searchInput,
  languageList,
  languagesList,
  currentLang,
  selectedLangItemRef,
  activeIndexRef,
}) {
  let isDraggingDropdown = false;
  let dragStartY = 0;
  let dragCurrentY = 0;
  let hasDragged = false;
  let isDropdownOpen = false;
  let documentClickHandler = null;

  const closeDropdown = () => {
    isDropdownOpen = false;
    dropdown.style.display = 'none';
    selectedLangButton.setAttribute('aria-expanded', 'false');
    selectedLangButton.focus();
    dropdown.classList.remove('fixed-height');
    dropdown.style.removeProperty('--dropdown-initial-height');
    searchInput.value = '';
    if (documentClickHandler) {
      document.removeEventListener('click', documentClickHandler);
      documentClickHandler = null;
    }
  };

  const startDropdownDrag = (y) => {
    isDraggingDropdown = true;
    dragStartY = y;
    dragCurrentY = y;
    hasDragged = false;
    dropdown.style.transition = 'none';
  };

  const continueDropdownDrag = (y) => {
    if (!isDraggingDropdown) return;
    dragCurrentY = y;
    const diff = dragCurrentY - dragStartY;
    if (Math.abs(diff) > 5) {
      hasDragged = true;
    }
    if (diff > 0) {
      dropdown.style.transform = `translateY(${diff}px)`;
    }
  };

  const endDropdownDrag = () => {
    if (!isDraggingDropdown) return;
    isDraggingDropdown = false;
    const diff = dragCurrentY - dragStartY;
    dropdown.style.transition = 'transform 0.3s ease';
    if (hasDragged && diff > 100) {
      dropdown.style.transform = 'translateY(100%)';
      dropdown.style.opacity = '0';
      const onTransitionEnd = (e) => {
        if (e.propertyName === 'transform') {
          dropdown.style.display = 'none';
          dropdown.style.transform = 'translateY(0)';
          dropdown.style.opacity = '1';
          closeDropdown();
          dropdown.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      dropdown.addEventListener('transitionend', onTransitionEnd);
    } else {
      dropdown.style.transform = 'translateY(0)';
    }
  };

  let filteredLanguages = languagesList;
  const doRenderLanguages = renderLanguages({
    languageList,
    languagesList,
    currentLang,
    selectedLangItemRef,
    activeIndexRef,
  });

  async function openDropdown() {
    isDropdownOpen = true;
    dropdown.style.display = 'block';
    selectedLangButton.setAttribute('aria-expanded', 'true');
    if (langMapToEnglish.length === 0) {
      langMapToEnglish = await langMapToEnglishPromise;
    }

    filteredLanguages = doRenderLanguages(searchInput.value);
    documentClickHandler = (e) => {
      if (isDropdownOpen && !dropdown.contains(e.target)) closeDropdown();
    };
    document.addEventListener('click', documentClickHandler);
    requestAnimationFrame(() => {
      const dropdownHeight = dropdown.offsetHeight;
      dropdown.style.setProperty('--dropdown-initial-height', `${dropdownHeight}px`);
      dropdown.classList.add('fixed-height');
      dropdown.setAttribute('tabindex', '-1');
      dropdown.focus();
      const selected = languageList.querySelector('.language-item.selected .language-link');
      const first = languageList.querySelector('.language-link');
      const toFocus = selected || first;
      if (toFocus) {
        toFocus.focus();
        languageList.setAttribute('aria-activedescendant', toFocus.parentElement.id);
      }
    });
  }

  selectedLangButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isDropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  const debouncedInput = debounce((e) => {
    filteredLanguages = doRenderLanguages(e.target.value);
  }, 200);
  searchInput.addEventListener('input', debouncedInput);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      e.stopPropagation();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const selected = languageList.querySelector('.language-item.selected .language-link');
      const first = languageList.querySelector('.language-link');
      const toFocus = selected || first;
      if (toFocus) {
        toFocus.focus();
        languageList.setAttribute('aria-activedescendant', toFocus.parentElement.id);
      }
    }
  });

  languageList.addEventListener('keydown', (e) => {
    const focused = document.activeElement;
    if (!focused.classList.contains('language-link')) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = focused.parentElement.nextElementSibling?.querySelector('.language-link');
      if (next) {
        next.focus();
        languageList.setAttribute('aria-activedescendant', next.parentElement.id);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = focused.parentElement.previousElementSibling?.querySelector('.language-link');
      if (prev) {
        prev.focus();
        languageList.setAttribute('aria-activedescendant', prev.parentElement.id);
      } else {
        searchInput.focus();
        languageList.setAttribute('aria-activedescendant', '');
      }
    }
  });

  languageList.addEventListener('mouseover', (e) => {
    const li = e.target.closest('li.language-item');
    if (li) {
      const idx = Array.from(languageList.children).indexOf(li);
      const lang = filteredLanguages[idx];
      const { pathname, href } = window.location;
      const currentLangForPath = getCurrentLanguage(filteredLanguages);
      const currentPrefix = currentLangForPath && currentLangForPath.prefix ? `/${currentLangForPath.prefix}` : '';
      const hasPrefix = currentPrefix && pathname.startsWith(`${currentPrefix}/`);
      const path = href.replace(window.location.origin + (hasPrefix ? currentPrefix : ''), '').replace('#langnav', '');
      const newPath = lang.prefix ? `/${lang.prefix}${path}` : path;
      const fullUrl = `${window.location.origin}${newPath}`;
      const langLink = li.querySelector('a.language-link');
      if (langLink) langLink.href = fullUrl;
      handleEvent({
        prefix: lang.prefix,
        link: { href: fullUrl },
        callback: (url) => {
          if (langLink && langLink.href !== url) langLink.href = url;
        },
      });
    }
  });

  searchInput.addEventListener('focus', () => {
    if (miloLangIsKeyboard) {
      const searchInputWrapper = searchInput.closest('.search-input-wrapper');
      if (searchInputWrapper) searchInputWrapper.classList.add('focus-visible');
    } else {
      const searchInputWrapper = searchInput.closest('.search-input-wrapper');
      if (searchInputWrapper) searchInputWrapper.classList.remove('focus-visible');
    }
  });
  searchInput.addEventListener('blur', () => {
    const searchInputWrapper = searchInput.closest('.search-input-wrapper');
    if (searchInputWrapper) searchInputWrapper.classList.remove('focus-visible');
  });

  const dropdownEl = dropdown;
  const dragHandleEl = dropdownEl.querySelector('.drag-handle');
  if (dragHandleEl) {
    dragHandleEl.addEventListener('touchstart', (e) => {
      startDropdownDrag(e.touches[0].clientY);
    });

    dragHandleEl.addEventListener('touchmove', (e) => {
      continueDropdownDrag(e.touches[0].clientY);
    });

    dragHandleEl.addEventListener('touchend', () => {
      endDropdownDrag();
    });

    dragHandleEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startDropdownDrag(e.clientY);

      const onMouseMove = (moveEvent) => {
        continueDropdownDrag(moveEvent.clientY);
      };

      const onMouseUp = () => {
        endDropdownDrag();
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
  }
  dropdown.addEventListener('focusout', (e) => {
    const nextFocused = e.relatedTarget;
    if (!dropdown.contains(nextFocused) && nextFocused !== selectedLangButton) {
      closeDropdown();
    }
  });
  dropdown.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  });
}

export default async function init(block) {
  const config = getConfig();
  const { languages, locales } = config;
  const divs = block.querySelectorAll(':scope > div');
  const links = divs[0].querySelectorAll('a');
  const placeholders = divs[0].querySelectorAll('p');
  const ariaLabel = placeholders[0]?.textContent.trim();
  const placeholderText = placeholders[1]?.textContent.trim();
  if (!links.length) return;

  const languagesList = getLanguages(links, languages, locales);
  const currentLang = getCurrentLanguage(languagesList);
  const wrapper = block.closest('.feds-regionPicker-wrapper');
  const regionPickerElem = wrapper.querySelector('.feds-regionPicker');
  regionPickerElem.setAttribute('href', '#');
  const regionPickerTextElem = regionPickerElem.querySelector('.feds-regionPicker-text');
  regionPickerTextElem.textContent = currentLang.name;
  regionPickerElem.setAttribute('id', 'language-selector-combobox');
  regionPickerElem.setAttribute('aria-haspopup', 'listbox');
  regionPickerElem.setAttribute('aria-expanded', 'false');
  regionPickerElem.setAttribute('aria-controls', 'language-selector-listbox');
  regionPickerElem.setAttribute('tabindex', '0');
  regionPickerElem.setAttribute('aria-label', ariaLabel);
  const {
    dropdown,
    searchContainer,
    languageList,
  } = createDropdownElements(placeholderText);
  dropdown.appendChild(searchContainer);
  dropdown.appendChild(languageList);
  wrapper.appendChild(dropdown);
  const element = wrapper.querySelector('.fragment');
  element.remove();
  const searchInput = searchContainer.querySelector('.search-input');
  searchInput.setAttribute('aria-activedescendant', '');
  const selectedLangItemRef = { current: null };
  const activeIndexRef = { current: -1 };
  setupDropdownEvents({
    selectedLangButton: regionPickerElem,
    dropdown,
    searchInput,
    languageList,
    languagesList,
    currentLang,
    selectedLangItemRef,
    activeIndexRef,
  });
}

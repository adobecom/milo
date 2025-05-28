import { createTag, getConfig, getLanguage } from '../../utils/utils.js';

const queriedPages = [];
const CHECKMARK_SVG = '<svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#5258E4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function normalizeUrl(url) {
  try {
    const u = new URL(url, window.location.origin);
    u.hash = '';
    u.search = '';
    return u.toString();
  } catch {
    return url;
  }
}

function handleEvent({ prefix, link, callback } = {}) {
  if (typeof callback !== 'function') return;
  const normalizedHref = normalizeUrl(link.href);
  const existingPage = queriedPages.find((page) => page.href === normalizedHref);
  if (existingPage) {
    callback(existingPage.ok
      ? link.href
      : `${prefix ? `/${prefix}` : ''}/`);
    return;
  }
  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    queriedPages.push({ href: normalizedHref, ok: resp.ok });
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
    langCode: langObj.prefix.replace('/', ''),
    prefix: langObj.prefix.replace('/', ''),
    langObj,
  };
});

const getCurrentLanguage = (languagesList, path) => {
  const currentPath = path || window.location.pathname;
  return languagesList.find((lang) => new RegExp(`^/${lang.langCode}(/|$)`).test(currentPath)) || languagesList[0];
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

function createDropdownElements(regionPickerTextElem, setAriaOnSpan = true) {
  if (setAriaOnSpan) {
    regionPickerTextElem.setAttribute('id', 'language-selector-combobox');
    regionPickerTextElem.setAttribute('class', 'feds-regionPicker-text');
    regionPickerTextElem.setAttribute('aria-haspopup', 'listbox');
    regionPickerTextElem.setAttribute('aria-expanded', 'false');
    regionPickerTextElem.setAttribute('aria-controls', 'language-selector-listbox');
    regionPickerTextElem.setAttribute('tabindex', '0');
  }
  const dropdown = createTag('div');
  dropdown.className = 'language-dropdown';
  dropdown.style.display = 'none';

  // Add drag handle for mobile modal
  const dragHandle = createTag('div', { class: 'drag-handle' });
  dropdown.appendChild(dragHandle);

  const searchContainer = createTag('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <div class="search-input-wrapper">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.8243 13.9758L10.7577 9.90923C11.5332 8.94809 12 7.72807 12 6.40005C12 3.31254 9.48755 0.800049 6.40005 0.800049C3.31254 0.800049 0.800049 3.31254 0.800049 6.40004C0.800049 9.48755 3.31254 12 6.40005 12C7.72807 12 8.9481 11.5331 9.90922 10.7577L13.9758 14.8243C14.093 14.9414 14.2461 15 14.4 15C14.5539 15 14.7071 14.9414 14.8243 14.8243C15.0586 14.5899 15.0586 14.2102 14.8243 13.9758ZM6.40005 10.8C3.97426 10.8 2.00005 8.82582 2.00005 6.40004C2.00005 3.97426 3.97426 2.00004 6.40005 2.00004C8.82583 2.00004 10.8 3.97426 10.8 6.40004C10.8 8.82582 8.82583 10.8 6.40005 10.8Z" fill="#666"/>
      </svg>
      <input type="text" placeholder="Search" class="search-input" id="language-selector-search" aria-autocomplete="list" aria-controls="language-selector-listbox" autocomplete="off" />
    </div>
  `;

  const languageList = createTag('ul', {
    class: 'language-list',
    id: 'language-selector-listbox',
    role: 'listbox',
    tabindex: '-1',
  });

  return { dropdown, searchContainer, languageList };
}

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
    const filteredLanguages = languagesList.filter(
      (lang) => lang.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    filteredLanguages.forEach((lang, idx) => {
      const langItem = createTag('li', {
        class: 'language-item',
        id: `language-option-${idx}`,
        role: 'option',
        'aria-selected': lang.name === currentLang.name ? 'true' : 'false',
        tabindex: '-1',
      });
      if (lang.name === currentLang.name) {
        langItem.classList.add('selected');
        selectedLangItemRef.current = langItem;
        if (activeIndexRef.current === -1) activeIndexRef.current = idx;
      }
      const langLink = createTag('a');
      const currentPath = window.location.pathname.replace(/^\/[a-zA-Z-]+/, '');
      const newPath = lang.prefix ? `/${lang.prefix}${currentPath}` : currentPath;
      langLink.href = `${window.location.origin}${newPath}`;
      langLink.className = 'language-link';
      langLink.innerHTML = `
        <span class="language-name">${lang.name}</span>
        ${lang.name === currentLang.name ? CHECKMARK_SVG : ''}
      `;
      langItem.appendChild(langLink);
      languageList.appendChild(langItem);
    });
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
  let isDropdownOpen = false;
  let filteredLanguages = languagesList;
  const doRenderLanguages = renderLanguages({
    languageList,
    languagesList,
    currentLang,
    selectedLangItemRef,
    activeIndexRef
  });

  function openDropdown() {
    isDropdownOpen = true;
    dropdown.style.display = 'block';
    selectedLangButton.setAttribute('aria-expanded', 'true');
    filteredLanguages = doRenderLanguages(searchInput.value);
    setTimeout(() => searchInput.focus(), 0);
  }
  function closeDropdown() {
    isDropdownOpen = false;
    dropdown.style.display = 'none';
    selectedLangButton.setAttribute('aria-expanded', 'false');
    activeIndexRef.current = filteredLanguages.findIndex((lang) => lang.name === currentLang.name);
    selectedLangButton.focus();
  }

  selectedLangButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isDropdownOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  selectedLangButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (isDropdownOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }
  });

  const debouncedInput = debounce((e) => {
    activeIndexRef.current = 0;
    filteredLanguages = doRenderLanguages(e.target.value);
  }, 200);
  searchInput.addEventListener('input', debouncedInput);

  searchInput.addEventListener('keydown', (e) => {
    if (!isDropdownOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeIndexRef.current < filteredLanguages.length - 1) {
        activeIndexRef.current += 1;
        filteredLanguages = doRenderLanguages(searchInput.value);
        const activeItem = document.getElementById(`language-option-${activeIndexRef.current}`);
        if (activeItem) activeItem.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeIndexRef.current > 0) {
        activeIndexRef.current -= 1;
        filteredLanguages = doRenderLanguages(searchInput.value);
        const activeItem = document.getElementById(`language-option-${activeIndexRef.current}`);
        if (activeItem) activeItem.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (filteredLanguages[activeIndexRef.current]) {
        const lang = filteredLanguages[activeIndexRef.current];
        handleEvent({
          prefix: lang.prefix,
          link: { href: lang.url },
          callback: (newHref) => {
            window.location.href = newHref;
          },
        });
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  });

  languageList.addEventListener('keydown', (e) => {
    if (!isDropdownOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (activeIndexRef.current < filteredLanguages.length - 1) {
        activeIndexRef.current += 1;
        filteredLanguages = doRenderLanguages(searchInput.value);
        const activeItem = document.getElementById(`language-option-${activeIndexRef.current}`);
        if (activeItem) activeItem.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (activeIndexRef.current > 0) {
        activeIndexRef.current -= 1;
        filteredLanguages = doRenderLanguages(searchInput.value);
        const activeItem = document.getElementById(`language-option-${activeIndexRef.current}`);
        if (activeItem) activeItem.focus();
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (filteredLanguages[activeIndexRef.current]) {
        const lang = filteredLanguages[activeIndexRef.current];
        handleEvent({
          prefix: lang.prefix,
          link: { href: lang.url },
          callback: (newHref) => {
            window.location.href = newHref;
          },
        });
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeDropdown();
    }
  });

  languageList.addEventListener('click', (e) => {
    const li = e.target.closest('li.language-item');
    if (li) {
      const idx = Array.from(languageList.children).indexOf(li);
      const lang = filteredLanguages[idx];
      handleEvent({
        prefix: lang.prefix,
        link: { href: lang.url },
        callback: (newHref) => {
          window.location.href = newHref;
        },
      });
    }
    e.stopPropagation();
  });

  document.addEventListener('click', () => {
    if (isDropdownOpen) closeDropdown();
  });
}

export default async function init(block) {
  const config = getConfig();
  const { languages, locales } = config;
  const divs = block.querySelectorAll(':scope > div');
  const links = divs[0].querySelectorAll('a');
  if (!links.length) return;

  const languagesList = getLanguages(links, languages, locales);
  const currentLang = getCurrentLanguage(languagesList);
  const wrapper = block.closest('.feds-regionPicker-wrapper');
  const regionPickerElem = wrapper.querySelector('.feds-regionPicker');
  const regionPickerTextElem = regionPickerElem.querySelector('.feds-regionPicker-text');
  regionPickerTextElem.textContent = currentLang.name;

  regionPickerElem.setAttribute('id', 'language-selector-combobox');
  regionPickerElem.setAttribute('aria-haspopup', 'listbox');
  regionPickerElem.setAttribute('aria-expanded', 'false');
  regionPickerElem.setAttribute('aria-controls', 'language-selector-listbox');
  regionPickerElem.setAttribute('tabindex', '0');

  const {
    dropdown,
    searchContainer,
    languageList,
  } = createDropdownElements(regionPickerTextElem, false);
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

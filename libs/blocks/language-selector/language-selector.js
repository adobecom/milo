import { createTag, getConfig, getLanguage } from '../../utils/utils.js';

const queriedPages = [];

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

function handleEvent({ prefix, link, callback } = {}) {
  if (typeof callback !== 'function') return;
  const existingPage = queriedPages.find((page) => page.href === link.href);
  if (existingPage) {
    callback(existingPage.resp.ok
      ? link.href
      : `${prefix ? `/${prefix}` : ''}/`);
    return;
  }
  fetch(link.href, { method: 'HEAD' }).then((resp) => {
    queriedPages.push({ href: link.href, resp });
    if (!resp.ok) throw new Error('request failed');
    callback(link.href);
  }).catch(() => {
    callback(`${prefix ? `/${prefix}` : ''}/`);
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
  let selectedLangItem = null;
  const regionPickerTextElem = block.closest('.feds-regionPicker-wrapper').querySelector('.feds-regionPicker-text');
  regionPickerTextElem.textContent = currentLang.name;
  const selectedLangButton = block.closest('.feds-regionPicker-wrapper').querySelector('.feds-regionPicker');

  const dropdown = createTag('div');
  dropdown.className = 'language-dropdown';

  const searchContainer = createTag('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <div class="search-input-wrapper">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.8243 13.9758L10.7577 9.90923C11.5332 8.94809 12 7.72807 12 6.40005C12 3.31254 9.48755 0.800049 6.40005 0.800049C3.31254 0.800049 0.800049 3.31254 0.800049 6.40004C0.800049 9.48755 3.31254 12 6.40005 12C7.72807 12 8.9481 11.5331 9.90922 10.7577L13.9758 14.8243C14.093 14.9414 14.2461 15 14.4 15C14.5539 15 14.7071 14.9414 14.8243 14.8243C15.0586 14.5899 15.0586 14.2102 14.8243 13.9758ZM6.40005 10.8C3.97426 10.8 2.00005 8.82582 2.00005 6.40004C2.00005 3.97426 3.97426 2.00004 6.40005 2.00004C8.82583 2.00004 10.8 3.97426 10.8 6.40004C10.8 8.82582 8.82583 10.8 6.40005 10.8Z" fill="#666"/>
      </svg>
      <input type="text" placeholder="Search" class="search-input">
    </div>
  `;

  const languageList = createTag('div');
  languageList.className = 'language-list';

  const renderLanguages = (searchTerm = '') => {
    languageList.innerHTML = '';
    languagesList
      .filter((lang) => lang.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .forEach((lang) => {
        const langItem = createTag('div');
        langItem.className = 'language-item';

        const isCurrentLang = lang.name === currentLang.name;
        if (isCurrentLang) {
          langItem.classList.add('selected');
          selectedLangItem = langItem;
        }

        const langLink = createTag('a');
        langLink.href = lang.url;
        langLink.className = 'language-link';
        langLink.innerHTML = `
          <span class="language-name">${lang.name}</span>
          ${isCurrentLang ? '<svg class="check-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#5258E4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
        `;

        let hrefAdapted;
        let pathname = langLink.getAttribute('href');
        if (pathname.startsWith('http')) {
          try { pathname = new URL(pathname).pathname; } catch (e) { /* ignore */ }
        }
        let { href } = langLink;
        if (href.endsWith('/')) href = href.slice(0, -1);
        const currentLangObj = getLanguage(languages, locales, window.location.pathname);
        const urlLangcode = currentLangObj.prefix.replace('/', '');
        const path = window.location.href.replace(`${window.location.origin}/${urlLangcode}`, '').replace('#langnav', '');
        if (urlLangcode === '') langLink.href = `${href}/${path}`;
        else langLink.href = `${href}${path}`;

        langItem.addEventListener('mouseover', () => {
          const link = langItem.querySelector('a');
          setTimeout(() => {
            if (link && link.matches(':hover') && !hrefAdapted) {
              handleEvent({
                prefix: lang.prefix,
                link,
                callback: (newHref) => {
                  link.href = newHref;
                  hrefAdapted = true;
                },
              });
            }
          }, 100);
        });

        langItem.addEventListener('click', (e) => {
          regionPickerTextElem.textContent = lang.name;

          const allItems = languageList.querySelectorAll('.language-item');
          allItems.forEach((item) => {
            item.classList.remove('selected');
            item.querySelector('.check-icon')?.remove();
          });

          langItem.classList.add('selected');
          selectedLangItem = langItem;

          if (!langLink.querySelector('.check-icon')) {
            langLink.innerHTML += '<span class="check-icon">✓</span>';
          }
          dropdown.classList.remove('show');
          handleEvent({
            prefix: lang.prefix,
            link: langLink,
            callback: (newHref) => {
              window.open(newHref, e.ctrlKey || e.metaKey ? '_blank' : '_self');
            },
          });
        });

        langItem.appendChild(langLink);
        languageList.appendChild(langItem);
      });
    if (!searchTerm && selectedLangItem) {
      scrollSelectedIntoView(selectedLangItem, languageList);
    }
  };

  renderLanguages();

  const searchInput = searchContainer.querySelector('.search-input');
  searchInput.addEventListener('input', (e) => {
    renderLanguages(e.target.value);
  });

  dropdown.appendChild(searchContainer);
  dropdown.appendChild(languageList);

  selectedLangButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpening = !dropdown.classList.contains('show');
    dropdown.classList.toggle('show');

    if (isOpening) {
      searchInput.value = '';
      renderLanguages();
      scrollSelectedIntoView(selectedLangItem, languageList);
      searchInput.focus();
    }
  });

  document.addEventListener('click', () => {
    dropdown.classList.remove('show');
  });

  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  block.closest('.feds-regionPicker-wrapper').appendChild(dropdown);
  const element = block.closest('.feds-regionPicker-wrapper').querySelector('.fragment');
  element.remove();
}

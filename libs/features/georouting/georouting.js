const WORLD_ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGRhdGEtbmFtZT0iU19HbG9iZV8yNF9OQDJ4IiBoZWlnaHQ9IjQ4IiBpZD0iU19HbG9iZV8yNF9OXzJ4IiB3aWR0aD0iNDgiPjxkZWZzPjxzdHlsZT4uZmlsbHtmaWxsOiM3MDcwNzB9PC9zdHlsZT48L2RlZnM+PHBhdGggY2xhc3M9ImZpbGwiIGQ9Ik05LjUyNyAxOC4zNThjLTEuNC01LjA0OSAyLjIwNy03LjIyMyAxLjg1Mi0xMS41MzdBMjEuNDMgMjEuNDMgMCAwIDAgMi42NjcgMjRjMCAxMi4xNDkgMTAuNTkxIDE5LjM5IDE4LjA3MiAyMC45NzZhOS4yIDkuMiAwIDAgMCAxLjM5My4yMjFjMi42NjgtNi44LTIuMzY0LTE0LjM4NS01LjY4NC0xOS4zMjYtMi43NjUtNC4xMTMtNS4yNzgtMS41NzEtNi45MjEtNy41MTNaIi8+PHBhdGggY2xhc3M9ImZpbGwiIGQ9Ik0xOS45IDUuNnMtLjQ4NS4wMjktLjYxOS4xNjNjLTEuMDE0IDEuMDEgMS43NzYgNi4xIDEuNjU2IDUuMzIyLjY2NC0zLjA1NiA0LjgxNi00LjIzNSA2LjA4OC0uMmE0Ljk4OSA0Ljk4OSAwIDAgMS0xLjExNyAzLjAyYy0xLjg4IDIuNDcyLTIuMjYyIDYuODcyLTMuMiA1Ljc0Ni04Ljc4Ny0zLjYtNy44MiAxLjE2MS00LjkzNiA0LjM0MyA0LjYxOCA1LjA5NCAyLjI3NS41MjIgOC4zMjMgMy4xODkgNC44NjQgMi4xNDUgMTAuNzE4IDIuNjUyIDkuMjg5IDQuMjctNC4zMjIgNC44OTQtMy40MTMgOC4xMzctMTEuMDU3IDEzLjg3Mi42MzctLjAxNyAyLjY2NS0uMjIgMy4wODItLjI4OGEyMS43IDIxLjcgMCAwIDAgMTcuODMzLTE5LjIgMy4yIDMuMiAwIDAgMS0xLjUzOS0uNDY5Yy0yLjE0Ny0uODE3LTMuOTg5IDEuOTY3LTQuMTUyLTUuNTUyYTcuNjg2IDcuNjg2IDAgMCAxIDIuMjIyLTUuMzMzIDQuMTA3IDQuMTA3IDAgMCAxIC45NzItLjQ2NSAyMi4zMDEgMjIuMzAxIDAgMCAwLS44MjYtMS4zNTdjLS4wNS4wMjYtLjA5NC4wNTktLjE0NS4wODMtMS42NjcuNzc4LTEuOSAxLjAwNy0yLjY2NyAwYTIuMSAyLjEgMCAwIDEgLjQ2MS0zLjEgMjEuMzEzIDIxLjMxMyAwIDAgMC0xNS41MzMtNi45NTdjMi43LjAzNyA1LjkyOSAyLjAzOSA0LjI4NCA1LjIzOS4yNDctLjUwOC01LjM2OS0xLjcyLTYuMTMzLTEuNzItMS4wMjkgMCAxLjg1My0zLjUxOSAxLjgxNC0zLjUxOWEyMS40MzkgMjEuNDM5IDAgMCAwLTguODIgMS45QzE2LjYzNyA1LjUyNiAxOS45IDUuNiAxOS45IDUuNloiLz48L3N2Zz4=';

const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

const geo2jsonp = (callback) => {
  // Setup a unique name that can be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  // Create the script tag
  const script = document.createElement('script');
  script.src = `https://geo2.adobe.com/json/?callback=${callbackName}`;

  // Define the function that the script will call
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  // Append to the document
  document.body.appendChild(script);
};

const getAkamaiCode = () => new Promise((resolve) => {
  const urlParams = new URLSearchParams(window.location.search);
  const akamaiLocale = urlParams.get('akamaiLocale') || sessionStorage.getItem('akamai');
  if (akamaiLocale !== null) {
    resolve(akamaiLocale.toLowerCase());
  } else {
    geo2jsonp((data) => {
      const code = data.country.toLowerCase();
      sessionStorage.setItem('akamai', code);
      resolve(code);
    });
  }
});

// Determine if any of the locales can be linked to.
async function getAvailableLocales(locales, config, getMetadata) {
  const fallbackMeta = getMetadata('fallbackrouting');
  const fallback = fallbackMeta ? fallbackMeta === 'on' : config.fallbackRouting === 'on';

  const { contentRoot } = config.locale;
  const path = window.location.href.replace(contentRoot, '');

  const availableLocales = [];
  const pagesExist = [];
  for (const [index, locale] of locales.entries()) {
    const prefix = locale.prefix ? `/${locale.prefix}` : '';
    const localePath = `${prefix}/${path}`;

    const pageExistsRequest = fetch(localePath, { method: 'HEAD' }).then((resp) => {
      if (resp.ok) {
        locale.url = `${origin}${prefix}${config.contentRoot}${path}`;
        availableLocales[index] = locale;
      } else if (fallback) {
        locale.url = `${origin}${prefix}${config.contentRoot}`;
        availableLocales[index] = locale;
      }
    });
    pagesExist.push(pageExistsRequest);
  }
  if (pagesExist.length > 0) await Promise.all(pagesExist);

  return availableLocales.filter(a => !!a);
}

function buildText(locales, config, createTag) {
  const fragment = new DocumentFragment();
  const wrapper = createTag('div', { class: 'text-wrapper' });
  locales.forEach((locale) => {
    const lang = config.locales[locale.prefix].ietf;
    const text = createTag('p', { class: 'locale-text', lang }, locale.text);
    wrapper.append(text);
  });
  fragment.append(wrapper);
  return fragment;
}

function buildLinks(locales, config, createTag) {
  const fragment = new DocumentFragment();
  const wrapper = createTag('div', { class: 'link-wrapper' });
  locales.forEach((locale) => {
    const lang = config.locales[locale.prefix].ietf;
    const link = createTag('a', { class: 'locale-link', lang, href: locale.url }, locale.button);
    const para = createTag('p', { class: 'locale-link-wrapper' }, link);
    wrapper.append(para);
    link.addEventListener('click', () => {
      const prefix = locale.prefix || 'us';
      document.cookie = `international=${prefix};path=/`;
    });
  });
  fragment.append(wrapper);
  return fragment;
}

function getCodes(data) {
  return data.akamaiCodes.split(',').map((a) => a.toLowerCase().trim())
}

function getMatches(data, suppliedCode) {
  return data.reduce((rdx, locale) => {
    const localeCodes = getCodes(locale);
    const foundCode = localeCodes.some((code) => code === suppliedCode);
    if (foundCode) rdx.push(locale);
    return rdx;
  }, []);
}

async function getDetails(currentPage, localeMatches, config, createTag, getMetadata) {
  const availableLocales = await getAvailableLocales(localeMatches, config, getMetadata);

  if (availableLocales && availableLocales.length > 0) {
    currentPage.url = '#';
    const worldIcon = createTag('img', { src: WORLD_ICON });
    const text = buildText([...availableLocales, currentPage], config, createTag);
    const links = buildLinks([...availableLocales, currentPage], config, createTag);
    const detailsFragment = new DocumentFragment();
    detailsFragment.append(worldIcon, text, links);
    return detailsFragment;
  }
  return null;
}

async function showModal(details) {
  const { getModal } = await import('../../blocks/modal/modal.js');
  getModal(null, { class: 'locale-modal', id: 'locale-modal', content: details });
}

async function loadDetailsAndModal(urlGeoData, localeMatches, config, createTag, getMetadata, loadStyle) {
  const details = await getDetails(urlGeoData, localeMatches, config, createTag, getMetadata);
  if (details) {
    const { miloLibs, codeRoot } = config;
    loadStyle(`${miloLibs || codeRoot}/features/georouting/georouting.css`);
    showModal(details);
  }
}

export default async function loadGeoRouting(config, createTag, getMetadata, loadStyle) {
  const { locale } = config;

  const urlLocale = locale.prefix.replace('/', '');
  const cookieInter = getCookie('international');
  const cookieLocale = cookieInter === 'us' ? '' : cookieInter;

  const { contentRoot } = config;
  const resp = await fetch(`${contentRoot}georouting.json`);
  if (!resp.ok) return;
  const json =  await resp.json();

  const urlGeoData = json.data.find(d => d.prefix === urlLocale);
  if (!urlGeoData) return;

  if (cookieLocale || cookieLocale === '') {
    // Show modal when url and cookie disagree
    if (urlLocale.split('_')[0] !== cookieLocale.split('_')[0]) {
      const localeMatches = json.data.filter(d => d.prefix === cookieLocale)
      await loadDetailsAndModal(urlGeoData, localeMatches, config, createTag, getMetadata, loadStyle);
    }
    return;
  }

  // Show modal when derived countries from url locale and akamai disagree
  const akamaiCode = await getAkamaiCode();
  if (akamaiCode && !getCodes(urlGeoData).includes(akamaiCode)) {
    const localeMatches = getMatches(json.data, akamaiCode);
    await loadDetailsAndModal(urlGeoData, localeMatches, config, createTag, getMetadata, loadStyle);
  }
}

// The flow chart for the georouting can be found here:
// https://wiki.corp.adobe.com/display/WP4/GeoRouting
export const getCookie = (name) => document.cookie
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
  const fallback = getMetadata('fallbackrouting') || config.fallbackRouting;

  const { contentRoot } = config.locale;
  const path = window.location.href.replace(contentRoot, '');

  const availableLocales = [];
  const pagesExist = [];
  for (const [index, locale] of locales.entries()) {
    const prefix = locale.prefix ? `/${locale.prefix}` : '';
    const localePath = `${prefix}${path}`;

    const pageExistsRequest = fetch(localePath, { method: 'HEAD' }).then((resp) => {
      if (resp.ok) {
        locale.url = `${origin}${prefix}${path}`;
        availableLocales[index] = locale;
      } else if (fallback !== 'off') {
        locale.url = `${origin}${prefix}`;
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

function setStorage(prefix) {
  const modPrefix = prefix || 'us';
  // set cookie so legacy code on adobecom still works properly.
  document.cookie = `international=${modPrefix};path=/`;
  sessionStorage.setItem("international", modPrefix);
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
      setStorage(locale.prefix)
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
    const worldIcon = createTag('img', { src: '../../../img/icons/Smock_GlobeOutline_18_N.svg', class: 'world-icon' });
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
  return getModal(null, { class: 'locale-modal', id: 'locale-modal', content: details });
}

export default async function loadGeoRouting(config, createTag, getMetadata) {
  const { locale } = config;

  const urlLocale = locale.prefix.replace('/', '');
  const storedInter = sessionStorage.getItem("international") || getCookie('international');
  const storedLocale = storedInter === 'us' ? '' : storedInter;

  const resp = await fetch(`${origin}/georouting.json`);
  if (!resp.ok) return;
  const json =  await resp.json();

  const urlGeoData = json.data.find(d => d.prefix === urlLocale);
  if (!urlGeoData) return;

  if (storedLocale || storedLocale === '') {
    // Show modal when url and cookie disagree
    if (urlLocale.split('_')[0] !== storedLocale.split('_')[0]) {
      const localeMatches = json.data.filter(d => d.prefix === storedLocale)
      const details = await getDetails(urlGeoData, localeMatches, config, createTag, getMetadata);
      if (details) { await showModal(details); }
    }
    return;
  }

  // Show modal when derived countries from url locale and akamai disagree
  const akamaiCode = await getAkamaiCode();
  if (akamaiCode && !getCodes(urlGeoData).includes(akamaiCode)) {
    const localeMatches = getMatches(json.data, akamaiCode);
    const details = await getDetails(urlGeoData, localeMatches, config, createTag, getMetadata);
    if (details) { await showModal(details); }
    return;
  }
  setStorage(locale.prefix);
}

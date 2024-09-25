import { getFederatedContentRoot } from '../../utils/federated.js';

let config;
let createTag;
let getMetadata;
let loadStyle;

export const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

const getAkamaiCode = () => new Promise((resolve, reject) => {
  const urlParams = new URLSearchParams(window.location.search);
  const akamaiLocale = urlParams.get('akamaiLocale') || sessionStorage.getItem('akamai');
  if (akamaiLocale !== null) {
    resolve(akamaiLocale.toLowerCase());
  } else {
    fetch('https://geo2.adobe.com/json/', { cache: 'no-cache' }).then((resp) => {
      if (resp.ok) {
        resp.json().then((data) => {
          const code = data.country.toLowerCase();
          sessionStorage.setItem('akamai', code);
          resolve(code);
        });
      } else {
        reject(new Error(`Error fetching Akamai code: ${resp.statusText}`));
      }
    }).catch((error) => {
      reject(new Error(`Error fetching Akamai code: ${error.message}`));
    });
  }
});

async function getAvailableLocales(locales) {
  const fallback = getMetadata('fallbackrouting') || config.fallbackRouting;

  const { prefix } = config.locale;
  let path = window.location.href.replace(`${window.location.origin}`, '');
  if (path.startsWith(prefix)) path = path.replace(prefix, '');

  const availableLocales = [];
  const pagesExist = [];
  locales.forEach((locale, index) => {
    const locPrefix = locale.prefix ? `/${locale.prefix}` : '';
    const localePath = `${locPrefix}${path}`;

    const pageExistsRequest = fetch(localePath, { method: 'HEAD' }).then((resp) => {
      if (resp.ok) {
        locale.url = localePath;
        availableLocales[index] = locale;
      } else if (fallback !== 'off') {
        locale.url = `${locPrefix}`;
        availableLocales[index] = locale;
      }
    });
    pagesExist.push(pageExistsRequest);
  });
  if (pagesExist.length > 0) await Promise.all(pagesExist);

  return availableLocales.filter((a) => !!a);
}

function getGeoroutingOverride() {
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('georouting');
  const georouting = param || getCookie('georouting');
  if (param === 'off') {
    const domain = window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `georouting=${georouting};${expires};path=/;${domain}`;
  } else if (param === 'on') document.cookie = 'georouting=; expires= Thu, 01 Jan 1970 00:00:00 GMT';
  return georouting === 'off';
}

function getCodes(data) {
  return data.akamaiCodes.split(',').map((a) => a.toLowerCase().trim());
}

function getMatches(data, suppliedCode) {
  return data.reduce((rdx, locale) => {
    const localeCodes = getCodes(locale);
    if (localeCodes.some((code) => code === suppliedCode)) rdx.push(locale);
    return rdx;
  }, []);
}

function decorateForOnLinkClick(link, urlPrefix, localePrefix, eventType = 'Switch') {
  const modCurrPrefix = localePrefix || 'us';
  const modPrefix = urlPrefix || 'us';
  const eventName = `${eventType}:${modPrefix.split('_')[0]}-${modCurrPrefix.split('_')[0]}|Geo_Routing_Modal`;
  link.setAttribute('daa-ll', eventName);
  link.addEventListener('click', () => {
    const domain = window.location.host === 'adobe.com' || window.location.host.endsWith('.adobe.com') 
      ? 'domain=adobe.com' 
      : '';
    document.cookie = `international=${modPrefix};path=/;${domain}`;
    window.location.href = link.href;
    link.closest('.georouting-toaster')?.dispatchEvent(new Event('toaster:closed'));
  });
}

// Cross icon
const CLOSE_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;

function buildToasterContent(geoData, locale, multipleLocales, currentPage) {
  const lang = config.locales[locale.prefix]?.ietf ?? '';
  const geo = geoData.filter((c) => c.prefix === locale.prefix);
  const titleText = geo.length ? geo[0][currentPage.geo] : '';
  
  const contentContainer = createTag('div', { id: 'content-container' });
  const title = createTag('h5', { lang }, locale.title.replace('{{geo}}', titleText));
  const text = createTag('p', { class: 'locale-text', lang }, locale.text);

  const footer = createTag('div', { class: 'georouting-toaster-footer' });
  const span = createTag('span', { class: 'icon margin-inline-end' });
  
  const flagFile = locale.globeGrid?.toLowerCase().trim() === 'on' ? 'globe-grid.png' : `flag-${locale.geo.replace('_', '-')}.svg`;
  const img = createTag('img', {
    class: 'icon-milo',
    width: 15,
    height: 15,
    alt: locale.button,
  });
  
  img.addEventListener(
    'error',
    () => (img.src = `${config.miloLibs || config.codeRoot}/features/georoutingv2/img/globe-grid.png`),
    { once: true }
  );

  img.src = `${config.miloLibs || config.codeRoot}/img/georouting/${flagFile}`;
  span.appendChild(img); 

  const mainAction = createTag('a', {
    class: 'con-button blue button-l',
    lang: locale.lang,
    role: 'button',
    href: locale.url,
  }, span);

  mainAction.append(locale.button);

  const altAction = createTag('a', { lang, href: currentPage.url }, currentPage.button);
  decorateForOnLinkClick(altAction, currentPage.prefix, locale.prefix, 'Stay');

  const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
  linkWrapper.appendChild(altAction);
  footer.append(linkWrapper);
  
  contentContainer.appendChild(title);
  contentContainer.appendChild(text);
  contentContainer.appendChild(footer);
  
  return contentContainer;
}

function updateToasterContent(details, geoData, currentPage) {
  const contentContainer = document.querySelector('#content-container');
  
  if (contentContainer) {
    contentContainer.innerHTML = ''; // Clear existing content

    const { locale } = details;
    
    // Check if locale and geoData exist, else use fallback
    if (!locale || !geoData) {
      console.error('Locale or geoData is missing');
      return;
    }
    
    const geoEntry = geoData.find((c) => c.prefix === locale.prefix);
    const titleText = geoEntry ? geoEntry[currentPage.geo] : 'Default Title';

    // Create new title, text, and footer elements dynamically
    const title = createTag('h5', { class: 'title' }, locale.title.replace('{{geo}}', titleText || ''));
    const text = createTag('p', { class: 'locale-text' }, locale.text || 'No text available');
    
    const footer = createTag('div', { class: 'georouting-toaster-footer' });
    const span = createTag('span', { class: 'icon margin-inline-end' });
    
    const flagFile = locale.globeGrid?.toLowerCase().trim() === 'on' ? 'globe-grid.png' : `flag-${locale.geo.replace('_', '-')}.svg`;
    const img = createTag('img', {
      class: 'icon-milo',
      width: 15,
      height: 15,
      alt: locale.button,
    });
    
    img.addEventListener(
      'error',
      () => (img.src = `${config.miloLibs || config.codeRoot}/features/georoutingv2/img/globe-grid.png`),
      { once: true }
    );
    
    img.src = `${config.miloLibs || config.codeRoot}/img/georouting/${flagFile}`;
    span.appendChild(img);
    
    const mainAction = createTag('a', {
      class: 'con-button blue button-l',
      role: 'button',
      href: locale.url,
    }, span);

    mainAction.append(locale.button);
    
    const altAction = createTag('a', { href: currentPage.url }, currentPage.button);
    decorateForOnLinkClick(altAction, currentPage.prefix, locale.prefix, 'Stay');
    
    const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
    linkWrapper.appendChild(altAction);
    footer.append(linkWrapper);
    
    contentContainer.appendChild(title);
    contentContainer.appendChild(text);
    contentContainer.appendChild(footer);
  }
}


function closeToaster(toaster) {
  const closeEvent = new Event('toaster:closed');
  window.dispatchEvent(closeEvent);
  toaster.remove();
}

function createToasterElement(geoData, locale, multipleLocales, currentPage) {
  const toaster = createTag('div', { class: 'georouting-toaster' });
  const georoutingToasterContent = createTag('div', { class: 'georouting-toaster-content' });
  const navArrow = createTag('div', { class: 'nav-arrow' });
  const navArrowInner = createTag('div', { class: 'nav-arrow-inner' });
  
  // Add close button
  const closeButton = createTag('button', { class: 'dialog-close', 'aria-label': 'Close' }, CLOSE_ICON);
  closeButton.addEventListener('click', () => {
    closeToaster(toaster);
  });

  navArrow.appendChild(navArrowInner);
  georoutingToasterContent.appendChild(closeButton);
  georoutingToasterContent.appendChild(navArrow);

  // Create dropdown for multiple locales
  if (multipleLocales) {
    const select = createTag('select');
    multipleLocales.forEach((loc) => {
      const option = createTag('option', { value: loc.prefix }, loc.language);
      select.appendChild(option);
    });

    select.addEventListener('change', async (event) => {
      const selectedLocalePrefix = event.target.value;
      const selectedLocale = multipleLocales.find(loc => loc.prefix === selectedLocalePrefix);

      if (selectedLocale) {
        const updatedDetails = await getDetails(currentPage, [selectedLocale], geoData);
        if (updatedDetails) {
          updateToasterContent(updatedDetails, geoData, currentPage);
        }
      }
    });
    georoutingToasterContent.appendChild(select);
  }

  // Append the content container, which will be updated
  const contentContainer = buildToasterContent(geoData, locale, multipleLocales, currentPage);
  georoutingToasterContent.appendChild(contentContainer);

  toaster.appendChild(georoutingToasterContent);
  //document.body.appendChild(toaster);  // Append toaster to the DOM to display it
   const observer = new MutationObserver(() => {
  const brandContainer = document.querySelector('.feds-brand-container');
  if (brandContainer) {
    brandContainer.appendChild(toaster);
    observer.disconnect();
  }
  });
  observer.observe(document, {
    childList: true,
    subtree: true
  });
}

async function getDetails(currentPage, localeMatches, geoData) {
  const availableLocales = await getAvailableLocales(localeMatches);
  
  if (!availableLocales.length) return null;

  if (!currentPage.url) {
    currentPage.url = window.location.hash ? window.location.href : '#';
  }

  if (availableLocales.length === 1) {
    return {
      locale: availableLocales[0],
      multipleLocales: null,
    };
  }

  const sortedLocales = availableLocales.sort((a, b) => a.languageOrder - b.languageOrder);
  return {
    locale: sortedLocales[0],
    multipleLocales: sortedLocales,
  };
}

async function showToaster(currentPage, localeMatches, geoData) {
  const details = await getDetails(currentPage, localeMatches, geoData);
  
  if (details) {
    const { locale, multipleLocales } = details;
    createToasterElement(geoData, locale, multipleLocales, currentPage);
  }
}

export default async function loadGeoRoutingToaster(
  conf,
  createTagFunc,
  getMetadataFunc,
  loadStyleFunc,
) {
  if (getGeoroutingOverride()) return;

  config = conf;
  createTag = createTagFunc;
  getMetadata = getMetadataFunc;
  loadStyle = loadStyleFunc;

  const urls = [
    `${config.contentRoot ?? ''}/georoutingv2.json`,
    `${config.contentRoot ?? ''}/georouting.json`,
    `${getFederatedContentRoot()}/federal/georouting/georoutingv2.json`,
  ];
  let resp;
  for (const url of urls) {
    resp = await fetch(url);
    if (resp.ok) {
      if (url.includes('georouting.json')) {
        const json = await resp.json();
        const { default: loadGeoRoutingOld } = await import('../georouting/georouting.js');
        loadGeoRoutingOld(config, createTag, getMetadata, json);
      }
      break;
    }
  }
  const json = await resp.json();
  const { locale } = config;

  const urlLocale = locale.prefix.replace('/', '');
  const storedInter = getCookie('international');
  const storedLocale = storedInter === 'us' ? '' : storedInter;

  const urlGeoData = json.georouting.data.find((d) => d.prefix === urlLocale);
  if (!urlGeoData) return;

  if (storedLocale || storedLocale === '') {
    const urlLocaleGeo = urlLocale.split('_')[0];
    const storedLocaleGeo = storedLocale.split('_')[0];
    if (urlLocaleGeo !== storedLocaleGeo) {
      const localeMatches = json.georouting.data.filter(
        (d) => d.prefix === storedLocale,
      );
      await showToaster(urlGeoData, localeMatches, json.geos.data);
    }
    return;
  }

  try {
    let akamaiCode = await getAkamaiCode();
    if (akamaiCode && !getCodes(urlGeoData).includes(akamaiCode)) {
      const localeMatches = getMatches(json.georouting.data, akamaiCode);
      await showToaster(urlGeoData, localeMatches, json.geos.data);
    }
  } catch (e) {
    console.error(e.message);
  }
}

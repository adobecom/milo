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
    /* c8 ignore next 5 */
    fetch('https://geo2.adobe.com/json/', { cache: 'no-cache' }).then((resp) => {
      if (resp.ok) {
        resp.json().then((data) => {
          const code = data.country.toLowerCase();
          sessionStorage.setItem('akamai', code);
          resolve(code);
        });
      } else {
        reject(new Error(`Something went wrong getting the akamai Code. Response status text: ${resp.statusText}`));
      }
    }).catch((error) => {
      reject(new Error(`Something went wrong getting the akamai Code. ${error.message}`));
    });
  }
});

// Determine if any of the locales can be linked to.
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

function decorateForOnLinkClick(link, urlPrefix, localePrefix, eventType = 'Switch') {
  const modCurrPrefix = localePrefix || 'us';
  const modPrefix = urlPrefix || 'us';
  const eventName = `${eventType}:${modPrefix.split('_')[0]}-${modCurrPrefix.split('_')[0]}|Geo_Routing_Modal`;
  link.setAttribute('daa-ll', eventName);
  link.addEventListener('click', () => {
    // set cookie so legacy code on adobecom still works properly.
    const domain = window.location.host === 'adobe.com'
      || window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
    document.cookie = `international=${modPrefix};path=/;${domain}`;
    link.closest('.dialog-modal').dispatchEvent(new Event('closeModal'));
  });
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

function removeOnClickOutsideElement(element, event, button) {
  const func = (evt) => {
    if (event === evt) return; // ignore initial click event
    let targetEl = evt.target;
    while (targetEl) {
      if (targetEl === element) {
        // click inside
        return;
      }
      // Go up the DOM
      targetEl = targetEl.parentNode;
    }
    // This is a click outside.
    element.remove();
    button.setAttribute('aria-expanded', false);
    document.removeEventListener('click', func);
  };
  document.addEventListener('click', func);
}

function openPicker(button, locales, country, event, dir, currentPage) {
  if (document.querySelector('.picker')) {
    return;
  }

  const list = createTag('ul', { class: 'picker', dir });
  locales.forEach((l) => {
    const lang = config.locales[l.prefix]?.ietf ?? '';
    const a = createTag('a', { lang, href: l.url }, `${country} - ${l.language}`);
    decorateForOnLinkClick(a, l.prefix, currentPage.prefix);
    const li = createTag('li', {}, a);
    list.appendChild(li);
  });

  button.parentNode.insertBefore(list, button.nextSibling);
  const buttonRect = button.getBoundingClientRect();
  const spaceBelowButton = window.innerHeight - buttonRect.bottom;
  if (spaceBelowButton <= list.offsetHeight) {
    list.classList.add('top');
  }

  button.setAttribute('aria-expanded', true);
  removeOnClickOutsideElement(list, event, button);
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

function closeToaster(toaster) {
  const closeEvent = new Event('toaster:closed');
  window.dispatchEvent(closeEvent);
  toaster.remove();
}

const CLOSE_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <line y1="8" x2="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
    <line x1="8" y1="8" transform="translate(10506 -3397)" fill="none" stroke="#fff" stroke-width="2"/>
  </g>
</svg>`;

function buildFlagImage(locale) {
  const flagFile = locale.globeGrid?.toLowerCase().trim() === 'on'
    ? 'globe-grid.png'
    : `flag-${locale.geo.replace('_', '-')}.svg`;
  const img = createTag('img', {
    class: 'icon-milo',
    width: 15,
    height: 15,
    alt: locale.button,
    src: `${config.miloLibs || config.codeRoot}/img/georouting/${flagFile}`,
  });
  img.addEventListener(
    'error',
    () => (img.src = `${config.miloLibs || config.codeRoot}/features/georoutingv2/img/globe-grid.png`),
    { once: true },
  );
  return img;
}

function buildDownArrowIcon() {
  const downArrow = createTag('img', {
    class: 'icon-milo down-arrow',
    src: `${config.miloLibs || config.codeRoot}/ui/img/chevron.svg`,
    role: 'presentation',
    width: 15,
    height: 15,
  });
  return downArrow;
}

function buildToasterElements(contentContainer, geoData, locale, multipleLocales, currentPage) {
  // Clear existing content if it's an update
  contentContainer.innerHTML = '';

  const lang = config.locales[locale.prefix]?.ietf ?? '';
  const geo = geoData.filter((c) => c.prefix === locale.prefix);
  const titleText = geo.length ? geo[0][currentPage.geo] : '';
  const title = createTag('h5', { lang }, locale.title.replace('{{geo}}', titleText));
  const text = createTag('p', { class: 'locale-text', lang }, locale.text);
  const footer = createTag('div', { class: 'georouting-toaster-footer' });
  const span = createTag('span', { class: 'icon margin-inline-end' });

  const img = buildFlagImage(locale);
  span.appendChild(img);

  const mainAction = createTag('a', {
    class: 'con-button blue button-l',
    lang: locale.lang,
    role: 'button',
    href: locale.url,
    'aria-haspopup': !!multipleLocales,
    'aria-expanded': false,
  }, span);

  mainAction.append(locale.button);

  // If there are multiple locales, append the down-arrow icon
  if (multipleLocales) {
    const downArrowIcon = buildDownArrowIcon();
    span.appendChild(downArrowIcon);
    mainAction.addEventListener('click', (e) => {
      e.preventDefault();
      openPicker(mainAction, multipleLocales, locale.button, e, 'ltr', currentPage);
    });
  } else {
    mainAction.href = locale.url;
    decorateForOnLinkClick(mainAction, locale.prefix, currentPage.prefix);
  }

  const altAction = createTag('a', { lang, href: currentPage.url }, currentPage.button);
  decorateForOnLinkClick(altAction, currentPage.prefix, locale.prefix, 'Stay');

  const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
  linkWrapper.appendChild(altAction);
  footer.append(linkWrapper);

  contentContainer.appendChild(title);
  contentContainer.appendChild(text);
  contentContainer.appendChild(footer);
}

function buildToasterContent(geoData, locale, multipleLocales, currentPage) {
  const contentContainer = createTag('div', { id: 'content-container' });
  buildToasterElements(contentContainer, geoData, locale, multipleLocales, currentPage);
  return contentContainer;
}

function updateToasterContent(details, geoData, multipleLocales, currentPage) {
  const contentContainer = document.querySelector('#content-container');
  if (contentContainer) {
    buildToasterElements(contentContainer, geoData, details.locale, multipleLocales, currentPage);
  }
}

function createToasterElement(geoData, locale, multipleLocales, currentPage) {
  const toaster = createTag('div', { class: 'georouting-toaster' });
  const georoutingToasterContent = createTag('div', { class: 'georouting-toaster-content' });
  const navArrow = createTag('div', { class: 'nav-arrow' });
  const navArrowInner = createTag('div', { class: 'nav-arrow-inner' });

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
      const selectedLocale = multipleLocales.find((loc) => loc.prefix === selectedLocalePrefix);

      if (selectedLocale) {
        const updatedDetails = await getDetails(currentPage, [selectedLocale], geoData);
        if (updatedDetails) {
          updateToasterContent(updatedDetails, geoData, multipleLocales, currentPage);
        }
      }
    });
    georoutingToasterContent.appendChild(select);
  }

  // Append the content container, which will be updated
  const contentContainer = buildToasterContent(geoData, locale, multipleLocales, currentPage);
  georoutingToasterContent.appendChild(contentContainer);
  toaster.appendChild(georoutingToasterContent);

  const observer = new MutationObserver(() => {
    const locationContainer = document.querySelector('.location-icon-container');
    if (locationContainer) {
      locationContainer.appendChild(toaster);
      observer.disconnect();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
}

async function showToaster(currentPage, localeMatches, geoData) {
  const details = await getDetails(currentPage, localeMatches, geoData);
  if (details) {
    const { locale, multipleLocales } = details;
    createToasterElement(geoData, locale, multipleLocales, currentPage);
  }
}

const LOCATION_ICON = `
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
  <g transform="translate(-10500 3403)">
    <circle cx="10" cy="10" r="10" transform="translate(10500 -3403)" fill="#707070"/>
    <path d="M10,4A5.373,5.373,0,0,0,4.5,9.5C4.5,13,10,19,10,19s5.5-6,5.5-9.5A5.373,5.373,0,0,0,10,4Zm0,7.5A2,2,0,1,1,12,9.5,2,2,0,0,1,10,11.5Z" transform="translate(10500 -3403)" fill="#fff"/>
  </g>
</svg>`;

async function appendLocationIcon() {
  const observer = new MutationObserver(() => {
    const navWrapper = document.querySelector('.feds-topnav');
    if (navWrapper) {
      const locationIcon = document.createElement('div');
      locationIcon.classList.add('location-icon-container');
      locationIcon.innerHTML = LOCATION_ICON;
      navWrapper.appendChild(locationIcon);
      locationIcon.addEventListener('click', () => {
        console.log('Toaster icon clicked');
        // TODO: toaster logic (e.g., show or hide a toaster popup)
      });
      observer.disconnect();
    }
  });
  observer.observe(document, {
    childList: true,
    subtree: true,
  });
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

  await appendLocationIcon();

  // const { miloLibs, codeRoot } = config;
  // await new Promise((resolve) => { loadStyle(`${miloLibs || codeRoot}/features/georoutingv2/georoutingv2.css`, resolve); });

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
    window.lana?.log(e.message);
  }
}

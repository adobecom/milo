let config;
let createTag;
let getMetadata;
let loadBlock;
let loadStyle;

const createTabsContainer = (tabNames) => {
  const ol = createTag('ol');
  tabNames.forEach((name) => {
    const li = createTag('li', null, name);
    ol.appendChild(li);
  });
  const olDiv = createTag('div', null, ol);
  const outerDiv = createTag('div', null, olDiv);
  const divTabs = createTag('div', { class: 'tabs quiet' }, outerDiv);
  return createTag('div', { class: 'section tabs-background-transparent' }, divTabs);
};

const createTab = (content, tabName) => {
  const divTab = createTag('div', null, 'tab');
  const divTagName = createTag('div', null, tabName);
  const tab = createTag('div');
  tab.appendChild(divTab);
  tab.appendChild(divTagName);
  const sectionMeta = createTag('div', { class: 'section-metadata' }, tab);
  const topDiv = createTag('div', { class: 'section' });
  topDiv.append(content);
  topDiv.append(sectionMeta);
  return topDiv;
};

export const getCookie = (name) => document.cookie
  .split('; ')
  .find((row) => row.startsWith(`${name}=`))
  ?.split('=')[1];

/* c8 ignore next 16 */
const geo2jsonp = (callback) => {
  // Setup a unique name that can be called & destroyed
  const callbackName = `jsonp_${Math.round(100000 * Math.random())}`;

  const script = document.createElement('script');
  script.src = `https://geo2.adobe.com/json/?callback=${callbackName}`;

  // Define the function that the script will call
  window[callbackName] = (data) => {
    delete window[callbackName];
    document.body.removeChild(script);
    callback(data);
  };

  document.body.appendChild(script);
};

const getAkamaiCode = () => new Promise((resolve) => {
  const urlParams = new URLSearchParams(window.location.search);
  const akamaiLocale = urlParams.get('akamaiLocale') || sessionStorage.getItem('akamai');
  if (akamaiLocale !== null) {
    resolve(akamaiLocale.toLowerCase());
  } else {
    /* c8 ignore next 5 */
    geo2jsonp((data) => {
      const code = data.country.toLowerCase();
      sessionStorage.setItem('akamai', code);
      resolve(code);
    });
  }
});

// Determine if any of the locales can be linked to.
async function getAvailableLocales(locales) {
  const fallback = getMetadata('fallbackrouting') || config.fallbackRouting;

 /* const { contentRoot } = config.locale;
  const path = window.location.href.replace(contentRoot, '');*/

  const { prefix } = config.locale;
  const path = window.location.href.replace(`${window.location.origin}${prefix}`, '')
  console.log("path: "+path);

  const availableLocales = [];
  const pagesExist = [];
  locales.forEach((locale, index) => {
    const prefix = locale.prefix ? `/${locale.prefix}` : '';
    //const  = `${prefix}${config.contentRoot ?? ''}`;
    const localePath = `${prefix}${path}`;
    console.log("localePath: "+localePath);

    const pageExistsRequest = fetch(localePath, { method: 'HEAD' }).then((resp) => {
      if (resp.ok) {
        locale.url = localePath;
        availableLocales[index] = locale;
      } else if (fallback !== 'off') {
        locale.url = `${prefix}/`;
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
  const param = urlParams.get('hideGeorouting');
  const hideGeorouting = param || getCookie('hideGeorouting');
  if (param === 'on') {
    const d = new Date();
    d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `overrideGeorouting=${hideGeorouting};${expires};path=/;`;
  } else if (param === 'off') document.cookie = 'hideGeorouting=; expires= Thu, 01 Jan 1970 00:00:00 GMT';
  return hideGeorouting === 'on';
}

function decorateForOnLinkClick(link, prefix) {
  link.addEventListener('click', () => {
    const modPrefix = prefix || 'us';
    // set cookie so legacy code on adobecom still works properly.
    document.cookie = `international=${modPrefix};path=/`;
    sessionStorage.setItem('international', modPrefix);
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

function openPicker(button, locales, country, event) {
  if (document.querySelector('.locale-modal-v2 .picker')) {
    return;
  }
  const list = createTag('ul', { class: 'picker' });
  locales.forEach((l) => {
    const lang = config.locales[l.prefix]?.ietf ?? '';
    const a = createTag('a', { lang, href: l.url }, `${country} - ${l.language}`);
    decorateForOnLinkClick(a, l.prefix);
    const li = createTag('li', {}, a);
    list.appendChild(li);
  });
  button.parentNode.insertBefore(list, button.nextSibling);
  button.setAttribute('aria-expanded', true);
  removeOnClickOutsideElement(list, event, button);
}

function buildContent(currentPage, locale, geoData, locales) {
  const fragment = new DocumentFragment();
  const lang = config.locales[currentPage.prefix]?.ietf ?? '';
  const geo = geoData.filter((c) => c.prefix === locale.prefix);
  const titleText = geo.length ? geo[0][currentPage.geo] : '';
  const title = createTag('h3', { lang }, locale.title.replace('{{geo}}', titleText));
  const text = createTag('p', { class: 'locale-text', lang }, locale.text);
  const flagFile = getCodes(locale).length > 1 ? 'globe-grid.png' : `flag-${locale.geo}.svg`;
  const img = createTag('img', {
    class: 'icon-milo',
    width: 15,
    height: 15,
  });
  img.addEventListener(
    'error',
    () => (img.src = `${config.miloLibs || config.codeRoot}/features/georoutingv2/img/globe-grid.png`),
    { once: true },
  );
  img.src = `${config.miloLibs || config.codeRoot}/img/georouting/${flagFile}`;
  const span = createTag('span', { class: 'icon margin-right' }, img);
  const mainAction = createTag('a', {
    class: 'con-button blue button-l', lang, role: 'button', 'aria-haspopup': !!locales, 'aria-expanded': false, href: '#',
  }, span);
  mainAction.append(locale.button);
  if (locales) {
    const downArrow = createTag('img', {
      class: 'icon-milo down-arrow',
      src: `${config.miloLibs || config.codeRoot}/ui/img/chevron.svg`,
      width: 15,
      height: 15,
    });
    span.appendChild(downArrow);
    mainAction.addEventListener('click', (e) => {
      e.preventDefault();
      openPicker(mainAction, locales, locale.button, e);
    });
  } else {
    mainAction.href = locale.url;
    decorateForOnLinkClick(mainAction, locale.prefix);
  }

  const altAction = createTag('a', { lang, href: currentPage.url }, currentPage.button);
  decorateForOnLinkClick(altAction, currentPage.prefix);
  const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
  linkWrapper.appendChild(altAction);
  fragment.append(title, text, linkWrapper);
  return fragment;
}

async function getDetails(currentPage, localeMatches, geoData) {
  const availableLocales = await getAvailableLocales(localeMatches);
  if (availableLocales.length > 0) {
    const georoutingWrapper = createTag('div', { class: 'georouting-wrapper fragment' });
    currentPage.url = window.location.hash ? document.location.href : '#';
    if (availableLocales.length === 1) {
      const content = buildContent(currentPage, availableLocales[0], geoData);
      georoutingWrapper.appendChild(content);
      return georoutingWrapper;
    }
    const sortedLocales = availableLocales.sort((a, b) => a.languageOrder - b.languageOrder);
    const tabsContainer = createTabsContainer(sortedLocales.map((l) => l.language));
    georoutingWrapper.appendChild(tabsContainer);

    sortedLocales.forEach((locale) => {
      const content = buildContent(currentPage, locale, geoData, sortedLocales);
      const tab = createTab(content, locale.language);
      georoutingWrapper.appendChild(tab);
    });
    return georoutingWrapper;
  }
  return null;
}

async function showModal(details) {
  const { miloLibs, codeRoot } = config;

  const tabs = details.querySelector('.tabs');
  const promises = [
    tabs ? loadBlock(tabs) : null,
    tabs ? loadStyle(`${miloLibs || codeRoot}/blocks/section-metadata/section-metadata.css`) : null,
    loadStyle(`${miloLibs || codeRoot}/features/georoutingv2/georoutingv2.css`),
  ];
  await Promise.all(promises);
  const { getModal } = await import('../../blocks/modal/modal.js');
  return getModal(null, { class: 'locale-modal-v2', id: 'locale-modal-v2', content: details, closeEvent: 'closeModal' });
}

export default async function loadGeoRouting(conf, createTagFunc, getMetadataFunc, loadBlockFunc, loadStyleFunc) {
  if (getGeoroutingOverride()) return;
  config = conf;
  createTag = createTagFunc;
  getMetadata = getMetadataFunc;
  loadBlock = loadBlockFunc;
  loadStyle = loadStyleFunc;

  const resp = await fetch(`${config.contentRoot ?? ''}/georoutingv2.json`);
  if (!resp.ok) {
    const { default: loadGeoRoutingOld } = await import('../georouting/georouting.js');
    loadGeoRoutingOld(config, createTag, getMetadata);
    return;
  }
  const json = await resp.json();

  const { locale } = config;

  const urlLocale = locale.prefix.replace('/', '');
  const storedInter = sessionStorage.getItem('international') || getCookie('international');
  const storedLocale = storedInter === 'us' ? '' : storedInter;

  const urlGeoData = json.georouting.data.find((d) => d.prefix === urlLocale);
  if (!urlGeoData) return;

  if (storedLocale || storedLocale === '') {
    // Show modal when url and cookie disagree
    if (urlLocale.split('_')[0] !== storedLocale.split('_')[0]) {
      const localeMatches = json.georouting.data.filter((d) => d.prefix === storedLocale);
      const details = await getDetails(urlGeoData, localeMatches, json.geos.data);
      if (details) {
        await showModal(details);
      }
    }
    return;
  }

  // Show modal when derived countries from url locale and akamai disagree
  const akamaiCode = await getAkamaiCode();
  if (akamaiCode && !getCodes(urlGeoData).includes(akamaiCode)) {
    const localeMatches = getMatches(json.georouting.data, akamaiCode);
    const details = await getDetails(urlGeoData, localeMatches, json.geos.data);
    if (details) {
      await showModal(details);
    }
  }
}

import { createTag, getMetadata, loadBlock, loadStyle } from '../../utils/utils.js';

let config;
let sendAnalyticsFunc;

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

function decorateForOnLinkClick(link, urlPrefix, localePrefix) {
  link.addEventListener('click', () => {
    const modPrefix = urlPrefix || 'us';
    // set cookie so legacy code on adobecom still works properly.
    const domain = window.location.host === 'adobe.com'
      || window.location.host.endsWith('.adobe.com') ? 'domain=adobe.com' : '';
    document.cookie = `international=${modPrefix};path=/;${domain}`;
    link.closest('.dialog-modal').dispatchEvent(new Event('closeModal'));
    if (localePrefix !== undefined) {
      const modCurrPrefix = localePrefix || 'us';
      sendAnalyticsFunc(new Event(`Stay:${modPrefix.split('_')[0]}-${modCurrPrefix.split('_')[0]}|Geo_Routing_Modal`));
    }
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

function openPicker(button, locales, country, event, dir) {
  if (document.querySelector('.locale-modal-v2 .picker')) {
    return;
  }
  const list = createTag('ul', { class: 'picker', dir });
  locales.forEach((l) => {
    const lang = config.locales[l.prefix]?.ietf ?? '';
    const a = createTag('a', { lang, href: l.url }, `${country} - ${l.language}`);
    decorateForOnLinkClick(a, l.prefix);
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

function buildContent(currentPage, locale, geoData, locales) {
  const fragment = new DocumentFragment();
  const lang = config.locales[locale.prefix]?.ietf ?? '';
  const dir = config.locales[locale.prefix]?.dir ?? 'ltr';
  const geo = geoData.filter((c) => c.prefix === locale.prefix);
  const titleText = geo.length ? geo[0][currentPage.geo] : '';
  const title = createTag('h3', { lang, dir }, locale.title.replace('{{geo}}', titleText));
  const text = createTag('p', { class: 'locale-text', lang, dir }, locale.text);
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
    { once: true },
  );
  img.src = `${config.miloLibs || config.codeRoot}/img/georouting/${flagFile}`;
  const span = createTag('span', { class: 'icon margin-inline-end' }, img);
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
      openPicker(mainAction, locales, locale.button, e, dir);
    });
  } else {
    mainAction.href = locale.url;
    decorateForOnLinkClick(mainAction, locale.prefix);
  }

  const altAction = createTag('a', { lang, href: currentPage.url }, currentPage.button);
  decorateForOnLinkClick(altAction, currentPage.prefix, locale.prefix);
  const linkWrapper = createTag('div', { class: 'link-wrapper' }, mainAction);
  linkWrapper.appendChild(altAction);
  fragment.append(title, text, linkWrapper);
  return fragment;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 18 18" width="18">
<defs>
  <style>
    .fill {
      fill: #464646;
    }
  </style>
</defs>
<title>S GlobeOutline 18 N</title>
<rect id="Canvas" fill="#ff13dc" opacity="0" width="18" height="18" /><path class="fill" d="M9,.925A8.14649,8.14649,0,0,0,.925,9,8.14649,8.14649,0,0,0,9,17.075,8.15,8.15,0,0,0,17.075,9,8.15,8.15,0,0,0,9,.925Zm6.8605,9.5435a6.9367,6.9367,0,0,1-.333,1.0715c-.0325.0825-.0555.1695-.091.25a7.041,7.041,0,0,1-.611,1.1255c-.017.0255-.0395.047-.057.0725A7.07192,7.07192,0,0,1,14,13.9195c-.046.05-.1.089-.15.136a7.04937,7.04937,0,0,1-.9225.761l-.0125.0085A6.98406,6.98406,0,0,1,9.1775,16c2.469-1.8605,2.167-2.95,3.566-4.506.468-.624-1.404-.78-2.9635-1.404-2.028-.936-1.25.624-2.808-1.092-.936-1.092-1.25-2.65,1.56-1.404.312.312.468-1.092,1.092-1.872.3115-.3115.3115-.6235.468-1.0915a1.0265,1.0265,0,0,0-2.028.156c0,.312-1.092-1.872-.312-1.872a5.54048,5.54048,0,0,1-1.56-.312c.1465-.075.3-.134.45-.1955a6.92039,6.92039,0,0,1,2.2765-.4265.72956.72956,0,0,1,.081,0c.156-.156-.936,1.092-.624,1.092s2.184.468,2.028.624C10.9395,2.759,10.21,2.17,9.4,2.021a6.94546,6.94546,0,0,1,3.115.936c.1695.1035.35.1865.5105.3055.0595.042.1095.095.168.1385a6.42155,6.42155,0,0,1,.9565.9195c-.312.156-.312.6235-.156.9355.3105.3105.314.311.929.0035.1.157.1795.326.2665.491-.0935.0365-.1295.13-.2595.13a2.5055,2.5055,0,0,0-.78,1.7155c0,2.496.624,1.56,1.404,1.872a.56847.56847,0,0,0,.406.15,7.13989,7.13989,0,0,1-.073.7225C15.8755,10.383,15.87,10.4265,15.8605,10.4685Zm-9.386,5.064A7.554,7.554,0,0,1,1.98,9a6.94486,6.94486,0,0,1,.111-1.147c.0245-.1465.045-.2935.0785-.4375A6.97439,6.97439,0,0,1,2.436,6.544c.0745-.1975.159-.391.25-.5805.064-.1345.1375-.2625.2105-.392a7.01588,7.01588,0,0,1,.56-.85c.0935-.1215.1935-.244.2935-.36.1325-.15.2645-.3.41-.441A6.97293,6.97293,0,0,1,4.788,3.4c.1455,1.3945-1.0905,2.175-.624,3.7295.624,2.028,1.404,1.092,2.34,2.496C7.586,11.171,9.2725,13.788,8.393,15.96A6.95273,6.95273,0,0,1,6.4745,15.5325Z" />
</svg>`;

async function getDetails(currentPage, localeMatches, geoData) {
  const availableLocales = await getAvailableLocales(localeMatches);
  if (availableLocales.length > 0) {
    const georoutingWrapper = createTag('div', { class: 'georouting-wrapper fragment' }, svg);
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
  // eslint-disable-next-line import/no-cycle
  const { getModal, sendAnalytics } = await import('../../blocks/modal/modal.js');
  sendAnalyticsFunc = sendAnalytics;
  return getModal(null, { class: 'locale-modal-v2', id: 'locale-modal-v2', content: details, closeEvent: 'closeModal' });
}

// source is stored or akamai
export default async function showGeorouting(conf, json, source, suggestedLocale, urlLocale) {
  config = conf;

  const isStored = source === 'stored';
  let localeMatches;
  if (isStored) {
    localeMatches = json.georouting.data.filter((d) => d.prefix === suggestedLocale);
  } else {
    localeMatches = getMatches(json.georouting.data, suggestedLocale);
  }

  const urlGeoData = json.georouting.data.find((d) => d.prefix === urlLocale);
  const details = await getDetails(urlGeoData, localeMatches, json.geos.data);
  if (details) {
    await showModal(details);

    if (isStored) {
      const urlLocaleGeo = urlLocale.split('_')[0];
      const storedLocaleGeo = suggestedLocale.split('_')[0];

      sendAnalyticsFunc(
        new Event(`Load:${storedLocaleGeo || 'us'}-${urlLocaleGeo || 'us'}|Geo_Routing_Modal`),
      );
    } else {
      sendAnalyticsFunc(
        new Event(`Load:${urlLocale || 'us'}-${suggestedLocale || 'us'}|Geo_Routing_Modal`),
      );
    }
  }
}

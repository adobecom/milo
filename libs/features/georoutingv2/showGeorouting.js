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

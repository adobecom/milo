import { createTag, getConfig } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import { initService } from '../merch/merch.js';

const MAS_AUTOBLOCK_TIMEOUT = 5000;
const DEFAULT_OPTIONS = { sidenav: true };
let log;

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), MAS_AUTOBLOCK_TIMEOUT);
  });
}

export function getOptions(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  const options = { ...DEFAULT_OPTIONS };
  for (const [key, value] of searchParams.entries()) {
    if (key === 'sidenav') options[key] = value === 'true';
    else options[key] = value;
  }
  options.fragment = options.query || options.fragment;
  return options;
}

/**
 * From element's text content extracts the first word, which should be the tag name.
 * @param el DOM element
 * @returns {*|string} tag name
 */
export function getTagName(el) {
  return el.textContent.trim().match(/^[^:\s]+/)?.[0] || 'merch-card';
}

async function loadDependencies(tagName) {
  /** Load service first */
  const servicePromise = initService();
  const success = await Promise.race([servicePromise, getTimeoutPromise()]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch');

  /** Load the control and any dependencies */
  const { base } = getConfig();

  if (tagName === 'merch-card-collection') {
    await import('../../deps/mas/merch-card-collection.js');
    await import('../../deps/mas/merch-sidenav.js');
    await import(`${base}/features/spectrum-web-components/dist/theme.js`);
    await import(`${base}/features/spectrum-web-components/dist/button.js`);
    await import(`${base}/features/spectrum-web-components/dist/action-button.js`);
    await import(`${base}/features/spectrum-web-components/dist/action-menu.js`);
    await import(`${base}/features/spectrum-web-components/dist/search.js`);
    await import(`${base}/features/spectrum-web-components/dist/sidenav.js`);
    await import(`${base}/features/spectrum-web-components/dist/menu.js`);
    await import(`${base}/features/spectrum-web-components/dist/checkbox.js`);
    await import(`${base}/features/spectrum-web-components/dist/dialog.js`);
    await import(`${base}/features/spectrum-web-components/dist/link.js`);
    await import(`${base}/features/spectrum-web-components/dist/overlay.js`);
    await import(`${base}/features/spectrum-web-components/dist/tray.js`);
    await import(`${base}/features/spectrum-web-components/dist/shared.js`);
    await import(`${base}/features/spectrum-web-components/dist/base.js`);
  }
}

/**
 * @param {string} fragment
 * @param {string} tagName
 */
function getTagAttributesAndContent(fragment, tagName) {
  let attributes;
  const html = createTag('aem-fragment', { fragment });
  if (tagName === 'merch-card') attributes = { consonant: '' };
  return [attributes, html];
}

export async function checkReady(masElement) {
  const readyPromise = masElement.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);

  if (!success) {
    log.error(`${masElement.tagName} did not initialize withing give timeout`);
  }
}

export function getCollectionSidenav(collection) {
  if (!collection.data) return null;
  const { hierarchy, placeholders } = collection.data;
  if (!hierarchy) return null;

  const titleKey = `${collection.variant}SidenavTitle`;
  const sidenav = createTag('merch-sidenav', { sidenavTitle: placeholders?.[titleKey] || '' });

  /* Search */
  const searchText = placeholders?.searchText;
  if (searchText) {
    const spectrumSearch = createTag('sp-search', { placeholder: searchText });
    const search = createTag('merch-search', { deeplink: 'search' });
    search.append(spectrumSearch);
    sidenav.append(search);
  }

  /* Filters */
  const spSidenav = createTag('sp-sidenav', { manageTabIndex: true });
  spSidenav.setAttribute('manageTabIndex', true);
  const sidenavList = createTag('merch-sidenav-list', { deeplink: 'filter' }, spSidenav);

  let multilevel = false;
  function generateLevelItems(level, parent) {
    for (const node of level) {
      const value = node.label.toLowerCase();
      const item = createTag('sp-sidenav-item', { label: node.label, value });
      if (node.icon) {
        const icon = createTag('img', { src: node.icon, slot: 'icon', style: 'height: fit-content;' });
        item.append(icon);
      }
      parent.append(item);
      if (node.collections) {
        multilevel = true;
        generateLevelItems(node.collections, item);
      }
    }
  }

  generateLevelItems(hierarchy, spSidenav);
  if (multilevel) spSidenav.setAttribute('variant', 'multilevel');

  sidenav.append(sidenavList);

  return sidenav;
}

export async function createMasElement(el, options, tagName) {
  const [attributes, html] = getTagAttributesAndContent(options.fragment, tagName);
  const masElement = createTag(tagName, attributes, html);
  let element = masElement;

  if (tagName === 'merch-card-collection' && options.sidenav) {
    const container = createTag('div', null, masElement);
    element = container;
  }

  el.replaceWith(element);
  await checkReady(masElement);

  if (tagName === 'merch-card-collection') {
    /* Placeholders */
    const placeholders = masElement.data?.placeholders || {};
    for (const key of Object.keys(placeholders)) {
      const value = placeholders[key];
      const tag = value.includes('<p>') ? 'div' : 'p';
      const placeholder = createTag(tag, { slot: key }, value);
      masElement.append(placeholder);
    }

    /* Sidenav */
    if (options.sidenav) {
      element.classList.add(`${masElement.variant}-container`);
      const sidenav = getCollectionSidenav(masElement);
      if (sidenav) {
        element.insertBefore(sidenav, masElement);
        masElement.sidenav = sidenav;
      }
    }

    masElement.requestUpdate();
  }
}

export default async function init(el) {
  const options = getOptions(el);
  if (!options.fragment) return;
  const tagName = getTagName(el);
  await loadDependencies(tagName);
  await createMasElement(el.closest('.content'), options, tagName);
}

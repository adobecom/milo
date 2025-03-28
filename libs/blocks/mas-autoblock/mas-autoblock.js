import { createTag, getConfig } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import { initService } from '../merch/merch.js';

// Should probably be removed (?)
const DEFAULT_PLACEHOLDERS = {
  searchText: 'Search all products',
  filtersText: 'Filters',
  sortText: 'Sort',
  popularityText: 'Popularity',
  alphabeticallyText: 'Alphabetically',
  noResultsText: '0 results',
  resultText: '1 result in <strong><span data-placeholder="filter"></span></strong>',
  resultsText: '<span data-placeholder="resultCount"></span> results in <strong><span data-placeholder="filter"></span></strong>',
  searchResultText: '1 result for <strong><span data-placeholder="searchTerm"></span></strong>',
  searchResultsText: '<span data-placeholder="resultCount"></span> results for <strong><span data-placeholder="searchTerm"></span></strong>',
  searchResultMobileText: '1 result for: <strong><span data-placeholder="searchTerm"></span></strong>',
  searchResultsMobileText: '<span data-placeholder="resultCount"></span> results for: <strong><span data-placeholder="searchTerm"></span></strong>',
  noSearchResultsText: 'Your search for <strong><span data-placeholder="searchTerm"></span></strong> did not yield any results.',
  noSearchResultsMobileText: '<p>Your search for <strong><span data-placeholder="searchTerm"></span></strong> did not yield any results. Try a different search term.</p><p>Suggestions:</p><ul><li>Make sure all words are spelled correctly</li><li>Use quotes to search for an entire phrase, such as "crop an image"</li></ul>',
  showMoreText: 'Show more',
  plansSidenavTitle: 'Categories',
};
const MAS_AUTOBLOCK_TIMEOUT = 5000;
let log;
const defaultOptions = { sidenav: true };

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), MAS_AUTOBLOCK_TIMEOUT);
  });
}

export function getOptions(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  const options = { ...defaultOptions };
  for (const [key, value] of searchParams.entries()) {
    switch (key) {
      case 'sidenav':
        options[key] = value === 'true';
        break;
      default:
        options[key] = value;
    }
  }
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

async function loadControl(tagName) {
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
  switch (tagName) {
    case 'merch-card-collection':
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
      break;
    default:
      break;
  }
}

/**
 * @param {string} fragment
 * @param {string} tagName
 */
function getTagAttributesAndContent(fragment, tagName) {
  let attributes;
  const html = createTag('aem-fragment', { fragment });
  switch (tagName) {
    case 'merch-card':
      attributes = { consonant: '' };
      break;
    case 'merch-card-collection':
    default:
      break;
  }
  return [attributes, html];
}

export async function checkReady(control) {
  const readyPromise = control.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);

  if (!success) {
    log.error(`${control.tagName} did not initialize withing give timeout`);
  }
}

export function getCollectionSidenav(control) {
  if (!control.data) return null;
  const { hierarchy } = control.data;
  const placeholders = control.data.placeholders || DEFAULT_PLACEHOLDERS;
  if (!hierarchy) return null;

  const titleKey = `${control.variant}SidenavTitle`;
  const sidenav = createTag('merch-sidenav', { sidenavTitle: placeholders?.[titleKey] });

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

export async function createControl(el, options, tagName) {
  const [attributes, html] = getTagAttributesAndContent(options.fragment, tagName);
  const control = createTag(tagName, attributes, html);
  let element = control;

  switch (tagName) {
    case 'merch-card-collection':
      if (options.sidenav) {
        const container = createTag('div', null, control);
        element = container;
      }
      break;
    default:
      break;
  }

  el.replaceWith(element);
  await checkReady(control);

  switch (tagName) {
    case 'merch-card-collection': {
      /* Placeholders */
      const placeholders = control.data?.placeholders || DEFAULT_PLACEHOLDERS;
      for (const key of Object.keys(placeholders)) {
        const value = placeholders[key];
        const tag = value.includes('<p>') ? 'div' : 'p';
        const placeholder = createTag(tag, { slot: key }, value);
        control.append(placeholder);
      }

      /* Sidenav */
      if (options.sidenav) {
        element.classList.add(`${control.variant}-container`);
        const sidenav = getCollectionSidenav(control);
        if (!sidenav) break;
        element.insertBefore(sidenav, control);
        control.sidenav = sidenav;
      }

      control.requestUpdate();

      break;
    }
    default:
      break;
  }
}

export default async function init(el) {
  const options = getOptions(el);
  if (!options.fragment) return;
  const tagName = getTagName(el);
  await loadControl(tagName);
  await createControl(el.closest('.content'), options, tagName);
}

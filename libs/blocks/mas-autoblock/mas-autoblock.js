import { createTag, getConfig } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import { initService } from '../merch/merch.js';

const DEFAULT_PLACEHOLDERS = {
  searchText: 'Search all products',
  filtersText: 'Filters',
  sortText: 'Sort',
  popularityText: 'Popularity',
  alphabeticallyText: 'Alphabetically',
  noResultsText: '0 results',
  resultText: '1 result in All',
  resultsText: '111 results in All',
  searchResultText: '1 result for',
  searchResultsText: '111 results for',
  searchResultMobileText: '1 result for: ',
  searchResultsMobileText: '111 results for: ',
  noSearchResultsText: 'Your search for',
  noSearchResultsMobileText: 'Your search for',
  showMoreText: 'Show more',
};

export function getFragmentId(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  return searchParams.get('fragment');
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
  const { base } = getConfig();
  switch (tagName) {
    case 'merch-card-collection':
      await import('../../deps/mas/merch-card-collection.js');
      await import(`${base}/features/spectrum-web-components/dist/theme.js`);
      await import(`${base}/features/spectrum-web-components/dist/button.js`);
      await import(`${base}/features/spectrum-web-components/dist/action-button.js`);
      await import(`${base}/features/spectrum-web-components/dist/action-menu.js`);
      await import(`${base}/features/spectrum-web-components/dist/search.js`);
      await import(`${base}/features/spectrum-web-components/dist/menu.js`);
      await import(`${base}/features/spectrum-web-components/dist/overlay.js`);
      await import(`${base}/features/spectrum-web-components/dist/tray.js`);
      break;
    default:
      break;
  }
}

/**
 * @param {string} fragment
 * @param {string} tagName
 */
function getTagOptions(fragment, tagName) {
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

export function createControl(el, fragment) {
  const tagName = getTagName(el);
  const [attributes, html] = getTagOptions(fragment, tagName);
  const control = createTag(tagName, attributes, html);
  el.replaceWith(control);
  return control;
}

async function postProcess(control, tagName) {
  await control.checkReady();
  switch (tagName) {
    case 'merch-card-collection': {
      const placeholders = control.data?.placeholders || DEFAULT_PLACEHOLDERS;
      for (const key of Object.keys(placeholders)) {
        const placeholder = createTag('p', { slot: key }, placeholders[key]);
        control.append(placeholder);
      }
      break;
    }
    default:
      break;
  }
}

export default async function init(el) {
  const fragment = getFragmentId(el);
  if (!fragment) return;
  await initService();
  const tagName = getTagName(el);
  await loadControl(tagName);
  const control = createControl(el, fragment);
  await postProcess(control, tagName);
}

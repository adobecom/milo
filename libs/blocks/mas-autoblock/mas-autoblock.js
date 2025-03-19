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
};
const MAS_AUTOBLOCK_TIMEOUT = 5000;
let log;

function getTimeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(false), MAS_AUTOBLOCK_TIMEOUT);
  });
}

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

export async function checkReady(control) {
  const readyPromise = control.checkReady();
  const success = await Promise.race([readyPromise, getTimeoutPromise()]);

  if (!success) {
    log.error('Merch card did not initialize withing give timeout');
  }
}

function postProcess(control, tagName) {
  switch (tagName) {
    case 'merch-card-collection': {
      const placeholders = control.data?.placeholders || DEFAULT_PLACEHOLDERS;
      for (const key of Object.keys(placeholders)) {
        const value = placeholders[key];
        const tag = value.includes('<p>') ? 'div' : 'p';
        const placeholder = createTag(tag, { slot: key }, value);
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
  const tagName = getTagName(el);
  await loadControl(tagName);
  const control = createControl(el, fragment);
  await checkReady(control);
  postProcess(control, tagName);
}

import { createTag } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import { initService } from '../merch/merch.js';

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

/**
 * @param {HTMLElement} el
 * @param {string} fragment
 */
async function getTagOptions(el, fragment) {
  const tagName = getTagName(el);
  let attributes;
  const html = createTag('aem-fragment', { fragment });
  switch (tagName) {
    case 'merch-card':
      attributes = { consonant: '' };
      break;
    case 'merch-card-collection':
      await import('../../deps/mas/merch-card-collection.js');
      break;
    default:
      break;
  }
  return [tagName, attributes, html];
}

export async function createCard(el, fragment) {
  const [tagName, attributes, html] = await getTagOptions(el, fragment);
  const element = createTag(tagName, attributes, html);
  el.replaceWith(element);
  await element.checkReady();
}

export default async function init(el) {
  const fragment = getFragmentId(el);
  if (!fragment) return;
  await initService();
  await createCard(el, fragment);
}

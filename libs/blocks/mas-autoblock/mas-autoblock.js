import { createTag } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-quantity-select.js';

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

export async function createCard(el, fragment) {
  const aemFragment = createTag('aem-fragment', { fragment });
  const merchCard = createTag(getTagName(el), { consonant: '' }, aemFragment);
  el.replaceWith(merchCard);
  await merchCard.checkReady();
}

export default async function init(el) {
  const fragment = getFragmentId(el);
  if (!fragment) return;
  await createCard(el, fragment);
}

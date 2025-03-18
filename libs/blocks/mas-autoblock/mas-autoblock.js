import { createTag } from '../../utils/utils.js';
import '../../deps/mas/merch-card.js';
import '../../deps/mas/merch-quantity-select.js';
import { initService } from '../merch/merch.js';

const MAS_AUTOBLOCK_TIMEOUT = 5000;
let log;

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
  // add <mas-commerce-service>
  const servicePromise = initService();
  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => resolve(false), MAS_AUTOBLOCK_TIMEOUT);
  });
  let success = await Promise.race([servicePromise, timeoutPromise]);
  if (!success) {
    throw new Error('Failed to initialize mas commerce service');
  }
  const service = await servicePromise;
  log = service.Log.module('merch');

  const aemFragment = createTag('aem-fragment', { fragment });
  const merchCard = createTag(getTagName(el), { consonant: '' }, aemFragment);
  el.replaceWith(merchCard);
  const merchCardPromise = merchCard.checkReady();
  success = await Promise.race([merchCardPromise, timeoutPromise]);

  if (!success) {
    log.error('Merch card did not initialize withing give timeout');
  }
}

export default async function init(el) {
  const fragment = getFragmentId(el);
  if (!fragment) return;
  await createCard(el, fragment);
}

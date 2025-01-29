import { createTag, getConfig } from '../../utils/utils.js';
import { initService } from '../merch/merch.js';

export function getFragmentId(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  return searchParams.get('fragment');
}

export function getTagName(el) {
  const defaultTagName = 'merch-card';
  const tokens = el.textContent.trim().split(' ');
  return tokens[0].replace(':', '').trim() || defaultTagName;
}

export async function createCard(el, fragment) {
  const aemFragment = createTag('aem-fragment', { fragment });
  const merchCard = createTag(getTagName(el), { consonant: '' }, aemFragment);
  el.replaceWith(merchCard);
  await aemFragment.updateComplete;
  await merchCard.checkReady();
}

export default async function init(el) {
  const fragment = getFragmentId(el);
  if (!fragment) return;

  const { base } = getConfig();
  await Promise.all([
    import(`${base}/deps/mas/mas.js`),
    initService(),
  ]);
  await createCard(el, fragment);
}

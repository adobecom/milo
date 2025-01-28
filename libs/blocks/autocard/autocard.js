import { createTag } from '../../utils/utils.js';

export default function init(el) {
  const { hash } = new URL(el.href);
  const hashValue = hash.startsWith('#') ? hash.substring(1) : hash;
  const searchParams = new URLSearchParams(hashValue);
  const fragment = searchParams.get('fragment');

  if (!fragment) return;

  import('../../deps/mas/mas.js');
  const aemFragment = createTag('aem-fragment', { fragment });
  const merchCard = createTag('merch-card', { consonant: '' }, aemFragment);
  el.replaceWith(merchCard);
}

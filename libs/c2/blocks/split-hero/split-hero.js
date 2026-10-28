import { decorateBlockText, decorateViewportContent, normalizeMasFieldText } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';
import { buildMerchCard } from '../product-marquee-grid/product-marquee-grid.js';

function decorate(block, root) {
  const row = block.firstElementChild;
  const [copy, merch, media] = row?.children || [];
  if (!copy) return;

  decorateBlockText(copy, { heading: '2', body: 'md', button: 'md' });
  const [heading, ...otherHeadings] = copy.querySelectorAll('h1, h2, h3, h4, h5, h6');
  otherHeadings.forEach((other) => other.classList.remove('heading-2'));
  const eyebrow = heading?.previousElementSibling;
  if (eyebrow?.matches('p')) eyebrow.classList.add('sh-product-lockup', 'eyebrow');
  normalizeMasFieldText(copy, 'md');
  copy.classList.add('sh-text');

  const supporting = row.nextElementSibling?.firstElementChild;
  const copyGroup = createTag('div', { class: 'sh-copy' }, copy);
  const foreground = createTag('div', { class: 'sh-foreground' }, copyGroup);
  if (merch?.children.length) {
    const card = buildMerchCard(merch);
    if (root.classList.contains('special-promo')) {
      card.classList.add(root.classList.contains('dark') ? 'light' : 'dark');
    }
    copyGroup.append(createTag('div', { class: 'sh-promo-area' }, card));
  }
  if (supporting) {
    supporting.classList.add('sh-supporting', 'caption');
    foreground.append(supporting);
  }

  const content = createTag('div', { class: 'sh-content container' }, foreground);
  if (media) {
    const frame = createTag('div', { class: 'sh-media-frame' });
    frame.append(...media.childNodes);
    media.append(frame);
    media.classList.add('sh-media');
    content.append(media);
  }
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}

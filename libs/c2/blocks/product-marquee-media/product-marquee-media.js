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
  if (eyebrow?.matches('p')) eyebrow.classList.add('pm-product-lockup', 'eyebrow');
  normalizeMasFieldText(copy, 'md');
  copy.classList.add('pm-text');

  const supporting = row.nextElementSibling?.firstElementChild;
  const copyGroup = createTag('div', { class: 'pm-copy' }, copy);
  const foreground = createTag('div', { class: 'pm-foreground' }, copyGroup);
  if (merch?.children.length) {
    const card = buildMerchCard(merch);
    if (root.classList.contains('special-promo')) {
      card.classList.add(root.classList.contains('dark') ? 'light' : 'dark');
    }
    copyGroup.append(createTag('div', { class: 'pm-promo-area' }, card));
  }
  if (supporting) {
    supporting.classList.add('pm-supporting', 'caption');
    foreground.append(supporting);
  }

  const content = createTag('div', { class: 'pm-content container' }, foreground);
  if (media) {
    const frame = createTag('div', { class: 'pm-media-frame' });
    frame.append(...media.childNodes);
    media.append(frame);
    media.classList.add('pm-media');
    content.append(media);
  }
  block.replaceChildren(content);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}

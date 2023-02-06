import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../../libs/utils/decorate.js';
import { decorateBlockAnalytics } from '../../../libs/martech/attributes.js';

const blockTypeSizes = {
  small: ['XS', 'S', 'M'],
  medium: ['M', 'S', 'M'],
  large: ['XL', 'M', 'L'],
  xlarge: ['XXL', 'M', 'L'],
};

export default function init(el) {
  decorateBlockAnalytics(el);
  const children = el.querySelectorAll(':scope > div');
  if (children[0]?.childElementCount === 1) {
    decorateBlockBg(el, children[0]);
  }
  const size = getBlockSize(el);
  const media = el.querySelectorAll(':scope > div:not([class])');
  const container = document.createElement('div');
  container.classList.add('container', 'foreground');
  media.forEach((row) => {
    row.classList.add('media-row');
    const header = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (header) {
      const text = header.closest('div');
      text.innerText = `NEW MEDIA BLOCK CODE! ${text.innerText}`;
      text.classList.add('text');
      decorateBlockText(text, blockTypeSizes[size]);
    }
    const image = row.querySelector(':scope > div:not([class])');
    if (image) image.classList.add('image');
    const img = image.querySelector(':scope img');
    if (header && img?.alt === '') img.alt = header.textContent;
    container.append(row);
  });
  el.append(container);
  const mediaRowReversed = el.querySelector(':scope > .foreground > .media-row > div').classList.contains('text');
  if (mediaRowReversed) el.classList.add('media-reverse-mobile');
}

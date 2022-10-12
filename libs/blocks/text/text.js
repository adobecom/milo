
import { decorateBlockBg, decorateIconArea, decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { decorateLinkAnalytics } from '../../utils/analytics.js';
import { createTag } from '../../utils/utils.js';

export function decorateText(el, size = 'medium') {
  decorateButtons(el);
  decorateIconArea(el);
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const decorate = (headingEl, headingSize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.previousElementSibling?.classList.add(`detail-${detailSize}`);
  };
  headings.forEach((heading) => {
    if (size === 'small') {
      decorate(heading, 'S', 'S');
    } else if (size === 'large') {
      decorate(heading, 'L', 'L');
    } else if (size === 'xlarge') {
      decorate(heading, 'XL', 'XL');
    } else {
      decorate(heading, 'M', 'M');
    }
  });
  const emptyPs = el.querySelectorAll(":scope p:not([class])");
  emptyPs.forEach((p) => { p.classList.add(`body-M`) });
  decorateLinkAnalytics(el, headings);
}

export default function init(el) {
  el.setAttribute('data-util', 'block');
  el.classList.add('text-block');
  const rows = el.querySelectorAll(':scope > div');
  const container = createTag('div', { class: 'foreground container grid' });
  if (rows.length > 1) decorateBlockBg(el, rows[0]);
  const size = getBlockSize(el);
  decorateText(el, size);
  el.appendChild(container);
  const textRows = el.querySelectorAll(':scope > div:not([class])');
  textRows.forEach((row, idx) => {
    row.classList.add('text');
    container.insertAdjacentElement('beforeend', row);
  });
}

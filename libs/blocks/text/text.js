
import { decorateBlockBg, decorateIconArea, decorateButtons, getBlockSize, setDataConBlockAttribute } from '../../utils/decorate.js';
import { decorateLinkAnalytics } from '../../martech/attributes.js';
import { createTag } from '../../utils/utils.js';

function getSizeClassName(s, t = 'body') {
  if (s.startsWith('xs') || s.startsWith('xl')) {
    return `${t}_${s[0]+s[1].toUpperCase()}`;
  } else {
    return `${t}_${s[0].toUpperCase()}`;
  }
}

export function decorateText(el, size = 'medium') {
  decorateButtons(el, size);
  const inset = el.classList.contains('inset');
  if (!inset) decorateIconArea(el, size);
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const decorate = (headingEl, headingSize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    if (!inset) headingEl.previousElementSibling?.classList.add(`detail-${detailSize}`);
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
  const emptyPs = el.querySelectorAll(':scope p:not([class])');
  const lists = el.querySelectorAll('ul, ol');
  if (inset) {
    emptyPs.forEach((p) => { p.classList.add(`body-L`) });
    if (!lists) return;
    lists.forEach((list) => { list.classList.add('body-M') });
  } else {
    emptyPs.forEach((p) => { p.classList.add(`body-M`) });
  }
  const actionArea = el.querySelectorAll('.action-area');
  if (size && size === 'small') actionArea.forEach((area) => { area.classList.add('body-XS'); });
  decorateLinkAnalytics(el, headings);
}

export default function init(el) {
  setDataConBlockAttribute(el);
  el.classList.add('text-block');
  const rows = el.querySelectorAll(':scope > div');
  let classList = 'foreground';
  if (el.classList.contains('contained')) {
    classList = classList + ' container';
  };

  const container = createTag('div', { class: classList });
  if (rows.length > 1) {
    decorateBlockBg(el, rows[0]);
    el.classList.add('has-bg');
  }
  const size = getBlockSize(el);
  decorateText(el, size);
  el.appendChild(container);
  const textRows = el.querySelectorAll(':scope > div:not([class])');
  textRows.forEach((row, idx) => {
    row.classList.add('text');
    container.insertAdjacentElement('beforeend', row);
  });
}

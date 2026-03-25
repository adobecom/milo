import { createTag, decorateLinksAsync } from '../../utils/utils.js';

const HEADING_CLASS_MAP = {
  H1: 'heading-xl',
  H2: 'heading-l',
  H3: 'heading-m',
  H4: 'heading-s',
  H5: 'heading-xs',
  H6: 'heading-xs',
};

function alignItems(el) {
  const items = [...el.querySelectorAll(':scope > .sitemap-base-item')];
  const heading = items
    .map((item) => item.querySelector('h1, h2, h3, h4, h5, h6'))
    .find(Boolean);
  if (!heading) return;

  const headingClass = HEADING_CLASS_MAP[heading.tagName];
  const style = window.getComputedStyle(heading);
  const marginBlock = `${style.marginBlockStart} ${style.marginBlockEnd}`;

  items.forEach((item) => {
    if (!item.querySelector('h1, h2, h3, h4, h5, h6')) {
      const spacer = createTag('div', {
        class: `sitemap-base-spacer ${headingClass}`,
        style: `margin-block: ${marginBlock}`,
        'aria-hidden': 'true',
      }, '\u00a0');
      const target = item.querySelector(':scope > div') || item;
      target.prepend(spacer);
    }
  });
}

export default async function init(el) {
  const items = el.querySelectorAll(':scope > div');

  items.forEach((item, index) => {
    item.classList.add('sitemap-base-item', `sitemap-base-item-${index + 1}`);
  });

  if (el.classList.contains('align-headings')) alignItems(el);

  await decorateLinksAsync(el);
}

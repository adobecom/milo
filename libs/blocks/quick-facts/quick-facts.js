import { createTag } from '../../utils/utils.js';
import { decorateBlockText, decorateTextOverrides } from '../../utils/decorate.js';

export default function init(el) {
  el.classList.add('con-block');
  const foreground = createTag('div', { class: 'foreground' });
  el.append(foreground);
  const logo = el.querySelector(':scope > div:not([class])');
  if (logo.querySelector('picture')) {
    logo.classList.add('quick-facts-logo');
    foreground.append(logo);
  }
  const rows = el.querySelectorAll(':scope > div:not([class])');
  const facts = createTag('div', { class: 'fact-list' });
  const isInset = !el.classList.contains('no-inset');
  rows.forEach((row) => {
    const heading = row.querySelector(':is(h1, h2, h3, h4, h5, h6)');
    heading?.classList.add('fact-title');
    if (isInset) heading?.classList.add('inset');
    const boldEl = row.querySelector('strong');
    boldEl?.parentElement.classList.add('titlebody-xl', 'fact-title');
    if (isInset) boldEl?.parentElement.classList.add('inset');
    facts.append(row);
  });
  const productList = rows[rows.length - 1];
  productList.classList.add('product-list');
  foreground.append(facts, productList);
  decorateBlockText(el, ['m', 's'], 'merch');
  const subheading = el.querySelector('.product-list :is(h1, h2, h3, h4, h5, h6)');
  subheading?.classList.remove('heading-m');
  subheading?.classList.add('subheading-xs', 'product-title');
  if (isInset) subheading?.classList.add('inset');
  decorateTextOverrides(el, ['-heading', '-body', '-subheading', '-titlebody']);
}

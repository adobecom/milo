import { createTag, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const defaultItemWidth = (cols) => (cols === 3 ? 160 : 147);
const PREVBUTTON = `<button class="nav-button previous-button"><img class="previous-icon" alt="Previous icon" src="${base}/blocks/carousel/img/arrow.svg"></button>`;
const NEXTBUTTON = `<button class="nav-button next-button"><img class="next-icon" alt="Next icon" src="${base}/blocks/carousel/img/arrow.svg"></button>`;

const getBlockProps = (el) => [...el.childNodes].reduce((attr, row) => {
  if (row.children) {
    const [key, value] = row.children;
    if (key && value) {
      attr[key.textContent.trim().toLowerCase()] = value.textContent
        .trim()
        .toLowerCase();
    }
  }
  return attr;
}, {});

function setBlockProps(el, columns) {
  const attrs = getBlockProps(el);
  const itemWidth = attrs['item width'] ?? defaultItemWidth(columns);
  const overrides = attrs.style
    ? attrs.style
      .split(', ')
      .map((style) => style.replaceAll(' ', '-'))
      .join(' ')
    : '';
  el.style.setProperty('--action-scroller-columns', columns);
  el.style.setProperty('--action-scroller-item-width', itemWidth);
  return `scroller ${columns <= 5 ? 'justify-center' : ''} ${overrides}`;
}

function handleScroll(el, btn) {
  const itemWidth = el.parentElement?.style?.getPropertyValue('--action-scroller-item-width');
  const gapStyle = window
    .getComputedStyle(el, null)
    .getPropertyValue('column-gap');
  const scrollDistance = parseInt(itemWidth, 10) + parseInt(gapStyle.replace('px', ''), 10);
  el.scrollLeft = btn[1].includes('next-button')
    ? el.scrollLeft + scrollDistance
    : el.scrollLeft - scrollDistance;
}

function handleBtnState(el, [prev, next]) {
  const { scrollLeft, scrollWidth, clientWidth } = el;
  const hidePrev = scrollLeft === 0;
  const hideNext = Math.ceil(scrollLeft) === Math.ceil(scrollWidth - clientWidth);
  prev.setAttribute('hide-btn', hidePrev);
  next.setAttribute('hide-btn', hideNext);
  el.setAttribute('hide-mask', hidePrev && hideNext);
}

function handleNavigation(el) {
  const prev = createTag('div', { class: 'nav-grad previous' }, PREVBUTTON);
  const next = createTag('div', { class: 'nav-grad next' }, NEXTBUTTON);
  const buttons = [prev, next];
  buttons.forEach((btn) => {
    const button = btn.childNodes[0];
    button.addEventListener('click', () => handleScroll(el, button.classList));
  });
  return buttons;
}

export default function init(el) {
  const hasNav = el.classList.contains('navigation');
  const actions = el.parentElement.querySelectorAll('.action-item');
  const style = setBlockProps(el, actions.length);
  const items = createTag('div', { class: style }, null);
  const buttons = hasNav ? handleNavigation(items) : [];
  items.append(...actions);
  el.replaceChildren(items, ...buttons);
  if (hasNav) {
    items.addEventListener('scroll', () => handleBtnState(items, buttons));
    setTimeout(() => handleBtnState(items, buttons), 200);
  }
}

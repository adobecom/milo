import { createTag, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const [NAV, ALIGN] = ['navigation', 'grid-align'];
const defaultItemWidth = 106;
const defaultGridGap = 32;
const defaultPadding = 50;

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

function parsePxToInt(pxString, defaultValue) {
  if (!pxString) return defaultValue;
  const parsedValue = parseInt(pxString.replace('px', ''), 10);
  return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
}

export function getScrollerPropertyValues(el) {
  const itemWidthStyle = el.parentElement?.style?.getPropertyValue('--action-scroller-item-width');
  const itemWidth = itemWidthStyle ? Number(itemWidthStyle) : defaultItemWidth;
  const columns = Number(el.parentElement?.style?.getPropertyValue('--action-scroller-columns'));

  const elProperties = window.getComputedStyle(el);

  const gapStyle = elProperties.getPropertyValue('column-gap');
  const gridGap = parsePxToInt(gapStyle, defaultGridGap);
  const scrollDistance = itemWidth + gridGap;

  const paddingStyle = elProperties.getPropertyValue('--action-scroller-mobile-padding');
  const padding = parsePxToInt(paddingStyle, defaultPadding);

  return { itemWidth, columns, gridGap, scrollDistance, padding };
}

export function hideNavigation(el) {
  const { itemWidth, gridGap, columns, padding } = getScrollerPropertyValues(el);
  const elHasWidth = !!el.clientWidth;
  const scrollWidth = itemWidth * columns + gridGap * (columns - 1) + 2 * padding;
  const screenWidth = window.innerWidth < 1200 ? window.innerWidth : 1200;
  const horizontalScroll = Math.ceil(el.scrollLeft) === Math.ceil(el.scrollWidth - el.clientWidth);

  return elHasWidth ? horizontalScroll : scrollWidth < screenWidth;
}

function setBlockProps(el, columns) {
  const attrs = getBlockProps(el);
  const itemWidth = attrs['item width'] ?? defaultItemWidth;
  const overrides = attrs.style
    ? attrs.style
      .split(', ')
      .map((style) => style.replaceAll(' ', '-'))
      .join(' ')
    : '';
  const gridAlign = [...el.classList].filter((cls) => cls.toLowerCase().includes(ALIGN))
    ?? 'grid-align-start';
  el.style.setProperty('--action-scroller-columns', columns);
  el.style.setProperty('--action-scroller-item-width', itemWidth);
  return `scroller ${gridAlign} ${overrides}`;
}

function handleScroll(el, btn) {
  const { scrollDistance } = getScrollerPropertyValues(el);
  el.scrollLeft = btn[1].includes('next-button')
    ? el.scrollLeft + scrollDistance
    : el.scrollLeft - scrollDistance;
}

function handleBtnState(
  el,
  [prev, next],
) {
  prev.setAttribute('hide-btn', el.scrollLeft === 0);
  next.setAttribute(
    'hide-btn',
    hideNavigation(el),
  );
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
  const hasNav = el.classList.contains(NAV);
  const actions = el.parentElement.querySelectorAll('.action-item');
  const style = setBlockProps(el, actions.length);
  const items = createTag('div', { class: style }, null);
  const buttons = hasNav ? handleNavigation(items) : [];
  items.append(...actions);
  el.replaceChildren(items, ...buttons);
  if (hasNav) {
    items.addEventListener('scroll', () => handleBtnState(items, buttons));
    handleBtnState(items, buttons);
  }
}

/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/*
* Action Carousel - v1.0
*/

import { delay } from '../../../test/helpers/waitfor.js';
import { createTag, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const [NAV, ALIGN] = ['navigation', 'grid-align'];
const gridStyle = 'nested section auto-up no-row-gap';

const PREVBUTTON = `<button class="nav-button previous-button"><img class="previous-icon" alt="Previous icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16"></button>`;
const NEXTBUTTON = `<button class="nav-button next-button"><img class="next-icon" alt="Next icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16"></button>`;

const getCarouselAttrs = el => [...el.childNodes].reduce((attr, row) => {
  if (row.children) {
    const [key, value] = row.children;
    if (key && value) attr[key.textContent.trim().toLowerCase()] = value.textContent.trim().toLowerCase();
  }
  return attr;
}, {});

function handleGridAttrs(el, columns) {
  const attrs = getCarouselAttrs(el);
  const itemWidth = attrs['item width override'] ?? '106.5';
  const overrides = attrs.style ? attrs.style.split(', ').map((style) => style.replaceAll(' ', '-')).join(' ') : '';
  const gridAlign = [...el.classList].filter(cls => cls.toLowerCase().includes(ALIGN)) ?? 'grid-align-start';
  el.style.setProperty('--action-scroller-background', el.parentElement?.style?.background ?? 'white');
  el.style.setProperty('--action-scroller-columns', columns);
  el.style.setProperty('--action-scroller-item-width', itemWidth);
  el.setAttribute('item-width', itemWidth);
  return `${gridStyle} ${gridAlign} ${overrides}`;
}

function handleNavigate(el, btn) {
  const nextClick = btn[1].includes('next-button');
  const itemWidth = el.parentElement.getAttribute('item-width');
  // (itemwidth plus grid gap) for scrolling incriment
  const distance = (parseInt(itemWidth) + 32);
  el.scrollLeft = nextClick ? (el.scrollLeft + distance) : (el.scrollLeft - distance);
}

function handleBtnState({ scrollLeft, scrollWidth, clientWidth }, [prev, next]) {
  prev.setAttribute('hide-btn', scrollLeft === 0);
  next.setAttribute('hide-btn', Math.ceil(scrollLeft) === Math.ceil((scrollWidth - clientWidth)));
}

function handleNavigation(el) {
  const prev = createTag('div', { class: 'nav-grad previous' }, PREVBUTTON);
  const next = createTag('div', { class: 'nav-grad next' }, NEXTBUTTON);
  const navBtns = [prev, next];
  navBtns.forEach(btn => {
    const button = btn.childNodes[0];
    button.addEventListener('click', () => handleNavigate(el, button.classList));
  });
  return navBtns;
}

export default function init(el) {
  const actions = el.parentElement.querySelectorAll('.action-item');
  const style = handleGridAttrs(el, actions.length);
  const items = createTag('div', { class: style }, null);
  const hasNav = el.classList.contains(NAV);
  const navBtns = hasNav ? handleNavigation(items) : [];
  items.append(...actions);
  el.replaceChildren(items, ...navBtns);
  if (hasNav) {
    items.addEventListener('scroll', () => handleBtnState(items, navBtns));
    delay(200, () => handleBtnState(items, navBtns));
  }
}

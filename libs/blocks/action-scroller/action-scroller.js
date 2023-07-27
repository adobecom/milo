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
* Action Scroller - v1.0
*/

import { createTag, getConfig } from '../../utils/utils.js';

const { miloLibs, codeRoot } = getConfig();
const base = miloLibs || codeRoot;

const [NAV, ALIGN] = ['navigation', 'grid-align'];
const gridStyle = 'section no-pad auto-up no-row-gap';
const defaultItemWidth = 106.5;
const defaultGridGap = 32;

const PREVBUTTON = `<button class="nav-button previous-button"><img class="previous-icon" alt="Previous icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16"></button>`;
const NEXTBUTTON = `<button class="nav-button next-button"><img class="next-icon" alt="Next icon" src="${base}/blocks/carousel/img/arrow.svg" height="10" width="16"></button>`;

const getBlockProps = (el) => [...el.childNodes].reduce((attr, row) => {
  if (row.children) {
    const [key, value] = row.children;
    if (key && value) attr[key.textContent.trim().toLowerCase()] = value.textContent.trim().toLowerCase();
  }
  return attr;
}, {});

function setBlockProps(el, columns) {
  const attrs = getBlockProps(el);
  const itemWidth = attrs['item width'] ?? defaultItemWidth;
  const overrides = attrs.style ? attrs.style.split(', ').map((style) => style.replaceAll(' ', '-')).join(' ') : '';
  const gridAlign = [...el.classList].filter((cls) => cls.toLowerCase().includes(ALIGN)) ?? 'grid-align-start';
  el.style.setProperty('--action-scroller-background', el.parentElement?.style?.background ?? 'white');
  el.style.setProperty('--action-scroller-columns', columns);
  el.style.setProperty('--action-scroller-item-width', itemWidth);
  return `${gridStyle} ${gridAlign} ${overrides}`;
}

function handleScroll(el, btn) {
  const itemWidth = el.parentElement?.style?.getPropertyValue('--action-scroller-item-width') ?? defaultItemWidth;
  const gapStyle = window.getComputedStyle(el, null).getPropertyValue('column-gap');
  const gridGap = gapStyle ? parseInt(gapStyle.replace('px', ''), 10) : defaultGridGap;
  const scrollDistance = (parseInt(itemWidth, 10) + gridGap); // itemwidth plus grid gap
  el.scrollLeft = btn[1].includes('next-button') ? (el.scrollLeft + scrollDistance) : (el.scrollLeft - scrollDistance);
}

function handleBtnState({ scrollLeft, scrollWidth, clientWidth }, [prev, next]) {
  prev.setAttribute('hide-btn', scrollLeft === 0);
  next.setAttribute('hide-btn', Math.ceil(scrollLeft) === Math.ceil((scrollWidth - clientWidth)));
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
    setTimeout(() => handleBtnState(items, buttons), 200);
  }
}

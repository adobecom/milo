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
* Icon Block - v5.1
*/

import { decorateButtons } from '../../utils/decorate.js';

const iconBlockVariants = {
  fullwidth: ['XL', 'M'],
  small: ['L', 'M'],
  bio: ['S', 'S'],
  vertical: ['S', 'M'],
  centered: ['M', 'M']
}

function decorateLayout(el) {
  const foreground = document.createElement('div');
  foreground.classList.add('foreground');
  el.appendChild(foreground);
  return foreground;
}

function decorateContent(row, sizes) {
  if (!row) return;
  const text = row.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  if (text) {
    text?.classList.add('text');
    const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const heading = headings?.[headings.length - 1];
    heading?.classList.add(`heading-${sizes[0]}`);
    heading?.nextElementSibling?.classList.add(`body-${sizes[1]}`);
    heading?.previousElementSibling?.classList.add('icon-area');
    const image = row.querySelector(':scope img');
    image?.parentElement?.parentElement?.classList?.add('icon-area');
    decorateButtons(row);
  }
}

function sortedVariants(x, y) {
  const priority = ['bio', 'small'];
  return priority.includes(x) ? -1 : priority.includes(y) ? 1 : 0;
}

function getBlockVariant(el) {
  const variantList = [...el.classList].filter(i => Object.keys(iconBlockVariants).indexOf(i) > -1).sort(sortedVariants);
  return variantList?.[0] ?? 'fullwidth';
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const rows = el.querySelectorAll(':scope > div:not([class])');
  [...rows].forEach(row => {
    decorateContent(row, iconBlockVariants[getBlockVariant(el)]);
    foreground.insertAdjacentElement('beforeEnd', row.children[0]);
    row.remove();
  });
}
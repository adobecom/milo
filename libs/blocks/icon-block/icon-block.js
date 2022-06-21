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

import { decorateButtons, decorateIcons, decorateTextDaa, decorateBlockDaa, decorateBlockBg } from '../../utils/utils.js';

function decorateLayout(el) {
  const children = el.querySelectorAll(':scope > div');
  if (children.length > 1 && children[0].childNodes.length) {
    decorateBlockBg(el, children[0]);
  }
  const foreground = document.createElement('div');
  foreground.classList.add('foreground', 'container');
  el.appendChild(foreground);
  return foreground;
}

function decorateContent(row, isVertical) {
  if (row) {
    const text = row.querySelector('h1, h2, h3, h4, h5, h6')?.closest('div');
    text?.classList.add('text');
    const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const heading = headings?.[headings.length - 1];
    heading?.classList.add(isVertical ? 'heading-S' : 'heading-XL');
    heading?.nextElementSibling?.classList.add('body-M');
    heading?.previousElementSibling?.classList.add('icon-area');
    row.querySelector(':scope > div:not([class])')?.classList.add('image');
    decorateTextDaa(row, heading);
    decorateButtons(row);
  }
}

export default function init(el) {
  decorateBlockDaa(el);
  decorateIcons(el, false);
  const foreground = decorateLayout(el);
  const rows = el.querySelectorAll(':scope > div:not([class])');
  const isVertical = el.classList.contains('vertical');
  [...rows].forEach((row) => {
    decorateContent(row, isVertical);
    foreground.insertAdjacentElement('beforeEnd', row.children[0]);
    row.remove();
  });
}

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

import { decorateBlockText, decorateBlockBg, getBlockSize } from '../../utils/decorate.js';

const variants = ['fullwidth', 'vertical', 'bio'];
const [full, left, bio] = variants;
const iconBlocks = {
  small: {
    [full]: ['m', 'm'],
    [left]: ['s', 'm'],
    [bio]: ['s', 's'],
  },
  medium: {
    [full]: ['l', 'm'],
    [left]: ['m', 'm'],
    [bio]: ['s', 's'],
  },
  large: {
    [full]: ['xl', 'm'],
    [left]: ['m', 'm'],
    [bio]: ['s', 's'],
  },
};

function decorateForeground(block) {
  if (!block) return;
  block.classList.add('foreground');
  const image = block.querySelector(':scope img');
  if (image) image.parentElement.classList.add('icon-area');
  const text = block.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  if (text) {
    text.classList.add('text-content');
    const lastElem = text.lastElementChild;
    if (lastElem.children.length === 1
      && lastElem.lastElementChild.nodeName === 'A'
      && lastElem.lastElementChild.innerText === lastElem.innerText) {
      text.lastElementChild.classList.add('action-area');
    }
    const size = getBlockSize(el, 2);
    const variant = [...variants].filter((v) => el.classList.contains(v))?.[0] ?? 'fullwidth';
    decorateBlockText(el, iconBlocks[size][variant]);
  }
}

export default function init(el) {
  el.classList.add('con-block');
  if (el.classList.contains('intro')) el.classList.add('xxxl-spacing-top', 'xl-spacing-static-bottom');
  const elems = el.querySelectorAll(':scope > div');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  decorateForeground(elems[elems.length - 1]);
}

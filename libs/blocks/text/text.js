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

import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

/*
 * Text Block - v1.0
 */

export default function init(el) {
  el.classList.add('text-block');
  const children = el.querySelectorAll(':scope > div');
  const [background, ...cols] = children;
  const container = createTag('div', { class: 'foreground container' });
  decorateBlockBg(el, background);
  const size = getBlockSize(el);
  decorateBlockText(el, size);
  el.appendChild(container);
  cols.forEach((col, idx) => {
    col.children[0].classList.add('text-row', `text-row-${idx}`);
    if (idx === 0 && (el.classList.contains('full-width'))) col.children[0].classList.add('full-width');
    col.querySelector('a + a')?.closest('p, div')?.classList.add('action-area');
    container.insertAdjacentElement('beforeend', col.children[0]);
    col.remove();
  });
}

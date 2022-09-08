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

import { decorateBlockBg, decorateBlockText } from '../../utils/decorate.js';

/*
 * Text Block - v1.0
 */

export default function init(el) {
  const children = el.querySelectorAll(':scope > div');
  const [background, ...cols] = children;
  // basic background handling
  decorateBlockBg(el, background);

  // create foreground
  const container = document.createElement('div');
  container.classList.add('foreground', 'container', 'grid');
  el.appendChild(container);
  el.classList.add('block');

  // process columns
  cols.forEach((col, idx) => {
    let headingClass = 'medium';
    if (idx === 0 && (el.classList.contains('full-width') || el.classList.contains('has-intro'))) {
      col.children[0].classList.add('full-width');
      headingClass = el.classList.contains('large') ? 'large' : 'medium';
    }
    col.children[0].classList.add('text');
    decorateBlockText(el, headingClass);
    col.querySelector('a + a')?.closest('p').classList.add('action-area');
    container.insertAdjacentElement('beforeend', col.children[0]);
    col.remove();
  });
}

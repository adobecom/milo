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

import { decorateButtons, decorateBlockBg, decorateBlockDaa, decorateText } from '../../scripts/decorate.js';

/*
 * Text Block - v5.1
 */

// decorate text content in block by passing array of classes [ detail, heading, body ]
function decorateContent(el, classList) {
  if (el) {
    const text = el.querySelector('h1, h2, h3, h4, h5, h6')?.closest('div');
    text?.classList.add('text');
    const headings = text.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const heading = headings[headings.length - 1];
    heading.classList.add(classList[1]);
    heading.nextElementSibling.classList.add(classList[2]);
    if (heading.previousElementSibling) heading.previousElementSibling.classList.add(classList[0]);
  }
}

export default function init(el) {
  const children = el.querySelectorAll(':scope > div');
  const [background, ...rows] = children;
  // basic background handling
  decorateBlockBg(el, background);

  // create foreground
  const container = document.createElement('div');
  container.classList.add('foreground', 'container');
  el.appendChild(container);

  // process rows
  rows.forEach((row, idx) => {
    let headingClass = 'heading-M';
    if (idx === 0 && (el.classList.contains('full-width') || el.classList.contains('has-intro'))) {
      row.children[0].classList.add('full-width');
      headingClass = el.classList.contains('large') ? 'heading-XL' : 'heading-L';
    }
    decorateContent(row, ['', headingClass, 'body-M']);
    container.insertAdjacentElement('beforeend', row.children[0]);
    row.remove();
  });
  decorateButtons(el);
  el.querySelectorAll('.text').forEach((col) => {
    col.querySelector('a + a')?.closest('p').classList.add('action-area');
    decorateText(el, col.querySelector('h1, h2, h3, h4, h5, h6'));
  });
  decorateBlockDaa(el);
}

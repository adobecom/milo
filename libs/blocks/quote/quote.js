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
 * blockquote - v1.0.0
 */

import { createTag } from '../../utils/utils.js';

export default function init(el) {

  // const elContainer = el.closest('.container');
  // const elFullWidth = el.classList.contains('full-width');
  // if (!elFullWidth) el.classList.add('contained');
  // if (!elFullWidth && elContainer === null) el.classList.add('contained');
  // console.log('!elFullWidth && elContainer === null', !elFullWidth && elContainer === null);
  // console.log('elContainer === null', elContainer === null);
  // console.log('elFullWidth', elFullWidth);

  const allRows = el.querySelectorAll(':scope > div');
  const lastRow = allRows[allRows.length - 1];
  lastRow.classList.add('last-row');
  const rows = el.querySelectorAll(':scope > div:not([class])');
  rows.forEach((row) => {
    if (row.querySelector(':scope img')) {
      row.classList.add('quote-image');
    } else {
      console.log('row', row);
      el.classList.add('background');
      el.style.background = row.textContent.trim();
      row.remove();
    }
  });
  const copyNodes = lastRow.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
  const quoteCopy = copyNodes[0];
  let figcaptionCopy = copyNodes[1];
  let citeCopy = copyNodes[2];
  const blockquote = createTag('blockquote', {}, quoteCopy);
  const figcaption = createTag('figcaption', {}, figcaptionCopy);
  const cite = createTag('cite', {}, citeCopy);
  const wrapper = createTag('div', { class: 'quote-wrapper' });
  const figure = createTag('figure', {}, wrapper);
  quoteCopy?.classList.add('quote-copy');
  figcaptionCopy?.classList.add('figcaption');
  lastRow.remove();
  figure.insertAdjacentElement('afterbegin', blockquote);
  el.insertAdjacentElement('afterbegin', figure);
  if (citeCopy) figcaption.insertAdjacentElement('beforeend', cite);
  blockquote.insertAdjacentElement('afterend', figcaption);
  const imageRow = el.querySelector(':scope > div.quote-image');
  if (imageRow) blockquote.insertAdjacentElement('beforebegin', imageRow);
  wrapper.insertAdjacentElement('beforeend', figcaption);
  wrapper.insertAdjacentElement('afterbegin', blockquote);
}

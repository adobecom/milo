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
 * quote - v1.0.0
 */

import { createTag } from '../../utils/utils.js';

export default function init(el) {
  const blockVarints = ['con-block'];
  if (el.classList.contains('long-form')) blockVarints.push('xxlarge', 'contained', 'max-width-10-desktop');
  el.classList.add(...blockVarints);
  const allRows = el.querySelectorAll(':scope > div');
  const lastRow = allRows[allRows.length - 1];
  const lastDiv = lastRow.querySelector('div');
  if (!lastDiv.firstElementChild && lastDiv.textContent) lastDiv.append(createTag('p', null, lastDiv.textContent));
  const imageRow = allRows.length > 1 ? allRows[0] : false;
  const copyNodes = lastDiv.querySelectorAll(':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6, :scope > p, :scope > em, :scope > strong, :scope > blockquote p');
  const blockquote = createTag('blockquote', {}, copyNodes[0]);
  const figcaption = createTag('figcaption', {}, copyNodes[1]);
  const cite = createTag('cite', {}, copyNodes[2]);
  const wrapper = createTag('div', { class: 'quote-wrapper' });
  const figure = createTag('figure', { class: 'foreground' }, wrapper);
  copyNodes[0]?.classList.add('quote-copy');
  copyNodes[1]?.classList.add('figcaption');
  lastRow.remove();
  figure.insertAdjacentElement('afterbegin', blockquote);
  el.insertAdjacentElement('afterbegin', figure);
  if (copyNodes[2]) figcaption.insertAdjacentElement('beforeend', cite);
  blockquote.insertAdjacentElement('afterend', figcaption);
  if (imageRow) {
    imageRow.classList.add('quote-image');
    blockquote.insertAdjacentElement('beforebegin', imageRow);
  }
  wrapper.insertAdjacentElement('beforeend', figcaption);
  wrapper.insertAdjacentElement('afterbegin', blockquote);
}

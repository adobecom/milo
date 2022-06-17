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
* Stats - v0.1
*/

import { decorateBlockDaa, decorateBlockBg } from "../../scripts/decorate.js";

function decorateRow(row) {
    if (row) {
      const headers = row.querySelectorAll('h1, h2, h3, h4, h5, h6');
      if (headers) headers.forEach((header) => {
        if (row.classList.contains('stat')) {
          header.classList.add('heading-XL');
        } else {
          header.classList.add('heading-XS');
        }
      })
    }
}

export default function init(el) {
  decorateBlockDaa(el);
  const firstRow = el.querySelector(':scope > div');
  if (firstRow) decorateBlockBg(el, firstRow);
  const rows = el.querySelectorAll(':scope > div');
  if (rows.length) {
    const container = document.createElement('div');
    container.classList.add('foreground', 'container', `count-${rows.length}`);
    rows.forEach((row, i) => {
      const rowType = ((rows.length - 1) === i) ? 'solution' : 'stat'
      row.classList.add(rowType);
      decorateRow(row);
      container.append(row);
    });
    el.insertAdjacentElement('afterbegin', container);
  }
}

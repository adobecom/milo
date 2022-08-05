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

// import { decorateBlockDaa } from '../../utils/utils.js';

function decorateRow(row) {
  if (row) {
    const headers = row.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headers) {
      headers.forEach((header) => {
        if (row.classList.contains('stat')) {
          header.classList.add('heading-XL');
        } else {
          header.classList.add('heading-XS');
        }
      });
    }
  }
}

export default function init(el) {
  // todo: do these need analytics.js
  // decorateBlockDaa(el);
  const firstRow = el.querySelector(':scope > div');
  const pics = firstRow.getElementsByTagName('picture');
  if (firstRow) {
    if (pics.length === 0 && !firstRow.textContent) {
      firstRow.remove();
    } else {
      firstRow.classList.add('stats-intro');
    }
  }
  const rows = el.querySelectorAll(':scope > div:not([class])');
  if (rows.length) {
    const stats = document.createElement('div');
    stats.classList.add('stats-wrapper');
    const solutions = document.createElement('div');
    solutions.classList.add('solutions-wrapper');
    let statCount = 0;
    let solutionCount = 0;
    rows.forEach((row, i) => {
      const rowType = ((rows.length - 1) === i) ? 'solution' : 'stat';
      row.classList.add(rowType);
      decorateRow(row);
      if (rowType === 'stat') {
        stats.append(row);
        statCount += 1;
      } else {
        solutions.append(row);
        solutionCount += 1;
      }
    });
    const container = document.createElement('div');
    container.classList.add('stats-container');
    stats.classList.add(`count-${statCount}`);
    solutions.classList.add(`count-${solutionCount}`);
    container.appendChild(stats);
    container.appendChild(solutions);
    el.insertAdjacentElement('beforeend', container);
  }
}

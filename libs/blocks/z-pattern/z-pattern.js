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
 * Z-Pattern - v5.1
 */

import { decorateBlockBg, decorateBlockDaa, decorateHeadline, getBlockSize } from '../../scripts/decorate.js';
import media from '../media/media.js';

function getOddRowsCount(rows) {
  let zRowsOddCount = 0;
  rows.forEach((row) => {
    const firstCol = row.querySelector(':scope > div > div:first-of-type');
    const rowIsOdd = firstCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (rowIsOdd) zRowsOddCount += 1;
  });
  return zRowsOddCount;
}

function getChildSingleRowCount(children) {
  let length = 0;
  for (let i = 0; i < children.length; i += 1) {
    if (children[i].children.length === 1) {
      length += 1;
    }
  }
  return length;
}

export default function init(el) {
  decorateBlockDaa(el);
  const children = el.querySelectorAll(':scope > div');
  const size = getBlockSize(el);
  const singleRowCount = getChildSingleRowCount(children);
  const headerIndex = singleRowCount === 1 ? 0 : 1;
  const rowHeader = children[headerIndex].querySelector('h1, h2, h3, h4, h5, h6');
  const rowBg = children[0].textContent != null;
  // 1 single row (bg || headline)
  if (singleRowCount === 1) {
    if (!rowHeader) {
      decorateBlockBg(el, children[0]);
    } else {
      decorateHeadline(rowHeader, size);
    }
  }
  // 2 single rows (bg && headline)
  if (singleRowCount === 2) {
    if (rowBg) {
      decorateBlockBg(el, children[0]);
    }
    if (rowHeader) {
      decorateHeadline(rowHeader, size);
    }
  }
  const zRows = el.querySelectorAll(':scope > div:not([class])');
  zRows.forEach((row) => {
    row.classList.add('media');
    const mediaRow = document.createElement('div');
    const blockChildren = row.querySelectorAll(':scope > div');
    blockChildren.forEach((child) => {
      mediaRow.appendChild(child);
    });
    row.classList.add(size);
    row.appendChild(mediaRow);
  });
  const zRowsOddCount = getOddRowsCount(zRows);
  if (zRowsOddCount === 0) {
    zRows.forEach((row, i) => {
      if (i % 2) row.classList.add('media--reversed');
    });
  }
  const mediaItems = el.querySelectorAll(':scope > .media');
  mediaItems.forEach((i) => {
    media(i, false);
  });
}

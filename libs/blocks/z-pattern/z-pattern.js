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
 * z-pattern - consonant v5.1
 */

import { decorateBlockBg, getBlockSize } from '../../utils/decorate.js';
import initMedia from '../media/media.js';

export function decorateHeadline(header, size) {
  const headingRow = header.parentElement;
  headingRow.classList.add('heading-row');
  headingRow.parentElement.classList.add('container');
  const headerClass = (size === 'large') ? 'heading-xl' : 'heading-l';
  header.classList.add(headerClass, 'headline');
}

function getReversedRowCount(rows) {
  let count = 0;
  rows.forEach((row) => {
    const firstCol = row.querySelector(':scope > div > div:first-of-type');
    const header = firstCol.querySelector('h1, h2, h3, h4, h5, h6');
    // if first col has a header, its order is reversed
    if (header) count += 1;
  });
  return count;
}

function getChildSingleRowCount(children) {
  return [...children].reduce((length, child) => {
    let el = length;
    if (child.children.length === 1) {
      el += 1;
    }
    return el;
  }, 0);
}

export default function init(el) {
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
  if (getReversedRowCount(zRows) === 0) {
    zRows.forEach((row, i) => {
      if (i % 2) row.classList.add('media-reversed');
    });
  }
  const mediaItems = el.querySelectorAll(':scope > .media');
  const variants = ['checklist', 'qr-code'];
  mediaItems.forEach((i) => {
    variants.forEach((v) => {
      if (el.classList.contains(v)) i.classList.add(v);
    });
    initMedia(i, false);
  });
}

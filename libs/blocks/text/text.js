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

import { decorateBlockBg, decorateIcons, decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { decorateLinkAnalytics } from '../../utils/analytics.js';
import { createTag } from '../../utils/utils.js';

export function decorateText(el, size = 'medium') {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.nextElementSibling?.classList.add(`body-${bodySize}`);
    headingEl.previousElementSibling?.classList.add(`detail-${detailSize}`);
  };
  headings.forEach((heading) => {
    if (size === 'small') {
      decorate(heading, 'S', 'S', 'S');
    } else if (size === 'large') {
      decorate(heading, 'L', 'L', 'L');
    } else if (size === 'xlarge') {
      decorate(heading, 'XL', 'XL', 'XL');
    } else {
      decorate(heading, 'M', 'M', 'M');
    }
  });
  decorateIcons(el);
  decorateButtons(el);
  decorateLinkAnalytics(el, headings);
}

export default function init(el) {
  el.classList.add('text-block');
  const rows = el.querySelectorAll(':scope > div');
  const container = createTag('div', { class: 'foreground container grid' });
  if (rows.length > 1) decorateBlockBg(el, rows[0]);
  const size = getBlockSize(el);
  decorateText(el, size);
  el.appendChild(container);
  const textRows = el.querySelectorAll(':scope > div:not([class])');
  textRows.forEach((row, idx) => {
    row.classList.add('text');
    container.insertAdjacentElement('beforeend', row);
  });
}

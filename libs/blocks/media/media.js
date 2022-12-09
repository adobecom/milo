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
 * media - consonant v5.1
 */

import { decorateBlockBg, decorateBlockText, getBlockSize } from '../../utils/decorate.js';
import { decorateBlockAnalytics } from '../../martech/attributes.js';

const blockTypeSizes = {
  small: ['XS', 'S', 'M'],
  medium: ['M', 'S', 'M'],
  large: ['XL', 'M', 'L'],
  xlarge: ['XXL', 'M', 'L'],
};

export default function init(el) {
  decorateBlockAnalytics(el);
  const children = el.querySelectorAll(':scope > div');
  if (children[0]?.childElementCount === 1) {
    decorateBlockBg(el, children[0]);
  }
  const size = getBlockSize(el);
  const media = el.querySelectorAll(':scope > div:not([class])');
  const container = document.createElement('div');
  container.classList.add('container', 'foreground');
  media.forEach((row) => {
    row.classList.add('media-row');
    const header = row.querySelector('h1, h2, h3, h4, h5, h6');
    if (header) {
      const text = header.closest('div');
      text.classList.add('text');
      decorateBlockText(text, blockTypeSizes[size]);
    }
    const image = row.querySelector(':scope > div:not([class])');
    if (image) image.classList.add('image');
    const img = image.querySelector(':scope img');
    if (header && img?.alt === '') img.alt = header.textContent;
    container.append(row);
  });
  el.append(container);
  const mediaRowReversed = el.querySelector(':scope > .foreground > .media-row > div').classList.contains('text');
  if (mediaRowReversed) el.classList.add('media-reverse-mobile');
}

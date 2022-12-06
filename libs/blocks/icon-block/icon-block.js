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
* Icon Block - v5.1
*/

import { decorateBlockText } from '../../utils/decorate.js';

const iconBlocks = {
  small: {
    fullwidth: ['M', 'M'],
    vertical: ['S', 'M'],
    centered: ['S', 'M'],
    bio: ['S', 'S'],
  },
  medium: {
    fullwidth: ['L', 'M'],
    vertical: ['M', 'M'],
    centered: ['M', 'M'],
    bio: ['S', 'S'],
  },
  large: {
    fullwidth: ['XL', 'M'],
    vertical: ['M', 'M'],
    centered: ['M', 'M'],
    bio: ['S', 'S'],
  },
};

function sortPriority(x, y) {
  const priorities = ['bio', 'large', 'medium', 'small'];
  let priority = 0;
  if (priorities.includes(x)) priority = -1;
  else if (priorities.includes(y)) priority = 1;
  return priority;
}

function getBlockVariantSize(el) {
  const attrs = [...el.classList];
  const size = attrs.filter((i) => Object.keys(iconBlocks).includes(i)).sort(sortPriority)?.[0];
  const sizeObj = iconBlocks[size];
  const variant = attrs.filter((i) => Object.keys(sizeObj).includes(i)).sort(sortPriority)?.[0];
  if (!size || !variant) return iconBlocks.large.fullwidth;
  return iconBlocks[size][variant];
}

function decorateContent(el) {
  const block = el.querySelector(':scope > div:not([class])');
  block.classList.add('foreground');
  if (!block) return;
  const text = block.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  if (text) {
    text?.classList.add('text-content');
    const image = block.querySelector(':scope img');
    image?.parentElement?.parentElement?.classList?.add('icon-area');
    const variantSize = getBlockVariantSize(el);
    decorateBlockText(el, variantSize);
  }
}

export default function init(el) {
  if (el.classList.contains('intro')) el.classList.add('con-block', 'xxxl-spacing-top', 'intro-spacing-bottom');
  decorateContent(el);
}

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

import { decorateButtons } from '../../utils/decorate.js';

const iconBlockVariants = {
  fullwidth: ['XL', 'M'],
  small: ['L', 'M'],
  bio: ['S', 'S'],
  vertical: ['S', 'M'],
  centered: ['M', 'M'],
};

function decorateContent(block, variant) {
  if (!block) return;
  const text = block.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  if (text) {
    text?.classList.add('text');
    const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const heading = headings?.[headings.length - 1];
    heading?.classList.add(`heading-${variant[0]}`);
    heading?.nextElementSibling?.classList.add(`body-${variant[1]}`);
    heading?.previousElementSibling?.classList.add('icon-area');
    const image = block.querySelector(':scope img');
    image?.parentElement?.parentElement?.classList?.add('icon-area');
    decorateButtons(block);
  }
}

function sortPriority(x, y) {
  const priorities = ['bio', 'small'];
  let priority = 0;
  if (priorities.includes(x)) priority = -1;
  else if (priorities.includes(y)) priority = 1;
  return priority;
}

function getBlockVariant(el) {
  const variants = [...el.classList]
    .filter((i) => Object.keys(iconBlockVariants).includes(i)).sort(sortPriority);
  return variants[0];
}

export default function init(el) {
  const block = el.querySelector(':scope > div:not([class])');
  if (el.classList.contains('intro')) el.classList.add('xxxl-spacing-top', 'xxl-spacing-bottom');
  const blockVariant = getBlockVariant(el);
  const variant = iconBlockVariants[blockVariant];
  block.classList.add('foreground');
  decorateContent(block, variant);
}

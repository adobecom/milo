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

import { decorateBlockText, getBlockSize } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const variants = ['full-width', 'vertical', 'bio', 'inline'];
const iconBlocks = {
  small: {
    [variants[0]]: ['m', 'm'],
    [variants[1]]: ['s', 'm'],
    [variants[2]]: ['s', 's'],
    [variants[3]]: ['s', 's'],
  },
  medium: {
    [variants[0]]: ['l', 'm'],
    [variants[1]]: ['m', 'm'],
    [variants[2]]: ['s', 's'],
    [variants[3]]: ['s', 's'],
  },
  large: {
    [variants[0]]: ['xl', 'm'],
    [variants[1]]: ['m', 'm'],
    [variants[2]]: ['s', 's'],
    [variants[3]]: ['s', 's'],
  },
};

// checking if block is part of xx-up and is inline variant
function upAndInline(el) {
  const isInlineAndSectionMetadata = el.classList.contains('inline') && el.parentElement?.querySelector('.section-metadata');
  if (!isInlineAndSectionMetadata) return false;
  return /(two|three|four|five)[- ]?up/i.test(el.parentElement.className);
}

function decorateContent(el) {
  const block = el.querySelector(':scope > div:not([class])');
  block.classList.add('foreground');
  if (!block) return;
  const text = block.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  if (text) {
    text.classList.add('text-content');
    const image = block.querySelector(':scope img');
    if (image) image.closest('p').classList.add('icon-area');
    // place standalone links inside an action-area
    const lastElem = text.lastElementChild;
    if (lastElem.children.length === 1
      && lastElem.lastElementChild.nodeName === 'A'
      && lastElem.lastElementChild.innerText === lastElem.innerText) {
      text.lastElementChild.classList.add('action-area');
    }
    const size = getBlockSize(el, 2);
    const variant = [...variants].filter((v) => el.classList.contains(v))?.[0] ?? variants[0];
    const textSize = upAndInline(el) ? ['xs', 's'] : iconBlocks[size][variant];
    decorateBlockText(el, textSize);
    if (el.classList.contains('inline')) {
      const textContent = el.querySelectorAll('.text-content > :not(.icon-area)');
      const secondColumn = createTag('div', { class: 'second-column' });
      textContent.forEach((content) => {
        let nodeToInsert = content;
        const firstIcon = content.querySelector('.icon:first-child');
        if (firstIcon) {
          const titleRowSpan = createTag('span', { class: 'title-row' });
          titleRowSpan.append(firstIcon, content);
          nodeToInsert = titleRowSpan;
        }

        secondColumn.append(nodeToInsert);
      });
      if (secondColumn.children.length === 1) el.classList.add('items-center');
      el.querySelector('.foreground .text-content').append(secondColumn);
    }
    const lastActionArea = el.querySelector('.action-area:last-of-type');
    if (lastActionArea) {
      const div = createTag('div', { class: 'cta-container' });
      lastActionArea.insertAdjacentElement('afterend', div);
      if (lastActionArea.previousElementSibling.className.includes('action-area')) {
        div.append(lastActionArea.previousElementSibling);
      }
      div.append(lastActionArea);
    }
  }
}

export default function init(el) {
  el.classList.add('con-block');
  if (el.classList.contains('intro')) el.classList.add('xxxl-spacing-top', 'xl-spacing-static-bottom');
  if (el.classList.contains('fullwidth')) el.classList.replace('fullwidth', 'full-width');
  decorateContent(el);
}

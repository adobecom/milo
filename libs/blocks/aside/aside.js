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
* Aside - v5.1
*/

import { decorateBlockBg, decorateButtons } from '../../utils/decorate.js';

function decorateLayout(el) {
  const elems = el.querySelectorAll(':scope > div');
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground', 'container');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  return foreground;
}

function decorateContent(el, isInline) {
  if (!el) return;
  const text = el.querySelector('h1, h2, h3, h4, h5, h6')?.closest('div');
  text?.classList.add('text');
  const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings?.[headings.length - 1];
  heading?.classList.add(`${isInline ? 'heading-S' : 'heading-XL'}`);
  heading?.nextElementSibling?.classList.add(`${isInline ? 'body-M' : 'body-S'}`);
  heading?.previousElementSibling?.classList.add('detail-M');
  el.querySelector(':scope > div:not([class])')?.classList.add('image');
  const image = text?.querySelector('img');
  if (image) image.closest('p')?.classList.add('icon-area');
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const isInline = el.className.includes('inline');
  decorateContent(foreground, isInline);
  decorateButtons(foreground);
}

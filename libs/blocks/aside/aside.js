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
import { createTag } from '../../utils/utils.js';

const asideTypes = ['inline', 'notification'];
const [INLINE, NOTIFICATION] = asideTypes;
const asideSizes = ['extra-small', 'small', 'medium', 'large'];
const [SIZE_XS, SIZE_S, SIZE_M, SIZE_L] = asideSizes;

function decorateLayout(el) {
  const elems = el.querySelectorAll(':scope > div');
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground', 'container');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  return foreground;
}

function decorateContent(el, type, size) {
  if (!el) return;
  const text = el.querySelector('h1, h2, h3, h4, h5, h6, a')?.closest('div');
  const picture = text?.querySelector('picture');
  const iconArea = picture ? (picture.closest('p') || createTag('p', null, picture)) : null;
  text?.classList.add('text');
  if (text && !text.querySelector('p')) {
    const buttons = text.querySelectorAll('em a, strong a');
    let btnWrap = null;
    if (buttons[0] && !buttons[0].closest('p')) {
      btnWrap = document.createElement('p');
      btnWrap.append(...[...buttons].map((button) => button.parentElement));
    }
    const desc = createTag('p', null, text.innerHTML);
    text.innerHTML = '';
    text.append(
      iconArea || '',
      desc,
      btnWrap || '',
    );
  }
  iconArea?.classList.add('icon-area');
  decorateButtons(el);
  const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings?.[headings.length - 1];
  const isInline = type === INLINE;
  const isNotification = type === NOTIFICATION;
  if (heading) {
    let headingClass = 'heading-XL';
    if ((isNotification && size === SIZE_M) || isInline) {
      headingClass = 'heading-S';
    }
    if (isNotification && size === SIZE_L) {
      headingClass = 'heading-L';
    }
    heading?.classList.add(headingClass);
    const prevClasses = heading?.previousElementSibling?.classList;
    if (prevClasses?.length === 0) prevClasses.add('detail-M');
  }
  const bodyClass = (isNotification && (size === SIZE_XS || size === SIZE_S || size === SIZE_L)) || isInline ? 'body-M' : 'body-S';
  const bodyCopy = heading?.nextElementSibling.classList.length === 0 ? heading.nextElementSibling : text?.querySelector('p:not([class])');
  bodyCopy?.classList.add(bodyClass);
  const body = createTag('div', { class: 'body-area' });
  bodyCopy?.insertAdjacentElement('beforebegin', body);
  body.append(bodyCopy);
  el.querySelector(':scope > div:not(.text) img')?.closest('div').classList.add('image');
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const type = asideTypes.find((asideType) => el.className.includes(asideType));
  const size = asideSizes.find((asideSize) => el.className.includes(asideSize))
    || (type === NOTIFICATION ? SIZE_L : null);
  decorateContent(foreground, type, size);
}

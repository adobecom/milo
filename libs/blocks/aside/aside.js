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
const asideSizes = ['extra-small', 'small', 'medium', 'large'];

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
      buttons.forEach((button) => btnWrap.append(button.parentElement));
    }
    const desc = createTag('p', null, text.innerHTML);
    text.innerHTML = '';
    if (iconArea) text.append(iconArea);
    text.append(desc);
    if (btnWrap) text.append(btnWrap);
  }
  iconArea?.classList.add('icon-area');
  decorateButtons(el);
  const headings = text?.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings?.[headings.length - 1];
  const isInline = type === 'inline';
  const isNotification = type === 'notification';
  let headingClass = 'heading-XL';
  let bodyClass = 'body-S';
  if (isNotification && (size === 'extra-small' || size === 'small')) {
    headingClass = '';
  }
  if ((isNotification && (size === 'extra-small' || size === 'small' || size === 'large')) || isInline) {
    bodyClass = 'body-M';
  }
  if ((isNotification && size === 'medium') || isInline) {
    headingClass = 'heading-S';
  }
  if (isNotification && size === 'large') {
    headingClass = 'heading-L';
  }
  heading?.classList.add(headingClass);
  const bodyCopy = heading?.nextElementSibling.classList.length === 0 ? heading.nextElementSibling : text?.querySelector('p:not([class])');
  bodyCopy?.classList.add(bodyClass);
  const body = createTag('div', { class: 'body-area' });
  bodyCopy.insertAdjacentElement('beforebegin', body);
  body.append(bodyCopy);
  const prevClasses = heading?.previousElementSibling?.classList;
  if (prevClasses?.length === 0) prevClasses.add('detail-M');
  el.querySelector(':scope > div:not([class])')?.classList.add('image');
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const type = asideTypes?.find((asideType) => el?.className?.indexOf(asideType) !== -1);
  const size = asideSizes?.find((asideSize) => el?.className?.indexOf(asideSize) !== -1) || (type === 'notification' ? 'large' : null);
  decorateContent(foreground, type, size);
}

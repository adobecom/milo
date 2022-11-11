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

import { decorateBlockBg, decorateVideo } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const asideTypes = ['inline', 'notification', 'split'];
const [INLINE, NOTIFICATION, SPLIT] = asideTypes;
const asideSizes = ['extra-small', 'small', 'medium', 'large'];
const [SIZE_XS, SIZE_S, SIZE_M, SIZE_L] = asideSizes;

function decorateLayout(el) {
  const elems = el.querySelectorAll(':scope > div');
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground', 'container');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  return foreground;
}

function decorateLinks(el) {
  const links = el.querySelectorAll('a');
  if (links.length === 0) return;
  const actionLinks = [...links].filter(link => link.closest('div')?.classList.contains('text'));
  const actions = document.createElement('div');
  actions.classList.add('action-area');
  actionLinks.forEach(link => {
    let parent = link.parentElement;
    if (parent.nodeName === 'P') link.classList.add('body-S');
    else {
      const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
      link.classList.add('con-button', buttonType);
      parent = link.closest('p');
    }
    actions.insertAdjacentElement('beforeend', link);
    parent?.remove();
  });
  const content = el.querySelector('.text');
  content?.insertAdjacentElement('beforeend', actions);
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
  if (type === SPLIT) {
    const splitBg = el.querySelector(':scope > div:not(.text) img')?.closest('div');
    if (splitBg) {
      splitBg.classList.add('split-image');
      el.parentElement.appendChild(splitBg);
    }
  } else {
    el.querySelector(':scope > div:not(.text) img')?.closest('div').classList.add('image');
  }
  decorateVideo(el, 'image');
  decorateLinks(el);
}

export default function init(el) {
  const foreground = decorateLayout(el);
  const type = asideTypes.find((asideType) => el.className.includes(asideType));
  const size = asideSizes.find((asideSize) => el.className.includes(asideSize))
    || (type === NOTIFICATION ? SIZE_L : null);
  decorateContent(foreground, type, size);
}

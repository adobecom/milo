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

import { loadStyle } from '../../utils/utils.js';

/*
 * Marquee - v1.0.0
 */

function decorateButtons(el, isLarge) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length > 0) {
    const actionArea = buttons[0].closest('p');
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
    loadStyle('/libs/deps/@spectrum-css/vars/dist/spectrum-global.css');
    loadStyle('/libs/deps/@spectrum-css/vars/dist/spectrum-medium.css');
    loadStyle('/libs/deps/@spectrum-css/vars/dist/spectrum-dark.css');
    loadStyle('/libs/deps/@spectrum-css/page/dist/index-vars.css');
    loadStyle('/libs/deps/@spectrum-css/button/dist/index-vars.css');
  }

  buttons.forEach((link) => {
    const parent = link.parentElement;
    const type = parent.nodeName === 'STRONG' ? 'accent' : 'primary';
    const fill = type === 'accent' ? 'fill' : 'outline';
    const size = isLarge ? 'XL' : 'M';
    const contents = link.textContent;
    link.innerHTML = `<span class="spectrum-Button-label">${contents}</span>`;
    link.className = `spectrum-Button spectrum-Button--${fill} spectrum-Button--${type} spectrum-Button--size${size}`;
    link.addEventListener('focus', () => { link.classList.add('focus-ring'); });
    link.addEventListener('focusout', () => { link.classList.remove('focus-ring'); });
    parent.insertAdjacentElement('afterend', link);
    parent.remove();
  });
}

function decorateText(el, isLarge) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  heading.className = isLarge ? 'heading-XXL' : 'heading-XL';
  heading.nextElementSibling.className = isLarge ? 'body-XL' : 'body-M';
  if (heading.previousElementSibling) {
    heading.previousElementSibling.className = isLarge ? 'detail-L' : 'detail-M';
  }
}

export default function init(el) {
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  if (children.length > 1) {
    children[0].classList.add('background');
  }
  foreground.classList.add('foreground', 'container');
  const text = foreground.querySelector('h1, h2, h3, h4, h5, h6').closest('div');
  text.classList.add('text');
  const image = foreground.querySelector(':scope > div:not([class])');
  image?.classList.add('image');
  const isLarge = el.closest('.marquee').classList.contains('large');
  decorateButtons(text, isLarge);
  decorateText(text, isLarge);
}

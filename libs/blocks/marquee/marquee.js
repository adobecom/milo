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
 * Marquee - v5.1
 */

import { decorateButtons } from '../../utils/spectrum.js';

function decorateActionArea(text, isLarge, color) {
  const buttonSize = isLarge ? 'XL' : 'L';
  const buttons = decorateButtons(text, color, buttonSize);
  // const buttons = [...text.querySelectorAll('a')];
  if (buttons.length === 0) return;
  const area = buttons[0].closest('p, div');
  area.classList.add('action-area', `action-area--size${buttonSize}`);
  area.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
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

function getSize(classList) {
  if (classList.contains('large')) {
    return 'large';
  } if (classList.contains('small')) {
    return 'small';
  }
  return 'medium';
}

export default function init(el) {
  const size = getSize(el.classList);
  el.setAttribute('daa-im', 'true');
  el.setAttribute('daa-lh', `${el.classList[0]}|${size}`);
  const color = el.classList.contains('light') ? 'spectrum--light' : 'spectrum--dark';
  el.classList.add(color);
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
  const isLarge = size === 'large';
  decorateText(text, isLarge);
  decorateActionArea(text, isLarge, color);
}

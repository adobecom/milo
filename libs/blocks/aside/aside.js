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

import { decorateBlockBg, decorateBlockText } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

// standard/default aside uses same text sizes as the split
const variants = ['split', 'inline', 'notification'];
const sizes = ['extra-small', 'small', 'medium', 'large'];
const [split, inline, notification] = variants;
const [xsmall, small, medium, large] = sizes;
const blockConfig = {
  [split]: ['XL', 'S', 'M'],
  [inline]: ['S', 'M'],
  [notification]: {
    [xsmall]: ['M', 'M'],
    [small]: ['M', 'M'],
    [medium]: ['S', 'S'],
    [large]: ['L', 'M'],
  },
};

function getBlockData(el) {
  const variant = variants.find((variantClass) => el.classList.contains(variantClass));
  const size = sizes.find((sizeClass) => el.classList.contains(sizeClass));
  const blockData = variant ? blockConfig[variant] : blockConfig[Object.keys(blockConfig)[0]];
  return variant && size && !Array.isArray(blockData) ? blockData[size] : blockData;
}

function decorateInlineVideo(el) {
  const video = el.querySelector('a[href*=".mp4"]');
  if (!video) return;
  const parent = video.parentElement;
  parent.classList.add('milo-inline-video');
  const source = createTag('source', { src: video.href, type: 'video/mp4' });
  const html = createTag('video', { playsinline: '', autoplay: '', muted: '', loop: '' }, source);
  parent.appendChild(html);
  video.remove();
}

function decorateStaticLinks(el) {
  if (!el.classList.contains('notification')) return;
  const textLinks = el.querySelectorAll('.text a:not([class])');
  textLinks.forEach((link) => { link.classList.add('static') });
}

function decorateLayout(el) {
  const elems = el.querySelectorAll(':scope > div');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground', 'container');
  const text = foreground.querySelector('h1, h2, h3, h4, h5, h6, a')?.closest('div');
  text?.classList.add('text');
  const picture = text?.querySelector('picture');
  const iconArea = picture ? (picture.closest('p') || createTag('p', null, picture)) : null;
  iconArea?.classList.add('icon-area');
  const foregroundImage = foreground.querySelector(':scope > div:not(.text) img')?.closest('div');
  const bgImage = el.querySelector(':scope > div:not(.text) img')?.closest('div');
  const image = foregroundImage ?? bgImage;
  if (image) {
    const isSplit = el.classList.contains('split');
    image.classList.add(`${isSplit ? 'split-' : ''}image`);
    if (isSplit) {
      foreground.parentElement.appendChild(image);
    }
  } else if (!iconArea) {
    foreground?.classList.add('no-image');
  }
  return foreground;
}

export default function init(el) {
  const blockData = getBlockData(el);
  const foreground = decorateLayout(el);
  decorateInlineVideo(el);
  decorateBlockText(foreground, blockData);
  decorateStaticLinks(el);
}

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

import { decorateBlockText } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

// standard/default aside uses same text sizes as the split
const variants = ['split', 'inline', 'notification'];
const sizes = ['extra-small', 'small', 'medium', 'large'];
const [split, inline, notification] = variants;
const [xsmall, small, medium, large] = sizes;
const blockConfig = {
  [split]: ['xl', 's', 'm'],
  [inline]: ['s', 'm'],
  [notification]: {
    [xsmall]: ['m', 'm'],
    [small]: ['m', 'm'],
    [medium]: ['s', 's'],
    [large]: ['l', 'm'],
  },
};
const PLAY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none" class="play-icon">
                    <path d="M24 16.0005L0 32L1.39876e-06 0L24 16.0005Z" fill="white"/>
                  </svg>
                  `;
const ASPECT_RATIO = /^format:/i;

function getBlockData(el) {
  const variant = variants.find((variantClass) => el.classList.contains(variantClass));
  const size = sizes.find((sizeClass) => el.classList.contains(sizeClass));
  const blockData = variant ? blockConfig[variant] : blockConfig[Object.keys(blockConfig)[0]];
  return variant && size && !Array.isArray(blockData) ? blockData[size] : blockData;
}

function decorateStaticLinks(el) {
  if (!el.classList.contains('notification')) return;
  const textLinks = el.querySelectorAll('a:not([class])');
  textLinks.forEach((link) => { link.classList.add('static'); });
}

function decorateModalImage(el, lnkImg) {
  if (el.classList.contains('split')) lnkImg.closest('div').classList.add('has-modal');
  lnkImg.classList.add('play-btn');
  const playIconContainer = createTag('div', { class: 'play-icon-container', 'aria-label': 'play' }, PLAY_ICON);
  const playCircle = createTag('div', { class: 'play-btn-circle', 'aria-label': 'play' }, playIconContainer);
  const playContainer = createTag('div', { class: 'play-container', 'aria-label': 'play' });
  lnkImg.parentNode.appendChild(lnkImg.querySelector('picture'));
  lnkImg.parentNode.appendChild(playContainer);
  lnkImg.appendChild(playCircle);
  playContainer.appendChild(lnkImg);
}

function decorateIconStack(el) {
  if (!(el.classList.contains('medium') || el.classList.contains('large'))) return;
  const stackEl = el.querySelector('ul img');
  if (stackEl) {
    stackEl.closest('ul').classList.add('icon-stack-area', 'body-s');
    el.classList.add('icon-stack');
  }
  const stackItems = el.querySelectorAll('ul li');
  [...stackItems].forEach((stackItem) => {
    const links = stackItem.querySelectorAll('a');
    if (stackItem.querySelectorAll('a').length <= 1) return;
    const picIndex = links[0].querySelector('a picture') ? 0 : 1;
    const linkImg = links[picIndex];
    const linkText = picIndex === 0 ? links[1] : links[0];
    linkText.prepend(linkImg.querySelector('picture'));
    linkImg.remove();
  });
}

function decorateMedia(el) {
  if (!(el.classList.contains('medium') || el.classList.contains('large'))) return;
  const allMedia = el.querySelectorAll('div > p video, div > p picture');
  let processed = false;
  allMedia.forEach((media) => {
    if (processed) return;
    const parentP = media.closest('p');
    const siblingP = parentP?.nextElementSibling;
    if (!siblingP || siblingP.nodeName.toLowerCase() !== 'p') return;
    const siblingText = siblingP.textContent;
    const hasFormats = siblingText.match(ASPECT_RATIO)?.index;
    if (!(hasFormats === 0)) return;
    processed = true;
    const formats = siblingText.split(': ')[1]?.split(/\s+/);
    const formatClasses = formats ? ['format',
      `desktop-${formats[((formats.length - 1) > 0) ? (formats.length - 1) : 0]}`,
      `tablet-${formats[((formats.length - 2) > 0) ? (formats.length - 2) : 0]}`,
      `mobile-${formats[0]}`,
    ] : [];
    media.closest('div').classList.add(...formatClasses);
    siblingP.remove();
    media.closest('div').insertBefore(media, parentP);
    parentP.remove();
  });
}

function decorateVideo(container) {
  const link = container.querySelector('a[href*=".mp4"]');
  if (!link) return;
  const isNotLooped = !!(link.hash?.includes('autoplay1'));
  const attrs = `playsinline autoplay ${isNotLooped ? '' : 'loop'} muted`;
  container.innerHTML = `<video preload="metadata" ${attrs}>
    <source src="${link.href}" type="video/mp4" />
  </video>`;
  container.classList.add('has-video');
}

function decorateBlockBg(block, node) {
  const viewports = ['mobile-only', 'tablet-only', 'desktop-only'];
  const childCount = node.childElementCount;
  const { children } = node;
  node.classList.add('background');
  if (childCount === 2) {
    children[0].classList.add(viewports[0], viewports[1]);
    children[1].classList.add(viewports[2]);
  }
  [...children].forEach(async (child, index) => {
    if (childCount === 3) {
      child.classList.add(viewports[index]);
    }
    decorateVideo(child);
  });
  if (!node.querySelector(':scope img') && !node.querySelector(':scope video')) {
    block.style.background = node.textContent;
    node.remove();
  }
}

function decorateLayout(el) {
  const elems = el.querySelectorAll(':scope > div');
  if (elems.length > 1) decorateBlockBg(el, elems[0]);
  const foreground = elems[elems.length - 1];
  foreground.classList.add('foreground', 'container');
  if (el.classList.contains('split')) decorateMedia(el);
  const text = foreground.querySelector('h1, h2, h3, h4, h5, h6, p')?.closest('div');
  text?.classList.add('text');
  const media = foreground.querySelector(':scope > div:not([class])');
  if (!el.classList.contains('notification')) media?.classList.add('image');
  const picture = text?.querySelector('p picture');
  const iconArea = picture ? (picture.closest('p') || createTag('p', null, picture)) : null;
  iconArea?.classList.add('icon-area');
  const foregroundImage = foreground.querySelector(':scope > div:not(.text) img')?.closest('div');
  const bgImage = el.querySelector(':scope > div:not(.text) img')?.closest('div');
  const foregroundMedia = foreground.querySelector(':scope > div:not(.text) video')?.closest('div');
  const bgMedia = el.querySelector(':scope > div:not(.text) video')?.closest('div');
  const image = foregroundImage ?? bgImage;
  const asideMedia = foregroundMedia ?? bgMedia ?? image;
  if (asideMedia && !asideMedia.classList.contains('text')) {
    const isSplit = el.classList.contains('split');
    asideMedia.classList.add(`${isSplit ? 'split-' : ''}image`);
    if (isSplit) {
      const position = Array.from(asideMedia.parentNode.children).indexOf(asideMedia);
      el.classList.add(`split${!position ? '-right' : '-left'}`);
      foreground.parentElement.appendChild(asideMedia);
    }
    const lnkImg = el.querySelector('.image a');
    if (image && lnkImg?.dataset?.modalHash) {
      decorateModalImage(el, lnkImg);
    }
  } else if (!iconArea) {
    foreground?.classList.add('no-image');
  }
  if (el.classList.contains('split')) decorateIconStack(el);
  return foreground;
}

export default function init(el) {
  const blockData = getBlockData(el);
  const blockText = decorateLayout(el);
  decorateBlockText(blockText, blockData);
  decorateStaticLinks(el);
}

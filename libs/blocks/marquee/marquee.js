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
 * Marquee - v6.0
 */
import { decorateButtons, getBlockSize } from '../../utils/decorate.js';
import { decorateBlockAnalytics, decorateLinkAnalytics } from '../../martech/attributes.js';
import { createTag } from '../../utils/utils.js';

const decorateVideo = (container) => {
  const link = container.querySelector('a[href$=".mp4"]');

  container.innerHTML = `<video preload="metadata" playsinline autoplay muted loop>
    <source src="${link.href}" type="video/mp4" />
  </video>`;
  container.classList.add('has-video');
};

const decorateBlockBg = (block, node) => {
  const viewports = ['mobileOnly', 'tabletOnly', 'desktopOnly'];
  const childCount = node.childElementCount;
  const { children } = node;

  node.classList.add('background');

  if (childCount === 2) {
    children[0].classList.add(viewports[0], viewports[1]);
    children[1].classList.add(viewports[2]);
  }

  Array.from(children).forEach((child, index) => {
    if (childCount === 3) {
      child.classList.add(viewports[index]);
    }

    if (child.querySelector('a[href$=".mp4"]')) {
      decorateVideo(child);
    }
  });

  if (!node.querySelector(':scope img') && !node.querySelector(':scope video')) {
    block.style.background = node.textContent;
    node.remove();
  }
};

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.nextElementSibling?.classList.add(`body-${bodySize}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      sib.querySelector('img, .icon') ? sib.classList.add('icon-area') : sib.classList.add(`detail-${detailSize}`);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  size === 'large' ? decorate(heading, 'XXL', 'XL', 'L') : decorate(heading, 'XL', 'M', 'M');
}

function extendButtonsClass(text) {
  const buttons = text.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => { button.classList.add('button-justified-mobile') });
}

export default function init(el) {
  decorateBlockAnalytics(el);
  const isLight = el.classList.contains('light');
  if (!isLight) el.classList.add('dark');
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  if (children.length > 1) {
    children[0].classList.add('background');
    decorateBlockBg(el, children[0]);
  }
  foreground.classList.add('foreground', 'container');
  const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  const text = headline.closest('div');
  text.classList.add('text');
  const media = foreground.querySelector(':scope > div:not([class])');
  media?.classList.add('media');

  if (media?.querySelector('a[href$=".mp4"]')) {
    decorateVideo(media);
  } else {
    media?.classList.add('image');
  }

  const firstDivInForeground = foreground.querySelector(':scope > div');
  if (firstDivInForeground.classList.contains('media')) el.classList.add('row-reversed');

  const size = getBlockSize(el);
  decorateButtons(text, size === 'large' ? 'button-XL' : 'button-L');
  const headings = text.querySelectorAll('h1, h2, h3, h4, h5, h6');
  decorateLinkAnalytics(text, headings);
  decorateText(text, size);
  extendButtonsClass(text);
  if (el.classList.contains('split')) {
    if (foreground && media) {
      media.classList.add('bleed');
      foreground.insertAdjacentElement('beforebegin', media);
    }
    if (media?.lastChild.textContent.trim()) {
      const mediaCreditInner = createTag('p', { class: 'body-S' }, media.lastChild.textContent);
      const mediaCredit = createTag('div', { class: 'media-credit container' }, mediaCreditInner);
      el.appendChild(mediaCredit);
      el.classList.add('has-credit');
      media.lastChild.remove();
    }
  }
}

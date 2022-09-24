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
import { decorateBlockAnalytics, decorateLinkAnalytics } from '../../utils/analytics.js';
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
  buttons.forEach((button) => { button.classList.add('button-justified-mobile'); });
}

function findAnchorTarget(text) {
  let linkText = text.toLowerCase();
  linkText = linkText.charAt(0) === '_' ? linkText.substring(1) : linkText;
  linkText = linkText.replaceAll('_', '-');
  linkText = linkText.replaceAll(/[ /|&;$%@"<>()+,.]/g, '');
  return document.querySelector(`[id^="${linkText}"]`);
}

const DOWN_ARROW_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="10.875" height="13.323" viewBox="0 0 10.875 13.323">
  <g id="Group_177418" data-name="Group 177418" transform="translate(223.353 -1276.435) rotate(90)">
    <line id="line_color_border_" data-name="line [color_border]" x2="10.909" transform="translate(1277.435 217.875)" fill="none" stroke="#1473e6" stroke-linecap="round" stroke-width="2"/>
    <g id="arrow_head" data-name="arrow head" transform="translate(1284.32 213.892) rotate(45)">
      <line id="line_color_border_2" data-name="line [color_border]" x2="5.69" transform="translate(0 0)" fill="none" stroke="#1473e6" stroke-linecap="round" stroke-width="2"/>
      <line id="line_color_border_3" data-name="line [color_border]" y2="5.69" transform="translate(5.69 0)" fill="none" stroke="#1473e6" stroke-linecap="round" stroke-width="2"/>
    </g>
  </g>
</svg>`;

function tocItem(title, subtitle, target) {
  const onClick = () => {
    target?.scrollIntoView(true);
    target?.focus();
  };

  const sectionTitle = `<p class="section-title">${title}</p>`;
  const sectionDescription = subtitle ? `<p class="section-description">${subtitle}</p>` : '';
  const html = `<div class="toc-link-text">
    ${sectionTitle}
    ${sectionDescription}
  </div>
  <div class="toc-arrow">
    ${DOWN_ARROW_ICON}
  </div>`;

  const el = createTag('section', { class: 'toc-item' }, html);

  el.addEventListener('click', onClick);

  return el;
}

export default function init(el) {
  decorateBlockAnalytics(el);
  const isLight = el.classList.contains('light');
  const isTableOfContents = el.classList.contains('toc');
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

  if (isTableOfContents) {
    const tocSource = foreground.lastElementChild;
    const tocLinks = tocSource.querySelectorAll('a');
    const title = tocSource.querySelector('p');

    const tocTitle = `<p class="toc-title">${title.textContent}</p>`;
    const toc = createTag('div', { class: 'toc-container' }, tocTitle);

    tocLinks.forEach((link) => {
      const target = findAnchorTarget(link.textContent);
      const subtitle = link.closest('p')?.previousElementSibling;
      const linkTitle = subtitle?.previousElementSibling;
      const item = tocItem(linkTitle?.textContent, subtitle?.textContent, target);
      toc.appendChild(item);
    });

    foreground.replaceChild(toc, tocSource);
  }

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
  }
}

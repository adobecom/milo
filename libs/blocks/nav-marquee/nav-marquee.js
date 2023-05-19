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
 * Navigation Marquee
 */

import { createTag, getConfig } from '../../utils/utils.js';
import { getMetadata } from '../section-metadata/section-metadata.js';
import { decorateButtons, getBlockSize } from '../../utils/decorate.js';

const getIndexedValues = (text) => text.split('\n').map((value) => value.split(/,(.*)/s).map((v) => v.trim()));

const DOWN_ARROW_ICON = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10.875" height="13.323" viewBox="0 0 10.875 13.323"><title>down arrow</title><g fill="none" stroke="#1473e6" stroke-linecap="round" stroke-width="2"><path d="M5.478 1v10.909"/><g><path d="m9.461 7.885-4.023 4.023m0 0L1.414 7.885"/></g></g></svg>';

function findAnchorTarget(text) {
  let linkText = text.toLowerCase();
  linkText = linkText.charAt(0) === '_' ? linkText.substring(1) : linkText;
  linkText = linkText.replaceAll('_', '-');
  linkText = linkText.replaceAll(/[ /|&;$%@"<>()+,.]/g, '');
  return document.querySelector(`[id^="${linkText}"]`);
}

function getItem(title, description, target) {
  const item = createTag('li', { class: 'toc-item' });
  const linkText = createTag('div', { class: 'toc-link-text' });
  const pageTop = document.querySelector('header')?.offsetHeight ?? 0;

  if (title) {
    const link = createTag('a', { class: 'section-title', href: `#${target?.id}`, target: '_self' }, title);
    linkText.append(link);
    item.addEventListener('click', () => {
      const isTextSelected = window.getSelection().toString();

      if (!isTextSelected) {
        link.click();
      }
    });
    link.addEventListener('click', (e) => {
      const targetPosition = target?.getBoundingClientRect().top ?? 0;
      const offsetPosition = targetPosition + window.pageYOffset - pageTop;

      e.preventDefault();
      window.scrollTo(0, offsetPosition);
      target?.setAttribute('tabindex', -1);
      target?.focus();
    });
  }

  if (description) linkText.append(createTag('p', { class: 'section-description' }, description));
  item.append(linkText);
  if (target) item.append(createTag('div', { class: 'toc-arrow' }, DOWN_ARROW_ICON));

  return item;
}

function buildMarquee(text, table) {
  if (!text) return;
  const marqueeBlock = getIndexedValues(text);
  const foreground = document.createElement('div');
  foreground.classList.add('foreground', 'container');
  const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  // const something = headline.closest('div');
  console.log('Building Marquee');
  console.log(foreground);

  marqueeBlock.forEach((text) => {
    foreground.append(text);
  });
  table.append(foreground);
}

function buildSections(text, navTable) {
  if (!text) return;
  const sectionBlock = getIndexedValues(text);
  const navContainer = document.createElement('div');
  navContainer.classList.add('container', 'toc-container');
  const navList = createTag('li', { class: 'toc-item' });
  const tocLinkText = createTag('div', { class: 'toc-link-text' });
  console.log('Section all?');
  sectionBlock.forEach((text) => {
    // Heading
    tocLinkText.append(text);
    // body
    // link
  });
  if (text) navTable.append(createTag('li', { class: 'toc-item' }, tocLinkText));
  navTable.append(tocLinkText);
}

function decorateText(text, size) {
  const headings = text.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.leƒngth - 1];
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.nextElementSibling?.classList.add(`body-${bodySize}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      sib.querySelector('img, .icon') ? sib.classList.add('icon-area') : sib.classList.add(`detail-${detailSize}`);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  size === 'large' ? decorate(heading, 'xxl', 'xl', 'l') : decorate(heading, 'xl', 'm', 'm');
}

export default function init(el) {
  const { env } = getConfig();
  const table = el.closest('.section');
  // if (!table) return;

  // if (!el.previousElementSibling?.classList.contains('marquee')) {
  //   if (env?.name === 'prod') {
  //     el.style.display = 'none';
  //     return;
  //   }
  //   // const heading = createTag('h2', null, 'This block should be paired with a marquee in a section.');
  //   // el.replaceChildren(heading);
  //   return;
  // }

  const metadata = getMetadata(el);
  console.log(metadata);
  // const text = headline.closest('div');
  const size = getBlockSize(el);
  console.log(`metadata size: ${size}`);

  // const text = table.closest('div');

  const children = Array.from(el.querySelectorAll(':scope > div'));
  const title = children.shift().textContent;
  const toc = createTag('div', { class: 'table-of-contents' });
  const tocContainer = createTag('div', { class: 'container toc-container' }, `<p class="toc-title">${title}</p>`);
  const tocNav = createTag('nav', { 'aria-label': 'Table of contents' });
  const navUl = createTag('ul', { class: 'toc-list' });

  if (metadata.marquee.text) buildMarquee(metadata.marquee.text, table);
  if (metadata.section.text) buildSections(metadata.section.text, navUl);
  toc.append(navUl);
  tocContainer.append(navUl);
  table.append(navUl);
  console.log('Table');
  console.log(table);
  // tocNav.append(navUl);
  // tocContainer.append(tocNav);
  // el.replaceChildren(tocContainer);
  // el.replaceChildren(table);
  el.append(table);
}

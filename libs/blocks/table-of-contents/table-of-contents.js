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
 * Table of Contents
 */

import { createTag, getConfig } from '../../utils/utils.js';

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

export default function init(el) {
  const { env } = getConfig();

  if (!el.previousElementSibling?.classList.contains('marquee')) {
    if (env?.name === 'prod') {
      el.style.display = 'none';
      return;
    }
    const heading = createTag('h2', null, 'This block should be paired with a marquee in a section.');
    el.replaceChildren(heading);
    return;
  }

  const children = Array.from(el.querySelectorAll(':scope > div'));
  const title = children.shift().textContent;
  const tocContainer = createTag('div', { class: 'container toc-container' }, `<p class="toc-title">${title}</p>`);
  const tocNav = createTag('nav', { 'aria-label': 'Table of contents' });
  const navUl = createTag('ul', { class: 'toc-list' });

  children.forEach((section) => {
    const sectionTags = Array.from(section.querySelectorAll('p'));
    const sectionTitle = section.querySelector('strong');
    const link = section.querySelector('a');
    const subtitle = sectionTags.find((element) => element.childElementCount === 0);
    const target = link ? findAnchorTarget(link.textContent) : null;
    const item = getItem(sectionTitle?.textContent, subtitle?.textContent, target);
    navUl.append(item);
  }, '');

  tocNav.append(navUl);
  tocContainer.append(tocNav);
  el.replaceChildren(tocContainer);
}

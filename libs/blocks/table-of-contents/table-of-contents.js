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
import { createTag } from '../../utils/utils.js';

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

function tocItem(title, description, target) {
  const onClick = (e) => {
    e.preventDefault();
    const pageTop = document.querySelector('header')?.offsetHeight ?? 0;
    const targetPosition = target?.getBoundingClientRect()?.top ?? 0;
    const offsetPosition = targetPosition + window.pageYOffset - pageTop;

    window.scrollTo(0, offsetPosition);
    target?.setAttribute('tabindex', -1);
    target?.focus();
  };

  const sectionTitle = `<p class="section-title">${title}</p>`;
  const sectionDescription = description ? `<p class="section-description">${description}</p>` : '';
  const sectionLink = target ? `<a class="section-link" href="#${target.id}">${target.textContent}</a>` : '';
  const html = `<div class="toc-link-text">
    ${sectionTitle}
    ${sectionDescription}
    ${sectionLink}
  </div>
  <div class="toc-arrow">
    ${DOWN_ARROW_ICON}
  </div>`;

  const item = createTag('section', { class: 'toc-item' }, html);
  item.querySelector('a')?.addEventListener('click', onClick);

  return item;
}

export default function init(el) {
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const title = children.shift().textContent;

  const tocTitle = createTag('p', { class: 'toc-title' }, title);
  const tocContainer = createTag('div', { class: 'container toc-container' }, tocTitle);

  children.forEach((section) => {
    const sectionTitle = section.querySelector('strong');
    const link = section.querySelector('a');
    const subtitle = section.querySelectorAll('p').length > 2 ? section.querySelectorAll('p')[1] : null;
    const target = findAnchorTarget(link.textContent);
    const item = tocItem(sectionTitle?.textContent, subtitle?.textContent, target);
    tocContainer.append(item);
  });

  el.replaceChildren(tocContainer);
}

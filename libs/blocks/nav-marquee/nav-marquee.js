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
import { createTag } from '../../utils/utils.js';
import { decorateButtons, getBlockSize } from '../../utils/decorate.js';

const DOWN_ARROW_ICON = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="10.875" height="13.323" viewBox="0 0 10.875 13.323"><title>down arrow</title><g fill="none" stroke="#1473e6" stroke-linecap="round" stroke-width="2"><path d="M5.478 1v10.909"/><g><path d="m9.461 7.885-4.023 4.023m0 0L1.414 7.885"/></g></g></svg>';

function findAnchorTarget(text) {
  let linkText = text.toLowerCase();
  if (linkText.charAt(0) === '_') {
    linkText = linkText.slice(1).replaceAll('_', '-').replaceAll(/[ /|&;$%@"<>()+,.]/g, '');
    linkText = `#${linkText}`;
  }
  return linkText;
}

let tabNumber = 0;
function incrementTab() {
  tabNumber += 1;
  return tabNumber;
}

function getItem(title, description, target) {
  if (!title) return null;
  const item = createTag('li', { class: 'offer-item' });
  item.setAttribute('tabNumber', incrementTab(tabNumber));
  const linkText = createTag('div', { class: 'offer-link-text' });
  const pageTop = document.querySelector('header')?.offsetHeight ?? 0;
  const link = createTag('a', { class: 'section-title', href: target, target: '_self' }, title);
  linkText.append(link);
  item.addEventListener('click', () => {
    const isTextSelected = window.getSelection().toString();

    if (!isTextSelected) {
      link.click();
    }
  });
  link.addEventListener('click', (e) => {
    const targetPosition = target?.getBoundingClientRect()?.top ?? 0;
    const offsetPosition = targetPosition + window.pageYOffset - pageTop;

    e.preventDefault();
    window.scrollTo(0, offsetPosition);
    target?.setAttribute('tabindex', -1);
    target?.focus();
  });

  if (description) linkText.append(createTag('p', { class: 'section-description' }, description));
  item.append(linkText);
  item.append(createTag('div', { class: 'offer-arrow' }, DOWN_ARROW_ICON));
  return item;
}

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    const { nextElementSibling } = headingEl;
    nextElementSibling?.classList.add(`body-${bodySize}`);
    const { previousElementSibling } = headingEl;
    if (previousElementSibling) {
      previousElementSibling.classList.add(
        previousElementSibling.querySelector('img, .icon') ? 'icon-area' : `detail-${detailSize}`
      );
      previousElementSibling.previousElementSibling?.classList.add('icon-area');
    }
  };
  const headingSize = size === 'large' ? 'xxl' : 'xl';
  const bodySize = size === 'large' ? 'xl' : 'm';
  const detailSize = size === 'large' ? 'l' : 'm';
  decorate(heading, headingSize, bodySize, detailSize);
}

export default function init(el) {
  const size = getBlockSize(el);
  const children = Array.from(el.querySelectorAll(':scope > div'));
  const tone = (el.classList.contains('dark')) ? 'dark' : 'light';
  el.classList.add(tone);
  const marqueeContent = createTag('div', { class: 'foreground' }, children.shift());
  const marquee = createTag('div', { class: `marquee` }, marqueeContent);
  marqueeContent.firstElementChild.classList.add('text');

  decorateText(marquee, size);
  decorateButtons(marquee, size === 'large' ? 'button-xl' : 'button-l');
  marquee.className = `marquee`;

  const header = createTag('p', { class: 'offer-title' });
  const footer = createTag('p', { class: 'offer-footer' });
  const offerNav = createTag('nav');
  const navUl = createTag('ul', { class: 'offer-list' });
  children.forEach((section) => {
    if (section.firstElementChild.textContent === 'header') {
      header.append(section.lastElementChild.textContent);
      section.remove();
      return;
    }

    if (section.firstElementChild.textContent === 'footer') {
      footer.append(section.lastElementChild);
      section.remove();
      return;
    }
    const sectionTitle = section.querySelector('strong');
    const link = section.querySelector('a');
    const subtitle = [...section.querySelectorAll('p')].find((element) => element.childElementCount === 0);
    const target = link ? findAnchorTarget(link.textContent) : null;
    const item = getItem(sectionTitle?.textContent, subtitle?.textContent, target);
    navUl.append(item);
    section.remove();
  }, '');
  const offerContainer = createTag('div', { class: 'offer-container' }, header);
  offerContainer.append(offerNav);
  offerContainer.append(footer);
  const offer = createTag('div', { class: 'content-table' }, offerContainer);

  offerNav.append(navUl);
  el.append(marquee);
  el.append(offer);
}

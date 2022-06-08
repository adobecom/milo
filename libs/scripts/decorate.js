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

export function decorateButtons(el, isLarge) {
  const buttons = el.querySelectorAll('em a, strong a');
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    const buttonSize = isLarge ? 'button-XL' : 'button-M';
    button.classList.add('con-button', buttonType, buttonSize);
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  if (buttons.length > 0) {
    const actionArea = buttons[0].closest('p');
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
  }
}

export function decorateIcons(el, displayText = true) {
  const regex = /[^{{]+(?=}})/g; // {{value}}
  const placeholders = el.textContent.match(regex);
  placeholders?.forEach((str) => {
    if (window.iconLibrary) {
      const icon = window.iconLibrary[str];
      const size = str.includes('persona') ? 80 : 40;
      if (icon) {
        const svg = `<img height="${size}" width="${size}" alt="${icon.label}" src="${icon.value}">`;
        const label = `${svg} ${displayText ? icon.label : ''}`;
        const anchor = `<a class="icon ${str}" href="${icon.link}">${label}</a>`;
        const inner = `<span class="icon ${str}">${label}</span>`;
        el.innerHTML = el.innerHTML.replace(`{{${str}}}`, icon.link ? anchor : inner);
      } else {
        el.innerHTML = el.innerHTML.replace(`{{${str}}}`, '');
      }
    } else {
      el.innerHTML = el.innerHTML.replace(`{{${str}}}`, `<span class="icon">${str}</span>`);
    }
  });
  const icons = el.querySelectorAll('.icon');
  if (icons.length > 0) {
    let areaIndex = 0;
    if (icons[0].classList.contains('icon-persona')) {
      icons[0].closest('p').classList.add('persona-area');
      areaIndex = 1;
    }
    icons[areaIndex].closest('p').classList.add('icon-area');
  }
}

export function decorateBlockDaa(el) {
  const lh = [];
  const exclude = ['--', 'block'];
  el.classList.forEach((c) => {
    if (!c.includes(exclude[0]) && c !== exclude[1]) lh.push(c);
  });
  el.setAttribute('daa-im', 'true');
  el.setAttribute('daa-lh', lh.join('|'));
}

export function decorateTextDaa(el, heading) {
  el.setAttribute('daa-lh', heading.textContent);
  const links = el.querySelectorAll('a, button');
  if (links) {
    links.forEach((link, i) => {
      const linkType = () => {
        if (link.classList.contains('con-button') || link.nodeName === 'BUTTON') {
          return 'cta';
        }
        if (link.classList.contains('icon')) {
          return 'icon cta';
        }
        return 'link';
      };
      const str = `${linkType(link)}|${link.innerText} ${i + 1}`;
      link.setAttribute('daa-ll', str);
    });
  }
}

export function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  if (!size || size === 'small') {
    heading.classList.add('heading-XS');
    heading.nextElementSibling.classList.add('body-S');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-M');
    }
  }
  if (size === 'medium') {
    heading.classList.add('heading-M');
    heading.nextElementSibling.classList.add('body-S');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-M');
    }
  }
  if (size === 'large') {
    heading.classList.add('heading-XL');
    heading.nextElementSibling.classList.add('body-M');
    if (heading.previousElementSibling) {
      heading.previousElementSibling.classList.add('detail-L');
    }
  }
  decorateIcons(el);
  decorateButtons(el);
  decorateTextDaa(el, heading);
}

export function isHexColorDark(color) {
  if (color[0] !== '#') return false;
  const hex = color.replace('#', '');
  const c_r = parseInt(hex.substr(0, 2), 16);
  const c_g = parseInt(hex.substr(2, 2), 16);
  const c_b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
  return brightness < 155;
}

export function decorateBlockBg(block, node) {
  node.classList.add('background');
  if (!node.querySelector(':scope img')) {
    block.style.background = node.textContent;
    if (isHexColorDark(node.textContent)) block.classList.add('dark');
    node.remove();
  }
}

export function getBlockSize(el) {
  const sizes = ['small', 'medium', 'large'];
  let defaultSize = sizes[1];
  sizes.forEach((size) => {
    if (el.classList.contains(size)) {
      defaultSize = size;
    }
  });
  return defaultSize;
}

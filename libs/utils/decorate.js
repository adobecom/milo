//
// Shared decorate utils for Consonant blocks
// Block usage ref: [media, z-pattern]
//

import { decorateLinkAnalytics } from './analytics.js';
import { getIconLibrary } from '../ui/library/icon.js';

const iconLibrary = await getIconLibrary();

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

export async function decorateIcons(el, displayText = true) {
  const regex = /[^{{]+(?=}})/g; // {{value}}
  const placeholders = el.textContent.match(regex);
  placeholders?.forEach((str) => {
    if (iconLibrary) {
      const icon = iconLibrary[str];
      const size = str.includes('persona') ? 80 : 40;
      if (icon) {
        const svg = `<img height="${size}" width="${size}" alt="${icon.label}" src="${icon.value}">`;
        const label = `${svg} ${(displayText && icon.label !== undefined) ? icon.label : ''}`;
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
    icons[areaIndex]?.closest('p').classList.add('icon-area');
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
  decorateLinkAnalytics(el, heading);
}

export function isHexColorDark(color) {
  if (color[0] !== '#') return false;
  const hex = color.replace('#', '');
  const cR = parseInt(hex.substr(0, 2), 16);
  const cG = parseInt(hex.substr(2, 2), 16);
  const cB = parseInt(hex.substr(4, 2), 16);
  const brightness = ((cR * 299) + (cG * 587) + (cB * 114)) / 1000;
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
  return sizes.reduce((rdx, size) => {
    if (el.classList.contains(size)) {
      return size;
    }
    return rdx;
  }, sizes[1]);
}

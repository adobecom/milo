
import { decorateLinkAnalytics } from './analytics.js';

export function decorateButtons(el) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    button.classList.add('con-button', buttonType);
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  const actionArea = buttons[0].closest('p');
  actionArea.classList.add('action-area');
  actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
}

export function initIcons(el) {
  // eslint-disable-next-line no-useless-escape
  const regex = /\{\{icon-(.*?)\}\}+/g; // {{icon-*}}
  const finds = el.textContent.match(regex);
  finds?.forEach((find) => {
    const str = find.replace('{{', '').replace('}}', '');
    el.innerHTML = el.innerHTML.replace(`{{${str}}}`, `<span class="icon">${str}</span>`);
  });
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) {
      icon.parentElement.classList.add('persona-area');
    }
  });
}

export async function decorateIcons(iconLibrary) {
  const el = document.querySelector('main');
  const icons = el.querySelectorAll('.icon');
  icons?.forEach((i) => {
    const str = i.textContent;
    const icon = iconLibrary[str];
    const size = str.includes('persona') ? 80 : 40;
    if (iconLibrary && icon) {
      const styles = icon.key.replaceAll('-', ', ').split(', ');
      if (styles) i.classList.add(icon.key, ...styles);
      i.classList.add(icon.key)
      const svg = `<img height="${size}" width="${size}" alt="${icon.label}" src="${icon.value}">`;
      const label = `${svg} ${(icon.label !== undefined) ? icon.label : ''}`;
      const anchor = `<a class="icon ${str}" href="${icon.link}">${label}</a>`;
      if (icon.link !== undefined) {
        i.outerHTML = anchor;
      } else {
        i.innerHTML = i.innerHTML.replace(str, label);
      }
    }
  });
}

export function decorateBlockText(el, size = 'small') {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.nextElementSibling.classList.add(`body-${bodySize}`);
    if (headingEl.previousElementSibling) {
      headingEl.previousElementSibling.classList.add(`detail-${detailSize}`);
    }
  };
  if (size === 'medium') {
    decorate(heading, 'M', 'S', 'M');
  } else if (size === 'large') {
    decorate(heading, 'XL', 'M', 'L');
  } else {
    decorate(heading, 'XS', 'S', 'M');
  }
  initIcons(el);
  decorateButtons(el);
  decorateLinkAnalytics(el, heading);
}

export function isHexColorDark(color) {
  if (!color.trim().startsWith('#')) return false;
  const hex = color.trim().replace('#', '');
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

export async function getIconLibrary(path = '/docs/library/tokens.json') {
  let library = {};
  const url = (window.location.port === '2000') ? `https://main--milo--adobecom.hlx.page${path}`
    /* c8 ignore next */
    : path;
  const resp = await fetch(url);
  /* c8 ignore next */
  if (!resp.ok) return;
  const json = await resp.json();
  json['icons']?.data.forEach((item) => {
    const itemValues = {};
    Object.entries(item).forEach((value) => {
      const itemValue = value[1];
      if (itemValue) {
        itemValues[value[0]] = itemValue;
      }
    });
    library[item.key] = itemValues;
  });
  await decorateIcons(library);
}

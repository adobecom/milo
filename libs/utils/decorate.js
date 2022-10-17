import { decorateLinkAnalytics } from '../martech/attributes.js';
import { createTag, getConfig, } from '../utils/utils.js';

export function decorateButtons(el, size) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length === 0) return;
  buttons.forEach((button, idx) => {
    const parent = button.parentElement;
    let buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    if (buttonType === 'outline' && button.firstChild.nodeName === 'STRONG') buttonType = 'fill';
    button.classList.add('con-button', buttonType);
    if (size) button.classList.add(size); /* button-L, button-XL */
    const actionArea = button.closest('p');
    actionArea?.classList.add('action-area');
    if (idx === buttons.length - 1) {
      button.closest('p')?.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
    }
  });
}

export function decorateIconArea(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export async function getSVGsfromFile(path, selectors) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;

  const text = await resp.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'image/svg+xml');

  if (!selectors) {
    const svg = doc.querySelector('svg');
    if (svg) return [{ svg }];
    /* c8 ignore next */
    return null;
  }

  return selectors.map((selector) => {
    const symbol = doc.querySelector(`#${selector}`);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add('icon-milo', `icon-milo-${selector}`);
    svg.removeAttribute('id');
    return { svg, name: selector };
  });
}

function getIconList(el) {
  const icons = el.querySelectorAll('span.icon');
  let iconList = [];
  icons?.forEach(async (i) => {
    const iconName = i.classList[1].replace('icon-milo-', '');
    if (!iconName) return;
    if (!iconList.includes(iconName)) iconList.push(iconName);
  });
  return iconList;
}

export async function decorateIconsInBlock(el) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;

  const icons = el.querySelectorAll('span.icon');
  const iconList = getIconList(el) || [];
  const svgs = await getSVGsfromFile(`${base}/img/icons/icons.svg`, iconList);
  if (!svgs) return;

  icons?.forEach(async (i) => {
    const iconName = i.classList[1].replace('icon-milo-', '');
    const iconSvg = svgs.map((symbol) => {
      if (symbol.name === iconName) {
        return symbol.svg;
      }
      return null;
    });
    i.insertAdjacentHTML('afterbegin', iconSvg[0].outerHTML);
  });
}

export function decorateBlockText(el, size = 'small') {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const decorate = (headingEl, headingSize, bodySize, detailSize) => {
    headingEl.classList.add(`heading-${headingSize}`);
    headingEl.nextElementSibling?.classList.add(`body-${bodySize}`);
    headingEl.previousElementSibling?.classList.add(`detail-${detailSize}`);
  };
  if (size === 'small') {
    decorate(heading, 'XS', 'S', 'M');
  } else if (size === 'large') {
    decorate(heading, 'XL', 'M', 'L');
  } else {
    decorate(heading, 'M', 'S', 'M');
  }
  decorateIconArea(el);
  decorateButtons(el);
  decorateLinkAnalytics(el, headings);
  decorateIconsInBlock(el);
}

export function decorateBlockBg(block, node) {
  node.classList.add('background');
  if (node.childElementCount > 1) {
    const viewports = ['mobileOnly', 'tabletOnly', 'desktopOnly'];
    if (node.childElementCount === 2) {
      node.children[0].classList.add(viewports[0], viewports[1]);
      node.children[1].classList.add(viewports[2]);
    } else {
      [...node.children].forEach( (e, i) => {
        /* c8 ignore next */
        e.classList.add(viewports[i]);
      });
    }
  }
  if (!node.querySelector(':scope img')) {
    block.style.background = node.textContent;
    node.remove();
  }
}

export function getBlockSize(el) {
  const sizes = ['small', 'medium', 'large'];
  return sizes.find((size) => el.classList.contains(size)) || sizes[1]; /* medium default */
}

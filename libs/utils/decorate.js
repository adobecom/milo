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
    if(actionArea) {
      actionArea.classList.add('action-area');
      if (idx === buttons.length - 1) {
        actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
      }
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

export async function getSVGsfromFile(path) {
  if (!path) return null;
  const resp = await fetch(path);
  if (!resp.ok) return null;
  const miloIcons = {};
  const text = await resp.text();
  const parser = new DOMParser();
  const parsedText = parser.parseFromString(text, 'image/svg+xml');
  const symbols = parsedText.querySelectorAll(`symbol`);
  symbols.forEach( (symbol) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    while (symbol.firstChild) svg.appendChild(symbol.firstChild);
    [...symbol.attributes].forEach((attr) => svg.attributes.setNamedItem(attr.cloneNode()));
    svg.classList.add('icon-milo', `icon-milo-${svg.id}`);
    miloIcons[svg.id] = svg;
  });
  return miloIcons;
}

// export async function decorateIconsInBlock(el) {
//   const { miloLibs, codeRoot } = getConfig();
//   const base = miloLibs || codeRoot;
//   console.log(Object.keys(ICONS))
//   if (Object.keys(ICONS).length === 0)
//     await getSVGsfromFile(`${base}/img/icons/icons.svg`);
//   if (!ICONS)
//     return;
//   const icons = el.querySelectorAll('span.icon');
//   icons?.forEach(async (i) => {
//     const iconName = i.classList[1].replace('icon-milo-', '');
//     if (iconName === ICONS[iconName].id) {
//       i.insertAdjacentHTML('afterbegin', ICONS[iconName].outerHTML);
//     }
//   });
// }

export async function loadIcons(el = document) {
  const { miloLibs, codeRoot } = getConfig();
  const base = miloLibs || codeRoot;
  const miloIcons = await getSVGsfromFile(`${base}/img/icons/icons.svg`);
  if (!miloIcons) return;
  const icons = el.querySelectorAll('span.icon');
  icons?.forEach(async (i) => {
    const iconName = i.classList[1].replace('icon-milo-', '');
    if (iconName === miloIcons[iconName].id) {
      i.insertAdjacentHTML('afterbegin', miloIcons[iconName].outerHTML);
    }
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

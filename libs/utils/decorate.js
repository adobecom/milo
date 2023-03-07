import { decorateLinkAnalytics } from '../martech/attributes.js';

export function decorateIconArea(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export function decorateBlockText(el, config = ['m', 's', 'm']) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (!el.classList.contains('default')) {
    if (headings) {
      headings.forEach((h) => {
        h.classList.add(`heading-${config[0]}`);
      });
      if (config[2]) {
        headings[0]?.previousElementSibling?.classList.add(`detail-${config[2]}`);
        decorateIconArea(el);
      }
    }
    const emptyPs = el.querySelectorAll(':scope div > p:not([class])');
    if (emptyPs) emptyPs.forEach((p) => { p.classList.add(`body-${config[1]}`); });
  }
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
      [...node.children].forEach((e, i) => {
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

export function getBlockSize(el, defaultSize = 1) {
  const sizes = ['small', 'medium', 'large', 'xlarge'];
  if (defaultSize < 0 || defaultSize > sizes.length - 1) return null;
  return sizes.find((size) => el?.classList.contains(size)) || sizes[defaultSize];
}

function getCopyDescendants(node, fragment = document.createDocumentFragment()) {
  node.childNodes.forEach((child) => {
    fragment.appendChild(child.cloneNode(true));
  });
  return fragment;
}

const isStrongOrEm = (node) => node.nodeName === 'STRONG' || node.nodeName === 'EM';
const isPara = (node) => node.nodeName === 'P';
const ignoreEmptyText = (s) => !(s.nodeType === Node.TEXT_NODE && !s.textContent.trim());
const buttonable = (b) => {
  if (b.nodeName !== 'A' || !b.parentElement || !b.parentElement.parentElement) return false;
  return (isStrongOrEm(b.parentElement) && isPara(b.parentElement.parentElement))
    || (Array.from(b.childNodes).some(isStrongOrEm) && isPara(b.parentElement));
};
export function decorateButton(button, siblingButtons = false) {
  const mapBtnSize = { large: 'button-l', xlarge: 'button-xl' };
  const block = button.closest('.section div[class]:not(.content)');
  const blockSize = getBlockSize(block);
  const size = mapBtnSize[blockSize] ?? blockSize;
  const parent = button.parentElement;

  const child = button.childNodes?.length > 0
    ? Array.from(button.childNodes).filter(isStrongOrEm)[0] : null;
  const grandChild = child?.childNodes?.length > 0
    ? Array.from(child.childNodes).filter(isStrongOrEm)[0] : null;
  const nodes = [parent.nodeName, child?.nodeName, grandChild?.nodeName];
  const text = siblingButtons ? button.textContent : parent.textContent;
  const buttonTypes = [];
  if (nodes.includes('STRONG') && nodes.includes('EM')) {
    buttonTypes.push('fill');
  } else if (nodes.includes('STRONG')) {
    buttonTypes.push('blue');
  } else if (nodes.includes('EM')) {
    buttonTypes.push('outline');
  }
  button.classList.add('con-button', ...buttonTypes);
  button.classList.add(size);
  const validParent = parent.nodeName === 'P' || siblingButtons ? null : parent;
  [grandChild, child, validParent].forEach((n) => {
    if (n && ['STRONG', 'EM'].includes(n.nodeName)) {
      n.replaceWith(getCopyDescendants(n));
    }
  });
  const span = button.querySelector('span');
  button.textContent = text;
  if (span) button.prepend(span);
}

export function decorateActionArea(el) {
  const button = el?.querySelector('a.con-button');
  if (!button) return;
  const actionArea = button.closest('p, div');
  if (actionArea && !actionArea.parentElement.querySelector('.action-area')) {
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
  }
}

export async function decorateLinkToButton(link) {
  if (link.href.includes('#_dns')) {
    link.href = link.href.replace('#_dns', '');
    return;
  }
  if (!buttonable(link)) {
    return;
  }
  const block = link.closest('p');
  let validSiblings = true;
  Array.from(block.childNodes).filter(ignoreEmptyText).forEach((child) => {
    if (buttonable(child) || child.nodeName === 'A') {
      return;
    }
    const grandChildren = Array.from(child.childNodes).filter(ignoreEmptyText);
    if (!grandChildren || grandChildren.length === 0) {
      validSiblings = false;
    }
    grandChildren.forEach((g) => {
      if (!(buttonable(g) || g.nodeName === 'A')) {
        validSiblings = false;
      }
    });
  });
  if (!validSiblings) return;

  if (isStrongOrEm(link.parentElement)) {
    // catch special case where several buttonable links are under the same em or strong
    [...link.parentElement.querySelectorAll(':scope a')]
      .filter((l) => l !== link).forEach((l) => {
        decorateButton(l, true);
      });
  }
  decorateButton(link);
}

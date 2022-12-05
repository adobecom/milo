import { decorateLinkAnalytics } from '../martech/attributes.js';

export function decorateButtons(el, size) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    button.classList.add('con-button', buttonType);
    if (size) button.classList.add(size); /* button-L, button-XL */
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  const actionArea = buttons[0].closest('p, div');
  if (actionArea) {
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
  }
}

export function decorateIconArea(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export function decorateBlockText(el, config = ['M', 'M', 'S'], hasDetail = false) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (!el.classList.contains('default')) {
    const decorateForeground = () => {
      // headings
      if (headings) {
        headings.forEach((h) => {
          h.classList.add(`heading-${config[0]}`);
        });
        if (hasDetail) {
          // detail
          headings[0]?.previousElementSibling?.classList.add(`detail-${config[1]}`);
          decorateIconArea(el);
        }
      }
      // bodys
      const emptyPs = el.querySelectorAll(':scope div > p:not([class])');
      if (emptyPs) emptyPs.forEach((p) => { p.classList.add(`body-${config[2]}`); });
    };
    decorateForeground();
  }
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

export function getBlockSize(el) {
  const sizes = ['small', 'medium', 'large', 'xlarge'];
  return sizes.find((size) => el.classList.contains(size)) || sizes[1]; /* medium default */
}

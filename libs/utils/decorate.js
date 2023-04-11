import { decorateLinkAnalytics } from '../martech/attributes.js';

export async function decorateButtons(el, size) {
  const buttons = el.querySelectorAll('em a, strong a');
  if (buttons.length === 0) return;
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = parent.nodeName === 'STRONG' ? 'blue' : 'outline';
    button.classList.add('con-button', buttonType);
    if (size) button.classList.add(size); /* button-l, button-xl */
    parent.insertAdjacentElement('afterend', button);
    parent.remove();
  });
  const actionArea = buttons[0].closest('p, div');
  if (actionArea) {
    actionArea.classList.add('action-area');
    actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-xl');
  }
}

export function decorateIconArea(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export async function decorateBlockText(el, config = ['m', 's', 'm']) {
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
  await decorateButtons(el);
  await decorateLinkAnalytics(el, headings);
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
  return sizes.find((size) => el.classList.contains(size)) || sizes[defaultSize];
}

export function findElementWithClassStartingOrEndingWith(element, searchString) {
  var classes = element.classList;
  var foundClass = "";
  for (var i = 0; i < classes.length; i++) {
    if (classes[i].startsWith(searchString) || classes[i].endsWith(searchString)) {
      foundClass = classes[i];
      break;
    }
  }
  if (foundClass) {
    var parts = foundClass.split("-");
    var newStr = parts[1] + "-" + parts[0];
    return { element: element, class: foundClass, newStr: newStr };
  } else {
    return null;
  }
}

export function replaceClassName(el, str) {
  const foundEl = findElementWithClassStartingOrEndingWith(el, str);
  if (foundEl) {
    const findClass = str.slice(1) + str[0];
    const els = foundEl.element.querySelectorAll(`[class^="${findClass}"]`);
    if (!els) return;
    [...els].forEach( (e, i) => {
      for (let i = 0; i < e.classList.length; i++) {
        const className = e.classList[i];
        if (className.startsWith(findClass)) {
          e.classList.replace(className, foundEl.newStr);
        }
      }
    });
  };
}

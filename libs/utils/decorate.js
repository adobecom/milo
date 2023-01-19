import { decorateLinkAnalytics } from '../martech/attributes.js';

export function decorateIconArea(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export function decorateBlockText(el, config = ['M', 'S', 'M']) {
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
    if (emptyPs) {
      emptyPs.forEach((p) => {
        p.classList.add(`body-${config[1]}`);
      });
    }
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

export function decorateButtons(buttons) {
  const mapBtnSize = { large: 'button-L', xlarge: 'button-XL' };
  buttons.forEach((button) => {
    const block = button.closest('.section div[class]:not(.content)');
    const blockSize = getBlockSize(block);
    const size = mapBtnSize[blockSize] ?? blockSize;
    const parent = button.parentElement;

    const child = button.childNodes?.length > 0 ? Array.from(button.childNodes).filter((n) => !n.classList?.contains('icon'))[0] : null;
    const grandChild = child?.childNodes?.length > 0 ? Array.from(child.childNodes).filter((n) => !n.classList?.contains('icon'))[0] : null;
    const nodes = [parent.nodeName, child?.nodeName, grandChild?.nodeName];
    const text = [button.textContent, child?.textContent, grandChild?.textContent]
      .filter((t) => !!t)[0];
    const buttonTypes = [];
    if (nodes.includes('STRONG') && nodes.includes('EM')) {
      buttonTypes.push('fill');
    } else if (nodes.includes('STRONG')) {
      buttonTypes.push('blue');
    } else if (nodes.includes('EM')) {
      buttonTypes.push('outline');
    }
    button.classList.add('con-button', ...buttonTypes);
    if (button.closest('.marquee')) {
      // without this authors must review marquees in all projects to stop buttons having wrong size
      button.classList.add(blockSize === 'large' ? 'button-XL' : 'button-L');
    } else {
      button.classList.add(size);
    }
    // if (parent.nodeName !== 'P') parent.insertAdjacentElement('afterend', button);
    [grandChild, child, parent].forEach((n) => {
      if (n && ['STRONG', 'EM', '#text'].some((t) => t === n.nodeName)) {
        // TODO figure out why the grandchildren aren't being copied
        n.replaceWith(...n.childNodes);
      }
    });
    if (!button.textContent) button.textContent = text;
    const allowedArea = button.closest('.marquee, .aside, .icon-block, .media, .text-block');
    if (allowedArea) {
      const actionArea = button.closest('p, div');
      if (actionArea && !actionArea.classList.contains('action-area')) {
        actionArea.classList.add('action-area');
        actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-XL');
      }
    }
  });
}

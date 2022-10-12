import { decorateLinkAnalytics } from './analytics.js';
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

customElements.define("load-file", class extends HTMLElement {
  async connectedCallback(
    src = this.getAttribute("src"),
    shadowRoot = this.shadowRoot || this.attachShadow({mode:"open"})
  ) {
    shadowRoot.innerHTML = await (await fetch(src)).text()
    shadowRoot.append(...this.querySelectorAll("[shadowRoot]"))
    this.hasAttribute("replaceWith") && this.replaceWith(...shadowRoot.childNodes)
  }
});

function imageExists(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.addEventListener('load', () => resolve(true));
    img.addEventListener('error', () => resolve(false));
  });
}

export async function decorateIconsInBlock(el) {
  const icons = el.querySelectorAll('span.icon');
  icons?.forEach(async (i) => {
    const iconName = i.classList[1].replace('icon-icon-', 'icon-');
    if(iconName) {
      const { miloLibs, codeRoot } = getConfig();
      const base = miloLibs ?? codeRoot;
      const svgPath = `${base}/img/icons/${iconName}.svg`
      if(await imageExists(svgPath)) {
        const loadFile = `<load-file replaceWith src="${svgPath}"></load-file>`;
        i.insertAdjacentHTML('afterbegin', loadFile);
      }
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
  // decorateIconArea(el);
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

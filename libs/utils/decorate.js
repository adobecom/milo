import { createTag } from './utils.js';

export function decorateButtons(el, size) {
  const buttons = el.querySelectorAll('em a, strong a, p > a strong');
  if (buttons.length === 0) return;
  const buttonTypeMap = { STRONG: 'blue', EM: 'outline', A: 'blue' };
  buttons.forEach((button) => {
    const parent = button.parentElement;
    const buttonType = buttonTypeMap[parent.nodeName] || 'outline';
    if (button.nodeName === 'STRONG') {
      parent.classList.add('con-button', buttonType);
      if (size) parent.classList.add(size); /* button-l, button-xl */
    } else {
      button.classList.add('con-button', buttonType);
      if (size) button.classList.add(size); /* button-l, button-xl */
      parent.insertAdjacentElement('afterend', button);
      parent.remove();
    }
    const actionArea = button.closest('p, div');
    if (actionArea) {
      actionArea.classList.add('action-area');
      actionArea.nextElementSibling?.classList.add('supplemental-text', 'body-xl');
    }
  });
}

export function decorateIconStack(el) {
  const ulElems = el.querySelectorAll('ul');
  if (!ulElems.length) return;
  const stackEl = ulElems[ulElems.length - 1];
  stackEl.classList.add('icon-stack-area', 'body-s');
  el.classList.add('icon-stack');
  const items = stackEl.querySelectorAll('li');
  [...items].forEach((i) => {
    const links = i.querySelectorAll('a');
    if (links.length <= 1) return;
    const picIndex = links[0].querySelector('a picture') ? 0 : 1;
    const linkImg = links[picIndex];
    const linkText = links[1 - picIndex];
    linkText.prepend(linkImg.querySelector('picture'));
    linkImg.remove();
  });
}

export function decorateIconArea(el) {
  const icons = el.querySelectorAll('.icon');
  icons.forEach((icon) => {
    icon.parentElement.classList.add('icon-area');
    if (icon.textContent.includes('persona')) icon.parentElement.classList.add('persona-area');
  });
}

export function decorateBlockText(el, config = ['m', 's', 'm'], type = null) {
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
    const emptyPs = el.querySelectorAll(':scope p:not([class])');
    if (emptyPs) emptyPs.forEach((p) => { p.classList.add(`body-${config[1]}`); });
    if (!headings?.length && !emptyPs?.length) {
      const wrapper = el.querySelector(':scope > div');
      [...wrapper.children]
        .filter((child) => child.textContent.trim() !== '')
        .forEach((text) => text.classList.add(`body-${config[1]}`));
    }
  }
  decorateButtons(el);
  if (type === 'merch') decorateIconStack(el);
}

export function decorateBlockBg(block, node) {
  const childCount = node.childElementCount;
  if (node.querySelector('img, video, a[href*=".mp4"]') || childCount > 1) {
    node.classList.add('background');
    const binaryVP = [['mobile-only'], ['tablet-only', 'desktop-only']];
    const allVP = [['mobile-only'], ['tablet-only'], ['desktop-only']];
    const viewports = childCount === 2 ? binaryVP : allVP;
    [...node.children].forEach((child, i) => {
      if (childCount > 1) child.classList.add(...viewports[i]);
      if (!child.querySelector('img, video, a[href*=".mp4"]')) {
        child.style.background = child.textContent;
        child.textContent = '';
      }
    });
  } else {
    block.style.background = node.textContent;
    node.remove();
  }
}

export function getBlockSize(el, defaultSize = 1) {
  const sizes = ['small', 'medium', 'large', 'xlarge'];
  if (defaultSize < 0 || defaultSize > sizes.length - 1) return null;
  return sizes.find((size) => el.classList.contains(size)) || sizes[defaultSize];
}

export const decorateBlockHrs = (el) => {
  const els = el.querySelectorAll('p');
  let hasHr = false;
  [...els].forEach((e) => {
    if (!e.textContent.startsWith('---')) return;
    hasHr = true;
    const bgStyle = e.textContent.substring(3).trim();
    const hrElem = createTag('hr', { style: `background: ${bgStyle};` });
    e.textContent = '';
    e.appendChild(hrElem);
  });
  if (hasHr && els.length) el.classList.add('has-divider');
};

function applyTextOverrides(el, override) {
  const parts = override.split('-');
  const type = parts[1];
  const els = el.querySelectorAll(`[class^="${type}"]`);
  if (!els.length) return;
  els.forEach((elem) => {
    const replace = [...elem.classList].find((i) => i.startsWith(type));
    elem.classList.replace(replace, `${parts[1]}-${parts[0]}`);
  });
}

export function decorateTextOverrides(el, options = ['-heading', '-body', '-detail']) {
  const overrides = [...el.classList]
    .filter((elClass) => options.findIndex((ovClass) => elClass.endsWith(ovClass)) >= 0);
  if (!overrides.length) return;
  overrides.forEach((override) => {
    applyTextOverrides(el, override);
    el.classList.remove(override);
  });
}

export function getVideoAttrs(hash) {
  const isAutoplay = hash?.includes('autoplay');
  const isAutoplayOnce = hash?.includes('autoplay1');
  const playOnHover = hash?.includes('hoverplay');
  if (isAutoplay && !isAutoplayOnce) {
    return 'playsinline autoplay loop muted';
  }
  if (playOnHover && isAutoplayOnce) {
    return 'playsinline autoplay muted data-hoverplay';
  }
  if (isAutoplayOnce) {
    return 'playsinline autoplay muted';
  }
  return 'playsinline controls';
}

export function applyHoverPlay(video) {
  if (!video) return;
  if (video.hasAttribute('data-hoverplay') && !video.hasAttribute('data-mouseevent')) {
    video.addEventListener('mouseenter', () => { video.play(); });
    video.addEventListener('mouseleave', () => { video.pause(); });
    video.setAttribute('data-mouseevent', true);
  }
}

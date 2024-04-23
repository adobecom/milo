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
      headings.forEach((h) => h.classList.add(`heading-${config[0]}`));
      if (config[2]) {
        headings[0]?.previousElementSibling?.classList.add(`detail-${config[2]}`);
        decorateIconArea(el);
      }
    }
    const emptyEls = el.querySelectorAll('p:not([class]), ul:not([class]), ol:not([class])');
    if (emptyEls.length) {
      emptyEls.forEach((p) => p.classList.add(`body-${config[1]}`));
    } else {
      [...el.querySelectorAll('div:not([class])')]
        .filter((emptyDivs) => emptyDivs.textContent.trim() !== '')
        .forEach((text) => text.classList.add(`body-${config[1]}`));
    }
  }
  decorateButtons(el);
  if (type === 'merch') decorateIconStack(el);
}

export function handleFocalpoint(pic, child, removeChild) {
  const image = pic.querySelector('img');
  if (!child || !image) return;
  let text = '';
  if (child.childElementCount === 2) {
    const dataElement = child.querySelectorAll('p')[1];
    text = dataElement?.textContent;
    if (removeChild) dataElement?.remove();
  } else if (child.textContent) {
    text = child.textContent;
    const childData = child.childNodes;
    if (removeChild) childData.forEach((c) => c.nodeType === Node.TEXT_NODE && c.remove());
  }
  if (!text) return;
  const directions = text.trim().toLowerCase().split(',');
  const [x, y = ''] = directions;
  image.style.objectPosition = `${x} ${y}`;
}

export async function decorateBlockBg(block, node, { useHandleFocalpoint = false } = {}) {
  const childCount = node.childElementCount;
  if (node.querySelector('img, video, a[href*=".mp4"]') || childCount > 1) {
    node.classList.add('background');
    const binaryVP = [['mobile-only'], ['tablet-only', 'desktop-only']];
    const allVP = [['mobile-only'], ['tablet-only'], ['desktop-only']];
    const viewports = childCount === 2 ? binaryVP : allVP;
    [...node.children].forEach((child, i) => {
      const videoLink = child.querySelector('a[href*=".mp4"]');
      if (videoLink && !videoLink.hash) videoLink.hash = 'autoplay';
      if (childCount > 1) child.classList.add(...viewports[i]);
      const pic = child.querySelector('picture');
      if (useHandleFocalpoint && pic
        && (child.childElementCount === 2 || child.textContent?.trim())) {
        handleFocalpoint(pic, child, true);
      }
      if (!child.querySelector('img, video, a[href*=".mp4"]')) {
        child.style.background = child.textContent;
        child.classList.add('expand-background');
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
  const pTags = el.querySelectorAll('p');
  let hasHr = false;
  const decorateHr = ((tag) => {
    const hrTag = tag.textContent.trim().startsWith('---');
    if (!hrTag) return;
    hasHr = true;
    const bgStyle = tag.textContent.substring(3).trim();
    const hrElem = createTag('hr', { style: `background: ${bgStyle};` });
    tag.textContent = '';
    tag.appendChild(hrElem);
  });
  [...pTags].forEach((p) => {
    decorateHr(p);
  });
  const singleElementInRow = el.children[0].childElementCount === 0;
  if (singleElementInRow) {
    decorateHr(el.children[0]);
  }
  if (hasHr) el.classList.add('has-divider');
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

export function getVideoAttrs(hash, dataset) {
  const isAutoplay = hash?.includes('autoplay');
  const isAutoplayOnce = hash?.includes('autoplay1');
  const playOnHover = hash?.includes('hoverplay');
  const poster = dataset?.videoPoster ? `poster='${dataset.videoPoster}'` : '';
  const globalAttrs = `playsinline ${poster}`;
  const autoPlayAttrs = 'autoplay muted';

  if (isAutoplay && !isAutoplayOnce) {
    return `${globalAttrs} ${autoPlayAttrs} loop`;
  }
  if (playOnHover && isAutoplayOnce) {
    return `${globalAttrs} ${autoPlayAttrs} data-hoverplay`;
  }
  if (playOnHover) {
    return `${globalAttrs} muted data-hoverplay`;
  }
  if (isAutoplayOnce) {
    return `${globalAttrs} ${autoPlayAttrs}`;
  }
  return `${globalAttrs} controls`;
}

export function applyHoverPlay(video) {
  if (!video) return;
  if (video.hasAttribute('data-hoverplay') && !video.hasAttribute('data-mouseevent')) {
    video.addEventListener('mouseenter', () => { video.play(); });
    video.addEventListener('mouseleave', () => { video.pause(); });
    video.setAttribute('data-mouseevent', true);
  }
}

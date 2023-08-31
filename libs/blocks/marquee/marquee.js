/*
 * Marquee - v6.0
 */

import { applyHoverPlay, decorateButtons, getBlockSize, getVideoAttrs } from '../../utils/decorate.js';
import { decorateBlockAnalytics, decorateLinkAnalytics } from '../../martech/attributes.js';
import { createTag } from '../../utils/utils.js';

const decorateVideo = (container, src) => {
  if (typeof src === 'string' || src?.href.endsWith('.mp4')) {
    // no special attrs handling
    container.innerHTML = `<video preload="metadata" playsinline autoplay muted loop>
      <source src="${src}" type="video/mp4" />
    </video>`;
    container.classList.add('has-video');
  } else {
    const { href, hash } = src;
    const attrs = getVideoAttrs(hash);
    container.innerHTML = `<video ${attrs}>
          <source src="${href}" type="video/mp4" />
        </video>`;
  }
  return container.firstChild;
};

const decorateBlockBg = (block, node) => {
  const viewports = ['mobile-only', 'tablet-only', 'desktop-only'];
  const childCount = node.childElementCount;
  const { children } = node;

  node.classList.add('background');

  if (childCount === 2) {
    children[0].classList.add(viewports[0], viewports[1]);
    children[1].classList.add(viewports[2]);
  }

  [...children].forEach(async (child, index) => {
    if (childCount === 3) {
      child.classList.add(viewports[index]);
    }
    const videoElement = child.querySelector('a[href*=".mp4"], video source[src$=".mp4"]');
    if (videoElement) {
      const video = decorateVideo(child, videoElement.href || videoElement.src);
      const hash = video.firstElementChild?.src.split('#')[1];
      if (hash?.includes('autoplay1')) {
        video.removeAttribute('loop');
      }
    }

    const pic = child.querySelector('picture');
    if (pic && (child.childElementCount === 2 || child.textContent?.trim())) {
      const { handleFocalpoint } = await import('../section-metadata/section-metadata.js');
      handleFocalpoint(pic, child, true);
    }
  });

  if (!node.querySelector(':scope img') && !node.querySelector(':scope video')) {
    block.style.background = node.textContent;
    node.remove();
  }
};

// [headingSize, bodySize, detailSize]
const blockTypeSizes = {
  marquee: {
    small: ['xl', 'm', 'm'],
    medium: ['xl', 'm', 'm'],
    large: ['xxl', 'xl', 'l'],
    xlarge: ['xxl', 'xl', 'l'],
  },
};

function decorateText(el, size) {
  const headings = el.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const heading = headings[headings.length - 1];
  const config = blockTypeSizes.marquee[size];
  const decorate = (headingEl, typeSize) => {
    headingEl.classList.add(`heading-${typeSize[0]}`);
    headingEl.nextElementSibling?.classList.add(`body-${typeSize[1]}`);
    const sib = headingEl.previousElementSibling;
    if (sib) {
      const className = sib.querySelector('img, .icon') ? 'icon-area' : `detail-${typeSize[2]}`;
      sib.classList.add(className);
      sib.previousElementSibling?.classList.add('icon-area');
    }
  };
  decorate(heading, config);
}

function decorateMultipleIconArea(iconArea) {
  iconArea.querySelectorAll(':scope > picture').forEach((picture) => {
    const src = picture.querySelector('img')?.getAttribute('src');
    const a = picture.nextElementSibling;
    if (src?.endsWith('.svg') || a?.tagName !== 'A') return;
    if (!a.querySelector('img')) {
      a.innerHTML = '';
      a.className = '';
      a.appendChild(picture);
    }
  });
  if (iconArea.childElementCount > 1) iconArea.classList.add('icon-area-multiple');
}

function extendButtonsClass(text) {
  const buttons = text.querySelectorAll('.con-button');
  if (buttons.length === 0) return;
  buttons.forEach((button) => { button.classList.add('button-justified-mobile'); });
}

const decorateImage = (media) => {
  media.classList.add('image');

  const imageLink = media.querySelector('a');
  const picture = media.querySelector('picture');

  if (imageLink && picture) {
    imageLink.textContent = '';
    imageLink.append(picture);
  }
};

export default function init(el) {
  decorateBlockAnalytics(el);
  const isLight = el.classList.contains('light');
  if (!isLight) el.classList.add('dark');
  const children = el.querySelectorAll(':scope > div');
  const foreground = children[children.length - 1];
  if (children.length > 1) {
    children[0].classList.add('background');
    decorateBlockBg(el, children[0]);
  }
  foreground.classList.add('foreground', 'container');
  const headline = foreground.querySelector('h1, h2, h3, h4, h5, h6');
  const text = headline.closest('div');
  text.classList.add('text');
  const media = foreground.querySelector(':scope > div:not([class])');

  if (media) {
    media.classList.add('media');
    let video = media.querySelector('video');
    const videoLink = media.querySelector('a[href*=".mp4"]');
    if (videoLink) {
      video = decorateVideo(media, videoLink);
    } else {
      decorateImage(media);
    }
    if (video) applyHoverPlay(video);
  }

  const firstDivInForeground = foreground.querySelector(':scope > div');
  if (firstDivInForeground.classList.contains('media')) el.classList.add('row-reversed');

  const size = getBlockSize(el);
  decorateButtons(text, size === 'large' ? 'button-xl' : 'button-l');
  const headings = text.querySelectorAll('h1, h2, h3, h4, h5, h6');
  decorateLinkAnalytics(text, headings);
  decorateText(text, size);
  const iconArea = text.querySelector('.icon-area');
  if (iconArea?.childElementCount > 1) decorateMultipleIconArea(iconArea);
  extendButtonsClass(text);
  if (el.classList.contains('split')) {
    if (foreground && media) {
      media.classList.add('bleed');
      foreground.insertAdjacentElement('beforebegin', media);
    }

    let mediaCreditInner;
    const txtContent = media?.lastChild.textContent.trim();
    if (txtContent) {
      mediaCreditInner = createTag('p', { class: 'body-s' }, txtContent);
    } else if (media.lastElementChild?.tagName !== 'PICTURE') {
      mediaCreditInner = media.lastElementChild;
    }

    if (mediaCreditInner) {
      const mediaCredit = createTag('div', { class: 'media-credit container' }, mediaCreditInner);
      el.appendChild(mediaCredit);
      el.classList.add('has-credit');
      media.lastChild.remove();
    }
  }
}

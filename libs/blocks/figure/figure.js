import { createTag } from '../../utils/utils.js';

function buildCaption(pEl) {
  const figCaptionEl = document.createElement('figcaption');
  pEl.classList.add('caption');
  figCaptionEl.append(pEl);
  return figCaptionEl;
}

function decorateVideo(videoEl, figEl) {
  const videoTag = videoEl.querySelector('video');
  if (videoTag) {
    figEl.prepend(videoEl.querySelector('.video-container, .pause-play-wrapper, video'));
  }
}

export function buildFigure(blockEl) {
  const figEl = createTag('figure', { class: 'figure' });
  Array.from(blockEl.children).forEach((child) => {
    // picture, video, or embed link is NOT wrapped in P tag
    const tags = ['PICTURE', 'VIDEO', 'A'];
    if (tags.includes(child.nodeName) || (child.nodeName === 'SPAN' && child.classList.contains('modal-img-link'))) {
      figEl.prepend(child);
    } else {
      // content wrapped in P tag(s)
      const imageVideo = child.querySelector('.modal-img-link');
      if (imageVideo) {
        figEl.prepend(imageVideo);
      }
      const picture = child.querySelector('picture');
      if (picture) {
        figEl.prepend(picture);
      }
      decorateVideo(child, figEl);
      const caption = child.querySelector('em');
      if (caption) {
        const figElCaption = buildCaption(caption);
        figEl.append(figElCaption);
      }
      const link = child.querySelector('a');
      if (link) {
        const img = figEl.querySelector('picture') || figEl.querySelector('video');
        if (img && !link.classList.contains('pause-play-wrapper')) {
          // wrap picture or video in A tag
          link.textContent = '';
          link.append(img);
        }
        figEl.prepend(link);
      }
    }
  });
  return figEl;
}

export default function init(blockEl) {
  const children = blockEl.querySelectorAll(':scope > div > div');
  blockEl.innerHTML = '';

  const blockCount = children.length;
  if (!children.length) return;

  // For each child, creates a figure element using the buildFigure function
  // and adds it as a child of the given element
  children.forEach((pic) => {
    const figureEL = buildFigure(pic);
    blockEl.append(figureEL);
  });

  if (blockCount > 1) {
    blockEl.classList.add('figure-list', `figure-list-${blockCount}`);
  }
}

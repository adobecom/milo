/**
 * figure.js – Milo figure block.
 *
 * Lazy-load strategy
 * ------------------
 * Only the first figure that is above the fold (top < 1.5 × window.innerHeight)
 * keeps its original loading attribute so it remains LCP-eligible.  Every other
 * figure has loading='lazy' and decoding='async' stamped on its <img> elements,
 * and the srcset of sibling <source> elements is withheld until the block enters
 * the extended viewport (200 px rootMargin) via an IntersectionObserver.
 */
import { createTag } from '../../utils/utils.js';
import { isAboveFold, setLazyImg } from '../../utils/lazy-load.js';

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
  const figEl = createTag('figure');
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

  // Apply lazy-loading to images that are not in the LCP zone.
  // isAboveFold is evaluated after the DOM is built so getBoundingClientRect
  // reflects the block's actual position in the document.
  if (!isAboveFold(blockEl)) {
    blockEl.querySelectorAll('img').forEach(setLazyImg);
  }
}

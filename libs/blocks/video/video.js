import { applyHoverPlay, getVideoAttrs } from '../../utils/decorate.js';
import { createTag } from '../../utils/utils.js';

const callback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      entry.target.removeAttribute('preload');
      const source = createTag('source', { type: 'video/mp4', src: entry.target.getAttribute('data-src') });
      entry.target.appendChild(source);
      entry.target.removeAttribute('data-src');
    }
  });
};

const videoObserver = new IntersectionObserver(callback, {});

export default function init(a) {
  const { pathname, hash } = a;
  const attrs = getVideoAttrs(hash);
  const video = `<video ${attrs} preload="none" data-src=".${pathname}">
      </video>`;
  if (!a.parentNode) return;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = a.nextSibling;
  videoObserver.observe(videoElem);
  applyHoverPlay(videoElem);
  a.remove();
}

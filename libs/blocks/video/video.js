import { createIntersectionObserver } from '../../utils/utils.js';
import { applyHoverPlay, getVideoAttrs } from '../../utils/decorate.js';

const ROOT_MARGIN = 1000;

export const loadVideo = async (a) => {
  const { pathname, hash } = a;
  const attrs = getVideoAttrs(hash);
  const video = `<video ${attrs}>
        <source src=".${pathname}" type="video/mp4" />
      </video>`;
  if (!a.parentNode) return;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.body.querySelector(`source[src=".${pathname}"]`)?.parentElement;
  applyHoverPlay(videoElem);
  a.remove();
};

export default async function init(a) {
  a.classList.add('hide');
  if (a.textContent.includes('no-lazy')) {
    loadVideo(a);
  } else {
    createIntersectionObserver({
      el: a,
      options: { rootMargin: `${ROOT_MARGIN}px` },
      callback: loadVideo,
    });
  }
}

import { createIntersectionObserver, getConfig, createTag } from '../../utils/utils.js';
import { applyHoverPlay, getVideoAttrs, applyInViewPortPlay } from '../../utils/decorate.js';

const ROOT_MARGIN = 1000;

const loadVideo = (a) => {
  const { pathname, hash, dataset } = a;
  let videoPath = `.${pathname}`;
  if (pathname.match('media_.*.mp4')) {
    const { codeRoot } = getConfig();
    const root = codeRoot.endsWith('/')
      ? codeRoot
      : `${codeRoot}/`;
    const mediaFilename = pathname.split('/').pop();
    videoPath = `${root}${mediaFilename}`;
  }

  const attrs = getVideoAttrs(hash, dataset);
  const video = `<video ${attrs}></video>`;
  const parentElement = a.parentNode;
  if (!parentElement) return;
  a.insertAdjacentHTML('afterend', video);
  createIntersectionObserver({
    el: parentElement,
    options: { rootMargin: `${ROOT_MARGIN}px` },
    callback: () => {
      parentElement
        .querySelector('video')
        .appendChild(
          createTag('source', { src: videoPath, type: 'video/mp4' }),
        );
    },
  });
  const videoElem = document.body.querySelector(`source[src="${videoPath}"]`)?.parentElement;
  applyHoverPlay(videoElem);
  applyInViewPortPlay(videoElem);
  a.remove();
};

export default function init(a) {
  a.classList.add('hide-video');
  loadVideo(a);
}

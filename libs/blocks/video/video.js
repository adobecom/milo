import { createIntersectionObserver, getConfig } from '../../utils/utils.js';
import { applyHoverPlay, getVideoAttrs, getImgSrc, applyInViewPortPlay } from '../../utils/decorate.js';

const ROOT_MARGIN = 1000;

function urlExists(url) {
  const http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  return http.status !== 404;
}

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

  const pathExists = urlExists(videoPath);
  const attrs = getVideoAttrs(hash, dataset);
  if (!a.parentNode) return;
  if (!pathExists) {
    const poster = getImgSrc(dataset.videoPoster, true);
    const pic = `<picture class="poster-img"><img src="${poster}" /></picture>`;
    a.insertAdjacentHTML('afterend', pic);
  } else {
    const video = `<video ${attrs}>
        <source src="${videoPath}" type="video/mp4" />
      </video>`;
    a.insertAdjacentHTML('afterend', video);
    const videoElem = document.body.querySelector(`source[src="${videoPath}"]`)?.parentElement;
    applyHoverPlay(videoElem);
    applyInViewPortPlay(videoElem);
  }
  a.remove();
};

export default function init(a) {
  a.classList.add('hide-video');
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

import { applyHoverPlay, getVideoAttrs } from '../../utils/decorate.js';
import { getConfig } from '../../utils/utils.js';

export default function init(a) {
  const { pathname, hash } = a;
  let videoPath = `.${pathname}`;
  if (pathname.match('media_.*.mp4')) {
    const { codeRoot } = getConfig();
    const root = codeRoot.endsWith('/')
      ? codeRoot
      : `${codeRoot}/`;
    const mediaFilename = pathname.split('/').pop();
    videoPath = `${root}${mediaFilename}`;
  }

  const attrs = getVideoAttrs(hash);
  const video = `<video ${attrs}>
        <source src="${videoPath}" type="video/mp4" />
      </video>`;
  if (!a.parentNode) return;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.body.querySelector(`source[src="${videoPath}"]`)?.parentElement;
  applyHoverPlay(videoElem);
  a.remove();
}

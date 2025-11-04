import { getConfig } from '../../utils/utils.js';
import { decorateAnchorVideo, decorateVideo } from '../../utils/decorate.js';

export default function init(a) {
  if (a.tagName === 'VIDEO') {
    decorateVideo(a);
    a.classList.remove('video');
    return;
  }
  a.classList.add('hide-video');
  if (!a.parentNode) {
    a.remove();
    return;
  }
  const { pathname } = a;
  let videoPath = `.${pathname}`;
  if (pathname.match('media_.*.mp4')) {
    const { codeRoot } = getConfig();
    const root = codeRoot.endsWith('/')
      ? codeRoot
      : `${codeRoot}/`;
    const mediaFilename = pathname.split('/').pop();
    videoPath = `${root}${mediaFilename}`;
  }
  decorateAnchorVideo({
    src: videoPath,
    anchorTag: a,
  });
}

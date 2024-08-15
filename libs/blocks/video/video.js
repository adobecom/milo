import { getConfig } from '../../utils/utils.js';
import { turnAnchorIntoVideo } from '../../utils/decorate.js';

export default function init(a) {
  a.classList.add('hide-video');
  if (!a.parentNode) return;
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
  turnAnchorIntoVideo({
    src: videoPath,
    anchorTag: a,
  });
}

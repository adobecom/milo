import { applyHoverPlay, getVideoAttrs } from '../../utils/decorate.js';

export default function init(a) {
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
}

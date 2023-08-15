import { applyHoverPlay } from '../../utils/decorate.js';

function getAttrs(hash) {
  const isAutoplay = hash?.includes('autoplay');
  const isAutoplayOnce = hash?.includes('autoplay1');
  const playOnHover = hash.includes('hoverplay');
  let attrs = '';
  if (isAutoplay && !isAutoplayOnce) {
    attrs = 'playsinline autoplay loop muted';
  } else if (playOnHover && isAutoplayOnce) {
    attrs = 'playsinline autoplay muted data-hoverplay';
  } else if (isAutoplayOnce) {
    attrs = 'playsinline autoplay muted';
  } else {
    attrs = 'playsinline controls';
  }
  return attrs;
}

export default function init(a) {
  const { pathname, hash } = a;
  const attrs = getAttrs(hash);
  const video = `<video ${attrs}>
        <source src=".${pathname}" type="video/mp4" />
      </video>`;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.querySelector('video');
  applyHoverPlay(videoElem);
  a.remove();
}

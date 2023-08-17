import { applyHoverPlay } from '../../utils/decorate.js';

function getAttrs(hash) {
  const isAutoplay = hash?.includes('autoplay');
  const isAutoplayOnce = hash?.includes('autoplay1');
  const playOnHover = hash.includes('hoverplay');
  if (isAutoplay && !isAutoplayOnce) {
    return 'playsinline autoplay loop muted';
  }
  if (playOnHover && isAutoplayOnce) {
    return 'playsinline autoplay muted data-hoverplay';
  }
  if (isAutoplayOnce) {
    return 'playsinline autoplay muted';
  }
  return 'playsinline controls';
}

export default function init(a) {
  const { pathname, hash } = a;
  const attrs = getAttrs(hash);
  const video = `<video ${attrs}>
        <source src=".${pathname}" type="video/mp4" />
      </video>`;
  if (!a.parentNode) return;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.body.querySelector(`source[src=".${pathname}"]`)?.parentElement;
  applyHoverPlay(videoElem);
  a.remove();
}

export default function init(a) {
  const { pathname, hash } = a;
  const isAutoplay = !!(hash?.includes('autoplay'));
  const isNotLooped = !!(hash?.includes('autoplay1'));
  const playOnHover = !!(hash.includes('hoverplay'));
  let attrs = '';
  switch (true) {
    case (isAutoplay === true && isNotLooped === false):
      attrs = 'playsinline autoplay loop muted';
      break;
    case (playOnHover === true && isNotLooped === true):
      attrs = 'playsinline autoplay muted data-hoverplay';
      break;
    case (isNotLooped === true):
      attrs = 'playsinline autoplay muted';
      break;
    default:
      attrs = 'playsinline controls';
  }
  const video = `<video ${attrs}>
        <source src=".${pathname}" type="video/mp4" />
      </video>`;
  a.insertAdjacentHTML('afterend', video);
  const videoElem = document.querySelector('video');
  if (attrs.includes('data-hoverplay')) {
    videoElem.addEventListener('mouseenter', () => { videoElem.play(); });
    videoElem.addEventListener('mouseleave', () => { videoElem.pause(); });
  }
  a.remove();
}

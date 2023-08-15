function getAttrs(hash) {
  const isAutoplay = hash?.includes('autoplay');
  const isAutoplayOnce = hash?.includes('autoplay1');
  const playOnHover = hash.includes('hoverplay');
  let attrs = '';
  switch (true) {
    case isAutoplay === true && isAutoplayOnce === false:
      attrs = 'playsinline autoplay loop muted';
      break;
    case playOnHover === true && isAutoplayOnce === true:
      attrs = 'playsinline autoplay muted data-hoverplay';
      break;
    case isAutoplayOnce === true:
      attrs = 'playsinline autoplay muted';
      break;
    default:
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
  if (attrs.includes('data-hoverplay')) {
    videoElem.addEventListener('mouseenter', () => {
      videoElem.play();
    });
    videoElem.addEventListener('mouseleave', () => {
      videoElem.pause();
    });
  }
  a.remove();
}

export default function init(a) {
  const { pathname, hash } = a;

  const isAutoplay = !!(hash?.includes('autoplay'));

  const attrs = isAutoplay ? 'playsinline autoplay loop muted' : 'playsinline controls';
  const video = `<video ${attrs}>
        <source src=".${pathname}" type="video/mp4" />
      </video>`;
  a.insertAdjacentHTML('afterend', video);
  a.remove();
}

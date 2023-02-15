export default function init(blockEl) {
  const a = blockEl.querySelector('a');

  if (!a) return;

  const href = a.getAttribute('href');
  const url = new URL(href, window.location.href);
  const { pathname, hash } = url;
  const ext = pathname?.substring(pathname.lastIndexOf('.') + 1);

  const isAutoplay = !!(hash.includes('autoplay') || blockEl.classList.contains('autoplay'));

  if (ext === 'mp4') {
    const attrs = isAutoplay ? 'playsinline autoplay loop muted' : 'playsinline controls preload="metadata"';
    const img = blockEl.querySelector('picture > img');
    const poster = img ? `poster=${img.src}` : '';
    const video = `<video ${attrs} ${poster}>
      <source src=".${pathname}" type="video/mp4" />
    </video>`;
    blockEl.innerHTML = video;
  } else if (ext === 'gif') {
    const picEl = `<picture>
      <img src=".${pathname}" />
    </picture>`;
    blockEl.innerHTML = picEl;
  }
}

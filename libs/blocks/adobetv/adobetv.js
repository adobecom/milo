function createIframeElement(href) {
  return `
    <div class="milo-video">
      <iframe src="${href}" class="adobetv" webkitallowfullscreen mozallowfullscreen allowfullscreen scrolling="no" allow="encrypted-media" title="Adobe Video Publishing Cloud Player" loading="lazy">
      </iframe>
    </div>
  `;
}

function createVideoElement({ href, hash, search }) {
  const searchParams = search ? new URLSearchParams(search) : null;
  const isAutoplay = searchParams?.get('autoplay') || hash?.includes('autoplay');
  const attrs = isAutoplay ? 'playsinline autoplay loop muted' : 'playsinline controls';
  return `
    <div class="video-wrapper">
      <video ${attrs}>
        <source src="${href}" type="video/mp4" />
      </video>
    </div>
  `;
}
export default function init(a) {
  const { href, origin, hash, search } = a;

  let block;
  if (origin === 'https://video.tv.adobe.com') {
    block = createIframeElement(href);
  } else if (origin === 'https://images-tv.adobe.com') {
    block = createVideoElement({ href, hash, search });
  }

  a.insertAdjacentHTML('afterend', block);
  a.remove();
}

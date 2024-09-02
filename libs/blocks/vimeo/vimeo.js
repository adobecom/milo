import { createIntersectionObserver, createTag, isInTextNode } from '../../utils/utils.js';

function addPrefetch(kind, url, as) {
  const linkElem = createTag('link', { rel: kind, href: url });
  if (as) linkElem.as = as;
  linkElem.crossorigin = true;
  document.head.append(linkElem);
}

class LiteVimeo extends HTMLElement {
  static preconnected = false;

  connectedCallback() {
    this.videoId = this.getAttribute('videoid');
    this.language = this.getAttribute('language') || '';
    this.setupThumbnail();
    this.setupPlayButton();
    this.addEventListener('pointerover', LiteVimeo.warmConnections, { once: true });
    this.addEventListener('click', this.addIframe);
  }

  static warmConnections() {
    if (LiteVimeo.preconnected) return;
    LiteVimeo.preconnected = true;
    addPrefetch('preconnect', 'https://player.vimeo.com');
    addPrefetch('preconnect', 'https://i.vimeocdn.com');
    addPrefetch('preconnect', 'https://f.vimeocdn.com');
    addPrefetch('preconnect', 'https://fresnel.vimeocdn.com');
  }

  setupThumbnail() {
    const { width, height } = this.getBoundingClientRect();
    const roundedWidth = Math.min(Math.ceil(width / 100) * 100, 1920);
    const roundedHeight = Math.round((roundedWidth / width) * height);

    fetch(`https://vimeo.com/api/v2/video/${this.videoId}.json`)
      .then((response) => response.json())
      .then((data) => {
        const thumbnailUrl = data[0].thumbnail_large?.replace(/-d_[\dx]+$/i, `-d_${roundedWidth}x${roundedHeight}`);
        this.style.backgroundImage = `url("${thumbnailUrl}")`;
      })
      .catch((e) => {
        window.lana.log(`Error fetching Vimeo thumbnail: ${e}`, { tags: 'errorType=info,module=vimeo' });
      });
  }

  setupPlayButton() {
    const playBtnEl = createTag('button', { type: 'button', 'aria-label': 'Play video', class: 'ltv-playbtn' });
    this.append(playBtnEl);
  }

  addIframe() {
    if (this.classList.contains('ltv-activated')) return;
    this.classList.add('ltv-activated');
    const iframeEl = createTag('iframe', {
      style: 'border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute; background-color: #000;',
      frameborder: '0',
      title: 'Content from Vimeo',
      allow: 'accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture',
      allowFullscreen: true,
      src: `https://player.vimeo.com/video/${encodeURIComponent(this.videoId)}?autoplay=1`,
    });
    this.insertAdjacentElement('afterend', iframeEl);
    this.remove();
    iframeEl.addEventListener('load', () => iframeEl.focus(), { once: true });
  }
}

if (!customElements.get('lite-vimeo')) customElements.define('lite-vimeo', LiteVimeo);

export default async function init(a) {
  if (isInTextNode(a)) return;

  const embedVimeo = () => {
    const url = new URL(a.href);
    const videoid = url.pathname.split('/')[url.hostname === 'player.vimeo.com' ? 2 : 1];
    const liteVimeo = createTag('lite-vimeo', { videoid });
    const wrapper = createTag('div', { class: 'embed-vimeo' }, liteVimeo);
    a.parentElement.replaceChild(wrapper, a);
  };

  createIntersectionObserver({ el: a, callback: embedVimeo });
}

// part of the code is an optimized version of lite-vimeo-embed -> https://github.com/luwes/lite-vimeo-embed
import { replaceKey } from '../../features/placeholders.js';
import { createIntersectionObserver, createTag, getConfig, isInTextNode, loadLink } from '../../utils/utils.js';

class LiteVimeo extends HTMLElement {
  static preconnected = false;

  connectedCallback() {
    this.isMobile = navigator.userAgent.includes('Mobi');
    this.videoId = this.getAttribute('videoid');
    this.title = this.getAttribute('title');
    this.setupThumbnail();
    this.setupPlayButton();
    this.addEventListener('pointerover', LiteVimeo.warmConnections, { once: true });
    this.addEventListener('click', this.addIframe);
  }

  async fetchVideoTitle() {
    try {
      const response = await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${this.videoId}`);
      const data = await response.json();
      if (data.title && this.iframeEl) this.iframeEl.title = data.title;
    } catch (error) {
      window.lana.log('Error fetching Vimeo video title', { error });
    }
  }

  static warmConnections() {
    if (LiteVimeo.preconnected) return;
    LiteVimeo.preconnected = true;
    ['player.vimeo.com',
      'i.vimeocdn.com',
      'f.vimeocdn.com',
      'fresnel.vimeocdn.com',
    ].forEach((url) => loadLink(`https://${url}`, { rel: 'preconnect' }));
  }

  setupThumbnail() {
    const { width, height } = this.getBoundingClientRect();
    const roundedWidth = Math.min(Math.ceil(width / 100) * 100, 1920);
    const roundedHeight = Math.round((roundedWidth / width) * height);

    fetch(`https://vimeo.com/api/v2/video/${this.videoId}.json`)
      .then((response) => response.json())
      .then((data) => {
        const thumbnailUrl = data[0]?.thumbnail_large?.replace(/-d_[\dx]+$/i, `-d_${roundedWidth}x${roundedHeight}`);
        this.style.backgroundImage = `url("${thumbnailUrl}")`;
      })
      .catch((e) => {
        window.lana.log(`Error fetching Vimeo thumbnail: ${e}`, { tags: 'vimeo', errorType: 'i' });
      });
  }

  async setupPlayButton() {
    const playBtnEl = createTag('button', {
      type: 'button',
      'aria-label': `${await replaceKey('play-video', getConfig())}`,
      class: 'ltv-playbtn',
    });
    this.append(playBtnEl);
  }

  async addIframe() {
    if (this.classList.contains('ltv-activated')) return;
    this.classList.add('ltv-activated');
    this.iframeEl = createTag('iframe', {
      style: 'border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute; background-color: #000;',
      frameborder: '0',
      title: this.title,
      allow: 'accelerometer; fullscreen; autoplay; encrypted-media; gyroscope; picture-in-picture',
      allowFullscreen: true,
      src: `https://player.vimeo.com/video/${encodeURIComponent(this.videoId)}?autoplay=1&muted=${this.isMobile ? 1 : 0}`,
    });
    this.insertAdjacentElement('afterend', this.iframeEl);
    this.iframeEl.addEventListener('load', () => this.iframeEl.focus(), { once: true });
    this.remove();
    this.fetchVideoTitle();
  }
}

export default async function init(a) {
  if (isInTextNode(a)) return;
  if (!customElements.get('lite-vimeo')) customElements.define('lite-vimeo', LiteVimeo);

  const embedVimeo = () => {
    const url = new URL(a.href);
    const videoid = url.pathname.split('/')[url.hostname === 'player.vimeo.com' ? 2 : 1];
    const liteVimeo = createTag('lite-vimeo', {
      videoid,
      title: 'Content from Vimeo',
    });
    const wrapper = createTag('div', { class: 'embed-vimeo' }, liteVimeo);
    a.parentElement.replaceChild(wrapper, a);
  };

  createIntersectionObserver({ el: a, callback: embedVimeo });
}

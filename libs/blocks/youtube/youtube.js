// part of the code is an optimized version of lite-youtube-embed -> https://github.com/paulirish/lite-youtube-embed
import { createIntersectionObserver, createTag, isInTextNode, loadLink } from '../../utils/utils.js';

class LiteYTEmbed extends HTMLElement {
  static isMobile = navigator.userAgent.includes('Mobi');

  connectedCallback() {
    this.videoId = this.getAttribute('videoid');
    const playBtnEl = createTag('button', { type: 'button', class: 'lty-playbtn' });
    this.append(playBtnEl);
    this.playLabel = this.getAttribute('playlabel') || 'Play';
    this.style.backgroundImage = `url("https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg")`;
    this.style.backgroundSize = 'cover';
    this.style.backgroundPosition = 'center';
    const playBtnLabelEl = createTag('span', { class: 'lyt-visually-hidden' });
    playBtnLabelEl.textContent = this.playLabel;
    playBtnEl.append(playBtnLabelEl);
    this.addEventListener('pointerover', LiteYTEmbed.warmConnections, { once: true });
    this.addEventListener('click', this.addIframe);
    this.needsYTApiForAutoplay = navigator.vendor.includes('Apple') || LiteYTEmbed.isMobile;
  }

  static warmConnections() {
    if (LiteYTEmbed.preconnected) return;
    LiteYTEmbed.preconnected = true;
    ['www.youtube-nocookie.com',
      'www.google.com',
      'googleads.g.doubleclick.net',
      'static.doubleclick.net',
    ].forEach((url) => loadLink(`https://${url}`, { rel: 'preconnect' }));
  }

  static loadYouTubeAPI() {
    return new Promise((resolve) => {
      if (window.YT?.Player) {
        resolve();
        return;
      }
      const tag = createTag('script', { src: 'https://www.youtube.com/iframe_api' });
      window.onYouTubeIframeAPIReady = resolve;
      document.head.appendChild(tag);
    });
  }

  async addIframe() {
    if (this.classList.contains('lyt-activated')) return;

    this.classList.add('lyt-activated');
    const params = new URLSearchParams(this.getAttribute('params') || []);
    params.append('autoplay', '1');
    params.append('playsinline', '1');
    if (LiteYTEmbed.isMobile) params.append('mute', '1');

    if (this.needsYTApiForAutoplay) {
      await LiteYTEmbed.loadYouTubeAPI();
      await new Promise((resolve) => { window.YT.ready(resolve); });
      // eslint-disable-next-line
      new window.YT.Player(this, {
        videoId: this.videoId,
        playerVars: Object.fromEntries(params),
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: true,
        title: this.playLabel,
      });
    } else {
      const iframeEl = createTag('iframe', {
        src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${params.toString()}`,
        allowFullscreen: true,
        allow: 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        title: this.playLabel,
      });
      this.insertAdjacentElement('afterend', iframeEl);
      iframeEl.focus();
      this.remove();
    }
  }
}

export default async function init(a) {
  if (!customElements.get('lite-youtube')) customElements.define('lite-youtube', LiteYTEmbed);

  const embedVideo = () => {
    if (isInTextNode(a) || !a.origin?.includes('youtu')) return;
    const title = !a.textContent.includes('http') ? a.textContent : 'Youtube Video';
    const searchParams = new URLSearchParams(a.search);
    const id = searchParams.get('v') || a.pathname.split('/').pop();
    searchParams.delete('v');
    const liteYTElement = createTag('lite-youtube', { videoid: id, playlabel: title });

    if (searchParams.toString()) liteYTElement.setAttribute('params', searchParams.toString());

    const ytContainer = createTag('div', { class: 'milo-video dark-background' }, liteYTElement);
    a.insertAdjacentElement('afterend', ytContainer);
    a.remove();

    if (document.readyState === 'complete') {
      // eslint-disable-next-line no-underscore-dangle
      window._satellite?.track('trackYoutube');
    } else {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === 'complete') {
          // eslint-disable-next-line no-underscore-dangle
          window._satellite?.track('trackYoutube');
        }
      });
    }
  };

  createIntersectionObserver({ el: a, callback: embedVideo });
}

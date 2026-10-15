import { decorateAnchorVideo, getMpcPlayerId } from '../../utils/decorate.js';
import { createTag, getConfig, getFederatedContentRoot, loadStyle } from '../../utils/utils.js';

let captionsLangMapPromise = null;

const logError = (msg, error) => window.lana.log(`${msg}: ${error}`, {
  tags: 'adobetv',
  severity: 'error',
});

const updateCaptionsLang = (url, geo, captionsLangMap) => {
  if (geo && captionsLangMap) {
    const entry = captionsLangMap.find((l) => l?.geos?.split(',')?.includes(geo));
    if (entry) {
      const captionParam = entry.captions === 'eng' ? entry.captions : `${entry.captions},eng`;
      url.searchParams.set('captions', captionParam);
    }
  }
  return url.toString();
};

export const pauseMpcPlayer = (iframe) => {
  iframe.contentWindow?.postMessage({ type: 'mpcAction', action: 'pause' }, iframe.src);
};

let playerObserver;
const getPlayerObserver = () => {
  playerObserver ??= new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting && target.getAttribute('data-playing') === 'true') pauseMpcPlayer(target);
    });
  }, { rootMargin: '0px' });
  return playerObserver;
};

// Matched by event.source so duplicate video ids and carousel clones resolve to the right iframe.
const onPlayerMessage = (event) => {
  if (event.origin !== 'https://video.tv.adobe.com' || !event.source) return;
  const { state } = event.data || {};
  if (!['play', 'pause'].includes(state)) return;
  const iframe = [...document.querySelectorAll('iframe.adobetv')]
    .find((f) => f.contentWindow === event.source);
  if (!iframe) return;
  iframe.setAttribute('data-playing', state === 'play');
  getPlayerObserver().observe(iframe);
};
let playerListenerAdded = false;

const createIframe = (a, href, { autoplay = false, focus = false } = {}) => {
  const videoHref = href || a.href;

  const iframe = createTag('iframe', {
    src: videoHref,
    class: 'adobetv',
    scrolling: 'no',
    allow: `${autoplay ? 'autoplay; ' : ''}encrypted-media; fullscreen`,
    title: 'Adobe Video Publishing Cloud Player',
    loading: 'lazy',
  });
  const embed = createTag('div', { class: 'milo-video' }, iframe);
  a.insertAdjacentElement('afterend', embed);

  const idMatch = videoHref.match(/\/v\/(\d+)/);
  const videoId = idMatch ? idMatch[1] : null;

  if (videoId) {
    window.fetch(`https://video.tv.adobe.com/v/${videoId}?format=json-ld`)
      .then((res) => res.json())
      .then(async (info) => {
        const { setDialogAndElementAttributes } = await import('../../scripts/accessibility.js');
        setDialogAndElementAttributes({ element: iframe, title: `${info?.jsonLinkedData?.name}` });
      });
  }

  if (!playerListenerAdded) {
    window.addEventListener('message', onPlayerMessage);
    playerListenerAdded = true;
  }
  getPlayerObserver().observe(iframe);

  a.remove();
  if (focus) iframe.focus();
};

const createIframeWithCaptions = (a, url, geo, opts) => {
  if (!captionsLangMapPromise) {
    createIframe(a, url.href, opts);
  } else {
    captionsLangMapPromise?.then((resp) => {
      if (resp?.data) {
        const videoHref = updateCaptionsLang(url, geo, resp.data);
        createIframe(a, videoHref, opts);
      } else {
        createIframe(a, url.href, opts);
      }
    }).catch((e) => {
      logError('Could not get atv captions', e);
      createIframe(a, url.href, opts);
    });
  }
};

const embedPlayer = (a, opts = {}) => {
  const url = new URL(a.href);
  if (opts.autoplay) url.searchParams.set('autoplay', 'true');
  const { atvCaptionsKey, locale } = getConfig();
  const geo = (locale?.prefix || '').replace('/langstore', '').replace('/', '');
  const federalCR = atvCaptionsKey && getFederatedContentRoot();

  if (geo && federalCR && url.searchParams.has('captions')) {
    if (!captionsLangMapPromise) {
      const captionsUrl = `${federalCR}/federal/assets/data/adobetv-captions.json?sheet=${atvCaptionsKey}`;
      captionsLangMapPromise = fetch(captionsUrl).then((res) => {
        if (!res.ok) {
          return new Promise(() => { throw new Error(`Failed to fetch ${captionsUrl}`); });
        }
        return res.json();
      });
    }
    createIframeWithCaptions(a, url, geo, opts);
  } else {
    createIframe(a, url.href, opts);
  }
};

const PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="42" viewBox="0 0 40 42" fill="none" class="play-icon" aria-hidden="true"><path d="M36.8084 15.6746L8.93018 0.728828C4.89238 -1.43591 0 1.48158 0 6.05422V35.9458C0 40.5184 4.89238 43.4359 8.93018 41.2712L36.8084 26.3253C41.0639 24.0439 41.0638 17.956 36.8084 15.6746Z" fill="white"/></svg>';

// Delegated so posters in cloned nodes (e.g. carousel slide clones) still play.
const onPosterPlay = (e) => {
  const poster = e.target.closest?.('.mpc-poster');
  if (!poster || !e.target.closest('.consonant-play-btn')) return;
  const a = poster.previousElementSibling;
  if (a?.tagName !== 'A') return;
  poster.remove();
  embedPlayer(a, { autoplay: true, focus: true });
};
let posterListenerAdded = false;

// The MPC player only loads once the poster's play button is pressed.
const createPosterPlayer = (a) => {
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/styles/consonant-play-button.css`);
  const poster = createTag('div', { class: 'mpc-poster modal-img-link' }, a.dataset.videoPoster);
  const alt = poster.querySelector('img')?.alt;
  const button = createTag('button', {
    type: 'button',
    class: 'consonant-play-btn btn-large',
    'aria-label': `Play${alt ? ` ${alt}` : ''}`,
  }, createTag('span', { class: 'play-icon-container' }, PLAY_ICON));
  poster.append(button);
  a.hidden = true;
  a.after(poster);
  if (!posterListenerAdded) {
    document.addEventListener('click', onPosterPlay);
    posterListenerAdded = true;
  }
};

const PLAYBACK_HASH = /autoplay|hoverplay|viewportplay/;

export default function init(a) {
  a.classList.add('hide-video');
  const bgBlocks = ['aside', 'marquee', 'hero-marquee', 'long-form', 'explore-card'];
  const isMp4 = a.href.includes('.mp4');
  const inBgBlock = bgBlocks.some((b) => a.closest(`.${b}`));
  const hasPlaybackHash = PLAYBACK_HASH.test(a.hash);
  // MPC player URLs stay the iframe unless a Milo video hash or a background block asks for native.
  const isNativeVideo = (isMp4 && (inBgBlock || hasPlaybackHash || !!a.dataset.videoPoster))
    || (!!getMpcPlayerId(a.href) && (inBgBlock || hasPlaybackHash));
  if (isNativeVideo) {
    a.classList.add('hide');
    if (!a.parentNode) return;
    decorateAnchorVideo({
      src: a.href,
      anchorTag: a,
    });
  } else {
    const queryAutoplay = new URL(a.href).searchParams.get('autoplay') === 'true';
    if (a.dataset.videoPoster && getMpcPlayerId(a.href) && !queryAutoplay) {
      createPosterPlayer(a);
    } else {
      embedPlayer(a, { autoplay: queryAutoplay });
    }
  }
}

import { decorateAnchorVideo, getMpcPlayerId } from '../../utils/decorate.js';
import { createTag, getConfig, getFederatedContentRoot, getFedsPlaceholderConfig, loadStyle } from '../../utils/utils.js';
import { PLAY_ICON_SVG } from '../../utils/image-video-link.js';

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

const sendMpcAction = (iframe, action) => {
  iframe.contentWindow?.postMessage({ type: 'mpcAction', action }, iframe.src);
};

export const pauseMpcPlayer = (iframe) => sendMpcAction(iframe, 'pause');

// A WeakSet rather than a data attribute so carousel clones don't inherit the state.
const inViewPlayers = new WeakSet();
let autoplayObserver;

// Autoplay is decided once, on load: off-screen players stay paused like any other player.
const resolvePendingAutoplay = (iframe) => {
  if (!iframe.dataset.autoplayPending) return;
  delete iframe.dataset.autoplayPending;
  autoplayObserver?.unobserve(iframe);
  if (inViewPlayers.has(iframe)) sendMpcAction(iframe, 'play');
};

const getAutoplayObserver = () => {
  // Same visibility rule as native viewportplay video.
  autoplayObserver ??= new IntersectionObserver((entries) => {
    entries.forEach(({ intersectionRatio, target }) => {
      if (intersectionRatio > 0.8) inViewPlayers.add(target);
      else inViewPlayers.delete(target);
    });
  }, { threshold: [0.8] });
  return autoplayObserver;
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
  if (!['load', 'play', 'pause'].includes(state)) return;
  const iframe = [...document.querySelectorAll('iframe.adobetv')]
    .find((f) => f.contentWindow === event.source);
  if (!iframe) return;
  if (state === 'load') {
    resolvePendingAutoplay(iframe);
    return;
  }
  iframe.setAttribute('data-playing', state === 'play');
  getPlayerObserver().observe(iframe);
};
let playerListenerAdded = false;

const createIframe = (a, href, opts = {}) => {
  const { autoplay = false, autoplayInView = false, focus = false } = opts;
  const videoHref = href || a.href;

  const iframe = createTag('iframe', {
    src: videoHref,
    class: 'adobetv',
    scrolling: 'no',
    allow: `${autoplay || autoplayInView ? 'autoplay; ' : ''}encrypted-media; fullscreen`,
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
  if (autoplayInView) {
    iframe.dataset.autoplayPending = 'true';
    getAutoplayObserver().observe(iframe);
  }

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
  // Load paused; it only starts if mostly in view when the player loads.
  if (opts.autoplayInView) url.searchParams.delete('autoplay');
  else if (opts.autoplay) url.searchParams.set('autoplay', 'true');
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
  const withAlt = (label) => `${label}${alt ? ` ${alt}` : ''}`;
  const button = createTag('button', {
    type: 'button',
    class: 'consonant-play-btn btn-large',
    'aria-label': withAlt('Play'),
  }, createTag('span', { class: 'play-icon-container' }, PLAY_ICON_SVG));
  import('../../features/placeholders.js')
    .then(({ replaceKey }) => replaceKey('play-motion', getFedsPlaceholderConfig()))
    .then((label) => button.setAttribute('aria-label', withAlt(label)))
    .catch((e) => logError('Could not get play label', e));
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
  // MPC player URLs stay the iframe player (sound, captions, controls) unless a Milo hash opts in.
  const isNativeVideo = (isMp4 && (inBgBlock || hasPlaybackHash || !!a.dataset.videoPoster))
    || (!!getMpcPlayerId(a.href) && hasPlaybackHash);
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
      embedPlayer(a, { autoplayInView: queryAutoplay });
    }
  }
}

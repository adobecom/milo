import { decorateAnchorVideo } from '../../utils/decorate.js';
import {
  createTag, getConfig, getFederatedContentRoot, getMetadata, isMpcPlayerUrl, loadStyle,
} from '../../utils/utils.js';
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

const createIframe = (a, href, opts = {}) => {
  const { autoplay = false, focus = false, isC2Page = false } = opts;
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
  // Containers like carousel-c2 hide inactive content before autoblocks load.
  if (isC2Page && embed.closest('[aria-hidden="true"]')) iframe.setAttribute('tabindex', '-1');

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

// Delegated so posters in cloned nodes (e.g. carousel slide clones) still play.
const onPosterPlay = (e) => {
  const poster = e.target.closest?.('.mpc-poster');
  if (!poster?.dataset.href || !e.target.closest('.consonant-play-btn')) return;
  const a = createTag('a', { href: poster.dataset.href });
  poster.replaceWith(a);
  embedPlayer(a, { autoplay: true, focus: true, isC2Page: true });
};
let posterListenerAdded = false;

const createPosterPlayer = (a) => {
  const { miloLibs, codeRoot } = getConfig();
  loadStyle(`${miloLibs || codeRoot}/styles/consonant-play-button.css`);
  const poster = createTag('div', { class: 'mpc-poster modal-img-link', 'data-href': a.href }, a.dataset.videoPoster);
  const img = poster.querySelector('img');
  const alt = img?.alt;
  // The button label already includes the alt text.
  img?.setAttribute('role', 'none');
  const withAlt = (label) => `${label}${alt ? ` ${alt}` : ''}`;
  const button = createTag('button', {
    type: 'button',
    class: 'consonant-play-btn btn-large',
    'aria-label': withAlt('Play'),
  }, createTag('span', { class: 'play-icon-container' }, PLAY_ICON_SVG));
  import('../../features/placeholders.js')
    .then(({ replaceKey }) => replaceKey('play-video', getConfig()))
    .then((label) => button.setAttribute('aria-label', withAlt(label)))
    .catch((e) => logError('Could not get play label', e));
  poster.append(button);
  a.replaceWith(poster);
  if (poster.closest('[aria-hidden="true"]')) button.setAttribute('tabindex', '-1');
  if (posterListenerAdded) return;
  document.addEventListener('click', onPosterPlay);
  posterListenerAdded = true;
};

export default function init(a) {
  a.classList.add('hide-video');
  const isC2Page = getMetadata('foundation') === 'c2';
  const bgBlocks = ['aside', 'marquee', 'hero-marquee', 'long-form'];
  if (a.href.includes('.mp4') && (isC2Page || bgBlocks.some((b) => a.closest(`.${b}`)))) {
    a.classList.add('hide');
    if (!a.parentNode) return;
    decorateAnchorVideo({
      src: a.href,
      anchorTag: a,
    });
  } else if (isC2Page && a.dataset.videoPoster && isMpcPlayerUrl(a.href)
    && new URL(a.href).searchParams.get('autoplay') !== 'true') {
    createPosterPlayer(a);
  } else {
    embedPlayer(a, { isC2Page });
  }
}

const MEDIA_VIDEO = /media_.*\.mp4/;
const EDS_HOST = /\.(hlx|aem)\.(page|live)$/;
const HIDE_CONTROLS = '#_hide-controls';
const HERO_DEFAULT_HASH = '#autoplay';
const USER_PAUSED = 'data-user-paused';
const LABELS = Object.freeze({ play: 'Play', pause: 'Pause' });
const SVG_NS = 'http://www.w3.org/2000/svg';
const PLAY_PATH = 'M5 3.5v11a.75.75 0 0 0 1.13.64l9-5.5a.75.75 0 0 0 0-1.28l-9-5.5A.75.75 0 0 0 5 3.5Z';
const PAUSE_PATH = 'M5.5 3h1.5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm5.5 0h1.5a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z';
const counters = new WeakMap();

function trustedHost(a) {
  let url;
  try {
    url = new URL(a.getAttribute('href') || '', a.ownerDocument.baseURI);
  } catch (e) {
    return false;
  }
  const host = url.hostname.replace('www.', '');
  const pageHost = (a.ownerDocument.defaultView?.location?.hostname || '').replace('www.', '');
  return host === pageHost || host === 'adobe.com' || host.endsWith('.adobe.com') || EDS_HOST.test(host);
}

export function isVideoLink(a) {
  if (!a || a.nodeName !== 'A') return false;
  if (a.classList.contains('video') && a.classList.contains('link-block')) return true;
  if (!(a.getAttribute('href') || '').includes('.mp4') || !trustedHost(a)) return false;
  if (a.hasAttribute('data-video-poster')) return true;
  return MEDIA_VIDEO.test(a.textContent || '');
}

function reducedMotion(win) {
  return !!win?.matchMedia && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function videoFlags(hash) {
  const h = hash || '';
  const autoplay = h.includes('autoplay');
  const once = h.includes('autoplay1');
  const hover = h.includes('hoverplay');
  const viewport = h.includes('viewportplay');
  if (autoplay && !once) return { mode: 'autoplay', loop: true, muted: true, viewport };
  if (hover && once && viewport) return { mode: 'hover', loop: false, muted: true, hover: true, viewport: false };
  if (hover && once) return { mode: 'autoplay', loop: false, muted: true, hover: true, viewport: false };
  if (hover) return { mode: 'hover', loop: false, muted: true, hover: true, viewport: false };
  if (once) return { mode: 'autoplay', loop: false, muted: true, viewport };
  return { mode: 'controls', loop: false, muted: false, viewport: false };
}

function posterOf(a, win) {
  let root = a.querySelector('picture');
  const html = a.getAttribute('data-video-poster');
  if (!root && html && win?.DOMParser) root = new win.DOMParser().parseFromString(html, 'text/html');
  if (!root) return null;
  const width = win?.innerWidth ?? 1280;
  const sel = width <= 600 ? 'source[type="image/webp"]:not([media])' : 'source[type="image/webp"][media]';
  const source = root.querySelector(sel);
  const src = source?.getAttribute('srcset') || root.querySelector('img')?.getAttribute('src');
  return src || null;
}

function nextIndex(doc) {
  const n = (counters.get(doc) || 0) + 1;
  counters.set(doc, n);
  return n;
}

function icon(doc, cls, d) {
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', cls);
  svg.setAttribute('viewBox', '0 0 18 18');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('fill', 'currentColor');
  svg.append(path);
  return svg;
}

function syncControl(holder, playing) {
  holder.classList.toggle('s2-video-playing', playing);
  const button = holder.querySelector(':scope > .s2-video-control');
  if (!button) return;
  const index = (counters.get(holder.ownerDocument) || 0) > 1 ? button.dataset.videoIndex || '' : '';
  const label = `${playing ? LABELS.pause : LABELS.play} ${index}`.trim();
  button.setAttribute('aria-label', label);
  button.setAttribute('title', label);
  button.setAttribute('aria-pressed', playing ? 'true' : 'false');
}

function safePlay(video) {
  try {
    const p = video.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch (e) { /* autoplay refused: leave it paused */ }
}

function observe(win, video, options, callback) {
  if (!win?.IntersectionObserver) {
    callback([{ isIntersecting: true, intersectionRatio: 1, target: video }]);
    return null;
  }
  const io = new win.IntersectionObserver(callback, options);
  io.observe(video);
  return io;
}

export function decorateVideo(a, { autoplayByDefault = false, make } = {}) {
  if (!isVideoLink(a) || !a.parentNode) return null;
  const doc = a.ownerDocument;
  const win = doc.defaultView;
  const reduce = reducedMotion(win);
  let url;
  try {
    url = new URL(a.getAttribute('href'), doc.baseURI);
  } catch (e) {
    return null;
  }
  const accessible = !url.hash.includes(HIDE_CONTROLS);
  let hash = url.hash.replace(HIDE_CONTROLS, '');
  if (autoplayByDefault && !hash) hash = HERO_DEFAULT_HASH;
  const flags = videoFlags(hash);
  url.hash = '';
  const src = url.href;
  const el = (tag, attrs) => (make
    ? make(tag, attrs)
    : Object.assign(doc.createElement(tag), attrs));

  const video = doc.createElement('video');
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'metadata');
  video.dataset.videoSource = src;
  const poster = posterOf(a, win);
  if (poster) video.setAttribute('poster', poster);
  if (a.getAttribute('tabindex') === '-1') video.setAttribute('tabindex', '-1');
  if (flags.muted) video.muted = true;
  if (flags.muted) video.setAttribute('muted', '');
  if (flags.loop) video.setAttribute('loop', '');
  if (flags.mode === 'controls') video.setAttribute('controls', '');
  const wantsAutoplay = flags.mode === 'autoplay' && !reduce;
  if (wantsAutoplay && !flags.viewport) video.setAttribute('autoplay', '');
  if (flags.viewport) video.dataset.playViewport = '';
  if (flags.hover) video.dataset.hoverplay = '';

  const holder = el('div', {});
  holder.className = 's2-video';
  holder.append(video);
  a.after(holder);
  a.remove();

  observe(win, video, { rootMargin: '1000px' }, (entries, io) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    if (!video.hasAttribute('src')) {
      video.setAttribute('src', src);
      if (typeof video.load === 'function' && video.readyState === 0) {
        try { video.load(); } catch (e) { /* load() unsupported */ }
      }
    }
    io?.disconnect();
  });

  if (flags.mode === 'controls') {
    observe(win, video, { rootMargin: '0px' }, (entries) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (!isIntersecting && !target.paused) target.pause();
      });
    });
    return holder;
  }

  if (flags.hover) {
    if (accessible) holder.setAttribute('tabindex', a.getAttribute('tabindex') === '-1' ? '-1' : '0');
    if (!reduce) {
      const play = () => safePlay(video);
      const pause = () => video.pause();
      video.addEventListener('mouseenter', play);
      video.addEventListener('mouseleave', pause);
      holder.addEventListener('focus', play);
      holder.addEventListener('blur', pause);
    }
    return holder;
  }

  if (accessible) {
    const button = el('button', {});
    button.type = 'button';
    button.className = 's2-video-control';
    const index = nextIndex(doc);
    button.dataset.videoIndex = String(index);
    button.append(icon(doc, 's2-video-icon-play', PLAY_PATH), icon(doc, 's2-video-icon-pause', PAUSE_PATH));
    holder.append(button);
    button.addEventListener('click', (event) => {
      event.preventDefault();
      if (video.paused || video.ended) {
        video.removeAttribute(USER_PAUSED);
        safePlay(video);
      } else {
        video.pause();
        video.setAttribute(USER_PAUSED, '');
      }
    });
    doc.querySelectorAll('.s2-video > .s2-video-control').forEach((b) => {
      syncControl(b.parentElement, b.parentElement.classList.contains('s2-video-playing'));
    });
  }

  video.addEventListener('playing', () => syncControl(holder, true));
  video.addEventListener('pause', () => syncControl(holder, false));
  video.addEventListener('ended', () => { video.dataset.playedOnce = 'true'; syncControl(holder, false); });
  syncControl(holder, false);

  if (flags.viewport && !reduce) {
    observe(win, video, { threshold: [0.8] }, (entries) => {
      entries.forEach(({ intersectionRatio }) => {
        const userPaused = video.hasAttribute(USER_PAUSED);
        if (intersectionRatio <= 0.8) video.pause();
        else if (!userPaused && (video.loop || video.dataset.playedOnce !== 'true') && video.paused) safePlay(video);
      });
    });
  }
  return holder;
}

export function decorateVideoLinks(root, opts = {}) {
  if (!root) return [];
  return [...root.querySelectorAll('a[href*=".mp4"]')]
    .map((a) => decorateVideo(a, opts))
    .filter(Boolean);
}

import { createTag } from '../../../utils/utils.js';
import guardPlayerScroll from '../../utils/player-scroll-guard.js';

const EMBED_BASE = 'https://www.youtube-nocookie.com/embed';
const CHAT_BASE = 'https://www.youtube.com/live_chat';
const THUMBNAIL_BASE = 'https://i.ytimg.com/vi';
const PRECONNECT = ['https://www.youtube-nocookie.com', 'https://i.ytimg.com', 'https://www.google.com'];
const VIDEO_ID = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = ['youtube.com', 'youtube-nocookie.com'];
const DEFAULT_TITLE = 'YouTube video player';
const IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

let preconnected = false;

/**
 * Accepts a video ID or any common YouTube URL (watch, youtu.be, embed, live, shorts).
 * @param {string} value
 * @returns {string|null}
 */
export function getVideoId(value) {
  const text = value?.trim();
  if (!text) return null;
  if (VIDEO_ID.test(text)) return text;
  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www|m)\./, '');
  let id = null;
  if (host === 'youtu.be') {
    [, id] = url.pathname.split('/');
  } else if (YOUTUBE_HOSTS.includes(host)) {
    id = url.searchParams.get('v') ?? url.pathname.match(/^\/(?:embed|live|shorts)\/([\w-]+)/)?.[1];
  }
  return VIDEO_ID.test(id ?? '') ? id : null;
}

const isOn = (value) => ['true', 'yes', 'on'].includes(value?.trim().toLowerCase());
const isOff = (value) => ['false', 'no', 'off'].includes(value?.trim().toLowerCase());

export function readConfig(el) {
  const config = {};
  [...el.querySelectorAll(':scope > div')].forEach((row) => {
    const [keyCell, valueCell] = row.children;
    const key = keyCell?.textContent.trim().toLowerCase();
    if (!key || !valueCell) return;
    if (key === 'video') {
      config.video = valueCell.querySelector('a[href]')?.href ?? valueCell.textContent;
    } else if (key === 'poster') {
      config.poster = valueCell.querySelector('picture, img');
    } else {
      config[key] = valueCell.textContent.trim();
    }
  });
  return config;
}

function preconnect() {
  if (preconnected) return;
  preconnected = true;
  PRECONNECT.forEach((href) => document.head.append(createTag('link', { rel: 'preconnect', href })));
}

function buildEmbedUrl(videoId, config, { autoplay, mute }) {
  const params = new URLSearchParams({ rel: '0', playsinline: '1', enablejsapi: '1', origin: window.location.origin });
  if (autoplay) params.set('autoplay', '1');
  if (mute) params.set('mute', '1');
  if (isOff(config.controls)) params.set('controls', '0');
  return `${EMBED_BASE}/${videoId}?${params}`;
}

function createIframe(src, title, cls) {
  return createTag('iframe', {
    class: cls,
    src,
    title,
    allow: IFRAME_ALLOW,
    allowfullscreen: '',
    referrerpolicy: 'strict-origin-when-cross-origin',
  });
}

/**
 * Tracks playback through the YouTube iframe API so the block can toggle it itself.
 * @param {HTMLIFrameElement} iframe
 * @returns {{ toggle: () => void }}
 */
export function controlPlayback(iframe) {
  const { origin } = new URL(EMBED_BASE);
  let playing = false;
  const send = (message) => iframe.contentWindow?.postMessage(JSON.stringify(message), origin);

  window.addEventListener('message', (e) => {
    if (e.origin !== origin || e.source !== iframe.contentWindow) return;
    let data;
    try {
      data = JSON.parse(e.data);
    } catch {
      return;
    }
    const state = data?.event === 'onStateChange' ? data.info : data?.info?.playerState;
    // 1 = playing, 3 = buffering
    if (typeof state === 'number') playing = state === 1 || state === 3;
  });
  iframe.addEventListener('load', () => send({ event: 'listening', id: iframe.id, channel: 'widget' }));

  return {
    toggle() {
      send({ event: 'command', func: playing ? 'pauseVideo' : 'playVideo', args: [] });
      playing = !playing;
    },
  };
}

function loadChat(chat, videoId, title) {
  if (!chat || chat.querySelector('iframe')) return;
  const src = `${CHAT_BASE}?v=${videoId}&embed_domain=${encodeURIComponent(window.location.hostname)}`;
  chat.replaceChildren(createIframe(src, `Live chat: ${title}`, 'youtube-c2-chat-frame'));
}

function buildPoster(videoId, config, title, onPlay) {
  const button = createTag('button', {
    type: 'button',
    class: 'youtube-c2-poster',
    'aria-label': `Play video: ${title}`,
    'daa-ll': `Play-${title}`,
  });
  const image = config.poster ?? createTag('img', { src: `${THUMBNAIL_BASE}/${videoId}/hqdefault.jpg`, alt: '', loading: 'lazy' });
  // Some livestreams have no thumbnail; fall back to the plain player background.
  if (!config.poster) image.addEventListener('error', () => image.remove(), { once: true });
  // The button's label names the video, so the poster image is decorative.
  (image.tagName === 'IMG' ? image : image.querySelector('img'))?.setAttribute('alt', '');
  button.append(image, createTag('span', { class: 'youtube-c2-play', 'aria-hidden': 'true' }));
  button.addEventListener('pointerover', preconnect, { once: true });
  button.addEventListener('focus', preconnect, { once: true });
  button.addEventListener('click', onPlay, { once: true });
  return button;
}

export default function init(el) {
  const config = readConfig(el);
  const videoId = getVideoId(config.video);
  if (!videoId) {
    window.lana?.log(`youtube-c2: missing or invalid video - ${config.video ?? ''}`, { tags: 'youtube-c2', severity: 'error' });
    el.remove();
    return;
  }

  const title = config.title || DEFAULT_TITLE;
  const autoplay = isOn(config.autoplay);
  const hasChat = isOn(config.chat);

  const stream = createTag('div', { class: `youtube-c2-stream${hasChat ? ' has-chat' : ''}` });
  const video = createTag('div', { class: 'youtube-c2-video' }, null, { parent: stream });
  const chat = hasChat
    ? createTag('div', { class: 'youtube-c2-chat' }, createTag('p', { class: 'youtube-c2-chat-placeholder' }, 'Live chat loads when the video starts.'), { parent: stream })
    : null;

  let player = null;
  // Browsers only allow autoplay without a click when muted.
  const play = (fromClick) => {
    const mute = !fromClick || isOn(config.mute);
    const src = buildEmbedUrl(videoId, config, { autoplay: true, mute });
    const iframe = createIframe(src, title, 'youtube-c2-frame');
    iframe.id = `youtube-c2-${videoId}-${Math.random().toString(36).slice(2, 8)}`;
    player = controlPlayback(iframe);
    video.replaceChildren(iframe);
    if (fromClick) iframe.focus();
    loadChat(chat, videoId, title);
  };

  if (autoplay) {
    preconnect();
    play(false);
  } else {
    video.append(buildPoster(videoId, config, title, () => play(true)));
  }

  el.replaceChildren(stream);
  // A press during a smooth scroll never reaches the iframe, so pause/play it for the viewer.
  guardPlayerScroll(el, {
    onInertPress: (e) => {
      if (video.contains(e.target)) player?.toggle();
    },
  });
}

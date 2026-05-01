import { createTag, getConfig } from '../../utils/utils.js';
import { replaceKey } from '../../features/placeholders.js';

const PLAY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function buildPlayer(src, playLabel, pauseLabel) {
  const audio = createTag('audio', { src, preload: 'metadata' });

  const playIcon = createTag('span', { class: 'audio-play-icon', 'aria-hidden': 'true' });
  playIcon.innerHTML = PLAY_ICON;
  const pauseIcon = createTag('span', { class: 'audio-pause-icon', 'aria-hidden': 'true' });
  pauseIcon.innerHTML = PAUSE_ICON;

  const playBtn = createTag('button', {
    class: 'audio-play-btn',
    'aria-label': playLabel,
    'aria-pressed': 'false',
    type: 'button',
  }, [playIcon, pauseIcon]);

  const progress = createTag('input', {
    type: 'range',
    class: 'audio-progress',
    min: '0',
    max: '100',
    value: '0',
    step: '0.01',
    'aria-label': 'seek',
  });

  const currentTimeEl = createTag('span', { class: 'audio-current-time' }, '0:00');
  const durationEl = createTag('span', { class: 'audio-duration' }, '0:00');
  const timeEl = createTag('div', { class: 'audio-time' }, [currentTimeEl, durationEl]);
  const trackEl = createTag('div', { class: 'audio-track' }, [progress, timeEl]);
  const player = createTag('div', {
    class: 'audio-player',
    role: 'region',
    'aria-label': 'Audio player',
  }, [playBtn, trackEl, audio]);

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener('play', () => {
    playBtn.setAttribute('aria-label', pauseLabel);
    playBtn.setAttribute('aria-pressed', 'true');
    playBtn.classList.add('is-playing');
  });

  audio.addEventListener('pause', () => {
    playBtn.setAttribute('aria-label', playLabel);
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.classList.remove('is-playing');
  });

  audio.addEventListener('ended', () => {
    playBtn.setAttribute('aria-label', playLabel);
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.classList.remove('is-playing');
    progress.value = 0;
    currentTimeEl.textContent = '0:00';
  });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progress.value = pct;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });

  return player;
}

export default async function init(el) {
  const link = el.querySelector('a[href]');
  if (!link) return;

  const { href } = link;
  if (!/\.(mp3|wav)(\?.*)?$/i.test(href)) return;

  const config = getConfig();
  const [playLabel, pauseLabel] = await Promise.all([
    replaceKey('play', config),
    replaceKey('pause', config),
  ]);

  const player = buildPlayer(href, playLabel || 'Play', pauseLabel || 'Pause');
  el.innerHTML = '';
  el.append(player);
}

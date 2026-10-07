import { createTag } from '../../../utils/utils.js';

const SET_COUNT = 3;

const PLAY_SVG = '<svg class="logo-ticker-play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg>';
const PAUSE_SVG = '<svg class="logo-ticker-pause-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="8" y="5" width="3" height="14" rx="1" fill="currentColor"/><rect x="13" y="5" width="3" height="14" rx="1" fill="currentColor"/></svg>';

function parseAuthoring(el) {
  const rows = [...el.children];
  const logos = [...rows[0]?.querySelectorAll('span.icon') ?? []];
  const [trackLabel = '', playLabel = 'Play logos', pauseLabel = 'Pause logos'] = (rows[1]?.textContent ?? '').split('||').map((s) => s.trim());
  return { logos, trackLabel, playLabel, pauseLabel };
}

function buildTrack(logos, trackLabel) {
  const logoSets = Array.from({ length: SET_COUNT }, (_, i) => {
    const logoSet = createTag('div', { class: 'logo-ticker-set' });
    if (i > 0) logoSet.setAttribute('aria-hidden', 'true');
    logos.forEach((logo) => logoSet.append(logo.cloneNode(true)));
    return logoSet;
  });

  const track = createTag('div', { class: 'logo-ticker-track', role: 'img' }, logoSets);
  if (trackLabel) track.setAttribute('aria-label', trackLabel);
  return track;
}

function buildPlayPauseButton(pauseLabel) {
  return createTag('button', {
    class: 'logo-ticker-play-pause is-playing',
    'aria-label': pauseLabel,
    'aria-pressed': 'true',
  }, `${PLAY_SVG}${PAUSE_SVG}`);
}

function initPlayPause(button, el, playLabel, pauseLabel) {
  const reducedMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isPlaying = !reducedMotionMQ.matches;

  const update = (playing) => {
    isPlaying = playing;
    el.style.setProperty('--logo-ticker-play-state', playing ? 'running' : 'paused');
    button.setAttribute('aria-label', playing ? pauseLabel : playLabel);
    button.setAttribute('aria-pressed', String(playing));
    button.classList.toggle('is-playing', playing);
  };

  button.addEventListener('click', () => update(!isPlaying));
  reducedMotionMQ.addEventListener('change', ({ matches }) => update(!matches));

  update(isPlaying);
}

function addScrollBoost(track, el, getIsPlaying) {
  let targetOffset = 0;
  let currentOffset = 0;
  let lastScrollY = window.scrollY;
  let isVisible = false;
  let rafId = null;

  new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; }).observe(el);

  const step = () => {
    const y = window.lenis?.animatedScroll ?? window.scrollY;
    const delta = y - lastScrollY;
    lastScrollY = y;

    if (getIsPlaying() && !track.classList.contains('is-static') && delta !== 0) {
      const setWidth = parseFloat(track.style.getPropertyValue('--logo-ticker-set-width')) || Infinity;
      targetOffset = Math.max(-setWidth, Math.min(targetOffset + delta * 0.6, setWidth));
    }

    currentOffset += (targetOffset - currentOffset) * 0.08;
    el.style.setProperty('--logo-ticker-scroll-offset', `${currentOffset}px`);

    if (Math.abs(targetOffset - currentOffset) > 0.1) {
      rafId = requestAnimationFrame(step);
    } else {
      rafId = null;
    }
  };

  window.addEventListener('scroll', () => {
    if (!isVisible || rafId) return;
    rafId = requestAnimationFrame(step);
  }, { passive: true });
}

function syncTrackMetrics(track, el) {
  const firstSet = track.firstElementChild;
  if (!firstSet) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const setWidth = firstSet.offsetWidth;
  const isStatic = setWidth + 2 * gap <= el.clientWidth;
  track.classList.toggle('is-static', isStatic);
  track.style.setProperty('--logo-ticker-set-width', `${setWidth + gap}px`);
}

export default function init(el) {
  const { logos, trackLabel, playLabel, pauseLabel } = parseAuthoring(el);
  if (!logos.length) return;

  const track = buildTrack(logos, trackLabel);
  const wrap = createTag('div', { class: 'logo-ticker-wrap' });
  wrap.append(track);
  const button = buildPlayPauseButton(pauseLabel);
  el.replaceChildren(wrap, button);

  syncTrackMetrics(track, el);
  const ro = new ResizeObserver(() => syncTrackMetrics(track, el));
  ro.observe(track.firstElementChild);
  ro.observe(el);

  initPlayPause(button, el, playLabel, pauseLabel);
  addScrollBoost(track, el, () => button.classList.contains('is-playing'));
}

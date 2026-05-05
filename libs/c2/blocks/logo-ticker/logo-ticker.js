import { createTag, getFederatedContentRoot, getFedsPlaceholderConfig } from '../../../utils/utils.js';
import { replaceKeyArray } from '../../../features/placeholders.js';

const LANA_OPTIONS = { tags: 'logo-ticker', errorType: 'i' };
const PLACEHOLDER_KEYS = ['pause-motion', 'play-motion', 'pause-icon', 'play-icon'];
const SET_COUNT = 2;

let labels = {
  pauseMotion: 'Pause',
  playMotion: 'Play',
  pauseIcon: 'Pause icon',
  playIcon: 'Play icon',
};

async function fetchLabels() {
  try {
    const [pauseMotion, playMotion, pauseIcon, playIcon] = await replaceKeyArray(
      PLACEHOLDER_KEYS,
      getFedsPlaceholderConfig(),
    );
    return { pauseMotion, playMotion, pauseIcon, playIcon };
  } catch (err) {
    window.lana?.log(`logo-ticker: failed to load animation labels: ${err}`, LANA_OPTIONS);
    return labels;
  }
}

function buildTrack(logos) {
  const logoSets = Array.from({ length: SET_COUNT }, (_, i) => {
    const logoSet = createTag('div', { class: 'logo-ticker-set' });
    if (i > 0) logoSet.setAttribute('aria-hidden', 'true');
    logos.forEach((logo) => logoSet.append(logo.cloneNode(true)));
    return logoSet;
  });
  return createTag('div', { class: 'logo-ticker-track is-offscreen' }, logoSets);
}

// TODO: temporarily overriding svg colors. Should upload to feds
function recolorIcons(root) {
  const ICON_FILL = 'var(--s2a-color-content-default)';
  function recolorSvg(svg) {
    svg.setAttribute('fill', ICON_FILL);
    svg.querySelectorAll('[fill]:not([fill="none"])').forEach((node) => {
      node.setAttribute('fill', ICON_FILL);
    });
  }
  root.querySelectorAll('svg').forEach(recolorSvg);
  return root;
}

function syncTrackMetrics(track) {
  const firstSet = track.firstElementChild;
  if (!firstSet) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const setWidth = firstSet.offsetWidth;
  track.style.setProperty('--logo-ticker-distance', `-${setWidth + gap}px`);
  const containerWidth = track.parentElement?.clientWidth || 0;
  track.classList.toggle('is-static', setWidth <= containerWidth);
}

function buildToggle(track) {
  const fedRoot = getFederatedContentRoot();
  if (!fedRoot) return null;

  const button = createTag('button', {
    type: 'button',
    class: 'logo-ticker-toggle',
    title: labels.pauseMotion,
    'aria-label': labels.pauseMotion,
    'aria-pressed': 'true',
  });

  const iconWrap = createTag('span', { class: 'logo-ticker-toggle-icon is-playing' });
  const playIcon = createTag('img', {
    class: 'play-icon',
    alt: labels.playIcon,
    src: `${fedRoot}/federal/assets/svgs/accessibility-play.svg`,
  });
  const pauseIcon = createTag('img', {
    class: 'pause-icon',
    alt: labels.pauseIcon,
    src: `${fedRoot}/federal/assets/svgs/accessibility-pause.svg`,
  });
  iconWrap.append(playIcon, pauseIcon);
  button.append(iconWrap);

  let playing = true;
  const setPlaying = (next) => {
    playing = next;
    track.classList.toggle('is-paused', !next);
    iconWrap.classList.toggle('is-playing', next);
    const label = next ? labels.pauseMotion : labels.playMotion;
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', String(next));
    button.setAttribute('title', label);
  };

  button.addEventListener('click', () => setPlaying(!playing));
  return button;
}

export default async function init(el) {
  const logos = [...el.querySelectorAll('span.icon')];
  if (!logos.length) return;

  labels = await fetchLabels();

  const track = buildTrack(logos);
  recolorIcons(track);
  const toggle = buildToggle(track);
  el.replaceChildren(track, toggle);

  syncTrackMetrics(track);
  const ro = new ResizeObserver(() => syncTrackMetrics(track));
  ro.observe(track.firstElementChild);
  ro.observe(el);

  new IntersectionObserver(([entry]) => {
    track.classList.toggle('is-offscreen', !entry.isIntersecting);
  }, { rootMargin: '200px' }).observe(el);
}

import { createTag } from '../../../utils/utils.js';

const SET_COUNT = 2;

function getNavHeight() {
  const style = getComputedStyle(document.documentElement);
  const nav = parseFloat(style.getPropertyValue('--gnav-height-nav')) || 72;
  const crumbs = parseFloat(style.getPropertyValue('--feds-breadcrumbs-height')) || 0;
  return nav + crumbs;
}

function buildTrack(el, logos) {
  const logoSets = Array.from({ length: SET_COUNT }, (_, i) => {
    const logoSet = createTag('div', { class: 'logo-ticker-set' });
    if (i > 0) logoSet.setAttribute('aria-hidden', 'true');
    logos.forEach((logo) => logoSet.append(logo.cloneNode(true)));
    return logoSet;
  });

  const track = createTag('div', { class: 'logo-ticker-track', role: 'img' }, logoSets);
  if (el.children.length >= 2) {
    track.setAttribute('aria-label', el.children[1].textContent);
  }
  return track;
}

function syncTrackMetrics(track) {
  const firstSet = track.firstElementChild;
  if (!firstSet) return;
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const setWidth = firstSet.offsetWidth;
  const containerWidth = track.parentElement?.clientWidth || 0;
  const isStatic = setWidth + 2 * gap <= containerWidth;
  track.classList.toggle('is-static', isStatic);
  if (!isStatic) {
    // cover range = vh - blockH scroll px; block exits visibility below the nav
    // at progress t_max = (vh - navH) / (vh - blockH). Need the magnitude of
    // translate at t_max to reach (setWidth - containerWidth).
    const navH = getNavHeight();
    const blockH = track.parentElement?.offsetHeight || 0;
    const vh = window.innerHeight;
    const coverRange = Math.max(vh + blockH, 1);
    const tMax = Math.min((vh - navH) / coverRange, 1);
    const effectiveFraction = Math.max(2 * tMax - 1, 0.1);
    const drift = Math.max(Math.ceil((setWidth - containerWidth) / effectiveFraction), 240);
    track.style.setProperty('--logo-ticker-drift-distance', `${drift}px`);
  }
}

export default function init(el) {
  const logos = [...el.querySelectorAll('span.icon')];
  if (!logos.length) return;

  const track = buildTrack(el, logos);
  el.replaceChildren(track);

  syncTrackMetrics(track);
  const ro = new ResizeObserver(() => syncTrackMetrics(track));
  ro.observe(track.firstElementChild);
  ro.observe(el);
}

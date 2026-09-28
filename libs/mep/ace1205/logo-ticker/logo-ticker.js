import { createTag } from '../../../utils/utils.js';

const SET_COUNT = 2;

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
  track.classList.toggle('is-static', setWidth + 2 * gap <= containerWidth);
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

// See README (Behavior notes).
// eslint-disable-next-line import/no-relative-packages
import { createTag } from '../../../../utils/utils.js';

const RING_SVG = [
  '<svg class="firefly-globe-cursor-ring" width="48" height="48" viewBox="-24 -24 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">',
  '<g class="firefly-globe-cursor-chevron-l"><polyline points="-8,-5 -13,0 -8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '<g class="firefly-globe-cursor-chevron-r"><polyline points="8,-5 13,0 8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '</svg>',
].join('');

const RETIRE_FADE_MS = 420;

const initialState = () => ({
  onCanvas: false,
  suppressed: false,
  active: false,
  dragging: false,
  retireT0: -1,
  mx: 0,
  my: 0,
  wx: NaN,
  wy: NaN,
  hasCoords: false,
});

export default function createCursor(deps) {
  const { getGlobeLive, getCursorRetired, labelText, drag } = deps;
  let canvasEl = null;
  let els = null;
  let state = initialState();
  let textWidth = 0;
  const isRtl = () => document.dir === 'rtl';

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function onMove(e) {
    state.mx = e.clientX;
    state.my = e.clientY;
    state.hasCoords = true;
    state.suppressed = false;
  }
  function onEnter(e) { state.onCanvas = true; onMove(e); }
  function onLeave() { state.onCanvas = false; }
  function onSuppress() { state.suppressed = true; }

  function setup(canvas) {
    if (els) return;
    if (!window.matchMedia) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const disc = createTag('div', { class: 'firefly-globe-cursor-disc' });
    document.body.appendChild(disc);

    const cursorInner = `<div class="firefly-globe-cursor-ring-wrap">${RING_SVG}</div>`
      + '<div class="firefly-globe-cursor-text-wrap">'
      + '<span class="firefly-globe-cursor-text"></span>'
      + '</div>';
    const container = createTag('div', { class: 'firefly-globe-cursor', 'aria-hidden': 'true' }, cursorInner);
    document.body.appendChild(container);
    container.querySelector('.firefly-globe-cursor-text').textContent = labelText || 'Click & Drag';
    els = {
      container,
      disc,
      ring: container.querySelector('.firefly-globe-cursor-ring-wrap'),
      text: container.querySelector('.firefly-globe-cursor-text-wrap'),
    };
    textWidth = els.text.offsetWidth;

    canvasEl = canvas;
    canvas.addEventListener('mouseenter', onEnter);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('focusin', onSuppress);
    window.addEventListener('blur', onSuppress);
  }

  function update() {
    if (!els) return;

    const wantRetired = getCursorRetired();
    if (wantRetired !== (state.retireT0 >= 0)) {
      state.retireT0 = wantRetired ? now() : -1;
      els.container.classList.toggle('firefly-globe-cursor-retiring', wantRetired);
      els.disc.classList.toggle('firefly-globe-cursor-disc-retiring', wantRetired);
    }
    const faded = state.retireT0 >= 0 && now() - state.retireT0 >= RETIRE_FADE_MS;

    const wantActive = state.hasCoords
      && state.onCanvas
      && !state.suppressed
      && getGlobeLive()
      && !faded;
    if (wantActive !== state.active) {
      state.active = wantActive;
      state.wx = NaN;
      els.container.classList.toggle('firefly-globe-cursor-active', state.active);
      els.disc.classList.toggle('firefly-globe-cursor-disc-active', state.active);
    }
    const dragging = state.active && drag.isDragging;
    if (dragging !== state.dragging) {
      state.dragging = dragging;
      els.container.classList.toggle('firefly-globe-cursor-dragging', dragging);
      els.disc.classList.toggle('firefly-globe-cursor-disc-dragging', dragging);
    }
    if (!state.active || (state.mx === state.wx && state.my === state.wy)) return;
    state.wx = state.mx;
    state.wy = state.my;
    els.disc.style.left = `${state.mx}px`;
    els.disc.style.top = `${state.my}px`;
    els.ring.style.transform = `translate(${state.mx}px, ${state.my}px)`;
    const textX = isRtl() ? state.mx - textWidth - 32 : state.mx + 32;
    els.text.style.transform = `translate(${textX}px, ${state.my - 11}px)`;
  }

  function isActive() { return state.active; }

  function teardown() {
    if (canvasEl) {
      canvasEl.removeEventListener('mouseenter', onEnter);
      canvasEl.removeEventListener('mouseleave', onLeave);
      canvasEl.removeEventListener('mousemove', onMove);
      canvasEl = null;
    }
    document.removeEventListener('focusin', onSuppress);
    window.removeEventListener('blur', onSuppress);
    if (els) {
      els.container.remove();
      els.disc.remove();
      els = null;
    }
    state = initialState();
  }

  return { setup, update, teardown, isActive };
}

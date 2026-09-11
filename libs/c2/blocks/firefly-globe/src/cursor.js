// See README (Behavior notes).
// eslint-disable-next-line import/no-relative-packages
import { createTag } from '../../../../utils/utils.js';

const RETIRE_FADE_MS = 420;

const initialState = () => ({
  onCanvas: false,
  suppressed: false,
  active: false,
  retireT0: -1,
  mx: 0,
  my: 0,
  wx: NaN,
  wy: NaN,
  hasCoords: false,
});

export default function createCursor(deps) {
  const { getGlobeLive, getCursorRetired, labelText } = deps;
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

    const cursorInner = '<div class="firefly-globe-cursor-text-wrap">'
      + '<span class="firefly-globe-cursor-text"></span>'
      + '</div>';
    const container = createTag('div', { class: 'firefly-globe-cursor', 'aria-hidden': 'true' }, cursorInner);
    document.body.appendChild(container);
    container.querySelector('.firefly-globe-cursor-text').textContent = labelText || 'Click & Drag';
    els = {
      container,
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
    }
    if (!state.active || (state.mx === state.wx && state.my === state.wy)) return;
    state.wx = state.mx;
    state.wy = state.my;
    const textX = isRtl() ? state.mx - textWidth - 32 : state.mx + 32;
    els.text.style.transform = `translate(${textX}px, ${state.my - 11}px)`;
  }

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
      els = null;
    }
    state = initialState();
  }

  return { setup, update, teardown };
}

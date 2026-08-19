// Custom "Click & Drag" cursor for the globe.

// 48px disc centered on the pointer via the −24px viewBox origin.
const RING_SVG = [
  '<svg class="globe-gallery-cursor-ring" width="48" height="48" viewBox="-24 -24 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">',
  '<g class="globe-gallery-cursor-chevron-l"><polyline points="-8,-5 -13,0 -8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '<g class="globe-gallery-cursor-chevron-r"><polyline points="8,-5 13,0 8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '</svg>',
].join('');

// Must match the --retiring transition durations in globe-gallery.css.
const RETIRE_FADE_MS = 420;

const initialState = () => ({
  onCanvas: false, // pointer currently over the globe canvas
  suppressed: false, // keyboard focus / window blur took over; cleared on next mousemove
  active: false, // cursor currently shown
  hintDismissed: false, // label faded out after the user's first drag
  retireT0: -1, // retirement fade start timestamp; -1 = not retiring
  dragging: false, // last-written drag class state
  mx: 0,
  my: 0,
  wroteX: -1, // last position written to the DOM; -1 = none, so re-activation always writes
  wroteY: -1,
  hasCoords: false, // a real mousemove has landed; gates activation
});

export default function createCursor(deps) {
  const {
    getCanvas, getSphereInteractive, getModalOpen, getReducedMotion,
    getHintDismissed, getCursorRetired, labelText, drag,
  } = deps;
  let els = null; // { container, disc, ring, text }; null until setup and after teardown
  let state = initialState();

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function onMove(e) {
    state.mx = e.clientX;
    state.my = e.clientY;
    state.hasCoords = true;
    state.suppressed = false;
  }
  function onEnter() { state.onCanvas = true; }
  function onLeave() { state.onCanvas = false; }
  function onSuppress() { state.suppressed = true; }

  // Capability is read ONCE; only a re-init re-reads it.
  function setup() {
    if (els) return;
    if (!window.matchMedia) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const disc = document.createElement('div');
    disc.className = 'globe-gallery-cursor-disc';
    document.body.appendChild(disc);

    const container = document.createElement('div');
    container.className = 'globe-gallery-cursor';
    container.innerHTML = `<div class="globe-gallery-cursor-ring-wrap">${RING_SVG}</div>`
      + '<div class="globe-gallery-cursor-text-wrap">'
      + '<span class="globe-gallery-cursor-text"></span>'
      + '</div>';
    document.body.appendChild(container);
    container.querySelector('.globe-gallery-cursor-text').textContent = labelText || 'Click & Drag';
    els = {
      container,
      disc,
      ring: container.querySelector('.globe-gallery-cursor-ring-wrap'),
      text: container.querySelector('.globe-gallery-cursor-text-wrap'),
    };

    const canvas = getCanvas();
    if (canvas) {
      canvas.addEventListener('mouseenter', onEnter);
      canvas.addEventListener('mouseleave', onLeave);
    }
    // Window-level so coords stay live if the pointer briefly leaves the canvas.
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('focusin', onSuppress);
    window.addEventListener('blur', onSuppress);
  }

  function update() {
    if (!els) return;
    const canvas = getCanvas();

    // Start the CSS fade when the signal flips; after RETIRE_FADE_MS drop `active` too,
    // handing the canvas cursor back to the system.
    const wantRetired = getCursorRetired();
    if (wantRetired !== (state.retireT0 >= 0)) {
      state.retireT0 = wantRetired ? now() : -1;
      els.container.classList.toggle('globe-gallery-cursor-retiring', wantRetired);
      els.disc.classList.toggle('globe-gallery-cursor-disc-retiring', wantRetired);
    }
    const faded = state.retireT0 >= 0 && now() - state.retireT0 >= RETIRE_FADE_MS;

    const wantActive = !getReducedMotion()
      && state.hasCoords
      && state.onCanvas
      && !state.suppressed
      && getSphereInteractive()
      && !getModalOpen()
      && !faded;
    if (wantActive !== state.active) {
      state.active = wantActive;
      els.container.classList.toggle('globe-gallery-cursor-active', state.active);
      els.disc.classList.toggle('globe-gallery-cursor-disc-active', state.active);
      // interaction.js defers to isActive().
      if (canvas) canvas.style.cursor = state.active ? 'none' : '';
    }
    const wantDismissed = getHintDismissed();
    if (wantDismissed !== state.hintDismissed) {
      state.hintDismissed = wantDismissed;
      els.container.classList.toggle('globe-gallery-cursor-hint-dismissed', state.hintDismissed);
    }
    const dragging = state.active && drag.isDragging;
    if (dragging !== state.dragging) {
      state.dragging = dragging;
      els.container.classList.toggle('globe-gallery-cursor-dragging', dragging);
      els.disc.classList.toggle('globe-gallery-cursor-disc-dragging', dragging);
    }
    if (!state.active) { state.wroteX = -1; state.wroteY = -1; return; }
    if (state.mx === state.wroteX && state.my === state.wroteY) return;
    state.wroteX = state.mx;
    state.wroteY = state.my;
    // top/left, not transform, keeps `transform` free for the CSS scale entrance.
    els.disc.style.left = `${state.mx}px`;
    els.disc.style.top = `${state.my}px`;
    els.ring.style.transform = `translate(${state.mx}px, ${state.my}px)`;
    els.text.style.transform = `translate(${state.mx + 32}px, ${state.my - 11}px)`;
  }

  function isActive() { return state.active; }

  function teardown() {
    const canvas = getCanvas();
    if (canvas) {
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.style.cursor = '';
    }
    window.removeEventListener('mousemove', onMove);
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

// Custom "Click & Drag" cursor for the globe (DI module). See README (Behavior notes).

// 48px disc centered on the pointer via the −24px viewBox origin.
const RING_SVG = [
  '<svg class="globe-gallery-cursor-ring" width="48" height="48" viewBox="-24 -24 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">',
  '<g class="globe-gallery-cursor-chevron-l"><polyline points="-8,-5 -13,0 -8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '<g class="globe-gallery-cursor-chevron-r"><polyline points="8,-5 13,0 8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '</svg>',
].join('');

// Must match the --retiring transition durations in globe-gallery.css.
const RETIRE_FADE_MS = 420;

export default function createCursor(deps) {
  const {
    getCanvas, getSphereInteractive, getModalOpen, getReducedMotion,
    getHintDismissed, getCursorRetired, labelText, drag,
  } = deps;
  let containerEl = null; // fixed container: chevrons + label (no blend mode)
  let discEl = null; // body-level disc (mix-blend-mode: difference)
  let ringWrap = null;
  let textWrap = null;
  let hasMouse = false; // device supports hover + fine pointer
  let onCanvas = false; // pointer currently over the globe canvas
  let suppressed = false; // keyboard focus / window blur took over; cleared on next mousemove
  let active = false; // cursor currently shown
  let hintDismissed = false; // label faded out after the user's first drag
  let retireT0 = -1; // retirement fade start timestamp; -1 = not retiring
  let mx = 0;
  let my = 0;

  const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now());

  function onMove(e) { mx = e.clientX; my = e.clientY; suppressed = false; }
  function onEnter() { onCanvas = true; }
  function onLeave() { onCanvas = false; }
  function onSuppress() { suppressed = true; }

  // Capability is read once. A device that gains/loses a fine pointer mid-session is out of scope
  // (a re-init re-reads it — e.g. an RM toggle; otherwise reload). See README (Behavior notes).
  function setup() {
    if (!window.matchMedia) return;
    hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasMouse) return;

    // Disc — direct body child so mix-blend-mode blends against real page content.
    discEl = document.createElement('div');
    discEl.className = 'globe-gallery-cursor-disc';
    document.body.appendChild(discEl);

    // Chevrons + label — no blend mode, safe inside the fixed container.
    containerEl = document.createElement('div');
    containerEl.className = 'globe-gallery-cursor';
    // Static structure via innerHTML; authored label set as textContent below.
    containerEl.innerHTML = `<div class="globe-gallery-cursor-ring-wrap">${RING_SVG}</div>`
      + '<div class="globe-gallery-cursor-text-wrap">'
      + '<span class="globe-gallery-cursor-text"></span>'
      + '</div>';
    document.body.appendChild(containerEl);
    ringWrap = containerEl.querySelector('.globe-gallery-cursor-ring-wrap');
    textWrap = containerEl.querySelector('.globe-gallery-cursor-text-wrap');
    containerEl.querySelector('.globe-gallery-cursor-text').textContent = labelText || 'Click & Drag';

    const canvas = getCanvas();
    if (canvas) {
      canvas.addEventListener('mouseenter', onEnter);
      canvas.addEventListener('mouseleave', onLeave);
    }
    // Window-level so coords stay live even if the pointer briefly leaves the canvas.
    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('focusin', onSuppress);
    window.addEventListener('blur', onSuppress);
  }

  // Per-frame: toggle shown/dragging/retiring state and follow the pointer. No-op on touch.
  function update() {
    if (!containerEl || !hasMouse) return;
    const canvas = getCanvas();

    // Retirement: start the CSS fade when the signal flips; after RETIRE_FADE_MS drop
    // `active` too, handing the canvas cursor back to the system.
    const wantRetired = getCursorRetired();
    if (wantRetired !== (retireT0 >= 0)) {
      retireT0 = wantRetired ? now() : -1;
      containerEl.classList.toggle('globe-gallery-cursor-retiring', wantRetired);
      if (discEl) discEl.classList.toggle('globe-gallery-cursor-disc-retiring', wantRetired);
    }
    const faded = retireT0 >= 0 && now() - retireT0 >= RETIRE_FADE_MS;

    const wantActive = !getReducedMotion()
      && onCanvas
      && !suppressed
      && getSphereInteractive()
      && !getModalOpen()
      && !faded;
    if (wantActive !== active) {
      active = wantActive;
      containerEl.classList.toggle('globe-gallery-cursor-active', active);
      if (discEl) discEl.classList.toggle('globe-gallery-cursor-disc-active', active);
      // Hide the system cursor while ours shows; interaction.js defers to isActive().
      if (canvas) canvas.style.cursor = active ? 'none' : '';
    }
    // One-way label dismissal: after the first drag the label fades (disc + chevrons stay).
    const wantDismissed = getHintDismissed();
    if (wantDismissed !== hintDismissed) {
      hintDismissed = wantDismissed;
      containerEl.classList.toggle('globe-gallery-cursor-hint-dismissed', hintDismissed);
    }
    // From `active` so going inactive mid-drag clears the squeeze rather than freezing it.
    const dragging = active && drag.isDragging;
    containerEl.classList.toggle('globe-gallery-cursor-dragging', dragging);
    if (discEl) discEl.classList.toggle('globe-gallery-cursor-disc-dragging', dragging);
    if (!active) return;
    if (discEl) {
      // top/left (not transform) keeps `transform` free for the CSS scale entrance.
      discEl.style.left = `${mx}px`;
      discEl.style.top = `${my}px`;
    }
    ringWrap.style.transform = `translate(${mx}px, ${my}px)`;
    textWrap.style.transform = `translate(${mx + 32}px, ${my - 11}px)`;
  }

  function isActive() { return active; }

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
    if (containerEl && containerEl.parentNode) containerEl.parentNode.removeChild(containerEl);
    if (discEl && discEl.parentNode) discEl.parentNode.removeChild(discEl);
    containerEl = null; discEl = null; ringWrap = null; textWrap = null;
    onCanvas = false; suppressed = false; active = false; hintDismissed = false; mx = 0; my = 0;
    retireT0 = -1;
  }

  return { setup, update, teardown, isActive };
}

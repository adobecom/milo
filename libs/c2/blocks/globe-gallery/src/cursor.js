/* ─────────────────────────────────────────────────────────────────────────
   Custom "Click & Drag" cursor for the globe — a DI module (createCursor(deps)).

   Desktop / hover-capable devices only (`(hover: hover) and (pointer: fine)`):
   over the interactive sphere, with no modal open, the system cursor is replaced
   by a white disc (mix-blend-mode: difference → inverts the page beneath it),
   flanked by two chevrons that squeeze inward while dragging, plus a small
   label. On touch / coarse-pointer devices setup() is a no-op, so
   nothing is created and update()/teardown() are inert.

   Two sibling DOM layers, both appended to <body> (not the block root): the disc
   MUST be a direct body child — mix-blend-mode only blends against real page
   content from outside a position:fixed (GPU-isolated) container. Multiple globes
   per page each create their own pair, but only the hovered one activates (one
   mouse), and inactive discs are visibility:hidden, so they don't collide.

   The label text is the authored hint string (deps.labelText, shared with the
   WebGL hint text; falls back to "Click & Drag"). Decorative — not exposed to
   assistive tech; the a11y widget covers the real affordance. It rides the same
   one-way dismissal as the WebGL hint: once deps.getHintDismissed() flips true
   (the user has dragged a little), the label fades out for good — matching the
   background text — while the disc + chevrons stay. Resets on scroll-out.

   Owns its DOM + listeners; teardown() removes them and clears the canvas cursor.
   isActive() lets the interaction module defer its hover cursor (pointer/default)
   to this one while the custom cursor is showing.
   ───────────────────────────────────────────────────────────────────────── */

// Disc geometry: 48px, centered on the pointer hot-point via a −24px margin.
const RING_SVG = [
  '<svg class="globe-gallery-cursor__ring" width="48" height="48" viewBox="-24 -24 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">',
  '<g class="globe-gallery-cursor__chevron-l"><polyline points="-8,-5 -13,0 -8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '<g class="globe-gallery-cursor__chevron-r"><polyline points="8,-5 13,0 8,5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g>',
  '</svg>',
].join('');

export default function createCursor(deps) {
  const {
    getCanvas, getSphereInteractive, getModalOpen, getReducedMotion,
    getHintDismissed, labelText, drag,
  } = deps;
  let containerEl = null; // fixed container: chevrons + label (no blend mode)
  let discEl = null; // body-level disc (mix-blend-mode: difference)
  let ringWrap = null;
  let textWrap = null;
  let hasMouse = false; // device supports hover + fine pointer
  let onCanvas = false; // pointer currently over the globe canvas
  let active = false; // cursor currently shown
  let hintDismissed = false; // label faded out after the user's first drag
  let mx = 0;
  let my = 0;

  function onMove(e) { mx = e.clientX; my = e.clientY; }
  function onEnter() { onCanvas = true; }
  function onLeave() { onCanvas = false; }

  function setup() {
    if (!window.matchMedia) return;
    hasMouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!hasMouse) return;

    // Disc — direct body child (see header note on mix-blend-mode).
    discEl = document.createElement('div');
    discEl.className = 'globe-gallery-cursor__disc';
    document.body.appendChild(discEl);

    // Chevrons + label — no blend mode, safe inside the fixed container.
    containerEl = document.createElement('div');
    containerEl.className = 'globe-gallery-cursor';
    // Static structure via innerHTML; the authored label is set as textContent
    // afterward (block convention — never interpolate authored copy into markup).
    containerEl.innerHTML = `<div class="globe-gallery-cursor__ring-wrap">${RING_SVG}</div>`
      + '<div class="globe-gallery-cursor__text-wrap">'
      + '<span class="globe-gallery-cursor__text"></span>'
      + '</div>';
    document.body.appendChild(containerEl);
    ringWrap = containerEl.querySelector('.globe-gallery-cursor__ring-wrap');
    textWrap = containerEl.querySelector('.globe-gallery-cursor__text-wrap');
    containerEl.querySelector('.globe-gallery-cursor__text').textContent = labelText || 'Click & Drag';

    const canvas = getCanvas();
    if (canvas) {
      canvas.addEventListener('mouseenter', onEnter);
      canvas.addEventListener('mouseleave', onLeave);
    }
    // Window-level so coords stay live even if the pointer briefly leaves the canvas.
    window.addEventListener('mousemove', onMove, { passive: true });
  }

  // Per-frame: toggle shown/dragging state and follow the pointer. No-op on touch
  // (containerEl is null) — and a no-op write is cheap, so it's safe to call every tick.
  function update() {
    if (!containerEl || !hasMouse) return;
    const canvas = getCanvas();
    const wantActive = !getReducedMotion()
      && onCanvas
      && getSphereInteractive()
      && !getModalOpen();
    if (wantActive !== active) {
      active = wantActive;
      containerEl.classList.toggle('globe-gallery-cursor--active', active);
      if (discEl) discEl.classList.toggle('globe-gallery-cursor__disc--active', active);
      // Hide the system cursor while ours shows; restore it otherwise. interaction.js
      // guards its own hover cursor writes on isActive() so the two don't fight.
      if (canvas) canvas.style.cursor = active ? 'none' : '';
    }
    // One-way label dismissal: once the user has dragged, the "Click & Drag" label
    // fades out (the disc + chevrons stay). Tracks the shared textExitProgress signal,
    // which resets on scroll-out, so the flag can flip back on re-entry.
    const wantDismissed = typeof getHintDismissed === 'function' && getHintDismissed();
    if (wantDismissed !== hintDismissed) {
      hintDismissed = wantDismissed;
      containerEl.classList.toggle('globe-gallery-cursor--hint-dismissed', hintDismissed);
    }
    if (!active) return;
    const dragging = drag.isDragging;
    containerEl.classList.toggle('globe-gallery-cursor--dragging', dragging);
    if (discEl) {
      discEl.classList.toggle('globe-gallery-cursor__disc--dragging', dragging);
      // top/left (not transform) keeps `transform` free for the CSS scale entrance.
      discEl.style.left = `${mx}px`;
      discEl.style.top = `${my}px`;
    }
    ringWrap.style.transform = `translate(${mx}px, ${my}px)`;
    // Label sits right of the disc edge (24px radius + 8px gap), vertically centered.
    textWrap.style.transform = `translate(${mx + 32}px, ${my - 8}px)`;
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
    if (containerEl && containerEl.parentNode) containerEl.parentNode.removeChild(containerEl);
    if (discEl && discEl.parentNode) discEl.parentNode.removeChild(discEl);
    containerEl = null; discEl = null; ringWrap = null; textWrap = null;
    onCanvas = false; active = false; hintDismissed = false; mx = 0; my = 0;
  }

  return { setup, update, teardown, isActive };
}

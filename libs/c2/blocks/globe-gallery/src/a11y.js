/* Keyboard gallery + projected focus ring for the globe.

   A parallel hidden DOM list of buttons mirrors each card on the globe:
   Tab/Shift+Tab moves through them; focusing a button drives the same WebGL
   hover state on the corresponding card (scale + warp — a visual cue for
   sighted keyboard users); Enter/Space opens the modal. Buttons are tabbable
   only while the sphere is interactive (≥ interactiveThreshold and no modal
   open), gated via an internal `interactive` flag so we only iterate when the
   state actually flips. A single focus-ring element tracks the projected
   bounding box of whichever card is focused.

   This is a DI factory: every piece of runtime state it needs (cards, camera,
   viewport, the live sphereFormT / modalIdx, card dimensions) is injected as a
   getter so the module holds no globe-specific state except its own DOM nodes.
   `openModal(i)` is injected so the gallery can open the modal without importing
   the modal code. The localized `galleryLabel` (region) + `cardLabel(name, index,
   count)` (per-button) are injected too, so this module owns no UI copy. Multi-
   instance safe — all lookups go through the injected root-scoped `q`. */
import * as THREE from '../three.module.min.js';

export default function createGalleryA11y({
  q,
  getCards,
  getCount,
  getCardMetadata,
  getCamera,
  getViewport,
  getSphereFormT,
  getModalIdx,
  interactiveThreshold,
  getCardDims,
  openModal,
  galleryLabel,
  cardLabel,
}) {
  let galleryBtns = null; // NodeList of buttons (set in setup)
  let interactive = false; // current tabbable state of the gallery buttons
  let focusRingEl = null; // DOM element positioned each frame to the focused card
  let focusedCardIdx = -1;
  // Pool of corner Vector3s for projection (avoid per-frame allocation).
  let ringCorners = null;
  let ringTmpVec = null;

  // Build the hidden focusable button list that mirrors the cards on the globe.
  // Called after buildCards() once card metadata is available. tabindex stays
  // -1 until the sphere is interactive — see updateTabStops().
  function setup() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas || !canvas.parentNode) return;

    // Remove existing on re-init so we don't double up.
    const existing = q('.globe-gallery-a11y');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    const container = document.createElement('div');
    container.id = 'globe-gallery-a11y';
    container.className = 'globe-gallery-a11y';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', galleryLabel);

    const list = document.createElement('ul');
    list.className = 'globe-gallery-a11y__list';

    const count = getCount();

    // Wire one gallery button's focus/blur/click handlers. Defined outside the
    // build loop so the listeners aren't re-created per iteration (no-loop-func)
    // while still closing over the live runtime state (focusedCardIdx, etc.).
    function attachGalleryButton(idx, btnEl) {
      btnEl.addEventListener('focus', () => {
        // Drive the WebGL hover state on the focused card; clear the rest so
        // there's only ever one hover at a time (matches mouse behavior).
        const cards = getCards();
        for (let ci = 0; ci < cards.length; ci += 1) {
          cards[ci].hoverTarget = (ci === idx ? 1 : 0);
        }
        // Only show the projected focus ring for keyboard focus (matches
        // :focus-visible behavior in CSS — mouse clicks shouldn't display it).
        focusedCardIdx = idx;
        if (focusRingEl && btnEl.matches(':focus-visible')) {
          focusRingEl.classList.add('is-visible');
        }
      });
      btnEl.addEventListener('blur', () => {
        const cards = getCards();
        if (cards[idx]) cards[idx].hoverTarget = 0;
        if (focusedCardIdx === idx) focusedCardIdx = -1;
        if (focusRingEl) focusRingEl.classList.remove('is-visible');
      });
      btnEl.addEventListener('click', () => {
        if (getModalIdx() >= 0) return;
        if (getSphereFormT() < interactiveThreshold) return;
        // openModal closes over the runtime's viewport center as the click
        // origin (we don't have a pointer position from keyboard).
        openModal(idx);
      });
    }

    for (let i = 0; i < count; i += 1) {
      const meta = getCardMetadata(i);
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-gallery-a11y__btn';
      const label = cardLabel(meta.name, i + 1, count);
      btn.setAttribute('aria-label', label);
      btn.dataset.cardIdx = String(i);
      btn.tabIndex = -1; // off until the sphere is interactive
      btn.textContent = label;

      attachGalleryButton(i, btn);

      li.appendChild(btn);
      list.appendChild(li);
    }

    container.appendChild(list);
    canvas.parentNode.appendChild(container);
    galleryBtns = container.querySelectorAll('.globe-gallery-a11y__btn');
    interactive = false;

    // Single focus-ring element that tracks the projected bounding box of
    // whichever card is currently focused. position:fixed so it's relative to
    // the viewport, sized + rounded per-frame in updateFocusRing().
    if (!focusRingEl) {
      focusRingEl = document.createElement('div');
      focusRingEl.className = 'globe-gallery-a11y__focus-ring';
      focusRingEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(focusRingEl);
    }
    // Pre-allocate projection scratch (4 corners + 1 tmp) — reused each frame
    // so the focus-ring update doesn't allocate.
    if (!ringCorners) {
      ringCorners = [
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ];
      ringTmpVec = new THREE.Vector3();
    }
    focusedCardIdx = -1;
  }

  // Enable / disable gallery button tab-stops based on whether the sphere is
  // currently interactive. Only iterates when the state flips (not every frame),
  // so it's effectively free at idle.
  function updateTabStops(sphereFormT) {
    if (!galleryBtns) return;
    const wantInteractive = (sphereFormT >= interactiveThreshold) && (getModalIdx() < 0);
    if (wantInteractive === interactive) return;
    interactive = wantInteractive;
    for (let ga = 0; ga < galleryBtns.length; ga += 1) {
      galleryBtns[ga].tabIndex = wantInteractive ? 0 : -1;
    }
  }

  // Focus ring projection. If a gallery button is focused (via :focus-visible),
  // project the focused card's 4 corners to screen space, compute the bounding
  // box, and position the ring DOM element to match. Border-radius scales with
  // the card's projected height (the sphere card's texture-baked rounded corners
  // do the same).
  function updateFocusRing() {
    const cards = getCards();
    if (focusRingEl && focusedCardIdx >= 0 && focusedCardIdx < cards.length
        && focusRingEl.classList.contains('is-visible') && ringCorners) {
      const fmesh = cards[focusedCardIdx].mesh;
      if (fmesh && fmesh.visible) {
        const camera = getCamera();
        const { W, H } = getViewport();
        const { w: cardW, h: cardH } = getCardDims();
        fmesh.updateMatrixWorld(true);
        const halfWRing = cardW * 0.5;
        const halfHRing = cardH * 0.5;
        ringCorners[0].set(-halfWRing, -halfHRing, 0);
        ringCorners[1].set(halfWRing, -halfHRing, 0);
        ringCorners[2].set(halfWRing, halfHRing, 0);
        ringCorners[3].set(-halfWRing, halfHRing, 0);
        let fMinX = Infinity; let fMinY = Infinity; let fMaxX = -Infinity; let
          fMaxY = -Infinity;
        for (let rc = 0; rc < 4; rc += 1) {
          ringTmpVec.copy(ringCorners[rc]).applyMatrix4(fmesh.matrixWorld).project(camera);
          const sx = (ringTmpVec.x + 1) * 0.5 * W;
          const sy = (1 - ringTmpVec.y) * 0.5 * H;
          if (sx < fMinX) fMinX = sx;
          if (sy < fMinY) fMinY = sy;
          if (sx > fMaxX) fMaxX = sx;
          if (sy > fMaxY) fMaxY = sy;
        }
        const ringW = Math.max(0, fMaxX - fMinX);
        const ringH = Math.max(0, fMaxY - fMinY);
        focusRingEl.style.left = `${Math.round(fMinX)}px`;
        focusRingEl.style.top = `${Math.round(fMinY)}px`;
        focusRingEl.style.width = `${Math.round(ringW)}px`;
        focusRingEl.style.height = `${Math.round(ringH)}px`;
        // Match the card's texture-baked corner radius (22/631 of card height).
        focusRingEl.style.borderRadius = `${Math.round((ringH * 22) / 631)}px`;
      }
    }
  }

  // Remove the gallery DOM + focus ring and reset state so a fresh setup()
  // (e.g. after a breakpoint-crossing re-init) starts clean.
  function teardown() {
    const galleryEl = q('.globe-gallery-a11y');
    if (galleryEl && galleryEl.parentNode) galleryEl.parentNode.removeChild(galleryEl);
    if (focusRingEl && focusRingEl.parentNode) focusRingEl.parentNode.removeChild(focusRingEl);
    galleryBtns = null;
    interactive = false;
    focusRingEl = null;
    focusedCardIdx = -1;
    ringCorners = null;
    ringTmpVec = null;
  }

  return { setup, updateTabStops, updateFocusRing, teardown };
}

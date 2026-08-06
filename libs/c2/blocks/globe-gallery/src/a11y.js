/* Keyboard + screen-reader entry point for the globe — a DI module.

   The globe is exposed to assistive tech as a TWO-LEVEL gallery, not the modal carousel:

     1. COLLAPSED — a single tab stop (a transparent <button> over the sphere). It's a
        stable stop so the block is never skipped; Tab past it goes to the next page
        element. Enter/Space ENTERS the gallery.
     2. BROWSE — focus moves into a list of per-image buttons (one per card). Tab /
        Shift+Tab walks image→image; each announces that image's alt text (authored alt →
        `alt text to be authored` placeholder when none). On focus the globe rotates that
        image to screen centre (injected `centerCard`) and a centred focus ring traces it.
        Enter on an image opens the detail modal for THAT image (injected `openCard`).
        Esc — or tabbing out of the list either end — collapses back to the single entry stop.

   Both the entry button and the per-image buttons are real <button>s (native focus +
   Enter/Space activation) so sighted keyboard users get a :focus-visible ring; all are
   pointer-events:none so they never intercept mouse drag on the canvas beneath.

   The per-image buttons only join the tab order while ENTERED (roving via tabIndex), and
   the whole widget drops out of the tab order while the modal traps focus. Focusing the
   entry button calls the injected `onFocus`, which snaps the page to the globe's
   interactive scroll offset (pdf-space pattern) so tabbing INTO the block forms the sphere
   and brings it into view before the ring shows; each image focus re-snaps the same way.
   Arrow/Enter actions are gated on the sphere actually being formed (isInteractive) to
   cover the frame between focus and the snap settling.

   DI factory: every piece of runtime state it needs (count, sphereFormT, modalIdx, the
   per-image label) is injected as a getter, and the actions it triggers (centerCard,
   openCard, onFocus) are injected callbacks, so this module holds no globe state except
   its own DOM nodes and imports neither the core nor the modal. `galleryInstructions` is the
   entry button's operating copy, shown as a VISIBLE popup on focus AND wired as the button's
   accessible NAME via `aria-labelledby` (one element, both audiences) — so a screen reader
   announces exactly the on-page instruction with no separate/redundant label (a11y audit).
   Multi-instance safe — all lookups go through the injected root-scoped `q`, and the
   labelledby id is suffixed with the instance `gid`. */

export default function createGalleryA11y({
  q,
  getCount,
  getSphereFormT,
  getModalIdx,
  interactiveThreshold,
  getCardLabel,
  centerCard,
  openCard,
  onFocus,
  galleryInstructions,
  gid,
}) {
  let widgetEl = null; // the collapsed entry button (single tab stop)
  let cardsEl = null; // container holding the per-image browse buttons
  let cardButtons = []; // the per-image buttons (tab order only while entered)
  let entered = false; // true while in BROWSE mode (image list is the tab order)
  let focusedIdx = -1; // index of the currently-focused browse image, -1 if none
  // Last-applied tab state, so updateTabStops() only touches the DOM on a real change.
  let appliedModalOpen = null;
  let appliedEntered = null;

  // Whether the globe can be activated/entered right now (sphere formed + no modal).
  function isInteractive() {
    return getSphereFormT() >= interactiveThreshold && getModalIdx() < 0;
  }

  // BROWSE → COLLAPSED. Pull the image list out of the tab order and restore the single
  // entry stop (unless the modal currently traps focus). Does not move focus by itself.
  function collapse() {
    entered = false;
    focusedIdx = -1;
    cardButtons.forEach((btn) => { btn.tabIndex = -1; });
    if (widgetEl) widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;
  }

  // Per-image button handlers. Defined here (not inline in the setup loop) so they don't
  // close over the mutable focusedIdx / widgetEl per button; each reads its own index from
  // the element's dataset. Focus → centre this image + snap into view; blur → clear the ring
  // target (a card→card tab re-sets it synchronously, so no flicker; a blur into the modal
  // leaves it -1); Esc → collapse back to the single entry stop.
  function onCardFocus(e) {
    focusedIdx = Number(e.currentTarget.dataset.idx);
    centerCard(focusedIdx);
    onFocus();
  }
  function onCardBlur(e) {
    if (focusedIdx === Number(e.currentTarget.dataset.idx)) focusedIdx = -1;
  }
  function onCardClick(e) {
    if (isInteractive()) openCard(Number(e.currentTarget.dataset.idx));
  }
  function onCardKeydown(e) {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    collapse();
    if (widgetEl) widgetEl.focus();
  }

  // COLLAPSED → BROWSE. Only from the formed, modal-free globe. Make the images the tab
  // order, drop the entry stop, and move focus to the first image (which centres it).
  function enterBrowse() {
    if (!isInteractive() || !cardButtons.length) return;
    entered = true;
    if (widgetEl) widgetEl.tabIndex = -1;
    cardButtons.forEach((btn) => { btn.tabIndex = 0; });
    cardButtons[0].focus();
  }

  // Build the entry button + the per-image browse list. Called after buildCards() so
  // getCount() is final. Rebuilt cleanly on re-init (teardown removes the old nodes).
  function setup() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas || !canvas.parentNode) return;
    const parent = canvas.parentNode;

    // Remove any existing nodes on re-init so we don't double up.
    ['.globe-gallery-a11y', '.globe-gallery-a11y-cards'].forEach((sel) => {
      const existing = q(sel);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    });

    // ── Entry button (collapsed state) ──
    widgetEl = document.createElement('button');
    widgetEl.type = 'button';
    widgetEl.className = 'globe-gallery-a11y';
    widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;

    // Operating instructions, serving BOTH audiences from ONE element (per a11y audit): a
    // VISIBLE popup (CSS shows `.globe-gallery-a11y-tip` on the button's :focus-visible) so
    // sighted keyboard users see "press Enter to enter the gallery", and simultaneously the
    // button's aria-labelledby target so a screen reader announces the SAME on-page text as
    // the button's accessible NAME (aria-labelledby reads the referenced node even while it's
    // visually hidden). There is no separate label — this copy IS the name, so nothing
    // redundant (an "interactive image gallery, N images" prefix) is announced. Child of the
    // button, so it's removed on teardown; the gid keeps the id unique per instance.
    // TODO: `galleryInstructions` is currently a hardcoded English fallback (see
    // resolveGlobeLabels in globe-gallery.js) — localize once the placeholder key is authored.
    if (galleryInstructions) {
      const descEl = document.createElement('span');
      descEl.className = 'globe-gallery-a11y-tip';
      descEl.id = `globe-gallery-a11y-desc-${gid}`;
      descEl.textContent = galleryInstructions;
      widgetEl.appendChild(descEl);
      widgetEl.setAttribute('aria-labelledby', descEl.id);
    }

    // Focusing the globe snaps the page to its interactive (formed-sphere) scroll position
    // — like pdf-space, so tabbing INTO the block brings it to the globe state rather than
    // skipping it, and the focus ring never shows over an out-of-view block.
    widgetEl.addEventListener('focus', () => { onFocus(); });
    // Enter/Space (native button activation) → enter the gallery (browse the images).
    widgetEl.addEventListener('click', () => { enterBrowse(); });

    // ── Per-image browse buttons (browse state) ──
    cardsEl = document.createElement('div');
    cardsEl.className = 'globe-gallery-a11y-cards';
    const count = getCount();
    cardButtons = [];
    for (let i = 0; i < count; i += 1) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-gallery-a11y-card';
      btn.tabIndex = -1; // joins the tab order only while entered
      btn.dataset.idx = String(i);
      btn.setAttribute('aria-label', getCardLabel(i));
      btn.addEventListener('focus', onCardFocus);
      btn.addEventListener('blur', onCardBlur);
      btn.addEventListener('click', onCardClick);
      btn.addEventListener('keydown', onCardKeydown);
      cardButtons.push(btn);
      cardsEl.appendChild(btn);
    }

    // Auto-collapse when focus leaves the image list (tab past the last / shift-tab before
    // the first / click away). Skip while the modal is open — Enter-on-image moves focus
    // into the modal chrome (modalIdx already ≥0), and we must stay entered so focus
    // returns to the image on close.
    cardsEl.addEventListener('focusout', (e) => {
      if (!entered || getModalIdx() >= 0) return;
      if (!e.relatedTarget && !document.hasFocus()) return;
      if (!e.relatedTarget || !cardsEl.contains(e.relatedTarget)) collapse();
    });

    parent.appendChild(widgetEl);
    parent.appendChild(cardsEl);
    entered = false;
    appliedModalOpen = null;
    appliedEntered = null;
  }

  // Keep the tab order in sync with (modalOpen, entered): modal open → nothing in the
  // widget is tabbable (focus trapped in the dialog); else entered → the images are the
  // tab stops; else → the single entry button. Only touches the DOM when the state flips.
  function updateTabStops() {
    if (!widgetEl) return;
    const modalOpen = getModalIdx() >= 0;
    if (modalOpen === appliedModalOpen && entered === appliedEntered) return;
    appliedModalOpen = modalOpen;
    appliedEntered = entered;
    if (modalOpen) {
      widgetEl.tabIndex = -1;
      cardButtons.forEach((btn) => { btn.tabIndex = -1; });
    } else if (entered) {
      widgetEl.tabIndex = -1;
      cardButtons.forEach((btn) => { btn.tabIndex = 0; });
    } else {
      widgetEl.tabIndex = 0;
      cardButtons.forEach((btn) => { btn.tabIndex = -1; });
    }
  }

  // True while browsing the image list — the core reads this to pause auto-spin so the
  // globe holds the centred image instead of drifting.
  function isBrowsing() {
    return entered;
  }

  function focusCard(idx) {
    if (!entered) return;
    const btn = cardButtons[idx];
    if (btn) btn.focus();
  }

  // The image the focus ring should trace, -1 if none. The core projects this card each
  // frame and calls setFocusRect so the ring hugs the (moving) image, not a fixed box.
  function getFocusedIdx() {
    return focusedIdx;
  }

  // Position + size the focused image's button to a screen-space rect (px, centred on
  // cx/cy) computed by the core from the card's live projection, so the :focus-visible ring
  // traces the actual image as the globe rotates it to centre. Radius follows the height so
  // the ring's rounded corners roughly match the card's.
  function setFocusRect(cx, cy, w, h) {
    const btn = cardButtons[focusedIdx];
    if (!btn) return;
    btn.style.left = `${cx}px`;
    btn.style.top = `${cy}px`;
    btn.style.width = `${w}px`;
    btn.style.height = `${h}px`;
    btn.style.borderRadius = `${h * 0.035}px`;
  }

  // Remove the nodes and reset state so a fresh setup() (e.g. after a breakpoint-crossing
  // re-init) starts clean.
  function teardown() {
    [widgetEl, cardsEl].forEach((node) => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    widgetEl = null;
    cardsEl = null;
    cardButtons = [];
    entered = false;
    focusedIdx = -1;
    appliedModalOpen = null;
    appliedEntered = null;
  }

  return {
    setup, updateTabStops, teardown, isBrowsing, getFocusedIdx, setFocusRect, focusCard,
  };
}

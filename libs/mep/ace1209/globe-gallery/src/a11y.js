// Keyboard + screen-reader gallery for the globe (DI module). See README (Accessibility).

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
  let widgetEl = null; // collapsed entry button (single tab stop)
  let cardsEl = null; // container for the per-image browse buttons
  let cardButtons = []; // per-image buttons (tab order only while entered)
  let entered = false; // true while in BROWSE mode
  let focusedIdx = -1; // currently-focused browse image, -1 if none
  // Last-applied tab state, so updateTabStops() only writes on a real change.
  let appliedModalOpen = null;
  let appliedEntered = null;

  function resetAppliedTabState() {
    appliedModalOpen = null;
    appliedEntered = null;
  }

  // Sphere formed + no modal open.
  function isInteractive() {
    return getSphereFormT() >= interactiveThreshold && getModalIdx() < 0;
  }

  // BROWSE → COLLAPSED. Does not move focus by itself.
  function collapse() {
    entered = false;
    focusedIdx = -1;
    cardButtons.forEach((btn) => { btn.tabIndex = -1; });
    if (widgetEl) widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;
  }

  // Shared handlers (not per-button closures); each reads its index from dataset.idx.
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

  // COLLAPSED → BROWSE. Only from the formed, modal-free globe.
  function enterBrowse() {
    if (!isInteractive() || !cardButtons.length) return;
    entered = true;
    if (widgetEl) widgetEl.tabIndex = -1;
    cardButtons.forEach((btn) => { btn.tabIndex = 0; });
    cardButtons[0].focus();
  }

  // Build the entry button + browse list. Call after buildCards() so getCount() is final.
  function setup() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas || !canvas.parentNode) return;
    const parent = canvas.parentNode;

    // Remove any existing nodes on re-init so we don't double up.
    ['.globe-gallery-a11y', '.globe-gallery-a11y-cards'].forEach((sel) => {
      const existing = q(sel);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    });

    widgetEl = document.createElement('button');
    widgetEl.type = 'button';
    widgetEl.className = 'globe-gallery-a11y';
    widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;

    // Instructions serve both audiences from one element: visible :focus-visible popup and
    // the button's aria-labelledby name. See README (Accessibility).
    // galleryInstructions is authored inline (row 2, 2nd <p>) with an English code fallback,
    // so it's always set here. See authoring.js / README (Localization).
    if (galleryInstructions) {
      const descEl = document.createElement('span');
      descEl.className = 'globe-gallery-a11y-tip';
      descEl.id = `globe-gallery-a11y-desc-${gid}`;
      descEl.textContent = galleryInstructions;
      widgetEl.appendChild(descEl);
      widgetEl.setAttribute('aria-labelledby', descEl.id);
    }

    // Focus snaps the page to the interactive scroll position (forms + reveals the globe).
    widgetEl.addEventListener('focus', () => { onFocus(); });
    widgetEl.addEventListener('click', () => { enterBrowse(); });

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

    // Auto-collapse when focus leaves the image list. Skip while the modal is open (stay
    // entered so focus returns to the image on close).
    cardsEl.addEventListener('focusout', (e) => {
      if (!entered || getModalIdx() >= 0) return;
      if (!e.relatedTarget && !document.hasFocus()) return;
      if (!e.relatedTarget || !cardsEl.contains(e.relatedTarget)) collapse();
    });

    parent.appendChild(widgetEl);
    parent.appendChild(cardsEl);
    entered = false;
    resetAppliedTabState();
  }

  // Sync tab order with (modalOpen, entered). Only writes the DOM when the state flips.
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

  // The core reads this to pause auto-spin so the globe holds the centred image.
  function isBrowsing() {
    return entered;
  }

  function focusCard(idx) {
    if (!entered) return;
    const btn = cardButtons[idx];
    if (btn) btn.focus();
  }

  // The image the focus ring should trace, -1 if none.
  function getFocusedIdx() {
    return focusedIdx;
  }

  // Position + size the focused button to a screen-space rect so the ring tracks the image.
  function setFocusRect(cx, cy, w, h) {
    const btn = cardButtons[focusedIdx];
    if (!btn) return;
    btn.style.left = `${cx}px`;
    btn.style.top = `${cy}px`;
    btn.style.width = `${w}px`;
    btn.style.height = `${h}px`;
    btn.style.borderRadius = `${h * 0.035}px`;
  }

  function teardown() {
    [widgetEl, cardsEl].forEach((node) => {
      if (node && node.parentNode) node.parentNode.removeChild(node);
    });
    widgetEl = null;
    cardsEl = null;
    cardButtons = [];
    entered = false;
    focusedIdx = -1;
    resetAppliedTabState();
  }

  return {
    setup, updateTabStops, teardown, isBrowsing, getFocusedIdx, setFocusRect, focusCard,
  };
}

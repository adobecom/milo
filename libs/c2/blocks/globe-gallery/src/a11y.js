// Keyboard + screen-reader gallery for the globe.

// Uniform, never per card. Each `-`-separated segment must stay within 20 chars or Milo
// truncates it.
const CARD_OPEN_DAA_LL = 'card_open--globe_gallery';
const ENTER_GALLERY_DAA_LL = 'enter_gallery_kbd--globe_gallery';

export default function createGalleryA11y({
  q,
  getCount,
  cardOrder,
  getModalIdx,
  isGlobeFormed,
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
  // Last-applied tab state; updateTabStops() only writes on a real change.
  let appliedModalOpen = null;
  let appliedEntered = null;

  function resetAppliedTabState() {
    appliedModalOpen = null;
    appliedEntered = null;
  }

  function setBrowseActive(active) {
    if (cardsEl) cardsEl.inert = !active;
  }

  function collapse() {
    entered = false;
    focusedIdx = -1;
    setBrowseActive(false);
    if (widgetEl) widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;
  }

  // Shared, not per-button closures; each reads its index from dataset.idx.
  function onCardFocus(e) {
    focusedIdx = Number(e.currentTarget.dataset.idx);
    centerCard(focusedIdx);
    onFocus();
  }
  function onCardBlur(e) {
    if (focusedIdx === Number(e.currentTarget.dataset.idx)) focusedIdx = -1;
  }
  function onCardClick(e) {
    // Untrusted = synthesized by trackCardOpen(), report-only.
    if (!e.isTrusted) return;
    if (isGlobeFormed()) openCard(Number(e.currentTarget.dataset.idx));
  }
  function onCardKeydown(e) {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    collapse();
    if (widgetEl) widgetEl.focus();
  }

  function enterBrowse() {
    if (!isGlobeFormed() || !cardButtons.length) return;
    entered = true;
    if (widgetEl) widgetEl.tabIndex = -1;
    setBrowseActive(true);
    cardButtons[cardOrder[0]].focus();
  }

  // Call after buildCards() so getCount() is final.
  function setup() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas || !canvas.parentNode) return;
    const parent = canvas.parentNode;

    // Remove existing nodes on re-init so we don't double up.
    ['.globe-gallery-a11y', '.globe-gallery-a11y-cards'].forEach((sel) => {
      const existing = q(sel);
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
    });

    widgetEl = document.createElement('button');
    widgetEl.type = 'button';
    widgetEl.className = 'globe-gallery-a11y';
    widgetEl.setAttribute('daa-ll', ENTER_GALLERY_DAA_LL);
    widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;

    // One element serves both the visible :focus-visible popup and the aria-labelledby name.
    if (galleryInstructions) {
      const descEl = document.createElement('span');
      descEl.className = 'globe-gallery-a11y-tip';
      descEl.id = `globe-gallery-a11y-desc-${gid}`;
      descEl.textContent = galleryInstructions;
      descEl.setAttribute('aria-hidden', 'true');
      widgetEl.appendChild(descEl);
      widgetEl.setAttribute('aria-labelledby', descEl.id);
    }

    widgetEl.addEventListener('focus', () => { onFocus(); });
    widgetEl.addEventListener('click', () => { enterBrowse(); });

    cardsEl = document.createElement('div');
    cardsEl.className = 'globe-gallery-a11y-cards';
    cardsEl.inert = true;
    const count = getCount();
    cardButtons = [];
    for (let n = 0; n < count; n += 1) {
      const i = cardOrder[n];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'globe-gallery-a11y-card';
      btn.dataset.idx = String(i);
      btn.setAttribute('daa-ll', CARD_OPEN_DAA_LL);
      btn.setAttribute('aria-label', getCardLabel(i));
      btn.addEventListener('focus', onCardFocus);
      btn.addEventListener('blur', onCardBlur);
      btn.addEventListener('click', onCardClick);
      btn.addEventListener('keydown', onCardKeydown);
      cardButtons[i] = btn;
      cardsEl.appendChild(btn);
    }

    // Skip while the modal is open, so focus returns to the image on close.
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

  // Only writes the DOM when (modalOpen, entered) flips.
  function updateTabStops() {
    if (!widgetEl) return;
    const modalOpen = getModalIdx() >= 0;
    if (modalOpen === appliedModalOpen && entered === appliedEntered) return;
    appliedModalOpen = modalOpen;
    appliedEntered = entered;
    widgetEl.tabIndex = !modalOpen && !entered ? 0 : -1;
    setBrowseActive(!modalOpen && entered);
  }

  // The core reads this to pause auto-spin so the globe holds the centred image.
  function isBrowsing() {
    return entered;
  }

  function focusCard(idx) {
    if (!entered) return;
    const btn = cardButtons[idx];
    if (!btn) return;
    setBrowseActive(true);
    btn.focus();
  }

  // Report a canvas card open by clicking that card's button.
  function trackCardOpen(idx) {
    const btn = cardButtons[idx];
    if (!btn || !cardsEl) return;
    const wasInert = cardsEl.inert;
    cardsEl.inert = false;
    btn.click();
    cardsEl.inert = wasInert;
  }

  function getFocusedIdx() {
    return focusedIdx;
  }

  // Size the focused button to a screen-space rect so the ring tracks the image.
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
    setup,
    updateTabStops,
    teardown,
    isBrowsing,
    getFocusedIdx,
    setFocusRect,
    focusCard,
    trackCardOpen,
  };
}

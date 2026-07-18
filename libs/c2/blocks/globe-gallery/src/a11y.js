/* Keyboard + screen-reader entry point for the globe — a DI module.

   The globe is exposed to assistive tech as ONE widget (a single tab stop), not a
   per-card list: Tab selects the globe, Left/Right arrows spin it, Enter/Space opens
   "carousel mode" (the card-detail modal) at the first item. This mirrors a
   gallery/carousel pattern — the modal owns the in-carousel keyboard model (arrow
   traverse, Tab→close, Esc/Enter-close exit; see modal.js).

   The widget is a real <button> (native focus + Enter/Space → click activation) sized
   over the sphere region so sighted keyboard users get a :focus-visible ring; it's
   pointer-events:none so it never intercepts mouse drag on the canvas beneath.

   It's a STABLE tab stop — always in the tab order (except while the modal traps focus)
   so the block is never skipped, regardless of scroll position. On focus it calls the
   injected `onFocus` which snaps the page to the globe's interactive scroll offset
   (pdf-space pattern): this both forms the sphere and brings the block into view, so the
   focus ring never appears over an out-of-view block. Arrow/Enter actions are still
   gated on the sphere actually being formed (isInteractive) to cover the frame between
   focus and the snap settling.

   DI factory: every piece of runtime state it needs (count, the live sphereFormT /
   modalIdx) is injected as a getter, and the actions it triggers (spinGlobe, openModal,
   onFocus) are injected callbacks, so this module holds no globe state except its own
   DOM node and imports neither the core nor the modal. The localized `galleryLabel` is the
   widget's concise accessible NAME (announced on every focus); `galleryInstructions` is
   the how-to-drive-it DESCRIPTION, wired via a visually-hidden `aria-describedby` child
   (announced once) so the name stays terse. Multi-instance safe — all lookups go through
   the injected root-scoped `q`, and the describedby id is suffixed with the instance `gid`. */

export default function createGalleryA11y({
  q,
  getCount,
  getSphereFormT,
  getModalIdx,
  interactiveThreshold,
  spinGlobe,
  openModal,
  onFocus,
  galleryLabel,
  galleryInstructions,
  gid,
}) {
  let widgetEl = null; // the single focusable globe widget (button)
  let tabbable = true; // current tab-order state (false only while modal traps focus)

  // Whether the globe can be activated/spun right now (sphere formed + no modal).
  function isInteractive() {
    return getSphereFormT() >= interactiveThreshold && getModalIdx() < 0;
  }

  // Build the single globe widget. Called after buildCards() so getCount() is final.
  function setup() {
    const canvas = q('.globe-gallery-canvas');
    if (!canvas || !canvas.parentNode) return;

    // Remove an existing widget on re-init so we don't double up.
    const existing = q('.globe-gallery-a11y');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    widgetEl = document.createElement('button');
    widgetEl.type = 'button';
    widgetEl.className = 'globe-gallery-a11y';
    widgetEl.setAttribute('aria-label', galleryLabel(getCount()));
    widgetEl.tabIndex = getModalIdx() < 0 ? 0 : -1;

    // Operating instructions as the widget's DESCRIPTION (announced once), kept out of
    // the concise aria-label NAME (announced on every focus). A visually-hidden child so
    // it's removed with the widget on teardown; the gid keeps the id unique per instance
    // (aria-describedby resolves a descendant id fine). Skipped if no instructions given.
    if (galleryInstructions) {
      const descEl = document.createElement('span');
      descEl.className = 'globe-gallery-sr-only';
      descEl.id = `globe-gallery-a11y-desc-${gid}`;
      descEl.textContent = galleryInstructions;
      widgetEl.appendChild(descEl);
      widgetEl.setAttribute('aria-describedby', descEl.id);
    }

    // Focusing the globe snaps the page to its interactive (formed-sphere) scroll
    // position — like pdf-space, so tabbing INTO the block brings it to the globe state
    // rather than skipping it, and the focus ring never shows over an out-of-view block.
    widgetEl.addEventListener('focus', () => { onFocus(); });

    // Enter/Space (native button activation) → open carousel mode at the first item.
    widgetEl.addEventListener('click', () => {
      if (!isInteractive()) return;
      openModal();
    });

    // Left/Right arrows spin the globe; preventDefault so the page doesn't also act
    // on them (they don't scroll, but a focused button + custom keys should own them).
    widgetEl.addEventListener('keydown', (e) => {
      if (!isInteractive()) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); spinGlobe(-1); } else if (e.key === 'ArrowRight') { e.preventDefault(); spinGlobe(1); }
    });

    canvas.parentNode.appendChild(widgetEl);
    tabbable = true;
  }

  // Keep the widget OUT of the tab order only while the modal is open (so focus stays
  // trapped in carousel mode and can't land on the globe behind it). Otherwise it's a
  // permanent tab stop. Only touches the DOM when the state flips — free at idle.
  function updateTabStops() {
    if (!widgetEl) return;
    const wantTabbable = getModalIdx() < 0;
    if (wantTabbable === tabbable) return;
    tabbable = wantTabbable;
    widgetEl.tabIndex = wantTabbable ? 0 : -1;
  }

  // Remove the widget and reset state so a fresh setup() (e.g. after a breakpoint-crossing
  // re-init) starts clean.
  function teardown() {
    if (widgetEl && widgetEl.parentNode) widgetEl.parentNode.removeChild(widgetEl);
    widgetEl = null;
    tabbable = true;
  }

  return { setup, updateTabStops, teardown };
}

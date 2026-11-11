// On-canvas globe chrome: auto-spin play/pause + the barrel's rotate row.
const SPIN_DAA_PAUSE = 'pause_spin--globe_gallery';
const SPIN_DAA_RESUME = 'resume_spin--globe_gallery';

export default function createGlobeControls({ q, labels, getVisible, getHintDismissed, rotate }) {
  let layerEl = null;
  let spinBtn = null;
  let hintEl = null;
  let rotateBtns = [];
  let paused = false; // survives breakpoint rebuilds — the closure outlives them
  let appliedVisible = null; // last-written class state; update() only writes on a flip
  let appliedDismissed = null;

  function renderSpinState() {
    if (!spinBtn) return;
    spinBtn.setAttribute('aria-label', paused ? labels.resumeSpin : labels.pauseSpin);
    spinBtn.setAttribute('daa-ll', paused ? SPIN_DAA_RESUME : SPIN_DAA_PAUSE);
    spinBtn.classList.toggle('is-paused', paused);
  }

  function onSpinClick() {
    paused = !paused;
    renderSpinState();
  }

  function onRotateClick(e) {
    rotate(Number(e.currentTarget.dataset.dir));
  }

  function setup() {
    layerEl = q('.globe-gallery-controls');
    if (!layerEl) return;
    // Tab order, not layout: must land AFTER a11y.setup's nodes.
    layerEl.parentNode?.appendChild(layerEl);
    spinBtn = layerEl.querySelector('.globe-gallery-spin-toggle');
    hintEl = layerEl.querySelector('.globe-gallery-hint');
    rotateBtns = [...layerEl.querySelectorAll('.globe-gallery-rotate')];
    spinBtn?.addEventListener('click', onSpinClick);
    rotateBtns.forEach((btn) => btn.addEventListener('click', onRotateClick));
    appliedVisible = null;
    appliedDismissed = null;
    renderSpinState();
  }

  function update() {
    if (!layerEl) return;
    const visible = getVisible();
    if (visible !== appliedVisible) {
      appliedVisible = visible;
      layerEl.classList.toggle('is-visible', visible);
    }
    const dismissed = typeof getHintDismissed === 'function' && getHintDismissed();
    if (dismissed !== appliedDismissed) {
      appliedDismissed = dismissed;
      hintEl?.classList.toggle('is-dismissed', dismissed);
    }
  }

  function isSpinPaused() { return paused; }

  function teardown() {
    spinBtn?.removeEventListener('click', onSpinClick);
    rotateBtns.forEach((btn) => btn.removeEventListener('click', onRotateClick));
    layerEl?.classList.remove('is-visible');
    hintEl?.classList.remove('is-dismissed');
    layerEl = null;
    spinBtn = null;
    hintEl = null;
    rotateBtns = [];
    appliedVisible = null;
    appliedDismissed = null;
  }

  return { setup, update, teardown, isSpinPaused };
}

// On-canvas globe chrome: auto-spin play/pause + the barrel's rotate row. See README.
const SPIN_DAA_PAUSE = 'pause_spin--globe_gallery';
const SPIN_DAA_RESUME = 'resume_spin--globe_gallery';

export default function createGlobeControls({ q, labels, getVisible, rotate }) {
  let layerEl = null;
  let spinBtn = null;
  let rotateBtns = [];
  let paused = false; // survives breakpoint rebuilds — the closure outlives them
  let appliedVisible = null; // last-written class state; update() only writes on a flip

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
    // Tab order, not layout: must land AFTER a11y.setup's nodes. See README (Globe controls).
    layerEl.parentNode?.appendChild(layerEl);
    spinBtn = layerEl.querySelector('.globe-gallery-spin-toggle');
    rotateBtns = [...layerEl.querySelectorAll('.globe-gallery-rotate')];
    spinBtn?.addEventListener('click', onSpinClick);
    rotateBtns.forEach((btn) => btn.addEventListener('click', onRotateClick));
    appliedVisible = null;
    renderSpinState();
  }

  // Per-frame: fade the layer in/out with the globe's interactive window.
  function update() {
    if (!layerEl) return;
    const visible = getVisible();
    if (visible === appliedVisible) return;
    appliedVisible = visible;
    layerEl.classList.toggle('is-visible', visible);
  }

  function isSpinPaused() { return paused; }

  function teardown() {
    spinBtn?.removeEventListener('click', onSpinClick);
    rotateBtns.forEach((btn) => btn.removeEventListener('click', onRotateClick));
    layerEl?.classList.remove('is-visible');
    layerEl = null;
    spinBtn = null;
    rotateBtns = [];
    appliedVisible = null;
  }

  return { setup, update, teardown, isSpinPaused };
}

// Page-zoom shrinks the viewport in both dimensions while window.screen stays fixed.
// Narrow devices and split-screen windows keep at least one ratio near 1.
export const ZOOM_RATIO_THRESHOLD = 1.3;

/**
 * Detects desktop browser page-zoom (as opposed to a genuinely narrow/mobile
 * viewport) by comparing the physical screen size to the current layout viewport.
 * @param {number} [threshold=ZOOM_RATIO_THRESHOLD]
 * @returns {boolean}
 */
export function isZoomed(threshold = ZOOM_RATIO_THRESHOLD) {
  const { width: screenW, height: screenH } = window.screen || {};
  if (!screenW || !screenH || !window.innerWidth || !window.innerHeight) return false;
  const wRatio = screenW / window.innerWidth;
  const hRatio = screenH / window.innerHeight;
  return wRatio > threshold && hRatio > threshold;
}

/**
 * Convenience subscription for blocks that don't already have their own resize
 * plumbing. Invokes `callback(isZoomed())` immediately and again on every resize.
 * @param {(zoomed: boolean) => void} callback
 * @param {number} [threshold=ZOOM_RATIO_THRESHOLD]
 * @returns {() => void} cleanup function that removes the resize listener
 */
export function onZoomChange(callback, threshold = ZOOM_RATIO_THRESHOLD) {
  const handler = () => callback(isZoomed(threshold));
  handler();
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}

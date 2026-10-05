// Prefer the layout viewport height over the visual viewport height.
export function viewportHeight() {
  return document.documentElement.clientHeight || window.innerHeight;
}

/**
 * Checks whether content fits below its pinned top offset. Measurements are in CSS pixels.
 * @param {number} height
 * @param {number} [top=0]
 * @returns {boolean}
 */
export function fitsInViewport(height, top = 0) {
  return top + height <= viewportHeight();
}

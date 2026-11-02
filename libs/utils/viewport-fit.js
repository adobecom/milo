// Prefer the layout viewport height over the visual viewport height.
export function viewportHeight() {
  return document.documentElement.clientHeight || window.innerHeight;
}

// Check whether content fits below its pinned top offset, using CSS pixels.
export function fitsInViewport(height, top = 0) {
  return top + height <= viewportHeight();
}

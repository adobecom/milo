// Uses the layout viewport (documentElement.clientHeight), which on mobile is the height with
// browser toolbars shown and doesn't change as they collapse, so results stay stable on scroll.
export function viewportHeight() {
  return document.documentElement.clientHeight || window.innerHeight;
}

/**
 * Whether content of `height`, pinned `top` px from the top of the viewport, is fully visible.
 * Use it to switch scroll-driven layouts (sticky stacks, pinned slides) to a static fallback
 * when they would cut off content, e.g. at 200%+ browser zoom or in short windows.
 * @param {number} height
 * @param {number} [top=0]
 * @returns {boolean}
 */
export function fitsInViewport(height, top = 0) {
  return top + height <= viewportHeight();
}

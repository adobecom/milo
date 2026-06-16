/**
 * lazy-load.js – shared helpers for deferring below-the-fold resource loading.
 *
 * isAboveFold(el)        – true when el's top edge is within 1.5× window.innerHeight
 *                          at decoration time (covers LCP zone on tall screens).
 * setLazyImg(img)        – stamps loading='lazy' and decoding='async' on an <img>.
 *                          Also nullifies srcset on sibling <source> elements so the
 *                          browser preload scanner cannot eagerly fetch high-res
 *                          sources; the original values are stored in data-srcset and
 *                          restored when the element enters the viewport.
 * observeBlock(el, fn)   – calls fn() once when el enters an extended viewport
 *                          (rootMargin '200px'), then disconnects the observer.
 */

/** @param {Element} el */
export function isAboveFold(el) {
  const { top } = el.getBoundingClientRect();
  return top < window.innerHeight * 1.5;
}

/**
 * Stamps lazy-loading attributes on an <img> and withholds srcset from any
 * sibling <source> elements so the preload scanner cannot fetch them early.
 * @param {HTMLImageElement} img
 */
export function setLazyImg(img) {
  img.setAttribute('loading', 'lazy');
  img.setAttribute('decoding', 'async');

  // Walk sibling <source> elements inside the same <picture>
  const picture = img.closest('picture');
  if (!picture) return;
  picture.querySelectorAll('source').forEach((source) => {
    const srcset = source.getAttribute('srcset');
    if (srcset) {
      source.setAttribute('data-srcset', srcset);
      source.removeAttribute('srcset');
    }
  });
}

/**
 * Restores srcset values that were withheld by setLazyImg.
 * @param {HTMLImageElement} img
 */
export function restoreSrcset(img) {
  const picture = img.closest('picture');
  if (!picture) return;
  picture.querySelectorAll('source[data-srcset]').forEach((source) => {
    source.setAttribute('srcset', source.getAttribute('data-srcset'));
    source.removeAttribute('data-srcset');
  });
}

/**
 * Wraps block decoration in an IntersectionObserver so the decorateFn is only
 * called once the element approaches the viewport (rootMargin '200px').
 * @param {Element} el
 * @param {Function} decorateFn
 */
export function observeBlock(el, decorateFn) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      // Restore any withheld srcset values before decorating
      el.querySelectorAll('img').forEach(restoreSrcset);
      decorateFn();
    });
  }, { rootMargin: '200px' });
  observer.observe(el);
}

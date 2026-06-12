/* Pure math helpers shared across the globe modules (globe.js core + modal.js).

   Just the general-purpose easings + linear interpolation. Domain-specific math
   (Fibonacci sphere distribution, the arc-rotation ease) stays in globe.js where
   it's used. Everything here is stateless. */

export function easeOutCubic(t) { return 1 - (1 - t) ** 3; }
export function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2; }
export function easeOutSine(t) { return Math.sin((t * Math.PI) / 2); }

export function lerpN(a, b, t) { return a + (b - a) * t; }

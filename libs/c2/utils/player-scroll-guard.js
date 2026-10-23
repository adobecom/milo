// Milo's Lenis (foundation=c2) makes iframes inert while it eases a scroll so a cross-origin
// player can't swallow the wheel. The ease-out tail outlasts the visible motion, which leaves
// players unclickable for a second or more. Once wheel input has stopped, reaching for a player
// ends the glide so the player is interactive straight away.

// Wheel input (incl. trackpad momentum) counts as ongoing until it has been quiet this long.
const WHEEL_IDLE_MS = 150;
let lastWheelAt = -Infinity;
let wheelTracked = false;

const wheelIdleIn = () => WHEEL_IDLE_MS - (performance.now() - lastWheelAt);

// Scrolling immediately to where the glide currently is ends it in place. It's a no-op for
// programmatic glides (anchors, scroll-to-top), whose target is kept in step with the animation.
function endWheelGlide() {
  const { lenis } = window;
  if (lenis?.isScrolling !== 'smooth') return;
  lenis.scrollTo(lenis.animatedScroll, { immediate: true });
}

/**
 * Ends a wheel-driven Lenis glide when the pointer moves over `player` (once wheel input has
 * stopped) or presses on it.
 * @param {HTMLElement} player Element that contains an iframe or video player.
 * @param {object} [options]
 * @param {(e: PointerEvent) => void} [options.onInertPress] Called for a press that the player's
 *   iframe never received because a smooth scroll had made it inert, so the player can act on it.
 * @returns {() => void} Cleanup.
 */
export default function guardPlayerScroll(player, { onInertPress } = {}) {
  if (!wheelTracked) {
    wheelTracked = true;
    window.addEventListener('wheel', () => { lastWheelAt = performance.now(); }, { capture: true, passive: true });
  }

  const controller = new AbortController();
  const opts = { passive: true, signal: controller.signal };
  let intent = false;
  let timer;

  const settle = () => {
    clearTimeout(timer);
    timer = undefined;
    if (!intent || controller.signal.aborted) return;
    const wait = wheelIdleIn();
    if (wait > 0) {
      timer = setTimeout(settle, wait);
      return;
    }
    intent = false;
    endWheelGlide();
  };

  player.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || (!e.movementX && !e.movementY)) return;
    if (window.lenis?.isScrolling !== 'smooth') return;
    intent = true;
    if (!timer) settle();
  }, opts);
  player.addEventListener('pointerleave', () => { intent = false; }, opts);
  player.addEventListener('pointerdown', (e) => {
    const inert = document.documentElement.classList.contains('lenis-smooth');
    endWheelGlide();
    if (inert && e.button === 0 && e.target.tagName !== 'IFRAME') onInertPress?.(e);
  }, opts);

  return () => {
    controller.abort();
    clearTimeout(timer);
  };
}

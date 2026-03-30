/**
 * Firefox polyfill for scroll-driven animations.
 *
 * 1. Loads the vendored scroll-timeline polyfill
 * 2. Extracts CSS from @supports (animation-timeline: view()) and injects it
 *    so the polyfill can process view()-based animations automatically
 * 3. Runs scroll-animations.js for effects the polyfill can't handle
 */

const STYLES_SELECTOR = 'link[href*="c2/styles/styles.css"]';

const extractSupportsContent = (css) => css.match(
  /@supports\s*\(animation-timeline:\s*view\(\)\)\s*\{([\s\S]*)\}/,
)?.[1] ?? null;

async function injectParallaxStyles() {
  const link = document.querySelector(STYLES_SELECTOR);
  if (!link) return;

  const cssText = await fetch(link.href).then((r) => r.text());
  const rules = extractSupportsContent(cssText);
  if (!rules) return;

  const style = document.createElement('style');
  style.textContent = rules;
  document.head.appendChild(style);
}

export default async function init(config, loadScript) {
  await loadScript(`${config.base}/deps/scroll-timeline.js`);
  await injectParallaxStyles();

  const { default: initScrollAnimations } = await import('./scroll-animations.js');
  initScrollAnimations();
}

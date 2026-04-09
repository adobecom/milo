/**
 * Firefox polyfill for scroll-driven animations.
 *
 * 1. Loads the vendored scroll-timeline polyfill
 * 2. Extracts CSS from @supports (animation-timeline: view()) and injects it
 *    so the polyfill can process view()-based animations automatically
 * 3. Runs scroll-animations.js for effects the polyfill can't handle
 */

function extractSupportsContent(css) {
  const open = css.indexOf('{', css.indexOf('@supports (animation-timeline: view())'));
  if (open === -1) return null;
  let depth = 1;
  for (let i = open + 1; i < css.length; i += 1) {
    depth += (css[i] === '{') - (css[i] === '}');
    if (depth === 0) return css.slice(open + 1, i);
  }
  return null;
}

export default async function init(config, loadScript) {
  await loadScript(`${config.base}/deps/scroll-timeline.js`);

  const link = document.querySelector('link[href*="c2/styles/styles.css"]');
  if (link) {
    const css = await fetch(link.href).then((r) => r.text());
    const rules = extractSupportsContent(css);
    if (rules) {
      const style = document.createElement('style');
      style.textContent = rules;
      document.head.appendChild(style);
    }
  }

  const { default: initScrollAnimations } = await import('./scroll-animations.js');
  initScrollAnimations();
}

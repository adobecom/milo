/**
 * Loads the scroll-timeline polyfill (https://github.com/flackr/scroll-timeline)
 * for browsers that don't natively support animation-timeline (e.g. Firefox).
 *
 * Since the parallax CSS lives inside @supports (animation-timeline: view()),
 * Firefox never parses those rules. After loading the polyfill, we fetch the
 * stylesheet, extract the @supports block content, and re-inject it as a
 * <style> tag so the polyfill can process the scroll-driven animations.
 */

const POLYFILL_URL = 'https://flackr.github.io/scroll-timeline/dist/scroll-timeline.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function extractSupportsBlock(cssText) {
  const marker = '@supports (animation-timeline: view())';
  const start = cssText.indexOf(marker);
  if (start === -1) return null;

  let braceCount = 0;
  let blockStart = -1;
  for (let i = start; i < cssText.length; i += 1) {
    if (cssText[i] === '{') {
      if (braceCount === 0) blockStart = i + 1;
      braceCount += 1;
    } else if (cssText[i] === '}') {
      braceCount -= 1;
      if (braceCount === 0) return cssText.slice(blockStart, i);
    }
  }
  return null;
}

async function injectParallaxStyles() {
  const link = document.querySelector('link[href*="c2/styles/styles.css"]');
  if (!link) return;

  const res = await fetch(link.href);
  const cssText = await res.text();
  const innerCSS = extractSupportsBlock(cssText);
  if (!innerCSS) return;

  const style = document.createElement('style');
  style.textContent = innerCSS;
  document.head.appendChild(style);
}

export default async function init() {
  if (CSS.supports('animation-timeline', 'view()')) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  try {
    await loadScript(POLYFILL_URL);
    await injectParallaxStyles();
  } catch (e) {
    window.lana?.log(`Failed to load scroll-timeline polyfill: ${e}`, { errorType: 'e' });
  }
}

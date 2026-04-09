/**
 * Firefox polyfill for scroll-driven animations.
 *
 * 1. Loads the vendored scroll-timeline polyfill
 * 2. Extracts CSS from @supports (animation-timeline: view()), resolves CSS
 *    custom properties per-selector (the polyfill cannot parse var() in
 *    animation-range values), then injects the resolved rules
 * 3. Runs scroll-animations.js for JS-driven effects the polyfill can't handle
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

const VAR_RE = /var\(--([^,)]+)(?:,\s*([^)]+))?\)/g;

function resolveRules(rules) {
  // Process one rule block at a time so we can resolve vars against the
  // element matched by each selector.
  return rules.replace(/([^{}]+)\{([^{}]+)\}/g, (match, selector, body) => {
    if (!body.includes('var(')) return match;

    let el = document.documentElement;
    try {
      const found = document.querySelector(selector.trim().split(',')[0].trim());
      if (found) el = found;
    } catch (e) { /* invalid selector — fall back to :root */ }

    const elStyles = getComputedStyle(el);
    const rootStyles = getComputedStyle(document.documentElement);
    const resolvedBody = body.replace(VAR_RE, (_, prop, fallback) => {
      const name = prop.trim();
      return elStyles.getPropertyValue(name).trim()
        || rootStyles.getPropertyValue(name).trim()
        || fallback?.trim()
        || '';
    });

    // Drop any declaration whose value is still empty after resolution
    const cleanBody = resolvedBody.replace(/[\w-]+\s*:[^;]*;/g, (decl) => {
      if (/:\s*;/.test(decl) || decl.includes('var(')) return '';
      return decl;
    });

    return `${selector}{${cleanBody}}`;
  });
}

function guardCurrentTimeSetter() {
  const desc = Object.getOwnPropertyDescriptor(Animation.prototype, 'currentTime');
  if (!desc?.set) return;
  Object.defineProperty(Animation.prototype, 'currentTime', {
    ...desc,
    set(val) {
      if (Number.isFinite(val)) desc.set.call(this, val);
    },
  });
}

export default async function init(config, loadScript) {
  // Patch Animation.currentTime before loading the polyfill so it doesn't
  // throw when computing NaN progress (e.g. zero-length animation-range).
  guardCurrentTimeSetter();
  await loadScript(`${config.base}/deps/scroll-timeline.js`);

  const link = document.querySelector('link[href*="c2/styles/styles.css"]');
  if (link) {
    const css = await fetch(link.href).then((r) => r.text());
    const rules = extractSupportsContent(css);
    if (rules) {
      const style = document.createElement('style');
      style.textContent = resolveRules(rules);
      document.head.appendChild(style);
    }
  }

  const { default: initScrollAnimations } = await import('./scroll-animations.js');
  initScrollAnimations();
}

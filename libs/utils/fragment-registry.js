/* eslint-disable no-console */
/**
 * fragment-registry.js
 *
 * Tracks every fragment URL that is loaded during a page render cycle.
 * When the same canonical URL is encountered more than once, a structured
 * console.warn is emitted (non-blocking, warn level only).
 *
 * Feature flag: set window.miloConfig.warnDuplicateFragments = false (or
 * getConfig().warnDuplicateFragments = false) to silence the warnings.
 */

/** @type {Map<string, {count: number, locations: string[]}>} */
const registry = new Map();

/**
 * Derive a canonical key from a fragment URL so that paths that differ only
 * by trailing slash, query string, or letter-case are treated as identical.
 *
 * @param {string} href  Raw href (absolute or relative).
 * @returns {string}     Canonical key.
 */
export function canonicalizeFragmentUrl(href) {
  try {
    const base = typeof window !== 'undefined' ? window.location.href : 'http://localhost/';
    const url = new URL(href, base);
    // Lowercase the pathname, strip trailing slash (except root), drop query & hash.
    let { pathname } = url;
    pathname = pathname.toLowerCase();
    if (pathname.length > 1 && pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    return `${url.origin}${pathname}`;
  } catch (e) {
    // Fallback for non-parseable strings: just lowercase and strip trailing slash.
    let key = href.toLowerCase();
    if (key.length > 1 && key.endsWith('/')) key = key.slice(0, -1);
    return key;
  }
}

/**
 * Register a fragment URL.  Returns true when this is a duplicate (already
 * seen during this page cycle), false on first registration.
 *
 * @param {string} href          Raw fragment href.
 * @param {string} [locationHint]  Human-readable source description, e.g.
 *                                 "fragment block – https://example.com/page".
 * @returns {boolean}  true = duplicate detected.
 */
export function registerFragment(href, locationHint = '') {
  const key = canonicalizeFragmentUrl(href);
  if (registry.has(key)) {
    const entry = registry.get(key);
    entry.count += 1;
    if (locationHint) entry.locations.push(locationHint);
    return true;
  }
  registry.set(key, { count: 1, locations: locationHint ? [locationHint] : [] });
  return false;
}

/**
 * Warn about a duplicate fragment if the feature flag is enabled.
 * Called by fragment consumers after registerFragment returns true.
 *
 * @param {string} href          Raw fragment href.
 * @param {boolean} [flagEnabled]  Pass getConfig().warnDuplicateFragments;
 *                                 defaults to true.
 */
export function warnDuplicate(href, flagEnabled = true) {
  if (!flagEnabled) return;
  const key = canonicalizeFragmentUrl(href);
  const entry = registry.get(key);
  if (!entry) return;
  console.warn('[Milo] Duplicate fragment reference detected', {
    path: key,
    occurrences: entry.count,
    locations: [...entry.locations],
  });
}

/** Reset the registry (used in tests and SPA navigations). */
export function clearRegistry() {
  registry.clear();
}

/** Return a read-only snapshot of the registry (for inspection / tests). */
export function getRegistry() {
  return new Map(registry);
}

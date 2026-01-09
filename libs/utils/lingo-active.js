/**
 * Leaf wrapper around `lingoActive()` that avoids named-importing it at module
 * instantiation time.
 *
 * Why: in some CI environments, named ESM exports can fail to resolve due to
 * module graph / served artifact mismatches, causing the importing module to
 * fail to load before tests execute. By using a dynamic import, we defer that
 * dependency until runtime.
 *
 * Note: This module intentionally has NO static imports.
 */
export async function getLingoActive() {
  try {
    // Defer evaluation of the large utils module until needed.
    const mod = await import('./utils.js');
    if (typeof mod.lingoActive === 'function') {
      return mod.lingoActive();
    }
  } catch (e) {
    // Fall through to lightweight fallback.
  }

  // Lightweight fallback that mirrors lingoActive() behavior:
  // - uses <meta name="langfirst" content="...">
  // - or URL query param `langfirst`
  const meta = document.querySelector('meta[name="langfirst"]');
  const metaValue = meta?.getAttribute('content') || meta?.content;
  const paramValue = new URL(window.location.href).searchParams.get('langfirst');
  const langFirst = (metaValue || paramValue || '').toLowerCase();
  return ['true', 'on'].includes(langFirst);
}
export default getLingoActive;
/**
 * Shared `window.miloJsonLd` namespace for cross-module JSON-LD bookkeeping.
 *
 * Centralizes the small amount of global state Milo's JSON-LD pipeline relies on:
 *   - `htmlJsonLd` — a WeakSet of every JSON-LD script that was present in
 *     <head> when `loadArea(document)` first runs (i.e., HTML-authored, as
 *     opposed to runtime-emitted by blocks/features that decorate later).
 *   - `manager` — the JsonLdGraphManager singleton, once initialized.
 *
 * Both fields are optional and populated only on opt-in (the snapshot is
 * cheap and always taken; the manager is feature-flagged). Future
 * cross-module state for this pipeline should live here too rather than
 * adding more `window.milo*` keys.
 */

export function jsonLdNs() {
  window.miloJsonLd = window.miloJsonLd ?? {};
  return window.miloJsonLd;
}

/**
 * Take a one-time snapshot of every JSON-LD script currently in `root`.
 * Idempotent — repeated calls are no-ops, so it's safe to invoke from
 * `loadArea` even if that function is re-entered for sub-areas.
 */
export function snapshotHtmlJsonLd(root = document.head) {
  const ns = jsonLdNs();
  if (ns.htmlJsonLd) return;
  ns.htmlJsonLd = new WeakSet();
  root.querySelectorAll('script[type="application/ld+json"]').forEach((el) => ns.htmlJsonLd.add(el));
}

/** True iff `el` was in the HTML when the snapshot was taken. */
export function isHtmlJsonLd(el) {
  return !!window.miloJsonLd?.htmlJsonLd?.has(el);
}

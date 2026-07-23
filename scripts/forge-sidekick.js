// Forge Sidekick wiring — added by page-forge deploy.
// See milo/libs/utils/sidekick.js (vhargrave/forge-sidekick) for the canonical
// version. Inlined here so Forge proto pages on milo get the
// same buttons without depending on Milo being loaded.
(() => {
  // Page-metadata cleanup. The pipeline copies a `<div class="metadata">` block
  // into <head>, but on DA-sourced Milo pages it does NOT remove the block from
  // <main> and Milo doesn't hide it — so the raw title/html-lang key-value table
  // renders at the foot of the page. The values are already in <head>, so hide
  // any that survive. Page metadata only: the `.metadata` token does not match
  // `section-metadata`, which Milo consumes itself.
  const hideOrphanMetadata = () => {
    document.querySelectorAll('main div.metadata').forEach((el) => {
      const section = el.closest('.section') || el.parentElement || el;
      section.style.display = 'none';
    });
  };
  hideOrphanMetadata();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideOrphanMetadata);
  }

  // Resolve the Page Animator script URL the same way milo's bookmarklet
  // does (libs/c2/tools/page-animator/bookmarklet.md): honour ?milolibs= so
  // a feature-branch demo (e.g. ?milolibs=forge-a-panel) loads the matching
  // animator code. Defaults to the forge-a-panel branch on aem.live since
  // that's where the panel currently lives.
  const resolveAnimatorSrc = () => {
    if (window.forgeSources?.animator) return window.forgeSources.animator;
    const h = location.hostname;
    const p = location.port;
    const ml = new URLSearchParams(location.search).get('milolibs');
    if (h === 'localhost' && p === '3000') return 'http://localhost:3000/libs/c2/tools/page-animator/page-animator.js';
    if ((h === 'localhost' && p === '6456') || ml === 'local') return 'http://localhost:6456/libs/c2/tools/page-animator/page-animator.js';
    const branch = (ml && ml !== 'local') ? ml : 'forge-a-panel';
    const env = h.indexOf('.aem.page') !== -1 ? 'aem.page' : 'aem.live';
    return `https://${branch}--milo--adobecom.${env}/libs/c2/tools/page-animator/page-animator.js`;
  };

  const bind = (sk) => {
    const load = (src) => {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = src;
      document.head.appendChild(s);
    };
    sk.addEventListener('custom:forge-adjustments', () => {
      if (document.querySelector('[data-replay="host"]')) return;
      load(window.forgeSources?.adjustments || 'http://localhost:3001/overlay.js');
    });
    sk.addEventListener('custom:forge-annotations', () => {
      if (document.getElementById('page-commenter-root')) return;
      load(window.forgeSources?.annotations || 'https://page-commenter.jingleh12345.workers.dev/page-commenter.js');
    });
    sk.addEventListener('custom:forge-publish', () => {
      load(window.forgeSources?.publish || 'http://localhost:3001/forge-publish.js');
    });
    sk.addEventListener('custom:forge-animator', () => {
      // page-animator.js is an IIFE that short-circuits on a second load
      // via document.getElementById('page-animator-panel'), so it's safe
      // to fire multiple times.
      if (document.getElementById('page-animator-panel')) return;
      load(resolveAnimatorSrc());
    });
  };
  const existing = document.querySelector('aem-sidekick, helix-sidekick');
  if (existing) { bind(existing); return; }
  // Sidekick element is injected after page load; observe until it shows up.
  const obs = new MutationObserver(() => {
    const sk = document.querySelector('aem-sidekick, helix-sidekick');
    if (sk) { obs.disconnect(); bind(sk); }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });
})();

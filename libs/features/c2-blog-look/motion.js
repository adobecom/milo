(() => {
  const reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (!reduce || reduce.matches || typeof IntersectionObserver !== 'function' || typeof MutationObserver !== 'function') return;
  const MARK = 'data-forge-motion';
  const TARGETS = [
    'main .blog-article-content > .section > :not(.content)',
    'main .blog-article-content .content > *',
    'main > .section ~ .section',
  ].join(', ');
  const seen = new WeakSet();
  const pending = new Set();
  const clear = (el) => { el.removeAttribute(MARK); };
  const io = new IntersectionObserver((entries) => {
    for (const { target: el, isIntersecting, boundingClientRect: box } of entries) {
      if (!pending.has(el)) {
        if (isIntersecting || (!box.width && !box.height)) { io.unobserve(el); continue; }
        pending.add(el);
        el.setAttribute(MARK, 'out');
        continue;
      }
      if (!isIntersecting) continue;
      pending.delete(el);
      io.unobserve(el);
      el.setAttribute(MARK, 'in');
      setTimeout(() => clear(el), 700);
    }
  });
  const showAll = () => {
    for (const el of pending) { io.unobserve(el); clear(el); }
    pending.clear();
  };
  let queued = false;
  let mo = null;
  let quiet = null;
  const scan = () => {
    queued = false;
    let found = false;
    for (const el of document.querySelectorAll(TARGETS)) {
      if (seen.has(el)) continue;
      seen.add(el);
      io.observe(el);
      found = true;
    }
    if (found || !quiet) {
      clearTimeout(quiet);
      quiet = setTimeout(() => { if (document.querySelector('main .blog-article-content')) mo?.disconnect(); else quiet = null; }, 3000);
    }
  };
  const later = () => { if (!queued) { queued = true; requestAnimationFrame(scan); } };
  const start = () => {
    mo = new MutationObserver(later);
    mo.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => mo.disconnect(), 60000);
    scan();
  };
  document.addEventListener('click', (e) => {
    const a = e.target instanceof Element ? e.target.closest('a[href*="#"]') : null;
    if (!a) return;
    try {
      const u = new URL(a.href, window.location.href);
      if (u.hash && u.pathname === window.location.pathname) showAll();
    } catch {  }
  }, true);
  window.addEventListener('hashchange', showAll);
  if (reduce.addEventListener) reduce.addEventListener('change', () => { if (reduce.matches) showAll(); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true }); else start();
})();

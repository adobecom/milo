(() => {
  if (typeof MutationObserver !== 'function') return;
  const PROMO = '[data-footer-promo] .fragment[data-path*="/fragments/footer-promos/"] .aside[data-block-status="loaded"]';
  const MARK = 'data-forge-c2-promo';
  const CODE = new URL('../../c2/blocks/rich-content/rich-content-c2.js', import.meta.url).href;
  let code = null;
  let observer = null;
  const make = (tag, cls, kids = []) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    el.append(...kids);
    return el;
  };
  const block = (cls, cells) => make('div', cls, [make('div', '', cells.map((kids) => make('div', '', kids)))]);
  async function swap(aside) {
    aside.setAttribute(MARK, 'swapping');
    const h = aside.querySelector('h1, h2, h3, h4, h5, h6');
    const pic = aside.querySelector('picture');
    if (!h || !pic) { aside.setAttribute(MARK, 'kept'); return; }
    const heading = make(h.tagName.toLowerCase(), '', [h.textContent]);
    if (h.id) heading.id = h.id;
    const cell = [heading];
    const a = aside.querySelector('a[href]');
    if (a) {
      const link = make('a', '', [a.textContent]);
      link.href = a.href;
      for (const name of ['aria-label', 'target', 'rel']) {
        const v = a.getAttribute(name);
        if (v) link.setAttribute(name, v);
      }
      cell.push(make('p', '', [make('strong', '', [link])]));
    }
    const rich = block('rich-content dark', [cell]);
    const picture = make('div', 'content', [make('p', '', [pic.cloneNode(true)])]);
    try {
      code ??= import(CODE);
      const { default: decorate } = await code;
      decorate(rich);
    } catch {
      code = null;
      aside.setAttribute(MARK, 'kept');
      return;
    }
    const section = aside.closest('.section');
    section?.classList.add('container', 'two-up', 'vertical-center', 'spacing-xl', 'dark');
    aside.replaceWith(rich, picture);
    section?.setAttribute(MARK, 'c2');
    observer?.disconnect();
  }
  const scan = () => document.querySelectorAll(`${PROMO}:not([${MARK}])`).forEach(swap);
  const start = () => {
    observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-block-status'] });
    scan();
  };
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, { once: true });
})();

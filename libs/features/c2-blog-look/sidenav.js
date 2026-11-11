(() => {
  if (typeof MutationObserver !== 'function' || !window.matchMedia) return;
  const TOGGLE = '.blog-side-navigation .blog-side-navigation-toggle';
  let found = false;
  let watch = null;

  const take = (button) => {
    const block = button.closest('.blog-side-navigation');
    const item = button.parentElement;
    const list = item ? item.parentElement : null;
    if (!block || !item || item.tagName !== 'LI' || !list || list.tagName !== 'UL') return;
    if (!list.id || list.id !== button.getAttribute('aria-controls')) return;
    const items = [...list.children];
    if (items.length !== 2 && items.length !== 3) return;
    if (!items.every((li) => li.tagName === 'LI' && li.querySelector(':scope > a'))) return;
    const links = items.map((li) => li.querySelector(':scope > a'));

    const tablet = window.matchMedia('(min-width: 600px)');
    const expanded = { tablet: !block.classList.contains('collapsed'), mobile: false };
    const OPTIONS = { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'aria-expanded', 'aria-current'] };
    let mo = null;
    let taken = false;
    let failed = false;
    const viewport = () => (tablet.matches ? 'tablet' : 'mobile');
    const activeIndex = () => {
      const i = links.findIndex((a) => a.getAttribute('aria-current') === 'location');
      return i === -1 ? 0 : i;
    };

    const PIN = ['height', 'box-sizing', 'overflow'];
    let pinned = null;
    const release = () => {
      if (!pinned) return false;
      const { nav, saved } = pinned;
      pinned = null;
      try {
        saved.forEach(([name, value, priority]) => {
          if (value) nav.style.setProperty(name, value, priority);
          else nav.style.removeProperty(name);
        });
      } catch {  }
      return true;
    };
    const pin = () => {
      const nav = list.closest('nav');
      if (!nav || pinned) return;
      const saved = PIN.map((name) => [name, nav.style.getPropertyValue(name), nav.style.getPropertyPriority(name)]);
      const h = nav.getBoundingClientRect().height;
      pinned = { nav, saved };
      nav.style.setProperty('box-sizing', 'border-box');
      nav.style.setProperty('height', `${h}px`);
      nav.style.setProperty('overflow', 'hidden');
    };

    const fail = () => {
      if (failed) return;
      failed = true;
      try { release(); } catch {  }
      try { if (mo) mo.disconnect(); } catch {  }
      try { delete button.hidden; } catch {  }
      try {
        const hadFocus = document.activeElement === button;
        if (button.parentElement !== items[0]) items[0].append(button);
        button.setAttribute('hidden', '');
        button.setAttribute('aria-expanded', 'true');
        items.forEach((li) => { li.hidden = false; });
        if (hadFocus) links[0].focus({ preventScroll: true });
      } catch {  }
    };

    const apply = (index) => {
      if (failed) return;
      try {
        if (mo) mo.disconnect();
        const open = expanded[viewport()];
        const active = Number.isInteger(index) && index >= 0 && index < items.length ? index : activeIndex();
        const visible = open ? items[0] : items[active];
        const focused = document.activeElement;
        visible.hidden = false;
        if (button.parentElement !== visible) {
          visible.append(button);
          if (focused === button) button.focus({ preventScroll: true });
        }
        if (!open && items.some((li, i) => i !== active && li.contains(focused))) button.focus({ preventScroll: true });
        button.setAttribute('aria-expanded', String(open));
        items.forEach((li, i) => { li.hidden = !open && i !== active; });
        if (mo) mo.observe(list, OPTIONS);
      } catch { fail(); }
    };

    try {
      Object.defineProperty(button, 'hidden', {
        configurable: true,
        get() { return this.hasAttribute('hidden'); },
        set() {  },
      });
      taken = true;
      button.removeAttribute('hidden');
      button.addEventListener('click', () => {
        if (failed) return;
        const v = viewport();
        expanded[v] = !expanded[v];
        apply();
      });
      list.addEventListener('click', (event) => {
        if (failed || tablet.matches) return;
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const a = event.target instanceof Element ? event.target.closest('a') : null;
        const index = a ? links.indexOf(a) : -1;
        if (index === -1) return;
        expanded.mobile = false;
        apply(index);
        if (failed) return;
        try { release(); pin(); } catch { fail(); return; }
        setTimeout(() => { if (release()) apply(); }, 0);
      }, true);
      list.addEventListener('click', () => {
        if (release()) apply();
      });
      tablet.addEventListener('change', apply);
      mo = new MutationObserver(apply);
      apply();
    } catch {
      if (taken) fail();
    }
  };

  const toggleIn = (node) => {
    if (!(node instanceof Element)) return null;
    return node.matches(TOGGLE) ? node : node.querySelector(TOGGLE);
  };

  const seen = (button) => {
    found = true;
    try { if (watch) watch.disconnect(); } catch {  }
    try { take(button); } catch {  }
    try { button.removeAttribute('aria-controls'); } catch {  }
  };

  try {
    watch = new MutationObserver((records) => {
      if (found) return;
      for (const record of records) {
        for (const node of record.addedNodes) {
          const button = toggleIn(node);
          if (button) { seen(button); return; }
        }
      }
    });
    watch.observe(document.documentElement, { childList: true, subtree: true });
    const first = document.querySelector(TOGGLE);
    if (first) seen(first);
  } catch {
    try { if (watch) watch.disconnect(); } catch {  }
  }

  const RELATED = 'main .blog-related-content > h3';
  let headed = false;
  let headWatch = null;
  const level = (h) => {
    headed = true;
    try { if (headWatch) headWatch.disconnect(); } catch {  }
    try { if (!h.hasAttribute('aria-level')) h.setAttribute('aria-level', '2'); } catch {  }
  };
  const headingIn = (node) => {
    if (!(node instanceof Element)) return null;
    return node.matches(RELATED) ? node : node.querySelector(RELATED);
  };
  try {
    headWatch = new MutationObserver((records) => {
      if (headed) return;
      for (const record of records) {
        for (const node of record.addedNodes) {
          const h = headingIn(node);
          if (h) { level(h); return; }
        }
      }
    });
    headWatch.observe(document.documentElement, { childList: true, subtree: true });
    const firstHeading = document.querySelector(RELATED);
    if (firstHeading) level(firstHeading);
  } catch {
    try { if (headWatch) headWatch.disconnect(); } catch {  }
  }
})();

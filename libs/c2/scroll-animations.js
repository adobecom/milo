const vh = window.innerHeight;
const STAGGER_RE = /parallax-stagger-(ltr|rtl)/;
const STAGGER_SELECTOR = '[class*="parallax-stagger-ltr"],'
  + '[class*="parallax-stagger-rtl"]';

/* ── Shared helpers ─────────────────────────────── */

function getDocTop(el) {
  let top = el.offsetTop;
  let { offsetParent } = el;
  while (offsetParent) {
    top += offsetParent.offsetTop;
    offsetParent = offsetParent.offsetParent;
  }
  return top;
}

function getScrollMetrics(scroll, el, insetTop = 0, insetBottom = 0) {
  const elHeight = el.offsetHeight;
  const dist = (scroll + vh * (1 - insetBottom)) - getDocTop(el);
  const total = elHeight + vh * (1 - insetTop - insetBottom);
  return { elHeight, dist, total };
}

function viewRange({ elHeight, dist, total }, sType, sPct, eType, ePct) {
  const s = sType === 'entry' ? elHeight * sPct : total * sPct;
  const e = eType === 'entry' ? elHeight * ePct : total * ePct;
  return Math.max(0, Math.min(1, (dist - s) / (e - s)));
}

function sectionHasStyle(section, style) {
  if (section.classList.contains(style)) return true;
  if (section.querySelector(`.${style}`)) return true;
  const smBlock = section.querySelector('.section-metadata');
  if (!smBlock) return false;
  const rows = [...smBlock.children];
  const styleRow = rows.find(
    (r) => r.children?.[0]?.textContent.trim().toLowerCase() === 'style',
  );
  return styleRow?.children?.[1]?.textContent
    .toLowerCase().includes(style);
}

function findSectionsByStyle(style) {
  return [...document.querySelectorAll('.section')].filter(
    (s) => sectionHasStyle(s, style),
  );
}

function cacheLineHeights(elements) {
  return elements
    .filter((el) => el instanceof Element)
    .map((child) => {
      const styles = getComputedStyle(child);
      const fontSize = parseFloat(styles?.fontSize) || 16;
      const computed = styles?.lineHeight;
      const target = computed === 'normal'
        ? 1.2 : parseFloat(computed) / fontSize;
      return { el: child, target };
    });
}

function lerp(from, to, t) {
  return t >= 1 ? '' : String(from + (to - from) * t);
}

/* ── Move-up-fast ───────────────────────────────── */

function initMoveUpFast() {
  const vh80px = vh * 0.8;
  const sections = [
    ...document.querySelectorAll('.section.parallax-move-up-fast'),
  ];
  sections.forEach((section) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;background:black;'
      + 'opacity:0;pointer-events:none;z-index:2;';
    section.appendChild(overlay);
    window.lenis.on('scroll', ({ scroll }) => {
      const t = Math.max(0, Math.min(1, scroll / vh80px));
      section.style.transform = `translateY(${-35 * t}vh)`;
      overlay.style.opacity = 0.75 * t;
    });
  });
}

/* ── Garage-door reveal ─────────────────────────── */

function initGarageDoorReveal() {
  const isDesktop = window.innerWidth >= 1280;
  const gdSections = findSectionsByStyle('parallax-garage-door-reveal');

  gdSections.forEach((gdSection) => {
    const foreground = gdSection.querySelector('.rich-content > div');
    const bgImg = gdSection.querySelectorAll('img');
    const childLHData = foreground
      ? cacheLineHeights([...foreground.querySelectorAll('*')])
      : [];
    const revealFrom = isDesktop ? 30 : 20;
    const coverEnd = isDesktop ? 0.4 : 0.3;

    window.lenis.on('scroll', ({ scroll }) => {
      const m = getScrollMetrics(scroll, gdSection);

      const growT = viewRange(m, 'entry', 0, 'cover', coverEnd);
      gdSection.style.transform = `translateY(${-80 * (1 - growT)}vh)`;

      if (bgImg.length) {
        const scaleT = viewRange(m, 'entry', 0, 'entry', 0.8);
        bgImg.forEach((img) => {
          img.style.transform = `scale(${1 + 0.1 * scaleT})`;
        });
      }

      const innerT = viewRange(m, 'entry', 0.3, 'entry', 0.7);

      if (foreground) {
        foreground.style.transform = `translateY(${revealFrom * (1 - innerT)}vh)`;
      }

      childLHData.forEach(({ el, target }) => {
        el.style.lineHeight = lerp(0.6, target, innerT);
      });
    });
  });
}

/* ── Scale-down grid ────────────────────────────── */

function initScaleDownGrid() {
  const grids = findSectionsByStyle('parallax-scale-down-grid');

  grids.forEach((grid) => {
    const container = grid.closest('.container') || grid.parentElement;
    const cs = getComputedStyle(container);
    const targetMaxW = parseFloat(
      cs.getPropertyValue('--grid-max-width-target'),
    ) || 1440;
    const marginStr = cs.getPropertyValue(
      '--grid-margin-width-target',
    ).trim();
    const marginVal = parseFloat(marginStr) || 24;
    const isPercent = marginStr.includes('%');

    window.lenis.on('scroll', ({ scroll }) => {
      const m = getScrollMetrics(scroll, grid, 0.4, 0.1);
      const t = viewRange(m, 'entry', 0, 'entry', 1);
      const width = grid.offsetWidth;
      const margin = isPercent ? (marginVal / 100) * width : marginVal;
      const pad = Math.max(margin, (width - targetMaxW) / 2) * t;
      grid.style.paddingInline = `${pad}px`;
    });
  });
}

/* ── Stagger ────────────────────────────────────── */

function getColCount(el) {
  if (el.classList.contains('four-up')) return 4;
  if (el.classList.contains('three-up')) return 3;
  if (el.classList.contains('two-up')) return 2;
  return 1;
}

function getEndRange(cols, count) {
  const row3 = { 2: 5, 3: 7, 4: 9 };
  const row2 = { 2: 3, 3: 4, 4: 5 };
  if (count >= (row3[cols] || Infinity)) return { eType: 'cover', ePct: 0.8 };
  if (count >= (row2[cols] || Infinity)) return { eType: 'cover', ePct: 0.7 };
  return { eType: 'entry', ePct: 1 };
}

function setupStaggerEl(el) {
  const drift = 48;
  const isRtl = el.classList.contains('parallax-stagger-rtl');
  let childData = null;
  let eType = null;
  let ePct = null;

  window.lenis.on('scroll', ({ scroll }) => {
    if (!childData) {
      const cols = getColCount(el);
      const children = [...el.children].filter(
        (c) => !c.className.match(/section-/),
      );
      if (!children.length) return;
      ({ eType, ePct } = getEndRange(cols, children.length));
      childData = children.map((child, i) => {
        const colIdx = (i % cols) + 0.5;
        const rowIdx = Math.floor(i / cols);
        const idx = isRtl
          ? (cols - 1 - colIdx + rowIdx)
          : (colIdx + rowIdx);
        return { child, from: idx * drift };
      });
    }
    const m = getScrollMetrics(scroll, el, 0.4, 0.1);
    const t = viewRange(m, 'entry', 0, eType, ePct);
    childData.forEach(({ child, from }) => {
      child.style.transform = `translate3d(0, ${from * (1 - t)}px, 0)`;
    });
  });
}

function initStagger() {
  if (window.innerWidth < 768) return;

  const initialized = new WeakSet();
  const setup = (target) => {
    if (initialized.has(target)) return;
    initialized.add(target);
    setupStaggerEl(target);
  };

  document.querySelectorAll(STAGGER_SELECTOR).forEach(setup);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        if (STAGGER_RE.test(mutation.target.className)) {
          setup(mutation.target);
        }
        return;
      }
      [...mutation.addedNodes]
        .filter((node) => node.nodeType === 1)
        .forEach((node) => {
          if (STAGGER_RE.test(node.className)) setup(node);
          node.querySelectorAll?.(STAGGER_SELECTOR).forEach(setup);
        });
    });
  });

  document.querySelectorAll('.section').forEach((s) => {
    observer.observe(s, {
      attributes: true,
      attributeFilter: ['class'],
      childList: true,
      subtree: true,
    });
  });
}

/* ── Entry point ────────────────────────────────── */

export default function init() {
  initMoveUpFast();
  initGarageDoorReveal();
  initScaleDownGrid();
  initStagger();
}

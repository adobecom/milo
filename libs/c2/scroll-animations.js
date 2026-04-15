const vh = window.innerHeight;
const STAGGER_RE = /parallax-stagger-(ltr|rtl)/;
const STAGGER_SELECTOR = '[class*="parallax-stagger-ltr"],'
  + '[class*="parallax-stagger-rtl"]';

/* ── Scroll loop ────────────────────────────────── */

const scrollTasks = [];
let ticking = false;

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const scroll = window.scrollY;
    scrollTasks.forEach((task) => task(scroll));
    ticking = false;
  });
}

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

function getScrollMetrics(scroll, elHeight, docTop, insetTop = 0, insetBottom = 0) {
  const dist = (scroll + vh * (1 - insetBottom)) - docTop;
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

/* ── Move-up-fast ───────────────────────────────── */

function initMoveUpFast() {
  const vh80px = vh * 0.8;
  const sections = [
    ...document.querySelectorAll('.section.parallax-move-up-fast'),
  ];
  if (!sections.length) return;

  const style = document.createElement('style');
  style.textContent = '.section.parallax-move-up-fast::after { animation: none; }';
  document.head.appendChild(style);

  sections.forEach((section) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;background:black;'
      + 'opacity:0;pointer-events:none;z-index:2;';
    section.appendChild(overlay);
    const sectionTop = getDocTop(section);
    scrollTasks.push((scroll) => {
      const t = Math.max(0, Math.min(1, (scroll - sectionTop) / vh80px));
      // section.style.top = `${-35 * t}vh`;
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
    const revealFrom = isDesktop ? 30 : 20;
    let docTop = null;

    scrollTasks.push((scroll) => {
      const elHeight = gdSection.offsetHeight;
      if (!elHeight) return;
      if (docTop === null) docTop = getDocTop(gdSection);
      const m = getScrollMetrics(scroll, elHeight, docTop);

      const growT = viewRange(m, 'entry', 0, 'entry', 0.6);
      gdSection.style.transform = `translateY(${-80 * (1 - growT)}vh)`;

      // if (bgImg.length) {
      //   const scaleT = viewRange(m, 'entry', 0, 'entry', 0.5);
      //   bgImg.forEach((img) => {
      //     img.style.transform = `scale(${1 + 0.1 * scaleT})`;
      //   });
      // }

      const innerT = viewRange(m, 'entry', 0.1, 'entry', 0.6);
      if (foreground) {
        foreground.style.transform = `translateY(${revealFrom * (1 - innerT)}vh)`;
      }
    });
  });
}

/* ── Scale-down grid ────────────────────────────── */

function initScaleDownGrid() {
  const grids = findSectionsByStyle('parallax-scale-down-grid');

  grids.forEach((grid) => {
    let endPad = null;
    let docTop = null;

    scrollTasks.push((scroll) => {
      const elHeight = grid.offsetHeight;
      if (!elHeight) return;
      if (docTop === null) docTop = getDocTop(grid);
      if (endPad === null) {
        grid.style.paddingInline = '';
        endPad = parseFloat(getComputedStyle(grid).paddingInlineStart) || 0;
      }
      const m = getScrollMetrics(scroll, elHeight, docTop, 0.4, 0.1);
      const t = viewRange(m, 'entry', 0, 'entry', 0.4);
      if (t >= 1) {
        grid.style.paddingInline = '';
        return;
      }
      grid.style.paddingInline = `${endPad * t}px`;
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

function setupStaggerEl(el) {
  const drift = 48;
  const isRtl = el.classList.contains('parallax-stagger-rtl');
  let childData = null;

  scrollTasks.push(() => {
    const elHeight = el.offsetHeight;
    if (!elHeight) return;
    if (!childData) {
      const cols = getColCount(el);
      const children = [...el.children].filter(
        (c) => !c.className.match(/section-/),
      );
      if (!children.length) return;
      childData = children.map((child, i) => {
        const colIdx = (i % cols) + 0.5;
        const rowIdx = Math.floor(i / cols);
        const idx = isRtl
          ? (cols - 1 - colIdx + rowIdx)
          : (colIdx + rowIdx);
        return { child, from: idx * drift };
      });
    }
    // top: visual distance from viewport top, accounts for parent transforms
    // t=0 when element enters at viewport bottom (top === vh)
    // t=1 when element top reaches viewport center (top === vh * 0.5)
    const { top } = el.getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (vh - top) / (vh * 0.5)));
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

/* ── Elastic carousel ───────────────────────────── */

function initElasticCarousel() {
  if (window.innerWidth < 768) return;

  const isRtl = document.documentElement.dir === 'rtl';
  const startMargin = isRtl ? -200 : 200;
  const initialized = new WeakSet();
  let cssDisabled = false;

  const setupContainer = (container) => {
    if (initialized.has(container)) return;
    initialized.add(container);

    if (!cssDisabled) {
      cssDisabled = true;
      const style = document.createElement('style');
      style.textContent = '.elastic-carousel-container,'
        + '.elastic-carousel-item { animation: none !important; }'
        + '.elastic-carousel-item { flex-shrink: 0; }';
      document.head.appendChild(style);
    }

    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const toNum = (s) => (s.includes('rem') ? parseFloat(s) * rootFontSize : parseFloat(s));
    container.querySelectorAll('.elastic-carousel-item').forEach((item) => {
      const endGap = toNum(getComputedStyle(item).getPropertyValue('--end-gap').trim());
      item.style.marginInline = `${endGap}px`;
    });

    container.style.willChange = 'margin-left, opacity';
    container.style.opacity = '0';
    container.style.marginLeft = `${startMargin}px`;
    let top = null;
    let total = null;

    scrollTasks.push((scroll) => {
      const elHeight = container.offsetHeight;
      if (!elHeight) return;
      if (top === null) {
        top = getDocTop(container);
        total = elHeight + vh;
      }
      const dist = (scroll + vh) - top;
      const m = { elHeight, dist, total };

      const slideT = viewRange(m, 'entry', 0.2, 'entry', 0.52);
      const opacT = viewRange(m, 'entry', 0.0, 'entry', 0.16);

      container.style.marginLeft = `${startMargin * (1 - slideT)}px`;
      container.style.opacity = opacT;
    });
  };

  document.querySelectorAll('.elastic-carousel-container').forEach(setupContainer);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [...mutation.addedNodes]
        .filter((n) => n.nodeType === 1)
        .forEach((n) => {
          if (n.classList?.contains('elastic-carousel-container')) setupContainer(n);
          n.querySelectorAll?.('.elastic-carousel-container').forEach(setupContainer);
        });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ── Carousel C2 ────────────────────────────────── */

function initCarouselC2() {
  const initialized = new WeakSet();
  let cssInjected = false;

  const setupCarousel = (el) => {
    if (initialized.has(el)) return;
    const wrapper = el.querySelector('.carousel-wrapper');
    if (!wrapper) return;
    initialized.add(el);

    if (!cssInjected) {
      cssInjected = true;
      const style = document.createElement('style');
      style.textContent = '.carousel-c2 .carousel-wrapper,'
        + '.carousel-c2 .carousel-slide { animation: none !important; }';
      document.head.appendChild(style);
    }

    const slides = [...wrapper.querySelectorAll('.carousel-slide')];
    const allChildren = [...wrapper.children];

    let startWidth = window.innerWidth;
    let targetWidth = null;
    let top = null;
    let activeIdx = allChildren.indexOf(wrapper.querySelector('.active'));

    const idxObserver = new MutationObserver(() => {
      activeIdx = allChildren.indexOf(wrapper.querySelector('.active'));
    });
    idxObserver.observe(wrapper, { subtree: true, attributeFilter: ['class'], attributes: true });

    slides.forEach((s) => { s.style.willChange = 'flex-basis'; });
    slides.forEach((s) => { s.style.flexBasis = `${startWidth}px`; });

    const resetStyles = () => {
      slides.forEach((s) => { s.style.flexBasis = ''; s.style.willChange = ''; });
      wrapper.style.transition = '';
      wrapper.style.translate = '';
    };

    window.addEventListener('resize', () => {
      resetStyles();
      startWidth = window.innerWidth;
      targetWidth = null;
      top = null;
      slides.forEach((s) => { s.style.willChange = 'flex-basis'; s.style.flexBasis = `${startWidth}px`; });
    });

    scrollTasks.push((scroll) => {
      if (targetWidth === null) {
        slides.forEach((s) => { s.style.flexBasis = ''; });
        targetWidth = slides[0]?.getBoundingClientRect().width || startWidth;
        slides.forEach((s) => { s.style.flexBasis = `${startWidth}px`; });
      }

      if (top === null) top = getDocTop(el);
      const elHeight = el.offsetHeight;
      const m = getScrollMetrics(scroll, elHeight, top, 0.1, 0.1);
      const t = viewRange(m, 'entry', 0, 'entry', 0.2);

      if (t >= 1) {
        resetStyles();
        return;
      }

      const w = startWidth + (targetWidth - startWidth) * t;
      const wPx = `${w}px`;
      slides.forEach((s) => { s.style.flexBasis = wPx; });

      const margin = (window.innerWidth - w) / 2;
      wrapper.style.transition = 'none';
      wrapper.style.translate = `${-(activeIdx * w) + margin - activeIdx * 8}px`;
    });
  };

  document.querySelectorAll('.carousel-c2').forEach(setupCarousel);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [...mutation.addedNodes]
        .filter((n) => n.nodeType === 1)
        .forEach((n) => {
          if (n.classList?.contains('carousel-c2')) setupCarousel(n);
          if (n.classList?.contains('carousel-wrapper')) {
            const carouselEl = n.closest('.carousel-c2');
            if (carouselEl) setupCarousel(carouselEl);
          }
          n.querySelectorAll?.('.carousel-c2').forEach(setupCarousel);
        });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ── Entry point ────────────────────────────────── */

export default function init() {
  initMoveUpFast();
  initGarageDoorReveal();
  initScaleDownGrid();
  initStagger();
  // initElasticCarousel();
  // initCarouselC2();

  if (scrollTasks.length) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}

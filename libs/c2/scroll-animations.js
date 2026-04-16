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
  const vh80px = Math.round(vh * 0.8);
  const topMaxPx = Math.round(vh * 0.35);
  const sections = [
    ...document.querySelectorAll('.section.parallax-move-up-fast'),
  ];
  if (!sections.length) return;

  const style = document.createElement('style');
  style.textContent = '.section.parallax-move-up-fast::after { animation: none; }';
  document.head.appendChild(style);

  sections.forEach((section) => {
    section.style.position = 'sticky';
    section.style.top = '0';
    section.style.zIndex = '0';
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;inset:0;background:black;'
      + 'opacity:0;pointer-events:none;z-index:1;';
    section.appendChild(overlay);
    const sectionTop = getDocTop(section);
    scrollTasks.push((scroll) => {
      const t = Math.max(0, Math.min(1, (scroll - sectionTop) / vh80px));
      const newTop = `${-Math.round(topMaxPx * t)}px`;
      if (section.style.top !== newTop) section.style.top = newTop;
      overlay.style.opacity = 0.75 * t;
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
      const t = viewRange(m, 'entry', -0.2, 'entry', 0.2);
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
    const t = Math.max(0.2, Math.min(1, (vh - top) / (vh * 0.5)));
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

    container.style.willChange = 'margin-left, opacity';
    container.style.opacity = '0';
    container.style.marginLeft = `${startMargin}px`;
    let top = null;
    let total = null;
    let itemData = null;

    scrollTasks.push((scroll) => {
      const elHeight = container.offsetHeight;
      if (!elHeight) return;
      if (!itemData) {
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const toNum = (s) => (s.includes('rem') ? parseFloat(s) * rootFontSize : parseFloat(s));
        itemData = [...container.querySelectorAll('.elastic-carousel-item')].map((item) => {
          const cs = getComputedStyle(item);
          return {
            item,
            startGap: toNum(cs.getPropertyValue('--start-gap').trim()),
            endGap: toNum(cs.getPropertyValue('--end-gap').trim()),
          };
        });
      }
      if (top === null) {
        top = getDocTop(container);
        total = elHeight + vh;
      }
      const dist = (scroll + vh) - top;
      const m = { elHeight, dist, total };

      const slideT = viewRange(m, 'entry', 0.2, 'entry', 0.52);
      const opacT = viewRange(m, 'entry', 0.0, 'entry', 0.16);
      // gap animates from startGap → endGap, starting 10% before slideT begins
      const gapT = Math.max(0, Math.min(1, (slideT + 0.4)));

      container.style.marginLeft = `${startMargin * (1 - slideT)}px`;
      container.style.opacity = opacT;
      itemData.forEach(({ item, startGap, endGap }) => {
        item.style.marginInline = `${startGap + (endGap - startGap) * gapT}px`;
      });
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
  const isRtl = document.documentElement.dir === 'rtl';
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
    let startWidth = window.innerWidth;
    let targetWidth = null;
    let top = null;
    let interacted = false;
    let maxSlideW = null;
    let slideGap = null;

    slides.forEach((s) => { s.style.willChange = 'flex-basis'; });
    slides.forEach((s) => { s.style.flexBasis = `${startWidth}px`; });

    const resetStyles = () => {
      slides.forEach((s) => { s.style.flexBasis = ''; s.style.willChange = ''; });
      wrapper.style.transition = '';
      wrapper.style.translate = '';
    };

    window.addEventListener('resize', () => {
      if (interacted) return;
      resetStyles();
      startWidth = window.innerWidth;
      targetWidth = null;
      top = null;
      slides.forEach((s) => { s.style.willChange = 'flex-basis'; s.style.flexBasis = `${startWidth}px`; });
    });

    scrollTasks.push((scroll) => {
      if (!interacted && wrapper.getAttribute('data-slides-cloned') === 'true') {
        interacted = true;
        slides.forEach((s) => { s.style.flexBasis = ''; s.style.willChange = ''; });
        wrapper.style.transition = '';
        return;
      }
      if (interacted) return;

      if (targetWidth === null) {
        slides.forEach((s) => { s.style.flexBasis = ''; });
        targetWidth = slides[0]?.getBoundingClientRect().width || startWidth;
        slides.forEach((s) => { s.style.flexBasis = `${startWidth}px`; });
      }

      if (top === null) {
        top = getDocTop(el);
        maxSlideW = parseFloat(getComputedStyle(el).getPropertyValue('--carousel-slide-max-width')) || Infinity;
        slideGap = parseFloat(getComputedStyle(wrapper).gap) || 8;
      }

      const elHeight = el.offsetHeight;
      const m = getScrollMetrics(scroll, elHeight, top, 0.1, 0.1);
      const t = viewRange(m, 'entry', -0.5, 'entry', 0.2);

      if (t >= 1) {
        resetStyles();
        return;
      }

      const w = startWidth + (targetWidth - startWidth) * t;
      slides.forEach((s) => { s.style.flexBasis = `${w}px`; });

      // Keep slide 1 centered as flex-basis animates — CSS translate is fixed on
      // targetWidth so we compensate for the extra width during animation.
      const effectiveW = Math.min(w, maxSlideW);
      const tx = ((3 * effectiveW - window.innerWidth) / 2 + slideGap) * (isRtl ? 1 : -1);
      wrapper.style.translate = `${tx}px`;
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

/* ── Line-height ────────────────────────────────── */

function initLineHeight() {
  const initialized = new WeakSet();

  const setup = (el) => {
    if (initialized.has(el)) return;
    initialized.add(el);
    let childData = null;
    let docTop = null;

    scrollTasks.push((scroll) => {
      const elHeight = el.offsetHeight;
      if (!elHeight) return;
      if (docTop === null) docTop = getDocTop(el);
      if (!childData || !el.contains(childData[0]?.child)) {
        const nodes = [...el.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a')];
        if (!nodes.length) return;
        childData = nodes.map((c) => {
          const cs = getComputedStyle(c);
          const fontSize = parseFloat(cs.fontSize) || 16;
          const natural = parseFloat(cs.lineHeight) || fontSize * 1.5;
          return { child: c, from: 3 * fontSize, to: natural };
        });
      }
      const m = getScrollMetrics(scroll, elHeight, docTop);
      const t = viewRange(m, 'entry', 0.1, 'cover', 0.4);
      childData.forEach(({ child, from, to }) => {
        child.style.setProperty('line-height', t < 1 ? `${from + (to - from) * t}px` : null);
      });
    });
  };

  document.querySelectorAll('.parallax-line-height').forEach(setup);

  new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      [...mutation.addedNodes]
        .filter((n) => n.nodeType === 1)
        .forEach((n) => {
          if (n.classList?.contains('parallax-line-height')) setup(n);
          n.querySelectorAll?.('.parallax-line-height').forEach(setup);
        });
    });
  }).observe(document.body, { childList: true, subtree: true });
}

/* ── Garage-door reveal ─────────────────────────── */

function initGarageDoorReveal() {
  const sections = findSectionsByStyle('parallax-garage-door-reveal');
  if (!sections.length) return;

  const style = document.createElement('style');
  style.textContent = '.section.parallax-garage-door-reveal,'
    + '.section.parallax-garage-door-reveal .section-background img,'
    + '.section.parallax-garage-door-reveal .foreground,'
    + '.section.parallax-garage-door-reveal .foreground * {'
    + ' animation: none !important; }';
  document.head.appendChild(style);

  const w = window.innerWidth;
  let growFrom = -0.5 * vh;
  let revealFrom = 0.2 * vh;
  if (w >= 1280) { growFrom = -1.1 * vh; revealFrom = 0.5 * vh; }
  if (w >= 1920) { growFrom = -0.7 * vh; revealFrom = 0.3 * vh; }
  let coverEnd = 0.2;
  if (w >= 1280) coverEnd = 0.4;
  if (w >= 1440) coverEnd = 0.3;

  sections.forEach((section) => {
    const bgImg = section.querySelector('.section-background img');
    const foreground = section.querySelector('.foreground');
    let docTop = null;
    let fgChildData = null;

    section.style.willChange = 'transform';
    section.style.transform = `translateY(${growFrom}px)`;
    if (bgImg) bgImg.style.willChange = 'transform';
    if (foreground) foreground.style.willChange = 'transform';

    scrollTasks.push((scroll) => {
      const elHeight = section.offsetHeight;
      if (!elHeight) return;
      if (docTop === null) docTop = getDocTop(section);

      if (foreground && !fgChildData) {
        const nodes = [...foreground.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a')];
        fgChildData = nodes.map((c) => {
          const cs = getComputedStyle(c);
          const fontSize = parseFloat(cs.fontSize) || 16;
          const natural = parseFloat(cs.lineHeight) || fontSize * 1.5;
          return { child: c, naturalLh: natural, fromLh: fontSize * 0.6 };
        });
      }

      const m = getScrollMetrics(scroll, elHeight, docTop);

      const growT = viewRange(m, 'entry', -0.5, 'entry', coverEnd);
      section.style.transform = growT < 1 ? `translateY(${growFrom * (1 - growT)}px)` : '';

      // background image scales 1 → 1.1 (garage-door-bg-scale)
      if (bgImg) {
        const bgT = viewRange(m, 'entry', 0, 'cover', 0.7);
        bgImg.style.transform = bgT < 1 ? `scale(${1 + 0.1 * bgT})` : '';
      }

      // foreground slides up from revealFrom → 0 (garage-door-reveal)
      if (foreground) {
        const fgT = viewRange(m, 'cover', -0.1, 'cover', 0.7);
        foreground.style.transform = fgT < 1 ? `translateY(${revealFrom * (1 - fgT)}px)` : '';
      }

      // text line-height compresses → natural (garage-door-line-height)
      if (fgChildData?.length) {
        const lhT = viewRange(m, 'entry', 0.1, 'cover', 0.4);
        fgChildData.forEach(({ child, naturalLh, fromLh }) => {
          child.style.lineHeight = lhT < 1 ? `${fromLh + (naturalLh - fromLh) * lhT}px` : null;
        });
      }
    });
  });
}

/* ── Entry point ────────────────────────────────── */

export default function init() {
  initMoveUpFast();
  initLineHeight();
  initScaleDownGrid();
  initStagger();
  initElasticCarousel();
  initCarouselC2();
  initGarageDoorReveal();

  if (window.lenis) {
    window.lenis.on('scroll', ({ scroll }) => {
      scrollTasks.forEach((task) => task(scroll));
    });
  } else {
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  onScroll();
}

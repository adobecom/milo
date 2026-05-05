const vh = window.innerHeight;
const BREAKPOINT_MD = 1280;
const BREAKPOINT_LG = 1440;
const BREAKPOINT_XL = 1920;
const isRtl = document.documentElement.dir === 'rtl';
const STAGGER_RE = /parallax-stagger-(ltr|rtl)/;
const STAGGER_SELECTOR = '[class*="parallax-stagger-ltr"],'
  + '[class*="parallax-stagger-rtl"]';

const scrollTasks = [];
const cleanupTasks = [];

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
  if (section.classList.contains(style) || section.querySelector(`.${style}`)) return true;
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

function injectCSS(text) {
  const style = document.createElement('style');
  style.textContent = text;
  document.head.appendChild(style);
}

function observeForNew(selector, fn) {
  new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      [...addedNodes].filter((n) => n.nodeType === 1).forEach((n) => {
        if (n.matches?.(selector)) fn(n);
        n.querySelectorAll?.(selector).forEach(fn);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
}

function lerp(a, b, t) { return a + (b - a) * t; }

function initMoveUpFast() {
  const vh80px = Math.round(vh * 0.8);
  const topMaxPx = Math.round(vh * 0.35);
  const sections = [
    ...document.querySelectorAll('.section.parallax-move-up-fast'),
  ];
  if (!sections.length) return;

  injectCSS('.section.parallax-move-up-fast::after { animation: none; }');

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
    cleanupTasks.push(() => {
      section.style.position = '';
      section.style.top = '';
      section.style.zIndex = '';
      overlay.remove();
    });
  });
}

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
    cleanupTasks.push(() => { grid.style.paddingInline = ''; docTop = null; });
  });
}

function getColCount(el) {
  if (el.classList.contains('four-up')) return 4;
  if (el.classList.contains('three-up')) return 3;
  if (el.classList.contains('two-up')) return 2;
  return 1;
}

function setupStaggerEl(el) {
  const drift = 48;
  const isElRtl = el.classList.contains('parallax-stagger-rtl');
  let childData = null;
  let hasHeight = el.offsetHeight > 0;
  new ResizeObserver(([entry]) => {
    hasHeight = entry.contentRect.height > 0;
  }).observe(el);

  scrollTasks.push(() => {
    if (!hasHeight) return;
    if (!childData) {
      const cols = getColCount(el);
      const children = [...el.children].filter(
        (c) => !c.className.match(/section-/),
      );
      if (!children.length) return;
      childData = children.map((child, i) => {
        const colIdx = (i % cols) + 0.5;
        const rowIdx = Math.floor(i / cols);
        const idx = isElRtl
          ? (cols - 1 - colIdx + rowIdx)
          : (colIdx + rowIdx);
        return { child, from: idx * drift };
      });
    }
    // top: visual distance from viewport top, accounts for parent transforms
    // t=0.2 when element enters at viewport bottom (top === vh)
    // t=1 when element top reaches viewport center (top === vh * 0.5)
    const { top } = el.getBoundingClientRect();
    const t = Math.max(0.2, Math.min(1, (vh - top) / (vh * 0.5)));
    childData.forEach(({ child, from }) => {
      child.style.transform = `translate3d(0, ${from * (1 - t)}px, 0)`;
    });
  });
  cleanupTasks.push(() => {
    if (!childData) return;
    childData.forEach(({ child }) => { child.style.transform = ''; });
    childData = null;
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

function initElasticCarousel() {
  if (window.innerWidth < 768) return;

  const startMargin = isRtl ? -200 : 200;
  const initialized = new WeakSet();
  let cssDisabled = false;

  const setupContainer = (container) => {
    if (initialized.has(container)) return;
    initialized.add(container);

    if (!cssDisabled) {
      cssDisabled = true;
      injectCSS('.elastic-carousel-container,'
        + '.elastic-carousel-item { animation: none !important; }'
        + '.elastic-carousel-item { flex-shrink: 0; }');
    }

    container.style.willChange = 'margin-left, opacity';
    container.style.opacity = '0';
    container.style.marginLeft = `${startMargin}px`;
    let top = null;
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
      if (top === null) top = getDocTop(container);
      const m = getScrollMetrics(scroll, elHeight, top);

      const slideT = viewRange(m, 'entry', 0.2, 'entry', 0.52);
      const opacT = viewRange(m, 'entry', 0.0, 'entry', 0.16);
      // gap animates from startGap → endGap, starting 10% before slideT begins
      const gapT = Math.max(0, Math.min(1, (slideT + 0.4)));

      container.style.marginLeft = `${startMargin * (1 - slideT)}px`;
      container.style.opacity = opacT;
      itemData.forEach(({ item, startGap, endGap }) => {
        item.style.marginInline = `${lerp(startGap, endGap, gapT)}px`;
      });
    });
    cleanupTasks.push(() => {
      container.style.marginLeft = '';
      container.style.opacity = '';
      container.style.willChange = '';
      top = null;
      if (itemData) { itemData.forEach(({ item }) => { item.style.marginInline = ''; }); itemData = null; }
    });
  };

  document.querySelectorAll('.elastic-carousel-container').forEach(setupContainer);

  observeForNew('.elastic-carousel-container', setupContainer);
}

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
      injectCSS('.carousel-c2 .carousel-wrapper,'
        + '.carousel-c2 .carousel-slide { animation: none !important; }');
    }

    const slides = [...wrapper.querySelectorAll('.carousel-slide')];
    const maxSlideW = parseFloat(getComputedStyle(el).getPropertyValue('--carousel-slide-max-width')) || Infinity;
    let startWidth = Math.min(window.innerWidth, maxSlideW);
    let targetWidth = null;
    let top = null;
    let interacted = false;
    let slideGap = null;
    let animStarted = false;

    const resetStyles = () => {
      animStarted = false;
      slides.forEach((s) => { s.style.flexBasis = ''; s.style.willChange = ''; });
      wrapper.style.transition = '';
      wrapper.style.translate = '';
    };

    window.addEventListener('resize', () => {
      if (interacted) return;
      resetStyles();
      startWidth = Math.min(window.innerWidth, maxSlideW);
      targetWidth = null;
      top = null;
    });

    cleanupTasks.push(() => {
      resetStyles();
      startWidth = Math.min(window.innerWidth, maxSlideW);
      targetWidth = null;
      top = null;
      interacted = false;
      slideGap = null;
    });

    scrollTasks.push((scroll) => {
      if (!interacted && wrapper.getAttribute('data-slides-cloned') === 'true') {
        interacted = true;
        resetStyles();
        return;
      }
      if (interacted) return;

      if (top === null) {
        top = getDocTop(el);
        slideGap = parseFloat(getComputedStyle(wrapper).gap) || 8;
      }

      const elHeight = el.offsetHeight;
      const m = getScrollMetrics(scroll, elHeight, top, 0.1, 0.1);
      const t = viewRange(m, 'entry', -0.5, 'entry', 0.2);

      if (t >= 1) {
        if (animStarted) resetStyles();
        return;
      }

      if (targetWidth === null) {
        targetWidth = slides[0]?.getBoundingClientRect().width || startWidth;
      }

      if (!animStarted) {
        animStarted = true;
        slides.forEach((s) => { s.style.willChange = 'flex-basis'; });
      }

      const w = lerp(startWidth, targetWidth, t);
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

function initLineHeight() {
  const initialized = new WeakSet();

  const setup = (el) => {
    if (initialized.has(el)) return;
    initialized.add(el);
    let childData = null;
    let docTop = null;
    let cachedHeight = el.offsetHeight;
    new ResizeObserver(([entry]) => {
      cachedHeight = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
      docTop = null;
    }).observe(el);

    scrollTasks.push((scroll) => {
      if (!cachedHeight) return;
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
      const m = getScrollMetrics(scroll, cachedHeight, docTop);
      const t = viewRange(m, 'entry', 0.1, 'cover', 0.4);
      childData.forEach(({ child, from, to }) => {
        child.style.setProperty('line-height', t < 1 ? `${lerp(from, to, t)}px` : null);
      });
    });
    cleanupTasks.push(() => {
      if (!childData) return;
      childData.forEach(({ child }) => { child.style.setProperty('line-height', null); });
    });
  };

  document.querySelectorAll('.parallax-line-height').forEach(setup);

  observeForNew('.parallax-line-height', setup);
}

function initGarageDoorReveal() {
  const sections = findSectionsByStyle('parallax-garage-door-reveal');
  if (!sections.length) return;

  injectCSS('.section.parallax-garage-door-reveal,'
    + '.section.parallax-garage-door-reveal .section-background img,'
    + '.section.parallax-garage-door-reveal .foreground,'
    + '.section.parallax-garage-door-reveal .foreground * {'
    + ' animation: none !important; }');

  let growFrom; let revealFrom; let coverEnd; let growStart;

  const updateBreakpoints = () => {
    const w = window.innerWidth;
    const cvh = window.innerHeight;
    growFrom = -0.5 * cvh;
    revealFrom = 0.2 * cvh;
    if (w >= BREAKPOINT_MD) { growFrom = -1.1 * cvh; revealFrom = 0.4 * cvh; }
    if (w >= BREAKPOINT_XL) { growFrom = -0.7 * cvh; revealFrom = 0.3 * cvh; }
    coverEnd = 0.2;
    if (w >= BREAKPOINT_MD) coverEnd = 0.4;
    if (w >= BREAKPOINT_LG) coverEnd = 0.3;
    growStart = -0.5;
    if (w >= BREAKPOINT_MD) growStart = -1;
    if (w >= BREAKPOINT_XL) growStart = -0.5;
  };

  updateBreakpoints();

  sections.forEach((section) => {
    let bgImg = section.querySelector('.section-background img');
    let foreground = section.querySelector('.foreground');
    const state = { docTop: null, fgChildData: null };

    section.style.willChange = 'transform';
    section.style.transform = `translateY(${growFrom}px)`;
    if (bgImg) {
      bgImg.parentElement.style.overflow = 'hidden';
      bgImg.style.willChange = 'transform';
    }
    if (foreground) {
      foreground.style.position = 'relative';
      foreground.style.zIndex = '1';
      foreground.style.willChange = 'transform';
    }

    scrollTasks.push((scroll) => {
      const elHeight = section.offsetHeight;
      if (!elHeight) return;
      if (state.docTop === null) state.docTop = getDocTop(section);

      // bgImg/foreground may load after init — lazy-resolve on first scroll tick
      if (!bgImg) {
        bgImg = section.querySelector('.section-background img');
        if (bgImg) {
          bgImg.parentElement.style.overflow = 'hidden';
          bgImg.style.willChange = 'transform';
        }
      }
      if (!foreground) {
        foreground = section.querySelector('.foreground');
        if (foreground) {
          foreground.style.position = 'relative';
          foreground.style.zIndex = '1';
          foreground.style.willChange = 'transform';
        }
      }

      if (foreground && !state.fgChildData) {
        const nodes = [...foreground.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, span, a')];
        state.fgChildData = nodes.map((c) => {
          const cs = getComputedStyle(c);
          const fontSize = parseFloat(cs.fontSize) || 16;
          const natural = parseFloat(cs.lineHeight) || fontSize * 1.5;
          return { child: c, naturalLh: natural, fromLh: fontSize * 0.72 };
        });
      }

      // use live innerHeight so resize to mobile/desktop doesn't break metrics
      const cvh = window.innerHeight;
      const dist = (scroll + cvh) - state.docTop;
      const total = elHeight + cvh;
      const m = { elHeight, dist, total };
      const { fgChildData } = state;

      const growT = viewRange(m, 'entry', growStart, 'entry', coverEnd);
      section.style.transform = growT < 1 ? `translateY(${growFrom * (1 - growT)}px)` : '';

      // background image scales 1 → 1.1 (garage-door-bg-scale)
      if (bgImg) {
        const bgT = viewRange(m, 'entry', 0, 'cover', 0.7);
        bgImg.style.transform = bgT < 1 ? `scale(${lerp(1, 1.1, bgT)})` : '';
      }

      // foreground slides up from revealFrom → 0 (garage-door-reveal)
      if (foreground) {
        const fgT = viewRange(m, 'entry', -0.2, 'entry', 0.3);
        foreground.style.transform = fgT < 1 ? `translateY(${revealFrom * (1 - fgT)}px)` : '';
      }

      // text line-height compresses → natural (garage-door-line-height)
      if (fgChildData?.length) {
        const lhT = viewRange(m, 'entry', -0.1, 'entry', 0.1);
        fgChildData.forEach(({ child, naturalLh, fromLh }) => {
          child.style.lineHeight = lhT < 1 ? `${lerp(fromLh, naturalLh, lhT)}px` : null;
        });
      }
    });
    cleanupTasks.push(() => {
      section.style.transform = '';
      section.style.willChange = '';
      if (bgImg) { bgImg.style.transform = ''; bgImg.style.willChange = ''; }
      if (foreground) { foreground.style.transform = ''; foreground.style.willChange = ''; }
      if (state.fgChildData) {
        state.fgChildData.forEach(({ child }) => { child.style.lineHeight = null; });
      }
    });
  });
}

export default function init() {
  initMoveUpFast();
  initLineHeight();
  initScaleDownGrid();
  initStagger();
  initElasticCarousel();
  initCarouselC2();
  initGarageDoorReveal();

  window.addEventListener('resize', () => {
    cleanupTasks.forEach((task) => task());
    scrollTasks.length = 0;
  });

  window.lenis.on('scroll', ({ scroll }) => {
    scrollTasks.forEach((task) => task(scroll));
  });
}

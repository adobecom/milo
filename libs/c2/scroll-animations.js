const vh = window.innerHeight;

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
  const effectiveVh = vh * (1 - insetTop - insetBottom);
  const elHeight = el.offsetHeight;
  const dist = (scroll + vh * (1 - insetBottom)) - getDocTop(el);
  const total = elHeight + effectiveVh;
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

function cacheLineHeights(elements) {
  return elements
    .filter((el) => el instanceof Element)
    .map((child) => {
      const computed = getComputedStyle(child)?.lineHeight;
      const fontSize = parseFloat(
        getComputedStyle(child)?.fontSize,
      ) || 16;
      const target = computed === 'normal'
        ? 1.2 : parseFloat(computed) / fontSize;
      return { el: child, target };
    });
}

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

function initGarageDoorReveal() {
  const allSections = [...document.querySelectorAll('.section')];
  const gdSections = allSections.filter(
    (s) => sectionHasStyle(s, 'parallax-garage-door-reveal'),
  );
  const isDesktop = window.innerWidth >= 1280;

  gdSections.forEach((gdSection) => {
    const foreground = gdSection.querySelector('.rich-content > div');
    const bgImg = gdSection.querySelectorAll('img');
    const childLHData = foreground
      ? cacheLineHeights([...foreground.querySelectorAll('*')])
      : [];
    const revealFrom = isDesktop ? 30 : 20;

    window.lenis.on('scroll', ({ scroll }) => {
      const m = getScrollMetrics(scroll, gdSection);

      const coverEnd = isDesktop ? 0.4 : 0.3;
      const growT = viewRange(m, 'entry', 0, 'cover', coverEnd);
      gdSection.style.transform = `translateY(${-80 * (1 - growT)}vh)`;

      if (bgImg.length > 0) {
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
        el.style.lineHeight = innerT >= 1
          ? '' : String(0.6 + (target - 0.6) * innerT);
      });
    });
  });
}

function initParallaxLineHeight() {
  const containers = [
    ...document.querySelectorAll('.parallax-line-height:not(.section)'),
  ];
  const textSelector = 'h1, h2, h3, h4, h5, h6, p, li, a, span';
  containers.forEach((block) => {
    let childData = null;

    window.lenis.on('scroll', ({ scroll }) => {
      if (!childData) {
        const textEls = [...block.querySelectorAll(textSelector)];
        if (!textEls.length) return;
        childData = cacheLineHeights(textEls);
      }
      const m = getScrollMetrics(scroll, block);
      const t = viewRange(m, 'entry', 0.2, 'cover', 0.6);
      childData.forEach(({ el, target }) => {
        el.style.lineHeight = t >= 1
          ? '' : String(3 + (target - 3) * t);
      });
    });
  });
}

function initScaleDownGrid() {
  const allSections = [...document.querySelectorAll('.section')];
  const grids = allSections.filter(
    (s) => sectionHasStyle(s, 'parallax-scale-down-grid'),
  );
  console.log('grids', grids);
  grids.forEach((grid) => {
    const container = grid.closest('.container') || grid.parentElement;
    const cs = getComputedStyle(container);
    const targetMaxW = parseFloat(
      cs.getPropertyValue('--grid-max-width-target'),
    ) || 1440;
    const marginTarget = parseFloat(
      cs.getPropertyValue('--grid-margin-width-target'),
    ) || 24;

    const marginStr = cs.getPropertyValue('--grid-margin-width-target').trim();
    const isPercent = marginStr.includes('%');

    window.lenis.on('scroll', ({ scroll }) => {
      // view(block 40% 10%) = 40% inset top, 10% inset bottom
      const m = getScrollMetrics(scroll, grid, 0.4, 0.1);
      const t = viewRange(m, 'entry', 0, 'entry', 1);
      const width = grid.offsetWidth;
      const margin = isPercent
        ? (parseFloat(marginStr) / 100) * width
        : marginTarget;
      const targetPad = Math.max(margin, (width - targetMaxW) / 2);
      const pad = targetPad * t;
      grid.style.paddingInline = `${pad}px`;
    });
  });
}

export default function init() {
  initMoveUpFast();
  initGarageDoorReveal();
  initParallaxLineHeight();
  initScaleDownGrid();
}

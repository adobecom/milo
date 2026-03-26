const vh = window.innerHeight;

const getDocTop = (el) => {
  let top = el.offsetTop;
  let parent = el.offsetParent;
  while (parent) { top += parent.offsetTop; parent = parent.offsetParent; }
  return top;
};

const viewRange = (scroll, el, sType, sPct, eType, ePct) => {
  const sHeight = el.offsetHeight;
  const dist = (scroll + vh) - getDocTop(el);
  const total = sHeight + vh;
  const s = sType === 'entry' ? sHeight * sPct : total * sPct;
  const e = eType === 'entry' ? sHeight * ePct : total * ePct;
  return Math.max(0, Math.min(1, (dist - s) / (e - s)));
};

const sectionHasStyle = (section, style) => {
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
};

const cacheLineHeights = (elements) => elements
  .filter((el) => el instanceof Element)
  .map((child) => {
    const computed = getComputedStyle(child)?.lineHeight;
    const fontSize = parseFloat(getComputedStyle(child)?.fontSize) || 16;
    const target = computed === 'normal'
      ? 1.2 : parseFloat(computed) / fontSize;
    return { el: child, target };
  });

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
  gdSections.forEach((gdSection) => {
    const foreground = gdSection.querySelector('.rich-content > div');
    const bgImg = gdSection.querySelectorAll('img');
    const isDesktop = window.innerWidth >= 1280;
    const childLHData = foreground
      ? cacheLineHeights([...foreground.querySelectorAll('*')]) : [];

    window.lenis.on('scroll', ({ scroll }) => {
      const growT = viewRange(
        scroll,
        gdSection,
        'entry',
        0,
        'cover',
        isDesktop ? 0.4 : 0.3,
      );
      gdSection.style.transform = `translateY(${-80 * (1 - growT)}vh)`;

      if (bgImg.length > 0) {
        const scaleT = viewRange(
          scroll,
          gdSection,
          'entry',
          0,
          'entry',
          0.8,
        );
        bgImg.forEach((img) => {
          img.style.transform = `scale(${1 + 0.1 * scaleT})`;
        });
      }

      if (foreground) {
        let revealFrom = 20;
        if (window.innerWidth >= 1280) revealFrom = 30;
        const revealT = viewRange(
          scroll,
          gdSection,
          'entry',
          0.3,
          'entry',
          0.7,
        );
        foreground.style.transform = `translateY(${revealFrom * (1 - revealT)}vh)`;
      }

      const lhT = viewRange(
        scroll,
        gdSection,
        'entry',
        0.3,
        'entry',
        0.7,
      );
      childLHData.forEach(({ el, target }) => {
        el.style.lineHeight = lhT >= 1
          ? '' : String(0.6 + (target - 0.6) * lhT);
      });
    });
  });
}

function initParallaxLineHeight() {
  const containers = [
    ...document.querySelectorAll('.parallax-line-height'),
  ];
  containers.forEach((container) => {
    const childData = cacheLineHeights(
      [...container.querySelectorAll('*')],
    );

    window.lenis.on('scroll', ({ scroll }) => {
      const t = viewRange(
        scroll,
        container,
        'entry',
        0.1,
        'cover',
        0.4,
      );
      childData.forEach(({ el, target }) => {
        el.style.lineHeight = t >= 1
          ? '' : String(3 + (target - 3) * t);
      });
    });
  });
}

export default function init() {
  initMoveUpFast();
  initGarageDoorReveal();
  initParallaxLineHeight();
}

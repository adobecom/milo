import { createTag } from '../../utils/utils.js';

const arrowSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="none">
<path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const getSlidesData = (el) => {
  const getText = (root, selector) => (root?.querySelector(selector)?.textContent || '').trim();

  const getLink = (a) => {
    if (!a) return '';
    return a.getAttribute('href') || a.href || '';
  };

  const getPictureSrc = (root) => {
    const img = root?.querySelector('picture img') || root?.querySelector('img');
    if (img) return img.currentSrc || img.src || '';

    const source = root?.querySelector('picture source[srcset]');
    if (!source) return '';
    const srcset = source.getAttribute('srcset') || '';
    return srcset.split(',')[0]?.trim().split(' ')[0] || '';
  };

  const slideEls = Array.from(el?.children || []).filter((n) => n.nodeType === Node.ELEMENT_NODE);

  return slideEls.map((slideEl) => {
    const cols = slideEl.querySelectorAll(':scope > div');
    const coverCol = cols[0] || null;
    const textCol = cols[1] || null;
    const logoCol = cols[2] || null;

    const boxAnchor = textCol?.querySelector('h3 a') || null;
    const ctaAnchors = Array.from(textCol?.querySelectorAll('p a') || []);

    const cta1 = ctaAnchors[0] || null;
    const cta2 = ctaAnchors[1] || null;

    return {
      slideCover: getPictureSrc(coverCol),
      title: getText(textCol, 'h1'),
      subtitle: getText(textCol, 'h2'),
      cta1Text: (cta1?.textContent || '').trim(),
      cta2Text: (cta2?.textContent || '').trim(),
      cta1Link: getLink(cta1),
      cta2Link: getLink(cta2),
      boxLogo: getPictureSrc(logoCol),
      boxText: (boxAnchor?.textContent || '').trim(),
      boxLink: getLink(boxAnchor),
    };
  });
};

const getSlideHtml = (slide, index) => {
  const coverImg = createTag('img', {
    class: 'mm-cover',
    src: slide.slideCover || '',
    alt: '',
    loading: index === 0 ? 'eager' : 'lazy',
  });

  const title = createTag('h2', { class: 'mm-title' }, slide.title || '');
  const subtitle = createTag('p', { class: 'mm-subtitle' }, slide.subtitle || '');

  const ctas = createTag('div', { class: 'mm-ctas' });
  const cta1 = createTag('a', { class: 'mm-cta mm-cta-primary', href: slide.cta1Link || '' }, slide.cta1Text || '');
  const cta2 = createTag('a', { class: 'mm-cta mm-cta-secondary', href: slide.cta2Link || '' }, slide.cta2Text || '');
  if (slide.cta1Text && slide.cta1Link) ctas.append(cta1);
  if (slide.cta2Text && slide.cta2Link) ctas.append(cta2);

  const content = createTag('div', { class: 'mm-content' }, [title, subtitle, ctas]);

  return createTag('div', { class: 'mm-slide', 'data-index': String(index) }, [
    coverImg,
    createTag('div', { class: 'mm-overlay', 'aria-hidden': 'true' }),
    content,
  ]);
};

const getNavItem = (slide, index, total) => {
  const btn = createTag('button', {
    class: 'mm-nav-item',
    type: 'button',
    'data-index': String(index),
    role: 'tab',
    tabindex: index === 0 ? '0' : '-1',
    'aria-selected': index === 0 ? 'true' : 'false',
    'aria-label': slide.boxText || `Slide ${index + 1} of ${total}`,
  });

  const logoImg = createTag('img', {
    class: 'mm-nav-logo-img',
    src: slide.boxLogo || '',
    alt: '',
    loading: 'lazy',
  });

  btn.append(
    createTag('span', { class: 'mm-nav-logo', 'aria-hidden': 'true' }, logoImg),
    createTag('span', { class: 'mm-nav-meta' }, [
      createTag('span', { class: 'mm-nav-label' }, slide.boxText || ''),
      createTag('span', { class: 'mm-nav-arrow', 'aria-hidden': 'true' }, arrowSvg),
    ]),
    createTag('span', { class: 'mm-progress', 'aria-hidden': 'true' }, [
      createTag('span', { class: 'mm-progress-fill' }),
    ]),
  );
  return btn;
};

export default function init(el) {
  const slidesData = getSlidesData(el);
  if (!slidesData.length) return;

  el.classList.add('mm');

  const durationMs = Number(el.dataset.duration || 6000);
  el.style.setProperty('--mm-duration', `${durationMs}ms`);

  const stage = createTag('div', { class: 'mm-stage', role: 'region', 'aria-label': 'Multimedia marquee' });
  const slides = slidesData.map((slide, i) => getSlideHtml(slide, i));
  stage.append(...slides);

  const nav = createTag('div', { class: 'mm-nav', role: 'tablist', 'aria-label': 'Slides' });
  const tabs = slidesData.map((slide, i) => getNavItem(slide, i, slidesData.length));
  nav.append(...tabs);

  el.replaceChildren(stage, nav);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let timerId;

  const restartProgress = (tabEl) => {
    const fill = tabEl?.querySelector('.mm-progress-fill');
    if (!fill) return;
    fill.style.animation = 'none';
    // Force reflow to restart animation reliably
    fill.getBoundingClientRect();
    if (prefersReducedMotion) fill.style.animation = 'none';
    else fill.style.removeProperty('animation');
  };

  const setActive = (nextIndex) => {
    const bounded = ((nextIndex % slides.length) + slides.length) % slides.length;
    if (bounded === activeIndex) {
      restartProgress(tabs[activeIndex]);
      return;
    }

    slides[activeIndex]?.classList.remove('is-active');
    tabs[activeIndex]?.classList.remove('is-active');
    tabs[activeIndex]?.setAttribute('aria-selected', 'false');
    tabs[activeIndex]?.setAttribute('tabindex', '-1');

    activeIndex = bounded;

    slides[activeIndex]?.classList.add('is-active');
    tabs[activeIndex]?.classList.add('is-active');
    tabs[activeIndex]?.setAttribute('aria-selected', 'true');
    tabs[activeIndex]?.setAttribute('tabindex', '0');

    restartProgress(tabs[activeIndex]);
  };

  const scheduleNext = () => {
    if (prefersReducedMotion || slides.length < 2) return;
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      setActive(activeIndex + 1);
      scheduleNext();
    }, durationMs);
  };

  // initial active
  slides[0]?.classList.add('is-active');
  tabs[0]?.classList.add('is-active');
  restartProgress(tabs[0]);
  scheduleNext();

  const activateByIndex = (i) => {
    setActive(i);
    scheduleNext();
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('mouseenter', () => activateByIndex(i));
    tab.addEventListener('focus', () => activateByIndex(i));
    tab.addEventListener('click', () => activateByIndex(i));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const next = (activeIndex + dir + tabs.length) % tabs.length;
      tabs[next]?.focus();
      activateByIndex(next);
    });
  });
}

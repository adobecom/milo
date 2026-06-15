import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

// Each STACK_REF_DESKTOP / STACK_REF_MOBILE entry positions one card in the pile:
//   dx, dy = top-left offset in px
//   w, h   = card size in px
//   rot    = rotation in degrees (negative = counter-clockwise)
const STACK_REF_DESKTOP = [
  { dx: 40, dy: 116, w: 418, h: 489, rot: -6 },
  { dx: 172, dy: -25, w: 535.885, h: 666, rot: -2 },
  { dx: -30, dy: 290, w: 304, h: 324, rot: -15 },
  { dx: 400, dy: 240, w: 418, h: 455, rot: 3 },
];
const STACK_REF_MOBILE = [
  { dx: -65, dy: 60, w: 272, h: 318, rot: -6 },
  { dx: 22, dy: -16, w: 318, h: 433, rot: -2 },
  { dx: -120, dy: 165, w: 280, h: 300, rot: -15 },
  { dx: 160, dy: 120, w: 367, h: 400, rot: 3 },
];
const PILE_X_OFFSET_MOBILE = 54;
const PILE_GAP_DESKTOP = 84;
const PILE_GAP_MOBILE = 80;
const FOCUS_REMOVE_THRESHOLD = 10;
const CARD_SHADOWS = [
  null,
  '25px 25px 54px 0px rgba(0,0,0,0.20)',
  '25px 25px 54px 0px rgba(0,0,0,0.20)',
  '25px 25px 54px 0px rgba(0,0,0,0.20)',
];
const CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="none" aria-hidden="true" focusable="false">
  <path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const isSvgSrc = (src) => /\.svg(\?.*)?$/i.test(src || '');
const isVideoSrc = (src) => /\.(mp4|webm)(\?.*)?$/i.test(src || '');

const clamp01 = (v) => Math.max(0, Math.min(1, v));
const isRtl = (el) => getComputedStyle(el).direction === 'rtl';
const isMobile = () => window.matchMedia('(width < 768px)').matches;
const isDesktop = () => window.matchMedia('(width >= 1280px)').matches;
const isZoomedIn = () => window.matchMedia('(height < 500px)').matches;

function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const heroRow = rows[0];
  const heroCell = heroRow.children[0];
  if (!heroCell) return;

  decorateBlockText(heroCell, { heading: '1', body: 'lg', button: 'lg' });
  heroCell.classList.add('hero-content');
  const mainHeading = heroCell.querySelector(':is(h2, h3, h4, h5, h6)');
  if (mainHeading) mainHeading.replaceWith(createTag('h1', { class: mainHeading.className }, mainHeading.innerHTML));

  const svgImg = [...heroCell.querySelectorAll('img')].find((img) => isSvgSrc(img.getAttribute('src')));
  const heroEyebrow = heroCell.querySelector('.eyebrow');
  if (svgImg && heroEyebrow) {
    const pictureEl = svgImg.closest('p');
    heroEyebrow.classList.add('app-icon');
    svgImg.src = getFederatedUrl(svgImg.src);
    svgImg.alt = '';
    svgImg.classList.add('app-icon-img');
    heroEyebrow.prepend(svgImg);
    if (pictureEl && pictureEl !== heroEyebrow) pictureEl.remove();
  }

  const heroSection = createTag('div', { class: 'hero' });
  heroSection.append(heroCell);
  heroRow.replaceWith(heroSection);

  const whatIncluded = createTag('div', { class: 'what-included' });
  const headingRow = rows[1];
  if (headingRow?.children.length === 1) {
    const headingCell = headingRow.children[0];
    decorateBlockText(headingCell, { heading: '2' });
    const eyebrowEl = headingCell.querySelector(':is(h1, h2, h3, h4, h5, h6)');
    if (eyebrowEl) {
      eyebrowEl.classList.add('hero-eyebrow');
      whatIncluded.append(eyebrowEl);
    }
    headingRow.remove();
  }

  const cardsEl = createTag('div', { class: 'hero-cards' });
  rows.slice(2).forEach((row) => {
    if (row.children.length !== 2) return;
    const [textCell, mediaCell] = row.children;

    decorateBlockText(textCell, { heading: '6', body: 'md' });
    const heading = textCell.querySelector(':is(h1, h2, h3, h4, h5, h6)');
    heading?.classList.add('hero-card-title');
    const paras = [...textCell.querySelectorAll('p')];
    paras.forEach((p) => p.classList.add('hero-card-body-text'));

    const media = createTag('div', { class: 'hero-card-media' });
    while (mediaCell.firstChild) media.append(mediaCell.firstChild);

    const posterImg = media.querySelector('img');
    const videoSrc = posterImg?.getAttribute('alt') || '';
    if (isVideoSrc(videoSrc)) {
      posterImg.alt = '';
      if (!reducedMotion) {
        const videoEl = createTag('video', {
          src: videoSrc,
          poster: posterImg.getAttribute('src') || '',
          playsinline: '',
          muted: '',
          preload: 'metadata',
          tabindex: '-1',
          'aria-hidden': 'true',
        });
        videoEl.muted = true;
        videoEl.addEventListener('loadedmetadata', () => {
          try { videoEl.currentTime = 0.001; } catch (e) { /* */ }
        }, { once: true });
        (posterImg.closest('picture') || posterImg).replaceWith(videoEl);
        const fade = createTag('div', { class: 'hero-card-media-fade' });
        media.append(fade);
      }
    }

    const learnMore = textCell.querySelector('a');
    if (learnMore) {
      learnMore.classList.add('learn-more', 'label');
      const trailing = learnMore.nextSibling;
      if (trailing instanceof Text) {
        trailing.textContent = trailing.textContent.replace(/^[\s.,;:!?]+/, '');
      }
      learnMore.insertAdjacentHTML('beforeend', CHEVRON);
      learnMore.remove();
    }
    const bodyParas = paras.filter((p) => p.textContent.trim() !== '');

    const cardText = createTag('div', { class: 'hero-card-text' });
    const textWrapper = createTag('div', { class: 'hero-card-text-wrapper' });
    if (heading) textWrapper.append(heading);
    textWrapper.append(...bodyParas);
    cardText.append(textWrapper);
    if (learnMore) cardText.append(learnMore);

    const tile = learnMore
      ? createTag('a', { class: 'hero-card-tile', href: learnMore.href, 'data-tracking-label': heading?.textContent })
      : createTag('div', { class: 'hero-card-tile' });
    if (learnMore) learnMore.setAttribute('tabindex', '-1');
    tile.append(media, cardText);

    const card = createTag('div', { class: 'hero-card' });
    card.append(tile);
    cardsEl.append(card);
    row.remove();
  });

  whatIncluded.append(cardsEl);
  block.append(whatIncluded);
}

function initAnimation(block) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  block.classList.add('cards-animating');

  let heroContent;
  let eyebrow;
  let cards = [];
  let tiles = [];
  let medias = [];
  let videos = [];
  let fades = [];
  let cardTexts = [];

  function refreshRefs() {
    heroContent = block.querySelector('.hero-content');
    eyebrow = block.querySelector('.hero-eyebrow');
    cards = [...block.querySelectorAll('.hero-card')];
    tiles = [...block.querySelectorAll('.hero-card-tile')];
    medias = [...block.querySelectorAll('.hero-card-media')];
    videos = [...block.querySelectorAll('.hero-card-media video')];
    fades = [...block.querySelectorAll('.hero-card-media-fade')];
    cardTexts = [...block.querySelectorAll('.hero-card-title, .hero-card-body-text, .learn-more')];
  }

  refreshRefs();
  if (tiles.length !== 4) return;

  let naturalBoxes = [];
  let stackBoxes = [];
  let rtl = false;
  let isSettled = false;
  let videoObserver = null;
  let rafId = 0;
  let running = false;
  let needsReset = false;

  const shadowEls = tiles.map((tile, i) => {
    if (!CARD_SHADOWS[i]) return null;
    const el = createTag('div', { class: 'hero-card-pile-shadow' });
    tile.parentElement.insertBefore(el, tile);
    return el;
  });
  const layout = {
    cardDocTop: 0, mediaDocTop: 0, animStart: 0, animEnd: 0, eyebrowDocY: 0, pileTy0: 0,
  };

  function onMediaVisible(entry) {
    const mediaIdx = medias.indexOf(entry.target);
    const video = videos[mediaIdx];
    if (!entry.isIntersecting) return;
    if (video && !video.ended) video.play()?.catch(() => {});
    const card = entry.target.closest('.hero-card');
    if (!card || card.dataset.textFaded) return;
    card.dataset.textFaded = '1';
    const texts = [...card.querySelectorAll('.hero-card-title, .hero-card-body-text, .learn-more')];
    texts.forEach((el, j) => {
      el.style.transition = `opacity 0.5s ease-in ${200 + j * 150}ms`;
      el.style.opacity = '1';
    });
  }

  function setSettled(animationDone) {
    if (isSettled === animationDone) return;
    isSettled = animationDone;
    block.classList.toggle('cards-animating', !animationDone);

    if (!animationDone) {
      videoObserver?.disconnect();
      videoObserver = null;
      needsReset = true;
      return;
    }

    fades.forEach((fade) => { fade.style.transition = 'none'; fade.style.opacity = '0'; });
    if (needsReset) {
      needsReset = false;
      videos.forEach((video) => { video.pause(); video.currentTime = 0.001; });
    }
    videoObserver = new IntersectionObserver(
      (entries) => entries.forEach(onMediaVisible),
      { threshold: isZoomedIn() ? 0.3 : 0.7 },
    );
    medias.filter(Boolean).forEach((media) => videoObserver.observe(media));
  }

  function getProgress() {
    const range = layout.animEnd - layout.animStart;
    if (range <= 0) return 0;
    return clamp01((window.scrollY - layout.animStart) / range);
  }

  function setupScrollDrivenProps() {
    const pileGap = isMobile() ? PILE_GAP_MOBILE : PILE_GAP_DESKTOP;
    layout.animEnd = layout.cardDocTop - pileGap;
    const animRange = `${layout.animStart}px ${layout.animEnd}px`;
    const contentEnd = layout.animStart + (layout.animEnd - layout.animStart) * 0.6;

    tiles.forEach((tile, i) => {
      const natural = naturalBoxes[i];
      const stack = stackBoxes[i];
      const scaleVal = Math.min(stack.w / natural.w, stack.h / natural.h);
      const txTarget = rtl
        ? (stack.x + stack.w) - (natural.x + natural.w)
        : stack.x - natural.x;
      [tile, shadowEls[i]].filter(Boolean).forEach((el) => {
        el.style.setProperty('--pile-tx', `${txTarget}px`);
        el.style.setProperty('--pile-ty', `${stack.y - natural.y}px`);
        el.style.setProperty('--pile-rot', `${stack.rot}deg`);
        el.style.setProperty('--pile-scale', `${scaleVal}`);
        el.style.setProperty('animation-range', animRange);
      });
    });

    heroContent?.style.setProperty('animation-range', `${layout.animStart}px ${contentEnd}px`);

    layout.pileTy0 = stackBoxes[0].y - naturalBoxes[0].y;

    block.classList.add('scroll-driven-ready');
    if (!eyebrow) return;

    const eyebrowH = eyebrow.offsetHeight;
    const eyebrowGap = parseFloat(getComputedStyle(eyebrow).getPropertyValue('--hero-eyebrow-gap'));
    layout.eyebrowDocY = layout.cardDocTop - eyebrowH - eyebrowGap;
    const threshold = isMobile() ? 0.15 : 0.6;
    const fadeStart = layout.animStart + (layout.animEnd - layout.animStart) * threshold;
    eyebrow.style.setProperty('animation-range', `${fadeStart}px ${fadeStart + 50}px`);
  }

  function computeLayouts() {
    block.classList.remove('scroll-driven-ready');
    naturalBoxes = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    });
    layout.cardDocTop = window.scrollY + naturalBoxes[0].y;
    layout.mediaDocTop = window.scrollY + medias[0].getBoundingClientRect().top;

    const vw = window.innerWidth;
    const stackRef = isMobile() ? STACK_REF_MOBILE : STACK_REF_DESKTOP;
    const pileMin = Math.min(...stackRef.map((r) => r.dx));
    const pileMax = Math.max(...stackRef.map((r) => r.dx + r.w));
    const pileTopDy = Math.min(...stackRef.map((r) => r.dy));
    const gap = isDesktop() ? PILE_GAP_DESKTOP : PILE_GAP_MOBILE;
    const stackTop = heroContent.getBoundingClientRect().bottom + gap - pileTopDy;
    const xOffset = isMobile() ? PILE_X_OFFSET_MOBILE : 0;
    const stackLeft = vw / 2 - ((pileMin + pileMax) / 2) + xOffset;
    rtl = isRtl(block);
    stackBoxes = stackRef.map((ref) => ({
      x: stackLeft + (rtl ? pileMax - ref.dx - ref.w : ref.dx),
      y: stackTop + ref.dy,
      w: ref.w,
      h: ref.h,
      rot: rtl ? -ref.rot : ref.rot,
    }));

    setupScrollDrivenProps();
  }

  function tick() {
    if (!running) return;

    const progress = getProgress();

    if (eyebrow) eyebrow.style.transform = `translateY(${layout.eyebrowDocY - window.scrollY + layout.pileTy0 * (1 - progress)}px)`;
    setSettled(progress >= 0.85);

    if (needsReset && progress <= 0.1) {
      needsReset = false;
      cards.forEach((card) => { delete card.dataset.textFaded; });
      cardTexts.forEach((textEl) => { textEl.style.transition = 'none'; textEl.style.opacity = '0'; });
      videos.forEach((video, i) => {
        video.pause();
        video.currentTime = 0.001;
        const fade = fades[i];
        if (!fade) return;
        fade.style.transition = 'none';
        fade.style.opacity = '1';
        fade.getBoundingClientRect();
        fade.style.transition = 'opacity 1s ease-in';
        fade.style.opacity = '0';
      });
    }

    rafId = requestAnimationFrame(tick);
  }

  function setup() {
    if (tiles[0] && !block.contains(tiles[0])) {
      refreshRefs();
      if (videoObserver) { videoObserver.disconnect(); videoObserver = null; }
      isSettled = false;
    }
    if (tiles.length !== 4) return;
    computeLayouts();
  }

  requestAnimationFrame(() => requestAnimationFrame(setup));

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) {
      running = false;
      cancelAnimationFrame(rafId);
      return;
    }
    if (running) return;
    running = true;
    tick();
  }, { rootMargin: '200px 0px' });
  io.observe(block);

  let scrollOrigin;
  window.addEventListener('scroll', () => {
    if (!document.activeElement?.matches('a.hero-card-tile')) return;
    scrollOrigin ??= window.scrollY;
    if (scrollOrigin - window.scrollY > FOCUS_REMOVE_THRESHOLD) {
      document.activeElement.blur();
      scrollOrigin = null;
    }
  }, { passive: true });

  let resizeTimer;
  const reSetup = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(setup, 120); };
  new ResizeObserver(reSetup).observe(block);
  window.addEventListener('resize', reSetup);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  initAnimation(el);
}

import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

// Pile composition from Figma spec.
// STACK_W is the design canvas width in px — the reference frame all
// STACK_REF offsets and sizes are measured against.
// Each STACK_REF entry positions one card within that canvas:
//   dx, dy = top-left offset in px
//   w, h   = card size in px
//   rot    = rotation in degrees (negative = counter-clockwise)
// At runtime, values are scaled by `stackScale` to fit the viewport,
// centered horizontally, and mirrored for RTL (see computeLayouts).
// Card order here matches DOM order (i.e., authored row order).
const STACK_W = 836;
const STACK_REF = [
  { dx: 90.94, dy: 116.93, w: 418.531, h: 489.484, rot: -6 },
  { dx: 202.94, dy: 0, w: 535.885, h: 666.645, rot: -2 },
  { dx: 36.78, dy: 275.30, w: 304.543, h: 324.33, rot: -15 },
  { dx: 417.44, dy: 272.79, w: 418.531, h: 455.136, rot: 3 },
];
const CARD_SHADOWS = [
  null,
  '25px 25px 54px 0px rgba(0,0,0,0.20)',
  '15px 15px 15px 0px rgba(0,0,0,0.25)',
  '0px 2.75px 2.89px rgba(0,0,0,0.053),0px 6.60px 6.95px rgba(0,0,0,0.077),0px 12.43px 13.09px rgba(0,0,0,0.095),0px 22.18px 23.35px rgba(0,0,0,0.113),0px 41.49px 43.67px rgba(0,0,0,0.137),0px 99.30px 104.53px rgba(0,0,0,0.190)',
];
const INSET_SHADOW = 'inset 0 0 0 2px rgba(255,255,255,0.10)';
const CHEVRON = `<svg xmlns="http://www.w3.org/2000/svg" width="5" height="8" viewBox="0 0 5 8" fill="none" aria-hidden="true" focusable="false">
  <path d="M0.75 6.75L3.75 3.75L0.75 0.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
const isSvgSrc = (src) => /\.svg(\?.*)?$/i.test(src || '');
const isVideoSrc = (src) => /\.(mp4|webm)(\?.*)?$/i.test(src || '');

const lerp = (from, to, amount) => from + (to - from) * amount;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const isRtl = (el) => getComputedStyle(el).direction === 'rtl';
const fadeShadow = (shadow, factor) => shadow.replace(/rgba\(([^)]+)\)/g, (_match, args) => {
  const [r, g, b, a] = args.split(',').map((part) => part.trim());
  return `rgba(${r},${g},${b},${parseFloat(a) * factor})`;
});

function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const heroRow = rows[0];
  const heroCell = heroRow.children[0];
  if (!heroCell) return;

  decorateBlockText(heroCell, { heading: '1', body: 'lg', button: 'lg' });
  heroCell.classList.add('hero-content');

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

    const tile = createTag('div', { class: 'hero-card-tile' });
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
  let willChangeOn = false;
  let videoObserver = null;
  let rafId = 0;
  let running = false;
  let needsReset = false;
  const gnav = document.querySelector('header');

  function positionContent() {
    if (!heroContent || !gnav) return;
    heroContent.parentElement.style.paddingTop = `${gnav.getBoundingClientRect().bottom + 124}px`;
  }

  function setSettled(next) {
    if (isSettled === next) return;
    isSettled = next;
    if (next) {
      fades.forEach((fade) => { fade.style.transition = 'none'; fade.style.opacity = '0'; });
      if (needsReset) {
        needsReset = false;
        videos.forEach((video) => { video.currentTime = 0.001; });
      }
      videoObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const video = videos[medias.indexOf(entry.target)];
          if (!video || !entry.isIntersecting || video.ended) return;
          video.play()?.catch(() => {});
        });
      }, { threshold: 0.7 });
      medias.filter(Boolean).forEach((media) => videoObserver.observe(media));
      return;
    }
    videoObserver?.disconnect();
    videoObserver = null;
    needsReset = true;
  }

  function getProgress() {
    if (!cards[0]) return 0;
    const navBottom = gnav ? gnav.getBoundingClientRect().bottom : 72;
    const slotTargetTop = Math.round(navBottom + 124) + 60;
    const startY = window.innerHeight;
    const range = startY - slotTargetTop;
    if (range <= 0) return 0;
    return clamp01((startY - cards[0].getBoundingClientRect().top) / range);
  }

  function applyAnimation(progress) {
    if (heroContent) {
      const contentFade = clamp01(progress / 0.6);
      heroContent.style.opacity = String(1 - contentFade);
      heroContent.style.transform = `translateY(${-80 * contentFade}px)`;
    }

    tiles.forEach((tile, i) => {
      const natural = naturalBoxes[i];
      const stack = stackBoxes[i];
      const sx = lerp(stack.w / natural.w, 1, progress);
      const sy = lerp(stack.h / natural.h, 1, progress);
      const txTarget = rtl
        ? (stack.x + stack.w) - (natural.x + natural.w)
        : stack.x - natural.x;
      const tx = lerp(txTarget, 0, progress);
      const ty = lerp(stack.y - natural.y, 0, progress);
      const rot = lerp(stack.rot, 0, progress);
      tile.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${sx}, ${sy})`;
      if (!CARD_SHADOWS[i]) return;
      tile.style.boxShadow = `${fadeShadow(CARD_SHADOWS[i], 1 - progress)}, ${INSET_SHADOW}`;
    });

    cardTexts.forEach((textEl, i) => {
      const textProgress = clamp01((progress - (0.6 + i * 0.025)) / 0.2);
      textEl.style.opacity = String(1 - (1 - textProgress) * (1 - textProgress));
    });

    const animating = progress > 0.001 && progress < 0.999;
    if (animating === willChangeOn) return;
    willChangeOn = animating;
    tiles.forEach((tile) => { tile.style.willChange = animating ? 'transform' : ''; });
  }

  function updateEyebrow(progress) {
    if (!eyebrow) return;
    if (medias[0]) {
      const gap = parseFloat(getComputedStyle(eyebrow).getPropertyValue('--hero-eyebrow-gap')) || 24;
      const offset = medias[0].getBoundingClientRect().top - eyebrow.offsetHeight - gap;
      eyebrow.style.transform = `translateY(${offset}px)`;
    }
    eyebrow.classList.toggle('is-visible', progress >= 0.7);
  }

  function computeLayouts() {
    tiles.forEach((tile) => { tile.style.transform = ''; });
    if (heroContent) { heroContent.style.opacity = ''; heroContent.style.transform = ''; }
    cardTexts.forEach((textEl) => { textEl.style.opacity = ''; });

    naturalBoxes = cards.map((card) => {
      const rect = card.getBoundingClientRect();
      return { x: rect.left, y: rect.top, w: rect.width, h: rect.height };
    });

    const vw = window.innerWidth;
    const contentBottom = heroContent ? heroContent.getBoundingClientRect().bottom : 540;
    const stackTop = contentBottom + 74;
    const stackScale = vw < 768 ? Math.max((vw - 48) / STACK_W, 0.3) : 1;
    const stackLeft = (vw - STACK_W * stackScale) / 2;
    rtl = isRtl(block);
    stackBoxes = STACK_REF.map((ref) => ({
      x: stackLeft + (rtl ? STACK_W - ref.dx - ref.w : ref.dx) * stackScale,
      y: stackTop + ref.dy * stackScale,
      w: ref.w * stackScale,
      h: ref.h * stackScale,
      rot: rtl ? -ref.rot : ref.rot,
    }));

    applyAnimation(getProgress());
  }

  function tick() {
    if (!running) return;
    const progress = getProgress();
    applyAnimation(progress);
    updateEyebrow(progress);

    setSettled(progress >= 0.85);

    if (needsReset && progress <= 0.1) {
      needsReset = false;
      videos.forEach((video, i) => {
        video.currentTime = 0.001;
        const fade = fades[i];
        if (!fade) return;
        fade.style.transition = 'none';
        fade.style.opacity = '1';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          fade.style.transition = 'opacity 0.5s ease-in';
          fade.style.opacity = '0';
        }));
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
    positionContent();
    computeLayouts();
    updateEyebrow(getProgress());
  }

  setup();

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

  let resizeTimer;
  const reSetup = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(setup, 120); };
  new ResizeObserver(reSetup).observe(block);
  window.addEventListener('resize', reSetup);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  initAnimation(el);
}

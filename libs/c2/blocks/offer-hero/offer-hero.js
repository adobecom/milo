import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag, getFederatedUrl } from '../../../utils/utils.js';

const STACK_W = 722;
const STACK_REF = [
  { dx: 55.47, dy: 96.86, w: 358, h: 419, rot: -6 },
  { dx: 167.35, dy: -14.85, w: 458, h: 570, rot: 2 },
  { dx: -1.41, dy: 249.91, w: 261, h: 277, rot: -14 },
  { dx: 366.10, dy: 201.23, w: 358, h: 389, rot: 3 },
];
const CARD_SHADOWS = [
  null,
  '25px 25px 54px 0px rgba(0,0,0,0.20)',
  '15px 15px 15px 0px rgba(0,0,0,0.25)',
  '0px 2.75px 2.89px rgba(0,0,0,0.053),0px 6.60px 6.95px rgba(0,0,0,0.077),0px 12.43px 13.09px rgba(0,0,0,0.095),0px 22.18px 23.35px rgba(0,0,0,0.113),0px 41.49px 43.67px rgba(0,0,0,0.137),0px 99.30px 104.53px rgba(0,0,0,0.190)',
];
const INSET_SHADOW = 'inset 0 0 0 2px rgba(255,255,255,0.10)';
const isSvgSrc = (src) => /\.svg(\?.*)?$/i.test(src || '');
const isVideoSrc = (src) => /\.(mp4|webm)(\?.*)?$/i.test(src || '');

const lerp = (from, to, amount) => from + (to - from) * amount;
const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};
// All CARD_SHADOWS_OUT differ from CARD_SHADOWS only in alpha (zeroed). Scale
// every rgba alpha in the shadow string by `factor` to interpolate.
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
  heroCell.classList.add('hero-copy');

  // Milo auto-decorates <a href="…svg"> to <picture><img src="…svg">; detect by src.
  const svgImg = [...heroCell.querySelectorAll('img')].find((img) => isSvgSrc(img.getAttribute('src')));
  const heroEyebrow = heroCell.querySelector('.eyebrow');
  if (svgImg && heroEyebrow) {
    const picturePara = svgImg.closest('p');
    heroEyebrow.classList.add('app-icon');
    heroEyebrow.prepend(createTag('img', {
      src: getFederatedUrl(svgImg.getAttribute('src')),
      alt: '',
      class: 'app-icon-img',
    }));
    if (picturePara && picturePara !== heroEyebrow) picturePara.remove();
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

  const cardsEl = createTag('div', { class: 'hero-cards two-up' });
  rows.slice(2).forEach((row) => {
    if (row.children.length !== 2) return;
    const [mediaCell, textCell] = row.children;

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
      // createTag/setAttribute only sets defaultMuted — force live property for muted-autoplay.
      videoEl.muted = true;
      // Posters are authored from arbitrary frames; paint the first video frame over the poster.
      videoEl.addEventListener('loadedmetadata', () => {
        try { videoEl.currentTime = 0.001; } catch (e) { /* noop */ }
      }, { once: true });
      (posterImg.closest('picture') || posterImg).replaceWith(videoEl);
    }

    const cardText = createTag('div', { class: 'hero-card-text' });
    if (heading) cardText.append(heading);
    cardText.append(...paras);

    const tile = createTag('div', { class: 'hero-card-tile' });
    tile.append(createTag('div', { class: 'content-aux' }), media, cardText);

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

  const heroCopy = block.querySelector('.hero-copy');
  const eyebrow = block.querySelector('.hero-eyebrow');
  const cards = [...block.querySelectorAll('.hero-card')];
  const tiles = [...block.querySelectorAll('.hero-card-tile')];
  const medias = [...block.querySelectorAll('.hero-card-media')];
  const videos = [...block.querySelectorAll('.hero-card-media video')];

  if (tiles.length !== 4) return;

  let naturalBoxes = [];
  let stackBoxes = [];
  let isSettled = false;
  let willChangeOn = false;
  let eyebrowVisible = false;
  let bottomObserver = null;
  let rafId = 0;
  let running = false;
  const playedVideos = new Set();
  const gnav = document.querySelector('header');
  const cardTexts = cards.flatMap((card) => [
    card.querySelector('.hero-card-title'),
    card.querySelector('.hero-card-body-text'),
  ]).filter(Boolean);

  function positionCopy() {
    if (!heroCopy || !gnav) return;
    heroCopy.style.top = `${gnav.getBoundingClientRect().bottom + 124}px`;
  }

  function ensureEndedHandler(video) {
    if (video.dataset.heroEndedBound) return;
    video.dataset.heroEndedBound = '1';
    video.addEventListener('ended', () => {
      playedVideos.add(video);
      if (video.duration && Number.isFinite(video.duration)) {
        video.currentTime = video.duration - 0.05;
      }
    }, { once: true });
  }

  const getSplit = () => (window.innerWidth < 768 ? 1 : 2);

  function autoplayTop() {
    const split = getSplit();
    for (let i = 0; i < split; i += 1) {
      const video = videos[i];
      if (video && !playedVideos.has(video)) {
        ensureEndedHandler(video);
        video.currentTime = 0;
        video.loop = false;
        video.play()?.catch(() => {});
      }
    }
  }

  function watchBottom() {
    if (bottomObserver) return;
    const split = getSplit();
    videos.slice(split).filter(Boolean).forEach(ensureEndedHandler);
    bottomObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = videos[medias.indexOf(entry.target)];
        if (!video || playedVideos.has(video)) return;
        if (entry.isIntersecting) {
          video.loop = false;
          video.play()?.catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.7 });
    medias.slice(split).filter(Boolean).forEach((media) => bottomObserver.observe(media));
  }

  function stopBottom() {
    if (bottomObserver) { bottomObserver.disconnect(); bottomObserver = null; }
  }

  function resetVideos() {
    playedVideos.clear();
    videos.forEach((video) => {
      delete video.dataset.heroEndedBound;
      try { video.pause(); video.loop = false; video.currentTime = 0; } catch (e) { /* noop */ }
    });
  }

  function setSettled(next, opts) {
    if (isSettled === next) return;
    isSettled = next;
    block.dataset.heroSettled = String(next);
    if (next) {
      autoplayTop();
      watchBottom();
      return;
    }
    stopBottom();
    if (opts?.reverse) {
      videos.forEach((video) => {
        if (playedVideos.has(video)) return;
        try { video.pause(); video.loop = false; } catch (e) { /* noop */ }
      });
    } else {
      resetVideos();
    }
  }

  // Trigger range mirrors the original ScrollTrigger: cards[0].top from
  // viewport-bottom (progress 0) to slotTargetTop (progress 1).
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
    if (heroCopy) {
      const copyFade = clamp01(progress / 0.6);
      heroCopy.style.opacity = String(1 - copyFade);
      heroCopy.style.transform = `translateY(${-80 * copyFade}px)`;
    }

    tiles.forEach((tile, i) => {
      const natural = naturalBoxes[i];
      const stack = stackBoxes[i];
      tile.style.width = `${lerp(stack.w, natural.w, progress)}px`;
      tile.style.height = `${lerp(stack.h, natural.h, progress)}px`;
      tile.style.transform = `translate(${lerp(stack.x - natural.x, 0, progress)}px, ${lerp(stack.y - natural.y, 0, progress)}px) rotate(${lerp(stack.rot, 0, progress)}deg)`;
      if (CARD_SHADOWS[i]) {
        tile.style.boxShadow = `${fadeShadow(CARD_SHADOWS[i], 1 - progress)}, ${INSET_SHADOW}`;
      }
    });

    // power2.out easing: 1 - (1 - t)², 0.025 stagger.
    cardTexts.forEach((textEl, i) => {
      const textProgress = clamp01((progress - (0.6 + i * 0.025)) / 0.2);
      textEl.style.opacity = String(1 - (1 - textProgress) * (1 - textProgress));
    });

    const animating = progress > 0.001 && progress < 0.999;
    if (animating !== willChangeOn) {
      willChangeOn = animating;
      const willChangeValue = animating ? 'transform, width, height' : '';
      tiles.forEach((tile) => { tile.style.willChange = willChangeValue; });
    }
  }

  function updateEyebrow() {
    if (!eyebrow) return;
    if (medias[0]) {
      const gap = window.innerWidth >= 768 ? 40 : 24;
      eyebrow.style.top = `${medias[0].getBoundingClientRect().top - eyebrow.offsetHeight - gap}px`;
    }
    if (heroCopy) {
      const rect = heroCopy.getBoundingClientRect();
      const show = rect.top + rect.height / 2 < 0;
      if (show !== eyebrowVisible) {
        eyebrowVisible = show;
        eyebrow.classList.toggle('is-visible', show);
      }
    }
  }

  function computeLayouts() {
    // Clear inline styles from any previous run so the natural layout is measurable.
    tiles.forEach((tile) => {
      tile.style.cssText = '';
    });
    cards.forEach((card) => { card.style.height = ''; });
    if (heroCopy) { heroCopy.style.opacity = ''; heroCopy.style.transform = ''; }
    cardTexts.forEach((textEl) => { textEl.style.opacity = ''; });

    // Measure card cells, then force each row's height to its max so all
    // cards in a row resolve to the same height. Column count comes from the
    // grid's actual computed template (the framework's `.two-up` defines it).
    const cardRects = cards.map((card) => card.getBoundingClientRect());
    const gridCols = getComputedStyle(cards[0].parentElement).gridTemplateColumns;
    const colsPerRow = gridCols.split(' ').filter(Boolean).length || 1;
    naturalBoxes = cardRects.map((rect, i) => {
      const rowStart = Math.floor(i / colsPerRow) * colsPerRow;
      let rowMaxH = 0;
      for (let j = rowStart; j < rowStart + colsPerRow && j < cardRects.length; j += 1) {
        if (cardRects[j].height > rowMaxH) rowMaxH = cardRects[j].height;
      }
      return { x: rect.left, y: rect.top, w: rect.width, h: rowMaxH };
    });

    // Lock card heights so cards reserve grid space after tiles become absolute.
    cards.forEach((card, i) => { card.style.height = `${naturalBoxes[i].h}px`; });

    // Stack composition derived from Figma.
    const vw = window.innerWidth;
    const dyNudges = [-50, -42, -136, -190];
    const copyBottom = heroCopy ? heroCopy.getBoundingClientRect().bottom : 540;
    const stackTop = copyBottom + 74;
    const stackScale = vw < 768 ? Math.max((vw - 48) / STACK_W, 0.3) : 1;
    const stackLeft = (vw - STACK_W * stackScale) / 2;
    stackBoxes = STACK_REF.map((ref, i) => ({
      x: stackLeft + ref.dx * stackScale,
      y: stackTop + (ref.dy + 14.85) * stackScale + (dyNudges[i] || 0),
      w: ref.w * stackScale,
      h: ref.h * stackScale,
      rot: ref.rot,
    }));

    // Pin tiles absolutely AND apply current state synchronously so first paint
    // is correct. Without the immediate applyAnimation, a width-less absolute
    // tile collapses to 0 between this function and the first rAF tick.
    tiles.forEach((tile) => {
      tile.style.position = 'absolute';
      tile.style.top = '0';
      tile.style.left = '0';
      tile.style.transformOrigin = 'top left';
    });
    applyAnimation(getProgress());
  }

  function tick() {
    if (!running) return;
    const progress = getProgress();
    applyAnimation(progress);
    updateEyebrow();

    if (progress >= 0.85) setSettled(true);
    else if (isSettled) setSettled(false, { reverse: true });

    videos.forEach((video) => {
      if (!video.duration || !Number.isFinite(video.duration)) return;
      if (!isSettled && !playedVideos.has(video) && video.currentTime > 0.02) {
        video.currentTime = 0;
      }
    });

    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (running) return;
    running = true;
    tick();
  }

  function stopLoop() {
    running = false;
    cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function setup() {
    positionCopy();
    computeLayouts();
    updateEyebrow();
  }

  setup();
  document.fonts?.ready?.then(setup);

  const io = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) startLoop();
    else stopLoop();
  }, { rootMargin: '200px 0px' });
  io.observe(block);

  // ResizeObserver catches the block resizing after CSS/fonts settle on
  // initial load — without this the first measurement can be stale and the
  // animation positions tiles using the wrong column widths.
  let resizeTimer;
  const reSetup = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setup, 120);
  };
  new ResizeObserver(reSetup).observe(block);
  window.addEventListener('resize', reSetup);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
  initAnimation(el);
}

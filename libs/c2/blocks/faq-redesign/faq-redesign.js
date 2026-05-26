import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

// Animation tuning ------------------------------------------------------------

const STIFFNESS = 0.34; // spring strength for cursor follow
const INTRO_STEP = 0.009; // per-frame linear progress added to intro
const EXIT_STEP = 0.08; // per-frame linear progress added to exit
const ROTATE_LERP = 0.12; // how fast rotation chases its velocity target
const TARGET_OFFSET = { x: -8, y: -14 }; // final picture anchor relative to cursor
const SCROLL_SETTLE_MS = 150; // wait after scroll before re-activating

// One config per visual layer. Length controls how many pictures animate.
const LAYERS = [
  { spawn: { x: 120, y: -120 }, stagger: { x: 0, y: -6 }, follow: 0.32, rotateCoeff: 0.03 },
  { spawn: { x: 108, y: -108 }, stagger: { x: 8, y: 0 }, follow: 0.42, rotateCoeff: 0.07 },
  { spawn: { x: 96, y: -96 }, stagger: { x: 16, y: 6 }, follow: 0.68, rotateCoeff: 0.14 },
];

// Animation primitives --------------------------------------------------------

// Two-piece curve: ramps to peak 1.324 at intro=0.52, eases back to 1.0 at intro=1.
function introScale(intro) {
  if (intro < 0.52) return 0.18 + intro * 2.2;
  return 1.34 - (intro - 0.52) * 0.708;
}

// React's compounded eased ramp — stores easedIntro back as next frame's input.
// Convergence is fast (~8 frames), but a CSS transition smooths the visual.
function advanceIntro(intro) {
  const next = Math.min(intro + INTRO_STEP, 1);
  return 1 - (1 - next) ** 2.2;
}

function createLayer(pic, config, mouseX, mouseY) {
  return {
    pic,
    config,
    x: mouseX + config.spawn.x,
    y: mouseY + config.spawn.y,
    intro: 0,
    exit: 0,
    rotate: 0,
  };
}

function stepSpring(layer, mouseX, mouseY, velocityX) {
  const { config } = layer;
  const targetX = mouseX + TARGET_OFFSET.x;
  const targetY = mouseY + TARGET_OFFSET.y;
  layer.x += (targetX - layer.x) * STIFFNESS * config.follow;
  layer.y += (targetY - layer.y) * STIFFNESS * config.follow;
  const rotateTarget = velocityX * config.rotateCoeff;
  layer.rotate += (rotateTarget - layer.rotate) * ROTATE_LERP;
}

function render(layer) {
  const { config, pic } = layer;
  const fade = 1 - layer.exit;
  const scale = introScale(layer.intro) * fade;
  const x = layer.x + config.stagger.x;
  const y = layer.y + config.stagger.y;
  pic.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) scale(${scale}) rotate(${layer.rotate}deg)`;
  pic.style.opacity = String(fade);
}

function resetPic(pic) {
  pic.style.transform = '';
  pic.style.opacity = '';
}

function hideMedia(media) {
  if (!media) return;
  media.classList.remove('is-visible');
  media.querySelectorAll('picture').forEach(resetPic);
}

// Cursor follower -------------------------------------------------------------

function addCursorFollower(list) {
  const cursor = { x: 0, y: 0, prevX: 0, vx: 0, hasPrev: false };
  let activeItem = null;
  let activeLayers = [];
  let exitingSets = [];
  let rafId = null;
  let isScrolling = false;
  let scrollEndTimer = null;

  const updateCursor = (e) => {
    if (cursor.hasPrev) cursor.vx = e.clientX - cursor.prevX;
    cursor.prevX = e.clientX;
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    cursor.hasPrev = true;
  };

  const tick = () => {
    activeLayers.forEach((layer) => {
      stepSpring(layer, cursor.x, cursor.y, cursor.vx);
      layer.intro = advanceIntro(layer.intro);
      render(layer);
    });

    exitingSets = exitingSets.filter(({ media, layers }) => {
      let alive = false;
      layers.forEach((layer) => {
        layer.exit = Math.min(layer.exit + EXIT_STEP, 1);
        stepSpring(layer, cursor.x, cursor.y, cursor.vx);
        render(layer);
        if (layer.exit < 1) alive = true;
      });
      if (!alive) hideMedia(media);
      return alive;
    });

    rafId = (activeLayers.length || exitingSets.length)
      ? requestAnimationFrame(tick)
      : null;
  };

  const startRaf = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const activate = (item) => {
    if (item === activeItem) return;
    if (activeItem) hideMedia(activeItem.querySelector('.faq-media'));

    const media = item.querySelector('.faq-media');
    if (!media) return;

    // If the user re-hovers an item whose exit is still in-flight, drop the
    // pending exit so it can't call hideMedia on us mid-animation.
    exitingSets = exitingSets.filter((set) => set.media !== media);

    activeItem = item;
    const pics = [...media.querySelectorAll('picture')].slice(0, LAYERS.length);
    activeLayers = pics.map((pic, i) => createLayer(pic, LAYERS[i], cursor.x, cursor.y));

    media.classList.add('is-visible');
    activeLayers.forEach(render);
    startRaf();
  };

  const deactivate = () => {
    if (!activeItem) return;
    exitingSets.push({
      media: activeItem.querySelector('.faq-media'),
      layers: activeLayers,
    });
    activeItem = null;
    activeLayers = [];
    startRaf();
  };

  const activateAtPoint = (x, y) => {
    const item = document.elementFromPoint(x, y)?.closest('.faq-item');
    if (item && list.contains(item)) activate(item);
  };

  const onScroll = () => {
    isScrolling = true;
    deactivate();
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrolling = false;
      activateAtPoint(cursor.x, cursor.y);
    }, SCROLL_SETTLE_MS);
  };

  document.addEventListener('mousemove', updateCursor, { passive: true });

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches || isScrolling) return;
    updateCursor(e);
    activateAtPoint(e.clientX, e.clientY);
  });

  list.addEventListener('mouseenter', () => {
    if (!DESKTOP_MQ.matches) return;
    document.addEventListener('scroll', onScroll, { passive: true });
  });

  list.addEventListener('mouseleave', () => {
    isScrolling = false;
    deactivate();
    clearTimeout(scrollEndTimer);
    document.removeEventListener('scroll', onScroll);
  });
}

// DOM construction ------------------------------------------------------------

function buildHeadline(headingCol) {
  const headline = createTag('div', { class: 'faq-headline' });
  if (!headingCol) return headline;
  decorateBlockText(headingCol, { heading: '2' });
  headline.append(...headingCol.childNodes);
  return headline;
}

function buildMedia(mediaCol) {
  if (!mediaCol) return null;
  const pics = [...mediaCol.querySelectorAll('picture')];
  if (!pics.length) return null;
  const media = createTag('div', { class: 'faq-media' });
  pics.forEach((pic) => media.append(pic));
  return media;
}

function buildItem(row, index) {
  const [textCol, mediaCol] = row.children;
  const item = createTag('li', { class: 'faq-item' });
  const number = createTag('span', { class: 'faq-number eyebrow' }, String(index + 1).padStart(2, '0'));
  const text = createTag('div', { class: 'faq-text title-4' });
  if (textCol) text.append(...textCol.childNodes);
  item.append(number, text);
  const media = buildMedia(mediaCol);
  if (media) item.append(media);
  return item;
}

function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headline = buildHeadline(rows[0]?.children[0]);
  const list = createTag('ol', { class: 'faq-list' });
  rows.slice(1).forEach((row, i) => list.append(buildItem(row, i)));

  addCursorFollower(list);

  const listCol = createTag('div', { class: 'faq-list-col' });
  listCol.append(list);
  block.replaceChildren(headline, listCol);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}

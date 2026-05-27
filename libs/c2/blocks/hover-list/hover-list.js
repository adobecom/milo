import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');
const STIFFNESS = 0.34;
const ROTATE_LERP = 0.12;
const INTRO_STEP = 0.009;
const EXIT_STEP = 0.08;
const TARGET_OFFSET = { x: -8, y: -14 };
const SCROLL_SETTLE_MS = 150;

// Interpolates layer config from back (slow, far spawn, least tilt) to front.
function layerConfig(i, n) {
  const t = n > 1 ? i / (n - 1) : 0;
  const s = 60 - t * 12;
  return {
    spawn: { x: s, y: -s },
    stagger: { x: i * 8, y: i * 6 - 6 },
    follow: 0.32 + t * 0.36,
    rot: 0.03 + t * 0.11,
  };
}

// Scale curve: 0.18 → peak 1.324 (at intro=0.52) → 1.0 (at intro=1).
function introScale(intro) {
  return intro < 0.52 ? 0.18 + intro * 2.2 : 1.34 - (intro - 0.52) * 0.708;
}

function stepLayer(layer, mx, my, vx) {
  const { config: c } = layer;
  layer.x += (mx + TARGET_OFFSET.x - layer.x) * STIFFNESS * c.follow;
  layer.y += (my + TARGET_OFFSET.y - layer.y) * STIFFNESS * c.follow;
  layer.rotate += (vx * c.rot - layer.rotate) * ROTATE_LERP;
}

function renderLayer(layer) {
  const { config: c, pic } = layer;
  const fade = 1 - layer.exit;
  const scale = introScale(layer.intro) * fade;
  pic.style.transform = `translate3d(${layer.x + c.stagger.x}px, ${layer.y + c.stagger.y}px, 0) translate(-50%, -100%) scale(${scale}) rotate(${layer.rotate}deg)`;
  pic.style.opacity = String(fade);
}

function hideMedia(media) {
  if (!media) return;
  if (media.matches(':popover-open')) media.hidePopover();
  media.querySelectorAll('picture').forEach((p) => {
    p.style.transform = '';
    p.style.opacity = '';
  });
}

function addCursorFollower(list) {
  const cursor = { x: 0, y: 0, vx: 0, hasPrev: false };
  let activeItem = null;
  let activeLayers = [];
  let exitingGroups = [];
  let rafId = null;
  let isScrolling = false;
  let scrollEndTimer = null;

  const updateCursor = (e) => {
    cursor.vx = cursor.hasPrev ? e.clientX - cursor.x : 0;
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    cursor.hasPrev = true;
  };

  const tick = () => {
    activeLayers.forEach((l) => {
      stepLayer(l, cursor.x, cursor.y, cursor.vx);
      const n = Math.min(l.intro + INTRO_STEP, 1);
      l.intro = 1 - (1 - n) ** 2.2;
      renderLayer(l);
    });
    exitingGroups = exitingGroups.filter(({ media, layers }) => {
      let alive = false;
      layers.forEach((l) => {
        l.exit = Math.min(l.exit + EXIT_STEP, 1);
        stepLayer(l, cursor.x, cursor.y, cursor.vx);
        renderLayer(l);
        if (l.exit < 1) alive = true;
      });
      if (!alive) hideMedia(media);
      return alive;
    });
    rafId = (activeLayers.length || exitingGroups.length) ? requestAnimationFrame(tick) : null;
  };

  const startLoop = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

  const activate = (item) => {
    if (item === activeItem) return;
    if (activeItem) hideMedia(activeItem.querySelector('.hover-list-media'));
    const media = item.querySelector('.hover-list-media');
    if (!media) return;
    // Drop pending exit for this item so it can't hide us mid-animation.
    exitingGroups = exitingGroups.filter((g) => g.media !== media);
    const pics = [...media.querySelectorAll('picture')];
    activeItem = item;
    activeLayers = pics.map((pic, i) => {
      const c = layerConfig(i, pics.length);
      return {
        pic,
        config: c,
        x: cursor.x + c.spawn.x,
        y: cursor.y + c.spawn.y,
        intro: 0,
        exit: 0,
        rotate: 0,
      };
    });
    // Suppress the CSS transition for the very first render so the picture
    // appears at its spawn position instantly. The popover's display: none →
    // block change otherwise causes the transition to fire from default
    // (transform: none, top-left) to the spawn transform.
    activeLayers.forEach((l) => { l.pic.style.transition = 'none'; });
    activeLayers.forEach(renderLayer);
    if (!media.matches(':popover-open')) media.showPopover();
    requestAnimationFrame(() => {
      activeLayers.forEach((l) => { l.pic.style.transition = ''; });
    });
    startLoop();
  };

  const deactivate = () => {
    if (!activeItem) return;
    exitingGroups.push({ media: activeItem.querySelector('.hover-list-media'), layers: activeLayers });
    activeItem = null;
    activeLayers = [];
    startLoop();
  };

  const activateAtPoint = (x, y) => {
    const item = document.elementFromPoint(x, y)?.closest('.hover-list-item');
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

function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headline = createTag('div', { class: 'hover-list-headline' });
  const headingCol = rows[0]?.children[0];
  if (headingCol) {
    decorateBlockText(headingCol, { heading: '2' });
    headline.append(...headingCol.childNodes);
  }

  const list = createTag('ol', { class: 'hover-list-items' });
  rows.slice(1).forEach((row, i) => {
    const [textCol, mediaCol] = row.children;
    const item = createTag('li', { class: 'hover-list-item' });
    const number = createTag('span', { class: 'hover-list-number eyebrow' }, String(i + 1).padStart(2, '0'));
    const text = createTag('div', { class: 'hover-list-text heading-4' });
    if (textCol) text.append(...textCol.childNodes);
    item.append(number, text);
    const pics = mediaCol ? [...mediaCol.querySelectorAll('picture')] : [];
    if (pics.length) {
      const media = createTag('div', { class: 'hover-list-media', popover: 'manual' });
      pics.forEach((p) => media.append(p));
      item.append(media);
    }
    list.append(item);
  });

  addCursorFollower(list);
  const listCol = createTag('div', { class: 'hover-list-col' });
  listCol.append(list);
  block.replaceChildren(headline, listCol);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}

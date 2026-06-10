import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');
const STIFFNESS = 0.34;
const ROTATE_LERP = 0.12;
const INTRO_STEP = 0.045;
const EXIT_STEP = 0.08;
const TARGET_OFFSET = { x: 14, y: -4 };

function layerConfig(i, n) {
  const t = n > 1 ? i / (n - 1) : 0;
  const s = 120 - t * 24;
  return {
    spawn: { x: s, y: -s },
    stagger: { x: i * 8, y: i * 6 - 6 },
    follow: 0.32 + t * 0.36,
    rot: 0.03 + t * 0.11,
  };
}

function introScale(intro) {
  const eased = 1 - (1 - intro) ** 2.2;
  return 0.6 + eased * 0.4;
}

function stepLayer(layer, mx, my, vx) {
  const { config: c } = layer;
  layer.x += (mx + TARGET_OFFSET.x - layer.x) * STIFFNESS * c.follow;
  layer.y += (my + TARGET_OFFSET.y - layer.y) * STIFFNESS * c.follow;
  layer.rotate += (vx * c.rot - layer.rotate) * ROTATE_LERP;
}

function renderLayer(layer) {
  const { config: c, pic } = layer;
  const fade = (1 - layer.exit) ** 1.9;
  const scale = introScale(layer.intro);
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

function setupStickyBoundary(headline, list) {
  const tabletMQ = window.matchMedia('(width >= 768px) and (width < 1280px)');
  const wrapper = headline.parentElement;

  const update = () => {
    if (!tabletMQ.matches) { wrapper.style.height = ''; return; }
    let { height } = headline.getBoundingClientRect();
    for (let i = 0, stop = list.children.length - 2; i < stop; i += 1) {
      height += list.children[i].getBoundingClientRect().height;
    }
    wrapper.style.height = `${height}px`;
  };

  new ResizeObserver(update).observe(list);
  tabletMQ.addEventListener('change', update);
}

function addCursorFollower(list) {
  const cursor = { x: 0, y: 0, vx: 0, hasPrev: false };
  let activeItem = null;
  let activeLayers = [];
  let exitingGroups = [];
  let rafId = null;

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
      l.intro = n;
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
    if (REDUCED_MOTION.matches) {
      if (activeItem) hideMedia(activeItem.querySelector('.hover-list-media'));
      activeItem = item;
      const media = item.querySelector('.hover-list-media');
      if (!media) return;
      const pics = [...media.querySelectorAll('picture')];
      pics.forEach((pic, i) => {
        const c = layerConfig(i, pics.length);
        renderLayer({
          pic, config: c, x: cursor.x, y: cursor.y, intro: 1, exit: 0, rotate: 0,
        });
      });
      if (!media.matches(':popover-open')) media.showPopover();
      return;
    }
    if (activeItem) {
      exitingGroups.push({ media: activeItem.querySelector('.hover-list-media'), layers: activeLayers });
    }
    activeItem = null;
    activeLayers = [];
    const media = item.querySelector('.hover-list-media');
    if (!media) return;
    const resumeExit = exitingGroups.find((g) => g.media === media);
    exitingGroups = exitingGroups.filter((g) => g.media !== media);
    activeItem = item;
    if (resumeExit) {
      activeLayers = resumeExit.layers;
      activeLayers.forEach((l) => { l.exit = 0; });
      activeLayers.forEach(renderLayer);
    } else {
      const pics = [...media.querySelectorAll('picture')];
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
      activeLayers.forEach(renderLayer);
      if (!media.matches(':popover-open')) media.showPopover();
    }
    startLoop();
  };

  const deactivate = () => {
    if (!activeItem) return;
    if (REDUCED_MOTION.matches) {
      hideMedia(activeItem.querySelector('.hover-list-media'));
      activeItem = null;
      activeLayers = [];
      return;
    }
    exitingGroups.push({ media: activeItem.querySelector('.hover-list-media'), layers: activeLayers });
    activeItem = null;
    activeLayers = [];
    startLoop();
  };

  const activateAtPoint = (x, y) => {
    const item = document.elementFromPoint(x, y)?.closest('.hover-list-item');
    if (item && list.contains(item)) activate(item);
  };

  document.addEventListener('mousemove', updateCursor, { passive: true });
  list.addEventListener('mousemove', (e) => {
    if (!DESKTOP_MQ.matches) return;
    activateAtPoint(e.clientX, e.clientY);
  });
  list.addEventListener('mouseleave', () => {
    deactivate();
  });
  window.addEventListener('scroll', () => {
    if (!DESKTOP_MQ.matches || !cursor.hasPrev || !activeItem) return;
    const item = document.elementFromPoint(cursor.x, cursor.y)?.closest('.hover-list-item');
    if (item === activeItem) return;
    if (item && list.contains(item)) activate(item);
    else deactivate();
  }, { passive: true });
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
    const number = createTag('span', { class: 'hover-list-number eyebrow' }, `${i + 1}.`);
    const text = createTag('div', { class: 'hover-list-text heading-5' });
    if (textCol) text.append(...textCol.childNodes);
    const copy = createTag('div', { class: 'hover-list-copy' });
    copy.append(number, text);
    item.append(copy);
    const pics = mediaCol ? [...mediaCol.querySelectorAll('picture')] : [];
    if (pics.length) {
      const media = createTag('div', { class: 'hover-list-media', popover: 'manual' });
      pics.forEach((p) => media.append(p));
      item.append(media);
    }
    list.append(item);
  });

  const headlineWrapper = createTag('div', { class: 'hover-list-headline-wrapper' });
  headlineWrapper.append(headline);
  addCursorFollower(list);
  const listCol = createTag('div', { class: 'hover-list-col' });
  listCol.append(list);
  block.replaceChildren(headlineWrapper, listCol);
  setupStickyBoundary(headline, list);
}

export default function init(el) {
  el.classList.add('container');
  decorateViewportContent(el, decorate);
}

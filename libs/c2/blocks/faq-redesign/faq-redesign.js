import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');
const STIFFNESS = 0.34;
const INTRO_STEP = 0.009;
const EXIT_STEP = 0.08;
const ROTATE_LERP = 0.12;
const TARGET = { x: -8, y: -14 };
const SCROLL_SETTLE_MS = 150;

const LAYERS = [
  { spawn: { x: 120, y: -120 }, stagger: { x: 0, y: -6 }, follow: 0.32, rot: 0.03 },
  { spawn: { x: 108, y: -108 }, stagger: { x: 8, y: 0 }, follow: 0.42, rot: 0.07 },
  { spawn: { x: 96, y: -96 }, stagger: { x: 16, y: 6 }, follow: 0.68, rot: 0.14 },
];

// Two-piece curve: ramps to peak 1.324 at intro=0.52, eases back to 1.0 at intro=1.
function introScale(t) {
  return t < 0.52 ? 0.18 + t * 2.2 : 1.34 - (t - 0.52) * 0.708;
}

function render(layer) {
  const { config: c, pic } = layer;
  const fade = 1 - layer.exit;
  const s = introScale(layer.intro) * fade;
  pic.style.transform = `translate3d(${layer.x + c.stagger.x}px, ${layer.y + c.stagger.y}px, 0) translate(-50%, -100%) scale(${s}) rotate(${layer.rotate}deg)`;
  pic.style.opacity = String(fade);
}

function step(layer, x, y, vx) {
  const c = layer.config;
  layer.x += (x + TARGET.x - layer.x) * STIFFNESS * c.follow;
  layer.y += (y + TARGET.y - layer.y) * STIFFNESS * c.follow;
  layer.rotate += (vx * c.rot - layer.rotate) * ROTATE_LERP;
}

function hideMedia(media) {
  if (!media) return;
  media.classList.remove('is-visible');
  media.querySelectorAll('picture').forEach((p) => {
    p.style.transform = '';
    p.style.opacity = '';
  });
}

function addCursorFollower(list) {
  const cur = { x: 0, y: 0, prevX: 0, vx: 0, hasPrev: false };
  let active = null;
  let layers = [];
  let exits = [];
  let raf = null;
  let scrolling = false;
  let scrollTimer = null;

  const setCur = (e) => {
    if (cur.hasPrev) cur.vx = e.clientX - cur.prevX;
    cur.prevX = e.clientX;
    cur.x = e.clientX;
    cur.y = e.clientY;
    cur.hasPrev = true;
  };

  const tick = () => {
    layers.forEach((l) => {
      step(l, cur.x, cur.y, cur.vx);
      const n = Math.min(l.intro + INTRO_STEP, 1);
      l.intro = 1 - (1 - n) ** 2.2;
      render(l);
    });
    exits = exits.filter(({ media, layers: ls }) => {
      let alive = false;
      ls.forEach((l) => {
        l.exit = Math.min(l.exit + EXIT_STEP, 1);
        step(l, cur.x, cur.y, cur.vx);
        render(l);
        if (l.exit < 1) alive = true;
      });
      if (!alive) hideMedia(media);
      return alive;
    });
    raf = (layers.length || exits.length) ? requestAnimationFrame(tick) : null;
  };

  const startRaf = () => { if (!raf) raf = requestAnimationFrame(tick); };

  const activate = (item) => {
    if (item === active) return;
    if (active) hideMedia(active.querySelector('.faq-media'));
    const media = item.querySelector('.faq-media');
    if (!media) return;
    // Drop any in-flight exit for this item so it can't hide us mid-animation.
    exits = exits.filter((e) => e.media !== media);
    active = item;
    layers = [...media.querySelectorAll('picture')].slice(0, LAYERS.length).map((pic, i) => ({
      pic,
      config: LAYERS[i],
      x: cur.x + LAYERS[i].spawn.x,
      y: cur.y + LAYERS[i].spawn.y,
      intro: 0,
      exit: 0,
      rotate: 0,
    }));
    media.classList.add('is-visible');
    layers.forEach(render);
    startRaf();
  };

  const deactivate = () => {
    if (!active) return;
    exits.push({ media: active.querySelector('.faq-media'), layers });
    active = null;
    layers = [];
    startRaf();
  };

  const activateAt = (x, y) => {
    const item = document.elementFromPoint(x, y)?.closest('.faq-item');
    if (item && list.contains(item)) activate(item);
  };

  const onScroll = () => {
    scrolling = true;
    deactivate();
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      scrolling = false;
      activateAt(cur.x, cur.y);
    }, SCROLL_SETTLE_MS);
  };

  document.addEventListener('mousemove', setCur, { passive: true });
  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches || scrolling) return;
    setCur(e);
    activateAt(e.clientX, e.clientY);
  });
  list.addEventListener('mouseenter', () => {
    if (!DESKTOP_MQ.matches) return;
    document.addEventListener('scroll', onScroll, { passive: true });
  });
  list.addEventListener('mouseleave', () => {
    scrolling = false;
    deactivate();
    clearTimeout(scrollTimer);
    document.removeEventListener('scroll', onScroll);
  });
}

function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const headline = createTag('div', { class: 'faq-headline' });
  const headingCol = rows[0]?.children[0];
  if (headingCol) {
    decorateBlockText(headingCol, { heading: '2' });
    headline.append(...headingCol.childNodes);
  }

  const list = createTag('ol', { class: 'faq-list' });
  rows.slice(1).forEach((row, i) => {
    const [textCol, mediaCol] = row.children;
    const item = createTag('li', { class: 'faq-item' });
    const number = createTag('span', { class: 'faq-number eyebrow' }, String(i + 1).padStart(2, '0'));
    const text = createTag('div', { class: 'faq-text heading-4' });
    if (textCol) text.append(...textCol.childNodes);
    item.append(number, text);
    const pics = mediaCol ? [...mediaCol.querySelectorAll('picture')] : [];
    if (pics.length) {
      const media = createTag('div', { class: 'faq-media' });
      pics.forEach((p) => media.append(p));
      item.append(media);
    }
    list.append(item);
  });

  addCursorFollower(list);

  const listCol = createTag('div', { class: 'faq-list-col' });
  listCol.append(list);
  block.replaceChildren(headline, listCol);
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}

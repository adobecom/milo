import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');
const STIFFNESS = 0.34;
const ROTATE_LERP = 0.12;
const INTRO_STEP = 0.009;
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
  let lenisOff = null;
  // Whether the picture is being driven by the cursor. False when activated
  // via keyboard focus or touch tap — the picture should stay at the item's
  // position and not follow mouse movement until the user explicitly hovers
  // back into the list.
  let pointerDriven = true;

  const updateCursor = (e) => {
    if (!pointerDriven) return;
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
    activeItem = null;
    activeLayers = [];
    const media = item.querySelector('.hover-list-media');
    if (!media) return;
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

  // Keyboard / non-pointer activation: derive the cursor target from the
  // item's own bounding rect so the picture springs in to the item's center.
  // vx is zeroed so the layers don't tilt from leftover mouse velocity, and
  // pointerDriven flips off so subsequent mouse moves don't drag the picture
  // away from the focused item.
  const activateAtItem = (item) => {
    pointerDriven = false;
    cursor.hasPrev = false;
    const rect = item.getBoundingClientRect();
    cursor.x = rect.left + rect.width / 2;
    cursor.y = rect.top + rect.height / 2;
    cursor.vx = 0;
    activate(item);
  };

  // Defer to Lenis (the project's smooth-scroll library) for scroll state.
  // Lenis emits a `scroll` event on every update and dispatches a native
  // `scrollend` CustomEvent on window when scrolling settles, so we don't
  // need our own debounced scroll-end detection.
  const onScrollStart = () => {
    if (isScrolling) return;
    isScrolling = true;
    deactivate();
  };

  const onScrollEnd = () => {
    if (!isScrolling) return;
    isScrolling = false;
    activateAtPoint(cursor.x, cursor.y);
  };

  document.addEventListener('mousemove', updateCursor, { passive: true });
  list.addEventListener('mousemove', (e) => {
    if (!DESKTOP_MQ.matches || isScrolling) return;
    // If we were in keyboard mode, the user has now engaged the mouse —
    // switch to pointer mode and seed the cursor from this event so the
    // first velocity reading doesn't spike from the stale item-center.
    if (!pointerDriven) {
      pointerDriven = true;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.vx = 0;
      cursor.hasPrev = true;
    }
    activateAtPoint(e.clientX, e.clientY);
  });
  list.addEventListener('mouseenter', () => {
    if (!DESKTOP_MQ.matches) return;
    lenisOff = window.lenis?.on('scroll', onScrollStart);
    window.addEventListener('scrollend', onScrollEnd);
  });
  list.addEventListener('mouseleave', () => {
    // In keyboard mode the focused item is still holding the picture open;
    // don't tear down when only the mouse leaves.
    if (!pointerDriven) return;
    isScrolling = false;
    deactivate();
    lenisOff?.();
    lenisOff = null;
    window.removeEventListener('scrollend', onScrollEnd);
  });

  // Keyboard path: focus shows the picture at the item's position.
  list.addEventListener('focusin', (e) => {
    if (!DESKTOP_MQ.matches) return;
    const item = e.target.closest('.hover-list-item');
    if (item) activateAtItem(item);
  });
  list.addEventListener('focusout', (e) => {
    if (!DESKTOP_MQ.matches) return;
    // Don't deactivate when focus moves between items — focusin on the
    // new item handles the transition. Only deactivate when focus leaves
    // the list entirely.
    if (!list.contains(e.relatedTarget)) deactivate();
  });

  // Touch path: tap toggles the picture for the item. Click also fires for
  // mouse users but is harmless there (item is already active from hover).
  list.addEventListener('click', (e) => {
    if (!DESKTOP_MQ.matches) return;
    const item = e.target.closest('.hover-list-item');
    if (!item) return;
    if (item === activeItem) deactivate();
    else activateAtItem(item);
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
    const item = createTag('li', { class: 'hover-list-item', tabindex: '0' });
    const number = createTag('span', { class: 'hover-list-number eyebrow' }, String(i + 1));
    const text = createTag('div', { class: 'hover-list-text heading-5' });
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
  el.classList.add('container');
  decorateViewportContent(el, decorate);
}

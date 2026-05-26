import { createTag } from '../../../utils/utils.js';
import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';

const DESKTOP_MQ = window.matchMedia('(width >= 1280px)');

const STIFFNESS = 0.34;
const FOLLOW_SPEED = [0.32, 0.42, 0.68];
const SPAWN_OFFSET = [
  { x: 120, y: -120 },
  { x: 108, y: -108 },
  { x: 96, y: -96 },
];
const STAGGER = [
  { x: 0, y: -6 },
  { x: 8, y: 0 },
  { x: 16, y: 6 },
];
const TARGET_OFFSET = { x: -8, y: -14 };
const INTRO_STEP = 0.038;
const EXIT_STEP = 0.08;

function introScale(intro) {
  const eased = 1 - (1 - intro) ** 2.2;
  return 0.18 + eased * 0.82;
}

function applyTransform(pic, state, i) {
  const x = state.x + STAGGER[i].x;
  const y = state.y + STAGGER[i].y;
  const fade = 1 - state.exit;
  const scale = introScale(state.intro) * fade;
  pic.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%) scale(${scale})`;
  pic.style.opacity = String(fade);
}

function clearPic(pic) {
  pic.style.transform = '';
  pic.style.opacity = '';
}

function addCursorFollower(list) {
  let mouseX = 0;
  let mouseY = 0;
  let activeItem = null;
  let activeSet = [];
  let exitingSets = [];
  let rafId = null;
  let isScrolling = false;
  let scrollEndTimer = null;

  const stepSpring = (state, i) => {
    const targetX = mouseX + TARGET_OFFSET.x;
    const targetY = mouseY + TARGET_OFFSET.y;
    state.x += (targetX - state.x) * STIFFNESS * FOLLOW_SPEED[i];
    state.y += (targetY - state.y) * STIFFNESS * FOLLOW_SPEED[i];
  };

  const tick = () => {
    activeSet.forEach(({ pic, state }, i) => {
      stepSpring(state, i);
      state.intro = Math.min(state.intro + INTRO_STEP, 1);
      applyTransform(pic, state, i);
    });

    exitingSets = exitingSets.filter((set) => {
      let alive = false;
      set.pics.forEach(({ pic, state }, i) => {
        state.exit = Math.min(state.exit + EXIT_STEP, 1);
        stepSpring(state, i);
        applyTransform(pic, state, i);
        if (state.exit < 1) alive = true;
      });
      if (!alive) {
        set.media?.classList.remove('is-visible');
        set.pics.forEach(({ pic }) => clearPic(pic));
      }
      return alive;
    });

    if (!activeSet.length && !exitingSets.length) {
      rafId = null;
      return;
    }
    rafId = requestAnimationFrame(tick);
  };

  const startRaf = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  };

  const instantHide = (item) => {
    const media = item.querySelector('.faq-media');
    media?.classList.remove('is-visible');
    media?.querySelectorAll('picture').forEach(clearPic);
  };

  const activate = (item) => {
    if (item === activeItem) return;
    if (activeItem) instantHide(activeItem);

    activeItem = item;
    const media = item.querySelector('.faq-media');
    if (!media) return;

    const pics = [...media.querySelectorAll('picture')].slice(0, 3);
    activeSet = pics.map((pic, i) => ({
      pic,
      state: {
        x: mouseX + SPAWN_OFFSET[i].x,
        y: mouseY + SPAWN_OFFSET[i].y,
        intro: 0,
        exit: 0,
      },
    }));

    media.classList.add('is-visible');
    activeSet.forEach(({ pic, state }, i) => applyTransform(pic, state, i));
    startRaf();
  };

  const deactivate = () => {
    if (!activeItem || !activeSet.length) {
      activeItem = null;
      activeSet = [];
      return;
    }
    exitingSets.push({
      media: activeItem.querySelector('.faq-media'),
      pics: activeSet,
    });
    activeItem = null;
    activeSet = [];
    startRaf();
  };

  const activateItemAt = (x, y) => {
    const el = document.elementFromPoint(x, y);
    const item = el?.closest?.('.faq-item');
    if (item && list.contains(item)) activate(item);
  };

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  list.addEventListener('mouseover', (e) => {
    if (!DESKTOP_MQ.matches || isScrolling) return;
    activateItemAt(e.clientX, e.clientY);
  });

  const onScroll = () => {
    isScrolling = true;
    deactivate();
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrolling = false;
      activateItemAt(mouseX, mouseY);
    }, 150);
  };

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

  const headingCol = rows[0]?.children[0];
  const headline = createTag('div', { class: 'faq-headline' });
  if (headingCol) {
    decorateBlockText(headingCol, { heading: '2' });
    headline.append(...headingCol.childNodes);
  }

  const list = createTag('ol', { class: 'faq-list' });
  rows.slice(1).forEach((row, i) => {
    const textCol = row.children[0];
    const mediaCol = row.children[1];

    const item = createTag('li', { class: 'faq-item' });
    const number = createTag('span', { class: 'faq-number eyebrow' }, String(i + 1).padStart(2, '0'));

    const text = createTag('div', { class: 'faq-text title-4' });
    if (textCol) {
      text.append(...textCol.childNodes);
    }

    item.append(number, text);

    if (mediaCol) {
      const pics = [...mediaCol.querySelectorAll('picture')];
      if (pics.length) {
        const media = createTag('div', { class: 'faq-media' });
        pics.forEach((pic) => media.append(pic));
        item.append(media);
      }
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

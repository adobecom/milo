/*
 * upscale-lens - v0.1.0 (POC)
 * Shows a low-quality image with a lens that reveals the sharp image.
 * Press and hold to zoom in, then move the pointer to pan.
 */

import { createTag } from '../../utils/utils.js';
import { decorateBlockText } from '../../utils/decorate.js';

// shortcut: hard-coded English labels; move to placeholders before localizing.
const LABELS = {
  idle: 'Tap and hold',
  active: 'Enhanced',
  button: 'Enhance and move the lens',
};
const EASE = { hold: 0.2, release: 0.08, pan: 0.035 };
const PAN_DIVISOR = 1.5;
const KEY_STEP = 24;
const EPSILON = 0.01;
const ARROWS = {
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
};
const MOVE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
  <path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
    d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3"/>
</svg>`;

const lerp = (from, to, t) => from + (to - from) * t;
const clamp = (value, max) => Math.min(Math.max(value, -max), max);

function initLens(stage) {
  const box = stage.querySelector('.upscale-lens-box');
  const label = stage.querySelector('.upscale-lens-label');
  const button = stage.querySelector('.upscale-lens-move');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Raw pointer offset from the stage center. The lens target is clamped per frame,
  // because the lens size animates when the hold starts.
  const pointer = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  const lens = { x: 0, y: 0 };
  const pan = { x: 0, y: 0 };
  let boxEase = EASE.hold;
  let rafId = null;
  let active = false;
  let pointerId = null;

  const clampToStage = ({ x, y }) => ({
    x: clamp(x, Math.max(0, (stage.clientWidth - box.offsetWidth) / 2)),
    y: clamp(y, Math.max(0, (stage.clientHeight - box.offsetHeight) / 2)),
  });

  const render = () => {
    const instant = reduceMotion.matches;
    Object.assign(target, clampToStage(pointer));
    const panTarget = { x: -target.x / PAN_DIVISOR, y: -target.y / PAN_DIVISOR };
    ['x', 'y'].forEach((axis) => {
      lens[axis] = instant ? target[axis] : lerp(lens[axis], target[axis], boxEase);
      pan[axis] = instant ? panTarget[axis] : lerp(pan[axis], panTarget[axis], EASE.pan);
    });
    stage.style.setProperty('--lens-x', `${lens.x}px`);
    stage.style.setProperty('--lens-y', `${lens.y}px`);
    stage.style.setProperty('--pan-x', `${pan.x}px`);
    stage.style.setProperty('--pan-y', `${pan.y}px`);
    const moving = [lens.x - target.x, lens.y - target.y, pan.x - panTarget.x, pan.y - panTarget.y]
      .some((delta) => Math.abs(delta) > EPSILON);
    rafId = moving ? requestAnimationFrame(render) : null;
  };

  const moveTo = (x, y) => {
    pointer.x = x;
    pointer.y = y;
    if (!rafId) rafId = requestAnimationFrame(render);
  };

  const setActive = (on) => {
    active = on;
    stage.classList.toggle('active', on);
    label.textContent = on ? LABELS.active : LABELS.idle;
    button.setAttribute('aria-pressed', String(on));
    boxEase = on ? EASE.hold : EASE.release;
    if (!on) moveTo(0, 0);
  };

  const onPointerMove = (e) => {
    if (e.pointerId !== pointerId) return;
    const rect = stage.getBoundingClientRect();
    moveTo(e.clientX - rect.left - rect.width / 2, e.clientY - rect.top - rect.height / 2);
  };

  const onPointerEnd = (e) => {
    if (e.pointerId !== pointerId) return;
    pointerId = null;
    setActive(false);
  };

  stage.addEventListener('pointerdown', (e) => {
    if (pointerId !== null || e.button > 0) return;
    // Touch starts only from the move button, so the page can still scroll.
    if (e.pointerType === 'touch' && !button.contains(e.target)) return;
    e.preventDefault();
    pointerId = e.pointerId;
    stage.setPointerCapture(pointerId);
    setActive(true);
    onPointerMove(e);
  });
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerEnd);
  stage.addEventListener('pointercancel', onPointerEnd);
  stage.addEventListener('lostpointercapture', onPointerEnd);
  stage.addEventListener('contextmenu', (e) => {
    if (pointerId !== null) e.preventDefault();
  });

  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive(!active);
    } else if (e.key === 'Escape' && active) {
      setActive(false);
    } else if (ARROWS[e.key] && active) {
      e.preventDefault();
      const [dx, dy] = ARROWS[e.key];
      const from = clampToStage(pointer);
      moveTo(from.x + dx * KEY_STEP, from.y + dy * KEY_STEP);
    }
  });
  button.addEventListener('blur', () => {
    if (active && pointerId === null) setActive(false);
  });
}

function buildStage(before, after) {
  const beforeImg = before.querySelector('img');
  beforeImg?.setAttribute('loading', 'eager');
  beforeImg?.setAttribute('fetchpriority', 'high');
  after.querySelector('img')?.setAttribute('loading', 'eager');

  const stage = createTag('div', { class: 'upscale-lens-stage' }, [
    createTag('div', { class: 'upscale-lens-layer before' }, before),
    createTag('div', { class: 'upscale-lens-layer after' }, after),
    createTag('div', { class: 'upscale-lens-box' }, [
      createTag('span', { class: 'upscale-lens-label', 'aria-live': 'polite' }, LABELS.idle),
      createTag('button', {
        type: 'button',
        class: 'upscale-lens-move',
        'aria-label': LABELS.button,
        'aria-pressed': 'false',
      }, MOVE_ICON),
    ]),
  ]);
  initLens(stage);
  return stage;
}

export default function init(el) {
  const cells = [...el.querySelectorAll(':scope > div > div')];
  const copyCell = cells.find((cell) => cell.querySelector('h1, h2, h3, h4, h5, h6'));
  const pictures = cells
    .filter((cell) => cell !== copyCell)
    .flatMap((cell) => [...cell.querySelectorAll('picture')]);
  if (pictures.length < 2) {
    window.lana?.log('upscale-lens: needs a before and an after image', { tags: 'upscale-lens' });
    return;
  }

  const [before, after] = pictures;

  const children = [];
  el.classList.toggle('no-copy', !copyCell);
  if (copyCell) {
    const copy = createTag('div', { class: 'upscale-lens-copy' }, [...copyCell.childNodes]);
    decorateBlockText(copy, ['xxl', 'm', 'm', 'l']);
    children.push(copy);
  }
  children.push(buildStage(before, after));
  el.replaceChildren(...children);
}

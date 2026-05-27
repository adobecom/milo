import { decorateBlockText, decorateViewportContent } from '../../../utils/decorate.js';
import { createTag } from '../../../utils/utils.js';

const SWIPE_THRESHOLD = 10;
const FLING_VEL = 0.05;
const FLY_MS = 300;
const SNAP_MS = 300;
const FADE_IN_MS = 160;
const VELOCITY_WINDOW_MS = 80;
const RIGHT_DRAG_DENOM = 160;

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function decorateItem(item, index) {
  item.classList.add('split-aside-item');
  item.dataset.slideIndex = String(index);
  const [content, media] = item.children;
  if (content) {
    content.classList.add('foreground');
    decorateBlockText(content);
  }
  if (media) {
    media.classList.add('media');
    media.dataset.slideIndex = String(index);
  }
  return { content, media };
}

function setupCarousel({ stack, medias, items, dots }) {
  const N = medias.length;
  if (N < 3) return;

  let rotation = 0;
  let flying = false;
  let drag = null;
  let history = [];

  const mod = (n) => ((n % N) + N) % N;
  const slotOf = (idx) => mod(idx - rotation);
  const slideAt = (off) => medias[mod(rotation + off)];

  const dotEls = dots ? [...dots.children] : [];

  function applyRotation() {
    medias.forEach((m, idx) => {
      const slot = slotOf(idx);
      m.style.setProperty('--split-aside-stack-index', slot);
      m.style.setProperty('--split-aside-stack-slot', slot);
      if (slot < 3) {
        m.dataset.slot = String(slot);
      } else {
        m.dataset.slot = 'hidden';
      }
    });
    items.forEach((item, idx) => {
      item.classList.toggle('split-aside-active', slotOf(idx) === 0);
    });
    dotEls.forEach((dot, idx) => {
      const isActive = slotOf(idx) === 0;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function clearInline(m) {
    if (!m) return;
    m.style.transition = '';
    m.style.transform = '';
    m.style.opacity = '';
  }

  function velocity() {
    const now = performance.now();
    const recent = history.filter((h) => now - h.t < VELOCITY_WINDOW_MS);
    if (recent.length < 2) return 0;
    const a = recent[0];
    const b = recent[recent.length - 1];
    if (b.t === a.t) return 0;
    return (b.x - a.x) / (b.t - a.t);
  }

  function stackWidth() {
    return stack.getBoundingClientRect().width || 374;
  }

  function commitLeft() {
    flying = true;
    const oldFront = slideAt(0);
    /* The card that becomes the new back (slot 2). For N=3 this wraps to oldFront;
       for N>3 it's a previously-hidden card. */
    const newBack = slideAt(3);
    const w = stackWidth();

    const preSlots = medias.map((_, idx) => slotOf(idx));

    /* 1. Old front: fly off-screen left — no opacity change. */
    oldFront.style.transition = `transform ${FLY_MS}ms ease-out`;
    oldFront.style.transform = `translateX(${-w}px) rotate(-25deg)`;

    /* 2. Rotate state — new front + new mid transition smoothly into their new slots. */
    rotation += 1;
    const newFront = slideAt(0);
    const newMid = slideAt(1);
    newFront.style.transition = '';
    newFront.style.transform = '';
    newMid.style.transition = '';
    newMid.style.transform = '';

    applyRotation();
    /* Freeze z-index at pre-rotation values until the fly-off ends. */
    medias.forEach((m, idx) => {
      m.style.setProperty('--split-aside-stack-slot', String(preSlots[idx]));
    });
    /* Keep old front at slot 0 size and visible during fly-off. */
    oldFront.style.setProperty('--split-aside-stack-index', '0');
    oldFront.dataset.slot = '0';
    /* For N>3, keep newBack hidden until the fly-off ends — it'll fade in after. */
    if (newBack !== oldFront) newBack.dataset.slot = 'hidden';

    /* 3. After the fly-off ends, settle old front into its real slot,
          update z-indexes, and fade the new back card in at slot 2. */
    setTimeout(() => {
      oldFront.style.transition = 'none';
      oldFront.style.transform = '';
      const oldFrontSlot = slotOf(medias.indexOf(oldFront));
      oldFront.style.setProperty('--split-aside-stack-index', String(oldFrontSlot));
      oldFront.dataset.slot = oldFrontSlot < 3 ? String(oldFrontSlot) : 'hidden';
      medias.forEach((m, idx) => {
        m.style.setProperty('--split-aside-stack-slot', String(slotOf(idx)));
      });

      newBack.style.transition = 'none';
      newBack.style.opacity = '0';
      newBack.dataset.slot = '2';
      newBack.getBoundingClientRect();

      requestAnimationFrame(() => requestAnimationFrame(() => {
        newBack.style.transition = `opacity ${FADE_IN_MS}ms ease-out`;
        newBack.style.opacity = '';
        setTimeout(() => {
          clearInline(oldFront);
          clearInline(newFront);
          clearInline(newMid);
          if (newBack !== oldFront) clearInline(newBack);
          flying = false;
        }, FADE_IN_MS + 40);
      }));
    }, FLY_MS);
  }

  function commitRight() {
    flying = true;
    /* The slide that becomes the new front. For N=3 this wraps to slideAt(2);
       for N>3 it's a previously-hidden card. */
    const incoming = slideAt(-1);
    const oldFront = slideAt(0);
    const oldMid = slideAt(1);
    const oldBack = slideAt(2);

    rotation -= 1;

    /* Re-enable transitions; CSS will smoothly animate each card from drag state
       to its new slot via the --stack-index calc. */
    incoming.style.transition = '';
    oldFront.style.transition = '';
    oldMid.style.transition = '';
    if (oldBack !== incoming) oldBack.style.transition = '';

    applyRotation();
    /* Clear the inline translateX so incoming animates the rest of the way to slot 0. */
    incoming.style.transform = '';

    setTimeout(() => {
      clearInline(incoming);
      clearInline(oldFront);
      clearInline(oldMid);
      if (oldBack !== incoming) clearInline(oldBack);
      flying = false;
    }, FLY_MS + 80);
  }

  function snapBack() {
    const f = slideAt(0);
    const mid = slideAt(1);
    const b = slideAt(2);
    const incoming = slideAt(-1);
    const touched = [f, mid, b];
    if (incoming !== b) touched.push(incoming);
    touched.forEach((m) => {
      if (!m) return;
      m.style.transition = '';
      m.style.transform = '';
    });
    /* applyRotation resets --stack-index, --stack-slot, and data-slot to original. */
    applyRotation();
    setTimeout(() => {
      touched.forEach((m) => clearInline(m));
    }, SNAP_MS + 40);
  }

  function onPointerDown(e) {
    if (flying) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    drag = {
      id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, locked: null,
    };
    history = [{ x: e.clientX, t: performance.now() }];
    try { stack.setPointerCapture(e.pointerId); } catch (_) { /* noop */ }
  }

  function onPointerMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    drag.dx = e.clientX - drag.x0;
    drag.dy = e.clientY - drag.y0;
    if (drag.locked === null && (Math.abs(drag.dx) > 6 || Math.abs(drag.dy) > 6)) {
      drag.locked = Math.abs(drag.dx) > Math.abs(drag.dy) ? 'x' : 'y';
    }
    if (drag.locked === 'y') return;

    history.push({ x: e.clientX, t: performance.now() });
    const cutoff = performance.now() - VELOCITY_WINDOW_MS;
    history = history.filter((h) => h.t >= cutoff);

    const f = slideAt(0);
    const b = slideAt(2);

    const midCard = slideAt(1);
    let newDirection = null;
    if (drag.dx < 0) newDirection = 'left';
    else if (drag.dx > 0) newDirection = 'right';
    if (drag.direction && drag.direction !== newDirection) {
      /* Direction reversed — reset every drag-touched property back to the original slots */
      medias.forEach((m) => { m.style.transform = ''; });
      applyRotation();
    }
    drag.direction = newDirection;

    if (drag.dx < 0) {
      /* Left drag — front follows finger; mid grows toward slot 0; back grows toward slot 1.
         --stack-slot stays at the original integer values, so z-order is preserved. */
      const p = Math.min(-drag.dx / RIGHT_DRAG_DENOM, 1);
      const rot = drag.dx * 0.07;
      f.style.transition = 'none';
      f.style.transform = `translateX(${drag.dx}px) rotate(${rot}deg)`;
      midCard.style.transition = 'none';
      midCard.style.setProperty('--split-aside-stack-index', String(1 - p));
      if (b) {
        b.style.transition = 'none';
        b.style.setProperty('--split-aside-stack-index', String(2 - p));
      }
    } else if (drag.dx > 0 && b) {
      /* Right drag — front shrinks (slot 0 → 1), mid shrinks (slot 1 → 2).
         For N=3 the back card IS the incoming, so it slides in from off-screen left.
         For N>3 the back shrinks toward slot 3 (hidden after commit) and a separate
         previously-hidden card (slideAt(-1)) becomes the incoming. */
      const incoming = slideAt(-1);
      const p = Math.min(drag.dx / RIGHT_DRAG_DENOM, 1);
      const w = stackWidth();
      const rot = -25 * (1 - p);
      f.style.transition = 'none';
      f.style.transform = '';
      f.style.setProperty('--split-aside-stack-index', String(p));
      f.style.setProperty('--split-aside-stack-slot', '1');
      midCard.style.transition = 'none';
      midCard.style.setProperty('--split-aside-stack-index', String(1 + p));
      midCard.style.setProperty('--split-aside-stack-slot', '2');
      if (incoming !== b) {
        /* N>3: back shrinks toward hidden, incoming is a separate card. */
        b.style.transition = 'none';
        b.style.setProperty('--split-aside-stack-index', String(2 + p));
        b.style.setProperty('--split-aside-stack-slot', '3');
      }
      incoming.style.transition = 'none';
      incoming.style.setProperty('--split-aside-stack-index', '0');
      incoming.style.setProperty('--split-aside-stack-slot', '0');
      incoming.dataset.slot = '0';
      incoming.style.transform = `translateX(${-w * (1 - p)}px) rotate(${rot}deg)`;
    }
  }

  function onPointerUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    const { dx, locked } = drag;
    drag = null;
    try { stack.releasePointerCapture(e.pointerId); } catch (_) { /* noop */ }

    if (locked === 'y') return;

    const vx = velocity();
    history = [];
    const commit = Math.abs(dx) >= SWIPE_THRESHOLD
      || (Math.abs(vx) > FLING_VEL && Math.abs(dx) > 8);

    if (!commit) { snapBack(); return; }
    if (reducedMotion()) {
      rotation += dx < 0 ? 1 : -1;
      applyRotation();
      medias.forEach(clearInline);
      return;
    }
    if (dx < 0) commitLeft();
    else commitRight();
  }

  stack.addEventListener('pointerdown', onPointerDown);
  stack.addEventListener('pointermove', onPointerMove);
  stack.addEventListener('pointerup', onPointerUp);
  stack.addEventListener('pointercancel', onPointerUp);

  applyRotation();
}

function decorate(block) {
  const itemEls = [...block.children];
  const itemsData = itemEls.map((item, i) => decorateItem(item, i));
  const medias = itemsData.map((d) => d.media).filter(Boolean);
  if (!medias.length) return;

  const stack = createTag('div', { class: 'split-aside-stack' });
  medias.forEach((m) => stack.appendChild(m));
  block.prepend(stack);

  const dots = createTag('div', { class: 'split-aside-dots', role: 'tablist', 'aria-label': 'Slide indicators' });
  medias.forEach((_, i) => {
    dots.appendChild(createTag('span', { class: 'split-aside-dot', role: 'tab', 'aria-label': `Slide ${i + 1}` }));
  });
  stack.insertAdjacentElement('afterend', dots);

  /* Wrap items in a grid container so every item occupies the same cell.
     The cell sizes to the tallest item, so the container's height stays stable
     regardless of which slide is active. */
  const itemsWrap = createTag('div', { class: 'split-aside-items' });
  itemEls.forEach((item) => itemsWrap.appendChild(item));
  block.appendChild(itemsWrap);

  setupCarousel({ stack, medias, items: itemEls, dots });
}

export default function init(el) {
  decorateViewportContent(el, decorate);
}

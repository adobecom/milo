import { rowsOf, cellsOf, textOf } from '../_shared/dom.js';
import { dispatch } from '../_shared/members.js';

const BLOCK = 'carousel';
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHEVRON = {
  prev: 'M12.237 16.455c-.196 0-.393-.077-.54-.23L6.21 10.52c-.28-.29-.28-.749 0-1.039l5.5-5.716c.287-.3.763-.308 1.06-.02.298.286.308.76.02 1.059l-4.999 5.197 4.986 5.184c.288.297.279.772-.02 1.06-.145.14-.332.21-.52.21',
  next: 'M7.75 16.465c-.187 0-.374-.07-.52-.21-.298-.287-.308-.762-.02-1.06l4.999-5.197-4.986-5.184c-.288-.297-.279-.772.02-1.06.296-.286.774-.278 1.06.021L13.79 9.48c.28.29.28.749 0 1.039l-5.5 5.716c-.146.154-.344.23-.54.23',
};
const ICON_TITLE = { prev: 'Previous slide arrow', next: 'Next slide arrow' };
const DESKTOP_QUERY = '(width >= 1024px)';
const TABLET_QUERY = '(768px <= width < 1280px)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const SWIPE_MIN = 50;
const MAX_DOTS = 6;
const FOCUSABLE = 'a[href], area[href], button, input, select, textarea, iframe, summary, video[controls], audio[controls], [tabindex], [contenteditable]';
const TYPING = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const KEPT = 'data-carousel-tabindex';
const SHOW_CLASS = /^show-(\d+)$/;

function blockNumber(el) {
  const doc = el.ownerDocument;
  const root = el.getRootNode();
  const scopes = root === doc || root === el ? [doc] : [doc, root];
  let n = scopes.reduce((sum, s) => sum + s.querySelectorAll('[data-carousel-block]').length, 0) + 1;
  // eslint-disable-next-line no-loop-func
  while (scopes.some((s) => s.querySelector(`#${BLOCK}-${n}-track`))) n += 1;
  el.dataset.carouselBlock = String(n);
  return n;
}

function chevron(el, dir) {
  const doc = el.ownerDocument;
  const svg = doc.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  const title = doc.createElementNS(SVG_NS, 'title');
  title.textContent = ICON_TITLE[dir];
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', CHEVRON[dir]);
  svg.append(title, path);
  return svg;
}

function mediaQuery(el, query) {
  const win = el.ownerDocument.defaultView;
  return typeof win?.matchMedia === 'function' ? win.matchMedia(query) : null;
}

export function findSlides(el, name) {
  const area = el.closest('.fragment') || el.ownerDocument;
  const slides = [];
  if (!name) return slides;
  area.querySelectorAll('div.section-metadata > div > div:first-child').forEach((key) => {
    if (textOf(key).toLowerCase() !== 'carousel' || textOf(key.nextElementSibling) !== name) return;
    const meta = key.closest('.section-metadata');
    const slide = meta.closest('.section') || meta.parentElement;
    if (!slide || slide === el || slide.contains(el) || slides.includes(slide)) return;
    slides.push(slide);
  });
  return slides;
}

function slideText(slide) {
  const text = [...slide.children].filter((c) => !c.classList.contains('section-metadata')).map(textOf).filter(Boolean).join(' ');
  if (text) return text;
  const media = slide.querySelector('img[alt], video[title], iframe[title]');
  return media?.getAttribute('alt') || media?.getAttribute('title') || '';
}

function hideFocus(node) {
  if (!node.hasAttribute(KEPT)) node.setAttribute(KEPT, node.getAttribute('tabindex') ?? '');
  node.setAttribute('tabindex', '-1');
}

function restoreFocus(node) {
  if (!node.hasAttribute(KEPT)) return;
  const kept = node.getAttribute(KEPT);
  node.removeAttribute(KEPT);
  if (kept === '') node.removeAttribute('tabindex');
  else node.setAttribute('tabindex', kept);
}

function decorateCarousel(el, ctx) {
  const { make } = ctx;
  el.classList.add(BLOCK);
  const cells = cellsOf(rowsOf(el)[0]);
  const name = textOf(cells[0]);
  const label = textOf(cells[1]);
  const slides = findSlides(el, name);
  const n = blockNumber(el);
  el.replaceChildren();
  if (!slides.length) {
    el.dataset.carouselMode = 'empty';
    return { slides, state: null };
  }

  const trackId = `${BLOCK}-${n}-track`;
  slides.forEach((slide, i) => {
    slide.classList.add('carousel-pane');
    slide.setAttribute('role', 'group');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    slide.dataset.carouselIndex = String(i);
  });
  const status = make('div', { class: 'carousel-status', 'aria-live': 'polite', 'aria-atomic': 'true' });
  const track = make('div', { class: 'carousel-track', id: trackId }, slides);
  const viewport = make('div', { class: 'carousel-viewport' }, track);
  const prev = make('button', { type: 'button', class: 'carousel-arrow carousel-arrow-prev', 'aria-label': 'Previous slide', 'aria-controls': trackId }, chevron(el, 'prev'));
  const next = make('button', { type: 'button', class: 'carousel-arrow carousel-arrow-next', 'aria-label': 'Next slide', 'aria-controls': trackId }, chevron(el, 'next'));
  const dots = slides.map(() => make('li', { class: 'carousel-dot' }));
  const dotList = make('ul', { class: 'carousel-dots' }, dots);
  const bar = make('div', { class: 'carousel-bar' }, [prev, make('div', { class: 'carousel-dot-clip', 'aria-hidden': 'true' }, dotList), next]);
  el.append(status, viewport, bar);
  el.setAttribute('role', 'group');
  el.setAttribute('aria-roledescription', 'carousel');
  if (label) el.setAttribute('aria-label', label);

  const desktop = mediaQuery(el, DESKTOP_QUERY);
  const tablet = mediaQuery(el, TABLET_QUERY);
  const reduced = mediaQuery(el, REDUCED_QUERY);
  const has = (cls) => el.classList.contains(cls);
  const showN = [...el.classList].map((c) => SHOW_CLASS.exec(c)).find(Boolean);
  const state = { current: 0, count: slides.length };

  const isDesktop = () => !!desktop?.matches;
  const isStatic = () => has('ups-desktop') && isDesktop();
  const shownCount = () => {
    if (isStatic()) return slides.length;
    if (isDesktop() && showN) return Math.max(1, Number(showN[1]));
    return 1;
  };
  const circular = () => !has('disable-circular-nav') && !(has('disable-buttons') && !isDesktop());
  const lastStart = () => {
    const hintTablet = has('hinting-tablet') && !!tablet?.matches ? 2 : 1;
    return Math.max(0, slides.length - Math.max(shownCount(), hintTablet));
  };
  const navigable = () => !isStatic() && slides.length > shownCount();
  const canStep = (delta) => {
    if (!navigable()) return false;
    if (circular()) return true;
    return delta > 0 ? state.current < lastStart() : state.current > 0;
  };

  const place = () => {
    const rotating = navigable();
    slides.forEach((slide, i) => {
      const k = (i - state.current + slides.length) % slides.length;
      const reference = k === slides.length - 1;
      slide.style.order = rotating ? String(reference ? 1 : k + 2) : '';
      const linear = reference ? state.current - 1 : state.current + k;
      slide.classList.toggle('carousel-pane-wrapped', rotating && !circular() && (linear < 0 || linear >= slides.length));
      slide.classList.toggle('carousel-pane-current', k === 0);
    });
  };

  const syncShown = () => {
    const shown = shownCount();
    slides.forEach((slide, i) => {
      const visible = (i - state.current + slides.length) % slides.length < shown;
      slide.setAttribute('aria-hidden', String(!visible));
      slide.querySelectorAll(FOCUSABLE)
        .forEach((node) => (visible ? restoreFocus(node) : hideFocus(node)));
    });
  };

  const syncDots = () => {
    dots.forEach((dot, i) => dot.classList.toggle('carousel-dot-current', i === state.current));
    const shift = Math.min(
      Math.max(state.current - (MAX_DOTS - 3), 0),
      Math.max(slides.length - MAX_DOTS, 0),
    );
    dotList.style.setProperty('--_dot-shift', String(shift));
  };

  const syncBar = () => {
    el.dataset.carouselMode = navigable() ? 'slides' : 'static';
    [[prev, -1], [next, 1]].forEach(([button, delta]) => {
      if (canStep(delta)) button.removeAttribute('aria-disabled');
      else button.setAttribute('aria-disabled', 'true');
    });
  };

  const pauseHidden = () => {
    slides.forEach((slide) => {
      if (slide.getAttribute('aria-hidden') !== 'true') return;
      slide.querySelectorAll('video').forEach((video) => { if (!video.paused) video.pause(); });
    });
  };

  const announce = () => {
    const info = showN ? '' : `Slide ${state.current + 1} of ${slides.length}`;
    status.textContent = [slideText(slides[state.current]), info].filter(Boolean).join(', ');
  };

  const sync = () => { place(); syncShown(); syncDots(); syncBar(); };

  const settle = () => {
    track.classList.add('carousel-track-still');
    sync();
    track.getBoundingClientRect();
    track.classList.remove('carousel-track-still');
  };

  function move(delta) {
    if (!canStep(delta)) return false;
    state.current = (state.current + delta + slides.length) % slides.length;
    const still = !!reduced?.matches || has('none');
    const prep = delta > 0 ? 'carousel-track-from-next' : 'carousel-track-from-prev';
    if (!still) track.classList.add(prep);
    sync();
    if (!still) {
      track.getBoundingClientRect();
      track.classList.remove(prep);
    }
    announce();
    pauseHidden();
    return true;
  }

  const focusButton = (button) => {
    if (button.getClientRects().length) { button.focus({ preventScroll: true }); return; }
    const active = el.ownerDocument.activeElement;
    const pane = active?.closest?.('.carousel-pane');
    if (pane && pane.getAttribute('aria-hidden') === 'true') {
      slides[state.current].querySelector(FOCUSABLE)?.focus({ preventScroll: true });
    }
  };

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  el.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (e.target?.closest?.(TYPING)) return;
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    if (move(delta)) focusButton(delta > 0 ? next : prev);
  });
  const touch = { x: null, y: null };
  el.addEventListener('touchstart', (e) => {
    const t = e.touches?.[0];
    touch.x = t ? t.screenX : null;
    touch.y = t ? t.screenY : null;
  }, { passive: true });
  el.addEventListener('touchend', (e) => {
    const t = e.changedTouches?.[0];
    if (!t || touch.x === null) return;
    const dx = t.screenX - touch.x;
    const dy = t.screenY - touch.y;
    touch.x = null;
    if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
  }, { passive: true });

  [desktop, tablet].forEach((mql) => mql?.addEventListener?.('change', () => {
    if (!circular()) state.current = Math.min(state.current, lastStart());
    if (isStatic()) state.current = 0;
    settle();
  }));

  const eager = () => {
    track.querySelectorAll('img[loading="lazy"]').forEach((img) => img.removeAttribute('loading'));
    syncShown();
  };
  const win = el.ownerDocument.defaultView;
  if (typeof win?.IntersectionObserver === 'function') {
    const io = new win.IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      io.disconnect();
      eager();
    }, { rootMargin: '100% 0px' });
    io.observe(el);
  } else {
    eager();
  }

  sync();
  return {
    slides, state, track, bar, prev, next, dots, status, move, sync,
  };
}

export const MEMBERS = Object.freeze({ carousel: { origin: 'c1', compat: 'yes', overrides: 'none', viewportPrePass: false, decorate: decorateCarousel } });

export default function decorate(el) {
  return dispatch(el, MEMBERS, { block: BLOCK });
}

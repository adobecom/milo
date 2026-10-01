export const MOTION_PROPS = Object.freeze({
  entrance: '--spectrum2-motion-entrance',
  duration: '--spectrum2-motion-duration',
  distance: '--spectrum2-motion-distance',
  stagger: '--spectrum2-motion-stagger',
  ease: '--spectrum2-motion-ease',
});
export const MOTION_ENTRANCES = Object.freeze(['none', 'fade', 'rise', 'scale']);
export const MOTION_REFRESH_EVENT = 'motion:refresh';

export const MOTION_DEFAULTS = Object.freeze({
  entrance: 'none',
  duration: 'var(--spectrum2-transition-500)',
  distance: 'var(--spectrum2-spacing-400)',
  stagger: 'var(--spectrum2-transition-100)',
  ease: 'var(--spectrum2-enter-ease-out)',
});
const FALLBACK = Object.freeze({ duration: 500, distance: '24px', stagger: 100, ease: 'cubic-bezier(0, 0, 0.4, 1)' });

export const MOTION_PRESETS = Object.freeze({
  'motion-calm': Object.freeze({
    label: 'Calm',
    kind: 'tempo',
    set: Object.freeze({ entrance: 'rise', duration: 'var(--spectrum2-transition-500)', distance: 'var(--spectrum2-spacing-200)', stagger: 'var(--spectrum2-transition-200)', ease: 'var(--spectrum2-transition-ease-in-out)' }),
  }),
  'motion-lively': Object.freeze({
    label: 'Lively',
    kind: 'tempo',
    set: Object.freeze({ entrance: 'rise', duration: 'var(--spectrum2-transition-300)', distance: 'var(--spectrum2-spacing-400)', stagger: 'var(--spectrum2-transition-100)', ease: 'var(--spectrum2-enter-ease-out)' }),
  }),
  'motion-dramatic': Object.freeze({
    label: 'Dramatic',
    kind: 'tempo',
    set: Object.freeze({ entrance: 'rise', duration: 'var(--spectrum2-transition-1000)', distance: 'var(--spectrum2-spacing-700)', stagger: 'var(--spectrum2-transition-300)', ease: 'var(--spectrum2-transition-standard)' }),
  }),
  'motion-fade': Object.freeze({ label: 'Fade in', kind: 'entrance', set: Object.freeze({ entrance: 'fade' }) }),
  'motion-rise': Object.freeze({ label: 'Rise in', kind: 'entrance', set: Object.freeze({ entrance: 'rise' }) }),
  'motion-scale': Object.freeze({ label: 'Scale in', kind: 'entrance', set: Object.freeze({ entrance: 'scale' }) }),
});
export const MOTION_OPTION_CLASSES = Object.freeze(Object.keys(MOTION_PRESETS));

export function motionCss() {
  const rules = Object.entries(MOTION_PRESETS).map(([cls, p]) => {
    const decls = Object.entries(p.set).map(([k, v]) => `  ${MOTION_PROPS[k]}: ${v};`).join('\n');
    return `.spectrum2.${cls},\n.section.${cls} {\n${decls}\n}`;
  });
  return `/* spectrum2 motion presets: generated from blocks/_shared/motion.js MOTION_PRESETS (do not edit by hand) */\n${rules.join('\n')}\n`;
}

const STYLE_ATTR = 'data-spectrum2-motion';
const REDUCE = '(prefers-reduced-motion: reduce)';
const HOLD_FRAMES = Object.freeze([Object.freeze({ opacity: 0 }), Object.freeze({ opacity: 1 })]);
const STAGGER_CAP = 10;
const controllers = new WeakMap();

function hasMotionClass(root) {
  const section = root.closest ? root.closest('.section') : null;
  return [root, section].some((n) => n && n.classList
    && MOTION_OPTION_CLASSES.some((c) => n.classList.contains(c)));
}

function ensureStyle(doc) {
  if (!doc || !doc.head || doc.head.querySelector(`style[${STYLE_ATTR}]`)) return;
  const style = doc.createElement('style');
  style.setAttribute(STYLE_ATTR, '');
  style.textContent = motionCss();
  doc.head.prepend(style);
}

const unresolved = (v) => !v || v.includes('var(');

export function parseTime(v) {
  const m = /^(-?\d*\.?\d+)(ms|s)$/i.exec(String(v || '').trim());
  if (!m) return null;
  const n = parseFloat(m[1]) * (m[2].toLowerCase() === 's' ? 1000 : 1);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function readMotion(root) {
  const view = root.ownerDocument && root.ownerDocument.defaultView;
  const cs = view && typeof view.getComputedStyle === 'function' ? view.getComputedStyle(root) : null;
  const get = (k) => (cs ? cs.getPropertyValue(MOTION_PROPS[k]).trim() : '');
  const entrance = get('entrance');
  const distance = get('distance');
  const ease = get('ease');
  return {
    entrance: MOTION_ENTRANCES.includes(entrance) ? entrance : 'none',
    duration: parseTime(get('duration')) ?? FALLBACK.duration,
    distance: unresolved(distance) ? FALLBACK.distance : distance,
    stagger: parseTime(get('stagger')) ?? FALLBACK.stagger,
    ease: unresolved(ease) ? FALLBACK.ease : ease,
  };
}

export function keyframesOf(cfg) {
  if (cfg.entrance === 'fade') return [{ opacity: 0 }, { opacity: 1 }];
  if (cfg.entrance === 'scale') {
    const px = /^(\d*\.?\d+)px$/.exec(cfg.distance);
    const s = px ? Math.max(0.8, 1 - parseFloat(px[1]) / 400) : 0.94;
    return [{ opacity: 0, transform: `scale(${s})` }, { opacity: 1, transform: 'scale(1)' }];
  }
  return [{ opacity: 0, transform: `translateY(${cfg.distance})` }, { opacity: 1, transform: 'translateY(0)' }];
}

export function revealAfter(result, root, children, opts) {
  // eslint-disable-next-line no-use-before-define
  if (result && typeof result.then === 'function') return result.then((r) => { motion(root, children, opts); return r; });
  // eslint-disable-next-line no-use-before-define
  motion(root, children, opts);
  return result;
}

const DOCUMENT_POSITION_FOLLOWING = 4;
const sharedObservers = new WeakMap();
function sharedObserver(view) {
  let s = sharedObservers.get(view);
  if (s) return s;
  const owners = new Map();
  let io = null;
  const unobserve = (el) => {
    if (!owners.delete(el)) return;
    io.unobserve(el);
    if (!owners.size) { io.disconnect(); sharedObservers.delete(view); }
  };
  const sweep = () => {
    for (const [el, o] of [...owners]) {
      if (!el.isConnected) { o.show(el); unobserve(el); }
    }
  };
  io = new view.IntersectionObserver((entries) => {
    sweep();
    const byOwner = new Map();
    for (const e of entries) {
      const o = owners.get(e.target);
      if (o) (byOwner.get(o) || byOwner.set(o, []).get(o)).push(e);
    }
    // eslint-disable-next-line no-bitwise
    const order = [...byOwner.keys()].sort((a, b) => (
      // eslint-disable-next-line no-bitwise
      a.root.compareDocumentPosition(b.root) & DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    const taken = new Map();
    for (const o of order) {
      const group = o.siblings ? o.root.parentElement : null;
      const bucket = group ? (taken.get(group) || taken.set(group, new Map()).get(group)) : null;
      const base = bucket ? (bucket.get(o.siblings) || 0) : 0;
      const started = o.onIntersect(byOwner.get(o), base);
      if (bucket) bucket.set(o.siblings, base + started);
    }
  }, { rootMargin: '0px', threshold: 0 });
  s = {
    observe(el, owner) {
      const prev = owners.get(el);
      if (prev && prev !== owner) prev.release(el);
      owners.set(el, owner);
      io.observe(el);
      sweep();
    },
    unobserve,
  };
  sharedObservers.set(view, s);
  return s;
}

export default function motion(root, children, opts = {}) {
  if (!root || root.nodeType !== 1) return null;
  if (controllers.has(root)) return controllers.get(root);
  const doc = root.ownerDocument;
  const view = doc && doc.defaultView;
  const mq = view && typeof view.matchMedia === 'function' ? view.matchMedia(REDUCE) : null;
  const listOf = () => {
    const raw = typeof children === 'function' ? children() : children;
    return [...new Set(raw || [])].filter((c) => c && c.nodeType === 1 && typeof c.animate === 'function');
  };
  let obs = null;
  let frames = null;
  let anims = new Map();
  let sig = '';
  let order = [];

  const release = (el) => {
    const a = anims.get(el);
    if (a) a.cancel();
    anims.delete(el);
    // eslint-disable-next-line no-use-before-define
    if (!anims.size) listen(false);
  };
  const show = (el) => {
    release(el);
    if (obs) obs.unobserve(el);
  };
  let listening = false;
  let destroyed = false;
  // eslint-disable-next-line no-use-before-define
  const onReduce = () => { if (!destroyed) arm(true); };
  // eslint-disable-next-line no-use-before-define
  const onPrint = () => stop();
  const listen = (on) => {
    if (on === listening) return;
    listening = on;
    const verb = on ? 'addEventListener' : 'removeEventListener';
    if (mq && typeof mq[verb] === 'function') mq[verb]('change', onReduce);
    if (view && typeof view[verb] === 'function') view[verb]('beforeprint', onPrint);
  };
  const stop = () => {
    [...anims.keys()].forEach(show);
    anims = new Map();
    listen(false);
  };
  const onIntersect = (entries, base) => {
    const last = new Map();
    for (const e of entries) last.set(e.target, e);
    const entering = [];
    for (const e of last.values()) {
      // eslint-disable-next-line no-continue
      if (!anims.has(e.target)) continue;
      if (e.isIntersecting) entering.push(e.target);
      else if (e.boundingClientRect && e.rootBounds
        && e.boundingClientRect.bottom <= e.rootBounds.top) {
        show(e.target);
      }
    }
    entering.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    // eslint-disable-next-line no-use-before-define
    const cfg = current;
    entering.forEach((el, i) => {
      const a = anims.get(el);
      if (!a) return;
      if (obs) obs.unobserve(el);
      if (frames && typeof a.effect.setKeyframes === 'function') a.effect.setKeyframes(frames);
      a.effect.updateTiming({ delay: Math.min(base + i, STAGGER_CAP) * cfg.stagger });
      a.addEventListener('finish', () => { if (anims.get(el) === a) show(el); });
      a.play();
    });
    return entering.length;
  };
  const owner = { root, siblings: opts.siblings || null, onIntersect, show, release };

  let current = { entrance: 'none', duration: FALLBACK.duration, distance: FALLBACK.distance, stagger: FALLBACK.stagger, ease: FALLBACK.ease };
  let mo = null;
  const watch = () => {
    if (mo || !view || typeof view.MutationObserver !== 'function') return;
    // eslint-disable-next-line no-use-before-define
    mo = new view.MutationObserver(() => { if (!destroyed) arm(false); });
    mo.observe(root, { attributes: true, attributeFilter: ['style', 'class'] });
  };
  const arm = (force) => {
    if (destroyed) return;
    watch();
    if (hasMotionClass(root)) ensureStyle(doc);
    const cfg = readMotion(root);
    const next = JSON.stringify(cfg);
    if (!force && next === sig) return;
    sig = next;
    current = cfg;
    stop();
    const Observer = view && view.IntersectionObserver;
    if (cfg.entrance === 'none' || (mq && mq.matches) || typeof Observer !== 'function') return;
    order = listOf();
    if (!order.length) return;
    frames = keyframesOf(cfg);
    const timing = { duration: cfg.duration, easing: cfg.ease, fill: 'both' };
    obs = sharedObserver(view);
    for (const el of order) {
      let a;
      try {
        a = el.animate(HOLD_FRAMES, timing);
      } catch (e) {
        a = el.animate(HOLD_FRAMES, { ...timing, easing: FALLBACK.ease });
      }
      a.pause();
      anims.set(el, a);
      obs.observe(el, owner);
    }
    listen(true);
  };

  const onRefresh = () => arm(true);
  const section = root.closest ? root.closest('.section') : null;
  const refreshTargets = section && section !== root ? [root, section] : [root];
  refreshTargets.forEach((t) => t.addEventListener(MOTION_REFRESH_EVENT, onRefresh));

  const controller = Object.freeze({
    refresh: () => { if (!destroyed) arm(true); },
    config: () => ({ ...current }),
    destroy: () => {
      destroyed = true;
      stop();
      if (mo) mo.disconnect();
      mo = null;
      refreshTargets.forEach((t) => t.removeEventListener(MOTION_REFRESH_EVENT, onRefresh));
      controllers.delete(root);
    },
  });
  controllers.set(root, controller);
  const hinted = hasMotionClass(root)
    || [root, section].some((n) => n && (n.getAttribute('style') || '').includes('--spectrum2-motion-'));
  if (hinted) arm(true);
  return controller;
}

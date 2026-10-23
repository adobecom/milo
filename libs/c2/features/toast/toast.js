import { createTag, loadStyle } from '../../../utils/utils.js';

// WCAG 2.2.1: give people enough time to read a toast before it disappears.
const MIN_DURATION = 5000;
const LEAVE_MS = 400;
const VARIANTS = ['neutral', 'informative', 'positive', 'negative'];

const ICONS = {
  informative: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><circle cx="10" cy="6.5" r="1" fill="currentColor"/><rect x="9.25" y="9" width="1.5" height="5" rx="0.75" fill="currentColor"/></svg>',
  positive: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="1.5" fill="none"/><path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  negative: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false"><path d="M8.564 2.955a1.667 1.667 0 0 1 2.872 0l7.167 12.444A1.667 1.667 0 0 1 17.167 18H2.833a1.667 1.667 0 0 1-1.436-2.601L8.564 2.955Z" stroke="currentColor" stroke-width="1.5" fill="none"/><rect x="9.25" y="7.5" width="1.5" height="5" rx="0.75" fill="currentColor"/><circle cx="10" cy="14.5" r="1" fill="currentColor"/></svg>',
};
const CLOSE_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10" aria-hidden="true" focusable="false"><path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

// Keeps the remaining time across pause/resume so hovering doesn't restart the countdown.
class Timer {
  constructor(callback, delay) {
    this.callback = callback;
    this.remaining = delay;
    this.timerId = null;
    this.resume();
  }

  pause() {
    if (this.timerId === null) return;
    clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= Date.now() - this.startTime;
  }

  resume() {
    if (this.remaining <= 0 || this.timerId !== null) return;
    this.startTime = Date.now();
    this.timerId = setTimeout(this.callback, this.remaining);
  }

  clear() {
    clearTimeout(this.timerId);
    this.timerId = null;
  }
}

const items = new Map();
let region = null;
let nextId = 0;
let hovered = false;
let focused = false;

function syncTimers() {
  items.forEach(({ timer }) => (hovered || focused ? timer?.pause() : timer?.resume()));
}

function getRegion() {
  if (region?.isConnected) return region;
  loadStyle(new URL('./toast.css', import.meta.url).href);
  region = createTag('div', { class: 'c2-toast-region', role: 'region', 'aria-label': 'Notifications', tabindex: '-1' });
  region.addEventListener('mouseenter', () => { hovered = true; syncTimers(); });
  region.addEventListener('mouseleave', () => { hovered = false; syncTimers(); });
  region.addEventListener('focusin', () => { focused = true; syncTimers(); });
  region.addEventListener('focusout', () => { focused = false; syncTimers(); });
  document.body.append(region);
  return region;
}

function removeToast(id) {
  const item = items.get(id);
  if (!item) return;
  item.timer?.clear();
  if (item.el.contains(document.activeElement)) region.focus();
  item.el.remove();
  items.delete(id);
}

function isSafeHref(href) {
  try {
    return ['http:', 'https:'].includes(new URL(href, window.location.href).protocol);
  } catch {
    return false;
  }
}

function resolveDuration(hasCta, duration) {
  // Actionable toasts stay until dismissed so the action can't vanish mid-read.
  if (hasCta || duration === null) return null;
  return Math.max(duration ?? MIN_DURATION, MIN_DURATION);
}

/**
 * Dismisses a toast with its exit transition. Without an id, every toast is dismissed.
 * @param {number} [id]
 */
export function hideToast(id) {
  if (id === undefined) {
    [...items.keys()].forEach((key) => hideToast(key));
    return;
  }
  const item = items.get(id);
  if (!item || item.leaving) return;
  item.leaving = true;
  item.timer?.clear();
  item.el.classList.remove('is-visible');
  setTimeout(() => removeToast(id), LEAVE_MS);
}

/**
 * Shows a page-level toast notification.
 * @param {object} options
 * @param {string} options.message Plain text message.
 * @param {'neutral'|'informative'|'positive'|'negative'} [options.variant]
 * @param {string} [options.ctaLabel] Optional action label.
 * @param {string} [options.ctaHref] Link for the action (http/https only).
 * @param {Function} [options.ctaAction] Click handler for the action when there is no link.
 * @param {number|null} [options.duration] ms before auto-dismiss (min 5000); null keeps it open.
 * @param {string} [options.key] Only one toast per key is shown at a time.
 * @returns {number|null} Toast id, or null when nothing was shown.
 */
export function showToast({
  message, variant = 'neutral', ctaLabel, ctaHref, ctaAction, duration, key,
} = {}) {
  if (!message) return null;
  if (key) {
    const existing = [...items.entries()]
      .find(([, item]) => item.key === key && !item.leaving && item.el.isConnected);
    if (existing) return existing[0];
  }

  const type = VARIANTS.includes(variant) ? variant : 'neutral';
  const href = ctaHref && isSafeHref(ctaHref) ? ctaHref : null;
  const hasCta = Boolean(ctaLabel && (href || typeof ctaAction === 'function'));
  nextId += 1;
  const id = nextId;

  const el = createTag('div', { class: `c2-toast c2-toast-${type}`, 'data-toast-id': id });
  if (ICONS[type]) el.append(createTag('span', { class: 'c2-toast-icon' }, ICONS[type]));

  // Revealed a frame after mount so screen readers announce it once.
  const body = createTag('div', {
    class: 'c2-toast-body',
    role: type === 'negative' ? 'alert' : 'status',
    'aria-atomic': 'true',
    'aria-hidden': 'true',
  });
  const text = createTag('span', { class: 'c2-toast-message' });
  text.textContent = message;
  body.append(text);
  if (hasCta) {
    const cta = href
      ? createTag('a', { class: 'c2-toast-cta', href })
      : createTag('button', { class: 'c2-toast-cta', type: 'button' });
    cta.textContent = ctaLabel;
    if (!href) cta.addEventListener('click', ctaAction);
    body.append(cta);
  }
  el.append(body);

  const close = createTag('button', { class: 'c2-toast-close', type: 'button', 'aria-label': 'Dismiss notification', 'daa-ll': 'Toast-Close' }, CLOSE_ICON);
  close.addEventListener('click', () => hideToast(id));
  el.append(close);

  getRegion().append(el);
  const item = { el, key, leaving: false, timer: null };
  items.set(id, item);

  const ms = resolveDuration(hasCta, duration);
  if (ms !== null) {
    item.timer = new Timer(() => hideToast(id), ms);
    if (hovered || focused) item.timer.pause();
  }

  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.classList.add('is-visible');
    body.removeAttribute('aria-hidden');
  }));

  return id;
}

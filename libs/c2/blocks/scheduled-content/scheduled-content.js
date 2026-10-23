import { createTag } from '../../../utils/utils.js';

// setTimeout overflows past ~24.8 days, so longer waits re-check when the timer fires.
const MAX_TIMEOUT = 2 ** 31 - 1;
const DEFAULT_LABELS = ['', 'default', 'before'];

/**
 * Parses an authored date/time. ISO 8601 is recommended (2026-11-01T09:00:00-07:00); a space
 * instead of the "T" and a trailing UTC/GMT are also accepted.
 * @param {string} text
 * @returns {number} Epoch ms, or NaN.
 */
export function parseTime(text) {
  const normalized = (text ?? '').trim()
    .replace(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})/, '$1T$2')
    .replace(/\s*(UTC|GMT)$/i, 'Z');
  return normalized ? Date.parse(normalized) : NaN;
}

// ?instant= previews another moment (same parameter as MEP and the countdown timer).
const instant = parseTime(new URLSearchParams(window.location.search).get('instant'));
const offset = Number.isNaN(instant) ? 0 : instant - Date.now();
export const getNow = () => Date.now() + offset;

function getFragmentHref(cell) {
  const link = cell.querySelector('a[href]');
  const value = link?.href ?? cell.textContent.trim();
  if (!/^(\/|https?:\/\/)/.test(value)) return null;
  try {
    const url = new URL(value, window.location.origin);
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

/**
 * @param {HTMLElement} el
 * @returns {{ start: number, href: string|null, label: string }[]} Sorted by start time.
 */
export function readSchedule(el) {
  const entries = [];
  [...el.querySelectorAll(':scope > div')].forEach((row) => {
    const [timeCell, contentCell] = row.children;
    if (!timeCell || !contentCell) return;
    const label = timeCell.textContent.trim();
    const start = DEFAULT_LABELS.includes(label.toLowerCase()) ? -Infinity : parseTime(label);
    if (Number.isNaN(start)) {
      window.lana?.log(`scheduled-content: invalid time "${label}"`, { tags: 'scheduled-content', severity: 'warning' });
      return;
    }
    entries.push({ start, href: getFragmentHref(contentCell), label: label || 'default' });
  });
  return entries.sort((a, b) => a.start - b.start);
}

export function getActiveEntry(entries, now) {
  return entries.findLast((entry) => entry.start <= now) ?? null;
}

export default async function init(el) {
  const entries = readSchedule(el);
  el.replaceChildren();
  if (!entries.length) {
    el.remove();
    return;
  }

  let active;
  let timer;
  let renderId = 0;

  const render = async (entry) => {
    if (entry === active) return;
    active = entry;
    renderId += 1;
    const id = renderId;
    el.dataset.activeSlot = entry?.label ?? 'none';
    // Hold the current height so the page doesn't jump while the next fragment loads.
    if (el.offsetHeight) el.style.minHeight = `${el.offsetHeight}px`;
    el.replaceChildren();
    if (entry?.href) {
      const a = createTag('a', { href: entry.href }, null, { parent: el });
      try {
        const { default: loadFragment } = await import('../../../blocks/fragment/fragment.js');
        await loadFragment(a);
      } catch (e) {
        window.lana?.log(`scheduled-content: failed to load ${entry.href} - ${e?.message}`, { tags: 'scheduled-content', severity: 'error' });
      }
    }
    if (id === renderId) el.style.removeProperty('min-height');
  };

  const update = async () => {
    clearTimeout(timer);
    if (!el.isConnected && active !== undefined) return;
    const now = getNow();
    const next = entries.find((entry) => entry.start > now);
    if (next) timer = setTimeout(update, Math.min(next.start - now + 1, MAX_TIMEOUT));
    await render(getActiveEntry(entries, now));
  };

  // Background tabs throttle timers, so re-check as soon as the page is visible again.
  const onVisible = () => {
    if (!el.isConnected) {
      document.removeEventListener('visibilitychange', onVisible);
      return;
    }
    if (document.visibilityState === 'visible') update();
  };
  document.addEventListener('visibilitychange', onVisible);

  await update();
}

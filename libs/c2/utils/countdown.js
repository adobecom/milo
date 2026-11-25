import { createTag } from '../../utils/utils.js';

const UNITS = [['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];

export function parseRange(text = '') {
  const dates = text.split(',').map((part) => Date.parse(part.trim()));
  if (dates.length > 2 || dates.some(Number.isNaN)) return null;
  const [start, end] = dates.length === 2 ? dates : [-Infinity, dates[0]];
  return start < end ? { start, end } : null;
}

export function splitDuration(ms) {
  let remaining = Math.max(0, Math.floor(ms / 1000));
  return UNITS.map(([unit, seconds]) => {
    const value = Math.floor(remaining / seconds);
    remaining %= seconds;
    return { unit, value };
  });
}

// ?instant= shifts the clock to preview scheduled states
function getClockOffset() {
  const instant = Date.parse(new URLSearchParams(window.location.search).get('instant'));
  return Number.isNaN(instant) ? 0 : instant - Date.now();
}

function getStatus(now, { start, end }) {
  if (now >= end) return 'ended';
  return now >= start ? 'running' : 'pending';
}

function buildTimer(className) {
  const el = createTag('div', { class: className, role: 'timer' });
  const digits = createTag('span', { class: 'countdown-digits', dir: 'ltr', 'aria-hidden': 'true' });
  const values = UNITS.map((_, i) => {
    if (i) createTag('span', { class: 'countdown-separator' }, ':', { parent: digits });
    return createTag('span', { class: 'countdown-value' }, '00', { parent: digits });
  });
  const label = createTag('span', { class: 'sr-only' });
  el.append(digits, label);
  return { el, values, label };
}

export default function createCountdown(range) {
  const lang = document.documentElement.lang || 'en-US';
  const formatters = UNITS.map(([unit]) => new Intl.NumberFormat(lang, { style: 'unit', unit, unitDisplay: 'long' }));
  const timers = [];
  let interval;
  let status;

  const render = ({ values, label }, parts) => {
    parts.forEach(({ value }, i) => { values[i].textContent = String(value).padStart(2, '0'); });
    label.textContent = parts.map(({ value }, i) => formatters[i].format(value)).join(' ');
  };

  const stop = () => clearInterval(interval);

  return {
    createTimer(className = 'countdown') {
      const timer = buildTimer(className);
      timers.push(timer);
      return timer.el;
    },
    start(onStatusChange) {
      const offset = getClockOffset();
      const tick = () => {
        const now = Date.now() + offset;
        const next = getStatus(now, range);
        if (next === 'running') {
          const parts = splitDuration(range.end - now);
          timers.forEach((timer) => render(timer, parts));
        }
        if (next !== status) {
          status = next;
          onStatusChange?.(status);
        }
        if (status === 'ended') stop();
      };
      tick();
      if (status !== 'ended') interval = setInterval(tick, 1000);
    },
    stop,
  };
}

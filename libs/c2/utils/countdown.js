const UNITS = [['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]];

// Parsed exactly like the C1 countdown timer: dates without an offset use the visitor's local time
export const parseDate = (text = '') => Date.parse(text.trim());

// "end" or "start, end[, start, end…]" with ranges in chronological order
export function parseRanges(text = '') {
  const dates = text.split(',').map(parseDate);
  if (dates.some(Number.isNaN)) return null;
  if (dates.length === 1) return [{ start: -Infinity, end: dates[0] }];
  if (dates.length % 2) return null;
  const ranges = [];
  for (let i = 0; i < dates.length; i += 2) ranges.push({ start: dates[i], end: dates[i + 1] });
  const isOrdered = ({ start, end }, i) => start < end && (!i || start >= ranges[i - 1].end);
  return ranges.every(isOrdered) ? ranges : null;
}

export function splitDuration(ms) {
  let remaining = Math.max(0, Math.floor(ms / 1000));
  return UNITS.map(([unit, seconds]) => {
    const value = Math.floor(remaining / seconds);
    remaining %= seconds;
    return { unit, value };
  });
}

// remaining counts down to the next status change: the range start if pending, its end if running
export function getCountdownState(now, ranges) {
  const range = ranges.find(({ end }) => now < end);
  if (!range) return { status: 'ended', range: null, remaining: 0, parts: splitDuration(0) };
  const status = now < range.start ? 'pending' : 'running';
  const remaining = (status === 'pending' ? range.start : range.end) - now;
  return { status, range, remaining, parts: splitDuration(remaining) };
}

// ?instant= shifts the clock to preview scheduled states
function getClockOffset() {
  const instant = Date.parse(new URLSearchParams(window.location.search).get('instant'));
  return Number.isNaN(instant) ? 0 : instant - Date.now();
}

export default function createCountdown(ranges) {
  const listeners = new Set();
  const offset = getClockOffset();
  const now = () => Date.now() + offset;
  let state;
  let timeout;
  let controller;

  const stop = () => {
    clearTimeout(timeout);
    controller?.abort();
    controller = null;
  };

  function tick() {
    state = getCountdownState(now(), ranges);
    listeners.forEach((listener) => listener(state));
    if (state.status === 'ended') stop();
    // Tick just after the displayed second changes so early or late timers never skip a digit
    else if (!document.hidden) timeout = setTimeout(tick, (state.remaining % 1000) + 10);
  }

  return {
    start() {
      if (controller || state?.status === 'ended') return;
      controller = new AbortController();
      // Hidden tabs skip ticks and catch up on return
      document.addEventListener('visibilitychange', () => {
        clearTimeout(timeout);
        if (!document.hidden) tick();
      }, { signal: controller.signal });
      tick();
    },
    stop,
    subscribe(listener) {
      listeners.add(listener);
      if (state) listener(state);
      return () => listeners.delete(listener);
    },
    getState: () => state ?? getCountdownState(now(), ranges),
  };
}

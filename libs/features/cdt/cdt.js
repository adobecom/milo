import { getMetadata, getConfig, createTag, getMepEnablement } from '../../utils/utils.js';
import getPromoManifests from '../personalization/promo-utils.js';
import { replaceKey } from '../placeholders.js';

function loadCountdownTimer(
  container,
  cdtLabel,
  cdtDays,
  cdtHours,
  cdtMins,
  timeRangesEpoch,
) {
  let isVisible = false;
  let interval;
  const oneMinuteinMs = 60000;

  const instant = new URL(window.location.href)?.searchParams?.get('instant');
  let currentTime = instant ? Date.parse(instant) : Date.now();

  function appendTimerBox(parent, value, label) {
    const fragment = createTag('div', { class: 'timer-fragment' }, null, { parent });
    const unitContainer = createTag('div', { class: 'timer-unit-container' }, null, { parent: fragment });
    createTag('div', { class: 'timer-unit-label' }, label, { parent: fragment });

    createTag('div', { class: 'timer-box' }, Math.floor(value / 10).toString(), { parent: unitContainer });
    createTag('div', { class: 'timer-box' }, (value % 10).toString(), { parent: unitContainer });
  }

  function appendSeparator(parent) {
    createTag('div', { class: 'timer-separator' }, ':', { parent });
  }

  function appendTimerBlock(parent, daysLeft, hoursLeft, minutesLeft) {
    const timerBlock = createTag('div', { class: 'timer-block' }, null, { parent });
    appendTimerBox(timerBlock, daysLeft, cdtDays);
    appendSeparator(timerBlock);
    appendTimerBox(timerBlock, hoursLeft, cdtHours);
    appendSeparator(timerBlock);
    appendTimerBox(timerBlock, minutesLeft, cdtMins);
  }

  function appendTimerLabel(parent, label) {
    createTag('div', { class: 'timer-label' }, label, { parent });
  }

  function removeCountdown() {
    container.replaceChildren();
  }

  function render(daysLeft, hoursLeft, minutesLeft) {
    if (!isVisible) return;

    removeCountdown();

    appendTimerLabel(container, cdtLabel);
    appendTimerBlock(container, daysLeft, hoursLeft, minutesLeft);
  }

  function updateCountdown() {
    for (let i = 0; i < timeRangesEpoch.length; i += 2) {
      const startTime = timeRangesEpoch[i];
      const endTime = timeRangesEpoch[i + 1];

      if (currentTime >= startTime && currentTime <= endTime) {
        isVisible = true;
        const diffTime = endTime - currentTime;
        const daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        render(daysLeft, hoursLeft, minutesLeft);
        currentTime += oneMinuteinMs;
        return;
      }
    }

    isVisible = false;
    clearInterval(interval);
    removeCountdown();
  }

  function startCountdown() {
    updateCountdown();
    interval = setInterval(updateCountdown, oneMinuteinMs);
  }

  startCountdown();
}

const C2_UNITS = [['cdt-days', 86400000], ['cdt-hours', 3600000], ['cdt-mins', 60000], ['cdt-secs', 1000]];

// Opt-in C2 timer: ticks every second, waits for an upcoming range and reports status changes.
// Removing the element from the page stops it.
function loadC2CountdownTimer(container, labels, timeRangesEpoch, onStatus) {
  const instant = Date.parse(new URL(window.location.href).searchParams.get('instant'));
  const offset = Number.isNaN(instant) ? 0 : instant - Date.now();
  const ranges = [];
  for (let i = 0; i < timeRangesEpoch.length; i += 2) {
    ranges.push([timeRangesEpoch[i], timeRangesEpoch[i + 1]]);
  }
  const digits = createTag('span', { class: 'countdown-digits', dir: 'ltr', 'aria-hidden': 'true' }, null, { parent: container });
  const label = createTag('span', { class: 'sr-only' }, null, { parent: container });
  const values = C2_UNITS.map((unit, i) => {
    if (i) createTag('span', { class: 'countdown-separator' }, ':', { parent: digits });
    return createTag('span', { class: 'countdown-value' }, null, { parent: digits });
  });
  const controller = new AbortController();
  let status;
  let timeout;

  function render(remaining) {
    let rest = remaining;
    const parts = C2_UNITS.map(([, ms]) => {
      const value = Math.floor(rest / ms);
      rest %= ms;
      return value;
    });
    parts.forEach((value, i) => { values[i].textContent = String(value).padStart(2, '0'); });
    label.textContent = parts.map((value, i) => `${value} ${labels[i]}`).join(' ');
  }

  function tick() {
    clearTimeout(timeout);
    if (status && !container.isConnected) {
      controller.abort();
      return;
    }
    const now = Date.now() + offset;
    const running = ranges.find(([start, end]) => now >= start && now < end);
    const upcoming = Math.min(...ranges.map(([start]) => start).filter((start) => start > now));
    const next = (running && 'running') || (Number.isFinite(upcoming) ? 'pending' : 'ended');
    if (running) render(running[1] - now);
    container.hidden = !running;
    if (next !== status) {
      status = next;
      onStatus?.(status);
    }
    if (status === 'ended') {
      controller.abort();
      return;
    }
    if (document.hidden) return;
    // Tick just after the displayed second changes so early or late timers never skip a digit
    const delay = running ? (running[1] - now) % 1000 : Math.min(upcoming - now, 60000);
    timeout = setTimeout(tick, delay + 10);
  }

  // Hidden tabs skip ticks and catch up on return
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tick();
  }, { signal: controller.signal });
  tick();
}

function isMobile() {
  return window.matchMedia('(max-width: 767px)').matches;
}

function getCDTTimeRange(cdtMetadata) {
  let metadata = cdtMetadata;
  if (!metadata) {
    const promoEnabled = getMepEnablement('manifestnames', 'promo');
    const PAGE_URL = new URL(window.location.href);
    const persManifests = getPromoManifests(promoEnabled, PAGE_URL.searchParams);
    persManifests?.forEach((manifest) => {
      if (manifest.disabled) return;
      if (!manifest.event.cdtStart || !manifest.event.cdtEnd) return;

      metadata = `${manifest.event.cdtStart},${manifest.event.cdtEnd}`;
    });
  }

  if (!metadata) {
    metadata = getMetadata('countdown-timer');
    if (metadata === null) {
      throw new Error('Metadata for countdown-timer is not available');
    }
  }

  const cdtRange = metadata.split(',');
  if (cdtRange.length % 2 !== 0) {
    throw new Error('Invalid countdown timer range');
  }

  const timeRangesEpoch = cdtRange.map((time) => {
    const parsedTime = Date.parse(time?.trim());
    return Number.isNaN(parsedTime) ? null : parsedTime;
  });

  if (timeRangesEpoch.includes(null)) {
    throw new Error('Invalid format for countdown timer range');
  }

  return timeRangesEpoch;
}

async function initC2CDT(el, cdtMetadata, { className = 'countdown-timer', onStatus } = {}) {
  const timeRangesEpoch = getCDTTimeRange(cdtMetadata);
  const labels = await Promise.all(C2_UNITS.map(([key]) => replaceKey(key, getConfig())));
  const cdtDiv = createTag('div', { class: className, role: 'timer' }, null, { parent: el });
  loadC2CountdownTimer(cdtDiv, labels, timeRangesEpoch, onStatus);
  return cdtDiv;
}

// options.c2 opts into the C2 timer: DD:HH:MM:SS with screen-reader units, no cdt.css,
// and options.onStatus('pending' | 'running' | 'ended') for status changes
export default async function initCDT(el, classList, cdtMetadata, options = {}) {
  if (options.c2) return initC2CDT(el, cdtMetadata, options);
  const placeholders = ['cdt-ends-in', 'cdt-days', 'cdt-hours', 'cdt-mins'];
  const [cdtLabel, cdtDays, cdtHours, cdtMins] = await Promise.all(
    placeholders.map((placeholder) => replaceKey(placeholder, getConfig())),
  );

  const timeRangesEpoch = getCDTTimeRange(cdtMetadata);
  const cdtDiv = createTag('div', { class: 'countdown-timer' }, null, { parent: el });
  cdtDiv.classList.add(isMobile() ? 'vertical' : 'horizontal');
  if (classList.contains('dark')) cdtDiv.classList.add('dark');
  if (classList.contains('center')) cdtDiv.classList.add('center');

  loadCountdownTimer(cdtDiv, cdtLabel, cdtDays, cdtHours, cdtMins, timeRangesEpoch);
  return cdtDiv;
}

import { getMetadata, getConfig, loadStyle, createTag } from '../../utils/utils.js';
import { replaceKey } from '../placeholders.js';

const replacePlaceholder = async (key) => replaceKey(key, getConfig());

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
    container.innerHTML = '';
  }

  function render(daysLeft, hoursLeft, minutesLeft) {
    if (!isVisible) return;

    removeCountdown();

    appendTimerLabel(container, cdtLabel);
    appendTimerBlock(container, daysLeft, hoursLeft, minutesLeft);
  }

  function updateCountdown() {
    const currentTime = Date.now();

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
        return;
      }
    }

    isVisible = false;
    clearInterval(interval);
    removeCountdown();
  }

  function startCountdown() {
    const oneMinuteinMs = 60000;
    updateCountdown();
    interval = setInterval(updateCountdown, oneMinuteinMs);
  }

  startCountdown();
}

const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default async function initCDT(el, classList) {
  try {
    const { miloLibs, codeRoot } = getConfig();
    loadStyle(`${miloLibs || codeRoot}/features/cdt/cdt.css`);

    const placeholders = ['cdt-ends-in', 'cdt-days', 'cdt-hours', 'cdt-mins'];
    const [cdtLabel, cdtDays, cdtHours, cdtMins] = await Promise.all(
      placeholders.map(replacePlaceholder),
    );

    const cdtMetadata = getMetadata('countdown-timer');
    if (cdtMetadata === null) {
      throw new Error('Metadata for countdown-timer is not available');
    }

    const cdtRange = cdtMetadata.split(',');
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

    const cdtDiv = createTag('div', { class: 'countdown-timer' }, null, { parent: el });
    cdtDiv.classList.add(isMobileDevice() ? 'vertical' : 'horizontal');
    cdtDiv.classList.add(classList.contains('dark') ? 'dark' : 'light');
    if (classList.contains('center')) cdtDiv.classList.add('center');

    loadCountdownTimer(cdtDiv, cdtLabel, cdtDays, cdtHours, cdtMins, timeRangesEpoch);
  } catch (error) {
    window.lana?.log(`Failed to load countdown timer module: ${error}`, { tags: 'countdown-timer' });
  }
}

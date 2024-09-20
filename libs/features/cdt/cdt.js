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

  function createTimerBox(value) {
    const unitContainer = createTag('div', { class: 'timer-unit-container' });
    const tensBox = createTag('div', { class: 'timer-box' }, Math.floor(value / 10).toString());
    const onesBox = createTag('div', { class: 'timer-box' }, (value % 10).toString());

    unitContainer.appendChild(tensBox);
    unitContainer.appendChild(onesBox);
    return unitContainer;
  }

  function createTimerFragment(value, label) {
    const fragment = createTag('div', { class: 'timer-fragment' });
    const unitContainer = createTimerBox(value);
    const unitLabel = createTag('div', { class: 'timer-unit-label' }, label);

    fragment.appendChild(unitContainer);
    fragment.appendChild(unitLabel);
    return fragment;
  }

  function appendLabel(parent, label) {
    const labelElement = createTag('div', { class: 'timer-label' }, label);
    parent.appendChild(labelElement);
  }

  function appendTimerBlock(parent) {
    const timerBlock = createTag('div', { class: 'timer-block' });
    parent.appendChild(timerBlock);
    return timerBlock;
  }

  function appendTimerFragment(parent, timeValue, label) {
    const fragment = createTimerFragment(timeValue, label);
    parent.appendChild(fragment);
  }

  function appendSeparator(parent) {
    const separator = createTag('div', { class: 'timer-separator' }, ':');
    parent.appendChild(separator);
  }

  function removeCountdown() {
    container.innerHTML = '';
  }

  function render(daysLeft, hoursLeft, minutesLeft) {
    if (!isVisible) return;

    removeCountdown();

    appendLabel(container, cdtLabel);
    const timerBlock = appendTimerBlock(container);

    appendTimerFragment(timerBlock, daysLeft, cdtDays);
    appendSeparator(timerBlock);
    appendTimerFragment(timerBlock, hoursLeft, cdtHours);
    appendSeparator(timerBlock);
    appendTimerFragment(timerBlock, minutesLeft, cdtMins);
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

    const cdtRange = (getMetadata('countdown-timer')).split(',');
    const timeRangesEpoch = cdtRange.map((time) => Date.parse(time?.trim()));

    const cdtDiv = createTag('div', { class: 'countdown-timer' });
    cdtDiv.classList.add(isMobileDevice() ? 'vertical' : 'horizontal');
    cdtDiv.classList.add(classList.contains('dark') ? 'dark' : 'light');
    if (classList.contains('center')) cdtDiv.classList.add('center');
    el.appendChild(cdtDiv);

    loadCountdownTimer(cdtDiv, cdtLabel, cdtDays, cdtHours, cdtMins, timeRangesEpoch);
  } catch (error) {
    window.lana?.log(`Failed to load countdown timer module: ${error}`, { tags: 'countdown-timer' });
  }
}

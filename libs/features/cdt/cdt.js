import { getMetadata, getConfig, loadStyle } from '../../utils/utils.js';
import { replaceKey } from '../placeholders.js';

const replacePlaceholder = async (key) => replaceKey(key, getConfig());

async function loadCountdownTimer(container) {
  const cdtLabel = await replacePlaceholder('cdt-ends-in');
  const cdtDays = await replacePlaceholder('cdt-days');
  const cdtHours = await replacePlaceholder('cdt-hours');
  const cdtMins = await replacePlaceholder('cdt-mins');
  const cdtRange = (getMetadata('countdown-timer')).split(',');
  const timeRangesEpoch = cdtRange.map((time) => Date.parse(time.trim()));
  let isVisible = false;
  let interval;

  const { miloLibs, codeRoot } = getConfig();
  await Promise.resolve(loadStyle(`${miloLibs || codeRoot}/features/cdt/cdt.css`));

  function createTimerFragment(value, label) {
    const fragment = document.createElement('div');
    fragment.classList.add('timer-fragment');

    const unitContainer = document.createElement('div');
    unitContainer.classList.add('timer-unit-container');
    fragment.appendChild(unitContainer);

    const tensBox = document.createElement('div');
    tensBox.classList.add('timer-box');
    tensBox.textContent = Math.floor(value / 10);
    unitContainer.appendChild(tensBox);

    const onesBox = document.createElement('div');
    onesBox.classList.add('timer-box');
    onesBox.textContent = value % 10;
    unitContainer.appendChild(onesBox);

    const unitLabel = document.createElement('div');
    unitLabel.classList.add('timer-unit-label');
    unitLabel.textContent = label;
    fragment.appendChild(unitLabel);

    return fragment;
  }

  function removeCountdown() {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  function createSeparator() {
    const separator = document.createElement('div');
    separator.classList.add('timer-label');
    separator.textContent = ':';
    return separator;
  }

  function render(daysLeft, hoursLeft, minutesLeft) {
    if (!isVisible) return;

    removeCountdown();

    const labelElement = document.createElement('div');
    labelElement.classList.add('timer-label');
    labelElement.textContent = cdtLabel;
    container.appendChild(labelElement);

    const timerBlock = document.createElement('div');
    timerBlock.classList.add('timer-block');
    container.appendChild(timerBlock);

    timerBlock.appendChild(createTimerFragment(daysLeft, cdtDays));
    timerBlock.appendChild(createSeparator());
    timerBlock.appendChild(createTimerFragment(hoursLeft, cdtHours));
    timerBlock.appendChild(createSeparator());
    timerBlock.appendChild(createTimerFragment(minutesLeft, cdtMins));
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
    interval = setInterval(() => {
      updateCountdown();
    }, oneMinuteinMs);
  }

  startCountdown();
}

const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);

export default async function initCDT(el, classesToAdd) {
  try {
    const cdtDiv = document.createElement('div');
    cdtDiv.classList.add('countdown-timer');
    classesToAdd.forEach((className) => {
      cdtDiv.classList.add(className);
    });
    cdtDiv.classList.add(isMobileDevice() ? 'vertical' : 'horizontal');
    el.appendChild(cdtDiv);
    await loadCountdownTimer(cdtDiv);
  } catch (error) {
    window.lana?.log(`Failed to load countdown timer module: ${error}`, { tags: 'countdown-timer' });
  }
}

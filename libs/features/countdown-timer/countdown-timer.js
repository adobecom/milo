import { getMetadata, getConfig, loadStyle } from "../../utils/utils.js";

const CountdownTimer = {
  daysLeft: '',
  hoursLeft: '',
  minutesLeft: '',
  isVisible: false,
  timeWords: [],
  timeRangesEpoch: [],

  async init(el) {
    try {
      const { miloLibs, codeRoot } = getConfig();
      await Promise.resolve(loadStyle(`${miloLibs || codeRoot}/features/countdown-timer/countdown-timer.css`));

      const cdtLabel = 'ENDS IN';   //getMetadata('cdt:label');
      if(!cdtLabel) return;
      
      const daysHoursMins = 'DAYS HOURS MINS';  //getMetadata('cdt:daysHoursMins');
      const startTime = '2024-07-19T04:27:57.938Z';//getMetadata('cdt:endTime');
      const endTime = '2024-10-19T04:27:57.938Z';//getMetadata('cdt:endTime');
      const variant = 'dark,horizontal';// getMetadata('cdt:variant');

      const timeRanges = "1724702400000,1727683200000,1733083200000,1734508800000"; // fix this

      this.label = cdtLabel;
      this.dayshoursmins = daysHoursMins;
      this.timeranges = timeRanges;
      this.timeWords = this.dayshoursmins.split(' ');
      try {
        this.timeRangesEpoch = [Date.parse(startTime), Date.parse(endTime)];
      } catch (e) {
        console.error("Error parsing date:", e);
        this.timeRangesEpoch = [0, 0];
      }

      this.createTimer(el, variant);
      this.countdownStart();
    } catch (error) {
      el.replaceWith('');
      window.lana?.log(`Failed to load countdown timer module: ${error}`);
    }
  },

  createTimer(el, variant) {
    // Remove existing countdown-timer element if present
    const existingTimer = el.querySelector('.countdown-timer');
    if (existingTimer) {
      existingTimer.remove();
    }

    let styles = variant.split(',');
    styles.push('countdown-timer');

    // Create and append main container
    const container = document.createElement('div');
    container.className = styles.join(' '); // "countdown-timer horizontal dark";//
    el.appendChild(container);

    // Create and append label
    const label = document.createElement('div');
    label.className = 'timer-label';
    label.textContent = this.label;
    container.appendChild(label);

    // Create and append timer block
    const timerBlock = document.createElement('div');
    timerBlock.className = 'timer-block';
    container.appendChild(timerBlock);

    // Helper function to create timer fragment
    const createTimerFragment = (id, value, label) => {
      const fragment = document.createElement('div');
      fragment.id = id;
      fragment.className = 'timer-fragment';

      const unitContainer = document.createElement('div');
      unitContainer.className = 'timer-unit-container';
      fragment.appendChild(unitContainer);

      const box1 = document.createElement('div');
      box1.className = 'timer-box';
      box1.textContent = Math.floor(value / 10);
      unitContainer.appendChild(box1);

      const box2 = document.createElement('div');
      box2.className = 'timer-box';
      box2.textContent = value % 10;
      unitContainer.appendChild(box2);

      const unitLabel = document.createElement('div');
      unitLabel.className = 'timer-unit-label';
      unitLabel.textContent = label;
      fragment.appendChild(unitLabel);

      return fragment;
    };

    // Append days fragment
    timerBlock.appendChild(createTimerFragment('cdt-days', this.daysLeft, this.timeWords[0]));

    // Append separator
    const separator1 = document.createElement('div');
    separator1.className = 'timer-label';
    separator1.textContent = ':';
    timerBlock.appendChild(separator1);

    // Append hours fragment
    timerBlock.appendChild(createTimerFragment('cdt-hours', this.hoursLeft, this.timeWords[1]));

    // Append separator
    const separator2 = document.createElement('div');
    separator2.className = 'timer-label';
    separator2.textContent = ':';
    timerBlock.appendChild(separator2);

    // Append minutes fragment
    timerBlock.appendChild(createTimerFragment('cdt-minutes', this.minutesLeft, this.timeWords[2]));
  },

  countdownStart() {
    const oneMinuteInMs = 60000;
    this.countdownUpdate();
    this.countdownInterval = setInterval(() => { this.countdownUpdate(); }, oneMinuteInMs);
  },

  countdownUpdate() {
    const currentTime = Date.now();
    let isVisible = false;
    let daysLeft = 0, hoursLeft = 0, minutesLeft = 0;

    for (let i = 0; i < this.timeRangesEpoch.length; i += 2) {
      const startTime = this.timeRangesEpoch[i];
      const endTime = this.timeRangesEpoch[i + 1];

      if (currentTime >= startTime && currentTime <= endTime) {
        isVisible = true;
        const diffTime = endTime - currentTime;
        daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        break;
      }
    }

    this.isVisible = isVisible;
    this.daysLeft = daysLeft;
    this.hoursLeft = hoursLeft;
    this.minutesLeft = minutesLeft;
    this.update();
  },

  update() {
    const el = document.querySelector('.countdown-timer');
    if (!this.isVisible) {
      el.innerHTML = '';
      return;
    }
  }
};

export default async function loadCdt(el) {
    CountdownTimer.init(el);
}
import { createTag } from '../../utils/utils.js';

export class CountdownTimer extends HTMLElement {
  #daysLeft = '';

  #hoursLeft = '';

  #minutesLeft = '';

  #isVisible = false;

  #timeWords = [];

  #timeRangesEpoch = [];

  static css = `
    .horizontal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px 0px;
    }
    
    .vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0px;
    }

    .center {
        justify-content: center;
    }

    .timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        height: 27px;
    }

    .light .timer-label {
        color: #000000;
    }

    .dark .timer-label {
        color: #FFFFFF;
    }

    .horizontal .timer-label {
        align-self: center;
        margin: 0px 2px 45px 2px;
    }

    .vertical .timer-label {
        align-self: flex-start;
    }

    .vertical > div.timer-block {
        display: flex;
        align-self: flex-start;
    }

    .horizontal > div.timer-block {
        display: flex;
        margin-left: 10px;
    }

    .timer-fragment {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .timer-box {
        padding: 0px 9px;
        width: 10px;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
    }

    .light .timer-box {
        background-color: #222222;
        color: #FFFFFF;
    }

    .dark .timer-box {
        background-color: #EBEBEB;
        color: #1D1D1D;
    }

    .timer-unit-container {
        display: flex;
        flex-direction: row;
        column-gap: 2px;
        align-items: center;
    }
    
    .timer-unit-label {
        width: 100%;
        font-size: 14px;
        font-weight: regular;
        text-align: left;
    }

    .light .timer-unit-label {
        color: #464646;
    }

    .dark .timer-unit-label {
        color: #D1D1D1;
    }`;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.label = '';
    this.dayshoursmins = '';
    this.timeranges = '';
  }

  static get observedAttributes() {
    return ['label', 'dayshoursmins', 'timeranges'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this[name] = newValue;
  }

  connectedCallback() {
    this.timeWords = this.dayshoursmins.split(' ');
    this.timeRangesEpoch = this.timeranges.split(',');
    this.countdownStart();
  }

  disconnectedCallback() {
    clearInterval(this.countdownInterval);
  }

  countdownCompleted() {
    this.isVisible = false;
    clearInterval(this.countdownInterval);
    this.update();
  }

  countdownStart() {
    const oneMinuteInMs = 60000;
    this.countdownUpdate();
    this.countdownInterval = setInterval(() => { this.countdownUpdate(); }, oneMinuteInMs);
  }

  countdownUpdate() {
    const currentTime = Date.now();

    for (let i = 0; i < this.timeRangesEpoch.length; i += 2) {
      const startTime = this.timeRangesEpoch[i];
      const endTime = this.timeRangesEpoch[i + 1];

      if (currentTime >= startTime && currentTime <= endTime) {
        this.isVisible = true;
        const diffTime = endTime - currentTime;
        this.daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        this.hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        this.update();
        return;
      }
    }
    this.countdownCompleted();
  }

  update() {
    if (!this.isVisible) {
      this.shadowRoot.innerHTML = '';
      return;
    }

    this.shadowRoot.innerHTML = `
      <style>${CountdownTimer.css}</style>
      <div class="${this.classList}">
        <div class="timer-label">${this.label}</div>
        <div class="timer-block">
          <div id="cdt-days" class="timer-fragment">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.daysLeft / 10)}</div>
                <div class="timer-box">${this.daysLeft % 10}</div>
              </div>
              <div class="timer-unit-label">${this.timeWords[0]}</div>
          </div>
          <div class="timer-label">:</div>
          <div id="cdt-hours" class="timer-fragment">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.hoursLeft / 10)}</div>
                <div class="timer-box">${this.hoursLeft % 10}</div>
              </div>
              <div class="timer-unit-label">${this.timeWords[1]}</div>
          </div>
          <div class="timer-label">:</div>
          <div id="cdt-minutes" class="timer-fragment">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.minutesLeft / 10)}</div>
                <div class="timer-box">${this.minutesLeft % 10}</div>
              </div>
              <div class="timer-unit-label">${this.timeWords[2]}</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('countdown-timer', CountdownTimer);

export default function init(el) {
  try {
    const styles = [...el.classList];
    const firstLevelDivs = el.querySelectorAll(':scope > div');

    // Extract 'DAYS HOURS MINS' from the first div's first child
    const daysHoursMins = firstLevelDivs[0].querySelector(':scope > div').textContent.trim();

    // Extract 'ENDS IN' from the first div's second child
    const cdtLabel = firstLevelDivs[0].querySelector(':scope > div:nth-child(2)').textContent.trim();

    // Extract the time ranges from the second and third divs
    const timeRanges = Array.from(firstLevelDivs)
      .slice(1) // Skip the first div, as it's not part of the time ranges
      .flatMap((div) => Array.from(div.querySelectorAll(':scope > div')).map((innerDiv) => {
        const parsedDate = Date.parse(innerDiv.textContent.trim());
        if (Number.isNaN(parsedDate)) {
          throw new Error(`Invalid date format found in div: "${innerDiv.textContent.trim()}"`);
        }
        return parsedDate;
      }))
      .join(','); // Join the array into a comma-separated string

    const cdt = createTag('countdown-timer', {
      class: styles.join(' '),
      label: cdtLabel,
      dayshoursmins: daysHoursMins,
      timeranges: timeRanges,
    });
    el.replaceWith(cdt);
  } catch (error) {
    el.replaceWith('');
    window.lana?.log(`Failed to load countdown timer module: ${error}`);
  }
}

import { LitElement, html } from 'lit';
import { styles } from './countdown-timer.css.js';

export default class CountdownTimer extends LitElement {
  static properties = {
    label: { type: String },
    daysHoursMins: { type: String },
    timeRanges: { type: String },
    daysLeft: { type: String },
    hoursLeft: { type: String },
    minutesLeft: { type: String },
    isVisible: {type: Boolean},
  };

  #timeWords = [];
  #timeRangesEpoch = [];

  static styles = [styles];

  constructor(endDateTime) {
    super();
    this.label = '';
    this.daysHoursMins = '';
    this.timeRanges = '';
    this.daysLeft = '';
    this.hoursLeft = '';
    this.minutesLeft = '';
    this.isVisible = false;
  }

  firstUpdated() {
    this.#timeWords = this.daysHoursMins.split(' ');
    this.#timeRangesEpoch = this.timeRanges.split(',');
    this.countdownStart();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    clearInterval(this.countdownInterval);
  }

  countdownCompleted() {
    this.isVisible = false;
    clearInterval(this.countdownInterval);
  }

  countdownStart() {
    const oneMinuteInMs = 60000;
    this.countdownUpdate();
    this.countdownInterval = setInterval(() => {
      this.countdownUpdate();
    }, oneMinuteInMs);
  }

  countdownUpdate() {

    let currentTime = Date.now();    
    //find the time range where the current time is between the start and end time
    for (let i = 0; i < this.#timeRangesEpoch.length; i += 2) {
      const startTime = this.#timeRangesEpoch[i];
      const endTime = this.#timeRangesEpoch[i + 1];
      
      if (currentTime >= startTime && currentTime <= endTime) {
        this.isVisible = true;
        let diffTime = endTime - currentTime;
        this.daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        this.hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        return;
      }
    }

    //if the current time is not in any of the time ranges, the countdown is completed
    this.countdownCompleted();    
  }

  render() {
    if (!this.isVisible) {
      return html``;
    } else {
      return html`
      <div class="${this.classList}">
        <div class="timer-label">${this.label}</div>
        <div class="timer-block">
          <div id="cdt-days" class="timer-fragment">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.daysLeft/10)}</div>
                <div class="timer-box">${this.daysLeft%10}</div>
              </div>
              <div class="timer-unit-label">${this.#timeWords[0]}</div>
          </div>
          <div class="timer-label">:</div>
          <div id="cdt-hours" class="timer-fragment">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.hoursLeft/10)}</div>
                <div class="timer-box">${this.hoursLeft%10}</div>
              </div>
              <div class="timer-unit-label">${this.#timeWords[1]}</div>
          </div>
          <div class="timer-label">:</div>
          <div id="cdt-minutes" class="timer-fragment">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.minutesLeft/10)}</div>
                <div class="timer-box">${this.minutesLeft%10}</div>
              </div>
              <div class="timer-unit-label">${this.#timeWords[2]}</div>
          </div>
        </div>
    </div>`;
    }
  }
}

customElements.define('countdown-timer', CountdownTimer);

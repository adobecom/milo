import { LitElement, html, css } from 'lit';
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
  #timeRangesObj = [];

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
    this.#timeRangesObj = this.timeRanges.split(', ').map(range => Date.parse(range));
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
    this.countdownUpdate();
    this.countdownInterval = setInterval(() => {
      this.countdownUpdate();
    }, 60000);
  }

  countdownUpdate() {

    let currentTime = Date.now();    
    //find the time range where the current time is between the start and end time
    for (let i = 0; i < this.#timeRangesObj.length; i += 2) {
      const startTime = this.#timeRangesObj[i];
      const endTime = this.#timeRangesObj[i + 1];
      
      if (currentTime >= startTime && currentTime <= endTime) {
        this.isVisible = true;
        let diffTime = endTime - currentTime;
        this.daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        this.hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
        this.requestUpdate(); 
        return;
      }
    }

    //if the current time is not in any of the time ranges, the countdown is completed
    this.countdownCompleted();    
    this.requestUpdate(); 
  }

  render() {
    if (!this.isVisible) {
      return html``;
    } else {
      return html`
      <div class="timer-container">
        <div>${this.label}</div>
        <div>
            <div id="days" class="timer-box">${this.daysLeft}</div>
            <div class="timer-label">${this.#timeWords[0]}</div>
        </div>
        <div>:</div>
        <div>
            <div id="hours" class="timer-box">${this.hoursLeft}</div>
            <div class="timer-label">${this.#timeWords[1]}</div>
        </div>
        <div>:</div>
        <div>
            <div id="minutes" class="timer-box">${this.minutesLeft}</div>
            <div class="timer-label">${this.#timeWords[2]}</div>
        </div>
    </div>`;
    }
  }

  lpad(input, length) {
    return ('0' + input).slice(length);
  }
}

customElements.define('countdown-timer', CountdownTimer);

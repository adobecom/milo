import { LitElement, html, css } from 'lit';

export default class CountdownTimer extends LitElement {
  static properties = {
    label: { type: String },
    daysHoursMins: { type: String },
    timeRanges: { type: String },
  };

  #daysLeft = '';
  #hoursLeft = '';
  #minutesLeft = '';
  #timeWords = [];
  #timeRangesObj = [];
  #isVisible = false;

  constructor(endDateTime) {
    super();
    this.label = '';
    this.daysHoursMins = '';
    this.timeRanges = '';
  }

  firstUpdated() {
    this.#timeWords = this.daysHoursMins.split(' ');
    this.#timeRangesObj = this.timeRanges.split(', ').map(range => Date.parse(range));
    this.#isVisible = false;
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
    this.countdownInterval = setInterval(() => {
      this.countdownUpdate();
    }, 60000);
  }

  countdownUpdate() {

    let currentTime = Date.now();    
    //find the time range where the current time is between the start and end time
    for (let i = 0; i < timeRangesObj.length; i += 2) {
      const startTime = timeRangesObj[i];
      const endTime = timeRangesObj[i + 1];
      
      if (currentTime >= startTime && currentTime <= endTime) {
        let diffTime = endTime - currentTime;
        this.#daysLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        this.#hoursLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        this.#minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
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
      <div class="countdown">
          <div class="countdown-column">
              <div class="countdown-word">${this.words[0]}</div>
              <div>
                  <div class="shape-content">${this.daysLeft}</div>
              </div>
          </div>
          <div class="countdown-column">
              <div class="countdown-word">${this.words[1]}</div>
              <div>
                  <div class="shape-content">${this.hoursLeft}</div>
              </div>
          </div>
          <div class="countdown-column">
              <div class="countdown-word">${this.words[2]}</div>
              <div>
                  <div class="shape-content">${this.minutesLeft}</div>
              </div>
          </div>
      </div>`;
    }
  }

  lpad(input, length) {
    return ('0' + input).slice(length);
  }
}

customElements.define('countdown-timer', CountdownTimer);

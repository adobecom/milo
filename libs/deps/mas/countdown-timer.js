import{LitElement as d,html as o}from"/libs/deps/lit-all.min.js";import{css as a}from"/libs/deps/lit-all.min.js";var r=a`
    .countdown-timer.horizontal {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
    }
    
    .countdown-timer.vertical {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
    }

    .countdown-timer.horizontal > div.timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-color: #FFFFFF;
        height: 27px;
        align-self: center;
        margin: 0px 2px 27px 2px;
    }

    .countdown-timer.vertical > div.timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-color: #FFFFFF;
        height: 27px;
        align-self: flex-start;
    }

    .countdown-timer.vertical > div.timer-container-parent {
        display: flex;
        align-self: flex-start;
    }

    .countdown-timer.horizontal > div.timer-container-parent {
        display: flex;
        margin-left: 10px;
    }

    .timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .timer-box {
        background-color: #EBEBEB;
        color: #1D1D1D;
        padding: 0px 9px;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
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
        font-color: #D1D1D1;
        text-align: left;
    }
`;var e=class extends d{static properties={label:{type:String},daysHoursMins:{type:String},timeRanges:{type:String},daysLeft:{type:String},hoursLeft:{type:String},minutesLeft:{type:String},isVisible:{type:Boolean}};#t=[];#i=[];static styles=[r];constructor(t){super(),this.label="",this.daysHoursMins="",this.timeRanges="",this.daysLeft="",this.hoursLeft="",this.minutesLeft="",this.isVisible=!1}firstUpdated(){this.#t=this.daysHoursMins.split(" "),this.#i=this.timeRanges.split(","),this.countdownStart()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.countdownInterval)}countdownCompleted(){this.isVisible=!1,clearInterval(this.countdownInterval)}countdownStart(){this.countdownUpdate(),this.countdownInterval=setInterval(()=>{this.countdownUpdate()},6e4)}countdownUpdate(){let t=Date.now();for(let i=0;i<this.#i.length;i+=2){let l=this.#i[i],n=this.#i[i+1];if(t>=l&&t<=n){this.isVisible=!0;let s=n-t;this.daysLeft=Math.floor(s/(1e3*60*60*24)),this.hoursLeft=Math.floor(s%(1e3*60*60*24)/(1e3*60*60)),this.minutesLeft=Math.floor(s%(1e3*60*60)/(1e3*60));return}}this.countdownCompleted()}render(){return this.isVisible?o`
      <div class="${this.classList}">
        <div class="timer-label">${this.label}</div>
        <div class="timer-container-parent">
          <div class="timer-container">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.daysLeft/10)}</div>
                <div class="timer-box">${this.daysLeft%10}</div>
              </div>
              <div class="timer-unit-label">${this.#t[0]}</div>
          </div>
          <div class="timer-label">:</div>
          <div class="timer-container">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.hoursLeft/10)}</div>
                <div class="timer-box">${this.hoursLeft%10}</div>
              </div>
              <div class="timer-unit-label">${this.#t[1]}</div>
          </div>
          <div class="timer-label">:</div>
          <div class="timer-container">
              <div class="timer-unit-container">
                <div class="timer-box">${Math.floor(this.minutesLeft/10)}</div>
                <div class="timer-box">${this.minutesLeft%10}</div>
              </div>
              <div class="timer-unit-label">${this.#t[2]}</div>
          </div>
        </div>
    </div>`:o``}};customElements.define("countdown-timer",e);export{e as default};

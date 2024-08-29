import{LitElement as d,html as o}from"/libs/deps/lit-all.min.js";import{css as a}from"/libs/deps/lit-all.min.js";var r=a`
    .countdown-timer {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 20px;
        border-radius: 10px;
    }

    .timer-label {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        font-color: #FFFFFF
    }

    .timer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    } 
    
    .timer-box {
        background-color: #EBEBEB;
        color: #1D1D1D;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 18px;
        font-weight: regular;
        text-align: center;
    }
    
    .timer-label {
        font-size: 14px;
        font-weight: regular;
        font-color: #D1D1D1;
        text-align: center;
    }
`;var i=class extends d{static properties={label:{type:String},daysHoursMins:{type:String},timeRanges:{type:String},daysLeft:{type:String},hoursLeft:{type:String},minutesLeft:{type:String},isVisible:{type:Boolean}};#t=[];#e=[];static styles=[r];constructor(t){super(),this.label="",this.daysHoursMins="",this.timeRanges="",this.daysLeft="",this.hoursLeft="",this.minutesLeft="",this.isVisible=!1}firstUpdated(){this.#t=this.daysHoursMins.split(" "),this.#e=this.timeRanges.split(","),this.countdownStart()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.countdownInterval)}countdownCompleted(){this.isVisible=!1,clearInterval(this.countdownInterval)}countdownStart(){this.countdownUpdate(),this.countdownInterval=setInterval(()=>{this.countdownUpdate()},6e4)}countdownUpdate(){let t=Date.now();for(let e=0;e<this.#e.length;e+=2){let l=this.#e[e],n=this.#e[e+1];if(t>=l&&t<=n){this.isVisible=!0;let s=n-t;this.daysLeft=Math.floor(s/(1e3*60*60*24)),this.hoursLeft=Math.floor(s%(1e3*60*60*24)/(1e3*60*60)),this.minutesLeft=Math.floor(s%(1e3*60*60)/(1e3*60)),this.requestUpdate();return}}this.countdownCompleted(),this.requestUpdate()}render(){return this.isVisible?o`
      <div class="${this.classList}">
        <div class="timer-label">${this.label}</div>
        <div class="timer-container">
            <div class="timer-box">${this.lpad(this.daysLeft,-2)}</div>
            <div class="timer-label">${this.#t[0]}</div>
        </div>
        <div>:</div>
        <div class="timer-container">
            <div class="timer-box">${this.lpad(this.hoursLeft,-2)}</div>
            <div class="timer-label">${this.#t[1]}</div>
        </div>
        <div>:</div>
        <div class="timer-container">
            <div class="timer-box">${this.lpad(this.minutesLeft,-2)}</div>
            <div class="timer-label">${this.#t[2]}</div>
        </div>
    </div>`:o``}lpad(t,e){return("0"+t).slice(e)}};customElements.define("countdown-timer",i);export{i as default};

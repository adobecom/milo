import{LitElement as l,html as o}from"/libs/deps/lit-all.min.js";import{css as a}from"/libs/deps/lit-all.min.js";var r=a`

    .timer-container {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .timer-box {
        background-color: white;
        color: black;
        padding: 10px 20px
        border-radius: 8px;
        font-size: 1.5rem;
        min-width: 60px;
        text-align: center;
    }
    
    .timer-label {
        font-size: 0.75rem;
        text-align: center;
    }
`;var e=class extends l{static properties={label:{type:String},daysHoursMins:{type:String},timeRanges:{type:String},daysLeft:{type:String},hoursLeft:{type:String},minutesLeft:{type:String},isVisible:{type:Boolean}};#t=[];#i=[];static styles=[r];constructor(t){super(),this.label="",this.daysHoursMins="",this.timeRanges="",this.daysLeft="",this.hoursLeft="",this.minutesLeft="",this.isVisible=!1}firstUpdated(){this.#t=this.daysHoursMins.split(" "),this.#i=this.timeRanges.split(", ").map(t=>Date.parse(t)),this.countdownStart()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.countdownInterval)}countdownCompleted(){this.isVisible=!1,clearInterval(this.countdownInterval)}countdownStart(){this.countdownUpdate(),this.countdownInterval=setInterval(()=>{this.countdownUpdate()},6e4)}countdownUpdate(){let t=Date.now();for(let i=0;i<this.#i.length;i+=2){let d=this.#i[i],n=this.#i[i+1];if(t>=d&&t<=n){this.isVisible=!0;let s=n-t;this.daysLeft=Math.floor(s/(1e3*60*60*24)),this.hoursLeft=Math.floor(s%(1e3*60*60*24)/(1e3*60*60)),this.minutesLeft=Math.floor(s%(1e3*60*60)/(1e3*60)),this.requestUpdate();return}}this.countdownCompleted(),this.requestUpdate()}render(){return this.isVisible?o`
      <div class="timer-container">
        <div>${this.label}</div>
        <div>
            <div id="days" class="timer-box">${this.daysLeft}</div>
            <div class="timer-label">${this.#t[0]}</div>
        </div>
        <div>:</div>
        <div>
            <div id="hours" class="timer-box">${this.hoursLeft}</div>
            <div class="timer-label">${this.#t[1]}</div>
        </div>
        <div>:</div>
        <div>
            <div id="minutes" class="timer-box">${this.minutesLeft}</div>
            <div class="timer-label">${this.#t[2]}</div>
        </div>
    </div>`:o``}lpad(t,i){return("0"+t).slice(i)}};customElements.define("countdown-timer",e);export{e as default};

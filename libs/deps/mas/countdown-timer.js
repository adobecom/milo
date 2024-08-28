import{LitElement as a,html as d}from"/libs/deps/lit-all.min.js";var e=class extends a{static properties={label:{type:String},daysHoursMins:{type:String},timeRanges:{type:String},daysLeft:{type:String},hoursLeft:{type:String},minutesLeft:{type:String},isVisible:{type:Boolean}};#t=[];#s=[];constructor(t){super(),this.label="",this.daysHoursMins="",this.timeRanges="",this.daysLeft="",this.hoursLeft="",this.minutesLeft="",this.isVisible=!1}firstUpdated(){this.#t=this.daysHoursMins.split(" "),this.#s=this.timeRanges.split(", ").map(t=>Date.parse(t)),this.countdownStart()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.countdownInterval)}countdownCompleted(){this.isVisible=!1,clearInterval(this.countdownInterval)}countdownStart(){this.countdownUpdate(),this.countdownInterval=setInterval(()=>{this.countdownUpdate()},6e4)}countdownUpdate(){let t=Date.now();for(let s=0;s<this.#s.length;s+=2){let o=this.#s[s],n=this.#s[s+1];if(t>=o&&t<=n){this.isVisible=!0;let i=n-t;this.daysLeft=Math.floor(i/(1e3*60*60*24)),this.hoursLeft=Math.floor(i%(1e3*60*60*24)/(1e3*60*60)),this.minutesLeft=Math.floor(i%(1e3*60*60)/(1e3*60)),this.requestUpdate();return}}this.countdownCompleted(),this.requestUpdate()}render(){return this.isVisible?d`
      <div class="countdown">
          <div class="countdown-column">
              <div class="countdown-word">${this.#t[0]}</div>
              <div>
                  <div class="shape-content">${this.daysLeft}</div>
              </div>
          </div>
          <div class="countdown-column">
              <div class="countdown-word">${this.#t[1]}</div>
              <div>
                  <div class="shape-content">${this.hoursLeft}</div>
              </div>
          </div>
          <div class="countdown-column">
              <div class="countdown-word">${this.#t[2]}</div>
              <div>
                  <div class="shape-content">${this.minutesLeft}</div>
              </div>
          </div>
      </div>`:d``}lpad(t,s){return("0"+t).slice(s)}};customElements.define("countdown-timer",e);export{e as default};

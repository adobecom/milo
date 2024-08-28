import{LitElement as a,html as d}from"/libs/deps/lit-all.min.js";var e=class extends a{static properties={label:{type:String},daysHoursMins:{type:String},timeRanges:{type:String}};#t="";#s="";#e="";#i=[];#n=[];#d=!1;constructor(t){super(),this.label="",this.daysHoursMins="",this.timeRanges=""}firstUpdated(){this.#i=this.daysHoursMins.split(" "),this.#n=this.timeRanges.split(", ").map(t=>Date.parse(t)),this.#d=!1,this.countdownStart()}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this.countdownInterval)}countdownCompleted(){this.isVisible=!1,clearInterval(this.countdownInterval)}countdownStart(){this.countdownInterval=setInterval(()=>{this.countdownUpdate()},6e4)}countdownUpdate(){let t=Date.now();for(let s=0;s<timeRangesObj.length;s+=2){let o=timeRangesObj[s],n=timeRangesObj[s+1];if(t>=o&&t<=n){let i=n-t;this.#t=Math.floor(i/(1e3*60*60*24)),this.#s=Math.floor(i%(1e3*60*60*24)/(1e3*60*60)),this.#e=Math.floor(i%(1e3*60*60)/(1e3*60));return}}this.countdownCompleted()}render(){return this.isVisible?d`
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
      </div>`:d``}lpad(t,s){return("0"+t).slice(s)}};customElements.define("countdown-timer",e);export{e as default};

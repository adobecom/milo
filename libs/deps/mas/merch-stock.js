var _=Object.defineProperty;var a=o=>{throw TypeError(o)};var d=(o,e,t)=>e in o?_(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var s=(o,e,t)=>d(o,typeof e!="symbol"?e+"":e,t),m=(o,e,t)=>e.has(o)||a("Cannot "+t);var n=(o,e,t)=>(m(o,e,"read from private field"),t?t.call(o):e.get(o)),p=(o,e,t)=>e.has(o)?a("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t);import{LitElement as l,css as A,html as x}from"../lit-all.min.js";var i="merch-stock:change";import"../lit-all.min.js";var c=class{constructor(e,t){s(this,"key");s(this,"host");s(this,"media");s(this,"matches");this.key=Symbol("match-media-key"),this.media=window.matchMedia(t),this.matches=this.media.matches,this.updateMatches=this.updateMatches.bind(this),(this.host=e).addController(this)}hostConnected(){this.media.addEventListener("change",this.updateMatches)}hostDisconnected(){this.media.removeEventListener("change",this.updateMatches)}updateMatches(){this.matches!==this.media.matches&&(this.matches=this.media.matches,this.host.requestUpdate(this.key,!this.matches))}};var h="(max-width: 767px)";var E,r=class extends l{constructor(){super();p(this,E,new c(this,h));this.checked=!1}handleChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent(i,{detail:{checked:t.target.checked,planType:this.planType},bubbles:!0}))}connectedCallback(){this.style.setProperty("--mod-checkbox-font-size","12px"),super.connectedCallback(),this.updateComplete.then(()=>{this.querySelectorAll('[is="inline-price"]').forEach(async t=>{await t.onceSettled(),t.parentElement.setAttribute("data-plan-type",t.value[0].planType)})})}render(){if(this.planType&&!n(this,E).matches)return x`
            <sp-checkbox
                size="s"
                @change=${this.handleChange}
                ?checked=${this.checked}
            >
                <slot></slot>
            </sp-checkbox>
        `}get osi(){if(this.checked)return this.querySelector(`div[data-plan-type="${this.planType}"] [is="inline-price"]`)?.value?.[0].offerSelectorIds[0]}};E=new WeakMap,s(r,"styles",[A`
            ::slotted(div) {
                display: none;
            }

            :host(:not([plan-type])) {
                display: none;
            }

            :host([plan-type='ABM']) ::slotted([data-plan-type='ABM']),
            :host([plan-type='M2M']) ::slotted([data-plan-type='M2M']),
            :host([plan-type='PUF']) ::slotted([data-plan-type='PUF']) {
                display: block;
            }

            sp-checkbox {
                margin: 0;
                font-size: 12px;
                line-height: 15px;
            }
        `]),s(r,"properties",{checked:{type:Boolean,attribute:"checked",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0}});window.customElements.define("merch-stock",r);export{r as MerchStock};

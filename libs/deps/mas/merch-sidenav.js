var g=Object.defineProperty;var b=(n,e,t)=>e in n?g(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var r=(n,e,t)=>b(n,typeof e!="symbol"?e+"":e,t);import{html as v,css as Y,LitElement as U}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as L}from"/libs/deps/lit-all.min.js";var m=L`
    h2 {
        font-size: 11px;
        font-style: normal;
        font-weight: 500;
        height: 32px;
        letter-spacing: 0.06em;
        padding: 0 12px;
        line-height: 32px;
        color: #737373;
    }
`;import{html as k,LitElement as P}from"/libs/deps/lit-all.min.js";var B=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),W=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var D='span[is="inline-price"][data-wcs-osi]',M='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var K=`${D},${M}`;var A="merch-search:change";var x="merch-sidenav:select";var j=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var z=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});function u(n,e){let t;return function(){let s=this,o=arguments;clearTimeout(t),t=setTimeout(()=>n.apply(s,o),e)}}function S(n,e={},t=null,s=null){let o=s?document.createElement(n,{is:s}):document.createElement(n);t instanceof HTMLElement?o.appendChild(t):o.innerHTML=t;for(let[i,c]of Object.entries(e))o.setAttribute(i,c);return o}var f="hashchange";function T(n=window.location.hash){let e=[],t=n.replace(/^#/,"").split("&");for(let s of t){let[o,i=""]=s.split("=");o&&e.push([o,decodeURIComponent(i.replace(/\+/g," "))])}return Object.fromEntries(e)}function a(n,e){if(n.deeplink){let t={};t[n.deeplink]=e,O(t)}}function O(n){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(n).forEach(([o,i])=>{i?e.set(o,i):e.delete(o)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let s=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,s)}function l(n){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=T(window.location.hash);n(t)};return e(),window.addEventListener(f,e),()=>{window.removeEventListener(f,e)}}var _=class extends P{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{a(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(A,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=u(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=T()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=l(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return k`<slot></slot>`}};r(_,"properties",{deeplink:{type:String}});customElements.define("merch-search",_);import{html as C,LitElement as y,css as w}from"/libs/deps/lit-all.min.js";var p=class extends y{constructor(){super(),this.handleClickDebounced=u(this.handleClick.bind(this))}selectElement(e,t=!0){e.selected=t,e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1);let s=e.querySelector(".selection");s?.setAttribute("selected",t);let o=s?.dataset,i=t?o?.light:o?.dark;i&&e.querySelector("img")?.setAttribute("src",i),t&&(this.selectedElement=e,this.selectedText=o?.selectedText||e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(x,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}handleClick({target:e},t=!0){let{value:s,parentNode:o}=e;this.selectElement(e),o?.tagName==="SP-SIDENAV"?(o.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(i=>{i.value!==s&&(i.expanded=!1,this.selectElement(i,!1))}),o.querySelectorAll(".selection[selected=true]").forEach(i=>{let c=i.parentElement;c.value!==s&&this.selectElement(c,!1)})):o?.tagName==="SP-SIDENAV-ITEM"&&([...o.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(c=>c!==o).forEach(c=>{c.expanded=!1}),o.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(c=>{c.value!==s&&this.selectElement(c,!1)})),t&&a(this,s)}selectionChanged(e){let{target:{value:t,parentNode:s}}=e;this.selectElement(this.querySelector(`sp-sidenav-item[value="${t}"]`)),a(this,t)}startDeeplink(){this.stopDeeplink=l(e=>{let t=e[this.deeplink]??"all",s=this.querySelector(`sp-sidenav-item[value="${t}"]`);s&&this.updateComplete.then(()=>{s.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(s.expanded=!0),s.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(s.parentNode.expanded=!0),this.handleClick({target:s},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&this.startDeeplink()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return C`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?C`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};r(p,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}}),r(p,"styles",[w`
            :host {
                display: block;
                contain: content;
                padding-top: 16px;
            }
            .right {
                position: absolute;
                right: 0;
            }

            ::slotted(sp-sidenav.resources) {
                --mod-sidenav-item-background-default-selected: transparent;
                --mod-sidenav-content-color-default-selected: var(
                    --highcontrast-sidenav-content-color-default,
                    var(
                        --mod-sidenav-content-color-default,
                        var(--spectrum-sidenav-content-color-default)
                    )
                );
            }
        `,m]);customElements.define("merch-sidenav-list",p);import{html as I,LitElement as V,css as H}from"/libs/deps/lit-all.min.js";var h=class extends V{constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let s=this.selectedValues.indexOf(t);e.checked&&s===-1?this.selectedValues.push(t):!e.checked&&s>=0&&this.selectedValues.splice(s,1)}a(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=S("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.setAttribute("role","group"),this.setAttribute("aria-labelledby",e)}startDeeplink(){this.stopDeeplink=l(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(s=>{let o=this.querySelector(`sp-checkbox[name=${s}]`);o&&(o.checked=t.includes(s))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let s=this.querySelector(`sp-checkbox[name=${t}]`);s&&(s.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return I`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};r(h,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),r(h,"styles",H`
        :host {
            display: block;
            contain: content;
            border-top: 1px solid var(--color-gray-200);
            padding: 12px;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
        }
    `);customElements.define("merch-sidenav-checkbox-group",h);var R="(max-width: 700px)";var N="(max-width: 1199px)";var E=class extends U{constructor(){super();r(this,"mobileDevice",new d(this,R));r(this,"mobileAndTablet",new d(this,N));this.open=!1,this.closeModal=this.closeModal.bind(this)}updated(){this.mobileAndTablet.matches?this.modal=!0:(this.modal=!1,this.open&&this.closeModal())}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){return v`
            <sp-theme  color="light" scale="medium">
                <sp-overlay type="modal" ?open=${this.open} @close=${this.closeModal}>
                    <sp-dialog-base
                        dismissable
                        underlay
                        no-divider
                    >
                        <div id="content">
                            <div id="sidenav">
                                <div>
                                    <h2>${this.sidenavTitle}</h2>
                                    <slot></slot>
                                </div>
                                <sp-link @click="${this.closeModal}"
                                    >${this.closeText||"Close"}</sp-link
                                >
                            </div>
                        </div>
                    </sp-dialog-base>
                </sp-overlay>
            </sp-theme>
        `}get asAside(){return v`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(){this.open=!1,document.querySelector("body")?.classList.remove("merch-modal")}showModal(){this.open=!0,document.querySelector("body")?.classList.add("merch-modal")}};r(E,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,reflect:!0},open:{type:Boolean,state:!0,reflect:!0}}),r(E,"styles",[Y`
            :host {
                display: block;
                z-index: 2;
            }

            :host h2 {
              color: var(--spectrum-global-color-gray-900);
              font-size: 12px;
            }

            :host(:not([modal])) {
                --mod-sidenav-item-background-default-selected: #222;
                --mod-sidenav-content-color-default-selected: #fff;
            }

            #content {
                width: 100%;
                min-width: 300px;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: baseline;
            }
            

            :host([modal]) ::slotted(merch-search) {
                display: none;
            }

            #sidenav {
                display: flex;
                flex-direction: column;
                max-width: 248px;
                overflow-y: auto;
                place-items: center;
                position: relative;
                width: 100%;
                padding-bottom: 16px;
            }

            sp-dialog-base #sidenav {
                padding-top: 16px;
                max-width: 300px;
                max-height: 80dvh;
                min-height: min(500px, 80dvh);
                background: #ffffff 0% 0% no-repeat padding-box;
                box-shadow: 0px 1px 4px #00000026;
            }

            sp-link {
                position: absolute;
                top: 16px;
                right: 16px;
            }
        `,m]);customElements.define("merch-sidenav",E);export{E as MerchSideNav};

var b=Object.defineProperty;var w=(s,e,t)=>e in s?b(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var r=(s,e,t)=>w(s,typeof e!="symbol"?e+"":e,t);import{html as f,css as G,LitElement as q,nothing as B}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as D}from"/libs/deps/lit-all.min.js";var u=D`
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
`;import{html as y,LitElement as H}from"/libs/deps/lit-all.min.js";var Q=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),X=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var M='span[is="inline-price"][data-wcs-osi]',O='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var P='a[is="upt-link"]',J=`${M},${O},${P}`;var x="merch-search:change";var h="merch-sidenav:select";var Z=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var ee=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});function _(s,e){let t;return function(){let o=this,n=arguments;clearTimeout(t),t=setTimeout(()=>s.apply(o,n),e)}}function C(s,e={},t=null,o=null){let n=o?document.createElement(s,{is:o}):document.createElement(s);t instanceof HTMLElement?n.appendChild(t):n.innerHTML=t;for(let[i,a]of Object.entries(e))n.setAttribute(i,a);return n}function k(s){if(!s||!window.history.pushState)return;let e=new URL(window.location.href);e.search=`?${s}`,window.history.pushState({path:e.href},"",e.href)}function A(s,e){let t=new URLSearchParams(window.location.hash.slice(1));t.set(s,e),window.location.hash=t.toString()}function R(s=[]){s.forEach(e=>{let t=new URLSearchParams(window.location.search),o=t.get(e);o&&(window.location.hash.includes(`${e}=`)?A(e,o):window.location.hash=window.location.hash?`${window.location.hash}&${e}=${o}`:`${e}=${o}`,t.delete(e),k(t.toString()))})}var N="hashchange";function S(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let o of t){let[n,i=""]=o.split("=");n&&e.push([n,decodeURIComponent(i.replace(/\+/g," "))])}return Object.fromEntries(e)}function c(s,e){if(s.deeplink){let t={};t[s.deeplink]=e,I(t)}}function I(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([n,i])=>{i?e.set(n,i):e.delete(n)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function l(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=S(window.location.hash);s(t)};return e(),window.addEventListener(N,e),()=>{window.removeEventListener(N,e)}}var T=class extends H{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{c(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(x,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=_(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=S()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=l(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return y`<slot></slot>`}};r(T,"properties",{deeplink:{type:String}});customElements.define("merch-search",T);import{html as v,LitElement as V,css as U}from"/libs/deps/lit-all.min.js";var p=class extends V{constructor(){super(),this.handleClickDebounced=_(this.handleClick.bind(this))}selectElement(e,t=!0){e.selected=t,e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1);let o=e.querySelector(".selection");o?.setAttribute("selected",t);let n=o?.dataset,i=t?n?.light:n?.dark;i&&e.querySelector("img")?.setAttribute("src",i),t&&(this.selectedElement=e,this.selectedText=n?.selectedText||e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}handleClick({target:e},t=!0){let{value:o,parentNode:n}=e;this.selectElement(e),n?.tagName==="SP-SIDENAV"?(n.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(i=>{i.value!==o&&(i.expanded=!1,this.selectElement(i,!1))}),n.querySelectorAll(".selection[selected=true]").forEach(i=>{let a=i.parentElement;a.value!==o&&this.selectElement(a,!1)})):n?.tagName==="SP-SIDENAV-ITEM"&&([...n.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(a=>a!==n).forEach(a=>{a.expanded=!1}),n.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(a=>{a.value!==o&&this.selectElement(a,!1)})),t&&c(this,o)}selectionChanged(e){let{target:{value:t,parentNode:o}}=e;this.selectElement(this.querySelector(`sp-sidenav-item[value="${t}"]`)),c(this,t)}startDeeplink(){this.stopDeeplink=l(e=>{let t=e[this.deeplink]??"all",o=this.querySelector(`sp-sidenav-item[value="${t}"]`);if(!o){if(o=this.querySelector('sp-sidenav-item[value="all"]'),!o)return;A(this.deeplink,"all")}this.updateComplete.then(()=>{o.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(o.expanded=!0),o.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(o.parentNode.expanded=!0),this.handleClick({target:o},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&(R(["filter","single_app"]),this.startDeeplink())})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return v`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?v`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};r(p,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,attribute:"selected-text",reflect:!0},selectedValue:{type:String,attribute:"selected-value",reflect:!0}}),r(p,"styles",[U`
            :host {
                display: block;
                contain: content;
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
        `,u]);customElements.define("merch-sidenav-list",p);import{html as Y,LitElement as F,css as $}from"/libs/deps/lit-all.min.js";var E=class extends F{constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let o=this.selectedValues.indexOf(t);e.checked&&o===-1?this.selectedValues.push(t):!e.checked&&o>=0&&this.selectedValues.splice(o,1)}c(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=C("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.setAttribute("role","group"),this.setAttribute("aria-labelledby",e)}startDeeplink(){this.stopDeeplink=l(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(o=>{let n=this.querySelector(`sp-checkbox[name=${o}]`);n&&(n.checked=t.includes(o))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let o=this.querySelector(`sp-checkbox[name=${t}]`);o&&(o.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return Y`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};r(E,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),r(E,"styles",$`
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
    `);customElements.define("merch-sidenav-checkbox-group",E);var L="(max-width: 700px)";var g="(max-width: 1199px)";var m=class extends q{constructor(){super();r(this,"mobileDevice",new d(this,L));r(this,"mobileAndTablet",new d(this,g));this.open=!1,this.autoclose=!1,this.closeModal=this.closeModal.bind(this),this.handleSelection=this.handleSelection.bind(this)}connectedCallback(){super.connectedCallback(),this.addEventListener(h,this.handleSelection)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(h,this.handleSelection)}updated(){this.mobileAndTablet.matches?this.modal=!0:(this.modal=!1,this.open&&this.closeModal())}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){let t=this.autoclose?B:f`<sp-link @click="${this.closeModal}"
                >${this.closeText||"Close"}</sp-link
            >`;return f`
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
                                ${t}
                            </div>
                        </div>
                    </sp-dialog-base>
                </sp-overlay>
            </sp-theme>
        `}get asAside(){return f`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}handleSelection(){this.autoclose&&this.closeModal()}closeModal(){this.open=!1,document.querySelector("body")?.classList.remove("merch-modal")}showModal(){this.open=!0,document.querySelector("body")?.classList.add("merch-modal")}};r(m,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,reflect:!0},open:{type:Boolean,state:!0,reflect:!0},autoclose:{type:Boolean,attribute:"autoclose",reflect:!0}}),r(m,"styles",[G`
            :host {
                display: block;
                z-index: 2;
                --merch-sidenav-gap: 8px;
            }

            :host h2 {
                color: var(--spectrum-global-color-gray-900);
                font-size: 12px;
                margin: 0 0 var(--merch-sidenav-gap);
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
            
            :host ::slotted(merch-search) {
                display: block;
                margin-bottom: var(--merch-sidenav-gap);
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
        `,u]);customElements.define("merch-sidenav",m);export{m as MerchSideNav};

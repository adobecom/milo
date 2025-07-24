var b=Object.defineProperty;var N=(i,e,t)=>e in i?b(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var r=(i,e,t)=>N(i,typeof e!="symbol"?e+"":e,t);import{html as A,css as Y,LitElement as U,nothing as F}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as L}from"/libs/deps/lit-all.min.js";var u=L`
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
`;import{html as O,LitElement as k}from"/libs/deps/lit-all.min.js";var W=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),K=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var D='span[is="inline-price"][data-wcs-osi]',y='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var z=`${D},${y}`;var x="merch-search:change";var h="merch-sidenav:select";var j=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var Q=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});function v(i,e){let t;return function(){let s=this,o=arguments;clearTimeout(t),t=setTimeout(()=>i.apply(s,o),e)}}function g(i,e={},t=null,s=null){let o=s?document.createElement(i,{is:s}):document.createElement(i);t instanceof HTMLElement?o.appendChild(t):o.innerHTML=t;for(let[n,a]of Object.entries(e))o.setAttribute(n,a);return o}var S="hashchange";function T(i=window.location.hash){let e=[],t=i.replace(/^#/,"").split("&");for(let s of t){let[o,n=""]=s.split("=");o&&e.push([o,decodeURIComponent(n.replace(/\+/g," "))])}return Object.fromEntries(e)}function c(i,e){if(i.deeplink){let t={};t[i.deeplink]=e,M(t)}}function M(i){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(i).forEach(([o,n])=>{n?e.set(o,n):e.delete(o)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let s=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,s)}function l(i){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=T(window.location.hash);i(t)};return e(),window.addEventListener(S,e),()=>{window.removeEventListener(S,e)}}var _=class extends k{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{c(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(x,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=v(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=T()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=l(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return O`<slot></slot>`}};r(_,"properties",{deeplink:{type:String}});customElements.define("merch-search",_);import{html as f,LitElement as I,css as P}from"/libs/deps/lit-all.min.js";var p=class extends I{constructor(){super(),this.toggleIconColor=!1,this.handleClickDebounced=v(this.handleClick.bind(this))}updated(){let e=this.querySelector("sp-sidenav-item:last-of-type");e.style.setProperty("--mod-sidenav-gap",0),e.style.setProperty("line-height","var(--mod-sidenav-top-level-line-height)")}selectElement(e,t=!0){e.selected=t,e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1);let s=e.querySelector(".selection");s?.setAttribute("selected",t);let o=s?.dataset,n=t&&this.toggleIconColor?o?.light:o?.dark;n&&e.querySelector("img")?.setAttribute("src",n),t&&(this.selectedElement=e,this.selectedText=o?.selectedText||e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}handleClick({target:e},t=!0){let{value:s,parentNode:o}=e;this.selectElement(e),o?.tagName==="SP-SIDENAV"?(o.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(n=>{n.value!==s&&(n.expanded=!1,this.selectElement(n,!1))}),o.querySelectorAll(".selection[selected=true]").forEach(n=>{let a=n.parentElement;a.value!==s&&this.selectElement(a,!1)})):o?.tagName==="SP-SIDENAV-ITEM"&&([...o.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(a=>a!==o).forEach(a=>{a.expanded=!1}),o.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(a=>{a.value!==s&&this.selectElement(a,!1)})),t&&c(this,s)}selectionChanged(e){let{target:{value:t,parentNode:s}}=e;this.selectElement(this.querySelector(`sp-sidenav-item[value="${t}"]`)),c(this,t)}startDeeplink(){this.stopDeeplink=l(e=>{let t=e[this.deeplink]??"all",s=this.querySelector(`sp-sidenav-item[value="${t}"]`);s&&this.updateComplete.then(()=>{s.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(s.expanded=!0),s.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(s.parentNode.expanded=!0),this.handleClick({target:s},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&this.startDeeplink()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return f`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?f`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};r(p,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"},toggleIconColor:{type:Boolean,attribute:"toggle-icon-color"}}),r(p,"styles",[P`
            :host {
                display: block;
                contain: content;
            }

            .right {
                position: absolute;
                right: 0;
            }
        `,u]);customElements.define("merch-sidenav-list",p);import{html as w,LitElement as V,css as H}from"/libs/deps/lit-all.min.js";var m=class extends V{constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let s=this.selectedValues.indexOf(t);e.checked&&s===-1?this.selectedValues.push(t):!e.checked&&s>=0&&this.selectedValues.splice(s,1)}c(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=g("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.setAttribute("role","group"),this.setAttribute("aria-labelledby",e)}startDeeplink(){this.stopDeeplink=l(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(s=>{let o=this.querySelector(`sp-checkbox[name=${s}]`);o&&(o.checked=t.includes(s))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let s=this.querySelector(`sp-checkbox[name=${t}]`);s&&(s.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return w`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};r(m,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),r(m,"styles",H`
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
    `);customElements.define("merch-sidenav-checkbox-group",m);var C="(max-width: 700px)";var R="(max-width: 1199px)";var E=class extends U{constructor(){super();r(this,"mobileDevice",new d(this,C));r(this,"mobileAndTablet",new d(this,R));this.open=!1,this.autoclose=!1,this.closeModal=this.closeModal.bind(this),this.handleSelection=this.handleSelection.bind(this)}connectedCallback(){super.connectedCallback(),this.addEventListener(h,this.handleSelection)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(h,this.handleSelection)}updated(){this.mobileAndTablet.matches?(this.modal=!0,this.style.padding=0,this.style.margin=0):(this.modal=!1,this.style.removeProperty("padding"),this.style.removeProperty("margin"),this.open&&this.closeModal())}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){let t=this.autoclose?F:A`<sp-link @click="${this.closeModal}"
                >${this.closeText||"Close"}</sp-link
            >`;return A`
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
        `}get asAside(){return A`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}handleSelection(){this.autoclose&&this.closeModal()}closeModal(){this.open=!1,document.querySelector("body")?.classList.remove("merch-modal")}showModal(){this.open=!0,document.querySelector("body")?.classList.add("merch-modal")}};r(E,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,reflect:!0},open:{type:Boolean,state:!0,reflect:!0},autoclose:{type:Boolean,attribute:"autoclose",reflect:!0}}),r(E,"styles",[Y`
            :host {
                --merch-sidenav-gap: 8px;
                --merch-sidenav-padding: 16px;
                --merch-sidenav-collection-gap: 30px;
                --merch-sidenav-title-font-size: 12px;
                --merch-sidenav-title-line-height: 30px;
                --merch-sidenav-title-color: var(--spectrum-gray-700, #464646);
                --merch-sidenav-title-padding: 0 12px;
                --merch-sidenav-item-inline-padding: 12px;
                --merch-sidenav-item-font-weight: 400;
                --merch-sidenav-item-font-size: 14px;
                --merch-sidenav-item-line-height: 18px;
                --merch-sidenav-item-label-top-margin: 6px;
                --merch-sidenav-item-label-bottom-margin: 8px;
                --merch-sidenav-item-icon-top-margin: 7px;
                --merch-sidenav-item-icon-gap: 8px;
                --merch-sidenav-item-selected-color: var(--spectrum-gray-800, #222222);
                --merch-sidenav-item-selected-background: var(--spectrum-gray-200, #E6E6E6);
                --merch-sidenav-list-gap: 4px;
                --merch-sidenav-modal-border-radius: 8px;
                --merch-sidenav-modal-padding: var(--merch-sidenav-padding);
                display: block;
                z-index: 2;
                padding: var(--merch-sidenav-padding);
                margin-right: var(--merch-sidenav-collection-gap);
            }

            ::slotted(merch-sidenav-list) {
                --mod-sidenav-inline-padding: var(--merch-sidenav-item-inline-padding);
                --mod-sidenav-top-level-font-weight: var(--merch-sidenav-item-font-weight);
                --mod-sidenav-top-level-font-size: var(--merch-sidenav-item-font-size);
                --mod-sidenav-top-level-line-height: var(--merch-sidenav-item-line-height);
                --mod-sidenav-top-to-label: var(--merch-sidenav-item-label-top-margin);
                --mod-sidenav-bottom-to-label: var(--merch-sidenav-item-label-bottom-margin);
                --mod-sidenav-top-to-icon: var(--merch-sidenav-item-icon-top-margin);
                --mod-sidenav-icon-spacing: var(--merch-sidenav-item-icon-gap);
                --mod-sidenav-content-color-default-selected: var(--merch-sidenav-item-selected-color);
                --mod-sidenav-item-background-default-selected: var(--merch-sidenav-item-selected-background);
                --mod-sidenav-gap: var(--merch-sidenav-list-gap);
            }

            :host h2 {
                color: var(--merch-sidenav-title-color);
                font-size: var(--merch-sidenav-title-font-size);
                margin: 0 0 var(--merch-sidenav-gap);
                padding: var(--merch-sidenav-title-padding);
                line-height: var(--merch-sidenav-title-line-height);
                height: auto;
            }

            #content {
                width: 100%;
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
                border-radius: var(--merch-sidenav-modal-border-radius);
                padding: var(--merch-sidenav-modal-padding);
            }

            sp-dialog-base {
                --mod-modal-confirm-border-radius: var(--merch-sidenav-modal-border-radius);
            }

            sp-dialog-base #sidenav {
                max-width: 300px;
                max-height: 80dvh;
                background: #ffffff 0% 0% no-repeat padding-box;
                box-shadow: 0px 1px 4px #00000026;
            }

            sp-link {
                position: absolute;
                top: 16px;
                right: 16px;
            }
        `,u]);customElements.define("merch-sidenav",E);export{E as MerchSideNav};

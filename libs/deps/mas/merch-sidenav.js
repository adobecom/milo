var V=Object.defineProperty;var S=o=>{throw TypeError(o)};var H=(o,e,t)=>e in o?V(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var i=(o,e,t)=>H(o,typeof e!="symbol"?e+"":e,t),C=(o,e,t)=>e.has(o)||S("Cannot "+t);var R=(o,e,t)=>(C(o,e,"read from private field"),t?t.call(o):e.get(o)),v=(o,e,t)=>e.has(o)?S("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),N=(o,e,t,s)=>(C(o,e,"write to private field"),s?s.call(o,t):e.set(o,t),t);import{html as I,css as Q,LitElement as X}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as U}from"/libs/deps/lit-all.min.js";var u=U`
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
`;import{html as q,LitElement as B}from"/libs/deps/lit-all.min.js";var oe=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),se=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var Y='span[is="inline-price"][data-wcs-osi]',F='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var ne=`${Y},${F}`;var g="merch-search:change";var b="merch-sidenav:select";var ie=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),re=Object.freeze({V2:"UCv2",V3:"UCv3"}),ce=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});function _(o,e){let t;return function(){let s=this,n=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(s,n),e)}}function L(o,e={},t=null,s=null){let n=s?document.createElement(o,{is:s}):document.createElement(o);t instanceof HTMLElement?n.appendChild(t):n.innerHTML=t;for(let[r,c]of Object.entries(e))n.setAttribute(r,c);return n}var D="hashchange";function f(o=window.location.hash){let e=[],t=o.replace(/^#/,"").split("&");for(let s of t){let[n,r=""]=s.split("=");n&&e.push([n,decodeURIComponent(r.replace(/\+/g," "))])}return Object.fromEntries(e)}function a(o,e){if(o.deeplink){let t={};t[o.deeplink]=e,G(t)}}function G(o){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(o).forEach(([n,r])=>{r?e.set(n,r):e.delete(n)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let s=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,s)}function l(o){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=f(window.location.hash);o(t)};return e(),window.addEventListener(D,e),()=>{window.removeEventListener(D,e)}}var T=class extends B{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{a(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(g,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=_(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=f()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=l(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return q`<slot></slot>`}};i(T,"properties",{deeplink:{type:String}});customElements.define("merch-search",T);import{html as y,LitElement as $,css as K}from"/libs/deps/lit-all.min.js";var p=class extends ${constructor(){super(),this.handleClickDebounced=_(this.handleClick.bind(this))}selectElement(e,t=!0){e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1),t&&(this.selectedElement=e,this.selectedText=e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(b,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}handleClick({target:e},t=!0){let{value:s,parentNode:n}=e;this.selectElement(e),n?.tagName==="SP-SIDENAV"?(e.selected=!0,n.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(r=>{r.value!==s&&(r.expanded=!1,r.selected=!1)})):n?.tagName==="SP-SIDENAV-ITEM"&&([...n.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(c=>c!==n).forEach(c=>{c.expanded=!1}),n.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(c=>{c.value!==s&&(c.selected=!1)})),t&&a(this,s)}selectionChanged({target:{value:e,parentNode:t}}){this.selectElement(this.querySelector(`sp-sidenav-item[value="${e}"]`)),a(this,e)}startDeeplink(){this.stopDeeplink=l(e=>{let t=e[this.deeplink]??"all",s=this.querySelector(`sp-sidenav-item[value="${t}"]`);s&&this.updateComplete.then(()=>{s.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(s.expanded=!0),s.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(s.parentNode.expanded=!0),this.handleClick({target:s},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&this.startDeeplink()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return y`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?y`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};i(p,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}}),i(p,"styles",[K`
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
        `,u]);customElements.define("merch-sidenav-list",p);import{html as W,LitElement as j,css as z}from"/libs/deps/lit-all.min.js";var h=class extends j{constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let s=this.selectedValues.indexOf(t);e.checked&&s===-1?this.selectedValues.push(t):!e.checked&&s>=0&&this.selectedValues.splice(s,1)}a(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=L("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.setAttribute("role","group"),this.setAttribute("aria-labelledby",e)}startDeeplink(){this.stopDeeplink=l(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(s=>{let n=this.querySelector(`sp-checkbox[name=${s}]`);n&&(n.checked=t.includes(s))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let s=this.querySelector(`sp-checkbox[name=${t}]`);s&&(s.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return W`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};i(h,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),i(h,"styles",z`
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
    `);customElements.define("merch-sidenav-checkbox-group",h);var O="(max-width: 700px)";var w="(max-width: 1199px)";var M=/iP(ad|hone|od)/.test(window?.navigator?.platform)||window?.navigator?.platform==="MacIntel"&&window.navigator.maxTouchPoints>1,x=!1,A,P=o=>{o&&(M?(document.body.style.position="fixed",o.ontouchmove=e=>{e.targetTouches.length===1&&e.stopPropagation()},x||(document.addEventListener("touchmove",e=>e.preventDefault()),x=!0)):(A=document.body.style.overflow,document.body.style.overflow="hidden"))},k=o=>{o&&(M?(o.ontouchstart=null,o.ontouchmove=null,document.body.style.position="",document.removeEventListener("touchmove",e=>e.preventDefault()),x=!1):A!==void 0&&(document.body.style.overflow=A,A=void 0))};var m,E=class extends X{constructor(){super();v(this,m);i(this,"mobileDevice",new d(this,O));i(this,"mobileAndTablet",new d(this,w));this.modal=!1}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(this.modal)return I`
            <sp-theme  color="light" scale="medium">
                <sp-dialog-base
                    slot="click-content"
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
                            <sp-link href="#" @click="${this.closeModal}"
                                >${this.closeText||"Close"}</sp-link
                            >
                        </div>
                    </div>
                </sp-dialog-base>
            </sp-theme>
        `}get asAside(){return I`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(t){t.preventDefault(),this.dialog?.close(),document.body.classList.remove("merch-modal")}openModal(){this.updateComplete.then(async()=>{P(this.dialog),document.body.classList.add("merch-modal");let t={trigger:R(this,m),notImmediatelyClosable:!0,type:"auto"},s=await window.__merch__spectrum_Overlay.open(this.dialog,t);s.addEventListener("close",()=>{this.modal=!1,document.body.classList.remove("merch-modal"),k(this.dialog)}),this.shadowRoot.querySelector("sp-theme").append(s)})}updated(){this.modal&&this.openModal()}showModal({target:t}){N(this,m,t),this.modal=!0}};m=new WeakMap,i(E,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,attribute:"modal",reflect:!0}}),i(E,"styles",[Q`
            :host {
                display: block;
                z-index: 2;
            }

            :host h2 {
              color: var(--spectrum-global-color-gray-900);
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
        `,u]);customElements.define("merch-sidenav",E);export{E as MerchSideNav};

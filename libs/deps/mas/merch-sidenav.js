var w=Object.defineProperty;var D=(s,e,t)=>e in s?w(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var a=(s,e,t)=>D(s,typeof e!="symbol"?e+"":e,t);import{html as _,css as B,LitElement as K,nothing as L}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{html as H,LitElement as V}from"/libs/deps/lit-all.min.js";var Z=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),J=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var M='span[is="inline-price"][data-wcs-osi]',O='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var y='a[is="upt-link"]',ee=`${M},${O},${y}`;var f="merch-search:change";var h="merch-sidenav:select";var te=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var oe=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});function u(s,e){let t;return function(){let o=this,i=arguments;clearTimeout(t),t=setTimeout(()=>s.apply(o,i),e)}}function T(s,e={},t=null,o=null){let i=o?document.createElement(s,{is:o}):document.createElement(s);t instanceof HTMLElement?i.appendChild(t):i.innerHTML=t;for(let[n,r]of Object.entries(e))i.setAttribute(n,r);return i}function I(s){if(!window.history.pushState)return;let e=new URL(window.location.href);e.search=`?${s}`,window.history.pushState({path:e.href},"",e.href)}function g(s,e){let t=new URLSearchParams(window.location.hash.slice(1));t.set(s,e),window.location.hash=t.toString()}function A(s=[]){s.forEach(e=>{let t=new URLSearchParams(window.location.search),o=t.get(e);o&&(window.location.hash.includes(`${e}=`)?g(e,o):window.location.hash=window.location.hash?`${window.location.hash}&${e}=${o}`:`${e}=${o}`,t.delete(e),I(t.toString()))})}var S="hashchange";function x(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let o of t){let[i,n=""]=o.split("=");i&&e.push([i,decodeURIComponent(n.replace(/\+/g," "))])}return Object.fromEntries(e)}function c(s,e){if(s.deeplink){let t={};t[s.deeplink]=e,P(t)}}function P(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([i,n])=>{n?e.set(i,n):e.delete(i)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function l(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=x(window.location.hash);s(t)};return e(),window.addEventListener(S,e),()=>{window.removeEventListener(S,e)}}var v=class extends V{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{c(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(f,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=u(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=x()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=l(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return H`<slot></slot>`}};a(v,"properties",{deeplink:{type:String}});customElements.define("merch-search",v);import{html as b,LitElement as U,css as Y,nothing as F}from"/libs/deps/lit-all.min.js";var p=class extends U{constructor(){super(),this.toggleIconColor=!1,this.handleClickDebounced=u(this.handleClick.bind(this))}selectElement(e,t=!0){e.selected=t,e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1);let o=e.querySelector(".selection");o?.setAttribute("selected",t);let i=o?.dataset,n=t&&this.toggleIconColor?i?.light:i?.dark;n&&e.querySelector("img")?.setAttribute("src",n),t&&(this.selectedElement=e,this.selectedText=i?.selectedText||e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(h,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}markCurrentItem(e){let t=e.closest("sp-sidenav");t&&(t.querySelectorAll("sp-sidenav-item[aria-current]").forEach(o=>{o.removeAttribute("aria-current")}),e.setAttribute("aria-current","true"))}handleClick({target:e},t=!0){let{value:o,parentNode:i}=e;this.selectElement(e),this.markCurrentItem(e),i?.tagName==="SP-SIDENAV"?(i.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(n=>{n.value!==o&&(n.expanded=!1,n.removeAttribute("aria-expanded"),this.selectElement(n,!1))}),i.querySelectorAll(".selection[selected=true]").forEach(n=>{let r=n.parentElement;r.value!==o&&this.selectElement(r,!1)})):i?.tagName==="SP-SIDENAV-ITEM"&&([...i.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(r=>r!==i).forEach(r=>{r.expanded=!1,r.removeAttribute("aria-expanded")}),i.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(r=>{r.value!==o&&this.selectElement(r,!1)})),t&&c(this,o)}selectionChanged(e){let{target:{value:t,parentNode:o}}=e;this.selectElement(this.querySelector(`sp-sidenav-item[value="${t}"]`)),c(this,t)}startDeeplink(){this.stopDeeplink=l(e=>{let t=e[this.deeplink]??"all",o=this.querySelector(`sp-sidenav-item[value="${t}"]`);o||(o=this.querySelector("sp-sidenav-item:first-child"),g(this.deeplink,o.value)),this.updateComplete.then(()=>{o.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(o.expanded=!0,o.setAttribute("aria-expanded","true")),o.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(o.parentNode.expanded=!0,o.parentNode.setAttribute("aria-expanded","true")),this.handleClick({target:o},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&(A(["filter","single_app"]),this.startDeeplink())})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return b`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?b`<h2>${this.sidenavListTitle}</h2>`:F}
            <slot></slot>
        </div>`}};a(p,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"},toggleIconColor:{type:Boolean,attribute:"toggle-icon-color"}}),a(p,"styles",Y`
        :host {
            display: block;
            contain: content;
            margin-top: var(--merch-sidenav-list-gap);
        }

        :host h2 {
            color: var(--merch-sidenav-list-title-color);
            font-size: var(--merch-sidenav-list-title-font-size);
            font-weight: var(--merch-sidenav-list-title-font-weight);
            padding: var(--merch-sidenav-list-title-padding);
            line-height: var(--merch-sidenav-list-title-line-height);
            margin: 0;
        }

        .right {
            position: absolute;
            right: 0;
        }
    `);customElements.define("merch-sidenav-list",p);import{html as $,LitElement as q,css as G}from"/libs/deps/lit-all.min.js";var m=class extends q{constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let o=this.selectedValues.indexOf(t);e.checked&&o===-1?this.selectedValues.push(t):!e.checked&&o>=0&&this.selectedValues.splice(o,1)}c(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=T("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.setAttribute("role","group"),this.setAttribute("aria-labelledby",e)}startDeeplink(){this.stopDeeplink=l(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(o=>{let i=this.querySelector(`sp-checkbox[name=${o}]`);i&&(i.checked=t.includes(o))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let o=this.querySelector(`sp-checkbox[name=${t}]`);o&&(o.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return $`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};a(m,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),a(m,"styles",G`
        :host {
            display: block;
            contain: content;
            border-top: 1px solid var(--color-gray-200);
            padding: var(--merch-sidenav-checkbox-group-padding);
            margin-top: var(--merch-sidenav-checkbox-group-gap);
        }

        .checkbox-group {
            display: flex;
            flex-direction: column;
        }
    `);customElements.define("merch-sidenav-checkbox-group",m);var N="(max-width: 700px)",z="(max-width: 767px)",k="(max-width: 1199px)";var C="(min-width: 1200px)",R="(min-width: 1600px)",Ce={matchMobile:window.matchMedia(z),matchDesktop:window.matchMedia(`${C} and (not ${R})`),matchDesktopOrUp:window.matchMedia(C),matchLargeDesktop:window.matchMedia(R),get isMobile(){return this.matchMobile.matches},get isDesktop(){return this.matchDesktop.matches},get isDesktopOrUp(){return this.matchDesktopOrUp.matches}};var W={catalog:"l"},j={catalog:"xl"},E=class extends K{constructor(){super();a(this,"mobileDevice",new d(this,N));a(this,"mobileAndTablet",new d(this,k));this.open=!1,this.autoclose=!1,this.variant=null,this.closeModal=this.closeModal.bind(this),this.handleSelection=this.handleSelection.bind(this)}connectedCallback(){super.connectedCallback(),this.addEventListener(h,this.handleSelection)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(h,this.handleSelection)}firstUpdated(){let t=W[this.variant];t&&this.querySelector("merch-search sp-search").setAttribute("size",t);let o=j[this.variant];o&&this.querySelectorAll("merch-sidenav-checkbox-group sp-checkbox").forEach(n=>{n.setAttribute("size",o)})}updated(){this.mobileAndTablet.matches?(this.modal=!0,this.style.padding=0,this.style.margin=0):(this.modal=!1,this.style.removeProperty("padding"),this.style.removeProperty("margin"),this.open&&this.closeModal())}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(!this.open)return L;let t=this.autoclose?L:_`<sp-link @click="${this.closeModal}"
                >${this.closeText||"Close"}</sp-link
            >`;return _`
            <sp-theme color="light" scale="medium">
                <sp-overlay type="modal" open @sp-closed=${this.closeModal}>
                    <sp-dialog-base
                        dismissable
                        underlay
                        no-divider
                        @close=${this.closeModal}
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
        `}get asAside(){return _`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}handleSelection(){this.autoclose&&this.closeModal()}closeModal(){this.open=!1,document.querySelector("body")?.classList.remove("merch-modal")}showModal(){this.open=!0,document.querySelector("body")?.classList.add("merch-modal")}};a(E,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,reflect:!0},open:{type:Boolean,state:!0,reflect:!0},autoclose:{type:Boolean,attribute:"autoclose",reflect:!0}}),a(E,"styles",B`
        :host {
            --merch-sidenav-padding: 16px;
            --merch-sidenav-collection-gap: 30px;
            /* Title */
            --merch-sidenav-title-font-size: 12px;
            --merch-sidenav-title-font-weight: 400;
            --merch-sidenav-title-line-height: 16px;
            --merch-sidenav-title-color: var(--spectrum-gray-700, #464646);
            --merch-sidenav-title-padding: 6px 12px 16px;
            /* Search */
            --merch-sidenav-search-gap: 10px;
            /* List */
            --merch-sidenav-list-gap: 0;
            --merch-sidenav-list-title-color: var(--spectrum-gray-700, #464646);
            --merch-sidenav-list-title-font-size: 14px;
            --merch-sidenav-list-title-font-weight: 400;
            --merch-sidenav-list-title-padding: 6px 12px 8px;
            --merch-sidenav-list-title-line-height: 18px;
            --merch-sidenav-item-height: unset;
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
            --merch-sidenav-list-item-gap: 4px;
            /* Checkbox group */
            --merch-sidenav-checkbox-group-title-font-size: 14px;
            --merch-sidenav-checkbox-group-title-font-weight: 400;
            --merch-sidenav-checkbox-group-title-line-height: 18px;
            --merch-sidenav-checkbox-group-title-color: var(--spectrum-gray-700, #464646);
            --merch-sidenav-checkbox-group-title-padding: 6px 0 8px;
            --merch-sidenav-checkbox-group-gap: 32px;
            --merch-sidenav-checkbox-group-padding: 0 12px;
            --merch-sidenav-checkbox-group-label-font-size: 17px;
            --merch-sidenav-checkbox-group-checkbox-spacing: 22px;
            --merch-sidenav-checkbox-group-label-gap: 13px;
            --merch-sidenav-checkbox-group-label-top-margin: 8px;
            --merch-sidenav-checkbox-group-height: 40px;
            /* Modal */
            --merch-sidenav-modal-close-font-size: 15px;
            --merch-sidenav-modal-close-line-height: 19px;
            --merch-sidenav-modal-close-gap: 10px;
            --merch-sidenav-modal-border-radius: 8px;
            --merch-sidenav-modal-padding: var(--merch-sidenav-padding);

            display: block;
            z-index: 2;
            padding: var(--merch-sidenav-padding);
            margin-right: var(--merch-sidenav-collection-gap);
        }

        ::slotted(merch-sidenav-list) {
            --mod-sidenav-min-height: var(--merch-sidenav-item-height);
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
            --mod-sidenav-gap: var(--merch-sidenav-list-item-gap);
        }

        ::slotted(merch-sidenav-checkbox-group) {
            --mod-checkbox-font-size: var(--merch-sidenav-checkbox-group-label-font-size);
            --mod-checkbox-spacing: var(--merch-sidenav-checkbox-group-checkbox-spacing);
            --mod-checkbox-text-to-control: var(--merch-sidenav-checkbox-group-label-gap);
            --mod-checkbox-top-to-text: var(--merch-sidenav-checkbox-group-label-top-margin);
            --mod-checkbox-height: var(--merch-sidenav-checkbox-group-height);
        }

        :host h2 {
            color: var(--merch-sidenav-title-color);
            font-size: var(--merch-sidenav-title-font-size);
            font-weight: var(--merch-sidenav-title-font-weight);
            padding: var(--merch-sidenav-title-padding);
            line-height: var(--merch-sidenav-title-line-height);
            margin: 0;
        }

        #content {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: baseline;
        }
        
        ::slotted(merch-search) {
            display: block;
            margin-bottom: var(--merch-sidenav-search-gap);
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
            --mod-modal-max-height: 100dvh;
        }

        sp-dialog-base #sidenav {
            box-sizing: border-box;
            max-width: 300px;
            max-height: 95dvh;
            background: #ffffff 0% 0% no-repeat padding-box;
            box-shadow: 0px 1px 4px #00000026;
        }

        :host(:not([autoclose])) #sidenav h2 {
            margin-top: calc(var(--merch-sidenav-modal-close-gap) + var(--merch-sidenav-modal-close-line-height));
        }

        sp-link {
            position: absolute;
            top: 16px;
            right: 16px;
            font-size: var(--merch-sidenav-modal-close-font-size);
            line-height: var(--merch-sidenav-modal-close-line-height);
        }
    `);customElements.define("merch-sidenav",E);export{E as MerchSideNav};

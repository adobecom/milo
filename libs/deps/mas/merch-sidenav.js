var P=Object.defineProperty;var V=(o,e,t)=>e in o?P(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var i=(o,e,t)=>(V(o,typeof e!="symbol"?e+"":e,t),t),T=(o,e,t)=>{if(!e.has(o))throw TypeError("Cannot "+t)};var v=(o,e,t)=>(T(o,e,"read from private field"),t?t.call(o):e.get(o)),g=(o,e,t)=>{if(e.has(o))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(o):e.set(o,t)},S=(o,e,t,s)=>(T(o,e,"write to private field"),s?s.call(o,t):e.set(o,t),t);import{html as k,css as W,LitElement as j}from"/libs/deps/lit-all.min.js";var l=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as H}from"/libs/deps/lit-all.min.js";var u=H`
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
`;import{html as F,LitElement as G}from"/libs/deps/lit-all.min.js";function E(o,e){let t;return function(){let s=this,n=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(s,n),e)}}function C(o,e={},t=null,s=null){let n=s?document.createElement(o,{is:s}):document.createElement(o);t instanceof HTMLElement?n.appendChild(t):n.innerHTML=t;for(let[c,I]of Object.entries(e))n.setAttribute(c,I);return n}var A="merch-search:change";var b="merch-sidenav:select";var y="hashchange";function r(o=window.location.hash){let e=[],t=o.replace(/^#/,"").split("&");for(let s of t){let[n,c=""]=s.split("=");n&&e.push([n,decodeURIComponent(c.replace(/\+/g," "))])}return Object.fromEntries(e)}function a(o,e){if(o.deeplink){let t={};t[o.deeplink]=e,U(t)}}function U(o){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(o).forEach(([n,c])=>{c?e.set(n,c):e.delete(n)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let s=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,s)}function N(o){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=r(window.location.hash);o(t)};return e(),window.addEventListener(y,e),()=>{window.removeEventListener(y,e)}}var f=class extends G{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{a(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(A,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=E(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=r()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=N(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return F`<slot></slot>`}};i(f,"properties",{deeplink:{type:String}});customElements.define("merch-search",f);import{html as R,LitElement as B,css as Y}from"/libs/deps/lit-all.min.js";var d=class extends B{constructor(){super(),this.handleClickDebounced=E(this.handleClick.bind(this))}selectElement(e,t=!0){e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1),t&&(this.selectedElement=e,this.selectedText=e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(b,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}setStateFromURL(){let t=r()[this.deeplink]??"all";if(t){let s=this.querySelector(`sp-sidenav-item[value="${t}"]`);if(!s)return;this.updateComplete.then(()=>{let n="SP-SIDENAV-ITEM";s.firstElementChild?.tagName===n&&(s.expanded=!0),this.selectElement(s)})}}handleClick({target:e}){let{value:t,parentNode:s}=e;this.selectElement(e),s&&s.tagName==="SP-SIDENAV"&&(a(this,t),e.selected=!0,s.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(n=>{n.value!==t&&(n.expanded=!1,n.selected=!1)}))}selectionChanged({target:{value:e,parentNode:t}}){this.selectElement(this.querySelector(`sp-sidenav-item[value="${e}"]`)),a(this,e)}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.setStateFromURL()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced)}render(){return R`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?R`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};i(d,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}}),i(d,"styles",[Y`
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
        `,u]);customElements.define("merch-sidenav-list",d);import{html as $,LitElement as q,css as K}from"/libs/deps/lit-all.min.js";var h=class extends q{setStateFromURL(){this.selectedValues=[];let{types:e}=r();e&&(this.selectedValues=e.split(","),this.selectedValues.forEach(t=>{let s=this.querySelector(`sp-checkbox[name=${t}]`);s&&(s.checked=!0)}))}selectionChanged(e){let{target:t}=e,s=t.getAttribute("name");if(s){let n=this.selectedValues.indexOf(s);t.checked&&n===-1?this.selectedValues.push(s):!t.checked&&n>=0&&this.selectedValues.splice(n,1)}a(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=C("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.childNodes.forEach(s=>{s.id!==e&&(s.setAttribute("role","group"),s.setAttribute("aria-labelledby",e))})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.setStateFromURL(),this.addGroupTitle()})}render(){return $`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};i(h,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),i(h,"styles",K`
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
    `);customElements.define("merch-sidenav-checkbox-group",h);var L="(max-width: 700px)";var w="(max-width: 1199px)";var D=/iP(ad|hone|od)/.test(window?.navigator?.platform)||window?.navigator?.platform==="MacIntel"&&window.navigator.maxTouchPoints>1,_=!1,x,O=o=>{o&&(D?(document.body.style.position="fixed",o.ontouchmove=e=>{e.targetTouches.length===1&&e.stopPropagation()},_||(document.addEventListener("touchmove",e=>e.preventDefault()),_=!0)):(x=document.body.style.overflow,document.body.style.overflow="hidden"))},M=o=>{o&&(D?(o.ontouchstart=null,o.ontouchmove=null,document.body.style.position="",document.removeEventListener("touchmove",e=>e.preventDefault()),_=!1):x!==void 0&&(document.body.style.overflow=x,x=void 0))};var m,p=class extends j{constructor(){super();g(this,m,void 0);i(this,"mobileDevice",new l(this,L));i(this,"mobileAndTablet",new l(this,w));this.modal=!1}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(this.modal)return k`
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
        `}get asAside(){return k`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(t){t.preventDefault(),this.dialog?.close(),document.body.classList.remove("merch-modal")}openModal(){this.updateComplete.then(async()=>{O(this.dialog),document.body.classList.add("merch-modal");let t={trigger:v(this,m),notImmediatelyClosable:!0,type:"auto"},s=await window.__merch__spectrum_Overlay.open(this.dialog,t);s.addEventListener("close",()=>{this.modal=!1,document.body.classList.remove("merch-modal"),M(this.dialog)}),this.shadowRoot.querySelector("sp-theme").append(s)})}updated(){this.modal&&this.openModal()}showModal({target:t}){S(this,m,t),this.modal=!0}};m=new WeakMap,i(p,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,attribute:"modal",reflect:!0}}),i(p,"styles",[W`
            :host {
                display: block;
                z-index: 2;
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
        `,u]);customElements.define("merch-sidenav",p);export{p as MerchSideNav};

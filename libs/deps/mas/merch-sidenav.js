var P=Object.defineProperty;var v=s=>{throw TypeError(s)};var H=(s,e,t)=>e in s?P(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>H(s,typeof e!="symbol"?e+"":e,t),S=(s,e,t)=>e.has(s)||v("Cannot "+t);var b=(s,e,t)=>(S(s,e,"read from private field"),t?t.call(s):e.get(s)),g=(s,e,t)=>e.has(s)?v("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(s):e.set(s,t),T=(s,e,t,o)=>(S(s,e,"write to private field"),o?o.call(s,t):e.set(s,t),t);import{html as V,css as j,LitElement as z}from"/libs/deps/lit-all.min.js";import"/libs/deps/lit-all.min.js";var l=class{constructor(e,t){n(this,"key");n(this,"host");n(this,"media");n(this,"matches");this.key=Symbol("match-media-key"),this.media=window.matchMedia(t),this.matches=this.media.matches,this.updateMatches=this.updateMatches.bind(this),(this.host=e).addController(this)}hostConnected(){this.media.addEventListener("change",this.updateMatches)}hostDisconnected(){this.media.removeEventListener("change",this.updateMatches)}updateMatches(){this.matches!==this.media.matches&&(this.matches=this.media.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as F}from"/libs/deps/lit-all.min.js";var u=F`
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
`;import{html as G,LitElement as B}from"/libs/deps/lit-all.min.js";function E(s,e){let t;return function(){let o=this,i=arguments;clearTimeout(t),t=setTimeout(()=>s.apply(o,i),e)}}function A(s,e={},t=null,o=null){let i=o?document.createElement(s,{is:o}):document.createElement(s);t instanceof HTMLElement?i.appendChild(t):i.innerHTML=t;for(let[c,I]of Object.entries(e))i.setAttribute(c,I);return i}var C="merch-search:change";var y="merch-sidenav:select";var w="hashchange";function a(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let o of t){let[i,c=""]=o.split("=");i&&e.push([i,decodeURIComponent(c.replace(/\+/g," "))])}return Object.fromEntries(e)}function r(s,e){if(s.deeplink){let t={};t[s.deeplink]=e,U(t)}}function U(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([i,c])=>{c?e.set(i,c):e.delete(i)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function R(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=a(window.location.hash);s(t)};return e(),window.addEventListener(w,e),()=>{window.removeEventListener(w,e)}}var f=class extends B{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{r(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(C,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=E(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=a()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=R(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return G`<slot></slot>`}};n(f,"properties",{deeplink:{type:String}});customElements.define("merch-search",f);import{html as L,LitElement as $,css as q}from"/libs/deps/lit-all.min.js";var d=class extends ${constructor(){super(),this.handleClickDebounced=E(this.handleClick.bind(this))}selectElement(e,t=!0){e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1),t&&(this.selectedElement=e,this.selectedText=e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}setStateFromURL(){let t=a()[this.deeplink]??"all";if(t){let o=this.querySelector(`sp-sidenav-item[value="${t}"]`);if(!o)return;this.updateComplete.then(()=>{o.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(o.expanded=!0),this.selectElement(o)})}}handleClick({target:e}){let{value:t,parentNode:o}=e;this.selectElement(e),o&&o.tagName==="SP-SIDENAV"&&(r(this,t),e.selected=!0,o.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(i=>{i.value!==t&&(i.expanded=!1,i.selected=!1)}))}selectionChanged({target:{value:e,parentNode:t}}){this.selectElement(this.querySelector(`sp-sidenav-item[value="${e}"]`)),r(this,e)}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.setStateFromURL()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced)}render(){return L`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?L`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};n(d,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}}),n(d,"styles",[q`
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
        `,u]);customElements.define("merch-sidenav-list",d);import{html as Y,LitElement as K,css as W}from"/libs/deps/lit-all.min.js";var h=class extends K{setStateFromURL(){this.selectedValues=[];let{types:e}=a();e&&(this.selectedValues=e.split(","),this.selectedValues.forEach(t=>{let o=this.querySelector(`sp-checkbox[name=${t}]`);o&&(o.checked=!0)}))}selectionChanged(e){let{target:t}=e,o=t.getAttribute("name");if(o){let i=this.selectedValues.indexOf(o);t.checked&&i===-1?this.selectedValues.push(o):!t.checked&&i>=0&&this.selectedValues.splice(i,1)}r(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=A("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.childNodes.forEach(o=>{o.id!==e&&(o.setAttribute("role","group"),o.setAttribute("aria-labelledby",e))})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.setStateFromURL(),this.addGroupTitle()})}render(){return Y`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};n(h,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),n(h,"styles",W`
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
    `);customElements.define("merch-sidenav-checkbox-group",h);var N="(max-width: 700px)";var D="(max-width: 1199px)";var k=/iP(ad|hone|od)/.test(window?.navigator?.platform)||window?.navigator?.platform==="MacIntel"&&window.navigator.maxTouchPoints>1,_=!1,x,M=s=>{s&&(k?(document.body.style.position="fixed",s.ontouchmove=e=>{e.targetTouches.length===1&&e.stopPropagation()},_||(document.addEventListener("touchmove",e=>e.preventDefault()),_=!0)):(x=document.body.style.overflow,document.body.style.overflow="hidden"))},O=s=>{s&&(k?(s.ontouchstart=null,s.ontouchmove=null,document.body.style.position="",document.removeEventListener("touchmove",e=>e.preventDefault()),_=!1):x!==void 0&&(document.body.style.overflow=x,x=void 0))};var m,p=class extends z{constructor(){super();g(this,m);n(this,"mobileDevice",new l(this,N));n(this,"mobileAndTablet",new l(this,D));this.modal=!1}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(this.modal)return V`
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
        `}get asAside(){return V`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(t){t.preventDefault(),this.dialog?.close(),document.body.classList.remove("merch-modal")}openModal(){this.updateComplete.then(async()=>{M(this.dialog),document.body.classList.add("merch-modal");let t={trigger:b(this,m),notImmediatelyClosable:!0,type:"auto"},o=await window.__merch__spectrum_Overlay.open(this.dialog,t);o.addEventListener("close",()=>{this.modal=!1,document.body.classList.remove("merch-modal"),O(this.dialog)}),this.shadowRoot.querySelector("sp-theme").append(o)})}updated(){this.modal&&this.openModal()}showModal({target:t}){T(this,m,t),this.modal=!0}};m=new WeakMap,n(p,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,attribute:"modal",reflect:!0}}),n(p,"styles",[j`
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

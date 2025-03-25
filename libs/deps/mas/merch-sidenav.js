var V=Object.defineProperty;var P=(o,e,t)=>e in o?V(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var i=(o,e,t)=>(P(o,typeof e!="symbol"?e+"":e,t),t),S=(o,e,t)=>{if(!e.has(o))throw TypeError("Cannot "+t)};var g=(o,e,t)=>(S(o,e,"read from private field"),t?t.call(o):e.get(o)),A=(o,e,t)=>{if(e.has(o))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(o):e.set(o,t)},C=(o,e,t,s)=>(S(o,e,"write to private field"),s?s.call(o,t):e.set(o,t),t);import{html as I,css as W,LitElement as j}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as H}from"/libs/deps/lit-all.min.js";var E=H`
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
`;import{html as F,LitElement as G}from"/libs/deps/lit-all.min.js";function f(o,e){let t;return function(){let s=this,n=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(s,n),e)}}function b(o,e={},t=null,s=null){let n=s?document.createElement(o,{is:s}):document.createElement(o);t instanceof HTMLElement?n.appendChild(t):n.innerHTML=t;for(let[r,a]of Object.entries(e))n.setAttribute(r,a);return n}var y="merch-search:change";var N="merch-sidenav:select";var w="hashchange";function v(o=window.location.hash){let e=[],t=o.replace(/^#/,"").split("&");for(let s of t){let[n,r=""]=s.split("=");n&&e.push([n,decodeURIComponent(r.replace(/\+/g," "))])}return Object.fromEntries(e)}function c(o,e){if(o.deeplink){let t={};t[o.deeplink]=e,U(t)}}function U(o){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(o).forEach(([n,r])=>{r?e.set(n,r):e.delete(n)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let s=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,s)}function l(o){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=v(window.location.hash);o(t)};return e(),window.addEventListener(w,e),()=>{window.removeEventListener(w,e)}}var x=class extends G{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{c(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=f(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=v()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=l(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return F`<slot></slot>`}};i(x,"properties",{deeplink:{type:String}});customElements.define("merch-search",x);import{html as R,LitElement as B,css as q}from"/libs/deps/lit-all.min.js";var h=class extends B{constructor(){super(),this.handleClickDebounced=f(this.handleClick.bind(this))}selectElement(e,t=!0){e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1),t&&(this.selectedElement=e,this.selectedText=e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(N,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}handleClick({target:e},t=!0){let{value:s,parentNode:n}=e;this.selectElement(e),n?.tagName==="SP-SIDENAV"?(t&&c(this,s),e.selected=!0,n.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(r=>{r.value!==s&&(r.expanded=!1,r.selected=!1)})):n?.tagName==="SP-SIDENAV-ITEM"&&([...n.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(a=>a!==n).forEach(a=>{a.expanded=!1}),n.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(a=>{a.value!==s&&(a.selected=!1)}))}selectionChanged({target:{value:e,parentNode:t}}){this.selectElement(this.querySelector(`sp-sidenav-item[value="${e}"]`)),c(this,e)}startDeeplink(){this.stopDeeplink=l(e=>{let t=e[this.deeplink]??"all",s=this.querySelector(`sp-sidenav-item[value="${t}"]`);s&&this.updateComplete.then(()=>{s.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(s.expanded=!0),s.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(s.parentNode.expanded=!0),this.handleClick({target:s},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&this.startDeeplink()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return R`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?R`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};i(h,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}}),i(h,"styles",[q`
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
        `,E]);customElements.define("merch-sidenav-list",h);import{html as Y,LitElement as $,css as K}from"/libs/deps/lit-all.min.js";var p=class extends ${constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let s=this.selectedValues.indexOf(t);e.checked&&s===-1?this.selectedValues.push(t):!e.checked&&s>=0&&this.selectedValues.splice(s,1)}c(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=b("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.childNodes.forEach(s=>{s.id&&s.id!==e&&(s.setAttribute("role","group"),s.setAttribute("aria-labelledby",e))})}startDeeplink(){this.stopDeeplink=l(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(s=>{let n=this.querySelector(`sp-checkbox[name=${s}]`);n&&(n.checked=t.includes(s))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let s=this.querySelector(`sp-checkbox[name=${t}]`);s&&(s.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return Y`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};i(p,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),i(p,"styles",K`
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
    `);customElements.define("merch-sidenav-checkbox-group",p);var L="(max-width: 700px)";var D="(max-width: 1199px)";var k=/iP(ad|hone|od)/.test(window?.navigator?.platform)||window?.navigator?.platform==="MacIntel"&&window.navigator.maxTouchPoints>1,T=!1,_,M=o=>{o&&(k?(document.body.style.position="fixed",o.ontouchmove=e=>{e.targetTouches.length===1&&e.stopPropagation()},T||(document.addEventListener("touchmove",e=>e.preventDefault()),T=!0)):(_=document.body.style.overflow,document.body.style.overflow="hidden"))},O=o=>{o&&(k?(o.ontouchstart=null,o.ontouchmove=null,document.body.style.position="",document.removeEventListener("touchmove",e=>e.preventDefault()),T=!1):_!==void 0&&(document.body.style.overflow=_,_=void 0))};var u,m=class extends j{constructor(){super();A(this,u,void 0);i(this,"mobileDevice",new d(this,L));i(this,"mobileAndTablet",new d(this,D));this.modal=!1}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(this.modal)return I`
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
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(t){t.preventDefault(),this.dialog?.close(),document.body.classList.remove("merch-modal")}openModal(){this.updateComplete.then(async()=>{M(this.dialog),document.body.classList.add("merch-modal");let t={trigger:g(this,u),notImmediatelyClosable:!0,type:"auto"},s=await window.__merch__spectrum_Overlay.open(this.dialog,t);s.addEventListener("close",()=>{this.modal=!1,document.body.classList.remove("merch-modal"),O(this.dialog)}),this.shadowRoot.querySelector("sp-theme").append(s)})}updated(){this.modal&&this.openModal()}showModal({target:t}){C(this,u,t),this.modal=!0}};u=new WeakMap,i(m,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,attribute:"modal",reflect:!0}}),i(m,"styles",[W`
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
        `,E]);customElements.define("merch-sidenav",m);export{m as MerchSideNav};

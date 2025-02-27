var O=Object.defineProperty;var P=(s,e,t)=>e in s?O(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>(P(s,typeof e!="symbol"?e+"":e,t),t),b=(s,e,t)=>{if(!e.has(s))throw TypeError("Cannot "+t)};var g=(s,e,t)=>(b(s,e,"read from private field"),t?t.call(s):e.get(s)),C=(s,e,t)=>{if(e.has(s))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(s):e.set(s,t)},T=(s,e,t,o)=>(b(s,e,"write to private field"),o?o.call(s,t):e.set(s,t),t);import{html as M,css as W,LitElement as j}from"/libs/deps/lit-all.min.js";var d=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as H}from"/libs/deps/lit-all.min.js";var E=H`
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
`;import{html as U,LitElement as G}from"/libs/deps/lit-all.min.js";function f(s,e){let t;return function(){let o=this,i=arguments;clearTimeout(t),t=setTimeout(()=>s.apply(o,i),e)}}function A(s,e={},t=null,o=null){let i=o?document.createElement(s,{is:o}):document.createElement(s);t instanceof HTMLElement?i.appendChild(t):i.innerHTML=t;for(let[r,a]of Object.entries(e))i.setAttribute(r,a);return i}var y="merch-search:change";var w="merch-sidenav:select";var R="hashchange";function v(s=window.location.hash){let e=[],t=s.replace(/^#/,"").split("&");for(let o of t){let[i,r=""]=o.split("=");i&&e.push([i,decodeURIComponent(r.replace(/\+/g," "))])}return Object.fromEntries(e)}function l(s,e){if(s.deeplink){let t={};t[s.deeplink]=e,F(t)}}function F(s){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(s).forEach(([i,r])=>{r?e.set(i,r):e.delete(i)}),e.sort();let t=e.toString();if(t===window.location.hash)return;let o=window.scrollY||document.documentElement.scrollTop;window.location.hash=t,window.scrollTo(0,o)}function c(s){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let t=v(window.location.hash);s(t)};return e(),window.addEventListener(R,e),()=>{window.removeEventListener(R,e)}}var x=class extends G{get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{l(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=f(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let t=v()[this.deeplink];t&&(this.search.value=t)}startDeeplink(){this.stopDeeplink=c(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return U`<slot></slot>`}};n(x,"properties",{deeplink:{type:String}});customElements.define("merch-search",x);import{html as k,LitElement as B,css as q}from"/libs/deps/lit-all.min.js";var h=class extends B{constructor(){super(),this.handleClickDebounced=f(this.handleClick.bind(this))}selectElement(e,t=!0){e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1),t&&(this.selectedElement=e,this.selectedText=e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(w,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}handleClick({target:e},t=!0){let{value:o,parentNode:i}=e;this.selectElement(e),i?.tagName==="SP-SIDENAV"?(t&&l(this,o),e.selected=!0,i.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(r=>{r.value!==o&&(r.expanded=!1,r.selected=!1)})):i?.tagName==="SP-SIDENAV-ITEM"&&([...i.closest("sp-sidenav")?.querySelectorAll(":scope > sp-sidenav-item")].filter(a=>a!==i).forEach(a=>{a.expanded=!1}),i.closest("sp-sidenav")?.querySelectorAll("sp-sidenav-item[selected]").forEach(a=>{a.value!==o&&(a.selected=!1)}))}selectionChanged({target:{value:e,parentNode:t}}){this.selectElement(this.querySelector(`sp-sidenav-item[value="${e}"]`)),l(this,e)}startDeeplink(){this.stopDeeplink=c(e=>{let t=e[this.deeplink]??"all",o=this.querySelector(`sp-sidenav-item[value="${t}"]`);o&&this.updateComplete.then(()=>{o.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(o.expanded=!0),o.parentNode?.tagName==="SP-SIDENAV-ITEM"&&(o.parentNode.expanded=!0),this.handleClick({target:o},!!window.location.hash.includes("category"))})})}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.deeplink&&this.startDeeplink()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced),this.stopDeeplink?.()}render(){return k`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?k`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};n(h,"properties",{sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}}),n(h,"styles",[q`
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
        `,E]);customElements.define("merch-sidenav-list",h);import{html as $,LitElement as Y,css as K}from"/libs/deps/lit-all.min.js";var p=class extends Y{constructor(){super(),this.selectedValues=[]}selectionChanged({target:e}){let t=e.getAttribute("name");if(t){let o=this.selectedValues.indexOf(t);e.checked&&o===-1?this.selectedValues.push(t):!e.checked&&o>=0&&this.selectedValues.splice(o,1)}l(this,this.selectedValues.join(","))}addGroupTitle(){let e="sidenav-checkbox-group-title",t=A("h3",{id:e});t.textContent=this.sidenavCheckboxTitle,this.prepend(t),this.childNodes.forEach(o=>{o.id&&o.id!==e&&(o.setAttribute("role","group"),o.setAttribute("aria-labelledby",e))})}startDeeplink(){this.stopDeeplink=c(({types:e})=>{if(e){let t=e.split(",");[...new Set([...t,...this.selectedValues])].forEach(o=>{let i=this.querySelector(`sp-checkbox[name=${o}]`);i&&(i.checked=t.includes(o))}),this.selectedValues=t}else this.selectedValues.forEach(t=>{let o=this.querySelector(`sp-checkbox[name=${t}]`);o&&(o.checked=!1)}),this.selectedValues=[]})}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.addGroupTitle(),this.startDeeplink()})}disconnectedCallback(){this.stopDeeplink?.()}render(){return $`<div aria-label="${this.label}">
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};n(p,"properties",{sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}}),n(p,"styles",K`
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
    `);customElements.define("merch-sidenav-checkbox-group",p);var D="(max-width: 700px)";var L="(max-width: 1199px)";var N=/iP(ad|hone|od)/.test(window?.navigator?.platform)||window?.navigator?.platform==="MacIntel"&&window.navigator.maxTouchPoints>1,S=!1,_,I=s=>{s&&(N?(document.body.style.position="fixed",s.ontouchmove=e=>{e.targetTouches.length===1&&e.stopPropagation()},S||(document.addEventListener("touchmove",e=>e.preventDefault()),S=!0)):(_=document.body.style.overflow,document.body.style.overflow="hidden"))},V=s=>{s&&(N?(s.ontouchstart=null,s.ontouchmove=null,document.body.style.position="",document.removeEventListener("touchmove",e=>e.preventDefault()),S=!1):_!==void 0&&(document.body.style.overflow=_,_=void 0))};var u,m=class extends j{constructor(){super();C(this,u,void 0);n(this,"mobileDevice",new d(this,D));n(this,"mobileAndTablet",new d(this,L));this.modal=!1}get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(this.modal)return M`
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
        `}get asAside(){return M`<sp-theme  color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(t){t.preventDefault(),this.dialog?.close(),document.body.classList.remove("merch-modal")}openModal(){this.updateComplete.then(async()=>{I(this.dialog),document.body.classList.add("merch-modal");let t={trigger:g(this,u),notImmediatelyClosable:!0,type:"auto"},o=await window.__merch__spectrum_Overlay.open(this.dialog,t);o.addEventListener("close",()=>{this.modal=!1,document.body.classList.remove("merch-modal"),V(this.dialog)}),this.shadowRoot.querySelector("sp-theme").append(o)})}updated(){this.modal&&this.openModal()}showModal({target:t}){T(this,u,t),this.modal=!0}};u=new WeakMap,n(m,"properties",{sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,attribute:"modal",reflect:!0}}),n(m,"styles",[W`
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
//# sourceMappingURL=merch-sidenav.js.map

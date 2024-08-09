var V=(t,e)=>()=>(t&&(e=t(t=0)),e);function J(t){let{host:e}=window.location,o=h.searchParams.get("env");return o?{...c[o],consumer:t[o]}:e.includes("localhost")?{...c.local,consumer:t.local}:e.includes(`${w}.page`)||e.includes(`${w}.live`)||e.includes("stage.adobe")||e.includes("corp.adobe")||e.includes("graybox.adobe")?{...c.stage,consumer:t.stage}:{...c.prod,consumer:t.prod}}function I(t,e=window.location.pathname){if(!t)return{ietf:"en-US",tk:"hah7vzn.css",prefix:""};let o=e.split("/"),n=o[1],s=t[n]||t[""];if([K,X].includes(n)){let v=Object.keys(t).find(H=>t[H]?.ietf?.startsWith(o[2]));return v&&(s=t[v]),s.prefix=`/${n}/${o[2]}`,s}let a=s.ietf==="en-US";return s.prefix=a?"":`/${n}`,s.region=a?"us":n.split("_")[0],s}function D(t,e=document){let o=t&&t.includes(":")?"property":"name",n=e.head.querySelector(`meta[${o}="${t}"]`);return n&&n.content}function Z(t){window.milo||={},window.milo.deferredPromise=new Promise(e=>{t.resolveDeferred=e})}var N,R,c,K,X,h,w,Q,$e,Ae,M,P=V(()=>{N=[{adobetv:"tv.adobe.com"},{gist:"https://gist.github.com"},{caas:"/tools/caas"},{faas:"/tools/faas"},{fragment:"/fragments/",styles:!1},{instagram:"https://www.instagram.com"},{slideshare:"https://www.slideshare.net",styles:!1},{tiktok:"https://www.tiktok.com",styles:!1},{twitter:"https://twitter.com"},{vimeo:"https://vimeo.com"},{vimeo:"https://player.vimeo.com"},{youtube:"https://www.youtube.com"},{youtube:"https://youtu.be"},{"pdf-viewer":".pdf",styles:!1},{video:".mp4"},{merch:"/tools/ost?"}],R=["accordion","columns","z-pattern"],c={stage:{name:"stage",ims:"stg1",adobeIO:"cc-collab-stage.adobe.io",adminconsole:"stage.adminconsole.adobe.com",account:"stage.account.adobe.com",edgeConfigId:"8d2805dd-85bf-4748-82eb-f99fdad117a6",pdfViewerClientId:"600a4521c23d4c7eb9c7b039bee534a0"},prod:{name:"prod",ims:"prod",adobeIO:"cc-collab.adobe.io",adminconsole:"adminconsole.adobe.com",account:"account.adobe.com",edgeConfigId:"2cba807b-7430-41ae-9aac-db2b0da742d5",pdfViewerClientId:"3c0a5ddf2cc04d3198d9e48efc390fa9"}};c.local={...c.stage,name:"local"};K="langstore",X="target-preview",h=new URL(window.location.href),w=h.hostname.includes(".aem.")?"aem":"hlx";Q=(()=>{let t,e=new Promise(o=>{t=o});return o=>(o!==void 0&&t(o),e)})();[$e,Ae,M]=(()=>{let t={};return[e=>{let o=e.origin||window.location.origin,n=e.pathname||window.location.pathname;t={env:J(e),...e},t.codeRoot=e.codeRoot?`${o}${e.codeRoot}`:o,t.base=t.miloLibs||t.codeRoot,t.locale=n?I(e.locales,n):I(e.locales),t.autoBlocks=e.autoBlocks?[...N,...e.autoBlocks]:N,t.doNotInline=e.doNotInline?[...R,...e.doNotInline]:R;let s=D("content-language")||t.locale.ietf;document.documentElement.setAttribute("lang",s);try{let a=D("content-direction")||t.locale.dir||t.locale.ietf&&new Intl.Locale(t.locale.ietf)?.textInfo?.direction||"ltr";document.documentElement.setAttribute("dir",a)}catch(a){console.log("Invalid or missing locale:",a)}return t.locale.contentRoot=`${o}${t.locale.prefix}${t.contentRoot??""}`,t.useDotHtml=!h.origin.includes(`.${w}.`)&&(e.useDotHtml??h.pathname.endsWith(".html")),t.entitlements=Q,t.consumerEntitlements=e.entitlements||[],Z(t),t},e=>t=e,()=>t]})()});import{html as O,css as ee,LitElement as te}from"/libs/deps/lit-all.min.js";var l=class{constructor(e,o){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(o),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as q}from"/libs/deps/lit-all.min.js";var d=q`
    h2 {
        font-size: 11px;
        font-style: normal;
        font-weight: 500;
        height: 32px;
        letter-spacing: 0.06em;
        padding: 0 12px;
        line-height: 32px;
        color: #747474;
    }
`;import{html as B,LitElement as F}from"/libs/deps/lit-all.min.js";var y="merch-search:change";var x="merch-sidenav:select";function u(t,e){let o;return function(){let n=this,s=arguments;clearTimeout(o),o=setTimeout(()=>t.apply(n,s),e)}}var S="hashchange";function i(t=window.location.hash){let e=[],o=t.replace(/^#/,"").split("&");for(let n of o){let[s,a=""]=n.split("=");s&&e.push([s,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(e)}function r(t,e){if(t.deeplink){let o={};o[t.deeplink]=e,U(o)}}function U(t){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(t).forEach(([s,a])=>{a?e.set(s,a):e.delete(s)}),e.sort();let o=e.toString();if(o===window.location.hash)return;let n=window.scrollY||document.documentElement.scrollTop;window.location.hash=o,window.scrollTo(0,n)}function L(t){let e=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let o=i(window.location.hash);t(o)};return e(),window.addEventListener(S,e),()=>{window.removeEventListener(S,e)}}var p=class extends F{static properties={deeplink:{type:String}};get search(){return this.querySelector("sp-search")}constructor(){super(),this.handleInput=()=>{r(this,this.search.value),this.search.value&&this.dispatchEvent(new CustomEvent(y,{bubbles:!0,composed:!0,detail:{type:"search",value:this.search.value}}))},this.handleInputDebounced=u(this.handleInput.bind(this))}connectedCallback(){super.connectedCallback(),this.search&&(this.search.addEventListener("input",this.handleInputDebounced),this.search.addEventListener("submit",this.handleInputSubmit),this.updateComplete.then(()=>{this.setStateFromURL()}),this.startDeeplink())}disconnectedCallback(){super.disconnectedCallback(),this.search.removeEventListener("input",this.handleInputDebounced),this.search.removeEventListener("submit",this.handleInputSubmit),this.stopDeeplink?.()}setStateFromURL(){let o=i()[this.deeplink];o&&(this.search.value=o)}startDeeplink(){this.stopDeeplink=L(({search:e})=>{this.search.value=e??""})}handleInputSubmit(e){e.preventDefault()}render(){return B`<slot></slot>`}};customElements.define("merch-search",p);import{html as k,LitElement as j,css as z}from"/libs/deps/lit-all.min.js";var f=class extends j{static properties={sidenavListTitle:{type:String},label:{type:String},deeplink:{type:String,attribute:"deeplink"},selectedText:{type:String,reflect:!0,attribute:"selected-text"},selectedValue:{type:String,reflect:!0,attribute:"selected-value"}};static styles=[z`
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
        `,d];constructor(){super(),this.handleClickDebounced=u(this.handleClick.bind(this))}selectElement(e,o=!0){e.parentNode.tagName==="SP-SIDENAV-ITEM"&&this.selectElement(e.parentNode,!1),e.firstElementChild?.tagName==="SP-SIDENAV-ITEM"&&(e.expanded=!0),o&&(this.selectedElement=e,this.selectedText=e.label,this.selectedValue=e.value,setTimeout(()=>{e.selected=!0},1),this.dispatchEvent(new CustomEvent(x,{bubbles:!0,composed:!0,detail:{type:"sidenav",value:this.selectedValue,elt:this.selectedElement}})))}setStateFromURL(){let o=i()[this.deeplink]??"all";if(o){let n=this.querySelector(`sp-sidenav-item[value="${o}"]`);if(!n)return;this.updateComplete.then(()=>{this.selectElement(n)})}}handleClick({target:e}){let{value:o,parentNode:n}=e;this.selectElement(e),n&&n.tagName==="SP-SIDENAV"&&(r(this,o),e.selected=!0,n.querySelectorAll("sp-sidenav-item[expanded],sp-sidenav-item[selected]").forEach(s=>{s.value!==o&&(s.expanded=!1,s.selected=!1)}))}selectionChanged({target:{value:e,parentNode:o}}){this.selectElement(this.querySelector(`sp-sidenav-item[value="${e}"]`)),r(this,e)}connectedCallback(){super.connectedCallback(),this.addEventListener("click",this.handleClickDebounced),this.updateComplete.then(()=>{this.setStateFromURL()})}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("click",this.handleClickDebounced)}render(){return k`<div
            aria-label="${this.label}"
            @change="${e=>this.selectionChanged(e)}"
        >
            ${this.sidenavListTitle?k`<h2>${this.sidenavListTitle}</h2>`:""}
            <slot></slot>
        </div>`}};customElements.define("merch-sidenav-list",f);import{html as W,LitElement as G,css as Y}from"/libs/deps/lit-all.min.js";var g=class extends G{static properties={sidenavCheckboxTitle:{type:String},label:{type:String},deeplink:{type:String},selectedValues:{type:Array,reflect:!0},value:{type:String}};static styles=Y`
        :host {
            display: block;
            contain: content;
            border-top: 1px solid var(--color-gray-200);
            padding: 12px;
        }
        h3 {
            font-size: 14px;
            font-style: normal;
            font-weight: 700;
            height: 32px;
            letter-spacing: 0px;
            padding: 0px;
            line-height: 18.2px;
            color: var(--color-gray-600);
            margin: 0px;
        }
        .checkbox-group {
            display: flex;
            flex-direction: column;
        }
    `;setStateFromURL(){this.selectedValues=[];let{types:e}=i();e&&(this.selectedValues=e.split(","),this.selectedValues.forEach(o=>{let n=this.querySelector(`sp-checkbox[name=${o}]`);n&&(n.checked=!0)}))}selectionChanged(e){let{target:o}=e,n=o.getAttribute("name");if(n){let s=this.selectedValues.indexOf(n);o.checked&&s===-1?this.selectedValues.push(n):!o.checked&&s>=0&&this.selectedValues.splice(s,1)}r(this,this.selectedValues.join(","))}connectedCallback(){super.connectedCallback(),this.updateComplete.then(async()=>{this.setStateFromURL()})}render(){return W`<div aria-label="${this.label}">
            <h3>${this.sidenavCheckboxTitle}</h3>
            <div
                @change="${e=>this.selectionChanged(e)}"
                class="checkbox-group"
            >
                <slot></slot>
            </div>
        </div>`}};customElements.define("merch-sidenav-checkbox-group",g);var C="(max-width: 700px)";var T="(max-width: 1199px)";var $=/iP(ad|hone|od)/.test(window?.navigator?.platform)||window?.navigator?.platform==="MacIntel"&&window.navigator.maxTouchPoints>1,b=!1,m,A=t=>{t&&($?(document.body.style.position="fixed",t.ontouchmove=e=>{e.targetTouches.length===1&&e.stopPropagation()},b||(document.addEventListener("touchmove",e=>e.preventDefault()),b=!0)):(m=document.body.style.overflow,document.body.style.overflow="hidden"))},_=t=>{t&&($?(t.ontouchstart=null,t.ontouchmove=null,document.body.style.position="",document.removeEventListener("touchmove",e=>e.preventDefault()),b=!1):m!==void 0&&(document.body.style.overflow=m,m=void 0))};P();document.addEventListener("sp-opened",()=>{document.body.classList.add("merch-modal")});document.addEventListener("sp-closed",()=>{document.body.classList.remove("merch-modal")});var E=class extends te{static properties={sidenavTitle:{type:String},closeText:{type:String,attribute:"close-text"},modal:{type:Boolean,attribute:"modal",reflect:!0}};#e;constructor(){super(),this.modal=!1}static styles=[ee`
            :host {
                display: block;
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
        `,d];mobileDevice=new l(this,C);mobileAndTablet=new l(this,T);get filters(){return this.querySelector("merch-sidenav-list")}get search(){return this.querySelector("merch-search")}render(){return this.mobileAndTablet.matches?this.asDialog:this.asAside}get asDialog(){if(this.modal)return O`
            <sp-theme theme="spectrum" color="light" scale="medium">
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
        `}get asAside(){return O`<sp-theme theme="spectrum" color="light" scale="medium"
            ><h2>${this.sidenavTitle}</h2>
            <slot></slot
        ></sp-theme>`}get dialog(){return this.shadowRoot.querySelector("sp-dialog-base")}closeModal(e){e.preventDefault(),this.dialog?.close()}openModal(){this.updateComplete.then(async()=>{A(this.dialog);let e={trigger:this.#e,notImmediatelyClosable:!0,type:"auto"},{base:o}=M(),n=await import(`${o}/features/spectrum-web-components/dist/overlay.js`);n.open(this.dialog,e),n.addEventListener("close",()=>{this.modal=!1,_(this.dialog)}),this.shadowRoot.querySelector("sp-theme").append(n)})}updated(){this.modal&&this.openModal()}showModal({target:e}){this.#e=e,this.modal=!0}};customElements.define("merch-sidenav",E);export{E as MerchSideNav};

// branch: MWPW-144805-twp commit: 208bdea01fff769dc4e5ddaadaa91f073105c943 Tue, 26 Mar 2024 16:09:22 GMT
import{LitElement as X,html as y,nothing as Z}from"/libs/deps/lit-all.min.js";function k(r,e,t){return typeof r===e?()=>r:typeof r=="function"?r:t}var g=class{constructor(e,{direction:t,elementEnterAction:s,elements:n,focusInIndex:i,isFocusableElement:a,listenerScope:c}={elements:()=>[]}){this._currentIndex=-1,this._direction=()=>"both",this.directionLength=5,this.elementEnterAction=o=>{},this._focused=!1,this._focusInIndex=o=>0,this.isFocusableElement=o=>!0,this._listenerScope=()=>this.host,this.offset=0,this.recentlyConnected=!1,this.handleFocusin=o=>{if(!this.isEventWithinListenerScope(o))return;this.isRelatedTargetAnElement(o)&&this.hostContainsFocus();let h=o.composedPath(),l=-1;h.find(d=>(l=this.elements.indexOf(d),l!==-1)),this.currentIndex=l>-1?l:this.currentIndex},this.handleFocusout=o=>{this.isRelatedTargetAnElement(o)&&this.hostNoLongerContainsFocus()},this.handleKeydown=o=>{if(!this.acceptsEventCode(o.code)||o.defaultPrevented)return;let h=0;switch(o.code){case"ArrowRight":h+=1;break;case"ArrowDown":h+=this.direction==="grid"?this.directionLength:1;break;case"ArrowLeft":h-=1;break;case"ArrowUp":h-=this.direction==="grid"?this.directionLength:1;break;case"End":this.currentIndex=0,h-=1;break;case"Home":this.currentIndex=this.elements.length-1,h+=1;break}o.preventDefault(),this.direction==="grid"&&this.currentIndex+h<0?this.currentIndex=0:this.direction==="grid"&&this.currentIndex+h>this.elements.length-1?this.currentIndex=this.elements.length-1:this.setCurrentIndexCircularly(h),this.elementEnterAction(this.elements[this.currentIndex]),this.focus()},this.mutationObserver=new MutationObserver(()=>{this.handleItemMutation()}),this.host=e,this.host.addController(this),this._elements=n,this.isFocusableElement=a||this.isFocusableElement,this._direction=k(t,"string",this._direction),this.elementEnterAction=s||this.elementEnterAction,this._focusInIndex=k(i,"number",this._focusInIndex),this._listenerScope=k(c,"object",this._listenerScope)}get currentIndex(){return this._currentIndex===-1&&(this._currentIndex=this.focusInIndex),this._currentIndex-this.offset}set currentIndex(e){this._currentIndex=e+this.offset}get direction(){return this._direction()}get elements(){return this.cachedElements||(this.cachedElements=this._elements()),this.cachedElements}set focused(e){e!==this.focused&&(this._focused=e)}get focused(){return this._focused}get focusInElement(){return this.elements[this.focusInIndex]}get focusInIndex(){return this._focusInIndex(this.elements)}isEventWithinListenerScope(e){return this._listenerScope()===this.host?!0:e.composedPath().includes(this._listenerScope())}handleItemMutation(){if(this._currentIndex==-1||this.elements.length<=this._elements().length)return;let e=this.elements[this.currentIndex];if(this.clearElementCache(),this.elements.includes(e))return;let t=this.currentIndex!==this.elements.length,s=t?1:-1;t&&this.setCurrentIndexCircularly(-1),this.setCurrentIndexCircularly(s),this.focus()}update({elements:e}={elements:()=>[]}){this.unmanage(),this._elements=e,this.clearElementCache(),this.manage()}focus(e){let t=this.elements;if(!t.length)return;let s=t[this.currentIndex];(!s||!this.isFocusableElement(s))&&(this.setCurrentIndexCircularly(1),s=t[this.currentIndex]),s&&this.isFocusableElement(s)&&s.focus(e)}clearElementCache(e=0){this.mutationObserver.disconnect(),delete this.cachedElements,this.offset=e,requestAnimationFrame(()=>{this.elements.forEach(t=>{this.mutationObserver.observe(t,{attributes:!0})})})}setCurrentIndexCircularly(e){let{length:t}=this.elements,s=t,n=(t+this.currentIndex+e)%t;for(;s&&this.elements[n]&&!this.isFocusableElement(this.elements[n]);)n=(t+n+e)%t,s-=1;this.currentIndex=n}hostContainsFocus(){this.host.addEventListener("focusout",this.handleFocusout),this.host.addEventListener("keydown",this.handleKeydown),this.focused=!0}hostNoLongerContainsFocus(){this.host.addEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown),this.focused=!1}isRelatedTargetAnElement(e){let t=e.relatedTarget;return!this.elements.includes(t)}acceptsEventCode(e){if(e==="End"||e==="Home")return!0;switch(this.direction){case"horizontal":return e==="ArrowLeft"||e==="ArrowRight";case"vertical":return e==="ArrowUp"||e==="ArrowDown";case"both":case"grid":return e.startsWith("Arrow")}}manage(){this.addEventListeners()}unmanage(){this.removeEventListeners()}addEventListeners(){this.host.addEventListener("focusin",this.handleFocusin)}removeEventListeners(){this.host.removeEventListener("focusin",this.handleFocusin),this.host.removeEventListener("focusout",this.handleFocusout),this.host.removeEventListener("keydown",this.handleKeydown)}hostConnected(){this.recentlyConnected=!0,this.addEventListeners()}hostDisconnected(){this.mutationObserver.disconnect(),this.removeEventListeners()}hostUpdated(){this.recentlyConnected&&(this.recentlyConnected=!1,this.elements.forEach(e=>{this.mutationObserver.observe(e,{attributes:!0})}))}};var x=class extends g{constructor(){super(...arguments),this.managed=!0,this.manageIndexesAnimationFrame=0}set focused(e){e!==this.focused&&(super.focused=e,this.manageTabindexes())}get focused(){return super.focused}clearElementCache(e=0){cancelAnimationFrame(this.manageIndexesAnimationFrame),super.clearElementCache(e),this.managed&&(this.manageIndexesAnimationFrame=requestAnimationFrame(()=>this.manageTabindexes()))}manageTabindexes(){this.focused?this.updateTabindexes(()=>({tabIndex:-1})):this.updateTabindexes(e=>({removeTabIndex:e.contains(this.focusInElement)&&e!==this.focusInElement,tabIndex:e===this.focusInElement?0:-1}))}updateTabindexes(e){this.elements.forEach(t=>{let{tabIndex:s,removeTabIndex:n}=e(t);if(!n){t.tabIndex=s;return}t.removeAttribute("tabindex");let i=t;i.requestUpdate&&i.requestUpdate()})}manage(){this.managed=!0,this.manageTabindexes(),super.manage()}unmanage(){this.managed=!1,this.updateTabindexes(()=>({tabIndex:0})),super.unmanage()}hostUpdated(){super.hostUpdated(),this.host.hasUpdated||this.manageTabindexes()}};var E="merch",p="hidden",T="wcms:commerce:ready",L="wcms-commerce";var A=(r,e,{bubbles:t=!0,cancelable:s,composed:n,detail:i}={})=>window.setTimeout(()=>r?.dispatchEvent(new CustomEvent(e,{bubbles:t,cancelable:s,composed:n,detail:i})));function S(...r){let[e,...t]=r;if(!e)return null;let s=e.parentElement;if(!t.length)return s;for(;s;){if(t.every(n=>s.contains(n)))return s;s=s.parentElement}return null}function v(r){if(r.isInlinePrice){let{template:e}=r.dataset;if(e==="price"||!e)return!0}return!1}var _=(r,e)=>r.flatMap(t=>t?.split?.(/\W+/g)).filter((t,s)=>t&&(s>0||t!==E)).join(e),O=(...r)=>`${E}-${_(r,"-")}`,N=(...r)=>`${E}:${_(r,":")}`;function w(r,e=()=>!0){let t=0;for(let s of r.values())s.container?.classList.toggle(p,!e(s,t++))}var u="failed",f="pending",m="resolved",b=class{#t={};#n={};#e;#i;constructor(e,{cssPrefix:t,eventOptions:s={},eventPrefix:n}={}){this.#i=e;let i=this.#n;i.cssClassNames={},i.eventOptions=s,i.eventTypeNames={};for(let a of[u,f,m])i.cssClassNames[a]=O(t,a),i.eventTypeNames[a]=N(n,a);this.init()}#s(){let[e,{cssClassNames:t,eventOptions:s,eventTypeNames:n},i,a]=[this.#t,this.#n,this.#e,this.#i];[u,f,m].forEach(c=>{a.classList.toggle(t[c],c===i)}),A(a,n[i],{...s,detail:e})}get error(){return this.#t.error}get options(){return this.#n}get promise(){return new Promise((e,t)=>{this.subscribe(e,t)})}get state(){return this.#e}init(){return this.#e!==f?(this.#e=f,this.#s(),!0):!1}reject(e){return this.#e!==f?!1:(this.#t.error=e,this.#e=u,this.#s(),!0)}async resolve(e){return this.#e!==f?!1:(this.#t.value=e==null?void 0:await e,this.#e=m,this.#s(),!0)}subscribe(e,t=()=>{},s=!1){let[n,{eventTypeNames:i},a,c]=[this.#t,this.#n,this.#e,this.#i];if(m===a)return e(n.value,c),()=>{};if(u===a)return t?.(n.error,c),()=>{};let o=s?{once:!0}:void 0,h=d=>t(n.error,d.target),l=d=>e(n.value,d.target);return c.addEventListener(i[u],h,o),c.addEventListener(i[m],l,o),()=>{c.removeEventListener(i[u],h),c.removeEventListener(i[m],l)}}static FAILED=u;static PENDING=f;static RESOLVED=m};var z="UNKNOWN";async function W(r,e,t){let s=new Map;await Promise.allSettled(t.map(i=>i.onceSettled()));let n=0;for(let i of t){if(!e.filterPlaceholder(i,n++))continue;let a=i?.value??[];for(let{planType:c=z}of a){let o=s.get(c)??{checkoutLinks:[],inlinePrices:[],planType:c,get container(){let{checkoutLinks:h,inlinePrices:l}=o,d=S(...h,...l);if(d?.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_CONTAINS)return d}};i.isCheckoutLink?o.checkoutLinks.push(i):i.isInlinePrice&&o.inlinePrices.push(i),s.set(c,o)}}n=0;for(let i of s.values())e.filterOffer(i,n++)||s.delete(i.planType);return s}function H(r,{once:e=!1}={}){let{head:t}=document,s=null;function n(){let i=t.querySelector(L);i!==s&&(s=i,i&&r(i))}return t.addEventListener(T,n,{once:e}),window.setTimeout(n),()=>t.removeEventListener(T,n)}function P(r,e){return class extends r{#t=new b(this,{cssPrefix:e,eventPrefix:e});#n;#e;#i;#s;#o;#r;#c(s){let{offers:n}=this;if(!n)return;let i=n.get(s)??n.get(s?.planType);if(i===this.#r)return;let a=this.#r;this.#r=i,this.requestUpdate("selected",a),this.log?.debug("Selected:",{selected:this.selected?.planType,element:this})}get commerce(){return this.#n}get control(){return this.#t}get log(){return this.#i}get offers(){return this.#s}get resolveComplete(){return this.#t.promise}get selected(){return this.#r}set selected(s){this.#o=s,this.#c(s)}connectedCallback(){super.connectedCallback(),this.#e=H(s=>{let n=[this.#n,this.#i,this.#s];this.#n=s,this.#i=s.Log.module(e),this.#s=void 0,this.#i.debug("Connected:",{element:this}),this.requestUpdate("commerce",n[0]),this.requestUpdate("log",n[1]),this.requestUpdate("offers",n[2])})}disconnectedCallback(){this.#i.debug("Disconnected:",{element:this}),super.disconnectedCallback(),this.#e?.()}filterOffer(s,n){return!0}filterPlaceholder(s,n){return!0}async discoverOffers(s){this.#t.init();let n=[],{commerce:i}=this;if(i){let{CheckoutLink:c,InlinePrice:o}=i;n.push(...c.getCheckoutLinks(s),...o.getInlinePrices(s)),this.log.debug("Discovering offers:",{container:s,element:this})}let a=this.#s;try{let c=await W(s,this,n);this.#s=c,this.requestUpdate("offers",a),this.#c(this.#o)}catch(c){this.#t.reject(c)}}}}import{css as V}from"/libs/deps/lit-all.min.js";var $=V`
    :host {
        background-color: #f5f5f5;
        border-radius: var(--consonant-merch-spacing-xs);
        display: block;
        padding: var(--consonant-merch-spacing-xs);
    }

    #footer {
        justify-content: space-between;
        display: flex;
        grid-area: footer;
        order: 4;
    }
    #footer:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #header {
        grid-area: header;
        order: 1;
        outline: none;
        padding: 0 0.25em;
    }
    #header:focus-visible {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #offers {
        grid-area: offers;
        order: 2;
    }
    #offers:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #panel {
        display: grid;
        gap: var(--consonant-merch-spacing-xs);
        grid-template-areas:
            'header'
            'offers'
            'stock'
            'footer';
    }

    #spinner {
        display: flex;
        justify-content: center;
    }

    #stock {
        grid-area: stock;
        order: 3;
    }
    #stock:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    input[type='radio'] {
        height: 0;
        outline: none;
        position: absolute;
        width: 0;
        z-index: -1;
    }

    label {
        background-color: white;
        border: 1px solid transparent;
        border-radius: var(--consonant-merch-spacing-xxxs);
        cursor: pointer;
        display: block;
        margin: var(--consonant-merch-spacing-xs) 0;
        padding: var(--consonant-merch-spacing-xs);
        position: relative;
    }

    label:hover {
        box-shadow: var(--merch-hovered-shadow);
    }

    input:checked + label {
        box-shadow: var(--merch-selected-shadow);
    }

    .condition-icon {
        background-position: center;
        background-size: contain;
        background: var(--info-icon) no-repeat;
        content: '';
        color: #6e6e6e;
        display: inline-block;
        height: 1.1em;
        margin-bottom: -3px;
        width: 1.1em;
    }

    ::slotted([slot$='-commitment']) {
    }

    ::slotted([slot$='-condition']) {
        display: inline-block;
        font-style: italic;
    }

    ::slotted([slot$='-plan']) {
        font-weight: 700;
    }
`;import{LitElement as J,html as D}from"/libs/deps/lit-all.min.js";import{css as Y}from"/libs/deps/lit-all.min.js";var F=Y`
    #label {
        align-items: center;
        cursor: pointer;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxxs);
        white-space: nowrap;
    }

    #label.icon::before {
        background-position: center;
        background-size: contain;
        background: var(--secure-icon) no-repeat;
        content: '';
        display: inline-block;
        height: 1em;
        width: 1em;
    }
`;var Q="merch-secure-transaction",I=class extends J{static properties={labelText:{attribute:"label",type:String},showIcon:{attribute:"icon",type:Boolean},tooltipText:{attribute:"tooltip",type:String}};static styles=[F];labelText="";showIcon=!0;tooltipText="";render(){let{labelText:e,showIcon:t,tooltipText:s}=this,n=D`
            <div class="${t?"icon":""}" id="label" slot="trigger">
                ${e}
            </div>
        `;return s?D`
            <overlay-trigger placement="top-start" offset="4">
                ${n}
                <sp-tooltip id="tooltip" slot="hover-content" delayed
                    >${s}</sp-tooltip
                >
            </overlay-trigger>
        `:n}};window.customElements.define(Q,I);var K="commitment",B="condition",j="condition-tooltip",U="footer",ee="header",R="offer",q="stock",te=[K,B,j],se=["card","checkout","commerce","offers","selected"],G="merch-subscription-panel",M="merch-stock",C=class extends P(X,G){#t=!1;#n;#e;#i=new x(this,{direction:"vertical",elements:()=>[...this.shadowRoot.querySelectorAll('input[type="radio"]')],listenerScope:()=>this.shadowRoot.querySelector("#offers")});#s;#o;async#r(){let{checkout:e,selected:t}=this;if(!e||(e.classList.toggle(p,!t),!t))return;let{options:s}=t.inlinePrices.find(v);if(this.#o){let n=this.#s;await n.resolveComplete;let i=n.selected.inlinePrices.find(v);e.updateOptions({...s,wcsOsi:s.wcsOsi.concat(i?.options?.wcsOsi??[])})}else e.updateOptions(s);this.control.resolve(e.onceSettled())}#c(){let{selected:e}=this;if(e){let t=this.shadowRoot.getElementById(e.planType);t.checked=!0;let s=this.getElementsByTagName(M)[0];s&&(s.selected=e),w(this.offers,n=>n===e)}else this.selected=this.offers?.values().next().value}#h(){let{offers:e}=this;if(!e){this.selected=void 0;return}this.selected=this.offers.values().next().value,w(e,(t,s)=>s===0);for(let t of e.values()){let s=this.querySelector(`template[name="${t.planType}"]`);s&&te.forEach(i=>{this.#a(`${t.planType}-${i}`,s.content.querySelectorAll(`[slot="${i}"]`),!0)});let n=t.container?.cloneNode(!0);n&&(n.classList.remove(p),this.#a(`${t.planType}-${R}`,[n]))}}#a(e,t,s=!1){this.querySelectorAll(`[slot="${e}"]`).forEach(n=>n.remove()),t.forEach(n=>{n&&(s&&(n=n.cloneNode(!0)),n.slot=e,this.appendChild(n))})}get card(){return this.#n}set card(e){this.#n!==e&&(this.#n=e,this.offers?.clear(),this.selected=void 0,e&&(this.log?.debug("Bound to card:",{card:e,element:this}),this.discoverOffers(e)))}get checkout(){return this.#e}get stock(){return this.#o?this.#s:void 0}set stock(e){this.#o=!!e}get offersSection(){let e=[];for(let{planType:t}of this.offers.values()){if(!this.querySelector(`template[name="${t}"]`))continue;let s=()=>{this.selected=t},n=y`<div>
                <input
                    autocomplete="off"
                    ?checked="${this.selected?.planType===t}"
                    @change="${s}"
                    id="${t}"
                    name="offer"
                    type="radio"
                    value="${t}"
                />
                <label for="${t}">
                    <slot name="${t}-${K}"></slot>
                    <slot name="${t}-${R}"></slot>
                    <slot name="${t}-${B}"></slot>
                    <overlay-trigger placement="top" offset="4">
                        <span class="condition-icon" slot="trigger"></span>
                        <sp-tooltip slot="hover-content" delayed
                            ><slot
                                name="${t}-${j}"
                            ></slot
                        ></sp-tooltip>
                    </overlay-trigger>
                </label>
            </div> `;e.push(n)}return e}get stockSection(){if(!this.#s?.offers.size)return Z;let t=()=>{let s=this.stock;this.stock=!s,this.log?.debug("Stock:",{stock:this.stock,element:this}),this.requestUpdate("stock",s)};return y`<sp-field-group>
            <sp-checkbox
                ?checked=${!!this.#o}
                size="m"
                @click=${t}
            >
                <slot name="${q}"></slot>
            </sp-checkbox>
        </sp-field-group>`}get listLayout(){let e=()=>{let t=this.shadowRoot.querySelector(`slot[name="${U}"]`);if(t){let s=t.assignedElements({flatten:!0}).filter(n=>n.isCheckoutLink)[0];this.#e!==s&&(this.#e=s,this.requestUpdate("checkout"))}};return y`
            <div id="panel">
                <div id="header" tabindex="0">
                    <slot name="${ee}"></slot>
                </div>
                <div id="offers">${this.offersSection}</div>
                <div id="stock">${this.stockSection}</div>
                <div id="footer">
                    <slot
                        name="${U}"
                        @slotchange=${e}
                    ></slot>
                </div>
            </div>
        `}get waitLayout(){return y`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="spinner">
                    <sp-progress-circle indeterminate size="l" />
                </div>
            </sp-theme>
        `}filterOffer(e){return e.inlinePrices.some(v)}render(){return this.card&&this.offers?this.listLayout:this.waitLayout}updated(e){let t=this,{card:s,checkout:n,commerce:i,log:a,offers:c}=this;if(e.has("card")||e.has("checkout")||e.has("commerce")||e.has("offers")){if(s&&n&&i&&c&&!this.#t){let o=document.querySelector(M)?.cloneNode(!0);o&&(o.selected=this.selected,this.#s=o),this.#a(q,[o]),this.#t=!0,a.debug("Activated:",{card:s,offers:c,checkout:n,element:t,stock:o})}else a?.debug("Updated:",()=>({...Object.fromEntries([...e.entries()].map(([o,h])=>[o,{new:this[o],old:h}])),element:t}));this.#t&&!(s&&n&&c)&&(this.#t=!1)}e.has("offers")&&this.#h(),e.has("selected")&&(this.#c(),this.#r()),(e.has("checkout")||e.has("stock"))&&this.#r()}requestUpdate(e,...t){super.requestUpdate(e,...t),this.isUpdatePending&&se.includes(e)&&this.control.init()}static styles=[$]};window.customElements.define(G,C);export{te as OFFER_SLOTS,K as SLOT_COMMITMENT,B as SLOT_CONDITION,j as SLOT_CONDITION_TOOLTIP,U as SLOT_FOOTER,ee as SLOT_HEADER,R as SLOT_OFFER,q as SLOT_STOCK,C as SubscriptionPanel};
//# sourceMappingURL=merch-subscription-panel.js.map

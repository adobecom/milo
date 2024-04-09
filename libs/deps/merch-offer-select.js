// branch: MWPW-136871 commit: f15c69b383c74849757c19e957a6fd572b8aeaa9 Mon, 08 Apr 2024 19:08:31 GMT
var a=(n,e)=>()=>(n&&(e=n(n=0)),e);var c,g,p=a(()=>{r();i();c="merch-offer:ready",g="merch-offer-select:ready"});import{css as S,html as y,LitElement as O}from"/libs/deps/lit-all.min.js";var m,i=a(()=>{p();m=class extends O{static styles=S`
        :host .horizontal {
            display: flex;
            flex-direction: row;
        }
    `;static properties={offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String},planType:{type:String,attribute:"plan-type",reflect:!0}};constructor(){super(),this.defaults={}}saveContainerDefaultValues(){let e=this.closest(this.getAttribute("container")),t=e?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),s=e?.badgeText;return{description:t,badgeText:s}}getSlottedElement(e,t){return(t||this.closest(this.getAttribute("container"))).querySelector(`[slot="${e}"]:not(merch-offer > *)`)}updateSlot(e,t){let s=this.getSlottedElement(e,t);if(!s)return;let o=this.selectedOffer.getOptionValue(e)?this.selectedOffer.getOptionValue(e):this.defaults[e];o&&s.replaceWith(o.cloneNode(!0))}handleOfferSelection(e){let t=e.detail;this.selectOffer(t)}handleOfferSelectionByQuantity(e){let t=e.detail.option,s=Number.parseInt(t),o=this.findAppropriateOffer(s);this.selectOffer(o),this.getSlottedElement("cta").setAttribute("data-quantity",t)}selectOffer(e){if(!e)return;let t=this.selectedOffer;t&&(t.selected=!1),this.selectedOffer=e,this.updateContainer()}findAppropriateOffer(e){let t=null;return this.offers.find(o=>{let f=Number.parseInt(o.getAttribute("value"));if(f===e)return!0;if(f>e)return!1;t=o})||t}updateBadgeText(e){this.selectedOffer.badgeText===""?e.badgeText=null:this.selectedOffer.badgeText?e.badgeText=this.selectedOffer.badgeText:e.badgeText=this.defaults.badgeText}updateContainer(){let e=this.closest(this.getAttribute("container"));!e||!this.selectedOffer||(this.updateSlot("cta",e),this.updateSlot("secondary-cta",e),this.updateSlot("price",e),!this.manageableMode&&(this.updateSlot("description",e),this.updateBadgeText(e)))}render(){return this.variant?y`<slot class="${this.variant}"></slot>`:y`<slot></slot>`}connectedCallback(){super.connectedCallback(),this.addEventListener(c,this.offerSelectReady);let e=this.closest("merch-quantity-select");this.manageableMode=e,this.offers=[...this.querySelectorAll("merch-offer")],this.manageableMode?e.addEventListener("change",t=>this.handleOfferSelectionByQuantity(t)):(this.defaults=this.saveContainerDefaultValues(),this.addEventListener("offer-selected",this.handleOfferSelection)),this.updateContainer()}disconnectedCallback(){this.removeEventListener("offer-selected",this.handleOfferSelection),this.removeEventListener("change",this.handleOfferSelectionByQuantity),this.removeEventListener(c,this.offerSelectReady)}get price(){return this.querySelector('[is="inline-price"]')}get segments(){let{value:[{customerSegment:e,marketSegments:[t]}]}=this.price;return{customerSegment:e,marketSegment:t}}async offerSelectReady(){this.querySelector("merch-offer:not([plan-type])")||(this.planType=this.offers[0].planType,await this.updateComplete,this.offers[0].select(),this.dispatchEvent(new CustomEvent(g,{bubbles:!0})))}};customElements.define("merch-offer-select",m)});import{css as R}from"/libs/deps/lit-all.min.js";var E,v=a(()=>{r();i();E=R`
    :host {
        --merch-radio: rgba(82, 88, 228);
        --merch-radio-hover: rgba(64, 70, 202);
        --merch-radio-down: rgba(50, 54, 168);
        --merch-radio-selected: rgb(2, 101, 220);
        --merch-hovered-shadow: 0 0 0 1px #aaa;
        --merch-selected-shadow: 0 0 0 2px var(--merch-radio-selected);
    }
    .merch-Radio {
        align-items: flex-start;
        display: flex;
        max-inline-size: 100%;
        margin-inline-end: 19px;
        min-block-size: 32px;
        position: relative;
        vertical-align: top;
    }

    .merch-Radio-input {
        block-size: 100%;
        box-sizing: border-box;
        cursor: pointer;
        font-family: inherit;
        font-size: 100%;
        inline-size: 100%;
        line-height: 1.3;
        margin: 0;
        opacity: 0;
        overflow: visible;
        padding: 0;
        position: absolute;
        z-index: 1;
    }

    .merch-Radio-button {
        block-size: 14px;
        box-sizing: border-box;
        flex-grow: 0;
        flex-shrink: 0;
        inline-size: 14px;
        margin-block-start: 9px;
        position: relative;
    }

    .merch-Radio-button:before {
        border-color: rgb(109, 109, 109);
        border-radius: 50%;
        border-style: solid;
        border-width: 2px;
        box-sizing: border-box;
        content: '';
        display: block;
        height: 14px;
        position: absolute;
        transition: border 0.13s ease-in-out, box-shadow 0.13s ease-in-out;
        width: 14px;
        z-index: 0;
    }

    .merch-Radio-button:after {
        border-radius: 50%;
        content: '';
        display: block;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        transition: opacity 0.13s ease-out, margin 0.13s ease-out;
    }

    :host(:active) .merch-Radio-button:before {
        border-color: var(--merch-radio-down);
    }

    :host(:hover) .merch-Radio-button:before {
        border-color: var(--merch-radio-hover);
    }

    :host([selected]) .merch-Radio-button::before {
        border-color: var(--merch-radio-selected);
        border-width: 5px;
    }

    .merch-Radio-label {
        color: rgb(34, 34, 34);
        font-size: 14px;
        line-height: 18.2px;
        margin-block-end: 9px;
        margin-block-start: 6px;
        margin-inline-start: 10px;
        text-align: start;
        transition: color 0.13s ease-in-out;
    }

    .merch-Div-input {
        height: 0;
        outline: none;
        position: absolute;
        width: 0;
        z-index: -1;
    }

    .merch-Div-label {
        background-color: white;
        border: 1px solid transparent;
        border-radius: var(--consonant-merch-spacing-xxxs);
        cursor: pointer;
        display: block;
        margin: var(--consonant-merch-spacing-xs) 0;
        padding: var(--consonant-merch-spacing-xs);
        position: relative;
    }

    .merch-Div-label:hover {
        box-shadow: var(--merch-hovered-shadow);
    }

    :host([selected]) .merch-Div-label {
        box-shadow: var(--merch-selected-shadow);
    }

    .merch-Div .condition-icon {
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

    ::slotted([slot='commitment']) {
    }

    ::slotted([slot='condition']) {
        display: inline-block;
        font-style: italic;
    }

    .merch-Div-label span[is='inline-price'] {
        font-weight: 700;
    }
`});var x=a(()=>{r();i();p()});import{html as T,LitElement as _}from"/libs/deps/lit-all.min.js";var l,d,h,b,r=a(()=>{v();x();p();l="commitment",d="condition",h="condition-tooltip",b=class extends _{static properties={text:{type:String},selected:{type:Boolean,reflect:!0},badgeText:{type:String,attribute:"badge-text"},type:{type:String},offer:{type:HTMLElement},planType:{type:String,attribute:"plan-type",reflect:!0}};static styles=[E];#e;select(){this.selected||(this.selected=!0,this.dispatchEvent(new CustomEvent("offer-selected",{detail:this,bubbles:!0})))}constructor(){super(),this.selected=!1,this.type="radio",this.offer=null,this.planType=null,this.addEventListener("click",e=>{this.select()}),this.addEventListener("keyup",e=>{(e.key==="Enter"||e.key===" ")&&this.select()})}getOptionValue(e){return this[e]||(this[e]=this.querySelector(`[slot="${e}"]`)),this[e]}connectedCallback(){super.connectedCallback(),this.initOffer(),this.configuration=this.closest("quantity-selector"),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio"),!this.hasAttribute("aria-checked")&&!this.configuration&&this.setAttribute("aria-checked",this.selected)}updated(e){e.has("selected")&&this.setAttribute("aria-checked",this.selected)}renderRadio(){return T` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`}renderDiv(){return this.#e||(this.#e=this.parentNode?.querySelector(`template[name="${this.planType}"]`)?.content?.cloneNode(!0),this.append(this.#e)),T`<div class="merch-Div">
            <input
                autocomplete="off"
                ?checked="${this.selected}"
                id="${this.planType}"
                name="offer"
                type="radio"
                value="${this.planType}"
                class="merch-Div-input"
            />
            <label class="merch-Div-label" for="${this.planType}">
                <slot name="${l}"></slot>
                ${this.offer}
                <slot name="${d}"></slot>
                <overlay-trigger placement="top" offset="4">
                    <span class="condition-icon" slot="trigger"></span>
                    <sp-tooltip slot="hover-content" delayed
                        ><slot
                            name="${this.planType}-${h}"
                        ></slot
                    ></sp-tooltip>
                </overlay-trigger>
            </label>
        </div> `}render(){return this.configuration||!this.offer?"":this.type&&this.type=="div"?this.renderDiv():this.renderRadio()}get price(){return this.querySelector('span[is="inline-price"]')}async initOffer(){await this.updateComplete,await this.price.onceSettled();let{value:[e]}=this.price;this.offer=this.price,this.planType=e.planType,await this.updateComplete,this.dispatchEvent(new CustomEvent(c,{bubbles:!0}))}};customElements.define("merch-offer",b)});r();i();
//# sourceMappingURL=merch-offer-select.js.map

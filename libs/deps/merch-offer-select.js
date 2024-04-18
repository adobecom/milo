// branch: MWPW-138927-3 commit: dc1f6495255c4eb9d68f6f3b5f688547db576695 Thu, 18 Apr 2024 09:02:40 GMT
import{html as h,LitElement as E}from"/libs/deps/lit-all.min.js";import{css as u,html as b,LitElement as m}from"/libs/deps/lit-all.min.js";var o="merch-offer:ready",d="merch-offer-select:ready";var s="merch-offer:selected";var a="merch-quantity-selector:change";var l=class extends m{static styles=u`
        :host .horizontal {
            display: flex;
            flex-direction: row;
        }

        fieldset {
            display: contents;
        }

        :host([variant='subscription-options']) {
            display: flex;
            flex-direction: column;
            gap: var(--consonant-merch-spacing-xs);
        }
    `;static properties={offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String,attribute:"variant",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},stock:{type:Boolean,reflect:!0}};variant="plans";constructor(){super(),this.defaults={}}saveContainerDefaultValues(){let e=this.closest(this.getAttribute("container")),t=e?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),i=e?.badgeText;return{description:t,badgeText:i}}getSlottedElement(e,t){return(t||this.closest(this.getAttribute("container"))).querySelector(`[slot="${e}"]:not(merch-offer > *)`)}updateSlot(e,t){let i=this.getSlottedElement(e,t);if(!i)return;let r=this.selectedOffer.getOptionValue(e)?this.selectedOffer.getOptionValue(e):this.defaults[e];r&&i.replaceWith(r.cloneNode(!0))}handleOfferSelection(e){let t=e.detail;this.selectOffer(t)}handleOfferSelectionByQuantity(e){let t=e.detail.option,i=Number.parseInt(t),r=this.findAppropriateOffer(i);this.selectOffer(r),this.getSlottedElement("cta").setAttribute("data-quantity",t)}selectOffer(e){if(!e)return;let t=this.selectedOffer;t&&(t.selected=!1),this.selectedOffer=e,this.updateContainer()}findAppropriateOffer(e){let t=null;return this.offers.find(r=>{let n=Number.parseInt(r.getAttribute("value"));if(n===e)return!0;if(n>e)return!1;t=r})||t}updateBadgeText(e){this.selectedOffer.badgeText===""?e.badgeText=null:this.selectedOffer.badgeText?e.badgeText=this.selectedOffer.badgeText:e.badgeText=this.defaults.badgeText}updateContainer(){let e=this.closest(this.getAttribute("container"));!e||!this.selectedOffer||(this.updateSlot("cta",e),this.updateSlot("secondary-cta",e),this.updateSlot("price",e),!this.manageableMode&&(this.updateSlot("description",e),this.updateBadgeText(e)))}render(){return b`<fieldset><slot class="${this.variant}"></slot></fieldset>`}connectedCallback(){super.connectedCallback(),this.addEventListener(o,this.handleOfferSelectReady);let e=this.closest("merch-quantity-select");this.manageableMode=e,this.offers=[...this.querySelectorAll("merch-offer")],this.manageableMode?e.addEventListener(a,t=>this.handleOfferSelectionByQuantity(t)):(this.defaults=this.saveContainerDefaultValues(),this.addEventListener(s,this.handleOfferSelection)),this.updateContainer(),this.handleOfferSelectReady()}disconnectedCallback(){this.removeEventListener(s,this.handleOfferSelection),this.removeEventListener(a,this.handleOfferSelectionByQuantity),this.removeEventListener(o,this.handleOfferSelectReady)}get price(){return this.querySelector('[is="inline-price"]')}get customerSegment(){return this.selectedOffer?.customerSegment}get marketSegment(){return this.selectedOffer?.marketSegment}handleOfferSelectReady(){this.planType||this.querySelector("merch-offer:not([plan-type])")||this.initSelectedOffer()}async initSelectedOffer(){let e=this.querySelector("merch-offer[plan-type][aria-selected]")??this.querySelector("merch-offer[plan-type]");e&&(this.planType=e.planType,e.select(),this.selectedOffer=e,await this.updateComplete,this.dispatchEvent(new CustomEvent(d,{bubbles:!0})))}};customElements.define("merch-offer-select",l);import{css as g}from"/libs/deps/lit-all.min.js";var p=g`
    :host {
        --merch-radio: rgba(82, 88, 228);
        --merch-radio-hover: rgba(64, 70, 202);
        --merch-radio-down: rgba(50, 54, 168);
        --merch-radio-selected: rgb(2, 101, 220);
        --merch-hovered-shadow: 0 0 0 1px #aaa;
        --merch-selected-shadow: 0 0 0 2px var(--merch-radio-selected);
        box-sizing: border-box;
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

    :host([aria-selected]) .merch-Radio-button::before {
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

    input {
        height: 0;
        outline: none;
        position: absolute;
        width: 0;
        z-index: -1;
    }

    .label {
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

    :host([aria-selected]) label {
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

    ::slotted(p),
    ::slotted(h5) {
        margin: 0;
    }

    ::slotted([slot='commitment']) {
        font-size: 14px;
        line-height: 17px;
    }

    #condition {
        line-height: 15px;
    }

    ::slotted([slot='condition']) {
        display: inline-block;
        font-style: italic;
        font-size: 12px;
    }

    ::slotted([slot='teaser']) {
        color: #2d9d78;
        font-size: 14px;
        font-weight: bold;
        line-height: 17px;
    }

    :host([type='subscription-option']) slot[name='price'] {
        display: flex;
        flex-direction: row-reverse;
        align-self: baseline;
        gap: 6px;
    }

    ::slotted(span[is='inline-price']) {
        font-size: 16px;
        font-weight: bold;
        line-height: 24px;
    }

    ::slotted(span[data-template='strikethrough']) {
        font-weight: normal;
    }

    :host([type='subscription-option']) {
        background-color: #fff;
        box-sizing: border-box;
        border-width: 2px;
        border-radius: 5px;
        border-style: solid;
        border-color: #eaeaea;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        min-height: 102px;
    }

    :host([type='subscription-option']:hover) {
        border-color: #cacaca;
    }

    :host([type='subscription-option'][aria-selected]) {
        border-color: #1473e6;
    }

    :host([type='subscription-option']) #condition {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    :host([type='subscription-option'])
        ::slotted([is='inline-price'][data-display-tax='true']) {
        position: relative;
        height: 40px;
    }
`;var x="merch-offer",c=class extends E{static properties={text:{type:String},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},badgeText:{type:String,attribute:"badge-text"},type:{type:String,attribute:"type",reflect:!0},offer:{type:HTMLElement},planType:{type:String,attribute:"plan-type",reflect:!0}};static styles=[p];select(){this.selected||(this.selected=!0,this.dispatchEvent(new CustomEvent(s,{detail:this,bubbles:!0})))}constructor(){super(),this.selected=!1,this.type="radio",this.offer=null,this.planType=null,this.addEventListener("click",e=>{this.select()}),this.addEventListener("keyup",e=>{(e.key==="Enter"||e.key===" ")&&this.select()})}getOptionValue(e){return this[e]||(this[e]=this.querySelector(`[slot="${e}"]`)),this[e]}connectedCallback(){super.connectedCallback(),this.initOffer(),this.configuration=this.closest("quantity-selector"),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio"),this.addEventListener("focus",this.handleFocus)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("focus",this.handleFocus)}handleFocus(e){this.select()}get asRadioOption(){return h` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`}get asSubscriptionOption(){return h`<slot name="commitment"></slot>
            <slot name="price"></slot>
            <slot name="teaser"></slot>
            <div id="condition">
                <slot name="condition"></slot>
                <overlay-trigger placement="top" offset="4">
                    <span class="condition-icon" slot="trigger"></span>
                    <sp-tooltip slot="hover-content" delayed
                        ><slot name="condition-tooltip"></slot
                    ></sp-tooltip>
                </overlay-trigger>
            </div>`}render(){return this.configuration||!this.offer?"":this.type==="subscription-option"?this.asSubscriptionOption:this.asRadioOption}get price(){return this.querySelector('span[is="inline-price"]:not([data-template="strikethrough"])')}get prices(){return this.querySelectorAll('span[is="inline-price"]')}get customerSegment(){return this.offer?.value?.[0].customerSegment}get marketSegment(){return this.offer?.value?.[0].marketSegments[0]}async initOffer(){this.prices.forEach(t=>t.setAttribute("slot","price")),await this.updateComplete,await Promise.all([...this.prices].map(t=>t.onceSettled()));let{value:[e]}=this.price;this.offer=this.price,this.planType=e.planType,await this.updateComplete,this.dispatchEvent(new CustomEvent(o,{bubbles:!0}))}};customElements.define(x,c);
//# sourceMappingURL=merch-offer-select.js.map

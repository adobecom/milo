// branch: twp-panel commit: 1db48026128e58b82f612c98c350b6335065998e Wed, 03 Apr 2024 15:12:50 GMT
import{html as f,LitElement as x}from"/libs/deps/lit-all.min.js";import{css as u,html as d,LitElement as b}from"/libs/deps/lit-all.min.js";var o=class extends b{static styles=u`
        :host .horizontal {
            display: flex;
            flex-direction: row;
        }
    `;static properties={offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String}};constructor(){super(),this.defaults={}}saveContainerDefaultValues(){let e=this.closest(this.getAttribute("container")),t=e?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),i=e?.badgeText;return{description:t,badgeText:i}}getSlottedElement(e,t){return(t||this.closest(this.getAttribute("container"))).querySelector(`[slot="${e}"]:not(merch-offer > *)`)}updateSlot(e,t){let i=this.getSlottedElement(e,t);if(!i)return;let s=this.selectedOffer.getOptionValue(e)?this.selectedOffer.getOptionValue(e):this.defaults[e];s&&i.replaceWith(s.cloneNode(!0))}handleOfferSelection(e){let t=e.detail;this.selectOffer(t)}handleOfferSelectionByQuantity(e){let t=e.detail.option,i=Number.parseInt(t),s=this.findAppropriateOffer(i);this.selectOffer(s),this.getSlottedElement("cta").setAttribute("data-quantity",t)}selectOffer(e){if(!e)return;let t=this.selectedOffer;t&&(t.selected=!1),this.selectedOffer=e,this.updateContainer()}findAppropriateOffer(e){let t=null;return this.offers.find(s=>{let r=Number.parseInt(s.getAttribute("value"));if(r===e)return!0;if(r>e)return!1;t=s})||t}updateBadgeText(e){this.selectedOffer.badgeText===""?e.badgeText=null:this.selectedOffer.badgeText?e.badgeText=this.selectedOffer.badgeText:e.badgeText=this.defaults.badgeText}updateContainer(){let e=this.closest(this.getAttribute("container"));!e||!this.selectedOffer||(this.updateSlot("cta",e),this.updateSlot("secondary-cta",e),this.updateSlot("price",e),!this.manageableMode&&(this.updateSlot("description",e),this.updateBadgeText(e)))}connectedCallback(){super.connectedCallback();let e=this.closest("merch-quantity-select");this.manageableMode=e,this.offers=[...this.querySelectorAll("merch-offer")],this.manageableMode?e.addEventListener("change",t=>this.handleOfferSelectionByQuantity(t)):(this.defaults=this.saveContainerDefaultValues(),this.addEventListener("offer-selected",this.handleOfferSelection),this.offers[0]?.select()),this.selectedOffer=this.offers[0],this.updateContainer()}render(){return this.variant?d`<slot class="${this.variant}"></slot>`:d`<slot></slot>`}disconnectedCallback(){this.removeEventListener("offer-selected",this.handleOfferSelection),this.removeEventListener("change",this.handleOfferSelectionByQuantity)}};customElements.define("merch-offer-select",o);import{css as m}from"/libs/deps/lit-all.min.js";var h=m`
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

    .merch-Div-in {
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
`;var n="commitment",a="condition",l="condition-tooltip";var c=class extends x{static properties={text:{type:String},selected:{type:Boolean,reflect:!0},badgeText:{type:String,attribute:"badge-text"},type:{type:String},offer:{type:String},planType:{type:String}};static styles=[h];#e;select(){this.selected||(this.selected=!0,this.parentElement.dispatchEvent(new CustomEvent("offer-selected",{detail:this})))}constructor(){super(),this.selected=!1,this.type="radio",this.offer=null,this.planType=null,this.addEventListener("click",e=>{this.select()}),this.addEventListener("keyup",e=>{(e.key==="Enter"||e.key===" ")&&this.select()})}getOptionValue(e){return this[e]||(this[e]=this.querySelector(`[slot="${e}"]`)),this[e]}connectedCallback(){super.connectedCallback(),this.configuration=this.closest("quantity-selector"),this.querySelector('span[is="inline-price"]')?.onceSettled().then(e=>{e.value.length&&(this.offer=e,this.planType=e.value[0].planType)}).catch(e=>{}),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio"),!this.hasAttribute("aria-checked")&&!this.configuration&&this.setAttribute("aria-checked",this.selected)}updated(e){e.has("selected")&&this.setAttribute("aria-checked",this.selected)}renderRadio(){return f` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`}renderDiv(){return this.#e||(this.#e=this.parentNode?.querySelector(`template[name="${this.planType}"]`)?.content?.cloneNode(!0),this.append(this.#e)),f`<div class="merch-Div">
            <input
                autocomplete="off"
                ?checked="${this.selected}"
                id="${this.planType}"
                name="offer"
                type="radio"
                value="${this.planType}"
                class="merch-Div-in"
            />
            <label class="merch-Div-label" for="${this.planType}">
                <slot name="${n}"></slot>
                ${this.offer}
                <slot name="${a}"></slot>
                <overlay-trigger placement="top" offset="4">
                    <span class="condition-icon" slot="trigger"></span>
                    <sp-tooltip slot="hover-content" delayed
                        ><slot
                            name="${this.planType}-${l}"
                        ></slot
                    ></sp-tooltip>
                </overlay-trigger>
            </label>
        </div> `}render(){return this.configuration||!this.offer?"":this.type&&this.type=="div"?this.renderDiv():this.renderRadio()}};customElements.define("merch-offer",c);
//# sourceMappingURL=merch-offer-select.js.map

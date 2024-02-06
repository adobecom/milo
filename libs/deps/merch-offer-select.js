// Fri, 26 Jan 2024 12:46:12 GMT
import{html as u,LitElement as b}from"/libs/deps/lit-all.min.js";import{css as d,html as a,LitElement as h}from"/libs/deps/lit-all.min.js";var r=class extends h{static styles=d`
        :host .horizontal {
            display: flex;
            flex-direction: row;
        }
    `;static properties={offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object},variant:{type:String}};constructor(){super(),this.defaults={}}saveContainerDefaultValues(){let e=this.closest(this.getAttribute("container")),t=e?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),i=e?.badgeText;return{description:t,badgeText:i}}getSlottedElement(e,t){return(t||this.closest(this.getAttribute("container"))).querySelector(`[slot="${e}"]:not(merch-offer > *)`)}updateSlot(e,t){let i=this.getSlottedElement(e,t);if(!i)return;let s=this.selectedOffer.getOptionValue(e)?this.selectedOffer.getOptionValue(e):this.defaults[e];s&&i.replaceWith(s.cloneNode(!0))}handleOfferSelection(e){let t=e.detail;this.selectOffer(t)}handleOfferSelectionByQuantity(e){let t=Number.parseInt(e),i=this.findAppropriateOffer(t);this.selectOffer(i),this.getSlottedElement("cta").setAttribute("data-quantity",e)}selectOffer(e){if(!e)return;let t=this.selectedOffer;t&&(t.selected=!1),this.selectedOffer=e,this.updateContainer()}findAppropriateOffer(e){let t=null;return this.offers.find(s=>{let n=Number.parseInt(s.getAttribute("value"));if(n===e)return!0;if(n>e)return!1;t=s})||t}updateBadgeText(e){this.selectedOffer.badgeText===""?e.badgeText=null:this.selectedOffer.badgeText?e.badgeText=this.selectedOffer.badgeText:e.badgeText=this.defaults.badgeText}updateContainer(){let e=this.closest(this.getAttribute("container"));!e||!this.selectedOffer||(this.updateSlot("cta",e),this.updateSlot("secondary-cta",e),this.updateSlot("price",e),!this.manageableMode&&(this.updateSlot("description",e),this.updateBadgeText(e)))}connectedCallback(){super.connectedCallback();let e=this.closest("merch-quantity-select");this.manageableMode=e,this.offers=[...this.querySelectorAll("merch-offer")],this.manageableMode?this.addCallBack(e):(this.defaults=this.saveContainerDefaultValues(),this.addEventListener("offer-selected",this.handleOfferSelection),this.offers[0].select()),this.selectedOffer=this.offers[0],this.updateContainer()}addCallBack(e){let t=()=>{e&&e.setQuantityChangeHandler&&(e.setQuantityChangeHandler(s=>{this.handleOfferSelectionByQuantity(s)}),i.disconnect())},i=new MutationObserver(t);i.observe(this.parentNode,{childList:!0,subtree:!0}),t()}render(){return this.variant?a`<slot class="${this.variant}"></slot>`:a`<slot></slot>`}disconnectedCallback(){this.removeEventListener("offer-selected",this.handleOfferSelection)}};customElements.define("merch-offer-select",r);import{css as f}from"/libs/deps/lit-all.min.js";var l=f`
    :host {
        --merch-radio: rgba(82, 88, 228);
        --merch-radio-hover: rgba(64, 70, 202);
        --merch-radio-down: rgba(50, 54, 168);
        --merch-radio-selected: rgb(2, 101, 220);
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
`;var o=class extends b{static properties={text:{type:String},selected:{type:Boolean,reflect:!0},badgeText:{type:String,attribute:"badge-text"}};static styles=[l];select(){this.selected||(this.selected=!0,this.parentElement.dispatchEvent(new CustomEvent("offer-selected",{detail:this})))}constructor(){super(),this.selected=!1,this.addEventListener("click",e=>{this.select()}),this.addEventListener("keyup",e=>{(e.key==="Enter"||e.key===" ")&&this.select()})}getOptionValue(e){return this[e]||(this[e]=this.querySelector(`[slot="${e}"]`)),this[e]}connectedCallback(){super.connectedCallback(),this.configuration=this.closest("quantity-selector"),!this.hasAttribute("tabindex")&&!this.configuration&&(this.tabIndex=0),!this.hasAttribute("role")&&!this.configuration&&(this.role="radio"),!this.hasAttribute("aria-checked")&&!this.configuration&&this.setAttribute("aria-checked",this.selected)}updated(e){e.has("selected")&&this.setAttribute("aria-checked",this.selected)}render(){return this.configuration?"":u` <input
                      tabindex="-1"
                      type="radio"
                      class="merch-Radio-input"
                  />
                  <span class="merch-Radio-button"></span>
                  <span class="merch-Radio-label">${this.text}</span>`}};customElements.define("merch-offer",o);

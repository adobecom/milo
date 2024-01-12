// Wed, 06 Dec 2023 11:00:21 GMT
import{html as d,LitElement as h}from"./lit-all.min.js";import{LitElement as c}from"./lit-all.min.js";var s=class extends c{static properties={offers:{type:Array},selectedOffer:{type:Object},defaults:{type:Object}};saveContainerDefaultValues(){let e=this.closest(this.getAttribute("container")),t=e?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(!0),i=e?.badgeText;return{description:t,badgeText:i}}getSlottedElement(e,t){return(t||this.closest(this.getAttribute("container"))).querySelector(`[slot="${e}"]:not(merch-offer > *)`)}updateSlot(e,t){let i=this.getSlottedElement(e,t);if(!i)return;let o=this.selectedOffer.get(e)?this.selectedOffer.get(e):this.defaults[e];o&&i.replaceWith(o.cloneNode(!0))}updateBadgeText(e){this.selectedOffer.badgeText===""?e.badgeText=null:this.selectedOffer.badgeText?e.badgeText=this.selectedOffer.badgeText:e.badgeText=this.defaults.badgeText}updateContainer(){let e=this.closest(this.getAttribute("container"));!e||!this.selectedOffer||(this.updateSlot("cta",e),this.updateSlot("price",e),this.updateSlot("description",e),this.updateBadgeText(e))}selectOffer(e){let t=this.selectedOffer,i=e.detail;i&&(t&&(t.selected=!1),this.selectedOffer=i,this.updateContainer())}connectedCallback(){this.offers=[...this.querySelectorAll("merch-offer")],this.defaults=this.saveContainerDefaultValues(),this.addEventListener("offer-selected",this.selectOffer),this.offers[0].select(),this.selectedOffer=this.offers[0]}disconnectedCallback(){this.removeEventListener("offer-selected",this.selectOffer)}};customElements.define("merch-offer-select",s);import{css as l}from"./lit-all.min.js";var n=l`
    :host {
        --merch-radio: rgba(82, 88, 228);
        --merch-radio-hover: rgba(64, 70, 202);
        --merch-radio-down: rgba(50, 54, 168);
        --merch-radio-selected: rgb(2, 101, 220);
        align-items: flex-start;
        display: flex;
        max-inline-size: 100%;
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
`;var r=class extends h{static properties={text:{type:String},price:{type:Object},cta:{type:Object},osi:{type:String},selected:{type:Boolean,reflect:!0},badgeText:{type:String,attribute:"badge-text"},description:{type:Object}};static styles=[n];select(){this.selected||(this.selected=!0,this.parentElement.dispatchEvent(new CustomEvent("offer-selected",{detail:this})))}constructor(){super(),this.selected=!1,this.addEventListener("click",e=>{this.select()}),this.addEventListener("keyup",e=>{(e.key==="Enter"||e.key===" ")&&this.select()})}get(e){return this[e]||(this[e]=this.querySelector(`[slot="${e}"]`)),this[e]}connectedCallback(){super.connectedCallback(),this.hasAttribute("tabindex")||(this.tabIndex=0),this.hasAttribute("role")||(this.role="radio"),this.hasAttribute("aria-checked")||this.setAttribute("aria-checked",this.selected)}updated(e){e.has("selected")&&this.setAttribute("aria-checked",this.selected)}render(){return d`
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        `}};customElements.define("merch-offer",r);

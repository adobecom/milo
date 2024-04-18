// branch: MWPW-138927-3 commit: f8d7c1b4953228095cc131fbdbf6989da5a3158a Thu, 18 Apr 2024 10:53:26 GMT
import{html as c,LitElement as m}from"/libs/deps/lit-all.min.js";var i=class{constructor(e,t){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(t),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as u}from"/libs/deps/lit-all.min.js";var l=u`
    :host {
        --merch-focused-outline: var(--merch-color-focus-ring) auto 1px;
        background-color: #f5f5f5;
        display: flex;
        flex-direction: column;
        gap: var(--consonant-merch-spacing-xs);
        width: 100%;
        min-width: 300px;
        max-width: 378px;
        visibility: hidden;
    }

    :host([ready]) {
        visibility: visible;
    }

    slot[name='header'] {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    ::slotted(h4),
    ::slotted(h5) {
        margin: 0;
    }

    ::slotted(h4) {
        font-size: 18px !important;
        font-weight: bold;
        line-height: 22px !important;
    }

    ::slotted(h5) {
        font-size: 14px !important;
        font-weight: normal;
        line-height: 17px !important;
    }

    #spinner {
        display: flex;
        justify-content: center;
    }

    #stock:focus-within {
        outline: var(--merch-focused-outline);
        outline-offset: 8px;
    }

    #footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
    }

    ::slotted(merch-secure-transaction) {
        order: 2;
    }

    sp-theme {
        display: contents;
    }

    sp-button {
        order: 3;
    }

    :host([layout='desktop']) ::slotted(merch-quantity-select) {
        width: 100%;
    }

    :host([layout='mobile']) sp-button {
        width: 80%;
        max-width: 300px;
    }

    ::slotted(merch-stock) {
        order: 1;
        max-width: 460px;
    }

    ::slotted(merch-quantity-select) {
        order: 1;
    }

    :host([layout='mobile']) #footer {
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 187px;
        display: flex;
        gap: 16px;
        flex-direction: column;
        flex-wrap: nowrap;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        box-shadow: 0px -8px 10px -5px rgba(112, 112, 112, 0.1);
        background-color: #fff;
        padding: 15px 30px;
        box-sizing: border-box;
    }
`;var s="merch-offer-select:ready";var o="merch-offer:selected",n="merch-stock:change",r="merch-quantity-selector:change";var d="(max-width: 1200px)";var a=class extends m{static styles=[l];static properties={continueText:{type:String,attribute:"continue-text"},quantity:{type:Number},ready:{type:Boolean,attribute:"ready",reflect:!0}};continueText="Continue";#e=new i(this,d);constructor(){super(),this.ready=!1}get listLayout(){return c`
            <slot name="header"></slot>
            <slot name="offers"></slot>
            <div id="footer">
                <slot name="footer"></slot>
                <sp-button
                    variant="cta"
                    size="large"
                    @click=${this.handleContinue}
                >
                    ${this.continueText}
                </sp-button>
            </div>
            ${this.checkoutLink}
            <slot @slotchange=${this.handleSlotChange}></slot>
        `}get waitLayout(){return c`
            <sp-theme theme="spectrum" color="light" scale="medium">
                <div id="spinner">
                    <sp-progress-circle indeterminate size="l" />
                </div>
            </sp-theme>
        `}render(){return this.offerSelect?this.listLayout:this.waitLayout}connectedCallback(){super.connectedCallback(),this.#e.matches?this.setAttribute("layout","mobile"):this.setAttribute("layout","desktop"),this.addEventListener(s,this.handleOfferSelectReady),this.checkOfferSelectReady(),this.addEventListener(o,this.handleOfferSelect),this.addEventListener(n,this.handleStockChange),this.addEventListener(r,this.handleQuantitySelectChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(s,this.handleOfferSelectReady),this.removeEventListener(o,this.handleOfferSelect),this.removeEventListener(n,this.handleStockChange),this.removeEventListener(r,this.handleQuantitySelectChange)}handleSlotChange(){this.initOfferSelect(),this.initQuantitySelect(),this.initStock(),this.secureTransaction?.setAttribute("slot","footer")}async checkOfferSelectReady(){this.offerSelect&&(await this.offerSelect.updateComplete,this.offerSelect.planType&&this.handleOfferSelectReady())}handleOfferSelectReady(){this.ready=!0,this.initStock(),this.requestUpdate()}handleOfferSelect(e){this.offerSelect?.stock&&(this.stock.planType=e.detail.planType),this.requestUpdate()}handleQuantitySelectChange(e){this.quantity=e.detail.option}handleStockChange(){this.requestUpdate()}handleContinue(){this.shadowRoot.getElementById("checkoutLink").click()}async initOfferSelect(){this.offerSelect&&(this.offerSelect.querySelectorAll("merch-offer").forEach(e=>e.type="subscription-option"),this.ready=!!this.offerSelect.planType,this.offerSelect.setAttribute("slot","offers"),await this.offerSelect.initSelectedOffer(),await this.offerSelect.selectedOffer.price.onceSettled(),this.requestUpdate())}initStock(){this.stock&&(this.stock.setAttribute("slot","footer"),this.offerSelect?.stock?this.stock.planType=this.offerSelect.planType:this.stock.planType=null)}initQuantitySelect(){this.quantitySelect&&this.quantitySelect.setAttribute("slot","footer")}get offerSelect(){return this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get stock(){return this.querySelector("merch-stock")}get secureTransaction(){return this.querySelector("merch-secure-transaction")}get checkoutLink(){if(!this.offerSelect?.selectedOffer?.price?.value)return;let[{offerSelectorIds:[e]}]=this.offerSelect.selectedOffer.price?.value;if(!e)return;let t=[e];if(this.stock){let h=this.stock.osi;h&&t.push(h)}let p=t.join(",");return c`<a
            id="checkoutLink"
            style="display: none"
            is="checkout-link"
            data-wcs-osi="${p}"
            data-quantity="${this.quantity}"
            href="#"
        ></a>`}};window.customElements.define("merch-subscription-panel",a);
//# sourceMappingURL=merch-subscription-panel.js.map

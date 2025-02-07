var y=Object.defineProperty;var u=o=>{throw TypeError(o)};var T=(o,t,e)=>t in o?y(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var i=(o,t,e)=>T(o,typeof t!="symbol"?t+"":t,e),R=(o,t,e)=>t.has(o)||u("Cannot "+e);var _=(o,t,e)=>(R(o,t,"read from private field"),e?e.call(o):t.get(o)),S=(o,t,e)=>t.has(o)?u("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(o):t.set(o,e);import{html as n,LitElement as L}from"../lit-all.min.js";import"../lit-all.min.js";var r=class{constructor(t,e){i(this,"key");i(this,"host");i(this,"media");i(this,"matches");this.key=Symbol("match-media-key"),this.media=window.matchMedia(e),this.matches=this.media.matches,this.updateMatches=this.updateMatches.bind(this),(this.host=t).addController(this)}hostConnected(){this.media.addEventListener("change",this.updateMatches)}hostDisconnected(){this.media.removeEventListener("change",this.updateMatches)}updateMatches(){this.matches!==this.media.matches&&(this.matches=this.media.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as C}from"../lit-all.min.js";var x=C`
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

    ::slotted(merch-offer-select) {
        overflow-y: auto;
        max-height: calc(100vh - 420px);
    }

    a[is='checkout-link'] {
        display: none;
    }
`;var l="merch-offer-select:ready";var d="merch-offer:selected",E="merch-stock:change";var p="merch-quantity-selector:change";var A="(max-width: 1199px)";var a,c=class extends L{constructor(){super();S(this,a,new r(this,A));this.ready=!1,this.continueText="Continue"}get listLayout(){return n`
            <slot name="header"></slot>
            <slot name="offers"></slot>
            <div id="footer">
                <slot name="footer"></slot>
                <sp-button
                    variant="accent"
                    size="large"
                    @click=${this.handleContinue}
                >
                    ${this.continueText}
                </sp-button>
            </div>
            ${this.checkoutLink}
            <slot @slotchange=${this.handleSlotChange}></slot>
        `}get waitLayout(){return n`
            <div id="spinner">
                <sp-progress-circle indeterminate size="l" />
            </div>
            <slot @slotchange=${this.handleSlotChange}></slot>
        `}render(){return this.offerSelect?this.listLayout:this.waitLayout}connectedCallback(){super.connectedCallback(),_(this,a).matches?this.setAttribute("layout","mobile"):this.setAttribute("layout","desktop"),this.addEventListener(l,this.handleOfferSelectReady),this.checkOfferSelectReady(),this.addEventListener(d,this.handleOfferSelect),this.addEventListener(E,this.handleStockChange),this.addEventListener(p,this.handleQuantitySelectChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(l,this.handleOfferSelectReady),this.removeEventListener(d,this.handleOfferSelect),this.removeEventListener(E,this.handleStockChange),this.removeEventListener(p,this.handleQuantitySelectChange)}handleSlotChange(){this.initOfferSelect(),this.initQuantitySelect(),this.initStock(),this.secureTransaction?.setAttribute("slot","footer")}async checkOfferSelectReady(){this.offerSelect&&(await this.offerSelect.updateComplete,this.offerSelect.planType&&this.handleOfferSelectReady())}handleOfferSelectReady(){this.ready=!0,this.initStock(),this.requestUpdate()}handleOfferSelect(e){this.offerSelect?.stock&&(this.stock.planType=e.detail.planType),this.requestUpdate()}handleQuantitySelectChange(e){this.quantity=e.detail.option}handleStockChange(){this.requestUpdate()}handleContinue(){this.shadowRoot.getElementById("checkoutLink").click()}async initOfferSelect(){this.offerSelect&&(this.offerSelect.querySelectorAll("merch-offer").forEach(e=>e.type="subscription-option"),this.ready=!!this.offerSelect.planType,this.offerSelect.setAttribute("slot","offers"),await this.offerSelect.selectOffer(this.offerSelect.querySelector("merch-offer[aria-selected]")),await this.offerSelect.selectedOffer.price.onceSettled(),this.requestUpdate())}initStock(){this.stock&&(this.stock.setAttribute("slot","footer"),this.offerSelect?.stock?this.stock.planType=this.offerSelect.planType:this.stock.planType=null)}initQuantitySelect(){this.quantitySelect&&this.quantitySelect.setAttribute("slot","footer")}get offerSelect(){return this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get stock(){return this.querySelector("merch-stock")}get secureTransaction(){return this.querySelector("merch-secure-transaction")}get checkoutLink(){if(!this.offerSelect?.selectedOffer?.price?.value)return;let[{offerSelectorIds:[e]}]=this.offerSelect.selectedOffer.price?.value;if(!e)return;let f=[e];if(this.stock){let s=this.stock.osi;s&&f.push(s)}let m=f.join(","),h=this.offerSelect.selectedOffer.cta;if(h&&h.value){let s=h?.cloneNode(!0);return s.setAttribute("id","checkoutLink"),s.setAttribute("data-wcs-osi",m),s.setAttribute("data-quantity",this.quantity),s.removeAttribute("target"),n`${s}`}return n`<a
            id="checkoutLink"
            is="checkout-link"
            data-wcs-osi="${m}"
            data-quantity="${this.quantity}"
            href="#"
        ></a>`}};a=new WeakMap,i(c,"styles",[x]),i(c,"properties",{continueText:{type:String,attribute:"continue-text"},quantity:{type:Number},ready:{type:Boolean,attribute:"ready",reflect:!0}});window.customElements.define("merch-subscription-panel",c);

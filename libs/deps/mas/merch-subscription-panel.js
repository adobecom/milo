// src/merch-subscription-panel.js
import { html, LitElement } from "../lit-all.min.js";

// ../node_modules/@spectrum-web-components/reactive-controllers/src/MatchMedia.js
var MatchMediaController = class {
  constructor(e, t) {
    this.key = Symbol("match-media-key");
    this.matches = false;
    this.host = e, this.host.addController(this), this.media = window.matchMedia(t), this.matches = this.media.matches, this.onChange = this.onChange.bind(this), e.addController(this);
  }
  hostConnected() {
    var e;
    (e = this.media) == null || e.addEventListener("change", this.onChange);
  }
  hostDisconnected() {
    var e;
    (e = this.media) == null || e.removeEventListener("change", this.onChange);
  }
  onChange(e) {
    this.matches !== e.matches && (this.matches = e.matches, this.host.requestUpdate(this.key, !this.matches));
  }
};

// src/merch-subscription-panel.css.js
import { css } from "../lit-all.min.js";
var styles = css`
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
`;

// src/constants.js
var EVENT_MERCH_OFFER_SELECT_READY = "merch-offer-select:ready";
var EVENT_OFFER_SELECTED = "merch-offer:selected";
var EVENT_MERCH_STOCK_CHANGE = "merch-stock:change";
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";

// src/media.js
var TABLET_DOWN = "(max-width: 1199px)";

// src/merch-subscription-panel.js
var MerchSubscriptionPanel = class extends LitElement {
  static styles = [styles];
  static properties = {
    continueText: { type: String, attribute: "continue-text" },
    quantity: { type: Number },
    ready: { type: Boolean, attribute: "ready", reflect: true }
  };
  continueText = "Continue";
  #mobileAndTablet = new MatchMediaController(this, TABLET_DOWN);
  constructor() {
    super();
    this.ready = false;
  }
  /**
   * Renders subscription layout when connected to a card and has prices.
   */
  get listLayout() {
    return html`
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
        `;
  }
  /**
   * Renders loading spinner when disconnected from a card or waits for prices to resolve.
   */
  get waitLayout() {
    return html`
            <div id="spinner">
                <sp-progress-circle indeterminate size="l" />
            </div>
            <slot @slotchange=${this.handleSlotChange}></slot>
        `;
  }
  render() {
    return this.offerSelect ? this.listLayout : this.waitLayout;
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.#mobileAndTablet.matches) {
      this.setAttribute("layout", "mobile");
    } else {
      this.setAttribute("layout", "desktop");
    }
    this.addEventListener(
      EVENT_MERCH_OFFER_SELECT_READY,
      this.handleOfferSelectReady
    );
    this.checkOfferSelectReady();
    this.addEventListener(EVENT_OFFER_SELECTED, this.handleOfferSelect);
    this.addEventListener(EVENT_MERCH_STOCK_CHANGE, this.handleStockChange);
    this.addEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelectChange
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      EVENT_MERCH_OFFER_SELECT_READY,
      this.handleOfferSelectReady
    );
    this.removeEventListener(EVENT_OFFER_SELECTED, this.handleOfferSelect);
    this.removeEventListener(
      EVENT_MERCH_STOCK_CHANGE,
      this.handleStockChange
    );
    this.removeEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelectChange
    );
  }
  handleSlotChange() {
    this.initOfferSelect();
    this.initQuantitySelect();
    this.initStock();
    this.secureTransaction?.setAttribute("slot", "footer");
  }
  /** if merch-offer-select was already ready before the this is connected to DOM */
  async checkOfferSelectReady() {
    if (!this.offerSelect)
      return;
    await this.offerSelect.updateComplete;
    if (this.offerSelect.planType) {
      this.handleOfferSelectReady();
    }
  }
  handleOfferSelectReady() {
    this.ready = true;
    this.initStock();
    this.requestUpdate();
  }
  handleOfferSelect(event) {
    if (this.offerSelect?.stock) {
      this.stock.planType = event.detail.planType;
    }
    this.requestUpdate();
  }
  handleQuantitySelectChange(event) {
    this.quantity = event.detail.option;
  }
  handleStockChange() {
    this.requestUpdate();
  }
  handleContinue() {
    this.shadowRoot.getElementById("checkoutLink").click();
  }
  async initOfferSelect() {
    if (!this.offerSelect)
      return;
    this.offerSelect.querySelectorAll("merch-offer").forEach((el) => el.type = "subscription-option");
    this.ready = !!this.offerSelect.planType;
    this.offerSelect.setAttribute("slot", "offers");
    await this.offerSelect.selectOffer(
      this.offerSelect.querySelector("merch-offer[aria-selected]")
    );
    await this.offerSelect.selectedOffer.price.onceSettled();
    this.requestUpdate();
  }
  initStock() {
    if (!this.stock)
      return;
    this.stock.setAttribute("slot", "footer");
    if (this.offerSelect?.stock) {
      this.stock.planType = this.offerSelect.planType;
    } else {
      this.stock.planType = null;
    }
  }
  initQuantitySelect() {
    if (!this.quantitySelect)
      return;
    this.quantitySelect.setAttribute("slot", "footer");
  }
  get offerSelect() {
    return this.querySelector("merch-offer-select");
  }
  get quantitySelect() {
    return this.querySelector("merch-quantity-select");
  }
  get stock() {
    return this.querySelector("merch-stock");
  }
  get secureTransaction() {
    return this.querySelector("merch-secure-transaction");
  }
  get checkoutLink() {
    if (!this.offerSelect?.selectedOffer?.price?.value)
      return;
    const [
      {
        offerSelectorIds: [osi]
      }
    ] = this.offerSelect.selectedOffer.price?.value;
    if (!osi)
      return;
    const osis = [osi];
    if (this.stock) {
      const stockOsi = this.stock.osi;
      if (stockOsi)
        osis.push(stockOsi);
    }
    const osisString = osis.join(",");
    const cta = this.offerSelect.selectedOffer.cta;
    if (cta && cta.value) {
      const node = cta?.cloneNode(true);
      node.setAttribute("id", "checkoutLink");
      node.setAttribute("data-wcs-osi", osisString);
      node.setAttribute("data-quantity", this.quantity);
      node.removeAttribute("target");
      return html`${node}`;
    }
    return html`<a
            id="checkoutLink"
            is="checkout-link"
            data-wcs-osi="${osisString}"
            data-quantity="${this.quantity}"
            href="#"
        ></a>`;
  }
};
window.customElements.define(
  "merch-subscription-panel",
  MerchSubscriptionPanel
);

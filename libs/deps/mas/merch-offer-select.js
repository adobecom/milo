var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/merch-offer.js
import { html as html2, LitElement as LitElement2 } from "../lit-all.min.js";

// src/merch-offer-select.js
import { css, html, LitElement } from "../lit-all.min.js";

// src/constants.js
var Commitment = Object.freeze({
  MONTH: "MONTH",
  YEAR: "YEAR",
  TWO_YEARS: "TWO_YEARS",
  THREE_YEARS: "THREE_YEARS",
  PERPETUAL: "PERPETUAL",
  TERM_LICENSE: "TERM_LICENSE",
  ACCESS_PASS: "ACCESS_PASS",
  THREE_MONTHS: "THREE_MONTHS",
  SIX_MONTHS: "SIX_MONTHS"
});
var Term = Object.freeze({
  ANNUAL: "ANNUAL",
  MONTHLY: "MONTHLY",
  TWO_YEARS: "TWO_YEARS",
  THREE_YEARS: "THREE_YEARS",
  P1D: "P1D",
  P1Y: "P1Y",
  P3Y: "P3Y",
  P10Y: "P10Y",
  P15Y: "P15Y",
  P3D: "P3D",
  P7D: "P7D",
  P30D: "P30D",
  HALF_YEARLY: "HALF_YEARLY",
  QUARTERLY: "QUARTERLY"
});
var SELECTOR_MAS_INLINE_PRICE = 'span[is="inline-price"][data-wcs-osi]';
var SELECTOR_MAS_CHECKOUT_LINK = 'a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';
var SELECTOR_MAS_ELEMENT = `${SELECTOR_MAS_INLINE_PRICE},${SELECTOR_MAS_CHECKOUT_LINK}`;
var EVENT_MERCH_OFFER_READY = "merch-offer:ready";
var EVENT_MERCH_OFFER_SELECT_READY = "merch-offer-select:ready";
var EVENT_OFFER_SELECTED = "merch-offer:selected";
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";
var CheckoutWorkflowStep = Object.freeze({
  CHECKOUT: "checkout",
  CHECKOUT_EMAIL: "checkout/email",
  SEGMENTATION: "segmentation",
  BUNDLE: "bundle",
  COMMITMENT: "commitment",
  RECOMMENDATION: "recommendation",
  EMAIL: "email",
  PAYMENT: "payment",
  CHANGE_PLAN_TEAM_PLANS: "change-plan/team-upgrade/plans",
  CHANGE_PLAN_TEAM_PAYMENT: "change-plan/team-upgrade/payment"
});
var CheckoutWorkflow = Object.freeze({ V2: "UCv2", V3: "UCv3" });
var Env = Object.freeze({
  STAGE: "STAGE",
  PRODUCTION: "PRODUCTION",
  LOCAL: "LOCAL"
});

// src/merch-offer-select.js
var _handleOfferSelectionByQuantityFn;
var MerchOfferSelect = class extends LitElement {
  constructor() {
    super();
    __privateAdd(this, _handleOfferSelectionByQuantityFn, void 0);
    this.defaults = {};
    this.variant = "plans";
  }
  /** Returns the default values for the price, cta, and description slots.
   * These are the values coming from the container itself, not from the merch-offer elements.
   * E.g. initial merch-card description text. There is no default price or cta in the container.
   */
  saveContainerDefaultValues() {
    const container = this.closest(this.getAttribute("container"));
    const description = container?.querySelector('[slot="description"]:not(merch-offer > *)')?.cloneNode(true);
    const badgeText = container?.badgeText;
    return {
      description,
      badgeText
    };
  }
  getSlottedElement(slotName, container) {
    const containerEl = container || this.closest(this.getAttribute("container"));
    return containerEl.querySelector(
      `[slot="${slotName}"]:not(merch-offer > *)`
    );
  }
  updateSlot(slotName, container) {
    const slot = this.getSlottedElement(slotName, container);
    if (!slot)
      return;
    const node = this.selectedOffer.getOptionValue(slotName) ? this.selectedOffer.getOptionValue(slotName) : this.defaults[slotName];
    if (node) {
      slot.replaceWith(node.cloneNode(true));
    }
  }
  handleOfferSelection(e) {
    const newOffer = e.detail;
    this.selectOffer(newOffer);
  }
  handleOfferSelectionByQuantity(event) {
    const selected = event.detail.option;
    const selectedValue = Number.parseInt(selected);
    const newOffer = this.findAppropriateOffer(selectedValue);
    this.selectOffer(newOffer);
    const cta = this.getSlottedElement("cta");
    cta.setAttribute("data-quantity", selectedValue);
  }
  selectOffer(newOffer) {
    if (!newOffer) {
      return;
    }
    const previousOffer = this.selectedOffer;
    if (previousOffer) {
      previousOffer.selected = false;
    }
    newOffer.selected = true;
    this.selectedOffer = newOffer;
    this.planType = newOffer.planType;
    this.updateContainer();
    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent(EVENT_OFFER_SELECTED, {
          detail: this,
          bubbles: true
        })
      );
    });
  }
  findAppropriateOffer(selectedValue) {
    let previousOfferWithValue = null;
    const foundOffer = this.offers.find((offer) => {
      const offerAttribute = Number.parseInt(offer.getAttribute("value"));
      if (offerAttribute === selectedValue) {
        return true;
      } else if (offerAttribute > selectedValue) {
        return false;
      } else {
        previousOfferWithValue = offer;
      }
    });
    return foundOffer || previousOfferWithValue;
  }
  /**
   * If badge text is empty string - delete the badge.
   * If badge text is present - set the badge.
   * If badge text is null or undefined - set default badge. */
  updateBadgeText(container) {
    if (this.selectedOffer.badgeText === "") {
      container.badgeText = null;
    } else if (this.selectedOffer.badgeText) {
      container.badgeText = this.selectedOffer.badgeText;
    } else {
      container.badgeText = this.defaults.badgeText;
    }
  }
  /** Will update price, cta, and other slots/properties in parent container (e.g. merch-card) */
  updateContainer() {
    const container = this.closest(this.getAttribute("container"));
    if (!container || !this.selectedOffer)
      return;
    this.updateSlot("cta", container);
    this.updateSlot("secondary-cta", container);
    this.updateSlot("price", container);
    if (this.manageableMode)
      return;
    this.updateSlot("description", container);
    this.updateBadgeText(container);
  }
  render() {
    return html`<fieldset><slot class="${this.variant}"></slot></fieldset>`;
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("focusin", this.handleFocusin);
    this.addEventListener("click", this.handleFocusin);
    this.addEventListener(
      EVENT_MERCH_OFFER_READY,
      this.handleOfferSelectReady
    );
    const quantitySelect = this.closest("merch-quantity-select");
    this.manageableMode = quantitySelect;
    this.offers = [...this.querySelectorAll("merch-offer")];
    __privateSet(this, _handleOfferSelectionByQuantityFn, this.handleOfferSelectionByQuantity.bind(this));
    if (this.manageableMode) {
      quantitySelect.addEventListener(
        EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
        __privateGet(this, _handleOfferSelectionByQuantityFn)
      );
    } else {
      this.defaults = this.saveContainerDefaultValues();
    }
    this.selectedOffer = this.offers[0];
    if (this.planType) {
      this.updateContainer();
    }
  }
  get miniCompareMobileCard() {
    return this.merchCard?.variant === "mini-compare-chart" && this.isMobile;
  }
  get merchCard() {
    return this.closest("merch-card");
  }
  get isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      __privateGet(this, _handleOfferSelectionByQuantityFn)
    );
    this.removeEventListener(
      EVENT_MERCH_OFFER_READY,
      this.handleOfferSelectReady
    );
    this.removeEventListener("focusin", this.handleFocusin);
    this.removeEventListener("click", this.handleFocusin);
  }
  get price() {
    return this.querySelector(
      'merch-offer[aria-selected] [is="inline-price"]'
    );
  }
  get customerSegment() {
    return this.selectedOffer?.customerSegment;
  }
  get marketSegment() {
    return this.selectedOffer?.marketSegment;
  }
  handleFocusin(event) {
    if (event.target?.nodeName === "MERCH-OFFER") {
      event.preventDefault();
      event.stopImmediatePropagation();
      this.selectOffer(event.target);
    }
  }
  async handleOfferSelectReady() {
    if (this.planType)
      return;
    if (this.querySelector("merch-offer:not([plan-type])"))
      return;
    this.planType = this.selectedOffer.planType;
    await this.updateComplete;
    this.selectOffer(
      this.selectedOffer ?? this.querySelector("merch-offer[aria-selected]") ?? this.querySelector("merch-offer")
    );
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_OFFER_SELECT_READY, { bubbles: true })
    );
  }
};
_handleOfferSelectionByQuantityFn = new WeakMap();
__publicField(MerchOfferSelect, "styles", css`
        :host {
            display: inline-block;
        }

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
    `);
__publicField(MerchOfferSelect, "properties", {
  offers: { type: Array },
  selectedOffer: { type: Object },
  defaults: { type: Object },
  variant: { type: String, attribute: "variant", reflect: true },
  planType: { type: String, attribute: "plan-type", reflect: true },
  stock: { type: Boolean, reflect: true }
});
customElements.define("merch-offer-select", MerchOfferSelect);

// src/merch-offer.css.js
import { css as css2 } from "../lit-all.min.js";
var styles = css2`
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
        transition:
            border 0.13s ease-in-out,
            box-shadow 0.13s ease-in-out;
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
        transition:
            opacity 0.13s ease-out,
            margin 0.13s ease-out;
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

    sp-icon-info-outline {
        color: #6e6e6e;
        content: '';
    }

    ::slotted(p),
    ::slotted(h5) {
        margin: 0;
    }

    ::slotted([slot='commitment']) {
        font-size: 14px !important;
        font-weight: normal !important;
        line-height: 17px !important;
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
        line-height: 20px;
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
`;

// src/merch-offer.js
var TAG_NAME = "merch-offer";
var MerchOffer = class extends LitElement2 {
  constructor() {
    super();
    __publicField(this, "tr");
    this.type = "radio";
    this.selected = false;
  }
  getOptionValue(slotName) {
    return this.querySelector(`[slot="${slotName}"]`);
  }
  // setting attributes can't be done in constructor, so using connectedCallback
  connectedCallback() {
    super.connectedCallback();
    this.initOffer();
    this.configuration = this.closest("quantity-selector");
    if (!this.hasAttribute("tabindex") && !this.configuration) {
      this.tabIndex = 0;
    }
    if (!this.hasAttribute("role") && !this.configuration) {
      this.role = "radio";
    }
  }
  get asRadioOption() {
    return html2` <div class="merch-Radio">
            <input tabindex="-1" type="radio" class="merch-Radio-input" />
            <span class="merch-Radio-button"></span>
            <span class="merch-Radio-label">${this.text}</span>
        </div>`;
  }
  get asSubscriptionOption() {
    return html2`<slot name="commitment"></slot>
            <slot name="price"></slot>
            <slot name="teaser"></slot>
            <div id="condition">
                <slot name="condition"></slot>
                <span id="info">
                    <sp-icon-info-outline size="s"></sp-icon-info-outline
                ></span>
                <sp-overlay placement="top" trigger="info@hover" type="hint">
                    <sp-tooltip
                        ><slot name="condition-tooltip"></slot
                    ></sp-tooltip>
                </sp-overlay>
            </div>`;
  }
  render() {
    if (this.configuration)
      return "";
    if (!this.price)
      return "";
    if (this.type === "subscription-option")
      return this.asSubscriptionOption;
    return this.asRadioOption;
  }
  get price() {
    return this.querySelector(
      'span[is="inline-price"]:not([data-template="strikethrough"])'
    );
  }
  get cta() {
    return this.querySelector(SELECTOR_MAS_CHECKOUT_LINK);
  }
  get prices() {
    return this.querySelectorAll('span[is="inline-price"]');
  }
  get customerSegment() {
    return this.price?.value?.[0].customerSegment;
  }
  get marketSegment() {
    return this.price?.value?.[0].marketSegments[0];
  }
  async initOffer() {
    if (!this.price)
      return;
    this.prices.forEach((el) => el.setAttribute("slot", "price"));
    await this.updateComplete;
    await Promise.all([...this.prices].map((price) => price.onceSettled()));
    const {
      value: [offer]
    } = this.price;
    this.planType = offer.planType;
    await this.updateComplete;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_OFFER_READY, { bubbles: true })
    );
  }
};
__publicField(MerchOffer, "properties", {
  text: { type: String },
  selected: { type: Boolean, attribute: "aria-selected", reflect: true },
  badgeText: { type: String, attribute: "badge-text" },
  type: { type: String, attribute: "type", reflect: true },
  // values: radio, subscription-option
  planType: { type: String, attribute: "plan-type", reflect: true }
});
__publicField(MerchOffer, "styles", [styles]);
customElements.define(TAG_NAME, MerchOffer);

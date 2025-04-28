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

// src/merch-stock.js
import { LitElement, css, html } from "../lit-all.min.js";

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
var EVENT_MERCH_STOCK_CHANGE = "merch-stock:change";
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

// node_modules/@spectrum-web-components/reactive-controllers/src/MatchMedia.js
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

// src/media.js
var MOBILE_LANDSCAPE = "(max-width: 767px)";

// src/merch-stock.js
var _mobile;
var MerchStock = class extends LitElement {
  constructor() {
    super();
    __privateAdd(this, _mobile, new MatchMediaController(this, MOBILE_LANDSCAPE));
    this.checked = false;
  }
  handleChange(event) {
    this.checked = event.target.checked;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_STOCK_CHANGE, {
        detail: {
          checked: event.target.checked,
          planType: this.planType
        },
        bubbles: true
      })
    );
  }
  connectedCallback() {
    this.style.setProperty("--mod-checkbox-font-size", "12px");
    super.connectedCallback();
    this.updateComplete.then(() => {
      this.querySelectorAll('[is="inline-price"]').forEach(async (el) => {
        await el.onceSettled();
        el.parentElement.setAttribute(
          "data-plan-type",
          el.value[0].planType
        );
      });
    });
  }
  render() {
    if (!this.planType)
      return;
    if (__privateGet(this, _mobile).matches)
      return;
    return html`
            <sp-checkbox
                size="s"
                @change=${this.handleChange}
                ?checked=${this.checked}
            >
                <slot></slot>
            </sp-checkbox>
        `;
  }
  get osi() {
    if (!this.checked)
      return;
    return this.querySelector(
      `div[data-plan-type="${this.planType}"] [is="inline-price"]`
    )?.value?.[0].offerSelectorIds[0];
  }
};
_mobile = new WeakMap();
__publicField(MerchStock, "styles", [
  css`
            ::slotted(div) {
                display: none;
            }

            :host(:not([plan-type])) {
                display: none;
            }

            :host([plan-type='ABM']) ::slotted([data-plan-type='ABM']),
            :host([plan-type='M2M']) ::slotted([data-plan-type='M2M']),
            :host([plan-type='PUF']) ::slotted([data-plan-type='PUF']) {
                display: block;
            }

            sp-checkbox {
                margin: 0;
                font-size: 12px;
                line-height: 15px;
            }
        `
]);
__publicField(MerchStock, "properties", {
  checked: { type: Boolean, attribute: "checked", reflect: true },
  planType: { type: String, attribute: "plan-type", reflect: true }
});
window.customElements.define("merch-stock", MerchStock);
export {
  MerchStock
};

// src/merch-stock.js
import { LitElement, css, html } from "../lit-all.min.js";

// src/constants.js
var EVENT_MERCH_STOCK_CHANGE = "merch-stock:change";

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

// src/media.js
var MOBILE_LANDSCAPE = "(max-width: 767px)";

// src/merch-stock.js
var MerchStock = class extends LitElement {
  static styles = [
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
  ];
  static properties = {
    checked: { type: Boolean, attribute: "checked", reflect: true },
    planType: { type: String, attribute: "plan-type", reflect: true }
  };
  checked = false;
  #mobile = new MatchMediaController(this, MOBILE_LANDSCAPE);
  constructor() {
    super();
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
    if (this.#mobile.matches)
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
window.customElements.define("merch-stock", MerchStock);
export {
  MerchStock
};

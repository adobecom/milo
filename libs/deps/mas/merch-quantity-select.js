// src/merch-quantity-select.js
import { html, LitElement } from "../lit-all.min.js";

// src/merch-quantity-select.css.js
import { css } from "../lit-all.min.js";
var styles = css`
    :host {
        box-sizing: border-box;
        --background-color: var(--qs-background-color, #f6f6f6);
        --text-color: #000;
        --radius: 5px;
        --border-color: var(--qs-border-color, #e8e8e8);
        --border-width: var(--qs-border-width, 1px);
        --label-font-size: var(--qs-label-font-size, 12px);
        --font-size: var(--qs-font-size, 12px);
        --label-color: var(--qs-lable-color, #000);
        --input-height: var(--qs-input-height, 30px);
        --input-width: var(--qs-input-width, 72px);
        --button-width: var(--qs-button-width, 30px);
        --font-size: var(--qs-font-size, 12px);
        --picker-fill-icon: var(
            --chevron-down-icon,
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="10" height="6" aria-hidden="true" viewBox="0 0 10 6"><path fill="%23787878" d="M9.99 1.01A1 1 0 0 0 8.283.3L5 3.586 1.717.3A1 1 0 1 0 .3 1.717L4.293 5.7a1 1 0 0 0 1.414 0L9.7 1.717a1 1 0 0 0 .29-.707z"/></svg>')
        );
        --qs-transition: var(--transition);

        display: block;
        position: relative;
        color: var(--text-color);
        line-height: var(--qs-line-height, 2);
    }

    .text-field {
        display: flex;
        align-items: center;
        width: var(--input-width);
        position: relative;
        margin-top: 6px;
    }

    .text-field-input {
        font-family: inherit;
        padding: 0;
        font-size: var(--font-size);
        height: var(--input-height);
        width: calc(var(--input-width) - var(--button-width));
        border: var(--border-width) solid var(--border-color);
        border-top-left-radius: var(--radius);
        border-bottom-left-radius: var(--radius);
        border-right: none;
        padding-inline-start: 12px;
        box-sizing: border-box;
        -moz-appearance: textfield;
    }

    .text-field-input::-webkit-inner-spin-button,
    .text-field-input::-webkit-outer-spin-button {
        margin: 0;
        -webkit-appearance: none;
    }

    .label {
        font-size: var(--label-font-size);
        color: var(--label-color);
    }

    .picker-button {
        width: var(--button-width);
        height: var(--input-height);
        position: absolute;
        inset-inline-end: 0;
        border: var(--border-width) solid var(--border-color);
        border-top-right-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
        background-color: var(--background-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
    }

    .picker-button-fill {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: var(--picker-fill-icon);
        background-position: center;
        background-repeat: no-repeat;
    }

    .popover {
        position: absolute;
        top: var(--input-height);
        left: 0;
        width: var(--input-width);
        border-radius: var(--radius);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 100;
        margin-top: var(--popover-margin-top, 6px);
        transition: var(--qs-transition);
        opacity: 0;
        box-sizing: border-box;
    }

    .popover.open {
        opacity: 1;
        background: #ffffff;
        border: var(--border-width) solid var(--border-color);
    }

    .popover.closed {
        max-height: 0;
        opacity: 0;
    }

    ::slotted(p) {
        margin: 0;
    }

    .item {
        display: flex;
        align-items: center;
        color: var(--text-color);
        font-size: var(--font-size);
        padding-inline-start: 12px;
        box-sizing: border-box;
    }

    .item.highlighted {
        background-color: var(--background-color);
    }
`;

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
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";
var EVENT_MERCH_CARD_QUANTITY_CHANGE = "merch-card-quantity:change";
var CheckoutWorkflowStep = Object.freeze({
  SEGMENTATION: "segmentation",
  BUNDLE: "bundle",
  COMMITMENT: "commitment",
  RECOMMENDATION: "recommendation",
  EMAIL: "email",
  PAYMENT: "payment",
  CHANGE_PLAN_TEAM_PLANS: "change-plan/team-upgrade/plans",
  CHANGE_PLAN_TEAM_PAYMENT: "change-plan/team-upgrade/payment"
});
var Env = Object.freeze({
  STAGE: "STAGE",
  PRODUCTION: "PRODUCTION",
  LOCAL: "LOCAL"
});

// src/utils.js
function debounce(func, delay) {
  let debounceTimer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
}

// src/focus.js
var [ARROW_LEFT, ARROW_RIGHT, ARROW_UP, ARROW_DOWN, ENTER, TAB] = [
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Enter",
  "Tab"
];

// src/merch-quantity-select.js
var MerchQuantitySelect = class extends LitElement {
  static get properties() {
    return {
      closed: { type: Boolean, reflect: true },
      selected: { type: Number },
      min: { type: Number },
      max: { type: Number },
      step: { type: Number },
      maxInput: { type: Number, attribute: "max-input" },
      options: { type: Array },
      highlightedIndex: { type: Number },
      defaultValue: {
        type: Number,
        attribute: "default-value",
        reflect: true
      },
      title: { type: String }
    };
  }
  static get styles() {
    return styles;
  }
  constructor() {
    super();
    this.options = [];
    this.title = "";
    this.closed = true;
    this.min = 0;
    this.max = 0;
    this.step = 0;
    this.maxInput = void 0;
    this.defaultValue = void 0;
    this.selectedValue = 0;
    this.highlightedIndex = 0;
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.boundKeydownListener = this.handleKeydown.bind(this);
    this.handleKeyupDebounced = debounce(this.handleKeyup.bind(this), 500);
    this.debouncedQuantityUpdate = debounce(
      this.handleQuantityUpdate.bind(this),
      500
    );
  }
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this.boundKeydownListener);
    window.addEventListener("mousedown", this.handleClickOutside);
    this.addEventListener(
      EVENT_MERCH_CARD_QUANTITY_CHANGE,
      this.debouncedQuantityUpdate
    );
  }
  handleKeyup() {
    this.handleInput();
    this.sendEvent();
  }
  handleKeydown(e) {
    switch (e.key) {
      case ARROW_DOWN:
        if (!this.closed) {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex + 1) % this.options.length;
        }
        break;
      case ARROW_UP:
        if (!this.closed) {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex - 1 + this.options.length) % this.options.length;
        }
        break;
      case ENTER:
        if (!this.closed) {
          const option = this.options[this.highlightedIndex];
          if (!option) break;
          this.selectedValue = option;
          this.handleMenuOption(this.selectedValue);
          this.toggleMenu();
        } else {
          this.closePopover();
          this.blur();
        }
        break;
    }
    if (e.composedPath().includes(this)) e.stopPropagation();
  }
  adjustInput(inputField, value) {
    this.selectedValue = value;
    inputField.value = value;
    this.highlightedIndex = this.options.indexOf(value);
  }
  handleInput() {
    const inputField = this.shadowRoot.querySelector(".text-field-input");
    const inputValue = parseInt(inputField.value);
    if (isNaN(inputValue)) return;
    if (inputValue > 0 && inputValue !== this.selectedValue) {
      let adjustedInputValue = inputValue;
      if (this.maxInput && inputValue > this.maxInput)
        adjustedInputValue = this.maxInput;
      if (this.min && adjustedInputValue < this.min)
        adjustedInputValue = this.min;
      this.adjustInput(inputField, adjustedInputValue);
    } else this.adjustInput(inputField, this.min || 1);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("mousedown", this.handleClickOutside);
    this.removeEventListener("keydown", this.boundKeydownListener);
    this.removeEventListener(
      EVENT_MERCH_CARD_QUANTITY_CHANGE,
      this.debouncedQuantityUpdate
    );
  }
  generateOptionsArray() {
    const options = [];
    if (this.step > 0) {
      for (let value = this.min; value <= this.max; value += this.step) {
        options.push(value);
      }
    }
    return options;
  }
  update(changedProperties) {
    if (changedProperties.has("min") || changedProperties.has("max") || changedProperties.has("step") || changedProperties.has("defaultValue")) {
      this.options = this.generateOptionsArray();
      this.highlightedIndex = this.defaultValue ? this.options.indexOf(this.defaultValue) : 0;
      this.handleMenuOption(
        this.defaultValue ? this.defaultValue : this.options[0]
      );
    }
    super.update(changedProperties);
  }
  handleClickOutside(event) {
    const path = event.composedPath();
    if (!path.includes(this)) {
      this.closePopover();
    }
  }
  toggleMenu() {
    this.closed = !this.closed;
  }
  handleMouseEnter(index) {
    this.highlightedIndex = index;
  }
  handleMenuOption(option) {
    if (option === this.max)
      this.shadowRoot.querySelector(".text-field-input")?.focus();
    this.selectedValue = option;
    this.sendEvent();
    this.closePopover();
  }
  sendEvent() {
    const customEvent = new CustomEvent(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      {
        detail: { option: this.selectedValue },
        bubbles: true
      }
    );
    this.dispatchEvent(customEvent);
  }
  closePopover() {
    if (!this.closed) {
      this.toggleMenu();
    }
  }
  get offerSelect() {
    return this.querySelector("merch-offer-select");
  }
  get popover() {
    return html` <div class="popover ${this.closed ? "closed" : "open"}">
            ${this.options.map(
      (option, index) => html`
                    <div
                        class="item ${index === this.highlightedIndex ? "highlighted" : ""}"
                        @click="${() => this.handleMenuOption(option)}"
                        @mouseenter="${() => this.handleMouseEnter(index)}"
                    >
                        ${option === this.max ? `${option}+` : option}
                    </div>
                `
    )}
        </div>`;
  }
  handleQuantityUpdate({ detail: { quantity } }) {
    if (quantity && quantity !== this.selectedValue) {
      this.selectedValue = quantity;
      const inputField = this.shadowRoot.querySelector(".text-field-input");
      if (inputField) {
        inputField.value = quantity;
      }
      this.sendEvent();
    }
  }
  render() {
    return html`
            <div class="label">${this.title}</div>
            <div class="text-field">
                <input
                    class="text-field-input"
                    @focus="${this.closePopover}"
                    .value="${this.selectedValue}"
                    type="number"
                    @keydown="${this.handleKeydown}"
                    @keyup="${this.handleKeyupDebounced}"
                />
                <button class="picker-button" @click="${this.toggleMenu}">
                    <div
                        class="picker-button-fill ${this.closed ? "open" : "closed"}"
                    ></div>
                </button>
                ${this.popover}
            </div>
        `;
  }
};
customElements.define("merch-quantity-select", MerchQuantitySelect);
export {
  MerchQuantitySelect
};
//# sourceMappingURL=merch-quantity-select.js.map

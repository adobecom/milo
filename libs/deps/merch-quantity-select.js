// Fri, 08 Mar 2024 20:47:23 GMT

// src/merch-quantity-select.js
import { html, LitElement } from "/libs/deps/lit-all.min.js";

// src/merch-quantity-select.css.js
import { css } from "/libs/deps/lit-all.min.js";
var styles = css`
    :host {
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
    }

    .text-field-input::-webkit-inner-spin-button,
    .text-field-input::-webkit-outer-spin-button {
        margin: 0;
        -moz-appearance: textfield;
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
      defaultValue: { type: Number, attribute: "default-value" },
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
    this.addEventListener("keydown", this.boundKeydownListener);
    window.addEventListener("mousedown", this.handleClickOutside);
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
          this.requestUpdate();
        }
        break;
      case ARROW_UP:
        if (!this.closed) {
          e.preventDefault();
          this.highlightedIndex = (this.highlightedIndex - 1 + this.options.length) % this.options.length;
          this.requestUpdate();
        }
        break;
      case ENTER:
        if (!this.closed) {
          const option = this.options[this.highlightedIndex];
          if (!option)
            break;
          this.selectedValue = option;
          this.handleMenuOption(this.selectedValue);
          this.toggleMenu();
        } else {
          this.closePopover();
          this.blur();
        }
        break;
    }
    if (e.composedPath().includes(this))
      e.stopPropagation();
  }
  handleInput() {
    const inputField = this.shadowRoot.querySelector(".text-field-input");
    const inputValue = parseInt(inputField.value);
    if (!isNaN(inputValue) && inputValue > 0 && inputValue !== this.selectedValue) {
      const adjustedInputValue = this.maxInput && inputValue > this.maxInput ? this.maxInput : inputValue;
      this.selectedValue = adjustedInputValue;
      inputField.value = adjustedInputValue;
      this.highlightedIndex = this.options.indexOf(adjustedInputValue);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("mousedown", this.handleClickOutside);
    this.removeEventListener("keydown", this.boundKeydownListener);
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
  updated(changedProperties) {
    if (changedProperties.has("min") || changedProperties.has("max") || changedProperties.has("step") || changedProperties.has("defaultValue")) {
      this.options = this.generateOptionsArray();
      this.highlightedIndex = this.defaultValue ? this.options.indexOf(this.defaultValue) : 0;
      this.handleMenuOption(
        this.defaultValue ? this.defaultValue : this.options[0]
      );
      this.requestUpdate();
    }
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
    this.requestUpdate();
  }
  handleMenuOption(option) {
    if (option === this.max)
      this.shadowRoot.querySelector(".text-field-input")?.focus();
    this.selectedValue = option;
    this.sendEvent();
    this.closePopover();
  }
  sendEvent() {
    const customEvent = new CustomEvent("change", {
      detail: { option: this.selectedValue },
      bubbles: true
    });
    this.dispatchEvent(customEvent);
  }
  closePopover() {
    if (!this.closed) {
      this.toggleMenu();
    }
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
                    @keyup="${this.handleKeyup}"
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

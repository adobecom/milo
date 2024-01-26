// Mon, 08 Jan 2024 21:06:16 GMT

// src/merch-quantity-select.js
import { html, css as css2, LitElement } from "/libs/deps/lit-all.min.js";

// src/merch-quantity-select.css.js
import { css } from "/libs/deps/lit-all.min.js";
var styles = css`
    :host {
        --background-color: var(--qs-background-color, rgb(246, 246, 246));
        --text-color: var(--qs-text-color, rgb(0, 0, 0));
        --radius: 5px;
        --border-color: var(--qs-border-color, rgb(232, 232, 232));
        --border-width: var(--qs-border-width, 1px);
        --label-font-size: var(--qs-label-font-size, 12px);
        --label-color: var(--qs-lable-color, rgb(0, 0, 0));
        --input-height: var(--qs-input-height, 30px);
        --input-width: var(--qs-input-width, 72px);
        --button-width: var(--qs-button-width, 30px);
        --font-size: var(--qs-font-size, 16px);
        --picker-fill-icon: var(
            --chevron-down-icon,
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="10" height="6" aria-hidden="true" viewBox="0 0 10 6"><path fill="%23787878" d="M9.99 1.01A1 1 0 0 0 8.283.3L5 3.586 1.717.3A1 1 0 1 0 .3 1.717L4.293 5.7a1 1 0 0 0 1.414 0L9.7 1.717a1 1 0 0 0 .29-.707z"/></svg>')
        );
        --qs-transition: var(--transition);
        display: block;
        position: relative;
        color: var(--main-color);
        user-select: none;
        padding: var(--qs-padding, 0);
    }

    .text-field {
        position: relative;
        display: flex;
        align-items: center;
        width: var(--input-width);
        margin-top: 6px;
    }

    .text-field-input::-webkit-inner-spin-button,
    .text-field-input::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .label {
        font-size: var(--label-font-size);
        color: var(--label-color);
    }

    .text-field-input[type='number'] {
        -moz-appearance: textfield;
    }

    .text-field-input {
        border: var(--border-width) solid var(--border-color);
        border-top-left-radius: var(--radius);
        border-bottom-left-radius: var(--radius);
        width: calc(var(--input-width) - var(--button-width));
        height: var(--input-height);
        border-right: none;
        padding: var(--padding-vertical, 8px) 12px;
        padding-left: var(--padding-horizontal, 12px);
        text-overflow: ellipsis;
        box-sizing: border-box;
    }

    .picker-button {
        position: absolute;
        inset-inline-end: 0;
        width: var(--button-width);
        height: var(--input-height);
        padding: 0;
        border: var(--border-width) solid var(--border-color);
        border-top-right-radius: var(--radius);
        border-bottom-right-radius: var(--radius);
        background-color: var(--background-color);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    .picker-button-fill {
        display: flex;
        align-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-image: var(--picker-fill-icon);
        background-position: center center;
        background-repeat: no-repeat;
    }

    .popover {
        position: absolute;
        top: var(--input-height);
        margin-top: var(--popover-margin-top, 6px);
        left: 0;
        border-radius: var(--radius);
        width: var(--input-width, 100%);
        opacity: 0;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        z-index: 100;
        transition: var(--qs-transition);
    }

    .popover.open {
        background: #ffffff;
        position: absolute;
        width: var(--input-width, 100%);
        opacity: 1;
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
        color: var(--text-color);
        display: flex;
        width: var(--qs-width, 100%);
        justify-content: center;
        align-items: center;
        opacity: 1;
    }

    .item.highlighted {
        background: var(--background-color);
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
    this.selectedValue = 0;
    this.highlightedIndex = 0;
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.boundKeydownListener = this.handleKeydown.bind(this);
    this.addEventListener("keydown", this.boundKeydownListener);
    window.addEventListener("mousedown", this.handleClickOutside);
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
      case "Enter":
        if (!this.closed) {
          this.selectedValue = this.options[this.highlightedIndex];
          this.handleMenuOption(null, this.selectedValue);
          this.toggleMenu();
        } else {
          const inputField = this.shadowRoot.querySelector(".text-field-input");
          const inputValue = parseInt(inputField.value);
          if (!isNaN(inputValue) && inputValue > 0) {
            this.selectedValue = inputValue;
            this.highlightedIndex = this.options.indexOf(inputValue);
            this.handleMenuOption(null, this.selectedValue);
            inputField.blur();
          }
          break;
        }
    }
    e.stopPropagation();
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
    if (changedProperties.has("min") || changedProperties.has("max") || changedProperties.has("step")) {
      this.options = this.generateOptionsArray();
      this.highlightedIndex = 0;
      this.handleMenuOption(null, this.options[0]);
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
  setQuantityChangeHandler(callback) {
    this.quantityChangeHandler = callback;
  }
  handleMenuOption(event, option) {
    this.selectedValue = option;
    this.parentElement.value = option;
    if (this.quantityChangeHandler) {
      this.quantityChangeHandler(option);
    }
    this.sendEvent();
    this.closePopover();
  }
  sendEvent() {
    const customEvent = new CustomEvent("selection-changed", {
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
                        @click="${(e) => this.handleMenuOption(e, option)}"
                        @mouseenter="${() => this.handleMouseEnter(index)}"
                    >
                        ${option}
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
                />
                <button class="picker-button" @click="${this.toggleMenu}">
                    <div
                        class="picker-button-fill ${this.closed ? "open" : "closed"}"
                    ></div>
                </button>
                ${this.popover};
            </div>
        `;
  }
};
customElements.define("merch-quantity-select", MerchQuantitySelect);
export {
  MerchQuantitySelect
};

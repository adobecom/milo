var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/merch-mnemonic-list.js
import { html, css, LitElement } from "../lit-all.min.js";
var MerchMnemonicList = class extends LitElement {
  constructor() {
    super();
  }
  render() {
    return html`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `;
  }
};
__publicField(MerchMnemonicList, "styles", css`
        :host {
            display: flex;
            flex-wrap: nowrap;
            gap: 8px;
            margin-right: 16px;
            align-items: center;
        }

        ::slotted([slot='icon']) {
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
        }

        ::slotted([slot='description']) {
            font-size: 14px;
            line-height: 21px;
            margin: 0;
        }

        :host .hidden {
            display: none;
        }
    `);
__publicField(MerchMnemonicList, "properties", {
  description: { type: String, attribute: true }
});
customElements.define("merch-mnemonic-list", MerchMnemonicList);
export {
  MerchMnemonicList
};

// branch: MWPW-142267 commit: db56fa6d1f49aa580f3da94842ffb9e73516ee18 Mon, 08 Jul 2024 21:06:50 GMT

// src/merch-mnemonic-list.js
import { html, css, LitElement } from "/libs/deps/lit-all.min.js";
var MerchMnemonicList = class extends LitElement {
  static styles = css`
        :host {
            display: flex;
            flex-direction: row;
            gap: 10px;
            margin-bottom: 10px;
            align-items: flex-end;
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
    `;
  static properties = {
    description: { type: String, attribute: true }
  };
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
customElements.define("merch-mnemonic-list", MerchMnemonicList);
export {
  MerchMnemonicList
};

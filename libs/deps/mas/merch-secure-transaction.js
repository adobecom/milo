var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/merch-secure-transaction.js
import { LitElement, html } from "../lit-all.min.js";

// src/merch-secure-transaction.css.js
import { css } from "../lit-all.min.js";
var styles = css`
    #label {
        align-items: center;
        cursor: pointer;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxxs);
        white-space: nowrap;
        font-size: 12px;
        line-height: 15px;
    }

    #label.icon::before {
        background-position: center;
        background-size: contain;
        background: var(--secure-icon) no-repeat;
        content: '';
        display: inline-block;
        height: 1em;
        width: 1em;
    }
`;

// src/merch-secure-transaction.js
var TAG_NAME = "merch-secure-transaction";
var MerchSecureTransaction = class extends LitElement {
  constructor() {
    super();
    this.labelText = "";
    this.showIcon = true;
    this.tooltipText = "";
  }
  render() {
    const { labelText, showIcon, tooltipText } = this;
    const label = html`
            <div class="${showIcon ? "icon" : ""}" id="label" slot="trigger">
                ${labelText}
            </div>
        `;
    if (!tooltipText)
      return label;
    return html`
            <overlay-trigger placement="top-start" offset="4">
                ${label}
                <sp-tooltip id="tooltip" slot="hover-content" delayed
                    >${tooltipText}</sp-tooltip
                >
            </overlay-trigger>
        `;
  }
};
__publicField(MerchSecureTransaction, "properties", {
  labelText: { attribute: "label", type: String },
  showIcon: { attribute: "icon", type: Boolean },
  tooltipText: { attribute: "tooltip", type: String }
});
__publicField(MerchSecureTransaction, "styles", [styles]);
window.customElements.define(TAG_NAME, MerchSecureTransaction);
export {
  MerchSecureTransaction as default
};

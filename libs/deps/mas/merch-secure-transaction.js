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
  static properties = {
    labelText: { attribute: "label", type: String },
    showIcon: { attribute: "icon", type: Boolean },
    tooltipText: { attribute: "tooltip", type: String }
  };
  static styles = [styles];
  labelText = "";
  showIcon = true;
  tooltipText = "";
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
window.customElements.define(TAG_NAME, MerchSecureTransaction);
export {
  MerchSecureTransaction as default
};

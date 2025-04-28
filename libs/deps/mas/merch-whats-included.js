var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/merch-whats-included.js
import { html, css, LitElement } from "../lit-all.min.js";
var MerchWhatsIncluded = class extends LitElement {
  updated() {
    this.hideSeeMoreEls();
  }
  hideSeeMoreEls() {
    if (this.isMobile) {
      this.rows.forEach((node, index) => {
        if (index >= 5) {
          node.style.display = this.showAll ? "flex" : "none";
        }
      });
    }
  }
  constructor() {
    super();
    this.showAll = false;
    this.mobileRows = this.mobileRows === void 0 ? 5 : this.mobileRows;
  }
  toggle() {
    this.showAll = !this.showAll;
    this.dispatchEvent(
      new CustomEvent("hide-see-more-elements", {
        bubbles: true,
        composed: true
      })
    );
    this.requestUpdate();
  }
  render() {
    return html`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile && this.rows.length > this.mobileRows ? html`<div @click=${this.toggle} class="see-more">
                      ${this.showAll ? "- See less" : "+ See more"}
                  </div>` : html``}`;
  }
  get isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  get rows() {
    return this.querySelectorAll("merch-mnemonic-list");
  }
};
__publicField(MerchWhatsIncluded, "styles", css`
        :host {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            overflow: hidden;
            box-sizing: border-box;
            row-gap: 10px;
        }

        ::slotted([slot='heading']) {
            font-size: 14px;
            font-weight: 700;
            margin-right: 16px;
        }

        ::slotted([slot='content']) {
            display: contents;
        }

        .hidden {
            display: none;
        }

        .see-more {
            font-size: 14px;
            text-decoration: underline;
            color: var(--link-color-dark);
        }
    `);
__publicField(MerchWhatsIncluded, "properties", {
  heading: { type: String, attribute: true },
  mobileRows: { type: Number, attribute: true }
});
customElements.define("merch-whats-included", MerchWhatsIncluded);
export {
  MerchWhatsIncluded
};

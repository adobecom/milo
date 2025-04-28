var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/merch-icon.js
import { LitElement, html, css } from "../lit-all.min.js";
var MerchIcon = class extends LitElement {
  constructor() {
    super();
    this.size = "m";
    this.alt = "";
    this.loading = "lazy";
  }
  render() {
    const { href } = this;
    return href ? html`<a href="${href}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>` : html` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`;
  }
};
__publicField(MerchIcon, "properties", {
  size: { type: String, attribute: true },
  src: { type: String, attribute: true },
  alt: { type: String, attribute: true },
  href: { type: String, attribute: true },
  loading: { type: String, attribute: true }
});
__publicField(MerchIcon, "styles", css`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }
    `);
customElements.define("merch-icon", MerchIcon);
export {
  MerchIcon as default
};

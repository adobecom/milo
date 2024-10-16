// src/merch-card.js
import { LitElement as LitElement2 } from "../lit-all.min.js";

// src/merch-icon.js
import { LitElement, html, css } from "../lit-all.min.js";
var MerchIcon = class extends LitElement {
  static properties = {
    size: { type: String, attribute: true },
    src: { type: String, attribute: true },
    alt: { type: String, attribute: true },
    href: { type: String, attribute: true }
  };
  constructor() {
    super();
    this.size = "m";
    this.alt = "";
  }
  render() {
    const { href } = this;
    return href ? html`<a href="${href}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>` : html` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`;
  }
  static styles = css`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--img-width);
            height: var(--img-height);
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `;
};
customElements.define("merch-icon", MerchIcon);

// src/merch-card.css.js
import { css as css2, unsafeCSS } from "../lit-all.min.js";

// src/media.js
var MOBILE_LANDSCAPE = "(max-width: 767px)";
var TABLET_DOWN = "(max-width: 1199px)";
var TABLET_UP = "(min-width: 768px)";
var DESKTOP_UP = "(min-width: 1200px)";
var LARGE_DESKTOP = "(min-width: 1600px)";

// src/merch-card.css.js
var styles = css2`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: start;
        background-color: var(--merch-card-background-color);
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--merch-card-background-color);
        font-family: var(--body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: 1px solid var(--consonant-merch-card-border-color);
        box-sizing: border-box;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-sizing: border-box;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
    }

    .top-section.badge {
        min-height: 32px;
    }

    .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs);
    }

    footer {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        align-items: flex-end;
        width: 100%;
        flex-flow: wrap;
        gap: var(--consonant-merch-spacing-xs);

        padding: var(--consonant-merch-spacing-xs);
    }

    hr {
        background-color: var(--color-gray-200);
        border: none;
        height: 1px;
        width: auto;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: var(--consonant-merch-spacing-xs);
        margin-right: var(--consonant-merch-spacing-xs);
    }

    div[class$='-badge'] {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: var(--type-heading-xxs-size);
        font-weight: 500;
        max-width: 180px;
        line-height: 16px;
        text-align: center;
        padding: 8px 11px;
        border-radius: 5px 0 0 5px;
    }

    div[class$='-badge']:dir(rtl) {
        left: 0;
        right: initial;
        padding: 8px 11px;
        border-radius: 0 5px 5px 0;
    }

    .detail-bg-container {
        right: 0;
        padding: var(--consonant-merch-spacing-xs);
        border-radius: 5px;
        font-size: var(--consonant-merch-card-body-font-size);
        margin: var(--consonant-merch-spacing-xs);
    }

    .action-menu {
        display: flex;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px 16px;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--color-gray-600);
    }

    #stock-checkbox {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 10px; /*same as spectrum */
    }

    #stock-checkbox > input {
        display: none;
    }

    #stock-checkbox > span {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid rgb(117, 117, 117);
        border-radius: 2px;
        width: 14px;
        height: 14px;
    }

    #stock-checkbox > input:checked + span {
        background: var(--checkmark-icon) no-repeat var(--color-accent);
        border-color: var(--color-accent);
    }

    .secure-transaction-label {
        white-space: nowrap;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxs);
        align-items: center;
        flex: 1;
        line-height: normal;
    }

    .secure-transaction-label::before {
        display: inline-block;
        content: '';
        width: 12px;
        height: 15px;
        background: var(--secure-icon) no-repeat;
        background-position: center;
        background-size: contain;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
    }

    .checkbox-container input[type='checkbox']:checked + .checkmark {
        background-color: var(--color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--color-accent);
    }

    .checkbox-container input[type='checkbox'] {
        display: none;
    }

    .checkbox-container .checkmark {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #757575;
        background: #fff;
        border-radius: 2px;
        cursor: pointer;
        margin-top: 2px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
    }
`;
var sizeStyles = () => {
  const styles3 = [
    css2`
        /* Tablet */
        @media screen and ${unsafeCSS(TABLET_UP)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${unsafeCSS(DESKTOP_UP)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `
  ];
  return styles3;
};

// src/variants/variant-layout.js
import { html as html2 } from "../lit-all.min.js";
var VariantLayout = class _VariantLayout {
  static styleMap = {};
  card;
  #container;
  getContainer() {
    this.#container = this.#container ?? this.card.closest('[class*="-merch-cards"]') ?? this.card.parentElement;
    return this.#container;
  }
  insertVariantStyle() {
    if (!_VariantLayout.styleMap[this.card.variant]) {
      _VariantLayout.styleMap[this.card.variant] = true;
      const styles3 = document.createElement("style");
      styles3.innerHTML = this.getGlobalCSS();
      document.head.appendChild(styles3);
    }
  }
  updateCardElementMinHeight(el, name) {
    if (!el)
      return;
    const elMinHeightPropertyName = `--consonant-merch-card-${this.card.variant}-${name}-height`;
    const height = Math.max(
      0,
      parseInt(window.getComputedStyle(el).height) || 0
    );
    const maxMinHeight = parseInt(
      this.getContainer().style.getPropertyValue(
        elMinHeightPropertyName
      )
    ) || 0;
    if (height > maxMinHeight) {
      this.getContainer().style.setProperty(
        elMinHeightPropertyName,
        `${height}px`
      );
    }
  }
  constructor(card) {
    this.card = card;
    this.insertVariantStyle();
  }
  get badge() {
    let additionalStyles;
    if (!this.card.badgeBackgroundColor || !this.card.badgeColor || !this.card.badgeText) {
      return;
    }
    if (this.evergreen) {
      additionalStyles = `border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`;
    }
    return html2`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${additionalStyles}"
            >
                ${this.card.badgeText}
            </div>
        `;
  }
  get cardImage() {
    return html2` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`;
  }
  /* c8 ignore next 3 */
  getGlobalCSS() {
    return "";
  }
  /* c8 ignore next 3 */
  get theme() {
    return document.querySelector("sp-theme");
  }
  get evergreen() {
    return this.card.classList.contains("intro-pricing");
  }
  get promoBottom() {
    return this.card.classList.contains("promo-bottom");
  }
  get headingSelector() {
    return '[slot="heading-xs"]';
  }
  get strip() {
    if (this.card.stripSize && this.card.stripBackground) {
      switch (this.card.stripSize) {
        case "wide":
          return "44px";
        case "small":
          return "4px";
        default:
          return "0";
      }
    }
    return "";
  }
  get stripStyle() {
    if (this.strip && this.card.stripBackground) {
      return `
          background: ${this.card.stripBackground.startsWith("url") ? this.card.stripBackground : `url("${this.card.stripBackground}")`};
          background-size: ${this.strip} 100%;
          background-repeat: no-repeat;
          background-position: ${this.card.theme.dir === "ltr" ? "left" : "right"};
        `;
    }
    return "";
  }
  get secureLabelFooter() {
    const secureLabel = this.card.secureLabel ? html2`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >` : "";
    return html2`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
  }
  async adjustTitleWidth() {
    const cardWidth = this.card.getBoundingClientRect().width;
    const badgeWidth = this.card.badgeElement?.getBoundingClientRect().width || 0;
    if (cardWidth === 0 || badgeWidth === 0)
      return;
    this.card.style.setProperty(
      "--consonant-merch-card-heading-xs-max-width",
      `${Math.round(cardWidth - badgeWidth - 16)}px`
      // consonant-merch-spacing-xs
    );
  }
  postCardUpdateHook() {
  }
  connectedCallbackHook() {
  }
  disconnectedCallbackHook() {
  }
  /* c8 ignore next 3 */
  renderLayout() {
  }
  /* c8 ignore next 4 */
  get aemFragmentMapping() {
    return void 0;
  }
};

// src/variants/catalog.js
import { html as html3, css as css3 } from "../lit-all.min.js";

// src/utils.js
function createTag(tag, attributes = {}, content) {
  const element = document.createElement(tag);
  if (content instanceof HTMLElement) {
    element.appendChild(content);
  } else {
    element.innerHTML = content;
  }
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}
function isMobile() {
  return window.matchMedia("(max-width: 767px)").matches;
}
function isMobileOrTablet() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

// src/constants.js
var EVENT_MERCH_OFFER_SELECT_READY = "merch-offer-select:ready";
var EVENT_MERCH_CARD_READY = "merch-card:ready";
var EVENT_MERCH_CARD_ACTION_MENU_TOGGLE = "merch-card:action-menu-toggle";
var EVENT_MERCH_STORAGE_CHANGE = "merch-storage:change";
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";
var EVENT_AEM_LOAD = "aem:load";
var EVENT_AEM_ERROR = "aem:error";
var EVENT_MAS_READY = "mas:ready";
var EVENT_MAS_ERROR = "mas:error";

// src/variants/catalog.css.js
var CSS = `
:root {
  --consonant-merch-card-catalog-width: 276px;
  --consonant-merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

@media screen and ${TABLET_UP} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${DESKTOP_UP} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${LARGE_DESKTOP} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
    }
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
  background-color: #000;
  color: var(--color-white, #fff);
  font-size: var(--consonant-merch-card-body-xs-font-size);
  width: fit-content;
  padding: var(--consonant-merch-spacing-xs);
  border-radius: var(--consonant-merch-spacing-xxxs);
  position: absolute;
  top: 55px;
  right: 15px;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul {
  padding-left: 0;
  padding-bottom: var(--consonant-merch-spacing-xss);
  margin-top: 0;
  margin-bottom: 0;
  list-style-position: inside;
  list-style-type: '\u2022 ';
}

merch-card[variant="catalog"] [slot="action-menu-content"] ul li {
  padding-left: 0;
  line-height: var(--consonant-merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ::marker {
  margin-right: 0;
}

merch-card[variant="catalog"] [slot="action-menu-content"] p {
  color: var(--color-white, #fff);
}

merch-card[variant="catalog"] [slot="action-menu-content"] a {
  color: var(--merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`;

// src/variants/catalog.js
var AEM_FRAGMENT_MAPPING = {
  title: { tag: "h3", slot: "heading-xs" },
  prices: { tag: "h3", slot: "heading-xs" },
  description: { tag: "div", slot: "body-xs" },
  ctas: { size: "l" },
  allowedSizes: ["wide", "super-wide"]
};
var Catalog = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING;
  }
  renderLayout() {
    return html3` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${isMobileOrTablet() && this.card.actionMenu ? "always-visible" : ""}
                ${!this.card.actionMenu ? "hidden" : "invisible"}"
                        @click="${this.toggleActionMenu}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${!this.card.actionMenuContent ? "hidden" : ""}"
                    >${this.card.actionMenuContent}</slot
                >
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${!this.promoBottom ? html3`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>` : ""}
                <slot name="body-xs"></slot>
                ${this.promoBottom ? html3`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>` : ""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`;
  }
  getGlobalCSS() {
    return CSS;
  }
  toggleActionMenu = (e) => {
    const retract = e?.type === "mouseleave" ? true : void 0;
    const actionMenuContentSlot = this.card.shadowRoot.querySelector(
      'slot[name="action-menu-content"]'
    );
    if (!actionMenuContentSlot)
      return;
    if (!retract) {
      this.card.dispatchEvent(
        new CustomEvent(EVENT_MERCH_CARD_ACTION_MENU_TOGGLE, {
          bubbles: true,
          composed: true,
          detail: {
            card: this.card.name,
            type: "action-menu"
          }
        })
      );
    }
    actionMenuContentSlot.classList.toggle("hidden", retract);
  };
  connectedCallbackHook() {
    this.card.addEventListener("mouseleave", this.toggleActionMenu);
  }
  disconnectedCallbackHook() {
    this.card.removeEventListener("mouseleave", this.toggleActionMenu);
  }
  static variantStyle = css3`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--consonant-merch-card-catalog-width);
        }

        .body .catalog-badge {
            display: flex;
            height: fit-content;
            flex-direction: column;
            width: fit-content;
            max-width: 140px;
            border-radius: 5px;
            position: relative;
            top: 0;
            margin-left: var(--consonant-merch-spacing-xxs);
            box-sizing: border-box;
        }
    `;
};

// src/variants/ccd-action.js
import { html as html4, css as css4 } from "../lit-all.min.js";

// src/variants/ccd-action.css.js
var CSS2 = `
:root {
  --consonant-merch-card-ccd-action-width: 276px;
  --consonant-merch-card-ccd-action-min-height: 320px;
}

.one-merch-card.ccd-action,
.two-merch-cards.ccd-action,
.three-merch-cards.ccd-action,
.four-merch-cards.ccd-action {
    grid-template-columns: var(--consonant-merch-card-ccd-action-width);
}

merch-card[variant="ccd-action"] .price-strikethrough {
    font-size: 18px;
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.ccd-action,
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(2, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${DESKTOP_UP} {
  .three-merch-cards.ccd-action,
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(3, var(--consonant-merch-card-ccd-action-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.ccd-action {
      grid-template-columns: repeat(4, var(--consonant-merch-card-ccd-action-width));
  }
}
`;

// src/variants/ccd-action.js
var AEM_FRAGMENT_MAPPING2 = {
  title: { tag: "h3", slot: "heading-xs" },
  prices: { tag: "h3", slot: "heading-xs" },
  description: { tag: "div", slot: "body-xs" },
  ctas: { size: "l" }
};
var CCDAction = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS2;
  }
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING2;
  }
  // This variant might go away, will not implement code coverage for now.
  /* c8 ignore next 15 */
  renderLayout() {
    return html4` <div class="body">
            <slot name="icons"></slot> ${this.badge}
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            ${this.promoBottom ? html4`<slot name="body-xs"></slot
                      ><slot name="promo-text"></slot>` : html4`<slot name="promo-text"></slot
                      ><slot name="body-xs"></slot>`}
            <footer><slot name="footer"></slot></footer>
            <slot></slot>
        </div>`;
  }
  static variantStyle = css4`
        :host([variant='ccd-action']:not([size])) {
            width: var(--consonant-merch-card-ccd-action-width);
        }
    `;
};

// src/variants/image.js
import { html as html5 } from "../lit-all.min.js";

// src/variants/image.css.js
var CSS3 = `
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width));
  }
}
`;

// src/variants/image.js
var Image = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS3;
  }
  renderLayout() {
    return html5`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom ? html5`<slot name="body-xs"></slot><slot name="promo-text"></slot>` : html5`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen ? html5`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card["detailBg"]}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          ` : html5`
              <hr />
              ${this.secureLabelFooter}
          `}`;
  }
};

// src/variants/inline-heading.js
import { html as html6 } from "../lit-all.min.js";

// src/variants/inline-heading.css.js
var CSS4 = `
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${TABLET_UP} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;

// src/variants/inline-heading.js
var InlineHeading = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS4;
  }
  renderLayout() {
    return html6` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${!this.card.customHr ? html6`<hr />` : ""} ${this.secureLabelFooter}`;
  }
};

// src/variants/mini-compare-chart.js
import { html as html7, css as css5, unsafeCSS as unsafeCSS2 } from "../lit-all.min.js";

// src/variants/mini-compare-chart.css.js
var CSS5 = `
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] [is="inline-price"] {
    min-height: unset;
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] a {
    display: inline-block;
    height: 27px;
  }

  merch-card[variant="mini-compare-chart"] [slot="offers"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon {
    display: flex;
    place-items: center;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon img {
    max-width: initial;
    width: var(--consonant-merch-card-mini-compare-chart-icon-size);
    height: var(--consonant-merch-card-mini-compare-chart-icon-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--consonant-merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description p {
    color: var(--merch-color-grey-80);
    vertical-align: bottom;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description a {
    color: var(--color-accent);
    text-decoration: solid;
  }
  
.one-merch-card.mini-compare-chart {
  grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  gap: var(--consonant-merch-spacing-xs);
}

.two-merch-cards.mini-compare-chart,
.three-merch-cards.mini-compare-chart,
.four-merch-cards.mini-compare-chart {
  grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-width));
  gap: var(--consonant-merch-spacing-xs);
}

/* mini compare mobile */ 
@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart,
  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-width);
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
}

@media screen and ${TABLET_DOWN} {
  .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
  .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
    flex: 1;
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }
}
@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 302px;
    --consonant-merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-mini-compare-chart-width: 378px;
    --consonant-merch-card-mini-compare-chart-wide-width: 484px;  
  }
  .one-merch-card.mini-compare-chart {
    grid-template-columns: var(--consonant-merch-card-mini-compare-chart-wide-width);
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, var(--consonant-merch-card-mini-compare-chart-wide-width));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(3, var(--consonant-merch-card-mini-compare-chart-width));
    gap: var(--consonant-merch-spacing-m);
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
  }
}

merch-card .footer-row-cell:nth-child(1) {
  min-height: var(--consonant-merch-card-footer-row-1-min-height);
}

merch-card .footer-row-cell:nth-child(2) {
  min-height: var(--consonant-merch-card-footer-row-2-min-height);
}

merch-card .footer-row-cell:nth-child(3) {
  min-height: var(--consonant-merch-card-footer-row-3-min-height);
}

merch-card .footer-row-cell:nth-child(4) {
  min-height: var(--consonant-merch-card-footer-row-4-min-height);
}

merch-card .footer-row-cell:nth-child(5) {
  min-height: var(--consonant-merch-card-footer-row-5-min-height);
}

merch-card .footer-row-cell:nth-child(6) {
  min-height: var(--consonant-merch-card-footer-row-6-min-height);
}

merch-card .footer-row-cell:nth-child(7) {
  min-height: var(--consonant-merch-card-footer-row-7-min-height);
}

merch-card .footer-row-cell:nth-child(8) {
  min-height: var(--consonant-merch-card-footer-row-8-min-height);
}
`;

// src/variants/mini-compare-chart.js
var FOOTER_ROW_MIN_HEIGHT = 32;
var MiniCompareChart = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getRowMinHeightPropertyName = (index) => `--consonant-merch-card-footer-row-${index}-min-height`;
  getGlobalCSS() {
    return CSS5;
  }
  getMiniCompareFooter = () => {
    const secureLabel = this.card.secureLabel ? html7`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >` : html7`<slot name="secure-transaction-label"></slot>`;
    return html7`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
  };
  adjustMiniCompareBodySlots() {
    if (this.card.getBoundingClientRect().width <= 2)
      return;
    this.updateCardElementMinHeight(
      this.card.shadowRoot.querySelector(".top-section"),
      "top-section"
    );
    const slots = [
      "heading-m",
      "body-m",
      "heading-m-price",
      "body-xxs",
      "price-commitment",
      "offers",
      "promo-text",
      "callout-content"
    ];
    slots.forEach(
      (slot) => this.updateCardElementMinHeight(
        this.card.shadowRoot.querySelector(`slot[name="${slot}"]`),
        slot
      )
    );
    this.updateCardElementMinHeight(
      this.card.shadowRoot.querySelector("footer"),
      "footer"
    );
    const badge = this.card.shadowRoot.querySelector(
      ".mini-compare-chart-badge"
    );
    if (badge && badge.textContent !== "") {
      this.getContainer().style.setProperty(
        "--consonant-merch-card-mini-compare-chart-top-section-mobile-height",
        "32px"
      );
    }
  }
  adjustMiniCompareFooterRows() {
    if (this.card.getBoundingClientRect().width === 0)
      return;
    const footerRows = this.card.querySelector('[slot="footer-rows"]');
    [...footerRows?.children].forEach((el, index) => {
      const height = Math.max(
        FOOTER_ROW_MIN_HEIGHT,
        parseFloat(window.getComputedStyle(el).height) || 0
      );
      const maxMinHeight = parseFloat(
        this.getContainer().style.getPropertyValue(
          this.getRowMinHeightPropertyName(index + 1)
        )
      ) || 0;
      if (height > maxMinHeight) {
        this.getContainer().style.setProperty(
          this.getRowMinHeightPropertyName(index + 1),
          `${height}px`
        );
      }
    });
  }
  removeEmptyRows() {
    const footerRows = this.card.querySelectorAll(".footer-row-cell");
    footerRows.forEach((row) => {
      const rowDescription = row.querySelector(".footer-row-cell-description");
      if (rowDescription) {
        const isEmpty = !rowDescription.textContent.trim();
        if (isEmpty) {
          row.remove();
        }
      }
    });
  }
  renderLayout() {
    return html7` <div class="top-section${this.badge ? " badge" : ""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        <slot name="body-m"></slot>
        <slot name="heading-m-price"></slot>
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`;
  }
  async postCardUpdateHook() {
    if (!isMobile()) {
      await Promise.all(this.card.prices.map((price) => price.onceSettled()));
      this.adjustMiniCompareBodySlots();
      this.adjustMiniCompareFooterRows();
    } else {
      this.removeEmptyRows();
    }
  }
  static variantStyle = css5`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    @media screen and ${unsafeCSS2(TABLET_DOWN)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${unsafeCSS2(DESKTOP_UP)} {
        :host([variant='mini-compare-chart']) footer {
            padding: var(--consonant-merch-spacing-xs)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s)
                var(--consonant-merch-spacing-s);
        }
    }

    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: end;
    }
    /* mini-compare card heights for the slots: heading-m, body-m, heading-m-price, price-commitment, offers, promo-text, footer */
    :host([variant='mini-compare-chart']) slot[name='heading-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='body-xxs'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-body-xxs-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-mini-compare-chart-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-callout-content-height
        );
    }
  `;
};

// src/variants/plans.js
import { html as html8, css as css6 } from "../lit-all.min.js";

// src/variants/plans.css.js
var CSS6 = `
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-icon-size: 40px;
}
  
merch-card[variant="plans"] [slot="description"] {
  min-height: 84px;
}

merch-card[variant="plans"] [slot="quantity-select"] {
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: var(--consonant-merch-spacing-xs);
}

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${LARGE_DESKTOP} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;

// src/variants/plans.js
var Plans = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS6;
  }
  postCardUpdateHook() {
    this.adjustTitleWidth();
  }
  get stockCheckbox() {
    return this.card.checkboxLabel ? html8`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>` : "";
  }
  renderLayout() {
    return html8` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${!this.promoBottom ? html8`<slot name="promo-text"></slot><slot name="callout-content"></slot> ` : ""}
            <slot name="body-xs"></slot>
            ${this.promoBottom ? html8`<slot name="promo-text"></slot><slot name="callout-content"></slot> ` : ""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`;
  }
  static variantStyle = css6`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `;
};

// src/variants/product.js
import { html as html9, css as css7 } from "../lit-all.min.js";

// src/variants/product.css.js
var CSS7 = `
:root {
  --consonant-merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${TABLET_UP} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-product-width: 378px;
  }
    
  .three-merch-cards.product,
  .four-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }
}

/* Large desktop */
@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width));
  }
}
`;

// src/variants/product.js
var Product = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS7;
  }
  adjustProductBodySlots() {
    if (this.card.getBoundingClientRect().width === 0)
      return;
    const slots = [
      "heading-xs",
      "body-xxs",
      "body-xs",
      "promo-text",
      "callout-content",
      "body-lower"
    ];
    slots.forEach(
      (slot) => this.updateCardElementMinHeight(
        this.card.shadowRoot.querySelector(`slot[name="${slot}"]`),
        slot
      )
    );
  }
  renderLayout() {
    return html9` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${!this.promoBottom ? html9`<slot name="promo-text"></slot>` : ""}
          <slot name="body-xs"></slot>
          ${this.promoBottom ? html9`<slot name="promo-text"></slot>` : ""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`;
  }
  connectedCallbackHook() {
    super.connectedCallbackHook();
    window.addEventListener("resize", this.postCardUpdateHook.bind(this));
  }
  postCardUpdateHook() {
    if (!isMobile()) {
      this.adjustProductBodySlots();
    }
  }
  static variantStyle = css7`
    :host([variant='product']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='product']) slot[name='body-xs'] {
        min-height: var(--consonant-merch-card-product-body-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='heading-xs'] {
        min-height: var(--consonant-merch-card-product-heading-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='body-xxs'] {
        min-height: var(--consonant-merch-card-product-body-xxs-height);
        display: block;
    }
    :host([variant='product']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-product-promo-text-height);
        display: block;
    }
    :host([variant='product']) slot[name='callout-content'] {
        min-height: var(--consonant-merch-card-product-callout-content-height);
        display: block;
    }
  `;
};

// src/variants/segment.js
import { html as html10, css as css8 } from "../lit-all.min.js";

// src/variants/segment.css.js
var CSS8 = `
:root {
  --consonant-merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--consonant-merch-card-segment-width));
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--consonant-merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--consonant-merch-card-segment-width)));
  }
}
`;

// src/variants/segment.js
var Segment = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS8;
  }
  postCardUpdateHook() {
    this.adjustTitleWidth();
  }
  renderLayout() {
    return html10` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${!this.promoBottom ? html10`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
        <slot name="body-xs"></slot>
        ${this.promoBottom ? html10`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
    </div>
    <hr />
    ${this.secureLabelFooter}`;
  }
  static variantStyle = css8`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `;
};

// src/variants/special-offer.js
import { html as html11, css as css9 } from "../lit-all.min.js";

// src/variants/special-offer.css.js
var CSS9 = `
:root {
  --consonant-merch-card-special-offers-width: 378px;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
}

/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
  grid-template-columns: minmax(300px, var(--consonant-merch-card-special-offers-width));
}

@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
    
  .two-merch-cards.special-offers,
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
      grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

/* desktop */
@media screen and ${DESKTOP_UP} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${LARGE_DESKTOP} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;

// src/variants/special-offer.js
var AEM_FRAGMENT_MAPPING3 = {
  name: { tag: "h4", slot: "detail-m" },
  title: { tag: "h4", slot: "detail-m" },
  backgroundImage: { tag: "div", slot: "bg-image" },
  prices: { tag: "h3", slot: "heading-xs" },
  description: { tag: "div", slot: "body-xs" },
  ctas: { size: "l" }
};
var SpecialOffer = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS9;
  }
  get headingSelector() {
    return '[slot="detail-m"]';
  }
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING3;
  }
  renderLayout() {
    return html11`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen ? html11`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card["detailBg"]}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  ` : html11`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`;
  }
  static variantStyle = css9`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `;
};

// src/variants/twp.js
import { html as html12, css as css10 } from "../lit-all.min.js";

// src/variants/twp.css.js
var CSS10 = `
:root {
  --consonant-merch-card-twp-width: 268px;
  --consonant-merch-card-twp-mobile-width: 300px;
  --consonant-merch-card-twp-mobile-height: 358px;
}
  
merch-card[variant="twp"] div[class$='twp-badge'] {
  padding: 4px 10px 5px 10px;
}

merch-card[variant="twp"] [slot="body-xs-top"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  color: var(--merch-color-grey-80);
}

merch-card[variant="twp"] [slot="body-xs"] ul {
  padding: 0;
  margin: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li {
  list-style-type: none;
  padding-left: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li::before {
  content: '\xB7';
  font-size: 20px;
  padding-right: 5px;
  font-weight: bold;
}

merch-card[variant="twp"] [slot="footer"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  padding: var(--consonant-merch-spacing-s);
  var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
  color: var(--merch-color-grey-80);
  display: flex;
  flex-flow: wrap;
}

merch-card[variant='twp'] merch-quantity-select,
merch-card[variant='twp'] merch-offer-select {
  display: none;
}

.one-merch-card.twp,
.two-merch-cards.twp,
.three-merch-cards.twp {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${MOBILE_LANDSCAPE} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${TABLET_UP} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
  
@media screen and ${DESKTOP_UP} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}

@media screen and ${LARGE_DESKTOP} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;

// src/variants/twp.js
var TWP = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS10;
  }
  renderLayout() {
    return html12`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`;
  }
  static variantStyle = css10`
    :host([variant='twp']) {
      padding: 4px 10px 5px 10px;
    }
    .twp-badge {
      padding: 4px 10px 5px 10px;
    }

    :host([variant='twp']) ::slotted(merch-offer-select) {
      display: none;
    }

    :host([variant='twp']) .top-section {
      flex: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      gap: var(--consonant-merch-spacing-xxs);
      padding: var(--consonant-merch-spacing-xs)
          var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs)
          var(--consonant-merch-spacing-xs);
      align-items: flex-start;
    }

    :host([variant='twp']) .body {
      padding: 0 var(--consonant-merch-spacing-xs);
    }
    
    :host([aria-selected]) .twp-badge {
        margin-inline-end: 2px;
        padding-inline-end: 9px;
    }

    :host([variant='twp']) footer {
      gap: var(--consonant-merch-spacing-xxs);
      flex-direction: column;
      align-self: flex-start;
    }
  `;
};

// src/variants/ccd-suggested.js
import { html as html13, css as css11 } from "../lit-all.min.js";

// src/variants/ccd-suggested.css.js
var CSS11 = `
:root {
  --merch-card-ccd-suggested-width: 304px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot="detail-m"] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--spectrum-gray-800, #F8F8F8);
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);

}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  text-decoration: none;
  color: var(--spectrum-gray-800);
  font-weight: 700;
}
`;

// src/variants/ccd-suggested.js
var AEM_FRAGMENT_MAPPING4 = {
  subtitle: { tag: "h4", slot: "detail-m" },
  title: { tag: "h3", slot: "heading-xs" },
  prices: { tag: "p", slot: "price" },
  description: { tag: "div", slot: "body-xs" },
  ctas: { slot: "cta", size: "s", button: false }
};
var CCDSuggested = class extends VariantLayout {
  getGlobalCSS() {
    return CSS11;
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING4;
  }
  renderLayout() {
    return html13`
          <div style="${this.stripStyle}" class="body">
              <div class="header">
                <slot name="icons"></slot>
                <div class="headings">
                  <slot name="detail-m"></slot>
                  <slot name="heading-xs"></slot>
                </div>
              </div>
              <slot name="body-xs"></slot>
              <div class="footer">
                <slot name="price"></slot>
                <slot name="cta"></slot>
              </div>
          </div>
                <slot></slot>`;
  }
  static variantStyle = css11`
    :host([variant='ccd-suggested']) {
      background-color: var(
        --spectrum-gray-50, #fff);
      width: var(--merch-card-ccd-suggested-width);
      min-height: var(--merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
    }

    :host([variant='ccd-suggested']) .body {
      height: auto;
    }

    :host([variant='ccd-suggested']) .header {
      display: flex;
      flex-flow: wrap;
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) .headings {
      padding-inline-start: var(--consonant-merch-spacing-xxs);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
      place-self: flex-start;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
      font-size: var(--merch-card-heading-xxs-font-size);
      line-height: var(--merch-card-heading-xxs-line-height);
    }
    
    :host([variant='ccd-suggested'][strip-size='wide']) ::slotted([slot='body-xs']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested'][strip-size='wide']) ::slotted([slot='price']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='price']) {
      display: flex;
      align-items: center;
      color: var(--spectrum-gray-800, #F8F8F8);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
      display: flex;
      align-items: center;
    }


    :host([variant='ccd-suggested']) .footer {
      display: flex;
      justify-content: space-between;
      flex-grow: 0;
      margin-top: auto;
      align-items: center;
    }
  `;
};

// src/variants/ccd-slice.js
import { html as html14, css as css12 } from "../lit-all.min.js";

// src/variants/ccd-slice.css.js
var CSS12 = `
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-icon-size: 30px;
  --consonant-merch-card-ccd-slice-wide-width: 600px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a:not(.con-button) {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    font-style: normal;
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    text-decoration-line: underline;
    color: var(--spectrum-blue-800, #147AF3);
  }

  merch-card[variant="ccd-slice"] [slot='image'] img {
    overflow: hidden;
    border-radius: 50%;
  }
`;

// src/variants/ccd-slice.js
var AEM_FRAGMENT_MAPPING5 = {
  backgroundImage: { tag: "div", slot: "image" },
  description: { tag: "div", slot: "body-s" },
  ctas: { size: "s" },
  allowedSizes: ["wide"]
};
var CCDSlice = class extends VariantLayout {
  getGlobalCSS() {
    return CSS12;
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return AEM_FRAGMENT_MAPPING5;
  }
  renderLayout() {
    return html14` <div class="content">
                <slot name="icons"></slot> ${this.badge}
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`;
  }
  static variantStyle = css12`
        :host([variant='ccd-slice']) {
            width: var(--consonant-merch-card-ccd-slice-single-width);
            background-color: var(
              --spectrum-gray-50, #fff);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--consonant-merch-card-ccd-slice-wide-width);
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: var(--consonant-merch-spacing-xs);
            padding-inline-end: 0;
            width: 154px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--merch-color-grey-80);
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: var(--consonant-merch-card-ccd-slice-background-img-size);
            height: var(--consonant-merch-card-ccd-slice-background-img-size);
            overflow: hidden;
            border-radius: 50%;
            padding: var(--consonant-merch-spacing-xs);
            align-self: center;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }
    `;
};

// src/variants/variants.js
var getVariantLayout = (card, mustMatch = false) => {
  switch (card.variant) {
    case "catalog":
      return new Catalog(card);
    case "ccd-action":
      return new CCDAction(card);
    case "image":
      return new Image(card);
    case "inline-heading":
      return new InlineHeading(card);
    case "mini-compare-chart":
      return new MiniCompareChart(card);
    case "plans":
      return new Plans(card);
    case "product":
      return new Product(card);
    case "segment":
      return new Segment(card);
    case "special-offers":
      return new SpecialOffer(card);
    case "twp":
      return new TWP(card);
    case "ccd-suggested":
      return new CCDSuggested(card);
    case "ccd-slice":
      return new CCDSlice(card);
    default:
      return mustMatch ? void 0 : new Product(card);
  }
};
var getVariantStyles = () => {
  const styles3 = [];
  styles3.push(Catalog.variantStyle);
  styles3.push(CCDAction.variantStyle);
  styles3.push(MiniCompareChart.variantStyle);
  styles3.push(Product.variantStyle);
  styles3.push(Plans.variantStyle);
  styles3.push(Segment.variantStyle);
  styles3.push(SpecialOffer.variantStyle);
  styles3.push(TWP.variantStyle);
  styles3.push(CCDSuggested.variantStyle);
  styles3.push(CCDSlice.variantStyle);
  return styles3;
};

// src/global.css.js
var styles2 = document.createElement("style");
styles2.innerHTML = `
:root {
    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
    --merch-card-heading-xxs-font-size: 16px;
    --merch-card-heading-xxs-line-height: 20px;
    --consonant-merch-card-heading-xs-font-size: 18px;
    --consonant-merch-card-heading-xs-line-height: 22.5px;
    --consonant-merch-card-heading-s-font-size: 20px;
    --consonant-merch-card-heading-s-line-height: 25px;
    --consonant-merch-card-heading-m-font-size: 24px;
    --consonant-merch-card-heading-m-line-height: 30px;
    --consonant-merch-card-heading-l-font-size: 20px;
    --consonant-merch-card-heading-l-line-height: 30px;
    --consonant-merch-card-heading-xl-font-size: 36px;
    --consonant-merch-card-heading-xl-line-height: 45px;

    /* detail */
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;

    /* body */
    --consonant-merch-card-body-xxs-font-size: 12px;
    --consonant-merch-card-body-xxs-line-height: 18px;
    --consonant-merch-card-body-xxs-letter-spacing: 1px;
    --consonant-merch-card-body-xs-font-size: 14px;
    --consonant-merch-card-body-xs-line-height: 21px;
    --consonant-merch-card-body-s-font-size: 16px;
    --consonant-merch-card-body-s-line-height: 24px;
    --consonant-merch-card-body-m-font-size: 18px;
    --consonant-merch-card-body-m-line-height: 27px;
    --consonant-merch-card-body-l-font-size: 20px;
    --consonant-merch-card-body-l-line-height: 30px;
    --consonant-merch-card-body-xl-font-size: 22px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --merch-card-background-color: var(--spectrum-gray-background-color-default, #fff);
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: #1473E6;
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-60: var(--spectrum-global-color-gray-600, #6D6D6D);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-green-promo: #2D9D78;

    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --consonant-merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --consonant-merch-card-callout-line-height: 21px;
    --consonant-merch-card-callout-font-size: 14px;
    --consonant-merch-card-callout-font-color: #2C2C2C;
    --consonant-merch-card-callout-icon-size: 16px;
    --consonant-merch-card-callout-icon-top: 6px;
    --consonant-merch-card-callout-icon-right: 8px;
    --consonant-merch-card-callout-letter-spacing: 0px;
    --consonant-merch-card-callout-icon-padding: 34px;
    --consonant-merch-card-callout-spacing-xxs: 8px;
}

merch-card-collection {
    display: contents;
}

merch-card-collection > merch-card:not([style]) {
    display: none;
}

merch-card-collection > p[slot],
merch-card-collection > div[slot] p {
    margin: 0;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    display: grid;
    justify-content: center;
    justify-items: stretch;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin-bottom: var(--consonant-merch-spacing-xs);
    height: 1px;
    border: none;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is=inline-price] {
    display: inline-block;
}

merch-card [slot='heading-xs'] {
    color: var(--spectrum-gray-800, #2c2c2c);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    margin: 0;
    text-decoration: none;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card div.starting-at {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
    font-weight: 700;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    font-weight: 700;
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
    align-items: flex-start;
}

merch-card [slot='callout-content'] > div > div {
    display: flex;
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
}

merch-card [slot='callout-content'] > div > div > div {
    display: inline-block;
    text-align: start;
    font: normal normal normal var(--consonant-merch-card-callout-font-size)/var(--consonant-merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--consonant-merch-card-callout-letter-spacing);
    color: var(--consonant-merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--consonant-merch-card-callout-icon-size);
    height: var(--consonant-merch-card-callout-icon-size);
    margin-inline-end: 2.5px;
    margin-inline-start: 9px;
    margin-block-start: 2.5px;
}

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
    color: var(--spectrum-gray-800, #2c2c2c);
    margin: 0;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-s"] {
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--spectrum-gray-800, #2c2c2c);
}

[slot="cci-footer"] p,
[slot="cct-footer"] p,
[slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
}

div[slot="footer"] {
    display: contents;
}

[slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

[slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
}

merch-card sp-button a {
  text-decoration: none;
    color: var(
        --highcontrast-button-content-color-default,
        var(
            --mod-button-content-color-default,
            var(--spectrum-button-content-color-default)
        )
    );
}

merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
}

/* merch-offer-select */
merch-offer-select[variant="subscription-options"] merch-offer span[is="inline-price"][data-display-tax='true'] .price-tax-inclusivity {
    font-size: 12px;
    font-style: italic;
    font-weight: normal;
    position: absolute;
    left: 0;
    top: 20px;
}

body.merch-modal {
    overflow: hidden;
    scrollbar-gutter: stable;
    height: 100vh;
}
`;
document.head.appendChild(styles2);

// src/hydrate.js
async function hydrate(fragmentData, merchCard) {
  const fragment = fragmentData.fields.reduce(
    (acc, { name, multiple, values }) => {
      acc[name] = multiple ? values : values[0];
      return acc;
    },
    { id: fragmentData.id }
  );
  const { variant } = fragment;
  if (!variant)
    return;
  fragment.model = fragment.model;
  merchCard.querySelectorAll("[slot]").forEach((el) => {
    el.remove();
  });
  merchCard.variant = variant;
  await merchCard.updateComplete;
  const { aemFragmentMapping } = merchCard.variantLayout;
  if (!aemFragmentMapping)
    return;
  const appendFn = (el) => {
    merchCard.append(el);
  };
  const mnemonics = fragment.mnemonicIcon?.map((icon, index) => ({
    icon,
    alt: fragment.mnemonicAlt[index] ?? "",
    link: fragment.mnemonicLink[index] ?? ""
  }));
  fragmentData.computed = { mnemonics };
  mnemonics.forEach(({ icon: src, alt, link: href }) => {
    const merchIcon = createTag("merch-icon", {
      slot: "icons",
      src,
      alt,
      href,
      size: "l"
    });
    appendFn(merchIcon);
  });
  if (!fragment.size) {
    merchCard.removeAttribute("size");
  } else if (aemFragmentMapping.allowedSizes?.includes(fragment.size))
    merchCard.setAttribute("size", fragment.size);
  if (fragment.cardTitle && aemFragmentMapping.title) {
    appendFn(
      createTag(
        aemFragmentMapping.title.tag,
        { slot: aemFragmentMapping.title.slot },
        fragment.cardTitle
      )
    );
  }
  if (fragment.subtitle && aemFragmentMapping.subtitle) {
    appendFn(
      createTag(
        aemFragmentMapping.subtitle.tag,
        { slot: aemFragmentMapping.subtitle.slot },
        fragment.subtitle
      )
    );
  }
  if (fragment.backgroundImage && aemFragmentMapping.backgroundImage) {
    appendFn(
      createTag(
        aemFragmentMapping.backgroundImage.tag,
        { slot: aemFragmentMapping.backgroundImage.slot },
        `<img loading="lazy" src="${fragment.backgroundImage}" />`
      )
    );
  }
  if (fragment.prices && aemFragmentMapping.prices) {
    const prices = fragment.prices;
    const headingM = createTag(
      aemFragmentMapping.prices.tag,
      { slot: aemFragmentMapping.prices.slot },
      prices
    );
    appendFn(headingM);
  }
  if (fragment.description && aemFragmentMapping.description) {
    const body = createTag(
      aemFragmentMapping.description.tag,
      { slot: aemFragmentMapping.description.slot },
      fragment.description
    );
    appendFn(body);
  }
  if (fragment.ctas) {
    const { slot, button = true } = aemFragmentMapping.ctas;
    const footer = createTag(
      "div",
      { slot: slot ?? "footer" },
      fragment.ctas
    );
    const ctas = [];
    [...footer.querySelectorAll("a")].forEach((cta) => {
      const strong = cta.parentElement.tagName === "STRONG";
      if (merchCard.consonant) {
        cta.classList.add("con-button");
        if (strong) {
          cta.classList.add("blue");
        }
        ctas.push(cta);
      } else {
        if (!button) {
          ctas.push(cta);
          return;
        }
        const treatment = strong ? "fill" : "outline";
        const variant2 = strong ? "accent" : "primary";
        const spectrumCta = createTag(
          "sp-button",
          { treatment, variant: variant2 },
          cta
        );
        spectrumCta.addEventListener("click", (e) => {
          if (e.target === spectrumCta) {
            e.stopPropagation();
            cta.click();
          }
        });
        ctas.push(spectrumCta);
      }
    });
    footer.innerHTML = "";
    footer.append(...ctas);
    appendFn(footer);
  }
}

// src/merch-card.js
var MERCH_CARD = "merch-card";
var MERCH_CARD_LOAD_TIMEOUT = 2e3;
var MerchCard = class extends LitElement2 {
  static properties = {
    name: { type: String, attribute: "name", reflect: true },
    variant: { type: String, reflect: true },
    size: { type: String, attribute: "size", reflect: true },
    badgeColor: { type: String, attribute: "badge-color" },
    borderColor: { type: String, attribute: "border-color" },
    badgeBackgroundColor: {
      type: String,
      attribute: "badge-background-color"
    },
    stripSize: { type: String, attribute: "strip-size" },
    stripBackground: { type: String, attribute: "strip-background" },
    badgeText: { type: String, attribute: "badge-text" },
    actionMenu: { type: Boolean, attribute: "action-menu" },
    customHr: { type: Boolean, attribute: "custom-hr" },
    consonant: { type: Boolean, attribute: "consonant" },
    detailBg: { type: String, attribute: "detail-bg" },
    secureLabel: { type: String, attribute: "secure-label" },
    checkboxLabel: { type: String, attribute: "checkbox-label" },
    selected: { type: Boolean, attribute: "aria-selected", reflect: true },
    storageOption: { type: String, attribute: "storage", reflect: true },
    stockOfferOsis: {
      type: Object,
      attribute: "stock-offer-osis",
      converter: {
        fromAttribute: (value) => {
          const [PUF, ABM, M2M] = value.split(",");
          return { PUF, ABM, M2M };
        }
      }
    },
    filters: {
      type: String,
      reflect: true,
      converter: {
        fromAttribute: (value) => {
          return Object.fromEntries(
            value.split(",").map((filter) => {
              const [key, order, size] = filter.split(":");
              const value2 = Number(order);
              return [
                key,
                {
                  order: isNaN(value2) ? void 0 : value2,
                  size
                }
              ];
            })
          );
        },
        toAttribute: (value) => {
          return Object.entries(value).map(
            ([key, { order, size }]) => [key, order, size].filter((v) => v != void 0).join(":")
          ).join(",");
        }
      }
    },
    types: {
      type: String,
      attribute: "types",
      reflect: true
    },
    merchOffer: { type: Object }
  };
  static styles = [styles, getVariantStyles(), ...sizeStyles()];
  customerSegment;
  marketSegment;
  /**
   * @type {VariantLayout>}
   */
  variantLayout;
  #ready = false;
  constructor() {
    super();
    this.filters = {};
    this.types = "";
    this.selected = false;
    this.handleAemFragmentEvents = this.handleAemFragmentEvents.bind(this);
  }
  firstUpdated() {
    this.variantLayout = getVariantLayout(this, false);
    this.variantLayout?.connectedCallbackHook();
    this.aemFragment?.updateComplete.catch(() => {
      this.style.display = "none";
    });
  }
  willUpdate(changedProperties) {
    if (changedProperties.has("variant") || !this.variantLayout) {
      this.variantLayout = getVariantLayout(this);
      this.variantLayout.connectedCallbackHook();
    }
  }
  updated(changedProperties) {
    if (changedProperties.has("badgeBackgroundColor") || changedProperties.has("borderColor")) {
      this.style.border = this.computedBorderStyle;
    }
    this.variantLayout?.postCardUpdateHook(this);
  }
  get theme() {
    return this.closest("sp-theme");
  }
  get prices() {
    return Array.from(
      this.querySelectorAll('span[is="inline-price"][data-wcs-osi]')
    );
  }
  render() {
    if (!this.isConnected || !this.variantLayout || this.style.display === "none")
      return;
    return this.variantLayout.renderLayout();
  }
  get computedBorderStyle() {
    if (this.variant !== "twp") {
      return `1px solid ${this.borderColor ? this.borderColor : this.badgeBackgroundColor}`;
    }
    return "";
  }
  get badgeElement() {
    return this.shadowRoot.getElementById("badge");
  }
  get headingmMSlot() {
    return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0];
  }
  get footerSlot() {
    return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0];
  }
  get price() {
    return this.headingmMSlot?.querySelector('span[is="inline-price"]');
  }
  get checkoutLinks() {
    return [
      ...this.footerSlot?.querySelectorAll('a[is="checkout-link"]') ?? []
    ];
  }
  async toggleStockOffer({ target }) {
    if (!this.stockOfferOsis)
      return;
    const elements = this.checkoutLinks;
    if (elements.length === 0)
      return;
    for (const element of elements) {
      await element.onceSettled();
      const planType = element.value?.[0]?.planType;
      if (!planType)
        return;
      const stockOfferOsi = this.stockOfferOsis[planType];
      if (!stockOfferOsi)
        return;
      const osis = element.dataset.wcsOsi.split(",").filter((osi) => osi !== stockOfferOsi);
      if (target.checked) {
        osis.push(stockOfferOsi);
      }
      element.dataset.wcsOsi = osis.join(",");
    }
  }
  handleQuantitySelection(event) {
    const elements = this.checkoutLinks;
    for (const element of elements) {
      element.dataset.quantity = event.detail.option;
    }
  }
  get titleElement() {
    return this.querySelector(
      this.variantLayout?.headingSelector || ".card-heading"
    );
  }
  get title() {
    return this.titleElement?.textContent?.trim();
  }
  /* c8 ignore next 3 */
  get description() {
    return this.querySelector('[slot="body-xs"]')?.textContent?.trim();
  }
  /**
   * If the card is the single app, set the order for all filters to 2.
   * If not, increment the order for all filters after the second card by 1.
   * @param {*} singleApp
   */
  updateFilters(singleApp) {
    const newFilters = { ...this.filters };
    Object.keys(newFilters).forEach((key) => {
      if (singleApp) {
        newFilters[key].order = Math.min(newFilters[key].order || 2, 2);
        return;
      }
      const value = newFilters[key].order;
      if (value === 1 || isNaN(value))
        return;
      newFilters[key].order = Number(value) + 1;
    });
    this.filters = newFilters;
  }
  /* c8 ignore next 3 */
  includes(text) {
    return this.textContent.match(new RegExp(text, "i")) !== null;
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("tabindex", this.getAttribute("tabindex") ?? "0");
    this.addEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelection
    );
    this.addEventListener(
      EVENT_MERCH_OFFER_SELECT_READY,
      this.merchCardReady,
      { once: true }
    );
    this.updateComplete.then(() => {
      this.merchCardReady();
    });
    this.storageOptions?.addEventListener(
      "change",
      this.handleStorageChange
    );
    this.addEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
    this.addEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
    if (!this.aemFragment)
      this.checkReady();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.variantLayout.disconnectedCallbackHook();
    this.removeEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelection
    );
    this.storageOptions?.removeEventListener(
      EVENT_MERCH_STORAGE_CHANGE,
      this.handleStorageChange
    );
    this.removeEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
    this.removeEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
  }
  // custom methods
  async handleAemFragmentEvents(e) {
    if (e.type === EVENT_AEM_ERROR) {
      this.#fail("AEM fragment cannot be loaded");
    }
    if (e.type === EVENT_AEM_LOAD) {
      if (e.target.nodeName === "AEM-FRAGMENT") {
        const fragment = e.detail;
        await hydrate(fragment, this);
        this.checkReady();
      }
    }
  }
  #fail(error) {
    this.dispatchEvent(
      new CustomEvent(EVENT_MAS_ERROR, {
        detail: error,
        bubbles: true,
        composed: true
      })
    );
  }
  async checkReady() {
    const successPromise = Promise.all(
      [
        ...this.querySelectorAll(
          'span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]'
        )
      ].map((element) => element.onceSettled().catch(() => element))
    ).then(
      (elements) => elements.every(
        (el) => el.classList.contains("placeholder-resolved")
      )
    );
    const timeoutPromise = new Promise(
      (resolve) => setTimeout(() => resolve(false), MERCH_CARD_LOAD_TIMEOUT)
    );
    const success = await Promise.race([successPromise, timeoutPromise]);
    if (success === true) {
      this.dispatchEvent(
        new CustomEvent(EVENT_MAS_READY, {
          bubbles: true,
          composed: true
        })
      );
      return;
    }
    this.#fail("Contains unresolved offers");
  }
  get aemFragment() {
    return this.querySelector("aem-fragment");
  }
  get storageOptions() {
    return this.querySelector("sp-radio-group#storage");
  }
  /* c8 ignore next 9 */
  get storageSpecificOfferSelect() {
    const storageOption = this.storageOptions?.selected;
    if (storageOption) {
      const merchOfferSelect = this.querySelector(
        `merch-offer-select[storage="${storageOption}"]`
      );
      if (merchOfferSelect)
        return merchOfferSelect;
    }
    return this.querySelector("merch-offer-select");
  }
  get offerSelect() {
    return this.storageOptions ? this.storageSpecificOfferSelect : this.querySelector("merch-offer-select");
  }
  /* c8 ignore next 3 */
  get quantitySelect() {
    return this.querySelector("merch-quantity-select");
  }
  merchCardReady() {
    if (this.offerSelect && !this.offerSelect.planType)
      return;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_CARD_READY, { bubbles: true })
    );
  }
  // TODO enable with TWP //
  /* c8 ignore next 11 */
  handleStorageChange() {
    const offerSelect = this.closest("merch-card")?.offerSelect.cloneNode(true);
    if (!offerSelect)
      return;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_STORAGE_CHANGE, {
        detail: { offerSelect },
        bubbles: true
      })
    );
  }
  /* c8 ignore next 3 */
  get dynamicPrice() {
    return this.querySelector('[slot="price"]');
  }
  // TODO enable with TWP //
  /* c8 ignore next 16 */
  selectMerchOffer(offer) {
    if (offer === this.merchOffer)
      return;
    this.merchOffer = offer;
    const previousPrice = this.dynamicPrice;
    if (offer.price && previousPrice) {
      const newPrice = offer.price.cloneNode(true);
      if (previousPrice.onceSettled) {
        previousPrice.onceSettled().then(() => {
          previousPrice.replaceWith(newPrice);
        });
      } else {
        previousPrice.replaceWith(newPrice);
      }
    }
  }
};
customElements.define(MERCH_CARD, MerchCard);

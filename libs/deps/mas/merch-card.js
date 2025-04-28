var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/merch-card.js
import { LitElement as LitElement5 } from "../lit-all.min.js";

// src/merch-card.css.js
import { css, unsafeCSS } from "../lit-all.min.js";

// src/media.js
var MOBILE_LANDSCAPE = "(max-width: 767px)";
var TABLET_DOWN = "(max-width: 1199px)";
var TABLET_UP = "(min-width: 768px)";
var DESKTOP_UP = "(min-width: 1200px)";
var LARGE_DESKTOP = "(min-width: 1600px)";

// src/merch-card.css.js
var styles = css`
    :host {
        --consonant-merch-card-background-color: #fff;
        --consonant-merch-card-border: 1px solid var(--consonant-merch-card-border-color);
        -webkit-font-smoothing: antialiased;
        background-color: var(--consonant-merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--consonant-merch-card-border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        position: relative;
        text-align: start;
    }

    :host([failed]) {
        display: none;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible,
    :host(:active) .invisible,
    :host(:focus) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
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
    
    footer.wide-footer {
        align-items: center;
    }
    
    footer.wide-footer .secure-transaction-label {
        flex: 0 1 auto;
    }
    
    footer.footer-column {
        flex-direction: column;
    }
    
    footer.footer-column .secure-transaction-label {
        align-self: flex-start;
    }

    hr {
        background-color: var(--merch-color-grey-200);
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
        font-size: 0;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-grey-600);
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
        align-self: center;
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

    ::slotted([slot='price']) {
      color: var(--consonant-merch-card-price-color);
    }
`;
var sizeStyles = () => {
  const styles3 = [
    css`
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
      }
      `
  ];
  return styles3;
};

// src/merch-icon.js
import { LitElement, html, css as css2 } from "../lit-all.min.js";
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
__publicField(MerchIcon, "styles", css2`
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

// src/variants/variant-layout.js
import { html as html2 } from "../lit-all.min.js";
var _container;
var _VariantLayout = class _VariantLayout {
  constructor(card) {
    __publicField(this, "card");
    __privateAdd(this, _container, void 0);
    this.card = card;
    this.insertVariantStyle();
  }
  getContainer() {
    __privateSet(this, _container, __privateGet(this, _container) ?? this.card.closest('[class*="-merch-cards"]') ?? this.card.parentElement);
    return __privateGet(this, _container);
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
_container = new WeakMap();
__publicField(_VariantLayout, "styleMap", {});
var VariantLayout = _VariantLayout;

// src/variants/catalog.js
import { html as html3, css as css3 } from "../lit-all.min.js";

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
var SELECTOR_MAS_SP_BUTTON = "sp-button[data-wcs-osi]";
var SELECTOR_MAS_ELEMENT = `${SELECTOR_MAS_INLINE_PRICE},${SELECTOR_MAS_CHECKOUT_LINK}`;
var EVENT_MERCH_OFFER_SELECT_READY = "merch-offer-select:ready";
var EVENT_MERCH_CARD_READY = "merch-card:ready";
var EVENT_MERCH_CARD_ACTION_MENU_TOGGLE = "merch-card:action-menu-toggle";
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";
var EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE = "merch-modal:addon-and-quantity-update";
var EVENT_AEM_LOAD = "aem:load";
var EVENT_AEM_ERROR = "aem:error";
var EVENT_MAS_READY = "mas:ready";
var EVENT_MAS_ERROR = "mas:error";
var HEADER_X_REQUEST_ID = "X-Request-Id";
var CheckoutWorkflowStep = Object.freeze({
  CHECKOUT: "checkout",
  CHECKOUT_EMAIL: "checkout/email",
  SEGMENTATION: "segmentation",
  BUNDLE: "bundle",
  COMMITMENT: "commitment",
  RECOMMENDATION: "recommendation",
  EMAIL: "email",
  PAYMENT: "payment",
  CHANGE_PLAN_TEAM_PLANS: "change-plan/team-upgrade/plans",
  CHANGE_PLAN_TEAM_PAYMENT: "change-plan/team-upgrade/payment"
});
var CheckoutWorkflow = Object.freeze({ V2: "UCv2", V3: "UCv3" });
var Env = Object.freeze({
  STAGE: "STAGE",
  PRODUCTION: "PRODUCTION",
  LOCAL: "LOCAL"
});
var MARK_START_SUFFIX = ":start";
var MARK_DURATION_SUFFIX = ":duration";

// src/utils.js
var MAS_COMMERCE_SERVICE = "mas-commerce-service";
function createTag(tag, attributes = {}, content = null, is = null) {
  const element = is ? document.createElement(tag, { is }) : document.createElement(tag);
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
function matchMobile() {
  return window.matchMedia("(max-width: 767px)");
}
function isMobile() {
  return matchMobile().matches;
}
function isMobileOrTablet() {
  return window.matchMedia("(max-width: 1024px)").matches;
}
function getService() {
  return document.getElementsByTagName(MAS_COMMERCE_SERVICE)?.[0];
}

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
  color: var(--consonant-merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`;

// src/variants/catalog.js
var CATALOG_AEM_FRAGMENT_MAPPING = {
  badge: true,
  ctas: { slot: "footer", size: "m" },
  description: { tag: "div", slot: "body-xs" },
  mnemonics: { size: "l" },
  prices: { tag: "h3", slot: "heading-xs" },
  size: ["wide", "super-wide"],
  title: { tag: "h3", slot: "heading-xs" }
};
var Catalog = class extends VariantLayout {
  constructor(card) {
    super(card);
    __publicField(this, "dispatchActionMenuToggle", () => {
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
    });
    __publicField(this, "toggleActionMenu", (e) => {
      if (!this.actionMenuContentSlot || !e || e.type !== "click" && e.code !== "Space" && e.code !== "Enter")
        return;
      e.preventDefault();
      this.actionMenuContentSlot.classList.toggle("hidden");
      const isHidden = this.actionMenuContentSlot.classList.contains("hidden");
      if (!isHidden)
        this.dispatchActionMenuToggle();
      this.setAriaExpanded(this.actionMenu, (!isHidden).toString());
    });
    __publicField(this, "toggleActionMenuFromCard", (e) => {
      const retract = e?.type === "mouseleave" ? true : void 0;
      this.card.blur();
      this.actionMenu?.classList.remove("always-visible");
      if (!this.actionMenuContentSlot)
        return;
      if (!retract)
        this.dispatchActionMenuToggle();
      this.actionMenuContentSlot.classList.toggle("hidden", retract);
      this.setAriaExpanded(this.actionMenu, "false");
    });
    __publicField(this, "hideActionMenu", (e) => {
      this.actionMenuContentSlot?.classList.add("hidden");
      this.setAriaExpanded(this.actionMenu, "false");
    });
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return CATALOG_AEM_FRAGMENT_MAPPING;
  }
  get actionMenu() {
    return this.card.shadowRoot.querySelector(".action-menu");
  }
  get actionMenuContentSlot() {
    return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');
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
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                    >${this.card.actionMenuLabel} - ${this.card.title}</div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${!this.card.actionMenuContent ? "hidden" : ""}"
                    @focusout="${this.hideActionMenu}"
                    >${this.card.actionMenuContent}
                </slot>
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
  setAriaExpanded(element, value) {
    element.setAttribute("aria-expanded", value);
  }
  connectedCallbackHook() {
    this.card.addEventListener("mouseleave", this.toggleActionMenuFromCard);
  }
  disconnectedCallbackHook() {
    this.card.removeEventListener("mouseleave", this.toggleActionMenuFromCard);
  }
};
__publicField(Catalog, "variantStyle", css3`
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
    `);

// src/variants/image.js
import { html as html4 } from "../lit-all.min.js";

// src/variants/image.css.js
var CSS2 = `
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
    --consonant-merch-card-image-width-4clm: 276px;
  }
    
  .three-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }

  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width-4clm));
  }
}
`;

// src/variants/image.js
var Image = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS2;
  }
  renderLayout() {
    return html4`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom ? html4`<slot name="body-xs"></slot><slot name="promo-text"></slot>` : html4`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen ? html4`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card["detailBg"]}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          ` : html4`
              <hr />
              ${this.secureLabelFooter}
          `}`;
  }
};

// src/variants/inline-heading.js
import { html as html5 } from "../lit-all.min.js";

// src/variants/inline-heading.css.js
var CSS3 = `
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
    return CSS3;
  }
  renderLayout() {
    return html5` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${!this.card.customHr ? html5`<hr />` : ""} ${this.secureLabelFooter}`;
  }
};

// src/variants/mini-compare-chart.js
import { html as html6, css as css4, unsafeCSS as unsafeCSS2 } from "../lit-all.min.js";

// src/variants/mini-compare-chart.css.js
var CSS4 = `
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-xxl-font-size);
    padding: 0 var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0px;
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

   merch-card[variant="mini-compare-chart"].bullet-list [slot="body-xxs"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="promo-text"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .action-area {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-wrap: wrap;
    width: 100%;
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot="footer-rows"] ul {
    margin-block-start: 0px;
    margin-block-end: 0px;
    padding-inline-start: 0px;
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

  merch-card[variant="mini-compare-chart"] .footer-rows-title {
    font-color: var(--merch-color-grey-80);
    font-weight: 700;
    padding-block-end: var(--consonant-merch-spacing-xxs);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--consonant-merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
    margin-block: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark img {
    max-width: initial;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon-checkmark {
    display: flex;
    align-items: center;
    height: 20px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-checkmark {
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    align-items: flex-start;
    margin-block: var(--consonant-merch-spacing-xxxs);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description-checkmark {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    font-weight: 400;
    line-height: var(--consonant-merch-card-body-xs-line-height);
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
  }

  merch-card[variant="mini-compare-chart"] .chevron-icon {
    margin-left: 8px;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
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
    __publicField(this, "getRowMinHeightPropertyName", (index) => `--consonant-merch-card-footer-row-${index}-min-height`);
    __publicField(this, "getMiniCompareFooter", () => {
      const secureLabel = this.card.secureLabel ? html6`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >` : html6`<slot name="secure-transaction-label"></slot>`;
      return html6`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
    });
  }
  getGlobalCSS() {
    return CSS4;
  }
  adjustMiniCompareBodySlots() {
    if (this.card.getBoundingClientRect().width <= 2)
      return;
    this.updateCardElementMinHeight(
      this.card.shadowRoot.querySelector(".top-section"),
      "top-section"
    );
    let slots = [
      "heading-m",
      "body-m",
      "heading-m-price",
      "body-xxs",
      "price-commitment",
      "offers",
      "promo-text",
      "callout-content"
    ];
    if (this.card.classList.contains("bullet-list")) {
      slots.push("footer-rows");
    }
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
    const footerRows = this.card.querySelector('[slot="footer-rows"] ul');
    if (!footerRows || !footerRows.children)
      return;
    [...footerRows.children].forEach((el, index) => {
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
    return html6` <div class="top-section${this.badge ? " badge" : ""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list") ? html6`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>` : html6`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
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
};
__publicField(MiniCompareChart, "variantStyle", css4`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-s);
    }

    :host([variant='mini-compare-chart'].bullet-list) footer {
        flex-flow: column nowrap;
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    :host([variant='mini-compare-chart'].bullet-list) .top-section {
        padding-top: var(--consonant-merch-spacing-xs);
        padding-inline-start: var(--consonant-merch-spacing-xs);
    }

    :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
      align-self: flex-start;
      flex: none;
      color: var(--merch-color-grey-700);
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
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);

// src/variants/plans.js
import { html as html7, css as css5 } from "../lit-all.min.js";

// src/variants/plans.css.js
var CSS5 = `
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant="plans"] {
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant="plans"] [slot="heading-m"] span.price.price-strikethrough {
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-weight: 700;
}

merch-card[variant="plans"] [slot="promo-text"] {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection merch-card[variant="plans"] {
  width: auto;
}

merch-card[variant="plans"] [slot="description"] {
    min-height: 84px;
}

merch-card[variant="plans"] [slot="body-xs"] a {
    color: var(--link-color);
}

merch-card[variant="plans"] [slot="promo-text"] a {
    color: inherit;
}

merch-card[variant="plans"] [slot="callout-content"] {
    margin: 8px 0 0;
}

merch-card[variant="plans"] [slot='callout-content'] > div > div,
merch-card[variant="plans"] [slot="callout-content"] > p {
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant="plans"] [slot='callout-content'] > p,
merch-card[variant="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant="plans"] [slot="callout-content"] img,
merch-card[variant="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant="plans"] [slot="callout-content"] .icon-button::before {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path fill="%232c2c2c" d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
    background-size: 18px 18px;
}

merch-card[variant="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
}

merch-card[variant="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

.plans-container {
    display: flex;
    justify-content: center;
    gap: 36px;
}

.plans-container merch-card-collection {
    padding: 0;
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

merch-card[variant="plans"]:not([size]) {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
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
  .four-merch-cards.plans .foreground {
      max-width: unset;
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
var PLANS_AEM_FRAGMENT_MAPPING = {
  title: { tag: "p", slot: "heading-xs" },
  prices: { tag: "p", slot: "heading-m" },
  promoText: { tag: "p", slot: "promo-text" },
  description: { tag: "div", slot: "body-xs" },
  mnemonics: { size: "l" },
  callout: { tag: "div", slot: "callout-content" },
  quantitySelect: { tag: "div", slot: "quantity-select" },
  stockOffer: true,
  secureLabel: true,
  badge: { tag: "div", slot: "badge" },
  allowedBadgeColors: ["spectrum-yellow-300-plans", "spectrum-gray-300-plans", "spectrum-gray-700-plans", "spectrum-green-900-plans"],
  allowedBorderColors: ["spectrum-yellow-300-plans", "spectrum-gray-300-plans"],
  borderColor: { attribute: "border-color" },
  size: ["wide", "super-wide"],
  whatsIncluded: { tag: "div", slot: "whats-included" },
  ctas: { slot: "footer", size: "m" },
  style: "consonant"
};
var Plans = class extends VariantLayout {
  constructor(card) {
    super(card);
    this.adaptForMobile = this.adaptForMobile.bind(this);
  }
  /* c8 ignore next 3 */
  get aemFragmentMapping() {
    return PLANS_AEM_FRAGMENT_MAPPING;
  }
  getGlobalCSS() {
    return CSS5;
  }
  adaptForMobile() {
    if (!this.card.closest("merch-card-collection,overlay-trigger")) {
      this.card.removeAttribute("size");
      return;
    }
    const shadowRoot = this.card.shadowRoot;
    const footer = shadowRoot.querySelector("footer");
    const size = this.card.getAttribute("size");
    const stockInFooter = shadowRoot.querySelector("footer #stock-checkbox");
    const stockInBody = shadowRoot.querySelector(".body #stock-checkbox");
    const body = shadowRoot.querySelector(".body");
    if (!size) {
      footer.classList.remove("wide-footer");
      if (stockInFooter)
        stockInFooter.remove();
      return;
    }
    const mobile = isMobile();
    if (footer)
      footer.classList.toggle("wide-footer", !mobile);
    if (mobile && stockInFooter) {
      stockInBody ? stockInFooter.remove() : body.appendChild(stockInFooter);
      return;
    }
    if (!mobile && stockInBody) {
      stockInFooter ? stockInBody.remove() : footer.prepend(stockInBody);
    }
  }
  postCardUpdateHook() {
    this.adaptForMobile();
    this.adjustTitleWidth();
  }
  get stockCheckbox() {
    return this.card.checkboxLabel ? html7`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>` : "";
  }
  connectedCallbackHook() {
    const match = matchMobile();
    if (match?.addEventListener)
      match.addEventListener("change", this.adaptForMobile);
  }
  disconnectedCallbackHook() {
    const match = matchMobile();
    if (match?.removeEventListener)
      match.removeEventListener("change", this.adaptForMobile);
  }
  renderLayout() {
    return html7` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="whats-included"></slot>
            <slot name="callout-content"></slot>
            ${this.stockCheckbox}
            <slot name="badge"></slot>
            <slot name="quantity-select"></slot>
        </div>
        ${this.secureLabelFooter}`;
  }
};
__publicField(Plans, "variantStyle", css5`
    :host([variant='plans']) {
        min-height: 348px;
        border: 1px solid var(--merch-card-custom-border-color, #DADADA);
        --merch-card-plans-min-width: 244px;
        --merch-card-plans-max-width: 244px;
        --merch-card-plans-padding: 15px;
        --merch-card-plans-heading-min-height: 23px;
        --merch-color-green-promo: rgb(0, 122, 77);
        --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
        font-weight: 400;
    }

    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        min-height: var(--merch-card-plans-heading-min-height);
    }

    :host([variant='plans']) .body {
        min-width: var(--merch-card-plans-min-width);
        max-width: var(--merch-card-plans-max-width);
        padding: var(--merch-card-plans-padding);
    }

    :host([variant='plans'][size]) .body {
        max-width: none;
    }

    :host([variant='plans']) .wide-footer #stock-checkbox {
        margin-top: 0;
    }

    :host([variant='plans']) #stock-checkbox {
        margin-top: 8px;
        gap: 9px;
        color: rgb(34, 34, 34);
        line-height: var(--consonant-merch-card-detail-xs-line-height);
        padding-top: 4px;
        padding-bottom: 5px;
    }

    :host([variant='plans']) #stock-checkbox > span {
        border: 2px solid rgb(109, 109, 109);
        width: 12px;
        height: 12px;
    }

    :host([variant='plans']) footer {
        padding: var(--merch-card-plans-padding);
        padding-top: 1px;
    }

    :host([variant='plans']) .secure-transaction-label {
        color: rgb(80, 80, 80);
        line-height: var(--consonant-merch-card-detail-xs-line-height);
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }

    :host([variant='plans']) #badge {
        border-radius: 4px 0 0 4px;
        font-weight: 400;
        line-height: 21px;
        padding: 2px 10px 3px;
    }
  `);

// src/variants/product.js
import { html as html8, css as css6 } from "../lit-all.min.js";

// src/variants/product.css.js
var CSS6 = `
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
    --consonant-merch-card-product-width-4clm: 276px;
  }
    
  .three-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }

  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width-4clm));
  }
}
`;

// src/variants/product.js
var Product = class extends VariantLayout {
  constructor(card) {
    super(card);
    this.postCardUpdateHook = this.postCardUpdateHook.bind(this);
  }
  getGlobalCSS() {
    return CSS6;
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
    return html8` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${!this.promoBottom ? html8`<slot name="promo-text"></slot>` : ""}
          <slot name="body-xs"></slot>
          ${this.promoBottom ? html8`<slot name="promo-text"></slot>` : ""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`;
  }
  connectedCallbackHook() {
    window.addEventListener("resize", this.postCardUpdateHook);
  }
  disconnectedCallbackHook() {
    window.removeEventListener("resize", this.postCardUpdateHook);
  }
  postCardUpdateHook() {
    if (!this.card.isConnected)
      return;
    if (!isMobile()) {
      this.adjustProductBodySlots();
    }
    this.adjustTitleWidth();
  }
};
__publicField(Product, "variantStyle", css6`
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
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);

// src/variants/segment.js
import { html as html9, css as css7 } from "../lit-all.min.js";

// src/variants/segment.css.js
var CSS7 = `
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
    return CSS7;
  }
  postCardUpdateHook() {
    this.adjustTitleWidth();
  }
  renderLayout() {
    return html9` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${!this.promoBottom ? html9`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
        <slot name="body-xs"></slot>
        ${this.promoBottom ? html9`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
    </div>
    <hr />
    ${this.secureLabelFooter}`;
  }
};
__publicField(Segment, "variantStyle", css7`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);

// src/variants/special-offer.js
import { html as html10, css as css8 } from "../lit-all.min.js";

// src/variants/special-offer.css.js
var CSS8 = `
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
var SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING = {
  name: { tag: "h4", slot: "detail-m" },
  title: { tag: "h4", slot: "detail-m" },
  backgroundImage: { tag: "div", slot: "bg-image" },
  prices: { tag: "h3", slot: "heading-xs" },
  description: { tag: "div", slot: "body-xs" },
  ctas: { slot: "footer", size: "l" }
};
var SpecialOffer = class extends VariantLayout {
  constructor(card) {
    super(card);
  }
  getGlobalCSS() {
    return CSS8;
  }
  get headingSelector() {
    return '[slot="detail-m"]';
  }
  get aemFragmentMapping() {
    return SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING;
  }
  renderLayout() {
    return html10`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen ? html10`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card["detailBg"]}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  ` : html10`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`;
  }
};
__publicField(SpecialOffer, "variantStyle", css8`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);

// src/variants/variants.js
var variantRegistry = /* @__PURE__ */ new Map();
var registerVariant = (name, variantClass, fragmentMapping = null, style = null) => {
  variantRegistry.set(name, {
    class: variantClass,
    fragmentMapping,
    style
  });
};
registerVariant(
  "catalog",
  Catalog,
  CATALOG_AEM_FRAGMENT_MAPPING,
  Catalog.variantStyle
);
registerVariant("image", Image);
registerVariant("inline-heading", InlineHeading);
registerVariant(
  "mini-compare-chart",
  MiniCompareChart,
  null,
  MiniCompareChart.variantStyle
);
registerVariant("plans", Plans, PLANS_AEM_FRAGMENT_MAPPING, Plans.variantStyle);
registerVariant("product", Product, null, Product.variantStyle);
registerVariant("segment", Segment, null, Segment.variantStyle);
registerVariant(
  "special-offers",
  SpecialOffer,
  SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
  SpecialOffer.variantStyle
);
var getVariantLayout = (card, mustMatch = false) => {
  const variantInfo = variantRegistry.get(card.variant);
  if (!variantInfo) {
    return mustMatch ? void 0 : new Product(card);
  }
  const { class: VariantClass, style } = variantInfo;
  if (style) {
    const sheet2 = new CSSStyleSheet();
    sheet2.replaceSync(style.cssText);
    card.shadowRoot.adoptedStyleSheets.push(sheet2);
  }
  return new VariantClass(card);
};
function getFragmentMapping(variant) {
  return variantRegistry.get(variant)?.fragmentMapping;
}

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

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
    --consonant-merch-card-heading-xxxs-font-size: 14px;
    --consonant-merch-card-heading-xxxs-line-height: 18px;
    --consonant-merch-card-heading-xxs-font-size: 16px;
    --consonant-merch-card-heading-xxs-line-height: 20px;
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
    --consonant-merch-card-detail-xs-line-height: 12px;
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;
    --consonant-merch-card-detail-l-line-height: 18px;
    --consonant-merch-card-detail-xl-line-height: 23px;

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
    --consonant-merch-card-body-xxl-font-size: 24px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --consonant-merch-card-background-color: inherit;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: rgb(59, 99, 251);
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-50: var(--specturm-gray-50);
    --merch-color-grey-60: var(--specturm-gray-600);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-grey-700: #464646;
    --merch-color-green-promo: #2D9D78;
    --consonant-merch-card-body-xs-color: var(--spectrum-gray-100, var(--merch-color-grey-80));
    --merch-color-inline-price-strikethrough: initial;
    --consonant-merch-card-detail-s-color: var(--spectrum-gray-600, var(--merch-color-grey-600));
    --consonant-merch-card-heading-color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    --consonant-merch-card-heading-xs-color: var(--consonant-merch-card-heading-color);
    --consonant-merch-card-price-color: #222222;
    --consonant-merch-card-heading-xxxs-color: #131313;
    --consonant-merch-card-body-xxs-color: #292929;

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    /* ah colors */
    --ah-gray-500: #717171;
    
    /* plans colors */
    --spectrum-yellow-300-plans: #F5C700;
    --spectrum-green-900-plans: #05834E;
    --spectrum-gray-300-plans: #DADADA;
    --spectrum-gray-700-plans: #505050;
  
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
    align-items: normal;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

merch-card[variant="ccd-suggested"] *,
merch-card[variant="ccd-slice"] * {
  box-sizing: border-box;
}

merch-card * {
  padding: revert-layer;
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin: var(--consonant-merch-spacing-xs) 0;
    height: 1px;
    border: none;
}

merch-card.has-divider div[slot='body-lower'] hr {
    margin: 0;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is='inline-price'] {
    display: inline-block;
}

merch-card [slot^='heading-'] {
    color: var(--consonant-merch-card-heading-color);
    font-weight: 700;
}

merch-card [slot='heading-xxxs'] {
        font-size: var(--consonant-merch-card-heading-xxxs-font-size);
        line-height: var(--consonant-merch-card-heading-xxxs-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
        letter-spacing: normal;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    color: var(--consonant-merch-card-heading-xs-color);
    margin: 0;
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
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
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
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
}

merch-card [slot='whats-included'] {
    margin: var(--consonant-merch-spacing-xxxs) 0px;
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card[variant='plans'] [slot='badge'] {
    position: absolute;
    top: 16px;
    right: 0;
    line-height: 16px;
}

merch-card [slot='callout-content'] > p {
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
    width: fit-content;
    font-size: var(--consonant-merch-card-callout-font-size);
    line-height: var(--consonant-merch-card-callout-line-height);
}

merch-card [slot='callout-content'] .icon-button {
    position: relative;
    top: 3px;
}

merch-card [slot='callout-content'] .icon-button:before {
    display: inline-block;
    content: '';
    width: 14px;
    height: 14px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>')
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

merch-card [slot='detail-s'] {
    font-size: var(--consonant-merch-card-detail-s-font-size);
    line-height: var(--consonant-merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--consonant-merch-card-detail-s-color);
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
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-s"] {
    color: var(--consonant-merch-card-body-s-color);
}

merch-card button.spectrum-Button > a {
  color: inherit;
  text-decoration: none;
}

merch-card button.spectrum-Button > a:hover {
  color: inherit;
}

merch-card button.spectrum-Button > a:active {
  color: inherit;
}

merch-card button.spectrum-Button > a:focus {
  color: inherit;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--consonant-merch-card-body-xs-color);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
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

merch-card [slot="footer-rows"] {
    min-height: var(--consonant-merch-card-footer-rows-height);
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card.product div[slot="footer"] {
    display: block;
}

merch-card.product div[slot="footer"] a + a {
    margin: 5px 0 0 5px;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card span.placeholder-resolved[data-template='priceStrikethrough'],
merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
  text-decoration: line-through;
  color: var(--merch-color-inline-price-strikethrough);
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

merch-sidenav-checkbox-group h3 {
    font-size: 14px;
    height: 32px;
    letter-spacing: 0px;
    line-height: 18.2px;
    color: var(--color-gray-600);
    margin: 0px;
}

sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

`;
document.head.appendChild(styles2);

// src/mas-error.js
var MasError = class _MasError extends Error {
  /**
   * Creates a new MasError instance
   * @param {string} message - The error message
   * @param {Object} context - Additional context information about the error
   * @param {unknown} cause - The original error that caused this error
   */
  constructor(message, context, cause) {
    super(message, { cause });
    this.name = "MasError";
    if (context.response) {
      const requestId = context.response.headers?.get(HEADER_X_REQUEST_ID);
      if (requestId) {
        context.requestId = requestId;
      }
      if (context.response.status) {
        context.status = context.response.status;
        context.statusText = context.response.statusText;
      }
      if (context.response.url) {
        context.url = context.response.url;
      }
    }
    delete context.response;
    this.context = context;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _MasError);
    }
  }
  /**
   * Returns a string representation of the error including context
   * @returns {string} String representation of the error
   */
  toString() {
    const contextStr = Object.entries(this.context || {}).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join(", ");
    let errorString = `${this.name}: ${this.message}`;
    if (contextStr) {
      errorString += ` (${contextStr})`;
    }
    if (this.cause) {
      errorString += `
Caused by: ${this.cause}`;
    }
    return errorString;
  }
};

// src/utils/mas-fetch.js
async function masFetch(resource, options = {}, retries = 2, baseDelay = 100) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(resource, options);
      return response;
    } catch (error) {
      lastError = error;
      if (attempt > retries)
        break;
      await new Promise(
        (resolve) => setTimeout(resolve, baseDelay * (attempt + 1))
      );
    }
  }
  throw lastError;
}

// src/aem-fragment.js
var sheet = new CSSStyleSheet();
sheet.replaceSync(":host { display: contents; }");
var ATTRIBUTE_FRAGMENT = "fragment";
var ATTRIBUTE_AUTHOR = "author";
var AEM_FRAGMENT_TAG_NAME = "aem-fragment";
var _fragmentCache;
var FragmentCache = class {
  constructor() {
    __privateAdd(this, _fragmentCache, /* @__PURE__ */ new Map());
  }
  clear() {
    __privateGet(this, _fragmentCache).clear();
  }
  /**
   * Add fragment to cache
   * @param {string} fragmentId requested id.
   * requested id can differe from returned fragment.id because of translation
   */
  addByRequestedId(fragmentId, fragment) {
    __privateGet(this, _fragmentCache).set(fragmentId, fragment);
  }
  add(...fragments) {
    fragments.forEach((fragment) => {
      const { id: fragmentId } = fragment;
      if (fragmentId) {
        __privateGet(this, _fragmentCache).set(fragmentId, fragment);
      }
    });
  }
  has(fragmentId) {
    return __privateGet(this, _fragmentCache).has(fragmentId);
  }
  get(key) {
    return __privateGet(this, _fragmentCache).get(key);
  }
  remove(fragmentId) {
    __privateGet(this, _fragmentCache).delete(fragmentId);
  }
};
_fragmentCache = new WeakMap();
var cache = new FragmentCache();
var _log, _rawData, _data, _stale, _startMark, _service, _fragmentId, _fetchPromise, _author, _fail, fail_fn;
var AemFragment = class extends HTMLElement {
  constructor() {
    super();
    __privateAdd(this, _fail);
    __publicField(this, "cache", cache);
    __privateAdd(this, _log, void 0);
    __privateAdd(this, _rawData, null);
    __privateAdd(this, _data, null);
    __privateAdd(this, _stale, false);
    __privateAdd(this, _startMark, null);
    __privateAdd(this, _service, null);
    /**
     * @type {string} fragment id
     */
    __privateAdd(this, _fragmentId, void 0);
    /**
     * Internal promise to track if fetching is in progress.
     */
    __privateAdd(this, _fetchPromise, void 0);
    __privateAdd(this, _author, false);
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }
  static get observedAttributes() {
    return [ATTRIBUTE_FRAGMENT, ATTRIBUTE_AUTHOR];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === ATTRIBUTE_FRAGMENT) {
      __privateSet(this, _fragmentId, newValue);
    }
    if (name === ATTRIBUTE_AUTHOR) {
      __privateSet(this, _author, ["", "true"].includes(newValue));
    }
  }
  connectedCallback() {
    __privateSet(this, _service, getService(this));
    __privateSet(this, _log, __privateGet(this, _service).log.module(AEM_FRAGMENT_TAG_NAME));
    __privateSet(this, _startMark, `${AEM_FRAGMENT_TAG_NAME}:${__privateGet(this, _fragmentId)}${MARK_START_SUFFIX}`);
    performance.mark(__privateGet(this, _startMark));
    if (!__privateGet(this, _fragmentId)) {
      __privateMethod(this, _fail, fail_fn).call(this, { message: "Missing fragment id" });
      return;
    }
    this.refresh(false);
  }
  /**
   * Get fragment by ID
   * @param {string} endpoint url to fetch fragment from
   * @param {string} id fragment id
   * @returns {Promise<Object>} the raw fragment item
   */
  async getFragmentById(endpoint, id, startMark) {
    const measureName = `${AEM_FRAGMENT_TAG_NAME}:${id}${MARK_DURATION_SUFFIX}`;
    let response;
    try {
      response = await masFetch(endpoint, {
        cache: "default",
        credentials: "omit"
      });
      if (!response?.ok) {
        const { startTime, duration } = performance.measure(
          measureName,
          startMark
        );
        throw new MasError("Unexpected fragment response", {
          response,
          startTime,
          duration,
          ...__privateGet(this, _service).duration
        });
      }
      return response.json();
    } catch (e) {
      const { startTime, duration } = performance.measure(
        measureName,
        startMark
      );
      if (!response) {
        response = { url: endpoint };
      }
      throw new MasError("Failed to fetch fragment", {
        response,
        startTime,
        duration,
        ...__privateGet(this, _service).duration
      });
    }
  }
  async refresh(flushCache = true) {
    if (__privateGet(this, _fetchPromise)) {
      const ready = await Promise.race([
        __privateGet(this, _fetchPromise),
        Promise.resolve(false)
      ]);
      if (!ready)
        return;
    }
    if (flushCache) {
      cache.remove(__privateGet(this, _fragmentId));
    }
    __privateSet(this, _fetchPromise, this.fetchData().then(() => {
      const { references, referencesTree, placeholders } = __privateGet(this, _rawData) || {};
      this.dispatchEvent(
        new CustomEvent(EVENT_AEM_LOAD, {
          detail: {
            ...this.data,
            stale: __privateGet(this, _stale),
            references,
            referencesTree,
            placeholders
          },
          bubbles: true,
          composed: true
        })
      );
      return true;
    }).catch((e) => {
      if (__privateGet(this, _rawData)) {
        cache.addByRequestedId(__privateGet(this, _fragmentId), __privateGet(this, _rawData));
        return true;
      }
      __privateMethod(this, _fail, fail_fn).call(this, e);
      return false;
    }));
    return __privateGet(this, _fetchPromise);
  }
  async fetchData() {
    this.classList.remove("error");
    __privateSet(this, _data, null);
    let fragment = cache.get(__privateGet(this, _fragmentId));
    if (fragment) {
      __privateSet(this, _rawData, fragment);
      return;
    }
    __privateSet(this, _stale, true);
    const { masIOUrl, wcsApiKey, locale } = __privateGet(this, _service).settings;
    const endpoint = `${masIOUrl}/fragment?id=${__privateGet(this, _fragmentId)}&api_key=${wcsApiKey}&locale=${locale}`;
    fragment = await this.getFragmentById(
      endpoint,
      __privateGet(this, _fragmentId),
      __privateGet(this, _startMark)
    );
    cache.addByRequestedId(__privateGet(this, _fragmentId), fragment);
    __privateSet(this, _rawData, fragment);
    __privateSet(this, _stale, false);
  }
  get updateComplete() {
    return __privateGet(this, _fetchPromise) ?? Promise.reject(new Error("AEM fragment cannot be loaded"));
  }
  get data() {
    if (__privateGet(this, _data))
      return __privateGet(this, _data);
    if (__privateGet(this, _author)) {
      this.transformAuthorData();
    } else {
      this.transformPublishData();
    }
    return __privateGet(this, _data);
  }
  transformAuthorData() {
    const { fields, id, tags } = __privateGet(this, _rawData);
    __privateSet(this, _data, fields.reduce(
      (acc, { name, multiple, values }) => {
        acc.fields[name] = multiple ? values : values[0];
        return acc;
      },
      { fields: {}, id, tags }
    ));
  }
  transformPublishData() {
    const { fields, id, tags } = __privateGet(this, _rawData);
    __privateSet(this, _data, Object.entries(fields).reduce(
      (acc, [key, value]) => {
        acc.fields[key] = value?.mimeType ? value.value : value ?? "";
        return acc;
      },
      { fields: {}, id, tags }
    ));
  }
};
_log = new WeakMap();
_rawData = new WeakMap();
_data = new WeakMap();
_stale = new WeakMap();
_startMark = new WeakMap();
_service = new WeakMap();
_fragmentId = new WeakMap();
_fetchPromise = new WeakMap();
_author = new WeakMap();
_fail = new WeakSet();
fail_fn = function({ message, context }) {
  this.classList.add("error");
  __privateGet(this, _log).error(`aem-fragment: ${message}`, context);
  this.dispatchEvent(
    new CustomEvent(EVENT_AEM_ERROR, {
      detail: { message, ...context },
      bubbles: true,
      composed: true
    })
  );
};
customElements.define(AEM_FRAGMENT_TAG_NAME, AemFragment);

// src/merch-badge.js
import { LitElement as LitElement2, html as html11, css as css9 } from "../lit-all.min.js";
var MerchBadge = class extends LitElement2 {
  constructor() {
    super();
    this.color = "";
    this.variant = "";
    this.backgroundColor = "";
    this.borderColor = "";
  }
  connectedCallback() {
    if (this.borderColor && this.borderColor !== "Transparent") {
      this.style.setProperty("--merch-badge-border", `1px solid var(--${this.borderColor})`);
    } else {
      this.style.setProperty("--merch-badge-border", `1px solid var(--${this.backgroundColor})`);
    }
    this.style.setProperty("--merch-badge-background-color", `var(--${this.backgroundColor})`);
    this.style.setProperty("--merch-badge-color", this.color);
    this.style.setProperty("--merch-badge-padding", "2px 10px 3px 10px");
    this.style.setProperty("--merch-badge-border-radius", "4px 0 0 4px");
    this.style.setProperty("--merch-badge-font-size", "var(--consonant-merch-card-body-xs-font-size)");
    if (this.variant === "plans") {
      this.style.setProperty("border-right", "none");
    }
    super.connectedCallback();
  }
  render() {
    return html11`<div class="plans-badge">
            ${this.textContent}
        </div>`;
  }
};
__publicField(MerchBadge, "properties", {
  color: { type: String },
  variant: { type: String },
  backgroundColor: { type: String, attribute: "background-color" },
  borderColor: { type: String, attribute: "border-color" }
});
__publicField(MerchBadge, "styles", css9`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
        }
    `);
customElements.define("merch-badge", MerchBadge);

// src/merch-mnemonic-list.js
import { html as html12, css as css10, LitElement as LitElement3 } from "../lit-all.min.js";
var MerchMnemonicList = class extends LitElement3 {
  constructor() {
    super();
  }
  render() {
    return html12`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `;
  }
};
__publicField(MerchMnemonicList, "styles", css10`
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

// src/merch-whats-included.js
import { html as html13, css as css11, LitElement as LitElement4 } from "../lit-all.min.js";
var MerchWhatsIncluded = class extends LitElement4 {
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
    return html13`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile && this.rows.length > this.mobileRows ? html13`<div @click=${this.toggle} class="see-more">
                      ${this.showAll ? "- See less" : "+ See more"}
                  </div>` : html13``}`;
  }
  get isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
  }
  get rows() {
    return this.querySelectorAll("merch-mnemonic-list");
  }
};
__publicField(MerchWhatsIncluded, "styles", css11`
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

// src/upt-link.js
function getPromoTermsUrl(env) {
  const host = env === "PRODUCTION" ? "www.adobe.com" : "www.stage.adobe.com";
  return `https://${host}/offers/promo-terms.html`;
}
var _initialized;
var _UptLink = class _UptLink extends HTMLAnchorElement {
  constructor() {
    super();
    __privateAdd(this, _initialized, false);
    this.setAttribute("is", _UptLink.is);
  }
  get isUptLink() {
    return true;
  }
  /**
   * @param {string} osi 
   * @param {string} promotionCode 
   */
  initializeWcsData(osi, promotionCode) {
    this.setAttribute("data-wcs-osi", osi);
    if (promotionCode)
      this.setAttribute("data-promotion-code", promotionCode);
    __privateSet(this, _initialized, true);
    this.composePromoTermsUrl();
  }
  attributeChangedCallback(_name, _oldValue, _newValue) {
    if (!__privateGet(this, _initialized))
      return;
    this.composePromoTermsUrl();
  }
  composePromoTermsUrl() {
    const osi = this.getAttribute("data-wcs-osi");
    if (!osi) {
      const fragmentId = this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");
      console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${fragmentId}`);
      return;
    }
    const service = getService();
    const wcsOsi = [osi];
    const promotionCode = this.getAttribute("data-promotion-code");
    const { country, language, env } = service.settings;
    const options = { country, language, wcsOsi, promotionCode };
    const promises = service.resolveOfferSelectors(options);
    Promise.all(promises).then(([[offer]]) => {
      let params = `locale=${language}_${country}&country=${country}&offer_id=${offer.offerId}`;
      if (promotionCode)
        params += `&promotion_code=${encodeURIComponent(promotionCode)}`;
      this.href = `${getPromoTermsUrl(env)}?${params}`;
    }).catch((error) => {
      console.error(`Could not resolve offer selectors for id: ${osi}.`, error.message);
    });
  }
  /**
   * @param {HTMLElement} element 
   */
  static createFrom(element) {
    const uptLink = new _UptLink();
    for (const attribute of element.attributes) {
      if (attribute.name === "is")
        continue;
      if (attribute.name === "class" && attribute.value.includes("upt-link"))
        uptLink.setAttribute("class", attribute.value.replace("upt-link", "").trim());
      else
        uptLink.setAttribute(attribute.name, attribute.value);
    }
    uptLink.innerHTML = element.innerHTML;
    uptLink.setAttribute("tabindex", 0);
    return uptLink;
  }
};
_initialized = new WeakMap();
__publicField(_UptLink, "is", "upt-link");
__publicField(_UptLink, "tag", "a");
__publicField(_UptLink, "observedAttributes", ["data-wcs-osi", "data-promotion-code"]);
var UptLink = _UptLink;
if (!window.customElements.get(UptLink.is)) {
  window.customElements.define(UptLink.is, UptLink, {
    extends: UptLink.tag
  });
}

// src/hydrate.js
var DEFAULT_BADGE_COLOR = "#000000";
var DEFAULT_PLANS_BADGE_COLOR = "spectrum-yellow-300-plans";
var DEFAULT_BADGE_BACKGROUND_COLOR = "#F8D904";
var DEFAULT_BORDER_COLOR = "#EAEAEA";
var CHECKOUT_STYLE_PATTERN = /(accent|primary|secondary)(-(outline|link))?/;
var ANALYTICS_TAG = "mas:product_code/";
var ANALYTICS_LINK_ATTR = "daa-ll";
var ANALYTICS_SECTION_ATTR = "daa-lh";
var SPECTRUM_BUTTON_SIZES = ["XL", "L", "M", "S"];
var TEXT_TRUNCATE_SUFFIX = "...";
function appendSlot(fieldName, fields, el, mapping) {
  const config = mapping[fieldName];
  if (fields[fieldName] && config) {
    const attributes = { slot: config?.slot };
    let content = fields[fieldName];
    if (config.maxCount && typeof content === "string") {
      const [truncatedContent, cleanContent] = getTruncatedTextData(
        content,
        config.maxCount,
        config.withSuffix
      );
      if (truncatedContent !== content) {
        attributes.title = cleanContent;
        content = truncatedContent;
      }
    }
    const tag = createTag(config.tag, attributes, content);
    el.append(tag);
  }
}
function processMnemonics(fields, merchCard, mnemonicsConfig) {
  const mnemonics = fields.mnemonicIcon?.map((icon, index) => ({
    icon,
    alt: fields.mnemonicAlt[index] ?? "",
    link: fields.mnemonicLink[index] ?? ""
  }));
  mnemonics?.forEach(({ icon: src, alt, link: href }) => {
    if (href && !/^https?:/.test(href)) {
      try {
        href = new URL(`https://${href}`).href.toString();
      } catch (e) {
        href = "#";
      }
    }
    const attrs = {
      slot: "icons",
      src,
      loading: merchCard.loading,
      size: mnemonicsConfig?.size ?? "l"
    };
    if (alt)
      attrs.alt = alt;
    if (href)
      attrs.href = href;
    const merchIcon = createTag("merch-icon", attrs);
    merchCard.append(merchIcon);
  });
}
function processBadge(fields, merchCard, mapping) {
  if (fields.variant === "plans") {
    if (fields.badge?.length && !fields.badge?.startsWith("<merch-badge")) {
      fields.badge = `<merch-badge variant="${fields.variant}" background-color="${DEFAULT_PLANS_BADGE_COLOR}">${fields.badge}</merch-badge>`;
      if (!fields.borderColor)
        fields.borderColor = DEFAULT_PLANS_BADGE_COLOR;
    }
    appendSlot("badge", fields, merchCard, mapping);
    return;
  }
  if (fields.badge) {
    merchCard.setAttribute("badge-text", fields.badge);
    merchCard.setAttribute(
      "badge-color",
      fields.badgeColor || DEFAULT_BADGE_COLOR
    );
    merchCard.setAttribute(
      "badge-background-color",
      fields.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR
    );
    merchCard.setAttribute(
      "border-color",
      fields.badgeBackgroundColor || DEFAULT_BADGE_BACKGROUND_COLOR
    );
  } else {
    merchCard.setAttribute(
      "border-color",
      fields.borderColor || DEFAULT_BORDER_COLOR
    );
  }
}
function processSize(fields, merchCard, sizeConfig) {
  if (sizeConfig?.includes(fields.size)) {
    merchCard.setAttribute("size", fields.size);
  }
}
function processTitle(fields, merchCard, titleConfig) {
  appendSlot("cardTitle", fields, merchCard, { cardTitle: titleConfig });
}
function processSubtitle(fields, merchCard, mapping) {
  appendSlot("subtitle", fields, merchCard, mapping);
}
function processBackgroundColor(fields, merchCard, allowedColors) {
  if (!fields.backgroundColor || fields.backgroundColor.toLowerCase() === "default") {
    merchCard.style.removeProperty("--merch-card-custom-background-color");
    merchCard.removeAttribute("background-color");
    return;
  }
  if (allowedColors?.[fields.backgroundColor]) {
    merchCard.style.setProperty(
      "--merch-card-custom-background-color",
      `var(${allowedColors[fields.backgroundColor]})`
    );
    merchCard.setAttribute("background-color", fields.backgroundColor);
  }
}
function processBorderColor(fields, merchCard, borderColorConfig) {
  const customBorderColor = "--merch-card-custom-border-color";
  if (fields.borderColor?.toLowerCase() === "transparent") {
    merchCard.style.removeProperty(customBorderColor);
    if (fields.variant === "plans")
      merchCard.style.setProperty(customBorderColor, "transparent");
  } else if (fields.borderColor && borderColorConfig) {
    if (/-gradient/.test(fields.borderColor)) {
      merchCard.setAttribute("gradient-border", "true");
      merchCard.style.removeProperty(customBorderColor);
    } else {
      merchCard.style.setProperty(
        customBorderColor,
        `var(--${fields.borderColor})`
      );
    }
  }
}
function processBackgroundImage(fields, merchCard, backgroundImageConfig) {
  if (fields.backgroundImage) {
    const imgAttributes = {
      loading: merchCard.loading ?? "lazy",
      src: fields.backgroundImage
    };
    if (fields.backgroundImageAltText) {
      imgAttributes.alt = fields.backgroundImageAltText;
    } else {
      imgAttributes.role = "none";
    }
    if (!backgroundImageConfig)
      return;
    if (backgroundImageConfig?.attribute) {
      merchCard.setAttribute(
        backgroundImageConfig.attribute,
        fields.backgroundImage
      );
      return;
    }
    merchCard.append(
      createTag(
        backgroundImageConfig.tag,
        { slot: backgroundImageConfig.slot },
        createTag("img", imgAttributes)
      )
    );
  }
}
function processPrices(fields, merchCard, mapping) {
  appendSlot("prices", fields, merchCard, mapping);
}
function processDescription(fields, merchCard, mapping) {
  appendSlot("promoText", fields, merchCard, mapping);
  appendSlot("description", fields, merchCard, mapping);
  appendSlot("callout", fields, merchCard, mapping);
  appendSlot("quantitySelect", fields, merchCard, mapping);
}
function processStockOffersAndSecureLabel(fields, merchCard, aemFragmentMapping, settings) {
  if (fields.showStockCheckbox && aemFragmentMapping.stockOffer) {
    merchCard.setAttribute("checkbox-label", settings.stockCheckboxLabel);
    merchCard.setAttribute("stock-offer-osis", settings.stockOfferOsis);
  }
  if (settings.secureLabel && aemFragmentMapping.secureLabel) {
    merchCard.setAttribute("secure-label", settings.secureLabel);
  }
}
function getTruncatedTextData(text, limit, withSuffix = true) {
  try {
    const _text = typeof text !== "string" ? "" : text;
    const cleanText = clearTags(_text);
    if (cleanText.length <= limit)
      return [_text, cleanText];
    let index = 0;
    let inTag = false;
    let remaining = withSuffix ? limit - TEXT_TRUNCATE_SUFFIX.length < 1 ? 1 : limit - TEXT_TRUNCATE_SUFFIX.length : limit;
    let openTags = [];
    for (const char of _text) {
      index++;
      if (char === "<") {
        inTag = true;
        if (_text[index] === "/") {
          openTags.pop();
        } else {
          let tagName = "";
          for (const tagChar of _text.substring(index)) {
            if (tagChar === " " || tagChar === ">")
              break;
            tagName += tagChar;
          }
          openTags.push(tagName);
        }
      }
      if (char === "/") {
        if (_text[index] === ">") {
          openTags.pop();
        }
      }
      if (char === ">") {
        inTag = false;
        continue;
      }
      if (inTag)
        continue;
      remaining--;
      if (remaining === 0)
        break;
    }
    let trimmedText = _text.substring(0, index).trim();
    if (openTags.length > 0) {
      if (openTags[0] === "p")
        openTags.shift();
      for (const tag of openTags.reverse()) {
        trimmedText += `</${tag}>`;
      }
    }
    let truncatedText = `${trimmedText}${withSuffix ? TEXT_TRUNCATE_SUFFIX : ""}`;
    return [truncatedText, cleanText];
  } catch (error) {
    const fallbackText = typeof text === "string" ? text : "";
    const cleanFallback = clearTags(fallbackText);
    return [fallbackText, cleanFallback];
  }
}
function clearTags(text) {
  if (!text)
    return "";
  let result = "";
  let inTag = false;
  for (const char of text) {
    if (char === "<")
      inTag = true;
    if (char === ">") {
      inTag = false;
      continue;
    }
    if (inTag)
      continue;
    result += char;
  }
  return result;
}
function processUptLinks(fields, merchCard) {
  const placeholders = merchCard.querySelectorAll("a.upt-link");
  placeholders.forEach((placeholder) => {
    const uptLink = UptLink.createFrom(placeholder);
    placeholder.replaceWith(uptLink);
    uptLink.initializeWcsData(fields.osi, fields.promoCode);
  });
}
function createSpectrumCssButton(cta, aemFragmentMapping, isOutline, variant) {
  const CheckoutButton = customElements.get("checkout-button");
  const spectrumCta = CheckoutButton.createCheckoutButton({}, cta.innerHTML);
  spectrumCta.setAttribute("tabindex", 0);
  for (const attr of cta.attributes) {
    if (["class", "is"].includes(attr.name))
      continue;
    spectrumCta.setAttribute(attr.name, attr.value);
  }
  spectrumCta.firstElementChild?.classList.add("spectrum-Button-label");
  const size = aemFragmentMapping.ctas.size ?? "M";
  const variantClass = `spectrum-Button--${variant}`;
  const sizeClass = SPECTRUM_BUTTON_SIZES.includes(size) ? `spectrum-Button--size${size}` : "spectrum-Button--sizeM";
  const spectrumClass = ["spectrum-Button", variantClass, sizeClass];
  if (isOutline) {
    spectrumClass.push("spectrum-Button--outline");
  }
  spectrumCta.classList.add(...spectrumClass);
  return spectrumCta;
}
function createSpectrumSwcButton(cta, aemFragmentMapping, isOutline, variant) {
  const CheckoutButton = customElements.get("checkout-button");
  const checkoutButton = CheckoutButton.createCheckoutButton(cta.dataset);
  checkoutButton.connectedCallback();
  checkoutButton.render();
  let treatment = "fill";
  if (isOutline) {
    treatment = "outline";
  }
  const spectrumCta = createTag(
    "sp-button",
    {
      treatment,
      variant,
      tabIndex: 0,
      size: aemFragmentMapping.ctas.size ?? "m",
      ...cta.dataset.analyticsId && {
        "data-analytics-id": cta.dataset.analyticsId
      }
    },
    cta.innerHTML
  );
  spectrumCta.source = checkoutButton;
  checkoutButton.onceSettled().then((target) => {
    spectrumCta.setAttribute("data-navigation-url", target.href);
  });
  spectrumCta.addEventListener("click", (e) => {
    if (e.defaultPrevented)
      return;
    checkoutButton.click();
  });
  return spectrumCta;
}
function createConsonantButton(cta, isAccent) {
  const CheckoutLink = customElements.get("checkout-link");
  const checkoutLink = CheckoutLink.createCheckoutLink(cta.dataset, cta.innerHTML);
  checkoutLink.classList.add("con-button");
  if (isAccent) {
    checkoutLink.classList.add("blue");
  }
  return checkoutLink;
}
function processCTAs(fields, merchCard, aemFragmentMapping, variant) {
  if (fields.ctas) {
    const { slot } = aemFragmentMapping.ctas;
    const footer = createTag("div", { slot }, fields.ctas);
    const ctas = [...footer.querySelectorAll("a")].map((cta) => {
      const checkoutLinkStyle = CHECKOUT_STYLE_PATTERN.exec(cta.className)?.[0] ?? "accent";
      const isAccent = checkoutLinkStyle.includes("accent");
      const isPrimary = checkoutLinkStyle.includes("primary");
      const isSecondary = checkoutLinkStyle.includes("secondary");
      const isOutline = checkoutLinkStyle.includes("-outline");
      const isLink = checkoutLinkStyle.includes("-link");
      if (merchCard.consonant)
        return createConsonantButton(cta, isAccent);
      if (isLink) {
        return cta;
      }
      let variant2;
      if (isAccent) {
        variant2 = "accent";
      } else if (isPrimary) {
        variant2 = "primary";
      } else if (isSecondary) {
        variant2 = "secondary";
      }
      return merchCard.spectrum === "swc" ? createSpectrumSwcButton(
        cta,
        aemFragmentMapping,
        isOutline,
        variant2
      ) : createSpectrumCssButton(
        cta,
        aemFragmentMapping,
        isOutline,
        variant2
      );
    });
    footer.innerHTML = "";
    footer.append(...ctas);
    merchCard.append(footer);
  }
}
function processAnalytics(fields, merchCard) {
  const { tags } = fields;
  const cardAnalyticsId = tags?.find((tag) => tag.startsWith(ANALYTICS_TAG))?.split("/").pop();
  if (!cardAnalyticsId)
    return;
  merchCard.setAttribute(ANALYTICS_SECTION_ATTR, cardAnalyticsId);
  const elements = [
    ...merchCard.shadowRoot.querySelectorAll(
      `a[data-analytics-id],button[data-analytics-id]`
    ),
    ...merchCard.querySelectorAll(
      `a[data-analytics-id],button[data-analytics-id]`
    )
  ];
  elements.forEach((el, index) => {
    el.setAttribute(
      ANALYTICS_LINK_ATTR,
      `${el.dataset.analyticsId}-${index + 1}`
    );
  });
}
function updateLinksCSS(merchCard) {
  if (merchCard.spectrum !== "css")
    return;
  [
    ["primary-link", "primary"],
    ["secondary-link", "secondary"]
  ].forEach(([className, variant]) => {
    merchCard.querySelectorAll(`a.${className}`).forEach((link) => {
      link.classList.remove(className);
      link.classList.add("spectrum-Link", `spectrum-Link--${variant}`);
    });
  });
}
function cleanup(merchCard) {
  merchCard.querySelectorAll("[slot]").forEach((el) => {
    el.remove();
  });
  const attributesToRemove = [
    "checkbox-label",
    "stock-offer-osis",
    "secure-label",
    "background-image",
    "background-color",
    "border-color",
    "badge-background-color",
    "badge-color",
    "badge-text",
    "size",
    ANALYTICS_SECTION_ATTR
  ];
  attributesToRemove.forEach((attr) => merchCard.removeAttribute(attr));
  const classesToRemove = ["wide-strip", "thin-strip"];
  merchCard.classList.remove(...classesToRemove);
}
async function hydrate(fragment, merchCard) {
  const { id, fields } = fragment;
  const { variant } = fields;
  if (!variant)
    throw new Error(`hydrate: no variant found in payload ${id}`);
  const settings = {
    stockCheckboxLabel: "Add a 30-day free trial of Adobe Stock.*",
    // to be {{stock-checkbox-label}}
    stockOfferOsis: "",
    secureLabel: "Secure transaction"
    // to be {{secure-transaction}}
  };
  cleanup(merchCard);
  merchCard.id ?? (merchCard.id = fragment.id);
  merchCard.removeAttribute("background-image");
  merchCard.removeAttribute("background-color");
  merchCard.removeAttribute("badge-background-color");
  merchCard.removeAttribute("badge-color");
  merchCard.removeAttribute("badge-text");
  merchCard.removeAttribute("size");
  merchCard.removeAttribute("gradient-border");
  merchCard.classList.remove("wide-strip");
  merchCard.classList.remove("thin-strip");
  merchCard.removeAttribute(ANALYTICS_SECTION_ATTR);
  merchCard.variant = variant;
  await merchCard.updateComplete;
  const { aemFragmentMapping } = merchCard.variantLayout;
  if (!aemFragmentMapping)
    throw new Error(`hydrate: aemFragmentMapping found for ${id}`);
  if (aemFragmentMapping.style === "consonant") {
    merchCard.setAttribute("consonant", true);
  }
  processMnemonics(fields, merchCard, aemFragmentMapping.mnemonics);
  processBadge(fields, merchCard, aemFragmentMapping);
  processSize(fields, merchCard, aemFragmentMapping.size);
  processTitle(fields, merchCard, aemFragmentMapping.title);
  processSubtitle(fields, merchCard, aemFragmentMapping);
  processPrices(fields, merchCard, aemFragmentMapping);
  processBackgroundImage(
    fields,
    merchCard,
    aemFragmentMapping.backgroundImage
  );
  processBackgroundColor(fields, merchCard, aemFragmentMapping.allowedColors);
  processBorderColor(fields, merchCard, aemFragmentMapping.borderColor);
  processDescription(fields, merchCard, aemFragmentMapping);
  processStockOffersAndSecureLabel(
    fields,
    merchCard,
    aemFragmentMapping,
    settings
  );
  processUptLinks(fields, merchCard);
  processCTAs(fields, merchCard, aemFragmentMapping, variant);
  processAnalytics(fields, merchCard);
  updateLinksCSS(merchCard);
}

// src/merch-card.js
var MERCH_CARD = "merch-card";
var MARK_READY_SUFFIX = ":ready";
var MARK_ERROR_SUFFIX = ":error";
var MERCH_CARD_LOAD_TIMEOUT = 2e4;
var MARK_MERCH_CARD_PREFIX = "merch-card:";
var _log2, _service2, _fail2, fail_fn2;
var MerchCard = class extends LitElement5 {
  constructor() {
    super();
    __privateAdd(this, _fail2);
    __publicField(this, "customerSegment");
    __publicField(this, "marketSegment");
    /**
     * @type {VariantLayout}
     */
    __publicField(this, "variantLayout");
    __privateAdd(this, _log2, void 0);
    __privateAdd(this, _service2, void 0);
    __publicField(this, "readyEventDispatched", false);
    this.id = null;
    this.failed = false;
    this.filters = {};
    this.types = "";
    this.selected = false;
    this.spectrum = "css";
    this.loading = "lazy";
    this.handleAemFragmentEvents = this.handleAemFragmentEvents.bind(this);
  }
  firstUpdated() {
    this.variantLayout = getVariantLayout(this, false);
    this.variantLayout?.connectedCallbackHook();
    this.aemFragment?.updateComplete.catch((e) => {
      __privateMethod(this, _fail2, fail_fn2).call(this, e, {}, false);
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
      this.style.setProperty(
        "--consonant-merch-card-border",
        this.computedBorderStyle
      );
    }
    this.variantLayout?.postCardUpdateHook(changedProperties);
  }
  get theme() {
    return this.closest("sp-theme");
  }
  get dir() {
    return this.closest("[dir]")?.getAttribute("dir") ?? "ltr";
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
    if (!["ccd-slice", "ccd-suggested", "ah-promoted-plans"].includes(this.variant)) {
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
    return this.headingmMSlot?.querySelector(SELECTOR_MAS_INLINE_PRICE);
  }
  get checkoutLinks() {
    return [
      ...this.footerSlot?.querySelectorAll(SELECTOR_MAS_CHECKOUT_LINK) ?? []
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
    __privateSet(this, _service2, getService());
    __privateSet(this, _log2, __privateGet(this, _service2).Log.module(MERCH_CARD));
    this.id ?? (this.id = this.querySelector("aem-fragment")?.getAttribute("fragment"));
    performance.mark(
      `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_START_SUFFIX}`
    );
    this.addEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelection
    );
    this.addEventListener(
      EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE,
      this.handleAddonAndQuantityUpdate
    );
    this.addEventListener(
      EVENT_MERCH_OFFER_SELECT_READY,
      this.merchCardReady,
      { once: true }
    );
    this.updateComplete.then(() => {
      this.merchCardReady();
    });
    this.addEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
    this.addEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
    if (!this.aemFragment) {
      setTimeout(() => this.checkReady(), 0);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.variantLayout?.disconnectedCallbackHook();
    this.removeEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantitySelection
    );
    this.removeEventListener(EVENT_AEM_ERROR, this.handleAemFragmentEvents);
    this.removeEventListener(EVENT_AEM_LOAD, this.handleAemFragmentEvents);
  }
  // custom methods
  async handleAemFragmentEvents(e) {
    if (e.type === EVENT_AEM_ERROR) {
      __privateMethod(this, _fail2, fail_fn2).call(this, `AEM fragment cannot be loaded: ${e.detail.message}`, e.detail);
    }
    if (e.type === EVENT_AEM_LOAD) {
      if (e.target.nodeName === "AEM-FRAGMENT") {
        const fragment = e.detail;
        hydrate(fragment, this).then(() => this.checkReady()).catch((e2) => __privateGet(this, _log2).error(e2));
      }
    }
  }
  async checkReady() {
    const timeoutPromise = new Promise(
      (resolve) => setTimeout(() => resolve("timeout"), MERCH_CARD_LOAD_TIMEOUT)
    );
    if (this.aemFragment) {
      const result2 = await Promise.race([
        this.aemFragment.updateComplete,
        timeoutPromise
      ]);
      if (result2 === false) {
        const errorMessage = result2 === "timeout" ? `AEM fragment was not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout` : "AEM fragment cannot be loaded";
        __privateMethod(this, _fail2, fail_fn2).call(this, errorMessage, {}, false);
        return;
      }
    }
    const masElements = [...this.querySelectorAll(SELECTOR_MAS_ELEMENT)];
    masElements.push(
      ...[...this.querySelectorAll(SELECTOR_MAS_SP_BUTTON)].map(
        (element) => element.source
      )
    );
    const successPromise = Promise.all(
      masElements.map(
        (element) => element.onceSettled().catch(() => element)
      )
    ).then(
      (elements) => elements.every(
        (el) => el.classList.contains("placeholder-resolved")
      )
    );
    const result = await Promise.race([successPromise, timeoutPromise]);
    if (result === true) {
      performance.mark(
        `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_READY_SUFFIX}`
      );
      if (!this.readyEventDispatched) {
        this.readyEventDispatched = true;
        this.dispatchEvent(
          new CustomEvent(EVENT_MAS_READY, {
            bubbles: true,
            composed: true
          })
        );
      }
      return this;
    } else {
      const { duration, startTime } = performance.measure(
        `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_ERROR_SUFFIX}`,
        `${MARK_MERCH_CARD_PREFIX}${this.id}${MARK_START_SUFFIX}`
      );
      const details = {
        duration,
        startTime,
        ...__privateGet(this, _service2).duration
      };
      if (result === "timeout") {
        __privateMethod(this, _fail2, fail_fn2).call(this, `Contains offers that were not resolved within ${MERCH_CARD_LOAD_TIMEOUT} timeout`, details);
      } else {
        __privateMethod(this, _fail2, fail_fn2).call(this, `Contains unresolved offers`, details);
      }
    }
  }
  get aemFragment() {
    return this.querySelector("aem-fragment");
  }
  /* c8 ignore next 3 */
  get quantitySelect() {
    return this.querySelector("merch-quantity-select");
  }
  displayFooterElementsInColumn() {
    if (!this.classList.contains("product"))
      return;
    const secureTransactionLabel = this.shadowRoot.querySelector(
      ".secure-transaction-label"
    );
    const checkoutLinkCtas = this.footerSlot?.querySelectorAll(
      SELECTOR_MAS_CHECKOUT_LINK
    );
    if (checkoutLinkCtas.length === 2 && secureTransactionLabel) {
      secureTransactionLabel.parentElement.classList.add("footer-column");
    }
  }
  merchCardReady() {
    if (this.offerSelect && !this.offerSelect.planType)
      return;
    this.dispatchEvent(
      new CustomEvent(EVENT_MERCH_CARD_READY, { bubbles: true })
    );
    this.displayFooterElementsInColumn();
  }
  /* c8 ignore next 3 */
  get dynamicPrice() {
    return this.querySelector('[slot="price"]');
  }
  handleAddonAndQuantityUpdate({ detail: { id, items } }) {
    if (!id || !items?.length)
      return;
    const cta = this.checkoutLinks.find((link) => link.getAttribute("data-modal-id") === id);
    if (!cta)
      return;
    console.log("found card that has to be updated", cta);
  }
};
_log2 = new WeakMap();
_service2 = new WeakMap();
_fail2 = new WeakSet();
fail_fn2 = function(error, details = {}, dispatch = true) {
  __privateGet(this, _log2).error(`merch-card: ${error}`, details);
  this.failed = true;
  if (!dispatch)
    return;
  this.dispatchEvent(
    new CustomEvent(EVENT_MAS_ERROR, {
      detail: { ...details, message: error },
      bubbles: true,
      composed: true
    })
  );
};
__publicField(MerchCard, "properties", {
  id: { type: String, attribute: "id", reflect: true },
  name: { type: String, attribute: "name", reflect: true },
  variant: { type: String, reflect: true },
  size: { type: String, attribute: "size", reflect: true },
  badgeColor: { type: String, attribute: "badge-color", reflect: true },
  borderColor: { type: String, attribute: "border-color", reflect: true },
  badgeBackgroundColor: {
    type: String,
    attribute: "badge-background-color",
    reflect: true
  },
  backgroundImage: {
    type: String,
    attribute: "background-image",
    reflect: true
  },
  badgeText: { type: String, attribute: "badge-text" },
  actionMenu: { type: Boolean, attribute: "action-menu" },
  actionMenuLabel: { type: String, attribute: "action-menu-label" },
  customHr: { type: Boolean, attribute: "custom-hr" },
  consonant: { type: Boolean, attribute: "consonant" },
  failed: { type: Boolean, attribute: "failed", reflect: true },
  spectrum: { type: String, attribute: "spectrum" },
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
        if (!value)
          return;
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
  merchOffer: { type: Object },
  analyticsId: {
    type: String,
    attribute: ANALYTICS_SECTION_ATTR,
    reflect: true
  },
  loading: { type: String }
});
__publicField(MerchCard, "styles", [styles, ...sizeStyles()]);
__publicField(MerchCard, "registerVariant", registerVariant);
__publicField(MerchCard, "getFragmentMapping", getFragmentMapping);
customElements.define(MERCH_CARD, MerchCard);
export {
  MerchCard
};

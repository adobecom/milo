var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);

// src/merch-card-collection-header.js
import { html as html10, css as css7, unsafeCSS as unsafeCSS2, LitElement, nothing as nothing3 } from "../lit-all.min.js";

// src/media.js
var MOBILE_LANDSCAPE = "(max-width: 767px)";
var TABLET_DOWN = "(max-width: 1199px)";
var TABLET_UP = "(min-width: 768px)";
var DESKTOP_UP = "(min-width: 1200px)";
var LARGE_DESKTOP = "(min-width: 1600px)";

// node_modules/@spectrum-web-components/reactive-controllers/src/MatchMedia.js
var MatchMediaController = class {
  constructor(e, t) {
    this.key = Symbol("match-media-key");
    this.matches = false;
    this.host = e, this.host.addController(this), this.media = window.matchMedia(t), this.matches = this.media.matches, this.onChange = this.onChange.bind(this), e.addController(this);
  }
  hostConnected() {
    var e;
    (e = this.media) == null || e.addEventListener("change", this.onChange);
  }
  hostDisconnected() {
    var e;
    (e = this.media) == null || e.removeEventListener("change", this.onChange);
  }
  onChange(e) {
    this.matches !== e.matches && (this.matches = e.matches, this.host.requestUpdate(this.key, !this.matches));
  }
};

// src/variants/variant-layout.js
import { html, nothing } from "../lit-all.min.js";
var _container;
var _VariantLayout = class _VariantLayout {
  constructor(card) {
    __publicField(this, "card");
    __privateAdd(this, _container);
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
      const styles = document.createElement("style");
      styles.innerHTML = this.getGlobalCSS();
      document.head.appendChild(styles);
    }
  }
  updateCardElementMinHeight(el, name) {
    if (!el) return;
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
    return html`
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
    return html` <div class="image">
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
  get secureLabel() {
    return this.card.secureLabel ? html`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >` : nothing;
  }
  get secureLabelFooter() {
    return html`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`;
  }
  async adjustTitleWidth() {
    const cardWidth = this.card.getBoundingClientRect().width;
    const badgeWidth = this.card.badgeElement?.getBoundingClientRect().width || 0;
    if (cardWidth === 0 || badgeWidth === 0) return;
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
  get aemFragmentMapping() {
    return getFragmentMapping(this.card.variant);
  }
};
_container = new WeakMap();
__publicField(_VariantLayout, "styleMap", {});
var VariantLayout = _VariantLayout;

// src/variants/catalog.js
import { html as html2, css } from "../lit-all.min.js";

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
var SELECTOR_MAS_ELEMENT = `${SELECTOR_MAS_INLINE_PRICE},${SELECTOR_MAS_CHECKOUT_LINK}`;
var EVENT_MERCH_CARD_ACTION_MENU_TOGGLE = "merch-card:action-menu-toggle";
var EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED = "merch-card-collection:literals-changed";
var CheckoutWorkflowStep = Object.freeze({
  SEGMENTATION: "segmentation",
  BUNDLE: "bundle",
  COMMITMENT: "commitment",
  RECOMMENDATION: "recommendation",
  EMAIL: "email",
  PAYMENT: "payment",
  CHANGE_PLAN_TEAM_PLANS: "change-plan/team-upgrade/plans",
  CHANGE_PLAN_TEAM_PAYMENT: "change-plan/team-upgrade/payment"
});
var Env = Object.freeze({
  STAGE: "STAGE",
  PRODUCTION: "PRODUCTION",
  LOCAL: "LOCAL"
});
var TEMPLATE_PRICE_LEGAL = "legal";
var SORT_ORDER = {
  alphabetical: "alphabetical",
  authored: "authored"
};

// src/utils.js
var getSlotText = (element, name) => element?.querySelector(`[slot="${name}"]`)?.textContent?.trim();
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
      if (!this.actionMenuContentSlot || !e || e.type !== "click" && e.code !== "Space" && e.code !== "Enter") return;
      e.preventDefault();
      this.actionMenuContentSlot.classList.toggle("hidden");
      const isHidden = this.actionMenuContentSlot.classList.contains("hidden");
      if (!isHidden) this.dispatchActionMenuToggle();
      this.setAriaExpanded(this.actionMenu, (!isHidden).toString());
    });
    __publicField(this, "toggleActionMenuFromCard", (e) => {
      const retract = e?.type === "mouseleave" ? true : void 0;
      this.card.blur();
      this.actionMenu?.classList.remove("always-visible");
      if (!this.actionMenuContentSlot) return;
      if (!retract) this.dispatchActionMenuToggle();
      this.actionMenuContentSlot.classList.toggle("hidden", retract);
      this.setAriaExpanded(this.actionMenu, "false");
    });
    __publicField(this, "hideActionMenu", (e) => {
      this.actionMenuContentSlot?.classList.add("hidden");
      this.setAriaExpanded(this.actionMenu, "false");
    });
  }
  get actionMenu() {
    return this.card.shadowRoot.querySelector(".action-menu");
  }
  get actionMenuContentSlot() {
    return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');
  }
  renderLayout() {
    return html2` <div class="body">
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
                ${!this.promoBottom ? html2`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>` : ""}
                <slot name="body-xs"></slot>
                ${this.promoBottom ? html2`<slot name="promo-text"></slot
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
__publicField(Catalog, "variantStyle", css`
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
import { html as html3 } from "../lit-all.min.js";

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
    return html3`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom ? html3`<slot name="body-xs"></slot><slot name="promo-text"></slot>` : html3`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen ? html3`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card["detailBg"]}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          ` : html3`
              <hr />
              ${this.secureLabelFooter}
          `}`;
  }
};

// src/variants/inline-heading.js
import { html as html4 } from "../lit-all.min.js";

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
    return html4` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${!this.card.customHr ? html4`<hr />` : ""} ${this.secureLabelFooter}`;
  }
};

// src/variants/mini-compare-chart.js
import { html as html5, css as css2, unsafeCSS } from "../lit-all.min.js";

// src/variants/mini-compare-chart.css.js
var CSS4 = `
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 16px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
    --consonant-merch-card-mini-compare-mobile-price-font-size: 32px;
    --consonant-merch-card-mini-compare-mobile-border-color-light: #F3F3F3;
    --consonant-merch-card-card-mini-compare-mobile-background-color: #F8F8F8;
    --consonant-merch-card-card-mini-compare-mobile-spacing-xs: 12px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] merch-addon {
    box-sizing: border-box;
  }

  merch-card[variant="mini-compare-chart"] merch-addon {
    padding-left: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    border-radius: .5rem;
    font-family: var(--merch-body-font-family, 'Adobe Clean');
    margin: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) .5rem;
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] merch-addon [is="inline-price"] {
    min-height: unset;
    font-weight: bold;
    pointer-events: none;
  }

  merch-card[variant="mini-compare-chart"] merch-addon::part(checkbox) {
      height: 18px;
      width: 18px;
      margin: 14px 12px 0 8px;
  }

  merch-card[variant="mini-compare-chart"] merch-addon::part(label) {
    display: flex;
    flex-direction: column;
    padding: 8px 4px 8px 0;
    width: 100%;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
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

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'],
  merch-card[variant="mini-compare-chart"].bullet-list [slot='price-commitment'] {
    padding: 0 var(--consonant-merch-spacing-xs);
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
    gap: var(--consonant-merch-spacing-xxs);
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
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-color: var(--merch-color-grey-60);
    font-weight: 700;
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-s-font-size);
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

  merch-card[variant="mini-compare-chart"] .toggle-icon {
    display: flex;
    background-color: transparent;
    border: none;
    padding: 0;
    margin: 0;
    text-align: inherit;
    font: inherit;
    border-radius: 0;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
    padding-block-start: var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs);
    padding-block-end: 4px;
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

  merch-card[variant="mini-compare-chart"] merch-addon {
    box-sizing: border-box;
  }

  merch-card[variant="mini-compare-chart"].bullet-list {
    border-radius: var(--consonant-merch-spacing-xxs);
    border-color: var(--consonant-merch-card-mini-compare-mobile-border-color-light);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    padding: 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-mini-compare-mobile-price-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    font-weight: 800;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] span.price-strikethrough,
  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] span[is="inline-price"][data-template="strikethrough"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="price-commitment"] {
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xs) 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
    padding: var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs) var(--consonant-merch-spacing-xs) 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="offers"] {
    padding: 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list .action-area {
    justify-content: flex-start;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="footer-rows"] {
    background-color: var(--consonant-merch-card-card-mini-compare-mobile-background-color);
    border-radius: 0 0 var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xxs);
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

  merch-card[variant="mini-compare-chart"].bullet-list .footer-row-cell-description {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
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
    // For addon tiitle is it ok if we hardocde it in card settings?
    // For addon is it ok if we hardcode it as placeholder key?
    // How to add the price?
    __publicField(this, "getMiniCompareFooter", () => {
      const secureLabel = this.card.secureLabel ? html5`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >` : html5`<slot name="secure-transaction-label"></slot>`;
      return html5`<footer>${secureLabel}<slot name="footer"></slot></footer>`;
    });
  }
  getGlobalCSS() {
    return CSS4;
  }
  adjustMiniCompareBodySlots() {
    if (this.card.getBoundingClientRect().width <= 2) return;
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
      "callout-content",
      "addon"
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
    if (this.card.getBoundingClientRect().width === 0) return;
    const footerRows = this.card.querySelector('[slot="footer-rows"] ul');
    if (!footerRows || !footerRows.children) return;
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
  get mainPrice() {
    const price = this.card.querySelector(
      `[slot="heading-m-price"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`
    );
    return price;
  }
  get headingMPriceSlot() {
    return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0];
  }
  toggleAddon(merchAddon) {
    const mainPrice = this.mainPrice;
    const headingMPriceSlot = this.headingMPriceSlot;
    if (!mainPrice && headingMPriceSlot) {
      const planType = merchAddon?.getAttribute("plan-type");
      let visibleSpan = null;
      if (merchAddon && planType) {
        const matchingP = merchAddon.querySelector(`p[data-plan-type="${planType}"]`);
        visibleSpan = matchingP?.querySelector('span[is="inline-price"]');
      }
      this.card.querySelectorAll('p[slot="heading-m-price"]').forEach((p) => p.remove());
      if (merchAddon.checked) {
        if (visibleSpan) {
          const replacementP = createTag(
            "p",
            { class: "addon-heading-m-price-addon", slot: "heading-m-price" },
            visibleSpan.innerHTML
          );
          this.card.appendChild(replacementP);
        }
      } else {
        const freeP = createTag(
          "p",
          { class: "card-heading", id: "free", slot: "heading-m-price" },
          "Free"
        );
        this.card.appendChild(freeP);
      }
    }
  }
  async adjustAddon() {
    await this.card.updateComplete;
    const addon = this.card.addon;
    if (!addon) return;
    const price = this.mainPrice;
    let planType = this.card.planType;
    if (price) {
      await price.onceSettled();
      planType = price.value?.[0]?.planType;
    }
    if (!planType) return;
    addon.planType = planType;
  }
  renderLayout() {
    return html5` <div class="top-section${this.badge ? " badge" : ""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list") ? html5`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>` : html5`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`;
  }
  async postCardUpdateHook() {
    await Promise.all(this.card.prices.map((price) => price.onceSettled()));
    await this.adjustAddon();
    if (!isMobile()) {
      this.adjustMiniCompareBodySlots();
      this.adjustMiniCompareFooterRows();
    } else {
      this.removeEmptyRows();
    }
  }
};
__publicField(MiniCompareChart, "variantStyle", css2`
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

    @media screen and ${unsafeCSS(MOBILE_LANDSCAPE)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${unsafeCSS(TABLET_DOWN)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${unsafeCSS(DESKTOP_UP)} {
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
    :host([variant='mini-compare-chart']) slot[name='addon'] {
        min-height: var(
            --consonant-merch-card-mini-compare-chart-addon-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);

// src/variants/plans.js
import { html as html6, css as css3, nothing as nothing2 } from "../lit-all.min.js";

// src/variants/plans.css.js
var CSS5 = `
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
    --consonant-merch-card-plans-students-width: 568px;
}

merch-card[variant^="plans"] {
    --merch-card-plans-heading-xs-min-height: 23px;
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant^="plans"][size="wide"], merch-card[variant^="plans"][size="super-wide"] {
    width: auto;
}

merch-card[variant="plans-students"] {
    width: 100%;
}

merch-card[variant^="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant="plans-education"] [slot="body-xs"] span.price:not(.price-legal) {
  display: inline-block;
  font-size: var(--consonant-merch-card-heading-xs-font-size);
  font-weight: 700;
}

merch-card[variant^="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant^="plans"] [slot="heading-m"] span.price.price-strikethrough,
merch-card[variant="plans-education"] [slot="body-xs"] span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-heading-xxxs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 700;
}

merch-card[variant^="plans"] [slot='heading-xs'],
merch-card[variant="plans-education"] span.heading-xs,
merch-card[variant="plans-education"] [slot="body-xs"] span.price:not(.price-strikethrough) {
  min-height: var(--merch-card-plans-heading-xs-min-height);
}

merch-card[variant="plans-education"] span.heading-xs {
  margin-top: 16px;
  margin-bottom: 8px;
}

merch-card[variant="plans-education"] [slot="body-xs"] p:first-of-type span.heading-xs {
  margin-top: 8px;
}

merch-card[variant="plans-education"] span.promo-text {
  margin-bottom: 8px;
}

merch-card[variant="plans-education"] p:has(a[href^='tel:']):has(+ p) {
  margin-bottom: 16px;
}

merch-card[variant^="plans"] [slot="promo-text"],
merch-card[variant="plans-education"] span.promo-text {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection.plans merch-card {
  width: auto;
  height: 100%;
}

merch-card-collection.plans merch-card aem-fragment + [slot^="heading-"] {
    margin-top: calc(40px + var(--consonant-merch-spacing-xxs));
}

merch-card[variant^='plans'] span[data-template="legal"] {
    display: block;
    color: var(----merch-color-grey-80);
    font-family: var(--Font-adobe-clean, "Adobe Clean");
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    line-height: 21px;
}

merch-card[variant^='plans'] span.price-legal::first-letter {
    text-transform: uppercase;
}

merch-card[variant^='plans'] span.price-legal .price-tax-inclusivity::before {
  content: initial;
}

merch-card[variant^="plans"] [slot="description"] {
    min-height: 84px;
}

merch-card[variant^="plans"] [slot="body-xs"] a {
    color: var(--link-color);
}

merch-card[variant^="plans"] [slot="promo-text"] a {
    color: inherit;
}

merch-card[variant^="plans"] [slot="callout-content"] {
    margin: 8px 0 0;
}

merch-card[variant^="plans"] [slot='callout-content'] > div > div,
merch-card[variant^="plans"] [slot="callout-content"] > p {
    position: relative;
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant^="plans"] [slot="callout-content"] > p:has(> .icon-button) {
    padding-right: 36px;
}

merch-card[variant^="plans"] [slot='callout-content'] > p,
merch-card[variant^="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant^="plans"] [slot="callout-content"] img,
merch-card[variant^="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant^="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant^="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
    flex-grow: 1;
    align-items: end;
}

merch-card[variant^="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

merch-card[variant^="plans"] [slot="footer"] .con-button > span {
    min-width: unset;
}

merch-card[variant^="plans"] merch-addon {
    margin-top: 16px;
    margin-bottom: 16px;
    font-family: "Adobe Clean";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    align-items: center;
}

merch-card[variant^="plans"] merch-addon span[data-template="price"] {
    display: none;
}

/* Mobile */
@media screen and ${MOBILE_LANDSCAPE} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }

    merch-card[variant="plans-students"] {
        min-width: var(--consonant-merch-card-plans-width);
        max-width: var(--consonant-merch-card-plans-students-width);
        width: 100%;
    }
}

merch-card[variant^="plans"]:not([size]) {
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

merch-card-collection-header.plans {
    --merch-card-collection-header-columns: 1fr fit-content(100%);
    --merch-card-collection-header-areas: "result filter";
}

.columns .text .foreground {
    margin: 0;
}

.columns.merch-card > .row {
    grid-template-columns: repeat(auto-fit, var(--consonant-merch-card-plans-width));
    justify-content: center;
    align-items: center;
}

.columns.checkmark-list ul {
    padding-left: 20px;
    list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 18 18" height="18px"><path fill="currentcolor" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"></path></svg>');
}

.columns.checkmark-list ul li {
    padding-left: 8px;
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
  .columns.merch-card > .row {
      grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width)*2 + var(--consonant-merch-spacing-m)));
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
  .columns .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
  merch-card[variant="plans-students"] {
      width: var(--consonant-merch-card-plans-students-width);
  }

  merch-card-collection-header.plans {
      --merch-card-collection-header-columns: fit-content(100%);
      --merch-card-collection-header-areas: "custom";
  }
}

/* Large desktop */
    @media screen and ${LARGE_DESKTOP} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;

// src/variants/plans.js
var PLANS_AEM_FRAGMENT_MAPPING = {
  title: { tag: "h3", slot: "heading-xs" },
  prices: { tag: "p", slot: "heading-m" },
  promoText: { tag: "p", slot: "promo-text" },
  description: { tag: "div", slot: "body-xs" },
  mnemonics: { size: "l" },
  callout: { tag: "div", slot: "callout-content" },
  quantitySelect: { tag: "div", slot: "quantity-select" },
  addon: true,
  secureLabel: true,
  planType: true,
  badge: { tag: "div", slot: "badge", default: "spectrum-yellow-300-plans" },
  allowedBadgeColors: [
    "spectrum-yellow-300-plans",
    "spectrum-gray-300-plans",
    "spectrum-gray-700-plans",
    "spectrum-green-900-plans"
  ],
  allowedBorderColors: [
    "spectrum-yellow-300-plans",
    "spectrum-gray-300-plans",
    "spectrum-green-900-plans"
  ],
  borderColor: { attribute: "border-color" },
  size: ["wide", "super-wide"],
  whatsIncluded: { tag: "div", slot: "whats-included" },
  ctas: { slot: "footer", size: "m" },
  style: "consonant"
};
var PLANS_EDUCATION_AEM_FRAGMENT_MAPPING = {
  ...function() {
    const { whatsIncluded, ...rest } = PLANS_AEM_FRAGMENT_MAPPING;
    return rest;
  }(),
  title: { tag: "h3", slot: "heading-s" },
  subtitle: { tag: "p", slot: "subtitle" },
  secureLabel: false
};
var PLANS_STUDENTS_AEM_FRAGMENT_MAPPING = {
  ...function() {
    const { whatsIncluded, size, quantitySelect, ...rest } = PLANS_AEM_FRAGMENT_MAPPING;
    return rest;
  }()
};
var Plans = class extends VariantLayout {
  constructor(card) {
    super(card);
    this.adaptForMobile = this.adaptForMobile.bind(this);
  }
  priceOptionsProvider(element, options) {
    if (element.dataset.template !== TEMPLATE_PRICE_LEGAL) return;
    options.displayPlanType = this.card?.settings?.displayPlanType ?? false;
  }
  getGlobalCSS() {
    return CSS5;
  }
  adaptForMobile() {
    if (!this.card.closest(
      "merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns"
    )) {
      this.card.removeAttribute("size");
      return;
    }
    const shadowRoot = this.card.shadowRoot;
    const footer = shadowRoot.querySelector("footer");
    const size = this.card.getAttribute("size");
    const stockInFooter = shadowRoot.querySelector(
      "footer #stock-checkbox"
    );
    const stockInBody = shadowRoot.querySelector(".body #stock-checkbox");
    const body = shadowRoot.querySelector(".body");
    if (!size) {
      footer?.classList.remove("wide-footer");
      if (stockInFooter) stockInFooter.remove();
      return;
    }
    const mobile = isMobile();
    footer?.classList.toggle("wide-footer", !mobile);
    if (mobile && stockInFooter) {
      stockInBody ? stockInFooter.remove() : body.appendChild(stockInFooter);
      return;
    }
    if (!mobile && stockInBody) {
      stockInFooter ? stockInBody.remove() : footer.prepend(stockInBody);
    }
  }
  adjustCallout() {
    const tooltipIcon = this.card.querySelector('[slot="callout-content"] .icon-button');
    if (tooltipIcon && tooltipIcon.title) {
      tooltipIcon.dataset.tooltip = tooltipIcon.title;
      tooltipIcon.removeAttribute("title");
      tooltipIcon.classList.add("hide-tooltip");
      document.addEventListener("touchstart", (event) => {
        event.preventDefault();
        if (event.target !== tooltipIcon) {
          tooltipIcon.classList.add("hide-tooltip");
        } else {
          event.target.classList.toggle("hide-tooltip");
        }
      });
      document.addEventListener("mouseover", (event) => {
        event.preventDefault();
        if (event.target !== tooltipIcon) {
          tooltipIcon.classList.add("hide-tooltip");
        } else {
          event.target.classList.remove("hide-tooltip");
        }
      });
    }
  }
  postCardUpdateHook() {
    this.adaptForMobile();
    this.adjustTitleWidth();
    this.adjustLegal();
    this.adjustAddon();
    this.adjustCallout();
  }
  get headingM() {
    return this.card.querySelector('[slot="heading-m"]');
  }
  get mainPrice() {
    const price = this.headingM.querySelector(
      `${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`
    );
    return price;
  }
  get divider() {
    return this.card.variant === "plans-education" ? html6`<div class="divider"></div>` : nothing2;
  }
  async adjustLegal() {
    await this.card.updateComplete;
    if (this.legalAdjusted) return;
    this.legalAdjusted = true;
    const prices = [];
    const headingPrice = this.card.querySelector(`[slot="heading-m"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`);
    if (headingPrice) prices.push(headingPrice);
    const bodyPrices = this.card.querySelectorAll(`[slot="body-xs"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`);
    bodyPrices.forEach((bodyPrice) => prices.push(bodyPrice));
    const legalPromises = prices.map(async (price) => {
      const legal = price.cloneNode(true);
      await price.onceSettled();
      if (!price?.options) return;
      if (price.options.displayPerUnit)
        price.dataset.displayPerUnit = "false";
      if (price.options.displayTax) price.dataset.displayTax = "false";
      if (price.options.displayPlanType)
        price.dataset.displayPlanType = "false";
      legal.setAttribute("data-template", "legal");
      price.parentNode.insertBefore(legal, price.nextSibling);
    });
    await Promise.all(legalPromises);
  }
  async adjustAddon() {
    await this.card.updateComplete;
    const addon = this.card.addon;
    if (!addon) return;
    const price = this.mainPrice;
    if (!price) return;
    await price.onceSettled();
    const planType = price.value?.[0]?.planType;
    if (!planType) return;
    addon.planType = planType;
  }
  get stockCheckbox() {
    return this.card.checkboxLabel ? html6`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>` : nothing2;
  }
  get icons() {
    if (!this.card.querySelector('[slot="icons"]') && !this.card.getAttribute("id")) return nothing2;
    return html6`<slot name="icons"></slot>`;
  }
  get addon() {
    if (this.card.size === "super-wide") return nothing2;
    return html6`<slot name="addon"></slot>`;
  }
  get plansSecureLabelFooter() {
    if (this.card.size === "super-wide")
      return html6`<footer><slot name="addon"></slot>${this.secureLabel}<slot name="footer"></slot></footer>`;
    return this.secureLabelFooter;
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
    return html6` ${this.badge}
            <div class="body">
                ${this.icons}
                <slot name="heading-xs"></slot>
                <slot name="heading-s"></slot>
                <slot name="subtitle"></slot>
                ${this.divider}
                <slot name="heading-m"></slot>
                <slot name="annualPrice"></slot>
                <slot name="priceLabel"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>
                <slot name="whats-included"></slot>
                <slot name="callout-content"></slot>
                ${this.stockCheckbox}
                ${this.addon}
                <slot name="badge"></slot>
                <slot name="quantity-select"></slot>
            </div>
            ${this.plansSecureLabelFooter}`;
  }
};
__publicField(Plans, "variantStyle", css3`
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-max-width: 244px;
            --merch-card-plans-padding: 15px;
            --merch-card-plans-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
        }

        :host([variant='plans-education']) {
            min-height: unset;
        }

        :host([variant='plans-education']) ::slotted([slot='subtitle']) {
            font-size: var(--consonant-merch-card-heading-xxxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxxs-line-height);
            font-style: italic;
            font-weight: 400;
        }
        :host([variant='plans-education']) .divider {
            border: 0;
            border-top: 1px solid #E8E8E8;
            margin-top: 8px;
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
__publicField(Plans, "collectionOptions", {
  customHeaderArea: () => {
    return html6`<slot name="resultsText"></slot>`;
  },
  headerVisibility: {
    search: false,
    sort: false,
    custom: ["desktop"]
  }
});

// src/variants/product.js
import { html as html7, css as css4 } from "../lit-all.min.js";

// src/variants/product.css.js
var CSS6 = `
:root {
  --consonant-merch-card-product-width: 300px;
}

  merch-card[variant="product"] merch-addon {
    padding-left: 4px;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 8px;
    border-radius: .5rem;
    font-family: var(--merch-body-font-family, 'Adobe Clean');
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
  }

  merch-card[variant="product"] merch-addon [is="inline-price"] {
    font-weight: bold;
    pointer-events: none;
  }

  merch-card[variant="product"] merch-addon::part(checkbox) {
      height: 18px;
      width: 18px;
      margin: 14px 12px 0 8px;
  }

  merch-card[variant="product"] merch-addon::part(label) {
    display: flex;
    flex-direction: column;
    padding: 8px 4px 8px 0;
    width: 100%;
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
    if (this.card.getBoundingClientRect().width === 0) return;
    const slots = [
      "heading-xs",
      "body-xxs",
      "body-xs",
      "promo-text",
      "callout-content",
      "addon",
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
    return html7` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${!this.promoBottom ? html7`<slot name="promo-text"></slot>` : ""}
                <slot name="body-xs"></slot>
                ${this.promoBottom ? html7`<slot name="promo-text"></slot>` : ""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
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
    if (!this.card.isConnected) return;
    this.adjustAddon();
    if (!isMobile()) {
      this.adjustProductBodySlots();
    }
    this.adjustTitleWidth();
  }
  get headingXSSlot() {
    return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0];
  }
  get mainPrice() {
    const price = this.card.querySelector(
      `[slot="heading-xs"] ${SELECTOR_MAS_INLINE_PRICE}[data-template="price"]`
    );
    return price;
  }
  toggleAddon(merchAddon) {
    const mainPrice = this.mainPrice;
    const headingXSSlot = this.headingXSSlot;
    if (!mainPrice && headingXSSlot) {
      const planType = merchAddon?.getAttribute("plan-type");
      let visibleSpan = null;
      if (merchAddon && planType) {
        const matchingP = merchAddon.querySelector(`p[data-plan-type="${planType}"]`);
        visibleSpan = matchingP?.querySelector('span[is="inline-price"]');
      }
      this.card.querySelectorAll('p[slot="heading-xs"]').forEach((p) => p.remove());
      if (merchAddon.checked) {
        if (visibleSpan) {
          const replacementP = createTag(
            "p",
            { class: "addon-heading-xs-price-addon", slot: "heading-xs" },
            visibleSpan.innerHTML
          );
          this.card.appendChild(replacementP);
        }
      } else {
        const freeP = createTag(
          "p",
          { class: "card-heading", id: "free", slot: "heading-xs" },
          "Free"
        );
        this.card.appendChild(freeP);
      }
    }
  }
  async adjustAddon() {
    await this.card.updateComplete;
    const addon = this.card.addon;
    if (!addon) return;
    const price = this.mainPrice;
    let planType = this.card.planType;
    if (price) {
      await price.onceSettled();
      planType = price.value?.[0]?.planType;
    }
    if (!planType) return;
    addon.planType = planType;
  }
};
__publicField(Product, "variantStyle", css4`
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
            min-height: var(
                --consonant-merch-card-product-callout-content-height
            );
            display: block;
        }
        :host([variant='product']) slot[name='addon'] {
            min-height: var(
                --consonant-merch-card-product-addon-height
            );
        }

        :host([variant='product']) ::slotted([slot='heading-xs']) {
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }
    `);

// src/variants/segment.js
import { html as html8, css as css5 } from "../lit-all.min.js";

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
    return html8` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${!this.promoBottom ? html8`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
        <slot name="body-xs"></slot>
        ${this.promoBottom ? html8`<slot name="promo-text"></slot><slot name="callout-content"></slot>` : ""}
    </div>
    <hr />
    ${this.secureLabelFooter}`;
  }
};
__publicField(Segment, "variantStyle", css5`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);

// src/variants/special-offer.js
import { html as html9, css as css6 } from "../lit-all.min.js";

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
  renderLayout() {
    return html9`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen ? html9`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card["detailBg"]}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  ` : html9`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`;
  }
};
__publicField(SpecialOffer, "variantStyle", css6`
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
var registerVariant = (name, variantClass, fragmentMapping = null, style = null, collectionOptions) => {
  variantRegistry.set(name, {
    class: variantClass,
    fragmentMapping,
    style,
    collectionOptions
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
registerVariant("plans", Plans, PLANS_AEM_FRAGMENT_MAPPING, Plans.variantStyle, Plans.collectionOptions);
registerVariant("plans-students", Plans, PLANS_STUDENTS_AEM_FRAGMENT_MAPPING, Plans.variantStyle, Plans.collectionOptions);
registerVariant("plans-education", Plans, PLANS_EDUCATION_AEM_FRAGMENT_MAPPING, Plans.variantStyle, Plans.collectionOptions);
registerVariant("product", Product, null, Product.variantStyle);
registerVariant("segment", Segment, null, Segment.variantStyle);
registerVariant(
  "special-offers",
  SpecialOffer,
  SPECIAL_OFFERS_AEM_FRAGMENT_MAPPING,
  SpecialOffer.variantStyle
);
function getFragmentMapping(variant) {
  return variantRegistry.get(variant)?.fragmentMapping;
}
function getCollectionOptions(variant) {
  return variantRegistry.get(variant)?.collectionOptions;
}

// src/merch-card-collection-header.js
var RESULT_TEXT_SLOT_NAMES = {
  // no search
  filters: ["noResultText", "resultText", "resultsText"],
  filtersMobile: ["noResultText", "resultMobileText", "resultsMobileText"],
  // search on desktop
  search: ["noSearchResultsText", "searchResultText", "searchResultsText"],
  // search on mobile
  searchMobile: [
    "noSearchResultsMobileText",
    "searchResultMobileText",
    "searchResultsMobileText"
  ]
};
var updatePlaceholders = (el, key, value) => {
  const placeholders = el.querySelectorAll(`[data-placeholder="${key}"]`);
  placeholders.forEach((placeholder) => {
    placeholder.innerText = value;
  });
};
var defaultVisibility = {
  search: ["mobile", "tablet"],
  filter: ["mobile", "tablet"],
  sort: true,
  result: ["mobile", "tablet"],
  custom: false
};
var MerchCardCollectionHeader = class extends LitElement {
  constructor() {
    super();
    __publicField(this, "tablet", new MatchMediaController(this, TABLET_UP));
    __publicField(this, "desktop", new MatchMediaController(this, DESKTOP_UP));
    this.collection ?? (this.collection = null);
    this.updateLiterals = this.updateLiterals.bind(this);
  }
  connectedCallback() {
    super.connectedCallback();
    this.collection.addEventListener(EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED, this.updateLiterals);
  }
  get isMobile() {
    return !this.isTablet && !this.isDesktop;
  }
  get isTablet() {
    return this.tablet.matches;
  }
  get isDesktop() {
    return this.desktop.matches;
  }
  get currentMedia() {
    if (this.isDesktop) return "desktop";
    if (this.isTablet) return "tablet";
    return "mobile";
  }
  parseVisibilityOptions(visibility, type) {
    if (!visibility) return null;
    if (!Object.hasOwn(visibility, type)) return null;
    const typeVisibility = visibility[type];
    if (typeVisibility === false) return false;
    if (typeVisibility === true) return true;
    return typeVisibility.includes(this.currentMedia);
  }
  getVisibility(type) {
    const visibility = getCollectionOptions(this.collection.variant)?.headerVisibility;
    const typeVisibility = this.parseVisibilityOptions(visibility, type);
    if (typeVisibility !== null) return typeVisibility;
    return this.parseVisibilityOptions(defaultVisibility, type);
  }
  get searchAction() {
    if (!this.getVisibility("search")) return nothing3;
    const searchPlaceholder = getSlotText(this.collection, "searchText");
    if (!searchPlaceholder) return nothing3;
    return html10`
            <merch-search deeplink="search" id="search">
                <sp-search
                    id="search-bar"
                    placeholder="${searchPlaceholder}"
                ></sp-search>
            </merch-search>
        `;
  }
  get filterAction() {
    if (!this.getVisibility("filter")) return nothing3;
    if (!this.collection.sidenav) return nothing3;
    return html10`
            <sp-action-button
              id="filter"
              variant="secondary"
              treatment="outline"
              @click="${this.openFilters}"
              ><slot name="filtersText"></slot
            ></sp-action-button>
        `;
  }
  get sortAction() {
    if (!this.getVisibility("sort")) return nothing3;
    const sortText = getSlotText(this, "sortText");
    if (!sortText) return;
    const popularityText = getSlotText(this, "popularityText");
    const alphabeticallyText = getSlotText(this, "alphabeticallyText");
    if (!(popularityText && alphabeticallyText)) return;
    const alphabetical = this.sort === SORT_ORDER.alphabetical;
    return html10`
            <sp-action-menu
                id="sort"
                size="m"
                @change="${this.collection.sortChanged}"
                selects="single"
                value="${alphabetical ? SORT_ORDER.alphabetical : SORT_ORDER.authored}"
            >
                <span slot="label-only"
                    >${sortText}:
                    ${alphabetical ? alphabeticallyText : popularityText}</span
                >
                <sp-menu-item value="${SORT_ORDER.authored}"
                    >${popularityText}</sp-menu-item
                >
                <sp-menu-item value="${SORT_ORDER.alphabetical}"
                    >${alphabeticallyText}</sp-menu-item
                >
            </sp-action-menu>
        `;
  }
  get resultSlotName() {
    const slotType = `${this.collection.search ? "search" : "filters"}${this.isMobile || this.isTablet ? "Mobile" : ""}`;
    return RESULT_TEXT_SLOT_NAMES[slotType][Math.min(this.collection.resultCount, 2)];
  }
  get resultLabel() {
    if (!this.getVisibility("result")) return nothing3;
    return html10`
          <div id="result" aria-live="polite">
              <slot name="${this.resultSlotName}"></slot>
          </div>`;
  }
  get customArea() {
    if (!this.getVisibility("custom")) return nothing3;
    const customHeaderArea = getCollectionOptions(this.collection.variant)?.customHeaderArea;
    if (!customHeaderArea) return nothing3;
    return html10`<div id="custom">${customHeaderArea()}</div>`;
  }
  // #region Handlers
  openFilters(event) {
    this.collection.sidenav.showModal(event);
  }
  updateLiterals(event) {
    Object.keys(event.detail).forEach((key) => {
      updatePlaceholders(this, key, event.detail[key]);
    });
  }
  // #endregion
  render() {
    return html10`
          <sp-theme color="light" scale="medium">
            <div id="header">
              ${this.searchAction}
              ${this.filterAction}
              ${this.sortAction}
              ${this.resultLabel}
              ${this.customArea}
            </div>
          </sp-theme>
        `;
  }
};
__publicField(MerchCardCollectionHeader, "styles", css7`
        :host {
            --merch-card-collection-header-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-columns: auto max-content;
            --merch-card-collection-header-areas: "search search" 
                                                  "filter sort"
                                                  "result result";
        }

        sp-theme {
            font-size: inherit;
        }

        #header {
            display: grid;
            gap: var(--merch-card-collection-header-gap);
            align-items: center;
            grid-template-columns: var(--merch-card-collection-header-columns);
            grid-template-areas: var(--merch-card-collection-header-areas);
        }
        
        #search {
            grid-area: search;
            margin: 12px;
        }

        #filter {
            grid-area: filter;
            width: 92px;
        }

        #sort {
            grid-area: sort;
        }

        #result {
            grid-area: result;
        }

        #custom {
            grid-area: custom;
        }

        /* tablets */
        @media screen and ${unsafeCSS2(TABLET_UP)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                --merch-card-collection-header-areas: "search filter sort" 
                                                      "result result result";
            }
        }

        /* Laptop */
        @media screen and ${unsafeCSS2(DESKTOP_UP)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%);
                --merch-card-collection-header-areas: ". sort";
            }
        }
    `);
__publicField(MerchCardCollectionHeader, "placeholderKeys", [
  "searchText",
  "filtersText",
  "sortText",
  "popularityText",
  "alphabeticallyText",
  "noResultsText",
  "resultText",
  "resultsText",
  "resultMobileText",
  "resultsMobileText",
  "noSearchResultsText",
  "searchResultText",
  "searchResultsText",
  "searchResultMobileText",
  "searchResultsMobileText"
]);
customElements.define("merch-card-collection-header", MerchCardCollectionHeader);
export {
  MerchCardCollectionHeader as default
};
//# sourceMappingURL=merch-card-collection-header.js.map

// branch: MWPW-142267 commit: db56fa6d1f49aa580f3da94842ffb9e73516ee18 Mon, 08 Jul 2024 21:06:50 GMT

// src/merch-twp-d2p.js
import { LitElement, html } from "/libs/deps/lit-all.min.js";

// ../node_modules/@spectrum-web-components/reactive-controllers/src/MatchMedia.js
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

// src/merch-twp-d2p.css.js
import { css } from "/libs/deps/lit-all.min.js";
var styles = css`
    :host {
        display: flex;
        box-sizing: border-box;
        width: 100%;
        max-width: 972px;
        background-color: #f8f8f8;
    }

    sp-theme {
        display: contents;
    }

    ::slotted(p) {
        margin: 0;
    }

    .cards {
        display: flex;
        gap: var(--consonant-merch-spacing-xs);
    }

    #backButton {
        position: absolute;
        border-width: 0;
    }

    ::slotted([slot='detail-xl']) {
        font-size: 18px;
        font-weight: bold;
        color: #2c2c2c;
        margin: 0;
    }

    ::slotted([slot='merch-whats-included']) {
        align-self: auto;
        width: 100%;
        position: absolute;
        background: #fff;
        height: 100%;
        padding: 30px;
        border-radius: 10px;
        box-sizing: border-box;
    }

    ::slotted([slot$='-footer']) {
        flex-basis: 100%;
    }

    ::slotted([slot='merch-whats-included'].hidden) {
        display: none;
    }

    /* Mobile */

    .mobile {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex: 1;
        align-items: center;
        max-height: 100vh;
        padding: 30px 30px 0 30px;
        width: 100vw;
        gap: 16px;
    }

    .mobile #backButton {
        top: 12px;
        left: 12px;
    }

    .mobile ::slotted([slot='detail-xl']) {
        max-width: 455px;
        width: 100%;
    }

    .mobile[data-step='2'] {
        padding-top: 54px;
        background-color: #f5f5f5; /* make a variable */
    }

    [data-step='2'] sp-tabs {
        display: none;
    }

    #card-icons-title {
        display: flex;
        align-items: center;
        gap: 8px;
        align-self: center;
        max-width: 400px;
        width: 100%;
    }

    #card-icons-title h3 {
        margin: 0;
        font-size: 18px;
    }

    .mobile sp-tabs {
        width: 100%;
        max-width: 455px;
    }

    .mobile sp-tab-panel {
        height: calc(100vh - 268px);
        flex: 1;
    }

    .mobile .cards {
        padding-top: 2px;
        align-items: center;
        flex: 1;
        flex-direction: column;
        overflow-y: auto;
        padding-bottom: 50px;
    }

    .mobile #continueButton {
        align-items: center;
        width: 100%;
        height: 120px;
        display: flex;
        gap: 16px;
        flex-direction: column;
        place-content: center;
        position: fixed;
        bottom: 0;
        box-shadow: 0px -8px 10px -5px rgba(112, 112, 112, 0.1);
        background-color: #fff;
        padding: 0 30px;
    }

    #continueButton sp-button {
        width: 80%;
        min-width: 110px;
        max-width: 300px;
    }

    .mobile ::slotted(merch-card) {
        width: 300px;
    }

    .mobile #content {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 30px 30px 0 30px;
    }

    .desktop {
        display: flex;
        width: 972px;
        min-height: 680px;
        position: relative;
        flex: 1;
    }

    .desktop .cards {
        flex-wrap: wrap;
    }

    .desktop #content {
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: 30px 30px 0 30px;
    }

    .desktop #content slot[name='single-card'] {
        display: block;
        margin-top: 24px;
        margin-bottom: 24px;
    }

    ::slotted(merch-card[slot='single-card']) {
        box-shadow: none;
    }

    .desktop ::slotted([slot='detail-xl']) {
        font-size: 20px;
    }

    .desktop aside {
        background-color: #f5f5f5;
        border-radius: 8px; /* not sure if necessary */
        display: flex;
        flex-direction: column;
        width: 360px;
        box-sizing: border-box;
        padding: 0 30px 0 30px;
    }

    .desktop sp-tabs {
        margin: 12px 0 30px 0;
    }

    sp-tab-panel {
        padding-top: 20px;
    }

    .desktop ::slotted(merch-card) {
        width: 268px;
    }

    .desktop ::slotted(merch-subscription-panel) {
        margin-top: 40px;
    }

    .desktop #continueButton {
        position: absolute;
        bottom: 30px;
        right: 30px;
    }

    .desktop #backButton {
        left: 30px;
        bottom: 30px;
    }
`;

// src/media.js
var TABLET_DOWN = "(max-width: 1199px)";

// src/constants.js
var EVENT_MERCH_CARD_READY = "merch-card:ready";
var EVENT_OFFER_SELECTED = "merch-offer:selected";
var EVENT_MERCH_STORAGE_CHANGE = "merch-storage:change";
var EVENT_MERCH_QUANTITY_SELECTOR_CHANGE = "merch-quantity-selector:change";

// ../commons/src/deeplink.js
function parseState(hash = window.location.hash) {
  const result = [];
  const keyValuePairs = hash.replace(/^#/, "").split("&");
  for (const pair of keyValuePairs) {
    const [key, value = ""] = pair.split("=");
    if (key) {
      result.push([key, decodeURIComponent(value.replace(/\+/g, " "))]);
    }
  }
  return Object.fromEntries(result);
}

// ../commons/src/aem.js
var accessToken = localStorage.getItem("masAccessToken");
var headers = {
  Authorization: `Bearer ${accessToken}`,
  pragma: "no-cache",
  "cache-control": "no-cache"
};

// src/merch-twp-d2p.js
var TAG_NAME = "merch-twp-d2p";
var TAB_INDIVIDUALS = "individuals";
var TAB_BUSINESS = "business";
var TAB_EDUCATION = "education";
var MerchTwpD2P = class extends LitElement {
  static styles = [styles];
  static properties = {
    individualsText: { type: String, attribute: "individuals-text" },
    businessText: { type: String, attribute: "business-text" },
    educationText: { type: String, attribute: "education-text" },
    continueText: { type: String, attribute: "continue-text" },
    ready: { type: Boolean },
    step: { type: Number },
    singleCard: { state: true },
    selectedTab: { type: String, attribute: "selected-tab", reflect: true }
  };
  selectedTab = this.preselectedTab();
  #log;
  #cardIcons;
  #handleOfferSelected;
  #mobileAndTablet = new MatchMediaController(this, TABLET_DOWN);
  individualsText = "Individuals";
  businessText = "Business";
  educationText = "Students and teachers";
  continueText = "Continue";
  ready = false;
  constructor() {
    super();
    this.step = 1;
    this.#handleOfferSelected = this.handleOfferSelected.bind(this);
    this.handleWhatsIncludedClick = this.handleWhatsIncludedClick.bind(this);
  }
  /** @type {Commerce.Log.Instance} */
  get log() {
    if (!this.#log) {
      this.#log = document.head.querySelector("wcms-commerce")?.Log.module("twp");
    }
    return this.#log;
  }
  get individualsTab() {
    if (this.cciCards.length === 0)
      return html``;
    return html`
            <sp-tab value="${TAB_INDIVIDUALS}" label=${this.individualsText}>
                <sp-icon-user slot="icon"></sp-icon-user>
            </sp-tab>
            <sp-tab-panel value="${TAB_INDIVIDUALS}">
                <div class="cards">
                    <slot name="individuals"></slot>
                    <slot name="cci-footer"></slot>
                </div>
            </sp-tab-panel>
        `;
  }
  get businessTab() {
    if (this.cctCards.length === 0)
      return html``;
    return html`
            <sp-tab value="${TAB_BUSINESS}" label=${this.businessText}>
                <sp-icon-user-group slot="icon"></sp-icon-user-group>
            </sp-tab>
            <sp-tab-panel value="${TAB_BUSINESS}">
                <div class="cards">
                    <slot name="business"></slot>
                    <slot name="cct-footer"></slot>
                </div>
            </sp-tab-panel>
        `;
  }
  get educationTab() {
    if (this.cceCards.length === 0)
      return html``;
    return html`
            <sp-tab value="${TAB_EDUCATION}" label=${this.educationText}>
                <sp-icon-book slot="icon"></sp-icon-book>
            </sp-tab>
            <sp-tab-panel value="${TAB_EDUCATION}">
            <div class="cards">
                <slot name="education"></slot>
                <slot name="cce-footer"></slot>
            </sp-tab-panel>
        `;
  }
  preselectedTab() {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan === TAB_INDIVIDUALS || plan === TAB_BUSINESS || plan === TAB_EDUCATION) {
      return plan;
    } else {
      return TAB_INDIVIDUALS;
    }
  }
  get selectedTabPanel() {
    return this.shadowRoot.querySelector("sp-tab-panel[selected]");
  }
  get firstCardInSelectedTab() {
    return this.selectedTabPanel?.querySelector("slot").assignedElements()[0];
  }
  get tabs() {
    if (this.cards.length === 1)
      return html``;
    if (this.singleCard && this.step === 1)
      return html``;
    return html`
            <sp-tabs
                emphasized
                selected="${this.selectedTab}"
                @change=${this.tabChanged}
            >
                ${this.individualsTab} ${this.businessTab} ${this.educationTab}
            </sp-tabs>
        `;
  }
  async tabChanged(event) {
    this.selectedTab = event.target.selected;
    await event.target.updateComplete;
    this.selectCard(this.firstCardInSelectedTab);
  }
  /** the footer is displayed only in the step 1 */
  get singleCardFooter() {
    if (this.step !== 1)
      return;
    return html`
            <slot name="cci-footer"></slot>
            <slot name="cct-footer"></slot>
            <slot name="cce-footer"></slot>
        `;
  }
  get desktopLayout() {
    if (this.singleCard) {
      return html`<div class="desktop" data-step="${this.step}">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="single-card"></slot>
                    ${this.singleCardFooter} ${this.backButton}
                </div>
                <aside>
                    <slot name="panel"></slot>
                </aside>
            </div>`;
    }
    return html`
            <div class="desktop" data-step="${this.step}">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="footer-link"></slot>
                </div>
                ${this.cciCards.length < 3 ? html`<aside>
                          <slot name="panel"></slot>
                      </aside>` : ""}
                ${this.continueButton}
            </div>
        `;
  }
  get showSubscriptionPanelInStep1() {
    if (this.#mobileAndTablet.matches)
      return false;
    return this.cciCards.length < 3;
  }
  get continueButton() {
    if (this.showSubscriptionPanelInStep1)
      return html``;
    return html`
            <div id="continueButton">
                <sp-button
                    variant="cta"
                    size="large"
                    @click=${this.handleContinue}
                >
                    ${this.continueText}
                </sp-button>
            </div>
        `;
  }
  selectSingleCard(card) {
    card.setAttribute("data-slot", card.getAttribute("slot"));
    card.setAttribute("slot", "single-card");
    this.singleCard = card;
  }
  unSelectSingleCard() {
    if (!this.singleCard)
      return;
    this.singleCard.setAttribute(
      "slot",
      this.singleCard.getAttribute("data-slot")
    );
    this.singleCard.removeAttribute("data-slot");
    this.step = 1;
    this.singleCard = void 0;
  }
  handleContinue() {
    this.step = 2;
    this.selectSingleCard(this.cardToSelect);
    this.#cardIcons = [
      ...this.singleCard.querySelectorAll("merch-icon")
    ].map((el) => el.cloneNode(true));
  }
  handleBack() {
    this.unSelectSingleCard();
  }
  get cardToSelect() {
    return this.selectedTabPanel?.card ?? this.querySelector("merch-card[aria-selected]");
  }
  // this.selectedTabPanel.card doesn't always exist, e.g. tab was switched but card wasn't selected yet
  // this.singleCard ?? this.querySelector('merch-card[aria-selected]')
  get selectedCard() {
    return this.singleCard ?? this.selectedTabPanel.card;
  }
  get mobileStepTwo() {
    if (!this.singleCard)
      return html``;
    return html`
            ${this.backButton} ${this.stepTwoCardIconsAndTitle}
            <slot name="panel"></slot>
        `;
  }
  get stepTwoCardIconsAndTitle() {
    if (!this.selectedCard)
      return;
    return html`<div id="card-icons-title">
            ${this.#cardIcons}
            <h3>${this.selectedCard.title}</h3>
        </div>`;
  }
  get backButton() {
    if (this.step !== 2)
      return html``;
    return html`<sp-button
            id="backButton"
            treatment="outline"
            variant="secondary"
            size="s"
            @click=${this.handleBack}
        >
            <sp-icon-chevron-double-left
                slot="icon"
            ></<sp-icon-chevron-double-left></sp-icon-chevron-double-left
            > Back</sp-button>`;
  }
  get mobileLayout() {
    if (this.step === 1) {
      return html`
                <div class="mobile" data-step="${this.step}">
                    <slot name="detail-xl"></slot>
                    <slot name="single-card"></slot>
                    ${this.tabs} ${this.continueButton}
                </div>
            `;
    }
    return html`
            <div class="mobile" data-step="${this.step}">
                <slot name="detail-xl"></slot>
                ${this.tabs}${this.mobileStepTwo}
            </div>
        `;
  }
  render() {
    if (!this.ready)
      return html``;
    return html`
            <sp-theme theme="spectrum" color="light" scale="large">
                ${this.#mobileAndTablet.matches ? this.mobileLayout : this.desktopLayout}
                <slot name="merch-whats-included"></slot>
            </div>
        `;
  }
  connectedCallback() {
    super.connectedCallback();
    this.style.setProperty("--mod-tabs-font-weight", 700);
    this.addEventListener(EVENT_MERCH_CARD_READY, this.merchTwpReady);
    this.subscriptionPanel.addEventListener(
      EVENT_OFFER_SELECTED,
      this.#handleOfferSelected
    );
    this.addEventListener(
      EVENT_MERCH_QUANTITY_SELECTOR_CHANGE,
      this.handleQuantityChange
    );
    this.whatsIncludedLink?.addEventListener(
      "click",
      this.handleWhatsIncludedClick
    );
    this.addEventListener(
      EVENT_MERCH_STORAGE_CHANGE,
      this.handleStorageChange
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener(EVENT_MERCH_CARD_READY, this.merchTwpReady);
    this.subscriptionPanel.removeEventListener(
      EVENT_OFFER_SELECTED,
      this.#handleOfferSelected
    );
    this.whatsIncludedLink?.removeEventListener("click", this.handleWhatsIncludedClick);
    this.removeEventListener(
      EVENT_MERCH_STORAGE_CHANGE,
      this.handleStorageChange
    );
  }
  handleOfferSelected(event) {
    this.log.debug("Selecting plan type", event.target.planType);
    this.selectedCard.selectMerchOffer(event.target.selectedOffer);
  }
  handleQuantityChange(event) {
    if (!this.selectedTabPanel)
      return;
    this.selectedCard.quantitySelect.defaultValue = event.detail.option;
    this.requestUpdate();
  }
  get whatsIncludedLink() {
    return this.querySelector("merch-card .merch-whats-included");
  }
  get whatsIncluded() {
    return this.querySelector('[slot="merch-whats-included"]');
  }
  setOfferSelectOnPanel(offerSelect) {
    offerSelect.setAttribute("variant", "subscription-options");
    this.subscriptionPanel.offerSelect?.remove();
    this.subscriptionPanel.appendChild(offerSelect);
  }
  handleStorageChange(event) {
    const offerSelect = event.detail.offerSelect;
    if (!offerSelect)
      return;
    this.setOfferSelectOnPanel(offerSelect);
  }
  get preselectedCardId() {
    const preselectedCardIds = parseState()["select-cards"]?.split(",").reduce((res, item) => {
      const formattedItem = decodeURIComponent(
        item.trim().toLowerCase()
      );
      formattedItem && res.push(formattedItem);
      return res;
    }, []) || [];
    if (preselectedCardIds.length && this.selectedTab === TAB_INDIVIDUALS) {
      return preselectedCardIds[0];
    } else if (preselectedCardIds.length > 1 && this.selectedTab === TAB_BUSINESS) {
      return preselectedCardIds[1];
    } else if (preselectedCardIds.length > 2 && this.selectedTab === TAB_EDUCATION) {
      return preselectedCardIds[2];
    }
  }
  get cardToBePreselected() {
    return this.selectedTabPanel?.querySelector("slot").assignedElements().find((cardEl) => {
      const cardTitle = cardEl.querySelector(".heading-xs")?.textContent.trim().toLowerCase() || "";
      return this.preselectedCardId && cardTitle.includes(this.preselectedCardId);
    });
  }
  selectCard(card, force = false) {
    const tabPanel = this.selectedTabPanel;
    let selectedCard = tabPanel?.card;
    if (force || !selectedCard) {
      if (selectedCard) {
        selectedCard.selected = void 0;
      }
      selectedCard = this.cardToBePreselected || card;
      selectedCard.selected = true;
      if (tabPanel) {
        tabPanel.card = selectedCard;
      } else {
        this.selectSingleCard(selectedCard);
      }
    }
    selectedCard.focus();
    this.subscriptionPanel.quantitySelect?.remove();
    const quantitySelect = selectedCard.quantitySelect?.cloneNode(true);
    if (quantitySelect) {
      this.subscriptionPanel.appendChild(quantitySelect);
    }
    const offerSelect = selectedCard.offerSelect.cloneNode(true);
    this.setOfferSelectOnPanel(offerSelect);
  }
  handleWhatsIncludedClick(event) {
    event.preventDefault();
    this.whatsIncluded?.classList.toggle("hidden");
  }
  async processCards() {
    const allCards = [...this.querySelectorAll("merch-card")];
    allCards.forEach((card, i) => {
      const { customerSegment, marketSegment } = card.offerSelect;
      if (customerSegment === "INDIVIDUAL") {
        if (marketSegment === "COM") {
          card.setAttribute("slot", "individuals");
        } else if (marketSegment === "EDU") {
          card.setAttribute("slot", "education");
        }
      } else if (customerSegment === "TEAM") {
        card.setAttribute("slot", "business");
      }
      card.addEventListener("click", () => this.selectCard(card, true));
    });
    this.ready = true;
    this.requestUpdate();
    await this.updateComplete;
    await this.tabElement?.updateComplete;
    this.selectCard(
      allCards.length === 1 ? allCards[0] : this.firstCardInSelectedTab,
      true
    );
  }
  merchTwpReady() {
    if (
      // wait for all merch-offer-selects to be ready
      this.querySelector("merch-card merch-offer-select:not([plan-type])")
    )
      return;
    this.processCards();
  }
  /** All the getters for DOM elements */
  get cards() {
    return this.querySelectorAll("merch-card[slot]");
  }
  get cciCards() {
    return this.querySelectorAll('merch-card[slot="individuals"]');
  }
  get cctCards() {
    return this.querySelectorAll('merch-card[slot="business"]');
  }
  get cceCards() {
    return this.querySelectorAll('merch-card[slot="education"]');
  }
  get subscriptionPanel() {
    return this.querySelector("merch-subscription-panel");
  }
  get tabElement() {
    return this.shadowRoot.querySelector("sp-tabs");
  }
};
window.customElements.define(TAG_NAME, MerchTwpD2P);
export {
  MerchTwpD2P
};

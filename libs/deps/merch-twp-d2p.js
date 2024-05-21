// branch: develop commit: 369516f3cda51fb1219ad0b3cf2c94c8f094c49b Tue, 21 May 2024 08:39:16 GMT
import{LitElement as C,html as e}from"/libs/deps/lit-all.min.js";var o=class{constructor(t,s){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(s),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as E}from"/libs/deps/lit-all.min.js";var p=E`
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

    ::slotted([slot$='-footer']) {
        flex-basis: 100%;
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
`;var u="(max-width: 1199px)";var r="merch-card:ready",l="merch-offer:selected";var d="merch-storage:change",m="merch-quantity-selector:change";var T="merch-twp-d2p",c="individuals",b="business",x="education",h=class extends C{static styles=[p];static properties={individualsText:{type:String,attribute:"individuals-text"},businessText:{type:String,attribute:"business-text"},educationText:{type:String,attribute:"education-text"},continueText:{type:String,attribute:"continue-text"},ready:{type:Boolean},step:{type:Number},singleCard:{state:!0},selectedTab:{type:String,attribute:"selected-tab",reflect:!0}};selectedTab=c;#t;#s;#e;#i=new o(this,u);individualsText="Individuals";businessText="Business";educationText="Students and teachers";continueText="Continue";ready=!1;constructor(){super(),this.step=1,this.#e=this.handleOfferSelected.bind(this)}get log(){return this.#t||(this.#t=document.head.querySelector("wcms-commerce")?.Log.module("twp")),this.#t}get individualsTab(){return this.cciCards.length===0?e``:e`
            <sp-tab value="${c}" label=${this.individualsText}>
                <sp-icon-user slot="icon"></sp-icon-user>
            </sp-tab>
            <sp-tab-panel value="${c}">
                <div class="cards">
                    <slot name="individuals"></slot>
                    <slot name="cci-footer"></slot>
                </div>
            </sp-tab-panel>
        `}get businessTab(){return this.cctCards.length===0?e``:e`
            <sp-tab value="${b}" label=${this.businessText}>
                <sp-icon-user-group slot="icon"></sp-icon-user-group>
            </sp-tab>
            <sp-tab-panel value="${b}">
                <div class="cards">
                    <slot name="business"></slot>
                    <slot name="cct-footer"></slot>
                </div>
            </sp-tab-panel>
        `}get educationTab(){return this.cceCards.length===0?e``:e`
            <sp-tab value="${x}" label=${this.educationText}>
                <sp-icon-book slot="icon"></sp-icon-book>
            </sp-tab>
            <sp-tab-panel value="${x}">
            <div class="cards">
                <slot name="education"></slot>
                <slot name="cce-footer"></slot>
            </sp-tab-panel>
        `}get selectedTabPanel(){return this.shadowRoot.querySelector("sp-tab-panel[selected]")}get firstCardInSelectedTab(){return this.selectedTabPanel?.querySelector("slot").assignedElements()[0]}get tabs(){return this.cards.length===1?e``:this.singleCard&&this.step===1?e``:e`
            <sp-tabs
                emphasized
                selected="${this.selectedTab}"
                @change=${this.tabChanged}
            >
                ${this.individualsTab} ${this.businessTab} ${this.educationTab}
            </sp-tabs>
        `}async tabChanged(t){this.selectedTab=t.target.selected,await t.target.updateComplete,this.selectCard(this.firstCardInSelectedTab)}get singleCardFooter(){if(this.step===1)return e`
            <slot name="cci-footer"></slot>
            <slot name="cct-footer"></slot>
            <slot name="cce-footer"></slot>
        `}get desktopLayout(){return this.singleCard?e`<div class="desktop" data-step="${this.step}">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="single-card"></slot>
                    ${this.singleCardFooter} ${this.backButton}
                </div>
                <aside>
                    <slot name="panel"></slot>
                </aside>
            </div>`:e`
            <div class="desktop" data-step="${this.step}">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="footer-link"></slot>
                </div>
                ${this.cciCards.length<3?e`<aside>
                          <slot name="panel"></slot>
                      </aside>`:""}
                ${this.continueButton}
            </div>
        `}get showSubscriptionPanelInStep1(){return this.#i.matches?!1:this.cciCards.length<3}get continueButton(){return this.showSubscriptionPanelInStep1?e``:e`
            <div id="continueButton">
                <sp-button
                    variant="cta"
                    size="large"
                    @click=${this.handleContinue}
                >
                    ${this.continueText}
                </sp-button>
            </div>
        `}selectSingleCard(t){t.setAttribute("data-slot",t.getAttribute("slot")),t.setAttribute("slot","single-card"),this.singleCard=t}unSelectSingleCard(){this.singleCard&&(this.singleCard.setAttribute("slot",this.singleCard.getAttribute("data-slot")),this.singleCard.removeAttribute("data-slot"),this.step=1,this.singleCard=void 0)}handleContinue(){this.step=2,this.selectSingleCard(this.cardToSelect),this.#s=[...this.singleCard.querySelectorAll("merch-icon")].map(t=>t.cloneNode(!0))}handleBack(){this.unSelectSingleCard()}get cardToSelect(){return this.selectedTabPanel?.card??this.querySelector("merch-card[aria-selected]")}get selectedCard(){return this.singleCard??this.selectedTabPanel.card}get mobileStepTwo(){return this.singleCard?e`
            ${this.backButton} ${this.stepTwoCardIconsAndTitle}
            <slot name="panel"></slot>
        `:e``}get stepTwoCardIconsAndTitle(){if(this.selectedCard)return e`<div id="card-icons-title">
            ${this.#s}
            <h3>${this.selectedCard.title}</h3>
        </div>`}get backButton(){return this.step!==2?e``:e`<sp-button
            id="backButton"
            treatment="outline"
            variant="secondary"
            size="s"
            @click=${this.handleBack}
        >
            <sp-icon-chevron-double-left
                slot="icon"
            ></<sp-icon-chevron-double-left></sp-icon-chevron-double-left
            > Back</sp-button>`}get mobileLayout(){return this.step===1?e`
                <div class="mobile" data-step="${this.step}">
                    <slot name="detail-xl"></slot>
                    <slot name="single-card"></slot>
                    ${this.tabs} ${this.continueButton}
                </div>
            `:e`
            <div class="mobile" data-step="${this.step}">
                <slot name="detail-xl"></slot>
                ${this.tabs}${this.mobileStepTwo}
            </div>
        `}render(){return this.ready?e`
            <sp-theme theme="spectrum" color="light" scale="large">
                ${this.#i.matches?this.mobileLayout:this.desktopLayout}
            </div>
        `:e``}connectedCallback(){super.connectedCallback(),this.style.setProperty("--mod-tabs-font-weight",700),this.addEventListener(r,this.merchTwpReady),this.subscriptionPanel.addEventListener(l,this.#e),this.addEventListener(m,this.handleQuantityChange),this.addEventListener(d,this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(r,this.merchTwpReady),this.subscriptionPanel.removeEventListener(l,this.#e),this.removeEventListener(d,this.handleStorageChange)}handleOfferSelected(t){this.log.debug("Selecting plan type",t.target.planType),this.selectedCard.selectMerchOffer(t.target.selectedOffer)}handleQuantityChange(t){this.selectedTabPanel&&(this.selectedCard.quantitySelect.defaultValue=t.detail.option,this.requestUpdate())}setOfferSelectOnPanel(t){t.setAttribute("variant","subscription-options"),this.subscriptionPanel.offerSelect?.remove(),this.subscriptionPanel.appendChild(t)}handleStorageChange(t){let s=t.detail.offerSelect;s&&this.setOfferSelectOnPanel(s)}selectCard(t,s=!1){let a=this.selectedTabPanel,i=a?.card;(s||!i)&&(i&&(i.selected=void 0),i=t,i.selected=!0,a?a.card=i:this.selectSingleCard(i)),i.focus(),this.subscriptionPanel.quantitySelect?.remove();let n=i.quantitySelect?.cloneNode(!0);n&&this.subscriptionPanel.appendChild(n);let f=i.offerSelect.cloneNode(!0);this.setOfferSelectOnPanel(f)}async processCards(){let t=[...this.querySelectorAll("merch-card")];t.forEach((s,a)=>{let{customerSegment:i,marketSegment:n}=s.offerSelect;i==="INDIVIDUAL"?n==="COM"?s.setAttribute("slot","individuals"):n==="EDU"&&s.setAttribute("slot","education"):i==="TEAM"&&s.setAttribute("slot","business"),s.addEventListener("click",()=>this.selectCard(s,!0))}),this.ready=!0,this.requestUpdate(),await this.updateComplete,await this.tabElement?.updateComplete,this.selectCard(t.length===1?t[0]:this.firstCardInSelectedTab,!0)}merchTwpReady(){this.querySelector("merch-card merch-offer-select:not([plan-type])")||this.processCards()}get cards(){return this.querySelectorAll("merch-card[slot]")}get cciCards(){return this.querySelectorAll('merch-card[slot="individuals"]')}get cctCards(){return this.querySelectorAll('merch-card[slot="business"]')}get cceCards(){return this.querySelectorAll('merch-card[slot="education"]')}get subscriptionPanel(){return this.querySelector("merch-subscription-panel")}get tabElement(){return this.shadowRoot.querySelector("sp-tabs")}};window.customElements.define(T,h);export{h as MerchTwpD2P};
//# sourceMappingURL=merch-twp-d2p.js.map

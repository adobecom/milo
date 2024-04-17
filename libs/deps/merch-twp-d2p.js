// branch: MWPW-138927-3 commit: e3cb8df31da39b8ec85b352935b88214b09851af Wed, 17 Apr 2024 20:34:18 GMT
import{LitElement as m,html as t}from"/libs/deps/lit-all.min.js";var n=class{constructor(e,a){this.key=Symbol("match-media-key"),this.matches=!1,this.host=e,this.host.addController(this),this.media=window.matchMedia(a),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),e.addController(this)}hostConnected(){var e;(e=this.media)==null||e.addEventListener("change",this.onChange)}hostDisconnected(){var e;(e=this.media)==null||e.removeEventListener("change",this.onChange)}onChange(e){this.matches!==e.matches&&(this.matches=e.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as u}from"/libs/deps/lit-all.min.js";var c=u`
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
        top: 12px;
        left: 12px;
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

    .mobile ::slotted([slot='detail-xl']) {
        max-width: 455px;
        width: 100%;
    }

    .mobile[data-step='2'] {
        padding-top: 54px;
        background-color: #f5f5f5; /* make a variable */
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
        height: calc(100vh - 300px);
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

    .mobile #continue {
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

    #continue sp-button {
        width: 80%;
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

    .mobile[data-step='2'] sp-tabs {
        display: none;
    }

    .desktop {
        display: flex;
        width: 972px;
        min-height: 680px;
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

    .desktop ::slotted([slot='detail-xl']) {
        font-size: 20px;
    }

    .desktop aside {
        background-color: #f5f5f5;
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
`;var d="(max-width: 1200px)";var o="merch-card:ready",r="merch-offer:selected";var p="merch-quantity-selector:change";var b="merch-twp-d2p",l=class extends m{static styles=[c];static properties={individualsText:{type:String,attribute:"individuals-text"},businessText:{type:String,attribute:"business-text"},educationText:{type:String,attribute:"education-text"},continueText:{type:String,attribute:"continue-text"},step:{type:Number},ready:{type:Boolean}};#e=new n(this,d);#t;individualsText="Individuals";businessText="Business";educationText="Students and teachers";continueText="Continue";ready=!1;constructor(){super(),this.step=1}get individualsTab(){return this.cciCards.length===0?t``:t`
            <sp-tab value="individuals" label=${this.individualsText}>
                <sp-icon-user slot="icon"></sp-icon-user>
            </sp-tab>
            <sp-tab-panel value="individuals">
                <div class="cards">
                    <slot name="individuals"></slot>
                    <slot name="cci-footer"></slot>
                </div>
            </sp-tab-panel>
        `}get businessTab(){return this.cctCards.length===0?t``:t`
            <sp-tab value="business" label=${this.businessText}>
                <sp-icon-user-group slot="icon"></sp-icon-user-group>
            </sp-tab>
            <sp-tab-panel value="business">
                <div class="cards">
                    <slot name="business"></slot>
                    <slot name="cct-footer"></slot>
                </div>
            </sp-tab-panel>
        `}get educationTab(){return this.cceCards.length===0?t``:t`
            <sp-tab value="education" label=${this.educationText}>
                <sp-icon-book slot="icon"></sp-icon-book>
            </sp-tab>
            <sp-tab-panel value="education">
            <div class="cards">
                <slot name="education"></slot>
                <slot name="cce-footer"></slot>
            </sp-tab-panel>
        `}get selectedTabPanel(){return this.shadowRoot.querySelector("sp-tab-panel[selected]")}get firstCardInSelectedTab(){return this.selectedTabPanel?.querySelector("slot").assignedElements()[0]}get tabs(){return this.cards.length<2?t``:t`
            <sp-tabs
                emphasized
                selected="individuals"
                @change=${this.tabChanged}
            >
                ${this.individualsTab} ${this.businessTab} ${this.educationTab}
            </sp-tabs>
        `}async tabChanged(e){await e.target.updateComplete,this.selectCard(this.firstCardInSelectedTab)}get desktopLayout(){return t`
            <div class="desktop">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="footer-link"></slot>
                </div>

                ${this.cciCards.length<3?t`<aside>
                          <slot name="panel"></slot>
                      </aside>`:""}
            </div>
        `}get showSubscriptionPanelInStep1(){return this.cciCards.length<3&&!this.#e.matches}get continueButton(){return this.step!==1?t``:t`
            <div id="continue">
                <sp-button
                    variant="cta"
                    size="large"
                    @click=${this.handleContinue}
                >
                    ${this.continueText}
                </sp-button>
            </div>
        `}handleContinue(){if(this.step===1){this.#t=[...this.selectedTabPanel.card.querySelectorAll("merch-icon")].map(e=>e.cloneNode(!0)),this.step=2;return}}handleBack(){this.step=1}get mobileStepTwo(){return this.step!==2?t``:t`
            ${this.backButton} ${this.stepTwoCardIconsAndTitle}
            <slot name="panel"></slot>
        `}get stepTwoCardIconsAndTitle(){if(this.selectedTabPanel?.card)return t`<div id="card-icons-title">
            ${this.#t}
            <h3>${this.selectedTabPanel.card.title}</h3>
        </div>`}get backButton(){return this.step!==2?t``:t`<sp-button
            id="backButton"
            treatment="outline"
            variant="secondary"
            size="s"
            @click=${this.handleBack}
        >
            <sp-icon-chevron-double-left
                slot="icon"
            ></<sp-icon-chevron-double-left></sp-icon-chevron-double-left
            > Back</sp-button>`}get mobileLayout(){return t`
            <div class="mobile" data-step="${this.step}">
                <slot name="detail-xl"></slot>
                ${this.tabs} ${this.continueButton} ${this.mobileStepTwo}
            </div>
        `}render(){return this.ready?t`
            <sp-theme theme="spectrum" color="light" scale="large">
                ${this.#e.matches?this.mobileLayout:this.desktopLayout}
            </div>
        `:t``}connectedCallback(){super.connectedCallback(),this.addEventListener(o,this.merchTwpReady),this.addEventListener(r,this.handleOfferSelected),this.addEventListener(p,this.handleQuantityChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(o,this.merchTwpReady),this.subscriptionPanel.removeEventListener(r,this.handleOfferSelected)}handleOfferSelected(e){this.selectedTabPanel&&(this.selectedTabPanel.card.querySelector(`merch-offer[plan-type="${e.target.planType}"]`)?.select(),this.selectedTabPanel.card.offerSelect.planType=e.target.planType,this.requestUpdate())}handleQuantityChange(e){this.selectedTabPanel&&(this.selectedTabPanel.card.quantitySelect.defaultValue=e.detail.option,this.requestUpdate())}get cards(){return this.querySelectorAll("merch-card[slot]")}get cciCards(){return this.querySelectorAll('merch-card[slot="individuals"]')}get cctCards(){return this.querySelectorAll('merch-card[slot="business"]')}get cceCards(){return this.querySelectorAll('merch-card[slot="education"]')}get subscriptionPanel(){return this.querySelector("merch-subscription-panel")}get tabElement(){return this.shadowRoot.querySelector("sp-tabs")}selectCard(e,a=!1){(a||!this.selectedTabPanel.card)&&(this.selectedTabPanel.card&&(this.selectedTabPanel.card.selected=void 0),this.selectedTabPanel.card=e,e.selected=!0),this.selectedTabPanel.card.focus(),this.subscriptionPanel.quantitySelect?.remove();let i=e.quantitySelect?.cloneNode(!0);i&&this.subscriptionPanel.appendChild(i);let s=e.offerSelect.cloneNode(!0);s.setAttribute("variant","subscription-options"),s.selectOffer(s.querySelector("merch-offer[aria-selected]")),this.subscriptionPanel.offerSelect?.remove(),this.subscriptionPanel.appendChild(s),this.subscriptionPanel.requestUpdate()}async processCards(){[...this.querySelectorAll("merch-card")].forEach((e,a)=>{let{customerSegment:i,marketSegment:s}=e.offerSelect;i==="INDIVIDUAL"?s==="COM"?e.setAttribute("slot","individuals"):s==="EDU"&&e.setAttribute("slot","education"):i==="TEAM"&&e.setAttribute("slot","business"),e.addEventListener("click",()=>this.selectCard(e,!0))}),this.ready=!0,this.requestUpdate(),await this.updateComplete,await this.tabElement.updateComplete,this.selectCard(this.firstCardInSelectedTab,!0)}merchTwpReady(){this.querySelector("merch-card merch-offer-select:not([plan-type])")||this.processCards()}};window.customElements.define(b,l);export{l as MerchTwpD2P};
//# sourceMappingURL=merch-twp-d2p.js.map

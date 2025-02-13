var L=Object.defineProperty;var O=(o,t,e)=>t in o?L(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var r=(o,t,e)=>(O(o,typeof t!="symbol"?t+"":t,e),e),A=(o,t,e)=>{if(!t.has(o))throw TypeError("Cannot "+e)};var l=(o,t,e)=>(A(o,t,"read from private field"),e?e.call(o):t.get(o)),p=(o,t,e)=>{if(t.has(o))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(o):t.set(o,e)},b=(o,t,e,s)=>(A(o,t,"write to private field"),s?s.call(o,e):t.set(o,e),e);import{LitElement as k,html as i}from"../lit-all.min.js";var g=class{constructor(t,e){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(e),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};import{css as I}from"../lit-all.min.js";var w=I`
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
`;var R="(max-width: 1199px)";var T="merch-card:ready";var _="merch-offer:selected";var S="merch-storage:change",N="merch-quantity-selector:change";function v(o=window.location.hash){let t=[],e=o.replace(/^#/,"").split("&");for(let s of e){let[a,n=""]=s.split("=");a&&t.push([a,decodeURIComponent(n.replace(/\+/g," "))])}return Object.fromEntries(t)}var P="merch-twp-d2p",u="individuals",f="business",C="education",c,E,d,x,m=class extends k{constructor(){super();r(this,"selectedTab",this.preselectedTab());p(this,c,void 0);p(this,E,void 0);p(this,d,void 0);p(this,x,new g(this,R));r(this,"individualsText","Individuals");r(this,"businessText","Business");r(this,"educationText","Students and teachers");r(this,"continueText","Continue");r(this,"ready",!1);this.step=1,b(this,d,this.handleOfferSelected.bind(this)),this.handleWhatsIncludedClick=this.handleWhatsIncludedClick.bind(this)}get log(){return l(this,c)||b(this,c,document.head.querySelector("wcms-commerce")?.Log.module("twp")),l(this,c)}get individualsTab(){return this.cciCards.length===0?i``:i`
            <sp-tab value="${u}" label=${this.individualsText}>
                <sp-icon-user slot="icon"></sp-icon-user>
            </sp-tab>
            <sp-tab-panel value="${u}">
                <div class="cards">
                    <slot name="individuals"></slot>
                    <slot name="cci-footer"></slot>
                </div>
            </sp-tab-panel>
        `}get businessTab(){return this.cctCards.length===0?i``:i`
            <sp-tab value="${f}" label=${this.businessText}>
                <sp-icon-user-group slot="icon"></sp-icon-user-group>
            </sp-tab>
            <sp-tab-panel value="${f}">
                <div class="cards">
                    <slot name="business"></slot>
                    <slot name="cct-footer"></slot>
                </div>
            </sp-tab-panel>
        `}get educationTab(){return this.cceCards.length===0?i``:i`
            <sp-tab value="${C}" label=${this.educationText}>
                <sp-icon-book slot="icon"></sp-icon-book>
            </sp-tab>
            <sp-tab-panel value="${C}">
            <div class="cards">
                <slot name="education"></slot>
                <slot name="cce-footer"></slot>
            </sp-tab-panel>
        `}preselectedTab(){let s=new URLSearchParams(window.location.search).get("plan");return s===u||s===f||s===C?s:u}get selectedTabPanel(){return this.shadowRoot.querySelector("sp-tab-panel[selected]")}get firstCardInSelectedTab(){return this.selectedTabPanel?.querySelector("slot").assignedElements()[0]}get tabs(){return this.cards.length===1?i``:this.singleCard&&this.step===1?i``:i`
            <sp-tabs
                emphasized
                selected="${this.selectedTab}"
                @change=${this.tabChanged}
            >
                ${this.individualsTab} ${this.businessTab} ${this.educationTab}
            </sp-tabs>
        `}async tabChanged(e){this.selectedTab=e.target.selected,await e.target.updateComplete,this.selectCard(this.firstCardInSelectedTab)}get singleCardFooter(){if(this.step===1)return i`
            <slot name="cci-footer"></slot>
            <slot name="cct-footer"></slot>
            <slot name="cce-footer"></slot>
        `}get desktopLayout(){return this.singleCard?i`<div class="desktop" data-step="${this.step}">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="single-card"></slot>
                    ${this.singleCardFooter} ${this.backButton}
                </div>
                <aside>
                    <slot name="panel"></slot>
                </aside>
            </div>`:i`
            <div class="desktop" data-step="${this.step}">
                <div id="content">
                    <slot name="detail-xl"></slot>
                    ${this.tabs}
                    <slot name="footer-link"></slot>
                </div>
                ${this.cciCards.length<3?i`<aside>
                          <slot name="panel"></slot>
                      </aside>`:""}
                ${this.continueButton}
            </div>
        `}get showSubscriptionPanelInStep1(){return l(this,x).matches?!1:this.cciCards.length<3}get continueButton(){return this.showSubscriptionPanelInStep1?i``:i`
            <div id="continueButton">
                <sp-button
                    variant="accent"
                    size="large"
                    @click=${this.handleContinue}
                >
                    ${this.continueText}
                </sp-button>
            </div>
        `}selectSingleCard(e){e.setAttribute("data-slot",e.getAttribute("slot")),e.setAttribute("slot","single-card"),this.singleCard=e}unSelectSingleCard(){this.singleCard&&(this.singleCard.setAttribute("slot",this.singleCard.getAttribute("data-slot")),this.singleCard.removeAttribute("data-slot"),this.step=1,this.singleCard=void 0)}handleContinue(){this.step=2,this.selectSingleCard(this.cardToSelect),b(this,E,[...this.singleCard.querySelectorAll("merch-icon")].map(e=>e.cloneNode(!0)))}handleBack(){this.unSelectSingleCard()}get cardToSelect(){return this.selectedTabPanel?.card??this.querySelector("merch-card[aria-selected]")}get selectedCard(){return this.singleCard??this.selectedTabPanel.card}get mobileStepTwo(){return this.singleCard?i`
            ${this.backButton} ${this.stepTwoCardIconsAndTitle}
            <slot name="panel"></slot>
        `:i``}get stepTwoCardIconsAndTitle(){if(this.selectedCard)return i`<div id="card-icons-title">
            ${l(this,E)}
            <h3>${this.selectedCard.title}</h3>
        </div>`}get backButton(){return this.step!==2?i``:i`<sp-button
            id="backButton"
            treatment="outline"
            variant="secondary"
            size="s"
            @click=${this.handleBack}
        >
            <sp-icon-chevron-double-left
                slot="icon"
            ></<sp-icon-chevron-double-left></sp-icon-chevron-double-left
            > Back</sp-button>`}get mobileLayout(){return this.step===1?i`
                <div class="mobile" data-step="${this.step}">
                    <slot name="detail-xl"></slot>
                    <slot name="single-card"></slot>
                    ${this.tabs} ${this.continueButton}
                </div>
            `:i`
            <div class="mobile" data-step="${this.step}">
                <slot name="detail-xl"></slot>
                ${this.tabs}${this.mobileStepTwo}
            </div>
        `}render(){return this.ready?i`
            <sp-theme  color="light" scale="large">
                ${l(this,x).matches?this.mobileLayout:this.desktopLayout}
                <slot name="merch-whats-included"></slot>
            </div>
        `:i``}connectedCallback(){super.connectedCallback(),this.style.setProperty("--mod-tabs-font-weight",700),this.addEventListener(T,this.merchTwpReady),this.subscriptionPanel.addEventListener(_,l(this,d)),this.addEventListener(N,this.handleQuantityChange),this.whatsIncludedLink?.addEventListener("click",this.handleWhatsIncludedClick),this.addEventListener(S,this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(T,this.merchTwpReady),this.subscriptionPanel.removeEventListener(_,l(this,d)),this.whatsIncludedLink?.removeEventListener("click",this.handleWhatsIncludedClick),this.removeEventListener(S,this.handleStorageChange)}handleOfferSelected(e){this.log.debug("Selecting plan type",e.target.planType),this.selectedCard.selectMerchOffer(e.target.selectedOffer)}handleQuantityChange(e){this.selectedTabPanel&&(this.selectedCard.quantitySelect.defaultValue=e.detail.option,this.requestUpdate())}get whatsIncludedLink(){return this.querySelector("merch-card .merch-whats-included")}get whatsIncluded(){return this.querySelector('[slot="merch-whats-included"]')}setOfferSelectOnPanel(e){e.setAttribute("variant","subscription-options"),this.subscriptionPanel.offerSelect?.remove(),this.subscriptionPanel.appendChild(e)}handleStorageChange(e){let s=e.detail.offerSelect;s&&this.setOfferSelectOnPanel(s)}get preselectedCardId(){let e=v()["select-cards"]?.split(",").reduce((s,a)=>{let n=decodeURIComponent(a.trim().toLowerCase());return n&&s.push(n),s},[])||[];if(e.length&&this.selectedTab===u)return e[0];if(e.length>1&&this.selectedTab===f)return e[1];if(e.length>2&&this.selectedTab===C)return e[2]}get cardToBePreselected(){return this.selectedTabPanel?.querySelector("slot").assignedElements().find(e=>{let s=e.querySelector(".heading-xs")?.textContent.trim().toLowerCase()||"";return this.preselectedCardId&&s.includes(this.preselectedCardId)})}selectCard(e,s=!1){let a=this.selectedTabPanel,n=a?.card;(s||!n)&&(n&&(n.selected=void 0),n=this.cardToBePreselected||e,n.selected=!0,a?a.card=n:this.selectSingleCard(n)),n.focus(),this.subscriptionPanel.quantitySelect?.remove();let h=n.quantitySelect?.cloneNode(!0);h&&this.subscriptionPanel.appendChild(h);let y=n.offerSelect.cloneNode(!0);this.setOfferSelectOnPanel(y)}handleWhatsIncludedClick(e){e.preventDefault(),this.whatsIncluded?.classList.toggle("hidden")}async processCards(){let e=[...this.querySelectorAll("merch-card")];e.forEach((s,a)=>{let{customerSegment:n,marketSegment:h}=s.offerSelect;n==="INDIVIDUAL"?h==="COM"?s.setAttribute("slot","individuals"):h==="EDU"&&s.setAttribute("slot","education"):n==="TEAM"&&s.setAttribute("slot","business"),s.addEventListener("click",()=>this.selectCard(s,!0))}),this.ready=!0,this.requestUpdate(),await this.updateComplete,await this.tabElement?.updateComplete,this.selectCard(e.length===1?e[0]:this.firstCardInSelectedTab,!0)}merchTwpReady(){this.querySelector("merch-card merch-offer-select:not([plan-type])")||this.processCards()}get cards(){return this.querySelectorAll("merch-card[slot]")}get cciCards(){return this.querySelectorAll('merch-card[slot="individuals"]')}get cctCards(){return this.querySelectorAll('merch-card[slot="business"]')}get cceCards(){return this.querySelectorAll('merch-card[slot="education"]')}get subscriptionPanel(){return this.querySelector("merch-subscription-panel")}get tabElement(){return this.shadowRoot.querySelector("sp-tabs")}};c=new WeakMap,E=new WeakMap,d=new WeakMap,x=new WeakMap,r(m,"styles",[w]),r(m,"properties",{individualsText:{type:String,attribute:"individuals-text"},businessText:{type:String,attribute:"business-text"},educationText:{type:String,attribute:"education-text"},continueText:{type:String,attribute:"continue-text"},ready:{type:Boolean},step:{type:Number},singleCard:{state:!0},selectedTab:{type:String,attribute:"selected-tab",reflect:!0}});window.customElements.define(P,m);export{m as MerchTwpD2P};

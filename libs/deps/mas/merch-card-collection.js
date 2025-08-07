var Ni=Object.defineProperty;var Oi=e=>{throw TypeError(e)};var ao=(e,t,r)=>t in e?Ni(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var oo=(e,t)=>{for(var r in t)Ni(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>ao(e,typeof t!="symbol"?t+"":t,r),cr=(e,t,r)=>t.has(e)||Oi("Cannot "+r);var C=(e,t,r)=>(cr(e,t,"read from private field"),r?r.call(e):t.get(e)),V=(e,t,r)=>t.has(e)?Oi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),Z=(e,t,r,i)=>(cr(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),wt=(e,t,r)=>(cr(e,t,"access private method"),r);import{html as me,LitElement as Xa,css as Mc,unsafeCSS as Wa,nothing as oe}from"../lit-all.min.js";var X="(max-width: 767px)",Me="(max-width: 1199px)",k="(min-width: 768px)",L="(min-width: 1200px)",fe="(min-width: 1600px)";function Tt(){return window.matchMedia(X)}function At(){return window.matchMedia(L)}function _t(){return Tt().matches}function Pt(){return At().matches}var Xe=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};import{html as Ct,nothing as so}from"../lit-all.min.js";var Re,Ke=class Ke{constructor(t){g(this,"card");V(this,Re);this.card=t,this.insertVariantStyle()}getContainer(){return Z(this,Re,C(this,Re)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),C(this,Re)}insertVariantStyle(){if(!Ke.styleMap[this.card.variant]){Ke.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Ct`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Ct` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Ct`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:so}get secureLabelFooter(){return Ct`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Lt(this.card.variant)}};Re=new WeakMap,g(Ke,"styleMap",{});var I=Ke;import{html as Hr,css as Ro}from"../lit-all.min.js";var Ir={};oo(Ir,{CLASS_NAME_FAILED:()=>xr,CLASS_NAME_HIDDEN:()=>lo,CLASS_NAME_PENDING:()=>vr,CLASS_NAME_RESOLVED:()=>br,CheckoutWorkflow:()=>_o,CheckoutWorkflowStep:()=>j,Commitment:()=>ye,ERROR_MESSAGE_BAD_REQUEST:()=>Er,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>wo,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>yr,EVENT_AEM_ERROR:()=>fr,EVENT_AEM_LOAD:()=>ur,EVENT_MAS_ERROR:()=>gr,EVENT_MAS_READY:()=>So,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>Eo,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>hr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>Qe,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>pr,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>Ze,EVENT_MERCH_CARD_COLLECTION_SORT:()=>dr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>bo,EVENT_MERCH_OFFER_READY:()=>mo,EVENT_MERCH_OFFER_SELECT_READY:()=>uo,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>vo,EVENT_MERCH_SEARCH_CHANGE:()=>yo,EVENT_MERCH_SIDENAV_SELECT:()=>mr,EVENT_MERCH_STOCK_CHANGE:()=>go,EVENT_MERCH_STORAGE_CHANGE:()=>xo,EVENT_OFFER_SELECTED:()=>fo,EVENT_TYPE_FAILED:()=>Sr,EVENT_TYPE_READY:()=>Mt,EVENT_TYPE_RESOLVED:()=>wr,Env:()=>ce,FF_DEFAULTS:()=>ve,HEADER_X_REQUEST_ID:()=>Je,LOG_NAMESPACE:()=>Tr,Landscape:()=>xe,MARK_DURATION_SUFFIX:()=>Nr,MARK_START_SUFFIX:()=>Rr,MODAL_TYPE_3_IN_1:()=>Se,NAMESPACE:()=>co,PARAM_AOS_API_KEY:()=>To,PARAM_ENV:()=>_r,PARAM_LANDSCAPE:()=>Pr,PARAM_MAS_PREVIEW:()=>Ar,PARAM_WCS_API_KEY:()=>Ao,PROVIDER_ENVIRONMENT:()=>Mr,SELECTOR_MAS_CHECKOUT_LINK:()=>Ii,SELECTOR_MAS_ELEMENT:()=>lr,SELECTOR_MAS_INLINE_PRICE:()=>ie,SELECTOR_MAS_SP_BUTTON:()=>po,SELECTOR_MAS_UPT_LINK:()=>Hi,SORT_ORDER:()=>ae,STATE_FAILED:()=>ne,STATE_PENDING:()=>ge,STATE_RESOLVED:()=>le,TAG_NAME_SERVICE:()=>ho,TEMPLATE_PRICE:()=>Po,TEMPLATE_PRICE_ANNUAL:()=>Lo,TEMPLATE_PRICE_LEGAL:()=>Or,TEMPLATE_PRICE_STRIKETHROUGH:()=>Co,Term:()=>J,WCS_PROD_URL:()=>Cr,WCS_STAGE_URL:()=>Lr});var ye=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),J=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),co="merch",lo="hidden",Mt="wcms:commerce:ready",ho="mas-commerce-service",ie='span[is="inline-price"][data-wcs-osi]',Ii='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',po="sp-button[data-wcs-osi]",Hi='a[is="upt-link"]',lr=`${ie},${Ii},${Hi}`,mo="merch-offer:ready",uo="merch-offer-select:ready",hr="merch-card:action-menu-toggle",fo="merch-offer:selected",go="merch-stock:change",xo="merch-storage:change",vo="merch-quantity-selector:change",bo="merch-card-quantity:change",Eo="merch-modal:addon-and-quantity-update",yo="merch-search:change",dr="merch-card-collection:sort",Qe="merch-card-collection:literals-changed",Ze="merch-card-collection:sidenav-attached",pr="merch-card-collection:showmore",mr="merch-sidenav:select",ur="aem:load",fr="aem:error",So="mas:ready",gr="mas:error",xr="placeholder-failed",vr="placeholder-pending",br="placeholder-resolved",Er="Bad WCS request",yr="Commerce offer not found",wo="Literals URL not provided",Sr="mas:failed",wr="mas:resolved",Tr="mas/commerce",Ar="mas.preview",_r="commerce.env",Pr="commerce.landscape",To="commerce.aosKey",Ao="commerce.wcsKey",Cr="https://www.adobe.com/web_commerce_artifact",Lr="https://www.stage.adobe.com/web_commerce_artifact_stage",ne="failed",ge="pending",le="resolved",xe={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},Je="X-Request-Id",j=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),_o="UCv3",ce=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Mr={PRODUCTION:"PRODUCTION"},Se={TWP:"twp",D2P:"d2p",CRM:"crm"},Rr=":start",Nr=":duration",Po="price",Co="price-strikethrough",Lo="annual",Or="legal",ve="mas-ff-defaults",ae={alphabetical:"alphabetical",authored:"authored"};var Mo="mas-commerce-service";var et=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Ne(e,t={},r=null,i=null){let n=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,o]of Object.entries(t))n.setAttribute(a,o);return n}function Rt(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function ki(){return window.matchMedia("(max-width: 1024px)").matches}function Di(){return document.getElementsByTagName(Mo)?.[0]}var Bi=`
:root {
    --consonant-merch-card-catalog-width: 302px;
    --consonant-merch-card-catalog-icon-size: 40px;
}

.collection-container.catalog {
    --merch-card-collection-card-min-height: 330px;
    --merch-card-collection-card-width: var(--consonant-merch-card-catalog-width);
}

merch-sidenav.catalog {
    --merch-sidenav-title-font-size: 15px;
    --merch-sidenav-title-font-weight: 500;
    --merch-sidenav-title-line-height: 19px;
    --merch-sidenav-title-color: rgba(70, 70, 70, 0.87);
    --merch-sidenav-title-padding: 8px 15px 21px;
    --merch-sidenav-item-height: 40px;
    --merch-sidenav-item-inline-padding: 15px;
    --merch-sidenav-item-font-weight: 700;
    --merch-sidenav-item-font-size: 17px;
    --merch-sidenav-item-line-height: normal;
    --merch-sidenav-item-label-top-margin: 8px;
    --merch-sidenav-item-label-bottom-margin: 11px;
    --merch-sidenav-item-icon-top-margin: 11px;
    --merch-sidenav-item-icon-gap: 13px;
    --merch-sidenav-item-selected-background: var(--spectrum-gray-300, #D5D5D5);
    --merch-sidenav-list-item-gap: 5px;
    --merch-sidenav-checkbox-group-padding: 0 15px;
    --merch-sidenav-modal-border-radius: 0;
}

merch-sidenav.catalog merch-sidenav-checkbox-group {
    border: none;
}

merch-sidenav.catalog merch-sidenav-list:not(:first-of-type) {
    --merch-sidenav-list-gap: 32px;
}

.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    --merch-card-collection-card-width: var(--consonant-merch-card-catalog-width);
}

.collection-container.catalog merch-sidenav {
    --merch-sidenav-gap: 10px;
}

merch-card-collection-header.catalog {
    --merch-card-collection-header-row-gap: var(--consonant-merch-spacing-xs);
    --merch-card-collection-header-search-max-width: 244px;
}

@media screen and ${X} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-columns: min-content auto;
    }
}

@media screen and ${k} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-column-gap: 16px;
    }
}

@media screen and ${L} {
    :root {
        --consonant-merch-card-catalog-width: 276px;
    }

    merch-card-collection-header.catalog {
        --merch-card-collection-header-result-font-size: 17px;
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
}`;var Ui={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Oe=class extends I{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(hr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let i=this.actionMenuContentSlot.classList.contains("hidden");i||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!i).toString())});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(i||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",i),this.setAriaExpanded(this.actionMenu,"false"))});g(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Hr` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${ki()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
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
            ${this.card.actionMenuContent?"":"hidden"}"
                    @focusout="${this.hideActionMenu}"
                    >${this.card.actionMenuContent}
                </slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Hr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Hr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Bi}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};g(Oe,"variantStyle",Ro`
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
    `);import{html as tt}from"../lit-all.min.js";var Fi=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${k} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${L} {
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
`;var Nt=class extends I{constructor(t){super(t)}getGlobalCSS(){return Fi}renderLayout(){return tt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?tt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:tt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?tt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:tt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as $i}from"../lit-all.min.js";var Gi=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${k} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${L} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${fe} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Ot=class extends I{constructor(t){super(t)}getGlobalCSS(){return Gi}renderLayout(){return $i` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":$i`<hr />`} ${this.secureLabelFooter}`}};import{html as Ie,css as No,unsafeCSS as kr}from"../lit-all.min.js";var zi=`
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
@media screen and ${X} {
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

@media screen and ${Me} {
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
@media screen and ${k} {
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
@media screen and ${L} {
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

@media screen and ${fe} {
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
`;var Oo=32,He=class extends I{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Ie`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Ie`<slot name="secure-transaction-label"></slot>`;return Ie`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return zi}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let i=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");i&&i.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,n)=>{let a=Math.max(Oo,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${ie}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,n=this.headingMPriceSlot;if(!i&&n){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=Ne("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=Ne("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,n=this.card.planType;i&&(await i.onceSettled(),n=i.value?.[0]?.planType),n&&(r.planType=n)}renderLayout(){return Ie` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Ie`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:Ie`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),_t()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(He,"variantStyle",No`
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

    @media screen and ${kr(X)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${kr(Me)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${kr(L)} {
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
  `);import{html as rt,css as Io,nothing as It}from"../lit-all.min.js";var Vi=`
:root {
    --consonant-merch-card-plans-width: 302px;
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

merch-card[variant="plans"] [slot="subtitle"] {
    font-size: 14px;
    font-weight: 700;
    line-height: 18px;
}

merch-card[variant^="plans"] span.price-unit-type:not([slot="callout-content"] *):not([slot="addon"] *) {
    display: block;
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

merch-card[variant="plans-education"] [slot="body-xs"] p:has(.heading-xs) {
    margin-bottom: 16x;
}

merch-card[variant="plans-education"] [slot="body-xs"] p:has(span[is="inline-price"]) {
    margin-bottom: 16px;
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

merch-card-collection.plans merch-card[variant="plans"] aem-fragment + [slot^="heading-"] {
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

merch-card[variant^="plans"][size="super-wide"] [slot="callout-content"] {
    margin: 0;
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
    margin-top: auto;
    padding-top: 8px;
}

merch-card[variant^="plans"]:has([slot="quantity-select"]) merch-addon {
    margin: 0;
}

merch-card[variant^="plans"] merch-addon {
    --merch-addon-gap: 10px;
    --merch-addon-align: center;
    --merch-addon-checkbox-size: 12px;
    --merch-addon-checkbox-border: 2px solid rgb(109, 109, 109);
    --merch-addon-checkbox-radius: 2px;
    --merch-addon-checkbox-checked-bg: var(--checkmark-icon);
    --merch-addon-checkbox-checked-color: var(--color-accent);
    --merch-addon-label-size: 12px;
    --merch-addon-label-color: rgb(34, 34, 34);
    --merch-addon-label-line-height: normal;
}

merch-card[variant^="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

merch-card[variant^="plans"] [slot="footer"] .con-button > span {
    min-width: unset;
}

merch-card[variant^="plans"] merch-addon span[data-template="price"] {
    display: none;
}

/* Mobile */
@media screen and ${X} {
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

.collection-container.plans {
    --merch-card-collection-card-min-height: 273px;
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-width);
}

merch-sidenav.plans {
    --merch-sidenav-padding: 16px 20px 16px 16px;
}

merch-card-collection-header.plans {
    --merch-card-collection-header-columns: 1fr fit-content(100%);
    --merch-card-collection-header-areas: "result filter";
}

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-width);
}

merch-card-collection:has([slot="subtitle"]) merch-card {
    --merch-card-plans-subtitle-display: block;
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
@media screen and ${k} {
  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
  
  .columns.merch-card > .row {
      grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width) * 2 + var(--consonant-merch-spacing-m)));
  }
}

/* desktop */
@media screen and ${L} {
    :root {
            --consonant-merch-card-plans-width: 276px;
    }

    merch-sidenav.plans {
            --merch-sidenav-collection-gap: 30px;
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

    .collection-container.plans:has(merch-sidenav) {
        width: 100vw;
        position: relative;
        left: 50%;
        transform: translateX(-50vw);
        justify-content: start;
        padding-inline: 30px;
        padding-top: 24px;
    }
}

/* Large desktop */
@media screen and ${fe} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }

    merch-sidenav.plans {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var Ht={title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},ji={...function(){let{whatsIncluded:e,size:t,...r}=Ht;return r}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},Yi={...function(){let{subtitle:e,whatsIncluded:t,size:r,quantitySelect:i,...n}=Ht;return n}()},Y=class extends I{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===Or&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Vi}adjustSlotPlacement(t,r,i){let n=this.card.shadowRoot,a=n.querySelector("footer"),o=this.card.getAttribute("size"),s=n.querySelector(`footer slot[name="${t}"]`),l=n.querySelector(`.body slot[name="${t}"]`),c=n.querySelector(".body");if((!o||!o.includes("wide"))&&(a?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(a?.classList.toggle("wide-footer",Pt()),!i&&s){if(l)s.remove();else{let h=c.querySelector(`[data-placeholder-for="${t}"]`);h?h.replaceWith(s):c.appendChild(s)}return}if(i&&l){let h=document.createElement("div");if(h.setAttribute("data-placeholder-for",t),h.classList.add("slot-placeholder"),!s){let m=l.cloneNode(!0);a.prepend(m)}l.replaceWith(h)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],Pt()),this.adjustSlotPlacement("callout-content",["super-wide"],Pt())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}adjustPrices(){this.headingM&&(this.headingM.setAttribute("role","heading"),this.headingM.setAttribute("aria-level","2"))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout(),this.adjustPrices()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${ie}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?rt`<div class="divider"></div>`:It}async adjustLegal(){if(await this.card.updateComplete,await customElements.whenDefined("inline-price"),this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],r=this.card.querySelector(`[slot="heading-m"] ${ie}[data-template="price"]`);r&&t.push(r);let i=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling))});await Promise.all(i)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?rt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:It}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?It:rt`<slot name="icons"></slot>`}connectedCallbackHook(){let t=Tt();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let r=At();r?.addEventListener&&r.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=Tt();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let r=At();r?.removeEventListener&&r.removeEventListener("change",this.adaptForMedia)}renderLayout(){return rt` ${this.badge}
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
                <slot name="quantity-select"></slot>
                ${this.stockCheckbox}
                <slot name="addon"></slot>
                <slot name="badge"></slot>
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}};g(Y,"variantStyle",Io`
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-padding: 15px;
            --merch-card-plans-subtitle-display: contents;
            --merch-card-plans-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            font-weight: 400;
        }

        :host([variant^='plans']) .slot-placeholder {
            display: none;
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
            margin-bottom: 8px;
        }

        :host([variant='plans']) slot[name="subtitle"] {
            display: var(--merch-card-plans-subtitle-display);
            min-height: 18px;
            margin-top: 8px;
            margin-bottom: -8px;
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            min-height: var(--merch-card-plans-heading-min-height);
        }

        :host([variant^='plans']) .body {
            min-width: var(--merch-card-plans-min-width);
            padding: var(--merch-card-plans-padding);
        }

        :host([variant='plans'][size]) .body {
            max-width: none;
        }

        :host([variant^='plans']) ::slotted([slot='addon']) {
            margin-top: auto;
            padding-top: 8px;
        }

        :host([variant^='plans']) footer ::slotted([slot='addon']) {
            margin: 0;
            padding: 0;
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

        :host([variant^='plans']) footer {
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
    `),g(Y,"collectionOptions",{customHeaderArea:t=>t.sidenav?rt`<slot name="resultsText"></slot>`:It,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as Dr,css as Ho}from"../lit-all.min.js";var qi=`
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
@media screen and ${k} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${L} {
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
`;var ke=class extends I{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return qi}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Dr` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Dr`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Dr`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),_t()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${ie}[data-template="price"]`)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=Ne("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=Ne("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g(ke,"variantStyle",Ho`
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
    `);import{html as Br,css as ko}from"../lit-all.min.js";var Wi=`
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
@media screen and ${X} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${k} {
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
@media screen and ${L} {
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
`;var De=class extends I{constructor(t){super(t)}getGlobalCSS(){return Wi}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Br` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Br`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Br`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g(De,"variantStyle",ko`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Ur,css as Do}from"../lit-all.min.js";var Xi=`
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

@media screen and ${X} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${k} {
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
@media screen and ${L} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${fe} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Ki={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Be=class extends I{constructor(t){super(t)}getGlobalCSS(){return Xi}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Ur`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Ur`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Ur`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Be,"variantStyle",Do`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as Bo,css as Uo}from"../lit-all.min.js";var Qi=`
:root {
    --consonant-merch-card-simplified-pricing-express-width: 294px;
    --merch-card-simplified-pricing-express-cta-color: var(
        var(--spectrum-gray-50),
        rgba(255, 255, 255, 1)
    );
}

merch-card[variant="simplified-pricing-express"] {
    min-width: var(--consonant-merch-card-simplified-pricing-express-width);
    background-color: var(--spectrum-gray-50);
    border-radius: 16px;
    height: 100%;
    display: flex;
}

merch-card[variant="simplified-pricing-express"] merch-badge {
    white-space: nowrap;
}

merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] {
    display: inline-block;
    align-self: flex-start;
}

merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] merch-badge {
    background: linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%);
    color: white;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 600 ;
    line-height: 20.8px ;
    white-space: normal ;
    display: inline-block ;
    margin: 0;
    border: none ;
    word-wrap: break-word;
    word-break: normal ;
    text-align: center;
    overflow-wrap: break-word;
    max-width: 100%;
    left: auto;
    position: relative;
}

merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] merch-badge {
    color: #fff;
}

/* Grid layout for simplified-pricing-express cards */
merch-card-collection.simplified-pricing-express:has(merch-card[variant="simplified-pricing-express"]) {
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: stretch;
    gap: var(--consonant-merch-spacing-xs);
    padding: var(--spacing-m);
}

/* Mobile/Tablet - Single column */
@media screen and ${Me} {
    merch-card-collection.simplified-pricing-express:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: 1fr;
    }
    
    merch-card[variant="simplified-pricing-express"] {
        width: 100%;
        max-width: var(--consonant-merch-card-simplified-pricing-express-width);
    }
}

/* Desktop - 4 columns */
@media screen and ${L} {
    merch-card-collection.simplified-pricing-express:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: repeat(4, var(--consonant-merch-card-simplified-pricing-express-width));
        max-width: calc(4 * var(--consonant-merch-card-simplified-pricing-express-width) + 3 * var(--consonant-merch-spacing-m));
        margin: 0 auto;
    }
}

merch-card[variant="simplified-pricing-express"] p {
    margin: 0 !important; /* needed to override express-milo default margin to all <p> */
}

merch-card[variant="simplified-pricing-express"] [slot="body-xs"] {
    font-size: var(--merch-card-simplified-pricing-express-body-xs-font-size);
    line-height: var(--merch-card-simplified-pricing-express-body-xs-line-height);
    color: var(--spectrum-gray-700);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] {
    display: block;
    width: 100%;
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.button {
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-weight: var(--merch-card-simplified-pricing-express-cta-font-weight);
    line-height: var(--merch-card-simplified-pricing-express-cta-line-height);
    font-size: var(--merch-card-simplified-pricing-express-cta-font-size);
    margin: 0;
    padding: 12px 24px 13px 24px;
    border-radius: 26px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] {
  /* Layout styles moved to Shadow DOM */
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 8px;
  margin: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"][data-template="optical"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  color: var(--spectrum-gray-800);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] p {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-p-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] .price-currency-symbol {
  font-size: var(--merch-card-simplified-pricing-express-price-currency-symbol-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-currency-symbol-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-currency-symbol-line-height);
  color: var(--spectrum-gray-700);
  width: 100%;
}

/* Remove default strikethrough for simplified-pricing-express */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-strikethrough, 
merch-card[variant="simplified-pricing-express"] span.placeholder-resolved[data-template='strikethrough'] {
  text-decoration: none;
}

/* Apply strikethrough only to price numbers */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-integer,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals {
  text-decoration: line-through;
  font-size: 28px;
  font-weight: 900;
  line-height: 36.4px;
  text-decoration-thickness: 2px;
}

/* Apply indigo-800 color to optical price when preceded by strikethrough */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'],
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'] .price-currency-symbol {
  color: var(--spectrum-indigo-800);
}

/* Hide screen reader only text */
merch-card[variant="simplified-pricing-express"] sr-only {
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

/* mas-tooltip inline styles for simplified-pricing-express */
merch-card[variant="simplified-pricing-express"] mas-tooltip {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  margin-left: 4px;
  overflow: visible;
}

merch-card[variant="simplified-pricing-express"] mas-tooltip merch-icon {
  display: inline-block;
  vertical-align: middle;
}

/* Tooltip containers - overflow handled by Shadow DOM */

/* Mobile accordion styles */
@media (max-width: 599px) {
  merch-card[variant="simplified-pricing-express"] {
    width: 332px;
    max-width: 332px;
  }

  /* Badge alignment on mobile */
  merch-card[variant="simplified-pricing-express"] [slot="badge"] {
    font-size: 16px;
    font-weight: 400;
    color: var(--spectrum-gray-700);
    margin-top: 10px;
  }

  /* Trial badge alignment on mobile */
  merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] {
    margin-left: 0;
    align-self: flex-start;
  }
  
  merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] merch-badge {
    font-size: 12px;
    line-height: 20.8px;
  }

  /* By default, hide content sections on mobile until JavaScript sets data-expanded */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Also apply to cards without data-expanded attribute */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Fix spacing between cards on mobile */
  main merch-card-collection.simplified-pricing-express p:has(merch-card[variant="simplified-pricing-express"]),
  main .section p:has(merch-card[variant="simplified-pricing-express"]) {
    margin: 0;
  }

  /* Collapsed state - target slotted content */
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="price"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Expanded state - explicitly show content */
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] [slot="price"],
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] [slot="cta"] {
    display: block;
    visibility: visible;
    height: auto;
  }

  /* Collapsed card should have fixed height and padding */
  merch-card[variant="simplified-pricing-express"][data-expanded="false"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) {
    height: 72px;
    min-height: auto;
    padding: 16px;
    overflow: hidden;
  }

  /* Expanded card should have auto height */
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] {
    height: auto;
    min-height: auto;
    padding: var(--merch-card-simplified-pricing-express-padding-mobile);
  }
}

/* Tablet styles */
@media (min-width: 600px) and (max-width: 1199px) {
  merch-card[variant="simplified-pricing-express"] {
    width: 548px;
    max-width: 548px;
  }

  /* Badge alignment on tablet */
  merch-card[variant="simplified-pricing-express"] [slot="badge"] {
    font-size: 16px;
    font-weight: 400;
    display: flex;
    align-self: flex-end;
  }

  /* Trial badge alignment on tablet */
  merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] {
    margin-left: 0 ;
    align-self: flex-start;
  }
  
  merch-card[variant="simplified-pricing-express"] [slot="trial-badge"] merch-badge {
    font-size: 16px;
    line-height: 20.8px;
  }

  /* Apply same collapsed state logic as mobile */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="price"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Expanded state - explicitly show content on tablet */
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] [slot="price"],
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] [slot="cta"] {
    display: block;
    visibility: visible;
    height: auto;
  }

  /* Collapsed card height on tablet */
  merch-card[variant="simplified-pricing-express"][data-expanded="false"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) {
    height: 72px;
    min-height: auto;
    padding: 16px;
    overflow: hidden;
  }

  /* Expanded card should have auto height on tablet */
  merch-card[variant="simplified-pricing-express"][data-expanded="true"] {
    height: auto;
    min-height: auto;
  }
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
    width: 100%;
}

merch-card[variant="simplified-pricing-express"] [slot="footer"] sp-button[variant="accent"] {
    background-color: var(--spectrum-indigo-900);
}
`;var Fr={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-l",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge"},trialBadge:{tag:"div",slot:"trial-badge"},description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"XL"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)",gradient:"linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)"}},disabledAttributes:["badgeColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},Ue=class extends I{getGlobalCSS(){return Qi}get aemFragmentMapping(){return Fr}get headingSelector(){return'[slot="heading-l"]'}postCardUpdateHook(t){t.has("borderColor")&&this.card.borderColor&&this.card.style.setProperty("--merch-card-custom-border-color",this.card.borderColor)}connectedCallbackHook(){!this.card||this.card.failed||(this.setupMobileAccordion(),this.watchForDefaultCardAttribute(),setTimeout(()=>{this.card?.hasAttribute("data-default-card")&&window.matchMedia("(max-width: 1199px)").matches&&this.card.setAttribute("data-expanded","true")},100))}watchForDefaultCardAttribute(){this.card&&(this.attributeObserver=new MutationObserver(t=>{t.forEach(r=>{r.type==="attributes"&&r.attributeName==="data-default-card"&&this.card.hasAttribute("data-default-card")&&window.matchMedia("(max-width: 1199px)").matches&&this.card.setAttribute("data-expanded","true")})}),this.attributeObserver.observe(this.card,{attributes:!0,attributeOldValue:!0}))}setupMobileAccordion(){let t=this.card;if(!t)return;let r=()=>{if(window.matchMedia("(max-width: 1199px)").matches){let n=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",n?"true":"false")}else t.removeAttribute("data-expanded")};r();let i=window.matchMedia("(max-width: 1199px)");this.mediaQueryListener=n=>{r()},i.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia("(max-width: 1199px)").removeEventListener("change",this.mediaQueryListener),this.attributeObserver&&this.attributeObserver.disconnect()}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||!window.matchMedia("(max-width: 1199px)").matches)return;let a=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",a)}renderLayout(){return Bo`
            <div class="header" @click=${t=>this.handleChevronClick(t)}>
                <slot name="heading-l"></slot>
                <slot name="trial-badge"></slot>
                <slot name="badge"></slot>
                <button class="chevron-button" aria-label="Expand card" @click=${t=>this.handleChevronClick(t)}>
                    <svg class="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.5L5 8.5L6.4 7.1L12 12.7L17.6 7.1L19 8.5L12 15.5Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            <div class="description">
                <slot name="body-xs"></slot>
            </div>
            <div class="price">
                <slot name="price"></slot>
            </div>
            <div class="cta">
                <slot name="cta"></slot>
            </div>
            <slot></slot>
        `}};g(Ue,"variantStyle",Uo`
        :host([variant='simplified-pricing-express']) {
            --merch-card-simplified-pricing-express-width: 294px;
            --merch-card-simplified-pricing-express-padding: 24px;
            --merch-card-simplified-pricing-express-padding-mobile: 16px;
            --merch-card-simplified-pricing-express-min-height: 341px;
            --merch-card-simplified-pricing-express-price-font-size: 28px;
            --merch-card-simplified-pricing-express-price-font-weight: 900;
            --merch-card-simplified-pricing-express-price-line-height: 36.4px;
            --merch-card-simplified-pricing-express-price-currency-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-line-height: 28.6px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-symbol-line-height: 28.6px;
            --merch-card-simplified-pricing-express-body-xs-font-size: 16px;
            --merch-card-simplified-pricing-express-body-xs-line-height: 20.8px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-font-weight: 400;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            --merch-card-simplified-pricing-express-cta-font-size: 18px;
            --merch-card-simplified-pricing-express-cta-font-weight: 700;
            --merch-card-simplified-pricing-express-cta-line-height: 23.4px;
            width: var(--merch-card-simplified-pricing-express-width);
            max-width: var(--merch-card-simplified-pricing-express-width);
            min-height: var(--merch-card-simplified-pricing-express-min-height);
            height: 100%;
            background: var(--spectrum-gray-50);
            border: 2px solid var(--merch-card-custom-border-color, transparent);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: visible;
            padding: var(--merch-card-simplified-pricing-express-padding);
            gap: var(--consonant-merch-spacing-s);
            box-sizing: border-box;
            position: relative;
        }

        :host([variant='simplified-pricing-express'][gradient-border='true']) {
            border: none;
            background-origin: padding-box, border-box;
            background-clip: padding-box, border-box;
            background-image: linear-gradient(
                    to bottom,
                    #f8f8f8,
                    #f8f8f8
                ),
                linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%);
            border: 2px solid transparent;
        }

        :host([variant='simplified-pricing-express']) .header {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
        }

        :host([variant='simplified-pricing-express']) .badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--spectrum-blue-400);
            color: white;
            padding: 4px 12px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 700;
            z-index: 1;
        }

        :host([variant='simplified-pricing-express']) .price {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
        }

        /* Desktop only - Fixed heights for alignment */
        @media (min-width: 1200px) {
            :host([variant='simplified-pricing-express']) {
                display: flex;
                flex-direction: column;
                min-height: 360px; /* Increased to accommodate all content */
                height: auto;
            }

            :host([variant='simplified-pricing-express']) .description {
                height: 80px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
            }

            :host([variant='simplified-pricing-express']) .price {
                height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            :host([variant='simplified-pricing-express']) .cta {
                margin-top: auto;
                flex-shrink: 0;
            }
        }


        :host([variant='simplified-pricing-express']) .price-container {
            display: flex;
            flex-direction: row;
            align-items: baseline;
            gap: 4px;
        }

        :host([variant='simplified-pricing-express']) .cta-section {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: auto;
        }

        :host([variant='simplified-pricing-express']) .cta {
            width: 100%;
            display: block;
            margin-top: auto;
        }

        :host([variant='simplified-pricing-express']) .cta ::slotted(*) {
            width: 100%;
            display: block;
        }

        :host([variant='simplified-pricing-express']) .footer-text {
            font-size: 12px;
            line-height: 1.4;
            color: var(--spectrum-gray-700);
        }

        /* Mobile accordion styles */
        :host([variant='simplified-pricing-express']) .chevron-button {
            display: none;
            background: none;
            border: none;
            padding: 0;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        :host([variant='simplified-pricing-express']) .chevron-icon {
            width: 24px;
            height: 24px;
            color: var(--spectrum-gray-800);
            transition: transform 0.3s ease;
        }

        /* Chevron rotation based on parent card's data-expanded attribute */
        :host-context(merch-card[data-expanded='false']) .chevron-icon {
            transform: rotate(0deg);
        }

        :host-context(merch-card[data-expanded='true']) .chevron-icon {
            transform: rotate(180deg);
        }

        /* Mobile and Tablet - Show chevron */
        @media (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) .header {
                position: relative;
                padding-right: 32px;
                justify-content: flex-start;
                gap: 8px;
            }

            :host([variant='simplified-pricing-express']) .chevron-button {
                display: block;
                position: absolute;
                right: 0;
                top: 65%;
                transform: translateY(-50%);
            }
        }

        /* Mobile styles - 270px width */
        @media (max-width: 599px) {
            :host([variant='simplified-pricing-express']) {
                width: 270px;
                max-width: 270px;
                min-height: auto;
                cursor: pointer;
                transition: all 0.3s ease;
            }
        }

        /* Tablet styles - 548px width */
        @media (min-width: 600px) and (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) {
                width: 548px;
                max-width: 548px;
            }
        }
    `);import{css as Fo,html as Go}from"../lit-all.min.js";var Zi=`
merch-card[variant="mini"] {
  color: var(--spectrum-body-color);
  width: 400px;
  height: 250px;
}

merch-card[variant="mini"] .price-tax-inclusivity::before {
  content: initial;
}

merch-card[variant="mini"] [slot="title"] {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
}

merch-card[variant="mini"] [slot="legal"] {
    min-height: 17px;
}

merch-card[variant="mini"] [slot="ctas"] {
  display: flex;
  flex: 1;
  gap: 16px;
  align-items: end;
  justify-content: end;
}

merch-card[variant="mini"] span.promo-duration-text,
merch-card[variant="mini"] span.renewal-text {
    display: block;
}
`;var Ji={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},Fe=class extends I{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return Zi}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,i){i.literals={...i.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},i.space=!0,i.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${ie}[data-template="price"]`);if(!r)return;let i=r.cloneNode(!0);this.legal=i,r.dataset.displayTax="false",i.dataset.template="legal",i.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,i.setAttribute("slot","legal"),this.card.appendChild(i)}renderLayout(){return Go`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(Fe,"variantStyle",Fo`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
        }
    `);var Gr=new Map,ee=(e,t,r=null,i=null,n)=>{Gr.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:n})};ee("catalog",Oe,Ui,Oe.variantStyle);ee("image",Nt);ee("inline-heading",Ot);ee("mini-compare-chart",He,null,He.variantStyle);ee("plans",Y,Ht,Y.variantStyle,Y.collectionOptions);ee("plans-students",Y,Yi,Y.variantStyle,Y.collectionOptions);ee("plans-education",Y,ji,Y.variantStyle,Y.collectionOptions);ee("product",ke,null,ke.variantStyle);ee("segment",De,null,De.variantStyle);ee("special-offers",Be,Ki,Be.variantStyle);ee("simplified-pricing-express",Ue,Fr,Ue.variantStyle);ee("mini",Fe,Ji,Fe.variantStyle);function Lt(e){return Gr.get(e)?.fragmentMapping}function $r(e){return Gr.get(e)?.collectionOptions}var en="hashchange";function $o(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[n,a=""]=i.split("=");n&&t.push([n,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function it(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([n,a])=>{a?t.set(n,a):t.delete(n)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function tn(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=$o(window.location.hash);e(r)};return t(),window.addEventListener(en,t),()=>{window.removeEventListener(en,t)}}import{css as zo,unsafeCSS as rn}from"../lit-all.min.js";var nn=zo`
    #header,
    #resultText,
    #footer {
        grid-column: 1 / -1;
        justify-self: stretch;
        color: var(--merch-color-grey-80);
    }

    sp-theme {
        display: contents;
    }

    sp-action-menu {
      z-index: 1;
    }

    #header {
        order: -2;
        display: grid;
        justify-items: top;
        grid-template-columns: auto max-content;
        grid-template-rows: auto;
        row-gap: var(--consonant-merch-spacing-m);
        align-self: baseline;
    }

    #resultText {
        min-height: 32px;
    }

    merch-search {
        display: contents;
    }

    #searchBar {
        grid-column: 1 / -1;
        width: 100%;
        max-width: 302px;
    }

    #filtersButton {
        width: 92px;
        margin-inline-end: var(--consonant-merch-spacing-xxs);
    }

    #sortButton {
        justify-self: end;
    }

    sp-action-button {
        align-self: baseline;
    }

    sp-menu sp-action-button {
        min-width: 140px;
    }

    sp-menu {
        min-width: 180px;
    }

    #footer {
        order: 1000;
    }

    /* tablets */
    @media screen and ${rn(k)} {
        #header {
            grid-template-columns: 1fr fit-content(100%) fit-content(100%);
        }

        #searchBar {
            grid-column: 1;
        }

        #filtersButton {
            grid-column: 2;
        }

        #sortButton {
            grid-column: 3;
        }
    }

    /* Laptop */
    @media screen and ${rn(L)} {
        #resultText {
            grid-column: span 2;
            order: -3;
        }

        #header {
            grid-column: 3 / -1;
            display: flex;
            justify-content: end;
        }
    }
`;var an="tacocat.js";var zr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),on=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function R(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=Ge(i)?i:e;a=o.get(s)}if(n&&a==null){let o=Ge(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=jo(Ge(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var Vo=e=>typeof e=="boolean",kt=e=>typeof e=="function",Dt=e=>typeof e=="number",sn=e=>e!=null&&typeof e=="object";var Ge=e=>typeof e=="string",cn=e=>Ge(e)&&e,nt=e=>Dt(e)&&Number.isFinite(e)&&e>0;function Bt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function x(e,t){if(Vo(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function at(e,t,r){let i=Object.values(t);return i.find(n=>zr(n,e))??r??i[0]}function jo(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function ln(e,t=1){return Dt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Yo=Date.now(),Vr=()=>`(+${Date.now()-Yo}ms)`,Ut=new Set,qo=x(R("tacocat.debug",{},{metadata:!1}),!1);function hn(e){let t=`[${an}/${e}]`,r=(o,s,...l)=>o?!0:(n(s,...l),!1),i=qo?(o,...s)=>{console.debug(`${t} ${o}`,...s,Vr())}:()=>{},n=(o,...s)=>{let l=`${t} ${o}`;Ut.forEach(([c])=>c(l,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let l=`${t} ${o}`;Ut.forEach(([,c])=>c(l,...s))}}}function Wo(e,t){let r=[e,t];return Ut.add(r),()=>{Ut.delete(r)}}Wo((e,...t)=>{console.error(e,...t,Vr())},(e,...t)=>{console.warn(e,...t,Vr())});var Xo="no promo",dn="promo-tag",Ko="yellow",Qo="neutral",Zo=(e,t,r)=>{let i=a=>a||Xo,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},Jo="cancel-context",Ft=(e,t)=>{let r=e===Jo,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?dn:`${dn} no-promo`,text:Zo(o,t,n),variant:a?Ko:Qo,isOverriden:n}};var jr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(jr||(jr={}));var K;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(K||(K={}));var te;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(te||(te={}));var Yr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Yr||(Yr={}));var qr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(qr||(qr={}));var Wr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Wr||(Wr={}));var Xr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Xr||(Xr={}));var Kr="ABM",Qr="PUF",Zr="M2M",Jr="PERPETUAL",ei="P3Y",es="TAX_INCLUSIVE_DETAILS",ts="TAX_EXCLUSIVE",pn={ABM:Kr,PUF:Qr,M2M:Zr,PERPETUAL:Jr,P3Y:ei},Yh={[Kr]:{commitment:K.YEAR,term:te.MONTHLY},[Qr]:{commitment:K.YEAR,term:te.ANNUAL},[Zr]:{commitment:K.MONTH,term:te.MONTHLY},[Jr]:{commitment:K.PERPETUAL,term:void 0},[ei]:{commitment:K.THREE_MONTHS,term:te.P3Y}},mn="Value is not an offer",Gt=e=>{if(typeof e!="object")return mn;let{commitment:t,term:r}=e,i=rs(t,r);return{...e,planType:i}};var rs=(e,t)=>{switch(e){case void 0:return mn;case"":return"";case K.YEAR:return t===te.MONTHLY?Kr:t===te.ANNUAL?Qr:"";case K.MONTH:return t===te.MONTHLY?Zr:"";case K.PERPETUAL:return Jr;case K.TERM_LICENSE:return t===te.P3Y?ei:"";default:return""}};function un(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==es)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:ts}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var is="mas-commerce-service",ns={requestId:Je,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function ot(e,{country:t,forceTaxExclusive:r,perpetual:i}){let n;if(e.length<2)n=e;else{let a=t==="GB"?"EN":"MULT";e.sort((o,s)=>o.language===a?-1:s.language===a?1:0),e.sort((o,s)=>!o.term&&s.term?-1:o.term&&!s.term?1:0),n=[e[0]]}return r&&(n=n.map(un)),n}var $t=e=>window.setTimeout(e);function $e(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(ln).filter(nt);return r.length||(r=[t]),r}function zt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(cn)}function $(){return document.getElementsByTagName(is)?.[0]}function fn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,n]of Object.entries(ns)){let a=r.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[i]=a)}return t}var we={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},gn=1e3;function as(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function xn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!we.serializableTypes.includes(r))return r}return e}function os(e,t){if(!we.ignoredProperties.includes(e))return xn(t)}var ti={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(c=>{c!=null&&(as(c)?i:n).push(c)}),i.length&&(a+=" "+i.map(xn).join(" "));let{pathname:o,search:s}=window.location,l=`${we.delimiter}page=${o}${s}`;l.length>gn&&(l=`${l.slice(0,gn)}<trunc>`),a+=l,n.length&&(a+=`${we.delimiter}facts=`,a+=JSON.stringify(n,os)),window.lana?.log(a,we)}};function Vt(e){Object.assign(we,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in we&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var vn={LOCAL:"local",PROD:"prod",STAGE:"stage"},ri={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},ii=new Set,ni=new Set,bn=new Map,En={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},yn={filter:({level:e})=>e!==ri.DEBUG},ss={filter:()=>!1};function cs(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&kt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:performance.now().toFixed(3)}}function ls(e){[...ni].every(t=>t(e))&&ii.forEach(t=>t(e))}function Sn(e){let t=(bn.get(e)??0)+1;bn.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>Sn(`${i.namespace}/${n}`),updateConfig:Vt};return Object.values(ri).forEach(n=>{i[n]=(a,...o)=>ls(cs(n,a,e,o,r))}),Object.seal(i)}function jt(...e){e.forEach(t=>{let{append:r,filter:i}=t;kt(i)&&ni.add(i),kt(r)&&ii.add(r)})}function hs(e={}){let{name:t}=e,r=x(R("commerce.debug",{search:!0,storage:!0}),t===vn.LOCAL);return jt(r?En:yn),t===vn.PROD&&jt(ti),re}function ds(){ii.clear(),ni.clear()}var re={...Sn(Tr),Level:ri,Plugins:{consoleAppender:En,debugFilter:yn,quietFilter:ss,lanaAppender:ti},init:hs,reset:ds,use:jt};var ze=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let n=r.response.headers?.get(Je);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,n])=>`${i}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var ps={[ne]:xr,[ge]:vr,[le]:br},ms={[ne]:Sr,[le]:wr},st,Ve=class{constructor(t){V(this,st);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",ge);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=re.module("mas-element")}update(){[ne,ge,le].forEach(t=>{this.wrapperElement.classList.toggle(ps[t],t===this.state)})}notify(){(this.state===le||this.state===ne)&&(this.state===le?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===ne&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof ze&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(ms[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){Z(this,st,$()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return le===i?Promise.resolve(this.wrapperElement):ne===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=le,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),$t(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=ne,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...C(this,st)?.duration}),$t(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=ge,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!$()||this.timer)return;let{error:r,options:i,state:n,value:a,version:o}=this;this.state=ge,this.timer=$t(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===ge&&this.version===o&&(this.state=n,this.error=r,this.value=a,this.update(),this.notify())}catch(l){this.toggleFailed(this.version,l,i)}})}};st=new WeakMap;function wn(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Yt(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,wn(t)),n}function qt(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,wn(t)),e):null}var Tn="download",An="upgrade",_n={e:"EDU",t:"TEAM"};function Pn(e,t={},r=""){let i=$();if(!i)return null;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:m,quantity:p,wcsOsi:d,extraOptions:u,analyticsId:f}=i.collectCheckoutOptions(t),b=Yt(e,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:m,quantity:p,wcsOsi:d,extraOptions:u,analyticsId:f});return r&&(b.innerHTML=`<span style="pointer-events: none;">${r}</span>`),b}function Cn(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Ve(this))}attributeChangedCallback(i,n,a){this.masElement.attributeChangedCallback(i,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return _n[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return _n[i]??i}get is3in1Modal(){return Object.values(Se).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let n=$();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(m=>{m&&(this.dataset.imsCountry=m)}),i.imsCountry=null;let a=n.collectCheckoutOptions(i,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(m){this.masElement.log?.error("cannot parse exta checkout options",m)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let l=n.resolveOfferSelectors(a),c=await Promise.all(l);c=c.map(m=>ot(m,a)),a.country=this.dataset.imsCountry||a.country;let h=await n.buildCheckoutAction?.(c.flat(),{...o,...a},this);return this.renderOffers(c.flat(),a,{},h,s)}renderOffers(i,n,a={},o=void 0,s=void 0){let l=$();if(!l)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"{}"),...n,...a},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(Tn,An),this.masElement.toggleResolved(s,i,n);let{url:h,text:m,className:p,handler:d}=o;h&&this.setCheckoutUrl(h),m&&(this.firstElementChild.innerHTML=m),p&&this.classList.add(...p.split(" ")),d&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=d.bind(this))}if(i.length){if(this.masElement.toggleResolved(s,i,n)){if(!this.classList.contains(Tn)&&!this.classList.contains(An)){let h=l.buildCheckoutURL(i,n);this.setCheckoutUrl(n.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let n=$();if(!n)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:m,promotionCode:p,quantity:d,wcsOsi:u}=n.collectCheckoutOptions(i);return qt(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:m,promotionCode:p,quantity:d,wcsOsi:u}),!0}}}var ct=class ct extends Cn(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Pn(ct,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(ct,"is","checkout-link"),g(ct,"tag","a");var he=ct;window.customElements.get(he.is)||window.customElements.define(he.is,he,{extends:he.tag});var us="p_draft_landscape",fs="/store/",gs=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),ai=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),xs=["env","workflowStep","clientId","country"],Ln=e=>gs.get(e)??e;function oi(e,t,r){for(let[i,n]of Object.entries(e)){let a=Ln(i);n!=null&&r.has(a)&&t.set(a,n)}}function vs(e){switch(e){case Mr.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function bs(e,t){for(let r in e){let i=e[r];for(let[n,a]of Object.entries(i)){if(a==null)continue;let o=Ln(n);t.set(`items[${r}][${o}]`,a)}}}function Es({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===Se.CRM?"creative":"mini_plans"),e}function Mn(e){ys(e);let{env:t,items:r,workflowStep:i,marketSegment:n,customerSegment:a,offerType:o,productArrangementCode:s,landscape:l,modal:c,is3in1:h,preselectPlan:m,...p}=e,d=new URL(vs(t));if(d.pathname=`${fs}${i}`,i!==j.SEGMENTATION&&i!==j.CHANGE_PLAN_TEAM_PLANS&&bs(r,d.searchParams),oi({...p},d.searchParams,ai),l===xe.DRAFT&&oi({af:us},d.searchParams,ai),i===j.SEGMENTATION){let u={marketSegment:n,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(f=>f.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};m?.toLowerCase()==="edu"?d.searchParams.set("ms","EDU"):m?.toLowerCase()==="team"&&d.searchParams.set("cs","TEAM"),oi(u,d.searchParams,ai),d.searchParams.get("ot")==="PROMOTION"&&d.searchParams.delete("ot"),d=Es({url:d,modal:c,is3in1:h})}return d.toString()}function ys(e){for(let t of xs)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==j.SEGMENTATION&&e.workflowStep!==j.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var A=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:j.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!0,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:ce.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:xe.PUBLISHED});function Rn({settings:e,providers:t}){function r(a,o){let{checkoutClientId:s,checkoutWorkflowStep:l,country:c,language:h,promotionCode:m,quantity:p,preselectPlan:d,env:u}=e,f={checkoutClientId:s,checkoutWorkflowStep:l,country:c,language:h,promotionCode:m,quantity:p,preselectPlan:d,env:u};if(o)for(let Pe of t.checkout)Pe(o,f);let{checkoutMarketSegment:b,checkoutWorkflowStep:_=l,imsCountry:y,country:E=y??c,language:T=h,quantity:P=p,entitlement:O,upgrade:B,modal:z,perpetual:H,promotionCode:M=m,wcsOsi:F,extraOptions:Q,...ue}=Object.assign(f,o?.dataset??{},a??{}),se=at(_,j,A.checkoutWorkflowStep);return f=Bt({...ue,extraOptions:Q,checkoutClientId:s,checkoutMarketSegment:b,country:E,quantity:$e(P,A.quantity),checkoutWorkflowStep:se,language:T,entitlement:x(O),upgrade:x(B),modal:z,perpetual:x(H),promotionCode:Ft(M).effectivePromoCode,wcsOsi:zt(F),preselectPlan:d}),f}function i(a,o){if(!Array.isArray(a)||!a.length||!o)return"";let{env:s,landscape:l}=e,{checkoutClientId:c,checkoutMarketSegment:h,checkoutWorkflowStep:m,country:p,promotionCode:d,quantity:u,preselectPlan:f,ms:b,cs:_,...y}=r(o),E=document.querySelector("meta[name=mas-ff-3in1]"),T=Object.values(Se).includes(o.modal)&&(!E||E.content!=="off"),P=window.frameElement||T?"if":"fp",[{productArrangementCode:O,marketSegments:[B],customerSegment:z,offerType:H}]=a,M=b??B??h,F=_??z;f?.toLowerCase()==="edu"?M="EDU":f?.toLowerCase()==="team"&&(F="TEAM");let Q={is3in1:T,checkoutPromoCode:d,clientId:c,context:P,country:p,env:s,items:[],marketSegment:M,customerSegment:F,offerType:H,productArrangementCode:O,workflowStep:m,landscape:l,...y},ue=u[0]>1?u[0]:void 0;if(a.length===1){let{offerId:se}=a[0];Q.items.push({id:se,quantity:ue})}else Q.items.push(...a.map(({offerId:se,productArrangementCode:Pe})=>({id:se,quantity:ue,...T?{productArrangementCode:Pe}:{}})));return Mn(Q)}let{createCheckoutLink:n}=he;return{CheckoutLink:he,CheckoutWorkflowStep:j,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:n}}function Ss({interval:e=200,maxAttempts:t=25}={}){let r=re.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function ws(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Ts(e){let t=re.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function Nn({}){let e=Ss(),t=ws(e),r=Ts(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var On=window.masPriceLiterals;function In(e){if(Array.isArray(On)){let t=i=>On.find(n=>zr(n.lang,i)),r=t(e.language)??t(A.language);if(r)return Object.freeze(r)}return{}}var si=function(e,t){return si=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},si(e,t)};function lt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");si(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var S=function(){return S=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},S.apply(this,arguments)};function Wt(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var N;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(N||(N={}));var Te;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Te||(Te={}));function ci(e){return e.type===N.literal}function Hn(e){return e.type===N.argument}function Xt(e){return e.type===N.number}function Kt(e){return e.type===N.date}function Qt(e){return e.type===N.time}function Zt(e){return e.type===N.select}function Jt(e){return e.type===N.plural}function kn(e){return e.type===N.pound}function er(e){return e.type===N.tag}function tr(e){return!!(e&&typeof e=="object"&&e.type===Te.number)}function ht(e){return!!(e&&typeof e=="object"&&e.type===Te.dateTime)}var li=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var As=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Dn(e){var t={};return e.replace(As,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Bn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function $n(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Bn).filter(function(p){return p.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],l=o.slice(1),c=0,h=l;c<h.length;c++){var m=h[c];if(m.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:l})}return r}function _s(e){return e.replace(/^(.*?)-/,"")}var Un=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,zn=/^(@+)?(\+|#+)?[rs]?$/g,Ps=/(\*)(0+)|(#+)(0+)|(0+)/g,Vn=/^(0+)$/;function Fn(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(zn,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function jn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Cs(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Vn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Gn(e){var t={},r=jn(e);return r||t}function Yn(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=_s(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=S(S(S({},t),{notation:"scientific"}),n.options.reduce(function(l,c){return S(S({},l),Gn(c))},{}));continue;case"engineering":t=S(S(S({},t),{notation:"engineering"}),n.options.reduce(function(l,c){return S(S({},l),Gn(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(Ps,function(l,c,h,m,p,d){if(c)t.minimumIntegerDigits=h.length;else{if(m&&p)throw new Error("We currently do not support maximum integer digits");if(d)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Vn.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(Un.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(Un,function(l,c,h,m,p,d){return h==="*"?t.minimumFractionDigits=c.length:m&&m[0]==="#"?t.maximumFractionDigits=m.length:p&&d?(t.minimumFractionDigits=p.length,t.maximumFractionDigits=p.length+d.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""});var a=n.options[0];a==="w"?t=S(S({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=S(S({},t),Fn(a)));continue}if(zn.test(n.stem)){t=S(S({},t),Fn(n.stem));continue}var o=jn(n.stem);o&&(t=S(S({},t),o));var s=Cs(n.stem);s&&(t=S(S({},t),s))}return t}var dt={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function qn(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),l="a",c=Ls(t);for((c=="H"||c=="k")&&(s=0);s-- >0;)r+=l;for(;o-- >0;)r=c+r}else n==="J"?r+="H":r+=n}return r}function Ls(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=dt[i||""]||dt[r||""]||dt["".concat(r,"-001")]||dt["001"];return n[0]}var hi,Ms=new RegExp("^".concat(li.source,"*")),Rs=new RegExp("".concat(li.source,"*$"));function w(e,t){return{start:e,end:t}}var Ns=!!String.prototype.startsWith,Os=!!String.fromCodePoint,Is=!!Object.fromEntries,Hs=!!String.prototype.codePointAt,ks=!!String.prototype.trimStart,Ds=!!String.prototype.trimEnd,Bs=!!Number.isSafeInteger,Us=Bs?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},pi=!0;try{Wn=Zn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),pi=((hi=Wn.exec("a"))===null||hi===void 0?void 0:hi[0])==="a"}catch{pi=!1}var Wn,Xn=Ns?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},mi=Os?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},Kn=Is?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},Qn=Hs?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},Fs=ks?function(t){return t.trimStart()}:function(t){return t.replace(Ms,"")},Gs=Ds?function(t){return t.trimEnd()}:function(t){return t.replace(Rs,"")};function Zn(e,t){return new RegExp(e,t)}var ui;pi?(di=Zn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),ui=function(t,r){var i;di.lastIndex=r;var n=di.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):ui=function(t,r){for(var i=[];;){var n=Qn(t,r);if(n===void 0||ea(n)||Vs(n))break;i.push(n),r+=n>=65536?2:1}return mi.apply(void 0,i)};var di,Jn=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:N.pound,location:w(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(v.UNMATCHED_CLOSING_TAG,w(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&fi(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:N.literal,value:"<".concat(n,"/>"),location:w(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!fi(this.char()))return this.error(v.INVALID_TAG,w(s,this.clonePosition()));var l=this.clonePosition(),c=this.parseTagName();return n!==c?this.error(v.UNMATCHED_CLOSING_TAG,w(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:N.tag,value:n,children:o,location:w(i,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,w(s,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,w(i,this.clonePosition()))}else return this.error(v.INVALID_TAG,w(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&zs(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var l=w(i,this.clonePosition());return{val:{type:N.literal,value:n,location:l},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!$s(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return mi.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),mi(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,w(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,w(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(v.MALFORMED_ARGUMENT,w(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,w(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:N.argument,value:n,location:w(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,w(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(v.MALFORMED_ARGUMENT,w(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=ui(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=w(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(s){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,w(o,l));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var p=Gs(m.val);if(p.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,w(this.clonePosition(),this.clonePosition()));var d=w(h,this.clonePosition());c={style:p,styleLocation:d}}var u=this.tryParseArgumentClose(n);if(u.err)return u;var f=w(n,this.clonePosition());if(c&&Xn(c?.style,"::",0)){var b=Fs(c.style.slice(2));if(s==="number"){var m=this.parseNumberSkeletonFromString(b,c.styleLocation);return m.err?m:{val:{type:N.number,value:i,location:f,style:m.val},err:null}}else{if(b.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,f);var _=b;this.locale&&(_=qn(b,this.locale));var p={type:Te.dateTime,pattern:_,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?Dn(_):{}},y=s==="date"?N.date:N.time;return{val:{type:y,value:i,location:f,style:p},err:null}}}return{val:{type:s==="number"?N.number:s==="date"?N.date:N.time,value:i,location:f,style:(a=c?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var E=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,w(E,S({},E)));this.bumpSpace();var T=this.parseIdentifierIfPossible(),P=0;if(s!=="select"&&T.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,w(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),T=this.parseIdentifierIfPossible(),P=m.val}var O=this.tryParsePluralOrSelectOptions(t,s,r,T);if(O.err)return O;var u=this.tryParseArgumentClose(n);if(u.err)return u;var B=w(n,this.clonePosition());return s==="select"?{val:{type:N.select,value:i,options:Kn(O.val),location:B},err:null}:{val:{type:N.plural,value:i,options:Kn(O.val),offset:P,pluralType:s==="plural"?"cardinal":"ordinal",location:B},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,w(o,l))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,w(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,w(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=$n(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:Te.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?Yn(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],l=new Set,c=n.value,h=n.location;;){if(c.length===0){var m=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var p=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(p.err)return p;h=w(m,this.clonePosition()),c=this.message.slice(m.offset,this.offset())}else break}if(l.has(c))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);c==="other"&&(o=!0),this.bumpSpace();var d=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,w(this.clonePosition(),this.clonePosition()));var u=this.parseMessage(t+1,r,i);if(u.err)return u;var f=this.tryParseArgumentClose(d);if(f.err)return f;s.push([c,{value:u.val,location:w(d,this.clonePosition())}]),l.add(c),this.bumpSpace(),a=this.parseIdentifierIfPossible(),c=a.value,h=a.location}return s.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,w(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(v.MISSING_OTHER_CLAUSE,w(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var l=w(n,this.clonePosition());return a?(o*=i,Us(o)?{val:o,err:null}:this.error(r,l)):this.error(t,l)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Qn(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Xn(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&ea(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function fi(e){return e>=97&&e<=122||e>=65&&e<=90}function $s(e){return fi(e)||e===47}function zs(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function ea(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Vs(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function gi(e){e.forEach(function(t){if(delete t.location,Zt(t)||Jt(t))for(var r in t.options)delete t.options[r].location,gi(t.options[r].value);else Xt(t)&&tr(t.style)||(Kt(t)||Qt(t))&&ht(t.style)?delete t.style.location:er(t)&&gi(t.children)})}function ta(e,t){t===void 0&&(t={}),t=S({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Jn(e,t).parse();if(r.err){var i=SyntaxError(v[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||gi(r.val),r.val}function pt(e,t){var r=t&&t.cache?t.cache:Ks,i=t&&t.serializer?t.serializer:Xs,n=t&&t.strategy?t.strategy:Ys;return n(e,{cache:r,serializer:i})}function js(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ra(e,t,r,i){var n=js(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function ia(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function xi(e,t,r,i,n){return r.bind(t,e,i,n)}function Ys(e,t){var r=e.length===1?ra:ia;return xi(e,this,r,t.cache.create(),t.serializer)}function qs(e,t){return xi(e,this,ia,t.cache.create(),t.serializer)}function Ws(e,t){return xi(e,this,ra,t.cache.create(),t.serializer)}var Xs=function(){return JSON.stringify(arguments)};function vi(){this.cache=Object.create(null)}vi.prototype.get=function(e){return this.cache[e]};vi.prototype.set=function(e,t){this.cache[e]=t};var Ks={create:function(){return new vi}},rr={variadic:qs,monadic:Ws};var Ae;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Ae||(Ae={}));var mt=function(e){lt(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var bi=function(e){lt(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Ae.INVALID_VALUE,a)||this}return t}(mt);var na=function(e){lt(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Ae.INVALID_VALUE,n)||this}return t}(mt);var aa=function(e){lt(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Ae.MISSING_VALUE,i)||this}return t}(mt);var G;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(G||(G={}));function Qs(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==G.literal||r.type!==G.literal?t.push(r):i.value+=r.value,t},[])}function Zs(e){return typeof e=="function"}function ut(e,t,r,i,n,a,o){if(e.length===1&&ci(e[0]))return[{type:G.literal,value:e[0].value}];for(var s=[],l=0,c=e;l<c.length;l++){var h=c[l];if(ci(h)){s.push({type:G.literal,value:h.value});continue}if(kn(h)){typeof a=="number"&&s.push({type:G.literal,value:r.getNumberFormat(t).format(a)});continue}var m=h.value;if(!(n&&m in n))throw new aa(m,o);var p=n[m];if(Hn(h)){(!p||typeof p=="string"||typeof p=="number")&&(p=typeof p=="string"||typeof p=="number"?String(p):""),s.push({type:typeof p=="string"?G.literal:G.object,value:p});continue}if(Kt(h)){var d=typeof h.style=="string"?i.date[h.style]:ht(h.style)?h.style.parsedOptions:void 0;s.push({type:G.literal,value:r.getDateTimeFormat(t,d).format(p)});continue}if(Qt(h)){var d=typeof h.style=="string"?i.time[h.style]:ht(h.style)?h.style.parsedOptions:i.time.medium;s.push({type:G.literal,value:r.getDateTimeFormat(t,d).format(p)});continue}if(Xt(h)){var d=typeof h.style=="string"?i.number[h.style]:tr(h.style)?h.style.parsedOptions:void 0;d&&d.scale&&(p=p*(d.scale||1)),s.push({type:G.literal,value:r.getNumberFormat(t,d).format(p)});continue}if(er(h)){var u=h.children,f=h.value,b=n[f];if(!Zs(b))throw new na(f,"function",o);var _=ut(u,t,r,i,n,a),y=b(_.map(function(P){return P.value}));Array.isArray(y)||(y=[y]),s.push.apply(s,y.map(function(P){return{type:typeof P=="string"?G.literal:G.object,value:P}}))}if(Zt(h)){var E=h.options[p]||h.options.other;if(!E)throw new bi(h.value,p,Object.keys(h.options),o);s.push.apply(s,ut(E.value,t,r,i,n));continue}if(Jt(h)){var E=h.options["=".concat(p)];if(!E){if(!Intl.PluralRules)throw new mt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Ae.MISSING_INTL_API,o);var T=r.getPluralRules(t,{type:h.pluralType}).select(p-(h.offset||0));E=h.options[T]||h.options.other}if(!E)throw new bi(h.value,p,Object.keys(h.options),o);s.push.apply(s,ut(E.value,t,r,i,n,p-(h.offset||0)));continue}}return Qs(s)}function Js(e,t){return t?S(S(S({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=S(S({},e[i]),t[i]||{}),r},{})):e}function ec(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=Js(e[i],t[i]),r},S({},e)):e}function Ei(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function tc(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:pt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,Wt([void 0],r,!1)))},{cache:Ei(e.number),strategy:rr.variadic}),getDateTimeFormat:pt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,Wt([void 0],r,!1)))},{cache:Ei(e.dateTime),strategy:rr.variadic}),getPluralRules:pt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,Wt([void 0],r,!1)))},{cache:Ei(e.pluralRules),strategy:rr.variadic})}}var oa=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var l=s.reduce(function(c,h){return!c.length||h.type!==G.literal||typeof c[c.length-1]!="string"?c.push(h.value):c[c.length-1]+=h.value,c},[]);return l.length<=1?l[0]||"":l},this.formatToParts=function(o){return ut(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=ec(e.formats,i),this.formatters=n&&n.formatters||tc(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=ta,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var sa=oa;var rc=/[0-9\-+#]/,ic=/[^\d\-+#]/g;function ca(e){return e.search(rc)}function nc(e="#.##"){let t={},r=e.length,i=ca(e);t.prefix=i>0?e.substring(0,i):"";let n=ca(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let l=t.mask.match(ic);return t.decimal=l&&l[l.length-1]||".",t.separator=l&&l[1]&&l[0]||",",l=t.mask.split(t.decimal),t.integer=l[0],t.fraction=l[1],t}function ac(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,oc(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function oc(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let l=0;l<o;l++)e.result+=e.integer.charAt(l),!((l-s+1)%a)&&l<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function sc(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=nc(e),n=ac(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var la=sc;var ha=".",cc=",",pa=/^\s+/,ma=/\s+$/,da="&nbsp;",yi=e=>e*12,ua=(e,t)=>{let{start:r,end:i,displaySummary:{amount:n,duration:a,minProductQuantity:o,outcomeType:s}={}}=e;if(!(n&&a&&s&&o))return!1;let l=t?new Date(t):new Date;if(!r||!i)return!1;let c=new Date(r),h=new Date(i);return l>=c&&l<=h},_e={MONTH:"MONTH",YEAR:"YEAR"},lc={[J.ANNUAL]:12,[J.MONTHLY]:1,[J.THREE_YEARS]:36,[J.TWO_YEARS]:24},Si=(e,t)=>({accept:e,round:t}),hc=[Si(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),Si(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),Si(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],wi={[ye.YEAR]:{[J.MONTHLY]:_e.MONTH,[J.ANNUAL]:_e.YEAR},[ye.MONTH]:{[J.MONTHLY]:_e.MONTH}},dc=(e,t)=>e.indexOf(`'${t}'`)===0,pc=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=ga(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+uc(e)),r},mc=e=>{let t=fc(e),r=dc(e,t),i=e.replace(/'.*?'/,""),n=pa.test(i)||ma.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},fa=e=>e.replace(pa,da).replace(ma,da),uc=e=>e.match(/#(.?)#/)?.[1]===ha?cc:ha,fc=e=>e.match(/'(.*?)'/)?.[1]??"",ga=e=>e.match(/0(.?)0/)?.[1]??"";function je({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:l}=mc(e),c=r?ga(e):"",h=pc(e,r),m=r?2:0,p=a(t,{currencySymbol:o}),d=i?p.toLocaleString("hi-IN",{minimumFractionDigits:m,maximumFractionDigits:m}):la(h,p),u=r?d.lastIndexOf(c):d.length,f=d.substring(0,u),b=d.substring(u+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,d).replace(/SYMBOL/,o),currencySymbol:o,decimals:b,decimalsDelimiter:c,hasCurrencySpace:l,integer:f,isCurrencyFirst:s,recurrenceTerm:n}}var xa=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=lc[r]??1;return je(e,n>1?_e.MONTH:wi[t]?.[r],a=>{let o={divisor:n,price:a,usePrecision:i},{round:s}=hc.find(({accept:l})=>l(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},va=({commitment:e,term:t,...r})=>je(r,wi[e]?.[t]),ba=e=>{let{commitment:t,instant:r,price:i,originalPrice:n,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:l}=e;if(t===ye.YEAR&&l===J.MONTHLY){if(!o)return je(e,_e.YEAR,yi);let{displaySummary:{outcomeType:c,duration:h,minProductQuantity:m=1}={}}=o;switch(c){case"PERCENTAGE_DISCOUNT":if(s>=m&&ua(o,r)){let p=parseInt(h.replace("P","").replace("M",""));if(isNaN(p))return yi(i);let d=s*n*p,u=s*a*(12-p),f=Math.round((d+u)*100)/100;return je({...e,price:f},_e.YEAR)}default:return je(e,_e.YEAR,()=>yi(a??i))}}return je(e,wi[t]?.[l])};var Ti={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},gc=hn("ConsonantTemplates/price"),xc=/<\/?[^>]+(>|$)/g,D={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},be={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},Ai="TAX_EXCLUSIVE",vc=e=>sn(e)?Object.entries(e).filter(([,t])=>Ge(t)||Dt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+on(i)+'"'}`,""):"",U=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+D.disabled}"${vc(r)}>${i?fa(t):t??""}</span>`;function de(e,t,r,i){let n=e[r];if(n==null)return"";try{return new sa(n.replace(xc,""),t).format(i)}catch{return gc.error("Failed to format literal:",n),""}}function bc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:n,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:l,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:m},p={}){let d=U(D.currencySymbol,i),u=U(D.currencySpace,o?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),l&&(f+=d+u),f+=U(D.integer,s),f+=U(D.decimalsDelimiter,a),f+=U(D.decimals,n),l||(f+=u+d),f+=U(D.recurrence,c,null,!0),f+=U(D.unitType,h,null,!0),f+=U(D.taxInclusivity,m,!0),U(e,f,{...p})}var q=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:n=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:l=!1,displayTax:c=!1,language:h,literals:m={},quantity:p=1,space:d=!1}={},{commitment:u,offerSelectorIds:f,formatString:b,price:_,priceWithoutDiscount:y,taxDisplay:E,taxTerm:T,term:P,usePrecision:O,promotion:B}={},z={})=>{Object.entries({country:a,formatString:b,language:h,price:_}).forEach(([io,no])=>{if(no==null)throw new Error(`Argument "${io}" is missing for osi ${f?.toString()}, country ${a}, language ${h}`)});let H={...Ti,...m},M=`${h.toLowerCase()}-${a.toUpperCase()}`,F=r&&y?y:_,Q=t?xa:va;i&&(Q=ba);let{accessiblePrice:ue,recurrenceTerm:se,...Pe}=Q({commitment:u,formatString:b,instant:n,isIndianPrice:a==="IN",originalPrice:_,priceWithoutDiscount:y,price:t?_:F,promotion:B,quantity:p,term:P,usePrecision:O}),ar="",or="",sr="";x(s)&&se&&(sr=de(H,M,be.recurrenceLabel,{recurrenceTerm:se}));let yt="";x(l)&&(d&&(yt+=" "),yt+=de(H,M,be.perUnitLabel,{perUnit:"LICENSE"}));let St="";x(c)&&T&&(d&&(St+=" "),St+=de(H,M,E===Ai?be.taxExclusiveLabel:be.taxInclusiveLabel,{taxTerm:T})),r&&(ar=de(H,M,be.strikethroughAriaLabel,{strikethroughPrice:ar})),e&&(or=de(H,M,be.alternativePriceAriaLabel,{alternativePrice:or}));let Ce=D.container;if(t&&(Ce+=" "+D.containerOptical),r&&(Ce+=" "+D.containerStrikethrough),e&&(Ce+=" "+D.containerAlternative),i&&(Ce+=" "+D.containerAnnual),x(o))return bc(Ce,{...Pe,accessibleLabel:ar,altAccessibleLabel:or,recurrenceLabel:sr,perUnitLabel:yt,taxInclusivityLabel:St},z);let{currencySymbol:Mi,decimals:Za,decimalsDelimiter:Ja,hasCurrencySpace:Ri,integer:eo,isCurrencyFirst:to}=Pe,Le=[eo,Ja,Za];to?(Le.unshift(Ri?"\xA0":""),Le.unshift(Mi)):(Le.push(Ri?"\xA0":""),Le.push(Mi)),Le.push(sr,yt,St);let ro=Le.join("");return U(Ce,ro,z)},Ea=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||x(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${n?q({displayStrikethrough:!0})(e,t,r)+"&nbsp;":""}${q({isAlternativePrice:n})(e,t,r)}`},ya=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let n={...e,displayTax:!1,displayPerUnit:!1},o=(e.displayOldPrice===void 0||x(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?q({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${q({isAlternativePrice:o})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${q({displayAnnual:!0,instant:i})(n,t,r)}${U(D.containerAnnualSuffix,")")}`},Sa=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${q({isAlternativePrice:e.displayOldPrice})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${q({displayAnnual:!0})(i,t,r)}${U(D.containerAnnualSuffix,")")}`};var ft={...D,containerLegal:"price-legal",planType:"price-plan-type"},ir={...be,planTypeLabel:"planTypeLabel"};function Ec(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},n={}){let a="";return a+=U(ft.unitType,t,null,!0),r&&i&&(r+=". "),a+=U(ft.taxInclusivity,r,!0),a+=U(ft.planType,i,null),U(e,a,{...n})}var wa=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:n,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:l}={},c={})=>{let h={...Ti,...a},m=`${n.toLowerCase()}-${e.toUpperCase()}`,p="";x(t)&&(p=de(h,m,ir.perUnitLabel,{perUnit:"LICENSE"}));let d="";e==="US"&&n==="en"&&(r=!1),x(r)&&s&&(d=de(h,m,o===Ai?ir.taxExclusiveLabel:ir.taxInclusiveLabel,{taxTerm:s}));let u="";x(i)&&l&&(u=de(h,m,ir.planTypeLabel,{planType:l}));let f=ft.container;return f+=" "+ft.containerLegal,Ec(f,{perUnitLabel:p,taxInclusivityLabel:d,planTypeLabel:u},c)};var Ta=q(),Aa=Ea(),_a=q({displayOptical:!0}),Pa=q({displayStrikethrough:!0}),Ca=q({displayAnnual:!0}),La=q({displayOptical:!0,isAlternativePrice:!0}),Ma=q({isAlternativePrice:!0}),Ra=Sa(),Na=ya(),Oa=wa;var yc=(e,t)=>{if(!(!nt(e)||!nt(t)))return Math.floor((t-e)/t*100)},Ia=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=yc(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Ha=Ia();var Da="INDIVIDUAL_COM",_i="TEAM_COM",Ba="INDIVIDUAL_EDU",Pi="TEAM_EDU",ka=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Sc={[Da]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[_i]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[Ba]:["LT_lt","LV_lv","SA_en","SG_en"],[Pi]:["SG_en","KR_ko"]},wc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},Tc=[Da,_i,Ba,Pi],Ac=e=>[_i,Pi].includes(e),_c=(e,t,r,i)=>{let n=`${e}_${t}`,a=`${r}_${i}`,o=wc[n];if(o){let s=Tc.indexOf(a);return o[s]}return Ac(a)},Pc=(e,t,r,i)=>{let n=`${e}_${t}`;if(ka.includes(e)||ka.includes(n))return!0;let a=Sc[`${r}_${i}`];return a?a.includes(e)||a.includes(n)?!0:A.displayTax:A.displayTax},Cc=async(e,t,r,i)=>{let n=Pc(e,t,r,i);return{displayTax:n,forceTaxExclusive:n?_c(e,t,r,i):A.forceTaxExclusive}},gt=class gt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Ve(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let i=$();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:m,promotionCode:p,quantity:d,alternativePrice:u,template:f,wcsOsi:b}=i.collectPriceOptions(r);return Yt(gt,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:m,promotionCode:p,quantity:d,alternativePrice:u,template:f,wcsOsi:b})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===ne}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=$();if(!i)return!1;let n=i.collectPriceOptions(r,this),a={...i.settings,...n};if(!a.wcsOsi.length)return!1;if(i.featureFlags[ve]&&(n.displayTax===void 0||n.forceTaxExclusive===void 0)){let[l]=await i.resolveOfferSelectors(a),c=ot(await l,a);if(c?.length){let{country:h,language:m}=a,p=c[0],[d=""]=p.marketSegments,u=await Cc(h,m,p.customerSegment,d);n.displayTax===void 0&&(a.displayTax=u?.displayTax||a.displayTax),n.forceTaxExclusive===void 0&&(a.forceTaxExclusive=u?.forceTaxExclusive||a.forceTaxExclusive)}}let o=this.masElement.togglePending(a);this.innerHTML="";let[s]=i.resolveOfferSelectors(a);try{let l=await s;return this.renderOffers(ot(l,a),o)}catch(l){throw this.innerHTML="",l}}renderOffers(r,i=void 0){if(!this.isConnected)return;let n=$();if(!n)return!1;if(i??(i=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(i,r)){this.innerHTML=n.buildPriceHTML(r,this.options);let a=this.closest("p, h3, div");if(!a||!a.querySelector('span[data-template="strikethrough"]')||a.querySelector(".alt-aria-label"))return!0;let o=a?.querySelectorAll('span[is="inline-price"]');return o.length>1&&o.length===a.querySelectorAll('span[data-template="strikethrough"]').length*2&&o.forEach(s=>{s.dataset.template!=="strikethrough"&&s.options&&!s.options.alternativePrice&&!s.isFailed&&(s.options.alternativePrice=!0,s.innerHTML=n.buildPriceHTML(r,s.options))}),!0}}else{let a=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(i,a,this.options))return this.innerHTML="",!0}return!1}updateOptions(r){let i=$();if(!i)return!1;let{alternativePrice:n,displayOldPrice:a,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:m,quantity:p,template:d,wcsOsi:u}=i.collectPriceOptions(r);return qt(this,{alternativePrice:n,displayOldPrice:a,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:m,quantity:p,template:d,wcsOsi:u}),!0}};g(gt,"is","inline-price"),g(gt,"tag","span");var pe=gt;window.customElements.get(pe.is)||window.customElements.define(pe.is,pe,{extends:pe.tag});function Ua({literals:e,providers:t,settings:r}){function i(o,s=null){let l={country:r.country,language:r.language,locale:r.locale,literals:structuredClone(e.price)};if(s&&t?.price)for(let O of t.price)O(s,l);let{displayOldPrice:c,displayPerUnit:h,displayRecurrence:m,displayTax:p,displayPlanType:d,forceTaxExclusive:u,perpetual:f,displayAnnual:b,promotionCode:_,quantity:y,alternativePrice:E,wcsOsi:T,...P}=Object.assign(l,s?.dataset??{},o??{});return l=Bt(Object.assign({...l,...P,displayOldPrice:x(c),displayPerUnit:x(h),displayRecurrence:x(m),displayTax:x(p),displayPlanType:x(d),forceTaxExclusive:x(u),perpetual:x(f),displayAnnual:x(b),promotionCode:Ft(_).effectivePromoCode,quantity:$e(y,A.quantity),alternativePrice:x(E),wcsOsi:zt(T)})),l}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:l}=s,c;switch(l){case"discount":c=Ha;break;case"strikethrough":c=Pa;break;case"annual":c=Ca;break;case"legal":c=Oa;break;default:s.template==="optical"&&s.alternativePrice?c=La:s.template==="optical"?c=_a:s.displayAnnual&&o[0].planType==="ABM"?c=s.promotionCode?Na:Ra:s.alternativePrice?c=Ma:c=s.promotionCode?Aa:Ta}let[h]=o;return h={...h,...h.priceDetails},c({...r,...s},h)}let a=pe.createInlinePrice;return{InlinePrice:pe,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function Lc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||A.language),t??(t=e?.split("_")?.[1]||A.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Fa(e={},t){let r=t.featureFlags[ve],{commerce:i={}}=e,n=ce.PRODUCTION,a=Cr,o=R("checkoutClientId",i)??A.checkoutClientId,s=at(R("checkoutWorkflowStep",i),j,A.checkoutWorkflowStep),l=x(R("displayOldPrice",i),r?A.displayOldPrice:!A.displayOldPrice),c=x(R("displayPerUnit",i),r?A.displayPerUnit:!A.displayPerUnit),h=x(R("displayRecurrence",i),A.displayRecurrence),m=x(R("displayTax",i),A.displayTax),p=x(R("displayPlanType",i),A.displayPlanType),d=x(R("entitlement",i),A.entitlement),u=x(R("modal",i),A.modal),f=x(R("forceTaxExclusive",i),A.forceTaxExclusive),b=R("promotionCode",i)??A.promotionCode,_=$e(R("quantity",i)),y=R("wcsApiKey",i)??A.wcsApiKey,E=i?.env==="stage",T=xe.PUBLISHED;["true",""].includes(i.allowOverride)&&(E=(R(_r,i,{metadata:!1})?.toLowerCase()??i?.env)==="stage",T=at(R(Pr,i),xe,T)),E&&(n=ce.STAGE,a=Lr);let O=R(Ar)??e.preview,B=typeof O<"u"&&O!=="off"&&O!=="false",z={};B&&(z={preview:B});let H=R("mas-io-url")??e.masIOUrl??`https://www${n===ce.STAGE?".stage":""}.adobe.com/mas/io`,M=R("preselect-plan")??void 0;return{...Lc(e),...z,displayOldPrice:l,checkoutClientId:o,checkoutWorkflowStep:s,displayPerUnit:c,displayRecurrence:h,displayTax:m,displayPlanType:p,entitlement:d,extraOptions:A.extraOptions,modal:u,env:n,forceTaxExclusive:f,promotionCode:b,quantity:_,alternativePrice:A.alternativePrice,wcsApiKey:y,wcsURL:a,landscape:T,masIOUrl:H,...M&&{preselectPlan:M}}}async function Ga(e,t={},r=2,i=100){let n;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(n=o,n.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,i*(a+1)))}throw n}var Ci="wcs";function $a({settings:e}){let t=re.module(Ci),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o,s=new Map;async function l(d,u,f=!0){let b=$(),_=yr;t.debug("Fetching:",d);let y="",E;if(d.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let T=new Map(u),[P]=d.offerSelectorIds,O=Date.now()+Math.random().toString(36).substring(2,7),B=`${Ci}:${P}:${O}${Rr}`,z=`${Ci}:${P}:${O}${Nr}`,H;try{if(performance.mark(B),y=new URL(e.wcsURL),y.searchParams.set("offer_selector_ids",P),y.searchParams.set("country",d.country),y.searchParams.set("locale",d.locale),y.searchParams.set("landscape",r===ce.STAGE?"ALL":e.landscape),y.searchParams.set("api_key",i),d.language&&y.searchParams.set("language",d.language),d.promotionCode&&y.searchParams.set("promotion_code",d.promotionCode),d.currency&&y.searchParams.set("currency",d.currency),E=await Ga(y.toString(),{credentials:"omit"}),E.ok){let M=[];try{let F=await E.json();t.debug("Fetched:",d,F),M=F.resolvedOffers??[]}catch(F){t.error(`Error parsing JSON: ${F.message}`,{...F.context,...b?.duration})}M=M.map(Gt),u.forEach(({resolve:F},Q)=>{let ue=M.filter(({offerSelectorIds:se})=>se.includes(Q)).flat();ue.length&&(T.delete(Q),u.delete(Q),F(ue))})}else _=Er}catch(M){_=`Network error: ${M.message}`}finally{H=performance.measure(z,B),performance.clearMarks(B),performance.clearMeasures(z)}if(f&&u.size){t.debug("Missing:",{offerSelectorIds:[...u.keys()]});let M=fn(E);u.forEach(F=>{F.reject(new ze(_,{...d,...M,response:E,measure:Rt(H),...b?.duration}))})}}function c(){clearTimeout(o);let d=[...a.values()];a.clear(),d.forEach(({options:u,promises:f})=>l(u,f))}function h(d){if(!d||typeof d!="object")throw new TypeError("Cache must be a Map or similar object");let u=r===ce.STAGE?"stage":"prod",f=d[u];if(!f||typeof f!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[b,_]of Object.entries(f))n.set(b,Promise.resolve(_.map(Gt)));t.debug(`Prefilled WCS cache with ${f.size} entries`)}function m(){let d=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${d} cache entries to stale cache`)}function p({country:d,language:u,perpetual:f=!1,promotionCode:b="",wcsOsi:_=[]}){let y=`${u}_${d}`;d!=="GB"&&!f&&(u="MULT");let E=[d,u,b].filter(T=>T).join("-").toLowerCase();return _.map(T=>{let P=`${T}-${E}`;if(n.has(P))return n.get(P);let O=new Promise((B,z)=>{let H=a.get(E);if(!H){let M={country:d,locale:y,offerSelectorIds:[]};d!=="GB"&&!f&&(M.language=u),H={options:M,promises:new Map},a.set(E,H)}b&&(H.options.promotionCode=b),H.options.offerSelectorIds.push(T),H.promises.set(T,{resolve:B,reject:z}),c()}).catch(B=>{if(s.has(P))return s.get(P);throw B});return n.set(P,O),O})}return{Commitment:ye,PlanType:pn,Term:J,applyPlanType:Gt,resolveOfferSelectors:p,flushWcsCacheInternal:m,prefillWcsCache:h}}var za="mas-commerce-service",Va="mas-commerce-service:start",ja="mas-commerce-service:ready",xt,Ye,qe,Ya,qa,Li=class extends HTMLElement{constructor(){super(...arguments);V(this,qe);V(this,xt);V(this,Ye);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}get featureFlags(){return C(this,Ye)||Z(this,Ye,{[ve]:wt(this,qe,qa).call(this,ve)}),C(this,Ye)}activate(){let r=C(this,qe,Ya),i=Fa(r,this);Vt(r.lana);let n=re.init(r.hostEnv).module("service");n.debug("Activating:",r);let o={price:In(i)},s={checkout:new Set,price:new Set},l={literals:o,providers:s,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...Rn(l),...Nn(l),...Ua(l),...$a(l),...Ir,Log:re,get defaults(){return A},get log(){return re},get providers(){return{checkout(h){return s.checkout.add(h),()=>s.checkout.delete(h)},price(h){return s.price.add(h),()=>s.price.delete(h)},has:h=>s.price.has(h)||s.checkout.has(h)}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i});let c=new CustomEvent(Mt,{bubbles:!0,cancelable:!1,detail:this});performance.mark(ja),Z(this,xt,performance.measure(ja,Va)),this.dispatchEvent(c),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(Va),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(lr).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":Rt(C(this,xt))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:a,responseStatus:o})=>n===0&&a===0&&o<200||o>=400),i=Array.from(new Map(r.map(n=>[n.name,n])).values());if(i.some(({name:n})=>/(\/fragment\?|web_commerce_artifact)/.test(n))){let n=i.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};xt=new WeakMap,Ye=new WeakMap,qe=new WeakSet,Ya=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(n=>{let a=this.getAttribute(n);a&&(i[n]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let a=this.getAttribute(n);if(a!=null){let o=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());i.commerce[o]=a}}),i},qa=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||R(r))};window.customElements.get(za)||window.customElements.define(za,Li);var Ka="merch-card-collection",Rc=2e4,Nc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Oc={plans:!0},Ic=(e,{filter:t})=>e.filter(r=>r.filters.hasOwnProperty(t)),Hc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,kc=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),Dc=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),Bc=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Ee,bt,Et,nr,Qa,We=class extends Xa{constructor(){super();V(this,nr);V(this,Ee,{});V(this,bt);V(this,Et);this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return me`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(n=>setTimeout(()=>n(!1),Rc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(c=>c.tagName==="MERCH-CARD");if(n.length===0)return;r.has("singleApp")&&this.singleApp&&n.forEach(c=>{c.updateFilters(c.name===this.singleApp)});let a=this.sort===ae.alphabetical?kc:Dc,s=[Ic,Hc,Bc,a].reduce((c,h)=>h(c,this),n).map((c,h)=>[c,h]);if(this.resultCount=s.length,this.page&&this.limit){let c=this.page*this.limit;this.hasMore=s.length>c,s=s.filter(([,h])=>h<c)}let l=new Map(s.reverse());for(let c of l.keys())this.prepend(c);n.forEach(c=>{l.has(c)?(c.size=c.filters[this.filter]?.size,c.style.removeProperty("display"),c.requestUpdate()):(c.style.display="none",c.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(mr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(Qe,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){Z(this,Ee,{}),this.overrides?.split(",").forEach(r=>{let[i,n]=r?.split(":");i&&n&&(C(this,Ee)[i]=n)})}connectedCallback(){super.connectedCallback(),Z(this,bt,Di()),Z(this,Et,C(this,bt).Log.module(Ka)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r,this.querySelectorAll("[placeholder]").forEach(n=>{let a=n.getAttribute("slot");this.header.placeholderKeys.includes(a)&&this.header.append(n)})}initializePlaceholders(){let r=this.data?.placeholders||{};for(let i of Object.keys(r)){let n=r[i],a=n.includes("<p>")?"div":"p",o=document.createElement(a);o.setAttribute("slot",i),o.setAttribute("placeholder",""),o.innerHTML=n,this.append(o)}}attachSidenav(r,i=!0){r&&(i&&this.parentElement.prepend(r),this.sidenav=r,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),Oc[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(Ze)))}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let n=this;function a(o,s){let l={cards:[],hierarchy:[],placeholders:o.placeholders};function c(h,m){for(let p of m){if(p.fieldName==="cards"){if(l.cards.findIndex(f=>f.id===p.identifier)!==-1)continue;l.cards.push(o.references[p.identifier].value);continue}let{fields:d}=o.references[p.identifier].value,u={label:d.label,icon:d.icon,iconLight:d.iconLight,navigationLabel:d.navigationLabel,cards:d.cards.map(f=>s[f]||f),collections:[]};d.defaultchild&&(u.defaultchild=s[d.defaultchild]||d.defaultchild),h.push(u),c(u.collections,p.referencesTree)}}return c(l.hierarchy,o.referencesTree),l.hierarchy.length===0&&(n.filtered="all"),l}r.addEventListener(fr,o=>{wt(this,nr,Qa).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(ur,async o=>{this.data=a(o.detail,C(this,Ee));let{cards:s,hierarchy:l}=this.data,c=l.length===0&&o.detail.fields?.defaultchild?C(this,Ee)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...s);let h=(d,u)=>{for(let f of d)if(f.defaultchild===u||f.collections&&h(f.collections,u))return!0;return!1};for(let d of s){let _=function(E){for(let T of E){let P=T.cards.indexOf(f);if(P===-1)continue;let O=T.label.toLowerCase();u.filters[O]={order:P+1,size:d.fields.size},_(T.collections)}},u=document.createElement("merch-card"),f=C(this,Ee)[d.id]||d.id;u.setAttribute("consonant",""),u.setAttribute("style",""),Lt(d.fields.variant)?.supportsDefaultChild&&(c?f===c:h(l,f))&&u.setAttribute("data-default-card","true"),_(l);let y=document.createElement("aem-fragment");y.setAttribute("fragment",f),u.append(y),Object.keys(u.filters).length===0&&(u.filters={all:{order:s.indexOf(d)+1,size:d.fields.size}}),this.append(u)}let m="",p=s[0]?.fields?.variant;p?.startsWith("plans")&&(p="plans"),this.variant=p,p==="plans"&&s.length===3&&!s.some(d=>d.fields?.size?.includes("wide"))&&(m="ThreeColumns"),p&&this.classList.add("merch-card-collection",p,...Nc[`${p}${m}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i()}),await this.hydrationReady}get footer(){if(!this.filtered)return me`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return me`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===ae.authored?it({sort:void 0}):it({sort:r.target.value}),this.dispatchEvent(new CustomEvent(dr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(pr,{bubbles:!0,composed:!0}));let r=this.page+1;it({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=tn(({category:r,filter:i,types:n,sort:a,search:o,single_app:s,page:l})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{it({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=n??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(l)||1})}openFilters(r){this.sidenav?.showModal(r)}};Ee=new WeakMap,bt=new WeakMap,Et=new WeakMap,nr=new WeakSet,Qa=function(r,i={},n=!0){C(this,Et).error(`merch-card-collection: ${r}`,i),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(gr,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(We,"properties",{displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:ae.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(We,"styles",[nn]);We.SortOrder=ae;customElements.define(Ka,We);var Uc={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},Fc=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(n=>{n.innerText=r||""})},Gc={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},$c={catalog:"l"},W,vt=class extends Xa{constructor(){super();V(this,W);g(this,"tablet",new Xe(this,k));g(this,"desktop",new Xe(this,L));this.collection=null,Z(this,W,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(Qe,this.updateLiterals),this.collection?.addEventListener(Ze,this.handleSidenavAttached)}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(Qe,this.updateLiterals),this.collection?.removeEventListener(Ze,this.handleSidenavAttached)}willUpdate(){C(this,W).search=this.getVisibility("search"),C(this,W).filter=this.getVisibility("filter"),C(this,W).sort=this.getVisibility("sort"),C(this,W).result=this.getVisibility("result"),C(this,W).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let n=r[i];return n===!1?!1:n===!0?!0:n.includes(this.currentMedia)}getVisibility(r){let i=$r(this.collection?.variant)?.headerVisibility,n=this.parseVisibilityOptions(i,r);return n!==null?n:this.parseVisibilityOptions(Gc,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!C(this,W).search)return oe;let r=et(this,"searchText");return r?me`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${r}"
                      .size=${$c[this.variant]}
                  ></sp-search>
              </merch-search>
          `:oe}get filterAction(){return C(this,W).filter?this.sidenav?me`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:oe:oe}get sortAction(){if(!C(this,W).sort)return oe;let r=et(this,"sortText");if(!r)return;let i=et(this,"popularityText"),n=et(this,"alphabeticallyText");if(!(i&&n))return;let a=this.collection?.sort===ae.alphabetical;return me`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${a?ae.alphabetical:ae.authored}"
              >
                  <span slot="label-only"
                      >${r}:
                      ${a?n:i}</span
                  >
                  <sp-menu-item value="${ae.authored}"
                      >${i}</sp-menu-item
                  >
                  <sp-menu-item value="${ae.alphabetical}"
                      >${n}</sp-menu-item
                  >
              </sp-action-menu>
          `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return Uc[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!C(this,W).result)return oe;if(!this.sidenav)return oe;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return me`
            <div id="result" aria-live="polite" type=${r} quantity=${i}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!C(this,W).custom)return oe;let r=$r(this.collection?.variant)?.customHeaderArea;if(!r)return oe;let i=r(this.collection);return!i||i===oe?oe:me`<div id="custom">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{Fc(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return me`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};W=new WeakMap,g(vt,"styles",Mc`
          :host {
              --merch-card-collection-header-max-width: var(--merch-card-collection-card-width);
              --merch-card-collection-header-margin-bottom: 32px;
              --merch-card-collection-header-column-gap: 8px;
              --merch-card-collection-header-row-gap: 16px;
              --merch-card-collection-header-columns: auto auto;
              --merch-card-collection-header-areas: "search search" 
                                                    "filter sort"
                                                    "result result";
              --merch-card-collection-header-search-max-width: unset;
              --merch-card-collection-header-filter-height: 40px;
              --merch-card-collection-header-filter-font-size: 16px;
              --merch-card-collection-header-filter-padding: 15px;
              --merch-card-collection-header-sort-height: var(--merch-card-collection-header-filter-height);
              --merch-card-collection-header-sort-font-size: var(--merch-card-collection-header-filter-font-size);
              --merch-card-collection-header-sort-padding: var(--merch-card-collection-header-filter-padding);
              --merch-card-collection-header-result-font-size: 14px;
          }
  
          sp-theme {
              font-size: inherit;
          }
  
          #header {
              display: grid;
              column-gap: var(--merch-card-collection-header-column-gap);
              row-gap: var(--merch-card-collection-header-row-gap);
              align-items: center;
              grid-template-columns: var(--merch-card-collection-header-columns);
              grid-template-areas: var(--merch-card-collection-header-areas);
              margin-bottom: var(--merch-card-collection-header-margin-bottom);
              max-width: var(--merch-card-collection-header-max-width);
          }
  
          #header:empty {
              margin-bottom: 0;
          }
          
          #search {
              grid-area: search;
          }
  
          #search sp-search {
              max-width: var(--merch-card-collection-header-search-max-width);
              width: 100%;
          }
  
          #filter {
              grid-area: filter;
              --mod-actionbutton-edge-to-text: var(--merch-card-collection-header-filter-padding);
              --mod-actionbutton-height: var(--merch-card-collection-header-filter-height);
          }
  
          #filter slot[name="filtersText"] {
              font-size: var(--merch-card-collection-header-filter-font-size);
          }
  
          #sort {
              grid-area: sort;
              --mod-actionbutton-edge-to-text: var(--merch-card-collection-header-sort-padding);
              --mod-actionbutton-height: var(--merch-card-collection-header-sort-height);
          }
  
          #sort [slot="label-only"] {
              font-size: var(--merch-card-collection-header-sort-font-size);
          }
  
          #result {
              grid-area: result;
              font-size: var(--merch-card-collection-header-result-font-size);
          }
  
          #result[type="search"][quantity="none"] {
              font-size: inherit;
          }
  
          #custom {
              grid-area: custom;
          }
  
          /* tablets */
          @media screen and ${Wa(k)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort" 
                                                        "result result result";
              }
          }
  
          /* Laptop */
          @media screen and ${Wa(L)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",vt);export{We as MerchCardCollection,vt as default};

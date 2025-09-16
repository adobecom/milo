var Hi=Object.defineProperty;var Di=e=>{throw TypeError(e)};var ho=(e,t,r)=>t in e?Hi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var po=(e,t)=>{for(var r in t)Hi(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>ho(e,typeof t!="symbol"?t+"":t,r),ur=(e,t,r)=>t.has(e)||Di("Cannot "+r);var w=(e,t,r)=>(ur(e,t,"read from private field"),r?r.call(e):t.get(e)),$=(e,t,r)=>t.has(e)?Di("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),G=(e,t,r,i)=>(ur(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),Lt=(e,t,r)=>(ur(e,t,"access private method"),r);import{html as ue,LitElement as Ja,css as eo,unsafeCSS as Za,nothing as se}from"../lit-all.min.js";var V="(max-width: 767px)",ne="(max-width: 1199px)",H="(min-width: 768px)",N="(min-width: 1200px)",ge="(min-width: 1600px)";function Rt(){return window.matchMedia(V)}function Mt(){return window.matchMedia(N)}function Nt(){return Rt().matches}function Ot(){return Mt().matches}var et=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var Bi="hashchange";function mo(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[n,a=""]=i.split("=");n&&t.push([n,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function tt(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([n,a])=>{a?t.set(n,a):t.delete(n)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function Ui(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=mo(window.location.hash);e(r)};return t(),window.addEventListener(Bi,t),()=>{window.removeEventListener(Bi,t)}}var Fr={};po(Fr,{CLASS_NAME_FAILED:()=>Sr,CLASS_NAME_HIDDEN:()=>fo,CLASS_NAME_PENDING:()=>Tr,CLASS_NAME_RESOLVED:()=>wr,CheckoutWorkflow:()=>Mo,CheckoutWorkflowStep:()=>q,Commitment:()=>Se,ERROR_MESSAGE_BAD_REQUEST:()=>_r,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Co,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Pr,EVENT_AEM_ERROR:()=>yr,EVENT_AEM_LOAD:()=>Er,EVENT_MAS_ERROR:()=>Ar,EVENT_MAS_READY:()=>Po,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>wo,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>gr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>rt,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>br,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>it,EVENT_MERCH_CARD_COLLECTION_SORT:()=>xr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>To,EVENT_MERCH_OFFER_READY:()=>bo,EVENT_MERCH_OFFER_SELECT_READY:()=>vo,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>So,EVENT_MERCH_SEARCH_CHANGE:()=>_o,EVENT_MERCH_SIDENAV_SELECT:()=>vr,EVENT_MERCH_STOCK_CHANGE:()=>yo,EVENT_MERCH_STORAGE_CHANGE:()=>Ao,EVENT_OFFER_SELECTED:()=>Eo,EVENT_TYPE_FAILED:()=>Cr,EVENT_TYPE_READY:()=>It,EVENT_TYPE_RESOLVED:()=>Lr,Env:()=>le,FF_DEFAULTS:()=>ve,HEADER_X_REQUEST_ID:()=>nt,LOG_NAMESPACE:()=>Rr,Landscape:()=>be,MARK_DURATION_SUFFIX:()=>Br,MARK_START_SUFFIX:()=>Dr,MODAL_TYPE_3_IN_1:()=>Te,NAMESPACE:()=>uo,PARAM_AOS_API_KEY:()=>Lo,PARAM_ENV:()=>Nr,PARAM_LANDSCAPE:()=>Or,PARAM_MAS_PREVIEW:()=>Mr,PARAM_WCS_API_KEY:()=>Ro,PROVIDER_ENVIRONMENT:()=>Hr,SELECTOR_MAS_CHECKOUT_LINK:()=>Fi,SELECTOR_MAS_ELEMENT:()=>fr,SELECTOR_MAS_INLINE_PRICE:()=>ee,SELECTOR_MAS_SP_BUTTON:()=>xo,SELECTOR_MAS_UPT_LINK:()=>$i,SORT_ORDER:()=>oe,STATE_FAILED:()=>ae,STATE_PENDING:()=>xe,STATE_RESOLVED:()=>de,TAG_NAME_SERVICE:()=>go,TEMPLATE_PRICE:()=>No,TEMPLATE_PRICE_ANNUAL:()=>Io,TEMPLATE_PRICE_LEGAL:()=>Ur,TEMPLATE_PRICE_STRIKETHROUGH:()=>Oo,Term:()=>J,WCS_PROD_URL:()=>Ir,WCS_STAGE_URL:()=>kr});var Se=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),J=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),uo="merch",fo="hidden",It="wcms:commerce:ready",go="mas-commerce-service",ee='span[is="inline-price"][data-wcs-osi]',Fi='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',xo="sp-button[data-wcs-osi]",$i='a[is="upt-link"]',fr=`${ee},${Fi},${$i}`,bo="merch-offer:ready",vo="merch-offer-select:ready",gr="merch-card:action-menu-toggle",Eo="merch-offer:selected",yo="merch-stock:change",Ao="merch-storage:change",So="merch-quantity-selector:change",To="merch-card-quantity:change",wo="merch-modal:addon-and-quantity-update",_o="merch-search:change",xr="merch-card-collection:sort",rt="merch-card-collection:literals-changed",it="merch-card-collection:sidenav-attached",br="merch-card-collection:showmore",vr="merch-sidenav:select",Er="aem:load",yr="aem:error",Po="mas:ready",Ar="mas:error",Sr="placeholder-failed",Tr="placeholder-pending",wr="placeholder-resolved",_r="Bad WCS request",Pr="Commerce offer not found",Co="Literals URL not provided",Cr="mas:failed",Lr="mas:resolved",Rr="mas/commerce",Mr="mas.preview",Nr="commerce.env",Or="commerce.landscape",Lo="commerce.aosKey",Ro="commerce.wcsKey",Ir="https://www.adobe.com/web_commerce_artifact",kr="https://www.stage.adobe.com/web_commerce_artifact_stage",ae="failed",xe="pending",de="resolved",be={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},nt="X-Request-Id",q=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),Mo="UCv3",le=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Hr={PRODUCTION:"PRODUCTION"},Te={TWP:"twp",D2P:"d2p",CRM:"crm"},Dr=":start",Br=":duration",No="price",Oo="price-strikethrough",Io="annual",Ur="legal",ve="mas-ff-defaults",oe={alphabetical:"alphabetical",authored:"authored"};var ko="mas-commerce-service";var at=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function we(e,t={},r=null,i=null){let n=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,o]of Object.entries(t))n.setAttribute(a,o);return n}function kt(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Gi(){return window.matchMedia("(max-width: 1024px)").matches}function ot(){return document.getElementsByTagName(ko)?.[0]}function st(e){let t=window.getComputedStyle(e);return e.offsetHeight+parseFloat(t.marginTop)+parseFloat(t.marginBottom)}import{html as Ht,nothing as Ho}from"../lit-all.min.js";var He,ct=class ct{constructor(t){g(this,"card");$(this,He);this.card=t,this.insertVariantStyle()}getContainer(){return G(this,He,w(this,He)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),w(this,He)}insertVariantStyle(){if(!ct.styleMap[this.card.variant]){ct.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Ht`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Ht` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Ht`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:Ho}get secureLabelFooter(){return Ht`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Dt(this.card.variant)}};He=new WeakMap,g(ct,"styleMap",{});var I=ct;import{html as $r,css as Do}from"../lit-all.min.js";var zi=`
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

@media screen and ${V} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-columns: min-content auto;
    }
}

@media screen and ${H} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-column-gap: 16px;
    }
}

@media screen and ${N} {
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
}`;var Vi={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},De=class extends I{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(gr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let i=this.actionMenuContentSlot.classList.contains("hidden");i||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!i).toString())});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(i||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",i),this.setAriaExpanded(this.actionMenu,"false"))});g(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return $r` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Gi()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":$r`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?$r`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return zi}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};g(De,"variantStyle",Do`
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
    `);import{html as lt}from"../lit-all.min.js";var ji=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${H} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${N} {
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
`;var Bt=class extends I{constructor(t){super(t)}getGlobalCSS(){return ji}renderLayout(){return lt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?lt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:lt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?lt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:lt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Wi}from"../lit-all.min.js";var qi=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${H} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${N} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${ge} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Ut=class extends I{constructor(t){super(t)}getGlobalCSS(){return qi}renderLayout(){return Wi` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Wi`<hr />`} ${this.secureLabelFooter}`}};import{html as Be,css as Bo,unsafeCSS as Gr}from"../lit-all.min.js";var Yi=`
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
@media screen and ${V} {
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

@media screen and ${ne} {
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
@media screen and ${H} {
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
@media screen and ${N} {
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

@media screen and ${ge} {
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
`;var Uo=32,Ue=class extends I{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Be`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Be`<slot name="secure-transaction-label"></slot>`;return Be`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Yi}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let i=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");i&&i.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,n)=>{let a=Math.max(Uo,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${ee}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,n=this.headingMPriceSlot;if(!i&&n){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=we("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=we("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,n=this.card.planType;i&&(await i.onceSettled(),n=i.value?.[0]?.planType),n&&(r.planType=n)}renderLayout(){return Be` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Be`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:Be`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),Nt()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(Ue,"variantStyle",Bo`
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

    @media screen and ${Gr(V)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${Gr(ne)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Gr(N)} {
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
  `);import{html as dt,css as Fo,nothing as Ft}from"../lit-all.min.js";var Xi=`
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

merch-card[variant^="plans"] span.price-unit-type {
    display: block;
}

merch-card[variant^="plans"] .price-unit-type:not(.disabled)::before {
    content: "";
}
merch-card[variant^="plans"] [slot="callout-content"] span.price-unit-type,
merch-card[variant^="plans"] [slot="addon"] span.price-unit-type,
merch-card[variant^="plans"] .price.price-strikethrough span.price-unit-type,
merch-card[variant^="plans"] span.price-unit-type.disabled {
  display: inline; 
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

merch-card[variant^="plans"] span.text-l {
    display: block;
    font-size: 18px;
    line-height: 23px;
}

merch-card[variant="plans-education"] span.promo-text {
    margin-bottom: 8px;
}

merch-card[variant="plans-education"] p:has(a[href^='tel:']):has(+ p, + div) {
    margin-bottom: 16px;
}

merch-card[variant^="plans"] [slot="promo-text"],
merch-card[variant="plans-education"] span.promo-text {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card[variant="plans-education"] [slot="body-xs"] {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

merch-card[variant="plans-education"] .spacer {
    height: calc(var(--merch-card-plans-edu-list-max-offset) - var(--merch-card-plans-edu-list-offset));
}

merch-card[variant="plans-education"] ul + p {
    margin-top: 16px;
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
@media screen and ${V} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
    merch-card[variant="plans-students"] {
        min-width: var(--consonant-merch-card-plans-width);
        max-width: var(--consonant-merch-card-plans-students-width);
        width: 100%;
    }

    merch-card[variant="plans-education"] .spacer {
        height: 0px;
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

/* Tabs containers */
#tabs-plan {
    --tabs-active-text-color: #131313;
    --tabs-border-color: #444444;
}
#tabs-plan .tab-list-container button[role="tab"][aria-selected="false"] {
    border-top-color: #EAEAEA;
    border-right-color: #EAEAEA;
}
#tabs-plan .tab-list-container button[role="tab"][aria-selected="false"]:first-of-type {
    border-left-color: #EAEAEA;
}

/* Tablet */
@media screen and ${H} {
    .four-merch-cards.plans .foreground {
        max-width: unset;
    }
  
    .columns.merch-card > .row {
        grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width) * 2 + var(--consonant-merch-spacing-m)));
    }
}

/* desktop */
@media screen and ${N} {
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
        width: fit-content;
        position: relative;
        left: 50%;
        transform: translateX(-50vw);
        justify-content: start;
        padding-inline: 30px;
        padding-top: 24px;
    }
}

/* Large desktop */
@media screen and ${ge} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }

    merch-sidenav.plans {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var $t={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},Ki={...function(){let{whatsIncluded:e,size:t,...r}=$t;return r}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},Qi={...function(){let{subtitle:e,whatsIncluded:t,size:r,quantitySelect:i,...n}=$t;return n}()},W=class extends I{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===Ur&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Xi}adjustSlotPlacement(t,r,i){let n=this.card.shadowRoot,a=n.querySelector("footer"),o=this.card.getAttribute("size");if(!o)return;let s=n.querySelector(`footer slot[name="${t}"]`),c=n.querySelector(`.body slot[name="${t}"]`),l=n.querySelector(".body");if(o.includes("wide")||(a?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(a?.classList.toggle("wide-footer",Ot()),!i&&s){if(c)s.remove();else{let d=l.querySelector(`[data-placeholder-for="${t}"]`);d?d.replaceWith(s):l.appendChild(s)}return}if(i&&c){let d=document.createElement("div");if(d.setAttribute("data-placeholder-for",t),d.classList.add("slot-placeholder"),!s){let m=c.cloneNode(!0);a.prepend(m)}c.replaceWith(d)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],Ot()),this.adjustSlotPlacement("callout-content",["super-wide"],Ot())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let r=this.card.querySelector('[slot="body-xs"]');if(!r)return;let i=r.querySelector("ul");if(!i)return;let n=i.previousElementSibling,a=document.createElement("div");a.classList.add("spacer"),r.insertBefore(a,n);let o=new IntersectionObserver(([s])=>{if(s.boundingClientRect.height===0)return;let c=0,l=this.card.querySelector('[slot="heading-s"]');l&&(c+=st(l));let d=this.card.querySelector('[slot="subtitle"]');d&&(c+=st(d));let m=this.card.querySelector('[slot="heading-m"]');m&&(c+=8+st(m));for(let h of r.childNodes){if(h.classList.contains("spacer"))break;c+=st(h)}let p=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");c>(parseFloat(p)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${c}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${c}px`),o.disconnect()});o.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.legalAdjusted||(await this.adjustLegal(),await this.adjustEduLists())}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${ee}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?dt`<div class="divider"></div>`:Ft}async adjustLegal(){if(this.legalAdjusted)return;this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=[],r=this.card.querySelector(`[slot="heading-m"] ${ee}[data-template="price"]`);r&&t.push(r);let i=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling),await a.onceSettled())});await Promise.all(i)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?dt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Ft}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Ft:dt`<slot name="icons"></slot>`}connectedCallbackHook(){let t=Rt();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let r=Mt();r?.addEventListener&&r.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=Rt();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let r=Mt();r?.removeEventListener&&r.removeEventListener("change",this.adaptForMedia)}renderLayout(){return dt` ${this.badge}
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
            <slot></slot>`}};g(W,"variantStyle",Fo`
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
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
    `),g(W,"collectionOptions",{customHeaderArea:t=>t.sidenav?dt`<slot name="resultsText"></slot>`:Ft,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as zr,css as $o}from"../lit-all.min.js";var Zi=`
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
@media screen and ${H} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${N} {
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
`;var Fe=class extends I{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Zi}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return zr` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":zr`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?zr`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Nt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${ee}[data-template="price"]`)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=we("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=we("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g(Fe,"variantStyle",$o`
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
    `);import{html as Vr,css as Go}from"../lit-all.min.js";var Ji=`
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
@media screen and ${V} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${H} {
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
@media screen and ${N} {
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
`;var $e=class extends I{constructor(t){super(t)}getGlobalCSS(){return Ji}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Vr` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Vr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Vr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g($e,"variantStyle",Go`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as jr,css as zo}from"../lit-all.min.js";var en=`
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

@media screen and ${V} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${H} {
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
@media screen and ${N} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${ge} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var tn={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Ge=class extends I{constructor(t){super(t)}getGlobalCSS(){return en}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return jr`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?jr`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:jr`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Ge,"variantStyle",zo`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as Vo,css as jo}from"../lit-all.min.js";var rn=`
:root {
    --merch-card-simplified-pricing-express-width: 311px;
}

merch-card[variant="simplified-pricing-express"] merch-badge {
    white-space: nowrap;
    color: var(--spectrum-white);
    font-size: var(--consonant-merch-card-detail-m-font-size);
    line-height: var(--consonant-merch-card-detail-m-line-height);
}

/* Grid layout for simplified-pricing-express cards */
merch-card-collection.simplified-pricing-express {
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: stretch;
    gap: 16px;
    padding: var(--spacing-m);
    /* Default to 1 column on mobile */
    grid-template-columns: 1fr;
}

/* Also support direct merch-card children and wrapped in p tags */
merch-card-collection.simplified-pricing-express p {
    margin: 0;
    font-size: inherit;
}

/* Desktop - 3 columns */
@media screen and ${N} {
    merch-card-collection.simplified-pricing-express {
        grid-template-columns: repeat(3, 1fr);
        max-width: calc(3 * var(--merch-card-simplified-pricing-express-width) + 32px);
        margin: 0 auto;
    }
}

merch-card[variant="simplified-pricing-express"] p {
    margin: 0 !important; /* needed to override express-milo default margin to all <p> */
    font-size: inherit;
}

merch-card[variant="simplified-pricing-express"] [slot="heading-xs"] {
    font-size: 18px;
    font-weight: 700;
    line-height: 23.4px;
    color: var(--spectrum-gray-800);
}

merch-card[variant="simplified-pricing-express"] [slot="body-xs"] {
    font-size: var(--merch-card-simplified-pricing-express-body-xs-font-size, 14px);
    line-height: var(--merch-card-simplified-pricing-express-body-xs-line-height, 18.2px);
    color: var(--spectrum-gray-700);
    margin-bottom: 32px;
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
  display: flex;
  flex-direction: column;
  margin-bottom: var(--merch-card-simplified-pricing-express-padding);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p span[is="inline-price"]:first-child {
  margin-right: 8px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child {
  display: flex;
  align-items: baseline;
  margin: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  line-height: var(--merch-card-simplified-pricing-express-price-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"][data-template="optical"] {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  color: var(--spectrum-gray-800);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] p {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-p-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] p:empty {
  min-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] .price-currency-symbol {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-line-height);
  width: 100%;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"] .price-recurrence {
  font-size: var(--merch-card-simplified-pricing-express-price-recurrence-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-recurrence-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-recurrence-line-height);
}

/* Strikethrough price styling */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-strikethrough,
merch-card[variant="simplified-pricing-express"] span.placeholder-resolved[data-template='strikethrough'] {
  text-decoration: none;
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price {
  color: var(--spectrum-gray-500);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] p a {
  color: var(--spectrum-indigo-900);
  font-weight: 500;
  text-decoration: underline;
}

merch-card[variant="simplified-pricing-express"] span[is="inline-price"] .price-integer,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"] .price-decimals {
  font-size: 28px;
  font-weight: 700;
  line-height: 36.4px;
  text-decoration-thickness: 2px;
}

merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-integer,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals {
  text-decoration: line-through;
}

/* Apply indigo-800 color to optical price when preceded by strikethrough */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'],
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'] .price-currency-symbol {
  color: var(--spectrum-indigo-900);
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
    display: inline-block;
    align-items: center;
    vertical-align: baseline;
    margin-right: 8px;
    overflow: visible;
    padding-top: 16px;
}

/* Tooltip containers - overflow handled by Shadow DOM */

/* Mobile styles */
@media screen and ${V} {
  merch-card-collection.simplified-pricing-express {
    gap: 8px;
  }
  
  merch-card[variant="simplified-pricing-express"] {
    width: 311px;
    max-width: 311px;
  }

  /* Badge alignment on mobile */
  merch-card[variant="simplified-pricing-express"] [slot="badge"] {
    font-size: 16px;
    font-weight: 400;
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

  /* Fix spacing between cards on mobile */
  main merch-card-collection.simplified-pricing-express p:has(merch-card[variant="simplified-pricing-express"]),
  main .section p:has(merch-card[variant="simplified-pricing-express"]) {
    margin: 0;
  }
}

/* Collapse/expand styles for all tablet and mobile viewports */
@media screen and ${ne} {
  /* Collapsed state - hide content sections */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="body-xs"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="cta"],
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
    max-height: 57px;
    padding: 0;
    overflow: hidden;
    border-radius: 8px;
  }

  merch-card[variant="simplified-pricing-express"][gradient-border="true"][data-expanded="false"],
  merch-card[variant="simplified-pricing-express"][gradient-border="true"]:not([data-expanded="true"]) {
    max-height: 85px;
  }
}

/* Tablet styles - extending mobile styles with specific adjustments */
@media screen and ${H} and ${ne} {
  merch-card-collection.simplified-pricing-express {
    padding: var(--spacing-m) 32px;
    grid-template-columns: 1fr;
    gap: 24px;
    width: var(--merch-card-simplified-pricing-express-tablet-width);
    margin: 0 auto;
  }
  
  merch-card[variant="simplified-pricing-express"] {
      min-width: var(--merch-card-simplified-pricing-express-tablet-width);
  }
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
    color: var(--spectrum-white, #ffffff);
    width: 100%;
}

/* Ensure text color is applied to the label span element for accessibility */
merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"] .spectrum-Button-label,
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent .spectrum-Button-label,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent .spectrum-Button-label {
    color: var(--spectrum-white, #ffffff);
}
`;var Gt=()=>window.matchMedia(ne).matches,qr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"XL"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:["trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},ze=class extends I{getGlobalCSS(){return rn}get aemFragmentMapping(){return qr}get headingSelector(){return'[slot="heading-xs"]'}connectedCallbackHook(){!this.card||this.card.failed||(this.setupAccordion(),requestAnimationFrame(()=>{this.card?.hasAttribute("data-default-card")&&Gt()&&this.card.setAttribute("data-expanded","true")}))}setupAccordion(){let t=this.card;if(!t)return;let r=()=>{if(Gt()){let n=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",n?"true":"false")}else t.removeAttribute("data-expanded")};r();let i=window.matchMedia(ne);this.mediaQueryListener=()=>{r()},i.addEventListener("change",this.mediaQueryListener),this.attributeObserver=new MutationObserver(n=>{n.forEach(a=>{a.type==="attributes"&&a.attributeName==="data-default-card"&&this.card.hasAttribute("data-default-card")&&Gt()&&this.card.setAttribute("data-expanded","true")})}),this.attributeObserver.observe(this.card,{attributes:!0,attributeOldValue:!0})}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia(ne).removeEventListener("change",this.mediaQueryListener),this.attributeObserver&&this.attributeObserver.disconnect()}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||!Gt())return;let a=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",a)}renderLayout(){return Vo`
            <div class="badge-wrapper">
                <slot name="badge"></slot>
            </div>
            <div class="card-content">
                <div class="header">
                    <slot name="heading-xs"></slot>
                    <slot name="trial-badge"></slot>
                    <button class="chevron-button" @click=${t=>this.handleChevronClick(t)}>
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
            </div>
            <slot></slot>
        `}};g(ze,"variantStyle",jo`
        :host([variant='simplified-pricing-express']) {
            /* CSS Variables */
            --merch-card-simplified-pricing-express-width: 365px;
            --merch-card-simplified-pricing-express-tablet-width: 532px;
            --merch-card-simplified-pricing-express-padding: 24px;
            --merch-card-simplified-pricing-express-padding-mobile: 16px;
            --merch-card-simplified-pricing-express-min-height: 341px;
            --merch-card-simplified-pricing-express-price-font-size: 28px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            --merch-card-simplified-pricing-express-price-font-weight: 700;
            --merch-card-simplified-pricing-express-price-line-height: 36.4px;
            --merch-card-simplified-pricing-express-price-currency-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-line-height: 28.6px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-size: 22px;
            --merch-card-simplified-pricing-express-price-currency-symbol-font-weight: 700;
            --merch-card-simplified-pricing-express-price-currency-symbol-line-height: 28.6px;
            --merch-card-simplified-pricing-express-price-recurrence-font-size: 12px;
            --merch-card-simplified-pricing-express-price-recurrence-font-weight: 700;
            --merch-card-simplified-pricing-express-price-recurrence-line-height: 15.6px;
            --merch-card-simplified-pricing-express-body-xs-font-size: 14px;
            --merch-card-simplified-pricing-express-body-xs-line-height: 18.2px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-font-weight: 400;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
            --merch-card-simplified-pricing-express-cta-font-size: 18px;
            --merch-card-simplified-pricing-express-cta-font-weight: 700;
            --merch-card-simplified-pricing-express-cta-line-height: 23.4px;
            
            /* Gradient definitions */
            --gradient-purple-blue: linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%);
            --gradient-firefly-spectrum: linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%);
            width: var(--merch-card-simplified-pricing-express-width);
            max-width: var(--merch-card-simplified-pricing-express-width);
            background: transparent;
            border: none;
            display: flex;
            flex-direction: column;
            overflow: visible;
            box-sizing: border-box;
            position: relative;
        }

        /* Badge wrapper styling */
        :host([variant='simplified-pricing-express']) .badge-wrapper {
            padding: 4px 12px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            font-size: 12px;
            font-weight: 500;
            line-height: 15.6px;
            color: var(--spectrum-gray-800);
            position: relative;
            min-height: 23px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Hide badge wrapper when empty */
        :host([variant='simplified-pricing-express']) .badge-wrapper:empty {
            display: none;
        }
        
        /* Also hide when badge slot is empty */
        :host([variant='simplified-pricing-express']:not(:has([slot="badge"]:not(:empty)))) .badge-wrapper {
            display: none;
        }

        /* Card content styling */
        :host([variant='simplified-pricing-express']) .card-content {
            border-radius: 8px;
            padding: var(--merch-card-simplified-pricing-express-padding);
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--consonant-merch-spacing-xxs);
            position: relative;
        }
        
        /* Ensure content appears above pseudo-element background */
        :host([variant='simplified-pricing-express']) .card-content > * {
            position: relative;
        }
        
        :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .card-content {
            background: var(--spectrum-gray-50);
            border: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* Collapsed state for non-gradient cards */
        :host([variant='simplified-pricing-express']:not([gradient-border='true'])[data-expanded='false']) .card-content {
            overflow: hidden;
        }
        
        /* When badge exists, adjust card content border radius */
        :host([variant='simplified-pricing-express']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        
        /* When badge exists with regular border, ensure top border */
        :host([variant='simplified-pricing-express']:not([gradient-border='true']):has([slot="badge"]:not(:empty))) .card-content {
            border-top: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* When badge has content, ensure seamless connection */
        :host([variant='simplified-pricing-express']:has([slot="badge"]:not(:empty))) .badge-wrapper {
            margin-bottom: -2px;
        }

        /* Common gradient border styles */
        :host([variant='simplified-pricing-express'][gradient-border='true']) .badge-wrapper {
            border: none;
            margin-bottom: -6px;
            padding-bottom: 6px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']) .badge-wrapper ::slotted(*) {
            color: white !important;
        }

        :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content {
            position: relative;
            border: none;
            padding: calc(var(--merch-card-simplified-pricing-express-padding) + 2px);
            border-radius: 8px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content::before {
            content: '';
            position: absolute;
            top: 1px;
            left: 1px;
            right: 1px;
            bottom: 1px;
            background: var(--spectrum-gray-50);
            border-radius: 7px;
            z-index: 0;
            pointer-events: none;
        }
        
        /* Gradient-specific backgrounds */
        :host([variant='simplified-pricing-express'][border-color='gradient-purple-blue']) .badge-wrapper,
        :host([variant='simplified-pricing-express'][border-color='gradient-purple-blue']) .card-content {
            background: var(--gradient-purple-blue);
        }
        
        :host([variant='simplified-pricing-express'][border-color='gradient-firefly-spectrum']) .badge-wrapper,
        :host([variant='simplified-pricing-express'][border-color='gradient-firefly-spectrum']) .card-content {
            background: var(--gradient-firefly-spectrum);
        }
        
        /* When gradient and badge exist, keep rounded corners for smooth transition */
        :host([variant='simplified-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content::before {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
        }
        
        :host([variant='simplified-pricing-express']) .header {
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 8px;
        }

        /* Font specifications for heading and body */
        :host([variant='simplified-pricing-express']) [slot="heading-xs"] {
            font-size: 18px;
            font-weight: 700;
            line-height: 23.4px;
            color: var(--spectrum-gray-800);
        }

        :host([variant='simplified-pricing-express']) .description {
            gap: 16px;
            display: flex;
            flex-direction: column;
        }

        :host([variant='simplified-pricing-express']) .price {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            margin-top: auto;
        }

        /* Desktop only - Fixed heights for alignment */
        @media (min-width: 1200px) {
            :host([variant='simplified-pricing-express']) {
                display: flex;
                flex-direction: column;
                height: auto;
            }

            :host([variant='simplified-pricing-express']) .cta {
                flex-shrink: 0;
            }
        }

        :host([variant='simplified-pricing-express']) .cta,
        :host([variant='simplified-pricing-express']) .cta ::slotted(*) {
            width: 100%;
            display: block;
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

        /* Mobile and Tablet styles */
        @media (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) {
                width: 311px;
                max-width: 311px;
                min-height: auto;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            :host([variant='simplified-pricing-express']) .header {
                position: relative;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
            }

            :host([variant='simplified-pricing-express']) .chevron-button {
                display: block;
                flex-shrink: 0;
                margin-left: auto;
            }
            
            :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content,
            :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .card-content {
                padding: calc(var(--merch-card-simplified-pricing-express-padding-mobile) + 2px);
            }
            
            /* Hide badge-wrapper on mobile/tablet except for gradient borders */
            :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .badge-wrapper {
                display: none;
            }
            
            /* Gradient border collapsed state - limit badge-wrapper height */
            :host([variant='simplified-pricing-express'][gradient-border='true'][data-expanded='false']) .card-content {
                overflow: hidden;
                padding: 16px 16px 35px 16px;
            }
        }
    `);import{css as qo,html as Wo}from"../lit-all.min.js";var nn=`
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
`;var an={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},Ve=class extends I{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return nn}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,i){i.literals={...i.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},i.space=!0,i.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${ee}[data-template="price"]`);if(!r)return;let i=r.cloneNode(!0);this.legal=i,r.dataset.displayTax="false",i.dataset.template="legal",i.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,i.setAttribute("slot","legal"),this.card.appendChild(i)}renderLayout(){return Wo`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(Ve,"variantStyle",qo`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
        }
    `);var on=new Map,te=(e,t,r=null,i=null,n)=>{on.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:n})};te("catalog",De,Vi,De.variantStyle);te("image",Bt);te("inline-heading",Ut);te("mini-compare-chart",Ue,null,Ue.variantStyle);te("plans",W,$t,W.variantStyle,W.collectionOptions);te("plans-students",W,Qi,W.variantStyle,W.collectionOptions);te("plans-education",W,Ki,W.variantStyle,W.collectionOptions);te("product",Fe,null,Fe.variantStyle);te("segment",$e,null,$e.variantStyle);te("special-offers",Ge,tn,Ge.variantStyle);te("simplified-pricing-express",ze,qr,ze.variantStyle);te("mini",Ve,an,Ve.variantStyle);function Dt(e){return on.get(e)?.fragmentMapping}var sn="tacocat.js";var Wr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),cn=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function O(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=je(i)?i:e;a=o.get(s)}if(n&&a==null){let o=je(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=Xo(je(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var Yo=e=>typeof e=="boolean",zt=e=>typeof e=="function",Vt=e=>typeof e=="number",ln=e=>e!=null&&typeof e=="object";var je=e=>typeof e=="string",dn=e=>je(e)&&e,ht=e=>Vt(e)&&Number.isFinite(e)&&e>0;function jt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function b(e,t){if(Yo(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function pt(e,t,r){let i=Object.values(t);return i.find(n=>Wr(n,e))??r??i[0]}function Xo(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function hn(e,t=1){return Vt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Ko=Date.now(),Yr=()=>`(+${Date.now()-Ko}ms)`,qt=new Set,Qo=b(O("tacocat.debug",{},{metadata:!1}),!1);function pn(e){let t=`[${sn}/${e}]`,r=(o,s,...c)=>o?!0:(n(s,...c),!1),i=Qo?(o,...s)=>{console.debug(`${t} ${o}`,...s,Yr())}:()=>{},n=(o,...s)=>{let c=`${t} ${o}`;qt.forEach(([l])=>l(c,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let c=`${t} ${o}`;qt.forEach(([,l])=>l(c,...s))}}}function Zo(e,t){let r=[e,t];return qt.add(r),()=>{qt.delete(r)}}Zo((e,...t)=>{console.error(e,...t,Yr())},(e,...t)=>{console.warn(e,...t,Yr())});var Jo="no promo",mn="promo-tag",es="yellow",ts="neutral",rs=(e,t,r)=>{let i=a=>a||Jo,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},is="cancel-context",Wt=(e,t)=>{let r=e===is,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?mn:`${mn} no-promo`,text:rs(o,t,n),variant:a?es:ts,isOverriden:n}};var Xr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Xr||(Xr={}));var Q;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(Q||(Q={}));var re;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(re||(re={}));var Kr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Kr||(Kr={}));var Qr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Qr||(Qr={}));var Zr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Zr||(Zr={}));var Jr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Jr||(Jr={}));var ei="ABM",ti="PUF",ri="M2M",ii="PERPETUAL",ni="P3Y",ns="TAX_INCLUSIVE_DETAILS",as="TAX_EXCLUSIVE",un={ABM:ei,PUF:ti,M2M:ri,PERPETUAL:ii,P3Y:ni},Xd={[ei]:{commitment:Q.YEAR,term:re.MONTHLY},[ti]:{commitment:Q.YEAR,term:re.ANNUAL},[ri]:{commitment:Q.MONTH,term:re.MONTHLY},[ii]:{commitment:Q.PERPETUAL,term:void 0},[ni]:{commitment:Q.THREE_MONTHS,term:re.P3Y}},fn="Value is not an offer",Yt=e=>{if(typeof e!="object")return fn;let{commitment:t,term:r}=e,i=os(t,r);return{...e,planType:i}};var os=(e,t)=>{switch(e){case void 0:return fn;case"":return"";case Q.YEAR:return t===re.MONTHLY?ei:t===re.ANNUAL?ti:"";case Q.MONTH:return t===re.MONTHLY?ri:"";case Q.PERPETUAL:return ii;case Q.TERM_LICENSE:return t===re.P3Y?ni:"";default:return""}};function gn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==ns)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:as}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var ss="mas-commerce-service",cs={requestId:nt,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function mt(e,{country:t,forceTaxExclusive:r}){let i;if(e.length<2)i=e;else{let n=t==="GB"?"EN":"MULT";e.sort((a,o)=>a.language===n?-1:o.language===n?1:0),e.sort((a,o)=>!a.term&&o.term?-1:a.term&&!o.term?1:0),i=[e[0]]}return r&&(i=i.map(gn)),i}var Xt=e=>window.setTimeout(e);function qe(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(hn).filter(ht);return r.length||(r=[t]),r}function Kt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(dn)}function Y(){return document.getElementsByTagName(ss)?.[0]}function xn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,n]of Object.entries(cs)){let a=r.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[i]=a)}return t}var _e={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},bn=1e3;function ls(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function vn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!_e.serializableTypes.includes(r))return r}return e}function ds(e,t){if(!_e.ignoredProperties.includes(e))return vn(t)}var ai={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(l=>{l!=null&&(ls(l)?i:n).push(l)}),i.length&&(a+=" "+i.map(vn).join(" "));let{pathname:o,search:s}=window.location,c=`${_e.delimiter}page=${o}${s}`;c.length>bn&&(c=`${c.slice(0,bn)}<trunc>`),a+=c,n.length&&(a+=`${_e.delimiter}facts=`,a+=JSON.stringify(n,ds)),window.lana?.log(a,_e)}};function Qt(e){Object.assign(_e,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in _e&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var En={LOCAL:"local",PROD:"prod",STAGE:"stage"},oi={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},si=new Set,ci=new Set,yn=new Map,An={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},Sn={filter:({level:e})=>e!==oi.DEBUG},hs={filter:()=>!1};function ps(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&zt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:performance.now().toFixed(3)}}function ms(e){[...ci].every(t=>t(e))&&si.forEach(t=>t(e))}function Tn(e){let t=(yn.get(e)??0)+1;yn.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>Tn(`${i.namespace}/${n}`),updateConfig:Qt};return Object.values(oi).forEach(n=>{i[n]=(a,...o)=>ms(ps(n,a,e,o,r))}),Object.seal(i)}function Zt(...e){e.forEach(t=>{let{append:r,filter:i}=t;zt(i)&&ci.add(i),zt(r)&&si.add(r)})}function us(e={}){let{name:t}=e,r=b(O("commerce.debug",{search:!0,storage:!0}),t===En.LOCAL);return Zt(r?An:Sn),t===En.PROD&&Zt(ai),ie}function fs(){si.clear(),ci.clear()}var ie={...Tn(Rr),Level:oi,Plugins:{consoleAppender:An,debugFilter:Sn,quietFilter:hs,lanaAppender:ai},init:us,reset:fs,use:Zt};var We=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let n=r.response.headers?.get(nt);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,n])=>`${i}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var gs={[ae]:Sr,[xe]:Tr,[de]:wr},xs={[ae]:Cr,[de]:Lr},ut,Ee=class{constructor(t){$(this,ut);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",xe);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=ie.module("mas-element")}update(){[ae,xe,de].forEach(t=>{this.wrapperElement.classList.toggle(gs[t],t===this.state)})}notify(){(this.state===de||this.state===ae)&&(this.state===de?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===ae&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof We&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(xs[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){G(this,ut,Y()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return de===i?Promise.resolve(this.wrapperElement):ae===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=de,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Xt(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=ae,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...w(this,ut)?.duration}),Xt(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=xe,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!Y()||this.timer)return;let{error:r,options:i,state:n,value:a,version:o}=this;this.state=xe,this.timer=Xt(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===xe&&this.version===o&&(this.state=n,this.error=r,this.value=a,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,i)}})}};ut=new WeakMap;function wn(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Jt(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,wn(t)),n}function _n(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,wn(t)),e):null}function bs(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Le,Pe=class Pe extends HTMLAnchorElement{constructor(){super();g(this,"masElement",new Ee(this));$(this,Le);this.setAttribute("is",Pe.is)}get isUptLink(){return!0}initializeWcsData(r,i){this.setAttribute("data-wcs-osi",r),i&&this.setAttribute("data-promotion-code",i)}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),G(this,Le,ot()),w(this,Le)&&(this.log=w(this,Le).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),G(this,Le,void 0)}requestUpdate(r=!1){this.masElement.requestUpdate(r)}onceSettled(){return this.masElement.onceSettled()}async render(){let r=ot();if(!r)return!1;this.dataset.imsCountry||r.imsCountryPromise.then(o=>{o&&(this.dataset.imsCountry=o)});let i=r.collectCheckoutOptions({},this);if(!i.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(i),a=r.resolveOfferSelectors(i);try{let[[o]]=await Promise.all(a),{country:s,language:c,env:l}=i,d=`locale=${c}_${s}&country=${s}&offer_id=${o.offerId}`,m=this.getAttribute("data-promotion-code");m&&(d+=`&promotion_code=${encodeURIComponent(m)}`),this.href=`${bs(l)}?${d}`,this.masElement.toggleResolved(n,o,i)}catch(o){let s=new Error(`Could not resolve offer selectors for id: ${i.wcsOsi}.`,o.message);return this.masElement.toggleFailed(n,s,i),!1}}static createFrom(r){let i=new Pe;for(let n of r.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?i.setAttribute("class",n.value.replace("upt-link","").trim()):i.setAttribute(n.name,n.value));return i.innerHTML=r.innerHTML,i.setAttribute("tabindex",0),i}};Le=new WeakMap,g(Pe,"is","upt-link"),g(Pe,"tag","a"),g(Pe,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var Ce=Pe;window.customElements.get(Ce.is)||window.customElements.define(Ce.is,Ce,{extends:Ce.tag});function Pn(e){return e&&(e.startsWith("plans")?"plans":e)}var Cn="download",Ln="upgrade",Rn={e:"EDU",t:"TEAM"};function Mn(e,t={},r=""){let i=Y();if(!i)return null;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:m,quantity:p,wcsOsi:h,extraOptions:f,analyticsId:u}=i.collectCheckoutOptions(t),v=Jt(e,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:m,quantity:p,wcsOsi:h,extraOptions:f,analyticsId:u});return r&&(v.innerHTML=`<span style="pointer-events: none;">${r}</span>`),v}function Nn(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Ee(this))}attributeChangedCallback(i,n,a){this.masElement.attributeChangedCallback(i,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return Rn[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return Rn[i]??i}get is3in1Modal(){return Object.values(Te).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let n=Y();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(m=>{m&&(this.dataset.imsCountry=m)}),i.imsCountry=null;let a=n.collectCheckoutOptions(i,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(m){this.masElement.log?.error("cannot parse exta checkout options",m)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let c=n.resolveOfferSelectors(a),l=await Promise.all(c);l=l.map(m=>mt(m,a)),a.country=this.dataset.imsCountry||a.country;let d=await n.buildCheckoutAction?.(l.flat(),{...o,...a},this);return this.renderOffers(l.flat(),a,{},d,s)}renderOffers(i,n,a={},o=void 0,s=void 0){let c=Y();if(!c)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"{}"),...n,...a},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(Cn,Ln),this.masElement.toggleResolved(s,i,n);let{url:d,text:m,className:p,handler:h}=o;d&&this.setCheckoutUrl(d),m&&(this.firstElementChild.innerHTML=m),p&&this.classList.add(...p.split(" ")),h&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=h.bind(this))}if(i.length){if(this.masElement.toggleResolved(s,i,n)){if(!this.classList.contains(Cn)&&!this.classList.contains(Ln)){let d=c.buildCheckoutURL(i,n);this.setCheckoutUrl(n.modal==="true"?"#":d)}return!0}}else{let d=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,d,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let n=Y();if(!n)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:m,promotionCode:p,quantity:h,wcsOsi:f}=n.collectCheckoutOptions(i);return _n(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:m,promotionCode:p,quantity:h,wcsOsi:f}),!0}}}var ft=class ft extends Nn(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Mn(ft,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(ft,"is","checkout-link"),g(ft,"tag","a");var he=ft;window.customElements.get(he.is)||window.customElements.define(he.is,he,{extends:he.tag});var vs="p_draft_landscape",Es="/store/",ys=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),li=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),As=["env","workflowStep","clientId","country"],On=e=>ys.get(e)??e;function di(e,t,r){for(let[i,n]of Object.entries(e)){let a=On(i);n!=null&&r.has(a)&&t.set(a,n)}}function Ss(e){switch(e){case Hr.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Ts(e,t){for(let r in e){let i=e[r];for(let[n,a]of Object.entries(i)){if(a==null)continue;let o=On(n);t.set(`items[${r}][${o}]`,a)}}}function ws({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===Te.CRM?"creative":"mini_plans"),e}function In(e){_s(e);let{env:t,items:r,workflowStep:i,marketSegment:n,customerSegment:a,offerType:o,productArrangementCode:s,landscape:c,modal:l,is3in1:d,preselectPlan:m,...p}=e,h=new URL(Ss(t));if(h.pathname=`${Es}${i}`,i!==q.SEGMENTATION&&i!==q.CHANGE_PLAN_TEAM_PLANS&&Ts(r,h.searchParams),di({...p},h.searchParams,li),c===be.DRAFT&&di({af:vs},h.searchParams,li),i===q.SEGMENTATION){let f={marketSegment:n,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(u=>u.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};m?.toLowerCase()==="edu"?h.searchParams.set("ms","EDU"):m?.toLowerCase()==="team"&&h.searchParams.set("cs","TEAM"),di(f,h.searchParams,li),h.searchParams.get("ot")==="PROMOTION"&&h.searchParams.delete("ot"),h=ws({url:h,modal:l,is3in1:d})}return h.toString()}function _s(e){for(let t of As)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==q.SEGMENTATION&&e.workflowStep!==q.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var P=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:q.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:le.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:be.PUBLISHED});function kn({settings:e,providers:t}){function r(a,o){let{checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:m,quantity:p,preselectPlan:h,env:f}=e,u={checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:m,quantity:p,preselectPlan:h,env:f};if(o)for(let Oe of t.checkout)Oe(o,u);let{checkoutMarketSegment:v,checkoutWorkflowStep:_=c,imsCountry:y,country:E=y??l,language:T=d,quantity:C=p,entitlement:M,upgrade:B,modal:j,perpetual:k,promotionCode:L=m,wcsOsi:F,extraOptions:Z,...fe}=Object.assign(u,o?.dataset??{},a??{}),ce=pt(_,q,P.checkoutWorkflowStep);return u=jt({...fe,extraOptions:Z,checkoutClientId:s,checkoutMarketSegment:v,country:E,quantity:qe(C,P.quantity),checkoutWorkflowStep:ce,language:T,entitlement:b(M),upgrade:b(B),modal:j,perpetual:b(k),promotionCode:Wt(L).effectivePromoCode,wcsOsi:Kt(F),preselectPlan:h}),u}function i(a,o){if(!Array.isArray(a)||!a.length||!o)return"";let{env:s,landscape:c}=e,{checkoutClientId:l,checkoutMarketSegment:d,checkoutWorkflowStep:m,country:p,promotionCode:h,quantity:f,preselectPlan:u,ms:v,cs:_,...y}=r(o),E=document.querySelector("meta[name=mas-ff-3in1]"),T=Object.values(Te).includes(o.modal)&&(!E||E.content!=="off"),C=window.frameElement||T?"if":"fp",[{productArrangementCode:M,marketSegments:[B],customerSegment:j,offerType:k}]=a,L=v??B??d,F=_??j;u?.toLowerCase()==="edu"?L="EDU":u?.toLowerCase()==="team"&&(F="TEAM");let Z={is3in1:T,checkoutPromoCode:h,clientId:l,context:C,country:p,env:s,items:[],marketSegment:L,customerSegment:F,offerType:k,productArrangementCode:M,workflowStep:m,landscape:c,...y},fe=f[0]>1?f[0]:void 0;if(a.length===1){let{offerId:ce}=a[0];Z.items.push({id:ce,quantity:fe})}else Z.items.push(...a.map(({offerId:ce,productArrangementCode:Oe})=>({id:ce,quantity:fe,...T?{productArrangementCode:Oe}:{}})));return In(Z)}let{createCheckoutLink:n}=he;return{CheckoutLink:he,CheckoutWorkflowStep:q,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:n}}function Ps({interval:e=200,maxAttempts:t=25}={}){let r=ie.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function Cs(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Ls(e){let t=ie.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function Hn({}){let e=Ps(),t=Cs(e),r=Ls(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var Dn=window.masPriceLiterals;function Bn(e){if(Array.isArray(Dn)){let t=i=>Dn.find(n=>Wr(n.lang,i)),r=t(e.language)??t(P.language);if(r)return Object.freeze(r)}return{}}var hi=function(e,t){return hi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},hi(e,t)};function gt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");hi(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var A=function(){return A=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},A.apply(this,arguments)};function er(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var x;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(x||(x={}));var R;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(R||(R={}));var Re;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Re||(Re={}));function pi(e){return e.type===R.literal}function Un(e){return e.type===R.argument}function tr(e){return e.type===R.number}function rr(e){return e.type===R.date}function ir(e){return e.type===R.time}function nr(e){return e.type===R.select}function ar(e){return e.type===R.plural}function Fn(e){return e.type===R.pound}function or(e){return e.type===R.tag}function sr(e){return!!(e&&typeof e=="object"&&e.type===Re.number)}function xt(e){return!!(e&&typeof e=="object"&&e.type===Re.dateTime)}var mi=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Rs=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function $n(e){var t={};return e.replace(Rs,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Gn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function qn(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Gn).filter(function(p){return p.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],c=o.slice(1),l=0,d=c;l<d.length;l++){var m=d[l];if(m.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Ms(e){return e.replace(/^(.*?)-/,"")}var zn=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Wn=/^(@+)?(\+|#+)?[rs]?$/g,Ns=/(\*)(0+)|(#+)(0+)|(0+)/g,Yn=/^(0+)$/;function Vn(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(Wn,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function Xn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Os(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Yn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function jn(e){var t={},r=Xn(e);return r||t}function Kn(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ms(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=A(A(A({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return A(A({},c),jn(l))},{}));continue;case"engineering":t=A(A(A({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return A(A({},c),jn(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(Ns,function(c,l,d,m,p,h){if(l)t.minimumIntegerDigits=d.length;else{if(m&&p)throw new Error("We currently do not support maximum integer digits");if(h)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Yn.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(zn.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(zn,function(c,l,d,m,p,h){return d==="*"?t.minimumFractionDigits=l.length:m&&m[0]==="#"?t.maximumFractionDigits=m.length:p&&h?(t.minimumFractionDigits=p.length,t.maximumFractionDigits=p.length+h.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var a=n.options[0];a==="w"?t=A(A({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=A(A({},t),Vn(a)));continue}if(Wn.test(n.stem)){t=A(A({},t),Vn(n.stem));continue}var o=Xn(n.stem);o&&(t=A(A({},t),o));var s=Os(n.stem);s&&(t=A(A({},t),s))}return t}var bt={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Qn(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),c="a",l=Is(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;o-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function Is(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=bt[i||""]||bt[r||""]||bt["".concat(r,"-001")]||bt["001"];return n[0]}var ui,ks=new RegExp("^".concat(mi.source,"*")),Hs=new RegExp("".concat(mi.source,"*$"));function S(e,t){return{start:e,end:t}}var Ds=!!String.prototype.startsWith,Bs=!!String.fromCodePoint,Us=!!Object.fromEntries,Fs=!!String.prototype.codePointAt,$s=!!String.prototype.trimStart,Gs=!!String.prototype.trimEnd,zs=!!Number.isSafeInteger,Vs=zs?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},gi=!0;try{Zn=ra("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),gi=((ui=Zn.exec("a"))===null||ui===void 0?void 0:ui[0])==="a"}catch{gi=!1}var Zn,Jn=Ds?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},xi=Bs?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},ea=Us?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},ta=Fs?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},js=$s?function(t){return t.trimStart()}:function(t){return t.replace(ks,"")},qs=Gs?function(t){return t.trimEnd()}:function(t){return t.replace(Hs,"")};function ra(e,t){return new RegExp(e,t)}var bi;gi?(fi=ra("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),bi=function(t,r){var i;fi.lastIndex=r;var n=fi.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):bi=function(t,r){for(var i=[];;){var n=ta(t,r);if(n===void 0||na(n)||Xs(n))break;i.push(n),r+=n>=65536?2:1}return xi.apply(void 0,i)};var fi,ia=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:R.pound,location:S(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(x.UNMATCHED_CLOSING_TAG,S(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&vi(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:R.literal,value:"<".concat(n,"/>"),location:S(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!vi(this.char()))return this.error(x.INVALID_TAG,S(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(x.UNMATCHED_CLOSING_TAG,S(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:R.tag,value:n,children:o,location:S(i,this.clonePosition())},err:null}:this.error(x.INVALID_TAG,S(s,this.clonePosition())))}else return this.error(x.UNCLOSED_TAG,S(i,this.clonePosition()))}else return this.error(x.INVALID_TAG,S(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Ys(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=S(i,this.clonePosition());return{val:{type:R.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Ws(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return xi.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),xi(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(x.EMPTY_ARGUMENT,S(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(x.MALFORMED_ARGUMENT,S(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:R.argument,value:n,location:S(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(x.MALFORMED_ARGUMENT,S(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=bi(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=S(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(x.EXPECT_ARGUMENT_TYPE,S(o,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var d=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var p=qs(m.val);if(p.length===0)return this.error(x.EXPECT_ARGUMENT_STYLE,S(this.clonePosition(),this.clonePosition()));var h=S(d,this.clonePosition());l={style:p,styleLocation:h}}var f=this.tryParseArgumentClose(n);if(f.err)return f;var u=S(n,this.clonePosition());if(l&&Jn(l?.style,"::",0)){var v=js(l.style.slice(2));if(s==="number"){var m=this.parseNumberSkeletonFromString(v,l.styleLocation);return m.err?m:{val:{type:R.number,value:i,location:u,style:m.val},err:null}}else{if(v.length===0)return this.error(x.EXPECT_DATE_TIME_SKELETON,u);var _=v;this.locale&&(_=Qn(v,this.locale));var p={type:Re.dateTime,pattern:_,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?$n(_):{}},y=s==="date"?R.date:R.time;return{val:{type:y,value:i,location:u,style:p},err:null}}}return{val:{type:s==="number"?R.number:s==="date"?R.date:R.time,value:i,location:u,style:(a=l?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var E=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(x.EXPECT_SELECT_ARGUMENT_OPTIONS,S(E,A({},E)));this.bumpSpace();var T=this.parseIdentifierIfPossible(),C=0;if(s!=="select"&&T.value==="offset"){if(!this.bumpIf(":"))return this.error(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,x.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),T=this.parseIdentifierIfPossible(),C=m.val}var M=this.tryParsePluralOrSelectOptions(t,s,r,T);if(M.err)return M;var f=this.tryParseArgumentClose(n);if(f.err)return f;var B=S(n,this.clonePosition());return s==="select"?{val:{type:R.select,value:i,options:ea(M.val),location:B},err:null}:{val:{type:R.plural,value:i,options:ea(M.val),offset:C,pluralType:s==="plural"?"cardinal":"ordinal",location:B},err:null}}default:return this.error(x.INVALID_ARGUMENT_TYPE,S(o,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(x.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,S(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=qn(t)}catch{return this.error(x.INVALID_NUMBER_SKELETON,r)}return{val:{type:Re.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?Kn(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],c=new Set,l=n.value,d=n.location;;){if(l.length===0){var m=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var p=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_SELECTOR,x.INVALID_PLURAL_ARGUMENT_SELECTOR);if(p.err)return p;d=S(m,this.clonePosition()),l=this.message.slice(m.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?x.DUPLICATE_SELECT_ARGUMENT_SELECTOR:x.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,d);l==="other"&&(o=!0),this.bumpSpace();var h=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:x.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,S(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,i);if(f.err)return f;var u=this.tryParseArgumentClose(h);if(u.err)return u;s.push([l,{value:f.val,location:S(h,this.clonePosition())}]),c.add(l),this.bumpSpace(),a=this.parseIdentifierIfPossible(),l=a.value,d=a.location}return s.length===0?this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR:x.EXPECT_PLURAL_ARGUMENT_SELECTOR,S(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(x.MISSING_OTHER_CLAUSE,S(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var c=S(n,this.clonePosition());return a?(o*=i,Vs(o)?{val:o,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=ta(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Jn(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&na(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function vi(e){return e>=97&&e<=122||e>=65&&e<=90}function Ws(e){return vi(e)||e===47}function Ys(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function na(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Xs(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Ei(e){e.forEach(function(t){if(delete t.location,nr(t)||ar(t))for(var r in t.options)delete t.options[r].location,Ei(t.options[r].value);else tr(t)&&sr(t.style)||(rr(t)||ir(t))&&xt(t.style)?delete t.style.location:or(t)&&Ei(t.children)})}function aa(e,t){t===void 0&&(t={}),t=A({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new ia(e,t).parse();if(r.err){var i=SyntaxError(x[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||Ei(r.val),r.val}function vt(e,t){var r=t&&t.cache?t.cache:tc,i=t&&t.serializer?t.serializer:ec,n=t&&t.strategy?t.strategy:Qs;return n(e,{cache:r,serializer:i})}function Ks(e){return e==null||typeof e=="number"||typeof e=="boolean"}function oa(e,t,r,i){var n=Ks(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function sa(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function yi(e,t,r,i,n){return r.bind(t,e,i,n)}function Qs(e,t){var r=e.length===1?oa:sa;return yi(e,this,r,t.cache.create(),t.serializer)}function Zs(e,t){return yi(e,this,sa,t.cache.create(),t.serializer)}function Js(e,t){return yi(e,this,oa,t.cache.create(),t.serializer)}var ec=function(){return JSON.stringify(arguments)};function Ai(){this.cache=Object.create(null)}Ai.prototype.get=function(e){return this.cache[e]};Ai.prototype.set=function(e,t){this.cache[e]=t};var tc={create:function(){return new Ai}},cr={variadic:Zs,monadic:Js};var Me;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Me||(Me={}));var Et=function(e){gt(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Si=function(e){gt(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Me.INVALID_VALUE,a)||this}return t}(Et);var ca=function(e){gt(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Me.INVALID_VALUE,n)||this}return t}(Et);var la=function(e){gt(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Me.MISSING_VALUE,i)||this}return t}(Et);var z;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(z||(z={}));function rc(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==z.literal||r.type!==z.literal?t.push(r):i.value+=r.value,t},[])}function ic(e){return typeof e=="function"}function yt(e,t,r,i,n,a,o){if(e.length===1&&pi(e[0]))return[{type:z.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var d=l[c];if(pi(d)){s.push({type:z.literal,value:d.value});continue}if(Fn(d)){typeof a=="number"&&s.push({type:z.literal,value:r.getNumberFormat(t).format(a)});continue}var m=d.value;if(!(n&&m in n))throw new la(m,o);var p=n[m];if(Un(d)){(!p||typeof p=="string"||typeof p=="number")&&(p=typeof p=="string"||typeof p=="number"?String(p):""),s.push({type:typeof p=="string"?z.literal:z.object,value:p});continue}if(rr(d)){var h=typeof d.style=="string"?i.date[d.style]:xt(d.style)?d.style.parsedOptions:void 0;s.push({type:z.literal,value:r.getDateTimeFormat(t,h).format(p)});continue}if(ir(d)){var h=typeof d.style=="string"?i.time[d.style]:xt(d.style)?d.style.parsedOptions:i.time.medium;s.push({type:z.literal,value:r.getDateTimeFormat(t,h).format(p)});continue}if(tr(d)){var h=typeof d.style=="string"?i.number[d.style]:sr(d.style)?d.style.parsedOptions:void 0;h&&h.scale&&(p=p*(h.scale||1)),s.push({type:z.literal,value:r.getNumberFormat(t,h).format(p)});continue}if(or(d)){var f=d.children,u=d.value,v=n[u];if(!ic(v))throw new ca(u,"function",o);var _=yt(f,t,r,i,n,a),y=v(_.map(function(C){return C.value}));Array.isArray(y)||(y=[y]),s.push.apply(s,y.map(function(C){return{type:typeof C=="string"?z.literal:z.object,value:C}}))}if(nr(d)){var E=d.options[p]||d.options.other;if(!E)throw new Si(d.value,p,Object.keys(d.options),o);s.push.apply(s,yt(E.value,t,r,i,n));continue}if(ar(d)){var E=d.options["=".concat(p)];if(!E){if(!Intl.PluralRules)throw new Et(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Me.MISSING_INTL_API,o);var T=r.getPluralRules(t,{type:d.pluralType}).select(p-(d.offset||0));E=d.options[T]||d.options.other}if(!E)throw new Si(d.value,p,Object.keys(d.options),o);s.push.apply(s,yt(E.value,t,r,i,n,p-(d.offset||0)));continue}}return rc(s)}function nc(e,t){return t?A(A(A({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=A(A({},e[i]),t[i]||{}),r},{})):e}function ac(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=nc(e[i],t[i]),r},A({},e)):e}function Ti(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function oc(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:vt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,er([void 0],r,!1)))},{cache:Ti(e.number),strategy:cr.variadic}),getDateTimeFormat:vt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,er([void 0],r,!1)))},{cache:Ti(e.dateTime),strategy:cr.variadic}),getPluralRules:vt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,er([void 0],r,!1)))},{cache:Ti(e.pluralRules),strategy:cr.variadic})}}var da=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var c=s.reduce(function(l,d){return!l.length||d.type!==z.literal||typeof l[l.length-1]!="string"?l.push(d.value):l[l.length-1]+=d.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(o){return yt(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=ac(e.formats,i),this.formatters=n&&n.formatters||oc(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=aa,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var ha=da;var sc=/[0-9\-+#]/,cc=/[^\d\-+#]/g;function pa(e){return e.search(sc)}function lc(e="#.##"){let t={},r=e.length,i=pa(e);t.prefix=i>0?e.substring(0,i):"";let n=pa(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(cc);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function dc(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,hc(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function hc(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let c=0;c<o;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function pc(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=lc(e),n=dc(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var ma=pc;var ua=".",mc=",",ga=/^\s+/,xa=/\s+$/,fa="&nbsp;",wi=e=>e*12,ba=(e,t)=>{let{start:r,end:i,displaySummary:{amount:n,duration:a,minProductQuantity:o,outcomeType:s}={}}=e;if(!(n&&a&&s&&o))return!1;let c=t?new Date(t):new Date;if(!r||!i)return!1;let l=new Date(r),d=new Date(i);return c>=l&&c<=d},Ne={MONTH:"MONTH",YEAR:"YEAR"},uc={[J.ANNUAL]:12,[J.MONTHLY]:1,[J.THREE_YEARS]:36,[J.TWO_YEARS]:24},_i=(e,t)=>({accept:e,round:t}),fc=[_i(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),_i(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),_i(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Pi={[Se.YEAR]:{[J.MONTHLY]:Ne.MONTH,[J.ANNUAL]:Ne.YEAR},[Se.MONTH]:{[J.MONTHLY]:Ne.MONTH}},gc=(e,t)=>e.indexOf(`'${t}'`)===0,xc=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=Ea(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+vc(e)),r},bc=e=>{let t=Ec(e),r=gc(e,t),i=e.replace(/'.*?'/,""),n=ga.test(i)||xa.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},va=e=>e.replace(ga,fa).replace(xa,fa),vc=e=>e.match(/#(.?)#/)?.[1]===ua?mc:ua,Ec=e=>e.match(/'(.*?)'/)?.[1]??"",Ea=e=>e.match(/0(.?)0/)?.[1]??"";function Ye({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:c}=bc(e),l=r?Ea(e):"",d=xc(e,r),m=r?2:0,p=a(t,{currencySymbol:o}),h=i?p.toLocaleString("hi-IN",{minimumFractionDigits:m,maximumFractionDigits:m}):ma(d,p),f=r?h.lastIndexOf(l):h.length,u=h.substring(0,f),v=h.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,h).replace(/SYMBOL/,o),currencySymbol:o,decimals:v,decimalsDelimiter:l,hasCurrencySpace:c,integer:u,isCurrencyFirst:s,recurrenceTerm:n}}var ya=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=uc[r]??1;return Ye(e,n>1?Ne.MONTH:Pi[t]?.[r],a=>{let o={divisor:n,price:a,usePrecision:i},{round:s}=fc.find(({accept:c})=>c(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},Aa=({commitment:e,term:t,...r})=>Ye(r,Pi[e]?.[t]),Sa=e=>{let{commitment:t,instant:r,price:i,originalPrice:n,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:c}=e;if(t===Se.YEAR&&c===J.MONTHLY){if(!o)return Ye(e,Ne.YEAR,wi);let{displaySummary:{outcomeType:l,duration:d,minProductQuantity:m=1}={}}=o;switch(l){case"PERCENTAGE_DISCOUNT":if(s>=m&&ba(o,r)){let p=parseInt(d.replace("P","").replace("M",""));if(isNaN(p))return wi(i);let h=s*n*p,f=s*a*(12-p),u=Math.round((h+f)*100)/100;return Ye({...e,price:u},Ne.YEAR)}default:return Ye(e,Ne.YEAR,()=>wi(a??i))}}return Ye(e,Pi[t]?.[c])};var Ci={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},yc=pn("ConsonantTemplates/price"),Ac=/<\/?[^>]+(>|$)/g,D={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},ye={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},Li="TAX_EXCLUSIVE",Sc=e=>ln(e)?Object.entries(e).filter(([,t])=>je(t)||Vt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+cn(i)+'"'}`,""):"",U=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+D.disabled}"${Sc(r)}>${i?va(t):t??""}</span>`;function pe(e,t,r,i){let n=e[r];if(n==null)return"";try{return new ha(n.replace(Ac,""),t).format(i)}catch{return yc.error("Failed to format literal:",n),""}}function Tc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:n,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:d,taxInclusivityLabel:m},p={}){let h=U(D.currencySymbol,i),f=U(D.currencySpace,o?"&nbsp;":""),u="";return t?u=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(u=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(u+=h+f),u+=U(D.integer,s),u+=U(D.decimalsDelimiter,a),u+=U(D.decimals,n),c||(u+=f+h),u+=U(D.recurrence,l,null,!0),u+=U(D.unitType,d,null,!0),u+=U(D.taxInclusivity,m,!0),U(e,u,{...p})}var X=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:n=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:d,literals:m={},quantity:p=1,space:h=!1}={},{commitment:f,offerSelectorIds:u,formatString:v,price:_,priceWithoutDiscount:y,taxDisplay:E,taxTerm:T,term:C,usePrecision:M,promotion:B}={},j={})=>{Object.entries({country:a,formatString:v,language:d,price:_}).forEach(([co,lo])=>{if(lo==null)throw new Error(`Argument "${co}" is missing for osi ${u?.toString()}, country ${a}, language ${d}`)});let k={...Ci,...m},L=`${d.toLowerCase()}-${a.toUpperCase()}`,F=r&&y?y:_,Z=t?ya:Aa;i&&(Z=Sa);let{accessiblePrice:fe,recurrenceTerm:ce,...Oe}=Z({commitment:f,formatString:v,instant:n,isIndianPrice:a==="IN",originalPrice:_,priceWithoutDiscount:y,price:t?_:F,promotion:B,quantity:p,term:C,usePrecision:M}),hr="",pr="",mr="";b(s)&&ce&&(mr=pe(k,L,ye.recurrenceLabel,{recurrenceTerm:ce}));let Pt="";b(c)&&(h&&(Pt+=" "),Pt+=pe(k,L,ye.perUnitLabel,{perUnit:"LICENSE"}));let Ct="";b(l)&&T&&(h&&(Ct+=" "),Ct+=pe(k,L,E===Li?ye.taxExclusiveLabel:ye.taxInclusiveLabel,{taxTerm:T})),r&&(hr=pe(k,L,ye.strikethroughAriaLabel,{strikethroughPrice:hr})),e&&(pr=pe(k,L,ye.alternativePriceAriaLabel,{alternativePrice:pr}));let Ie=D.container;if(t&&(Ie+=" "+D.containerOptical),r&&(Ie+=" "+D.containerStrikethrough),e&&(Ie+=" "+D.containerAlternative),i&&(Ie+=" "+D.containerAnnual),b(o))return Tc(Ie,{...Oe,accessibleLabel:hr,altAccessibleLabel:pr,recurrenceLabel:mr,perUnitLabel:Pt,taxInclusivityLabel:Ct},j);let{currencySymbol:Ii,decimals:io,decimalsDelimiter:no,hasCurrencySpace:ki,integer:ao,isCurrencyFirst:oo}=Oe,ke=[ao,no,io];oo?(ke.unshift(ki?"\xA0":""),ke.unshift(Ii)):(ke.push(ki?"\xA0":""),ke.push(Ii)),ke.push(mr,Pt,Ct);let so=ke.join("");return U(Ie,so,j)},Ta=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||b(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${n?X({displayStrikethrough:!0})(e,t,r)+"&nbsp;":""}${X({isAlternativePrice:n})(e,t,r)}`},wa=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let n={...e,displayTax:!1,displayPerUnit:!1},o=(e.displayOldPrice===void 0||b(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?X({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${X({isAlternativePrice:o})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${X({displayAnnual:!0,instant:i})(n,t,r)}${U(D.containerAnnualSuffix,")")}`},_a=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${X({isAlternativePrice:e.displayOldPrice})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${X({displayAnnual:!0})(i,t,r)}${U(D.containerAnnualSuffix,")")}`};var At={...D,containerLegal:"price-legal",planType:"price-plan-type"},lr={...ye,planTypeLabel:"planTypeLabel"};function wc(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},n={}){let a="";return a+=U(At.unitType,t,null,!0),r&&i&&(r+=". "),a+=U(At.taxInclusivity,r,!0),a+=U(At.planType,i,null),U(e,a,{...n})}var Pa=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:n,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:c}={},l={})=>{let d={...Ci,...a},m=`${n.toLowerCase()}-${e.toUpperCase()}`,p="";b(t)&&(p=pe(d,m,lr.perUnitLabel,{perUnit:"LICENSE"}));let h="";e==="US"&&n==="en"&&(r=!1),b(r)&&s&&(h=pe(d,m,o===Li?lr.taxExclusiveLabel:lr.taxInclusiveLabel,{taxTerm:s}));let f="";b(i)&&c&&(f=pe(d,m,lr.planTypeLabel,{planType:c}));let u=At.container;return u+=" "+At.containerLegal,wc(u,{perUnitLabel:p,taxInclusivityLabel:h,planTypeLabel:f},l)};var Ca=X(),La=Ta(),Ra=X({displayOptical:!0}),Ma=X({displayStrikethrough:!0}),Na=X({displayAnnual:!0}),Oa=X({displayOptical:!0,isAlternativePrice:!0}),Ia=X({isAlternativePrice:!0}),ka=_a(),Ha=wa(),Da=Pa;var _c=(e,t)=>{if(!(!ht(e)||!ht(t)))return Math.floor((t-e)/t*100)},Ba=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=_c(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Ua=Ba();var $a="INDIVIDUAL_COM",Ri="TEAM_COM",Ga="INDIVIDUAL_EDU",Mi="TEAM_EDU",Fa=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Pc={[$a]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[Ri]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[Ga]:["LT_lt","LV_lv","SA_en","SG_en"],[Mi]:["SG_en","KR_ko"]},Cc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},Lc=[$a,Ri,Ga,Mi],Rc=e=>[Ri,Mi].includes(e),Mc=(e,t,r,i)=>{let n=`${e}_${t}`,a=`${r}_${i}`,o=Cc[n];if(o){let s=Lc.indexOf(a);return o[s]}return Rc(a)},Nc=(e,t,r,i)=>{let n=`${e}_${t}`;if(Fa.includes(e)||Fa.includes(n))return!0;let a=Pc[`${r}_${i}`];return a?a.includes(e)||a.includes(n)?!0:P.displayTax:P.displayTax},Oc=async(e,t,r,i)=>{let n=Nc(e,t,r,i);return{displayTax:n,forceTaxExclusive:n?Mc(e,t,r,i):P.forceTaxExclusive}},St=class St extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Ee(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let i=Y();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:m,promotionCode:p,quantity:h,alternativePrice:f,template:u,wcsOsi:v}=i.collectPriceOptions(r);return Jt(St,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:m,promotionCode:p,quantity:h,alternativePrice:f,template:u,wcsOsi:v})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===ae}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=Y();if(!i)return!1;let n=i.collectPriceOptions(r,this),a={...i.settings,...n};if(!a.wcsOsi.length)return!1;try{let o=this.masElement.togglePending({});this.innerHTML="";let[s]=await i.resolveOfferSelectors(a),c=mt(await s,a),[l]=c;if(i.featureFlags[ve]){if(n.displayPerUnit===void 0&&(a.displayPerUnit=l.customerSegment!=="INDIVIDUAL"),n.displayTax===void 0||n.forceTaxExclusive===void 0){let{country:d,language:m}=a,[p=""]=l.marketSegments,h=await Oc(d,m,l.customerSegment,p);n.displayTax===void 0&&(a.displayTax=h?.displayTax||a.displayTax),n.forceTaxExclusive===void 0&&(a.forceTaxExclusive=h?.forceTaxExclusive||a.forceTaxExclusive),a.forceTaxExclusive&&(c=mt(c,a))}}else n.displayOldPrice===void 0&&(a.displayOldPrice=!0);return this.renderOffers(c,a,o)}catch(o){throw this.innerHTML="",o}}renderOffers(r,i,n=void 0){if(!this.isConnected)return;let a=Y();if(!a)return!1;if(n??(n=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(n,r,i)){this.innerHTML=a.buildPriceHTML(r,this.options);let o=this.closest("p, h3, div");if(!o||!o.querySelector('span[data-template="strikethrough"]')||o.querySelector(".alt-aria-label"))return!0;let s=o?.querySelectorAll('span[is="inline-price"]');return s.length>1&&s.length===o.querySelectorAll('span[data-template="strikethrough"]').length*2&&s.forEach(c=>{c.dataset.template!=="strikethrough"&&c.options&&!c.options.alternativePrice&&!c.isFailed&&(c.options.alternativePrice=!0,c.innerHTML=a.buildPriceHTML(r,c.options))}),!0}}else{let o=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,o,this.options))return this.innerHTML="",!0}return!1}};g(St,"is","inline-price"),g(St,"tag","span");var me=St;window.customElements.get(me.is)||window.customElements.define(me.is,me,{extends:me.tag});function za({literals:e,providers:t,settings:r}){function i(o,s=null){let c={country:r.country,language:r.language,locale:r.locale,literals:{...e.price}};if(s&&t?.price)for(let M of t.price)M(s,c);let{displayOldPrice:l,displayPerUnit:d,displayRecurrence:m,displayTax:p,displayPlanType:h,forceTaxExclusive:f,perpetual:u,displayAnnual:v,promotionCode:_,quantity:y,alternativePrice:E,wcsOsi:T,...C}=Object.assign(c,s?.dataset??{},o??{});return c=jt(Object.assign({...c,...C,displayOldPrice:b(l),displayPerUnit:b(d),displayRecurrence:b(m),displayTax:b(p),displayPlanType:b(h),forceTaxExclusive:b(f),perpetual:b(u),displayAnnual:b(v),promotionCode:Wt(_).effectivePromoCode,quantity:qe(y,P.quantity),alternativePrice:b(E),wcsOsi:Kt(T)})),c}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=Ua;break;case"strikethrough":l=Ma;break;case"annual":l=Na;break;case"legal":l=Da;break;default:s.template==="optical"&&s.alternativePrice?l=Oa:s.template==="optical"?l=Ra:s.displayAnnual&&o[0].planType==="ABM"?l=s.promotionCode?Ha:ka:s.alternativePrice?l=Ia:l=s.promotionCode?La:Ca}let[d]=o;return d={...d,...d.priceDetails},l({...r,...s},d)}let a=me.createInlinePrice;return{InlinePrice:me,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function Ic({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||P.language),t??(t=e?.split("_")?.[1]||P.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Va(e={},t){let r=t.featureFlags[ve],{commerce:i={}}=e,n=le.PRODUCTION,a=Ir,o=O("checkoutClientId",i)??P.checkoutClientId,s=pt(O("checkoutWorkflowStep",i),q,P.checkoutWorkflowStep),c=P.displayOldPrice,l=P.displayPerUnit,d=b(O("displayRecurrence",i),P.displayRecurrence),m=b(O("displayTax",i),P.displayTax),p=b(O("displayPlanType",i),P.displayPlanType),h=b(O("entitlement",i),P.entitlement),f=b(O("modal",i),P.modal),u=b(O("forceTaxExclusive",i),P.forceTaxExclusive),v=O("promotionCode",i)??P.promotionCode,_=qe(O("quantity",i)),y=O("wcsApiKey",i)??P.wcsApiKey,E=i?.env==="stage",T=be.PUBLISHED;["true",""].includes(i.allowOverride)&&(E=(O(Nr,i,{metadata:!1})?.toLowerCase()??i?.env)==="stage",T=pt(O(Or,i),be,T)),E&&(n=le.STAGE,a=kr);let M=O(Mr)??e.preview,B=typeof M<"u"&&M!=="off"&&M!=="false",j={};B&&(j={preview:B});let k=O("mas-io-url")??e.masIOUrl??`https://www${n===le.STAGE?".stage":""}.adobe.com/mas/io`,L=O("preselect-plan")??void 0;return{...Ic(e),...j,displayOldPrice:c,checkoutClientId:o,checkoutWorkflowStep:s,displayPerUnit:l,displayRecurrence:d,displayTax:m,displayPlanType:p,entitlement:h,extraOptions:P.extraOptions,modal:f,env:n,forceTaxExclusive:u,promotionCode:v,quantity:_,alternativePrice:P.alternativePrice,wcsApiKey:y,wcsURL:a,landscape:T,masIOUrl:k,...L&&{preselectPlan:L}}}async function ja(e,t={},r=2,i=100){let n;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(n=o,n.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,i*(a+1)))}throw n}var Ni="wcs";function qa({settings:e}){let t=ie.module(Ni),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o,s=new Map;async function c(h,f,u=!0){let v=Y(),_=Pr;t.debug("Fetching:",h);let y="",E;if(h.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let T=new Map(f),[C]=h.offerSelectorIds,M=Date.now()+Math.random().toString(36).substring(2,7),B=`${Ni}:${C}:${M}${Dr}`,j=`${Ni}:${C}:${M}${Br}`,k;try{if(performance.mark(B),y=new URL(e.wcsURL),y.searchParams.set("offer_selector_ids",C),y.searchParams.set("country",h.country),y.searchParams.set("locale",h.locale),y.searchParams.set("landscape",r===le.STAGE?"ALL":e.landscape),y.searchParams.set("api_key",i),h.language&&y.searchParams.set("language",h.language),h.promotionCode&&y.searchParams.set("promotion_code",h.promotionCode),h.currency&&y.searchParams.set("currency",h.currency),E=await ja(y.toString(),{credentials:"omit"}),E.ok){let L=[];try{let F=await E.json();t.debug("Fetched:",h,F),L=F.resolvedOffers??[]}catch(F){t.error(`Error parsing JSON: ${F.message}`,{...F.context,...v?.duration})}L=L.map(Yt),f.forEach(({resolve:F},Z)=>{let fe=L.filter(({offerSelectorIds:ce})=>ce.includes(Z)).flat();fe.length&&(T.delete(Z),f.delete(Z),F(fe))})}else _=_r}catch(L){_=`Network error: ${L.message}`}finally{k=performance.measure(j,B),performance.clearMarks(B),performance.clearMeasures(j)}if(u&&f.size){t.debug("Missing:",{offerSelectorIds:[...f.keys()]});let L=xn(E);f.forEach(F=>{F.reject(new We(_,{...h,...L,response:E,measure:kt(k),...v?.duration}))})}}function l(){clearTimeout(o);let h=[...a.values()];a.clear(),h.forEach(({options:f,promises:u})=>c(f,u))}function d(h){if(!h||typeof h!="object")throw new TypeError("Cache must be a Map or similar object");let f=r===le.STAGE?"stage":"prod",u=h[f];if(!u||typeof u!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[v,_]of Object.entries(u))n.set(v,Promise.resolve(_.map(Yt)));t.debug(`Prefilled WCS cache with ${u.size} entries`)}function m(){let h=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${h} cache entries to stale cache`)}function p({country:h,language:f,perpetual:u=!1,promotionCode:v="",wcsOsi:_=[]}){let y=`${f}_${h}`;h!=="GB"&&!u&&(f="MULT");let E=[h,f,v].filter(T=>T).join("-").toLowerCase();return _.map(T=>{let C=`${T}-${E}`;if(n.has(C))return n.get(C);let M=new Promise((B,j)=>{let k=a.get(E);if(!k){let L={country:h,locale:y,offerSelectorIds:[]};h!=="GB"&&!u&&(L.language=f),k={options:L,promises:new Map},a.set(E,k)}v&&(k.options.promotionCode=v),k.options.offerSelectorIds.push(T),k.promises.set(T,{resolve:B,reject:j}),l()}).catch(B=>{if(s.has(C))return s.get(C);throw B});return n.set(C,M),M})}return{Commitment:Se,PlanType:un,Term:J,applyPlanType:Yt,resolveOfferSelectors:p,flushWcsCacheInternal:m,prefillWcsCache:d}}var Wa="mas-commerce-service",Ya="mas-commerce-service:start",Xa="mas-commerce-service:ready",Tt,Xe,Ke,Ka,Qa,Oi=class extends HTMLElement{constructor(){super(...arguments);$(this,Ke);$(this,Tt);$(this,Xe);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}get featureFlags(){return w(this,Xe)||G(this,Xe,{[ve]:Lt(this,Ke,Qa).call(this,ve)}),w(this,Xe)}activate(){let r=w(this,Ke,Ka),i=Va(r,this);Qt(r.lana);let n=ie.init(r.hostEnv).module("service");n.debug("Activating:",r);let o={price:Bn(i)},s={checkout:new Set,price:new Set},c={literals:o,providers:s,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...kn(c),...Hn(c),...za(c),...qa(c),...Fr,Log:ie,get defaults(){return P},get log(){return ie},get providers(){return{checkout(d){return s.checkout.add(d),()=>s.checkout.delete(d)},price(d){return s.price.add(d),()=>s.price.delete(d)},has:d=>s.price.has(d)||s.checkout.has(d)}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i});let l=new CustomEvent(It,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Xa),G(this,Tt,performance.measure(Xa,Ya)),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(Ya),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(fr).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":kt(w(this,Tt))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:a,responseStatus:o})=>n===0&&a===0&&o<200||o>=400),i=Array.from(new Map(r.map(n=>[n.name,n])).values());if(i.some(({name:n})=>/(\/fragment\?|web_commerce_artifact)/.test(n))){let n=i.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};Tt=new WeakMap,Xe=new WeakMap,Ke=new WeakSet,Ka=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(n=>{let a=this.getAttribute(n);a&&(i[n]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let a=this.getAttribute(n);if(a!=null){let o=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());i.commerce[o]=a}}),i},Qa=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||O(r))};window.customElements.get(Wa)||window.customElements.define(Wa,Oi);var to="merch-card-collection",kc=2e4,Hc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Dc={plans:!0},Bc=(e,{filter:t})=>e.filter(r=>r?.filters&&r?.filters.hasOwnProperty(t)),Uc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,Fc=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),$c=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),Gc=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Ae,Ze,_t,dr,ro,Qe=class extends Ja{constructor(){super();$(this,dr);$(this,Ae,{});$(this,Ze);$(this,_t);this.id=null,this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return ue`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(n=>setTimeout(()=>n(!1),kc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(l=>l.tagName==="MERCH-CARD");if(n.length===0)return;r.has("singleApp")&&this.singleApp&&n.forEach(l=>{l.updateFilters(l.name===this.singleApp)});let a=this.sort===oe.alphabetical?Fc:$c,s=[Bc,Uc,Gc,a].reduce((l,d)=>d(l,this),n).map((l,d)=>[l,d]);if(this.resultCount=s.length,this.page&&this.limit){let l=this.page*this.limit;this.hasMore=s.length>l,s=s.filter(([,d])=>d<l)}let c=new Map(s.reverse());for(let l of c.keys())this.prepend(l);n.forEach(l=>{c.has(l)?(l.size=l.filters[this.filter]?.size,l.style.removeProperty("display"),l.requestUpdate()):(l.style.display="none",l.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(vr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(rt,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){G(this,Ae,{}),this.overrides?.split(",").forEach(r=>{let[i,n]=r?.split(":");i&&n&&(w(this,Ae)[i]=n)})}connectedCallback(){super.connectedCallback(),G(this,Ze,ot()),w(this,Ze)&&G(this,_t,w(this,Ze).Log.module(to)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r,this.querySelectorAll("[placeholder]").forEach(n=>{let a=n.getAttribute("slot");this.header.placeholderKeys.includes(a)&&this.header.append(n)})}initializePlaceholders(){let r=this.data?.placeholders||{};for(let i of Object.keys(r)){let n=r[i],a=n.includes("<p>")?"div":"p",o=document.createElement(a);o.setAttribute("slot",i),o.setAttribute("placeholder",""),o.innerHTML=n,this.append(o)}}attachSidenav(r,i=!0){r&&(i&&this.parentElement.prepend(r),this.sidenav=r,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),Dc[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(it)))}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.id=r.getAttribute("fragment"),this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let n=this;function a(o,s){let c={cards:[],hierarchy:[],placeholders:o.placeholders};function l(d,m){for(let p of m){if(p.fieldName==="cards"){if(c.cards.findIndex(u=>u.id===p.identifier)!==-1)continue;c.cards.push(o.references[p.identifier].value);continue}let{fields:h}=o.references[p.identifier].value,f={label:h.label||"",icon:h.icon,iconLight:h.iconLight,queryLabel:h.queryLabel,cards:h.cards?h.cards.map(u=>s[u]||u):[],collections:[]};h.defaultchild&&(f.defaultchild=s[h.defaultchild]||h.defaultchild),d.push(f),l(f.collections,p.referencesTree)}}return l(c.hierarchy,o.referencesTree),c.hierarchy.length===0&&(n.filtered="all"),c}r.addEventListener(yr,o=>{Lt(this,dr,ro).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(Er,async o=>{this.data=a(o.detail,w(this,Ae));let{cards:s,hierarchy:c}=this.data,l=c.length===0&&o.detail.fields?.defaultchild?w(this,Ae)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...s);let d=(h,f)=>{for(let u of h)if(u.defaultchild===f||u.collections&&d(u.collections,f))return!0;return!1};for(let h of s){let _=function(E){for(let T of E){let C=T.cards.indexOf(u);if(C===-1)continue;let M=T.queryLabel??T?.label?.toLowerCase()??"";f.filters[M]={order:C+1,size:h.fields.size},_(T.collections)}},f=document.createElement("merch-card"),u=w(this,Ae)[h.id]||h.id;f.setAttribute("consonant",""),f.setAttribute("style",""),Dt(h.fields.variant)?.supportsDefaultChild&&(l?u===l:d(c,u))&&f.setAttribute("data-default-card","true"),_(c);let y=document.createElement("aem-fragment");y.setAttribute("fragment",u),f.append(y),Object.keys(f.filters).length===0&&(f.filters={all:{order:s.indexOf(h)+1,size:h.fields.size}}),this.append(f)}let m="",p=Pn(s[0]?.fields?.variant);this.variant=p,p==="plans"&&s.length===3&&!s.some(h=>h.fields?.size?.includes("wide"))&&(m="ThreeColumns"),p&&this.classList.add("merch-card-collection",p,...Hc[`${p}${m}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i(!0)}),await this.hydrationReady}get footer(){if(!this.filtered)return ue`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return ue`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===oe.authored?tt({sort:void 0}):tt({sort:r.target.value}),this.dispatchEvent(new CustomEvent(xr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(br,{bubbles:!0,composed:!0}));let r=this.page+1;tt({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=Ui(({category:r,filter:i,types:n,sort:a,search:o,single_app:s,page:c})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{tt({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=n??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(c)||1})}openFilters(r){this.sidenav?.showModal(r)}};Ae=new WeakMap,Ze=new WeakMap,_t=new WeakMap,dr=new WeakSet,ro=function(r,i={},n=!0){w(this,_t).error(`merch-card-collection: ${r}`,i),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Ar,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(Qe,"properties",{id:{type:String,attribute:"id",reflect:!0},displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:oe.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(Qe,"styles",eo`
        #footer {
            grid-column: 1 / -1;
            justify-self: stretch;
            color: var(--merch-color-grey-80);
            order: 1000;
        }

        sp-theme {
            display: contents;
        }
    `);Qe.SortOrder=oe;customElements.define(to,Qe);var zc={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},Vc=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(n=>{n.innerText=r||""})},jc={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},qc={catalog:"l"},K,Je,wt=class extends Ja{constructor(){super();$(this,K);$(this,Je);g(this,"tablet",new et(this,H));g(this,"desktop",new et(this,N));this.collection=null,G(this,K,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(rt,this.updateLiterals),this.collection?.addEventListener(it,this.handleSidenavAttached),G(this,Je,customElements.get("merch-card"))}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(rt,this.updateLiterals),this.collection?.removeEventListener(it,this.handleSidenavAttached)}willUpdate(){w(this,K).search=this.getVisibility("search"),w(this,K).filter=this.getVisibility("filter"),w(this,K).sort=this.getVisibility("sort"),w(this,K).result=this.getVisibility("result"),w(this,K).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let n=r[i];return n===!1?!1:n===!0?!0:n.includes(this.currentMedia)}getVisibility(r){let i=w(this,Je).getCollectionOptions(this.collection?.variant)?.headerVisibility,n=this.parseVisibilityOptions(i,r);return n!==null?n:this.parseVisibilityOptions(jc,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!w(this,K).search)return se;let r=at(this,"searchText");return r?ue`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${r}"
                      .size=${qc[this.variant]}
                  ></sp-search>
              </merch-search>
          `:se}get filterAction(){return w(this,K).filter?this.sidenav?ue`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:se:se}get sortAction(){if(!w(this,K).sort)return se;let r=at(this,"sortText");if(!r)return;let i=at(this,"popularityText"),n=at(this,"alphabeticallyText");if(!(i&&n))return;let a=this.collection?.sort===oe.alphabetical;return ue`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${a?oe.alphabetical:oe.authored}"
              >
                  <span slot="label-only"
                      >${r}:
                      ${a?n:i}</span
                  >
                  <sp-menu-item value="${oe.authored}"
                      >${i}</sp-menu-item
                  >
                  <sp-menu-item value="${oe.alphabetical}"
                      >${n}</sp-menu-item
                  >
              </sp-action-menu>
          `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return zc[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!w(this,K).result)return se;if(!this.sidenav)return se;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return ue`
            <div id="result" aria-live="polite" type=${r} quantity=${i}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!w(this,K).custom)return se;let r=w(this,Je).getCollectionOptions(this.collection?.variant)?.customHeaderArea;if(!r)return se;let i=r(this.collection);return!i||i===se?se:ue`<div id="custom" role="heading" aria-level="2">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{Vc(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return ue`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};K=new WeakMap,Je=new WeakMap,g(wt,"styles",eo`
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
          @media screen and ${Za(H)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort" 
                                                        "result result result";
              }
          }
  
          /* Laptop */
          @media screen and ${Za(N)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",wt);export{Qe as MerchCardCollection,wt as default};

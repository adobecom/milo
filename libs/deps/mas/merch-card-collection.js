var Hi=Object.defineProperty;var Di=e=>{throw TypeError(e)};var mo=(e,t,r)=>t in e?Hi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var uo=(e,t)=>{for(var r in t)Hi(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>mo(e,typeof t!="symbol"?t+"":t,r),ur=(e,t,r)=>t.has(e)||Di("Cannot "+r);var T=(e,t,r)=>(ur(e,t,"read from private field"),r?r.call(e):t.get(e)),$=(e,t,r)=>t.has(e)?Di("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),G=(e,t,r,i)=>(ur(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),Mt=(e,t,r)=>(ur(e,t,"access private method"),r);import{html as fe,LitElement as to,css as ro,unsafeCSS as eo,nothing as se}from"../lit-all.min.js";var K="(max-width: 767px)",ee="(max-width: 1199px)",H="(min-width: 768px)",L="(min-width: 1200px)",xe="(min-width: 1600px)";function Nt(){return window.matchMedia(K)}function Ot(){return window.matchMedia(L)}function kt(){return Nt().matches}function de(){return Ot().matches}var rt=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var Bi="hashchange";function fo(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[n,a=""]=i.split("=");n&&t.push([n,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function it(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([n,a])=>{a?t.set(n,a):t.delete(n)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function Ui(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=fo(window.location.hash);e(r)};return t(),window.addEventListener(Bi,t),()=>{window.removeEventListener(Bi,t)}}var Fr={};uo(Fr,{CLASS_NAME_FAILED:()=>Sr,CLASS_NAME_HIDDEN:()=>xo,CLASS_NAME_PENDING:()=>Ar,CLASS_NAME_RESOLVED:()=>Tr,CheckoutWorkflow:()=>Oo,CheckoutWorkflowStep:()=>j,Commitment:()=>Ae,ERROR_MESSAGE_BAD_REQUEST:()=>_r,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Ro,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Pr,EVENT_AEM_ERROR:()=>Er,EVENT_AEM_LOAD:()=>yr,EVENT_MAS_ERROR:()=>wr,EVENT_MAS_READY:()=>Lo,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>Po,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>gr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>nt,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>br,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>at,EVENT_MERCH_CARD_COLLECTION_SORT:()=>xr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>_o,EVENT_MERCH_OFFER_READY:()=>yo,EVENT_MERCH_OFFER_SELECT_READY:()=>Eo,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>To,EVENT_MERCH_SEARCH_CHANGE:()=>Co,EVENT_MERCH_SIDENAV_SELECT:()=>vr,EVENT_MERCH_STOCK_CHANGE:()=>So,EVENT_MERCH_STORAGE_CHANGE:()=>Ao,EVENT_OFFER_SELECTED:()=>wo,EVENT_TYPE_FAILED:()=>Cr,EVENT_TYPE_READY:()=>It,EVENT_TYPE_RESOLVED:()=>Lr,Env:()=>le,FF_DEFAULTS:()=>ye,HEADER_X_REQUEST_ID:()=>ot,LOG_NAMESPACE:()=>Rr,Landscape:()=>ve,MARK_DURATION_SUFFIX:()=>Br,MARK_START_SUFFIX:()=>Dr,MODAL_TYPE_3_IN_1:()=>Te,NAMESPACE:()=>go,PARAM_AOS_API_KEY:()=>Mo,PARAM_ENV:()=>Nr,PARAM_LANDSCAPE:()=>Or,PARAM_MAS_PREVIEW:()=>Mr,PARAM_WCS_API_KEY:()=>No,PROVIDER_ENVIRONMENT:()=>Hr,SELECTOR_MAS_CHECKOUT_LINK:()=>Fi,SELECTOR_MAS_ELEMENT:()=>fr,SELECTOR_MAS_INLINE_PRICE:()=>re,SELECTOR_MAS_SP_BUTTON:()=>vo,SELECTOR_MAS_UPT_LINK:()=>$i,SORT_ORDER:()=>oe,STATE_FAILED:()=>ae,STATE_PENDING:()=>be,STATE_RESOLVED:()=>pe,TAG_NAME_SERVICE:()=>bo,TEMPLATE_PRICE:()=>ko,TEMPLATE_PRICE_ANNUAL:()=>Ho,TEMPLATE_PRICE_LEGAL:()=>Ur,TEMPLATE_PRICE_STRIKETHROUGH:()=>Io,Term:()=>te,WCS_PROD_URL:()=>kr,WCS_STAGE_URL:()=>Ir});var Ae=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),te=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),go="merch",xo="hidden",It="wcms:commerce:ready",bo="mas-commerce-service",re='span[is="inline-price"][data-wcs-osi]',Fi='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',vo="sp-button[data-wcs-osi]",$i='a[is="upt-link"]',fr=`${re},${Fi},${$i}`,yo="merch-offer:ready",Eo="merch-offer-select:ready",gr="merch-card:action-menu-toggle",wo="merch-offer:selected",So="merch-stock:change",Ao="merch-storage:change",To="merch-quantity-selector:change",_o="merch-card-quantity:change",Po="merch-modal:addon-and-quantity-update",Co="merch-search:change",xr="merch-card-collection:sort",nt="merch-card-collection:literals-changed",at="merch-card-collection:sidenav-attached",br="merch-card-collection:showmore",vr="merch-sidenav:select",yr="aem:load",Er="aem:error",Lo="mas:ready",wr="mas:error",Sr="placeholder-failed",Ar="placeholder-pending",Tr="placeholder-resolved",_r="Bad WCS request",Pr="Commerce offer not found",Ro="Literals URL not provided",Cr="mas:failed",Lr="mas:resolved",Rr="mas/commerce",Mr="mas.preview",Nr="commerce.env",Or="commerce.landscape",Mo="commerce.aosKey",No="commerce.wcsKey",kr="https://www.adobe.com/web_commerce_artifact",Ir="https://www.stage.adobe.com/web_commerce_artifact_stage",ae="failed",be="pending",pe="resolved",ve={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},ot="X-Request-Id",j=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),Oo="UCv3",le=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),Hr={PRODUCTION:"PRODUCTION"},Te={TWP:"twp",D2P:"d2p",CRM:"crm"},Dr=":start",Br=":duration",ko="price",Io="price-strikethrough",Ho="annual",Ur="legal",ye="mas-ff-defaults",oe={alphabetical:"alphabetical",authored:"authored"};var Do="mas-commerce-service";var st=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function _e(e,t={},r=null,i=null){let n=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,o]of Object.entries(t))n.setAttribute(a,o);return n}function Ht(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Gi(){return window.matchMedia("(max-width: 1024px)").matches}function ct(){return document.getElementsByTagName(Do)?.[0]}function lt(e){let t=window.getComputedStyle(e);return e.offsetHeight+parseFloat(t.marginTop)+parseFloat(t.marginBottom)}import{html as Dt,nothing as Bo}from"../lit-all.min.js";var De,dt=class dt{constructor(t){g(this,"card");$(this,De);this.card=t,this.insertVariantStyle()}getContainer(){return G(this,De,T(this,De)??this.card.closest('merch-card-collection, [class*="-merch-cards"]')??this.card.parentElement),T(this,De)}insertVariantStyle(){if(!dt.styleMap[this.card.variant]){dt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Dt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Dt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Dt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:Bo}get secureLabelFooter(){return Dt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}syncHeights(){}renderLayout(){}get aemFragmentMapping(){return Bt(this.card.variant)}};De=new WeakMap,g(dt,"styleMap",{});var O=dt;import{html as $r,css as Uo}from"../lit-all.min.js";var zi=`
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

@media screen and ${K} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-columns: min-content auto;
    }
}

@media screen and ${H} {
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
}`;var Vi={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Be=class extends O{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(gr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let i=this.actionMenuContentSlot.classList.contains("hidden");i||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!i).toString())});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(i||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",i),this.setAriaExpanded(this.actionMenu,"false"))});g(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return $r` <div class="body">
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
            <slot></slot>`}getGlobalCSS(){return zi}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};g(Be,"variantStyle",Uo`
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
    `);import{html as pt}from"../lit-all.min.js";var ji=`
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
`;var Ut=class extends O{constructor(t){super(t)}getGlobalCSS(){return ji}renderLayout(){return pt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?pt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:pt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?pt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:pt`
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

@media screen and ${L} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${xe} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Ft=class extends O{constructor(t){super(t)}getGlobalCSS(){return qi}renderLayout(){return Wi` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Wi`<hr />`} ${this.secureLabelFooter}`}};import{html as Ue,css as Fo,unsafeCSS as Xi}from"../lit-all.min.js";var Yi=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-border-color: #E9E9E9;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 16px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
    --consonant-merch-card-mini-compare-mobile-price-font-size: 32px;
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

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot="callout-content"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [slot="callout-content"] [is="inline-price"] {
    min-height: unset;
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
    font-style: italic;
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
    font-weight: 400;
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

/* bullet list */
merch-card[variant="mini-compare-chart"].bullet-list {
  border-radius: var(--consonant-merch-spacing-xxs);
}

merch-card[variant="mini-compare-chart"].bullet-list:not(.badge-card):not(.mini-compare-chart-badge) {
  border-color: var(--consonant-merch-card-mini-compare-border-color);
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m"] {
  padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xs);
  font-size: var(--consonant-merch-card-heading-xxs-font-size);
  line-height: var(--consonant-merch-card-heading-xxs-line-height);
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"],
merch-card[variant="mini-compare-chart"].bullet-list [slot="price-commitment"] {
  padding: 0 var(--consonant-merch-spacing-xs);
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"] .starting-at {
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
  font-weight: 400;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"] .price {
  font-size: var(--consonant-merch-card-heading-l-font-size);
  line-height: 35px;
  font-weight: 800;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"] .price-alternative:has(+ .price-annual-prefix) {
  margin-bottom: 4px;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"] [data-template="strikethrough"] {
  min-height: 24px;
  margin-bottom: 2px;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"] [data-template="strikethrough"],
merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"] .price-strikethrough {
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
  font-weight: 700;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"].annual-price-new-line > span[is="inline-price"] > .price-annual, .price-annual-prefix::after, .price-annual-suffix {
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
  font-weight: 400;
  font-style: italic;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="body-xxs"] {
  padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xs) 0;
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
  font-weight: 400;
  letter-spacing: normal;
  font-style: italic;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="promo-text"] {
  padding: var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs) var(--consonant-merch-spacing-xs) 0;
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
  font-weight: 700;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="promo-text"] a {
  font-weight: 400;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] {
  padding: var(--consonant-merch-card-card-mini-compare-mobile-spacing-xs) var(--consonant-merch-spacing-xs) 0;
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
  font-weight: 400;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="body-m"] p:has(+ p) {
  margin-bottom: 8px;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="callout-content"] {
  padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) 0px;
  margin: 0;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="callout-content"] > div > div {
  background-color: #D9D9D9;
}

merch-card[variant="mini-compare-chart"].bullet-list merch-addon {
  margin: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xxs);
}

merch-card[variant="mini-compare-chart"].bullet-list merch-addon [is="inline-price"] {
  font-weight: 400;
}

merch-card[variant="mini-compare-chart"].bullet-list footer {
  gap: var(--consonant-merch-spacing-xxs);
}

merch-card[variant="mini-compare-chart"].bullet-list .action-area {
  justify-content: flex-start;
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="footer-rows"] {
  background-color: var(--consonant-merch-card-card-mini-compare-mobile-background-color);
  border-radius: 0 0 var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-xxs);
}

merch-card[variant="mini-compare-chart"].bullet-list [slot="price-commitment"] {
  padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xs) 0 var(--consonant-merch-spacing-xs);
  font-size: var(--consonant-merch-card-body-s-font-size);
  line-height: var(--consonant-merch-card-body-s-line-height);
}

/* mini compare mobile */ 
@media screen and ${K} {
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

  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="heading-m-price"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
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
}

@media screen and ${ee} {
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="heading-m-price"] {
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
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

   merch-card[variant="mini-compare-chart"].bullet-list [slot="price-commitment"] {
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xs) 0 var(--consonant-merch-spacing-xs);
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--consonant-merch-card-body-s-line-height);
    font-weight: 400;
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot="footer-rows"] {
    padding: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"].bullet-list .footer-rows-title {
    line-height: var(--consonant-merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"].bullet-list .checkmark-copy-container.open {
    padding-block-start: var(--consonant-merch-spacing-xs);
    padding-block-end: 0;
  }

  merch-card[variant="mini-compare-chart"].bullet-list .footer-row-cell-checkmark {
    gap: var(--consonant-merch-spacing-xxs);
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

@media screen and ${xe} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
  }
}

merch-card[variant="mini-compare-chart"].bullet-list div[slot="footer-rows"]  {
  height: 100%;
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
`;var $o=32,Fe=class extends O{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Ue`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Ue`<slot name="secure-transaction-label"></slot>`;return Ue`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Yi}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer"),this.card.shadowRoot.querySelector(".mini-compare-chart-badge")?.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,n)=>{let a=Math.max($o,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${re}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,n=this.headingMPriceSlot;if(!i&&n){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=_e("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=_e("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,n=this.card.planType;if(i&&(await i.onceSettled(),n=i.value?.[0]?.planType),!n)return;r.planType=n,this.card.querySelector("merch-addon[plan-type]")?.updateComplete.then(()=>{this.updateCardElementMinHeight(this.card.shadowRoot.querySelector('slot[name="addon"]'),"addon")})}renderLayout(){return Ue` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Ue`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-xxs"></slot>
          <slot name="promo-text"></slot>
          <slot name="body-m"></slot>
          <slot name="offers"></slot>`:Ue`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>
          <slot name="body-xxs"></slot>
          <slot name="price-commitment"></slot>
          <slot name="offers"></slot>
          <slot name="promo-text"></slot>
          `}
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),kt()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(Fe,"variantStyle",Fo`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }

    :host([variant='mini-compare-chart'].bullet-list) > slot[name='heading-m-price'] {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px 3px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
        border-radius: 7.11px 0 0 7.11px;
        font-weight: 700;
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
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      font-weight: 400;
      color: #505050;
    }

    @media screen and ${Xi(ee)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Xi(L)} {
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
    :host([variant='mini-compare-chart']:not(.bullet-list)) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);import{html as ht,css as Go,nothing as $t}from"../lit-all.min.js";var Ki=`
:root {
    --consonant-merch-card-plans-width: 302px;
    --consonant-merch-card-plans-students-width: 302px;
    --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant^="plans"] {
    --merch-card-plans-heading-xs-min-height: 23px;
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="plans-students"] {
    width: var(--consonant-merch-card-plans-students-width);
}

merch-card[variant^="plans"][size="wide"], merch-card[variant^="plans"][size="super-wide"] {
    width: auto;
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

.columns.checkmark-list ul {
    margin: 0;
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

.plans-team {
    display: grid;
    grid-template-columns: min-content;
    justify-content: center;
}

.plans-team .row-1 {
    grid-template-columns: repeat(2, calc(var(--consonant-merch-card-plans-width) * 2 + 32px));
    justify-content: center;
}

.plans-team .col-2 {
    align-content: center;
}

.plans-team .col-2 h3 {
    font-size: 20px;
    margin: 0 0 16px;
}

.plans-team .col-2 p {
    margin: 0 0 16px;
}

.plans-team .text .foreground,
.plans-edu .text .foreground {
    max-width: unset;
    margin: 0;
}

.plans-edu .columns .row {
    grid-template-columns: repeat(auto-fit, var(--consonant-merch-card-plans-students-width));
    justify-content: center;
    align-items: center;
}

.plans-edu .columns .row-1 {
    grid-template-columns: var(--consonant-merch-card-plans-students-width);
    margin-block: var(--spacing-xs);
}

.plans-edu .columns .row-2 {
    margin-bottom: 40px;
}

.plans-edu .columns .row-3 {
    margin-bottom: 48px;
}

.plans-edu .col-2 h3 {
    margin: 0 0 16px;
    font-size: 20px;
}

.plans-individual .content,
.plans-team .content,
.plans-edu-inst .content {
    padding-bottom: 48px;
}

/* Mobile */
@media screen and ${K} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }

    merch-card[variant="plans-education"] .spacer {
        height: 0px;
    }
}

/* Tablet */
@media screen and ${H} {
    :root {
        --consonant-merch-card-plans-students-width: 486px;
    }

    .four-merch-cards.plans .foreground {
        max-width: unset;
    }
}

@media screen and ${ee} {
    .plans-team .row-1 {
        grid-template-columns: min-content;
    }

    .plans-edu-inst {
        display: grid;
        grid-template-columns: min-content;
        justify-content: center;
    }

    .plans-edu-inst .text .foreground {
        max-width: unset;
        margin: 0;
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
    }

    .plans-individual .content {
        padding-top: 24px;
    }

    .plans-edu .columns .row-1 {
        grid-template-columns: calc(var(--consonant-merch-card-plans-students-width) * 2 + var(--spacing-m));
    }

    .plans-edu-inst .text .foreground {
        max-width: 1200px;
        margin: auto;
    }
}

/* Large desktop */
@media screen and ${xe} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }

    merch-sidenav.plans {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var Gt={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},Qi={...function(){let{whatsIncluded:e,size:t,...r}=Gt;return r}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},Zi={...function(){let{subtitle:e,whatsIncluded:t,size:r,quantitySelect:i,...n}=Gt;return n}()},q=class extends O{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===Ur&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Ki}adjustSlotPlacement(t,r,i){let n=this.card.shadowRoot,a=n.querySelector("footer"),o=this.card.getAttribute("size");if(!o)return;let s=n.querySelector(`footer slot[name="${t}"]`),c=n.querySelector(`.body slot[name="${t}"]`),l=n.querySelector(".body");if(o.includes("wide")||(a?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(a?.classList.toggle("wide-footer",de()),!i&&s){if(c)s.remove();else{let d=l.querySelector(`[data-placeholder-for="${t}"]`);d?d.replaceWith(s):l.appendChild(s)}return}if(i&&c){let d=document.createElement("div");if(d.setAttribute("data-placeholder-for",t),d.classList.add("slot-placeholder"),!s){let m=c.cloneNode(!0);a.prepend(m)}c.replaceWith(d)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],de()),this.adjustSlotPlacement("callout-content",["super-wide"],de())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let r=this.card.querySelector('[slot="body-xs"]');if(!r)return;let i=r.querySelector("ul");if(!i)return;let n=i.previousElementSibling,a=document.createElement("div");a.classList.add("spacer"),r.insertBefore(a,n);let o=new IntersectionObserver(([s])=>{if(s.boundingClientRect.height===0)return;let c=0,l=this.card.querySelector('[slot="heading-s"]');l&&(c+=lt(l));let d=this.card.querySelector('[slot="subtitle"]');d&&(c+=lt(d));let m=this.card.querySelector('[slot="heading-m"]');m&&(c+=8+lt(m));for(let p of r.childNodes){if(p.classList.contains("spacer"))break;c+=lt(p)}let h=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");c>(parseFloat(h)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${c}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${c}px`),o.disconnect()});o.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.legalAdjusted||(await this.adjustLegal(),await this.adjustEduLists())}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${re}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?ht`<div class="divider"></div>`:$t}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=[],r=this.card.querySelector(`[slot="heading-m"] ${re}[data-template="price"]`);r&&t.push(r);let i=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling),await a.onceSettled())});await Promise.all(i)}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?ht`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:$t}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?$t:ht`<slot name="icons"></slot>`}connectedCallbackHook(){let t=Nt();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let r=Ot();r?.addEventListener&&r.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=Nt();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let r=Ot();r?.removeEventListener&&r.removeEventListener("change",this.adaptForMedia)}renderLayout(){return ht` ${this.badge}
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
            <slot></slot>`}};g(q,"variantStyle",Go`
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
    `),g(q,"collectionOptions",{customHeaderArea:t=>t.sidenav?ht`<slot name="resultsText"></slot>`:$t,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as Gr,css as zo}from"../lit-all.min.js";var Ji=`
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
`;var $e=class extends O{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Ji}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Gr` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Gr`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Gr`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),kt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${re}[data-template="price"]`)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=_e("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=_e("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g($e,"variantStyle",zo`
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
    `);import{html as zr,css as Vo}from"../lit-all.min.js";var en=`
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
@media screen and ${K} {
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
`;var Ge=class extends O{constructor(t){super(t)}getGlobalCSS(){return en}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return zr` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":zr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?zr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g(Ge,"variantStyle",Vo`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Vr,css as jo}from"../lit-all.min.js";var tn=`
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

@media screen and ${K} {
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
@media screen and ${L} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${xe} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var rn={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ze=class extends O{constructor(t){super(t)}getGlobalCSS(){return tn}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Vr`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Vr`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Vr`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(ze,"variantStyle",jo`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as qo,css as Wo}from"../lit-all.min.js";var nn=`
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
    /* Default to 1 column on mobile */
    grid-template-columns: 1fr;
}

/* Also support direct merch-card children and wrapped in p tags */
merch-card-collection.simplified-pricing-express p {
    margin: 0;
    font-size: inherit;
}

/* Desktop - 3 columns */
@media screen and ${L} {
    merch-card-collection.simplified-pricing-express {
        grid-template-columns: repeat(3, 1fr);
        max-width: calc(3 * var(--merch-card-simplified-pricing-express-width) + 32px);
        margin: 0 auto;
    }

    /* Apply synchronized heights to slots using CSS variables */
    merch-card[variant="simplified-pricing-express"] [slot="body-xs"] {
        min-height: var(--consonant-merch-card-simplified-pricing-express-description-height);
        display: flex;
        flex-direction: column;
    }

    /* Push paragraph with mnemonics to the bottom using :has() */
    merch-card[variant="simplified-pricing-express"] [slot="body-xs"] p:has(mas-mnemonic) {
        margin-top: auto;
        padding-top: 16px;
    }

    /* Fallback for browsers without :has() support - target last paragraph */
    @supports not selector(:has(*)) {
        merch-card[variant="simplified-pricing-express"] [slot="body-xs"] p:last-child {
            margin-top: auto;
            padding-top: 16px;
        }
    }

    /* Additional fallback - if second paragraph exists, assume it has mnemonics */
    merch-card[variant="simplified-pricing-express"] [slot="body-xs"] p:nth-child(2) {
        margin-top: auto;
        padding-top: 16px;
    }

    merch-card[variant="simplified-pricing-express"] [slot="price"] {
        min-height: var(--consonant-merch-card-simplified-pricing-express-price-height);
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
    justify-content: space-between;
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

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"]:first-child {
  margin-inline-end: 8px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child {
  display: flex;
  align-items: baseline;
  margin: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] span[is="inline-price"] {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"] {
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

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child .price-currency-symbol {
  font-size: var(--merch-card-simplified-pricing-express-price-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-line-height);
  width: 100%;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] .price-currency-symbol {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-p-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
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
  white-space: nowrap;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"] .price-integer,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"] .price-decimals {
  font-size: 28px;
  font-weight: 700;
  line-height: 36.4px;
  text-decoration-thickness: 2px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"][data-template='strikethrough'] .price-integer,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"][data-template='strikethrough'] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"][data-template='strikethrough'] .price-decimals {
  text-decoration: line-through;
}

/* Apply indigo-800 color to optical price when preceded by strikethrough */
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'],
merch-card[variant="simplified-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'] .price-currency-symbol {
  color: var(--spectrum-indigo-900);
}

/* Ensure non-first paragraph prices have normal font weight */
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-integer,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-decimals-delimiter,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-decimals,
merch-card[variant="simplified-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-recurrence {
  font-size: var(--merch-card-simplified-pricing-express-price-p-font-size);
  font-weight: var(--merch-card-simplified-pricing-express-price-p-font-weight);
  line-height: var(--merch-card-simplified-pricing-express-price-p-line-height);
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

/* mas-mnemonic inline styles for simplified-pricing-express */
merch-card[variant="simplified-pricing-express"] mas-mnemonic {
    display: inline-block;
    align-items: center;
    vertical-align: baseline;
    margin-inline-end: 8px;
    overflow: visible;
    padding-top: 16px;
}

/* Tooltip containers - overflow handled by Shadow DOM */

/* Mobile styles */
@media screen and ${K} {
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
@media screen and ${ee} {
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
@media screen and ${H} and ${ee} {
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
`;var jr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"XL"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:["badgeColor","badgeBorderColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},Ve=class extends O{getGlobalCSS(){return nn}get aemFragmentMapping(){return jr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="body-xs"]');t&&this.updateCardElementMinHeight(t,"description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,this.card.prices?.length&&await Promise.all(this.card.prices.map(t=>t.onceSettled?.())),de())){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-description-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(a=>a.variantLayout?.syncHeights?.())})}}connectedCallbackHook(){!this.card||this.card.failed||(this.setupAccordion(),this.card?.hasAttribute("data-default-card")&&!de()&&this.card.setAttribute("data-expanded","true"))}setupAccordion(){let t=this.card;if(!t)return;let r=()=>{if(de())t.removeAttribute("data-expanded");else{let n=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",n?"true":"false")}};r();let i=window.matchMedia(ee);this.mediaQueryListener=()=>{r()},i.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia(ee).removeEventListener("change",this.mediaQueryListener)}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||de())return;let a=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",a)}renderLayout(){return qo`
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
        `}};g(Ve,"variantStyle",Wo`
        :host([variant='simplified-pricing-express']) {
            --merch-card-simplified-pricing-express-width: 365px;
            --merch-card-simplified-pricing-express-padding: 24px;
            --merch-card-simplified-pricing-express-padding-mobile: 16px;
            --merch-card-simplified-pricing-express-price-font-size: 28px;
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

        :host([variant='simplified-pricing-express']:not(:has([slot="badge"]:not(:empty)))) .badge-wrapper {
            display: none;
        }

        :host([variant='simplified-pricing-express']) .card-content {
            border-radius: 8px;
            padding: var(--merch-card-simplified-pricing-express-padding);
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--consonant-merch-spacing-xxs);
            position: relative;
        }
        
        :host([variant='simplified-pricing-express']) .card-content > * {
            position: relative;
        }
        
        :host([variant='simplified-pricing-express']:not([gradient-border='true'])) .card-content {
            background: var(--spectrum-gray-50);
            border: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        :host([variant='simplified-pricing-express']:not([gradient-border='true'])[data-expanded='false']) .card-content {
            overflow: hidden;
        }
        
        :host([variant='simplified-pricing-express']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        
        :host([variant='simplified-pricing-express']:not([gradient-border='true']):has([slot="badge"]:not(:empty))) .card-content {
            border-top: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        :host([variant='simplified-pricing-express']:has([slot="badge"]:not(:empty))) .badge-wrapper {
            margin-bottom: -2px;
        }

        :host([variant='simplified-pricing-express'][gradient-border='true']) .badge-wrapper {
            border: none;
            margin-bottom: -6px;
            padding-bottom: 6px;
        }
        
        :host([variant='simplified-pricing-express'][gradient-border='true']) .badge-wrapper ::slotted(*) {
            color: white !important;
        }

        :host([variant='simplified-pricing-express'][gradient-border='true']) .card-content {
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
        
        :host([variant='simplified-pricing-express'][border-color='gradient-purple-blue']) .badge-wrapper,
        :host([variant='simplified-pricing-express'][border-color='gradient-purple-blue']) .card-content {
            background: var(--gradient-purple-blue);
        }
        
        :host([variant='simplified-pricing-express'][border-color='gradient-firefly-spectrum']) .badge-wrapper,
        :host([variant='simplified-pricing-express'][border-color='gradient-firefly-spectrum']) .card-content {
            background: var(--gradient-firefly-spectrum);
        }
        
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
            :host([variant='simplified-pricing-express']) .card-content {
                height: 100%;
            }

            :host([variant='simplified-pricing-express']) .description {
                flex: 1;
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
    `);import{html as Yo,css as Xo}from"../lit-all.min.js";var an=`
:root {
    --merch-card-full-pricing-express-width: 378px;
    --merch-card-full-pricing-express-mobile-width: 365px;
}

/* Collection grid layout */
merch-card-collection.full-pricing-express {
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: stretch;
    gap: 16px;
}

/* Mobile - 1 column */
merch-card-collection.full-pricing-express {
    grid-template-columns: 1fr;
    max-width: var(--merch-card-full-pricing-express-mobile-width);
    margin: 0 auto;
    padding: 0 16px;
}

/* Tablet - 2 columns */
@media screen and (min-width: 1025px) and (max-width: 1199px) {
    merch-card-collection.full-pricing-express {
        grid-template-columns: repeat(2, 1fr);
        max-width: calc(2 * var(--merch-card-full-pricing-express-width) + 16px);
    }
}

/* Desktop small - 2 columns */
@media screen and ${L} and (max-width: 1399px) {
    merch-card-collection.full-pricing-express {
        grid-template-columns: repeat(2, 1fr);
        max-width: calc(2 * var(--merch-card-full-pricing-express-width) + 16px);
    }
}

/* Desktop large - 3 columns */
@media screen and (min-width: 1400px) {
    merch-card-collection.full-pricing-express {
        grid-template-columns: repeat(3, 1fr);
        max-width: calc(3 * var(--merch-card-full-pricing-express-width) + 32px);
    }
}

/* Remove default paragraph margins */
merch-card[variant="full-pricing-express"] p {
    margin: 0 !important;
    font-size: inherit;
}

/* Slot-specific styles */
merch-card[variant="full-pricing-express"] [slot="heading-xs"] {
    font-size: 20px;
    font-weight: 700;
    line-height: 26px;
    color: var(--spectrum-gray-800);
    margin-bottom: 8px;
}

/* Inline mnemonics inside heading */
merch-card[variant="full-pricing-express"] [slot="heading-xs"] mas-mnemonic {
    display: inline-flex;
    width: 14px;
    height: 14px;
    vertical-align: middle;
    margin-right: 8px;
    align-items: flex-end;
}

merch-card[variant="full-pricing-express"] [slot="heading-xs"] mas-mnemonic img {
    width: 14px;
    height: 14px;
    object-fit: contain;
}

/* Icons slot styling */
merch-card[variant="full-pricing-express"] [slot="icons"] {
    display: flex;
    gap: 8px;
    align-items: center;
    flex-shrink: 0;
}

merch-card[variant="full-pricing-express"] [slot="icons"] merch-icon {
    --img-width: 20px;
    --img-height: 20px;
}

merch-card[variant="full-pricing-express"] [slot="trial-badge"] {
    position: absolute;
    top: -8px;
    right: 16px;
    background: var(--spectrum-indigo-300);
    border-radius: 4px;
    font-size: var(--merch-card-full-pricing-express-trial-badge-font-size);
    font-weight: var(--merch-card-full-pricing-express-trial-badge-font-weight);
    line-height: var(--merch-card-full-pricing-express-trial-badge-line-height);
    white-space: nowrap;
    z-index: 0;
    max-width: calc(100% - 24px);
    text-align: right;
}

merch-card[variant="full-pricing-express"] [slot="trial-badge"] merch-badge {
    font-size: var(--merch-card-full-pricing-express-trial-badge-font-size);
    font-weight: var(--merch-card-full-pricing-express-trial-badge-font-weight);
    line-height: var(--merch-card-full-pricing-express-trial-badge-line-height);
    color: var(--spectrum-indigo-900);
}

merch-card[variant="full-pricing-express"] [slot="trial-badge"]:empty {
    display: none;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] {
    font-size: 16px;
    line-height: 20.8px;
    color: var(--spectrum-gray-900);
}

merch-card[variant="full-pricing-express"] [slot="body-s"] hr {
    margin-top: 16px;
    margin-bottom: 24px;
}

merch-card[variant="full-pricing-express"] [slot="shortDescription"] {
    font-size: 16px;
    line-height: 20.8px;
    color: var(--spectrum-gray-700);
    margin-bottom: var(--merch-card-full-pricing-express-section-gap);
}

merch-card[variant="full-pricing-express"] [slot="body-s"] ul {
    margin: 0;
    padding-left: 20px;
    list-style: disc;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] li {
    margin-bottom: 8px;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] li:last-child {
    margin-bottom: 0;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] p {
    padding: 8px;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] p a {
    color: var(--spectrum-indigo-900);
    font-weight: 700;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] .button-container {
    margin: 0;
    padding: 0;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] p:last-child a {
    text-decoration: none;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    color: var(--spectrum-indigo-900);
    background: transparent;
    border: none;
    margin: 0;
    font-size: 16px;
}

merch-card[variant="full-pricing-express"] [slot="body-s"] p:last-child a:hover {
    background-color: initial;
    border: none;
}

/* Price styling */
merch-card[variant="full-pricing-express"] [slot="price"] {
    display: flex;
    flex-direction: column;
    width: 100%;
}

merch-card[variant="full-pricing-express"] [slot="price"] > p:first-child {
    display: flex;
    align-items: baseline;
    margin: 0;
}

merch-card[variant="full-pricing-express"] [slot="price"] > p span[is="inline-price"]:first-child {
    margin-right: 8px;
}

merch-card[variant="full-pricing-express"] [slot="price"] span[is="inline-price"] {
    font-size: var(--merch-card-full-pricing-express-price-font-size);
    line-height: var(--merch-card-full-pricing-express-price-line-height);
}

merch-card[variant="full-pricing-express"] [slot="price"] span[is="inline-price"][data-template="optical"] {
    font-size: var(--merch-card-full-pricing-express-price-font-size);
    color: var(--spectrum-gray-800);
}

merch-card[variant="full-pricing-express"] [slot="price"] .price-integer,
merch-card[variant="full-pricing-express"] [slot="price"] .price-decimals-delimiter,
merch-card[variant="full-pricing-express"] [slot="price"] .price-decimals {
    font-size: 28px;
    font-weight: 700;
    line-height: 36.4px;
}

merch-card[variant="full-pricing-express"] [slot="price"] .price-currency-symbol {
    font-size: var(--merch-card-full-pricing-express-price-font-size);
    font-weight: var(--merch-card-full-pricing-express-price-font-weight);
    line-height: var(--merch-card-full-pricing-express-price-line-height);
}

merch-card[variant="full-pricing-express"] [slot="price"] span[is="inline-price"] .price-recurrence {
    font-size: 12px;
    font-weight: 700;
    line-height: 15.6px;
}

merch-card[variant="full-pricing-express"] [slot="price"] p {
    font-size: 12px;
    font-weight: 400;
    line-height: 15.6px;
    color: var(--spectrum-gray-700);
}

merch-card[variant="full-pricing-express"] [slot="price"] > p span[is="inline-price"]:only-child {
    color: var(--spectrum-gray-700);
}

merch-card[variant="full-pricing-express"] [slot="price"] > p:first-child span[is="inline-price"][data-template="strikethrough"] + span[is="inline-price"] {
    color: var(--spectrum-indigo-900);
}

/* Target inline prices in paragraphs that are not the first paragraph */
merch-card[variant="full-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] {
    font-size: 12px;
    font-weight: 500;
    line-height: 15.6px;
    margin-right: 0;
}

merch-card[variant="full-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-integer,
merch-card[variant="full-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-decimals-delimiter,
merch-card[variant="full-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-decimals,
merch-card[variant="full-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-currency-symbol,
merch-card[variant="full-pricing-express"] [slot="price"] > p:not(:first-child) span[is="inline-price"] .price-recurrence {
    font-size: 12px;
    font-weight: 500;
    line-height: 15.6px;
}


merch-card[variant="full-pricing-express"] [slot="price"] strong {
    color: var(--spectrum-indigo-900);
}
merch-card[variant="full-pricing-express"] [slot="price"] p a {
    color: var(--spectrum-indigo-900);
    font-weight: 700;
    text-decoration: none;
}

/* Strikethrough price styling */
merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price,
merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-strikethrough,
merch-card[variant="full-pricing-express"] span.placeholder-resolved[data-template='strikethrough'] {
    text-decoration: none;
    font-size: 12px;
    line-height: 15.6px;
}

merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price {
    color: var(--spectrum-gray-700);
}

merch-card[variant="full-pricing-express"] [slot="price"] p .heading-xs,
merch-card[variant="full-pricing-express"] [slot="price"] p .heading-s,
merch-card[variant="full-pricing-express"] [slot="price"] p .heading-m,
merch-card[variant="full-pricing-express"] [slot="price"] p .heading-l {
    font-size: 22px;
    line-height: 28.6px;
    text-align: center;
    width: 100%;
}

merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-integer,
merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals-delimiter,
merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] .price-decimals {
    text-decoration: line-through;
    text-decoration-thickness: 2px;
}

/* Apply indigo-800 color to optical price when preceded by strikethrough */
merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'],
merch-card[variant="full-pricing-express"] span[is="inline-price"][data-template='strikethrough'] + span[is="inline-price"][data-template='optical'] .price-currency-symbol {
    color: var(--spectrum-indigo-900);
}

/* CTA button styling */
merch-card[variant="full-pricing-express"] [slot="cta"] {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

merch-card[variant="full-pricing-express"] [slot="cta"] sp-button,
merch-card[variant="full-pricing-express"] [slot="cta"] button,
merch-card[variant="full-pricing-express"] [slot="cta"] a.button {
    display: block;
    width: 100%;
    box-sizing: border-box;
    font-weight: 700;
    font-size: 18px;
    line-height: 23.4px;
    margin: 0;
    padding: 12px 24px 13px 24px;
    border-radius: 26px;
}

merch-card[variant="full-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="full-pricing-express"] [slot="cta"] button.spectrum-Button--accent,
merch-card[variant="full-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
    color: var(--spectrum-white, #ffffff);
    width: 100%;
}

/* Ensure text color is applied to the label span element for accessibility */
merch-card[variant="full-pricing-express"] [slot="cta"] sp-button[variant="accent"] .spectrum-Button-label,
merch-card[variant="full-pricing-express"] [slot="cta"] button.spectrum-Button--accent .spectrum-Button-label,
merch-card[variant="full-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent .spectrum-Button-label {
    color: var(--spectrum-white, #ffffff);
}

/* Badge styling */
merch-card[variant="full-pricing-express"] merch-badge {
    white-space: nowrap;
    color: var(--spectrum-white);
    font-size: 16px;
    font-weight: bold;
    line-height: 20.8px;
}

/* Mobile-specific selective display of body-s */
@media (max-width: 1024px) {
    /* Show body-s container */
    merch-card[variant="full-pricing-express"] [slot="body-s"] {
        display: block;
    }

    /* Hide all direct children by default */
    merch-card[variant="full-pricing-express"] [slot="body-s"] > * {
        display: none;
    }

    /* Show only the last hr (2nd one) */
    merch-card[variant="full-pricing-express"] [slot="body-s"] > hr:last-of-type {
        display: block;
        margin: 24px 0;
    }

    /* Show only the button container (last p tag) */
    merch-card[variant="full-pricing-express"] [slot="body-s"] > p:last-child {
        display: block;
    }
    
    merch-card[variant="full-pricing-express"] {
        max-width: 365px;
    }
    
    /* Price font size on mobile */
    merch-card[variant="full-pricing-express"] [slot="price"] .price-currency-symbol,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-integer,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-decimals-delimiter,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-decimals,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-recurrence,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-strikethrough,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-unit-type,
    merch-card[variant="full-pricing-express"] [slot="price"] .price-tax-inclusivity {
        font-size: 22px;
    }
    
    /* Badge alignment on mobile */
    merch-card[variant="full-pricing-express"] [slot="badge"] {
        font-size: 16px;
        font-weight: 400;
    }
    
    /* Trial badge alignment on mobile */
    merch-card[variant="full-pricing-express"] [slot="trial-badge"] {
        margin-left: 0;
        align-self: flex-start;
    }
    
    merch-card[variant="full-pricing-express"] [slot="trial-badge"] merch-badge {
        font-size: 12px;
        line-height: 20.8px;
    }
}

/* Hide screen reader only text */
merch-card[variant="full-pricing-express"] sr-only {
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

/* mas-tooltip inline styles for full-pricing-express */
merch-card[variant="full-pricing-express"] mas-tooltip {
    display: inline-block;
    align-items: center;
    vertical-align: baseline;
    margin-right: 8px;
    overflow: visible;
    padding-top: 16px;
}

/* Responsive rules for desktop/tablet */
@media (min-width: 1025px) {
    merch-card[variant="full-pricing-express"] [slot="body-s"] {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
    }

    merch-card[variant="full-pricing-express"] [slot="body-s"] p:first-child {
        padding: 16px 8px;
    }

    /* Ensure the second divider wrapper stays at bottom with proper spacing */
    merch-card[variant="full-pricing-express"] [slot="body-s"] > hr:last-of-type {
        margin-top: auto;
        padding-top: 24px;
        margin-bottom: 16px;
        border: none;
        border-bottom: 1px solid #E9E9E9;
        height: 0;
        background: transparent;
    }

    /* Ensure the button container stays at the bottom */
    merch-card[variant="full-pricing-express"] [slot="body-s"] > p.button-container,
    merch-card[variant="full-pricing-express"] [slot="body-s"] > p:last-child {
        margin-top: 0;
        margin-bottom: 0;
    }
}
`;var qr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-s",maxCount:2e3,withSuffix:!1},shortDescription:{tag:"div",slot:"short-description",maxCount:3e3,withSuffix:!1},prices:{tag:"div",slot:"price"},trialBadge:{tag:"div",slot:"trial-badge"},ctas:{slot:"cta",size:"XL"},mnemonics:{size:"l"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:[]},je=class extends O{getGlobalCSS(){return an}get aemFragmentMapping(){return qr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width<=2)return;let t=this.card.querySelector('[slot="short-description"]');t&&this.updateCardElementMinHeight(t,"short-description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price");let i=this.card.querySelector('[slot="cta"]');i&&this.updateCardElementMinHeight(i,"cta")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,await Promise.all(this.card.prices.map(t=>t.onceSettled())),window.matchMedia("(min-width: 1025px)").matches)){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-price-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(a=>a.variantLayout?.syncHeights?.())})}}renderLayout(){return Yo`
            <div class="badge-wrapper">
                <slot name="badge"></slot>
            </div>
            <div class="card-content">
                <div class="header">
                    <slot name="heading-xs"></slot>
                    <slot name="icons"></slot>
                </div>
                <div class="short-description">
                    <slot name="short-description"></slot>
                </div>
                <div class="price-container">
                    <slot name="trial-badge"></slot>
                    <slot name="price"></slot>
                </div>
                <div class="cta">
                    <slot name="cta"></slot>
                </div>
                <div class="description">
                    <slot name="body-s"></slot>
                </div>
            </div>
            <slot></slot>
        `}};g(je,"variantStyle",Xo`
        :host([variant='full-pricing-express']) {
            /* CSS Variables */
            --merch-card-full-pricing-express-width: 437px;
            --merch-card-full-pricing-express-mobile-width: 303px;
            --merch-card-full-pricing-express-padding: 24px;
            --merch-card-full-pricing-express-padding-mobile: 20px;
            --merch-card-full-pricing-express-section-gap: 24px;
            
            /* Price container specific */
            --merch-card-full-pricing-express-price-bg: #F8F8F8;
            --merch-card-full-pricing-express-price-radius: 8px;

            /* Typography - matching simplified-pricing-express */
            --merch-card-full-pricing-express-trial-badge-font-size: 12px;
            --merch-card-full-pricing-express-trial-badge-font-weight: 700;
            --merch-card-full-pricing-express-trial-badge-line-height: 15.6px;
            --merch-card-full-pricing-express-price-font-size: 28px;
            --merch-card-full-pricing-express-price-line-height: 36.4px;
            --merch-card-full-pricing-express-price-font-weight: 700;
            --merch-card-full-pricing-express-cta-font-size: 18px;
            --merch-card-full-pricing-express-cta-font-weight: 700;
            --merch-card-full-pricing-express-cta-line-height: 23.4px;
            
            /* Gradient definitions (reused) */
            --gradient-purple-blue: linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%);
            --gradient-firefly-spectrum: linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%);
            
            width: var(--merch-card-full-pricing-express-width);
            max-width: var(--merch-card-full-pricing-express-width);
            background: transparent;
            border: none;
            display: flex;
            flex-direction: column;
            overflow: visible;
            box-sizing: border-box;
            position: relative;
        }

        /* Badge wrapper styling (same as simplified) */
        :host([variant='full-pricing-express']) .badge-wrapper {
            padding: 4px 12px;
            border-radius: 8px 8px 0 0;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            line-height: 20.8px;
            color: var(--spectrum-gray-800);
            position: relative;
            min-height: 23px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Card content styling */
        :host([variant='full-pricing-express']) .card-content {
            border-radius: 8px;
            padding: var(--merch-card-full-pricing-express-padding);
            flex: 1;
            display: flex;
            flex-direction: column;
            position: relative;
        }
        
        :host([variant='full-pricing-express']) .card-content > * {
            position: relative;
        }
        
        /* Regular border styling */
        :host([variant='full-pricing-express']:not([gradient-border='true'])) .card-content {
            background: var(--spectrum-gray-50);
            border: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* When badge exists, adjust card content border radius */
        :host([variant='full-pricing-express']:has([slot="badge"]:not(:empty))) .card-content {
            border-top-left-radius: 0;
            border-top-right-radius: 0;
        }
        
        /* When badge exists with regular border, ensure top border */
        :host([variant='full-pricing-express']:not([gradient-border='true']):has([slot="badge"]:not(:empty))) .card-content {
            border-top: 1px solid var(--consonant-merch-card-border-color, var(--spectrum-gray-100));
        }
        
        /* When badge has content, ensure seamless connection */
        :host([variant='full-pricing-express']:has([slot="badge"]:not(:empty))) .badge-wrapper {
            margin-bottom: -2px;
        }
        
        /* Gradient border styling (reused from simplified) */
        :host([variant='full-pricing-express'][gradient-border='true']) .badge-wrapper {
            border: none;
            margin-bottom: -6px;
            padding-bottom: 6px;
        }
        
        :host([variant='full-pricing-express'][gradient-border='true']) .badge-wrapper ::slotted(*) {
            color: white;
        }

        :host([variant='full-pricing-express'][gradient-border='true']) .card-content {
            border: none;
            padding: calc(var(--merch-card-full-pricing-express-padding) + 2px);
            border-radius: 8px;
        }
        
        :host([variant='full-pricing-express'][gradient-border='true']) .card-content::before {
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
        
        /* Gradient backgrounds */
        :host([variant='full-pricing-express'][border-color='gradient-purple-blue']) .badge-wrapper,
        :host([variant='full-pricing-express'][border-color='gradient-purple-blue']) .card-content {
            background: var(--gradient-purple-blue);
        }
        
        :host([variant='full-pricing-express'][border-color='gradient-firefly-spectrum']) .badge-wrapper,
        :host([variant='full-pricing-express'][border-color='gradient-firefly-spectrum']) .card-content {
            background: var(--gradient-firefly-spectrum);
        }
        
        :host([variant='full-pricing-express'][gradient-border='true']:has([slot="badge"]:not(:empty))) .card-content::before {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
        }

        /* Header styling */
        :host([variant='full-pricing-express']) .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
        }

        :host([variant='full-pricing-express']) [slot="heading-xs"] {
            font-size: 18px;
            font-weight: 700;
            line-height: 23.4px;
            color: var(--spectrum-gray-800);
        }

        /* Icons/Mnemonics styling */
        :host([variant='full-pricing-express']) [slot="icons"] {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-shrink: 0;
        }

        :host([variant='full-pricing-express']) [slot="icons"] merch-icon {
            --img-width: 20px;
            --img-height: 20px;
        }

        /* Description sections */
        :host([variant='full-pricing-express']) .description {
            display: flex;
            flex-direction: column;
        }

        /* Price container with background */
        :host([variant='full-pricing-express']) .price-container {
            background: var(--merch-card-full-pricing-express-price-bg);
            padding: 24px 16px;
            border-radius: var(--merch-card-full-pricing-express-price-radius);
            border: 1px solid #E0E2FF;
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: visible;
            margin-bottom: var(--merch-card-full-pricing-express-section-gap);
            justify-content: center;
            align-items: flex-start;
        }

        /* CTA styling */
        :host([variant='full-pricing-express']) .cta,
        :host([variant='full-pricing-express']) .cta ::slotted(*) {
            width: 100%;
            display: block;
        }

        /* Mobile styles */
        @media (max-width: 1024px) {
            :host([variant='full-pricing-express']) {
                width: var(--merch-card-full-pricing-express-mobile-width);
                max-width: var(--merch-card-full-pricing-express-mobile-width);
            }

            :host([variant='full-pricing-express']) .card-content {
                padding: var(--merch-card-full-pricing-express-padding-mobile);
            }

            :host([variant='full-pricing-express'][gradient-border='true']) .card-content {
                padding: calc(var(--merch-card-full-pricing-express-padding-mobile) + 2px);
            }

            :host([variant='full-pricing-express']) .short-description {
                padding: 24px 0;
            }
        }

        /* Desktop - fixed heights for alignment */
        @media (min-width: 1025px) {
            :host([variant='full-pricing-express']) .card-content {
                height: 100%;
            }

            :host([variant='full-pricing-express']) .description {
                flex: 1;
            }

            :host([variant='full-pricing-express']) .price-container {
                height: var(--consonant-merch-card-full-pricing-express-price-height);
            }

            :host([variant='full-pricing-express']) .cta {
                height: var(--consonant-merch-card-full-pricing-express-cta-height);
                margin-bottom: 24px;
            }

            :host([variant='full-pricing-express']) .short-description {
                height: var(--consonant-merch-card-full-pricing-express-short-description-height);
                margin-bottom: 24px;
            }
        }
    `);import{css as Ko,html as Qo}from"../lit-all.min.js";var on=`
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
`;var sn={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},qe=class extends O{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return on}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,i){i.literals={...i.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},i.space=!0,i.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${re}[data-template="price"]`);if(!r)return;let i=r.cloneNode(!0);this.legal=i,r.dataset.displayTax="false",i.dataset.template="legal",i.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,i.setAttribute("slot","legal"),this.card.appendChild(i)}renderLayout(){return Qo`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(qe,"variantStyle",Ko`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
        }
    `);var cn=new Map,Q=(e,t,r=null,i=null,n)=>{cn.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:n})};Q("catalog",Be,Vi,Be.variantStyle);Q("image",Ut);Q("inline-heading",Ft);Q("mini-compare-chart",Fe,null,Fe.variantStyle);Q("plans",q,Gt,q.variantStyle,q.collectionOptions);Q("plans-students",q,Zi,q.variantStyle,q.collectionOptions);Q("plans-education",q,Qi,q.variantStyle,q.collectionOptions);Q("product",$e,null,$e.variantStyle);Q("segment",Ge,null,Ge.variantStyle);Q("special-offers",ze,rn,ze.variantStyle);Q("simplified-pricing-express",Ve,jr,Ve.variantStyle);Q("full-pricing-express",je,qr,je.variantStyle);Q("mini",qe,sn,qe.variantStyle);function Bt(e){return cn.get(e)?.fragmentMapping}var ln="tacocat.js";var Wr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),dn=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function k(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=We(i)?i:e;a=o.get(s)}if(n&&a==null){let o=We(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=Jo(We(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var Zo=e=>typeof e=="boolean",zt=e=>typeof e=="function",Vt=e=>typeof e=="number",pn=e=>e!=null&&typeof e=="object";var We=e=>typeof e=="string",hn=e=>We(e)&&e,mt=e=>Vt(e)&&Number.isFinite(e)&&e>0;function jt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function b(e,t){if(Zo(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function ut(e,t,r){let i=Object.values(t);return i.find(n=>Wr(n,e))??r??i[0]}function Jo(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function mn(e,t=1){return Vt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var es=Date.now(),Yr=()=>`(+${Date.now()-es}ms)`,qt=new Set,ts=b(k("tacocat.debug",{},{metadata:!1}),!1);function un(e){let t=`[${ln}/${e}]`,r=(o,s,...c)=>o?!0:(n(s,...c),!1),i=ts?(o,...s)=>{console.debug(`${t} ${o}`,...s,Yr())}:()=>{},n=(o,...s)=>{let c=`${t} ${o}`;qt.forEach(([l])=>l(c,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let c=`${t} ${o}`;qt.forEach(([,l])=>l(c,...s))}}}function rs(e,t){let r=[e,t];return qt.add(r),()=>{qt.delete(r)}}rs((e,...t)=>{console.error(e,...t,Yr())},(e,...t)=>{console.warn(e,...t,Yr())});var is="no promo",fn="promo-tag",ns="yellow",as="neutral",os=(e,t,r)=>{let i=a=>a||is,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},ss="cancel-context",Wt=(e,t)=>{let r=e===ss,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?fn:`${fn} no-promo`,text:os(o,t,n),variant:a?ns:as,isOverriden:n}};var Xr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Xr||(Xr={}));var Z;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(Z||(Z={}));var ie;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(ie||(ie={}));var Kr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Kr||(Kr={}));var Qr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Qr||(Qr={}));var Zr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Zr||(Zr={}));var Jr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Jr||(Jr={}));var ei="ABM",ti="PUF",ri="M2M",ii="PERPETUAL",ni="P3Y",cs="TAX_INCLUSIVE_DETAILS",ls="TAX_EXCLUSIVE",gn={ABM:ei,PUF:ti,M2M:ri,PERPETUAL:ii,P3Y:ni},op={[ei]:{commitment:Z.YEAR,term:ie.MONTHLY},[ti]:{commitment:Z.YEAR,term:ie.ANNUAL},[ri]:{commitment:Z.MONTH,term:ie.MONTHLY},[ii]:{commitment:Z.PERPETUAL,term:void 0},[ni]:{commitment:Z.THREE_MONTHS,term:ie.P3Y}},xn="Value is not an offer",Yt=e=>{if(typeof e!="object")return xn;let{commitment:t,term:r}=e,i=ds(t,r);return{...e,planType:i}};var ds=(e,t)=>{switch(e){case void 0:return xn;case"":return"";case Z.YEAR:return t===ie.MONTHLY?ei:t===ie.ANNUAL?ti:"";case Z.MONTH:return t===ie.MONTHLY?ri:"";case Z.PERPETUAL:return ii;case Z.TERM_LICENSE:return t===ie.P3Y?ni:"";default:return""}};function bn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==cs)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:ls}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var ps="mas-commerce-service",hs={requestId:ot,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function ft(e,{country:t,forceTaxExclusive:r}){let i;if(e.length<2)i=e;else{let n=t==="GB"?"EN":"MULT";e.sort((a,o)=>a.language===n?-1:o.language===n?1:0),e.sort((a,o)=>!a.term&&o.term?-1:a.term&&!o.term?1:0),i=[e[0]]}return r&&(i=i.map(bn)),i}var Xt=e=>window.setTimeout(e);function Ye(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(mn).filter(mt);return r.length||(r=[t]),r}function Kt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(hn)}function W(){return document.getElementsByTagName(ps)?.[0]}function vn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,n]of Object.entries(hs)){let a=r.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[i]=a)}return t}var Pe={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},yn=1e3;function ms(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function En(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Pe.serializableTypes.includes(r))return r}return e}function us(e,t){if(!Pe.ignoredProperties.includes(e))return En(t)}var ai={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(l=>{l!=null&&(ms(l)?i:n).push(l)}),i.length&&(a+=" "+i.map(En).join(" "));let{pathname:o,search:s}=window.location,c=`${Pe.delimiter}page=${o}${s}`;c.length>yn&&(c=`${c.slice(0,yn)}<trunc>`),a+=c,n.length&&(a+=`${Pe.delimiter}facts=`,a+=JSON.stringify(n,us)),window.lana?.log(a,Pe)}};function Qt(e){Object.assign(Pe,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Pe&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var wn={LOCAL:"local",PROD:"prod",STAGE:"stage"},oi={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},si=new Set,ci=new Set,Sn=new Map,An={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},Tn={filter:({level:e})=>e!==oi.DEBUG},fs={filter:()=>!1};function gs(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&zt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:performance.now().toFixed(3)}}function xs(e){[...ci].every(t=>t(e))&&si.forEach(t=>t(e))}function _n(e){let t=(Sn.get(e)??0)+1;Sn.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>_n(`${i.namespace}/${n}`),updateConfig:Qt};return Object.values(oi).forEach(n=>{i[n]=(a,...o)=>xs(gs(n,a,e,o,r))}),Object.seal(i)}function Zt(...e){e.forEach(t=>{let{append:r,filter:i}=t;zt(i)&&ci.add(i),zt(r)&&si.add(r)})}function bs(e={}){let{name:t}=e,r=b(k("commerce.debug",{search:!0,storage:!0}),t===wn.LOCAL);return Zt(r?An:Tn),t===wn.PROD&&Zt(ai),ne}function vs(){si.clear(),ci.clear()}var ne={..._n(Rr),Level:oi,Plugins:{consoleAppender:An,debugFilter:Tn,quietFilter:fs,lanaAppender:ai},init:bs,reset:vs,use:Zt};var Xe=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let n=r.response.headers?.get(ot);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,n])=>`${i}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var ys={[ae]:Sr,[be]:Ar,[pe]:Tr},Es={[ae]:Cr,[pe]:Lr},gt,Ee=class{constructor(t){$(this,gt);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",be);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=ne.module("mas-element")}update(){[ae,be,pe].forEach(t=>{this.wrapperElement.classList.toggle(ys[t],t===this.state)})}notify(){(this.state===pe||this.state===ae)&&(this.state===pe?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===ae&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof Xe&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Es[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){G(this,gt,W()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return pe===i?Promise.resolve(this.wrapperElement):ae===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=pe,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Xt(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=ae,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...T(this,gt)?.duration}),Xt(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=be,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!W()||this.timer)return;let{error:r,options:i,state:n,value:a,version:o}=this;this.state=be,this.timer=Xt(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===be&&this.version===o&&(this.state=n,this.error=r,this.value=a,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,i)}})}};gt=new WeakMap;function Pn(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Jt(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,Pn(t)),n}function Cn(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Pn(t)),e):null}function ws(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Re,Ce=class Ce extends HTMLAnchorElement{constructor(){super();g(this,"masElement",new Ee(this));$(this,Re);this.setAttribute("is",Ce.is)}get isUptLink(){return!0}initializeWcsData(r,i){this.setAttribute("data-wcs-osi",r),i&&this.setAttribute("data-promotion-code",i)}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),G(this,Re,ct()),T(this,Re)&&(this.log=T(this,Re).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),G(this,Re,void 0)}requestUpdate(r=!1){this.masElement.requestUpdate(r)}onceSettled(){return this.masElement.onceSettled()}async render(){let r=ct();if(!r)return!1;this.dataset.imsCountry||r.imsCountryPromise.then(o=>{o&&(this.dataset.imsCountry=o)});let i=r.collectCheckoutOptions({},this);if(!i.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(i),a=r.resolveOfferSelectors(i);try{let[[o]]=await Promise.all(a),{country:s,language:c,env:l}=i,d=`locale=${c}_${s}&country=${s}&offer_id=${o.offerId}`,m=this.getAttribute("data-promotion-code");m&&(d+=`&promotion_code=${encodeURIComponent(m)}`),this.href=`${ws(l)}?${d}`,this.masElement.toggleResolved(n,o,i)}catch(o){let s=new Error(`Could not resolve offer selectors for id: ${i.wcsOsi}.`,o.message);return this.masElement.toggleFailed(n,s,i),!1}}static createFrom(r){let i=new Ce;for(let n of r.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?i.setAttribute("class",n.value.replace("upt-link","").trim()):i.setAttribute(n.name,n.value));return i.innerHTML=r.innerHTML,i.setAttribute("tabindex",0),i}};Re=new WeakMap,g(Ce,"is","upt-link"),g(Ce,"tag","a"),g(Ce,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var Le=Ce;window.customElements.get(Le.is)||window.customElements.define(Le.is,Le,{extends:Le.tag});function Ln(e){return e&&(e.startsWith("plans")?"plans":e)}var Rn="download",Mn="upgrade",Nn={e:"EDU",t:"TEAM"};function On(e,t={},r=""){let i=W();if(!i)return null;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:m,quantity:h,wcsOsi:p,extraOptions:f,analyticsId:u}=i.collectCheckoutOptions(t),v=Jt(e,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:m,quantity:h,wcsOsi:p,extraOptions:f,analyticsId:u});return r&&(v.innerHTML=`<span style="pointer-events: none;">${r}</span>`),v}function kn(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Ee(this))}attributeChangedCallback(i,n,a){this.masElement.attributeChangedCallback(i,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return Nn[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return Nn[i]??i}get is3in1Modal(){return Object.values(Te).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let n=W();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(m=>{m&&(this.dataset.imsCountry=m)}),i.imsCountry=null;let a=n.collectCheckoutOptions(i,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(m){this.masElement.log?.error("cannot parse exta checkout options",m)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let c=n.resolveOfferSelectors(a),l=await Promise.all(c);l=l.map(m=>ft(m,a)),a.country=this.dataset.imsCountry||a.country;let d=await n.buildCheckoutAction?.(l.flat(),{...o,...a},this);return this.renderOffers(l.flat(),a,{},d,s)}renderOffers(i,n,a={},o=void 0,s=void 0){let c=W();if(!c)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"{}"),...n,...a},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(Rn,Mn),this.masElement.toggleResolved(s,i,n);let{url:d,text:m,className:h,handler:p}=o;d&&this.setCheckoutUrl(d),m&&(this.firstElementChild.innerHTML=m),h&&this.classList.add(...h.split(" ")),p&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=p.bind(this))}if(i.length){if(this.masElement.toggleResolved(s,i,n)){if(!this.classList.contains(Rn)&&!this.classList.contains(Mn)){let d=c.buildCheckoutURL(i,n);this.setCheckoutUrl(n.modal==="true"?"#":d)}return!0}}else{let d=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,d,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let n=W();if(!n)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:m,promotionCode:h,quantity:p,wcsOsi:f}=n.collectCheckoutOptions(i);return Cn(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:m,promotionCode:h,quantity:p,wcsOsi:f}),!0}}}var xt=class xt extends kn(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return On(xt,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(xt,"is","checkout-link"),g(xt,"tag","a");var he=xt;window.customElements.get(he.is)||window.customElements.define(he.is,he,{extends:he.tag});var Ss="p_draft_landscape",As="/store/",Ts=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),li=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),_s=["env","workflowStep","clientId","country"],In=e=>Ts.get(e)??e;function di(e,t,r){for(let[i,n]of Object.entries(e)){let a=In(i);n!=null&&r.has(a)&&t.set(a,n)}}function Ps(e){switch(e){case Hr.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Cs(e,t){for(let r in e){let i=e[r];for(let[n,a]of Object.entries(i)){if(a==null)continue;let o=In(n);t.set(`items[${r}][${o}]`,a)}}}function Ls({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===Te.CRM?"creative":"mini_plans"),e}function Hn(e){Rs(e);let{env:t,items:r,workflowStep:i,marketSegment:n,customerSegment:a,offerType:o,productArrangementCode:s,landscape:c,modal:l,is3in1:d,preselectPlan:m,...h}=e,p=new URL(Ps(t));if(p.pathname=`${As}${i}`,i!==j.SEGMENTATION&&i!==j.CHANGE_PLAN_TEAM_PLANS&&Cs(r,p.searchParams),di({...h},p.searchParams,li),c===ve.DRAFT&&di({af:Ss},p.searchParams,li),i===j.SEGMENTATION){let f={marketSegment:n,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(u=>u.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};m?.toLowerCase()==="edu"?p.searchParams.set("ms","EDU"):m?.toLowerCase()==="team"&&p.searchParams.set("cs","TEAM"),di(f,p.searchParams,li),p.searchParams.get("ot")==="PROMOTION"&&p.searchParams.delete("ot"),p=Ls({url:p,modal:l,is3in1:d})}return p.toString()}function Rs(e){for(let t of _s)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==j.SEGMENTATION&&e.workflowStep!==j.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var P=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:j.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:le.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:ve.PUBLISHED});function Dn({settings:e,providers:t}){function r(a,o){let{checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:m,quantity:h,preselectPlan:p,env:f}=e,u={checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:m,quantity:h,preselectPlan:p,env:f};if(o)for(let ke of t.checkout)ke(o,u);let{checkoutMarketSegment:v,checkoutWorkflowStep:_=c,imsCountry:E,country:y=E??l,language:A=d,quantity:C=h,entitlement:N,upgrade:B,modal:V,perpetual:I,promotionCode:R=m,wcsOsi:F,extraOptions:J,...ge}=Object.assign(u,o?.dataset??{},a??{}),ce=ut(_,j,P.checkoutWorkflowStep);return u=jt({...ge,extraOptions:J,checkoutClientId:s,checkoutMarketSegment:v,country:y,quantity:Ye(C,P.quantity),checkoutWorkflowStep:ce,language:A,entitlement:b(N),upgrade:b(B),modal:V,perpetual:b(I),promotionCode:Wt(R).effectivePromoCode,wcsOsi:Kt(F),preselectPlan:p}),u}function i(a,o){if(!Array.isArray(a)||!a.length||!o)return"";let{env:s,landscape:c}=e,{checkoutClientId:l,checkoutMarketSegment:d,checkoutWorkflowStep:m,country:h,promotionCode:p,quantity:f,preselectPlan:u,ms:v,cs:_,...E}=r(o),y=document.querySelector("meta[name=mas-ff-3in1]"),A=Object.values(Te).includes(o.modal)&&(!y||y.content!=="off"),C=window.frameElement||A?"if":"fp",[{productArrangementCode:N,marketSegments:[B],customerSegment:V,offerType:I}]=a,R=v??B??d,F=_??V;u?.toLowerCase()==="edu"?R="EDU":u?.toLowerCase()==="team"&&(F="TEAM");let J={is3in1:A,checkoutPromoCode:p,clientId:l,context:C,country:h,env:s,items:[],marketSegment:R,customerSegment:F,offerType:I,productArrangementCode:N,workflowStep:m,landscape:c,...E},ge=f[0]>1?f[0]:void 0;if(a.length===1){let{offerId:ce}=a[0];J.items.push({id:ce,quantity:ge})}else J.items.push(...a.map(({offerId:ce,productArrangementCode:ke})=>({id:ce,quantity:ge,...A?{productArrangementCode:ke}:{}})));return Hn(J)}let{createCheckoutLink:n}=he;return{CheckoutLink:he,CheckoutWorkflowStep:j,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:n}}function Ms({interval:e=200,maxAttempts:t=25}={}){let r=ne.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function Ns(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function Os(e){let t=ne.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function Bn({}){let e=Ms(),t=Ns(e),r=Os(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var Un=window.masPriceLiterals;function Fn(e){if(Array.isArray(Un)){let t=i=>Un.find(n=>Wr(n.lang,i)),r=t(e.language)??t(P.language);if(r)return Object.freeze(r)}return{}}var pi=function(e,t){return pi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},pi(e,t)};function bt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");pi(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var w=function(){return w=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},w.apply(this,arguments)};function er(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var x;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(x||(x={}));var M;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(M||(M={}));var Me;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Me||(Me={}));function hi(e){return e.type===M.literal}function $n(e){return e.type===M.argument}function tr(e){return e.type===M.number}function rr(e){return e.type===M.date}function ir(e){return e.type===M.time}function nr(e){return e.type===M.select}function ar(e){return e.type===M.plural}function Gn(e){return e.type===M.pound}function or(e){return e.type===M.tag}function sr(e){return!!(e&&typeof e=="object"&&e.type===Me.number)}function vt(e){return!!(e&&typeof e=="object"&&e.type===Me.dateTime)}var mi=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var ks=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function zn(e){var t={};return e.replace(ks,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Vn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Yn(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Vn).filter(function(h){return h.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],c=o.slice(1),l=0,d=c;l<d.length;l++){var m=d[l];if(m.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Is(e){return e.replace(/^(.*?)-/,"")}var jn=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Xn=/^(@+)?(\+|#+)?[rs]?$/g,Hs=/(\*)(0+)|(#+)(0+)|(0+)/g,Kn=/^(0+)$/;function qn(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(Xn,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function Qn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Ds(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Kn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Wn(e){var t={},r=Qn(e);return r||t}function Zn(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Is(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=w(w(w({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return w(w({},c),Wn(l))},{}));continue;case"engineering":t=w(w(w({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return w(w({},c),Wn(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(Hs,function(c,l,d,m,h,p){if(l)t.minimumIntegerDigits=d.length;else{if(m&&h)throw new Error("We currently do not support maximum integer digits");if(p)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Kn.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(jn.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(jn,function(c,l,d,m,h,p){return d==="*"?t.minimumFractionDigits=l.length:m&&m[0]==="#"?t.maximumFractionDigits=m.length:h&&p?(t.minimumFractionDigits=h.length,t.maximumFractionDigits=h.length+p.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var a=n.options[0];a==="w"?t=w(w({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=w(w({},t),qn(a)));continue}if(Xn.test(n.stem)){t=w(w({},t),qn(n.stem));continue}var o=Qn(n.stem);o&&(t=w(w({},t),o));var s=Ds(n.stem);s&&(t=w(w({},t),s))}return t}var yt={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Jn(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),c="a",l=Bs(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;o-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function Bs(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=yt[i||""]||yt[r||""]||yt["".concat(r,"-001")]||yt["001"];return n[0]}var ui,Us=new RegExp("^".concat(mi.source,"*")),Fs=new RegExp("".concat(mi.source,"*$"));function S(e,t){return{start:e,end:t}}var $s=!!String.prototype.startsWith,Gs=!!String.fromCodePoint,zs=!!Object.fromEntries,Vs=!!String.prototype.codePointAt,js=!!String.prototype.trimStart,qs=!!String.prototype.trimEnd,Ws=!!Number.isSafeInteger,Ys=Ws?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},gi=!0;try{ea=na("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),gi=((ui=ea.exec("a"))===null||ui===void 0?void 0:ui[0])==="a"}catch{gi=!1}var ea,ta=$s?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},xi=Gs?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},ra=zs?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},ia=Vs?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},Xs=js?function(t){return t.trimStart()}:function(t){return t.replace(Us,"")},Ks=qs?function(t){return t.trimEnd()}:function(t){return t.replace(Fs,"")};function na(e,t){return new RegExp(e,t)}var bi;gi?(fi=na("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),bi=function(t,r){var i;fi.lastIndex=r;var n=fi.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):bi=function(t,r){for(var i=[];;){var n=ia(t,r);if(n===void 0||oa(n)||Js(n))break;i.push(n),r+=n>=65536?2:1}return xi.apply(void 0,i)};var fi,aa=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:M.pound,location:S(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(x.UNMATCHED_CLOSING_TAG,S(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&vi(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:M.literal,value:"<".concat(n,"/>"),location:S(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!vi(this.char()))return this.error(x.INVALID_TAG,S(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(x.UNMATCHED_CLOSING_TAG,S(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:M.tag,value:n,children:o,location:S(i,this.clonePosition())},err:null}:this.error(x.INVALID_TAG,S(s,this.clonePosition())))}else return this.error(x.UNCLOSED_TAG,S(i,this.clonePosition()))}else return this.error(x.INVALID_TAG,S(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Zs(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=S(i,this.clonePosition());return{val:{type:M.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Qs(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return xi.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),xi(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(x.EMPTY_ARGUMENT,S(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(x.MALFORMED_ARGUMENT,S(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:M.argument,value:n,location:S(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(x.MALFORMED_ARGUMENT,S(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=bi(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=S(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(x.EXPECT_ARGUMENT_TYPE,S(o,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var d=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var h=Ks(m.val);if(h.length===0)return this.error(x.EXPECT_ARGUMENT_STYLE,S(this.clonePosition(),this.clonePosition()));var p=S(d,this.clonePosition());l={style:h,styleLocation:p}}var f=this.tryParseArgumentClose(n);if(f.err)return f;var u=S(n,this.clonePosition());if(l&&ta(l?.style,"::",0)){var v=Xs(l.style.slice(2));if(s==="number"){var m=this.parseNumberSkeletonFromString(v,l.styleLocation);return m.err?m:{val:{type:M.number,value:i,location:u,style:m.val},err:null}}else{if(v.length===0)return this.error(x.EXPECT_DATE_TIME_SKELETON,u);var _=v;this.locale&&(_=Jn(v,this.locale));var h={type:Me.dateTime,pattern:_,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?zn(_):{}},E=s==="date"?M.date:M.time;return{val:{type:E,value:i,location:u,style:h},err:null}}}return{val:{type:s==="number"?M.number:s==="date"?M.date:M.time,value:i,location:u,style:(a=l?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var y=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(x.EXPECT_SELECT_ARGUMENT_OPTIONS,S(y,w({},y)));this.bumpSpace();var A=this.parseIdentifierIfPossible(),C=0;if(s!=="select"&&A.value==="offset"){if(!this.bumpIf(":"))return this.error(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,x.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),A=this.parseIdentifierIfPossible(),C=m.val}var N=this.tryParsePluralOrSelectOptions(t,s,r,A);if(N.err)return N;var f=this.tryParseArgumentClose(n);if(f.err)return f;var B=S(n,this.clonePosition());return s==="select"?{val:{type:M.select,value:i,options:ra(N.val),location:B},err:null}:{val:{type:M.plural,value:i,options:ra(N.val),offset:C,pluralType:s==="plural"?"cardinal":"ordinal",location:B},err:null}}default:return this.error(x.INVALID_ARGUMENT_TYPE,S(o,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,S(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(x.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,S(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=Yn(t)}catch{return this.error(x.INVALID_NUMBER_SKELETON,r)}return{val:{type:Me.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?Zn(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],c=new Set,l=n.value,d=n.location;;){if(l.length===0){var m=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var h=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_SELECTOR,x.INVALID_PLURAL_ARGUMENT_SELECTOR);if(h.err)return h;d=S(m,this.clonePosition()),l=this.message.slice(m.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?x.DUPLICATE_SELECT_ARGUMENT_SELECTOR:x.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,d);l==="other"&&(o=!0),this.bumpSpace();var p=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:x.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,S(this.clonePosition(),this.clonePosition()));var f=this.parseMessage(t+1,r,i);if(f.err)return f;var u=this.tryParseArgumentClose(p);if(u.err)return u;s.push([l,{value:f.val,location:S(p,this.clonePosition())}]),c.add(l),this.bumpSpace(),a=this.parseIdentifierIfPossible(),l=a.value,d=a.location}return s.length===0?this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR:x.EXPECT_PLURAL_ARGUMENT_SELECTOR,S(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(x.MISSING_OTHER_CLAUSE,S(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var c=S(n,this.clonePosition());return a?(o*=i,Ys(o)?{val:o,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=ia(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(ta(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&oa(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function vi(e){return e>=97&&e<=122||e>=65&&e<=90}function Qs(e){return vi(e)||e===47}function Zs(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function oa(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Js(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function yi(e){e.forEach(function(t){if(delete t.location,nr(t)||ar(t))for(var r in t.options)delete t.options[r].location,yi(t.options[r].value);else tr(t)&&sr(t.style)||(rr(t)||ir(t))&&vt(t.style)?delete t.style.location:or(t)&&yi(t.children)})}function sa(e,t){t===void 0&&(t={}),t=w({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new aa(e,t).parse();if(r.err){var i=SyntaxError(x[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||yi(r.val),r.val}function Et(e,t){var r=t&&t.cache?t.cache:ac,i=t&&t.serializer?t.serializer:nc,n=t&&t.strategy?t.strategy:tc;return n(e,{cache:r,serializer:i})}function ec(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ca(e,t,r,i){var n=ec(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function la(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function Ei(e,t,r,i,n){return r.bind(t,e,i,n)}function tc(e,t){var r=e.length===1?ca:la;return Ei(e,this,r,t.cache.create(),t.serializer)}function rc(e,t){return Ei(e,this,la,t.cache.create(),t.serializer)}function ic(e,t){return Ei(e,this,ca,t.cache.create(),t.serializer)}var nc=function(){return JSON.stringify(arguments)};function wi(){this.cache=Object.create(null)}wi.prototype.get=function(e){return this.cache[e]};wi.prototype.set=function(e,t){this.cache[e]=t};var ac={create:function(){return new wi}},cr={variadic:rc,monadic:ic};var Ne;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Ne||(Ne={}));var wt=function(e){bt(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Si=function(e){bt(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Ne.INVALID_VALUE,a)||this}return t}(wt);var da=function(e){bt(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Ne.INVALID_VALUE,n)||this}return t}(wt);var pa=function(e){bt(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Ne.MISSING_VALUE,i)||this}return t}(wt);var z;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(z||(z={}));function oc(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==z.literal||r.type!==z.literal?t.push(r):i.value+=r.value,t},[])}function sc(e){return typeof e=="function"}function St(e,t,r,i,n,a,o){if(e.length===1&&hi(e[0]))return[{type:z.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var d=l[c];if(hi(d)){s.push({type:z.literal,value:d.value});continue}if(Gn(d)){typeof a=="number"&&s.push({type:z.literal,value:r.getNumberFormat(t).format(a)});continue}var m=d.value;if(!(n&&m in n))throw new pa(m,o);var h=n[m];if($n(d)){(!h||typeof h=="string"||typeof h=="number")&&(h=typeof h=="string"||typeof h=="number"?String(h):""),s.push({type:typeof h=="string"?z.literal:z.object,value:h});continue}if(rr(d)){var p=typeof d.style=="string"?i.date[d.style]:vt(d.style)?d.style.parsedOptions:void 0;s.push({type:z.literal,value:r.getDateTimeFormat(t,p).format(h)});continue}if(ir(d)){var p=typeof d.style=="string"?i.time[d.style]:vt(d.style)?d.style.parsedOptions:i.time.medium;s.push({type:z.literal,value:r.getDateTimeFormat(t,p).format(h)});continue}if(tr(d)){var p=typeof d.style=="string"?i.number[d.style]:sr(d.style)?d.style.parsedOptions:void 0;p&&p.scale&&(h=h*(p.scale||1)),s.push({type:z.literal,value:r.getNumberFormat(t,p).format(h)});continue}if(or(d)){var f=d.children,u=d.value,v=n[u];if(!sc(v))throw new da(u,"function",o);var _=St(f,t,r,i,n,a),E=v(_.map(function(C){return C.value}));Array.isArray(E)||(E=[E]),s.push.apply(s,E.map(function(C){return{type:typeof C=="string"?z.literal:z.object,value:C}}))}if(nr(d)){var y=d.options[h]||d.options.other;if(!y)throw new Si(d.value,h,Object.keys(d.options),o);s.push.apply(s,St(y.value,t,r,i,n));continue}if(ar(d)){var y=d.options["=".concat(h)];if(!y){if(!Intl.PluralRules)throw new wt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Ne.MISSING_INTL_API,o);var A=r.getPluralRules(t,{type:d.pluralType}).select(h-(d.offset||0));y=d.options[A]||d.options.other}if(!y)throw new Si(d.value,h,Object.keys(d.options),o);s.push.apply(s,St(y.value,t,r,i,n,h-(d.offset||0)));continue}}return oc(s)}function cc(e,t){return t?w(w(w({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=w(w({},e[i]),t[i]||{}),r},{})):e}function lc(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=cc(e[i],t[i]),r},w({},e)):e}function Ai(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function dc(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Et(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,er([void 0],r,!1)))},{cache:Ai(e.number),strategy:cr.variadic}),getDateTimeFormat:Et(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,er([void 0],r,!1)))},{cache:Ai(e.dateTime),strategy:cr.variadic}),getPluralRules:Et(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,er([void 0],r,!1)))},{cache:Ai(e.pluralRules),strategy:cr.variadic})}}var ha=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var c=s.reduce(function(l,d){return!l.length||d.type!==z.literal||typeof l[l.length-1]!="string"?l.push(d.value):l[l.length-1]+=d.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(o){return St(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=lc(e.formats,i),this.formatters=n&&n.formatters||dc(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=sa,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var ma=ha;var pc=/[0-9\-+#]/,hc=/[^\d\-+#]/g;function ua(e){return e.search(pc)}function mc(e="#.##"){let t={},r=e.length,i=ua(e);t.prefix=i>0?e.substring(0,i):"";let n=ua(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(hc);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function uc(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,fc(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function fc(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let c=0;c<o;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function gc(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=mc(e),n=uc(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var fa=gc;var ga=".",xc=",",ba=/^\s+/,va=/\s+$/,xa="&nbsp;",Ti=e=>e*12,ya=(e,t)=>{let{start:r,end:i,displaySummary:{amount:n,duration:a,minProductQuantity:o,outcomeType:s}={}}=e;if(!(n&&a&&s&&o))return!1;let c=t?new Date(t):new Date;if(!r||!i)return!1;let l=new Date(r),d=new Date(i);return c>=l&&c<=d},Oe={MONTH:"MONTH",YEAR:"YEAR"},bc={[te.ANNUAL]:12,[te.MONTHLY]:1,[te.THREE_YEARS]:36,[te.TWO_YEARS]:24},_i=(e,t)=>({accept:e,round:t}),vc=[_i(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),_i(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),_i(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Pi={[Ae.YEAR]:{[te.MONTHLY]:Oe.MONTH,[te.ANNUAL]:Oe.YEAR},[Ae.MONTH]:{[te.MONTHLY]:Oe.MONTH}},yc=(e,t)=>e.indexOf(`'${t}'`)===0,Ec=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=wa(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Sc(e)),r},wc=e=>{let t=Ac(e),r=yc(e,t),i=e.replace(/'.*?'/,""),n=ba.test(i)||va.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},Ea=e=>e.replace(ba,xa).replace(va,xa),Sc=e=>e.match(/#(.?)#/)?.[1]===ga?xc:ga,Ac=e=>e.match(/'(.*?)'/)?.[1]??"",wa=e=>e.match(/0(.?)0/)?.[1]??"";function Ke({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:c}=wc(e),l=r?wa(e):"",d=Ec(e,r),m=r?2:0,h=a(t,{currencySymbol:o}),p=i?h.toLocaleString("hi-IN",{minimumFractionDigits:m,maximumFractionDigits:m}):fa(d,h),f=r?p.lastIndexOf(l):p.length,u=p.substring(0,f),v=p.substring(f+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,p).replace(/SYMBOL/,o),currencySymbol:o,decimals:v,decimalsDelimiter:l,hasCurrencySpace:c,integer:u,isCurrencyFirst:s,recurrenceTerm:n}}var Sa=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=bc[r]??1;return Ke(e,n>1?Oe.MONTH:Pi[t]?.[r],a=>{let o={divisor:n,price:a,usePrecision:i},{round:s}=vc.find(({accept:c})=>c(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},Aa=({commitment:e,term:t,...r})=>Ke(r,Pi[e]?.[t]),Ta=e=>{let{commitment:t,instant:r,price:i,originalPrice:n,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:c}=e;if(t===Ae.YEAR&&c===te.MONTHLY){if(!o)return Ke(e,Oe.YEAR,Ti);let{displaySummary:{outcomeType:l,duration:d,minProductQuantity:m=1}={}}=o;switch(l){case"PERCENTAGE_DISCOUNT":if(s>=m&&ya(o,r)){let h=parseInt(d.replace("P","").replace("M",""));if(isNaN(h))return Ti(i);let p=s*n*h,f=s*a*(12-h),u=Math.round((p+f)*100)/100;return Ke({...e,price:u},Oe.YEAR)}default:return Ke(e,Oe.YEAR,()=>Ti(a??i))}}return Ke(e,Pi[t]?.[c])};var Ci={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},Tc=un("ConsonantTemplates/price"),_c=/<\/?[^>]+(>|$)/g,D={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},we={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},Li="TAX_EXCLUSIVE",Pc=e=>pn(e)?Object.entries(e).filter(([,t])=>We(t)||Vt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+dn(i)+'"'}`,""):"",U=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+D.disabled}"${Pc(r)}>${i?Ea(t):t??""}</span>`;function me(e,t,r,i){let n=e[r];if(n==null)return"";try{return new ma(n.replace(_c,""),t).format(i)}catch{return Tc.error("Failed to format literal:",n),""}}function Cc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:n,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:d,taxInclusivityLabel:m},h={}){let p=U(D.currencySymbol,i),f=U(D.currencySpace,o?"&nbsp;":""),u="";return t?u=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(u=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(u+=p+f),u+=U(D.integer,s),u+=U(D.decimalsDelimiter,a),u+=U(D.decimals,n),c||(u+=f+p),u+=U(D.recurrence,l,null,!0),u+=U(D.unitType,d,null,!0),u+=U(D.taxInclusivity,m,!0),U(e,u,{...h})}var Y=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:n=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:d,literals:m={},quantity:h=1,space:p=!1}={},{commitment:f,offerSelectorIds:u,formatString:v,price:_,priceWithoutDiscount:E,taxDisplay:y,taxTerm:A,term:C,usePrecision:N,promotion:B}={},V={})=>{Object.entries({country:a,formatString:v,language:d,price:_}).forEach(([po,ho])=>{if(ho==null)throw new Error(`Argument "${po}" is missing for osi ${u?.toString()}, country ${a}, language ${d}`)});let I={...Ci,...m},R=`${d.toLowerCase()}-${a.toUpperCase()}`,F=r&&E?E:_,J=t?Sa:Aa;i&&(J=Ta);let{accessiblePrice:ge,recurrenceTerm:ce,...ke}=J({commitment:f,formatString:v,instant:n,isIndianPrice:a==="IN",originalPrice:_,priceWithoutDiscount:E,price:t?_:F,promotion:B,quantity:h,term:C,usePrecision:N}),pr="",hr="",mr="";b(s)&&ce&&(mr=me(I,R,we.recurrenceLabel,{recurrenceTerm:ce}));let Lt="";b(c)&&(p&&(Lt+=" "),Lt+=me(I,R,we.perUnitLabel,{perUnit:"LICENSE"}));let Rt="";b(l)&&A&&(p&&(Rt+=" "),Rt+=me(I,R,y===Li?we.taxExclusiveLabel:we.taxInclusiveLabel,{taxTerm:A})),r&&(pr=me(I,R,we.strikethroughAriaLabel,{strikethroughPrice:pr})),e&&(hr=me(I,R,we.alternativePriceAriaLabel,{alternativePrice:hr}));let Ie=D.container;if(t&&(Ie+=" "+D.containerOptical),r&&(Ie+=" "+D.containerStrikethrough),e&&(Ie+=" "+D.containerAlternative),i&&(Ie+=" "+D.containerAnnual),b(o))return Cc(Ie,{...ke,accessibleLabel:pr,altAccessibleLabel:hr,recurrenceLabel:mr,perUnitLabel:Lt,taxInclusivityLabel:Rt},V);let{currencySymbol:ki,decimals:ao,decimalsDelimiter:oo,hasCurrencySpace:Ii,integer:so,isCurrencyFirst:co}=ke,He=[so,oo,ao];co?(He.unshift(Ii?"\xA0":""),He.unshift(ki)):(He.push(Ii?"\xA0":""),He.push(ki)),He.push(mr,Lt,Rt);let lo=He.join("");return U(Ie,lo,V)},_a=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||b(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${n?Y({displayStrikethrough:!0})(e,t,r)+"&nbsp;":""}${Y({isAlternativePrice:n})(e,t,r)}`},Pa=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let n={...e,displayTax:!1,displayPerUnit:!1},o=(e.displayOldPrice===void 0||b(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?Y({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${Y({isAlternativePrice:o})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0,instant:i})(n,t,r)}${U(D.containerAnnualSuffix,")")}`},Ca=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${Y({isAlternativePrice:e.displayOldPrice})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0})(i,t,r)}${U(D.containerAnnualSuffix,")")}`};var At={...D,containerLegal:"price-legal",planType:"price-plan-type"},lr={...we,planTypeLabel:"planTypeLabel"};function Lc(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},n={}){let a="";return a+=U(At.unitType,t,null,!0),r&&i&&(r+=". "),a+=U(At.taxInclusivity,r,!0),a+=U(At.planType,i,null),U(e,a,{...n})}var La=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:n,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:c}={},l={})=>{let d={...Ci,...a},m=`${n.toLowerCase()}-${e.toUpperCase()}`,h="";b(t)&&(h=me(d,m,lr.perUnitLabel,{perUnit:"LICENSE"}));let p="";e==="US"&&n==="en"&&(r=!1),b(r)&&s&&(p=me(d,m,o===Li?lr.taxExclusiveLabel:lr.taxInclusiveLabel,{taxTerm:s}));let f="";b(i)&&c&&(f=me(d,m,lr.planTypeLabel,{planType:c}));let u=At.container;return u+=" "+At.containerLegal,Lc(u,{perUnitLabel:h,taxInclusivityLabel:p,planTypeLabel:f},l)};var Ra=Y(),Ma=_a(),Na=Y({displayOptical:!0}),Oa=Y({displayStrikethrough:!0}),ka=Y({displayAnnual:!0}),Ia=Y({displayOptical:!0,isAlternativePrice:!0}),Ha=Y({isAlternativePrice:!0}),Da=Ca(),Ba=Pa(),Ua=La;var Rc=(e,t)=>{if(!(!mt(e)||!mt(t)))return Math.floor((t-e)/t*100)},Fa=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=Rc(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var $a=Fa();var za="INDIVIDUAL_COM",Ri="TEAM_COM",Va="INDIVIDUAL_EDU",Mi="TEAM_EDU",Ga=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Mc={[za]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[Ri]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[Va]:["LT_lt","LV_lv","SA_en","SG_en"],[Mi]:["SG_en","KR_ko"]},Nc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},Oc=[za,Ri,Va,Mi],kc=e=>[Ri,Mi].includes(e),Ic=(e,t,r,i)=>{let n=`${e}_${t}`,a=`${r}_${i}`,o=Nc[n];if(o){let s=Oc.indexOf(a);return o[s]}return kc(a)},Hc=(e,t,r,i)=>{let n=`${e}_${t}`;if(Ga.includes(e)||Ga.includes(n))return!0;let a=Mc[`${r}_${i}`];return a?a.includes(e)||a.includes(n)?!0:P.displayTax:P.displayTax},Dc=async(e,t,r,i)=>{let n=Hc(e,t,r,i);return{displayTax:n,forceTaxExclusive:n?Ic(e,t,r,i):P.forceTaxExclusive}},Tt=class Tt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Ee(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let i=W();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:m,promotionCode:h,quantity:p,alternativePrice:f,template:u,wcsOsi:v}=i.collectPriceOptions(r);return Jt(Tt,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:m,promotionCode:h,quantity:p,alternativePrice:f,template:u,wcsOsi:v})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===ae}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=W();if(!i)return!1;let n=i.collectPriceOptions(r,this),a={...i.settings,...n};if(!a.wcsOsi.length)return!1;try{let o=this.masElement.togglePending({});this.innerHTML="";let[s]=await i.resolveOfferSelectors(a),c=ft(await s,a),[l]=c;if(i.featureFlags[ye]){if(n.displayPerUnit===void 0&&(a.displayPerUnit=l.customerSegment!=="INDIVIDUAL"),n.displayTax===void 0||n.forceTaxExclusive===void 0){let{country:d,language:m}=a,[h=""]=l.marketSegments,p=await Dc(d,m,l.customerSegment,h);n.displayTax===void 0&&(a.displayTax=p?.displayTax||a.displayTax),n.forceTaxExclusive===void 0&&(a.forceTaxExclusive=p?.forceTaxExclusive||a.forceTaxExclusive),a.forceTaxExclusive&&(c=ft(c,a))}}else n.displayOldPrice===void 0&&(a.displayOldPrice=!0);return this.renderOffers(c,a,o)}catch(o){throw this.innerHTML="",o}}renderOffers(r,i,n=void 0){if(!this.isConnected)return;let a=W();if(!a)return!1;if(n??(n=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(n,r,i)){this.innerHTML=a.buildPriceHTML(r,this.options);let o=this.closest("p, h3, div");if(!o||!o.querySelector('span[data-template="strikethrough"]')||o.querySelector(".alt-aria-label"))return!0;let s=o?.querySelectorAll('span[is="inline-price"]');return s.length>1&&s.length===o.querySelectorAll('span[data-template="strikethrough"]').length*2&&s.forEach(c=>{c.dataset.template!=="strikethrough"&&c.options&&!c.options.alternativePrice&&!c.isFailed&&(c.options.alternativePrice=!0,c.innerHTML=a.buildPriceHTML(r,c.options))}),!0}}else{let o=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,o,this.options))return this.innerHTML="",!0}return!1}};g(Tt,"is","inline-price"),g(Tt,"tag","span");var ue=Tt;window.customElements.get(ue.is)||window.customElements.define(ue.is,ue,{extends:ue.tag});function ja({literals:e,providers:t,settings:r}){function i(o,s=null){let c={country:r.country,language:r.language,locale:r.locale,literals:{...e.price}};if(s&&t?.price)for(let N of t.price)N(s,c);let{displayOldPrice:l,displayPerUnit:d,displayRecurrence:m,displayTax:h,displayPlanType:p,forceTaxExclusive:f,perpetual:u,displayAnnual:v,promotionCode:_,quantity:E,alternativePrice:y,wcsOsi:A,...C}=Object.assign(c,s?.dataset??{},o??{});return c=jt(Object.assign({...c,...C,displayOldPrice:b(l),displayPerUnit:b(d),displayRecurrence:b(m),displayTax:b(h),displayPlanType:b(p),forceTaxExclusive:b(f),perpetual:b(u),displayAnnual:b(v),promotionCode:Wt(_).effectivePromoCode,quantity:Ye(E,P.quantity),alternativePrice:b(y),wcsOsi:Kt(A)})),c}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=$a;break;case"strikethrough":l=Oa;break;case"annual":l=ka;break;case"legal":l=Ua;break;default:s.template==="optical"&&s.alternativePrice?l=Ia:s.template==="optical"?l=Na:s.displayAnnual&&o[0].planType==="ABM"?l=s.promotionCode?Ba:Da:s.alternativePrice?l=Ha:l=s.promotionCode?Ma:Ra}let[d]=o;return d={...d,...d.priceDetails},l({...r,...s},d)}let a=ue.createInlinePrice;return{InlinePrice:ue,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function Bc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||P.language),t??(t=e?.split("_")?.[1]||P.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function qa(e={},t){let r=t.featureFlags[ye],{commerce:i={}}=e,n=le.PRODUCTION,a=kr,o=k("checkoutClientId",i)??P.checkoutClientId,s=ut(k("checkoutWorkflowStep",i),j,P.checkoutWorkflowStep),c=P.displayOldPrice,l=P.displayPerUnit,d=b(k("displayRecurrence",i),P.displayRecurrence),m=b(k("displayTax",i),P.displayTax),h=b(k("displayPlanType",i),P.displayPlanType),p=b(k("entitlement",i),P.entitlement),f=b(k("modal",i),P.modal),u=b(k("forceTaxExclusive",i),P.forceTaxExclusive),v=k("promotionCode",i)??P.promotionCode,_=Ye(k("quantity",i)),E=k("wcsApiKey",i)??P.wcsApiKey,y=i?.env==="stage",A=ve.PUBLISHED;["true",""].includes(i.allowOverride)&&(y=(k(Nr,i,{metadata:!1})?.toLowerCase()??i?.env)==="stage",A=ut(k(Or,i),ve,A)),y&&(n=le.STAGE,a=Ir);let N=k(Mr)??e.preview,B=typeof N<"u"&&N!=="off"&&N!=="false",V={};B&&(V={preview:B});let I=k("mas-io-url")??e.masIOUrl??`https://www${n===le.STAGE?".stage":""}.adobe.com/mas/io`,R=k("preselect-plan")??void 0;return{...Bc(e),...V,displayOldPrice:c,checkoutClientId:o,checkoutWorkflowStep:s,displayPerUnit:l,displayRecurrence:d,displayTax:m,displayPlanType:h,entitlement:p,extraOptions:P.extraOptions,modal:f,env:n,forceTaxExclusive:u,promotionCode:v,quantity:_,alternativePrice:P.alternativePrice,wcsApiKey:E,wcsURL:a,landscape:A,masIOUrl:I,...R&&{preselectPlan:R}}}async function Wa(e,t={},r=2,i=100){let n;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(n=o,n.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,i*(a+1)))}throw n}var Ni="wcs";function Ya({settings:e}){let t=ne.module(Ni),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o,s=new Map;async function c(p,f,u=!0){let v=W(),_=Pr;t.debug("Fetching:",p);let E="",y;if(p.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let A=new Map(f),[C]=p.offerSelectorIds,N=Date.now()+Math.random().toString(36).substring(2,7),B=`${Ni}:${C}:${N}${Dr}`,V=`${Ni}:${C}:${N}${Br}`,I;try{if(performance.mark(B),E=new URL(e.wcsURL),E.searchParams.set("offer_selector_ids",C),E.searchParams.set("country",p.country),E.searchParams.set("locale",p.locale),E.searchParams.set("landscape",r===le.STAGE?"ALL":e.landscape),E.searchParams.set("api_key",i),p.language&&E.searchParams.set("language",p.language),p.promotionCode&&E.searchParams.set("promotion_code",p.promotionCode),p.currency&&E.searchParams.set("currency",p.currency),y=await Wa(E.toString(),{credentials:"omit"}),y.ok){let R=[];try{let F=await y.json();t.debug("Fetched:",p,F),R=F.resolvedOffers??[]}catch(F){t.error(`Error parsing JSON: ${F.message}`,{...F.context,...v?.duration})}R=R.map(Yt),f.forEach(({resolve:F},J)=>{let ge=R.filter(({offerSelectorIds:ce})=>ce.includes(J)).flat();ge.length&&(A.delete(J),f.delete(J),F(ge))})}else _=_r}catch(R){_=`Network error: ${R.message}`}finally{I=performance.measure(V,B),performance.clearMarks(B),performance.clearMeasures(V)}if(u&&f.size){t.debug("Missing:",{offerSelectorIds:[...f.keys()]});let R=vn(y);f.forEach(F=>{F.reject(new Xe(_,{...p,...R,response:y,measure:Ht(I),...v?.duration}))})}}function l(){clearTimeout(o);let p=[...a.values()];a.clear(),p.forEach(({options:f,promises:u})=>c(f,u))}function d(p){if(!p||typeof p!="object")throw new TypeError("Cache must be a Map or similar object");let f=r===le.STAGE?"stage":"prod",u=p[f];if(!u||typeof u!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[v,_]of Object.entries(u))n.set(v,Promise.resolve(_.map(Yt)));t.debug(`Prefilled WCS cache with ${u.size} entries`)}function m(){let p=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${p} cache entries to stale cache`)}function h({country:p,language:f,perpetual:u=!1,promotionCode:v="",wcsOsi:_=[]}){let E=`${f}_${p}`;p!=="GB"&&!u&&(f="MULT");let y=[p,f,v].filter(A=>A).join("-").toLowerCase();return _.map(A=>{let C=`${A}-${y}`;if(n.has(C))return n.get(C);let N=new Promise((B,V)=>{let I=a.get(y);if(!I){let R={country:p,locale:E,offerSelectorIds:[]};p!=="GB"&&!u&&(R.language=f),I={options:R,promises:new Map},a.set(y,I)}v&&(I.options.promotionCode=v),I.options.offerSelectorIds.push(A),I.promises.set(A,{resolve:B,reject:V}),l()}).catch(B=>{if(s.has(C))return s.get(C);throw B});return n.set(C,N),N})}return{Commitment:Ae,PlanType:gn,Term:te,applyPlanType:Yt,resolveOfferSelectors:h,flushWcsCacheInternal:m,prefillWcsCache:d}}var Xa="mas-commerce-service",Ka="mas-commerce-service:start",Qa="mas-commerce-service:ready",_t,Qe,Ze,Za,Ja,Oi=class extends HTMLElement{constructor(){super(...arguments);$(this,Ze);$(this,_t);$(this,Qe);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}get featureFlags(){return T(this,Qe)||G(this,Qe,{[ye]:Mt(this,Ze,Ja).call(this,ye)}),T(this,Qe)}activate(){let r=T(this,Ze,Za),i=qa(r,this);Qt(r.lana);let n=ne.init(r.hostEnv).module("service");n.debug("Activating:",r);let o={price:Fn(i)},s={checkout:new Set,price:new Set},c={literals:o,providers:s,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...Dn(c),...Bn(c),...ja(c),...Ya(c),...Fr,Log:ne,get defaults(){return P},get log(){return ne},get providers(){return{checkout(d){return s.checkout.add(d),()=>s.checkout.delete(d)},price(d){return s.price.add(d),()=>s.price.delete(d)},has:d=>s.price.has(d)||s.checkout.has(d)}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i});let l=new CustomEvent(It,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Qa),G(this,_t,performance.measure(Qa,Ka)),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(Ka),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(fr).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":Ht(T(this,_t))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:a,responseStatus:o})=>n===0&&a===0&&o<200||o>=400),i=Array.from(new Map(r.map(n=>[n.name,n])).values());if(i.some(({name:n})=>/(\/fragment\?|web_commerce_artifact)/.test(n))){let n=i.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};_t=new WeakMap,Qe=new WeakMap,Ze=new WeakSet,Za=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(n=>{let a=this.getAttribute(n);a&&(i[n]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let a=this.getAttribute(n);if(a!=null){let o=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());i.commerce[o]=a}}),i},Ja=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||k(r))};window.customElements.get(Xa)||window.customElements.define(Xa,Oi);var io="merch-card-collection",Uc=2e4,Fc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},$c={plans:!0},Gc=(e,{filter:t})=>e.filter(r=>r?.filters&&r?.filters.hasOwnProperty(t)),zc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,Vc=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),jc=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),qc=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Se,et,Ct,dr,no,Je=class extends to{constructor(){super();$(this,dr);$(this,Se,{});$(this,et);$(this,Ct);this.id=null,this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return fe`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(n=>setTimeout(()=>n(!1),Uc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(l=>l.tagName==="MERCH-CARD");if(n.length===0)return;r.has("singleApp")&&this.singleApp&&n.forEach(l=>{l.updateFilters(l.name===this.singleApp)});let a=this.sort===oe.alphabetical?Vc:jc,s=[Gc,zc,qc,a].reduce((l,d)=>d(l,this),n).map((l,d)=>[l,d]);if(this.resultCount=s.length,this.page&&this.limit){let l=this.page*this.limit;this.hasMore=s.length>l,s=s.filter(([,d])=>d<l)}let c=new Map(s.reverse());for(let l of c.keys())this.prepend(l);n.forEach(l=>{c.has(l)?(l.size=l.filters[this.filter]?.size,l.style.removeProperty("display"),l.requestUpdate()):(l.style.display="none",l.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(vr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(nt,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){G(this,Se,{}),this.overrides?.split(",").forEach(r=>{let[i,n]=r?.split(":");i&&n&&(T(this,Se)[i]=n)})}connectedCallback(){super.connectedCallback(),G(this,et,ct()),T(this,et)&&G(this,Ct,T(this,et).Log.module(io)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r,this.querySelectorAll("[placeholder]").forEach(n=>{let a=n.getAttribute("slot");this.header.placeholderKeys.includes(a)&&this.header.append(n)})}initializePlaceholders(){let r=this.data?.placeholders||{};for(let i of Object.keys(r)){let n=r[i],a=n.includes("<p>")?"div":"p",o=document.createElement(a);o.setAttribute("slot",i),o.setAttribute("placeholder",""),o.innerHTML=n,this.append(o)}}attachSidenav(r,i=!0){r&&(i&&this.parentElement.prepend(r),this.sidenav=r,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),$c[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(at)))}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.id=r.getAttribute("fragment"),this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let n=this;function a(o,s){let c={cards:[],hierarchy:[],placeholders:o.placeholders};function l(d,m){for(let h of m){if(h.fieldName==="cards"){if(c.cards.findIndex(u=>u.id===h.identifier)!==-1)continue;c.cards.push(o.references[h.identifier].value);continue}let{fields:p}=o.references[h.identifier].value,f={label:p.label||"",icon:p.icon,iconLight:p.iconLight,queryLabel:p.queryLabel,cards:p.cards?p.cards.map(u=>s[u]||u):[],collections:[]};p.defaultchild&&(f.defaultchild=s[p.defaultchild]||p.defaultchild),d.push(f),l(f.collections,h.referencesTree)}}return l(c.hierarchy,o.referencesTree),c.hierarchy.length===0&&(n.filtered="all"),c}r.addEventListener(Er,o=>{Mt(this,dr,no).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(yr,async o=>{this.data=a(o.detail,T(this,Se));let{cards:s,hierarchy:c}=this.data,l=c.length===0&&o.detail.fields?.defaultchild?T(this,Se)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...s);let d=(p,f)=>{for(let u of p)if(u.defaultchild===f||u.collections&&d(u.collections,f))return!0;return!1};for(let p of s){let _=function(y){for(let A of y){let C=A.cards.indexOf(u);if(C===-1)continue;let N=A.queryLabel??A?.label?.toLowerCase()??"";f.filters[N]={order:C+1,size:p.fields.size},_(A.collections)}},f=document.createElement("merch-card"),u=T(this,Se)[p.id]||p.id;f.setAttribute("consonant",""),f.setAttribute("style",""),Bt(p.fields.variant)?.supportsDefaultChild&&(l?u===l:d(c,u))&&f.setAttribute("data-default-card","true"),_(c);let E=document.createElement("aem-fragment");E.setAttribute("fragment",u),f.append(E),Object.keys(f.filters).length===0&&(f.filters={all:{order:s.indexOf(p)+1,size:p.fields.size}}),this.append(f)}let m="",h=Ln(s[0]?.fields?.variant);this.variant=h,h==="plans"&&s.length===3&&!s.some(p=>p.fields?.size?.includes("wide"))&&(m="ThreeColumns"),h&&this.classList.add("merch-card-collection",h,...Fc[`${h}${m}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i(!0)}),await this.hydrationReady}get footer(){if(!this.filtered)return fe`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return fe`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===oe.authored?it({sort:void 0}):it({sort:r.target.value}),this.dispatchEvent(new CustomEvent(xr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(br,{bubbles:!0,composed:!0}));let r=this.page+1;it({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=Ui(({category:r,filter:i,types:n,sort:a,search:o,single_app:s,page:c})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{it({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=n??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(c)||1})}openFilters(r){this.sidenav?.showModal(r)}};Se=new WeakMap,et=new WeakMap,Ct=new WeakMap,dr=new WeakSet,no=function(r,i={},n=!0){T(this,Ct).error(`merch-card-collection: ${r}`,i),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(wr,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(Je,"properties",{id:{type:String,attribute:"id",reflect:!0},displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:oe.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(Je,"styles",ro`
        #footer {
            grid-column: 1 / -1;
            justify-self: stretch;
            color: var(--merch-color-grey-80);
            order: 1000;
        }

        sp-theme {
            display: contents;
        }
    `);Je.SortOrder=oe;customElements.define(io,Je);var Wc={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},Yc=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(n=>{n.innerText=r||""})},Xc={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},Kc={catalog:"l"},X,tt,Pt=class extends to{constructor(){super();$(this,X);$(this,tt);g(this,"tablet",new rt(this,H));g(this,"desktop",new rt(this,L));this.collection=null,G(this,X,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(nt,this.updateLiterals),this.collection?.addEventListener(at,this.handleSidenavAttached),G(this,tt,customElements.get("merch-card"))}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(nt,this.updateLiterals),this.collection?.removeEventListener(at,this.handleSidenavAttached)}willUpdate(){T(this,X).search=this.getVisibility("search"),T(this,X).filter=this.getVisibility("filter"),T(this,X).sort=this.getVisibility("sort"),T(this,X).result=this.getVisibility("result"),T(this,X).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let n=r[i];return n===!1?!1:n===!0?!0:n.includes(this.currentMedia)}getVisibility(r){let i=T(this,tt).getCollectionOptions(this.collection?.variant)?.headerVisibility,n=this.parseVisibilityOptions(i,r);return n!==null?n:this.parseVisibilityOptions(Xc,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!T(this,X).search)return se;let r=st(this,"searchText");return r?fe`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${r}"
                      .size=${Kc[this.variant]}
                  ></sp-search>
              </merch-search>
          `:se}get filterAction(){return T(this,X).filter?this.sidenav?fe`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:se:se}get sortAction(){if(!T(this,X).sort)return se;let r=st(this,"sortText");if(!r)return;let i=st(this,"popularityText"),n=st(this,"alphabeticallyText");if(!(i&&n))return;let a=this.collection?.sort===oe.alphabetical;return fe`
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
          `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return Wc[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!T(this,X).result)return se;if(!this.sidenav)return se;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return fe`
            <div id="result" aria-live="polite" type=${r} quantity=${i}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!T(this,X).custom)return se;let r=T(this,tt).getCollectionOptions(this.collection?.variant)?.customHeaderArea;if(!r)return se;let i=r(this.collection);return!i||i===se?se:fe`<div id="custom" role="heading" aria-level="2">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{Yc(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return fe`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};X=new WeakMap,tt=new WeakMap,g(Pt,"styles",ro`
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
          @media screen and ${eo(H)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort" 
                                                        "result result result";
              }
          }
  
          /* Laptop */
          @media screen and ${eo(L)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",Pt);export{Je as MerchCardCollection,Pt as default};

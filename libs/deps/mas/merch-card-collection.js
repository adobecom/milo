var $i=Object.defineProperty;var Gi=e=>{throw TypeError(e)};var Eo=(e,t,r)=>t in e?$i(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var wo=(e,t)=>{for(var r in t)$i(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>Eo(e,typeof t!="symbol"?t+"":t,r),br=(e,t,r)=>t.has(e)||Gi("Cannot "+r);var A=(e,t,r)=>(br(e,t,"read from private field"),r?r.call(e):t.get(e)),$=(e,t,r)=>t.has(e)?Gi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),V=(e,t,r,i)=>(br(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),Bt=(e,t,r)=>(br(e,t,"access private method"),r);import{html as ve,LitElement as lo,css as po,unsafeCSS as co,nothing as de}from"../lit-all.min.js";var G="(max-width: 767px)",q="(max-width: 1199px)",I="(min-width: 768px)",L="(min-width: 1200px)",re="(min-width: 1600px)",Vi={matchMobile:window.matchMedia(G),matchDesktop:window.matchMedia(`${L} and (not ${re})`),matchDesktopOrUp:window.matchMedia(L),matchLargeDesktop:window.matchMedia(re),get isMobile(){return this.matchMobile.matches},get isDesktop(){return this.matchDesktop.matches},get isDesktopOrUp(){return this.matchDesktopOrUp.matches}},k=Vi;function st(){return Vi.isDesktop}var ct=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var qi="hashchange";function Ao(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[n,a=""]=i.split("=");n&&t.push([n,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function lt(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([n,a])=>{a?t.set(n,a):t.delete(n)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function ji(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=Ao(window.location.hash);e(r)};return t(),window.addEventListener(qi,t),()=>{window.removeEventListener(qi,t)}}var Vr={};wo(Vr,{CLASS_NAME_FAILED:()=>Lr,CLASS_NAME_HIDDEN:()=>To,CLASS_NAME_PENDING:()=>Pr,CLASS_NAME_RESOLVED:()=>kr,CheckoutWorkflow:()=>Fo,CheckoutWorkflowStep:()=>Q,Commitment:()=>_e,ERROR_MESSAGE_BAD_REQUEST:()=>Mr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Ho,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Rr,EVENT_AEM_ERROR:()=>_r,EVENT_AEM_LOAD:()=>Tr,EVENT_MAS_ERROR:()=>Cr,EVENT_MAS_READY:()=>Do,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>Oo,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>Er,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>se,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>Ar,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>dt,EVENT_MERCH_CARD_COLLECTION_SORT:()=>wr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>No,EVENT_MERCH_OFFER_READY:()=>Lo,EVENT_MERCH_OFFER_SELECT_READY:()=>Po,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>Ce,EVENT_MERCH_SEARCH_CHANGE:()=>Io,EVENT_MERCH_SIDENAV_SELECT:()=>Sr,EVENT_MERCH_STOCK_CHANGE:()=>Mo,EVENT_MERCH_STORAGE_CHANGE:()=>Ro,EVENT_OFFER_SELECTED:()=>ko,EVENT_TYPE_FAILED:()=>Nr,EVENT_TYPE_READY:()=>Ut,EVENT_TYPE_RESOLVED:()=>Or,Env:()=>he,FF_DEFAULTS:()=>ue,HEADER_X_REQUEST_ID:()=>pt,LOG_NAMESPACE:()=>Ir,Landscape:()=>Ee,MARK_DURATION_SUFFIX:()=>Gr,MARK_START_SUFFIX:()=>$r,MODAL_TYPE_3_IN_1:()=>Le,NAMESPACE:()=>So,PARAM_AOS_API_KEY:()=>Bo,PARAM_ENV:()=>Hr,PARAM_LANDSCAPE:()=>Br,PARAM_MAS_PREVIEW:()=>Dr,PARAM_WCS_API_KEY:()=>Uo,PROVIDER_ENVIRONMENT:()=>zr,SELECTOR_MAS_CHECKOUT_LINK:()=>Wi,SELECTOR_MAS_ELEMENT:()=>yr,SELECTOR_MAS_INLINE_PRICE:()=>K,SELECTOR_MAS_SP_BUTTON:()=>Co,SELECTOR_MAS_UPT_LINK:()=>Yi,SORT_ORDER:()=>le,STATE_FAILED:()=>ce,STATE_PENDING:()=>ye,STATE_RESOLVED:()=>me,TAG_NAME_SERVICE:()=>_o,TEMPLATE_PRICE:()=>zo,TEMPLATE_PRICE_ANNUAL:()=>Go,TEMPLATE_PRICE_LEGAL:()=>ht,TEMPLATE_PRICE_STRIKETHROUGH:()=>$o,Term:()=>ne,WCS_PROD_URL:()=>Ur,WCS_STAGE_URL:()=>Fr});var _e=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),ne=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),So="merch",To="hidden",Ut="wcms:commerce:ready",_o="mas-commerce-service",K='span[is="inline-price"][data-wcs-osi]',Wi='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',Co="sp-button[data-wcs-osi]",Yi='a[is="upt-link"]',yr=`${K},${Wi},${Yi}`,Lo="merch-offer:ready",Po="merch-offer-select:ready",Er="merch-card:action-menu-toggle",ko="merch-offer:selected",Mo="merch-stock:change",Ro="merch-storage:change",Ce="merch-quantity-selector:change",No="merch-card-quantity:change",Oo="merch-modal:addon-and-quantity-update",Io="merch-search:change",wr="merch-card-collection:sort",se="merch-card-collection:literals-changed",dt="merch-card-collection:sidenav-attached",Ar="merch-card-collection:showmore",Sr="merch-sidenav:select",Tr="aem:load",_r="aem:error",Do="mas:ready",Cr="mas:error",Lr="placeholder-failed",Pr="placeholder-pending",kr="placeholder-resolved",Mr="Bad WCS request",Rr="Commerce offer not found",Ho="Literals URL not provided",Nr="mas:failed",Or="mas:resolved",Ir="mas/commerce",Dr="mas.preview",Hr="commerce.env",Br="commerce.landscape",Bo="commerce.aosKey",Uo="commerce.wcsKey",Ur="https://www.adobe.com/web_commerce_artifact",Fr="https://www.stage.adobe.com/web_commerce_artifact_stage",ce="failed",ye="pending",me="resolved",Ee={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},pt="X-Request-Id",Q=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),Fo="UCv3",he=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),zr={PRODUCTION:"PRODUCTION"},Le={TWP:"twp",D2P:"d2p",CRM:"crm"},$r=":start",Gr=":duration",zo="price",$o="price-strikethrough",Go="annual",ht="legal",ue="mas-ff-defaults",le={alphabetical:"alphabetical",authored:"authored"};var Vo="mas-commerce-service";var mt=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Pe(e,t={},r=null,i=null){let n=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,o]of Object.entries(t))n.setAttribute(a,o);return n}function Ft(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function qr(){return window.matchMedia("(max-width: 1024px)").matches}function ut(){return document.getElementsByTagName(Vo)?.[0]}function ft(e){let t=window.getComputedStyle(e);return e.offsetHeight+parseFloat(t.marginTop)+parseFloat(t.marginBottom)}import{html as zt,nothing as qo}from"../lit-all.min.js";var ze,gt=class gt{constructor(t){g(this,"card");$(this,ze);this.card=t,this.insertVariantStyle()}getContainer(){return V(this,ze,A(this,ze)??this.card.closest('merch-card-collection, [class*="-merch-cards"]')??this.card.parentElement),A(this,ze)}insertVariantStyle(){if(!gt.styleMap[this.card.variant]){gt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),zt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return zt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?zt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:qo}get secureLabelFooter(){return zt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}syncHeights(){}renderLayout(){}get aemFragmentMapping(){return $t(this.card.variant)}};ze=new WeakMap,g(gt,"styleMap",{});var M=gt;import{html as jr,css as jo}from"../lit-all.min.js";var Xi=`
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

@media screen and ${G} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-columns: min-content auto;
    }
}

@media screen and ${I} {
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

merch-card[variant="catalog"] [slot="action-menu-content"] ul li p {
  display: inline;
}

merch-card[variant="catalog"] [slot="action-menu-content"] ::marker {
  margin-right: 0;
}

merch-card[variant="catalog"] [slot="action-menu-content"] p {
  color: var(--color-white, #fff);
  margin: 0;
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
}

merch-card[variant="catalog"] [slot="footer"] .spectrum-Link--primary {
  font-size: 15px;
  font-weight: 700;
}`;var Ki={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},shortDescription:{tag:"div",slot:"action-menu-content",attributes:{tabindex:"0"}},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},$e=class extends M{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Er,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),r.stopPropagation(),this.setMenuVisibility(!this.isMenuOpen()))});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.setIconVisibility(!1),this.actionMenuContentSlot&&r?.type==="mouseleave"&&this.setMenuVisibility(!1)});g(this,"showActionMenuOnHover",()=>{this.actionMenu&&this.setIconVisibility(!0)});g(this,"hideActionMenu",()=>{this.setMenuVisibility(!1),this.setIconVisibility(!1)});g(this,"hideActionMenuOnBlur",r=>{r.relatedTarget===this.actionMenu||this.actionMenu?.contains(r.relatedTarget)||this.slottedContent?.contains(r.relatedTarget)||(this.isMenuOpen()&&this.setMenuVisibility(!1),this.card.contains(r.relatedTarget)||this.setIconVisibility(!1))});g(this,"handleCardFocusOut",r=>{r.relatedTarget===this.actionMenu||this.actionMenu?.contains(r.relatedTarget)||r.relatedTarget===this.card||(this.slottedContent&&(r.target===this.slottedContent||this.slottedContent.contains(r.target))&&(this.slottedContent.contains(r.relatedTarget)||this.setMenuVisibility(!1)),!this.card.contains(r.relatedTarget)&&!this.isMenuOpen()&&this.setIconVisibility(!1))});g(this,"handleKeyDown",r=>{(r.key==="Escape"||r.key==="Esc")&&(r.preventDefault(),this.hideActionMenu(),this.actionMenu?.focus())})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}get slottedContent(){return this.card.querySelector('[slot="action-menu-content"]')}setIconVisibility(r){qr()&&this.card.actionMenu||(this.actionMenu?.classList.toggle("hidden",!r),this.actionMenu?.classList.toggle("always-visible",r))}setMenuVisibility(r){this.actionMenuContentSlot?.classList.toggle("hidden",!r),this.setAriaExpanded(this.actionMenu,r.toString()),r&&(this.dispatchActionMenuToggle(),setTimeout(()=>{let i=this.slottedContent?.querySelector("a");i&&i.focus()},0))}isMenuOpen(){return!this.actionMenuContentSlot?.classList.contains("hidden")}renderLayout(){return jr` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${qr()&&this.card.actionMenu?"always-visible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        @focus="${this.showActionMenuOnHover}"
                        @blur="${this.hideActionMenuOnBlur}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                    >${this.card.actionMenuLabel} - ${this.card.title}</div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
            ${this.card.actionMenuContent?"":"hidden"}"
                    >${this.card.actionMenuContent}
                </slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":jr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?jr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Xi}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseenter",this.showActionMenuOnHover),this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusin",this.showActionMenuOnHover),this.card.addEventListener("focusout",this.handleCardFocusOut),this.card.addEventListener("keydown",this.handleKeyDown)}disconnectedCallbackHook(){this.card.removeEventListener("mouseenter",this.showActionMenuOnHover),this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusin",this.showActionMenuOnHover),this.card.removeEventListener("focusout",this.handleCardFocusOut),this.card.removeEventListener("keydown",this.handleKeyDown)}};g($e,"variantStyle",jo`
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
    `);import{html as xt}from"../lit-all.min.js";var Qi=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${I} {
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
`;var Gt=class extends M{constructor(t){super(t)}getGlobalCSS(){return Qi}renderLayout(){return xt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?xt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:xt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?xt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:xt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Ji}from"../lit-all.min.js";var Zi=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${I} {
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

@media screen and ${re} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Vt=class extends M{constructor(t){super(t)}getGlobalCSS(){return Zi}renderLayout(){return Ji` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Ji`<hr />`} ${this.secureLabelFooter}`}};import{html as Ge,css as Wo,unsafeCSS as tn}from"../lit-all.min.js";var en=`
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

merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"].annual-price-new-line > span[is="inline-price"] > .price-annual, 
merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"].annual-price-new-line > span[is="inline-price"] > .price-annual-prefix::after, 
merch-card[variant="mini-compare-chart"].bullet-list [slot="heading-m-price"].annual-price-new-line > span[is="inline-price"] >.price-annual-suffix {
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
@media screen and ${G} {
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

@media screen and ${q} {
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
@media screen and ${I} {
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

@media screen and ${re} {
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
`;var Yo=32,Ve=class extends M{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Ge`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Ge`<slot name="secure-transaction-label"></slot>`;return Ge`<footer>${r}<slot name="footer"></slot></footer>`});this.updatePriceQuantity=this.updatePriceQuantity.bind(this)}connectedCallbackHook(){this.card.addEventListener(Ce,this.updatePriceQuantity)}disconnectedCallbackHook(){this.card.removeEventListener(Ce,this.updatePriceQuantity)}updatePriceQuantity({detail:r}){!this.mainPrice||!r?.option||(this.mainPrice.dataset.quantity=r.option)}getGlobalCSS(){return en}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer"),this.card.shadowRoot.querySelector(".mini-compare-chart-badge")?.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,n)=>{let a=Math.max(Yo,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${K}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,n=this.headingMPriceSlot;if(!i&&n){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=Pe("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=Pe("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,n=this.card.planType;if(i&&(await i.onceSettled(),n=i.value?.[0]?.planType),!n)return;r.planType=n,this.card.querySelector("merch-addon[plan-type]")?.updateComplete.then(()=>{this.updateCardElementMinHeight(this.card.shadowRoot.querySelector('slot[name="addon"]'),"addon")})}renderLayout(){return Ge` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Ge`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-xxs"></slot>
          <slot name="promo-text"></slot>
          <slot name="body-m"></slot>
          <slot name="offers"></slot>`:Ge`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>
          <slot name="body-xxs"></slot>
          <slot name="price-commitment"></slot>
          <slot name="offers"></slot>
          <slot name="promo-text"></slot>
          `}
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),k.isMobile?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(Ve,"variantStyle",Wo`
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

    @media screen and ${tn(q)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${tn(L)} {
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
  `);import{html as vt,css as Xo,nothing as qt}from"../lit-all.min.js";var rn=`
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
@media screen and ${G} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }

    merch-card[variant="plans-education"] .spacer {
        height: 0px;
    }
}

/* Tablet */
@media screen and ${I} {
    :root {
        --consonant-merch-card-plans-students-width: 486px;
    }

    .four-merch-cards.plans .foreground {
        max-width: unset;
    }
}

@media screen and ${q} {
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
        --consonant-merch-card-plans-students-width: 484px;
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
@media screen and ${re} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }

    merch-sidenav.plans {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var jt={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},nn={...function(){let{whatsIncluded:e,size:t,...r}=jt;return r}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},an={...function(){let{subtitle:e,whatsIncluded:t,size:r,quantitySelect:i,...n}=jt;return n}()},Z=class extends M{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===ht&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return rn}adjustSlotPlacement(t,r,i){let n=this.card.shadowRoot,a=n.querySelector("footer"),o=this.card.getAttribute("size");if(!o)return;let s=n.querySelector(`footer slot[name="${t}"]`),c=n.querySelector(`.body slot[name="${t}"]`),l=n.querySelector(".body");if(o.includes("wide")||(a?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(a?.classList.toggle("wide-footer",k.isDesktopOrUp),!i&&s){if(c)s.remove();else{let d=l.querySelector(`[data-placeholder-for="${t}"]`);d?d.replaceWith(s):l.appendChild(s)}return}if(i&&c){let d=document.createElement("div");if(d.setAttribute("data-placeholder-for",t),d.classList.add("slot-placeholder"),!s){let m=c.cloneNode(!0);a.prepend(m)}c.replaceWith(d)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],k.isDesktopOrUp),this.adjustSlotPlacement("callout-content",["super-wide"],k.isDesktopOrUp)}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let r=this.card.querySelector('[slot="body-xs"]');if(!r)return;let i=r.querySelector("ul");if(!i)return;let n=i.previousElementSibling,a=document.createElement("div");a.classList.add("spacer"),r.insertBefore(a,n);let o=new IntersectionObserver(([s])=>{if(s.boundingClientRect.height===0)return;let c=0,l=this.card.querySelector('[slot="heading-s"]');l&&(c+=ft(l));let d=this.card.querySelector('[slot="subtitle"]');d&&(c+=ft(d));let m=this.card.querySelector('[slot="heading-m"]');m&&(c+=8+ft(m));for(let p of r.childNodes){if(p.classList.contains("spacer"))break;c+=ft(p)}let h=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");c>(parseFloat(h)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${c}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${c}px`),o.disconnect()});o.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.legalAdjusted||(await this.adjustLegal(),await this.adjustEduLists())}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${K}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?vt`<div class="divider"></div>`:qt}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=[],r=this.card.querySelector(`[slot="heading-m"] ${K}[data-template="price"]`);r&&t.push(r);let i=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling),await a.onceSettled())});await Promise.all(i)}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?vt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:qt}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?qt:vt`<slot name="icons"></slot>`}connectedCallbackHook(){k.matchMobile.addEventListener("change",this.adaptForMedia),k.matchDesktopOrUp.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){k.matchMobile.removeEventListener("change",this.adaptForMedia),k.matchDesktopOrUp.removeEventListener("change",this.adaptForMedia)}renderLayout(){return vt` ${this.badge}
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
            <slot></slot>`}};g(Z,"variantStyle",Xo`
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
    `),g(Z,"collectionOptions",{customHeaderArea:t=>t.sidenav?vt`<slot name="resultsText"></slot>`:qt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]},onSidenavAttached:t=>{let r=()=>{let i=t.querySelectorAll("merch-card");for(let a of i)a.hasAttribute("data-size")&&(a.setAttribute("size",a.getAttribute("data-size")),a.removeAttribute("data-size"));if(!k.isDesktop)return;let n=0;for(let a of i){if(a.style.display==="none")continue;let o=a.getAttribute("size"),s=o==="wide"?2:o==="super-wide"?3:1;s===2&&n%3===2&&(a.setAttribute("data-size",o),a.removeAttribute("size"),s=1),n+=s}};k.matchDesktop.addEventListener("change",r),t.addEventListener(se,r),t.onUnmount.push(()=>{k.matchDesktop.removeEventListener("change",r),t.removeEventListener(se,r)})}});import{html as qe,css as Ko,unsafeCSS as sn,nothing as Wt}from"../lit-all.min.js";var on=`
:root {
    --consonant-merch-card-plans-v2-width: 385px;
    --consonant-merch-card-plans-v2-height: auto;
    --consonant-merch-card-plans-v2-icon-size: 35px;
    --consonant-merch-card-plans-v2-border-color: #DADADA;
    --consonant-merch-card-plans-v2-border-radius: 8px;
    --picker-up-icon-black: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"><path d="M14 10.99a1 1 0 0 1-1.706.706L9.005 8.41l-3.289 3.286a1 1 0 0 1-1.437-1.387l.025-.024L8.3 6.293a1 1 0 0 1 1.413 0l3.994 3.991a.995.995 0 0 1 .293.706z" fill="%23000000"/></svg>');
    --picker-down-icon-black: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="18" width="18"><path d="M4 7.01a1 1 0 0 1 1.706-.706L8.993 9.59l3.29-3.285A1 1 0 0 1 13.72 7.69l-.024.025L9.7 11.707a1 1 0 0 1-1.413 0L4.293 7.716A.995.995 0 0 1 4 7.01z" fill="%23000000"/></svg>');

}

merch-card[variant="plans-v2"] {
    width: var(--consonant-merch-card-plans-v2-width);
    height: var(--consonant-merch-card-plans-v2-height);
    border: 1px solid var(--consonant-merch-card-border-color, var(--consonant-merch-card-plans-v2-border-color));
    border-radius: var(--consonant-merch-card-plans-v2-border-radius);
    background-color: var(--spectrum-gray-50, #FFFFFF);
}

merch-card[variant="plans-v2"][size="wide"],
merch-card[variant="plans-v2"][size="super-wide"] {
    width: 100%;
    max-width: 768px;
}

merch-card[variant="plans-v2"] [slot="icons"] {
    --img-width: var(--consonant-merch-card-plans-v2-icon-size);
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] span.price-unit-type {
    display: inline;
}

merch-card[variant="plans-v2"] .price-unit-type:not(.disabled)::before {
    content: none;
}

merch-card[variant="plans-v2"] [slot="description"] {
    min-height: auto;
}

merch-card[variant="plans-v2"] [slot="description"] {
    min-height: auto;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] {
    margin-top: 0;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] merch-addon {
    --merch-addon-gap: 10px;
    --merch-addon-align: flex-start;
}

merch-card[variant="plans-v2"] merch-addon span[data-template="price"] {
    display: inline;
}

merch-card[variant="plans-v2"] span[data-template="legal"] {
    display: inline;
    color: var(--spectrum-gray-600, #6E6E6E);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 1.375;
}

merch-card[variant="plans-v2"] span.text-l {
    display: inline;
    font-size: inherit;
    line-height: inherit;
}

merch-card[variant="plans-v2"] [slot="callout-content"] {
    margin: 0;
}

merch-card[variant="plans-v2"] [slot='callout-content'] > div > div,
merch-card[variant="plans-v2"] [slot="callout-content"] > p {
    background: transparent;
    padding: 0;
}

merch-card[variant="plans-v2"] [slot="footer"] a {
    line-height: 1.2;
    padding: 9px 11px;
}

merch-card[variant="plans-v2"][border-color="spectrum-red-700-plans"] {
    border-color: var(--spectrum-red-700-plans);
}

merch-card[variant="plans-v2"] [slot="icons"] img {
    width: var(--consonant-merch-card-plans-v2-icon-size);
    height: var(--consonant-merch-card-plans-v2-icon-size);
}

merch-card[variant="plans-v2"] [slot="heading-xs"] {
    font-size: 28px;
    font-weight: 900;
    font-family: 'Adobe Clean Display', sans-serif;
    line-height: 30.8px;
    color: var(--spectrum-gray-800, #2C2C2C);
}

merch-card[variant="plans-v2"][size="wide"] [slot="subtitle"] {
    font-size: 52px;
    font-weight: 900;
    line-height: 57.2px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-wrapper {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] span.price {
    font-size: 22px;
    font-weight: 800;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--spectrum-gray-900, #1E1E1E);
    line-height: 1.2;
}

merch-card[variant="plans-v2"] [slot="heading-m"] span.price.price-strikethrough {
    font-size: 18px;
    font-weight: 400;
    color: #6B6B6B;
}

merch-card[variant="plans-v2"] span[is='inline-price'] {
    display: block;
}

merch-card[variant="plans-v2"] [slot="heading-m"]:has(span[is='inline-price'] + span[is='inline-price']) span[is='inline-price'] {
    display: inline;
    text-decoration: none;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-legal {
    font-size: 16px;
    font-weight: 400;
    color: var(--spectrum-gray-600, #6E6E6E);
    line-height: 1.375;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-recurrence,
merch-card[variant="plans-v2"] [slot="heading-m"] span[data-template="recurrence"] {
    text-transform: lowercase;
    color: #6B6B6B;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-plan-type,
merch-card[variant="plans-v2"] [slot="heading-m"] span[data-template="planType"] {
    display: block;
    text-transform: capitalize;
    color: #2C2C2C;
    font-size: 14px;
    font-weight: 400;
}

merch-card[variant="plans-v2"] [slot="promo-text"] {
    font-size: 16px;
    font-weight: 700;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--merch-color-green-promo, #05834E);
    line-height: 1.5;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="promo-text"] a {
    color: inherit;
    text-decoration: underline;
}

merch-card[variant="plans-v2"] [slot="body-xs"] {
    font-size: 18px;
    font-weight: 400;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--spectrum-gray-700, #4B4B4B);
    line-height: 25.2px;
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] {
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] label {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: var(--spectrum-gray-700, #4B4B4B);
    margin-bottom: 8px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] merch-quantity-select {
    width: 100%;
    --qs-input-height: 44px;
    --qs-button-width: 44px;
    --qs-font-size: 16px;
    --qs-border-color: #909090;
    --qs-border-width: 1px;
    --qs-background-color: #FFFFFF;
    --qs-label-font-size: 12px;
    --qs-label-color: #222;
    --radius: 8px;
    --picker-up-icon: var(--picker-up-icon-black);
    --picker-down-icon: var(--picker-down-icon-black);
    --picker-button-border-left: none;
}

merch-card[variant="plans-v2"] .picker-button {
    border-left: none;
}

merch-card[variant="plans-v2"] [slot="footer"] {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
}

merch-card[variant="plans-v2"] [slot="footer"] a {
    width: 100%;
    text-align: center;
    padding: 9px 11px;
    border-radius: 20px;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.2;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.blue {
    background-color: #3B63FB;
    color: #FFFFFF;
    border: 2px solid #3B63FB;
    border-radius: 20px;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.blue:hover {
    background-color: #0D66D0;
    border-color: #0D66D0;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.outline {
    background-color: transparent;
    color: #3B63FB;
    border: 2px solid #3B63FB;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.outline:hover {
    background-color: #F5F5F5;
}


merch-card[variant="plans-v2"] h4 {
    font-size: 16px;
    font-weight: 700;
    color: var(--spectrum-gray-800, #2C2C2C);
    margin: 0 0 16px 0;
}

merch-card[variant="plans-v2"] ul {
    padding: 0 0 0 20px;
    margin: 0;
}

merch-card[variant="plans-v2"] ul li {
    font-size: 16px;
    font-weight: 400;
    color: var(--spectrum-gray-700, #4B4B4B);
    line-height: 1.625;
    margin-bottom: 12px;
    position: relative;
    margin: 0;
    padding: 7px 0 8px 5px;
    list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -3 18 18" height="18px"><path fill="currentcolor" d="M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z"></path></svg>');

}

merch-card[variant="plans-v2"] .help-text {
    font-size: 12px;
    font-weight: 400;
    color: var(--spectrum-gray-600, #6E6E6E);
    line-height: 1.5;
    margin-top: 8px;
}

@media screen and ${I}, ${L}, ${re} {
    :root {
        --consonant-merch-card-plans-v2-width: 385px;
    }
}

@media screen and ${G}, ${q} {
    merch-card[variant="plans-v2"] {
        width: 100%;
        max-width: var(--consonant-merch-card-plans-v2-width);
    }
}

.collection-container.plans {
    --merch-card-collection-card-min-height: 273px;
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-v2-width);
    max-width: 100%;
}

merch-sidenav.plans-v2 {
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
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-v2-width);
}

merch-card-collection.plans merch-card {
    width: auto;
    height: 100%;
}

merch-card-collection.plans merch-card[variant="plans-v2"] {
    display: grid;
    grid-template-rows: auto 1fr auto;
}

merch-card-collection.plans merch-card[variant="plans-v2"] .body {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-rows: min-content;
    align-content: start;
}

merch-card-collection.plans merch-card[variant="plans-v2"] .heading-wrapper {
    min-height: 35px;
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] [slot="icons"] {
    height: 35px;
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] [slot="heading-xs"] {
    min-height: 31px;
    display: flex;
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] aem-fragment + [slot^="heading-"] {
    margin-top: calc(40px + var(--consonant-merch-spacing-xxs));
}

merch-card-collection:has([slot="subtitle"]) merch-card[variant="plans-v2"] {
    --merch-card-plans-v2-subtitle-display: block;
}

merch-card[variant="plans-v2"][size="wide"] {
    width: 100%;
    max-width: 768px;
}

merch-card[variant="plans-v2"] .price-divider {
    display: none;
}

merch-card[variant="plans-v2"][size="wide"] .price-divider {
    display: block;
    height: 1px;
    background-color: #E8E8E8;
    margin: 16px 0;
}

merch-card[variant="plans-v2"][size="wide"] .heading-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 0;
}

merch-card[variant="plans-v2"][size="wide"] .heading-wrapper [slot="icons"] {
    margin-bottom: 0;
}

merch-card[variant="plans-v2"][size="wide"] .heading-wrapper [slot="heading-xs"] {
    margin: 0;
}

merch-card[variant="plans-v2"][size="wide"] [slot="body-xs"] {
    margin-bottom: 0;
}

merch-card[variant="plans-v2"][size="wide"] [slot="heading-m"] {
    margin-top: 0;
}

merch-card[variant="plans-v2"][size="wide"] footer {
    align-items: flex-start;
}

merch-card[variant="plans-v2"][size="wide"] footer [slot="heading-m"] {
    order: -1;
    margin-bottom: 16px;
    align-self: flex-start;
}

/* Mobile */
@media screen and ${G} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

/* Tablet */
@media screen and ${I} {
    .four-merch-cards.plans-v2 .foreground {
        max-width: unset;
    }
}

/* Desktop */
@media screen and ${L} {
    :root {
        --consonant-merch-card-plans-v2-width: 385px;
    }

    merch-sidenav.plans-v2 {
        --merch-sidenav-collection-gap: 30px;
    }

    .columns .four-merch-cards.plans-v2 {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }

    .four-merch-cards.plans,
    .four-merch-cards.plans-v2 {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }

    merch-card-collection-header.plans {
        --merch-card-collection-header-columns: fit-content(100%);
        --merch-card-collection-header-areas: "custom";
    }

    .collection-container.plans:has(merch-sidenav) {
        width: fit-content;
        max-width: 100%;
        position: relative;
        left: 50%;
        transform: translateX(-50vw);
        justify-content: start;
        padding-inline: 30px;
    }
}

/* Large Desktop */
@media screen and ${re} {
    .four-merch-cards.plans,
    .four-merch-cards.plans-v2 {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-v2-width));
    }

    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }

    merch-sidenav.plans-v2 {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var cn={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},shortDescription:{tag:"p",slot:"short-description"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-red-700-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans","spectrum-red-700-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans","spectrum-red-700-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},we=class extends M{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this),this.toggleShortDescription=this.toggleShortDescription.bind(this),this.shortDescriptionExpanded=!1}priceOptionsProvider(t,r){t.dataset.template===ht&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return on}adjustSlotPlacement(t,r,i){let{shadowRoot:n}=this.card,a=n.querySelector("footer"),o=n.querySelector(".body"),s=this.card.getAttribute("size");if(!s)return;let c=n.querySelector(`footer slot[name="${t}"]`),l=n.querySelector(`.body slot[name="${t}"]`);if(s.includes("wide")||(a?.classList.remove("wide-footer"),c?.remove()),!!r.includes(s)){if(a?.classList.toggle("wide-footer",k.isDesktopOrUp),!i&&c){if(l)c.remove();else{let d=o.querySelector(`[data-placeholder-for="${t}"]`);d?d.replaceWith(c):o.appendChild(c)}return}if(i&&l){let d=document.createElement("div");d.setAttribute("data-placeholder-for",t),d.classList.add("slot-placeholder"),c||a.prepend(l.cloneNode(!0)),l.replaceWith(d)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards,.columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("heading-m",["wide"],!0),this.adjustSlotPlacement("addon",["super-wide"],k.isDesktopOrUp),this.adjustSlotPlacement("callout-content",["super-wide"],k.isDesktopOrUp)}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');if(!t?.title)return;t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip");let r=i=>{i===t?t.classList.toggle("hide-tooltip"):t.classList.add("hide-tooltip")};document.addEventListener("touchstart",i=>{i.preventDefault(),r(i.target)}),document.addEventListener("mouseover",i=>{i.preventDefault(),i.target!==t?t.classList.add("hide-tooltip"):t.classList.remove("hide-tooltip")})}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.updateShortDescriptionVisibility(),this.legalAdjusted||await this.adjustLegal()}get mainPrice(){return this.card.querySelector(`[slot="heading-m"] ${K}[data-template="price"]`)}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=this.mainPrice;if(!t)return;let r=t.cloneNode(!0);if(await t.onceSettled(),!t?.options)return;t.options.displayPerUnit&&(t.dataset.displayPerUnit="false"),t.options.displayTax&&(t.dataset.displayTax="false"),t.options.displayPlanType&&(t.dataset.displayPlanType="false"),r.setAttribute("data-template","legal"),t.parentNode.insertBefore(r,t.nextSibling),await r.onceSettled()}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?qe`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Wt}get hasShortDescription(){return!!this.card.querySelector('[slot="short-description"]')}get shortDescriptionLabel(){let t=this.card.querySelector('[slot="short-description"]'),r=t.querySelector("strong, b");if(r?.textContent?.trim())return r.textContent.trim();let i=t.querySelector("h1, h2, h3, h4, h5, h6, p");return i?.textContent?.trim()?i.textContent.trim():t.textContent?.trim().split(`
`)[0].trim()}updateShortDescriptionVisibility(){let t=this.card.querySelector('[slot="short-description"]');if(!t)return;let r=t.querySelector("strong, b, p");r&&(k.isDesktopOrUp?r.style.display="":r.style.display="none")}toggleShortDescription(){this.shortDescriptionExpanded=!this.shortDescriptionExpanded,this.card.requestUpdate()}get shortDescriptionToggle(){return this.hasShortDescription?k.isDesktopOrUp?qe`
                <div class="short-description-divider"></div>
                <div class="short-description-content desktop">
                    <slot name="short-description"></slot>
                </div>
            `:qe`
            <div class="short-description-divider"></div>
            <div class="short-description-toggle" @click=${this.toggleShortDescription}>
                <span class="toggle-label">${this.shortDescriptionLabel}</span>
                <span class="toggle-icon ${this.shortDescriptionExpanded?"expanded":""}"></span>
            </div>
            <div class="short-description-content ${this.shortDescriptionExpanded?"expanded":""}">
                <slot name="short-description"></slot>
            </div>
        `:Wt}get icons(){return this.card.querySelector('[slot="icons"]')||this.card.getAttribute("id")?qe`<slot name="icons"></slot>`:Wt}connectedCallbackHook(){this.handleMediaChange=()=>{this.adaptForMedia(),this.updateShortDescriptionVisibility(),this.card.requestUpdate()},k.matchMobile.addEventListener("change",this.handleMediaChange),k.matchDesktopOrUp.addEventListener("change",this.handleMediaChange)}disconnectedCallbackHook(){k.matchMobile.removeEventListener("change",this.handleMediaChange),k.matchDesktopOrUp.removeEventListener("change",this.handleMediaChange)}renderLayout(){return qe` ${this.badge}
            <div class="body">
                <div class="heading-wrapper">
                    ${this.icons}
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="heading-m"></slot>
                <slot name="subtitle"></slot>
                <slot name="body-xs"></slot>
                <div class="price-divider"></div>
                <slot name="annualPrice"></slot>
                <slot name="priceLabel"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="whats-included"></slot>
                <slot name="callout-content"></slot>
                <slot name="quantity-select"></slot>
                ${this.stockCheckbox}
                <slot name="addon"></slot>
                <slot name="badge"></slot>
            </div>
            ${this.secureLabelFooter}
            ${this.shortDescriptionToggle}
            <slot></slot>`}};g(we,"variantStyle",Ko`
        :host([variant='plans-v2']) {
            display: flex;
            flex-direction: column;
            min-height: 273px;
            width: 321px;
            position: relative;
            background-color: var(--spectrum-gray-50, #FFFFFF);
            border-radius: var(--consonant-merch-card-plans-v2-border-radius, 8px);
            overflow: hidden;
            font-weight: 400;
            --merch-card-plans-v2-min-width: 244px;
            --merch-card-plans-v2-padding: 26px 32px;
            --merch-card-plans-v2-subtitle-display: contents;
            --merch-card-plans-v2-heading-min-height: 23px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
        }

        :host([variant='plans-v2']) .slot-placeholder {
            display: none;
        }

        :host([variant='plans-v2']) .body {
            display: flex;
            flex-direction: column;
            min-width: var(--merch-card-plans-v2-min-width);
            padding: var(--merch-card-plans-v2-padding);
            padding-bottom: 0;
            flex-grow: 1;
        }

        :host([variant='plans-v2'][size]) .body {
            max-width: none;
        }

        :host([variant='plans-v2']) footer {
            padding: var(--merch-card-plans-v2-padding);
            padding-top: 1px;
            justify-content: flex-start;
        }

        :host([variant='plans-v2']) slot[name="subtitle"] {
            display: var(--merch-card-plans-v2-subtitle-display);
            min-height: 18px;
            margin-top: 8px;
            margin-bottom: -8px;
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-xs']) {
            font-size: 32px;
            font-weight: 900;
            font-family: 'Adobe Clean Display', sans-serif;
            line-height: 1.2;
            color: var(--spectrum-gray-800, #2C2C2C);
            margin: 0 0 16px 0;
            min-height: var(--merch-card-plans-v2-heading-min-height);
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }

        :host([variant='plans-v2']) slot[name='icons'] {
            gap: 3px;
            mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.6) 37.5%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 62.5%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.03) 87.5%, rgba(0, 0, 0, 0) 100%);
            -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.6) 37.5%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 62.5%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.03) 87.5%, rgba(0, 0, 0, 0) 100%);
        }

        :host([variant='plans-v2']) ::slotted([slot='icons']) {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-m']) {
            margin: 0 0 8px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='promo-text']) {
            font-size: 16px;
            font-weight: 700;
            color: var(--merch-color-green-promo, #05834E);
            line-height: 1.5;
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='body-xs']) {
            font-size: 18px;
            font-weight: 400;
            color: var(--spectrum-gray-700, #4B4B4B);
            line-height: 1.5;
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='quantity-select']) {
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='whats-included']) {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid #E8E8E8;
        }

        :host([variant='plans-v2']) ::slotted([slot='addon']) {
            margin-top: auto;
            padding-top: 8px;
        }

        :host([variant='plans-v2']) footer ::slotted([slot='addon']) {
            margin: 0;
            padding: 0;
        }

        :host([variant='plans-v2']) .wide-footer #stock-checkbox {
            margin-top: 0;
        }

        :host([variant='plans-v2']) #stock-checkbox {
            margin-top: 8px;
            gap: 9px;
            color: rgb(34, 34, 34);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
            padding-top: 4px;
            padding-bottom: 5px;
        }

        :host([variant='plans-v2']) #stock-checkbox > span {
            border: 2px solid rgb(109, 109, 109);
            width: 12px;
            height: 12px;
        }

        :host([variant='plans-v2']) .secure-transaction-label {
            color: rgb(80, 80, 80);
            line-height: var(--consonant-merch-card-detail-xs-line-height);
        }

        :host([variant='plans-v2']) footer ::slotted(a) {
            display: block;
            width: 100%;
            text-align: center;
            margin-bottom: 12px;
        }

        :host([variant='plans-v2']) footer ::slotted(a:last-child) {
            margin-bottom: 0;
        }

        :host([variant='plans-v2']) .short-description-divider {
            height: 1px;
            background-color: #E8E8E8;
            margin: 0;
        }

        :host([variant='plans-v2']) .short-description-toggle {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            padding: 16px 32px;
            cursor: pointer;
            background-color: var(--spectrum-gray-50, #FFFFFF);
            transition: background-color 0.2s ease;
        }

        :host([variant='plans-v2']) .short-description-toggle:hover {
            background-color: var(--spectrum-gray-75, #F8F8F8);
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-label {
            font-size: 16px;
            font-weight: 700;
            color: var(--spectrum-gray-800, #2C2C2C);
            text-align: left;
            flex: 1;
            line-height: 1.5;
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            background-image: url('data:image/svg+xml,<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="%23F8F8F8"/><path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="%23292929"/><path d="M18.5484 12.9484H15.0484V9.44844C15.0484 8.86875 14.5781 8.39844 13.9984 8.39844C13.4188 8.39844 12.9484 8.86875 12.9484 9.44844V12.9484H9.44844C8.86875 12.9484 8.39844 13.4188 8.39844 13.9984C8.39844 14.5781 8.86875 15.0484 9.44844 15.0484H12.9484V18.5484C12.9484 19.1281 13.4188 19.5984 13.9984 19.5984C14.5781 19.5984 15.0484 19.1281 15.0484 18.5484V15.0484H18.5484C19.1281 15.0484 19.5984 14.5781 19.5984 13.9984C19.5984 13.4188 19.1281 12.9484 18.5484 12.9484Z" fill="%23292929"/></svg>');
            background-size: 28px 28px;
            background-position: center;
            background-repeat: no-repeat;
            transition: background-image 0.3s ease;
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-icon.expanded {
            background-image: url('data:image/svg+xml,<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="%23292929"/><path d="M14 26C7.38258 26 2 20.6174 2 14C2 7.38258 7.38258 2 14 2C20.6174 2 26 7.38258 26 14C26 20.6174 20.6174 26 14 26ZM14 4.05714C8.51696 4.05714 4.05714 8.51696 4.05714 14C4.05714 19.483 8.51696 23.9429 14 23.9429C19.483 23.9429 23.9429 19.483 23.9429 14C23.9429 8.51696 19.483 4.05714 14 4.05714Z" fill="%23292929"/><path d="M9 14L19 14" stroke="%23F8F8F8" stroke-width="2" stroke-linecap="round"/></svg>');
        }

        :host([variant='plans-v2']) .short-description-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease;
            padding: 0 32px;
        }

        :host([variant='plans-v2']) .short-description-content.expanded {
            max-height: 500px;
            padding: 24px 32px;
        }

        :host([variant='plans-v2']) .short-description-content.desktop {
            max-height: none;
            overflow: visible;
            padding: 24px 32px;
            transition: none;
        }

        :host([variant='plans-v2']) .short-description-content ::slotted([slot='short-description']) {
            font-size: 16px;
            font-weight: 400;
            color: var(--spectrum-gray-700, #4B4B4B);
            line-height: 1.5;
            margin: 0;
        }

        :host([variant='plans-v2'][border-color='spectrum-yellow-300-plans']) {
            border-color: #FFD947;
        }

        :host([variant='plans-v2'][border-color='spectrum-gray-300-plans']) {
            border-color: #DADADA;
        }

        :host([variant='plans-v2'][border-color='spectrum-green-900-plans']) {
            border-color: #05834E;
        }

        :host([variant='plans-v2'][border-color='spectrum-red-700-plans']) {
            border-color: #EB1000;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-yellow-300-plans),
        :host([variant='plans-v2']) #badge.spectrum-yellow-300-plans {
            background-color: #FFD947;
            color: #2C2C2C;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-gray-300-plans),
        :host([variant='plans-v2']) #badge.spectrum-gray-300-plans {
            background-color: #DADADA;
            color: #2C2C2C;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-gray-700-plans),
        :host([variant='plans-v2']) #badge.spectrum-gray-700-plans {
            background-color: #4B4B4B;
            color: #FFFFFF;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-green-900-plans),
        :host([variant='plans-v2']) #badge.spectrum-green-900-plans {
            background-color: #05834E;
            color: #FFFFFF;
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-red-700-plans),
        :host([variant='plans-v2']) #badge.spectrum-red-700-plans {
            background-color: #EB1000;
            color: #FFFFFF;
        }

        :host([variant='plans-v2']) .price-divider {
            display: none;
        }

        :host([variant='plans-v2']) .heading-wrapper {
            display: flex;
            flex-direction: column;
        }

        :host([variant='plans-v2'][size='wide']) {
            width: 100%;
            max-width: 768px;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper {
            flex-direction: row;
            align-items: center;
            gap: 12px;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper slot[name='icons'] {
            margin-bottom: 0;
            mask-image: none;
            -webkit-mask-image: none;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper ::slotted([slot='icons']) {
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper ::slotted([slot='heading-xs']) {
            margin: 0;
        }

        :host([variant='plans-v2'][size='wide']) .price-divider {
            display: block;
            height: 1px;
            background-color: #E8E8E8;
            margin: 16px 0;
        }

        :host([variant='plans-v2'][size='wide']) ::slotted([slot='body-xs']) {
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) ::slotted([slot='heading-m']) {
            margin-top: 0;
        }

        :host([variant='plans-v2'][size='wide']) footer {
            justify-content: flex-start;
            flex-direction: column;
            align-items: flex-start;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted([slot='heading-m']) {
            order: -1;
            margin-bottom: 16px;
            align-self: flex-start;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted(a) {
            width: auto;
            min-width: 150px;
            margin-right: 12px;
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) footer ::slotted(a:last-child) {
            margin-right: 0;
        }

        @media screen and ${sn(G)}, ${sn(q)} {
            :host([variant='plans-v2']) {
                --merch-card-plans-v2-padding: 26px 16px;
            }

            :host([variant='plans-v2']) .short-description-toggle {
                padding: 16px;
            }

            :host([variant='plans-v2']) .short-description-content {
                padding: 0 16px;
            }

            :host([variant='plans-v2']) .short-description-content.expanded {
                padding: 24px 16px;
            }
        }
    `),g(we,"collectionOptions",{customHeaderArea:t=>t.sidenav?qe`<slot name="resultsText"></slot>`:Wt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]},onSidenavAttached:t=>{let r=()=>{let i=t.querySelectorAll("merch-card");if(i.forEach(a=>{a.hasAttribute("data-size")&&(a.setAttribute("size",a.getAttribute("data-size")),a.removeAttribute("data-size"))}),!k.isDesktop)return;let n=0;i.forEach(a=>{if(a.style.display==="none")return;let o=a.getAttribute("size"),s=o==="wide"?2:o==="super-wide"?3:1;s===2&&n%3===2&&(a.setAttribute("data-size",o),a.removeAttribute("size"),s=1),n+=s})};k.matchDesktop.addEventListener("change",r),t.addEventListener(se,r),t.onUnmount.push(()=>{k.matchDesktop.removeEventListener("change",r),t.removeEventListener(se,r)})}});import{html as Wr,css as Qo}from"../lit-all.min.js";var ln=`
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
@media screen and ${I} {
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
`;var je=class extends M{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this),this.updatePriceQuantity=this.updatePriceQuantity.bind(this)}getGlobalCSS(){return ln}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Wr` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Wr`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Wr`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook),this.card.addEventListener(Ce,this.updatePriceQuantity)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook),this.card.removeEventListener(Ce,this.updatePriceQuantity)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),k.isMobile||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${K}[data-template="price"]`)}updatePriceQuantity({detail:t}){!this.mainPrice||!t?.option||(this.mainPrice.dataset.quantity=t.option)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=Pe("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=Pe("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g(je,"variantStyle",Qo`
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
    `);import{html as Yr,css as Zo}from"../lit-all.min.js";var dn=`
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
@media screen and ${G} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${I} {
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
`;var We=class extends M{constructor(t){super(t)}getGlobalCSS(){return dn}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Yr` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Yr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Yr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g(We,"variantStyle",Zo`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Xr,css as Jo}from"../lit-all.min.js";var pn=`
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

@media screen and ${G} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${I} {
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

@media screen and ${re} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var hn={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Ye=class extends M{constructor(t){super(t)}getGlobalCSS(){return pn}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Xr`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Xr`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Xr`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Ye,"variantStyle",Jo`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as es,css as ts}from"../lit-all.min.js";var mn=`
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
@media screen and ${G} {
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
@media screen and ${q} {
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
@media screen and ${I} and ${q} {
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
`;var Kr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"XL"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:["badgeColor","badgeBorderColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},Xe=class extends M{getGlobalCSS(){return mn}get aemFragmentMapping(){return Kr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="body-xs"]');t&&this.updateCardElementMinHeight(t,"description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,this.card.prices?.length&&await Promise.all(this.card.prices.map(t=>t.onceSettled?.())),st())){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-description-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(a=>a.variantLayout?.syncHeights?.())})}}connectedCallbackHook(){!this.card||this.card.failed||(this.setupAccordion(),this.card?.hasAttribute("data-default-card")&&!st()&&this.card.setAttribute("data-expanded","true"))}setupAccordion(){let t=this.card;if(!t)return;let r=()=>{if(st())t.removeAttribute("data-expanded");else{let n=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",n?"true":"false")}};r();let i=window.matchMedia(q);this.mediaQueryListener=()=>{r()},i.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia(q).removeEventListener("change",this.mediaQueryListener)}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||st())return;let a=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",a)}renderLayout(){return es`
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
        `}};g(Xe,"variantStyle",ts`
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
    `);import{html as rs,css as is}from"../lit-all.min.js";var un=`
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
`;var Qr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-s",maxCount:2e3,withSuffix:!1},shortDescription:{tag:"div",slot:"short-description",maxCount:3e3,withSuffix:!1},prices:{tag:"div",slot:"price"},trialBadge:{tag:"div",slot:"trial-badge"},ctas:{slot:"cta",size:"XL"},mnemonics:{size:"l"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:[]},Ke=class extends M{getGlobalCSS(){return un}get aemFragmentMapping(){return Qr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width<=2)return;let t=this.card.querySelector('[slot="short-description"]');t&&this.updateCardElementMinHeight(t,"short-description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price");let i=this.card.querySelector('[slot="cta"]');i&&this.updateCardElementMinHeight(i,"cta")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,await Promise.all(this.card.prices.map(t=>t.onceSettled())),window.matchMedia("(min-width: 1025px)").matches)){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-price-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(a=>a.variantLayout?.syncHeights?.())})}}renderLayout(){return rs`
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
        `}};g(Ke,"variantStyle",is`
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
    `);import{css as ns,html as as}from"../lit-all.min.js";var fn=`
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
`;var gn={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},Qe=class extends M{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return fn}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,i){i.literals={...i.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},i.space=!0,i.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${K}[data-template="price"]`);if(!r)return;let i=r.cloneNode(!0);this.legal=i,r.dataset.displayTax="false",i.dataset.template="legal",i.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,i.setAttribute("slot","legal"),this.card.appendChild(i)}renderLayout(){return as`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(Qe,"variantStyle",ns`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
        }
    `);var xn=new Map,J=(e,t,r=null,i=null,n)=>{xn.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:n})};J("catalog",$e,Ki,$e.variantStyle);J("image",Gt);J("inline-heading",Vt);J("mini-compare-chart",Ve,null,Ve.variantStyle);J("plans",Z,jt,Z.variantStyle,Z.collectionOptions);J("plans-students",Z,an,Z.variantStyle,Z.collectionOptions);J("plans-education",Z,nn,Z.variantStyle,Z.collectionOptions);J("plans-v2",we,cn,we.variantStyle,we.collectionOptions);J("product",je,null,je.variantStyle);J("segment",We,null,We.variantStyle);J("special-offers",Ye,hn,Ye.variantStyle);J("simplified-pricing-express",Xe,Kr,Xe.variantStyle);J("full-pricing-express",Ke,Qr,Ke.variantStyle);J("mini",Qe,gn,Qe.variantStyle);function $t(e){return xn.get(e)?.fragmentMapping}var vn="tacocat.js";var Zr=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),bn=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function D(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=Ze(i)?i:e;a=o.get(s)}if(n&&a==null){let o=Ze(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=ss(Ze(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var os=e=>typeof e=="boolean",Yt=e=>typeof e=="function",Xt=e=>typeof e=="number",yn=e=>e!=null&&typeof e=="object";var Ze=e=>typeof e=="string",En=e=>Ze(e)&&e,bt=e=>Xt(e)&&Number.isFinite(e)&&e>0;function Kt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function E(e,t){if(os(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function yt(e,t,r){let i=Object.values(t);return i.find(n=>Zr(n,e))??r??i[0]}function ss(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function wn(e,t=1){return Xt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var cs=Date.now(),Jr=()=>`(+${Date.now()-cs}ms)`,Qt=new Set,ls=E(D("tacocat.debug",{},{metadata:!1}),!1);function An(e){let t=`[${vn}/${e}]`,r=(o,s,...c)=>o?!0:(n(s,...c),!1),i=ls?(o,...s)=>{console.debug(`${t} ${o}`,...s,Jr())}:()=>{},n=(o,...s)=>{let c=`${t} ${o}`;Qt.forEach(([l])=>l(c,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let c=`${t} ${o}`;Qt.forEach(([,l])=>l(c,...s))}}}function ds(e,t){let r=[e,t];return Qt.add(r),()=>{Qt.delete(r)}}ds((e,...t)=>{console.error(e,...t,Jr())},(e,...t)=>{console.warn(e,...t,Jr())});var ps="no promo",Sn="promo-tag",hs="yellow",ms="neutral",us=(e,t,r)=>{let i=a=>a||ps,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},fs="cancel-context",Zt=(e,t)=>{let r=e===fs,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?Sn:`${Sn} no-promo`,text:us(o,t,n),variant:a?hs:ms,isOverriden:n}};var ei;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(ei||(ei={}));var ie;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(ie||(ie={}));var ae;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(ae||(ae={}));var ti;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(ti||(ti={}));var ri;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(ri||(ri={}));var ii;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(ii||(ii={}));var ni;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(ni||(ni={}));var ai="ABM",oi="PUF",si="M2M",ci="PERPETUAL",li="P3Y",gs="TAX_INCLUSIVE_DETAILS",xs="TAX_EXCLUSIVE",Tn={ABM:ai,PUF:oi,M2M:si,PERPETUAL:ci,P3Y:li},_p={[ai]:{commitment:ie.YEAR,term:ae.MONTHLY},[oi]:{commitment:ie.YEAR,term:ae.ANNUAL},[si]:{commitment:ie.MONTH,term:ae.MONTHLY},[ci]:{commitment:ie.PERPETUAL,term:void 0},[li]:{commitment:ie.THREE_MONTHS,term:ae.P3Y}},_n="Value is not an offer",Jt=e=>{if(typeof e!="object")return _n;let{commitment:t,term:r}=e,i=vs(t,r);return{...e,planType:i}};var vs=(e,t)=>{switch(e){case void 0:return _n;case"":return"";case ie.YEAR:return t===ae.MONTHLY?ai:t===ae.ANNUAL?oi:"";case ie.MONTH:return t===ae.MONTHLY?si:"";case ie.PERPETUAL:return ci;case ie.TERM_LICENSE:return t===ae.P3Y?li:"";default:return""}};function Cn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==gs)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:xs}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var bs="mas-commerce-service",ys={requestId:pt,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Et(e,{country:t,forceTaxExclusive:r}){let i;if(e.length<2)i=e;else{let n=t==="GB"?"EN":"MULT";e.sort((a,o)=>a.language===n?-1:o.language===n?1:0),e.sort((a,o)=>!a.term&&o.term?-1:a.term&&!o.term?1:0),i=[e[0]]}return r&&(i=i.map(Cn)),i}var er=e=>window.setTimeout(e);function Je(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(wn).filter(bt);return r.length||(r=[t]),r}function tr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(En)}function ee(){return document.getElementsByTagName(bs)?.[0]}function Ln(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,n]of Object.entries(ys)){let a=r.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[i]=a)}return t}var ke={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Pn=1e3;function Es(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function kn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ke.serializableTypes.includes(r))return r}return e}function ws(e,t){if(!ke.ignoredProperties.includes(e))return kn(t)}var di={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(l=>{l!=null&&(Es(l)?i:n).push(l)}),i.length&&(a+=" "+i.map(kn).join(" "));let{pathname:o,search:s}=window.location,c=`${ke.delimiter}page=${o}${s}`;c.length>Pn&&(c=`${c.slice(0,Pn)}<trunc>`),a+=c,n.length&&(a+=`${ke.delimiter}facts=`,a+=JSON.stringify(n,ws)),window.lana?.log(a,ke)}};function rr(e){Object.assign(ke,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ke&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Mn={LOCAL:"local",PROD:"prod",STAGE:"stage"},pi={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},hi=new Set,mi=new Set,Rn=new Map,Nn={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},On={filter:({level:e})=>e!==pi.DEBUG},As={filter:()=>!1};function Ss(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&Yt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:performance.now().toFixed(3)}}function Ts(e){[...mi].every(t=>t(e))&&hi.forEach(t=>t(e))}function In(e){let t=(Rn.get(e)??0)+1;Rn.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>In(`${i.namespace}/${n}`),updateConfig:rr};return Object.values(pi).forEach(n=>{i[n]=(a,...o)=>Ts(Ss(n,a,e,o,r))}),Object.seal(i)}function ir(...e){e.forEach(t=>{let{append:r,filter:i}=t;Yt(i)&&mi.add(i),Yt(r)&&hi.add(r)})}function _s(e={}){let{name:t}=e,r=E(D("commerce.debug",{search:!0,storage:!0}),t===Mn.LOCAL);return ir(r?Nn:On),t===Mn.PROD&&ir(di),oe}function Cs(){hi.clear(),mi.clear()}var oe={...In(Ir),Level:pi,Plugins:{consoleAppender:Nn,debugFilter:On,quietFilter:As,lanaAppender:di},init:_s,reset:Cs,use:ir};var et=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let n=r.response.headers?.get(pt);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,n])=>`${i}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var Ls={[ce]:Lr,[ye]:Pr,[me]:kr},Ps={[ce]:Nr,[me]:Or},wt,Ae=class{constructor(t){$(this,wt);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",ye);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=oe.module("mas-element")}update(){[ce,ye,me].forEach(t=>{this.wrapperElement.classList.toggle(Ls[t],t===this.state)})}notify(){(this.state===me||this.state===ce)&&(this.state===me?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===ce&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof et&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Ps[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){V(this,wt,ee()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return me===i?Promise.resolve(this.wrapperElement):ce===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=me,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),er(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=ce,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...A(this,wt)?.duration}),er(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=ye,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!ee()||this.timer)return;let{error:r,options:i,state:n,value:a,version:o}=this;this.state=ye,this.timer=er(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===ye&&this.version===o&&(this.state=n,this.error=r,this.value=a,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,i)}})}};wt=new WeakMap;function Dn(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function nr(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,Dn(t)),n}function Hn(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Dn(t)),e):null}function ks(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Ne,Me=class Me extends HTMLAnchorElement{constructor(){super();g(this,"masElement",new Ae(this));$(this,Ne);this.setAttribute("is",Me.is)}get isUptLink(){return!0}initializeWcsData(r,i){this.setAttribute("data-wcs-osi",r),i&&this.setAttribute("data-promotion-code",i)}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),V(this,Ne,ut()),A(this,Ne)&&(this.log=A(this,Ne).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),V(this,Ne,void 0)}requestUpdate(r=!1){this.masElement.requestUpdate(r)}onceSettled(){return this.masElement.onceSettled()}async render(){let r=ut();if(!r)return!1;this.dataset.imsCountry||r.imsCountryPromise.then(o=>{o&&(this.dataset.imsCountry=o)});let i=r.collectCheckoutOptions({},this);if(!i.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(i),a=r.resolveOfferSelectors(i);try{let[[o]]=await Promise.all(a),{country:s,language:c,env:l}=i,d=`locale=${c}_${s}&country=${s}&offer_id=${o.offerId}`,m=this.getAttribute("data-promotion-code");m&&(d+=`&promotion_code=${encodeURIComponent(m)}`),this.href=`${ks(l)}?${d}`,this.masElement.toggleResolved(n,o,i)}catch(o){let s=new Error(`Could not resolve offer selectors for id: ${i.wcsOsi}.`,o.message);return this.masElement.toggleFailed(n,s,i),!1}}static createFrom(r){let i=new Me;for(let n of r.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?i.setAttribute("class",n.value.replace("upt-link","").trim()):i.setAttribute(n.name,n.value));return i.innerHTML=r.innerHTML,i.setAttribute("tabindex",0),i}};Ne=new WeakMap,g(Me,"is","upt-link"),g(Me,"tag","a"),g(Me,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var Re=Me;window.customElements.get(Re.is)||window.customElements.define(Re.is,Re,{extends:Re.tag});function Bn(e){return e&&(e.startsWith("plans")?"plans":e)}var Ms=/[0-9\-+#]/,Rs=/[^\d\-+#]/g;function Un(e){return e.search(Ms)}function Ns(e="#.##"){let t={},r=e.length,i=Un(e);t.prefix=i>0?e.substring(0,i):"";let n=Un(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Rs);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Os(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,Is(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function Is(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let c=0;c<o;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ds(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=Ns(e),n=Os(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var Fn=Ds;var zn=".",Hs=",",Gn=/^\s+/,Vn=/\s+$/,$n="&nbsp;",ui=e=>e*12,Ie=(e,t,r=1)=>{if(!e)return!1;let{start:i,end:n,displaySummary:{amount:a,duration:o,minProductQuantity:s=1,outcomeType:c}={}}=e;if(!(a&&o&&c)||r<s)return!1;let l=t?new Date(t):new Date;if(!i||!n)return!1;let d=new Date(i),m=new Date(n);return l>=d&&l<=m},Oe={MONTH:"MONTH",YEAR:"YEAR"},Bs={[ne.ANNUAL]:12,[ne.MONTHLY]:1,[ne.THREE_YEARS]:36,[ne.TWO_YEARS]:24},fi=(e,t)=>({accept:e,round:t}),Us=[fi(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),fi(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),fi(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],gi={[_e.YEAR]:{[ne.MONTHLY]:Oe.MONTH,[ne.ANNUAL]:Oe.YEAR},[_e.MONTH]:{[ne.MONTHLY]:Oe.MONTH}},Fs=(e,t)=>e.indexOf(`'${t}'`)===0,zs=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=jn(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Gs(e)),r},$s=e=>{let t=Vs(e),r=Fs(e,t),i=e.replace(/'.*?'/,""),n=Gn.test(i)||Vn.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},qn=e=>e.replace(Gn,$n).replace(Vn,$n),Gs=e=>e.match(/#(.?)#/)?.[1]===zn?Hs:zn,Vs=e=>e.match(/'(.*?)'/)?.[1]??"",jn=e=>e.match(/0(.?)0/)?.[1]??"";function tt({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:c}=$s(e),l=r?jn(e):"",d=zs(e,r),m=r?2:0,h=a(t,{currencySymbol:o}),p=i?h.toLocaleString("hi-IN",{minimumFractionDigits:m,maximumFractionDigits:m}):Fn(d,h),u=r?p.lastIndexOf(l):p.length,f=p.substring(0,u),x=p.substring(u+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,p).replace(/SYMBOL/,o),currencySymbol:o,decimals:x,decimalsDelimiter:l,hasCurrencySpace:c,integer:f,isCurrencyFirst:s,recurrenceTerm:n}}var Wn=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=Bs[r]??1;return tt(e,n>1?Oe.MONTH:gi[t]?.[r],a=>{let o={divisor:n,price:a,usePrecision:i},{round:s}=Us.find(({accept:c})=>c(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},Yn=({commitment:e,term:t,...r})=>tt(r,gi[e]?.[t]),Xn=e=>{let{commitment:t,instant:r,price:i,originalPrice:n,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:c}=e;if(t===_e.YEAR&&c===ne.MONTHLY){if(!o)return tt(e,Oe.YEAR,ui);let{displaySummary:{outcomeType:l,duration:d}={}}=o;switch(l){case"PERCENTAGE_DISCOUNT":if(Ie(o,r,s)){let m=parseInt(d.replace("P","").replace("M",""));if(isNaN(m))return ui(i);let h=n*m,p=a*(12-m),u=Math.round((h+p)*100)/100;return tt({...e,price:u},Oe.YEAR)}default:return tt(e,Oe.YEAR,()=>ui(a??i))}}return tt(e,gi[t]?.[c])};var Kn="download",Qn="upgrade",Zn={e:"EDU",t:"TEAM"};function Jn(e,t={},r=""){let i=ee();if(!i)return null;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:m,quantity:h,wcsOsi:p,extraOptions:u,analyticsId:f}=i.collectCheckoutOptions(t),x=nr(e,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:m,quantity:h,wcsOsi:p,extraOptions:u,analyticsId:f});return r&&(x.innerHTML=`<span style="pointer-events: none;">${r}</span>`),x}function ea(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Ae(this))}attributeChangedCallback(i,n,a){this.masElement.attributeChangedCallback(i,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return Zn[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return Zn[i]??i}get is3in1Modal(){return Object.values(Le).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let n=ee();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(p=>{p&&(this.dataset.imsCountry=p)}),i.imsCountry=null;let a=n.collectCheckoutOptions(i,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(p){this.masElement.log?.error("cannot parse exta checkout options",p)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let c=n.resolveOfferSelectors(a),l=await Promise.all(c);l=l.map(p=>Et(p,a));let d=l.flat().find(p=>p.promotion);!Ie(d?.promotion,d?.promotion?.displaySummary?.instant,a.quantity[0])&&a.promotionCode&&delete a.promotionCode,a.country=this.dataset.imsCountry||a.country;let h=await n.buildCheckoutAction?.(l.flat(),{...o,...a},this);return this.renderOffers(l.flat(),a,{},h,s)}renderOffers(i,n,a={},o=void 0,s=void 0){let c=ee();if(!c)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"{}"),...n,...a},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(Kn,Qn),this.masElement.toggleResolved(s,i,n);let{url:d,text:m,className:h,handler:p}=o;d&&this.setCheckoutUrl(d),m&&(this.firstElementChild.innerHTML=m),h&&this.classList.add(...h.split(" ")),p&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=p.bind(this))}if(i.length){if(this.masElement.toggleResolved(s,i,n)){if(!this.classList.contains(Kn)&&!this.classList.contains(Qn)){let d=c.buildCheckoutURL(i,n);this.setCheckoutUrl(n.modal==="true"?"#":d)}return!0}}else{let d=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,d,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let n=ee();if(!n)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:m,promotionCode:h,quantity:p,wcsOsi:u}=n.collectCheckoutOptions(i);return Hn(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:m,promotionCode:h,quantity:p,wcsOsi:u}),!0}}}var At=class At extends ea(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Jn(At,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(At,"is","checkout-link"),g(At,"tag","a");var fe=At;window.customElements.get(fe.is)||window.customElements.define(fe.is,fe,{extends:fe.tag});var qs="p_draft_landscape",js="/store/",Ws=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),xi=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Ys=["env","workflowStep","clientId","country"],ta=e=>Ws.get(e)??e;function vi(e,t,r){for(let[i,n]of Object.entries(e)){let a=ta(i);n!=null&&r.has(a)&&t.set(a,n)}}function Xs(e){switch(e){case zr.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Ks(e,t){for(let r in e){let i=e[r];for(let[n,a]of Object.entries(i)){if(a==null)continue;let o=ta(n);t.set(`items[${r}][${o}]`,a)}}}function Qs({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===Le.CRM?"creative":"mini_plans"),e}function ra(e){Zs(e);let{env:t,items:r,workflowStep:i,marketSegment:n,customerSegment:a,offerType:o,productArrangementCode:s,landscape:c,modal:l,is3in1:d,preselectPlan:m,...h}=e,p=new URL(Xs(t));if(p.pathname=`${js}${i}`,i!==Q.SEGMENTATION&&i!==Q.CHANGE_PLAN_TEAM_PLANS&&Ks(r,p.searchParams),vi({...h},p.searchParams,xi),c===Ee.DRAFT&&vi({af:qs},p.searchParams,xi),i===Q.SEGMENTATION){let u={marketSegment:n,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(f=>f.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};m?.toLowerCase()==="edu"?p.searchParams.set("ms","EDU"):m?.toLowerCase()==="team"&&p.searchParams.set("cs","TEAM"),vi(u,p.searchParams,xi),p.searchParams.get("ot")==="PROMOTION"&&p.searchParams.delete("ot"),p=Qs({url:p,modal:l,is3in1:d})}return p.toString()}function Zs(e){for(let t of Ys)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==Q.SEGMENTATION&&e.workflowStep!==Q.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var P=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:Q.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:he.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Ee.PUBLISHED});function ia({settings:e,providers:t}){function r(a,o){let{checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:m,quantity:h,preselectPlan:p,env:u}=e,f={checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:m,quantity:h,preselectPlan:p,env:u};if(o)for(let Be of t.checkout)Be(o,f);let{checkoutMarketSegment:x,checkoutWorkflowStep:C=c,imsCountry:v,country:b=v??l,language:w=d,quantity:_=h,entitlement:R,upgrade:B,modal:Y,perpetual:z,promotionCode:N=m,wcsOsi:U,extraOptions:X,...pe}=Object.assign(f,o?.dataset??{},a??{}),be=yt(C,Q,P.checkoutWorkflowStep);return f=Kt({...pe,extraOptions:X,checkoutClientId:s,checkoutMarketSegment:x,country:b,quantity:Je(_,P.quantity),checkoutWorkflowStep:be,language:w,entitlement:E(R),upgrade:E(B),modal:Y,perpetual:E(z),promotionCode:Zt(N).effectivePromoCode,wcsOsi:tr(U),preselectPlan:p}),f}function i(a,o){if(!Array.isArray(a)||!a.length||!o)return"";let{env:s,landscape:c}=e,{checkoutClientId:l,checkoutMarketSegment:d,checkoutWorkflowStep:m,country:h,promotionCode:p,quantity:u,preselectPlan:f,ms:x,cs:C,...v}=r(o),b=document.querySelector("meta[name=mas-ff-3in1]"),w=Object.values(Le).includes(o.modal)&&(!b||b.content!=="off"),_=window.frameElement||w?"if":"fp",[{productArrangementCode:R,marketSegments:[B],customerSegment:Y,offerType:z}]=a,N=x??B??d,U=C??Y;f?.toLowerCase()==="edu"?N="EDU":f?.toLowerCase()==="team"&&(U="TEAM");let X={is3in1:w,checkoutPromoCode:p,clientId:l,context:_,country:h,env:s,items:[],marketSegment:N,customerSegment:U,offerType:z,productArrangementCode:R,workflowStep:m,landscape:c,...v},pe=u[0]>1?u[0]:void 0;if(a.length===1){let{offerId:be}=a[0];X.items.push({id:be,quantity:pe})}else X.items.push(...a.map(({offerId:be,productArrangementCode:Be})=>({id:be,quantity:pe,...w?{productArrangementCode:Be}:{}})));return ra(X)}let{createCheckoutLink:n}=fe;return{CheckoutLink:fe,CheckoutWorkflowStep:Q,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:n}}function Js({interval:e=200,maxAttempts:t=25}={}){let r=oe.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function ec(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function tc(e){let t=oe.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function na({}){let e=Js(),t=ec(e),r=tc(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var aa=window.masPriceLiterals;function oa(e){if(Array.isArray(aa)){let t=i=>aa.find(n=>Zr(n.lang,i)),r=t(e.language)??t(P.language);if(r)return Object.freeze(r)}return{}}var bi=function(e,t){return bi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},bi(e,t)};function St(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");bi(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var S=function(){return S=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},S.apply(this,arguments)};function ar(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var y;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(y||(y={}));var O;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(O||(O={}));var De;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(De||(De={}));function yi(e){return e.type===O.literal}function sa(e){return e.type===O.argument}function or(e){return e.type===O.number}function sr(e){return e.type===O.date}function cr(e){return e.type===O.time}function lr(e){return e.type===O.select}function dr(e){return e.type===O.plural}function ca(e){return e.type===O.pound}function pr(e){return e.type===O.tag}function hr(e){return!!(e&&typeof e=="object"&&e.type===De.number)}function Tt(e){return!!(e&&typeof e=="object"&&e.type===De.dateTime)}var Ei=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var rc=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function la(e){var t={};return e.replace(rc,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var da=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function ua(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(da).filter(function(h){return h.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],c=o.slice(1),l=0,d=c;l<d.length;l++){var m=d[l];if(m.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function ic(e){return e.replace(/^(.*?)-/,"")}var pa=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,fa=/^(@+)?(\+|#+)?[rs]?$/g,nc=/(\*)(0+)|(#+)(0+)|(0+)/g,ga=/^(0+)$/;function ha(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(fa,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function xa(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function ac(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!ga.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function ma(e){var t={},r=xa(e);return r||t}function va(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ic(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=S(S(S({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return S(S({},c),ma(l))},{}));continue;case"engineering":t=S(S(S({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return S(S({},c),ma(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(nc,function(c,l,d,m,h,p){if(l)t.minimumIntegerDigits=d.length;else{if(m&&h)throw new Error("We currently do not support maximum integer digits");if(p)throw new Error("We currently do not support exact integer digits")}return""});continue}if(ga.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(pa.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(pa,function(c,l,d,m,h,p){return d==="*"?t.minimumFractionDigits=l.length:m&&m[0]==="#"?t.maximumFractionDigits=m.length:h&&p?(t.minimumFractionDigits=h.length,t.maximumFractionDigits=h.length+p.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var a=n.options[0];a==="w"?t=S(S({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=S(S({},t),ha(a)));continue}if(fa.test(n.stem)){t=S(S({},t),ha(n.stem));continue}var o=xa(n.stem);o&&(t=S(S({},t),o));var s=ac(n.stem);s&&(t=S(S({},t),s))}return t}var _t={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function ba(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),c="a",l=oc(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;o-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function oc(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=_t[i||""]||_t[r||""]||_t["".concat(r,"-001")]||_t["001"];return n[0]}var wi,sc=new RegExp("^".concat(Ei.source,"*")),cc=new RegExp("".concat(Ei.source,"*$"));function T(e,t){return{start:e,end:t}}var lc=!!String.prototype.startsWith,dc=!!String.fromCodePoint,pc=!!Object.fromEntries,hc=!!String.prototype.codePointAt,mc=!!String.prototype.trimStart,uc=!!String.prototype.trimEnd,fc=!!Number.isSafeInteger,gc=fc?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},Si=!0;try{ya=Sa("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Si=((wi=ya.exec("a"))===null||wi===void 0?void 0:wi[0])==="a"}catch{Si=!1}var ya,Ea=lc?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},Ti=dc?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},wa=pc?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},Aa=hc?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},xc=mc?function(t){return t.trimStart()}:function(t){return t.replace(sc,"")},vc=uc?function(t){return t.trimEnd()}:function(t){return t.replace(cc,"")};function Sa(e,t){return new RegExp(e,t)}var _i;Si?(Ai=Sa("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),_i=function(t,r){var i;Ai.lastIndex=r;var n=Ai.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):_i=function(t,r){for(var i=[];;){var n=Aa(t,r);if(n===void 0||_a(n)||Ec(n))break;i.push(n),r+=n>=65536?2:1}return Ti.apply(void 0,i)};var Ai,Ta=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:O.pound,location:T(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(y.UNMATCHED_CLOSING_TAG,T(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&Ci(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:O.literal,value:"<".concat(n,"/>"),location:T(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Ci(this.char()))return this.error(y.INVALID_TAG,T(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(y.UNMATCHED_CLOSING_TAG,T(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:O.tag,value:n,children:o,location:T(i,this.clonePosition())},err:null}:this.error(y.INVALID_TAG,T(s,this.clonePosition())))}else return this.error(y.UNCLOSED_TAG,T(i,this.clonePosition()))}else return this.error(y.INVALID_TAG,T(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&yc(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=T(i,this.clonePosition());return{val:{type:O.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!bc(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return Ti.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),Ti(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(y.EMPTY_ARGUMENT,T(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(y.MALFORMED_ARGUMENT,T(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:O.argument,value:n,location:T(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(y.MALFORMED_ARGUMENT,T(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=_i(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=T(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(y.EXPECT_ARGUMENT_TYPE,T(o,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var d=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var h=vc(m.val);if(h.length===0)return this.error(y.EXPECT_ARGUMENT_STYLE,T(this.clonePosition(),this.clonePosition()));var p=T(d,this.clonePosition());l={style:h,styleLocation:p}}var u=this.tryParseArgumentClose(n);if(u.err)return u;var f=T(n,this.clonePosition());if(l&&Ea(l?.style,"::",0)){var x=xc(l.style.slice(2));if(s==="number"){var m=this.parseNumberSkeletonFromString(x,l.styleLocation);return m.err?m:{val:{type:O.number,value:i,location:f,style:m.val},err:null}}else{if(x.length===0)return this.error(y.EXPECT_DATE_TIME_SKELETON,f);var C=x;this.locale&&(C=ba(x,this.locale));var h={type:De.dateTime,pattern:C,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?la(C):{}},v=s==="date"?O.date:O.time;return{val:{type:v,value:i,location:f,style:h},err:null}}}return{val:{type:s==="number"?O.number:s==="date"?O.date:O.time,value:i,location:f,style:(a=l?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var b=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(y.EXPECT_SELECT_ARGUMENT_OPTIONS,T(b,S({},b)));this.bumpSpace();var w=this.parseIdentifierIfPossible(),_=0;if(s!=="select"&&w.value==="offset"){if(!this.bumpIf(":"))return this.error(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,T(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),w=this.parseIdentifierIfPossible(),_=m.val}var R=this.tryParsePluralOrSelectOptions(t,s,r,w);if(R.err)return R;var u=this.tryParseArgumentClose(n);if(u.err)return u;var B=T(n,this.clonePosition());return s==="select"?{val:{type:O.select,value:i,options:wa(R.val),location:B},err:null}:{val:{type:O.plural,value:i,options:wa(R.val),offset:_,pluralType:s==="plural"?"cardinal":"ordinal",location:B},err:null}}default:return this.error(y.INVALID_ARGUMENT_TYPE,T(o,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(y.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,T(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=ua(t)}catch{return this.error(y.INVALID_NUMBER_SKELETON,r)}return{val:{type:De.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?va(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],c=new Set,l=n.value,d=n.location;;){if(l.length===0){var m=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var h=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_SELECTOR,y.INVALID_PLURAL_ARGUMENT_SELECTOR);if(h.err)return h;d=T(m,this.clonePosition()),l=this.message.slice(m.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?y.DUPLICATE_SELECT_ARGUMENT_SELECTOR:y.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,d);l==="other"&&(o=!0),this.bumpSpace();var p=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:y.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,T(this.clonePosition(),this.clonePosition()));var u=this.parseMessage(t+1,r,i);if(u.err)return u;var f=this.tryParseArgumentClose(p);if(f.err)return f;s.push([l,{value:u.val,location:T(p,this.clonePosition())}]),c.add(l),this.bumpSpace(),a=this.parseIdentifierIfPossible(),l=a.value,d=a.location}return s.length===0?this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR:y.EXPECT_PLURAL_ARGUMENT_SELECTOR,T(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(y.MISSING_OTHER_CLAUSE,T(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var c=T(n,this.clonePosition());return a?(o*=i,gc(o)?{val:o,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Aa(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Ea(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&_a(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function Ci(e){return e>=97&&e<=122||e>=65&&e<=90}function bc(e){return Ci(e)||e===47}function yc(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function _a(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Ec(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Li(e){e.forEach(function(t){if(delete t.location,lr(t)||dr(t))for(var r in t.options)delete t.options[r].location,Li(t.options[r].value);else or(t)&&hr(t.style)||(sr(t)||cr(t))&&Tt(t.style)?delete t.style.location:pr(t)&&Li(t.children)})}function Ca(e,t){t===void 0&&(t={}),t=S({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Ta(e,t).parse();if(r.err){var i=SyntaxError(y[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||Li(r.val),r.val}function Ct(e,t){var r=t&&t.cache?t.cache:Cc,i=t&&t.serializer?t.serializer:_c,n=t&&t.strategy?t.strategy:Ac;return n(e,{cache:r,serializer:i})}function wc(e){return e==null||typeof e=="number"||typeof e=="boolean"}function La(e,t,r,i){var n=wc(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function Pa(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function Pi(e,t,r,i,n){return r.bind(t,e,i,n)}function Ac(e,t){var r=e.length===1?La:Pa;return Pi(e,this,r,t.cache.create(),t.serializer)}function Sc(e,t){return Pi(e,this,Pa,t.cache.create(),t.serializer)}function Tc(e,t){return Pi(e,this,La,t.cache.create(),t.serializer)}var _c=function(){return JSON.stringify(arguments)};function ki(){this.cache=Object.create(null)}ki.prototype.get=function(e){return this.cache[e]};ki.prototype.set=function(e,t){this.cache[e]=t};var Cc={create:function(){return new ki}},mr={variadic:Sc,monadic:Tc};var He;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(He||(He={}));var Lt=function(e){St(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Mi=function(e){St(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),He.INVALID_VALUE,a)||this}return t}(Lt);var ka=function(e){St(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),He.INVALID_VALUE,n)||this}return t}(Lt);var Ma=function(e){St(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),He.MISSING_VALUE,i)||this}return t}(Lt);var j;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(j||(j={}));function Lc(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==j.literal||r.type!==j.literal?t.push(r):i.value+=r.value,t},[])}function Pc(e){return typeof e=="function"}function Pt(e,t,r,i,n,a,o){if(e.length===1&&yi(e[0]))return[{type:j.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var d=l[c];if(yi(d)){s.push({type:j.literal,value:d.value});continue}if(ca(d)){typeof a=="number"&&s.push({type:j.literal,value:r.getNumberFormat(t).format(a)});continue}var m=d.value;if(!(n&&m in n))throw new Ma(m,o);var h=n[m];if(sa(d)){(!h||typeof h=="string"||typeof h=="number")&&(h=typeof h=="string"||typeof h=="number"?String(h):""),s.push({type:typeof h=="string"?j.literal:j.object,value:h});continue}if(sr(d)){var p=typeof d.style=="string"?i.date[d.style]:Tt(d.style)?d.style.parsedOptions:void 0;s.push({type:j.literal,value:r.getDateTimeFormat(t,p).format(h)});continue}if(cr(d)){var p=typeof d.style=="string"?i.time[d.style]:Tt(d.style)?d.style.parsedOptions:i.time.medium;s.push({type:j.literal,value:r.getDateTimeFormat(t,p).format(h)});continue}if(or(d)){var p=typeof d.style=="string"?i.number[d.style]:hr(d.style)?d.style.parsedOptions:void 0;p&&p.scale&&(h=h*(p.scale||1)),s.push({type:j.literal,value:r.getNumberFormat(t,p).format(h)});continue}if(pr(d)){var u=d.children,f=d.value,x=n[f];if(!Pc(x))throw new ka(f,"function",o);var C=Pt(u,t,r,i,n,a),v=x(C.map(function(_){return _.value}));Array.isArray(v)||(v=[v]),s.push.apply(s,v.map(function(_){return{type:typeof _=="string"?j.literal:j.object,value:_}}))}if(lr(d)){var b=d.options[h]||d.options.other;if(!b)throw new Mi(d.value,h,Object.keys(d.options),o);s.push.apply(s,Pt(b.value,t,r,i,n));continue}if(dr(d)){var b=d.options["=".concat(h)];if(!b){if(!Intl.PluralRules)throw new Lt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,He.MISSING_INTL_API,o);var w=r.getPluralRules(t,{type:d.pluralType}).select(h-(d.offset||0));b=d.options[w]||d.options.other}if(!b)throw new Mi(d.value,h,Object.keys(d.options),o);s.push.apply(s,Pt(b.value,t,r,i,n,h-(d.offset||0)));continue}}return Lc(s)}function kc(e,t){return t?S(S(S({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=S(S({},e[i]),t[i]||{}),r},{})):e}function Mc(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=kc(e[i],t[i]),r},S({},e)):e}function Ri(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Rc(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ct(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,ar([void 0],r,!1)))},{cache:Ri(e.number),strategy:mr.variadic}),getDateTimeFormat:Ct(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,ar([void 0],r,!1)))},{cache:Ri(e.dateTime),strategy:mr.variadic}),getPluralRules:Ct(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,ar([void 0],r,!1)))},{cache:Ri(e.pluralRules),strategy:mr.variadic})}}var Ra=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var c=s.reduce(function(l,d){return!l.length||d.type!==j.literal||typeof l[l.length-1]!="string"?l.push(d.value):l[l.length-1]+=d.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(o){return Pt(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Mc(e.formats,i),this.formatters=n&&n.formatters||Rc(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Ca,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Na=Ra;var Ni={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},Nc=An("ConsonantTemplates/price"),Oc=/<\/?[^>]+(>|$)/g,H={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Se={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},Oi="TAX_EXCLUSIVE",Ic=e=>yn(e)?Object.entries(e).filter(([,t])=>Ze(t)||Xt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+bn(i)+'"'}`,""):"",F=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+H.disabled}"${Ic(r)}>${i?qn(t):t??""}</span>`;function Dc(e){e=e.replaceAll("</a>","&lt;/a&gt;");let t=/<a [^>]+(>|$)/g;return e.match(t)?.forEach(i=>{let n=i.replace("<a ","&lt;a ").replace(">","&gt;");e=e.replaceAll(i,n)}),e}function Hc(e){e=e.replaceAll("&lt;/a&gt;","</a>");let t=/&lt;a (?!&gt;)(.*?)(&gt;|$)/g;return e.match(t)?.forEach(i=>{let n=i.replace("&lt;a ","<a ").replace("&gt;",">");e=e.replaceAll(i,n)}),e}function ge(e,t,r,i){let n=e[r];if(n==null)return"";let a=n.includes("<"),o=n.includes("<a ");try{n=o?Dc(n):n,n=a?n.replace(Oc,""):n;let s=new Na(n,t).format(i);return o?Hc(s):s}catch{return Nc.error("Failed to format literal:",n),""}}function Bc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:n,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:d,taxInclusivityLabel:m},h={}){let p=F(H.currencySymbol,i),u=F(H.currencySpace,o?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(f+=p+u),f+=F(H.integer,s),f+=F(H.decimalsDelimiter,a),f+=F(H.decimals,n),c||(f+=u+p),f+=F(H.recurrence,l,null,!0),f+=F(H.unitType,d,null,!0),f+=F(H.taxInclusivity,m,!0),F(e,f,{...h})}var W=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:n=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:d,literals:m={},quantity:h=1,space:p=!1,isPromoApplied:u=!1}={},{commitment:f,offerSelectorIds:x,formatString:C,price:v,priceWithoutDiscount:b,taxDisplay:w,taxTerm:_,term:R,usePrecision:B,promotion:Y}={},z={})=>{Object.entries({country:a,formatString:C,language:d,price:v}).forEach(([bo,yo])=>{if(yo==null)throw new Error(`Argument "${bo}" is missing for osi ${x?.toString()}, country ${a}, language ${d}`)});let N={...Ni,...m},U=`${d.toLowerCase()}-${a.toUpperCase()}`,X;Y&&!u&&b?X=e?v:b:r&&b?X=b:X=v;let pe=t?Wn:Yn;i&&(pe=Xn);let{accessiblePrice:be,recurrenceTerm:Be,...Ui}=pe({commitment:f,formatString:C,instant:n,isIndianPrice:a==="IN",originalPrice:v,priceWithoutDiscount:b,price:t?v:X,promotion:Y,quantity:h,term:R,usePrecision:B}),gr="",xr="",vr="";E(s)&&Be&&(vr=ge(N,U,Se.recurrenceLabel,{recurrenceTerm:Be}));let Dt="";E(c)&&(p&&(Dt+=" "),Dt+=ge(N,U,Se.perUnitLabel,{perUnit:"LICENSE"}));let Ht="";E(l)&&_&&(p&&(Ht+=" "),Ht+=ge(N,U,w===Oi?Se.taxExclusiveLabel:Se.taxInclusiveLabel,{taxTerm:_})),r&&(gr=ge(N,U,Se.strikethroughAriaLabel,{strikethroughPrice:gr})),e&&(xr=ge(N,U,Se.alternativePriceAriaLabel,{alternativePrice:xr}));let Ue=H.container;if(t&&(Ue+=" "+H.containerOptical),r&&(Ue+=" "+H.containerStrikethrough),e&&(Ue+=" "+H.containerAlternative),i&&(Ue+=" "+H.containerAnnual),E(o))return Bc(Ue,{...Ui,accessibleLabel:gr,altAccessibleLabel:xr,recurrenceLabel:vr,perUnitLabel:Dt,taxInclusivityLabel:Ht},z);let{currencySymbol:Fi,decimals:uo,decimalsDelimiter:fo,hasCurrencySpace:zi,integer:go,isCurrencyFirst:xo}=Ui,Fe=[go,fo,uo];xo?(Fe.unshift(zi?"\xA0":""),Fe.unshift(Fi)):(Fe.push(zi?"\xA0":""),Fe.push(Fi)),Fe.push(vr,Dt,Ht);let vo=Fe.join("");return F(Ue,vo,z)},Oa=()=>(e,t,r)=>{let i=Ie(t.promotion,t.promotion?.displaySummary?.instant,Array.isArray(e.quantity)?e.quantity[0]:e.quantity),a=(e.displayOldPrice===void 0||E(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price&&(!t.promotion||i);return`${a?W({displayStrikethrough:!0})({isPromoApplied:i,...e},t,r)+"&nbsp;":""}${W({isAlternativePrice:a})({isPromoApplied:i,...e},t,r)}`},Ia=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let n=Ie(t.promotion,i,Array.isArray(e.quantity)?e.quantity[0]:e.quantity),a={...e,displayTax:!1,displayPerUnit:!1,isPromoApplied:n};if(!n)return W()(e,{...t,price:t.priceWithoutDiscount},r)+F(H.containerAnnualPrefix,"&nbsp;(")+W({displayAnnual:!0,instant:i})(a,{...t,price:t.priceWithoutDiscount},r)+F(H.containerAnnualSuffix,")");let s=(e.displayOldPrice===void 0||E(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${s?W({displayStrikethrough:!0})(a,t,r)+"&nbsp;":""}${W({isAlternativePrice:s})({isPromoApplied:n,...e},t,r)}${F(H.containerAnnualPrefix,"&nbsp;(")}${W({displayAnnual:!0,instant:i})(a,t,r)}${F(H.containerAnnualSuffix,")")}`},Da=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${W({isAlternativePrice:e.displayOldPrice})(e,t,r)}${F(H.containerAnnualPrefix,"&nbsp;(")}${W({displayAnnual:!0})(i,t,r)}${F(H.containerAnnualSuffix,")")}`};var kt={...H,containerLegal:"price-legal",planType:"price-plan-type"},ur={...Se,planTypeLabel:"planTypeLabel"};function Uc(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},n={}){let a="";return a+=F(kt.unitType,t,null,!0),r&&i&&(r+=". "),a+=F(kt.taxInclusivity,r,!0),a+=F(kt.planType,i,null),F(e,a,{...n})}var Ha=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:n,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:c}={},l={})=>{let d={...Ni,...a},m=`${n.toLowerCase()}-${e.toUpperCase()}`,h="";E(t)&&(h=ge(d,m,ur.perUnitLabel,{perUnit:"LICENSE"}));let p="";e==="US"&&n==="en"&&(r=!1),E(r)&&s&&(p=ge(d,m,o===Oi?ur.taxExclusiveLabel:ur.taxInclusiveLabel,{taxTerm:s}));let u="";E(i)&&c&&(u=ge(d,m,ur.planTypeLabel,{planType:c}));let f=kt.container;return f+=" "+kt.containerLegal,Uc(f,{perUnitLabel:h,taxInclusivityLabel:p,planTypeLabel:u},l)};var Ba=W(),Ua=Oa(),Fa=W({displayOptical:!0}),za=W({displayStrikethrough:!0}),$a=W({displayAnnual:!0}),Ga=W({displayOptical:!0,isAlternativePrice:!0}),Va=W({isAlternativePrice:!0}),qa=Da(),ja=Ia(),Wa=Ha;var Fc=(e,t)=>{if(!(!bt(e)||!bt(t)))return Math.floor((t-e)/t*100)},Ya=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=Fc(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Xa=Ya();var Qa="INDIVIDUAL_COM",Ii="TEAM_COM",Za="INDIVIDUAL_EDU",Di="TEAM_EDU",Ka=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],zc={[Qa]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[Ii]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[Za]:["LT_lt","LV_lv","SA_en","SG_en"],[Di]:["SG_en","KR_ko"]},$c={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},Gc=[Qa,Ii,Za,Di],Vc=e=>[Ii,Di].includes(e),qc=(e,t,r,i)=>{let n=`${e}_${t}`,a=`${r}_${i}`,o=$c[n];if(o){let s=Gc.indexOf(a);return o[s]}return Vc(a)},jc=(e,t,r,i)=>{let n=`${e}_${t}`;if(Ka.includes(e)||Ka.includes(n))return!0;let a=zc[`${r}_${i}`];return a?a.includes(e)||a.includes(n)?!0:P.displayTax:P.displayTax},Wc=async(e,t,r,i)=>{let n=jc(e,t,r,i);return{displayTax:n,forceTaxExclusive:n?qc(e,t,r,i):P.forceTaxExclusive}},Mt=class Mt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Ae(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi","data-quantity"]}static createInlinePrice(r){let i=ee();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:m,promotionCode:h,quantity:p,alternativePrice:u,template:f,wcsOsi:x}=i.collectPriceOptions(r);return nr(Mt,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:m,promotionCode:h,quantity:p,alternativePrice:u,template:f,wcsOsi:x})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===ce}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=ee();if(!i)return!1;let n=i.collectPriceOptions(r,this),a={...i.settings,...n};if(!a.wcsOsi.length)return!1;try{let o=this.masElement.togglePending({});this.innerHTML="";let[s]=await i.resolveOfferSelectors(a),c=Et(await s,a),[l]=c;if(i.featureFlags[ue]||a[ue]){if(n.displayPerUnit===void 0&&(a.displayPerUnit=l.customerSegment!=="INDIVIDUAL"),n.displayTax===void 0||n.forceTaxExclusive===void 0){let{country:d,language:m}=a,[h=""]=l.marketSegments,p=await Wc(d,m,l.customerSegment,h);n.displayTax===void 0&&(a.displayTax=p?.displayTax||a.displayTax),n.forceTaxExclusive===void 0&&(a.forceTaxExclusive=p?.forceTaxExclusive||a.forceTaxExclusive),a.forceTaxExclusive&&(c=Et(c,a))}}else n.displayOldPrice===void 0&&(a.displayOldPrice=!0);return this.renderOffers(c,a,o)}catch(o){throw this.innerHTML="",o}}renderOffers(r,i,n=void 0){if(!this.isConnected)return;let a=ee();if(!a)return!1;if(n??(n=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(n,r,i)){this.innerHTML=a.buildPriceHTML(r,this.options);let o=this.closest("p, h3, div");if(!o||!o.querySelector('span[data-template="strikethrough"]')||o.querySelector(".alt-aria-label"))return!0;let s=o?.querySelectorAll('span[is="inline-price"]');return s.length>1&&s.length===o.querySelectorAll('span[data-template="strikethrough"]').length*2&&s.forEach(c=>{c.dataset.template!=="strikethrough"&&c.options&&!c.options.alternativePrice&&!c.isFailed&&(c.options.alternativePrice=!0,c.innerHTML=a.buildPriceHTML(r,c.options))}),!0}}else{let o=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,o,this.options))return this.innerHTML="",!0}return!1}};g(Mt,"is","inline-price"),g(Mt,"tag","span");var xe=Mt;window.customElements.get(xe.is)||window.customElements.define(xe.is,xe,{extends:xe.tag});function Ja({literals:e,providers:t,settings:r}){function i(o,s=null){let c={country:r.country,language:r.language,locale:r.locale,literals:{...e.price}};if(s&&t?.price)for(let R of t.price)R(s,c);let{displayOldPrice:l,displayPerUnit:d,displayRecurrence:m,displayTax:h,displayPlanType:p,forceTaxExclusive:u,perpetual:f,displayAnnual:x,promotionCode:C,quantity:v,alternativePrice:b,wcsOsi:w,..._}=Object.assign(c,s?.dataset??{},o??{});return c=Kt(Object.assign({...c,..._,displayOldPrice:E(l),displayPerUnit:E(d),displayRecurrence:E(m),displayTax:E(h),displayPlanType:E(p),forceTaxExclusive:E(u),perpetual:E(f),displayAnnual:E(x),promotionCode:Zt(C).effectivePromoCode,quantity:Je(v,P.quantity),alternativePrice:E(b),wcsOsi:tr(w)})),c}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=Xa;break;case"strikethrough":l=za;break;case"annual":l=$a;break;case"legal":l=Wa;break;default:s.template==="optical"&&s.alternativePrice?l=Ga:s.template==="optical"?l=Fa:s.displayAnnual&&o[0].planType==="ABM"?l=s.promotionCode?ja:qa:s.alternativePrice?l=Va:l=s.promotionCode?Ua:Ba}let[d]=o;return d={...d,...d.priceDetails},l({...r,...s},d)}let a=xe.createInlinePrice;return{InlinePrice:xe,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function Yc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||P.language),t??(t=e?.split("_")?.[1]||P.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function eo(e={},t){let r=t.featureFlags[ue],{commerce:i={}}=e,n=he.PRODUCTION,a=Ur,o=D("checkoutClientId",i)??P.checkoutClientId,s=yt(D("checkoutWorkflowStep",i),Q,P.checkoutWorkflowStep),c=P.displayOldPrice,l=P.displayPerUnit,d=E(D("displayRecurrence",i),P.displayRecurrence),m=E(D("displayTax",i),P.displayTax),h=E(D("displayPlanType",i),P.displayPlanType),p=E(D("entitlement",i),P.entitlement),u=E(D("modal",i),P.modal),f=E(D("forceTaxExclusive",i),P.forceTaxExclusive),x=D("promotionCode",i)??P.promotionCode,C=Je(D("quantity",i)),v=D("wcsApiKey",i)??P.wcsApiKey,b=i?.env==="stage",w=Ee.PUBLISHED;["true",""].includes(i.allowOverride)&&(b=(D(Hr,i,{metadata:!1})?.toLowerCase()??i?.env)==="stage",w=yt(D(Br,i),Ee,w)),b&&(n=he.STAGE,a=Fr);let R=D(Dr)??e.preview,B=typeof R<"u"&&R!=="off"&&R!=="false",Y={};B&&(Y={preview:B});let z=D("mas-io-url")??e.masIOUrl??`https://www${n===he.STAGE?".stage":""}.adobe.com/mas/io`,N=D("preselect-plan")??void 0;return{...Yc(e),...Y,displayOldPrice:c,checkoutClientId:o,checkoutWorkflowStep:s,displayPerUnit:l,displayRecurrence:d,displayTax:m,displayPlanType:h,entitlement:p,extraOptions:P.extraOptions,modal:u,env:n,forceTaxExclusive:f,promotionCode:x,quantity:C,alternativePrice:P.alternativePrice,wcsApiKey:v,wcsURL:a,landscape:w,masIOUrl:z,...N&&{preselectPlan:N}}}async function to(e,t={},r=2,i=100){let n;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(n=o,n.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,i*(a+1)))}throw n}var Hi="wcs";function ro({settings:e}){let t=oe.module(Hi),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o,s=new Map;async function c(p,u,f=!0){let x=ee(),C=Rr;t.debug("Fetching:",p);let v="",b;if(p.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let w=new Map(u),[_]=p.offerSelectorIds,R=Date.now()+Math.random().toString(36).substring(2,7),B=`${Hi}:${_}:${R}${$r}`,Y=`${Hi}:${_}:${R}${Gr}`,z;try{if(performance.mark(B),v=new URL(e.wcsURL),v.searchParams.set("offer_selector_ids",_),v.searchParams.set("country",p.country),v.searchParams.set("locale",p.locale),v.searchParams.set("landscape",r===he.STAGE?"ALL":e.landscape),v.searchParams.set("api_key",i),p.language&&v.searchParams.set("language",p.language),p.promotionCode&&v.searchParams.set("promotion_code",p.promotionCode),p.currency&&v.searchParams.set("currency",p.currency),b=await to(v.toString(),{credentials:"omit"}),b.ok){let N=[];try{let U=await b.json();t.debug("Fetched:",p,U),N=U.resolvedOffers??[]}catch(U){t.error(`Error parsing JSON: ${U.message}`,{...U.context,...x?.duration})}N=N.map(Jt),u.forEach(({resolve:U},X)=>{let pe=N.filter(({offerSelectorIds:be})=>be.includes(X)).flat();pe.length&&(w.delete(X),u.delete(X),U(pe))})}else C=Mr}catch(N){C=`Network error: ${N.message}`}finally{z=performance.measure(Y,B),performance.clearMarks(B),performance.clearMeasures(Y)}if(f&&u.size){t.debug("Missing:",{offerSelectorIds:[...u.keys()]});let N=Ln(b);u.forEach(U=>{U.reject(new et(C,{...p,...N,response:b,measure:Ft(z),...x?.duration}))})}}function l(){clearTimeout(o);let p=[...a.values()];a.clear(),p.forEach(({options:u,promises:f})=>c(u,f))}function d(p){if(!p||typeof p!="object")throw new TypeError("Cache must be a Map or similar object");let u=r===he.STAGE?"stage":"prod",f=p[u];if(!f||typeof f!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[x,C]of Object.entries(f))n.set(x,Promise.resolve(C.map(Jt)));t.debug(`Prefilled WCS cache with ${f.size} entries`)}function m(){let p=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${p} cache entries to stale cache`)}function h({country:p,language:u,perpetual:f=!1,promotionCode:x="",wcsOsi:C=[]}){let v=`${u}_${p}`;p!=="GB"&&!f&&(u="MULT");let b=[p,u,x].filter(w=>w).join("-").toLowerCase();return C.map(w=>{let _=`${w}-${b}`;if(n.has(_))return n.get(_);let R=new Promise((B,Y)=>{let z=a.get(b);if(!z){let N={country:p,locale:v,offerSelectorIds:[]};p!=="GB"&&!f&&(N.language=u),z={options:N,promises:new Map},a.set(b,z)}x&&(z.options.promotionCode=x),z.options.offerSelectorIds.push(w),z.promises.set(w,{resolve:B,reject:Y}),l()}).catch(B=>{if(s.has(_))return s.get(_);throw B});return n.set(_,R),R})}return{Commitment:_e,PlanType:Tn,Term:ne,applyPlanType:Jt,resolveOfferSelectors:h,flushWcsCacheInternal:m,prefillWcsCache:d}}var io="mas-commerce-service",no="mas-commerce-service:start",ao="mas-commerce-service:ready",Rt,rt,it,oo,so,Bi=class extends HTMLElement{constructor(){super(...arguments);$(this,it);$(this,Rt);$(this,rt);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}get featureFlags(){return A(this,rt)||V(this,rt,{[ue]:Bt(this,it,so).call(this,ue)}),A(this,rt)}activate(){let r=A(this,it,oo),i=eo(r,this);rr(r.lana);let n=oe.init(r.hostEnv).module("service");n.debug("Activating:",r);let o={price:oa(i)},s={checkout:new Set,price:new Set},c={literals:o,providers:s,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...ia(c),...na(c),...Ja(c),...ro(c),...Vr,Log:oe,get defaults(){return P},get log(){return oe},get providers(){return{checkout(d){return s.checkout.add(d),()=>s.checkout.delete(d)},price(d){return s.price.add(d),()=>s.price.delete(d)},has:d=>s.price.has(d)||s.checkout.has(d)}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i});let l=new CustomEvent(Ut,{bubbles:!0,cancelable:!1,detail:this});performance.mark(ao),V(this,Rt,performance.measure(ao,no)),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(no),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(yr).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":Ft(A(this,Rt))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:a,responseStatus:o})=>n===0&&a===0&&o<200||o>=400),i=Array.from(new Map(r.map(n=>[n.name,n])).values());if(i.some(({name:n})=>/(\/fragment\?|web_commerce_artifact)/.test(n))){let n=i.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};Rt=new WeakMap,rt=new WeakMap,it=new WeakSet,oo=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(n=>{let a=this.getAttribute(n);a&&(i[n]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let a=this.getAttribute(n);if(a!=null){let o=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());i.commerce[o]=a}}),i},so=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||D(r))};window.customElements.get(io)||window.customElements.define(io,Bi);var ho="merch-card-collection",Xc=2e4,Kc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Qc={plans:!0},Zc=(e,{filter:t})=>e.filter(r=>r?.filters&&r?.filters.hasOwnProperty(t)),Jc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,el=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),tl=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),rl=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Te,at,Ot,It,fr,mo,nt=class extends lo{constructor(){super();$(this,fr);$(this,Te,{});$(this,at);$(this,Ot);$(this,It);this.id=null,this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1,this.onUnmount=[]}render(){return ve`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(n=>setTimeout(()=>n(!1),Xc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(l=>l.tagName==="MERCH-CARD");if(n.length===0)return;r.has("singleApp")&&this.singleApp&&n.forEach(l=>{l.updateFilters(l.name===this.singleApp)});let a=this.sort===le.alphabetical?el:tl,s=[Zc,Jc,rl,a].reduce((l,d)=>d(l,this),n).map((l,d)=>[l,d]);if(this.resultCount=s.length,this.page&&this.limit){let l=this.page*this.limit;this.hasMore=s.length>l,s=s.filter(([,d])=>d<l)}let c=new Map(s.reverse());for(let l of c.keys())this.prepend(l);n.forEach(l=>{c.has(l)?(l.size=l.filters[this.filter]?.size,l.style.removeProperty("display"),l.requestUpdate()):(l.style.display="none",l.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(Sr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(se,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){V(this,Te,{}),this.overrides?.split(",").forEach(r=>{let[i,n]=r?.split(":");i&&n&&(A(this,Te)[i]=n)})}connectedCallback(){super.connectedCallback(),V(this,at,ut()),A(this,at)&&V(this,Ot,A(this,at).Log.module(ho)),V(this,It,customElements.get("merch-card")),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.();for(let r of this.onUnmount)r()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r,this.querySelectorAll("[placeholder]").forEach(n=>{let a=n.getAttribute("slot");this.header.placeholderKeys.includes(a)&&this.header.append(n)})}initializePlaceholders(){let r=this.data?.placeholders||{};!r.searchText&&this.data?.sidenavSettings?.searchText&&(r.searchText=this.data.sidenavSettings.searchText);for(let i of Object.keys(r)){let n=r[i],a=n.includes("<p>")?"div":"p",o=document.createElement(a);o.setAttribute("slot",i),o.setAttribute("placeholder",""),o.innerHTML=n,this.append(o)}}attachSidenav(r,i=!0){if(!r)return;i&&this.parentElement.prepend(r),this.sidenav=r,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),Qc[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(dt));let n=A(this,It)?.getCollectionOptions(this.variant)?.onSidenavAttached;n&&n(this)}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.id=r.getAttribute("fragment"),this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let n=this;function a(o,s){let c;o.fields?.checkboxGroups?c=o.fields.checkboxGroups:o.fields?.tagFilters&&(c=[{title:o.fields?.tagFiltersTitle,label:"types",deeplink:"types",checkboxes:o.fields.tagFilters.map(h=>{let p=h.split("/").pop(),u=o.settings?.tagLabels?.[p]||p;return u=u.startsWith("coll-tag-filter")?p.charAt(0).toUpperCase()+p.slice(1):u,{name:p,label:u}})}]);let l={searchText:o.fields?.searchText,tagFilters:c,linksTitle:o.fields?.linksTitle,link:o.fields?.link,linkText:o.fields?.linkText,linkIcon:o.fields?.linkIcon},d={cards:[],hierarchy:[],placeholders:o.placeholders,sidenavSettings:l};function m(h,p){for(let u of p){if(u.fieldName==="cards"){if(d.cards.findIndex(v=>v.id===u.identifier)!==-1)continue;d.cards.push(o.references[u.identifier].value);continue}let f=o.references[u.identifier]?.value;if(!f?.fields)continue;let{fields:x}=f,C={label:x.label||"",icon:x.icon,iconLight:x.iconLight,queryLabel:x.queryLabel,cards:x.cards?x.cards.map(v=>s[v]||v):[],collections:[]};x.defaultchild&&(C.defaultchild=s[x.defaultchild]||x.defaultchild),h.push(C),m(C.collections,u.referencesTree)}}return m(d.hierarchy,o.referencesTree),d.hierarchy.length===0&&(n.filtered="all"),d}r.addEventListener(_r,o=>{Bt(this,fr,mo).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(Tr,async o=>{this.limit=27,this.data=a(o.detail,A(this,Te));let{cards:s,hierarchy:c}=this.data,l=c.length===0&&o.detail.fields?.defaultchild?A(this,Te)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...s);let d=(p,u)=>{for(let f of p)if(f.defaultchild===u||f.collections&&d(f.collections,u))return!0;return!1};for(let p of s){let v=function(w){for(let _ of w){let R=_.cards.indexOf(f);if(R===-1)continue;let B=_.queryLabel??_?.label?.toLowerCase()??"";u.filters[B]={order:R+1,size:p.fields.size},v(_.collections)}},u=document.createElement("merch-card"),f=A(this,Te)[p.id]||p.id;u.setAttribute("consonant",""),u.setAttribute("style","");let x=p.fields.tags?.filter(w=>w.startsWith("mas:types/")).map(w=>w.split("/")[1]).join(",");x&&u.setAttribute("types",x),$t(p.fields.variant)?.supportsDefaultChild&&(l?f===l:d(c,f))&&u.setAttribute("data-default-card","true"),v(c);let b=document.createElement("aem-fragment");b.setAttribute("fragment",f),u.append(b),Object.keys(u.filters).length===0&&(u.filters={all:{order:s.indexOf(p)+1,size:p.fields.size}}),this.append(u)}let m="",h=Bn(s[0]?.fields?.variant);this.variant=h,h==="plans"&&s.length===3&&!s.some(p=>p.fields?.size?.includes("wide"))&&(m="ThreeColumns"),h&&this.classList.add("merch-card-collection",h,...Kc[`${h}${m}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i(!0)}),await this.hydrationReady}get footer(){if(!this.filtered)return ve`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return ve`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===le.authored?lt({sort:void 0}):lt({sort:r.target.value}),this.dispatchEvent(new CustomEvent(wr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(Ar,{bubbles:!0,composed:!0}));let r=this.page+1;lt({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=ji(({category:r,filter:i,types:n,sort:a,search:o,single_app:s,page:c})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{lt({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=n??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(c)||1})}openFilters(r){this.sidenav?.showModal(r)}};Te=new WeakMap,at=new WeakMap,Ot=new WeakMap,It=new WeakMap,fr=new WeakSet,mo=function(r,i={},n=!0){A(this,Ot).error(`merch-card-collection: ${r}`,i),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Cr,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(nt,"properties",{id:{type:String,attribute:"id",reflect:!0},displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:le.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(nt,"styles",po`
        #footer {
            grid-column: 1 / -1;
            justify-self: stretch;
            color: var(--merch-color-grey-80);
            order: 1000;
        }

        sp-theme {
            display: contents;
        }
    `);nt.SortOrder=le;customElements.define(ho,nt);var il={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},nl=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(n=>{n.innerText=r||""})},al={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},ol={catalog:"l"},te,ot,Nt=class extends lo{constructor(){super();$(this,te);$(this,ot);g(this,"tablet",new ct(this,I));g(this,"desktop",new ct(this,L));this.collection=null,V(this,te,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(se,this.updateLiterals),this.collection?.addEventListener(dt,this.handleSidenavAttached),V(this,ot,customElements.get("merch-card"))}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(se,this.updateLiterals),this.collection?.removeEventListener(dt,this.handleSidenavAttached)}willUpdate(){A(this,te).search=this.getVisibility("search"),A(this,te).filter=this.getVisibility("filter"),A(this,te).sort=this.getVisibility("sort"),A(this,te).result=this.getVisibility("result"),A(this,te).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let n=r[i];return n===!1?!1:n===!0?!0:n.includes(this.currentMedia)}getVisibility(r){let i=A(this,ot)?.getCollectionOptions(this.collection?.variant)?.headerVisibility,n=this.parseVisibilityOptions(i,r);return n!==null?n:this.parseVisibilityOptions(al,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!A(this,te).search)return de;let r=mt(this,"searchText");return r?ve`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${r}"
                      .size=${ol[this.variant]}
                      aria-label="${r}"
                  ></sp-search>
              </merch-search>
          `:de}get filterAction(){return A(this,te).filter?this.sidenav?ve`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:de:de}get sortAction(){if(!A(this,te).sort)return de;let r=mt(this,"sortText");if(!r)return;let i=mt(this,"popularityText"),n=mt(this,"alphabeticallyText");if(!(i&&n))return;let a=this.collection?.sort===le.alphabetical;return ve`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${a?le.alphabetical:le.authored}"
              >
                  <span slot="label-only"
                      >${r}:
                      ${a?n:i}</span
                  >
                  <sp-menu-item value="${le.authored}"
                      >${i}</sp-menu-item
                  >
                  <sp-menu-item value="${le.alphabetical}"
                      >${n}</sp-menu-item
                  >
              </sp-action-menu>
          `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return il[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!A(this,te).result)return de;if(!this.sidenav)return de;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return ve`
            <div id="result" aria-live="polite" type=${r} quantity=${i}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!A(this,te).custom)return de;let r=A(this,ot)?.getCollectionOptions(this.collection?.variant)?.customHeaderArea;if(!r)return de;let i=r(this.collection);return!i||i===de?de:ve`<div id="custom" role="heading" aria-level="2">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{nl(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return ve`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};te=new WeakMap,ot=new WeakMap,g(Nt,"styles",po`
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
              --merch-card-collection-header-search-min-height: 44px;
              --merch-card-collection-header-filter-height: 44px;
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
              min-height: var(--merch-card-collection-header-search-min-height);
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
          @media screen and ${co(I)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort"
                                                        "result result result";
              }
          }

          /* Laptop */
          @media screen and ${co(L)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",Nt);export{nt as MerchCardCollection,Nt as default};

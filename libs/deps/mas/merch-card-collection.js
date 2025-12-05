var Gi=Object.defineProperty;var Vi=e=>{throw TypeError(e)};var Ao=(e,t,r)=>t in e?Gi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var So=(e,t)=>{for(var r in t)Gi(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>Ao(e,typeof t!="symbol"?t+"":t,r),yr=(e,t,r)=>t.has(e)||Vi("Cannot "+r);var A=(e,t,r)=>(yr(e,t,"read from private field"),r?r.call(e):t.get(e)),V=(e,t,r)=>t.has(e)?Vi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),q=(e,t,r,i)=>(yr(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),Bt=(e,t,r)=>(yr(e,t,"access private method"),r);import{html as ye,LitElement as ho,css as mo,unsafeCSS as po,nothing as pe}from"../lit-all.min.js";var G="(max-width: 767px)",j="(max-width: 1199px)",I="(min-width: 768px)",P="(min-width: 1200px)",re="(min-width: 1600px)",qi={matchMobile:window.matchMedia(G),matchDesktop:window.matchMedia(`${P} and (not ${re})`),matchDesktopOrUp:window.matchMedia(P),matchLargeDesktop:window.matchMedia(re),get isMobile(){return this.matchMobile.matches},get isDesktop(){return this.matchDesktop.matches},get isDesktopOrUp(){return this.matchDesktopOrUp.matches}},M=qi;function st(){return qi.isDesktop}var ct=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var ji="hashchange";function To(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[a,n=""]=i.split("=");a&&t.push([a,decodeURIComponent(n.replace(/\+/g," "))])}return Object.fromEntries(t)}function lt(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([a,n])=>{n?t.set(a,n):t.delete(a)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function Wi(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=To(window.location.hash);e(r)};return t(),window.addEventListener(ji,t),()=>{window.removeEventListener(ji,t)}}var jr={};So(jr,{CLASS_NAME_FAILED:()=>Lr,CLASS_NAME_HIDDEN:()=>Co,CLASS_NAME_PENDING:()=>kr,CLASS_NAME_RESOLVED:()=>Mr,CheckoutWorkflow:()=>$o,CheckoutWorkflowStep:()=>Q,Commitment:()=>Pe,ERROR_MESSAGE_BAD_REQUEST:()=>Rr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Fo,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Nr,EVENT_AEM_ERROR:()=>Cr,EVENT_AEM_LOAD:()=>_r,EVENT_MAS_ERROR:()=>Pr,EVENT_MAS_READY:()=>Bo,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>Do,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>wr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>ce,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>Sr,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>dt,EVENT_MERCH_CARD_COLLECTION_SORT:()=>Ar,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>Io,EVENT_MERCH_OFFER_READY:()=>ko,EVENT_MERCH_OFFER_SELECT_READY:()=>Mo,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>Le,EVENT_MERCH_SEARCH_CHANGE:()=>Ho,EVENT_MERCH_SIDENAV_SELECT:()=>Tr,EVENT_MERCH_STOCK_CHANGE:()=>No,EVENT_MERCH_STORAGE_CHANGE:()=>Oo,EVENT_OFFER_SELECTED:()=>Ro,EVENT_TYPE_FAILED:()=>Or,EVENT_TYPE_READY:()=>Ft,EVENT_TYPE_RESOLVED:()=>Ir,Env:()=>me,FF_DEFAULTS:()=>fe,HEADER_X_REQUEST_ID:()=>pt,LOG_NAMESPACE:()=>Dr,Landscape:()=>Ae,MARK_DURATION_SUFFIX:()=>Vr,MARK_START_SUFFIX:()=>Gr,MODAL_TYPE_3_IN_1:()=>ke,NAMESPACE:()=>_o,PARAM_AOS_API_KEY:()=>Uo,PARAM_ENV:()=>Br,PARAM_LANDSCAPE:()=>Fr,PARAM_MAS_PREVIEW:()=>Hr,PARAM_WCS_API_KEY:()=>zo,PROVIDER_ENVIRONMENT:()=>$r,SELECTOR_MAS_CHECKOUT_LINK:()=>Yi,SELECTOR_MAS_ELEMENT:()=>Er,SELECTOR_MAS_INLINE_PRICE:()=>K,SELECTOR_MAS_SP_BUTTON:()=>Lo,SELECTOR_MAS_UPT_LINK:()=>Xi,SORT_ORDER:()=>de,STATE_FAILED:()=>le,STATE_PENDING:()=>we,STATE_RESOLVED:()=>ue,SUPPORTED_COUNTRIES:()=>qr,TAG_NAME_SERVICE:()=>Po,TEMPLATE_PRICE:()=>Go,TEMPLATE_PRICE_ANNUAL:()=>qo,TEMPLATE_PRICE_LEGAL:()=>ht,TEMPLATE_PRICE_STRIKETHROUGH:()=>Vo,Term:()=>ne,WCS_PROD_URL:()=>Ur,WCS_STAGE_URL:()=>zr});var Pe=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),ne=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),_o="merch",Co="hidden",Ft="wcms:commerce:ready",Po="mas-commerce-service",K='span[is="inline-price"][data-wcs-osi]',Yi='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',Lo="sp-button[data-wcs-osi]",Xi='a[is="upt-link"]',Er=`${K},${Yi},${Xi}`,ko="merch-offer:ready",Mo="merch-offer-select:ready",wr="merch-card:action-menu-toggle",Ro="merch-offer:selected",No="merch-stock:change",Oo="merch-storage:change",Le="merch-quantity-selector:change",Io="merch-card-quantity:change",Do="merch-modal:addon-and-quantity-update",Ho="merch-search:change",Ar="merch-card-collection:sort",ce="merch-card-collection:literals-changed",dt="merch-card-collection:sidenav-attached",Sr="merch-card-collection:showmore",Tr="merch-sidenav:select",_r="aem:load",Cr="aem:error",Bo="mas:ready",Pr="mas:error",Lr="placeholder-failed",kr="placeholder-pending",Mr="placeholder-resolved",Rr="Bad WCS request",Nr="Commerce offer not found",Fo="Literals URL not provided",Or="mas:failed",Ir="mas:resolved",Dr="mas/commerce",Hr="mas.preview",Br="commerce.env",Fr="commerce.landscape",Uo="commerce.aosKey",zo="commerce.wcsKey",Ur="https://www.adobe.com/web_commerce_artifact",zr="https://www.stage.adobe.com/web_commerce_artifact_stage",le="failed",we="pending",ue="resolved",Ae={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},pt="X-Request-Id",Q=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),$o="UCv3",me=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),$r={PRODUCTION:"PRODUCTION"},ke={TWP:"twp",D2P:"d2p",CRM:"crm"},Gr=":start",Vr=":duration",Go="price",Vo="price-strikethrough",qo="annual",ht="legal",fe="mas-ff-defaults",de={alphabetical:"alphabetical",authored:"authored"},qr=["AE","AM","AR","AT","AU","AZ","BB","BD","BE","BG","BH","BO","BR","BS","BY","CA","CH","CL","CN","CO","CR","CY","CZ","DE","DK","DO","DZ","EC","EE","EG","ES","FI","FR","GB","GE","GH","GR","GT","HK","HN","HR","HU","ID","IE","IL","IN","IQ","IS","IT","JM","JO","JP","KE","KG","KR","KW","KZ","LA","LB","LK","LT","LU","LV","MA","MD","MO","MT","MU","MX","MY","NG","NI","NL","NO","NP","NZ","OM","PA","PE","PH","PK","PL","PR","PT","PY","QA","RO","RS","RU","SA","SE","SG","SI","SK","SV","TH","TJ","TM","TN","TR","TT","TW","TZ","UA","US","UY","UZ","VE","VN","YE","ZA"];var jo="mas-commerce-service";var mt=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Me(e,t={},r=null,i=null){let a=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?a.appendChild(r):a.innerHTML=r;for(let[n,s]of Object.entries(t))a.setAttribute(n,s);return a}function Ut(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Wr(){return window.matchMedia("(max-width: 1024px)").matches}function ut(){return document.getElementsByTagName(jo)?.[0]}function ft(e){let t=window.getComputedStyle(e);return e.offsetHeight+parseFloat(t.marginTop)+parseFloat(t.marginBottom)}import{html as zt,nothing as Wo}from"../lit-all.min.js";var $e,gt=class gt{constructor(t){g(this,"card");V(this,$e);this.card=t,this.insertVariantStyle()}getContainer(){return q(this,$e,A(this,$e)??this.card.closest('merch-card-collection, [class*="-merch-cards"]')??this.card.parentElement),A(this,$e)}insertVariantStyle(){if(!gt.styleMap[this.card.variant]){gt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,a=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),n=parseInt(this.getContainer().style.getPropertyValue(i))||0;a>n&&this.getContainer().style.setProperty(i,`${a}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),zt`
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
            >`:Wo}get secureLabelFooter(){return zt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}syncHeights(){}renderLayout(){}get aemFragmentMapping(){return $t(this.card.variant)}};$e=new WeakMap,g(gt,"styleMap",{});var N=gt;import{html as Yr,css as Yo}from"../lit-all.min.js";var Ki=`
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

@media screen and ${P} {
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
}`;var Qi={cardName:{attribute:"name"},badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},shortDescription:{tag:"div",slot:"action-menu-content",attributes:{tabindex:"0"}},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Ge=class extends N{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(wr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),r.stopPropagation(),this.setMenuVisibility(!this.isMenuOpen()))});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.setIconVisibility(!1),this.actionMenuContentSlot&&r?.type==="mouseleave"&&this.setMenuVisibility(!1)});g(this,"showActionMenuOnHover",()=>{this.actionMenu&&this.setIconVisibility(!0)});g(this,"hideActionMenu",()=>{this.setMenuVisibility(!1),this.setIconVisibility(!1)});g(this,"hideActionMenuOnBlur",r=>{r.relatedTarget===this.actionMenu||this.actionMenu?.contains(r.relatedTarget)||this.slottedContent?.contains(r.relatedTarget)||(this.isMenuOpen()&&this.setMenuVisibility(!1),this.card.contains(r.relatedTarget)||this.setIconVisibility(!1))});g(this,"handleCardFocusOut",r=>{r.relatedTarget===this.actionMenu||this.actionMenu?.contains(r.relatedTarget)||r.relatedTarget===this.card||(this.slottedContent&&(r.target===this.slottedContent||this.slottedContent.contains(r.target))&&(this.slottedContent.contains(r.relatedTarget)||this.setMenuVisibility(!1)),!this.card.contains(r.relatedTarget)&&!this.isMenuOpen()&&this.setIconVisibility(!1))});g(this,"handleKeyDown",r=>{(r.key==="Escape"||r.key==="Esc")&&(r.preventDefault(),this.hideActionMenu(),this.actionMenu?.focus())})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}get slottedContent(){return this.card.querySelector('[slot="action-menu-content"]')}setIconVisibility(r){Wr()&&this.card.actionMenu||(this.actionMenu?.classList.toggle("invisible",!r),this.actionMenu?.classList.toggle("always-visible",r))}setMenuVisibility(r){this.actionMenuContentSlot?.classList.toggle("hidden",!r),this.setAriaExpanded(this.actionMenu,r.toString()),r&&(this.dispatchActionMenuToggle(),setTimeout(()=>{let i=this.slottedContent?.querySelector("a");i&&i.focus()},0))}isMenuOpen(){return!this.actionMenuContentSlot?.classList.contains("hidden")}renderLayout(){return Yr` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Wr()&&this.card.actionMenu?"always-visible":"invisible"}"
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
                ${this.promoBottom?"":Yr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Yr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ki}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseenter",this.showActionMenuOnHover),this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusin",this.showActionMenuOnHover),this.card.addEventListener("focusout",this.handleCardFocusOut),this.card.addEventListener("keydown",this.handleKeyDown)}disconnectedCallbackHook(){this.card.removeEventListener("mouseenter",this.showActionMenuOnHover),this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusin",this.showActionMenuOnHover),this.card.removeEventListener("focusout",this.handleCardFocusOut),this.card.removeEventListener("keydown",this.handleKeyDown)}};g(Ge,"variantStyle",Yo`
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
    `);import{html as xt}from"../lit-all.min.js";var Zi=`
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

@media screen and ${P} {
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
`;var Gt=class extends N{constructor(t){super(t)}getGlobalCSS(){return Zi}renderLayout(){return xt`${this.cardImage}
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
          `}`}};import{html as ea}from"../lit-all.min.js";var Ji=`
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

@media screen and ${P} {
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
`;var Vt=class extends N{constructor(t){super(t)}getGlobalCSS(){return Ji}renderLayout(){return ea` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":ea`<hr />`} ${this.secureLabelFooter}`}};import{html as Ve,css as Xo,unsafeCSS as ra}from"../lit-all.min.js";var ta=`
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

@media screen and ${j} {
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
@media screen and ${P} {
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
`;var Ko=32,qe=class extends N{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Ve`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Ve`<slot name="secure-transaction-label"></slot>`;return Ve`<footer>${r}<slot name="footer"></slot></footer>`});this.updatePriceQuantity=this.updatePriceQuantity.bind(this)}connectedCallbackHook(){this.card.addEventListener(Le,this.updatePriceQuantity)}disconnectedCallbackHook(){this.card.removeEventListener(Le,this.updatePriceQuantity)}updatePriceQuantity({detail:r}){!this.mainPrice||!r?.option||(this.mainPrice.dataset.quantity=r.option)}getGlobalCSS(){return ta}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer"),this.card.shadowRoot.querySelector(".mini-compare-chart-badge")?.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,a)=>{let n=Math.max(Ko,parseFloat(window.getComputedStyle(i).height)||0),s=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;n>s&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${n}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let a=i.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${K}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,a=this.headingMPriceSlot;if(!i&&a){let n=r?.getAttribute("plan-type"),s=null;if(r&&n&&(s=r.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(o=>o.remove()),r.checked){if(s){let o=Me("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},s.innerHTML);this.card.appendChild(o)}}else{let o=Me("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,a=this.card.planType;if(i&&(await i.onceSettled(),a=i.value?.[0]?.planType),!a)return;r.planType=a,this.card.querySelector("merch-addon[plan-type]")?.updateComplete.then(()=>{this.updateCardElementMinHeight(this.card.shadowRoot.querySelector('slot[name="addon"]'),"addon")})}renderLayout(){return Ve` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Ve`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-xxs"></slot>
          <slot name="promo-text"></slot>
          <slot name="body-m"></slot>
          <slot name="offers"></slot>`:Ve`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>
          <slot name="body-xxs"></slot>
          <slot name="price-commitment"></slot>
          <slot name="offers"></slot>
          <slot name="promo-text"></slot>
          `}
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),M.isMobile?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(qe,"variantStyle",Xo`
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

    @media screen and ${ra(j)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ra(P)} {
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
  `);import{html as vt,css as Qo,nothing as qt}from"../lit-all.min.js";var ia=`
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

merch-card[variant^="plans"] merch-badge {
    max-width: calc(var(--consonant-merch-card-plans-width) * var(--merch-badge-card-size) - var(--merch-badge-with-offset) * 40px - var(--merch-badge-offset) * 48px);
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

    merch-card[variant^="plans"] merch-badge {
        max-width: calc(var(--consonant-merch-card-plans-width) - var(--merch-badge-with-offset) * 40px - var(--merch-badge-offset) * 48px);
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

@media screen and ${j} {
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
@media screen and ${P} {
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
`;var jt={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},aa={...function(){let{whatsIncluded:e,size:t,...r}=jt;return r}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},na={...function(){let{subtitle:e,whatsIncluded:t,size:r,quantitySelect:i,...a}=jt;return a}()},Z=class extends N{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===ht&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return ia}adjustSlotPlacement(t,r,i){let a=this.card.shadowRoot,n=a.querySelector("footer"),s=this.card.getAttribute("size");if(!s)return;let o=a.querySelector(`footer slot[name="${t}"]`),l=a.querySelector(`.body slot[name="${t}"]`),d=a.querySelector(".body");if(s.includes("wide")||(n?.classList.remove("wide-footer"),o&&o.remove()),!!r.includes(s)){if(n?.classList.toggle("wide-footer",M.isDesktopOrUp),!i&&o){if(l)o.remove();else{let c=d.querySelector(`[data-placeholder-for="${t}"]`);c?c.replaceWith(o):d.appendChild(o)}return}if(i&&l){let c=document.createElement("div");if(c.setAttribute("data-placeholder-for",t),c.classList.add("slot-placeholder"),!o){let p=l.cloneNode(!0);n.prepend(p)}l.replaceWith(c)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],M.isDesktopOrUp),this.adjustSlotPlacement("callout-content",["super-wide"],M.isDesktopOrUp)}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let r=this.card.querySelector('[slot="body-xs"]');if(!r)return;let i=r.querySelector("ul");if(!i)return;let a=i.previousElementSibling,n=document.createElement("div");n.classList.add("spacer"),r.insertBefore(n,a);let s=new IntersectionObserver(([o])=>{if(o.boundingClientRect.height===0)return;let l=0,d=this.card.querySelector('[slot="heading-s"]');d&&(l+=ft(d));let c=this.card.querySelector('[slot="subtitle"]');c&&(l+=ft(c));let p=this.card.querySelector('[slot="heading-m"]');p&&(l+=8+ft(p));for(let h of r.childNodes){if(h.classList.contains("spacer"))break;l+=ft(h)}let u=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");l>(parseFloat(u)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${l}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${l}px`),s.disconnect()});s.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.legalAdjusted||(await this.adjustLegal(),await this.adjustEduLists())}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${K}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?vt`<div class="divider"></div>`:qt}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=[],r=this.card.querySelector(`[slot="heading-m"] ${K}[data-template="price"]`);r&&t.push(r);let i=t.map(async a=>{let n=a.cloneNode(!0);await a.onceSettled(),a?.options&&(a.options.displayPerUnit&&(a.dataset.displayPerUnit="false"),a.options.displayTax&&(a.dataset.displayTax="false"),a.options.displayPlanType&&(a.dataset.displayPlanType="false"),n.setAttribute("data-template","legal"),a.parentNode.insertBefore(n,a.nextSibling),await n.onceSettled())});await Promise.all(i)}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?vt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:qt}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?qt:vt`<slot name="icons"></slot>`}connectedCallbackHook(){M.matchMobile.addEventListener("change",this.adaptForMedia),M.matchDesktopOrUp.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){M.matchMobile.removeEventListener("change",this.adaptForMedia),M.matchDesktopOrUp.removeEventListener("change",this.adaptForMedia)}renderLayout(){return vt` ${this.badge}
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
            <slot></slot>`}};g(Z,"variantStyle",Qo`
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
    `),g(Z,"collectionOptions",{customHeaderArea:t=>t.sidenav?vt`<slot name="resultsText"></slot>`:qt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]},onSidenavAttached:t=>{let r=()=>{let i=t.querySelectorAll("merch-card");for(let n of i)n.hasAttribute("data-size")&&(n.setAttribute("size",n.getAttribute("data-size")),n.removeAttribute("data-size"));if(!M.isDesktop)return;let a=0;for(let n of i){if(n.style.display==="none")continue;let s=n.getAttribute("size"),o=s==="wide"?2:s==="super-wide"?3:1;o===2&&a%3===2&&(n.setAttribute("data-size",s),n.removeAttribute("size"),o=1),a+=o}};M.matchDesktop.addEventListener("change",r),t.addEventListener(ce,r),t.onUnmount.push(()=>{M.matchDesktop.removeEventListener("change",r),t.removeEventListener(ce,r)})}});import{html as ge,css as Zo,unsafeCSS as sa,nothing as Wt}from"../lit-all.min.js";var oa=`

:root {
    --consonant-merch-card-plans-v2-font-family: 'Adobe Clean', sans-serif;
    --consonant-merch-card-plans-v2-width: 385px;
    --consonant-merch-card-plans-v2-height: auto;
    --consonant-merch-card-plans-v2-icon-size: 41.5px;
    --consonant-merch-card-plans-v2-border-color: #E9E9E9;
    --consonant-merch-card-plans-v2-border-radius: 16px;
    --picker-up-icon-black: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 10 10"><path d="M5 3L8 6L2 6Z" fill="%222222"/></svg>');
    --picker-down-icon-black: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="10" width="10" viewBox="0 0 10 10"><path d="M5 7L2 4L8 4Z" fill="%222222"/></svg>');
    --consonant-merch-spacing-m: 20px;

}

merch-card[variant="plans-v2"] {
    width: var(--consonant-merch-card-plans-v2-width);
    height: var(--consonant-merch-card-plans-v2-height);
    border: 1px solid var(--consonant-merch-card-border-color, var(--consonant-merch-card-plans-v2-border-color));
    border-radius: var(--consonant-merch-card-plans-v2-border-radius);
    background-color: var(--spectrum-gray-50, #FFFFFF);
    overflow: visible;
    position: relative;
    z-index: 1;
}

merch-card[variant="plans-v2"]:has(merch-quantity-select:not([closed])) {
    z-index: 100;
}

merch-card[variant="plans-v2"] .spacer {
    height: calc(var(--merch-card-plans-v2-max-offset) - var(--merch-card-plans-v2-offset));
}

.dark merch-card[variant="plans-v2"] {
    --consonant-merch-card-background-color: rgb(20, 24, 38);
    --consonant-merch-card-border-color: #3D3D3D;
    --spectrum-gray-800: rgb(242, 242, 242);
    --spectrum-gray-700: rgb(219, 219, 219);
    background-color: var(--consonant-merch-card-background-color);
}

/* Keep "What you get" section white in dark mode */
.dark merch-card[variant="plans-v2"] merch-whats-included {
    background-color: #FFFFFF;
}

.dark merch-card[variant="plans-v2"] merch-whats-included h4,
.dark merch-card[variant="plans-v2"] merch-whats-included ul li {
    color: #292929;
}

/* Dark mode heading colors for wide cards */
.dark merch-card[variant="plans-v2"][size="wide"] [slot^="heading-"],
.dark merch-card[variant="plans-v2"][size="wide"] span[class^="heading-"] {
    color: #B6B6B6;
}

/* Dark mode strikethrough price size for wide cards */
.dark merch-card[variant="plans-v2"][size="wide"] [slot="heading-m"] span.price.price-strikethrough,
.dark merch-card[variant="plans-v2"][size="wide"] [slot="heading-m"] s {
    font-size: 20px;
}

merch-card[variant="plans-v2"][size="wide"],
merch-card[variant="plans-v2"][size="super-wide"] {
    width: 100%;
    max-width: 768px;
}

merch-card[variant="plans-v2"] [slot="icons"] {
    --img-width: var(--consonant-merch-card-plans-v2-icon-size);
    --img-height: var(--consonant-merch-card-plans-v2-icon-size);
}

merch-card[variant="plans-v2"] span.price-unit-type {
    display: inline;
    color: #6B6B6B;
    font-size: 28px;
    font-weight: 900;
    line-height: 110%;
}

merch-card[variant="plans-v2"] .price-unit-type:not(.disabled)::before {
    content: '';
}

merch-card[variant="plans-v2"] .price-unit-type.disabled,
merch-card[variant="plans-v2"] .price-tax-inclusivity.disabled {
    display: none !important;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-unit-type.disabled,
merch-card[variant="plans-v2"] [slot="heading-m"] .price-tax-inclusivity.disabled {
    display: none !important;
}

merch-card[variant="plans-v2"] s .price-unit-type.disabled,
merch-card[variant="plans-v2"] s .price-tax-inclusivity.disabled,
merch-card[variant="plans-v2"] .price-strikethrough .price-unit-type.disabled,
merch-card[variant="plans-v2"] .price-strikethrough .price-tax-inclusivity.disabled {
    display: none !important;
}

merch-card[variant="plans-v2"] [slot="description"] {
    min-height: auto;
}

merch-card[variant="plans-v2"] [slot="description"] {
    min-height: auto;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] {}

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
    padding: 9px 18px 10px 18px;
}

merch-card[variant="plans-v2"] [slot="icons"] img {
    width: var(--consonant-merch-card-plans-v2-icon-size);
    height: var(--consonant-merch-card-plans-v2-icon-size);
}

merch-card[variant="plans-v2"] [slot="heading-xs"] {
    font-size: 32px;
    font-weight: 900;
    font-family: var(--consonant-merch-card-plans-v2-font-family);
    line-height: 1.1;
    color: var(--spectrum-gray-800, #2C2C2C);
}

/* Mobile-specific heading-xs styles */
@media ${G} {
    merch-card[variant="plans-v2"] [slot="heading-xs"] {
        font-size: 28px;
        font-weight: 800;
        line-height: 125%;
        letter-spacing: -0.02em;
        vertical-align: middle;
    }
    merch-card[variant="plans-v2"][size="wide"] [slot="heading-xs"] {
        font-size: 16px;
    }
}

/* Subtitle styling for regular cards */
merch-card[variant="plans-v2"] [slot="subtitle"] {
    font-size: 18px;
    font-weight: 700;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--spectrum-gray-800, #2C2C2C);
    line-height: 23px;
}

/* Wide card override */
merch-card[variant="plans-v2"][size="wide"] [slot="subtitle"] {
    font-family: var(--consonant-merch-card-plans-v2-font-family);
    font-size: 52px;
    font-weight: 900;
    line-height: 1.1;
}

/* Mobile-specific wide card subtitle styles */
@media ${G} {
    merch-card[variant="plans-v2"][size="wide"] [slot="subtitle"] {
        font-size: 28px;
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: 0px;
    }
}

merch-card[variant="plans-v2"] [slot="heading-m"] {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 8px;
    color: inherit;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-wrapper {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

merch-card[variant="plans-v2"] [slot="heading-m"] span.price, merch-card[variant="plans-v2"] [slot="heading-m"] p {
    font-size: 28px;
    font-weight: 900;
    font-family: var(--consonant-merch-card-plans-v2-font-family);
    color: var(--spectrum-gray-800, #2C2C2C);
    line-height: 1.1;
}

merch-card[variant="plans-v2"] [slot="heading-m"] span.price.price-strikethrough,
merch-card[variant="plans-v2"] [slot="heading-m"] s {
    font-family: 'Adobe Clean', sans-serif;
    font-size: 18px;
    font-weight: 400;
    color: #6B6B6B;
    text-decoration: line-through;
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
    line-height: 1.4;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-recurrence:not(.disabled)::after,
merch-card[variant="plans-v2"] [slot="heading-m"] span[data-template="recurrence"]:not(.disabled)::after {
    content: ' ';
    white-space: pre;
}

merch-card[variant="plans-v2"] [slot="heading-m"] .price-plan-type,
merch-card[variant="plans-v2"] [slot="heading-m"] span[data-template="planType"] {
    display: block;
    text-transform: capitalize;
    color: var(--spectrum-gray-700, #505050);
    font-size: 16px;
    font-weight: 400;
    font-family: 'Adobe Clean', sans-serif;
    line-height: 1.4;
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
    color: var(--spectrum-gray-700, #505050);
    line-height: 1.4;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] {
    margin-bottom: 16px;
}

merch-card[variant="plans-v2"] [slot="quantity-select"] label {
    display: block;
    font-size: 12px;
    font-weight: 400;
    color: #464646;
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card[variant="plans-v2"] [slot="quantity-select"] merch-quantity-select {
    --qs-input-height: 32px;
    --qs-button-width: 18px;
    --qs-font-size: 14px;
    --border-color: #909090;
    --border-width: 1px;
    --background-color: #FDFDFD;
    --qs-label-font-size: 12px;
    --qs-label-color: #464646;
    --radius: 4px;
    --button-width: 29px;
    --qs-input-width: 59px;
    --picker-button-border-left: none;
    --label-color: var(--spectrum-gray-700, #4B4B4B);
}

merch-card[variant="plans-v2"] [slot="quantity-select"] merch-quantity-select .item.highlighted {
    background-color: #F6F6F6;
}

merch-card[variant="plans-v2"] [slot="footer"] {}

merch-card[variant="plans-v2"] [slot="footer"] a {
    width: auto;
    min-width: fit-content;
    text-align: center;
    padding: 5px 18px 6px 18px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    text-decoration: none;
    transition: all 0.2s ease-in-out;
}
    background-color: #3B63FB;
    color: #FFFFFF;
    border: 2px solid #3B63FB;
    border-radius: 20px;
    display: inline-flex;
    max-width: fit-content;
merch-card[variant="plans-v2"] [slot="footer"] a.con-button.blue {
    background-color: #1473E6;
    color: #FFFFFF;
    border: 2px solid #1473E6;
    border-radius: 20px;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.blue:hover {
    background-color: #0D66D0;
    border-color: #0D66D0;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.outline {
    background-color: transparent;
    color: #1473E6;
    border: 2px solid #1473E6;
}

merch-card[variant="plans-v2"] [slot="footer"] a.con-button.outline:hover {
    background-color: #F5F5F5;
}


merch-card[variant="plans-v2"] h4 {
    font-size: 18px;
    font-weight: 700;
    font-family: 'Adobe Clean', sans-serif;
    color: var(--spectrum-gray-800, #292929);
    line-height: 22px;
    margin: 0 0 16px 0;
    align-self: flex-start;  /* Explicit alignment for consistent positioning */
}

/* Ensure merch-whats-included container is properly aligned */
merch-card[variant="plans-v2"] merch-whats-included {
    background-color: #FFFFFF;
    align-self: stretch;  /* Full width alignment */
}

merch-card[variant="plans-v2"] ul {
    padding: 0;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: var(--consonant-merch-spacing-xxs);
}

merch-card[variant="plans-v2"] ul li {
    font-family: 'Adobe Clean', sans-serif;
    color: #292929;
    line-height: 140%;
    display: inline-flex;
    list-style: none;
    padding: var(--consonant-merch-spacing-xxs) 0;
}

merch-card[variant="plans-v2"] ul li::before {
    display: inline-block;
    content: var(--list-checked-icon);
    margin-right: var(--consonant-merch-spacing-xxs);
    vertical-align: middle;
    flex-shrink: 0;
}

merch-card[variant="plans-v2"] .help-text {
    font-size: 12px;
    font-weight: 400;
    color: var(--spectrum-gray-600, #6E6E6E);
    line-height: 1.5;
    margin-top: var(--consonant-merch-spacing-xxs);
}

@media screen and ${G}, ${j} {
    :root {
        --consonant-merch-card-plans-v2-width: 100%;
    }
    merch-card[variant="plans-v2"] {
        width: 100%;
        max-width: var(--consonant-merch-card-plans-v2-width);
        box-sizing: border-box;
    }
}

@media screen and ${I}, ${P}, ${re} {
    :root {
        --consonant-merch-card-plans-v2-width: 385px;
    }
}

.collection-container.plans {
    --merch-card-collection-card-min-height: 273px;
    --merch-card-collection-card-width: var(--consonant-merch-card-plans-v2-width);
    grid-template-columns: auto;
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
    --merch-card-collection-card-width: 100%;
    display: grid;
    grid-auto-rows: 1fr;
    align-items: stretch;
}

merch-card-collection.plans merch-card {
    width: auto;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr auto;
}

merch-card-collection.plans merch-card[has-short-description] {
    grid-template-rows: min-content min-content auto;
}

merch-card-collection.plans merch-card[variant="plans-v2"] {
    height: 100%;
    align-self: stretch;
}

merch-card-collection.plans merch-card[variant="plans-v2"] .heading-wrapper {
    align-items: center;
    gap: 12px;
    overflow: visible;
}

merch-card-collection.plans merch-card[variant="plans-v2"] [slot="icons"] {
    align-items: center;
}

merch-card-collection.plans merch-card[variant="plans-v2"] [slot="heading-xs"] {}

merch-card-collection.plans merch-card[variant="plans-v2"] aem-fragment + [slot^="heading-"] {
    margin-top: calc(40px + var(--consonant-merch-spacing-xxs));
}

merch-card-collection:has([slot="subtitle"]) merch-card[variant="plans-v2"] {}

merch-card[variant="plans-v2"][size="wide"] {
    width: 100%;
    max-width: 635px;
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

merch-card[variant="plans-v2"][size="wide"] [slot="heading-m"] .price-plan-type,
merch-card[variant="plans-v2"][size="wide"] [slot="heading-m"] span[data-template="planType"] {
    font-style: italic;
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

    merch-card[variant="plans-v2"] .spacer {
        display: none;
    }

    merch-card-collection.merch-card-collection.plans {
        grid-auto-rows: auto;
    }

    .one-merch-card.plans,
    .two-merch-cards.plans,
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        --merch-card-collection-card-width: unset !important;
    }
}

/* Tablet */
@media screen and ${I} {
    :root {
        --consonant-merch-card-plans-v2-width: 360px;
    }
    .four-merch-cards.plans-v2 .foreground {
        max-width: unset;
    }
    .two-merch-cards, .three-merch-cards, .four-merch-cards {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-v2-width));
    }
    merch-card[variant="plans-v2"][size="wide"], merch-card[variant="plans-v2"][size="super-wide"]{
      padding: 55px 47px;
    }
}

/* Desktop */
@media screen and ${P} {
    :root {
        --consonant-merch-card-plans-v2-width: 385px;
    }

    merch-sidenav.plans-v2 {
        --merch-sidenav-collection-gap: 30px;
    }

    .three-merch-cards, .four-merch-cards.plans {
        grid-template-columns: repeat(3, var(--consonant-merch-card-plans-v2-width));
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
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-v2-width));
    }

    merch-sidenav.plans-v2 {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var ca={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},shortDescription:{tag:"p",slot:"short-description"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-red-700-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans","spectrum-red-700-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans","spectrum-red-700-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},Se=class extends N{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this),this.toggleShortDescription=this.toggleShortDescription.bind(this),this.shortDescriptionExpanded=!1,this.syncScheduled=!1}priceOptionsProvider(t,r){if(t.dataset.template===ht){r.displayPlanType=this.card?.settings?.displayPlanType??!1;return}(t.dataset.template==="strikethrough"||t.dataset.template==="price")&&(r.displayPerUnit=!1)}getGlobalCSS(){return oa}adjustSlotPlacement(t,r,i){let{shadowRoot:a}=this.card,n=a.querySelector("footer"),s=a.querySelector(".body"),o=this.card.getAttribute("size");if(!o)return;let l=a.querySelector(`footer slot[name="${t}"]`),d=a.querySelector(`.body slot[name="${t}"]`);if(o.includes("wide")||(n?.classList.remove("wide-footer"),l?.remove()),!!r.includes(o)){if(n?.classList.toggle("wide-footer",M.isDesktopOrUp),!i&&l){if(d)l.remove();else{let c=s.querySelector(`[data-placeholder-for="${t}"]`);c?c.replaceWith(l):s.appendChild(l)}return}if(i&&d){let c=document.createElement("div");c.setAttribute("data-placeholder-for",t),c.classList.add("slot-placeholder"),l||n.prepend(d.cloneNode(!0)),d.replaceWith(c)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards,.columns"))return this.card.hasAttribute("size"),void 0;this.adjustSlotPlacement("heading-m",["wide"],!0),this.adjustSlotPlacement("addon",["super-wide"],M.isDesktopOrUp),this.adjustSlotPlacement("callout-content",["super-wide"],M.isDesktopOrUp)}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');if(!t?.title)return;t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip");let r=i=>{i===t?t.classList.toggle("hide-tooltip"):t.classList.add("hide-tooltip")};document.addEventListener("touchstart",i=>{i.preventDefault(),r(i.target)}),document.addEventListener("mouseover",i=>{i.preventDefault(),i.target!==t?t.classList.add("hide-tooltip"):t.classList.remove("hide-tooltip")})}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.updateShortDescriptionVisibility(),this.hasShortDescription?this.card.setAttribute("has-short-description",""):this.card.removeAttribute("has-short-description"),this.legalAdjusted||await this.adjustLegal(),this.card.isConnected&&(await this.card.updateComplete,await Promise.all(this.card.prices.map(t=>t.onceSettled())),window.matchMedia("(min-width: 768px)").matches&&(this.syncScheduled||(this.syncScheduled=!0,requestAnimationFrame(()=>{this.syncScheduled=!1,this.syncHeights()}))))}get mainPrice(){return this.card.querySelector(`[slot="heading-m"] ${K}[data-template="price"]`)}groupCardsByRow(t){let r=[],i=t.map(s=>({card:s,top:s.getBoundingClientRect().top}));i.sort((s,o)=>s.top-o.top);let a=[],n=null;return i.forEach(({card:s,top:o})=>{n===null||Math.abs(o-n)<5?(a.push(s),n=o):(a.length>0&&r.push(a),a=[s],n=o)}),a.length>0&&r.push(a),r}syncHeights(){let t=this.getContainer();if(!t||t.__plans_v2_syncing)return;t.__plans_v2_syncing=!0;let r=Array.from(t.querySelectorAll('merch-card[variant="plans-v2"]'));if(r.length===0){t.__plans_v2_syncing=!1;return}let i=this.groupCardsByRow(r);r.forEach(a=>{a.style.removeProperty("--consonant-merch-card-plans-v2-body-height"),a.style.removeProperty("--consonant-merch-card-plans-v2-footer-height"),a.style.removeProperty("--consonant-merch-card-plans-v2-short-description-height")}),document.body.offsetHeight,i.forEach(a=>{let n=a.filter(c=>c.querySelector('[slot="quantity-select"]')),o=(n.length>0?n:a).map(c=>{let p=c.shadowRoot?.querySelector(".body");return p?p.clientHeight:0}).filter(c=>c>0),l=a.map(c=>{let p=c.shadowRoot?.querySelector("footer");return p&&parseInt(window.getComputedStyle(p).height)||0}).filter(c=>c>0),d=a.map(c=>{let p=c.querySelector('[slot="short-description"]');return p&&parseInt(window.getComputedStyle(p).height)||0}).filter(c=>c>0);if(o.length>0){let c=Math.max(...o);a.forEach(p=>{p.style.setProperty("--consonant-merch-card-plans-v2-body-height",`${c}px`)})}if(l.length>0){let c=Math.max(...l);a.forEach(p=>{p.style.setProperty("--consonant-merch-card-plans-v2-footer-height",`${c}px`)})}if(d.length>0){let c=Math.max(...d);a.forEach(p=>{p.style.setProperty("--consonant-merch-card-plans-v2-short-description-height",`${c}px`)})}}),setTimeout(()=>{t.__plans_v2_syncing=!1},100)}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=this.mainPrice;if(!t)return;let r=t.cloneNode(!0);if(await t.onceSettled(),!t?.options)return;t.options.displayPerUnit&&(t.dataset.displayPerUnit="false"),t.options.displayTax&&(t.dataset.displayTax="false"),t.options.displayPlanType&&(t.dataset.displayPlanType="false"),r.setAttribute("data-template","legal"),t.parentNode.insertBefore(r,t.nextSibling),await r.onceSettled()}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?ge`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Wt}get hasShortDescription(){return!!this.card.querySelector('[slot="short-description"]')}get shortDescriptionLabel(){let t=this.card.querySelector('[slot="short-description"]'),r=t.querySelector("strong, b");if(r?.textContent?.trim())return r.textContent.trim();let i=t.querySelector("h1, h2, h3, h4, h5, h6, p");return i?.textContent?.trim()?i.textContent.trim():t.textContent?.trim().split(`
`)[0].trim()}updateShortDescriptionVisibility(){let t=this.card.querySelector('[slot="short-description"]');if(!t)return;let r=t.querySelector("strong, b, p");r&&(M.isMobile?r.style.display="none":r.style.display="")}toggleShortDescription(){this.shortDescriptionExpanded=!this.shortDescriptionExpanded,this.card.requestUpdate()}get shortDescriptionToggle(){return this.hasShortDescription?M.isMobile?ge`
            <div class="short-description-divider"></div>
            <div class="short-description-toggle ${this.shortDescriptionExpanded?"expanded":""}" @click=${this.toggleShortDescription}>
                <span class="toggle-label">${this.shortDescriptionLabel}</span>
                <span class="toggle-icon ${this.shortDescriptionExpanded?"expanded":""}"></span>
            </div>
            <div class="short-description-content ${this.shortDescriptionExpanded?"expanded":""}">
                <slot name="short-description"></slot>
            </div>
        `:ge`
                <div class="short-description-content desktop">
                    <slot name="short-description"></slot>
                </div>
            `:Wt}get icons(){return this.card.querySelector('[slot="icons"]')||this.card.getAttribute("id")?ge`<slot name="icons"></slot>`:Wt}get secureLabelFooter(){return ge`<footer>${this.secureLabel}<slot name="quantity-select"></slot><slot name="footer"></slot></footer>`}connectedCallbackHook(){this.handleMediaChange=()=>{this.adaptForMedia(),this.updateShortDescriptionVisibility(),this.card.requestUpdate(),window.matchMedia("(min-width: 768px)").matches&&requestAnimationFrame(()=>{this.syncHeights()})},M.matchMobile.addEventListener("change",this.handleMediaChange),M.matchDesktopOrUp.addEventListener("change",this.handleMediaChange)}disconnectedCallbackHook(){M.matchMobile.removeEventListener("change",this.handleMediaChange),M.matchDesktopOrUp.removeEventListener("change",this.handleMediaChange)}renderLayout(){let r=this.card.getAttribute("size")==="wide";return ge` ${this.badge}
            <div class="body">
                ${r?ge`
                    <div class="heading-wrapper wide">
                        ${this.icons}
                        <slot name="heading-xs"></slot>
                    </div>
                    <slot name="subtitle"></slot>
                    <slot name="body-xs"></slot>
                    ${this.stockCheckbox}
                    <slot name="addon"></slot>
                    <slot name="badge"></slot>
                    <div class="price-divider"></div>
                    <slot name="heading-m"></slot>
                `:ge`
                    <div class="heading-wrapper">
                        ${this.icons}
                        <div class="heading-xs-wrapper">
                          <slot name="heading-xs"></slot>
                          <slot name="subtitle"></slot>
                        </div>
                    </div>
                    <slot name="heading-m"></slot>
                    <slot name="body-xs"></slot>
                    ${this.stockCheckbox}
                    <slot name="addon"></slot>
                    <slot name="badge"></slot>
                `}
            </div>
            ${this.secureLabelFooter}
            ${this.shortDescriptionToggle}
            <slot></slot>`}};g(Se,"variantStyle",Zo`
        :host([variant='plans-v2']) {
            display: flex;
            flex-direction: column;
            min-height: 273px;
            position: relative;
            background-color: var(--spectrum-gray-50, #FFFFFF);
            border-radius: var(--consonant-merch-card-plans-v2-border-radius, 8px);
            overflow: hidden;
            font-weight: 400;
            box-sizing: border-box;
            --consonant-merch-card-plans-v2-font-family: 'adobe-clean-display', 'Adobe Clean', sans-serif;
            --merch-card-plans-v2-min-width: 244px;
            --merch-card-plans-v2-padding: 24px 24px;
            --merch-color-green-promo: #05834E;
            --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
            --list-checked-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' width='20' height='20'%3E%3Cpath fill='%23222222' d='M15.656,3.8625l-.7275-.5665a.5.5,0,0,0-.7.0875L7.411,12.1415,4.0875,8.8355a.5.5,0,0,0-.707,0L2.718,9.5a.5.5,0,0,0,0,.707l4.463,4.45a.5.5,0,0,0,.75-.0465L15.7435,4.564A.5.5,0,0,0,15.656,3.8625Z'%3E%3C/path%3E%3C/svg%3E");
        }

        :host([variant='plans-v2']) .slot-placeholder {
            display: none;
        }

        :host([variant='plans-v2']) .body {
          --merch-card-plans-v2-body-min-height: calc( var(--consonant-merch-card-plans-v2-body-height, 0px) - (24px) );
            display: flex;
            flex-direction: column;
            min-width: var(--merch-card-plans-v2-min-width);
            padding: var(--merch-card-plans-v2-padding);
            padding-bottom: 0;
            flex: 0 0 auto;
            gap: 12px;
            min-height: var(--merch-card-plans-v2-body-min-height, auto);
        }

        :host([variant='plans-v2'][size]) .body {
            max-width: none;
        }

        :host([variant='plans-v2']) footer {
            padding: var(--merch-card-plans-v2-padding);
            min-height: var(--consonant-merch-card-plans-v2-footer-height, auto);
            flex-direction: column;
            align-items: flex-start;
        }

        :host([variant='plans-v2']) slot[name="subtitle"] {
            display: var(--merch-card-plans-v2-subtitle-display);
            min-height: 18px;
            margin-top: 4px;
            margin-bottom: -8px;
        }

        :host([variant='plans-v2']) ::slotted([slot='subtitle']) {
            font-size: 14px;
            font-weight: 400;
            color: var(--spectrum-gray-700, #505050);
            line-height: 1.4;
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-xs']) {
            font-size: 32px;
            font-weight: 900;
            font-family: var(--consonant-merch-card-plans-v2-font-family, 'Adobe Clean Display', sans-serif);
            line-height: 1.2;
            color: var(--spectrum-gray-800, #2C2C2C);
            margin: 0 0 16px 0;
            min-height: var(--merch-card-plans-v2-heading-min-height);
            max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
        }

        :host([variant='plans-v2']) slot[name='icons'] {
            gap: 3.5px;
            mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.6) 37.5%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 62.5%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.03) 87.5%, rgba(0, 0, 0, 0) 100%);
            -webkit-mask-image: linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 12.5%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.6) 37.5%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 62.5%, rgba(0, 0, 0, 0.05) 75%, rgba(0, 0, 0, 0.03) 87.5%, rgba(0, 0, 0, 0) 100%);
        }

        :host([variant='plans-v2']) ::slotted([slot='icons']) {
            display: flex;
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-m']) {
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 800;
            font-family: var(--consonant-merch-card-plans-v2-font-family, 'Adobe Clean Display', sans-serif);
            line-height: 1.15;
            color: var(--spectrum-gray-800, #2C2C2C);
        }

        :host([variant='plans-v2']) ::slotted([slot='heading-m']) span[data-template="legal"] {
            font-size: 20px;
            color: var(--spectrum-gray-700, #6B6B6B);
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
            font-family: 'Adobe Clean', sans-serif;
            color: var(--spectrum-gray-700, #505050);
            line-height: 1.4;
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) ::slotted([slot='quantity-select']) {
            margin: 0 0 16px 0;
        }

        :host([variant='plans-v2']) .spacer {
            flex: 1 1 auto;
        }

        :host([variant='plans-v2']) ::slotted([slot='whats-included']) {
            padding-top: 24px;
            padding-bottom: 24px;
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
            background-color: #FFFFFF;
            transition: background-color 0.2s ease;
            border-bottom-left-radius: var(--consonant-merch-card-plans-v2-border-radius);
            border-bottom-right-radius: var(--consonant-merch-card-plans-v2-border-radius);
        }

        :host([variant='plans-v2']) .short-description-toggle:not(.expanded) {
            background-color: #F8F8F8;
        }

        :host([variant='plans-v2']) .short-description-toggle .toggle-label {
            font-size: 18px;
            font-weight: 700;
            font-family: 'Adobe Clean', sans-serif;
            color: #292929;
            text-align: left;
            flex: 1;
            line-height: 22px;
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
            background-color: #FFFFFF;
        }

        :host([variant='plans-v2']) .short-description-content.expanded {
            max-height: 500px;
            padding: 24px 32px;
            background-color: #FFFFFF;
            border-bottom-right-radius: 16px;
            border-bottom-left-radius: 16px;
        }

        :host([variant='plans-v2']) .short-description-content.desktop {
            max-height: none;
            overflow: visible;
            padding: 26px 24px;
            transition: none;
            border-top: 1px solid #E9E9E9;
            min-height: var(--consonant-merch-card-plans-v2-short-description-height, auto);
            background-color: #FFFFFF;
            border-bottom-left-radius: var(--consonant-merch-card-plans-v2-border-radius);
            border-bottom-right-radius: var(--consonant-merch-card-plans-v2-border-radius);
        }

        :host([variant='plans-v2']) .short-description-content ::slotted([slot='short-description']) {
            font-size: 16px;
            font-weight: 400;
            font-family: 'Adobe Clean', sans-serif;
            color: #292929;
            line-height: 1.4;
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
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.16));
        }

        :host([variant='plans-v2']) ::slotted([slot='badge'].spectrum-red-700-plans) {
            filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.16));
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
            gap: 12px;
        }

        :host([variant='plans-v2'][size='wide']) {
            width: 100%;
            max-width: 768px;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper.wide {
            flex-direction: row;
            align-items: center;
            gap: 8px;
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper.wide slot[name='icons'] {
            margin-bottom: 0;
            mask-image: none;
            -webkit-mask-image: none;
            flex-shrink: 0;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper.wide ::slotted([slot='icons']) {
            margin-bottom: 0;
        }

        :host([variant='plans-v2'][size='wide']) .heading-wrapper.wide ::slotted([slot='heading-xs']) {
            margin: 0;
            font-size: 27px;
            font-weight: 800;
            line-height: 1.25;
            white-space: nowrap;
        }

        :host([variant='plans-v2'][size='wide']) slot[name='subtitle'] {
            display: block;
            margin-top: 0;
            margin-bottom: 12px;
        }

        :host([variant='plans-v2'][size='wide']) ::slotted([slot='subtitle']) {
            font-family: var(--consonant-merch-card-plans-v2-font-family, 'Adobe Clean Display', 'Adobe Clean', sans-serif);
            font-size: 52px;
            font-weight: 900;
            line-height: 1.1;
            color: var(--spectrum-gray-800, #2C2C2C);
        }

        :host([variant='plans-v2'][size='wide']) .price-divider {
            display: block;
            height: 4px;
            background-color: #E8E8E8;
            margin: 24px 0;
            width: 100%;
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

        @media ${sa(G)}, ${sa(j)} {
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

            :host([variant='plans-v2'][size='wide']) .body {
                padding: 16px;
            }
        }

        /* Keep short-description section white in dark mode */
        :host-context(.dark) :host([variant='plans-v2']) .short-description-content {
            background-color: #FFFFFF;
            border-bottom-left-radius: var(--consonant-merch-card-plans-v2-border-radius);
            border-bottom-right-radius: var(--consonant-merch-card-plans-v2-border-radius);
        }

        :host-context(.dark) :host([variant='plans-v2']) .short-description-content ::slotted([slot='short-description']) {
            color: #292929;
        }

        :host-context(.dark) :host([variant='plans-v2']) .short-description-toggle {
            background-color: #FFFFFF;
        }

        :host-context(.dark) :host([variant='plans-v2']) .short-description-toggle .toggle-label {
            color: #292929;
        }
    `),g(Se,"collectionOptions",{customHeaderArea:t=>t.sidenav?ge`<slot name="resultsText"></slot>`:Wt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]},onSidenavAttached:t=>{let r=()=>{let i=t.querySelectorAll("merch-card");if(i.forEach(n=>{n.hasAttribute("data-size")&&(n.setAttribute("size",n.getAttribute("data-size")),n.removeAttribute("data-size"))}),!M.isDesktop)return;let a=0;i.forEach(n=>{if(n.style.display==="none")return;let s=n.getAttribute("size"),o=s==="wide"?2:s==="super-wide"?3:1;o===2&&a%3===2&&(n.setAttribute("data-size",s),n.removeAttribute("size"),o=1),a+=o})};M.matchDesktop.addEventListener("change",r),t.addEventListener(ce,r),t.onUnmount.push(()=>{M.matchDesktop.removeEventListener("change",r),t.removeEventListener(ce,r)})}});import{html as Xr,css as Jo}from"../lit-all.min.js";var la=`
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
@media screen and ${P} {
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
`;var je=class extends N{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this),this.updatePriceQuantity=this.updatePriceQuantity.bind(this)}getGlobalCSS(){return la}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Xr` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Xr`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Xr`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook),this.card.addEventListener(Le,this.updatePriceQuantity)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook),this.card.removeEventListener(Le,this.updatePriceQuantity)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),M.isMobile||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${K}[data-template="price"]`)}updatePriceQuantity({detail:t}){!this.mainPrice||!t?.option||(this.mainPrice.dataset.quantity=t.option)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let a=t?.getAttribute("plan-type"),n=null;if(t&&a&&(n=t.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(s=>s.remove()),t.checked){if(n){let s=Me("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},n.innerHTML);this.card.appendChild(s)}}else{let s=Me("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g(je,"variantStyle",Jo`
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
    `);import{html as Kr,css as es}from"../lit-all.min.js";var da=`
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
@media screen and ${P} {
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
`;var We=class extends N{constructor(t){super(t)}getGlobalCSS(){return da}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Kr` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Kr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Kr`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g(We,"variantStyle",es`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Qr,css as ts}from"../lit-all.min.js";var pa=`
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
@media screen and ${P} {
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
`;var ha={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Ye=class extends N{constructor(t){super(t)}getGlobalCSS(){return pa}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Qr`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Qr`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Qr`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Ye,"variantStyle",ts`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as rs,css as is}from"../lit-all.min.js";var ma=`
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
@media screen and ${P} {
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
@media screen and ${j} {
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
@media screen and ${I} and ${j} {
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
`;var Zr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"XL"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:["badgeColor","badgeBorderColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},Xe=class extends N{getGlobalCSS(){return ma}get aemFragmentMapping(){return Zr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="body-xs"]');t&&this.updateCardElementMinHeight(t,"description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,this.card.prices?.length&&await Promise.all(this.card.prices.map(t=>t.onceSettled?.())),st())){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-description-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(n=>n.variantLayout?.syncHeights?.())})}}connectedCallbackHook(){!this.card||this.card.failed||(this.setupAccordion(),this.card?.hasAttribute("data-default-card")&&!st()&&this.card.setAttribute("data-expanded","true"))}setupAccordion(){let t=this.card;if(!t)return;let r=()=>{if(st())t.removeAttribute("data-expanded");else{let a=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",a?"true":"false")}};r();let i=window.matchMedia(j);this.mediaQueryListener=()=>{r()},i.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia(j).removeEventListener("change",this.mediaQueryListener)}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||st())return;let n=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",n)}renderLayout(){return rs`
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
        `}};g(Xe,"variantStyle",is`
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
    `);import{html as as,css as ns}from"../lit-all.min.js";var ua=`
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
@media screen and ${P} and (max-width: 1399px) {
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
`;var Jr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-s",maxCount:2e3,withSuffix:!1},shortDescription:{tag:"div",slot:"short-description",maxCount:3e3,withSuffix:!1},prices:{tag:"div",slot:"price"},trialBadge:{tag:"div",slot:"trial-badge"},ctas:{slot:"cta",size:"XL"},mnemonics:{size:"l"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:[]},Ke=class extends N{getGlobalCSS(){return ua}get aemFragmentMapping(){return Jr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width<=2)return;let t=this.card.querySelector('[slot="short-description"]');t&&this.updateCardElementMinHeight(t,"short-description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price");let i=this.card.querySelector('[slot="cta"]');i&&this.updateCardElementMinHeight(i,"cta")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,await Promise.all(this.card.prices.map(t=>t.onceSettled())),window.matchMedia("(min-width: 1025px)").matches)){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-price-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(n=>n.variantLayout?.syncHeights?.())})}}renderLayout(){return as`
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
        `}};g(Ke,"variantStyle",ns`
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
    `);import{css as os,html as ss}from"../lit-all.min.js";var fa=`
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
`;var ga={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},Qe=class extends N{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return fa}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,i){i.literals={...i.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},i.space=!0,i.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${K}[data-template="price"]`);if(!r)return;let i=r.cloneNode(!0);this.legal=i,r.dataset.displayTax="false",i.dataset.template="legal",i.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,i.setAttribute("slot","legal"),this.card.appendChild(i)}renderLayout(){return ss`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(Qe,"variantStyle",os`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
        }
    `);var xa=new Map,J=(e,t,r=null,i=null,a)=>{xa.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:a})};J("catalog",Ge,Qi,Ge.variantStyle);J("image",Gt);J("inline-heading",Vt);J("mini-compare-chart",qe,null,qe.variantStyle);J("plans",Z,jt,Z.variantStyle,Z.collectionOptions);J("plans-students",Z,na,Z.variantStyle,Z.collectionOptions);J("plans-education",Z,aa,Z.variantStyle,Z.collectionOptions);J("plans-v2",Se,ca,Se.variantStyle,Se.collectionOptions);J("product",je,null,je.variantStyle);J("segment",We,null,We.variantStyle);J("special-offers",Ye,ha,Ye.variantStyle);J("simplified-pricing-express",Xe,Zr,Xe.variantStyle);J("full-pricing-express",Ke,Jr,Ke.variantStyle);J("mini",Qe,ga,Qe.variantStyle);function $t(e){return xa.get(e)?.fragmentMapping}var va="tacocat.js";var ei=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),ba=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function H(e,t={},{metadata:r=!0,search:i=!0,storage:a=!0}={}){let n;if(i&&n==null){let s=new URLSearchParams(window.location.search),o=Ze(i)?i:e;n=s.get(o)}if(a&&n==null){let s=Ze(a)?a:e;n=window.sessionStorage.getItem(s)??window.localStorage.getItem(s)}if(r&&n==null){let s=ls(Ze(r)?r:e);n=document.documentElement.querySelector(`meta[name="${s}"]`)?.content}return n??t[e]}var cs=e=>typeof e=="boolean",Yt=e=>typeof e=="function",Xt=e=>typeof e=="number",ya=e=>e!=null&&typeof e=="object";var Ze=e=>typeof e=="string",Ea=e=>Ze(e)&&e,bt=e=>Xt(e)&&Number.isFinite(e)&&e>0;function Kt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function w(e,t){if(cs(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function yt(e,t,r){let i=Object.values(t);return i.find(a=>ei(a,e))??r??i[0]}function ls(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function wa(e,t=1){return Xt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var ds=Date.now(),ti=()=>`(+${Date.now()-ds}ms)`,Qt=new Set,ps=w(H("tacocat.debug",{},{metadata:!1}),!1);function Aa(e){let t=`[${va}/${e}]`,r=(s,o,...l)=>s?!0:(a(o,...l),!1),i=ps?(s,...o)=>{console.debug(`${t} ${s}`,...o,ti())}:()=>{},a=(s,...o)=>{let l=`${t} ${s}`;Qt.forEach(([d])=>d(l,...o))};return{assert:r,debug:i,error:a,warn:(s,...o)=>{let l=`${t} ${s}`;Qt.forEach(([,d])=>d(l,...o))}}}function hs(e,t){let r=[e,t];return Qt.add(r),()=>{Qt.delete(r)}}hs((e,...t)=>{console.error(e,...t,ti())},(e,...t)=>{console.warn(e,...t,ti())});var ms="no promo",Sa="promo-tag",us="yellow",fs="neutral",gs=(e,t,r)=>{let i=n=>n||ms,a=r?` (was "${i(t)}")`:"";return`${i(e)}${a}`},xs="cancel-context",Zt=(e,t)=>{let r=e===xs,i=!r&&e?.length>0,a=(i||r)&&(t&&t!=e||!t&&!r),n=a&&i||!a&&!!t,s=n?e||t:void 0;return{effectivePromoCode:s,overridenPromoCode:e,className:n?Sa:`${Sa} no-promo`,text:gs(s,t,a),variant:n?us:fs,isOverriden:a}};var ri;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(ri||(ri={}));var ie;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(ie||(ie={}));var oe;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(oe||(oe={}));var ii;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(ii||(ii={}));var ai;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(ai||(ai={}));var ni;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(ni||(ni={}));var oi;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(oi||(oi={}));var si="ABM",ci="PUF",li="M2M",di="PERPETUAL",pi="P3Y",vs="TAX_INCLUSIVE_DETAILS",bs="TAX_EXCLUSIVE",Ta={ABM:si,PUF:ci,M2M:li,PERPETUAL:di,P3Y:pi},Lp={[si]:{commitment:ie.YEAR,term:oe.MONTHLY},[ci]:{commitment:ie.YEAR,term:oe.ANNUAL},[li]:{commitment:ie.MONTH,term:oe.MONTHLY},[di]:{commitment:ie.PERPETUAL,term:void 0},[pi]:{commitment:ie.THREE_MONTHS,term:oe.P3Y}},_a="Value is not an offer",Jt=e=>{if(typeof e!="object")return _a;let{commitment:t,term:r}=e,i=ys(t,r);return{...e,planType:i}};var ys=(e,t)=>{switch(e){case void 0:return _a;case"":return"";case ie.YEAR:return t===oe.MONTHLY?si:t===oe.ANNUAL?ci:"";case ie.MONTH:return t===oe.MONTHLY?li:"";case ie.PERPETUAL:return di;case ie.TERM_LICENSE:return t===oe.P3Y?pi:"";default:return""}};function Ca(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:a,priceWithoutDiscountAndTax:n,taxDisplay:s}=t;if(s!==vs)return e;let o={...e,priceDetails:{...t,price:a??r,priceWithoutDiscount:n??i,taxDisplay:bs}};return o.offerType==="TRIAL"&&o.priceDetails.price===0&&(o.priceDetails.price=o.priceDetails.priceWithoutDiscount),o}var Es="mas-commerce-service",ws={requestId:pt,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Et(e,{country:t,forceTaxExclusive:r}){let i;if(e.length<2)i=e;else{let a=t==="GB"?"EN":"MULT";e.sort((n,s)=>n.language===a?-1:s.language===a?1:0),e.sort((n,s)=>!n.term&&s.term?-1:n.term&&!s.term?1:0),i=[e[0]]}return r&&(i=i.map(Ca)),i}var er=e=>window.setTimeout(e);function Je(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(wa).filter(bt);return r.length||(r=[t]),r}function tr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(Ea)}function ee(){return document.getElementsByTagName(Es)?.[0]}function Pa(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,a]of Object.entries(ws)){let n=r.get(a);n&&(n=n.replace(/[,;]/g,"|"),n=n.replace(/[| ]+/g,"|"),t[i]=n)}return t}var Re={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},La=1e3;function As(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function ka(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:a,status:n}=e;return[i,n,a].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!Re.serializableTypes.includes(r))return r}return e}function Ss(e,t){if(!Re.ignoredProperties.includes(e))return ka(t)}var hi={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],a=[],n=t;r.forEach(d=>{d!=null&&(As(d)?i:a).push(d)}),i.length&&(n+=" "+i.map(ka).join(" "));let{pathname:s,search:o}=window.location,l=`${Re.delimiter}page=${s}${o}`;l.length>La&&(l=`${l.slice(0,La)}<trunc>`),n+=l,a.length&&(n+=`${Re.delimiter}facts=`,n+=JSON.stringify(a,Ss)),window.lana?.log(n,Re)}};function rr(e){Object.assign(Re,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in Re&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Ma={LOCAL:"local",PROD:"prod",STAGE:"stage"},mi={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},ui=new Set,fi=new Set,Ra=new Map,Na={append({level:e,message:t,params:r,timestamp:i,source:a}){console[e](`${i}ms [${a}] %c${t}`,"font-weight: bold;",...r)}},Oa={filter:({level:e})=>e!==mi.DEBUG},Ts={filter:()=>!1};function _s(e,t,r,i,a){return{level:e,message:t,namespace:r,get params(){return i.length===1&&Yt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:a,timestamp:performance.now().toFixed(3)}}function Cs(e){[...fi].every(t=>t(e))&&ui.forEach(t=>t(e))}function Ia(e){let t=(Ra.get(e)??0)+1;Ra.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:a=>Ia(`${i.namespace}/${a}`),updateConfig:rr};return Object.values(mi).forEach(a=>{i[a]=(n,...s)=>Cs(_s(a,n,e,s,r))}),Object.seal(i)}function ir(...e){e.forEach(t=>{let{append:r,filter:i}=t;Yt(i)&&fi.add(i),Yt(r)&&ui.add(r)})}function Ps(e={}){let{name:t}=e,r=w(H("commerce.debug",{search:!0,storage:!0}),t===Ma.LOCAL);return ir(r?Na:Oa),t===Ma.PROD&&ir(hi),se}function Ls(){ui.clear(),fi.clear()}var se={...Ia(Dr),Level:mi,Plugins:{consoleAppender:Na,debugFilter:Oa,quietFilter:Ts,lanaAppender:hi},init:Ps,reset:Ls,use:ir};var et=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let a=r.response.headers?.get(pt);a&&(r.requestId=a),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,a])=>`${i}: ${JSON.stringify(a)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var ks={[le]:Lr,[we]:kr,[ue]:Mr},Ms={[le]:Or,[ue]:Ir},wt,Te=class{constructor(t){V(this,wt);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",we);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=se.module("mas-element")}update(){[le,we,ue].forEach(t=>{this.wrapperElement.classList.toggle(ks[t],t===this.state)})}notify(){(this.state===ue||this.state===le)&&(this.state===ue?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===le&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof et&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Ms[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){q(this,wt,ee()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return ue===i?Promise.resolve(this.wrapperElement):le===i?Promise.reject(t):new Promise((a,n)=>{r.push({resolve:a,reject:n})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=ue,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),er(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=le,this.update();let a=this.wrapperElement.getAttribute("is");return this.log?.error(`${a}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...A(this,wt)?.duration}),er(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=we,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!ee()||this.timer)return;let{error:r,options:i,state:a,value:n,version:s}=this;this.state=we,this.timer=er(async()=>{this.timer=null;let o=null;if(this.changes.size&&(o=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:o}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:o})),o||t)try{await this.wrapperElement.render?.()===!1&&this.state===we&&this.version===s&&(this.state=a,this.error=r,this.value=n,this.update(),this.notify())}catch(l){this.toggleFailed(this.version,l,i)}})}};wt=new WeakMap;function Da(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function ar(e,t={}){let{tag:r,is:i}=e,a=document.createElement(r,{is:i});return a.setAttribute("is",i),Object.assign(a.dataset,Da(t)),a}function Ha(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Da(t)),e):null}function Rs(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Ie,Ne=class Ne extends HTMLAnchorElement{constructor(){super();g(this,"masElement",new Te(this));V(this,Ie);this.setAttribute("is",Ne.is)}get isUptLink(){return!0}initializeWcsData(r,i){this.setAttribute("data-wcs-osi",r),i&&this.setAttribute("data-promotion-code",i)}attributeChangedCallback(r,i,a){this.masElement.attributeChangedCallback(r,i,a)}connectedCallback(){this.masElement.connectedCallback(),q(this,Ie,ut()),A(this,Ie)&&(this.log=A(this,Ie).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),q(this,Ie,void 0)}requestUpdate(r=!1){this.masElement.requestUpdate(r)}onceSettled(){return this.masElement.onceSettled()}async render(){let r=ut();if(!r)return!1;this.dataset.imsCountry||r.imsCountryPromise.then(s=>{s&&(this.dataset.imsCountry=s)});let i=r.collectCheckoutOptions({},this);if(!i.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let a=this.masElement.togglePending(i),n=r.resolveOfferSelectors(i);try{let[[s]]=await Promise.all(n),{country:o,language:l,env:d}=i,c=`locale=${l}_${o}&country=${o}&offer_id=${s.offerId}`,p=this.getAttribute("data-promotion-code");p&&(c+=`&promotion_code=${encodeURIComponent(p)}`),this.href=`${Rs(d)}?${c}`,this.masElement.toggleResolved(a,s,i)}catch(s){let o=new Error(`Could not resolve offer selectors for id: ${i.wcsOsi}.`,s.message);return this.masElement.toggleFailed(a,o,i),!1}}static createFrom(r){let i=new Ne;for(let a of r.attributes)a.name!=="is"&&(a.name==="class"&&a.value.includes("upt-link")?i.setAttribute("class",a.value.replace("upt-link","").trim()):i.setAttribute(a.name,a.value));return i.innerHTML=r.innerHTML,i.setAttribute("tabindex",0),i}};Ie=new WeakMap,g(Ne,"is","upt-link"),g(Ne,"tag","a"),g(Ne,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var Oe=Ne;window.customElements.get(Oe.is)||window.customElements.define(Oe.is,Oe,{extends:Oe.tag});function Ba(e){return e&&(e.startsWith("plans")?"plans":e)}var Ns=/[0-9\-+#]/,Os=/[^\d\-+#]/g;function Fa(e){return e.search(Ns)}function Is(e="#.##"){let t={},r=e.length,i=Fa(e);t.prefix=i>0?e.substring(0,i):"";let a=Fa(e.split("").reverse().join("")),n=r-a,s=e.substring(n,n+1),o=n+(s==="."||s===","?1:0);t.suffix=a>0?e.substring(o,r):"",t.mask=e.substring(i,o),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let l=t.mask.match(Os);return t.decimal=l&&l[l.length-1]||".",t.separator=l&&l[1]&&l[0]||",",l=t.mask.split(t.decimal),t.integer=l[0],t.fraction=l[1],t}function Ds(e,t,r){let i=!1,a={value:e};e<0&&(i=!0,a.value=-a.value),a.sign=i?"-":"",a.value=Number(a.value).toFixed(t.fraction&&t.fraction.length),a.value=Number(a.value).toString();let n=t.fraction&&t.fraction.lastIndexOf("0"),[s="0",o=""]=a.value.split(".");return(!o||o&&o.length<=n)&&(o=n<0?"":(+("0."+o)).toFixed(n+1).replace("0.","")),a.integer=s,a.fraction=o,Hs(a,t),(a.result==="0"||a.result==="")&&(i=!1,a.sign=""),!i&&t.maskHasPositiveSign?a.sign="+":i&&t.maskHasPositiveSign?a.sign="-":i&&(a.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),a}function Hs(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),a=i&&i.indexOf("0");if(a>-1)for(;e.integer.length<i.length-a;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let n=r[1]&&r[r.length-1].length;if(n){let s=e.integer.length,o=s%n;for(let l=0;l<s;l++)e.result+=e.integer.charAt(l),!((l-o+1)%n)&&l<s-n&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Bs(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=Is(e),a=Ds(t,i,r);return i.prefix+a.sign+a.result+i.suffix}var Ua=Bs;var za=".",Fs=",",Ga=/^\s+/,Va=/\s+$/,$a="&nbsp;",gi=e=>e*12,He=(e,t,r=1)=>{if(!e)return!1;let{start:i,end:a,displaySummary:{amount:n,duration:s,minProductQuantity:o=1,outcomeType:l}={}}=e;if(!(n&&s&&l)||r<o)return!1;let d=t?new Date(t):new Date;if(!i||!a)return!1;let c=new Date(i),p=new Date(a);return d>=c&&d<=p},De={MONTH:"MONTH",YEAR:"YEAR"},Us={[ne.ANNUAL]:12,[ne.MONTHLY]:1,[ne.THREE_YEARS]:36,[ne.TWO_YEARS]:24},xi=(e,t)=>({accept:e,round:t}),zs=[xi(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),xi(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),xi(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],vi={[Pe.YEAR]:{[ne.MONTHLY]:De.MONTH,[ne.ANNUAL]:De.YEAR},[Pe.MONTH]:{[ne.MONTHLY]:De.MONTH}},$s=(e,t)=>e.indexOf(`'${t}'`)===0,Gs=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=ja(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+qs(e)),r},Vs=e=>{let t=js(e),r=$s(e,t),i=e.replace(/'.*?'/,""),a=Ga.test(i)||Va.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:a}},qa=e=>e.replace(Ga,$a).replace(Va,$a),qs=e=>e.match(/#(.?)#/)?.[1]===za?Fs:za,js=e=>e.match(/'(.*?)'/)?.[1]??"",ja=e=>e.match(/0(.?)0/)?.[1]??"";function tt({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},a,n=s=>s){let{currencySymbol:s,isCurrencyFirst:o,hasCurrencySpace:l}=Vs(e),d=r?ja(e):"",c=Gs(e,r),p=r?2:0,u=n(t,{currencySymbol:s}),h=i?u.toLocaleString("hi-IN",{minimumFractionDigits:p,maximumFractionDigits:p}):Ua(c,u),m=r?h.lastIndexOf(d):h.length,f=h.substring(0,m),v=h.substring(m+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,h).replace(/SYMBOL/,s),currencySymbol:s,decimals:v,decimalsDelimiter:d,hasCurrencySpace:l,integer:f,isCurrencyFirst:o,recurrenceTerm:a}}var Wa=e=>{let{commitment:t,term:r,usePrecision:i}=e,a=Us[r]??1;return tt(e,a>1?De.MONTH:vi[t]?.[r],n=>{let s={divisor:a,price:n,usePrecision:i},{round:o}=zs.find(({accept:l})=>l(s));if(!o)throw new Error(`Missing rounding rule for: ${JSON.stringify(s)}`);return o(s)})},Ya=({commitment:e,term:t,...r})=>tt(r,vi[e]?.[t]),Xa=e=>{let{commitment:t,instant:r,price:i,originalPrice:a,priceWithoutDiscount:n,promotion:s,quantity:o=1,term:l}=e;if(t===Pe.YEAR&&l===ne.MONTHLY){if(!s)return tt(e,De.YEAR,gi);let{displaySummary:{outcomeType:d,duration:c}={}}=s;switch(d){case"PERCENTAGE_DISCOUNT":if(He(s,r,o)){let p=parseInt(c.replace("P","").replace("M",""));if(isNaN(p))return gi(i);let u=a*p,h=n*(12-p),m=Math.round((u+h)*100)/100;return tt({...e,price:m},De.YEAR)}default:return tt(e,De.YEAR,()=>gi(n??i))}}return tt(e,vi[t]?.[l])};var Ka="download",Qa="upgrade",Za={e:"EDU",t:"TEAM"};function Ja(e,t={},r=""){let i=ee();if(!i)return null;let{checkoutMarketSegment:a,checkoutWorkflow:n,checkoutWorkflowStep:s,entitlement:o,upgrade:l,modal:d,perpetual:c,promotionCode:p,quantity:u,wcsOsi:h,extraOptions:m,analyticsId:f}=i.collectCheckoutOptions(t),v=ar(e,{checkoutMarketSegment:a,checkoutWorkflow:n,checkoutWorkflowStep:s,entitlement:o,upgrade:l,modal:d,perpetual:c,promotionCode:p,quantity:u,wcsOsi:h,extraOptions:m,analyticsId:f});return r&&(v.innerHTML=`<span style="pointer-events: none;">${r}</span>`),v}function en(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Te(this))}attributeChangedCallback(i,a,n){this.masElement.attributeChangedCallback(i,a,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return Za[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return Za[i]??i}get is3in1Modal(){return Object.values(ke).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let a=ee();if(!a)return!1;this.dataset.imsCountry||a.imsCountryPromise.then(h=>{h&&(this.dataset.imsCountry=h)}),i.imsCountry=null;let n=a.collectCheckoutOptions(i,this);if(!n.wcsOsi.length)return!1;let s;try{s=JSON.parse(n.extraOptions??"{}")}catch(h){this.masElement.log?.error("cannot parse exta checkout options",h)}let o=this.masElement.togglePending(n);this.setCheckoutUrl("");let l=a.resolveOfferSelectors(n),d=await Promise.all(l);d=d.map(h=>Et(h,n));let c=d.flat().find(h=>h.promotion);!He(c?.promotion,c?.promotion?.displaySummary?.instant,n.quantity[0])&&n.promotionCode&&delete n.promotionCode,n.country=this.dataset.imsCountry||n.country;let u=await a.buildCheckoutAction?.(d.flat(),{...s,...n},this);return this.renderOffers(d.flat(),n,{},u,o)}renderOffers(i,a,n={},s=void 0,o=void 0){let l=ee();if(!l)return!1;if(a={...JSON.parse(this.dataset.extraOptions??"{}"),...a,...n},o??(o=this.masElement.togglePending(a)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),s){this.classList.remove(Ka,Qa),this.masElement.toggleResolved(o,i,a);let{url:c,text:p,className:u,handler:h}=s;c&&this.setCheckoutUrl(c),p&&(this.firstElementChild.innerHTML=p),u&&this.classList.add(...u.split(" ")),h&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=h.bind(this))}if(i.length){if(this.masElement.toggleResolved(o,i,a)){if(!this.classList.contains(Ka)&&!this.classList.contains(Qa)){let c=l.buildCheckoutURL(i,a);this.setCheckoutUrl(a.modal==="true"?"#":c)}return!0}}else{let c=new Error(`Not provided: ${a?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(o,c,a))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let a=ee();if(!a)return!1;let{checkoutMarketSegment:n,checkoutWorkflow:s,checkoutWorkflowStep:o,entitlement:l,upgrade:d,modal:c,perpetual:p,promotionCode:u,quantity:h,wcsOsi:m}=a.collectCheckoutOptions(i);return Ha(this,{checkoutMarketSegment:n,checkoutWorkflow:s,checkoutWorkflowStep:o,entitlement:l,upgrade:d,modal:c,perpetual:p,promotionCode:u,quantity:h,wcsOsi:m}),!0}}}var At=class At extends en(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return Ja(At,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(At,"is","checkout-link"),g(At,"tag","a");var xe=At;window.customElements.get(xe.is)||window.customElements.define(xe.is,xe,{extends:xe.tag});var Ws="p_draft_landscape",Ys="/store/",Xs=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),bi=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Ks=["env","workflowStep","clientId","country"],tn=new Set(["gid","gtoken","notifauditid","cohortid","productname","sdid","attimer","gcsrc","gcprog","gcprogcat","gcpagetype"]),rn=e=>Xs.get(e)??e;function nr(e,t,r){for(let[i,a]of Object.entries(e)){let n=rn(i);a!=null&&r.has(n)&&t.set(n,a)}}function Qs(e){switch(e){case $r.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Zs(e,t){for(let r in e){let i=e[r];for(let[a,n]of Object.entries(i)){if(n==null)continue;let s=rn(a);t.set(`items[${r}][${s}]`,n)}}}function Js({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===ke.CRM?"creative":"mini_plans"),e}function ec(e){let t=new URLSearchParams(window.location.search),r={};tn.forEach(i=>{let a=t.get(i);a!==null&&(r[i]=a)}),Object.keys(r).length>0&&nr(r,e.searchParams,tn)}function an(e){tc(e);let{env:t,items:r,workflowStep:i,marketSegment:a,customerSegment:n,offerType:s,productArrangementCode:o,landscape:l,modal:d,is3in1:c,preselectPlan:p,...u}=e,h=new URL(Qs(t));if(h.pathname=`${Ys}${i}`,i!==Q.SEGMENTATION&&i!==Q.CHANGE_PLAN_TEAM_PLANS&&Zs(r,h.searchParams),nr({...u},h.searchParams,bi),ec(h),l===Ae.DRAFT&&nr({af:Ws},h.searchParams,bi),i===Q.SEGMENTATION){let m={marketSegment:a,offerType:s,customerSegment:n,productArrangementCode:o,quantity:r?.[0]?.quantity,addonProductArrangementCode:o?r?.find(f=>f.productArrangementCode!==o)?.productArrangementCode:r?.[1]?.productArrangementCode};p?.toLowerCase()==="edu"?h.searchParams.set("ms","EDU"):p?.toLowerCase()==="team"&&h.searchParams.set("cs","TEAM"),nr(m,h.searchParams,bi),h.searchParams.get("ot")==="PROMOTION"&&h.searchParams.delete("ot"),h=Js({url:h,modal:d,is3in1:c})}return h.toString()}function tc(e){for(let t of Ks)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==Q.SEGMENTATION&&e.workflowStep!==Q.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var C=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:Q.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:me.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Ae.PUBLISHED});function nn({settings:e,providers:t}){function r(n,s){let{checkoutClientId:o,checkoutWorkflowStep:l,country:d,language:c,promotionCode:p,quantity:u,preselectPlan:h,env:m}=e,f={checkoutClientId:o,checkoutWorkflowStep:l,country:d,language:c,promotionCode:p,quantity:u,preselectPlan:h,env:m};if(s)for(let Ee of t.checkout)Ee(s,f);let{checkoutMarketSegment:v,checkoutWorkflowStep:b=l,imsCountry:E,country:x=E??d,language:_=c,quantity:k=u,entitlement:L,upgrade:D,modal:F,perpetual:X,promotionCode:$=p,wcsOsi:U,extraOptions:R,...ae}=Object.assign(f,s?.dataset??{},n??{}),he=yt(b,Q,C.checkoutWorkflowStep);return f=Kt({...ae,extraOptions:R,checkoutClientId:o,checkoutMarketSegment:v,country:x,quantity:Je(k,C.quantity),checkoutWorkflowStep:he,language:_,entitlement:w(L),upgrade:w(D),modal:F,perpetual:w(X),promotionCode:Zt($).effectivePromoCode,wcsOsi:tr(U),preselectPlan:h}),f}function i(n,s){if(!Array.isArray(n)||!n.length||!s)return"";let{env:o,landscape:l}=e,{checkoutClientId:d,checkoutMarketSegment:c,checkoutWorkflowStep:p,country:u,promotionCode:h,quantity:m,preselectPlan:f,ms:v,cs:b,...E}=r(s),x=document.querySelector("meta[name=mas-ff-3in1]"),_=Object.values(ke).includes(s.modal)&&(!x||x.content!=="off"),k=window.frameElement||_?"if":"fp",[{productArrangementCode:L,marketSegments:[D],customerSegment:F,offerType:X}]=n,$=v??D??c,U=b??F;f?.toLowerCase()==="edu"?$="EDU":f?.toLowerCase()==="team"&&(U="TEAM");let R={is3in1:_,checkoutPromoCode:h,clientId:d,context:k,country:u,env:o,items:[],marketSegment:$,customerSegment:U,offerType:X,productArrangementCode:L,workflowStep:p,landscape:l,...E},ae=m[0]>1?m[0]:void 0;if(n.length===1){let{offerId:he}=n[0];R.items.push({id:he,quantity:ae})}else R.items.push(...n.map(({offerId:he,productArrangementCode:Ee})=>({id:he,quantity:ae,..._?{productArrangementCode:Ee}:{}})));return an(R)}let{createCheckoutLink:a}=xe;return{CheckoutLink:xe,CheckoutWorkflowStep:Q,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:a}}function rc({interval:e=200,maxAttempts:t=25}={}){let r=se.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let a=0;function n(){window.adobeIMS?.initialized?i():++a>t?(r.debug("Timeout"),i()):setTimeout(n,e)}n()})}function ic(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function ac(e){let t=se.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function on({}){let e=rc(),t=ic(e),r=ac(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var sn=window.masPriceLiterals;function cn(e){if(Array.isArray(sn)){let t=i=>sn.find(a=>ei(a.lang,i)),r=t(e.language)??t(C.language);if(r)return Object.freeze(r)}return{}}var yi=function(e,t){return yi=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var a in i)Object.prototype.hasOwnProperty.call(i,a)&&(r[a]=i[a])},yi(e,t)};function St(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");yi(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var S=function(){return S=Object.assign||function(t){for(var r,i=1,a=arguments.length;i<a;i++){r=arguments[i];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}return t},S.apply(this,arguments)};function or(e,t,r){if(r||arguments.length===2)for(var i=0,a=t.length,n;i<a;i++)(n||!(i in t))&&(n||(n=Array.prototype.slice.call(t,0,i)),n[i]=t[i]);return e.concat(n||Array.prototype.slice.call(t))}var y;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(y||(y={}));var O;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(O||(O={}));var Be;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(Be||(Be={}));function Ei(e){return e.type===O.literal}function ln(e){return e.type===O.argument}function sr(e){return e.type===O.number}function cr(e){return e.type===O.date}function lr(e){return e.type===O.time}function dr(e){return e.type===O.select}function pr(e){return e.type===O.plural}function dn(e){return e.type===O.pound}function hr(e){return e.type===O.tag}function mr(e){return!!(e&&typeof e=="object"&&e.type===Be.number)}function Tt(e){return!!(e&&typeof e=="object"&&e.type===Be.dateTime)}var wi=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var nc=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function pn(e){var t={};return e.replace(nc,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var hn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function gn(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(hn).filter(function(u){return u.length>0}),r=[],i=0,a=t;i<a.length;i++){var n=a[i],s=n.split("/");if(s.length===0)throw new Error("Invalid number skeleton");for(var o=s[0],l=s.slice(1),d=0,c=l;d<c.length;d++){var p=c[d];if(p.length===0)throw new Error("Invalid number skeleton")}r.push({stem:o,options:l})}return r}function oc(e){return e.replace(/^(.*?)-/,"")}var mn=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,xn=/^(@+)?(\+|#+)?[rs]?$/g,sc=/(\*)(0+)|(#+)(0+)|(0+)/g,vn=/^(0+)$/;function un(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(xn,function(r,i,a){return typeof a!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):a==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof a=="string"?a.length:0)),""}),t}function bn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function cc(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!vn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function fn(e){var t={},r=bn(e);return r||t}function yn(e){for(var t={},r=0,i=e;r<i.length;r++){var a=i[r];switch(a.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=a.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=oc(a.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=S(S(S({},t),{notation:"scientific"}),a.options.reduce(function(l,d){return S(S({},l),fn(d))},{}));continue;case"engineering":t=S(S(S({},t),{notation:"engineering"}),a.options.reduce(function(l,d){return S(S({},l),fn(d))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(a.options[0]);continue;case"integer-width":if(a.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");a.options[0].replace(sc,function(l,d,c,p,u,h){if(d)t.minimumIntegerDigits=c.length;else{if(p&&u)throw new Error("We currently do not support maximum integer digits");if(h)throw new Error("We currently do not support exact integer digits")}return""});continue}if(vn.test(a.stem)){t.minimumIntegerDigits=a.stem.length;continue}if(mn.test(a.stem)){if(a.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");a.stem.replace(mn,function(l,d,c,p,u,h){return c==="*"?t.minimumFractionDigits=d.length:p&&p[0]==="#"?t.maximumFractionDigits=p.length:u&&h?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+h.length):(t.minimumFractionDigits=d.length,t.maximumFractionDigits=d.length),""});var n=a.options[0];n==="w"?t=S(S({},t),{trailingZeroDisplay:"stripIfInteger"}):n&&(t=S(S({},t),un(n)));continue}if(xn.test(a.stem)){t=S(S({},t),un(a.stem));continue}var s=bn(a.stem);s&&(t=S(S({},t),s));var o=cc(a.stem);o&&(t=S(S({},t),o))}return t}var _t={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function En(e,t){for(var r="",i=0;i<e.length;i++){var a=e.charAt(i);if(a==="j"){for(var n=0;i+1<e.length&&e.charAt(i+1)===a;)n++,i++;var s=1+(n&1),o=n<2?1:3+(n>>1),l="a",d=lc(t);for((d=="H"||d=="k")&&(o=0);o-- >0;)r+=l;for(;s-- >0;)r=d+r}else a==="J"?r+="H":r+=a}return r}function lc(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var a=_t[i||""]||_t[r||""]||_t["".concat(r,"-001")]||_t["001"];return a[0]}var Ai,dc=new RegExp("^".concat(wi.source,"*")),pc=new RegExp("".concat(wi.source,"*$"));function T(e,t){return{start:e,end:t}}var hc=!!String.prototype.startsWith,mc=!!String.fromCodePoint,uc=!!Object.fromEntries,fc=!!String.prototype.codePointAt,gc=!!String.prototype.trimStart,xc=!!String.prototype.trimEnd,vc=!!Number.isSafeInteger,bc=vc?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},Ti=!0;try{wn=_n("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Ti=((Ai=wn.exec("a"))===null||Ai===void 0?void 0:Ai[0])==="a"}catch{Ti=!1}var wn,An=hc?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},_i=mc?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",a=t.length,n=0,s;a>n;){if(s=t[n++],s>1114111)throw RangeError(s+" is not a valid code point");i+=s<65536?String.fromCharCode(s):String.fromCharCode(((s-=65536)>>10)+55296,s%1024+56320)}return i},Sn=uc?Object.fromEntries:function(t){for(var r={},i=0,a=t;i<a.length;i++){var n=a[i],s=n[0],o=n[1];r[s]=o}return r},Tn=fc?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var a=t.charCodeAt(r),n;return a<55296||a>56319||r+1===i||(n=t.charCodeAt(r+1))<56320||n>57343?a:(a-55296<<10)+(n-56320)+65536}},yc=gc?function(t){return t.trimStart()}:function(t){return t.replace(dc,"")},Ec=xc?function(t){return t.trimEnd()}:function(t){return t.replace(pc,"")};function _n(e,t){return new RegExp(e,t)}var Ci;Ti?(Si=_n("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Ci=function(t,r){var i;Si.lastIndex=r;var a=Si.exec(t);return(i=a[1])!==null&&i!==void 0?i:""}):Ci=function(t,r){for(var i=[];;){var a=Tn(t,r);if(a===void 0||Pn(a)||Sc(a))break;i.push(a),r+=a>=65536?2:1}return _i.apply(void 0,i)};var Si,Cn=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var a=[];!this.isEOF();){var n=this.char();if(n===123){var s=this.parseArgument(t,i);if(s.err)return s;a.push(s.val)}else{if(n===125&&t>0)break;if(n===35&&(r==="plural"||r==="selectordinal")){var o=this.clonePosition();this.bump(),a.push({type:O.pound,location:T(o,this.clonePosition())})}else if(n===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(y.UNMATCHED_CLOSING_TAG,T(this.clonePosition(),this.clonePosition()))}else if(n===60&&!this.ignoreTag&&Pi(this.peek()||0)){var s=this.parseTag(t,r);if(s.err)return s;a.push(s.val)}else{var s=this.parseLiteral(t,r);if(s.err)return s;a.push(s.val)}}}return{val:a,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var a=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:O.literal,value:"<".concat(a,"/>"),location:T(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var n=this.parseMessage(t+1,r,!0);if(n.err)return n;var s=n.val,o=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Pi(this.char()))return this.error(y.INVALID_TAG,T(o,this.clonePosition()));var l=this.clonePosition(),d=this.parseTagName();return a!==d?this.error(y.UNMATCHED_CLOSING_TAG,T(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:O.tag,value:a,children:s,location:T(i,this.clonePosition())},err:null}:this.error(y.INVALID_TAG,T(o,this.clonePosition())))}else return this.error(y.UNCLOSED_TAG,T(i,this.clonePosition()))}else return this.error(y.INVALID_TAG,T(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Ac(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),a="";;){var n=this.tryParseQuote(r);if(n){a+=n;continue}var s=this.tryParseUnquoted(t,r);if(s){a+=s;continue}var o=this.tryParseLeftAngleBracket();if(o){a+=o;continue}break}var l=T(i,this.clonePosition());return{val:{type:O.literal,value:a,location:l},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!wc(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return _i.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),_i(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(y.EMPTY_ARGUMENT,T(i,this.clonePosition()));var a=this.parseIdentifierIfPossible().value;if(!a)return this.error(y.MALFORMED_ARGUMENT,T(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:O.argument,value:a,location:T(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(i,this.clonePosition())):this.parseArgumentOptions(t,r,a,i);default:return this.error(y.MALFORMED_ARGUMENT,T(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=Ci(this.message,r),a=r+i.length;this.bumpTo(a);var n=this.clonePosition(),s=T(t,n);return{value:i,location:s}},e.prototype.parseArgumentOptions=function(t,r,i,a){var n,s=this.clonePosition(),o=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(o){case"":return this.error(y.EXPECT_ARGUMENT_TYPE,T(s,l));case"number":case"date":case"time":{this.bumpSpace();var d=null;if(this.bumpIf(",")){this.bumpSpace();var c=this.clonePosition(),p=this.parseSimpleArgStyleIfPossible();if(p.err)return p;var u=Ec(p.val);if(u.length===0)return this.error(y.EXPECT_ARGUMENT_STYLE,T(this.clonePosition(),this.clonePosition()));var h=T(c,this.clonePosition());d={style:u,styleLocation:h}}var m=this.tryParseArgumentClose(a);if(m.err)return m;var f=T(a,this.clonePosition());if(d&&An(d?.style,"::",0)){var v=yc(d.style.slice(2));if(o==="number"){var p=this.parseNumberSkeletonFromString(v,d.styleLocation);return p.err?p:{val:{type:O.number,value:i,location:f,style:p.val},err:null}}else{if(v.length===0)return this.error(y.EXPECT_DATE_TIME_SKELETON,f);var b=v;this.locale&&(b=En(v,this.locale));var u={type:Be.dateTime,pattern:b,location:d.styleLocation,parsedOptions:this.shouldParseSkeletons?pn(b):{}},E=o==="date"?O.date:O.time;return{val:{type:E,value:i,location:f,style:u},err:null}}}return{val:{type:o==="number"?O.number:o==="date"?O.date:O.time,value:i,location:f,style:(n=d?.style)!==null&&n!==void 0?n:null},err:null}}case"plural":case"selectordinal":case"select":{var x=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(y.EXPECT_SELECT_ARGUMENT_OPTIONS,T(x,S({},x)));this.bumpSpace();var _=this.parseIdentifierIfPossible(),k=0;if(o!=="select"&&_.value==="offset"){if(!this.bumpIf(":"))return this.error(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,T(this.clonePosition(),this.clonePosition()));this.bumpSpace();var p=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(p.err)return p;this.bumpSpace(),_=this.parseIdentifierIfPossible(),k=p.val}var L=this.tryParsePluralOrSelectOptions(t,o,r,_);if(L.err)return L;var m=this.tryParseArgumentClose(a);if(m.err)return m;var D=T(a,this.clonePosition());return o==="select"?{val:{type:O.select,value:i,options:Sn(L.val),location:D},err:null}:{val:{type:O.plural,value:i,options:Sn(L.val),offset:k,pluralType:o==="plural"?"cardinal":"ordinal",location:D},err:null}}default:return this.error(y.INVALID_ARGUMENT_TYPE,T(s,l))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,T(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var a=this.clonePosition();if(!this.bumpUntil("'"))return this.error(y.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,T(a,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=gn(t)}catch{return this.error(y.INVALID_NUMBER_SKELETON,r)}return{val:{type:Be.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?yn(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,a){for(var n,s=!1,o=[],l=new Set,d=a.value,c=a.location;;){if(d.length===0){var p=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_SELECTOR,y.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;c=T(p,this.clonePosition()),d=this.message.slice(p.offset,this.offset())}else break}if(l.has(d))return this.error(r==="select"?y.DUPLICATE_SELECT_ARGUMENT_SELECTOR:y.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,c);d==="other"&&(s=!0),this.bumpSpace();var h=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:y.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,T(this.clonePosition(),this.clonePosition()));var m=this.parseMessage(t+1,r,i);if(m.err)return m;var f=this.tryParseArgumentClose(h);if(f.err)return f;o.push([d,{value:m.val,location:T(h,this.clonePosition())}]),l.add(d),this.bumpSpace(),n=this.parseIdentifierIfPossible(),d=n.value,c=n.location}return o.length===0?this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR:y.EXPECT_PLURAL_ARGUMENT_SELECTOR,T(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!s?this.error(y.MISSING_OTHER_CLAUSE,T(this.clonePosition(),this.clonePosition())):{val:o,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,a=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var n=!1,s=0;!this.isEOF();){var o=this.char();if(o>=48&&o<=57)n=!0,s=s*10+(o-48),this.bump();else break}var l=T(a,this.clonePosition());return n?(s*=i,bc(s)?{val:s,err:null}:this.error(r,l)):this.error(t,l)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Tn(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(An(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Pn(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function Pi(e){return e>=97&&e<=122||e>=65&&e<=90}function wc(e){return Pi(e)||e===47}function Ac(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Pn(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Sc(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Li(e){e.forEach(function(t){if(delete t.location,dr(t)||pr(t))for(var r in t.options)delete t.options[r].location,Li(t.options[r].value);else sr(t)&&mr(t.style)||(cr(t)||lr(t))&&Tt(t.style)?delete t.style.location:hr(t)&&Li(t.children)})}function Ln(e,t){t===void 0&&(t={}),t=S({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Cn(e,t).parse();if(r.err){var i=SyntaxError(y[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||Li(r.val),r.val}function Ct(e,t){var r=t&&t.cache?t.cache:kc,i=t&&t.serializer?t.serializer:Lc,a=t&&t.strategy?t.strategy:_c;return a(e,{cache:r,serializer:i})}function Tc(e){return e==null||typeof e=="number"||typeof e=="boolean"}function kn(e,t,r,i){var a=Tc(i)?i:r(i),n=t.get(a);return typeof n>"u"&&(n=e.call(this,i),t.set(a,n)),n}function Mn(e,t,r){var i=Array.prototype.slice.call(arguments,3),a=r(i),n=t.get(a);return typeof n>"u"&&(n=e.apply(this,i),t.set(a,n)),n}function ki(e,t,r,i,a){return r.bind(t,e,i,a)}function _c(e,t){var r=e.length===1?kn:Mn;return ki(e,this,r,t.cache.create(),t.serializer)}function Cc(e,t){return ki(e,this,Mn,t.cache.create(),t.serializer)}function Pc(e,t){return ki(e,this,kn,t.cache.create(),t.serializer)}var Lc=function(){return JSON.stringify(arguments)};function Mi(){this.cache=Object.create(null)}Mi.prototype.get=function(e){return this.cache[e]};Mi.prototype.set=function(e,t){this.cache[e]=t};var kc={create:function(){return new Mi}},ur={variadic:Cc,monadic:Pc};var Fe;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Fe||(Fe={}));var Pt=function(e){St(t,e);function t(r,i,a){var n=e.call(this,r)||this;return n.code=i,n.originalMessage=a,n}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Ri=function(e){St(t,e);function t(r,i,a,n){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(a).join('", "'),'"'),Fe.INVALID_VALUE,n)||this}return t}(Pt);var Rn=function(e){St(t,e);function t(r,i,a){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Fe.INVALID_VALUE,a)||this}return t}(Pt);var Nn=function(e){St(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Fe.MISSING_VALUE,i)||this}return t}(Pt);var W;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(W||(W={}));function Mc(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==W.literal||r.type!==W.literal?t.push(r):i.value+=r.value,t},[])}function Rc(e){return typeof e=="function"}function Lt(e,t,r,i,a,n,s){if(e.length===1&&Ei(e[0]))return[{type:W.literal,value:e[0].value}];for(var o=[],l=0,d=e;l<d.length;l++){var c=d[l];if(Ei(c)){o.push({type:W.literal,value:c.value});continue}if(dn(c)){typeof n=="number"&&o.push({type:W.literal,value:r.getNumberFormat(t).format(n)});continue}var p=c.value;if(!(a&&p in a))throw new Nn(p,s);var u=a[p];if(ln(c)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),o.push({type:typeof u=="string"?W.literal:W.object,value:u});continue}if(cr(c)){var h=typeof c.style=="string"?i.date[c.style]:Tt(c.style)?c.style.parsedOptions:void 0;o.push({type:W.literal,value:r.getDateTimeFormat(t,h).format(u)});continue}if(lr(c)){var h=typeof c.style=="string"?i.time[c.style]:Tt(c.style)?c.style.parsedOptions:i.time.medium;o.push({type:W.literal,value:r.getDateTimeFormat(t,h).format(u)});continue}if(sr(c)){var h=typeof c.style=="string"?i.number[c.style]:mr(c.style)?c.style.parsedOptions:void 0;h&&h.scale&&(u=u*(h.scale||1)),o.push({type:W.literal,value:r.getNumberFormat(t,h).format(u)});continue}if(hr(c)){var m=c.children,f=c.value,v=a[f];if(!Rc(v))throw new Rn(f,"function",s);var b=Lt(m,t,r,i,a,n),E=v(b.map(function(k){return k.value}));Array.isArray(E)||(E=[E]),o.push.apply(o,E.map(function(k){return{type:typeof k=="string"?W.literal:W.object,value:k}}))}if(dr(c)){var x=c.options[u]||c.options.other;if(!x)throw new Ri(c.value,u,Object.keys(c.options),s);o.push.apply(o,Lt(x.value,t,r,i,a));continue}if(pr(c)){var x=c.options["=".concat(u)];if(!x){if(!Intl.PluralRules)throw new Pt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Fe.MISSING_INTL_API,s);var _=r.getPluralRules(t,{type:c.pluralType}).select(u-(c.offset||0));x=c.options[_]||c.options.other}if(!x)throw new Ri(c.value,u,Object.keys(c.options),s);o.push.apply(o,Lt(x.value,t,r,i,a,u-(c.offset||0)));continue}}return Mc(o)}function Nc(e,t){return t?S(S(S({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=S(S({},e[i]),t[i]||{}),r},{})):e}function Oc(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=Nc(e[i],t[i]),r},S({},e)):e}function Ni(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ic(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ct(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,or([void 0],r,!1)))},{cache:Ni(e.number),strategy:ur.variadic}),getDateTimeFormat:Ct(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,or([void 0],r,!1)))},{cache:Ni(e.dateTime),strategy:ur.variadic}),getPluralRules:Ct(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,or([void 0],r,!1)))},{cache:Ni(e.pluralRules),strategy:ur.variadic})}}var On=function(){function e(t,r,i,a){var n=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(s){var o=n.formatToParts(s);if(o.length===1)return o[0].value;var l=o.reduce(function(d,c){return!d.length||c.type!==W.literal||typeof d[d.length-1]!="string"?d.push(c.value):d[d.length-1]+=c.value,d},[]);return l.length<=1?l[0]||"":l},this.formatToParts=function(s){return Lt(n.ast,n.locales,n.formatters,n.formats,s,void 0,n.message)},this.resolvedOptions=function(){return{locale:n.resolvedLocale.toString()}},this.getAst=function(){return n.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:a?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Oc(e.formats,i),this.formatters=a&&a.formatters||Ic(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Ln,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var In=On;var Oi={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},Dc=Aa("ConsonantTemplates/price"),Hc=/<\/?[^>]+(>|$)/g,B={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},_e={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},Ii="TAX_EXCLUSIVE",Bc=e=>ya(e)?Object.entries(e).filter(([,t])=>Ze(t)||Xt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+ba(i)+'"'}`,""):"",z=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+B.disabled}"${Bc(r)}>${i?qa(t):t??""}</span>`;function Fc(e){e=e.replaceAll("</a>","&lt;/a&gt;");let t=/<a [^>]+(>|$)/g;return e.match(t)?.forEach(i=>{let a=i.replace("<a ","&lt;a ").replace(">","&gt;");e=e.replaceAll(i,a)}),e}function Uc(e){e=e.replaceAll("&lt;/a&gt;","</a>");let t=/&lt;a (?!&gt;)(.*?)(&gt;|$)/g;return e.match(t)?.forEach(i=>{let a=i.replace("&lt;a ","<a ").replace("&gt;",">");e=e.replaceAll(i,a)}),e}function ve(e,t,r,i){let a=e[r];if(a==null)return"";let n=a.includes("<"),s=a.includes("<a ");try{a=s?Fc(a):a,a=n?a.replace(Hc,""):a;let o=new In(a,t).format(i);return s?Uc(o):o}catch{return Dc.error("Failed to format literal:",a),""}}function zc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:a,decimalsDelimiter:n,hasCurrencySpace:s,integer:o,isCurrencyFirst:l,recurrenceLabel:d,perUnitLabel:c,taxInclusivityLabel:p},u={}){let h=z(B.currencySymbol,i),m=z(B.currencySpace,s?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),l&&(f+=h+m),f+=z(B.integer,o),f+=z(B.decimalsDelimiter,n),f+=z(B.decimals,a),l||(f+=m+h),f+=z(B.recurrence,d,null,!0),f+=z(B.unitType,c,null,!0),f+=z(B.taxInclusivity,p,!0),z(e,f,{...u})}var Y=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:a=void 0}={})=>({country:n,displayFormatted:s=!0,displayRecurrence:o=!0,displayPerUnit:l=!1,displayTax:d=!1,language:c,literals:p={},quantity:u=1,space:h=!1,isPromoApplied:m=!1}={},{commitment:f,offerSelectorIds:v,formatString:b,price:E,priceWithoutDiscount:x,taxDisplay:_,taxTerm:k,term:L,usePrecision:D,promotion:F}={},X={})=>{Object.entries({country:n,formatString:b,language:c,price:E}).forEach(([Eo,wo])=>{if(wo==null)throw new Error(`Argument "${Eo}" is missing for osi ${v?.toString()}, country ${n}, language ${c}`)});let $={...Oi,...p},U=`${c.toLowerCase()}-${n.toUpperCase()}`,R;F&&!m&&x?R=e?E:x:r&&x?R=x:R=E;let ae=t?Wa:Ya;i&&(ae=Xa);let{accessiblePrice:he,recurrenceTerm:Ee,...Ui}=ae({commitment:f,formatString:b,instant:a,isIndianPrice:n==="IN",originalPrice:E,priceWithoutDiscount:x,price:t?E:R,promotion:F,quantity:u,term:L,usePrecision:D}),xr="",vr="",br="";w(o)&&Ee&&(br=ve($,U,_e.recurrenceLabel,{recurrenceTerm:Ee}));let Dt="";w(l)&&(h&&(Dt+=" "),Dt+=ve($,U,_e.perUnitLabel,{perUnit:"LICENSE"}));let Ht="";w(d)&&k&&(h&&(Ht+=" "),Ht+=ve($,U,_===Ii?_e.taxExclusiveLabel:_e.taxInclusiveLabel,{taxTerm:k})),r&&(xr=ve($,U,_e.strikethroughAriaLabel,{strikethroughPrice:xr})),e&&(vr=ve($,U,_e.alternativePriceAriaLabel,{alternativePrice:vr}));let Ue=B.container;if(t&&(Ue+=" "+B.containerOptical),r&&(Ue+=" "+B.containerStrikethrough),e&&(Ue+=" "+B.containerAlternative),i&&(Ue+=" "+B.containerAnnual),w(s))return zc(Ue,{...Ui,accessibleLabel:xr,altAccessibleLabel:vr,recurrenceLabel:br,perUnitLabel:Dt,taxInclusivityLabel:Ht},X);let{currencySymbol:zi,decimals:go,decimalsDelimiter:xo,hasCurrencySpace:$i,integer:vo,isCurrencyFirst:bo}=Ui,ze=[vo,xo,go];bo?(ze.unshift($i?"\xA0":""),ze.unshift(zi)):(ze.push($i?"\xA0":""),ze.push(zi)),ze.push(br,Dt,Ht);let yo=ze.join("");return z(Ue,yo,X)},Dn=()=>(e,t,r)=>{let i=He(t.promotion,t.promotion?.displaySummary?.instant,Array.isArray(e.quantity)?e.quantity[0]:e.quantity),n=(e.displayOldPrice===void 0||w(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price&&(!t.promotion||i);return`${n?Y({displayStrikethrough:!0})({isPromoApplied:i,...e},t,r)+"&nbsp;":""}${Y({isAlternativePrice:n})({isPromoApplied:i,...e},t,r)}`},Hn=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let a=He(t.promotion,i,Array.isArray(e.quantity)?e.quantity[0]:e.quantity),n={...e,displayTax:!1,displayPerUnit:!1,isPromoApplied:a};if(!a)return Y()(e,{...t,price:t.priceWithoutDiscount},r)+z(B.containerAnnualPrefix,"&nbsp;(")+Y({displayAnnual:!0,instant:i})(n,{...t,price:t.priceWithoutDiscount},r)+z(B.containerAnnualSuffix,")");let o=(e.displayOldPrice===void 0||w(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?Y({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${Y({isAlternativePrice:o})({isPromoApplied:a,...e},t,r)}${z(B.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0,instant:i})(n,t,r)}${z(B.containerAnnualSuffix,")")}`},Bn=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${Y({isAlternativePrice:e.displayOldPrice})(e,t,r)}${z(B.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0})(i,t,r)}${z(B.containerAnnualSuffix,")")}`};var kt={...B,containerLegal:"price-legal",planType:"price-plan-type"},fr={..._e,planTypeLabel:"planTypeLabel"};function $c(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},a={}){let n="";return n+=z(kt.unitType,t,null,!0),r&&i&&(r+=". "),n+=z(kt.taxInclusivity,r,!0),n+=z(kt.planType,i,null),z(e,n,{...a})}var Fn=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:a,literals:n={}}={},{taxDisplay:s,taxTerm:o,planType:l}={},d={})=>{let c={...Oi,...n},p=`${a.toLowerCase()}-${e.toUpperCase()}`,u="";w(t)&&(u=ve(c,p,fr.perUnitLabel,{perUnit:"LICENSE"}));let h="";e==="US"&&a==="en"&&(r=!1),w(r)&&o&&(h=ve(c,p,s===Ii?fr.taxExclusiveLabel:fr.taxInclusiveLabel,{taxTerm:o}));let m="";w(i)&&l&&(m=ve(c,p,fr.planTypeLabel,{planType:l}));let f=kt.container;return f+=" "+kt.containerLegal,$c(f,{perUnitLabel:u,taxInclusivityLabel:h,planTypeLabel:m},d)};var Un=Y(),zn=Dn(),$n=Y({displayOptical:!0}),Gn=Y({displayStrikethrough:!0}),Vn=Y({displayAnnual:!0}),qn=Y({displayOptical:!0,isAlternativePrice:!0}),jn=Y({isAlternativePrice:!0}),Wn=Bn(),Yn=Hn(),Xn=Fn;var Gc=(e,t)=>{if(!(!bt(e)||!bt(t)))return Math.floor((t-e)/t*100)},Kn=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,a=Gc(r,i);return a===void 0?'<span class="no-discount"></span>':`<span class="discount">${a}%</span>`};var Qn=Kn();var Jn="INDIVIDUAL_COM",Di="TEAM_COM",eo="INDIVIDUAL_EDU",Hi="TEAM_EDU",Zn=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Vc={[Jn]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[Di]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[eo]:["LT_lt","LV_lv","SA_en","SG_en"],[Hi]:["SG_en","KR_ko"]},qc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},jc=[Jn,Di,eo,Hi],Wc=e=>[Di,Hi].includes(e),Yc=(e,t,r,i)=>{let a=`${e}_${t}`,n=`${r}_${i}`,s=qc[a];if(s){let o=jc.indexOf(n);return s[o]}return Wc(n)},Xc=(e,t,r,i)=>{let a=`${e}_${t}`;if(Zn.includes(e)||Zn.includes(a))return!0;let n=Vc[`${r}_${i}`];return n?n.includes(e)||n.includes(a)?!0:C.displayTax:C.displayTax},Kc=async(e,t,r,i)=>{let a=Xc(e,t,r,i);return{displayTax:a,forceTaxExclusive:a?Yc(e,t,r,i):C.forceTaxExclusive}},Mt=class Mt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Te(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi","data-quantity"]}static createInlinePrice(r){let i=ee();if(!i)return null;let{displayOldPrice:a,displayPerUnit:n,displayRecurrence:s,displayTax:o,displayPlanType:l,displayAnnual:d,forceTaxExclusive:c,perpetual:p,promotionCode:u,quantity:h,alternativePrice:m,template:f,wcsOsi:v}=i.collectPriceOptions(r);return ar(Mt,{displayOldPrice:a,displayPerUnit:n,displayRecurrence:s,displayTax:o,displayPlanType:l,displayAnnual:d,forceTaxExclusive:c,perpetual:p,promotionCode:u,quantity:h,alternativePrice:m,template:f,wcsOsi:v})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,a){this.masElement.attributeChangedCallback(r,i,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===le}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=ee();if(!i)return!1;let a=i.collectPriceOptions(r,this),n={...i.settings,...a};if(!n.wcsOsi.length)return!1;try{let s=this.masElement.togglePending({});this.innerHTML="";let[o]=await i.resolveOfferSelectors(n),l=Et(await o,n),[d]=l;if(i.featureFlags[fe]||n[fe]){if(a.displayPerUnit===void 0&&(n.displayPerUnit=d.customerSegment!=="INDIVIDUAL"),a.displayTax===void 0||a.forceTaxExclusive===void 0){let{country:c,language:p}=n,[u=""]=d.marketSegments,h=await Kc(c,p,d.customerSegment,u);a.displayTax===void 0&&(n.displayTax=h?.displayTax||n.displayTax),a.forceTaxExclusive===void 0&&(n.forceTaxExclusive=h?.forceTaxExclusive||n.forceTaxExclusive),n.forceTaxExclusive&&(l=Et(l,n))}}else a.displayOldPrice===void 0&&(n.displayOldPrice=!0);return this.renderOffers(l,n,s)}catch(s){throw this.innerHTML="",s}}renderOffers(r,i,a=void 0){if(!this.isConnected)return;let n=ee();if(!n)return!1;if(a??(a=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(a,r,i)){this.innerHTML=n.buildPriceHTML(r,this.options);let s=this.closest("p, h3, div");if(!s||!s.querySelector('span[data-template="strikethrough"]')||s.querySelector(".alt-aria-label"))return!0;let o=s?.querySelectorAll('span[is="inline-price"]');return o.length>1&&o.length===s.querySelectorAll('span[data-template="strikethrough"]').length*2&&o.forEach(l=>{l.dataset.template!=="strikethrough"&&l.options&&!l.options.alternativePrice&&!l.isFailed&&(l.options.alternativePrice=!0,l.innerHTML=n.buildPriceHTML(r,l.options))}),!0}}else{let s=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(a,s,this.options))return this.innerHTML="",!0}return!1}};g(Mt,"is","inline-price"),g(Mt,"tag","span");var be=Mt;window.customElements.get(be.is)||window.customElements.define(be.is,be,{extends:be.tag});function to({literals:e,providers:t,settings:r}){function i(s,o=null){let l={country:r.country,language:r.language,locale:r.locale,literals:{...e.price}};if(o&&t?.price)for(let L of t.price)L(o,l);let{displayOldPrice:d,displayPerUnit:c,displayRecurrence:p,displayTax:u,displayPlanType:h,forceTaxExclusive:m,perpetual:f,displayAnnual:v,promotionCode:b,quantity:E,alternativePrice:x,wcsOsi:_,...k}=Object.assign(l,o?.dataset??{},s??{});return l=Kt(Object.assign({...l,...k,displayOldPrice:w(d),displayPerUnit:w(c),displayRecurrence:w(p),displayTax:w(u),displayPlanType:w(h),forceTaxExclusive:w(m),perpetual:w(f),displayAnnual:w(v),promotionCode:Zt(b).effectivePromoCode,quantity:Je(E,C.quantity),alternativePrice:w(x),wcsOsi:tr(_)})),l}function a(s,o){if(!Array.isArray(s)||!s.length||!o)return"";let{template:l}=o,d;switch(l){case"discount":d=Qn;break;case"strikethrough":d=Gn;break;case"annual":d=Vn;break;case"legal":d=Xn;break;default:o.template==="optical"&&o.alternativePrice?d=qn:o.template==="optical"?d=$n:o.displayAnnual&&s[0].planType==="ABM"?d=o.promotionCode?Yn:Wn:o.alternativePrice?d=jn:d=o.promotionCode?zn:Un}let[c]=s;return c={...c,...c.priceDetails},d({...r,...o},c)}let n=be.createInlinePrice;return{InlinePrice:be,buildPriceHTML:a,collectPriceOptions:i,createInlinePrice:n}}function Qc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||C.language),t??(t=e?.split("_")?.[1]||C.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function ro(e={},t){let r=t.featureFlags[fe],{commerce:i={}}=e,a=me.PRODUCTION,n=Ur,s=H("checkoutClientId",i)??C.checkoutClientId,o=yt(H("checkoutWorkflowStep",i),Q,C.checkoutWorkflowStep),l=C.displayOldPrice,d=C.displayPerUnit,c=w(H("displayRecurrence",i),C.displayRecurrence),p=w(H("displayTax",i),C.displayTax),u=w(H("displayPlanType",i),C.displayPlanType),h=w(H("entitlement",i),C.entitlement),m=w(H("modal",i),C.modal),f=w(H("forceTaxExclusive",i),C.forceTaxExclusive),v=H("promotionCode",i)??C.promotionCode,b=Je(H("quantity",i)),E=H("wcsApiKey",i)??C.wcsApiKey,x=i?.env==="stage",_=Ae.PUBLISHED;["true",""].includes(i.allowOverride)&&(x=(H(Br,i,{metadata:!1})?.toLowerCase()??i?.env)==="stage",_=yt(H(Fr,i),Ae,_)),x&&(a=me.STAGE,n=zr);let L=H(Hr)??e.preview,D=typeof L<"u"&&L!=="off"&&L!=="false",F={};D&&(F={preview:D});let X=H("mas-io-url")??e.masIOUrl??`https://www${a===me.STAGE?".stage":""}.adobe.com/mas/io`,$=H("preselect-plan")??void 0;return{...Qc(e),...F,displayOldPrice:l,checkoutClientId:s,checkoutWorkflowStep:o,displayPerUnit:d,displayRecurrence:c,displayTax:p,displayPlanType:u,entitlement:h,extraOptions:C.extraOptions,modal:m,env:a,forceTaxExclusive:f,promotionCode:v,quantity:b,alternativePrice:C.alternativePrice,wcsApiKey:E,wcsURL:n,landscape:_,masIOUrl:X,...$&&{preselectPlan:$}}}async function io(e,t={},r=2,i=100){let a;for(let n=0;n<=r;n++)try{let s=await fetch(e,t);return s.retryCount=n,s}catch(s){if(a=s,a.retryCount=n,n>r)break;await new Promise(o=>setTimeout(o,i*(n+1)))}throw a}var Bi="wcs";function ao({settings:e}){let t=se.module(Bi),{env:r,wcsApiKey:i}=e,a=new Map,n=new Map,s,o=new Map;async function l(m,f,v=!0){let b=ee(),E=Nr;t.debug("Fetching:",m);let x="",_;if(m.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let k=new Map(f),[L]=m.offerSelectorIds,D=Date.now()+Math.random().toString(36).substring(2,7),F=`${Bi}:${L}:${D}${Gr}`,X=`${Bi}:${L}:${D}${Vr}`,$;try{if(performance.mark(F),x=new URL(e.wcsURL),x.searchParams.set("offer_selector_ids",L),x.searchParams.set("country",m.country),x.searchParams.set("locale",m.locale),x.searchParams.set("landscape",r===me.STAGE?"ALL":e.landscape),x.searchParams.set("api_key",i),m.language&&x.searchParams.set("language",m.language),m.promotionCode&&x.searchParams.set("promotion_code",m.promotionCode),m.currency&&x.searchParams.set("currency",m.currency),_=await io(x.toString(),{credentials:"omit"}),_.ok){let U=[];try{let R=await _.json();t.debug("Fetched:",m,R),U=R.resolvedOffers??[]}catch(R){t.error(`Error parsing JSON: ${R.message}`,{...R.context,...b?.duration})}U=U.map(Jt),f.forEach(({resolve:R},ae)=>{let he=U.filter(({offerSelectorIds:Ee})=>Ee.includes(ae)).flat();he.length&&(k.delete(ae),f.delete(ae),R(he))})}else E=Rr}catch(U){E=`Network error: ${U.message}`}finally{$=performance.measure(X,F),performance.clearMarks(F),performance.clearMeasures(X)}if(v&&f.size){t.debug("Missing:",{offerSelectorIds:[...f.keys()]});let U=Pa(_);f.forEach(R=>{R.reject(new et(E,{...m,...U,response:_,measure:Ut($),...b?.duration}))})}}function d(){clearTimeout(s);let m=[...n.values()];n.clear(),m.forEach(({options:f,promises:v})=>l(f,v))}function c(m){if(!m||typeof m!="object")throw new TypeError("Cache must be a Map or similar object");let f=r===me.STAGE?"stage":"prod",v=m[f];if(!v||typeof v!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[b,E]of Object.entries(v))a.set(b,Promise.resolve(E.map(Jt)));t.debug(`Prefilled WCS cache with ${v.size} entries`)}function p(){let m=a.size;o=new Map(a),a.clear(),t.debug(`Moved ${m} cache entries to stale cache`)}function u(m,f,v){let b=m!=="GB"&&!v?"MULT":"en",E=qr.includes(m)?m:C.country;return{validCountry:E,validLanguage:b,locale:`${f}_${E}`}}function h({country:m,language:f,perpetual:v=!1,promotionCode:b="",wcsOsi:E=[]}){let{validCountry:x,validLanguage:_,locale:k}=u(m,f,v),L=[x,_,b].filter(D=>D).join("-").toLowerCase();return E.map(D=>{let F=`${D}-${L}`;if(a.has(F))return a.get(F);let X=new Promise(($,U)=>{let R=n.get(L);R||(R={options:{country:x,locale:k,..._==="MULT"&&{language:_},offerSelectorIds:[]},promises:new Map},n.set(L,R)),b&&(R.options.promotionCode=b),R.options.offerSelectorIds.push(D),R.promises.set(D,{resolve:$,reject:U}),d()}).catch($=>{if(o.has(F))return o.get(F);throw $});return a.set(F,X),X})}return{Commitment:Pe,PlanType:Ta,Term:ne,applyPlanType:Jt,resolveOfferSelectors:h,flushWcsCacheInternal:p,prefillWcsCache:c,normalizeCountryLanguageAndLocale:u}}var no="mas-commerce-service",oo="mas-commerce-service:start",so="mas-commerce-service:ready",Rt,rt,it,co,lo,Fi=class extends HTMLElement{constructor(){super(...arguments);V(this,it);V(this,Rt);V(this,rt);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,a,n)=>{let s=await r?.(i,a,this.imsSignedInPromise,n);return s||null})}get featureFlags(){return A(this,rt)||q(this,rt,{[fe]:Bt(this,it,lo).call(this,fe)}),A(this,rt)}activate(){let r=A(this,it,co),i=ro(r,this);rr(r.lana);let a=se.init(r.hostEnv).module("service");a.debug("Activating:",r);let s={price:cn(i)},o={checkout:new Set,price:new Set},l={literals:s,providers:o,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...nn(l),...on(l),...to(l),...ao(l),...jr,Log:se,get defaults(){return C},get log(){return se},get providers(){return{checkout(c){return o.checkout.add(c),()=>o.checkout.delete(c)},price(c){return o.price.add(c),()=>o.price.delete(c)},has:c=>o.price.has(c)||o.checkout.has(c)}},get settings(){return i}})),a.debug("Activated:",{literals:s,settings:i});let d=new CustomEvent(Ft,{bubbles:!0,cancelable:!1,detail:this});performance.mark(so),q(this,Rt,performance.measure(so,oo)),this.dispatchEvent(d),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(oo),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(Er).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":Ut(A(this,Rt))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:a})=>a>this.lastLoggingTime).filter(({transferSize:a,duration:n,responseStatus:s})=>a===0&&n===0&&s<200||s>=400),i=Array.from(new Map(r.map(a=>[a.name,a])).values());if(i.some(({name:a})=>/(\/fragment\?|web_commerce_artifact)/.test(a))){let a=i.map(({name:n})=>n);this.log.error("Failed requests:",{failedUrls:a,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};Rt=new WeakMap,rt=new WeakMap,it=new WeakSet,co=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(a=>{let n=this.getAttribute(a);n&&(i[a]=n)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(a=>{let n=this.getAttribute(a);if(n!=null){let s=a.replace(/-([a-z])/g,o=>o[1].toUpperCase());i.commerce[s]=n}}),i},lo=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||H(r))};window.customElements.get(no)||window.customElements.define(no,Fi);var uo="merch-card-collection",Zc=2e4,Jc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},el={plans:!0},tl=(e,{filter:t})=>e.filter(r=>r?.filters&&r?.filters.hasOwnProperty(t)),rl=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,il=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),al=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),nl=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Ce,nt,Ot,It,gr,fo,at=class extends ho{constructor(){super();V(this,gr);V(this,Ce,{});V(this,nt);V(this,Ot);V(this,It);this.id=null,this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1,this.onUnmount=[]}render(){return ye`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(a=>setTimeout(()=>a(!1),Zc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,a=[...this.children].filter(d=>d.tagName==="MERCH-CARD");if(a.length===0)return;r.has("singleApp")&&this.singleApp&&a.forEach(d=>{d.updateFilters(d.name===this.singleApp)});let n=this.sort===de.alphabetical?il:al,o=[tl,rl,nl,n].reduce((d,c)=>c(d,this),a).map((d,c)=>[d,c]);if(this.resultCount=o.length,this.page&&this.limit){let d=this.page*this.limit;this.hasMore=o.length>d,o=o.filter(([,c])=>c<d)}let l=new Map(o.reverse());for(let d of l.keys())this.prepend(d);a.forEach(d=>{l.has(d)?(d.size=d.filters[this.filter]?.size,d.style.removeProperty("display"),d.requestUpdate()):(d.style.display="none",d.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(Tr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(ce,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){q(this,Ce,{}),this.overrides?.split(",").forEach(r=>{let[i,a]=r?.split(":");i&&a&&(A(this,Ce)[i]=a)})}connectedCallback(){super.connectedCallback(),q(this,nt,ut()),A(this,nt)&&q(this,Ot,A(this,nt).Log.module(uo)),q(this,It,customElements.get("merch-card")),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.();for(let r of this.onUnmount)r()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r,this.querySelectorAll("[placeholder]").forEach(a=>{let n=a.getAttribute("slot");this.header.placeholderKeys.includes(n)&&this.header.append(a)})}initializePlaceholders(){let r=this.data?.placeholders||{};!r.searchText&&this.data?.sidenavSettings?.searchText&&(r.searchText=this.data.sidenavSettings.searchText);for(let i of Object.keys(r)){let a=r[i],n=a.includes("<p>")?"div":"p",s=document.createElement(n);s.setAttribute("slot",i),s.setAttribute("placeholder",""),s.innerHTML=a,this.append(s)}}attachSidenav(r,i=!0){if(!r)return;i&&this.parentElement.prepend(r),this.sidenav=r,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),el[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(dt));let a=A(this,It)?.getCollectionOptions(this.variant)?.onSidenavAttached;a&&a(this)}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.id=r.getAttribute("fragment"),this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let a=this;function n(o){let l;return o.fields?.checkboxGroups?l=o.fields.checkboxGroups:o.fields?.tagFilters&&(l=[{title:o.fields?.tagFiltersTitle,label:"types",deeplink:"types",checkboxes:o.fields.tagFilters.map(d=>{let c=d.split("/").pop(),p=o.settings?.tagLabels?.[c]||c;return p=p.startsWith("coll-tag-filter")?c.charAt(0).toUpperCase()+c.slice(1):p,{name:c,label:p}})}]),{searchText:o.fields?.searchText,tagFilters:l,linksTitle:o.fields?.linksTitle,link:o.fields?.link,linkText:o.fields?.linkText,linkIcon:o.fields?.linkIcon}}function s(o,l){let d={cards:[],hierarchy:[],placeholders:o.placeholders,sidenavSettings:n(o)};function c(p,u){for(let h of u){if(h.fieldName==="variations")continue;if(h.fieldName==="cards"){if(d.cards.findIndex(x=>x.id===h.identifier)!==-1)continue;d.cards.push(o.references[h.identifier].value);continue}let m=o.references[h.identifier]?.value,f=h.referencesTree,v=l[h.identifier];if(v){let x=document.querySelector(`aem-fragment[fragment="${v}"]`)?.rawData;x?.fields&&(m=x,f=x.referencesTree,o.references={...o.references,...x.references})}if(!m?.fields)continue;let{fields:b}=m,E={label:b.label||"",icon:b.icon,iconLight:b.iconLight,queryLabel:b.queryLabel,cards:b.cards?b.cards.map(x=>l[x]||x):[],collections:[]};b.defaultchild&&(E.defaultchild=l[b.defaultchild]||b.defaultchild),p.push(E),c(E.collections,f)}}return c(d.hierarchy,o.referencesTree),d.hierarchy.length===0&&(a.filtered="all"),d}r.addEventListener(Cr,o=>{Bt(this,gr,fo).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(_r,async o=>{this.limit=27,this.data=s(o.detail,A(this,Ce));let{cards:l,hierarchy:d}=this.data,c=d.length===0&&o.detail.fields?.defaultchild?A(this,Ce)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...l);let p=(m,f)=>{for(let v of m)if(v.defaultchild===f||v.collections&&p(v.collections,f))return!0;return!1};for(let m of l){let x=function(k){for(let L of k){let D=L.cards.indexOf(v);if(D===-1)continue;let F=L.queryLabel??L?.label?.toLowerCase()??"";f.filters[F]={order:D+1,size:m.fields.size},x(L.collections)}},f=document.createElement("merch-card"),v=A(this,Ce)[m.id]||m.id;f.setAttribute("consonant",""),f.setAttribute("style","");let b=m.fields.tags?.filter(k=>k.startsWith("mas:types/")).map(k=>k.split("/")[1]).join(",");b&&f.setAttribute("types",b),$t(m.fields.variant)?.supportsDefaultChild&&(c?v===c:p(d,v))&&f.setAttribute("data-default-card","true"),x(d);let _=document.createElement("aem-fragment");_.setAttribute("fragment",v),f.append(_),Object.keys(f.filters).length===0&&(f.filters={all:{order:l.indexOf(m)+1,size:m.fields.size}}),this.append(f)}let u="",h=Ba(l[0]?.fields?.variant);this.variant=h,h==="plans"&&l.length===3&&!l.some(m=>m.fields?.size?.includes("wide"))&&(u="ThreeColumns"),h&&this.classList.add("merch-card-collection",h,...Jc[`${h}${u}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i(!0)}),await this.hydrationReady}get footer(){if(!this.filtered)return ye`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return ye`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===de.authored?lt({sort:void 0}):lt({sort:r.target.value}),this.dispatchEvent(new CustomEvent(Ar,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(Sr,{bubbles:!0,composed:!0}));let r=this.page+1;lt({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=Wi(({category:r,filter:i,types:a,sort:n,search:s,single_app:o,page:l})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{lt({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=a??"",this.search=s??"",this.singleApp=o,this.sort=n,this.page=Number(l)||1})}openFilters(r){this.sidenav?.showModal(r)}};Ce=new WeakMap,nt=new WeakMap,Ot=new WeakMap,It=new WeakMap,gr=new WeakSet,fo=function(r,i={},a=!0){A(this,Ot).error(`merch-card-collection: ${r}`,i),this.failed=!0,a&&this.dispatchEvent(new CustomEvent(Pr,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(at,"properties",{id:{type:String,attribute:"id",reflect:!0},displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:de.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(at,"styles",mo`
        #footer {
            grid-column: 1 / -1;
            justify-self: stretch;
            color: var(--merch-color-grey-80);
            order: 1000;
        }

        sp-theme {
            display: contents;
        }
    `);at.SortOrder=de;customElements.define(uo,at);var ol={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},sl=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(a=>{a.innerText=r||""})},cl={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},ll={catalog:"l"},te,ot,Nt=class extends ho{constructor(){super();V(this,te);V(this,ot);g(this,"tablet",new ct(this,I));g(this,"desktop",new ct(this,P));this.collection=null,q(this,te,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(ce,this.updateLiterals),this.collection?.addEventListener(dt,this.handleSidenavAttached),q(this,ot,customElements.get("merch-card"))}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(ce,this.updateLiterals),this.collection?.removeEventListener(dt,this.handleSidenavAttached)}willUpdate(){A(this,te).search=this.getVisibility("search"),A(this,te).filter=this.getVisibility("filter"),A(this,te).sort=this.getVisibility("sort"),A(this,te).result=this.getVisibility("result"),A(this,te).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let a=r[i];return a===!1?!1:a===!0?!0:a.includes(this.currentMedia)}getVisibility(r){let i=A(this,ot)?.getCollectionOptions(this.collection?.variant)?.headerVisibility,a=this.parseVisibilityOptions(i,r);return a!==null?a:this.parseVisibilityOptions(cl,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!A(this,te).search)return pe;let r=mt(this,"searchText");return r?ye`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${r}"
                      .size=${ll[this.variant]}
                      aria-label="${r}"
                  ></sp-search>
              </merch-search>
          `:pe}get filterAction(){return A(this,te).filter?this.sidenav?ye`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:pe:pe}get sortAction(){if(!A(this,te).sort)return pe;let r=mt(this,"sortText");if(!r)return;let i=mt(this,"popularityText"),a=mt(this,"alphabeticallyText");if(!(i&&a))return;let n=this.collection?.sort===de.alphabetical;return ye`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${n?de.alphabetical:de.authored}"
              >
                  <span slot="label-only"
                      >${r}:
                      ${n?a:i}</span
                  >
                  <sp-menu-item value="${de.authored}"
                      >${i}</sp-menu-item
                  >
                  <sp-menu-item value="${de.alphabetical}"
                      >${a}</sp-menu-item
                  >
              </sp-action-menu>
          `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return ol[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!A(this,te).result)return pe;if(!this.sidenav)return pe;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return ye`
            <div id="result" aria-live="polite" type=${r} quantity=${i}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!A(this,te).custom)return pe;let r=A(this,ot)?.getCollectionOptions(this.collection?.variant)?.customHeaderArea;if(!r)return pe;let i=r(this.collection);return!i||i===pe?pe:ye`<div id="custom" role="heading" aria-level="2">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{sl(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return ye`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};te=new WeakMap,ot=new WeakMap,g(Nt,"styles",mo`
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
          @media screen and ${po(I)} {
              :host {
                  --merch-card-collection-header-max-width: auto;
                  --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                  --merch-card-collection-header-areas: "search filter sort"
                                                        "result result result";
              }
          }

          /* Laptop */
          @media screen and ${po(P)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",Nt);export{at as MerchCardCollection,Nt as default};

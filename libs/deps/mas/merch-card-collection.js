var Vi=Object.defineProperty;var qi=e=>{throw TypeError(e)};var Ao=(e,t,r)=>t in e?Vi(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var So=(e,t)=>{for(var r in t)Vi(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>Ao(e,typeof t!="symbol"?t+"":t,r),yr=(e,t,r)=>t.has(e)||qi("Cannot "+r);var T=(e,t,r)=>(yr(e,t,"read from private field"),r?r.call(e):t.get(e)),G=(e,t,r)=>t.has(e)?qi("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),q=(e,t,r,i)=>(yr(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),Ut=(e,t,r)=>(yr(e,t,"access private method"),r);import{html as be,LitElement as ho,css as mo,unsafeCSS as po,nothing as pe}from"../lit-all.min.js";var V="(max-width: 767px)",j="(max-width: 1199px)",I="(min-width: 768px)",L="(min-width: 1200px)",re="(min-width: 1600px)",ji={matchMobile:window.matchMedia(V),matchDesktop:window.matchMedia(`${L} and (not ${re})`),matchDesktopOrUp:window.matchMedia(L),matchLargeDesktop:window.matchMedia(re),get isMobile(){return this.matchMobile.matches},get isDesktop(){return this.matchDesktop.matches},get isDesktopOrUp(){return this.matchDesktopOrUp.matches}},P=ji;function st(){return ji.isDesktop}var ct=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var Wi="hashchange";function To(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[n,a=""]=i.split("=");n&&t.push([n,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function lt(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([n,a])=>{a?t.set(n,a):t.delete(n)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function Yi(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=To(window.location.hash);e(r)};return t(),window.addEventListener(Wi,t),()=>{window.removeEventListener(Wi,t)}}var jr={};So(jr,{CLASS_NAME_FAILED:()=>Pr,CLASS_NAME_HIDDEN:()=>Co,CLASS_NAME_PENDING:()=>Mr,CLASS_NAME_RESOLVED:()=>kr,CheckoutWorkflow:()=>$o,CheckoutWorkflowStep:()=>Z,Commitment:()=>Ce,ERROR_MESSAGE_BAD_REQUEST:()=>Rr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>Uo,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>Nr,EVENT_AEM_ERROR:()=>Cr,EVENT_AEM_LOAD:()=>_r,EVENT_MAS_ERROR:()=>Lr,EVENT_MAS_READY:()=>Bo,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>Do,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>wr,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>ce,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>Sr,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>dt,EVENT_MERCH_CARD_COLLECTION_SORT:()=>Ar,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>Io,EVENT_MERCH_OFFER_READY:()=>Mo,EVENT_MERCH_OFFER_SELECT_READY:()=>ko,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>Le,EVENT_MERCH_SEARCH_CHANGE:()=>Ho,EVENT_MERCH_SIDENAV_SELECT:()=>Tr,EVENT_MERCH_STOCK_CHANGE:()=>No,EVENT_MERCH_STORAGE_CHANGE:()=>Oo,EVENT_OFFER_SELECTED:()=>Ro,EVENT_TYPE_FAILED:()=>Or,EVENT_TYPE_READY:()=>Ft,EVENT_TYPE_RESOLVED:()=>Ir,Env:()=>me,FF_DEFAULTS:()=>fe,HEADER_X_REQUEST_ID:()=>pt,LOG_NAMESPACE:()=>Dr,Landscape:()=>we,MARK_DURATION_SUFFIX:()=>Vr,MARK_START_SUFFIX:()=>Gr,MODAL_TYPE_3_IN_1:()=>Pe,NAMESPACE:()=>_o,PARAM_AOS_API_KEY:()=>Fo,PARAM_ENV:()=>Br,PARAM_LANDSCAPE:()=>Ur,PARAM_MAS_PREVIEW:()=>Hr,PARAM_WCS_API_KEY:()=>zo,PROVIDER_ENVIRONMENT:()=>$r,SELECTOR_MAS_CHECKOUT_LINK:()=>Xi,SELECTOR_MAS_ELEMENT:()=>Er,SELECTOR_MAS_INLINE_PRICE:()=>K,SELECTOR_MAS_SP_BUTTON:()=>Po,SELECTOR_MAS_UPT_LINK:()=>Ki,SORT_ORDER:()=>de,STATE_FAILED:()=>le,STATE_PENDING:()=>Ee,STATE_RESOLVED:()=>ue,SUPPORTED_COUNTRIES:()=>qr,SUPPORTED_LOCALE:()=>mt,TAG_NAME_SERVICE:()=>Lo,TEMPLATE_PRICE:()=>Go,TEMPLATE_PRICE_ANNUAL:()=>qo,TEMPLATE_PRICE_LEGAL:()=>ht,TEMPLATE_PRICE_STRIKETHROUGH:()=>Vo,Term:()=>ae,WCS_PROD_URL:()=>Fr,WCS_STAGE_URL:()=>zr});var Ce=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),ae=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),_o="merch",Co="hidden",Ft="wcms:commerce:ready",Lo="mas-commerce-service",K='span[is="inline-price"][data-wcs-osi]',Xi='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',Po="sp-button[data-wcs-osi]",Ki='a[is="upt-link"]',Er=`${K},${Xi},${Ki}`,Mo="merch-offer:ready",ko="merch-offer-select:ready",wr="merch-card:action-menu-toggle",Ro="merch-offer:selected",No="merch-stock:change",Oo="merch-storage:change",Le="merch-quantity-selector:change",Io="merch-card-quantity:change",Do="merch-modal:addon-and-quantity-update",Ho="merch-search:change",Ar="merch-card-collection:sort",ce="merch-card-collection:literals-changed",dt="merch-card-collection:sidenav-attached",Sr="merch-card-collection:showmore",Tr="merch-sidenav:select",_r="aem:load",Cr="aem:error",Bo="mas:ready",Lr="mas:error",Pr="placeholder-failed",Mr="placeholder-pending",kr="placeholder-resolved",Rr="Bad WCS request",Nr="Commerce offer not found",Uo="Literals URL not provided",Or="mas:failed",Ir="mas:resolved",Dr="mas/commerce",Hr="mas.preview",Br="commerce.env",Ur="commerce.landscape",Fo="commerce.aosKey",zo="commerce.wcsKey",Fr="https://www.adobe.com/web_commerce_artifact",zr="https://www.stage.adobe.com/web_commerce_artifact_stage",le="failed",Ee="pending",ue="resolved",we={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},pt="X-Request-Id",Z=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),$o="UCv3",me=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),$r={PRODUCTION:"PRODUCTION"},Pe={TWP:"twp",D2P:"d2p",CRM:"crm"},Gr=":start",Vr=":duration",Go="price",Vo="price-strikethrough",qo="annual",ht="legal",fe="mas-ff-defaults",de={alphabetical:"alphabetical",authored:"authored"},mt=["ar_AE","ar_DZ","ar_EG","ar_SA","bg_BG","cs_CZ","da_DK","de_AT","de_CH","de_DE","de_LU","el_GR","en_AU","en_AZ","en_BE","en_CA","en_CR","en_CY","en_DZ","en_EG","en_GB","en_GR","en_HK","en_ID","en_IE","en_IL","en_IN","en_LU","en_MT","en_MU","en_MY","en_NG","en_NZ","en_SA","en_SG","en_TH","en_US","en_ZA","es_AR","es_CL","es_CO","es_CR","es_DO","es_EC","es_ES","es_GT","es_LA","es_MX","es_PE","es_US","et_EE","fi_FI","fil_PH","fr_BE","fr_CA","fr_CH","fr_FR","fr_LU","hi_IN","hu_HU","in_ID","it_CH","it_IT","iw_IL","ja_JP","ko_KR","lt_LT","lv_LV","ms_MY","nb_NO","nl_BE","nl_NL","no_NO","pl_PL","pt_BR","pt_PT","ro_RO","ru_AZ","ru_RU","sk_SK","sl_SI","sv_SE","th_TH","tr_TR","uk_UA","zh_CN","zh_HK","zh-Hans_CN","zh-Hant_HK","zh-Hant_TW","zh_TW"],qr=["AE","AM","AR","AT","AU","AZ","BB","BD","BE","BG","BH","BO","BR","BS","BY","CA","CH","CL","CN","CO","CR","CY","CZ","DE","DK","DO","DZ","EC","EE","EG","ES","FI","FR","GB","GE","GH","GR","GT","HK","HN","HR","HU","ID","IE","IL","IN","IQ","IS","IT","JM","JO","JP","KE","KG","KR","KW","KZ","LB","LK","LT","LU","LV","MA","MD","MO","MT","MU","MX","MY","NG","NI","NL","NO","NP","NZ","OM","PA","PE","PH","PK","PL","PR","PT","PY","QA","RO","RS","RU","SA","SE","SG","SI","SK","SV","TH","TJ","TM","TN","TR","TT","TW","TZ","UA","US","UY","UZ","VE","VN","YE","ZA","LA"];var jo="mas-commerce-service";var ut=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Me(e,t={},r=null,i=null){let n=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,o]of Object.entries(t))n.setAttribute(a,o);return n}function zt(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Wr(){return window.matchMedia("(max-width: 1024px)").matches}function ft(){return document.getElementsByTagName(jo)?.[0]}function gt(e){let t=window.getComputedStyle(e);return e.offsetHeight+parseFloat(t.marginTop)+parseFloat(t.marginBottom)}import{html as $t,nothing as Wo}from"../lit-all.min.js";var ze,xt=class xt{constructor(t){g(this,"card");G(this,ze);this.card=t,this.insertVariantStyle()}getContainer(){return q(this,ze,T(this,ze)??this.card.closest('merch-card-collection, [class*="-merch-cards"]')??this.card.parentElement),T(this,ze)}insertVariantStyle(){if(!xt.styleMap[this.card.variant]){xt.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),$t`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return $t` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?$t`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:Wo}get secureLabelFooter(){return $t`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}syncHeights(){}renderLayout(){}get aemFragmentMapping(){return Gt(this.card.variant)}};ze=new WeakMap,g(xt,"styleMap",{});var N=xt;import{html as Yr,css as Yo}from"../lit-all.min.js";var Zi=`
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
}`;var Qi={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},shortDescription:{tag:"div",slot:"action-menu-content",attributes:{tabindex:"0"}},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},$e=class extends N{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(wr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),r.stopPropagation(),this.setMenuVisibility(!this.isMenuOpen()))});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.setIconVisibility(!1),this.actionMenuContentSlot&&r?.type==="mouseleave"&&this.setMenuVisibility(!1)});g(this,"showActionMenuOnHover",()=>{this.actionMenu&&this.setIconVisibility(!0)});g(this,"hideActionMenu",()=>{this.setMenuVisibility(!1),this.setIconVisibility(!1)});g(this,"hideActionMenuOnBlur",r=>{r.relatedTarget===this.actionMenu||this.actionMenu?.contains(r.relatedTarget)||this.slottedContent?.contains(r.relatedTarget)||(this.isMenuOpen()&&this.setMenuVisibility(!1),this.card.contains(r.relatedTarget)||this.setIconVisibility(!1))});g(this,"handleCardFocusOut",r=>{r.relatedTarget===this.actionMenu||this.actionMenu?.contains(r.relatedTarget)||r.relatedTarget===this.card||(this.slottedContent&&(r.target===this.slottedContent||this.slottedContent.contains(r.target))&&(this.slottedContent.contains(r.relatedTarget)||this.setMenuVisibility(!1)),!this.card.contains(r.relatedTarget)&&!this.isMenuOpen()&&this.setIconVisibility(!1))});g(this,"handleKeyDown",r=>{(r.key==="Escape"||r.key==="Esc")&&(r.preventDefault(),this.hideActionMenu(),this.actionMenu?.focus())})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}get slottedContent(){return this.card.querySelector('[slot="action-menu-content"]')}setIconVisibility(r){Wr()&&this.card.actionMenu||(this.actionMenu?.classList.toggle("hidden",!r),this.actionMenu?.classList.toggle("always-visible",r))}setMenuVisibility(r){this.actionMenuContentSlot?.classList.toggle("hidden",!r),this.setAriaExpanded(this.actionMenu,r.toString()),r&&(this.dispatchActionMenuToggle(),setTimeout(()=>{let i=this.slottedContent?.querySelector("a");i&&i.focus()},0))}isMenuOpen(){return!this.actionMenuContentSlot?.classList.contains("hidden")}renderLayout(){return Yr` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Wr()&&this.card.actionMenu?"always-visible":"hidden"}"
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
            <slot></slot>`}getGlobalCSS(){return Zi}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseenter",this.showActionMenuOnHover),this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusin",this.showActionMenuOnHover),this.card.addEventListener("focusout",this.handleCardFocusOut),this.card.addEventListener("keydown",this.handleKeyDown)}disconnectedCallbackHook(){this.card.removeEventListener("mouseenter",this.showActionMenuOnHover),this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusin",this.showActionMenuOnHover),this.card.removeEventListener("focusout",this.handleCardFocusOut),this.card.removeEventListener("keydown",this.handleKeyDown)}};g($e,"variantStyle",Yo`
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
    `);import{html as vt}from"../lit-all.min.js";var Ji=`
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
`;var Vt=class extends N{constructor(t){super(t)}getGlobalCSS(){return Ji}renderLayout(){return vt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?vt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:vt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?vt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:vt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as tn}from"../lit-all.min.js";var en=`
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
`;var qt=class extends N{constructor(t){super(t)}getGlobalCSS(){return en}renderLayout(){return tn` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":tn`<hr />`} ${this.secureLabelFooter}`}};import{html as Ge,css as Xo,unsafeCSS as nn}from"../lit-all.min.js";var rn=`
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
`;var Ko=32,Ve=class extends N{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Ge`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Ge`<slot name="secure-transaction-label"></slot>`;return Ge`<footer>${r}<slot name="footer"></slot></footer>`});this.updatePriceQuantity=this.updatePriceQuantity.bind(this)}connectedCallbackHook(){this.card.addEventListener(Le,this.updatePriceQuantity)}disconnectedCallbackHook(){this.card.removeEventListener(Le,this.updatePriceQuantity)}updatePriceQuantity({detail:r}){!this.mainPrice||!r?.option||(this.mainPrice.dataset.quantity=r.option)}getGlobalCSS(){return rn}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer"),this.card.shadowRoot.querySelector(".mini-compare-chart-badge")?.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,n)=>{let a=Math.max(Ko,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${K}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,n=this.headingMPriceSlot;if(!i&&n){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=Me("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=Me("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,n=this.card.planType;if(i&&(await i.onceSettled(),n=i.value?.[0]?.planType),!n)return;r.planType=n,this.card.querySelector("merch-addon[plan-type]")?.updateComplete.then(()=>{this.updateCardElementMinHeight(this.card.shadowRoot.querySelector('slot[name="addon"]'),"addon")})}renderLayout(){return Ge` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),P.isMobile?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(Ve,"variantStyle",Xo`
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

    @media screen and ${nn(j)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${nn(L)} {
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
  `);import{html as bt,css as Zo,nothing as jt}from"../lit-all.min.js";var an=`
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
@media screen and ${V} {
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
`;var Wt={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},on={...function(){let{whatsIncluded:e,size:t,...r}=Wt;return r}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},sn={...function(){let{subtitle:e,whatsIncluded:t,size:r,quantitySelect:i,...n}=Wt;return n}()},Q=class extends N{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===ht&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return an}adjustSlotPlacement(t,r,i){let n=this.card.shadowRoot,a=n.querySelector("footer"),o=this.card.getAttribute("size");if(!o)return;let s=n.querySelector(`footer slot[name="${t}"]`),c=n.querySelector(`.body slot[name="${t}"]`),l=n.querySelector(".body");if(o.includes("wide")||(a?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(a?.classList.toggle("wide-footer",P.isDesktopOrUp),!i&&s){if(c)s.remove();else{let d=l.querySelector(`[data-placeholder-for="${t}"]`);d?d.replaceWith(s):l.appendChild(s)}return}if(i&&c){let d=document.createElement("div");if(d.setAttribute("data-placeholder-for",t),d.classList.add("slot-placeholder"),!s){let u=c.cloneNode(!0);a.prepend(u)}c.replaceWith(d)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],P.isDesktopOrUp),this.adjustSlotPlacement("callout-content",["super-wide"],P.isDesktopOrUp)}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let r=this.card.querySelector('[slot="body-xs"]');if(!r)return;let i=r.querySelector("ul");if(!i)return;let n=i.previousElementSibling,a=document.createElement("div");a.classList.add("spacer"),r.insertBefore(a,n);let o=new IntersectionObserver(([s])=>{if(s.boundingClientRect.height===0)return;let c=0,l=this.card.querySelector('[slot="heading-s"]');l&&(c+=gt(l));let d=this.card.querySelector('[slot="subtitle"]');d&&(c+=gt(d));let u=this.card.querySelector('[slot="heading-m"]');u&&(c+=8+gt(u));for(let p of r.childNodes){if(p.classList.contains("spacer"))break;c+=gt(p)}let m=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");c>(parseFloat(m)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${c}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${c}px`),o.disconnect()});o.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.legalAdjusted||(await this.adjustLegal(),await this.adjustEduLists())}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${K}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?bt`<div class="divider"></div>`:jt}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=[],r=this.card.querySelector(`[slot="heading-m"] ${K}[data-template="price"]`);r&&t.push(r);let i=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling),await a.onceSettled())});await Promise.all(i)}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?bt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:jt}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?jt:bt`<slot name="icons"></slot>`}connectedCallbackHook(){P.matchMobile.addEventListener("change",this.adaptForMedia),P.matchDesktopOrUp.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){P.matchMobile.removeEventListener("change",this.adaptForMedia),P.matchDesktopOrUp.removeEventListener("change",this.adaptForMedia)}renderLayout(){return bt` ${this.badge}
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
            <slot></slot>`}};g(Q,"variantStyle",Zo`
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
    `),g(Q,"collectionOptions",{customHeaderArea:t=>t.sidenav?bt`<slot name="resultsText"></slot>`:jt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]},onSidenavAttached:t=>{let r=()=>{let i=t.querySelectorAll("merch-card");for(let a of i)a.hasAttribute("data-size")&&(a.setAttribute("size",a.getAttribute("data-size")),a.removeAttribute("data-size"));if(!P.isDesktop)return;let n=0;for(let a of i){if(a.style.display==="none")continue;let o=a.getAttribute("size"),s=o==="wide"?2:o==="super-wide"?3:1;s===2&&n%3===2&&(a.setAttribute("data-size",o),a.removeAttribute("size"),s=1),n+=s}};P.matchDesktop.addEventListener("change",r),t.addEventListener(ce,r),t.onUnmount.push(()=>{P.matchDesktop.removeEventListener("change",r),t.removeEventListener(ce,r)})}});import{html as qe,css as Qo,unsafeCSS as ln,nothing as Yt}from"../lit-all.min.js";var cn=`
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

@media screen and ${V}, ${j} {
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
@media screen and ${V} {
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
`;var dn={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},shortDescription:{tag:"p",slot:"short-description"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-red-700-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans","spectrum-red-700-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans","spectrum-red-700-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},Ae=class extends N{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this),this.toggleShortDescription=this.toggleShortDescription.bind(this),this.shortDescriptionExpanded=!1}priceOptionsProvider(t,r){t.dataset.template===ht&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return cn}adjustSlotPlacement(t,r,i){let{shadowRoot:n}=this.card,a=n.querySelector("footer"),o=n.querySelector(".body"),s=this.card.getAttribute("size");if(!s)return;let c=n.querySelector(`footer slot[name="${t}"]`),l=n.querySelector(`.body slot[name="${t}"]`);if(s.includes("wide")||(a?.classList.remove("wide-footer"),c?.remove()),!!r.includes(s)){if(a?.classList.toggle("wide-footer",P.isDesktopOrUp),!i&&c){if(l)c.remove();else{let d=o.querySelector(`[data-placeholder-for="${t}"]`);d?d.replaceWith(c):o.appendChild(c)}return}if(i&&l){let d=document.createElement("div");d.setAttribute("data-placeholder-for",t),d.classList.add("slot-placeholder"),c||a.prepend(l.cloneNode(!0)),l.replaceWith(d)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards,.columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("heading-m",["wide"],!0),this.adjustSlotPlacement("addon",["super-wide"],P.isDesktopOrUp),this.adjustSlotPlacement("callout-content",["super-wide"],P.isDesktopOrUp)}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');if(!t?.title)return;t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip");let r=i=>{i===t?t.classList.toggle("hide-tooltip"):t.classList.add("hide-tooltip")};document.addEventListener("touchstart",i=>{i.preventDefault(),r(i.target)}),document.addEventListener("mouseover",i=>{i.preventDefault(),i.target!==t?t.classList.add("hide-tooltip"):t.classList.remove("hide-tooltip")})}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.updateShortDescriptionVisibility(),this.legalAdjusted||await this.adjustLegal()}get mainPrice(){return this.card.querySelector(`[slot="heading-m"] ${K}[data-template="price"]`)}async adjustLegal(){if(!this.legalAdjusted)try{this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let t=this.mainPrice;if(!t)return;let r=t.cloneNode(!0);if(await t.onceSettled(),!t?.options)return;t.options.displayPerUnit&&(t.dataset.displayPerUnit="false"),t.options.displayTax&&(t.dataset.displayTax="false"),t.options.displayPlanType&&(t.dataset.displayPlanType="false"),r.setAttribute("data-template","legal"),t.parentNode.insertBefore(r,t.nextSibling),await r.onceSettled()}catch{}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?qe`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Yt}get hasShortDescription(){return!!this.card.querySelector('[slot="short-description"]')}get shortDescriptionLabel(){let t=this.card.querySelector('[slot="short-description"]'),r=t.querySelector("strong, b");if(r?.textContent?.trim())return r.textContent.trim();let i=t.querySelector("h1, h2, h3, h4, h5, h6, p");return i?.textContent?.trim()?i.textContent.trim():t.textContent?.trim().split(`
`)[0].trim()}updateShortDescriptionVisibility(){let t=this.card.querySelector('[slot="short-description"]');if(!t)return;let r=t.querySelector("strong, b, p");r&&(P.isDesktopOrUp?r.style.display="":r.style.display="none")}toggleShortDescription(){this.shortDescriptionExpanded=!this.shortDescriptionExpanded,this.card.requestUpdate()}get shortDescriptionToggle(){return this.hasShortDescription?P.isDesktopOrUp?qe`
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
        `:Yt}get icons(){return this.card.querySelector('[slot="icons"]')||this.card.getAttribute("id")?qe`<slot name="icons"></slot>`:Yt}connectedCallbackHook(){this.handleMediaChange=()=>{this.adaptForMedia(),this.updateShortDescriptionVisibility(),this.card.requestUpdate()},P.matchMobile.addEventListener("change",this.handleMediaChange),P.matchDesktopOrUp.addEventListener("change",this.handleMediaChange)}disconnectedCallbackHook(){P.matchMobile.removeEventListener("change",this.handleMediaChange),P.matchDesktopOrUp.removeEventListener("change",this.handleMediaChange)}renderLayout(){return qe` ${this.badge}
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
            <slot></slot>`}};g(Ae,"variantStyle",Qo`
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

        @media screen and ${ln(V)}, ${ln(j)} {
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
    `),g(Ae,"collectionOptions",{customHeaderArea:t=>t.sidenav?qe`<slot name="resultsText"></slot>`:Yt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]},onSidenavAttached:t=>{let r=()=>{let i=t.querySelectorAll("merch-card");if(i.forEach(a=>{a.hasAttribute("data-size")&&(a.setAttribute("size",a.getAttribute("data-size")),a.removeAttribute("data-size"))}),!P.isDesktop)return;let n=0;i.forEach(a=>{if(a.style.display==="none")return;let o=a.getAttribute("size"),s=o==="wide"?2:o==="super-wide"?3:1;s===2&&n%3===2&&(a.setAttribute("data-size",o),a.removeAttribute("size"),s=1),n+=s})};P.matchDesktop.addEventListener("change",r),t.addEventListener(ce,r),t.onUnmount.push(()=>{P.matchDesktop.removeEventListener("change",r),t.removeEventListener(ce,r)})}});import{html as Xr,css as Jo}from"../lit-all.min.js";var pn=`
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
`;var je=class extends N{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this),this.updatePriceQuantity=this.updatePriceQuantity.bind(this)}getGlobalCSS(){return pn}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Xr` ${this.badge}
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
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook),this.card.addEventListener(Le,this.updatePriceQuantity)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook),this.card.removeEventListener(Le,this.updatePriceQuantity)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),P.isMobile||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${K}[data-template="price"]`)}updatePriceQuantity({detail:t}){!this.mainPrice||!t?.option||(this.mainPrice.dataset.quantity=t.option)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=Me("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=Me("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g(je,"variantStyle",Jo`
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
    `);import{html as Kr,css as es}from"../lit-all.min.js";var hn=`
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
`;var We=class extends N{constructor(t){super(t)}getGlobalCSS(){return hn}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Kr` ${this.badge}
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
  `);import{html as Zr,css as ts}from"../lit-all.min.js";var mn=`
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
`;var un={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Ye=class extends N{constructor(t){super(t)}getGlobalCSS(){return mn}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Zr`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Zr`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Zr`
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
    `);import{html as rs,css as is}from"../lit-all.min.js";var fn=`
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
`;var Qr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"XL"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:["badgeColor","badgeBorderColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},Xe=class extends N{getGlobalCSS(){return fn}get aemFragmentMapping(){return Qr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="body-xs"]');t&&this.updateCardElementMinHeight(t,"description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,this.card.prices?.length&&await Promise.all(this.card.prices.map(t=>t.onceSettled?.())),st())){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-description-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(a=>a.variantLayout?.syncHeights?.())})}}connectedCallbackHook(){!this.card||this.card.failed||(this.setupAccordion(),this.card?.hasAttribute("data-default-card")&&!st()&&this.card.setAttribute("data-expanded","true"))}setupAccordion(){let t=this.card;if(!t)return;let r=()=>{if(st())t.removeAttribute("data-expanded");else{let n=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",n?"true":"false")}};r();let i=window.matchMedia(j);this.mediaQueryListener=()=>{r()},i.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia(j).removeEventListener("change",this.mediaQueryListener)}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||st())return;let a=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",a)}renderLayout(){return rs`
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
    `);import{html as ns,css as as}from"../lit-all.min.js";var gn=`
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
`;var Jr={title:{tag:"h3",slot:"heading-xs",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge",default:"spectrum-blue-400"},allowedBadgeColors:["spectrum-blue-400","spectrum-gray-300","spectrum-yellow-300","gradient-purple-blue","gradient-firefly-spectrum"],description:{tag:"div",slot:"body-s",maxCount:2e3,withSuffix:!1},shortDescription:{tag:"div",slot:"short-description",maxCount:3e3,withSuffix:!1},prices:{tag:"div",slot:"price"},trialBadge:{tag:"div",slot:"trial-badge"},ctas:{slot:"cta",size:"XL"},mnemonics:{size:"l"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)","gradient-purple-blue":"linear-gradient(96deg, #B539C8 0%, #7155FA 66%, #3B63FB 100%)","gradient-firefly-spectrum":"linear-gradient(96deg, #D73220 0%, #D92361 33%, #7155FA 100%)"}},disabledAttributes:[]},Ke=class extends N{getGlobalCSS(){return gn}get aemFragmentMapping(){return Jr}get headingSelector(){return'[slot="heading-xs"]'}syncHeights(){if(this.card.getBoundingClientRect().width<=2)return;let t=this.card.querySelector('[slot="short-description"]');t&&this.updateCardElementMinHeight(t,"short-description");let r=this.card.querySelector('[slot="price"]');r&&this.updateCardElementMinHeight(r,"price");let i=this.card.querySelector('[slot="cta"]');i&&this.updateCardElementMinHeight(i,"cta")}async postCardUpdateHook(){if(this.card.isConnected&&(await this.card.updateComplete,await Promise.all(this.card.prices.map(t=>t.onceSettled())),window.matchMedia("(min-width: 1025px)").matches)){let t=this.getContainer();if(!t)return;let r=`--consonant-merch-card-${this.card.variant}`,i=t.style.getPropertyValue(`${r}-price-height`);requestAnimationFrame(i?()=>{this.syncHeights()}:()=>{t.querySelectorAll(`merch-card[variant="${this.card.variant}"]`).forEach(a=>a.variantLayout?.syncHeights?.())})}}renderLayout(){return ns`
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
        `}};g(Ke,"variantStyle",as`
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
    `);import{css as os,html as ss}from"../lit-all.min.js";var xn=`
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
`;var vn={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},Ze=class extends N{constructor(){super(...arguments);g(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return xn}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(r,i){i.literals={...i.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},i.space=!0,i.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let r=this.card.querySelector(`${K}[data-template="price"]`);if(!r)return;let i=r.cloneNode(!0);this.legal=i,r.dataset.displayTax="false",i.dataset.template="legal",i.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,i.setAttribute("slot","legal"),this.card.appendChild(i)}renderLayout(){return ss`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};g(Ze,"variantStyle",os`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--consonant-merch-card-border-color, #dadada);
        }
    `);var bn=new Map,J=(e,t,r=null,i=null,n)=>{bn.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:n})};J("catalog",$e,Qi,$e.variantStyle);J("image",Vt);J("inline-heading",qt);J("mini-compare-chart",Ve,null,Ve.variantStyle);J("plans",Q,Wt,Q.variantStyle,Q.collectionOptions);J("plans-students",Q,sn,Q.variantStyle,Q.collectionOptions);J("plans-education",Q,on,Q.variantStyle,Q.collectionOptions);J("plans-v2",Ae,dn,Ae.variantStyle,Ae.collectionOptions);J("product",je,null,je.variantStyle);J("segment",We,null,We.variantStyle);J("special-offers",Ye,un,Ye.variantStyle);J("simplified-pricing-express",Xe,Qr,Xe.variantStyle);J("full-pricing-express",Ke,Jr,Ke.variantStyle);J("mini",Ze,vn,Ze.variantStyle);function Gt(e){return bn.get(e)?.fragmentMapping}var yn="tacocat.js";var ei=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),En=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function D(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=Qe(i)?i:e;a=o.get(s)}if(n&&a==null){let o=Qe(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=ls(Qe(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var cs=e=>typeof e=="boolean",Xt=e=>typeof e=="function",Kt=e=>typeof e=="number",wn=e=>e!=null&&typeof e=="object";var Qe=e=>typeof e=="string",An=e=>Qe(e)&&e,yt=e=>Kt(e)&&Number.isFinite(e)&&e>0;function Zt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function w(e,t){if(cs(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function Et(e,t,r){let i=Object.values(t);return i.find(n=>ei(n,e))??r??i[0]}function ls(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function Sn(e,t=1){return Kt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var ds=Date.now(),ti=()=>`(+${Date.now()-ds}ms)`,Qt=new Set,ps=w(D("tacocat.debug",{},{metadata:!1}),!1);function Tn(e){let t=`[${yn}/${e}]`,r=(o,s,...c)=>o?!0:(n(s,...c),!1),i=ps?(o,...s)=>{console.debug(`${t} ${o}`,...s,ti())}:()=>{},n=(o,...s)=>{let c=`${t} ${o}`;Qt.forEach(([l])=>l(c,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let c=`${t} ${o}`;Qt.forEach(([,l])=>l(c,...s))}}}function hs(e,t){let r=[e,t];return Qt.add(r),()=>{Qt.delete(r)}}hs((e,...t)=>{console.error(e,...t,ti())},(e,...t)=>{console.warn(e,...t,ti())});var ms="no promo",_n="promo-tag",us="yellow",fs="neutral",gs=(e,t,r)=>{let i=a=>a||ms,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},xs="cancel-context",Jt=(e,t)=>{let r=e===xs,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?_n:`${_n} no-promo`,text:gs(o,t,n),variant:a?us:fs,isOverriden:n}};var ri;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(ri||(ri={}));var ie;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(ie||(ie={}));var oe;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(oe||(oe={}));var ii;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(ii||(ii={}));var ni;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(ni||(ni={}));var ai;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(ai||(ai={}));var oi;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(oi||(oi={}));var si="ABM",ci="PUF",li="M2M",di="PERPETUAL",pi="P3Y",vs="TAX_INCLUSIVE_DETAILS",bs="TAX_EXCLUSIVE",Cn={ABM:si,PUF:ci,M2M:li,PERPETUAL:di,P3Y:pi},Lp={[si]:{commitment:ie.YEAR,term:oe.MONTHLY},[ci]:{commitment:ie.YEAR,term:oe.ANNUAL},[li]:{commitment:ie.MONTH,term:oe.MONTHLY},[di]:{commitment:ie.PERPETUAL,term:void 0},[pi]:{commitment:ie.THREE_MONTHS,term:oe.P3Y}},Ln="Value is not an offer",er=e=>{if(typeof e!="object")return Ln;let{commitment:t,term:r}=e,i=ys(t,r);return{...e,planType:i}};var ys=(e,t)=>{switch(e){case void 0:return Ln;case"":return"";case ie.YEAR:return t===oe.MONTHLY?si:t===oe.ANNUAL?ci:"";case ie.MONTH:return t===oe.MONTHLY?li:"";case ie.PERPETUAL:return di;case ie.TERM_LICENSE:return t===oe.P3Y?pi:"";default:return""}};function Pn(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==vs)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:bs}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Es="mas-commerce-service",ws={requestId:pt,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function wt(e,{country:t,forceTaxExclusive:r}){let i;if(e.length<2)i=e;else{let n=t==="GB"?"EN":"MULT";e.sort((a,o)=>a.language===n?-1:o.language===n?1:0),e.sort((a,o)=>!a.term&&o.term?-1:a.term&&!o.term?1:0),i=[e[0]]}return r&&(i=i.map(Pn)),i}var tr=e=>window.setTimeout(e);function Je(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(Sn).filter(yt);return r.length||(r=[t]),r}function rr(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(An)}function ee(){return document.getElementsByTagName(Es)?.[0]}function Mn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,n]of Object.entries(ws)){let a=r.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[i]=a)}return t}var ke={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},kn=1e3;function As(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Rn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ke.serializableTypes.includes(r))return r}return e}function Ss(e,t){if(!ke.ignoredProperties.includes(e))return Rn(t)}var hi={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(l=>{l!=null&&(As(l)?i:n).push(l)}),i.length&&(a+=" "+i.map(Rn).join(" "));let{pathname:o,search:s}=window.location,c=`${ke.delimiter}page=${o}${s}`;c.length>kn&&(c=`${c.slice(0,kn)}<trunc>`),a+=c,n.length&&(a+=`${ke.delimiter}facts=`,a+=JSON.stringify(n,Ss)),window.lana?.log(a,ke)}};function ir(e){Object.assign(ke,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ke&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Nn={LOCAL:"local",PROD:"prod",STAGE:"stage"},mi={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},ui=new Set,fi=new Set,On=new Map,In={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},Dn={filter:({level:e})=>e!==mi.DEBUG},Ts={filter:()=>!1};function _s(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&Xt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:performance.now().toFixed(3)}}function Cs(e){[...fi].every(t=>t(e))&&ui.forEach(t=>t(e))}function Hn(e){let t=(On.get(e)??0)+1;On.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>Hn(`${i.namespace}/${n}`),updateConfig:ir};return Object.values(mi).forEach(n=>{i[n]=(a,...o)=>Cs(_s(n,a,e,o,r))}),Object.seal(i)}function nr(...e){e.forEach(t=>{let{append:r,filter:i}=t;Xt(i)&&fi.add(i),Xt(r)&&ui.add(r)})}function Ls(e={}){let{name:t}=e,r=w(D("commerce.debug",{search:!0,storage:!0}),t===Nn.LOCAL);return nr(r?In:Dn),t===Nn.PROD&&nr(hi),se}function Ps(){ui.clear(),fi.clear()}var se={...Hn(Dr),Level:mi,Plugins:{consoleAppender:In,debugFilter:Dn,quietFilter:Ts,lanaAppender:hi},init:Ls,reset:Ps,use:nr};var et=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let n=r.response.headers?.get(pt);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,n])=>`${i}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var Ms={[le]:Pr,[Ee]:Mr,[ue]:kr},ks={[le]:Or,[ue]:Ir},At,Se=class{constructor(t){G(this,At);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",Ee);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=se.module("mas-element")}update(){[le,Ee,ue].forEach(t=>{this.wrapperElement.classList.toggle(Ms[t],t===this.state)})}notify(){(this.state===ue||this.state===le)&&(this.state===ue?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===le&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof et&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(ks[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){q(this,At,ee()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return ue===i?Promise.resolve(this.wrapperElement):le===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=ue,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),tr(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=le,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...T(this,At)?.duration}),tr(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=Ee,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!ee()||this.timer)return;let{error:r,options:i,state:n,value:a,version:o}=this;this.state=Ee,this.timer=tr(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===Ee&&this.version===o&&(this.state=n,this.error=r,this.value=a,this.update(),this.notify())}catch(c){this.toggleFailed(this.version,c,i)}})}};At=new WeakMap;function Bn(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function ar(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,Bn(t)),n}function Un(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Bn(t)),e):null}function Rs(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Oe,Re=class Re extends HTMLAnchorElement{constructor(){super();g(this,"masElement",new Se(this));G(this,Oe);this.setAttribute("is",Re.is)}get isUptLink(){return!0}initializeWcsData(r,i){this.setAttribute("data-wcs-osi",r),i&&this.setAttribute("data-promotion-code",i)}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),q(this,Oe,ft()),T(this,Oe)&&(this.log=T(this,Oe).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),q(this,Oe,void 0)}requestUpdate(r=!1){this.masElement.requestUpdate(r)}onceSettled(){return this.masElement.onceSettled()}async render(){let r=ft();if(!r)return!1;this.dataset.imsCountry||r.imsCountryPromise.then(o=>{o&&(this.dataset.imsCountry=o)});let i=r.collectCheckoutOptions({},this);if(!i.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(i),a=r.resolveOfferSelectors(i);try{let[[o]]=await Promise.all(a),{country:s,language:c,env:l}=i,d=`locale=${c}_${s}&country=${s}&offer_id=${o.offerId}`,u=this.getAttribute("data-promotion-code");u&&(d+=`&promotion_code=${encodeURIComponent(u)}`),this.href=`${Rs(l)}?${d}`,this.masElement.toggleResolved(n,o,i)}catch(o){let s=new Error(`Could not resolve offer selectors for id: ${i.wcsOsi}.`,o.message);return this.masElement.toggleFailed(n,s,i),!1}}static createFrom(r){let i=new Re;for(let n of r.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?i.setAttribute("class",n.value.replace("upt-link","").trim()):i.setAttribute(n.name,n.value));return i.innerHTML=r.innerHTML,i.setAttribute("tabindex",0),i}};Oe=new WeakMap,g(Re,"is","upt-link"),g(Re,"tag","a"),g(Re,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var Ne=Re;window.customElements.get(Ne.is)||window.customElements.define(Ne.is,Ne,{extends:Ne.tag});function Fn(e){return e&&(e.startsWith("plans")?"plans":e)}var Ns=/[0-9\-+#]/,Os=/[^\d\-+#]/g;function zn(e){return e.search(Ns)}function Is(e="#.##"){let t={},r=e.length,i=zn(e);t.prefix=i>0?e.substring(0,i):"";let n=zn(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Os);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Ds(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,Hs(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function Hs(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let c=0;c<o;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Bs(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=Is(e),n=Ds(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var $n=Bs;var Gn=".",Us=",",qn=/^\s+/,jn=/\s+$/,Vn="&nbsp;",gi=e=>e*12,De=(e,t,r=1)=>{if(!e)return!1;let{start:i,end:n,displaySummary:{amount:a,duration:o,minProductQuantity:s=1,outcomeType:c}={}}=e;if(!(a&&o&&c)||r<s)return!1;let l=t?new Date(t):new Date;if(!i||!n)return!1;let d=new Date(i),u=new Date(n);return l>=d&&l<=u},Ie={MONTH:"MONTH",YEAR:"YEAR"},Fs={[ae.ANNUAL]:12,[ae.MONTHLY]:1,[ae.THREE_YEARS]:36,[ae.TWO_YEARS]:24},xi=(e,t)=>({accept:e,round:t}),zs=[xi(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),xi(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),xi(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],vi={[Ce.YEAR]:{[ae.MONTHLY]:Ie.MONTH,[ae.ANNUAL]:Ie.YEAR},[Ce.MONTH]:{[ae.MONTHLY]:Ie.MONTH}},$s=(e,t)=>e.indexOf(`'${t}'`)===0,Gs=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=Yn(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+qs(e)),r},Vs=e=>{let t=js(e),r=$s(e,t),i=e.replace(/'.*?'/,""),n=qn.test(i)||jn.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},Wn=e=>e.replace(qn,Vn).replace(jn,Vn),qs=e=>e.match(/#(.?)#/)?.[1]===Gn?Us:Gn,js=e=>e.match(/'(.*?)'/)?.[1]??"",Yn=e=>e.match(/0(.?)0/)?.[1]??"";function tt({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:c}=Vs(e),l=r?Yn(e):"",d=Gs(e,r),u=r?2:0,m=a(t,{currencySymbol:o}),p=i?m.toLocaleString("hi-IN",{minimumFractionDigits:u,maximumFractionDigits:u}):$n(d,m),h=r?p.lastIndexOf(l):p.length,f=p.substring(0,h),x=p.substring(h+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,p).replace(/SYMBOL/,o),currencySymbol:o,decimals:x,decimalsDelimiter:l,hasCurrencySpace:c,integer:f,isCurrencyFirst:s,recurrenceTerm:n}}var Xn=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=Fs[r]??1;return tt(e,n>1?Ie.MONTH:vi[t]?.[r],a=>{let o={divisor:n,price:a,usePrecision:i},{round:s}=zs.find(({accept:c})=>c(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},Kn=({commitment:e,term:t,...r})=>tt(r,vi[e]?.[t]),Zn=e=>{let{commitment:t,instant:r,price:i,originalPrice:n,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:c}=e;if(t===Ce.YEAR&&c===ae.MONTHLY){if(!o)return tt(e,Ie.YEAR,gi);let{displaySummary:{outcomeType:l,duration:d}={}}=o;switch(l){case"PERCENTAGE_DISCOUNT":if(De(o,r,s)){let u=parseInt(d.replace("P","").replace("M",""));if(isNaN(u))return gi(i);let m=n*u,p=a*(12-u),h=Math.round((m+p)*100)/100;return tt({...e,price:h},Ie.YEAR)}default:return tt(e,Ie.YEAR,()=>gi(a??i))}}return tt(e,vi[t]?.[c])};var Qn="download",Jn="upgrade",ea={e:"EDU",t:"TEAM"};function ta(e,t={},r=""){let i=ee();if(!i)return null;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:p,extraOptions:h,analyticsId:f}=i.collectCheckoutOptions(t),x=ar(e,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:c,modal:l,perpetual:d,promotionCode:u,quantity:m,wcsOsi:p,extraOptions:h,analyticsId:f});return r&&(x.innerHTML=`<span style="pointer-events: none;">${r}</span>`),x}function ra(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Se(this))}attributeChangedCallback(i,n,a){this.masElement.attributeChangedCallback(i,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return ea[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return ea[i]??i}get is3in1Modal(){return Object.values(Pe).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let n=ee();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(p=>{p&&(this.dataset.imsCountry=p)}),i.imsCountry=null;let a=n.collectCheckoutOptions(i,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(p){this.masElement.log?.error("cannot parse exta checkout options",p)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let c=n.resolveOfferSelectors(a),l=await Promise.all(c);l=l.map(p=>wt(p,a));let d=l.flat().find(p=>p.promotion);!De(d?.promotion,d?.promotion?.displaySummary?.instant,a.quantity[0])&&a.promotionCode&&delete a.promotionCode,a.country=this.dataset.imsCountry||a.country;let m=await n.buildCheckoutAction?.(l.flat(),{...o,...a},this);return this.renderOffers(l.flat(),a,{},m,s)}renderOffers(i,n,a={},o=void 0,s=void 0){let c=ee();if(!c)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"{}"),...n,...a},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(Qn,Jn),this.masElement.toggleResolved(s,i,n);let{url:d,text:u,className:m,handler:p}=o;d&&this.setCheckoutUrl(d),u&&(this.firstElementChild.innerHTML=u),m&&this.classList.add(...m.split(" ")),p&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=p.bind(this))}if(i.length){if(this.masElement.toggleResolved(s,i,n)){if(!this.classList.contains(Qn)&&!this.classList.contains(Jn)){let d=c.buildCheckoutURL(i,n);this.setCheckoutUrl(n.modal==="true"?"#":d)}return!0}}else{let d=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,d,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let n=ee();if(!n)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:u,promotionCode:m,quantity:p,wcsOsi:h}=n.collectCheckoutOptions(i);return Un(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:d,perpetual:u,promotionCode:m,quantity:p,wcsOsi:h}),!0}}}var St=class St extends ra(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return ta(St,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(St,"is","checkout-link"),g(St,"tag","a");var ge=St;window.customElements.get(ge.is)||window.customElements.define(ge.is,ge,{extends:ge.tag});var Ws="p_draft_landscape",Ys="/store/",Xs=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),bi=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),Ks=["env","workflowStep","clientId","country"],ia=e=>Xs.get(e)??e;function yi(e,t,r){for(let[i,n]of Object.entries(e)){let a=ia(i);n!=null&&r.has(a)&&t.set(a,n)}}function Zs(e){switch(e){case $r.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function Qs(e,t){for(let r in e){let i=e[r];for(let[n,a]of Object.entries(i)){if(a==null)continue;let o=ia(n);t.set(`items[${r}][${o}]`,a)}}}function Js({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===Pe.CRM?"creative":"mini_plans"),e}function na(e){ec(e);let{env:t,items:r,workflowStep:i,marketSegment:n,customerSegment:a,offerType:o,productArrangementCode:s,landscape:c,modal:l,is3in1:d,preselectPlan:u,...m}=e,p=new URL(Zs(t));if(p.pathname=`${Ys}${i}`,i!==Z.SEGMENTATION&&i!==Z.CHANGE_PLAN_TEAM_PLANS&&Qs(r,p.searchParams),yi({...m},p.searchParams,bi),c===we.DRAFT&&yi({af:Ws},p.searchParams,bi),i===Z.SEGMENTATION){let h={marketSegment:n,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(f=>f.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};u?.toLowerCase()==="edu"?p.searchParams.set("ms","EDU"):u?.toLowerCase()==="team"&&p.searchParams.set("cs","TEAM"),yi(h,p.searchParams,bi),p.searchParams.get("ot")==="PROMOTION"&&p.searchParams.delete("ot"),p=Js({url:p,modal:l,is3in1:d})}return p.toString()}function ec(e){for(let t of Ks)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==Z.SEGMENTATION&&e.workflowStep!==Z.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var A=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:Z.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:me.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:we.PUBLISHED});function aa({settings:e,providers:t}){function r(a,o){let{checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:u,quantity:m,preselectPlan:p,env:h}=e,f={checkoutClientId:s,checkoutWorkflowStep:c,country:l,language:d,promotionCode:u,quantity:m,preselectPlan:p,env:h};if(o)for(let ye of t.checkout)ye(o,f);let{checkoutMarketSegment:x,checkoutWorkflowStep:S=c,imsCountry:b,country:v=b??l,language:E=d,quantity:R=m,entitlement:M,upgrade:H,modal:$,perpetual:X,promotionCode:z=u,wcsOsi:U,extraOptions:k,...ne}=Object.assign(f,o?.dataset??{},a??{}),he=Et(S,Z,A.checkoutWorkflowStep);return f=Zt({...ne,extraOptions:k,checkoutClientId:s,checkoutMarketSegment:x,country:v,quantity:Je(R,A.quantity),checkoutWorkflowStep:he,language:E,entitlement:w(M),upgrade:w(H),modal:$,perpetual:w(X),promotionCode:Jt(z).effectivePromoCode,wcsOsi:rr(U),preselectPlan:p}),f}function i(a,o){if(!Array.isArray(a)||!a.length||!o)return"";let{env:s,landscape:c}=e,{checkoutClientId:l,checkoutMarketSegment:d,checkoutWorkflowStep:u,country:m,promotionCode:p,quantity:h,preselectPlan:f,ms:x,cs:S,...b}=r(o),v=document.querySelector("meta[name=mas-ff-3in1]"),E=Object.values(Pe).includes(o.modal)&&(!v||v.content!=="off"),R=window.frameElement||E?"if":"fp",[{productArrangementCode:M,marketSegments:[H],customerSegment:$,offerType:X}]=a,z=x??H??d,U=S??$;f?.toLowerCase()==="edu"?z="EDU":f?.toLowerCase()==="team"&&(U="TEAM");let k={is3in1:E,checkoutPromoCode:p,clientId:l,context:R,country:m,env:s,items:[],marketSegment:z,customerSegment:U,offerType:X,productArrangementCode:M,workflowStep:u,landscape:c,...b},ne=h[0]>1?h[0]:void 0;if(a.length===1){let{offerId:he}=a[0];k.items.push({id:he,quantity:ne})}else k.items.push(...a.map(({offerId:he,productArrangementCode:ye})=>({id:he,quantity:ne,...E?{productArrangementCode:ye}:{}})));return na(k)}let{createCheckoutLink:n}=ge;return{CheckoutLink:ge,CheckoutWorkflowStep:Z,buildCheckoutURL:i,collectCheckoutOptions:r,createCheckoutLink:n}}function tc({interval:e=200,maxAttempts:t=25}={}){let r=se.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function rc(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function ic(e){let t=se.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function oa({}){let e=tc(),t=rc(e),r=ic(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var sa=window.masPriceLiterals;function ca(e){if(Array.isArray(sa)){let t=i=>sa.find(n=>ei(n.lang,i)),r=t(e.language)??t(A.language);if(r)return Object.freeze(r)}return{}}var Ei=function(e,t){return Ei=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},Ei(e,t)};function Tt(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Ei(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var _=function(){return _=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},_.apply(this,arguments)};function or(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var y;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(y||(y={}));var O;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(O||(O={}));var He;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(He||(He={}));function wi(e){return e.type===O.literal}function la(e){return e.type===O.argument}function sr(e){return e.type===O.number}function cr(e){return e.type===O.date}function lr(e){return e.type===O.time}function dr(e){return e.type===O.select}function pr(e){return e.type===O.plural}function da(e){return e.type===O.pound}function hr(e){return e.type===O.tag}function mr(e){return!!(e&&typeof e=="object"&&e.type===He.number)}function _t(e){return!!(e&&typeof e=="object"&&e.type===He.dateTime)}var Ai=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var nc=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function pa(e){var t={};return e.replace(nc,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var ha=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function ga(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(ha).filter(function(m){return m.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],c=o.slice(1),l=0,d=c;l<d.length;l++){var u=d[l];if(u.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function ac(e){return e.replace(/^(.*?)-/,"")}var ma=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,xa=/^(@+)?(\+|#+)?[rs]?$/g,oc=/(\*)(0+)|(#+)(0+)|(0+)/g,va=/^(0+)$/;function ua(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(xa,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function ba(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function sc(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!va.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function fa(e){var t={},r=ba(e);return r||t}function ya(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ac(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=_(_(_({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return _(_({},c),fa(l))},{}));continue;case"engineering":t=_(_(_({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return _(_({},c),fa(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(oc,function(c,l,d,u,m,p){if(l)t.minimumIntegerDigits=d.length;else{if(u&&m)throw new Error("We currently do not support maximum integer digits");if(p)throw new Error("We currently do not support exact integer digits")}return""});continue}if(va.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(ma.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(ma,function(c,l,d,u,m,p){return d==="*"?t.minimumFractionDigits=l.length:u&&u[0]==="#"?t.maximumFractionDigits=u.length:m&&p?(t.minimumFractionDigits=m.length,t.maximumFractionDigits=m.length+p.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var a=n.options[0];a==="w"?t=_(_({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=_(_({},t),ua(a)));continue}if(xa.test(n.stem)){t=_(_({},t),ua(n.stem));continue}var o=ba(n.stem);o&&(t=_(_({},t),o));var s=sc(n.stem);s&&(t=_(_({},t),s))}return t}var Ct={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Ea(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),c="a",l=cc(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;o-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function cc(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=Ct[i||""]||Ct[r||""]||Ct["".concat(r,"-001")]||Ct["001"];return n[0]}var Si,lc=new RegExp("^".concat(Ai.source,"*")),dc=new RegExp("".concat(Ai.source,"*$"));function C(e,t){return{start:e,end:t}}var pc=!!String.prototype.startsWith,hc=!!String.fromCodePoint,mc=!!Object.fromEntries,uc=!!String.prototype.codePointAt,fc=!!String.prototype.trimStart,gc=!!String.prototype.trimEnd,xc=!!Number.isSafeInteger,vc=xc?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},_i=!0;try{wa=_a("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),_i=((Si=wa.exec("a"))===null||Si===void 0?void 0:Si[0])==="a"}catch{_i=!1}var wa,Aa=pc?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},Ci=hc?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},Sa=mc?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},Ta=uc?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},bc=fc?function(t){return t.trimStart()}:function(t){return t.replace(lc,"")},yc=gc?function(t){return t.trimEnd()}:function(t){return t.replace(dc,"")};function _a(e,t){return new RegExp(e,t)}var Li;_i?(Ti=_a("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Li=function(t,r){var i;Ti.lastIndex=r;var n=Ti.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):Li=function(t,r){for(var i=[];;){var n=Ta(t,r);if(n===void 0||La(n)||Ac(n))break;i.push(n),r+=n>=65536?2:1}return Ci.apply(void 0,i)};var Ti,Ca=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:O.pound,location:C(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(y.UNMATCHED_CLOSING_TAG,C(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&Pi(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:O.literal,value:"<".concat(n,"/>"),location:C(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Pi(this.char()))return this.error(y.INVALID_TAG,C(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(y.UNMATCHED_CLOSING_TAG,C(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:O.tag,value:n,children:o,location:C(i,this.clonePosition())},err:null}:this.error(y.INVALID_TAG,C(s,this.clonePosition())))}else return this.error(y.UNCLOSED_TAG,C(i,this.clonePosition()))}else return this.error(y.INVALID_TAG,C(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&wc(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=C(i,this.clonePosition());return{val:{type:O.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Ec(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return Ci.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),Ci(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,C(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(y.EMPTY_ARGUMENT,C(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(y.MALFORMED_ARGUMENT,C(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,C(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:O.argument,value:n,location:C(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,C(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(y.MALFORMED_ARGUMENT,C(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=Li(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=C(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(y.EXPECT_ARGUMENT_TYPE,C(o,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var d=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;var m=yc(u.val);if(m.length===0)return this.error(y.EXPECT_ARGUMENT_STYLE,C(this.clonePosition(),this.clonePosition()));var p=C(d,this.clonePosition());l={style:m,styleLocation:p}}var h=this.tryParseArgumentClose(n);if(h.err)return h;var f=C(n,this.clonePosition());if(l&&Aa(l?.style,"::",0)){var x=bc(l.style.slice(2));if(s==="number"){var u=this.parseNumberSkeletonFromString(x,l.styleLocation);return u.err?u:{val:{type:O.number,value:i,location:f,style:u.val},err:null}}else{if(x.length===0)return this.error(y.EXPECT_DATE_TIME_SKELETON,f);var S=x;this.locale&&(S=Ea(x,this.locale));var m={type:He.dateTime,pattern:S,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?pa(S):{}},b=s==="date"?O.date:O.time;return{val:{type:b,value:i,location:f,style:m},err:null}}}return{val:{type:s==="number"?O.number:s==="date"?O.date:O.time,value:i,location:f,style:(a=l?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var v=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(y.EXPECT_SELECT_ARGUMENT_OPTIONS,C(v,_({},v)));this.bumpSpace();var E=this.parseIdentifierIfPossible(),R=0;if(s!=="select"&&E.value==="offset"){if(!this.bumpIf(":"))return this.error(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,C(this.clonePosition(),this.clonePosition()));this.bumpSpace();var u=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(u.err)return u;this.bumpSpace(),E=this.parseIdentifierIfPossible(),R=u.val}var M=this.tryParsePluralOrSelectOptions(t,s,r,E);if(M.err)return M;var h=this.tryParseArgumentClose(n);if(h.err)return h;var H=C(n,this.clonePosition());return s==="select"?{val:{type:O.select,value:i,options:Sa(M.val),location:H},err:null}:{val:{type:O.plural,value:i,options:Sa(M.val),offset:R,pluralType:s==="plural"?"cardinal":"ordinal",location:H},err:null}}default:return this.error(y.INVALID_ARGUMENT_TYPE,C(o,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(y.EXPECT_ARGUMENT_CLOSING_BRACE,C(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(y.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,C(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=ga(t)}catch{return this.error(y.INVALID_NUMBER_SKELETON,r)}return{val:{type:He.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?ya(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],c=new Set,l=n.value,d=n.location;;){if(l.length===0){var u=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var m=this.tryParseDecimalInteger(y.EXPECT_PLURAL_ARGUMENT_SELECTOR,y.INVALID_PLURAL_ARGUMENT_SELECTOR);if(m.err)return m;d=C(u,this.clonePosition()),l=this.message.slice(u.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?y.DUPLICATE_SELECT_ARGUMENT_SELECTOR:y.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,d);l==="other"&&(o=!0),this.bumpSpace();var p=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:y.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,C(this.clonePosition(),this.clonePosition()));var h=this.parseMessage(t+1,r,i);if(h.err)return h;var f=this.tryParseArgumentClose(p);if(f.err)return f;s.push([l,{value:h.val,location:C(p,this.clonePosition())}]),c.add(l),this.bumpSpace(),a=this.parseIdentifierIfPossible(),l=a.value,d=a.location}return s.length===0?this.error(r==="select"?y.EXPECT_SELECT_ARGUMENT_SELECTOR:y.EXPECT_PLURAL_ARGUMENT_SELECTOR,C(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(y.MISSING_OTHER_CLAUSE,C(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var c=C(n,this.clonePosition());return a?(o*=i,vc(o)?{val:o,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Ta(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Aa(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&La(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function Pi(e){return e>=97&&e<=122||e>=65&&e<=90}function Ec(e){return Pi(e)||e===47}function wc(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function La(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Ac(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function Mi(e){e.forEach(function(t){if(delete t.location,dr(t)||pr(t))for(var r in t.options)delete t.options[r].location,Mi(t.options[r].value);else sr(t)&&mr(t.style)||(cr(t)||lr(t))&&_t(t.style)?delete t.style.location:hr(t)&&Mi(t.children)})}function Pa(e,t){t===void 0&&(t={}),t=_({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Ca(e,t).parse();if(r.err){var i=SyntaxError(y[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||Mi(r.val),r.val}function Lt(e,t){var r=t&&t.cache?t.cache:Pc,i=t&&t.serializer?t.serializer:Lc,n=t&&t.strategy?t.strategy:Tc;return n(e,{cache:r,serializer:i})}function Sc(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Ma(e,t,r,i){var n=Sc(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function ka(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function ki(e,t,r,i,n){return r.bind(t,e,i,n)}function Tc(e,t){var r=e.length===1?Ma:ka;return ki(e,this,r,t.cache.create(),t.serializer)}function _c(e,t){return ki(e,this,ka,t.cache.create(),t.serializer)}function Cc(e,t){return ki(e,this,Ma,t.cache.create(),t.serializer)}var Lc=function(){return JSON.stringify(arguments)};function Ri(){this.cache=Object.create(null)}Ri.prototype.get=function(e){return this.cache[e]};Ri.prototype.set=function(e,t){this.cache[e]=t};var Pc={create:function(){return new Ri}},ur={variadic:_c,monadic:Cc};var Be;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Be||(Be={}));var Pt=function(e){Tt(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var Ni=function(e){Tt(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Be.INVALID_VALUE,a)||this}return t}(Pt);var Ra=function(e){Tt(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Be.INVALID_VALUE,n)||this}return t}(Pt);var Na=function(e){Tt(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Be.MISSING_VALUE,i)||this}return t}(Pt);var W;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(W||(W={}));function Mc(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==W.literal||r.type!==W.literal?t.push(r):i.value+=r.value,t},[])}function kc(e){return typeof e=="function"}function Mt(e,t,r,i,n,a,o){if(e.length===1&&wi(e[0]))return[{type:W.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var d=l[c];if(wi(d)){s.push({type:W.literal,value:d.value});continue}if(da(d)){typeof a=="number"&&s.push({type:W.literal,value:r.getNumberFormat(t).format(a)});continue}var u=d.value;if(!(n&&u in n))throw new Na(u,o);var m=n[u];if(la(d)){(!m||typeof m=="string"||typeof m=="number")&&(m=typeof m=="string"||typeof m=="number"?String(m):""),s.push({type:typeof m=="string"?W.literal:W.object,value:m});continue}if(cr(d)){var p=typeof d.style=="string"?i.date[d.style]:_t(d.style)?d.style.parsedOptions:void 0;s.push({type:W.literal,value:r.getDateTimeFormat(t,p).format(m)});continue}if(lr(d)){var p=typeof d.style=="string"?i.time[d.style]:_t(d.style)?d.style.parsedOptions:i.time.medium;s.push({type:W.literal,value:r.getDateTimeFormat(t,p).format(m)});continue}if(sr(d)){var p=typeof d.style=="string"?i.number[d.style]:mr(d.style)?d.style.parsedOptions:void 0;p&&p.scale&&(m=m*(p.scale||1)),s.push({type:W.literal,value:r.getNumberFormat(t,p).format(m)});continue}if(hr(d)){var h=d.children,f=d.value,x=n[f];if(!kc(x))throw new Ra(f,"function",o);var S=Mt(h,t,r,i,n,a),b=x(S.map(function(R){return R.value}));Array.isArray(b)||(b=[b]),s.push.apply(s,b.map(function(R){return{type:typeof R=="string"?W.literal:W.object,value:R}}))}if(dr(d)){var v=d.options[m]||d.options.other;if(!v)throw new Ni(d.value,m,Object.keys(d.options),o);s.push.apply(s,Mt(v.value,t,r,i,n));continue}if(pr(d)){var v=d.options["=".concat(m)];if(!v){if(!Intl.PluralRules)throw new Pt(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Be.MISSING_INTL_API,o);var E=r.getPluralRules(t,{type:d.pluralType}).select(m-(d.offset||0));v=d.options[E]||d.options.other}if(!v)throw new Ni(d.value,m,Object.keys(d.options),o);s.push.apply(s,Mt(v.value,t,r,i,n,m-(d.offset||0)));continue}}return Mc(s)}function Rc(e,t){return t?_(_(_({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=_(_({},e[i]),t[i]||{}),r},{})):e}function Nc(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=Rc(e[i],t[i]),r},_({},e)):e}function Oi(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Oc(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Lt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,or([void 0],r,!1)))},{cache:Oi(e.number),strategy:ur.variadic}),getDateTimeFormat:Lt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,or([void 0],r,!1)))},{cache:Oi(e.dateTime),strategy:ur.variadic}),getPluralRules:Lt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,or([void 0],r,!1)))},{cache:Oi(e.pluralRules),strategy:ur.variadic})}}var Oa=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var c=s.reduce(function(l,d){return!l.length||d.type!==W.literal||typeof l[l.length-1]!="string"?l.push(d.value):l[l.length-1]+=d.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(o){return Mt(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Nc(e.formats,i),this.formatters=n&&n.formatters||Oc(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Pa,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Ia=Oa;var Ii={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, billed monthly} other {}}"},Ic=Tn("ConsonantTemplates/price"),Dc=/<\/?[^>]+(>|$)/g,B={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Te={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},Di="TAX_EXCLUSIVE",Hc=e=>wn(e)?Object.entries(e).filter(([,t])=>Qe(t)||Kt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+En(i)+'"'}`,""):"",F=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+B.disabled}"${Hc(r)}>${i?Wn(t):t??""}</span>`;function Bc(e){e=e.replaceAll("</a>","&lt;/a&gt;");let t=/<a [^>]+(>|$)/g;return e.match(t)?.forEach(i=>{let n=i.replace("<a ","&lt;a ").replace(">","&gt;");e=e.replaceAll(i,n)}),e}function Uc(e){e=e.replaceAll("&lt;/a&gt;","</a>");let t=/&lt;a (?!&gt;)(.*?)(&gt;|$)/g;return e.match(t)?.forEach(i=>{let n=i.replace("&lt;a ","<a ").replace("&gt;",">");e=e.replaceAll(i,n)}),e}function xe(e,t,r,i){let n=e[r];if(n==null)return"";let a=n.includes("<"),o=n.includes("<a ");try{n=o?Bc(n):n,n=a?n.replace(Dc,""):n;let s=new Ia(n,t).format(i);return o?Uc(s):s}catch{return Ic.error("Failed to format literal:",n),""}}function Fc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:n,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:d,taxInclusivityLabel:u},m={}){let p=F(B.currencySymbol,i),h=F(B.currencySpace,o?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(f+=p+h),f+=F(B.integer,s),f+=F(B.decimalsDelimiter,a),f+=F(B.decimals,n),c||(f+=h+p),f+=F(B.recurrence,l,null,!0),f+=F(B.unitType,d,null,!0),f+=F(B.taxInclusivity,u,!0),F(e,f,{...m})}var Y=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:n=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:d,literals:u={},quantity:m=1,space:p=!1,isPromoApplied:h=!1}={},{commitment:f,offerSelectorIds:x,formatString:S,price:b,priceWithoutDiscount:v,taxDisplay:E,taxTerm:R,term:M,usePrecision:H,promotion:$}={},X={})=>{Object.entries({country:a,formatString:S,language:d,price:b}).forEach(([Eo,wo])=>{if(wo==null)throw new Error(`Argument "${Eo}" is missing for osi ${x?.toString()}, country ${a}, language ${d}`)});let z={...Ii,...u},U=`${d.toLowerCase()}-${a.toUpperCase()}`,k;$&&!h&&v?k=e?b:v:r&&v?k=v:k=b;let ne=t?Xn:Kn;i&&(ne=Zn);let{accessiblePrice:he,recurrenceTerm:ye,...zi}=ne({commitment:f,formatString:S,instant:n,isIndianPrice:a==="IN",originalPrice:b,priceWithoutDiscount:v,price:t?b:k,promotion:$,quantity:m,term:M,usePrecision:H}),xr="",vr="",br="";w(s)&&ye&&(br=xe(z,U,Te.recurrenceLabel,{recurrenceTerm:ye}));let Ht="";w(c)&&(p&&(Ht+=" "),Ht+=xe(z,U,Te.perUnitLabel,{perUnit:"LICENSE"}));let Bt="";w(l)&&R&&(p&&(Bt+=" "),Bt+=xe(z,U,E===Di?Te.taxExclusiveLabel:Te.taxInclusiveLabel,{taxTerm:R})),r&&(xr=xe(z,U,Te.strikethroughAriaLabel,{strikethroughPrice:xr})),e&&(vr=xe(z,U,Te.alternativePriceAriaLabel,{alternativePrice:vr}));let Ue=B.container;if(t&&(Ue+=" "+B.containerOptical),r&&(Ue+=" "+B.containerStrikethrough),e&&(Ue+=" "+B.containerAlternative),i&&(Ue+=" "+B.containerAnnual),w(o))return Fc(Ue,{...zi,accessibleLabel:xr,altAccessibleLabel:vr,recurrenceLabel:br,perUnitLabel:Ht,taxInclusivityLabel:Bt},X);let{currencySymbol:$i,decimals:go,decimalsDelimiter:xo,hasCurrencySpace:Gi,integer:vo,isCurrencyFirst:bo}=zi,Fe=[vo,xo,go];bo?(Fe.unshift(Gi?"\xA0":""),Fe.unshift($i)):(Fe.push(Gi?"\xA0":""),Fe.push($i)),Fe.push(br,Ht,Bt);let yo=Fe.join("");return F(Ue,yo,X)},Da=()=>(e,t,r)=>{let i=De(t.promotion,t.promotion?.displaySummary?.instant,Array.isArray(e.quantity)?e.quantity[0]:e.quantity),a=(e.displayOldPrice===void 0||w(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price&&(!t.promotion||i);return`${a?Y({displayStrikethrough:!0})({isPromoApplied:i,...e},t,r)+"&nbsp;":""}${Y({isAlternativePrice:a})({isPromoApplied:i,...e},t,r)}`},Ha=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let n=De(t.promotion,i,Array.isArray(e.quantity)?e.quantity[0]:e.quantity),a={...e,displayTax:!1,displayPerUnit:!1,isPromoApplied:n};if(!n)return Y()(e,{...t,price:t.priceWithoutDiscount},r)+F(B.containerAnnualPrefix,"&nbsp;(")+Y({displayAnnual:!0,instant:i})(a,{...t,price:t.priceWithoutDiscount},r)+F(B.containerAnnualSuffix,")");let s=(e.displayOldPrice===void 0||w(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${s?Y({displayStrikethrough:!0})(a,t,r)+"&nbsp;":""}${Y({isAlternativePrice:s})({isPromoApplied:n,...e},t,r)}${F(B.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0,instant:i})(a,t,r)}${F(B.containerAnnualSuffix,")")}`},Ba=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${Y({isAlternativePrice:e.displayOldPrice})(e,t,r)}${F(B.containerAnnualPrefix,"&nbsp;(")}${Y({displayAnnual:!0})(i,t,r)}${F(B.containerAnnualSuffix,")")}`};var kt={...B,containerLegal:"price-legal",planType:"price-plan-type"},fr={...Te,planTypeLabel:"planTypeLabel"};function zc(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},n={}){let a="";return a+=F(kt.unitType,t,null,!0),r&&i&&(r+=". "),a+=F(kt.taxInclusivity,r,!0),a+=F(kt.planType,i,null),F(e,a,{...n})}var Ua=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:n,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:c}={},l={})=>{let d={...Ii,...a},u=`${n.toLowerCase()}-${e.toUpperCase()}`,m="";w(t)&&(m=xe(d,u,fr.perUnitLabel,{perUnit:"LICENSE"}));let p="";e==="US"&&n==="en"&&(r=!1),w(r)&&s&&(p=xe(d,u,o===Di?fr.taxExclusiveLabel:fr.taxInclusiveLabel,{taxTerm:s}));let h="";w(i)&&c&&(h=xe(d,u,fr.planTypeLabel,{planType:c}));let f=kt.container;return f+=" "+kt.containerLegal,zc(f,{perUnitLabel:m,taxInclusivityLabel:p,planTypeLabel:h},l)};var Fa=Y(),za=Da(),$a=Y({displayOptical:!0}),Ga=Y({displayStrikethrough:!0}),Va=Y({displayAnnual:!0}),qa=Y({displayOptical:!0,isAlternativePrice:!0}),ja=Y({isAlternativePrice:!0}),Wa=Ba(),Ya=Ha(),Xa=Ua;var $c=(e,t)=>{if(!(!yt(e)||!yt(t)))return Math.floor((t-e)/t*100)},Ka=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=$c(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Za=Ka();var Ja="INDIVIDUAL_COM",Hi="TEAM_COM",eo="INDIVIDUAL_EDU",Bi="TEAM_EDU",Qa=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],Gc={[Ja]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[Hi]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[eo]:["LT_lt","LV_lv","SA_en","SG_en"],[Bi]:["SG_en","KR_ko"]},Vc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},qc=[Ja,Hi,eo,Bi],jc=e=>[Hi,Bi].includes(e),Wc=(e,t,r,i)=>{let n=`${e}_${t}`,a=`${r}_${i}`,o=Vc[n];if(o){let s=qc.indexOf(a);return o[s]}return jc(a)},Yc=(e,t,r,i)=>{let n=`${e}_${t}`;if(Qa.includes(e)||Qa.includes(n))return!0;let a=Gc[`${r}_${i}`];return a?a.includes(e)||a.includes(n)?!0:A.displayTax:A.displayTax},Xc=async(e,t,r,i)=>{let n=Yc(e,t,r,i);return{displayTax:n,forceTaxExclusive:n?Wc(e,t,r,i):A.forceTaxExclusive}},Rt=class Rt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Se(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi","data-quantity"]}static createInlinePrice(r){let i=ee();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:u,promotionCode:m,quantity:p,alternativePrice:h,template:f,wcsOsi:x}=i.collectPriceOptions(r);return ar(Rt,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:c,displayAnnual:l,forceTaxExclusive:d,perpetual:u,promotionCode:m,quantity:p,alternativePrice:h,template:f,wcsOsi:x})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===le}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=ee();if(!i)return!1;let n=i.collectPriceOptions(r,this),a={...i.settings,...n};if(!a.wcsOsi.length)return!1;try{let o=this.masElement.togglePending({});this.innerHTML="";let[s]=await i.resolveOfferSelectors(a),c=wt(await s,a),[l]=c;if(i.featureFlags[fe]||a[fe]){if(n.displayPerUnit===void 0&&(a.displayPerUnit=l.customerSegment!=="INDIVIDUAL"),n.displayTax===void 0||n.forceTaxExclusive===void 0){let{country:d,language:u}=a,[m=""]=l.marketSegments,p=await Xc(d,u,l.customerSegment,m);n.displayTax===void 0&&(a.displayTax=p?.displayTax||a.displayTax),n.forceTaxExclusive===void 0&&(a.forceTaxExclusive=p?.forceTaxExclusive||a.forceTaxExclusive),a.forceTaxExclusive&&(c=wt(c,a))}}else n.displayOldPrice===void 0&&(a.displayOldPrice=!0);return this.renderOffers(c,a,o)}catch(o){throw this.innerHTML="",o}}renderOffers(r,i,n=void 0){if(!this.isConnected)return;let a=ee();if(!a)return!1;if(n??(n=this.masElement.togglePending()),r.length){if(this.masElement.toggleResolved(n,r,i)){this.innerHTML=a.buildPriceHTML(r,this.options);let o=this.closest("p, h3, div");if(!o||!o.querySelector('span[data-template="strikethrough"]')||o.querySelector(".alt-aria-label"))return!0;let s=o?.querySelectorAll('span[is="inline-price"]');return s.length>1&&s.length===o.querySelectorAll('span[data-template="strikethrough"]').length*2&&s.forEach(c=>{c.dataset.template!=="strikethrough"&&c.options&&!c.options.alternativePrice&&!c.isFailed&&(c.options.alternativePrice=!0,c.innerHTML=a.buildPriceHTML(r,c.options))}),!0}}else{let o=new Error(`Not provided: ${this.options?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,o,this.options))return this.innerHTML="",!0}return!1}};g(Rt,"is","inline-price"),g(Rt,"tag","span");var ve=Rt;window.customElements.get(ve.is)||window.customElements.define(ve.is,ve,{extends:ve.tag});function to({literals:e,providers:t,settings:r}){function i(o,s=null){let c={country:r.country,language:r.language,locale:r.locale,literals:{...e.price}};if(s&&t?.price)for(let M of t.price)M(s,c);let{displayOldPrice:l,displayPerUnit:d,displayRecurrence:u,displayTax:m,displayPlanType:p,forceTaxExclusive:h,perpetual:f,displayAnnual:x,promotionCode:S,quantity:b,alternativePrice:v,wcsOsi:E,...R}=Object.assign(c,s?.dataset??{},o??{});return c=Zt(Object.assign({...c,...R,displayOldPrice:w(l),displayPerUnit:w(d),displayRecurrence:w(u),displayTax:w(m),displayPlanType:w(p),forceTaxExclusive:w(h),perpetual:w(f),displayAnnual:w(x),promotionCode:Jt(S).effectivePromoCode,quantity:Je(b,A.quantity),alternativePrice:w(v),wcsOsi:rr(E)})),c}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:c}=s,l;switch(c){case"discount":l=Za;break;case"strikethrough":l=Ga;break;case"annual":l=Va;break;case"legal":l=Xa;break;default:s.template==="optical"&&s.alternativePrice?l=qa:s.template==="optical"?l=$a:s.displayAnnual&&o[0].planType==="ABM"?l=s.promotionCode?Ya:Wa:s.alternativePrice?l=ja:l=s.promotionCode?za:Fa}let[d]=o;return d={...d,...d.priceDetails},l({...r,...s},d)}let a=ve.createInlinePrice;return{InlinePrice:ve,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function Kc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||A.language),t??(t=e?.split("_")?.[1]||A.country),e??(e=mt.includes(`${r}_${t}`)?`${r}_${t}`:`${A.language}_${A.country}`),{locale:e,country:t,language:r}}function ro(e={},t){let r=t.featureFlags[fe],{commerce:i={}}=e,n=me.PRODUCTION,a=Fr,o=D("checkoutClientId",i)??A.checkoutClientId,s=Et(D("checkoutWorkflowStep",i),Z,A.checkoutWorkflowStep),c=A.displayOldPrice,l=A.displayPerUnit,d=w(D("displayRecurrence",i),A.displayRecurrence),u=w(D("displayTax",i),A.displayTax),m=w(D("displayPlanType",i),A.displayPlanType),p=w(D("entitlement",i),A.entitlement),h=w(D("modal",i),A.modal),f=w(D("forceTaxExclusive",i),A.forceTaxExclusive),x=D("promotionCode",i)??A.promotionCode,S=Je(D("quantity",i)),b=D("wcsApiKey",i)??A.wcsApiKey,v=i?.env==="stage",E=we.PUBLISHED;["true",""].includes(i.allowOverride)&&(v=(D(Br,i,{metadata:!1})?.toLowerCase()??i?.env)==="stage",E=Et(D(Ur,i),we,E)),v&&(n=me.STAGE,a=zr);let M=D(Hr)??e.preview,H=typeof M<"u"&&M!=="off"&&M!=="false",$={};H&&($={preview:H});let X=D("mas-io-url")??e.masIOUrl??`https://www${n===me.STAGE?".stage":""}.adobe.com/mas/io`,z=D("preselect-plan")??void 0;return{...Kc(e),...$,displayOldPrice:c,checkoutClientId:o,checkoutWorkflowStep:s,displayPerUnit:l,displayRecurrence:d,displayTax:u,displayPlanType:m,entitlement:p,extraOptions:A.extraOptions,modal:h,env:n,forceTaxExclusive:f,promotionCode:x,quantity:S,alternativePrice:A.alternativePrice,wcsApiKey:b,wcsURL:a,landscape:E,masIOUrl:X,...z&&{preselectPlan:z}}}async function io(e,t={},r=2,i=100){let n;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(n=o,n.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,i*(a+1)))}throw n}var Ui="wcs";function no({settings:e}){let t=se.module(Ui),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o,s=new Map;async function c(h,f,x=!0){let S=ee(),b=Nr;t.debug("Fetching:",h);let v="",E;if(h.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let R=new Map(f),[M]=h.offerSelectorIds,H=Date.now()+Math.random().toString(36).substring(2,7),$=`${Ui}:${M}:${H}${Gr}`,X=`${Ui}:${M}:${H}${Vr}`,z;try{if(performance.mark($),v=new URL(e.wcsURL),v.searchParams.set("offer_selector_ids",M),v.searchParams.set("country",h.country),v.searchParams.set("locale",h.locale),v.searchParams.set("landscape",r===me.STAGE?"ALL":e.landscape),v.searchParams.set("api_key",i),h.language&&v.searchParams.set("language",h.language),h.promotionCode&&v.searchParams.set("promotion_code",h.promotionCode),h.currency&&v.searchParams.set("currency",h.currency),E=await io(v.toString(),{credentials:"omit"}),E.ok){let U=[];try{let k=await E.json();t.debug("Fetched:",h,k),U=k.resolvedOffers??[]}catch(k){t.error(`Error parsing JSON: ${k.message}`,{...k.context,...S?.duration})}U=U.map(er),f.forEach(({resolve:k},ne)=>{let he=U.filter(({offerSelectorIds:ye})=>ye.includes(ne)).flat();he.length&&(R.delete(ne),f.delete(ne),k(he))})}else b=Rr}catch(U){b=`Network error: ${U.message}`}finally{z=performance.measure(X,$),performance.clearMarks($),performance.clearMeasures(X)}if(x&&f.size){t.debug("Missing:",{offerSelectorIds:[...f.keys()]});let U=Mn(E);f.forEach(k=>{k.reject(new et(b,{...h,...U,response:E,measure:zt(z),...S?.duration}))})}}function l(){clearTimeout(o);let h=[...a.values()];a.clear(),h.forEach(({options:f,promises:x})=>c(f,x))}function d(h){if(!h||typeof h!="object")throw new TypeError("Cache must be a Map or similar object");let f=r===me.STAGE?"stage":"prod",x=h[f];if(!x||typeof x!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[S,b]of Object.entries(x))n.set(S,Promise.resolve(b.map(er)));t.debug(`Prefilled WCS cache with ${x.size} entries`)}function u(){let h=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${h} cache entries to stale cache`)}function m(h,f,x){let S=h!=="GB"&&!x?"MULT":"en",b=qr.includes(h)?h:A.country;return{validCountry:b,validLanguage:S,validLocale:mt.includes(`${f}_${b}`)?`${f}_${b}`:`${A.language}_${A.country}`}}function p({country:h,language:f,perpetual:x=!1,promotionCode:S="",wcsOsi:b=[]}){let{validCountry:v,validLanguage:E,validLocale:R}=m(h,f,x),M=[v,E,S].filter(H=>H).join("-").toLowerCase();return b.map(H=>{let $=`${H}-${M}`;if(n.has($))return n.get($);let X=new Promise((z,U)=>{let k=a.get(M);k||(k={options:{country:v,locale:R,...E==="MULT"&&{language:E},offerSelectorIds:[]},promises:new Map},a.set(M,k)),S&&(k.options.promotionCode=S),k.options.offerSelectorIds.push(H),k.promises.set(H,{resolve:z,reject:U}),l()}).catch(z=>{if(s.has($))return s.get($);throw z});return n.set($,X),X})}return{Commitment:Ce,PlanType:Cn,Term:ae,applyPlanType:er,resolveOfferSelectors:p,flushWcsCacheInternal:u,prefillWcsCache:d,normalizeCountryLanguageAndLocale:m}}var ao="mas-commerce-service",oo="mas-commerce-service:start",so="mas-commerce-service:ready",Nt,rt,it,co,lo,Fi=class extends HTMLElement{constructor(){super(...arguments);G(this,it);G(this,Nt);G(this,rt);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}get featureFlags(){return T(this,rt)||q(this,rt,{[fe]:Ut(this,it,lo).call(this,fe)}),T(this,rt)}activate(){let r=T(this,it,co),i=ro(r,this);ir(r.lana);let n=se.init(r.hostEnv).module("service");n.debug("Activating:",r);let o={price:ca(i)},s={checkout:new Set,price:new Set},c={literals:o,providers:s,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({...aa(c),...oa(c),...to(c),...no(c),...jr,Log:se,get defaults(){return A},get log(){return se},get providers(){return{checkout(d){return s.checkout.add(d),()=>s.checkout.delete(d)},price(d){return s.price.add(d),()=>s.price.delete(d)},has:d=>s.price.has(d)||s.checkout.has(d)}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i});let l=new CustomEvent(Ft,{bubbles:!0,cancelable:!1,detail:this});performance.mark(so),q(this,Nt,performance.measure(so,oo)),this.dispatchEvent(l),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(oo),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(Er).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),customElements.get("aem-fragment")?.cache.clear(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh(!1)),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":zt(T(this,Nt))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:a,responseStatus:o})=>n===0&&a===0&&o<200||o>=400),i=Array.from(new Map(r.map(n=>[n.name,n])).values());if(i.some(({name:n})=>/(\/fragment\?|web_commerce_artifact)/.test(n))){let n=i.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};Nt=new WeakMap,rt=new WeakMap,it=new WeakSet,co=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(n=>{let a=this.getAttribute(n);a&&(i[n]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let a=this.getAttribute(n);if(a!=null){let o=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());i.commerce[o]=a}}),i},lo=function(r){return["on","true",!0].includes(this.getAttribute(`data-${r}`)||D(r))};window.customElements.get(ao)||window.customElements.define(ao,Fi);var uo="merch-card-collection",Zc=2e4,Qc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Jc={plans:!0},el=(e,{filter:t})=>e.filter(r=>r?.filters&&r?.filters.hasOwnProperty(t)),tl=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,rl=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),il=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),nl=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,_e,at,It,Dt,gr,fo,nt=class extends ho{constructor(){super();G(this,gr);G(this,_e,{});G(this,at);G(this,It);G(this,Dt);this.id=null,this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1,this.onUnmount=[]}render(){return be`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(n=>setTimeout(()=>n(!1),Zc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(l=>l.tagName==="MERCH-CARD");if(n.length===0)return;r.has("singleApp")&&this.singleApp&&n.forEach(l=>{l.updateFilters(l.name===this.singleApp)});let a=this.sort===de.alphabetical?rl:il,s=[el,tl,nl,a].reduce((l,d)=>d(l,this),n).map((l,d)=>[l,d]);if(this.resultCount=s.length,this.page&&this.limit){let l=this.page*this.limit;this.hasMore=s.length>l,s=s.filter(([,d])=>d<l)}let c=new Map(s.reverse());for(let l of c.keys())this.prepend(l);n.forEach(l=>{c.has(l)?(l.size=l.filters[this.filter]?.size,l.style.removeProperty("display"),l.requestUpdate()):(l.style.display="none",l.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(Tr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(ce,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){q(this,_e,{}),this.overrides?.split(",").forEach(r=>{let[i,n]=r?.split(":");i&&n&&(T(this,_e)[i]=n)})}connectedCallback(){super.connectedCallback(),q(this,at,ft()),T(this,at)&&q(this,It,T(this,at).Log.module(uo)),q(this,Dt,customElements.get("merch-card")),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.();for(let r of this.onUnmount)r()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r,this.querySelectorAll("[placeholder]").forEach(n=>{let a=n.getAttribute("slot");this.header.placeholderKeys.includes(a)&&this.header.append(n)})}initializePlaceholders(){let r=this.data?.placeholders||{};!r.searchText&&this.data?.sidenavSettings?.searchText&&(r.searchText=this.data.sidenavSettings.searchText);for(let i of Object.keys(r)){let n=r[i],a=n.includes("<p>")?"div":"p",o=document.createElement(a);o.setAttribute("slot",i),o.setAttribute("placeholder",""),o.innerHTML=n,this.append(o)}}attachSidenav(r,i=!0){if(!r)return;i&&this.parentElement.prepend(r),this.sidenav=r,this.sidenav.variant=this.variant,this.sidenav.classList.add(this.variant),Jc[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.initializeHeader(),this.dispatchEvent(new CustomEvent(dt));let n=T(this,Dt)?.getCollectionOptions(this.variant)?.onSidenavAttached;n&&n(this)}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.id=r.getAttribute("fragment"),this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let n=this;function a(o,s){let c;o.fields?.checkboxGroups?c=o.fields.checkboxGroups:o.fields?.tagFilters&&(c=[{title:o.fields?.tagFiltersTitle,label:"types",deeplink:"types",checkboxes:o.fields.tagFilters.map(m=>{let p=m.split("/").pop(),h=o.settings?.tagLabels?.[p]||p;return h=h.startsWith("coll-tag-filter")?p.charAt(0).toUpperCase()+p.slice(1):h,{name:p,label:h}})}]);let l={searchText:o.fields?.searchText,tagFilters:c,linksTitle:o.fields?.linksTitle,link:o.fields?.link,linkText:o.fields?.linkText,linkIcon:o.fields?.linkIcon},d={cards:[],hierarchy:[],placeholders:o.placeholders,sidenavSettings:l};function u(m,p){for(let h of p){if(h.fieldName==="cards"){if(d.cards.findIndex(b=>b.id===h.identifier)!==-1)continue;d.cards.push(o.references[h.identifier].value);continue}let f=o.references[h.identifier]?.value;if(!f?.fields)continue;let{fields:x}=f,S={label:x.label||"",icon:x.icon,iconLight:x.iconLight,queryLabel:x.queryLabel,cards:x.cards?x.cards.map(b=>s[b]||b):[],collections:[]};x.defaultchild&&(S.defaultchild=s[x.defaultchild]||x.defaultchild),m.push(S),u(S.collections,h.referencesTree)}}return u(d.hierarchy,o.referencesTree),d.hierarchy.length===0&&(n.filtered="all"),d}r.addEventListener(Cr,o=>{Ut(this,gr,fo).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(_r,async o=>{this.limit=27,this.data=a(o.detail,T(this,_e));let{cards:s,hierarchy:c}=this.data,l=c.length===0&&o.detail.fields?.defaultchild?T(this,_e)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...s);let d=(p,h)=>{for(let f of p)if(f.defaultchild===h||f.collections&&d(f.collections,h))return!0;return!1};for(let p of s){let b=function(E){for(let R of E){let M=R.cards.indexOf(f);if(M===-1)continue;let H=R.queryLabel??R?.label?.toLowerCase()??"";h.filters[H]={order:M+1,size:p.fields.size},b(R.collections)}},h=document.createElement("merch-card"),f=T(this,_e)[p.id]||p.id;h.setAttribute("consonant",""),h.setAttribute("style","");let x=p.fields.tags?.filter(E=>E.startsWith("mas:types/")).map(E=>E.split("/")[1]).join(",");x&&h.setAttribute("types",x),Gt(p.fields.variant)?.supportsDefaultChild&&(l?f===l:d(c,f))&&h.setAttribute("data-default-card","true"),b(c);let v=document.createElement("aem-fragment");v.setAttribute("fragment",f),h.append(v),Object.keys(h.filters).length===0&&(h.filters={all:{order:s.indexOf(p)+1,size:p.fields.size}}),this.append(h)}let u="",m=Fn(s[0]?.fields?.variant);this.variant=m,m==="plans"&&s.length===3&&!s.some(p=>p.fields?.size?.includes("wide"))&&(u="ThreeColumns"),m&&this.classList.add("merch-card-collection",m,...Qc[`${m}${u}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i(!0)}),await this.hydrationReady}get footer(){if(!this.filtered)return be`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return be`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===de.authored?lt({sort:void 0}):lt({sort:r.target.value}),this.dispatchEvent(new CustomEvent(Ar,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(Sr,{bubbles:!0,composed:!0}));let r=this.page+1;lt({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=Yi(({category:r,filter:i,types:n,sort:a,search:o,single_app:s,page:c})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{lt({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=n??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(c)||1})}openFilters(r){this.sidenav?.showModal(r)}};_e=new WeakMap,at=new WeakMap,It=new WeakMap,Dt=new WeakMap,gr=new WeakSet,fo=function(r,i={},n=!0){T(this,It).error(`merch-card-collection: ${r}`,i),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Lr,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(nt,"properties",{id:{type:String,attribute:"id",reflect:!0},displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:de.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(nt,"styles",mo`
        #footer {
            grid-column: 1 / -1;
            justify-self: stretch;
            color: var(--merch-color-grey-80);
            order: 1000;
        }

        sp-theme {
            display: contents;
        }
    `);nt.SortOrder=de;customElements.define(uo,nt);var al={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},ol=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(n=>{n.innerText=r||""})},sl={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},cl={catalog:"l"},te,ot,Ot=class extends ho{constructor(){super();G(this,te);G(this,ot);g(this,"tablet",new ct(this,I));g(this,"desktop",new ct(this,L));this.collection=null,q(this,te,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(ce,this.updateLiterals),this.collection?.addEventListener(dt,this.handleSidenavAttached),q(this,ot,customElements.get("merch-card"))}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(ce,this.updateLiterals),this.collection?.removeEventListener(dt,this.handleSidenavAttached)}willUpdate(){T(this,te).search=this.getVisibility("search"),T(this,te).filter=this.getVisibility("filter"),T(this,te).sort=this.getVisibility("sort"),T(this,te).result=this.getVisibility("result"),T(this,te).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let n=r[i];return n===!1?!1:n===!0?!0:n.includes(this.currentMedia)}getVisibility(r){let i=T(this,ot)?.getCollectionOptions(this.collection?.variant)?.headerVisibility,n=this.parseVisibilityOptions(i,r);return n!==null?n:this.parseVisibilityOptions(sl,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get variant(){return this.collection?.variant}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!T(this,te).search)return pe;let r=ut(this,"searchText");return r?be`
              <merch-search deeplink="search" id="search">
                  <sp-search
                      id="search-bar"
                      placeholder="${r}"
                      .size=${cl[this.variant]}
                      aria-label="${r}"
                  ></sp-search>
              </merch-search>
          `:pe}get filterAction(){return T(this,te).filter?this.sidenav?be`
              <sp-action-button
                id="filter"
                variant="secondary"
                treatment="outline"
                @click="${this.openFilters}"
                ><slot name="filtersText"></slot
              ></sp-action-button>
          `:pe:pe}get sortAction(){if(!T(this,te).sort)return pe;let r=ut(this,"sortText");if(!r)return;let i=ut(this,"popularityText"),n=ut(this,"alphabeticallyText");if(!(i&&n))return;let a=this.collection?.sort===de.alphabetical;return be`
              <sp-action-menu
                  id="sort"
                  size="m"
                  @change="${this.collection?.sortChanged}"
                  selects="single"
                  value="${a?de.alphabetical:de.authored}"
              >
                  <span slot="label-only"
                      >${r}:
                      ${a?n:i}</span
                  >
                  <sp-menu-item value="${de.authored}"
                      >${i}</sp-menu-item
                  >
                  <sp-menu-item value="${de.alphabetical}"
                      >${n}</sp-menu-item
                  >
              </sp-action-menu>
          `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return al[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!T(this,te).result)return pe;if(!this.sidenav)return pe;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return be`
            <div id="result" aria-live="polite" type=${r} quantity=${i}>
                <slot name="${this.resultSlotName}"></slot>
            </div>`}get customArea(){if(!T(this,te).custom)return pe;let r=T(this,ot)?.getCollectionOptions(this.collection?.variant)?.customHeaderArea;if(!r)return pe;let i=r(this.collection);return!i||i===pe?pe:be`<div id="custom" role="heading" aria-level="2">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{ol(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return be`
            <sp-theme color="light" scale="medium">
              <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
            </sp-theme>
          `}get placeholderKeys(){return["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]}};te=new WeakMap,ot=new WeakMap,g(Ot,"styles",mo`
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
          @media screen and ${po(L)} {
              :host {
                  --merch-card-collection-header-columns: 1fr fit-content(100%);
                  --merch-card-collection-header-areas: "result sort";
                  --merch-card-collection-header-result-font-size: inherit;
              }
          }
      `);customElements.define("merch-card-collection-header",Ot);export{nt as MerchCardCollection,Ot as default};

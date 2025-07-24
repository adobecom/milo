var Li=Object.defineProperty;var Ri=e=>{throw TypeError(e)};var Za=(e,t,r)=>t in e?Li(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var Ja=(e,t)=>{for(var r in t)Li(e,r,{get:t[r],enumerable:!0})};var g=(e,t,r)=>Za(e,typeof t!="symbol"?t+"":t,r),nr=(e,t,r)=>t.has(e)||Ri("Cannot "+r);var C=(e,t,r)=>(nr(e,t,"read from private field"),r?r.call(e):t.get(e)),z=(e,t,r)=>t.has(e)?Ri("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),K=(e,t,r,i)=>(nr(e,t,"write to private field"),i?i.call(e,r):t.set(e,r),r),Mi=(e,t,r)=>(nr(e,t,"access private method"),r);import{html as _i,LitElement as _c}from"../lit-all.min.js";var Ni="hashchange";function eo(e=window.location.hash){let t=[],r=e.replace(/^#/,"").split("&");for(let i of r){let[n,a=""]=i.split("=");n&&t.push([n,decodeURIComponent(a.replace(/\+/g," "))])}return Object.fromEntries(t)}function qe(e){let t=new URLSearchParams(window.location.hash.slice(1));Object.entries(e).forEach(([n,a])=>{a?t.set(n,a):t.delete(n)}),t.sort();let r=t.toString();if(r===window.location.hash)return;let i=window.scrollY||document.documentElement.scrollTop;window.location.hash=r,window.scrollTo(0,i)}function Oi(e){let t=()=>{if(window.location.hash&&!window.location.hash.includes("="))return;let r=eo(window.location.hash);e(r)};return t(),window.addEventListener(Ni,t),()=>{window.removeEventListener(Ni,t)}}var Rr={};Ja(Rr,{CLASS_NAME_FAILED:()=>mr,CLASS_NAME_HIDDEN:()=>ro,CLASS_NAME_PENDING:()=>ur,CLASS_NAME_RESOLVED:()=>fr,CheckoutWorkflow:()=>bo,CheckoutWorkflowStep:()=>j,Commitment:()=>be,ERROR_MESSAGE_BAD_REQUEST:()=>gr,ERROR_MESSAGE_MISSING_LITERALS_URL:()=>go,ERROR_MESSAGE_OFFER_NOT_FOUND:()=>xr,EVENT_AEM_ERROR:()=>dr,EVENT_AEM_LOAD:()=>hr,EVENT_MAS_ERROR:()=>pr,EVENT_MAS_READY:()=>fo,EVENT_MERCH_ADDON_AND_QUANTITY_UPDATE:()=>mo,EVENT_MERCH_CARD_ACTION_MENU_TOGGLE:()=>or,EVENT_MERCH_CARD_COLLECTION_LITERALS_CHANGED:()=>Ce,EVENT_MERCH_CARD_COLLECTION_SHOWMORE:()=>cr,EVENT_MERCH_CARD_COLLECTION_SIDENAV_ATTACHED:()=>Le,EVENT_MERCH_CARD_COLLECTION_SORT:()=>sr,EVENT_MERCH_CARD_QUANTITY_CHANGE:()=>po,EVENT_MERCH_OFFER_READY:()=>ao,EVENT_MERCH_OFFER_SELECT_READY:()=>oo,EVENT_MERCH_QUANTITY_SELECTOR_CHANGE:()=>ho,EVENT_MERCH_SEARCH_CHANGE:()=>uo,EVENT_MERCH_SIDENAV_SELECT:()=>lr,EVENT_MERCH_STOCK_CHANGE:()=>co,EVENT_MERCH_STORAGE_CHANGE:()=>lo,EVENT_OFFER_SELECTED:()=>so,EVENT_TYPE_FAILED:()=>Er,EVENT_TYPE_READY:()=>Et,EVENT_TYPE_RESOLVED:()=>br,Env:()=>ae,FF_DEFAULTS:()=>Xe,HEADER_X_REQUEST_ID:()=>We,LOG_NAMESPACE:()=>vr,Landscape:()=>fe,MARK_DURATION_SUFFIX:()=>Cr,MARK_START_SUFFIX:()=>Pr,MODAL_TYPE_3_IN_1:()=>ve,NAMESPACE:()=>to,PARAM_AOS_API_KEY:()=>xo,PARAM_ENV:()=>wr,PARAM_LANDSCAPE:()=>Sr,PARAM_MAS_PREVIEW:()=>yr,PARAM_WCS_API_KEY:()=>Eo,PROVIDER_ENVIRONMENT:()=>_r,SELECTOR_MAS_CHECKOUT_LINK:()=>Ii,SELECTOR_MAS_ELEMENT:()=>ar,SELECTOR_MAS_INLINE_PRICE:()=>se,SELECTOR_MAS_SP_BUTTON:()=>no,SORT_ORDER:()=>Z,STATE_FAILED:()=>te,STATE_PENDING:()=>ue,STATE_RESOLVED:()=>ce,TAG_NAME_SERVICE:()=>io,TEMPLATE_PRICE:()=>vo,TEMPLATE_PRICE_ANNUAL:()=>wo,TEMPLATE_PRICE_LEGAL:()=>Lr,TEMPLATE_PRICE_STRIKETHROUGH:()=>yo,Term:()=>Q,WCS_PROD_URL:()=>Tr,WCS_STAGE_URL:()=>Ar});var be=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),Q=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"}),to="merch",ro="hidden",Et="wcms:commerce:ready",io="mas-commerce-service",se='span[is="inline-price"][data-wcs-osi]',Ii='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',no="sp-button[data-wcs-osi]",ar=`${se},${Ii}`,ao="merch-offer:ready",oo="merch-offer-select:ready",or="merch-card:action-menu-toggle",so="merch-offer:selected",co="merch-stock:change",lo="merch-storage:change",ho="merch-quantity-selector:change",po="merch-card-quantity:change",mo="merch-modal:addon-and-quantity-update",uo="merch-search:change",sr="merch-card-collection:sort",Ce="merch-card-collection:literals-changed",Le="merch-card-collection:sidenav-attached",cr="merch-card-collection:showmore",lr="merch-sidenav:select",hr="aem:load",dr="aem:error",fo="mas:ready",pr="mas:error",mr="placeholder-failed",ur="placeholder-pending",fr="placeholder-resolved",gr="Bad WCS request",xr="Commerce offer not found",go="Literals URL not provided",Er="mas:failed",br="mas:resolved",vr="mas/commerce",yr="mas.preview",wr="commerce.env",Sr="commerce.landscape",xo="commerce.aosKey",Eo="commerce.wcsKey",Tr="https://www.adobe.com/web_commerce_artifact",Ar="https://www.stage.adobe.com/web_commerce_artifact_stage",te="failed",ue="pending",ce="resolved",fe={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},We="X-Request-Id",j=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),bo="UCv3",ae=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"}),_r={PRODUCTION:"PRODUCTION"},ve={TWP:"twp",D2P:"d2p",CRM:"crm"},Pr=":start",Cr=":duration",vo="price",yo="price-strikethrough",wo="annual",Lr="legal",Xe="mas-ff-defaults",Z={alphabetical:"alphabetical",authored:"authored"};import{css as So,unsafeCSS as Hi}from"../lit-all.min.js";var re="(max-width: 767px)",Re="(max-width: 1199px)",I="(min-width: 768px)",L="(min-width: 1200px)",ge="(min-width: 1600px)";function bt(){return window.matchMedia(re)}function vt(){return window.matchMedia(L)}function yt(){return bt().matches}function wt(){return vt().matches}var ki=So`
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
    @media screen and ${Hi(I)} {
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
    @media screen and ${Hi(L)} {
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
`;var To="mas-commerce-service";var Ke=(e,t)=>e?.querySelector(`[slot="${t}"]`)?.textContent?.trim();function Me(e,t={},r=null,i=null){let n=i?document.createElement(e,{is:i}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,o]of Object.entries(t))n.setAttribute(a,o);return n}function St(e){return`startTime:${e.startTime.toFixed(2)}|duration:${e.duration.toFixed(2)}`}function Di(){return window.matchMedia("(max-width: 1024px)").matches}function Bi(){return document.getElementsByTagName(To)?.[0]}import{html as Tt,nothing as Ao}from"../lit-all.min.js";var Ne,Qe=class Qe{constructor(t){g(this,"card");z(this,Ne);this.card=t,this.insertVariantStyle()}getContainer(){return K(this,Ne,C(this,Ne)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),C(this,Ne)}insertVariantStyle(){if(!Qe.styleMap[this.card.variant]){Qe.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let i=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(i))||0;n>a&&this.getContainer().style.setProperty(i,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Tt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Tt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Tt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:Ao}get secureLabelFooter(){return Tt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return At(this.card.variant)}};Ne=new WeakMap,g(Qe,"styleMap",{});var k=Qe;import{html as Mr,css as _o}from"../lit-all.min.js";var Ui=`
:root {
    --consonant-merch-card-catalog-width: 276px;
    --consonant-merch-card-catalog-icon-size: 40px;
}

.collection-container.catalog {
    --merch-card-collection-card-min-height: 330px;
    --merch-card-collection-card-width: var(--consonant-merch-card-catalog-width);
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
}

@media screen and ${I} {
    :root {
        --consonant-merch-card-catalog-width: 302px;
    }
}

@media screen and ${L} {
    :root {
        --consonant-merch-card-catalog-width: 276px;
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
}`;var Fi={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Oe=class extends k{constructor(r){super(r);g(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(or,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});g(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let i=this.actionMenuContentSlot.classList.contains("hidden");i||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!i).toString())});g(this,"toggleActionMenuFromCard",r=>{let i=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(i||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",i),this.setAriaExpanded(this.actionMenu,"false"))});g(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Mr` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Di()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Mr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Mr`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ui}setAriaExpanded(r,i){r.setAttribute("aria-expanded",i)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};g(Oe,"variantStyle",_o`
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
    `);import{html as Ze}from"../lit-all.min.js";var Gi=`
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
`;var _t=class extends k{constructor(t){super(t)}getGlobalCSS(){return Gi}renderLayout(){return Ze`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?Ze`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:Ze`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?Ze`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:Ze`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Vi}from"../lit-all.min.js";var $i=`
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

@media screen and ${ge} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Pt=class extends k{constructor(t){super(t)}getGlobalCSS(){return $i}renderLayout(){return Vi` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Vi`<hr />`} ${this.secureLabelFooter}`}};import{html as Ie,css as Po,unsafeCSS as Nr}from"../lit-all.min.js";var zi=`
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
@media screen and ${re} {
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

@media screen and ${Re} {
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
`;var Co=32,He=class extends k{constructor(r){super(r);g(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);g(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Ie`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Ie`<slot name="secure-transaction-label"></slot>`;return Ie`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return zi}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let i=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");i&&i.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((i,n)=>{let a=Math.max(Co,parseFloat(window.getComputedStyle(i).height)||0),o=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>o&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(i=>{let n=i.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&i.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${se}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(r){let i=this.mainPrice,n=this.headingMPriceSlot;if(!i&&n){let a=r?.getAttribute("plan-type"),o=null;if(r&&a&&(o=r.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),r.checked){if(o){let s=Me("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},o.innerHTML);this.card.appendChild(s)}}else{let s=Me("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let r=this.card.addon;if(!r)return;let i=this.mainPrice,n=this.card.planType;i&&(await i.onceSettled(),n=i.value?.[0]?.planType),n&&(r.planType=n)}renderLayout(){return Ie` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(r=>r.onceSettled())),await this.adjustAddon(),yt()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};g(He,"variantStyle",Po`
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

    @media screen and ${Nr(re)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${Nr(Re)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Nr(L)} {
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
  `);import{html as Je,css as Lo,nothing as Ct}from"../lit-all.min.js";var ji=`
:root {
    --consonant-merch-card-plans-width: 300px;
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

merch-card[variant="plans-education"] span.heading-xs {
  margin-top: 16px;
  margin-bottom: 8px;
}

merch-card[variant="plans-education"] [slot="body-xs"] p:first-of-type span.heading-xs {
  margin-top: 8px;
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
@media screen and ${re} {
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
@media screen and ${I} {
  :root {
      --consonant-merch-card-plans-width: 302px;
  }

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
}

/* Large desktop */
@media screen and ${ge} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;var Lt={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Yi={...function(){let{whatsIncluded:e,size:t,...r}=Lt;return r}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},qi={...function(){let{whatsIncluded:e,size:t,quantitySelect:r,...i}=Lt;return i}()},Y=class extends k{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,r){t.dataset.template===Lr&&(r.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return ji}adjustSlotPlacement(t,r,i){let n=this.card.shadowRoot,a=n.querySelector("footer"),o=this.card.getAttribute("size"),s=n.querySelector(`footer slot[name="${t}"]`),l=n.querySelector(`.body slot[name="${t}"]`),c=n.querySelector(".body");if((!o||!o.includes("wide"))&&(a?.classList.remove("wide-footer"),s&&s.remove()),!!r.includes(o)){if(a?.classList.toggle("wide-footer",wt()),!i&&s){if(l)s.remove();else{let h=c.querySelector(`[data-placeholder-for="${t}"]`);h?h.replaceWith(s):c.appendChild(s)}return}if(i&&l){let h=document.createElement("div");if(h.setAttribute("data-placeholder-for",t),h.classList.add("slot-placeholder"),!s){let m=l.cloneNode(!0);a.prepend(m)}l.replaceWith(h)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],wt()),this.adjustSlotPlacement("callout-content",["super-wide"],wt())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",r=>{r.preventDefault(),r.target!==t?t.classList.add("hide-tooltip"):r.target.classList.remove("hide-tooltip")}))}adjustPrices(){this.headingM&&(this.headingM.setAttribute("role","heading"),this.headingM.setAttribute("aria-level","2"))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout(),this.adjustPrices()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${se}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Je`<div class="divider"></div>`:Ct}async adjustLegal(){if(await this.card.updateComplete,this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],r=this.card.querySelector(`[slot="heading-m"] ${se}[data-template="price"]`);r&&t.push(r);let i=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling))});await Promise.all(i)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let r=this.mainPrice;if(!r)return;await r.onceSettled();let i=r.value?.[0]?.planType;i&&(t.planType=i)}get stockCheckbox(){return this.card.checkboxLabel?Je`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Ct}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Ct:Je`<slot name="icons"></slot>`}connectedCallbackHook(){let t=bt();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let r=vt();r?.addEventListener&&r.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=bt();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let r=vt();r?.removeEventListener&&r.removeEventListener("change",this.adaptForMedia)}renderLayout(){return Je` ${this.badge}
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
            ${this.secureLabelFooter}`}};g(Y,"variantStyle",Lo`
        :host([variant^='plans']) {
            min-height: 273px;
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
            --merch-card-plans-min-width: 244px;
            --merch-card-plans-max-width: 244px;
            --merch-card-plans-padding: 15px;
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
        }

        :host([variant='plans']) ::slotted([slot='heading-xs']) {
            min-height: var(--merch-card-plans-heading-min-height);
        }

        :host([variant='plans']) .body {
            min-width: var(--merch-card-plans-min-width);
            max-width: var(--merch-card-plans-max-width);
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

        :host([variant='plans']) footer {
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
    `),g(Y,"collectionOptions",{customHeaderArea:t=>t.sidenav?Je`<slot name="resultsText"></slot>`:Ct,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as Or,css as Ro}from"../lit-all.min.js";var Wi=`
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
`;var ke=class extends k{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Wi}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Or` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Or`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Or`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),yt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${se}[data-template="price"]`)}toggleAddon(t){let r=this.mainPrice,i=this.headingXSSlot;if(!r&&i){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(o=>o.remove()),t.checked){if(a){let o=Me("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(o)}}else{let o=Me("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(o)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,i=this.card.planType;r&&(await r.onceSettled(),i=r.value?.[0]?.planType),i&&(t.planType=i)}};g(ke,"variantStyle",Ro`
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
    `);import{html as Ir,css as Mo}from"../lit-all.min.js";var Xi=`
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
@media screen and ${re} {
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
`;var De=class extends k{constructor(t){super(t)}getGlobalCSS(){return Xi}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ir` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ir`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ir`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};g(De,"variantStyle",Mo`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Hr,css as No}from"../lit-all.min.js";var Ki=`
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

@media screen and ${re} {
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

@media screen and ${ge} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Qi={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},Be=class extends k{constructor(t){super(t)}getGlobalCSS(){return Ki}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Hr`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Hr`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Hr`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};g(Be,"variantStyle",No`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as Oo,css as Io}from"../lit-all.min.js";var Zi=`
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
@media screen and ${Re} {
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
}

merch-card[variant="simplified-pricing-express"] [slot="footer"] sp-button[variant="accent"] {
    background-color: var(--spectrum-indigo-900);
}
`;var kr={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-l",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge"},trialBadge:{tag:"div",slot:"trial-badge"},description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"L"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)",gradient:"linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)"}},disabledAttributes:["badgeColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},Ue=class extends k{getGlobalCSS(){return Zi}get aemFragmentMapping(){return kr}get headingSelector(){return'[slot="heading-l"]'}postCardUpdateHook(t){t.has("borderColor")&&this.card.borderColor&&this.card.style.setProperty("--merch-card-custom-border-color",this.card.borderColor)}connectedCallbackHook(){!this.card||this.card.failed||(this.setupMobileAccordion(),this.watchForDefaultCardAttribute(),setTimeout(()=>{this.card?.hasAttribute("data-default-card")&&window.matchMedia("(max-width: 1199px)").matches&&this.card.setAttribute("data-expanded","true")},100))}watchForDefaultCardAttribute(){this.card&&(this.attributeObserver=new MutationObserver(t=>{t.forEach(r=>{r.type==="attributes"&&r.attributeName==="data-default-card"&&this.card.hasAttribute("data-default-card")&&window.matchMedia("(max-width: 1199px)").matches&&this.card.setAttribute("data-expanded","true")})}),this.attributeObserver.observe(this.card,{attributes:!0,attributeOldValue:!0}))}setupMobileAccordion(){let t=this.card;if(!t)return;let r=()=>{if(window.matchMedia("(max-width: 1199px)").matches){let n=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",n?"true":"false")}else t.removeAttribute("data-expanded")};r();let i=window.matchMedia("(max-width: 1199px)");this.mediaQueryListener=n=>{r()},i.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia("(max-width: 1199px)").removeEventListener("change",this.mediaQueryListener),this.attributeObserver&&this.attributeObserver.disconnect()}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let r=this.card;if(!r||!window.matchMedia("(max-width: 1199px)").matches)return;let a=r.getAttribute("data-expanded")==="true"?"false":"true";r.setAttribute("data-expanded",a)}renderLayout(){return Oo`
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
        `}};g(Ue,"variantStyle",Io`
        :host([variant='simplified-pricing-express']) {
            --merch-card-simplified-pricing-express-width: 294px;
            --merch-card-simplified-pricing-express-padding: 16px;
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
    `);var Dr=new Map,ie=(e,t,r=null,i=null,n)=>{Dr.set(e,{class:t,fragmentMapping:r,style:i,collectionOptions:n})};ie("catalog",Oe,Fi,Oe.variantStyle);ie("image",_t);ie("inline-heading",Pt);ie("mini-compare-chart",He,null,He.variantStyle);ie("plans",Y,Lt,Y.variantStyle,Y.collectionOptions);ie("plans-students",Y,qi,Y.variantStyle,Y.collectionOptions);ie("plans-education",Y,Yi,Y.variantStyle,Y.collectionOptions);ie("product",ke,null,ke.variantStyle);ie("segment",De,null,De.variantStyle);ie("special-offers",Be,Qi,Be.variantStyle);ie("simplified-pricing-express",Ue,kr,Ue.variantStyle);function At(e){return Dr.get(e)?.fragmentMapping}function Br(e){return Dr.get(e)?.collectionOptions}var Ji="tacocat.js";var Ur=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),en=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function R(e,t={},{metadata:r=!0,search:i=!0,storage:n=!0}={}){let a;if(i&&a==null){let o=new URLSearchParams(window.location.search),s=Fe(i)?i:e;a=o.get(s)}if(n&&a==null){let o=Fe(n)?n:e;a=window.sessionStorage.getItem(o)??window.localStorage.getItem(o)}if(r&&a==null){let o=ko(Fe(r)?r:e);a=document.documentElement.querySelector(`meta[name="${o}"]`)?.content}return a??t[e]}var Ho=e=>typeof e=="boolean",Rt=e=>typeof e=="function",Mt=e=>typeof e=="number",tn=e=>e!=null&&typeof e=="object";var Fe=e=>typeof e=="string",rn=e=>Fe(e)&&e,et=e=>Mt(e)&&Number.isFinite(e)&&e>0;function tt(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,i])=>{t(i)&&delete e[r]}),e}function E(e,t){if(Ho(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function rt(e,t,r){let i=Object.values(t);return i.find(n=>Ur(n,e))??r??i[0]}function ko(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,i)=>`${r}-${i}`).replace(/\W+/gu,"-").toLowerCase()}function nn(e,t=1){return Mt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var Do=Date.now(),Fr=()=>`(+${Date.now()-Do}ms)`,Nt=new Set,Bo=E(R("tacocat.debug",{},{metadata:!1}),!1);function an(e){let t=`[${Ji}/${e}]`,r=(o,s,...l)=>o?!0:(n(s,...l),!1),i=Bo?(o,...s)=>{console.debug(`${t} ${o}`,...s,Fr())}:()=>{},n=(o,...s)=>{let l=`${t} ${o}`;Nt.forEach(([c])=>c(l,...s))};return{assert:r,debug:i,error:n,warn:(o,...s)=>{let l=`${t} ${o}`;Nt.forEach(([,c])=>c(l,...s))}}}function Uo(e,t){let r=[e,t];return Nt.add(r),()=>{Nt.delete(r)}}Uo((e,...t)=>{console.error(e,...t,Fr())},(e,...t)=>{console.warn(e,...t,Fr())});var Fo="no promo",on="promo-tag",Go="yellow",$o="neutral",Vo=(e,t,r)=>{let i=a=>a||Fo,n=r?` (was "${i(t)}")`:"";return`${i(e)}${n}`},zo="cancel-context",Ot=(e,t)=>{let r=e===zo,i=!r&&e?.length>0,n=(i||r)&&(t&&t!=e||!t&&!r),a=n&&i||!n&&!!t,o=a?e||t:void 0;return{effectivePromoCode:o,overridenPromoCode:e,className:a?on:`${on} no-promo`,text:Vo(o,t,n),variant:a?Go:$o,isOverriden:n}};var Gr;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Gr||(Gr={}));var X;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(X||(X={}));var J;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(J||(J={}));var $r;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})($r||($r={}));var Vr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Vr||(Vr={}));var zr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(zr||(zr={}));var jr;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(jr||(jr={}));var Yr="ABM",qr="PUF",Wr="M2M",Xr="PERPETUAL",Kr="P3Y",jo="TAX_INCLUSIVE_DETAILS",Yo="TAX_EXCLUSIVE",sn={ABM:Yr,PUF:qr,M2M:Wr,PERPETUAL:Xr,P3Y:Kr},Lh={[Yr]:{commitment:X.YEAR,term:J.MONTHLY},[qr]:{commitment:X.YEAR,term:J.ANNUAL},[Wr]:{commitment:X.MONTH,term:J.MONTHLY},[Xr]:{commitment:X.PERPETUAL,term:void 0},[Kr]:{commitment:X.THREE_MONTHS,term:J.P3Y}},cn="Value is not an offer",It=e=>{if(typeof e!="object")return cn;let{commitment:t,term:r}=e,i=qo(t,r);return{...e,planType:i}};var qo=(e,t)=>{switch(e){case void 0:return cn;case"":return"";case X.YEAR:return t===J.MONTHLY?Yr:t===J.ANNUAL?qr:"";case X.MONTH:return t===J.MONTHLY?Wr:"";case X.PERPETUAL:return Xr;case X.TERM_LICENSE:return t===J.P3Y?Kr:"";default:return""}};function ln(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:i,priceWithoutTax:n,priceWithoutDiscountAndTax:a,taxDisplay:o}=t;if(o!==jo)return e;let s={...e,priceDetails:{...t,price:n??r,priceWithoutDiscount:a??i,taxDisplay:Yo}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Wo="mas-commerce-service",Xo={requestId:We,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function it(e,{country:t,forceTaxExclusive:r,perpetual:i}){let n;if(e.length<2)n=e;else{let a=t==="GB"?"EN":"MULT";e.sort((o,s)=>o.language===a?-1:s.language===a?1:0),e.sort((o,s)=>o.term?1:s.term?-1:0),n=[e[0]]}return r&&(n=n.map(ln)),n}var Ht=e=>window.setTimeout(e);function Ge(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(nn).filter(et);return r.length||(r=[t]),r}function kt(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(rn)}function V(){return document.getElementsByTagName(Wo)?.[0]}function hn(e){let t={};if(!e?.headers)return t;let r=e.headers;for(let[i,n]of Object.entries(Xo)){let a=r.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[i]=a)}return t}var ye={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},dn=1e3;function Ko(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function pn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:i,originatingRequest:n,status:a}=e;return[i,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ye.serializableTypes.includes(r))return r}return e}function Qo(e,t){if(!ye.ignoredProperties.includes(e))return pn(t)}var Qr={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,i=[],n=[],a=t;r.forEach(c=>{c!=null&&(Ko(c)?i:n).push(c)}),i.length&&(a+=" "+i.map(pn).join(" "));let{pathname:o,search:s}=window.location,l=`${ye.delimiter}page=${o}${s}`;l.length>dn&&(l=`${l.slice(0,dn)}<trunc>`),a+=l,n.length&&(a+=`${ye.delimiter}facts=`,a+=JSON.stringify(n,Qo)),window.lana?.log(a,ye)}};function Dt(e){Object.assign(ye,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ye&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var mn={LOCAL:"local",PROD:"prod",STAGE:"stage"},Zr={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Jr=new Set,ei=new Set,un=new Map,fn={append({level:e,message:t,params:r,timestamp:i,source:n}){console[e](`${i}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},gn={filter:({level:e})=>e!==Zr.DEBUG},Zo={filter:()=>!1};function Jo(e,t,r,i,n){return{level:e,message:t,namespace:r,get params(){return i.length===1&&Rt(i[0])&&(i=i[0](),Array.isArray(i)||(i=[i])),i},source:n,timestamp:performance.now().toFixed(3)}}function es(e){[...ei].every(t=>t(e))&&Jr.forEach(t=>t(e))}function xn(e){let t=(un.get(e)??0)+1;un.set(e,t);let r=`${e} #${t}`,i={id:r,namespace:e,module:n=>xn(`${i.namespace}/${n}`),updateConfig:Dt};return Object.values(Zr).forEach(n=>{i[n]=(a,...o)=>es(Jo(n,a,e,o,r))}),Object.seal(i)}function Bt(...e){e.forEach(t=>{let{append:r,filter:i}=t;Rt(i)&&ei.add(i),Rt(r)&&Jr.add(r)})}function ts(e={}){let{name:t}=e,r=E(R("commerce.debug",{search:!0,storage:!0}),t===mn.LOCAL);return Bt(r?fn:gn),t===mn.PROD&&Bt(Qr),ee}function rs(){Jr.clear(),ei.clear()}var ee={...xn(vr),Level:Zr,Plugins:{consoleAppender:fn,debugFilter:gn,quietFilter:Zo,lanaAppender:Qr},init:ts,reset:rs,use:Bt};var $e=class e extends Error{constructor(t,r,i){if(super(t,{cause:i}),this.name="MasError",r.response){let n=r.response.headers?.get(We);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([i,n])=>`${i}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};var is={[te]:mr,[ue]:ur,[ce]:fr},ns={[te]:Er,[ce]:br},nt,Ve=class{constructor(t){z(this,nt);g(this,"changes",new Map);g(this,"connected",!1);g(this,"error");g(this,"log");g(this,"options");g(this,"promises",[]);g(this,"state",ue);g(this,"timer",null);g(this,"value");g(this,"version",0);g(this,"wrapperElement");this.wrapperElement=t,this.log=ee.module("mas-element")}update(){[te,ue,ce].forEach(t=>{this.wrapperElement.classList.toggle(is[t],t===this.state)})}notify(){(this.state===ce||this.state===te)&&(this.state===ce?this.promises.forEach(({resolve:r})=>r(this.wrapperElement)):this.state===te&&this.promises.forEach(({reject:r})=>r(this.error)),this.promises=[]);let t=this.error;this.error instanceof $e&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(ns[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,r,i){this.changes.set(t,i),this.requestUpdate()}connectedCallback(){K(this,nt,V()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:r,state:i}=this;return ce===i?Promise.resolve(this.wrapperElement):te===i?Promise.reject(t):new Promise((n,a)=>{r.push({resolve:n,reject:a})})}toggleResolved(t,r,i){return t!==this.version?!1:(i!==void 0&&(this.options=i),this.state=ce,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Ht(()=>this.notify()),!0)}toggleFailed(t,r,i){if(t!==this.version)return!1;i!==void 0&&(this.options=i),this.error=r,this.state=te,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${r.message}`,{element:this.wrapperElement,...r.context,...C(this,nt)?.duration}),Ht(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=ue,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!V()||this.timer)return;let{error:r,options:i,state:n,value:a,version:o}=this;this.state=ue,this.timer=Ht(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===ue&&this.version===o&&(this.state=n,this.error=r,this.value=a,this.update(),this.notify())}catch(l){this.toggleFailed(this.version,l,i)}})}};nt=new WeakMap;function En(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Ut(e,t={}){let{tag:r,is:i}=e,n=document.createElement(r,{is:i});return n.setAttribute("is",i),Object.assign(n.dataset,En(t)),n}function Ft(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,En(t)),e):null}var bn="download",vn="upgrade",yn={e:"EDU",t:"TEAM"};function wn(e,t={},r=""){let i=V();if(!i)return null;let{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:m,quantity:p,wcsOsi:d,extraOptions:u,analyticsId:f}=i.collectCheckoutOptions(t),b=Ut(e,{checkoutMarketSegment:n,checkoutWorkflow:a,checkoutWorkflowStep:o,entitlement:s,upgrade:l,modal:c,perpetual:h,promotionCode:m,quantity:p,wcsOsi:d,extraOptions:u,analyticsId:f});return r&&(b.innerHTML=`<span style="pointer-events: none;">${r}</span>`),b}function Sn(e){return class extends e{constructor(){super(...arguments);g(this,"checkoutActionHandler");g(this,"masElement",new Ve(this))}attributeChangedCallback(i,n,a){this.masElement.attributeChangedCallback(i,n,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get marketSegment(){let i=this.options?.ms??this.value?.[0].marketSegments?.[0];return yn[i]??i}get customerSegment(){let i=this.options?.cs??this.value?.[0]?.customerSegment;return yn[i]??i}get is3in1Modal(){return Object.values(ve).includes(this.getAttribute("data-modal"))}get isOpen3in1Modal(){let i=document.querySelector("meta[name=mas-ff-3in1]");return this.is3in1Modal&&(!i||i.content!=="off")}requestUpdate(i=!1){return this.masElement.requestUpdate(i)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(i={}){let n=V();if(!n)return!1;this.dataset.imsCountry||n.imsCountryPromise.then(m=>{m&&(this.dataset.imsCountry=m)}),i.imsCountry=null;let a=n.collectCheckoutOptions(i,this);if(!a.wcsOsi.length)return!1;let o;try{o=JSON.parse(a.extraOptions??"{}")}catch(m){this.masElement.log?.error("cannot parse exta checkout options",m)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let l=n.resolveOfferSelectors(a),c=await Promise.all(l);c=c.map(m=>it(m,a)),a.country=this.dataset.imsCountry||a.country;let h=await n.buildCheckoutAction?.(c.flat(),{...o,...a},this);return this.renderOffers(c.flat(),a,{},h,s)}renderOffers(i,n,a={},o=void 0,s=void 0){let l=V();if(!l)return!1;if(n={...JSON.parse(this.dataset.extraOptions??"null"),...n,...a},s??(s=this.masElement.togglePending(n)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),o){this.classList.remove(bn,vn),this.masElement.toggleResolved(s,i,n);let{url:h,text:m,className:p,handler:d}=o;h&&this.setCheckoutUrl(h),m&&(this.firstElementChild.innerHTML=m),p&&this.classList.add(...p.split(" ")),d&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=d.bind(this))}if(i.length){if(this.masElement.toggleResolved(s,i,n)){if(!this.classList.contains(bn)&&!this.classList.contains(vn)){let h=l.buildCheckoutURL(i,n);this.setCheckoutUrl(n.modal==="true"?"#":h)}return!0}}else{let h=new Error(`Not provided: ${n?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,n))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(i){}updateOptions(i={}){let n=V();if(!n)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:m,promotionCode:p,quantity:d,wcsOsi:u}=n.collectCheckoutOptions(i);return Ft(this,{checkoutMarketSegment:a,checkoutWorkflow:o,checkoutWorkflowStep:s,entitlement:l,upgrade:c,modal:h,perpetual:m,promotionCode:p,quantity:d,wcsOsi:u}),!0}}}var at=class at extends Sn(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return wn(at,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};g(at,"is","checkout-link"),g(at,"tag","a");var le=at;window.customElements.get(le.is)||window.customElements.define(le.is,le,{extends:le.tag});var as="p_draft_landscape",os="/store/",ss=new Map([["countrySpecific","cs"],["customerSegment","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["addonProductArrangementCode","ao"],["offerType","ot"],["marketSegment","ms"]]),ti=new Set(["af","ai","ao","apc","appctxid","cli","co","cs","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),cs=["env","workflowStep","clientId","country"],Tn=e=>ss.get(e)??e;function ri(e,t,r){for(let[i,n]of Object.entries(e)){let a=Tn(i);n!=null&&r.has(a)&&t.set(a,n)}}function ls(e){switch(e){case _r.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function hs(e,t){for(let r in e){let i=e[r];for(let[n,a]of Object.entries(i)){if(a==null)continue;let o=Tn(n);t.set(`items[${r}][${o}]`,a)}}}function ds({url:e,modal:t,is3in1:r}){if(!r||!e?.searchParams)return e;e.searchParams.set("rtc","t"),e.searchParams.set("lo","sl");let i=e.searchParams.get("af");return e.searchParams.set("af",[i,"uc_new_user_iframe","uc_new_system_close"].filter(Boolean).join(",")),e.searchParams.get("cli")!=="doc_cloud"&&e.searchParams.set("cli",t===ve.CRM?"creative":"mini_plans"),e}function An(e){ps(e);let{env:t,items:r,workflowStep:i,marketSegment:n,customerSegment:a,offerType:o,productArrangementCode:s,landscape:l,modal:c,is3in1:h,preselectPlan:m,...p}=e,d=new URL(ls(t));if(d.pathname=`${os}${i}`,i!==j.SEGMENTATION&&i!==j.CHANGE_PLAN_TEAM_PLANS&&hs(r,d.searchParams),ri({...p},d.searchParams,ti),l===fe.DRAFT&&ri({af:as},d.searchParams,ti),i===j.SEGMENTATION){let u={marketSegment:n,offerType:o,customerSegment:a,productArrangementCode:s,quantity:r?.[0]?.quantity,addonProductArrangementCode:s?r?.find(f=>f.productArrangementCode!==s)?.productArrangementCode:r?.[1]?.productArrangementCode};m?.toLowerCase()==="edu"?d.searchParams.set("ms","EDU"):m?.toLowerCase()==="team"&&d.searchParams.set("cs","TEAM"),ri(u,d.searchParams,ti),d.searchParams.get("ot")==="PROMOTION"&&d.searchParams.delete("ot"),d=ds({url:d,modal:c,is3in1:h})}return d.toString()}function ps(e){for(let t of cs)if(!e[t])throw new Error('Argument "checkoutData" is not valid, missing: '+t);if(e.workflowStep!==j.SEGMENTATION&&e.workflowStep!==j.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}var A=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflowStep:j.EMAIL,country:"US",displayOldPrice:!1,displayPerUnit:!0,displayRecurrence:!0,displayTax:!1,displayPlanType:!1,env:ae.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:fe.PUBLISHED});function _n({settings:e}){function t(n,a){let{checkoutClientId:o,checkoutWorkflowStep:s,country:l,language:c,promotionCode:h,quantity:m,preselectPlan:p}=e,{checkoutMarketSegment:d,checkoutWorkflowStep:u=s,imsCountry:f,country:b=f??l,language:_=c,quantity:y=m,entitlement:x,upgrade:P,modal:T,perpetual:N,promotionCode:H=h,wcsOsi:G,extraOptions:O,...F}=Object.assign({},a?.dataset??{},n??{}),B=rt(u,j,A.checkoutWorkflowStep);return tt({...F,extraOptions:O,checkoutClientId:o,checkoutMarketSegment:d,country:b,quantity:Ge(y,A.quantity),checkoutWorkflowStep:B,language:_,entitlement:E(x),upgrade:E(P),modal:T,perpetual:E(N),promotionCode:Ot(H).effectivePromoCode,wcsOsi:kt(G),preselectPlan:p})}function r(n,a){if(!Array.isArray(n)||!n.length||!a)return"";let{env:o,landscape:s}=e,{checkoutClientId:l,checkoutMarketSegment:c,checkoutWorkflowStep:h,country:m,promotionCode:p,quantity:d,preselectPlan:u,ms:f,cs:b,..._}=t(a),y=document.querySelector("meta[name=mas-ff-3in1]"),x=Object.values(ve).includes(a.modal)&&(!y||y.content!=="off"),P=window.frameElement||x?"if":"fp",[{productArrangementCode:T,marketSegments:[N],customerSegment:H,offerType:G}]=n,O=f??N??c,F=b??H;u?.toLowerCase()==="edu"?O="EDU":u?.toLowerCase()==="team"&&(F="TEAM");let B={is3in1:x,checkoutPromoCode:p,clientId:l,context:P,country:m,env:o,items:[],marketSegment:O,customerSegment:F,offerType:G,productArrangementCode:T,workflowStep:h,landscape:s,..._},me=d[0]>1?d[0]:void 0;if(n.length===1){let{offerId:oe}=n[0];B.items.push({id:oe,quantity:me})}else B.items.push(...n.map(({offerId:oe,productArrangementCode:Ae})=>({id:oe,quantity:me,...x?{productArrangementCode:Ae}:{}})));return An(B)}let{createCheckoutLink:i}=le;return{CheckoutLink:le,CheckoutWorkflowStep:j,buildCheckoutURL:r,collectCheckoutOptions:t,createCheckoutLink:i}}function ms({interval:e=200,maxAttempts:t=25}={}){let r=ee.module("ims");return new Promise(i=>{r.debug("Waing for IMS to be ready");let n=0;function a(){window.adobeIMS?.initialized?i():++n>t?(r.debug("Timeout"),i()):setTimeout(a,e)}a()})}function us(e){return e.then(()=>window.adobeIMS?.isSignedInUser()??!1)}function fs(e){let t=ee.module("ims");return e.then(r=>r?window.adobeIMS.getProfile().then(({countryCode:i})=>(t.debug("Got user country:",i),i),i=>{t.error("Unable to get user country:",i)}):null)}function Pn({}){let e=ms(),t=us(e),r=fs(t);return{imsReadyPromise:e,imsSignedInPromise:t,imsCountryPromise:r}}var Cn=window.masPriceLiterals;function Ln(e){if(Array.isArray(Cn)){let t=i=>Cn.find(n=>Ur(n.lang,i)),r=t(e.language)??t(A.language);if(r)return Object.freeze(r)}return{}}var ii=function(e,t){return ii=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,i){r.__proto__=i}||function(r,i){for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(r[n]=i[n])},ii(e,t)};function ot(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");ii(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var w=function(){return w=Object.assign||function(t){for(var r,i=1,n=arguments.length;i<n;i++){r=arguments[i];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},w.apply(this,arguments)};function Gt(e,t,r){if(r||arguments.length===2)for(var i=0,n=t.length,a;i<n;i++)(a||!(i in t))&&(a||(a=Array.prototype.slice.call(t,0,i)),a[i]=t[i]);return e.concat(a||Array.prototype.slice.call(t))}var v;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(v||(v={}));var M;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(M||(M={}));var we;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(we||(we={}));function ni(e){return e.type===M.literal}function Rn(e){return e.type===M.argument}function $t(e){return e.type===M.number}function Vt(e){return e.type===M.date}function zt(e){return e.type===M.time}function jt(e){return e.type===M.select}function Yt(e){return e.type===M.plural}function Mn(e){return e.type===M.pound}function qt(e){return e.type===M.tag}function Wt(e){return!!(e&&typeof e=="object"&&e.type===we.number)}function st(e){return!!(e&&typeof e=="object"&&e.type===we.dateTime)}var ai=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var gs=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Nn(e){var t={};return e.replace(gs,function(r){var i=r.length;switch(r[0]){case"G":t.era=i===4?"long":i===5?"narrow":"short";break;case"y":t.year=i===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][i-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][i-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=i===4?"short":i===5?"narrow":"short";break;case"e":if(i<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"c":if(i<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][i-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][i-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][i-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][i-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][i-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][i-1];break;case"s":t.second=["numeric","2-digit"][i-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=i<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var On=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Dn(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(On).filter(function(p){return p.length>0}),r=[],i=0,n=t;i<n.length;i++){var a=n[i],o=a.split("/");if(o.length===0)throw new Error("Invalid number skeleton");for(var s=o[0],l=o.slice(1),c=0,h=l;c<h.length;c++){var m=h[c];if(m.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:l})}return r}function xs(e){return e.replace(/^(.*?)-/,"")}var In=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Bn=/^(@+)?(\+|#+)?[rs]?$/g,Es=/(\*)(0+)|(#+)(0+)|(0+)/g,Un=/^(0+)$/;function Hn(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(Bn,function(r,i,n){return typeof n!="string"?(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length):n==="+"?t.minimumSignificantDigits=i.length:i[0]==="#"?t.maximumSignificantDigits=i.length:(t.minimumSignificantDigits=i.length,t.maximumSignificantDigits=i.length+(typeof n=="string"?n.length:0)),""}),t}function Fn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function bs(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!Un.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function kn(e){var t={},r=Fn(e);return r||t}function Gn(e){for(var t={},r=0,i=e;r<i.length;r++){var n=i[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=xs(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=w(w(w({},t),{notation:"scientific"}),n.options.reduce(function(l,c){return w(w({},l),kn(c))},{}));continue;case"engineering":t=w(w(w({},t),{notation:"engineering"}),n.options.reduce(function(l,c){return w(w({},l),kn(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(Es,function(l,c,h,m,p,d){if(c)t.minimumIntegerDigits=h.length;else{if(m&&p)throw new Error("We currently do not support maximum integer digits");if(d)throw new Error("We currently do not support exact integer digits")}return""});continue}if(Un.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(In.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(In,function(l,c,h,m,p,d){return h==="*"?t.minimumFractionDigits=c.length:m&&m[0]==="#"?t.maximumFractionDigits=m.length:p&&d?(t.minimumFractionDigits=p.length,t.maximumFractionDigits=p.length+d.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""});var a=n.options[0];a==="w"?t=w(w({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=w(w({},t),Hn(a)));continue}if(Bn.test(n.stem)){t=w(w({},t),Hn(n.stem));continue}var o=Fn(n.stem);o&&(t=w(w({},t),o));var s=bs(n.stem);s&&(t=w(w({},t),s))}return t}var ct={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function $n(e,t){for(var r="",i=0;i<e.length;i++){var n=e.charAt(i);if(n==="j"){for(var a=0;i+1<e.length&&e.charAt(i+1)===n;)a++,i++;var o=1+(a&1),s=a<2?1:3+(a>>1),l="a",c=vs(t);for((c=="H"||c=="k")&&(s=0);s-- >0;)r+=l;for(;o-- >0;)r=c+r}else n==="J"?r+="H":r+=n}return r}function vs(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,i;r!=="root"&&(i=e.maximize().region);var n=ct[i||""]||ct[r||""]||ct["".concat(r,"-001")]||ct["001"];return n[0]}var oi,ys=new RegExp("^".concat(ai.source,"*")),ws=new RegExp("".concat(ai.source,"*$"));function S(e,t){return{start:e,end:t}}var Ss=!!String.prototype.startsWith,Ts=!!String.fromCodePoint,As=!!Object.fromEntries,_s=!!String.prototype.codePointAt,Ps=!!String.prototype.trimStart,Cs=!!String.prototype.trimEnd,Ls=!!Number.isSafeInteger,Rs=Ls?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},ci=!0;try{Vn=qn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),ci=((oi=Vn.exec("a"))===null||oi===void 0?void 0:oi[0])==="a"}catch{ci=!1}var Vn,zn=Ss?function(t,r,i){return t.startsWith(r,i)}:function(t,r,i){return t.slice(i,i+r.length)===r},li=Ts?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var i="",n=t.length,a=0,o;n>a;){if(o=t[a++],o>1114111)throw RangeError(o+" is not a valid code point");i+=o<65536?String.fromCharCode(o):String.fromCharCode(((o-=65536)>>10)+55296,o%1024+56320)}return i},jn=As?Object.fromEntries:function(t){for(var r={},i=0,n=t;i<n.length;i++){var a=n[i],o=a[0],s=a[1];r[o]=s}return r},Yn=_s?function(t,r){return t.codePointAt(r)}:function(t,r){var i=t.length;if(!(r<0||r>=i)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===i||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},Ms=Ps?function(t){return t.trimStart()}:function(t){return t.replace(ys,"")},Ns=Cs?function(t){return t.trimEnd()}:function(t){return t.replace(ws,"")};function qn(e,t){return new RegExp(e,t)}var hi;ci?(si=qn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),hi=function(t,r){var i;si.lastIndex=r;var n=si.exec(t);return(i=n[1])!==null&&i!==void 0?i:""}):hi=function(t,r){for(var i=[];;){var n=Yn(t,r);if(n===void 0||Xn(n)||Hs(n))break;i.push(n),r+=n>=65536?2:1}return li.apply(void 0,i)};var si,Wn=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,i){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var o=this.parseArgument(t,i);if(o.err)return o;n.push(o.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:M.pound,location:S(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(i)break;return this.error(v.UNMATCHED_CLOSING_TAG,S(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&di(this.peek()||0)){var o=this.parseTag(t,r);if(o.err)return o;n.push(o.val)}else{var o=this.parseLiteral(t,r);if(o.err)return o;n.push(o.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var i=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:M.literal,value:"<".concat(n,"/>"),location:S(i,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var o=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!di(this.char()))return this.error(v.INVALID_TAG,S(s,this.clonePosition()));var l=this.clonePosition(),c=this.parseTagName();return n!==c?this.error(v.UNMATCHED_CLOSING_TAG,S(l,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:M.tag,value:n,children:o,location:S(i,this.clonePosition())},err:null}:this.error(v.INVALID_TAG,S(s,this.clonePosition())))}else return this.error(v.UNCLOSED_TAG,S(i,this.clonePosition()))}else return this.error(v.INVALID_TAG,S(i,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Is(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var i=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var o=this.tryParseUnquoted(t,r);if(o){n+=o;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var l=S(i,this.clonePosition());return{val:{type:M.literal,value:n,location:l},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Os(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var i=this.char();if(i===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(i);this.bump()}return li.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var i=this.char();return i===60||i===123||i===35&&(r==="plural"||r==="selectordinal")||i===125&&t>0?null:(this.bump(),li(i))},e.prototype.parseArgument=function(t,r){var i=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(v.EMPTY_ARGUMENT,S(i,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(v.MALFORMED_ARGUMENT,S(i,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:M.argument,value:n,location:S(i,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,S(i,this.clonePosition())):this.parseArgumentOptions(t,r,n,i);default:return this.error(v.MALFORMED_ARGUMENT,S(i,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),i=hi(this.message,r),n=r+i.length;this.bumpTo(n);var a=this.clonePosition(),o=S(t,a);return{value:i,location:o}},e.prototype.parseArgumentOptions=function(t,r,i,n){var a,o=this.clonePosition(),s=this.parseIdentifierIfPossible().value,l=this.clonePosition();switch(s){case"":return this.error(v.EXPECT_ARGUMENT_TYPE,S(o,l));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),m=this.parseSimpleArgStyleIfPossible();if(m.err)return m;var p=Ns(m.val);if(p.length===0)return this.error(v.EXPECT_ARGUMENT_STYLE,S(this.clonePosition(),this.clonePosition()));var d=S(h,this.clonePosition());c={style:p,styleLocation:d}}var u=this.tryParseArgumentClose(n);if(u.err)return u;var f=S(n,this.clonePosition());if(c&&zn(c?.style,"::",0)){var b=Ms(c.style.slice(2));if(s==="number"){var m=this.parseNumberSkeletonFromString(b,c.styleLocation);return m.err?m:{val:{type:M.number,value:i,location:f,style:m.val},err:null}}else{if(b.length===0)return this.error(v.EXPECT_DATE_TIME_SKELETON,f);var _=b;this.locale&&(_=$n(b,this.locale));var p={type:we.dateTime,pattern:_,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?Nn(_):{}},y=s==="date"?M.date:M.time;return{val:{type:y,value:i,location:f,style:p},err:null}}}return{val:{type:s==="number"?M.number:s==="date"?M.date:M.time,value:i,location:f,style:(a=c?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var x=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(v.EXPECT_SELECT_ARGUMENT_OPTIONS,S(x,w({},x)));this.bumpSpace();var P=this.parseIdentifierIfPossible(),T=0;if(s!=="select"&&P.value==="offset"){if(!this.bumpIf(":"))return this.error(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,S(this.clonePosition(),this.clonePosition()));this.bumpSpace();var m=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,v.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(m.err)return m;this.bumpSpace(),P=this.parseIdentifierIfPossible(),T=m.val}var N=this.tryParsePluralOrSelectOptions(t,s,r,P);if(N.err)return N;var u=this.tryParseArgumentClose(n);if(u.err)return u;var H=S(n,this.clonePosition());return s==="select"?{val:{type:M.select,value:i,options:jn(N.val),location:H},err:null}:{val:{type:M.plural,value:i,options:jn(N.val),offset:T,pluralType:s==="plural"?"cardinal":"ordinal",location:H},err:null}}default:return this.error(v.INVALID_ARGUMENT_TYPE,S(o,l))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(v.EXPECT_ARGUMENT_CLOSING_BRACE,S(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var i=this.char();switch(i){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(v.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,S(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var i=[];try{i=Dn(t)}catch{return this.error(v.INVALID_NUMBER_SKELETON,r)}return{val:{type:we.number,tokens:i,location:r,parsedOptions:this.shouldParseSkeletons?Gn(i):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,i,n){for(var a,o=!1,s=[],l=new Set,c=n.value,h=n.location;;){if(c.length===0){var m=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var p=this.tryParseDecimalInteger(v.EXPECT_PLURAL_ARGUMENT_SELECTOR,v.INVALID_PLURAL_ARGUMENT_SELECTOR);if(p.err)return p;h=S(m,this.clonePosition()),c=this.message.slice(m.offset,this.offset())}else break}if(l.has(c))return this.error(r==="select"?v.DUPLICATE_SELECT_ARGUMENT_SELECTOR:v.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);c==="other"&&(o=!0),this.bumpSpace();var d=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:v.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,S(this.clonePosition(),this.clonePosition()));var u=this.parseMessage(t+1,r,i);if(u.err)return u;var f=this.tryParseArgumentClose(d);if(f.err)return f;s.push([c,{value:u.val,location:S(d,this.clonePosition())}]),l.add(c),this.bumpSpace(),a=this.parseIdentifierIfPossible(),c=a.value,h=a.location}return s.length===0?this.error(r==="select"?v.EXPECT_SELECT_ARGUMENT_SELECTOR:v.EXPECT_PLURAL_ARGUMENT_SELECTOR,S(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!o?this.error(v.MISSING_OTHER_CLAUSE,S(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var i=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(i=-1);for(var a=!1,o=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,o=o*10+(s-48),this.bump();else break}var l=S(n,this.clonePosition());return a?(o*=i,Rs(o)?{val:o,err:null}:this.error(r,l)):this.error(t,l)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Yn(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(zn(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),i=this.message.indexOf(t,r);return i>=0?(this.bumpTo(i),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Xn(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),i=this.message.charCodeAt(r+(t>=65536?2:1));return i??null},e}();function di(e){return e>=97&&e<=122||e>=65&&e<=90}function Os(e){return di(e)||e===47}function Is(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Xn(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Hs(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function pi(e){e.forEach(function(t){if(delete t.location,jt(t)||Yt(t))for(var r in t.options)delete t.options[r].location,pi(t.options[r].value);else $t(t)&&Wt(t.style)||(Vt(t)||zt(t))&&st(t.style)?delete t.style.location:qt(t)&&pi(t.children)})}function Kn(e,t){t===void 0&&(t={}),t=w({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Wn(e,t).parse();if(r.err){var i=SyntaxError(v[r.err.kind]);throw i.location=r.err.location,i.originalMessage=r.err.message,i}return t?.captureLocation||pi(r.val),r.val}function lt(e,t){var r=t&&t.cache?t.cache:Gs,i=t&&t.serializer?t.serializer:Fs,n=t&&t.strategy?t.strategy:Ds;return n(e,{cache:r,serializer:i})}function ks(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Qn(e,t,r,i){var n=ks(i)?i:r(i),a=t.get(n);return typeof a>"u"&&(a=e.call(this,i),t.set(n,a)),a}function Zn(e,t,r){var i=Array.prototype.slice.call(arguments,3),n=r(i),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,i),t.set(n,a)),a}function mi(e,t,r,i,n){return r.bind(t,e,i,n)}function Ds(e,t){var r=e.length===1?Qn:Zn;return mi(e,this,r,t.cache.create(),t.serializer)}function Bs(e,t){return mi(e,this,Zn,t.cache.create(),t.serializer)}function Us(e,t){return mi(e,this,Qn,t.cache.create(),t.serializer)}var Fs=function(){return JSON.stringify(arguments)};function ui(){this.cache=Object.create(null)}ui.prototype.get=function(e){return this.cache[e]};ui.prototype.set=function(e,t){this.cache[e]=t};var Gs={create:function(){return new ui}},Xt={variadic:Bs,monadic:Us};var Se;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(Se||(Se={}));var ht=function(e){ot(t,e);function t(r,i,n){var a=e.call(this,r)||this;return a.code=i,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var fi=function(e){ot(t,e);function t(r,i,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(i,'". Options are "').concat(Object.keys(n).join('", "'),'"'),Se.INVALID_VALUE,a)||this}return t}(ht);var Jn=function(e){ot(t,e);function t(r,i,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(i),Se.INVALID_VALUE,n)||this}return t}(ht);var ea=function(e){ot(t,e);function t(r,i){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(i,'"'),Se.MISSING_VALUE,i)||this}return t}(ht);var $;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})($||($={}));function $s(e){return e.length<2?e:e.reduce(function(t,r){var i=t[t.length-1];return!i||i.type!==$.literal||r.type!==$.literal?t.push(r):i.value+=r.value,t},[])}function Vs(e){return typeof e=="function"}function dt(e,t,r,i,n,a,o){if(e.length===1&&ni(e[0]))return[{type:$.literal,value:e[0].value}];for(var s=[],l=0,c=e;l<c.length;l++){var h=c[l];if(ni(h)){s.push({type:$.literal,value:h.value});continue}if(Mn(h)){typeof a=="number"&&s.push({type:$.literal,value:r.getNumberFormat(t).format(a)});continue}var m=h.value;if(!(n&&m in n))throw new ea(m,o);var p=n[m];if(Rn(h)){(!p||typeof p=="string"||typeof p=="number")&&(p=typeof p=="string"||typeof p=="number"?String(p):""),s.push({type:typeof p=="string"?$.literal:$.object,value:p});continue}if(Vt(h)){var d=typeof h.style=="string"?i.date[h.style]:st(h.style)?h.style.parsedOptions:void 0;s.push({type:$.literal,value:r.getDateTimeFormat(t,d).format(p)});continue}if(zt(h)){var d=typeof h.style=="string"?i.time[h.style]:st(h.style)?h.style.parsedOptions:i.time.medium;s.push({type:$.literal,value:r.getDateTimeFormat(t,d).format(p)});continue}if($t(h)){var d=typeof h.style=="string"?i.number[h.style]:Wt(h.style)?h.style.parsedOptions:void 0;d&&d.scale&&(p=p*(d.scale||1)),s.push({type:$.literal,value:r.getNumberFormat(t,d).format(p)});continue}if(qt(h)){var u=h.children,f=h.value,b=n[f];if(!Vs(b))throw new Jn(f,"function",o);var _=dt(u,t,r,i,n,a),y=b(_.map(function(T){return T.value}));Array.isArray(y)||(y=[y]),s.push.apply(s,y.map(function(T){return{type:typeof T=="string"?$.literal:$.object,value:T}}))}if(jt(h)){var x=h.options[p]||h.options.other;if(!x)throw new fi(h.value,p,Object.keys(h.options),o);s.push.apply(s,dt(x.value,t,r,i,n));continue}if(Yt(h)){var x=h.options["=".concat(p)];if(!x){if(!Intl.PluralRules)throw new ht(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,Se.MISSING_INTL_API,o);var P=r.getPluralRules(t,{type:h.pluralType}).select(p-(h.offset||0));x=h.options[P]||h.options.other}if(!x)throw new fi(h.value,p,Object.keys(h.options),o);s.push.apply(s,dt(x.value,t,r,i,n,p-(h.offset||0)));continue}}return $s(s)}function zs(e,t){return t?w(w(w({},e||{}),t||{}),Object.keys(e).reduce(function(r,i){return r[i]=w(w({},e[i]),t[i]||{}),r},{})):e}function js(e,t){return t?Object.keys(e).reduce(function(r,i){return r[i]=zs(e[i],t[i]),r},w({},e)):e}function gi(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ys(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:lt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.NumberFormat).bind.apply(t,Gt([void 0],r,!1)))},{cache:gi(e.number),strategy:Xt.variadic}),getDateTimeFormat:lt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.DateTimeFormat).bind.apply(t,Gt([void 0],r,!1)))},{cache:gi(e.dateTime),strategy:Xt.variadic}),getPluralRules:lt(function(){for(var t,r=[],i=0;i<arguments.length;i++)r[i]=arguments[i];return new((t=Intl.PluralRules).bind.apply(t,Gt([void 0],r,!1)))},{cache:gi(e.pluralRules),strategy:Xt.variadic})}}var ta=function(){function e(t,r,i,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(o){var s=a.formatToParts(o);if(s.length===1)return s[0].value;var l=s.reduce(function(c,h){return!c.length||h.type!==$.literal||typeof c[c.length-1]!="string"?c.push(h.value):c[c.length-1]+=h.value,c},[]);return l.length<=1?l[0]||"":l},this.formatToParts=function(o){return dt(a.ast,a.locales,a.formatters,a.formats,o,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=js(e.formats,i),this.formatters=n&&n.formatters||Ys(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=Kn,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var ra=ta;var qs=/[0-9\-+#]/,Ws=/[^\d\-+#]/g;function ia(e){return e.search(qs)}function Xs(e="#.##"){let t={},r=e.length,i=ia(e);t.prefix=i>0?e.substring(0,i):"";let n=ia(e.split("").reverse().join("")),a=r-n,o=e.substring(a,a+1),s=a+(o==="."||o===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(i,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let l=t.mask.match(Ws);return t.decimal=l&&l[l.length-1]||".",t.separator=l&&l[1]&&l[0]||",",l=t.mask.split(t.decimal),t.integer=l[0],t.fraction=l[1],t}function Ks(e,t,r){let i=!1,n={value:e};e<0&&(i=!0,n.value=-n.value),n.sign=i?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[o="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=o,n.fraction=s,Qs(n,t),(n.result==="0"||n.result==="")&&(i=!1,n.sign=""),!i&&t.maskHasPositiveSign?n.sign="+":i&&t.maskHasPositiveSign?n.sign="-":i&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function Qs(e,t){e.result="";let r=t.integer.split(t.separator),i=r.join(""),n=i&&i.indexOf("0");if(n>-1)for(;e.integer.length<i.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let o=e.integer.length,s=o%a;for(let l=0;l<o;l++)e.result+=e.integer.charAt(l),!((l-s+1)%a)&&l<o-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Zs(e,t,r={}){if(!e||isNaN(Number(t)))return t;let i=Xs(e),n=Ks(t,i,r);return i.prefix+n.sign+n.result+i.suffix}var na=Zs;var aa=".",Js=",",sa=/^\s+/,ca=/\s+$/,oa="&nbsp;",xi=e=>e*12,la=(e,t)=>{let{start:r,end:i,displaySummary:{amount:n,duration:a,minProductQuantity:o,outcomeType:s}={}}=e;if(!(n&&a&&s&&o))return!1;let l=t?new Date(t):new Date;if(!r||!i)return!1;let c=new Date(r),h=new Date(i);return l>=c&&l<=h},Te={MONTH:"MONTH",YEAR:"YEAR"},ec={[Q.ANNUAL]:12,[Q.MONTHLY]:1,[Q.THREE_YEARS]:36,[Q.TWO_YEARS]:24},Ei=(e,t)=>({accept:e,round:t}),tc=[Ei(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),Ei(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),Ei(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],bi={[be.YEAR]:{[Q.MONTHLY]:Te.MONTH,[Q.ANNUAL]:Te.YEAR},[be.MONTH]:{[Q.MONTHLY]:Te.MONTH}},rc=(e,t)=>e.indexOf(`'${t}'`)===0,ic=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),i=da(r);return!!i?t||(r=r.replace(/[,\.]0+/,i)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+ac(e)),r},nc=e=>{let t=oc(e),r=rc(e,t),i=e.replace(/'.*?'/,""),n=sa.test(i)||ca.test(i);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},ha=e=>e.replace(sa,oa).replace(ca,oa),ac=e=>e.match(/#(.?)#/)?.[1]===aa?Js:aa,oc=e=>e.match(/'(.*?)'/)?.[1]??"",da=e=>e.match(/0(.?)0/)?.[1]??"";function ze({formatString:e,price:t,usePrecision:r,isIndianPrice:i=!1},n,a=o=>o){let{currencySymbol:o,isCurrencyFirst:s,hasCurrencySpace:l}=nc(e),c=r?da(e):"",h=ic(e,r),m=r?2:0,p=a(t,{currencySymbol:o}),d=i?p.toLocaleString("hi-IN",{minimumFractionDigits:m,maximumFractionDigits:m}):na(h,p),u=r?d.lastIndexOf(c):d.length,f=d.substring(0,u),b=d.substring(u+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,d).replace(/SYMBOL/,o),currencySymbol:o,decimals:b,decimalsDelimiter:c,hasCurrencySpace:l,integer:f,isCurrencyFirst:s,recurrenceTerm:n}}var pa=e=>{let{commitment:t,term:r,usePrecision:i}=e,n=ec[r]??1;return ze(e,n>1?Te.MONTH:bi[t]?.[r],a=>{let o={divisor:n,price:a,usePrecision:i},{round:s}=tc.find(({accept:l})=>l(o));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(o)}`);return s(o)})},ma=({commitment:e,term:t,...r})=>ze(r,bi[e]?.[t]),ua=e=>{let{commitment:t,instant:r,price:i,originalPrice:n,priceWithoutDiscount:a,promotion:o,quantity:s=1,term:l}=e;if(t===be.YEAR&&l===Q.MONTHLY){if(!o)return ze(e,Te.YEAR,xi);let{displaySummary:{outcomeType:c,duration:h,minProductQuantity:m=1}={}}=o;switch(c){case"PERCENTAGE_DISCOUNT":if(s>=m&&la(o,r)){let p=parseInt(h.replace("P","").replace("M",""));if(isNaN(p))return xi(i);let d=s*n*p,u=s*a*(12-p),f=Math.round((d+u)*100)/100;return ze({...e,price:f},Te.YEAR)}default:return ze(e,Te.YEAR,()=>xi(a??i))}}return ze(e,bi[t]?.[l])};var vi={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at",planTypeLabel:"{planType, select, ABM {Annual, paid monthly.} other {}}"},sc=an("ConsonantTemplates/price"),cc=/<\/?[^>]+(>|$)/g,D={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},xe={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},yi="TAX_EXCLUSIVE",lc=e=>tn(e)?Object.entries(e).filter(([,t])=>Fe(t)||Mt(t)||t===!0).reduce((t,[r,i])=>t+` ${r}${i===!0?"":'="'+en(i)+'"'}`,""):"",U=(e,t,r,i=!1)=>`<span class="${e}${t?"":" "+D.disabled}"${lc(r)}>${i?ha(t):t??""}</span>`;function he(e,t,r,i){let n=e[r];if(n==null)return"";try{return new ra(n.replace(cc,""),t).format(i)}catch{return sc.error("Failed to format literal:",n),""}}function hc(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:i,decimals:n,decimalsDelimiter:a,hasCurrencySpace:o,integer:s,isCurrencyFirst:l,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:m},p={}){let d=U(D.currencySymbol,i),u=U(D.currencySpace,o?"&nbsp;":""),f="";return t?f=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(f=`<sr-only class="alt-aria-label">${r}</sr-only>`),l&&(f+=d+u),f+=U(D.integer,s),f+=U(D.decimalsDelimiter,a),f+=U(D.decimals,n),l||(f+=u+d),f+=U(D.recurrence,c,null,!0),f+=U(D.unitType,h,null,!0),f+=U(D.taxInclusivity,m,!0),U(e,f,{...p})}var q=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:i=!1,instant:n=void 0}={})=>({country:a,displayFormatted:o=!0,displayRecurrence:s=!0,displayPerUnit:l=!1,displayTax:c=!1,language:h,literals:m={},quantity:p=1}={},{commitment:d,offerSelectorIds:u,formatString:f,price:b,priceWithoutDiscount:_,taxDisplay:y,taxTerm:x,term:P,usePrecision:T,promotion:N}={},H={})=>{Object.entries({country:a,formatString:f,language:h,price:b}).forEach(([Ka,Qa])=>{if(Qa==null)throw new Error(`Argument "${Ka}" is missing for osi ${u?.toString()}, country ${a}, language ${h}`)});let G={...vi,...m},O=`${h.toLowerCase()}-${a.toUpperCase()}`,F=r&&_?_:b,B=t?pa:ma;i&&(B=ua);let{accessiblePrice:me,recurrenceTerm:oe,...Ae}=B({commitment:d,formatString:f,instant:n,isIndianPrice:a==="IN",originalPrice:b,priceWithoutDiscount:_,price:t?b:F,promotion:N,quantity:p,term:P,usePrecision:T}),Jt="",er="",tr="";E(s)&&oe&&(tr=he(G,O,xe.recurrenceLabel,{recurrenceTerm:oe}));let rr="";E(l)&&(rr=he(G,O,xe.perUnitLabel,{perUnit:"LICENSE"}));let ir="";E(c)&&x&&(ir=he(G,O,y===yi?xe.taxExclusiveLabel:xe.taxInclusiveLabel,{taxTerm:x})),r&&(Jt=he(G,O,xe.strikethroughAriaLabel,{strikethroughPrice:Jt})),e&&(er=he(G,O,xe.alternativePriceAriaLabel,{alternativePrice:er}));let _e=D.container;if(t&&(_e+=" "+D.containerOptical),r&&(_e+=" "+D.containerStrikethrough),e&&(_e+=" "+D.containerAlternative),i&&(_e+=" "+D.containerAnnual),E(o))return hc(_e,{...Ae,accessibleLabel:Jt,altAccessibleLabel:er,recurrenceLabel:tr,perUnitLabel:rr,taxInclusivityLabel:ir},H);let{currencySymbol:Pi,decimals:ja,decimalsDelimiter:Ya,hasCurrencySpace:Ci,integer:qa,isCurrencyFirst:Wa}=Ae,Pe=[qa,Ya,ja];Wa?(Pe.unshift(Ci?"\xA0":""),Pe.unshift(Pi)):(Pe.push(Ci?"\xA0":""),Pe.push(Pi)),Pe.push(tr,rr,ir);let Xa=Pe.join("");return U(_e,Xa,H)},fa=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||E(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${n?q({displayStrikethrough:!0})(e,t,r)+"&nbsp;":""}${q({isAlternativePrice:n})(e,t,r)}`},ga=()=>(e,t,r)=>{let{instant:i}=e;try{i||(i=new URLSearchParams(document.location.search).get("instant")),i&&(i=new Date(i))}catch{i=void 0}let n={...e,displayTax:!1,displayPerUnit:!1},o=(e.displayOldPrice===void 0||E(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${o?q({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${q({isAlternativePrice:o})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${q({displayAnnual:!0,instant:i})(n,t,r)}${U(D.containerAnnualSuffix,")")}`},xa=()=>(e,t,r)=>{let i={...e,displayTax:!1,displayPerUnit:!1};return`${q({isAlternativePrice:e.displayOldPrice})(e,t,r)}${U(D.containerAnnualPrefix,"&nbsp;(")}${q({displayAnnual:!0})(i,t,r)}${U(D.containerAnnualSuffix,")")}`};var pt={...D,containerLegal:"price-legal",planType:"price-plan-type"},Kt={...xe,planTypeLabel:"planTypeLabel"};function dc(e,{perUnitLabel:t,taxInclusivityLabel:r,planTypeLabel:i},n={}){let a="";return a+=U(pt.unitType,t,null,!0),t&&(r||i)&&(a+=" ("),r&&i&&(r+=". "),a+=U(pt.taxInclusivity,r,!0),a+=U(pt.planType,i,null),t&&(r||i)&&(a+=")"),U(e,a,{...n})}var Ea=({country:e,displayPerUnit:t=!1,displayTax:r=!1,displayPlanType:i=!1,language:n,literals:a={}}={},{taxDisplay:o,taxTerm:s,planType:l}={},c={})=>{let h={...vi,...a},m=`${n.toLowerCase()}-${e.toUpperCase()}`,p="";E(t)&&(p=he(h,m,Kt.perUnitLabel,{perUnit:"LICENSE"}));let d="";e==="US"&&n==="en"&&(r=!1),E(r)&&s&&(d=he(h,m,o===yi?Kt.taxExclusiveLabel:Kt.taxInclusiveLabel,{taxTerm:s}));let u="";E(i)&&l&&(u=he(h,m,Kt.planTypeLabel,{planType:l}));let f=pt.container;return f+=" "+pt.containerLegal,dc(f,{perUnitLabel:p,taxInclusivityLabel:d,planTypeLabel:u},c)};var ba=q(),va=fa(),ya=q({displayOptical:!0}),wa=q({displayStrikethrough:!0}),Sa=q({displayAnnual:!0}),Ta=q({displayOptical:!0,isAlternativePrice:!0}),Aa=q({isAlternativePrice:!0}),_a=xa(),Pa=ga(),Ca=Ea;var pc=(e,t)=>{if(!(!et(e)||!et(t)))return Math.floor((t-e)/t*100)},La=()=>(e,t)=>{let{price:r,priceWithoutDiscount:i}=t,n=pc(r,i);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Ra=La();var Na="INDIVIDUAL_COM",wi="TEAM_COM",Oa="INDIVIDUAL_EDU",Si="TEAM_EDU",Ma=["GB_en","AU_en","FR_fr","AT_de","BE_en","BE_fr","BE_nl","BG_bg","CH_de","CH_fr","CH_it","CZ_cs","DE_de","DK_da","EE_et","EG_ar","EG_en","ES_es","FI_fi","GR_el","GR_en","HU_hu","IE_en","IT_it","LU_de","LU_en","LU_fr","NL_nl","NO_nb","PL_pl","PT_pt","RO_ro","SE_sv","SI_sl","SK_sk","TR_tr","UA_uk","ID_en","ID_in","IN_en","IN_hi","JP_ja","MY_en","MY_ms","NZ_en","TH_en","TH_th"],mc={[Na]:["MU_en","LT_lt","LV_lv","NG_en","SA_ar","SA_en","SG_en","KR_ko"],[wi]:["MU_en","LT_lt","LV_lv","NG_en","CO_es","KR_ko"],[Oa]:["LT_lt","LV_lv","SA_en","SG_en"],[Si]:["SG_en","KR_ko"]},uc={MU_en:[!1,!1,!1,!1],NG_en:[!1,!1,!1,!1],AU_en:[!1,!1,!1,!1],JP_ja:[!1,!1,!1,!1],NZ_en:[!1,!1,!1,!1],TH_en:[!1,!1,!1,!1],TH_th:[!1,!1,!1,!1],CO_es:[!1,!0,!1,!1],AT_de:[!1,!1,!1,!0],SG_en:[!1,!1,!1,!0]},fc=[Na,wi,Oa,Si],gc=e=>[wi,Si].includes(e),xc=(e,t,r,i)=>{let n=`${e}_${t}`,a=`${r}_${i}`,o=uc[n];if(o){let s=fc.indexOf(a);return o[s]}return gc(a)},Ec=(e,t,r,i)=>{let n=`${e}_${t}`;if(Ma.includes(e)||Ma.includes(n))return!0;let a=mc[`${r}_${i}`];return a?a.includes(e)||a.includes(n)?!0:A.displayTax:A.displayTax},bc=async(e,t,r,i)=>{let n=Ec(e,t,r,i);return{displayTax:n,forceTaxExclusive:n?xc(e,t,r,i):A.forceTaxExclusive}},mt=class mt extends HTMLSpanElement{constructor(){super();g(this,"masElement",new Ve(this));this.handleClick=this.handleClick.bind(this)}static get observedAttributes(){return["data-display-old-price","data-display-per-unit","data-display-recurrence","data-display-tax","data-display-plan-type","data-display-annual","data-perpetual","data-promotion-code","data-force-tax-exclusive","data-template","data-wcs-osi"]}static createInlinePrice(r){let i=V();if(!i)return null;let{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:m,promotionCode:p,quantity:d,alternativePrice:u,template:f,wcsOsi:b}=i.collectPriceOptions(r);return Ut(mt,{displayOldPrice:n,displayPerUnit:a,displayRecurrence:o,displayTax:s,displayPlanType:l,displayAnnual:c,forceTaxExclusive:h,perpetual:m,promotionCode:p,quantity:d,alternativePrice:u,template:f,wcsOsi:b})}get isInlinePrice(){return!0}attributeChangedCallback(r,i,n){this.masElement.attributeChangedCallback(r,i,n)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.handleClick)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.handleClick)}handleClick(r){r.target!==this&&(r.stopImmediatePropagation(),this.dispatchEvent(new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window})))}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get isFailed(){return this.masElement.state===te}requestUpdate(r=!1){return this.masElement.requestUpdate(r)}async render(r={}){if(!this.isConnected)return!1;let i=V();if(!i)return!1;let n=i.collectPriceOptions(r,this);if(!n.wcsOsi.length)return!1;if(R(Xe)==="on"&&(!this.dataset.displayTax||!this.dataset.forceTaxExclusive)){let[l]=await i.resolveOfferSelectors(n),c=it(await l,n);if(c?.length){let{country:h,language:m}=n,p=c[0],[d=""]=p.marketSegments,u=await bc(h,m,p.customerSegment,d);this.dataset.displayTax||(n.displayTax=u?.displayTax||n.displayTax),this.dataset.forceTaxExclusive||(n.forceTaxExclusive=u?.forceTaxExclusive||n.forceTaxExclusive)}}let o=this.masElement.togglePending(n);this.innerHTML="";let[s]=i.resolveOfferSelectors(n);try{let l=await s;return this.renderOffers(it(l,n),n,o)}catch(l){throw this.innerHTML="",l}}renderOffers(r,i={},n=void 0){if(!this.isConnected)return;let a=V();if(!a)return!1;let o=a.collectPriceOptions({...this.dataset,...i},this);if(n??(n=this.masElement.togglePending(o)),r.length){if(this.masElement.toggleResolved(n,r,o)){this.innerHTML=a.buildPriceHTML(r,o);let s=this.closest("p, h3, div");if(!s||!s.querySelector('span[data-template="strikethrough"]')||s.querySelector(".alt-aria-label"))return!0;let l=s?.querySelectorAll('span[is="inline-price"]');return l.length>1&&l.length===s.querySelectorAll('span[data-template="strikethrough"]').length*2&&l.forEach(c=>{c.dataset.template!=="strikethrough"&&c.options&&!c.options.alternativePrice&&!c.isFailed&&(c.options.alternativePrice=!0,c.innerHTML=a.buildPriceHTML(r,c.options))}),!0}}else{let s=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(n,s,o))return this.innerHTML="",!0}return!1}updateOptions(r){let i=V();if(!i)return!1;let{alternativePrice:n,displayOldPrice:a,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:m,quantity:p,template:d,wcsOsi:u}=i.collectPriceOptions(r);return Ft(this,{alternativePrice:n,displayOldPrice:a,displayPerUnit:o,displayRecurrence:s,displayTax:l,forceTaxExclusive:c,perpetual:h,promotionCode:m,quantity:p,template:d,wcsOsi:u}),!0}};g(mt,"is","inline-price"),g(mt,"tag","span");var de=mt;window.customElements.get(de.is)||window.customElements.define(de.is,de,{extends:de.tag});function Ia({literals:e,providers:t,settings:r}){function i(o,s=null){let l=structuredClone(r);if(s)for(let N of t.price)N(s,l);let{displayOldPrice:c,displayPerUnit:h,displayRecurrence:m,displayTax:p,displayPlanType:d,forceTaxExclusive:u,perpetual:f,displayAnnual:b,promotionCode:_,quantity:y,alternativePrice:x,wcsOsi:P,...T}=Object.assign(l,s?.dataset??{},o??{});return Object.assign(l,tt({...T,displayOldPrice:E(c),displayPerUnit:E(h),displayRecurrence:E(m),displayTax:E(p),displayPlanType:E(d),forceTaxExclusive:E(u),perpetual:E(f),displayAnnual:E(b),promotionCode:Ot(_).effectivePromoCode,quantity:Ge(y,A.quantity),alternativePrice:E(x),wcsOsi:kt(P)})),l}function n(o,s){if(!Array.isArray(o)||!o.length||!s)return"";let{template:l}=s,c;switch(l){case"discount":c=Ra;break;case"strikethrough":c=wa;break;case"annual":c=Sa;break;case"legal":c=Ca;break;default:s.template==="optical"&&s.alternativePrice?c=Ta:s.template==="optical"?c=ya:s.displayAnnual&&o[0].planType==="ABM"?c=s.promotionCode?Pa:_a:s.alternativePrice?c=Aa:c=s.promotionCode?va:ba}let h=i(s);h.literals=Object.assign({},e.price,tt(s.literals??{}));let[m]=o;return m={...m,...m.priceDetails},c(h,m)}let a=de.createInlinePrice;return{InlinePrice:de,buildPriceHTML:n,collectPriceOptions:i,createInlinePrice:a}}function vc({locale:e=void 0,country:t=void 0,language:r=void 0}={}){return r??(r=e?.split("_")?.[0]||A.language),t??(t=e?.split("_")?.[1]||A.country),e??(e=`${r}_${t}`),{locale:e,country:t,language:r}}function Ha(e={}){let t=R(Xe)==="on",{commerce:r={}}=e,i=ae.PRODUCTION,n=Tr,a=R("checkoutClientId",r)??A.checkoutClientId,o=rt(R("checkoutWorkflowStep",r),j,A.checkoutWorkflowStep),s=E(R("displayOldPrice",r),t?A.displayOldPrice:!A.displayOldPrice),l=E(R("displayPerUnit",r),t?A.displayPerUnit:!A.displayPerUnit),c=E(R("displayRecurrence",r),A.displayRecurrence),h=E(R("displayTax",r),A.displayTax),m=E(R("displayPlanType",r),A.displayPlanType),p=E(R("entitlement",r),A.entitlement),d=E(R("modal",r),A.modal),u=E(R("forceTaxExclusive",r),A.forceTaxExclusive),f=R("promotionCode",r)??A.promotionCode,b=Ge(R("quantity",r)),_=R("wcsApiKey",r)??A.wcsApiKey,y=r?.env==="stage",x=fe.PUBLISHED;["true",""].includes(r.allowOverride)&&(y=(R(wr,r,{metadata:!1})?.toLowerCase()??r?.env)==="stage",x=rt(R(Sr,r),fe,x)),y&&(i=ae.STAGE,n=Ar);let T=R(yr)??e.preview,N=typeof T<"u"&&T!=="off"&&T!=="false",H={};N&&(H={preview:N});let G=R("mas-io-url")??e.masIOUrl??`https://www${i===ae.STAGE?".stage":""}.adobe.com/mas/io`,O=R("preselect-plan")??void 0;return{...vc(e),...H,displayOldPrice:s,checkoutClientId:a,checkoutWorkflowStep:o,displayPerUnit:l,displayRecurrence:c,displayTax:h,displayPlanType:m,entitlement:p,extraOptions:A.extraOptions,modal:d,env:i,forceTaxExclusive:u,promotionCode:f,quantity:b,alternativePrice:A.alternativePrice,wcsApiKey:_,wcsURL:n,landscape:x,masIOUrl:G,...O&&{preselectPlan:O}}}async function ka(e,t={},r=2,i=100){let n;for(let a=0;a<=r;a++)try{let o=await fetch(e,t);return o.retryCount=a,o}catch(o){if(n=o,n.retryCount=a,a>r)break;await new Promise(s=>setTimeout(s,i*(a+1)))}throw n}var Ti="wcs";function Da({settings:e}){let t=ee.module(Ti),{env:r,wcsApiKey:i}=e,n=new Map,a=new Map,o,s=new Map;async function l(d,u,f=!0){let b=V(),_=xr;t.debug("Fetching:",d);let y="",x;if(d.offerSelectorIds.length>1)throw new Error("Multiple OSIs are not supported anymore");let P=new Map(u),[T]=d.offerSelectorIds,N=Date.now()+Math.random().toString(36).substring(2,7),H=`${Ti}:${T}:${N}${Pr}`,G=`${Ti}:${T}:${N}${Cr}`,O;try{if(performance.mark(H),y=new URL(e.wcsURL),y.searchParams.set("offer_selector_ids",T),y.searchParams.set("country",d.country),y.searchParams.set("locale",d.locale),y.searchParams.set("landscape",r===ae.STAGE?"ALL":e.landscape),y.searchParams.set("api_key",i),d.language&&y.searchParams.set("language",d.language),d.promotionCode&&y.searchParams.set("promotion_code",d.promotionCode),d.currency&&y.searchParams.set("currency",d.currency),x=await ka(y.toString(),{credentials:"omit"}),x.ok){let F=[];try{let B=await x.json();t.debug("Fetched:",d,B),F=B.resolvedOffers??[]}catch(B){t.error(`Error parsing JSON: ${B.message}`,{...B.context,...b?.duration})}F=F.map(It),u.forEach(({resolve:B},me)=>{let oe=F.filter(({offerSelectorIds:Ae})=>Ae.includes(me)).flat();oe.length&&(P.delete(me),u.delete(me),B(oe))})}else _=gr}catch(F){_=`Network error: ${F.message}`}finally{O=performance.measure(G,H),performance.clearMarks(H),performance.clearMeasures(G)}if(f&&u.size){t.debug("Missing:",{offerSelectorIds:[...u.keys()]});let F=hn(x);u.forEach(B=>{B.reject(new $e(_,{...d,...F,response:x,measure:St(O),...b?.duration}))})}}function c(){clearTimeout(o);let d=[...a.values()];a.clear(),d.forEach(({options:u,promises:f})=>l(u,f))}function h(d){if(!d||typeof d!="object")throw new TypeError("Cache must be a Map or similar object");let u=r===ae.STAGE?"stage":"prod",f=d[u];if(!f||typeof f!="object"){t.warn(`No cache found for environment: ${r}`);return}for(let[b,_]of Object.entries(f))n.set(b,Promise.resolve(_.map(It)));t.debug(`Prefilled WCS cache with ${f.size} entries`)}function m(){let d=n.size;s=new Map(n),n.clear(),t.debug(`Moved ${d} cache entries to stale cache`)}function p({country:d,language:u,perpetual:f=!1,promotionCode:b="",wcsOsi:_=[]}){let y=`${u}_${d}`;d!=="GB"&&!f&&(u="MULT");let x=[d,u,b].filter(P=>P).join("-").toLowerCase();return _.map(P=>{let T=`${P}-${x}`;if(n.has(T))return n.get(T);let N=new Promise((H,G)=>{let O=a.get(x);if(!O){let F={country:d,locale:y,offerSelectorIds:[]};d!=="GB"&&!f&&(F.language=u),O={options:F,promises:new Map},a.set(x,O)}b&&(O.options.promotionCode=b),O.options.offerSelectorIds.push(P),O.promises.set(P,{resolve:H,reject:G}),c()}).catch(H=>{if(s.has(T))return s.get(T);throw H});return n.set(T,N),N})}return{Commitment:be,PlanType:sn,Term:Q,applyPlanType:It,resolveOfferSelectors:p,flushWcsCacheInternal:m,prefillWcsCache:h}}var Ba="mas-commerce-service",Ua="mas-commerce-service:start",Fa="mas-commerce-service:ready",ut,Qt,Ga,Ai=class extends HTMLElement{constructor(){super(...arguments);z(this,Qt);z(this,ut);g(this,"lastLoggingTime",0)}async registerCheckoutAction(r){typeof r=="function"&&(this.buildCheckoutAction=async(i,n,a)=>{let o=await r?.(i,n,this.imsSignedInPromise,a);return o||null})}activate(){let r=C(this,Qt,Ga),i=Ha(r);Dt(r.lana);let n=ee.init(r.hostEnv).module("service");n.debug("Activating:",r);let o={price:Ln(i)},s={checkout:new Set,price:new Set},l={literals:o,providers:s,settings:i};Object.defineProperties(this,Object.getOwnPropertyDescriptors({..._n(l),...Pn(l),...Ia(l),...Da(l),...Rr,Log:ee,get defaults(){return A},get log(){return ee},get providers(){return{checkout(h){return s.checkout.add(h),()=>s.checkout.delete(h)},price(h){return s.price.add(h),()=>s.price.delete(h)},has:h=>s.price.has(h)||s.checkout.has(h)}},get settings(){return i}})),n.debug("Activated:",{literals:o,settings:i});let c=new CustomEvent(Et,{bubbles:!0,cancelable:!1,detail:this});performance.mark(Fa),K(this,ut,performance.measure(Fa,Ua)),this.dispatchEvent(c),setTimeout(()=>{this.logFailedRequests()},1e4)}connectedCallback(){performance.mark(Ua),this.activate()}flushWcsCache(){this.flushWcsCacheInternal(),this.log.debug("Flushed WCS cache")}refreshOffers(){this.flushWcsCacheInternal(),document.querySelectorAll(ar).forEach(r=>r.requestUpdate(!0)),this.log.debug("Refreshed WCS offers"),this.logFailedRequests()}refreshFragments(){this.flushWcsCacheInternal(),document.querySelectorAll("aem-fragment").forEach(r=>r.refresh()),this.log.debug("Refreshed AEM fragments"),this.logFailedRequests()}get duration(){return{"mas-commerce-service:measure":St(C(this,ut))}}logFailedRequests(){let r=[...performance.getEntriesByType("resource")].filter(({startTime:n})=>n>this.lastLoggingTime).filter(({transferSize:n,duration:a,responseStatus:o})=>n===0&&a===0&&o<200||o>=400),i=Array.from(new Map(r.map(n=>[n.name,n])).values());if(i.some(({name:n})=>/(\/fragments\/|web_commerce_artifact)/.test(n))){let n=i.map(({name:a})=>a);this.log.error("Failed requests:",{failedUrls:n,...this.duration})}this.lastLoggingTime=performance.now().toFixed(3)}};ut=new WeakMap,Qt=new WeakSet,Ga=function(){let r=this.getAttribute("env")??"prod",i={commerce:{env:r},hostEnv:{name:r},lana:{tags:this.getAttribute("lana-tags"),sampleRate:parseInt(this.getAttribute("lana-sample-rate")??1,10),isProdDomain:r==="prod"},masIOUrl:this.getAttribute("mas-io-url")};return["locale","country","language","preview"].forEach(n=>{let a=this.getAttribute(n);a&&(i[n]=a)}),["checkout-workflow-step","force-tax-exclusive","checkout-client-id","allow-override","wcs-api-key"].forEach(n=>{let a=this.getAttribute(n);if(a!=null){let o=n.replace(/-([a-z])/g,s=>s[1].toUpperCase());i.commerce[o]=a}}),i};window.customElements.get(Ba)||window.customElements.define(Ba,Ai);import{html as je,css as yc,unsafeCSS as $a,LitElement as wc,nothing as ne}from"../lit-all.min.js";var ft=class{constructor(t,r){this.key=Symbol("match-media-key"),this.matches=!1,this.host=t,this.host.addController(this),this.media=window.matchMedia(r),this.matches=this.media.matches,this.onChange=this.onChange.bind(this),t.addController(this)}hostConnected(){var t;(t=this.media)==null||t.addEventListener("change",this.onChange)}hostDisconnected(){var t;(t=this.media)==null||t.removeEventListener("change",this.onChange)}onChange(t){this.matches!==t.matches&&(this.matches=t.matches,this.host.requestUpdate(this.key,!this.matches))}};var Sc={filters:["noResultText","resultText","resultsText"],filtersMobile:["noResultText","resultMobileText","resultsMobileText"],search:["noSearchResultsText","searchResultText","searchResultsText"],searchMobile:["noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]},Tc=(e,t,r)=>{e.querySelectorAll(`[data-placeholder="${t}"]`).forEach(n=>{n.innerText=r||""})},Ac={search:["mobile","tablet"],filter:["mobile","tablet"],sort:!0,result:!0,custom:!1},W,pe=class extends wc{constructor(){super();z(this,W);g(this,"tablet",new ft(this,I));g(this,"desktop",new ft(this,L));this.collection=null,K(this,W,{search:!1,filter:!1,sort:!1,result:!1,custom:!1}),this.updateLiterals=this.updateLiterals.bind(this),this.handleSidenavAttached=this.handleSidenavAttached.bind(this)}connectedCallback(){super.connectedCallback(),this.collection?.addEventListener(Ce,this.updateLiterals),this.collection?.addEventListener(Le,this.handleSidenavAttached)}disconnectedCallback(){super.disconnectedCallback(),this.collection?.removeEventListener(Ce,this.updateLiterals),this.collection?.removeEventListener(Le,this.handleSidenavAttached)}willUpdate(){C(this,W).search=this.getVisibility("search"),C(this,W).filter=this.getVisibility("filter"),C(this,W).sort=this.getVisibility("sort"),C(this,W).result=this.getVisibility("result"),C(this,W).custom=this.getVisibility("custom")}parseVisibilityOptions(r,i){if(!r||!Object.hasOwn(r,i))return null;let n=r[i];return n===!1?!1:n===!0?!0:n.includes(this.currentMedia)}getVisibility(r){let i=Br(this.collection?.variant)?.headerVisibility,n=this.parseVisibilityOptions(i,r);return n!==null?n:this.parseVisibilityOptions(Ac,r)}get sidenav(){return this.collection?.sidenav}get search(){return this.collection?.search}get resultCount(){return this.collection?.resultCount}get isMobile(){return!this.isTablet&&!this.isDesktop}get isTablet(){return this.tablet.matches&&!this.desktop.matches}get isDesktop(){return this.desktop.matches}get currentMedia(){return this.isDesktop?"desktop":this.isTablet?"tablet":"mobile"}get searchAction(){if(!C(this,W).search)return ne;let r=Ke(this,"searchText");return r?je`
            <merch-search deeplink="search" id="search">
                <sp-search
                    id="search-bar"
                    placeholder="${r}"
                ></sp-search>
            </merch-search>
        `:ne}get filterAction(){return C(this,W).filter?this.sidenav?je`
            <sp-action-button
              id="filter"
              variant="secondary"
              treatment="outline"
              @click="${this.openFilters}"
              ><slot name="filtersText"></slot
            ></sp-action-button>
        `:ne:ne}get sortAction(){if(!C(this,W).sort)return ne;let r=Ke(this,"sortText");if(!r)return;let i=Ke(this,"popularityText"),n=Ke(this,"alphabeticallyText");if(!(i&&n))return;let a=this.collection?.sort===Z.alphabetical;return je`
            <sp-action-menu
                id="sort"
                size="m"
                @change="${this.collection?.sortChanged}"
                selects="single"
                value="${a?Z.alphabetical:Z.authored}"
            >
                <span slot="label-only"
                    >${r}:
                    ${a?n:i}</span
                >
                <sp-menu-item value="${Z.authored}"
                    >${i}</sp-menu-item
                >
                <sp-menu-item value="${Z.alphabetical}"
                    >${n}</sp-menu-item
                >
            </sp-action-menu>
        `}get resultSlotName(){let r=`${this.search?"search":"filters"}${this.isMobile||this.isTablet?"Mobile":""}`;return Sc[r][Math.min(this.resultCount,2)]}get resultLabel(){if(!C(this,W).result)return ne;if(!this.sidenav)return ne;let r=this.search?"search":"filter",i=this.resultCount?this.resultCount===1?"single":"multiple":"none";return je`
          <div id="result" aria-live="polite" type=${r} quantity=${i}>
              <slot name="${this.resultSlotName}"></slot>
          </div>`}get customArea(){if(!C(this,W).custom)return ne;let r=Br(this.collection?.variant)?.customHeaderArea;if(!r)return ne;let i=r(this.collection);return!i||i===ne?ne:je`<div id="custom">${i}</div>`}openFilters(r){this.sidenav.showModal(r)}updateLiterals(r){Object.keys(r.detail).forEach(i=>{Tc(this,i,r.detail[i])}),this.requestUpdate()}handleSidenavAttached(){this.requestUpdate()}render(){return je`
          <sp-theme color="light" scale="medium">
            <div id="header">${this.searchAction}${this.filterAction}${this.sortAction}${this.resultLabel}${this.customArea}</div>
          </sp-theme>
        `}};W=new WeakMap,g(pe,"styles",yc`
        :host {
            --merch-card-collection-header-max-width: var(--merch-card-collection-card-width);
            --merch-card-collection-header-margin-bottom: 32px;
            --merch-card-collection-header-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-row-gap: var(--consonant-merch-spacing-xxs);
            --merch-card-collection-header-columns: auto auto;
            --merch-card-collection-header-areas: "search search" 
                                                  "filter sort"
                                                  "result result";
            --merch-card-collection-header-result-font-size: 14px;
        }

        sp-theme {
            font-size: inherit;
        }

        #header {
            display: grid;
            gap: var(--merch-card-collection-header-gap);
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
            max-width: 302px;
            width: 100%;
        }

        #filter {
            grid-area: filter;
            width: 92px;
        }

        #sort {
            grid-area: sort;
            justify-self: end;
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
        @media screen and ${$a(I)} {
            :host {
                --merch-card-collection-header-max-width: auto;
                --merch-card-collection-header-columns: 1fr fit-content(100%) fit-content(100%);
                --merch-card-collection-header-areas: "search filter sort" 
                                                      "result result result";
            }
        }

        /* Laptop */
        @media screen and ${$a(L)} {
            :host {
                --merch-card-collection-header-columns: 1fr fit-content(100%);
                --merch-card-collection-header-areas: "result sort";
                --merch-card-collection-header-result-font-size: inherit;
            }
        }
    `),g(pe,"placeholderKeys",["searchText","filtersText","sortText","popularityText","alphabeticallyText","noResultText","resultText","resultsText","resultMobileText","resultsMobileText","noSearchResultsText","searchResultText","searchResultsText","noSearchResultsMobileText","searchResultMobileText","searchResultsMobileText"]);customElements.define("merch-card-collection-header",pe);var Va="merch-card-collection",Pc=2e4,Cc={catalog:["four-merch-cards"],plans:["four-merch-cards"],plansThreeColumns:["three-merch-cards"]},Lc={plans:!0},Rc=(e,{filter:t})=>e.filter(r=>r.filters.hasOwnProperty(t)),Mc=(e,{types:t})=>t?(t=t.split(","),e.filter(r=>t.some(i=>r.types.includes(i)))):e,Nc=e=>e.sort((t,r)=>(t.title??"").localeCompare(r.title??"","en",{sensitivity:"base"})),Oc=(e,{filter:t})=>e.sort((r,i)=>i.filters[t]?.order==null||isNaN(i.filters[t]?.order)?-1:r.filters[t]?.order==null||isNaN(r.filters[t]?.order)?1:r.filters[t].order-i.filters[t].order),Ic=(e,{search:t})=>t?.length?(t=t.toLowerCase(),e.filter(r=>(r.title??"").toLowerCase().includes(t))):e,Ee,gt,xt,Zt,za,Ye=class extends _c{constructor(){super();z(this,Zt);z(this,Ee,{});z(this,gt);z(this,xt);this.filter="all",this.hasMore=!1,this.resultCount=void 0,this.displayResult=!1,this.data=null,this.variant=null,this.hydrating=!1,this.hydrationReady=null,this.literalsHandlerAttached=!1}render(){return _i`
            <slot></slot>
            ${this.footer}`}checkReady(){if(!this.querySelector("aem-fragment"))return Promise.resolve(!0);let i=new Promise(n=>setTimeout(()=>n(!1),Pc));return Promise.race([this.hydrationReady,i])}updated(r){if(!this.querySelector("merch-card"))return;let i=window.scrollY||document.documentElement.scrollTop,n=[...this.children].filter(c=>c.tagName==="MERCH-CARD");if(n.length===0)return;r.has("singleApp")&&this.singleApp&&n.forEach(c=>{c.updateFilters(c.name===this.singleApp)});let a=this.sort===Z.alphabetical?Nc:Oc,s=[Rc,Mc,Ic,a].reduce((c,h)=>h(c,this),n).map((c,h)=>[c,h]);if(this.resultCount=s.length,this.page&&this.limit){let c=this.page*this.limit;this.hasMore=s.length>c,s=s.filter(([,h])=>h<c)}let l=new Map(s.reverse());for(let c of l.keys())this.prepend(c);n.forEach(c=>{l.has(c)?(c.size=c.filters[this.filter]?.size,c.style.removeProperty("display"),c.requestUpdate()):(c.style.display="none",c.size=void 0)}),window.scrollTo(0,i),this.updateComplete.then(()=>{this.dispatchLiteralsChanged(),this.sidenav&&!this.literalsHandlerAttached&&(this.sidenav.addEventListener(lr,()=>{this.dispatchLiteralsChanged()}),this.literalsHandlerAttached=!0)})}dispatchLiteralsChanged(){this.dispatchEvent(new CustomEvent(Ce,{detail:{resultCount:this.resultCount,searchTerm:this.search,filter:this.sidenav?.filters?.selectedText}}))}buildOverrideMap(){K(this,Ee,{}),this.overrides?.split(",").forEach(r=>{let[i,n]=r?.split(":");i&&n&&(C(this,Ee)[i]=n)})}connectedCallback(){super.connectedCallback(),K(this,gt,Bi()),K(this,xt,C(this,gt).Log.module(Va)),this.buildOverrideMap(),this.init()}async init(){await this.hydrate(),this.sidenav=this.parentElement.querySelector("merch-sidenav"),this.filtered?(this.filter=this.filtered,this.page=1):this.startDeeplink(),this.initializeHeader(),this.initializePlaceholders()}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink?.()}initializeHeader(){let r=document.createElement("merch-card-collection-header");r.collection=this,r.classList.add(this.variant),this.parentElement.insertBefore(r,this),this.header=r}initializePlaceholders(){let r=this.querySelectorAll("[placeholder]");if(r.length>0)r.forEach(i=>{let n=i.getAttribute("slot");pe.placeholderKeys.includes(n)&&this.header?.append(i)});else{let i=this.data?.placeholders||{};for(let n of Object.keys(i)){let a=i[n],o=a.includes("<p>")?"div":"p",s=document.createElement(o);s.setAttribute("slot",n),s.setAttribute("placeholder",""),s.innerHTML=a,pe.placeholderKeys.includes(n)?this.header?.append(s):this.append(s)}}}attachSidenav(r,i=!0){r&&(i&&this.parentElement.prepend(r),this.sidenav=r,Lc[this.variant]&&this.sidenav.setAttribute("autoclose",""),this.dispatchEvent(new CustomEvent(Le)))}async hydrate(){if(this.hydrating)return!1;let r=this.querySelector("aem-fragment");if(!r)return;this.hydrating=!0;let i;this.hydrationReady=new Promise(o=>{i=o});let n=this;function a(o,s){let l={cards:[],hierarchy:[],placeholders:o.placeholders};function c(h,m){for(let p of m){if(p.fieldName==="cards"){if(l.cards.findIndex(f=>f.id===p.identifier)!==-1)continue;l.cards.push(o.references[p.identifier].value);continue}let{fields:d}=o.references[p.identifier].value,u={label:d.label,icon:d.icon,iconLight:d.iconLight,navigationLabel:d.navigationLabel,cards:d.cards.map(f=>s[f]||f),collections:[]};d.defaultchild&&(u.defaultchild=s[d.defaultchild]||d.defaultchild),h.push(u),c(u.collections,p.referencesTree)}}return c(l.hierarchy,o.referencesTree),l.hierarchy.length===0&&(n.filtered="all"),l}r.addEventListener(dr,o=>{Mi(this,Zt,za).call(this,"Error loading AEM fragment",o.detail),this.hydrating=!1,r.remove()}),r.addEventListener(hr,async o=>{this.data=a(o.detail,C(this,Ee));let{cards:s,hierarchy:l}=this.data,c=l.length===0&&o.detail.fields?.defaultchild?C(this,Ee)[o.detail.fields.defaultchild]||o.detail.fields.defaultchild:null;r.cache.add(...s);let h=(d,u)=>{for(let f of d)if(f.defaultchild===u||f.collections&&h(f.collections,u))return!0;return!1};for(let d of s){let _=function(x){for(let P of x){let T=P.cards.indexOf(f);if(T===-1)continue;let N=P.label.toLowerCase();u.filters[N]={order:T+1,size:d.fields.size},_(P.collections)}},u=document.createElement("merch-card"),f=C(this,Ee)[d.id]||d.id;u.setAttribute("consonant",""),u.setAttribute("style",""),At(d.fields.variant)?.supportsDefaultChild&&(c?f===c:h(l,f))&&u.setAttribute("data-default-card","true"),_(l);let y=document.createElement("aem-fragment");y.setAttribute("fragment",f),u.append(y),Object.keys(u.filters).length===0&&(u.filters={all:{order:s.indexOf(d)+1,size:d.fields.size}}),this.append(u)}let m="",p=s[0]?.fields?.variant;p?.startsWith("plans")&&(p="plans"),this.variant=p,p==="plans"&&s.length===3&&!s.some(d=>d.fields?.size?.includes("wide"))&&(m="ThreeColumns"),p&&this.classList.add("merch-card-collection",p,...Cc[`${p}${m}`]||[]),this.displayResult=!0,this.hydrating=!1,r.remove(),i()}),await this.hydrationReady}get footer(){if(!this.filtered)return _i`<div id="footer">
            <sp-theme  color="light" scale="medium">
                ${this.showMoreButton}
            </sp-theme>
        </div>`}get showMoreButton(){if(this.hasMore)return _i`<sp-button
            variant="secondary"
            treatment="outline"
            style="order: 1000;"
            @click="${this.showMore}"
        >
            <slot name="showMoreText"></slot>
        </sp-button>`}sortChanged(r){r.target.value===Z.authored?qe({sort:void 0}):qe({sort:r.target.value}),this.dispatchEvent(new CustomEvent(sr,{bubbles:!0,composed:!0,detail:{value:r.target.value}}))}async showMore(){this.dispatchEvent(new CustomEvent(cr,{bubbles:!0,composed:!0}));let r=this.page+1;qe({page:r}),this.page=r,await this.updateComplete}startDeeplink(){this.stopDeeplink=Oi(({category:r,filter:i,types:n,sort:a,search:o,single_app:s,page:l})=>{i=i||r,!this.filtered&&i&&i!==this.filter&&setTimeout(()=>{qe({page:void 0}),this.page=1},1),this.filtered||(this.filter=i??this.filter),this.types=n??"",this.search=o??"",this.singleApp=s,this.sort=a,this.page=Number(l)||1})}openFilters(r){this.sidenav?.showModal(r)}};Ee=new WeakMap,gt=new WeakMap,xt=new WeakMap,Zt=new WeakSet,za=function(r,i={},n=!0){C(this,xt).error(`merch-card-collection: ${r}`,i),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(pr,{detail:{...i,message:r},bubbles:!0,composed:!0}))},g(Ye,"properties",{displayResult:{type:Boolean,attribute:"display-result"},filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered",reflect:!0},hasMore:{type:Boolean},limit:{type:Number,attribute:"limit"},overrides:{type:String},page:{type:Number,attribute:"page",reflect:!0},resultCount:{type:Number},search:{type:String,attribute:"search",reflect:!0},sidenav:{type:Object},singleApp:{type:String,attribute:"single-app",reflect:!0},sort:{type:String,attribute:"sort",default:Z.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0}}),g(Ye,"styles",[ki]);Ye.SortOrder=Z;customElements.define(Va,Ye);export{Ye as MerchCardCollection};

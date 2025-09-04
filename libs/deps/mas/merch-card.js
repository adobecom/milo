var Kr=Object.defineProperty;var ze=o=>{throw TypeError(o)};var Wr=(o,e,t)=>e in o?Kr(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var l=(o,e,t)=>Wr(o,typeof e!="symbol"?e+"":e,t),de=(o,e,t)=>e.has(o)||ze("Cannot "+t);var s=(o,e,t)=>(de(o,e,"read from private field"),t?t.call(o):e.get(o)),m=(o,e,t)=>e.has(o)?ze("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),h=(o,e,t,r)=>(de(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),w=(o,e,t)=>(de(o,e,"access private method"),t);var Ie=(o,e,t,r)=>({set _(n){h(o,e,n,t)},get _(){return s(o,e,r)}});import{LitElement as xn}from"../lit-all.min.js";import{css as Fe,unsafeCSS as De}from"../lit-all.min.js";var T="(max-width: 767px)",at="(max-width: 1199px)",b="(min-width: 768px)",g="(min-width: 1200px)",z="(min-width: 1600px)";function Ft(){return window.matchMedia(T)}function Ut(){return window.matchMedia(g)}function Bt(){return Ft().matches}function Ht(){return Ut().matches}var Ue=Fe`
    :host {
        --consonant-merch-card-background-color: #fff;
        --consonant-merch-card-border: 1px solid var(--consonant-merch-card-border-color);
        -webkit-font-smoothing: antialiased;
        background-color: var(--consonant-merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--consonant-merch-card-border);
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        position: relative;
        text-align: start;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible,
    :host(:active) .invisible,
    :host(:focus) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 16px;
    }

    .top-section.badge {
        min-height: 32px;
    }

    .body {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs);
    }

    footer {
        display: flex;
        justify-content: flex-end;
        box-sizing: border-box;
        align-items: flex-end;
        width: 100%;
        flex-flow: wrap;
        gap: var(--consonant-merch-spacing-xs);

        padding: var(--consonant-merch-spacing-xs);
    }
    
    footer.wide-footer {
        align-items: center;
    }
    
    footer.wide-footer .secure-transaction-label {
        flex: 0 1 auto;
    }
    
    footer.footer-column {
        flex-direction: column;
    }
    
    footer.footer-column .secure-transaction-label {
        align-self: flex-start;
    }

    hr {
        background-color: var(--merch-color-grey-200);
        border: none;
        height: 1px;
        width: auto;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: var(--consonant-merch-spacing-xs);
        margin-right: var(--consonant-merch-spacing-xs);
    }

    div[class$='-badge'] {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: var(--type-heading-xxs-size);
        font-weight: 500;
        max-width: 180px;
        line-height: 16px;
        text-align: center;
        padding: 8px 11px;
        border-radius: 5px 0 0 5px;
    }

    div[class$='-badge']:dir(rtl) {
        left: 0;
        right: initial;
        padding: 8px 11px;
        border-radius: 0 5px 5px 0;
    }

    .detail-bg-container {
        right: 0;
        padding: var(--consonant-merch-spacing-xs);
        border-radius: 5px;
        font-size: var(--consonant-merch-card-body-font-size);
        margin: var(--consonant-merch-spacing-xs);
    }

    .action-menu {
        display: flex;
        width: 32px;
        height: 32px;
        position: absolute;
        top: 16px;
        right: 16px;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
        background-position: center;
        background-size: 16px 16px;
        font-size: 0;
    }
    .hidden {
        visibility: hidden;
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-grey-600);
    }

    #stock-checkbox {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        gap: 10px; /*same as spectrum */
    }

    #stock-checkbox > input {
        display: none;
    }

    #stock-checkbox > span {
        display: inline-block;
        box-sizing: border-box;
        border: 2px solid rgb(117, 117, 117);
        border-radius: 2px;
        width: 14px;
        height: 14px;
    }

    #stock-checkbox > input:checked + span {
        background: var(--checkmark-icon) no-repeat var(--color-accent);
        border-color: var(--color-accent);
    }

    .secure-transaction-label {
        white-space: nowrap;
        display: inline-flex;
        gap: var(--consonant-merch-spacing-xxs);
        align-items: center;
        flex: 1;
        line-height: normal;
        align-self: center;
    }

    .secure-transaction-label::before {
        display: inline-block;
        content: '';
        width: 12px;
        height: 15px;
        background: var(--secure-icon) no-repeat;
        background-position: center;
        background-size: contain;
    }

    .checkbox-container {
        display: flex;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
    }

    .checkbox-container input[type='checkbox']:checked + .checkmark {
        background-color: var(--color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--color-accent);
    }

    .checkbox-container input[type='checkbox'] {
        display: none;
    }

    .checkbox-container .checkmark {
        position: relative;
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #757575;
        background: #fff;
        border-radius: 2px;
        cursor: pointer;
        margin-top: 2px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
    }

    ::slotted([slot='price']) {
      color: var(--consonant-merch-card-price-color);
    }
`,Be=()=>[Fe`
      /* Tablet */
      @media screen and ${De(b)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${De(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as Qr,html as He,css as Xr}from"../lit-all.min.js";var it=class extends Qr{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:e}=this;return e?He`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:He` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};l(it,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),l(it,"styles",Xr`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }

        :host([size='xs']) {
            --img-width: 20px;
            --img-height: 20px;
        }

        :host([size='s']) {
            --img-width: 24px;
            --img-height: 24px;
        }

        :host([size='m']) {
            --img-width: 30px;
            --img-height: 30px;
        }

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }
    `);customElements.define("merch-icon",it);var Ln=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),_n=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var f='span[is="inline-price"][data-wcs-osi]',q='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var Zr='a[is="upt-link"]',qe=`${f},${q},${Zr}`;var je="merch-offer-select:ready",Ge="merch-card:action-menu-toggle";var he="merch-quantity-selector:change",Ve="merch-card-quantity:change",me="merch-modal:addon-and-quantity-update";var ct="aem:load",st="aem:error",Ye="mas:ready",Ke="mas:error",We="placeholder-failed",Qe="placeholder-pending",Xe="placeholder-resolved";var Ze="mas:failed",Tt="mas:resolved",Je="mas/commerce";var j="failed",K="pending",G="resolved";var qt="X-Request-Id",Rn=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var Pn=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var jt=":start",Gt=":duration";var tr="legal";var Jr="mas-commerce-service";function er(o,e){let t;return function(){let r=this,n=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(r,n),e)}}function S(o,e={},t=null,r=null){let n=r?document.createElement(o,{is:r}):document.createElement(o);t instanceof HTMLElement?n.appendChild(t):n.innerHTML=t;for(let[a,i]of Object.entries(e))n.setAttribute(a,i);return n}function lt(o){return`startTime:${o.startTime.toFixed(2)}|duration:${o.duration.toFixed(2)}`}function rr(){return window.matchMedia("(max-width: 1024px)").matches}function W(){return document.getElementsByTagName(Jr)?.[0]}var Ct,Q,Lt,_t,dt,Vt=class extends HTMLElement{constructor(){super();m(this,Ct,"");m(this,Q);m(this,Lt,[]);m(this,_t,[]);m(this,dt);h(this,dt,er(()=>{this.isConnected&&(this.parentElement.style.background=this.value,s(this,Q)?this.parentElement.style.borderRadius=s(this,Q):s(this,Q)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let t=s(this,Lt).map((r,n)=>{let a=s(this,_t)[n]||"";return`${r} ${a}`}).join(", ");return`linear-gradient(${s(this,Ct)}, ${t})`}connectedCallback(){s(this,dt).call(this)}attributeChangedCallback(t,r,n){t==="border-radius"&&h(this,Q,n?.trim()),t==="colors"&&n?h(this,Lt,n?.split(",").map(a=>a.trim())??[]):t==="positions"&&n?h(this,_t,n?.split(",").map(a=>a.trim())??[]):t==="angle"&&h(this,Ct,n?.trim()??""),s(this,dt).call(this)}};Ct=new WeakMap,Q=new WeakMap,Lt=new WeakMap,_t=new WeakMap,dt=new WeakMap;customElements.define("merch-gradient",Vt);import{LitElement as to,html as eo,css as ro}from"../lit-all.min.js";var ht=class extends to{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this),this.handleCustomClick=this.handleCustomClick.bind(this)}getOsi(e,t){let a=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION","TRIAL"],PROMOTION:["PROMOTION","BASE","TRIAL"]}[t]||[t]).map(c=>`p[data-plan-type="${e}"] ${f}[data-offer-type="${c}"]`).join(", ");return this.querySelector(a)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(Tt,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(Tt,this.updatePlanType)}updatePlanType(e){if(e.target.tagName!=="SPAN")return;let t=e.target,r=t?.value?.[0];r&&(t.setAttribute("data-offer-type",r.offerType),t.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}handleCustomClick(){this.shadowRoot.querySelector("input").click()}handleKeyDown(e){e.key===" "&&(e.preventDefault(),this.handleCustomClick())}render(){return eo`
            <input
                type="checkbox"
                id="addon-checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <span 
                role="checkbox" 
                aria-checked=${this.checked} 
                tabindex="0" 
                aria-labelledby="custom-checkbox-label" 
                id="custom-checkbox" 
                @click=${this.handleCustomClick}
                @keydown=${this.handleKeyDown}>
            </span>
            <label id="custom-checkbox-label" for="addon-checkbox">
                <slot></slot>
            </label>`}};l(ht,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0},customCheckbox:{type:Boolean,attribute:"custom-checkbox",reflect:!0}}),l(ht,"styles",ro`
        :host {
            --merch-addon-gap: 9px;
            --merch-addon-align: start;
            --merch-addon-checkbox-size: unset;
            --merch-addon-checkbox-border: unset;
            --merch-addon-checkbox-radius: unset;
            --merch-addon-checkbox-checked-bg: unset;
            --merch-addon-checkbox-checked-color: unset;
            --merch-addon-label-size: unset;
            --merch-addon-label-color: unset;
            --merch-addon-label-line-height: unset;
            display: flex;
            gap: var(--merch-addon-gap);
            align-items: var(--merch-addon-align);
            cursor: pointer;
        }

        :host([custom-checkbox]) #addon-checkbox {
            display: none;
        }

        :host([custom-checkbox]) #custom-checkbox {
            display: block;
        }

        :host #custom-checkbox {
            display: none;
            width: var(--merch-addon-checkbox-size);
            height: var(--merch-addon-checkbox-size);
            border: var(--merch-addon-checkbox-border);
            border-radius: var(--merch-addon-checkbox-radius);
            box-sizing: border-box;
        }

        :host #addon-checkbox:checked + #custom-checkbox {
            background: var(--merch-addon-checkbox-checked-bg) no-repeat var(--merch-addon-checkbox-checked-color);
            border-color: var(--merch-addon-checkbox-checked-color);
        }

        ::slotted(p:not([data-plan-type])) {
            color: var(--merch-addon-label-color);
            font-size: var(--merch-addon-label-size);
            line-height: var(--merch-addon-label-line-height);
            font-style: normal;
            font-weight: 400;
            cursor: pointer;
        }

        ::slotted(p[data-plan-type]) {
            display: none;
        }

        :host([plan-type='PUF']) ::slotted(p[data-plan-type='PUF']) {
            display: block;
        }

        :host([plan-type='ABM']) ::slotted(p[data-plan-type='ABM']) {
            display: block;
        }

        :host([plan-type='M2M']) ::slotted(p[data-plan-type='M2M']) {
            display: block;
        }
    `);customElements.define("merch-addon",ht);import{html as Yt,nothing as oo}from"../lit-all.min.js";var mt,P=class P{constructor(e){l(this,"card");m(this,mt);this.card=e}getContainer(){return h(this,mt,s(this,mt)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),s(this,mt)}static async ensureVariantStyle(e,t){if(P.variantStyleSheets.has(e))return Promise.resolve(P.variantStyleSheets.get(e));if(P.initializationPromises.has(e))return P.initializationPromises.get(e);let r=new Promise(n=>{try{let a=new CSSStyleSheet;a.replaceSync(t),P.variantStyleSheets.set(e,a),document.adoptedStyleSheets.includes(a)||(document.adoptedStyleSheets=[...document.adoptedStyleSheets,a]),n(a)}catch(a){console.error(`Failed to create stylesheet for variant ${e}:`,a),n(null)}});return P.initializationPromises.set(e,r),r}async insertVariantStyle(){let{variant:e}=this.card,t=this.getGlobalCSS();if(!t)return;let r=await P.ensureVariantStyle(e,t);r&&this.card.shadowRoot&&!this.card.shadowRoot.adoptedStyleSheets.includes(r)&&(this.card.shadowRoot.adoptedStyleSheets=[...this.card.shadowRoot.adoptedStyleSheets,r])}updateCardElementMinHeight(e,t){if(!e)return;let r=`--consonant-merch-card-${this.card.variant}-${t}-height`,n=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(r))||0;n>a&&this.getContainer().style.setProperty(r,`${n}px`)}get badge(){let e;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Yt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${e}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Yt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Yt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:oo}get secureLabelFooter(){return Yt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let e=this.card.getBoundingClientRect().width,t=this.card.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Kt(this.card.variant)}};mt=new WeakMap,l(P,"variantStyleSheets",new Map),l(P,"initializationPromises",new Map);var v=P;import{html as pe,css as no}from"../lit-all.min.js";var or=`
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

@media screen and ${T} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-columns: min-content auto;
    }
}

@media screen and ${b} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-column-gap: 16px;
    }
}

@media screen and ${g} {
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
}`;var nr={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},pt=class extends v{constructor(t){super(t);l(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Ge,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});l(this,"toggleActionMenu",t=>{if(!this.actionMenuContentSlot||!t||t.type!=="click"&&t.code!=="Space"&&t.code!=="Enter")return;t.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});l(this,"toggleActionMenuFromCard",t=>{let r=t?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});l(this,"hideActionMenu",t=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return pe` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${rr()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":pe`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?pe`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return or}setAriaExpanded(t,r){t.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};l(pt,"variantStyle",no`
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
    `);import{html as Rt}from"../lit-all.min.js";var ar=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${b} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${g} {
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
`;var Wt=class extends v{constructor(e){super(e)}getGlobalCSS(){return ar}renderLayout(){return Rt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?Rt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:Rt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?Rt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:Rt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as cr}from"../lit-all.min.js";var ir=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${b} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${g} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${z} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Qt=class extends v{constructor(e){super(e)}getGlobalCSS(){return ir}renderLayout(){return cr` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":cr`<hr />`} ${this.secureLabelFooter}`}};import{html as ut,css as ao,unsafeCSS as ue}from"../lit-all.min.js";var sr=`
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
@media screen and ${T} {
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

@media screen and ${at} {
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
@media screen and ${b} {
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
@media screen and ${g} {
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

@media screen and ${z} {
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
`;var io=32,gt=class extends v{constructor(t){super(t);l(this,"getRowMinHeightPropertyName",t=>`--consonant-merch-card-footer-row-${t}-min-height`);l(this,"getMiniCompareFooter",()=>{let t=this.card.secureLabel?ut`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:ut`<slot name="secure-transaction-label"></slot>`;return ut`<footer>${t}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return sr}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let t=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&t.push("footer-rows"),t.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="footer-rows"] ul');!t||!t.children||[...t.children].forEach((r,n)=>{let a=Math.max(io,parseFloat(window.getComputedStyle(r).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let n=r.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${f}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(t){let r=this.mainPrice,n=this.headingMPriceSlot;if(!r&&n){let a=t?.getAttribute("plan-type"),i=null;if(t&&a&&(i=t.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(c=>c.remove()),t.checked){if(i){let c=S("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},i.innerHTML);this.card.appendChild(c)}}else{let c=S("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(c)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(t.planType=n)}renderLayout(){return ut` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?ut`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:ut`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(t=>t.onceSettled())),await this.adjustAddon(),Bt()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};l(gt,"variantStyle",ao`
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

    @media screen and ${ue(T)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${ue(at)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ue(g)} {
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
  `);import{html as Pt,css as co,nothing as Xt}from"../lit-all.min.js";var lr=`
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

.plans-edu #whats-included {
    margin: 0 0 16px;
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

.plans-team {
    display: grid;
    grid-template-columns: min-content;
    justify-content: center;
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

.plans-individual .content,
.plans-team .content,
.plans-edu-inst .content {
    padding-bottom: 48px;
}

/* Mobile */
@media screen and ${T} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

/* Tablet */
@media screen and ${b} {
    :root {
        --consonant-merch-card-plans-students-width: 486px;
    }

    .four-merch-cards.plans .foreground {
        max-width: unset;
    }
}

@media screen and ${at} {
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
@media screen and ${g} {
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
@media screen and ${z} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }

    merch-sidenav.plans {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var Zt={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},dr={...function(){let{whatsIncluded:o,size:e,...t}=Zt;return t}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},hr={...function(){let{subtitle:o,whatsIncluded:e,size:t,quantitySelect:r,...n}=Zt;return n}()},A=class extends v{constructor(e){super(e),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(e,t){e.dataset.template===tr&&(t.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return lr}adjustSlotPlacement(e,t,r){let n=this.card.shadowRoot,a=n.querySelector("footer"),i=this.card.getAttribute("size");if(!i)return;let c=n.querySelector(`footer slot[name="${e}"]`),d=n.querySelector(`.body slot[name="${e}"]`),p=n.querySelector(".body");if(i.includes("wide")||(a?.classList.remove("wide-footer"),c&&c.remove()),!!t.includes(i)){if(a?.classList.toggle("wide-footer",Ht()),!r&&c){if(d)c.remove();else{let u=p.querySelector(`[data-placeholder-for="${e}"]`);u?u.replaceWith(c):p.appendChild(c)}return}if(r&&d){let u=document.createElement("div");if(u.setAttribute("data-placeholder-for",e),u.classList.add("slot-placeholder"),!c){let x=d.cloneNode(!0);a.prepend(x)}d.replaceWith(u)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],Ht()),this.adjustSlotPlacement("callout-content",["super-wide"],Ht())}adjustCallout(){let e=this.card.querySelector('[slot="callout-content"] .icon-button');e&&e.title&&(e.dataset.tooltip=e.title,e.removeAttribute("title"),e.classList.add("hide-tooltip"),document.addEventListener("touchstart",t=>{t.preventDefault(),t.target!==e?e.classList.add("hide-tooltip"):t.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",t=>{t.preventDefault(),t.target!==e?e.classList.add("hide-tooltip"):t.target.classList.remove("hide-tooltip")}))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${f}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Pt`<div class="divider"></div>`:Xt}async adjustLegal(){if(await this.card.updateComplete,await customElements.whenDefined("inline-price"),this.legalAdjusted)return;this.legalAdjusted=!0;let e=[],t=this.card.querySelector(`[slot="heading-m"] ${f}[data-template="price"]`);t&&e.push(t);let r=e.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling))});await Promise.all(r)}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;e.setAttribute("custom-checkbox","");let t=this.mainPrice;if(!t)return;await t.onceSettled();let r=t.value?.[0]?.planType;r&&(e.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?Pt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Xt}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Xt:Pt`<slot name="icons"></slot>`}connectedCallbackHook(){let e=Ft();e?.addEventListener&&e.addEventListener("change",this.adaptForMedia);let t=Ut();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let e=Ft();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMedia);let t=Ut();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia)}renderLayout(){return Pt` ${this.badge}
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
            ${this.secureLabelFooter}`}};l(A,"variantStyle",co`
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
    `),l(A,"collectionOptions",{customHeaderArea:e=>e.sidenav?Pt`<slot name="resultsText"></slot>`:Xt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as ge,css as so}from"../lit-all.min.js";var mr=`
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
@media screen and ${b} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${g} {
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
`;var ft=class extends v{constructor(e){super(e),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return mr}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(t=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${t}"]`),t))}renderLayout(){return ge` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":ge`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?ge`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Bt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${f}[data-template="price"]`)}toggleAddon(e){let t=this.mainPrice,r=this.headingXSSlot;if(!t&&r){let n=e?.getAttribute("plan-type"),a=null;if(e&&n&&(a=e.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(i=>i.remove()),e.checked){if(a){let i=S("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(i)}}else{let i=S("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice,r=this.card.planType;t&&(await t.onceSettled(),r=t.value?.[0]?.planType),r&&(e.planType=r)}};l(ft,"variantStyle",so`
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
    `);import{html as fe,css as lo}from"../lit-all.min.js";var pr=`
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
@media screen and ${T} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${b} {
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
@media screen and ${g} {
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
`;var xt=class extends v{constructor(e){super(e)}getGlobalCSS(){return pr}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return fe` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":fe`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?fe`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};l(xt,"variantStyle",lo`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as xe,css as ho}from"../lit-all.min.js";var ur=`
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

@media screen and ${T} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${b} {
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
@media screen and ${g} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${z} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var gr={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},bt=class extends v{constructor(e){super(e)}getGlobalCSS(){return ur}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return xe`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?xe`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:xe`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};l(bt,"variantStyle",ho`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{css as mo,html as po}from"../lit-all.min.js";var fr=`
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
`;var xr={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},vt=class extends v{constructor(){super(...arguments);l(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return fr}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(t,r){r.literals={...r.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},r.space=!0,r.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let t=this.card.querySelector(`${f}[data-template="price"]`);if(!t)return;let r=t.cloneNode(!0);this.legal=r,t.dataset.displayTax="false",r.dataset.template="legal",r.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,r.setAttribute("slot","legal"),this.card.appendChild(r)}renderLayout(){return po`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};l(vt,"variantStyle",mo`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
        }
    `);var Jt=new Map,br=new WeakMap,vr=new Map,C=(o,e,t=null,r=null,n)=>{Jt.set(o,{class:e,fragmentMapping:t,style:r,collectionOptions:n})};C("catalog",pt,nr,pt.variantStyle);C("image",Wt);C("inline-heading",Qt);C("mini-compare-chart",gt,null,gt.variantStyle);C("plans",A,Zt,A.variantStyle,A.collectionOptions);C("plans-students",A,hr,A.variantStyle,A.collectionOptions);C("plans-education",A,dr,A.variantStyle,A.collectionOptions);C("product",ft,null,ft.variantStyle);C("segment",xt,null,xt.variantStyle);C("special-offers",bt,gr,bt.variantStyle);C("mini",vt,xr,vt.variantStyle);var uo=(o,e,t)=>{try{let r=vr.get(o.variant);if(r||(r=new CSSStyleSheet,r.replaceSync(e.cssText),vr.set(o.variant,r)),t?.styleSheet&&t.styleSheet!==r){let n=o.shadowRoot.adoptedStyleSheets.indexOf(t.styleSheet);n!==-1&&o.shadowRoot.adoptedStyleSheets.splice(n,1)}return o.shadowRoot.adoptedStyleSheets.includes(r)||o.shadowRoot.adoptedStyleSheets.push(r),{styleSheet:r}}catch{let n=document.createElement("style");n.textContent=e.cssText,n.setAttribute("data-variant-style",o.variant);let a=t?.styleElement||o.shadowRoot.querySelector("[data-variant-style]");return a&&a.remove(),o.shadowRoot.appendChild(n),{styleElement:n}}},be=o=>{let e=Jt.get(o.variant);if(!e)return;let{class:t,style:r}=e,n=br.get(o);if(n?.appliedVariant===o.variant)return new t(o);let a=r?uo(o,r,n):{};return br.set(o,{appliedVariant:o.variant,...a}),new t(o)};function Kt(o){return Jt.get(o)?.fragmentMapping}function yr(o){return Jt.get(o)?.collectionOptions}var U=null,ve=()=>{if(U)return U;if(window.__masGlobalStyleSheet)U=window.__masGlobalStyleSheet;else{U=new CSSStyleSheet;let o=`
:root {
    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

    /* headings */
    --consonant-merch-card-heading-xxxs-font-size: 14px;
    --consonant-merch-card-heading-xxxs-line-height: 18px;
    --consonant-merch-card-heading-xxs-font-size: 16px;
    --consonant-merch-card-heading-xxs-line-height: 20px;
    --consonant-merch-card-heading-xs-font-size: 18px;
    --consonant-merch-card-heading-xs-line-height: 22.5px;
    --consonant-merch-card-heading-s-font-size: 20px;
    --consonant-merch-card-heading-s-line-height: 25px;
    --consonant-merch-card-heading-m-font-size: 24px;
    --consonant-merch-card-heading-m-line-height: 30px;

    /* detail */
    --consonant-merch-card-detail-xs-line-height: 12px;
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;
    --consonant-merch-card-detail-l-line-height: 18px;
    --consonant-merch-card-detail-xl-line-height: 23px;

    /* body */
    --consonant-merch-card-body-xxs-font-size: 12px;
    --consonant-merch-card-body-xxs-line-height: 18px;
    --consonant-merch-card-body-xxs-letter-spacing: 1px;
    --consonant-merch-card-body-xs-font-size: 14px;
    --consonant-merch-card-body-xs-line-height: 21px;
    --consonant-merch-card-body-s-font-size: 16px;
    --consonant-merch-card-body-s-line-height: 24px;
    --consonant-merch-card-body-m-font-size: 18px;
    --consonant-merch-card-body-m-line-height: 27px;
    --consonant-merch-card-body-l-font-size: 20px;
    --consonant-merch-card-body-l-line-height: 30px;
    --consonant-merch-card-body-xl-font-size: 22px;
    --consonant-merch-card-body-xxl-font-size: 24px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --consonant-merch-card-background-color: inherit;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: rgb(59, 99, 251);
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-50: var(--specturm-gray-50);
    --merch-color-grey-60: var(--specturm-gray-600);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-grey-700: #464646;
    --merch-color-grey-800: #222222;
    --merch-color-green-promo: #05834E;
    --merch-color-red-promo: #D31510;
    --merch-color-grey-80: #2c2c2c;
    --consonant-merch-card-body-xs-color: var(--spectrum-gray-100, var(--merch-color-grey-80));
    --merch-color-inline-price-strikethrough: initial;
    --consonant-merch-card-detail-s-color: var(--spectrum-gray-600, var(--merch-color-grey-600));
    --consonant-merch-card-heading-color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    --consonant-merch-card-heading-xs-color: var(--consonant-merch-card-heading-color);
    --consonant-merch-card-price-color: #222222;
    --consonant-merch-card-heading-xxxs-color: #131313;
    --consonant-merch-card-body-xxs-color: #292929;

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    /* ah colors */
    --ah-gray-500: #717171;
    
    /* plans colors */
    --spectrum-yellow-300-plans: #F5C700;
    --spectrum-green-900-plans: #05834E;
    --spectrum-gray-300-plans: #DADADA;
    --spectrum-gray-700-plans: #505050;
  
    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --consonant-merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --consonant-merch-card-callout-line-height: 21px;
    --consonant-merch-card-callout-font-size: 14px;
    --consonant-merch-card-callout-font-color: #2C2C2C;
    --consonant-merch-card-callout-icon-size: 16px;
    --consonant-merch-card-callout-icon-top: 6px;
    --consonant-merch-card-callout-icon-right: 8px;
    --consonant-merch-card-callout-letter-spacing: 0px;
    --consonant-merch-card-callout-icon-padding: 34px;
    --consonant-merch-card-callout-spacing-xxs: 8px;

    --merch-card-ul-padding: 8px;
}

.collection-container {
    display: grid;
    justify-content: center;
    grid-template-columns: min-content min-content;
    grid-template-rows: min-content 1fr;
    align-items: start;
    grid-template-areas: "sidenav header" "sidenav content";
    --merch-card-collection-card-min-height: auto;
    --merch-sidenav-collection-gap: 0;
    --merch-card-collection-card-width: unset;
}

.collection-container merch-sidenav {
    grid-area: sidenav;
}

.collection-container merch-card-collection-header {
    --merch-card-collection-header-margin-bottom: var(--spacing-m);
    grid-area: header;
}

.collection-container merch-card-collection {
    grid-area: content;
}

.collection-container merch-card {
    min-height: var(--merch-card-collection-card-min-height);
}

.collection-container .one-merch-card,
.collection-container .two-merch-cards,
.collection-container .three-merch-cards,
.collection-container .four-merch-cards {
    padding: 0;
}

merch-card-collection {
    display: contents;
}

merch-card-collection > merch-card:not([style]) {
    display: none;
}

merch-card-collection > p[slot],
merch-card-collection > div[slot] p,
merch-card-collection-header > p[slot],
merch-card-collection-header > div[slot] p {
    margin: 0;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    --merch-card-collection-card-width: unset;
    display: grid;
    justify-content: center;
    justify-items: stretch;
    align-items: normal;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
    grid-template-columns: var(--merch-card-collection-card-width);
}

.tabpanel > .four-merch-cards {
    z-index: 3;
}

merch-card[variant="ccd-suggested"] *,
merch-card[variant="ccd-slice"] * {
  box-sizing: border-box;
}

merch-card * {
  padding: revert-layer;
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin: var(--consonant-merch-spacing-xs) 0;
    height: 1px;
    border: none;
}

merch-card.has-divider div[slot='body-lower'] hr {
    margin: 0;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is='inline-price'] {
    display: inline-block;
}

merch-card [slot^='heading-'],
merch-card span[class^='heading-'] {
    color: var(--consonant-merch-card-heading-color);
    font-weight: 700;
}

merch-card span[class^='heading-'],
merch-card span.promo-text {
    display: block;
}

merch-card [slot='heading-xxxs'],
merch-card span.heading-xxxs {
    font-size: var(--consonant-merch-card-heading-xxxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxxs-line-height);
    color: var(--consonant-merch-card-heading-xxxs-color);
    letter-spacing: normal;
}

merch-card [slot='heading-xxs'],
merch-card span.heading-xxs {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
    letter-spacing: normal;
}

merch-card [slot='heading-xs'],
merch-card span.heading-xs {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    color: var(--consonant-merch-card-heading-xs-color);
    margin: 0;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card div.starting-at {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'],
merch-card span.heading-s {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
}

merch-card [slot='heading-m'],
merch-card span.heading-m {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='whats-included'] {
    margin: var(--consonant-merch-spacing-xxxs) 0px;
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card[variant^='plans'] [slot='badge'] {
    position: absolute;
    top: 16px;
    right: 0;
    line-height: 16px;
}

merch-card [slot='callout-content'] > p {
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
    width: fit-content;
    font-size: var(--consonant-merch-card-callout-font-size);
    line-height: var(--consonant-merch-card-callout-line-height);
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
    align-items: flex-start;
}

merch-card [slot='callout-content'] > div > div {
    display: flex;
    background: rgba(203 203 203 / 50%);
    border-radius: var(--consonant-merch-spacing-xxxs);
    padding: var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxxs) var(--consonant-merch-spacing-xxs);
}

merch-card [slot='callout-content'] > div > div > div {
    display: inline-block;
    text-align: start;
    font: normal normal normal var(--consonant-merch-card-callout-font-size)/var(--consonant-merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--consonant-merch-card-callout-letter-spacing);
    color: var(--consonant-merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--consonant-merch-card-callout-icon-size);
    height: var(--consonant-merch-card-callout-icon-size);
    margin-inline-end: 2.5px;
    margin-inline-start: 9px;
    margin-block-start: 2.5px;
}

merch-card [slot='detail-s'] {
    font-size: var(--consonant-merch-card-detail-s-font-size);
    line-height: var(--consonant-merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--consonant-merch-card-detail-s-color);
}

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-s"] {
    color: var(--consonant-merch-card-body-s-color);
}

merch-card button.spectrum-Button > a {
  color: inherit;
  text-decoration: none;
}

merch-card button.spectrum-Button > a:hover {
  color: inherit;
}

merch-card button.spectrum-Button > a:active {
  color: inherit;
}

merch-card button.spectrum-Button > a:focus {
  color: inherit;
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--consonant-merch-card-body-xs-color);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--merch-color-grey-80);
}

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"],
merch-card span.promo-text {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-heading-font-size);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
}

merch-card span[data-styling][class^='heading-'],
merch-card span[data-styling].promo-text {
    display: block;
}

merch-card [slot="footer-rows"] {
    min-height: var(--consonant-merch-card-footer-rows-height);
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card.product div[slot="footer"] {
    display: block;
}

merch-card.product div[slot="footer"] a + a {
    margin: 5px 0 0 5px;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-bg-img-height);
    max-height: var(--consonant-merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card span.placeholder-resolved[data-template='priceStrikethrough'],
merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  font-weight: normal;
  text-decoration: line-through;
  color: var(--merch-color-inline-price-strikethrough);
}

merch-card [slot^="body-"] ul {
    margin: 0;
    padding-inline-start: var(--merch-card-ul-padding);
    list-style-type: "\u2022";
}
    
merch-card [slot^="body-"] ul li {
    padding-inline-start: var(--merch-card-ul-padding);
}

/* merch-offer-select */
merch-offer-select[variant="subscription-options"] merch-offer span[is="inline-price"][data-display-tax='true'] .price-tax-inclusivity {
    font-size: 12px;
    font-style: italic;
    font-weight: normal;
    position: absolute;
    left: 0;
    top: 20px;
}

merch-addon span[data-wcs-osi][data-offer-type="TRIAL"] {
    display: none;
}

merch-gradient {
    display: none;
}

body.merch-modal {
    overflow: hidden;
    scrollbar-gutter: stable;
    height: 100vh;
}

merch-sidenav-list img[slot="icon"] {
    height: fit-content;
    pointer-events: none;
}

merch-sidenav-list sp-sidenav > sp-sidenav-item:last-of-type {
    --mod-sidenav-gap: 0;
    line-height: var(--mod-sidenav-top-level-line-height)
}

merch-sidenav-checkbox-group h3 {
    font-size: var(--merch-sidenav-checkbox-group-title-font-size);
    font-weight: var(--merch-sidenav-checkbox-group-title-font-weight);
    line-height: var(--merch-sidenav-checkbox-group-title-line-height);
    color: var(--merch-sidenav-checkbox-group-title-color);
    padding: var(--merch-sidenav-checkbox-group-title-padding);
    margin: 0;
}

sr-only {
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

aem-fragment {
  display: contents;
}

merch-card [slot='callout-content'] .icon-button {
  position: absolute;
  top: 3px;
  text-decoration: none;
  border-bottom: none;
  min-width: 18px;
  display: inline-flex;
  min-height: 18px;
  align-items: center;
  justify-content: center;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
  background-size: 18px;
}

merch-card [slot='callout-content'] .icon-button::before {
  content: attr(data-tooltip);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 100%;
  margin-left: 8px;
  max-width: 140px;
  padding: 10px;
  border-radius: 5px;
  background: #0469E3;
  color: #fff;
  text-align: left;
  display: block;
  z-index: 10;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  width: max-content;
}

merch-card [slot='callout-content'] .icon-button::after {
  content: "";
  position: absolute;
  left: 102%;
  margin-left: -8px;
  top: 50%;
  transform: translateY(-50%);
  border: 8px solid #0469E3;
  border-color: transparent #0469E3 transparent transparent;
  display: block;
  z-index: 10;
}

merch-card [slot='callout-content'] .icon-button.hide-tooltip::before,
merch-card [slot='callout-content'] .icon-button.hide-tooltip::after {
  display: none;
}

@media (max-width: 600px) {
merch-card [slot='callout-content'] .icon-button::before { 
    max-width: 180px;
  }
}

@media screen and ${b} {
    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: repeat(2, var(--merch-card-collection-card-width));
    }
}

@media screen and ${g} {
    .four-merch-cards {
        grid-template-columns: repeat(4, var(--merch-card-collection-card-width));
    }

    .three-merch-cards,
    merch-sidenav ~ .four-merch-cards {
        grid-template-columns: repeat(3, var(--merch-card-collection-card-width));
    }
}

@media screen and ${z} {
    .four-merch-cards,
    merch-sidenav ~ .four-merch-cards {
        grid-template-columns: repeat(4, var(--merch-card-collection-card-width));
    }
}

`;U.replaceSync(o),window.__masGlobalStyleSheet=U,document.adoptedStyleSheets.includes(U)||(document.adoptedStyleSheets=[...document.adoptedStyleSheets,U])}return U},wi=ve();function te(o,e={},{metadata:t=!0,search:r=!0,storage:n=!0}={}){let a;if(r&&a==null){let i=new URLSearchParams(window.location.search),c=ye(r)?r:o;a=i.get(c)}if(n&&a==null){let i=ye(n)?n:o;a=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(t&&a==null){let i=fo(ye(t)?t:o);a=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return a??e[o]}var go=o=>typeof o=="boolean",ee=o=>typeof o=="function";var ye=o=>typeof o=="string";function Er(o,e){if(go(o))return o;let t=String(o);return t==="1"||t==="true"?!0:t==="0"||t==="false"?!1:e}function fo(o=""){return String(o).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(e,t,r)=>`${t}-${r}`).replace(/\W+/gu,"-").toLowerCase()}var X=class o extends Error{constructor(e,t,r){if(super(e,{cause:r}),this.name="MasError",t.response){let n=t.response.headers?.get(qt);n&&(t.requestId=n),t.response.status&&(t.status=t.response.status,t.statusText=t.response.statusText),t.response.url&&(t.url=t.response.url)}delete t.response,this.context=t,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let e=Object.entries(this.context||{}).map(([r,n])=>`${r}: ${JSON.stringify(n)}`).join(", "),t=`${this.name}: ${this.message}`;return e&&(t+=` (${e})`),this.cause&&(t+=`
Caused by: ${this.cause}`),t}};var xo="mas-commerce-service",bo={requestId:qt,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};var re=o=>window.setTimeout(o);function Ee(){return document.getElementsByTagName(xo)?.[0]}function wr(o){let e={};if(!o?.headers)return e;let t=o.headers;for(let[r,n]of Object.entries(bo)){let a=t.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),e[r]=a)}return e}async function Sr(o,e={},t=2,r=100){let n;for(let a=0;a<=t;a++)try{let i=await fetch(o,e);return i.retryCount=a,i}catch(i){if(n=i,n.retryCount=a,a>t)break;await new Promise(c=>setTimeout(c,r*(a+1)))}throw n}var Ar="fragment",kr="author",Tr="preview",Cr="loading",Lr="timeout",we="aem-fragment",_r="eager",Rr="cache",vo=[_r,Rr],I,Z,M,Se=class{constructor(){m(this,I,new Map);m(this,Z,new Map);m(this,M,new Map)}clear(){s(this,I).clear(),s(this,Z).clear(),s(this,M).clear()}add(e,t=!0){if(!this.has(e.id)&&!this.has(e.fields?.originalId)){if(s(this,I).set(e.id,e),e.fields?.originalId&&s(this,I).set(e.fields.originalId,e),s(this,M).has(e.id)){let[,r]=s(this,M).get(e.id);r()}if(s(this,M).has(e.fields?.originalId)){let[,r]=s(this,M).get(e.fields?.originalId);r()}if(!(!t||typeof e.references!="object"||Array.isArray(e.references)))for(let r in e.references){let{type:n,value:a}=e.references[r];n==="content-fragment"&&(a.settings={...e?.settings,...a.settings},a.placeholders={...e?.placeholders,...a.placeholders},a.dictionary={...e?.dictionary,...a.dictionary},a.priceLiterals={...e?.priceLiterals,...a.priceLiterals},this.add(a,e))}}}has(e){return s(this,I).has(e)}entries(){return s(this,I).entries()}get(e){return s(this,I).get(e)}getAsPromise(e){let[t]=s(this,M).get(e)??[];if(t)return t;let r;return t=new Promise(n=>{r=n,this.has(e)&&n()}),s(this,M).set(e,[t,r]),t}getFetchInfo(e){let t=s(this,Z).get(e);return t||(t={url:null,retryCount:0,stale:!1,measure:null,status:null},s(this,Z).set(e,t)),t}remove(e){s(this,I).delete(e),s(this,Z).delete(e),s(this,M).delete(e)}};I=new WeakMap,Z=new WeakMap,M=new WeakMap;var V=new Se,yt,D,B,L,k,y,Mt,Nt,N,Ot,$t,Et,O,Pr,Mr,Ae,Nr,oe=class extends HTMLElement{constructor(){super(...arguments);m(this,O);l(this,"cache",V);m(this,yt);m(this,D,null);m(this,B,null);m(this,L,null);m(this,k);m(this,y);m(this,Mt,_r);m(this,Nt,5e3);m(this,N);m(this,Ot,!1);m(this,$t,0);m(this,Et)}static get observedAttributes(){return[Ar,Cr,Lr,kr,Tr]}attributeChangedCallback(t,r,n){t===Ar&&(h(this,k,n),h(this,y,V.getFetchInfo(n))),t===Cr&&vo.includes(n)&&h(this,Mt,n),t===Lr&&h(this,Nt,parseInt(n,10)),t===kr&&h(this,Ot,["","true"].includes(n)),t===Tr&&h(this,Et,n)}connectedCallback(){if(!s(this,N)){if(s(this,L)??h(this,L,W(this)),h(this,Et,s(this,L).settings?.preview),s(this,yt)??h(this,yt,s(this,L).log.module(`${we}[${s(this,k)}]`)),!s(this,k)||s(this,k)==="#"){s(this,y)??h(this,y,V.getFetchInfo("missing-fragment-id")),w(this,O,Ae).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(s(this,y)).filter(([t,r])=>r!=null).map(([t,r])=>[`aem-fragment:${t}`,r]))}async refresh(t=!0){if(s(this,N)&&!await Promise.race([s(this,N),Promise.resolve(!1)]))return;t&&V.remove(s(this,k)),s(this,Mt)===Rr&&await Promise.race([V.getAsPromise(s(this,k)),new Promise(c=>setTimeout(c,s(this,Nt)))]);try{h(this,N,w(this,O,Nr).call(this)),await s(this,N)}catch(c){return w(this,O,Ae).call(this,c.message),!1}let{references:r,referencesTree:n,placeholders:a,wcs:i}=s(this,D)||{};return i&&!te("mas.disableWcsCache")&&s(this,L).prefillWcsCache(i),this.dispatchEvent(new CustomEvent(ct,{detail:{...this.data,references:r,referencesTree:n,placeholders:a,...s(this,y)},bubbles:!0,composed:!0})),s(this,N)}get updateComplete(){return s(this,N)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return s(this,B)?s(this,B):(s(this,Ot)?this.transformAuthorData():this.transformPublishData(),s(this,B))}transformAuthorData(){let{fields:t,id:r,tags:n,settings:a={},priceLiterals:i={},dictionary:c={},placeholders:d={}}=s(this,D);h(this,B,t.reduce((p,{name:u,multiple:x,values:R})=>(p.fields[u]=x?R:R[0],p),{fields:{},id:r,tags:n,settings:a,priceLiterals:i,dictionary:c,placeholders:d}))}transformPublishData(){let{fields:t,id:r,tags:n,settings:a={},priceLiterals:i={},dictionary:c={},placeholders:d={}}=s(this,D);h(this,B,Object.entries(t).reduce((p,[u,x])=>(p.fields[u]=x?.mimeType?x.value:x??"",p),{fields:{},id:r,tags:n,settings:a,priceLiterals:i,dictionary:c,placeholders:d}))}getFragmentClientUrl(){let r=new URLSearchParams(window.location.search).get("maslibs");if(!r||r.trim()==="")return"https://mas.adobe.com/studio/libs/fragment-client.js";let n=r.trim().toLowerCase();if(n==="local")return"http://localhost:3030/studio/libs/fragment-client.js";let{hostname:a}=window.location,i=a.endsWith(".page")?"page":"live";return n.includes("--")?`https://${n}.aem.${i}/studio/libs/fragment-client.js`:`https://${n}--mas--adobecom.aem.${i}/studio/libs/fragment-client.js`}async generatePreview(){let t=this.getFragmentClientUrl(),{previewFragment:r}=await import(t);return await r(s(this,k),{locale:s(this,L).settings.locale,apiKey:s(this,L).settings.wcsApiKey})}};yt=new WeakMap,D=new WeakMap,B=new WeakMap,L=new WeakMap,k=new WeakMap,y=new WeakMap,Mt=new WeakMap,Nt=new WeakMap,N=new WeakMap,Ot=new WeakMap,$t=new WeakMap,Et=new WeakMap,O=new WeakSet,Pr=async function(t){Ie(this,$t)._++;let r=`${we}:${s(this,k)}:${s(this,$t)}`,n=`${r}${jt}`,a=`${r}${Gt}`;if(s(this,Et))return await this.generatePreview();performance.mark(n);let i;try{if(s(this,y).stale=!1,s(this,y).url=t,i=await Sr(t,{cache:"default",credentials:"omit"}),w(this,O,Mr).call(this,i),s(this,y).status=i?.status,s(this,y).measure=lt(performance.measure(a,n)),s(this,y).retryCount=i.retryCount,!i?.ok)throw new X("Unexpected fragment response",{response:i,...s(this,L).duration});return await i.json()}catch(c){if(s(this,y).measure=lt(performance.measure(a,n)),s(this,y).retryCount=c.retryCount,s(this,D))return s(this,y).stale=!0,s(this,yt).error("Serving stale data",s(this,y)),s(this,D);let d=c.message??"unknown";throw new X(`Failed to fetch fragment: ${d}`,{})}},Mr=function(t){Object.assign(s(this,y),wr(t))},Ae=function(t){h(this,N,null),s(this,y).message=t,this.classList.add("error");let r={...s(this,y),...s(this,L).duration};s(this,yt).error(t,r),this.dispatchEvent(new CustomEvent(st,{detail:r,bubbles:!0,composed:!0}))},Nr=async function(){var d;this.classList.remove("error"),h(this,B,null);let t=V.get(s(this,k));if(t)return h(this,D,t),!0;let{masIOUrl:r,wcsApiKey:n,country:a,locale:i}=s(this,L).settings,c=`${r}/fragment?id=${s(this,k)}&api_key=${n}&locale=${i}`;return a&&!i.endsWith(`_${a}`)&&(c+=`&country=${a}`),t=await w(this,O,Pr).call(this,c),(d=t.fields).originalId??(d.originalId=s(this,k)),V.add(t),h(this,D,t),!0},l(oe,"cache",V);customElements.define(we,oe);import{LitElement as yo,html as Eo,css as wo}from"../lit-all.min.js";var wt=class extends yo{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return Eo`<div class="badge">
            ${this.text}
        </div>`}};l(wt,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),l(wt,"styles",wo`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
            position: relative;
            left: 1px;
        }
    `);customElements.define("merch-badge",wt);import{html as So,css as Ao,LitElement as ko}from"../lit-all.min.js";var zt=class extends ko{constructor(){super()}render(){return So`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};l(zt,"styles",Ao`
        :host {
            display: flex;
            flex-wrap: nowrap;
            gap: 8px;
            margin-right: 16px;
            align-items: center;
        }

        ::slotted([slot='icon']) {
            display: flex;
            justify-content: center;
            align-items: center;
            height: max-content;
        }

        ::slotted([slot='description']) {
            font-size: 14px;
            line-height: 21px;
            margin: 0;
        }

        :host .hidden {
            display: none;
        }
    `),l(zt,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",zt);import{html as ke,css as To,LitElement as Co}from"../lit-all.min.js";var It=class extends Co{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((e,t)=>{t>=5&&(e.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return ke`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?ke`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:ke``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};l(It,"styles",To`
        :host {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            overflow: hidden;
            box-sizing: border-box;
            row-gap: 10px;
        }

        ::slotted([slot='heading']) {
            font-size: 14px;
            font-weight: 700;
            margin-right: 16px;
        }

        ::slotted([slot='content']) {
            display: contents;
        }

        .hidden {
            display: none;
        }

        .see-more {
            font-size: 14px;
            text-decoration: underline;
            color: var(--link-color-dark);
        }
    `),l(It,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",It);var J={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Or=1e3;function Lo(o){return o instanceof Error||typeof o?.originatingRequest=="string"}function $r(o){if(o==null)return;let e=typeof o;if(e==="function")return o.name?`function ${o.name}`:"function";if(e==="object"){if(o instanceof Error)return o.message;if(typeof o.originatingRequest=="string"){let{message:r,originatingRequest:n,status:a}=o;return[r,a,n].filter(Boolean).join(" ")}let t=o[Symbol.toStringTag]??Object.getPrototypeOf(o).constructor.name;if(!J.serializableTypes.includes(t))return t}return o}function _o(o,e){if(!J.ignoredProperties.includes(o))return $r(e)}var Te={append(o){if(o.level!=="error")return;let{message:e,params:t}=o,r=[],n=[],a=e;t.forEach(p=>{p!=null&&(Lo(p)?r:n).push(p)}),r.length&&(a+=" "+r.map($r).join(" "));let{pathname:i,search:c}=window.location,d=`${J.delimiter}page=${i}${c}`;d.length>Or&&(d=`${d.slice(0,Or)}<trunc>`),a+=d,n.length&&(a+=`${J.delimiter}facts=`,a+=JSON.stringify(n,_o)),window.lana?.log(a,J)}};function zr(o){Object.assign(J,Object.fromEntries(Object.entries(o).filter(([e,t])=>e in J&&t!==""&&t!==null&&t!==void 0&&!Number.isNaN(t))))}var Ir={LOCAL:"local",PROD:"prod",STAGE:"stage"},Ce={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Le=new Set,_e=new Set,Dr=new Map,Fr={append({level:o,message:e,params:t,timestamp:r,source:n}){console[o](`${r}ms [${n}] %c${e}`,"font-weight: bold;",...t)}},Ur={filter:({level:o})=>o!==Ce.DEBUG},Ro={filter:()=>!1};function Po(o,e,t,r,n){return{level:o,message:e,namespace:t,get params(){return r.length===1&&ee(r[0])&&(r=r[0](),Array.isArray(r)||(r=[r])),r},source:n,timestamp:performance.now().toFixed(3)}}function Mo(o){[..._e].every(e=>e(o))&&Le.forEach(e=>e(o))}function Br(o){let e=(Dr.get(o)??0)+1;Dr.set(o,e);let t=`${o} #${e}`,r={id:t,namespace:o,module:n=>Br(`${r.namespace}/${n}`),updateConfig:zr};return Object.values(Ce).forEach(n=>{r[n]=(a,...i)=>Mo(Po(n,a,o,i,t))}),Object.seal(r)}function ne(...o){o.forEach(e=>{let{append:t,filter:r}=e;ee(r)&&_e.add(r),ee(t)&&Le.add(t)})}function No(o={}){let{name:e}=o,t=Er(te("commerce.debug",{search:!0,storage:!0}),e===Ir.LOCAL);return ne(t?Fr:Ur),e===Ir.PROD&&ne(Te),Re}function Oo(){Le.clear(),_e.clear()}var Re={...Br(Je),Level:Ce,Plugins:{consoleAppender:Fr,debugFilter:Ur,quietFilter:Ro,lanaAppender:Te},init:No,reset:Oo,use:ne};var $o={[j]:We,[K]:Qe,[G]:Xe},zo={[j]:Ze,[G]:Tt},Dt,ae=class{constructor(e){m(this,Dt);l(this,"changes",new Map);l(this,"connected",!1);l(this,"error");l(this,"log");l(this,"options");l(this,"promises",[]);l(this,"state",K);l(this,"timer",null);l(this,"value");l(this,"version",0);l(this,"wrapperElement");this.wrapperElement=e,this.log=Re.module("mas-element")}update(){[j,K,G].forEach(e=>{this.wrapperElement.classList.toggle($o[e],e===this.state)})}notify(){(this.state===G||this.state===j)&&(this.state===G?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===j&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]);let e=this.error;this.error instanceof X&&(e={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(zo[this.state],{bubbles:!0,detail:e}))}attributeChangedCallback(e,t,r){this.changes.set(e,r),this.requestUpdate()}connectedCallback(){h(this,Dt,Ee()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:e,promises:t,state:r}=this;return G===r?Promise.resolve(this.wrapperElement):j===r?Promise.reject(e):new Promise((n,a)=>{t.push({resolve:n,reject:a})})}toggleResolved(e,t,r){return e!==this.version?!1:(r!==void 0&&(this.options=r),this.state=G,this.value=t,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:t}),re(()=>this.notify()),!0)}toggleFailed(e,t,r){if(e!==this.version)return!1;r!==void 0&&(this.options=r),this.error=t,this.state=j,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${t.message}`,{element:this.wrapperElement,...t.context,...s(this,Dt)?.duration}),re(()=>this.notify()),!0}togglePending(e){return this.version++,e&&(this.options=e),this.state=K,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(e=!1){if(!this.wrapperElement.isConnected||!Ee()||this.timer)return;let{error:t,options:r,state:n,value:a,version:i}=this;this.state=K,this.timer=re(async()=>{this.timer=null;let c=null;if(this.changes.size&&(c=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:c}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:c})),c||e)try{await this.wrapperElement.render?.()===!1&&this.state===K&&this.version===i&&(this.state=n,this.error=t,this.value=a,this.update(),this.notify())}catch(d){this.toggleFailed(this.version,d,r)}})}};Dt=new WeakMap;function Io(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var et,tt=class tt extends HTMLAnchorElement{constructor(){super();l(this,"masElement",new ae(this));m(this,et);this.setAttribute("is",tt.is)}get isUptLink(){return!0}initializeWcsData(t,r){this.setAttribute("data-wcs-osi",t),r&&this.setAttribute("data-promotion-code",r)}attributeChangedCallback(t,r,n){this.masElement.attributeChangedCallback(t,r,n)}connectedCallback(){this.masElement.connectedCallback(),h(this,et,W()),s(this,et)&&(this.log=s(this,et).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),h(this,et,void 0)}requestUpdate(t=!1){this.masElement.requestUpdate(t)}onceSettled(){return this.masElement.onceSettled()}async render(){let t=W();if(!t)return!1;this.dataset.imsCountry||t.imsCountryPromise.then(i=>{i&&(this.dataset.imsCountry=i)});let r=t.collectCheckoutOptions({},this);if(!r.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(r),a=t.resolveOfferSelectors(r);try{let[[i]]=await Promise.all(a),{country:c,language:d,env:p}=r,u=`locale=${d}_${c}&country=${c}&offer_id=${i.offerId}`,x=this.getAttribute("data-promotion-code");x&&(u+=`&promotion_code=${encodeURIComponent(x)}`),this.href=`${Io(p)}?${u}`,this.masElement.toggleResolved(n,i,r)}catch(i){let c=new Error(`Could not resolve offer selectors for id: ${r.wcsOsi}.`,i.message);return this.masElement.toggleFailed(n,c,r),!1}}static createFrom(t){let r=new tt;for(let n of t.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?r.setAttribute("class",n.value.replace("upt-link","").trim()):r.setAttribute(n.name,n.value));return r.innerHTML=t.innerHTML,r.setAttribute("tabindex",0),r}};et=new WeakMap,l(tt,"is","upt-link"),l(tt,"tag","a"),l(tt,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var Y=tt;window.customElements.get(Y.is)||window.customElements.define(Y.is,Y,{extends:Y.tag});var Do="#000000",Pe="#F8D904",Fo="#EAEAEA",Uo="#31A547",Bo=/(accent|primary|secondary)(-(outline|link))?/,Ho="mas:product_code/",qo="daa-ll",ie="daa-lh",jo=["XL","L","M","S"],Me="...";function $(o,e,t,r){let n=r[o];if(e[o]&&n){let a={slot:n?.slot},i=e[o];if(n.maxCount&&typeof i=="string"){let[d,p]=sn(i,n.maxCount,n.withSuffix);d!==i&&(a.title=p,i=d)}let c=S(n.tag,a,i);t.append(c)}}function Go(o,e,t){let r=o.mnemonicIcon?.map((a,i)=>({icon:a,alt:o.mnemonicAlt[i]??"",link:o.mnemonicLink[i]??""}));r?.forEach(({icon:a,alt:i,link:c})=>{if(c&&!/^https?:/.test(c))try{c=new URL(`https://${c}`).href.toString()}catch{c="#"}let d={slot:"icons",src:a,loading:e.loading,size:t?.size??"l"};i&&(d.alt=i),c&&(d.href=c);let p=S("merch-icon",d);e.append(p)});let n=e.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&n&&n.remove()}function Vo(o,e,t){if(t.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=Pe,n=!1;t.allowedBadgeColors?.includes(t.badge?.default)&&(r=t.badge?.default,o.borderColor||(n=!0));let a=o.badgeBackgroundColor||r,i=o.borderColor||"";n&&(i=t.badge?.default,o.borderColor=t.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${a}" border-color="${i}">${o.badge}</merch-badge>`}$("badge",o,e,t)}else o.badge?(e.setAttribute("badge-text",o.badge),e.setAttribute("badge-color",o.badgeColor||Do),e.setAttribute("badge-background-color",o.badgeBackgroundColor||Pe),e.setAttribute("border-color",o.badgeBackgroundColor||Pe)):e.setAttribute("border-color",o.borderColor||Fo)}function Yo(o,e,t){if(t.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||Uo;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}$("trialBadge",o,e,t)}}function Ko(o,e,t){t?.includes(o.size)&&e.setAttribute("size",o.size)}function Wo(o,e){o.cardName&&e.setAttribute("name",o.cardName)}function Qo(o,e,t){$("cardTitle",o,e,{cardTitle:t})}function Xo(o,e,t){$("subtitle",o,e,t)}function Zo(o,e,t,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){e.style.removeProperty("--merch-card-custom-background-color"),e.removeAttribute("background-color");return}t?.[o.backgroundColor]?(e.style.setProperty("--merch-card-custom-background-color",`var(${t[o.backgroundColor]})`),e.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(e.setAttribute(r.attribute,o.backgroundColor),e.style.removeProperty("--merch-card-custom-background-color"))}function Jo(o,e,t){let r=t?.borderColor,n="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(e.style.removeProperty(n),t?.allowedBorderColors?.includes(t?.badge?.default)&&e.style.setProperty(n,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(e.setAttribute("gradient-border","true"),e.style.removeProperty(n)):e.style.setProperty(n,`var(--${o.borderColor})`))}function tn(o,e,t){if(o.backgroundImage){let r={loading:e.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!t)return;if(t?.attribute){e.setAttribute(t.attribute,o.backgroundImage);return}e.append(S(t.tag,{slot:t.slot},S("img",r)))}}function en(o,e,t){$("prices",o,e,t)}function qr(o,e,t){let r=o.hasAttribute("data-wcs-osi")&&!!o.getAttribute("data-wcs-osi"),n=o.className||"",a=Bo.exec(n)?.[0]??"accent",i=a.includes("accent"),c=a.includes("primary"),d=a.includes("secondary"),p=a.includes("-outline"),u=a.includes("-link");o.classList.remove("accent","primary","secondary");let x;if(e.consonant)x=mn(o,i,r,u);else if(u)x=o;else{let R;i?R="accent":c?R="primary":d&&(R="secondary"),x=e.spectrum==="swc"?hn(o,t,p,R,r):dn(o,t,p,R,r)}return x}function rn(o,e){let{slot:t}=e?.description,r=o.querySelectorAll(`[slot="${t}"] a[data-wcs-osi]`);r.length&&r.forEach(n=>{let a=qr(n,o,e);n.replaceWith(a)})}function on(o,e,t){$("promoText",o,e,t),$("description",o,e,t),rn(e,t),$("callout",o,e,t),$("quantitySelect",o,e,t),$("whatsIncluded",o,e,t)}function nn(o,e,t){if(!t.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let n=S("merch-addon",{slot:"addon"},r);[...n.querySelectorAll(f)].forEach(a=>{let i=a.parentElement;i?.nodeName==="P"&&i.setAttribute("data-plan-type","")}),e.append(n)}function an(o,e,t){o.addonConfirmation&&$("addonConfirmation",o,e,t)}function cn(o,e,t,r){r?.secureLabel&&t?.secureLabel&&e.setAttribute("secure-label",r.secureLabel)}function sn(o,e,t=!0){try{let r=typeof o!="string"?"":o,n=Hr(r);if(n.length<=e)return[r,n];let a=0,i=!1,c=t?e-Me.length<1?1:e-Me.length:e,d=[];for(let x of r){if(a++,x==="<")if(i=!0,r[a]==="/")d.pop();else{let R="";for(let le of r.substring(a)){if(le===" "||le===">")break;R+=le}d.push(R)}if(x==="/"&&r[a]===">"&&d.pop(),x===">"){i=!1;continue}if(!i&&(c--,c===0))break}let p=r.substring(0,a).trim();if(d.length>0){d[0]==="p"&&d.shift();for(let x of d.reverse())p+=`</${x}>`}return[`${p}${t?Me:""}`,n]}catch{let n=typeof o=="string"?o:"",a=Hr(n);return[n,a]}}function Hr(o){if(!o)return"";let e="",t=!1;for(let r of o){if(r==="<"&&(t=!0),r===">"){t=!1;continue}t||(e+=r)}return e}function ln(o,e){e.querySelectorAll("a.upt-link").forEach(r=>{let n=Y.createFrom(r);r.replaceWith(n),n.initializeWcsData(o.osi,o.promoCode)})}function dn(o,e,t,r,n){let a=o;n?a=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):a.innerHTML=`<span>${a.textContent}</span>`,a.setAttribute("tabindex",0);for(let u of o.attributes)["class","is"].includes(u.name)||a.setAttribute(u.name,u.value);a.firstElementChild?.classList.add("spectrum-Button-label");let i=e?.ctas?.size??"M",c=`spectrum-Button--${r}`,d=jo.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",p=["spectrum-Button",c,d];return t&&p.push("spectrum-Button--outline"),a.classList.add(...p),a}function hn(o,e,t,r,n){let a=o;n&&(a=customElements.get("checkout-button").createCheckoutButton(o.dataset),a.connectedCallback(),a.render());let i="fill";t&&(i="outline");let c=S("sp-button",{treatment:i,variant:r,tabIndex:0,size:e?.ctas?.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return c.source=a,(n?a.onceSettled():Promise.resolve(a)).then(d=>{c.setAttribute("data-navigation-url",d.href)}),c.addEventListener("click",d=>{d.defaultPrevented||a.click()}),c}function mn(o,e,t,r){let n=o;return t&&(n=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r||(n.classList.add("con-button"),e&&n.classList.add("blue")),n}function pn(o,e,t,r){if(o.ctas){let{slot:n}=t.ctas,a=S("div",{slot:n},o.ctas),i=[...a.querySelectorAll("a")].map(c=>qr(c,e,t));a.innerHTML="",a.append(...i),e.append(a)}}function un(o,e){let{tags:t}=o,r=t?.find(a=>a.startsWith(Ho))?.split("/").pop();if(!r)return;e.setAttribute(ie,r),[...e.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...e.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((a,i)=>{a.setAttribute(qo,`${a.dataset.analyticsId}-${i+1}`)})}function gn(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([e,t])=>{o.querySelectorAll(`a.${e}`).forEach(r=>{r.classList.remove(e),r.classList.add("spectrum-Link",`spectrum-Link--${t}`)})})}function fn(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",ie].forEach(r=>o.removeAttribute(r));let t=["wide-strip","thin-strip"];o.classList.remove(...t)}async function jr(o,e){if(!o){let d=e?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${d}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${d}).`)}if(!o.fields){let d=o.id||"unknown",p=e?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${d}' (merchCard id: ${p}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${d}' (merchCard id: ${p}) is missing 'fields'.`)}let{id:t,fields:r,settings:n={},priceLiterals:a}=o,{variant:i}=r;if(!i)throw new Error(`hydrate: no variant found in payload ${t}`);fn(e),e.settings=n,a&&(e.priceLiterals=a),e.id??(e.id=o.id),e.variant=i,await e.updateComplete;let{aemFragmentMapping:c}=e.variantLayout;if(!c)throw new Error(`hydrate: variant mapping not found for ${t}`);c.style==="consonant"&&e.setAttribute("consonant",!0),Go(r,e,c.mnemonics),Vo(r,e,c),Yo(r,e,c),Ko(r,e,c.size),Wo(r,e),Qo(r,e,c.title),Xo(r,e,c),en(r,e,c),tn(r,e,c.backgroundImage),Zo(r,e,c.allowedColors,c.backgroundColor),Jo(r,e,c),on(r,e,c),nn(r,e,c),an(r,e,c),cn(r,e,c,n),ln(r,e),pn(r,e,c,i),un(r,e),gn(e)}var $e="merch-card",Ne=2e4,Gr="merch-card:";function Vr(o,e){let t=o.closest($e);if(!t)return e;t.priceLiterals&&(e.literals??(e.literals={}),Object.assign(e.literals,t.priceLiterals)),t.variantLayout?.priceOptionsProvider?.(o,e)}function bn(o){o.providers.has(Vr)||o.providers.price(Vr)}var vn=0,St,At,kt,H,ot,F,nt,E,rt,ce,Yr,se,_=class _ extends xn{constructor(){super();m(this,E);m(this,St);m(this,At);m(this,kt);m(this,H);m(this,ot);m(this,F);m(this,nt,new Promise(t=>{h(this,F,t)}));l(this,"customerSegment");l(this,"marketSegment");l(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=be(this),this.variantLayout?.connectedCallbackHook()}willUpdate(t){(t.has("variant")||!this.variantLayout)&&(this.variantLayout=be(this),this.variantLayout?.connectedCallbackHook())}updated(t){(t.has("badgeBackgroundColor")||t.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),t.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayoutPromise=this.variantLayout?.postCardUpdateHook(t)}catch(r){w(this,E,rt).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(f)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(q)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(q)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(q)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:t}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let n of r){await n.onceSettled();let a=n.value?.[0]?.planType;if(!a)return;let i=this.stockOfferOsis[a];if(!i)return;let c=n.dataset.wcsOsi.split(",").filter(d=>d!==i);t.checked&&c.push(i),n.dataset.wcsOsi=c.join(",")}}changeHandler(t){t.target.tagName==="MERCH-ADDON"&&this.toggleAddon(t.target)}toggleAddon(t){this.variantLayout?.toggleAddon?.(t);let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length===0)return;let n=a=>{let{offerType:i,planType:c}=a.value?.[0]??{};if(!i||!c)return;let d=t.getOsi(c,i),p=(a.dataset.wcsOsi||"").split(",").filter(u=>u&&u!==d);t.checked&&p.push(d),a.dataset.wcsOsi=p.join(",")};r.forEach(n)}handleQuantitySelection(t){let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length!==0)for(let n of r)n.dataset.quantity=t.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(t){let r={...this.filters};Object.keys(r).forEach(n=>{if(t){r[n].order=Math.min(r[n].order||2,2);return}let a=r[n].order;a===1||Number.isNaN(Number(a))||(r[n].order=Number(a)+1)}),this.filters=r}includes(t){return this.textContent.match(new RegExp(t,"i"))!==null}connectedCallback(){var r;super.connectedCallback(),s(this,At)||h(this,At,vn++),this.aemFragment||((r=s(this,F))==null||r.call(this),h(this,F,void 0)),_.globalStyleSheet&&this.shadowRoot&&!this.shadowRoot.adoptedStyleSheets.includes(_.globalStyleSheet)&&(this.shadowRoot.adoptedStyleSheets=[...this.shadowRoot.adoptedStyleSheets,_.globalStyleSheet]),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let t=this.id??s(this,At);h(this,ot,`${Gr}${t}${jt}`),h(this,St,`${Gr}${t}${Gt}`),performance.mark(s(this,ot)),h(this,H,W()),bn(s(this,H)),h(this,kt,s(this,H).Log.module($e)),this.addEventListener(he,this.handleQuantitySelection),this.addEventListener(me,this.handleAddonAndQuantityUpdate),this.addEventListener(je,this.handleMerchOfferSelectReady),this.addEventListener(st,this.handleAemFragmentEvents),this.addEventListener(ct,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(he,this.handleQuantitySelection),this.removeEventListener(st,this.handleAemFragmentEvents),this.removeEventListener(ct,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(me,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(t){var r;if(this.isConnected&&(t.type===st&&w(this,E,rt).call(this,"AEM fragment cannot be loaded"),t.type===ct&&(this.failed=!1,t.target.nodeName==="AEM-FRAGMENT"))){let n=t.detail;try{s(this,F)||h(this,nt,new Promise(a=>{h(this,F,a)})),jr(n,this)}catch(a){w(this,E,rt).call(this,`hydration has failed: ${a.message}`)}finally{(r=s(this,F))==null||r.call(this),h(this,F,void 0)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;s(this,nt)&&(await s(this,nt),h(this,nt,void 0)),this.variantLayoutPromise&&(await this.variantLayoutPromise,this.variantLayoutPromise=void 0);let t=new Promise(c=>setTimeout(()=>c("timeout"),Ne));if(this.aemFragment){let c=await Promise.race([this.aemFragment.updateComplete,t]);if(c===!1||c==="timeout"){let d=c==="timeout"?`AEM fragment was not resolved within ${Ne} timeout`:"AEM fragment cannot be loaded";w(this,E,rt).call(this,d,{},!1);return}}let r=[...this.querySelectorAll(qe)],n=Promise.all(r.map(c=>c.onceSettled().catch(()=>c))).then(c=>c.every(d=>d.classList.contains("placeholder-resolved"))),a=await Promise.race([n,t]);if(a===!0){this.measure=performance.measure(s(this,St),s(this,ot));let c={...this.aemFragment?.fetchInfo,...s(this,H).duration,measure:lt(this.measure)};return this.dispatchEvent(new CustomEvent(Ye,{bubbles:!0,composed:!0,detail:c})),this}this.measure=performance.measure(s(this,St),s(this,ot));let i={measure:lt(this.measure),...s(this,H).duration};a==="timeout"?w(this,E,rt).call(this,`Contains offers that were not resolved within ${Ne} timeout`,i):w(this,E,rt).call(this,"Contains unresolved offers",i)}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let t=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(q)).length===2&&t&&t.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:t,items:r}}){if(!t||!r?.length||this.closest('[role="tabpanel"][hidden="true"]'))return;let a=this.checkoutLinks.find(u=>u.getAttribute("data-modal-id")===t);if(!a)return;let c=new URL(a.getAttribute("href")).searchParams.get("pa"),d=r.find(u=>u.productArrangementCode===c)?.quantity,p=!!r.find(u=>u.productArrangementCode!==c);if(d&&this.quantitySelect?.dispatchEvent(new CustomEvent(Ve,{detail:{quantity:d},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==p){this.toggleStockOffer({target:this.addonCheckbox});let u=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(u,"target",{writable:!1,value:{checked:p}}),this.addonCheckbox.handleChange(u)}}get prices(){return Array.from(this.querySelectorAll(f))}get promoPrice(){if(!this.querySelector("span.price-strikethrough"))return;let t=this.querySelector(".price.price-alternative");if(t||(t=this.querySelector(`${f}[data-template="price"] > span`)),!!t)return t=t.innerText,t}get regularPrice(){return s(this,E,ce)?.innerText}get promotionCode(){let t=[...this.querySelectorAll(`${f}[data-promotion-code],${q}[data-promotion-code]`)].map(n=>n.dataset.promotionCode),r=[...new Set(t)];return r.length>1&&s(this,kt)?.warn(`Multiple different promotion codes found: ${r.join(", ")}`),t[0]}get annualPrice(){return this.querySelector(`${f}[data-template="price"] > .price.price-annual`)?.innerText}get promoText(){}get taxText(){return(s(this,E,Yr)??s(this,E,ce))?.querySelector("span.price-tax-inclusivity")?.textContent?.trim()||void 0}get recurrenceText(){return s(this,E,ce)?.querySelector("span.price-recurrence")?.textContent?.trim()}get planTypeText(){return this.querySelector('[is="inline-price"][data-template="legal"] span.price-plan-type')?.textContent?.trim()}get seeTermsInfo(){let t=this.querySelector('a[is="upt-link"]');if(t)return w(this,E,se).call(this,t)}get renewalText(){return this.querySelector("span.renewal-text")?.textContent?.trim()}get promoDurationText(){return this.querySelector("span.promo-duration-text")?.textContent?.trim()}get ctas(){let t=this.querySelector('[slot="ctas"], [slot="footer"]')?.querySelectorAll(`${q}, a`);return Array.from(t??[])}get primaryCta(){return w(this,E,se).call(this,this.ctas.find(t=>t.variant==="accent"||t.matches(".spectrum-Button--accent,.con-button.blue")))}get secondaryCta(){return w(this,E,se).call(this,this.ctas.find(t=>t.variant!=="accent"&&!t.matches(".spectrum-Button--accent,.con-button.blue")))}};St=new WeakMap,At=new WeakMap,kt=new WeakMap,H=new WeakMap,ot=new WeakMap,F=new WeakMap,nt=new WeakMap,E=new WeakSet,rt=function(t,r={},n=!0){if(!this.isConnected)return;let{aemFragment:a}=this,i=a?.getAttribute("fragment");i=`[${i}]`;let c={...this.aemFragment.fetchInfo,...s(this,H).duration,...r,message:t};s(this,kt).error(`merch-card${i}: ${t}`,c),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Ke,{bubbles:!0,composed:!0,detail:c}))},ce=function(){return this.querySelector("span.price-strikethrough")??this.querySelector(`${f}[data-template="price"] > span`)},Yr=function(){return this.querySelector(`${f}[data-template="legal"]`)},se=function(t){if(t)return{text:t.innerText.trim(),analyticsId:t.dataset.analyticsId,href:t.getAttribute("href")??t.dataset.href}},l(_,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:t=>{if(!t)return;let[r,n,a]=t.split(",");return{PUF:r,ABM:n,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:t=>Object.fromEntries(t.split(",").map(r=>{let[n,a,i]=r.split(":"),c=Number(a);return[n,{order:Number.isNaN(Number(c))?void 0:c,size:i}]})),toAttribute:t=>Object.entries(t).map(([r,{order:n,size:a}])=>[r,n,a].filter(i=>i!==void 0).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:ie,reflect:!0},loading:{type:String},priceLiterals:{type:Object}}),l(_,"styles",[Ue,...Be()]),l(_,"globalStyleSheet",null),_.globalStyleSheet=ve(),l(_,"registerVariant",C),l(_,"getCollectionOptions",yr),l(_,"getFragmentMapping",Kt);var Oe=_;customElements.define($e,Oe);export{Oe as MerchCard};

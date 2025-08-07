var Vr=Object.defineProperty;var zt=o=>{throw TypeError(o)};var Yr=(o,t,e)=>t in o?Vr(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var l=(o,t,e)=>Yr(o,typeof t!="symbol"?t+"":t,e),lt=(o,t,e)=>t.has(o)||zt("Cannot "+e);var c=(o,t,e)=>(lt(o,t,"read from private field"),e?e.call(o):t.get(o)),g=(o,t,e)=>t.has(o)?zt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(o):t.set(o,e),h=(o,t,e,r)=>(lt(o,t,"write to private field"),r?r.call(o,e):t.set(o,e),e),w=(o,t,e)=>(lt(o,t,"access private method"),e);var $t=(o,t,e,r)=>({set _(n){h(o,t,n,e)},get _(){return c(o,t,r)}});import{LitElement as pn}from"../lit-all.min.js";import{css as Dt,unsafeCSS as It}from"../lit-all.min.js";var C="(max-width: 767px)",Fe="(max-width: 1199px)",b="(min-width: 768px)",f="(min-width: 1200px)",N="(min-width: 1600px)";function Be(){return window.matchMedia(C)}function He(){return window.matchMedia(f)}function Ue(){return Be().matches}function qe(){return He().matches}var Ft=Dt`
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
`,Bt=()=>[Dt`
      /* Tablet */
      @media screen and ${It(b)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${It(f)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as Kr,html as Ht,css as Wr}from"../lit-all.min.js";var ne=class extends Kr{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?Ht`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:Ht` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};l(ne,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),l(ne,"styles",Wr`
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
    `);customElements.define("merch-icon",ne);var An=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),kn=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var x='span[is="inline-price"][data-wcs-osi]',B='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var Qr='a[is="upt-link"]',Ut=`${x},${B},${Qr}`;var qt="merch-offer-select:ready",jt="merch-card:action-menu-toggle";var dt="merch-quantity-selector:change",Gt="merch-card-quantity:change",ht="merch-modal:addon-and-quantity-update";var ae="aem:load",ie="aem:error",Vt="mas:ready",Yt="mas:error",Kt="placeholder-failed",Wt="placeholder-pending",Qt="placeholder-resolved";var Xt="mas:failed",Ae="mas:resolved",Zt="mas/commerce";var H="failed",G="pending",U="resolved";var je="X-Request-Id",Tn=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var Cn=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var Ge=":start",Ve=":duration";var Jt="legal";var Xr="mas-commerce-service";function er(o,t){let e;return function(){let r=this,n=arguments;clearTimeout(e),e=setTimeout(()=>o.apply(r,n),t)}}function A(o,t={},e=null,r=null){let n=r?document.createElement(o,{is:r}):document.createElement(o);e instanceof HTMLElement?n.appendChild(e):n.innerHTML=e;for(let[a,i]of Object.entries(t))n.setAttribute(a,i);return n}function ce(o){return`startTime:${o.startTime.toFixed(2)}|duration:${o.duration.toFixed(2)}`}function tr(){return window.matchMedia("(max-width: 1024px)").matches}function V(){return document.getElementsByTagName(Xr)?.[0]}function ke(o){let t=window.getComputedStyle(o);return o.offsetHeight+parseFloat(t.marginTop)+parseFloat(t.marginBottom)}var Te,Y,Ce,Le,se,Ye=class extends HTMLElement{constructor(){super();g(this,Te,"");g(this,Y);g(this,Ce,[]);g(this,Le,[]);g(this,se);h(this,se,er(()=>{this.isConnected&&(this.parentElement.style.background=this.value,c(this,Y)?this.parentElement.style.borderRadius=c(this,Y):c(this,Y)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let e=c(this,Ce).map((r,n)=>{let a=c(this,Le)[n]||"";return`${r} ${a}`}).join(", ");return`linear-gradient(${c(this,Te)}, ${e})`}connectedCallback(){c(this,se).call(this)}attributeChangedCallback(e,r,n){e==="border-radius"&&h(this,Y,n?.trim()),e==="colors"&&n?h(this,Ce,n?.split(",").map(a=>a.trim())??[]):e==="positions"&&n?h(this,Le,n?.split(",").map(a=>a.trim())??[]):e==="angle"&&h(this,Te,n?.trim()??""),c(this,se).call(this)}};Te=new WeakMap,Y=new WeakMap,Ce=new WeakMap,Le=new WeakMap,se=new WeakMap;customElements.define("merch-gradient",Ye);import{LitElement as Zr,html as Jr,css as eo}from"../lit-all.min.js";var le=class extends Zr{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this),this.handleCustomClick=this.handleCustomClick.bind(this)}getOsi(t,e){let a=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION","TRIAL"],PROMOTION:["PROMOTION","BASE","TRIAL"]}[e]||[e]).map(s=>`p[data-plan-type="${t}"] ${x}[data-offer-type="${s}"]`).join(", ");return this.querySelector(a)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(Ae,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(Ae,this.updatePlanType)}updatePlanType(t){if(t.target.tagName!=="SPAN")return;let e=t.target,r=e?.value?.[0];r&&(e.setAttribute("data-offer-type",r.offerType),e.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}handleCustomClick(){this.shadowRoot.querySelector("input").click()}handleKeyDown(t){t.key===" "&&(t.preventDefault(),this.handleCustomClick())}render(){return Jr`
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
            </label>`}};l(le,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0},customCheckbox:{type:Boolean,attribute:"custom-checkbox",reflect:!0}}),l(le,"styles",eo`
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
            font-family: "Adobe Clean";
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
    `);customElements.define("merch-addon",le);import{html as Ke,nothing as to}from"../lit-all.min.js";var de,_e=class _e{constructor(t){l(this,"card");g(this,de);this.card=t,this.insertVariantStyle()}getContainer(){return h(this,de,c(this,de)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),c(this,de)}insertVariantStyle(){if(!_e.styleMap[this.card.variant]){_e.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,e){if(!t)return;let r=`--consonant-merch-card-${this.card.variant}-${e}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(r))||0;n>a&&this.getContainer().style.setProperty(r,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Ke`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Ke` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Ke`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:to}get secureLabelFooter(){return Ke`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,e=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||e===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-e-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return We(this.card.variant)}};de=new WeakMap,l(_e,"styleMap",{});var v=_e;import{html as mt,css as ro}from"../lit-all.min.js";var rr=`
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

@media screen and ${C} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-columns: min-content auto;
    }
}

@media screen and ${b} {
    merch-card-collection-header.catalog {
        --merch-card-collection-header-column-gap: 16px;
    }
}

@media screen and ${f} {
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
}`;var or={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},he=class extends v{constructor(e){super(e);l(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(jt,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});l(this,"toggleActionMenu",e=>{if(!this.actionMenuContentSlot||!e||e.type!=="click"&&e.code!=="Space"&&e.code!=="Enter")return;e.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});l(this,"toggleActionMenuFromCard",e=>{let r=e?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});l(this,"hideActionMenu",e=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return mt` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${tr()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":mt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?mt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return rr}setAriaExpanded(e,r){e.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};l(he,"variantStyle",ro`
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
    `);import{html as Pe}from"../lit-all.min.js";var nr=`
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

@media screen and ${f} {
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
`;var Qe=class extends v{constructor(t){super(t)}getGlobalCSS(){return nr}renderLayout(){return Pe`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?Pe`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:Pe`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?Pe`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:Pe`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as ir}from"../lit-all.min.js";var ar=`
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

@media screen and ${f} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${N} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Xe=class extends v{constructor(t){super(t)}getGlobalCSS(){return ar}renderLayout(){return ir` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":ir`<hr />`} ${this.secureLabelFooter}`}};import{html as me,css as oo,unsafeCSS as pt}from"../lit-all.min.js";var cr=`
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
@media screen and ${C} {
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

@media screen and ${Fe} {
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
@media screen and ${f} {
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

@media screen and ${N} {
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
`;var no=32,pe=class extends v{constructor(e){super(e);l(this,"getRowMinHeightPropertyName",e=>`--consonant-merch-card-footer-row-${e}-min-height`);l(this,"getMiniCompareFooter",()=>{let e=this.card.secureLabel?me`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:me`<slot name="secure-transaction-label"></slot>`;return me`<footer>${e}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return cr}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let e=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&e.push("footer-rows"),e.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let e=this.card.querySelector('[slot="footer-rows"] ul');!e||!e.children||[...e.children].forEach((r,n)=>{let a=Math.max(no,parseFloat(window.getComputedStyle(r).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let n=r.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${x}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(e){let r=this.mainPrice,n=this.headingMPriceSlot;if(!r&&n){let a=e?.getAttribute("plan-type"),i=null;if(e&&a&&(i=e.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),e.checked){if(i){let s=A("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},i.innerHTML);this.card.appendChild(s)}}else{let s=A("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(e.planType=n)}renderLayout(){return me` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?me`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:me`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(e=>e.onceSettled())),await this.adjustAddon(),Ue()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};l(pe,"variantStyle",oo`
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

    @media screen and ${pt(C)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${pt(Fe)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${pt(f)} {
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
  `);import{html as Re,css as ao,nothing as Ze}from"../lit-all.min.js";var sr=`
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
@media screen and ${C} {
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
@media screen and ${b} {
  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
  
  .columns.merch-card > .row {
      grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width) * 2 + var(--consonant-merch-spacing-m)));
  }
}

/* desktop */
@media screen and ${f} {
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
@media screen and ${N} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }

    merch-sidenav.plans {
        --merch-sidenav-collection-gap: 54px;
    }
}
`;var Je={title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},lr={...function(){let{whatsIncluded:o,size:t,...e}=Je;return e}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},dr={...function(){let{subtitle:o,whatsIncluded:t,size:e,quantitySelect:r,...n}=Je;return n}()},k=class extends v{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,e){t.dataset.template===Jt&&(e.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return sr}adjustSlotPlacement(t,e,r){let n=this.card.shadowRoot,a=n.querySelector("footer"),i=this.card.getAttribute("size"),s=n.querySelector(`footer slot[name="${t}"]`),d=n.querySelector(`.body slot[name="${t}"]`),p=n.querySelector(".body");if((!i||!i.includes("wide"))&&(a?.classList.remove("wide-footer"),s&&s.remove()),!!e.includes(i)){if(a?.classList.toggle("wide-footer",qe()),!r&&s){if(d)s.remove();else{let m=p.querySelector(`[data-placeholder-for="${t}"]`);m?m.replaceWith(s):p.appendChild(s)}return}if(r&&d){let m=document.createElement("div");if(m.setAttribute("data-placeholder-for",t),m.classList.add("slot-placeholder"),!s){let u=d.cloneNode(!0);a.prepend(u)}d.replaceWith(m)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],qe()),this.adjustSlotPlacement("callout-content",["super-wide"],qe())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let e=this.card.querySelector('[slot="body-xs"]');if(!e)return;let r=e.querySelector("ul");if(!r)return;let n=r.previousElementSibling,a=document.createElement("div");a.classList.add("spacer"),e.insertBefore(a,n);let i=this.card.querySelectorAll('[is="inline-price"][data-template="legal"]'),s=[];for(let p of i)s.push(p.onceSettled());await Promise.all(s);let d=new IntersectionObserver(([p])=>{if(p.boundingClientRect.height===0)return;let m=0,u=this.card.querySelector('[slot="heading-s"]');u&&(m+=ke(u));let S=this.card.querySelector('[slot="subtitle"]');S&&(m+=ke(S));let oe=this.card.querySelector('[slot="heading-m"]');oe&&(m+=8+ke(oe));for(let Nt of e.childNodes){if(Nt.classList.contains("spacer"))break;m+=ke(Nt)}let Gr=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");m>(parseFloat(Gr)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${m}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${m}px`),d.disconnect()});d.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),await this.adjustLegal(),await this.adjustEduLists()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${x}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Re`<div class="divider"></div>`:Ze}async adjustLegal(){if(await this.card.updateComplete,await customElements.whenDefined("inline-price"),this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],e=this.card.querySelector(`[slot="heading-m"] ${x}[data-template="price"]`);e&&t.push(e);let r=t.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling),await a.onceSettled())});await Promise.all(r)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let e=this.mainPrice;if(!e)return;await e.onceSettled();let r=e.value?.[0]?.planType;r&&(t.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?Re`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Ze}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Ze:Re`<slot name="icons"></slot>`}connectedCallbackHook(){let t=Be();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let e=He();e?.addEventListener&&e.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=Be();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let e=He();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMedia)}renderLayout(){return Re` ${this.badge}
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
            ${this.secureLabelFooter}`}};l(k,"variantStyle",ao`
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
    `),l(k,"collectionOptions",{customHeaderArea:t=>t.sidenav?Re`<slot name="resultsText"></slot>`:Ze,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as gt,css as io}from"../lit-all.min.js";var hr=`
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
@media screen and ${f} {
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
`;var ge=class extends v{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return hr}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(e=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${e}"]`),e))}renderLayout(){return gt` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":gt`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?gt`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Ue()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${x}[data-template="price"]`)}toggleAddon(t){let e=this.mainPrice,r=this.headingXSSlot;if(!e&&r){let n=t?.getAttribute("plan-type"),a=null;if(t&&n&&(a=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(i=>i.remove()),t.checked){if(a){let i=A("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(i)}}else{let i=A("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let e=this.mainPrice,r=this.card.planType;e&&(await e.onceSettled(),r=e.value?.[0]?.planType),r&&(t.planType=r)}};l(ge,"variantStyle",io`
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
    `);import{html as ut,css as co}from"../lit-all.min.js";var mr=`
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
@media screen and ${C} {
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
@media screen and ${f} {
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
`;var ue=class extends v{constructor(t){super(t)}getGlobalCSS(){return mr}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return ut` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":ut`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?ut`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};l(ue,"variantStyle",co`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as ft,css as so}from"../lit-all.min.js";var pr=`
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

@media screen and ${C} {
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
@media screen and ${f} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${N} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var gr={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},fe=class extends v{constructor(t){super(t)}getGlobalCSS(){return pr}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return ft`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?ft`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:ft`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};l(fe,"variantStyle",so`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{css as lo,html as ho}from"../lit-all.min.js";var ur=`
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
`;var fr={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},xe=class extends v{constructor(){super(...arguments);l(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return ur}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(e,r){r.literals={...r.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},r.space=!0,r.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let e=this.card.querySelector(`${x}[data-template="price"]`);if(!e)return;let r=e.cloneNode(!0);this.legal=r,e.dataset.displayTax="false",r.dataset.template="legal",r.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,r.setAttribute("slot","legal"),this.card.appendChild(r)}renderLayout(){return ho`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};l(xe,"variantStyle",lo`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
        }
    `);var xt=new Map,L=(o,t,e=null,r=null,n)=>{xt.set(o,{class:t,fragmentMapping:e,style:r,collectionOptions:n})};L("catalog",he,or,he.variantStyle);L("image",Qe);L("inline-heading",Xe);L("mini-compare-chart",pe,null,pe.variantStyle);L("plans",k,Je,k.variantStyle,k.collectionOptions);L("plans-students",k,dr,k.variantStyle,k.collectionOptions);L("plans-education",k,lr,k.variantStyle,k.collectionOptions);L("product",ge,null,ge.variantStyle);L("segment",ue,null,ue.variantStyle);L("special-offers",fe,gr,fe.variantStyle);L("mini",xe,fr,xe.variantStyle);var bt=o=>{let t=xt.get(o.variant);if(!t)return;let{class:e,style:r}=t;if(r)try{let n=new CSSStyleSheet;n.replaceSync(r.cssText),o.shadowRoot.adoptedStyleSheets.push(n)}catch{let a=document.createElement("style");a.textContent=r.cssText,o.shadowRoot.appendChild(a)}return new e(o)};function We(o){return xt.get(o)?.fragmentMapping}var xr=document.createElement("style");xr.innerHTML=`
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

@media screen and ${f} {
    .four-merch-cards {
        grid-template-columns: repeat(4, var(--merch-card-collection-card-width));
    }

    .three-merch-cards,
    merch-sidenav ~ .four-merch-cards {
        grid-template-columns: repeat(3, var(--merch-card-collection-card-width));
    }
}

@media screen and ${N} {
    .four-merch-cards,
    merch-sidenav ~ .four-merch-cards {
        grid-template-columns: repeat(4, var(--merch-card-collection-card-width));
    }
}

`;document.head.appendChild(xr);function et(o,t={},{metadata:e=!0,search:r=!0,storage:n=!0}={}){let a;if(r&&a==null){let i=new URLSearchParams(window.location.search),s=vt(r)?r:o;a=i.get(s)}if(n&&a==null){let i=vt(n)?n:o;a=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(e&&a==null){let i=po(vt(e)?e:o);a=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return a??t[o]}var mo=o=>typeof o=="boolean",tt=o=>typeof o=="function";var vt=o=>typeof o=="string";function br(o,t){if(mo(o))return o;let e=String(o);return e==="1"||e==="true"?!0:e==="0"||e==="false"?!1:t}function po(o=""){return String(o).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,e,r)=>`${e}-${r}`).replace(/\W+/gu,"-").toLowerCase()}var K=class o extends Error{constructor(t,e,r){if(super(t,{cause:r}),this.name="MasError",e.response){let n=e.response.headers?.get(je);n&&(e.requestId=n),e.response.status&&(e.status=e.response.status,e.statusText=e.response.statusText),e.response.url&&(e.url=e.response.url)}delete e.response,this.context=e,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let t=Object.entries(this.context||{}).map(([r,n])=>`${r}: ${JSON.stringify(n)}`).join(", "),e=`${this.name}: ${this.message}`;return t&&(e+=` (${t})`),this.cause&&(e+=`
Caused by: ${this.cause}`),e}};var go="mas-commerce-service",uo={requestId:je,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};var rt=o=>window.setTimeout(o);function yt(){return document.getElementsByTagName(go)?.[0]}function vr(o){let t={};if(!o?.headers)return t;let e=o.headers;for(let[r,n]of Object.entries(uo)){let a=e.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),t[r]=a)}return t}async function yr(o,t={},e=2,r=100){let n;for(let a=0;a<=e;a++)try{let i=await fetch(o,t);return i.retryCount=a,i}catch(i){if(n=i,n.retryCount=a,a>e)break;await new Promise(s=>setTimeout(s,r*(a+1)))}throw n}var Er="fragment",wr="author",Sr="preview",Ar="loading",kr="timeout",Et="aem-fragment",Tr="eager",Cr="cache",fo=[Tr,Cr],z,W,P,wt=class{constructor(){g(this,z,new Map);g(this,W,new Map);g(this,P,new Map)}clear(){c(this,z).clear(),c(this,W).clear(),c(this,P).clear()}add(t){if(!this.has(t.id)&&!this.has(t.fields?.originalId)){if(c(this,z).set(t.id,t),t.fields?.originalId&&c(this,z).set(t.fields.originalId,t),c(this,P).has(t.id)){let[,e]=c(this,P).get(t.id);e()}if(c(this,P).has(t.fields?.originalId)){let[,e]=c(this,P).get(t.fields?.originalId);e()}if(t.references)for(let e in t.references){let{type:r,value:n}=t.references[e];r==="content-fragment"&&(n.settings={...t?.settings,...n.settings},n.placeholders={...t?.placeholders,...n.placeholders},n.dictionary={...t?.dictionary,...n.dictionary},n.priceLiterals={...t?.priceLiterals,...n.priceLiterals},this.add(n,t))}}}has(t){return c(this,z).has(t)}entries(){return c(this,z).entries()}get(t){return c(this,z).get(t)}getAsPromise(t){let[e]=c(this,P).get(t)??[];if(e)return e;let r;return e=new Promise(n=>{r=n,this.has(t)&&n()}),c(this,P).set(t,[e,r]),e}getFetchInfo(t){let e=c(this,W).get(t);return e||(e={url:null,retryCount:0,stale:!1,measure:null,status:null},c(this,W).set(t,e)),e}remove(t){c(this,z).delete(t),c(this,W).delete(t),c(this,P).delete(t)}};z=new WeakMap,W=new WeakMap,P=new WeakMap;var q=new wt,be,$,D,_,T,y,Me,Oe,R,Ne,ze,ve,M,Lr,_r,St,Pr,ot=class extends HTMLElement{constructor(){super(...arguments);g(this,M);l(this,"cache",q);g(this,be);g(this,$,null);g(this,D,null);g(this,_,null);g(this,T);g(this,y);g(this,Me,Tr);g(this,Oe,5e3);g(this,R);g(this,Ne,!1);g(this,ze,0);g(this,ve)}static get observedAttributes(){return[Er,Ar,kr,wr,Sr]}attributeChangedCallback(e,r,n){e===Er&&(h(this,T,n),h(this,y,q.getFetchInfo(n))),e===Ar&&fo.includes(n)&&h(this,Me,n),e===kr&&h(this,Oe,parseInt(n,10)),e===wr&&h(this,Ne,["","true"].includes(n)),e===Sr&&h(this,ve,n)}connectedCallback(){if(!c(this,R)){if(c(this,_)??h(this,_,V(this)),h(this,ve,c(this,_).settings?.preview),c(this,be)??h(this,be,c(this,_).log.module(`${Et}[${c(this,T)}]`)),!c(this,T)||c(this,T)==="#"){c(this,y)??h(this,y,q.getFetchInfo("missing-fragment-id")),w(this,M,St).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(c(this,y)).filter(([e,r])=>r!=null).map(([e,r])=>[`aem-fragment:${e}`,r]))}async refresh(e=!0){if(c(this,R)&&!await Promise.race([c(this,R),Promise.resolve(!1)]))return;e&&q.remove(c(this,T)),c(this,Me)===Cr&&await Promise.race([q.getAsPromise(c(this,T)),new Promise(s=>setTimeout(s,c(this,Oe)))]);try{h(this,R,w(this,M,Pr).call(this)),await c(this,R)}catch(s){return w(this,M,St).call(this,s.message),!1}let{references:r,referencesTree:n,placeholders:a,wcs:i}=c(this,$)||{};return i&&!et("mas.disableWcsCache")&&c(this,_).prefillWcsCache(i),this.dispatchEvent(new CustomEvent(ae,{detail:{...this.data,references:r,referencesTree:n,placeholders:a,...c(this,y)},bubbles:!0,composed:!0})),c(this,R)}get updateComplete(){return c(this,R)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return c(this,D)?c(this,D):(c(this,Ne)?this.transformAuthorData():this.transformPublishData(),c(this,D))}transformAuthorData(){let{fields:e,id:r,tags:n,settings:a={},priceLiterals:i={},dictionary:s={},placeholders:d={}}=c(this,$);h(this,D,e.reduce((p,{name:m,multiple:u,values:S})=>(p.fields[m]=u?S:S[0],p),{fields:{},id:r,tags:n,settings:a,priceLiterals:i,dictionary:s,placeholders:d}))}transformPublishData(){let{fields:e,id:r,tags:n,settings:a={},priceLiterals:i={},dictionary:s={},placeholders:d={}}=c(this,$);h(this,D,Object.entries(e).reduce((p,[m,u])=>(p.fields[m]=u?.mimeType?u.value:u??"",p),{fields:{},id:r,tags:n,settings:a,priceLiterals:i,dictionary:s,placeholders:d}))}getFragmentClientUrl(){let r=new URLSearchParams(window.location.search).get("maslibs");if(!r||r.trim()==="")return"https://mas.adobe.com/studio/libs/fragment-client.js";let n=r.trim().toLowerCase();if(n==="local")return"http://localhost:3030/studio/libs/fragment-client.js";let{hostname:a}=window.location,i=a.endsWith(".page")?"page":"live";return n.includes("--")?`https://${n}.aem.${i}/studio/libs/fragment-client.js`:`https://${n}--mas--adobecom.aem.${i}/studio/libs/fragment-client.js`}async generatePreview(){let e=this.getFragmentClientUrl(),{previewFragment:r}=await import(e);return await r(c(this,T),{locale:c(this,_).settings.locale,apiKey:c(this,_).settings.wcsApiKey})}};be=new WeakMap,$=new WeakMap,D=new WeakMap,_=new WeakMap,T=new WeakMap,y=new WeakMap,Me=new WeakMap,Oe=new WeakMap,R=new WeakMap,Ne=new WeakMap,ze=new WeakMap,ve=new WeakMap,M=new WeakSet,Lr=async function(e){$t(this,ze)._++;let r=`${Et}:${c(this,T)}:${c(this,ze)}`,n=`${r}${Ge}`,a=`${r}${Ve}`;if(c(this,ve))return await this.generatePreview();performance.mark(n);let i;try{if(c(this,y).stale=!1,c(this,y).url=e,i=await yr(e,{cache:"default",credentials:"omit"}),w(this,M,_r).call(this,i),c(this,y).status=i?.status,c(this,y).measure=ce(performance.measure(a,n)),c(this,y).retryCount=i.retryCount,!i?.ok)throw new K("Unexpected fragment response",{response:i,...c(this,_).duration});return await i.json()}catch(s){if(c(this,y).measure=ce(performance.measure(a,n)),c(this,y).retryCount=s.retryCount,c(this,$))return c(this,y).stale=!0,c(this,be).error("Serving stale data",c(this,y)),c(this,$);let d=s.message??"unknown";throw new K(`Failed to fetch fragment: ${d}`,{})}},_r=function(e){Object.assign(c(this,y),vr(e))},St=function(e){h(this,R,null),c(this,y).message=e,this.classList.add("error");let r={...c(this,y),...c(this,_).duration};c(this,be).error(e,r),this.dispatchEvent(new CustomEvent(ie,{detail:r,bubbles:!0,composed:!0}))},Pr=async function(){var s;this.classList.remove("error"),h(this,D,null);let e=q.get(c(this,T));if(e)return h(this,$,e),!0;let{masIOUrl:r,wcsApiKey:n,locale:a}=c(this,_).settings,i=`${r}/fragment?id=${c(this,T)}&api_key=${n}&locale=${a}`;return e=await w(this,M,Lr).call(this,i),(s=e.fields).originalId??(s.originalId=c(this,T)),q.add(e),h(this,$,e),!0},l(ot,"cache",q);customElements.define(Et,ot);import{LitElement as xo,html as bo,css as vo}from"../lit-all.min.js";var ye=class extends xo{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return bo`<div class="badge">
            ${this.text}
        </div>`}};l(ye,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),l(ye,"styles",vo`
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
    `);customElements.define("merch-badge",ye);import{html as yo,css as Eo,LitElement as wo}from"../lit-all.min.js";var $e=class extends wo{constructor(){super()}render(){return yo`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};l($e,"styles",Eo`
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
    `),l($e,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",$e);import{html as At,css as So,LitElement as Ao}from"../lit-all.min.js";var Ie=class extends Ao{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,e)=>{e>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return At`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?At`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:At``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};l(Ie,"styles",So`
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
    `),l(Ie,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",Ie);var Q={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Rr=1e3;function ko(o){return o instanceof Error||typeof o?.originatingRequest=="string"}function Mr(o){if(o==null)return;let t=typeof o;if(t==="function")return o.name?`function ${o.name}`:"function";if(t==="object"){if(o instanceof Error)return o.message;if(typeof o.originatingRequest=="string"){let{message:r,originatingRequest:n,status:a}=o;return[r,a,n].filter(Boolean).join(" ")}let e=o[Symbol.toStringTag]??Object.getPrototypeOf(o).constructor.name;if(!Q.serializableTypes.includes(e))return e}return o}function To(o,t){if(!Q.ignoredProperties.includes(o))return Mr(t)}var kt={append(o){if(o.level!=="error")return;let{message:t,params:e}=o,r=[],n=[],a=t;e.forEach(p=>{p!=null&&(ko(p)?r:n).push(p)}),r.length&&(a+=" "+r.map(Mr).join(" "));let{pathname:i,search:s}=window.location,d=`${Q.delimiter}page=${i}${s}`;d.length>Rr&&(d=`${d.slice(0,Rr)}<trunc>`),a+=d,n.length&&(a+=`${Q.delimiter}facts=`,a+=JSON.stringify(n,To)),window.lana?.log(a,Q)}};function Or(o){Object.assign(Q,Object.fromEntries(Object.entries(o).filter(([t,e])=>t in Q&&e!==""&&e!==null&&e!==void 0&&!Number.isNaN(e))))}var Nr={LOCAL:"local",PROD:"prod",STAGE:"stage"},Tt={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Ct=new Set,Lt=new Set,zr=new Map,$r={append({level:o,message:t,params:e,timestamp:r,source:n}){console[o](`${r}ms [${n}] %c${t}`,"font-weight: bold;",...e)}},Ir={filter:({level:o})=>o!==Tt.DEBUG},Co={filter:()=>!1};function Lo(o,t,e,r,n){return{level:o,message:t,namespace:e,get params(){return r.length===1&&tt(r[0])&&(r=r[0](),Array.isArray(r)||(r=[r])),r},source:n,timestamp:performance.now().toFixed(3)}}function _o(o){[...Lt].every(t=>t(o))&&Ct.forEach(t=>t(o))}function Dr(o){let t=(zr.get(o)??0)+1;zr.set(o,t);let e=`${o} #${t}`,r={id:e,namespace:o,module:n=>Dr(`${r.namespace}/${n}`),updateConfig:Or};return Object.values(Tt).forEach(n=>{r[n]=(a,...i)=>_o(Lo(n,a,o,i,e))}),Object.seal(r)}function nt(...o){o.forEach(t=>{let{append:e,filter:r}=t;tt(r)&&Lt.add(r),tt(e)&&Ct.add(e)})}function Po(o={}){let{name:t}=o,e=br(et("commerce.debug",{search:!0,storage:!0}),t===Nr.LOCAL);return nt(e?$r:Ir),t===Nr.PROD&&nt(kt),_t}function Ro(){Ct.clear(),Lt.clear()}var _t={...Dr(Zt),Level:Tt,Plugins:{consoleAppender:$r,debugFilter:Ir,quietFilter:Co,lanaAppender:kt},init:Po,reset:Ro,use:nt};var Mo={[H]:Kt,[G]:Wt,[U]:Qt},Oo={[H]:Xt,[U]:Ae},De,at=class{constructor(t){g(this,De);l(this,"changes",new Map);l(this,"connected",!1);l(this,"error");l(this,"log");l(this,"options");l(this,"promises",[]);l(this,"state",G);l(this,"timer",null);l(this,"value");l(this,"version",0);l(this,"wrapperElement");this.wrapperElement=t,this.log=_t.module("mas-element")}update(){[H,G,U].forEach(t=>{this.wrapperElement.classList.toggle(Mo[t],t===this.state)})}notify(){(this.state===U||this.state===H)&&(this.state===U?this.promises.forEach(({resolve:e})=>e(this.wrapperElement)):this.state===H&&this.promises.forEach(({reject:e})=>e(this.error)),this.promises=[]);let t=this.error;this.error instanceof K&&(t={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Oo[this.state],{bubbles:!0,detail:t}))}attributeChangedCallback(t,e,r){this.changes.set(t,r),this.requestUpdate()}connectedCallback(){h(this,De,yt()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:t,promises:e,state:r}=this;return U===r?Promise.resolve(this.wrapperElement):H===r?Promise.reject(t):new Promise((n,a)=>{e.push({resolve:n,reject:a})})}toggleResolved(t,e,r){return t!==this.version?!1:(r!==void 0&&(this.options=r),this.state=U,this.value=e,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:e}),rt(()=>this.notify()),!0)}toggleFailed(t,e,r){if(t!==this.version)return!1;r!==void 0&&(this.options=r),this.error=e,this.state=H,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${e.message}`,{element:this.wrapperElement,...e.context,...c(this,De)?.duration}),rt(()=>this.notify()),!0}togglePending(t){return this.version++,t&&(this.options=t),this.state=G,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!yt()||this.timer)return;let{error:e,options:r,state:n,value:a,version:i}=this;this.state=G,this.timer=rt(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||t)try{await this.wrapperElement.render?.()===!1&&this.state===G&&this.version===i&&(this.state=n,this.error=e,this.value=a,this.update(),this.notify())}catch(d){this.toggleFailed(this.version,d,r)}})}};De=new WeakMap;function No(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Z,X=class X extends HTMLAnchorElement{constructor(){super();l(this,"masElement",new at(this));g(this,Z);this.setAttribute("is",X.is)}get isUptLink(){return!0}initializeWcsData(e,r){this.setAttribute("data-wcs-osi",e),r&&this.setAttribute("data-promotion-code",r)}attributeChangedCallback(e,r,n){this.masElement.attributeChangedCallback(e,r,n)}connectedCallback(){this.masElement.connectedCallback(),h(this,Z,V()),c(this,Z)&&(this.log=c(this,Z).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),h(this,Z,void 0)}requestUpdate(e=!1){this.masElement.requestUpdate(e)}onceSettled(){return this.masElement.onceSettled()}async render(){let e=V();if(!e)return!1;this.dataset.imsCountry||e.imsCountryPromise.then(i=>{i&&(this.dataset.imsCountry=i)});let r=e.collectCheckoutOptions({},this);if(!r.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(r),a=e.resolveOfferSelectors(r);try{let[[i]]=await Promise.all(a),{country:s,language:d,env:p}=r,m=`locale=${d}_${s}&country=${s}&offer_id=${i.offerId}`,u=this.getAttribute("data-promotion-code");u&&(m+=`&promotion_code=${encodeURIComponent(u)}`),this.href=`${No(p)}?${m}`,this.masElement.toggleResolved(n,i,r)}catch(i){let s=new Error(`Could not resolve offer selectors for id: ${r.wcsOsi}.`,i.message);return this.masElement.toggleFailed(n,s,r),!1}}static createFrom(e){let r=new X;for(let n of e.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?r.setAttribute("class",n.value.replace("upt-link","").trim()):r.setAttribute(n.name,n.value));return r.innerHTML=e.innerHTML,r.setAttribute("tabindex",0),r}};Z=new WeakMap,l(X,"is","upt-link"),l(X,"tag","a"),l(X,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var j=X;window.customElements.get(j.is)||window.customElements.define(j.is,j,{extends:j.tag});var zo="#000000",Pt="#F8D904",$o="#EAEAEA",Io="#31A547",Do=/(accent|primary|secondary)(-(outline|link))?/,Fo="mas:product_code/",Bo="daa-ll",it="daa-lh",Ho=["XL","L","M","S"],Rt="...";function O(o,t,e,r){let n=r[o];if(t[o]&&n){let a={slot:n?.slot},i=t[o];if(n.maxCount&&typeof i=="string"){let[d,p]=on(i,n.maxCount,n.withSuffix);d!==i&&(a.title=p,i=d)}let s=A(n.tag,a,i);e.append(s)}}function Uo(o,t,e){let r=o.mnemonicIcon?.map((a,i)=>({icon:a,alt:o.mnemonicAlt[i]??"",link:o.mnemonicLink[i]??""}));r?.forEach(({icon:a,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let d={slot:"icons",src:a,loading:t.loading,size:e?.size??"l"};i&&(d.alt=i),s&&(d.href=s);let p=A("merch-icon",d);t.append(p)});let n=t.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&n&&n.remove()}function qo(o,t,e){if(e.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=Pt,n=!1;e.allowedBadgeColors?.includes(e.badge?.default)&&(r=e.badge?.default,o.borderColor||(n=!0));let a=o.badgeBackgroundColor||r,i=o.borderColor||"";n&&(i=e.badge?.default,o.borderColor=e.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${a}" border-color="${i}">${o.badge}</merch-badge>`}O("badge",o,t,e)}else o.badge?(t.setAttribute("badge-text",o.badge),t.setAttribute("badge-color",o.badgeColor||zo),t.setAttribute("badge-background-color",o.badgeBackgroundColor||Pt),t.setAttribute("border-color",o.badgeBackgroundColor||Pt)):t.setAttribute("border-color",o.borderColor||$o)}function jo(o,t,e){if(e.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||Io;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}O("trialBadge",o,t,e)}}function Go(o,t,e){e?.includes(o.size)&&t.setAttribute("size",o.size)}function Vo(o,t,e){O("cardTitle",o,t,{cardTitle:e})}function Yo(o,t,e){O("subtitle",o,t,e)}function Ko(o,t,e,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}e?.[o.backgroundColor]?(t.style.setProperty("--merch-card-custom-background-color",`var(${e[o.backgroundColor]})`),t.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(t.setAttribute(r.attribute,o.backgroundColor),t.style.removeProperty("--merch-card-custom-background-color"))}function Wo(o,t,e){let r=e?.borderColor,n="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(n),e?.allowedBorderColors?.includes(e?.badge?.default)&&t.style.setProperty(n,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(t.setAttribute("gradient-border","true"),t.style.removeProperty(n)):t.style.setProperty(n,`var(--${o.borderColor})`))}function Qo(o,t,e){if(o.backgroundImage){let r={loading:t.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!e)return;if(e?.attribute){t.setAttribute(e.attribute,o.backgroundImage);return}t.append(A(e.tag,{slot:e.slot},A("img",r)))}}function Xo(o,t,e){O("prices",o,t,e)}function Br(o,t,e){let r=o.hasAttribute("data-wcs-osi")&&!!o.getAttribute("data-wcs-osi"),n=o.className||"",a=Do.exec(n)?.[0]??"accent",i=a.includes("accent"),s=a.includes("primary"),d=a.includes("secondary"),p=a.includes("-outline"),m=a.includes("-link");o.classList.remove("accent","primary","secondary");let u;if(t.consonant)u=sn(o,i,r,m);else if(m)u=o;else{let S;i?S="accent":s?S="primary":d&&(S="secondary"),u=t.spectrum==="swc"?cn(o,e,p,S,r):an(o,e,p,S,r)}return u}function Zo(o,t){let{slot:e}=t?.description,r=o.querySelectorAll(`[slot="${e}"] a[data-wcs-osi]`);r.length&&r.forEach(n=>{let a=Br(n,o,t);n.replaceWith(a)})}function Jo(o,t,e){O("promoText",o,t,e),O("description",o,t,e),Zo(t,e),O("callout",o,t,e),O("quantitySelect",o,t,e),O("whatsIncluded",o,t,e)}function en(o,t,e){if(!e.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let n=A("merch-addon",{slot:"addon"},r);[...n.querySelectorAll(x)].forEach(a=>{let i=a.parentElement;i?.nodeName==="P"&&i.setAttribute("data-plan-type","")}),t.append(n)}function tn(o,t,e){o.addonConfirmation&&O("addonConfirmation",o,t,e)}function rn(o,t,e,r){r?.secureLabel&&e?.secureLabel&&t.setAttribute("secure-label",r.secureLabel)}function on(o,t,e=!0){try{let r=typeof o!="string"?"":o,n=Fr(r);if(n.length<=t)return[r,n];let a=0,i=!1,s=e?t-Rt.length<1?1:t-Rt.length:t,d=[];for(let u of r){if(a++,u==="<")if(i=!0,r[a]==="/")d.pop();else{let S="";for(let oe of r.substring(a)){if(oe===" "||oe===">")break;S+=oe}d.push(S)}if(u==="/"&&r[a]===">"&&d.pop(),u===">"){i=!1;continue}if(!i&&(s--,s===0))break}let p=r.substring(0,a).trim();if(d.length>0){d[0]==="p"&&d.shift();for(let u of d.reverse())p+=`</${u}>`}return[`${p}${e?Rt:""}`,n]}catch{let n=typeof o=="string"?o:"",a=Fr(n);return[n,a]}}function Fr(o){if(!o)return"";let t="",e=!1;for(let r of o){if(r==="<"&&(e=!0),r===">"){e=!1;continue}e||(t+=r)}return t}function nn(o,t){t.querySelectorAll("a.upt-link").forEach(r=>{let n=j.createFrom(r);r.replaceWith(n),n.initializeWcsData(o.osi,o.promoCode)})}function an(o,t,e,r,n){let a=o;n?a=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):a.innerHTML=`<span>${a.textContent}</span>`,a.setAttribute("tabindex",0);for(let m of o.attributes)["class","is"].includes(m.name)||a.setAttribute(m.name,m.value);a.firstElementChild?.classList.add("spectrum-Button-label");let i=t?.ctas?.size??"M",s=`spectrum-Button--${r}`,d=Ho.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",p=["spectrum-Button",s,d];return e&&p.push("spectrum-Button--outline"),a.classList.add(...p),a}function cn(o,t,e,r,n){let a=o;n&&(a=customElements.get("checkout-button").createCheckoutButton(o.dataset),a.connectedCallback(),a.render());let i="fill";e&&(i="outline");let s=A("sp-button",{treatment:i,variant:r,tabIndex:0,size:t?.ctas?.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return s.source=a,(n?a.onceSettled():Promise.resolve(a)).then(d=>{s.setAttribute("data-navigation-url",d.href)}),s.addEventListener("click",d=>{d.defaultPrevented||a.click()}),s}function sn(o,t,e,r){let n=o;return e&&(n=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r||(n.classList.add("con-button"),t&&n.classList.add("blue")),n}function ln(o,t,e,r){if(o.ctas){let{slot:n}=e.ctas,a=A("div",{slot:n},o.ctas),i=[...a.querySelectorAll("a")].map(s=>Br(s,t,e));a.innerHTML="",a.append(...i),t.append(a)}}function dn(o,t){let{tags:e}=o,r=e?.find(a=>a.startsWith(Fo))?.split("/").pop();if(!r)return;t.setAttribute(it,r),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((a,i)=>{a.setAttribute(Bo,`${a.dataset.analyticsId}-${i+1}`)})}function hn(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,e])=>{o.querySelectorAll(`a.${t}`).forEach(r=>{r.classList.remove(t),r.classList.add("spectrum-Link",`spectrum-Link--${e}`)})})}function mn(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",it].forEach(r=>o.removeAttribute(r));let e=["wide-strip","thin-strip"];o.classList.remove(...e)}async function Hr(o,t){if(!o){let d=t?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${d}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${d}).`)}if(!o.fields){let d=o.id||"unknown",p=t?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${d}' (merchCard id: ${p}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${d}' (merchCard id: ${p}) is missing 'fields'.`)}let{id:e,fields:r,settings:n={},priceLiterals:a}=o,{variant:i}=r;if(!i)throw new Error(`hydrate: no variant found in payload ${e}`);mn(t),t.settings=n,a&&(t.priceLiterals=a),t.id??(t.id=o.id),t.variant=i,await t.updateComplete;let{aemFragmentMapping:s}=t.variantLayout;if(!s)throw new Error(`hydrate: variant mapping not found for ${e}`);s.style==="consonant"&&t.setAttribute("consonant",!0),Uo(r,t,s.mnemonics),qo(r,t,s),jo(r,t,s),Go(r,t,s.size),Vo(r,t,s.title),Yo(r,t,s),Xo(r,t,s),Qo(r,t,s.backgroundImage),Ko(r,t,s.allowedColors,s.backgroundColor),Wo(r,t,s),Jo(r,t,s),en(r,t,s),tn(r,t,s),rn(r,t,s,n),nn(r,t),ln(r,t,s,i),dn(r,t),hn(t)}var Ot="merch-card",Mt=2e4,Ur="merch-card:";function qr(o,t){let e=o.closest(Ot);if(!e)return t;e.priceLiterals&&(t.literals??(t.literals={}),Object.assign(t.literals,e.priceLiterals)),e.variantLayout?.priceOptionsProvider?.(o,t)}function gn(o){o.providers.has(qr)||o.providers.price(qr)}var un=0,Ee,we,Se,F,te,I,re,E,ee,ct,jr,st,J=class extends pn{constructor(){super();g(this,E);g(this,Ee);g(this,we);g(this,Se);g(this,F);g(this,te);g(this,I);g(this,re,new Promise(e=>{h(this,I,e)}));l(this,"customerSegment");l(this,"marketSegment");l(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=bt(this),this.variantLayout?.connectedCallbackHook()}willUpdate(e){(e.has("variant")||!this.variantLayout)&&(this.variantLayout=bt(this),this.variantLayout?.connectedCallbackHook())}updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),e.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayoutPromise=this.variantLayout?.postCardUpdateHook(e)}catch(r){w(this,E,ee).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(x)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(B)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(B)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(B)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let n of r){await n.onceSettled();let a=n.value?.[0]?.planType;if(!a)return;let i=this.stockOfferOsis[a];if(!i)return;let s=n.dataset.wcsOsi.split(",").filter(d=>d!==i);e.checked&&s.push(i),n.dataset.wcsOsi=s.join(",")}}changeHandler(e){e.target.tagName==="MERCH-ADDON"&&this.toggleAddon(e.target)}toggleAddon(e){this.variantLayout?.toggleAddon?.(e);let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length===0)return;let n=a=>{let{offerType:i,planType:s}=a.value?.[0]??{};if(!i||!s)return;let d=e.getOsi(s,i),p=(a.dataset.wcsOsi||"").split(",").filter(m=>m&&m!==d);e.checked&&p.push(d),a.dataset.wcsOsi=p.join(",")};r.forEach(n)}handleQuantitySelection(e){let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length!==0)for(let n of r)n.dataset.quantity=e.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let r={...this.filters};Object.keys(r).forEach(n=>{if(e){r[n].order=Math.min(r[n].order||2,2);return}let a=r[n].order;a===1||isNaN(a)||(r[n].order=Number(a)+1)}),this.filters=r}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}connectedCallback(){var r;super.connectedCallback(),c(this,we)||h(this,we,un++),this.aemFragment||((r=c(this,I))==null||r.call(this),h(this,I,void 0)),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let e=this.id??c(this,we);h(this,te,`${Ur}${e}${Ge}`),h(this,Ee,`${Ur}${e}${Ve}`),performance.mark(c(this,te)),h(this,F,V()),gn(c(this,F)),h(this,Se,c(this,F).Log.module(Ot)),this.addEventListener(dt,this.handleQuantitySelection),this.addEventListener(ht,this.handleAddonAndQuantityUpdate),this.addEventListener(qt,this.handleMerchOfferSelectReady),this.addEventListener(ie,this.handleAemFragmentEvents),this.addEventListener(ae,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(dt,this.handleQuantitySelection),this.removeEventListener(ie,this.handleAemFragmentEvents),this.removeEventListener(ae,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(ht,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(e){var r;if(this.isConnected&&(e.type===ie&&w(this,E,ee).call(this,"AEM fragment cannot be loaded"),e.type===ae&&(this.failed=!1,e.target.nodeName==="AEM-FRAGMENT"))){let n=e.detail;try{c(this,I)||h(this,re,new Promise(a=>{h(this,I,a)})),Hr(n,this)}catch(a){w(this,E,ee).call(this,`hydration has failed: ${a.message}`)}finally{(r=c(this,I))==null||r.call(this),h(this,I,void 0)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;c(this,re)&&(await c(this,re),h(this,re,void 0)),this.variantLayoutPromise&&(await this.variantLayoutPromise,this.variantLayoutPromise=void 0);let e=new Promise(i=>setTimeout(()=>i("timeout"),Mt));if(this.aemFragment){let i=await Promise.race([this.aemFragment.updateComplete,e]);if(i===!1||i==="timeout"){let s=i==="timeout"?`AEM fragment was not resolved within ${Mt} timeout`:"AEM fragment cannot be loaded";w(this,E,ee).call(this,s,{},!1);return}}let r=[...this.querySelectorAll(Ut)],n=Promise.all(r.map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),a=await Promise.race([n,e]);if(a===!0){this.measure=performance.measure(c(this,Ee),c(this,te));let i={...this.aemFragment?.fetchInfo,...c(this,F).duration,measure:ce(this.measure)};return this.dispatchEvent(new CustomEvent(Vt,{bubbles:!0,composed:!0,detail:i})),this}else{this.measure=performance.measure(c(this,Ee),c(this,te));let i={measure:ce(this.measure),...c(this,F).duration};a==="timeout"?w(this,E,ee).call(this,`Contains offers that were not resolved within ${Mt} timeout`,i):w(this,E,ee).call(this,"Contains unresolved offers",i)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let e=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(B)).length===2&&e&&e.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:e,items:r}}){if(!e||!r?.length||this.closest('[role="tabpanel"][hidden="true"]'))return;let a=this.checkoutLinks.find(m=>m.getAttribute("data-modal-id")===e);if(!a)return;let s=new URL(a.getAttribute("href")).searchParams.get("pa"),d=r.find(m=>m.productArrangementCode===s)?.quantity,p=!!r.find(m=>m.productArrangementCode!==s);if(d&&this.quantitySelect?.dispatchEvent(new CustomEvent(Gt,{detail:{quantity:d},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==p){this.toggleStockOffer({target:this.addonCheckbox});let m=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(m,"target",{writable:!1,value:{checked:p}}),this.addonCheckbox.handleChange(m)}}get prices(){return Array.from(this.querySelectorAll(x))}get promoPrice(){if(!this.querySelector("span.price-strikethrough"))return;let e=this.querySelector(".price.price-alternative");if(e||(e=this.querySelector(`${x}[data-template="price"] > span`)),!!e)return e=e.innerText,e}get regularPrice(){return c(this,E,ct)?.innerText}get promotionCode(){let e=[...this.querySelectorAll(`${x}[data-promotion-code],${B}[data-promotion-code]`)].map(n=>n.dataset.promotionCode),r=[...new Set(e)];return r.length>1&&c(this,Se)?.warn(`Multiple different promotion codes found: ${r.join(", ")}`),e[0]}get annualPrice(){return this.querySelector(`${x}[data-template="price"] > .price.price-annual`)?.innerText}get promoText(){}get taxText(){return(c(this,E,jr)??c(this,E,ct))?.querySelector("span.price-tax-inclusivity")?.textContent?.trim()||void 0}get recurrenceText(){return c(this,E,ct)?.querySelector("span.price-recurrence")?.textContent?.trim()}get planTypeText(){return this.querySelector('[is="inline-price"][data-template="legal"] span.price-plan-type')?.textContent?.trim()}get seeTermsInfo(){let e=this.querySelector('a[is="upt-link"]');if(e)return w(this,E,st).call(this,e)}get renewalText(){return this.querySelector("span.renewal-text")?.textContent?.trim()}get promoDurationText(){return this.querySelector("span.promo-duration-text")?.textContent?.trim()}get ctas(){return Array.from(this.querySelector('[slot="ctas"], [slot="footer"]')?.querySelectorAll(`${B}, a`))}get primaryCta(){return w(this,E,st).call(this,this.ctas.find(e=>e.variant==="accent"||e.matches(".spectrum-Button--accent,.con-button.blue")))}get secondaryCta(){return w(this,E,st).call(this,this.ctas.find(e=>e.variant!=="accent"&&!e.matches(".spectrum-Button--accent,.con-button.blue")))}};Ee=new WeakMap,we=new WeakMap,Se=new WeakMap,F=new WeakMap,te=new WeakMap,I=new WeakMap,re=new WeakMap,E=new WeakSet,ee=function(e,r={},n=!0){if(!this.isConnected)return;let i=this.aemFragment?.getAttribute("fragment");i=`[${i}]`;let s={...this.aemFragment.fetchInfo,...c(this,F).duration,...r,message:e};c(this,Se).error(`merch-card${i}: ${e}`,s),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Yt,{bubbles:!0,composed:!0,detail:s}))},ct=function(){return this.querySelector("span.price-strikethrough")??this.querySelector(`${x}[data-template="price"] > span`)},jr=function(){return this.querySelector(`${x}[data-template="legal"]`)},st=function(e){if(e)return{text:e.innerText.trim(),analyticsId:e.dataset.analyticsId,href:e.getAttribute("href")??e.dataset.href}},l(J,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{if(!e)return;let[r,n,a]=e.split(",");return{PUF:r,ABM:n,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(r=>{let[n,a,i]=r.split(":"),s=Number(a);return[n,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:e=>Object.entries(e).map(([r,{order:n,size:a}])=>[r,n,a].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:it,reflect:!0},loading:{type:String},priceLiterals:{type:Object}}),l(J,"styles",[Ft,...Bt()]),l(J,"registerVariant",L),l(J,"getFragmentMapping",We);customElements.define(Ot,J);export{J as MerchCard};

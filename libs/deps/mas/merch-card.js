var Gr=Object.defineProperty;var Ne=o=>{throw TypeError(o)};var Vr=(o,e,t)=>e in o?Gr(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var l=(o,e,t)=>Vr(o,typeof e!="symbol"?e+"":e,t),de=(o,e,t)=>e.has(o)||Ne("Cannot "+t);var c=(o,e,t)=>(de(o,e,"read from private field"),t?t.call(o):e.get(o)),u=(o,e,t)=>e.has(o)?Ne("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),h=(o,e,t,r)=>(de(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),w=(o,e,t)=>(de(o,e,"access private method"),t);var $e=(o,e,t,r)=>({set _(n){h(o,e,n,t)},get _(){return c(o,e,r)}});import{LitElement as pn}from"../lit-all.min.js";import{css as Ie,unsafeCSS as ze}from"../lit-all.min.js";var C="(max-width: 767px)",Ft="(max-width: 1199px)",b="(min-width: 768px)",f="(min-width: 1200px)",N="(min-width: 1600px)";function Bt(){return window.matchMedia(C)}function Ut(){return window.matchMedia(f)}function Ht(){return Bt().matches}function qt(){return Ut().matches}var De=Ie`
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
`,Fe=()=>[Ie`
      /* Tablet */
      @media screen and ${ze(b)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${ze(f)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as Yr,html as Be,css as Kr}from"../lit-all.min.js";var nt=class extends Yr{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:e}=this;return e?Be`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:Be` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};l(nt,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),l(nt,"styles",Kr`
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
    `);customElements.define("merch-icon",nt);var An=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),Tn=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var x='span[is="inline-price"][data-wcs-osi]',B='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var Wr='a[is="upt-link"]',Ue=`${x},${B},${Wr}`;var He="merch-offer-select:ready",qe="merch-card:action-menu-toggle";var he="merch-quantity-selector:change",je="merch-card-quantity:change",me="merch-modal:addon-and-quantity-update";var at="aem:load",it="aem:error",Ge="mas:ready",Ve="mas:error",Ye="placeholder-failed",Ke="placeholder-pending",We="placeholder-resolved";var Qe="mas:failed",At="mas:resolved",Xe="mas/commerce";var U="failed",V="pending",H="resolved";var jt="X-Request-Id",kn=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var Cn=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var Gt=":start",Vt=":duration";var Ze="legal";var Qr="mas-commerce-service";function Je(o,e){let t;return function(){let r=this,n=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(r,n),e)}}function S(o,e={},t=null,r=null){let n=r?document.createElement(o,{is:r}):document.createElement(o);t instanceof HTMLElement?n.appendChild(t):n.innerHTML=t;for(let[a,i]of Object.entries(e))n.setAttribute(a,i);return n}function ct(o){return`startTime:${o.startTime.toFixed(2)}|duration:${o.duration.toFixed(2)}`}function tr(){return window.matchMedia("(max-width: 1024px)").matches}function Y(){return document.getElementsByTagName(Qr)?.[0]}function Tt(o){let e=window.getComputedStyle(o);return o.offsetHeight+parseFloat(e.marginTop)+parseFloat(e.marginBottom)}var kt,K,Ct,Lt,st,Yt=class extends HTMLElement{constructor(){super();u(this,kt,"");u(this,K);u(this,Ct,[]);u(this,Lt,[]);u(this,st);h(this,st,Je(()=>{this.isConnected&&(this.parentElement.style.background=this.value,c(this,K)?this.parentElement.style.borderRadius=c(this,K):c(this,K)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let t=c(this,Ct).map((r,n)=>{let a=c(this,Lt)[n]||"";return`${r} ${a}`}).join(", ");return`linear-gradient(${c(this,kt)}, ${t})`}connectedCallback(){c(this,st).call(this)}attributeChangedCallback(t,r,n){t==="border-radius"&&h(this,K,n?.trim()),t==="colors"&&n?h(this,Ct,n?.split(",").map(a=>a.trim())??[]):t==="positions"&&n?h(this,Lt,n?.split(",").map(a=>a.trim())??[]):t==="angle"&&h(this,kt,n?.trim()??""),c(this,st).call(this)}};kt=new WeakMap,K=new WeakMap,Ct=new WeakMap,Lt=new WeakMap,st=new WeakMap;customElements.define("merch-gradient",Yt);import{LitElement as Xr,html as Zr,css as Jr}from"../lit-all.min.js";var lt=class extends Xr{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this),this.handleCustomClick=this.handleCustomClick.bind(this)}getOsi(e,t){let a=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION","TRIAL"],PROMOTION:["PROMOTION","BASE","TRIAL"]}[t]||[t]).map(s=>`p[data-plan-type="${e}"] ${x}[data-offer-type="${s}"]`).join(", ");return this.querySelector(a)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(At,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(At,this.updatePlanType)}updatePlanType(e){if(e.target.tagName!=="SPAN")return;let t=e.target,r=t?.value?.[0];r&&(t.setAttribute("data-offer-type",r.offerType),t.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}handleCustomClick(){this.shadowRoot.querySelector("input").click()}handleKeyDown(e){e.key===" "&&(e.preventDefault(),this.handleCustomClick())}render(){return Zr`
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
            </label>`}};l(lt,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0},customCheckbox:{type:Boolean,attribute:"custom-checkbox",reflect:!0}}),l(lt,"styles",Jr`
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
    `);customElements.define("merch-addon",lt);import{html as Kt,nothing as to}from"../lit-all.min.js";var dt,_t=class _t{constructor(e){l(this,"card");u(this,dt);this.card=e,this.insertVariantStyle()}getContainer(){return h(this,dt,c(this,dt)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),c(this,dt)}insertVariantStyle(){if(!_t.styleMap[this.card.variant]){_t.styleMap[this.card.variant]=!0;let e=document.createElement("style");e.innerHTML=this.getGlobalCSS(),document.head.appendChild(e)}}updateCardElementMinHeight(e,t){if(!e)return;let r=`--consonant-merch-card-${this.card.variant}-${t}-height`,n=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(r))||0;n>a&&this.getContainer().style.setProperty(r,`${n}px`)}get badge(){let e;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Kt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${e}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Kt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Kt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:to}get secureLabelFooter(){return Kt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let e=this.card.getBoundingClientRect().width,t=this.card.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}async postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Wt(this.card.variant)}};dt=new WeakMap,l(_t,"styleMap",{});var v=_t;import{html as pe,css as eo}from"../lit-all.min.js";var er=`
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
}`;var rr={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},ht=class extends v{constructor(t){super(t);l(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(qe,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});l(this,"toggleActionMenu",t=>{if(!this.actionMenuContentSlot||!t||t.type!=="click"&&t.code!=="Space"&&t.code!=="Enter")return;t.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});l(this,"toggleActionMenuFromCard",t=>{let r=t?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});l(this,"hideActionMenu",t=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return pe` <div class="body">
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
                ${this.promoBottom?"":pe`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?pe`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return er}setAriaExpanded(t,r){t.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};l(ht,"variantStyle",eo`
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
    `);import{html as Rt}from"../lit-all.min.js";var or=`
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
`;var Qt=class extends v{constructor(e){super(e)}getGlobalCSS(){return or}renderLayout(){return Rt`${this.cardImage}
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
          `}`}};import{html as ar}from"../lit-all.min.js";var nr=`
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
`;var Xt=class extends v{constructor(e){super(e)}getGlobalCSS(){return nr}renderLayout(){return ar` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":ar`<hr />`} ${this.secureLabelFooter}`}};import{html as mt,css as ro,unsafeCSS as ue}from"../lit-all.min.js";var ir=`
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

@media screen and ${Ft} {
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
`;var oo=32,pt=class extends v{constructor(t){super(t);l(this,"getRowMinHeightPropertyName",t=>`--consonant-merch-card-footer-row-${t}-min-height`);l(this,"getMiniCompareFooter",()=>{let t=this.card.secureLabel?mt`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:mt`<slot name="secure-transaction-label"></slot>`;return mt`<footer>${t}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return ir}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let t=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&t.push("footer-rows"),t.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="footer-rows"] ul');!t||!t.children||[...t.children].forEach((r,n)=>{let a=Math.max(oo,parseFloat(window.getComputedStyle(r).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let n=r.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${x}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(t){let r=this.mainPrice,n=this.headingMPriceSlot;if(!r&&n){let a=t?.getAttribute("plan-type"),i=null;if(t&&a&&(i=t.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),t.checked){if(i){let s=S("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},i.innerHTML);this.card.appendChild(s)}}else{let s=S("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(t.planType=n)}renderLayout(){return mt` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?mt`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:mt`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(t=>t.onceSettled())),await this.adjustAddon(),Ht()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};l(pt,"variantStyle",ro`
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

    @media screen and ${ue(C)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${ue(Ft)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${ue(f)} {
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
  `);import{html as Pt,css as no,nothing as Zt}from"../lit-all.min.js";var cr=`
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
`;var Jt={cardName:{attribute:"name"},title:{tag:"h3",slot:"heading-xs"},subtitle:{tag:"p",slot:"subtitle"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant",perUnitLabel:{tag:"span",slot:"per-unit-label"}},sr={...function(){let{whatsIncluded:o,size:e,...t}=Jt;return t}(),title:{tag:"h3",slot:"heading-s"},secureLabel:!1},lr={...function(){let{subtitle:o,whatsIncluded:e,size:t,quantitySelect:r,...n}=Jt;return n}()},A=class extends v{constructor(e){super(e),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(e,t){e.dataset.template===Ze&&(t.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return cr}adjustSlotPlacement(e,t,r){let n=this.card.shadowRoot,a=n.querySelector("footer"),i=this.card.getAttribute("size"),s=n.querySelector(`footer slot[name="${e}"]`),d=n.querySelector(`.body slot[name="${e}"]`),m=n.querySelector(".body");if((!i||!i.includes("wide"))&&(a?.classList.remove("wide-footer"),s&&s.remove()),!!t.includes(i)){if(a?.classList.toggle("wide-footer",qt()),!r&&s){if(d)s.remove();else{let p=m.querySelector(`[data-placeholder-for="${e}"]`);p?p.replaceWith(s):m.appendChild(s)}return}if(r&&d){let p=document.createElement("div");if(p.setAttribute("data-placeholder-for",e),p.classList.add("slot-placeholder"),!s){let g=d.cloneNode(!0);a.prepend(g)}d.replaceWith(p)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],qt()),this.adjustSlotPlacement("callout-content",["super-wide"],qt())}adjustCallout(){let e=this.card.querySelector('[slot="callout-content"] .icon-button');e&&e.title&&(e.dataset.tooltip=e.title,e.removeAttribute("title"),e.classList.add("hide-tooltip"),document.addEventListener("touchstart",t=>{t.preventDefault(),t.target!==e?e.classList.add("hide-tooltip"):t.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",t=>{t.preventDefault(),t.target!==e?e.classList.add("hide-tooltip"):t.target.classList.remove("hide-tooltip")}))}async adjustEduLists(){if(this.card.variant!=="plans-education"||this.card.querySelector(".spacer"))return;let t=this.card.querySelector('[slot="body-xs"]');if(!t)return;let r=t.querySelector("ul");if(!r)return;let n=r.previousElementSibling,a=document.createElement("div");a.classList.add("spacer"),t.insertBefore(a,n);let i=new IntersectionObserver(([s])=>{if(s.boundingClientRect.height===0)return;let d=0,m=this.card.querySelector('[slot="heading-s"]');m&&(d+=Tt(m));let p=this.card.querySelector('[slot="subtitle"]');p&&(d+=Tt(p));let g=this.card.querySelector('[slot="heading-m"]');g&&(d+=8+Tt(g));for(let ot of t.childNodes){if(ot.classList.contains("spacer"))break;d+=Tt(ot)}let k=this.card.parentElement.style.getPropertyValue("--merch-card-plans-edu-list-max-offset");d>(parseFloat(k)||0)&&this.card.parentElement.style.setProperty("--merch-card-plans-edu-list-max-offset",`${d}px`),this.card.style.setProperty("--merch-card-plans-edu-list-offset",`${d}px`),i.disconnect()});i.observe(this.card)}async postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustAddon(),this.adjustCallout(),this.legalAdjusted||(await this.adjustLegal(),await this.adjustEduLists())}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${x}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Pt`<div class="divider"></div>`:Zt}async adjustLegal(){if(this.legalAdjusted)return;this.legalAdjusted=!0,await this.card.updateComplete,await customElements.whenDefined("inline-price");let e=[],t=this.card.querySelector(`[slot="heading-m"] ${x}[data-template="price"]`);t&&e.push(t);let r=e.map(async n=>{let a=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),a.setAttribute("data-template","legal"),n.parentNode.insertBefore(a,n.nextSibling),await a.onceSettled())});await Promise.all(r)}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;e.setAttribute("custom-checkbox","");let t=this.mainPrice;if(!t)return;await t.onceSettled();let r=t.value?.[0]?.planType;r&&(e.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?Pt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Zt}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Zt:Pt`<slot name="icons"></slot>`}connectedCallbackHook(){let e=Bt();e?.addEventListener&&e.addEventListener("change",this.adaptForMedia);let t=Ut();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let e=Bt();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMedia);let t=Ut();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia)}renderLayout(){return Pt` ${this.badge}
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
            ${this.secureLabelFooter}`}};l(A,"variantStyle",no`
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
    `),l(A,"collectionOptions",{customHeaderArea:e=>e.sidenav?Pt`<slot name="resultsText"></slot>`:Zt,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as ge,css as ao}from"../lit-all.min.js";var dr=`
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
`;var ut=class extends v{constructor(e){super(e),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return dr}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(t=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${t}"]`),t))}renderLayout(){return ge` ${this.badge}
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
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Ht()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${x}[data-template="price"]`)}toggleAddon(e){let t=this.mainPrice,r=this.headingXSSlot;if(!t&&r){let n=e?.getAttribute("plan-type"),a=null;if(e&&n&&(a=e.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(i=>i.remove()),e.checked){if(a){let i=S("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},a.innerHTML);this.card.appendChild(i)}}else{let i=S("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice,r=this.card.planType;t&&(await t.onceSettled(),r=t.value?.[0]?.planType),r&&(e.planType=r)}};l(ut,"variantStyle",ao`
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
    `);import{html as fe,css as io}from"../lit-all.min.js";var hr=`
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
`;var gt=class extends v{constructor(e){super(e)}getGlobalCSS(){return hr}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return fe` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":fe`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?fe`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};l(gt,"variantStyle",io`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as xe,css as co}from"../lit-all.min.js";var mr=`
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
`;var pr={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ft=class extends v{constructor(e){super(e)}getGlobalCSS(){return mr}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return xe`${this.cardImage}
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
            <slot></slot>`}};l(ft,"variantStyle",co`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{css as so,html as lo}from"../lit-all.min.js";var ur=`
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
`;var gr={title:{tag:"p",slot:"title"},prices:{tag:"p",slot:"prices"},description:{tag:"p",slot:"description"},planType:!0,ctas:{slot:"ctas",size:"S"}},xt=class extends v{constructor(){super(...arguments);l(this,"legal")}async postCardUpdateHook(){await this.card.updateComplete,this.adjustLegal()}getGlobalCSS(){return ur}get headingSelector(){return'[slot="title"]'}priceOptionsProvider(t,r){r.literals={...r.literals,strikethroughAriaLabel:"",alternativePriceAriaLabel:""},r.space=!0,r.displayAnnual=this.card.settings?.displayAnnual??!1}adjustLegal(){if(this.legal!==void 0)return;let t=this.card.querySelector(`${x}[data-template="price"]`);if(!t)return;let r=t.cloneNode(!0);this.legal=r,t.dataset.displayTax="false",r.dataset.template="legal",r.dataset.displayPlanType=this.card?.settings?.displayPlanType??!0,r.setAttribute("slot","legal"),this.card.appendChild(r)}renderLayout(){return lo`
            ${this.badge}
            <div class="body">
                <slot name="title"></slot>
                <slot name="prices"></slot>
                <slot name="legal"></slot>
                <slot name="description"></slot>
                <slot name="ctas"></slot>
            </div>
        `}};l(xt,"variantStyle",so`
        :host([variant='mini']) {
            min-width: 209px;
            min-height: 103px;
            background-color: var(--spectrum-background-base-color);
            border: 1px solid var(--merch-card-custom-border-color, #dadada);
        }
    `);var te=new Map,L=(o,e,t=null,r=null,n)=>{te.set(o,{class:e,fragmentMapping:t,style:r,collectionOptions:n})};L("catalog",ht,rr,ht.variantStyle);L("image",Qt);L("inline-heading",Xt);L("mini-compare-chart",pt,null,pt.variantStyle);L("plans",A,Jt,A.variantStyle,A.collectionOptions);L("plans-students",A,lr,A.variantStyle,A.collectionOptions);L("plans-education",A,sr,A.variantStyle,A.collectionOptions);L("product",ut,null,ut.variantStyle);L("segment",gt,null,gt.variantStyle);L("special-offers",ft,pr,ft.variantStyle);L("mini",xt,gr,xt.variantStyle);var be=o=>{let e=te.get(o.variant);if(!e)return;let{class:t,style:r}=e;if(r)try{let n=new CSSStyleSheet;n.replaceSync(r.cssText),o.shadowRoot.adoptedStyleSheets.push(n)}catch{let a=document.createElement("style");a.textContent=r.cssText,o.shadowRoot.appendChild(a)}return new t(o)};function Wt(o){return te.get(o)?.fragmentMapping}function fr(o){return te.get(o)?.collectionOptions}var xr=document.createElement("style");xr.innerHTML=`
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

`;document.head.appendChild(xr);function ee(o,e={},{metadata:t=!0,search:r=!0,storage:n=!0}={}){let a;if(r&&a==null){let i=new URLSearchParams(window.location.search),s=ve(r)?r:o;a=i.get(s)}if(n&&a==null){let i=ve(n)?n:o;a=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(t&&a==null){let i=mo(ve(t)?t:o);a=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return a??e[o]}var ho=o=>typeof o=="boolean",re=o=>typeof o=="function";var ve=o=>typeof o=="string";function br(o,e){if(ho(o))return o;let t=String(o);return t==="1"||t==="true"?!0:t==="0"||t==="false"?!1:e}function mo(o=""){return String(o).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(e,t,r)=>`${t}-${r}`).replace(/\W+/gu,"-").toLowerCase()}var W=class o extends Error{constructor(e,t,r){if(super(e,{cause:r}),this.name="MasError",t.response){let n=t.response.headers?.get(jt);n&&(t.requestId=n),t.response.status&&(t.status=t.response.status,t.statusText=t.response.statusText),t.response.url&&(t.url=t.response.url)}delete t.response,this.context=t,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let e=Object.entries(this.context||{}).map(([r,n])=>`${r}: ${JSON.stringify(n)}`).join(", "),t=`${this.name}: ${this.message}`;return e&&(t+=` (${e})`),this.cause&&(t+=`
Caused by: ${this.cause}`),t}};var po="mas-commerce-service",uo={requestId:jt,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};var oe=o=>window.setTimeout(o);function ye(){return document.getElementsByTagName(po)?.[0]}function vr(o){let e={};if(!o?.headers)return e;let t=o.headers;for(let[r,n]of Object.entries(uo)){let a=t.get(n);a&&(a=a.replace(/[,;]/g,"|"),a=a.replace(/[| ]+/g,"|"),e[r]=a)}return e}async function yr(o,e={},t=2,r=100){let n;for(let a=0;a<=t;a++)try{let i=await fetch(o,e);return i.retryCount=a,i}catch(i){if(n=i,n.retryCount=a,a>t)break;await new Promise(s=>setTimeout(s,r*(a+1)))}throw n}var Er="fragment",wr="author",Sr="preview",Ar="loading",Tr="timeout",Ee="aem-fragment",kr="eager",Cr="cache",go=[kr,Cr],$,Q,R,we=class{constructor(){u(this,$,new Map);u(this,Q,new Map);u(this,R,new Map)}clear(){c(this,$).clear(),c(this,Q).clear(),c(this,R).clear()}add(e){if(!this.has(e.id)&&!this.has(e.fields?.originalId)){if(c(this,$).set(e.id,e),e.fields?.originalId&&c(this,$).set(e.fields.originalId,e),c(this,R).has(e.id)){let[,t]=c(this,R).get(e.id);t()}if(c(this,R).has(e.fields?.originalId)){let[,t]=c(this,R).get(e.fields?.originalId);t()}if(e.references)for(let t in e.references){let{type:r,value:n}=e.references[t];r==="content-fragment"&&(n.settings={...e?.settings,...n.settings},n.placeholders={...e?.placeholders,...n.placeholders},n.dictionary={...e?.dictionary,...n.dictionary},n.priceLiterals={...e?.priceLiterals,...n.priceLiterals},this.add(n,e))}}}has(e){return c(this,$).has(e)}entries(){return c(this,$).entries()}get(e){return c(this,$).get(e)}getAsPromise(e){let[t]=c(this,R).get(e)??[];if(t)return t;let r;return t=new Promise(n=>{r=n,this.has(e)&&n()}),c(this,R).set(e,[t,r]),t}getFetchInfo(e){let t=c(this,Q).get(e);return t||(t={url:null,retryCount:0,stale:!1,measure:null,status:null},c(this,Q).set(e,t)),t}remove(e){c(this,$).delete(e),c(this,Q).delete(e),c(this,R).delete(e)}};$=new WeakMap,Q=new WeakMap,R=new WeakMap;var q=new we,bt,z,D,_,T,y,Mt,Ot,P,Nt,$t,vt,M,Lr,_r,Se,Rr,ne=class extends HTMLElement{constructor(){super(...arguments);u(this,M);l(this,"cache",q);u(this,bt);u(this,z,null);u(this,D,null);u(this,_,null);u(this,T);u(this,y);u(this,Mt,kr);u(this,Ot,5e3);u(this,P);u(this,Nt,!1);u(this,$t,0);u(this,vt)}static get observedAttributes(){return[Er,Ar,Tr,wr,Sr]}attributeChangedCallback(t,r,n){t===Er&&(h(this,T,n),h(this,y,q.getFetchInfo(n))),t===Ar&&go.includes(n)&&h(this,Mt,n),t===Tr&&h(this,Ot,parseInt(n,10)),t===wr&&h(this,Nt,["","true"].includes(n)),t===Sr&&h(this,vt,n)}connectedCallback(){if(!c(this,P)){if(c(this,_)??h(this,_,Y(this)),h(this,vt,c(this,_).settings?.preview),c(this,bt)??h(this,bt,c(this,_).log.module(`${Ee}[${c(this,T)}]`)),!c(this,T)||c(this,T)==="#"){c(this,y)??h(this,y,q.getFetchInfo("missing-fragment-id")),w(this,M,Se).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(c(this,y)).filter(([t,r])=>r!=null).map(([t,r])=>[`aem-fragment:${t}`,r]))}async refresh(t=!0){if(c(this,P)&&!await Promise.race([c(this,P),Promise.resolve(!1)]))return;t&&q.remove(c(this,T)),c(this,Mt)===Cr&&await Promise.race([q.getAsPromise(c(this,T)),new Promise(s=>setTimeout(s,c(this,Ot)))]);try{h(this,P,w(this,M,Rr).call(this)),await c(this,P)}catch(s){return w(this,M,Se).call(this,s.message),!1}let{references:r,referencesTree:n,placeholders:a,wcs:i}=c(this,z)||{};return i&&!ee("mas.disableWcsCache")&&c(this,_).prefillWcsCache(i),this.dispatchEvent(new CustomEvent(at,{detail:{...this.data,references:r,referencesTree:n,placeholders:a,...c(this,y)},bubbles:!0,composed:!0})),c(this,P)}get updateComplete(){return c(this,P)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return c(this,D)?c(this,D):(c(this,Nt)?this.transformAuthorData():this.transformPublishData(),c(this,D))}transformAuthorData(){let{fields:t,id:r,tags:n,settings:a={},priceLiterals:i={},dictionary:s={},placeholders:d={}}=c(this,z);h(this,D,t.reduce((m,{name:p,multiple:g,values:k})=>(m.fields[p]=g?k:k[0],m),{fields:{},id:r,tags:n,settings:a,priceLiterals:i,dictionary:s,placeholders:d}))}transformPublishData(){let{fields:t,id:r,tags:n,settings:a={},priceLiterals:i={},dictionary:s={},placeholders:d={}}=c(this,z);h(this,D,Object.entries(t).reduce((m,[p,g])=>(m.fields[p]=g?.mimeType?g.value:g??"",m),{fields:{},id:r,tags:n,settings:a,priceLiterals:i,dictionary:s,placeholders:d}))}getFragmentClientUrl(){let r=new URLSearchParams(window.location.search).get("maslibs");if(!r||r.trim()==="")return"https://mas.adobe.com/studio/libs/fragment-client.js";let n=r.trim().toLowerCase();if(n==="local")return"http://localhost:3030/studio/libs/fragment-client.js";let{hostname:a}=window.location,i=a.endsWith(".page")?"page":"live";return n.includes("--")?`https://${n}.aem.${i}/studio/libs/fragment-client.js`:`https://${n}--mas--adobecom.aem.${i}/studio/libs/fragment-client.js`}async generatePreview(){let t=this.getFragmentClientUrl(),{previewFragment:r}=await import(t);return await r(c(this,T),{locale:c(this,_).settings.locale,apiKey:c(this,_).settings.wcsApiKey})}};bt=new WeakMap,z=new WeakMap,D=new WeakMap,_=new WeakMap,T=new WeakMap,y=new WeakMap,Mt=new WeakMap,Ot=new WeakMap,P=new WeakMap,Nt=new WeakMap,$t=new WeakMap,vt=new WeakMap,M=new WeakSet,Lr=async function(t){$e(this,$t)._++;let r=`${Ee}:${c(this,T)}:${c(this,$t)}`,n=`${r}${Gt}`,a=`${r}${Vt}`;if(c(this,vt))return await this.generatePreview();performance.mark(n);let i;try{if(c(this,y).stale=!1,c(this,y).url=t,i=await yr(t,{cache:"default",credentials:"omit"}),w(this,M,_r).call(this,i),c(this,y).status=i?.status,c(this,y).measure=ct(performance.measure(a,n)),c(this,y).retryCount=i.retryCount,!i?.ok)throw new W("Unexpected fragment response",{response:i,...c(this,_).duration});return await i.json()}catch(s){if(c(this,y).measure=ct(performance.measure(a,n)),c(this,y).retryCount=s.retryCount,c(this,z))return c(this,y).stale=!0,c(this,bt).error("Serving stale data",c(this,y)),c(this,z);let d=s.message??"unknown";throw new W(`Failed to fetch fragment: ${d}`,{})}},_r=function(t){Object.assign(c(this,y),vr(t))},Se=function(t){h(this,P,null),c(this,y).message=t,this.classList.add("error");let r={...c(this,y),...c(this,_).duration};c(this,bt).error(t,r),this.dispatchEvent(new CustomEvent(it,{detail:r,bubbles:!0,composed:!0}))},Rr=async function(){var s;this.classList.remove("error"),h(this,D,null);let t=q.get(c(this,T));if(t)return h(this,z,t),!0;let{masIOUrl:r,wcsApiKey:n,locale:a}=c(this,_).settings,i=`${r}/fragment?id=${c(this,T)}&api_key=${n}&locale=${a}`;return t=await w(this,M,Lr).call(this,i),(s=t.fields).originalId??(s.originalId=c(this,T)),q.add(t),h(this,z,t),!0},l(ne,"cache",q);customElements.define(Ee,ne);import{LitElement as fo,html as xo,css as bo}from"../lit-all.min.js";var yt=class extends fo{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return xo`<div class="badge">
            ${this.text}
        </div>`}};l(yt,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),l(yt,"styles",bo`
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
    `);customElements.define("merch-badge",yt);import{html as vo,css as yo,LitElement as Eo}from"../lit-all.min.js";var zt=class extends Eo{constructor(){super()}render(){return vo`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};l(zt,"styles",yo`
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
    `),l(zt,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",zt);import{html as Ae,css as wo,LitElement as So}from"../lit-all.min.js";var It=class extends So{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((e,t)=>{t>=5&&(e.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return Ae`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?Ae`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:Ae``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};l(It,"styles",wo`
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
    `),l(It,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",It);var X={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Pr=1e3;function Ao(o){return o instanceof Error||typeof o?.originatingRequest=="string"}function Mr(o){if(o==null)return;let e=typeof o;if(e==="function")return o.name?`function ${o.name}`:"function";if(e==="object"){if(o instanceof Error)return o.message;if(typeof o.originatingRequest=="string"){let{message:r,originatingRequest:n,status:a}=o;return[r,a,n].filter(Boolean).join(" ")}let t=o[Symbol.toStringTag]??Object.getPrototypeOf(o).constructor.name;if(!X.serializableTypes.includes(t))return t}return o}function To(o,e){if(!X.ignoredProperties.includes(o))return Mr(e)}var Te={append(o){if(o.level!=="error")return;let{message:e,params:t}=o,r=[],n=[],a=e;t.forEach(m=>{m!=null&&(Ao(m)?r:n).push(m)}),r.length&&(a+=" "+r.map(Mr).join(" "));let{pathname:i,search:s}=window.location,d=`${X.delimiter}page=${i}${s}`;d.length>Pr&&(d=`${d.slice(0,Pr)}<trunc>`),a+=d,n.length&&(a+=`${X.delimiter}facts=`,a+=JSON.stringify(n,To)),window.lana?.log(a,X)}};function Or(o){Object.assign(X,Object.fromEntries(Object.entries(o).filter(([e,t])=>e in X&&t!==""&&t!==null&&t!==void 0&&!Number.isNaN(t))))}var Nr={LOCAL:"local",PROD:"prod",STAGE:"stage"},ke={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Ce=new Set,Le=new Set,$r=new Map,zr={append({level:o,message:e,params:t,timestamp:r,source:n}){console[o](`${r}ms [${n}] %c${e}`,"font-weight: bold;",...t)}},Ir={filter:({level:o})=>o!==ke.DEBUG},ko={filter:()=>!1};function Co(o,e,t,r,n){return{level:o,message:e,namespace:t,get params(){return r.length===1&&re(r[0])&&(r=r[0](),Array.isArray(r)||(r=[r])),r},source:n,timestamp:performance.now().toFixed(3)}}function Lo(o){[...Le].every(e=>e(o))&&Ce.forEach(e=>e(o))}function Dr(o){let e=($r.get(o)??0)+1;$r.set(o,e);let t=`${o} #${e}`,r={id:t,namespace:o,module:n=>Dr(`${r.namespace}/${n}`),updateConfig:Or};return Object.values(ke).forEach(n=>{r[n]=(a,...i)=>Lo(Co(n,a,o,i,t))}),Object.seal(r)}function ae(...o){o.forEach(e=>{let{append:t,filter:r}=e;re(r)&&Le.add(r),re(t)&&Ce.add(t)})}function _o(o={}){let{name:e}=o,t=br(ee("commerce.debug",{search:!0,storage:!0}),e===Nr.LOCAL);return ae(t?zr:Ir),e===Nr.PROD&&ae(Te),_e}function Ro(){Ce.clear(),Le.clear()}var _e={...Dr(Xe),Level:ke,Plugins:{consoleAppender:zr,debugFilter:Ir,quietFilter:ko,lanaAppender:Te},init:_o,reset:Ro,use:ae};var Po={[U]:Ye,[V]:Ke,[H]:We},Mo={[U]:Qe,[H]:At},Dt,ie=class{constructor(e){u(this,Dt);l(this,"changes",new Map);l(this,"connected",!1);l(this,"error");l(this,"log");l(this,"options");l(this,"promises",[]);l(this,"state",V);l(this,"timer",null);l(this,"value");l(this,"version",0);l(this,"wrapperElement");this.wrapperElement=e,this.log=_e.module("mas-element")}update(){[U,V,H].forEach(e=>{this.wrapperElement.classList.toggle(Po[e],e===this.state)})}notify(){(this.state===H||this.state===U)&&(this.state===H?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===U&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]);let e=this.error;this.error instanceof W&&(e={message:this.error.message,...this.error.context}),this.wrapperElement.dispatchEvent(new CustomEvent(Mo[this.state],{bubbles:!0,detail:e}))}attributeChangedCallback(e,t,r){this.changes.set(e,r),this.requestUpdate()}connectedCallback(){h(this,Dt,ye()),this.requestUpdate(!0)}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement}))}onceSettled(){let{error:e,promises:t,state:r}=this;return H===r?Promise.resolve(this.wrapperElement):U===r?Promise.reject(e):new Promise((n,a)=>{t.push({resolve:n,reject:a})})}toggleResolved(e,t,r){return e!==this.version?!1:(r!==void 0&&(this.options=r),this.state=H,this.value=t,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:t}),oe(()=>this.notify()),!0)}toggleFailed(e,t,r){if(e!==this.version)return!1;r!==void 0&&(this.options=r),this.error=t,this.state=U,this.update();let n=this.wrapperElement.getAttribute("is");return this.log?.error(`${n}: Failed to render: ${t.message}`,{element:this.wrapperElement,...t.context,...c(this,Dt)?.duration}),oe(()=>this.notify()),!0}togglePending(e){return this.version++,e&&(this.options=e),this.state=V,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(e=!1){if(!this.wrapperElement.isConnected||!ye()||this.timer)return;let{error:t,options:r,state:n,value:a,version:i}=this;this.state=V,this.timer=oe(async()=>{this.timer=null;let s=null;if(this.changes.size&&(s=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:s}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:s})),s||e)try{await this.wrapperElement.render?.()===!1&&this.state===V&&this.version===i&&(this.state=n,this.error=t,this.value=a,this.update(),this.notify())}catch(d){this.toggleFailed(this.version,d,r)}})}};Dt=new WeakMap;function Oo(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var J,Z=class Z extends HTMLAnchorElement{constructor(){super();l(this,"masElement",new ie(this));u(this,J);this.setAttribute("is",Z.is)}get isUptLink(){return!0}initializeWcsData(t,r){this.setAttribute("data-wcs-osi",t),r&&this.setAttribute("data-promotion-code",r)}attributeChangedCallback(t,r,n){this.masElement.attributeChangedCallback(t,r,n)}connectedCallback(){this.masElement.connectedCallback(),h(this,J,Y()),c(this,J)&&(this.log=c(this,J).log.module("upt-link"))}disconnectedCallback(){this.masElement.disconnectedCallback(),h(this,J,void 0)}requestUpdate(t=!1){this.masElement.requestUpdate(t)}onceSettled(){return this.masElement.onceSettled()}async render(){let t=Y();if(!t)return!1;this.dataset.imsCountry||t.imsCountryPromise.then(i=>{i&&(this.dataset.imsCountry=i)});let r=t.collectCheckoutOptions({},this);if(!r.wcsOsi)return this.log.error("Missing 'data-wcs-osi' attribute on upt-link."),!1;let n=this.masElement.togglePending(r),a=t.resolveOfferSelectors(r);try{let[[i]]=await Promise.all(a),{country:s,language:d,env:m}=r,p=`locale=${d}_${s}&country=${s}&offer_id=${i.offerId}`,g=this.getAttribute("data-promotion-code");g&&(p+=`&promotion_code=${encodeURIComponent(g)}`),this.href=`${Oo(m)}?${p}`,this.masElement.toggleResolved(n,i,r)}catch(i){let s=new Error(`Could not resolve offer selectors for id: ${r.wcsOsi}.`,i.message);return this.masElement.toggleFailed(n,s,r),!1}}static createFrom(t){let r=new Z;for(let n of t.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?r.setAttribute("class",n.value.replace("upt-link","").trim()):r.setAttribute(n.name,n.value));return r.innerHTML=t.innerHTML,r.setAttribute("tabindex",0),r}};J=new WeakMap,l(Z,"is","upt-link"),l(Z,"tag","a"),l(Z,"observedAttributes",["data-wcs-osi","data-promotion-code","data-ims-country"]);var j=Z;window.customElements.get(j.is)||window.customElements.define(j.is,j,{extends:j.tag});var No="#000000",Re="#F8D904",$o="#EAEAEA",zo="#31A547",Io=/(accent|primary|secondary)(-(outline|link))?/,Do="mas:product_code/",Fo="daa-ll",ce="daa-lh",Bo=["XL","L","M","S"],Pe="...";function O(o,e,t,r){let n=r[o];if(e[o]&&n){let a={slot:n?.slot},i=e[o];if(n.maxCount&&typeof i=="string"){let[d,m]=on(i,n.maxCount,n.withSuffix);d!==i&&(a.title=m,i=d)}let s=S(n.tag,a,i);t.append(s)}}function Uo(o,e,t){let r=o.mnemonicIcon?.map((a,i)=>({icon:a,alt:o.mnemonicAlt[i]??"",link:o.mnemonicLink[i]??""}));r?.forEach(({icon:a,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let d={slot:"icons",src:a,loading:e.loading,size:t?.size??"l"};i&&(d.alt=i),s&&(d.href=s);let m=S("merch-icon",d);e.append(m)});let n=e.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&n&&n.remove()}function Ho(o,e,t){if(t.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=Re,n=!1;t.allowedBadgeColors?.includes(t.badge?.default)&&(r=t.badge?.default,o.borderColor||(n=!0));let a=o.badgeBackgroundColor||r,i=o.borderColor||"";n&&(i=t.badge?.default,o.borderColor=t.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${a}" border-color="${i}">${o.badge}</merch-badge>`}O("badge",o,e,t)}else o.badge?(e.setAttribute("badge-text",o.badge),e.setAttribute("badge-color",o.badgeColor||No),e.setAttribute("badge-background-color",o.badgeBackgroundColor||Re),e.setAttribute("border-color",o.badgeBackgroundColor||Re)):e.setAttribute("border-color",o.borderColor||$o)}function qo(o,e,t){if(t.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||zo;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}O("trialBadge",o,e,t)}}function jo(o,e,t){t?.includes(o.size)&&e.setAttribute("size",o.size)}function Go(o,e){o.cardName&&e.setAttribute("name",o.cardName)}function Vo(o,e,t){O("cardTitle",o,e,{cardTitle:t})}function Yo(o,e,t){O("subtitle",o,e,t)}function Ko(o,e,t,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){e.style.removeProperty("--merch-card-custom-background-color"),e.removeAttribute("background-color");return}t?.[o.backgroundColor]?(e.style.setProperty("--merch-card-custom-background-color",`var(${t[o.backgroundColor]})`),e.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(e.setAttribute(r.attribute,o.backgroundColor),e.style.removeProperty("--merch-card-custom-background-color"))}function Wo(o,e,t){let r=t?.borderColor,n="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(e.style.removeProperty(n),t?.allowedBorderColors?.includes(t?.badge?.default)&&e.style.setProperty(n,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(e.setAttribute("gradient-border","true"),e.style.removeProperty(n)):e.style.setProperty(n,`var(--${o.borderColor})`))}function Qo(o,e,t){if(o.backgroundImage){let r={loading:e.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!t)return;if(t?.attribute){e.setAttribute(t.attribute,o.backgroundImage);return}e.append(S(t.tag,{slot:t.slot},S("img",r)))}}function Xo(o,e,t){O("prices",o,e,t)}function Br(o,e,t){let r=o.hasAttribute("data-wcs-osi")&&!!o.getAttribute("data-wcs-osi"),n=o.className||"",a=Io.exec(n)?.[0]??"accent",i=a.includes("accent"),s=a.includes("primary"),d=a.includes("secondary"),m=a.includes("-outline"),p=a.includes("-link");o.classList.remove("accent","primary","secondary");let g;if(e.consonant)g=sn(o,i,r,p);else if(p)g=o;else{let k;i?k="accent":s?k="primary":d&&(k="secondary"),g=e.spectrum==="swc"?cn(o,t,m,k,r):an(o,t,m,k,r)}return g}function Zo(o,e){let{slot:t}=e?.description,r=o.querySelectorAll(`[slot="${t}"] a[data-wcs-osi]`);r.length&&r.forEach(n=>{let a=Br(n,o,e);n.replaceWith(a)})}function Jo(o,e,t){O("promoText",o,e,t),O("description",o,e,t),Zo(e,t),O("callout",o,e,t),O("quantitySelect",o,e,t),O("whatsIncluded",o,e,t)}function tn(o,e,t){if(!t.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let n=S("merch-addon",{slot:"addon"},r);[...n.querySelectorAll(x)].forEach(a=>{let i=a.parentElement;i?.nodeName==="P"&&i.setAttribute("data-plan-type","")}),e.append(n)}function en(o,e,t){o.addonConfirmation&&O("addonConfirmation",o,e,t)}function rn(o,e,t,r){r?.secureLabel&&t?.secureLabel&&e.setAttribute("secure-label",r.secureLabel)}function on(o,e,t=!0){try{let r=typeof o!="string"?"":o,n=Fr(r);if(n.length<=e)return[r,n];let a=0,i=!1,s=t?e-Pe.length<1?1:e-Pe.length:e,d=[];for(let g of r){if(a++,g==="<")if(i=!0,r[a]==="/")d.pop();else{let k="";for(let ot of r.substring(a)){if(ot===" "||ot===">")break;k+=ot}d.push(k)}if(g==="/"&&r[a]===">"&&d.pop(),g===">"){i=!1;continue}if(!i&&(s--,s===0))break}let m=r.substring(0,a).trim();if(d.length>0){d[0]==="p"&&d.shift();for(let g of d.reverse())m+=`</${g}>`}return[`${m}${t?Pe:""}`,n]}catch{let n=typeof o=="string"?o:"",a=Fr(n);return[n,a]}}function Fr(o){if(!o)return"";let e="",t=!1;for(let r of o){if(r==="<"&&(t=!0),r===">"){t=!1;continue}t||(e+=r)}return e}function nn(o,e){e.querySelectorAll("a.upt-link").forEach(r=>{let n=j.createFrom(r);r.replaceWith(n),n.initializeWcsData(o.osi,o.promoCode)})}function an(o,e,t,r,n){let a=o;n?a=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):a.innerHTML=`<span>${a.textContent}</span>`,a.setAttribute("tabindex",0);for(let p of o.attributes)["class","is"].includes(p.name)||a.setAttribute(p.name,p.value);a.firstElementChild?.classList.add("spectrum-Button-label");let i=e?.ctas?.size??"M",s=`spectrum-Button--${r}`,d=Bo.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",m=["spectrum-Button",s,d];return t&&m.push("spectrum-Button--outline"),a.classList.add(...m),a}function cn(o,e,t,r,n){let a=o;n&&(a=customElements.get("checkout-button").createCheckoutButton(o.dataset),a.connectedCallback(),a.render());let i="fill";t&&(i="outline");let s=S("sp-button",{treatment:i,variant:r,tabIndex:0,size:e?.ctas?.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return s.source=a,(n?a.onceSettled():Promise.resolve(a)).then(d=>{s.setAttribute("data-navigation-url",d.href)}),s.addEventListener("click",d=>{d.defaultPrevented||a.click()}),s}function sn(o,e,t,r){let n=o;return t&&(n=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r||(n.classList.add("con-button"),e&&n.classList.add("blue")),n}function ln(o,e,t,r){if(o.ctas){let{slot:n}=t.ctas,a=S("div",{slot:n},o.ctas),i=[...a.querySelectorAll("a")].map(s=>Br(s,e,t));a.innerHTML="",a.append(...i),e.append(a)}}function dn(o,e){let{tags:t}=o,r=t?.find(a=>a.startsWith(Do))?.split("/").pop();if(!r)return;e.setAttribute(ce,r),[...e.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...e.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((a,i)=>{a.setAttribute(Fo,`${a.dataset.analyticsId}-${i+1}`)})}function hn(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([e,t])=>{o.querySelectorAll(`a.${e}`).forEach(r=>{r.classList.remove(e),r.classList.add("spectrum-Link",`spectrum-Link--${t}`)})})}function mn(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",ce].forEach(r=>o.removeAttribute(r));let t=["wide-strip","thin-strip"];o.classList.remove(...t)}async function Ur(o,e){if(!o){let d=e?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${d}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${d}).`)}if(!o.fields){let d=o.id||"unknown",m=e?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${d}' (merchCard id: ${m}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${d}' (merchCard id: ${m}) is missing 'fields'.`)}let{id:t,fields:r,settings:n={},priceLiterals:a}=o,{variant:i}=r;if(!i)throw new Error(`hydrate: no variant found in payload ${t}`);mn(e),e.settings=n,a&&(e.priceLiterals=a),e.id??(e.id=o.id),e.variant=i,await e.updateComplete;let{aemFragmentMapping:s}=e.variantLayout;if(!s)throw new Error(`hydrate: variant mapping not found for ${t}`);s.style==="consonant"&&e.setAttribute("consonant",!0),Uo(r,e,s.mnemonics),Ho(r,e,s),qo(r,e,s),jo(r,e,s.size),Go(r,e),Vo(r,e,s.title),Yo(r,e,s),Xo(r,e,s),Qo(r,e,s.backgroundImage),Ko(r,e,s.allowedColors,s.backgroundColor),Wo(r,e,s),Jo(r,e,s),tn(r,e,s),en(r,e,s),rn(r,e,s,n),nn(r,e),ln(r,e,s,i),dn(r,e),hn(e)}var Oe="merch-card",Me=2e4,Hr="merch-card:";function qr(o,e){let t=o.closest(Oe);if(!t)return e;t.priceLiterals&&(e.literals??(e.literals={}),Object.assign(e.literals,t.priceLiterals)),t.variantLayout?.priceOptionsProvider?.(o,e)}function un(o){o.providers.has(qr)||o.providers.price(qr)}var gn=0,Et,wt,St,F,et,I,rt,E,tt,se,jr,le,G=class extends pn{constructor(){super();u(this,E);u(this,Et);u(this,wt);u(this,St);u(this,F);u(this,et);u(this,I);u(this,rt,new Promise(t=>{h(this,I,t)}));l(this,"customerSegment");l(this,"marketSegment");l(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=be(this),this.variantLayout?.connectedCallbackHook()}willUpdate(t){(t.has("variant")||!this.variantLayout)&&(this.variantLayout=be(this),this.variantLayout?.connectedCallbackHook())}updated(t){(t.has("badgeBackgroundColor")||t.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),t.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayoutPromise=this.variantLayout?.postCardUpdateHook(t)}catch(r){w(this,E,tt).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(x)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(B)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(B)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(B)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:t}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let n of r){await n.onceSettled();let a=n.value?.[0]?.planType;if(!a)return;let i=this.stockOfferOsis[a];if(!i)return;let s=n.dataset.wcsOsi.split(",").filter(d=>d!==i);t.checked&&s.push(i),n.dataset.wcsOsi=s.join(",")}}changeHandler(t){t.target.tagName==="MERCH-ADDON"&&this.toggleAddon(t.target)}toggleAddon(t){this.variantLayout?.toggleAddon?.(t);let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length===0)return;let n=a=>{let{offerType:i,planType:s}=a.value?.[0]??{};if(!i||!s)return;let d=t.getOsi(s,i),m=(a.dataset.wcsOsi||"").split(",").filter(p=>p&&p!==d);t.checked&&m.push(d),a.dataset.wcsOsi=m.join(",")};r.forEach(n)}handleQuantitySelection(t){let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length!==0)for(let n of r)n.dataset.quantity=t.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(t){let r={...this.filters};Object.keys(r).forEach(n=>{if(t){r[n].order=Math.min(r[n].order||2,2);return}let a=r[n].order;a===1||isNaN(a)||(r[n].order=Number(a)+1)}),this.filters=r}includes(t){return this.textContent.match(new RegExp(t,"i"))!==null}connectedCallback(){var r;super.connectedCallback(),c(this,wt)||h(this,wt,gn++),this.aemFragment||((r=c(this,I))==null||r.call(this),h(this,I,void 0)),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let t=this.id??c(this,wt);h(this,et,`${Hr}${t}${Gt}`),h(this,Et,`${Hr}${t}${Vt}`),performance.mark(c(this,et)),h(this,F,Y()),un(c(this,F)),h(this,St,c(this,F).Log.module(Oe)),this.addEventListener(he,this.handleQuantitySelection),this.addEventListener(me,this.handleAddonAndQuantityUpdate),this.addEventListener(He,this.handleMerchOfferSelectReady),this.addEventListener(it,this.handleAemFragmentEvents),this.addEventListener(at,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(he,this.handleQuantitySelection),this.removeEventListener(it,this.handleAemFragmentEvents),this.removeEventListener(at,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(me,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(t){var r;if(this.isConnected&&(t.type===it&&w(this,E,tt).call(this,"AEM fragment cannot be loaded"),t.type===at&&(this.failed=!1,t.target.nodeName==="AEM-FRAGMENT"))){let n=t.detail;try{c(this,I)||h(this,rt,new Promise(a=>{h(this,I,a)})),Ur(n,this)}catch(a){w(this,E,tt).call(this,`hydration has failed: ${a.message}`)}finally{(r=c(this,I))==null||r.call(this),h(this,I,void 0)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;c(this,rt)&&(await c(this,rt),h(this,rt,void 0)),this.variantLayoutPromise&&(await this.variantLayoutPromise,this.variantLayoutPromise=void 0);let t=new Promise(i=>setTimeout(()=>i("timeout"),Me));if(this.aemFragment){let i=await Promise.race([this.aemFragment.updateComplete,t]);if(i===!1||i==="timeout"){let s=i==="timeout"?`AEM fragment was not resolved within ${Me} timeout`:"AEM fragment cannot be loaded";w(this,E,tt).call(this,s,{},!1);return}}let r=[...this.querySelectorAll(Ue)],n=Promise.all(r.map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),a=await Promise.race([n,t]);if(a===!0){this.measure=performance.measure(c(this,Et),c(this,et));let i={...this.aemFragment?.fetchInfo,...c(this,F).duration,measure:ct(this.measure)};return this.dispatchEvent(new CustomEvent(Ge,{bubbles:!0,composed:!0,detail:i})),this}else{this.measure=performance.measure(c(this,Et),c(this,et));let i={measure:ct(this.measure),...c(this,F).duration};a==="timeout"?w(this,E,tt).call(this,`Contains offers that were not resolved within ${Me} timeout`,i):w(this,E,tt).call(this,"Contains unresolved offers",i)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let t=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(B)).length===2&&t&&t.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:t,items:r}}){if(!t||!r?.length||this.closest('[role="tabpanel"][hidden="true"]'))return;let a=this.checkoutLinks.find(p=>p.getAttribute("data-modal-id")===t);if(!a)return;let s=new URL(a.getAttribute("href")).searchParams.get("pa"),d=r.find(p=>p.productArrangementCode===s)?.quantity,m=!!r.find(p=>p.productArrangementCode!==s);if(d&&this.quantitySelect?.dispatchEvent(new CustomEvent(je,{detail:{quantity:d},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==m){this.toggleStockOffer({target:this.addonCheckbox});let p=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(p,"target",{writable:!1,value:{checked:m}}),this.addonCheckbox.handleChange(p)}}get prices(){return Array.from(this.querySelectorAll(x))}get promoPrice(){if(!this.querySelector("span.price-strikethrough"))return;let t=this.querySelector(".price.price-alternative");if(t||(t=this.querySelector(`${x}[data-template="price"] > span`)),!!t)return t=t.innerText,t}get regularPrice(){return c(this,E,se)?.innerText}get promotionCode(){let t=[...this.querySelectorAll(`${x}[data-promotion-code],${B}[data-promotion-code]`)].map(n=>n.dataset.promotionCode),r=[...new Set(t)];return r.length>1&&c(this,St)?.warn(`Multiple different promotion codes found: ${r.join(", ")}`),t[0]}get annualPrice(){return this.querySelector(`${x}[data-template="price"] > .price.price-annual`)?.innerText}get promoText(){}get taxText(){return(c(this,E,jr)??c(this,E,se))?.querySelector("span.price-tax-inclusivity")?.textContent?.trim()||void 0}get recurrenceText(){return c(this,E,se)?.querySelector("span.price-recurrence")?.textContent?.trim()}get planTypeText(){return this.querySelector('[is="inline-price"][data-template="legal"] span.price-plan-type')?.textContent?.trim()}get seeTermsInfo(){let t=this.querySelector('a[is="upt-link"]');if(t)return w(this,E,le).call(this,t)}get renewalText(){return this.querySelector("span.renewal-text")?.textContent?.trim()}get promoDurationText(){return this.querySelector("span.promo-duration-text")?.textContent?.trim()}get ctas(){return Array.from(this.querySelector('[slot="ctas"], [slot="footer"]')?.querySelectorAll(`${B}, a`))}get primaryCta(){return w(this,E,le).call(this,this.ctas.find(t=>t.variant==="accent"||t.matches(".spectrum-Button--accent,.con-button.blue")))}get secondaryCta(){return w(this,E,le).call(this,this.ctas.find(t=>t.variant!=="accent"&&!t.matches(".spectrum-Button--accent,.con-button.blue")))}};Et=new WeakMap,wt=new WeakMap,St=new WeakMap,F=new WeakMap,et=new WeakMap,I=new WeakMap,rt=new WeakMap,E=new WeakSet,tt=function(t,r={},n=!0){if(!this.isConnected)return;let i=this.aemFragment?.getAttribute("fragment");i=`[${i}]`;let s={...this.aemFragment.fetchInfo,...c(this,F).duration,...r,message:t};c(this,St).error(`merch-card${i}: ${t}`,s),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Ve,{bubbles:!0,composed:!0,detail:s}))},se=function(){return this.querySelector("span.price-strikethrough")??this.querySelector(`${x}[data-template="price"] > span`)},jr=function(){return this.querySelector(`${x}[data-template="legal"]`)},le=function(t){if(t)return{text:t.innerText.trim(),analyticsId:t.dataset.analyticsId,href:t.getAttribute("href")??t.dataset.href}},l(G,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:t=>{if(!t)return;let[r,n,a]=t.split(",");return{PUF:r,ABM:n,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:t=>Object.fromEntries(t.split(",").map(r=>{let[n,a,i]=r.split(":"),s=Number(a);return[n,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:t=>Object.entries(t).map(([r,{order:n,size:a}])=>[r,n,a].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:ce,reflect:!0},loading:{type:String},priceLiterals:{type:Object}}),l(G,"styles",[De,...Fe()]),l(G,"registerVariant",L),l(G,"getCollectionOptions",fr),l(G,"getFragmentMapping",Wt);customElements.define(Oe,G);export{G as MerchCard};

var Qe=Object.defineProperty;var ie=o=>{throw TypeError(o)};var Xe=(o,e,t)=>e in o?Qe(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var d=(o,e,t)=>Xe(o,typeof e!="symbol"?e+"":e,t),Ht=(o,e,t)=>e.has(o)||ie("Cannot "+t);var c=(o,e,t)=>(Ht(o,e,"read from private field"),t?t.call(o):e.get(o)),p=(o,e,t)=>e.has(o)?ie("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),m=(o,e,t,r)=>(Ht(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),E=(o,e,t)=>(Ht(o,e,"access private method"),t);var ce=(o,e,t,r)=>({set _(a){m(o,e,a,t)},get _(){return c(o,e,r)}});import{LitElement as Zr}from"../lit-all.min.js";import{css as de,unsafeCSS as se}from"../lit-all.min.js";var L="(max-width: 767px)",Tt="(max-width: 1199px)",u="(min-width: 768px)",g="(min-width: 1200px)",R="(min-width: 1600px)";var le=de`
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
`,he=()=>[de`
      /* Tablet */
      @media screen and ${se(u)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${se(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as Ze,html as me,css as Je}from"../lit-all.min.js";var j=class extends Ze{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:e}=this;return e?me`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:me` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};d(j,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),d(j,"styles",Je`
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
    `);customElements.define("merch-icon",j);var lo=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),ho=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var b='span[is="inline-price"][data-wcs-osi]',kt='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var pe=`${b},${kt}`;var ge="merch-offer-select:ready",ue="merch-card:action-menu-toggle";var Bt="merch-quantity-selector:change",fe="merch-card-quantity:change",Ut="merch-modal:addon-and-quantity-update";var Y="aem:load",K="aem:error",xe="mas:ready",be="mas:error";var qt="mas:resolved";var Ct="X-Request-Id",mo=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),po=Object.freeze({V2:"UCv2",V3:"UCv3"}),go=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var _t=":start",Lt=":duration";var ve="legal";var tr="mas-commerce-service";function ye(o,e){let t;return function(){let r=this,a=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(r,a),e)}}function v(o,e={},t=null,r=null){let a=r?document.createElement(o,{is:r}):document.createElement(o);t instanceof HTMLElement?a.appendChild(t):a.innerHTML=t;for(let[n,i]of Object.entries(e))a.setAttribute(n,i);return a}function Rt(){return window.matchMedia("(max-width: 767px)")}function W(){return Rt().matches}function Q(o){return`startTime:${o.startTime.toFixed(2)}|duration:${o.duration.toFixed(2)}`}function Ee(){return window.matchMedia("(max-width: 1024px)").matches}function X(){return document.getElementsByTagName(tr)?.[0]}var pt,F,gt,ut,Z,Mt=class extends HTMLElement{constructor(){super();p(this,pt,"");p(this,F);p(this,gt,[]);p(this,ut,[]);p(this,Z);m(this,Z,ye(()=>{this.isConnected&&(this.parentElement.style.background=this.value,c(this,F)?this.parentElement.style.borderRadius=c(this,F):c(this,F)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let t=c(this,gt).map((r,a)=>{let n=c(this,ut)[a]||"";return`${r} ${n}`}).join(", ");return`linear-gradient(${c(this,pt)}, ${t})`}connectedCallback(){c(this,Z).call(this)}attributeChangedCallback(t,r,a){t==="border-radius"&&m(this,F,a?.trim()),t==="colors"&&a?m(this,gt,a?.split(",").map(n=>n.trim())??[]):t==="positions"&&a?m(this,ut,a?.split(",").map(n=>n.trim())??[]):t==="angle"&&m(this,pt,a?.trim()??""),c(this,Z).call(this)}};pt=new WeakMap,F=new WeakMap,gt=new WeakMap,ut=new WeakMap,Z=new WeakMap;customElements.define("merch-gradient",Mt);import{LitElement as er,html as rr,css as or}from"../lit-all.min.js";var J=class extends er{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this)}getOsi(e,t){let n=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION"],PROMOTION:["PROMOTION","BASE"]}[t]||[t]).map(s=>`p[data-plan-type="${e}"] ${b}[data-offer-type="${s}"]`).join(", ");return this.querySelector(n)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(qt,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(qt,this.updatePlanType)}updatePlanType(e){if(e.target.tagName!=="SPAN")return;let t=e.target,r=t?.value?.[0];r&&(t.setAttribute("data-offer-type",r.offerType),t.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return rr`<input
                type="checkbox"
                id="addon-checkbox"
                part="checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <label for="addon-checkbox" part="label">
                <slot></slot>
            </label>`}};d(J,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0}}),d(J,"styles",or`
        :host {
            display: flex;
            gap: 9px;
            align-items: start;
            cursor: pointer;
        }

        :host,
        label {
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
    `);customElements.define("merch-addon",J);import{html as Pt,nothing as ar}from"../lit-all.min.js";var tt,ft=class ft{constructor(e){d(this,"card");p(this,tt);this.card=e,this.insertVariantStyle()}getContainer(){return m(this,tt,c(this,tt)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),c(this,tt)}insertVariantStyle(){if(!ft.styleMap[this.card.variant]){ft.styleMap[this.card.variant]=!0;let e=document.createElement("style");e.innerHTML=this.getGlobalCSS(),document.head.appendChild(e)}}updateCardElementMinHeight(e,t){if(!e)return;let r=`--consonant-merch-card-${this.card.variant}-${t}-height`,a=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),n=parseInt(this.getContainer().style.getPropertyValue(r))||0;a>n&&this.getContainer().style.setProperty(r,`${a}px`)}get badge(){let e;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Pt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${e}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Pt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Pt`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:ar}get secureLabelFooter(){return Pt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let e=this.card.getBoundingClientRect().width,t=this.card.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return zt(this.card.variant)}};tt=new WeakMap,d(ft,"styleMap",{});var f=ft;import{html as Gt,css as nr}from"../lit-all.min.js";var we=`
:root {
  --consonant-merch-card-catalog-width: 276px;
  --consonant-merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

@media screen and ${u} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${g} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${R} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
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
}`;var Se={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},et=class extends f{constructor(t){super(t);d(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(ue,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});d(this,"toggleActionMenu",t=>{if(!this.actionMenuContentSlot||!t||t.type!=="click"&&t.code!=="Space"&&t.code!=="Enter")return;t.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});d(this,"toggleActionMenuFromCard",t=>{let r=t?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});d(this,"hideActionMenu",t=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Gt` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Ee()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Gt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Gt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return we}setAriaExpanded(t,r){t.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};d(et,"variantStyle",nr`
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
    `);import{html as xt}from"../lit-all.min.js";var Ae=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${u} {
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
`;var Ot=class extends f{constructor(e){super(e)}getGlobalCSS(){return Ae}renderLayout(){return xt`${this.cardImage}
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
          `}`}};import{html as ke}from"../lit-all.min.js";var Te=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${u} {
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

@media screen and ${R} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Nt=class extends f{constructor(e){super(e)}getGlobalCSS(){return Te}renderLayout(){return ke` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":ke`<hr />`} ${this.secureLabelFooter}`}};import{html as rt,css as ir,unsafeCSS as Vt}from"../lit-all.min.js";var Ce=`
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
@media screen and ${L} {
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

@media screen and ${Tt} {
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
@media screen and ${u} {
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

@media screen and ${R} {
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
`;var cr=32,ot=class extends f{constructor(t){super(t);d(this,"getRowMinHeightPropertyName",t=>`--consonant-merch-card-footer-row-${t}-min-height`);d(this,"getMiniCompareFooter",()=>{let t=this.card.secureLabel?rt`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:rt`<slot name="secure-transaction-label"></slot>`;return rt`<footer>${t}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ce}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let t=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&t.push("footer-rows"),t.forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="footer-rows"] ul');!t||!t.children||[...t.children].forEach((r,a)=>{let n=Math.max(cr,parseFloat(window.getComputedStyle(r).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;n>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${n}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let a=r.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${b}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(t){let r=this.mainPrice,a=this.headingMPriceSlot;if(!r&&a){let n=t?.getAttribute("plan-type"),i=null;if(t&&n&&(i=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),t.checked){if(i){let s=v("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},i.innerHTML);this.card.appendChild(s)}}else{let s=v("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,a=this.card.planType;r&&(await r.onceSettled(),a=r.value?.[0]?.planType),a&&(t.planType=a)}renderLayout(){return rt` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?rt`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:rt`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(t=>t.onceSettled())),await this.adjustAddon(),W()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};d(ot,"variantStyle",ir`
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

    @media screen and ${Vt(L)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${Vt(Tt)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Vt(g)} {
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
  `);import{html as at,css as sr,nothing as $t}from"../lit-all.min.js";var _e=`
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

merch-card[variant="plans-students"] {
    width: var(--consonant-merch-card-plans-students-width);
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

merch-card[variant^="plans"] [slot='callout-content'] > div > div,
merch-card[variant^="plans"] [slot="callout-content"] > p {
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant^="plans"] [slot='callout-content'] > p,
merch-card[variant^="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant^="plans"] [slot="callout-content"] img,
merch-card[variant^="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant^="plans"] [slot="callout-content"] .icon-button::before {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path fill="%232c2c2c" d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
    background-size: 18px 18px;
}

merch-card[variant^="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant^="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
    flex-grow: 1;
    align-items: end;
}

merch-card[variant^="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

merch-card[variant^="plans"] [slot="footer"] .con-button > span {
    min-width: unset;
}

.plans-container {
    display: flex;
    justify-content: center;
    gap: 36px;
}

.plans-container merch-card-collection {
    padding: 0;
}

merch-card[variant^="plans"] merch-addon {
    margin-top: 16px;
    margin-bottom: 16px;
    font-family: "Adobe Clean";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    align-items: center;
}

merch-card[variant^="plans"] merch-addon span[data-template="price"] {
    display: none;
}

/* Mobile */
@media screen and ${L} {
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

.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${u} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
  .four-merch-cards.plans .foreground {
      max-width: unset;
  }
}

/* desktop */
@media screen and ${g} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${R} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var It={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Le={...function(){let{whatsIncluded:o,...e}=It;return e}(),title:{tag:"p",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Re={...function(){let{whatsIncluded:o,size:e,quantitySelect:t,...r}=It;return r}()},M=class extends f{constructor(e){super(e),this.adaptForMobile=this.adaptForMobile.bind(this)}priceOptionsProvider(e,t){e.dataset.template===ve&&(t.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return _e}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards")){this.card.removeAttribute("size");return}let e=this.card.shadowRoot,t=e.querySelector("footer"),r=this.card.getAttribute("size"),a=e.querySelector("footer #stock-checkbox"),n=e.querySelector(".body #stock-checkbox"),i=e.querySelector(".body");if(!r){t?.classList.remove("wide-footer"),a&&a.remove();return}let s=W();if(t?.classList.toggle("wide-footer",!s),s&&a){n?a.remove():i.appendChild(a);return}!s&&n&&(a?n.remove():t.prepend(n))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${b}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?at`<div class="divider"></div>`:$t}async adjustLegal(){if(await this.card.updateComplete,this.legal)return;let e=[],t=this.card.querySelector(`[slot="heading-m"] ${b}[data-template="price"]`);t&&e.push(t),this.card.querySelectorAll(`[slot="body-xs"] ${b}[data-template="price"]`).forEach(n=>e.push(n));let a=e.map(async n=>{let i=n.cloneNode(!0);n===t&&(this.legal=i),await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),i.setAttribute("data-template","legal"),n.parentNode.insertBefore(i,n.nextSibling))});await Promise.all(a)}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice;if(!t)return;await t.onceSettled();let r=t.value?.[0]?.planType;r&&(e.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?at`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:$t}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?$t:at`<slot name="icons"></slot>`}get addon(){return this.card.size==="super-wide"?$t:at`<slot name="addon"></slot>`}get plansSecureLabelFooter(){return this.card.size==="super-wide"?at`<footer><slot name="addon"></slot>${this.secureLabel}<slot name="footer"></slot></footer>`:this.secureLabelFooter}connectedCallbackHook(){let e=Rt();e?.addEventListener&&e.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let e=Rt();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMobile)}renderLayout(){return at` ${this.badge}
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
                ${this.stockCheckbox}
                ${this.addon}
                <slot name="badge"></slot>
                <slot name="quantity-select"></slot>
            </div>
            ${this.plansSecureLabelFooter}`}};d(M,"variantStyle",sr`
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
    `);import{html as jt,css as dr}from"../lit-all.min.js";var Me=`
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
@media screen and ${u} {
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
`;var H=class extends f{constructor(e){super(e),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Me}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(t=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${t}"]`),t))}renderLayout(){return jt` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":jt`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?jt`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),W()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${b}[data-template="price"]`)}toggleAddon(e){let t=this.mainPrice,r=this.headingXSSlot;if(!t&&r){let a=e?.getAttribute("plan-type"),n=null;if(e&&a&&(n=e.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(i=>i.remove()),e.checked){if(n){let i=v("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},n.innerHTML);this.card.appendChild(i)}}else{let i=v("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice,r=this.card.planType;t&&(await t.onceSettled(),r=t.value?.[0]?.planType),r&&(e.planType=r)}};d(H,"variantStyle",dr`
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
    `);import{html as Yt,css as lr}from"../lit-all.min.js";var Pe=`
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
@media screen and ${L} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${u} {
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
`;var nt=class extends f{constructor(e){super(e)}getGlobalCSS(){return Pe}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Yt` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Yt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Yt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};d(nt,"variantStyle",lr`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Kt,css as hr}from"../lit-all.min.js";var ze=`
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

@media screen and ${L} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${u} {
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

@media screen and ${R} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Oe={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},it=class extends f{constructor(e){super(e)}getGlobalCSS(){return ze}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Kt`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Kt`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Kt`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};d(it,"variantStyle",hr`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Wt=new Map,S=(o,e,t=null,r=null)=>{Wt.set(o,{class:e,fragmentMapping:t,style:r})};S("catalog",et,Se,et.variantStyle);S("image",Ot);S("inline-heading",Nt);S("mini-compare-chart",ot,null,ot.variantStyle);S("plans",M,It,M.variantStyle);S("plans-students",M,Re,M.variantStyle);S("plans-education",M,Le,M.variantStyle);S("product",H,null,H.variantStyle);S("segment",nt,null,nt.variantStyle);S("special-offers",it,Oe,it.variantStyle);var Qt=(o,e=!1)=>{let t=Wt.get(o.variant);if(!t)return e?void 0:new H(o);let{class:r,style:a}=t;if(a){let n=new CSSStyleSheet;n.replaceSync(a.cssText),o.shadowRoot.adoptedStyleSheets.push(n)}return new r(o)};function zt(o){return Wt.get(o)?.fragmentMapping}var Ne=document.createElement("style");Ne.innerHTML=`
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

merch-card-collection {
    display: contents;
}

merch-card-collection > merch-card:not([style]) {
    display: none;
}

merch-card-collection > p[slot],
merch-card-collection > div[slot] p {
    margin: 0;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    display: grid;
    justify-content: center;
    justify-items: stretch;
    align-items: normal;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
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

merch-card [slot='callout-content'] .icon-button {
    position: relative;
    top: 3px;
}

merch-card [slot='callout-content'] .icon-button:before {
    display: inline-block;
    content: '';
    width: 14px;
    height: 14px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>')
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

merch-sidenav-checkbox-group h3 {
    font-size: 14px;
    height: 32px;
    letter-spacing: 0px;
    line-height: 18.2px;
    color: var(--color-gray-600);
    margin: 0px;
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
`;document.head.appendChild(Ne);var bt=class o extends Error{constructor(e,t,r){if(super(e,{cause:r}),this.name="MasError",t.response){let a=t.response.headers?.get(Ct);a&&(t.requestId=a),t.response.status&&(t.status=t.response.status,t.statusText=t.response.statusText),t.response.url&&(t.url=t.response.url)}delete t.response,this.context=t,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let e=Object.entries(this.context||{}).map(([r,a])=>`${r}: ${JSON.stringify(a)}`).join(", "),t=`${this.name}: ${this.message}`;return e&&(t+=` (${e})`),this.cause&&(t+=`
Caused by: ${this.cause}`),t}};var mr={requestId:Ct,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function $e(o){let e={};if(!o?.headers)return e;let t=o.headers;for(let[r,a]of Object.entries(mr)){let n=t.get(a);n&&(n=n.replace(/[,;]/g,"|"),n=n.replace(/[| ]+/g,"|"),e[r]=n)}return e}async function Ie(o,e={},t=2,r=100){let a;for(let n=0;n<=t;n++)try{let i=await fetch(o,e);return i.retryCount=n,i}catch(i){if(a=i,a.retryCount=n,n>t)break;await new Promise(s=>setTimeout(s,r*(n+1)))}throw a}var Be=new CSSStyleSheet;Be.replaceSync(":host { display: contents; }");var De="fragment",Fe="author",He="preview",Xt="aem-fragment",P,Zt=class{constructor(){p(this,P,new Map)}clear(){c(this,P).clear()}addByRequestedId(e,t){c(this,P).set(e,t)}put(e,t){c(this,P).set(e,t)}add(...e){e.forEach(t=>{let{id:r}=t;r&&c(this,P).set(r,t)})}has(e){return c(this,P).has(e)}get(e){return c(this,P).get(e)}remove(e){c(this,P).delete(e)}};P=new WeakMap;var Dt=new Zt,ct,z,O,x,T,w,k,vt,yt,st,C,Ue,qe,te,Ge,Jt=class extends HTMLElement{constructor(){super();p(this,C);d(this,"cache",Dt);p(this,ct);p(this,z,null);p(this,O,null);p(this,x,{url:null,retryCount:0,stale:!1,measure:null,status:null});p(this,T,null);p(this,w);p(this,k);p(this,vt,!1);p(this,yt,0);p(this,st);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Be]}static get observedAttributes(){return[De,Fe,He]}attributeChangedCallback(t,r,a){t===De&&m(this,w,a),t===Fe&&m(this,vt,["","true"].includes(a)),t===He&&m(this,st,a)}connectedCallback(){if(!c(this,k)){if(c(this,T)??m(this,T,X(this)),m(this,st,c(this,T).settings?.preview),c(this,ct)??m(this,ct,c(this,T).log.module(`${Xt}[${c(this,w)}]`)),!c(this,w)||c(this,w)==="#"){E(this,C,te).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(c(this,x)).filter(([t,r])=>r!=null).map(([t,r])=>[`aem-fragment:${t}`,r]))}async refresh(t=!0){if(c(this,k)&&!await Promise.race([c(this,k),Promise.resolve(!1)]))return;t&&Dt.remove(c(this,w));try{m(this,k,E(this,C,Ge).call(this)),await c(this,k)}catch(i){return E(this,C,te).call(this,i.message),!1}let{references:r,referencesTree:a,placeholders:n}=c(this,z)||{};return this.dispatchEvent(new CustomEvent(Y,{detail:{...this.data,references:r,referencesTree:a,placeholders:n,...c(this,x)},bubbles:!0,composed:!0})),c(this,k)}get updateComplete(){return c(this,k)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return c(this,O)?c(this,O):(c(this,vt)?this.transformAuthorData():this.transformPublishData(),c(this,O))}transformAuthorData(){let{fields:t,id:r,tags:a,settings:n={}}=c(this,z);m(this,O,t.reduce((i,{name:s,multiple:l,values:h})=>(i.fields[s]=l?h:h[0],i),{fields:{},id:r,tags:a,settings:n}))}transformPublishData(){let{fields:t,id:r,tags:a,settings:n={}}=c(this,z);m(this,O,Object.entries(t).reduce((i,[s,l])=>(i.fields[s]=l?.mimeType?l.value:l??"",i),{fields:{},id:r,tags:a,settings:n}))}async generatePreview(){let{previewFragment:t}=await import("https://mas.adobe.com/studio/libs/fragment-client.js");return await t(c(this,w),{locale:c(this,T).settings.locale,apiKey:c(this,T).settings.wcsApiKey})}};ct=new WeakMap,z=new WeakMap,O=new WeakMap,x=new WeakMap,T=new WeakMap,w=new WeakMap,k=new WeakMap,vt=new WeakMap,yt=new WeakMap,st=new WeakMap,C=new WeakSet,Ue=async function(t){ce(this,yt)._++;let r=`${Xt}:${c(this,w)}:${c(this,yt)}`,a=`${r}${_t}`,n=`${r}${Lt}`;if(c(this,st))return await this.generatePreview();performance.mark(a);let i;try{if(c(this,x).stale=!1,c(this,x).url=t,i=await Ie(t,{cache:"default",credentials:"omit"}),E(this,C,qe).call(this,i),c(this,x).status=i?.status,c(this,x).measure=Q(performance.measure(n,a)),c(this,x).retryCount=i.retryCount,!i?.ok)throw new bt("Unexpected fragment response",{response:i,...c(this,T).duration});return await i.json()}catch(s){if(c(this,x).measure=Q(performance.measure(n,a)),c(this,x).retryCount=s.retryCount,c(this,z))return c(this,x).stale=!0,c(this,ct).error("Serving stale data",c(this,x)),c(this,z);let l=s.message??"unknown";throw new bt(`Failed to fetch fragment: ${l}`,{})}},qe=function(t){Object.assign(c(this,x),$e(t))},te=function(t){m(this,k,null),c(this,x).message=t,this.classList.add("error");let r={...c(this,x),...c(this,T).duration};c(this,ct).error(t,r),this.dispatchEvent(new CustomEvent(K,{detail:r,bubbles:!0,composed:!0}))},Ge=async function(){this.classList.remove("error"),m(this,O,null);let t=Dt.get(c(this,w));if(t)return m(this,z,t),!0;let{masIOUrl:r,wcsApiKey:a,locale:n}=c(this,T).settings,i=`${r}/fragment?id=${c(this,w)}&api_key=${a}&locale=${n}`;return t=await E(this,C,Ue).call(this,i),Dt.addByRequestedId(c(this,w),t),m(this,z,t),!0};customElements.define(Xt,Jt);import{LitElement as pr,html as gr,css as ur}from"../lit-all.min.js";var dt=class extends pr{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return gr`<div class="badge">
            ${this.text}
        </div>`}};d(dt,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),d(dt,"styles",ur`
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
    `);customElements.define("merch-badge",dt);import{html as fr,css as xr,LitElement as br}from"../lit-all.min.js";var Et=class extends br{constructor(){super()}render(){return fr`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};d(Et,"styles",xr`
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
    `),d(Et,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",Et);import{html as ee,css as vr,LitElement as yr}from"../lit-all.min.js";var wt=class extends yr{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((e,t)=>{t>=5&&(e.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return ee`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?ee`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:ee``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};d(wt,"styles",vr`
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
    `),d(wt,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",wt);function Er(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var St,B=class B extends HTMLAnchorElement{constructor(){super();p(this,St,!1);this.setAttribute("is",B.is)}get isUptLink(){return!0}initializeWcsData(t,r){this.setAttribute("data-wcs-osi",t),r&&this.setAttribute("data-promotion-code",r),m(this,St,!0),this.composePromoTermsUrl()}attributeChangedCallback(t,r,a){c(this,St)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let t=this.getAttribute("data-wcs-osi");if(!t){let y=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${y}`);return}let r=X(),a=[t],n=this.getAttribute("data-promotion-code"),{country:i,language:s,env:l}=r.settings,h={country:i,language:s,wcsOsi:a,promotionCode:n},A=r.resolveOfferSelectors(h);Promise.all(A).then(([[y]])=>{let D=`locale=${s}_${i}&country=${i}&offer_id=${y.offerId}`;n&&(D+=`&promotion_code=${encodeURIComponent(n)}`),this.href=`${Er(l)}?${D}`}).catch(y=>{console.error(`Could not resolve offer selectors for id: ${t}.`,y.message)})}static createFrom(t){let r=new B;for(let a of t.attributes)a.name!=="is"&&(a.name==="class"&&a.value.includes("upt-link")?r.setAttribute("class",a.value.replace("upt-link","").trim()):r.setAttribute(a.name,a.value));return r.innerHTML=t.innerHTML,r.setAttribute("tabindex",0),r}};St=new WeakMap,d(B,"is","upt-link"),d(B,"tag","a"),d(B,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var I=B;window.customElements.get(I.is)||window.customElements.define(I.is,I,{extends:I.tag});var wr="#000000",re="#F8D904",Sr="#EAEAEA",Ar="#31A547",Tr=/(accent|primary|secondary)(-(outline|link))?/,kr="mas:product_code/",Cr="daa-ll",Ft="daa-lh",_r=["XL","L","M","S"],oe="...";function _(o,e,t,r){let a=r[o];if(e[o]&&a){let n={slot:a?.slot},i=e[o];if(a.maxCount&&typeof i=="string"){let[l,h]=qr(i,a.maxCount,a.withSuffix);l!==i&&(n.title=h,i=l)}let s=v(a.tag,n,i);t.append(s)}}function Lr(o,e,t){let r=o.mnemonicIcon?.map((n,i)=>({icon:n,alt:o.mnemonicAlt[i]??"",link:o.mnemonicLink[i]??""}));r?.forEach(({icon:n,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let l={slot:"icons",src:n,loading:e.loading,size:t?.size??"l"};i&&(l.alt=i),s&&(l.href=s);let h=v("merch-icon",l);e.append(h)});let a=e.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&a&&a.remove()}function Rr(o,e,t){if(t.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=re,a=!1;t.allowedBadgeColors?.includes(t.badge?.default)&&(r=t.badge?.default,o.borderColor||(a=!0));let n=o.badgeBackgroundColor||r,i=o.borderColor||"";a&&(i=t.badge?.default,o.borderColor=t.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${n}" border-color="${i}">${o.badge}</merch-badge>`}_("badge",o,e,t)}else o.badge?(e.setAttribute("badge-text",o.badge),e.setAttribute("badge-color",o.badgeColor||wr),e.setAttribute("badge-background-color",o.badgeBackgroundColor||re),e.setAttribute("border-color",o.badgeBackgroundColor||re)):e.setAttribute("border-color",o.borderColor||Sr)}function Mr(o,e,t){if(t.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||Ar;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}_("trialBadge",o,e,t)}}function Pr(o,e,t){t?.includes(o.size)&&e.setAttribute("size",o.size)}function zr(o,e,t){_("cardTitle",o,e,{cardTitle:t})}function Or(o,e,t){_("subtitle",o,e,t)}function Nr(o,e,t,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){e.style.removeProperty("--merch-card-custom-background-color"),e.removeAttribute("background-color");return}t?.[o.backgroundColor]?(e.style.setProperty("--merch-card-custom-background-color",`var(${t[o.backgroundColor]})`),e.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(e.setAttribute(r.attribute,o.backgroundColor),e.style.removeProperty("--merch-card-custom-background-color"))}function $r(o,e,t){let r=t?.borderColor,a="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(e.style.removeProperty(a),t?.allowedBorderColors?.includes(t?.badge?.default)&&e.style.setProperty(a,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(e.setAttribute("gradient-border","true"),e.style.removeProperty(a)):e.style.setProperty(a,`var(--${o.borderColor})`))}function Ir(o,e,t){if(o.backgroundImage){let r={loading:e.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!t)return;if(t?.attribute){e.setAttribute(t.attribute,o.backgroundImage);return}e.append(v(t.tag,{slot:t.slot},v("img",r)))}}function Dr(o,e,t){_("prices",o,e,t)}function Fr(o,e,t){_("promoText",o,e,t),_("description",o,e,t),_("callout",o,e,t),_("quantitySelect",o,e,t),_("whatsIncluded",o,e,t)}function Hr(o,e,t){if(!t.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let a=v("merch-addon",{slot:"addon"},r);[...a.querySelectorAll(b)].forEach(n=>{let i=n.parentElement;i?.nodeName==="P"&&i.setAttribute("data-plan-type","")}),e.append(a)}function Br(o,e,t){o.addonConfirmation&&_("addonConfirmation",o,e,t)}function Ur(o,e,t,r){r?.secureLabel&&t?.secureLabel&&e.setAttribute("secure-label",r.secureLabel)}function qr(o,e,t=!0){try{let r=typeof o!="string"?"":o,a=Ve(r);if(a.length<=e)return[r,a];let n=0,i=!1,s=t?e-oe.length<1?1:e-oe.length:e,l=[];for(let y of r){if(n++,y==="<")if(i=!0,r[n]==="/")l.pop();else{let D="";for(let V of r.substring(n)){if(V===" "||V===">")break;D+=V}l.push(D)}if(y==="/"&&r[n]===">"&&l.pop(),y===">"){i=!1;continue}if(!i&&(s--,s===0))break}let h=r.substring(0,n).trim();if(l.length>0){l[0]==="p"&&l.shift();for(let y of l.reverse())h+=`</${y}>`}return[`${h}${t?oe:""}`,a]}catch{let a=typeof o=="string"?o:"",n=Ve(a);return[a,n]}}function Ve(o){if(!o)return"";let e="",t=!1;for(let r of o){if(r==="<"&&(t=!0),r===">"){t=!1;continue}t||(e+=r)}return e}function Gr(o,e){e.querySelectorAll("a.upt-link").forEach(r=>{let a=I.createFrom(r);r.replaceWith(a),a.initializeWcsData(o.osi,o.promoCode)})}function Vr(o,e,t,r,a){let n=o;a?n=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):n.innerHTML=`<span>${n.textContent}</span>`,n.setAttribute("tabindex",0);for(let A of o.attributes)["class","is"].includes(A.name)||n.setAttribute(A.name,A.value);n.firstElementChild?.classList.add("spectrum-Button-label");let i=e.ctas.size??"M",s=`spectrum-Button--${r}`,l=_r.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",h=["spectrum-Button",s,l];return t&&h.push("spectrum-Button--outline"),n.classList.add(...h),n}function jr(o,e,t,r,a){let n=o;a&&(n=customElements.get("checkout-button").createCheckoutButton(o.dataset),n.connectedCallback(),n.render());let i="fill";t&&(i="outline");let s=v("sp-button",{treatment:i,variant:r,tabIndex:0,size:e.ctas.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return s.source=n,(a?n.onceSettled():Promise.resolve(n)).then(l=>{s.setAttribute("data-navigation-url",l.href)}),s.addEventListener("click",l=>{l.defaultPrevented||n.click()}),s}function Yr(o,e,t){let r=o;return t&&(r=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r.classList.add("con-button"),e&&r.classList.add("blue"),r}function Kr(o,e,t,r){if(o.ctas){let{slot:a}=t.ctas,n=v("div",{slot:a},o.ctas),i=[...n.querySelectorAll("a")].map(s=>{let l=s.hasAttribute("data-wcs-osi")&&!!s.getAttribute("data-wcs-osi"),h=Tr.exec(s.className)?.[0]??"accent",A=h.includes("accent"),y=h.includes("primary"),D=h.includes("secondary"),V=h.includes("-outline"),We=h.includes("-link");if(s.classList.remove("accent","primary","secondary"),e.consonant)return Yr(s,A,l);if(We)return s;let mt;return A?mt="accent":y?mt="primary":D&&(mt="secondary"),e.spectrum==="swc"?jr(s,t,V,mt,l):Vr(s,t,V,mt,l)});n.innerHTML="",n.append(...i),e.append(n)}}function Wr(o,e){let{tags:t}=o,r=t?.find(n=>n.startsWith(kr))?.split("/").pop();if(!r)return;e.setAttribute(Ft,r),[...e.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...e.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((n,i)=>{n.setAttribute(Cr,`${n.dataset.analyticsId}-${i+1}`)})}function Qr(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([e,t])=>{o.querySelectorAll(`a.${e}`).forEach(r=>{r.classList.remove(e),r.classList.add("spectrum-Link",`spectrum-Link--${t}`)})})}function Xr(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",Ft].forEach(r=>o.removeAttribute(r));let t=["wide-strip","thin-strip"];o.classList.remove(...t)}async function je(o,e){if(!o){let s=e?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${s}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${s}).`)}if(!o.fields){let s=o.id||"unknown",l=e?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'.`)}let{id:t,fields:r,settings:a={}}=o,{variant:n}=r;if(!n)throw new Error(`hydrate: no variant found in payload ${t}`);Xr(e),e.settings=a,e.id??(e.id=o.id),e.variant=n,await e.updateComplete;let{aemFragmentMapping:i}=e.variantLayout;if(!i)throw new Error(`hydrate: variant mapping not found for ${t}`);i.style==="consonant"&&e.setAttribute("consonant",!0),Lr(r,e,i.mnemonics),Rr(r,e,i),Mr(r,e,i),Pr(r,e,i.size),zr(r,e,i.title),Or(r,e,i),Dr(r,e,i),Ir(r,e,i.backgroundImage),Nr(r,e,i.allowedColors,i.backgroundColor),$r(r,e,i),Fr(r,e,i),Hr(r,e,i),Br(r,e,i),Ur(r,e,i,a),Gr(r,e),Kr(r,e,i,n),Wr(r,e),Qr(e)}var ne="merch-card",ae=2e4,Ye="merch-card:";function Ke(o,e){let t=o.closest(ne);if(!t)return e;t.variantLayout?.priceOptionsProvider?.(o,e)}function Jr(o){o.providers.has(Ke)||o.providers.price(Ke)}var to=0,lt,ht,At,N,G,$,q,U=class extends Zr{constructor(){super();p(this,$);p(this,lt);p(this,ht);p(this,At);p(this,N);p(this,G);d(this,"customerSegment");d(this,"marketSegment");d(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=Qt(this,!1),this.variantLayout?.connectedCallbackHook()}willUpdate(t){(t.has("variant")||!this.variantLayout)&&(this.variantLayout=Qt(this),this.variantLayout.connectedCallbackHook())}updated(t){(t.has("badgeBackgroundColor")||t.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),t.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayout?.postCardUpdateHook(t)}catch(r){E(this,$,q).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(b)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(kt)??[]]}async toggleStockOffer({target:t}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let a of r){await a.onceSettled();let n=a.value?.[0]?.planType;if(!n)return;let i=this.stockOfferOsis[n];if(!i)return;let s=a.dataset.wcsOsi.split(",").filter(l=>l!==i);t.checked&&s.push(i),a.dataset.wcsOsi=s.join(",")}}changeHandler(t){t.target.tagName==="MERCH-ADDON"&&this.toggleAddon(t.target)}toggleAddon(t){let r=this.checkoutLinks;if(this.variantLayout?.toggleAddon?.(t),r.length!==0)for(let a of r){let{offerType:n,planType:i}=a.value?.[0];if(!n||!i)return;let s=t.getOsi(i,n),l=a.dataset.wcsOsi.split(",").filter(h=>h!==s);t.checked&&l.push(s),a.dataset.wcsOsi=l.join(",")}}handleQuantitySelection(t){let r=this.checkoutLinks;for(let a of r)a.dataset.quantity=t.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(t){let r={...this.filters};Object.keys(r).forEach(a=>{if(t){r[a].order=Math.min(r[a].order||2,2);return}let n=r[a].order;n===1||isNaN(n)||(r[a].order=Number(n)+1)}),this.filters=r}includes(t){return this.textContent.match(new RegExp(t,"i"))!==null}connectedCallback(){super.connectedCallback(),c(this,ht)||m(this,ht,to++),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let t=this.id??c(this,ht);m(this,G,`${Ye}${t}${_t}`),m(this,lt,`${Ye}${t}${Lt}`),performance.mark(c(this,G)),m(this,N,X()),Jr(c(this,N)),m(this,At,c(this,N).Log.module(ne)),this.addEventListener(Bt,this.handleQuantitySelection),this.addEventListener(Ut,this.handleAddonAndQuantityUpdate),this.addEventListener(ge,this.handleMerchOfferSelectReady),this.addEventListener(K,this.handleAemFragmentEvents),this.addEventListener(Y,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Bt,this.handleQuantitySelection),this.removeEventListener(K,this.handleAemFragmentEvents),this.removeEventListener(Y,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(Ut,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(t){if(this.isConnected&&(t.type===K&&E(this,$,q).call(this,"AEM fragment cannot be loaded"),t.type===Y&&(this.failed=!1,t.target.nodeName==="AEM-FRAGMENT"))){let r=t.detail;try{await je(r,this)}catch(a){E(this,$,q).call(this,`hydration has failed: ${a.message}`)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;let t=new Promise(i=>setTimeout(()=>i("timeout"),ae));if(this.aemFragment){let i=await Promise.race([this.aemFragment.updateComplete,t]);if(i===!1||i==="timeout"){let s=i==="timeout"?`AEM fragment was not resolved within ${ae} timeout`:"AEM fragment cannot be loaded";E(this,$,q).call(this,s,{},!1);return}}let r=[...this.querySelectorAll(pe)],a=Promise.all(r.map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),n=await Promise.race([a,t]);if(n===!0){this.measure=performance.measure(c(this,lt),c(this,G));let i={...this.aemFragment?.fetchInfo,...c(this,N).duration,measure:Q(this.measure)};return this.dispatchEvent(new CustomEvent(xe,{bubbles:!0,composed:!0,detail:i})),this}else{this.measure=performance.measure(c(this,lt),c(this,G));let i={measure:Q(this.measure),...c(this,N).duration};n==="timeout"?E(this,$,q).call(this,`Contains offers that were not resolved within ${ae} timeout`,i):E(this,$,q).call(this,"Contains unresolved offers",i)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let t=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(kt)).length===2&&t&&t.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:t,items:r}}){if(!t||!r?.length)return;let a=this.checkoutLinks.find(h=>h.getAttribute("data-modal-id")===t);if(!a)return;let i=new URL(a.getAttribute("href")).searchParams.get("pa"),s=r.find(h=>h.productArrangementCode===i)?.quantity,l=!!r.find(h=>h.productArrangementCode!==i);if(s&&this.quantitySelect?.dispatchEvent(new CustomEvent(fe,{detail:{quantity:s},bubbles:!0,composed:!0})),this.addonCheckbox?.checked!==l){this.toggleStockOffer({target:this.addonCheckbox});let h=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(h,"target",{writable:!1,value:{checked:l}}),this.addonCheckbox.handleChange(h)}}};lt=new WeakMap,ht=new WeakMap,At=new WeakMap,N=new WeakMap,G=new WeakMap,$=new WeakSet,q=function(t,r={},a=!0){if(!this.isConnected)return;let i=this.aemFragment?.getAttribute("fragment");i=`[${i}]`;let s={...this.aemFragment.fetchInfo,...c(this,N).duration,...r,message:t};c(this,At).error(`merch-card${i}: ${t}`,s),this.failed=!0,a&&this.dispatchEvent(new CustomEvent(be,{bubbles:!0,composed:!0,detail:s}))},d(U,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:t=>{if(!t)return;let[r,a,n]=t.split(",");return{PUF:r,ABM:a,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:t=>Object.fromEntries(t.split(",").map(r=>{let[a,n,i]=r.split(":"),s=Number(n);return[a,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:t=>Object.entries(t).map(([r,{order:a,size:n}])=>[r,a,n].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Ft,reflect:!0},loading:{type:String}}),d(U,"styles",[le,...he()]),d(U,"registerVariant",S),d(U,"getFragmentMapping",zt);customElements.define(ne,U);export{U as MerchCard};

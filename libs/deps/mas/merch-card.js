var tr=Object.defineProperty;var dt=a=>{throw TypeError(a)};var rr=(a,t,e)=>t in a?tr(a,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):a[t]=e;var d=(a,t,e)=>rr(a,typeof t!="symbol"?t+"":t,e),Be=(a,t,e)=>t.has(a)||dt("Cannot "+e);var c=(a,t,e)=>(Be(a,t,"read from private field"),e?e.call(a):t.get(a)),p=(a,t,e)=>t.has(a)?dt("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(a):t.set(a,e),m=(a,t,e,r)=>(Be(a,t,"write to private field"),r?r.call(a,e):t.set(a,e),e),w=(a,t,e)=>(Be(a,t,"access private method"),e);var lt=(a,t,e,r)=>({set _(n){m(a,t,n,e)},get _(){return c(a,t,r)}});import{LitElement as ca}from"../lit-all.min.js";import{css as pt,unsafeCSS as mt}from"../lit-all.min.js";var T="(max-width: 767px)",V="(max-width: 1199px)",f="(min-width: 768px)",g="(min-width: 1200px)",R="(min-width: 1600px)";function ke(){return window.matchMedia(T)}function Ce(){return window.matchMedia(g)}function D(){return ke().matches}function ht(){return Ce().matches}var gt=pt`
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
`,ut=()=>[pt`
      /* Tablet */
      @media screen and ${mt(f)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${mt(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as ar,html as ft,css as nr}from"../lit-all.min.js";var Y=class extends ar{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?ft`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:ft` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};d(Y,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),d(Y,"styles",nr`
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
    `);customElements.define("merch-icon",Y);var ba=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),va=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var v='span[is="inline-price"][data-wcs-osi]',K='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var xt=`${v},${K}`;var bt="merch-offer-select:ready",vt="merch-card:action-menu-toggle";var He="merch-quantity-selector:change",yt="merch-card-quantity:change",Ue="merch-modal:addon-and-quantity-update";var W="aem:load",Q="aem:error",Et="mas:ready",wt="mas:error";var qe="mas:resolved";var Te="X-Request-Id",ya=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var Ea=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var Le=":start",_e=":duration";var St="legal";var or="mas-commerce-service";function At(a,t){let e;return function(){let r=this,n=arguments;clearTimeout(e),e=setTimeout(()=>a.apply(r,n),t)}}function E(a,t={},e=null,r=null){let n=r?document.createElement(a,{is:r}):document.createElement(a);e instanceof HTMLElement?n.appendChild(e):n.innerHTML=e;for(let[o,i]of Object.entries(t))n.setAttribute(o,i);return n}function X(a){return`startTime:${a.startTime.toFixed(2)}|duration:${a.duration.toFixed(2)}`}function kt(){return window.matchMedia("(max-width: 1024px)").matches}function Z(){return document.getElementsByTagName(or)?.[0]}var pe,B,ge,ue,J,Me=class extends HTMLElement{constructor(){super();p(this,pe,"");p(this,B);p(this,ge,[]);p(this,ue,[]);p(this,J);m(this,J,At(()=>{this.isConnected&&(this.parentElement.style.background=this.value,c(this,B)?this.parentElement.style.borderRadius=c(this,B):c(this,B)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let e=c(this,ge).map((r,n)=>{let o=c(this,ue)[n]||"";return`${r} ${o}`}).join(", ");return`linear-gradient(${c(this,pe)}, ${e})`}connectedCallback(){c(this,J).call(this)}attributeChangedCallback(e,r,n){e==="border-radius"&&m(this,B,n?.trim()),e==="colors"&&n?m(this,ge,n?.split(",").map(o=>o.trim())??[]):e==="positions"&&n?m(this,ue,n?.split(",").map(o=>o.trim())??[]):e==="angle"&&m(this,pe,n?.trim()??""),c(this,J).call(this)}};pe=new WeakMap,B=new WeakMap,ge=new WeakMap,ue=new WeakMap,J=new WeakMap;customElements.define("merch-gradient",Me);import{LitElement as ir,html as cr,css as sr}from"../lit-all.min.js";var ee=class extends ir{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this),this.handleCustomClick=this.handleCustomClick.bind(this)}getOsi(t,e){let o=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION","TRIAL"],PROMOTION:["PROMOTION","BASE","TRIAL"]}[e]||[e]).map(s=>`p[data-plan-type="${t}"] ${v}[data-offer-type="${s}"]`).join(", ");return this.querySelector(o)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(qe,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(qe,this.updatePlanType)}updatePlanType(t){if(t.target.tagName!=="SPAN")return;let e=t.target,r=e?.value?.[0];r&&(e.setAttribute("data-offer-type",r.offerType),e.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}handleCustomClick(){this.shadowRoot.querySelector("input").click()}render(){return cr`
            <input
                type="checkbox"
                id="addon-checkbox"
                part="checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <span id="custom-checkbox" @click=${this.handleCustomClick}></span>
            <label for="addon-checkbox" part="label">
                <slot></slot>
            </label>`}};d(ee,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0},customCheckbox:{type:Boolean,attribute:"custom-checkbox",reflect:!0}}),d(ee,"styles",sr`
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
    `);customElements.define("merch-addon",ee);import{html as Re,nothing as dr}from"../lit-all.min.js";var te,fe=class fe{constructor(t){d(this,"card");p(this,te);this.card=t,this.insertVariantStyle()}getContainer(){return m(this,te,c(this,te)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),c(this,te)}insertVariantStyle(){if(!fe.styleMap[this.card.variant]){fe.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,e){if(!t)return;let r=`--consonant-merch-card-${this.card.variant}-${e}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),o=parseInt(this.getContainer().style.getPropertyValue(r))||0;n>o&&this.getContainer().style.setProperty(r,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Re`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Re` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Re`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:dr}get secureLabelFooter(){return Re`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,e=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||e===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-e-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Pe(this.card.variant)}};te=new WeakMap,d(fe,"styleMap",{});var u=fe;import{html as Ge,css as lr}from"../lit-all.min.js";var Ct=`
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

@media screen and ${f} {
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
}`;var Tt={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},re=class extends u{constructor(e){super(e);d(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(vt,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});d(this,"toggleActionMenu",e=>{if(!this.actionMenuContentSlot||!e||e.type!=="click"&&e.code!=="Space"&&e.code!=="Enter")return;e.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});d(this,"toggleActionMenuFromCard",e=>{let r=e?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});d(this,"hideActionMenu",e=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Ge` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${kt()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Ge`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Ge`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Ct}setAriaExpanded(e,r){e.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};d(re,"variantStyle",lr`
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
    `);import{html as xe}from"../lit-all.min.js";var Lt=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${f} {
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
`;var ze=class extends u{constructor(t){super(t)}getGlobalCSS(){return Lt}renderLayout(){return xe`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?xe`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:xe`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
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
          `}`}};import{html as Mt}from"../lit-all.min.js";var _t=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${f} {
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
`;var Ne=class extends u{constructor(t){super(t)}getGlobalCSS(){return _t}renderLayout(){return Mt` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Mt`<hr />`} ${this.secureLabelFooter}`}};import{html as ae,css as hr,unsafeCSS as je}from"../lit-all.min.js";var Rt=`
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

@media screen and ${V} {
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
@media screen and ${f} {
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
`;var mr=32,ne=class extends u{constructor(e){super(e);d(this,"getRowMinHeightPropertyName",e=>`--consonant-merch-card-footer-row-${e}-min-height`);d(this,"getMiniCompareFooter",()=>{let e=this.card.secureLabel?ae`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:ae`<slot name="secure-transaction-label"></slot>`;return ae`<footer>${e}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Rt}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let e=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&e.push("footer-rows"),e.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let e=this.card.querySelector('[slot="footer-rows"] ul');!e||!e.children||[...e.children].forEach((r,n)=>{let o=Math.max(mr,parseFloat(window.getComputedStyle(r).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;o>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${o}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let n=r.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${v}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(e){let r=this.mainPrice,n=this.headingMPriceSlot;if(!r&&n){let o=e?.getAttribute("plan-type"),i=null;if(e&&o&&(i=e.querySelector(`p[data-plan-type="${o}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),e.checked){if(i){let s=E("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},i.innerHTML);this.card.appendChild(s)}}else{let s=E("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let r=this.mainPrice,n=this.card.planType;r&&(await r.onceSettled(),n=r.value?.[0]?.planType),n&&(e.planType=n)}renderLayout(){return ae` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?ae`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:ae`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(e=>e.onceSettled())),await this.adjustAddon(),D()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};d(ne,"variantStyle",hr`
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

    @media screen and ${je(T)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${je(V)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${je(g)} {
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
  `);import{html as Oe,css as pr,nothing as Ve}from"../lit-all.min.js";var Pt=`
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

.plans-container {
    display: flex;
    justify-content: center;
    gap: 36px;
}

.plans-container merch-card-collection {
    padding: 0;
}

merch-card[variant^="plans"] merch-addon span[data-template="price"] {
    display: none;
}

/* Mobile */
@media screen and ${T} {
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
@media screen and ${f} {
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
  .columns.merch-card > .row {
      grid-template-columns: repeat(auto-fit, calc(var(--consonant-merch-card-plans-width)*2 + var(--consonant-merch-spacing-m)));
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
  .columns .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
  merch-card[variant="plans-students"] {
      width: var(--consonant-merch-card-plans-students-width);
  }
}

/* Large desktop */
    @media screen and ${R} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;var $e={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},zt={...function(){let{whatsIncluded:a,size:t,...e}=$e;return e}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Nt={...function(){let{whatsIncluded:a,size:t,quantitySelect:e,...r}=$e;return r}()},P=class extends u{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,e){t.dataset.template===St&&(e.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Pt}adjustSlotPlacement(t,e,r){let n=this.card.shadowRoot,o=n.querySelector("footer"),i=this.card.getAttribute("size"),s=n.querySelector(`footer slot[name="${t}"]`),l=n.querySelector(`.body slot[name="${t}"]`),h=n.querySelector(".body");if((!i||!i.includes("wide"))&&(o?.classList.remove("wide-footer"),s&&s.remove()),!!e.includes(i)){if(o?.classList.toggle("wide-footer",!D()),!r&&s){l?s.remove():h.appendChild(s);return}r&&l&&(s?l.remove():o.prepend(l))}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["wide","super-wide"],!D()),this.adjustSlotPlacement("callout-content",["super-wide"],ht())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.remove("hide-tooltip")}))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${v}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Oe`<div class="divider"></div>`:Ve}async adjustLegal(){if(await this.card.updateComplete,this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],e=this.card.querySelector(`[slot="heading-m"] ${v}[data-template="price"]`);e&&t.push(e),this.card.querySelectorAll(`[slot="body-xs"] ${v}[data-template="price"]`).forEach(o=>t.push(o));let n=t.map(async o=>{let i=o.cloneNode(!0);await o.onceSettled(),o?.options&&(o.options.displayPerUnit&&(o.dataset.displayPerUnit="false"),o.options.displayTax&&(o.dataset.displayTax="false"),o.options.displayPlanType&&(o.dataset.displayPlanType="false"),i.setAttribute("data-template","legal"),o.parentNode.insertBefore(i,o.nextSibling))});await Promise.all(n)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let e=this.mainPrice;if(!e)return;await e.onceSettled();let r=e.value?.[0]?.planType;r&&(t.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?Oe`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Ve}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Ve:Oe`<slot name="icons"></slot>`}connectedCallbackHook(){let t=ke();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let e=Ce();e?.addEventListener&&e.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=ke();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let e=Ce();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMedia)}renderLayout(){return Oe` ${this.badge}
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
            ${this.secureLabelFooter}`}};d(P,"variantStyle",pr`
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
    `);import{html as Ye,css as gr}from"../lit-all.min.js";var Ot=`
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
@media screen and ${f} {
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
`;var H=class extends u{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Ot}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(e=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${e}"]`),e))}renderLayout(){return Ye` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Ye`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Ye`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),D()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${v}[data-template="price"]`)}toggleAddon(t){let e=this.mainPrice,r=this.headingXSSlot;if(!e&&r){let n=t?.getAttribute("plan-type"),o=null;if(t&&n&&(o=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(i=>i.remove()),t.checked){if(o){let i=E("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},o.innerHTML);this.card.appendChild(i)}}else{let i=E("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let e=this.mainPrice,r=this.card.planType;e&&(await e.onceSettled(),r=e.value?.[0]?.planType),r&&(t.planType=r)}};d(H,"variantStyle",gr`
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
    `);import{html as Ke,css as ur}from"../lit-all.min.js";var $t=`
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

@media screen and ${f} {
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
`;var oe=class extends u{constructor(t){super(t)}getGlobalCSS(){return $t}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ke` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ke`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ke`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};d(oe,"variantStyle",ur`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as We,css as fr}from"../lit-all.min.js";var It=`
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
  
@media screen and ${f} {
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
`;var Ft={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ie=class extends u{constructor(t){super(t)}getGlobalCSS(){return It}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return We`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?We`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:We`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};d(ie,"variantStyle",fr`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as xr,css as br}from"../lit-all.min.js";var Dt=`
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

/* Grid layout for simplified-pricing-express cards */
.section .content:has(merch-card[variant="simplified-pricing-express"]) {
    display: grid;
    justify-content: center;
    justify-items: center;
    align-items: stretch;
    gap: var(--consonant-merch-spacing-m);
    padding: var(--spacing-m);
}

/* Mobile/Tablet - Single column */
@media screen and ${V} {
    .section .content:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: 1fr;
    }
    
    merch-card[variant="simplified-pricing-express"] {
        width: 100%;
        max-width: var(--consonant-merch-card-simplified-pricing-express-width);
    }
}

/* Desktop - 4 columns */
@media screen and ${g} {
    .section .content:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: repeat(4, var(--consonant-merch-card-simplified-pricing-express-width));
        max-width: calc(4 * var(--consonant-merch-card-simplified-pricing-express-width) + 3 * var(--consonant-merch-spacing-m));
        margin: 0 auto;
    }
}

merch-card[variant="simplified-pricing-express"] p {
    margin: 0 !important;
}

merch-card[variant="simplified-pricing-express"] [slot="body-s"] {
    font-size: var(--merch-card-simplified-pricing-express-body-s-font-size);
    line-height: var(--merch-card-simplified-pricing-express-body-s-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] {
    display: flex;
    flex-direction: row;
    margin-top: auto;
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.button {
    width: 100%;
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
  text-decoration: none !important;
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
  }

  /* By default, hide content sections on mobile until JavaScript sets data-expanded */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="body-s"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Also apply to cards without data-expanded attribute */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="body-s"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Fix spacing between cards on mobile */
  main .section .content p:has(merch-card[variant="simplified-pricing-express"]),
  main .section p:has(merch-card[variant="simplified-pricing-express"]) {
    margin: 0;
  }

  /* Collapsed state - target slotted content */
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="body-s"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="price"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="cta"] {
    display: none;
    visibility: hidden;
    height: 0;
    margin: 0;
    padding: 0;
  }

  /* Collapsed card should have fixed height and padding */
  merch-card[variant="simplified-pricing-express"][data-expanded="false"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) {
    height: 72px;
    min-height: auto;
    padding: 16px;
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

  /* Apply same collapsed state logic as mobile */
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="body-s"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) [slot="cta"] {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="body-s"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="price"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded]) [slot="cta"] {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="body-s"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="price"],
  merch-card[variant="simplified-pricing-express"][data-expanded="false"] [slot="cta"] {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Collapsed card height on tablet */
  merch-card[variant="simplified-pricing-express"][data-expanded="false"],
  merch-card[variant="simplified-pricing-express"]:not([data-expanded="true"]) {
    height: 72px !important;
    min-height: auto !important;
    padding: 16px !important;
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
`;var Qe={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-l",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge"},description:{tag:"div",slot:"body-s",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"L"},borderColor:{attribute:"border-color",specialValues:{gray:"--spectrum-gray-300",blue:"--spectrum-blue-400",gradient:"linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)"}}},ce=class extends u{getGlobalCSS(){return Dt}get aemFragmentMapping(){return Qe}connectedCallback(){super.connectedCallbackHook(),this.setupMobileAccordion()}setupMobileAccordion(){let t=this.closest("merch-card");if(!t)return;if(window.matchMedia("(max-width: 1199px)").matches){let r=this.isFirstCard(t);t.setAttribute("data-expanded",r?"true":"false")}let e=window.matchMedia("(max-width: 1199px)");this.mediaQueryListener=r=>{if(r.matches){let n=this.isFirstCard(t);t.setAttribute("data-expanded",n?"true":"false")}else t.removeAttribute("data-expanded")},e.addEventListener("change",this.mediaQueryListener)}disconnectedCallback(){super.disconnectedCallback(),this.mediaQueryListener&&window.matchMedia("(max-width: 1199px)").removeEventListener("change",this.mediaQueryListener)}isFirstCard(t){let e=t.parentElement;for(;e&&!e.classList.contains("content");)e=e.parentElement;if(e||(e=t.closest(".section")),e||(e=t.parentElement?.parentElement),e){let r=e.querySelectorAll('merch-card[variant="simplified-pricing-express"]');return r.length>0&&r[0]===t}return!1}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let e=this.closest("merch-card");if(!e||!window.matchMedia("(max-width: 1199px)").matches)return;let r=e.getAttribute("data-expanded")==="true";e.setAttribute("data-expanded",r?"false":"true")}renderLayout(){return xr`
            <div class="header" @click=${this.handleChevronClick}>
                <slot name="heading-l"></slot>
                <slot name="badge"></slot>
                <button class="chevron-button" aria-label="Expand card" @click=${this.handleChevronClick}>
                    <svg class="chevron-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15.5L5 8.5L6.4 7.1L12 12.7L17.6 7.1L19 8.5L12 15.5Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>
            <div class="description">
                <slot name="body-s"></slot>
            </div>
            <div class="price">
                <slot name="price"></slot>
            </div>
            <div class="cta">
                <slot name="cta"></slot>
            </div>
        `}};d(ce,"variantStyle",br`
        :host([variant='simplified-pricing-express']) {
            --merch-card-simplified-pricing-express-width: 294px;
            --merch-card-simplified-pricing-express-padding: 24px;
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
            --merch-card-simplified-pricing-express-body-s-font-size: 16px;
            --merch-card-simplified-pricing-express-body-s-line-height: 20.8px;
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
            overflow: hidden;
            padding: var(--merch-card-simplified-pricing-express-padding);
            gap: 16px;
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
            align-items: flex-end;
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

        :host([variant='simplified-pricing-express']) .pricing-section {
            display: flex;
            flex-direction: column;
            gap: 8px;
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
            display: flex;
            flex-direction: row;
            gap: 8px;
            margin-top: auto;
        }

        :host([variant='simplified-pricing-express']) .cta ::slotted(*) {
            flex: 1;
            width: 100%;
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

        /* Mobile and Tablet - Show chevron */
        @media (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) .header {
                position: relative;
                padding-right: 32px;
                justify-content: flex-start;
                gap: 0;
                flex-wrap: wrap;
            }

            :host([variant='simplified-pricing-express']) .chevron-button {
                display: block;
                position: absolute;
                right: 0;
                top: 50%;
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

            /* Collapsed state */
            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) {
                gap: 0;
                padding: 16px;
                height: auto;
                min-height: auto;
            }

            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .description,
            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .price,
            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .cta {
                display: none;
                height: 0;
                overflow: hidden;
                margin: 0;
                padding: 0;
            }

            merch-card[variant='simplified-pricing-express'][data-expanded='false'] :host([variant='simplified-pricing-express']) .chevron-icon {
                transform: rotate(0deg);
            }

            /* Expanded state */
            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .chevron-icon {
                transform: rotate(180deg);
            }

            /* Smooth transitions for collapsing content */
            :host([variant='simplified-pricing-express']) .description,
            :host([variant='simplified-pricing-express']) .price,
            :host([variant='simplified-pricing-express']) .cta {
                transition: opacity 0.3s ease, transform 0.3s ease;
            }

            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .description,
            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .price,
            merch-card[variant='simplified-pricing-express'][data-expanded='true'] :host([variant='simplified-pricing-express']) .cta {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Tablet styles - 548px width */
        @media (min-width: 600px) and (max-width: 1199px) {
            :host([variant='simplified-pricing-express']) {
                width: 548px;
                max-width: 548px;
            }
        }
    `);var Xe=new Map,S=(a,t,e=null,r=null)=>{Xe.set(a,{class:t,fragmentMapping:e,style:r})};S("catalog",re,Tt,re.variantStyle);S("image",ze);S("inline-heading",Ne);S("mini-compare-chart",ne,null,ne.variantStyle);S("plans",P,$e,P.variantStyle);S("plans-students",P,Nt,P.variantStyle);S("plans-education",P,zt,P.variantStyle);S("product",H,null,H.variantStyle);S("segment",oe,null,oe.variantStyle);S("special-offers",ie,Ft,ie.variantStyle);S("simplified-pricing-express",ce,Qe,ce.variantStyle);var Ze=(a,t=!1)=>{let e=Xe.get(a.variant);if(!e)return t?void 0:new H(a);let{class:r,style:n}=e;if(n)try{let o=new CSSStyleSheet;o.replaceSync(n.cssText),a.shadowRoot.adoptedStyleSheets.push(o)}catch{let i=document.createElement("style");i.textContent=n.cssText,a.shadowRoot.appendChild(i)}return new r(a)};function Pe(a){return Xe.get(a)?.fragmentMapping}var Bt=document.createElement("style");Bt.innerHTML=`
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
    --consonant-merch-card-heading-l-font-size: 28px;
    --consonant-merch-card-heading-l-line-height: 36.4px;

    /* detail */
    --consonant-merch-card-detail-xs-line-height: 12px;
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;
    --consonant-merch-card-detail-l-line-height: 18px;
    --consonant-merch-card-detail-l-line-height: 23px;

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
    --merch-color-grey-50: var(--spectrum-gray-50);
    --merch-color-grey-60: var(--spectrum-gray-600);
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

    /* simplified-pricing-express colors */
    --spectrum-gray-100: #F8F8F8;
    --spectrum-gray-200: #E6E6E6;
    --spectrum-gray-300: #D5D5D5;
    --spectrum-gray-400: #B8B8B8;
    --spectrum-gray-500: #909090;
    --spectrum-gray-600: #6D6D6D;
    --spectrum-gray-700: #494949;
    --spectrum-gray-800: #2C2C2C;
    --spectrum-gray-900: #1C1C1C;
    --spectrum-indigo-800: #5c5ce0;
  
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

merch-card [slot='heading-l'],
merch-card span.heading-l {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    font-weight: 900;
    margin: 0;
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
`;document.head.appendChild(Bt);function Ht(a,t={},{metadata:e=!0,search:r=!0,storage:n=!0}={}){let o;if(r&&o==null){let i=new URLSearchParams(window.location.search),s=Je(r)?r:a;o=i.get(s)}if(n&&o==null){let i=Je(n)?n:a;o=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(e&&o==null){let i=vr(Je(e)?e:a);o=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return o??t[a]}var Je=a=>typeof a=="string";function vr(a=""){return String(a).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,e,r)=>`${e}-${r}`).replace(/\W+/gu,"-").toLowerCase()}var be=class a extends Error{constructor(t,e,r){if(super(t,{cause:r}),this.name="MasError",e.response){let n=e.response.headers?.get(Te);n&&(e.requestId=n),e.response.status&&(e.status=e.response.status,e.statusText=e.response.statusText),e.response.url&&(e.url=e.response.url)}delete e.response,this.context=e,Error.captureStackTrace&&Error.captureStackTrace(this,a)}toString(){let t=Object.entries(this.context||{}).map(([r,n])=>`${r}: ${JSON.stringify(n)}`).join(", "),e=`${this.name}: ${this.message}`;return t&&(e+=` (${t})`),this.cause&&(e+=`
Caused by: ${this.cause}`),e}};var yr={requestId:Te,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Ut(a){let t={};if(!a?.headers)return t;let e=a.headers;for(let[r,n]of Object.entries(yr)){let o=e.get(n);o&&(o=o.replace(/[,;]/g,"|"),o=o.replace(/[| ]+/g,"|"),t[r]=o)}return t}async function qt(a,t={},e=2,r=100){let n;for(let o=0;o<=e;o++)try{let i=await fetch(a,t);return i.retryCount=o,i}catch(i){if(n=i,n.retryCount=o,o>e)break;await new Promise(s=>setTimeout(s,r*(o+1)))}throw n}var Gt="fragment",jt="author",Vt="preview",et="aem-fragment",z,tt=class{constructor(){p(this,z,new Map)}clear(){c(this,z).clear()}addByRequestedId(t,e){c(this,z).set(t,e)}put(t,e){c(this,z).set(t,e)}add(...t){t.forEach(e=>{let{id:r}=e;r&&c(this,z).set(r,e)})}has(t){return c(this,z).has(t)}get(t){return c(this,z).get(t)}remove(t){c(this,z).delete(t)}};z=new WeakMap;var Ie=new tt,se,N,O,x,k,A,L,ve,ye,de,_,Yt,Kt,at,Wt,rt=class extends HTMLElement{constructor(){super(...arguments);p(this,_);d(this,"cache",Ie);p(this,se);p(this,N,null);p(this,O,null);p(this,x,{url:null,retryCount:0,stale:!1,measure:null,status:null});p(this,k,null);p(this,A);p(this,L);p(this,ve,!1);p(this,ye,0);p(this,de)}static get observedAttributes(){return[Gt,jt,Vt]}attributeChangedCallback(e,r,n){e===Gt&&m(this,A,n),e===jt&&m(this,ve,["","true"].includes(n)),e===Vt&&m(this,de,n)}connectedCallback(){if(!c(this,L)){if(c(this,k)??m(this,k,Z(this)),m(this,de,c(this,k).settings?.preview),c(this,se)??m(this,se,c(this,k).log.module(`${et}[${c(this,A)}]`)),!c(this,A)||c(this,A)==="#"){w(this,_,at).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(c(this,x)).filter(([e,r])=>r!=null).map(([e,r])=>[`aem-fragment:${e}`,r]))}async refresh(e=!0){if(c(this,L)&&!await Promise.race([c(this,L),Promise.resolve(!1)]))return;e&&Ie.remove(c(this,A));try{m(this,L,w(this,_,Wt).call(this)),await c(this,L)}catch(s){return w(this,_,at).call(this,s.message),!1}let{references:r,referencesTree:n,placeholders:o,wcs:i}=c(this,N)||{};return i&&!Ht("mas.disableWcsCache")&&c(this,k).prefillWcsCache(i),this.dispatchEvent(new CustomEvent(W,{detail:{...this.data,references:r,referencesTree:n,placeholders:o,...c(this,x)},bubbles:!0,composed:!0})),c(this,L)}get updateComplete(){return c(this,L)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return c(this,O)?c(this,O):(c(this,ve)?this.transformAuthorData():this.transformPublishData(),c(this,O))}transformAuthorData(){let{fields:e,id:r,tags:n,settings:o={}}=c(this,N);m(this,O,e.reduce((i,{name:s,multiple:l,values:h})=>(i.fields[s]=l?h:h[0],i),{fields:{},id:r,tags:n,settings:o}))}transformPublishData(){let{fields:e,id:r,tags:n,settings:o={}}=c(this,N);m(this,O,Object.entries(e).reduce((i,[s,l])=>(i.fields[s]=l?.mimeType?l.value:l??"",i),{fields:{},id:r,tags:n,settings:o}))}getFragmentClientUrl(){let r=new URLSearchParams(window.location.search).get("maslibs");if(!r||r.trim()==="")return"https://mas.adobe.com/studio/libs/fragment-client.js";let n=r.trim().toLowerCase();if(n==="local")return"http://localhost:3030/studio/libs/fragment-client.js";if(n==="main")return"https://mas.adobe.com/studio/libs/fragment-client.js";let{hostname:o}=window.location,i=o.endsWith(".page")?"page":"live";return n.includes("--mas--")?`https://${n}.aem.${i}/studio/libs/fragment-client.js`:n.includes("--")?`https://${n}.aem.${i}/studio/libs/fragment-client.js`:`https://${n}--mas--adobecom.aem.${i}/studio/libs/fragment-client.js`}async generatePreview(){let e=this.getFragmentClientUrl(),{previewFragment:r}=await import(e);return await r(c(this,A),{locale:c(this,k).settings.locale,apiKey:c(this,k).settings.wcsApiKey})}};se=new WeakMap,N=new WeakMap,O=new WeakMap,x=new WeakMap,k=new WeakMap,A=new WeakMap,L=new WeakMap,ve=new WeakMap,ye=new WeakMap,de=new WeakMap,_=new WeakSet,Yt=async function(e){lt(this,ye)._++;let r=`${et}:${c(this,A)}:${c(this,ye)}`,n=`${r}${Le}`,o=`${r}${_e}`;if(c(this,de))return await this.generatePreview();performance.mark(n);let i;try{if(c(this,x).stale=!1,c(this,x).url=e,i=await qt(e,{cache:"default",credentials:"omit"}),w(this,_,Kt).call(this,i),c(this,x).status=i?.status,c(this,x).measure=X(performance.measure(o,n)),c(this,x).retryCount=i.retryCount,!i?.ok)throw new be("Unexpected fragment response",{response:i,...c(this,k).duration});return await i.json()}catch(s){if(c(this,x).measure=X(performance.measure(o,n)),c(this,x).retryCount=s.retryCount,c(this,N))return c(this,x).stale=!0,c(this,se).error("Serving stale data",c(this,x)),c(this,N);let l=s.message??"unknown";throw new be(`Failed to fetch fragment: ${l}`,{})}},Kt=function(e){Object.assign(c(this,x),Ut(e))},at=function(e){m(this,L,null),c(this,x).message=e,this.classList.add("error");let r={...c(this,x),...c(this,k).duration};c(this,se).error(e,r),this.dispatchEvent(new CustomEvent(Q,{detail:r,bubbles:!0,composed:!0}))},Wt=async function(){this.classList.remove("error"),m(this,O,null);let e=Ie.get(c(this,A));if(e)return m(this,N,e),!0;let{masIOUrl:r,wcsApiKey:n,locale:o}=c(this,k).settings,i=`${r}/fragment?id=${c(this,A)}&api_key=${n}&locale=${o}`;return e=await w(this,_,Yt).call(this,i),Ie.addByRequestedId(c(this,A),e),m(this,N,e),!0};customElements.define(et,rt);import{LitElement as Er,html as wr,css as Sr}from"../lit-all.min.js";var le=class extends Er{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return wr`<div class="badge">
            ${this.text}
        </div>`}};d(le,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),d(le,"styles",Sr`
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
    `);customElements.define("merch-badge",le);import{html as Ar,css as kr,LitElement as Cr}from"../lit-all.min.js";var Ee=class extends Cr{constructor(){super()}render(){return Ar`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};d(Ee,"styles",kr`
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
    `),d(Ee,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",Ee);import{html as nt,css as Tr,LitElement as Lr}from"../lit-all.min.js";var we=class extends Lr{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,e)=>{e>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return nt`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?nt`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:nt``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};d(we,"styles",Tr`
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
    `),d(we,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",we);function _r(a){return`https://${a==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Se,U=class U extends HTMLAnchorElement{constructor(){super();p(this,Se,!1);this.setAttribute("is",U.is)}get isUptLink(){return!0}initializeWcsData(e,r){this.setAttribute("data-wcs-osi",e),r&&this.setAttribute("data-promotion-code",r),m(this,Se,!0),this.composePromoTermsUrl()}attributeChangedCallback(e,r,n){c(this,Se)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let e=this.getAttribute("data-wcs-osi");if(!e){let b=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${b}`);return}let r=Z(),n=[e],o=this.getAttribute("data-promotion-code"),{country:i,language:s,env:l}=r.settings,h={country:i,language:s,wcsOsi:n,promotionCode:o},y=r.resolveOfferSelectors(h);Promise.all(y).then(([[b]])=>{let C=`locale=${s}_${i}&country=${i}&offer_id=${b.offerId}`;o&&(C+=`&promotion_code=${encodeURIComponent(o)}`),this.href=`${_r(l)}?${C}`}).catch(b=>{console.error(`Could not resolve offer selectors for id: ${e}.`,b.message)})}static createFrom(e){let r=new U;for(let n of e.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?r.setAttribute("class",n.value.replace("upt-link","").trim()):r.setAttribute(n.name,n.value));return r.innerHTML=e.innerHTML,r.setAttribute("tabindex",0),r}};Se=new WeakMap,d(U,"is","upt-link"),d(U,"tag","a"),d(U,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var F=U;window.customElements.get(F.is)||window.customElements.define(F.is,F,{extends:F.tag});var Mr="#000000",ot="#F8D904",Rr="#EAEAEA",Pr="#31A547",zr=/(accent|primary|secondary)(-(outline|link))?/,Nr="mas:product_code/",Or="daa-ll",Fe="daa-lh",$r=["XL","L","M","S"],it="...";function M(a,t,e,r){let n=r[a];if(t[a]&&n){let o={slot:n?.slot},i=t[a];if(n.maxCount&&typeof i=="string"){let[l,h]=Zr(i,n.maxCount,n.withSuffix);l!==i&&(o.title=h,i=l)}let s=E(n.tag,o,i);e.append(s)}}function Ir(a,t,e){let r=a.mnemonicIcon?.map((o,i)=>({icon:o,alt:a.mnemonicAlt[i]??"",link:a.mnemonicLink[i]??""}));r?.forEach(({icon:o,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let l={slot:"icons",src:o,loading:t.loading,size:e?.size??"l"};i&&(l.alt=i),s&&(l.href=s);let h=E("merch-icon",l);t.append(h)});let n=t.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&n&&n.remove()}function Fr(a,t,e){if(e.badge?.slot){if(a.badge?.length&&!a.badge?.startsWith("<merch-badge")){let r=ot,n=!1;e.allowedBadgeColors?.includes(e.badge?.default)&&(r=e.badge?.default,a.borderColor||(n=!0));let o=a.badgeBackgroundColor||r,i=a.borderColor||"";n&&(i=e.badge?.default,a.borderColor=e.badge?.default),a.badge=`<merch-badge variant="${a.variant}" background-color="${o}" border-color="${i}">${a.badge}</merch-badge>`}M("badge",a,t,e)}else a.badge?(t.setAttribute("badge-text",a.badge),t.setAttribute("badge-color",a.badgeColor||Mr),t.setAttribute("badge-background-color",a.badgeBackgroundColor||ot),t.setAttribute("border-color",a.badgeBackgroundColor||ot)):t.setAttribute("border-color",a.borderColor||Rr)}function Dr(a,t,e){if(e.trialBadge&&a.trialBadge){if(!a.trialBadge.startsWith("<merch-badge")){let r=a.trialBadgeBorderColor||Pr;a.trialBadge=`<merch-badge variant="${a.variant}" border-color="${r}">${a.trialBadge}</merch-badge>`}M("trialBadge",a,t,e)}}function Br(a,t,e){e?.includes(a.size)&&t.setAttribute("size",a.size)}function Hr(a,t,e){M("cardTitle",a,t,{cardTitle:e})}function Ur(a,t,e){M("subtitle",a,t,e)}function qr(a,t,e,r){if(!a.backgroundColor||a.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}e?.[a.backgroundColor]?(t.style.setProperty("--merch-card-custom-background-color",`var(${e[a.backgroundColor]})`),t.setAttribute("background-color",a.backgroundColor)):r?.attribute&&a.backgroundColor&&(t.setAttribute(r.attribute,a.backgroundColor),t.style.removeProperty("--merch-card-custom-background-color"))}function Gr(a,t,e){let r=e?.borderColor,n="--merch-card-custom-border-color";a.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(n),e?.allowedBorderColors?.includes(e?.badge?.default)&&t.style.setProperty(n,"transparent")):a.borderColor&&r&&(/-gradient/.test(a.borderColor)?(t.setAttribute("gradient-border","true"),t.style.removeProperty(n)):t.style.setProperty(n,`var(--${a.borderColor})`))}function jr(a,t,e){if(a.backgroundImage){let r={loading:t.loading??"lazy",src:a.backgroundImage};if(a.backgroundImageAltText?r.alt=a.backgroundImageAltText:r.role="none",!e)return;if(e?.attribute){t.setAttribute(e.attribute,a.backgroundImage);return}t.append(E(e.tag,{slot:e.slot},E("img",r)))}}function Vr(a,t,e){M("prices",a,t,e)}function Xt(a,t,e){let r=a.hasAttribute("data-wcs-osi")&&!!a.getAttribute("data-wcs-osi"),n=a.className||"",o=zr.exec(n)?.[0]??"accent",i=o.includes("accent"),s=o.includes("primary"),l=o.includes("secondary"),h=o.includes("-outline"),y=o.includes("-link");a.classList.remove("accent","primary","secondary");let b;if(t.consonant)b=ra(a,i,r,y,s);else if(y)b=a;else{let C;i?C="accent":s?C="primary":l&&(C="secondary"),b=t.spectrum==="swc"?ta(a,e,h,C,r):ea(a,e,h,C,r)}return b}function Yr(a,t){let{slot:e}=t?.description,r=a.querySelectorAll(`[slot="${e}"] a[data-wcs-osi]`);r.length&&r.forEach(n=>{let o=Xt(n,a,t);n.replaceWith(o)})}function Kr(a,t,e){M("promoText",a,t,e),M("description",a,t,e),Yr(t,e),M("callout",a,t,e),M("quantitySelect",a,t,e),M("whatsIncluded",a,t,e)}function Wr(a,t,e){if(!e.addon)return;let r=a.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let n=E("merch-addon",{slot:"addon"},r);[...n.querySelectorAll(v)].forEach(o=>{let i=o.parentElement;i?.nodeName==="P"&&i.setAttribute("data-plan-type","")}),t.append(n)}function Qr(a,t,e){a.addonConfirmation&&M("addonConfirmation",a,t,e)}function Xr(a,t,e,r){r?.secureLabel&&e?.secureLabel&&t.setAttribute("secure-label",r.secureLabel)}function Zr(a,t,e=!0){try{let r=typeof a!="string"?"":a,n=Qt(r);if(n.length<=t)return[r,n];let o=0,i=!1,s=e?t-it.length<1?1:t-it.length:t,l=[];for(let b of r){if(o++,b==="<")if(i=!0,r[o]==="/")l.pop();else{let C="";for(let De of r.substring(o)){if(De===" "||De===">")break;C+=De}l.push(C)}if(b==="/"&&r[o]===">"&&l.pop(),b===">"){i=!1;continue}if(!i&&(s--,s===0))break}let h=r.substring(0,o).trim();if(l.length>0){l[0]==="p"&&l.shift();for(let b of l.reverse())h+=`</${b}>`}return[`${h}${e?it:""}`,n]}catch{let n=typeof a=="string"?a:"",o=Qt(n);return[n,o]}}function Qt(a){if(!a)return"";let t="",e=!1;for(let r of a){if(r==="<"&&(e=!0),r===">"){e=!1;continue}e||(t+=r)}return t}function Jr(a,t){t.querySelectorAll("a.upt-link").forEach(r=>{let n=F.createFrom(r);r.replaceWith(n),n.initializeWcsData(a.osi,a.promoCode)})}function ea(a,t,e,r,n){let o=a;n?o=customElements.get("checkout-button").createCheckoutButton({},a.innerHTML):o.innerHTML=`<span>${o.textContent}</span>`,o.setAttribute("tabindex",0);for(let y of a.attributes)["class","is"].includes(y.name)||o.setAttribute(y.name,y.value);o.firstElementChild?.classList.add("spectrum-Button-label");let i=t?.ctas?.size??"M",s=`spectrum-Button--${r}`,l=$r.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",h=["spectrum-Button",s,l];return e&&h.push("spectrum-Button--outline"),o.classList.add(...h),o}function ta(a,t,e,r,n){let o=a;n&&(o=customElements.get("checkout-button").createCheckoutButton(a.dataset),o.connectedCallback(),o.render());let i="fill";e&&(i="outline");let s=E("sp-button",{treatment:i,variant:r,tabIndex:0,size:t?.ctas?.size??"m",...a.dataset.analyticsId&&{"data-analytics-id":a.dataset.analyticsId}},a.innerHTML);return s.source=o,(n?o.onceSettled():Promise.resolve(o)).then(l=>{s.setAttribute("data-navigation-url",l.href)}),s.addEventListener("click",l=>{l.defaultPrevented||o.click()}),s}function ra(a,t,e,r,n){let o=a;return e&&(o=customElements.get("checkout-link").createCheckoutLink(a.dataset,a.innerHTML)),r||(o.classList.add("button","con-button"),t&&o.classList.add("blue"),n&&o.classList.add("primary")),o}function aa(a,t,e,r){if(a.ctas){let{slot:n}=e.ctas,o=E("div",{slot:n},a.ctas),i=[...o.querySelectorAll("a")].map(s=>Xt(s,t,e));o.innerHTML="",o.append(...i),t.append(o)}}function na(a,t){let{tags:e}=a,r=e?.find(o=>o.startsWith(Nr))?.split("/").pop();if(!r)return;t.setAttribute(Fe,r),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((o,i)=>{o.setAttribute(Or,`${o.dataset.analyticsId}-${i+1}`)})}function oa(a){a.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,e])=>{a.querySelectorAll(`a.${t}`).forEach(r=>{r.classList.remove(t),r.classList.add("spectrum-Link",`spectrum-Link--${e}`)})})}function ia(a){a.querySelectorAll("[slot]").forEach(r=>{r.remove()}),a.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",Fe].forEach(r=>a.removeAttribute(r));let e=["wide-strip","thin-strip"];a.classList.remove(...e)}async function Zt(a,t){if(!a){let s=t?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${s}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${s}).`)}if(!a.fields){let s=a.id||"unknown",l=t?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'.`)}let{id:e,fields:r,settings:n={}}=a,{variant:o}=r;if(!o)throw new Error(`hydrate: no variant found in payload ${e}`);ia(t),t.settings=n,t.id??(t.id=a.id),t.variant=o,await t.updateComplete;let{aemFragmentMapping:i}=t.variantLayout;if(!i)throw new Error(`hydrate: variant mapping not found for ${e}`);i.style==="consonant"&&t.setAttribute("consonant",!0),Ir(r,t,i.mnemonics),Fr(r,t,i),Dr(r,t,i),Br(r,t,i.size),Hr(r,t,i.title),Ur(r,t,i),Vr(r,t,i),jr(r,t,i.backgroundImage),qr(r,t,i.allowedColors,i.backgroundColor),Gr(r,t,i),Kr(r,t,i),Wr(r,t,i),Qr(r,t,i),Xr(r,t,i,n),Jr(r,t),aa(r,t,i,o),na(r,t),oa(t)}var st="merch-card",ct=2e4,Jt="merch-card:";function er(a,t){let e=a.closest(st);if(!e)return t;e.variantLayout?.priceOptionsProvider?.(a,t)}function sa(a){a.providers.has(er)||a.providers.price(er)}var da=0,he,me,Ae,$,j,I,G,q=class extends ca{constructor(){super();p(this,I);p(this,he);p(this,me);p(this,Ae);p(this,$);p(this,j);d(this,"customerSegment");d(this,"marketSegment");d(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=Ze(this,!1),this.variantLayout?.connectedCallbackHook()}willUpdate(e){(e.has("variant")||!this.variantLayout)&&(this.variantLayout=Ze(this),this.variantLayout.connectedCallbackHook())}updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),e.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayout?.postCardUpdateHook(e)}catch(r){w(this,I,G).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(v)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(K)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(K)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(K)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let n of r){await n.onceSettled();let o=n.value?.[0]?.planType;if(!o)return;let i=this.stockOfferOsis[o];if(!i)return;let s=n.dataset.wcsOsi.split(",").filter(l=>l!==i);e.checked&&s.push(i),n.dataset.wcsOsi=s.join(",")}}changeHandler(e){e.target.tagName==="MERCH-ADDON"&&this.toggleAddon(e.target)}toggleAddon(e){this.variantLayout?.toggleAddon?.(e);let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length===0)return;let n=o=>{let{offerType:i,planType:s}=o.value?.[0]??{};if(!i||!s)return;let l=e.getOsi(s,i),h=(o.dataset.wcsOsi||"").split(",").filter(y=>y&&y!==l);e.checked&&h.push(l),o.dataset.wcsOsi=h.join(",")};r.forEach(n)}handleQuantitySelection(e){let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length!==0)for(let n of r)n.dataset.quantity=e.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let r={...this.filters};Object.keys(r).forEach(n=>{if(e){r[n].order=Math.min(r[n].order||2,2);return}let o=r[n].order;o===1||isNaN(o)||(r[n].order=Number(o)+1)}),this.filters=r}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}connectedCallback(){super.connectedCallback(),c(this,me)||m(this,me,da++),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let e=this.id??c(this,me);m(this,j,`${Jt}${e}${Le}`),m(this,he,`${Jt}${e}${_e}`),performance.mark(c(this,j)),m(this,$,Z()),sa(c(this,$)),m(this,Ae,c(this,$).Log.module(st)),this.addEventListener(He,this.handleQuantitySelection),this.addEventListener(Ue,this.handleAddonAndQuantityUpdate),this.addEventListener(bt,this.handleMerchOfferSelectReady),this.addEventListener(Q,this.handleAemFragmentEvents),this.addEventListener(W,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(He,this.handleQuantitySelection),this.removeEventListener(Q,this.handleAemFragmentEvents),this.removeEventListener(W,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(Ue,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(e){if(this.isConnected&&(e.type===Q&&w(this,I,G).call(this,"AEM fragment cannot be loaded"),e.type===W&&(this.failed=!1,e.target.nodeName==="AEM-FRAGMENT"))){let r=e.detail;try{await Zt(r,this)}catch(n){w(this,I,G).call(this,`hydration has failed: ${n.message}`)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;let e=new Promise(i=>setTimeout(()=>i("timeout"),ct));if(this.aemFragment){let i=await Promise.race([this.aemFragment.updateComplete,e]);if(i===!1||i==="timeout"){let s=i==="timeout"?`AEM fragment was not resolved within ${ct} timeout`:"AEM fragment cannot be loaded";w(this,I,G).call(this,s,{},!1);return}}let r=[...this.querySelectorAll(xt)],n=Promise.all(r.map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),o=await Promise.race([n,e]);if(o===!0){this.measure=performance.measure(c(this,he),c(this,j));let i={...this.aemFragment?.fetchInfo,...c(this,$).duration,measure:X(this.measure)};return this.dispatchEvent(new CustomEvent(Et,{bubbles:!0,composed:!0,detail:i})),this}else{this.measure=performance.measure(c(this,he),c(this,j));let i={measure:X(this.measure),...c(this,$).duration};o==="timeout"?w(this,I,G).call(this,`Contains offers that were not resolved within ${ct} timeout`,i):w(this,I,G).call(this,"Contains unresolved offers",i)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let e=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(K)).length===2&&e&&e.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:e,items:r}}){if(!e||!r?.length)return;let n=this.checkoutLinks.find(h=>h.getAttribute("data-modal-id")===e);if(!n)return;let i=new URL(n.getAttribute("href")).searchParams.get("pa"),s=r.find(h=>h.productArrangementCode===i)?.quantity,l=!!r.find(h=>h.productArrangementCode!==i);if(s&&this.quantitySelect?.dispatchEvent(new CustomEvent(yt,{detail:{quantity:s},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==l){this.toggleStockOffer({target:this.addonCheckbox});let h=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(h,"target",{writable:!1,value:{checked:l}}),this.addonCheckbox.handleChange(h)}}};he=new WeakMap,me=new WeakMap,Ae=new WeakMap,$=new WeakMap,j=new WeakMap,I=new WeakSet,G=function(e,r={},n=!0){if(!this.isConnected)return;let i=this.aemFragment?.getAttribute("fragment");i=`[${i}]`;let s={...this.aemFragment.fetchInfo,...c(this,$).duration,...r,message:e};c(this,Ae).error(`merch-card${i}: ${e}`,s),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(wt,{bubbles:!0,composed:!0,detail:s}))},d(q,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{if(!e)return;let[r,n,o]=e.split(",");return{PUF:r,ABM:n,M2M:o}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(r=>{let[n,o,i]=r.split(":"),s=Number(o);return[n,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:e=>Object.entries(e).map(([r,{order:n,size:o}])=>[r,n,o].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Fe,reflect:!0},loading:{type:String}}),d(q,"styles",[gt,...ut()]),d(q,"registerVariant",S),d(q,"getFragmentMapping",Pe);customElements.define(st,q);export{q as MerchCard};

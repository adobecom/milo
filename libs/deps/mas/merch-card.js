var Jt=Object.defineProperty;var st=o=>{throw TypeError(o)};var er=(o,t,e)=>t in o?Jt(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var d=(o,t,e)=>er(o,typeof t!="symbol"?t+"":t,e),Be=(o,t,e)=>t.has(o)||st("Cannot "+e);var c=(o,t,e)=>(Be(o,t,"read from private field"),e?e.call(o):t.get(o)),m=(o,t,e)=>t.has(o)?st("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(o):t.set(o,e),h=(o,t,e,r)=>(Be(o,t,"write to private field"),r?r.call(o,e):t.set(o,e),e),w=(o,t,e)=>(Be(o,t,"access private method"),e);var dt=(o,t,e,r)=>({set _(a){h(o,t,a,e)},get _(){return c(o,t,r)}});import{LitElement as no}from"../lit-all.min.js";import{css as ht,unsafeCSS as lt}from"../lit-all.min.js";var R="(max-width: 767px)",V="(max-width: 1199px)",f="(min-width: 768px)",g="(min-width: 1200px)",M="(min-width: 1600px)";var mt=ht`
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
`,pt=()=>[ht`
      /* Tablet */
      @media screen and ${lt(f)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${lt(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as tr,html as gt,css as rr}from"../lit-all.min.js";var Y=class extends tr{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?gt`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:gt` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};d(Y,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),d(Y,"styles",rr`
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
    `);customElements.define("merch-icon",Y);var xo=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),bo=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var v='span[is="inline-price"][data-wcs-osi]',K='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var ut=`${v},${K}`;var ft="merch-offer-select:ready",xt="merch-card:action-menu-toggle";var He="merch-quantity-selector:change",bt="merch-card-quantity:change",Ue="merch-modal:addon-and-quantity-update";var W="aem:load",X="aem:error",vt="mas:ready",yt="mas:error";var qe="mas:resolved";var ke="X-Request-Id",vo=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var yo=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var Ce=":start",_e=":duration";var Et="legal";var or="mas-commerce-service";function wt(o,t){let e;return function(){let r=this,a=arguments;clearTimeout(e),e=setTimeout(()=>o.apply(r,a),t)}}function E(o,t={},e=null,r=null){let a=r?document.createElement(o,{is:r}):document.createElement(o);e instanceof HTMLElement?a.appendChild(e):a.innerHTML=e;for(let[n,i]of Object.entries(t))a.setAttribute(n,i);return a}function Le(){return window.matchMedia("(max-width: 767px)")}function Q(){return Le().matches}function Z(o){return`startTime:${o.startTime.toFixed(2)}|duration:${o.duration.toFixed(2)}`}function St(){return window.matchMedia("(max-width: 1024px)").matches}function J(){return document.getElementsByTagName(or)?.[0]}var ge,F,ue,fe,ee,Re=class extends HTMLElement{constructor(){super();m(this,ge,"");m(this,F);m(this,ue,[]);m(this,fe,[]);m(this,ee);h(this,ee,wt(()=>{this.isConnected&&(this.parentElement.style.background=this.value,c(this,F)?this.parentElement.style.borderRadius=c(this,F):c(this,F)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let e=c(this,ue).map((r,a)=>{let n=c(this,fe)[a]||"";return`${r} ${n}`}).join(", ");return`linear-gradient(${c(this,ge)}, ${e})`}connectedCallback(){c(this,ee).call(this)}attributeChangedCallback(e,r,a){e==="border-radius"&&h(this,F,a?.trim()),e==="colors"&&a?h(this,ue,a?.split(",").map(n=>n.trim())??[]):e==="positions"&&a?h(this,fe,a?.split(",").map(n=>n.trim())??[]):e==="angle"&&h(this,ge,a?.trim()??""),c(this,ee).call(this)}};ge=new WeakMap,F=new WeakMap,ue=new WeakMap,fe=new WeakMap,ee=new WeakMap;customElements.define("merch-gradient",Re);import{LitElement as ar,html as nr,css as ir}from"../lit-all.min.js";var te=class extends ar{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this)}getOsi(t,e){let n=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION"],PROMOTION:["PROMOTION","BASE"]}[e]||[e]).map(s=>`p[data-plan-type="${t}"] ${v}[data-offer-type="${s}"]`).join(", ");return this.querySelector(n)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(qe,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(qe,this.updatePlanType)}updatePlanType(t){if(t.target.tagName!=="SPAN")return;let e=t.target,r=e?.value?.[0];r&&(e.setAttribute("data-offer-type",r.offerType),e.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return nr`<input
                type="checkbox"
                id="addon-checkbox"
                part="checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <label for="addon-checkbox" part="label">
                <slot></slot>
            </label>`}};d(te,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0}}),d(te,"styles",ir`
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
    `);customElements.define("merch-addon",te);import{html as Me,nothing as cr}from"../lit-all.min.js";var re,xe=class xe{constructor(t){d(this,"card");m(this,re);this.card=t,this.insertVariantStyle()}getContainer(){return h(this,re,c(this,re)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),c(this,re)}insertVariantStyle(){if(!xe.styleMap[this.card.variant]){xe.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,e){if(!t)return;let r=`--consonant-merch-card-${this.card.variant}-${e}-height`,a=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),n=parseInt(this.getContainer().style.getPropertyValue(r))||0;a>n&&this.getContainer().style.setProperty(r,`${a}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Me`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Me` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?Me`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:cr}get secureLabelFooter(){return Me`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,e=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||e===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-e-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Pe(this.card.variant)}};re=new WeakMap,d(xe,"styleMap",{});var u=xe;import{html as Ge,css as sr}from"../lit-all.min.js";var At=`
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

@media screen and ${M} {
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
}`;var Tt={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},oe=class extends u{constructor(e){super(e);d(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(xt,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});d(this,"toggleActionMenu",e=>{if(!this.actionMenuContentSlot||!e||e.type!=="click"&&e.code!=="Space"&&e.code!=="Enter")return;e.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});d(this,"toggleActionMenuFromCard",e=>{let r=e?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});d(this,"hideActionMenu",e=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Ge` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${St()&&this.card.actionMenu?"always-visible":""}
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
            <slot></slot>`}getGlobalCSS(){return At}setAriaExpanded(e,r){e.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};d(oe,"variantStyle",sr`
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
    `);import{html as be}from"../lit-all.min.js";var kt=`
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
`;var ze=class extends u{constructor(t){super(t)}getGlobalCSS(){return kt}renderLayout(){return be`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?be`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:be`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?be`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:be`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as _t}from"../lit-all.min.js";var Ct=`
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

@media screen and ${M} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Ne=class extends u{constructor(t){super(t)}getGlobalCSS(){return Ct}renderLayout(){return _t` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":_t`<hr />`} ${this.secureLabelFooter}`}};import{html as ae,css as dr,unsafeCSS as je}from"../lit-all.min.js";var Lt=`
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
@media screen and ${R} {
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

@media screen and ${M} {
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
`;var lr=32,ne=class extends u{constructor(e){super(e);d(this,"getRowMinHeightPropertyName",e=>`--consonant-merch-card-footer-row-${e}-min-height`);d(this,"getMiniCompareFooter",()=>{let e=this.card.secureLabel?ae`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:ae`<slot name="secure-transaction-label"></slot>`;return ae`<footer>${e}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Lt}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let e=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&e.push("footer-rows"),e.forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let e=this.card.querySelector('[slot="footer-rows"] ul');!e||!e.children||[...e.children].forEach((r,a)=>{let n=Math.max(lr,parseFloat(window.getComputedStyle(r).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;n>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${n}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let a=r.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${v}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(e){let r=this.mainPrice,a=this.headingMPriceSlot;if(!r&&a){let n=e?.getAttribute("plan-type"),i=null;if(e&&n&&(i=e.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),e.checked){if(i){let s=E("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},i.innerHTML);this.card.appendChild(s)}}else{let s=E("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let r=this.mainPrice,a=this.card.planType;r&&(await r.onceSettled(),a=r.value?.[0]?.planType),a&&(e.planType=a)}renderLayout(){return ae` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(e=>e.onceSettled())),await this.adjustAddon(),Q()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};d(ne,"variantStyle",dr`
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

    @media screen and ${je(R)} {
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
  `);import{html as ie,css as hr,nothing as Oe}from"../lit-all.min.js";var Rt=`
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
@media screen and ${R} {
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
    @media screen and ${M} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;var $e={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Mt={...function(){let{whatsIncluded:o,size:t,...e}=$e;return e}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Pt={...function(){let{whatsIncluded:o,size:t,quantitySelect:e,...r}=$e;return r}()},P=class extends u{constructor(t){super(t),this.adaptForMobile=this.adaptForMobile.bind(this)}priceOptionsProvider(t,e){t.dataset.template===Et&&(e.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Rt}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}let t=this.card.shadowRoot,e=t.querySelector("footer"),r=this.card.getAttribute("size"),a=t.querySelector("footer #stock-checkbox"),n=t.querySelector(".body #stock-checkbox"),i=t.querySelector(".body");if(!r||!r.includes("wide")){e?.classList.remove("wide-footer"),a&&a.remove();return}let s=Q();if(e?.classList.toggle("wide-footer",!s),s&&a){n?a.remove():i.appendChild(a);return}!s&&n&&(a?n.remove():e.prepend(n))}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.remove("hide-tooltip")}))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${v}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?ie`<div class="divider"></div>`:Oe}async adjustLegal(){if(await this.card.updateComplete,this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],e=this.card.querySelector(`[slot="heading-m"] ${v}[data-template="price"]`);e&&t.push(e),this.card.querySelectorAll(`[slot="body-xs"] ${v}[data-template="price"]`).forEach(n=>t.push(n));let a=t.map(async n=>{let i=n.cloneNode(!0);await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),i.setAttribute("data-template","legal"),n.parentNode.insertBefore(i,n.nextSibling))});await Promise.all(a)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let e=this.mainPrice;if(!e)return;await e.onceSettled();let r=e.value?.[0]?.planType;r&&(t.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?ie`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Oe}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Oe:ie`<slot name="icons"></slot>`}get addon(){return this.card.size==="super-wide"?Oe:ie`<slot name="addon"></slot>`}get plansSecureLabelFooter(){return this.card.size==="super-wide"?ie`<footer><slot name="addon"></slot>${this.secureLabel}<slot name="footer"></slot></footer>`:this.secureLabelFooter}connectedCallbackHook(){let t=Le();t?.addEventListener&&t.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let t=Le();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMobile)}renderLayout(){return ie` ${this.badge}
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
            ${this.plansSecureLabelFooter}`}};d(P,"variantStyle",hr`
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
    `);import{html as Ve,css as mr}from"../lit-all.min.js";var zt=`
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
`;var B=class extends u{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return zt}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(e=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${e}"]`),e))}renderLayout(){return Ve` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Ve`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Ve`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Q()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${v}[data-template="price"]`)}toggleAddon(t){let e=this.mainPrice,r=this.headingXSSlot;if(!e&&r){let a=t?.getAttribute("plan-type"),n=null;if(t&&a&&(n=t.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(i=>i.remove()),t.checked){if(n){let i=E("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},n.innerHTML);this.card.appendChild(i)}}else{let i=E("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let e=this.mainPrice,r=this.card.planType;e&&(await e.onceSettled(),r=e.value?.[0]?.planType),r&&(t.planType=r)}};d(B,"variantStyle",mr`
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
    `);import{html as Ye,css as pr}from"../lit-all.min.js";var Nt=`
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
@media screen and ${R} {
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
`;var ce=class extends u{constructor(t){super(t)}getGlobalCSS(){return Nt}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ye` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ye`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ye`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};d(ce,"variantStyle",pr`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Ke,css as gr}from"../lit-all.min.js";var Ot=`
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

@media screen and ${R} {
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

@media screen and ${M} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var $t={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},se=class extends u{constructor(t){super(t)}getGlobalCSS(){return Ot}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Ke`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Ke`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Ke`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};d(se,"variantStyle",gr`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as ur,css as fr}from"../lit-all.min.js";var It=`
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
    font-size: var(--consonant-merch-card-body-s-font-size);
    line-height: var(--merch-card-simplified-pricing-express-body-s-line-height);
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] {
    display: flex;
    flex-direction: row;
    margin-top: auto;
}

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] button,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a[is="checkout-link"] {
    width: 100%;
    font-weight: 700;
    line-height: 23.4px;
    margin: 0;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

merch-card[variant="simplified-pricing-express"] [slot="price"] > p:first-child {
  display: flex;
  align-items: baseline;
  gap: 8px;
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

merch-card[variant="simplified-pricing-express"] [slot="cta"] sp-button[variant="accent"],
merch-card[variant="simplified-pricing-express"] [slot="cta"] button.spectrum-Button--accent,
merch-card[variant="simplified-pricing-express"] [slot="cta"] a.spectrum-Button.spectrum-Button--accent {
    background-color: var(--spectrum-indigo-900);
}

merch-card[variant="simplified-pricing-express"] [slot="footer"] sp-button[variant="accent"] {
    background-color: var(--spectrum-indigo-900);
}
`;var We={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-l",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge"},description:{tag:"div",slot:"body-s",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"L"},borderColor:{attribute:"border-color",specialValues:{gray:"--spectrum-gray-300",blue:"--spectrum-blue-400",gradient:"linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)"}}},H=class extends u{getGlobalCSS(){return It}get aemFragmentMapping(){return We}renderLayout(){return ur`
            <div class="header">
                <slot name="heading-l"></slot>
                <slot name="badge"></slot>
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
        `}};d(H,"variantStyle",fr`
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
            --merch-card-simplified-pricing-express-body-s-line-height: 20.8px;
            --merch-card-simplified-pricing-express-price-p-font-size: 12px;
            --merch-card-simplified-pricing-express-price-p-font-weight: 400;
            --merch-card-simplified-pricing-express-price-p-line-height: 15.6px;
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
            padding: 22px !important;
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
    `);customElements.define("simplified-pricing-express-card",H);var Xe=new Map,S=(o,t,e=null,r=null)=>{Xe.set(o,{class:t,fragmentMapping:e,style:r})};S("catalog",oe,Tt,oe.variantStyle);S("image",ze);S("inline-heading",Ne);S("mini-compare-chart",ne,null,ne.variantStyle);S("plans",P,$e,P.variantStyle);S("plans-students",P,Pt,P.variantStyle);S("plans-education",P,Mt,P.variantStyle);S("product",B,null,B.variantStyle);S("segment",ce,null,ce.variantStyle);S("special-offers",se,$t,se.variantStyle);S("simplified-pricing-express",H,We,H.variantStyle);var Qe=(o,t=!1)=>{let e=Xe.get(o.variant);if(!e)return t?void 0:new B(o);let{class:r,style:a}=e;if(a)try{let n=new CSSStyleSheet;n.replaceSync(a.cssText),o.shadowRoot.adoptedStyleSheets.push(n)}catch{let i=document.createElement("style");i.textContent=a.cssText,o.shadowRoot.appendChild(i)}return new r(o)};function Pe(o){return Xe.get(o)?.fragmentMapping}var Dt=document.createElement("style");Dt.innerHTML=`
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

merch-card [slot='heading-l'] {
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
`;document.head.appendChild(Dt);function Ft(o,t={},{metadata:e=!0,search:r=!0,storage:a=!0}={}){let n;if(r&&n==null){let i=new URLSearchParams(window.location.search),s=Ze(r)?r:o;n=i.get(s)}if(a&&n==null){let i=Ze(a)?a:o;n=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(e&&n==null){let i=xr(Ze(e)?e:o);n=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return n??t[o]}var Ze=o=>typeof o=="string";function xr(o=""){return String(o).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,e,r)=>`${e}-${r}`).replace(/\W+/gu,"-").toLowerCase()}var ve=class o extends Error{constructor(t,e,r){if(super(t,{cause:r}),this.name="MasError",e.response){let a=e.response.headers?.get(ke);a&&(e.requestId=a),e.response.status&&(e.status=e.response.status,e.statusText=e.response.statusText),e.response.url&&(e.url=e.response.url)}delete e.response,this.context=e,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let t=Object.entries(this.context||{}).map(([r,a])=>`${r}: ${JSON.stringify(a)}`).join(", "),e=`${this.name}: ${this.message}`;return t&&(e+=` (${t})`),this.cause&&(e+=`
Caused by: ${this.cause}`),e}};var br={requestId:ke,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Bt(o){let t={};if(!o?.headers)return t;let e=o.headers;for(let[r,a]of Object.entries(br)){let n=e.get(a);n&&(n=n.replace(/[,;]/g,"|"),n=n.replace(/[| ]+/g,"|"),t[r]=n)}return t}async function Ht(o,t={},e=2,r=100){let a;for(let n=0;n<=e;n++)try{let i=await fetch(o,t);return i.retryCount=n,i}catch(i){if(a=i,a.retryCount=n,n>e)break;await new Promise(s=>setTimeout(s,r*(n+1)))}throw a}var Ut="fragment",qt="author",Gt="preview",Je="aem-fragment",z,et=class{constructor(){m(this,z,new Map)}clear(){c(this,z).clear()}addByRequestedId(t,e){c(this,z).set(t,e)}put(t,e){c(this,z).set(t,e)}add(...t){t.forEach(e=>{let{id:r}=e;r&&c(this,z).set(r,e)})}has(t){return c(this,z).has(t)}get(t){return c(this,z).get(t)}remove(t){c(this,z).delete(t)}};z=new WeakMap;var Ie=new et,de,N,O,x,T,A,C,ye,Ee,le,_,jt,Vt,rt,Yt,tt=class extends HTMLElement{constructor(){super(...arguments);m(this,_);d(this,"cache",Ie);m(this,de);m(this,N,null);m(this,O,null);m(this,x,{url:null,retryCount:0,stale:!1,measure:null,status:null});m(this,T,null);m(this,A);m(this,C);m(this,ye,!1);m(this,Ee,0);m(this,le)}static get observedAttributes(){return[Ut,qt,Gt]}attributeChangedCallback(e,r,a){e===Ut&&h(this,A,a),e===qt&&h(this,ye,["","true"].includes(a)),e===Gt&&h(this,le,a)}connectedCallback(){if(!c(this,C)){if(c(this,T)??h(this,T,J(this)),h(this,le,c(this,T).settings?.preview),c(this,de)??h(this,de,c(this,T).log.module(`${Je}[${c(this,A)}]`)),!c(this,A)||c(this,A)==="#"){w(this,_,rt).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(c(this,x)).filter(([e,r])=>r!=null).map(([e,r])=>[`aem-fragment:${e}`,r]))}async refresh(e=!0){if(c(this,C)&&!await Promise.race([c(this,C),Promise.resolve(!1)]))return;e&&Ie.remove(c(this,A));try{h(this,C,w(this,_,Yt).call(this)),await c(this,C)}catch(s){return w(this,_,rt).call(this,s.message),!1}let{references:r,referencesTree:a,placeholders:n,wcs:i}=c(this,N)||{};return i&&!Ft("mas.disableWcsCache")&&c(this,T).prefillWcsCache(i),this.dispatchEvent(new CustomEvent(W,{detail:{...this.data,references:r,referencesTree:a,placeholders:n,...c(this,x)},bubbles:!0,composed:!0})),c(this,C)}get updateComplete(){return c(this,C)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return c(this,O)?c(this,O):(c(this,ye)?this.transformAuthorData():this.transformPublishData(),c(this,O))}transformAuthorData(){let{fields:e,id:r,tags:a,settings:n={}}=c(this,N);h(this,O,e.reduce((i,{name:s,multiple:l,values:p})=>(i.fields[s]=l?p:p[0],i),{fields:{},id:r,tags:a,settings:n}))}transformPublishData(){let{fields:e,id:r,tags:a,settings:n={}}=c(this,N);h(this,O,Object.entries(e).reduce((i,[s,l])=>(i.fields[s]=l?.mimeType?l.value:l??"",i),{fields:{},id:r,tags:a,settings:n}))}async generatePreview(){let{previewFragment:e}=await import("https://mas.adobe.com/studio/libs/fragment-client.js");return await e(c(this,A),{locale:c(this,T).settings.locale,apiKey:c(this,T).settings.wcsApiKey})}};de=new WeakMap,N=new WeakMap,O=new WeakMap,x=new WeakMap,T=new WeakMap,A=new WeakMap,C=new WeakMap,ye=new WeakMap,Ee=new WeakMap,le=new WeakMap,_=new WeakSet,jt=async function(e){dt(this,Ee)._++;let r=`${Je}:${c(this,A)}:${c(this,Ee)}`,a=`${r}${Ce}`,n=`${r}${_e}`;if(c(this,le))return await this.generatePreview();performance.mark(a);let i;try{if(c(this,x).stale=!1,c(this,x).url=e,i=await Ht(e,{cache:"default",credentials:"omit"}),w(this,_,Vt).call(this,i),c(this,x).status=i?.status,c(this,x).measure=Z(performance.measure(n,a)),c(this,x).retryCount=i.retryCount,!i?.ok)throw new ve("Unexpected fragment response",{response:i,...c(this,T).duration});return await i.json()}catch(s){if(c(this,x).measure=Z(performance.measure(n,a)),c(this,x).retryCount=s.retryCount,c(this,N))return c(this,x).stale=!0,c(this,de).error("Serving stale data",c(this,x)),c(this,N);let l=s.message??"unknown";throw new ve(`Failed to fetch fragment: ${l}`,{})}},Vt=function(e){Object.assign(c(this,x),Bt(e))},rt=function(e){h(this,C,null),c(this,x).message=e,this.classList.add("error");let r={...c(this,x),...c(this,T).duration};c(this,de).error(e,r),this.dispatchEvent(new CustomEvent(X,{detail:r,bubbles:!0,composed:!0}))},Yt=async function(){this.classList.remove("error"),h(this,O,null);let e=Ie.get(c(this,A));if(e)return h(this,N,e),!0;let{masIOUrl:r,wcsApiKey:a,locale:n}=c(this,T).settings,i=`${r}/fragment?id=${c(this,A)}&api_key=${a}&locale=${n}`;return e=await w(this,_,jt).call(this,i),Ie.addByRequestedId(c(this,A),e),h(this,N,e),!0};customElements.define(Je,tt);import{LitElement as vr,html as yr,css as Er}from"../lit-all.min.js";var he=class extends vr{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return yr`<div class="badge">
            ${this.text}
        </div>`}};d(he,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),d(he,"styles",Er`
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
    `);customElements.define("merch-badge",he);import{html as wr,css as Sr,LitElement as Ar}from"../lit-all.min.js";var we=class extends Ar{constructor(){super()}render(){return wr`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};d(we,"styles",Sr`
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
    `),d(we,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",we);import{html as ot,css as Tr,LitElement as kr}from"../lit-all.min.js";var Se=class extends kr{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,e)=>{e>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return ot`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?ot`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:ot``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};d(Se,"styles",Tr`
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
    `),d(Se,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",Se);function Cr(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Ae,U=class U extends HTMLAnchorElement{constructor(){super();m(this,Ae,!1);this.setAttribute("is",U.is)}get isUptLink(){return!0}initializeWcsData(e,r){this.setAttribute("data-wcs-osi",e),r&&this.setAttribute("data-promotion-code",r),h(this,Ae,!0),this.composePromoTermsUrl()}attributeChangedCallback(e,r,a){c(this,Ae)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let e=this.getAttribute("data-wcs-osi");if(!e){let b=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${b}`);return}let r=J(),a=[e],n=this.getAttribute("data-promotion-code"),{country:i,language:s,env:l}=r.settings,p={country:i,language:s,wcsOsi:a,promotionCode:n},y=r.resolveOfferSelectors(p);Promise.all(y).then(([[b]])=>{let k=`locale=${s}_${i}&country=${i}&offer_id=${b.offerId}`;n&&(k+=`&promotion_code=${encodeURIComponent(n)}`),this.href=`${Cr(l)}?${k}`}).catch(b=>{console.error(`Could not resolve offer selectors for id: ${e}.`,b.message)})}static createFrom(e){let r=new U;for(let a of e.attributes)a.name!=="is"&&(a.name==="class"&&a.value.includes("upt-link")?r.setAttribute("class",a.value.replace("upt-link","").trim()):r.setAttribute(a.name,a.value));return r.innerHTML=e.innerHTML,r.setAttribute("tabindex",0),r}};Ae=new WeakMap,d(U,"is","upt-link"),d(U,"tag","a"),d(U,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var D=U;window.customElements.get(D.is)||window.customElements.define(D.is,D,{extends:D.tag});var _r="#000000",at="#F8D904",Lr="#EAEAEA",Rr="#31A547",Mr=/(accent|primary|secondary)(-(outline|link))?/,Pr="mas:product_code/",zr="daa-ll",De="daa-lh",Nr=["XL","L","M","S"],nt="...";function L(o,t,e,r){let a=r[o];if(t[o]&&a){let n={slot:a?.slot},i=t[o];if(a.maxCount&&typeof i=="string"){let[l,p]=Xr(i,a.maxCount,a.withSuffix);l!==i&&(n.title=p,i=l)}let s=E(a.tag,n,i);e.append(s)}}function Or(o,t,e){let r=o.mnemonicIcon?.map((n,i)=>({icon:n,alt:o.mnemonicAlt[i]??"",link:o.mnemonicLink[i]??""}));r?.forEach(({icon:n,alt:i,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let l={slot:"icons",src:n,loading:t.loading,size:e?.size??"l"};i&&(l.alt=i),s&&(l.href=s);let p=E("merch-icon",l);t.append(p)});let a=t.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&a&&a.remove()}function $r(o,t,e){if(e.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=at,a=!1;e.allowedBadgeColors?.includes(e.badge?.default)&&(r=e.badge?.default,o.borderColor||(a=!0));let n=o.badgeBackgroundColor||r,i=o.borderColor||"";a&&(i=e.badge?.default,o.borderColor=e.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${n}" border-color="${i}">${o.badge}</merch-badge>`}L("badge",o,t,e)}else o.badge?(t.setAttribute("badge-text",o.badge),t.setAttribute("badge-color",o.badgeColor||_r),t.setAttribute("badge-background-color",o.badgeBackgroundColor||at),t.setAttribute("border-color",o.badgeBackgroundColor||at)):t.setAttribute("border-color",o.borderColor||Lr)}function Ir(o,t,e){if(e.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||Rr;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}L("trialBadge",o,t,e)}}function Dr(o,t,e){e?.includes(o.size)&&t.setAttribute("size",o.size)}function Fr(o,t,e){L("cardTitle",o,t,{cardTitle:e})}function Br(o,t,e){L("subtitle",o,t,e)}function Hr(o,t,e,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}e?.[o.backgroundColor]?(t.style.setProperty("--merch-card-custom-background-color",`var(${e[o.backgroundColor]})`),t.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(t.setAttribute(r.attribute,o.backgroundColor),t.style.removeProperty("--merch-card-custom-background-color"))}function Ur(o,t,e){let r=e?.borderColor,a="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(a),e?.allowedBorderColors?.includes(e?.badge?.default)&&t.style.setProperty(a,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(t.setAttribute("gradient-border","true"),t.style.removeProperty(a)):t.style.setProperty(a,`var(--${o.borderColor})`))}function qr(o,t,e){if(o.backgroundImage){let r={loading:t.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!e)return;if(e?.attribute){t.setAttribute(e.attribute,o.backgroundImage);return}t.append(E(e.tag,{slot:e.slot},E("img",r)))}}function Gr(o,t,e){L("prices",o,t,e)}function Wt(o,t,e){let r=o.hasAttribute("data-wcs-osi")&&!!o.getAttribute("data-wcs-osi"),a=o.className||"",n=Mr.exec(a)?.[0]??"accent",i=n.includes("accent"),s=n.includes("primary"),l=n.includes("secondary"),p=n.includes("-outline"),y=n.includes("-link");o.classList.remove("accent","primary","secondary");let b;if(t.consonant)b=eo(o,i,r,y,s);else if(y)b=o;else{let k;i?k="accent":s?k="primary":l&&(k="secondary"),b=t.spectrum==="swc"?Jr(o,e,p,k,r):Zr(o,e,p,k,r)}return b}function jr(o,t){let{slot:e}=t?.description,r=o.querySelectorAll(`[slot="${e}"] a[data-wcs-osi]`);r.length&&r.forEach(a=>{let n=Wt(a,o,t);a.replaceWith(n)})}function Vr(o,t,e){L("promoText",o,t,e),L("description",o,t,e),jr(t,e),L("callout",o,t,e),L("quantitySelect",o,t,e),L("whatsIncluded",o,t,e)}function Yr(o,t,e){if(!e.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let a=E("merch-addon",{slot:"addon"},r);[...a.querySelectorAll(v)].forEach(n=>{let i=n.parentElement;i?.nodeName==="P"&&i.setAttribute("data-plan-type","")}),t.append(a)}function Kr(o,t,e){o.addonConfirmation&&L("addonConfirmation",o,t,e)}function Wr(o,t,e,r){r?.secureLabel&&e?.secureLabel&&t.setAttribute("secure-label",r.secureLabel)}function Xr(o,t,e=!0){try{let r=typeof o!="string"?"":o,a=Kt(r);if(a.length<=t)return[r,a];let n=0,i=!1,s=e?t-nt.length<1?1:t-nt.length:t,l=[];for(let b of r){if(n++,b==="<")if(i=!0,r[n]==="/")l.pop();else{let k="";for(let Fe of r.substring(n)){if(Fe===" "||Fe===">")break;k+=Fe}l.push(k)}if(b==="/"&&r[n]===">"&&l.pop(),b===">"){i=!1;continue}if(!i&&(s--,s===0))break}let p=r.substring(0,n).trim();if(l.length>0){l[0]==="p"&&l.shift();for(let b of l.reverse())p+=`</${b}>`}return[`${p}${e?nt:""}`,a]}catch{let a=typeof o=="string"?o:"",n=Kt(a);return[a,n]}}function Kt(o){if(!o)return"";let t="",e=!1;for(let r of o){if(r==="<"&&(e=!0),r===">"){e=!1;continue}e||(t+=r)}return t}function Qr(o,t){t.querySelectorAll("a.upt-link").forEach(r=>{let a=D.createFrom(r);r.replaceWith(a),a.initializeWcsData(o.osi,o.promoCode)})}function Zr(o,t,e,r,a){let n=o;a?n=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):n.innerHTML=`<span>${n.textContent}</span>`,n.setAttribute("tabindex",0);for(let y of o.attributes)["class","is"].includes(y.name)||n.setAttribute(y.name,y.value);n.firstElementChild?.classList.add("spectrum-Button-label");let i=t?.ctas?.size??"M",s=`spectrum-Button--${r}`,l=Nr.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",p=["spectrum-Button",s,l];return e&&p.push("spectrum-Button--outline"),n.classList.add(...p),n}function Jr(o,t,e,r,a){let n=o;a&&(n=customElements.get("checkout-button").createCheckoutButton(o.dataset),n.connectedCallback(),n.render());let i="fill";e&&(i="outline");let s=E("sp-button",{treatment:i,variant:r,tabIndex:0,size:t?.ctas?.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return s.source=n,(a?n.onceSettled():Promise.resolve(n)).then(l=>{s.setAttribute("data-navigation-url",l.href)}),s.addEventListener("click",l=>{l.defaultPrevented||n.click()}),s}function eo(o,t,e,r,a){let n=o;return e&&(n=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r||(n.classList.add("button","con-button"),t&&n.classList.add("blue"),a&&n.classList.add("primary")),n}function to(o,t,e,r){if(o.ctas){let{slot:a}=e.ctas,n=E("div",{slot:a},o.ctas),i=[...n.querySelectorAll("a")].map(s=>Wt(s,t,e));n.innerHTML="",n.append(...i),t.append(n)}}function ro(o,t){let{tags:e}=o,r=e?.find(n=>n.startsWith(Pr))?.split("/").pop();if(!r)return;t.setAttribute(De,r),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((n,i)=>{n.setAttribute(zr,`${n.dataset.analyticsId}-${i+1}`)})}function oo(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,e])=>{o.querySelectorAll(`a.${t}`).forEach(r=>{r.classList.remove(t),r.classList.add("spectrum-Link",`spectrum-Link--${e}`)})})}function ao(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",De].forEach(r=>o.removeAttribute(r));let e=["wide-strip","thin-strip"];o.classList.remove(...e)}async function Xt(o,t){if(!o){let s=t?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${s}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${s}).`)}if(!o.fields){let s=o.id||"unknown",l=t?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'.`)}let{id:e,fields:r,settings:a={}}=o,{variant:n}=r;if(!n)throw new Error(`hydrate: no variant found in payload ${e}`);ao(t),t.settings=a,t.id??(t.id=o.id),t.variant=n,await t.updateComplete;let{aemFragmentMapping:i}=t.variantLayout;if(!i)throw new Error(`hydrate: variant mapping not found for ${e}`);i.style==="consonant"&&t.setAttribute("consonant",!0),Or(r,t,i.mnemonics),$r(r,t,i),Ir(r,t,i),Dr(r,t,i.size),Fr(r,t,i.title),Br(r,t,i),Gr(r,t,i),qr(r,t,i.backgroundImage),Hr(r,t,i.allowedColors,i.backgroundColor),Ur(r,t,i),Vr(r,t,i),Yr(r,t,i),Kr(r,t,i),Wr(r,t,i,a),Qr(r,t),to(r,t,i,n),ro(r,t),oo(t)}var ct="merch-card",it=2e4,Qt="merch-card:";function Zt(o,t){let e=o.closest(ct);if(!e)return t;e.variantLayout?.priceOptionsProvider?.(o,t)}function io(o){o.providers.has(Zt)||o.providers.price(Zt)}var co=0,me,pe,Te,$,j,I,G,q=class extends no{constructor(){super();m(this,I);m(this,me);m(this,pe);m(this,Te);m(this,$);m(this,j);d(this,"customerSegment");d(this,"marketSegment");d(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=Qe(this,!1),this.variantLayout?.connectedCallbackHook()}willUpdate(e){(e.has("variant")||!this.variantLayout)&&(this.variantLayout=Qe(this),this.variantLayout.connectedCallbackHook())}updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),e.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayout?.postCardUpdateHook(e)}catch(r){w(this,I,G).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(v)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(K)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(K)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(K)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let a of r){await a.onceSettled();let n=a.value?.[0]?.planType;if(!n)return;let i=this.stockOfferOsis[n];if(!i)return;let s=a.dataset.wcsOsi.split(",").filter(l=>l!==i);e.checked&&s.push(i),a.dataset.wcsOsi=s.join(",")}}changeHandler(e){e.target.tagName==="MERCH-ADDON"&&this.toggleAddon(e.target)}toggleAddon(e){this.variantLayout?.toggleAddon?.(e);let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length===0)return;let a=n=>{let{offerType:i,planType:s}=n.value?.[0]??{};if(!i||!s)return;let l=e.getOsi(s,i),p=(n.dataset.wcsOsi||"").split(",").filter(y=>y&&y!==l);e.checked&&p.push(l),n.dataset.wcsOsi=p.join(",")};r.forEach(a)}handleQuantitySelection(e){let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length!==0)for(let a of r)a.dataset.quantity=e.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let r={...this.filters};Object.keys(r).forEach(a=>{if(e){r[a].order=Math.min(r[a].order||2,2);return}let n=r[a].order;n===1||isNaN(n)||(r[a].order=Number(n)+1)}),this.filters=r}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}connectedCallback(){super.connectedCallback(),c(this,pe)||h(this,pe,co++),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let e=this.id??c(this,pe);h(this,j,`${Qt}${e}${Ce}`),h(this,me,`${Qt}${e}${_e}`),performance.mark(c(this,j)),h(this,$,J()),io(c(this,$)),h(this,Te,c(this,$).Log.module(ct)),this.addEventListener(He,this.handleQuantitySelection),this.addEventListener(Ue,this.handleAddonAndQuantityUpdate),this.addEventListener(ft,this.handleMerchOfferSelectReady),this.addEventListener(X,this.handleAemFragmentEvents),this.addEventListener(W,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(He,this.handleQuantitySelection),this.removeEventListener(X,this.handleAemFragmentEvents),this.removeEventListener(W,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(Ue,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(e){if(this.isConnected&&(e.type===X&&w(this,I,G).call(this,"AEM fragment cannot be loaded"),e.type===W&&(this.failed=!1,e.target.nodeName==="AEM-FRAGMENT"))){let r=e.detail;try{await Xt(r,this)}catch(a){w(this,I,G).call(this,`hydration has failed: ${a.message}`)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;let e=new Promise(i=>setTimeout(()=>i("timeout"),it));if(this.aemFragment){let i=await Promise.race([this.aemFragment.updateComplete,e]);if(i===!1||i==="timeout"){let s=i==="timeout"?`AEM fragment was not resolved within ${it} timeout`:"AEM fragment cannot be loaded";w(this,I,G).call(this,s,{},!1);return}}let r=[...this.querySelectorAll(ut)],a=Promise.all(r.map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),n=await Promise.race([a,e]);if(n===!0){this.measure=performance.measure(c(this,me),c(this,j));let i={...this.aemFragment?.fetchInfo,...c(this,$).duration,measure:Z(this.measure)};return this.dispatchEvent(new CustomEvent(vt,{bubbles:!0,composed:!0,detail:i})),this}else{this.measure=performance.measure(c(this,me),c(this,j));let i={measure:Z(this.measure),...c(this,$).duration};n==="timeout"?w(this,I,G).call(this,`Contains offers that were not resolved within ${it} timeout`,i):w(this,I,G).call(this,"Contains unresolved offers",i)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let e=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(K)).length===2&&e&&e.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:e,items:r}}){if(!e||!r?.length)return;let a=this.checkoutLinks.find(p=>p.getAttribute("data-modal-id")===e);if(!a)return;let i=new URL(a.getAttribute("href")).searchParams.get("pa"),s=r.find(p=>p.productArrangementCode===i)?.quantity,l=!!r.find(p=>p.productArrangementCode!==i);if(s&&this.quantitySelect?.dispatchEvent(new CustomEvent(bt,{detail:{quantity:s},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==l){this.toggleStockOffer({target:this.addonCheckbox});let p=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(p,"target",{writable:!1,value:{checked:l}}),this.addonCheckbox.handleChange(p)}}};me=new WeakMap,pe=new WeakMap,Te=new WeakMap,$=new WeakMap,j=new WeakMap,I=new WeakSet,G=function(e,r={},a=!0){if(!this.isConnected)return;let i=this.aemFragment?.getAttribute("fragment");i=`[${i}]`;let s={...this.aemFragment.fetchInfo,...c(this,$).duration,...r,message:e};c(this,Te).error(`merch-card${i}: ${e}`,s),this.failed=!0,a&&this.dispatchEvent(new CustomEvent(yt,{bubbles:!0,composed:!0,detail:s}))},d(q,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{if(!e)return;let[r,a,n]=e.split(",");return{PUF:r,ABM:a,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(r=>{let[a,n,i]=r.split(":"),s=Number(n);return[a,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:e=>Object.entries(e).map(([r,{order:a,size:n}])=>[r,a,n].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:De,reflect:!0},loading:{type:String}}),d(q,"styles",[mt,...pt()]),d(q,"registerVariant",S),d(q,"getFragmentMapping",Pe);customElements.define(ct,q);export{q as MerchCard};

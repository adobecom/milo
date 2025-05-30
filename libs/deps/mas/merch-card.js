var He=Object.defineProperty;var Zt=o=>{throw TypeError(o)};var Ue=(o,e,t)=>e in o?He(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var l=(o,e,t)=>Ue(o,typeof e!="symbol"?e+"":e,t),Ot=(o,e,t)=>e.has(o)||Zt("Cannot "+t);var s=(o,e,t)=>(Ot(o,e,"read from private field"),t?t.call(o):e.get(o)),p=(o,e,t)=>e.has(o)?Zt("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),m=(o,e,t,r)=>(Ot(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),A=(o,e,t)=>(Ot(o,e,"access private method"),t);import{LitElement as Hr}from"../lit-all.min.js";import{css as te,unsafeCSS as Jt}from"../lit-all.min.js";var P="(max-width: 767px)",Et="(max-width: 1199px)",u="(min-width: 768px)",g="(min-width: 1200px)",T="(min-width: 1600px)";var ee=te`
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
`,re=()=>[te`
      /* Tablet */
      @media screen and ${Jt(u)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${Jt(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as Fe,html as oe,css as qe}from"../lit-all.min.js";var q=class extends Fe{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:e}=this;return e?oe`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:oe` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};l(q,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),l(q,"styles",qe`
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
    `);customElements.define("merch-icon",q);var Zr=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),Jr=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var x='span[is="inline-price"][data-wcs-osi]',wt='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',ae="sp-button[data-wcs-osi]",ne=`${x},${wt}`;var ce="merch-offer-select:ready",ie="merch-card:ready",se="merch-card:action-menu-toggle";var Nt="merch-quantity-selector:change",de="merch-card-quantity:change",$t="merch-modal:addon-and-quantity-update";var G="aem:load",V="aem:error",le="mas:ready",he="mas:error";var It="mas:resolved";var me="X-Request-Id",to=Object.freeze({CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"}),eo=Object.freeze({V2:"UCv2",V3:"UCv3"}),ro=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var it=":start",pe=":duration";var ge="legal";var Ge="mas-commerce-service";function ue(o,e){let t;return function(){let r=this,a=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(r,a),e)}}function b(o,e={},t=null,r=null){let a=r?document.createElement(o,{is:r}):document.createElement(o);t instanceof HTMLElement?a.appendChild(t):a.innerHTML=t;for(let[n,c]of Object.entries(e))a.setAttribute(n,c);return a}function St(){return window.matchMedia("(max-width: 767px)")}function j(){return St().matches}function fe(){return window.matchMedia("(max-width: 1024px)").matches}function Y(){return document.getElementsByTagName(Ge)?.[0]}var st,$,dt,lt,K,At=class extends HTMLElement{constructor(){super();p(this,st,"");p(this,$);p(this,dt,[]);p(this,lt,[]);p(this,K);m(this,K,ue(()=>{this.isConnected&&(this.parentElement.style.background=this.value,s(this,$)?this.parentElement.style.borderRadius=s(this,$):s(this,$)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let t=s(this,dt).map((r,a)=>{let n=s(this,lt)[a]||"";return`${r} ${n}`}).join(", ");return`linear-gradient(${s(this,st)}, ${t})`}connectedCallback(){s(this,K).call(this)}attributeChangedCallback(t,r,a){t==="border-radius"&&m(this,$,a?.trim()),t==="colors"&&a?m(this,dt,a?.split(",").map(n=>n.trim())??[]):t==="positions"&&a?m(this,lt,a?.split(",").map(n=>n.trim())??[]):t==="angle"&&m(this,st,a?.trim()??""),s(this,K).call(this)}};st=new WeakMap,$=new WeakMap,dt=new WeakMap,lt=new WeakMap,K=new WeakMap;customElements.define("merch-gradient",At);import{LitElement as Ve,html as je,css as Ye}from"../lit-all.min.js";var W=class extends Ve{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this)}getOsi(e,t){let n=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION"],PROMOTION:["PROMOTION","BASE"]}[t]||[t]).map(i=>`p[data-plan-type="${e}"] ${x}[data-offer-type="${i}"]`).join(", ");return this.querySelector(n)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(It,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(It,this.updatePlanType)}updatePlanType(e){if(e.target.tagName!=="SPAN")return;let t=e.target,r=t?.value?.[0];r&&(t.setAttribute("data-offer-type",r.offerType),t.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}render(){return je`<input
                type="checkbox"
                id="addon-checkbox"
                part="checkbox"
                .checked=${this.checked}
                @change=${this.handleChange}
            />
            <label for="addon-checkbox" part="label">
                <slot></slot>
            </label>`}};l(W,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0}}),l(W,"styles",Ye`
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
    `);customElements.define("merch-addon",W);import{html as Tt}from"../lit-all.min.js";var X,ht=class ht{constructor(e){l(this,"card");p(this,X);this.card=e,this.insertVariantStyle()}getContainer(){return m(this,X,s(this,X)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),s(this,X)}insertVariantStyle(){if(!ht.styleMap[this.card.variant]){ht.styleMap[this.card.variant]=!0;let e=document.createElement("style");e.innerHTML=this.getGlobalCSS(),document.head.appendChild(e)}}updateCardElementMinHeight(e,t){if(!e)return;let r=`--consonant-merch-card-${this.card.variant}-${t}-height`,a=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),n=parseInt(this.getContainer().style.getPropertyValue(r))||0;a>n&&this.getContainer().style.setProperty(r,`${a}px`)}get badge(){let e;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Tt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${e}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Tt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let e=this.card.secureLabel?Tt`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return Tt`<footer>${e}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let e=this.card.getBoundingClientRect().width,t=this.card.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return kt(this.card.variant)}};X=new WeakMap,l(ht,"styleMap",{});var f=ht;import{html as Dt,css as Ke}from"../lit-all.min.js";var xe=`
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

@media screen and ${T} {
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
}`;var be={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},Q=class extends f{constructor(t){super(t);l(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(se,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});l(this,"toggleActionMenu",t=>{if(!this.actionMenuContentSlot||!t||t.type!=="click"&&t.code!=="Space"&&t.code!=="Enter")return;t.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});l(this,"toggleActionMenuFromCard",t=>{let r=t?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});l(this,"hideActionMenu",t=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Dt` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${fe()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Dt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Dt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return xe}setAriaExpanded(t,r){t.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};l(Q,"variantStyle",Ke`
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
    `);import{html as mt}from"../lit-all.min.js";var ve=`
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
`;var Ct=class extends f{constructor(e){super(e)}getGlobalCSS(){return ve}renderLayout(){return mt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?mt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:mt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?mt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:mt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Ee}from"../lit-all.min.js";var ye=`
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

@media screen and ${T} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var _t=class extends f{constructor(e){super(e)}getGlobalCSS(){return ye}renderLayout(){return Ee` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Ee`<hr />`} ${this.secureLabelFooter}`}};import{html as Z,css as We,unsafeCSS as Se}from"../lit-all.min.js";var we=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
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
  }

  merch-card[variant="mini-compare-chart"].bullet-list [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-body-xxl-font-size);
    padding: 0 var(--consonant-merch-spacing-xs);
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
    gap: var(--consonant-merch-spacing-xs);
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
    font-color: var(--merch-color-grey-80);
    font-weight: 700;
    padding-block-end: var(--consonant-merch-spacing-xxs);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-size: var(--consonant-merch-card-body-xs-font-size);
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

  merch-card[variant="mini-compare-chart"] .chevron-icon {
    margin-left: 8px;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container {
    display: none;
  }

  merch-card[variant="mini-compare-chart"] .checkmark-copy-container.open {
    display: block;
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
@media screen and ${P} {
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
}

@media screen and ${Et} {
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

@media screen and ${T} {
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
`;var Xe=32,J=class extends f{constructor(t){super(t);l(this,"getRowMinHeightPropertyName",t=>`--consonant-merch-card-footer-row-${t}-min-height`);l(this,"getMiniCompareFooter",()=>{let t=this.card.secureLabel?Z`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Z`<slot name="secure-transaction-label"></slot>`;return Z`<footer>${t}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return we}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let t=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&t.push("footer-rows"),t.forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="footer-rows"] ul');!t||!t.children||[...t.children].forEach((r,a)=>{let n=Math.max(Xe,parseFloat(window.getComputedStyle(r).height)||0),c=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;n>c&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${n}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let a=r.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${x}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(t){let r=this.mainPrice,a=this.headingMPriceSlot;if(!r&&a){let n=t?.getAttribute("plan-type"),c=null;if(t&&n&&(c=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(i=>i.remove()),t.checked){if(c){let i=b("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},c.innerHTML);this.card.appendChild(i)}}else{let i=b("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(i)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,a=this.card.planType;r&&(await r.onceSettled(),a=r.value?.[0]?.planType),a&&(t.planType=a)}renderLayout(){return Z` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?Z`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:Z`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(t=>t.onceSettled())),await this.adjustAddon(),j()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};l(J,"variantStyle",We`
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

    @media screen and ${Se(Et)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Se(g)} {
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
  `);import{html as Lt,css as Qe}from"../lit-all.min.js";var Ae=`
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
@media screen and ${P} {
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
    @media screen and ${T} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var Rt={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},stockOffer:!0,addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Te={...function(){let{whatsIncluded:o,...e}=Rt;return e}(),title:{tag:"p",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},ke={...function(){let{whatsIncluded:o,size:e,quantitySelect:t,...r}=Rt;return r}()},k=class extends f{constructor(e){super(e),this.adaptForMobile=this.adaptForMobile.bind(this)}priceOptionsProvider(e,t){e.dataset.template===ge&&(t.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Ae}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards")){this.card.removeAttribute("size");return}let e=this.card.shadowRoot,t=e.querySelector("footer"),r=this.card.getAttribute("size"),a=e.querySelector("footer #stock-checkbox"),n=e.querySelector(".body #stock-checkbox"),c=e.querySelector(".body");if(!r){t?.classList.remove("wide-footer"),a&&a.remove();return}let i=j();if(t?.classList.toggle("wide-footer",!i),i&&a){n?a.remove():c.appendChild(a);return}!i&&n&&(a?n.remove():t.prepend(n))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${x}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Lt`<div class="divider"></div>`:""}async adjustLegal(){if(await this.card.updateComplete,this.legal)return;let e=[],t=this.card.querySelector(`[slot="heading-m"] ${x}[data-template="price"]`);t&&e.push(t),this.card.querySelectorAll(`[slot="body-xs"] ${x}[data-template="price"]`).forEach(n=>e.push(n));let a=e.map(async n=>{let c=n.cloneNode(!0);n===t&&(this.legal=c),await n.onceSettled(),n?.options&&(n.options.displayPerUnit&&(n.dataset.displayPerUnit="false"),n.options.displayTax&&(n.dataset.displayTax="false"),n.options.displayPlanType&&(n.dataset.displayPlanType="false"),c.setAttribute("data-template","legal"),n.parentNode.insertBefore(c,n.nextSibling))});await Promise.all(a)}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice;if(!t)return;await t.onceSettled();let r=t.value?.[0]?.planType;r&&(e.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?Lt`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}connectedCallbackHook(){let e=St();e?.addEventListener&&e.addEventListener("change",this.adaptForMobile)}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?"":Lt`<slot name="icons"></slot>`}disconnectedCallbackHook(){let e=St();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMobile)}renderLayout(){return Lt` ${this.badge}
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
                <slot name="addon"></slot>
                <slot name="badge"></slot>
                <slot name="quantity-select"></slot>
            </div>
            ${this.secureLabelFooter}`}};l(k,"variantStyle",Qe`
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
    `);import{html as Bt,css as Ze}from"../lit-all.min.js";var Ce=`
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
`;var I=class extends f{constructor(e){super(e),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Ce}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(t=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${t}"]`),t))}renderLayout(){return Bt` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Bt`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Bt`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),j()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${x}[data-template="price"]`)}toggleAddon(e){let t=this.mainPrice,r=this.headingXSSlot;if(!t&&r){let a=e?.getAttribute("plan-type"),n=null;if(e&&a&&(n=e.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(c=>c.remove()),e.checked){if(n){let c=b("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},n.innerHTML);this.card.appendChild(c)}}else{let c=b("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(c)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice,r=this.card.planType;t&&(await t.onceSettled(),r=t.value?.[0]?.planType),r&&(e.planType=r)}};l(I,"variantStyle",Ze`
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
    `);import{html as Ht,css as Je}from"../lit-all.min.js";var _e=`
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
@media screen and ${P} {
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
`;var tt=class extends f{constructor(e){super(e)}getGlobalCSS(){return _e}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ht` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ht`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ht`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};l(tt,"variantStyle",Je`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Ut,css as tr}from"../lit-all.min.js";var Le=`
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

@media screen and ${P} {
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

@media screen and ${T} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Re={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},et=class extends f{constructor(e){super(e)}getGlobalCSS(){return Le}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Ut`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Ut`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Ut`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};l(et,"variantStyle",tr`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Ft=new Map,y=(o,e,t=null,r=null)=>{Ft.set(o,{class:e,fragmentMapping:t,style:r})};y("catalog",Q,be,Q.variantStyle);y("image",Ct);y("inline-heading",_t);y("mini-compare-chart",J,null,J.variantStyle);y("plans",k,Rt,k.variantStyle);y("plans-students",k,ke,k.variantStyle);y("plans-education",k,Te,k.variantStyle);y("product",I,null,I.variantStyle);y("segment",tt,null,tt.variantStyle);y("special-offers",et,Re,et.variantStyle);var qt=(o,e=!1)=>{let t=Ft.get(o.variant);if(!t)return e?void 0:new I(o);let{class:r,style:a}=t;if(a){let n=new CSSStyleSheet;n.replaceSync(a.cssText),o.shadowRoot.adoptedStyleSheets.push(n)}return new r(o)};function kt(o){return Ft.get(o)?.fragmentMapping}var Me=document.createElement("style");Me.innerHTML=`
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
`;document.head.appendChild(Me);var pt=class o extends Error{constructor(e,t,r){if(super(e,{cause:r}),this.name="MasError",t.response){let a=t.response.headers?.get(me);a&&(t.requestId=a),t.response.status&&(t.status=t.response.status,t.statusText=t.response.statusText),t.response.url&&(t.url=t.response.url)}delete t.response,this.context=t,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let e=Object.entries(this.context||{}).map(([r,a])=>`${r}: ${JSON.stringify(a)}`).join(", "),t=`${this.name}: ${this.message}`;return e&&(t+=` (${e})`),this.cause&&(t+=`
Caused by: ${this.cause}`),t}};async function Pe(o,e={},t=2,r=100){let a;for(let n=0;n<=t;n++)try{return await fetch(o,e)}catch(c){if(a=c,n>t)break;await new Promise(i=>setTimeout(i,r*(n+1)))}throw a}var Ne=new CSSStyleSheet;Ne.replaceSync(":host { display: contents; }");var ze="fragment",Oe="author",Mt="aem-fragment",_,Gt=class{constructor(){p(this,_,new Map)}clear(){s(this,_).clear()}addByRequestedId(e,t){s(this,_).set(e,t)}add(...e){e.forEach(t=>{let{id:r}=t;r&&s(this,_).set(r,t)})}has(e){return s(this,_).has(e)}get(e){return s(this,_).get(e)}remove(e){s(this,_).delete(e)}};_=new WeakMap;var gt=new Gt,ut,C,L,rt,ot,z,E,R,ft,xt,jt,Vt=class extends HTMLElement{constructor(){super();p(this,xt);l(this,"cache",gt);p(this,ut);p(this,C,null);p(this,L,null);p(this,rt,!1);p(this,ot,null);p(this,z,null);p(this,E);p(this,R);p(this,ft,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Ne]}static get observedAttributes(){return[ze,Oe]}attributeChangedCallback(t,r,a){t===ze&&m(this,E,a),t===Oe&&m(this,ft,["","true"].includes(a))}connectedCallback(){if(!s(this,R)){if(m(this,z,Y(this)),m(this,ut,s(this,z).log.module(Mt)),m(this,ot,`${Mt}:${s(this,E)}${it}`),performance.mark(s(this,ot)),!s(this,E)){A(this,xt,jt).call(this,{message:"Missing fragment id"});return}this.refresh(!1)}}async getFragmentById(t,r,a){let n=`${Mt}:${r}${pe}`,c;try{if(c=await Pe(t,{cache:"default",credentials:"omit"}),!c?.ok){let{startTime:i,duration:d}=performance.measure(n,a);throw new pt("Unexpected fragment response",{response:c,startTime:i,duration:d,...s(this,z).duration})}return c.json()}catch{let{startTime:d,duration:h}=performance.measure(n,a);throw c||(c={url:t}),new pt("Failed to fetch fragment",{response:c,startTime:d,duration:h,...s(this,z).duration})}}async refresh(t=!0){if(!(s(this,R)&&!await Promise.race([s(this,R),Promise.resolve(!1)])))return t&&gt.remove(s(this,E)),m(this,R,this.fetchData().then(()=>{let{references:r,referencesTree:a,placeholders:n}=s(this,C)||{};return this.dispatchEvent(new CustomEvent(G,{detail:{...this.data,stale:s(this,rt),references:r,referencesTree:a,placeholders:n},bubbles:!0,composed:!0})),!0}).catch(r=>s(this,C)?(gt.addByRequestedId(s(this,E),s(this,C)),!0):(A(this,xt,jt).call(this,r),!1))),s(this,R)}async fetchData(){this.classList.remove("error"),m(this,L,null);let t=gt.get(s(this,E));if(t){m(this,C,t);return}m(this,rt,!0);let{masIOUrl:r,wcsApiKey:a,locale:n}=s(this,z).settings,c=`${r}/fragment?id=${s(this,E)}&api_key=${a}&locale=${n}`;t=await this.getFragmentById(c,s(this,E),s(this,ot)),gt.addByRequestedId(s(this,E),t),m(this,C,t),m(this,rt,!1)}get updateComplete(){return s(this,R)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return s(this,L)?s(this,L):(s(this,ft)?this.transformAuthorData():this.transformPublishData(),s(this,L))}transformAuthorData(){let{fields:t,id:r,tags:a,settings:n={}}=s(this,C);m(this,L,t.reduce((c,{name:i,multiple:d,values:h})=>(c.fields[i]=d?h:h[0],c),{fields:{},id:r,tags:a,settings:n}))}transformPublishData(){let{fields:t,id:r,tags:a,settings:n={}}=s(this,C);m(this,L,Object.entries(t).reduce((c,[i,d])=>(c.fields[i]=d?.mimeType?d.value:d??"",c),{fields:{},id:r,tags:a,settings:n}))}};ut=new WeakMap,C=new WeakMap,L=new WeakMap,rt=new WeakMap,ot=new WeakMap,z=new WeakMap,E=new WeakMap,R=new WeakMap,ft=new WeakMap,xt=new WeakSet,jt=function({message:t,context:r}){this.classList.add("error"),s(this,ut).error(`aem-fragment: ${t}`,r),this.dispatchEvent(new CustomEvent(V,{detail:{message:t,...r},bubbles:!0,composed:!0}))};customElements.define(Mt,Vt);import{LitElement as er,html as rr,css as or}from"../lit-all.min.js";var at=class extends er{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return rr`<div class="badge">
            ${this.text}
        </div>`}};l(at,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),l(at,"styles",or`
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
    `);customElements.define("merch-badge",at);import{html as ar,css as nr,LitElement as cr}from"../lit-all.min.js";var bt=class extends cr{constructor(){super()}render(){return ar`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};l(bt,"styles",nr`
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
    `),l(bt,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",bt);import{html as Yt,css as ir,LitElement as sr}from"../lit-all.min.js";var vt=class extends sr{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((e,t)=>{t>=5&&(e.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return Yt`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?Yt`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:Yt``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};l(vt,"styles",ir`
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
    `),l(vt,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",vt);function dr(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var yt,D=class D extends HTMLAnchorElement{constructor(){super();p(this,yt,!1);this.setAttribute("is",D.is)}get isUptLink(){return!0}initializeWcsData(t,r){this.setAttribute("data-wcs-osi",t),r&&this.setAttribute("data-promotion-code",r),m(this,yt,!0),this.composePromoTermsUrl()}attributeChangedCallback(t,r,a){s(this,yt)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let t=this.getAttribute("data-wcs-osi");if(!t){let v=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${v}`);return}let r=Y(),a=[t],n=this.getAttribute("data-promotion-code"),{country:c,language:i,env:d}=r.settings,h={country:c,language:i,wcsOsi:a,promotionCode:n},w=r.resolveOfferSelectors(h);Promise.all(w).then(([[v]])=>{let N=`locale=${i}_${c}&country=${c}&offer_id=${v.offerId}`;n&&(N+=`&promotion_code=${encodeURIComponent(n)}`),this.href=`${dr(d)}?${N}`}).catch(v=>{console.error(`Could not resolve offer selectors for id: ${t}.`,v.message)})}static createFrom(t){let r=new D;for(let a of t.attributes)a.name!=="is"&&(a.name==="class"&&a.value.includes("upt-link")?r.setAttribute("class",a.value.replace("upt-link","").trim()):r.setAttribute(a.name,a.value));return r.innerHTML=t.innerHTML,r.setAttribute("tabindex",0),r}};yt=new WeakMap,l(D,"is","upt-link"),l(D,"tag","a"),l(D,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var O=D;window.customElements.get(O.is)||window.customElements.define(O.is,O,{extends:O.tag});var lr="#000000",Kt="#F8D904",hr="#EAEAEA",mr="#31A547",pr=/(accent|primary|secondary)(-(outline|link))?/,gr="mas:product_code/",ur="daa-ll",Pt="daa-lh",fr=["XL","L","M","S"],Wt="...";function S(o,e,t,r){let a=r[o];if(e[o]&&a){let n={slot:a?.slot},c=e[o];if(a.maxCount&&typeof c=="string"){let[d,h]=Mr(c,a.maxCount,a.withSuffix);d!==c&&(n.title=h,c=d)}let i=b(a.tag,n,c);t.append(i)}}function xr(o,e,t){let r=o.mnemonicIcon?.map((n,c)=>({icon:n,alt:o.mnemonicAlt[c]??"",link:o.mnemonicLink[c]??""}));r?.forEach(({icon:n,alt:c,link:i})=>{if(i&&!/^https?:/.test(i))try{i=new URL(`https://${i}`).href.toString()}catch{i="#"}let d={slot:"icons",src:n,loading:e.loading,size:t?.size??"l"};c&&(d.alt=c),i&&(d.href=i);let h=b("merch-icon",d);e.append(h)});let a=e.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&a&&a.remove()}function br(o,e,t){if(t.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=Kt,a=!1;t.allowedBadgeColors?.includes(t.badge?.default)&&(r=t.badge?.default,o.borderColor||(a=!0));let n=o.badgeBackgroundColor||r,c=o.borderColor||"";a&&(c=t.badge?.default,o.borderColor=t.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${n}" border-color="${c}">${o.badge}</merch-badge>`}S("badge",o,e,t)}else o.badge?(e.setAttribute("badge-text",o.badge),e.setAttribute("badge-color",o.badgeColor||lr),e.setAttribute("badge-background-color",o.badgeBackgroundColor||Kt),e.setAttribute("border-color",o.badgeBackgroundColor||Kt)):e.setAttribute("border-color",o.borderColor||hr)}function vr(o,e,t){if(t.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||mr;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}S("trialBadge",o,e,t)}}function yr(o,e,t){t?.includes(o.size)&&e.setAttribute("size",o.size)}function Er(o,e,t){S("cardTitle",o,e,{cardTitle:t})}function wr(o,e,t){S("subtitle",o,e,t)}function Sr(o,e,t,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){e.style.removeProperty("--merch-card-custom-background-color"),e.removeAttribute("background-color");return}t?.[o.backgroundColor]?(e.style.setProperty("--merch-card-custom-background-color",`var(${t[o.backgroundColor]})`),e.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(e.setAttribute(r.attribute,o.backgroundColor),e.style.removeProperty("--merch-card-custom-background-color"))}function Ar(o,e,t){let r=t?.borderColor,a="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(e.style.removeProperty(a),t?.allowedBorderColors?.includes(t?.badge?.default)&&e.style.setProperty(a,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(e.setAttribute("gradient-border","true"),e.style.removeProperty(a)):e.style.setProperty(a,`var(--${o.borderColor})`))}function Tr(o,e,t){if(o.backgroundImage){let r={loading:e.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!t)return;if(t?.attribute){e.setAttribute(t.attribute,o.backgroundImage);return}e.append(b(t.tag,{slot:t.slot},b("img",r)))}}function kr(o,e,t){S("prices",o,e,t)}function Cr(o,e,t){S("promoText",o,e,t),S("description",o,e,t),S("callout",o,e,t),S("quantitySelect",o,e,t),S("whatsIncluded",o,e,t)}function _r(o,e,t){if(!t.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let a=b("merch-addon",{slot:"addon"},r);[...a.querySelectorAll(x)].forEach(n=>{let c=n.parentElement;c?.nodeName==="P"&&c.setAttribute("data-plan-type","")}),e.append(a)}function Lr(o,e,t){o.addonConfirmation&&S("addonConfirmation",o,e,t)}function Rr(o,e,t,r){o.showStockCheckbox&&t.stockOffer&&(e.setAttribute("checkbox-label",r?.stockCheckboxLabel?r.stockCheckboxLabel:""),e.setAttribute("stock-offer-osis",r?.stockOfferOsis?r.stockOfferOsis:"")),r?.secureLabel&&t?.secureLabel&&e.setAttribute("secure-label",r.secureLabel)}function Mr(o,e,t=!0){try{let r=typeof o!="string"?"":o,a=$e(r);if(a.length<=e)return[r,a];let n=0,c=!1,i=t?e-Wt.length<1?1:e-Wt.length:e,d=[];for(let v of r){if(n++,v==="<")if(c=!0,r[n]==="/")d.pop();else{let N="";for(let F of r.substring(n)){if(F===" "||F===">")break;N+=F}d.push(N)}if(v==="/"&&r[n]===">"&&d.pop(),v===">"){c=!1;continue}if(!c&&(i--,i===0))break}let h=r.substring(0,n).trim();if(d.length>0){d[0]==="p"&&d.shift();for(let v of d.reverse())h+=`</${v}>`}return[`${h}${t?Wt:""}`,a]}catch{let a=typeof o=="string"?o:"",n=$e(a);return[a,n]}}function $e(o){if(!o)return"";let e="",t=!1;for(let r of o){if(r==="<"&&(t=!0),r===">"){t=!1;continue}t||(e+=r)}return e}function Pr(o,e){e.querySelectorAll("a.upt-link").forEach(r=>{let a=O.createFrom(r);r.replaceWith(a),a.initializeWcsData(o.osi,o.promoCode)})}function zr(o,e,t,r,a){let n=o;a?n=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):n.innerHTML=`<span>${n.textContent}</span>`,n.setAttribute("tabindex",0);for(let w of o.attributes)["class","is"].includes(w.name)||n.setAttribute(w.name,w.value);n.firstElementChild?.classList.add("spectrum-Button-label");let c=e.ctas.size??"M",i=`spectrum-Button--${r}`,d=fr.includes(c)?`spectrum-Button--size${c}`:"spectrum-Button--sizeM",h=["spectrum-Button",i,d];return t&&h.push("spectrum-Button--outline"),n.classList.add(...h),n}function Or(o,e,t,r,a){let n=o;a&&(n=customElements.get("checkout-button").createCheckoutButton(o.dataset),n.connectedCallback(),n.render());let c="fill";t&&(c="outline");let i=b("sp-button",{treatment:c,variant:r,tabIndex:0,size:e.ctas.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return i.source=n,(a?n.onceSettled():Promise.resolve(n)).then(d=>{i.setAttribute("data-navigation-url",d.href)}),i.addEventListener("click",d=>{d.defaultPrevented||n.click()}),i}function Nr(o,e,t){let r=o;return t&&(r=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r.classList.add("con-button"),e&&r.classList.add("blue"),r}function $r(o,e,t,r){if(o.ctas){let{slot:a}=t.ctas,n=b("div",{slot:a},o.ctas),c=[...n.querySelectorAll("a")].map(i=>{let d=i.hasAttribute("data-wcs-osi")&&!!i.getAttribute("data-wcs-osi"),h=pr.exec(i.className)?.[0]??"accent",w=h.includes("accent"),v=h.includes("primary"),N=h.includes("secondary"),F=h.includes("-outline"),Be=h.includes("-link");if(i.classList.remove("accent","primary","secondary"),e.consonant)return Nr(i,w,d);if(Be)return i;let ct;return w?ct="accent":v?ct="primary":N&&(ct="secondary"),e.spectrum==="swc"?Or(i,t,F,ct,d):zr(i,t,F,ct,d)});n.innerHTML="",n.append(...c),e.append(n)}}function Ir(o,e){let{tags:t}=o,r=t?.find(n=>n.startsWith(gr))?.split("/").pop();if(!r)return;e.setAttribute(Pt,r),[...e.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...e.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((n,c)=>{n.setAttribute(ur,`${n.dataset.analyticsId}-${c+1}`)})}function Dr(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([e,t])=>{o.querySelectorAll(`a.${e}`).forEach(r=>{r.classList.remove(e),r.classList.add("spectrum-Link",`spectrum-Link--${t}`)})})}function Br(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",Pt].forEach(r=>o.removeAttribute(r));let t=["wide-strip","thin-strip"];o.classList.remove(...t)}async function Ie(o,e){if(!o){let i=e?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${i}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${i}).`)}if(!o.fields){let i=o.id||"unknown",d=e?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${i}' (merchCard id: ${d}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${i}' (merchCard id: ${d}) is missing 'fields'.`)}let{id:t,fields:r,settings:a={}}=o,{variant:n}=r;if(!n)throw new Error(`hydrate: no variant found in payload ${t}`);Br(e),e.settings=a,e.id??(e.id=o.id),e.variant=n,await e.updateComplete;let{aemFragmentMapping:c}=e.variantLayout;if(!c)throw new Error(`hydrate: variant mapping not found for ${t}`);c.style==="consonant"&&e.setAttribute("consonant",!0),xr(r,e,c.mnemonics),br(r,e,c),vr(r,e,c),yr(r,e,c.size),Er(r,e,c.title),wr(r,e,c),kr(r,e,c),Tr(r,e,c.backgroundImage),Sr(r,e,c.allowedColors,c.backgroundColor),Ar(r,e,c),Cr(r,e,c),_r(r,e,c),Lr(r,e,c),Rr(r,e,c,a),Pr(r,e),$r(r,e,c,n),Ir(r,e),Dr(e)}var Qt="merch-card",Ur=":ready",Fr=":error",Xt=2e4,zt="merch-card:";function De(o,e){let t=o.closest(Qt);if(!t)return e;t.variantLayout?.priceOptionsProvider?.(o,e)}function qr(o){o.providers.has(De)||o.providers.price(De)}var nt,U,M,H,B=class extends Hr{constructor(){super();p(this,M);l(this,"customerSegment");l(this,"marketSegment");l(this,"variantLayout");p(this,nt);p(this,U);l(this,"readyEventDispatched",!1);this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=qt(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(t=>{A(this,M,H).call(this,t,{},!1),this.style.display="none"})}willUpdate(t){(t.has("variant")||!this.variantLayout)&&(this.variantLayout=qt(this),this.variantLayout.connectedCallbackHook())}updated(t){(t.has("badgeBackgroundColor")||t.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),t.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayout?.postCardUpdateHook(t)}catch(r){A(this,M,H).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(x)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(wt)??[]]}async toggleStockOffer({target:t}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let a of r){await a.onceSettled();let n=a.value?.[0]?.planType;if(!n)return;let c=this.stockOfferOsis[n];if(!c)return;let i=a.dataset.wcsOsi.split(",").filter(d=>d!==c);t.checked&&i.push(c),a.dataset.wcsOsi=i.join(",")}}changeHandler(t){t.target.tagName==="MERCH-ADDON"&&this.toggleAddon(t.target)}toggleAddon(t){let r=this.checkoutLinks;if(this.variantLayout?.toggleAddon?.(t),r.length!==0)for(let a of r){let{offerType:n,planType:c}=a.value?.[0];if(!n||!c)return;let i=t.getOsi(c,n),d=a.dataset.wcsOsi.split(",").filter(h=>h!==i);t.checked&&d.push(i),a.dataset.wcsOsi=d.join(",")}}handleQuantitySelection(t){let r=this.checkoutLinks;for(let a of r)a.dataset.quantity=t.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(t){let r={...this.filters};Object.keys(r).forEach(a=>{if(t){r[a].order=Math.min(r[a].order||2,2);return}let n=r[a].order;n===1||isNaN(n)||(r[a].order=Number(n)+1)}),this.filters=r}includes(t){return this.textContent.match(new RegExp(t,"i"))!==null}connectedCallback(){super.connectedCallback(),m(this,U,Y()),qr(s(this,U)),m(this,nt,s(this,U).Log.module(Qt)),this.id??(this.id=this.querySelector("aem-fragment")?.getAttribute("fragment")),performance.mark(`${zt}${this.id}${it}`),this.addEventListener(Nt,this.handleQuantitySelection),this.addEventListener($t,this.handleAddonAndQuantityUpdate),this.addEventListener(ce,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.addEventListener(V,this.handleAemFragmentEvents),this.addEventListener(G,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Nt,this.handleQuantitySelection),this.removeEventListener(V,this.handleAemFragmentEvents),this.removeEventListener(G,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener($t,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(t){if(this.isConnected&&(t.type===V&&A(this,M,H).call(this,`AEM fragment cannot be loaded: ${t.detail.message}`,t.detail),t.type===G&&t.target.nodeName==="AEM-FRAGMENT")){let r=t.detail;Ie(r,this).then(()=>this.checkReady()).catch(a=>s(this,nt).error(a))}}async checkReady(){if(!this.isConnected)return;let t=new Promise(c=>setTimeout(()=>c("timeout"),Xt));if(this.aemFragment){let c=await Promise.race([this.aemFragment.updateComplete,t]);if(c===!1){let i=c==="timeout"?`AEM fragment was not resolved within ${Xt} timeout`:"AEM fragment cannot be loaded";A(this,M,H).call(this,i,{},!1);return}}let r=[...this.querySelectorAll(ne)];r.push(...[...this.querySelectorAll(ae)].map(c=>c.source));let a=Promise.all(r.map(c=>c.onceSettled().catch(()=>c))).then(c=>c.every(i=>i.classList.contains("placeholder-resolved"))),n=await Promise.race([a,t]);if(n===!0)return performance.mark(`${zt}${this.id}${Ur}`),this.readyEventDispatched||(this.readyEventDispatched=!0,this.dispatchEvent(new CustomEvent(le,{bubbles:!0,composed:!0}))),this;{let{duration:c,startTime:i}=performance.measure(`${zt}${this.id}${Fr}`,`${zt}${this.id}${it}`),d={duration:c,startTime:i,...s(this,U).duration};n==="timeout"?A(this,M,H).call(this,`Contains offers that were not resolved within ${Xt} timeout`,d):A(this,M,H).call(this,"Contains unresolved offers",d)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let t=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(wt)).length===2&&t&&t.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(ie,{bubbles:!0})),this.displayFooterElementsInColumn())}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:t,items:r}}){if(!t||!r?.length)return;let a=this.checkoutLinks.find(h=>h.getAttribute("data-modal-id")===t);if(!a)return;let c=new URL(a.getAttribute("href")).searchParams.get("pa"),i=r.find(h=>h.productArrangementCode===c)?.quantity,d=!!r.find(h=>h.productArrangementCode!==c);if(i&&this.quantitySelect?.dispatchEvent(new CustomEvent(de,{detail:{quantity:i},bubbles:!0,composed:!0})),this.addonCheckbox?.checked!==d){this.toggleStockOffer({target:this.addonCheckbox});let h=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(h,"target",{writable:!1,value:{checked:d}}),this.addonCheckbox.handleChange(h)}}};nt=new WeakMap,U=new WeakMap,M=new WeakSet,H=function(t,r={},a=!0){s(this,nt).error(`merch-card: ${t}`,r),this.failed=!0,a&&this.dispatchEvent(new CustomEvent(he,{detail:{...r,message:t},bubbles:!0,composed:!0}))},l(B,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:t=>{if(!t)return;let[r,a,n]=t.split(",");return{PUF:r,ABM:a,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:t=>Object.fromEntries(t.split(",").map(r=>{let[a,n,c]=r.split(":"),i=Number(n);return[a,{order:isNaN(i)?void 0:i,size:c}]})),toAttribute:t=>Object.entries(t).map(([r,{order:a,size:n}])=>[r,a,n].filter(c=>c!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Pt,reflect:!0},loading:{type:String}}),l(B,"styles",[ee,...re()]),l(B,"registerVariant",y),l(B,"getFragmentMapping",kt);customElements.define(Qt,B);export{B as MerchCard};
//# sourceMappingURL=merch-card.js.map

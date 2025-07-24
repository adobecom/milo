var Ze=Object.defineProperty;var se=o=>{throw TypeError(o)};var Je=(o,e,t)=>e in o?Ze(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var d=(o,e,t)=>Je(o,typeof e!="symbol"?e+"":e,t),Ht=(o,e,t)=>e.has(o)||se("Cannot "+t);var i=(o,e,t)=>(Ht(o,e,"read from private field"),t?t.call(o):e.get(o)),p=(o,e,t)=>e.has(o)?se("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(o):e.set(o,t),m=(o,e,t,r)=>(Ht(o,e,"write to private field"),r?r.call(o,t):e.set(o,t),t),S=(o,e,t)=>(Ht(o,e,"access private method"),t);var de=(o,e,t,r)=>({set _(a){m(o,e,a,t)},get _(){return i(o,e,r)}});import{LitElement as ro}from"../lit-all.min.js";import{css as he,unsafeCSS as le}from"../lit-all.min.js";var _="(max-width: 767px)",St="(max-width: 1199px)",f="(min-width: 768px)",g="(min-width: 1200px)",P="(min-width: 1600px)";function At(){return window.matchMedia(_)}function kt(){return window.matchMedia(g)}function Tt(){return At().matches}function Ct(){return kt().matches}var me=he`
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
`,pe=()=>[he`
      /* Tablet */
      @media screen and ${le(f)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${le(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{LitElement as tr,html as ge,css as er}from"../lit-all.min.js";var G=class extends tr{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:e}=this;return e?ge`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:ge` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};d(G,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),d(G,"styles",er`
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
    `);customElements.define("merch-icon",G);var go=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),uo=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var y='span[is="inline-price"][data-wcs-osi]',V='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var ue=`${y},${V}`;var fe="merch-offer-select:ready",xe="merch-card:action-menu-toggle";var Ut="merch-quantity-selector:change",be="merch-card-quantity:change",qt="merch-modal:addon-and-quantity-update";var Y="aem:load",K="aem:error",ve="mas:ready",ye="mas:error";var jt="mas:resolved";var _t="X-Request-Id",fo=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var xo=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var Lt=":start",Rt=":duration";var Ee="legal";var rr="mas-commerce-service";function we(o,e){let t;return function(){let r=this,a=arguments;clearTimeout(t),t=setTimeout(()=>o.apply(r,a),e)}}function E(o,e={},t=null,r=null){let a=r?document.createElement(o,{is:r}):document.createElement(o);t instanceof HTMLElement?a.appendChild(t):a.innerHTML=t;for(let[n,c]of Object.entries(e))a.setAttribute(n,c);return a}function W(o){return`startTime:${o.startTime.toFixed(2)}|duration:${o.duration.toFixed(2)}`}function Se(){return window.matchMedia("(max-width: 1024px)").matches}function Q(){return document.getElementsByTagName(rr)?.[0]}var lt,F,ht,mt,X,Mt=class extends HTMLElement{constructor(){super();p(this,lt,"");p(this,F);p(this,ht,[]);p(this,mt,[]);p(this,X);m(this,X,we(()=>{this.isConnected&&(this.parentElement.style.background=this.value,i(this,F)?this.parentElement.style.borderRadius=i(this,F):i(this,F)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let t=i(this,ht).map((r,a)=>{let n=i(this,mt)[a]||"";return`${r} ${n}`}).join(", ");return`linear-gradient(${i(this,lt)}, ${t})`}connectedCallback(){i(this,X).call(this)}attributeChangedCallback(t,r,a){t==="border-radius"&&m(this,F,a?.trim()),t==="colors"&&a?m(this,ht,a?.split(",").map(n=>n.trim())??[]):t==="positions"&&a?m(this,mt,a?.split(",").map(n=>n.trim())??[]):t==="angle"&&m(this,lt,a?.trim()??""),i(this,X).call(this)}};lt=new WeakMap,F=new WeakMap,ht=new WeakMap,mt=new WeakMap,X=new WeakMap;customElements.define("merch-gradient",Mt);import{LitElement as or,html as ar,css as nr}from"../lit-all.min.js";var Z=class extends or{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this),this.handleCustomClick=this.handleCustomClick.bind(this)}getOsi(e,t){let n=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION","TRIAL"],PROMOTION:["PROMOTION","BASE","TRIAL"]}[t]||[t]).map(s=>`p[data-plan-type="${e}"] ${y}[data-offer-type="${s}"]`).join(", ");return this.querySelector(n)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(jt,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(jt,this.updatePlanType)}updatePlanType(e){if(e.target.tagName!=="SPAN")return;let t=e.target,r=t?.value?.[0];r&&(t.setAttribute("data-offer-type",r.offerType),t.closest("p").setAttribute("data-plan-type",r.planType))}handleChange(e){this.checked=e.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}handleCustomClick(){this.shadowRoot.querySelector("input").click()}render(){return ar`
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
            </label>`}};d(Z,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0},customCheckbox:{type:Boolean,attribute:"custom-checkbox",reflect:!0}}),d(Z,"styles",nr`
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
    `);customElements.define("merch-addon",Z);import{html as Pt,nothing as cr}from"../lit-all.min.js";var J,pt=class pt{constructor(e){d(this,"card");p(this,J);this.card=e,this.insertVariantStyle()}getContainer(){return m(this,J,i(this,J)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),i(this,J)}insertVariantStyle(){if(!pt.styleMap[this.card.variant]){pt.styleMap[this.card.variant]=!0;let e=document.createElement("style");e.innerHTML=this.getGlobalCSS(),document.head.appendChild(e)}}updateCardElementMinHeight(e,t){if(!e)return;let r=`--consonant-merch-card-${this.card.variant}-${t}-height`,a=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),n=parseInt(this.getContainer().style.getPropertyValue(r))||0;a>n&&this.getContainer().style.setProperty(r,`${a}px`)}get badge(){let e;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Pt`
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
            >`:cr}get secureLabelFooter(){return Pt`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let e=this.card.getBoundingClientRect().width,t=this.card.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return zt(this.card.variant)}};J=new WeakMap,d(pt,"styleMap",{});var b=pt;import{html as Gt,css as ir}from"../lit-all.min.js";var Ae=`
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

@media screen and ${f} {
    :root {
        --consonant-merch-card-catalog-width: 302px;
    }
}

@media screen and ${g} {
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
}`;var ke={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},tt=class extends b{constructor(t){super(t);d(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(xe,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});d(this,"toggleActionMenu",t=>{if(!this.actionMenuContentSlot||!t||t.type!=="click"&&t.code!=="Space"&&t.code!=="Enter")return;t.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let r=this.actionMenuContentSlot.classList.contains("hidden");r||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!r).toString())});d(this,"toggleActionMenuFromCard",t=>{let r=t?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(r||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",r),this.setAriaExpanded(this.actionMenu,"false"))});d(this,"hideActionMenu",t=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Gt` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Se()&&this.card.actionMenu?"always-visible":""}
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
            <slot></slot>`}getGlobalCSS(){return Ae}setAriaExpanded(t,r){t.setAttribute("aria-expanded",r)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};d(tt,"variantStyle",ir`
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
    `);import{html as gt}from"../lit-all.min.js";var Te=`
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
`;var Nt=class extends b{constructor(e){super(e)}getGlobalCSS(){return Te}renderLayout(){return gt`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?gt`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:gt`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?gt`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:gt`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as _e}from"../lit-all.min.js";var Ce=`
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

@media screen and ${P} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var Ot=class extends b{constructor(e){super(e)}getGlobalCSS(){return Ce}renderLayout(){return _e` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":_e`<hr />`} ${this.secureLabelFooter}`}};import{html as et,css as sr,unsafeCSS as Vt}from"../lit-all.min.js";var Le=`
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
@media screen and ${_} {
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

@media screen and ${St} {
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

@media screen and ${P} {
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
`;var dr=32,rt=class extends b{constructor(t){super(t);d(this,"getRowMinHeightPropertyName",t=>`--consonant-merch-card-footer-row-${t}-min-height`);d(this,"getMiniCompareFooter",()=>{let t=this.card.secureLabel?et`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:et`<slot name="secure-transaction-label"></slot>`;return et`<footer>${t}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Le}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let t=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&t.push("footer-rows"),t.forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let r=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");r&&r.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let t=this.card.querySelector('[slot="footer-rows"] ul');!t||!t.children||[...t.children].forEach((r,a)=>{let n=Math.max(dr,parseFloat(window.getComputedStyle(r).height)||0),c=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;n>c&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${n}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(r=>{let a=r.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&r.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${y}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(t){let r=this.mainPrice,a=this.headingMPriceSlot;if(!r&&a){let n=t?.getAttribute("plan-type"),c=null;if(t&&n&&(c=t.querySelector(`p[data-plan-type="${n}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(s=>s.remove()),t.checked){if(c){let s=E("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},c.innerHTML);this.card.appendChild(s)}}else{let s=E("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(s)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let r=this.mainPrice,a=this.card.planType;r&&(await r.onceSettled(),a=r.value?.[0]?.planType),a&&(t.planType=a)}renderLayout(){return et` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?et`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:et`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(t=>t.onceSettled())),await this.adjustAddon(),Tt()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};d(rt,"variantStyle",sr`
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

    @media screen and ${Vt(_)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${Vt(St)} {
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
  `);import{html as ut,css as lr,nothing as $t}from"../lit-all.min.js";var Re=`
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
@media screen and ${_} {
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
@media screen and ${f} {
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
@media screen and ${g} {
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
@media screen and ${P} {
    .columns .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}
`;var It={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Me={...function(){let{whatsIncluded:o,size:e,...t}=It;return t}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Pe={...function(){let{whatsIncluded:o,size:e,quantitySelect:t,...r}=It;return r}()},w=class extends b{constructor(e){super(e),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(e,t){e.dataset.template===Ee&&(t.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Re}adjustSlotPlacement(e,t,r){let a=this.card.shadowRoot,n=a.querySelector("footer"),c=this.card.getAttribute("size"),s=a.querySelector(`footer slot[name="${e}"]`),l=a.querySelector(`.body slot[name="${e}"]`),h=a.querySelector(".body");if((!c||!c.includes("wide"))&&(n?.classList.remove("wide-footer"),s&&s.remove()),!!t.includes(c)){if(n?.classList.toggle("wide-footer",Ct()),!r&&s){if(l)s.remove();else{let u=h.querySelector(`[data-placeholder-for="${e}"]`);u?u.replaceWith(s):h.appendChild(s)}return}if(r&&l){let u=document.createElement("div");if(u.setAttribute("data-placeholder-for",e),u.classList.add("slot-placeholder"),!s){let x=l.cloneNode(!0);n.prepend(x)}l.replaceWith(u)}}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["super-wide"],Ct()),this.adjustSlotPlacement("callout-content",["super-wide"],Ct())}adjustCallout(){let e=this.card.querySelector('[slot="callout-content"] .icon-button');e&&e.title&&(e.dataset.tooltip=e.title,e.removeAttribute("title"),e.classList.add("hide-tooltip"),document.addEventListener("touchstart",t=>{t.preventDefault(),t.target!==e?e.classList.add("hide-tooltip"):t.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",t=>{t.preventDefault(),t.target!==e?e.classList.add("hide-tooltip"):t.target.classList.remove("hide-tooltip")}))}adjustPrices(){this.headingM&&(this.headingM.setAttribute("role","heading"),this.headingM.setAttribute("aria-level","2"))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout(),this.adjustPrices()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${y}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?ut`<div class="divider"></div>`:$t}async adjustLegal(){if(await this.card.updateComplete,this.legalAdjusted)return;this.legalAdjusted=!0;let e=[],t=this.card.querySelector(`[slot="heading-m"] ${y}[data-template="price"]`);t&&e.push(t);let r=e.map(async a=>{let n=a.cloneNode(!0);await a.onceSettled(),a?.options&&(a.options.displayPerUnit&&(a.dataset.displayPerUnit="false"),a.options.displayTax&&(a.dataset.displayTax="false"),a.options.displayPlanType&&(a.dataset.displayPlanType="false"),n.setAttribute("data-template","legal"),a.parentNode.insertBefore(n,a.nextSibling))});await Promise.all(r)}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;e.setAttribute("custom-checkbox","");let t=this.mainPrice;if(!t)return;await t.onceSettled();let r=t.value?.[0]?.planType;r&&(e.planType=r)}get stockCheckbox(){return this.card.checkboxLabel?ut`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:$t}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?$t:ut`<slot name="icons"></slot>`}connectedCallbackHook(){let e=At();e?.addEventListener&&e.addEventListener("change",this.adaptForMedia);let t=kt();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let e=At();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMedia);let t=kt();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia)}renderLayout(){return ut` ${this.badge}
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
            ${this.secureLabelFooter}`}};d(w,"variantStyle",lr`
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
    `),d(w,"collectionOptions",{customHeaderArea:e=>e.sidenav?ut`<slot name="resultsText"></slot>`:$t,headerVisibility:{search:!1,sort:!1,result:["mobile","tablet"],custom:["desktop"]}});import{html as Yt,css as hr}from"../lit-all.min.js";var ze=`
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
`;var B=class extends b{constructor(e){super(e),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return ze}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(t=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${t}"]`),t))}renderLayout(){return Yt` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Yt`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Yt`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),Tt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${y}[data-template="price"]`)}toggleAddon(e){let t=this.mainPrice,r=this.headingXSSlot;if(!t&&r){let a=e?.getAttribute("plan-type"),n=null;if(e&&a&&(n=e.querySelector(`p[data-plan-type="${a}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(c=>c.remove()),e.checked){if(n){let c=E("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},n.innerHTML);this.card.appendChild(c)}}else{let c=E("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(c)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let t=this.mainPrice,r=this.card.planType;t&&(await t.onceSettled(),r=t.value?.[0]?.planType),r&&(e.planType=r)}};d(B,"variantStyle",hr`
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
    `);import{html as Kt,css as mr}from"../lit-all.min.js";var Ne=`
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
@media screen and ${_} {
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
`;var ot=class extends b{constructor(e){super(e)}getGlobalCSS(){return Ne}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Kt` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Kt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Kt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};d(ot,"variantStyle",mr`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Wt,css as pr}from"../lit-all.min.js";var Oe=`
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

@media screen and ${_} {
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

@media screen and ${P} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var $e={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},at=class extends b{constructor(e){super(e)}getGlobalCSS(){return Oe}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return Wt`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Wt`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Wt`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};d(at,"variantStyle",pr`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);var Qt=new Map,k=(o,e,t=null,r=null,a)=>{Qt.set(o,{class:e,fragmentMapping:t,style:r,collectionOptions:a})};k("catalog",tt,ke,tt.variantStyle);k("image",Nt);k("inline-heading",Ot);k("mini-compare-chart",rt,null,rt.variantStyle);k("plans",w,It,w.variantStyle,w.collectionOptions);k("plans-students",w,Pe,w.variantStyle,w.collectionOptions);k("plans-education",w,Me,w.variantStyle,w.collectionOptions);k("product",B,null,B.variantStyle);k("segment",ot,null,ot.variantStyle);k("special-offers",at,$e,at.variantStyle);var Xt=(o,e=!1)=>{let t=Qt.get(o.variant);if(!t)return e?void 0:new B(o);let{class:r,style:a}=t;if(a)try{let n=new CSSStyleSheet;n.replaceSync(a.cssText),o.shadowRoot.adoptedStyleSheets.push(n)}catch{let c=document.createElement("style");c.textContent=a.cssText,o.shadowRoot.appendChild(c)}return new r(o)};function zt(o){return Qt.get(o)?.fragmentMapping}var Ie=document.createElement("style");Ie.innerHTML=`
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
    margin-right: var(--merch-sidenav-collection-gap);
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

@media screen and ${f} {
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

    .collection-container {
        --merch-sidenav-collection-gap: var(--spacing-m);
    }
}

@media screen and ${P} {
    .four-merch-cards,
    merch-sidenav ~ .four-merch-cards {
        grid-template-columns: repeat(4, var(--merch-card-collection-card-width));
    }
}

`;document.head.appendChild(Ie);function De(o,e={},{metadata:t=!0,search:r=!0,storage:a=!0}={}){let n;if(r&&n==null){let c=new URLSearchParams(window.location.search),s=Zt(r)?r:o;n=c.get(s)}if(a&&n==null){let c=Zt(a)?a:o;n=window.sessionStorage.getItem(c)??window.localStorage.getItem(c)}if(t&&n==null){let c=gr(Zt(t)?t:o);n=document.documentElement.querySelector(`meta[name="${c}"]`)?.content}return n??e[o]}var Zt=o=>typeof o=="string";function gr(o=""){return String(o).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(e,t,r)=>`${t}-${r}`).replace(/\W+/gu,"-").toLowerCase()}var ft=class o extends Error{constructor(e,t,r){if(super(e,{cause:r}),this.name="MasError",t.response){let a=t.response.headers?.get(_t);a&&(t.requestId=a),t.response.status&&(t.status=t.response.status,t.statusText=t.response.statusText),t.response.url&&(t.url=t.response.url)}delete t.response,this.context=t,Error.captureStackTrace&&Error.captureStackTrace(this,o)}toString(){let e=Object.entries(this.context||{}).map(([r,a])=>`${r}: ${JSON.stringify(a)}`).join(", "),t=`${this.name}: ${this.message}`;return e&&(t+=` (${e})`),this.cause&&(t+=`
Caused by: ${this.cause}`),t}};var ur={requestId:_t,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Fe(o){let e={};if(!o?.headers)return e;let t=o.headers;for(let[r,a]of Object.entries(ur)){let n=t.get(a);n&&(n=n.replace(/[,;]/g,"|"),n=n.replace(/[| ]+/g,"|"),e[r]=n)}return e}async function Be(o,e={},t=2,r=100){let a;for(let n=0;n<=t;n++)try{let c=await fetch(o,e);return c.retryCount=n,c}catch(c){if(a=c,a.retryCount=n,n>t)break;await new Promise(s=>setTimeout(s,r*(n+1)))}throw a}var He="fragment",Ue="author",qe="preview",Jt="aem-fragment",z,te=class{constructor(){p(this,z,new Map)}clear(){i(this,z).clear()}addByRequestedId(e,t){i(this,z).set(e,t)}put(e,t){i(this,z).set(e,t)}add(...e){e.forEach(t=>{let{id:r}=t;r&&i(this,z).set(r,t)})}has(e){return i(this,z).has(e)}get(e){return i(this,z).get(e)}remove(e){i(this,z).delete(e)}};z=new WeakMap;var Dt=new te,nt,N,O,v,T,A,L,xt,bt,ct,R,je,Ge,re,Ve,ee=class extends HTMLElement{constructor(){super(...arguments);p(this,R);d(this,"cache",Dt);p(this,nt);p(this,N,null);p(this,O,null);p(this,v,{url:null,retryCount:0,stale:!1,measure:null,status:null});p(this,T,null);p(this,A);p(this,L);p(this,xt,!1);p(this,bt,0);p(this,ct)}static get observedAttributes(){return[He,Ue,qe]}attributeChangedCallback(t,r,a){t===He&&m(this,A,a),t===Ue&&m(this,xt,["","true"].includes(a)),t===qe&&m(this,ct,a)}connectedCallback(){if(!i(this,L)){if(i(this,T)??m(this,T,Q(this)),m(this,ct,i(this,T).settings?.preview),i(this,nt)??m(this,nt,i(this,T).log.module(`${Jt}[${i(this,A)}]`)),!i(this,A)||i(this,A)==="#"){S(this,R,re).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(i(this,v)).filter(([t,r])=>r!=null).map(([t,r])=>[`aem-fragment:${t}`,r]))}async refresh(t=!0){if(i(this,L)&&!await Promise.race([i(this,L),Promise.resolve(!1)]))return;t&&Dt.remove(i(this,A));try{m(this,L,S(this,R,Ve).call(this)),await i(this,L)}catch(s){return S(this,R,re).call(this,s.message),!1}let{references:r,referencesTree:a,placeholders:n,wcs:c}=i(this,N)||{};return c&&!De("mas.disableWcsCache")&&i(this,T).prefillWcsCache(c),this.dispatchEvent(new CustomEvent(Y,{detail:{...this.data,references:r,referencesTree:a,placeholders:n,...i(this,v)},bubbles:!0,composed:!0})),i(this,L)}get updateComplete(){return i(this,L)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return i(this,O)?i(this,O):(i(this,xt)?this.transformAuthorData():this.transformPublishData(),i(this,O))}transformAuthorData(){let{fields:t,id:r,tags:a,settings:n={}}=i(this,N);m(this,O,t.reduce((c,{name:s,multiple:l,values:h})=>(c.fields[s]=l?h:h[0],c),{fields:{},id:r,tags:a,settings:n}))}transformPublishData(){let{fields:t,id:r,tags:a,settings:n={}}=i(this,N);m(this,O,Object.entries(t).reduce((c,[s,l])=>(c.fields[s]=l?.mimeType?l.value:l??"",c),{fields:{},id:r,tags:a,settings:n}))}getFragmentClientUrl(){let r=new URLSearchParams(window.location.search).get("maslibs");if(!r||r.trim()==="")return"https://mas.adobe.com/studio/libs/fragment-client.js";let a=r.trim().toLowerCase();if(a==="local")return"http://localhost:3030/studio/libs/fragment-client.js";if(a==="main")return"https://mas.adobe.com/studio/libs/fragment-client.js";let{hostname:n}=window.location,c=n.endsWith(".page")?"page":"live";return a.includes("--mas--")?`https://${a}.aem.${c}/studio/libs/fragment-client.js`:a.includes("--")?`https://${a}.aem.${c}/studio/libs/fragment-client.js`:`https://${a}--mas--adobecom.aem.${c}/studio/libs/fragment-client.js`}async generatePreview(){let t=this.getFragmentClientUrl(),{previewFragment:r}=await import(t);return await r(i(this,A),{locale:i(this,T).settings.locale,apiKey:i(this,T).settings.wcsApiKey})}};nt=new WeakMap,N=new WeakMap,O=new WeakMap,v=new WeakMap,T=new WeakMap,A=new WeakMap,L=new WeakMap,xt=new WeakMap,bt=new WeakMap,ct=new WeakMap,R=new WeakSet,je=async function(t){de(this,bt)._++;let r=`${Jt}:${i(this,A)}:${i(this,bt)}`,a=`${r}${Lt}`,n=`${r}${Rt}`;if(i(this,ct))return await this.generatePreview();performance.mark(a);let c;try{if(i(this,v).stale=!1,i(this,v).url=t,c=await Be(t,{cache:"default",credentials:"omit"}),S(this,R,Ge).call(this,c),i(this,v).status=c?.status,i(this,v).measure=W(performance.measure(n,a)),i(this,v).retryCount=c.retryCount,!c?.ok)throw new ft("Unexpected fragment response",{response:c,...i(this,T).duration});return await c.json()}catch(s){if(i(this,v).measure=W(performance.measure(n,a)),i(this,v).retryCount=s.retryCount,i(this,N))return i(this,v).stale=!0,i(this,nt).error("Serving stale data",i(this,v)),i(this,N);let l=s.message??"unknown";throw new ft(`Failed to fetch fragment: ${l}`,{})}},Ge=function(t){Object.assign(i(this,v),Fe(t))},re=function(t){m(this,L,null),i(this,v).message=t,this.classList.add("error");let r={...i(this,v),...i(this,T).duration};i(this,nt).error(t,r),this.dispatchEvent(new CustomEvent(K,{detail:r,bubbles:!0,composed:!0}))},Ve=async function(){this.classList.remove("error"),m(this,O,null);let t=Dt.get(i(this,A));if(t)return m(this,N,t),!0;let{masIOUrl:r,wcsApiKey:a,locale:n}=i(this,T).settings,c=`${r}/fragment?id=${i(this,A)}&api_key=${a}&locale=${n}`;return t=await S(this,R,je).call(this,c),Dt.addByRequestedId(i(this,A),t),m(this,N,t),!0};customElements.define(Jt,ee);import{LitElement as fr,html as xr,css as br}from"../lit-all.min.js";var it=class extends fr{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return xr`<div class="badge">
            ${this.text}
        </div>`}};d(it,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),d(it,"styles",br`
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
    `);customElements.define("merch-badge",it);import{html as vr,css as yr,LitElement as Er}from"../lit-all.min.js";var vt=class extends Er{constructor(){super()}render(){return vr`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};d(vt,"styles",yr`
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
    `),d(vt,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",vt);import{html as oe,css as wr,LitElement as Sr}from"../lit-all.min.js";var yt=class extends Sr{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((e,t)=>{t>=5&&(e.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return oe`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?oe`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:oe``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};d(yt,"styles",wr`
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
    `),d(yt,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",yt);function Ar(o){return`https://${o==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Et,H=class H extends HTMLAnchorElement{constructor(){super();p(this,Et,!1);this.setAttribute("is",H.is)}get isUptLink(){return!0}initializeWcsData(t,r){this.setAttribute("data-wcs-osi",t),r&&this.setAttribute("data-promotion-code",r),m(this,Et,!0),this.composePromoTermsUrl()}attributeChangedCallback(t,r,a){i(this,Et)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let t=this.getAttribute("data-wcs-osi");if(!t){let x=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${x}`);return}let r=Q(),a=[t],n=this.getAttribute("data-promotion-code"),{country:c,language:s,env:l}=r.settings,h={country:c,language:s,wcsOsi:a,promotionCode:n},u=r.resolveOfferSelectors(h);Promise.all(u).then(([[x]])=>{let C=`locale=${s}_${c}&country=${c}&offer_id=${x.offerId}`;n&&(C+=`&promotion_code=${encodeURIComponent(n)}`),this.href=`${Ar(l)}?${C}`}).catch(x=>{console.error(`Could not resolve offer selectors for id: ${t}.`,x.message)})}static createFrom(t){let r=new H;for(let a of t.attributes)a.name!=="is"&&(a.name==="class"&&a.value.includes("upt-link")?r.setAttribute("class",a.value.replace("upt-link","").trim()):r.setAttribute(a.name,a.value));return r.innerHTML=t.innerHTML,r.setAttribute("tabindex",0),r}};Et=new WeakMap,d(H,"is","upt-link"),d(H,"tag","a"),d(H,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var D=H;window.customElements.get(D.is)||window.customElements.define(D.is,D,{extends:D.tag});var kr="#000000",ae="#F8D904",Tr="#EAEAEA",Cr="#31A547",_r=/(accent|primary|secondary)(-(outline|link))?/,Lr="mas:product_code/",Rr="daa-ll",Ft="daa-lh",Mr=["XL","L","M","S"],ne="...";function M(o,e,t,r){let a=r[o];if(e[o]&&a){let n={slot:a?.slot},c=e[o];if(a.maxCount&&typeof c=="string"){let[l,h]=Yr(c,a.maxCount,a.withSuffix);l!==c&&(n.title=h,c=l)}let s=E(a.tag,n,c);t.append(s)}}function Pr(o,e,t){let r=o.mnemonicIcon?.map((n,c)=>({icon:n,alt:o.mnemonicAlt[c]??"",link:o.mnemonicLink[c]??""}));r?.forEach(({icon:n,alt:c,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let l={slot:"icons",src:n,loading:e.loading,size:t?.size??"l"};c&&(l.alt=c),s&&(l.href=s);let h=E("merch-icon",l);e.append(h)});let a=e.shadowRoot.querySelector('slot[name="icons"]');!r?.length&&a&&a.remove()}function zr(o,e,t){if(t.badge?.slot){if(o.badge?.length&&!o.badge?.startsWith("<merch-badge")){let r=ae,a=!1;t.allowedBadgeColors?.includes(t.badge?.default)&&(r=t.badge?.default,o.borderColor||(a=!0));let n=o.badgeBackgroundColor||r,c=o.borderColor||"";a&&(c=t.badge?.default,o.borderColor=t.badge?.default),o.badge=`<merch-badge variant="${o.variant}" background-color="${n}" border-color="${c}">${o.badge}</merch-badge>`}M("badge",o,e,t)}else o.badge?(e.setAttribute("badge-text",o.badge),e.setAttribute("badge-color",o.badgeColor||kr),e.setAttribute("badge-background-color",o.badgeBackgroundColor||ae),e.setAttribute("border-color",o.badgeBackgroundColor||ae)):e.setAttribute("border-color",o.borderColor||Tr)}function Nr(o,e,t){if(t.trialBadge&&o.trialBadge){if(!o.trialBadge.startsWith("<merch-badge")){let r=o.trialBadgeBorderColor||Cr;o.trialBadge=`<merch-badge variant="${o.variant}" border-color="${r}">${o.trialBadge}</merch-badge>`}M("trialBadge",o,e,t)}}function Or(o,e,t){t?.includes(o.size)&&e.setAttribute("size",o.size)}function $r(o,e,t){M("cardTitle",o,e,{cardTitle:t})}function Ir(o,e,t){M("subtitle",o,e,t)}function Dr(o,e,t,r){if(!o.backgroundColor||o.backgroundColor.toLowerCase()==="default"){e.style.removeProperty("--merch-card-custom-background-color"),e.removeAttribute("background-color");return}t?.[o.backgroundColor]?(e.style.setProperty("--merch-card-custom-background-color",`var(${t[o.backgroundColor]})`),e.setAttribute("background-color",o.backgroundColor)):r?.attribute&&o.backgroundColor&&(e.setAttribute(r.attribute,o.backgroundColor),e.style.removeProperty("--merch-card-custom-background-color"))}function Fr(o,e,t){let r=t?.borderColor,a="--merch-card-custom-border-color";o.borderColor?.toLowerCase()==="transparent"?(e.style.removeProperty(a),t?.allowedBorderColors?.includes(t?.badge?.default)&&e.style.setProperty(a,"transparent")):o.borderColor&&r&&(/-gradient/.test(o.borderColor)?(e.setAttribute("gradient-border","true"),e.style.removeProperty(a)):e.style.setProperty(a,`var(--${o.borderColor})`))}function Br(o,e,t){if(o.backgroundImage){let r={loading:e.loading??"lazy",src:o.backgroundImage};if(o.backgroundImageAltText?r.alt=o.backgroundImageAltText:r.role="none",!t)return;if(t?.attribute){e.setAttribute(t.attribute,o.backgroundImage);return}e.append(E(t.tag,{slot:t.slot},E("img",r)))}}function Hr(o,e,t){M("prices",o,e,t)}function Ke(o,e,t){let r=o.hasAttribute("data-wcs-osi")&&!!o.getAttribute("data-wcs-osi"),a=o.className||"",n=_r.exec(a)?.[0]??"accent",c=n.includes("accent"),s=n.includes("primary"),l=n.includes("secondary"),h=n.includes("-outline"),u=n.includes("-link");o.classList.remove("accent","primary","secondary");let x;if(e.consonant)x=Xr(o,c,r,u);else if(u)x=o;else{let C;c?C="accent":s?C="primary":l&&(C="secondary"),x=e.spectrum==="swc"?Qr(o,t,h,C,r):Wr(o,t,h,C,r)}return x}function Ur(o,e){let{slot:t}=e?.description,r=o.querySelectorAll(`[slot="${t}"] a[data-wcs-osi]`);r.length&&r.forEach(a=>{let n=Ke(a,o,e);a.replaceWith(n)})}function qr(o,e,t){M("promoText",o,e,t),M("description",o,e,t),Ur(e,t),M("callout",o,e,t),M("quantitySelect",o,e,t),M("whatsIncluded",o,e,t)}function jr(o,e,t){if(!t.addon)return;let r=o.addon?.replace(/[{}]/g,"");if(!r||/disabled/.test(r))return;let a=E("merch-addon",{slot:"addon"},r);[...a.querySelectorAll(y)].forEach(n=>{let c=n.parentElement;c?.nodeName==="P"&&c.setAttribute("data-plan-type","")}),e.append(a)}function Gr(o,e,t){o.addonConfirmation&&M("addonConfirmation",o,e,t)}function Vr(o,e,t,r){r?.secureLabel&&t?.secureLabel&&e.setAttribute("secure-label",r.secureLabel)}function Yr(o,e,t=!0){try{let r=typeof o!="string"?"":o,a=Ye(r);if(a.length<=e)return[r,a];let n=0,c=!1,s=t?e-ne.length<1?1:e-ne.length:e,l=[];for(let x of r){if(n++,x==="<")if(c=!0,r[n]==="/")l.pop();else{let C="";for(let Bt of r.substring(n)){if(Bt===" "||Bt===">")break;C+=Bt}l.push(C)}if(x==="/"&&r[n]===">"&&l.pop(),x===">"){c=!1;continue}if(!c&&(s--,s===0))break}let h=r.substring(0,n).trim();if(l.length>0){l[0]==="p"&&l.shift();for(let x of l.reverse())h+=`</${x}>`}return[`${h}${t?ne:""}`,a]}catch{let a=typeof o=="string"?o:"",n=Ye(a);return[a,n]}}function Ye(o){if(!o)return"";let e="",t=!1;for(let r of o){if(r==="<"&&(t=!0),r===">"){t=!1;continue}t||(e+=r)}return e}function Kr(o,e){e.querySelectorAll("a.upt-link").forEach(r=>{let a=D.createFrom(r);r.replaceWith(a),a.initializeWcsData(o.osi,o.promoCode)})}function Wr(o,e,t,r,a){let n=o;a?n=customElements.get("checkout-button").createCheckoutButton({},o.innerHTML):n.innerHTML=`<span>${n.textContent}</span>`,n.setAttribute("tabindex",0);for(let u of o.attributes)["class","is"].includes(u.name)||n.setAttribute(u.name,u.value);n.firstElementChild?.classList.add("spectrum-Button-label");let c=e?.ctas?.size??"M",s=`spectrum-Button--${r}`,l=Mr.includes(c)?`spectrum-Button--size${c}`:"spectrum-Button--sizeM",h=["spectrum-Button",s,l];return t&&h.push("spectrum-Button--outline"),n.classList.add(...h),n}function Qr(o,e,t,r,a){let n=o;a&&(n=customElements.get("checkout-button").createCheckoutButton(o.dataset),n.connectedCallback(),n.render());let c="fill";t&&(c="outline");let s=E("sp-button",{treatment:c,variant:r,tabIndex:0,size:e?.ctas?.size??"m",...o.dataset.analyticsId&&{"data-analytics-id":o.dataset.analyticsId}},o.innerHTML);return s.source=n,(a?n.onceSettled():Promise.resolve(n)).then(l=>{s.setAttribute("data-navigation-url",l.href)}),s.addEventListener("click",l=>{l.defaultPrevented||n.click()}),s}function Xr(o,e,t,r){let a=o;return t&&(a=customElements.get("checkout-link").createCheckoutLink(o.dataset,o.innerHTML)),r||(a.classList.add("con-button"),e&&a.classList.add("blue")),a}function Zr(o,e,t,r){if(o.ctas){let{slot:a}=t.ctas,n=E("div",{slot:a},o.ctas),c=[...n.querySelectorAll("a")].map(s=>Ke(s,e,t));n.innerHTML="",n.append(...c),e.append(n)}}function Jr(o,e){let{tags:t}=o,r=t?.find(n=>n.startsWith(Lr))?.split("/").pop();if(!r)return;e.setAttribute(Ft,r),[...e.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...e.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((n,c)=>{n.setAttribute(Rr,`${n.dataset.analyticsId}-${c+1}`)})}function to(o){o.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([e,t])=>{o.querySelectorAll(`a.${e}`).forEach(r=>{r.classList.remove(e),r.classList.add("spectrum-Link",`spectrum-Link--${t}`)})})}function eo(o){o.querySelectorAll("[slot]").forEach(r=>{r.remove()}),o.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",Ft].forEach(r=>o.removeAttribute(r));let t=["wide-strip","thin-strip"];o.classList.remove(...t)}async function We(o,e){if(!o){let s=e?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${s}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${s}).`)}if(!o.fields){let s=o.id||"unknown",l=e?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${s}' (merchCard id: ${l}) is missing 'fields'.`)}let{id:t,fields:r,settings:a={}}=o,{variant:n}=r;if(!n)throw new Error(`hydrate: no variant found in payload ${t}`);eo(e),e.settings=a,e.id??(e.id=o.id),e.variant=n,await e.updateComplete;let{aemFragmentMapping:c}=e.variantLayout;if(!c)throw new Error(`hydrate: variant mapping not found for ${t}`);c.style==="consonant"&&e.setAttribute("consonant",!0),Pr(r,e,c.mnemonics),zr(r,e,c),Nr(r,e,c),Or(r,e,c.size),$r(r,e,c.title),Ir(r,e,c),Hr(r,e,c),Br(r,e,c.backgroundImage),Dr(r,e,c.allowedColors,c.backgroundColor),Fr(r,e,c),qr(r,e,c),jr(r,e,c),Gr(r,e,c),Vr(r,e,c,a),Kr(r,e),Zr(r,e,c,n),Jr(r,e),to(e)}var ie="merch-card",ce=2e4,Qe="merch-card:";function Xe(o,e){let t=o.closest(ie);if(!t)return e;t.variantLayout?.priceOptionsProvider?.(o,e)}function oo(o){o.providers.has(Xe)||o.providers.price(Xe)}var ao=0,st,dt,wt,$,j,I,q,U=class extends ro{constructor(){super();p(this,I);p(this,st);p(this,dt);p(this,wt);p(this,$);p(this,j);d(this,"customerSegment");d(this,"marketSegment");d(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=Xt(this,!1),this.variantLayout?.connectedCallbackHook()}willUpdate(t){(t.has("variant")||!this.variantLayout)&&(this.variantLayout=Xt(this),this.variantLayout.connectedCallbackHook())}updated(t){(t.has("badgeBackgroundColor")||t.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),t.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayout?.postCardUpdateHook(t)}catch(r){S(this,I,q).call(this,`Error in postCardUpdateHook: ${r.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(y)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(V)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(V)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(V)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:t}){if(!this.stockOfferOsis)return;let r=this.checkoutLinks;if(r.length!==0)for(let a of r){await a.onceSettled();let n=a.value?.[0]?.planType;if(!n)return;let c=this.stockOfferOsis[n];if(!c)return;let s=a.dataset.wcsOsi.split(",").filter(l=>l!==c);t.checked&&s.push(c),a.dataset.wcsOsi=s.join(",")}}changeHandler(t){t.target.tagName==="MERCH-ADDON"&&this.toggleAddon(t.target)}toggleAddon(t){this.variantLayout?.toggleAddon?.(t);let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length===0)return;let a=n=>{let{offerType:c,planType:s}=n.value?.[0]??{};if(!c||!s)return;let l=t.getOsi(s,c),h=(n.dataset.wcsOsi||"").split(",").filter(u=>u&&u!==l);t.checked&&h.push(l),n.dataset.wcsOsi=h.join(",")};r.forEach(a)}handleQuantitySelection(t){let r=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(r.length!==0)for(let a of r)a.dataset.quantity=t.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(t){let r={...this.filters};Object.keys(r).forEach(a=>{if(t){r[a].order=Math.min(r[a].order||2,2);return}let n=r[a].order;n===1||isNaN(n)||(r[a].order=Number(n)+1)}),this.filters=r}includes(t){return this.textContent.match(new RegExp(t,"i"))!==null}connectedCallback(){super.connectedCallback(),i(this,dt)||m(this,dt,ao++),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let t=this.id??i(this,dt);m(this,j,`${Qe}${t}${Lt}`),m(this,st,`${Qe}${t}${Rt}`),performance.mark(i(this,j)),m(this,$,Q()),oo(i(this,$)),m(this,wt,i(this,$).Log.module(ie)),this.addEventListener(Ut,this.handleQuantitySelection),this.addEventListener(qt,this.handleAddonAndQuantityUpdate),this.addEventListener(fe,this.handleMerchOfferSelectReady),this.addEventListener(K,this.handleAemFragmentEvents),this.addEventListener(Y,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Ut,this.handleQuantitySelection),this.removeEventListener(K,this.handleAemFragmentEvents),this.removeEventListener(Y,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(qt,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(t){if(this.isConnected&&(t.type===K&&S(this,I,q).call(this,"AEM fragment cannot be loaded"),t.type===Y&&(this.failed=!1,t.target.nodeName==="AEM-FRAGMENT"))){let r=t.detail;try{await We(r,this)}catch(a){S(this,I,q).call(this,`hydration has failed: ${a.message}`)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;let t=new Promise(c=>setTimeout(()=>c("timeout"),ce));if(this.aemFragment){let c=await Promise.race([this.aemFragment.updateComplete,t]);if(c===!1||c==="timeout"){let s=c==="timeout"?`AEM fragment was not resolved within ${ce} timeout`:"AEM fragment cannot be loaded";S(this,I,q).call(this,s,{},!1);return}}let r=[...this.querySelectorAll(ue)],a=Promise.all(r.map(c=>c.onceSettled().catch(()=>c))).then(c=>c.every(s=>s.classList.contains("placeholder-resolved"))),n=await Promise.race([a,t]);if(n===!0){this.measure=performance.measure(i(this,st),i(this,j));let c={...this.aemFragment?.fetchInfo,...i(this,$).duration,measure:W(this.measure)};return this.dispatchEvent(new CustomEvent(ve,{bubbles:!0,composed:!0,detail:c})),this}else{this.measure=performance.measure(i(this,st),i(this,j));let c={measure:W(this.measure),...i(this,$).duration};n==="timeout"?S(this,I,q).call(this,`Contains offers that were not resolved within ${ce} timeout`,c):S(this,I,q).call(this,"Contains unresolved offers",c)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let t=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(V)).length===2&&t&&t.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:t,items:r}}){if(!t||!r?.length)return;let a=this.checkoutLinks.find(h=>h.getAttribute("data-modal-id")===t);if(!a)return;let c=new URL(a.getAttribute("href")).searchParams.get("pa"),s=r.find(h=>h.productArrangementCode===c)?.quantity,l=!!r.find(h=>h.productArrangementCode!==c);if(s&&this.quantitySelect?.dispatchEvent(new CustomEvent(be,{detail:{quantity:s},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==l){this.toggleStockOffer({target:this.addonCheckbox});let h=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(h,"target",{writable:!1,value:{checked:l}}),this.addonCheckbox.handleChange(h)}}};st=new WeakMap,dt=new WeakMap,wt=new WeakMap,$=new WeakMap,j=new WeakMap,I=new WeakSet,q=function(t,r={},a=!0){if(!this.isConnected)return;let c=this.aemFragment?.getAttribute("fragment");c=`[${c}]`;let s={...this.aemFragment.fetchInfo,...i(this,$).duration,...r,message:t};i(this,wt).error(`merch-card${c}: ${t}`,s),this.failed=!0,a&&this.dispatchEvent(new CustomEvent(ye,{bubbles:!0,composed:!0,detail:s}))},d(U,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:t=>{if(!t)return;let[r,a,n]=t.split(",");return{PUF:r,ABM:a,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:t=>Object.fromEntries(t.split(",").map(r=>{let[a,n,c]=r.split(":"),s=Number(n);return[a,{order:isNaN(s)?void 0:s,size:c}]})),toAttribute:t=>Object.entries(t).map(([r,{order:a,size:n}])=>[r,a,n].filter(c=>c!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Ft,reflect:!0},loading:{type:String}}),d(U,"styles",[me,...pe()]),d(U,"registerVariant",k),d(U,"getFragmentMapping",zt);customElements.define(ie,U);export{U as MerchCard};

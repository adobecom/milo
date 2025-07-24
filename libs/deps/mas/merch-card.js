var ut=Object.defineProperty;var ft=r=>{throw TypeError(r)};var dr=(r,t,e)=>t in r?ut(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var xt=(r,t)=>()=>(r&&(t=r(r=0)),t);var lr=(r,t)=>{for(var e in t)ut(r,e,{get:t[e],enumerable:!0})};var d=(r,t,e)=>dr(r,typeof t!="symbol"?t+"":t,e),qe=(r,t,e)=>t.has(r)||ft("Cannot "+e);var s=(r,t,e)=>(qe(r,t,"read from private field"),e?e.call(r):t.get(r)),m=(r,t,e)=>t.has(r)?ft("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),p=(r,t,e,a)=>(qe(r,t,"write to private field"),a?a.call(r,e):t.set(r,e),e),E=(r,t,e)=>(qe(r,t,"access private method"),e);var bt=(r,t,e,a)=>({set _(o){p(r,t,o,e)},get _(){return s(r,t,a)}});var je={};lr(je,{default:()=>B});import{LitElement as hr,html as Le,css as pr}from"../lit-all.min.js";function mr(){return customElements.get("sp-tooltip")!==void 0||document.querySelector("sp-theme")!==null}var B,Ge=xt(()=>{Ve();B=class extends hr{constructor(){super(),this.content="",this.placement="top",this.variant="info",this.size="xs"}get effectiveContent(){return this.tooltipText||this.content||""}get effectivePlacement(){return this.tooltipPlacement||this.placement||"top"}renderIcon(){return this.src?Le`<merch-icon 
            src="${this.src}" 
            size="${this.size}"
        ></merch-icon>`:Le`<slot></slot>`}render(){let t=this.effectiveContent,e=this.effectivePlacement;return t?mr()?Le`
                <overlay-trigger placement="${e}">
                    <span slot="trigger">${this.renderIcon()}</span>
                    <sp-tooltip 
                        placement="${e}"
                        variant="${this.variant}">
                        ${t}
                    </sp-tooltip>
                </overlay-trigger>
            `:Le`
                <span 
                    class="css-tooltip ${e}"
                    data-tooltip="${t}"
                    tabindex="0"
                    role="img"
                    aria-label="${t}">
                    ${this.renderIcon()}
                </span>
            `:this.renderIcon()}};d(B,"properties",{content:{type:String},placement:{type:String},variant:{type:String},src:{type:String},size:{type:String},tooltipText:{type:String,attribute:"tooltip-text"},tooltipPlacement:{type:String,attribute:"tooltip-placement"}}),d(B,"styles",pr`
        :host {
            display: contents;
        }
        
        /* Ensure tooltip container can show overflow */
        mas-tooltip {
            overflow: visible;
        }
        
        /* CSS tooltip styles - these are local fallbacks, main styles in global.css.js */
        .css-tooltip {
            position: relative;
            display: inline-block;
            cursor: pointer;
        }
        
        .css-tooltip[data-tooltip]::before {
            content: attr(data-tooltip);
            position: absolute;
            z-index: 999;
            background: var(--spectrum-gray-800, #323232);
            color: #fff;
            padding: 8px 12px;
            border-radius: 4px;
            white-space: normal;
            width: 200px;
            max-width: 200px;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            font-size: 12px;
            line-height: 1.4;
            text-align: center;
        }
        
        .css-tooltip[data-tooltip]::after {
            content: '';
            position: absolute;
            z-index: 999;
            width: 0;
            height: 0;
            border: 6px solid transparent;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        }
        
        .css-tooltip:hover[data-tooltip]::before,
        .css-tooltip:hover[data-tooltip]::after,
        .css-tooltip:focus[data-tooltip]::before,
        .css-tooltip:focus[data-tooltip]::after {
            opacity: 1;
        }
        
        /* Position variants */
        .css-tooltip.top[data-tooltip]::before {
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 10px;
        }
        
        .css-tooltip.top[data-tooltip]::after {
            top: -80%;
            left: 50%;
            transform: translateX(-50%);
            border-color: var(--spectrum-gray-800, #323232) transparent transparent transparent;
        }
        
        .css-tooltip.bottom[data-tooltip]::before {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 10px;
        }
        
        .css-tooltip.bottom[data-tooltip]::after {
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 5px;
            border-bottom-color: var(--spectrum-gray-800, #323232);
        }
        
        .css-tooltip.left[data-tooltip]::before {
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-right: 10px;
        }
        
        .css-tooltip.left[data-tooltip]::after {
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-right: 5px;
            border-left-color: var(--spectrum-gray-800, #323232);
        }
        
        .css-tooltip.right[data-tooltip]::before {
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 10px;
        }
        
        .css-tooltip.right[data-tooltip]::after {
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            margin-left: 5px;
            border-right-color: var(--spectrum-gray-800, #323232);
        }
    `);customElements.define("mas-tooltip",B)});import{LitElement as gr,html as At,css as ur}from"../lit-all.min.js";function fr(){return customElements.get("sp-tooltip")!==void 0||document.querySelector("sp-theme")!==null}var K,Ve=xt(()=>{K=class extends gr{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}connectedCallback(){super.connectedCallback(),setTimeout(()=>this.handleTooltips(),0)}handleTooltips(){if(fr())return;this.querySelectorAll("sp-tooltip, overlay-trigger").forEach(e=>{let a="",o="top";if(e.tagName==="SP-TOOLTIP")a=e.textContent,o=e.getAttribute("placement")||"top";else if(e.tagName==="OVERLAY-TRIGGER"){let i=e.querySelector("sp-tooltip");i&&(a=i.textContent,o=i.getAttribute("placement")||e.getAttribute("placement")||"top")}if(a){let i=document.createElement("mas-tooltip");i.setAttribute("content",a),i.setAttribute("placement",o);let n=this.querySelector("img"),c=this.querySelector("a");c&&c.contains(n)?i.appendChild(c):n&&i.appendChild(n),this.innerHTML="",this.appendChild(i),Promise.resolve().then(()=>Ge())}e.remove()})}render(){let{href:t}=this;return t?At`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:At` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};d(K,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),d(K,"styles",ur`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
        }

        :host([size='xxs']) {
            --img-width: 13px;
            --img-height: 13px;
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
    `);customElements.define("merch-icon",K)});import{LitElement as va}from"../lit-all.min.js";import{css as wt,unsafeCSS as yt}from"../lit-all.min.js";var T="(max-width: 767px)",Y="(max-width: 1199px)",f="(min-width: 768px)",g="(min-width: 1200px)",R="(min-width: 1600px)";function Ce(){return window.matchMedia(T)}function Te(){return window.matchMedia(g)}function F(){return Ce().matches}function vt(){return Te().matches}var Et=wt`
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
`,St=()=>[wt`
      /* Tablet */
      @media screen and ${yt(f)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${yt(g)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];Ve();var za=Object.freeze({MONTH:"MONTH",YEAR:"YEAR",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",PERPETUAL:"PERPETUAL",TERM_LICENSE:"TERM_LICENSE",ACCESS_PASS:"ACCESS_PASS",THREE_MONTHS:"THREE_MONTHS",SIX_MONTHS:"SIX_MONTHS"}),Na=Object.freeze({ANNUAL:"ANNUAL",MONTHLY:"MONTHLY",TWO_YEARS:"TWO_YEARS",THREE_YEARS:"THREE_YEARS",P1D:"P1D",P1Y:"P1Y",P3Y:"P3Y",P10Y:"P10Y",P15Y:"P15Y",P3D:"P3D",P7D:"P7D",P30D:"P30D",HALF_YEARLY:"HALF_YEARLY",QUARTERLY:"QUARTERLY"});var v='span[is="inline-price"][data-wcs-osi]',W='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]';var kt=`${v},${W}`;var Ct="merch-offer-select:ready",Tt="merch-card:action-menu-toggle";var Ye="merch-quantity-selector:change",Lt="merch-card-quantity:change",Ke="merch-modal:addon-and-quantity-update";var Q="aem:load",X="aem:error",_t="mas:ready",Mt="mas:error";var We="mas:resolved";var _e="X-Request-Id",Oa=Object.freeze({SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"});var $a=Object.freeze({STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"});var Me=":start",Re=":duration";var Rt="legal";var xr="mas-commerce-service";function Pt(r,t){let e;return function(){let a=this,o=arguments;clearTimeout(e),e=setTimeout(()=>r.apply(a,o),t)}}function w(r,t={},e=null,a=null){let o=a?document.createElement(r,{is:a}):document.createElement(r);e instanceof HTMLElement?o.appendChild(e):o.innerHTML=e;for(let[i,n]of Object.entries(t))o.setAttribute(i,n);return o}function Z(r){return`startTime:${r.startTime.toFixed(2)}|duration:${r.duration.toFixed(2)}`}function zt(){return window.matchMedia("(max-width: 1024px)").matches}function J(){return document.getElementsByTagName(xr)?.[0]}var ge,H,ue,fe,ee,Pe=class extends HTMLElement{constructor(){super();m(this,ge,"");m(this,H);m(this,ue,[]);m(this,fe,[]);m(this,ee);p(this,ee,Pt(()=>{this.isConnected&&(this.parentElement.style.background=this.value,s(this,H)?this.parentElement.style.borderRadius=s(this,H):s(this,H)===""&&(this.parentElement.style.borderRadius=""))},1))}static get observedAttributes(){return["colors","positions","angle","border-radius"]}get value(){let e=s(this,ue).map((a,o)=>{let i=s(this,fe)[o]||"";return`${a} ${i}`}).join(", ");return`linear-gradient(${s(this,ge)}, ${e})`}connectedCallback(){s(this,ee).call(this)}attributeChangedCallback(e,a,o){e==="border-radius"&&p(this,H,o?.trim()),e==="colors"&&o?p(this,ue,o?.split(",").map(i=>i.trim())??[]):e==="positions"&&o?p(this,fe,o?.split(",").map(i=>i.trim())??[]):e==="angle"&&p(this,ge,o?.trim()??""),s(this,ee).call(this)}};ge=new WeakMap,H=new WeakMap,ue=new WeakMap,fe=new WeakMap,ee=new WeakMap;customElements.define("merch-gradient",Pe);import{LitElement as br,html as vr,css as yr}from"../lit-all.min.js";var te=class extends br{constructor(){super(),this.planType=void 0,this.checked=!1,this.updatePlanType=this.updatePlanType.bind(this),this.handleChange=this.handleChange.bind(this),this.handleCustomClick=this.handleCustomClick.bind(this)}getOsi(t,e){let i=({TRIAL:["TRIAL"],BASE:["BASE","PROMOTION","TRIAL"],PROMOTION:["PROMOTION","BASE","TRIAL"]}[e]||[e]).map(c=>`p[data-plan-type="${t}"] ${v}[data-offer-type="${c}"]`).join(", ");return this.querySelector(i)?.dataset?.wcsOsi}connectedCallback(){super.connectedCallback(),this.addEventListener(We,this.updatePlanType)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener(We,this.updatePlanType)}updatePlanType(t){if(t.target.tagName!=="SPAN")return;let e=t.target,a=e?.value?.[0];a&&(e.setAttribute("data-offer-type",a.offerType),e.closest("p").setAttribute("data-plan-type",a.planType))}handleChange(t){this.checked=t.target.checked,this.dispatchEvent(new CustomEvent("change",{detail:{checked:this.checked},bubbles:!0,composed:!0}))}handleCustomClick(){this.shadowRoot.querySelector("input").click()}render(){return vr`
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
            </label>`}};d(te,"properties",{planType:{type:String,attribute:"plan-type",reflect:!0},checked:{type:Boolean,reflect:!0},customCheckbox:{type:Boolean,attribute:"custom-checkbox",reflect:!0}}),d(te,"styles",yr`
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
    `);customElements.define("merch-addon",te);import{html as ze,nothing as wr}from"../lit-all.min.js";var re,xe=class xe{constructor(t){d(this,"card");m(this,re);this.card=t,this.insertVariantStyle()}getContainer(){return p(this,re,s(this,re)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),s(this,re)}insertVariantStyle(){if(!xe.styleMap[this.card.variant]){xe.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,e){if(!t)return;let a=`--consonant-merch-card-${this.card.variant}-${e}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(a))||0;o>i&&this.getContainer().style.setProperty(a,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),ze`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return ze` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabel(){return this.card.secureLabel?ze`<span class="secure-transaction-label"
                >${this.card.secureLabel}</span
            >`:wr}get secureLabelFooter(){return ze`<footer>${this.secureLabel}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,e=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||e===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-e-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){return Ne(this.card.variant)}};re=new WeakMap,d(xe,"styleMap",{});var u=xe;import{html as Qe,css as Er}from"../lit-all.min.js";var Nt=`
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
}`;var Ot={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},ae=class extends u{constructor(e){super(e);d(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Tt,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});d(this,"toggleActionMenu",e=>{if(!this.actionMenuContentSlot||!e||e.type!=="click"&&e.code!=="Space"&&e.code!=="Enter")return;e.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let a=this.actionMenuContentSlot.classList.contains("hidden");a||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!a).toString())});d(this,"toggleActionMenuFromCard",e=>{let a=e?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(a||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",a),this.setAriaExpanded(this.actionMenu,"false"))});d(this,"hideActionMenu",e=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Qe` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${zt()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Qe`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Qe`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Nt}setAriaExpanded(e,a){e.setAttribute("aria-expanded",a)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};d(ae,"variantStyle",Er`
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
    `);import{html as be}from"../lit-all.min.js";var $t=`
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
`;var Oe=class extends u{constructor(t){super(t)}getGlobalCSS(){return $t}renderLayout(){return be`${this.cardImage}
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
          `}`}};import{html as Dt}from"../lit-all.min.js";var It=`
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
`;var $e=class extends u{constructor(t){super(t)}getGlobalCSS(){return It}renderLayout(){return Dt` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Dt`<hr />`} ${this.secureLabelFooter}`}};import{html as oe,css as Sr,unsafeCSS as Xe}from"../lit-all.min.js";var Ft=`
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

@media screen and ${Y} {
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
`;var Ar=32,ie=class extends u{constructor(e){super(e);d(this,"getRowMinHeightPropertyName",e=>`--consonant-merch-card-footer-row-${e}-min-height`);d(this,"getMiniCompareFooter",()=>{let e=this.card.secureLabel?oe`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:oe`<slot name="secure-transaction-label"></slot>`;return oe`<footer>${e}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ft}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let e=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content","addon"];this.card.classList.contains("bullet-list")&&e.push("footer-rows"),e.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let a=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");a&&a.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let e=this.card.querySelector('[slot="footer-rows"] ul');!e||!e.children||[...e.children].forEach((a,o)=>{let i=Math.max(Ar,parseFloat(window.getComputedStyle(a).height)||0),n=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;i>n&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(a=>{let o=a.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&a.remove()})}get mainPrice(){return this.card.querySelector(`[slot="heading-m-price"] ${v}[data-template="price"]`)}get headingMPriceSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-m-price"]')?.assignedElements()[0]}toggleAddon(e){let a=this.mainPrice,o=this.headingMPriceSlot;if(!a&&o){let i=e?.getAttribute("plan-type"),n=null;if(e&&i&&(n=e.querySelector(`p[data-plan-type="${i}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-m-price"]').forEach(c=>c.remove()),e.checked){if(n){let c=w("p",{class:"addon-heading-m-price-addon",slot:"heading-m-price"},n.innerHTML);this.card.appendChild(c)}}else{let c=w("p",{class:"card-heading",id:"free",slot:"heading-m-price"},"Free");this.card.appendChild(c)}}}async adjustAddon(){await this.card.updateComplete;let e=this.card.addon;if(!e)return;let a=this.mainPrice,o=this.card.planType;a&&(await a.onceSettled(),o=a.value?.[0]?.planType),o&&(e.planType=o)}renderLayout(){return oe` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?oe`<slot name="heading-m-price"></slot>
          <slot name="price-commitment"></slot>
          <slot name="body-m"></slot>`:oe`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        <slot name="addon"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){await Promise.all(this.card.prices.map(e=>e.onceSettled())),await this.adjustAddon(),F()?this.removeEmptyRows():(this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};d(ie,"variantStyle",Sr`
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

    @media screen and ${Xe(T)} {
      :host([variant='mini-compare-chart'].bullet-list) .mini-compare-chart-badge {
        padding: 2px 10px;
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
      }

      :host([variant='mini-compare-chart'].bullet-list) .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xs-font-size);
      }
    }

    @media screen and ${Xe(Y)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Xe(g)} {
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
  `);import{html as Ie,css as kr,nothing as Ze}from"../lit-all.min.js";var Bt=`
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
`;var De={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},addon:!0,secureLabel:!0,planType:!0,badge:{tag:"div",slot:"badge",default:"spectrum-yellow-300-plans"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-green-900-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},Ht={...function(){let{whatsIncluded:r,size:t,...e}=De;return e}(),title:{tag:"h3",slot:"heading-s"},subtitle:{tag:"p",slot:"subtitle"},secureLabel:!1},Ut={...function(){let{whatsIncluded:r,size:t,quantitySelect:e,...a}=De;return a}()},P=class extends u{constructor(t){super(t),this.adaptForMedia=this.adaptForMedia.bind(this)}priceOptionsProvider(t,e){t.dataset.template===Rt&&(e.displayPlanType=this.card?.settings?.displayPlanType??!1)}getGlobalCSS(){return Bt}adjustSlotPlacement(t,e,a){let o=this.card.shadowRoot,i=o.querySelector("footer"),n=this.card.getAttribute("size"),c=o.querySelector(`footer slot[name="${t}"]`),l=o.querySelector(`.body slot[name="${t}"]`),h=o.querySelector(".body");if((!n||!n.includes("wide"))&&(i?.classList.remove("wide-footer"),c&&c.remove()),!!e.includes(n)){if(i?.classList.toggle("wide-footer",!F()),!a&&c){l?c.remove():h.appendChild(c);return}a&&l&&(c?l.remove():i.prepend(l))}}adaptForMedia(){if(!this.card.closest("merch-card-collection,overlay-trigger,.two-merch-cards,.three-merch-cards,.four-merch-cards, .columns")){this.card.removeAttribute("size");return}this.adjustSlotPlacement("addon",["wide","super-wide"],!F()),this.adjustSlotPlacement("callout-content",["super-wide"],vt())}adjustCallout(){let t=this.card.querySelector('[slot="callout-content"] .icon-button');t&&t.title&&(t.dataset.tooltip=t.title,t.removeAttribute("title"),t.classList.add("hide-tooltip"),document.addEventListener("touchstart",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.toggle("hide-tooltip")}),document.addEventListener("mouseover",e=>{e.preventDefault(),e.target!==t?t.classList.add("hide-tooltip"):e.target.classList.remove("hide-tooltip")}))}postCardUpdateHook(){this.adaptForMedia(),this.adjustTitleWidth(),this.adjustLegal(),this.adjustAddon(),this.adjustCallout()}get headingM(){return this.card.querySelector('[slot="heading-m"]')}get mainPrice(){return this.headingM.querySelector(`${v}[data-template="price"]`)}get divider(){return this.card.variant==="plans-education"?Ie`<div class="divider"></div>`:Ze}async adjustLegal(){if(await this.card.updateComplete,this.legalAdjusted)return;this.legalAdjusted=!0;let t=[],e=this.card.querySelector(`[slot="heading-m"] ${v}[data-template="price"]`);e&&t.push(e),this.card.querySelectorAll(`[slot="body-xs"] ${v}[data-template="price"]`).forEach(i=>t.push(i));let o=t.map(async i=>{let n=i.cloneNode(!0);await i.onceSettled(),i?.options&&(i.options.displayPerUnit&&(i.dataset.displayPerUnit="false"),i.options.displayTax&&(i.dataset.displayTax="false"),i.options.displayPlanType&&(i.dataset.displayPlanType="false"),n.setAttribute("data-template","legal"),i.parentNode.insertBefore(n,i.nextSibling))});await Promise.all(o)}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;t.setAttribute("custom-checkbox","");let e=this.mainPrice;if(!e)return;await e.onceSettled();let a=e.value?.[0]?.planType;a&&(t.planType=a)}get stockCheckbox(){return this.card.checkboxLabel?Ie`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:Ze}get icons(){return!this.card.querySelector('[slot="icons"]')&&!this.card.getAttribute("id")?Ze:Ie`<slot name="icons"></slot>`}connectedCallbackHook(){let t=Ce();t?.addEventListener&&t.addEventListener("change",this.adaptForMedia);let e=Te();e?.addEventListener&&e.addEventListener("change",this.adaptForMedia)}disconnectedCallbackHook(){let t=Ce();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMedia);let e=Te();e?.removeEventListener&&e.removeEventListener("change",this.adaptForMedia)}renderLayout(){return Ie` ${this.badge}
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
            ${this.secureLabelFooter}`}};d(P,"variantStyle",kr`
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
    `);import{html as Je,css as Cr}from"../lit-all.min.js";var qt=`
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
`;var U=class extends u{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return qt}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","addon","body-lower"].forEach(e=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${e}"]`),e))}renderLayout(){return Je` ${this.badge}
            <div class="body" aria-live="polite">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":Je`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Je`<slot name="promo-text"></slot>`:""}
                <slot name="callout-content"></slot>
                <slot name="addon"></slot>
                <slot name="body-lower"></slot>
            </div>
            ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(this.adjustAddon(),F()||this.adjustProductBodySlots(),this.adjustTitleWidth())}get headingXSSlot(){return this.card.shadowRoot.querySelector('slot[name="heading-xs"]').assignedElements()[0]}get mainPrice(){return this.card.querySelector(`[slot="heading-xs"] ${v}[data-template="price"]`)}toggleAddon(t){let e=this.mainPrice,a=this.headingXSSlot;if(!e&&a){let o=t?.getAttribute("plan-type"),i=null;if(t&&o&&(i=t.querySelector(`p[data-plan-type="${o}"]`)?.querySelector('span[is="inline-price"]')),this.card.querySelectorAll('p[slot="heading-xs"]').forEach(n=>n.remove()),t.checked){if(i){let n=w("p",{class:"addon-heading-xs-price-addon",slot:"heading-xs"},i.innerHTML);this.card.appendChild(n)}}else{let n=w("p",{class:"card-heading",id:"free",slot:"heading-xs"},"Free");this.card.appendChild(n)}}}async adjustAddon(){await this.card.updateComplete;let t=this.card.addon;if(!t)return;let e=this.mainPrice,a=this.card.planType;e&&(await e.onceSettled(),a=e.value?.[0]?.planType),a&&(t.planType=a)}};d(U,"variantStyle",Cr`
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
    `);import{html as et,css as Tr}from"../lit-all.min.js";var jt=`
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
`;var ne=class extends u{constructor(t){super(t)}getGlobalCSS(){return jt}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return et` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":et`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?et`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};d(ne,"variantStyle",Tr`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as tt,css as Lr}from"../lit-all.min.js";var Gt=`
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
`;var Vt={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},se=class extends u{constructor(t){super(t)}getGlobalCSS(){return Gt}get headingSelector(){return'[slot="detail-m"]'}renderLayout(){return tt`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?tt`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:tt`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};d(se,"variantStyle",Lr`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as _r,css as Mr}from"../lit-all.min.js";var Yt=`
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
@media screen and ${Y} {
    merch-card-collection.simplified-pricing-express:has(merch-card[variant="simplified-pricing-express"]) {
        grid-template-columns: 1fr;
    }
    
    merch-card[variant="simplified-pricing-express"] {
        width: 100%;
        max-width: var(--consonant-merch-card-simplified-pricing-express-width);
    }
}

/* Desktop - 4 columns */
@media screen and ${g} {
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
`;var rt={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-l",maxCount:250,withSuffix:!0},badge:{tag:"div",slot:"badge"},trialBadge:{tag:"div",slot:"trial-badge"},description:{tag:"div",slot:"body-xs",maxCount:2e3,withSuffix:!1},prices:{tag:"div",slot:"price"},ctas:{slot:"cta",size:"L"},borderColor:{attribute:"border-color",specialValues:{gray:"var(--spectrum-gray-300)",blue:"var(--spectrum-blue-400)",gradient:"linear-gradient(98deg, #FF477B 3.22%, #5C5CE0 52.98%, #318FFF 101.72%)"}},disabledAttributes:["badgeColor","trialBadgeColor","trialBadgeBorderColor"],supportsDefaultChild:!0},ce=class extends u{getGlobalCSS(){return Yt}get aemFragmentMapping(){return rt}get headingSelector(){return'[slot="heading-l"]'}postCardUpdateHook(t){t.has("borderColor")&&this.card.borderColor&&this.card.style.setProperty("--merch-card-custom-border-color",this.card.borderColor)}connectedCallbackHook(){!this.card||this.card.failed||(this.setupMobileAccordion(),this.watchForDefaultCardAttribute(),setTimeout(()=>{this.card?.hasAttribute("data-default-card")&&window.matchMedia("(max-width: 1199px)").matches&&this.card.setAttribute("data-expanded","true")},100))}watchForDefaultCardAttribute(){this.card&&(this.attributeObserver=new MutationObserver(t=>{t.forEach(e=>{e.type==="attributes"&&e.attributeName==="data-default-card"&&this.card.hasAttribute("data-default-card")&&window.matchMedia("(max-width: 1199px)").matches&&this.card.setAttribute("data-expanded","true")})}),this.attributeObserver.observe(this.card,{attributes:!0,attributeOldValue:!0}))}setupMobileAccordion(){let t=this.card;if(!t)return;let e=()=>{if(window.matchMedia("(max-width: 1199px)").matches){let o=t.hasAttribute("data-default-card");t.setAttribute("data-expanded",o?"true":"false")}else t.removeAttribute("data-expanded")};e();let a=window.matchMedia("(max-width: 1199px)");this.mediaQueryListener=o=>{e()},a.addEventListener("change",this.mediaQueryListener)}disconnectedCallbackHook(){this.mediaQueryListener&&window.matchMedia("(max-width: 1199px)").removeEventListener("change",this.mediaQueryListener),this.attributeObserver&&this.attributeObserver.disconnect()}handleChevronClick(t){t.preventDefault(),t.stopPropagation();let e=this.card;if(!e||!window.matchMedia("(max-width: 1199px)").matches)return;let i=e.getAttribute("data-expanded")==="true"?"false":"true";e.setAttribute("data-expanded",i)}renderLayout(){return _r`
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
        `}};d(ce,"variantStyle",Mr`
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
    `);var at=new Map,S=(r,t,e=null,a=null)=>{at.set(r,{class:t,fragmentMapping:e,style:a})};S("catalog",ae,Ot,ae.variantStyle);S("image",Oe);S("inline-heading",$e);S("mini-compare-chart",ie,null,ie.variantStyle);S("plans",P,De,P.variantStyle);S("plans-students",P,Ut,P.variantStyle);S("plans-education",P,Ht,P.variantStyle);S("product",U,null,U.variantStyle);S("segment",ne,null,ne.variantStyle);S("special-offers",se,Vt,se.variantStyle);S("simplified-pricing-express",ce,rt,ce.variantStyle);var ot=(r,t=!1)=>{let e=at.get(r.variant);if(!e)return t?void 0:new U(r);let{class:a,style:o}=e;if(o)try{let i=new CSSStyleSheet;i.replaceSync(o.cssText),r.shadowRoot.adoptedStyleSheets.push(i)}catch{let n=document.createElement("style");n.textContent=o.cssText,r.shadowRoot.appendChild(n)}return new a(r)};function Ne(r){return at.get(r)?.fragmentMapping}var Kt=document.createElement("style");Kt.innerHTML=`
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
    --consonant-merch-card-body-xs-color: var(--spectrum-gray-800, var(--merch-color-grey-80));
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
`;document.head.appendChild(Kt);function Wt(r,t={},{metadata:e=!0,search:a=!0,storage:o=!0}={}){let i;if(a&&i==null){let n=new URLSearchParams(window.location.search),c=it(a)?a:r;i=n.get(c)}if(o&&i==null){let n=it(o)?o:r;i=window.sessionStorage.getItem(n)??window.localStorage.getItem(n)}if(e&&i==null){let n=Rr(it(e)?e:r);i=document.documentElement.querySelector(`meta[name="${n}"]`)?.content}return i??t[r]}var it=r=>typeof r=="string";function Rr(r=""){return String(r).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,e,a)=>`${e}-${a}`).replace(/\W+/gu,"-").toLowerCase()}var ve=class r extends Error{constructor(t,e,a){if(super(t,{cause:a}),this.name="MasError",e.response){let o=e.response.headers?.get(_e);o&&(e.requestId=o),e.response.status&&(e.status=e.response.status,e.statusText=e.response.statusText),e.response.url&&(e.url=e.response.url)}delete e.response,this.context=e,Error.captureStackTrace&&Error.captureStackTrace(this,r)}toString(){let t=Object.entries(this.context||{}).map(([a,o])=>`${a}: ${JSON.stringify(o)}`).join(", "),e=`${this.name}: ${this.message}`;return t&&(e+=` (${t})`),this.cause&&(e+=`
Caused by: ${this.cause}`),e}};var Pr={requestId:_e,etag:"Etag",lastModified:"Last-Modified",serverTiming:"server-timing"};function Qt(r){let t={};if(!r?.headers)return t;let e=r.headers;for(let[a,o]of Object.entries(Pr)){let i=e.get(o);i&&(i=i.replace(/[,;]/g,"|"),i=i.replace(/[| ]+/g,"|"),t[a]=i)}return t}async function Xt(r,t={},e=2,a=100){let o;for(let i=0;i<=e;i++)try{let n=await fetch(r,t);return n.retryCount=i,n}catch(n){if(o=n,o.retryCount=i,i>e)break;await new Promise(c=>setTimeout(c,a*(i+1)))}throw o}var Zt="fragment",Jt="author",er="preview",nt="aem-fragment",z,st=class{constructor(){m(this,z,new Map)}clear(){s(this,z).clear()}addByRequestedId(t,e){s(this,z).set(t,e)}put(t,e){s(this,z).set(t,e)}add(...t){t.forEach(e=>{let{id:a}=e;a&&s(this,z).set(a,e)})}has(t){return s(this,z).has(t)}get(t){return s(this,z).get(t)}remove(t){s(this,z).delete(t)}};z=new WeakMap;var Fe=new st,de,N,O,x,k,A,L,ye,we,le,_,tr,rr,dt,ar,ct=class extends HTMLElement{constructor(){super(...arguments);m(this,_);d(this,"cache",Fe);m(this,de);m(this,N,null);m(this,O,null);m(this,x,{url:null,retryCount:0,stale:!1,measure:null,status:null});m(this,k,null);m(this,A);m(this,L);m(this,ye,!1);m(this,we,0);m(this,le)}static get observedAttributes(){return[Zt,Jt,er]}attributeChangedCallback(e,a,o){e===Zt&&p(this,A,o),e===Jt&&p(this,ye,["","true"].includes(o)),e===er&&p(this,le,o)}connectedCallback(){if(!s(this,L)){if(s(this,k)??p(this,k,J(this)),p(this,le,s(this,k).settings?.preview),s(this,de)??p(this,de,s(this,k).log.module(`${nt}[${s(this,A)}]`)),!s(this,A)||s(this,A)==="#"){E(this,_,dt).call(this,"Missing fragment id");return}this.refresh(!1)}}get fetchInfo(){return Object.fromEntries(Object.entries(s(this,x)).filter(([e,a])=>a!=null).map(([e,a])=>[`aem-fragment:${e}`,a]))}async refresh(e=!0){if(s(this,L)&&!await Promise.race([s(this,L),Promise.resolve(!1)]))return;e&&Fe.remove(s(this,A));try{p(this,L,E(this,_,ar).call(this)),await s(this,L)}catch(c){return E(this,_,dt).call(this,c.message),!1}let{references:a,referencesTree:o,placeholders:i,wcs:n}=s(this,N)||{};return n&&!Wt("mas.disableWcsCache")&&s(this,k).prefillWcsCache(n),this.dispatchEvent(new CustomEvent(Q,{detail:{...this.data,references:a,referencesTree:o,placeholders:i,...s(this,x)},bubbles:!0,composed:!0})),s(this,L)}get updateComplete(){return s(this,L)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return s(this,O)?s(this,O):(s(this,ye)?this.transformAuthorData():this.transformPublishData(),s(this,O))}transformAuthorData(){let{fields:e,id:a,tags:o,settings:i={}}=s(this,N);p(this,O,e.reduce((n,{name:c,multiple:l,values:h})=>(n.fields[c]=l?h:h[0],n),{fields:{},id:a,tags:o,settings:i}))}transformPublishData(){let{fields:e,id:a,tags:o,settings:i={}}=s(this,N);p(this,O,Object.entries(e).reduce((n,[c,l])=>(n.fields[c]=l?.mimeType?l.value:l??"",n),{fields:{},id:a,tags:o,settings:i}))}getFragmentClientUrl(){let a=new URLSearchParams(window.location.search).get("maslibs");if(!a||a.trim()==="")return"https://mas.adobe.com/studio/libs/fragment-client.js";let o=a.trim().toLowerCase();if(o==="local")return"http://localhost:3030/studio/libs/fragment-client.js";if(o==="main")return"https://mas.adobe.com/studio/libs/fragment-client.js";let{hostname:i}=window.location,n=i.endsWith(".page")?"page":"live";return o.includes("--mas--")?`https://${o}.aem.${n}/studio/libs/fragment-client.js`:o.includes("--")?`https://${o}.aem.${n}/studio/libs/fragment-client.js`:`https://${o}--mas--adobecom.aem.${n}/studio/libs/fragment-client.js`}async generatePreview(){let e=this.getFragmentClientUrl(),{previewFragment:a}=await import(e);return await a(s(this,A),{locale:s(this,k).settings.locale,apiKey:s(this,k).settings.wcsApiKey})}};de=new WeakMap,N=new WeakMap,O=new WeakMap,x=new WeakMap,k=new WeakMap,A=new WeakMap,L=new WeakMap,ye=new WeakMap,we=new WeakMap,le=new WeakMap,_=new WeakSet,tr=async function(e){bt(this,we)._++;let a=`${nt}:${s(this,A)}:${s(this,we)}`,o=`${a}${Me}`,i=`${a}${Re}`;if(s(this,le))return await this.generatePreview();performance.mark(o);let n;try{if(s(this,x).stale=!1,s(this,x).url=e,n=await Xt(e,{cache:"default",credentials:"omit"}),E(this,_,rr).call(this,n),s(this,x).status=n?.status,s(this,x).measure=Z(performance.measure(i,o)),s(this,x).retryCount=n.retryCount,!n?.ok)throw new ve("Unexpected fragment response",{response:n,...s(this,k).duration});return await n.json()}catch(c){if(s(this,x).measure=Z(performance.measure(i,o)),s(this,x).retryCount=c.retryCount,s(this,N))return s(this,x).stale=!0,s(this,de).error("Serving stale data",s(this,x)),s(this,N);let l=c.message??"unknown";throw new ve(`Failed to fetch fragment: ${l}`,{})}},rr=function(e){Object.assign(s(this,x),Qt(e))},dt=function(e){p(this,L,null),s(this,x).message=e,this.classList.add("error");let a={...s(this,x),...s(this,k).duration};s(this,de).error(e,a),this.dispatchEvent(new CustomEvent(X,{detail:a,bubbles:!0,composed:!0}))},ar=async function(){this.classList.remove("error"),p(this,O,null);let e=Fe.get(s(this,A));if(e)return p(this,N,e),!0;let{masIOUrl:a,wcsApiKey:o,locale:i}=s(this,k).settings,n=`${a}/fragment?id=${s(this,A)}&api_key=${o}&locale=${i}`;return e=await E(this,_,tr).call(this,n),Fe.addByRequestedId(s(this,A),e),p(this,N,e),!0};customElements.define(nt,ct);import{LitElement as zr,html as Nr,css as Or}from"../lit-all.min.js";var he=class extends zr{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor="",this.text=this.textContent}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.textContent="",super.connectedCallback()}render(){return Nr`<div class="badge">
            ${this.text}
        </div>`}};d(he,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),d(he,"styles",Or`
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
    `);customElements.define("merch-badge",he);import{html as $r,css as Ir,LitElement as Dr}from"../lit-all.min.js";var Ee=class extends Dr{constructor(){super()}render(){return $r`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};d(Ee,"styles",Ir`
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
    `),d(Ee,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",Ee);import{html as lt,css as Fr,LitElement as Br}from"../lit-all.min.js";var Se=class extends Br{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,e)=>{e>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return lt`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?lt`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:lt``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};d(Se,"styles",Fr`
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
    `),d(Se,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",Se);function Hr(r){return`https://${r==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Ae,q=class q extends HTMLAnchorElement{constructor(){super();m(this,Ae,!1);this.setAttribute("is",q.is)}get isUptLink(){return!0}initializeWcsData(e,a){this.setAttribute("data-wcs-osi",e),a&&this.setAttribute("data-promotion-code",a),p(this,Ae,!0),this.composePromoTermsUrl()}attributeChangedCallback(e,a,o){s(this,Ae)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let e=this.getAttribute("data-wcs-osi");if(!e){let b=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${b}`);return}let a=J(),o=[e],i=this.getAttribute("data-promotion-code"),{country:n,language:c,env:l}=a.settings,h={country:n,language:c,wcsOsi:o,promotionCode:i},y=a.resolveOfferSelectors(h);Promise.all(y).then(([[b]])=>{let C=`locale=${c}_${n}&country=${n}&offer_id=${b.offerId}`;i&&(C+=`&promotion_code=${encodeURIComponent(i)}`),this.href=`${Hr(l)}?${C}`}).catch(b=>{console.error(`Could not resolve offer selectors for id: ${e}.`,b.message)})}static createFrom(e){let a=new q;for(let o of e.attributes)o.name!=="is"&&(o.name==="class"&&o.value.includes("upt-link")?a.setAttribute("class",o.value.replace("upt-link","").trim()):a.setAttribute(o.name,o.value));return a.innerHTML=e.innerHTML,a.setAttribute("tabindex",0),a}};Ae=new WeakMap,d(q,"is","upt-link"),d(q,"tag","a"),d(q,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var D=q;window.customElements.get(D.is)||window.customElements.define(D.is,D,{extends:D.tag});var Ur="#000000",ht="#F8D904",qr="#EAEAEA",jr="#31A547",Gr=/(accent|primary|secondary)(-(outline|link))?/,Vr="mas:product_code/",Yr="daa-ll",He="daa-lh",Kr=["XL","L","M","S"],pt="...";function M(r,t,e,a){let o=a[r];if(t[r]&&o){let i={slot:o?.slot},n=t[r];if(o.maxCount&&typeof n=="string"){let[l,h]=la(n,o.maxCount,o.withSuffix);l!==n&&(i.title=h,n=l)}let c=w(o.tag,i,n);e.append(c)}}function Wr(r,t,e){let a=r.mnemonicIcon?.map((i,n)=>({icon:i,alt:r.mnemonicAlt[n]??"",link:r.mnemonicLink[n]??""}));a?.forEach(({icon:i,alt:n,link:c})=>{if(c&&!/^https?:/.test(c))try{c=new URL(`https://${c}`).href.toString()}catch{c="#"}let l={slot:"icons",src:i,loading:t.loading,size:e?.size??"l"};n&&(l.alt=n),c&&(l.href=c);let h=w("merch-icon",l);t.append(h)});let o=t.shadowRoot.querySelector('slot[name="icons"]');!a?.length&&o&&o.remove()}function Qr(r,t,e){if(e.badge?.slot){if(r.badge?.length&&!r.badge?.startsWith("<merch-badge")){let a=ht,o=!1;e.allowedBadgeColors?.includes(e.badge?.default)&&(a=e.badge?.default,r.borderColor||(o=!0));let i=r.badgeBackgroundColor||a,n=r.borderColor||"";o&&(n=e.badge?.default,r.borderColor=e.badge?.default),r.badge=`<merch-badge variant="${r.variant}" background-color="${i}" border-color="${n}">${r.badge}</merch-badge>`}M("badge",r,t,e)}else r.badge?(t.setAttribute("badge-text",r.badge),e.disabledAttributes?.includes("badgeColor")||t.setAttribute("badge-color",r.badgeColor||Ur),e.disabledAttributes?.includes("badgeBackgroundColor")||t.setAttribute("badge-background-color",r.badgeBackgroundColor||ht),t.setAttribute("border-color",r.badgeBackgroundColor||ht)):t.setAttribute("border-color",r.borderColor||qr)}function Xr(r,t,e){if(e.trialBadge&&r.trialBadge){if(!r.trialBadge.startsWith("<merch-badge")){let a=!e.disabledAttributes?.includes("trialBadgeBorderColor")&&r.trialBadgeBorderColor||jr;r.trialBadge=`<merch-badge variant="${r.variant}" border-color="${a}">${r.trialBadge}</merch-badge>`}M("trialBadge",r,t,e)}}function Zr(r,t,e){e?.includes(r.size)&&t.setAttribute("size",r.size)}function Jr(r,t,e){M("cardTitle",r,t,{cardTitle:e})}function ea(r,t,e){M("subtitle",r,t,e)}function ta(r,t,e,a){if(!r.backgroundColor||r.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}e?.[r.backgroundColor]?(t.style.setProperty("--merch-card-custom-background-color",`var(${e[r.backgroundColor]})`),t.setAttribute("background-color",r.backgroundColor)):a?.attribute&&r.backgroundColor&&(t.setAttribute(a.attribute,r.backgroundColor),t.style.removeProperty("--merch-card-custom-background-color"))}function ra(r,t,e){let a=e?.borderColor,o="--merch-card-custom-border-color";r.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(o),e?.allowedBorderColors?.includes(e?.badge?.default)&&t.style.setProperty(o,"transparent")):r.borderColor&&a&&(/-gradient/.test(r.borderColor)?(t.setAttribute("gradient-border","true"),t.style.removeProperty(o)):t.style.setProperty(o,`var(--${r.borderColor})`))}function aa(r,t,e){if(r.backgroundImage){let a={loading:t.loading??"lazy",src:r.backgroundImage};if(r.backgroundImageAltText?a.alt=r.backgroundImageAltText:a.role="none",!e)return;if(e?.attribute){t.setAttribute(e.attribute,r.backgroundImage);return}t.append(w(e.tag,{slot:e.slot},w("img",a)))}}function Be(r,t){return!r||typeof r!="string"||r.includes("<mas-tooltip")&&(Promise.resolve().then(()=>(Ge(),je)).catch(console.error),t==="simplified-pricing-express"&&(r=r.replace(/<mas-tooltip([^>]*)\ssize="[^"]*"/g,'<mas-tooltip$1 size="xxs"'),r=r.replace(/<mas-tooltip(?![^>]*\ssize=)([^>]*)/g,'<mas-tooltip size="xxs"$1'))),r}function oa(r,t,e){r.prices&&(r.prices=Be(r.prices,r.variant)),M("prices",r,t,e)}function ir(r,t,e){let a=r.hasAttribute("data-wcs-osi")&&!!r.getAttribute("data-wcs-osi"),o=r.className||"",i=Gr.exec(o)?.[0]??"accent",n=i.includes("accent"),c=i.includes("primary"),l=i.includes("secondary"),h=i.includes("-outline"),y=i.includes("-link");r.classList.remove("accent","primary","secondary");let b;if(t.consonant)b=ga(r,n,a,y,c);else if(y)b=r;else{let C;n?C="accent":c?C="primary":l&&(C="secondary"),b=t.spectrum==="swc"?ma(r,e,h,C,a):pa(r,e,h,C,a)}return b}function ia(r,t){let{slot:e}=t?.description,a=r.querySelectorAll(`[slot="${e}"] a[data-wcs-osi]`);a.length&&a.forEach(o=>{let i=ir(o,r,t);o.replaceWith(i)})}function na(r,t,e){r.description&&(r.description=Be(r.description,r.variant)),r.promoText&&(r.promoText=Be(r.promoText,r.variant)),M("promoText",r,t,e),M("description",r,t,e),ia(t,e),M("callout",r,t,e),M("quantitySelect",r,t,e),M("whatsIncluded",r,t,e)}function sa(r,t,e){if(!e.addon)return;let a=r.addon?.replace(/[{}]/g,"");if(!a||/disabled/.test(a))return;let o=w("merch-addon",{slot:"addon"},a);[...o.querySelectorAll(v)].forEach(i=>{let n=i.parentElement;n?.nodeName==="P"&&n.setAttribute("data-plan-type","")}),t.append(o)}function ca(r,t,e){r.addonConfirmation&&M("addonConfirmation",r,t,e)}function da(r,t,e,a){a?.secureLabel&&e?.secureLabel&&t.setAttribute("secure-label",a.secureLabel)}function la(r,t,e=!0){try{let a=typeof r!="string"?"":r,o=or(a);if(o.length<=t)return[a,o];let i=0,n=!1,c=e?t-pt.length<1?1:t-pt.length:t,l=[];for(let b of a){if(i++,b==="<")if(n=!0,a[i]==="/")l.pop();else{let C="";for(let Ue of a.substring(i)){if(Ue===" "||Ue===">")break;C+=Ue}l.push(C)}if(b==="/"&&a[i]===">"&&l.pop(),b===">"){n=!1;continue}if(!n&&(c--,c===0))break}let h=a.substring(0,i).trim();if(l.length>0){l[0]==="p"&&l.shift();for(let b of l.reverse())h+=`</${b}>`}return[`${h}${e?pt:""}`,o]}catch{let o=typeof r=="string"?r:"",i=or(o);return[o,i]}}function or(r){if(!r)return"";let t="",e=!1;for(let a of r){if(a==="<"&&(e=!0),a===">"){e=!1;continue}e||(t+=a)}return t}function ha(r,t){t.querySelectorAll("a.upt-link").forEach(a=>{let o=D.createFrom(a);a.replaceWith(o),o.initializeWcsData(r.osi,r.promoCode)})}function pa(r,t,e,a,o){let i=r;o?i=customElements.get("checkout-button").createCheckoutButton({},r.innerHTML):i.innerHTML=`<span>${i.textContent}</span>`,i.setAttribute("tabindex",0);for(let y of r.attributes)["class","is"].includes(y.name)||i.setAttribute(y.name,y.value);i.firstElementChild?.classList.add("spectrum-Button-label");let n=t?.ctas?.size??"M",c=`spectrum-Button--${a}`,l=Kr.includes(n)?`spectrum-Button--size${n}`:"spectrum-Button--sizeM",h=["spectrum-Button",c,l];return e&&h.push("spectrum-Button--outline"),i.classList.add(...h),i}function ma(r,t,e,a,o){let i=r;o&&(i=customElements.get("checkout-button").createCheckoutButton(r.dataset),i.connectedCallback(),i.render());let n="fill";e&&(n="outline");let c=w("sp-button",{treatment:n,variant:a,tabIndex:0,size:t?.ctas?.size??"m",...r.dataset.analyticsId&&{"data-analytics-id":r.dataset.analyticsId}},r.innerHTML);return c.source=i,(o?i.onceSettled():Promise.resolve(i)).then(l=>{c.setAttribute("data-navigation-url",l.href)}),c.addEventListener("click",l=>{l.defaultPrevented||i.click()}),c}function ga(r,t,e,a,o){let i=r;return e&&(i=customElements.get("checkout-link").createCheckoutLink(r.dataset,r.innerHTML)),a||(i.classList.add("button","con-button"),t&&i.classList.add("blue"),o&&i.classList.add("primary")),i}function ua(r,t,e,a){if(r.ctas){r.ctas=Be(r.ctas,a);let{slot:o}=e.ctas,i=w("div",{slot:o},r.ctas),n=[...i.querySelectorAll("a")].map(c=>ir(c,t,e));i.innerHTML="",i.append(...n),t.append(i)}}function fa(r,t){let{tags:e}=r,a=e?.find(i=>i.startsWith(Vr))?.split("/").pop();if(!a)return;t.setAttribute(He,a),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((i,n)=>{i.setAttribute(Yr,`${i.dataset.analyticsId}-${n+1}`)})}function xa(r){r.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,e])=>{r.querySelectorAll(`a.${t}`).forEach(a=>{a.classList.remove(t),a.classList.add("spectrum-Link",`spectrum-Link--${e}`)})})}function ba(r){r.querySelectorAll("[slot]").forEach(a=>{a.remove()}),r.variant=void 0,["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","gradient-border","size",He].forEach(a=>r.removeAttribute(a));let e=["wide-strip","thin-strip"];r.classList.remove(...e)}async function nr(r,t){if(!r){let c=t?.id||"unknown";throw console.error(`hydrate: Fragment is undefined. Cannot hydrate card (merchCard id: ${c}).`),new Error(`hydrate: Fragment is undefined for card (merchCard id: ${c}).`)}if(!r.fields){let c=r.id||"unknown",l=t?.id||"unknown";throw console.error(`hydrate: Fragment for card ID '${c}' (merchCard id: ${l}) is missing 'fields'. Cannot hydrate.`),new Error(`hydrate: Fragment for card ID '${c}' (merchCard id: ${l}) is missing 'fields'.`)}let{id:e,fields:a,settings:o={}}=r,{variant:i}=a;if(!i)throw new Error(`hydrate: no variant found in payload ${e}`);ba(t),t.settings=o,t.id??(t.id=r.id),t.variant=i,await t.updateComplete;let{aemFragmentMapping:n}=t.variantLayout;if(!n)throw new Error(`hydrate: variant mapping not found for ${e}`);n.style==="consonant"&&t.setAttribute("consonant",!0),Wr(a,t,n.mnemonics),Qr(a,t,n),Xr(a,t,n),Zr(a,t,n.size),Jr(a,t,n.title),ea(a,t,n),oa(a,t,n),aa(a,t,n.backgroundImage),ta(a,t,n.allowedColors,n.backgroundColor),ra(a,t,n),na(a,t,n),sa(a,t,n),ca(a,t,n),da(a,t,n,o),ha(a,t),ua(a,t,n,i),fa(a,t),xa(t)}var gt="merch-card",mt=2e4,sr="merch-card:";function cr(r,t){let e=r.closest(gt);if(!e)return t;e.variantLayout?.priceOptionsProvider?.(r,t)}function ya(r){r.providers.has(cr)||r.providers.price(cr)}var wa=0,pe,me,ke,$,V,I,G,j=class extends va{constructor(){super();m(this,I);m(this,pe);m(this,me);m(this,ke);m(this,$);m(this,V);d(this,"customerSegment");d(this,"marketSegment");d(this,"variantLayout");this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.handleMerchOfferSelectReady=this.handleMerchOfferSelectReady.bind(this)}firstUpdated(){this.variantLayout=ot(this,!1),this.variantLayout?.connectedCallbackHook()}willUpdate(e){(e.has("variant")||!this.variantLayout)&&(this.variantLayout=ot(this),this.variantLayout.connectedCallbackHook())}updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),e.has("backgroundColor")&&this.style.setProperty("--merch-card-custom-background-color",this.backgroundColor?`var(--${this.backgroundColor})`:"");try{this.variantLayout?.postCardUpdateHook(e)}catch(a){E(this,I,G).call(this,`Error in postCardUpdateHook: ${a.message}`,{},!1)}}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get descriptionSlot(){return this.shadowRoot.querySelector('slot[name="body-xs"')?.assignedElements()[0]}get descriptionSlotCompare(){return this.shadowRoot.querySelector('slot[name="body-m"')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(v)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(W)??[]]}get checkoutLinksDescription(){return[...this.descriptionSlot?.querySelectorAll(W)??[]]}get checkoutLinkDescriptionCompare(){return[...this.descriptionSlotCompare?.querySelectorAll(W)??[]]}get activeDescriptionLinks(){return this.variant==="mini-compare-chart"?this.checkoutLinkDescriptionCompare:this.checkoutLinksDescription}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let a=this.checkoutLinks;if(a.length!==0)for(let o of a){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let n=this.stockOfferOsis[i];if(!n)return;let c=o.dataset.wcsOsi.split(",").filter(l=>l!==n);e.checked&&c.push(n),o.dataset.wcsOsi=c.join(",")}}changeHandler(e){e.target.tagName==="MERCH-ADDON"&&this.toggleAddon(e.target)}toggleAddon(e){this.variantLayout?.toggleAddon?.(e);let a=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(a.length===0)return;let o=i=>{let{offerType:n,planType:c}=i.value?.[0]??{};if(!n||!c)return;let l=e.getOsi(c,n),h=(i.dataset.wcsOsi||"").split(",").filter(y=>y&&y!==l);e.checked&&h.push(l),i.dataset.wcsOsi=h.join(",")};a.forEach(o)}handleQuantitySelection(e){let a=[...this.checkoutLinks,...this.activeDescriptionLinks??[]];if(a.length!==0)for(let o of a)o.dataset.quantity=e.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let a={...this.filters};Object.keys(a).forEach(o=>{if(e){a[o].order=Math.min(a[o].order||2,2);return}let i=a[o].order;i===1||isNaN(i)||(a[o].order=Number(i)+1)}),this.filters=a}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}connectedCallback(){super.connectedCallback(),s(this,me)||p(this,me,wa++),this.id??(this.id=this.getAttribute("id")??this.aemFragment?.getAttribute("fragment"));let e=this.id??s(this,me);p(this,V,`${sr}${e}${Me}`),p(this,pe,`${sr}${e}${Re}`),performance.mark(s(this,V)),p(this,$,J()),ya(s(this,$)),p(this,ke,s(this,$).Log.module(gt)),this.addEventListener(Ye,this.handleQuantitySelection),this.addEventListener(Ke,this.handleAddonAndQuantityUpdate),this.addEventListener(Ct,this.handleMerchOfferSelectReady),this.addEventListener(X,this.handleAemFragmentEvents),this.addEventListener(Q,this.handleAemFragmentEvents),this.addEventListener("change",this.changeHandler),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Ye,this.handleQuantitySelection),this.removeEventListener(X,this.handleAemFragmentEvents),this.removeEventListener(Q,this.handleAemFragmentEvents),this.removeEventListener("change",this.changeHandler),this.removeEventListener(Ke,this.handleAddonAndQuantityUpdate)}async handleAemFragmentEvents(e){if(this.isConnected&&(e.type===X&&E(this,I,G).call(this,"AEM fragment cannot be loaded"),e.type===Q&&(this.failed=!1,e.target.nodeName==="AEM-FRAGMENT"))){let a=e.detail;try{await nr(a,this)}catch(o){E(this,I,G).call(this,`hydration has failed: ${o.message}`)}this.checkReady()}}async checkReady(){if(!this.isConnected)return;let e=new Promise(n=>setTimeout(()=>n("timeout"),mt));if(this.aemFragment){let n=await Promise.race([this.aemFragment.updateComplete,e]);if(n===!1||n==="timeout"){let c=n==="timeout"?`AEM fragment was not resolved within ${mt} timeout`:"AEM fragment cannot be loaded";E(this,I,G).call(this,c,{},!1);return}}let a=[...this.querySelectorAll(kt)],o=Promise.all(a.map(n=>n.onceSettled().catch(()=>n))).then(n=>n.every(c=>c.classList.contains("placeholder-resolved"))),i=await Promise.race([o,e]);if(i===!0){this.measure=performance.measure(s(this,pe),s(this,V));let n={...this.aemFragment?.fetchInfo,...s(this,$).duration,measure:Z(this.measure)};return this.dispatchEvent(new CustomEvent(_t,{bubbles:!0,composed:!0,detail:n})),this}else{this.measure=performance.measure(s(this,pe),s(this,V));let n={measure:Z(this.measure),...s(this,$).duration};i==="timeout"?E(this,I,G).call(this,`Contains offers that were not resolved within ${mt} timeout`,n):E(this,I,G).call(this,"Contains unresolved offers",n)}}get aemFragment(){return this.querySelector("aem-fragment")}get addon(){return this.querySelector("merch-addon")}get quantitySelect(){return this.querySelector("merch-quantity-select")}get addonCheckbox(){return this.querySelector("merch-addon")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let e=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(W)).length===2&&e&&e.parentElement.classList.add("footer-column")}handleMerchOfferSelectReady(){this.offerSelect&&!this.offerSelect.planType||this.displayFooterElementsInColumn()}get dynamicPrice(){return this.querySelector('[slot="price"]')}handleAddonAndQuantityUpdate({detail:{id:e,items:a}}){if(!e||!a?.length)return;let o=this.checkoutLinks.find(h=>h.getAttribute("data-modal-id")===e);if(!o)return;let n=new URL(o.getAttribute("href")).searchParams.get("pa"),c=a.find(h=>h.productArrangementCode===n)?.quantity,l=!!a.find(h=>h.productArrangementCode!==n);if(c&&this.quantitySelect?.dispatchEvent(new CustomEvent(Lt,{detail:{quantity:c},bubbles:!0,composed:!0})),this.addonCheckbox&&this.addonCheckbox.checked!==l){this.toggleStockOffer({target:this.addonCheckbox});let h=new Event("change",{bubbles:!0,cancelable:!0});Object.defineProperty(h,"target",{writable:!1,value:{checked:l}}),this.addonCheckbox.handleChange(h)}}};pe=new WeakMap,me=new WeakMap,ke=new WeakMap,$=new WeakMap,V=new WeakMap,I=new WeakSet,G=function(e,a={},o=!0){if(!this.isConnected)return;let n=this.aemFragment?.getAttribute("fragment");n=`[${n}]`;let c={...this.aemFragment.fetchInfo,...s(this,$).duration,...a,message:e};s(this,ke).error(`merch-card${n}: ${e}`,c),this.failed=!0,o&&this.dispatchEvent(new CustomEvent(Mt,{bubbles:!0,composed:!0,detail:c}))},d(j,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},backgroundColor:{type:String,attribute:"background-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},addonTitle:{type:String,attribute:"addon-title"},addonOffers:{type:Object,attribute:"addon-offers"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},planType:{type:String,attribute:"plan-type",reflect:!0},settings:{type:Object,attribute:!1},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{if(!e)return;let[a,o,i]=e.split(",");return{PUF:a,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(a=>{let[o,i,n]=a.split(":"),c=Number(i);return[o,{order:isNaN(c)?void 0:c,size:n}]})),toAttribute:e=>Object.entries(e).map(([a,{order:o,size:i}])=>[a,o,i].filter(n=>n!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:He,reflect:!0},loading:{type:String}}),d(j,"styles",[Et,...St()]),d(j,"registerVariant",S),d(j,"getFragmentMapping",Ne);customElements.define(gt,j);export{j as MerchCard};

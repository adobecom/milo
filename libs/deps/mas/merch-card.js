var Kn=Object.defineProperty;var Ur=e=>{throw TypeError(e)};var Zn=(e,t,r)=>t in e?Kn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>Zn(e,typeof t!="symbol"?t+"":t,r),Nt=(e,t,r)=>t.has(e)||Ur("Cannot "+r);var f=(e,t,r)=>(Nt(e,t,"read from private field"),r?r.call(e):t.get(e)),P=(e,t,r)=>t.has(e)?Ur("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),L=(e,t,r,o)=>(Nt(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r),V=(e,t,r)=>(Nt(e,t,"access private method"),r);import{LitElement as _s}from"../lit-all.min.js";import{LitElement as Qn,html as zr,css as Jn}from"../lit-all.min.js";var h=class extends Qn{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?zr`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:zr` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};p(h,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),p(h,"styles",Jn`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--mod-img-width, var(--img-width));
            height: var(--mod-img-height, var(--img-height));
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
    `);customElements.define("merch-icon",h);import{css as Fr,unsafeCSS as Gr}from"../lit-all.min.js";var G="(max-width: 767px)",ot="(max-width: 1199px)",_="(min-width: 768px)",T="(min-width: 1200px)",D="(min-width: 1600px)";var $r=Fr`
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

    :host([failed]) {
        display: none;
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
`,Vr=()=>[Fr`
      /* Tablet */
      @media screen and ${Gr(_)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${Gr(T)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{html as nt}from"../lit-all.min.js";var de,Oe=class Oe{constructor(t){p(this,"card");P(this,de);this.card=t,this.insertVariantStyle()}getContainer(){return L(this,de,f(this,de)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),f(this,de)}insertVariantStyle(){if(!Oe.styleMap[this.card.variant]){Oe.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let o=`--consonant-merch-card-${this.card.variant}-${r}-height`,n=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(o))||0;n>a&&this.getContainer().style.setProperty(o,`${n}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),nt`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return nt` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?nt`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return nt`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};de=new WeakMap,p(Oe,"styleMap",{});var w=Oe;import{html as Dt,css as ea}from"../lit-all.min.js";var kt="wcms:commerce:ready";var Ot='span[is="inline-price"][data-wcs-osi]',at='a[is="checkout-link"][data-wcs-osi],button[is="checkout-button"][data-wcs-osi]',jr="sp-button[data-wcs-osi]",Yr=`${Ot},${at}`;var Wr="merch-offer-select:ready",qr="merch-card:ready",Xr="merch-card:action-menu-toggle";var It="merch-storage:change",Ht="merch-quantity-selector:change";var me="aem:load",pe="aem:error",Kr="mas:ready",Zr="mas:error";var Qr="mas/commerce";var Bt={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"},Jr="X-Request-Id",eo="mas-commerce-service:initTime";var Ie=":start",to=":duration";function Q(e,t={},r=null,o=null){let n=o?document.createElement(e,{is:o}):document.createElement(e);r instanceof HTMLElement?n.appendChild(r):n.innerHTML=r;for(let[a,i]of Object.entries(t))n.setAttribute(a,i);return n}function it(){return window.matchMedia("(max-width: 767px)")}function ue(){return it().matches}function ro(){return window.matchMedia("(max-width: 1024px)").matches}function st(){let e=document.querySelector("mas-commerce-service");return e?{[eo]:e.initDuration}:{}}var oo=`
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

@media screen and ${_} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${T} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${D} {
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
}`;var Ut={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},ge=class extends w{constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Xr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let o=this.actionMenuContentSlot.classList.contains("hidden");o||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!o).toString())});p(this,"toggleActionMenuFromCard",r=>{let o=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(o||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",o),this.setAriaExpanded(this.actionMenu,"false"))});p(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get aemFragmentMapping(){return Ut}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Dt` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${ro()&&this.card.actionMenu?"always-visible":""}
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
            <slot></slot>`}getGlobalCSS(){return oo}setAriaExpanded(r,o){r.setAttribute("aria-expanded",o)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};p(ge,"variantStyle",ea`
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
    `);import{html as He}from"../lit-all.min.js";var no=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${_} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${T} {
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
`;var ct=class extends w{constructor(t){super(t)}getGlobalCSS(){return no}renderLayout(){return He`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?He`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:He`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?He`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:He`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as io}from"../lit-all.min.js";var ao=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${_} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${T} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${D} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var lt=class extends w{constructor(t){super(t)}getGlobalCSS(){return ao}renderLayout(){return io` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":io`<hr />`} ${this.secureLabelFooter}`}};import{html as fe,css as ta,unsafeCSS as co}from"../lit-all.min.js";var so=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
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
@media screen and ${G} {
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
}

@media screen and ${ot} {
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
@media screen and ${_} {
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
@media screen and ${T} {
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

@media screen and ${D} {
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
`;var ra=32,xe=class extends w{constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?fe`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:fe`<slot name="secure-transaction-label"></slot>`;return fe`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return so}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(n=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${n}"]`),n)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let o=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");o&&o.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;let r=this.card.querySelector('[slot="footer-rows"] ul');!r||!r.children||[...r.children].forEach((o,n)=>{let a=Math.max(ra,parseFloat(window.getComputedStyle(o).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(n+1)))||0;a>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(n+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(o=>{let n=o.querySelector(".footer-row-cell-description");n&&!n.textContent.trim()&&o.remove()})}renderLayout(){return fe` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?fe`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:fe`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){ue()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(xe,"variantStyle",ta`
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

    @media screen and ${co(ot)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${co(T)} {
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
    :host([variant='mini-compare-chart']) slot[name='footer-rows'] {
        justify-content: flex-start;
    }
  `);import{html as ho,css as oa}from"../lit-all.min.js";var lo=`
:root {
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant="plans"] {
    --consonant-merch-card-callout-icon-size: 18px;
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="plans"] [slot="icons"] {
    --img-width: 41.5px;
}

merch-card[variant="plans"] [slot="heading-xs"] span.price.price-strikethrough,
merch-card[variant="plans"] [slot="heading-m"] span.price.price-strikethrough {
    line-height: var(--consonant-merch-card-body-xs-line-height);
    font-weight: 700;
}

merch-card[variant="plans"] [slot="promo-text"] {
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card-collection merch-card[variant="plans"] {
  width: auto;
}

merch-card[variant="plans"] [slot="description"] {
    min-height: 84px;
}

merch-card[variant="plans"] [slot="body-xs"] a {
    color: var(--link-color);
}

merch-card[variant="plans"] [slot="promo-text"] a {
    color: inherit;
}

merch-card[variant="plans"] [slot="callout-content"] {
    margin: 8px 0 0;
}

merch-card[variant="plans"] [slot='callout-content'] > div > div,
merch-card[variant="plans"] [slot="callout-content"] > p {
    padding: 2px 10px 3px;
    background: #D9D9D9;
}

merch-card[variant="plans"] [slot='callout-content'] > p,
merch-card[variant="plans"] [slot='callout-content'] > div > div > div {
    color: #000;
}

merch-card[variant="plans"] [slot="callout-content"] img,
merch-card[variant="plans"] [slot="callout-content"] .icon-button {
    margin: 1.5px 0 1.5px 8px;
}

merch-card[variant="plans"] [slot="callout-content"] .icon-button::before {
    width: 18px;
    height: 18px;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="14" width="14"><path fill="%232c2c2c" d="M7 .778A6.222 6.222 0 1 0 13.222 7 6.222 6.222 0 0 0 7 .778zM6.883 2.45a1.057 1.057 0 0 1 1.113.998q.003.05.001.1a1.036 1.036 0 0 1-1.114 1.114A1.052 1.052 0 0 1 5.77 3.547 1.057 1.057 0 0 1 6.784 2.45q.05-.002.1.001zm1.673 8.05a.389.389 0 0 1-.39.389H5.834a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h.388V7h-.389a.389.389 0 0 1-.389-.389v-.778a.389.389 0 0 1 .39-.389h1.555a.389.389 0 0 1 .389.39v3.5h.389a.389.389 0 0 1 .389.388z"/></svg>');
    background-size: 18px 18px;
}

merch-card[variant="plans"] [slot="whats-included"] [slot="description"] {
  min-height: auto;
}

merch-card[variant="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding-top: 16px;
}

merch-card[variant="plans"] [slot="footer"] a {
    line-height: 19px;
    padding: 3px 16px 4px;
}

.plans-container {
    display: flex;
    justify-content: center;
    gap: 36px;
}

.plans-container merch-card-collection {
    padding: 0;
}

/* Mobile */
@media screen and ${G} {
    merch-whats-included merch-mnemonic-list,
    merch-whats-included [slot="heading"] {
        width: 100%;
    }
}

merch-card[variant="plans"]:not([size]) {
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
@media screen and ${_} {
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
@media screen and ${T} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${D} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var zt={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},quantitySelect:{tag:"div",slot:"quantity-select"},stockOffer:!0,secureLabel:!0,badge:{tag:"div",slot:"badge"},allowedBadgeColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans","spectrum-gray-700-plans","spectrum-green-900-plans"],allowedBorderColors:["spectrum-yellow-300-plans","spectrum-gray-300-plans"],borderColor:{attribute:"border-color"},size:["wide","super-wide"],whatsIncluded:{tag:"div",slot:"whats-included"},ctas:{slot:"footer",size:"m"},style:"consonant"},be=class extends w{constructor(t){super(t),this.adaptForMobile=this.adaptForMobile.bind(this)}get aemFragmentMapping(){return zt}getGlobalCSS(){return lo}adaptForMobile(){if(!this.card.closest("merch-card-collection,overlay-trigger")){this.card.removeAttribute("size");return}let t=this.card.shadowRoot,r=t.querySelector("footer"),o=this.card.getAttribute("size"),n=t.querySelector("footer #stock-checkbox"),a=t.querySelector(".body #stock-checkbox"),i=t.querySelector(".body");if(!o){r.classList.remove("wide-footer"),n&&n.remove();return}let s=ue();if(r&&r.classList.toggle("wide-footer",!s),s&&n){a?n.remove():i.appendChild(n);return}!s&&a&&(n?a.remove():r.prepend(a))}postCardUpdateHook(){this.adaptForMobile(),this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?ho`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}connectedCallbackHook(){let t=it();t?.addEventListener&&t.addEventListener("change",this.adaptForMobile)}disconnectedCallbackHook(){let t=it();t?.removeEventListener&&t.removeEventListener("change",this.adaptForMobile)}renderLayout(){return ho` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="whats-included"></slot>
            <slot name="callout-content"></slot>
            ${this.stockCheckbox}
            <slot name="badge"></slot>
            <slot name="quantity-select"></slot>
        </div>
        ${this.secureLabelFooter}`}};p(be,"variantStyle",oa`
    :host([variant='plans']) {
        min-height: 348px;
        border: 1px solid var(--merch-card-custom-border-color, #DADADA);
        --merch-card-plans-min-width: 244px;
        --merch-card-plans-max-width: 244px;
        --merch-card-plans-padding: 15px;
        --merch-card-plans-heading-min-height: 23px;
        --merch-color-green-promo: rgb(0, 122, 77);
        --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23505050' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");
        font-weight: 400;
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
  `);import{html as Gt,css as na}from"../lit-all.min.js";var mo=`
:root {
  --consonant-merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${_} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${T} {
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
`;var J=class extends w{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return mo}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Gt` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":Gt`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?Gt`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(ue()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};p(J,"variantStyle",na`
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
        min-height: var(--consonant-merch-card-product-callout-content-height);
        display: block;
    }
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Ft,css as aa}from"../lit-all.min.js";var po=`
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
@media screen and ${G} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${_} {
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
@media screen and ${T} {
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
`;var ve=class extends w{constructor(t){super(t)}getGlobalCSS(){return po}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ft` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ft`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ft`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(ve,"variantStyle",aa`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as $t,css as ia}from"../lit-all.min.js";var uo=`
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

@media screen and ${G} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${_} {
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
@media screen and ${T} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${D} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Vt={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ye=class extends w{constructor(t){super(t)}getGlobalCSS(){return uo}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Vt}renderLayout(){return $t`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?$t`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:$t`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};p(ye,"variantStyle",ia`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as sa,css as ca}from"../lit-all.min.js";var go=`
:root {
  --consonant-merch-card-twp-width: 268px;
  --consonant-merch-card-twp-mobile-width: 300px;
  --consonant-merch-card-twp-mobile-height: 358px;
}
  
merch-card[variant="twp"] div[class$='twp-badge'] {
  padding: 4px 10px 5px 10px;
}

merch-card[variant="twp"] [slot="body-xs-top"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  color: var(--merch-color-grey-80);
}

merch-card[variant="twp"] [slot="body-xs"] ul {
  padding: 0;
  margin: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li {
  list-style-type: none;
  padding-left: 0;
}

merch-card[variant="twp"] [slot="body-xs"] ul li::before {
  content: '\xB7';
  font-size: 20px;
  padding-right: 5px;
  font-weight: bold;
}

merch-card[variant="twp"] [slot="footer"] {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: var(--consonant-merch-card-body-xs-line-height);
  padding: var(--consonant-merch-spacing-s);
  var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
  color: var(--merch-color-grey-80);
  display: flex;
  flex-flow: wrap;
}

merch-card[variant='twp'] merch-quantity-select,
merch-card[variant='twp'] merch-offer-select {
  display: none;
}

.one-merch-card.twp,
.two-merch-cards.twp,
.three-merch-cards.twp {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${G} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${_} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
  
@media screen and ${T} {
  :root {
    --consonant-merch-card-twp-width: 268px;
  }
  .one-merch-card.twp
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}

@media screen and ${D} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var Ee=class extends w{constructor(t){super(t)}getGlobalCSS(){return go}renderLayout(){return sa`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};p(Ee,"variantStyle",ca`
    :host([variant='twp']) {
      padding: 4px 10px 5px 10px;
    }
    .twp-badge {
      padding: 4px 10px 5px 10px;
    }

    :host([variant='twp']) ::slotted(merch-offer-select) {
      display: none;
    }

    :host([variant='twp']) .top-section {
      flex: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 100%;
      gap: var(--consonant-merch-spacing-xxs);
      padding: var(--consonant-merch-spacing-xs)
          var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs)
          var(--consonant-merch-spacing-xs);
      align-items: flex-start;
    }

    :host([variant='twp']) .body {
      padding: 0 var(--consonant-merch-spacing-xs);
    }
    
    :host([aria-selected]) .twp-badge {
        margin-inline-end: 2px;
        padding-inline-end: 9px;
    }

    :host([variant='twp']) footer {
      gap: var(--consonant-merch-spacing-xxs);
      flex-direction: column;
      align-self: flex-start;
    }
  `);import{html as la,css as ha}from"../lit-all.min.js";var fo=`

  merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
  }
  
  merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

  merch-card[variant="ccd-suggested"] [slot="price"] em {
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      line-height: var(--consonant-merch-card-body-xxs-line-height);
  }

.spectrum--darkest merch-card[variant="ccd-suggested"] {
  --consonant-merch-card-background-color:rgb(30, 30, 30);
  --consonant-merch-card-heading-xs-color:rgb(239, 239, 239);
  --consonant-merch-card-body-xs-color:rgb(200, 200, 200);
  --consonant-merch-card-border-color:rgb(57, 57, 57);
  --consonant-merch-card-detail-s-color:rgb(162, 162, 162);
  --consonant-merch-card-price-color:rgb(248, 248, 248);
  --merch-color-inline-price-strikethrough:rgb(176, 176, 176);
}

.spectrum--darkest  merch-card[variant="ccd-suggested"]:hover {
  --consonant-merch-card-border-color:rgb(73, 73, 73);
}
`;var jt={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},we=class extends w{getGlobalCSS(){return fo}get aemFragmentMapping(){return jt}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return la` <div style="${this.stripStyle}" class="body">
                <div class="header">
                    <div class="top-section">
                        <slot name="icons"></slot>
                        ${this.badge}
                    </div>
                    <div class="headings">
                        <slot name="detail-s"></slot>
                        <slot name="heading-xs"></slot>
                    </div>
                </div>
                <slot name="body-xs"></slot>
                <div class="footer">
                    <slot name="price"></slot>
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};p(we,"variantStyle",ha`
        :host([variant='ccd-suggested']) {
            --consonant-merch-card-background-color: rgb(245, 245, 245);
            --consonant-merch-card-body-xs-color: rgb(75, 75, 75);
            --consonant-merch-card-border-color: rgb(225, 225, 225);
            --consonant-merch-card-detail-s-color: rgb(110, 110, 110);
            --consonant-merch-card-heading-xs-color: rgb(44, 44, 44);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 38px;

            box-sizing: border-box;
            width: 100%;
            max-width: 305px;
            min-width: 270px;
            min-height: 205px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
            overflow: hidden;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-suggested']:hover) {
            --consonant-merch-card-border-color: #cacaca;
        }

        :host([variant='ccd-suggested']) .body {
            height: auto;
            padding: 20px;
            gap: 0;
        }

        :host([variant='ccd-suggested'].thin-strip) .body {
            padding: 20px 20px 20px 28px;
        }

        :host([variant='ccd-suggested']) .header {
            display: flex;
            flex-flow: wrap;
            place-self: flex-start;
            flex-wrap: nowrap;
        }

        :host([variant='ccd-suggested']) .headings {
            padding-inline-start: var(--consonant-merch-spacing-xxs);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
            place-self: center;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
            font-size: var(--consonant-merch-card-heading-xxs-font-size);
            line-height: var(--consonant-merch-card-heading-xxs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
            line-height: var(--consonant-merch-card-detail-m-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
            color: var(--ccd-gray-700-dark);
            padding-top: 8px;
            flex-grow: 1;
        }

        :host([variant='ccd-suggested'].wide-strip)
            ::slotted([slot='body-xs']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
            padding-inline-start: 48px;
        }

        :host([variant='ccd-suggested']) ::slotted([slot='price']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xs-line-height);
        }

        :host([variant='ccd-suggested']) ::slotted([slot='cta']) {
            display: flex;
            align-items: center;
            min-width: fit-content;
        }

        :host([variant='ccd-suggested']) .footer {
            display: flex;
            justify-content: space-between;
            flex-grow: 0;
            margin-top: 6px;
            align-items: center;
        }

        :host([variant='ccd-suggested']) div[class$='-badge'] {
            position: static;
            border-radius: 4px;
        }

        :host([variant='ccd-suggested']) .top-section {
            align-items: center;
        }
    `);import{html as da,css as ma}from"../lit-all.min.js";var xo=`

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}

merch-card[variant="ccd-slice"] [slot='body-s'] a.spectrum-Link {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
}

.spectrum--darkest merch-card[variant="ccd-slice"] {
  --consonant-merch-card-background-color:rgb(29, 29, 29);
  --consonant-merch-card-body-s-color:rgb(235, 235, 235);
  --consonant-merch-card-border-color:rgb(48, 48, 48);
  --consonant-merch-card-detail-s-color:rgb(235, 235, 235);
}
`;var Yt={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},Se=class extends w{getGlobalCSS(){return xo}get aemFragmentMapping(){return Yt}renderLayout(){return da` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(Se,"variantStyle",ma`
        :host([variant='ccd-slice']) {
            --consonant-merch-card-background-color: rgb(248, 248, 248);
            --consonant-merch-card-border-color: rgb(230, 230, 230);
            --consonant-merch-card-body-s-color: rgb(34, 34, 34);
            --merch-color-inline-price-strikethrough: var(--spectrum-gray-600);
            --mod-img-height: 29px;

            box-sizing: border-box;
            min-width: 290px;
            max-width: 322px;
            width: 100%;
            max-height: 154px;
            height: 154px;
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) * {
            overflow: hidden;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            min-width: 154px;
            max-width: 171px;
            height: 55px;
            overflow: hidden;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
            max-width: 425px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: 600px;
            max-width: 600px;
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: 15px;
            padding-inline-end: 0;
            height: 154px;
            box-sizing: border-box;
            min-height: 123px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--spectrum-gray-800, var(--merch-color-grey-80));
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: 134px;
            height: 149px;
            overflow: hidden;
            border-radius: 50%;
            padding: 15px;
            align-self: center;
            padding-inline-start: 0;
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) img {
            overflow: hidden;
            border-radius: 50%;
            width: inherit;
            height: inherit;
        }

        :host([variant='ccd-slice']) div[class$='-badge'] {
            font-size: var(--consonant-merch-card-body-xxs-font-size);
            position: static;
            border-radius: 4px;
            font-style: normal;
            font-weight: 400;
            line-height: normal;
            padding: 4px 9px;
        }

        :host([variant='ccd-slice']) .top-section {
            align-items: center;
            gap: 8px;
        }
    `);import{html as pa,css as ua}from"../lit-all.min.js";var bo=`
    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="heading-xxxs"] {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
        font-style: normal;
        margin-top: 4px;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price.price-strikethrough {
        height: var(--consonant-merch-card-detail-l-line-height);
        line-height: var(--consonant-merch-card-detail-l-line-height);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        text-decoration-thickness: .5px;
        color: var(--ah-gray-500);
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-currency-symbol,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-integer,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-decimals-delimiter,
    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] .price:not(.price-strikethrough) .price-recurrence {
        display: inline-block;
        width: 21px;
        text-align: end;
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 400;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] a {
        color: var(--consonant-merch-card-body-xxs-color);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        font-style: normal;
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        text-decoration: underline;
        text-decoration-thickness: .75px;
        text-underline-offset: 1px;
        width: fit-content;
        margin-top: 4px;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="price"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 700;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="cta"] {
        align-self: end;
        gap: 8px;
        display: flex;
        padding-top: 24px;
        flex-wrap: wrap;
    }

    merch-card[variant="ah-try-buy-widget"] [slot="image"] {
      display: none;
    }
    
    merch-card[variant="ah-try-buy-widget"][size='single'] [slot="image"] {
      display: flex;
      width: 199px;
      overflow: hidden;
      height: 100%;
      border-radius: 16px;
      order: 1;
    }

    merch-card[variant="ah-try-buy-widget"][size='single'] [slot="image"] img {
      width: 100%;
      object-fit: cover;
      border-radius: 16px;
      overflow: hidden;
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"][background-color='gray'],
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"][background-color='gray'] {
      --merch-card-ah-try-buy-widget-gray-background: rgb(27, 27, 27);
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"],
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"] {
      --consonant-merch-card-background-color:rgb(17, 17, 17);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
    }

    .spectrum--dark merch-card[variant="ah-try-buy-widget"]:hover,
    .spectrum--darkest merch-card[variant="ah-try-buy-widget"]:hover {
      --consonant-merch-card-border-color:rgb(73, 73, 73);
    }
`;var Wt={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color",specialValues:{}},allowedColors:{gray:"--spectrum-gray-100"},size:["single","double","triple"]},ee=class extends w{getGlobalCSS(){return bo}get aemFragmentMapping(){return Wt}renderLayout(){return pa`
            <div class="content">
                <div class="header">
                    <slot name="icons"></slot>
                    <slot name="heading-xxxs"></slot>
                </div>
                <slot name="body-xxs"></slot>
                <div class="price">
                    <slot name="price"></slot>
                </div>
                <div class="footer">
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot name="image"></slot>
            <slot></slot>
        `}};p(ee,"variantStyle",ua`
        :host([variant='ah-try-buy-widget']) {
            --merch-card-ah-try-buy-widget-min-width: 156px;
            --merch-card-ah-try-buy-widget-content-min-width: 132px;
            --merch-card-ah-try-buy-widget-header-min-height: 36px;
            --merch-card-ah-try-buy-widget-gray-background: rgba(248, 248, 248);
            --merch-card-ah-try-buy-widget-text-color: rgba(19, 19, 19);
            --merch-card-ah-try-buy-widget-price-line-height: 17px;
            --merch-card-ah-try-buy-widget-outline: transparent;
            --merch-card-custom-border-width: 1px;
            height: 100%;
            min-width: var(--merch-card-ah-try-buy-widget-min-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 10px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 11px !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
        }

        :host([variant='ah-try-buy-widget'][size='single']) {
            flex-direction: row;
        }

        :host([variant='ah-try-buy-widget'][size='single'])
            ::slotted(div[slot='cta']) {
            display: flex;
            flex-grow: 0;
        }

        :host([variant='ah-try-buy-widget']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            min-width: var(--merch-card-ah-try-buy-widget-content-min-width);
            flex-basis: var(--merch-card-ah-try-buy-widget-content-min-width);
            flex-grow: 1;
        }

        :host([variant='ah-try-buy-widget']) .header {
            display: flex;
            min-height: var(--merch-card-ah-try-buy-widget-header-min-height);
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
            margin-bottom: 4px;
        }

        :host([variant='ah-try-buy-widget']) .price {
            display: flex;
            flex-grow: 1;
        }

        :host([variant='ah-try-buy-widget']) ::slotted([slot='price']) {
            margin-left: var(--spacing-xs);
            display: flex;
            flex-direction: column;
            justify-content: end;
            font-size: var(--consonant-merch-card-detail-s-font-size);
            font-style: italic;
            line-height: var(--merch-card-ah-try-buy-widget-price-line-height);
            color: var(--consonant-merch-card-heading-xxxs-color);
        }

        :host([variant='ah-try-buy-widget']) .footer {
            display: flex;
            width: fit-content;
            flex-wrap: wrap;
            gap: 8px;
            flex-direction: row;
        }
    `);customElements.define("ah-try-buy-widget",ee);import{html as ga,css as fa}from"../lit-all.min.js";var vo=`
    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] {
        letter-spacing: normal;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
    }

    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] a {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="body-xxs"] a:hover {
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
        font-style: normal;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price.price-strikethrough {
        height: var(--consonant-merch-card-detail-l-line-height);
        line-height: var(--consonant-merch-card-detail-l-line-height);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        text-decoration-thickness: .5px;
        color: var(--merch-card-ah-promoted-plans-strikethrough-color);
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-currency-symbol,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-integer,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-decimals-delimiter,
    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] .price:not(.price-strikethrough) .price-recurrence {
        display: inline-block;
        width: 21px;
        text-align: end;
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        color: var(--consonant-merch-card-body-xxs-color);
        font-weight: 400;
    }

    merch-card[variant="ah-promoted-plans"] [slot="cta"] {
        gap: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    
    merch-card[variant="ah-promoted-plans"] [slot="cta"] .spectrum-Link {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
    }

    merch-card[variant="ah-promoted-plans"] [slot="cta"] button[is="checkout-button"] {
        margin-inline-start: auto;
    }
    
    merch-card[variant="ah-promoted-plans"] [slot="cta"] button[is="checkout-button"]:last-child {
        margin-inline-start: 0;
    }

    merch-card[variant="ah-promoted-plans"] [slot="price"] em {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        color: var(--merch-card-ah-promoted-plans-abm-color);
    }

    .spectrum--dark merch-card[variant="ah-promoted-plans"],
    .spectrum--darkest merch-card[variant="ah-promoted-plans"] {
      --consonant-merch-card-background-color:rgb(34, 34, 34);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --merch-card-ah-promoted-plans-abm-color:rgb(175, 175, 175);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
      --merch-card-ah-promoted-plans-strikethrough-color:rgb(138, 138, 138);
    }
`;var qt={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40,withSuffix:!0},description:{tag:"div",slot:"body-xxs",maxCount:200,withSuffix:!1},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},backgroundColor:{attribute:"background-color"},borderColor:{attribute:"border-color",specialValues:{gradient:"linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%)"}}},te=class extends w{getGlobalCSS(){return vo}get aemFragmentMapping(){return qt}renderLayout(){return ga`
            <div class="content">
                <div class="header">
                    <slot name="icons"></slot>
                    <slot name="heading-xxxs"></slot>
                </div>
                <div class="price">
                    <slot name="price"></slot>
                </div>
                <slot name="body-xxs"></slot>
                <div class="footer">
                    <slot name="cta"></slot>
                </div>
            </div>
            <slot></slot>
        `}};p(te,"variantStyle",fa`
        /* Default styles for the component */
        :host([variant='ah-promoted-plans']) {
            --merch-card-ah-promoted-plans-min-width: 211px;
            --merch-card-ah-promoted-plans-max-width: 384px;
            --merch-card-ah-promoted-plans-header-min-height: 36px;
            --merch-card-ah-promoted-plans-gray-background: rgba(248, 248, 248);
            --merch-card-ah-promoted-plans-text-color: rgba(19, 19, 19);
            --merch-card-ah-promoted-plans-abm-color: rgba(80, 80, 80);
            --merch-card-ah-promoted-plans-strikethrough-color: rgba(
                113,
                113,
                113
            );
            --merch-card-ah-promoted-plans-price-line-height: 17px;
            --merch-card-ah-promoted-plans-outline: transparent;
            --merch-card-custom-border-width: 1px;
            height: 100%;
            min-width: var(--merch-card-ah-promoted-plans-min-width);
            max-width: var(--merch-card-ah-promoted-plans-max-width);
            background-color: var(
                --merch-card-custom-background-color,
                var(--consonant-merch-card-background-color)
            );
            color: var(--consonant-merch-card-heading-xxxs-color);
            border-radius: 10px;
            border: 1px solid var(--merch-card-custom-border-color, transparent);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            padding: 16px !important;
            gap: 16px;
            justify-content: space-between;
            box-sizing: border-box !important;
            position: relative;
        }

        :host([variant='ah-promoted-plans'][gradient-border='true']) {
            border: none;
            padding: 15px !important;
            background-origin: padding-box, border-box;
            background-clip: padding-box, border-box;
            background-image: linear-gradient(
                    to bottom,
                    var(
                        --merch-card-custom-background-color,
                        var(--consonant-merch-card-background-color)
                    ),
                    var(
                        --merch-card-custom-background-color,
                        var(--consonant-merch-card-background-color)
                    )
                ),
                linear-gradient(135deg, #ff4885 0%, #b272eb 50%, #5d89ff 100%);
            border: 1px solid transparent;
        }

        :host([variant='ah-promoted-plans']) .content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            gap: var(--consonant-merch-spacing-xxs);
            flex-grow: 1;
        }

        :host([variant='ah-promoted-plans']) .header {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: var(--consonant-merch-spacing-xxs);
        }

        :host([variant='ah-promoted-plans']) ::slotted([slot='price']) {
            margin-left: var(--spacing-xs);
            display: flex;
            flex-direction: column;
            justify-content: end;
            font-size: var(--consonant-merch-card-body-m-font-size);
            font-style: italic;
            line-height: var(--consonant-merch-card-body-m-line-height);
            color: var(--consonant-merch-card-heading-xxxs-color);
        }

        :host([variant='ah-promoted-plans']) .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    `);customElements.define("ah-promoted-plans",te);var Xt=(e,t=!1)=>{switch(e.variant){case"catalog":return new ge(e);case"image":return new ct(e);case"inline-heading":return new lt(e);case"mini-compare-chart":return new xe(e);case"plans":return new be(e);case"product":return new J(e);case"segment":return new ve(e);case"special-offers":return new ye(e);case"twp":return new Ee(e);case"ccd-suggested":return new we(e);case"ccd-slice":return new Se(e);case"ah-try-buy-widget":return new ee(e);case"ah-promoted-plans":return new te(e);default:return t?void 0:new J(e)}},yo={catalog:Ut,image:null,"inline-heading":null,"mini-compare-chart":null,plans:zt,product:null,segment:null,"special-offers":Vt,twp:null,"ccd-suggested":jt,"ccd-slice":Yt,"ah-try-buy-widget":Wt,"ah-promoted-plans":qt},Eo=()=>{let e=[];return e.push(ge.variantStyle),e.push(xe.variantStyle),e.push(J.variantStyle),e.push(be.variantStyle),e.push(ve.variantStyle),e.push(ye.variantStyle),e.push(Ee.variantStyle),e.push(we.variantStyle),e.push(Se.variantStyle),e.push(ee.variantStyle),e.push(te.variantStyle),e};var wo=document.createElement("style");wo.innerHTML=`
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
    --consonant-merch-card-heading-l-font-size: 20px;
    --consonant-merch-card-heading-l-line-height: 30px;
    --consonant-merch-card-heading-xl-font-size: 36px;
    --consonant-merch-card-heading-xl-line-height: 45px;

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
    --merch-color-green-promo: #2D9D78;
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

merch-card [slot^='heading-'] {
    color: var(--consonant-merch-card-heading-color);
    font-weight: 700;
}

merch-card [slot='heading-xxxs'] {
        font-size: var(--consonant-merch-card-heading-xxxs-font-size);
        line-height: var(--consonant-merch-card-heading-xxxs-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
        letter-spacing: normal;
}

merch-card [slot='heading-xs'] {
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

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
}

merch-card [slot='heading-m'] {
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

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
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

merch-card[variant='plans'] [slot='badge'] {
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

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
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

`;document.head.appendChild(wo);var Kt;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Kt||(Kt={}));var N;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(N||(N={}));var C;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(C||(C={}));var Zt;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Zt||(Zt={}));var Qt;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Qt||(Qt={}));var Jt;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Jt||(Jt={}));var er;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(er||(er={}));var So="tacocat.js";var Ao=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function Ae(e,t={},{metadata:r=!0,search:o=!0,storage:n=!0}={}){let a;if(o&&a==null){let i=new URLSearchParams(window.location.search),s=Be(o)?o:e;a=i.get(s)}if(n&&a==null){let i=Be(n)?n:e;a=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(r&&a==null){let i=xa(Be(r)?r:e);a=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return a??t[e]}var To=e=>typeof e=="boolean",De=e=>typeof e=="function",tr=e=>typeof e=="number",_o=e=>e!=null&&typeof e=="object";var Be=e=>typeof e=="string";var Ue=e=>tr(e)&&Number.isFinite(e)&&e>0;function B(e,t){if(To(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function xa(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,o)=>`${r}-${o}`).replace(/\W+/gu,"-").toLowerCase()}var ba=Date.now(),rr=()=>`(+${Date.now()-ba}ms)`,ht=new Set,va=B(Ae("tacocat.debug",{},{metadata:!1}),!1);function Po(e){let t=`[${So}/${e}]`,r=(i,s,...c)=>i?!0:(n(s,...c),!1),o=va?(i,...s)=>{console.debug(`${t} ${i}`,...s,rr())}:()=>{},n=(i,...s)=>{let c=`${t} ${i}`;ht.forEach(([l])=>l(c,...s))};return{assert:r,debug:o,error:n,warn:(i,...s)=>{let c=`${t} ${i}`;ht.forEach(([,l])=>l(c,...s))}}}function ya(e,t){let r=[e,t];return ht.add(r),()=>{ht.delete(r)}}ya((e,...t)=>{console.error(e,...t,rr())},(e,...t)=>{console.warn(e,...t,rr())});var Lo="ABM",Co="PUF",Ro="M2M",Mo="PERPETUAL",No="P3Y";var ko={ABM:Lo,PUF:Co,M2M:Ro,PERPETUAL:Mo,P3Y:No},gd={[Lo]:{commitment:N.YEAR,term:C.MONTHLY},[Co]:{commitment:N.YEAR,term:C.ANNUAL},[Ro]:{commitment:N.MONTH,term:C.MONTHLY},[Mo]:{commitment:N.PERPETUAL,term:void 0},[No]:{commitment:N.THREE_MONTHS,term:C.P3Y}};var or=function(e,t){return or=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,o){r.__proto__=o}||function(r,o){for(var n in o)Object.prototype.hasOwnProperty.call(o,n)&&(r[n]=o[n])},or(e,t)};function ze(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");or(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var v=function(){return v=Object.assign||function(t){for(var r,o=1,n=arguments.length;o<n;o++){r=arguments[o];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},v.apply(this,arguments)};function dt(e,t,r){if(r||arguments.length===2)for(var o=0,n=t.length,a;o<n;o++)(a||!(o in t))&&(a||(a=Array.prototype.slice.call(t,0,o)),a[o]=t[o]);return e.concat(a||Array.prototype.slice.call(t))}var b;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(b||(b={}));var A;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(A||(A={}));var re;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(re||(re={}));function nr(e){return e.type===A.literal}function Oo(e){return e.type===A.argument}function mt(e){return e.type===A.number}function pt(e){return e.type===A.date}function ut(e){return e.type===A.time}function gt(e){return e.type===A.select}function ft(e){return e.type===A.plural}function Io(e){return e.type===A.pound}function xt(e){return e.type===A.tag}function bt(e){return!!(e&&typeof e=="object"&&e.type===re.number)}function Ge(e){return!!(e&&typeof e=="object"&&e.type===re.dateTime)}var ar=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Ea=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Ho(e){var t={};return e.replace(Ea,function(r){var o=r.length;switch(r[0]){case"G":t.era=o===4?"long":o===5?"narrow":"short";break;case"y":t.year=o===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][o-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][o-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=o===4?"short":o===5?"narrow":"short";break;case"e":if(o<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][o-4];break;case"c":if(o<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][o-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][o-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][o-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][o-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][o-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][o-1];break;case"s":t.second=["numeric","2-digit"][o-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=o<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Bo=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Go(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Bo).filter(function(u){return u.length>0}),r=[],o=0,n=t;o<n.length;o++){var a=n[o],i=a.split("/");if(i.length===0)throw new Error("Invalid number skeleton");for(var s=i[0],c=i.slice(1),l=0,m=c;l<m.length;l++){var g=m[l];if(g.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function wa(e){return e.replace(/^(.*?)-/,"")}var Do=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Fo=/^(@+)?(\+|#+)?[rs]?$/g,Sa=/(\*)(0+)|(#+)(0+)|(0+)/g,$o=/^(0+)$/;function Uo(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(Fo,function(r,o,n){return typeof n!="string"?(t.minimumSignificantDigits=o.length,t.maximumSignificantDigits=o.length):n==="+"?t.minimumSignificantDigits=o.length:o[0]==="#"?t.maximumSignificantDigits=o.length:(t.minimumSignificantDigits=o.length,t.maximumSignificantDigits=o.length+(typeof n=="string"?n.length:0)),""}),t}function Vo(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Aa(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!$o.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function zo(e){var t={},r=Vo(e);return r||t}function jo(e){for(var t={},r=0,o=e;r<o.length;r++){var n=o[r];switch(n.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=n.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=wa(n.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=v(v(v({},t),{notation:"scientific"}),n.options.reduce(function(c,l){return v(v({},c),zo(l))},{}));continue;case"engineering":t=v(v(v({},t),{notation:"engineering"}),n.options.reduce(function(c,l){return v(v({},c),zo(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(n.options[0]);continue;case"integer-width":if(n.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");n.options[0].replace(Sa,function(c,l,m,g,u,x){if(l)t.minimumIntegerDigits=m.length;else{if(g&&u)throw new Error("We currently do not support maximum integer digits");if(x)throw new Error("We currently do not support exact integer digits")}return""});continue}if($o.test(n.stem)){t.minimumIntegerDigits=n.stem.length;continue}if(Do.test(n.stem)){if(n.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");n.stem.replace(Do,function(c,l,m,g,u,x){return m==="*"?t.minimumFractionDigits=l.length:g&&g[0]==="#"?t.maximumFractionDigits=g.length:u&&x?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+x.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var a=n.options[0];a==="w"?t=v(v({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=v(v({},t),Uo(a)));continue}if(Fo.test(n.stem)){t=v(v({},t),Uo(n.stem));continue}var i=Vo(n.stem);i&&(t=v(v({},t),i));var s=Aa(n.stem);s&&(t=v(v({},t),s))}return t}var Fe={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Yo(e,t){for(var r="",o=0;o<e.length;o++){var n=e.charAt(o);if(n==="j"){for(var a=0;o+1<e.length&&e.charAt(o+1)===n;)a++,o++;var i=1+(a&1),s=a<2?1:3+(a>>1),c="a",l=Ta(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;i-- >0;)r=l+r}else n==="J"?r+="H":r+=n}return r}function Ta(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,o;r!=="root"&&(o=e.maximize().region);var n=Fe[o||""]||Fe[r||""]||Fe["".concat(r,"-001")]||Fe["001"];return n[0]}var ir,_a=new RegExp("^".concat(ar.source,"*")),Pa=new RegExp("".concat(ar.source,"*$"));function y(e,t){return{start:e,end:t}}var La=!!String.prototype.startsWith,Ca=!!String.fromCodePoint,Ra=!!Object.fromEntries,Ma=!!String.prototype.codePointAt,Na=!!String.prototype.trimStart,ka=!!String.prototype.trimEnd,Oa=!!Number.isSafeInteger,Ia=Oa?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},cr=!0;try{Wo=Zo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),cr=((ir=Wo.exec("a"))===null||ir===void 0?void 0:ir[0])==="a"}catch{cr=!1}var Wo,qo=La?function(t,r,o){return t.startsWith(r,o)}:function(t,r,o){return t.slice(o,o+r.length)===r},lr=Ca?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var o="",n=t.length,a=0,i;n>a;){if(i=t[a++],i>1114111)throw RangeError(i+" is not a valid code point");o+=i<65536?String.fromCharCode(i):String.fromCharCode(((i-=65536)>>10)+55296,i%1024+56320)}return o},Xo=Ra?Object.fromEntries:function(t){for(var r={},o=0,n=t;o<n.length;o++){var a=n[o],i=a[0],s=a[1];r[i]=s}return r},Ko=Ma?function(t,r){return t.codePointAt(r)}:function(t,r){var o=t.length;if(!(r<0||r>=o)){var n=t.charCodeAt(r),a;return n<55296||n>56319||r+1===o||(a=t.charCodeAt(r+1))<56320||a>57343?n:(n-55296<<10)+(a-56320)+65536}},Ha=Na?function(t){return t.trimStart()}:function(t){return t.replace(_a,"")},Ba=ka?function(t){return t.trimEnd()}:function(t){return t.replace(Pa,"")};function Zo(e,t){return new RegExp(e,t)}var hr;cr?(sr=Zo("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),hr=function(t,r){var o;sr.lastIndex=r;var n=sr.exec(t);return(o=n[1])!==null&&o!==void 0?o:""}):hr=function(t,r){for(var o=[];;){var n=Ko(t,r);if(n===void 0||Jo(n)||za(n))break;o.push(n),r+=n>=65536?2:1}return lr.apply(void 0,o)};var sr,Qo=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,o){for(var n=[];!this.isEOF();){var a=this.char();if(a===123){var i=this.parseArgument(t,o);if(i.err)return i;n.push(i.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),n.push({type:A.pound,location:y(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(o)break;return this.error(b.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&dr(this.peek()||0)){var i=this.parseTag(t,r);if(i.err)return i;n.push(i.val)}else{var i=this.parseLiteral(t,r);if(i.err)return i;n.push(i.val)}}}return{val:n,err:null}},e.prototype.parseTag=function(t,r){var o=this.clonePosition();this.bump();var n=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:A.literal,value:"<".concat(n,"/>"),location:y(o,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var i=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!dr(this.char()))return this.error(b.INVALID_TAG,y(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return n!==l?this.error(b.UNMATCHED_CLOSING_TAG,y(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:A.tag,value:n,children:i,location:y(o,this.clonePosition())},err:null}:this.error(b.INVALID_TAG,y(s,this.clonePosition())))}else return this.error(b.UNCLOSED_TAG,y(o,this.clonePosition()))}else return this.error(b.INVALID_TAG,y(o,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Ua(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var o=this.clonePosition(),n="";;){var a=this.tryParseQuote(r);if(a){n+=a;continue}var i=this.tryParseUnquoted(t,r);if(i){n+=i;continue}var s=this.tryParseLeftAngleBracket();if(s){n+=s;continue}break}var c=y(o,this.clonePosition());return{val:{type:A.literal,value:n,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Da(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var o=this.char();if(o===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(o);this.bump()}return lr.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var o=this.char();return o===60||o===123||o===35&&(r==="plural"||r==="selectordinal")||o===125&&t>0?null:(this.bump(),lr(o))},e.prototype.parseArgument=function(t,r){var o=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,y(o,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(b.EMPTY_ARGUMENT,y(o,this.clonePosition()));var n=this.parseIdentifierIfPossible().value;if(!n)return this.error(b.MALFORMED_ARGUMENT,y(o,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,y(o,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:A.argument,value:n,location:y(o,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,y(o,this.clonePosition())):this.parseArgumentOptions(t,r,n,o);default:return this.error(b.MALFORMED_ARGUMENT,y(o,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),o=hr(this.message,r),n=r+o.length;this.bumpTo(n);var a=this.clonePosition(),i=y(t,a);return{value:o,location:i}},e.prototype.parseArgumentOptions=function(t,r,o,n){var a,i=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(b.EXPECT_ARGUMENT_TYPE,y(i,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var m=this.clonePosition(),g=this.parseSimpleArgStyleIfPossible();if(g.err)return g;var u=Ba(g.val);if(u.length===0)return this.error(b.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var x=y(m,this.clonePosition());l={style:u,styleLocation:x}}var S=this.tryParseArgumentClose(n);if(S.err)return S;var E=y(n,this.clonePosition());if(l&&qo(l?.style,"::",0)){var k=Ha(l.style.slice(2));if(s==="number"){var g=this.parseNumberSkeletonFromString(k,l.styleLocation);return g.err?g:{val:{type:A.number,value:o,location:E,style:g.val},err:null}}else{if(k.length===0)return this.error(b.EXPECT_DATE_TIME_SKELETON,E);var z=k;this.locale&&(z=Yo(k,this.locale));var u={type:re.dateTime,pattern:z,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?Ho(z):{}},W=s==="date"?A.date:A.time;return{val:{type:W,value:o,location:E,style:u},err:null}}}return{val:{type:s==="number"?A.number:s==="date"?A.date:A.time,value:o,location:E,style:(a=l?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var H=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(b.EXPECT_SELECT_ARGUMENT_OPTIONS,y(H,v({},H)));this.bumpSpace();var Z=this.parseIdentifierIfPossible(),$=0;if(s!=="select"&&Z.value==="offset"){if(!this.bumpIf(":"))return this.error(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var g=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,b.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(g.err)return g;this.bumpSpace(),Z=this.parseIdentifierIfPossible(),$=g.val}var ce=this.tryParsePluralOrSelectOptions(t,s,r,Z);if(ce.err)return ce;var S=this.tryParseArgumentClose(n);if(S.err)return S;var Ne=y(n,this.clonePosition());return s==="select"?{val:{type:A.select,value:o,options:Xo(ce.val),location:Ne},err:null}:{val:{type:A.plural,value:o,options:Xo(ce.val),offset:$,pluralType:s==="plural"?"cardinal":"ordinal",location:Ne},err:null}}default:return this.error(b.INVALID_ARGUMENT_TYPE,y(i,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var o=this.char();switch(o){case 39:{this.bump();var n=this.clonePosition();if(!this.bumpUntil("'"))return this.error(b.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(n,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var o=[];try{o=Go(t)}catch{return this.error(b.INVALID_NUMBER_SKELETON,r)}return{val:{type:re.number,tokens:o,location:r,parsedOptions:this.shouldParseSkeletons?jo(o):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,o,n){for(var a,i=!1,s=[],c=new Set,l=n.value,m=n.location;;){if(l.length===0){var g=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_SELECTOR,b.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;m=y(g,this.clonePosition()),l=this.message.slice(g.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?b.DUPLICATE_SELECT_ARGUMENT_SELECTOR:b.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,m);l==="other"&&(i=!0),this.bumpSpace();var x=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:b.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var S=this.parseMessage(t+1,r,o);if(S.err)return S;var E=this.tryParseArgumentClose(x);if(E.err)return E;s.push([l,{value:S.val,location:y(x,this.clonePosition())}]),c.add(l),this.bumpSpace(),a=this.parseIdentifierIfPossible(),l=a.value,m=a.location}return s.length===0?this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR:b.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!i?this.error(b.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var o=1,n=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(o=-1);for(var a=!1,i=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,i=i*10+(s-48),this.bump();else break}var c=y(n,this.clonePosition());return a?(i*=o,Ia(i)?{val:i,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=Ko(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(qo(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),o=this.message.indexOf(t,r);return o>=0?(this.bumpTo(o),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Jo(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),o=this.message.charCodeAt(r+(t>=65536?2:1));return o??null},e}();function dr(e){return e>=97&&e<=122||e>=65&&e<=90}function Da(e){return dr(e)||e===47}function Ua(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Jo(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function za(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function mr(e){e.forEach(function(t){if(delete t.location,gt(t)||ft(t))for(var r in t.options)delete t.options[r].location,mr(t.options[r].value);else mt(t)&&bt(t.style)||(pt(t)||ut(t))&&Ge(t.style)?delete t.style.location:xt(t)&&mr(t.children)})}function en(e,t){t===void 0&&(t={}),t=v({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Qo(e,t).parse();if(r.err){var o=SyntaxError(b[r.err.kind]);throw o.location=r.err.location,o.originalMessage=r.err.message,o}return t?.captureLocation||mr(r.val),r.val}function $e(e,t){var r=t&&t.cache?t.cache:Ya,o=t&&t.serializer?t.serializer:ja,n=t&&t.strategy?t.strategy:Fa;return n(e,{cache:r,serializer:o})}function Ga(e){return e==null||typeof e=="number"||typeof e=="boolean"}function tn(e,t,r,o){var n=Ga(o)?o:r(o),a=t.get(n);return typeof a>"u"&&(a=e.call(this,o),t.set(n,a)),a}function rn(e,t,r){var o=Array.prototype.slice.call(arguments,3),n=r(o),a=t.get(n);return typeof a>"u"&&(a=e.apply(this,o),t.set(n,a)),a}function pr(e,t,r,o,n){return r.bind(t,e,o,n)}function Fa(e,t){var r=e.length===1?tn:rn;return pr(e,this,r,t.cache.create(),t.serializer)}function $a(e,t){return pr(e,this,rn,t.cache.create(),t.serializer)}function Va(e,t){return pr(e,this,tn,t.cache.create(),t.serializer)}var ja=function(){return JSON.stringify(arguments)};function ur(){this.cache=Object.create(null)}ur.prototype.get=function(e){return this.cache[e]};ur.prototype.set=function(e,t){this.cache[e]=t};var Ya={create:function(){return new ur}},vt={variadic:$a,monadic:Va};var oe;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(oe||(oe={}));var Ve=function(e){ze(t,e);function t(r,o,n){var a=e.call(this,r)||this;return a.code=o,a.originalMessage=n,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var gr=function(e){ze(t,e);function t(r,o,n,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(o,'". Options are "').concat(Object.keys(n).join('", "'),'"'),oe.INVALID_VALUE,a)||this}return t}(Ve);var on=function(e){ze(t,e);function t(r,o,n){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(o),oe.INVALID_VALUE,n)||this}return t}(Ve);var nn=function(e){ze(t,e);function t(r,o){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(o,'"'),oe.MISSING_VALUE,o)||this}return t}(Ve);var M;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(M||(M={}));function Wa(e){return e.length<2?e:e.reduce(function(t,r){var o=t[t.length-1];return!o||o.type!==M.literal||r.type!==M.literal?t.push(r):o.value+=r.value,t},[])}function qa(e){return typeof e=="function"}function je(e,t,r,o,n,a,i){if(e.length===1&&nr(e[0]))return[{type:M.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var m=l[c];if(nr(m)){s.push({type:M.literal,value:m.value});continue}if(Io(m)){typeof a=="number"&&s.push({type:M.literal,value:r.getNumberFormat(t).format(a)});continue}var g=m.value;if(!(n&&g in n))throw new nn(g,i);var u=n[g];if(Oo(m)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?M.literal:M.object,value:u});continue}if(pt(m)){var x=typeof m.style=="string"?o.date[m.style]:Ge(m.style)?m.style.parsedOptions:void 0;s.push({type:M.literal,value:r.getDateTimeFormat(t,x).format(u)});continue}if(ut(m)){var x=typeof m.style=="string"?o.time[m.style]:Ge(m.style)?m.style.parsedOptions:o.time.medium;s.push({type:M.literal,value:r.getDateTimeFormat(t,x).format(u)});continue}if(mt(m)){var x=typeof m.style=="string"?o.number[m.style]:bt(m.style)?m.style.parsedOptions:void 0;x&&x.scale&&(u=u*(x.scale||1)),s.push({type:M.literal,value:r.getNumberFormat(t,x).format(u)});continue}if(xt(m)){var S=m.children,E=m.value,k=n[E];if(!qa(k))throw new on(E,"function",i);var z=je(S,t,r,o,n,a),W=k(z.map(function($){return $.value}));Array.isArray(W)||(W=[W]),s.push.apply(s,W.map(function($){return{type:typeof $=="string"?M.literal:M.object,value:$}}))}if(gt(m)){var H=m.options[u]||m.options.other;if(!H)throw new gr(m.value,u,Object.keys(m.options),i);s.push.apply(s,je(H.value,t,r,o,n));continue}if(ft(m)){var H=m.options["=".concat(u)];if(!H){if(!Intl.PluralRules)throw new Ve(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,oe.MISSING_INTL_API,i);var Z=r.getPluralRules(t,{type:m.pluralType}).select(u-(m.offset||0));H=m.options[Z]||m.options.other}if(!H)throw new gr(m.value,u,Object.keys(m.options),i);s.push.apply(s,je(H.value,t,r,o,n,u-(m.offset||0)));continue}}return Wa(s)}function Xa(e,t){return t?v(v(v({},e||{}),t||{}),Object.keys(e).reduce(function(r,o){return r[o]=v(v({},e[o]),t[o]||{}),r},{})):e}function Ka(e,t){return t?Object.keys(e).reduce(function(r,o){return r[o]=Xa(e[o],t[o]),r},v({},e)):e}function fr(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Za(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:$e(function(){for(var t,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new((t=Intl.NumberFormat).bind.apply(t,dt([void 0],r,!1)))},{cache:fr(e.number),strategy:vt.variadic}),getDateTimeFormat:$e(function(){for(var t,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new((t=Intl.DateTimeFormat).bind.apply(t,dt([void 0],r,!1)))},{cache:fr(e.dateTime),strategy:vt.variadic}),getPluralRules:$e(function(){for(var t,r=[],o=0;o<arguments.length;o++)r[o]=arguments[o];return new((t=Intl.PluralRules).bind.apply(t,dt([void 0],r,!1)))},{cache:fr(e.pluralRules),strategy:vt.variadic})}}var an=function(){function e(t,r,o,n){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(i){var s=a.formatToParts(i);if(s.length===1)return s[0].value;var c=s.reduce(function(l,m){return!l.length||m.type!==M.literal||typeof l[l.length-1]!="string"?l.push(m.value):l[l.length-1]+=m.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(i){return je(a.ast,a.locales,a.formatters,a.formats,i,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:n?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Ka(e.formats,o),this.formatters=n&&n.formatters||Za(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=en,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var sn=an;var Qa=/[0-9\-+#]/,Ja=/[^\d\-+#]/g;function cn(e){return e.search(Qa)}function ei(e="#.##"){let t={},r=e.length,o=cn(e);t.prefix=o>0?e.substring(0,o):"";let n=cn(e.split("").reverse().join("")),a=r-n,i=e.substring(a,a+1),s=a+(i==="."||i===","?1:0);t.suffix=n>0?e.substring(s,r):"",t.mask=e.substring(o,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Ja);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function ti(e,t,r){let o=!1,n={value:e};e<0&&(o=!0,n.value=-n.value),n.sign=o?"-":"",n.value=Number(n.value).toFixed(t.fraction&&t.fraction.length),n.value=Number(n.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[i="0",s=""]=n.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),n.integer=i,n.fraction=s,ri(n,t),(n.result==="0"||n.result==="")&&(o=!1,n.sign=""),!o&&t.maskHasPositiveSign?n.sign="+":o&&t.maskHasPositiveSign?n.sign="-":o&&(n.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),n}function ri(e,t){e.result="";let r=t.integer.split(t.separator),o=r.join(""),n=o&&o.indexOf("0");if(n>-1)for(;e.integer.length<o.length-n;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let i=e.integer.length,s=i%a;for(let c=0;c<i;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<i-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function oi(e,t,r={}){if(!e||isNaN(Number(t)))return t;let o=ei(e),n=ti(t,o,r);return o.prefix+n.sign+n.result+o.suffix}var ln=oi;var hn=".",ni=",",mn=/^\s+/,pn=/\s+$/,dn="&nbsp;",xr=e=>e*12,un=(e,t)=>{let{start:r,end:o,displaySummary:{amount:n,duration:a,minProductQuantity:i,outcomeType:s}={}}=e;if(!(n&&a&&s&&i))return!1;let c=t?new Date(t):new Date;if(!r||!o)return!1;let l=new Date(r),m=new Date(o);return c>=l&&c<=m},ne={MONTH:"MONTH",YEAR:"YEAR"},ai={[C.ANNUAL]:12,[C.MONTHLY]:1,[C.THREE_YEARS]:36,[C.TWO_YEARS]:24},br=(e,t)=>({accept:e,round:t}),ii=[br(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),br(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),br(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],vr={[N.YEAR]:{[C.MONTHLY]:ne.MONTH,[C.ANNUAL]:ne.YEAR},[N.MONTH]:{[C.MONTHLY]:ne.MONTH}},si=(e,t)=>e.indexOf(`'${t}'`)===0,ci=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),o=fn(r);return!!o?t||(r=r.replace(/[,\.]0+/,o)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+hi(e)),r},li=e=>{let t=di(e),r=si(e,t),o=e.replace(/'.*?'/,""),n=mn.test(o)||pn.test(o);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:n}},gn=e=>e.replace(mn,dn).replace(pn,dn),hi=e=>e.match(/#(.?)#/)?.[1]===hn?ni:hn,di=e=>e.match(/'(.*?)'/)?.[1]??"",fn=e=>e.match(/0(.?)0/)?.[1]??"";function Te({formatString:e,price:t,usePrecision:r,isIndianPrice:o=!1},n,a=i=>i){let{currencySymbol:i,isCurrencyFirst:s,hasCurrencySpace:c}=li(e),l=r?fn(e):"",m=ci(e,r),g=r?2:0,u=a(t,{currencySymbol:i}),x=o?u.toLocaleString("hi-IN",{minimumFractionDigits:g,maximumFractionDigits:g}):ln(m,u),S=r?x.lastIndexOf(l):x.length,E=x.substring(0,S),k=x.substring(S+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,x).replace(/SYMBOL/,i),currencySymbol:i,decimals:k,decimalsDelimiter:l,hasCurrencySpace:c,integer:E,isCurrencyFirst:s,recurrenceTerm:n}}var xn=e=>{let{commitment:t,term:r,usePrecision:o}=e,n=ai[r]??1;return Te(e,n>1?ne.MONTH:vr[t]?.[r],a=>{let i={divisor:n,price:a,usePrecision:o},{round:s}=ii.find(({accept:c})=>c(i));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(i)}`);return s(i)})},bn=({commitment:e,term:t,...r})=>Te(r,vr[e]?.[t]),vn=e=>{let{commitment:t,instant:r,price:o,originalPrice:n,priceWithoutDiscount:a,promotion:i,quantity:s=1,term:c}=e;if(t===N.YEAR&&c===C.MONTHLY){if(!i)return Te(e,ne.YEAR,xr);let{displaySummary:{outcomeType:l,duration:m,minProductQuantity:g=1}={}}=i;switch(l){case"PERCENTAGE_DISCOUNT":if(s>=g&&un(i,r)){let u=parseInt(m.replace("P","").replace("M",""));if(isNaN(u))return xr(o);let x=s*n*u,S=s*a*(12-u),E=Math.floor((x+S)*100)/100;return Te({...e,price:E},ne.YEAR)}default:return Te(e,ne.YEAR,()=>xr(a??o))}}return Te(e,vr[t]?.[c])};var mi={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at",strikethroughAriaLabel:"Regularly at"},pi=Po("ConsonantTemplates/price"),ui=/<\/?[^>]+(>|$)/g,R={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAlternative:"price-alternative",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},_e={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel",alternativePriceAriaLabel:"alternativePriceAriaLabel"},gi="TAX_EXCLUSIVE",fi=e=>_o(e)?Object.entries(e).filter(([,t])=>Be(t)||tr(t)||t===!0).reduce((t,[r,o])=>t+` ${r}${o===!0?"":'="'+Ao(o)+'"'}`,""):"",O=(e,t,r,o=!1)=>`<span class="${e}${t?"":" "+R.disabled}"${fi(r)}>${o?gn(t):t??""}</span>`;function xi(e,{accessibleLabel:t,altAccessibleLabel:r,currencySymbol:o,decimals:n,decimalsDelimiter:a,hasCurrencySpace:i,integer:s,isCurrencyFirst:c,recurrenceLabel:l,perUnitLabel:m,taxInclusivityLabel:g},u={}){let x=O(R.currencySymbol,o),S=O(R.currencySpace,i?"&nbsp;":""),E="";return t?E=`<sr-only class="strikethrough-aria-label">${t}</sr-only>`:r&&(E=`<sr-only class="alt-aria-label">${r}</sr-only>`),c&&(E+=x+S),E+=O(R.integer,s),E+=O(R.decimalsDelimiter,a),E+=O(R.decimals,n),c||(E+=S+x),E+=O(R.recurrence,l,null,!0),E+=O(R.unitType,m,null,!0),E+=O(R.taxInclusivity,g,!0),O(e,E,{...u})}var I=({isAlternativePrice:e=!1,displayOptical:t=!1,displayStrikethrough:r=!1,displayAnnual:o=!1,instant:n=void 0}={})=>({country:a,displayFormatted:i=!0,displayRecurrence:s=!0,displayPerUnit:c=!1,displayTax:l=!1,language:m,literals:g={},quantity:u=1}={},{commitment:x,offerSelectorIds:S,formatString:E,price:k,priceWithoutDiscount:z,taxDisplay:W,taxTerm:H,term:Z,usePrecision:$,promotion:ce}={},Ne={})=>{Object.entries({country:a,formatString:E,language:m,price:k}).forEach(([Ct,Rt])=>{if(Rt==null)throw new Error(`Argument "${Ct}" is missing for osi ${S?.toString()}, country ${a}, language ${m}`)});let Fn={...mi,...g},$n=`${m.toLowerCase()}-${a.toUpperCase()}`;function ke(Ct,Rt){let Mt=Fn[Ct];if(Mt==null)return"";try{return new sn(Mt.replace(ui,""),$n).format(Rt)}catch{return pi.error("Failed to format literal:",Mt),""}}let Vn=r&&z?z:k,Or=t?xn:bn;o&&(Or=vn);let{accessiblePrice:Rs,recurrenceTerm:Ir,...Hr}=Or({commitment:x,formatString:E,instant:n,isIndianPrice:a==="IN",originalPrice:k,priceWithoutDiscount:z,price:t?k:Vn,promotion:ce,quantity:u,term:Z,usePrecision:$}),At="",Tt="",_t="";B(s)&&Ir&&(_t=ke(_e.recurrenceLabel,{recurrenceTerm:Ir}));let Pt="";B(c)&&(Pt=ke(_e.perUnitLabel,{perUnit:"LICENSE"}));let Lt="";B(l)&&H&&(Lt=ke(W===gi?_e.taxExclusiveLabel:_e.taxInclusiveLabel,{taxTerm:H})),r&&(At=ke(_e.strikethroughAriaLabel,{strikethroughPrice:At})),e&&(Tt=ke(_e.alternativePriceAriaLabel,{alternativePrice:Tt}));let le=R.container;if(t&&(le+=" "+R.containerOptical),r&&(le+=" "+R.containerStrikethrough),e&&(le+=" "+R.containerAlternative),o&&(le+=" "+R.containerAnnual),B(i))return xi(le,{...Hr,accessibleLabel:At,altAccessibleLabel:Tt,recurrenceLabel:_t,perUnitLabel:Pt,taxInclusivityLabel:Lt},Ne);let{currencySymbol:Br,decimals:jn,decimalsDelimiter:Yn,hasCurrencySpace:Dr,integer:Wn,isCurrencyFirst:qn}=Hr,he=[Wn,Yn,jn];qn?(he.unshift(Dr?"\xA0":""),he.unshift(Br)):(he.push(Dr?"\xA0":""),he.push(Br)),he.push(_t,Pt,Lt);let Xn=he.join("");return O(le,Xn,Ne)},yn=()=>(e,t,r)=>{let n=(e.displayOldPrice===void 0||B(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${I({isAlternativePrice:n})(e,t,r)}${n?"&nbsp;"+I({displayStrikethrough:!0})(e,t,r):""}`},En=()=>(e,t,r)=>{let{instant:o}=e;try{o||(o=new URLSearchParams(document.location.search).get("instant")),o&&(o=new Date(o))}catch{o=void 0}let n={...e,displayTax:!1,displayPerUnit:!1},i=(e.displayOldPrice===void 0||B(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${i?I({displayStrikethrough:!0})(n,t,r)+"&nbsp;":""}${I({isAlternativePrice:i})(e,t,r)}${O(R.containerAnnualPrefix,"&nbsp;(")}${I({displayAnnual:!0,instant:o})(n,t,r)}${O(R.containerAnnualSuffix,")")}`},wn=()=>(e,t,r)=>{let o={...e,displayTax:!1,displayPerUnit:!1};return`${I({isAlternativePrice:e.displayOldPrice})(e,t,r)}${O(R.containerAnnualPrefix,"&nbsp;(")}${I({displayAnnual:!0})(o,t,r)}${O(R.containerAnnualSuffix,")")}`};var bi=I(),vi=yn(),yi=I({displayOptical:!0}),Ei=I({displayStrikethrough:!0}),wi=I({displayAnnual:!0}),Si=I({displayOptical:!0,isAlternativePrice:!0}),Ai=I({isAlternativePrice:!0}),Ti=wn(),_i=En();var Pi=(e,t)=>{if(!(!Ue(e)||!Ue(t)))return Math.floor((t-e)/t*100)},Sn=()=>(e,t)=>{let{price:r,priceWithoutDiscount:o}=t,n=Pi(r,o);return n===void 0?'<span class="no-discount"></span>':`<span class="discount">${n}%</span>`};var Li=Sn();var{freeze:Ye}=Object,ki={V2:"UCv2",V3:"UCv3"},yr=Ye({...ki}),Oi={CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"},Er=Ye({...Oi}),wr={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},_p=Ye({...N}),Pp=Ye({...ko}),Lp=Ye({...C});var ae={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals","element"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},An=1e3;function Ii(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Tn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:o,originatingRequest:n,status:a}=e;return[o,a,n].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ae.serializableTypes.includes(r))return r}return e}function Hi(e,t){if(!ae.ignoredProperties.includes(e))return Tn(t)}var Sr={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,o=[],n=[],a=t;r.forEach(l=>{l!=null&&(Ii(l)?o:n).push(l)}),o.length&&(a+=" "+o.map(Tn).join(" "));let{pathname:i,search:s}=window.location,c=`${ae.delimiter}page=${i}${s}`;c.length>An&&(c=`${c.slice(0,An)}<trunc>`),a+=c,n.length&&(a+=`${ae.delimiter}facts=`,a+=JSON.stringify(n,Hi)),window.lana?.log(a,ae)}};function _n(e){Object.assign(ae,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ae&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Bi=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:yr.V3,checkoutWorkflowStep:Er.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:wr.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,alternativePrice:!1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Bt.PUBLISHED});var Pn="mas-commerce-service";function Ln(e,{once:t=!1}={}){let r=null;function o(){let n=document.querySelector(Pn);n!==r&&(r=n,n&&e(n))}return document.addEventListener(kt,o,{once:t}),Di(o),()=>document.removeEventListener(kt,o)}var Di=e=>window.setTimeout(e);function Cn(){return document.getElementsByTagName(Pn)?.[0]}var Ar=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});var Tr={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},_r=new Set,Pr=new Set,Rn=new Map,Mn={append({level:e,message:t,params:r,timestamp:o,source:n}){console[e](`${o}ms [${n}] %c${t}`,"font-weight: bold;",...r)}},Nn={filter:({level:e})=>e!==Tr.DEBUG},Ui={filter:()=>!1};function zi(e,t,r,o,n){return{level:e,message:t,namespace:r,get params(){return o.length===1&&De(o[0])&&(o=o[0](),Array.isArray(o)||(o=[o])),o},source:n,timestamp:performance.now().toFixed(3)}}function Gi(e){[...Pr].every(t=>t(e))&&_r.forEach(t=>t(e))}function kn(e){let t=(Rn.get(e)??0)+1;Rn.set(e,t);let r=`${e} #${t}`,o={id:r,namespace:e,module:n=>kn(`${o.namespace}/${n}`),updateConfig:_n};return Object.values(Tr).forEach(n=>{o[n]=(a,...i)=>Gi(zi(n,a,e,i,r))}),Object.seal(o)}function yt(...e){e.forEach(t=>{let{append:r,filter:o}=t;De(o)&&Pr.add(o),De(r)&&_r.add(r)})}function Fi(e={}){let{name:t}=e,r=B(Ae("commerce.debug",{search:!0,storage:!0}),t===Ar.LOCAL);return yt(r?Mn:Nn),t===Ar.PROD&&yt(Sr),We}function $i(){_r.clear(),Pr.clear()}var We={...kn(Qr),Level:Tr,Plugins:{consoleAppender:Mn,debugFilter:Nn,quietFilter:Ui,lanaAppender:Sr},init:Fi,reset:$i,use:yt};var qe=class e extends Error{constructor(t,r,o){if(super(t,{cause:o}),this.name="MasError",r.response){let n=r.response.headers?.get(Jr);n&&(r.requestId=n),r.response.status&&(r.status=r.response.status,r.statusText=r.response.statusText),r.response.url&&(r.url=r.response.url)}delete r.response,this.context=r,Error.captureStackTrace&&Error.captureStackTrace(this,e)}toString(){let t=Object.entries(this.context||{}).map(([o,n])=>`${o}: ${JSON.stringify(n)}`).join(", "),r=`${this.name}: ${this.message}`;return t&&(r+=` (${t})`),this.cause&&(r+=`
Caused by: ${this.cause}`),r}};async function On(e,t={},r=2,o=100){let n;for(let a=0;a<=r;a++)try{return await fetch(e,t)}catch(i){if(n=i,a>r)break;await new Promise(s=>setTimeout(s,o*(a+1)))}throw n}var Bn=new CSSStyleSheet;Bn.replaceSync(":host { display: contents; }");var In="fragment",Hn="author",Et="aem-fragment";async function Vi(e,t,r){let o=`${Et}:${t}${to}`,n;try{if(n=await On(e,{cache:"default",credentials:"omit"}),!n?.ok){let{startTime:a,duration:i}=performance.measure(o,r);throw new qe("Unexpected fragment response",{response:n,startTime:a,duration:i})}return n.json()}catch{let{startTime:i,duration:s}=performance.measure(o,r);throw n||(n={url:e}),new qe("Failed to fetch fragment",{response:n,startTime:i,duration:s,...st()})}}var j,Lr=class{constructor(){P(this,j,new Map)}clear(){f(this,j).clear()}addByRequestedId(t,r){f(this,j).set(t,r)}add(...t){t.forEach(r=>{let{id:o}=r;o&&f(this,j).set(o,r)})}has(t){return f(this,j).has(t)}get(t){return f(this,j).get(t)}remove(t){f(this,j).delete(t)}};j=new WeakMap;var Xe=new Lr,wt,F,Y,Pe,Le,Ke,U,Ce,ie,Ze,Qe,Rr,Cr=class extends HTMLElement{constructor(){super();P(this,Qe);p(this,"cache",Xe);P(this,wt,We.module(Et));P(this,F,null);P(this,Y,null);P(this,Pe,!1);P(this,Le,null);P(this,Ke,null);P(this,U);P(this,Ce);P(this,ie);P(this,Ze,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Bn]}static get observedAttributes(){return[In,Hn]}attributeChangedCallback(r,o,n){r===In&&L(this,U,n),r===Hn&&L(this,Ze,["","true"].includes(n))}connectedCallback(){if(!f(this,U)){V(this,Qe,Rr).call(this,{message:"Missing fragment id"});return}L(this,Le,`${Et}:${f(this,U)}${Ie}`),performance.mark(f(this,Le)),L(this,Ce,new Promise((r,o)=>{this.dispose=Ln(n=>this.activate(n,r,o))}))}async activate(r,o,n){L(this,Ke,r),this.refresh(!1).then(a=>o(a)).catch(a=>n(a))}async refresh(r=!0){if(!(f(this,ie)&&!await Promise.race([f(this,ie),Promise.resolve(!1)])))return r&&Xe.remove(f(this,U)),L(this,ie,this.fetchData().then(()=>{let{references:o,referencesTree:n,placeholders:a}=f(this,F)||{};return this.dispatchEvent(new CustomEvent(me,{detail:{...this.data,stale:f(this,Pe),references:o,referencesTree:n,placeholders:a},bubbles:!0,composed:!0})),!0}).catch(o=>f(this,F)?(Xe.addByRequestedId(f(this,U),f(this,F)),!0):(L(this,Ce,null),V(this,Qe,Rr).call(this,o),!1))),f(this,ie)}async fetchData(){this.classList.remove("error"),L(this,Y,null);let r=Xe.get(f(this,U));if(r){L(this,F,r);return}L(this,Pe,!0);let{masIOUrl:o,wcsApiKey:n,locale:a}=f(this,Ke).settings,i=`${o}/fragment?id=${f(this,U)}&api_key=${n}&locale=${a}`;r=await Vi(i,f(this,U),f(this,Le)),Xe.addByRequestedId(f(this,U),r),L(this,F,r),L(this,Pe,!1)}get updateComplete(){return f(this,Ce)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return f(this,Y)?f(this,Y):(f(this,Ze)?this.transformAuthorData():this.transformPublishData(),f(this,Y))}transformAuthorData(){let{fields:r,id:o,tags:n}=f(this,F);L(this,Y,r.reduce((a,{name:i,multiple:s,values:c})=>(a.fields[i]=s?c:c[0],a),{fields:{},id:o,tags:n}))}transformPublishData(){let{fields:r,id:o,tags:n}=f(this,F);L(this,Y,Object.entries(r).reduce((a,[i,s])=>(a.fields[i]=s?.mimeType?s.value:s??"",a),{fields:{},id:o,tags:n}))}};wt=new WeakMap,F=new WeakMap,Y=new WeakMap,Pe=new WeakMap,Le=new WeakMap,Ke=new WeakMap,U=new WeakMap,Ce=new WeakMap,ie=new WeakMap,Ze=new WeakMap,Qe=new WeakSet,Rr=function({message:r,context:o}){this.classList.add("error"),f(this,wt).error(`aem-fragment: ${r}`,o),this.dispatchEvent(new CustomEvent(pe,{detail:{message:r,...o},bubbles:!0,composed:!0}))};customElements.define(Et,Cr);import{LitElement as ji,html as Yi,css as Wi}from"../lit-all.min.js";var Re=class extends ji{constructor(){super(),this.color="",this.variant="",this.backgroundColor="",this.borderColor=""}connectedCallback(){this.borderColor&&this.borderColor!=="Transparent"?this.style.setProperty("--merch-badge-border",`1px solid var(--${this.borderColor})`):this.style.setProperty("--merch-badge-border",`1px solid var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-background-color",`var(--${this.backgroundColor})`),this.style.setProperty("--merch-badge-color",this.color),this.style.setProperty("--merch-badge-padding","2px 10px 3px 10px"),this.style.setProperty("--merch-badge-border-radius","4px 0 0 4px"),this.style.setProperty("--merch-badge-font-size","var(--consonant-merch-card-body-xs-font-size)"),this.variant==="plans"&&this.style.setProperty("border-right","none"),super.connectedCallback()}render(){return Yi`<div class="plans-badge">
            ${this.textContent}
        </div>`}};p(Re,"properties",{color:{type:String},variant:{type:String},backgroundColor:{type:String,attribute:"background-color"},borderColor:{type:String,attribute:"border-color"}}),p(Re,"styles",Wi`
        :host {
            display: block;
            background-color: var(--merch-badge-background-color);
            color: var(--merch-badge-color, #000);
            padding: var(--merch-badge-padding);
            border-radius: var(--merch-badge-border-radius);
            font-size: var(--merch-badge-font-size);
            line-height: 21px;
            border: var(--merch-badge-border);
        }
    `);customElements.define("merch-badge",Re);import{html as qi,css as Xi,LitElement as Ki}from"../lit-all.min.js";var Je=class extends Ki{constructor(){super()}render(){return qi`
            <slot name="icon"></slot>
            <slot name="description">${this.description}</slot>
        `}};p(Je,"styles",Xi`
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
    `),p(Je,"properties",{description:{type:String,attribute:!0}});customElements.define("merch-mnemonic-list",Je);import{html as Mr,css as Zi,LitElement as Qi}from"../lit-all.min.js";var et=class extends Qi{updated(){this.hideSeeMoreEls()}hideSeeMoreEls(){this.isMobile&&this.rows.forEach((t,r)=>{r>=5&&(t.style.display=this.showAll?"flex":"none")})}constructor(){super(),this.showAll=!1,this.mobileRows=this.mobileRows===void 0?5:this.mobileRows}toggle(){this.showAll=!this.showAll,this.dispatchEvent(new CustomEvent("hide-see-more-elements",{bubbles:!0,composed:!0})),this.requestUpdate()}render(){return Mr`<slot name="heading"></slot>
            <slot name="content"></slot>
            ${this.isMobile&&this.rows.length>this.mobileRows?Mr`<div @click=${this.toggle} class="see-more">
                      ${this.showAll?"- See less":"+ See more"}
                  </div>`:Mr``}`}get isMobile(){return window.matchMedia("(max-width: 767px)").matches}get rows(){return this.querySelectorAll("merch-mnemonic-list")}};p(et,"styles",Zi`
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
    `),p(et,"properties",{heading:{type:String,attribute:!0},mobileRows:{type:Number,attribute:!0}});customElements.define("merch-whats-included",et);function Ji(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var tt,se=class se extends HTMLAnchorElement{constructor(){super();P(this,tt,!1);this.setAttribute("is",se.is)}get isUptLink(){return!0}initializeWcsData(r,o){this.setAttribute("data-wcs-osi",r),o&&this.setAttribute("data-promotion-code",o),L(this,tt,!0),this.composePromoTermsUrl()}attributeChangedCallback(r,o,n){f(this,tt)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let r=this.getAttribute("data-wcs-osi");if(!r){let g=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${g}`);return}let o=Cn(),n=[r],a=this.getAttribute("data-promotion-code"),{country:i,language:s,env:c}=o.settings,l={country:i,language:s,wcsOsi:n,promotionCode:a},m=o.resolveOfferSelectors(l);Promise.all(m).then(([[g]])=>{let u=`locale=${s}_${i}&country=${i}&offer_id=${g.offerId}`;a&&(u+=`&promotion_code=${encodeURIComponent(a)}`),this.href=`${Ji(c)}?${u}`}).catch(g=>{console.error(`Could not resolve offer selectors for id: ${r}.`,g.message)})}static createFrom(r){let o=new se;for(let n of r.attributes)n.name!=="is"&&(n.name==="class"&&n.value.includes("upt-link")?o.setAttribute("class",n.value.replace("upt-link","").trim()):o.setAttribute(n.name,n.value));return o.innerHTML=r.innerHTML,o.setAttribute("tabindex",0),o}};tt=new WeakMap,p(se,"is","upt-link"),p(se,"tag","a"),p(se,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var q=se;window.customElements.get(q.is)||window.customElements.define(q.is,q,{extends:q.tag});var es="#000000",Dn="spectrum-yellow-300-plans",Un="#F8D904",ts="#EAEAEA",rs=/(accent|primary|secondary)(-(outline|link))?/,os="mas:product_code/",ns="daa-ll",rt="daa-lh",as=["XL","L","M","S"],Nr="...";function X(e,t,r,o){let n=o[e];if(t[e]&&n){let a={slot:n?.slot},i=t[e];if(n.maxCount&&typeof i=="string"){let[c,l]=xs(i,n.maxCount,n.withSuffix);c!==i&&(a.title=l,i=c)}let s=Q(n.tag,a,i);r.append(s)}}function is(e,t,r){e.mnemonicIcon?.map((n,a)=>({icon:n,alt:e.mnemonicAlt[a]??"",link:e.mnemonicLink[a]??""}))?.forEach(({icon:n,alt:a,link:i})=>{if(i&&!/^https?:/.test(i))try{i=new URL(`https://${i}`).href.toString()}catch{i="#"}let s={slot:"icons",src:n,loading:t.loading,size:r?.size??"l"};a&&(s.alt=a),i&&(s.href=i);let c=Q("merch-icon",s);t.append(c)})}function ss(e,t,r){if(e.variant==="plans"){e.badge?.length&&!e.badge?.startsWith("<merch-badge")&&(e.badge=`<merch-badge variant="${e.variant}" background-color="${Dn}">${e.badge}</merch-badge>`,e.borderColor||(e.borderColor=Dn)),X("badge",e,t,r);return}e.badge?(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||es),t.setAttribute("badge-background-color",e.badgeBackgroundColor||Un),t.setAttribute("border-color",e.badgeBackgroundColor||Un)):t.setAttribute("border-color",e.borderColor||ts)}function cs(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function ls(e,t,r){X("cardTitle",e,t,{cardTitle:r})}function hs(e,t,r){X("subtitle",e,t,r)}function ds(e,t,r){if(!e.backgroundColor||e.backgroundColor.toLowerCase()==="default"){t.style.removeProperty("--merch-card-custom-background-color"),t.removeAttribute("background-color");return}r?.[e.backgroundColor]&&(t.style.setProperty("--merch-card-custom-background-color",`var(${r[e.backgroundColor]})`),t.setAttribute("background-color",e.backgroundColor))}function ms(e,t,r){let o="--merch-card-custom-border-color";e.borderColor?.toLowerCase()==="transparent"?(t.style.removeProperty(o),e.variant==="plans"&&t.style.setProperty(o,"transparent")):e.borderColor&&r&&(/-gradient/.test(e.borderColor)?(t.setAttribute("gradient-border","true"),t.style.removeProperty(o)):t.style.setProperty(o,`var(--${e.borderColor})`))}function ps(e,t,r){if(e.backgroundImage){let o={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?o.alt=e.backgroundImageAltText:o.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.append(Q(r.tag,{slot:r.slot},Q("img",o)))}}function us(e,t,r){X("prices",e,t,r)}function gs(e,t,r){X("promoText",e,t,r),X("description",e,t,r),X("callout",e,t,r),X("quantitySelect",e,t,r)}function fs(e,t,r,o){e.showStockCheckbox&&r.stockOffer&&(t.setAttribute("checkbox-label",o.stockCheckboxLabel),t.setAttribute("stock-offer-osis",o.stockOfferOsis)),o.secureLabel&&r.secureLabel&&t.setAttribute("secure-label",o.secureLabel)}function xs(e,t,r=!0){try{let o=typeof e!="string"?"":e,n=zn(o);if(n.length<=t)return[o,n];let a=0,i=!1,s=r?t-Nr.length<1?1:t-Nr.length:t,c=[];for(let g of o){if(a++,g==="<")if(i=!0,o[a]==="/")c.pop();else{let u="";for(let x of o.substring(a)){if(x===" "||x===">")break;u+=x}c.push(u)}if(g==="/"&&o[a]===">"&&c.pop(),g===">"){i=!1;continue}if(!i&&(s--,s===0))break}let l=o.substring(0,a).trim();if(c.length>0){c[0]==="p"&&c.shift();for(let g of c.reverse())l+=`</${g}>`}return[`${l}${r?Nr:""}`,n]}catch{let n=typeof e=="string"?e:"",a=zn(n);return[n,a]}}function zn(e){if(!e)return"";let t="",r=!1;for(let o of e){if(o==="<"&&(r=!0),o===">"){r=!1;continue}r||(t+=o)}return t}function bs(e,t){t.querySelectorAll("a.upt-link").forEach(o=>{let n=q.createFrom(o);o.replaceWith(n),n.initializeWcsData(e.osi,e.promoCode)})}function vs(e,t,r,o){let a=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);a.setAttribute("tabindex",0);for(let m of e.attributes)["class","is"].includes(m.name)||a.setAttribute(m.name,m.value);a.firstElementChild?.classList.add("spectrum-Button-label");let i=t.ctas.size??"M",s=`spectrum-Button--${o}`,c=as.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",l=["spectrum-Button",s,c];return r&&l.push("spectrum-Button--outline"),a.classList.add(...l),a}function ys(e,t,r,o){let a=customElements.get("checkout-button").createCheckoutButton(e.dataset);e.dataset.analyticsId&&a.setAttribute("data-analytics-id",e.dataset.analyticsId),a.connectedCallback(),a.render();let i="fill";r&&(i="outline");let s=Q("sp-button",{treatment:i,variant:o,tabIndex:0,size:t.ctas.size??"m",...e.dataset.analyticsId&&{"data-analytics-id":e.dataset.analyticsId}},e.innerHTML);return s.source=a,a.onceSettled().then(c=>{s.setAttribute("data-navigation-url",c.href)}),s.addEventListener("click",c=>{c.defaultPrevented||a.click()}),s}function Es(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function ws(e,t,r,o){if(e.ctas){let{slot:n}=r.ctas,a=Q("div",{slot:n},e.ctas),i=[...a.querySelectorAll("a")].map(s=>{let c=rs.exec(s.className)?.[0]??"accent",l=c.includes("accent"),m=c.includes("primary"),g=c.includes("secondary"),u=c.includes("-outline"),x=c.includes("-link");if(t.consonant)return Es(s,l);if(x)return s;let S;return l?S="accent":m?S="primary":g&&(S="secondary"),t.spectrum==="swc"?ys(s,r,u,S):vs(s,r,u,S)});a.innerHTML="",a.append(...i),t.append(a)}}function Ss(e,t){let{tags:r}=e,o=r?.find(a=>a.startsWith(os))?.split("/").pop();if(!o)return;t.setAttribute(rt,o),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((a,i)=>{a.setAttribute(ns,`${a.dataset.analyticsId}-${i+1}`)})}function As(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(o=>{o.classList.remove(t),o.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}function Ts(e){e.querySelectorAll("[slot]").forEach(o=>{o.remove()}),["checkbox-label","stock-offer-osis","secure-label","background-image","background-color","border-color","badge-background-color","badge-color","badge-text","size",rt].forEach(o=>e.removeAttribute(o));let r=["wide-strip","thin-strip"];e.classList.remove(...r)}async function Gn(e,t){let{id:r,fields:o}=e,{variant:n}=o;if(!n)throw new Error(`hydrate: no variant found in payload ${r}`);let a={stockCheckboxLabel:"Add a 30-day free trial of Adobe Stock.*",stockOfferOsis:"",secureLabel:"Secure transaction"};Ts(t),t.id??(t.id=e.id),t.removeAttribute("background-image"),t.removeAttribute("background-color"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.removeAttribute("gradient-border"),t.classList.remove("wide-strip"),t.classList.remove("thin-strip"),t.removeAttribute(rt),t.variant=n,await t.updateComplete;let{aemFragmentMapping:i}=t.variantLayout;if(!i)throw new Error(`hydrate: aemFragmentMapping found for ${r}`);i.style==="consonant"&&t.setAttribute("consonant",!0),is(o,t,i.mnemonics),ss(o,t,i),cs(o,t,i.size),ls(o,t,i.title),hs(o,t,i),us(o,t,i),ps(o,t,i.backgroundImage),ds(o,t,i.allowedColors),ms(o,t,i.borderColor),gs(o,t,i),fs(o,t,i,a),bs(o,t),ws(o,t,i,n),Ss(o,t),As(t)}var Ps="merch-card",Ls=":ready",Cs=":error",kr=2e4,St="merch-card:",K,Me,d=class extends _s{constructor(){super();P(this,K);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");p(this,"log");p(this,"readyEventDispatched",!1);this.id=null,this.failed=!1,this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this),this.log=We.module("merch-card")}static getFragmentMapping(r){return yo[r]}firstUpdated(){this.variantLayout=Xt(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(r=>{V(this,K,Me).call(this,r,{},!1),this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=Xt(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested","ah-promoted-plans"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector(Ot)}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll(at)??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let o=this.checkoutLinks;if(o.length!==0)for(let n of o){await n.onceSettled();let a=n.value?.[0]?.planType;if(!a)return;let i=this.stockOfferOsis[a];if(!i)return;let s=n.dataset.wcsOsi.split(",").filter(c=>c!==i);r.checked&&s.push(i),n.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let o=this.checkoutLinks;for(let n of o)n.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let o={...this.filters};Object.keys(o).forEach(n=>{if(r){o[n].order=Math.min(o[n].order||2,2);return}let a=o[n].order;a===1||isNaN(a)||(o[n].order=Number(a)+1)}),this.filters=o}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),this.id??(this.id=this.querySelector("aem-fragment")?.getAttribute("fragment")),performance.mark(`${St}${this.id}${Ie}`),this.addEventListener(Ht,this.handleQuantitySelection),this.addEventListener(Wr,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(pe,this.handleAemFragmentEvents),this.addEventListener(me,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Ht,this.handleQuantitySelection),this.storageOptions?.removeEventListener(It,this.handleStorageChange),this.removeEventListener(pe,this.handleAemFragmentEvents),this.removeEventListener(me,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===pe&&V(this,K,Me).call(this,`AEM fragment cannot be loaded: ${r.detail.message}`,r.detail),r.type===me&&r.target.nodeName==="AEM-FRAGMENT"){let o=r.detail;Gn(o,this).then(()=>this.checkReady()).catch(n=>this.log?.error(n))}}async checkReady(){let r=new Promise(i=>setTimeout(()=>i("timeout"),kr));if(this.aemFragment){let i=await Promise.race([this.aemFragment.updateComplete,r]);if(i===!1){let s=i==="timeout"?`AEM fragment was not resolved within ${kr} timeout`:"AEM fragment cannot be loaded";V(this,K,Me).call(this,s,{},!1);return}}let o=[...this.querySelectorAll(Yr)];o.push(...[...this.querySelectorAll(jr)].map(i=>i.source));let n=Promise.all(o.map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(s=>s.classList.contains("placeholder-resolved"))),a=await Promise.race([n,r]);if(a===!0)return performance.mark(`${St}${this.id}${Ls}`),this.readyEventDispatched||(this.readyEventDispatched=!0,this.dispatchEvent(new CustomEvent(Kr,{bubbles:!0,composed:!0}))),this;{let{duration:i,startTime:s}=performance.measure(`${St}${this.id}${Cs}`,`${St}${this.id}${Ie}`),c={duration:i,startTime:s,...st()};a==="timeout"?V(this,K,Me).call(this,`Contains offers that were not resolved within ${kr} timeout`,c):V(this,K,Me).call(this,"Contains unresolved offers",c)}}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let o=this.querySelector(`merch-offer-select[storage="${r}"]`);if(o)return o}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll(at)).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(qr,{bubbles:!0})),this.displayFooterElementsInColumn())}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(It,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let o=this.dynamicPrice;if(r.price&&o){let n=r.price.cloneNode(!0);o.onceSettled?o.onceSettled().then(()=>{o.replaceWith(n)}):o.replaceWith(n)}}};K=new WeakSet,Me=function(r,o={},n=!0){this.log?.error(`merch-card: ${r}`,o),this.failed=!0,n&&this.dispatchEvent(new CustomEvent(Zr,{detail:{...o,message:r},bubbles:!0,composed:!0}))},p(d,"properties",{id:{type:String,attribute:"id",reflect:!0},name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuLabel:{type:String,attribute:"action-menu-label"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},failed:{type:Boolean,attribute:"failed",reflect:!0},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{if(!r)return;let[o,n,a]=r.split(",");return{PUF:o,ABM:n,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(o=>{let[n,a,i]=o.split(":"),s=Number(a);return[n,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:r=>Object.entries(r).map(([o,{order:n,size:a}])=>[o,n,a].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:rt,reflect:!0},loading:{type:String}}),p(d,"styles",[$r,Eo(),...Vr()]);customElements.define(Ps,d);

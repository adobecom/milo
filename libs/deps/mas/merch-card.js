var Vo=Object.defineProperty;var Bo=(e,t,r)=>t in e?Vo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var f=(e,t,r)=>(Bo(e,typeof t!="symbol"?t+"":t,r),r),At=(e,t,r)=>{if(!t.has(e))throw TypeError("Cannot "+r)};var E=(e,t,r)=>(At(e,t,"read from private field"),r?r.call(e):t.get(e)),L=(e,t,r)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,r)},N=(e,t,r,n)=>(At(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r);var j=(e,t,r)=>(At(e,t,"access private method"),r);import{LitElement as ss}from"../lit-all.min.js";import{LitElement as jo,html as Lr,css as Wo}from"../lit-all.min.js";var d=class extends jo{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?Lr`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:Lr` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};f(d,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),f(d,"styles",Wo`
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
    `);customElements.define("merch-icon",d);import{css as Rr,unsafeCSS as Cr}from"../lit-all.min.js";var W="(max-width: 767px)",Ze="(max-width: 1199px)",_="(min-width: 768px)",T="(min-width: 1200px)",U="(min-width: 1600px)";var Nr=Rr`
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
`,Or=()=>[Rr`
        /* Tablet */
        @media screen and ${Cr(_)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${Cr(T)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];import{html as Je}from"../lit-all.min.js";var ue,ke=class ke{constructor(t){f(this,"card");L(this,ue,void 0);this.card=t,this.insertVariantStyle()}getContainer(){return N(this,ue,E(this,ue)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),E(this,ue)}insertVariantStyle(){if(!ke.styleMap[this.card.variant]){ke.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(n))||0;o>a&&this.getContainer().style.setProperty(n,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),Je`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return Je` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?Je`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return Je`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};ue=new WeakMap,f(ke,"styleMap",{});var S=ke;import{html as Ct,css as Yo}from"../lit-all.min.js";function Y(e,t={},r=null,n=null){let o=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[a,i]of Object.entries(t))o.setAttribute(a,i);return o}function et(){return window.matchMedia("(max-width: 767px)").matches}function Mr(){return window.matchMedia("(max-width: 1024px)").matches}var Tt="wcms:commerce:ready";var kr="merch-offer-select:ready",Ir="merch-card:ready",Dr="merch-card:action-menu-toggle";var _t="merch-storage:change",Pt="merch-quantity-selector:change";var pe="aem:load",fe="aem:error",Ur="mas:ready",zr="mas:error",Gr="placeholder-failed",Fr="placeholder-pending",$r="placeholder-resolved";var Hr="mas:failed",Vr="mas:resolved",Br="mas/commerce";var q="failed",J="pending",X="resolved",Lt={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var ge={TWP:"twp",D2P:"d2p",CRM:"crm"};var jr=`
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

@media screen and ${U} {
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
}`;var Rt={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},xe=class extends S{constructor(r){super(r);f(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Dr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});f(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});f(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});f(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")})}get aemFragmentMapping(){return Rt}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Ct` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Mr()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
                        aria-expanded="false"
                        role="button"
                    >Action Menu</div>
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
                ${this.promoBottom?"":Ct`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Ct`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return jr}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard)}};f(xe,"variantStyle",Yo`
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
    `);import{html as Ie}from"../lit-all.min.js";var Wr=`
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
`;var tt=class extends S{constructor(t){super(t)}getGlobalCSS(){return Wr}renderLayout(){return Ie`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?Ie`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:Ie`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?Ie`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:Ie`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as qr}from"../lit-all.min.js";var Yr=`
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

@media screen and ${U} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var rt=class extends S{constructor(t){super(t)}getGlobalCSS(){return Yr}renderLayout(){return qr` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":qr`<hr />`} ${this.secureLabelFooter}`}};import{html as be,css as qo,unsafeCSS as Kr}from"../lit-all.min.js";var Xr=`
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
@media screen and ${W} {
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

@media screen and ${Ze} {
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

@media screen and ${U} {
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
`;var Xo=32,ye=class extends S{constructor(r){super(r);f(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);f(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?be`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:be`<slot name="secure-transaction-label"></slot>`;return be`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Xr}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"] ul')?.children].forEach((n,o)=>{let a=Math.max(Xo,parseFloat(window.getComputedStyle(n).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;a>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}renderLayout(){return be` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?be`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:be`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){et()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};f(ye,"variantStyle",qo`
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

    @media screen and ${Kr(Ze)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Kr(T)} {
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
  `);import{html as Zr,css as Ko}from"../lit-all.min.js";var Qr=`
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-icon-size: 40px;
}

merch-card[variant="plans"] {
  width: 276px;
}

merch-card[variant="plans"] [slot="description"] {
  min-height: 84px;
}

merch-card[variant="plans"] [slot="quantity-select"] {
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: var(--consonant-merch-spacing-xs);
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
  .three-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
  .four-merch-cards.plans {
      grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${U} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var Nt={title:{tag:"p",slot:"heading-xs"},prices:{tag:"p",slot:"heading-m"},promoText:{tag:"p",slot:"promo-text"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},callout:{tag:"div",slot:"callout-content"},stockOffer:!0,secureLabel:!0,ctas:{slot:"footer",size:"m"},style:"consonant"},ve=class extends S{constructor(t){super(t)}get aemFragmentMapping(){return Nt}getGlobalCSS(){return Qr}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?Zr`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return Zr` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="annualPrice"></slot>
            <slot name="priceLabel"></slot>
            <slot name="body-xxs"></slot>
            <slot name="promo-text"></slot>
            <slot name="body-xs"></slot>
            <slot name="callout-content"></slot> 
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};f(ve,"variantStyle",Ko`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Ot,css as Qo}from"../lit-all.min.js";var Jr=`
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
`;var ee=class extends S{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Jr}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Ot` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":Ot`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?Ot`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(et()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};f(ee,"variantStyle",Qo`
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
  `);import{html as Mt,css as Zo}from"../lit-all.min.js";var en=`
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
@media screen and ${W} {
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
`;var Ee=class extends S{constructor(t){super(t)}getGlobalCSS(){return en}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Mt` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Mt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Mt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};f(Ee,"variantStyle",Zo`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as kt,css as Jo}from"../lit-all.min.js";var tn=`
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

@media screen and ${W} {
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

@media screen and ${U} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var It={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},we=class extends S{constructor(t){super(t)}getGlobalCSS(){return tn}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return It}renderLayout(){return kt`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?kt`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:kt`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};f(we,"variantStyle",Jo`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as ea,css as ta}from"../lit-all.min.js";var rn=`
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

@media screen and ${W} {
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

@media screen and ${U} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var Se=class extends S{constructor(t){super(t)}getGlobalCSS(){return rn}renderLayout(){return ea`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};f(Se,"variantStyle",ta`
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
  `);import{html as ra,css as na}from"../lit-all.min.js";var nn=`

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
`;var Dt={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},Ae=class extends S{getGlobalCSS(){return nn}get aemFragmentMapping(){return Dt}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return ra` <div style="${this.stripStyle}" class="body">
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
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};f(Ae,"variantStyle",na`
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
    `);import{html as oa,css as aa}from"../lit-all.min.js";var on=`

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
`;var Ut={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},Te=class extends S{getGlobalCSS(){return on}get aemFragmentMapping(){return Ut}renderLayout(){return oa` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};f(Te,"variantStyle",aa`
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
    `);var zt=(e,t=!1)=>{switch(e.variant){case"catalog":return new xe(e);case"image":return new tt(e);case"inline-heading":return new rt(e);case"mini-compare-chart":return new ye(e);case"plans":return new ve(e);case"product":return new ee(e);case"segment":return new Ee(e);case"special-offers":return new we(e);case"twp":return new Se(e);case"ccd-suggested":return new Ae(e);case"ccd-slice":return new Te(e);default:return t?void 0:new ee(e)}},an={catalog:Rt,image:null,"inline-heading":null,"mini-compare-chart":null,plans:Nt,product:null,segment:null,"special-offers":It,twp:null,"ccd-suggested":Dt,"ccd-slice":Ut},sn=()=>{let e=[];return e.push(xe.variantStyle),e.push(ye.variantStyle),e.push(ee.variantStyle),e.push(ve.variantStyle),e.push(Ee.variantStyle),e.push(we.variantStyle),e.push(Se.variantStyle),e.push(Ae.variantStyle),e.push(Te.variantStyle),e};var cn=document.createElement("style");cn.innerHTML=`
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
    --consonant-merch-card-detail-s-font-size: 11px;
    --consonant-merch-card-detail-s-line-height: 14px;
    --consonant-merch-card-detail-m-font-size: 12px;
    --consonant-merch-card-detail-m-line-height: 15px;
    --consonant-merch-card-detail-m-font-weight: 700;
    --consonant-merch-card-detail-m-letter-spacing: 1px;

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

    /* ccd colors */
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;

    
  
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

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
}

merch-card [slot='callout-content'] .icon-button {
    height: 16px;
    padding: 0;
    border: 0;
    min-inline-size: 16px;
}

merch-card [slot='callout-content'] .icon-button:hover {
    background-color: transparent;
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

`;document.head.appendChild(cn);var mn=new CSSStyleSheet;mn.replaceSync(":host { display: contents; }");var ia=document.querySelector('meta[name="aem-base-url"]')?.content??"https://odin.adobe.com",ln="fragment",hn="author",sa="ims",dn=e=>{throw new Error(`Failed to get fragment: ${e}`)};async function ca(e,t,r,n){let o=r?`${e}/adobe/sites/cf/fragments/${t}`:`${e}/adobe/sites/fragments/${t}`,a=await fetch(o,{cache:"default",credentials:"omit",headers:n}).catch(i=>dn(i.message));return a?.ok||dn(`${a.status} ${a.statusText}`),a.json()}var Gt,K,Ft=class{constructor(){L(this,K,new Map)}clear(){E(this,K).clear()}add(...t){t.forEach(r=>{let{id:n}=r;n&&E(this,K).set(n,r)})}has(t){return E(this,K).has(t)}get(t){return E(this,K).get(t)}remove(t){E(this,K).delete(t)}};K=new WeakMap;var nt=new Ft,te,H,Q,De,V,_e,Ue,Ht,ot,un,at,pn,$t=class extends HTMLElement{constructor(){super();L(this,Ue);L(this,ot);L(this,at);f(this,"cache",nt);L(this,te,void 0);L(this,H,void 0);L(this,Q,void 0);L(this,De,!1);L(this,V,void 0);L(this,_e,!1);this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[mn];let r=this.getAttribute(sa);["",!0,"true"].includes(r)&&(N(this,De,!0),Gt||(Gt={Authorization:`Bearer ${window.adobeid?.authorize?.()}`}))}static get observedAttributes(){return[ln,hn]}attributeChangedCallback(r,n,o){r===ln&&(N(this,Q,o),this.refresh(!1)),r===hn&&N(this,_e,["","true"].includes(o))}connectedCallback(){if(!E(this,Q)){j(this,Ue,Ht).call(this,"Missing fragment id");return}}async refresh(r=!0){E(this,V)&&!await Promise.race([E(this,V),Promise.resolve(!1)])||(r&&nt.remove(E(this,Q)),N(this,V,this.fetchData().then(()=>(this.dispatchEvent(new CustomEvent(pe,{detail:this.data,bubbles:!0,composed:!0})),!0)).catch(n=>(j(this,Ue,Ht).call(this,"Network error: failed to load fragment"),N(this,V,null),!1))),E(this,V))}async fetchData(){N(this,te,null),N(this,H,null);let r=nt.get(E(this,Q));r||(r=await ca(ia,E(this,Q),E(this,_e),E(this,De)?Gt:void 0),nt.add(r)),N(this,te,r)}get updateComplete(){return E(this,V)??Promise.reject(new Error("AEM fragment cannot be loaded"))}get data(){return E(this,H)?E(this,H):(E(this,_e)?j(this,ot,un).call(this):j(this,at,pn).call(this),E(this,H))}};te=new WeakMap,H=new WeakMap,Q=new WeakMap,De=new WeakMap,V=new WeakMap,_e=new WeakMap,Ue=new WeakSet,Ht=function(r){this.classList.add("error"),this.dispatchEvent(new CustomEvent(fe,{detail:r,bubbles:!0,composed:!0}))},ot=new WeakSet,un=function(){let{fields:r,id:n,tags:o}=E(this,te);N(this,H,r.reduce((a,{name:i,multiple:s,values:c})=>(a.fields[i]=s?c:c[0],a),{fields:{},id:n,tags:o}))},at=new WeakSet,pn=function(){let{fields:r,id:n,tags:o}=E(this,te);N(this,H,Object.entries(r).reduce((a,[i,s])=>(a.fields[i]=s?.mimeType?s.value:s??"",a),{fields:{},id:n,tags:o}))};customElements.define("aem-fragment",$t);var Vt;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(Vt||(Vt={}));var O;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(O||(O={}));var P;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(P||(P={}));var Bt;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(Bt||(Bt={}));var jt;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(jt||(jt={}));var Wt;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(Wt||(Wt={}));var Yt;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Yt||(Yt={}));var fn="tacocat.js";var gn=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function Pe(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let a;if(n&&a==null){let i=new URLSearchParams(window.location.search),s=ze(n)?n:e;a=i.get(s)}if(o&&a==null){let i=ze(o)?o:e;a=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(r&&a==null){let i=la(ze(r)?r:e);a=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return a??t[e]}var Le=()=>{};var xn=e=>typeof e=="boolean",Ge=e=>typeof e=="function",qt=e=>typeof e=="number",bn=e=>e!=null&&typeof e=="object";var ze=e=>typeof e=="string";var Fe=e=>qt(e)&&Number.isFinite(e)&&e>0;function D(e,t){if(xn(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function la(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}var ha=Date.now(),Xt=()=>`(+${Date.now()-ha}ms)`,it=new Set,da=D(Pe("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function yn(e){let t=`[${fn}/${e}]`,r=(i,s,...c)=>i?!0:(o(s,...c),!1),n=da?(i,...s)=>{console.debug(`${t} ${i}`,...s,Xt())}:()=>{},o=(i,...s)=>{let c=`${t} ${i}`;it.forEach(([h])=>h(c,...s))};return{assert:r,debug:n,error:o,warn:(i,...s)=>{let c=`${t} ${i}`;it.forEach(([,h])=>h(c,...s))}}}function ma(e,t){let r=[e,t];return it.add(r),()=>{it.delete(r)}}ma((e,...t)=>{console.error(e,...t,Xt())},(e,...t)=>{console.warn(e,...t,Xt())});var vn="ABM",En="PUF",wn="M2M",Sn="PERPETUAL",An="P3Y",ua="TAX_INCLUSIVE_DETAILS",pa="TAX_EXCLUSIVE",Tn={ABM:vn,PUF:En,M2M:wn,PERPETUAL:Sn,P3Y:An},Nh={[vn]:{commitment:O.YEAR,term:P.MONTHLY},[En]:{commitment:O.YEAR,term:P.ANNUAL},[wn]:{commitment:O.MONTH,term:P.MONTHLY},[Sn]:{commitment:O.PERPETUAL,term:void 0},[An]:{commitment:O.THREE_MONTHS,term:P.P3Y}};function Kt(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:a,taxDisplay:i}=t;if(i!==ua)return e;let s={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:a??n,taxDisplay:pa}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Qt=function(e,t){return Qt=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},Qt(e,t)};function $e(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Qt(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var v=function(){return v=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},v.apply(this,arguments)};function st(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,a;n<o;n++)(a||!(n in t))&&(a||(a=Array.prototype.slice.call(t,0,n)),a[n]=t[n]);return e.concat(a||Array.prototype.slice.call(t))}var x;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(x||(x={}));var w;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(w||(w={}));var re;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(re||(re={}));function Zt(e){return e.type===w.literal}function _n(e){return e.type===w.argument}function ct(e){return e.type===w.number}function lt(e){return e.type===w.date}function ht(e){return e.type===w.time}function dt(e){return e.type===w.select}function mt(e){return e.type===w.plural}function Pn(e){return e.type===w.pound}function ut(e){return e.type===w.tag}function pt(e){return!!(e&&typeof e=="object"&&e.type===re.number)}function He(e){return!!(e&&typeof e=="object"&&e.type===re.dateTime)}var Jt=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var fa=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function Ln(e){var t={};return e.replace(fa,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Cn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function Mn(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Cn).filter(function(p){return p.length>0}),r=[],n=0,o=t;n<o.length;n++){var a=o[n],i=a.split("/");if(i.length===0)throw new Error("Invalid number skeleton");for(var s=i[0],c=i.slice(1),h=0,l=c;h<l.length;h++){var u=l[h];if(u.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function ga(e){return e.replace(/^(.*?)-/,"")}var Rn=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,kn=/^(@+)?(\+|#+)?$/g,xa=/(\*)(0+)|(#+)(0+)|(0+)/g,In=/^(0+)$/;function Nn(e){var t={};return e.replace(kn,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function Dn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function ba(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!In.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function On(e){var t={},r=Dn(e);return r||t}function Un(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=ga(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=v(v(v({},t),{notation:"scientific"}),o.options.reduce(function(s,c){return v(v({},s),On(c))},{}));continue;case"engineering":t=v(v(v({},t),{notation:"engineering"}),o.options.reduce(function(s,c){return v(v({},s),On(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(xa,function(s,c,h,l,u,p){if(c)t.minimumIntegerDigits=h.length;else{if(l&&u)throw new Error("We currently do not support maximum integer digits");if(p)throw new Error("We currently do not support exact integer digits")}return""});continue}if(In.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(Rn.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(Rn,function(s,c,h,l,u,p){return h==="*"?t.minimumFractionDigits=c.length:l&&l[0]==="#"?t.maximumFractionDigits=l.length:u&&p?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+p.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""}),o.options.length&&(t=v(v({},t),Nn(o.options[0])));continue}if(kn.test(o.stem)){t=v(v({},t),Nn(o.stem));continue}var a=Dn(o.stem);a&&(t=v(v({},t),a));var i=ba(o.stem);i&&(t=v(v({},t),i))}return t}var er,ya=new RegExp("^"+Jt.source+"*"),va=new RegExp(Jt.source+"*$");function y(e,t){return{start:e,end:t}}var Ea=!!String.prototype.startsWith,wa=!!String.fromCodePoint,Sa=!!Object.fromEntries,Aa=!!String.prototype.codePointAt,Ta=!!String.prototype.trimStart,_a=!!String.prototype.trimEnd,Pa=!!Number.isSafeInteger,La=Pa?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},rr=!0;try{zn=Hn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),rr=((er=zn.exec("a"))===null||er===void 0?void 0:er[0])==="a"}catch{rr=!1}var zn,Gn=Ea?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},nr=wa?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,a=0,i;o>a;){if(i=t[a++],i>1114111)throw RangeError(i+" is not a valid code point");n+=i<65536?String.fromCharCode(i):String.fromCharCode(((i-=65536)>>10)+55296,i%1024+56320)}return n},Fn=Sa?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var a=o[n],i=a[0],s=a[1];r[i]=s}return r},$n=Aa?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),a;return o<55296||o>56319||r+1===n||(a=t.charCodeAt(r+1))<56320||a>57343?o:(o-55296<<10)+(a-56320)+65536}},Ca=Ta?function(t){return t.trimStart()}:function(t){return t.replace(ya,"")},Ra=_a?function(t){return t.trimEnd()}:function(t){return t.replace(va,"")};function Hn(e,t){return new RegExp(e,t)}var or;rr?(tr=Hn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),or=function(t,r){var n;tr.lastIndex=r;var o=tr.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):or=function(t,r){for(var n=[];;){var o=$n(t,r);if(o===void 0||Bn(o)||Ma(o))break;n.push(o),r+=o>=65536?2:1}return nr.apply(void 0,n)};var tr,Vn=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var a=this.char();if(a===123){var i=this.parseArgument(t,n);if(i.err)return i;o.push(i.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),o.push({type:w.pound,location:y(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(x.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&ar(this.peek()||0)){var i=this.parseTag(t,r);if(i.err)return i;o.push(i.val)}else{var i=this.parseLiteral(t,r);if(i.err)return i;o.push(i.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:w.literal,value:"<"+o+"/>",location:y(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var i=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!ar(this.char()))return this.error(x.INVALID_TAG,y(s,this.clonePosition()));var c=this.clonePosition(),h=this.parseTagName();return o!==h?this.error(x.UNMATCHED_CLOSING_TAG,y(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:w.tag,value:o,children:i,location:y(n,this.clonePosition())},err:null}:this.error(x.INVALID_TAG,y(s,this.clonePosition())))}else return this.error(x.UNCLOSED_TAG,y(n,this.clonePosition()))}else return this.error(x.INVALID_TAG,y(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&Oa(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var a=this.tryParseQuote(r);if(a){o+=a;continue}var i=this.tryParseUnquoted(t,r);if(i){o+=i;continue}var s=this.tryParseLeftAngleBracket();if(s){o+=s;continue}break}var c=y(n,this.clonePosition());return{val:{type:w.literal,value:o,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!Na(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return nr.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),nr(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(x.EMPTY_ARGUMENT,y(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(x.MALFORMED_ARGUMENT,y(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:w.argument,value:o,location:y(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(x.MALFORMED_ARGUMENT,y(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=or(this.message,r),o=r+n.length;this.bumpTo(o);var a=this.clonePosition(),i=y(t,a);return{value:n,location:i}},e.prototype.parseArgumentOptions=function(t,r,n,o){var a,i=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(x.EXPECT_ARGUMENT_TYPE,y(i,c));case"number":case"date":case"time":{this.bumpSpace();var h=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),u=this.parseSimpleArgStyleIfPossible();if(u.err)return u;var p=Ra(u.val);if(p.length===0)return this.error(x.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var b=y(l,this.clonePosition());h={style:p,styleLocation:b}}var g=this.tryParseArgumentClose(o);if(g.err)return g;var A=y(o,this.clonePosition());if(h&&Gn(h?.style,"::",0)){var k=Ca(h.style.slice(2));if(s==="number"){var u=this.parseNumberSkeletonFromString(k,h.styleLocation);return u.err?u:{val:{type:w.number,value:n,location:A,style:u.val},err:null}}else{if(k.length===0)return this.error(x.EXPECT_DATE_TIME_SKELETON,A);var p={type:re.dateTime,pattern:k,location:h.styleLocation,parsedOptions:this.shouldParseSkeletons?Ln(k):{}},ce=s==="date"?w.date:w.time;return{val:{type:ce,value:n,location:A,style:p},err:null}}}return{val:{type:s==="number"?w.number:s==="date"?w.date:w.time,value:n,location:A,style:(a=h?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var F=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(x.EXPECT_SELECT_ARGUMENT_OPTIONS,y(F,v({},F)));this.bumpSpace();var I=this.parseIdentifierIfPossible(),le=0;if(s!=="select"&&I.value==="offset"){if(!this.bumpIf(":"))return this.error(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var u=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,x.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(u.err)return u;this.bumpSpace(),I=this.parseIdentifierIfPossible(),le=u.val}var G=this.tryParsePluralOrSelectOptions(t,s,r,I);if(G.err)return G;var g=this.tryParseArgumentClose(o);if(g.err)return g;var Ne=y(o,this.clonePosition());return s==="select"?{val:{type:w.select,value:n,options:Fn(G.val),location:Ne},err:null}:{val:{type:w.plural,value:n,options:Fn(G.val),offset:le,pluralType:s==="plural"?"cardinal":"ordinal",location:Ne},err:null}}default:return this.error(x.INVALID_ARGUMENT_TYPE,y(i,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(x.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=Mn(t)}catch{return this.error(x.INVALID_NUMBER_SKELETON,r)}return{val:{type:re.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?Un(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var a,i=!1,s=[],c=new Set,h=o.value,l=o.location;;){if(h.length===0){var u=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var p=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_SELECTOR,x.INVALID_PLURAL_ARGUMENT_SELECTOR);if(p.err)return p;l=y(u,this.clonePosition()),h=this.message.slice(u.offset,this.offset())}else break}if(c.has(h))return this.error(r==="select"?x.DUPLICATE_SELECT_ARGUMENT_SELECTOR:x.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);h==="other"&&(i=!0),this.bumpSpace();var b=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:x.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var g=this.parseMessage(t+1,r,n);if(g.err)return g;var A=this.tryParseArgumentClose(b);if(A.err)return A;s.push([h,{value:g.val,location:y(b,this.clonePosition())}]),c.add(h),this.bumpSpace(),a=this.parseIdentifierIfPossible(),h=a.value,l=a.location}return s.length===0?this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR:x.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!i?this.error(x.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var a=!1,i=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,i=i*10+(s-48),this.bump();else break}var c=y(o,this.clonePosition());return a?(i*=n,La(i)?{val:i,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=$n(this.message,t);if(r===void 0)throw Error("Offset "+t+" is at invalid UTF-16 code unit boundary");return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Gn(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset "+t+" must be greater than or equal to the current offset "+this.offset());for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset "+t+" is at invalid UTF-16 code unit boundary");if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&Bn(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function ar(e){return e>=97&&e<=122||e>=65&&e<=90}function Na(e){return ar(e)||e===47}function Oa(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function Bn(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function Ma(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function ir(e){e.forEach(function(t){if(delete t.location,dt(t)||mt(t))for(var r in t.options)delete t.options[r].location,ir(t.options[r].value);else ct(t)&&pt(t.style)||(lt(t)||ht(t))&&He(t.style)?delete t.style.location:ut(t)&&ir(t.children)})}function jn(e,t){t===void 0&&(t={}),t=v({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new Vn(e,t).parse();if(r.err){var n=SyntaxError(x[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||ir(r.val),r.val}function Ve(e,t){var r=t&&t.cache?t.cache:Ga,n=t&&t.serializer?t.serializer:za,o=t&&t.strategy?t.strategy:Ia;return o(e,{cache:r,serializer:n})}function ka(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Wn(e,t,r,n){var o=ka(n)?n:r(n),a=t.get(o);return typeof a>"u"&&(a=e.call(this,n),t.set(o,a)),a}function Yn(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),a=t.get(o);return typeof a>"u"&&(a=e.apply(this,n),t.set(o,a)),a}function sr(e,t,r,n,o){return r.bind(t,e,n,o)}function Ia(e,t){var r=e.length===1?Wn:Yn;return sr(e,this,r,t.cache.create(),t.serializer)}function Da(e,t){return sr(e,this,Yn,t.cache.create(),t.serializer)}function Ua(e,t){return sr(e,this,Wn,t.cache.create(),t.serializer)}var za=function(){return JSON.stringify(arguments)};function cr(){this.cache=Object.create(null)}cr.prototype.get=function(e){return this.cache[e]};cr.prototype.set=function(e,t){this.cache[e]=t};var Ga={create:function(){return new cr}},ft={variadic:Da,monadic:Ua};var ne;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(ne||(ne={}));var Be=function(e){$e(t,e);function t(r,n,o){var a=e.call(this,r)||this;return a.code=n,a.originalMessage=o,a}return t.prototype.toString=function(){return"[formatjs Error: "+this.code+"] "+this.message},t}(Error);var lr=function(e){$e(t,e);function t(r,n,o,a){return e.call(this,'Invalid values for "'+r+'": "'+n+'". Options are "'+Object.keys(o).join('", "')+'"',ne.INVALID_VALUE,a)||this}return t}(Be);var qn=function(e){$e(t,e);function t(r,n,o){return e.call(this,'Value for "'+r+'" must be of type '+n,ne.INVALID_VALUE,o)||this}return t}(Be);var Xn=function(e){$e(t,e);function t(r,n){return e.call(this,'The intl string context variable "'+r+'" was not provided to the string "'+n+'"',ne.MISSING_VALUE,n)||this}return t}(Be);var R;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(R||(R={}));function Fa(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==R.literal||r.type!==R.literal?t.push(r):n.value+=r.value,t},[])}function $a(e){return typeof e=="function"}function je(e,t,r,n,o,a,i){if(e.length===1&&Zt(e[0]))return[{type:R.literal,value:e[0].value}];for(var s=[],c=0,h=e;c<h.length;c++){var l=h[c];if(Zt(l)){s.push({type:R.literal,value:l.value});continue}if(Pn(l)){typeof a=="number"&&s.push({type:R.literal,value:r.getNumberFormat(t).format(a)});continue}var u=l.value;if(!(o&&u in o))throw new Xn(u,i);var p=o[u];if(_n(l)){(!p||typeof p=="string"||typeof p=="number")&&(p=typeof p=="string"||typeof p=="number"?String(p):""),s.push({type:typeof p=="string"?R.literal:R.object,value:p});continue}if(lt(l)){var b=typeof l.style=="string"?n.date[l.style]:He(l.style)?l.style.parsedOptions:void 0;s.push({type:R.literal,value:r.getDateTimeFormat(t,b).format(p)});continue}if(ht(l)){var b=typeof l.style=="string"?n.time[l.style]:He(l.style)?l.style.parsedOptions:void 0;s.push({type:R.literal,value:r.getDateTimeFormat(t,b).format(p)});continue}if(ct(l)){var b=typeof l.style=="string"?n.number[l.style]:pt(l.style)?l.style.parsedOptions:void 0;b&&b.scale&&(p=p*(b.scale||1)),s.push({type:R.literal,value:r.getNumberFormat(t,b).format(p)});continue}if(ut(l)){var g=l.children,A=l.value,k=o[A];if(!$a(k))throw new qn(A,"function",i);var ce=je(g,t,r,n,o,a),F=k(ce.map(function(G){return G.value}));Array.isArray(F)||(F=[F]),s.push.apply(s,F.map(function(G){return{type:typeof G=="string"?R.literal:R.object,value:G}}))}if(dt(l)){var I=l.options[p]||l.options.other;if(!I)throw new lr(l.value,p,Object.keys(l.options),i);s.push.apply(s,je(I.value,t,r,n,o));continue}if(mt(l)){var I=l.options["="+p];if(!I){if(!Intl.PluralRules)throw new Be(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,ne.MISSING_INTL_API,i);var le=r.getPluralRules(t,{type:l.pluralType}).select(p-(l.offset||0));I=l.options[le]||l.options.other}if(!I)throw new lr(l.value,p,Object.keys(l.options),i);s.push.apply(s,je(I.value,t,r,n,o,p-(l.offset||0)));continue}}return Fa(s)}function Ha(e,t){return t?v(v(v({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=v(v({},e[n]),t[n]||{}),r},{})):e}function Va(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=Ha(e[n],t[n]),r},v({},e)):e}function hr(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ba(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ve(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,st([void 0],r)))},{cache:hr(e.number),strategy:ft.variadic}),getDateTimeFormat:Ve(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,st([void 0],r)))},{cache:hr(e.dateTime),strategy:ft.variadic}),getPluralRules:Ve(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,st([void 0],r)))},{cache:hr(e.pluralRules),strategy:ft.variadic})}}var Kn=function(){function e(t,r,n,o){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(i){var s=a.formatToParts(i);if(s.length===1)return s[0].value;var c=s.reduce(function(h,l){return!h.length||l.type!==R.literal||typeof h[h.length-1]!="string"?h.push(l.value):h[h.length-1]+=l.value,h},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(i){return je(a.ast,a.locales,a.formatters,a.formats,i,void 0,a.message)},this.resolvedOptions=function(){return{locale:Intl.NumberFormat.supportedLocalesOf(a.locales)[0]}},this.getAst=function(){return a.ast},typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Va(e.formats,n),this.locales=r,this.formatters=o&&o.formatters||Ba(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.__parse=jn,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Qn=Kn;var ja=/[0-9\-+#]/,Wa=/[^\d\-+#]/g;function Zn(e){return e.search(ja)}function Ya(e="#.##"){let t={},r=e.length,n=Zn(e);t.prefix=n>0?e.substring(0,n):"";let o=Zn(e.split("").reverse().join("")),a=r-o,i=e.substring(a,a+1),s=a+(i==="."||i===","?1:0);t.suffix=o>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Wa);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function qa(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[i="0",s=""]=o.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),o.integer=i,o.fraction=s,Xa(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function Xa(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let i=e.integer.length,s=i%a;for(let c=0;c<i;c++)e.result+=e.integer.charAt(c),!((c-s+1)%a)&&c<i-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ka(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Ya(e),o=qa(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var Jn=Ka;var eo=".",Qa=",",ro=/^\s+/,no=/\s+$/,to="&nbsp;",dr=e=>e*12,oo=(e,t)=>{let{start:r,end:n,displaySummary:{amount:o,duration:a,minProductQuantity:i,outcomeType:s}={}}=e;if(!(o&&a&&s&&i))return!1;let c=t?new Date(t):new Date;if(!r||!n)return!1;let h=new Date(r),l=new Date(n);return c>=h&&c<=l},oe={MONTH:"MONTH",YEAR:"YEAR"},Za={[P.ANNUAL]:12,[P.MONTHLY]:1,[P.THREE_YEARS]:36,[P.TWO_YEARS]:24},mr=(e,t)=>({accept:e,round:t}),Ja=[mr(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),mr(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),mr(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],ur={[O.YEAR]:{[P.MONTHLY]:oe.MONTH,[P.ANNUAL]:oe.YEAR},[O.MONTH]:{[P.MONTHLY]:oe.MONTH}},ei=(e,t)=>e.indexOf(`'${t}'`)===0,ti=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=io(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+ni(e)),r},ri=e=>{let t=oi(e),r=ei(e,t),n=e.replace(/'.*?'/,""),o=ro.test(n)||no.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},ao=e=>e.replace(ro,to).replace(no,to),ni=e=>e.match(/#(.?)#/)?.[1]===eo?Qa:eo,oi=e=>e.match(/'(.*?)'/)?.[1]??"",io=e=>e.match(/0(.?)0/)?.[1]??"";function Ce({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,a=i=>i){let{currencySymbol:i,isCurrencyFirst:s,hasCurrencySpace:c}=ri(e),h=r?io(e):"",l=ti(e,r),u=r?2:0,p=a(t,{currencySymbol:i}),b=n?p.toLocaleString("hi-IN",{minimumFractionDigits:u,maximumFractionDigits:u}):Jn(l,p),g=r?b.lastIndexOf(h):b.length,A=b.substring(0,g),k=b.substring(g+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,b).replace(/SYMBOL/,i),currencySymbol:i,decimals:k,decimalsDelimiter:h,hasCurrencySpace:c,integer:A,isCurrencyFirst:s,recurrenceTerm:o}}var so=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Za[r]??1;return Ce(e,o>1?oe.MONTH:ur[t]?.[r],a=>{let i={divisor:o,price:a,usePrecision:n},{round:s}=Ja.find(({accept:c})=>c(i));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(i)}`);return s(i)})},co=({commitment:e,term:t,...r})=>Ce(r,ur[e]?.[t]),lo=e=>{let{commitment:t,instant:r,price:n,originalPrice:o,priceWithoutDiscount:a,promotion:i,quantity:s=1,term:c}=e;if(t===O.YEAR&&c===P.MONTHLY){if(!i)return Ce(e,oe.YEAR,dr);let{displaySummary:{outcomeType:h,duration:l,minProductQuantity:u=1}={}}=i;switch(h){case"PERCENTAGE_DISCOUNT":if(s>=u&&oo(i,r)){let p=parseInt(l.replace("P","").replace("M",""));if(isNaN(p))return dr(n);let b=s*o*p,g=s*a*(12-p),A=Math.floor((b+g)*100)/100;return Ce({...e,price:A},oe.YEAR)}default:return Ce(e,oe.YEAR,()=>dr(a??n))}}return Ce(e,ur[t]?.[c])};var ai={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},ii=yn("ConsonantTemplates/price"),si=/<\/?[^>]+(>|$)/g,C={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},ae={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},ci="TAX_EXCLUSIVE",li=e=>bn(e)?Object.entries(e).filter(([,t])=>ze(t)||qt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+gn(n)+'"'}`,""):"",M=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+C.disabled}"${li(r)}>${n?ao(t):t??""}</span>`;function hi(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:a,integer:i,isCurrencyFirst:s,recurrenceLabel:c,perUnitLabel:h,taxInclusivityLabel:l},u={}){let p=M(C.currencySymbol,r),b=M(C.currencySpace,a?"&nbsp;":""),g="";return s&&(g+=p+b),g+=M(C.integer,i),g+=M(C.decimalsDelimiter,o),g+=M(C.decimals,n),s||(g+=b+p),g+=M(C.recurrence,c,null,!0),g+=M(C.unitType,h,null,!0),g+=M(C.taxInclusivity,l,!0),M(e,g,{...u,"aria-label":t})}var z=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1,instant:n=void 0}={})=>({country:o,displayFormatted:a=!0,displayRecurrence:i=!0,displayPerUnit:s=!1,displayTax:c=!1,language:h,literals:l={},quantity:u=1}={},{commitment:p,offerSelectorIds:b,formatString:g,price:A,priceWithoutDiscount:k,taxDisplay:ce,taxTerm:F,term:I,usePrecision:le,promotion:G}={},Ne={})=>{Object.entries({country:o,formatString:g,language:h,price:A}).forEach(([$,wt])=>{if(wt==null)throw new Error(`Argument "${$}" is missing for osi ${b?.toString()}, country ${o}, language ${h}`)});let ko={...ai,...l},Io=`${h.toLowerCase()}-${o.toUpperCase()}`;function he($,wt){let St=ko[$];if(St==null)return"";try{return new Qn(St.replace(si,""),Io).format(wt)}catch{return ii.error("Failed to format literal:",St),""}}let Do=t&&k?k:A,Ar=e?so:co;r&&(Ar=lo);let{accessiblePrice:Uo,recurrenceTerm:yt,...Tr}=Ar({commitment:p,formatString:g,instant:n,isIndianPrice:o==="IN",originalPrice:A,priceWithoutDiscount:k,price:e?A:Do,promotion:G,quantity:u,term:I,usePrecision:le}),de=Uo,vt="";if(D(i)&&yt){let $=he(ae.recurrenceAriaLabel,{recurrenceTerm:yt});$&&(de+=" "+$),vt=he(ae.recurrenceLabel,{recurrenceTerm:yt})}let Et="";if(D(s)){Et=he(ae.perUnitLabel,{perUnit:"LICENSE"});let $=he(ae.perUnitAriaLabel,{perUnit:"LICENSE"});$&&(de+=" "+$)}let Oe="";D(c)&&F&&(Oe=he(ce===ci?ae.taxExclusiveLabel:ae.taxInclusiveLabel,{taxTerm:F}),Oe&&(de+=" "+Oe)),t&&(de=he(ae.strikethroughAriaLabel,{strikethroughPrice:de}));let Me=C.container;if(e&&(Me+=" "+C.containerOptical),t&&(Me+=" "+C.containerStrikethrough),r&&(Me+=" "+C.containerAnnual),D(a))return hi(Me,{...Tr,accessibleLabel:de,recurrenceLabel:vt,perUnitLabel:Et,taxInclusivityLabel:Oe},Ne);let{currencySymbol:_r,decimals:zo,decimalsDelimiter:Go,hasCurrencySpace:Pr,integer:Fo,isCurrencyFirst:$o}=Tr,me=[Fo,Go,zo];$o?(me.unshift(Pr?"\xA0":""),me.unshift(_r)):(me.push(Pr?"\xA0":""),me.push(_r)),me.push(vt,Et,Oe);let Ho=me.join("");return M(Me,Ho,Ne)},ho=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||D(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${z()(e,t,r)}${o?"&nbsp;"+z({displayStrikethrough:!0})(e,t,r):""}`},mo=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let o={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||D(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?z({displayStrikethrough:!0})(o,t,r)+"&nbsp;":""}${z()(e,t,r)}${M(C.containerAnnualPrefix,"&nbsp;(")}${z({displayAnnual:!0,instant:n})(o,t,r)}${M(C.containerAnnualSuffix,")")}`},uo=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${z()(e,t,r)}${M(C.containerAnnualPrefix,"&nbsp;(")}${z({displayAnnual:!0})(n,t,r)}${M(C.containerAnnualSuffix,")")}`};var di=z(),mi=ho(),ui=z({displayOptical:!0}),pi=z({displayStrikethrough:!0}),fi=z({displayAnnual:!0}),gi=uo(),xi=mo();var bi=(e,t)=>{if(!(!Fe(e)||!Fe(t)))return Math.floor((t-e)/t*100)},po=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,o=bi(r,n);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var yi=po();var{freeze:We}=Object,wi={V2:"UCv2",V3:"UCv3"},pr=We({...wi}),Si={CHECKOUT:"checkout",CHECKOUT_EMAIL:"checkout/email",SEGMENTATION:"segmentation",BUNDLE:"bundle",COMMITMENT:"commitment",RECOMMENDATION:"recommendation",EMAIL:"email",PAYMENT:"payment",CHANGE_PLAN_TEAM_PLANS:"change-plan/team-upgrade/plans",CHANGE_PLAN_TEAM_PAYMENT:"change-plan/team-upgrade/payment"},fr=We({...Si}),gr={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},Mm=We({...O}),km=We({...Tn}),Im=We({...P});var go="mas-commerce-service";function xo(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(go);o!==r&&(r=o,o&&e(o))}return document.addEventListener(Tt,n,{once:t}),Ye(n),()=>document.removeEventListener(Tt,n)}function bo(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let a=t==="GB"||n?"EN":"MULT",[i,s]=e;o=[i.language===a?i:s]}return r&&(o=o.map(Kt)),o}var Ye=e=>window.setTimeout(e);function B(){return document.getElementsByTagName(go)?.[0]}var ie={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},yo=1e3,vo=new Set;function Ai(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Eo(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:a}=e;return[n,a,o].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ie.serializableTypes.includes(r))return r}return e}function Ti(e,t){if(!ie.ignoredProperties.includes(e))return Eo(t)}var xr={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],o=[],a=t;r.forEach(h=>{h!=null&&(Ai(h)?n:o).push(h)}),n.length&&(a+=" "+n.map(Eo).join(" "));let{pathname:i,search:s}=window.location,c=`${ie.delimiter}page=${i}${s}`;c.length>yo&&(c=`${c.slice(0,yo)}<trunc>`),a+=c,o.length&&(a+=`${ie.delimiter}facts=`,a+=JSON.stringify(o,Ti)),vo.has(a)||(vo.add(a),window.lana?.log(a,ie))}};function wo(e){Object.assign(ie,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ie&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var _i=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:pr.V3,checkoutWorkflowStep:fr.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:gr.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Lt.PUBLISHED,wcsBufferLimit:1});var br=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});var yr={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Pi=Date.now(),vr=new Set,Er=new Set,So=new Map,Ao={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},To={filter:({level:e})=>e!==yr.DEBUG},Li={filter:()=>!1};function Ci(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){return n.length===1&&Ge(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:o,timestamp:Date.now()-Pi}}function Ri(e){[...Er].every(t=>t(e))&&vr.forEach(t=>t(e))}function _o(e){let t=(So.get(e)??0)+1;So.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:o=>_o(`${n.namespace}/${o}`),updateConfig:wo};return Object.values(yr).forEach(o=>{n[o]=(a,...i)=>Ri(Ci(o,a,e,i,r))}),Object.seal(n)}function gt(...e){e.forEach(t=>{let{append:r,filter:n}=t;Ge(n)&&Er.add(n),Ge(r)&&vr.add(r)})}function Ni(e={}){let{name:t}=e,r=D(Pe("commerce.debug",{search:!0,storage:!0}),t===br.LOCAL);return gt(r?Ao:To),t===br.PROD&&gt(xr),wr}function Oi(){vr.clear(),Er.clear()}var wr={..._o(Br),Level:yr,Plugins:{consoleAppender:Ao,debugFilter:To,quietFilter:Li,lanaAppender:xr},init:Ni,reset:Oi,use:gt};var Mi={[q]:Gr,[J]:Fr,[X]:$r},ki={[q]:Hr,[X]:Vr},xt=class{constructor(t){f(this,"changes",new Map);f(this,"connected",!1);f(this,"dispose",Le);f(this,"error");f(this,"log");f(this,"options");f(this,"promises",[]);f(this,"state",J);f(this,"timer",null);f(this,"value");f(this,"version",0);f(this,"wrapperElement");this.wrapperElement=t}update(){[q,J,X].forEach(t=>{this.wrapperElement.classList.toggle(Mi[t],t===this.state)})}notify(){(this.state===X||this.state===q)&&(this.state===X?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===q&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(ki[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){this.dispose=xo(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=Le}onceSettled(){let{error:t,promises:r,state:n}=this;return X===n?Promise.resolve(this.wrapperElement):q===n?Promise.reject(t):new Promise((o,a)=>{r.push({resolve:o,reject:a})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=X,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Ye(()=>this.notify()),!0)}toggleFailed(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.error=r,this.state=q,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),Ye(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=J,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!B()||this.timer)return;let r=wr.module("mas-element"),{error:n,options:o,state:a,value:i,version:s}=this;this.state=J,this.timer=Ye(async()=>{this.timer=null;let c=null;if(this.changes.size&&(c=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:c}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:c})),c||t)try{await this.wrapperElement.render?.()===!1&&this.state===J&&this.version===s&&(this.state=a,this.error=n,this.value=i,this.update(),this.notify())}catch(h){r.error("Failed to render mas-element: ",h),this.toggleFailed(this.version,h,o)}})}};function Po(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Lo(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,Po(t)),o}function Co(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,Po(t)),e):null}var Ii="download",Di="upgrade";function Ro(e,t={},r=""){let n=B();if(!n)return null;let{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:i,entitlement:s,upgrade:c,modal:h,perpetual:l,promotionCode:u,quantity:p,wcsOsi:b,extraOptions:g}=n.collectCheckoutOptions(t),A=Lo(e,{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:i,entitlement:s,upgrade:c,modal:h,perpetual:l,promotionCode:u,quantity:p,wcsOsi:b,extraOptions:g});return r&&(A.innerHTML=`<span style="pointer-events: none;">${r}</span>`),A}function No(e){return class extends e{constructor(){super(...arguments);f(this,"checkoutActionHandler");f(this,"masElement",new xt(this))}attributeChangedCallback(n,o,a){this.masElement.attributeChangedCallback(n,o,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}get opens3in1Modal(){return Object.values(ge).includes(this.getAttribute("data-modal-type"))&&!!this.href}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){if(!this.isConnected)return!1;let o=B();if(!o)return!1;this.dataset.imsCountry||o.imsCountryPromise.then(u=>{u&&(this.dataset.imsCountry=u)},Le),n.imsCountry=null;let a=o.collectCheckoutOptions(n,this);if(!a.wcsOsi.length)return!1;let i;try{i=JSON.parse(a.extraOptions??"{}")}catch(u){this.masElement.log?.error("cannot parse exta checkout options",u)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let c=o.resolveOfferSelectors(a),h=await Promise.all(c);h=h.map(u=>bo(u,a)),a.country=this.dataset.imsCountry||a.country;let l=await o.buildCheckoutAction?.(h.flat(),{...i,...a},this);return this.renderOffers(h.flat(),a,{},l,s)}add3in1ModalParams(n,o){try{let a=new URL(n);return a.searchParams.set("ctx","if"),o===ge.CRM?(a.searchParams.set("af","uc_segmentation_hide_tabs,uc_new_user_iframe,uc_new_system_close"),a.searchParams.set("cli","creative")):(a.searchParams.set("af","uc_new_user_iframe,uc_new_system_close"),a.searchParams.set("cli","mini_plans")),a.toString()}catch(a){this.masElement.log?.error("Failed to add 3-in-1 modal parameters",a)}}setModalType(n,o){try{let i=new URL(o).searchParams.get("modal");if([ge.TWP,ge.D2P,ge.CRM].includes(i))return n?.setAttribute("data-modal-type",i),i}catch(a){this.masElement.log?.error("Failed to set modal type",a)}}renderOffers(n,o,a={},i=void 0,s=void 0){if(!this.isConnected)return!1;let c=B();if(!c)return!1;o={...JSON.parse(this.dataset.extraOptions??"null"),...o,...a},s??(s=this.masElement.togglePending(o)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0);let l;if(i){this.classList.remove(Ii,Di),this.masElement.toggleResolved(s,n,o);let{url:u,text:p,className:b,handler:g}=i;if(u&&(this.setCheckoutUrl(u),l=this.setModalType(this,u)),p&&(this.firstElementChild.innerHTML=p),b&&this.classList.add(...b.split(" ")),g&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=g.bind(this)),!l)return!0}if(n.length){if(this.masElement.toggleResolved(s,n,o)){let u=c.buildCheckoutURL(n,o),p=i&&l?this.add3in1ModalParams(u,l):u;return this.setCheckoutUrl(p),!0}}else{let u=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,u,o))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let o=B();if(!o)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:c,upgrade:h,modal:l,perpetual:u,promotionCode:p,quantity:b,wcsOsi:g}=o.collectCheckoutOptions(n);return Co(this,{checkoutMarketSegment:a,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:c,upgrade:h,modal:l,perpetual:u,promotionCode:p,quantity:b,wcsOsi:g}),!0}}}var qe=class qe extends No(HTMLButtonElement){static createCheckoutButton(t={},r=""){return Ro(qe,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};f(qe,"is","checkout-button"),f(qe,"tag","button");var Re=qe;window.customElements.get(Re.is)||window.customElements.define(Re.is,Re,{extends:Re.tag});function Ui(e){return`https://${e==="PRODUCTION"?"www.adobe.com":"www.stage.adobe.com"}/offers/promo-terms.html`}var Xe,se=class se extends HTMLAnchorElement{constructor(){super();L(this,Xe,!1);this.setAttribute("is",se.is)}get isUptLink(){return!0}initializeWcsData(r,n){this.setAttribute("data-wcs-osi",r),n&&this.setAttribute("data-promotion-code",n),N(this,Xe,!0),this.composePromoTermsUrl()}attributeChangedCallback(r,n,o){E(this,Xe)&&this.composePromoTermsUrl()}composePromoTermsUrl(){let r=this.getAttribute("data-wcs-osi");if(!r){let u=this.closest("merch-card").querySelector("aem-fragment").getAttribute("fragment");console.error(`Missing 'data-wcs-osi' attribute on upt-link. Fragment: ${u}`);return}let n=B(),o=[r],a=this.getAttribute("data-promotion-code"),{country:i,language:s,env:c}=n.settings,h={country:i,language:s,wcsOsi:o,promotionCode:a},l=n.resolveOfferSelectors(h);Promise.all(l).then(([[u]])=>{let p=`locale=${s}_${i}&country=${i}&offer_id=${u.offerId}`;a&&(p+=`&promotion_code=${encodeURIComponent(a)}`),this.href=`${Ui(c)}?${p}`}).catch(u=>{console.error(`Could not resolve offer selectors for id: ${r}.`,u.message)})}static createFrom(r){let n=new se;for(let o of r.attributes)o.name!=="is"&&(o.name==="class"&&o.value.includes("upt-link")?n.setAttribute("class",o.value.replace("upt-link","").trim()):n.setAttribute(o.name,o.value));return n.innerHTML=r.innerHTML,n.setAttribute("tabindex",0),n}};Xe=new WeakMap,f(se,"is","upt-link"),f(se,"tag","a"),f(se,"observedAttributes",["data-wcs-osi","data-promotion-code"]);var Z=se;window.customElements.get(Z.is)||window.customElements.define(Z.is,Z,{extends:Z.tag});var zi="#000000",Gi="#F8D904",Fi=/(accent|primary|secondary)(-(outline|link))?/,$i="mas:product_code/",Hi="daa-ll",bt="daa-lh",Vi=["XL","L","M","S"];function Ke(e,t,r,n){let o=n[e];if(t[e]&&o){let a=Y(o.tag,{slot:o?.slot},t[e]);r.append(a)}}function Bi(e,t,r){e.mnemonicIcon?.map((o,a)=>({icon:o,alt:e.mnemonicAlt[a]??"",link:e.mnemonicLink[a]??""}))?.forEach(({icon:o,alt:a,link:i})=>{if(i&&!/^https?:/.test(i))try{i=new URL(`https://${i}`).href.toString()}catch{i="#"}let s={slot:"icons",src:o,loading:t.loading,size:r?.size??"l"};a&&(s.alt=a),i&&(s.href=i);let c=Y("merch-icon",s);t.append(c)})}function ji(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||zi),t.setAttribute("badge-background-color",e.badgeBackgroundColor||Gi))}function Wi(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function Yi(e,t,r){e.cardTitle&&r&&t.append(Y(r.tag,{slot:r.slot},e.cardTitle))}function qi(e,t,r){Ke("subtitle",e,t,r)}function Xi(e,t,r){if(e.backgroundImage){let n={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?n.alt=e.backgroundImageAltText:n.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.append(Y(r.tag,{slot:r.slot},Y("img",n)))}}function Ki(e,t,r){Ke("prices",e,t,r)}function Qi(e,t,r){Ke("promoText",e,t,r),Ke("description",e,t,r),Ke("callout",e,t,r)}function Zi(e,t,r,n){e.showStockCheckbox&&r.stockOffer&&(t.setAttribute("checkbox-label",n.stockCheckboxLabel),t.setAttribute("stock-offer-osis",n.stockOfferOsis)),n.secureLabel&&r.secureLabel&&t.setAttribute("secure-label",n.secureLabel)}function Ji(e,t){t.querySelectorAll("a.upt-link").forEach(n=>{let o=Z.createFrom(n);n.replaceWith(o),o.initializeWcsData(e.osi,e.promoCode)})}function es(e,t,r,n){let a=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);a.setAttribute("tabindex",0);for(let l of e.attributes)["class","is"].includes(l.name)||a.setAttribute(l.name,l.value);a.firstElementChild?.classList.add("spectrum-Button-label");let i=t.ctas.size??"M",s=`spectrum-Button--${n}`,c=Vi.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",h=["spectrum-Button",s,c];return r&&h.push("spectrum-Button--outline"),a.classList.add(...h),a}function ts(e,t,r,n){let o="fill";r&&(o="outline");let a=Y("sp-button",{treatment:o,variant:n,tabIndex:0,size:t.ctas.size??"m"},e);return a.addEventListener("click",i=>{i.target!==e&&(i.stopPropagation(),e.click())}),a}function rs(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function ns(e,t,r,n){if(e.ctas){let{slot:o}=r.ctas,a=Y("div",{slot:o},e.ctas),i=[...a.querySelectorAll("a")].map(s=>{let c=Fi.exec(s.className)?.[0]??"accent",h=c.includes("accent"),l=c.includes("primary"),u=c.includes("secondary"),p=c.includes("-outline"),b=c.includes("-link");if(t.consonant)return rs(s,h);if(b)return s;let g;return h?g="accent":l?g="primary":u&&(g="secondary"),t.spectrum==="swc"?ts(s,r,p,g):es(s,r,p,g)});a.innerHTML="",a.append(...i),t.append(a)}}function os(e,t){let{tags:r}=e,n=r?.find(o=>o.startsWith($i))?.split("/").pop();n&&(t.setAttribute(bt,n),t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]").forEach((o,a)=>{o.setAttribute(Hi,`${o.dataset.analyticsId}-${a+1}`)}))}function as(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(n=>{n.classList.remove(t),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}function is(e){e.querySelectorAll("[slot]").forEach(n=>{n.remove()}),["checkbox-label","stock-offer-osis","secure-label","background-image","badge-background-color","badge-color","badge-text","size",bt].forEach(n=>e.removeAttribute(n));let r=["wide-strip","thin-strip"];e.classList.remove(...r)}async function Oo(e,t){let{fields:r}=e,{variant:n}=r;if(!n)return;let o={stockCheckboxLabel:"Add a 30-day free trial of Adobe Stock.*",stockOfferOsis:"",secureLabel:"Secure transaction"};is(t),t.id=e.id,t.variant=n,await t.updateComplete;let{aemFragmentMapping:a}=t.variantLayout;a&&(a.style==="consonant"&&t.setAttribute("consonant",!0),Bi(r,t,a.mnemonics),ji(r,t),Wi(r,t,a.size),Yi(r,t,a.title),qi(r,t,a),Ki(r,t,a),Xi(r,t,a.backgroundImage),Qi(r,t,a),Zi(r,t,a,o),Ji(r,t),ns(r,t,a,n),os(r,t),as(t))}var cs="merch-card",ls=":start",hs=":ready",ds=1e4,Mo="merch-card:",Qe,Sr,m=class extends ss{constructor(){super();L(this,Qe);f(this,"customerSegment");f(this,"marketSegment");f(this,"variantLayout");this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}static getFragmentMapping(r){return an[r]}firstUpdated(){this.variantLayout=zt(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=zt(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let a=o.value?.[0]?.planType;if(!a)return;let i=this.stockOfferOsis[a];if(!i)return;let s=o.dataset.wcsOsi.split(",").filter(c=>c!==i);r.checked&&s.push(i),o.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let a=n[o].order;a===1||isNaN(a)||(n[o].order=Number(a)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback();let r=this.querySelector("aem-fragment")?.getAttribute("fragment");performance.mark(`${Mo}${r}${ls}`),this.addEventListener(Pt,this.handleQuantitySelection),this.addEventListener(kr,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(fe,this.handleAemFragmentEvents),this.addEventListener(pe,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Pt,this.handleQuantitySelection),this.storageOptions?.removeEventListener(_t,this.handleStorageChange),this.removeEventListener(fe,this.handleAemFragmentEvents),this.removeEventListener(pe,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===fe&&j(this,Qe,Sr).call(this,"AEM fragment cannot be loaded"),r.type===pe&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;await Oo(n,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(a=>a.onceSettled().catch(()=>a))).then(a=>a.every(i=>i.classList.contains("placeholder-resolved"))),n=new Promise(a=>setTimeout(()=>a(!1),ds));if(await Promise.race([r,n,this.aemFragment?.updateComplete])===!0){performance.mark(`${Mo}${this.id}${hs}`),this.dispatchEvent(new CustomEvent(Ur,{bubbles:!0,composed:!0}));return}j(this,Qe,Sr).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll('a[is="checkout-link"].con-button')).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(Ir,{bubbles:!0})),this.displayFooterElementsInColumn())}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(_t,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};Qe=new WeakSet,Sr=function(r){this.dispatchEvent(new CustomEvent(zr,{detail:r,bubbles:!0,composed:!0}))},f(m,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{if(!r)return;let[n,o,a]=r.split(",");return{PUF:n,ABM:o,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,a,i]=n.split(":"),s=Number(a);return[o,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:a}])=>[n,o,a].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:bt,reflect:!0},loading:{type:String}}),f(m,"styles",[Nr,sn(),...Or()]);customElements.define(cs,m);
//# sourceMappingURL=merch-card.js.map

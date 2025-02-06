var Jo=Object.defineProperty;var Ur=e=>{throw TypeError(e)};var Qo=(e,t,r)=>t in e?Jo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var f=(e,t,r)=>Qo(e,typeof t!="symbol"?t+"":t,r),Ot=(e,t,r)=>t.has(e)||Ur("Cannot "+r);var Rt=(e,t,r)=>(Ot(e,t,"read from private field"),r?r.call(e):t.get(e)),me=(e,t,r)=>t.has(e)?Ur("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),zr=(e,t,r,n)=>(Ot(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),Mt=(e,t,r)=>(Ot(e,t,"access private method"),r);import{LitElement as Cs}from"../lit-all.min.js";import{LitElement as ea,html as Gr,css as ta}from"../lit-all.min.js";var d=class extends ea{constructor(){super(),this.size="m",this.alt="",this.loading="lazy"}render(){let{href:t}=this;return t?Gr`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />
              </a>`:Gr` <img src="${this.src}" alt="${this.alt}" loading="${this.loading}" />`}};f(d,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0},loading:{type:String,attribute:!0}}),f(d,"styles",ta`
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
    `);customElements.define("merch-icon",d);import{css as $r,unsafeCSS as Fr}from"../lit-all.min.js";var $="(max-width: 767px)",Qe="(max-width: 1199px)",T="(min-width: 768px)",A="(min-width: 1200px)",D="(min-width: 1600px)";var Vr=$r`
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
`,jr=()=>[$r`
      /* Tablet */
      @media screen and ${Fr(T)} {
          :host([size='wide']),
          :host([size='super-wide']) {
              width: 100%;
              grid-column: 1 / -1;
          }
      }

      /* Laptop */
      @media screen and ${Fr(A)} {
          :host([size='wide']) {
              grid-column: span 2;
          }
      }
      `];import{html as et}from"../lit-all.min.js";var ue,Me=class Me{constructor(t){f(this,"card");me(this,ue);this.card=t,this.insertVariantStyle()}getContainer(){return zr(this,ue,Rt(this,ue)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),Rt(this,ue)}insertVariantStyle(){if(!Me.styleMap[this.card.variant]){Me.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),a=parseInt(this.getContainer().style.getPropertyValue(n))||0;o>a&&this.getContainer().style.setProperty(n,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),et`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return et` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?et`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return et`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};ue=new WeakMap,f(Me,"styleMap",{});var w=Me;import{html as Ut,css as ra}from"../lit-all.min.js";function U(e,t={},r=null,n=null){let o=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[a,i]of Object.entries(t))o.setAttribute(a,i);return o}function tt(){return window.matchMedia("(max-width: 767px)").matches}function Wr(){return window.matchMedia("(max-width: 1024px)").matches}var Ht="wcms:commerce:ready";var qr="merch-offer-select:ready",Yr="merch-card:ready",Xr="merch-card:action-menu-toggle";var It="merch-storage:change",Bt="merch-quantity-selector:change";var rt="aem:load",nt="aem:error",Zr="mas:ready",Kr="mas:error",Jr="placeholder-failed",Qr="placeholder-pending",en="placeholder-resolved";var tn="mas:failed",rn="mas:resolved",nn="mas/commerce";var Y="failed",K="pending",X="resolved",Dt={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var on=`
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

@media screen and ${T} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${A} {
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
}`;var zt={badge:!0,ctas:{slot:"footer",size:"m"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"h3",slot:"heading-xs"},size:["wide","super-wide"],title:{tag:"h3",slot:"heading-xs"}},pe=class extends w{constructor(r){super(r);f(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(Xr,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});f(this,"toggleActionMenu",r=>{if(!this.actionMenuContentSlot||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter")return;r.preventDefault(),this.actionMenuContentSlot.classList.toggle("hidden");let n=this.actionMenuContentSlot.classList.contains("hidden");n||this.dispatchActionMenuToggle(),this.setAriaExpanded(this.actionMenu,(!n).toString())});f(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0;this.card.blur(),this.actionMenu?.classList.remove("always-visible"),this.actionMenuContentSlot&&(n||this.dispatchActionMenuToggle(),this.actionMenuContentSlot.classList.toggle("hidden",n),this.setAriaExpanded(this.actionMenu,"false"))});f(this,"hideActionMenu",r=>{this.actionMenuContentSlot?.classList.add("hidden"),this.setAriaExpanded(this.actionMenu,"false")});f(this,"focusEventHandler",r=>{this.actionMenu&&(this.actionMenu.classList.add("always-visible"),(r.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||r.relatedTarget?.nodeName==="MERCH-CARD"&&r.target.nodeName!=="MERCH-ICON")&&this.actionMenu.classList.remove("always-visible"))})}get aemFragmentMapping(){return zt}get actionMenu(){return this.card.shadowRoot.querySelector(".action-menu")}get actionMenuContentSlot(){return this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')}renderLayout(){return Ut` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${Wr()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Ut`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Ut`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return on}setAriaExpanded(r,n){r.setAttribute("aria-expanded",n)}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};f(pe,"variantStyle",ra`
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
    `);import{html as He}from"../lit-all.min.js";var an=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${T} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${A} {
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
`;var ot=class extends w{constructor(t){super(t)}getGlobalCSS(){return an}renderLayout(){return He`${this.cardImage}
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
          `}`}};import{html as cn}from"../lit-all.min.js";var sn=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${T} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${A} {
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
`;var at=class extends w{constructor(t){super(t)}getGlobalCSS(){return sn}renderLayout(){return cn` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":cn`<hr />`} ${this.secureLabelFooter}`}};import{html as fe,css as na,unsafeCSS as hn}from"../lit-all.min.js";var ln=`
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
@media screen and ${$} {
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

@media screen and ${Qe} {
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
@media screen and ${T} {
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
@media screen and ${A} {
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
`;var oa=32,ge=class extends w{constructor(r){super(r);f(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);f(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?fe`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:fe`<slot name="secure-transaction-label"></slot>`;return fe`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return ln}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"] ul')?.children].forEach((n,o)=>{let a=Math.max(oa,parseFloat(window.getComputedStyle(n).height)||0),i=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;a>i&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${a}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}renderLayout(){return fe` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){tt()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};f(ge,"variantStyle",na`
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

    @media screen and ${hn(Qe)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${hn(A)} {
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
  `);import{html as it,css as aa}from"../lit-all.min.js";var dn=`
:root {
  --consonant-merch-card-plans-width: 300px;
  --consonant-merch-card-plans-icon-size: 40px;
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
@media screen and ${T} {
  :root {
    --consonant-merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
  }
}

/* desktop */
@media screen and ${A} {
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
`;var xe=class extends w{constructor(t){super(t)}getGlobalCSS(){return dn}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?it`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return it` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":it`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?it`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};f(xe,"variantStyle",aa`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Gt,css as ia}from"../lit-all.min.js";var mn=`
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
@media screen and ${T} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${A} {
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
`;var J=class extends w{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return mn}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return Gt` ${this.badge}
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
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(tt()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};f(J,"variantStyle",ia`
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
  `);import{html as Ft,css as sa}from"../lit-all.min.js";var un=`
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
@media screen and ${$} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${T} {
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
@media screen and ${A} {
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
`;var be=class extends w{constructor(t){super(t)}getGlobalCSS(){return un}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ft` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ft`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ft`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};f(be,"variantStyle",sa`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as $t,css as ca}from"../lit-all.min.js";var pn=`
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

@media screen and ${$} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${T} {
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
@media screen and ${A} {
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
`;var Vt={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},ye=class extends w{constructor(t){super(t)}getGlobalCSS(){return pn}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Vt}renderLayout(){return $t`${this.cardImage}
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
            <slot></slot>`}};f(ye,"variantStyle",ca`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as la,css as ha}from"../lit-all.min.js";var fn=`
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

@media screen and ${$} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${T} {
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
  
@media screen and ${A} {
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
`;var ve=class extends w{constructor(t){super(t)}getGlobalCSS(){return fn}renderLayout(){return la`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};f(ve,"variantStyle",ha`
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
  `);import{html as da,css as ma}from"../lit-all.min.js";var gn=`

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
`;var jt={backgroundImage:{attribute:"background-image"},badge:!0,ctas:{slot:"cta",size:"M"},description:{tag:"div",slot:"body-xs"},mnemonics:{size:"l"},prices:{tag:"p",slot:"price"},size:[],subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"}},Ee=class extends w{getGlobalCSS(){return gn}get aemFragmentMapping(){return jt}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return da` <div style="${this.stripStyle}" class="body">
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
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};f(Ee,"variantStyle",ma`
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
    `);import{html as ua,css as pa}from"../lit-all.min.js";var xn=`

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
`;var Wt={backgroundImage:{tag:"div",slot:"image"},badge:!0,ctas:{slot:"footer",size:"S"},description:{tag:"div",slot:"body-s"},mnemonics:{size:"m"},size:["wide"]},we=class extends w{getGlobalCSS(){return xn}get aemFragmentMapping(){return Wt}renderLayout(){return ua` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};f(we,"variantStyle",pa`
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
    `);import{html as fa,css as ga}from"../lit-all.min.js";var bn=`
    merch-card[variant="ah-try-buy-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
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
`;import"../lit-all.min.js";var Ie=class{constructor(t,r){f(this,"key");f(this,"host");f(this,"media");f(this,"matches");this.key=Symbol("match-media-key"),this.media=window.matchMedia(r),this.matches=this.media.matches,this.updateMatches=this.updateMatches.bind(this),(this.host=t).addController(this)}hostConnected(){this.media.addEventListener("change",this.updateMatches)}hostDisconnected(){this.media.removeEventListener("change",this.updateMatches)}updateMatches(){this.matches!==this.media.matches&&(this.matches=this.media.matches,this.host.requestUpdate(this.key,!this.matches))}};var xa={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40},description:{tag:"div",slot:"body-xxs",maxCount:200},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},allowedColors:["gray"],size:["single","double"]},qt,Q=class extends w{constructor(){super(...arguments);me(this,qt,new Ie(this.card,$))}getGlobalCSS(){return bn}get aemFragmentMapping(){return xa}renderLayout(){return fa`
      <div class="content">
        <div class="header">
    		    <slot name="icons"></slot>
            <slot name="heading-xxxs"></slot>
        </div>
        <slot name="body-xxs"></slot>
        <slot name="price"></slot>
      </div>
      <slot></slot>
    `}};qt=new WeakMap,f(Q,"variantStyle",ga`
    :host([variant='ah-try-buy-widget']) {
        --merch-card-ah-try-buy-widget-min-width: 132px;
        --merch-card-ah-try-buy-widget-max-width: 132px;
        --merch-card-ah-try-buy-widget-content-min-width: 132px;
        --merch-card-ah-try-buy-widget-content-max-width: 245px;
        --merch-card-ah-try-buy-widget-height: 206px;
        --merch-card-ah-try-buy-widget-header-min-height: 36px;
        --merch-card-ah-try-buy-widget-gray-background: rgba(248, 248, 248);
        --merch-card-ah-try-buy-widget-text-color: rgba(19, 19, 19);
        --merch-card-ah-try-buy-widget-price-line-height: 17px;
        --merch-card-ah-try-buy-widget-outline: transparent;
        min-width: var(--merch-card-ah-try-buy-widget-min-width);
        max-width: var(--merch-card-ah-try-buy-widget-max-width);
        min-height: var(--merch-card-ah-try-buy-widget-height);
        background-color: var(--consonant-merch-card-background-color);
        color: var(--consonant-merch-card-heading-xxxs-color);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        padding: 12px !important;
        gap: 16px;
        box-sizing: content-box !important;
        border: none;
        outline: 1px solid var(--merch-card-ah-try-buy-widget-outline);
        justify-content: space-between;
    }

    :host([variant='ah-try-buy-widget'][size='single']) {
        --merch-card-ah-try-buy-widget-max-width: 460px;
        max-height: 230px;
        flex-direction: column;
        flex-wrap: wrap;
    }

    :host([variant='ah-try-buy-widget'][size='single']) ::slotted(div[slot="cta"])  {
        display: flex;
        flex-grow: 0;
    }

    :host([variant='ah-try-buy-widget'][size='double']) {
        --merch-card-ah-try-buy-widget-max-width: 214px;
    }

    :host([variant='ah-try-buy-widget'][background-color='gray']) {
        background-color: var(--merch-card-ah-try-buy-widget-gray-background);
    }

    :host([variant='ah-try-buy-widget']) .content {
        display: flex;
        flex-direction: column;
        flex-grow: 0;
        justify-content: flex-start;
        min-width: var(--merch-card-ah-try-buy-widget-content-min-width);
        max-width: var(--merch-card-ah-try-buy-widget-content-max-width);
    }

    :host([variant='ah-try-buy-widget']) .header {
        display: flex;
        min-height: var(--merch-card-ah-try-buy-widget-header-min-height);
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        margin-bottom: 4px;
    }


    :host([variant='ah-try-buy-widget']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
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

    :host([variant='ah-try-buy-widget']) .footer .spectrum-Button-label {
        height: 16px;
        padding-block: 2px;
        white-space: nowrap;
    }

    :host([variant='ah-try-buy-widget'][size='single']) .image {
      display: flex;
      width: 199px;
      overflow: hidden;
      height: 100%;
      order: 1;
    }

    :host([variant='ah-try-buy-widget']) .image {
        display: none;
    }

    :host([variant='ah-try-buy-widget']) .image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
        overflow: hidden;
    }

    :host([variant='ah-try-buy-widget']) ::slotted(.spectrum-Button--primary) {
        background-color: var(--spectrum-primary-color, #1473E6);
        color: white;
    }

    :host([variant='ah-try-buy-widget']) ::slotted(.spectrum-Button--secondary) {
        background-color: var(--spectrum-secondary-color, #E5E5E5);
        color: black;
    }
  `);customElements.define("ah-try-buy-widget",Q);var Yt=(e,t=!1)=>{switch(e.variant){case"catalog":return new pe(e);case"image":return new ot(e);case"inline-heading":return new at(e);case"mini-compare-chart":return new ge(e);case"plans":return new xe(e);case"product":return new J(e);case"segment":return new be(e);case"special-offers":return new ye(e);case"twp":return new ve(e);case"ccd-suggested":return new Ee(e);case"ccd-slice":return new we(e);case"ah-try-buy-widget":return new Q(e);default:return t?void 0:new J(e)}},yn={catalog:zt,image:null,"inline-heading":null,"mini-compare-chart":null,plans:null,product:null,segment:null,"special-offers":Vt,twp:null,"ccd-suggested":jt,"ccd-slice":Wt},vn=()=>{let e=[];return e.push(pe.variantStyle),e.push(ge.variantStyle),e.push(J.variantStyle),e.push(xe.variantStyle),e.push(be.variantStyle),e.push(ye.variantStyle),e.push(ve.variantStyle),e.push(Ee.variantStyle),e.push(we.variantStyle),e.push(Q.variantStyle),e};var En=document.createElement("style");En.innerHTML=`
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

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--consonant-merch-card-callout-spacing-xxs);
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

`;document.head.appendChild(En);var Be;(function(e){e.STAGE="STAGE",e.PRODUCTION="PRODUCTION",e.LOCAL="LOCAL"})(Be||(Be={}));var Xt;(function(e){e.STAGE="STAGE",e.PRODUCTION="PROD",e.LOCAL="LOCAL"})(Xt||(Xt={}));var De;(function(e){e.DRAFT="DRAFT",e.PUBLISHED="PUBLISHED"})(De||(De={}));var ee;(function(e){e.V2="UCv2",e.V3="UCv3"})(ee||(ee={}));var F;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(F||(F={}));var Zt=function(e){var t;return(t=ba.get(e))!==null&&t!==void 0?t:e},ba=new Map([["countrySpecific","cs"],["quantity","q"],["authCode","code"],["checkoutPromoCode","apc"],["rurl","rUrl"],["curl","cUrl"],["ctxrturl","ctxRtUrl"],["country","co"],["language","lang"],["clientId","cli"],["context","ctx"],["productArrangementCode","pa"],["offerType","ot"],["marketSegment","ms"]]);var wn=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},Sn=function(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),o,a=[],i;try{for(;(t===void 0||t-- >0)&&!(o=n.next()).done;)a.push(o.value)}catch(s){i={error:s}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(i)throw i.error}}return a};function Se(e,t,r){var n,o;try{for(var a=wn(Object.entries(e)),i=a.next();!i.done;i=a.next()){var s=Sn(i.value,2),h=s[0],c=s[1],l=Zt(h);c!=null&&r.has(l)&&t.set(l,c)}}catch(p){n={error:p}}finally{try{i&&!i.done&&(o=a.return)&&o.call(a)}finally{if(n)throw n.error}}}function st(e){switch(e){case Be.PRODUCTION:return"https://commerce.adobe.com";default:return"https://commerce-stg.adobe.com"}}function ct(e,t){var r,n;for(var o in e){var a=e[o];try{for(var i=(r=void 0,wn(Object.entries(a))),s=i.next();!s.done;s=i.next()){var h=Sn(s.value,2),c=h[0],l=h[1];if(l!=null){var p=Zt(c);t.set("items["+o+"]["+p+"]",l)}}}catch(u){r={error:u}}finally{try{s&&!s.done&&(n=i.return)&&n.call(i)}finally{if(r)throw r.error}}}}var ya=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},va=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")};function An(e){Sa(e);var t=e.env,r=e.items,n=e.workflowStep,o=ya(e,["env","items","workflowStep"]),a=new URL(st(t));return a.pathname=n+"/",ct(r,a.searchParams),Se(o,a.searchParams,Ea),a.toString()}var Ea=new Set(["cli","co","lang","ctx","cUrl","mv","nglwfdata","otac","promoid","rUrl","sdid","spint","trackingid","code","campaignid","appctxid"]),wa=["env","workflowStep","clientId","country","items"];function Sa(e){var t,r;try{for(var n=va(wa),o=n.next();!o.done;o=n.next()){var a=o.value;if(!e[a])throw new Error('Argument "checkoutData" is not valid, missing: '+a)}}catch(i){t={error:i}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}return!0}var Aa=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r},Ta=function(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")},_a="p_draft_landscape",Ca="/store/";function Jt(e){Pa(e);var t=e.env,r=e.items,n=e.workflowStep,o=e.ms,a=e.marketSegment,i=e.ot,s=e.offerType,h=e.pa,c=e.productArrangementCode,l=e.landscape,p=Aa(e,["env","items","workflowStep","ms","marketSegment","ot","offerType","pa","productArrangementCode","landscape"]),u={marketSegment:a??o,offerType:s??i,productArrangementCode:c??h},g=new URL(st(t));return g.pathname=""+Ca+n,n!==F.SEGMENTATION&&n!==F.CHANGE_PLAN_TEAM_PLANS&&ct(r,g.searchParams),n===F.SEGMENTATION&&Se(u,g.searchParams,Kt),Se(p,g.searchParams,Kt),l===De.DRAFT&&Se({af:_a},g.searchParams,Kt),g.toString()}var Kt=new Set(["af","ai","apc","appctxid","cli","co","csm","ctx","ctxRtUrl","DCWATC","dp","fr","gsp","ijt","lang","lo","mal","ms","mv","mv2","nglwfdata","ot","otac","pa","pcid","promoid","q","rf","sc","scl","sdid","sid","spint","svar","th","thm","trackingid","usid","workflowid","context.guid","so.ca","so.su","so.tr","so.va"]),La=["env","workflowStep","clientId","country"];function Pa(e){var t,r;try{for(var n=Ta(La),o=n.next();!o.done;o=n.next()){var a=o.value;if(!e[a])throw new Error('Argument "checkoutData" is not valid, missing: '+a)}}catch(i){t={error:i}}finally{try{o&&!o.done&&(r=n.return)&&r.call(n)}finally{if(t)throw t.error}}if(e.workflowStep!==F.SEGMENTATION&&e.workflowStep!==F.CHANGE_PLAN_TEAM_PLANS&&!e.items)throw new Error('Argument "checkoutData" is not valid, missing: items');return!0}function Qt(e,t){switch(e){case ee.V2:return An(t);case ee.V3:return Jt(t);default:return console.warn("Unsupported CheckoutType, will use UCv3 as default. Given type: "+e),Jt(t)}}var er;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(er||(er={}));var R;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(R||(R={}));var C;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(C||(C={}));var tr;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(tr||(tr={}));var rr;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(rr||(rr={}));var nr;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(nr||(nr={}));var or;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(or||(or={}));var Tn="tacocat.js";var _n=(e,t)=>String(e??"").toLowerCase()==String(t??"").toLowerCase(),Cn=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function Te(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let a;if(n&&a==null){let i=new URLSearchParams(window.location.search),s=Ae(n)?n:e;a=i.get(s)}if(o&&a==null){let i=Ae(o)?o:e;a=window.sessionStorage.getItem(i)??window.localStorage.getItem(i)}if(r&&a==null){let i=Na(Ae(r)?r:e);a=document.documentElement.querySelector(`meta[name="${i}"]`)?.content}return a??t[e]}var _e=()=>{};var Ln=e=>typeof e=="boolean",Ue=e=>typeof e=="function",lt=e=>typeof e=="number",Pn=e=>e!=null&&typeof e=="object";var Ae=e=>typeof e=="string",ar=e=>Ae(e)&&e,Ce=e=>lt(e)&&Number.isFinite(e)&&e>0;function ir(e,t=r=>r==null||r===""){return e!=null&&Object.entries(e).forEach(([r,n])=>{t(n)&&delete e[r]}),e}function L(e,t){if(Ln(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function ze(e,t,r){let n=Object.values(t);return n.find(o=>_n(o,e))??r??n[0]}function Na(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}function ht(e,t=1){return lt(e)||(e=Number.parseInt(e,10)),!Number.isNaN(e)&&e>0&&Number.isFinite(e)?e:t}var ka=Date.now(),sr=()=>`(+${Date.now()-ka}ms)`,dt=new Set,Oa=L(Te("tacocat.debug",{},{metadata:!1}),!1);function Nn(e){let t=`[${Tn}/${e}]`,r=(i,s,...h)=>i?!0:(o(s,...h),!1),n=Oa?(i,...s)=>{console.debug(`${t} ${i}`,...s,sr())}:()=>{},o=(i,...s)=>{let h=`${t} ${i}`;dt.forEach(([c])=>c(h,...s))};return{assert:r,debug:n,error:o,warn:(i,...s)=>{let h=`${t} ${i}`;dt.forEach(([,c])=>c(h,...s))}}}function Ra(e,t){let r=[e,t];return dt.add(r),()=>{dt.delete(r)}}Ra((e,...t)=>{console.error(e,...t,sr())},(e,...t)=>{console.warn(e,...t,sr())});var Ma="no promo",kn="promo-tag",Ha="yellow",Ia="neutral",Ba=(e,t,r)=>{let n=a=>a||Ma,o=r?` (was "${n(t)}")`:"";return`${n(e)}${o}`},Da="cancel-context",cr=(e,t)=>{let r=e===Da,n=!r&&e?.length>0,o=(n||r)&&(t&&t!=e||!t&&!r),a=o&&n||!o&&!!t,i=a?e||t:void 0;return{effectivePromoCode:i,overridenPromoCode:e,className:a?kn:`${kn} no-promo`,text:Ba(i,t,o),variant:a?Ha:Ia,isOverriden:o}};var On="ABM",Rn="PUF",Mn="M2M",Hn="PERPETUAL",In="P3Y",Ua="TAX_INCLUSIVE_DETAILS",za="TAX_EXCLUSIVE",Bn={ABM:On,PUF:Rn,M2M:Mn,PERPETUAL:Hn,P3Y:In},Jd={[On]:{commitment:R.YEAR,term:C.MONTHLY},[Rn]:{commitment:R.YEAR,term:C.ANNUAL},[Mn]:{commitment:R.MONTH,term:C.MONTHLY},[Hn]:{commitment:R.PERPETUAL,term:void 0},[In]:{commitment:R.THREE_MONTHS,term:C.P3Y}};function lr(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:a,taxDisplay:i}=t;if(i!==Ua)return e;let s={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:a??n,taxDisplay:za}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var hr=function(e,t){return hr=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},hr(e,t)};function Ge(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");hr(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var v=function(){return v=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},v.apply(this,arguments)};function mt(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,a;n<o;n++)(a||!(n in t))&&(a||(a=Array.prototype.slice.call(t,0,n)),a[n]=t[n]);return e.concat(a||Array.prototype.slice.call(t))}var b;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(b||(b={}));var S;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(S||(S={}));var te;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(te||(te={}));function dr(e){return e.type===S.literal}function Dn(e){return e.type===S.argument}function ut(e){return e.type===S.number}function pt(e){return e.type===S.date}function ft(e){return e.type===S.time}function gt(e){return e.type===S.select}function xt(e){return e.type===S.plural}function Un(e){return e.type===S.pound}function bt(e){return e.type===S.tag}function yt(e){return!!(e&&typeof e=="object"&&e.type===te.number)}function Fe(e){return!!(e&&typeof e=="object"&&e.type===te.dateTime)}var mr=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Ga=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function zn(e){var t={};return e.replace(Ga,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var Gn=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function jn(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(Gn).filter(function(u){return u.length>0}),r=[],n=0,o=t;n<o.length;n++){var a=o[n],i=a.split("/");if(i.length===0)throw new Error("Invalid number skeleton");for(var s=i[0],h=i.slice(1),c=0,l=h;c<l.length;c++){var p=l[c];if(p.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:h})}return r}function Fa(e){return e.replace(/^(.*?)-/,"")}var Fn=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,Wn=/^(@+)?(\+|#+)?[rs]?$/g,$a=/(\*)(0+)|(#+)(0+)|(0+)/g,qn=/^(0+)$/;function $n(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(Wn,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function Yn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Va(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!qn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function Vn(e){var t={},r=Yn(e);return r||t}function Xn(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Fa(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=v(v(v({},t),{notation:"scientific"}),o.options.reduce(function(h,c){return v(v({},h),Vn(c))},{}));continue;case"engineering":t=v(v(v({},t),{notation:"engineering"}),o.options.reduce(function(h,c){return v(v({},h),Vn(c))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace($a,function(h,c,l,p,u,g){if(c)t.minimumIntegerDigits=l.length;else{if(p&&u)throw new Error("We currently do not support maximum integer digits");if(g)throw new Error("We currently do not support exact integer digits")}return""});continue}if(qn.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(Fn.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(Fn,function(h,c,l,p,u,g){return l==="*"?t.minimumFractionDigits=c.length:p&&p[0]==="#"?t.maximumFractionDigits=p.length:u&&g?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+g.length):(t.minimumFractionDigits=c.length,t.maximumFractionDigits=c.length),""});var a=o.options[0];a==="w"?t=v(v({},t),{trailingZeroDisplay:"stripIfInteger"}):a&&(t=v(v({},t),$n(a)));continue}if(Wn.test(o.stem)){t=v(v({},t),$n(o.stem));continue}var i=Yn(o.stem);i&&(t=v(v({},t),i));var s=Va(o.stem);s&&(t=v(v({},t),s))}return t}var $e={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function Zn(e,t){for(var r="",n=0;n<e.length;n++){var o=e.charAt(n);if(o==="j"){for(var a=0;n+1<e.length&&e.charAt(n+1)===o;)a++,n++;var i=1+(a&1),s=a<2?1:3+(a>>1),h="a",c=ja(t);for((c=="H"||c=="k")&&(s=0);s-- >0;)r+=h;for(;i-- >0;)r=c+r}else o==="J"?r+="H":r+=o}return r}function ja(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,n;r!=="root"&&(n=e.maximize().region);var o=$e[n||""]||$e[r||""]||$e["".concat(r,"-001")]||$e["001"];return o[0]}var ur,Wa=new RegExp("^".concat(mr.source,"*")),qa=new RegExp("".concat(mr.source,"*$"));function E(e,t){return{start:e,end:t}}var Ya=!!String.prototype.startsWith,Xa=!!String.fromCodePoint,Za=!!Object.fromEntries,Ka=!!String.prototype.codePointAt,Ja=!!String.prototype.trimStart,Qa=!!String.prototype.trimEnd,ei=!!Number.isSafeInteger,ti=ei?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},fr=!0;try{Kn=to("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),fr=((ur=Kn.exec("a"))===null||ur===void 0?void 0:ur[0])==="a"}catch{fr=!1}var Kn,Jn=Ya?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},gr=Xa?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,a=0,i;o>a;){if(i=t[a++],i>1114111)throw RangeError(i+" is not a valid code point");n+=i<65536?String.fromCharCode(i):String.fromCharCode(((i-=65536)>>10)+55296,i%1024+56320)}return n},Qn=Za?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var a=o[n],i=a[0],s=a[1];r[i]=s}return r},eo=Ka?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),a;return o<55296||o>56319||r+1===n||(a=t.charCodeAt(r+1))<56320||a>57343?o:(o-55296<<10)+(a-56320)+65536}},ri=Ja?function(t){return t.trimStart()}:function(t){return t.replace(Wa,"")},ni=Qa?function(t){return t.trimEnd()}:function(t){return t.replace(qa,"")};function to(e,t){return new RegExp(e,t)}var xr;fr?(pr=to("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),xr=function(t,r){var n;pr.lastIndex=r;var o=pr.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):xr=function(t,r){for(var n=[];;){var o=eo(t,r);if(o===void 0||no(o)||ii(o))break;n.push(o),r+=o>=65536?2:1}return gr.apply(void 0,n)};var pr,ro=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var a=this.char();if(a===123){var i=this.parseArgument(t,n);if(i.err)return i;o.push(i.val)}else{if(a===125&&t>0)break;if(a===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),o.push({type:S.pound,location:E(s,this.clonePosition())})}else if(a===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(b.UNMATCHED_CLOSING_TAG,E(this.clonePosition(),this.clonePosition()))}else if(a===60&&!this.ignoreTag&&br(this.peek()||0)){var i=this.parseTag(t,r);if(i.err)return i;o.push(i.val)}else{var i=this.parseLiteral(t,r);if(i.err)return i;o.push(i.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:S.literal,value:"<".concat(o,"/>"),location:E(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var a=this.parseMessage(t+1,r,!0);if(a.err)return a;var i=a.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!br(this.char()))return this.error(b.INVALID_TAG,E(s,this.clonePosition()));var h=this.clonePosition(),c=this.parseTagName();return o!==c?this.error(b.UNMATCHED_CLOSING_TAG,E(h,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:S.tag,value:o,children:i,location:E(n,this.clonePosition())},err:null}:this.error(b.INVALID_TAG,E(s,this.clonePosition())))}else return this.error(b.UNCLOSED_TAG,E(n,this.clonePosition()))}else return this.error(b.INVALID_TAG,E(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&ai(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var a=this.tryParseQuote(r);if(a){o+=a;continue}var i=this.tryParseUnquoted(t,r);if(i){o+=i;continue}var s=this.tryParseLeftAngleBracket();if(s){o+=s;continue}break}var h=E(n,this.clonePosition());return{val:{type:S.literal,value:o,location:h},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!oi(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return gr.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),gr(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,E(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(b.EMPTY_ARGUMENT,E(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(b.MALFORMED_ARGUMENT,E(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,E(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:S.argument,value:o,location:E(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,E(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(b.MALFORMED_ARGUMENT,E(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=xr(this.message,r),o=r+n.length;this.bumpTo(o);var a=this.clonePosition(),i=E(t,a);return{value:n,location:i}},e.prototype.parseArgumentOptions=function(t,r,n,o){var a,i=this.clonePosition(),s=this.parseIdentifierIfPossible().value,h=this.clonePosition();switch(s){case"":return this.error(b.EXPECT_ARGUMENT_TYPE,E(i,h));case"number":case"date":case"time":{this.bumpSpace();var c=null;if(this.bumpIf(",")){this.bumpSpace();var l=this.clonePosition(),p=this.parseSimpleArgStyleIfPossible();if(p.err)return p;var u=ni(p.val);if(u.length===0)return this.error(b.EXPECT_ARGUMENT_STYLE,E(this.clonePosition(),this.clonePosition()));var g=E(l,this.clonePosition());c={style:u,styleLocation:g}}var x=this.tryParseArgumentClose(o);if(x.err)return x;var y=E(o,this.clonePosition());if(c&&Jn(c?.style,"::",0)){var P=ri(c.style.slice(2));if(s==="number"){var p=this.parseNumberSkeletonFromString(P,c.styleLocation);return p.err?p:{val:{type:S.number,value:n,location:y,style:p.val},err:null}}else{if(P.length===0)return this.error(b.EXPECT_DATE_TIME_SKELETON,y);var B=P;this.locale&&(B=Zn(P,this.locale));var u={type:te.dateTime,pattern:B,location:c.styleLocation,parsedOptions:this.shouldParseSkeletons?zn(B):{}},k=s==="date"?S.date:S.time;return{val:{type:k,value:n,location:y,style:u},err:null}}}return{val:{type:s==="number"?S.number:s==="date"?S.date:S.time,value:n,location:y,style:(a=c?.style)!==null&&a!==void 0?a:null},err:null}}case"plural":case"selectordinal":case"select":{var _=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(b.EXPECT_SELECT_ARGUMENT_OPTIONS,E(_,v({},_)));this.bumpSpace();var H=this.parseIdentifierIfPossible(),I=0;if(s!=="select"&&H.value==="offset"){if(!this.bumpIf(":"))return this.error(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,E(this.clonePosition(),this.clonePosition()));this.bumpSpace();var p=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,b.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(p.err)return p;this.bumpSpace(),H=this.parseIdentifierIfPossible(),I=p.val}var G=this.tryParsePluralOrSelectOptions(t,s,r,H);if(G.err)return G;var x=this.tryParseArgumentClose(o);if(x.err)return x;var le=E(o,this.clonePosition());return s==="select"?{val:{type:S.select,value:n,options:Qn(G.val),location:le},err:null}:{val:{type:S.plural,value:n,options:Qn(G.val),offset:I,pluralType:s==="plural"?"cardinal":"ordinal",location:le},err:null}}default:return this.error(b.INVALID_ARGUMENT_TYPE,E(i,h))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(b.EXPECT_ARGUMENT_CLOSING_BRACE,E(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(b.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,E(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=jn(t)}catch{return this.error(b.INVALID_NUMBER_SKELETON,r)}return{val:{type:te.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?Xn(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var a,i=!1,s=[],h=new Set,c=o.value,l=o.location;;){if(c.length===0){var p=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(b.EXPECT_PLURAL_ARGUMENT_SELECTOR,b.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;l=E(p,this.clonePosition()),c=this.message.slice(p.offset,this.offset())}else break}if(h.has(c))return this.error(r==="select"?b.DUPLICATE_SELECT_ARGUMENT_SELECTOR:b.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,l);c==="other"&&(i=!0),this.bumpSpace();var g=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:b.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,E(this.clonePosition(),this.clonePosition()));var x=this.parseMessage(t+1,r,n);if(x.err)return x;var y=this.tryParseArgumentClose(g);if(y.err)return y;s.push([c,{value:x.val,location:E(g,this.clonePosition())}]),h.add(c),this.bumpSpace(),a=this.parseIdentifierIfPossible(),c=a.value,l=a.location}return s.length===0?this.error(r==="select"?b.EXPECT_SELECT_ARGUMENT_SELECTOR:b.EXPECT_PLURAL_ARGUMENT_SELECTOR,E(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!i?this.error(b.MISSING_OTHER_CLAUSE,E(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var a=!1,i=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)a=!0,i=i*10+(s-48),this.bump();else break}var h=E(o,this.clonePosition());return a?(i*=n,ti(i)?{val:i,err:null}:this.error(r,h)):this.error(t,h)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=eo(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(Jn(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&no(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function br(e){return e>=97&&e<=122||e>=65&&e<=90}function oi(e){return br(e)||e===47}function ai(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function no(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function ii(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function yr(e){e.forEach(function(t){if(delete t.location,gt(t)||xt(t))for(var r in t.options)delete t.options[r].location,yr(t.options[r].value);else ut(t)&&yt(t.style)||(pt(t)||ft(t))&&Fe(t.style)?delete t.style.location:bt(t)&&yr(t.children)})}function oo(e,t){t===void 0&&(t={}),t=v({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new ro(e,t).parse();if(r.err){var n=SyntaxError(b[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||yr(r.val),r.val}function Ve(e,t){var r=t&&t.cache?t.cache:mi,n=t&&t.serializer?t.serializer:di,o=t&&t.strategy?t.strategy:ci;return o(e,{cache:r,serializer:n})}function si(e){return e==null||typeof e=="number"||typeof e=="boolean"}function ao(e,t,r,n){var o=si(n)?n:r(n),a=t.get(o);return typeof a>"u"&&(a=e.call(this,n),t.set(o,a)),a}function io(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),a=t.get(o);return typeof a>"u"&&(a=e.apply(this,n),t.set(o,a)),a}function vr(e,t,r,n,o){return r.bind(t,e,n,o)}function ci(e,t){var r=e.length===1?ao:io;return vr(e,this,r,t.cache.create(),t.serializer)}function li(e,t){return vr(e,this,io,t.cache.create(),t.serializer)}function hi(e,t){return vr(e,this,ao,t.cache.create(),t.serializer)}var di=function(){return JSON.stringify(arguments)};function Er(){this.cache=Object.create(null)}Er.prototype.get=function(e){return this.cache[e]};Er.prototype.set=function(e,t){this.cache[e]=t};var mi={create:function(){return new Er}},vt={variadic:li,monadic:hi};var re;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(re||(re={}));var je=function(e){Ge(t,e);function t(r,n,o){var a=e.call(this,r)||this;return a.code=n,a.originalMessage=o,a}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var wr=function(e){Ge(t,e);function t(r,n,o,a){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(o).join('", "'),'"'),re.INVALID_VALUE,a)||this}return t}(je);var so=function(e){Ge(t,e);function t(r,n,o){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),re.INVALID_VALUE,o)||this}return t}(je);var co=function(e){Ge(t,e);function t(r,n){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),re.MISSING_VALUE,n)||this}return t}(je);var O;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(O||(O={}));function ui(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==O.literal||r.type!==O.literal?t.push(r):n.value+=r.value,t},[])}function pi(e){return typeof e=="function"}function We(e,t,r,n,o,a,i){if(e.length===1&&dr(e[0]))return[{type:O.literal,value:e[0].value}];for(var s=[],h=0,c=e;h<c.length;h++){var l=c[h];if(dr(l)){s.push({type:O.literal,value:l.value});continue}if(Un(l)){typeof a=="number"&&s.push({type:O.literal,value:r.getNumberFormat(t).format(a)});continue}var p=l.value;if(!(o&&p in o))throw new co(p,i);var u=o[p];if(Dn(l)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?O.literal:O.object,value:u});continue}if(pt(l)){var g=typeof l.style=="string"?n.date[l.style]:Fe(l.style)?l.style.parsedOptions:void 0;s.push({type:O.literal,value:r.getDateTimeFormat(t,g).format(u)});continue}if(ft(l)){var g=typeof l.style=="string"?n.time[l.style]:Fe(l.style)?l.style.parsedOptions:n.time.medium;s.push({type:O.literal,value:r.getDateTimeFormat(t,g).format(u)});continue}if(ut(l)){var g=typeof l.style=="string"?n.number[l.style]:yt(l.style)?l.style.parsedOptions:void 0;g&&g.scale&&(u=u*(g.scale||1)),s.push({type:O.literal,value:r.getNumberFormat(t,g).format(u)});continue}if(bt(l)){var x=l.children,y=l.value,P=o[y];if(!pi(P))throw new so(y,"function",i);var B=We(x,t,r,n,o,a),k=P(B.map(function(I){return I.value}));Array.isArray(k)||(k=[k]),s.push.apply(s,k.map(function(I){return{type:typeof I=="string"?O.literal:O.object,value:I}}))}if(gt(l)){var _=l.options[u]||l.options.other;if(!_)throw new wr(l.value,u,Object.keys(l.options),i);s.push.apply(s,We(_.value,t,r,n,o));continue}if(xt(l)){var _=l.options["=".concat(u)];if(!_){if(!Intl.PluralRules)throw new je(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,re.MISSING_INTL_API,i);var H=r.getPluralRules(t,{type:l.pluralType}).select(u-(l.offset||0));_=l.options[H]||l.options.other}if(!_)throw new wr(l.value,u,Object.keys(l.options),i);s.push.apply(s,We(_.value,t,r,n,o,u-(l.offset||0)));continue}}return ui(s)}function fi(e,t){return t?v(v(v({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=v(v({},e[n]),t[n]||{}),r},{})):e}function gi(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=fi(e[n],t[n]),r},v({},e)):e}function Sr(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function xi(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ve(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,mt([void 0],r,!1)))},{cache:Sr(e.number),strategy:vt.variadic}),getDateTimeFormat:Ve(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,mt([void 0],r,!1)))},{cache:Sr(e.dateTime),strategy:vt.variadic}),getPluralRules:Ve(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,mt([void 0],r,!1)))},{cache:Sr(e.pluralRules),strategy:vt.variadic})}}var lo=function(){function e(t,r,n,o){var a=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(i){var s=a.formatToParts(i);if(s.length===1)return s[0].value;var h=s.reduce(function(c,l){return!c.length||l.type!==O.literal||typeof c[c.length-1]!="string"?c.push(l.value):c[c.length-1]+=l.value,c},[]);return h.length<=1?h[0]||"":h},this.formatToParts=function(i){return We(a.ast,a.locales,a.formatters,a.formats,i,void 0,a.message)},this.resolvedOptions=function(){return{locale:a.resolvedLocale.toString()}},this.getAst=function(){return a.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=gi(e.formats,n),this.formatters=o&&o.formatters||xi(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=oo,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var ho=lo;var bi=/[0-9\-+#]/,yi=/[^\d\-+#]/g;function mo(e){return e.search(bi)}function vi(e="#.##"){let t={},r=e.length,n=mo(e);t.prefix=n>0?e.substring(0,n):"";let o=mo(e.split("").reverse().join("")),a=r-o,i=e.substring(a,a+1),s=a+(i==="."||i===","?1:0);t.suffix=o>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let h=t.mask.match(yi);return t.decimal=h&&h[h.length-1]||".",t.separator=h&&h[1]&&h[0]||",",h=t.mask.split(t.decimal),t.integer=h[0],t.fraction=h[1],t}function Ei(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let a=t.fraction&&t.fraction.lastIndexOf("0"),[i="0",s=""]=o.value.split(".");return(!s||s&&s.length<=a)&&(s=a<0?"":(+("0."+s)).toFixed(a+1).replace("0.","")),o.integer=i,o.fraction=s,wi(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function wi(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let a=r[1]&&r[r.length-1].length;if(a){let i=e.integer.length,s=i%a;for(let h=0;h<i;h++)e.result+=e.integer.charAt(h),!((h-s+1)%a)&&h<i-a&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Si(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=vi(e),o=Ei(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var uo=Si;var po=".",Ai=",",go=/^\s+/,xo=/\s+$/,fo="&nbsp;",Ar=e=>e*12,bo=(e,t)=>{let{start:r,end:n,displaySummary:{amount:o,duration:a,minProductQuantity:i,outcomeType:s}={}}=e;if(!(o&&a&&s&&i))return!1;let h=t?new Date(t):new Date;if(!r||!n)return!1;let c=new Date(r),l=new Date(n);return h>=c&&h<=l},ne={MONTH:"MONTH",YEAR:"YEAR"},Ti={[C.ANNUAL]:12,[C.MONTHLY]:1,[C.THREE_YEARS]:36,[C.TWO_YEARS]:24},Tr=(e,t)=>({accept:e,round:t}),_i=[Tr(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),Tr(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),Tr(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],_r={[R.YEAR]:{[C.MONTHLY]:ne.MONTH,[C.ANNUAL]:ne.YEAR},[R.MONTH]:{[C.MONTHLY]:ne.MONTH}},Ci=(e,t)=>e.indexOf(`'${t}'`)===0,Li=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=vo(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Ni(e)),r},Pi=e=>{let t=ki(e),r=Ci(e,t),n=e.replace(/'.*?'/,""),o=go.test(n)||xo.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},yo=e=>e.replace(go,fo).replace(xo,fo),Ni=e=>e.match(/#(.?)#/)?.[1]===po?Ai:po,ki=e=>e.match(/'(.*?)'/)?.[1]??"",vo=e=>e.match(/0(.?)0/)?.[1]??"";function Le({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,a=i=>i){let{currencySymbol:i,isCurrencyFirst:s,hasCurrencySpace:h}=Pi(e),c=r?vo(e):"",l=Li(e,r),p=r?2:0,u=a(t,{currencySymbol:i}),g=n?u.toLocaleString("hi-IN",{minimumFractionDigits:p,maximumFractionDigits:p}):uo(l,u),x=r?g.lastIndexOf(c):g.length,y=g.substring(0,x),P=g.substring(x+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,g).replace(/SYMBOL/,i),currencySymbol:i,decimals:P,decimalsDelimiter:c,hasCurrencySpace:h,integer:y,isCurrencyFirst:s,recurrenceTerm:o}}var Eo=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Ti[r]??1;return Le(e,o>1?ne.MONTH:_r[t]?.[r],a=>{let i={divisor:o,price:a,usePrecision:n},{round:s}=_i.find(({accept:h})=>h(i));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(i)}`);return s(i)})},wo=({commitment:e,term:t,...r})=>Le(r,_r[e]?.[t]),So=e=>{let{commitment:t,instant:r,price:n,originalPrice:o,priceWithoutDiscount:a,promotion:i,quantity:s=1,term:h}=e;if(t===R.YEAR&&h===C.MONTHLY){if(!i)return Le(e,ne.YEAR,Ar);let{displaySummary:{outcomeType:c,duration:l,minProductQuantity:p=1}={}}=i;switch(c){case"PERCENTAGE_DISCOUNT":if(s>=p&&bo(i,r)){let u=parseInt(l.replace("P","").replace("M",""));if(isNaN(u))return Ar(n);let g=s*o*u,x=s*a*(12-u),y=Math.floor((g+x)*100)/100;return Le({...e,price:y},ne.YEAR)}default:return Le(e,ne.YEAR,()=>Ar(a??n))}}return Le(e,_r[t]?.[h])};var Oi={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Ri=Nn("ConsonantTemplates/price"),Mi=/<\/?[^>]+(>|$)/g,N={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},oe={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},Hi="TAX_EXCLUSIVE",Ii=e=>Pn(e)?Object.entries(e).filter(([,t])=>Ae(t)||lt(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+Cn(n)+'"'}`,""):"",M=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+N.disabled}"${Ii(r)}>${n?yo(t):t??""}</span>`;function Bi(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:a,integer:i,isCurrencyFirst:s,recurrenceLabel:h,perUnitLabel:c,taxInclusivityLabel:l},p={}){let u=M(N.currencySymbol,r),g=M(N.currencySpace,a?"&nbsp;":""),x="";return s&&(x+=u+g),x+=M(N.integer,i),x+=M(N.decimalsDelimiter,o),x+=M(N.decimals,n),s||(x+=g+u),x+=M(N.recurrence,h,null,!0),x+=M(N.unitType,c,null,!0),x+=M(N.taxInclusivity,l,!0),M(e,x,{...p,"aria-label":t})}var z=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1,instant:n=void 0}={})=>({country:o,displayFormatted:a=!0,displayRecurrence:i=!0,displayPerUnit:s=!1,displayTax:h=!1,language:c,literals:l={},quantity:p=1}={},{commitment:u,offerSelectorIds:g,formatString:x,price:y,priceWithoutDiscount:P,taxDisplay:B,taxTerm:k,term:_,usePrecision:H,promotion:I}={},G={})=>{Object.entries({country:o,formatString:x,language:c,price:y}).forEach(([j,Nt])=>{if(Nt==null)throw new Error(`Argument "${j}" is missing for osi ${g?.toString()}, country ${o}, language ${c}`)});let le={...Oi,...l},_t=`${c.toLowerCase()}-${o.toUpperCase()}`;function q(j,Nt){let kt=le[j];if(kt==null)return"";try{return new ho(kt.replace(Mi,""),_t).format(Nt)}catch{return Ri.error("Failed to format literal:",kt),""}}let Ct=t&&P?P:y,Je=e?Eo:wo;r&&(Je=So);let{accessiblePrice:Lt,recurrenceTerm:he,...Ne}=Je({commitment:u,formatString:x,instant:n,isIndianPrice:o==="IN",originalPrice:y,priceWithoutDiscount:P,price:e?y:Ct,promotion:I,quantity:p,term:_,usePrecision:H}),V=Lt,ke="";if(L(i)&&he){let j=q(oe.recurrenceAriaLabel,{recurrenceTerm:he});j&&(V+=" "+j),ke=q(oe.recurrenceLabel,{recurrenceTerm:he})}let Pt="";if(L(s)){Pt=q(oe.perUnitLabel,{perUnit:"LICENSE"});let j=q(oe.perUnitAriaLabel,{perUnit:"LICENSE"});j&&(V+=" "+j)}let Oe="";L(h)&&k&&(Oe=q(B===Hi?oe.taxExclusiveLabel:oe.taxInclusiveLabel,{taxTerm:k}),Oe&&(V+=" "+Oe)),t&&(V=q(oe.strikethroughAriaLabel,{strikethroughPrice:V}));let Re=N.container;if(e&&(Re+=" "+N.containerOptical),t&&(Re+=" "+N.containerStrikethrough),r&&(Re+=" "+N.containerAnnual),L(a))return Bi(Re,{...Ne,accessibleLabel:V,recurrenceLabel:ke,perUnitLabel:Pt,taxInclusivityLabel:Oe},G);let{currencySymbol:Br,decimals:qo,decimalsDelimiter:Yo,hasCurrencySpace:Dr,integer:Xo,isCurrencyFirst:Zo}=Ne,de=[Xo,Yo,qo];Zo?(de.unshift(Dr?"\xA0":""),de.unshift(Br)):(de.push(Dr?"\xA0":""),de.push(Br)),de.push(ke,Pt,Oe);let Ko=de.join("");return M(Re,Ko,G)},Ao=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||L(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${z()(e,t,r)}${o?"&nbsp;"+z({displayStrikethrough:!0})(e,t,r):""}`},To=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let o={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||L(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?z({displayStrikethrough:!0})(o,t,r)+"&nbsp;":""}${z()(e,t,r)}${M(N.containerAnnualPrefix,"&nbsp;(")}${z({displayAnnual:!0,instant:n})(o,t,r)}${M(N.containerAnnualSuffix,")")}`},_o=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${z()(e,t,r)}${M(N.containerAnnualPrefix,"&nbsp;(")}${z({displayAnnual:!0})(n,t,r)}${M(N.containerAnnualSuffix,")")}`};var Di=z(),Ui=Ao(),zi=z({displayOptical:!0}),Gi=z({displayStrikethrough:!0}),Fi=z({displayAnnual:!0}),$i=_o(),Vi=To();var ji=(e,t)=>{if(!(!Ce(e)||!Ce(t)))return Math.floor((t-e)/t*100)},Co=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,o=ji(r,n);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var Wi=Co();var{freeze:qe}=Object,ae=qe({...ee}),ie=qe({...F}),Cr={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},ip=qe({...R}),sp=qe({...Bn}),cp=qe({...C});var Lo="mas-commerce-service";function Po(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(Lo);o!==r&&(r=o,o&&e(o))}return document.addEventListener(Ht,n,{once:t}),Ye(n),()=>document.removeEventListener(Ht,n)}function No(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let a=t==="GB"||n?"EN":"MULT",[i,s]=e;o=[i.language===a?i:s]}return r&&(o=o.map(lr)),o}var Ye=e=>window.setTimeout(e);function Lr(e,t=1){if(e==null)return[t];let r=(Array.isArray(e)?e:String(e).split(",")).map(ht).filter(Ce);return r.length||(r=[t]),r}function ko(e){return e==null?[]:(Array.isArray(e)?e:String(e).split(",")).filter(ar)}function se(){return document.getElementsByTagName(Lo)?.[0]}var ce={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Oo=1e3,Ro=new Set;function qi(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Mo(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:a}=e;return[n,a,o].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ce.serializableTypes.includes(r))return r}return e}function Yi(e,t){if(!ce.ignoredProperties.includes(e))return Mo(t)}var Pr={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],o=[],a=t;r.forEach(c=>{c!=null&&(qi(c)?n:o).push(c)}),n.length&&(a+=" "+n.map(Mo).join(" "));let{pathname:i,search:s}=window.location,h=`${ce.delimiter}page=${i}${s}`;h.length>Oo&&(h=`${h.slice(0,Oo)}<trunc>`),a+=h,o.length&&(a+=`${ce.delimiter}facts=`,a+=JSON.stringify(o,Yi)),Ro.has(a)||(Ro.add(a),window.lana?.log(a,ce))}};function Ho(e){Object.assign(ce,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ce&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var Pe=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:ae.V3,checkoutWorkflowStep:ie.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Cr.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:Dt.PUBLISHED,wcsBufferLimit:1});var Nr=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});var kr={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},Xi=Date.now(),Or=new Set,Rr=new Set,Io=new Map,Bo={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},Do={filter:({level:e})=>e!==kr.DEBUG},Zi={filter:()=>!1};function Ki(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){return n.length===1&&Ue(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:o,timestamp:Date.now()-Xi}}function Ji(e){[...Rr].every(t=>t(e))&&Or.forEach(t=>t(e))}function Uo(e){let t=(Io.get(e)??0)+1;Io.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:o=>Uo(`${n.namespace}/${o}`),updateConfig:Ho};return Object.values(kr).forEach(o=>{n[o]=(a,...i)=>Ji(Ki(o,a,e,i,r))}),Object.seal(n)}function Et(...e){e.forEach(t=>{let{append:r,filter:n}=t;Ue(n)&&Rr.add(n),Ue(r)&&Or.add(r)})}function Qi(e={}){let{name:t}=e,r=L(Te("commerce.debug",{search:!0,storage:!0}),t===Nr.LOCAL);return Et(r?Bo:Do),t===Nr.PROD&&Et(Pr),Mr}function es(){Or.clear(),Rr.clear()}var Mr={...Uo(nn),Level:kr,Plugins:{consoleAppender:Bo,debugFilter:Do,quietFilter:Zi,lanaAppender:Pr},init:Qi,reset:es,use:Et};var ts={[Y]:Jr,[K]:Qr,[X]:en},rs={[Y]:tn,[X]:rn},wt=class{constructor(t){f(this,"changes",new Map);f(this,"connected",!1);f(this,"dispose",_e);f(this,"error");f(this,"log");f(this,"options");f(this,"promises",[]);f(this,"state",K);f(this,"timer",null);f(this,"value");f(this,"version",0);f(this,"wrapperElement");this.wrapperElement=t}update(){[Y,K,X].forEach(t=>{this.wrapperElement.classList.toggle(ts[t],t===this.state)})}notify(){(this.state===X||this.state===Y)&&(this.state===X?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===Y&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(rs[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){this.dispose=Po(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=_e}onceSettled(){let{error:t,promises:r,state:n}=this;return X===n?Promise.resolve(this.wrapperElement):Y===n?Promise.reject(t):new Promise((o,a)=>{r.push({resolve:o,reject:a})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=X,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Ye(()=>this.notify()),!0)}toggleFailed(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.error=r,this.state=Y,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),Ye(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=K,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!se()||this.timer)return;let r=Mr.module("mas-element"),{error:n,options:o,state:a,value:i,version:s}=this;this.state=K,this.timer=Ye(async()=>{this.timer=null;let h=null;if(this.changes.size&&(h=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:h}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:h})),h||t)try{await this.wrapperElement.render?.()===!1&&this.state===K&&this.version===s&&(this.state=a,this.error=n,this.value=i,this.update(),this.notify())}catch(c){r.error("Failed to render mas-element: ",c),this.toggleFailed(this.version,c,o)}})}};function zo(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function Go(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,zo(t)),o}function Fo(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,zo(t)),e):null}var ns="download",os="upgrade";function St(e,t={},r=""){let n=se();if(!n)return null;let{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:i,entitlement:s,upgrade:h,modal:c,perpetual:l,promotionCode:p,quantity:u,wcsOsi:g,extraOptions:x}=n.collectCheckoutOptions(t),y=Go(e,{checkoutMarketSegment:o,checkoutWorkflow:a,checkoutWorkflowStep:i,entitlement:s,upgrade:h,modal:c,perpetual:l,promotionCode:p,quantity:u,wcsOsi:g,extraOptions:x});return r&&(y.innerHTML=`<span style="pointer-events: none;">${r}</span>`),y}function At(e){return class extends e{constructor(){super(...arguments);f(this,"checkoutActionHandler");f(this,"masElement",new wt(this))}attributeChangedCallback(n,o,a){this.masElement.attributeChangedCallback(n,o,a)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){if(!this.isConnected)return!1;let o=se();if(!o)return!1;this.dataset.imsCountry||o.imsCountryPromise.then(p=>{p&&(this.dataset.imsCountry=p)},_e),n.imsCountry=null;let a=o.collectCheckoutOptions(n,this);if(!a.wcsOsi.length)return!1;let i;try{i=JSON.parse(a.extraOptions??"{}")}catch(p){this.masElement.log?.error("cannot parse exta checkout options",p)}let s=this.masElement.togglePending(a);this.setCheckoutUrl("");let h=o.resolveOfferSelectors(a),c=await Promise.all(h);c=c.map(p=>No(p,a)),a.country=this.dataset.imsCountry||a.country;let l=await o.buildCheckoutAction?.(c.flat(),{...i,...a},this);return this.renderOffers(c.flat(),a,{},l,s)}renderOffers(n,o,a={},i=void 0,s=void 0){if(!this.isConnected)return!1;let h=se();if(!h)return!1;if(o={...JSON.parse(this.dataset.extraOptions??"null"),...o,...a},s??(s=this.masElement.togglePending(o)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),i){this.classList.remove(ns,os),this.masElement.toggleResolved(s,n,o);let{url:l,text:p,className:u,handler:g}=i;return l&&this.setCheckoutUrl(l),p&&(this.firstElementChild.innerHTML=p),u&&this.classList.add(...u.split(" ")),g&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=g.bind(this)),!0}else if(n.length){if(this.masElement.toggleResolved(s,n,o)){let l=h.buildCheckoutURL(n,o);return this.setCheckoutUrl(l),!0}}else{let l=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,l,o))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let o=se();if(!o)return!1;let{checkoutMarketSegment:a,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:h,upgrade:c,modal:l,perpetual:p,promotionCode:u,quantity:g,wcsOsi:x}=o.collectCheckoutOptions(n);return Fo(this,{checkoutMarketSegment:a,checkoutWorkflow:i,checkoutWorkflowStep:s,entitlement:h,upgrade:c,modal:l,perpetual:p,promotionCode:u,quantity:g,wcsOsi:x}),!0}}}var Xe=class Xe extends At(HTMLButtonElement){static createCheckoutButton(t={},r=""){return St(Xe,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};f(Xe,"is","checkout-button"),f(Xe,"tag","button");var Z=Xe;window.customElements.get(Z.is)||window.customElements.define(Z.is,Z,{extends:Z.tag});var Ze=class Ze extends At(HTMLAnchorElement){static createCheckoutLink(t={},r=""){return St(Ze,t,r)}setCheckoutUrl(t){this.setAttribute("href",t)}get isCheckoutLink(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}}};f(Ze,"is","checkout-link"),f(Ze,"tag","a");var W=Ze;window.customElements.get(W.is)||window.customElements.define(W.is,W,{extends:W.tag});function $o({providers:e,settings:t}){function r(a,i){let{checkoutClientId:s,checkoutWorkflow:h,checkoutWorkflowStep:c,country:l,language:p,promotionCode:u,quantity:g}=t,{checkoutMarketSegment:x,checkoutWorkflow:y=h,checkoutWorkflowStep:P=c,imsCountry:B,country:k=B??l,language:_=p,quantity:H=g,entitlement:I,upgrade:G,modal:le,perpetual:_t,promotionCode:q=u,wcsOsi:Ct,extraOptions:Je,...Lt}=Object.assign({},i?.dataset??{},a??{}),he=ze(y,ae,Pe.checkoutWorkflow),Ne=ie.CHECKOUT;he===ae.V3&&(Ne=ze(P,ie,Pe.checkoutWorkflowStep));let V=ir({...Lt,extraOptions:Je,checkoutClientId:s,checkoutMarketSegment:x,country:k,quantity:Lr(H,Pe.quantity),checkoutWorkflow:he,checkoutWorkflowStep:Ne,language:_,entitlement:L(I),upgrade:L(G),modal:L(le),perpetual:L(_t),promotionCode:cr(q).effectivePromoCode,wcsOsi:ko(Ct)});if(i)for(let ke of e.checkout)ke(i,V);return V}function n(a,i){if(!Array.isArray(a)||!a.length||!i)return"";let{env:s,landscape:h}=t,{checkoutClientId:c,checkoutMarketSegment:l,checkoutWorkflow:p,checkoutWorkflowStep:u,country:g,promotionCode:x,quantity:y,...P}=r(i),B=window.frameElement?"if":"fp",k={checkoutPromoCode:x,clientId:c,context:B,country:g,env:s,items:[],marketSegment:l,workflowStep:u,landscape:h,...P};if(a.length===1){let[{offerId:_,offerType:H,productArrangementCode:I}]=a,{marketSegments:[G]}=a[0];Object.assign(k,{marketSegment:G,offerType:H,productArrangementCode:I}),k.items.push(y[0]===1?{id:_}:{id:_,quantity:y[0]})}else k.items.push(...a.map(({offerId:_},H)=>({id:_,quantity:y[H]??Pe.quantity})));return Qt(p,k)}let{createCheckoutLink:o}=W;return{CheckoutLink:W,CheckoutWorkflow:ae,CheckoutWorkflowStep:ie,buildCheckoutURL:n,collectCheckoutOptions:r,createCheckoutLink:o}}var as="#000000",is="#F8D904",ss=/(accent|primary|secondary)(-(outline|link))?/,cs="mas:product_code/",ls="daa-ll",Tt="daa-lh",hs=["XL","L","M","S"],Hr="...";function ds(e,t,r){e.mnemonicIcon?.map((o,a)=>({icon:o,alt:e.mnemonicAlt[a]??"",link:e.mnemonicLink[a]??""}))?.forEach(({icon:o,alt:a,link:i})=>{if(i&&!/^https?:/.test(i))try{i=new URL(`https://${i}`).href.toString()}catch{i="#"}let s={slot:"icons",src:o,loading:t.loading,size:r?.size??"l"};a&&(s.alt=a),i&&(s.href=i);let h=U("merch-icon",s);t.append(h)})}function ms(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||as),t.setAttribute("badge-background-color",e.badgeBackgroundColor||is))}function us(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function ps(e,t,r){if(e.cardTitle&&r){let n={slot:r.slot},o=e.cardTitle,{maxCount:a}=r;if(a){let[i,s]=Vo(e.cardTitle,a);i!==e.cardTitle&&(n.title=s,o=i)}t.append(U(r.tag,n,o))}}function fs(e,t,r){e.subtitle&&r&&t.append(U(r.tag,{slot:r.slot},e.subtitle))}function gs(e,t,r){r?.includes(e.backgroundColor)&&t.setAttribute("background-color",e.backgroundColor)}function xs(e,t,r){if(e.backgroundImage){let n={loading:t.loading??"lazy",src:e.backgroundImage};if(e.backgroundImageAltText?n.alt=e.backgroundImageAltText:n.role="none",!r)return;if(r?.attribute){t.setAttribute(r.attribute,e.backgroundImage);return}t.spectrum==="swc"?t.shadowRoot.append(U(r.tag,{slot:r.slot,class:"image"},U("img",n))):t.append(U(r.tag,{slot:r.slot},U("img",n)))}}function bs(e,t,r){if(e.prices&&r){let n=U(r.tag,{slot:r.slot},e.prices);t.append(n)}}function ys(e,t,r){if(e.description&&r){let n={slot:r.slot},o=e.description,{maxCount:a}=r;if(a){let[i,s]=Vo(e.description,a,!1);i!==e.description&&(n.title=s,o=i)}t.append(U(r.tag,n,o))}}function Vo(e,t,r=!0){let n=vs(e);if(n.length<=t)return[e,n];let o=0,a=!1,i=r?t-Hr.length<1?1:t-Hr.length:t,s=[];for(let l of e){if(o++,l==="<")if(a=!0,e[o]==="/")s.pop();else{let p="";for(let u of e.substring(o)){if(u===" "||u===">")break;p+=u}s.push(p)}if(l==="/"&&e[o]===">"&&s.pop(),l===">"){a=!1;continue}if(!a&&(i--,i===0))break}let h=e.substring(0,o).trim();if(s.length>0){s[0]==="p"&&s.shift();for(let l of s.reverse())h+=`</${l}>`}return[`${h}${r?Hr:""}`,n]}function vs(e){let t="",r=!1;for(let n of e){if(n==="<"&&(r=!0),n===">"){r=!1;continue}r||(t+=n)}return t}function Es(e,t,r,n){let a=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);a.setAttribute("tabindex",0);for(let l of e.attributes)["class","is"].includes(l.name)||a.setAttribute(l.name,l.value);a.firstElementChild?.classList.add("spectrum-Button-label");let i=t.ctas.size??"M",s=`spectrum-Button--${n}`,h=hs.includes(i)?`spectrum-Button--size${i}`:"spectrum-Button--sizeM",c=["spectrum-Button",s,h];return r&&c.push("spectrum-Button--outline"),a.classList.add(...c),a}function ws(e,t,r,n){let o="fill";r&&(o="outline");let a=U("sp-button",{treatment:o,variant:n,tabIndex:0,size:t.ctas.size??"m"},e.innerHTML),c=$o({providers:{checkout:[]},settings:{}}).collectCheckoutOptions({},e),l=Z.createCheckoutButton(c,""),p=document.createElement("div");return p.style.cssText="position: absolute; width: 0; height: 0; overflow: hidden; pointer-events: none;",document.body.appendChild(p),p.appendChild(l),l.connectedCallback?.(),l.requestUpdate?.(),l.onceSettled().then(()=>{p.parentNode&&p.parentNode.removeChild(p),a.addEventListener("click",u=>{u.stopPropagation(),typeof l.clickHandler=="function"?l.clickHandler(u):l.href&&l.href!=="#"?window.location.href=l.href:console.warn("No checkout action is available.")})}).catch(u=>{console.error("Checkout button is not ready:",u)}),a}function Ss(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function As(e,t,r,n){if(e.ctas){let{slot:o}=r.ctas,a=U("div",{slot:o},e.ctas),i=[...a.querySelectorAll("a")].map(s=>{let h=s.parentElement.tagName==="STRONG";if(t.consonant)return Ss(s,h);let c=ss.exec(s.className)?.[0]??"accent",l=c.includes("accent"),p=c.includes("primary"),u=c.includes("secondary"),g=c.includes("-outline");if(c.includes("-link"))return s;let y;return l||h?y="accent":p?y="primary":u&&(y="secondary"),t.spectrum==="swc"?ws(s,r,g,y):Es(s,r,g,y)});a.innerHTML="",a.append(...i),t.spectrum==="swc"?(t.shadowRoot.append(a),a.classList.add("footer")):t.append(a)}}function Ts(e,t){let{tags:r}=e,n=r?.find(a=>a.startsWith(cs))?.split("/").pop();if(!n)return;t.setAttribute(Tt,n),[...t.shadowRoot.querySelectorAll("a[data-analytics-id],button[data-analytics-id]"),...t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]")].forEach((a,i)=>{a.setAttribute(ls,`${a.dataset.analyticsId}-${i+1}`)})}function _s(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(n=>{n.classList.remove(t),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}async function jo(e,t){let{fields:r}=e,{variant:n}=r;if(!n)return;t.querySelectorAll("[slot]").forEach(a=>{a.remove()}),t.removeAttribute("background-image"),t.removeAttribute("background-color"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.classList.remove("wide-strip"),t.classList.remove("thin-strip"),t.removeAttribute(Tt),t.variant=n,await t.updateComplete;let{aemFragmentMapping:o}=t.variantLayout;o&&(ds(r,t,o.mnemonics),ms(r,t),us(r,t,o.size),ps(r,t,o.title),fs(r,t,o.subtitle),bs(r,t,o.prices),xs(r,t,o.backgroundImage),gs(r,t,o.allowedColors),ys(r,t,o.description),As(r,t,o,n),Ts(r,t),_s(t))}var Ls="merch-card",Ps=":start",Ns=":ready",ks=1e4,Wo="merch-card:",Ke,Ir,m=class extends Cs{constructor(){super();me(this,Ke);f(this,"customerSegment");f(this,"marketSegment");f(this,"variantLayout");this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.loading="lazy",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}static getFragmentMapping(r){return yn[r]}firstUpdated(){this.variantLayout=Yt(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=Yt(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let a=o.value?.[0]?.planType;if(!a)return;let i=this.stockOfferOsis[a];if(!i)return;let s=o.dataset.wcsOsi.split(",").filter(h=>h!==i);r.checked&&s.push(i),o.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let a=n[o].order;a===1||isNaN(a)||(n[o].order=Number(a)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback();let r=this.querySelector("aem-fragment")?.getAttribute("fragment");performance.mark(`${Wo}${r}${Ps}`),this.addEventListener(Bt,this.handleQuantitySelection),this.addEventListener(qr,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(nt,this.handleAemFragmentEvents),this.addEventListener(rt,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(Bt,this.handleQuantitySelection),this.storageOptions?.removeEventListener(It,this.handleStorageChange),this.removeEventListener(nt,this.handleAemFragmentEvents),this.removeEventListener(rt,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===nt&&Mt(this,Ke,Ir).call(this,"AEM fragment cannot be loaded"),r.type===rt&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;await jo(n,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(a=>a.onceSettled().catch(()=>a))).then(a=>a.every(i=>i.classList.contains("placeholder-resolved"))),n=new Promise(a=>setTimeout(()=>a(!1),ks));if(await Promise.race([r,n])===!0){performance.mark(`${Wo}${this.id}${Ns}`),this.dispatchEvent(new CustomEvent(Zr,{bubbles:!0,composed:!0}));return}Mt(this,Ke,Ir).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll('a[is="checkout-link"].con-button')).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(Yr,{bubbles:!0})),this.displayFooterElementsInColumn())}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(It,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};Ke=new WeakSet,Ir=function(r){this.dispatchEvent(new CustomEvent(Kr,{detail:r,bubbles:!0,composed:!0}))},f(m,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,o,a]=r.split(",");return{PUF:n,ABM:o,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,a,i]=n.split(":"),s=Number(a);return[o,{order:isNaN(s)?void 0:s,size:i}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:a}])=>[n,o,a].filter(i=>i!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Tt,reflect:!0},loading:{type:String}}),f(m,"styles",[Vr,vn(),...jr()]);customElements.define(Ls,m);

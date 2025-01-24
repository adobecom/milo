var yo=Object.defineProperty;var cr=e=>{throw TypeError(e)};var Eo=(e,t,r)=>t in e?yo(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var p=(e,t,r)=>Eo(e,typeof t!="symbol"?t+"":t,r),dt=(e,t,r)=>t.has(e)||cr("Cannot "+r);var mt=(e,t,r)=>(dt(e,t,"read from private field"),r?r.call(e):t.get(e)),De=(e,t,r)=>t.has(e)?cr("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),lr=(e,t,r,n)=>(dt(e,t,"write to private field"),n?n.call(e,r):t.set(e,r),r),pt=(e,t,r)=>(dt(e,t,"access private method"),r);import{LitElement as Da}from"../lit-all.min.js";import{LitElement as wo,html as hr,css as So}from"../lit-all.min.js";var d=class extends wo{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?hr`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:hr` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};p(d,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),p(d,"styles",So`
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
    `);customElements.define("merch-icon",d);import{css as mr,unsafeCSS as dr}from"../lit-all.min.js";var G="(max-width: 767px)",Ue="(max-width: 1199px)",T="(min-width: 768px)",A="(min-width: 1200px)",M="(min-width: 1600px)";var pr=mr`
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
`,ur=()=>[mr`
        /* Tablet */
        @media screen and ${dr(T)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${dr(A)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];import{html as ze}from"../lit-all.min.js";var oe,ye=class ye{constructor(t){p(this,"card");De(this,oe);this.card=t,this.insertVariantStyle()}getContainer(){return lr(this,oe,mt(this,oe)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),mt(this,oe)}insertVariantStyle(){if(!ye.styleMap[this.card.variant]){ye.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let n=`--consonant-merch-card-${this.card.variant}-${r}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),i=parseInt(this.getContainer().style.getPropertyValue(n))||0;o>i&&this.getContainer().style.setProperty(n,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),ze`
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
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get secureLabelFooter(){let t=this.card.secureLabel?ze`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return ze`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};oe=new WeakMap,p(ye,"styleMap",{});var w=ye;import{html as bt,css as Ao}from"../lit-all.min.js";function I(e,t={},r=null,n=null){let o=n?document.createElement(e,{is:n}):document.createElement(e);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[i,a]of Object.entries(t))o.setAttribute(i,a);return o}function Ge(){return window.matchMedia("(max-width: 767px)").matches}function fr(){return window.matchMedia("(max-width: 1024px)").matches}var ut="wcms:commerce:ready";var gr="merch-offer-select:ready",xr="merch-card:ready",br="merch-card:action-menu-toggle";var ft="merch-storage:change",gt="merch-quantity-selector:change";var Fe="aem:load",$e="aem:error",vr="mas:ready",yr="mas:error",Er="placeholder-failed",wr="placeholder-pending",Sr="placeholder-resolved";var Ar="mas:failed",Tr="mas:resolved",_r="mas/commerce";var F="failed",Y="pending",$="resolved",xt={DRAFT:"DRAFT",PUBLISHED:"PUBLISHED"};var Lr=`
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
}`;var To={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"m"},allowedSizes:["wide","super-wide"]},ie=class extends w{constructor(r){super(r);p(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(br,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});p(this,"toggleActionMenu",r=>{let n=this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');!n||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),n.classList.toggle("hidden"),n.classList.contains("hidden")||this.dispatchActionMenuToggle())});p(this,"toggleActionMenuFromCard",r=>{let n=r?.type==="mouseleave"?!0:void 0,o=this.card.shadowRoot,i=o.querySelector(".action-menu");this.card.blur(),i?.classList.remove("always-visible");let a=o.querySelector('slot[name="action-menu-content"]');a&&(n||this.dispatchActionMenuToggle(),a.classList.toggle("hidden",n))});p(this,"hideActionMenu",r=>{this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')?.classList.add("hidden")});p(this,"focusEventHandler",r=>{let n=this.card.shadowRoot.querySelector(".action-menu");n&&(n.classList.add("always-visible"),(r.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||r.relatedTarget?.nodeName==="MERCH-CARD"&&r.target.nodeName!=="MERCH-ICON")&&n.classList.remove("always-visible"))})}get aemFragmentMapping(){return To}renderLayout(){return bt` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${fr()&&this.card.actionMenu?"always-visible":""}
                ${this.card.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                        @keypress="${this.toggleActionMenu}"
                        tabindex="0"
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
                ${this.promoBottom?"":bt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?bt`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return Lr}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};p(ie,"variantStyle",Ao`
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
    `);import{html as Ee}from"../lit-all.min.js";var Cr=`
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
`;var Ve=class extends w{constructor(t){super(t)}getGlobalCSS(){return Cr}renderLayout(){return Ee`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?Ee`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:Ee`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?Ee`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:Ee`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as Nr}from"../lit-all.min.js";var Pr=`
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

@media screen and ${M} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`;var je=class extends w{constructor(t){super(t)}getGlobalCSS(){return Pr}renderLayout(){return Nr` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":Nr`<hr />`} ${this.secureLabelFooter}`}};import{html as ae,css as _o,unsafeCSS as Or}from"../lit-all.min.js";var Rr=`
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

@media screen and ${Ue} {
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
`;var Lo=32,se=class extends w{constructor(r){super(r);p(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);p(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?ae`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:ae`<slot name="secure-transaction-label"></slot>`;return ae`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Rr}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section");let r=["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"];this.card.classList.contains("bullet-list")&&r.push("footer-rows"),r.forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let n=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");n&&n.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"] ul')?.children].forEach((n,o)=>{let i=Math.max(Lo,parseFloat(window.getComputedStyle(n).height)||0),a=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;i>a&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${i}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(n=>{let o=n.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&n.remove()})}renderLayout(){return ae` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        ${this.card.classList.contains("bullet-list")?ae`<slot name="heading-m-price"></slot>
          <slot name="body-m"></slot>`:ae`<slot name="body-m"></slot>
          <slot name="heading-m-price"></slot>`}
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){Ge()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};p(se,"variantStyle",_o`
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

    @media screen and ${Or(Ue)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Or(A)} {
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
  `);import{html as Ye,css as Co}from"../lit-all.min.js";var Hr=`
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
    @media screen and ${M} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`;var ce=class extends w{constructor(t){super(t)}getGlobalCSS(){return Hr}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?Ye`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return Ye` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":Ye`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?Ye`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};p(ce,"variantStyle",Co`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as vt,css as Po}from"../lit-all.min.js";var Mr=`
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
`;var W=class extends w{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return Mr}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return vt` ${this.badge}
      <div class="body" aria-live="polite">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":vt`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?vt`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(Ge()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};p(W,"variantStyle",Po`
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
  `);import{html as yt,css as No}from"../lit-all.min.js";var kr=`
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
`;var le=class extends w{constructor(t){super(t)}getGlobalCSS(){return kr}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return yt` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":yt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?yt`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};p(le,"variantStyle",No`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as Et,css as Ro}from"../lit-all.min.js";var Ir=`
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

@media screen and ${M} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`;var Oo={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},he=class extends w{constructor(t){super(t)}getGlobalCSS(){return Ir}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return Oo}renderLayout(){return Et`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Et`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Et`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};p(he,"variantStyle",Ro`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as Ho,css as Mo}from"../lit-all.min.js";var Br=`
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

@media screen and ${M} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`;var de=class extends w{constructor(t){super(t)}getGlobalCSS(){return Br}renderLayout(){return Ho`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};p(de,"variantStyle",Mo`
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
  `);import{html as ko,css as Io}from"../lit-all.min.js";var Dr=`

  merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
    font-size: var(--consonant-merch-card-heading-xxs-font-size);
    line-height: var(--consonant-merch-card-heading-xxs-line-height);
  }
  
  merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
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
`;var Bo={mnemonics:{size:"l"},subtitle:{tag:"h4",slot:"detail-s"},backgroundImage:{attribute:"background-image"},title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"price"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"cta",size:"M"}},me=class extends w{getGlobalCSS(){return Dr}get aemFragmentMapping(){return Bo}get stripStyle(){return this.card.backgroundImage?`
            background: url("${this.card.backgroundImage}");
        background-size: auto 100%;
        background-repeat: no-repeat;
        background-position: ${this.card.dir==="ltr"?"left":"right"};
        `:""}renderLayout(){return ko` <div style="${this.stripStyle}" class="body">
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
            <slot></slot>`}postCardUpdateHook(t){t.has("backgroundImage")&&this.styleBackgroundImage()}styleBackgroundImage(){if(this.card.classList.remove("thin-strip"),this.card.classList.remove("wide-strip"),!this.card.backgroundImage)return;let t=new Image;t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")}}};p(me,"variantStyle",Io`
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
            min-width: fit-content;
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
    `);import{html as Do,css as Uo}from"../lit-all.min.js";var Ur=`

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
`;var zo={mnemonics:{size:"m"},backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{slot:"footer",size:"S"},allowedSizes:["wide"]},pe=class extends w{getGlobalCSS(){return Ur}get aemFragmentMapping(){return zo}renderLayout(){return Do` <div class="content">
                <div class="top-section">
                    <slot name="icons"></slot>
                    ${this.badge}
                </div>
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};p(pe,"variantStyle",Uo`
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
    `);import{html as Gr,css as Go}from"../lit-all.min.js";var zr=`
    merch-card[variant="ah-pricing-widget"] [slot="body-xxs"] {
        letter-spacing: normal;
        margin-bottom: 16px;
        box-sizing: border-box;
        color: var(--consonant-merch-card-body-xxs-color);
    }

    merch-card[variant="ah-pricing-widget"] [slot="heading-xxxs"] {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        display: -moz-box;
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        line-clamp: 3;
        -webkit-line-clamp: 3;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price {
        display: inline-block;
        height: var(--consonant-merch-card-detail-xl-line-height);
        line-height: var(--consonant-merch-card-detail-xl-line-height);
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-integer,
    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-decimals-delimiter,
    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-decimals {
        color: var(--consonant-merch-card-heading-xxxs-color);
        font-size: var(--consonant-merch-card-heading-xs-font-size);
        font-weight: 700;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-currency-symbol {
        vertical-align: top;
        line-height: var(--consonant-merch-card-detail-l-line-height);
        display: inline-block;
        width: 20px;
        text-align: start;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-recurrence{
        display: inline-block;
        width: 21px;
        text-align: end;
    }

    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-currency-symbol,
    merch-card[variant="ah-pricing-widget"] [slot="price"] .price-recurrence {
      font-size: var(--consonant-merch-card-body-xxs-font-size);
      color: var(--consonant-merch-card-body-xxs-color);
      font-weight: 400;
  }

    merch-card[variant="ah-pricing-widget"] [slot="price"] a {
        color: var(--consonant-merch-card-body-xxs-color);
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: var(--consonant-merch-card-body-xxs-line-height);
        text-decoration-thickness: from-font;
        text-underline-offset: 1px;
        width: fit-content;
    }

    merch-card[variant="ah-pricing-widget"] [slot='image'] img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 16px;
        overflow: hidden;
    }

    .spectrum--dark merch-card[variant="ah-pricing-widget"][background-color='gray']{
      --merch-card-ah-pricing-widget-gray-background: rgb(17, 17, 17);
    }

    .spectrum--dark merch-card[variant="ah-pricing-widget"] {
      --consonant-merch-card-background-color:rgb(17, 17, 17);
      --consonant-merch-card-heading-xxxs-color:rgb(242, 242, 242);
      --consonant-merch-card-body-xxs-color:rgb(219, 219, 219);
    }

    .spectrum--dark  merch-card[variant="ah-pricing-widget"]:hover {
      --consonant-merch-card-border-color:rgb(73, 73, 73);
    }
`;var Fo={mnemonics:{size:"s"},title:{tag:"h3",slot:"heading-xxxs",maxCount:40},description:{tag:"div",slot:"body-xxs",maxCount:200},prices:{tag:"p",slot:"price"},ctas:{slot:"cta",size:"S"},backgroundImage:{tag:"div",slot:"image"},allowedColors:["gray"],allowedSizes:["single","double"]},q=class extends w{getGlobalCSS(){return zr}get aemFragmentMapping(){return Fo}renderLayout(){return Gr`
      <div class="content">
        <div class="header">
    		    <slot name="icons"></slot>
            <slot name="heading-xxxs"></slot>
        </div>
        <slot name="body-xxs"></slot>
        <slot name="price"></slot>
        <div class="footer">
          <slot name="cta"></slot>
        </div>
      </div>
      ${this.card.size==="single"?Gr`<slot name="image"></slot>`:""}
      <slot></slot>
    `}};p(q,"variantStyle",Go`
    :host([variant='ah-pricing-widget']) {
        --merch-card-ah-pricing-widget-width: 132px;
        --merch-card-ah-pricing-widget-content-max-width: 245px;
        --merch-card-ah-pricing-widget-height: 206px;
        --merch-card-ah-pricing-widget-header-min-height: 36px;
        --merch-card-ah-pricing-widget-gray-background: rgba(248, 248, 248);
        --merch-card-ah-pricing-widget-text-color: rgba(19, 19, 19);
        --merch-card-ah-pricing-widget-price-line-height: 17px;
        width: var(--merch-card-ah-pricing-widget-width);
        min-height: var(--merch-card-ah-pricing-widget-height);
        background-color: var(--consonant-merch-card-background-color);
        color: var(--consonant-merch-card-heading-xxxs-color);
        border-radius: 10px;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        padding: 12px !important;
        gap: 16px;
        box-sizing: content-box !important;
        border: none;
    }

    :host([variant='ah-pricing-widget'][size='single']) {
        --merch-card-ah-pricing-widget-width: 460px;
    }

    :host([variant='ah-pricing-widget'][size='double']) {
        --merch-card-ah-pricing-widget-width: 214px;
    }

    :host([variant='ah-pricing-widget'][background-color='gray']) {
        background-color: var(--merch-card-ah-pricing-widget-gray-background);
    }

    :host([variant='ah-pricing-widget']) .content {
        display: flex;
        flex-direction: column;
        width: var(--merch-card-ah-pricing-widget-content-max-width);
    }

    :host([variant='ah-pricing-widget']) .header {
        display: flex;
        min-height: var(--merch-card-ah-pricing-widget-header-min-height);
        flex-direction: row;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
        margin-bottom: 4px;
    }


    :host([variant='ah-pricing-widget']) ::slotted([slot='price']) {
        margin-left: var(--spacing-xs);
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        justify-content: end;
        font-size: var(--consonant-merch-card-detail-s-font-size);
        line-height: var(--merch-card-ah-pricing-widget-price-line-height);
        color: var(--consonant-merch-card-heading-xxxs-color);
        gap: 4px;
    }

    :host([variant='ah-pricing-widget']) .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 24px;
    }

    :host([variant='ah-pricing-widget']) ::slotted([slot='cta']) {
        display: flex;
        flex-direction: row;
        gap: 8px;
    }

    :host([variant='ah-pricing-widget']) ::slotted([slot='image']) {
        width: 199px;
        overflow: hidden;
    }
  `);customElements.define("ah-pricing-widget",q);var wt=(e,t=!1)=>{switch(e.variant){case"catalog":return new ie(e);case"image":return new Ve(e);case"inline-heading":return new je(e);case"mini-compare-chart":return new se(e);case"plans":return new ce(e);case"product":return new W(e);case"segment":return new le(e);case"special-offers":return new he(e);case"twp":return new de(e);case"ccd-suggested":return new me(e);case"ccd-slice":return new pe(e);case"ah-pricing-widget":return new q(e);default:return t?void 0:new W(e)}},Fr=()=>{let e=[];return e.push(ie.variantStyle),e.push(se.variantStyle),e.push(W.variantStyle),e.push(ce.variantStyle),e.push(le.variantStyle),e.push(he.variantStyle),e.push(de.variantStyle),e.push(me.variantStyle),e.push(pe.variantStyle),e.push(q.variantStyle),e};var $r=document.createElement("style");$r.innerHTML=`
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
    --consonant-merch-card-heading-xxxs-line-height: 18.2px;
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
    --consonant-merch-card-detail-l-line-height: 21px;
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

`;document.head.appendChild($r);var we;(function(e){e.V2="UCv2",e.V3="UCv3"})(we||(we={}));var Se;(function(e){e.CHECKOUT="checkout",e.CHECKOUT_EMAIL="checkout/email",e.SEGMENTATION="segmentation",e.BUNDLE="bundle",e.COMMITMENT="commitment",e.RECOMMENDATION="recommendation",e.EMAIL="email",e.PAYMENT="payment",e.CHANGE_PLAN_TEAM_PLANS="change-plan/team-upgrade/plans",e.CHANGE_PLAN_TEAM_PAYMENT="change-plan/team-upgrade/payment"})(Se||(Se={}));var St;(function(e){e.BASE="BASE",e.TRIAL="TRIAL",e.PROMOTION="PROMOTION"})(St||(St={}));var P;(function(e){e.MONTH="MONTH",e.YEAR="YEAR",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.PERPETUAL="PERPETUAL",e.TERM_LICENSE="TERM_LICENSE",e.ACCESS_PASS="ACCESS_PASS",e.THREE_MONTHS="THREE_MONTHS",e.SIX_MONTHS="SIX_MONTHS"})(P||(P={}));var _;(function(e){e.ANNUAL="ANNUAL",e.MONTHLY="MONTHLY",e.TWO_YEARS="TWO_YEARS",e.THREE_YEARS="THREE_YEARS",e.P1D="P1D",e.P1Y="P1Y",e.P3Y="P3Y",e.P10Y="P10Y",e.P15Y="P15Y",e.P3D="P3D",e.P7D="P7D",e.P30D="P30D",e.HALF_YEARLY="HALF_YEARLY",e.QUARTERLY="QUARTERLY"})(_||(_={}));var At;(function(e){e.INDIVIDUAL="INDIVIDUAL",e.TEAM="TEAM",e.ENTERPRISE="ENTERPRISE"})(At||(At={}));var Tt;(function(e){e.COM="COM",e.EDU="EDU",e.GOV="GOV"})(Tt||(Tt={}));var _t;(function(e){e.DIRECT="DIRECT",e.INDIRECT="INDIRECT"})(_t||(_t={}));var Lt;(function(e){e.ENTERPRISE_PRODUCT="ENTERPRISE_PRODUCT",e.ETLA="ETLA",e.RETAIL="RETAIL",e.VIP="VIP",e.VIPMP="VIPMP",e.FREE="FREE"})(Lt||(Lt={}));var Vr="tacocat.js";var jr=e=>`${e??""}`.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]??t)??"";function ue(e,t={},{metadata:r=!0,search:n=!0,storage:o=!0}={}){let i;if(n&&i==null){let a=new URLSearchParams(window.location.search),s=Ae(n)?n:e;i=a.get(s)}if(o&&i==null){let a=Ae(o)?o:e;i=window.sessionStorage.getItem(a)??window.localStorage.getItem(a)}if(r&&i==null){let a=$o(Ae(r)?r:e);i=document.documentElement.querySelector(`meta[name="${a}"]`)?.content}return i??t[e]}var fe=()=>{};var Yr=e=>typeof e=="boolean",Te=e=>typeof e=="function",Ct=e=>typeof e=="number",Wr=e=>e!=null&&typeof e=="object";var Ae=e=>typeof e=="string";var _e=e=>Ct(e)&&Number.isFinite(e)&&e>0;function O(e,t){if(Yr(e))return e;let r=String(e);return r==="1"||r==="true"?!0:r==="0"||r==="false"?!1:t}function $o(e=""){return String(e).replace(/(\p{Lowercase_Letter})(\p{Uppercase_Letter})/gu,(t,r,n)=>`${r}-${n}`).replace(/\W+/gu,"-").toLowerCase()}var Vo=Date.now(),Pt=()=>`(+${Date.now()-Vo}ms)`,We=new Set,jo=O(ue("tacocat.debug",{},{metadata:!1}),typeof process<"u"&&process.env?.DEBUG);function qr(e){let t=`[${Vr}/${e}]`,r=(a,s,...c)=>a?!0:(o(s,...c),!1),n=jo?(a,...s)=>{console.debug(`${t} ${a}`,...s,Pt())}:()=>{},o=(a,...s)=>{let c=`${t} ${a}`;We.forEach(([l])=>l(c,...s))};return{assert:r,debug:n,error:o,warn:(a,...s)=>{let c=`${t} ${a}`;We.forEach(([,l])=>l(c,...s))}}}function Yo(e,t){let r=[e,t];return We.add(r),()=>{We.delete(r)}}Yo((e,...t)=>{console.error(e,...t,Pt())},(e,...t)=>{console.warn(e,...t,Pt())});var Xr="ABM",Kr="PUF",Zr="M2M",Qr="PERPETUAL",Jr="P3Y",Wo="TAX_INCLUSIVE_DETAILS",qo="TAX_EXCLUSIVE",en={ABM:Xr,PUF:Kr,M2M:Zr,PERPETUAL:Qr,P3Y:Jr},Th={[Xr]:{commitment:P.YEAR,term:_.MONTHLY},[Kr]:{commitment:P.YEAR,term:_.ANNUAL},[Zr]:{commitment:P.MONTH,term:_.MONTHLY},[Qr]:{commitment:P.PERPETUAL,term:void 0},[Jr]:{commitment:P.THREE_MONTHS,term:_.P3Y}};function Nt(e){let{priceDetails:t}=e,{price:r,priceWithoutDiscount:n,priceWithoutTax:o,priceWithoutDiscountAndTax:i,taxDisplay:a}=t;if(a!==Wo)return e;let s={...e,priceDetails:{...t,price:o??r,priceWithoutDiscount:i??n,taxDisplay:qo}};return s.offerType==="TRIAL"&&s.priceDetails.price===0&&(s.priceDetails.price=s.priceDetails.priceWithoutDiscount),s}var Rt=function(e,t){return Rt=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(r[o]=n[o])},Rt(e,t)};function Le(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");Rt(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}var v=function(){return v=Object.assign||function(t){for(var r,n=1,o=arguments.length;n<o;n++){r=arguments[n];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(t[i]=r[i])}return t},v.apply(this,arguments)};function qe(e,t,r){if(r||arguments.length===2)for(var n=0,o=t.length,i;n<o;n++)(i||!(n in t))&&(i||(i=Array.prototype.slice.call(t,0,n)),i[n]=t[n]);return e.concat(i||Array.prototype.slice.call(t))}var x;(function(e){e[e.EXPECT_ARGUMENT_CLOSING_BRACE=1]="EXPECT_ARGUMENT_CLOSING_BRACE",e[e.EMPTY_ARGUMENT=2]="EMPTY_ARGUMENT",e[e.MALFORMED_ARGUMENT=3]="MALFORMED_ARGUMENT",e[e.EXPECT_ARGUMENT_TYPE=4]="EXPECT_ARGUMENT_TYPE",e[e.INVALID_ARGUMENT_TYPE=5]="INVALID_ARGUMENT_TYPE",e[e.EXPECT_ARGUMENT_STYLE=6]="EXPECT_ARGUMENT_STYLE",e[e.INVALID_NUMBER_SKELETON=7]="INVALID_NUMBER_SKELETON",e[e.INVALID_DATE_TIME_SKELETON=8]="INVALID_DATE_TIME_SKELETON",e[e.EXPECT_NUMBER_SKELETON=9]="EXPECT_NUMBER_SKELETON",e[e.EXPECT_DATE_TIME_SKELETON=10]="EXPECT_DATE_TIME_SKELETON",e[e.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE=11]="UNCLOSED_QUOTE_IN_ARGUMENT_STYLE",e[e.EXPECT_SELECT_ARGUMENT_OPTIONS=12]="EXPECT_SELECT_ARGUMENT_OPTIONS",e[e.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE=13]="EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE=14]="INVALID_PLURAL_ARGUMENT_OFFSET_VALUE",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR=15]="EXPECT_SELECT_ARGUMENT_SELECTOR",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR=16]="EXPECT_PLURAL_ARGUMENT_SELECTOR",e[e.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT=17]="EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT",e[e.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT=18]="EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT",e[e.INVALID_PLURAL_ARGUMENT_SELECTOR=19]="INVALID_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_PLURAL_ARGUMENT_SELECTOR=20]="DUPLICATE_PLURAL_ARGUMENT_SELECTOR",e[e.DUPLICATE_SELECT_ARGUMENT_SELECTOR=21]="DUPLICATE_SELECT_ARGUMENT_SELECTOR",e[e.MISSING_OTHER_CLAUSE=22]="MISSING_OTHER_CLAUSE",e[e.INVALID_TAG=23]="INVALID_TAG",e[e.INVALID_TAG_NAME=25]="INVALID_TAG_NAME",e[e.UNMATCHED_CLOSING_TAG=26]="UNMATCHED_CLOSING_TAG",e[e.UNCLOSED_TAG=27]="UNCLOSED_TAG"})(x||(x={}));var S;(function(e){e[e.literal=0]="literal",e[e.argument=1]="argument",e[e.number=2]="number",e[e.date=3]="date",e[e.time=4]="time",e[e.select=5]="select",e[e.plural=6]="plural",e[e.pound=7]="pound",e[e.tag=8]="tag"})(S||(S={}));var X;(function(e){e[e.number=0]="number",e[e.dateTime=1]="dateTime"})(X||(X={}));function Ot(e){return e.type===S.literal}function tn(e){return e.type===S.argument}function Xe(e){return e.type===S.number}function Ke(e){return e.type===S.date}function Ze(e){return e.type===S.time}function Qe(e){return e.type===S.select}function Je(e){return e.type===S.plural}function rn(e){return e.type===S.pound}function et(e){return e.type===S.tag}function tt(e){return!!(e&&typeof e=="object"&&e.type===X.number)}function Ce(e){return!!(e&&typeof e=="object"&&e.type===X.dateTime)}var Ht=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/;var Xo=/(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g;function nn(e){var t={};return e.replace(Xo,function(r){var n=r.length;switch(r[0]){case"G":t.era=n===4?"long":n===5?"narrow":"short";break;case"y":t.year=n===2?"2-digit":"numeric";break;case"Y":case"u":case"U":case"r":throw new RangeError("`Y/u/U/r` (year) patterns are not supported, use `y` instead");case"q":case"Q":throw new RangeError("`q/Q` (quarter) patterns are not supported");case"M":case"L":t.month=["numeric","2-digit","short","long","narrow"][n-1];break;case"w":case"W":throw new RangeError("`w/W` (week) patterns are not supported");case"d":t.day=["numeric","2-digit"][n-1];break;case"D":case"F":case"g":throw new RangeError("`D/F/g` (day) patterns are not supported, use `d` instead");case"E":t.weekday=n===4?"short":n===5?"narrow":"short";break;case"e":if(n<4)throw new RangeError("`e..eee` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"c":if(n<4)throw new RangeError("`c..ccc` (weekday) patterns are not supported");t.weekday=["short","long","narrow","short"][n-4];break;case"a":t.hour12=!0;break;case"b":case"B":throw new RangeError("`b/B` (period) patterns are not supported, use `a` instead");case"h":t.hourCycle="h12",t.hour=["numeric","2-digit"][n-1];break;case"H":t.hourCycle="h23",t.hour=["numeric","2-digit"][n-1];break;case"K":t.hourCycle="h11",t.hour=["numeric","2-digit"][n-1];break;case"k":t.hourCycle="h24",t.hour=["numeric","2-digit"][n-1];break;case"j":case"J":case"C":throw new RangeError("`j/J/C` (hour) patterns are not supported, use `h/H/K/k` instead");case"m":t.minute=["numeric","2-digit"][n-1];break;case"s":t.second=["numeric","2-digit"][n-1];break;case"S":case"A":throw new RangeError("`S/A` (second) patterns are not supported, use `s` instead");case"z":t.timeZoneName=n<4?"short":"long";break;case"Z":case"O":case"v":case"V":case"X":case"x":throw new RangeError("`Z/O/v/V/X/x` (timeZone) patterns are not supported, use `z` instead")}return""}),t}var on=/[\t-\r \x85\u200E\u200F\u2028\u2029]/i;function ln(e){if(e.length===0)throw new Error("Number skeleton cannot be empty");for(var t=e.split(on).filter(function(u){return u.length>0}),r=[],n=0,o=t;n<o.length;n++){var i=o[n],a=i.split("/");if(a.length===0)throw new Error("Invalid number skeleton");for(var s=a[0],c=a.slice(1),l=0,h=c;l<h.length;l++){var f=h[l];if(f.length===0)throw new Error("Invalid number skeleton")}r.push({stem:s,options:c})}return r}function Ko(e){return e.replace(/^(.*?)-/,"")}var an=/^\.(?:(0+)(\*)?|(#+)|(0+)(#+))$/g,hn=/^(@+)?(\+|#+)?[rs]?$/g,Zo=/(\*)(0+)|(#+)(0+)|(0+)/g,dn=/^(0+)$/;function sn(e){var t={};return e[e.length-1]==="r"?t.roundingPriority="morePrecision":e[e.length-1]==="s"&&(t.roundingPriority="lessPrecision"),e.replace(hn,function(r,n,o){return typeof o!="string"?(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length):o==="+"?t.minimumSignificantDigits=n.length:n[0]==="#"?t.maximumSignificantDigits=n.length:(t.minimumSignificantDigits=n.length,t.maximumSignificantDigits=n.length+(typeof o=="string"?o.length:0)),""}),t}function mn(e){switch(e){case"sign-auto":return{signDisplay:"auto"};case"sign-accounting":case"()":return{currencySign:"accounting"};case"sign-always":case"+!":return{signDisplay:"always"};case"sign-accounting-always":case"()!":return{signDisplay:"always",currencySign:"accounting"};case"sign-except-zero":case"+?":return{signDisplay:"exceptZero"};case"sign-accounting-except-zero":case"()?":return{signDisplay:"exceptZero",currencySign:"accounting"};case"sign-never":case"+_":return{signDisplay:"never"}}}function Qo(e){var t;if(e[0]==="E"&&e[1]==="E"?(t={notation:"engineering"},e=e.slice(2)):e[0]==="E"&&(t={notation:"scientific"},e=e.slice(1)),t){var r=e.slice(0,2);if(r==="+!"?(t.signDisplay="always",e=e.slice(2)):r==="+?"&&(t.signDisplay="exceptZero",e=e.slice(2)),!dn.test(e))throw new Error("Malformed concise eng/scientific notation");t.minimumIntegerDigits=e.length}return t}function cn(e){var t={},r=mn(e);return r||t}function pn(e){for(var t={},r=0,n=e;r<n.length;r++){var o=n[r];switch(o.stem){case"percent":case"%":t.style="percent";continue;case"%x100":t.style="percent",t.scale=100;continue;case"currency":t.style="currency",t.currency=o.options[0];continue;case"group-off":case",_":t.useGrouping=!1;continue;case"precision-integer":case".":t.maximumFractionDigits=0;continue;case"measure-unit":case"unit":t.style="unit",t.unit=Ko(o.options[0]);continue;case"compact-short":case"K":t.notation="compact",t.compactDisplay="short";continue;case"compact-long":case"KK":t.notation="compact",t.compactDisplay="long";continue;case"scientific":t=v(v(v({},t),{notation:"scientific"}),o.options.reduce(function(c,l){return v(v({},c),cn(l))},{}));continue;case"engineering":t=v(v(v({},t),{notation:"engineering"}),o.options.reduce(function(c,l){return v(v({},c),cn(l))},{}));continue;case"notation-simple":t.notation="standard";continue;case"unit-width-narrow":t.currencyDisplay="narrowSymbol",t.unitDisplay="narrow";continue;case"unit-width-short":t.currencyDisplay="code",t.unitDisplay="short";continue;case"unit-width-full-name":t.currencyDisplay="name",t.unitDisplay="long";continue;case"unit-width-iso-code":t.currencyDisplay="symbol";continue;case"scale":t.scale=parseFloat(o.options[0]);continue;case"integer-width":if(o.options.length>1)throw new RangeError("integer-width stems only accept a single optional option");o.options[0].replace(Zo,function(c,l,h,f,u,g){if(l)t.minimumIntegerDigits=h.length;else{if(f&&u)throw new Error("We currently do not support maximum integer digits");if(g)throw new Error("We currently do not support exact integer digits")}return""});continue}if(dn.test(o.stem)){t.minimumIntegerDigits=o.stem.length;continue}if(an.test(o.stem)){if(o.options.length>1)throw new RangeError("Fraction-precision stems only accept a single optional option");o.stem.replace(an,function(c,l,h,f,u,g){return h==="*"?t.minimumFractionDigits=l.length:f&&f[0]==="#"?t.maximumFractionDigits=f.length:u&&g?(t.minimumFractionDigits=u.length,t.maximumFractionDigits=u.length+g.length):(t.minimumFractionDigits=l.length,t.maximumFractionDigits=l.length),""});var i=o.options[0];i==="w"?t=v(v({},t),{trailingZeroDisplay:"stripIfInteger"}):i&&(t=v(v({},t),sn(i)));continue}if(hn.test(o.stem)){t=v(v({},t),sn(o.stem));continue}var a=mn(o.stem);a&&(t=v(v({},t),a));var s=Qo(o.stem);s&&(t=v(v({},t),s))}return t}var Pe={AX:["H"],BQ:["H"],CP:["H"],CZ:["H"],DK:["H"],FI:["H"],ID:["H"],IS:["H"],ML:["H"],NE:["H"],RU:["H"],SE:["H"],SJ:["H"],SK:["H"],AS:["h","H"],BT:["h","H"],DJ:["h","H"],ER:["h","H"],GH:["h","H"],IN:["h","H"],LS:["h","H"],PG:["h","H"],PW:["h","H"],SO:["h","H"],TO:["h","H"],VU:["h","H"],WS:["h","H"],"001":["H","h"],AL:["h","H","hB"],TD:["h","H","hB"],"ca-ES":["H","h","hB"],CF:["H","h","hB"],CM:["H","h","hB"],"fr-CA":["H","h","hB"],"gl-ES":["H","h","hB"],"it-CH":["H","h","hB"],"it-IT":["H","h","hB"],LU:["H","h","hB"],NP:["H","h","hB"],PF:["H","h","hB"],SC:["H","h","hB"],SM:["H","h","hB"],SN:["H","h","hB"],TF:["H","h","hB"],VA:["H","h","hB"],CY:["h","H","hb","hB"],GR:["h","H","hb","hB"],CO:["h","H","hB","hb"],DO:["h","H","hB","hb"],KP:["h","H","hB","hb"],KR:["h","H","hB","hb"],NA:["h","H","hB","hb"],PA:["h","H","hB","hb"],PR:["h","H","hB","hb"],VE:["h","H","hB","hb"],AC:["H","h","hb","hB"],AI:["H","h","hb","hB"],BW:["H","h","hb","hB"],BZ:["H","h","hb","hB"],CC:["H","h","hb","hB"],CK:["H","h","hb","hB"],CX:["H","h","hb","hB"],DG:["H","h","hb","hB"],FK:["H","h","hb","hB"],GB:["H","h","hb","hB"],GG:["H","h","hb","hB"],GI:["H","h","hb","hB"],IE:["H","h","hb","hB"],IM:["H","h","hb","hB"],IO:["H","h","hb","hB"],JE:["H","h","hb","hB"],LT:["H","h","hb","hB"],MK:["H","h","hb","hB"],MN:["H","h","hb","hB"],MS:["H","h","hb","hB"],NF:["H","h","hb","hB"],NG:["H","h","hb","hB"],NR:["H","h","hb","hB"],NU:["H","h","hb","hB"],PN:["H","h","hb","hB"],SH:["H","h","hb","hB"],SX:["H","h","hb","hB"],TA:["H","h","hb","hB"],ZA:["H","h","hb","hB"],"af-ZA":["H","h","hB","hb"],AR:["H","h","hB","hb"],CL:["H","h","hB","hb"],CR:["H","h","hB","hb"],CU:["H","h","hB","hb"],EA:["H","h","hB","hb"],"es-BO":["H","h","hB","hb"],"es-BR":["H","h","hB","hb"],"es-EC":["H","h","hB","hb"],"es-ES":["H","h","hB","hb"],"es-GQ":["H","h","hB","hb"],"es-PE":["H","h","hB","hb"],GT:["H","h","hB","hb"],HN:["H","h","hB","hb"],IC:["H","h","hB","hb"],KG:["H","h","hB","hb"],KM:["H","h","hB","hb"],LK:["H","h","hB","hb"],MA:["H","h","hB","hb"],MX:["H","h","hB","hb"],NI:["H","h","hB","hb"],PY:["H","h","hB","hb"],SV:["H","h","hB","hb"],UY:["H","h","hB","hb"],JP:["H","h","K"],AD:["H","hB"],AM:["H","hB"],AO:["H","hB"],AT:["H","hB"],AW:["H","hB"],BE:["H","hB"],BF:["H","hB"],BJ:["H","hB"],BL:["H","hB"],BR:["H","hB"],CG:["H","hB"],CI:["H","hB"],CV:["H","hB"],DE:["H","hB"],EE:["H","hB"],FR:["H","hB"],GA:["H","hB"],GF:["H","hB"],GN:["H","hB"],GP:["H","hB"],GW:["H","hB"],HR:["H","hB"],IL:["H","hB"],IT:["H","hB"],KZ:["H","hB"],MC:["H","hB"],MD:["H","hB"],MF:["H","hB"],MQ:["H","hB"],MZ:["H","hB"],NC:["H","hB"],NL:["H","hB"],PM:["H","hB"],PT:["H","hB"],RE:["H","hB"],RO:["H","hB"],SI:["H","hB"],SR:["H","hB"],ST:["H","hB"],TG:["H","hB"],TR:["H","hB"],WF:["H","hB"],YT:["H","hB"],BD:["h","hB","H"],PK:["h","hB","H"],AZ:["H","hB","h"],BA:["H","hB","h"],BG:["H","hB","h"],CH:["H","hB","h"],GE:["H","hB","h"],LI:["H","hB","h"],ME:["H","hB","h"],RS:["H","hB","h"],UA:["H","hB","h"],UZ:["H","hB","h"],XK:["H","hB","h"],AG:["h","hb","H","hB"],AU:["h","hb","H","hB"],BB:["h","hb","H","hB"],BM:["h","hb","H","hB"],BS:["h","hb","H","hB"],CA:["h","hb","H","hB"],DM:["h","hb","H","hB"],"en-001":["h","hb","H","hB"],FJ:["h","hb","H","hB"],FM:["h","hb","H","hB"],GD:["h","hb","H","hB"],GM:["h","hb","H","hB"],GU:["h","hb","H","hB"],GY:["h","hb","H","hB"],JM:["h","hb","H","hB"],KI:["h","hb","H","hB"],KN:["h","hb","H","hB"],KY:["h","hb","H","hB"],LC:["h","hb","H","hB"],LR:["h","hb","H","hB"],MH:["h","hb","H","hB"],MP:["h","hb","H","hB"],MW:["h","hb","H","hB"],NZ:["h","hb","H","hB"],SB:["h","hb","H","hB"],SG:["h","hb","H","hB"],SL:["h","hb","H","hB"],SS:["h","hb","H","hB"],SZ:["h","hb","H","hB"],TC:["h","hb","H","hB"],TT:["h","hb","H","hB"],UM:["h","hb","H","hB"],US:["h","hb","H","hB"],VC:["h","hb","H","hB"],VG:["h","hb","H","hB"],VI:["h","hb","H","hB"],ZM:["h","hb","H","hB"],BO:["H","hB","h","hb"],EC:["H","hB","h","hb"],ES:["H","hB","h","hb"],GQ:["H","hB","h","hb"],PE:["H","hB","h","hb"],AE:["h","hB","hb","H"],"ar-001":["h","hB","hb","H"],BH:["h","hB","hb","H"],DZ:["h","hB","hb","H"],EG:["h","hB","hb","H"],EH:["h","hB","hb","H"],HK:["h","hB","hb","H"],IQ:["h","hB","hb","H"],JO:["h","hB","hb","H"],KW:["h","hB","hb","H"],LB:["h","hB","hb","H"],LY:["h","hB","hb","H"],MO:["h","hB","hb","H"],MR:["h","hB","hb","H"],OM:["h","hB","hb","H"],PH:["h","hB","hb","H"],PS:["h","hB","hb","H"],QA:["h","hB","hb","H"],SA:["h","hB","hb","H"],SD:["h","hB","hb","H"],SY:["h","hB","hb","H"],TN:["h","hB","hb","H"],YE:["h","hB","hb","H"],AF:["H","hb","hB","h"],LA:["H","hb","hB","h"],CN:["H","hB","hb","h"],LV:["H","hB","hb","h"],TL:["H","hB","hb","h"],"zu-ZA":["H","hB","hb","h"],CD:["hB","H"],IR:["hB","H"],"hi-IN":["hB","h","H"],"kn-IN":["hB","h","H"],"ml-IN":["hB","h","H"],"te-IN":["hB","h","H"],KH:["hB","h","H","hb"],"ta-IN":["hB","h","hb","H"],BN:["hb","hB","h","H"],MY:["hb","hB","h","H"],ET:["hB","hb","h","H"],"gu-IN":["hB","hb","h","H"],"mr-IN":["hB","hb","h","H"],"pa-IN":["hB","hb","h","H"],TW:["hB","hb","h","H"],KE:["hB","hb","H","h"],MM:["hB","hb","H","h"],TZ:["hB","hb","H","h"],UG:["hB","hb","H","h"]};function un(e,t){for(var r="",n=0;n<e.length;n++){var o=e.charAt(n);if(o==="j"){for(var i=0;n+1<e.length&&e.charAt(n+1)===o;)i++,n++;var a=1+(i&1),s=i<2?1:3+(i>>1),c="a",l=Jo(t);for((l=="H"||l=="k")&&(s=0);s-- >0;)r+=c;for(;a-- >0;)r=l+r}else o==="J"?r+="H":r+=o}return r}function Jo(e){var t=e.hourCycle;if(t===void 0&&e.hourCycles&&e.hourCycles.length&&(t=e.hourCycles[0]),t)switch(t){case"h24":return"k";case"h23":return"H";case"h12":return"h";case"h11":return"K";default:throw new Error("Invalid hourCycle")}var r=e.language,n;r!=="root"&&(n=e.maximize().region);var o=Pe[n||""]||Pe[r||""]||Pe["".concat(r,"-001")]||Pe["001"];return o[0]}var Mt,ei=new RegExp("^".concat(Ht.source,"*")),ti=new RegExp("".concat(Ht.source,"*$"));function y(e,t){return{start:e,end:t}}var ri=!!String.prototype.startsWith,ni=!!String.fromCodePoint,oi=!!Object.fromEntries,ii=!!String.prototype.codePointAt,ai=!!String.prototype.trimStart,si=!!String.prototype.trimEnd,ci=!!Number.isSafeInteger,li=ci?Number.isSafeInteger:function(e){return typeof e=="number"&&isFinite(e)&&Math.floor(e)===e&&Math.abs(e)<=9007199254740991},It=!0;try{fn=vn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),It=((Mt=fn.exec("a"))===null||Mt===void 0?void 0:Mt[0])==="a"}catch{It=!1}var fn,gn=ri?function(t,r,n){return t.startsWith(r,n)}:function(t,r,n){return t.slice(n,n+r.length)===r},Bt=ni?String.fromCodePoint:function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];for(var n="",o=t.length,i=0,a;o>i;){if(a=t[i++],a>1114111)throw RangeError(a+" is not a valid code point");n+=a<65536?String.fromCharCode(a):String.fromCharCode(((a-=65536)>>10)+55296,a%1024+56320)}return n},xn=oi?Object.fromEntries:function(t){for(var r={},n=0,o=t;n<o.length;n++){var i=o[n],a=i[0],s=i[1];r[a]=s}return r},bn=ii?function(t,r){return t.codePointAt(r)}:function(t,r){var n=t.length;if(!(r<0||r>=n)){var o=t.charCodeAt(r),i;return o<55296||o>56319||r+1===n||(i=t.charCodeAt(r+1))<56320||i>57343?o:(o-55296<<10)+(i-56320)+65536}},hi=ai?function(t){return t.trimStart()}:function(t){return t.replace(ei,"")},di=si?function(t){return t.trimEnd()}:function(t){return t.replace(ti,"")};function vn(e,t){return new RegExp(e,t)}var Dt;It?(kt=vn("([^\\p{White_Space}\\p{Pattern_Syntax}]*)","yu"),Dt=function(t,r){var n;kt.lastIndex=r;var o=kt.exec(t);return(n=o[1])!==null&&n!==void 0?n:""}):Dt=function(t,r){for(var n=[];;){var o=bn(t,r);if(o===void 0||En(o)||ui(o))break;n.push(o),r+=o>=65536?2:1}return Bt.apply(void 0,n)};var kt,yn=function(){function e(t,r){r===void 0&&(r={}),this.message=t,this.position={offset:0,line:1,column:1},this.ignoreTag=!!r.ignoreTag,this.locale=r.locale,this.requiresOtherClause=!!r.requiresOtherClause,this.shouldParseSkeletons=!!r.shouldParseSkeletons}return e.prototype.parse=function(){if(this.offset()!==0)throw Error("parser can only be used once");return this.parseMessage(0,"",!1)},e.prototype.parseMessage=function(t,r,n){for(var o=[];!this.isEOF();){var i=this.char();if(i===123){var a=this.parseArgument(t,n);if(a.err)return a;o.push(a.val)}else{if(i===125&&t>0)break;if(i===35&&(r==="plural"||r==="selectordinal")){var s=this.clonePosition();this.bump(),o.push({type:S.pound,location:y(s,this.clonePosition())})}else if(i===60&&!this.ignoreTag&&this.peek()===47){if(n)break;return this.error(x.UNMATCHED_CLOSING_TAG,y(this.clonePosition(),this.clonePosition()))}else if(i===60&&!this.ignoreTag&&Ut(this.peek()||0)){var a=this.parseTag(t,r);if(a.err)return a;o.push(a.val)}else{var a=this.parseLiteral(t,r);if(a.err)return a;o.push(a.val)}}}return{val:o,err:null}},e.prototype.parseTag=function(t,r){var n=this.clonePosition();this.bump();var o=this.parseTagName();if(this.bumpSpace(),this.bumpIf("/>"))return{val:{type:S.literal,value:"<".concat(o,"/>"),location:y(n,this.clonePosition())},err:null};if(this.bumpIf(">")){var i=this.parseMessage(t+1,r,!0);if(i.err)return i;var a=i.val,s=this.clonePosition();if(this.bumpIf("</")){if(this.isEOF()||!Ut(this.char()))return this.error(x.INVALID_TAG,y(s,this.clonePosition()));var c=this.clonePosition(),l=this.parseTagName();return o!==l?this.error(x.UNMATCHED_CLOSING_TAG,y(c,this.clonePosition())):(this.bumpSpace(),this.bumpIf(">")?{val:{type:S.tag,value:o,children:a,location:y(n,this.clonePosition())},err:null}:this.error(x.INVALID_TAG,y(s,this.clonePosition())))}else return this.error(x.UNCLOSED_TAG,y(n,this.clonePosition()))}else return this.error(x.INVALID_TAG,y(n,this.clonePosition()))},e.prototype.parseTagName=function(){var t=this.offset();for(this.bump();!this.isEOF()&&pi(this.char());)this.bump();return this.message.slice(t,this.offset())},e.prototype.parseLiteral=function(t,r){for(var n=this.clonePosition(),o="";;){var i=this.tryParseQuote(r);if(i){o+=i;continue}var a=this.tryParseUnquoted(t,r);if(a){o+=a;continue}var s=this.tryParseLeftAngleBracket();if(s){o+=s;continue}break}var c=y(n,this.clonePosition());return{val:{type:S.literal,value:o,location:c},err:null}},e.prototype.tryParseLeftAngleBracket=function(){return!this.isEOF()&&this.char()===60&&(this.ignoreTag||!mi(this.peek()||0))?(this.bump(),"<"):null},e.prototype.tryParseQuote=function(t){if(this.isEOF()||this.char()!==39)return null;switch(this.peek()){case 39:return this.bump(),this.bump(),"'";case 123:case 60:case 62:case 125:break;case 35:if(t==="plural"||t==="selectordinal")break;return null;default:return null}this.bump();var r=[this.char()];for(this.bump();!this.isEOF();){var n=this.char();if(n===39)if(this.peek()===39)r.push(39),this.bump();else{this.bump();break}else r.push(n);this.bump()}return Bt.apply(void 0,r)},e.prototype.tryParseUnquoted=function(t,r){if(this.isEOF())return null;var n=this.char();return n===60||n===123||n===35&&(r==="plural"||r==="selectordinal")||n===125&&t>0?null:(this.bump(),Bt(n))},e.prototype.parseArgument=function(t,r){var n=this.clonePosition();if(this.bump(),this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));if(this.char()===125)return this.bump(),this.error(x.EMPTY_ARGUMENT,y(n,this.clonePosition()));var o=this.parseIdentifierIfPossible().value;if(!o)return this.error(x.MALFORMED_ARGUMENT,y(n,this.clonePosition()));if(this.bumpSpace(),this.isEOF())return this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition()));switch(this.char()){case 125:return this.bump(),{val:{type:S.argument,value:o,location:y(n,this.clonePosition())},err:null};case 44:return this.bump(),this.bumpSpace(),this.isEOF()?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(n,this.clonePosition())):this.parseArgumentOptions(t,r,o,n);default:return this.error(x.MALFORMED_ARGUMENT,y(n,this.clonePosition()))}},e.prototype.parseIdentifierIfPossible=function(){var t=this.clonePosition(),r=this.offset(),n=Dt(this.message,r),o=r+n.length;this.bumpTo(o);var i=this.clonePosition(),a=y(t,i);return{value:n,location:a}},e.prototype.parseArgumentOptions=function(t,r,n,o){var i,a=this.clonePosition(),s=this.parseIdentifierIfPossible().value,c=this.clonePosition();switch(s){case"":return this.error(x.EXPECT_ARGUMENT_TYPE,y(a,c));case"number":case"date":case"time":{this.bumpSpace();var l=null;if(this.bumpIf(",")){this.bumpSpace();var h=this.clonePosition(),f=this.parseSimpleArgStyleIfPossible();if(f.err)return f;var u=di(f.val);if(u.length===0)return this.error(x.EXPECT_ARGUMENT_STYLE,y(this.clonePosition(),this.clonePosition()));var g=y(h,this.clonePosition());l={style:u,styleLocation:g}}var b=this.tryParseArgumentClose(o);if(b.err)return b;var E=y(o,this.clonePosition());if(l&&gn(l?.style,"::",0)){var R=hi(l.style.slice(2));if(s==="number"){var f=this.parseNumberSkeletonFromString(R,l.styleLocation);return f.err?f:{val:{type:S.number,value:n,location:E,style:f.val},err:null}}else{if(R.length===0)return this.error(x.EXPECT_DATE_TIME_SKELETON,E);var z=R;this.locale&&(z=un(R,this.locale));var u={type:X.dateTime,pattern:z,location:l.styleLocation,parsedOptions:this.shouldParseSkeletons?nn(z):{}},B=s==="date"?S.date:S.time;return{val:{type:B,value:n,location:E,style:u},err:null}}}return{val:{type:s==="number"?S.number:s==="date"?S.date:S.time,value:n,location:E,style:(i=l?.style)!==null&&i!==void 0?i:null},err:null}}case"plural":case"selectordinal":case"select":{var H=this.clonePosition();if(this.bumpSpace(),!this.bumpIf(","))return this.error(x.EXPECT_SELECT_ARGUMENT_OPTIONS,y(H,v({},H)));this.bumpSpace();var V=this.parseIdentifierIfPossible(),D=0;if(s!=="select"&&V.value==="offset"){if(!this.bumpIf(":"))return this.error(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,y(this.clonePosition(),this.clonePosition()));this.bumpSpace();var f=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_OFFSET_VALUE,x.INVALID_PLURAL_ARGUMENT_OFFSET_VALUE);if(f.err)return f;this.bumpSpace(),V=this.parseIdentifierIfPossible(),D=f.val}var j=this.tryParsePluralOrSelectOptions(t,s,r,V);if(j.err)return j;var b=this.tryParseArgumentClose(o);if(b.err)return b;var Be=y(o,this.clonePosition());return s==="select"?{val:{type:S.select,value:n,options:xn(j.val),location:Be},err:null}:{val:{type:S.plural,value:n,options:xn(j.val),offset:D,pluralType:s==="plural"?"cardinal":"ordinal",location:Be},err:null}}default:return this.error(x.INVALID_ARGUMENT_TYPE,y(a,c))}},e.prototype.tryParseArgumentClose=function(t){return this.isEOF()||this.char()!==125?this.error(x.EXPECT_ARGUMENT_CLOSING_BRACE,y(t,this.clonePosition())):(this.bump(),{val:!0,err:null})},e.prototype.parseSimpleArgStyleIfPossible=function(){for(var t=0,r=this.clonePosition();!this.isEOF();){var n=this.char();switch(n){case 39:{this.bump();var o=this.clonePosition();if(!this.bumpUntil("'"))return this.error(x.UNCLOSED_QUOTE_IN_ARGUMENT_STYLE,y(o,this.clonePosition()));this.bump();break}case 123:{t+=1,this.bump();break}case 125:{if(t>0)t-=1;else return{val:this.message.slice(r.offset,this.offset()),err:null};break}default:this.bump();break}}return{val:this.message.slice(r.offset,this.offset()),err:null}},e.prototype.parseNumberSkeletonFromString=function(t,r){var n=[];try{n=ln(t)}catch{return this.error(x.INVALID_NUMBER_SKELETON,r)}return{val:{type:X.number,tokens:n,location:r,parsedOptions:this.shouldParseSkeletons?pn(n):{}},err:null}},e.prototype.tryParsePluralOrSelectOptions=function(t,r,n,o){for(var i,a=!1,s=[],c=new Set,l=o.value,h=o.location;;){if(l.length===0){var f=this.clonePosition();if(r!=="select"&&this.bumpIf("=")){var u=this.tryParseDecimalInteger(x.EXPECT_PLURAL_ARGUMENT_SELECTOR,x.INVALID_PLURAL_ARGUMENT_SELECTOR);if(u.err)return u;h=y(f,this.clonePosition()),l=this.message.slice(f.offset,this.offset())}else break}if(c.has(l))return this.error(r==="select"?x.DUPLICATE_SELECT_ARGUMENT_SELECTOR:x.DUPLICATE_PLURAL_ARGUMENT_SELECTOR,h);l==="other"&&(a=!0),this.bumpSpace();var g=this.clonePosition();if(!this.bumpIf("{"))return this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR_FRAGMENT:x.EXPECT_PLURAL_ARGUMENT_SELECTOR_FRAGMENT,y(this.clonePosition(),this.clonePosition()));var b=this.parseMessage(t+1,r,n);if(b.err)return b;var E=this.tryParseArgumentClose(g);if(E.err)return E;s.push([l,{value:b.val,location:y(g,this.clonePosition())}]),c.add(l),this.bumpSpace(),i=this.parseIdentifierIfPossible(),l=i.value,h=i.location}return s.length===0?this.error(r==="select"?x.EXPECT_SELECT_ARGUMENT_SELECTOR:x.EXPECT_PLURAL_ARGUMENT_SELECTOR,y(this.clonePosition(),this.clonePosition())):this.requiresOtherClause&&!a?this.error(x.MISSING_OTHER_CLAUSE,y(this.clonePosition(),this.clonePosition())):{val:s,err:null}},e.prototype.tryParseDecimalInteger=function(t,r){var n=1,o=this.clonePosition();this.bumpIf("+")||this.bumpIf("-")&&(n=-1);for(var i=!1,a=0;!this.isEOF();){var s=this.char();if(s>=48&&s<=57)i=!0,a=a*10+(s-48),this.bump();else break}var c=y(o,this.clonePosition());return i?(a*=n,li(a)?{val:a,err:null}:this.error(r,c)):this.error(t,c)},e.prototype.offset=function(){return this.position.offset},e.prototype.isEOF=function(){return this.offset()===this.message.length},e.prototype.clonePosition=function(){return{offset:this.position.offset,line:this.position.line,column:this.position.column}},e.prototype.char=function(){var t=this.position.offset;if(t>=this.message.length)throw Error("out of bound");var r=bn(this.message,t);if(r===void 0)throw Error("Offset ".concat(t," is at invalid UTF-16 code unit boundary"));return r},e.prototype.error=function(t,r){return{val:null,err:{kind:t,message:this.message,location:r}}},e.prototype.bump=function(){if(!this.isEOF()){var t=this.char();t===10?(this.position.line+=1,this.position.column=1,this.position.offset+=1):(this.position.column+=1,this.position.offset+=t<65536?1:2)}},e.prototype.bumpIf=function(t){if(gn(this.message,t,this.offset())){for(var r=0;r<t.length;r++)this.bump();return!0}return!1},e.prototype.bumpUntil=function(t){var r=this.offset(),n=this.message.indexOf(t,r);return n>=0?(this.bumpTo(n),!0):(this.bumpTo(this.message.length),!1)},e.prototype.bumpTo=function(t){if(this.offset()>t)throw Error("targetOffset ".concat(t," must be greater than or equal to the current offset ").concat(this.offset()));for(t=Math.min(t,this.message.length);;){var r=this.offset();if(r===t)break;if(r>t)throw Error("targetOffset ".concat(t," is at invalid UTF-16 code unit boundary"));if(this.bump(),this.isEOF())break}},e.prototype.bumpSpace=function(){for(;!this.isEOF()&&En(this.char());)this.bump()},e.prototype.peek=function(){if(this.isEOF())return null;var t=this.char(),r=this.offset(),n=this.message.charCodeAt(r+(t>=65536?2:1));return n??null},e}();function Ut(e){return e>=97&&e<=122||e>=65&&e<=90}function mi(e){return Ut(e)||e===47}function pi(e){return e===45||e===46||e>=48&&e<=57||e===95||e>=97&&e<=122||e>=65&&e<=90||e==183||e>=192&&e<=214||e>=216&&e<=246||e>=248&&e<=893||e>=895&&e<=8191||e>=8204&&e<=8205||e>=8255&&e<=8256||e>=8304&&e<=8591||e>=11264&&e<=12271||e>=12289&&e<=55295||e>=63744&&e<=64975||e>=65008&&e<=65533||e>=65536&&e<=983039}function En(e){return e>=9&&e<=13||e===32||e===133||e>=8206&&e<=8207||e===8232||e===8233}function ui(e){return e>=33&&e<=35||e===36||e>=37&&e<=39||e===40||e===41||e===42||e===43||e===44||e===45||e>=46&&e<=47||e>=58&&e<=59||e>=60&&e<=62||e>=63&&e<=64||e===91||e===92||e===93||e===94||e===96||e===123||e===124||e===125||e===126||e===161||e>=162&&e<=165||e===166||e===167||e===169||e===171||e===172||e===174||e===176||e===177||e===182||e===187||e===191||e===215||e===247||e>=8208&&e<=8213||e>=8214&&e<=8215||e===8216||e===8217||e===8218||e>=8219&&e<=8220||e===8221||e===8222||e===8223||e>=8224&&e<=8231||e>=8240&&e<=8248||e===8249||e===8250||e>=8251&&e<=8254||e>=8257&&e<=8259||e===8260||e===8261||e===8262||e>=8263&&e<=8273||e===8274||e===8275||e>=8277&&e<=8286||e>=8592&&e<=8596||e>=8597&&e<=8601||e>=8602&&e<=8603||e>=8604&&e<=8607||e===8608||e>=8609&&e<=8610||e===8611||e>=8612&&e<=8613||e===8614||e>=8615&&e<=8621||e===8622||e>=8623&&e<=8653||e>=8654&&e<=8655||e>=8656&&e<=8657||e===8658||e===8659||e===8660||e>=8661&&e<=8691||e>=8692&&e<=8959||e>=8960&&e<=8967||e===8968||e===8969||e===8970||e===8971||e>=8972&&e<=8991||e>=8992&&e<=8993||e>=8994&&e<=9e3||e===9001||e===9002||e>=9003&&e<=9083||e===9084||e>=9085&&e<=9114||e>=9115&&e<=9139||e>=9140&&e<=9179||e>=9180&&e<=9185||e>=9186&&e<=9254||e>=9255&&e<=9279||e>=9280&&e<=9290||e>=9291&&e<=9311||e>=9472&&e<=9654||e===9655||e>=9656&&e<=9664||e===9665||e>=9666&&e<=9719||e>=9720&&e<=9727||e>=9728&&e<=9838||e===9839||e>=9840&&e<=10087||e===10088||e===10089||e===10090||e===10091||e===10092||e===10093||e===10094||e===10095||e===10096||e===10097||e===10098||e===10099||e===10100||e===10101||e>=10132&&e<=10175||e>=10176&&e<=10180||e===10181||e===10182||e>=10183&&e<=10213||e===10214||e===10215||e===10216||e===10217||e===10218||e===10219||e===10220||e===10221||e===10222||e===10223||e>=10224&&e<=10239||e>=10240&&e<=10495||e>=10496&&e<=10626||e===10627||e===10628||e===10629||e===10630||e===10631||e===10632||e===10633||e===10634||e===10635||e===10636||e===10637||e===10638||e===10639||e===10640||e===10641||e===10642||e===10643||e===10644||e===10645||e===10646||e===10647||e===10648||e>=10649&&e<=10711||e===10712||e===10713||e===10714||e===10715||e>=10716&&e<=10747||e===10748||e===10749||e>=10750&&e<=11007||e>=11008&&e<=11055||e>=11056&&e<=11076||e>=11077&&e<=11078||e>=11079&&e<=11084||e>=11085&&e<=11123||e>=11124&&e<=11125||e>=11126&&e<=11157||e===11158||e>=11159&&e<=11263||e>=11776&&e<=11777||e===11778||e===11779||e===11780||e===11781||e>=11782&&e<=11784||e===11785||e===11786||e===11787||e===11788||e===11789||e>=11790&&e<=11798||e===11799||e>=11800&&e<=11801||e===11802||e===11803||e===11804||e===11805||e>=11806&&e<=11807||e===11808||e===11809||e===11810||e===11811||e===11812||e===11813||e===11814||e===11815||e===11816||e===11817||e>=11818&&e<=11822||e===11823||e>=11824&&e<=11833||e>=11834&&e<=11835||e>=11836&&e<=11839||e===11840||e===11841||e===11842||e>=11843&&e<=11855||e>=11856&&e<=11857||e===11858||e>=11859&&e<=11903||e>=12289&&e<=12291||e===12296||e===12297||e===12298||e===12299||e===12300||e===12301||e===12302||e===12303||e===12304||e===12305||e>=12306&&e<=12307||e===12308||e===12309||e===12310||e===12311||e===12312||e===12313||e===12314||e===12315||e===12316||e===12317||e>=12318&&e<=12319||e===12320||e===12336||e===64830||e===64831||e>=65093&&e<=65094}function zt(e){e.forEach(function(t){if(delete t.location,Qe(t)||Je(t))for(var r in t.options)delete t.options[r].location,zt(t.options[r].value);else Xe(t)&&tt(t.style)||(Ke(t)||Ze(t))&&Ce(t.style)?delete t.style.location:et(t)&&zt(t.children)})}function wn(e,t){t===void 0&&(t={}),t=v({shouldParseSkeletons:!0,requiresOtherClause:!0},t);var r=new yn(e,t).parse();if(r.err){var n=SyntaxError(x[r.err.kind]);throw n.location=r.err.location,n.originalMessage=r.err.message,n}return t?.captureLocation||zt(r.val),r.val}function Ne(e,t){var r=t&&t.cache?t.cache:yi,n=t&&t.serializer?t.serializer:vi,o=t&&t.strategy?t.strategy:gi;return o(e,{cache:r,serializer:n})}function fi(e){return e==null||typeof e=="number"||typeof e=="boolean"}function Sn(e,t,r,n){var o=fi(n)?n:r(n),i=t.get(o);return typeof i>"u"&&(i=e.call(this,n),t.set(o,i)),i}function An(e,t,r){var n=Array.prototype.slice.call(arguments,3),o=r(n),i=t.get(o);return typeof i>"u"&&(i=e.apply(this,n),t.set(o,i)),i}function Gt(e,t,r,n,o){return r.bind(t,e,n,o)}function gi(e,t){var r=e.length===1?Sn:An;return Gt(e,this,r,t.cache.create(),t.serializer)}function xi(e,t){return Gt(e,this,An,t.cache.create(),t.serializer)}function bi(e,t){return Gt(e,this,Sn,t.cache.create(),t.serializer)}var vi=function(){return JSON.stringify(arguments)};function Ft(){this.cache=Object.create(null)}Ft.prototype.get=function(e){return this.cache[e]};Ft.prototype.set=function(e,t){this.cache[e]=t};var yi={create:function(){return new Ft}},rt={variadic:xi,monadic:bi};var K;(function(e){e.MISSING_VALUE="MISSING_VALUE",e.INVALID_VALUE="INVALID_VALUE",e.MISSING_INTL_API="MISSING_INTL_API"})(K||(K={}));var Re=function(e){Le(t,e);function t(r,n,o){var i=e.call(this,r)||this;return i.code=n,i.originalMessage=o,i}return t.prototype.toString=function(){return"[formatjs Error: ".concat(this.code,"] ").concat(this.message)},t}(Error);var $t=function(e){Le(t,e);function t(r,n,o,i){return e.call(this,'Invalid values for "'.concat(r,'": "').concat(n,'". Options are "').concat(Object.keys(o).join('", "'),'"'),K.INVALID_VALUE,i)||this}return t}(Re);var Tn=function(e){Le(t,e);function t(r,n,o){return e.call(this,'Value for "'.concat(r,'" must be of type ').concat(n),K.INVALID_VALUE,o)||this}return t}(Re);var _n=function(e){Le(t,e);function t(r,n){return e.call(this,'The intl string context variable "'.concat(r,'" was not provided to the string "').concat(n,'"'),K.MISSING_VALUE,n)||this}return t}(Re);var C;(function(e){e[e.literal=0]="literal",e[e.object=1]="object"})(C||(C={}));function Ei(e){return e.length<2?e:e.reduce(function(t,r){var n=t[t.length-1];return!n||n.type!==C.literal||r.type!==C.literal?t.push(r):n.value+=r.value,t},[])}function wi(e){return typeof e=="function"}function Oe(e,t,r,n,o,i,a){if(e.length===1&&Ot(e[0]))return[{type:C.literal,value:e[0].value}];for(var s=[],c=0,l=e;c<l.length;c++){var h=l[c];if(Ot(h)){s.push({type:C.literal,value:h.value});continue}if(rn(h)){typeof i=="number"&&s.push({type:C.literal,value:r.getNumberFormat(t).format(i)});continue}var f=h.value;if(!(o&&f in o))throw new _n(f,a);var u=o[f];if(tn(h)){(!u||typeof u=="string"||typeof u=="number")&&(u=typeof u=="string"||typeof u=="number"?String(u):""),s.push({type:typeof u=="string"?C.literal:C.object,value:u});continue}if(Ke(h)){var g=typeof h.style=="string"?n.date[h.style]:Ce(h.style)?h.style.parsedOptions:void 0;s.push({type:C.literal,value:r.getDateTimeFormat(t,g).format(u)});continue}if(Ze(h)){var g=typeof h.style=="string"?n.time[h.style]:Ce(h.style)?h.style.parsedOptions:n.time.medium;s.push({type:C.literal,value:r.getDateTimeFormat(t,g).format(u)});continue}if(Xe(h)){var g=typeof h.style=="string"?n.number[h.style]:tt(h.style)?h.style.parsedOptions:void 0;g&&g.scale&&(u=u*(g.scale||1)),s.push({type:C.literal,value:r.getNumberFormat(t,g).format(u)});continue}if(et(h)){var b=h.children,E=h.value,R=o[E];if(!wi(R))throw new Tn(E,"function",a);var z=Oe(b,t,r,n,o,i),B=R(z.map(function(D){return D.value}));Array.isArray(B)||(B=[B]),s.push.apply(s,B.map(function(D){return{type:typeof D=="string"?C.literal:C.object,value:D}}))}if(Qe(h)){var H=h.options[u]||h.options.other;if(!H)throw new $t(h.value,u,Object.keys(h.options),a);s.push.apply(s,Oe(H.value,t,r,n,o));continue}if(Je(h)){var H=h.options["=".concat(u)];if(!H){if(!Intl.PluralRules)throw new Re(`Intl.PluralRules is not available in this environment.
Try polyfilling it using "@formatjs/intl-pluralrules"
`,K.MISSING_INTL_API,a);var V=r.getPluralRules(t,{type:h.pluralType}).select(u-(h.offset||0));H=h.options[V]||h.options.other}if(!H)throw new $t(h.value,u,Object.keys(h.options),a);s.push.apply(s,Oe(H.value,t,r,n,o,u-(h.offset||0)));continue}}return Ei(s)}function Si(e,t){return t?v(v(v({},e||{}),t||{}),Object.keys(e).reduce(function(r,n){return r[n]=v(v({},e[n]),t[n]||{}),r},{})):e}function Ai(e,t){return t?Object.keys(e).reduce(function(r,n){return r[n]=Si(e[n],t[n]),r},v({},e)):e}function Vt(e){return{create:function(){return{get:function(t){return e[t]},set:function(t,r){e[t]=r}}}}}function Ti(e){return e===void 0&&(e={number:{},dateTime:{},pluralRules:{}}),{getNumberFormat:Ne(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.NumberFormat).bind.apply(t,qe([void 0],r,!1)))},{cache:Vt(e.number),strategy:rt.variadic}),getDateTimeFormat:Ne(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.DateTimeFormat).bind.apply(t,qe([void 0],r,!1)))},{cache:Vt(e.dateTime),strategy:rt.variadic}),getPluralRules:Ne(function(){for(var t,r=[],n=0;n<arguments.length;n++)r[n]=arguments[n];return new((t=Intl.PluralRules).bind.apply(t,qe([void 0],r,!1)))},{cache:Vt(e.pluralRules),strategy:rt.variadic})}}var Ln=function(){function e(t,r,n,o){var i=this;if(r===void 0&&(r=e.defaultLocale),this.formatterCache={number:{},dateTime:{},pluralRules:{}},this.format=function(a){var s=i.formatToParts(a);if(s.length===1)return s[0].value;var c=s.reduce(function(l,h){return!l.length||h.type!==C.literal||typeof l[l.length-1]!="string"?l.push(h.value):l[l.length-1]+=h.value,l},[]);return c.length<=1?c[0]||"":c},this.formatToParts=function(a){return Oe(i.ast,i.locales,i.formatters,i.formats,a,void 0,i.message)},this.resolvedOptions=function(){return{locale:i.resolvedLocale.toString()}},this.getAst=function(){return i.ast},this.locales=r,this.resolvedLocale=e.resolveLocale(r),typeof t=="string"){if(this.message=t,!e.__parse)throw new TypeError("IntlMessageFormat.__parse must be set to process `message` of type `string`");this.ast=e.__parse(t,{ignoreTag:o?.ignoreTag,locale:this.resolvedLocale})}else this.ast=t;if(!Array.isArray(this.ast))throw new TypeError("A message must be provided as a String or AST.");this.formats=Ai(e.formats,n),this.formatters=o&&o.formatters||Ti(this.formatterCache)}return Object.defineProperty(e,"defaultLocale",{get:function(){return e.memoizedDefaultLocale||(e.memoizedDefaultLocale=new Intl.NumberFormat().resolvedOptions().locale),e.memoizedDefaultLocale},enumerable:!1,configurable:!0}),e.memoizedDefaultLocale=null,e.resolveLocale=function(t){var r=Intl.NumberFormat.supportedLocalesOf(t);return r.length>0?new Intl.Locale(r[0]):new Intl.Locale(typeof t=="string"?t:t[0])},e.__parse=wn,e.formats={number:{integer:{maximumFractionDigits:0},currency:{style:"currency"},percent:{style:"percent"}},date:{short:{month:"numeric",day:"numeric",year:"2-digit"},medium:{month:"short",day:"numeric",year:"numeric"},long:{month:"long",day:"numeric",year:"numeric"},full:{weekday:"long",month:"long",day:"numeric",year:"numeric"}},time:{short:{hour:"numeric",minute:"numeric"},medium:{hour:"numeric",minute:"numeric",second:"numeric"},long:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"},full:{hour:"numeric",minute:"numeric",second:"numeric",timeZoneName:"short"}}},e}();var Cn=Ln;var _i=/[0-9\-+#]/,Li=/[^\d\-+#]/g;function Pn(e){return e.search(_i)}function Ci(e="#.##"){let t={},r=e.length,n=Pn(e);t.prefix=n>0?e.substring(0,n):"";let o=Pn(e.split("").reverse().join("")),i=r-o,a=e.substring(i,i+1),s=i+(a==="."||a===","?1:0);t.suffix=o>0?e.substring(s,r):"",t.mask=e.substring(n,s),t.maskHasNegativeSign=t.mask.charAt(0)==="-",t.maskHasPositiveSign=t.mask.charAt(0)==="+";let c=t.mask.match(Li);return t.decimal=c&&c[c.length-1]||".",t.separator=c&&c[1]&&c[0]||",",c=t.mask.split(t.decimal),t.integer=c[0],t.fraction=c[1],t}function Pi(e,t,r){let n=!1,o={value:e};e<0&&(n=!0,o.value=-o.value),o.sign=n?"-":"",o.value=Number(o.value).toFixed(t.fraction&&t.fraction.length),o.value=Number(o.value).toString();let i=t.fraction&&t.fraction.lastIndexOf("0"),[a="0",s=""]=o.value.split(".");return(!s||s&&s.length<=i)&&(s=i<0?"":(+("0."+s)).toFixed(i+1).replace("0.","")),o.integer=a,o.fraction=s,Ni(o,t),(o.result==="0"||o.result==="")&&(n=!1,o.sign=""),!n&&t.maskHasPositiveSign?o.sign="+":n&&t.maskHasPositiveSign?o.sign="-":n&&(o.sign=r&&r.enforceMaskSign&&!t.maskHasNegativeSign?"":"-"),o}function Ni(e,t){e.result="";let r=t.integer.split(t.separator),n=r.join(""),o=n&&n.indexOf("0");if(o>-1)for(;e.integer.length<n.length-o;)e.integer="0"+e.integer;else Number(e.integer)===0&&(e.integer="");let i=r[1]&&r[r.length-1].length;if(i){let a=e.integer.length,s=a%i;for(let c=0;c<a;c++)e.result+=e.integer.charAt(c),!((c-s+1)%i)&&c<a-i&&(e.result+=t.separator)}else e.result=e.integer;return e.result+=t.fraction&&e.fraction?t.decimal+e.fraction:"",e}function Ri(e,t,r={}){if(!e||isNaN(Number(t)))return t;let n=Ci(e),o=Pi(t,n,r);return n.prefix+o.sign+o.result+n.suffix}var Nn=Ri;var Rn=".",Oi=",",Hn=/^\s+/,Mn=/\s+$/,On="&nbsp;",jt=e=>e*12,kn=(e,t)=>{let{start:r,end:n,displaySummary:{amount:o,duration:i,minProductQuantity:a,outcomeType:s}={}}=e;if(!(o&&i&&s&&a))return!1;let c=t?new Date(t):new Date;if(!r||!n)return!1;let l=new Date(r),h=new Date(n);return c>=l&&c<=h},Z={MONTH:"MONTH",YEAR:"YEAR"},Hi={[_.ANNUAL]:12,[_.MONTHLY]:1,[_.THREE_YEARS]:36,[_.TWO_YEARS]:24},Yt=(e,t)=>({accept:e,round:t}),Mi=[Yt(({divisor:e,price:t})=>t%e==0,({divisor:e,price:t})=>t/e),Yt(({usePrecision:e})=>e,({divisor:e,price:t})=>Math.round(t/e*100)/100),Yt(()=>!0,({divisor:e,price:t})=>Math.ceil(Math.floor(t*100/e)/100))],Wt={[P.YEAR]:{[_.MONTHLY]:Z.MONTH,[_.ANNUAL]:Z.YEAR},[P.MONTH]:{[_.MONTHLY]:Z.MONTH}},ki=(e,t)=>e.indexOf(`'${t}'`)===0,Ii=(e,t=!0)=>{let r=e.replace(/'.*?'/,"").trim(),n=Bn(r);return!!n?t||(r=r.replace(/[,\.]0+/,n)):r=r.replace(/\s?(#.*0)(?!\s)?/,"$&"+Di(e)),r},Bi=e=>{let t=Ui(e),r=ki(e,t),n=e.replace(/'.*?'/,""),o=Hn.test(n)||Mn.test(n);return{currencySymbol:t,isCurrencyFirst:r,hasCurrencySpace:o}},In=e=>e.replace(Hn,On).replace(Mn,On),Di=e=>e.match(/#(.?)#/)?.[1]===Rn?Oi:Rn,Ui=e=>e.match(/'(.*?)'/)?.[1]??"",Bn=e=>e.match(/0(.?)0/)?.[1]??"";function ge({formatString:e,price:t,usePrecision:r,isIndianPrice:n=!1},o,i=a=>a){let{currencySymbol:a,isCurrencyFirst:s,hasCurrencySpace:c}=Bi(e),l=r?Bn(e):"",h=Ii(e,r),f=r?2:0,u=i(t,{currencySymbol:a}),g=n?u.toLocaleString("hi-IN",{minimumFractionDigits:f,maximumFractionDigits:f}):Nn(h,u),b=r?g.lastIndexOf(l):g.length,E=g.substring(0,b),R=g.substring(b+1);return{accessiblePrice:e.replace(/'.*?'/,"SYMBOL").replace(/#.*0/,g).replace(/SYMBOL/,a),currencySymbol:a,decimals:R,decimalsDelimiter:l,hasCurrencySpace:c,integer:E,isCurrencyFirst:s,recurrenceTerm:o}}var Dn=e=>{let{commitment:t,term:r,usePrecision:n}=e,o=Hi[r]??1;return ge(e,o>1?Z.MONTH:Wt[t]?.[r],i=>{let a={divisor:o,price:i,usePrecision:n},{round:s}=Mi.find(({accept:c})=>c(a));if(!s)throw new Error(`Missing rounding rule for: ${JSON.stringify(a)}`);return s(a)})},Un=({commitment:e,term:t,...r})=>ge(r,Wt[e]?.[t]),zn=e=>{let{commitment:t,instant:r,price:n,originalPrice:o,priceWithoutDiscount:i,promotion:a,quantity:s=1,term:c}=e;if(t===P.YEAR&&c===_.MONTHLY){if(!a)return ge(e,Z.YEAR,jt);let{displaySummary:{outcomeType:l,duration:h,minProductQuantity:f=1}={}}=a;switch(l){case"PERCENTAGE_DISCOUNT":if(s>=f&&kn(a,r)){let u=parseInt(h.replace("P","").replace("M",""));if(isNaN(u))return jt(n);let g=s*o*u,b=s*i*(12-u),E=Math.floor((g+b)*100)/100;return ge({...e,price:E},Z.YEAR)}default:return ge(e,Z.YEAR,()=>jt(i??n))}}return ge(e,Wt[t]?.[c])};var zi={recurrenceLabel:"{recurrenceTerm, select, MONTH {/mo} YEAR {/yr} other {}}",recurrenceAriaLabel:"{recurrenceTerm, select, MONTH {per month} YEAR {per year} other {}}",perUnitLabel:"{perUnit, select, LICENSE {per license} other {}}",perUnitAriaLabel:"{perUnit, select, LICENSE {per license} other {}}",freeLabel:"Free",freeAriaLabel:"Free",taxExclusiveLabel:"{taxTerm, select, GST {excl. GST} VAT {excl. VAT} TAX {excl. tax} IVA {excl. IVA} SST {excl. SST} KDV {excl. KDV} other {}}",taxInclusiveLabel:"{taxTerm, select, GST {incl. GST} VAT {incl. VAT} TAX {incl. tax} IVA {incl. IVA} SST {incl. SST} KDV {incl. KDV} other {}}",alternativePriceAriaLabel:"Alternatively at {alternativePrice}",strikethroughAriaLabel:"Regularly at {strikethroughPrice}"},Gi=qr("ConsonantTemplates/price"),Fi=/<\/?[^>]+(>|$)/g,L={container:"price",containerOptical:"price-optical",containerStrikethrough:"price-strikethrough",containerAnnual:"price-annual",containerAnnualPrefix:"price-annual-prefix",containerAnnualSuffix:"price-annual-suffix",disabled:"disabled",currencySpace:"price-currency-space",currencySymbol:"price-currency-symbol",decimals:"price-decimals",decimalsDelimiter:"price-decimals-delimiter",integer:"price-integer",recurrence:"price-recurrence",taxInclusivity:"price-tax-inclusivity",unitType:"price-unit-type"},Q={perUnitLabel:"perUnitLabel",perUnitAriaLabel:"perUnitAriaLabel",recurrenceLabel:"recurrenceLabel",recurrenceAriaLabel:"recurrenceAriaLabel",taxExclusiveLabel:"taxExclusiveLabel",taxInclusiveLabel:"taxInclusiveLabel",strikethroughAriaLabel:"strikethroughAriaLabel"},$i="TAX_EXCLUSIVE",Vi=e=>Wr(e)?Object.entries(e).filter(([,t])=>Ae(t)||Ct(t)||t===!0).reduce((t,[r,n])=>t+` ${r}${n===!0?"":'="'+jr(n)+'"'}`,""):"",N=(e,t,r,n=!1)=>`<span class="${e}${t?"":" "+L.disabled}"${Vi(r)}>${n?In(t):t??""}</span>`;function ji(e,{accessibleLabel:t,currencySymbol:r,decimals:n,decimalsDelimiter:o,hasCurrencySpace:i,integer:a,isCurrencyFirst:s,recurrenceLabel:c,perUnitLabel:l,taxInclusivityLabel:h},f={}){let u=N(L.currencySymbol,r),g=N(L.currencySpace,i?"&nbsp;":""),b="";return s&&(b+=u+g),b+=N(L.integer,a),b+=N(L.decimalsDelimiter,o),b+=N(L.decimals,n),s||(b+=g+u),b+=N(L.recurrence,c,null,!0),b+=N(L.unitType,l,null,!0),b+=N(L.taxInclusivity,h,!0),N(e,b,{...f,"aria-label":t})}var k=({displayOptical:e=!1,displayStrikethrough:t=!1,displayAnnual:r=!1,instant:n=void 0}={})=>({country:o,displayFormatted:i=!0,displayRecurrence:a=!0,displayPerUnit:s=!1,displayTax:c=!1,language:l,literals:h={},quantity:f=1}={},{commitment:u,offerSelectorIds:g,formatString:b,price:E,priceWithoutDiscount:R,taxDisplay:z,taxTerm:B,term:H,usePrecision:V,promotion:D}={},j={})=>{Object.entries({country:o,formatString:b,language:l,price:E}).forEach(([U,lt])=>{if(lt==null)throw new Error(`Argument "${U}" is missing for osi ${g?.toString()}, country ${o}, language ${l}`)});let Be={...zi,...h},mo=`${l.toLowerCase()}-${o.toUpperCase()}`;function te(U,lt){let ht=Be[U];if(ht==null)return"";try{return new Cn(ht.replace(Fi,""),mo).format(lt)}catch{return Gi.error("Failed to format literal:",ht),""}}let po=t&&R?R:E,or=e?Dn:Un;r&&(or=zn);let{accessiblePrice:uo,recurrenceTerm:at,...ir}=or({commitment:u,formatString:b,instant:n,isIndianPrice:o==="IN",originalPrice:E,priceWithoutDiscount:R,price:e?E:po,promotion:D,quantity:f,term:H,usePrecision:V}),re=uo,st="";if(O(a)&&at){let U=te(Q.recurrenceAriaLabel,{recurrenceTerm:at});U&&(re+=" "+U),st=te(Q.recurrenceLabel,{recurrenceTerm:at})}let ct="";if(O(s)){ct=te(Q.perUnitLabel,{perUnit:"LICENSE"});let U=te(Q.perUnitAriaLabel,{perUnit:"LICENSE"});U&&(re+=" "+U)}let be="";O(c)&&B&&(be=te(z===$i?Q.taxExclusiveLabel:Q.taxInclusiveLabel,{taxTerm:B}),be&&(re+=" "+be)),t&&(re=te(Q.strikethroughAriaLabel,{strikethroughPrice:re}));let ve=L.container;if(e&&(ve+=" "+L.containerOptical),t&&(ve+=" "+L.containerStrikethrough),r&&(ve+=" "+L.containerAnnual),O(i))return ji(ve,{...ir,accessibleLabel:re,recurrenceLabel:st,perUnitLabel:ct,taxInclusivityLabel:be},j);let{currencySymbol:ar,decimals:fo,decimalsDelimiter:go,hasCurrencySpace:sr,integer:xo,isCurrencyFirst:bo}=ir,ne=[xo,go,fo];bo?(ne.unshift(sr?"\xA0":""),ne.unshift(ar)):(ne.push(sr?"\xA0":""),ne.push(ar)),ne.push(st,ct,be);let vo=ne.join("");return N(ve,vo,j)},Gn=()=>(e,t,r)=>{let o=(e.displayOldPrice===void 0||O(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price;return`${k()(e,t,r)}${o?"&nbsp;"+k({displayStrikethrough:!0})(e,t,r):""}`},Fn=()=>(e,t,r)=>{let{instant:n}=e;try{n||(n=new URLSearchParams(document.location.search).get("instant")),n&&(n=new Date(n))}catch{n=void 0}let o={...e,displayTax:!1,displayPerUnit:!1};return`${(e.displayOldPrice===void 0||O(e.displayOldPrice))&&t.priceWithoutDiscount&&t.priceWithoutDiscount!=t.price?k({displayStrikethrough:!0})(o,t,r)+"&nbsp;":""}${k()(e,t,r)}${N(L.containerAnnualPrefix,"&nbsp;(")}${k({displayAnnual:!0,instant:n})(o,t,r)}${N(L.containerAnnualSuffix,")")}`},$n=()=>(e,t,r)=>{let n={...e,displayTax:!1,displayPerUnit:!1};return`${k()(e,t,r)}${N(L.containerAnnualPrefix,"&nbsp;(")}${k({displayAnnual:!0})(n,t,r)}${N(L.containerAnnualSuffix,")")}`};var Yi=k(),Wi=Gn(),qi=k({displayOptical:!0}),Xi=k({displayStrikethrough:!0}),Ki=k({displayAnnual:!0}),Zi=$n(),Qi=Fn();var Ji=(e,t)=>{if(!(!_e(e)||!_e(t)))return Math.floor((t-e)/t*100)},Vn=()=>(e,t)=>{let{price:r,priceWithoutDiscount:n}=t,o=Ji(r,n);return o===void 0?'<span class="no-discount"></span>':`<span class="discount">${o}%</span>`};var ea=Vn();var{freeze:He}=Object,qt=He({...we}),Xt=He({...Se}),Kt={STAGE:"STAGE",PRODUCTION:"PRODUCTION",LOCAL:"LOCAL"},Bm=He({...P}),Dm=He({...en}),Um=He({..._});var Yn="mas-commerce-service";function Wn(e,{once:t=!1}={}){let r=null;function n(){let o=document.querySelector(Yn);o!==r&&(r=o,o&&e(o))}return document.addEventListener(ut,n,{once:t}),Me(n),()=>document.removeEventListener(ut,n)}function qn(e,{country:t,forceTaxExclusive:r,perpetual:n}){let o;if(e.length<2)o=e;else{let i=t==="GB"||n?"EN":"MULT",[a,s]=e;o=[a.language===i?a:s]}return r&&(o=o.map(Nt)),o}var Me=e=>window.setTimeout(e);function J(){return document.getElementsByTagName(Yn)?.[0]}var ee={clientId:"merch-at-scale",delimiter:"\xB6",ignoredProperties:["analytics","literals"],serializableTypes:["Array","Object"],sampleRate:1,tags:"acom",isProdDomain:!1},Xn=1e3,Kn=new Set;function na(e){return e instanceof Error||typeof e?.originatingRequest=="string"}function Zn(e){if(e==null)return;let t=typeof e;if(t==="function")return e.name?`function ${e.name}`:"function";if(t==="object"){if(e instanceof Error)return e.message;if(typeof e.originatingRequest=="string"){let{message:n,originatingRequest:o,status:i}=e;return[n,i,o].filter(Boolean).join(" ")}let r=e[Symbol.toStringTag]??Object.getPrototypeOf(e).constructor.name;if(!ee.serializableTypes.includes(r))return r}return e}function oa(e,t){if(!ee.ignoredProperties.includes(e))return Zn(t)}var Zt={append(e){if(e.level!=="error")return;let{message:t,params:r}=e,n=[],o=[],i=t;r.forEach(l=>{l!=null&&(na(l)?n:o).push(l)}),n.length&&(i+=" "+n.map(Zn).join(" "));let{pathname:a,search:s}=window.location,c=`${ee.delimiter}page=${a}${s}`;c.length>Xn&&(c=`${c.slice(0,Xn)}<trunc>`),i+=c,o.length&&(i+=`${ee.delimiter}facts=`,i+=JSON.stringify(o,oa)),Kn.has(i)||(Kn.add(i),window.lana?.log(i,ee))}};function Qn(e){Object.assign(ee,Object.fromEntries(Object.entries(e).filter(([t,r])=>t in ee&&r!==""&&r!==null&&r!==void 0&&!Number.isNaN(r))))}var ia=Object.freeze({checkoutClientId:"adobe_com",checkoutWorkflow:qt.V3,checkoutWorkflowStep:Xt.EMAIL,country:"US",displayOldPrice:!0,displayPerUnit:!1,displayRecurrence:!0,displayTax:!1,env:Kt.PRODUCTION,forceTaxExclusive:!1,language:"en",entitlement:!1,extraOptions:{},modal:!1,promotionCode:"",quantity:1,wcsApiKey:"wcms-commerce-ims-ro-user-milo",wcsBufferDelay:1,wcsURL:"https://www.adobe.com/web_commerce_artifact",landscape:xt.PUBLISHED,wcsBufferLimit:1});var Qt=Object.freeze({LOCAL:"local",PROD:"prod",STAGE:"stage"});var Jt={DEBUG:"debug",ERROR:"error",INFO:"info",WARN:"warn"},aa=Date.now(),er=new Set,tr=new Set,Jn=new Map,eo={append({level:e,message:t,params:r,timestamp:n,source:o}){console[e](`${n}ms [${o}] %c${t}`,"font-weight: bold;",...r)}},to={filter:({level:e})=>e!==Jt.DEBUG},sa={filter:()=>!1};function ca(e,t,r,n,o){return{level:e,message:t,namespace:r,get params(){return n.length===1&&Te(n[0])&&(n=n[0](),Array.isArray(n)||(n=[n])),n},source:o,timestamp:Date.now()-aa}}function la(e){[...tr].every(t=>t(e))&&er.forEach(t=>t(e))}function ro(e){let t=(Jn.get(e)??0)+1;Jn.set(e,t);let r=`${e} #${t}`,n={id:r,namespace:e,module:o=>ro(`${n.namespace}/${o}`),updateConfig:Qn};return Object.values(Jt).forEach(o=>{n[o]=(i,...a)=>la(ca(o,i,e,a,r))}),Object.seal(n)}function nt(...e){e.forEach(t=>{let{append:r,filter:n}=t;Te(n)&&tr.add(n),Te(r)&&er.add(r)})}function ha(e={}){let{name:t}=e,r=O(ue("commerce.debug",{search:!0,storage:!0}),t===Qt.LOCAL);return nt(r?eo:to),t===Qt.PROD&&nt(Zt),rr}function da(){er.clear(),tr.clear()}var rr={...ro(_r),Level:Jt,Plugins:{consoleAppender:eo,debugFilter:to,quietFilter:sa,lanaAppender:Zt},init:ha,reset:da,use:nt};var ma={[F]:Er,[Y]:wr,[$]:Sr},pa={[F]:Ar,[$]:Tr},ot=class{constructor(t){p(this,"changes",new Map);p(this,"connected",!1);p(this,"dispose",fe);p(this,"error");p(this,"log");p(this,"options");p(this,"promises",[]);p(this,"state",Y);p(this,"timer",null);p(this,"value");p(this,"version",0);p(this,"wrapperElement");this.wrapperElement=t}update(){[F,Y,$].forEach(t=>{this.wrapperElement.classList.toggle(ma[t],t===this.state)})}notify(){(this.state===$||this.state===F)&&(this.state===$?this.promises.forEach(({resolve:t})=>t(this.wrapperElement)):this.state===F&&this.promises.forEach(({reject:t})=>t(this.error)),this.promises=[]),this.wrapperElement.dispatchEvent(new CustomEvent(pa[this.state],{bubbles:!0}))}attributeChangedCallback(t,r,n){this.changes.set(t,n),this.requestUpdate()}connectedCallback(){this.dispose=Wn(()=>this.requestUpdate(!0))}disconnectedCallback(){this.connected&&(this.connected=!1,this.log?.debug("Disconnected:",{element:this.wrapperElement})),this.dispose(),this.dispose=fe}onceSettled(){let{error:t,promises:r,state:n}=this;return $===n?Promise.resolve(this.wrapperElement):F===n?Promise.reject(t):new Promise((o,i)=>{r.push({resolve:o,reject:i})})}toggleResolved(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.state=$,this.value=r,this.update(),this.log?.debug("Resolved:",{element:this.wrapperElement,value:r}),Me(()=>this.notify()),!0)}toggleFailed(t,r,n){return t!==this.version?!1:(n!==void 0&&(this.options=n),this.error=r,this.state=F,this.update(),this.log?.error("Failed:",{element:this.wrapperElement,error:r}),Me(()=>this.notify()),!0)}togglePending(t){return this.version++,t&&(this.options=t),this.state=Y,this.update(),this.log?.debug("Pending:",{osi:this.wrapperElement?.options?.wcsOsi}),this.version}requestUpdate(t=!1){if(!this.wrapperElement.isConnected||!J()||this.timer)return;let r=rr.module("mas-element"),{error:n,options:o,state:i,value:a,version:s}=this;this.state=Y,this.timer=Me(async()=>{this.timer=null;let c=null;if(this.changes.size&&(c=Object.fromEntries(this.changes.entries()),this.changes.clear()),this.connected?this.log?.debug("Updated:",{element:this.wrapperElement,changes:c}):(this.connected=!0,this.log?.debug("Connected:",{element:this.wrapperElement,changes:c})),c||t)try{await this.wrapperElement.render?.()===!1&&this.state===Y&&this.version===s&&(this.state=i,this.error=n,this.value=a,this.update(),this.notify())}catch(l){r.error("Failed to render mas-element: ",l),this.toggleFailed(this.version,l,o)}})}};function no(e={}){return Object.entries(e).forEach(([t,r])=>{(r==null||r===""||r?.length===0)&&delete e[t]}),e}function oo(e,t={}){let{tag:r,is:n}=e,o=document.createElement(r,{is:n});return o.setAttribute("is",n),Object.assign(o.dataset,no(t)),o}function io(e,t={}){return e instanceof HTMLElement?(Object.assign(e.dataset,no(t)),e):null}var ua="download",fa="upgrade";function ao(e,t={},r=""){let n=J();if(!n)return null;let{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:f,quantity:u,wcsOsi:g,extraOptions:b}=n.collectCheckoutOptions(t),E=oo(e,{checkoutMarketSegment:o,checkoutWorkflow:i,checkoutWorkflowStep:a,entitlement:s,upgrade:c,modal:l,perpetual:h,promotionCode:f,quantity:u,wcsOsi:g,extraOptions:b});return r&&(E.innerHTML=`<span style="pointer-events: none;">${r}</span>`),E}function so(e){return class extends e{constructor(){super(...arguments);p(this,"checkoutActionHandler");p(this,"masElement",new ot(this))}attributeChangedCallback(n,o,i){this.masElement.attributeChangedCallback(n,o,i)}connectedCallback(){this.masElement.connectedCallback(),this.addEventListener("click",this.clickHandler)}disconnectedCallback(){this.masElement.disconnectedCallback(),this.removeEventListener("click",this.clickHandler)}onceSettled(){return this.masElement.onceSettled()}get value(){return this.masElement.value}get options(){return this.masElement.options}requestUpdate(n=!1){return this.masElement.requestUpdate(n)}static get observedAttributes(){return["data-checkout-workflow","data-checkout-workflow-step","data-extra-options","data-ims-country","data-perpetual","data-promotion-code","data-quantity","data-template","data-wcs-osi","data-entitlement","data-upgrade","data-modal"]}async render(n={}){if(!this.isConnected)return!1;let o=J();if(!o)return!1;this.dataset.imsCountry||o.imsCountryPromise.then(f=>{f&&(this.dataset.imsCountry=f)},fe),n.imsCountry=null;let i=o.collectCheckoutOptions(n,this);if(!i.wcsOsi.length)return!1;let a;try{a=JSON.parse(i.extraOptions??"{}")}catch(f){this.masElement.log?.error("cannot parse exta checkout options",f)}let s=this.masElement.togglePending(i);this.setCheckoutUrl("");let c=o.resolveOfferSelectors(i),l=await Promise.all(c);l=l.map(f=>qn(f,i)),i.country=this.dataset.imsCountry||i.country;let h=await o.buildCheckoutAction?.(l.flat(),{...a,...i},this);return this.renderOffers(l.flat(),i,{},h,s)}renderOffers(n,o,i={},a=void 0,s=void 0){if(!this.isConnected)return!1;let c=J();if(!c)return!1;if(o={...JSON.parse(this.dataset.extraOptions??"null"),...o,...i},s??(s=this.masElement.togglePending(o)),this.checkoutActionHandler&&(this.checkoutActionHandler=void 0),a){this.classList.remove(ua,fa),this.masElement.toggleResolved(s,n,o);let{url:h,text:f,className:u,handler:g}=a;return h&&this.setCheckoutUrl(h),f&&(this.firstElementChild.innerHTML=f),u&&this.classList.add(...u.split(" ")),g&&(this.setCheckoutUrl("#"),this.checkoutActionHandler=g.bind(this)),!0}else if(n.length){if(this.masElement.toggleResolved(s,n,o)){let h=c.buildCheckoutURL(n,o);return this.setCheckoutUrl(h),!0}}else{let h=new Error(`Not provided: ${o?.wcsOsi??"-"}`);if(this.masElement.toggleFailed(s,h,o))return this.setCheckoutUrl("#"),!0}}setCheckoutUrl(){}clickHandler(n){}updateOptions(n={}){let o=J();if(!o)return!1;let{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:f,promotionCode:u,quantity:g,wcsOsi:b}=o.collectCheckoutOptions(n);return io(this,{checkoutMarketSegment:i,checkoutWorkflow:a,checkoutWorkflowStep:s,entitlement:c,upgrade:l,modal:h,perpetual:f,promotionCode:u,quantity:g,wcsOsi:b}),!0}}}var ke=class ke extends so(HTMLButtonElement){static createCheckoutButton(t={},r=""){return ao(ke,t,r)}setCheckoutUrl(t){this.setAttribute("data-href",t)}get href(){return this.getAttribute("data-href")}get isCheckoutButton(){return!0}clickHandler(t){if(this.checkoutActionHandler){this.checkoutActionHandler?.(t);return}this.href&&(window.location.href=this.href)}};p(ke,"is","checkout-button"),p(ke,"tag","button");var xe=ke;window.customElements.get(xe.is)||window.customElements.define(xe.is,xe,{extends:xe.tag});var ga="#000000",xa="#F8D904",ba=/(accent|primary|secondary)(-(outline|link))?/,va="mas:product_code/",ya="daa-ll",it="daa-lh",Ea=["XL","L","M","S"];function wa(e,t,r){e.mnemonicIcon?.map((o,i)=>({icon:o,alt:e.mnemonicAlt[i]??"",link:e.mnemonicLink[i]??""}))?.forEach(({icon:o,alt:i,link:a})=>{if(a&&!/^https?:/.test(a))try{a=new URL(`https://${a}`).href.toString()}catch{a="#"}let s={slot:"icons",src:o,size:r?.size??"l"};i&&(s.alt=i),a&&(s.href=a);let c=I("merch-icon",s);t.append(c)})}function Sa(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||ga),t.setAttribute("badge-background-color",e.badgeBackgroundColor||xa))}function Aa(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function Ta(e,t,r){if(e.cardTitle&&r){let n={slot:r.slot},o=e.cardTitle,{maxCount:i}=r;if(i){let[a,s]=co(e.cardTitle,i);a!==e.cardTitle&&(n.title=s,o=`${a.trim()}...`)}t.append(I(r.tag,n,o))}}function _a(e,t,r){e.subtitle&&r&&t.append(I(r.tag,{slot:r.slot},e.subtitle))}function La(e,t,r){r?.includes(e.backgroundColor)&&t.setAttribute("background-color",e.backgroundColor)}function Ca(e,t,r){if(r?.tag&&e.backgroundImage){let n={loading:"lazy",src:e.backgroundImage};e.backgroundImageAltText?n.alt=e.backgroundImageAltText:n.role="none",t.append(I(r.tag,{slot:r.slot},I("img",n)))}r?.attribute&&t.setAttribute(r.attribute,e.backgroundImage)}function Pa(e,t,r){if(e.prices&&r){let n=I(r.tag,{slot:r.slot},e.prices);t.append(n)}}function Na(e,t,r){if(e.description&&r){let n={slot:r.slot},o=e.description,{maxCount:i}=r;if(i){let[a,s]=co(e.description,i);a!==e.description&&(n.title=s,o=`${a.trim()}...`)}t.append(I(r.tag,n,o))}}function co(e,t){let r=Ra(e);if(r.length<=t)return[e,r];let n=0,o=!1,i=t-3<1?1:t-3;for(let a of e){if(n++,a==="<"&&(o=!0),a===">"){o=!1;continue}if(!o&&(i--,i===0))break}return[e.substring(0,n),r]}function Ra(e){let t="",r=!1;for(let n of e){if(n==="<"&&(r=!0),n===">"){r=!1;continue}r||(t+=n)}return t}function Oa(e,t,r,n){let i=customElements.get("checkout-button").createCheckoutButton({},e.innerHTML);i.setAttribute("tabindex",0);for(let h of e.attributes)["class","is"].includes(h.name)||i.setAttribute(h.name,h.value);i.firstElementChild?.classList.add("spectrum-Button-label");let a=t.ctas.size??"M",s=`spectrum-Button--${n}`,c=Ea.includes(a)?`spectrum-Button--size${a}`:"spectrum-Button--sizeM",l=["spectrum-Button",s,c];return r&&l.push("spectrum-Button--outline"),i.classList.add(...l),i}function Ha(e,t,r,n){let o="fill";r&&(o="outline");let i=I("sp-button",{treatment:o,variant:n,tabIndex:0,size:t.ctas.size??"m"},e);return i.addEventListener("click",a=>{a.target!==e&&(a.stopPropagation(),e.click())}),i}function Ma(e,t){return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function ka(e,t,r,n){if(e.ctas){let{slot:o}=r.ctas,i=I("div",{slot:o},e.ctas),a=[...i.querySelectorAll("a")].map(s=>{let c=s.parentElement.tagName==="STRONG";if(t.consonant)return Ma(s,c);let l=ba.exec(s.className)?.[0]??"accent",h=l.includes("accent"),f=l.includes("primary"),u=l.includes("secondary"),g=l.includes("-outline");if(l.includes("-link"))return s;let E;return h||c?E="accent":f?E="primary":u&&(E="secondary"),t.spectrum==="swc"?Ha(s,r,g,E):Oa(s,r,g,E)});i.innerHTML="",i.append(...a),t.append(i)}}function Ia(e,t){let{tags:r}=e,n=r?.find(o=>o.startsWith(va))?.split("/").pop();n&&(t.setAttribute(it,n),t.querySelectorAll("a[data-analytics-id],button[data-analytics-id]").forEach((o,i)=>{o.setAttribute(ya,`${o.dataset.analyticsId}-${i+1}`)}))}function Ba(e){e.spectrum==="css"&&[["primary-link","primary"],["secondary-link","secondary"]].forEach(([t,r])=>{e.querySelectorAll(`a.${t}`).forEach(n=>{n.classList.remove(t),n.classList.add("spectrum-Link",`spectrum-Link--${r}`)})})}async function lo(e,t){let{fields:r}=e,{variant:n}=r;if(!n)return;t.id=e.id,t.querySelectorAll("[slot]").forEach(i=>{i.remove()}),t.removeAttribute("background-image"),t.removeAttribute("background-color"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.classList.remove("wide-strip"),t.classList.remove("thin-strip"),t.removeAttribute(it),t.variant=n,await t.updateComplete;let{aemFragmentMapping:o}=t.variantLayout;o&&(wa(r,t,o.mnemonics),Sa(r,t),Aa(r,t,o.allowedSizes),Ta(r,t,o.title),_a(r,t,o.subtitle),Pa(r,t,o.prices),Ca(r,t,o.backgroundImage,n),La(r,t,o.allowedColors),Na(r,t,o.description),ka(r,t,o,n),Ia(r,t),Ba(t))}var Ua="merch-card",za=":start",Ga=":ready",Fa=1e4,ho="merch-card:",Ie,nr,m=class extends Da{constructor(){super();De(this,Ie);p(this,"customerSegment");p(this,"marketSegment");p(this,"variantLayout");this.filters={},this.types="",this.selected=!1,this.spectrum="css",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=wt(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=wt(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--consonant-merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(r)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;if(n.length!==0)for(let o of n){await o.onceSettled();let i=o.value?.[0]?.planType;if(!i)return;let a=this.stockOfferOsis[i];if(!a)return;let s=o.dataset.wcsOsi.split(",").filter(c=>c!==a);r.checked&&s.push(a),o.dataset.wcsOsi=s.join(",")}}handleQuantitySelection(r){let n=this.checkoutLinks;for(let o of n)o.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let n={...this.filters};Object.keys(n).forEach(o=>{if(r){n[o].order=Math.min(n[o].order||2,2);return}let i=n[o].order;i===1||isNaN(i)||(n[o].order=Number(i)+1)}),this.filters=n}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback();let r=this.querySelector("aem-fragment")?.getAttribute("fragment");performance.mark(`${ho}${r}${za}`),this.addEventListener(gt,this.handleQuantitySelection),this.addEventListener(gr,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener($e,this.handleAemFragmentEvents),this.addEventListener(Fe,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout?.disconnectedCallbackHook(),this.removeEventListener(gt,this.handleQuantitySelection),this.storageOptions?.removeEventListener(ft,this.handleStorageChange),this.removeEventListener($e,this.handleAemFragmentEvents),this.removeEventListener(Fe,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===$e&&pt(this,Ie,nr).call(this,"AEM fragment cannot be loaded"),r.type===Fe&&r.target.nodeName==="AEM-FRAGMENT"){let n=r.detail;await lo(n,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(i=>i.onceSettled().catch(()=>i))).then(i=>i.every(a=>a.classList.contains("placeholder-resolved"))),n=new Promise(i=>setTimeout(()=>i(!1),Fa));if(await Promise.race([r,n])===!0){performance.mark(`${ho}${this.id}${Ga}`),this.dispatchEvent(new CustomEvent(vr,{bubbles:!0,composed:!0}));return}pt(this,Ie,nr).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let n=this.querySelector(`merch-offer-select[storage="${r}"]`);if(n)return n}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}displayFooterElementsInColumn(){if(!this.classList.contains("product"))return;let r=this.shadowRoot.querySelector(".secure-transaction-label");(this.footerSlot?.querySelectorAll('a[is="checkout-link"].con-button')).length===2&&r&&r.parentElement.classList.add("footer-column")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||(this.dispatchEvent(new CustomEvent(xr,{bubbles:!0})),this.displayFooterElementsInColumn())}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(ft,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let n=this.dynamicPrice;if(r.price&&n){let o=r.price.cloneNode(!0);n.onceSettled?n.onceSettled().then(()=>{n.replaceWith(o)}):n.replaceWith(o)}}};Ie=new WeakSet,nr=function(r){this.dispatchEvent(new CustomEvent(yr,{detail:r,bubbles:!0,composed:!0}))},p(m,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[n,o,i]=r.split(",");return{PUF:n,ABM:o,M2M:i}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(n=>{let[o,i,a]=n.split(":"),s=Number(i);return[o,{order:isNaN(s)?void 0:s,size:a}]})),toAttribute:r=>Object.entries(r).map(([n,{order:o,size:i}])=>[n,o,i].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:it,reflect:!0}}),p(m,"styles",[pr,Fr(),...ur()]);customElements.define(Ua,m);

var De=Object.defineProperty;var ce=r=>{throw TypeError(r)};var He=(r,t,e)=>t in r?De(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var i=(r,t,e)=>He(r,typeof t!="symbol"?t+"":t,e),j=(r,t,e)=>t.has(r)||ce("Cannot "+e);var K=(r,t,e)=>(j(r,t,"read from private field"),e?e.call(r):t.get(r)),T=(r,t,e)=>t.has(r)?ce("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(r):t.set(r,e),ie=(r,t,e,a)=>(j(r,t,"write to private field"),a?a.call(r,e):t.set(r,e),e),Y=(r,t,e)=>(j(r,t,"access private method"),e);import{LitElement as wt}from"../lit-all.min.js";import{LitElement as Be,html as ne,css as Ie}from"../lit-all.min.js";var n=class extends Be{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?ne`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:ne` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};i(n,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),i(n,"styles",Ie`
        :host {
            --img-width: 32px;
            --img-height: 32px;
            display: block;
            width: var(--img-width);
            height: var(--img-height);
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
            width: var(--img-width);
            height: var(--img-height);
        }
    `);customElements.define("merch-icon",n);import{css as de,unsafeCSS as se}from"../lit-all.min.js";var v="(max-width: 767px)",N="(max-width: 1199px)",g="(min-width: 768px)",p="(min-width: 1200px)",u="(min-width: 1600px)";var he=de`
    :host {
        --merch-card-border: 1px solid var(--merch-card-border-color);
        background-color: var(--merch-card-background-color);
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--merch-card-border);
        box-sizing: border-box;
        color: var(--merch-card-color);
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
        box-sizing: border-box;
        box-shadow: inset 0 0 0 2px var(--merch-color-accent);
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

    hr {
        background-color: var(--merch-color-gray-200);
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
        font-size: var(--merch-card-body-font-size);
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
        font-size: var(--merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--merch-color-gray-600);
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
        background: var(--checkmark-icon) no-repeat var(--merch-color-accent);
        border-color: var(--merch-color-accent);
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
        background-color: var(--merch-color-accent);
        background-image: var(--checkmark-icon);
        border-color: var(--merch-color-accent);
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
`,le=()=>[de`
        /* Tablet */
        @media screen and ${se(g)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${se(p)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `];import{html as P}from"../lit-all.min.js";var y,R=class R{constructor(t){i(this,"card");T(this,y);this.card=t,this.insertVariantStyle()}getContainer(){return ie(this,y,K(this,y)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),K(this,y)}insertVariantStyle(){if(!R.styleMap[this.card.variant]){R.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,e){if(!t)return;let a=`--merch-card-${this.card.variant}-${e}-height`,o=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),c=parseInt(this.getContainer().style.getPropertyValue(a))||0;o>c&&this.getContainer().style.setProperty(a,`${o}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),P`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return P` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get stripStyle(){if(this.card.backgroundImage){let t=new Image;return t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")},`
          background: url("${this.card.backgroundImage}");
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: ${this.card.dir==="ltr"?"left":"right"};
        `}return""}get secureLabelFooter(){let t=this.card.secureLabel?P`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return P`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,e=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||e===0||this.card.style.setProperty("--merch-card-heading-xs-max-width",`${Math.round(t-e-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};y=new WeakMap,i(R,"styleMap",{});var m=R;import{html as Z,css as Fe}from"../lit-all.min.js";function f(r,t={},e=""){let a=document.createElement(r);e instanceof HTMLElement?a.appendChild(e):a.innerHTML=e;for(let[o,c]of Object.entries(t))a.setAttribute(o,c);return a}function D(){return window.matchMedia("(max-width: 767px)").matches}function me(){return window.matchMedia("(max-width: 1024px)").matches}var pe="merch-offer-select:ready",ge="merch-card:ready",ue="merch-card:action-menu-toggle";var W="merch-storage:change",Q="merch-quantity-selector:change";var H="aem:load",B="aem:error",xe="mas:ready",fe="mas:error";var ve=`
:root {
  --merch-card-catalog-width: 276px;
  --merch-card-catalog-icon-size: 40px;
}
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--merch-card-catalog-width);
}

@media screen and ${g} {
    :root {
      --merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--merch-card-catalog-width));
    }
}

@media screen and ${p} {
    :root {
      --merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--merch-card-catalog-width));
    }
}

@media screen and ${u} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--merch-card-catalog-width));
    }
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
  background-color: #000;
  color: var(--color-white, #fff);
  font-size: var(--merch-card-body-xs-font-size);
  width: fit-content;
  padding: var(--consonant-merch-spacing-xs);
  border-radius: var(--consonant-merch-spacing-xxxs);
  position: absolute;
  top: 55px;
  right: 15px;
  line-height: var(--merch-card-body-line-height);
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
  line-height: var(--merch-card-body-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] ::marker {
  margin-right: 0;
}

merch-card[variant="catalog"] [slot="action-menu-content"] p {
  color: var(--color-white, #fff);
}

merch-card[variant="catalog"] [slot="action-menu-content"] a {
  color: var(--merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--merch-card-body-line-height);
}`;var Ge={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"m"},allowedSizes:["wide","super-wide"]},w=class extends m{constructor(e){super(e);i(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(ue,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});i(this,"toggleActionMenu",e=>{let a=this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');!a||!e||e.type!=="click"&&e.code!=="Space"&&e.code!=="Enter"||(e.preventDefault(),a.classList.toggle("hidden"),a.classList.contains("hidden")||this.dispatchActionMenuToggle())});i(this,"toggleActionMenuFromCard",e=>{let a=e?.type==="mouseleave"?!0:void 0,o=this.card.shadowRoot,c=o.querySelector(".action-menu");this.card.blur(),c?.classList.remove("always-visible");let l=o.querySelector('slot[name="action-menu-content"]');l&&(a||this.dispatchActionMenuToggle(),l.classList.toggle("hidden",a))});i(this,"hideActionMenu",e=>{this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')?.classList.add("hidden")});i(this,"focusEventHandler",e=>{let a=this.card.shadowRoot.querySelector(".action-menu");a&&(a.classList.add("always-visible"),(e.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||e.relatedTarget?.nodeName==="MERCH-CARD"&&e.target.nodeName!=="MERCH-ICON")&&a.classList.remove("always-visible"))})}get aemFragmentMapping(){return Ge}renderLayout(){return Z` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${me()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Z`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Z`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return ve}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};i(w,"variantStyle",Fe`
        :host([variant='catalog']) {
            min-height: 330px;
            width: var(--merch-card-catalog-width);
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
    `);import{html as M}from"../lit-all.min.js";var be=`
:root {
  --merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--merch-card-image-width);
}

@media screen and ${g} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--merch-card-image-width));
  }
}

@media screen and ${p} {
  :root {
    --merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--merch-card-image-width));
  }
}

@media screen and ${u} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--merch-card-image-width));
  }
}
`;var I=class extends m{constructor(t){super(t)}getGlobalCSS(){return be}renderLayout(){return M`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?M`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:M`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?M`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:M`
              <hr />
              ${this.secureLabelFooter}
          `}`}};import{html as we}from"../lit-all.min.js";var ye=`
:root {
  --merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--merch-card-inline-heading-width);
}

@media screen and ${g} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--merch-card-inline-heading-width));
  }
}

@media screen and ${p} {
  :root {
    --merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--merch-card-inline-heading-width));
  }
}

@media screen and ${u} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--merch-card-inline-heading-width));
  }
}
`;var F=class extends m{constructor(t){super(t)}getGlobalCSS(){return ye}renderLayout(){return we` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":we`<hr />`} ${this.secureLabelFooter}`}};import{html as G,css as Ue,unsafeCSS as Se}from"../lit-all.min.js";var Ee=`
  :root {
    --merch-card-mini-compare-chart-icon-size: 32px;
    --merch-card-mini-compare-mobile-cta-font-size: 15px;
    --merch-card-mini-compare-mobile-cta-width: 75px;
    --merch-card-mini-compare-badge-mobile-max-width: 50px;
  }
  
  merch-card[variant="mini-compare-chart"] [slot="heading-m"] {
    padding: 0 var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="body-m"] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [is="inline-price"] {
    display: inline-block;
    min-height: 30px;
    min-width: 1px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] {
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0px;
  }

  merch-card[variant="mini-compare-chart"] [slot='callout-content'] [is="inline-price"] {
    min-height: unset;
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
    font-size: var(--merch-card-body-xs-font-size);
    padding: 0 var(--consonant-merch-spacing-s);
  }

  merch-card[variant="mini-compare-chart"] [slot="price-commitment"] a {
    display: inline-block;
    height: 27px;
  }

  merch-card[variant="mini-compare-chart"] [slot="offers"] {
    font-size: var(--merch-card-body-xs-font-size);
  }

  merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
    font-size: var(--merch-card-body-xs-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;    
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--merch-card-body-m-font-size);
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s) 0;
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] a {
    text-decoration: underline;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon {
    display: flex;
    place-items: center;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-icon img {
    max-width: initial;
    width: var(--merch-card-mini-compare-chart-icon-size);
    height: var(--merch-card-mini-compare-chart-icon-size);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell {
    border-top: 1px solid var(--merch-card-border-color);
    display: flex;
    gap: var(--consonant-merch-spacing-xs);
    justify-content: start;
    place-items: center;
    padding: var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-s);
    margin-block: 0px;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description p {
    color: var(--merch-color-gray-80);
    vertical-align: bottom;
  }

  merch-card[variant="mini-compare-chart"] .footer-row-cell-description a {
    text-decoration: solid;
  }
  
.one-merch-card.mini-compare-chart {
  grid-template-columns: var(--merch-card-mini-compare-chart-wide-width);
  gap: var(--consonant-merch-spacing-xs);
}

.two-merch-cards.mini-compare-chart,
.three-merch-cards.mini-compare-chart,
.four-merch-cards.mini-compare-chart {
  grid-template-columns: repeat(2, var(--merch-card-mini-compare-chart-width));
  gap: var(--consonant-merch-spacing-xs);
}

/* mini compare mobile */ 
@media screen and ${v} {
  :root {
    --merch-card-mini-compare-chart-width: 302px;
    --merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart,
  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: var(--merch-card-mini-compare-chart-width);
    gap: var(--consonant-merch-spacing-xs);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
}

@media screen and ${N} {
  .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
  .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
    flex: 1;
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
    font-size: var(--merch-card-body-s-font-size);
    line-height: var(--merch-card-body-s-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot='body-m'] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
  
  merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
  }
}
@media screen and ${g} {
  :root {
    --merch-card-mini-compare-chart-width: 302px;
    --merch-card-mini-compare-chart-wide-width: 302px;
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, minmax(var(--merch-card-mini-compare-chart-width), var(--merch-card-mini-compare-chart-wide-width)));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(2, minmax(var(--merch-card-mini-compare-chart-width), var(--merch-card-mini-compare-chart-wide-width)));
  }
}

/* desktop */
@media screen and ${p} {
  :root {
    --merch-card-mini-compare-chart-width: 378px;
    --merch-card-mini-compare-chart-wide-width: 484px;  
  }
  .one-merch-card.mini-compare-chart {
    grid-template-columns: var(--merch-card-mini-compare-chart-wide-width);
  }

  .two-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(2, var(--merch-card-mini-compare-chart-wide-width));
    gap: var(--consonant-merch-spacing-m);
  }

  .three-merch-cards.mini-compare-chart,
  .four-merch-cards.mini-compare-chart {
    grid-template-columns: repeat(3, var(--merch-card-mini-compare-chart-width));
    gap: var(--consonant-merch-spacing-m);
  }
}

@media screen and ${u} {
  .four-merch-cards.mini-compare-chart {
      grid-template-columns: repeat(4, var(--merch-card-mini-compare-chart-width));
  }
}

merch-card .footer-row-cell:nth-child(1) {
  min-height: var(--merch-card-footer-row-1-min-height);
}

merch-card .footer-row-cell:nth-child(2) {
  min-height: var(--merch-card-footer-row-2-min-height);
}

merch-card .footer-row-cell:nth-child(3) {
  min-height: var(--merch-card-footer-row-3-min-height);
}

merch-card .footer-row-cell:nth-child(4) {
  min-height: var(--merch-card-footer-row-4-min-height);
}

merch-card .footer-row-cell:nth-child(5) {
  min-height: var(--merch-card-footer-row-5-min-height);
}

merch-card .footer-row-cell:nth-child(6) {
  min-height: var(--merch-card-footer-row-6-min-height);
}

merch-card .footer-row-cell:nth-child(7) {
  min-height: var(--merch-card-footer-row-7-min-height);
}

merch-card .footer-row-cell:nth-child(8) {
  min-height: var(--merch-card-footer-row-8-min-height);
}
`;var Ve=32,E=class extends m{constructor(e){super(e);i(this,"getRowMinHeightPropertyName",e=>`--merch-card-footer-row-${e}-min-height`);i(this,"getMiniCompareFooter",()=>{let e=this.card.secureLabel?G`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:G`<slot name="secure-transaction-label"></slot>`;return G`<footer>${e}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return Ee}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"].forEach(o=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${o}"]`),o)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let a=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");a&&a.textContent!==""&&this.getContainer().style.setProperty("--merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"]')?.children].forEach((a,o)=>{let c=Math.max(Ve,parseFloat(window.getComputedStyle(a).height)||0),l=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(o+1)))||0;c>l&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(o+1),`${c}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(a=>{let o=a.querySelector(".footer-row-cell-description");o&&!o.textContent.trim()&&a.remove()})}renderLayout(){return G` <div class="top-section${this.badge?" badge":""}">
            <slot name="icons"></slot> ${this.badge}
        </div>
        <slot name="heading-m"></slot>
        <slot name="body-m"></slot>
        <slot name="heading-m-price"></slot>
        <slot name="body-xxs"></slot>
        <slot name="price-commitment"></slot>
        <slot name="offers"></slot>
        <slot name="promo-text"></slot>
        <slot name="callout-content"></slot>
        ${this.getMiniCompareFooter()}
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){D()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(e=>e.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};i(E,"variantStyle",Ue`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--merch-card-mini-compare-chart-top-section-height);
    }

    @media screen and ${Se(N)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${Se(p)} {
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
        min-height: var(--merch-card-mini-compare-chart-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--merch-card-mini-compare-chart-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --merch-card-mini-compare-chart-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='body-xxs'] {
        min-height: var(
            --merch-card-mini-compare-chart-body-xxs-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --merch-card-mini-compare-chart-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--merch-card-mini-compare-chart-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--merch-card-mini-compare-chart-promo-text-height);
    }
    :host([variant='mini-compare-chart']) slot[name='callout-content'] {
        min-height: var(
            --merch-card-mini-compare-chart-callout-content-height
        );
    }
  `);import{html as U,css as qe}from"../lit-all.min.js";var Ae=`
:root {
  --merch-card-plans-width: 300px;
  --merch-card-plans-icon-size: 40px;
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
    grid-template-columns: var(--merch-card-plans-width);
}

/* Tablet */
@media screen and ${g} {
  :root {
    --merch-card-plans-width: 302px;
  }
  .two-merch-cards.plans,
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(2, var(--merch-card-plans-width));
  }
}

/* desktop */
@media screen and ${p} {
  :root {
    --merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${u} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--merch-card-plans-width));
    }
}
`;var S=class extends m{constructor(t){super(t)}getGlobalCSS(){return Ae}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?U`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return U` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":U`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?U`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};i(S,"variantStyle",qe`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as J,css as je}from"../lit-all.min.js";var ke=`
:root {
  --merch-card-product-width: 300px;
}

/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--merch-card-product-width);
}

/* Tablet */
@media screen and ${g} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--merch-card-product-width));
    }
}

/* desktop */
@media screen and ${p} {
  :root {
    --merch-card-product-width: 378px;
  }
    
  .three-merch-cards.product,
  .four-merch-cards.product {
      grid-template-columns: repeat(3, var(--merch-card-product-width));
  }
}

/* Large desktop */
@media screen and ${u} {
  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--merch-card-product-width));
  }
}
`;var b=class extends m{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return ke}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(e=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${e}"]`),e))}renderLayout(){return J` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":J`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?J`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(D()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};i(b,"variantStyle",je`
    :host([variant='product']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='product']) slot[name='body-xs'] {
        min-height: var(--merch-card-product-body-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='heading-xs'] {
        min-height: var(--merch-card-product-heading-xs-height);
        display: block;
    }
    :host([variant='product']) slot[name='body-xxs'] {
        min-height: var(--merch-card-product-body-xxs-height);
        display: block;
    }
    :host([variant='product']) slot[name='promo-text'] {
        min-height: var(--merch-card-product-promo-text-height);
        display: block;
    }
    :host([variant='product']) slot[name='callout-content'] {
        min-height: var(--merch-card-product-callout-content-height);
        display: block;
    }
      
    :host([variant='product']) ::slotted([slot='heading-xs']) {
      max-width: var(--merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as X,css as Ke}from"../lit-all.min.js";var Ce=`
:root {
  --merch-card-segment-width: 378px;
}

/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
  grid-template-columns: minmax(276px, var(--merch-card-segment-width));
}

/* Mobile */
@media screen and ${v} {
  :root {
    --merch-card-segment-width: 276px;
  }
}

@media screen and ${g} {
  :root {
    --merch-card-segment-width: 276px;
  }
    
  .two-merch-cards.segment,
  .three-merch-cards.segment,
  .four-merch-cards.segment {
      grid-template-columns: repeat(2, minmax(276px, var(--merch-card-segment-width)));
  }
}

/* desktop */
@media screen and ${p} {
  :root {
    --merch-card-segment-width: 302px;
  }
    
  .three-merch-cards.segment {
      grid-template-columns: repeat(3, minmax(276px, var(--merch-card-segment-width)));
  }

  .four-merch-cards.segment {
      grid-template-columns: repeat(4, minmax(276px, var(--merch-card-segment-width)));
  }
}
`;var A=class extends m{constructor(t){super(t)}getGlobalCSS(){return Ce}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return X` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":X`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?X`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};i(A,"variantStyle",Ke`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--merch-card-heading-xs-max-width, 100%);
    }
  `);import{html as ee,css as Ye}from"../lit-all.min.js";var _e=`
:root {
  --merch-card-special-offers-width: 378px;
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
  font-size: var(--merch-card-body-xs-font-size);
}

/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
  grid-template-columns: minmax(300px, var(--merch-card-special-offers-width));
}

@media screen and ${v} {
  :root {
    --merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${g} {
  :root {
    --merch-card-special-offers-width: 302px;
  }
    
  .two-merch-cards.special-offers,
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
      grid-template-columns: repeat(2, minmax(300px, var(--merch-card-special-offers-width)));
  }
}

/* desktop */
@media screen and ${p} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--merch-card-special-offers-width)));
  }
}

@media screen and ${u} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--merch-card-special-offers-width)));
  }
}
`;var We={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},k=class extends m{constructor(t){super(t)}getGlobalCSS(){return _e}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return We}renderLayout(){return ee`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?ee`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:ee`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};i(k,"variantStyle",Ye`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `);import{html as Qe,css as Ze}from"../lit-all.min.js";var Le=`
:root {
  --merch-card-twp-width: 268px;
  --merch-card-twp-mobile-width: 300px;
  --merch-card-twp-mobile-height: 358px;
}
  
merch-card[variant="twp"] div[class$='twp-badge'] {
  padding: 4px 10px 5px 10px;
}

merch-card[variant="twp"] [slot="body-xs-top"] {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: var(--merch-card-body-xs-line-height);
  color: var(--merch-color-gray-80);
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
  font-size: var(--merch-card-body-xs-font-size);
  line-height: var(--merch-card-body-xs-line-height);
  padding: var(--consonant-merch-spacing-s);
  var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
  color: var(--merch-color-gray-80);
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
  grid-template-columns: var(--merch-card-image-width);
}

@media screen and ${v} {
  :root {
    --merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--merch-card-twp-mobile-width));
  }
}

@media screen and ${g} {
  :root {
    --merch-card-twp-width: 268px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--merch-card-twp-width));
  }
}
  
@media screen and ${p} {
  :root {
    --merch-card-twp-width: 268px;
  }
  .one-merch-card.twp
  .two-merch-cards.twp {
      grid-template-columns: repeat(2, var(--merch-card-twp-width));
  }
  .three-merch-cards.twp {
      grid-template-columns: repeat(3, var(--merch-card-twp-width));
  }
}

@media screen and ${u} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--merch-card-twp-width));
  }
}
`;var C=class extends m{constructor(t){super(t)}getGlobalCSS(){return Le}renderLayout(){return Qe`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};i(C,"variantStyle",Ze`
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
  `);import{html as Je,css as Xe}from"../lit-all.min.js";var ze=`
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  text-decoration: underline;
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-gray-60));
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  font-weight: 700;
}

merch-card [slot='detail-s'] {
  color: var(--merch-card-detail-s-color);
}
`;var et={mnemonics:{size:"l"},subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"price"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"cta",size:"m"}},_=class extends m{getGlobalCSS(){return ze}get aemFragmentMapping(){return et}renderLayout(){return Je`
          <div style="${this.stripStyle}" class="body">
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
                <slot></slot>`}};i(_,"variantStyle",Xe`
    :host([variant='ccd-suggested']) {
      width: var(--merch-card-ccd-suggested-width);
      min-width: var(--merch-card-ccd-suggested-width);
      min-height: var(--merch-card-ccd-suggested-height);
      border-radius: 4px;
      display: flex;
      flex-flow: wrap;
      overflow: hidden;
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
      gap: 2px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='icons']) {
      place-self: center;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='heading-xs']) {
      font-size: var(--merch-card-heading-xxs-font-size);
      line-height: var(--merch-card-heading-xxs-line-height);
    }
    
    :host([variant='ccd-suggested']) ::slotted([slot='detail-m']) {
      line-height: var(--merch-card-detail-m-line-height);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
      padding-top: 6px;
    }
    
    :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='body-xs']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested'].wide-strip) ::slotted([slot='price']) {
      padding-inline-start: 48px;
    }

    :host([variant='ccd-suggested']) ::slotted([slot='price']) {
      display: flex;
      align-items: center;
      font-size: var(--merch-card-body-xs-font-size);
      line-height: var(--merch-card-body-xs-line-height);
      min-width: fit-content;
    }
    
    :host([variant='ccd-suggested']) ::slotted([slot='price']) span.placeholder-resolved[data-template="priceStrikethrough"] {
      text-decoration: line-through;
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
  `);import{html as tt,css as rt}from"../lit-all.min.js";var Te=`
:root {
  --merch-card-ccd-slice-single-width: 322px;
  --merch-card-ccd-slice-icon-size: 30px;
  --merch-card-ccd-slice-wide-width: 600px;
  --merch-card-ccd-slice-single-height: 154px;
  --merch-card-ccd-slice-background-img-size: 119px;
}

merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-gray-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}
`;var at={mnemonics:{size:"m"},backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{slot:"footer",size:"s"},allowedSizes:["wide"]},L=class extends m{getGlobalCSS(){return Te}get aemFragmentMapping(){return at}renderLayout(){return tt` <div class="content">
                <div class="top-section">
                  <slot name="icons"></slot> 
                  ${this.badge}
                </div>  
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};i(L,"variantStyle",rt`
        :host([variant='ccd-slice']) {
            min-width: 290px;
            max-width: var(--merch-card-ccd-slice-single-width);
            max-height: var(--merch-card-ccd-slice-single-height);
            height: var(--merch-card-ccd-slice-single-height);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--merch-card-body-xs-font-size);
            line-height: var(--merch-card-body-xxs-line-height);
            max-width: 154px;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
          max-width: 425px;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--merch-card-ccd-slice-wide-width);
            max-width: var(--merch-card-ccd-slice-wide-width);
        }

        :host([variant='ccd-slice']) .content {
            display: flex;
            gap: var(--consonant-merch-spacing-xxs);
            padding: 15px;
            padding-inline-end: 0;
            width: 154px;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            flex: 1 0 0;
        }

        :host([variant='ccd-slice'])
            ::slotted([slot='body-s'])
            ::slotted(a:not(.con-button)) {
            font-size: var(--merch-card-body-xxs-font-size);
            font-style: normal;
            font-weight: 400;
            line-height: var(--merch-card-body-xxs-line-height);
            text-decoration-line: underline;
            color: var(--merch-color-gray-80);
        }

        :host([variant='ccd-slice']) ::slotted([slot='image']) {
            display: flex;
            justify-content: center;
            flex-shrink: 0;
            width: var(--merch-card-ccd-slice-background-img-size);
            height: var(--merch-card-ccd-slice-background-img-size);
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
            font-size: var(--merch-card-body-xxs-font-size);
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
    `);var te=(r,t=!1)=>{switch(r.variant){case"catalog":return new w(r);case"image":return new I(r);case"inline-heading":return new F(r);case"mini-compare-chart":return new E(r);case"plans":return new S(r);case"product":return new b(r);case"segment":return new A(r);case"special-offers":return new k(r);case"twp":return new C(r);case"ccd-suggested":return new _(r);case"ccd-slice":return new L(r);default:return t?void 0:new b(r)}},Re=()=>{let r=[];return r.push(w.variantStyle),r.push(E.variantStyle),r.push(b.variantStyle),r.push(S.variantStyle),r.push(A.variantStyle),r.push(k.variantStyle),r.push(C.variantStyle),r.push(_.variantStyle),r.push(L.variantStyle),r};var Me=document.createElement("style");Me.innerHTML=`
:root {
    --merch-card-detail-font-size: 12px;
    --merch-card-detail-font-weight: 500;
    --merch-card-detail-letter-spacing: 0.8px;

    --merch-card-heading-font-size: 18px;
    --merch-card-heading-line-height: 22.5px;
    --merch-card-heading-secondary-font-size: 14px;
    --merch-card-body-font-size: 14px;
    --merch-card-body-line-height: 21px;
    --merch-card-promo-text-height: var(--merch-card-body-font-size);

    /* Fonts */
    --merch-body-font-family: 'Adobe Clean', adobe-clean, 'Trebuchet MS', sans-serif;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --merch-card-cta-font-size: 15px;

    /* headings */
    --merch-card-heading-xxs-font-size: 16px;
    --merch-card-heading-xxs-line-height: 20px;
    --merch-card-heading-xs-font-size: 18px;
    --merch-card-heading-xs-line-height: 22.5px;
    --merch-card-heading-s-font-size: 20px;
    --merch-card-heading-s-line-height: 25px;
    --merch-card-heading-m-font-size: 24px;
    --merch-card-heading-m-line-height: 30px;
    --merch-card-heading-l-font-size: 20px;
    --merch-card-heading-l-line-height: 30px;
    --merch-card-heading-xl-font-size: 36px;
    --merch-card-heading-xl-line-height: 45px;

    /* detail */
    --merch-card-detail-s-font-size: 11px;
    --merch-card-detail-s-line-height: 14px;
    --merch-card-detail-m-font-size: 12px;
    --merch-card-detail-m-line-height: 15px;
    --merch-card-detail-m-font-weight: 700;
    --merch-card-detail-m-letter-spacing: 1px;

    /* body */
    --merch-card-body-xxs-font-size: 12px;
    --merch-card-body-xxs-line-height: 18px;
    --merch-card-body-xxs-letter-spacing: 1px;
    --merch-card-body-xs-font-size: 14px;
    --merch-card-body-xs-line-height: 21px;
    --merch-card-body-s-font-size: 16px;
    --merch-card-body-s-line-height: 24px;
    --merch-card-body-m-font-size: 18px;
    --merch-card-body-m-line-height: 27px;
    --merch-card-body-l-font-size: 20px;
    --merch-card-body-l-line-height: 30px;
    --merch-card-body-xl-font-size: 22px;
    --merch-card-body-xl-line-height: 33px;


    --merch-card-heading-padding: 0;

    /* colors */
    --merch-color-accent: #1473E6;
    --merch-card-border-color: #eaeaea;
    --merch-card-color: var(--color-gray-800);
    --merch-card-background-color: #fff;
    --merch-card-detail-s-color: var(--merch-color-gray-600);
    --merch-color-focus-ring: #1473E6;
    --merch-color-green-promo: #2D9D78;
    --merch-color-gray-10: #f6f6f6;
    --merch-color-gray-200: #E8E8E8;
    --merch-color-gray-60: #6D6D6D;
    --merch-color-gray-600: #686868;
    --merch-color-gray-80: #2c2c2c;

    /* ccd colors */
    
    --ccd-gray-200-light: #E6E6E6;
    --ccd-gray-800-dark: #222;
    --ccd-gray-700-dark: #464646;
    --ccd-gray-600-light: #6D6D6D;
    
    
    

    /* merch card generic */
    --merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* background image */
    --merch-card-bg-img-height: 180px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

    /* callout */
    --merch-card-callout-line-height: 21px;
    --merch-card-callout-font-size: 14px;
    --merch-card-callout-font-color: #2C2C2C;
    --merch-card-callout-icon-size: 16px;
    --merch-card-callout-icon-top: 6px;
    --merch-card-callout-icon-right: 8px;
    --merch-card-callout-letter-spacing: 0px;
    --merch-card-callout-icon-padding: 34px;
    --merch-card-callout-spacing-xxs: 8px;
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

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card.has-divider hr {
    margin-bottom: var(--consonant-merch-spacing-xs);
    height: 1px;
    border: none;
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}


merch-card span[is='inline-price']:has(+ span[is='inline-price']) {
    margin-inline-end: var(--consonant-merch-spacing-xxs);
}

merch-card sp-button a[is='checkout-link'] {
    pointer-events: auto;
}

merch-card [slot^='heading-'] {
    font-weight: 700;
}

merch-card [slot='heading-xs'] {
    font-size: var(--merch-card-heading-xs-font-size);
    line-height: var(--merch-card-heading-xs-line-height);
    margin: 0;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-gray-80);
}

merch-card div.starting-at {
  font-size: var(--merch-card-body-xs-font-size);
  line-height: var(--merch-card-body-xs-line-height);
  font-weight: 500;
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--merch-card-heading-s-font-size);
    line-height: var(--merch-card-heading-s-line-height);
    margin: 0;
}

merch-card [slot='heading-m'] {
    font-size: var(--merch-card-heading-m-font-size);
    line-height: var(--merch-card-heading-m-line-height);
    margin: 0;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--merch-card-heading-m-font-size);
    line-height: var(--merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    margin: 0;
    color: var(--spectrum-gray-800, #2c2c2c);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--merch-card-heading-l-font-size);
    line-height: var(--merch-card-heading-l-line-height);
    margin: 0;
}

merch-card [slot='heading-xl'] {
    font-size: var(--merch-card-heading-xl-font-size);
    line-height: var(--merch-card-heading-xl-line-height);
    margin: 0;
}

merch-card [slot='callout-content'] {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--merch-card-callout-spacing-xxs);
}

merch-card [slot='callout-content'] > div {
    display: flex;
    flex-direction: column;
    margin: var(--consonant-merch-spacing-xxxs) 0px;
    gap: var(--merch-card-callout-spacing-xxs);
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
    font: normal normal normal var(--merch-card-callout-font-size)/var(--merch-card-callout-line-height) var(--body-font-family, 'Adobe Clean');
    letter-spacing: var(--merch-card-callout-letter-spacing);
    color: var(--merch-card-callout-font-color);
}

merch-card [slot='callout-content'] img {
    width: var(--merch-card-callout-icon-size);
    height: var(--merch-card-callout-icon-size);
    margin-inline-end: 2.5px;
    margin-inline-start: 9px;
    margin-block-start: 2.5px;
}

merch-card [slot='detail-s'] {
    font-size: var(--merch-card-detail-s-font-size);
    line-height: var(--merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
}

merch-card [slot='detail-m'] {
    font-size: var(--merch-card-detail-m-font-size);
    letter-spacing: var(--merch-card-detail-m-letter-spacing);
    font-weight: var(--merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--merch-card-body-xxs-font-size);
    line-height: var(--merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--merch-card-body-xxs-letter-spacing);
    margin: 0;
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-xs"] {
    font-size: var(--merch-card-body-xs-font-size);
    line-height: var(--merch-card-body-xs-line-height);
    flex-grow: 1;
}

merch-card [slot="body-m"] {
    font-size: var(--merch-card-body-m-font-size);
    line-height: var(--merch-card-body-m-line-height);
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-l"] {
    font-size: var(--merch-card-body-l-font-size);
    line-height: var(--merch-card-body-l-line-height);
    color: var(--merch-color-gray-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--merch-card-body-xl-font-size);
    line-height: var(--merch-card-body-xl-line-height);
    color: var(--merch-color-gray-80);
}

merch-card a.primary-link,
merch-card a.secondary-link {
  font-size: var(--merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--merch-card-body-xxs-line-height);
  text-decoration-line: underline;
  }
 
merch-card a.primary-link {
  color: var(--merch-color-accent);
}

merch-card a.secondary-link {
  color: var(--merch-card-color);
}

merch-card [slot="cci-footer"] p,
merch-card [slot="cct-footer"] p,
merch-card [slot="cce-footer"] p {
    margin: 0;
}

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--merch-card-promo-text-height);
    margin: 0;
    min-height: var(--merch-card-promo-text-height);
    padding: 0;
}

merch-card div[slot="footer"] {
    display: contents;
}

merch-card [slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

merch-card [slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--merch-card-cta-font-size);
}

merch-card div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--merch-card-bg-img-height);
    max-height: var(--merch-card-bg-img-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

merch-card span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card sp-button a,
merch-card sp-button a:hover {
  text-decoration: none;
    color: var(
        --highcontrast-button-content-color-default,
        var(
            --mod-button-content-color-default,
            var(--spectrum-button-content-color-default)
        )
    );
}

merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--merch-card-body-xs-font-size);
  font-weight: normal;
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

.dark {
  --merch-card-border-color: #3F3F3F;
  --merch-card-background-color: #1E1E1E;
  --merch-card-detail-s-color: var(--color-gray-100);
  --merch-card-color: var(--color-gray-100);
}
`;document.head.appendChild(Me);var ot="#000000",ct="#F8D904",it=/(accent|primary|secondary)(-(outline|link))?/,nt="mas:product_code/",st="daa-ll",V="daa-lh";function dt(r,t,e){r.mnemonicIcon?.map((o,c)=>({icon:o,alt:r.mnemonicAlt[c]??"",link:r.mnemonicLink[c]??""}))?.forEach(({icon:o,alt:c,link:l})=>{if(l&&!/^https?:/.test(l))try{l=new URL(`https://${l}`).href.toString()}catch{l="#"}let x={slot:"icons",src:o,size:e?.size??"l"};c&&(x.alt=c),l&&(x.href=l);let $=f("merch-icon",x);t.append($)})}function ht(r,t){r.badge&&(t.setAttribute("badge-text",r.badge),t.setAttribute("badge-color",r.badgeColor||ot),t.setAttribute("badge-background-color",r.badgeBackgroundColor||ct))}function lt(r,t,e){e?.includes(r.size)&&t.setAttribute("size",r.size)}function mt(r,t,e){r.cardTitle&&e&&t.append(f(e.tag,{slot:e.slot},r.cardTitle))}function pt(r,t,e){r.subtitle&&e&&t.append(f(e.tag,{slot:e.slot},r.subtitle))}function gt(r,t,e,a){if(r.backgroundImage)switch(a){case"ccd-slice":e&&t.append(f(e.tag,{slot:e.slot},`<img loading="lazy" src="${r.backgroundImage}" />`));break;case"ccd-suggested":t.setAttribute("background-image",r.backgroundImage);break}}function ut(r,t,e){if(r.prices&&e){let a=f(e.tag,{slot:e.slot},r.prices);t.append(a)}}function xt(r,t,e){if(r.description&&e){let a=f(e.tag,{slot:e.slot},r.description);t.append(a)}}function ft(r,t,e,a){r.tabIndex=-1;let o=f("sp-button",{treatment:e,variant:t,tabIndex:0,size:a.ctas.size??"m"},r);return o.addEventListener("click",c=>{c.target!==r&&(c.stopPropagation(),r.click())}),o}function vt(r,t,e,a){return r.classList.add("con-button"),e==="outline"&&r.classList.add("outline"),t==="accent"?r.classList.add("blue"):t==="black"&&r.classList.add("fill"),(a.ctas.size??"m")==="s"&&r.classList.add("button-s"),r}function bt(r,t,e){if(r.ctas){let{slot:a}=e.ctas,o=f("div",{slot:a},r.ctas),c=[...o.querySelectorAll("a")].map(l=>{let x=it.exec(l.className)?.[0]??"accent";if(x.includes("-link"))return l;let oe=x.includes("accent"),$e=x.includes("primary"),Ne=x.includes("secondary"),Pe=x.includes("-outline"),q="fill",z;return oe?z="accent":$e?z="primary":Ne&&(z="secondary"),Pe&&(q="outline"),t.consonant?vt(l,z,q,e):ft(l,z,q,e)});o.innerHTML="",o.append(...c),t.append(o)}}function yt(r,t){let{tags:e}=r,a=e?.find(o=>o.startsWith(nt))?.split("/").pop();a&&(t.setAttribute(V,a),t.querySelectorAll("a[data-analytics-id]").forEach((o,c)=>{o.setAttribute(st,`${o.dataset.analyticsId}-${c+1}`)}))}async function Oe(r,t){let{fields:e}=r,{variant:a}=e;if(!a)return;t.querySelectorAll("[slot]").forEach(c=>{c.remove()}),t.removeAttribute("background-image"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.removeAttribute(V),t.variant=a,await t.updateComplete;let{aemFragmentMapping:o}=t.variantLayout;o&&(gt(e,t,o.backgroundImage,a),ht(e,t),bt(e,t,o,a),xt(e,t,o.description),dt(e,t,o.mnemonics),ut(e,t,o.prices),lt(e,t,o.allowedSizes),pt(e,t,o.subtitle),mt(e,t,o.title),yt(e,t))}var d="merch-card",Et=1e4,ae,O,re,s=class extends wt{constructor(){super();T(this,O);i(this,"customerSegment");i(this,"marketSegment");i(this,"variantLayout");T(this,ae,!1);this.filters={},this.types="",this.selected=!1,this.consonant=!0,this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=te(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(e){(e.has("variant")||!this.variantLayout)&&(this.variantLayout=te(this),this.variantLayout.connectedCallbackHook())}updated(e){(e.has("badgeBackgroundColor")||e.has("borderColor"))&&this.style.setProperty("--merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(this)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let a=this.checkoutLinks;if(a.length!==0)for(let o of a){await o.onceSettled();let c=o.value?.[0]?.planType;if(!c)return;let l=this.stockOfferOsis[c];if(!l)return;let x=o.dataset.wcsOsi.split(",").filter($=>$!==l);e.checked&&x.push(l),o.dataset.wcsOsi=x.join(",")}}handleQuantitySelection(e){let a=this.checkoutLinks;for(let o of a)o.dataset.quantity=e.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let a={...this.filters};Object.keys(a).forEach(o=>{if(e){a[o].order=Math.min(a[o].order||2,2);return}let c=a[o].order;c===1||isNaN(c)||(a[o].order=Number(c)+1)}),this.filters=a}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}connectedCallback(){super.connectedCallback(),this.addEventListener(Q,this.handleQuantitySelection),this.addEventListener(pe,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(B,this.handleAemFragmentEvents),this.addEventListener(H,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout.disconnectedCallbackHook(),this.removeEventListener(Q,this.handleQuantitySelection),this.storageOptions?.removeEventListener(W,this.handleStorageChange),this.removeEventListener(B,this.handleAemFragmentEvents),this.removeEventListener(H,this.handleAemFragmentEvents)}async handleAemFragmentEvents(e){if(e.type===B&&Y(this,O,re).call(this,"AEM fragment cannot be loaded"),e.type===H&&e.target.nodeName==="AEM-FRAGMENT"){let a=e.detail;await Oe(a,this),this.checkReady()}}async checkReady(){let e=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(c=>c.onceSettled().catch(()=>c))).then(c=>c.every(l=>l.classList.contains("placeholder-resolved"))),a=new Promise(c=>setTimeout(()=>c(!1),Et));if(await Promise.race([e,a])===!0){this.dispatchEvent(new CustomEvent(xe,{bubbles:!0,composed:!0}));return}Y(this,O,re).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let e=this.storageOptions?.selected;if(e){let a=this.querySelector(`merch-offer-select[storage="${e}"]`);if(a)return a}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(ge,{bubbles:!0}))}handleStorageChange(){let e=this.closest("merch-card")?.offerSelect.cloneNode(!0);e&&this.dispatchEvent(new CustomEvent(W,{detail:{offerSelect:e},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(e){if(e===this.merchOffer)return;this.merchOffer=e;let a=this.dynamicPrice;if(e.price&&a){let o=e.price.cloneNode(!0);a.onceSettled?a.onceSettled().then(()=>{a.replaceWith(o)}):a.replaceWith(o)}}};ae=new WeakMap,O=new WeakSet,re=function(e){this.dispatchEvent(new CustomEvent(fe,{detail:e,bubbles:!0,composed:!0}))},i(s,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{let[a,o,c]=e.split(",");return{PUF:a,ABM:o,M2M:c}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(a=>{let[o,c,l]=a.split(":"),x=Number(c);return[o,{order:isNaN(x)?void 0:x,size:l}]})),toAttribute:e=>Object.entries(e).map(([a,{order:o,size:c}])=>[a,o,c].filter(l=>l!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:V,reflect:!0}}),i(s,"styles",[he,Re(),...le()]);customElements.define(d,s);

var Ax=Object.create;var Ai=Object.defineProperty;var Mx=Object.getOwnPropertyDescriptor;var Ix=Object.getOwnPropertyNames;var Nx=Object.getPrototypeOf,Dx=Object.prototype.hasOwnProperty;var Up=e=>{throw TypeError(e)};var Ox=(e,t,r)=>t in e?Ai(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r;var v=(e,t)=>()=>(e&&(t=e(e=0)),t);var Ar=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var qx=(e,t,r,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of Ix(t))!Dx.call(e,a)&&a!==r&&Ai(e,a,{get:()=>t[a],enumerable:!(o=Mx(t,a))||o.enumerable});return e};var q=(e,t,r)=>(r=e!=null?Ax(Nx(e)):{},qx(t||!e||!e.__esModule?Ai(r,"default",{value:e,enumerable:!0}):r,e));var D=(e,t,r)=>Ox(e,typeof t!="symbol"?t+"":t,r),Mi=(e,t,r)=>t.has(e)||Up("Cannot "+r);var Ii=(e,t,r)=>(Mi(e,t,"read from private field"),r?r.call(e):t.get(e)),ca=(e,t,r)=>t.has(e)?Up("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,r),Wp=(e,t,r,o)=>(Mi(e,t,"write to private field"),o?o.call(e,r):t.set(e,r),r),Ni=(e,t,r)=>(Mi(e,t,"access private method"),r);import{LitElement as Hx,html as Kp,css as jx}from"../lit-all.min.js";var h,c=v(()=>{h=class extends Hx{constructor(){super(),this.size="m",this.alt=""}render(){let{href:t}=this;return t?Kp`<a href="${t}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:Kp` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}};D(h,"properties",{size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}}),D(h,"styles",jx`
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
    `);customElements.define("merch-icon",h)});var er,wn,ue,ie,Ee,Ye=v(()=>{l();c();er="(max-width: 767px)",wn="(max-width: 1199px)",ue="(min-width: 768px)",ie="(min-width: 1200px)",Ee="(min-width: 1600px)"});import{css as Zp,unsafeCSS as Xp}from"../lit-all.min.js";var Qp,Yp,Jp=v(()=>{l();c();Ye();Qp=Zp`
    :host {
        --merch-card-border: 1px solid var(--spectrum-gray-200, var(--consonant-merch-card-border-color));
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: start;
        background-color: var(--merch-card-background-color);
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--merch-card-background-color);
        font-family: var(--merch-body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: var(--merch-card-border);
        box-sizing: border-box;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([aria-selected]) {
        outline: none;
        box-sizing: border-box;
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
`,Yp=()=>[Zp`
        /* Tablet */
        @media screen and ${Xp(ue)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                width: 100%;
                grid-column: 1 / -1;
            }
        }

        /* Laptop */
        @media screen and ${Xp(ie)} {
            :host([size='wide']) {
                grid-column: span 2;
            }
        `]});import{html as _n}from"../lit-all.min.js";var so,la,te,He=v(()=>{l();c();la=class la{constructor(t){D(this,"card");ca(this,so);this.card=t,this.insertVariantStyle()}getContainer(){return Wp(this,so,Ii(this,so)??this.card.closest('[class*="-merch-cards"]')??this.card.parentElement),Ii(this,so)}insertVariantStyle(){if(!la.styleMap[this.card.variant]){la.styleMap[this.card.variant]=!0;let t=document.createElement("style");t.innerHTML=this.getGlobalCSS(),document.head.appendChild(t)}}updateCardElementMinHeight(t,r){if(!t)return;let o=`--consonant-merch-card-${this.card.variant}-${r}-height`,a=Math.max(0,parseInt(window.getComputedStyle(t).height)||0),n=parseInt(this.getContainer().style.getPropertyValue(o))||0;a>n&&this.getContainer().style.setProperty(o,`${a}px`)}get badge(){let t;if(!(!this.card.badgeBackgroundColor||!this.card.badgeColor||!this.card.badgeText))return this.evergreen&&(t=`border: 1px solid ${this.card.badgeBackgroundColor}; border-right: none;`),_n`
            <div
                id="badge"
                class="${this.card.variant}-badge"
                style="background-color: ${this.card.badgeBackgroundColor};
                color: ${this.card.badgeColor};
                ${t}"
            >
                ${this.card.badgeText}
            </div>
        `}get cardImage(){return _n` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}getGlobalCSS(){return""}get theme(){return document.querySelector("sp-theme")}get evergreen(){return this.card.classList.contains("intro-pricing")}get promoBottom(){return this.card.classList.contains("promo-bottom")}get headingSelector(){return'[slot="heading-xs"]'}get stripStyle(){if(this.card.backgroundImage){let t=new Image;return t.src=this.card.backgroundImage,t.onload=()=>{t.width>8?this.card.classList.add("wide-strip"):t.width===8&&this.card.classList.add("thin-strip")},`
          background: url("${this.card.backgroundImage}");
          background-size: auto 100%;
          background-repeat: no-repeat;
          background-position: ${this.card.dir==="ltr"?"left":"right"};
        `}return""}get secureLabelFooter(){let t=this.card.secureLabel?_n`<span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              >`:"";return _n`<footer>${t}<slot name="footer"></slot></footer>`}async adjustTitleWidth(){let t=this.card.getBoundingClientRect().width,r=this.card.badgeElement?.getBoundingClientRect().width||0;t===0||r===0||this.card.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(t-r-16)}px`)}postCardUpdateHook(){}connectedCallbackHook(){}disconnectedCallbackHook(){}renderLayout(){}get aemFragmentMapping(){}};so=new WeakMap,D(la,"styleMap",{});te=la});function yt(e,t={},r=""){let o=document.createElement(e);r instanceof HTMLElement?o.appendChild(r):o.innerHTML=r;for(let[a,n]of Object.entries(t))o.setAttribute(a,n);return o}function Sn(){return window.matchMedia("(max-width: 767px)").matches}function ef(){return window.matchMedia("(max-width: 1024px)").matches}var ua=v(()=>{l();c()});var tf,rf,of,Di,Oi,En,Cn,af,nf,qi=v(()=>{l();c();tf="merch-offer-select:ready",rf="merch-card:ready",of="merch-card:action-menu-toggle",Di="merch-storage:change",Oi="merch-quantity-selector:change",En="aem:load",Cn="aem:error",af="mas:ready",nf="mas:error"});var sf,cf=v(()=>{l();c();Ye();sf=`
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

@media screen and ${ue} {
    :root {
      --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${ie} {
    :root {
      --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

@media screen and ${Ee} {
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
  color: var(--merch-card-background-color);
  text-decoration: underline;
}

merch-card[variant="catalog"] .payment-details {
  font-size: var(--consonant-merch-card-body-font-size);
  font-style: italic;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-line-height);
}`});import{html as Hi,css as Ux}from"../lit-all.min.js";var Wx,io,lf=v(()=>{l();c();He();ua();qi();cf();Wx={title:{tag:"h3",slot:"heading-xs"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"m"},allowedSizes:["wide","super-wide"]},io=class extends te{constructor(r){super(r);D(this,"dispatchActionMenuToggle",()=>{this.card.dispatchEvent(new CustomEvent(of,{bubbles:!0,composed:!0,detail:{card:this.card.name,type:"action-menu"}}))});D(this,"toggleActionMenu",r=>{let o=this.card.shadowRoot.querySelector('slot[name="action-menu-content"]');!o||!r||r.type!=="click"&&r.code!=="Space"&&r.code!=="Enter"||(r.preventDefault(),o.classList.toggle("hidden"),o.classList.contains("hidden")||this.dispatchActionMenuToggle())});D(this,"toggleActionMenuFromCard",r=>{let o=r?.type==="mouseleave"?!0:void 0,a=this.card.shadowRoot,n=a.querySelector(".action-menu");this.card.blur(),n?.classList.remove("always-visible");let s=a.querySelector('slot[name="action-menu-content"]');s&&(o||this.dispatchActionMenuToggle(),s.classList.toggle("hidden",o))});D(this,"hideActionMenu",r=>{this.card.shadowRoot.querySelector('slot[name="action-menu-content"]')?.classList.add("hidden")});D(this,"focusEventHandler",r=>{let o=this.card.shadowRoot.querySelector(".action-menu");o&&(o.classList.add("always-visible"),(r.relatedTarget?.nodeName==="MERCH-CARD-COLLECTION"||r.relatedTarget?.nodeName==="MERCH-CARD"&&r.target.nodeName!=="MERCH-ICON")&&o.classList.remove("always-visible"))})}get aemFragmentMapping(){return Wx}renderLayout(){return Hi` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                ${ef()&&this.card.actionMenu?"always-visible":""}
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
                ${this.promoBottom?"":Hi`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?Hi`<slot name="promo-text"></slot
                          ><slot name="callout-content"></slot>`:""}
            </div>
            ${this.secureLabelFooter}
            <slot></slot>`}getGlobalCSS(){return sf}connectedCallbackHook(){this.card.addEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.addEventListener("focusout",this.focusEventHandler)}disconnectedCallbackHook(){this.card.removeEventListener("mouseleave",this.toggleActionMenuFromCard),this.card.removeEventListener("focusout",this.focusEventHandler)}};D(io,"variantStyle",Ux`
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
    `)});var uf,df=v(()=>{l();c();Ye();uf=`
:root {
  --consonant-merch-card-image-width: 300px;
}

.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
  grid-template-columns: var(--consonant-merch-card-image-width);
}

@media screen and ${ue} {
  .two-merch-cards.image,
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${ie} {
  :root {
    --consonant-merch-card-image-width: 378px;
  }
    
  .three-merch-cards.image,
  .four-merch-cards.image {
      grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
  }
}

@media screen and ${Ee} {
  .four-merch-cards.image {
      grid-template-columns: repeat(4, var(--consonant-merch-card-image-width));
  }
}
`});import{html as da}from"../lit-all.min.js";var Vn,mf=v(()=>{l();c();He();df();Vn=class extends te{constructor(t){super(t)}getGlobalCSS(){return uf}renderLayout(){return da`${this.cardImage}
    <div class="body">
        <slot name="icons"></slot>
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?da`<slot name="body-xs"></slot><slot name="promo-text"></slot>`:da`<slot name="promo-text"></slot><slot name="body-xs"></slot>`}
    </div>
    ${this.evergreen?da`
              <div
                  class="detail-bg-container"
                  style="background: ${this.card.detailBg}"
              >
                  <slot name="detail-bg"></slot>
              </div>
          `:da`
              <hr />
              ${this.secureLabelFooter}
          `}`}}});var pf,ff=v(()=>{l();c();Ye();pf=`
:root {
  --consonant-merch-card-inline-heading-width: 300px;
}

.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

@media screen and ${ue} {
  .two-merch-cards.inline-heading,
  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${ie} {
  :root {
    --consonant-merch-card-inline-heading-width: 378px;
  }

  .three-merch-cards.inline-heading,
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
  }
}

@media screen and ${Ee} {
  .four-merch-cards.inline-heading {
      grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
  }
}
`});import{html as gf}from"../lit-all.min.js";var Pn,hf=v(()=>{l();c();He();ff();Pn=class extends te{constructor(t){super(t)}getGlobalCSS(){return pf}renderLayout(){return gf` ${this.badge}
    <div class="body">
        <div class="top-section">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
        </div>
        <slot name="body-xs"></slot>
    </div>
    ${this.card.customHr?"":gf`<hr />`} ${this.secureLabelFooter}`}}});var bf,vf=v(()=>{l();c();Ye();bf=`
  :root {
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;
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

  merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
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
    width: var(--consonant-merch-card-mini-compare-chart-icon-size);
    height: var(--consonant-merch-card-mini-compare-chart-icon-size);
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
    text-decoration: solid;
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
@media screen and ${er} {
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

@media screen and ${wn} {
  .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
  .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
    flex: 1;
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
@media screen and ${ue} {
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
@media screen and ${ie} {
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

@media screen and ${Ee} {
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
`});import{html as Gn,css as Kx,unsafeCSS as xf}from"../lit-all.min.js";var Xx,co,yf=v(()=>{l();c();ua();He();vf();Ye();Xx=32,co=class extends te{constructor(r){super(r);D(this,"getRowMinHeightPropertyName",r=>`--consonant-merch-card-footer-row-${r}-min-height`);D(this,"getMiniCompareFooter",()=>{let r=this.card.secureLabel?Gn`<slot name="secure-transaction-label">
              <span class="secure-transaction-label"
                  >${this.card.secureLabel}</span
              ></slot
          >`:Gn`<slot name="secure-transaction-label"></slot>`;return Gn`<footer>${r}<slot name="footer"></slot></footer>`})}getGlobalCSS(){return bf}adjustMiniCompareBodySlots(){if(this.card.getBoundingClientRect().width<=2)return;this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","body-xxs","price-commitment","offers","promo-text","callout-content"].forEach(a=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${a}"]`),a)),this.updateCardElementMinHeight(this.card.shadowRoot.querySelector("footer"),"footer");let o=this.card.shadowRoot.querySelector(".mini-compare-chart-badge");o&&o.textContent!==""&&this.getContainer().style.setProperty("--consonant-merch-card-mini-compare-chart-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.card.getBoundingClientRect().width===0)return;[...this.card.querySelector('[slot="footer-rows"]')?.children].forEach((o,a)=>{let n=Math.max(Xx,parseFloat(window.getComputedStyle(o).height)||0),s=parseFloat(this.getContainer().style.getPropertyValue(this.getRowMinHeightPropertyName(a+1)))||0;n>s&&this.getContainer().style.setProperty(this.getRowMinHeightPropertyName(a+1),`${n}px`)})}removeEmptyRows(){this.card.querySelectorAll(".footer-row-cell").forEach(o=>{let a=o.querySelector(".footer-row-cell-description");a&&!a.textContent.trim()&&o.remove()})}renderLayout(){return Gn` <div class="top-section${this.badge?" badge":""}">
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
        <slot name="footer-rows"><slot name="body-s"></slot></slot>`}async postCardUpdateHook(){Sn()?this.removeEmptyRows():(await Promise.all(this.card.prices.map(r=>r.onceSettled())),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows())}};D(co,"variantStyle",Kx`
    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
    }
    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-chart-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-chart-top-section-height);
    }

    @media screen and ${xf(wn)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${xf(ie)} {
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
  `)});var $f,zf=v(()=>{l();c();Ye();$f=`
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
@media screen and ${ue} {
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
@media screen and ${ie} {
  :root {
    --consonant-merch-card-plans-width: 276px;
  }
  .three-merch-cards.plans,
  .four-merch-cards.plans {
      grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
  }
}

/* Large desktop */
    @media screen and ${Ee} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}
`});import{html as Ln,css as Zx}from"../lit-all.min.js";var lo,kf=v(()=>{l();c();He();zf();lo=class extends te{constructor(t){super(t)}getGlobalCSS(){return $f}postCardUpdateHook(){this.adjustTitleWidth()}get stockCheckbox(){return this.card.checkboxLabel?Ln`<label id="stock-checkbox">
                <input type="checkbox" @change=${this.card.toggleStockOffer}></input>
                <span></span>
                ${this.card.checkboxLabel}
            </label>`:""}renderLayout(){return Ln` ${this.badge}
        <div class="body">
            <slot name="icons"></slot>
            <slot name="heading-xs"></slot>
            <slot name="heading-m"></slot>
            <slot name="body-xxs"></slot>
            ${this.promoBottom?"":Ln`<slot name="promo-text"></slot><slot name="callout-content"></slot> `}
            <slot name="body-xs"></slot>
            ${this.promoBottom?Ln`<slot name="promo-text"></slot><slot name="callout-content"></slot> `:""}  
            ${this.stockCheckbox}
        </div>
        <slot name="quantity-select"></slot>
        ${this.secureLabelFooter}`}};D(lo,"variantStyle",Zx`
    :host([variant='plans']) {
      min-height: 348px;
    }
      
    :host([variant='plans']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `)});var wf,_f=v(()=>{l();c();Ye();wf=`
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
@media screen and ${ue} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${ie} {
  :root {
    --consonant-merch-card-product-width: 378px;
  }
    
  .three-merch-cards.product,
  .four-merch-cards.product {
      grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
  }
}

/* Large desktop */
@media screen and ${Ee} {
  .four-merch-cards.product {
      grid-template-columns: repeat(4, var(--consonant-merch-card-product-width));
  }
}
`});import{html as ji,css as Qx}from"../lit-all.min.js";var Mr,Sf=v(()=>{l();c();He();ua();_f();Mr=class extends te{constructor(t){super(t),this.postCardUpdateHook=this.postCardUpdateHook.bind(this)}getGlobalCSS(){return wf}adjustProductBodySlots(){if(this.card.getBoundingClientRect().width===0)return;["heading-xs","body-xxs","body-xs","promo-text","callout-content","body-lower"].forEach(r=>this.updateCardElementMinHeight(this.card.shadowRoot.querySelector(`slot[name="${r}"]`),r))}renderLayout(){return ji` ${this.badge}
      <div class="body">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xxs"></slot>
          ${this.promoBottom?"":ji`<slot name="promo-text"></slot>`}
          <slot name="body-xs"></slot>
          ${this.promoBottom?ji`<slot name="promo-text"></slot>`:""}
          <slot name="callout-content"></slot>
          <slot name="body-lower"></slot>
      </div>
      ${this.secureLabelFooter}`}connectedCallbackHook(){window.addEventListener("resize",this.postCardUpdateHook)}disconnectedCallbackHook(){window.removeEventListener("resize",this.postCardUpdateHook)}postCardUpdateHook(){this.card.isConnected&&(Sn()||this.adjustProductBodySlots(),this.adjustTitleWidth())}};D(Mr,"variantStyle",Qx`
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
  `)});var Ef,Cf=v(()=>{l();c();Ye();Ef=`
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
@media screen and ${er} {
  :root {
    --consonant-merch-card-segment-width: 276px;
  }
}

@media screen and ${ue} {
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
@media screen and ${ie} {
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
`});import{html as Ui,css as Yx}from"../lit-all.min.js";var uo,Vf=v(()=>{l();c();He();Cf();uo=class extends te{constructor(t){super(t)}getGlobalCSS(){return Ef}postCardUpdateHook(){this.adjustTitleWidth()}renderLayout(){return Ui` ${this.badge}
    <div class="body">
        <slot name="heading-xs"></slot>
        <slot name="body-xxs"></slot>
        ${this.promoBottom?"":Ui`<slot name="promo-text"></slot><slot name="callout-content"></slot>`}
        <slot name="body-xs"></slot>
        ${this.promoBottom?Ui`<slot name="promo-text"></slot><slot name="callout-content"></slot>`:""}
    </div>
    <hr />
    ${this.secureLabelFooter}`}};D(uo,"variantStyle",Yx`
    :host([variant='segment']) {
      min-height: 214px;
    }
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
      max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
  `)});var Pf,Gf=v(()=>{l();c();Ye();Pf=`
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

@media screen and ${er} {
  :root {
    --consonant-merch-card-special-offers-width: 302px;
  }
} 
  
@media screen and ${ue} {
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
@media screen and ${ie} {
  .three-merch-cards.special-offers,
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}

@media screen and ${Ee} {
  .four-merch-cards.special-offers {
    grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
  }
}
`});import{html as Wi,css as Jx}from"../lit-all.min.js";var ey,mo,Lf=v(()=>{l();c();He();Gf();ey={name:{tag:"h4",slot:"detail-m"},title:{tag:"h4",slot:"detail-m"},backgroundImage:{tag:"div",slot:"bg-image"},prices:{tag:"h3",slot:"heading-xs"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"footer",size:"l"}},mo=class extends te{constructor(t){super(t)}getGlobalCSS(){return Pf}get headingSelector(){return'[slot="detail-m"]'}get aemFragmentMapping(){return ey}renderLayout(){return Wi`${this.cardImage}
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?Wi`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.card.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:Wi`
                      <hr />
                      ${this.secureLabelFooter}
                  `}
            <slot></slot>`}};D(mo,"variantStyle",Jx`
        :host([variant='special-offers']) {
            min-height: 439px;
        }

        :host([variant='special-offers']) {
            width: var(--consonant-merch-card-special-offers-width);
        }

        :host([variant='special-offers'].center) {
            text-align: center;
        }
    `)});var Tf,Bf=v(()=>{l();c();Ye();Tf=`
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

@media screen and ${er} {
  :root {
    --consonant-merch-card-twp-width: 300px;
  }
  .one-merch-card.twp,
  .two-merch-cards.twp,
  .three-merch-cards.twp {
      grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
  }
}

@media screen and ${ue} {
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
  
@media screen and ${ie} {
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

@media screen and ${Ee} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
  }
}
`});import{html as ty,css as ry}from"../lit-all.min.js";var po,Ff=v(()=>{l();c();He();Bf();po=class extends te{constructor(t){super(t)}getGlobalCSS(){return Tf}renderLayout(){return ty`${this.badge}
      <div class="top-section">
          <slot name="icons"></slot>
          <slot name="heading-xs"></slot>
          <slot name="body-xs-top"></slot>
      </div>
      <div class="body">
          <slot name="body-xs"></slot>
      </div>
      <footer><slot name="footer"></slot></footer>`}};D(po,"variantStyle",ry`
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
  `)});var Rf,Af=v(()=>{l();c();Rf=`
:root {
  --merch-card-ccd-suggested-width: 305px;
  --merch-card-ccd-suggested-height: 205px;
  --merch-card-ccd-suggested-background-img-size: 119px;
}

.spectrum--light merch-card[variant="ccd-suggested"] {
  background-color: var(--ccd-gray-100-light);
  color: var(--ccd-gray-700-dark);
  border: 1px solid var(--ccd-gray-200-light);
}

.spectrum--light merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--ccd-gray-700-dark);
}

.spectrum--dark merch-card[variant="ccd-suggested"] [slot="body-xs"] {
  color: var(--ccd-gray-100-light);
}

.spectrum--dark merch-card[variant="ccd-suggested"] {
  background-color: var(--ccd-gray-800-dark);
  color: var(--ccd-gray-100-light);
  border: 1px solid var(--ccd-gray-700-dark);
}

merch-card[variant="ccd-suggested"] [slot="detail-s"] {
  color: var(--merch-color-grey-60);
}

merch-card[variant="ccd-suggested"] [slot="heading-xs"] {
  color: var(--spectrum-gray-800, #F8F8F8);
  font-size: var(--merch-card-heading-xxs-font-size);
  line-height: var(--merch-card-heading-xxs-line-height);
}

merch-card[variant="ccd-suggested"] [slot="body-xs"] a {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration: underline;
}

merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-suggested"] [slot="price"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-suggested"] [slot="cta"] a {
  font-size: var(--consonant-merch-card-body-xs-font-size);
  line-height: normal;
  text-decoration: none;
  font-weight: 700;
}
`});import{html as oy,css as ay}from"../lit-all.min.js";var ny,fo,Mf=v(()=>{l();c();He();Af();ny={mnemonics:{size:"l"},subtitle:{tag:"h4",slot:"detail-s"},title:{tag:"h3",slot:"heading-xs"},prices:{tag:"p",slot:"price"},description:{tag:"div",slot:"body-xs"},ctas:{slot:"cta",size:"M"}},fo=class extends te{getGlobalCSS(){return Rf}get aemFragmentMapping(){return ny}renderLayout(){return oy`
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
                <slot></slot>`}};D(fo,"variantStyle",ay`
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
      line-height: var(--consonant-merch-card-detail-m-line-height);
    }

    :host([variant='ccd-suggested']) ::slotted([slot='body-xs']) {
      color: var(--ccd-gray-700-dark);
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
      color: var(--spectrum-gray-800, #F8F8F8);
      font-size: var(--consonant-merch-card-body-xs-font-size);
      line-height: var(--consonant-merch-card-body-xs-line-height);
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
      margin-top: auto;
      align-items: center;
    }

    :host([variant='ccd-suggested']) div[class$='-badge'] {
      position: static;
      border-radius: 4px;
    }

    :host([variant='ccd-suggested']) .top-section {
      align-items: center;
    }
  `)});var If,Nf=v(()=>{l();c();If=`
:root {
  --consonant-merch-card-ccd-slice-single-width: 322px;
  --consonant-merch-card-ccd-slice-icon-size: 30px;
  --consonant-merch-card-ccd-slice-wide-width: 600px;
  --consonant-merch-card-ccd-slice-single-height: 154px;
  --consonant-merch-card-ccd-slice-background-img-size: 119px;
}
.spectrum--light merch-card[variant="ccd-slice"] {
  background-color: var(--ccd-gray-100-light);
  color: var(--ccd-gray-800-dark);
  border: 1px solid var(--ccd-gray-200-light)
}
  
.spectrum--dark merch-card[variant="ccd-slice"] {
  background-color: var(--ccd-gray-800-dark);
  color: var(--ccd-gray-100-light);
  border: 1px solid var(--ccd-gray-700-dark);
}

merch-card[variant="ccd-slice"] [slot='body-s'] a:not(.con-button) {
  font-size: var(--consonant-merch-card-body-xxs-font-size);
  font-style: normal;
  font-weight: 400;
  line-height: var(--consonant-merch-card-body-xxs-line-height);
  text-decoration-line: underline;
}

merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="priceStrikethrough"],
merch-card[variant="ccd-slice"] [slot="body-s"] span.placeholder-resolved[data-template="strikethrough"] {
  text-decoration: line-through;
  color: var(--ccd-gray-600-light, var(--merch-color-grey-60));
}

merch-card[variant="ccd-slice"] [slot='image'] img {
  overflow: hidden;
  border-radius: 50%;
}
`});import{html as sy,css as iy}from"../lit-all.min.js";var cy,go,Df=v(()=>{l();c();He();Nf();cy={mnemonics:{size:"m"},backgroundImage:{tag:"div",slot:"image"},description:{tag:"div",slot:"body-s"},ctas:{slot:"footer",size:"S"},allowedSizes:["wide"]},go=class extends te{getGlobalCSS(){return If}get aemFragmentMapping(){return cy}renderLayout(){return sy` <div class="content">
                <div class="top-section">
                  <slot name="icons"></slot> 
                  ${this.badge}
                </div>  
                <slot name="body-s"></slot>
                <slot name="footer"></slot>
            </div>
            <slot name="image"></slot>
            <slot></slot>`}};D(go,"variantStyle",iy`
        :host([variant='ccd-slice']) {
            background-color: var(----spectrum-global-color-gray-100);
            min-width: 290px;
            max-width: var(--consonant-merch-card-ccd-slice-single-width);
            max-height: var(--consonant-merch-card-ccd-slice-single-height);
            height: var(--consonant-merch-card-ccd-slice-single-height);
            border: 1px solid var(--spectrum-gray-700);
            border-radius: 4px;
            display: flex;
            flex-flow: wrap;
        }

        :host([variant='ccd-slice']) ::slotted([slot='body-s']) {
            font-size: var(--consonant-merch-card-body-xs-font-size);
            line-height: var(--consonant-merch-card-body-xxs-line-height);
            max-width: 154px;
        }

        :host([variant='ccd-slice'][size='wide']) ::slotted([slot='body-s']) {
          max-width: 425px;
        }

        :host([variant='ccd-slice'][size='wide']) {
            width: var(--consonant-merch-card-ccd-slice-wide-width);
            max-width: var(--consonant-merch-card-ccd-slice-wide-width);
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
            width: var(--consonant-merch-card-ccd-slice-background-img-size);
            height: var(--consonant-merch-card-ccd-slice-background-img-size);
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
    `)});var Ki,Of,qf=v(()=>{l();c();lf();mf();hf();yf();kf();Sf();Vf();Lf();Ff();Mf();Df();Ki=(e,t=!1)=>{switch(e.variant){case"catalog":return new io(e);case"image":return new Vn(e);case"inline-heading":return new Pn(e);case"mini-compare-chart":return new co(e);case"plans":return new lo(e);case"product":return new Mr(e);case"segment":return new uo(e);case"special-offers":return new mo(e);case"twp":return new po(e);case"ccd-suggested":return new fo(e);case"ccd-slice":return new go(e);default:return t?void 0:new Mr(e)}},Of=()=>{let e=[];return e.push(io.variantStyle),e.push(co.variantStyle),e.push(Mr.variantStyle),e.push(lo.variantStyle),e.push(uo.variantStyle),e.push(mo.variantStyle),e.push(po.variantStyle),e.push(fo.variantStyle),e.push(go.variantStyle),e}});var Hf,jf=v(()=>{l();c();Hf=document.createElement("style");Hf.innerHTML=`
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
    --merch-card-heading-xxs-font-size: 16px;
    --merch-card-heading-xxs-line-height: 20px;
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
    --merch-card-detail-s-font-size: 11px;
    --merch-card-detail-s-line-height: 14px;
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
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;

    /* colors */
    --merch-card-background-color: #fff;
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: #1473E6;
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-10: #f6f6f6;
    --merch-color-grey-60: var(--specturm-gray-600);
    --merch-color-grey-80: #2c2c2c;
    --merch-color-grey-200: #E8E8E8;
    --merch-color-grey-600: #686868;
    --merch-color-green-promo: #2D9D78;

    /* ccd colors */
    --ccd-gray-100-light: #F8F8F8;
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

merch-card span[is='inline-price'] {
    display: inline-block;
}

merch-card button a[is='checkout-link'] {
    pointer-events: auto;
}

merch-card [slot^='heading-'] {
    color: var(--spectrum-gray-800, var(--merch-color-grey-80));
    font-weight: 700;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
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
    font-size: var(--merch-card-detail-s-font-size);
    line-height: var(--merch-card-detail-s-line-height);
    letter-spacing: 0.66px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--spectrum-gray-600, var(--merch-color-grey-600));
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

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--merch-color-grey-80);
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

merch-card a.primary-link {
    color: #147AF3;
}

merch-card a.secondary-link {
    color: #222222;
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

merch-card div[slot="footer"] {
    display: contents;
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

merch-card span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
}

.price-unit-type:not(.disabled)::before,
.price-tax-inclusivity:not(.disabled)::before {
  content: "\\00a0";
}

merch-card button a,
merch-card button a:hover {
  text-decoration: none;
}

.spectrum merch-card [slot="footer"] button.spectrum-Button > a,
.spectrum merch-card [slot="cta"] button.spectrum-Button > a {
  color: var(--spectrum-button-content-color-default);
}

.spectrum merch-card [slot="footer"] button.spectrum-Button:hover > a,
.spectrum merch-card [slot="cta"] button.spectrum-Button:hover > a {
  color: var(--spectrum-button-content-color-hover);
}

.spectrum merch-card [slot="footer"] button.spectrum-Button > a:focus,
.spectrum merch-card [slot="cta"] button.spectrum-Button > a:focus {
  color: var(--spectrum-button-content-color-focus);
}

merch-card span.placeholder-resolved[data-template='strikethrough'],
merch-card span.price.price-strikethrough {
  font-size: var(--consonant-merch-card-body-xs-font-size);
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

/* dark theme */
.spectrum--dark  merch-card a.secondary-link {
    color: #F8F8F8;
}

`;document.head.appendChild(Hf)});var o0=Ar(O=>{"use strict";l();c();var ma=Symbol.for("react.element"),ly=Symbol.for("react.portal"),uy=Symbol.for("react.fragment"),dy=Symbol.for("react.strict_mode"),my=Symbol.for("react.profiler"),py=Symbol.for("react.provider"),fy=Symbol.for("react.context"),gy=Symbol.for("react.forward_ref"),hy=Symbol.for("react.suspense"),by=Symbol.for("react.memo"),vy=Symbol.for("react.lazy"),Uf=Symbol.iterator;function xy(e){return e===null||typeof e!="object"?null:(e=Uf&&e[Uf]||e["@@iterator"],typeof e=="function"?e:null)}var Xf={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Zf=Object.assign,Qf={};function ho(e,t,r){this.props=e,this.context=t,this.refs=Qf,this.updater=r||Xf}ho.prototype.isReactComponent={};ho.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};ho.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Yf(){}Yf.prototype=ho.prototype;function Zi(e,t,r){this.props=e,this.context=t,this.refs=Qf,this.updater=r||Xf}var Qi=Zi.prototype=new Yf;Qi.constructor=Zi;Zf(Qi,ho.prototype);Qi.isPureReactComponent=!0;var Wf=Array.isArray,Jf=Object.prototype.hasOwnProperty,Yi={current:null},e0={key:!0,ref:!0,__self:!0,__source:!0};function t0(e,t,r){var o,a={},n=null,s=null;if(t!=null)for(o in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(n=""+t.key),t)Jf.call(t,o)&&!e0.hasOwnProperty(o)&&(a[o]=t[o]);var i=arguments.length-2;if(i===1)a.children=r;else if(1<i){for(var u=Array(i),d=0;d<i;d++)u[d]=arguments[d+2];a.children=u}if(e&&e.defaultProps)for(o in i=e.defaultProps,i)a[o]===void 0&&(a[o]=i[o]);return{$$typeof:ma,type:e,key:n,ref:s,props:a,_owner:Yi.current}}function yy(e,t){return{$$typeof:ma,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Ji(e){return typeof e=="object"&&e!==null&&e.$$typeof===ma}function $y(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var Kf=/\/+/g;function Xi(e,t){return typeof e=="object"&&e!==null&&e.key!=null?$y(""+e.key):t.toString(36)}function Bn(e,t,r,o,a){var n=typeof e;(n==="undefined"||n==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(n){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case ma:case ly:s=!0}}if(s)return s=e,a=a(s),e=o===""?"."+Xi(s,0):o,Wf(a)?(r="",e!=null&&(r=e.replace(Kf,"$&/")+"/"),Bn(a,t,r,"",function(d){return d})):a!=null&&(Ji(a)&&(a=yy(a,r+(!a.key||s&&s.key===a.key?"":(""+a.key).replace(Kf,"$&/")+"/")+e)),t.push(a)),1;if(s=0,o=o===""?".":o+":",Wf(e))for(var i=0;i<e.length;i++){n=e[i];var u=o+Xi(n,i);s+=Bn(n,t,r,u,a)}else if(u=xy(e),typeof u=="function")for(e=u.call(e),i=0;!(n=e.next()).done;)n=n.value,u=o+Xi(n,i++),s+=Bn(n,t,r,u,a);else if(n==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function Tn(e,t,r){if(e==null)return e;var o=[],a=0;return Bn(e,o,"","",function(n){return t.call(r,n,a++)}),o}function zy(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Te={current:null},Fn={transition:null},ky={ReactCurrentDispatcher:Te,ReactCurrentBatchConfig:Fn,ReactCurrentOwner:Yi};function r0(){throw Error("act(...) is not supported in production builds of React.")}O.Children={map:Tn,forEach:function(e,t,r){Tn(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return Tn(e,function(){t++}),t},toArray:function(e){return Tn(e,function(t){return t})||[]},only:function(e){if(!Ji(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};O.Component=ho;O.Fragment=uy;O.Profiler=my;O.PureComponent=Zi;O.StrictMode=dy;O.Suspense=hy;O.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ky;O.act=r0;O.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=Zf({},e.props),a=e.key,n=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(n=t.ref,s=Yi.current),t.key!==void 0&&(a=""+t.key),e.type&&e.type.defaultProps)var i=e.type.defaultProps;for(u in t)Jf.call(t,u)&&!e0.hasOwnProperty(u)&&(o[u]=t[u]===void 0&&i!==void 0?i[u]:t[u])}var u=arguments.length-2;if(u===1)o.children=r;else if(1<u){i=Array(u);for(var d=0;d<u;d++)i[d]=arguments[d+2];o.children=i}return{$$typeof:ma,type:e.type,key:a,ref:n,props:o,_owner:s}};O.createContext=function(e){return e={$$typeof:fy,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:py,_context:e},e.Consumer=e};O.createElement=t0;O.createFactory=function(e){var t=t0.bind(null,e);return t.type=e,t};O.createRef=function(){return{current:null}};O.forwardRef=function(e){return{$$typeof:gy,render:e}};O.isValidElement=Ji;O.lazy=function(e){return{$$typeof:vy,_payload:{_status:-1,_result:e},_init:zy}};O.memo=function(e,t){return{$$typeof:by,type:e,compare:t===void 0?null:t}};O.startTransition=function(e){var t=Fn.transition;Fn.transition={};try{e()}finally{Fn.transition=t}};O.unstable_act=r0;O.useCallback=function(e,t){return Te.current.useCallback(e,t)};O.useContext=function(e){return Te.current.useContext(e)};O.useDebugValue=function(){};O.useDeferredValue=function(e){return Te.current.useDeferredValue(e)};O.useEffect=function(e,t){return Te.current.useEffect(e,t)};O.useId=function(){return Te.current.useId()};O.useImperativeHandle=function(e,t,r){return Te.current.useImperativeHandle(e,t,r)};O.useInsertionEffect=function(e,t){return Te.current.useInsertionEffect(e,t)};O.useLayoutEffect=function(e,t){return Te.current.useLayoutEffect(e,t)};O.useMemo=function(e,t){return Te.current.useMemo(e,t)};O.useReducer=function(e,t,r){return Te.current.useReducer(e,t,r)};O.useRef=function(e){return Te.current.useRef(e)};O.useState=function(e){return Te.current.useState(e)};O.useSyncExternalStore=function(e,t,r){return Te.current.useSyncExternalStore(e,t,r)};O.useTransition=function(){return Te.current.useTransition()};O.version="18.3.1"});var H=Ar((a8,a0)=>{"use strict";l();c();a0.exports=o0()});var n0=v(()=>{l();c()});var ec,s0=v(()=>{l();c();ec={};ec={pending:"\u0642\u064A\u062F \u0627\u0644\u0627\u0646\u062A\u0638\u0627\u0631"}});var tc,i0=v(()=>{l();c();tc={};tc={pending:"\u043D\u0435\u0434\u043E\u0432\u044A\u0440\u0448\u0435\u043D\u043E"}});var rc,c0=v(()=>{l();c();rc={};rc={pending:"\u010Dek\xE1 na vy\u0159\xEDzen\xED"}});var oc,l0=v(()=>{l();c();oc={};oc={pending:"afventende"}});var ac,u0=v(()=>{l();c();ac={};ac={pending:"Ausstehend"}});var nc,d0=v(()=>{l();c();nc={};nc={pending:"\u03C3\u03B5 \u03B5\u03BA\u03BA\u03C1\u03B5\u03BC\u03CC\u03C4\u03B7\u03C4\u03B1"}});var sc,m0=v(()=>{l();c();sc={};sc={pending:"pending"}});var ic,p0=v(()=>{l();c();ic={};ic={pending:"pendiente"}});var cc,f0=v(()=>{l();c();cc={};cc={pending:"ootel"}});var lc,g0=v(()=>{l();c();lc={};lc={pending:"odottaa"}});var uc,h0=v(()=>{l();c();uc={};uc={pending:"En attente"}});var dc,b0=v(()=>{l();c();dc={};dc={pending:"\u05DE\u05DE\u05EA\u05D9\u05DF \u05DC"}});var mc,v0=v(()=>{l();c();mc={};mc={pending:"u tijeku"}});var pc,x0=v(()=>{l();c();pc={};pc={pending:"f\xFCgg\u0151ben lev\u0151"}});var fc,y0=v(()=>{l();c();fc={};fc={pending:"in sospeso"}});var gc,$0=v(()=>{l();c();gc={};gc={pending:"\u4FDD\u7559"}});var hc,z0=v(()=>{l();c();hc={};hc={pending:"\uBCF4\uB958 \uC911"}});var bc,k0=v(()=>{l();c();bc={};bc={pending:"laukiama"}});var vc,w0=v(()=>{l();c();vc={};vc={pending:"gaida"}});var xc,_0=v(()=>{l();c();xc={};xc={pending:"avventer"}});var yc,S0=v(()=>{l();c();yc={};yc={pending:"in behandeling"}});var $c,E0=v(()=>{l();c();$c={};$c={pending:"oczekuj\u0105ce"}});var zc,C0=v(()=>{l();c();zc={};zc={pending:"pendente"}});var kc,V0=v(()=>{l();c();kc={};kc={pending:"pendente"}});var wc,P0=v(()=>{l();c();wc={};wc={pending:"\xEEn a\u0219teptare"}});var _c,G0=v(()=>{l();c();_c={};_c={pending:"\u0432 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u0438"}});var Sc,L0=v(()=>{l();c();Sc={};Sc={pending:"\u010Dakaj\xFAce"}});var Ec,T0=v(()=>{l();c();Ec={};Ec={pending:"v teku"}});var Cc,B0=v(()=>{l();c();Cc={};Cc={pending:"nere\u0161eno"}});var Vc,F0=v(()=>{l();c();Vc={};Vc={pending:"v\xE4ntande"}});var Pc,R0=v(()=>{l();c();Pc={};Pc={pending:"beklemede"}});var Gc,A0=v(()=>{l();c();Gc={};Gc={pending:"\u0432 \u043E\u0447\u0456\u043A\u0443\u0432\u0430\u043D\u043D\u0456"}});var Lc,M0=v(()=>{l();c();Lc={};Lc={pending:"\u5F85\u5904\u7406"}});var Tc,I0=v(()=>{l();c();Tc={};Tc={pending:"\u5F85\u8655\u7406"}});var Bc,N0=v(()=>{l();c();s0();i0();c0();l0();u0();d0();m0();p0();f0();g0();h0();b0();v0();x0();y0();$0();z0();k0();w0();_0();S0();E0();C0();V0();P0();G0();L0();T0();B0();F0();R0();A0();M0();I0();Bc={};Bc={"ar-AE":ec,"bg-BG":tc,"cs-CZ":rc,"da-DK":oc,"de-DE":ac,"el-GR":nc,"en-US":sc,"es-ES":ic,"et-EE":cc,"fi-FI":lc,"fr-FR":uc,"he-IL":dc,"hr-HR":mc,"hu-HU":pc,"it-IT":fc,"ja-JP":gc,"ko-KR":hc,"lt-LT":bc,"lv-LV":vc,"nb-NO":xc,"nl-NL":yc,"pl-PL":$c,"pt-BR":zc,"pt-PT":kc,"ro-RO":wc,"ru-RU":_c,"sk-SK":Sc,"sl-SI":Ec,"sr-SP":Cc,"sv-SE":Vc,"tr-TR":Pc,"uk-UA":Gc,"zh-CN":Lc,"zh-TW":Tc}});var D0=v(()=>{});function N(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var I,Fc,Rn,Rc,Ac,Mc,Ic,Nc,Dc,Oc,tr,An,rr,qc,Hc,jc,Uc,Wc,Kc,Xc,Zc,Qc,Yc,Jc,el,tl,rl,ol,al,nl,sl,il,cl,Mn,ll,ul,dl,ml,pl,O0=v(()=>{l();c();I={};N(I,"focus-ring",()=>Fc,e=>Fc=e);N(I,"i18nFontFamily",()=>Rn,e=>Rn=e);N(I,"is-active",()=>Rc,e=>Rc=e);N(I,"is-disabled",()=>Ac,e=>Ac=e);N(I,"is-focused",()=>Mc,e=>Mc=e);N(I,"is-hovered",()=>Ic,e=>Ic=e);N(I,"is-open",()=>Nc,e=>Nc=e);N(I,"is-placeholder",()=>Dc,e=>Dc=e);N(I,"is-selected",()=>Oc,e=>Oc=e);N(I,"spectrum-BaseButton",()=>tr,e=>tr=e);N(I,"spectrum-FocusRing-ring",()=>An,e=>An=e);N(I,"spectrum-FocusRing",()=>rr,e=>rr=e);N(I,"spectrum-ActionButton",()=>qc,e=>qc=e);N(I,"spectrum-ActionButton--emphasized",()=>Hc,e=>Hc=e);N(I,"spectrum-ActionButton--quiet",()=>jc,e=>jc=e);N(I,"spectrum-ActionButton--staticBlack",()=>Uc,e=>Uc=e);N(I,"spectrum-ActionButton--staticColor",()=>Wc,e=>Wc=e);N(I,"spectrum-ActionButton--staticWhite",()=>Kc,e=>Kc=e);N(I,"spectrum-ActionButton-hold",()=>Xc,e=>Xc=e);N(I,"spectrum-ActionButton-label",()=>Zc,e=>Zc=e);N(I,"spectrum-ActionGroup-itemIcon",()=>Qc,e=>Qc=e);N(I,"spectrum-Button",()=>Yc,e=>Yc=e);N(I,"spectrum-Button--iconOnly",()=>Jc,e=>Jc=e);N(I,"spectrum-Button--overBackground",()=>el,e=>el=e);N(I,"spectrum-Button--pending",()=>tl,e=>tl=e);N(I,"spectrum-Button-circleLoader",()=>rl,e=>rl=e);N(I,"spectrum-Button-label",()=>ol,e=>ol=e);N(I,"spectrum-ClearButton",()=>al,e=>al=e);N(I,"spectrum-ClearButton--overBackground",()=>nl,e=>nl=e);N(I,"spectrum-ClearButton--small",()=>sl,e=>sl=e);N(I,"spectrum-FieldButton",()=>il,e=>il=e);N(I,"spectrum-FieldButton--invalid",()=>cl,e=>cl=e);N(I,"spectrum-FocusRing--quiet",()=>Mn,e=>Mn=e);N(I,"spectrum-FieldButton--quiet",()=>ll,e=>ll=e);N(I,"spectrum-Icon",()=>ul,e=>ul=e);N(I,"spectrum-LogicButton",()=>dl,e=>dl=e);N(I,"spectrum-LogicButton--and",()=>ml,e=>ml=e);N(I,"spectrum-LogicButton--or",()=>pl,e=>pl=e);Fc="ntVziG_focus-ring";Rn="ntVziG_i18nFontFamily";Rc="ntVziG_is-active";Ac="ntVziG_is-disabled";Mc="ntVziG_is-focused";Ic="ntVziG_is-hovered";Nc="ntVziG_is-open";Dc="ntVziG_is-placeholder";Oc="ntVziG_is-selected";tr=`ntVziG_spectrum-BaseButton ${Rn}`;An="ntVziG_spectrum-FocusRing-ring";rr=`ntVziG_spectrum-FocusRing ${An}`;qc=`ntVziG_spectrum-ActionButton ${tr} ${rr}`;Hc="ntVziG_spectrum-ActionButton--emphasized";jc="ntVziG_spectrum-ActionButton--quiet";Uc="ntVziG_spectrum-ActionButton--staticBlack";Wc="ntVziG_spectrum-ActionButton--staticColor";Kc="ntVziG_spectrum-ActionButton--staticWhite";Xc="ntVziG_spectrum-ActionButton-hold";Zc="ntVziG_spectrum-ActionButton-label";Qc="ntVziG_spectrum-ActionGroup-itemIcon";Yc=`ntVziG_spectrum-Button ${tr} ${rr}`;Jc="ntVziG_spectrum-Button--iconOnly";el="ntVziG_spectrum-Button--overBackground";tl="ntVziG_spectrum-Button--pending";rl="ntVziG_spectrum-Button-circleLoader";ol="ntVziG_spectrum-Button-label";al=`ntVziG_spectrum-ClearButton ${tr} ${rr}`;nl="ntVziG_spectrum-ClearButton--overBackground";sl="ntVziG_spectrum-ClearButton--small";il=`ntVziG_spectrum-FieldButton ${tr} ${rr}`;cl="ntVziG_spectrum-FieldButton--invalid";Mn="ntVziG_spectrum-FocusRing--quiet";ll=`ntVziG_spectrum-FieldButton--quiet ${Mn}`;ul="ntVziG_spectrum-Icon";dl=`ntVziG_spectrum-LogicButton ${tr} ${rr}`;ml="ntVziG_spectrum-LogicButton--and";pl="ntVziG_spectrum-LogicButton--or"});function q0(e){var t,r,o="";if(typeof e=="string"||typeof e=="number")o+=e;else if(typeof e=="object")if(Array.isArray(e)){var a=e.length;for(t=0;t<a;t++)e[t]&&(r=q0(e[t]))&&(o&&(o+=" "),o+=r)}else for(r in e)e[r]&&(o&&(o+=" "),o+=r);return o}function wy(){for(var e,t,r=0,o="",a=arguments.length;r<a;r++)(e=arguments[r])&&(t=q0(e))&&(o&&(o+=" "),o+=t);return o}var or,pa=v(()=>{l();c();or=wy});function ze(e,...t){let r=[];for(let o of t)if(typeof o=="object"&&o){let a={};for(let n in o)e[n]&&(a[e[n]]=o[n]),(ar||!e[n])&&(a[n]=o[n]);r.push(a)}else typeof o=="string"?(e[o]&&r.push(e[o]),(ar||!e[o])&&r.push(o)):r.push(o);return or(...r)}var ar,H0=v(()=>{l();c();pa();ar=!1});function Ey(e=!1){let t=(0,he.useContext)(j0),r=(0,he.useRef)(null);if(r.current===null&&!e){var o,a;let n=(a=he.default.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)===null||a===void 0||(o=a.ReactCurrentOwner)===null||o===void 0?void 0:o.current;if(n){let s=fl.get(n);s==null?fl.set(n,{id:t.current,state:n.memoizedState}):n.memoizedState!==s.state&&(t.current=s.id,fl.delete(n))}r.current=++t.current}return r.current}function Cy(e){let t=(0,he.useContext)(j0);t===In&&!Sy&&console.warn("When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.");let r=Ey(!!e),o=`react-aria${t.prefix}`;return e||`${o}-${r}`}function Vy(e){let t=he.default.useId(),[r]=(0,he.useState)(nr()),o=r?"react-aria":`react-aria${In.prefix}`;return e||`${o}-${t}`}function Py(){return!1}function Gy(){return!0}function Ly(e){return()=>{}}function nr(){return typeof he.default.useSyncExternalStore=="function"?he.default.useSyncExternalStore(Ly,Py,Gy):(0,he.useContext)(_y)}var he,In,j0,_y,Sy,fl,gl,U0=v(()=>{l();c();he=q(H(),1),In={prefix:String(Math.round(Math.random()*1e10)),current:0},j0=he.default.createContext(In),_y=he.default.createContext(!1),Sy=!!(typeof window<"u"&&window.document&&window.document.createElement),fl=new WeakMap;gl=typeof he.default.useId=="function"?Vy:Cy});var fa=v(()=>{l();c();U0()});function ga(e){let t=typeof window<"u"&&typeof window.matchMedia=="function",[r,o]=(0,Nn.useState)(()=>t?window.matchMedia(e).matches:!1);return(0,Nn.useEffect)(()=>{if(!t)return;let n=window.matchMedia(e),s=i=>{o(i.matches)};return n.addListener(s),()=>{n.removeListener(s)}},[t,e]),nr()?!1:r}var Nn,W0=v(()=>{l();c();Nn=q(H(),1);fa()});function hl(e){return{UNSAFE_getDOMNode(){return e.current}}}function K0(e,t=e){return{...hl(e),focus(){t.current&&t.current.focus()}}}function Nr(e){let t=(0,Ir.useRef)(null);return(0,Ir.useImperativeHandle)(e,()=>hl(t)),t}function bl(e,t){let r=(0,Ir.useRef)(null);return(0,Ir.useImperativeHandle)(e,()=>K0(r,t)),r}var Ir,X0=v(()=>{l();c();Ir=q(H(),1)});function xl(e){let{children:t,matchedBreakpoints:r}=e;return Tt.default.createElement(vl.Provider,{value:{matchedBreakpoints:r}},t)}function yl(e){let t=Object.entries(e).sort(([,u],[,d])=>d-u),r=t.map(([,u])=>`(min-width: ${u}px)`),o=typeof window<"u"&&typeof window.matchMedia=="function",a=()=>{let u=[];for(let d in r){let $=r[d];window.matchMedia($).matches&&u.push(t[d][0])}return u.push("base"),u},[n,s]=(0,Tt.useState)(()=>o?a():["base"]);return(0,Tt.useEffect)(()=>{if(!o)return;let u=()=>{let d=a();s($=>$.length!==d.length||$.some((k,z)=>k!==d[z])?[...d]:$)};return window.addEventListener("resize",u),()=>{window.removeEventListener("resize",u)}},[o]),nr()?["base"]:n}function $l(){return(0,Tt.useContext)(vl)}var Tt,vl,zl=v(()=>{l();c();Tt=q(H(),1);fa();vl=Tt.default.createContext(null);vl.displayName="BreakpointContext"});function Dn(e){if(Intl.Locale){let r=new Intl.Locale(e).maximize(),o=typeof r.getTextInfo=="function"?r.getTextInfo():r.textInfo;if(o)return o.direction==="rtl";if(r.script)return Ty.has(r.script)}let t=e.split("-")[0];return By.has(t)}var Ty,By,kl=v(()=>{l();c();Ty=new Set(["Arab","Syrc","Samr","Mand","Thaa","Mend","Nkoo","Adlm","Rohg","Hebr"]),By=new Set(["ae","ar","arc","bcc","bqi","ckb","dv","fa","glk","he","ku","mzn","nqo","pnb","ps","sd","ug","ur","yi"])});function Q0(){let e=typeof window<"u"&&window[Fy]||typeof navigator<"u"&&(navigator.language||navigator.userLanguage)||"en-US";try{Intl.DateTimeFormat.supportedLocalesOf([e])}catch{e="en-US"}return{locale:e,direction:Dn(e)?"rtl":"ltr"}}function Z0(){wl=Q0();for(let e of ha)e(wl)}function _l(){let e=nr(),[t,r]=(0,On.useState)(wl);return(0,On.useEffect)(()=>(ha.size===0&&window.addEventListener("languagechange",Z0),ha.add(r),()=>{ha.delete(r),ha.size===0&&window.removeEventListener("languagechange",Z0)}),[]),e?{locale:"en-US",direction:"ltr"}:t}var On,Fy,wl,ha,Y0=v(()=>{l();c();kl();On=q(H(),1);fa();Fy=Symbol.for("react-aria.i18n.locale");wl=Q0(),ha=new Set});function Sl(e){let{locale:t,children:r}=e,o=_l(),a=bo.default.useMemo(()=>t?{locale:t,direction:Dn(t)?"rtl":"ltr"}:o,[o,t]);return bo.default.createElement(J0.Provider,{value:a},r)}function $t(){let e=_l();return(0,bo.useContext)(J0)||e}var bo,J0,qn=v(()=>{l();c();kl();Y0();bo=q(H(),1),J0=bo.default.createContext(null)});function My(e,t,r="en-US"){if(t[e])return t[e];let o=Iy(e);if(t[o])return t[o];for(let a in t)if(a.startsWith(o+"-"))return t[a];return t[r]}function Iy(e){return Intl.Locale?new Intl.Locale(e).language:e.split("-")[0]}var Ry,Ay,vo,xo,eg=v(()=>{l();c();Ry=Symbol.for("react-aria.i18n.locale"),Ay=Symbol.for("react-aria.i18n.strings"),xo=class e{getStringForLocale(t,r){let a=this.getStringsForLocale(r)[t];if(!a)throw new Error(`Could not find intl message ${t} in ${r} locale`);return a}getStringsForLocale(t){let r=this.strings[t];return r||(r=My(t,this.strings,this.defaultLocale),this.strings[t]=r),r}static getGlobalDictionaryForPackage(t){if(typeof window>"u")return null;let r=window[Ry];if(vo===void 0){let a=window[Ay];if(!a)return null;vo={};for(let n in a)vo[n]=new e({[r]:a[n]},r)}let o=vo?.[t];if(!o)throw new Error(`Strings for package "${t}" were not included by LocalizedStringProvider. Please add it to the list passed to createLocalizedStringDictionary.`);return o}constructor(t,r="en-US"){this.strings=Object.fromEntries(Object.entries(t).filter(([,o])=>o)),this.defaultLocale=r}}});var tg,rg,ba,og=v(()=>{l();c();tg=new Map,rg=new Map,ba=class{format(t,r){let o=this.strings.getStringForLocale(t,this.locale);return typeof o=="function"?o(r,this):o}plural(t,r,o="cardinal"){let a=r["="+t];if(a)return typeof a=="function"?a():a;let n=this.locale+":"+o,s=tg.get(n);s||(s=new Intl.PluralRules(this.locale,{type:o}),tg.set(n,s));let i=s.select(t);return a=r[i]||r.other,typeof a=="function"?a():a}number(t){let r=rg.get(this.locale);return r||(r=new Intl.NumberFormat(this.locale),rg.set(this.locale,r)),r.format(t)}select(t,r){let o=t[r]||t.other;return typeof o=="function"?o():o}constructor(t,r){this.locale=t,this.strings=r}}});var ag=v(()=>{l();c();eg();og()});function Ny(e){let t=ng.get(e);return t||(t=new xo(e),ng.set(e,t)),t}function ig(e,t){return t&&xo.getGlobalDictionaryForPackage(t)||Ny(e)}function El(e,t){let{locale:r}=$t(),o=ig(e,t);return(0,sg.useMemo)(()=>new ba(r,o),[r,o])}var sg,ng,cg=v(()=>{l();c();qn();ag();sg=q(H(),1),ng=new WeakMap});function lg(e,t){if(t.has(e))throw new TypeError("Cannot initialize the same private elements twice on an object")}var ug=v(()=>{l();c()});function dg(e,t,r){lg(e,t),t.set(e,r)}var mg=v(()=>{l();c();ug()});var pg,it,va=v(()=>{l();c();pg=q(H(),1),it=typeof document<"u"?pg.default.useLayoutEffect:()=>{}});function Bt(e){let t=(0,Hn.useRef)(null);return it(()=>{t.current=e},[e]),(0,Hn.useCallback)((...r)=>{let o=t.current;return o?.(...r)},[])}var Hn,fg=v(()=>{l();c();va();Hn=q(H(),1)});function ct(e){let[t,r]=(0,ir.useState)(e),o=(0,ir.useRef)(null),a=gl(t),n=(0,ir.useCallback)(s=>{o.current=s},[]);return Dy&&(sr.has(a)&&!sr.get(a).includes(n)?sr.set(a,[...sr.get(a),n]):sr.set(a,[n])),it(()=>{let s=a;return()=>{sr.delete(s)}},[a]),(0,ir.useEffect)(()=>{let s=o.current;s&&(o.current=null,r(s))}),a}function Cl(e,t){if(e===t)return e;let r=sr.get(e);if(r)return r.forEach(a=>a(t)),t;let o=sr.get(t);return o?(o.forEach(a=>a(e)),e):t}var ir,Dy,sr,jn=v(()=>{l();c();va();ir=q(H(),1);fa();Dy=!!(typeof window<"u"&&window.document&&window.document.createElement),sr=new Map});function xa(...e){return(...t)=>{for(let r of e)typeof r=="function"&&r(...t)}}var Vl=v(()=>{l();c()});var pe,je,gg=v(()=>{l();c();pe=e=>{var t;return(t=e?.ownerDocument)!==null&&t!==void 0?t:document},je=e=>e&&"window"in e&&e.window===e?e:pe(e).defaultView||window});function de(...e){let t={...e[0]};for(let r=1;r<e.length;r++){let o=e[r];for(let a in o){let n=t[a],s=o[a];typeof n=="function"&&typeof s=="function"&&a[0]==="o"&&a[1]==="n"&&a.charCodeAt(2)>=65&&a.charCodeAt(2)<=90?t[a]=xa(n,s):(a==="className"||a==="UNSAFE_className")&&typeof n=="string"&&typeof s=="string"?t[a]=or(n,s):a==="id"&&n&&s?t.id=Cl(n,s):t[a]=s!==void 0?s:n}}return t}var hg=v(()=>{l();c();Vl();jn();pa()});function zt(e,t={}){let{labelable:r,isLink:o,propNames:a}=t,n={};for(let s in e)Object.prototype.hasOwnProperty.call(e,s)&&(Oy.has(s)||r&&qy.has(s)||o&&Hy.has(s)||a?.has(s)||jy.test(s))&&(n[s]=e[s]);return n}var Oy,qy,Hy,jy,bg=v(()=>{l();c();Oy=new Set(["id"]),qy=new Set(["aria-label","aria-labelledby","aria-describedby","aria-details"]),Hy=new Set(["href","hrefLang","target","rel","download","ping","referrerPolicy"]),jy=/^(data-.*)$/});function lt(e){if(Uy())e.focus({preventScroll:!0});else{let t=Wy(e);e.focus(),Ky(t)}}function Uy(){if(Un==null){Un=!1;try{document.createElement("div").focus({get preventScroll(){return Un=!0,!0}})}catch{}}return Un}function Wy(e){let t=e.parentNode,r=[],o=document.scrollingElement||document.documentElement;for(;t instanceof HTMLElement&&t!==o;)(t.offsetHeight<t.scrollHeight||t.offsetWidth<t.scrollWidth)&&r.push({element:t,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft}),t=t.parentNode;return o instanceof HTMLElement&&r.push({element:o,scrollTop:o.scrollTop,scrollLeft:o.scrollLeft}),r}function Ky(e){for(let{element:t,scrollTop:r,scrollLeft:o}of e)t.scrollTop=r,t.scrollLeft=o}var Un,Pl=v(()=>{l();c();Un=null});function Wn(e){var t;return typeof window>"u"||window.navigator==null?!1:((t=window.navigator.userAgentData)===null||t===void 0?void 0:t.brands.some(r=>e.test(r.brand)))||e.test(window.navigator.userAgent)}function Gl(e){var t;return typeof window<"u"&&window.navigator!=null?e.test(((t=window.navigator.userAgentData)===null||t===void 0?void 0:t.platform)||window.navigator.platform):!1}function Ft(e){let t=null;return()=>(t==null&&(t=e()),t)}var kt,vg,Kn,ya,Ll,Tl,xg,Xn,$a,Zn=v(()=>{l();c();kt=Ft(function(){return Gl(/^Mac/i)}),vg=Ft(function(){return Gl(/^iPhone/i)}),Kn=Ft(function(){return Gl(/^iPad/i)||kt()&&navigator.maxTouchPoints>1}),ya=Ft(function(){return vg()||Kn()}),Ll=Ft(function(){return kt()||ya()}),Tl=Ft(function(){return Wn(/AppleWebKit/i)&&!xg()}),xg=Ft(function(){return Wn(/Chrome/i)}),Xn=Ft(function(){return Wn(/Android/i)}),$a=Ft(function(){return Wn(/Firefox/i)})});function Bl(e){let{children:t,navigate:r,useHref:o}=e,a=(0,Dr.useMemo)(()=>({isNative:!1,open:(n,s,i,u)=>{$g(n,d=>{yg(d,s)?r(i,u):Rt(d,s)})},useHref:o||(n=>n)}),[r,o]);return Dr.default.createElement(Xy.Provider,{value:a},t)}function yg(e,t){let r=e.getAttribute("target");return(!r||r==="_self")&&e.origin===location.origin&&!e.hasAttribute("download")&&!t.metaKey&&!t.ctrlKey&&!t.altKey&&!t.shiftKey}function Rt(e,t,r=!0){var o,a;let{metaKey:n,ctrlKey:s,altKey:i,shiftKey:u}=t;$a()&&(!((a=window.event)===null||a===void 0||(o=a.type)===null||o===void 0)&&o.startsWith("key"))&&e.target==="_blank"&&(kt()?n=!0:s=!0);let d=Tl()&&kt()&&!Kn()?new KeyboardEvent("keydown",{keyIdentifier:"Enter",metaKey:n,ctrlKey:s,altKey:i,shiftKey:u}):new MouseEvent("click",{metaKey:n,ctrlKey:s,altKey:i,shiftKey:u,bubbles:!0,cancelable:!0});Rt.isOpening=r,lt(e),e.dispatchEvent(d),Rt.isOpening=!1}function $g(e,t){if(e instanceof HTMLAnchorElement)t(e);else if(e.hasAttribute("data-href")){let r=document.createElement("a");r.href=e.getAttribute("data-href"),e.hasAttribute("data-target")&&(r.target=e.getAttribute("data-target")),e.hasAttribute("data-rel")&&(r.rel=e.getAttribute("data-rel")),e.hasAttribute("data-download")&&(r.download=e.getAttribute("data-download")),e.hasAttribute("data-ping")&&(r.ping=e.getAttribute("data-ping")),e.hasAttribute("data-referrer-policy")&&(r.referrerPolicy=e.getAttribute("data-referrer-policy")),e.appendChild(r),t(r),e.removeChild(r)}}function Zy(e,t){$g(e,r=>Rt(r,t))}var Dr,Xy,zg=v(()=>{l();c();Pl();Zn();Dr=q(H(),1),Xy=(0,Dr.createContext)({isNative:!0,open:Zy,useHref:e=>e});Rt.isOpening=!1});function kg(){if(typeof window>"u")return;function e(o){return"propertyName"in o}let t=o=>{if(!e(o)||!o.target)return;let a=yo.get(o.target);a||(a=new Set,yo.set(o.target,a),o.target.addEventListener("transitioncancel",r,{once:!0})),a.add(o.propertyName)},r=o=>{if(!e(o)||!o.target)return;let a=yo.get(o.target);if(a&&(a.delete(o.propertyName),a.size===0&&(o.target.removeEventListener("transitioncancel",r),yo.delete(o.target)),yo.size===0)){for(let n of Fl)n();Fl.clear()}};document.body.addEventListener("transitionrun",t),document.body.addEventListener("transitionend",r)}function za(e){requestAnimationFrame(()=>{yo.size===0?e():Fl.add(e)})}var yo,Fl,wg=v(()=>{l();c();yo=new Map,Fl=new Set;typeof document<"u"&&(document.readyState!=="loading"?kg():document.addEventListener("DOMContentLoaded",kg))});function Rl(){let e=(0,cr.useRef)(new Map),t=(0,cr.useCallback)((a,n,s,i)=>{let u=i?.once?(...d)=>{e.current.delete(s),s(...d)}:s;e.current.set(s,{type:n,eventTarget:a,fn:u,options:i}),a.addEventListener(n,s,i)},[]),r=(0,cr.useCallback)((a,n,s,i)=>{var u;let d=((u=e.current.get(s))===null||u===void 0?void 0:u.fn)||s;a.removeEventListener(n,d,i),e.current.delete(s)},[]),o=(0,cr.useCallback)(()=>{e.current.forEach((a,n)=>{r(a.eventTarget,a.type,n,a.options)})},[r]);return(0,cr.useEffect)(()=>o,[o]),{addGlobalListener:t,removeGlobalListener:r,removeAllGlobalListeners:o}}var cr,_g=v(()=>{l();c();cr=q(H(),1)});function Al(e,t){let{id:r,"aria-label":o,"aria-labelledby":a}=e;return r=ct(r),a&&o?a=[...new Set([r,...a.trim().split(/\s+/)])].join(" "):a&&(a=a.trim().split(/\s+/).join(" ")),!o&&!a&&t&&(o=t),{id:r,"aria-label":o,"aria-labelledby":a}}var Sg=v(()=>{l();c();jn()});function ka(e,t){it(()=>{if(e&&e.ref&&t)return e.ref.current=t.current,()=>{e.ref&&(e.ref.current=null)}})}var Eg=v(()=>{l();c();va()});function $o(e){return e.mozInputSource===0&&e.isTrusted?!0:Xn()&&e.pointerType?e.type==="click"&&e.buttons===1:e.detail===0&&!e.pointerType}function Ml(e){return!Xn()&&e.width===0&&e.height===0||e.width===1&&e.height===1&&e.pressure===0&&e.detail===0&&e.pointerType==="mouse"}var Cg=v(()=>{l();c();Zn()});function zo(e,t=-1/0,r=1/0){return Math.min(Math.max(e,t),r)}var Vg=v(()=>{l();c()});var Pg=v(()=>{l();c();Vg()});var be=v(()=>{l();c();jn();Vl();gg();hg();bg();Pl();zg();wg();_g();Sg();va();Eg();Zn();Cg();fg();Pg()});function Yy(e,t={}){let{numberingSystem:r}=t;if(r&&e.includes("-nu-")&&(e.includes("-u-")||(e+="-u-"),e+=`-nu-${r}`),t.style==="unit"&&!Qn){var o;let{unit:s,unitDisplay:i="short"}=t;if(!s)throw new Error('unit option must be provided with style: "unit"');if(!(!((o=Gg[s])===null||o===void 0)&&o[i]))throw new Error(`Unsupported unit ${s} with unitDisplay = ${i}`);t={...t,style:"decimal"}}let a=e+(t?Object.entries(t).sort((s,i)=>s[0]<i[0]?-1:1).join():"");if(Il.has(a))return Il.get(a);let n=new Intl.NumberFormat(e,t);return Il.set(a,n),n}function Jy(e,t,r){if(t==="auto")return e.format(r);if(t==="never")return e.format(Math.abs(r));{let o=!1;if(t==="always"?o=r>0||Object.is(r,0):t==="exceptZero"&&(Object.is(r,-0)||Object.is(r,0)?r=Math.abs(r):o=r>0),o){let a=e.format(-r),n=e.format(r),s=a.replace(n,"").replace(/\u200e|\u061C/,"");return[...s].length!==1&&console.warn("@react-aria/i18n polyfill for NumberFormat signDisplay: Unsupported case"),a.replace(n,"!!!").replace(s,"+").replace("!!!",n)}else return e.format(r)}}var Il,Nl,Qn,Gg,wa,Lg=v(()=>{l();c();Il=new Map,Nl=!1;try{Nl=new Intl.NumberFormat("de-DE",{signDisplay:"exceptZero"}).resolvedOptions().signDisplay==="exceptZero"}catch{}Qn=!1;try{Qn=new Intl.NumberFormat("de-DE",{style:"unit",unit:"degree"}).resolvedOptions().style==="unit"}catch{}Gg={degree:{narrow:{default:"\xB0","ja-JP":" \u5EA6","zh-TW":"\u5EA6","sl-SI":" \xB0"}}},wa=class{format(t){let r="";if(!Nl&&this.options.signDisplay!=null?r=Jy(this.numberFormatter,this.options.signDisplay,t):r=this.numberFormatter.format(t),this.options.style==="unit"&&!Qn){var o;let{unit:a,unitDisplay:n="short",locale:s}=this.resolvedOptions();if(!a)return r;let i=(o=Gg[a])===null||o===void 0?void 0:o[n];r+=i[s]||i.default}return r}formatToParts(t){return this.numberFormatter.formatToParts(t)}formatRange(t,r){if(typeof this.numberFormatter.formatRange=="function")return this.numberFormatter.formatRange(t,r);if(r<t)throw new RangeError("End date must be >= start date");return`${this.format(t)} \u2013 ${this.format(r)}`}formatRangeToParts(t,r){if(typeof this.numberFormatter.formatRangeToParts=="function")return this.numberFormatter.formatRangeToParts(t,r);if(r<t)throw new RangeError("End date must be >= start date");let o=this.numberFormatter.formatToParts(t),a=this.numberFormatter.formatToParts(r);return[...o.map(n=>({...n,source:"startRange"})),{type:"literal",value:" \u2013 ",source:"shared"},...a.map(n=>({...n,source:"endRange"}))]}resolvedOptions(){let t=this.numberFormatter.resolvedOptions();return!Nl&&this.options.signDisplay!=null&&(t={...t,signDisplay:this.options.signDisplay}),!Qn&&this.options.style==="unit"&&(t={...t,style:"unit",unit:this.options.unit,unitDisplay:this.options.unitDisplay}),t}constructor(t,r={}){this.numberFormatter=Yy(t,r),this.options=r}}});var Tg=v(()=>{l();c();Lg()});function Dl(e={}){let{locale:t}=$t();return(0,Bg.useMemo)(()=>new wa(t,e),[t,e])}var Bg,Fg=v(()=>{l();c();qn();Tg();Bg=q(H(),1)});var _a=v(()=>{l();c();qn();cg();Fg()});function Me(e,t){return r=>r==="rtl"?t:e}function X(e){if(typeof e=="number")return e+"px";if(e)return t$.test(e)?e:r$.test(e)?e.replace(o$,"var(--spectrum-global-dimension-$&, var(--spectrum-alias-$&))"):`var(--spectrum-global-dimension-${e}, var(--spectrum-alias-${e}))`}function Ag(e,t="default",r=5){return r>5?`var(--spectrum-${e}, var(--spectrum-semantic-${e}-color-${t}))`:`var(--spectrum-legacy-color-${e}, var(--spectrum-global-color-${e}, var(--spectrum-semantic-${e}-color-${t})))`}function a$(e,t=5){if(e)return`var(--spectrum-alias-background-color-${e}, ${Ag(e,"background",t)})`}function At(e,t=5){if(e)return e==="default"?"var(--spectrum-alias-border-color)":`var(--spectrum-alias-border-color-${e}, ${Ag(e,"border",t)})`}function Mt(e){return e&&e!=="none"?`var(--spectrum-alias-border-size-${e})`:"0"}function It(e){if(e)return`var(--spectrum-alias-border-radius-${e})`}function n$(e){return e?"none":void 0}function Ol(e){return e}function s$(e){return typeof e=="boolean"?e?"1":void 0:""+e}function Mg(e,t,r,o){let a={};for(let n in e){let s=t[n];if(!s||e[n]==null)continue;let[i,u]=s;typeof i=="function"&&(i=i(r));let d=Hl(e[n],o),$=u(d,e.colorVersion);if(Array.isArray(i))for(let k of i)a[k]=$;else a[i]=$}for(let n in Rg)a[n]&&(a[Rg[n]]="solid",a.boxSizing="border-box");return a}function wt(e,t=ql,r={}){let{UNSAFE_className:o,UNSAFE_style:a,...n}=e,s=$l(),{direction:i}=$t(),{matchedBreakpoints:u=s?.matchedBreakpoints||["base"]}=r,d=Mg(e,t,i,u),$={...a,...d};n.className&&console.warn("The className prop is unsafe and is unsupported in React Spectrum v3. Please use style props with Spectrum variables, or UNSAFE_className if you absolutely must do something custom. Note that this may break in future versions due to DOM structure changes."),n.style&&console.warn("The style prop is unsafe and is unsupported in React Spectrum v3. Please use style props with Spectrum variables, or UNSAFE_style if you absolutely must do something custom. Note that this may break in future versions due to DOM structure changes.");let k={style:$,className:o};return Hl(e.isHidden,u)&&(k.hidden=!0),{styleProps:k}}function Ae(e){return e}function Hl(e,t){if(e&&typeof e=="object"&&!Array.isArray(e)){for(let r=0;r<t.length;r++){let o=t[r];if(e[o]!=null)return e[o]}return e.base}return e}var ql,e$,Rg,t$,r$,o$,Ig=v(()=>{l();c();zl();_a();ql={margin:["margin",X],marginStart:[Me("marginLeft","marginRight"),X],marginEnd:[Me("marginRight","marginLeft"),X],marginTop:["marginTop",X],marginBottom:["marginBottom",X],marginX:[["marginLeft","marginRight"],X],marginY:[["marginTop","marginBottom"],X],width:["width",X],height:["height",X],minWidth:["minWidth",X],minHeight:["minHeight",X],maxWidth:["maxWidth",X],maxHeight:["maxHeight",X],isHidden:["display",n$],alignSelf:["alignSelf",Ae],justifySelf:["justifySelf",Ae],position:["position",Ol],zIndex:["zIndex",Ol],top:["top",X],bottom:["bottom",X],start:[Me("left","right"),X],end:[Me("right","left"),X],left:["left",X],right:["right",X],order:["order",Ol],flex:["flex",s$],flexGrow:["flexGrow",Ae],flexShrink:["flexShrink",Ae],flexBasis:["flexBasis",Ae],gridArea:["gridArea",Ae],gridColumn:["gridColumn",Ae],gridColumnEnd:["gridColumnEnd",Ae],gridColumnStart:["gridColumnStart",Ae],gridRow:["gridRow",Ae],gridRowEnd:["gridRowEnd",Ae],gridRowStart:["gridRowStart",Ae]},e$={...ql,backgroundColor:["backgroundColor",a$],borderWidth:["borderWidth",Mt],borderStartWidth:[Me("borderLeftWidth","borderRightWidth"),Mt],borderEndWidth:[Me("borderRightWidth","borderLeftWidth"),Mt],borderLeftWidth:["borderLeftWidth",Mt],borderRightWidth:["borderRightWidth",Mt],borderTopWidth:["borderTopWidth",Mt],borderBottomWidth:["borderBottomWidth",Mt],borderXWidth:[["borderLeftWidth","borderRightWidth"],Mt],borderYWidth:[["borderTopWidth","borderBottomWidth"],Mt],borderColor:["borderColor",At],borderStartColor:[Me("borderLeftColor","borderRightColor"),At],borderEndColor:[Me("borderRightColor","borderLeftColor"),At],borderLeftColor:["borderLeftColor",At],borderRightColor:["borderRightColor",At],borderTopColor:["borderTopColor",At],borderBottomColor:["borderBottomColor",At],borderXColor:[["borderLeftColor","borderRightColor"],At],borderYColor:[["borderTopColor","borderBottomColor"],At],borderRadius:["borderRadius",It],borderTopStartRadius:[Me("borderTopLeftRadius","borderTopRightRadius"),It],borderTopEndRadius:[Me("borderTopRightRadius","borderTopLeftRadius"),It],borderBottomStartRadius:[Me("borderBottomLeftRadius","borderBottomRightRadius"),It],borderBottomEndRadius:[Me("borderBottomRightRadius","borderBottomLeftRadius"),It],borderTopLeftRadius:["borderTopLeftRadius",It],borderTopRightRadius:["borderTopRightRadius",It],borderBottomLeftRadius:["borderBottomLeftRadius",It],borderBottomRightRadius:["borderBottomRightRadius",It],padding:["padding",X],paddingStart:[Me("paddingLeft","paddingRight"),X],paddingEnd:[Me("paddingRight","paddingLeft"),X],paddingLeft:["paddingLeft",X],paddingRight:["paddingRight",X],paddingTop:["paddingTop",X],paddingBottom:["paddingBottom",X],paddingX:[["paddingLeft","paddingRight"],X],paddingY:[["paddingTop","paddingBottom"],X],overflow:["overflow",Ae]},Rg={borderWidth:"borderStyle",borderLeftWidth:"borderLeftStyle",borderRightWidth:"borderRightStyle",borderTopWidth:"borderTopStyle",borderBottomWidth:"borderBottomStyle"};t$=/(%|px|em|rem|vw|vh|auto|cm|mm|in|pt|pc|ex|ch|rem|vmin|vmax|fr)$/,r$=/^\s*\w+\(/,o$=/(static-)?size-\d+|single-line-(height|width)/g});function Sa(e,t){let r=e.slot||t,{[r]:o={}}=(0,lr.useContext)(jl)||{};return de(e,de(o,{id:e.id}))}function Ul(e){let t=(0,lr.useContext)(jl)||{},{slots:r={},children:o}=e,a=(0,lr.useMemo)(()=>Object.keys(t).concat(Object.keys(r)).reduce((n,s)=>({...n,[s]:de(t[s]||{},r[s]||{})}),{}),[t,r]);return lr.default.createElement(jl.Provider,{value:a},o)}var lr,jl,Ng=v(()=>{l();c();be();lr=q(H(),1),jl=lr.default.createContext(null)});function Yn(e,t){let[r,o]=(0,Dg.useState)(!0);return it(()=>{o(!!(t.current&&t.current.querySelector(e)))},[o,e,t]),r}var Dg,Og=v(()=>{l();c();be();Dg=q(H(),1)});var ko=v(()=>{l();c();H0();W0();X0();Ig();Ng();Og();zl()});function Kl(e){if(ya()){if(wo==="default"){let t=pe(e);Wl=t.documentElement.style.webkitUserSelect,t.documentElement.style.webkitUserSelect="none"}wo="disabled"}else(e instanceof HTMLElement||e instanceof SVGElement)&&(Jn.set(e,e.style.userSelect),e.style.userSelect="none")}function Ea(e){if(ya()){if(wo!=="disabled")return;wo="restoring",setTimeout(()=>{za(()=>{if(wo==="restoring"){let t=pe(e);t.documentElement.style.webkitUserSelect==="none"&&(t.documentElement.style.webkitUserSelect=Wl||""),Wl="",wo="default"}})},300)}else if((e instanceof HTMLElement||e instanceof SVGElement)&&e&&Jn.has(e)){let t=Jn.get(e);e.style.userSelect==="none"&&(e.style.userSelect=t),e.getAttribute("style")===""&&e.removeAttribute("style"),Jn.delete(e)}}var wo,Wl,Jn,qg=v(()=>{l();c();be();wo="default",Wl="",Jn=new WeakMap});var Hg,Xl,jg=v(()=>{l();c();Hg=q(H(),1),Xl=Hg.default.createContext({register:()=>{}});Xl.displayName="PressResponderContext"});function Ug(e,t){return t.get?t.get.call(e):t.value}var Wg=v(()=>{l();c()});function es(e,t,r){if(!t.has(e))throw new TypeError("attempted to "+r+" private field on non-instance");return t.get(e)}var Zl=v(()=>{l();c()});function Kg(e,t){var r=es(e,t,"get");return Ug(e,r)}var Xg=v(()=>{l();c();Wg();Zl()});function Zg(e,t,r){if(t.set)t.set.call(e,r);else{if(!t.writable)throw new TypeError("attempted to set read only private field");t.value=r}}var Qg=v(()=>{l();c()});function Ql(e,t,r){var o=es(e,t,"set");return Zg(e,o,r),r}var Yg=v(()=>{l();c();Qg();Zl()});function i$(e){let t=(0,_t.useContext)(Xl);if(t){let{register:r,...o}=t;e=de(o,e),r()}return ka(t,e.ref),e}function eu(e){let{onPress:t,onPressChange:r,onPressStart:o,onPressEnd:a,onPressUp:n,isDisabled:s,isPressed:i,preventFocusOnPress:u,shouldCancelOnPointerExit:d,allowTextSelectionOnPress:$,ref:k,...z}=i$(e),[w,V]=(0,_t.useState)(!1),C=(0,_t.useRef)({isPressed:!1,ignoreEmulatedMouseEvents:!1,ignoreClickAfterPress:!1,didFirePressStart:!1,isTriggeringEvent:!1,activePointerId:null,target:null,isOverTarget:!1,pointerType:null}),{addGlobalListener:M,removeAllGlobalListeners:f}=Rl(),m=Bt((p,R)=>{let A=C.current;if(s||A.didFirePressStart)return!1;let L=!0;if(A.isTriggeringEvent=!0,o){let j=new So("pressstart",R,p);o(j),L=j.shouldStopPropagation}return r&&r(!0),A.isTriggeringEvent=!1,A.didFirePressStart=!0,V(!0),L}),g=Bt((p,R,A=!0)=>{let L=C.current;if(!L.didFirePressStart)return!1;L.ignoreClickAfterPress=!0,L.didFirePressStart=!1,L.isTriggeringEvent=!0;let j=!0;if(a){let S=new So("pressend",R,p);a(S),j=S.shouldStopPropagation}if(r&&r(!1),V(!1),t&&A&&!s){let S=new So("press",R,p);t(S),j&&(j=S.shouldStopPropagation)}return L.isTriggeringEvent=!1,j}),_=Bt((p,R)=>{let A=C.current;if(s)return!1;if(n){A.isTriggeringEvent=!0;let L=new So("pressup",R,p);return n(L),A.isTriggeringEvent=!1,L.shouldStopPropagation}return!0}),P=Bt(p=>{let R=C.current;R.isPressed&&R.target&&(R.isOverTarget&&R.pointerType!=null&&g(Nt(R.target,p),R.pointerType,!1),R.isPressed=!1,R.isOverTarget=!1,R.activePointerId=null,R.pointerType=null,f(),$||Ea(R.target))}),T=Bt(p=>{d&&P(p)}),F=(0,_t.useMemo)(()=>{let p=C.current,R={onKeyDown(L){if(Yl(L.nativeEvent,L.currentTarget)&&L.currentTarget.contains(L.target)){var j;th(L.target,L.key)&&L.preventDefault();let S=!0;if(!p.isPressed&&!L.repeat){p.target=L.currentTarget,p.isPressed=!0,S=m(L,"keyboard");let U=L.currentTarget,G=Se=>{Yl(Se,U)&&!Se.repeat&&U.contains(Se.target)&&p.target&&_(Nt(p.target,Se),"keyboard")};M(pe(L.currentTarget),"keyup",xa(G,A),!0)}S&&L.stopPropagation(),L.metaKey&&kt()&&((j=p.metaKeyEvents)===null||j===void 0||j.set(L.key,L.nativeEvent))}else L.key==="Meta"&&(p.metaKeyEvents=new Map)},onClick(L){if(!(L&&!L.currentTarget.contains(L.target))&&L&&L.button===0&&!p.isTriggeringEvent&&!Rt.isOpening){let j=!0;if(s&&L.preventDefault(),!p.ignoreClickAfterPress&&!p.ignoreEmulatedMouseEvents&&!p.isPressed&&(p.pointerType==="virtual"||$o(L.nativeEvent))){!s&&!u&&lt(L.currentTarget);let S=m(L,"virtual"),U=_(L,"virtual"),G=g(L,"virtual");j=S&&U&&G}p.ignoreEmulatedMouseEvents=!1,p.ignoreClickAfterPress=!1,j&&L.stopPropagation()}}},A=L=>{var j;if(p.isPressed&&p.target&&Yl(L,p.target)){var S;th(L.target,L.key)&&L.preventDefault();let G=L.target;g(Nt(p.target,L),"keyboard",p.target.contains(G)),f(),L.key!=="Enter"&&tu(p.target)&&p.target.contains(G)&&!L[Jg]&&(L[Jg]=!0,Rt(p.target,L,!1)),p.isPressed=!1,(S=p.metaKeyEvents)===null||S===void 0||S.delete(L.key)}else if(L.key==="Meta"&&(!((j=p.metaKeyEvents)===null||j===void 0)&&j.size)){var U;let G=p.metaKeyEvents;p.metaKeyEvents=void 0;for(let Se of G.values())(U=p.target)===null||U===void 0||U.dispatchEvent(new KeyboardEvent("keyup",Se))}};if(typeof PointerEvent<"u"){R.onPointerDown=G=>{if(G.button!==0||!G.currentTarget.contains(G.target))return;if(Ml(G.nativeEvent)){p.pointerType="virtual";return}Jl(G.currentTarget)&&G.preventDefault(),p.pointerType=G.pointerType;let Se=!0;p.isPressed||(p.isPressed=!0,p.isOverTarget=!0,p.activePointerId=G.pointerId,p.target=G.currentTarget,!s&&!u&&lt(G.currentTarget),$||Kl(p.target),Se=m(G,p.pointerType),M(pe(G.currentTarget),"pointermove",L,!1),M(pe(G.currentTarget),"pointerup",j,!1),M(pe(G.currentTarget),"pointercancel",U,!1)),Se&&G.stopPropagation()},R.onMouseDown=G=>{G.currentTarget.contains(G.target)&&G.button===0&&(Jl(G.currentTarget)&&G.preventDefault(),G.stopPropagation())},R.onPointerUp=G=>{!G.currentTarget.contains(G.target)||p.pointerType==="virtual"||G.button===0&&_o(G,G.currentTarget)&&_(G,p.pointerType||G.pointerType)};let L=G=>{G.pointerId===p.activePointerId&&(p.target&&_o(G,p.target)?!p.isOverTarget&&p.pointerType!=null&&(p.isOverTarget=!0,m(Nt(p.target,G),p.pointerType)):p.target&&p.isOverTarget&&p.pointerType!=null&&(p.isOverTarget=!1,g(Nt(p.target,G),p.pointerType,!1),T(G)))},j=G=>{G.pointerId===p.activePointerId&&p.isPressed&&G.button===0&&p.target&&(_o(G,p.target)&&p.pointerType!=null?g(Nt(p.target,G),p.pointerType):p.isOverTarget&&p.pointerType!=null&&g(Nt(p.target,G),p.pointerType,!1),p.isPressed=!1,p.isOverTarget=!1,p.activePointerId=null,p.pointerType=null,f(),$||Ea(p.target),"ontouchend"in p.target&&G.pointerType!=="mouse"&&M(p.target,"touchend",S,{once:!0}))},S=G=>{rh(G.currentTarget)&&G.preventDefault()},U=G=>{P(G)};R.onDragStart=G=>{G.currentTarget.contains(G.target)&&P(G)}}else{R.onMouseDown=S=>{if(S.button!==0||!S.currentTarget.contains(S.target))return;if(Jl(S.currentTarget)&&S.preventDefault(),p.ignoreEmulatedMouseEvents){S.stopPropagation();return}p.isPressed=!0,p.isOverTarget=!0,p.target=S.currentTarget,p.pointerType=$o(S.nativeEvent)?"virtual":"mouse",!s&&!u&&lt(S.currentTarget),m(S,p.pointerType)&&S.stopPropagation(),M(pe(S.currentTarget),"mouseup",L,!1)},R.onMouseEnter=S=>{if(!S.currentTarget.contains(S.target))return;let U=!0;p.isPressed&&!p.ignoreEmulatedMouseEvents&&p.pointerType!=null&&(p.isOverTarget=!0,U=m(S,p.pointerType)),U&&S.stopPropagation()},R.onMouseLeave=S=>{if(!S.currentTarget.contains(S.target))return;let U=!0;p.isPressed&&!p.ignoreEmulatedMouseEvents&&p.pointerType!=null&&(p.isOverTarget=!1,U=g(S,p.pointerType,!1),T(S)),U&&S.stopPropagation()},R.onMouseUp=S=>{S.currentTarget.contains(S.target)&&!p.ignoreEmulatedMouseEvents&&S.button===0&&_(S,p.pointerType||"mouse")};let L=S=>{if(S.button===0){if(p.isPressed=!1,f(),p.ignoreEmulatedMouseEvents){p.ignoreEmulatedMouseEvents=!1;return}p.target&&_o(S,p.target)&&p.pointerType!=null?g(Nt(p.target,S),p.pointerType):p.target&&p.isOverTarget&&p.pointerType!=null&&g(Nt(p.target,S),p.pointerType,!1),p.isOverTarget=!1}};R.onTouchStart=S=>{if(!S.currentTarget.contains(S.target))return;let U=c$(S.nativeEvent);if(!U)return;p.activePointerId=U.identifier,p.ignoreEmulatedMouseEvents=!0,p.isOverTarget=!0,p.isPressed=!0,p.target=S.currentTarget,p.pointerType="touch",!s&&!u&&lt(S.currentTarget),$||Kl(p.target),m(ur(p.target,S),p.pointerType)&&S.stopPropagation(),M(je(S.currentTarget),"scroll",j,!0)},R.onTouchMove=S=>{if(!S.currentTarget.contains(S.target))return;if(!p.isPressed){S.stopPropagation();return}let U=eh(S.nativeEvent,p.activePointerId),G=!0;U&&_o(U,S.currentTarget)?!p.isOverTarget&&p.pointerType!=null&&(p.isOverTarget=!0,G=m(ur(p.target,S),p.pointerType)):p.isOverTarget&&p.pointerType!=null&&(p.isOverTarget=!1,G=g(ur(p.target,S),p.pointerType,!1),T(ur(p.target,S))),G&&S.stopPropagation()},R.onTouchEnd=S=>{if(!S.currentTarget.contains(S.target))return;if(!p.isPressed){S.stopPropagation();return}let U=eh(S.nativeEvent,p.activePointerId),G=!0;U&&_o(U,S.currentTarget)&&p.pointerType!=null?(_(ur(p.target,S),p.pointerType),G=g(ur(p.target,S),p.pointerType)):p.isOverTarget&&p.pointerType!=null&&(G=g(ur(p.target,S),p.pointerType,!1)),G&&S.stopPropagation(),p.isPressed=!1,p.activePointerId=null,p.isOverTarget=!1,p.ignoreEmulatedMouseEvents=!0,p.target&&!$&&Ea(p.target),f()},R.onTouchCancel=S=>{S.currentTarget.contains(S.target)&&(S.stopPropagation(),p.isPressed&&P(ur(p.target,S)))};let j=S=>{p.isPressed&&S.target.contains(p.target)&&P({currentTarget:p.target,shiftKey:!1,ctrlKey:!1,metaKey:!1,altKey:!1})};R.onDragStart=S=>{S.currentTarget.contains(S.target)&&P(S)}}return R},[M,s,u,f,$,P,T,g,m,_]);return(0,_t.useEffect)(()=>()=>{var p;$||Ea((p=C.current.target)!==null&&p!==void 0?p:void 0)},[$]),{isPressed:i||w,pressProps:de(z,F)}}function tu(e){return e.tagName==="A"&&e.hasAttribute("href")}function Yl(e,t){let{key:r,code:o}=e,a=t,n=a.getAttribute("role");return(r==="Enter"||r===" "||r==="Spacebar"||o==="Space")&&!(a instanceof je(a).HTMLInputElement&&!oh(a,r)||a instanceof je(a).HTMLTextAreaElement||a.isContentEditable)&&!((n==="link"||!n&&tu(a))&&r!=="Enter")}function c$(e){let{targetTouches:t}=e;return t.length>0?t[0]:null}function eh(e,t){let r=e.changedTouches;for(let o=0;o<r.length;o++){let a=r[o];if(a.identifier===t)return a}return null}function ur(e,t){let r=0,o=0;return t.targetTouches&&t.targetTouches.length===1&&(r=t.targetTouches[0].clientX,o=t.targetTouches[0].clientY),{currentTarget:e,shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,metaKey:t.metaKey,altKey:t.altKey,clientX:r,clientY:o}}function Nt(e,t){let r=t.clientX,o=t.clientY;return{currentTarget:e,shiftKey:t.shiftKey,ctrlKey:t.ctrlKey,metaKey:t.metaKey,altKey:t.altKey,clientX:r,clientY:o}}function l$(e){let t=0,r=0;return e.width!==void 0?t=e.width/2:e.radiusX!==void 0&&(t=e.radiusX),e.height!==void 0?r=e.height/2:e.radiusY!==void 0&&(r=e.radiusY),{top:e.clientY-r,right:e.clientX+t,bottom:e.clientY+r,left:e.clientX-t}}function u$(e,t){return!(e.left>t.right||t.left>e.right||e.top>t.bottom||t.top>e.bottom)}function _o(e,t){let r=t.getBoundingClientRect(),o=l$(e);return u$(r,o)}function Jl(e){return!(e instanceof HTMLElement)||!e.hasAttribute("draggable")}function rh(e){return e instanceof HTMLInputElement?!1:e instanceof HTMLButtonElement?e.type!=="submit"&&e.type!=="reset":!tu(e)}function th(e,t){return e instanceof HTMLInputElement?!oh(e,t):rh(e)}function oh(e,t){return e.type==="checkbox"||e.type==="radio"?t===" ":d$.has(e.type)}var _t,ts,So,Jg,d$,ah=v(()=>{l();c();qg();jg();Xg();mg();Yg();be();_t=q(H(),1);ts=new WeakMap,So=class{continuePropagation(){Ql(this,ts,!1)}get shouldStopPropagation(){return Kg(this,ts)}constructor(t,r,o,a){dg(this,ts,{writable:!0,value:void 0}),Ql(this,ts,!0);var n;let s=(n=a?.target)!==null&&n!==void 0?n:o.currentTarget,i=s?.getBoundingClientRect(),u,d=0,$,k=null;o.clientX!=null&&o.clientY!=null&&($=o.clientX,k=o.clientY),i&&($!=null&&k!=null?(u=$-i.left,d=k-i.top):(u=i.width/2,d=i.height/2)),this.type=t,this.pointerType=r,this.target=o.currentTarget,this.shiftKey=o.shiftKey,this.metaKey=o.metaKey,this.ctrlKey=o.ctrlKey,this.altKey=o.altKey,this.x=u,this.y=d}},Jg=Symbol("linkClicked");d$=new Set(["checkbox","radio","range","color","file","image","button","submit","reset"])});function os(e){let t=(0,rs.useRef)({isFocused:!1,observer:null});it(()=>{let o=t.current;return()=>{o.observer&&(o.observer.disconnect(),o.observer=null)}},[]);let r=Bt(o=>{e?.(o)});return(0,rs.useCallback)(o=>{if(o.target instanceof HTMLButtonElement||o.target instanceof HTMLInputElement||o.target instanceof HTMLTextAreaElement||o.target instanceof HTMLSelectElement){t.current.isFocused=!0;let a=o.target,n=s=>{t.current.isFocused=!1,a.disabled&&r(new ru("blur",s)),t.current.observer&&(t.current.observer.disconnect(),t.current.observer=null)};a.addEventListener("focusout",n,{once:!0}),t.current.observer=new MutationObserver(()=>{if(t.current.isFocused&&a.disabled){var s;(s=t.current.observer)===null||s===void 0||s.disconnect();let i=a===document.activeElement?null:document.activeElement;a.dispatchEvent(new FocusEvent("blur",{relatedTarget:i})),a.dispatchEvent(new FocusEvent("focusout",{bubbles:!0,relatedTarget:i}))}}),t.current.observer.observe(a,{attributes:!0,attributeFilter:["disabled"]})}},[r])}var rs,ru,ou=v(()=>{l();c();rs=q(H(),1);be();ru=class{isDefaultPrevented(){return this.nativeEvent.defaultPrevented}preventDefault(){this.defaultPrevented=!0,this.nativeEvent.preventDefault()}stopPropagation(){this.nativeEvent.stopPropagation(),this.isPropagationStopped=()=>!0}isPropagationStopped(){return!1}persist(){}constructor(t,r){this.nativeEvent=r,this.target=r.target,this.currentTarget=r.currentTarget,this.relatedTarget=r.relatedTarget,this.bubbles=r.bubbles,this.cancelable=r.cancelable,this.defaultPrevented=r.defaultPrevented,this.eventPhase=r.eventPhase,this.isTrusted=r.isTrusted,this.timeStamp=r.timeStamp,this.type=t}}});function Or(e){let{isDisabled:t,onFocus:r,onBlur:o,onFocusChange:a}=e,n=(0,au.useCallback)(u=>{if(u.target===u.currentTarget)return o&&o(u),a&&a(!1),!0},[o,a]),s=os(n),i=(0,au.useCallback)(u=>{let d=pe(u.target);u.target===u.currentTarget&&d.activeElement===u.target&&(r&&r(u),a&&a(!0),s(u))},[a,r,s]);return{focusProps:{onFocus:!t&&(r||a||o)?i:void 0,onBlur:!t&&(o||a)?n:void 0}}}var au,nh=v(()=>{l();c();ou();au=q(H(),1);be()});function lu(e,t){for(let r of nu)r(e,t)}function p$(e){return!(e.metaKey||!kt()&&e.altKey||e.ctrlKey||e.key==="Control"||e.key==="Shift"||e.key==="Meta")}function as(e){qr=!0,p$(e)&&(Eo="keyboard",lu("keyboard",e))}function Je(e){Eo="pointer",(e.type==="mousedown"||e.type==="pointerdown")&&(qr=!0,lu("pointer",e))}function sh(e){$o(e)&&(qr=!0,Eo="virtual")}function ih(e){e.target===window||e.target===document||(!qr&&!su&&(Eo="virtual",lu("virtual",e)),qr=!1,su=!1)}function ch(){qr=!1,su=!0}function iu(e){if(typeof window>"u"||Ca.get(je(e)))return;let t=je(e),r=pe(e),o=t.HTMLElement.prototype.focus;t.HTMLElement.prototype.focus=function(){qr=!0,o.apply(this,arguments)},r.addEventListener("keydown",as,!0),r.addEventListener("keyup",as,!0),r.addEventListener("click",sh,!0),t.addEventListener("focus",ih,!0),t.addEventListener("blur",ch,!1),typeof PointerEvent<"u"?(r.addEventListener("pointerdown",Je,!0),r.addEventListener("pointermove",Je,!0),r.addEventListener("pointerup",Je,!0)):(r.addEventListener("mousedown",Je,!0),r.addEventListener("mousemove",Je,!0),r.addEventListener("mouseup",Je,!0)),t.addEventListener("beforeunload",()=>{lh(e)},{once:!0}),Ca.set(t,{focus:o})}function uh(e){let t=pe(e),r;return t.readyState!=="loading"?iu(e):(r=()=>{iu(e)},t.addEventListener("DOMContentLoaded",r)),()=>lh(e,r)}function ns(){return Eo!=="pointer"}function uu(){return Eo}function g$(e,t,r){var o;let a=typeof window<"u"?je(r?.target).HTMLInputElement:HTMLInputElement,n=typeof window<"u"?je(r?.target).HTMLTextAreaElement:HTMLTextAreaElement,s=typeof window<"u"?je(r?.target).HTMLElement:HTMLElement,i=typeof window<"u"?je(r?.target).KeyboardEvent:KeyboardEvent;return e=e||r?.target instanceof a&&!f$.has(r==null||(o=r.target)===null||o===void 0?void 0:o.type)||r?.target instanceof n||r?.target instanceof s&&r?.target.isContentEditable,!(e&&t==="keyboard"&&r instanceof i&&!m$[r.key])}function du(e,t,r){iu(),(0,cu.useEffect)(()=>{let o=(a,n)=>{g$(!!r?.isTextInput,a,n)&&e(ns())};return nu.add(o),()=>{nu.delete(o)}},t)}var cu,Eo,nu,Ca,qr,su,m$,lh,f$,dh=v(()=>{l();c();be();cu=q(H(),1),Eo=null,nu=new Set,Ca=new Map,qr=!1,su=!1,m$={Tab:!0,Escape:!0};lh=(e,t)=>{let r=je(e),o=pe(e);t&&o.removeEventListener("DOMContentLoaded",t),Ca.has(r)&&(r.HTMLElement.prototype.focus=Ca.get(r).focus,o.removeEventListener("keydown",as,!0),o.removeEventListener("keyup",as,!0),o.removeEventListener("click",sh,!0),r.removeEventListener("focus",ih,!0),r.removeEventListener("blur",ch,!1),typeof PointerEvent<"u"?(o.removeEventListener("pointerdown",Je,!0),o.removeEventListener("pointermove",Je,!0),o.removeEventListener("pointerup",Je,!0)):(o.removeEventListener("mousedown",Je,!0),o.removeEventListener("mousemove",Je,!0),o.removeEventListener("mouseup",Je,!0)),Ca.delete(r))};typeof document<"u"&&uh();f$=new Set(["checkbox","radio","range","color","file","image","button","submit","reset"])});function mu(e){let{isDisabled:t,onBlurWithin:r,onFocusWithin:o,onFocusWithinChange:a}=e,n=(0,Va.useRef)({isFocusWithin:!1}),s=(0,Va.useCallback)(d=>{n.current.isFocusWithin&&!d.currentTarget.contains(d.relatedTarget)&&(n.current.isFocusWithin=!1,r&&r(d),a&&a(!1))},[r,a,n]),i=os(s),u=(0,Va.useCallback)(d=>{!n.current.isFocusWithin&&document.activeElement===d.target&&(o&&o(d),a&&a(!0),n.current.isFocusWithin=!0,i(d))},[o,a,i]);return t?{focusWithinProps:{onFocus:void 0,onBlur:void 0}}:{focusWithinProps:{onFocus:u,onBlur:s}}}var Va,mh=v(()=>{l();c();ou();Va=q(H(),1)});function fu(){ss=!0,setTimeout(()=>{ss=!1},50)}function ph(e){e.pointerType==="touch"&&fu()}function h$(){if(!(typeof document>"u"))return typeof PointerEvent<"u"?document.addEventListener("pointerup",ph):document.addEventListener("touchend",fu),pu++,()=>{pu--,!(pu>0)&&(typeof PointerEvent<"u"?document.removeEventListener("pointerup",ph):document.removeEventListener("touchend",fu))}}function gu(e){let{onHoverStart:t,onHoverChange:r,onHoverEnd:o,isDisabled:a}=e,[n,s]=(0,Dt.useState)(!1),i=(0,Dt.useRef)({isHovered:!1,ignoreEmulatedMouseEvents:!1,pointerType:"",target:null}).current;(0,Dt.useEffect)(h$,[]);let{hoverProps:u,triggerHoverEnd:d}=(0,Dt.useMemo)(()=>{let $=(w,V)=>{if(i.pointerType=V,a||V==="touch"||i.isHovered||!w.currentTarget.contains(w.target))return;i.isHovered=!0;let C=w.currentTarget;i.target=C,t&&t({type:"hoverstart",target:C,pointerType:V}),r&&r(!0),s(!0)},k=(w,V)=>{if(i.pointerType="",i.target=null,V==="touch"||!i.isHovered)return;i.isHovered=!1;let C=w.currentTarget;o&&o({type:"hoverend",target:C,pointerType:V}),r&&r(!1),s(!1)},z={};return typeof PointerEvent<"u"?(z.onPointerEnter=w=>{ss&&w.pointerType==="mouse"||$(w,w.pointerType)},z.onPointerLeave=w=>{!a&&w.currentTarget.contains(w.target)&&k(w,w.pointerType)}):(z.onTouchStart=()=>{i.ignoreEmulatedMouseEvents=!0},z.onMouseEnter=w=>{!i.ignoreEmulatedMouseEvents&&!ss&&$(w,"mouse"),i.ignoreEmulatedMouseEvents=!1},z.onMouseLeave=w=>{!a&&w.currentTarget.contains(w.target)&&k(w,"mouse")}),{hoverProps:z,triggerHoverEnd:k}},[t,r,o,a,i]);return(0,Dt.useEffect)(()=>{a&&d({currentTarget:i.target},i.pointerType)},[a]),{hoverProps:u,isHovered:n}}var Dt,ss,pu,fh=v(()=>{l();c();Dt=q(H(),1),ss=!1,pu=0});function hu(e){if(!e)return;let t=!0;return r=>{let o={...r,preventDefault(){r.preventDefault()},isDefaultPrevented(){return r.isDefaultPrevented()},stopPropagation(){console.error("stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.")},continuePropagation(){t=!1}};e(o),t&&r.stopPropagation()}}var gh=v(()=>{l();c()});function bu(e){return{keyboardProps:e.isDisabled?{}:{onKeyDown:hu(e.onKeyDown),onKeyUp:hu(e.onKeyUp)}}}var hh=v(()=>{l();c();gh()});var Co=v(()=>{l();c();nh();dh();mh();fh();hh();ah()});function bh(e){let t=pe(e);if(uu()==="virtual"){let r=t.activeElement;za(()=>{t.activeElement===r&&e.isConnected&&lt(e)})}else lt(e)}var vh=v(()=>{l();c();be();Co()});function xh(e={}){let{autoFocus:t=!1,isTextInput:r,within:o}=e,a=(0,dr.useRef)({isFocused:!1,isFocusVisible:t||ns()}),[n,s]=(0,dr.useState)(!1),[i,u]=(0,dr.useState)(()=>a.current.isFocused&&a.current.isFocusVisible),d=(0,dr.useCallback)(()=>u(a.current.isFocused&&a.current.isFocusVisible),[]),$=(0,dr.useCallback)(w=>{a.current.isFocused=w,s(w),d()},[d]);du(w=>{a.current.isFocusVisible=w,d()},[],{isTextInput:r});let{focusProps:k}=Or({isDisabled:o,onFocusChange:$}),{focusWithinProps:z}=mu({isDisabled:!o,onFocusWithinChange:$});return{isFocused:n,isFocusVisible:i,focusProps:o?z:k}}var dr,yh=v(()=>{l();c();Co();dr=q(H(),1)});function xu(e){let{children:t,focusClass:r,focusRingClass:o}=e,{isFocused:a,isFocusVisible:n,focusProps:s}=xh(e),i=vu.default.Children.only(t);return vu.default.cloneElement(i,de(i.props,{...s,className:or({[r||""]:a,[o||""]:n})}))}var vu,$h=v(()=>{l();c();yh();pa();be();vu=q(H(),1)});function v$(e){let t=(0,mr.useContext)(b$)||{};ka(t,e);let{ref:r,...o}=t;return o}function yu(e,t){let{focusProps:r}=Or(e),{keyboardProps:o}=bu(e),a=de(r,o),n=v$(t),s=e.isDisabled?{}:n,i=(0,mr.useRef)(e.autoFocus);return(0,mr.useEffect)(()=>{i.current&&t.current&&bh(t.current),i.current=!1},[t]),{focusableProps:de({...a,tabIndex:e.excludeFromTabOrder&&!e.isDisabled?-1:void 0},s)}}var mr,b$,zh=v(()=>{l();c();vh();be();mr=q(H(),1);Co();b$=mr.default.createContext(null)});var $u=v(()=>{l();c();$h();zh()});function zu(e){let{id:t,label:r,"aria-labelledby":o,"aria-label":a,labelElementType:n="label"}=e;t=ct(t);let s=ct(),i={};r?(o=o?`${s} ${o}`:s,i={id:s,htmlFor:n==="label"?t:void 0}):!o&&!a&&console.warn("If you do not provide a visible label, you must specify an aria-label or aria-labelledby attribute for accessibility");let u=Al({id:t,"aria-label":a,"aria-labelledby":o});return{labelProps:i,fieldProps:u}}var kh=v(()=>{l();c();be()});var wh=v(()=>{l();c();kh()});function ku(e){let{value:t=0,minValue:r=0,maxValue:o=100,valueLabel:a,isIndeterminate:n,formatOptions:s={style:"percent"}}=e,i=zt(e,{labelable:!0}),{labelProps:u,fieldProps:d}=zu({...e,labelElementType:"span"});t=zo(t,r,o);let $=(t-r)/(o-r),k=Dl(s);if(!n&&!a){let z=s.style==="percent"?$:t;a=k.format(z)}return{progressBarProps:de(i,{...d,"aria-valuenow":n?void 0:t,"aria-valuemin":r,"aria-valuemax":o,"aria-valuetext":n?void 0:a,role:"progressbar"}),labelProps:u}}var _h=v(()=>{l();c();be();wh();_a()});var Sh=v(()=>{l();c();_h()});var Eh=v(()=>{});function oe(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var W,wu,_u,Su,Eu,Cu,Vu,Pu,Gu,Lu,Tu,Bu,Fu,Ru,Au,Mu,Iu,Nu,is,Du,Ou,qu,Hu,ju,Ch=v(()=>{l();c();W={};oe(W,"focus-ring",()=>wu,e=>wu=e);oe(W,"i18nFontFamily",()=>_u,e=>_u=e);oe(W,"spectrum-CircleLoader",()=>Su,e=>Su=e);oe(W,"spectrum-CircleLoader--indeterminate",()=>Eu,e=>Eu=e);oe(W,"spectrum-CircleLoader--indeterminate-fill-submask-2",()=>Cu,e=>Cu=e);oe(W,"spectrum-CircleLoader--large",()=>Vu,e=>Vu=e);oe(W,"spectrum-CircleLoader--overBackground",()=>Pu,e=>Pu=e);oe(W,"spectrum-CircleLoader--small",()=>Gu,e=>Gu=e);oe(W,"spectrum-CircleLoader--staticBlack",()=>Lu,e=>Lu=e);oe(W,"spectrum-CircleLoader--staticWhite",()=>Tu,e=>Tu=e);oe(W,"spectrum-CircleLoader-fill",()=>Bu,e=>Bu=e);oe(W,"spectrum-CircleLoader-fillMask1",()=>Fu,e=>Fu=e);oe(W,"spectrum-CircleLoader-fillMask2",()=>Ru,e=>Ru=e);oe(W,"spectrum-CircleLoader-fillSubMask1",()=>Au,e=>Au=e);oe(W,"spectrum-CircleLoader-fillSubMask2",()=>Mu,e=>Mu=e);oe(W,"spectrum-CircleLoader-fills",()=>Iu,e=>Iu=e);oe(W,"spectrum-CircleLoader-track",()=>Nu,e=>Nu=e);oe(W,"spectrum-FocusRing-ring",()=>is,e=>is=e);oe(W,"spectrum-FocusRing",()=>Du,e=>Du=e);oe(W,"spectrum-FocusRing--quiet",()=>Ou,e=>Ou=e);oe(W,"spectrum-fill-mask-1",()=>qu,e=>qu=e);oe(W,"spectrum-fill-mask-2",()=>Hu,e=>Hu=e);oe(W,"spectrum-fills-rotate",()=>ju,e=>ju=e);wu="iZc1lq_focus-ring";_u="iZc1lq_i18nFontFamily";Su="iZc1lq_spectrum-CircleLoader";Eu="iZc1lq_spectrum-CircleLoader--indeterminate";Cu="iZc1lq_spectrum-CircleLoader--indeterminate-fill-submask-2";Vu="iZc1lq_spectrum-CircleLoader--large";Pu="iZc1lq_spectrum-CircleLoader--overBackground";Gu="iZc1lq_spectrum-CircleLoader--small";Lu="iZc1lq_spectrum-CircleLoader--staticBlack";Tu="iZc1lq_spectrum-CircleLoader--staticWhite";Bu="iZc1lq_spectrum-CircleLoader-fill";Fu="iZc1lq_spectrum-CircleLoader-fillMask1";Ru="iZc1lq_spectrum-CircleLoader-fillMask2";Au="iZc1lq_spectrum-CircleLoader-fillSubMask1";Mu="iZc1lq_spectrum-CircleLoader-fillSubMask2";Iu="iZc1lq_spectrum-CircleLoader-fills";Nu="iZc1lq_spectrum-CircleLoader-track";is="iZc1lq_spectrum-FocusRing-ring";Du=`iZc1lq_spectrum-FocusRing ${is}`;Ou="iZc1lq_spectrum-FocusRing--quiet";qu="iZc1lq_spectrum-fill-mask-1";Hu="iZc1lq_spectrum-fill-mask-2";ju="iZc1lq_spectrum-fills-rotate"});function Ot(e){return e&&e.__esModule?e.default:e}function x$(e,t){let{value:r=0,minValue:o=0,maxValue:a=100,size:n="M",staticColor:s,variant:i,isIndeterminate:u=!1,"aria-label":d,"aria-labelledby":$,...k}=e,z=Nr(t),{styleProps:w}=wt(k);r=zo(r,o,a);let{progressBarProps:V}=ku({...e,value:r}),C={},M={};if(!u){let f=(r-o)/(a-o)*100,m;f>0&&f<=50?(m=-180+f/50*180,C.transform=`rotate(${m}deg)`,M.transform="rotate(-180deg)"):f>50&&(m=-180+(f-50)/50*180,C.transform="rotate(0deg)",M.transform=`rotate(${m}deg)`)}return!d&&!$&&console.warn("ProgressCircle requires an aria-label or aria-labelledby attribute for accessibility"),ut.default.createElement("div",{...w,...V,ref:z,className:ze(Ot(W),"spectrum-CircleLoader",{"spectrum-CircleLoader--indeterminate":u,"spectrum-CircleLoader--small":n==="S","spectrum-CircleLoader--large":n==="L","spectrum-CircleLoader--overBackground":i==="overBackground","spectrum-CircleLoader--staticWhite":s==="white","spectrum-CircleLoader--staticBlack":s==="black"},w.className)},ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-track")}),ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fills")},ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fillMask1")},ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fillSubMask1"),"data-testid":"fillSubMask1",style:C},ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fill")}))),ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fillMask2")},ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fillSubMask2"),"data-testid":"fillSubMask2",style:M},ut.default.createElement("div",{className:ze(Ot(W),"spectrum-CircleLoader-fill")})))))}var ut,Uu,Vh=v(()=>{l();c();Eh();Ch();be();ko();ut=q(H(),1);Sh();Uu=ut.default.forwardRef(x$)});var Ph=v(()=>{l();c();Vh()});function y$(e,t){e=Sa(e,"text");let{children:r,...o}=e,{styleProps:a}=wt(o),n=Nr(t);return cs.default.createElement("span",{role:"none",...zt(o),...a,ref:n},r)}var cs,Wu,Gh=v(()=>{l();c();be();cs=q(H(),1);ko();Wu=(0,cs.forwardRef)(y$)});var Dh=Ar(Q=>{"use strict";l();c();function Qu(e,t){var r=e.length;e.push(t);e:for(;0<r;){var o=r-1>>>1,a=e[o];if(0<ls(a,t))e[o]=t,e[r]=a,r=o;else break e}}function dt(e){return e.length===0?null:e[0]}function ds(e){if(e.length===0)return null;var t=e[0],r=e.pop();if(r!==t){e[0]=r;e:for(var o=0,a=e.length,n=a>>>1;o<n;){var s=2*(o+1)-1,i=e[s],u=s+1,d=e[u];if(0>ls(i,r))u<a&&0>ls(d,i)?(e[o]=d,e[u]=r,o=u):(e[o]=i,e[s]=r,o=s);else if(u<a&&0>ls(d,r))e[o]=d,e[u]=r,o=u;else break e}}return t}function ls(e,t){var r=e.sortIndex-t.sortIndex;return r!==0?r:e.id-t.id}typeof performance=="object"&&typeof performance.now=="function"?(Lh=performance,Q.unstable_now=function(){return Lh.now()}):(Ku=Date,Th=Ku.now(),Q.unstable_now=function(){return Ku.now()-Th});var Lh,Ku,Th,St=[],pr=[],$$=1,et=null,Ce=3,ms=!1,Hr=!1,Ga=!1,Rh=typeof setTimeout=="function"?setTimeout:null,Ah=typeof clearTimeout=="function"?clearTimeout:null,Bh=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function Yu(e){for(var t=dt(pr);t!==null;){if(t.callback===null)ds(pr);else if(t.startTime<=e)ds(pr),t.sortIndex=t.expirationTime,Qu(St,t);else break;t=dt(pr)}}function Ju(e){if(Ga=!1,Yu(e),!Hr)if(dt(St)!==null)Hr=!0,td(ed);else{var t=dt(pr);t!==null&&rd(Ju,t.startTime-e)}}function ed(e,t){Hr=!1,Ga&&(Ga=!1,Ah(La),La=-1),ms=!0;var r=Ce;try{for(Yu(t),et=dt(St);et!==null&&(!(et.expirationTime>t)||e&&!Nh());){var o=et.callback;if(typeof o=="function"){et.callback=null,Ce=et.priorityLevel;var a=o(et.expirationTime<=t);t=Q.unstable_now(),typeof a=="function"?et.callback=a:et===dt(St)&&ds(St),Yu(t)}else ds(St);et=dt(St)}if(et!==null)var n=!0;else{var s=dt(pr);s!==null&&rd(Ju,s.startTime-t),n=!1}return n}finally{et=null,Ce=r,ms=!1}}var ps=!1,us=null,La=-1,Mh=5,Ih=-1;function Nh(){return!(Q.unstable_now()-Ih<Mh)}function Xu(){if(us!==null){var e=Q.unstable_now();Ih=e;var t=!0;try{t=us(!0,e)}finally{t?Pa():(ps=!1,us=null)}}else ps=!1}var Pa;typeof Bh=="function"?Pa=function(){Bh(Xu)}:typeof MessageChannel<"u"?(Zu=new MessageChannel,Fh=Zu.port2,Zu.port1.onmessage=Xu,Pa=function(){Fh.postMessage(null)}):Pa=function(){Rh(Xu,0)};var Zu,Fh;function td(e){us=e,ps||(ps=!0,Pa())}function rd(e,t){La=Rh(function(){e(Q.unstable_now())},t)}Q.unstable_IdlePriority=5;Q.unstable_ImmediatePriority=1;Q.unstable_LowPriority=4;Q.unstable_NormalPriority=3;Q.unstable_Profiling=null;Q.unstable_UserBlockingPriority=2;Q.unstable_cancelCallback=function(e){e.callback=null};Q.unstable_continueExecution=function(){Hr||ms||(Hr=!0,td(ed))};Q.unstable_forceFrameRate=function(e){0>e||125<e?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):Mh=0<e?Math.floor(1e3/e):5};Q.unstable_getCurrentPriorityLevel=function(){return Ce};Q.unstable_getFirstCallbackNode=function(){return dt(St)};Q.unstable_next=function(e){switch(Ce){case 1:case 2:case 3:var t=3;break;default:t=Ce}var r=Ce;Ce=t;try{return e()}finally{Ce=r}};Q.unstable_pauseExecution=function(){};Q.unstable_requestPaint=function(){};Q.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var r=Ce;Ce=e;try{return t()}finally{Ce=r}};Q.unstable_scheduleCallback=function(e,t,r){var o=Q.unstable_now();switch(typeof r=="object"&&r!==null?(r=r.delay,r=typeof r=="number"&&0<r?o+r:o):r=o,e){case 1:var a=-1;break;case 2:a=250;break;case 5:a=1073741823;break;case 4:a=1e4;break;default:a=5e3}return a=r+a,e={id:$$++,callback:t,priorityLevel:e,startTime:r,expirationTime:a,sortIndex:-1},r>o?(e.sortIndex=r,Qu(pr,e),dt(St)===null&&e===dt(pr)&&(Ga?(Ah(La),La=-1):Ga=!0,rd(Ju,r-o))):(e.sortIndex=a,Qu(St,e),Hr||ms||(Hr=!0,td(ed))),e};Q.unstable_shouldYield=Nh;Q.unstable_wrapCallback=function(e){var t=Ce;return function(){var r=Ce;Ce=t;try{return e.apply(this,arguments)}finally{Ce=r}}}});var qh=Ar((lC,Oh)=>{"use strict";l();c();Oh.exports=Dh()});var W1=Ar(Qe=>{"use strict";l();c();var z$=H(),Xe=qh();function E(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Zb=new Set,en={};function oo(e,t){Xo(e,t),Xo(e+"Capture",t)}function Xo(e,t){for(en[e]=t,e=0;e<t.length;e++)Zb.add(t[e])}var Kt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),_d=Object.prototype.hasOwnProperty,k$=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Hh={},jh={};function w$(e){return _d.call(jh,e)?!0:_d.call(Hh,e)?!1:k$.test(e)?jh[e]=!0:(Hh[e]=!0,!1)}function _$(e,t,r,o){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return o?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function S$(e,t,r,o){if(t===null||typeof t>"u"||_$(e,t,r,o))return!0;if(o)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Re(e,t,r,o,a,n,s){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=o,this.attributeNamespace=a,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=n,this.removeEmptyString=s}var _e={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){_e[e]=new Re(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];_e[t]=new Re(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){_e[e]=new Re(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){_e[e]=new Re(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){_e[e]=new Re(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){_e[e]=new Re(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){_e[e]=new Re(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){_e[e]=new Re(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){_e[e]=new Re(e,5,!1,e.toLowerCase(),null,!1,!1)});var bm=/[\-:]([a-z])/g;function vm(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(bm,vm);_e[t]=new Re(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(bm,vm);_e[t]=new Re(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(bm,vm);_e[t]=new Re(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){_e[e]=new Re(e,1,!1,e.toLowerCase(),null,!1,!1)});_e.xlinkHref=new Re("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){_e[e]=new Re(e,1,!1,e.toLowerCase(),null,!0,!0)});function xm(e,t,r,o){var a=_e.hasOwnProperty(t)?_e[t]:null;(a!==null?a.type!==0:o||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(S$(t,r,a,o)&&(r=null),o||a===null?w$(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):a.mustUseProperty?e[a.propertyName]=r===null?a.type===3?!1:"":r:(t=a.attributeName,o=a.attributeNamespace,r===null?e.removeAttribute(t):(a=a.type,r=a===3||a===4&&r===!0?"":""+r,o?e.setAttributeNS(o,t,r):e.setAttribute(t,r))))}var Yt=z$.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,fs=Symbol.for("react.element"),Go=Symbol.for("react.portal"),Lo=Symbol.for("react.fragment"),ym=Symbol.for("react.strict_mode"),Sd=Symbol.for("react.profiler"),Qb=Symbol.for("react.provider"),Yb=Symbol.for("react.context"),$m=Symbol.for("react.forward_ref"),Ed=Symbol.for("react.suspense"),Cd=Symbol.for("react.suspense_list"),zm=Symbol.for("react.memo"),gr=Symbol.for("react.lazy");Symbol.for("react.scope");Symbol.for("react.debug_trace_mode");var Jb=Symbol.for("react.offscreen");Symbol.for("react.legacy_hidden");Symbol.for("react.cache");Symbol.for("react.tracing_marker");var Uh=Symbol.iterator;function Ta(e){return e===null||typeof e!="object"?null:(e=Uh&&e[Uh]||e["@@iterator"],typeof e=="function"?e:null)}var se=Object.assign,od;function Da(e){if(od===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);od=t&&t[1]||""}return`
`+od+e}var ad=!1;function nd(e,t){if(!e||ad)return"";ad=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(d){var o=d}Reflect.construct(e,[],t)}else{try{t.call()}catch(d){o=d}e.call(t.prototype)}else{try{throw Error()}catch(d){o=d}e()}}catch(d){if(d&&o&&typeof d.stack=="string"){for(var a=d.stack.split(`
`),n=o.stack.split(`
`),s=a.length-1,i=n.length-1;1<=s&&0<=i&&a[s]!==n[i];)i--;for(;1<=s&&0<=i;s--,i--)if(a[s]!==n[i]){if(s!==1||i!==1)do if(s--,i--,0>i||a[s]!==n[i]){var u=`
`+a[s].replace(" at new "," at ");return e.displayName&&u.includes("<anonymous>")&&(u=u.replace("<anonymous>",e.displayName)),u}while(1<=s&&0<=i);break}}}finally{ad=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?Da(e):""}function E$(e){switch(e.tag){case 5:return Da(e.type);case 16:return Da("Lazy");case 13:return Da("Suspense");case 19:return Da("SuspenseList");case 0:case 2:case 15:return e=nd(e.type,!1),e;case 11:return e=nd(e.type.render,!1),e;case 1:return e=nd(e.type,!0),e;default:return""}}function Vd(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case Lo:return"Fragment";case Go:return"Portal";case Sd:return"Profiler";case ym:return"StrictMode";case Ed:return"Suspense";case Cd:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case Yb:return(e.displayName||"Context")+".Consumer";case Qb:return(e._context.displayName||"Context")+".Provider";case $m:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case zm:return t=e.displayName||null,t!==null?t:Vd(e.type)||"Memo";case gr:t=e._payload,e=e._init;try{return Vd(e(t))}catch{}}return null}function C$(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Vd(t);case 8:return t===ym?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Vr(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function ev(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function V$(e){var t=ev(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),o=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var a=r.get,n=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(s){o=""+s,n.call(this,s)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return o},setValue:function(s){o=""+s},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function gs(e){e._valueTracker||(e._valueTracker=V$(e))}function tv(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),o="";return e&&(o=ev(e)?e.checked?"true":"false":e.value),e=o,e!==r?(t.setValue(e),!0):!1}function qs(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function Pd(e,t){var r=t.checked;return se({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function Wh(e,t){var r=t.defaultValue==null?"":t.defaultValue,o=t.checked!=null?t.checked:t.defaultChecked;r=Vr(t.value!=null?t.value:r),e._wrapperState={initialChecked:o,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function rv(e,t){t=t.checked,t!=null&&xm(e,"checked",t,!1)}function Gd(e,t){rv(e,t);var r=Vr(t.value),o=t.type;if(r!=null)o==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(o==="submit"||o==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Ld(e,t.type,r):t.hasOwnProperty("defaultValue")&&Ld(e,t.type,Vr(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function Kh(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var o=t.type;if(!(o!=="submit"&&o!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function Ld(e,t,r){(t!=="number"||qs(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var Oa=Array.isArray;function qo(e,t,r,o){if(e=e.options,t){t={};for(var a=0;a<r.length;a++)t["$"+r[a]]=!0;for(r=0;r<e.length;r++)a=t.hasOwnProperty("$"+e[r].value),e[r].selected!==a&&(e[r].selected=a),a&&o&&(e[r].defaultSelected=!0)}else{for(r=""+Vr(r),t=null,a=0;a<e.length;a++){if(e[a].value===r){e[a].selected=!0,o&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function Td(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(E(91));return se({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function Xh(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(E(92));if(Oa(r)){if(1<r.length)throw Error(E(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Vr(r)}}function ov(e,t){var r=Vr(t.value),o=Vr(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),o!=null&&(e.defaultValue=""+o)}function Zh(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function av(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Bd(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?av(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var hs,nv=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,o,a){MSApp.execUnsafeLocalFunction(function(){return e(t,r,o,a)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(hs=hs||document.createElement("div"),hs.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=hs.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function tn(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var ja={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},P$=["Webkit","ms","Moz","O"];Object.keys(ja).forEach(function(e){P$.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),ja[t]=ja[e]})});function sv(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||ja.hasOwnProperty(e)&&ja[e]?(""+t).trim():t+"px"}function iv(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var o=r.indexOf("--")===0,a=sv(r,t[r],o);r==="float"&&(r="cssFloat"),o?e.setProperty(r,a):e[r]=a}}var G$=se({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Fd(e,t){if(t){if(G$[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(E(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(E(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(E(61))}if(t.style!=null&&typeof t.style!="object")throw Error(E(62))}}function Rd(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ad=null;function km(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Md=null,Ho=null,jo=null;function Qh(e){if(e=yn(e)){if(typeof Md!="function")throw Error(E(280));var t=e.stateNode;t&&(t=bi(t),Md(e.stateNode,e.type,t))}}function cv(e){Ho?jo?jo.push(e):jo=[e]:Ho=e}function lv(){if(Ho){var e=Ho,t=jo;if(jo=Ho=null,Qh(e),t)for(e=0;e<t.length;e++)Qh(t[e])}}function uv(e,t){return e(t)}function dv(){}var sd=!1;function mv(e,t,r){if(sd)return e(t,r);sd=!0;try{return uv(e,t,r)}finally{sd=!1,(Ho!==null||jo!==null)&&(dv(),lv())}}function rn(e,t){var r=e.stateNode;if(r===null)return null;var o=bi(r);if(o===null)return null;r=o[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(e=e.type,o=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!o;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(E(231,t,typeof r));return r}var Id=!1;if(Kt)try{Vo={},Object.defineProperty(Vo,"passive",{get:function(){Id=!0}}),window.addEventListener("test",Vo,Vo),window.removeEventListener("test",Vo,Vo)}catch{Id=!1}var Vo;function L$(e,t,r,o,a,n,s,i,u){var d=Array.prototype.slice.call(arguments,3);try{t.apply(r,d)}catch($){this.onError($)}}var Ua=!1,Hs=null,js=!1,Nd=null,T$={onError:function(e){Ua=!0,Hs=e}};function B$(e,t,r,o,a,n,s,i,u){Ua=!1,Hs=null,L$.apply(T$,arguments)}function F$(e,t,r,o,a,n,s,i,u){if(B$.apply(this,arguments),Ua){if(Ua){var d=Hs;Ua=!1,Hs=null}else throw Error(E(198));js||(js=!0,Nd=d)}}function ao(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function pv(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function Yh(e){if(ao(e)!==e)throw Error(E(188))}function R$(e){var t=e.alternate;if(!t){if(t=ao(e),t===null)throw Error(E(188));return t!==e?null:e}for(var r=e,o=t;;){var a=r.return;if(a===null)break;var n=a.alternate;if(n===null){if(o=a.return,o!==null){r=o;continue}break}if(a.child===n.child){for(n=a.child;n;){if(n===r)return Yh(a),e;if(n===o)return Yh(a),t;n=n.sibling}throw Error(E(188))}if(r.return!==o.return)r=a,o=n;else{for(var s=!1,i=a.child;i;){if(i===r){s=!0,r=a,o=n;break}if(i===o){s=!0,o=a,r=n;break}i=i.sibling}if(!s){for(i=n.child;i;){if(i===r){s=!0,r=n,o=a;break}if(i===o){s=!0,o=n,r=a;break}i=i.sibling}if(!s)throw Error(E(189))}}if(r.alternate!==o)throw Error(E(190))}if(r.tag!==3)throw Error(E(188));return r.stateNode.current===r?e:t}function fv(e){return e=R$(e),e!==null?gv(e):null}function gv(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=gv(e);if(t!==null)return t;e=e.sibling}return null}var hv=Xe.unstable_scheduleCallback,Jh=Xe.unstable_cancelCallback,A$=Xe.unstable_shouldYield,M$=Xe.unstable_requestPaint,le=Xe.unstable_now,I$=Xe.unstable_getCurrentPriorityLevel,wm=Xe.unstable_ImmediatePriority,bv=Xe.unstable_UserBlockingPriority,Us=Xe.unstable_NormalPriority,N$=Xe.unstable_LowPriority,vv=Xe.unstable_IdlePriority,pi=null,Pt=null;function D$(e){if(Pt&&typeof Pt.onCommitFiberRoot=="function")try{Pt.onCommitFiberRoot(pi,e,void 0,(e.current.flags&128)===128)}catch{}}var ht=Math.clz32?Math.clz32:H$,O$=Math.log,q$=Math.LN2;function H$(e){return e>>>=0,e===0?32:31-(O$(e)/q$|0)|0}var bs=64,vs=4194304;function qa(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Ws(e,t){var r=e.pendingLanes;if(r===0)return 0;var o=0,a=e.suspendedLanes,n=e.pingedLanes,s=r&268435455;if(s!==0){var i=s&~a;i!==0?o=qa(i):(n&=s,n!==0&&(o=qa(n)))}else s=r&~a,s!==0?o=qa(s):n!==0&&(o=qa(n));if(o===0)return 0;if(t!==0&&t!==o&&!(t&a)&&(a=o&-o,n=t&-t,a>=n||a===16&&(n&4194240)!==0))return t;if(o&4&&(o|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=o;0<t;)r=31-ht(t),a=1<<r,o|=e[r],t&=~a;return o}function j$(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function U$(e,t){for(var r=e.suspendedLanes,o=e.pingedLanes,a=e.expirationTimes,n=e.pendingLanes;0<n;){var s=31-ht(n),i=1<<s,u=a[s];u===-1?(!(i&r)||i&o)&&(a[s]=j$(i,t)):u<=t&&(e.expiredLanes|=i),n&=~i}}function Dd(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function xv(){var e=bs;return bs<<=1,!(bs&4194240)&&(bs=64),e}function id(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function vn(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-ht(t),e[t]=r}function W$(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var o=e.eventTimes;for(e=e.expirationTimes;0<r;){var a=31-ht(r),n=1<<a;t[a]=0,o[a]=-1,e[a]=-1,r&=~n}}function _m(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var o=31-ht(r),a=1<<o;a&t|e[o]&t&&(e[o]|=t),r&=~a}}var Z=0;function yv(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var $v,Sm,zv,kv,wv,Od=!1,xs=[],$r=null,zr=null,kr=null,on=new Map,an=new Map,br=[],K$="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function eb(e,t){switch(e){case"focusin":case"focusout":$r=null;break;case"dragenter":case"dragleave":zr=null;break;case"mouseover":case"mouseout":kr=null;break;case"pointerover":case"pointerout":on.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":an.delete(t.pointerId)}}function Ba(e,t,r,o,a,n){return e===null||e.nativeEvent!==n?(e={blockedOn:t,domEventName:r,eventSystemFlags:o,nativeEvent:n,targetContainers:[a]},t!==null&&(t=yn(t),t!==null&&Sm(t)),e):(e.eventSystemFlags|=o,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function X$(e,t,r,o,a){switch(t){case"focusin":return $r=Ba($r,e,t,r,o,a),!0;case"dragenter":return zr=Ba(zr,e,t,r,o,a),!0;case"mouseover":return kr=Ba(kr,e,t,r,o,a),!0;case"pointerover":var n=a.pointerId;return on.set(n,Ba(on.get(n)||null,e,t,r,o,a)),!0;case"gotpointercapture":return n=a.pointerId,an.set(n,Ba(an.get(n)||null,e,t,r,o,a)),!0}return!1}function _v(e){var t=Wr(e.target);if(t!==null){var r=ao(t);if(r!==null){if(t=r.tag,t===13){if(t=pv(r),t!==null){e.blockedOn=t,wv(e.priority,function(){zv(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ts(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=qd(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var o=new r.constructor(r.type,r);Ad=o,r.target.dispatchEvent(o),Ad=null}else return t=yn(r),t!==null&&Sm(t),e.blockedOn=r,!1;t.shift()}return!0}function tb(e,t,r){Ts(e)&&r.delete(t)}function Z$(){Od=!1,$r!==null&&Ts($r)&&($r=null),zr!==null&&Ts(zr)&&(zr=null),kr!==null&&Ts(kr)&&(kr=null),on.forEach(tb),an.forEach(tb)}function Fa(e,t){e.blockedOn===t&&(e.blockedOn=null,Od||(Od=!0,Xe.unstable_scheduleCallback(Xe.unstable_NormalPriority,Z$)))}function nn(e){function t(a){return Fa(a,e)}if(0<xs.length){Fa(xs[0],e);for(var r=1;r<xs.length;r++){var o=xs[r];o.blockedOn===e&&(o.blockedOn=null)}}for($r!==null&&Fa($r,e),zr!==null&&Fa(zr,e),kr!==null&&Fa(kr,e),on.forEach(t),an.forEach(t),r=0;r<br.length;r++)o=br[r],o.blockedOn===e&&(o.blockedOn=null);for(;0<br.length&&(r=br[0],r.blockedOn===null);)_v(r),r.blockedOn===null&&br.shift()}var Uo=Yt.ReactCurrentBatchConfig,Ks=!0;function Q$(e,t,r,o){var a=Z,n=Uo.transition;Uo.transition=null;try{Z=1,Em(e,t,r,o)}finally{Z=a,Uo.transition=n}}function Y$(e,t,r,o){var a=Z,n=Uo.transition;Uo.transition=null;try{Z=4,Em(e,t,r,o)}finally{Z=a,Uo.transition=n}}function Em(e,t,r,o){if(Ks){var a=qd(e,t,r,o);if(a===null)fd(e,t,o,Xs,r),eb(e,o);else if(X$(a,e,t,r,o))o.stopPropagation();else if(eb(e,o),t&4&&-1<K$.indexOf(e)){for(;a!==null;){var n=yn(a);if(n!==null&&$v(n),n=qd(e,t,r,o),n===null&&fd(e,t,o,Xs,r),n===a)break;a=n}a!==null&&o.stopPropagation()}else fd(e,t,o,null,r)}}var Xs=null;function qd(e,t,r,o){if(Xs=null,e=km(o),e=Wr(e),e!==null)if(t=ao(e),t===null)e=null;else if(r=t.tag,r===13){if(e=pv(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Xs=e,null}function Sv(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(I$()){case wm:return 1;case bv:return 4;case Us:case N$:return 16;case vv:return 536870912;default:return 16}default:return 16}}var xr=null,Cm=null,Bs=null;function Ev(){if(Bs)return Bs;var e,t=Cm,r=t.length,o,a="value"in xr?xr.value:xr.textContent,n=a.length;for(e=0;e<r&&t[e]===a[e];e++);var s=r-e;for(o=1;o<=s&&t[r-o]===a[n-o];o++);return Bs=a.slice(e,1<o?1-o:void 0)}function Fs(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ys(){return!0}function rb(){return!1}function Ze(e){function t(r,o,a,n,s){this._reactName=r,this._targetInst=a,this.type=o,this.nativeEvent=n,this.target=s,this.currentTarget=null;for(var i in e)e.hasOwnProperty(i)&&(r=e[i],this[i]=r?r(n):n[i]);return this.isDefaultPrevented=(n.defaultPrevented!=null?n.defaultPrevented:n.returnValue===!1)?ys:rb,this.isPropagationStopped=rb,this}return se(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=ys)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=ys)},persist:function(){},isPersistent:ys}),t}var ra={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Vm=Ze(ra),xn=se({},ra,{view:0,detail:0}),J$=Ze(xn),cd,ld,Ra,fi=se({},xn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Pm,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ra&&(Ra&&e.type==="mousemove"?(cd=e.screenX-Ra.screenX,ld=e.screenY-Ra.screenY):ld=cd=0,Ra=e),cd)},movementY:function(e){return"movementY"in e?e.movementY:ld}}),ob=Ze(fi),ez=se({},fi,{dataTransfer:0}),tz=Ze(ez),rz=se({},xn,{relatedTarget:0}),ud=Ze(rz),oz=se({},ra,{animationName:0,elapsedTime:0,pseudoElement:0}),az=Ze(oz),nz=se({},ra,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),sz=Ze(nz),iz=se({},ra,{data:0}),ab=Ze(iz),cz={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},lz={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},uz={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function dz(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=uz[e])?!!t[e]:!1}function Pm(){return dz}var mz=se({},xn,{key:function(e){if(e.key){var t=cz[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Fs(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?lz[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Pm,charCode:function(e){return e.type==="keypress"?Fs(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Fs(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),pz=Ze(mz),fz=se({},fi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),nb=Ze(fz),gz=se({},xn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Pm}),hz=Ze(gz),bz=se({},ra,{propertyName:0,elapsedTime:0,pseudoElement:0}),vz=Ze(bz),xz=se({},fi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),yz=Ze(xz),$z=[9,13,27,32],Gm=Kt&&"CompositionEvent"in window,Wa=null;Kt&&"documentMode"in document&&(Wa=document.documentMode);var zz=Kt&&"TextEvent"in window&&!Wa,Cv=Kt&&(!Gm||Wa&&8<Wa&&11>=Wa),sb=" ",ib=!1;function Vv(e,t){switch(e){case"keyup":return $z.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Pv(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var To=!1;function kz(e,t){switch(e){case"compositionend":return Pv(t);case"keypress":return t.which!==32?null:(ib=!0,sb);case"textInput":return e=t.data,e===sb&&ib?null:e;default:return null}}function wz(e,t){if(To)return e==="compositionend"||!Gm&&Vv(e,t)?(e=Ev(),Bs=Cm=xr=null,To=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Cv&&t.locale!=="ko"?null:t.data;default:return null}}var _z={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function cb(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!_z[e.type]:t==="textarea"}function Gv(e,t,r,o){cv(o),t=Zs(t,"onChange"),0<t.length&&(r=new Vm("onChange","change",null,r,o),e.push({event:r,listeners:t}))}var Ka=null,sn=null;function Sz(e){Ov(e,0)}function gi(e){var t=Ro(e);if(tv(t))return e}function Ez(e,t){if(e==="change")return t}var Lv=!1;Kt&&(Kt?(zs="oninput"in document,zs||(dd=document.createElement("div"),dd.setAttribute("oninput","return;"),zs=typeof dd.oninput=="function"),$s=zs):$s=!1,Lv=$s&&(!document.documentMode||9<document.documentMode));var $s,zs,dd;function lb(){Ka&&(Ka.detachEvent("onpropertychange",Tv),sn=Ka=null)}function Tv(e){if(e.propertyName==="value"&&gi(sn)){var t=[];Gv(t,sn,e,km(e)),mv(Sz,t)}}function Cz(e,t,r){e==="focusin"?(lb(),Ka=t,sn=r,Ka.attachEvent("onpropertychange",Tv)):e==="focusout"&&lb()}function Vz(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return gi(sn)}function Pz(e,t){if(e==="click")return gi(t)}function Gz(e,t){if(e==="input"||e==="change")return gi(t)}function Lz(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var vt=typeof Object.is=="function"?Object.is:Lz;function cn(e,t){if(vt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),o=Object.keys(t);if(r.length!==o.length)return!1;for(o=0;o<r.length;o++){var a=r[o];if(!_d.call(t,a)||!vt(e[a],t[a]))return!1}return!0}function ub(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function db(e,t){var r=ub(e);e=0;for(var o;r;){if(r.nodeType===3){if(o=e+r.textContent.length,e<=t&&o>=t)return{node:r,offset:t-e};e=o}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=ub(r)}}function Bv(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Bv(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Fv(){for(var e=window,t=qs();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=qs(e.document)}return t}function Lm(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function Tz(e){var t=Fv(),r=e.focusedElem,o=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&Bv(r.ownerDocument.documentElement,r)){if(o!==null&&Lm(r)){if(t=o.start,e=o.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var a=r.textContent.length,n=Math.min(o.start,a);o=o.end===void 0?n:Math.min(o.end,a),!e.extend&&n>o&&(a=o,o=n,n=a),a=db(r,n);var s=db(r,o);a&&s&&(e.rangeCount!==1||e.anchorNode!==a.node||e.anchorOffset!==a.offset||e.focusNode!==s.node||e.focusOffset!==s.offset)&&(t=t.createRange(),t.setStart(a.node,a.offset),e.removeAllRanges(),n>o?(e.addRange(t),e.extend(s.node,s.offset)):(t.setEnd(s.node,s.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var Bz=Kt&&"documentMode"in document&&11>=document.documentMode,Bo=null,Hd=null,Xa=null,jd=!1;function mb(e,t,r){var o=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;jd||Bo==null||Bo!==qs(o)||(o=Bo,"selectionStart"in o&&Lm(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),Xa&&cn(Xa,o)||(Xa=o,o=Zs(Hd,"onSelect"),0<o.length&&(t=new Vm("onSelect","select",null,t,r),e.push({event:t,listeners:o}),t.target=Bo)))}function ks(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var Fo={animationend:ks("Animation","AnimationEnd"),animationiteration:ks("Animation","AnimationIteration"),animationstart:ks("Animation","AnimationStart"),transitionend:ks("Transition","TransitionEnd")},md={},Rv={};Kt&&(Rv=document.createElement("div").style,"AnimationEvent"in window||(delete Fo.animationend.animation,delete Fo.animationiteration.animation,delete Fo.animationstart.animation),"TransitionEvent"in window||delete Fo.transitionend.transition);function hi(e){if(md[e])return md[e];if(!Fo[e])return e;var t=Fo[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in Rv)return md[e]=t[r];return e}var Av=hi("animationend"),Mv=hi("animationiteration"),Iv=hi("animationstart"),Nv=hi("transitionend"),Dv=new Map,pb="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Gr(e,t){Dv.set(e,t),oo(t,[e])}for(ws=0;ws<pb.length;ws++)_s=pb[ws],fb=_s.toLowerCase(),gb=_s[0].toUpperCase()+_s.slice(1),Gr(fb,"on"+gb);var _s,fb,gb,ws;Gr(Av,"onAnimationEnd");Gr(Mv,"onAnimationIteration");Gr(Iv,"onAnimationStart");Gr("dblclick","onDoubleClick");Gr("focusin","onFocus");Gr("focusout","onBlur");Gr(Nv,"onTransitionEnd");Xo("onMouseEnter",["mouseout","mouseover"]);Xo("onMouseLeave",["mouseout","mouseover"]);Xo("onPointerEnter",["pointerout","pointerover"]);Xo("onPointerLeave",["pointerout","pointerover"]);oo("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));oo("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));oo("onBeforeInput",["compositionend","keypress","textInput","paste"]);oo("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));oo("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));oo("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Ha="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Fz=new Set("cancel close invalid load scroll toggle".split(" ").concat(Ha));function hb(e,t,r){var o=e.type||"unknown-event";e.currentTarget=r,F$(o,t,void 0,e),e.currentTarget=null}function Ov(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var o=e[r],a=o.event;o=o.listeners;e:{var n=void 0;if(t)for(var s=o.length-1;0<=s;s--){var i=o[s],u=i.instance,d=i.currentTarget;if(i=i.listener,u!==n&&a.isPropagationStopped())break e;hb(a,i,d),n=u}else for(s=0;s<o.length;s++){if(i=o[s],u=i.instance,d=i.currentTarget,i=i.listener,u!==n&&a.isPropagationStopped())break e;hb(a,i,d),n=u}}}if(js)throw e=Nd,js=!1,Nd=null,e}function J(e,t){var r=t[Zd];r===void 0&&(r=t[Zd]=new Set);var o=e+"__bubble";r.has(o)||(qv(t,e,2,!1),r.add(o))}function pd(e,t,r){var o=0;t&&(o|=4),qv(r,e,o,t)}var Ss="_reactListening"+Math.random().toString(36).slice(2);function ln(e){if(!e[Ss]){e[Ss]=!0,Zb.forEach(function(r){r!=="selectionchange"&&(Fz.has(r)||pd(r,!1,e),pd(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ss]||(t[Ss]=!0,pd("selectionchange",!1,t))}}function qv(e,t,r,o){switch(Sv(t)){case 1:var a=Q$;break;case 4:a=Y$;break;default:a=Em}r=a.bind(null,t,r,e),a=void 0,!Id||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),o?a!==void 0?e.addEventListener(t,r,{capture:!0,passive:a}):e.addEventListener(t,r,!0):a!==void 0?e.addEventListener(t,r,{passive:a}):e.addEventListener(t,r,!1)}function fd(e,t,r,o,a){var n=o;if(!(t&1)&&!(t&2)&&o!==null)e:for(;;){if(o===null)return;var s=o.tag;if(s===3||s===4){var i=o.stateNode.containerInfo;if(i===a||i.nodeType===8&&i.parentNode===a)break;if(s===4)for(s=o.return;s!==null;){var u=s.tag;if((u===3||u===4)&&(u=s.stateNode.containerInfo,u===a||u.nodeType===8&&u.parentNode===a))return;s=s.return}for(;i!==null;){if(s=Wr(i),s===null)return;if(u=s.tag,u===5||u===6){o=n=s;continue e}i=i.parentNode}}o=o.return}mv(function(){var d=n,$=km(r),k=[];e:{var z=Dv.get(e);if(z!==void 0){var w=Vm,V=e;switch(e){case"keypress":if(Fs(r)===0)break e;case"keydown":case"keyup":w=pz;break;case"focusin":V="focus",w=ud;break;case"focusout":V="blur",w=ud;break;case"beforeblur":case"afterblur":w=ud;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":w=ob;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":w=tz;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":w=hz;break;case Av:case Mv:case Iv:w=az;break;case Nv:w=vz;break;case"scroll":w=J$;break;case"wheel":w=yz;break;case"copy":case"cut":case"paste":w=sz;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":w=nb}var C=(t&4)!==0,M=!C&&e==="scroll",f=C?z!==null?z+"Capture":null:z;C=[];for(var m=d,g;m!==null;){g=m;var _=g.stateNode;if(g.tag===5&&_!==null&&(g=_,f!==null&&(_=rn(m,f),_!=null&&C.push(un(m,_,g)))),M)break;m=m.return}0<C.length&&(z=new w(z,V,null,r,$),k.push({event:z,listeners:C}))}}if(!(t&7)){e:{if(z=e==="mouseover"||e==="pointerover",w=e==="mouseout"||e==="pointerout",z&&r!==Ad&&(V=r.relatedTarget||r.fromElement)&&(Wr(V)||V[Xt]))break e;if((w||z)&&(z=$.window===$?$:(z=$.ownerDocument)?z.defaultView||z.parentWindow:window,w?(V=r.relatedTarget||r.toElement,w=d,V=V?Wr(V):null,V!==null&&(M=ao(V),V!==M||V.tag!==5&&V.tag!==6)&&(V=null)):(w=null,V=d),w!==V)){if(C=ob,_="onMouseLeave",f="onMouseEnter",m="mouse",(e==="pointerout"||e==="pointerover")&&(C=nb,_="onPointerLeave",f="onPointerEnter",m="pointer"),M=w==null?z:Ro(w),g=V==null?z:Ro(V),z=new C(_,m+"leave",w,r,$),z.target=M,z.relatedTarget=g,_=null,Wr($)===d&&(C=new C(f,m+"enter",V,r,$),C.target=g,C.relatedTarget=M,_=C),M=_,w&&V)t:{for(C=w,f=V,m=0,g=C;g;g=Po(g))m++;for(g=0,_=f;_;_=Po(_))g++;for(;0<m-g;)C=Po(C),m--;for(;0<g-m;)f=Po(f),g--;for(;m--;){if(C===f||f!==null&&C===f.alternate)break t;C=Po(C),f=Po(f)}C=null}else C=null;w!==null&&bb(k,z,w,C,!1),V!==null&&M!==null&&bb(k,M,V,C,!0)}}e:{if(z=d?Ro(d):window,w=z.nodeName&&z.nodeName.toLowerCase(),w==="select"||w==="input"&&z.type==="file")var P=Ez;else if(cb(z))if(Lv)P=Gz;else{P=Vz;var T=Cz}else(w=z.nodeName)&&w.toLowerCase()==="input"&&(z.type==="checkbox"||z.type==="radio")&&(P=Pz);if(P&&(P=P(e,d))){Gv(k,P,r,$);break e}T&&T(e,z,d),e==="focusout"&&(T=z._wrapperState)&&T.controlled&&z.type==="number"&&Ld(z,"number",z.value)}switch(T=d?Ro(d):window,e){case"focusin":(cb(T)||T.contentEditable==="true")&&(Bo=T,Hd=d,Xa=null);break;case"focusout":Xa=Hd=Bo=null;break;case"mousedown":jd=!0;break;case"contextmenu":case"mouseup":case"dragend":jd=!1,mb(k,r,$);break;case"selectionchange":if(Bz)break;case"keydown":case"keyup":mb(k,r,$)}var F;if(Gm)e:{switch(e){case"compositionstart":var p="onCompositionStart";break e;case"compositionend":p="onCompositionEnd";break e;case"compositionupdate":p="onCompositionUpdate";break e}p=void 0}else To?Vv(e,r)&&(p="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&(p="onCompositionStart");p&&(Cv&&r.locale!=="ko"&&(To||p!=="onCompositionStart"?p==="onCompositionEnd"&&To&&(F=Ev()):(xr=$,Cm="value"in xr?xr.value:xr.textContent,To=!0)),T=Zs(d,p),0<T.length&&(p=new ab(p,e,null,r,$),k.push({event:p,listeners:T}),F?p.data=F:(F=Pv(r),F!==null&&(p.data=F)))),(F=zz?kz(e,r):wz(e,r))&&(d=Zs(d,"onBeforeInput"),0<d.length&&($=new ab("onBeforeInput","beforeinput",null,r,$),k.push({event:$,listeners:d}),$.data=F))}Ov(k,t)})}function un(e,t,r){return{instance:e,listener:t,currentTarget:r}}function Zs(e,t){for(var r=t+"Capture",o=[];e!==null;){var a=e,n=a.stateNode;a.tag===5&&n!==null&&(a=n,n=rn(e,r),n!=null&&o.unshift(un(e,n,a)),n=rn(e,t),n!=null&&o.push(un(e,n,a))),e=e.return}return o}function Po(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function bb(e,t,r,o,a){for(var n=t._reactName,s=[];r!==null&&r!==o;){var i=r,u=i.alternate,d=i.stateNode;if(u!==null&&u===o)break;i.tag===5&&d!==null&&(i=d,a?(u=rn(r,n),u!=null&&s.unshift(un(r,u,i))):a||(u=rn(r,n),u!=null&&s.push(un(r,u,i)))),r=r.return}s.length!==0&&e.push({event:t,listeners:s})}var Rz=/\r\n?/g,Az=/\u0000|\uFFFD/g;function vb(e){return(typeof e=="string"?e:""+e).replace(Rz,`
`).replace(Az,"")}function Es(e,t,r){if(t=vb(t),vb(e)!==t&&r)throw Error(E(425))}function Qs(){}var Ud=null,Wd=null;function Kd(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Xd=typeof setTimeout=="function"?setTimeout:void 0,Mz=typeof clearTimeout=="function"?clearTimeout:void 0,xb=typeof Promise=="function"?Promise:void 0,Iz=typeof queueMicrotask=="function"?queueMicrotask:typeof xb<"u"?function(e){return xb.resolve(null).then(e).catch(Nz)}:Xd;function Nz(e){setTimeout(function(){throw e})}function gd(e,t){var r=t,o=0;do{var a=r.nextSibling;if(e.removeChild(r),a&&a.nodeType===8)if(r=a.data,r==="/$"){if(o===0){e.removeChild(a),nn(t);return}o--}else r!=="$"&&r!=="$?"&&r!=="$!"||o++;r=a}while(r);nn(t)}function wr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function yb(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var oa=Math.random().toString(36).slice(2),Vt="__reactFiber$"+oa,dn="__reactProps$"+oa,Xt="__reactContainer$"+oa,Zd="__reactEvents$"+oa,Dz="__reactListeners$"+oa,Oz="__reactHandles$"+oa;function Wr(e){var t=e[Vt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Xt]||r[Vt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=yb(e);e!==null;){if(r=e[Vt])return r;e=yb(e)}return t}e=r,r=e.parentNode}return null}function yn(e){return e=e[Vt]||e[Xt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function Ro(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(E(33))}function bi(e){return e[dn]||null}var Qd=[],Ao=-1;function Lr(e){return{current:e}}function ee(e){0>Ao||(e.current=Qd[Ao],Qd[Ao]=null,Ao--)}function Y(e,t){Ao++,Qd[Ao]=e.current,e.current=t}var Pr={},Le=Lr(Pr),De=Lr(!1),Yr=Pr;function Zo(e,t){var r=e.type.contextTypes;if(!r)return Pr;var o=e.stateNode;if(o&&o.__reactInternalMemoizedUnmaskedChildContext===t)return o.__reactInternalMemoizedMaskedChildContext;var a={},n;for(n in r)a[n]=t[n];return o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=a),a}function Oe(e){return e=e.childContextTypes,e!=null}function Ys(){ee(De),ee(Le)}function $b(e,t,r){if(Le.current!==Pr)throw Error(E(168));Y(Le,t),Y(De,r)}function Hv(e,t,r){var o=e.stateNode;if(t=t.childContextTypes,typeof o.getChildContext!="function")return r;o=o.getChildContext();for(var a in o)if(!(a in t))throw Error(E(108,C$(e)||"Unknown",a));return se({},r,o)}function Js(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Pr,Yr=Le.current,Y(Le,e),Y(De,De.current),!0}function zb(e,t,r){var o=e.stateNode;if(!o)throw Error(E(169));r?(e=Hv(e,t,Yr),o.__reactInternalMemoizedMergedChildContext=e,ee(De),ee(Le),Y(Le,e)):ee(De),Y(De,r)}var Ht=null,vi=!1,hd=!1;function jv(e){Ht===null?Ht=[e]:Ht.push(e)}function qz(e){vi=!0,jv(e)}function Tr(){if(!hd&&Ht!==null){hd=!0;var e=0,t=Z;try{var r=Ht;for(Z=1;e<r.length;e++){var o=r[e];do o=o(!0);while(o!==null)}Ht=null,vi=!1}catch(a){throw Ht!==null&&(Ht=Ht.slice(e+1)),hv(wm,Tr),a}finally{Z=t,hd=!1}}return null}var Mo=[],Io=0,ei=null,ti=0,tt=[],rt=0,Jr=null,jt=1,Ut="";function jr(e,t){Mo[Io++]=ti,Mo[Io++]=ei,ei=e,ti=t}function Uv(e,t,r){tt[rt++]=jt,tt[rt++]=Ut,tt[rt++]=Jr,Jr=e;var o=jt;e=Ut;var a=32-ht(o)-1;o&=~(1<<a),r+=1;var n=32-ht(t)+a;if(30<n){var s=a-a%5;n=(o&(1<<s)-1).toString(32),o>>=s,a-=s,jt=1<<32-ht(t)+a|r<<a|o,Ut=n+e}else jt=1<<n|r<<a|o,Ut=e}function Tm(e){e.return!==null&&(jr(e,1),Uv(e,1,0))}function Bm(e){for(;e===ei;)ei=Mo[--Io],Mo[Io]=null,ti=Mo[--Io],Mo[Io]=null;for(;e===Jr;)Jr=tt[--rt],tt[rt]=null,Ut=tt[--rt],tt[rt]=null,jt=tt[--rt],tt[rt]=null}var Ke=null,We=null,re=!1,gt=null;function Wv(e,t){var r=ot(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function kb(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,Ke=e,We=wr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,Ke=e,We=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=Jr!==null?{id:jt,overflow:Ut}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=ot(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,Ke=e,We=null,!0):!1;default:return!1}}function Yd(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Jd(e){if(re){var t=We;if(t){var r=t;if(!kb(e,t)){if(Yd(e))throw Error(E(418));t=wr(r.nextSibling);var o=Ke;t&&kb(e,t)?Wv(o,r):(e.flags=e.flags&-4097|2,re=!1,Ke=e)}}else{if(Yd(e))throw Error(E(418));e.flags=e.flags&-4097|2,re=!1,Ke=e}}}function wb(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;Ke=e}function Cs(e){if(e!==Ke)return!1;if(!re)return wb(e),re=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Kd(e.type,e.memoizedProps)),t&&(t=We)){if(Yd(e))throw Kv(),Error(E(418));for(;t;)Wv(e,t),t=wr(t.nextSibling)}if(wb(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(E(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){We=wr(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}We=null}}else We=Ke?wr(e.stateNode.nextSibling):null;return!0}function Kv(){for(var e=We;e;)e=wr(e.nextSibling)}function Qo(){We=Ke=null,re=!1}function Fm(e){gt===null?gt=[e]:gt.push(e)}var Hz=Yt.ReactCurrentBatchConfig;function Aa(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(E(309));var o=r.stateNode}if(!o)throw Error(E(147,e));var a=o,n=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===n?t.ref:(t=function(s){var i=a.refs;s===null?delete i[n]:i[n]=s},t._stringRef=n,t)}if(typeof e!="string")throw Error(E(284));if(!r._owner)throw Error(E(290,e))}return e}function Vs(e,t){throw e=Object.prototype.toString.call(t),Error(E(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function _b(e){var t=e._init;return t(e._payload)}function Xv(e){function t(f,m){if(e){var g=f.deletions;g===null?(f.deletions=[m],f.flags|=16):g.push(m)}}function r(f,m){if(!e)return null;for(;m!==null;)t(f,m),m=m.sibling;return null}function o(f,m){for(f=new Map;m!==null;)m.key!==null?f.set(m.key,m):f.set(m.index,m),m=m.sibling;return f}function a(f,m){return f=Cr(f,m),f.index=0,f.sibling=null,f}function n(f,m,g){return f.index=g,e?(g=f.alternate,g!==null?(g=g.index,g<m?(f.flags|=2,m):g):(f.flags|=2,m)):(f.flags|=1048576,m)}function s(f){return e&&f.alternate===null&&(f.flags|=2),f}function i(f,m,g,_){return m===null||m.tag!==6?(m=kd(g,f.mode,_),m.return=f,m):(m=a(m,g),m.return=f,m)}function u(f,m,g,_){var P=g.type;return P===Lo?$(f,m,g.props.children,_,g.key):m!==null&&(m.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===gr&&_b(P)===m.type)?(_=a(m,g.props),_.ref=Aa(f,m,g),_.return=f,_):(_=Os(g.type,g.key,g.props,null,f.mode,_),_.ref=Aa(f,m,g),_.return=f,_)}function d(f,m,g,_){return m===null||m.tag!==4||m.stateNode.containerInfo!==g.containerInfo||m.stateNode.implementation!==g.implementation?(m=wd(g,f.mode,_),m.return=f,m):(m=a(m,g.children||[]),m.return=f,m)}function $(f,m,g,_,P){return m===null||m.tag!==7?(m=Qr(g,f.mode,_,P),m.return=f,m):(m=a(m,g),m.return=f,m)}function k(f,m,g){if(typeof m=="string"&&m!==""||typeof m=="number")return m=kd(""+m,f.mode,g),m.return=f,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case fs:return g=Os(m.type,m.key,m.props,null,f.mode,g),g.ref=Aa(f,null,m),g.return=f,g;case Go:return m=wd(m,f.mode,g),m.return=f,m;case gr:var _=m._init;return k(f,_(m._payload),g)}if(Oa(m)||Ta(m))return m=Qr(m,f.mode,g,null),m.return=f,m;Vs(f,m)}return null}function z(f,m,g,_){var P=m!==null?m.key:null;if(typeof g=="string"&&g!==""||typeof g=="number")return P!==null?null:i(f,m,""+g,_);if(typeof g=="object"&&g!==null){switch(g.$$typeof){case fs:return g.key===P?u(f,m,g,_):null;case Go:return g.key===P?d(f,m,g,_):null;case gr:return P=g._init,z(f,m,P(g._payload),_)}if(Oa(g)||Ta(g))return P!==null?null:$(f,m,g,_,null);Vs(f,g)}return null}function w(f,m,g,_,P){if(typeof _=="string"&&_!==""||typeof _=="number")return f=f.get(g)||null,i(m,f,""+_,P);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case fs:return f=f.get(_.key===null?g:_.key)||null,u(m,f,_,P);case Go:return f=f.get(_.key===null?g:_.key)||null,d(m,f,_,P);case gr:var T=_._init;return w(f,m,g,T(_._payload),P)}if(Oa(_)||Ta(_))return f=f.get(g)||null,$(m,f,_,P,null);Vs(m,_)}return null}function V(f,m,g,_){for(var P=null,T=null,F=m,p=m=0,R=null;F!==null&&p<g.length;p++){F.index>p?(R=F,F=null):R=F.sibling;var A=z(f,F,g[p],_);if(A===null){F===null&&(F=R);break}e&&F&&A.alternate===null&&t(f,F),m=n(A,m,p),T===null?P=A:T.sibling=A,T=A,F=R}if(p===g.length)return r(f,F),re&&jr(f,p),P;if(F===null){for(;p<g.length;p++)F=k(f,g[p],_),F!==null&&(m=n(F,m,p),T===null?P=F:T.sibling=F,T=F);return re&&jr(f,p),P}for(F=o(f,F);p<g.length;p++)R=w(F,f,p,g[p],_),R!==null&&(e&&R.alternate!==null&&F.delete(R.key===null?p:R.key),m=n(R,m,p),T===null?P=R:T.sibling=R,T=R);return e&&F.forEach(function(L){return t(f,L)}),re&&jr(f,p),P}function C(f,m,g,_){var P=Ta(g);if(typeof P!="function")throw Error(E(150));if(g=P.call(g),g==null)throw Error(E(151));for(var T=P=null,F=m,p=m=0,R=null,A=g.next();F!==null&&!A.done;p++,A=g.next()){F.index>p?(R=F,F=null):R=F.sibling;var L=z(f,F,A.value,_);if(L===null){F===null&&(F=R);break}e&&F&&L.alternate===null&&t(f,F),m=n(L,m,p),T===null?P=L:T.sibling=L,T=L,F=R}if(A.done)return r(f,F),re&&jr(f,p),P;if(F===null){for(;!A.done;p++,A=g.next())A=k(f,A.value,_),A!==null&&(m=n(A,m,p),T===null?P=A:T.sibling=A,T=A);return re&&jr(f,p),P}for(F=o(f,F);!A.done;p++,A=g.next())A=w(F,f,p,A.value,_),A!==null&&(e&&A.alternate!==null&&F.delete(A.key===null?p:A.key),m=n(A,m,p),T===null?P=A:T.sibling=A,T=A);return e&&F.forEach(function(j){return t(f,j)}),re&&jr(f,p),P}function M(f,m,g,_){if(typeof g=="object"&&g!==null&&g.type===Lo&&g.key===null&&(g=g.props.children),typeof g=="object"&&g!==null){switch(g.$$typeof){case fs:e:{for(var P=g.key,T=m;T!==null;){if(T.key===P){if(P=g.type,P===Lo){if(T.tag===7){r(f,T.sibling),m=a(T,g.props.children),m.return=f,f=m;break e}}else if(T.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===gr&&_b(P)===T.type){r(f,T.sibling),m=a(T,g.props),m.ref=Aa(f,T,g),m.return=f,f=m;break e}r(f,T);break}else t(f,T);T=T.sibling}g.type===Lo?(m=Qr(g.props.children,f.mode,_,g.key),m.return=f,f=m):(_=Os(g.type,g.key,g.props,null,f.mode,_),_.ref=Aa(f,m,g),_.return=f,f=_)}return s(f);case Go:e:{for(T=g.key;m!==null;){if(m.key===T)if(m.tag===4&&m.stateNode.containerInfo===g.containerInfo&&m.stateNode.implementation===g.implementation){r(f,m.sibling),m=a(m,g.children||[]),m.return=f,f=m;break e}else{r(f,m);break}else t(f,m);m=m.sibling}m=wd(g,f.mode,_),m.return=f,f=m}return s(f);case gr:return T=g._init,M(f,m,T(g._payload),_)}if(Oa(g))return V(f,m,g,_);if(Ta(g))return C(f,m,g,_);Vs(f,g)}return typeof g=="string"&&g!==""||typeof g=="number"?(g=""+g,m!==null&&m.tag===6?(r(f,m.sibling),m=a(m,g),m.return=f,f=m):(r(f,m),m=kd(g,f.mode,_),m.return=f,f=m),s(f)):r(f,m)}return M}var Yo=Xv(!0),Zv=Xv(!1),ri=Lr(null),oi=null,No=null,Rm=null;function Am(){Rm=No=oi=null}function Mm(e){var t=ri.current;ee(ri),e._currentValue=t}function em(e,t,r){for(;e!==null;){var o=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,o!==null&&(o.childLanes|=t)):o!==null&&(o.childLanes&t)!==t&&(o.childLanes|=t),e===r)break;e=e.return}}function Wo(e,t){oi=e,Rm=No=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Ne=!0),e.firstContext=null)}function nt(e){var t=e._currentValue;if(Rm!==e)if(e={context:e,memoizedValue:t,next:null},No===null){if(oi===null)throw Error(E(308));No=e,oi.dependencies={lanes:0,firstContext:e}}else No=No.next=e;return t}var Kr=null;function Im(e){Kr===null?Kr=[e]:Kr.push(e)}function Qv(e,t,r,o){var a=t.interleaved;return a===null?(r.next=r,Im(t)):(r.next=a.next,a.next=r),t.interleaved=r,Zt(e,o)}function Zt(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var hr=!1;function Nm(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function Yv(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Wt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function _r(e,t,r){var o=e.updateQueue;if(o===null)return null;if(o=o.shared,K&2){var a=o.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),o.pending=t,Zt(e,r)}return a=o.interleaved,a===null?(t.next=t,Im(o)):(t.next=a.next,a.next=t),o.interleaved=t,Zt(e,r)}function Rs(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,_m(e,r)}}function Sb(e,t){var r=e.updateQueue,o=e.alternate;if(o!==null&&(o=o.updateQueue,r===o)){var a=null,n=null;if(r=r.firstBaseUpdate,r!==null){do{var s={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};n===null?a=n=s:n=n.next=s,r=r.next}while(r!==null);n===null?a=n=t:n=n.next=t}else a=n=t;r={baseState:o.baseState,firstBaseUpdate:a,lastBaseUpdate:n,shared:o.shared,effects:o.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function ai(e,t,r,o){var a=e.updateQueue;hr=!1;var n=a.firstBaseUpdate,s=a.lastBaseUpdate,i=a.shared.pending;if(i!==null){a.shared.pending=null;var u=i,d=u.next;u.next=null,s===null?n=d:s.next=d,s=u;var $=e.alternate;$!==null&&($=$.updateQueue,i=$.lastBaseUpdate,i!==s&&(i===null?$.firstBaseUpdate=d:i.next=d,$.lastBaseUpdate=u))}if(n!==null){var k=a.baseState;s=0,$=d=u=null,i=n;do{var z=i.lane,w=i.eventTime;if((o&z)===z){$!==null&&($=$.next={eventTime:w,lane:0,tag:i.tag,payload:i.payload,callback:i.callback,next:null});e:{var V=e,C=i;switch(z=t,w=r,C.tag){case 1:if(V=C.payload,typeof V=="function"){k=V.call(w,k,z);break e}k=V;break e;case 3:V.flags=V.flags&-65537|128;case 0:if(V=C.payload,z=typeof V=="function"?V.call(w,k,z):V,z==null)break e;k=se({},k,z);break e;case 2:hr=!0}}i.callback!==null&&i.lane!==0&&(e.flags|=64,z=a.effects,z===null?a.effects=[i]:z.push(i))}else w={eventTime:w,lane:z,tag:i.tag,payload:i.payload,callback:i.callback,next:null},$===null?(d=$=w,u=k):$=$.next=w,s|=z;if(i=i.next,i===null){if(i=a.shared.pending,i===null)break;z=i,i=z.next,z.next=null,a.lastBaseUpdate=z,a.shared.pending=null}}while(!0);if($===null&&(u=k),a.baseState=u,a.firstBaseUpdate=d,a.lastBaseUpdate=$,t=a.shared.interleaved,t!==null){a=t;do s|=a.lane,a=a.next;while(a!==t)}else n===null&&(a.shared.lanes=0);to|=s,e.lanes=s,e.memoizedState=k}}function Eb(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var o=e[t],a=o.callback;if(a!==null){if(o.callback=null,o=r,typeof a!="function")throw Error(E(191,a));a.call(o)}}}var $n={},Gt=Lr($n),mn=Lr($n),pn=Lr($n);function Xr(e){if(e===$n)throw Error(E(174));return e}function Dm(e,t){switch(Y(pn,t),Y(mn,e),Y(Gt,$n),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Bd(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Bd(t,e)}ee(Gt),Y(Gt,t)}function Jo(){ee(Gt),ee(mn),ee(pn)}function Jv(e){Xr(pn.current);var t=Xr(Gt.current),r=Bd(t,e.type);t!==r&&(Y(mn,e),Y(Gt,r))}function Om(e){mn.current===e&&(ee(Gt),ee(mn))}var ae=Lr(0);function ni(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var bd=[];function qm(){for(var e=0;e<bd.length;e++)bd[e]._workInProgressVersionPrimary=null;bd.length=0}var As=Yt.ReactCurrentDispatcher,vd=Yt.ReactCurrentBatchConfig,eo=0,ne=null,fe=null,ve=null,si=!1,Za=!1,fn=0,jz=0;function Ve(){throw Error(E(321))}function Hm(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!vt(e[r],t[r]))return!1;return!0}function jm(e,t,r,o,a,n){if(eo=n,ne=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,As.current=e===null||e.memoizedState===null?Xz:Zz,e=r(o,a),Za){n=0;do{if(Za=!1,fn=0,25<=n)throw Error(E(301));n+=1,ve=fe=null,t.updateQueue=null,As.current=Qz,e=r(o,a)}while(Za)}if(As.current=ii,t=fe!==null&&fe.next!==null,eo=0,ve=fe=ne=null,si=!1,t)throw Error(E(300));return e}function Um(){var e=fn!==0;return fn=0,e}function Ct(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return ve===null?ne.memoizedState=ve=e:ve=ve.next=e,ve}function st(){if(fe===null){var e=ne.alternate;e=e!==null?e.memoizedState:null}else e=fe.next;var t=ve===null?ne.memoizedState:ve.next;if(t!==null)ve=t,fe=e;else{if(e===null)throw Error(E(310));fe=e,e={memoizedState:fe.memoizedState,baseState:fe.baseState,baseQueue:fe.baseQueue,queue:fe.queue,next:null},ve===null?ne.memoizedState=ve=e:ve=ve.next=e}return ve}function gn(e,t){return typeof t=="function"?t(e):t}function xd(e){var t=st(),r=t.queue;if(r===null)throw Error(E(311));r.lastRenderedReducer=e;var o=fe,a=o.baseQueue,n=r.pending;if(n!==null){if(a!==null){var s=a.next;a.next=n.next,n.next=s}o.baseQueue=a=n,r.pending=null}if(a!==null){n=a.next,o=o.baseState;var i=s=null,u=null,d=n;do{var $=d.lane;if((eo&$)===$)u!==null&&(u=u.next={lane:0,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null}),o=d.hasEagerState?d.eagerState:e(o,d.action);else{var k={lane:$,action:d.action,hasEagerState:d.hasEagerState,eagerState:d.eagerState,next:null};u===null?(i=u=k,s=o):u=u.next=k,ne.lanes|=$,to|=$}d=d.next}while(d!==null&&d!==n);u===null?s=o:u.next=i,vt(o,t.memoizedState)||(Ne=!0),t.memoizedState=o,t.baseState=s,t.baseQueue=u,r.lastRenderedState=o}if(e=r.interleaved,e!==null){a=e;do n=a.lane,ne.lanes|=n,to|=n,a=a.next;while(a!==e)}else a===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function yd(e){var t=st(),r=t.queue;if(r===null)throw Error(E(311));r.lastRenderedReducer=e;var o=r.dispatch,a=r.pending,n=t.memoizedState;if(a!==null){r.pending=null;var s=a=a.next;do n=e(n,s.action),s=s.next;while(s!==a);vt(n,t.memoizedState)||(Ne=!0),t.memoizedState=n,t.baseQueue===null&&(t.baseState=n),r.lastRenderedState=n}return[n,o]}function e1(){}function t1(e,t){var r=ne,o=st(),a=t(),n=!vt(o.memoizedState,a);if(n&&(o.memoizedState=a,Ne=!0),o=o.queue,Wm(a1.bind(null,r,o,e),[e]),o.getSnapshot!==t||n||ve!==null&&ve.memoizedState.tag&1){if(r.flags|=2048,hn(9,o1.bind(null,r,o,a,t),void 0,null),xe===null)throw Error(E(349));eo&30||r1(r,t,a)}return a}function r1(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=ne.updateQueue,t===null?(t={lastEffect:null,stores:null},ne.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function o1(e,t,r,o){t.value=r,t.getSnapshot=o,n1(t)&&s1(e)}function a1(e,t,r){return r(function(){n1(t)&&s1(e)})}function n1(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!vt(e,r)}catch{return!0}}function s1(e){var t=Zt(e,1);t!==null&&bt(t,e,1,-1)}function Cb(e){var t=Ct();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:gn,lastRenderedState:e},t.queue=e,e=e.dispatch=Kz.bind(null,ne,e),[t.memoizedState,e]}function hn(e,t,r,o){return e={tag:e,create:t,destroy:r,deps:o,next:null},t=ne.updateQueue,t===null?(t={lastEffect:null,stores:null},ne.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(o=r.next,r.next=e,e.next=o,t.lastEffect=e)),e}function i1(){return st().memoizedState}function Ms(e,t,r,o){var a=Ct();ne.flags|=e,a.memoizedState=hn(1|t,r,void 0,o===void 0?null:o)}function xi(e,t,r,o){var a=st();o=o===void 0?null:o;var n=void 0;if(fe!==null){var s=fe.memoizedState;if(n=s.destroy,o!==null&&Hm(o,s.deps)){a.memoizedState=hn(t,r,n,o);return}}ne.flags|=e,a.memoizedState=hn(1|t,r,n,o)}function Vb(e,t){return Ms(8390656,8,e,t)}function Wm(e,t){return xi(2048,8,e,t)}function c1(e,t){return xi(4,2,e,t)}function l1(e,t){return xi(4,4,e,t)}function u1(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function d1(e,t,r){return r=r!=null?r.concat([e]):null,xi(4,4,u1.bind(null,t,e),r)}function Km(){}function m1(e,t){var r=st();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&Hm(t,o[1])?o[0]:(r.memoizedState=[e,t],e)}function p1(e,t){var r=st();t=t===void 0?null:t;var o=r.memoizedState;return o!==null&&t!==null&&Hm(t,o[1])?o[0]:(e=e(),r.memoizedState=[e,t],e)}function f1(e,t,r){return eo&21?(vt(r,t)||(r=xv(),ne.lanes|=r,to|=r,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Ne=!0),e.memoizedState=r)}function Uz(e,t){var r=Z;Z=r!==0&&4>r?r:4,e(!0);var o=vd.transition;vd.transition={};try{e(!1),t()}finally{Z=r,vd.transition=o}}function g1(){return st().memoizedState}function Wz(e,t,r){var o=Er(e);if(r={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null},h1(e))b1(t,r);else if(r=Qv(e,t,r,o),r!==null){var a=Fe();bt(r,e,o,a),v1(r,t,o)}}function Kz(e,t,r){var o=Er(e),a={lane:o,action:r,hasEagerState:!1,eagerState:null,next:null};if(h1(e))b1(t,a);else{var n=e.alternate;if(e.lanes===0&&(n===null||n.lanes===0)&&(n=t.lastRenderedReducer,n!==null))try{var s=t.lastRenderedState,i=n(s,r);if(a.hasEagerState=!0,a.eagerState=i,vt(i,s)){var u=t.interleaved;u===null?(a.next=a,Im(t)):(a.next=u.next,u.next=a),t.interleaved=a;return}}catch{}finally{}r=Qv(e,t,a,o),r!==null&&(a=Fe(),bt(r,e,o,a),v1(r,t,o))}}function h1(e){var t=e.alternate;return e===ne||t!==null&&t===ne}function b1(e,t){Za=si=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function v1(e,t,r){if(r&4194240){var o=t.lanes;o&=e.pendingLanes,r|=o,t.lanes=r,_m(e,r)}}var ii={readContext:nt,useCallback:Ve,useContext:Ve,useEffect:Ve,useImperativeHandle:Ve,useInsertionEffect:Ve,useLayoutEffect:Ve,useMemo:Ve,useReducer:Ve,useRef:Ve,useState:Ve,useDebugValue:Ve,useDeferredValue:Ve,useTransition:Ve,useMutableSource:Ve,useSyncExternalStore:Ve,useId:Ve,unstable_isNewReconciler:!1},Xz={readContext:nt,useCallback:function(e,t){return Ct().memoizedState=[e,t===void 0?null:t],e},useContext:nt,useEffect:Vb,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Ms(4194308,4,u1.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Ms(4194308,4,e,t)},useInsertionEffect:function(e,t){return Ms(4,2,e,t)},useMemo:function(e,t){var r=Ct();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var o=Ct();return t=r!==void 0?r(t):t,o.memoizedState=o.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},o.queue=e,e=e.dispatch=Wz.bind(null,ne,e),[o.memoizedState,e]},useRef:function(e){var t=Ct();return e={current:e},t.memoizedState=e},useState:Cb,useDebugValue:Km,useDeferredValue:function(e){return Ct().memoizedState=e},useTransition:function(){var e=Cb(!1),t=e[0];return e=Uz.bind(null,e[1]),Ct().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var o=ne,a=Ct();if(re){if(r===void 0)throw Error(E(407));r=r()}else{if(r=t(),xe===null)throw Error(E(349));eo&30||r1(o,t,r)}a.memoizedState=r;var n={value:r,getSnapshot:t};return a.queue=n,Vb(a1.bind(null,o,n,e),[e]),o.flags|=2048,hn(9,o1.bind(null,o,n,r,t),void 0,null),r},useId:function(){var e=Ct(),t=xe.identifierPrefix;if(re){var r=Ut,o=jt;r=(o&~(1<<32-ht(o)-1)).toString(32)+r,t=":"+t+"R"+r,r=fn++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=jz++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Zz={readContext:nt,useCallback:m1,useContext:nt,useEffect:Wm,useImperativeHandle:d1,useInsertionEffect:c1,useLayoutEffect:l1,useMemo:p1,useReducer:xd,useRef:i1,useState:function(){return xd(gn)},useDebugValue:Km,useDeferredValue:function(e){var t=st();return f1(t,fe.memoizedState,e)},useTransition:function(){var e=xd(gn)[0],t=st().memoizedState;return[e,t]},useMutableSource:e1,useSyncExternalStore:t1,useId:g1,unstable_isNewReconciler:!1},Qz={readContext:nt,useCallback:m1,useContext:nt,useEffect:Wm,useImperativeHandle:d1,useInsertionEffect:c1,useLayoutEffect:l1,useMemo:p1,useReducer:yd,useRef:i1,useState:function(){return yd(gn)},useDebugValue:Km,useDeferredValue:function(e){var t=st();return fe===null?t.memoizedState=e:f1(t,fe.memoizedState,e)},useTransition:function(){var e=yd(gn)[0],t=st().memoizedState;return[e,t]},useMutableSource:e1,useSyncExternalStore:t1,useId:g1,unstable_isNewReconciler:!1};function pt(e,t){if(e&&e.defaultProps){t=se({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function tm(e,t,r,o){t=e.memoizedState,r=r(o,t),r=r==null?t:se({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var yi={isMounted:function(e){return(e=e._reactInternals)?ao(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var o=Fe(),a=Er(e),n=Wt(o,a);n.payload=t,r!=null&&(n.callback=r),t=_r(e,n,a),t!==null&&(bt(t,e,a,o),Rs(t,e,a))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var o=Fe(),a=Er(e),n=Wt(o,a);n.tag=1,n.payload=t,r!=null&&(n.callback=r),t=_r(e,n,a),t!==null&&(bt(t,e,a,o),Rs(t,e,a))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=Fe(),o=Er(e),a=Wt(r,o);a.tag=2,t!=null&&(a.callback=t),t=_r(e,a,o),t!==null&&(bt(t,e,o,r),Rs(t,e,o))}};function Pb(e,t,r,o,a,n,s){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(o,n,s):t.prototype&&t.prototype.isPureReactComponent?!cn(r,o)||!cn(a,n):!0}function x1(e,t,r){var o=!1,a=Pr,n=t.contextType;return typeof n=="object"&&n!==null?n=nt(n):(a=Oe(t)?Yr:Le.current,o=t.contextTypes,n=(o=o!=null)?Zo(e,a):Pr),t=new t(r,n),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=yi,e.stateNode=t,t._reactInternals=e,o&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=a,e.__reactInternalMemoizedMaskedChildContext=n),t}function Gb(e,t,r,o){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,o),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,o),t.state!==e&&yi.enqueueReplaceState(t,t.state,null)}function rm(e,t,r,o){var a=e.stateNode;a.props=r,a.state=e.memoizedState,a.refs={},Nm(e);var n=t.contextType;typeof n=="object"&&n!==null?a.context=nt(n):(n=Oe(t)?Yr:Le.current,a.context=Zo(e,n)),a.state=e.memoizedState,n=t.getDerivedStateFromProps,typeof n=="function"&&(tm(e,t,n,r),a.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof a.getSnapshotBeforeUpdate=="function"||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(t=a.state,typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount(),t!==a.state&&yi.enqueueReplaceState(a,a.state,null),ai(e,r,a,o),a.state=e.memoizedState),typeof a.componentDidMount=="function"&&(e.flags|=4194308)}function ea(e,t){try{var r="",o=t;do r+=E$(o),o=o.return;while(o);var a=r}catch(n){a=`
Error generating stack: `+n.message+`
`+n.stack}return{value:e,source:t,stack:a,digest:null}}function $d(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function om(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var Yz=typeof WeakMap=="function"?WeakMap:Map;function y1(e,t,r){r=Wt(-1,r),r.tag=3,r.payload={element:null};var o=t.value;return r.callback=function(){li||(li=!0,pm=o),om(e,t)},r}function $1(e,t,r){r=Wt(-1,r),r.tag=3;var o=e.type.getDerivedStateFromError;if(typeof o=="function"){var a=t.value;r.payload=function(){return o(a)},r.callback=function(){om(e,t)}}var n=e.stateNode;return n!==null&&typeof n.componentDidCatch=="function"&&(r.callback=function(){om(e,t),typeof o!="function"&&(Sr===null?Sr=new Set([this]):Sr.add(this));var s=t.stack;this.componentDidCatch(t.value,{componentStack:s!==null?s:""})}),r}function Lb(e,t,r){var o=e.pingCache;if(o===null){o=e.pingCache=new Yz;var a=new Set;o.set(t,a)}else a=o.get(t),a===void 0&&(a=new Set,o.set(t,a));a.has(r)||(a.add(r),e=m2.bind(null,e,t,r),t.then(e,e))}function Tb(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Bb(e,t,r,o,a){return e.mode&1?(e.flags|=65536,e.lanes=a,e):(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Wt(-1,1),t.tag=2,_r(r,t,1))),r.lanes|=1),e)}var Jz=Yt.ReactCurrentOwner,Ne=!1;function Be(e,t,r,o){t.child=e===null?Zv(t,null,r,o):Yo(t,e.child,r,o)}function Fb(e,t,r,o,a){r=r.render;var n=t.ref;return Wo(t,a),o=jm(e,t,r,o,n,a),r=Um(),e!==null&&!Ne?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a,Qt(e,t,a)):(re&&r&&Tm(t),t.flags|=1,Be(e,t,o,a),t.child)}function Rb(e,t,r,o,a){if(e===null){var n=r.type;return typeof n=="function"&&!rp(n)&&n.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=n,z1(e,t,n,o,a)):(e=Os(r.type,null,o,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(n=e.child,!(e.lanes&a)){var s=n.memoizedProps;if(r=r.compare,r=r!==null?r:cn,r(s,o)&&e.ref===t.ref)return Qt(e,t,a)}return t.flags|=1,e=Cr(n,o),e.ref=t.ref,e.return=t,t.child=e}function z1(e,t,r,o,a){if(e!==null){var n=e.memoizedProps;if(cn(n,o)&&e.ref===t.ref)if(Ne=!1,t.pendingProps=o=n,(e.lanes&a)!==0)e.flags&131072&&(Ne=!0);else return t.lanes=e.lanes,Qt(e,t,a)}return am(e,t,r,o,a)}function k1(e,t,r){var o=t.pendingProps,a=o.children,n=e!==null?e.memoizedState:null;if(o.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},Y(Oo,Ue),Ue|=r;else{if(!(r&1073741824))return e=n!==null?n.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,Y(Oo,Ue),Ue|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},o=n!==null?n.baseLanes:r,Y(Oo,Ue),Ue|=o}else n!==null?(o=n.baseLanes|r,t.memoizedState=null):o=r,Y(Oo,Ue),Ue|=o;return Be(e,t,a,r),t.child}function w1(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function am(e,t,r,o,a){var n=Oe(r)?Yr:Le.current;return n=Zo(t,n),Wo(t,a),r=jm(e,t,r,o,n,a),o=Um(),e!==null&&!Ne?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~a,Qt(e,t,a)):(re&&o&&Tm(t),t.flags|=1,Be(e,t,r,a),t.child)}function Ab(e,t,r,o,a){if(Oe(r)){var n=!0;Js(t)}else n=!1;if(Wo(t,a),t.stateNode===null)Is(e,t),x1(t,r,o),rm(t,r,o,a),o=!0;else if(e===null){var s=t.stateNode,i=t.memoizedProps;s.props=i;var u=s.context,d=r.contextType;typeof d=="object"&&d!==null?d=nt(d):(d=Oe(r)?Yr:Le.current,d=Zo(t,d));var $=r.getDerivedStateFromProps,k=typeof $=="function"||typeof s.getSnapshotBeforeUpdate=="function";k||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==o||u!==d)&&Gb(t,s,o,d),hr=!1;var z=t.memoizedState;s.state=z,ai(t,o,s,a),u=t.memoizedState,i!==o||z!==u||De.current||hr?(typeof $=="function"&&(tm(t,r,$,o),u=t.memoizedState),(i=hr||Pb(t,r,i,o,z,u,d))?(k||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=o,t.memoizedState=u),s.props=o,s.state=u,s.context=d,o=i):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),o=!1)}else{s=t.stateNode,Yv(e,t),i=t.memoizedProps,d=t.type===t.elementType?i:pt(t.type,i),s.props=d,k=t.pendingProps,z=s.context,u=r.contextType,typeof u=="object"&&u!==null?u=nt(u):(u=Oe(r)?Yr:Le.current,u=Zo(t,u));var w=r.getDerivedStateFromProps;($=typeof w=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(i!==k||z!==u)&&Gb(t,s,o,u),hr=!1,z=t.memoizedState,s.state=z,ai(t,o,s,a);var V=t.memoizedState;i!==k||z!==V||De.current||hr?(typeof w=="function"&&(tm(t,r,w,o),V=t.memoizedState),(d=hr||Pb(t,r,d,o,z,V,u)||!1)?($||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(o,V,u),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(o,V,u)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&z===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&z===e.memoizedState||(t.flags|=1024),t.memoizedProps=o,t.memoizedState=V),s.props=o,s.state=V,s.context=u,o=d):(typeof s.componentDidUpdate!="function"||i===e.memoizedProps&&z===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||i===e.memoizedProps&&z===e.memoizedState||(t.flags|=1024),o=!1)}return nm(e,t,r,o,n,a)}function nm(e,t,r,o,a,n){w1(e,t);var s=(t.flags&128)!==0;if(!o&&!s)return a&&zb(t,r,!1),Qt(e,t,n);o=t.stateNode,Jz.current=t;var i=s&&typeof r.getDerivedStateFromError!="function"?null:o.render();return t.flags|=1,e!==null&&s?(t.child=Yo(t,e.child,null,n),t.child=Yo(t,null,i,n)):Be(e,t,i,n),t.memoizedState=o.state,a&&zb(t,r,!0),t.child}function _1(e){var t=e.stateNode;t.pendingContext?$b(e,t.pendingContext,t.pendingContext!==t.context):t.context&&$b(e,t.context,!1),Dm(e,t.containerInfo)}function Mb(e,t,r,o,a){return Qo(),Fm(a),t.flags|=256,Be(e,t,r,o),t.child}var sm={dehydrated:null,treeContext:null,retryLane:0};function im(e){return{baseLanes:e,cachePool:null,transitions:null}}function S1(e,t,r){var o=t.pendingProps,a=ae.current,n=!1,s=(t.flags&128)!==0,i;if((i=s)||(i=e!==null&&e.memoizedState===null?!1:(a&2)!==0),i?(n=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(a|=1),Y(ae,a&1),e===null)return Jd(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(s=o.children,e=o.fallback,n?(o=t.mode,n=t.child,s={mode:"hidden",children:s},!(o&1)&&n!==null?(n.childLanes=0,n.pendingProps=s):n=ki(s,o,0,null),e=Qr(e,o,r,null),n.return=t,e.return=t,n.sibling=e,t.child=n,t.child.memoizedState=im(r),t.memoizedState=sm,e):Xm(t,s));if(a=e.memoizedState,a!==null&&(i=a.dehydrated,i!==null))return e2(e,t,s,o,i,a,r);if(n){n=o.fallback,s=t.mode,a=e.child,i=a.sibling;var u={mode:"hidden",children:o.children};return!(s&1)&&t.child!==a?(o=t.child,o.childLanes=0,o.pendingProps=u,t.deletions=null):(o=Cr(a,u),o.subtreeFlags=a.subtreeFlags&14680064),i!==null?n=Cr(i,n):(n=Qr(n,s,r,null),n.flags|=2),n.return=t,o.return=t,o.sibling=n,t.child=o,o=n,n=t.child,s=e.child.memoizedState,s=s===null?im(r):{baseLanes:s.baseLanes|r,cachePool:null,transitions:s.transitions},n.memoizedState=s,n.childLanes=e.childLanes&~r,t.memoizedState=sm,o}return n=e.child,e=n.sibling,o=Cr(n,{mode:"visible",children:o.children}),!(t.mode&1)&&(o.lanes=r),o.return=t,o.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=o,t.memoizedState=null,o}function Xm(e,t){return t=ki({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function Ps(e,t,r,o){return o!==null&&Fm(o),Yo(t,e.child,null,r),e=Xm(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function e2(e,t,r,o,a,n,s){if(r)return t.flags&256?(t.flags&=-257,o=$d(Error(E(422))),Ps(e,t,s,o)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(n=o.fallback,a=t.mode,o=ki({mode:"visible",children:o.children},a,0,null),n=Qr(n,a,s,null),n.flags|=2,o.return=t,n.return=t,o.sibling=n,t.child=o,t.mode&1&&Yo(t,e.child,null,s),t.child.memoizedState=im(s),t.memoizedState=sm,n);if(!(t.mode&1))return Ps(e,t,s,null);if(a.data==="$!"){if(o=a.nextSibling&&a.nextSibling.dataset,o)var i=o.dgst;return o=i,n=Error(E(419)),o=$d(n,o,void 0),Ps(e,t,s,o)}if(i=(s&e.childLanes)!==0,Ne||i){if(o=xe,o!==null){switch(s&-s){case 4:a=2;break;case 16:a=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:a=32;break;case 536870912:a=268435456;break;default:a=0}a=a&(o.suspendedLanes|s)?0:a,a!==0&&a!==n.retryLane&&(n.retryLane=a,Zt(e,a),bt(o,e,a,-1))}return tp(),o=$d(Error(E(421))),Ps(e,t,s,o)}return a.data==="$?"?(t.flags|=128,t.child=e.child,t=p2.bind(null,e),a._reactRetry=t,null):(e=n.treeContext,We=wr(a.nextSibling),Ke=t,re=!0,gt=null,e!==null&&(tt[rt++]=jt,tt[rt++]=Ut,tt[rt++]=Jr,jt=e.id,Ut=e.overflow,Jr=t),t=Xm(t,o.children),t.flags|=4096,t)}function Ib(e,t,r){e.lanes|=t;var o=e.alternate;o!==null&&(o.lanes|=t),em(e.return,t,r)}function zd(e,t,r,o,a){var n=e.memoizedState;n===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:o,tail:r,tailMode:a}:(n.isBackwards=t,n.rendering=null,n.renderingStartTime=0,n.last=o,n.tail=r,n.tailMode=a)}function E1(e,t,r){var o=t.pendingProps,a=o.revealOrder,n=o.tail;if(Be(e,t,o.children,r),o=ae.current,o&2)o=o&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ib(e,r,t);else if(e.tag===19)Ib(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}o&=1}if(Y(ae,o),!(t.mode&1))t.memoizedState=null;else switch(a){case"forwards":for(r=t.child,a=null;r!==null;)e=r.alternate,e!==null&&ni(e)===null&&(a=r),r=r.sibling;r=a,r===null?(a=t.child,t.child=null):(a=r.sibling,r.sibling=null),zd(t,!1,a,r,n);break;case"backwards":for(r=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&ni(e)===null){t.child=a;break}e=a.sibling,a.sibling=r,r=a,a=e}zd(t,!0,r,null,n);break;case"together":zd(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Is(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function Qt(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),to|=t.lanes,!(r&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(E(153));if(t.child!==null){for(e=t.child,r=Cr(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=Cr(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function t2(e,t,r){switch(t.tag){case 3:_1(t),Qo();break;case 5:Jv(t);break;case 1:Oe(t.type)&&Js(t);break;case 4:Dm(t,t.stateNode.containerInfo);break;case 10:var o=t.type._context,a=t.memoizedProps.value;Y(ri,o._currentValue),o._currentValue=a;break;case 13:if(o=t.memoizedState,o!==null)return o.dehydrated!==null?(Y(ae,ae.current&1),t.flags|=128,null):r&t.child.childLanes?S1(e,t,r):(Y(ae,ae.current&1),e=Qt(e,t,r),e!==null?e.sibling:null);Y(ae,ae.current&1);break;case 19:if(o=(r&t.childLanes)!==0,e.flags&128){if(o)return E1(e,t,r);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),Y(ae,ae.current),o)break;return null;case 22:case 23:return t.lanes=0,k1(e,t,r)}return Qt(e,t,r)}var C1,cm,V1,P1;C1=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}};cm=function(){};V1=function(e,t,r,o){var a=e.memoizedProps;if(a!==o){e=t.stateNode,Xr(Gt.current);var n=null;switch(r){case"input":a=Pd(e,a),o=Pd(e,o),n=[];break;case"select":a=se({},a,{value:void 0}),o=se({},o,{value:void 0}),n=[];break;case"textarea":a=Td(e,a),o=Td(e,o),n=[];break;default:typeof a.onClick!="function"&&typeof o.onClick=="function"&&(e.onclick=Qs)}Fd(r,o);var s;r=null;for(d in a)if(!o.hasOwnProperty(d)&&a.hasOwnProperty(d)&&a[d]!=null)if(d==="style"){var i=a[d];for(s in i)i.hasOwnProperty(s)&&(r||(r={}),r[s]="")}else d!=="dangerouslySetInnerHTML"&&d!=="children"&&d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&d!=="autoFocus"&&(en.hasOwnProperty(d)?n||(n=[]):(n=n||[]).push(d,null));for(d in o){var u=o[d];if(i=a?.[d],o.hasOwnProperty(d)&&u!==i&&(u!=null||i!=null))if(d==="style")if(i){for(s in i)!i.hasOwnProperty(s)||u&&u.hasOwnProperty(s)||(r||(r={}),r[s]="");for(s in u)u.hasOwnProperty(s)&&i[s]!==u[s]&&(r||(r={}),r[s]=u[s])}else r||(n||(n=[]),n.push(d,r)),r=u;else d==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,i=i?i.__html:void 0,u!=null&&i!==u&&(n=n||[]).push(d,u)):d==="children"?typeof u!="string"&&typeof u!="number"||(n=n||[]).push(d,""+u):d!=="suppressContentEditableWarning"&&d!=="suppressHydrationWarning"&&(en.hasOwnProperty(d)?(u!=null&&d==="onScroll"&&J("scroll",e),n||i===u||(n=[])):(n=n||[]).push(d,u))}r&&(n=n||[]).push("style",r);var d=n;(t.updateQueue=d)&&(t.flags|=4)}};P1=function(e,t,r,o){r!==o&&(t.flags|=4)};function Ma(e,t){if(!re)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var o=null;r!==null;)r.alternate!==null&&(o=r),r=r.sibling;o===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:o.sibling=null}}function Pe(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,o=0;if(t)for(var a=e.child;a!==null;)r|=a.lanes|a.childLanes,o|=a.subtreeFlags&14680064,o|=a.flags&14680064,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)r|=a.lanes|a.childLanes,o|=a.subtreeFlags,o|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=o,e.childLanes=r,t}function r2(e,t,r){var o=t.pendingProps;switch(Bm(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Pe(t),null;case 1:return Oe(t.type)&&Ys(),Pe(t),null;case 3:return o=t.stateNode,Jo(),ee(De),ee(Le),qm(),o.pendingContext&&(o.context=o.pendingContext,o.pendingContext=null),(e===null||e.child===null)&&(Cs(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,gt!==null&&(hm(gt),gt=null))),cm(e,t),Pe(t),null;case 5:Om(t);var a=Xr(pn.current);if(r=t.type,e!==null&&t.stateNode!=null)V1(e,t,r,o,a),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!o){if(t.stateNode===null)throw Error(E(166));return Pe(t),null}if(e=Xr(Gt.current),Cs(t)){o=t.stateNode,r=t.type;var n=t.memoizedProps;switch(o[Vt]=t,o[dn]=n,e=(t.mode&1)!==0,r){case"dialog":J("cancel",o),J("close",o);break;case"iframe":case"object":case"embed":J("load",o);break;case"video":case"audio":for(a=0;a<Ha.length;a++)J(Ha[a],o);break;case"source":J("error",o);break;case"img":case"image":case"link":J("error",o),J("load",o);break;case"details":J("toggle",o);break;case"input":Wh(o,n),J("invalid",o);break;case"select":o._wrapperState={wasMultiple:!!n.multiple},J("invalid",o);break;case"textarea":Xh(o,n),J("invalid",o)}Fd(r,n),a=null;for(var s in n)if(n.hasOwnProperty(s)){var i=n[s];s==="children"?typeof i=="string"?o.textContent!==i&&(n.suppressHydrationWarning!==!0&&Es(o.textContent,i,e),a=["children",i]):typeof i=="number"&&o.textContent!==""+i&&(n.suppressHydrationWarning!==!0&&Es(o.textContent,i,e),a=["children",""+i]):en.hasOwnProperty(s)&&i!=null&&s==="onScroll"&&J("scroll",o)}switch(r){case"input":gs(o),Kh(o,n,!0);break;case"textarea":gs(o),Zh(o);break;case"select":case"option":break;default:typeof n.onClick=="function"&&(o.onclick=Qs)}o=a,t.updateQueue=o,o!==null&&(t.flags|=4)}else{s=a.nodeType===9?a:a.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=av(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=s.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof o.is=="string"?e=s.createElement(r,{is:o.is}):(e=s.createElement(r),r==="select"&&(s=e,o.multiple?s.multiple=!0:o.size&&(s.size=o.size))):e=s.createElementNS(e,r),e[Vt]=t,e[dn]=o,C1(e,t,!1,!1),t.stateNode=e;e:{switch(s=Rd(r,o),r){case"dialog":J("cancel",e),J("close",e),a=o;break;case"iframe":case"object":case"embed":J("load",e),a=o;break;case"video":case"audio":for(a=0;a<Ha.length;a++)J(Ha[a],e);a=o;break;case"source":J("error",e),a=o;break;case"img":case"image":case"link":J("error",e),J("load",e),a=o;break;case"details":J("toggle",e),a=o;break;case"input":Wh(e,o),a=Pd(e,o),J("invalid",e);break;case"option":a=o;break;case"select":e._wrapperState={wasMultiple:!!o.multiple},a=se({},o,{value:void 0}),J("invalid",e);break;case"textarea":Xh(e,o),a=Td(e,o),J("invalid",e);break;default:a=o}Fd(r,a),i=a;for(n in i)if(i.hasOwnProperty(n)){var u=i[n];n==="style"?iv(e,u):n==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&nv(e,u)):n==="children"?typeof u=="string"?(r!=="textarea"||u!=="")&&tn(e,u):typeof u=="number"&&tn(e,""+u):n!=="suppressContentEditableWarning"&&n!=="suppressHydrationWarning"&&n!=="autoFocus"&&(en.hasOwnProperty(n)?u!=null&&n==="onScroll"&&J("scroll",e):u!=null&&xm(e,n,u,s))}switch(r){case"input":gs(e),Kh(e,o,!1);break;case"textarea":gs(e),Zh(e);break;case"option":o.value!=null&&e.setAttribute("value",""+Vr(o.value));break;case"select":e.multiple=!!o.multiple,n=o.value,n!=null?qo(e,!!o.multiple,n,!1):o.defaultValue!=null&&qo(e,!!o.multiple,o.defaultValue,!0);break;default:typeof a.onClick=="function"&&(e.onclick=Qs)}switch(r){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}}o&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return Pe(t),null;case 6:if(e&&t.stateNode!=null)P1(e,t,e.memoizedProps,o);else{if(typeof o!="string"&&t.stateNode===null)throw Error(E(166));if(r=Xr(pn.current),Xr(Gt.current),Cs(t)){if(o=t.stateNode,r=t.memoizedProps,o[Vt]=t,(n=o.nodeValue!==r)&&(e=Ke,e!==null))switch(e.tag){case 3:Es(o.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&Es(o.nodeValue,r,(e.mode&1)!==0)}n&&(t.flags|=4)}else o=(r.nodeType===9?r:r.ownerDocument).createTextNode(o),o[Vt]=t,t.stateNode=o}return Pe(t),null;case 13:if(ee(ae),o=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(re&&We!==null&&t.mode&1&&!(t.flags&128))Kv(),Qo(),t.flags|=98560,n=!1;else if(n=Cs(t),o!==null&&o.dehydrated!==null){if(e===null){if(!n)throw Error(E(318));if(n=t.memoizedState,n=n!==null?n.dehydrated:null,!n)throw Error(E(317));n[Vt]=t}else Qo(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Pe(t),n=!1}else gt!==null&&(hm(gt),gt=null),n=!0;if(!n)return t.flags&65536?t:null}return t.flags&128?(t.lanes=r,t):(o=o!==null,o!==(e!==null&&e.memoizedState!==null)&&o&&(t.child.flags|=8192,t.mode&1&&(e===null||ae.current&1?ge===0&&(ge=3):tp())),t.updateQueue!==null&&(t.flags|=4),Pe(t),null);case 4:return Jo(),cm(e,t),e===null&&ln(t.stateNode.containerInfo),Pe(t),null;case 10:return Mm(t.type._context),Pe(t),null;case 17:return Oe(t.type)&&Ys(),Pe(t),null;case 19:if(ee(ae),n=t.memoizedState,n===null)return Pe(t),null;if(o=(t.flags&128)!==0,s=n.rendering,s===null)if(o)Ma(n,!1);else{if(ge!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(s=ni(e),s!==null){for(t.flags|=128,Ma(n,!1),o=s.updateQueue,o!==null&&(t.updateQueue=o,t.flags|=4),t.subtreeFlags=0,o=r,r=t.child;r!==null;)n=r,e=o,n.flags&=14680066,s=n.alternate,s===null?(n.childLanes=0,n.lanes=e,n.child=null,n.subtreeFlags=0,n.memoizedProps=null,n.memoizedState=null,n.updateQueue=null,n.dependencies=null,n.stateNode=null):(n.childLanes=s.childLanes,n.lanes=s.lanes,n.child=s.child,n.subtreeFlags=0,n.deletions=null,n.memoizedProps=s.memoizedProps,n.memoizedState=s.memoizedState,n.updateQueue=s.updateQueue,n.type=s.type,e=s.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return Y(ae,ae.current&1|2),t.child}e=e.sibling}n.tail!==null&&le()>ta&&(t.flags|=128,o=!0,Ma(n,!1),t.lanes=4194304)}else{if(!o)if(e=ni(s),e!==null){if(t.flags|=128,o=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Ma(n,!0),n.tail===null&&n.tailMode==="hidden"&&!s.alternate&&!re)return Pe(t),null}else 2*le()-n.renderingStartTime>ta&&r!==1073741824&&(t.flags|=128,o=!0,Ma(n,!1),t.lanes=4194304);n.isBackwards?(s.sibling=t.child,t.child=s):(r=n.last,r!==null?r.sibling=s:t.child=s,n.last=s)}return n.tail!==null?(t=n.tail,n.rendering=t,n.tail=t.sibling,n.renderingStartTime=le(),t.sibling=null,r=ae.current,Y(ae,o?r&1|2:r&1),t):(Pe(t),null);case 22:case 23:return ep(),o=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==o&&(t.flags|=8192),o&&t.mode&1?Ue&1073741824&&(Pe(t),t.subtreeFlags&6&&(t.flags|=8192)):Pe(t),null;case 24:return null;case 25:return null}throw Error(E(156,t.tag))}function o2(e,t){switch(Bm(t),t.tag){case 1:return Oe(t.type)&&Ys(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return Jo(),ee(De),ee(Le),qm(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return Om(t),null;case 13:if(ee(ae),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(E(340));Qo()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ee(ae),null;case 4:return Jo(),null;case 10:return Mm(t.type._context),null;case 22:case 23:return ep(),null;case 24:return null;default:return null}}var Gs=!1,Ge=!1,a2=typeof WeakSet=="function"?WeakSet:Set,B=null;function Do(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(o){ce(e,t,o)}else r.current=null}function lm(e,t,r){try{r()}catch(o){ce(e,t,o)}}var Nb=!1;function n2(e,t){if(Ud=Ks,e=Fv(),Lm(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var o=r.getSelection&&r.getSelection();if(o&&o.rangeCount!==0){r=o.anchorNode;var a=o.anchorOffset,n=o.focusNode;o=o.focusOffset;try{r.nodeType,n.nodeType}catch{r=null;break e}var s=0,i=-1,u=-1,d=0,$=0,k=e,z=null;t:for(;;){for(var w;k!==r||a!==0&&k.nodeType!==3||(i=s+a),k!==n||o!==0&&k.nodeType!==3||(u=s+o),k.nodeType===3&&(s+=k.nodeValue.length),(w=k.firstChild)!==null;)z=k,k=w;for(;;){if(k===e)break t;if(z===r&&++d===a&&(i=s),z===n&&++$===o&&(u=s),(w=k.nextSibling)!==null)break;k=z,z=k.parentNode}k=w}r=i===-1||u===-1?null:{start:i,end:u}}else r=null}r=r||{start:0,end:0}}else r=null;for(Wd={focusedElem:e,selectionRange:r},Ks=!1,B=t;B!==null;)if(t=B,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,B=e;else for(;B!==null;){t=B;try{var V=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(V!==null){var C=V.memoizedProps,M=V.memoizedState,f=t.stateNode,m=f.getSnapshotBeforeUpdate(t.elementType===t.type?C:pt(t.type,C),M);f.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var g=t.stateNode.containerInfo;g.nodeType===1?g.textContent="":g.nodeType===9&&g.documentElement&&g.removeChild(g.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(E(163))}}catch(_){ce(t,t.return,_)}if(e=t.sibling,e!==null){e.return=t.return,B=e;break}B=t.return}return V=Nb,Nb=!1,V}function Qa(e,t,r){var o=t.updateQueue;if(o=o!==null?o.lastEffect:null,o!==null){var a=o=o.next;do{if((a.tag&e)===e){var n=a.destroy;a.destroy=void 0,n!==void 0&&lm(t,r,n)}a=a.next}while(a!==o)}}function $i(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var o=r.create;r.destroy=o()}r=r.next}while(r!==t)}}function um(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function G1(e){var t=e.alternate;t!==null&&(e.alternate=null,G1(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Vt],delete t[dn],delete t[Zd],delete t[Dz],delete t[Oz])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function L1(e){return e.tag===5||e.tag===3||e.tag===4}function Db(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||L1(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function dm(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=Qs));else if(o!==4&&(e=e.child,e!==null))for(dm(e,t,r),e=e.sibling;e!==null;)dm(e,t,r),e=e.sibling}function mm(e,t,r){var o=e.tag;if(o===5||o===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(o!==4&&(e=e.child,e!==null))for(mm(e,t,r),e=e.sibling;e!==null;)mm(e,t,r),e=e.sibling}var ke=null,ft=!1;function fr(e,t,r){for(r=r.child;r!==null;)T1(e,t,r),r=r.sibling}function T1(e,t,r){if(Pt&&typeof Pt.onCommitFiberUnmount=="function")try{Pt.onCommitFiberUnmount(pi,r)}catch{}switch(r.tag){case 5:Ge||Do(r,t);case 6:var o=ke,a=ft;ke=null,fr(e,t,r),ke=o,ft=a,ke!==null&&(ft?(e=ke,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):ke.removeChild(r.stateNode));break;case 18:ke!==null&&(ft?(e=ke,r=r.stateNode,e.nodeType===8?gd(e.parentNode,r):e.nodeType===1&&gd(e,r),nn(e)):gd(ke,r.stateNode));break;case 4:o=ke,a=ft,ke=r.stateNode.containerInfo,ft=!0,fr(e,t,r),ke=o,ft=a;break;case 0:case 11:case 14:case 15:if(!Ge&&(o=r.updateQueue,o!==null&&(o=o.lastEffect,o!==null))){a=o=o.next;do{var n=a,s=n.destroy;n=n.tag,s!==void 0&&(n&2||n&4)&&lm(r,t,s),a=a.next}while(a!==o)}fr(e,t,r);break;case 1:if(!Ge&&(Do(r,t),o=r.stateNode,typeof o.componentWillUnmount=="function"))try{o.props=r.memoizedProps,o.state=r.memoizedState,o.componentWillUnmount()}catch(i){ce(r,t,i)}fr(e,t,r);break;case 21:fr(e,t,r);break;case 22:r.mode&1?(Ge=(o=Ge)||r.memoizedState!==null,fr(e,t,r),Ge=o):fr(e,t,r);break;default:fr(e,t,r)}}function Ob(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new a2),t.forEach(function(o){var a=f2.bind(null,e,o);r.has(o)||(r.add(o),o.then(a,a))})}}function mt(e,t){var r=t.deletions;if(r!==null)for(var o=0;o<r.length;o++){var a=r[o];try{var n=e,s=t,i=s;e:for(;i!==null;){switch(i.tag){case 5:ke=i.stateNode,ft=!1;break e;case 3:ke=i.stateNode.containerInfo,ft=!0;break e;case 4:ke=i.stateNode.containerInfo,ft=!0;break e}i=i.return}if(ke===null)throw Error(E(160));T1(n,s,a),ke=null,ft=!1;var u=a.alternate;u!==null&&(u.return=null),a.return=null}catch(d){ce(a,t,d)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)B1(t,e),t=t.sibling}function B1(e,t){var r=e.alternate,o=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(mt(t,e),Et(e),o&4){try{Qa(3,e,e.return),$i(3,e)}catch(C){ce(e,e.return,C)}try{Qa(5,e,e.return)}catch(C){ce(e,e.return,C)}}break;case 1:mt(t,e),Et(e),o&512&&r!==null&&Do(r,r.return);break;case 5:if(mt(t,e),Et(e),o&512&&r!==null&&Do(r,r.return),e.flags&32){var a=e.stateNode;try{tn(a,"")}catch(C){ce(e,e.return,C)}}if(o&4&&(a=e.stateNode,a!=null)){var n=e.memoizedProps,s=r!==null?r.memoizedProps:n,i=e.type,u=e.updateQueue;if(e.updateQueue=null,u!==null)try{i==="input"&&n.type==="radio"&&n.name!=null&&rv(a,n),Rd(i,s);var d=Rd(i,n);for(s=0;s<u.length;s+=2){var $=u[s],k=u[s+1];$==="style"?iv(a,k):$==="dangerouslySetInnerHTML"?nv(a,k):$==="children"?tn(a,k):xm(a,$,k,d)}switch(i){case"input":Gd(a,n);break;case"textarea":ov(a,n);break;case"select":var z=a._wrapperState.wasMultiple;a._wrapperState.wasMultiple=!!n.multiple;var w=n.value;w!=null?qo(a,!!n.multiple,w,!1):z!==!!n.multiple&&(n.defaultValue!=null?qo(a,!!n.multiple,n.defaultValue,!0):qo(a,!!n.multiple,n.multiple?[]:"",!1))}a[dn]=n}catch(C){ce(e,e.return,C)}}break;case 6:if(mt(t,e),Et(e),o&4){if(e.stateNode===null)throw Error(E(162));a=e.stateNode,n=e.memoizedProps;try{a.nodeValue=n}catch(C){ce(e,e.return,C)}}break;case 3:if(mt(t,e),Et(e),o&4&&r!==null&&r.memoizedState.isDehydrated)try{nn(t.containerInfo)}catch(C){ce(e,e.return,C)}break;case 4:mt(t,e),Et(e);break;case 13:mt(t,e),Et(e),a=e.child,a.flags&8192&&(n=a.memoizedState!==null,a.stateNode.isHidden=n,!n||a.alternate!==null&&a.alternate.memoizedState!==null||(Ym=le())),o&4&&Ob(e);break;case 22:if($=r!==null&&r.memoizedState!==null,e.mode&1?(Ge=(d=Ge)||$,mt(t,e),Ge=d):mt(t,e),Et(e),o&8192){if(d=e.memoizedState!==null,(e.stateNode.isHidden=d)&&!$&&e.mode&1)for(B=e,$=e.child;$!==null;){for(k=B=$;B!==null;){switch(z=B,w=z.child,z.tag){case 0:case 11:case 14:case 15:Qa(4,z,z.return);break;case 1:Do(z,z.return);var V=z.stateNode;if(typeof V.componentWillUnmount=="function"){o=z,r=z.return;try{t=o,V.props=t.memoizedProps,V.state=t.memoizedState,V.componentWillUnmount()}catch(C){ce(o,r,C)}}break;case 5:Do(z,z.return);break;case 22:if(z.memoizedState!==null){Hb(k);continue}}w!==null?(w.return=z,B=w):Hb(k)}$=$.sibling}e:for($=null,k=e;;){if(k.tag===5){if($===null){$=k;try{a=k.stateNode,d?(n=a.style,typeof n.setProperty=="function"?n.setProperty("display","none","important"):n.display="none"):(i=k.stateNode,u=k.memoizedProps.style,s=u!=null&&u.hasOwnProperty("display")?u.display:null,i.style.display=sv("display",s))}catch(C){ce(e,e.return,C)}}}else if(k.tag===6){if($===null)try{k.stateNode.nodeValue=d?"":k.memoizedProps}catch(C){ce(e,e.return,C)}}else if((k.tag!==22&&k.tag!==23||k.memoizedState===null||k===e)&&k.child!==null){k.child.return=k,k=k.child;continue}if(k===e)break e;for(;k.sibling===null;){if(k.return===null||k.return===e)break e;$===k&&($=null),k=k.return}$===k&&($=null),k.sibling.return=k.return,k=k.sibling}}break;case 19:mt(t,e),Et(e),o&4&&Ob(e);break;case 21:break;default:mt(t,e),Et(e)}}function Et(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(L1(r)){var o=r;break e}r=r.return}throw Error(E(160))}switch(o.tag){case 5:var a=o.stateNode;o.flags&32&&(tn(a,""),o.flags&=-33);var n=Db(e);mm(e,n,a);break;case 3:case 4:var s=o.stateNode.containerInfo,i=Db(e);dm(e,i,s);break;default:throw Error(E(161))}}catch(u){ce(e,e.return,u)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function s2(e,t,r){B=e,F1(e,t,r)}function F1(e,t,r){for(var o=(e.mode&1)!==0;B!==null;){var a=B,n=a.child;if(a.tag===22&&o){var s=a.memoizedState!==null||Gs;if(!s){var i=a.alternate,u=i!==null&&i.memoizedState!==null||Ge;i=Gs;var d=Ge;if(Gs=s,(Ge=u)&&!d)for(B=a;B!==null;)s=B,u=s.child,s.tag===22&&s.memoizedState!==null?jb(a):u!==null?(u.return=s,B=u):jb(a);for(;n!==null;)B=n,F1(n,t,r),n=n.sibling;B=a,Gs=i,Ge=d}qb(e,t,r)}else a.subtreeFlags&8772&&n!==null?(n.return=a,B=n):qb(e,t,r)}}function qb(e){for(;B!==null;){var t=B;if(t.flags&8772){var r=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Ge||$i(5,t);break;case 1:var o=t.stateNode;if(t.flags&4&&!Ge)if(r===null)o.componentDidMount();else{var a=t.elementType===t.type?r.memoizedProps:pt(t.type,r.memoizedProps);o.componentDidUpdate(a,r.memoizedState,o.__reactInternalSnapshotBeforeUpdate)}var n=t.updateQueue;n!==null&&Eb(t,n,o);break;case 3:var s=t.updateQueue;if(s!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Eb(t,s,r)}break;case 5:var i=t.stateNode;if(r===null&&t.flags&4){r=i;var u=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":u.autoFocus&&r.focus();break;case"img":u.src&&(r.src=u.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var d=t.alternate;if(d!==null){var $=d.memoizedState;if($!==null){var k=$.dehydrated;k!==null&&nn(k)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(E(163))}Ge||t.flags&512&&um(t)}catch(z){ce(t,t.return,z)}}if(t===e){B=null;break}if(r=t.sibling,r!==null){r.return=t.return,B=r;break}B=t.return}}function Hb(e){for(;B!==null;){var t=B;if(t===e){B=null;break}var r=t.sibling;if(r!==null){r.return=t.return,B=r;break}B=t.return}}function jb(e){for(;B!==null;){var t=B;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{$i(4,t)}catch(u){ce(t,r,u)}break;case 1:var o=t.stateNode;if(typeof o.componentDidMount=="function"){var a=t.return;try{o.componentDidMount()}catch(u){ce(t,a,u)}}var n=t.return;try{um(t)}catch(u){ce(t,n,u)}break;case 5:var s=t.return;try{um(t)}catch(u){ce(t,s,u)}}}catch(u){ce(t,t.return,u)}if(t===e){B=null;break}var i=t.sibling;if(i!==null){i.return=t.return,B=i;break}B=t.return}}var i2=Math.ceil,ci=Yt.ReactCurrentDispatcher,Zm=Yt.ReactCurrentOwner,at=Yt.ReactCurrentBatchConfig,K=0,xe=null,me=null,we=0,Ue=0,Oo=Lr(0),ge=0,bn=null,to=0,zi=0,Qm=0,Ya=null,Ie=null,Ym=0,ta=1/0,qt=null,li=!1,pm=null,Sr=null,Ls=!1,yr=null,ui=0,Ja=0,fm=null,Ns=-1,Ds=0;function Fe(){return K&6?le():Ns!==-1?Ns:Ns=le()}function Er(e){return e.mode&1?K&2&&we!==0?we&-we:Hz.transition!==null?(Ds===0&&(Ds=xv()),Ds):(e=Z,e!==0||(e=window.event,e=e===void 0?16:Sv(e.type)),e):1}function bt(e,t,r,o){if(50<Ja)throw Ja=0,fm=null,Error(E(185));vn(e,r,o),(!(K&2)||e!==xe)&&(e===xe&&(!(K&2)&&(zi|=r),ge===4&&vr(e,we)),qe(e,o),r===1&&K===0&&!(t.mode&1)&&(ta=le()+500,vi&&Tr()))}function qe(e,t){var r=e.callbackNode;U$(e,t);var o=Ws(e,e===xe?we:0);if(o===0)r!==null&&Jh(r),e.callbackNode=null,e.callbackPriority=0;else if(t=o&-o,e.callbackPriority!==t){if(r!=null&&Jh(r),t===1)e.tag===0?qz(Ub.bind(null,e)):jv(Ub.bind(null,e)),Iz(function(){!(K&6)&&Tr()}),r=null;else{switch(yv(o)){case 1:r=wm;break;case 4:r=bv;break;case 16:r=Us;break;case 536870912:r=vv;break;default:r=Us}r=q1(r,R1.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function R1(e,t){if(Ns=-1,Ds=0,K&6)throw Error(E(327));var r=e.callbackNode;if(Ko()&&e.callbackNode!==r)return null;var o=Ws(e,e===xe?we:0);if(o===0)return null;if(o&30||o&e.expiredLanes||t)t=di(e,o);else{t=o;var a=K;K|=2;var n=M1();(xe!==e||we!==t)&&(qt=null,ta=le()+500,Zr(e,t));do try{u2();break}catch(i){A1(e,i)}while(!0);Am(),ci.current=n,K=a,me!==null?t=0:(xe=null,we=0,t=ge)}if(t!==0){if(t===2&&(a=Dd(e),a!==0&&(o=a,t=gm(e,a))),t===1)throw r=bn,Zr(e,0),vr(e,o),qe(e,le()),r;if(t===6)vr(e,o);else{if(a=e.current.alternate,!(o&30)&&!c2(a)&&(t=di(e,o),t===2&&(n=Dd(e),n!==0&&(o=n,t=gm(e,n))),t===1))throw r=bn,Zr(e,0),vr(e,o),qe(e,le()),r;switch(e.finishedWork=a,e.finishedLanes=o,t){case 0:case 1:throw Error(E(345));case 2:Ur(e,Ie,qt);break;case 3:if(vr(e,o),(o&130023424)===o&&(t=Ym+500-le(),10<t)){if(Ws(e,0)!==0)break;if(a=e.suspendedLanes,(a&o)!==o){Fe(),e.pingedLanes|=e.suspendedLanes&a;break}e.timeoutHandle=Xd(Ur.bind(null,e,Ie,qt),t);break}Ur(e,Ie,qt);break;case 4:if(vr(e,o),(o&4194240)===o)break;for(t=e.eventTimes,a=-1;0<o;){var s=31-ht(o);n=1<<s,s=t[s],s>a&&(a=s),o&=~n}if(o=a,o=le()-o,o=(120>o?120:480>o?480:1080>o?1080:1920>o?1920:3e3>o?3e3:4320>o?4320:1960*i2(o/1960))-o,10<o){e.timeoutHandle=Xd(Ur.bind(null,e,Ie,qt),o);break}Ur(e,Ie,qt);break;case 5:Ur(e,Ie,qt);break;default:throw Error(E(329))}}}return qe(e,le()),e.callbackNode===r?R1.bind(null,e):null}function gm(e,t){var r=Ya;return e.current.memoizedState.isDehydrated&&(Zr(e,t).flags|=256),e=di(e,t),e!==2&&(t=Ie,Ie=r,t!==null&&hm(t)),e}function hm(e){Ie===null?Ie=e:Ie.push.apply(Ie,e)}function c2(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var o=0;o<r.length;o++){var a=r[o],n=a.getSnapshot;a=a.value;try{if(!vt(n(),a))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function vr(e,t){for(t&=~Qm,t&=~zi,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-ht(t),o=1<<r;e[r]=-1,t&=~o}}function Ub(e){if(K&6)throw Error(E(327));Ko();var t=Ws(e,0);if(!(t&1))return qe(e,le()),null;var r=di(e,t);if(e.tag!==0&&r===2){var o=Dd(e);o!==0&&(t=o,r=gm(e,o))}if(r===1)throw r=bn,Zr(e,0),vr(e,t),qe(e,le()),r;if(r===6)throw Error(E(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,Ur(e,Ie,qt),qe(e,le()),null}function Jm(e,t){var r=K;K|=1;try{return e(t)}finally{K=r,K===0&&(ta=le()+500,vi&&Tr())}}function ro(e){yr!==null&&yr.tag===0&&!(K&6)&&Ko();var t=K;K|=1;var r=at.transition,o=Z;try{if(at.transition=null,Z=1,e)return e()}finally{Z=o,at.transition=r,K=t,!(K&6)&&Tr()}}function ep(){Ue=Oo.current,ee(Oo)}function Zr(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,Mz(r)),me!==null)for(r=me.return;r!==null;){var o=r;switch(Bm(o),o.tag){case 1:o=o.type.childContextTypes,o!=null&&Ys();break;case 3:Jo(),ee(De),ee(Le),qm();break;case 5:Om(o);break;case 4:Jo();break;case 13:ee(ae);break;case 19:ee(ae);break;case 10:Mm(o.type._context);break;case 22:case 23:ep()}r=r.return}if(xe=e,me=e=Cr(e.current,null),we=Ue=t,ge=0,bn=null,Qm=zi=to=0,Ie=Ya=null,Kr!==null){for(t=0;t<Kr.length;t++)if(r=Kr[t],o=r.interleaved,o!==null){r.interleaved=null;var a=o.next,n=r.pending;if(n!==null){var s=n.next;n.next=a,o.next=s}r.pending=o}Kr=null}return e}function A1(e,t){do{var r=me;try{if(Am(),As.current=ii,si){for(var o=ne.memoizedState;o!==null;){var a=o.queue;a!==null&&(a.pending=null),o=o.next}si=!1}if(eo=0,ve=fe=ne=null,Za=!1,fn=0,Zm.current=null,r===null||r.return===null){ge=1,bn=t,me=null;break}e:{var n=e,s=r.return,i=r,u=t;if(t=we,i.flags|=32768,u!==null&&typeof u=="object"&&typeof u.then=="function"){var d=u,$=i,k=$.tag;if(!($.mode&1)&&(k===0||k===11||k===15)){var z=$.alternate;z?($.updateQueue=z.updateQueue,$.memoizedState=z.memoizedState,$.lanes=z.lanes):($.updateQueue=null,$.memoizedState=null)}var w=Tb(s);if(w!==null){w.flags&=-257,Bb(w,s,i,n,t),w.mode&1&&Lb(n,d,t),t=w,u=d;var V=t.updateQueue;if(V===null){var C=new Set;C.add(u),t.updateQueue=C}else V.add(u);break e}else{if(!(t&1)){Lb(n,d,t),tp();break e}u=Error(E(426))}}else if(re&&i.mode&1){var M=Tb(s);if(M!==null){!(M.flags&65536)&&(M.flags|=256),Bb(M,s,i,n,t),Fm(ea(u,i));break e}}n=u=ea(u,i),ge!==4&&(ge=2),Ya===null?Ya=[n]:Ya.push(n),n=s;do{switch(n.tag){case 3:n.flags|=65536,t&=-t,n.lanes|=t;var f=y1(n,u,t);Sb(n,f);break e;case 1:i=u;var m=n.type,g=n.stateNode;if(!(n.flags&128)&&(typeof m.getDerivedStateFromError=="function"||g!==null&&typeof g.componentDidCatch=="function"&&(Sr===null||!Sr.has(g)))){n.flags|=65536,t&=-t,n.lanes|=t;var _=$1(n,i,t);Sb(n,_);break e}}n=n.return}while(n!==null)}N1(r)}catch(P){t=P,me===r&&r!==null&&(me=r=r.return);continue}break}while(!0)}function M1(){var e=ci.current;return ci.current=ii,e===null?ii:e}function tp(){(ge===0||ge===3||ge===2)&&(ge=4),xe===null||!(to&268435455)&&!(zi&268435455)||vr(xe,we)}function di(e,t){var r=K;K|=2;var o=M1();(xe!==e||we!==t)&&(qt=null,Zr(e,t));do try{l2();break}catch(a){A1(e,a)}while(!0);if(Am(),K=r,ci.current=o,me!==null)throw Error(E(261));return xe=null,we=0,ge}function l2(){for(;me!==null;)I1(me)}function u2(){for(;me!==null&&!A$();)I1(me)}function I1(e){var t=O1(e.alternate,e,Ue);e.memoizedProps=e.pendingProps,t===null?N1(e):me=t,Zm.current=null}function N1(e){var t=e;do{var r=t.alternate;if(e=t.return,t.flags&32768){if(r=o2(r,t),r!==null){r.flags&=32767,me=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{ge=6,me=null;return}}else if(r=r2(r,t,Ue),r!==null){me=r;return}if(t=t.sibling,t!==null){me=t;return}me=t=e}while(t!==null);ge===0&&(ge=5)}function Ur(e,t,r){var o=Z,a=at.transition;try{at.transition=null,Z=1,d2(e,t,r,o)}finally{at.transition=a,Z=o}return null}function d2(e,t,r,o){do Ko();while(yr!==null);if(K&6)throw Error(E(327));r=e.finishedWork;var a=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(E(177));e.callbackNode=null,e.callbackPriority=0;var n=r.lanes|r.childLanes;if(W$(e,n),e===xe&&(me=xe=null,we=0),!(r.subtreeFlags&2064)&&!(r.flags&2064)||Ls||(Ls=!0,q1(Us,function(){return Ko(),null})),n=(r.flags&15990)!==0,r.subtreeFlags&15990||n){n=at.transition,at.transition=null;var s=Z;Z=1;var i=K;K|=4,Zm.current=null,n2(e,r),B1(r,e),Tz(Wd),Ks=!!Ud,Wd=Ud=null,e.current=r,s2(r,e,a),M$(),K=i,Z=s,at.transition=n}else e.current=r;if(Ls&&(Ls=!1,yr=e,ui=a),n=e.pendingLanes,n===0&&(Sr=null),D$(r.stateNode,o),qe(e,le()),t!==null)for(o=e.onRecoverableError,r=0;r<t.length;r++)a=t[r],o(a.value,{componentStack:a.stack,digest:a.digest});if(li)throw li=!1,e=pm,pm=null,e;return ui&1&&e.tag!==0&&Ko(),n=e.pendingLanes,n&1?e===fm?Ja++:(Ja=0,fm=e):Ja=0,Tr(),null}function Ko(){if(yr!==null){var e=yv(ui),t=at.transition,r=Z;try{if(at.transition=null,Z=16>e?16:e,yr===null)var o=!1;else{if(e=yr,yr=null,ui=0,K&6)throw Error(E(331));var a=K;for(K|=4,B=e.current;B!==null;){var n=B,s=n.child;if(B.flags&16){var i=n.deletions;if(i!==null){for(var u=0;u<i.length;u++){var d=i[u];for(B=d;B!==null;){var $=B;switch($.tag){case 0:case 11:case 15:Qa(8,$,n)}var k=$.child;if(k!==null)k.return=$,B=k;else for(;B!==null;){$=B;var z=$.sibling,w=$.return;if(G1($),$===d){B=null;break}if(z!==null){z.return=w,B=z;break}B=w}}}var V=n.alternate;if(V!==null){var C=V.child;if(C!==null){V.child=null;do{var M=C.sibling;C.sibling=null,C=M}while(C!==null)}}B=n}}if(n.subtreeFlags&2064&&s!==null)s.return=n,B=s;else e:for(;B!==null;){if(n=B,n.flags&2048)switch(n.tag){case 0:case 11:case 15:Qa(9,n,n.return)}var f=n.sibling;if(f!==null){f.return=n.return,B=f;break e}B=n.return}}var m=e.current;for(B=m;B!==null;){s=B;var g=s.child;if(s.subtreeFlags&2064&&g!==null)g.return=s,B=g;else e:for(s=m;B!==null;){if(i=B,i.flags&2048)try{switch(i.tag){case 0:case 11:case 15:$i(9,i)}}catch(P){ce(i,i.return,P)}if(i===s){B=null;break e}var _=i.sibling;if(_!==null){_.return=i.return,B=_;break e}B=i.return}}if(K=a,Tr(),Pt&&typeof Pt.onPostCommitFiberRoot=="function")try{Pt.onPostCommitFiberRoot(pi,e)}catch{}o=!0}return o}finally{Z=r,at.transition=t}}return!1}function Wb(e,t,r){t=ea(r,t),t=y1(e,t,1),e=_r(e,t,1),t=Fe(),e!==null&&(vn(e,1,t),qe(e,t))}function ce(e,t,r){if(e.tag===3)Wb(e,e,r);else for(;t!==null;){if(t.tag===3){Wb(t,e,r);break}else if(t.tag===1){var o=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Sr===null||!Sr.has(o))){e=ea(r,e),e=$1(t,e,1),t=_r(t,e,1),e=Fe(),t!==null&&(vn(t,1,e),qe(t,e));break}}t=t.return}}function m2(e,t,r){var o=e.pingCache;o!==null&&o.delete(t),t=Fe(),e.pingedLanes|=e.suspendedLanes&r,xe===e&&(we&r)===r&&(ge===4||ge===3&&(we&130023424)===we&&500>le()-Ym?Zr(e,0):Qm|=r),qe(e,t)}function D1(e,t){t===0&&(e.mode&1?(t=vs,vs<<=1,!(vs&130023424)&&(vs=4194304)):t=1);var r=Fe();e=Zt(e,t),e!==null&&(vn(e,t,r),qe(e,r))}function p2(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),D1(e,r)}function f2(e,t){var r=0;switch(e.tag){case 13:var o=e.stateNode,a=e.memoizedState;a!==null&&(r=a.retryLane);break;case 19:o=e.stateNode;break;default:throw Error(E(314))}o!==null&&o.delete(t),D1(e,r)}var O1;O1=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||De.current)Ne=!0;else{if(!(e.lanes&r)&&!(t.flags&128))return Ne=!1,t2(e,t,r);Ne=!!(e.flags&131072)}else Ne=!1,re&&t.flags&1048576&&Uv(t,ti,t.index);switch(t.lanes=0,t.tag){case 2:var o=t.type;Is(e,t),e=t.pendingProps;var a=Zo(t,Le.current);Wo(t,r),a=jm(null,t,o,e,a,r);var n=Um();return t.flags|=1,typeof a=="object"&&a!==null&&typeof a.render=="function"&&a.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,Oe(o)?(n=!0,Js(t)):n=!1,t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,Nm(t),a.updater=yi,t.stateNode=a,a._reactInternals=t,rm(t,o,e,r),t=nm(null,t,o,!0,n,r)):(t.tag=0,re&&n&&Tm(t),Be(null,t,a,r),t=t.child),t;case 16:o=t.elementType;e:{switch(Is(e,t),e=t.pendingProps,a=o._init,o=a(o._payload),t.type=o,a=t.tag=h2(o),e=pt(o,e),a){case 0:t=am(null,t,o,e,r);break e;case 1:t=Ab(null,t,o,e,r);break e;case 11:t=Fb(null,t,o,e,r);break e;case 14:t=Rb(null,t,o,pt(o.type,e),r);break e}throw Error(E(306,o,""))}return t;case 0:return o=t.type,a=t.pendingProps,a=t.elementType===o?a:pt(o,a),am(e,t,o,a,r);case 1:return o=t.type,a=t.pendingProps,a=t.elementType===o?a:pt(o,a),Ab(e,t,o,a,r);case 3:e:{if(_1(t),e===null)throw Error(E(387));o=t.pendingProps,n=t.memoizedState,a=n.element,Yv(e,t),ai(t,o,null,r);var s=t.memoizedState;if(o=s.element,n.isDehydrated)if(n={element:o,isDehydrated:!1,cache:s.cache,pendingSuspenseBoundaries:s.pendingSuspenseBoundaries,transitions:s.transitions},t.updateQueue.baseState=n,t.memoizedState=n,t.flags&256){a=ea(Error(E(423)),t),t=Mb(e,t,o,r,a);break e}else if(o!==a){a=ea(Error(E(424)),t),t=Mb(e,t,o,r,a);break e}else for(We=wr(t.stateNode.containerInfo.firstChild),Ke=t,re=!0,gt=null,r=Zv(t,null,o,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Qo(),o===a){t=Qt(e,t,r);break e}Be(e,t,o,r)}t=t.child}return t;case 5:return Jv(t),e===null&&Jd(t),o=t.type,a=t.pendingProps,n=e!==null?e.memoizedProps:null,s=a.children,Kd(o,a)?s=null:n!==null&&Kd(o,n)&&(t.flags|=32),w1(e,t),Be(e,t,s,r),t.child;case 6:return e===null&&Jd(t),null;case 13:return S1(e,t,r);case 4:return Dm(t,t.stateNode.containerInfo),o=t.pendingProps,e===null?t.child=Yo(t,null,o,r):Be(e,t,o,r),t.child;case 11:return o=t.type,a=t.pendingProps,a=t.elementType===o?a:pt(o,a),Fb(e,t,o,a,r);case 7:return Be(e,t,t.pendingProps,r),t.child;case 8:return Be(e,t,t.pendingProps.children,r),t.child;case 12:return Be(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(o=t.type._context,a=t.pendingProps,n=t.memoizedProps,s=a.value,Y(ri,o._currentValue),o._currentValue=s,n!==null)if(vt(n.value,s)){if(n.children===a.children&&!De.current){t=Qt(e,t,r);break e}}else for(n=t.child,n!==null&&(n.return=t);n!==null;){var i=n.dependencies;if(i!==null){s=n.child;for(var u=i.firstContext;u!==null;){if(u.context===o){if(n.tag===1){u=Wt(-1,r&-r),u.tag=2;var d=n.updateQueue;if(d!==null){d=d.shared;var $=d.pending;$===null?u.next=u:(u.next=$.next,$.next=u),d.pending=u}}n.lanes|=r,u=n.alternate,u!==null&&(u.lanes|=r),em(n.return,r,t),i.lanes|=r;break}u=u.next}}else if(n.tag===10)s=n.type===t.type?null:n.child;else if(n.tag===18){if(s=n.return,s===null)throw Error(E(341));s.lanes|=r,i=s.alternate,i!==null&&(i.lanes|=r),em(s,r,t),s=n.sibling}else s=n.child;if(s!==null)s.return=n;else for(s=n;s!==null;){if(s===t){s=null;break}if(n=s.sibling,n!==null){n.return=s.return,s=n;break}s=s.return}n=s}Be(e,t,a.children,r),t=t.child}return t;case 9:return a=t.type,o=t.pendingProps.children,Wo(t,r),a=nt(a),o=o(a),t.flags|=1,Be(e,t,o,r),t.child;case 14:return o=t.type,a=pt(o,t.pendingProps),a=pt(o.type,a),Rb(e,t,o,a,r);case 15:return z1(e,t,t.type,t.pendingProps,r);case 17:return o=t.type,a=t.pendingProps,a=t.elementType===o?a:pt(o,a),Is(e,t),t.tag=1,Oe(o)?(e=!0,Js(t)):e=!1,Wo(t,r),x1(t,o,a),rm(t,o,a,r),nm(null,t,o,!0,e,r);case 19:return E1(e,t,r);case 22:return k1(e,t,r)}throw Error(E(156,t.tag))};function q1(e,t){return hv(e,t)}function g2(e,t,r,o){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ot(e,t,r,o){return new g2(e,t,r,o)}function rp(e){return e=e.prototype,!(!e||!e.isReactComponent)}function h2(e){if(typeof e=="function")return rp(e)?1:0;if(e!=null){if(e=e.$$typeof,e===$m)return 11;if(e===zm)return 14}return 2}function Cr(e,t){var r=e.alternate;return r===null?(r=ot(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Os(e,t,r,o,a,n){var s=2;if(o=e,typeof e=="function")rp(e)&&(s=1);else if(typeof e=="string")s=5;else e:switch(e){case Lo:return Qr(r.children,a,n,t);case ym:s=8,a|=8;break;case Sd:return e=ot(12,r,t,a|2),e.elementType=Sd,e.lanes=n,e;case Ed:return e=ot(13,r,t,a),e.elementType=Ed,e.lanes=n,e;case Cd:return e=ot(19,r,t,a),e.elementType=Cd,e.lanes=n,e;case Jb:return ki(r,a,n,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Qb:s=10;break e;case Yb:s=9;break e;case $m:s=11;break e;case zm:s=14;break e;case gr:s=16,o=null;break e}throw Error(E(130,e==null?e:typeof e,""))}return t=ot(s,r,t,a),t.elementType=e,t.type=o,t.lanes=n,t}function Qr(e,t,r,o){return e=ot(7,e,o,t),e.lanes=r,e}function ki(e,t,r,o){return e=ot(22,e,o,t),e.elementType=Jb,e.lanes=r,e.stateNode={isHidden:!1},e}function kd(e,t,r){return e=ot(6,e,null,t),e.lanes=r,e}function wd(e,t,r){return t=ot(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function b2(e,t,r,o,a){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=id(0),this.expirationTimes=id(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=id(0),this.identifierPrefix=o,this.onRecoverableError=a,this.mutableSourceEagerHydrationData=null}function op(e,t,r,o,a,n,s,i,u){return e=new b2(e,t,r,i,u),t===1?(t=1,n===!0&&(t|=8)):t=0,n=ot(3,null,null,t),e.current=n,n.stateNode=e,n.memoizedState={element:o,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},Nm(n),e}function v2(e,t,r){var o=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Go,key:o==null?null:""+o,children:e,containerInfo:t,implementation:r}}function H1(e){if(!e)return Pr;e=e._reactInternals;e:{if(ao(e)!==e||e.tag!==1)throw Error(E(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(Oe(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(E(171))}if(e.tag===1){var r=e.type;if(Oe(r))return Hv(e,r,t)}return t}function j1(e,t,r,o,a,n,s,i,u){return e=op(r,o,!0,e,a,n,s,i,u),e.context=H1(null),r=e.current,o=Fe(),a=Er(r),n=Wt(o,a),n.callback=t??null,_r(r,n,a),e.current.lanes=a,vn(e,a,o),qe(e,o),e}function wi(e,t,r,o){var a=t.current,n=Fe(),s=Er(a);return r=H1(r),t.context===null?t.context=r:t.pendingContext=r,t=Wt(n,s),t.payload={element:e},o=o===void 0?null:o,o!==null&&(t.callback=o),e=_r(a,t,s),e!==null&&(bt(e,a,s,n),Rs(e,a,s)),s}function mi(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function Kb(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function ap(e,t){Kb(e,t),(e=e.alternate)&&Kb(e,t)}function x2(){return null}var U1=typeof reportError=="function"?reportError:function(e){console.error(e)};function np(e){this._internalRoot=e}_i.prototype.render=np.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(E(409));wi(e,t,null,null)};_i.prototype.unmount=np.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;ro(function(){wi(null,e,null,null)}),t[Xt]=null}};function _i(e){this._internalRoot=e}_i.prototype.unstable_scheduleHydration=function(e){if(e){var t=kv();e={blockedOn:null,target:e,priority:t};for(var r=0;r<br.length&&t!==0&&t<br[r].priority;r++);br.splice(r,0,e),r===0&&_v(e)}};function sp(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Si(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function Xb(){}function y2(e,t,r,o,a){if(a){if(typeof o=="function"){var n=o;o=function(){var d=mi(s);n.call(d)}}var s=j1(t,o,e,0,null,!1,!1,"",Xb);return e._reactRootContainer=s,e[Xt]=s.current,ln(e.nodeType===8?e.parentNode:e),ro(),s}for(;a=e.lastChild;)e.removeChild(a);if(typeof o=="function"){var i=o;o=function(){var d=mi(u);i.call(d)}}var u=op(e,0,!1,null,null,!1,!1,"",Xb);return e._reactRootContainer=u,e[Xt]=u.current,ln(e.nodeType===8?e.parentNode:e),ro(function(){wi(t,u,r,o)}),u}function Ei(e,t,r,o,a){var n=r._reactRootContainer;if(n){var s=n;if(typeof a=="function"){var i=a;a=function(){var u=mi(s);i.call(u)}}wi(t,s,e,a)}else s=y2(r,t,e,a,o);return mi(s)}$v=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=qa(t.pendingLanes);r!==0&&(_m(t,r|1),qe(t,le()),!(K&6)&&(ta=le()+500,Tr()))}break;case 13:ro(function(){var o=Zt(e,1);if(o!==null){var a=Fe();bt(o,e,1,a)}}),ap(e,1)}};Sm=function(e){if(e.tag===13){var t=Zt(e,134217728);if(t!==null){var r=Fe();bt(t,e,134217728,r)}ap(e,134217728)}};zv=function(e){if(e.tag===13){var t=Er(e),r=Zt(e,t);if(r!==null){var o=Fe();bt(r,e,t,o)}ap(e,t)}};kv=function(){return Z};wv=function(e,t){var r=Z;try{return Z=e,t()}finally{Z=r}};Md=function(e,t,r){switch(t){case"input":if(Gd(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var o=r[t];if(o!==e&&o.form===e.form){var a=bi(o);if(!a)throw Error(E(90));tv(o),Gd(o,a)}}}break;case"textarea":ov(e,r);break;case"select":t=r.value,t!=null&&qo(e,!!r.multiple,t,!1)}};uv=Jm;dv=ro;var $2={usingClientEntryPoint:!1,Events:[yn,Ro,bi,cv,lv,Jm]},Ia={findFiberByHostInstance:Wr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},z2={bundleType:Ia.bundleType,version:Ia.version,rendererPackageName:Ia.rendererPackageName,rendererConfig:Ia.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Yt.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=fv(e),e===null?null:e.stateNode},findFiberByHostInstance:Ia.findFiberByHostInstance||x2,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"&&(Na=__REACT_DEVTOOLS_GLOBAL_HOOK__,!Na.isDisabled&&Na.supportsFiber))try{pi=Na.inject(z2),Pt=Na}catch{}var Na;Qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=$2;Qe.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!sp(t))throw Error(E(200));return v2(e,t,null,r)};Qe.createRoot=function(e,t){if(!sp(e))throw Error(E(299));var r=!1,o="",a=U1;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(o=t.identifierPrefix),t.onRecoverableError!==void 0&&(a=t.onRecoverableError)),t=op(e,1,!1,null,null,r,!1,o,a),e[Xt]=t.current,ln(e.nodeType===8?e.parentNode:e),new np(t)};Qe.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(E(188)):(e=Object.keys(e).join(","),Error(E(268,e)));return e=fv(t),e=e===null?null:e.stateNode,e};Qe.flushSync=function(e){return ro(e)};Qe.hydrate=function(e,t,r){if(!Si(t))throw Error(E(200));return Ei(null,e,t,!0,r)};Qe.hydrateRoot=function(e,t,r){if(!sp(e))throw Error(E(405));var o=r!=null&&r.hydratedSources||null,a=!1,n="",s=U1;if(r!=null&&(r.unstable_strictMode===!0&&(a=!0),r.identifierPrefix!==void 0&&(n=r.identifierPrefix),r.onRecoverableError!==void 0&&(s=r.onRecoverableError)),t=j1(t,null,e,1,r??null,a,!1,n,s),e[Xt]=t.current,ln(e),o)for(e=0;e<o.length;e++)r=o[e],a=r._getVersion,a=a(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,a]:t.mutableSourceEagerHydrationData.push(r,a);return new _i(t)};Qe.render=function(e,t,r){if(!Si(t))throw Error(E(200));return Ei(null,e,t,!1,r)};Qe.unmountComponentAtNode=function(e){if(!Si(e))throw Error(E(40));return e._reactRootContainer?(ro(function(){Ei(null,null,e,!1,function(){e._reactRootContainer=null,e[Xt]=null})}),!0):!1};Qe.unstable_batchedUpdates=Jm;Qe.unstable_renderSubtreeIntoContainer=function(e,t,r,o){if(!Si(r))throw Error(E(200));if(e==null||e._reactInternals===void 0)throw Error(E(38));return Ei(e,t,r,!1,o)};Qe.version="18.3.1-next-f1338f8080-20240426"});var Ci=Ar((gC,X1)=>{"use strict";l();c();function K1(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(K1)}catch(e){console.error(e)}}K1(),X1.exports=W1()});function ip(e,t){let{elementType:r="button",isDisabled:o,onPress:a,onPressStart:n,onPressEnd:s,onPressUp:i,onPressChange:u,preventFocusOnPress:d,allowFocusWhenDisabled:$,onClick:k,href:z,target:w,rel:V,type:C="button"}=e,M;r==="button"?M={type:C,disabled:o}:M={role:"button",tabIndex:o?void 0:0,href:r==="a"&&!o?z:void 0,target:r==="a"?w:void 0,type:r==="input"?C:void 0,disabled:r==="input"?o:void 0,"aria-disabled":!o||r==="input"?void 0:o,rel:r==="a"?V:void 0};let{pressProps:f,isPressed:m}=eu({onPressStart:n,onPressEnd:s,onPressChange:u,onPress:a,onPressUp:i,isDisabled:o,preventFocusOnPress:d,ref:t}),{focusableProps:g}=yu(e,t);$&&(g.tabIndex=o?-1:g.tabIndex);let _=de(g,f,zt(e,{labelable:!0}));return{isPressed:m,buttonProps:de(M,_,{"aria-haspopup":e["aria-haspopup"],"aria-expanded":e["aria-expanded"],"aria-controls":e["aria-controls"],"aria-pressed":e["aria-pressed"],onClick:P=>{k&&(k(P),console.warn("onClick is deprecated, please use onPress"))}})}}var Z1=v(()=>{l();c();be();$u();Co()});var Q1=v(()=>{l();c();Z1()});function lp(e){let{children:t}=e,r=(0,xt.useContext)(cp),[o,a]=(0,xt.useState)(0),n=(0,xt.useMemo)(()=>({parent:r,modalCount:o,addModal(){a(s=>s+1),r&&r.addModal()},removeModal(){a(s=>s-1),r&&r.removeModal()}}),[r,o]);return xt.default.createElement(cp.Provider,{value:n},t)}function up(){let e=(0,xt.useContext)(cp);return{modalProviderProps:{"aria-hidden":e&&e.modalCount>0?!0:void 0}}}var xt,k2,cp,Y1=v(()=>{l();c();xt=q(H(),1),k2=q(Ci(),1),cp=xt.default.createContext(null)});var J1=v(()=>{l();c();Y1()});var ex=v(()=>{l();c();Gh()});var tx,aa,rx=v(()=>{l();c();tx=q(H(),1),aa=tx.default.createContext(null);aa.displayName="ProviderContext"});var ox=v(()=>{});function na(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Br,dp,mp,pp,Vi,fp,gp,ax=v(()=>{l();c();Br={};na(Br,"focus-ring",()=>dp,e=>dp=e);na(Br,"i18nFontFamily",()=>mp,e=>mp=e);na(Br,"spectrum",()=>pp,e=>pp=e);na(Br,"spectrum-FocusRing-ring",()=>Vi,e=>Vi=e);na(Br,"spectrum-FocusRing",()=>fp,e=>fp=e);na(Br,"spectrum-FocusRing--quiet",()=>gp,e=>gp=e);dp="_t8qIa_focus-ring";mp="_t8qIa_i18nFontFamily";pp="_t8qIa_spectrum";Vi="_t8qIa_spectrum-FocusRing-ring";fp=`_t8qIa_spectrum-FocusRing ${Vi}`;gp="_t8qIa_spectrum-FocusRing--quiet"});var nx=v(()=>{});function Fr(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Lt,hp,Pi,bp,vp,xp,Gi,yp,$p,sx=v(()=>{l();c();Lt={};Fr(Lt,"focus-ring",()=>hp,e=>hp=e);Fr(Lt,"i18nFontFamily",()=>Pi,e=>Pi=e);Fr(Lt,"spectrum",()=>bp,e=>bp=e);Fr(Lt,"spectrum-Body",()=>vp,e=>vp=e);Fr(Lt,"spectrum-Body--italic",()=>xp,e=>xp=e);Fr(Lt,"spectrum-FocusRing-ring",()=>Gi,e=>Gi=e);Fr(Lt,"spectrum-FocusRing",()=>yp,e=>yp=e);Fr(Lt,"spectrum-FocusRing--quiet",()=>$p,e=>$p=e);hp="kDKRXa_focus-ring";Pi="kDKRXa_i18nFontFamily";bp=`kDKRXa_spectrum ${Pi}`;vp="kDKRXa_spectrum-Body";xp="kDKRXa_spectrum-Body--italic";Gi="kDKRXa_spectrum-FocusRing-ring";yp=`kDKRXa_spectrum-FocusRing ${Gi}`;$p="kDKRXa_spectrum-FocusRing--quiet"});function ix(e,t){let r=ga("(prefers-color-scheme: dark)"),o=ga("(prefers-color-scheme: light)");return e.dark&&r?"dark":e.light&&o?"light":e.dark&&t==="dark"?"dark":e.light&&t==="light"||!e.dark||e.light?"light":"dark"}function cx(e){return ga("(any-pointer: fine)")&&e.medium?"medium":e.large?"large":"medium"}var lx=v(()=>{l();c();ko()});var zp,ux=v(()=>{l();c();zp={};zp=JSON.parse('{"name":"@react-spectrum/provider","version":"3.10.0","description":"Spectrum UI components in React","license":"Apache-2.0","main":"dist/main.js","module":"dist/module.js","exports":{"types":"./dist/types.d.ts","import":"./dist/import.mjs","require":"./dist/main.js"},"types":"dist/types.d.ts","source":"src/index.ts","files":["dist","src"],"sideEffects":["*.css"],"targets":{"main":{"includeNodeModules":["@adobe/spectrum-css-temp"]},"module":{"includeNodeModules":["@adobe/spectrum-css-temp"]}},"repository":{"type":"git","url":"https://github.com/adobe/react-spectrum"},"dependencies":{"@react-aria/i18n":"^3.12.4","@react-aria/overlays":"^3.24.0","@react-aria/utils":"^3.26.0","@react-spectrum/utils":"^3.12.0","@react-types/provider":"^3.8.5","@react-types/shared":"^3.26.0","@swc/helpers":"^0.5.0","clsx":"^2.0.0"},"devDependencies":{"@adobe/spectrum-css-temp":"3.0.0-alpha.1"},"peerDependencies":{"react":"^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0-rc.1","react-dom":"^16.8.0 || ^17.0.0-rc.1 || ^18.0.0 || ^19.0.0-rc.1"},"publishConfig":{"access":"public"}}')});function dx(e){return e&&e.__esModule?e.default:e}function _2(e,t){let r=(0,ye.useContext)(aa),o=r&&r.colorScheme,a=r&&r.breakpoints,{theme:n=r&&r.theme,defaultColorScheme:s}=e;if(!n)throw new Error("theme not found, the parent provider must have a theme provided");let i=ix(n,s||"light"),u=cx(n),{locale:d}=$t(),$=o?!!n[o]:!1,{colorScheme:k=$?o:i,scale:z=r?r.scale:u,locale:w=r?d:void 0,breakpoints:V=r?a:w2,children:C,isQuiet:M,isEmphasized:f,isDisabled:m,isRequired:g,isReadOnly:_,validationState:P,router:T,...F}=e,p={version:zp.version,theme:n,breakpoints:V,colorScheme:k,scale:z,isQuiet:M,isEmphasized:f,isDisabled:m,isRequired:g,isReadOnly:_,validationState:P},R=yl(V),A={};Object.entries(p).forEach(([G,Se])=>Se!==void 0&&(A[G]=Se));let L=Object.assign({},r,A),j=C,S=zt(F),{styleProps:U}=wt(F,void 0,{matchedBreakpoints:R});return(!r||e.locale||n!==r.theme||k!==r.colorScheme||z!==r.scale||Object.keys(S).length>0||F.UNSAFE_className||U.style&&Object.keys(U.style).length>0)&&(j=ye.default.createElement(S2,{...e,UNSAFE_style:{isolation:r?void 0:"isolate",...U.style},ref:t},j)),T&&(j=ye.default.createElement(Bl,T,j)),ye.default.createElement(aa.Provider,{value:L},ye.default.createElement(Sl,{locale:w},ye.default.createElement(xl,{matchedBreakpoints:R},ye.default.createElement(lp,null,j))))}function kp(){let e=(0,ye.useContext)(aa);if(!e)throw new Error("No root provider found, please make sure your app is wrapped within a <Provider>. Alternatively, this issue may be caused by duplicate packages, see https://github.com/adobe/react-spectrum/wiki/Frequently-Asked-Questions-(FAQs)#why-are-there-errors-after-upgrading-a-react-spectrum-package for more information.");return e}function wp(e){let t=(0,ye.useContext)(aa);return t?Object.assign({},{isQuiet:t.isQuiet,isEmphasized:t.isEmphasized,isDisabled:t.isDisabled,isRequired:t.isRequired,isReadOnly:t.isReadOnly,validationState:t.validationState},e):e}var ye,w2,Li,S2,mx=v(()=>{l();c();rx();ox();ax();nx();sx();lx();ux();ko();pa();be();_a();J1();ye=q(H(),1);w2={S:640,M:768,L:1024,XL:1280,XXL:1536};Li=ye.default.forwardRef(_2),S2=ye.default.forwardRef(function(t,r){let{children:o,...a}=t,{locale:n,direction:s}=$t(),{theme:i,colorScheme:u,scale:d}=kp(),{modalProviderProps:$}=up(),{styleProps:k}=wt(a),z=Nr(r),w=Object.keys(i[u])[0],V=Object.keys(i[d])[0],C=or(k.className,dx(Br).spectrum,dx(Lt).spectrum,Object.values(i[u]),Object.values(i[d]),i.global?Object.values(i.global):null,{"react-spectrum-provider":ar,spectrum:ar,[w]:ar,[V]:ar});var M,f;let m={...k.style,colorScheme:(f=(M=t.colorScheme)!==null&&M!==void 0?M:u)!==null&&f!==void 0?f:Object.keys(i).filter(_=>_==="light"||_==="dark").join(" ")},g=(0,ye.useRef)(!1);return(0,ye.useEffect)(()=>{if(s&&z.current){var _,P;let T=(P=z.current)===null||P===void 0||(_=P.parentElement)===null||_===void 0?void 0:_.closest("[dir]"),F=T&&T.getAttribute("dir");F&&F!==s&&!g.current&&(console.warn(`Language directions cannot be nested. ${s} inside ${F}.`),g.current=!0)}},[s,z,g]),ye.default.createElement("div",{...zt(a),...k,...$,className:C,style:m,lang:n,dir:s,ref:z},o)})});var _p=v(()=>{l();c();mx()});function Rr(e){return e&&e.__esModule?e.default:e}function E2(e){return e.isPending&&(e.onPress=void 0,e.onPressStart=void 0,e.onPressEnd=void 0,e.onPressChange=void 0,e.onPressUp=void 0,e.onKeyDown=void 0,e.onKeyUp=void 0,e.onClick=void 0,e.href=void 0),e}function C2(e,t){var r;e=wp(e),e=Sa(e,"button"),e=E2(e);let{elementType:o="button",children:a,variant:n,style:s=n==="accent"||n==="cta"?"fill":"outline",staticColor:i,isDisabled:u,isPending:d,autoFocus:$,...k}=e,z=bl(t),{buttonProps:w,isPressed:V}=ip(e,z),{hoverProps:C,isHovered:M}=gu({isDisabled:u}),[f,m]=(0,$e.useState)(!1),{focusProps:g}=Or({onFocusChange:m,isDisabled:u}),_=El(Rr(Bc),"@react-spectrum/button"),{styleProps:P}=wt(k),T=Yn(`.${Rr(I)["spectrum-Button-label"]}`,z),F=Yn(`.${Rr(I)["spectrum-Icon"]}`,z),p=!!w["aria-label"]||!!w["aria-labelledby"],[R,A]=(0,$e.useState)(!1),L=ct(),j=w.id||L,S=ct(),U=ct(),G=ct();(0,$e.useEffect)(()=>{let ia;return d?ia=setTimeout(()=>{A(!0)},1e3):A(!1),()=>{clearTimeout(ia)}},[d]),n==="cta"?n="accent":n==="overBackground"&&(n="primary",i="white");let Se=`${p?w["aria-label"]:""} ${_.format("pending")}`.trim();var Ri;let Hp=p?(Ri=(r=w["aria-labelledby"])===null||r===void 0?void 0:r.replace(j,G))!==null&&Ri!==void 0?Ri:G:`${F?S:""} ${T?U:""} ${G}`.trim(),jp="polite";Ll()&&(!p||$a())&&(jp="off");let Rx=d?{onClick:ia=>{ia.currentTarget instanceof HTMLButtonElement&&ia.preventDefault()}}:{onClick:()=>{}};return $e.default.createElement(xu,{focusRingClass:ze(Rr(I),"focus-ring"),autoFocus:$},$e.default.createElement(o,{...P,...de(w,C,g,Rx),id:j,ref:z,"data-variant":n,"data-style":s,"data-static-color":i||void 0,"aria-disabled":d?"true":void 0,"aria-label":d?Se:w["aria-label"],"aria-labelledby":d?Hp:w["aria-labelledby"],className:ze(Rr(I),"spectrum-Button",{"spectrum-Button--iconOnly":F&&!T,"is-disabled":u||R,"is-active":V,"is-hovered":M,"spectrum-Button--pending":R},P.className)},$e.default.createElement(Ul,{slots:{icon:{id:S,size:"S",UNSAFE_className:ze(Rr(I),"spectrum-Icon")},text:{id:U,UNSAFE_className:ze(Rr(I),"spectrum-Button-label")}}},typeof a=="string"?$e.default.createElement(Wu,null,a):a,d&&$e.default.createElement("div",{"aria-hidden":"true",style:{visibility:R?"visible":"hidden"},className:ze(Rr(I),"spectrum-Button-circleLoader")},$e.default.createElement(Uu,{"aria-label":Se,isIndeterminate:!0,size:"S",staticColor:i})),d&&$e.default.createElement($e.default.Fragment,null,$e.default.createElement("div",{"aria-live":f?jp:"off"},R&&$e.default.createElement("div",{role:"img","aria-labelledby":Hp})),$e.default.createElement("div",{id:G,role:"img","aria-label":Se})))))}var $e,Ti,px=v(()=>{l();c();N0();D0();O0();ko();$u();be();Ph();$e=q(H(),1);ex();Q1();Co();_a();_p();Ti=$e.default.forwardRef(C2)});var fx=v(()=>{l();c();px()});var gx=v(()=>{});function V2(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Ep,Sp,hx=v(()=>{l();c();Ep={};V2(Ep,"spectrum--darkest",()=>Sp,e=>Sp=e);Sp="R-l9gW_spectrum--darkest"});var bx=v(()=>{});function no(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Jt,Cp,Vp,Pp,Gp,Lp,Tp,Bp,vx=v(()=>{l();c();Jt={};no(Jt,"spectrum",()=>Cp,e=>Cp=e);no(Jt,"spectrum--dark",()=>Vp,e=>Vp=e);no(Jt,"spectrum--darkest",()=>Pp,e=>Pp=e);no(Jt,"spectrum--large",()=>Gp,e=>Gp=e);no(Jt,"spectrum--light",()=>Lp,e=>Lp=e);no(Jt,"spectrum--lightest",()=>Tp,e=>Tp=e);no(Jt,"spectrum--medium",()=>Bp,e=>Bp=e);Cp="XhWg9q_spectrum";Vp="XhWg9q_spectrum--dark";Pp="XhWg9q_spectrum--darkest";Gp="XhWg9q_spectrum--large";Lp="XhWg9q_spectrum--light";Tp="XhWg9q_spectrum--lightest";Bp="XhWg9q_spectrum--medium"});var xx=v(()=>{});function P2(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Rp,Fp,yx=v(()=>{l();c();Rp={};P2(Rp,"spectrum--large",()=>Fp,e=>Fp=e);Fp="_1DrGeG_spectrum--large"});var $x=v(()=>{});function G2(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Mp,Ap,zx=v(()=>{l();c();Mp={};G2(Mp,"spectrum--light",()=>Ap,e=>Ap=e);Ap="YqfL3a_spectrum--light"});var kx=v(()=>{});function L2(e,t,r,o){Object.defineProperty(e,t,{get:r,set:o,enumerable:!0,configurable:!0})}var Np,Ip,wx=v(()=>{l();c();Np={};L2(Np,"spectrum--medium",()=>Ip,e=>Ip=e);Ip="rfm_fq_spectrum--medium"});function zn(e){return e&&e.__esModule?e.default:e}var Bi,_x=v(()=>{l();c();gx();hx();bx();vx();xx();yx();$x();zx();kx();wx();Bi={global:zn(Jt),light:zn(Mp),dark:zn(Ep),medium:zn(Np),large:zn(Rp)}});var Sx=v(()=>{l();c();n0();fx();_p();_x()});var Cx=Ar(Dp=>{"use strict";l();c();var Ex=Ci();Dp.createRoot=Ex.createRoot,Dp.hydrateRoot=Ex.hydrateRoot;var NP});function T2({variant:e,style:t,content:r,target:o}){let a=sa.default.useRef();return sa.default.useLayoutEffect(()=>{a.current&&a.current.UNSAFE_getDOMNode().append(r)},[]),sa.default.createElement(Li,{theme:Bi,color:Gx,scale:"medium"},(0,Px.createPortal)(sa.default.createElement(Ti,{ref:a,variant:e,style:t}),o))}function Lx(e,t,r,o){let a=document.createElement("div");return(0,Vx.createRoot)(a).render(sa.default.createElement(T2,{theme:Bi,color:Gx,variant:e,style:t,target:o,content:r})),a}var sa,Vx,Px,Gx,Tx=v(()=>{l();c();sa=q(H(),1);Sx();Vx=q(Cx(),1),Px=q(Ci(),1),Gx=["light","dark","darkest"].find(e=>document.querySelector(`spectrum--${e}`)!==void 0)});function N2(e,t,r){e.mnemonicIcon?.map((a,n)=>({icon:a,alt:e.mnemonicAlt[n]??"",link:e.mnemonicLink[n]??""}))?.forEach(({icon:a,alt:n,link:s})=>{if(s&&!/^https?:/.test(s))try{s=new URL(`https://${s}`).href.toString()}catch{s="#"}let i={slot:"icons",src:a,size:r?.size??"l"};n&&(i.alt=n),s&&(i.href=s);let u=yt("merch-icon",i);t.append(u)})}function D2(e,t){e.badge&&(t.setAttribute("badge-text",e.badge),t.setAttribute("badge-color",e.badgeColor||B2),t.setAttribute("badge-background-color",e.badgeBackgroundColor||F2))}function O2(e,t,r){r?.includes(e.size)&&t.setAttribute("size",e.size)}function q2(e,t,r){e.cardTitle&&r&&t.append(yt(r.tag,{slot:r.slot},e.cardTitle))}function H2(e,t,r){e.subtitle&&r&&t.append(yt(r.tag,{slot:r.slot},e.subtitle))}function j2(e,t,r,o){if(e.backgroundImage)switch(o){case"ccd-slice":r&&t.append(yt(r.tag,{slot:r.slot},`<img loading="lazy" src="${e.backgroundImage}" />`));break;case"ccd-suggested":t.setAttribute("background-image",e.backgroundImage);break}}function U2(e,t,r){if(e.prices&&r){let o=yt(r.tag,{slot:r.slot},e.prices);t.append(o)}}function W2(e,t,r){if(e.description&&r){let o=yt(r.tag,{slot:r.slot},e.description);t.append(o)}}function K2(e,t,r,o){let a=t.ctas.size??"M",n=`spectrum-Button--${o}`,s=r?" spectrum-Button--outline":"",i=I2.includes(a)?` spectrum-Button--size${a}`:"",u=`spectrum-Button ${n}${s}${i}`,d=yt("button",{class:u,tabIndex:0},e);return d.addEventListener("click",$=>{$.target!==e&&($.stopPropagation(),e.click())}),d}function X2(e,t,r,o){let a="fill";r&&(a="outline");let n=yt("sp-button",{treatment:a,variant:o,tabIndex:0,size:t.ctas.size??"m"},e);return n.addEventListener("click",s=>{s.target!==e&&(s.stopPropagation(),e.click())}),n}function Z2(e,t,r,o,a){let n="fill";r&&(n="outline"),Lx(o,n,e,a);let s=a.lastElementChild;s&&(s.tabIndex=0,s.addEventListener("click",i=>{i.target!==e&&(i.stopPropagation(),e.click())}))}function Q2(e){let t=e.parentElement.tagName==="STRONG";return e.classList.add("con-button"),t&&e.classList.add("blue"),e}function Y2(e,t,r){if(!e.ctas)return;let{slot:o}=r.ctas,a=yt("div",{slot:o},e.ctas),n=a.querySelectorAll("a");a.innerHTML="",n.forEach(s=>{if(t.consonant)return Q2(s,a);let i=R2.exec(s.className)?.[0]??"accent",u=i.includes("accent"),d=i.includes("primary"),$=i.includes("secondary"),k=i.includes("-outline");if(i.includes("-link"))return s;let w;return u?w="accent":d?w="primary":$&&(w="secondary"),s.tabIndex=-1,t.spectrum==="swc"?X2(s,r,k,w,a):t.spectrum==="css"?K2(s,r,k,w,a):Z2(s,r,k,w,a)}),t.append(a)}function J2(e,t){let{tags:r}=e,o=r?.find(a=>a.startsWith(A2))?.split("/").pop();o&&(t.setAttribute(Fi,o),t.querySelectorAll("a[data-analytics-id]").forEach((a,n)=>{a.setAttribute(M2,`${a.dataset.analyticsId}-${n+1}`)}))}async function Bx(e,t){let{fields:r}=e,{variant:o}=r;if(!o)return;t.querySelectorAll("[slot]").forEach(n=>{n.remove()}),t.removeAttribute("background-image"),t.removeAttribute("badge-background-color"),t.removeAttribute("badge-color"),t.removeAttribute("badge-text"),t.removeAttribute("size"),t.removeAttribute(Fi),t.variant=o,await t.updateComplete;let{aemFragmentMapping:a}=t.variantLayout;a&&(N2(r,t,a.mnemonics),D2(r,t),O2(r,t,a.allowedSizes),q2(r,t,a.title),H2(r,t,a.subtitle),U2(r,t,a.prices),j2(r,t,a.backgroundImage,o),W2(r,t,a.description),Y2(r,t,a),J2(r,t))}var B2,F2,R2,A2,M2,Fi,I2,Fx=v(()=>{l();c();Tx();ua();B2="#000000",F2="#F8D904",R2=/(accent|primary|secondary)(-(outline|link))?/,A2="mas:product_code/",M2="daa-ll",Fi="daa-lh",I2=["XL","L","M","S"]});import{LitElement as e5}from"../lit-all.min.js";var x,t5,qp,kn,Op,b,l=v(()=>{Jp();qf();jf();qi();He();Fx();x="merch-card",t5=1e4,b=class extends e5{constructor(){super();ca(this,kn);D(this,"customerSegment");D(this,"marketSegment");D(this,"variantLayout");ca(this,qp,!1);this.filters={},this.types="",this.selected=!1,this.spectrum="rsv3",this.handleAemFragmentEvents=this.handleAemFragmentEvents.bind(this)}firstUpdated(){this.variantLayout=Ki(this,!1),this.variantLayout?.connectedCallbackHook(),this.aemFragment?.updateComplete.catch(()=>{this.style.display="none"})}willUpdate(r){(r.has("variant")||!this.variantLayout)&&(this.variantLayout=Ki(this),this.variantLayout.connectedCallbackHook())}updated(r){(r.has("badgeBackgroundColor")||r.has("borderColor"))&&this.style.setProperty("--merch-card-border",this.computedBorderStyle),this.variantLayout?.postCardUpdateHook(this)}get theme(){return this.closest("sp-theme")}get dir(){return this.closest("[dir]")?.getAttribute("dir")??"ltr"}get prices(){return Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'))}render(){if(!(!this.isConnected||!this.variantLayout||this.style.display==="none"))return this.variantLayout.renderLayout()}get computedBorderStyle(){return["twp","ccd-slice","ccd-suggested"].includes(this.variant)?"":`1px solid ${this.borderColor?this.borderColor:this.badgeBackgroundColor}`}get badgeElement(){return this.shadowRoot.getElementById("badge")}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}async toggleStockOffer({target:r}){if(!this.stockOfferOsis)return;let o=this.checkoutLinks;if(o.length!==0)for(let a of o){await a.onceSettled();let n=a.value?.[0]?.planType;if(!n)return;let s=this.stockOfferOsis[n];if(!s)return;let i=a.dataset.wcsOsi.split(",").filter(u=>u!==s);r.checked&&i.push(s),a.dataset.wcsOsi=i.join(",")}}handleQuantitySelection(r){let o=this.checkoutLinks;for(let a of o)a.dataset.quantity=r.detail.option}get titleElement(){return this.querySelector(this.variantLayout?.headingSelector||".card-heading")}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(r){let o={...this.filters};Object.keys(o).forEach(a=>{if(r){o[a].order=Math.min(o[a].order||2,2);return}let n=o[a].order;n===1||isNaN(n)||(o[a].order=Number(n)+1)}),this.filters=o}includes(r){return this.textContent.match(new RegExp(r,"i"))!==null}connectedCallback(){super.connectedCallback(),this.addEventListener(Oi,this.handleQuantitySelection),this.addEventListener(tf,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange),this.addEventListener(Cn,this.handleAemFragmentEvents),this.addEventListener(En,this.handleAemFragmentEvents),this.aemFragment||setTimeout(()=>this.checkReady(),0)}disconnectedCallback(){super.disconnectedCallback(),this.variantLayout.disconnectedCallbackHook(),this.removeEventListener(Oi,this.handleQuantitySelection),this.storageOptions?.removeEventListener(Di,this.handleStorageChange),this.removeEventListener(Cn,this.handleAemFragmentEvents),this.removeEventListener(En,this.handleAemFragmentEvents)}async handleAemFragmentEvents(r){if(r.type===Cn&&Ni(this,kn,Op).call(this,"AEM fragment cannot be loaded"),r.type===En&&r.target.nodeName==="AEM-FRAGMENT"){let o=r.detail;await Bx(o,this),this.checkReady()}}async checkReady(){let r=Promise.all([...this.querySelectorAll('span[is="inline-price"][data-wcs-osi],a[is="checkout-link"][data-wcs-osi]')].map(n=>n.onceSettled().catch(()=>n))).then(n=>n.every(s=>s.classList.contains("placeholder-resolved"))),o=new Promise(n=>setTimeout(()=>n(!1),t5));if(await Promise.race([r,o])===!0){this.dispatchEvent(new CustomEvent(af,{bubbles:!0,composed:!0}));return}Ni(this,kn,Op).call(this,"Contains unresolved offers")}get aemFragment(){return this.querySelector("aem-fragment")}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let r=this.storageOptions?.selected;if(r){let o=this.querySelector(`merch-offer-select[storage="${r}"]`);if(o)return o}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(rf,{bubbles:!0}))}handleStorageChange(){let r=this.closest("merch-card")?.offerSelect.cloneNode(!0);r&&this.dispatchEvent(new CustomEvent(Di,{detail:{offerSelect:r},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(r){if(r===this.merchOffer)return;this.merchOffer=r;let o=this.dynamicPrice;if(r.price&&o){let a=r.price.cloneNode(!0);o.onceSettled?o.onceSettled().then(()=>{o.replaceWith(a)}):o.replaceWith(a)}}};qp=new WeakMap,kn=new WeakSet,Op=function(r){this.dispatchEvent(new CustomEvent(nf,{detail:r,bubbles:!0,composed:!0}))},D(b,"properties",{name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color",reflect:!0},borderColor:{type:String,attribute:"border-color",reflect:!0},badgeBackgroundColor:{type:String,attribute:"badge-background-color",reflect:!0},backgroundImage:{type:String,attribute:"background-image",reflect:!0},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},customHr:{type:Boolean,attribute:"custom-hr"},consonant:{type:Boolean,attribute:"consonant"},spectrum:{type:String,attribute:"spectrum"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:r=>{let[o,a,n]=r.split(",");return{PUF:o,ABM:a,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:r=>Object.fromEntries(r.split(",").map(o=>{let[a,n,s]=o.split(":"),i=Number(n);return[a,{order:isNaN(i)?void 0:i,size:s}]})),toAttribute:r=>Object.entries(r).map(([o,{order:a,size:n}])=>[o,a,n].filter(s=>s!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object},analyticsId:{type:String,attribute:Fi,reflect:!0}}),D(b,"styles",[Qp,Of(),...Yp()]);customElements.define(x,b)});l();c();
/*! Bundled license information:

react/cjs/react.production.min.js:
  (**
   * @license React
   * react.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

scheduler/cjs/scheduler.production.min.js:
  (**
   * @license React
   * scheduler.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react-dom/cjs/react-dom.production.min.js:
  (**
   * @license React
   * react-dom.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/

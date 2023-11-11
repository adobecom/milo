// Thu, 16 Nov 2023 22:43:24 GMT
import{css as H,html as M,LitElement as j}from"./lit-all.min.js";var k="hashchange";function _(i=window.location.hash){let e=[],t=i.replace(/^#/,"").split("&");for(let n of t){let[a,o=""]=n.split("=");a&&e.push([a,decodeURIComponent(o)])}return Object.fromEntries(e)}function m(i){let e=new URLSearchParams(window.location.hash.slice(1));Object.entries(i).forEach(([t,n])=>{n?e.set(t,n):e.delete(t)}),window.location.hash=decodeURIComponent(e.toString())}function w(i){let e=t=>{let n=_(window.location.hash);i(n)};return e(),window.addEventListener(k,e),()=>{window.removeEventListener(k,e)}}var S="(max-width: 899px)",d="(min-width: 900px)",h="(min-width: 1200px)",z="(min-width: 1440px)";var E=document.createElement("style");E.innerHTML=`
:root {

    --consonant-merch-card-detail-font-size: 12px;
    --consonant-merch-card-detail-font-weight: 500;
    --consonant-merch-card-detail-letter-spacing: 0.8px;
    --consonant-merch-card-background-color: #fff;

    --consonant-merch-card-heading-font-size: 18px;
    --consonant-merch-card-heading-line-height: 22.5px;
    --consonant-merch-card-heading-secondary-font-size: 14px;
    --consonant-merch-card-body-font-size: 14px;
    --consonant-merch-card-body-line-height: 21px;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* headings */
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
    --consonant-merch-card-body-m-font-size: 18px;
    --consonant-merch-card-body-m-line-height: 27px;
    --consonant-merch-card-body-l-font-size: 20px;
    --consonant-merch-card-body-l-line-height: 30px;
    --consonant-merch-card-body-xl-font-size: 22px;
    --consonant-merch-card-body-xl-line-height: 33px;


    --consonant-merch-card-heading-padding: 0;
    --consonant-merch-card-image-height: 180px;

    /* colors */
    --consonant-merch-card-border-color: #eaeaea;
    --color-accent: #1473E6;
    --color-black: #000;

    /* merch card generic */
    --consonant-merch-card-max-width: 378px;

    /* special offers mobile */
    --consonant-merch-card-special-offer-width: 300px;

    /* inline-heading */
    --consonant-merch-card-inline-heading-max-width: 378px;

    /* plans */
    --consonant-merch-card-plans-max-width: 302px;
    --consonant-merch-card-plans-icon-size: 40px;

    /* catalog */
    --consonant-merch-card-catalog-width: 300px;
    --consonant-merch-card-catalog-icon-size: 40px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='10' height='10' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" data-name="Group 308011"><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 70" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 72" transform="translate(0 6)"/></svg>');

}

merch-cards {
    display: contents;
}

.one-merch-card,
.two-merch-cards,
.three-merch-cards,
.four-merch-cards {
    display: grid;
    justify-content: center;
    justify-items: center;
    padding: var(--spacing-m);
    gap: var(--spacing-m);
}

@media screen and ${S} {
    .one-merch-card,
    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: fit-content(100%);
    }
}

/* Tablet */
@media screen and ${d} {
    :root {
        --consonant-merch-card-special-offer-width: 302px;
        --consonant-merch-card-catalog-width: 302px;
    }

    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: repeat(2, fit-content(100%));
    }
}

/* desktop */
@media screen and ${h} {
    :root {
        --consonant-merch-card-special-offer-width: 378px;
        --consonant-merch-card-catalog-width: 276px;
    }

    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: repeat(3, fit-content(100%));
    }
}

/* Large desktop */
    @media screen and ${z} {
    :root {

    }

    .four-merch-cards {
        grid-template-columns: repeat(4, fit-content(100%));
    }
}

[class*="-merch-cards"].m-gap {
    gap: var(--consonant-merch-spacing-xs);
    padding: var(--consonant-merch-spacing-xs);
}

[class*="-merch-cards"].l-gap {
    gap: var(--consonant-merch-spacing-s);
}

[class*="-merch-cards"].xl-gap {
    gap: var(--consonant-merch-spacing-m);
}

div[class$='-badge'] {
    position: absolute;
    top: 16px;
    right: 0;
    font-size: var(--type-heading-xxs-size);
    font-weight: 500;
    max-width: 150px;
    line-height: 16px;
    text-align: center;
    padding: 8px 11px;
    border-radius: 5px 0 0 5px;
}

merch-card.background-opacity-70 {
    background-color: rgba(255 255 255 / 70%);
}

merch-card hr {
    background-color: var(--color-gray-200);
    border: none;
    height: 1px;
    width: 100%;
    margin-bottom: var(--consonant-merch-card-spacing-xs);
}

merch-card.has-divider hr {
    margin: var(--consonant-merch-card-spacing-xs) 0;
    margin-bottom: var(--spacing-xxs);
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="priceStrikethrough"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
}

merch-card[variant="segment"] {
    max-width: var(--consonant-merch-card-segment-max-width);
}

merch-card[variant="plans"] {
    max-width: var(--consonant-merch-card-plans-max-width);
}

merch-card[variant="inline-heading"] {
    max-width: var(--consonant-merch-card-inline-heading-max-width);
}

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card span[is=inline-price] {
    display: inline-block;
}

merch-card [slot='heading-xs'] {
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    margin: 0;
    margin-bottom: var(--consonant-merch-spacing-xxs);
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

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
}

merch-card[variant="catalog"] [slot="action-menu-content"] {
    background-color: #000;
    color: #fff;
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

merch-card[variant="catalog"] [slot="action-menu-content"] a {
    color: var(--consonant-merch-card-background-color);
    text-decoration: underline;
}

.button--inactive {
    display: none;
}

div[slot="footer"] a.con-button {
    margin-left: var(--consonant-merch-spacing-xs);
}
`;document.head.appendChild(E);import{html as c,LitElement as B}from"./lit-all.min.js";import{css as P,unsafeCSS as C}from"./lit-all.min.js";var A=P`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 100%;
        flex: 1 1 0;
        text-align: left;
        border-radius: var(--consonant-merch-spacing-xxxs);
        background-color: var(--consonant-merch-card-background-color);
        overflow: auto;
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--consonant-merch-card-background-color);
        font-family: var(--body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: 1px solid var(--consonant-merch-card-border-color);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    slot {
        display: block;
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        flex-flow: wrap;
        align-items: center;
    }

    .top-section > .icons img:last-child {
        margin-right: var(--consonant-merch-spacing-xs);
    }

    .icons {
        display: flex;
        width: fit-content;
        fle-direction: row;
    }

    .icons img {
        width: var(--consonant-merch-card-plans-icon-size);
        height: var(--consonant-merch-card-plans-icon-size);
        margin-right: var(--consonant-merch-spacing-xxs);
    }

    .body {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 100%;
        flex-direction: column;
        gap: var(--consonant-merch-spacing-xxs);
        padding: var(--consonant-merch-spacing-xs);
    }

    ::slotted([slot='footer']) {
        display: flex;
        justify-content: flex-end;
        margin-top: auto;
        box-sizing: border-box;
        align-self: flex-end;
        width: 100%;
        padding: var(--consonant-merch-spacing-xs);
    }

    hr {
        background-color: var(--color-gray-200);
        border: none;
        height: 1px;
        width: auto;
        margin-top: 0;
        margin-bottom: 0;
        margin-left: var(--consonant-merch-spacing-xs);
        margin-right: var(--consonant-merch-spacing-xs);
    }

    div[class$='-ribbon'] {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: var(--type-heading-xxs-size);
        font-weight: 500;
        max-width: 150px;
        line-height: 16px;
        text-align: center;
        padding: 8px 11px;
        border-radius: 5px 0 0 5px;
    }

    .body .catalog-ribbon {
        display: flex;
        height: fit-content;
        flex-direction: column;
        width: fit-content;
        border-radius: 5px;
        position: relative;
        top: 0;
        margin-left: var(--consonant-merch-spacing-xxs);
    }

    .image {
        flex-grow: 1;
        position: relative;
        width: 100%;
        min-height: var(--consonant-merch-card-image-height);
        max-height: var(--consonant-merch-card-image-height);
        background-color: var(--background-color);
        background-position: 50% 50%;
        background-repeat: no-repeat;
        background-size: cover;
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
    }
    .hidden {
        visibility: hidden;
    }

    .standard-wrapper {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xs);
        align-items: center;
        justify-content: space-between;
        padding-inline-start: var(--consonant-merch-spacing-xs);
    }

    #stock-checkbox,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--color-gray-600);
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

    :host([variant='special-offers']) {
        min-height: 438px;
        width: 378px;
    }

    :host([variant='special-offers'].center) {
        text-align: center;
    }

    :host([variant='special-offers'].wide) {
        grid-column: span 3;
        width: auto;
    }

    :host([variant='special-offers'].super-wide) {
        grid-column: span 3;
        width: auto;
    }

    /* catalog */
    :host([variant='catalog']) {
        width: var(--consonant-merch-card-catalog-width);
        min-height: 296px;
    }

    :host([size='super-wide']) {
        grid-column: span 4;
        width: initial;
        justify-self: stretch;
    }

    :host([size='wide']) {
        grid-column: span 2;
        width: initial;
        justify-self: stretch;
    }

    /* Tablet */
    @media screen and ${C(d)} {
    }

    /* Laptop */
    @media screen and ${C(h)} {
    }
`;var[x,u,$,O,R,f]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var p="MERCH-CARD",D="merch-card",b=class extends B{static properties={name:{type:String},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},icons:{type:Array},actionmenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},title:{type:String},description:{type:String},image:{type:String,attribute:"image"},customHr:{type:String,attribute:"hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{let[t,n,a]=e.split(",");return{PUF:t,ABM:n,M2M:a}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(t=>{let[n,a,o]=t.split(":"),l=Number(a);return[n,{order:isNaN(l)?void 0:l,size:o}]})),toAttribute:e=>Object.entries(e).map(([t,{order:n,size:a}])=>[t,n,a].filter(o=>o!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0}};static styles=[A];constructor(){super(),this.filters={},this.types=""}updated(e){e.has("badgeBackgroundColor")&&(this.style.border=`1px solid ${this.badgeBackgroundColor}`)}renderIcons(){return this.icons&&this.icons.length>0?c`
                  <div class="icons">
                      ${this.icons.map(e=>c`<img src="${e.src}" alt="${e.alt}" />`)}
                  </div>
              `:""}get evergreen(){this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?c`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get plansFooter(){let e=c` <slot name="footer"></slot>`,t=this.secureLabel;return t?c`<div class="standard-wrapper">
                  <span class="secure-transaction-label">${t}</span>
                  ${e}
              </div>`:e}get ribbon(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),c`
            <div
                class="${this.variant}-ribbon"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${e}"
            >
                ${this.badgeText}
            </div>
        `}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]').assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}toggleStockOffer(e){if(!this.stockOfferOsis)return;let t=this.checkoutLinks;t.length!==0&&t.forEach(n=>{let a=n.value?.offers?.[0]?.planType;if(!a)return;let o=this.stockOfferOsis[a];if(!o)return;let l=n.dataset.wcsOsi.split(",").filter(r=>r!==o);e.target.checked&&l.push(o),n.dataset.wcsOsi=l.join(",")})}toggleActionMenu(e){let t=e?.type==="mouseleave"?!0:void 0,n=this.shadowRoot.querySelector('slot[name="action-menu-content"]');n&&n.classList.toggle("hidden",t)}get title(){return this.querySelector('[slot="heading-xs"]').textContent.trim()}updateFilters(e){let t={...this.filters};Object.keys(t).forEach(n=>{if(e){t[n].order=Math.min(t[n].order,2);return}let a=t[n].order;a===1||isNaN(a)||(t[n].order=Number(a)+1)}),this.filters=t}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}render(){switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"inline-heading":return this.renderInlineHeading();default:return c` <div />`}}renderSpecialOffer(){return c` <div
                class="image"
                style="${this.image?`background-image: url(${this.image})`:""}"
            >
                ${this.ribbon}
            </div>
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?c`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:c`
                      <hr />
                      <slot name="footer"></slot>
                  `}`}renderSegment(){return c` ${this.ribbon}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            <slot name="footer"></slot>`}renderPlans(){return c` ${this.ribbon}
            <div class="body">
                ${this.renderIcons()}
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="body-xs"></slot>
                ${this.stockCheckbox}
            </div>
            ${this.plansFooter}`}renderCatalog(){return c` <div class="body">
                <div class="top-section">
                    ${this.renderIcons()} ${this.ribbon}
                    <div
                        class="action-menu ${this.actionmenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content ${this.actionMenuContent?"":"hidden"}"
                    >${this.actionMenuContent}</slot
                >
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="body-xs"></slot>
            </div>
            <slot name="footer"></slot>`}renderInlineHeading(){return c`
            ${this.ribbon}
            <div class="body">
                <div class="top-section">
                    ${this.renderIcons()}
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            <slot name="footer"></slot>
        `}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex","0"),this.addEventListener("keydown",this.keydownHandler),this.addEventListener("mouseleave",this.toggleActionMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler)}keydownHandler(e){let t=document.activeElement;if(t&&t.tagName===p){let n=function(L,N){e.code===f&&e.preventDefault();let y=document.elementFromPoint(L,N)?.closest(p);y&&(y.focus(),e.preventDefault())},{x:a,y:o,width:l,height:r}=t.getBoundingClientRect(),s=64;switch(e.code===f?e.shiftKey?x:u:e.code){case x:n(a-s,o+s);break;case u:n(a+l+s,o+s);break;case $:n(a+s,o-s);break;case O:n(a+s,o+r+s);break;case R:this.footerSlot?.querySelector("a")?.click();break}}}};customElements.get(D.toLowerCase())||customElements.define("merch-card",b);var T="merch-cards",v={alphabetical:"alphabetical",authored:0},I=(i,{filter:e})=>i.filter(t=>t.filters.hasOwnProperty(e)),U=(i,{types:e})=>e?(e=e.split(","),i.filter(t=>e.some(n=>t.types.includes(n)))):i,F=i=>i.sort((e,t)=>(e.title??"").localeCompare(t.title??"","en",{sensitivity:"base"})),W=(i,{filter:e})=>i.sort((t,n)=>n.filters[e]?.order==null||isNaN(n.filters[e]?.order)?-1:t.filters[e]?.order==null||isNaN(t.filters[e]?.order)?1:t.filters[e].order-n.filters[e].order),q=(i,{search:e})=>e?.length?(e=e.toLowerCase(),i.filter(t=>t.includes(e))):i,g=class extends j{static properties={filter:{type:String,attribute:"filter",reflect:!0},filtered:{type:String,attribute:"filtered"},search:{type:String,attribute:"search",reflect:!0},sort:{type:Number,attribute:"sort",default:v.authored,reflect:!0},types:{type:String,attribute:"types",reflect:!0},limit:{type:Number,attribute:"limit"},page:{type:Number,attribute:"page",reflect:!0},singleApp:{type:String,attribute:"single_app"},showMoreText:{type:String,attribute:"show-more-text"},hasMore:{type:Boolean}};constructor(){super(),this.filter="all",this.hasMore=!1}render(){return M`<slot></slot> ${this.showMoreButton}`}updated(e){let t=[...this.children].filter(r=>r.tagName===p);e.has("singleApp")&&this.singleApp&&t.forEach(r=>{r.updateFilters(r.name===this.singleApp)});let n=this.sort===v.alphabetical?F:W,o=[I,U,q,n].reduce((r,s)=>s(r,this),t).map((r,s)=>[r,s]);if(this.page&&this.limit){let r=this.page*this.limit;this.hasMore=o.length>r,o=o.filter(([,s])=>s<r)}o.length>0&&(this.cardToScrollTo=o[o.length-1][0]);let l=new Map(o);t.forEach(r=>{l.has(r)?(r.style.order=l.get(r),r.size=r.filters[this.filter]?.size,r.style.removeProperty("display")):(r.style.display="none",r.size=void 0,r.style.removeProperty("order"))})}connectedCallback(){super.connectedCallback(),this.startDeeplink(),this.filtered&&(this.filter=this.filtered),this.updateComplete.then(()=>{this.prepareShowMore()})}disconnectedCallback(){super.disconnectedCallback(),this.stopDeeplink()}get showMoreButton(){if(this.hasMore)return M`<button style="order: 1000;" @click="${this.showMore}">
            ${this.showMoreText}
        </button>`}showMore(){m({page:this.page+1}),setTimeout(()=>{this.scrollToShowMore()},1)}prepareShowMore(){this.page?this.limit=this.limit||24:this.page=1}scrollToShowMore(){this.cardToScrollTo.scrollIntoView({behavior:"smooth"})}startDeeplink(){this.stopDeeplink=w(({filter:e,types:t,sort:n,search:a,single_app:o,page:l})=>{!this.filtered&&e&&e!==this.filter&&setTimeout(()=>{m({page:void 0}),this.page=1},1),this.filtered||(this.filter=e??this.filter),this.types=t??"",this.search=a??"",this.singleApp=o,this.sort=n,this.page=Number(l)||this.page})}static styles=[H`
            :host > button {
                grid-column: 1 / -1;
                place-self: baseline;
                background-color: transparent;
                border-radius: 16px;
                border: 2px solid var(--text-color, #2c2c2c);
                color: var(--text-color, #2c2c2c);
                display: inline-block;
                font-size: 15px;
                font-style: normal;
                font-weight: 700;
                line-height: 16px;
                padding: 5px 14px;
            }

            :host > button:hover {
                background-color: var(--color-black, #000);
                border-color: var(--color-black, #000);
                color: var(--color-white, #fff);
            }
        `]};g.SortOrder=v;customElements.get(T)||customElements.define(T,g);export{g as MerchCards};

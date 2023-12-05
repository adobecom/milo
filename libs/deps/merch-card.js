// Thu, 16 Nov 2023 19:37:46 GMT
import{html as a,LitElement as C}from"./lit-all.min.js";import{css as S,unsafeCSS as b}from"./lit-all.min.js";var p="(max-width: 899px)",l="(min-width: 700px) and (max-width: 1199px)",h="(min-width: 1200px)",x="(min-width: 1440px)";var f=S`
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
        padding-top: var(--consonant-merch-spacing-xs);
        padding-bottom: var(--consonant-merch-spacing-xs);
        pading-left: 0;
        padding-left: var(--consonant-merch-spacing-xs);
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
        padding-left: var(--consonant-merch-spacing-xs);
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

    :host([type='super-wide']) {
        grid-column: span 4;
    }

    :host([type='wide']) {
        grid-column: span 2;
    }

    :host([variant='special-offers']) {
        min-height: 438px;
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
        min-height: 296px;
    }

    :host([variant='catalog'][type='wide']) {
        width: auto;
    }

    :host([variant='catalog'][type='super-wide']) {
        width: auto;
    }

    /* Tablet */
    @media screen and ${b(l)} {
    }

    /* Laptop */
    @media screen and ${b(h)} {
    }
`;var[u,v,y,w]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];var k=document.createElement("style");k.innerHTML=`
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

    /* responsive width */
    --consonant-merch-card-mobile-width: 300px;

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
    --color-grey-80: #2c2c2c;

    /* merch card generic */
    --consonant-merch-card-max-width: 378px;

    /* special offers mobile */
    --consonant-merch-card-special-offer-width: 300px;

    /* special offers */
    --consonant-merch-card-special-offers-width: 378px;

    /* segment */
    --consonant-merch-card-segment-width: 378px;

    /* inline-heading */
    --consonant-merch-card-inline-heading-width: 378px;

    /* plans */
    --consonant-merch-card-plans-max-width: 302px;
    --consonant-merch-card-plans-width: 276px;
    --consonant-merch-card-plans-icon-size: 40px;

    /* catalog */
    --consonant-merch-card-catalog-width: 276px;
    --consonant-merch-card-catalog-icon-size: 40px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xml:space='preserve' width='10' height='10' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" data-name="Group 308011"><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 70" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 72" transform="translate(0 6)"/></svg>');

}

merch-cards {
    display: contents;
}

merch-cards > button {
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

merch-cards > button:hover {
    background-color: var(--color-black, #000);
    border-color: var(--color-black, #000);
    color: var(--color-white, #fff);
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


merch-card[variant="special-offers"] {
    width: var(--consonant-merch-card-special-offers-width);
}

merch-card[variant="segment"] {
    width: var(--consonant-merch-card-segment-width);
}

merch-card[variant="plans"] {
    width: var(--consonant-merch-card-plans-width);
}

merch-card[variant="inline-heading"] {
    width: var(--consonant-merch-card-inline-heading-width);
}

merch-card[variant="catalog"] {
    width: var(--consonant-merch-card-catalog-width);
}

@media screen and ${p} {
    :root {
        --consonant-merch-card-mobile-width: 300px;
    }
    .one-merch-card,
    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: fit-content(100%);
    }

    merch-card[variant="special-offers"].merch-card,
    merch-card[variant="segment"].merch-card,
    merch-card[variant="plans"].merch-card,
    merch-card[variant="catalog"].merch-card,
    merch-card[variant="inline-heading"].merch-card {
        width: var(--consonant-merch-card-mobile-width);
    }
}

/* Tablet */
@media screen and ${l} {
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
    @media screen and ${x} {
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
    padding: var(--consonant-merch-spacing-s);
}

[class*="-merch-cards"].xl-gap {
    gap: var(--consonant-merch-spacing-m);
    padding: var(--consonant-merch-spacing-m);
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
    margin-bottom: var(--spacing-xxs);
}

merch-card[variant="special-offers"] span[is="inline-price"][data-template="strikethrough"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
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
    color: var(--color-grey-80);
}

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
    color: var(--color-grey-80);
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
    color: var(--color-grey-80);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
    color: var(--color-grey-80);
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
    color: var(--color-grey-80);
}

merch-card [slot='detail-m'] {
    font-size: var(--consonant-merch-card-detail-m-font-size);
    letter-spacing: var(--consonant-merch-card-detail-m-letter-spacing);
    font-weight: var(--consonant-merch-card-detail-m-font-weight);
    text-transform: uppercase;
    margin: 0;
    color: var(--color-grey-80);
}

merch-card [slot="body-xxs"] {
    font-size: var(--consonant-merch-card-body-xxs-font-size);
    line-height: var(--consonant-merch-card-body-xxs-line-height);
    font-weight: normal;
    letter-spacing: var(--consonant-merch-card-body-xxs-letter-spacing);
    color: var(--color-grey-80);
}

merch-card [slot="body-xs"] {
    font-size: var(--consonant-merch-card-body-xs-font-size);
    line-height: var(--consonant-merch-card-body-xs-line-height);
    color: var(--color-grey-80);
}

merch-card [slot="body-m"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    line-height: var(--consonant-merch-card-body-m-line-height);
    color: var(--color-grey-80);
}

merch-card [slot="body-l"] {
    font-size: var(--consonant-merch-card-body-l-font-size);
    line-height: var(--consonant-merch-card-body-l-line-height);
    color: var(--color-grey-80);
}

merch-card [slot="body-xl"] {
    font-size: var(--consonant-merch-card-body-xl-font-size);
    line-height: var(--consonant-merch-card-body-xl-line-height);
    color: var(--color-grey-80);
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

.button--inactive {
    display: none;
}

div[slot="footer"] a.con-button {
    margin-right: var(--consonant-merch-spacing-xs);
}

div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-image-height);
    max-height: var(--consonant-merch-card-image-height);
    object-fit: cover;
}

`;document.head.appendChild(k);var E="MERCH-CARD",$="merch-card",m=class extends C{static properties={name:{type:String},variant:{type:String},type:{type:String},badgeColor:{type:String,attribute:"badge-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},icons:{type:Array},actionmenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},title:{type:String},description:{type:String},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},stockOfferOsi:{type:String,attribute:"stock-offer-osi"},evergreen:{type:Boolean},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(n=>{let[t,o]=n.split(":"),r=Number(o);return[t,isNaN(r)?{}:r]})),toAttribute:e=>Object.entries(e).map(([n,t])=>isNaN(t)?n:`${n}:${t}`).join(",")}},types:{type:String,attribute:"types",reflect:!0}};static styles=[f];constructor(){super(),this.filters={},this.types=""}updated(e){e.has("badgeBackgroundColor")&&(this.style.border=`1px solid ${this.badgeBackgroundColor}`)}renderIcons(){return this.icons&&this.icons.length>0?a`
                  <div class="icons">
                      ${this.icons.map(e=>a`<img src="${e.src}" alt="${e.alt}" />`)}
                  </div>
              `:""}get stockCheckbox(){return this.checkboxLabel?a`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get plansFooter(){let e=a` <slot name="footer"></slot>`,n=this.secureLabel;return n?a`<div class="standard-wrapper">
                  <span class="secure-transaction-label">${n}</span>
                  ${e}
              </div>`:e}decorateRibbon(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),a`
            <div
                class="${this.variant}-ribbon"
                style="background-color: ${this.badgeBackgroundColor}; color: ${this.badgeColor}; ${e?` ${e}`:""}"
            >
                ${this.badgeText}
            </div>
        `}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]').assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}toggleStockOffer(e){this.stockOfferOsi&&this.toggleStock(this.checkoutLinks,e.target.checked)}toggleStock(e,n){e.length!==0&&e.forEach(t=>{let o=t.dataset.wcsOsi.split(",").filter(r=>r!==this.stockOfferOsi);n&&o.push(this.stockOfferOsi),t.dataset.wcsOsi=o.join(",")})}toggleActionMenu(e){let n=e?.type==="mouseleave"?!0:void 0,t=this.shadowRoot.querySelector('slot[name="action-menu-content"]');t&&t.classList.toggle("hidden",n)}get title(){return this.querySelector('[slot="heading-xs"]').textContent.trim()}updateFilters(e){let n={...this.filters};Object.keys(n).forEach(t=>{if(e){n[t]=Math.min(n[t],2);return}let o=n[t];o===1||isNaN(o)||(n[t]=Number(o)+1)}),this.filters=n}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}render(){switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"inline-heading":return this.renderInlineHeading();default:return this.renderDefault()}}renderSpecialOffer(){return a` <div class="image">
                <slot name="bg-image"></slot>
                ${this.decorateRibbon()}
            </div>
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?a`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:a`
                      <hr />
                      <slot name="footer"></slot>
                  `}`}renderSegment(){return a` ${this.decorateRibbon()}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            <slot name="footer"></slot>`}renderPlans(){return a` ${this.decorateRibbon()}
            <div class="body">
                ${this.renderIcons()}
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="body-xs"></slot>
                ${this.stockCheckbox}
            </div>
            ${this.plansFooter}`}renderCatalog(){return a` <div class="body">
                <div class="top-section">
                    ${this.renderIcons()} ${this.decorateRibbon()}
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
            <slot name="footer"></slot>`}renderInlineHeading(){return a`
            ${this.decorateRibbon()}
            <div class="body">
                <div class="top-section">
                    ${this.renderIcons()}
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            ${this.customHr?"":a`<hr />`}
            <slot name="footer"></slot>
        `}renderDefault(){return a` ${this.decorateRibbon()}
            <div class="body">
                ${this.renderIcons()}
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            <slot name="footer"></slot>`}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex","0"),this.addEventListener("keydown",this.keydownHandler),this.addEventListener("mouseleave",this.toggleActionMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler)}keydownHandler(e){let n=document.activeElement;if(n&&n.tagName===E){let s=function(c){let i=o.indexOf(c);return{row:Math.floor(i/r),col:i%r}},t,o=Array.from(this.parentElement.querySelectorAll("merch-card")).filter(c=>window.getComputedStyle(c).display!=="none").sort((c,i)=>parseInt(window.getComputedStyle(c).order,0)-parseInt(window.getComputedStyle(i).order,0)),r=1,z=o[0].getBoundingClientRect().top;for(;r<o.length&&o[r].getBoundingClientRect().top===z;)r++;switch(e.code){case u:let c=s(n);c.col>0&&(t=o[c.row*r+(c.col-1)]);break;case v:let i=s(n);i.col<r-1&&(t=o[i.row*r+(i.col+1)]);break;case y:let g=s(n);g.row>0&&(t=o[(g.row-1)*r+g.col]);break;case w:let d=s(n);d.row<Math.floor(o.length/r)-(o.length%r>d.col?0:1)&&(t=o[(d.row+1)*r+d.col]);break}t&&(t.focus(),e.preventDefault())}}};customElements.get($.toLowerCase())||customElements.define("merch-card",m);export{$ as MERCH_CARD,E as MERCH_CARD_NODE_NAME,m as MerchCard};

// Fri, 17 Nov 2023 13:17:30 GMT
import{html as r,LitElement as $}from"./lit-all.min.js";import{css as A,unsafeCSS as f}from"./lit-all.min.js";var x="(max-width: 899px)",s="(min-width: 900px)",d="(min-width: 1200px)",b="(min-width: 1440px)";var u=A`
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
        flex: 1;
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
        position: relative;
        width: 100%;
        height: var(--consonant-merch-card-image-height);
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
        min-height: 454px;
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

    /* plans */
    :host([variant='plans']) {
        width: var(--consonant-merch-card-plans-width);
        min-height: 348px;
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
    @media screen and ${f(s)} {
    }

    /* Laptop */
    @media screen and ${f(d)} {
    }
`;var[g,m,v,y,k,w]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var z=document.createElement("style");z.innerHTML=`
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
    --color-grey-80: #2c2c2c;

    /* merch card generic */
    --consonant-merch-card-max-width: 378px;

    /* special offers mobile */
    --consonant-merch-card-special-offer-width: 300px;

    /* inline-heading */
    --consonant-merch-card-inline-heading-max-width: 378px;

    /* plans */
    --consonant-merch-card-plans-width: 300px;
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

@media screen and ${x} {
    .one-merch-card,
    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: fit-content(100%);
    }
}

/* Tablet */
@media screen and ${s} {
    :root {
        --consonant-merch-card-special-offer-width: 302px;
        --consonant-merch-card-catalog-width: 302px;
        --consonant-merch-card-plans-width: 302px;
    }

    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: repeat(2, fit-content(100%));
    }
}

/* desktop */
@media screen and ${d} {
    :root {
        --consonant-merch-card-special-offer-width: 378px;
        --consonant-merch-card-catalog-width: 276px;
        --consonant-merch-card-plans-width: 276px;
    }

    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: repeat(3, fit-content(100%));
    }
}

/* Large desktop */
    @media screen and ${b} {
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
`;document.head.appendChild(z);var E="MERCH-CARD",O="merch-card",p=class extends ${static properties={name:{type:String},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},icons:{type:Array},actionmenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},title:{type:String},description:{type:String},image:{type:String,attribute:"image"},customHr:{type:String,attribute:"hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{let[n,t,o]=e.split(",");return{PUF:n,ABM:t,M2M:o}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(n=>{let[t,o,a]=n.split(":"),c=Number(o);return[t,{order:isNaN(c)?void 0:c,size:a}]})),toAttribute:e=>Object.entries(e).map(([n,{order:t,size:o}])=>[n,t,o].filter(a=>a!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0}};static styles=[u];constructor(){super(),this.filters={},this.types=""}updated(e){e.has("badgeBackgroundColor")&&(this.style.border=`1px solid ${this.badgeBackgroundColor}`)}renderIcons(){return this.icons&&this.icons.length>0?r`
                  <div class="icons">
                      ${this.icons.map(e=>r`<img src="${e.src}" alt="${e.alt}" />`)}
                  </div>
              `:""}get evergreen(){this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?r`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get plansFooter(){let e=r` <slot name="footer"></slot>`,n=this.secureLabel;return n?r`<div class="standard-wrapper">
                  <span class="secure-transaction-label">${n}</span>
                  ${e}
              </div>`:e}get ribbon(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),r`
            <div
                class="${this.variant}-ribbon"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${e}"
            >
                ${this.badgeText}
            </div>
        `}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]').assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}toggleStockOffer(e){if(!this.stockOfferOsis)return;let n=this.checkoutLinks;n.length!==0&&n.forEach(t=>{let o=t.value?.offers?.[0]?.planType;if(!o)return;let a=this.stockOfferOsis[o];if(!a)return;let c=t.dataset.wcsOsi.split(",").filter(l=>l!==a);e.target.checked&&c.push(a),t.dataset.wcsOsi=c.join(",")})}toggleActionMenu(e){let n=e?.type==="mouseleave"?!0:void 0,t=this.shadowRoot.querySelector('slot[name="action-menu-content"]');t&&t.classList.toggle("hidden",n)}get title(){return this.querySelector('[slot="heading-xs"]').textContent.trim()}updateFilters(e){let n={...this.filters};Object.keys(n).forEach(t=>{if(e){n[t].order=Math.min(n[t].order,2);return}let o=n[t].order;o===1||isNaN(o)||(n[t].order=Number(o)+1)}),this.filters=n}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}render(){switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"inline-heading":return this.renderInlineHeading();default:return r` <div />`}}renderSpecialOffer(){return r` <div class="image">
                <slot name="bg-image"></slot>
                ${this.ribbon}
            </div>
            <div class="body">
                <slot name="detail-m"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.evergreen?r`
                      <div
                          class="detail-bg-container"
                          style="background: ${this.detailBg}"
                      >
                          <slot name="detail-bg"></slot>
                      </div>
                  `:r`
                      <hr />
                      <slot name="footer"></slot>
                  `}`}renderSegment(){return r` ${this.ribbon}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            <slot name="footer"></slot>`}renderPlans(){return r` ${this.ribbon}
            <div class="body">
                ${this.renderIcons()}
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="body-xs"></slot>
                ${this.stockCheckbox}
            </div>
            ${this.plansFooter}`}renderCatalog(){return r` <div class="body">
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
            <slot name="footer"></slot>`}renderInlineHeading(){return r`
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
        `}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex","0"),this.addEventListener("keydown",this.keydownHandler),this.addEventListener("mouseleave",this.toggleActionMenu)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler)}keydownHandler(e){let n=document.activeElement?.closest(E);if(!n)return;function t(S,C){let h=document.elementFromPoint(S,C)?.closest(E);h&&(e.preventDefault(),h.focus(),h.scrollIntoView({behavior:"smooth",block:"center"}))}let{x:o,y:a,width:c,height:l}=n.getBoundingClientRect(),i=64;switch(e.code===w?e.shiftKey?g:m:e.code){case g:t(o-i,a);break;case m:t(o+c+i,a);break;case v:t(o,a-i);break;case y:t(o,a+l+i);break;case k:this.footerSlot?.querySelector("a")?.click();break}}};customElements.get(O.toLowerCase())||customElements.define("merch-card",p);export{O as MERCH_CARD,E as MERCH_CARD_NODE_NAME,p as MerchCard};
//# sourceMappingURL=merch-card.js.map

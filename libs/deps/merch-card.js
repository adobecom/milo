// Fri, 03 Nov 2023 15:27:51 GMT
import{html as r,LitElement as T}from"./lit-all.min.js";import{css as R,unsafeCSS as v}from"./lit-all.min.js";var f="(max-width: 899px)",h="(min-width: 900px)",m="(min-width: 1200px)",u="(min-width: 1440px)";var y=R`
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
    }

    slot {
        display: block;
    }

    .top-section {
        display: flex;
        justify-content: flex-start;
        height: 100%;
        flex-direction: row;
        flex-wrap: wrap;
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
    }

    .checkbox-label,
    .secure-transaction-label {
        font-size: var(--consonant-merch-card-body-xxs-font-size);
        line-height: 1.3;
        color: var(--color-gray-600);
    }

    .secure-transaction-label {
        white-space: nowrap;
    }

    .secure-transaction-icon {
        width: 12px;
        height: 15px;
        display: inline-block;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

    .checkbox-container,
    .secure-transaction-wrapper {
        display: flex;
        align-items: center;
        gap: var(--consonant-merch-spacing-xxs);
    }

    .secure-transaction-wrapper {
        padding-left: var(--consonant-merch-spacing-xs);
    }

    .checkbox-container input[type='checkbox']:checked + .checkmark {
        background-color: var(--color-accent);
        background-image: var(--checkmark-image);
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

    :host([variant='special-offers'][type='wide']) {
        width: auto;
        min-height: 438px;
    }

    :host([variant='special-offers'][type='super-wide']) {
        width: auto;
        min-height: 438px;
    }

    /* catalog */
    :host([variant='catalog']) {
        width: var(--consonant-merch-card-catalog-width);
        min-height: 296px;
    }

    :host([variant='catalog'][type='wide']) {
        width: auto;
    }

    :host([variant='catalog'][type='super-wide']) {
        width: auto;
    }

    /* Tablet */
    @media screen and ${v(h)} {
    }

    /* Laptop */
    @media screen and ${v(m)} {
    }
`;var g=b=>`data:image/svg+xml;base64,${btoa(b)}`;var w=`<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="10" height="10" fill="#757575" viewBox="0 0 12 15"><path d="M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z"/></svg>
`;var k=`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" data-name="Group 308011"><circle cx="2" cy="2" r="2" fill="#2c2c2c" data-name="Ellipse 70" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="#2c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="#2c2c2c" data-name="Ellipse 72" transform="translate(0 6)"/></svg>
`;var z=`<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 10 10"><path fill="#fff" d="M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z" class="spectrum-UIIcon--medium"/></svg>
`;var W=["a[href]:not([disabled])","button:not([disabled])","textarea:not([disabled])",'input[type="text"]:not([disabled])','input[type="radio"]:not([disabled])','input[type="checkbox"]:not([disabled])',"select:not([disabled])",'[tabindex]:not([tabindex="-1"]):not([disabled])'].join(", "),[S,C,$,E]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];var A=document.createElement("style");A.innerHTML=`
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

    /* segment */
    --consonant-merch-card-segment-max-width: 378px;

    /* plans */
    --consonant-merch-card-plans-max-width: 302px;
    --consonant-merch-card-plans-icon-size: 40px;

    /* catalog */
    --consonant-merch-card-catalog-width: 300px;
    --consonant-merch-card-catalog-icon-size: 40px;
}

merch-cards {
    display: contents;
}

merch-cards > button {
    grid-column: 1 / span 3;
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

@media screen and ${f} {
    .one-merch-card,
    .two-merch-cards,
    .three-merch-cards,
    .four-merch-cards {
        grid-template-columns: fit-content(100%);
    }
}

/* Tablet */
@media screen and ${h} {
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
@media screen and ${m} {
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
    @media screen and ${u} {
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

merch-card p, merch-card h3, merch-card h4 {
    margin: 0;
}

merch-card [is=inline-price] {
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

merch-card[variant="special-offers"] [slot="list"] ul {
    padding-left: 0;
    padding-bottom: var(--consonant-merch-spacing-xxs);
    margin-top: 0;
    margin-bottom: 0;
    list-style-position: inside;
    list-style-type: '\u2022 ';
}

merch-card[variant="special-offers"] ul li {
    padding-left: 0;
    line-height: var(--consonant-merch-card-body-line-height);
    font-size: var(--consonant-merch-card-body-xxs-font-size);
}

merch-card[variant="special-offers"] ul li ::marker {
    margin-right: 0;
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
`;document.head.appendChild(A);var B="MERCH-CARD",_="merch-card",x=class extends T{static properties={name:{type:String},variant:{type:String},type:{type:String},badgeColor:{type:String,attribute:"badge-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},icons:{type:Array},actionmenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},title:{type:String},description:{type:String},image:{type:String,attribute:"image"},customHr:{type:String,attribute:"hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},evergreen:{type:Boolean},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(t=>{let[a,n]=t.split(":"),o=Number(n);return[a,isNaN(o)?{}:o]})),toAttribute:e=>Object.entries(e).map(([t,a])=>isNaN(a)?t:`${t}:${a}`).join(",")}},types:{type:String,attribute:"types",reflect:!0}};static styles=[y];constructor(){super(),this.filters={},this.types=""}updated(e){e.has("badgeBackgroundColor")&&(this.style.border=`1px solid ${this.badgeBackgroundColor}`)}renderIcons(){return this.icons&&this.icons.length>0?r`
                  <div class="icons">
                      ${this.icons.map(e=>r`<img src="${e.src}" alt="${e.alt}" />`)}
                  </div>
              `:""}createCheckBox(){return this.style.setProperty("--checkmark-image",`url(${g(z)})`),this.checkboxLabel?r`
                  <div class="checkbox-container">
                      <input id="alt-cta" type="checkbox" />
                      <span
                          class="checkmark"
                          @click="${this.toggleCheckBox}"
                      ></span>
                      <label class="checkbox-label"
                          >${this.checkboxLabel}</label
                      >
                  </div>
              `:""}createPlansFooter(){let e=r` <slot name="footer"></slot>`,t=this.secureLabel;return t?r` <div class="standard-wrapper">
                  <div class="secure-transaction-wrapper">
                      <span
                          class="secure-transaction-icon"
                          style="background-image: url('${g(w)}')"
                      ></span>

                      <span class="secure-transaction-label"
                          >${t}</span
                      >
                  </div>
                  ${e}
              </div>`:e}decorateRibbon(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),r`
            <div
                class="${this.variant}-ribbon"
                style="background-color: ${this.badgeBackgroundColor}; color: ${this.badgeColor}; ${e?` ${e}`:""}"
            >
                ${this.badgeText}
            </div>
        `}toggleCheckBox(){let e=this.shadowRoot.querySelector("#alt-cta");e.checked=!e.checked;let t=this.shadowRoot.querySelector('slot[name="footer"]');if(t){let a=t.assignedNodes({flatten:!0}),n,o;a.forEach(s=>{o=s.querySelector(".alt-cta"),n=s.querySelector(".active")}),n&&o&&(n.classList.toggle("button--inactive",e.checked),o.classList.toggle("button--inactive",!e.checked))}}toggleActionMenu(){this.shadowRoot.querySelector('slot[name="action-menu-content"]').classList.toggle("hidden")}get title(){return this.querySelector('[slot="heading-xs"]').textContent.trim()}updateFilters(e){let t={...this.filters};Object.keys(t).forEach(a=>{if(e){t[a]=Math.min(t[a],2);return}let n=t[a];n===1||isNaN(n)||(t[a]=Number(n)+1)}),this.filters=t}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}render(){switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();default:return r` <div />`}}renderSpecialOffer(){return r` <div
                class="image"
                style="${this.image?`background-image: url(${this.image})`:""}"
            >
                ${this.decorateRibbon()}
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
                  `}`}renderSegment(){return r` ${this.decorateRibbon()}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            <slot name="footer"></slot>`}renderPlans(){return r` ${this.decorateRibbon()}
            <div class="body">
                ${this.renderIcons()}
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="body-xs"></slot>
                ${this.createCheckBox()}
            </div>
            ${this.createPlansFooter()}`}renderCatalog(){return r` <div class="body">
                <div class="top-section">
                    ${this.renderIcons()} ${this.decorateRibbon()}
                    <div
                        class="action-menu ${this.actionmenu?"invisible":"hidden"}"
                        style="background-image: url(${g(k)})"
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
            <slot name="footer"></slot>`}connectedCallback(){super.connectedCallback(),this.setAttribute("tabindex","0"),this.addEventListener("keydown",this.keydownHandler)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler)}keydownHandler(e){let t=document.activeElement;if(t&&t.tagName===B){let d=function(c){let i=n.indexOf(c);return{row:Math.floor(i/o),col:i%o}},a,n=Array.from(this.parentElement.querySelectorAll("merch-card")).filter(c=>window.getComputedStyle(c).display!=="none").sort((c,i)=>parseInt(window.getComputedStyle(c).order,0)-parseInt(window.getComputedStyle(i).order,0)),o=1,s=n[0].getBoundingClientRect().top;for(;o<n.length&&n[o].getBoundingClientRect().top===s;)o++;switch(e.code){case S:let c=d(t);c.col>0&&(a=n[c.row*o+(c.col-1)]);break;case C:let i=d(t);i.col<o-1&&(a=n[i.row*o+(i.col+1)]);break;case $:let p=d(t);p.row>0&&(a=n[(p.row-1)*o+p.col]);break;case E:let l=d(t);l.row<Math.floor(n.length/o)-(n.length%o>l.col?0:1)&&(a=n[(l.row+1)*o+l.col]);break}a&&(a.focus(),e.preventDefault())}}};customElements.get(_.toLowerCase())||customElements.define("merch-card",x);export{_ as MERCH_CARD,B as MERCH_CARD_NODE_NAME,x as MerchCard};

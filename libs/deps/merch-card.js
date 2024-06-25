// branch: main commit: fbbefe1b71216b73b1e41d50997927fbc7340473 Tue, 25 Jun 2024 15:33:55 GMT
import{html as a,LitElement as j}from"/libs/deps/lit-all.min.js";import{LitElement as q,html as T,css as F}from"/libs/deps/lit-all.min.js";var s=class extends q{static properties={size:{type:String,attribute:!0},src:{type:String,attribute:!0},alt:{type:String,attribute:!0},href:{type:String,attribute:!0}};constructor(){super(),this.size="m",this.alt=""}render(){let{href:e}=this;return e?T`<a href="${e}">
                  <img src="${this.src}" alt="${this.alt}" loading="lazy" />
              </a>`:T` <img src="${this.src}" alt="${this.alt}" loading="lazy" />`}static styles=F`
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

        :host([size='l']) {
            --img-width: 40px;
            --img-height: 40px;
        }

        img {
            width: var(--img-width);
            height: var(--img-height);
        }
    `};customElements.define("merch-icon",s);import{css as k,unsafeCSS as u}from"/libs/deps/lit-all.min.js";var f="(max-width: 767px)",y="(max-width: 1199px)",i="(min-width: 768px)",c="(min-width: 1200px)",h="(min-width: 1600px)";var A=k`
    :host {
        position: relative;
        display: flex;
        flex-direction: column;
        text-align: start;
        background-color: var(--consonant-merch-card-background-color);
        grid-template-columns: repeat(auto-fit, minmax(300px, max-content));
        background-color: var(--consonant-merch-card-background-color);
        font-family: var(--body-font-family, 'Adobe Clean');
        border-radius: var(--consonant-merch-spacing-xs);
        border: 1px solid var(--consonant-merch-card-border-color);
        box-sizing: border-box;
    }

    :host(.placeholder) {
        visibility: hidden;
    }

    :host([variant='special-offers']) {
        min-height: 439px;
    }

    :host([variant='catalog']) {
        min-height: 330px;
    }

    :host([variant='plans']) {
        min-height: 348px;
    }

    :host([variant='segment']) {
        min-height: 214px;
    }

    :host([aria-selected]) {
        outline: none;
        box-sizing: border-box;
        box-shadow: inset 0 0 0 2px var(--color-accent);
    }

    .invisible {
        visibility: hidden;
    }

    :host(:hover) .invisible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
        cursor: pointer;
    }

    .action-menu.always-visible {
        visibility: visible;
        background-image: var(--ellipsis-icon);
    }

    :host([variant='mini-compare-chart']) > slot:not([name='icons']) {
        display: block;
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
        background-color: var(--color-gray-200);
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

    .body .catalog-badge {
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
        flex: 1;
        height: 100%;
        line-height: normal;
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

    .twp-badge {
        padding: 4px 10px 5px 10px;
    }

    :host([aria-selected]) .twp-badge {
        margin-inline-end: 2px;
        padding-inline-end: 9px;
    }

    :host([variant='twp']) {
        padding: 4px 10px 5px 10px;
    }

    slot[name='icons'] {
        display: flex;
        gap: 8px;
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

    :host([variant='twp']) footer {
        gap: var(--consonant-merch-spacing-xxs);
        flex-direction: column;
        align-self: flex-start;
    }

    :host([variant='special-offers'].center) {
        text-align: center;
    }

    /* plans */
    :host([variant='plans']) {
        min-height: 348px;
    }

    :host([variant='mini-compare-chart']) footer {
        min-height: var(--consonant-merch-card-mini-compare-footer-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    /* mini-compare card  */
    :host([variant='mini-compare-chart']) .top-section {
        padding-top: var(--consonant-merch-spacing-s);
        padding-inline-start: var(--consonant-merch-spacing-s);
        height: var(--consonant-merch-card-mini-compare-top-section-height);
    }

    @media screen and ${u(y)} {
        [class*'-merch-cards'] :host([variant='mini-compare-chart']) footer {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
        }
    }

    @media screen and ${u(f)} {
        :host([variant='mini-compare-chart']) .top-section {
            padding-top: var(--consonant-merch-spacing-xs);
        }
        :host([variant='mini-compare-chart']) .mini-compare-chart-badge {
            font-size: var(--consonant-merch-card-detail-font-size);
            padding: 6px 8px;
            top: 10px;
        }
    }
    @media screen and ${u(c)} {
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
        min-height: var(--consonant-merch-card-mini-compare-heading-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='body-m'] {
        min-height: var(--consonant-merch-card-mini-compare-body-m-height);
    }
    :host([variant='mini-compare-chart']) slot[name='heading-m-price'] {
        min-height: var(
            --consonant-merch-card-mini-compare-heading-m-price-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='price-commitment'] {
        min-height: var(
            --consonant-merch-card-mini-compare-price-commitment-height
        );
    }
    :host([variant='mini-compare-chart']) slot[name='offers'] {
        min-height: var(--consonant-merch-card-mini-compare-offers-height);
    }
    :host([variant='mini-compare-chart']) slot[name='promo-text'] {
        min-height: var(--consonant-merch-card-mini-compare-promo-text-height);
    }

    :host([variant='plans']) ::slotted([slot='heading-xs']),
    :host([variant='segment']) ::slotted([slot='heading-xs']) {
        max-width: var(--consonant-merch-card-heading-xs-max-width, 100%);
    }
`,R=()=>{let p=[k`
        /* Tablet */
        @media screen and ${u(i)} {
            :host([size='wide']),
            :host([size='super-wide']) {
                grid-column: span 2;
                width: 100%;
            }
        }

        /* Laptop */
        @media screen and ${u(c)} {
            :host([size='super-wide']) {
                grid-column: span 3;
            }
        `];return p.push(k`
        /* Large desktop */
        @media screen and ${u(h)} {
            :host([size='super-wide']) {
                grid-column: span 4;
            }
        }
    `),p};var[_,M,O,L,N,te]=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter","Tab"];var P=document.createElement("style");P.innerHTML=`
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
    --consonant-merch-card-promo-text-height: var(--consonant-merch-card-body-font-size);

    /* responsive width */
    --consonant-merch-card-mobile-width: 300px;

    /* spacing */
    --consonant-merch-spacing-xxxs: 4px;
    --consonant-merch-spacing-xxs: 8px;
    --consonant-merch-spacing-xs: 16px;
    --consonant-merch-spacing-s: 24px;
    --consonant-merch-spacing-m: 32px;

    /* cta */
    --consonant-merch-card-cta-font-size: 15px;

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
    --consonant-merch-card-body-s-font-size: 16px;
    --consonant-merch-card-body-s-line-height: 24px;
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
    --merch-color-focus-ring: #1473E6;
    --merch-color-grey-80: #2c2c2c;
    --merch-color-green-promo: #2D9D78;

    /* merch card generic */
    --consonant-merch-card-max-width: 300px;
    --transition: cmax-height 0.3s linear, opacity 0.3s linear;

    /* special offers */
    --consonant-merch-card-special-offers-width: 378px;

    /* image */
    --consonant-merch-card-image-width: 300px;

    /* segment */
    --consonant-merch-card-segment-width: 378px;

    /* inline-heading */
    --consonant-merch-card-inline-heading-width: 300px;

    /* product */
    --consonant-merch-card-product-width: 300px;

    /* plans */
    --consonant-merch-card-plans-width: 300px;
    --consonant-merch-card-plans-icon-size: 40px;

    /* catalog */
    --consonant-merch-card-catalog-width: 276px;
    --consonant-merch-card-catalog-icon-size: 40px;

    /* twp */
    --consonant-merch-card-twp-width: 268px;
    --consonant-merch-card-twp-mobile-width: 300px;
    --consonant-merch-card-twp-mobile-height: 358px;

    /*mini compare chart */
    --consonant-merch-card-mini-compare-chart-icon-size: 32px;
    --consonant-merch-card-mini-compare-mobile-cta-font-size: 15px;
    --consonant-merch-card-mini-compare-mobile-cta-width: 75px;
    --consonant-merch-card-mini-compare-badge-mobile-max-width: 50px;

    /* inline SVGs */
    --checkmark-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3E%3Cpath fill='%23fff' d='M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1 1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712 6A.999.999 0 0 1 3.788 9z' class='spectrum-UIIcon--medium'/%3E%3C/svg%3E%0A");

    --secure-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23757575' viewBox='0 0 12 15'%3E%3Cpath d='M11.5 6H11V5A5 5 0 1 0 1 5v1H.5a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-8a.5.5 0 0 0-.5-.5ZM3 5a3 3 0 1 1 6 0v1H3Zm4 6.111V12.5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1.389a1.5 1.5 0 1 1 2 0Z'/%3E%3C/svg%3E");

    --info-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'><circle cx='18' cy='12' r='2.15'%3E%3C/circle%3E%3Cpath d='M20.333 24H20v-7.6a.4.4 0 0 0-.4-.4h-3.933s-1.167.032-1.167 1 1.167 1 1.167 1H16v6h-.333s-1.167.032-1.167 1 1.167 1 1.167 1h4.667s1.167-.033 1.167-1-1.168-1-1.168-1z'%3E%3C/path%3E%3Cpath d='M18 2.1A15.9 15.9 0 1 0 33.9 18 15.9 15.9 0 0 0 18 2.1zm0 29.812A13.912 13.912 0 1 1 31.913 18 13.912 13.912 0 0 1 18 31.913z'%3E%3C/path%3E%3C/svg%3E");

    --ellipsis-icon: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(6 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" data-name="Ellipse 71" transform="translate(12 6)"/><circle cx="2" cy="2" r="2" fill="%232c2c2c" transform="translate(0 6)"/></svg>');

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
    color: var(--merch-color-grey-80);
    font-size: var(--consonant-merch-card-heading-xs-font-size);
    line-height: var(--consonant-merch-card-heading-xs-line-height);
    margin: 0;
    text-decoration: none;
}

merch-card.dc-pricing [slot='heading-xs'] {
    margin-bottom: var(--consonant-merch-spacing-xxs);
}

merch-card:not([variant='inline-heading']) [slot='heading-xs'] a {
    color: var(--merch-color-grey-80);
}

merch-card [slot='heading-xs'] a:not(:hover) {
    text-decoration: inherit;
}

merch-card [slot='heading-s'] {
    font-size: var(--consonant-merch-card-heading-s-font-size);
    line-height: var(--consonant-merch-card-heading-s-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot='heading-m'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
    font-weight: 700;
}

merch-card [slot='heading-m-price'] {
    font-size: var(--consonant-merch-card-heading-m-font-size);
    line-height: var(--consonant-merch-card-heading-m-line-height);
    padding: 0 var(--consonant-merch-spacing-s);
    font-weight: 700;
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot='offers'] {
    padding: var(--consonant-merch-spacing-xxs) var(--consonant-merch-spacing-s);
}

merch-card [slot='heading-l'] {
    font-size: var(--consonant-merch-card-heading-l-font-size);
    line-height: var(--consonant-merch-card-heading-l-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
}

merch-card [slot='heading-xl'] {
    font-size: var(--consonant-merch-card-heading-xl-font-size);
    line-height: var(--consonant-merch-card-heading-xl-line-height);
    margin: 0;
    color: var(--merch-color-grey-80);
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
    color: var(--merch-color-grey-80);
    margin: 0;
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

merch-card[variant="plans"] [slot="description"] {
    min-height: 84px;
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

merch-card[variant="plans"] [slot="quantity-select"] {
    display: flex;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
    padding: var(--consonant-merch-spacing-xs);
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
    padding: var(--consonant-merch-spacing-s)
    var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
    color: var(--merch-color-grey-80);
    display: flex;
    flex-flow: wrap;
}

merch-card[variant='twp'] merch-quantity-select,
merch-card[variant='twp'] merch-offer-select {
    display: none;
}

[slot="cci-footer"] p,
[slot="cct-footer"] p,
[slot="cce-footer"] p {
    margin: 0;
}

/* mini compare chart card styles */

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

merch-card[variant="mini-compare-chart"] span.placeholder-resolved[data-template="strikethrough"] {
    font-size: var(--consonant-merch-card-body-m-font-size);
    font-weight: 500;
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

merch-card [slot="promo-text"] {
    color: var(--merch-color-green-promo);
    font-size: var(--consonant-merch-card-promo-text-height);
    font-weight: 700;
    line-height: var(--consonant-merch-card-promo-text-height);
    margin: 0;
    min-height: var(--consonant-merch-card-promo-text-height);
    padding: 0;
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

@media screen and ${f} {
    merch-card[variant="mini-compare-chart"] .mini-compare-chart-badge + [slot='heading-m'] {
        margin-top: var(--consonant-merch-spacing-m);
    }

    merch-card[variant="mini-compare-chart"] [slot='heading-m'] {
        padding: 0 var(--consonant-merch-spacing-xs) 0;
        font-size: var(--consonant-merch-card-body-s-font-size);
        line-height: var(--consonant-merch-card-body-s-line-height);
        width: inherit;
    }

    merch-card[variant="mini-compare-chart"] [slot='body-m'] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
        padding: var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="offers"] {
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot='heading-m-price'] {
        font-size: var(--consonant-merch-card-body-s-font-size);
        padding: 0 var(--consonant-merch-spacing-xs) var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="heading-m-price"]:has(+ [slot="footer"]) {
        padding-bottom: 0;
    }

    merch-card[variant="mini-compare-chart"] span.placeholder-resolved[data-template="strikethrough"] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
    }

    merch-card[variant="mini-compare-chart"] [slot="price-commitment"] {
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="body-xxs"] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] [slot="promo-text"] {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        padding: 0 var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] .footer-row-cell {
        flex-direction: column;
        place-items: flex-start;
        gap: 0px;
        padding: var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] .footer-row-icon {
        margin-bottom: var(--consonant-merch-spacing-xs);
    }

    merch-card[variant="mini-compare-chart"] .footer-row-cell-description {
        font-size: var(--consonant-merch-card-body-xs-font-size);
        line-height: var(--consonant-merch-card-body-xs-line-height);
    }
}

div[slot="footer"] {
    display: contents;
}

[slot="footer"] a {
    word-wrap: break-word;
    text-align: center;
}

[slot="footer"] a:not([class]) {
    font-weight: 700;
    font-size: var(--consonant-merch-card-cta-font-size);
}

div[slot='bg-image'] img {
    position: relative;
    width: 100%;
    min-height: var(--consonant-merch-card-image-height);
    max-height: var(--consonant-merch-card-image-height);
    object-fit: cover;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
}

/* Mobile */
@media screen and ${f} {
    :root {
        --consonant-merch-card-mini-compare-chart-width: 142px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 300px;
    }
}


/* Tablet */
@media screen and ${i} {
    :root {
        --consonant-merch-card-catalog-width: 302px;
        --consonant-merch-card-plans-width: 302px;
        --consonant-merch-card-segment-width: 276px;
        --consonant-merch-card-mini-compare-chart-width: 178px;
        --consonant-merch-card-mini-compare-chart-wide-width: 302px;
        --consonant-merch-card-special-offers-width: 302px;
        --consonant-merch-card-twp-width: 268px;
    }
}

/* desktop */
@media screen and ${c} {
    :root {
        --consonant-merch-card-catalog-width: 276px;
        --consonant-merch-card-plans-width: 276px;
        --consonant-merch-card-segment-width: 302px;
        --consonant-merch-card-inline-heading-width: 378px;
        --consonant-merch-card-product-width: 378px;
        --consonant-merch-card-image-width: 378px;
        --consonant-merch-card-mini-compare-chart-width: 378px;
        --consonant-merch-card-mini-compare-chart-wide-width: 484px;
        --consonant-merch-card-twp-width: 268px;
    }
}

/* supported cards */
/* grid style for plans */
.one-merch-card.plans,
.two-merch-cards.plans,
.three-merch-cards.plans,
.four-merch-cards.plans {
    grid-template-columns: var(--consonant-merch-card-plans-width);
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.plans,
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(2, var(--consonant-merch-card-plans-width));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.plans,
    .four-merch-cards.plans {
        grid-template-columns: repeat(3, var(--consonant-merch-card-plans-width));
    }
}

/* Large desktop */
    @media screen and ${h} {
    .four-merch-cards.plans {
        grid-template-columns: repeat(4, var(--consonant-merch-card-plans-width));
    }
}


/* grid style for catalog */
.one-merch-card.catalog,
.two-merch-cards.catalog,
.three-merch-cards.catalog,
.four-merch-cards.catalog {
    grid-template-columns: var(--consonant-merch-card-catalog-width);
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.catalog,
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(2, var(--consonant-merch-card-catalog-width));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.catalog,
    .four-merch-cards.catalog {
        grid-template-columns: repeat(3, var(--consonant-merch-card-catalog-width));
    }
}

/* Large desktop */
    @media screen and ${h} {
    .four-merch-cards.catalog {
        grid-template-columns: repeat(4, var(--consonant-merch-card-catalog-width));
    }
}


/* grid style for special-offers */
.one-merch-card.special-offers,
.two-merch-cards.special-offers,
.three-merch-cards.special-offers,
.four-merch-cards.special-offers {
    grid-template-columns: minmax(300px, var(--consonant-merch-card-special-offers-width));
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.special-offers,
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(2, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.special-offers,
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(3, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}

@media screen and ${h} {
    .four-merch-cards.special-offers {
        grid-template-columns: repeat(4, minmax(300px, var(--consonant-merch-card-special-offers-width)));
    }
}


/* grid style for image */
.one-merch-card.image,
.two-merch-cards.image,
.three-merch-cards.image,
.four-merch-cards.image {
    grid-template-columns: var(--consonant-merch-card-image-width);
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.image,
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(2, var(--consonant-merch-card-image-width));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.image,
    .four-merch-cards.image {
        grid-template-columns: repeat(3, var(--consonant-merch-card-image-width));
    }
}

/* Large desktop */
    @media screen and ${h} {
    .four-merch-cards.image {
        grid-template-columns: repeat(4, var(--consonant-merch-card-image-width));
    }
}


/* grid style for segment */
.one-merch-card.segment,
.two-merch-cards.segment,
.three-merch-cards.segment,
.four-merch-cards.segment {
    grid-template-columns: minmax(276px, var(--consonant-merch-card-segment-width));
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.segment,
    .three-merch-cards.segment,
    .four-merch-cards.segment {
        grid-template-columns: repeat(2, minmax(276px, var(--consonant-merch-card-segment-width)));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.segment {
        grid-template-columns: repeat(3, minmax(276px, var(--consonant-merch-card-segment-width)));
    }

    .four-merch-cards.segment {
        grid-template-columns: repeat(4, minmax(276px, var(--consonant-merch-card-segment-width)));
    }
}


/* grid style for product */
.one-merch-card.product,
.two-merch-cards.product,
.three-merch-cards.product,
.four-merch-cards.product {
    grid-template-columns: var(--consonant-merch-card-product-width);
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.product,
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(2, var(--consonant-merch-card-product-width));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.product,
    .four-merch-cards.product {
        grid-template-columns: repeat(3, var(--consonant-merch-card-product-width));
    }
}

/* Large desktop */
    @media screen and ${h} {
    .four-merch-cards.product {
        grid-template-columns: repeat(4, var(--consonant-merch-card-product-width));
    }
}

/* grid style for twp */
.one-merch-card.twp,
.two-merch-cards.twp,
.three-merch-cards.twp {
    grid-template-columns: var(--consonant-merch-card-image-width);
}

/* Tablet */
@media screen and ${i} {
    .one-merch-card.twp,
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* desktop */
@media screen and ${c} {
    .one-merch-card.twp
    .two-merch-cards.twp {
        grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
    }
    .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Large desktop */
    @media screen and ${h} {
        .one-merch-card.twp
        .two-merch-cards.twp {
            grid-template-columns: repeat(2, var(--consonant-merch-card-twp-width));
        }
        .three-merch-cards.twp {
        grid-template-columns: repeat(3, var(--consonant-merch-card-twp-width));
    }
}

/* Mobile */
@media screen and ${f} {
    .one-merch-card.twp,
    .two-merch-cards.twp,
    .three-merch-cards.twp {
        grid-template-columns: repeat(1, var(--consonant-merch-card-twp-mobile-width));
    }
}

/* grid style for inline-heading */
.one-merch-card.inline-heading,
.two-merch-cards.inline-heading,
.three-merch-cards.inline-heading,
.four-merch-cards.inline-heading {
    grid-template-columns: var(--consonant-merch-card-inline-heading-width);
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.inline-heading,
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(2, var(--consonant-merch-card-inline-heading-width));
    }
}

/* desktop */
@media screen and ${c} {
    .three-merch-cards.inline-heading,
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(3, var(--consonant-merch-card-inline-heading-width));
    }
}

/* Large desktop */
    @media screen and ${h} {
    .four-merch-cards.inline-heading {
        grid-template-columns: repeat(4, var(--consonant-merch-card-inline-heading-width));
    }
}

/* grid style for mini-compare-chart */
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

@media screen and ${f} {
    .two-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

@media screen and ${y} {
    .three-merch-cards.mini-compare-chart merch-card [slot="footer"] a,
    .four-merch-cards.mini-compare-chart merch-card [slot="footer"] a {
        flex: 1;
    }
}

/* Tablet */
@media screen and ${i} {
    .two-merch-cards.mini-compare-chart {
        grid-template-columns: repeat(2, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
        gap: var(--consonant-merch-spacing-m);
    }

    .three-merch-cards.mini-compare-chart,
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: repeat(3, minmax(var(--consonant-merch-card-mini-compare-chart-width), var(--consonant-merch-card-mini-compare-chart-wide-width)));
    }
}

/* desktop */
@media screen and ${c} {
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

@media screen and ${h} {
    .four-merch-cards.mini-compare-chart {
        grid-template-columns: repeat(4, var(--consonant-merch-card-mini-compare-chart-width));
    }
}

/* mini-compare card footer rows */
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

span[is="inline-price"][data-template='strikethrough'] {
    text-decoration: line-through;
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
`;document.head.appendChild(P);var H="merch-offer-select:ready",B="merch-card:ready";var C="merch-storage:change",z="merch-quantity-selector:change";function D(p){let e=[];function t(r){r.nodeType===Node.TEXT_NODE?e.push(r):r.childNodes.forEach(t)}return t(p),e}var l="MERCH-CARD",g="merch-card",W=32,S="mini-compare-chart",I=p=>`--consonant-merch-card-footer-row-${p}-min-height`,d=class extends j{static properties={name:{type:String,attribute:"name",reflect:!0},variant:{type:String,reflect:!0},size:{type:String,attribute:"size",reflect:!0},badgeColor:{type:String,attribute:"badge-color"},badgeBackgroundColor:{type:String,attribute:"badge-background-color"},badgeText:{type:String,attribute:"badge-text"},actionMenu:{type:Boolean,attribute:"action-menu"},actionMenuContent:{type:String,attribute:"action-menu-content"},customHr:{type:Boolean,attribute:"custom-hr"},detailBg:{type:String,attribute:"detail-bg"},secureLabel:{type:String,attribute:"secure-label"},checkboxLabel:{type:String,attribute:"checkbox-label"},selected:{type:Boolean,attribute:"aria-selected",reflect:!0},storageOption:{type:String,attribute:"storage",reflect:!0},stockOfferOsis:{type:Object,attribute:"stock-offer-osis",converter:{fromAttribute:e=>{let[t,r,n]=e.split(",");return{PUF:t,ABM:r,M2M:n}}}},filters:{type:String,reflect:!0,converter:{fromAttribute:e=>Object.fromEntries(e.split(",").map(t=>{let[r,n,o]=t.split(":"),m=Number(n);return[r,{order:isNaN(m)?void 0:m,size:o}]})),toAttribute:e=>Object.entries(e).map(([t,{order:r,size:n}])=>[t,r,n].filter(o=>o!=null).join(":")).join(",")}},types:{type:String,attribute:"types",reflect:!0},merchOffer:{type:Object}};static styles=[A,...R()];customerSegment;marketSegment;constructor(){super(),this.filters={},this.types="",this.selected=!1}#e;updated(e){e.has("badgeBackgroundColor")&&this.variant!=="twp"&&(this.style.border=`1px solid ${this.badgeBackgroundColor}`),this.updateComplete.then(async()=>{let t=Array.from(this.querySelectorAll('span[is="inline-price"][data-wcs-osi]'));await Promise.all(t.map(r=>r.onceSettled())),this.adjustTitleWidth(),this.adjustMiniCompareBodySlots(),this.adjustMiniCompareFooterRows()})}get evergreen(){return this.classList.contains("intro-pricing")}get stockCheckbox(){return this.checkboxLabel?a`<label id="stock-checkbox">
                    <input type="checkbox" @change=${this.toggleStockOffer}></input>
                    <span></span>
                    ${this.checkboxLabel}
                </label>`:""}get cardImage(){return a` <div class="image">
            <slot name="bg-image"></slot>
            ${this.badge}
        </div>`}get secureLabelFooter(){let e=this.secureLabel?a`<span class="secure-transaction-label"
                  >${this.secureLabel}</span
              >`:"";return a`<footer>${e}<slot name="footer"></slot></footer>`}get miniCompareFooter(){let e=this.secureLabel?a`<slot name="secure-transaction-label">
                  <span class="secure-transaction-label"
                      >${this.secureLabel}</span
                  ></slot
              >`:a`<slot name="secure-transaction-label"></slot>`;return a`<footer>${e}<slot name="footer"></slot></footer>`}get badge(){let e;if(!(!this.badgeBackgroundColor||!this.badgeColor||!this.badgeText))return this.evergreen&&(e=`border: 1px solid ${this.badgeBackgroundColor}; border-right: none;`),a`
            <div
                id="badge"
                class="${this.variant}-badge"
                style="background-color: ${this.badgeBackgroundColor};
                    color: ${this.badgeColor};
                    ${e}"
            >
                ${this.badgeText}
            </div>
        `}get badgeElement(){return this.shadowRoot.getElementById("badge")}getContainer(){return this.closest('[class*="-merch-cards"]')??this.parentElement}get headingmMSlot(){return this.shadowRoot.querySelector('slot[name="heading-m"]').assignedElements()[0]}get footerSlot(){return this.shadowRoot.querySelector('slot[name="footer"]')?.assignedElements()[0]}get price(){return this.headingmMSlot?.querySelector('span[is="inline-price"]')}get checkoutLinks(){return[...this.footerSlot?.querySelectorAll('a[is="checkout-link"]')??[]]}get isMobileOrTablet(){return window.matchMedia("(max-width: 1024px)").matches}async toggleStockOffer({target:e}){if(!this.stockOfferOsis)return;let t=this.checkoutLinks;if(t.length!==0)for(let r of t){await r.onceSettled();let n=r.value?.[0]?.planType;if(!n)return;let o=this.stockOfferOsis[n];if(!o)return;let m=r.dataset.wcsOsi.split(",").filter(v=>v!==o);e.checked&&m.push(o),r.dataset.wcsOsi=m.join(",")}}toggleActionMenu(e){let t=e?.type==="mouseleave"?!0:void 0,r=this.shadowRoot.querySelector('slot[name="action-menu-content"]');r&&r.classList.toggle("hidden",t)}handleQuantitySelection(e){let t=this.checkoutLinks;for(let r of t)r.dataset.quantity=e.detail.option}get titleElement(){return this.variant==="special-offers"?this.querySelector('[slot="detail-m"]'):this.querySelector('[slot="heading-xs"]')}get title(){return this.titleElement?.textContent?.trim()}get description(){return this.querySelector('[slot="body-xs"]')?.textContent?.trim()}updateFilters(e){let t={...this.filters};Object.keys(t).forEach(r=>{if(e){t[r].order=Math.min(t[r].order||2,2);return}let n=t[r].order;n===1||isNaN(n)||(t[r].order=Number(n)+1)}),this.filters=t}includes(e){return this.textContent.match(new RegExp(e,"i"))!==null}render(){if(!(!this.isConnected||this.style.display==="none"))switch(this.variant){case"special-offers":return this.renderSpecialOffer();case"segment":return this.renderSegment();case"plans":return this.renderPlans();case"catalog":return this.renderCatalog();case"image":return this.renderImage();case"product":return this.renderProduct();case"inline-heading":return this.renderInlineHeading();case S:return this.renderMiniCompareChart();case"twp":return this.renderTwp();default:return this.renderProduct()}}renderSpecialOffer(){return a`${this.cardImage}
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
                      ${this.secureLabelFooter}
                  `}`}renderSegment(){return a` ${this.badge}
            <div class="body">
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>
            </div>
            <hr />
            ${this.secureLabelFooter}`}renderPlans(){return a` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>                
                ${this.stockCheckbox}
            </div>
            <slot name="quantity-select"></slot>
            ${this.secureLabelFooter}`}get promoBottom(){return this.classList.contains("promo-bottom")}renderCatalog(){return a` <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot> ${this.badge}
                    <div
                        class="action-menu
                        ${this.isMobileOrTablet&&this.actionMenu?"always-visible":""}
                        ${this.actionMenu?"invisible":"hidden"}"
                        @click="${this.toggleActionMenu}"
                    ></div>
                </div>
                <slot
                    name="action-menu-content"
                    class="action-menu-content
                    ${this.actionMenuContent?"":"hidden"}"
                    >${this.actionMenuContent}</slot
                >
                <slot name="heading-xs"></slot>
                <slot name="heading-m"></slot>
                <slot name="body-xxs"></slot>
                ${this.promoBottom?"":a`<slot name="promo-text"></slot>`}
                <slot name="body-xs"></slot>
                ${this.promoBottom?a`<slot name="promo-text"></slot>`:""}
            </div>
            ${this.secureLabelFooter}`}renderImage(){return a`${this.cardImage}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
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
                      ${this.secureLabelFooter}
                  `}`}renderInlineHeading(){return a` ${this.badge}
            <div class="body">
                <div class="top-section">
                    <slot name="icons"></slot>
                    <slot name="heading-xs"></slot>
                </div>
                <slot name="body-xs"></slot>
            </div>
            ${this.customHr?"":a`<hr />`} ${this.secureLabelFooter}`}renderProduct(){return a` ${this.badge}
            <div class="body">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xxs"></slot>
                <slot name="promo-text"></slot>
                <slot name="body-xs"></slot>
            </div>
            ${this.secureLabelFooter}`}renderMiniCompareChart(){let{badge:e}=this;return a` <div class="top-section${e?" badge":""}">
                <slot name="icons"></slot> ${e}
            </div>
            <slot name="heading-m"></slot>
            <slot name="body-m"></slot>
            <slot name="heading-m-price"></slot>
            <slot name="body-xxs"></slot>
            <slot name="price-commitment"></slot>
            <slot name="offers"></slot>
            <slot name="promo-text"></slot>
            ${this.miniCompareFooter}
            <slot name="footer-rows"><slot name="body-s"></slot></slot>`}renderTwp(){return a`${this.badge}
            <div class="top-section">
                <slot name="icons"></slot>
                <slot name="heading-xs"></slot>
                <slot name="body-xs-top"></slot>
            </div>
            <div class="body">
                <slot name="body-xs"></slot>
            </div>
            <footer><slot name="footer"></slot></footer>`}connectedCallback(){super.connectedCallback(),this.#e=this.getContainer(),this.setAttribute("tabindex",this.getAttribute("tabindex")??"0"),this.addEventListener("keydown",this.keydownHandler),this.addEventListener("mouseleave",this.toggleActionMenu),this.addEventListener(z,this.handleQuantitySelection),this.addEventListener(H,this.merchCardReady,{once:!0}),this.updateComplete.then(()=>{this.merchCardReady()}),this.storageOptions?.addEventListener("change",this.handleStorageChange)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("keydown",this.keydownHandler),this.removeEventListener(z,this.handleQuantitySelection),this.storageOptions?.removeEventListener(C,this.handleStorageChange)}appendInvisibleSpacesToFooterLinks(){[...this.querySelectorAll('[slot="footer"] a')].forEach(e=>{D(e).forEach(r=>{let m=r.textContent.split(" ").map(v=>v.match(/.{1,7}/g)?.join("\u200B")).join(" ");r.textContent=m})})}keydownHandler(e){let t=document.activeElement?.closest(l);if(!t)return;function r(b,E){let x=document.elementFromPoint(b,E)?.closest(l);x&&(t.selected=!1,e.preventDefault(),e.stopImmediatePropagation(),x.focus(),x.selected=!0,x.scrollIntoView({behavior:"smooth",block:"center"}))}let{x:n,y:o,width:m,height:v}=t.getBoundingClientRect(),w=64,{code:$}=e;if($==="Tab"){let b=Array.from(this.querySelectorAll('a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select')),E=b[0],x=b[b.length-1];(!e.shiftKey&&document.activeElement===x||e.shiftKey&&document.activeElement===E)&&(e.preventDefault(),e.stopImmediatePropagation())}else switch($){case _:r(n-w,o);break;case M:r(n+m+w,o);break;case O:r(n,o-w);break;case L:r(n,o+v+w);break;case N:if(this.variant==="twp")return;this.footerSlot?.querySelector("a")?.click();break}}updateMiniCompareElementMinHeight(e,t){let r=`--consonant-merch-card-mini-compare-${t}-height`,n=Math.max(0,parseInt(window.getComputedStyle(e).height)||0),o=parseInt(this.#e.style.getPropertyValue(r))||0;n>o&&this.#e.style.setProperty(r,`${n}px`)}async adjustTitleWidth(){if(!["segment","plans"].includes(this.variant))return;let e=this.getBoundingClientRect().width,t=this.badgeElement?.getBoundingClientRect().width||0;e===0||t===0||this.style.setProperty("--consonant-merch-card-heading-xs-max-width",`${Math.round(e-t-16)}px`)}async adjustMiniCompareBodySlots(){if(this.variant!==S||this.getBoundingClientRect().width===0)return;this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(".top-section"),"top-section"),["heading-m","body-m","heading-m-price","price-commitment","offers","promo-text","secure-transaction-label"].forEach(r=>this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector(`slot[name="${r}"]`),r)),this.updateMiniCompareElementMinHeight(this.shadowRoot.querySelector("footer"),"footer");let t=this.shadowRoot.querySelector(".mini-compare-chart-badge");t&&t.textContent!==""&&this.#e.style.setProperty("--consonant-merch-card-mini-compare-top-section-mobile-height","32px")}adjustMiniCompareFooterRows(){if(this.variant!==S||this.getBoundingClientRect().width===0)return;[...this.querySelector('[slot="footer-rows"]').children].forEach((t,r)=>{let n=Math.max(W,parseInt(window.getComputedStyle(t).height)||0),o=parseInt(this.#e.style.getPropertyValue(I(r+1)))||0;n>o&&this.#e.style.setProperty(I(r+1),`${n}px`)})}get storageOptions(){return this.querySelector("sp-radio-group#storage")}get storageSpecificOfferSelect(){let e=this.storageOptions?.selected;if(e){let t=this.querySelector(`merch-offer-select[storage="${e}"]`);if(t)return t}return this.querySelector("merch-offer-select")}get offerSelect(){return this.storageOptions?this.storageSpecificOfferSelect:this.querySelector("merch-offer-select")}get quantitySelect(){return this.querySelector("merch-quantity-select")}merchCardReady(){this.offerSelect&&!this.offerSelect.planType||this.dispatchEvent(new CustomEvent(B,{bubbles:!0}))}handleStorageChange(){let e=this.closest("merch-card")?.offerSelect.cloneNode(!0);e&&this.dispatchEvent(new CustomEvent(C,{detail:{offerSelect:e},bubbles:!0}))}get dynamicPrice(){return this.querySelector('[slot="price"]')}selectMerchOffer(e){if(e===this.merchOffer)return;this.merchOffer=e;let t=this.dynamicPrice;if(e.price&&t){let r=e.price.cloneNode(!0);t.onceSettled?t.onceSettled().then(()=>{t.replaceWith(r)}):t.replaceWith(r)}}};customElements.define(g,d);
//# sourceMappingURL=merch-card.js.map
